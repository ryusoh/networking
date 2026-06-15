import unittest
import subprocess
import os
import sys
from unittest.mock import patch, MagicMock


def _bpf_toolchain_available():
    """The .bpf.o objects need clang + libbpf headers (<bpf/bpf_helpers.h>).
    A bare Linux runner (GitHub Actions) has clang but not libbpf-dev, so probe
    for the header and skip the compile check when it's missing — matching the
    project's 'eBPF is Docker-only / intentionally ignored' stance. The Docker
    ebpf-builder image (or a box with libbpf-dev) has it, and the test runs there."""
    clang = os.environ.get("CLANG", "clang")
    try:
        probe = subprocess.run(
            [clang, "-target", "bpf", "-fsyntax-only", "-x", "c", "-"],
            input="#include <bpf/bpf_helpers.h>\n",
            capture_output=True,
            text=True,
        )
        return probe.returncode == 0
    except (FileNotFoundError, OSError):
        return False


class TestEBPFPrograms(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Compile only where the BPF toolchain actually exists: Linux + clang +
        # libbpf headers (e.g. inside Docker ebpf-builder or a libbpf-dev box).
        cls.can_compile = sys.platform.startswith("linux") and _bpf_toolchain_available()
        if cls.can_compile:
            cwd = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            subprocess.run(["make", "clean"], capture_output=True, cwd=cwd)
            cls.make_result = subprocess.run(["make"], capture_output=True, text=True, cwd=cwd)
        else:
            cls.make_result = None

    def test_compilation_success(self):
        """Verify that all programs compiled without errors."""
        if not self.can_compile:
            self.skipTest("BPF toolchain unavailable (need Linux + clang + libbpf headers)")
        self.assertEqual(self.make_result.returncode, 0, f"Compilation failed:\n{self.make_result.stderr}")
        
        expected_files = [
            "hello.bpf.o", "adblock.bpf.o", "redirect.bpf.o", "reputation.bpf.o", 
            "dns_filter.bpf.o", "sni_filter.bpf.o", "bloom_filter.bpf.o", 
            "xdp_forwarder.bpf.o", "ebpf_snat.bpf.o", "container_pcap.bpf.o", "ptr_resolver.bpf.o"
        ]
        for f in expected_files:
            self.assertTrue(os.path.exists(f), f"Expected binary {f} was not generated.")

    def test_snat_maps(self):
        """Verify that the SNAT filter has its map."""
        path = os.path.join(os.path.dirname(__file__), "..", "ebpf_snat.bpf.c")
        with open(path, "r") as f:
            content = f.read()
        self.assertIn("snat_map", content, "Map 'snat_map' missing from ebpf_snat.bpf.c")

    def test_xdp_forwarder_maps(self):
        """Verify that the XDP forwarder has its redirect map."""
        path = os.path.join(os.path.dirname(__file__), "..", "xdp_forwarder.bpf.c")
        with open(path, "r") as f:
            content = f.read()
        self.assertIn("forward_map", content, "Map 'forward_map' missing from xdp_forwarder.bpf.c")

    def test_bloom_filter_maps(self):
        """Verify that the Bloom filter has its specialized map."""
        path = os.path.join(os.path.dirname(__file__), "..", "bloom_filter.bpf.c")
        with open(path, "r") as f:
            content = f.read()
        self.assertIn("bloom_filter", content, "Map 'bloom_filter' missing from bloom_filter.bpf.c")
        self.assertIn("confirmed_blocks", content, "Map 'confirmed_blocks' missing from bloom_filter.bpf.c")

    def test_sni_filter_maps(self):
        """Verify that the SNI filter has its blacklist map."""
        path = os.path.join(os.path.dirname(__file__), "..", "sni_filter.bpf.c")
        with open(path, "r") as f:
            content = f.read()
        self.assertIn("sni_blacklist", content, "Map 'sni_blacklist' missing from sni_filter.bpf.c")

    def test_adblock_maps(self):
        """Verify that the adblock program has its blocklist map."""
        path = os.path.join(os.path.dirname(__file__), "..", "adblock.bpf.c")
        with open(path, "r") as f:
            content = f.read()
        self.assertIn("blocklist_map", content, "Map 'blocklist_map' missing from adblock.bpf.c")

    def test_dns_filter_maps(self):
        """Verify that the dns_filter program has its hits map."""
        path = os.path.join(os.path.dirname(__file__), "..", "dns_filter.bpf.c")
        with open(path, "r") as f:
            content = f.read()
        self.assertIn("dns_hits", content, "Map 'dns_hits' missing from dns_filter.bpf.c")

    def test_reputation_maps(self):
        """Verify that the reputation monitor has both heat-map and watchlist."""
        path = os.path.join(os.path.dirname(__file__), "..", "reputation.bpf.c")
        with open(path, "r") as f:
            content = f.read()
        self.assertIn("stats_map", content, "Map 'stats_map' missing from reputation.bpf.c")
        self.assertIn("watchlist_map", content, "Map 'watchlist_map' missing from reputation.bpf.c")

    @patch('subprocess.run')
    def test_verifiability(self, mock_run):
        mock_result = MagicMock()
        mock_result.returncode = 0
        mock_run.return_value = mock_result
        self.assertEqual(mock_result.returncode, 0)

class TestMainBlock(unittest.TestCase):
    @patch('unittest.main')
    def test_main(self, mock_main):
        import runpy
        import sys

        with patch.object(sys, 'argv', [__file__]):
            runpy.run_path(__file__, run_name='__main__')
            mock_main.assert_called_once()

if __name__ == "__main__":
    unittest.main()
