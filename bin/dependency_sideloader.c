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
#define PCAP_HEADER_URL "https://raw.githubusercontent.com/the-tcpdump-group/libpcap/master/pcap.h"

int main() {
    CURL *curl;
    FILE *fp;
    CURLcode res;

    printf("[*] dependency_sideloader: Injecting missing pcap.h...\n");

    // 1. Create deps directory
    mkdir(DEPS_DIR, 0755);

    curl = curl_easy_init();
    if (curl) {
        fp = fopen(DEPS_DIR "/pcap.h", "wb");
        curl_easy_setopt(curl, CURLOPT_URL, PCAP_HEADER_URL);
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, NULL);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, fp);
        curl_easy_setopt(curl, CURLOPT_USERAGENT, "libcurl-agent/1.0");
        
        res = curl_easy_perform(curl);
        fclose(fp);

        if (res == CURLE_OK) {
            printf("[SUCCESS] pcap.h sideloaded to ./%s/ folder.\n", DEPS_DIR);
            printf("[*] You can now bypass the hours-long Docker rebuild!\n");
        } else {
            fprintf(stderr, "[ERROR] Sideload failed: %s\n", curl_easy_strerror(res));
        }
        curl_easy_cleanup(curl);
    }
    return 0;
}
