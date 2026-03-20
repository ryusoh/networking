#include <stdio.h>
#include <string.h>
#include <assert.h>
#include <stdint.h>
#include <inttypes.h>

/**
 * C-based Unit Tests for NAS Tools
 * --------------------------------
 * Validates the core logic of our high-performance tools.
 */

// Extern declarations
extern int add_tile(uint64_t hash, const void *data, uint32_t len);
extern void* get_tile(uint64_t hash, uint32_t *out_len);
extern int init_storage();
extern void obfuscate(uint8_t *data, size_t len);
extern const char *MS_RESPONSE;

void test_stealth_tunnel() {
    printf("[*] Testing Stealth Tunnel (XOR)...\n");
    uint8_t data[] = "secret_payload";
    size_t len = strlen((char*)data);
    uint8_t original[16];
    memcpy(original, data, len);
    obfuscate(data, len);
    assert(memcmp(data, original, len) != 0);
    obfuscate(data, len);
    assert(memcmp(data, original, len) == 0);
    printf("[PASS] Stealth Tunnel Test\n");
}

void test_connectivity_spoofer() {
    printf("[*] Testing Connectivity Spoofer Responses...\n");
    assert(strstr(MS_RESPONSE, "Microsoft Connect Test") != NULL);
    printf("[PASS] Connectivity Spoofer Test\n");
}

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
    test_stealth_tunnel();
    test_connectivity_spoofer();
    test_tile_storage();
    printf("--- [ ALL C TESTS PASSED ] ---\n");
    return 0;
}
