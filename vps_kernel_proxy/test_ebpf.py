import unittest
import subprocess
import os

class TestEBPFPrograms(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Run make to ensure everything is compiled before testing
        subprocess.run(["make", "clean"], capture_output=True)
        cls.make_result = subprocess.run(["make"], capture_output=True, text=True)

    def test_compilation_success(self):
        """Verify that all programs compiled without errors."""
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
        with open("ebpf_snat.bpf.c", "r") as f:
            content = f.read()
        self.assertIn("snat_map", content, "Map 'snat_map' missing from ebpf_snat.bpf.c")

    def test_xdp_forwarder_maps(self):
        """Verify that the XDP forwarder has its redirect map."""
        with open("xdp_forwarder.bpf.c", "r") as f:
            content = f.read()
        self.assertIn("forward_map", content, "Map 'forward_map' missing from xdp_forwarder.bpf.c")

    def test_bloom_filter_maps(self):
        """Verify that the Bloom filter has its specialized map."""
        with open("bloom_filter.bpf.c", "r") as f:
            content = f.read()
        self.assertIn("bloom_filter", content, "Map 'bloom_filter' missing from bloom_filter.bpf.c")
        self.assertIn("confirmed_blocks", content, "Map 'confirmed_blocks' missing from bloom_filter.bpf.c")

    def test_sni_filter_maps(self):
        """Verify that the SNI filter has its blacklist map."""
        with open("sni_filter.bpf.c", "r") as f:
            content = f.read()
        self.assertIn("sni_blacklist", content, "Map 'sni_blacklist' missing from sni_filter.bpf.c")

    def test_adblock_maps(self):
        """Verify that the adblock program has its blocklist map."""
        with open("adblock.bpf.c", "r") as f:
            content = f.read()
        self.assertIn("blocklist_map", content, "Map 'blocklist_map' missing from adblock.bpf.c")

    def test_dns_filter_maps(self):
        """Verify that the dns_filter program has its hits map."""
        with open("dns_filter.bpf.c", "r") as f:
            content = f.read()
        self.assertIn("dns_hits", content, "Map 'dns_hits' missing from dns_filter.bpf.c")

    def test_reputation_maps(self):
        """Verify that the reputation monitor has both heat-map and watchlist."""
        with open("reputation.bpf.c", "r") as f:
            content = f.read()
        self.assertIn("stats_map", content, "Map 'stats_map' missing from reputation.bpf.c")
        self.assertIn("watchlist_map", content, "Map 'watchlist_map' missing from reputation.bpf.c")

if __name__ == "__main__":
    unittest.main()
