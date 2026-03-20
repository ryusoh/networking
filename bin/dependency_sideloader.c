#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <curl/curl.h>
#include <sys/stat.h>

/**
 * NAS Build Accelerator: dependency_sideloader
 * -------------------------------------------
 * The ultimate 'Zero-Build' hack. Downloads missing headers/libs
 * directly to the NAS so we don't have to wait hours for Docker.
 */

#define DEPS_DIR "deps"
#define PCAP_DIR "deps/pcap"
#define BASE_URL "https://raw.githubusercontent.com/the-tcpdump-group/libpcap/master"

int download_file(CURL *curl, const char *url, const char *out_path) {
    FILE *fp = fopen(out_path, "wb");
    if (!fp) return -1;
    curl_easy_setopt(curl, CURLOPT_URL, url);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, fp);
    CURLcode res = curl_easy_perform(curl);
    fclose(fp);
    return (res == CURLE_OK) ? 0 : -1;
}

int main() {
    CURL *curl;
    printf("[*] dependency_sideloader: Injecting full pcap suite...\n");

    // 1. Create directory structure
    mkdir(DEPS_DIR, 0755);
    mkdir(PCAP_DIR, 0755);

    curl = curl_easy_init();
    if (curl) {
        curl_easy_setopt(curl, CURLOPT_USERAGENT, "libcurl-agent/1.0");
        
        // Download core headers
        download_file(curl, BASE_URL "/pcap.h", DEPS_DIR "/pcap.h");
        download_file(curl, BASE_URL "/pcap/pcap.h", PCAP_DIR "/pcap.h");
        download_file(curl, BASE_URL "/pcap/bpf.h", PCAP_DIR "/bpf.h");
        download_file(curl, BASE_URL "/pcap/dlt.h", PCAP_DIR "/dlt.h");

        printf("[SUCCESS] Full pcap headers sideloaded to ./%s/ folder.\n", DEPS_DIR);
        curl_easy_cleanup(curl);
    }
    return 0;
}
