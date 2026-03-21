#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <signal.h>
#include <time.h>
#include <pthread.h>
#include <sys/stat.h>
#include <sys/time.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <netinet/in.h>
#include <fcntl.h>
#include <errno.h>

/**
 * Proxy Health Monitor
 * ---------------------
 * Lightweight daemon that continuously monitors verified proxies.
 * Runs between proxy_scraper cycles to keep the proxy list fresh.
 *
 * - Reads proxies.html every CHECK_INTERVAL seconds
 * - Pings each proxy via SOCKS5 handshake + TCP connect to tianditu
 * - Removes dead proxies immediately
 * - Re-sorts by current speed (network conditions change)
 * - Writes updated proxies.html atomically
 *
 * Build: gcc -O3 -Wall -pthread -o proxy_monitor proxy_monitor.c
 */

#define PROXY_FILE       "proxies.html"
#define CHECK_INTERVAL   30      /* seconds between full health checks */
#define CONNECT_TIMEOUT  6       /* seconds per proxy connect attempt */
#define SOCKS5_TIMEOUT   8       /* seconds for full SOCKS5 handshake */
#define MAX_PROXIES      64
#define TEST_HOST        "map.tianditu.gov.cn"
#define TEST_PORT        443

typedef struct {
    char host[64];
    int  port;
    double latency;   /* last measured, seconds */
    int  alive;
} Proxy;

static Proxy g_proxies[MAX_PROXIES];
static int   g_count = 0;
static time_t g_file_mtime = 0;
static volatile int g_running = 1;

static void sig_handler(int sig) {
    (void)sig;
    g_running = 0;
}

/* --- Non-blocking connect with timeout --- */

static int connect_timeout(const char *host, int port, int timeout_s) {
    int fd = socket(AF_INET, SOCK_STREAM, 0);
    if (fd < 0) return -1;

    struct sockaddr_in addr;
    memset(&addr, 0, sizeof(addr));
    addr.sin_family = AF_INET;
    addr.sin_port = htons(port);
    if (inet_pton(AF_INET, host, &addr.sin_addr) != 1) {
        close(fd);
        return -1;
    }

    /* Set non-blocking */
    int flags = fcntl(fd, F_GETFL, 0);
    fcntl(fd, F_SETFL, flags | O_NONBLOCK);

    int ret = connect(fd, (struct sockaddr *)&addr, sizeof(addr));
    if (ret == 0) {
        fcntl(fd, F_SETFL, flags); /* restore blocking */
        return fd;
    }
    if (errno != EINPROGRESS) {
        close(fd);
        return -1;
    }

    fd_set wfds;
    struct timeval tv = { .tv_sec = timeout_s, .tv_usec = 0 };
    FD_ZERO(&wfds);
    FD_SET(fd, &wfds);

    ret = select(fd + 1, NULL, &wfds, NULL, &tv);
    if (ret <= 0) {
        close(fd);
        return -1;
    }

    int err = 0;
    socklen_t elen = sizeof(err);
    getsockopt(fd, SOL_SOCKET, SO_ERROR, &err, &elen);
    if (err) {
        close(fd);
        return -1;
    }

    fcntl(fd, F_SETFL, flags); /* restore blocking */

    /* Set recv timeout */
    tv.tv_sec = SOCKS5_TIMEOUT;
    tv.tv_usec = 0;
    setsockopt(fd, SOL_SOCKET, SO_RCVTIMEO, &tv, sizeof(tv));
    setsockopt(fd, SOL_SOCKET, SO_SNDTIMEO, &tv, sizeof(tv));

    return fd;
}

/* --- SOCKS5 health probe --- */

/**
 * Perform a SOCKS5 handshake and CONNECT to TEST_HOST:TEST_PORT.
 * Returns latency in seconds, or -1 on failure.
 * Does NOT send any HTTP data — just proves the tunnel works.
 */
static double probe_proxy(const char *host, int port) {
    struct timeval t0, t1;
    gettimeofday(&t0, NULL);

    int fd = connect_timeout(host, port, CONNECT_TIMEOUT);
    if (fd < 0) return -1;

    /* SOCKS5 greeting */
    unsigned char greet[] = { 0x05, 0x01, 0x00 };
    if (send(fd, greet, 3, 0) != 3) { close(fd); return -1; }

    unsigned char resp[2];
    if (recv(fd, resp, 2, 0) != 2 || resp[0] != 0x05 || resp[1] != 0x00) {
        close(fd);
        return -1;
    }

    /* SOCKS5 CONNECT to test host */
    const char *dest = TEST_HOST;
    size_t dlen = strlen(dest);
    unsigned char req[4 + 1 + 256 + 2];
    req[0] = 0x05;
    req[1] = 0x01;
    req[2] = 0x00;
    req[3] = 0x03;
    req[4] = (unsigned char)dlen;
    memcpy(req + 5, dest, dlen);
    req[5 + dlen] = (TEST_PORT >> 8) & 0xFF;
    req[5 + dlen + 1] = TEST_PORT & 0xFF;
    size_t req_len = 5 + dlen + 2;

    if (send(fd, req, req_len, 0) != (ssize_t)req_len) { close(fd); return -1; }

    unsigned char cresp[4];
    if (recv(fd, cresp, 4, 0) != 4 || cresp[1] != 0x00) { close(fd); return -1; }

    /* Consume bound address */
    if (cresp[3] == 0x01) {
        unsigned char skip[6]; recv(fd, skip, 6, 0);
    } else if (cresp[3] == 0x03) {
        unsigned char dl; recv(fd, &dl, 1, 0);
        unsigned char skip[258]; recv(fd, skip, dl + 2, 0);
    } else if (cresp[3] == 0x04) {
        unsigned char skip[18]; recv(fd, skip, 18, 0);
    }

    close(fd);

    gettimeofday(&t1, NULL);
    double elapsed = (t1.tv_sec - t0.tv_sec) + (t1.tv_usec - t0.tv_usec) / 1000000.0;
    return elapsed;
}

/* --- File I/O --- */

static int load_proxies(void) {
    struct stat st;
    if (stat(PROXY_FILE, &st) != 0) return -1;
    if (st.st_mtime == g_file_mtime && g_count > 0) return 0; /* unchanged */

    FILE *fp = fopen(PROXY_FILE, "r");
    if (!fp) return -1;

    int count = 0;
    char line[128];
    while (fgets(line, sizeof(line), fp) && count < MAX_PROXIES) {
        char *colon = strchr(line, ':');
        if (!colon) continue;
        *colon = '\0';

        char *host = line;
        while (*host == ' ' || *host == '\t') host++;
        char *end = host + strlen(host) - 1;
        while (end > host && (*end == '\n' || *end == '\r' || *end == ' ')) *end-- = '\0';

        int port = atoi(colon + 1);
        if (port <= 0 || port > 65535 || strlen(host) < 7) continue;

        strncpy(g_proxies[count].host, host, sizeof(g_proxies[count].host) - 1);
        g_proxies[count].host[sizeof(g_proxies[count].host) - 1] = '\0';
        g_proxies[count].port = port;
        g_proxies[count].latency = -1;
        g_proxies[count].alive = 1;
        count++;
    }
    fclose(fp);

    g_count = count;
    g_file_mtime = st.st_mtime;
    printf("[monitor] Loaded %d proxies from %s\n", count, PROXY_FILE);
    return count;
}

static void write_proxies(void) {
    /* Write atomically: write to tmp, then rename */
    const char *tmp = PROXY_FILE ".tmp";
    FILE *fp = fopen(tmp, "w");
    if (!fp) { perror("[monitor] write failed"); return; }

    int written = 0;
    for (int i = 0; i < g_count; i++) {
        if (g_proxies[i].alive) {
            fprintf(fp, "%s:%d\n", g_proxies[i].host, g_proxies[i].port);
            written++;
        }
    }
    fclose(fp);
    rename(tmp, PROXY_FILE);
    /* Update mtime so we don't immediately reload our own write */
    struct stat st;
    if (stat(PROXY_FILE, &st) == 0) g_file_mtime = st.st_mtime;
    printf("[monitor] Wrote %d alive proxies\n", written);
}

/* --- Health check cycle (threaded) --- */

typedef struct {
    int idx;
} ProbeArg;

static void *probe_thread(void *arg) {
    ProbeArg *pa = (ProbeArg *)arg;
    int i = pa->idx;
    free(pa);

    double lat = probe_proxy(g_proxies[i].host, g_proxies[i].port);
    if (lat > 0) {
        g_proxies[i].latency = lat;
        g_proxies[i].alive = 1;
    } else {
        g_proxies[i].alive = 0;
        printf("[monitor] DEAD: %s:%d\n", g_proxies[i].host, g_proxies[i].port);
    }
    return NULL;
}

static int latency_cmp(const void *a, const void *b) {
    const Proxy *pa = (const Proxy *)a;
    const Proxy *pb = (const Proxy *)b;
    /* Dead proxies sort to end */
    if (!pa->alive && !pb->alive) return 0;
    if (!pa->alive) return 1;
    if (!pb->alive) return -1;
    if (pa->latency < pb->latency) return -1;
    if (pa->latency > pb->latency) return 1;
    return 0;
}

static void run_health_check(void) {
    if (g_count == 0) return;

    pthread_t threads[MAX_PROXIES];
    int nthreads = 0;

    for (int i = 0; i < g_count && nthreads < MAX_PROXIES; i++) {
        ProbeArg *pa = malloc(sizeof(ProbeArg));
        pa->idx = i;
        if (pthread_create(&threads[nthreads], NULL, probe_thread, pa) == 0) {
            nthreads++;
        } else {
            free(pa);
        }
    }

    for (int i = 0; i < nthreads; i++) {
        pthread_join(threads[i], NULL);
    }

    /* Sort by latency (fastest alive first) */
    qsort(g_proxies, g_count, sizeof(Proxy), latency_cmp);

    /* Count alive */
    int alive = 0;
    for (int i = 0; i < g_count; i++) {
        if (g_proxies[i].alive) alive++;
    }

    /* Only rewrite if something changed */
    int dead = g_count - alive;
    if (dead > 0 || alive > 0) {
        printf("[monitor] Health check: %d alive, %d dead\n", alive, dead);
        if (dead > 0) {
            write_proxies();
        }
    }
}

/* --- Main --- */

#ifndef TEST_MAIN
int main(void) {
    signal(SIGINT, sig_handler);
    signal(SIGTERM, sig_handler);
    signal(SIGPIPE, SIG_IGN);

    printf("[monitor] Proxy Health Monitor starting (check every %ds)\n", CHECK_INTERVAL);

    load_proxies();

    while (g_running) {
        /* Reload if file changed (e.g., proxy_scraper wrote new list) */
        load_proxies();

        /* Run health check on all proxies */
        run_health_check();

        /* Sleep until next check */
        for (int s = 0; s < CHECK_INTERVAL && g_running; s++) {
            sleep(1);
        }
    }

    printf("[monitor] Shutting down.\n");
    return 0;
}
#endif /* TEST_MAIN */
