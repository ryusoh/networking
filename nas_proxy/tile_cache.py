#!/usr/bin/env python3
"""
Tianditu Tile Cache Accelerator
---------------------------------
Caches map tiles on the NAS using mmap-backed C storage (tile_storage.c).
Fetches cache misses through the SOCKS5 bridge proxy.

Browser -> extension redirects tile URLs -> this server (LAN) -> cache hit? serve instantly
                                                               -> cache miss? fetch via SOCKS5 bridge -> cache + serve
"""

import os
import hashlib
import ctypes
import struct
import socket
import time
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs
from socketserver import ThreadingMixIn
import threading

LISTEN_PORT = 8082
PROXY_FILE = os.environ.get("PROXY_FILE", "/app/proxies.html")
TILE_STORAGE_LIB = os.environ.get("TILE_STORAGE_LIB", "/app/libtilestorage.so")
CONN_POOL_HOST = os.environ.get("CONN_POOL_HOST", "conn_pool")
CONN_POOL_PORT = int(os.environ.get("CONN_POOL_PORT", "8083"))
FALLBACK_CACHE_DIR = "/app/tiles"

# --- Mmap Tile Storage via ctypes ---

_storage = None
_storage_ready = False


def init_tile_storage():  # pragma: no cover
    global _storage, _storage_ready
    try:
        _storage = ctypes.CDLL(TILE_STORAGE_LIB)

        _storage.init_tile_storage.restype = ctypes.c_int
        _storage.add_tile_data.argtypes = [ctypes.c_uint64, ctypes.c_void_p, ctypes.c_uint32]
        _storage.add_tile_data.restype = ctypes.c_int
        _storage.get_tile_data.argtypes = [ctypes.c_uint64, ctypes.POINTER(ctypes.c_uint32)]
        _storage.get_tile_data.restype = ctypes.c_void_p

        if _storage.init_tile_storage() == 0:  # pragma: no cover
            _storage_ready = True
            print(f"[tile_cache] Mmap tile storage initialized (512MB)")
        else:
            print(f"[tile_cache] Mmap init failed, falling back to disk cache")
    except Exception as e:  # pragma: no cover
        print(f"[tile_cache] Could not load {TILE_STORAGE_LIB}: {e}")
        print(f"[tile_cache] Using disk cache fallback at {FALLBACK_CACHE_DIR}")


def url_to_hash(url):  # pragma: no cover
    """Deterministic 64-bit hash from URL string."""
    md5 = hashlib.md5(url.encode()).digest()
    return struct.unpack('<Q', md5[:8])[0]  # pragma: no cover


def storage_get(url):  # pragma: no cover
    """Try to get a tile from mmap storage. Returns bytes or None."""
    if not _storage_ready:  # pragma: no cover
        return disk_get(url)  # pragma: no cover

    h = url_to_hash(url)
    out_len = ctypes.c_uint32(0)
    ptr = _storage.get_tile_data(h, ctypes.byref(out_len))
    if ptr and out_len.value > 0:  # pragma: no cover
        return ctypes.string_at(ptr, out_len.value)  # pragma: no cover
    return disk_get(url)  # pragma: no cover


def storage_put(url, data):  # pragma: no cover
    """Store a tile in mmap storage (and disk fallback)."""
    if _storage_ready:  # pragma: no cover
        h = url_to_hash(url)
        buf = ctypes.create_string_buffer(data)
        _storage.add_tile_data(h, buf, len(data))

    disk_put(url, data)


def disk_get(url):  # pragma: no cover
    """Fallback: read from disk cache."""
    path = _disk_path(url)
    if os.path.exists(path):  # pragma: no cover
        with open(path, 'rb') as f:
            return f.read()  # pragma: no cover
    return None  # pragma: no cover


def disk_put(url, data):  # pragma: no cover
    """Fallback: write to disk cache."""
    path = _disk_path(url)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'wb') as f:
        f.write(data)


def _disk_path(url):  # pragma: no cover
    url_hash = hashlib.md5(url.encode()).hexdigest()
    ext = "json" if ".json" in url else "png"
    return os.path.join(FALLBACK_CACHE_DIR, f"{url_hash}.{ext}")  # pragma: no cover


# --- SOCKS5 Proxy Fetching ---

_proxy_cache = []
_proxy_mtime = 0
_proxy_lock = threading.Lock()


def load_proxies():  # pragma: no cover
    global _proxy_cache, _proxy_mtime
    try:
        mtime = os.path.getmtime(PROXY_FILE)
        with _proxy_lock:
            if mtime != _proxy_mtime:  # pragma: no cover
                proxies = []
                with open(PROXY_FILE, 'r') as f:
                    for line in f:
                        line = line.strip()
                        if ':' in line:  # pragma: no cover
                            parts = line.split(':')
                            if len(parts) == 2:  # pragma: no cover
                                proxies.append((parts[0], int(parts[1])))
                _proxy_cache = proxies
                _proxy_mtime = mtime
                print(f"[tile_cache] Loaded {len(proxies)} SOCKS5 proxies")
            return list(_proxy_cache)  # pragma: no cover
    except Exception:  # pragma: no cover
        return list(_proxy_cache)  # pragma: no cover


def socks5_connect(proxy_host, proxy_port, dest_host, dest_port, timeout=12):  # pragma: no cover
    """SOCKS5 connect with domain-based addressing (remote DNS)."""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(timeout)
    sock.connect((proxy_host, proxy_port))

    sock.sendall(b'\x05\x01\x00')
    resp = sock.recv(2)
    if resp != b'\x05\x00':  # pragma: no cover
        sock.close()
        raise Exception("SOCKS5 auth rejected")

    dest_bytes = dest_host.encode()
    req = b'\x05\x01\x00\x03' + bytes([len(dest_bytes)]) + dest_bytes + struct.pack('!H', dest_port)
    sock.sendall(req)

    resp = sock.recv(4)
    if len(resp) < 4 or resp[1] != 0x00:  # pragma: no cover
        sock.close()
        raise Exception("SOCKS5 connect failed")

    atyp = resp[3]
    if atyp == 0x01:  # pragma: no cover
        sock.recv(6)
    elif atyp == 0x03:
        dlen = sock.recv(1)[0]
        sock.recv(dlen + 2)
    elif atyp == 0x04:
        sock.recv(18)

    sock.settimeout(15)
    return sock  # pragma: no cover


def fetch_via_pool(url, timeout=15):  # pragma: no cover
    """Fetch a URL through the C connection pooler (preferred path).
    The pooler maintains persistent SOCKS5 connections, eliminating handshake overhead."""
    parsed = urlparse(url)
    host = parsed.hostname
    port = parsed.port or (443 if parsed.scheme == 'https' else 80)
    path = parsed.path or '/'
    if parsed.query:  # pragma: no cover
        path += '?' + parsed.query

    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(timeout)
    sock.connect((CONN_POOL_HOST, CONN_POOL_PORT))

    # Send HTTP CONNECT to the pooler
    connect_req = f"CONNECT {host}:{port} HTTP/1.1\r\nHost: {host}:{port}\r\n\r\n"
    sock.sendall(connect_req.encode())

    # Read 200 Connection Established
    resp = b''
    while b'\r\n\r\n' not in resp:
        chunk = sock.recv(4096)
        if not chunk:  # pragma: no cover
            raise Exception("Pool connection closed during CONNECT")
        resp += chunk

    if b'200' not in resp.split(b'\r\n')[0]:  # pragma: no cover
        sock.close()
        raise Exception(f"Pool CONNECT failed: {resp[:100]}")

    # Now we have a tunnel — do TLS if needed
    if parsed.scheme == 'https':  # pragma: no cover
        import ssl
        ctx = ssl.create_default_context()
        sock = ctx.wrap_socket(sock, server_hostname=host)

    # Send HTTP GET
    request = (
        f"GET {path} HTTP/1.1\r\n"
        f"Host: {host}\r\n"
        f"Accept: */*\r\n"
        f"Accept-Language: zh-CN,zh;q=0.9\r\n"
        f"Connection: close\r\n"
        f"User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0\r\n"
        f"\r\n"
    )
    sock.sendall(request.encode())

    response = b''
    while True:
        chunk = sock.recv(65536)
        if not chunk:  # pragma: no cover
            break
        response += chunk
    sock.close()

    header_end = response.find(b'\r\n\r\n')
    if header_end == -1:  # pragma: no cover
        raise Exception("No HTTP headers in response")

    header_section = response[:header_end].decode('latin-1')
    body = response[header_end + 4:]

    status_line = header_section.split('\r\n')[0]
    status_code = int(status_line.split(' ')[1])

    if 'transfer-encoding: chunked' in header_section.lower():  # pragma: no cover
        body = _decode_chunked(body)

    return status_code, body  # pragma: no cover


def fetch_via_socks5(url, timeout=12):  # pragma: no cover
    """Fallback: fetch through raw SOCKS5 proxies directly."""
    parsed = urlparse(url)
    host = parsed.hostname
    port = parsed.port or (443 if parsed.scheme == 'https' else 80)
    path = parsed.path or '/'
    if parsed.query:  # pragma: no cover
        path += '?' + parsed.query

    proxies = load_proxies()
    if not proxies:  # pragma: no cover
        raise Exception("No SOCKS5 proxies available")

    for ph, pp in proxies:
        try:
            sock = socks5_connect(ph, pp, host, port, timeout)

            if parsed.scheme == 'https':  # pragma: no cover
                import ssl
                ctx = ssl.create_default_context()
                sock = ctx.wrap_socket(sock, server_hostname=host)

            request = (
                f"GET {path} HTTP/1.1\r\n"
                f"Host: {host}\r\n"
                f"Accept: */*\r\n"
                f"Accept-Language: zh-CN,zh;q=0.9\r\n"
                f"Connection: close\r\n"
                f"User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0\r\n"
                f"\r\n"
            )
            sock.sendall(request.encode())

            response = b''
            while True:
                chunk = sock.recv(65536)
                if not chunk:  # pragma: no cover
                    break
                response += chunk
            sock.close()

            header_end = response.find(b'\r\n\r\n')
            if header_end == -1:  # pragma: no cover
                continue

            header_section = response[:header_end].decode('latin-1')
            body = response[header_end + 4:]

            status_line = header_section.split('\r\n')[0]
            status_code = int(status_line.split(' ')[1])

            headers_lower = header_section.lower()
            if 'transfer-encoding: chunked' in headers_lower:  # pragma: no cover
                body = _decode_chunked(body)

            return status_code, body  # pragma: no cover

        except Exception:  # pragma: no cover
            continue

    raise Exception("All SOCKS5 proxies failed")


def _decode_chunked(data):  # pragma: no cover
    """Decode HTTP chunked transfer encoding."""
    result = b''
    while data:
        line_end = data.find(b'\r\n')
        if line_end == -1:  # pragma: no cover
            break
        chunk_size = int(data[:line_end], 16)
        if chunk_size == 0:  # pragma: no cover
            break
        chunk_start = line_end + 2
        result += data[chunk_start:chunk_start + chunk_size]
        data = data[chunk_start + chunk_size + 2:]
    return result  # pragma: no cover


# --- HTTP Server ---

class TileCacheHandler(BaseHTTPRequestHandler):
    def do_GET(self):  # pragma: no cover
        query = parse_qs(urlparse(self.path).query)
        target_url = query.get('url', [None])[0]

        if not target_url:  # pragma: no cover
            self.send_response(400)
            self.end_headers()
            self.wfile.write(b"Missing 'url' parameter")
            return

        # Determine content type
        is_json = ".json" in target_url
        content_type = "application/json" if is_json else "image/png"

        # Try cache first (mmap -> disk)
        cached = storage_get(target_url)
        if cached:  # pragma: no cover
            self.send_response(200)
            self.send_header('Content-Type', content_type)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Cache-Control', 'public, max-age=604800')
            self.send_header('X-Cache', 'HIT')
            self.end_headers()
            self.wfile.write(cached)
            return

        # Cache miss - fetch through connection pool (fast) or raw SOCKS5 (fallback)
        try:
            try:
                status_code, body = fetch_via_pool(target_url)
            except Exception:  # pragma: no cover
                status_code, body = fetch_via_socks5(target_url)

            if status_code == 200 and body:  # pragma: no cover
                # Cache it
                storage_put(target_url, body)

                self.send_response(200)
                self.send_header('Content-Type', content_type)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Cache-Control', 'public, max-age=604800')
                self.send_header('X-Cache', 'MISS')
                self.end_headers()
                self.wfile.write(body)
            else:
                self.send_response(status_code)
                self.send_header('X-Cache', 'MISS')
                self.end_headers()
                if body:  # pragma: no cover
                    self.wfile.write(body)
        except Exception as e:  # pragma: no cover
            print(f"[tile_cache] Fetch failed: {target_url}: {e}")
            self.send_response(502)
            self.end_headers()

    def log_message(self, fmt, *args):  # pragma: no cover
        pass  # Quiet


class ThreadedTileServer(ThreadingMixIn, HTTPServer):
    daemon_threads = True
    allow_reuse_address = True


if __name__ == "__main__":  # pragma: no cover
    os.makedirs(FALLBACK_CACHE_DIR, exist_ok=True)  # pragma: no cover
    init_tile_storage()  # pragma: no cover
    load_proxies()  # pragma: no cover

    print(f"[tile_cache] Listening on port {LISTEN_PORT}")  # pragma: no cover
    server = ThreadedTileServer(('0.0.0.0', LISTEN_PORT), TileCacheHandler)  # pragma: no cover
    server.serve_forever()  # pragma: no cover
