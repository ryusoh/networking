import unittest
from unittest.mock import patch, MagicMock, mock_open
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from nas_proxy import cache_proxy

class TestCacheProxy(unittest.TestCase):
    @patch("nas_proxy.cache_proxy.os.path.exists")
    @patch("nas_proxy.cache_proxy.os.path.getmtime")
    def test_load_proxies(self, mock_mtime, mock_exists):
        mock_exists.return_value = True
        mock_mtime.return_value = 1000

        m_open = mock_open(read_data="1.1.1.1:1080\n2.2.2.2:1080\n")
        with patch("builtins.open", m_open):
            cache_proxy.load_proxies()
            self.assertEqual(len(cache_proxy._proxy_cache), 2)
            self.assertEqual(cache_proxy._proxy_cache[0], ("1.1.1.1", 1080))

    @patch("nas_proxy.cache_proxy.socket.socket")
    def test_socks5_connect_success(self, mock_socket_class):
        mock_sock = MagicMock()
        mock_socket_class.return_value = mock_sock

        # SOCKS5 Handshake needs responses
        # 1. auth response: \x05\x00
        # 2. connect response: \x05\x00\x00\x01\x00\x00\x00\x00\x00\x00
        mock_sock.recv.side_effect = [b"\x05\x00", b"\x05\x00\x00\x01", b"\x00\x00\x00\x00\x00\x00", b""]

        sock = cache_proxy.socks5_connect("1.1.1.1", 1080, "map.tianditu.gov.cn", 443)
        self.assertIsNotNone(sock)

    @patch("nas_proxy.cache_proxy.socket.socket")
    def test_socks5_connect_fail_auth(self, mock_socket_class):
        mock_sock = MagicMock()
        mock_socket_class.return_value = mock_sock
        mock_sock.recv.return_value = b"\x05\xff"

        with self.assertRaises(Exception):
            cache_proxy.socks5_connect("1.1.1.1", 1080, "map.tianditu.gov.cn", 443)

    @patch("nas_proxy.cache_proxy.socket.socket")
    def test_socks5_connect_fail_connect(self, mock_socket_class):
        mock_sock = MagicMock()
        mock_socket_class.return_value = mock_sock
        mock_sock.recv.side_effect = [b"\x05\x00", b"\x05\x01"]

        with self.assertRaises(Exception):
            cache_proxy.socks5_connect("1.1.1.1", 1080, "map.tianditu.gov.cn", 443)

    @patch("nas_proxy.cache_proxy.select.select")
    def test_relay(self, mock_select):
        sock1 = MagicMock()
        sock2 = MagicMock()

        # Test basic data relay
        sock1.recv.return_value = b"data"
        sock2.recv.return_value = b""

        # We need select to return sock1 the first time, then sock2 the second to exit loop
        mock_select.side_effect = [([sock1], [], []), ([sock2], [], [])]

        cache_proxy.relay(sock1, sock2)

        self.assertTrue(sock2.sendall.called)



    @patch("nas_proxy.cache_proxy.load_proxies")
    @patch("nas_proxy.cache_proxy.socks5_connect")
    @patch("nas_proxy.cache_proxy.relay")
    def test_handler_do_connect(self, mock_relay, mock_connect, mock_load):
        from io import BytesIO
        class MockRequest:
            def __init__(self):
                self.rfile = BytesIO(b"CONNECT map.tianditu.gov.cn:443 HTTP/1.1\r\nHost: map.tianditu.gov.cn:443\r\n\r\n")
                self.wfile = BytesIO()
            def makefile(self, *args, **kwargs):
                if args[0] == 'rb': return self.rfile
                return self.wfile
            def sendall(self, data):
                self.wfile.write(data)
            def close(self):
                pass

        mock_req = MockRequest()
        mock_client_address = ("127.0.0.1", 12345)
        mock_server = MagicMock()

        # mock socks
        mock_target_sock = MagicMock()
        mock_connect.return_value = mock_target_sock
        mock_load.return_value = [("1.1.1.1", 1080)]

        cache_proxy._proxy_cache = [("1.1.1.1", 1080)]

        handler = cache_proxy.ProxyHandler(mock_req, mock_client_address, mock_server)

        # verify connection established
        self.assertIn(b"200 Connection Established", mock_req.wfile.getvalue())
        self.assertTrue(mock_relay.called)

    @patch("nas_proxy.cache_proxy.load_proxies")
    @patch("nas_proxy.cache_proxy.socks5_connect")
    def test_handler_do_connect_fail(self, mock_connect, mock_load):
        from io import BytesIO
        class MockRequest:
            def __init__(self):
                self.rfile = BytesIO(b"CONNECT map.tianditu.gov.cn:443 HTTP/1.1\r\nHost: map.tianditu.gov.cn:443\r\n\r\n")
                self.wfile = BytesIO()
            def makefile(self, *args, **kwargs):
                if args[0] == 'rb': return self.rfile
                return self.wfile
            def sendall(self, data):
                self.wfile.write(data)
            def close(self):
                pass

        mock_req = MockRequest()
        mock_client_address = ("127.0.0.1", 12345)
        mock_server = MagicMock()

        mock_connect.side_effect = Exception("conn failed")
        mock_load.return_value = [("1.1.1.1", 1080)]

        cache_proxy._proxy_cache = [("1.1.1.1", 1080)]

        handler = cache_proxy.ProxyHandler(mock_req, mock_client_address, mock_server)

        self.assertIn(b"502 All proxies failed", mock_req.wfile.getvalue())



    @patch("nas_proxy.cache_proxy.os.path.exists")
    def test_load_proxies_error(self, mock_exists):
        mock_exists.side_effect = Exception("error")
        proxies = cache_proxy.load_proxies()
        self.assertEqual(type(proxies), list)

    @patch("nas_proxy.cache_proxy.socket.socket")
    def test_socks5_connect_atyp_3(self, mock_socket_class):
        mock_sock = MagicMock()
        mock_socket_class.return_value = mock_sock
        mock_sock.recv.side_effect = [b"\x05\x00", b"\x05\x00\x00\x03\x04", b"abcd\x00\x00", b""]
        sock = cache_proxy.socks5_connect("1.1.1.1", 1080, "map.tianditu.gov.cn", 443)
        self.assertIsNotNone(sock)

    @patch("nas_proxy.cache_proxy.socket.socket")
    def test_socks5_connect_atyp_4(self, mock_socket_class):
        mock_sock = MagicMock()
        mock_socket_class.return_value = mock_sock
        # \x05\x00\x00\x04 + 16 bytes ipv6 + 2 bytes port
        mock_sock.recv.side_effect = [b"\x05\x00", b"\x05\x00\x00\x04\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00", b""]
        sock = cache_proxy.socks5_connect("1.1.1.1", 1080, "map.tianditu.gov.cn", 443)
        self.assertIsNotNone(sock)

    @patch("nas_proxy.cache_proxy.select.select")
    def test_relay_exception(self, mock_select):
        sock1 = MagicMock()
        sock2 = MagicMock()
        mock_select.side_effect = Exception("select error")
        cache_proxy.relay(sock1, sock2)

    @patch("nas_proxy.cache_proxy.load_proxies")
    @patch("nas_proxy.cache_proxy.socks5_connect")
    def test_handler_no_proxies(self, mock_connect, mock_load):
        mock_load.return_value = []
        from io import BytesIO
        class MockRequest:
            def __init__(self):
                self.rfile = BytesIO(b"CONNECT map.tianditu.gov.cn:443 HTTP/1.1\r\nHost: map.tianditu.gov.cn:443\r\n\r\n")
                self.wfile = BytesIO()
            def makefile(self, *args, **kwargs):
                if args[0] == 'rb': return self.rfile
                return self.wfile
            def sendall(self, data):
                self.wfile.write(data)
            def close(self): pass
        mock_req = MockRequest()
        handler = cache_proxy.ProxyHandler(mock_req, ("127.0.0.1", 12345), MagicMock())
        self.assertIn(b"502 No proxies available", mock_req.wfile.getvalue())

    @patch("nas_proxy.cache_proxy.load_proxies")
    @patch("nas_proxy.cache_proxy.ThreadedProxy")
    def test_run(self, mock_server, mock_load):
        mock_instance = MagicMock()
        mock_server.return_value = mock_instance
        cache_proxy.run()
        self.assertTrue(mock_instance.serve_forever.called)

if __name__ == '__main__':
    unittest.main()
