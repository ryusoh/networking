import unittest
from unittest.mock import patch, mock_open, MagicMock
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from retriever import pull

class TestPull(unittest.TestCase):
    @patch("retriever.pull.os.path.exists")
    @patch("retriever.pull.glob.glob")
    @patch("retriever.pull.os.listdir")
    @patch("retriever.pull.os.path.isdir")
    @patch("retriever.pull.shutil.copytree")
    @patch("retriever.pull.shutil.rmtree")
    def test_pull_extension_success(self, mock_rmtree, mock_copytree, mock_isdir, mock_listdir, mock_glob, mock_exists):
        # exists returning true means it finds the profile directory
        mock_exists.side_effect = lambda x: True
        mock_listdir.return_value = ["1.0.0_0"]
        mock_isdir.return_value = True

        mock_json = '{"name": "My Extension Name"}'
        m_open = mock_open(read_data=mock_json)
        with patch("builtins.open", m_open):
            pull.pull_extension("abcde")
            self.assertTrue(mock_copytree.called)

    @patch("retriever.pull.os.path.exists")
    @patch("retriever.pull.glob.glob")
    def test_pull_extension_not_found(self, mock_glob, mock_exists):
        mock_exists.return_value = False
        mock_glob.return_value = []
        pull.pull_extension("abcde")

    @patch("retriever.pull.os.path.exists")
    @patch("retriever.pull.glob.glob")
    @patch("retriever.pull.os.listdir")
    @patch("retriever.pull.os.path.isdir")
    def test_pull_extension_no_versions(self, mock_isdir, mock_listdir, mock_glob, mock_exists):
        mock_exists.return_value = True
        mock_listdir.return_value = []
        mock_isdir.return_value = True
        pull.pull_extension("abcde")

    @patch("retriever.pull.os.path.exists")
    @patch("retriever.pull.glob.glob")
    @patch("retriever.pull.os.listdir")
    @patch("retriever.pull.os.path.isdir")
    @patch("retriever.pull.shutil.copytree")
    @patch("retriever.pull.shutil.rmtree")
    def test_pull_extension_other_profile(self, mock_rmtree, mock_copytree, mock_isdir, mock_listdir, mock_glob, mock_exists):
        def exists_side_effect(path):
            # first check fails
            if "Default" in path: return False
            if "manifest.json" in path: return False
            return True

        mock_exists.side_effect = exists_side_effect
        mock_glob.return_value = ["/User/Profile 1"]
        mock_listdir.return_value = ["1.0.0_0"]
        mock_isdir.return_value = True

        m_open = mock_open(read_data='{"name": "singleword"}')
        with patch("builtins.open", m_open):
            pull.pull_extension("abcde")
            self.assertTrue(mock_copytree.called)

    @patch("retriever.pull.os.path.exists")
    @patch("retriever.pull.glob.glob")
    @patch("retriever.pull.os.listdir")
    @patch("retriever.pull.os.path.isdir")
    @patch("retriever.pull.shutil.copytree")
    @patch("retriever.pull.shutil.rmtree")
    def test_pull_extension_exception(self, mock_rmtree, mock_copytree, mock_isdir, mock_listdir, mock_glob, mock_exists):
        mock_exists.return_value = True
        mock_listdir.return_value = ["1.0.0_0"]
        mock_isdir.return_value = True
        mock_copytree.side_effect = Exception("error")

        pull.pull_extension("abcde")



    @patch("retriever.pull.os.path.exists")
    @patch("retriever.pull.glob.glob")
    @patch("retriever.pull.os.listdir")
    @patch("retriever.pull.os.path.isdir")
    @patch("retriever.pull.shutil.copytree")
    @patch("retriever.pull.shutil.rmtree")
    @patch("retriever.pull.os.getcwd")
    def test_pull_extension_cwd(self, mock_getcwd, mock_rmtree, mock_copytree, mock_isdir, mock_listdir, mock_glob, mock_exists):
        mock_getcwd.return_value = "/some/path/retriever"
        mock_exists.return_value = True
        mock_listdir.return_value = ["1.0.0_0"]
        mock_isdir.return_value = True

        m_open = mock_open(read_data='{"name": "test"}')
        with patch("builtins.open", m_open):
            pull.pull_extension("abcde")
            self.assertTrue(mock_copytree.called)


    @patch("retriever.pull.os.path.exists")
    @patch("retriever.pull.glob.glob")
    @patch("retriever.pull.os.listdir")
    @patch("retriever.pull.os.path.isdir")
    @patch("retriever.pull.shutil.copytree")
    @patch("retriever.pull.shutil.rmtree")
    def test_pull_extension_single_word(self, mock_rmtree, mock_copytree, mock_isdir, mock_listdir, mock_glob, mock_exists):
        mock_exists.return_value = True
        mock_listdir.return_value = ["1.0.0_0"]
        mock_isdir.return_value = True

        m_open = mock_open(read_data='{"name": "One"}')
        with patch("builtins.open", m_open):
            pull.pull_extension("abcde")

    @patch("retriever.pull.os.path.exists")
    @patch("retriever.pull.glob.glob")
    @patch("retriever.pull.os.listdir")
    @patch("retriever.pull.os.path.isdir")
    @patch("retriever.pull.shutil.copytree")
    @patch("retriever.pull.shutil.rmtree")
    @patch("retriever.pull.os.getcwd")
    def test_pull_extension_retriever_cwd(self, mock_getcwd, mock_rmtree, mock_copytree, mock_isdir, mock_listdir, mock_glob, mock_exists):
        mock_getcwd.return_value = "/some/path/retriever"
        mock_exists.return_value = True
        mock_listdir.return_value = ["1.0.0_0"]
        mock_isdir.return_value = True

        m_open = mock_open(read_data='{"name": "test"}')
        with patch("builtins.open", m_open):
            pull.pull_extension("abcde")

class TestPullMain(unittest.TestCase):
    pass

if __name__ == '__main__':
    unittest.main()
