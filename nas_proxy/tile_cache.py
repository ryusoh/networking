#!/usr/bin/env python3
import os
import hashlib
import requests
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs

# Configuration
CACHE_DIR = "./tiles"
PROXY_URL = os.environ.get("PROXY_URL", "http://127.0.0.1:8080")
LISTEN_PORT = 8082

# Ensure cache directory exists
os.makedirs(CACHE_DIR, exist_ok=True)

class TileCacheHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        query = parse_qs(urlparse(self.path).query)
        target_url = query.get('url', [None])[0]

        if not target_url:
            self.send_response(400)
            self.end_headers()
            self.wfile.write(b"Missing 'url' parameter")
            return

        # Create a unique filename based on the URL
        url_hash = hashlib.md5(target_url.encode()).hexdigest()
        
        # Determine file extension (defaulting to png for tiles)
        ext = "json" if target_url.endswith(".json") or ".json" in target_url else "png"
        content_type = "application/json" if ext == "json" else "image/png"
        cache_path = os.path.join(CACHE_DIR, f"{url_hash}.{ext}")

        if os.path.exists(cache_path):
            # Serve from cache
            # print(f"[Cache] Hit: {target_url}")
            self.send_response(200)
            self.send_header('Content-Type', content_type)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            with open(cache_path, 'rb') as f:
                self.wfile.write(f.read())
        else:
            # Fetch from Tianditu via Proxy
            # print(f"[Cache] Miss: {target_url}")
            try:
                proxies = {"http": PROXY_URL, "https": PROXY_URL}
                response = requests.get(target_url, proxies=proxies, timeout=10)
                
                if response.status_code == 200:
                    # Save to cache
                    with open(cache_path, 'wb') as f:
                        f.write(response.content)
                    
                    # Serve to client
                    self.send_response(200)
                    self.send_header('Content-Type', content_type)
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(response.content)
                else:
                    self.send_response(response.status_code)
                    self.end_headers()
            except Exception as e:
                print(f"[Error] Failed to fetch {target_url}: {e}")
                self.send_response(500)
                self.end_headers()

if __name__ == "__main__":
    print(f"Tianditu Tile Accelerator listening on port {LISTEN_PORT}...")
    print(f"Using proxy: {PROXY_URL}")
    server = HTTPServer(('0.0.0.0', LISTEN_PORT), TileCacheHandler)
    server.serve_forever()
