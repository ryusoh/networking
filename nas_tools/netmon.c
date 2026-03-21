/**
 * Network Monitor
 * ---------------
 * Continuous ping with live statistics: min/max/avg, jitter, packet loss.
 * Shows a rolling sparkline of recent latency.
 *
 * Build: gcc -O3 -Wall -o netmon netmon.c
 * Resolves device names from ~/.config/lan/devices (saved by lan_scanner).
 *
 * Usage: sudo ./netmon nas                 # by saved name
 *        sudo ./netmon 10.0.0.2            # by IP
 *        sudo ./netmon router -c 50        # stop after 50 pings
 *        sudo ./netmon nas -i 0.5          # ping every 0.5s
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <signal.h>
#include <math.h>
#include <time.h>
#include <arpa/inet.h>
#include <netinet/ip_icmp.h>
#include <sys/socket.h>
#include <sys/time.h>
#include "devices.h"

#define HISTORY_LEN 60
#define SPARK_CHARS 8

static volatile int g_running = 1;

static void sig_handler(int sig) { (void)sig; g_running = 0; }

static unsigned short icmp_cksum(void *data, int len) {
    unsigned short *buf = data;
    unsigned int sum = 0;
    for (; len > 1; len -= 2) sum += *buf++;
    if (len == 1) sum += *(unsigned char *)buf;
    sum = (sum >> 16) + (sum & 0xFFFF);
    sum += (sum >> 16);
    return (unsigned short)(~sum);
}

static double ping_once(const char *ip, int seq) {
    int fd = socket(AF_INET, SOCK_DGRAM, IPPROTO_ICMP);
    if (fd < 0) {
        fd = socket(AF_INET, SOCK_RAW, IPPROTO_ICMP);
        if (fd < 0) return -1;
    }

    struct timeval tv = { .tv_sec = 2, .tv_usec = 0 };
    setsockopt(fd, SOL_SOCKET, SO_RCVTIMEO, &tv, sizeof(tv));

    struct sockaddr_in addr;
    memset(&addr, 0, sizeof(addr));
    addr.sin_family = AF_INET;
    inet_pton(AF_INET, ip, &addr.sin_addr);

    struct {
        struct icmp hdr;
        char data[32];
    } pkt;
    memset(&pkt, 0, sizeof(pkt));
    pkt.hdr.icmp_type = ICMP_ECHO;
    pkt.hdr.icmp_code = 0;
    pkt.hdr.icmp_id = htons(getpid() & 0xFFFF);
    pkt.hdr.icmp_seq = htons(seq);
    memset(pkt.data, 0x42, sizeof(pkt.data));
    pkt.hdr.icmp_cksum = icmp_cksum(&pkt, sizeof(pkt));

    struct timeval t0, t1;
    gettimeofday(&t0, NULL);

    ssize_t sent = sendto(fd, &pkt, sizeof(pkt), 0,
                          (struct sockaddr *)&addr, sizeof(addr));
    if (sent <= 0) { close(fd); return -1; }

    char buf[256];
    struct sockaddr_in from;
    socklen_t flen = sizeof(from);
    ssize_t n = recvfrom(fd, buf, sizeof(buf), 0,
                         (struct sockaddr *)&from, &flen);
    close(fd);
    if (n <= 0) return -1;

    gettimeofday(&t1, NULL);
    return (t1.tv_sec - t0.tv_sec) * 1000.0 +
           (t1.tv_usec - t0.tv_usec) / 1000.0;
}

/* Sparkline using Unicode block characters */
static void sparkline(const double *vals, int count, double max_val) {
    /* ▁▂▃▄▅▆▇█ */
    const char *blocks[] = {"▁","▂","▃","▄","▅","▆","▇","█"};

    if (max_val <= 0) max_val = 1;
    for (int i = 0; i < count; i++) {
        if (vals[i] < 0) {
            printf("✕");
        } else {
            int idx = (int)(vals[i] / max_val * 7);
            if (idx > 7) idx = 7;
            printf("%s", blocks[idx]);
        }
    }
}

int main(int argc, char *argv[]) {
    if (argc < 2) {
        printf("Usage: %s <device|IP> [-c count] [-i interval_sec]\n", argv[0]);
        printf("  device    Device name from lan_scanner (e.g. 'router')\n");
        printf("  IP        Or direct IP address\n");
        return 1;
    }

    signal(SIGINT, sig_handler);
    signal(SIGTERM, sig_handler);

    const char *target = argv[1];
    const char *display_name = target;
    int max_count = 0;
    double interval = 1.0;

    /* Resolve device name to IP */
    Device devs[MAX_DEVICES];
    int dev_count = devices_load(devs, MAX_DEVICES);
    const Device *d = devices_find(devs, dev_count, target);
    if (d) {
        target = d->ip;
        display_name = d->name;
        printf("[netmon] Resolved '%s' -> %s\n", d->name, d->ip);
    }

    for (int i = 2; i < argc; i++) {
        if (strcmp(argv[i], "-c") == 0 && i + 1 < argc)
            max_count = atoi(argv[++i]);
        else if (strcmp(argv[i], "-i") == 0 && i + 1 < argc)
            interval = atof(argv[++i]);
    }

    printf("[netmon] Monitoring %s (%s, interval %.1fs", display_name, target, interval);
    if (max_count > 0) printf(", count %d", max_count);
    printf(")\n\n");

    double history[HISTORY_LEN];
    int hist_count = 0;
    int hist_pos = 0;

    double rtt_min = 1e9, rtt_max = 0, rtt_sum = 0;
    double prev_rtt = -1;
    double jitter_sum = 0;
    int sent = 0, received = 0;

    while (g_running && (max_count == 0 || sent < max_count)) {
        sent++;
        double rtt = ping_once(target, sent);

        /* Update history ring buffer */
        history[hist_pos] = rtt;
        hist_pos = (hist_pos + 1) % HISTORY_LEN;
        if (hist_count < HISTORY_LEN) hist_count++;

        if (rtt >= 0) {
            received++;
            if (rtt < rtt_min) rtt_min = rtt;
            if (rtt > rtt_max) rtt_max = rtt;
            rtt_sum += rtt;

            if (prev_rtt >= 0)
                jitter_sum += fabs(rtt - prev_rtt);
            prev_rtt = rtt;
        }

        double loss = (sent - received) * 100.0 / sent;
        double avg = received > 0 ? rtt_sum / received : 0;
        double jitter = received > 1 ? jitter_sum / (received - 1) : 0;

        /* Build ordered history for sparkline display */
        int spark_count = hist_count < 30 ? hist_count : 30;
        double spark_vals[30];
        double spark_max = 0;
        for (int i = 0; i < spark_count; i++) {
            int idx = (hist_pos - spark_count + i + HISTORY_LEN) % HISTORY_LEN;
            spark_vals[i] = history[idx];
            if (history[idx] > spark_max) spark_max = history[idx];
        }

        /* Print live line */
        printf("\r\033[K");  /* clear line */
        if (rtt >= 0)
            printf("seq=%d  rtt=%.1fms  ", sent, rtt);
        else
            printf("seq=%d  timeout     ", sent);

        printf("min/avg/max=%.1f/%.1f/%.1fms  jitter=%.1fms  loss=%.0f%%  ",
               received > 0 ? rtt_min : 0, avg,rtt_max, jitter, loss);

        sparkline(spark_vals, spark_count, spark_max);
        fflush(stdout);

        /* Sleep for interval */
        if (g_running && (max_count == 0 || sent < max_count)) {
            struct timespec ts;
            ts.tv_sec = (time_t)interval;
            ts.tv_nsec = (long)((interval - (double)ts.tv_sec) * 1e9);
            nanosleep(&ts, NULL);
        }
    }

    /* Final summary */
    double loss = (sent - received) * 100.0 / sent;
    double avg = received > 0 ? rtt_sum / received : 0;
    double jitter = received > 1 ? jitter_sum / (received - 1) : 0;

    printf("\n\n--- %s statistics ---\n", target);
    printf("%d packets sent, %d received, %.1f%% loss\n", sent, received, loss);
    if (received > 0)
        printf("rtt min/avg/max = %.1f/%.1f/%.1f ms, jitter = %.1f ms\n",
               rtt_min, avg, rtt_max, jitter);

    return received > 0 ? 0 : 1;
}
