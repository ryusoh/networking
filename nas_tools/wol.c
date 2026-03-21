/**
 * Wake-on-LAN
 * -----------
 * Sends a magic packet to wake a device on the local network.
 * Resolves device names from ~/.config/lan/devices (saved by lan_scanner).
 *
 * Build: gcc -O3 -Wall -o wol wol.c
 * Usage: ./wol nas               # wake by saved name
 *        ./wol AA:BB:CC:DD:EE:FF  # wake by MAC directly
 *        ./wol nas -b 10.0.0.255  # custom broadcast address
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>
#include "devices.h"

#define WOL_PORT 9
#define MAGIC_PKT_LEN 102  /* 6 + 16*6 */

static int parse_mac(const char *str, unsigned char mac[6]) {
    unsigned int b[6];
    if (sscanf(str, "%x:%x:%x:%x:%x:%x",
               &b[0], &b[1], &b[2], &b[3], &b[4], &b[5]) != 6)
        return -1;
    for (int i = 0; i < 6; i++) {
        if (b[i] > 0xFF) return -1;
        mac[i] = (unsigned char)b[i];
    }
    return 0;
}

static int send_magic_packet(const unsigned char mac[6], const char *bcast, int port) {
    unsigned char pkt[MAGIC_PKT_LEN];

    memset(pkt, 0xFF, 6);
    for (int i = 0; i < 16; i++)
        memcpy(pkt + 6 + i * 6, mac, 6);

    int fd = socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP);
    if (fd < 0) { perror("socket"); return -1; }

    int one = 1;
    if (setsockopt(fd, SOL_SOCKET, SO_BROADCAST, &one, sizeof(one)) < 0) {
        perror("setsockopt SO_BROADCAST");
        close(fd);
        return -1;
    }

    struct sockaddr_in addr;
    memset(&addr, 0, sizeof(addr));
    addr.sin_family = AF_INET;
    addr.sin_port = htons(port);
    inet_pton(AF_INET, bcast, &addr.sin_addr);

    ssize_t sent = sendto(fd, pkt, sizeof(pkt), 0,
                          (struct sockaddr *)&addr, sizeof(addr));
    close(fd);

    if (sent != sizeof(pkt)) { perror("sendto"); return -1; }
    return 0;
}

int main(int argc, char *argv[]) {
    if (argc < 2) {
        printf("Usage: %s <device|MAC> [-b broadcast] [-p port]\n", argv[0]);
        printf("  device       Device name from lan_scanner (e.g. 'nas')\n");
        printf("  MAC          Or direct MAC address (AA:BB:CC:DD:EE:FF)\n");
        printf("  -b address   Broadcast address (default: 255.255.255.255)\n");
        printf("  -p port      UDP port (default: %d)\n", WOL_PORT);
        return 1;
    }

    const char *target = argv[1];
    const char *mac_str = target;
    unsigned char mac[6];

    /* Try to resolve from saved device list first */
    Device devs[MAX_DEVICES];
    int dev_count = devices_load(devs, MAX_DEVICES);
    const Device *d = devices_find(devs, dev_count, target);

    if (d) {
        if (strcmp(d->mac, "--") == 0) {
            fprintf(stderr, "[wol] Device '%s' (%s) has no saved MAC address.\n",
                    d->name, d->ip);
            fprintf(stderr, "      Run lan_scanner to discover MACs first.\n");
            return 1;
        }
        mac_str = d->mac;
        printf("[wol] Resolved '%s' -> %s (%s)\n", target, d->mac, d->ip);
    }

    if (parse_mac(mac_str, mac) != 0) {
        fprintf(stderr, "[wol] '%s' is not a known device or valid MAC.\n", target);
        if (dev_count > 0) {
            fprintf(stderr, "      Known devices:\n");
            for (int i = 0; i < dev_count; i++)
                fprintf(stderr, "        %-10s %s  %s\n",
                        devs[i].name, devs[i].ip, devs[i].mac);
        } else {
            fprintf(stderr, "      Run lan_scanner first to discover devices.\n");
        }
        return 1;
    }

    const char *bcast = "255.255.255.255";
    int port = WOL_PORT;

    for (int i = 2; i < argc; i++) {
        if (strcmp(argv[i], "-b") == 0 && i + 1 < argc)
            bcast = argv[++i];
        else if (strcmp(argv[i], "-p") == 0 && i + 1 < argc)
            port = atoi(argv[++i]);
    }

    printf("[wol] Sending magic packet to %s via %s:%d\n", mac_str, bcast, port);

    if (send_magic_packet(mac, bcast, port) == 0) {
        printf("[wol] Packet sent. Device should wake shortly.\n");
        return 0;
    }

    fprintf(stderr, "[wol] Failed to send packet.\n");
    return 1;
}
