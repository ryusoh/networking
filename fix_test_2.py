import re
with open("nas_proxy/__tests__/test_tile_cache.py", "r") as f:
    content = f.read()
content = content.replace("tile_cache.main()", """
        with open("nas_proxy/tile_cache.py") as f2:
            code = f2.read()
        namespace = {"__name__": "__main__", "os": MagicMock(), "init_tile_storage": mock_init, "load_proxies": mock_load_proxies, "ThreadedTileServer": mock_server, "TileCacheHandler": MagicMock(), "LISTEN_PORT": 1234, "FALLBACK_CACHE_DIR": "test"}
        exec(code, namespace)
""")
with open("nas_proxy/__tests__/test_tile_cache.py", "w") as f:
    f.write(content)
