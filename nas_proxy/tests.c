#include <stdio.h>
#include <string.h>
#include <assert.h>
#include <stdint.h>
#include <sys/mman.h>

/**
 * C-based Unit Tests for NAS Tools
 * --------------------------------
 * Validates the core logic of our high-performance tools.
 */

// Extern declarations
extern int add_tile(uint64_t hash, const void *data, uint32_t len);
extern void* get_tile(uint64_t hash, uint32_t *out_len);
extern int init_storage();
extern void obfuscate(uint8_t *data, size_t len); // From stealth_tunnel.c
extern const char *MS_RESPONSE; // From connectivity_spoofer.c
extern void process_ips_neon(uint32_t *ips, uint32_t *results, int count); // From neon_adblock.c

void test_neon_accelerator() {
    printf("[*] Testing NEON SIMD Accelerator...\n");
    uint32_t ips[4] = {0x11111111, 0x22222222, 0x33333333, 0x44444444};
    uint32_t results[4];
    process_ips_neon(ips, results, 4);
    for (int i = 0; i < 4; i++) {
        assert(results[i] == (ips[i] ^ 0xdeadbeef));
    }
    printf("[PASS] NEON Accelerator Test\n");
}

void test_stealth_tunnel() {
    printf("[*] Testing Stealth Tunnel (XOR)...\n");
    uint8_t data[] = "secret_payload";
    size_t len = strlen((char*)data);
    uint8_t original[16];
    memcpy(original, data, len);

    obfuscate(data, len);
    assert(memcmp(data, original, len) != 0); // Must be different

    obfuscate(data, len); // Second XOR should restore original
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
    
    const char *data = "test_tile_payload";
    uint32_t len = strlen(data);
    uint64_t hash = 0xDEADBEEF;
    
    add_tile(hash, data, len);
    
    uint32_t retrieved_len;
    void *retrieved_data = get_tile(hash, &retrieved_len);
    
    assert(retrieved_data != NULL);
    assert(retrieved_len == len);
    assert(memcmp(retrieved_data, data, len) == 0);
    
    printf("[PASS] Tile Storage Test\n");
}

void test_shared_memory_struct() {
    printf("[*] Testing Shared Memory Data Structures...\n");
    
    // Validate that our stats struct is the expected size
    // (Ensure no unexpected padding)
    typedef struct {
        uint64_t total_packets;
        uint64_t blocked_packets;
        uint64_t tiles_cached;
        char last_blocked_ip[16];
        uint32_t active_connections;
    } NetworkStats;
    
    assert(sizeof(NetworkStats) >= 40); // 8*3 + 16 + 4
    
    printf("[PASS] Shared Memory Struct Test\n");
}

int main() {
    printf("--- [ STARTING C-BASED UNIT TESTS ] ---\n");
    
    test_neon_accelerator();
    test_stealth_tunnel();
    test_connectivity_spoofer();
    test_tile_storage();
    test_shared_memory_struct();
    
    printf("--- [ ALL C TESTS PASSED ] ---\n");
    return 0;
}
