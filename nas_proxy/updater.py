#!/usr/bin/env python3
import json
import os
import subprocess
import re
from concurrent.futures import ThreadPoolExecutor, as_completed

"""
NAS Proxy Auto-Updater with Health Checking
--------------------------------------------
1. Parses proxy list from proxies.html (populated by C scraper)
2. Also fetches from Geonode JSON API directly (China-filtered)
3. Tests each proxy against tianditu.gov.cn
4. Only deploys proxies that return 200 (Chinese exit IP confirmed)
"""

CONFIG_PATH = os.path.join(os.path.dirname(__file__), "config", "config.json")
PROXIES_CONFIG_PATH = os.path.join(os.path.dirname(__file__), "config", "proxies.json")
PROXY_FILE = os.path.join(os.path.dirname(__file__), "proxies.html")

TEST_URL = "https://map.tianditu.gov.cn/"
CONNECT_TIMEOUT = 8
MAX_TIME = 12
MAX_WORKERS = 40
MAX_WORKING_PROXIES = 5

# Additional API sources fetched directly from Python
GEONODE_APIS = [
    "https://proxylist.geonode.com/api/proxy-list?limit=50&page=1&sort_by=lastChecked&sort_type=desc&country=CN&protocols=socks5",
    "https://proxylist.geonode.com/api/proxy-list?limit=50&page=1&sort_by=lastChecked&sort_type=desc&country=CN&protocols=socks4",
]


def fetch_geonode_proxies():
    """Fetch proxies from Geonode JSON API (country=CN)."""
    proxies = []
    for url in GEONODE_APIS:
        try:
            result = subprocess.run(
                ["curl", "-s", "--max-time", "15", url],
                capture_output=True, text=True, timeout=20
            )
            data = json.loads(result.stdout)
            for p in data.get("data", []):
                ip = p.get("ip", "")
                port = p.get("port", "")
                if ip and port:
                    proxies.append({"address": ip, "port": int(port)})
                    print(f"  [Geonode] {ip}:{port}")
        except Exception as e:
            print(f"  [Geonode] Failed: {e}")
    return proxies


def test_proxy(ip, port):
    """Test if a proxy can reach tianditu. Returns response time in seconds or None."""
    for scheme in ["socks5h", "socks5"]:
        try:
            result = subprocess.run(
                [
                    "curl", "-s", "-o", "/dev/null",
                    "-w", "%{http_code} %{time_total}",
                    "--proxy", f"{scheme}://{ip}:{port}",
                    "--connect-timeout", str(CONNECT_TIMEOUT),
                    "--max-time", str(MAX_TIME),
                    TEST_URL
                ],
                capture_output=True, text=True,
                timeout=MAX_TIME + 5
            )
            parts = result.stdout.strip().split()
            if len(parts) == 2:
                code, time_s = parts[0], float(parts[1])
                if code in ("200", "301", "302"):
                    print(f"  [OK] {ip}:{port} ({scheme}) -> HTTP {code} in {time_s:.1f}s")
                    return time_s
                elif code != "000":
                    print(f"  [--] {ip}:{port} ({scheme}) -> HTTP {code} in {time_s:.1f}s")
                    return None
        except Exception:
            pass
    return None


def update_v2ray_config():
    # 1. Parse proxies from scraper output
    proxies = []
    if os.path.exists(PROXY_FILE):
        with open(PROXY_FILE, 'r') as f:
            content = f.read()
            matches = re.findall(r'(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):(\d+)', content)
            for ip, port in matches:
                if ip.startswith(("10.", "192.168.", "127.", "0.")):
                    continue
                proxies.append({"address": ip, "port": int(port)})
    else:
        print(f"[*] {PROXY_FILE} not found, using API sources only.")

    # 2. Also fetch from Geonode API
    print("[*] Fetching from Geonode API (country=CN)...")
    geonode = fetch_geonode_proxies()

    # Deduplicate, prioritize Geonode (China-filtered) first
    seen = set()
    all_proxies = []
    for p in geonode + proxies:
        key = f"{p['address']}:{p['port']}"
        if key not in seen:
            seen.add(key)
            all_proxies.append(p)

    if not all_proxies:
        print("[-] No proxies found from any source.")
        return

    print(f"\n[*] Testing {len(all_proxies)} proxies against tianditu...")

    # 3. Health-check ALL proxies in parallel, then sort by speed
    candidates = []
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        future_to_proxy = {
            executor.submit(test_proxy, p["address"], p["port"]): p
            for p in all_proxies
        }
        for future in as_completed(future_to_proxy):
            proxy = future_to_proxy[future]
            try:
                time_s = future.result()
                if time_s is not None:
                    candidates.append((time_s, proxy))
            except Exception:
                pass

    if not candidates:
        print("\n[-] No working Chinese-exit proxies found from any source.")
        print("[-] All proxies either timed out (000) or returned 418 (geo-blocked).")
        return

    # Sort by speed (fastest first) and take top N
    candidates.sort(key=lambda x: x[0])
    working = [p for _, p in candidates[:MAX_WORKING_PROXIES]]

    print(f"\n[+] Found {len(candidates)} working proxies, using top {len(working)} fastest:")
    for time_s, p in candidates[:MAX_WORKING_PROXIES]:
        print(f"    {p['address']}:{p['port']} ({time_s:.1f}s)")

    # 4. Write verified proxies to proxies.html for the browser extension
    #    (pihole serves this file on port 8000, extension fetches it directly)
    #    Extension will use SOCKS5 scheme in PAC script -> bypasses V2Ray entirely
    try:
        with open(PROXY_FILE, 'w') as f:
            for p in working:
                f.write(f"{p['address']}:{p['port']}\n")
        print(f"[+] Wrote {len(working)} verified proxies to proxies.html (served by pihole)")
    except Exception as e:
        print(f"[-] Error writing proxies.html: {e}")

    # 5. Also update V2Ray config (for tile_cache and other NAS services)
    proxies_config = {
        "outbounds": [
            {
                "protocol": "socks",
                "settings": {"servers": working},
                "tag": "china-proxy"
            }
        ]
    }

    try:
        os.makedirs(os.path.dirname(PROXIES_CONFIG_PATH), exist_ok=True)
        with open(PROXIES_CONFIG_PATH, 'w') as f:
            json.dump(proxies_config, f, indent=2)
        print(f"[+] Also deployed to V2Ray proxies.json (for tile_cache)")
    except Exception as e:
        print(f"[-] Error writing config: {e}")

    print("[*] Restarting nas_proxy container...")
    subprocess.run(["sudo", "docker", "restart", "nas_proxy"])
    print("[+] Done! Reload Chrome extension and try map.tianditu.gov.cn")


if __name__ == "__main__":
    update_v2ray_config()
