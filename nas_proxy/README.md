# NAS Proxy & Network Services

This directory contains the central network management tools for the NAS.

## Services

### 1. Pi-hole (Ad-Blocking)

- **Status:** Integrated into `docker-compose.yml`.
- **Admin UI:** `http://<NAS_IP>:8000/admin`
- **Default Password:** See `WEBPASSWORD` in `docker-compose.yml`.

### 2. V2Ray Proxy (`nas_proxy`)

- **Port:** 8080 (HTTP), 1080 (SOCKS5).
- **Purpose:** Reliable proxy relay for high-latency network tasks.

### 3. Tile Cache

- **Port:** 8082.
- **Purpose:** Locally cache Map Tiles (Tianditu) to bypass slow Chinese endpoints.

## Deployment Steps (On NAS)

1. SSH into the NAS.
2. Clone the repo or `rsync` this folder.
3. Create a `.env` file in this directory to store your secret password (this will NOT be committed to GitHub):
   ```bash
   echo "PIHOLE_PASSWORD=your_secure_password_here" > .env
   ```
4. Run:
   ```bash
   sudo docker-compose up -d
   ```
5. **CRITICAL:** Update your router's DNS settings to point to the NAS IP (`10.0.0.169`) to enable network-wide ad-blocking.

## Configuration Updates

- To add custom blocklists (e.g., for Chinese ads or map domains), go to the Admin UI > Adlists.
- Recommended List: `https://raw.githubusercontent.com/privacy-protection-tools/anti-AD/master/anti-ad-domains.txt`
