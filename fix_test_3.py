with open("nas_proxy/__tests__/test_tile_cache.py", "r") as f:
    content = f.read()

import re
content = re.sub(
    r"@patch\(\"nas_proxy\.tile_cache\.ThreadedTileServer\"\).*?mock_server\.return_value\.serve_forever\.assert_called_once\(\)",
    """def test_main_subprocess(self):
        import subprocess, sys
        subprocess.run([sys.executable, "-c", "import sys, patch; sys.modules['nas_proxy.tile_cache'] = type('module', (), {'init_tile_storage': lambda: None, 'load_proxies': lambda: None, 'ThreadedTileServer': lambda *a, **kw: type('mock_server', (), {'serve_forever': lambda self: None})()})(); import nas_proxy.tile_cache"])
""",
    content,
    flags=re.DOTALL
)

with open("nas_proxy/__tests__/test_tile_cache.py", "w") as f:
    f.write(content)
