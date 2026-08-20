"""Acceptance tests for the SOCKS5-to-HTTP bridge (nas_proxy/cache_proxy.py).

Unlike the mock-based unit tests in test_cache_proxy.py, these exercise the
bridge against a REAL loopback TCP server that plays the role of the SOCKS5
proxy, and against real socketpairs for the relay. All expected byte strings
are hand-computed from RFC 1928. Test names use the bridge's domain language.
"""

import socket
import struct
import threading
import unittest

from nas_proxy import cache_proxy

# Hand-computed RFC 1928 bytes.
GREETING_NO_AUTH = b"\x05\x01\x00"  # version 5, 1 method offered: no-auth
SERVER_ACCEPT_NO_AUTH = b"\x05\x00"  # version 5, no-auth chosen
SERVER_REJECT_ALL_METHODS = b"\x05\xff"  # "no acceptable methods"


def connect_request(domain, port):
    """Hand-computed CONNECT request: ver 5, connect, rsv, ATYP=domain."""
    host = domain.encode()
    return b"\x05\x01\x00\x03" + bytes([len(host)]) + host + struct.pack("!H", port)


def connect_reply_success_ipv4():
    """Hand-computed success reply bound to 127.0.0.1:80 (ATYP=IPv4)."""
    return b"\x05\x00\x00\x01\x7f\x00\x00\x01\x00\x50"


def connect_reply_refused():
    """Hand-computed failure reply, status 0x05 = connection refused."""
    return b"\x05\x05\x00\x01\x7f\x00\x00\x01\x00\x50"


class FakeSocks5Proxy:
    """A real TCP listener that scripts one SOCKS5 server-side exchange."""

    def __init__(self, script):
        # script(conn, captured) runs in a thread; captured records client bytes.
        self.script = script
        self.captured = {}
        self.listener = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.listener.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.listener.bind(("127.0.0.1", 0))
        self.listener.listen(1)
        self.port = self.listener.getsockname()[1]
        self.thread = threading.Thread(target=self._serve, daemon=True)

    def _serve(self):
        conn, _ = self.listener.accept()
        with conn:
            self.script(conn, self.captured)

    def __enter__(self):
        self.thread.start()
        return self

    def __exit__(self, *_exc):
        self.thread.join(timeout=5)
        self.listener.close()
        return False


class TestSocks5HandshakeAcceptance(unittest.TestCase):
    def test_the_bridge_offers_no_authentication_to_the_proxy(self):
        def script(conn, captured):
            captured["greeting"] = conn.recv(3)
            conn.sendall(SERVER_ACCEPT_NO_AUTH)
            conn.recv(1024)  # swallow the connect request
            conn.sendall(connect_reply_success_ipv4())

        with FakeSocks5Proxy(script) as proxy:
            sock = cache_proxy.socks5_connect("127.0.0.1", proxy.port, "example.com", 443)
            sock.close()

        self.assertEqual(proxy.captured["greeting"], GREETING_NO_AUTH)

    def test_the_bridge_delegates_dns_to_the_proxy(self):
        # Domain-based addressing (ATYP=0x03): the hostname travels to the
        # proxy untouched, so DNS resolves on the proxy side, not locally.
        def script(conn, captured):
            conn.recv(3)  # swallow the greeting
            conn.sendall(SERVER_ACCEPT_NO_AUTH)
            expected = connect_request("tile0.tianditu.gov.cn", 443)
            request = b""
            while len(request) < len(expected):
                request += conn.recv(1024)
            captured["request"] = request
            conn.sendall(connect_reply_success_ipv4())

        with FakeSocks5Proxy(script) as proxy:
            sock = cache_proxy.socks5_connect("127.0.0.1", proxy.port, "tile0.tianditu.gov.cn", 443)
            sock.close()

        self.assertEqual(
            proxy.captured["request"],
            connect_request("tile0.tianditu.gov.cn", 443),
        )

    def test_when_the_proxy_accepts_the_tunnel_carries_traffic(self):
        def script(conn, captured):
            conn.recv(3)
            conn.sendall(SERVER_ACCEPT_NO_AUTH)
            conn.recv(1024)
            conn.sendall(connect_reply_success_ipv4())
            captured["payload"] = conn.recv(1024)
            conn.sendall(b"HTTP/1.1 200 OK\r\n\r\n")

        with FakeSocks5Proxy(script) as proxy:
            sock = cache_proxy.socks5_connect("127.0.0.1", proxy.port, "example.com", 80)
            sock.sendall(b"GET / HTTP/1.1\r\n\r\n")
            reply = sock.recv(1024)
            sock.close()

        self.assertEqual(proxy.captured["payload"], b"GET / HTTP/1.1\r\n\r\n")
        self.assertEqual(reply, b"HTTP/1.1 200 OK\r\n\r\n")

    def test_when_the_proxy_rejects_every_auth_method_the_attempt_fails(self):
        def script(conn, captured):
            conn.recv(3)
            conn.sendall(SERVER_REJECT_ALL_METHODS)

        with FakeSocks5Proxy(script) as proxy:
            with self.assertRaises(Exception) as ctx:
                cache_proxy.socks5_connect("127.0.0.1", proxy.port, "example.com", 443)

        self.assertIn("auth rejected", str(ctx.exception))

    def test_when_the_proxy_refuses_the_destination_the_attempt_fails(self):
        def script(conn, captured):
            conn.recv(3)
            conn.sendall(SERVER_ACCEPT_NO_AUTH)
            conn.recv(1024)
            conn.sendall(connect_reply_refused())

        with FakeSocks5Proxy(script) as proxy:
            with self.assertRaises(Exception) as ctx:
                cache_proxy.socks5_connect("127.0.0.1", proxy.port, "example.com", 443)

        self.assertIn("connect failed", str(ctx.exception))


class TestRelayAcceptance(unittest.TestCase):
    def test_the_relay_carries_bytes_in_both_directions_until_a_side_hangs_up(self):
        browser_near, browser_far = socket.socketpair()
        proxy_near, proxy_far = socket.socketpair()

        relay_thread = threading.Thread(
            target=cache_proxy.relay, args=(browser_near, proxy_near), daemon=True
        )
        relay_thread.start()

        # Browser -> proxy direction.
        browser_far.sendall(b"CONNECT tile0.tianditu.gov.cn:443")
        self.assertEqual(proxy_far.recv(1024), b"CONNECT tile0.tianditu.gov.cn:443")

        # Proxy -> browser direction.
        proxy_far.sendall(b"HTTP/1.1 200 Connection Established\r\n\r\n")
        self.assertEqual(
            browser_far.recv(1024), b"HTTP/1.1 200 Connection Established\r\n\r\n"
        )

        # A hang-up on either side ends the relay.
        browser_far.close()
        relay_thread.join(timeout=10)
        self.assertFalse(relay_thread.is_alive())

        proxy_far.close()
        browser_near.close()
        proxy_near.close()


if __name__ == "__main__":
    unittest.main()
