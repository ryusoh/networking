# NAS Network Strategy

This document outlines how to use a home NAS (Network Attached Storage) to centralize and accelerate our network bypass tools.

## Core Roles

### 1. Always-On Proxy Relay (`nas_proxy/`)

- **Goal:** Move the logic of finding and maintaining Chinese proxies from the MacBook to the NAS.
- **Implementation:** Run a SOCKS5/HTTP proxy (e.g., Squid or v2ray) in Docker on the NAS.
- **Benefit:** The NAS stays connected 24/7. Your Chrome extension simply points to the NAS IP, ensuring instant map loads without the "search for working proxy" delay.

### 2. Local Map Tile Cache

- **Goal:** Use the NAS storage to build a local mirror of frequently used Tianditu map tiles.
- **Implementation:** A background scraper on the NAS fetches tiles through the proxy and stores them.
- **Benefit:** 0ms latency for cached areas. Reduces bandwidth usage on your Chinese exit node.

### 3. Home-Wide Ad Blocking

- **Goal:** Block tracking and ads for all devices on the local network.
- **Implementation:** Deploy AdGuard Home or Pi-hole on the NAS.
- **Benefit:** Replaces browser-level extensions with a more efficient DNS-level solution.

## Hardware Requirements

- **OS:** Linux-based (Synology DSM, QNAP QTS, Unraid, TrueNAS, or generic Ubuntu).
- **Features:** Docker (Container Manager) support is essential.

## Workflow

1. Deploy the `nas_proxy` container using the provided `docker-compose.yml`.
2. Configure the `tianditu_bypass` extension to use your NAS IP as the primary proxy.
3. (Optional) Set the NAS as your primary DNS server for house-wide ad blocking.
