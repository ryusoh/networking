#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <pthread.h>
#include <time.h>
#include <sys/time.h>
#include <sys/socket.h>
#include <sys/stat.h>
#include <arpa/inet.h>
#include <netinet/in.h>
#include <fcntl.h>
#include <errno.h>
#include <curl/curl.h>

/**
 * NAS Proxy Scraper + Verifier (All-in-One)
 * ------------------------------------------
 * 1. Scrapes Chinese exit proxies from multiple APIs
 * 2. Health-checks each proxy against tianditu.gov.cn (concurrent)
 * 3. Speed-tests and sorts (fastest first)
 * 4. Writes verified proxies to proxies.html
 * 5. Writes V2Ray config to config/proxies.json
 *
 * Replaces both the old proxy_scraper.c AND updater.py.
 *
 * Build: gcc -O3 -Wall -o proxy_scraper proxy_scraper.c -lcurl -lpthread
 */

#define MAX_PROXIES       500
#define MAX_WORKERS       40
#define MAX_WORKING       10
#define CONNECT_TIMEOUT   8
#define TEST_TIMEOUT      12
#define TEST_URL          "https://map.tianditu.gov.cn/"
#define OUTPUT_FILE       "proxies.html"
#define V2RAY_CONFIG      "config/proxies.json"

/* --- Proxy storage --- */

typedef struct {
    char host[64];
    int  port;
    double speed;    /* seconds, -1 = untested, 0 = dead */
    int  verified;
} ProxyEntry;

static ProxyEntry g_proxies[MAX_PROXIES];
static int g_proxy_count = 0;
static pthread_mutex_t g_lock = PTHREAD_MUTEX_INITIALIZER;

static int add_proxy(const char *host, int port) {
    pthread_mutex_lock(&g_lock);
    /* Deduplicate */
    for (int i = 0; i < g_proxy_count; i++) {
        if (strcmp(g_proxies[i].host, host) == 0 && g_proxies[i].port == port) {
            pthread_mutex_unlock(&g_lock);
            return 0;
        }
    }
    if (g_proxy_count >= MAX_PROXIES) {
        pthread_mutex_unlock(&g_lock);
        return -1;
    }
    ProxyEntry *e = &g_proxies[g_proxy_count++];
    strncpy(e->host, host, sizeof(e->host) - 1);
    e->host[sizeof(e->host) - 1] = '\0';
    e->port = port;
    e->speed = -1;
    e->verified = 0;
    pthread_mutex_unlock(&g_lock);
    return 1;
}

/* --- curl helpers --- */

struct MemBuf {
    char *data;
    size_t size;
};

static size_t write_cb(void *ptr, size_t size, size_t nmemb, void *userp) {
    size_t total = size * nmemb;
    struct MemBuf *buf = (struct MemBuf *)userp;
    char *p = realloc(buf->data, buf->size + total + 1);
    if (!p) return 0;
    buf->data = p;
    memcpy(buf->data + buf->size, ptr, total);
    buf->size += total;
    buf->data[buf->size] = '\0';
    return total;
}

/* --- User-Agent rotation --- */

static const char *USER_AGENTS[] = {
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",
};
#define NUM_UAS (sizeof(USER_AGENTS) / sizeof(USER_AGENTS[0]))

static const char *random_ua(void) {
    return USER_AGENTS[rand() % NUM_UAS];
}

/* --- Retry with backoff helper --- */

#define MAX_RETRIES 3

static CURLcode fetch_with_retry(CURL *c, const char *label) {
    CURLcode res;
    for (int attempt = 0; attempt < MAX_RETRIES; attempt++) {
        if (attempt > 0) {
            int delay = attempt * 2 + (rand() % 3); /* 2-4s, 4-6s */
            printf("[retry] %s: attempt %d/%d (waiting %ds)\n", label, attempt + 1, MAX_RETRIES, delay);
            sleep(delay);
            curl_easy_setopt(c, CURLOPT_USERAGENT, random_ua());
        }
        res = curl_easy_perform(c);
        if (res == CURLE_OK) {
            long code;
            curl_easy_getinfo(c, CURLINFO_RESPONSE_CODE, &code);
            if (code == 200) return res;
            if (code != 403 && code != 429 && code != 503) return res; /* non-retryable */
            printf("[retry] %s: HTTP %ld, retrying...\n", label, code);
        } else {
            return res; /* network error, don't retry */
        }
    }
    return res;
}

/* --- Phase 1: Scraping --- */

static int scrape_plaintext(const char *url, const char *label) {
    CURL *c = curl_easy_init();
    if (!c) return 0;

    struct MemBuf buf = { .data = malloc(1), .size = 0 };

    curl_easy_setopt(c, CURLOPT_URL, url);
    curl_easy_setopt(c, CURLOPT_WRITEFUNCTION, write_cb);
    curl_easy_setopt(c, CURLOPT_WRITEDATA, &buf);
    curl_easy_setopt(c, CURLOPT_USERAGENT, random_ua());
    curl_easy_setopt(c, CURLOPT_FOLLOWLOCATION, 1L);
    curl_easy_setopt(c, CURLOPT_SSL_VERIFYPEER, 0L);
    curl_easy_setopt(c, CURLOPT_TIMEOUT, 20L);

    CURLcode res = fetch_with_retry(c, label);
    int added = 0;

    if (res == CURLE_OK) {
        long code;
        curl_easy_getinfo(c, CURLINFO_RESPONSE_CODE, &code);
        if (code == 200 && buf.size > 5) {
            /* Parse IP:PORT lines */
            char *line = strtok(buf.data, "\n\r");
            while (line) {
                char ip[64];
                int port;
                if (sscanf(line, "%63[0-9.]:%d", ip, &port) == 2) {
                    if (port > 0 && port <= 65535 &&
                        strncmp(ip, "10.", 3) != 0 &&
                        strncmp(ip, "192.168.", 8) != 0 &&
                        strncmp(ip, "127.", 4) != 0 &&
                        strncmp(ip, "0.", 2) != 0) {
                        if (add_proxy(ip, port) == 1) added++;
                    }
                }
                line = strtok(NULL, "\n\r");
            }
        }
        printf("[scrape] %s: %d new proxies\n", label, added);
    } else {
        printf("[scrape] %s: FAILED (%s)\n", label, curl_easy_strerror(res));
    }

    curl_easy_cleanup(c);
    free(buf.data);
    return added;
}

static int scrape_geonode(const char *url, const char *label) {
    CURL *c = curl_easy_init();
    if (!c) return 0;

    struct MemBuf buf = { .data = malloc(1), .size = 0 };

    curl_easy_setopt(c, CURLOPT_URL, url);
    curl_easy_setopt(c, CURLOPT_WRITEFUNCTION, write_cb);
    curl_easy_setopt(c, CURLOPT_WRITEDATA, &buf);
    curl_easy_setopt(c, CURLOPT_USERAGENT, random_ua());
    curl_easy_setopt(c, CURLOPT_FOLLOWLOCATION, 1L);
    curl_easy_setopt(c, CURLOPT_SSL_VERIFYPEER, 0L);
    curl_easy_setopt(c, CURLOPT_TIMEOUT, 20L);

    CURLcode res = fetch_with_retry(c, label);
    int added = 0;

    if (res == CURLE_OK && buf.size > 10) {
        /*
         * Simple JSON parsing for Geonode response.
         * Format: {"data":[{"ip":"1.2.3.4","port":"1080",...}, ...]}
         * We look for "ip":"..." and "port":"..." patterns.
         */
        char *p = buf.data;
        while ((p = strstr(p, "\"ip\":\"")) != NULL) {
            p += 6;
            char *end = strchr(p, '"');
            if (!end) break;
            char ip[64] = {0};
            size_t len = end - p;
            if (len >= sizeof(ip)) { p = end; continue; }
            memcpy(ip, p, len);
            p = end;

            char *port_str = strstr(p, "\"port\":\"");
            if (!port_str) {
                /* Try numeric format: "port":1080 */
                port_str = strstr(p, "\"port\":");
                if (!port_str) break;
                port_str += 7;
            } else {
                port_str += 8;
            }

            int port = atoi(port_str);
            if (port > 0 && port <= 65535) {
                if (add_proxy(ip, port) == 1) added++;
            }
        }
        printf("[scrape] %s: %d new proxies\n", label, added);
    } else {
        printf("[scrape] %s: FAILED\n", label);
    }

    curl_easy_cleanup(c);
    free(buf.data);
    return added;
}

static int scrape_freeproxy_world(const char *url, const char *label) {
    CURL *c = curl_easy_init();
    if (!c) return 0;

    struct MemBuf buf = { .data = malloc(1), .size = 0 };

    curl_easy_setopt(c, CURLOPT_URL, url);
    curl_easy_setopt(c, CURLOPT_WRITEFUNCTION, write_cb);
    curl_easy_setopt(c, CURLOPT_WRITEDATA, &buf);
    curl_easy_setopt(c, CURLOPT_USERAGENT, random_ua());
    curl_easy_setopt(c, CURLOPT_FOLLOWLOCATION, 1L);
    curl_easy_setopt(c, CURLOPT_SSL_VERIFYPEER, 0L);
    curl_easy_setopt(c, CURLOPT_TIMEOUT, 25L);

    struct curl_slist *headers = NULL;
    headers = curl_slist_append(headers, "Accept: text/html,application/xhtml+xml,*/*;q=0.8");
    headers = curl_slist_append(headers, "Accept-Language: en-US,en;q=0.9");
    headers = curl_slist_append(headers, "Cache-Control: no-cache");
    curl_easy_setopt(c, CURLOPT_HTTPHEADER, headers);

    CURLcode res = fetch_with_retry(c, label);
    int added = 0;

    if (res == CURLE_OK && buf.size > 100) {
        /*
         * freeproxy.world HTML table format:
         * <td class="show-ip-div">IP</td>
         * <td><a href="...">PORT</a></td>
         * We scan for IP patterns following "show-ip-div" class.
         */
        char *p = buf.data;
        while ((p = strstr(p, "show-ip-div")) != NULL) {
            /* Find the next '>' after the class attribute */
            p = strchr(p, '>');
            if (!p) break;
            p++; /* skip '>' */

            /* Extract IP address */
            char ip[64] = {0};
            int ip_len = 0;
            while (*p && *p != '<' && ip_len < 63) {
                if ((*p >= '0' && *p <= '9') || *p == '.') {
                    ip[ip_len++] = *p;
                } else if (*p != ' ' && *p != '\n' && *p != '\r' && *p != '\t') {
                    break;
                }
                p++;
            }
            ip[ip_len] = '\0';

            if (ip_len < 7) continue; /* not a valid IP */

            /* Find port in the next <td> or <a> */
            char *td = strstr(p, "<td");
            if (!td) break;
            /* Look for digits after '>' */
            char *gt = strchr(td, '>');
            if (!gt) break;
            gt++;
            /* Port might be inside an <a> tag */
            if (*gt == '<') {
                gt = strchr(gt, '>');
                if (!gt) break;
                gt++;
            }

            int port = atoi(gt);
            if (port > 0 && port <= 65535 &&
                strncmp(ip, "10.", 3) != 0 &&
                strncmp(ip, "192.168.", 8) != 0 &&
                strncmp(ip, "127.", 4) != 0) {
                if (add_proxy(ip, port) == 1) added++;
            }
        }
        printf("[scrape] %s: %d new proxies\n", label, added);
    } else {
        printf("[scrape] %s: FAILED (%s)\n", label,
               res != CURLE_OK ? curl_easy_strerror(res) : "empty response");
    }

    curl_slist_free_all(headers);
    curl_easy_cleanup(c);
    free(buf.data);
    return added;
}

static void scrape_all(void) {
    printf("[*] Scraping Chinese exit proxies from live APIs...\n\n");

    /* ProxyScrape - plain text, country-filtered */
    scrape_plaintext(
        "https://api.proxyscrape.com/v2/?request=displayproxies&protocol=socks5&timeout=10000&country=cn",
        "ProxyScrape SOCKS5/CN");
    scrape_plaintext(
        "https://api.proxyscrape.com/v2/?request=displayproxies&protocol=socks4&timeout=10000&country=cn",
        "ProxyScrape SOCKS4/CN");
    scrape_plaintext(
        "https://api.proxyscrape.com/v2/?request=displayproxies&protocol=http&timeout=10000&country=cn",
        "ProxyScrape HTTP/CN");

    /* Fallback: broader lists */
    scrape_plaintext(
        "https://api.proxyscrape.com/v2/?request=displayproxies&protocol=socks5&timeout=5000&country=all",
        "ProxyScrape SOCKS5/ALL");

    /* Geonode JSON API */
    scrape_geonode(
        "https://proxylist.geonode.com/api/proxy-list?limit=50&page=1&sort_by=lastChecked&sort_type=desc&country=CN&protocols=socks5",
        "Geonode SOCKS5/CN");
    scrape_geonode(
        "https://proxylist.geonode.com/api/proxy-list?limit=50&page=1&sort_by=lastChecked&sort_type=desc&country=CN&protocols=socks4",
        "Geonode SOCKS4/CN");

    /* FreeProxy.World - HTML table, China-filtered, speed < 1000ms */
    scrape_freeproxy_world(
        "https://www.freeproxy.world/?type=&anonymity=&country=CN&speed=1000&port=",
        "FreeProxy.World CN");

    /* SpysOne - HTML with encoded proxy data, China SOCKS */
    scrape_freeproxy_world(
        "https://spys.one/free-proxy-list/CN/",
        "SpysOne CN");

    /* ProxyNova - HTML table, China */
    scrape_freeproxy_world(
        "https://www.proxynova.com/proxy-server-list/country-cn/",
        "ProxyNova CN");

    printf("\n[*] Total unique proxies scraped: %d\n\n", g_proxy_count);
}

/* --- Phase 2: Health checking (concurrent via pthreads) --- */

typedef struct {
    int start;
    int end;
} WorkRange;

static double get_time_ms(void) {
    struct timeval tv;
    gettimeofday(&tv, NULL);
    return tv.tv_sec + tv.tv_usec / 1000000.0;
}

static void *verify_worker(void *arg) {
    WorkRange *range = (WorkRange *)arg;

    for (int i = range->start; i < range->end; i++) {
        ProxyEntry *e = &g_proxies[i];

        /* Try socks5h first (remote DNS), then socks5 */
        const char *schemes[] = { "socks5h", "socks5", NULL };

        for (int s = 0; schemes[s]; s++) {
            CURL *c = curl_easy_init();
            if (!c) continue;

            char proxy_url[128];
            snprintf(proxy_url, sizeof(proxy_url), "%s://%s:%d", schemes[s], e->host, e->port);

            curl_easy_setopt(c, CURLOPT_URL, TEST_URL);
            curl_easy_setopt(c, CURLOPT_PROXY, proxy_url);
            curl_easy_setopt(c, CURLOPT_NOBODY, 1L);  /* HEAD-like, don't download body */
            curl_easy_setopt(c, CURLOPT_CONNECTTIMEOUT, (long)CONNECT_TIMEOUT);
            curl_easy_setopt(c, CURLOPT_TIMEOUT, (long)TEST_TIMEOUT);
            curl_easy_setopt(c, CURLOPT_SSL_VERIFYPEER, 0L);
            curl_easy_setopt(c, CURLOPT_FOLLOWLOCATION, 1L);
            curl_easy_setopt(c, CURLOPT_USERAGENT, "Mozilla/5.0");
            /* Suppress output */
            curl_easy_setopt(c, CURLOPT_WRITEFUNCTION, write_cb);
            struct MemBuf discard = { .data = malloc(1), .size = 0 };
            curl_easy_setopt(c, CURLOPT_WRITEDATA, &discard);

            double t0 = get_time_ms();
            CURLcode res = curl_easy_perform(c);
            double elapsed = get_time_ms() - t0;

            long http_code = 0;
            if (res == CURLE_OK) {
                curl_easy_getinfo(c, CURLINFO_RESPONSE_CODE, &http_code);
            }

            curl_easy_cleanup(c);
            free(discard.data);

            if (http_code == 200 || http_code == 301 || http_code == 302) {
                e->speed = elapsed;
                e->verified = 1;
                printf("  [OK]   %s:%d (%s) -> HTTP %ld in %.1fs\n",
                       e->host, e->port, schemes[s], http_code, elapsed);
                break; /* success, no need to try next scheme */
            } else if (http_code > 0) {
                printf("  [FAIL] %s:%d (%s) -> HTTP %ld\n",
                       e->host, e->port, schemes[s], http_code);
            }
            /* else: timeout/connection error, try next scheme */
        }

        if (!e->verified) {
            e->speed = 0;
        }
    }

    free(range);
    return NULL;
}

static void verify_all(void) {
    if (g_proxy_count == 0) {
        printf("[*] No proxies to verify.\n");
        return;
    }

    printf("[*] Health-checking %d proxies against tianditu (max %d workers)...\n\n",
           g_proxy_count, MAX_WORKERS);

    int nworkers = g_proxy_count < MAX_WORKERS ? g_proxy_count : MAX_WORKERS;
    int per_worker = g_proxy_count / nworkers;
    int remainder = g_proxy_count % nworkers;

    pthread_t threads[MAX_WORKERS];
    int idx = 0;

    for (int w = 0; w < nworkers; w++) {
        WorkRange *wr = malloc(sizeof(WorkRange));
        wr->start = idx;
        wr->end = idx + per_worker + (w < remainder ? 1 : 0);
        idx = wr->end;
        pthread_create(&threads[w], NULL, verify_worker, wr);
    }

    for (int w = 0; w < nworkers; w++) {
        pthread_join(threads[w], NULL);
    }
}

/* --- Phase 3: Sort and write output --- */

static int speed_cmp(const void *a, const void *b) {
    const ProxyEntry *pa = (const ProxyEntry *)a;
    const ProxyEntry *pb = (const ProxyEntry *)b;
    if (pa->speed < pb->speed) return -1;
    if (pa->speed > pb->speed) return 1;
    return 0;
}

static void write_results(void) {
    /* Collect verified proxies */
    ProxyEntry verified[MAX_PROXIES];
    int vcount = 0;

    for (int i = 0; i < g_proxy_count; i++) {
        if (g_proxies[i].verified) {
            verified[vcount++] = g_proxies[i];
        }
    }

    if (vcount == 0) {
        printf("\n[-] No working Chinese-exit proxies found.\n");
        printf("[-] Keeping previous %s unchanged.\n", OUTPUT_FILE);
        return;
    }

    /* Sort by speed (fastest first) */
    qsort(verified, vcount, sizeof(ProxyEntry), speed_cmp);

    int use_count = vcount < MAX_WORKING ? vcount : MAX_WORKING;

    printf("\n[+] Found %d working proxies, using top %d fastest:\n", vcount, use_count);
    for (int i = 0; i < use_count; i++) {
        printf("    %s:%d (%.1fs)\n", verified[i].host, verified[i].port, verified[i].speed);
    }

    /* Write proxies.html (plain text IP:PORT, one per line) */
    FILE *fp = fopen(OUTPUT_FILE, "w");
    if (fp) {
        for (int i = 0; i < use_count; i++) {
            fprintf(fp, "%s:%d\n", verified[i].host, verified[i].port);
        }
        fclose(fp);
        printf("[+] Wrote %d proxies to %s\n", use_count, OUTPUT_FILE);
    } else {
        perror("[-] Failed to write " OUTPUT_FILE);
    }

    /* Write V2Ray proxies.json */
    fp = fopen(V2RAY_CONFIG, "w");
    if (fp) {
        fprintf(fp, "{\n  \"outbounds\": [\n    {\n");
        fprintf(fp, "      \"protocol\": \"socks\",\n");
        fprintf(fp, "      \"settings\": {\n        \"servers\": [\n");
        for (int i = 0; i < use_count; i++) {
            fprintf(fp, "          {\"address\": \"%s\", \"port\": %d}%s\n",
                    verified[i].host, verified[i].port,
                    i < use_count - 1 ? "," : "");
        }
        fprintf(fp, "        ]\n      },\n");
        fprintf(fp, "      \"tag\": \"china-proxy\"\n    }\n  ]\n}\n");
        fclose(fp);
        printf("[+] Wrote V2Ray config to %s\n", V2RAY_CONFIG);
    } else {
        perror("[-] Failed to write " V2RAY_CONFIG);
    }
}

/* --- Main --- */

int main(void) {
    srand(time(NULL) ^ getpid());
    curl_global_init(CURL_GLOBAL_ALL);

    scrape_all();
    verify_all();
    write_results();

    curl_global_cleanup();

    printf("\n[*] Done. Proxy scrape + verify complete.\n");
    return 0;
}
