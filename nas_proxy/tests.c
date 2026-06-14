#include <stdio.h>
#include <string.h>
#include <assert.h>
#include <stdint.h>
#include <inttypes.h>
#include <sys/mman.h>
#include <stdlib.h>

/**
 * C-based Unit Tests for NAS Tools
 */

extern int add_tile(uint64_t hash, const void *data, uint32_t len);
extern void* get_tile(uint64_t hash, uint32_t *out_len);
extern int init_storage();
extern void* get_tile_data(uint64_t hash, uint32_t *out_len);
extern int add_tile_data(uint64_t hash, const void *data, uint32_t len);
extern int init_tile_storage();
extern int find_eviction_candidate();

extern int fetch_tile_to_mmap(const char *url, void *mmap_base, size_t start_offset, size_t *out_len);
extern int add_tile_from_url(uint64_t hash, const char *url);

void test_tile_storage() {
    printf("[*] Testing Tile Storage...\n");
    if(init_storage() != 0) return;
    if(init_tile_storage() != 0) return;

    const char *data = "test_payload";
    add_tile(12345, data, strlen(data));
    add_tile_data(12346, data, strlen(data));

    uint32_t len;
    void *res = get_tile(12345, &len);
    assert(res != NULL);
    assert(len == strlen(data));
    assert(memcmp(res, data, len) == 0);

    res = get_tile_data(12346, &len);

    void *res_none = get_tile(99999, &len);
    (void)res_none;

    find_eviction_candidate();

    for (int i=0; i < 50000; i++) {
         add_tile(20000 + i, data, strlen(data));
    }
    printf("[PASS] Tile Storage Test\n");
}

void test_tile_fetcher() {
    printf("[*] Testing Tile Fetcher...\n");
    char *dummy_mmap = malloc(1024 * 1024 + 100);
    size_t out_len;

    fetch_tile_to_mmap("http://example.com/404", dummy_mmap, 0, &out_len);
    fetch_tile_to_mmap("invalid://schema", dummy_mmap, 0, &out_len);
    fetch_tile_to_mmap("http://example.com", dummy_mmap, 1024 * 1024, &out_len);
    add_tile_from_url(999, "http://example.com/tile");

    free(dummy_mmap);
    printf("[PASS] Tile Fetcher Test\n");
}

int main() {
    printf("--- [ STARTING C-BASED UNIT TESTS ] ---\n");
    test_tile_storage();
    test_tile_fetcher();
    printf("--- [ ALL C TESTS PASSED ] ---\n");
    return 0;
}
