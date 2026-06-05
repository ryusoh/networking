import unittest
import os
import sys
import json
import socket
from unittest.mock import patch, MagicMock

# Add the directory to sys.path to import the module
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    import monitor
    HAS_MONITOR = True
except ImportError:
    HAS_MONITOR = False

class TestMonitor(unittest.TestCase):
    @patch('subprocess.check_output')
    def test_run_cmd_success(self, mock_check_output):
        mock_check_output.return_value = b'test output'
        result = monitor.run_cmd('ls')
        self.assertEqual(result, 'test output')

    @patch('subprocess.check_output')
    def test_run_cmd_error(self, mock_check_output):
        import subprocess
        mock_check_output.side_effect = subprocess.CalledProcessError(1, 'ls', output=b'test error')
        result = monitor.run_cmd('ls')
        self.assertEqual(result, 'Error: test error')

    @patch('monitor.run_cmd')
    def test_get_map_id_found(self, mock_run_cmd):
        mock_run_cmd.return_value = json.dumps([{'name': 'test_map', 'id': 42}])
        self.assertEqual(monitor.get_map_id('test_map'), 42)

    @patch('monitor.run_cmd')
    def test_get_map_id_not_found(self, mock_run_cmd):
        mock_run_cmd.return_value = json.dumps([{'name': 'other_map', 'id': 42}])
        self.assertIsNone(monitor.get_map_id('test_map'))

    @patch('monitor.run_cmd')
    def test_get_map_id_json_error(self, mock_run_cmd):
        mock_run_cmd.return_value = "Not JSON"
        self.assertIsNone(monitor.get_map_id('test_map'))

    @patch('monitor.get_map_id')
    @patch('builtins.print')
    def test_show_dns_hits_no_map(self, mock_print, mock_get_map_id):
        mock_get_map_id.return_value = None
        monitor.show_dns_hits()
        mock_print.assert_called_with("[-] DNS Hits map not found. Is dns_filter.bpf.o loaded?")

    @patch('monitor.get_map_id')
    @patch('monitor.run_cmd')
    @patch('builtins.print')
    def test_show_dns_hits_empty(self, mock_print, mock_run_cmd, mock_get_map_id):
        mock_get_map_id.return_value = 42
        mock_run_cmd.return_value = "[]"
        monitor.show_dns_hits()
        mock_print.assert_any_call("No hits yet...")

    @patch('monitor.get_map_id')
    @patch('monitor.run_cmd')
    @patch('builtins.print')
    def test_show_dns_hits_data(self, mock_print, mock_run_cmd, mock_get_map_id):
        mock_get_map_id.return_value = 42
        # 'example.com' encoded in hex and padded
        hex_key = '65 78 61 6d 70 6c 65 2e 63 6f 6d 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00'
        mock_run_cmd.return_value = json.dumps([{'key': hex_key, 'value': '00000005'}])
        monitor.show_dns_hits()
        mock_print.assert_any_call("Domain: example.com     | Hits: 5")

    @patch('monitor.get_map_id')
    @patch('monitor.run_cmd')
    @patch('builtins.print')
    def test_show_dns_hits_error(self, mock_print, mock_run_cmd, mock_get_map_id):
        mock_get_map_id.return_value = 42
        mock_run_cmd.return_value = "Not JSON"
        monitor.show_dns_hits()
        mock_print.assert_any_call("Error parsing map: Expecting value: line 1 column 1 (char 0)")

    @patch('monitor.get_map_id')
    @patch('builtins.print')
    def test_add_to_blocklist_no_map(self, mock_print, mock_get_map_id):
        mock_get_map_id.return_value = None
        monitor.add_to_blocklist("1.2.3.4")
        mock_print.assert_called_with("[-] Blocklist map not found. Is adblock.bpf.o loaded?")

    @patch('monitor.get_map_id')
    @patch('monitor.run_cmd')
    @patch('builtins.print')
    def test_add_to_blocklist_success(self, mock_print, mock_run_cmd, mock_get_map_id):
        mock_get_map_id.return_value = 42
        monitor.add_to_blocklist("1.2.3.4")
        mock_run_cmd.assert_called_with("bpftool map update id 42 key hex 01020304 value hex 00 00 00 00")
        mock_print.assert_called_with("[+] IP 1.2.3.4 added to Kernel Blocklist!")

    @patch('monitor.get_map_id')
    @patch('builtins.print')
    def test_add_to_blocklist_error(self, mock_print, mock_get_map_id):
        mock_get_map_id.return_value = 42
        monitor.add_to_blocklist("invalid_ip")
        mock_print.assert_any_call("Error adding IP: illegal IP address string passed to inet_aton")

    @patch('socket.getaddrinfo')
    @patch('monitor.add_to_blocklist')
    @patch('builtins.print')
    def test_block_domain_success(self, mock_print, mock_add, mock_getaddrinfo):
        mock_getaddrinfo.return_value = [(2, 1, 6, '', ('1.2.3.4', 0))]
        monitor.block_domain("example.com")
        mock_add.assert_called_with("1.2.3.4")

    @patch('socket.getaddrinfo')
    @patch('builtins.print')
    def test_block_domain_no_ips(self, mock_print, mock_getaddrinfo):
        mock_getaddrinfo.return_value = []
        monitor.block_domain("example.com")
        mock_print.assert_any_call("[-] No IPs found for example.com")

    @patch('socket.getaddrinfo')
    @patch('builtins.print')
    def test_block_domain_error(self, mock_print, mock_getaddrinfo):
        mock_getaddrinfo.side_effect = socket.gaierror("lookup failed")
        monitor.block_domain("example.com")
        mock_print.assert_any_call("[-] Resolution failed for example.com: lookup failed")

    @patch('sys.argv', ['monitor.py'])
    @patch('builtins.print')
    def test_main_no_args(self, mock_print):
        monitor.main()
        mock_print.assert_called_with("Usage: ./monitor.py [status|dns|block <ip>|block-domain <domain>]")

    @patch('sys.argv', ['monitor.py', 'status'])
    @patch('monitor.run_cmd')
    @patch('builtins.print')
    def test_main_status(self, mock_print, mock_run_cmd):
        mock_run_cmd.return_value = "Status output"
        monitor.main()
        mock_print.assert_any_call("Status output")

    @patch('sys.argv', ['monitor.py', 'dns'])
    @patch('monitor.show_dns_hits')
    def test_main_dns(self, mock_show):
        monitor.main()
        mock_show.assert_called_once()

    @patch('sys.argv', ['monitor.py', 'block', '1.2.3.4'])
    @patch('monitor.add_to_blocklist')
    def test_main_block(self, mock_add):
        monitor.main()
        mock_add.assert_called_with('1.2.3.4')

    @patch('sys.argv', ['monitor.py', 'block-domain', 'example.com'])
    @patch('monitor.block_domain')
    def test_main_block_domain(self, mock_block):
        monitor.main()
        mock_block.assert_called_with('example.com')

    @patch('sys.argv', ['monitor.py', 'unknown'])
    @patch('builtins.print')
    def test_main_unknown(self, mock_print):
        monitor.main()
        mock_print.assert_called_with("Unknown command.")

if __name__ == '__main__':
    unittest.main()
