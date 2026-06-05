import unittest
import os
import sys
import shutil
import json
import tempfile
from unittest.mock import patch, MagicMock

# Add the directory to sys.path to import the module
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
import pull

class TestPull(unittest.TestCase):
    def setUp(self):
        self.test_dir = tempfile.mkdtemp()
        self.old_cwd = os.getcwd()
        os.chdir(self.test_dir)

    def tearDown(self):
        os.chdir(self.old_cwd)
        shutil.rmtree(self.test_dir)

    @patch('os.path.expanduser')
    def test_get_chrome_extension_path(self, mock_expanduser):
        mock_expanduser.return_value = '/home/user'
        path = pull.get_chrome_extension_path('ext_id', 'Profile 1')
        self.assertEqual(path, '/home/user/Library/Application Support/Google/Chrome/Profile 1/Extensions/ext_id')

    @patch('pull.get_chrome_extension_path')
    @patch('os.path.exists')
    @patch('glob.glob')
    @patch('builtins.print')
    def test_pull_extension_not_found(self, mock_print, mock_glob, mock_exists, mock_get_path):
        mock_get_path.return_value = '/fake/path'
        mock_exists.return_value = False
        mock_glob.return_value = ['/home/user/Library/Application Support/Google/Chrome/Profile 2']

        pull.pull_extension('ext_id')
        mock_print.assert_any_call('Error: Extension ext_id not found in Chrome Extensions directory.')

    @patch('pull.get_chrome_extension_path')
    @patch('os.path.exists')
    @patch('glob.glob')
    @patch('os.listdir')
    @patch('os.path.isdir')
    @patch('builtins.print')
    def test_pull_extension_found_in_other_profile(self, mock_print, mock_isdir, mock_listdir, mock_glob, mock_exists, mock_get_path):
        mock_get_path.return_value = '/fake/path'

        def exists_mock(path):
            if path == '/fake/path': return False
            if 'Profile 2' in path: return True
            return False

        mock_exists.side_effect = exists_mock
        mock_glob.return_value = ['/home/user/Library/Application Support/Google/Chrome/Profile 2']
        mock_listdir.return_value = []

        pull.pull_extension('ext_id')
        mock_print.assert_any_call('Error: No version subdirectories found for ext_id.')

    @patch('pull.get_chrome_extension_path')
    @patch('os.path.exists')
    @patch('os.listdir')
    @patch('builtins.print')
    def test_pull_extension_no_versions(self, mock_print, mock_listdir, mock_exists, mock_get_path):
        mock_get_path.return_value = '/fake/path'
        mock_exists.side_effect = lambda path: True if path == '/fake/path' else False
        mock_listdir.return_value = ['Temp123']

        pull.pull_extension('ext_id')
        mock_print.assert_any_call('Error: No version subdirectories found for ext_id.')

    @patch('pull.get_chrome_extension_path')
    @patch('os.path.exists')
    @patch('os.path.isdir')
    @patch('os.listdir')
    @patch('shutil.copytree')
    @patch('shutil.rmtree')
    @patch('builtins.open')
    @patch('json.load')
    @patch('builtins.print')
    def test_pull_extension_success(self, mock_print, mock_json_load, mock_open, mock_rmtree, mock_copytree, mock_listdir, mock_isdir, mock_exists, mock_get_path):
        mock_get_path.return_value = '/fake/path'

        def exists_mock(path):
            if path == '/fake/path': return True
            if path.endswith('manifest.json'): return True
            if path.endswith('_metadata'): return True
            if 'testExtensionNameHere' in path: return True # Simulate target directory exists
            return False

        mock_exists.side_effect = exists_mock
        mock_listdir.return_value = ['1.0.0_0']
        mock_isdir.return_value = True

        mock_json_load.return_value = {'name': 'Test Extension: Name-Here'}

        pull.pull_extension('ext_id')

        # Verify target name resolution
        mock_copytree.assert_called_once()
        target_dir = mock_copytree.call_args[0][1]
        self.assertTrue(target_dir.endswith('testExtensionNameHere'))

        # Verify metadata removal and rmtree before copy
        self.assertEqual(mock_rmtree.call_count, 2)

    @patch('pull.get_chrome_extension_path')
    @patch('os.path.exists')
    @patch('os.path.isdir')
    @patch('os.listdir')
    @patch('shutil.copytree')
    @patch('builtins.open')
    @patch('json.load')
    def test_pull_extension_short_name(self, mock_json_load, mock_open, mock_copytree, mock_listdir, mock_isdir, mock_exists, mock_get_path):
        mock_get_path.return_value = '/fake/path'

        def exists_mock(path):
            if path == '/fake/path': return True
            if path.endswith('manifest.json'): return True
            return False

        mock_exists.side_effect = exists_mock
        mock_listdir.return_value = ['1.0.0_0']
        mock_isdir.return_value = True

        mock_json_load.return_value = {'name': 'Test'}

        pull.pull_extension('ext_id')

        mock_copytree.assert_called_once()
        target_dir = mock_copytree.call_args[0][1]
        self.assertTrue(target_dir.endswith('test'))

    @patch('pull.get_chrome_extension_path')
    @patch('os.path.exists')
    @patch('os.path.isdir')
    @patch('os.listdir')
    @patch('shutil.copytree')
    def test_pull_extension_json_error(self, mock_copytree, mock_listdir, mock_isdir, mock_exists, mock_get_path):
        mock_get_path.return_value = '/fake/path'

        def exists_mock(path):
            if path == '/fake/path': return True
            if path.endswith('manifest.json'): return True
            return False

        mock_exists.side_effect = exists_mock
        mock_listdir.return_value = ['1.0.0_0']
        mock_isdir.return_value = True

        # Open raises error to trigger except block
        with patch('builtins.open', side_effect=Exception('Test Error')):
            pull.pull_extension('ext_id')

        mock_copytree.assert_called_once()
        target_dir = mock_copytree.call_args[0][1]
        self.assertTrue(target_dir.endswith('ext_id'))

    @patch('pull.get_chrome_extension_path')
    @patch('os.path.exists')
    @patch('os.path.isdir')
    @patch('os.listdir')
    @patch('shutil.copytree')
    @patch('builtins.print')
    def test_pull_extension_copy_error(self, mock_print, mock_copytree, mock_listdir, mock_isdir, mock_exists, mock_get_path):
        mock_get_path.return_value = '/fake/path'

        def exists_mock(path):
            if path == '/fake/path': return True
            return False

        mock_exists.side_effect = exists_mock
        mock_listdir.return_value = ['1.0.0_0']
        mock_isdir.return_value = True

        mock_copytree.side_effect = Exception('Copy failed')

        pull.pull_extension('ext_id')

        mock_print.assert_any_call('Failed to copy: Copy failed')

    @patch('os.getcwd')
    @patch('pull.get_chrome_extension_path')
    @patch('os.path.exists')
    @patch('os.path.isdir')
    @patch('os.listdir')
    @patch('shutil.copytree')
    def test_pull_extension_from_retriever_dir(self, mock_copytree, mock_listdir, mock_isdir, mock_exists, mock_get_path, mock_getcwd):
        mock_get_path.return_value = '/fake/path'
        mock_getcwd.return_value = '/home/user/project/retriever'

        def exists_mock(path):
            if path == '/fake/path': return True
            return False

        mock_exists.side_effect = exists_mock
        mock_listdir.return_value = ['1.0.0_0']
        mock_isdir.return_value = True

        pull.pull_extension('ext_id')

        mock_copytree.assert_called_once()
        target_dir = mock_copytree.call_args[0][1]
        self.assertEqual(target_dir, '/home/user/project/ext_id')

if __name__ == '__main__':
    unittest.main()
