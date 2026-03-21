#include <stdio.h>
#include <string.h>
#include <assert.h>
#include <stdint.h>
#include <inttypes.h>

/**
 * C-based Unit Tests for NAS Tools
 * --------------------------------
 * Validates the core logic of production tools.
 */

// Extern declarations (tile_storage.c)
extern int add_tile(uint64_t hash, const void *data, uint32_t len);
extern void* get_tile(uint64_t hash, uint32_t *out_len);
extern int init_storage();

void test_tile_storage() {
    printf("[*] Testing Tile Storage...\n");
    assert(init_storage() == 0);
    const char *data = "test_payload";
    add_tile(12345, data, strlen(data));
    uint32_t len;
    void *res = get_tile(12345, &len);
    assert(res != NULL);
    printf("[PASS] Tile Storage Test\n");
}

int main() {
    printf("--- [ STARTING C-BASED UNIT TESTS ] ---\n");
    test_tile_storage();
    printf("--- [ ALL C TESTS PASSED ] ---\n");
    return 0;
}
