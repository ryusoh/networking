#!/usr/bin/env python3
"""
Tianditu SOCKS5-to-HTTP Bridge Proxy
--------------------------------------
Browser connects via standard HTTP CONNECT (fast, Chrome-optimized).
This proxy handles SOCKS5 protocol on the NAS side and provides:
- Automatic failover between verified SOCKS5 proxies
- Threading for concurrent requests (Chrome opens 6+ connections)
- Connection error recovery without browser-side SOCKS5 timeouts
"""

import http.server
import socketserver
import socket
import struct
import select
import time
import os
import threading

LISTEN_PORT = 3128
PROXY_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "proxies.html")

_proxy_cache = []
_proxy_cache_mtime = 0
_proxy_lock = threading.Lock()


def load_proxies():
    """Load verified SOCKS5 proxies, with file change detection."""
    global _proxy_cache, _proxy_cache_mtime
    try:
        mtime = os.path.getmtime(PROXY_FILE)
        with _proxy_lock:
            if mtime != _proxy_cache_mtime:
                proxies = []
                with open(PROXY_FILE, 'r') as f:
                    for line in f:
                        line = line.strip()
                        if ':' in line:
                            parts = line.split(':')
                            if len(parts) == 2:
                                proxies.append((parts[0], int(parts[1])))
                _proxy_cache = proxies
                _proxy_cache_mtime = mtime
                print(f"[proxy] Loaded {len(proxies)} proxies from {PROXY_FILE}")
            return list(_proxy_cache)
    except Exception as e:
        print(f"[proxy] Error loading proxies: {e}")
        return list(_proxy_cache)


def socks5_connect(proxy_host, proxy_port, dest_host, dest_port, timeout=12):
    """Connect to dest through a SOCKS5 proxy with domain-based addressing (remote DNS)."""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(timeout)
    sock.connect((proxy_host, proxy_port))

    # Greeting: version 5, 1 method (no auth)
    sock.sendall(b'\x05\x01\x00')
    resp = sock.recv(2)
    if resp != b'\x05\x00':
        sock.close()
        raise Exception("SOCKS5 auth rejected")

    # Connect: version 5, cmd connect, reserved, address type domain (0x03)
    dest_bytes = dest_host.encode()
    req = b'\x05\x01\x00\x03' + bytes([len(dest_bytes)]) + dest_bytes + struct.pack('!H', dest_port)
    sock.sendall(req)

    # Read response (at least 4 bytes header)
    resp = sock.recv(4)
    if len(resp) < 4 or resp[1] != 0x00:
        sock.close()
        raise Exception(f"SOCKS5 connect failed (status {resp[1] if len(resp) > 1 else '?'})")

    # Consume remaining response bytes based on address type
    atyp = resp[3]
    if atyp == 0x01:  # IPv4
        sock.recv(4 + 2)
    elif atyp == 0x03:  # Domain
        dlen = sock.recv(1)[0]
        sock.recv(dlen + 2)
    elif atyp == 0x04:  # IPv6
        sock.recv(16 + 2)

    sock.settimeout(60)
    return sock


def relay(sock1, sock2, timeout=120):
    """Bidirectional relay between two sockets."""
    socks = [sock1, sock2]
    deadline = time.time() + timeout
    try:
        while time.time() < deadline:
            readable, _, exceptional = select.select(socks, [], socks, 5.0)
            if exceptional:
                break
            for s in readable:
                data = s.recv(65536)
                if not data:
                    return
                other = sock2 if s is sock1 else sock1
                other.sendall(data)
                deadline = time.time() + timeout
    except Exception:
        pass


class ProxyHandler(http.server.BaseHTTPRequestHandler):
    def do_CONNECT(self):
        host, _, port = self.path.partition(':')
        port = int(port) if port else 443

        proxies = load_proxies()
        if not proxies:
            self.send_error(502, "No proxies available")
            return

        remote = None
        for ph, pp in proxies:
            try:
                remote = socks5_connect(ph, pp, host, port)
                break
            except Exception:
                continue

        if not remote:
            self.send_error(502, "All proxies failed")
            return

        self.send_response(200, "Connection Established")
        self.end_headers()

        relay(self.connection, remote)
        try:
            remote.close()
        except Exception:
            pass

    def log_message(self, fmt, *args):
        pass  # Quiet


class ThreadedProxy(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True


def run():
    load_proxies()
    server = ThreadedProxy(('0.0.0.0', LISTEN_PORT), ProxyHandler)
    print(f"[*] SOCKS5-to-HTTP Bridge listening on :{LISTEN_PORT}")
    server.serve_forever()


if __name__ == '__main__':
    run()
