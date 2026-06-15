import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import unittest
import subprocess
import os
import signal
import time
import socket


def _icmp_available():
    """True if this process can send ICMP echoes the way netmon/lan_scanner do:
    an unprivileged SOCK_DGRAM ICMP socket, or root (raw socket fallback)."""
    try:
        socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_ICMP).close()
        return True
    except OSError:
        return hasattr(os, "geteuid") and os.geteuid() == 0


def _iface_exists(name):
    """True if a network interface named `name` is present on this host."""
    try:
        return any(iface == name for _, iface in socket.if_nameindex())
    except (OSError, AttributeError):
        return False


class TestNasTools(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.bin_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    def test_compilation_success(self):
        """Verify that all programs compiled without errors."""
        expected_files = ["wol", "lan_scanner", "netmon", "speedtest"]
        for f in expected_files:
            self.assertTrue(os.path.exists(os.path.join(self.bin_dir, f)), f"Expected binary {f} was not generated.")

    def test_wol_help(self):
        result = subprocess.run([os.path.join(self.bin_dir, "wol")], capture_output=True, text=True)
        output = result.stdout + result.stderr
        self.assertIn("Usage:", output)

    def test_wol_invalid_mac(self):
        result = subprocess.run([os.path.join(self.bin_dir, "wol"), "invalid_mac"], capture_output=True, text=True)
        output = result.stdout + result.stderr
        self.assertIn("is not a known device or valid MAC", output)

    def test_wol_valid_mac(self):
        result = subprocess.run([os.path.join(self.bin_dir, "wol"), "AA:BB:CC:DD:EE:FF", "-b", "127.0.0.1", "-p", "9999"], capture_output=True, text=True)
        output = result.stdout + result.stderr
        self.assertIn("Packet sent. Device should wake shortly.", output)

    def test_wol_device_resolution(self):
        try:
            os.makedirs(os.path.expanduser("~/.config/lan"), exist_ok=True)
            with open(os.path.expanduser("~/.config/lan/devices"), "w") as f:
                f.write("testdev 192.168.1.1 AA:BB:CC:DD:EE:FF\n")
                f.write("nomacdev 192.168.1.2 --\n")
        except PermissionError:
            self.skipTest("Skipping test due to lack of write permission in ~/.config/lan")

        result = subprocess.run([os.path.join(self.bin_dir, "wol"), "testdev", "-b", "127.0.0.1"], capture_output=True, text=True)
        output = result.stdout + result.stderr
        self.assertIn("Resolved 'testdev' -> AA:BB:CC:DD:EE:FF", output)
        self.assertIn("Packet sent. Device should wake shortly.", output)

        result = subprocess.run([os.path.join(self.bin_dir, "wol"), "nomacdev"], capture_output=True, text=True)
        output = result.stdout + result.stderr
        self.assertIn("has no saved MAC address", output)

        result = subprocess.run([os.path.join(self.bin_dir, "wol"), "unknown"], capture_output=True, text=True)
        output = result.stdout + result.stderr
        self.assertIn("is not a known device or valid MAC", output)
        self.assertIn("Known devices:", output)

    @unittest.skipUnless(_icmp_available(), "needs ICMP sockets (unprivileged ICMP or root)")
    def test_netmon_run(self):
        process = subprocess.Popen([os.path.join(self.bin_dir, "netmon"), "127.0.0.1", "-i", "1000"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        time.sleep(2)
        process.send_signal(signal.SIGINT)
        stdout, stderr = process.communicate()
        output = stdout.decode('utf-8') + stderr.decode('utf-8')
        self.assertIn("Monitoring 127.0.0.1", output)

    def test_speedtest_help(self):
        result = subprocess.run([os.path.join(self.bin_dir, "speedtest"), "-h"], capture_output=True, text=True)
        output = result.stdout + result.stderr
        self.assertIn("Usage:", output)

    def test_speedtest_server(self):
        server = subprocess.Popen([os.path.join(self.bin_dir, "speedtest"), "-s", "-p", "12345"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        time.sleep(1)
        client = subprocess.run([os.path.join(self.bin_dir, "speedtest"), "127.0.0.1", "-p", "12345", "-t", "1"], capture_output=True, text=True)
        server.send_signal(signal.SIGINT)

        output = client.stdout + client.stderr
        self.assertIn("speed test", output)

    def test_lan_scanner_help(self):
        result = subprocess.run([os.path.join(self.bin_dir, "lan_scanner"), "-h"], capture_output=True, text=True)
        output = result.stdout + result.stderr
        self.assertIn("Usage:", output)

    @unittest.skipUnless(_iface_exists("eth0"), "needs an 'eth0' interface (absent on macOS/most dev boxes)")
    def test_lan_scanner_run(self):
        process = subprocess.Popen([os.path.join(self.bin_dir, "lan_scanner"), "-i", "eth0"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        time.sleep(3)
        process.send_signal(signal.SIGINT)
        stdout, stderr = process.communicate()
        output = stdout.decode('utf-8') + stderr.decode('utf-8')
        self.assertIn("Detected subnet", output)

if __name__ == '__main__':
    unittest.main()
