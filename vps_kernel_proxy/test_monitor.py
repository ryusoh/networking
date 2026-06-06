import unittest
from unittest.mock import patch, MagicMock
import monitor
import socket

class TestMonitor(unittest.TestCase):
    @patch('subprocess.check_output')
    def test_run_cmd_success(self, mock_check_output):
        mock_check_output.return_value = b'success output'
        result = monitor.run_cmd('ls')
        self.assertEqual(result, 'success output')

    @patch('subprocess.check_output')
    def test_run_cmd_error(self, mock_check_output):
        import subprocess
        mock_check_output.side_effect = subprocess.CalledProcessError(1, 'cmd', output=b'error output')
        result = monitor.run_cmd('ls')
        self.assertEqual(result, 'Error: error output')

    @patch('monitor.run_cmd')
    def test_get_map_id_found(self, mock_run_cmd):
        mock_run_cmd.return_value = '[{"name": "test_map", "id": 123}]'
        result = monitor.get_map_id('test_map')
        self.assertEqual(result, 123)

    @patch('monitor.run_cmd')
    def test_get_map_id_not_found(self, mock_run_cmd):
        mock_run_cmd.return_value = '[{"name": "other_map", "id": 123}]'
        result = monitor.get_map_id('test_map')
        self.assertIsNone(result)

    @patch('monitor.run_cmd')
    def test_get_map_id_invalid_json(self, mock_run_cmd):
        mock_run_cmd.return_value = 'not json'
        result = monitor.get_map_id('test_map')
        self.assertIsNone(result)

    @patch('monitor.get_map_id')
    @patch('builtins.print')
    def test_show_dns_hits_no_map(self, mock_print, mock_get_map_id):
        mock_get_map_id.return_value = None
        monitor.show_dns_hits()
        mock_print.assert_called_with("[-] DNS Hits map not found. Is dns_filter.bpf.o loaded?")

    @patch('monitor.get_map_id')
    @patch('monitor.run_cmd')
    @patch('builtins.print')
    def test_show_dns_hits_success(self, mock_print, mock_run_cmd, mock_get_map_id):
        mock_get_map_id.return_value = 123
        mock_run_cmd.return_value = '[{"key": "74 65 73 74 00", "value": "0A"}]'
        monitor.show_dns_hits()
        mock_print.assert_any_call("\n--- [ DNS MONITOR ] ---")
        mock_print.assert_any_call("Domain: test            | Hits: 10")

    @patch('monitor.get_map_id')
    @patch('monitor.run_cmd')
    @patch('builtins.print')
    def test_show_dns_hits_empty(self, mock_print, mock_run_cmd, mock_get_map_id):
        mock_get_map_id.return_value = 123
        mock_run_cmd.return_value = '[]'
        monitor.show_dns_hits()
        mock_print.assert_any_call("No hits yet...")

    @patch('monitor.get_map_id')
    @patch('monitor.run_cmd')
    @patch('builtins.print')
    def test_show_dns_hits_error(self, mock_print, mock_run_cmd, mock_get_map_id):
        mock_get_map_id.return_value = 123
        mock_run_cmd.return_value = 'invalid json'
        monitor.show_dns_hits()
        mock_print.assert_called_with("Error parsing map: Expecting value: line 1 column 1 (char 0)")

    @patch('monitor.get_map_id')
    @patch('builtins.print')
    def test_add_to_blocklist_no_map(self, mock_print, mock_get_map_id):
        mock_get_map_id.return_value = None
        monitor.add_to_blocklist('1.2.3.4')
        mock_print.assert_called_with("[-] Blocklist map not found. Is adblock.bpf.o loaded?")

    @patch('monitor.get_map_id')
    @patch('monitor.run_cmd')
    @patch('builtins.print')
    def test_add_to_blocklist_success(self, mock_print, mock_run_cmd, mock_get_map_id):
        mock_get_map_id.return_value = 123
        monitor.add_to_blocklist('1.2.3.4')
        mock_run_cmd.assert_called_with("bpftool map update id 123 key hex 01020304 value hex 00 00 00 00")
        mock_print.assert_called_with("[+] IP 1.2.3.4 added to Kernel Blocklist!")

    @patch('monitor.get_map_id')
    @patch('builtins.print')
    def test_add_to_blocklist_error(self, mock_print, mock_get_map_id):
        mock_get_map_id.return_value = 123
        monitor.add_to_blocklist('invalid ip')
        mock_print.assert_called_with("Error adding IP: illegal IP address string passed to inet_aton")

    @patch('socket.getaddrinfo')
    @patch('monitor.add_to_blocklist')
    @patch('builtins.print')
    def test_block_domain_success(self, mock_print, mock_add_to_blocklist, mock_getaddrinfo):
        mock_getaddrinfo.return_value = [(socket.AF_INET, 1, 6, '', ('1.2.3.4', 80))]
        monitor.block_domain('example.com')
        mock_print.assert_any_call("[*] Resolving example.com...")
        mock_add_to_blocklist.assert_called_with('1.2.3.4')

    @patch('socket.getaddrinfo')
    @patch('builtins.print')
    def test_block_domain_no_ips(self, mock_print, mock_getaddrinfo):
        mock_getaddrinfo.return_value = []
        monitor.block_domain('example.com')
        mock_print.assert_called_with("[-] No IPs found for example.com")

    @patch('socket.getaddrinfo')
    @patch('builtins.print')
    def test_block_domain_error(self, mock_print, mock_getaddrinfo):
        mock_getaddrinfo.side_effect = Exception("Resolution error")
        monitor.block_domain('example.com')
        mock_print.assert_called_with("[-] Resolution failed for example.com: Resolution error")

    @patch('sys.argv', ['monitor.py'])
    @patch('builtins.print')
    def test_main_no_args(self, mock_print):
        monitor.main()
        mock_print.assert_called_with("Usage: ./monitor.py [status|dns|block <ip>|block-domain <domain>]")

    @patch('sys.argv', ['monitor.py', 'status'])
    @patch('monitor.run_cmd')
    @patch('builtins.print')
    def test_main_status(self, mock_print, mock_run_cmd):
        mock_run_cmd.return_value = 'prog list'
        monitor.main()
        mock_print.assert_any_call("--- [ LOADED BPF PROGRAMS ] ---")
        mock_print.assert_any_call('prog list')

    @patch('sys.argv', ['monitor.py', 'dns'])
    @patch('monitor.show_dns_hits')
    def test_main_dns(self, mock_show_dns_hits):
        monitor.main()
        mock_show_dns_hits.assert_called_once()

    @patch('sys.argv', ['monitor.py', 'block', '1.2.3.4'])
    @patch('monitor.add_to_blocklist')
    def test_main_block(self, mock_add_to_blocklist):
        monitor.main()
        mock_add_to_blocklist.assert_called_with('1.2.3.4')

    @patch('sys.argv', ['monitor.py', 'block-domain', 'example.com'])
    @patch('monitor.block_domain')
    def test_main_block_domain(self, mock_block_domain):
        monitor.main()
        mock_block_domain.assert_called_with('example.com')

    @patch('sys.argv', ['monitor.py', 'unknown'])
    @patch('builtins.print')
    def test_main_unknown(self, mock_print):
        monitor.main()
        mock_print.assert_called_with("Unknown command.")

class TestMonitorMainBlock(unittest.TestCase):
    def test_main_block(self):
        import runpy
        import sys

        with patch.object(sys, 'argv', ['vps_kernel_proxy/monitor.py']):
            with patch('builtins.print') as mock_print:
                runpy.run_path('vps_kernel_proxy/monitor.py', run_name='__main__')
                mock_print.assert_called_with("Usage: ./monitor.py [status|dns|block <ip>|block-domain <domain>]")

if __name__ == '__main__':
    unittest.main()
