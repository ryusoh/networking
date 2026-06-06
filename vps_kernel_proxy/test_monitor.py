import unittest
from unittest.mock import patch, MagicMock
import io
import sys
import monitor

class TestMonitor(unittest.TestCase):

    @patch('subprocess.check_output')
    def test_run_cmd_success(self, mock_check_output):
        mock_check_output.return_value = b'success output'
        result = monitor.run_cmd('some cmd')
        self.assertEqual(result, 'success output')
        mock_check_output.assert_called_with('some cmd', shell=True, stderr=-2) # subprocess.STDOUT

    @patch('subprocess.check_output')
    def test_run_cmd_error(self, mock_check_output):
        import subprocess
        mock_check_output.side_effect = subprocess.CalledProcessError(1, 'cmd', output=b'error output')
        result = monitor.run_cmd('some cmd')
        self.assertEqual(result, 'Error: error output')

    @patch('monitor.run_cmd')
    def test_get_map_id_found(self, mock_run_cmd):
        mock_run_cmd.return_value = '[{"name": "my_map", "id": 123}]'
        self.assertEqual(monitor.get_map_id("my_map"), 123)

    @patch('monitor.run_cmd')
    def test_get_map_id_not_found(self, mock_run_cmd):
        mock_run_cmd.return_value = '[{"name": "other_map", "id": 123}]'
        self.assertIsNone(monitor.get_map_id("my_map"))

    @patch('monitor.run_cmd')
    def test_get_map_id_invalid_json(self, mock_run_cmd):
        mock_run_cmd.return_value = 'not json'
        self.assertIsNone(monitor.get_map_id("my_map"))

    @patch('monitor.get_map_id')
    @patch('sys.stdout', new_callable=io.StringIO)
    def test_show_dns_hits_no_map(self, mock_stdout, mock_get_map_id):
        mock_get_map_id.return_value = None
        monitor.show_dns_hits()
        self.assertIn("[-] DNS Hits map not found", mock_stdout.getvalue())

    @patch('monitor.get_map_id')
    @patch('monitor.run_cmd')
    @patch('sys.stdout', new_callable=io.StringIO)
    def test_show_dns_hits_success(self, mock_stdout, mock_run_cmd, mock_get_map_id):
        mock_get_map_id.return_value = 1
        mock_run_cmd.return_value = '[{"key": "65 78 61 6d 70 6c 65 2e 63 6f 6d 00", "value": "0x5"}]'
        monitor.show_dns_hits()
        self.assertIn("example.com", mock_stdout.getvalue())
        self.assertIn("Hits: 5", mock_stdout.getvalue())

    @patch('monitor.get_map_id')
    @patch('monitor.run_cmd')
    @patch('sys.stdout', new_callable=io.StringIO)
    def test_show_dns_hits_empty(self, mock_stdout, mock_run_cmd, mock_get_map_id):
        mock_get_map_id.return_value = 1
        mock_run_cmd.return_value = '[]'
        monitor.show_dns_hits()
        self.assertIn("No hits yet", mock_stdout.getvalue())

    @patch('monitor.get_map_id')
    @patch('monitor.run_cmd')
    @patch('sys.stdout', new_callable=io.StringIO)
    def test_show_dns_hits_invalid_json(self, mock_stdout, mock_run_cmd, mock_get_map_id):
        mock_get_map_id.return_value = 1
        mock_run_cmd.return_value = 'invalid'
        monitor.show_dns_hits()
        self.assertIn("Error parsing map", mock_stdout.getvalue())

    @patch('monitor.get_map_id')
    @patch('sys.stdout', new_callable=io.StringIO)
    def test_add_to_blocklist_no_map(self, mock_stdout, mock_get_map_id):
        mock_get_map_id.return_value = None
        monitor.add_to_blocklist('1.2.3.4')
        self.assertIn("[-] Blocklist map not found", mock_stdout.getvalue())

    @patch('monitor.get_map_id')
    @patch('monitor.run_cmd')
    @patch('sys.stdout', new_callable=io.StringIO)
    def test_add_to_blocklist_success(self, mock_stdout, mock_run_cmd, mock_get_map_id):
        mock_get_map_id.return_value = 1
        monitor.add_to_blocklist('1.2.3.4')
        mock_run_cmd.assert_called_with('bpftool map update id 1 key hex 01020304 value hex 00 00 00 00')
        self.assertIn("[+] IP 1.2.3.4 added to Kernel Blocklist!", mock_stdout.getvalue())

    @patch('monitor.get_map_id')
    @patch('sys.stdout', new_callable=io.StringIO)
    def test_add_to_blocklist_error(self, mock_stdout, mock_get_map_id):
        mock_get_map_id.return_value = 1
        monitor.add_to_blocklist('invalid-ip')
        self.assertIn("Error adding IP", mock_stdout.getvalue())

    @patch('socket.getaddrinfo')
    @patch('sys.stdout', new_callable=io.StringIO)
    def test_block_domain_no_ips(self, mock_stdout, mock_getaddrinfo):
        mock_getaddrinfo.return_value = []
        monitor.block_domain('example.com')
        self.assertIn("[-] No IPs found", mock_stdout.getvalue())

    @patch('socket.getaddrinfo')
    @patch('sys.stdout', new_callable=io.StringIO)
    def test_block_domain_error(self, mock_stdout, mock_getaddrinfo):
        mock_getaddrinfo.side_effect = Exception("Resolution error")
        monitor.block_domain('example.com')
        self.assertIn("[-] Resolution failed", mock_stdout.getvalue())

    @patch('socket.getaddrinfo')
    @patch('monitor.add_to_blocklist')
    def test_block_domain_success(self, mock_add_to_blocklist, mock_getaddrinfo):
        mock_getaddrinfo.return_value = [(2, 1, 6, '', ('1.2.3.4', 0))]
        monitor.block_domain('example.com')
        mock_add_to_blocklist.assert_called_with('1.2.3.4')

    @patch('sys.argv', ['monitor.py'])
    @patch('sys.stdout', new_callable=io.StringIO)
    def test_main_no_args(self, mock_stdout):
        monitor.main()
        self.assertIn("Usage:", mock_stdout.getvalue())

    @patch('sys.argv', ['monitor.py', 'status'])
    @patch('monitor.run_cmd')
    @patch('sys.stdout', new_callable=io.StringIO)
    def test_main_status(self, mock_stdout, mock_run_cmd):
        mock_run_cmd.return_value = "prog show output"
        monitor.main()
        self.assertIn("prog show output", mock_stdout.getvalue())
        self.assertIn("--- [ LOADED BPF PROGRAMS ] ---", mock_stdout.getvalue())

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
    @patch('sys.stdout', new_callable=io.StringIO)
    def test_main_unknown(self, mock_stdout):
        monitor.main()
        self.assertIn("Unknown command.", mock_stdout.getvalue())

class TestMonitorMainBlock(unittest.TestCase):
    def test_main_block(self):
        import runpy
        import sys

        with patch.object(sys, 'argv', ['vps_kernel_proxy/monitor.py']):
            with patch('sys.stdout', new_callable=io.StringIO) as mock_stdout:
                runpy.run_path('vps_kernel_proxy/monitor.py', run_name='__main__')
                self.assertIn("Usage:", mock_stdout.getvalue())

if __name__ == '__main__':
    unittest.main()
