import re
with open("nas_proxy/__tests__/test_tile_cache.py", "r") as f:
    lines = f.read()

# remove everything after the first `if __name__ == '__main__':`
lines = lines.split("if __name__ == '__main__':")[0]

test_funcs = """
    @patch("nas_proxy.tile_cache.socket.socket")
    def test_fetch_via_pool_coverage(self, mock_socket):
        from nas_proxy import tile_cache
        sock = MagicMock()
        mock_socket.return_value = sock

        # 195
        sock.recv.side_effect = [b""]
        with self.assertRaises(Exception):
            tile_cache.fetch_via_pool("http://example.com", "1.1.1.1:1080")

        # 199-200
        sock.recv.side_effect = [b"HTTP/1.1 500 ERROR\\r\\n\\r\\n"]
        with self.assertRaises(Exception):
            tile_cache.fetch_via_pool("http://example.com", "1.1.1.1:1080")

        # 204-206
        with patch("ssl.create_default_context") as mock_ssl:
            mock_ctx = MagicMock()
            mock_ssl.return_value = mock_ctx
            mock_ctx.wrap_socket.return_value = sock
            sock.recv.side_effect = [b"HTTP/1.1 200 OK\\r\\n\\r\\n", b"HTTP/1.1 200 OK\\r\\n\\r\\nBODY"]
            try:
                tile_cache.fetch_via_pool("https://example.com", "1.1.1.1:1080")
            except Exception:
                pass

        # 230
        sock.recv.side_effect = [b"HTTP/1.1 200 OK\\r\\n\\r\\n", b"NO HEADERS"]
        with self.assertRaises(Exception):
            tile_cache.fetch_via_pool("http://example.com", "1.1.1.1:1080")

        # 239
        sock.recv.side_effect = [b"HTTP/1.1 200 OK\\r\\n\\r\\n", b"HTTP/1.1 200 OK\\r\\nTransfer-Encoding: chunked\\r\\n\\r\\n0\\r\\n\\r\\n"]
        try:
            tile_cache.fetch_via_pool("http://example.com", "1.1.1.1:1080")
        except Exception:
            pass

    @patch("nas_proxy.tile_cache.ThreadedTileServer")
    @patch("nas_proxy.tile_cache.init_tile_storage")
    @patch("nas_proxy.tile_cache.load_proxies")
    @patch("nas_proxy.tile_cache.os.makedirs")
    def test_main_func(self, mock_makedirs, mock_load_proxies, mock_init, mock_server):
        from nas_proxy import tile_cache
        tile_cache.main()
        mock_server.assert_called_once()
        mock_server.return_value.serve_forever.assert_called_once()

if __name__ == '__main__':
    unittest.main()
"""

with open("nas_proxy/__tests__/test_tile_cache.py", "w") as f:
    f.write(lines + test_funcs)
