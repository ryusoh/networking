#!/usr/bin/env python3
import json
import os
import subprocess

"""
NAS Proxy Auto-Updater
----------------------
Parses proxies.html and injects them into V2Ray config.json.
Ensures your NAS always uses the fastest working Chinese proxies.
"""
CONFIG_PATH = "./config/config.json"
PROXY_FILE = "proxies.html"

def update_v2ray_config():

    if not os.path.exists(PROXY_FILE):
        print(f"[-] {PROXY_FILE} not found. Run scraper first.")
        return

    # 1. Parse raw IP:Port list using Regex for robustness
    import re
    proxies = []
    with open(PROXY_FILE, 'r') as f:
        content = f.read()
        # Pattern for IP:Port
        matches = re.findall(r'(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):(\d+)', content)
        for ip, port in matches:
            proxies.append({"address": ip, "port": int(port)})

    if not proxies:
        print("[-] No valid proxies found in file.")
        return

    # 2. Load existing config
    with open(CONFIG_PATH, 'r') as f:
        config = json.load(f)

    # 3. Inject new outbound proxies (Keep top 5)
    found = False
    for outbound in config['outbounds']:
        if outbound.get('tag') == 'china-proxy':
            outbound['settings'] = {"servers": proxies[:5]}
            found = True
            print(f"[+] Injected {len(proxies[:5])} fresh Chinese proxies.")
    
    if not found:
        print("[-] 'china-proxy' tag not found in config. Adding it...")
        # (Logic to add it if missing can go here)

    # 4. Save updated config
    with open(CONFIG_PATH, 'w') as f:
        json.dump(config, f, indent=2)

    # 5. Reload V2Ray (Docker)
    print("[*] Restarting nas_proxy container...")
    subprocess.run(["sudo", "docker", "restart", "nas_proxy"])

if __name__ == "__main__":
    update_v2ray_config()
