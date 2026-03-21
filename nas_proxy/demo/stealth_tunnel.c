#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <stdint.h>

/**
 * Enhancement #2: C-based Obfuscation (Stealth Tunnel)
 * ---------------------------------------------------
 *Sit between the local client and the remote proxy.
 *Applies a fast XOR obfuscation to every byte.
 *This makes the traffic look like random noise to DPI firewalls.
 */

#define PORT 9090
#define BUFFER_SIZE 8192
#define XOR_KEY 0x42 // Our secret key

void obfuscate(uint8_t *data, size_t len) {
    for (size_t i = 0; i < len; i++) {
        data[i] ^= XOR_KEY;
    }
}

#ifndef TEST_MAIN
int main() {
    int server_fd, client_fd;
    struct sockaddr_in address;
    int opt = 1;
    int addrlen = sizeof(address);
    uint8_t buffer[BUFFER_SIZE];

    // Create Socket
    if ((server_fd = socket(AF_INET, SOCK_STREAM, 0)) == 0) {
        perror("socket failed");
        exit(EXIT_FAILURE);
    }

    // Set options to reuse port
    setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY;
    address.sin_port = htons(PORT);

    // Bind
    if (bind(server_fd, (struct sockaddr *)&address, sizeof(address)) < 0) {
        perror("bind failed");
        exit(EXIT_FAILURE);
    }

    // Listen
    if (listen(server_fd, 3) < 0) {
        perror("listen");
        exit(EXIT_FAILURE);
    }

    printf("[*] Stealth Tunnel listening on port %d (XOR Key: 0x%02X)\n", PORT, XOR_KEY);

    while (1) {
        if ((client_fd = accept(server_fd, (struct sockaddr *)&address, (socklen_t*)&addrlen)) < 0) {
            perror("accept");
            continue;
        }

        // Handle one connection for demonstration
        ssize_t valread = read(client_fd, buffer, BUFFER_SIZE);
        if (valread > 0) {
            printf("[+] Received %ld bytes. Obfuscating...\n", valread);
            obfuscate(buffer, valread);
            // In a real relay, we would forward this to the remote proxy here.
            printf("[*] Payload is now obfuscated noise.\n");
        }
        close(client_fd);
    }

    return 0;
}
#endif
