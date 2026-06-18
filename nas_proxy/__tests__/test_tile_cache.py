import unittest
from unittest.mock import patch, MagicMock, mock_open
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from nas_proxy import tile_cache

class TestTileCache(unittest.TestCase):
    @patch("nas_proxy.tile_cache.storage_get")
    def test_storage_get_mocked(self, mock_get):
        pass

    @patch("nas_proxy.tile_cache.ctypes.CDLL")
    def test_init_tile_storage(self, mock_cdll):
        # mock CDLL loading
        mock_lib = MagicMock()
        mock_cdll.return_value = mock_lib
        mock_lib.init_tile_storage.return_value = 0
        tile_cache.init_tile_storage()
        self.assertTrue(tile_cache._storage_ready)

        tile_cache._storage_ready = False
        mock_lib.init_tile_storage.return_value = -1
        tile_cache.init_tile_storage()
        self.assertFalse(tile_cache._storage_ready)

        mock_cdll.side_effect = Exception("error")
        tile_cache.init_tile_storage()
        self.assertFalse(tile_cache._storage_ready)

    def test_url_to_hash(self):
        h = tile_cache.url_to_hash("http://test.com")
        self.assertIsInstance(h, int)

    @patch("nas_proxy.tile_cache.os.makedirs")
    @patch("nas_proxy.tile_cache.os.path.exists")
    def test_disk_put_get(self, mock_exists, mock_makedirs):
        # disk_get
        mock_exists.return_value = False
        self.assertIsNone(tile_cache.disk_get("http://test.com"))

        # disk_put
        mock_exists.return_value = True
        import builtins
        with patch("builtins.open", unittest.mock.mock_open(read_data=b"data")):
            self.assertEqual(tile_cache.disk_get("http://test.com"), b"data")
            tile_cache.disk_put("http://test.com", b"data")

    @patch("nas_proxy.tile_cache.socket.socket")
    def test_fetch_via_pool(self, mock_socket_class):
        mock_sock = MagicMock()
        mock_socket_class.return_value = mock_sock
        # sendall CONNECT ... recv 200 Connection Established -> send GET -> recv headers -> data
        mock_sock.recv.side_effect = [b"HTTP/1.1 200 Connection Established\r\n\r\n", b"HTTP/1.1 200 OK\r\nContent-Length: 8\r\n\r\nmockdata", b""]
        status, data = tile_cache.fetch_via_pool("http://test.com/tile?abc=1")
        self.assertEqual(data, b"mockdata")
        self.assertEqual(status, 200)

        # exception
        mock_sock.recv.side_effect = Exception("conn error")
        with self.assertRaises(Exception):
            tile_cache.fetch_via_pool("http://test.com/tile")


    @patch("nas_proxy.tile_cache.socket.socket")
    @patch("nas_proxy.tile_cache.load_proxies")
    def test_fetch_via_socks5(self, mock_load, mock_socket_class):
        mock_load.return_value = [("1.1.1.1", 1080)]
        mock_sock = MagicMock()
        mock_socket_class.return_value = mock_sock

        with patch("nas_proxy.tile_cache.socks5_connect") as mock_connect:
            mock_connect.return_value = mock_sock
            mock_sock.recv.side_effect = [b"HTTP/1.1 200 OK\r\nContent-Length: 4\r\n\r\ndata", b""]
            status, data = tile_cache.fetch_via_socks5("http://map.tianditu.gov.cn/tile")
            self.assertEqual(data, b"data")
            self.assertEqual(status, 200)

            mock_connect.return_value = mock_sock
            mock_sock.recv.side_effect = [b"HTTP/1.1 200 OK\r\nTransfer-Encoding: chunked\r\n\r\n4\r\ndata\r\n0\r\n\r\n", b""]
            status, data = tile_cache.fetch_via_socks5("http://map.tianditu.gov.cn/tile")
            self.assertEqual(data, b"data")
            self.assertEqual(status, 200)

            # exception
            mock_connect.side_effect = Exception("error")
            with self.assertRaises(Exception):
                tile_cache.fetch_via_socks5("http://map.tianditu.gov.cn/tile")

    @patch("nas_proxy.tile_cache.storage_get")
    @patch("nas_proxy.tile_cache.disk_get")
    @patch("nas_proxy.tile_cache.fetch_via_pool")
    @patch("nas_proxy.tile_cache.storage_put")
    @patch("nas_proxy.tile_cache.disk_put")
    def test_handler_do_GET(self, mock_dput, mock_sput, mock_fetch, mock_dget, mock_sget):
        from io import BytesIO
        class MockRequest:
            def __init__(self):
                self.rfile = BytesIO(b"GET /?url=http://map.tianditu.gov.cn/tile HTTP/1.1\r\nHost: localhost\r\n\r\n")
                self.wfile = BytesIO()
            def makefile(self, *args, **kwargs):
                if args[0] == 'rb': return self.rfile
                return self.wfile
            def sendall(self, data):
                self.wfile.write(data)
            def close(self): pass

        mock_req = MockRequest()
        mock_sget.return_value = b"cached_data"
        handler = tile_cache.TileCacheHandler(mock_req, ("127.0.0.1", 12345), MagicMock())
        self.assertIn(b"cached_data", mock_req.wfile.getvalue())

        # Test cache miss
        mock_req = MockRequest()
        mock_sget.return_value = None
        mock_dget.return_value = None
        mock_fetch.return_value = (200, b"fetched_data")
        handler = tile_cache.TileCacheHandler(mock_req, ("127.0.0.1", 12345), MagicMock())
        self.assertIn(b"fetched_data", mock_req.wfile.getvalue())

        # test fail fetch pool
        mock_req = MockRequest()
        mock_sget.return_value = None
        mock_dget.return_value = None
        mock_fetch.return_value = None
        with patch("nas_proxy.tile_cache.fetch_via_socks5") as mock_socks:
            mock_socks.return_value = None
            handler = tile_cache.TileCacheHandler(mock_req, ("127.0.0.1", 12345), MagicMock())
            self.assertIn(b"502", mock_req.wfile.getvalue())

    def test_storage_put_get_real(self):
        old_ready = tile_cache._storage_ready
        old_storage = tile_cache._storage
        try:
            tile_cache._storage_ready = True
            mock_storage = MagicMock()
            tile_cache._storage = mock_storage

            with patch("nas_proxy.tile_cache.disk_get") as mock_disk_get:
                with patch("nas_proxy.tile_cache.disk_put") as mock_disk_put:

                    def side_effect(h, byref_val):
                        byref_val._obj.value = 4
                        return 12345

                    mock_storage.get_tile_data.side_effect = side_effect

                    with patch("nas_proxy.tile_cache.ctypes.string_at") as mock_str_at:
                        mock_str_at.return_value = b"data"
                        res = tile_cache.storage_get("http://test.com")
                        self.assertEqual(res, b"data")

                    # Mock not finding in storage
                    mock_storage.get_tile_data.side_effect = None
                    mock_storage.get_tile_data.return_value = 0
                    mock_disk_get.return_value = b"disk_data"
                    res = tile_cache.storage_get("http://test.com")
                    self.assertEqual(res, b"disk_data")

                    tile_cache._storage_ready = False
                    mock_disk_get.return_value = b"disk_data2"
                    res = tile_cache.storage_get("http://test.com")
                    self.assertEqual(res, b"disk_data2")
                    tile_cache._storage_ready = True

                    with patch("nas_proxy.tile_cache.ctypes.create_string_buffer"):
                        tile_cache.storage_put("http://test.com", b"new_data")
                        mock_storage.add_tile_data.assert_called()
                        mock_disk_put.assert_called()
        finally:
            tile_cache._storage_ready = old_ready
            tile_cache._storage = old_storage

    @patch("nas_proxy.tile_cache.os.path.getmtime")
    def test_load_proxies(self, mock_getmtime):
        mock_getmtime.return_value = 123.45
        with patch("builtins.open", mock_open(read_data="1.1.1.1:1080\n2.2.2.2:1080")):
            proxies = tile_cache.load_proxies()
            self.assertEqual(proxies, [("1.1.1.1", 1080), ("2.2.2.2", 1080)])

        # Test cache hit (mtime not changed)
        mock_getmtime.return_value = 123.45
        proxies = tile_cache.load_proxies()
        self.assertEqual(proxies, [("1.1.1.1", 1080), ("2.2.2.2", 1080)])

        # Test exception
        mock_getmtime.side_effect = Exception("error")
        proxies = tile_cache.load_proxies()
        self.assertEqual(proxies, [("1.1.1.1", 1080), ("2.2.2.2", 1080)])

    def test_socks5_connect(self):
        with patch("nas_proxy.tile_cache.socket.socket") as mock_socket_class:
            mock_sock = MagicMock()
            mock_socket_class.return_value = mock_sock
            mock_sock.recv.side_effect = [b"\x05\x00", b"\x05\x00\x00\x01\x01\x01\x01\x01\x00\x50", b""]
            sock = tile_cache.socks5_connect("1.1.1.1", 1080, "test.com", 80)
            self.assertEqual(sock, mock_sock)

            mock_sock.recv.side_effect = [b"\x05\x00", b"\x05\x00\x00\x03\x04test\x00\x50", b"\x04", b"test", b""]
            sock = tile_cache.socks5_connect("1.1.1.1", 1080, "test.com", 80)
            self.assertEqual(sock, mock_sock)

            mock_sock.recv.side_effect = [b"\x05\x00", b"\x05\x00\x00\x04\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x50", b""]
            sock = tile_cache.socks5_connect("1.1.1.1", 1080, "test.com", 80)
            self.assertEqual(sock, mock_sock)

            # Auth rejected
            mock_sock.recv.side_effect = [b"\x05\xff"]
            with self.assertRaises(Exception):
                tile_cache.socks5_connect("1.1.1.1", 1080, "test.com", 80)

            # Connect failed
            mock_sock.recv.side_effect = [b"\x05\x00", b"\x05\x01"]
            with self.assertRaises(Exception):
                tile_cache.socks5_connect("1.1.1.1", 1080, "test.com", 80)

if __name__ == '__main__':
    unittest.main()
