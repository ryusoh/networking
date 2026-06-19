import unittest
from unittest.mock import patch, MagicMock, mock_open
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from nas_proxy import updater

class TestUpdater(unittest.TestCase):
    @patch("nas_proxy.updater.subprocess.run")
    def test_fetch_geonode_proxies(self, mock_run):
        mock_result = MagicMock()
        mock_result.stdout = '{"data": [{"ip": "1.1.1.1", "port": "1080"}]}'
        mock_run.return_value = mock_result

        # We have 2 urls in GEONODE_APIS so we get it twice
        proxies = updater.fetch_geonode_proxies()
        self.assertEqual(proxies, [{"address": "1.1.1.1", "port": 1080}, {"address": "1.1.1.1", "port": 1080}])

        mock_run.side_effect = Exception("error")
        proxies = updater.fetch_geonode_proxies()
        self.assertEqual(proxies, [])

    @patch("nas_proxy.updater.subprocess.run")
    def test_test_proxy(self, mock_run):
        mock_result = MagicMock()
        mock_result.stdout = "200 1.5\n"
        mock_run.return_value = mock_result

        res = updater.test_proxy("1.1.1.1", 1080)
        self.assertEqual(res, 1.5)

        mock_result.stdout = "000 0.0\n"
        res = updater.test_proxy("1.1.1.1", 1080)
        self.assertIsNone(res)

        mock_result.stdout = "404 0.1\n"
        res = updater.test_proxy("1.1.1.1", 1080)
        self.assertIsNone(res)

        mock_run.side_effect = Exception("error")
        res = updater.test_proxy("1.1.1.1", 1080)
        self.assertIsNone(res)

    @patch("nas_proxy.updater.fetch_geonode_proxies")
    @patch("nas_proxy.updater.test_proxy")
    @patch("nas_proxy.updater.os.path.exists")
    @patch("nas_proxy.updater.subprocess.run")
    @patch("nas_proxy.updater.os.makedirs")
    def test_update_v2ray_config(self, mock_makedirs, mock_run, mock_exists, mock_test, mock_fetch):
        mock_exists.return_value = True
        mock_fetch.return_value = [{"address": "2.2.2.2", "port": 1080}]
        mock_test.side_effect = [1.0, 2.0]  # two proxies

        import builtins
        with patch("builtins.open", mock_open(read_data="1.1.1.1:1080\n10.0.0.1:1080")):
            updater.update_v2ray_config()
            mock_run.assert_called()

        mock_fetch.return_value = []
        mock_exists.return_value = False
        updater.update_v2ray_config()

        mock_fetch.return_value = [{"address": "2.2.2.2", "port": 1080}]
        mock_test.side_effect = [None]
        with patch("builtins.open", mock_open(read_data="")):
            updater.update_v2ray_config()

        # Exception test for file writing lines 155, 174
        mock_fetch.return_value = [{"address": "2.2.2.2", "port": 1080}]
        mock_test.side_effect = [1.0, 2.0]
        def mock_open_err(f, mode, **kwargs):
            if mode == 'w':
                raise Exception("IO error")
            return mock_open(read_data="")(f, mode)

        with patch("builtins.open", mock_open_err):
            updater.update_v2ray_config()

    @patch("nas_proxy.updater.fetch_geonode_proxies")
    @patch("nas_proxy.updater.os.path.exists")
    @patch("nas_proxy.updater.subprocess.run")
    def test_update_v2ray_config_executor_exception(self, mock_run, mock_exists, mock_fetch):
        mock_exists.return_value = False
        mock_fetch.return_value = [{"address": "2.2.2.2", "port": 1080}]

        # Test executor future exception branch
        with patch("nas_proxy.updater.ThreadPoolExecutor") as mock_executor:
            mock_executor_instance = MagicMock()
            mock_executor.return_value.__enter__.return_value = mock_executor_instance

            # Need to mock the future dict loop
            with patch("nas_proxy.updater.as_completed") as mock_as_completed:
                future_mock = MagicMock()
                future_mock.result.side_effect = Exception("pool error")
                mock_as_completed.return_value = [future_mock]

                # To bypass the future_to_proxy[future] dict lookup
                # Wait, this is getting complex, let's mock test_proxy throwing inside threadpool
                pass

        # simpler way to test threadpool exception:
        with patch("nas_proxy.updater.test_proxy") as mock_test_proxy:
            mock_test_proxy.side_effect = Exception("direct test_proxy error")
            updater.update_v2ray_config()


if __name__ == '__main__':
    unittest.main()
