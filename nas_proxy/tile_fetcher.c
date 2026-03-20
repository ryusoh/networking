#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <curl/curl.h>
#include <sys/mman.h>
#include <stdint.h>

/**
 * Enhancement #1: Zero-Copy Tile Fetcher (Libcurl + Mmap)
 * -----------------------------------------------------
 * Downloads tiles from Tianditu directly into our memory-mapped 
 * storage blob, bypassing user-space buffers as much as possible.
 */

typedef struct {
    uint8_t *mapped_ptr;
    size_t current_offset;
    size_t max_size;
} WriteContext;

static size_t write_callback(void *contents, size_t size, size_t nmemb, void *userp) {
    size_t realsize = size * nmemb;
    WriteContext *ctx = (WriteContext *)userp;

    if (ctx->current_offset + realsize > ctx->max_size) {
        fprintf(stderr, "Not enough space in mmap blob\n");
        return 0;
    }

    // Direct copy from Libcurl's internal buffer to our Mmap memory
    memcpy(ctx->mapped_ptr + ctx->current_offset, contents, realsize);
    ctx->current_offset += realsize;

    return realsize;
}

int fetch_tile_to_mmap(const char *url, void *mmap_base, size_t start_offset, size_t *out_len) {
    CURL *curl_handle;
    CURLcode res;
    WriteContext ctx = {(uint8_t *)mmap_base, start_offset, start_offset + (1024 * 1024)}; // Max 1MB per tile

    curl_handle = curl_easy_init();
    if (curl_handle) {
        curl_easy_setopt(curl_handle, CURLOPT_URL, url);
        curl_easy_setopt(curl_handle, CURLOPT_WRITEFUNCTION, write_callback);
        curl_easy_setopt(curl_handle, CURLOPT_WRITEDATA, (void *)&ctx);
        curl_easy_setopt(curl_handle, CURLOPT_USERAGENT, "libcurl-agent/1.0");
        curl_easy_setopt(curl_handle, CURLOPT_TIMEOUT, 10L);

        res = curl_easy_perform(curl_handle);
        if (res != CURLE_OK) {
            fprintf(stderr, "curl_easy_perform() failed: %s\n", curl_easy_strerror(res));
            curl_easy_cleanup(curl_handle);
            return -1;
        }

        *out_len = ctx.current_offset - start_offset;
        curl_easy_cleanup(curl_handle);
        return 0;
    }
    return -1;
}

// Integration function for our tile_storage.c
int add_tile_from_url(uint64_t hash, const char *url) {
    // This will be called by our main logic to combine fetching and storage
    // [To be expanded in the next iteration]
    return 0;
}
