/**
 * Shared device list for LAN tools
 * ---------------------------------
 * Stores known devices in ~/.config/lan/devices
 * Format: one device per line: NAME IP MAC
 *
 * Example:
 *   router 10.0.0.1 58:19:f8:0b:0a:be
 *   nas 10.0.0.2 --
 *   phone 10.0.0.24 7e:0a:c4:f6:f1:31
 */

#ifndef DEVICES_H
#define DEVICES_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>

#define DEVICES_DIR_FMT  "%s/.config/lan"
#define DEVICES_FILE_FMT "%s/.config/lan/devices"
#define MAX_DEVICES 256

typedef struct {
    char name[32];
    char ip[16];
    char mac[18];
} Device;

static char *devices_path(void) {
    static char path[512];
    const char *home = getenv("HOME");
    if (!home) home = "/tmp";
    snprintf(path, sizeof(path), DEVICES_FILE_FMT, home);
    return path;
}

static void devices_ensure_dir(void) {
    char dir[512];
    const char *home = getenv("HOME");
    if (!home) home = "/tmp";
    snprintf(dir, sizeof(dir), DEVICES_DIR_FMT, home);
    mkdir(dir, 0755);
}

static int devices_load(Device *devs, int max) {
    FILE *fp = fopen(devices_path(), "r");
    if (!fp) return 0;

    int count = 0;
    char line[256];
    while (count < max && fgets(line, sizeof(line), fp)) {
        /* Skip comments and blank lines */
        if (line[0] == '#' || line[0] == '\n') continue;
        Device *d = &devs[count];
        if (sscanf(line, "%31s %15s %17s", d->name, d->ip, d->mac) >= 2) {
            if (d->mac[0] == '\0') snprintf(d->mac, sizeof(d->mac), "--");
            count++;
        }
    }
    fclose(fp);
    return count;
}

__attribute__((unused))
static void devices_save(const Device *devs, int count) {
    devices_ensure_dir();
    FILE *fp = fopen(devices_path(), "w");
    if (!fp) { perror("devices_save"); return; }

    fprintf(fp, "# LAN device list (managed by lan_scanner)\n");
    fprintf(fp, "# Format: NAME IP MAC\n");
    for (int i = 0; i < count; i++) {
        fprintf(fp, "%s %s %s\n", devs[i].name, devs[i].ip, devs[i].mac);
    }
    fclose(fp);
}

/* Look up a device by name, IP, or MAC. Returns NULL if not found. */
static const Device *devices_find(const Device *devs, int count, const char *query) {
    for (int i = 0; i < count; i++) {
        if (strcasecmp(devs[i].name, query) == 0 ||
            strcmp(devs[i].ip, query) == 0 ||
            strcasecmp(devs[i].mac, query) == 0)
            return &devs[i];
    }
    return NULL;
}

/* Add or update a device. Returns new count. */
__attribute__((unused))
static int devices_set(Device *devs, int count, const char *name,
                       const char *ip, const char *mac) {
    /* Update existing by name or IP */
    for (int i = 0; i < count; i++) {
        if (strcasecmp(devs[i].name, name) == 0 || strcmp(devs[i].ip, ip) == 0) {
            snprintf(devs[i].name, sizeof(devs[i].name), "%s", name);
            snprintf(devs[i].ip, sizeof(devs[i].ip), "%s", ip);
            snprintf(devs[i].mac, sizeof(devs[i].mac), "%s", mac);
            return count;
        }
    }
    /* Add new */
    if (count < MAX_DEVICES) {
        Device *d = &devs[count];
        snprintf(d->name, sizeof(d->name), "%s", name);
        snprintf(d->ip, sizeof(d->ip), "%s", ip);
        snprintf(d->mac, sizeof(d->mac), "%s", mac);
        return count + 1;
    }
    return count;
}

#endif /* DEVICES_H */
