import unittest
from unittest.mock import patch, MagicMock, mock_open
import sys
import os
import threading

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from nas_proxy import cache_proxy

class TestCacheProxy(unittest.TestCase):
    @patch("nas_proxy.cache_proxy.os.path.getmtime")
    def test_load_proxies(self, mock_getmtime):
        mock_getmtime.return_value = 1.0
        with patch("builtins.open", mock_open(read_data="1.1.1.1:1080\n2.2.2.2:1080")):
            proxies = cache_proxy.load_proxies()
            self.assertEqual(proxies, [("1.1.1.1", 1080), ("2.2.2.2", 1080)])

        # Test cache hit
        mock_getmtime.return_value = 1.0
        proxies = cache_proxy.load_proxies()
        self.assertEqual(proxies, [("1.1.1.1", 1080), ("2.2.2.2", 1080)])

        # Test exception
        mock_getmtime.side_effect = Exception("error")
        proxies = cache_proxy.load_proxies()
        self.assertEqual(proxies, [("1.1.1.1", 1080), ("2.2.2.2", 1080)])

    @patch("nas_proxy.cache_proxy.socket.socket")
    def test_socks5_connect(self, mock_socket_class):
        mock_sock = MagicMock()
        mock_socket_class.return_value = mock_sock

        mock_sock.recv.side_effect = [b"\x05\x00", b"\x05\x00\x00\x01\x01\x01\x01\x01\x00\x50", b""]
        sock = cache_proxy.socks5_connect("1.1.1.1", 1080, "test.com", 80)
        self.assertEqual(sock, mock_sock)

        mock_sock.recv.side_effect = [b"\x05\x00", b"\x05\x00\x00\x03\x04test\x00\x50", b"\x04", b"test", b""]
        sock = cache_proxy.socks5_connect("1.1.1.1", 1080, "test.com", 80)

        mock_sock.recv.side_effect = [b"\x05\x00", b"\x05\x00\x00\x04" + b"\x00"*16 + b"\x00\x50", b""]
        sock = cache_proxy.socks5_connect("1.1.1.1", 1080, "test.com", 80)

        mock_sock.recv.side_effect = [b"\x05\xff"]
        with self.assertRaises(Exception):
            cache_proxy.socks5_connect("1.1.1.1", 1080, "test.com", 80)

        mock_sock.recv.side_effect = [b"\x05\x00", b"\x05\x01"]
        with self.assertRaises(Exception):
            cache_proxy.socks5_connect("1.1.1.1", 1080, "test.com", 80)

    @patch("nas_proxy.cache_proxy.select.select")
    def test_relay(self, mock_select):
        sock1 = MagicMock()
        sock2 = MagicMock()

        # Test normal relay
        mock_select.side_effect = [
            ([sock1], [], []),
            ([sock2], [], []),
            ([], [], [])
        ]
        sock1.recv.side_effect = [b"data1", b""]
        sock2.recv.side_effect = [b"data2", b""]

        cache_proxy.relay(sock1, sock2, timeout=0.1)
        sock2.sendall.assert_called_with(b"data1")

        # Test exceptional condition
        mock_select.side_effect = [([], [], [sock1])]
        cache_proxy.relay(sock1, sock2, timeout=0.1)

        # Test exception
        mock_select.side_effect = Exception("error")
        cache_proxy.relay(sock1, sock2, timeout=0.1)

    @patch("nas_proxy.cache_proxy.load_proxies")
    @patch("nas_proxy.cache_proxy.socks5_connect")
    @patch("nas_proxy.cache_proxy.relay")
    def test_proxy_handler(self, mock_relay, mock_connect, mock_load):
        from io import BytesIO
        class MockRequest:
            def __init__(self):
                self.rfile = BytesIO(b"")
                self.wfile = BytesIO()
            def makefile(self, *args, **kwargs):
                return self.wfile
            def sendall(self, data):
                self.wfile.write(data)

        mock_load.return_value = []
        handler = cache_proxy.ProxyHandler(MockRequest(), ("127.0.0.1", 1234), MagicMock())
        # We can't really test BaseHTTPRequestHandler easily this way because it requires a full request
        # Let's mock the internal methods called by the server

        handler = cache_proxy.ProxyHandler.__new__(cache_proxy.ProxyHandler)
        handler.path = "test.com:443"
        handler.send_error = MagicMock()
        handler.send_response = MagicMock()
        handler.end_headers = MagicMock()
        handler.connection = MagicMock()

        # No proxies
        cache_proxy.ProxyHandler.do_CONNECT(handler)
        handler.send_error.assert_called()

        # Connect fails
        mock_load.return_value = [("1.1.1.1", 1080)]
        mock_connect.side_effect = Exception("error")
        cache_proxy.ProxyHandler.do_CONNECT(handler)

        # Connect succeeds
        mock_remote = MagicMock()
        mock_connect.side_effect = [mock_remote]
        cache_proxy.ProxyHandler.do_CONNECT(handler)
        handler.send_response.assert_called_with(200, "Connection Established")
        mock_remote.close.assert_called()

        # test exception in remote close
        mock_connect.side_effect = [mock_remote]
        mock_remote.close.side_effect = Exception("close err")
        cache_proxy.ProxyHandler.do_CONNECT(handler)

    @patch("nas_proxy.cache_proxy.ThreadedProxy")
    @patch("nas_proxy.cache_proxy.load_proxies")
    def test_run(self, mock_load, mock_proxy):
        mock_server = MagicMock()
        mock_proxy.return_value = mock_server
        cache_proxy.run()
        mock_server.serve_forever.assert_called()

if __name__ == '__main__':
    unittest.main()
