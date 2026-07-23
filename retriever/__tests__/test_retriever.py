import unittest
import subprocess
import os
import sys
import shutil
import json
from unittest.mock import patch, mock_open

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import pull

class TestRetriever(unittest.TestCase):
    def test_help(self):
        result = subprocess.run([sys.executable, "./retriever/pull.py"], capture_output=True, text=True)
        self.assertEqual(result.returncode, 1)
        self.assertIn("Usage: pull <extension_id>", result.stdout)

    @patch('os.path.exists')
    @patch('glob.glob')
    @patch('builtins.print')
    def test_extension_not_found(self, mock_print, mock_glob, mock_exists):
        mock_exists.return_value = False
        mock_glob.return_value = []
        pull.pull_extension("test_id")
        mock_print.assert_called_with("Error: Extension test_id not found in Chrome Extensions directory.")

    @patch('os.path.exists')
    @patch('glob.glob')
    @patch('builtins.print')
    @patch('os.listdir')
    @patch('os.path.isdir')
    @patch('os.getcwd')
    @patch('shutil.copytree')
    def test_extension_found_in_other_profile(self, mock_copytree, mock_getcwd, mock_isdir, mock_listdir, mock_print, mock_glob, mock_exists):
        # exists returns False for Default, True for Profile 1
        mock_exists.side_effect = lambda p: True if "Profile 1" in p else False
        mock_glob.return_value = ["/home/user/Library/Application Support/Google/Chrome/Profile 1"]
        mock_listdir.return_value = ["1.0.0_0"]
        mock_isdir.return_value = True
        mock_getcwd.return_value = "/app"

        pull.pull_extension("test_id")
        mock_copytree.assert_called_once()

    @patch('os.path.exists')
    @patch('os.listdir')
    @patch('builtins.print')
    def test_no_versions_found(self, mock_print, mock_listdir, mock_exists):
        mock_exists.return_value = True
        mock_listdir.return_value = ["Temp"]
        pull.pull_extension("test_id")
        mock_print.assert_called_with("Error: No version subdirectories found for test_id.")

    @patch('os.path.exists')
    @patch('os.listdir')
    @patch('os.path.isdir')
    @patch('shutil.copytree')
    @patch('shutil.rmtree')
    @patch('builtins.print')
    @patch('os.getcwd')
    def test_successful_pull_no_manifest(self, mock_getcwd, mock_print, mock_rmtree, mock_copytree, mock_isdir, mock_listdir, mock_exists):
        mock_exists.side_effect = lambda p: True if "test_id" in p else False
        mock_listdir.return_value = ["1.0.0_0"]
        mock_isdir.return_value = True
        mock_getcwd.return_value = "/app"

        pull.pull_extension("test_id")

        mock_copytree.assert_called_once()
        mock_print.assert_any_call("Success.")

    @patch('os.path.exists')
    @patch('os.listdir')
    @patch('os.path.isdir')
    @patch('shutil.copytree')
    @patch('shutil.rmtree')
    @patch('builtins.print')
    @patch('os.getcwd')
    @patch('builtins.open', new_callable=mock_open, read_data='{"name": "My Extension Name"}')
    def test_successful_pull_with_manifest(self, _mock_file, mock_getcwd, mock_print, mock_rmtree, mock_copytree, mock_isdir, mock_listdir, mock_exists):
        mock_exists.return_value = True
        mock_listdir.return_value = ["1.0.0_0"]
        mock_isdir.return_value = True
        mock_getcwd.return_value = "/app/retriever"

        pull.pull_extension("test_id")

        # Verify the target name formatting "My Extension Name" -> "myExtensionName"
        args, kwargs = mock_copytree.call_args
        self.assertTrue(args[1].endswith('myExtensionName'))
        mock_print.assert_any_call("Success.")

    @patch('os.path.exists')
    @patch('os.listdir')
    @patch('os.path.isdir')
    @patch('shutil.copytree')
    @patch('shutil.rmtree')
    @patch('builtins.print')
    @patch('os.getcwd')
    @patch('builtins.open', new_callable=mock_open, read_data='{"name": "Single"}')
    def test_successful_pull_with_manifest_single_word(self, _mock_file, mock_getcwd, mock_print, mock_rmtree, mock_copytree, mock_isdir, mock_listdir, mock_exists):
        mock_exists.return_value = True
        mock_listdir.return_value = ["1.0.0_0"]
        mock_isdir.return_value = True
        mock_getcwd.return_value = "/app"

        pull.pull_extension("test_id")

        # Verify the target name formatting "Single" -> "single"
        args, kwargs = mock_copytree.call_args
        self.assertTrue(args[1].endswith('single'))
        mock_print.assert_any_call("Success.")

    @patch('os.path.exists')
    @patch('os.listdir')
    @patch('os.path.isdir')
    @patch('shutil.copytree')
    @patch('shutil.rmtree')
    @patch('builtins.print')
    @patch('os.getcwd')
    def test_successful_pull_overwrite(self, mock_getcwd, mock_print, mock_rmtree, mock_copytree, mock_isdir, mock_listdir, mock_exists):
        def exists_mock(path):
            if "test_id" in path:
                return True
            return False

        # We need to explicitly mock rmtree to prevent FileNotFoundError during testing
        mock_exists.side_effect = exists_mock
        mock_listdir.return_value = ["1.0.0_0"]
        mock_isdir.return_value = True
        mock_getcwd.return_value = "/app"

        pull.pull_extension("test_id")

        mock_rmtree.assert_called()
        mock_copytree.assert_called_once()
        mock_print.assert_any_call("Success.")

    @patch('os.path.exists')
    @patch('os.listdir')
    @patch('os.path.isdir')
    @patch('shutil.copytree')
    @patch('shutil.rmtree')
    @patch('builtins.print')
    @patch('os.getcwd')
    def test_copy_error(self, mock_getcwd, mock_print, mock_rmtree, mock_copytree, mock_isdir, mock_listdir, mock_exists):
        def exists_mock(path):
            if "test_id" in path:
                return True
            return False

        mock_exists.side_effect = exists_mock
        mock_listdir.return_value = ["1.0.0_0"]
        mock_isdir.return_value = True
        mock_getcwd.return_value = "/app"
        mock_copytree.side_effect = Exception("copy failed")

        pull.pull_extension("test_id")

        mock_print.assert_any_call("Failed to copy: copy failed")

    @patch('sys.argv', ['pull.py'])
    @patch('sys.exit')
    @patch('builtins.print')
    def test_main_no_args(self, mock_print, mock_exit):
        import runpy
        try:
            # We must mock sys.exit to raise an exception we can catch
            mock_exit.side_effect = SystemExit
            runpy.run_path("retriever/pull.py", run_name="__main__")
        except SystemExit:
            pass
        mock_print.assert_any_call("Usage: pull <extension_id>")

    @patch('sys.argv', ['pull.py', 'test_ext'])
    @patch('retriever.pull.pull_extension')
    def test_main_with_args(self, _mock_pull):
        import runpy
        try:
            runpy.run_path("retriever/pull.py", run_name="__main__")
        except Exception:
            pass

if __name__ == '__main__':
    unittest.main()
