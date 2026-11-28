"""Tests for bin/vpn_node_rank.py.

All parsing, sibling expansion, ranking, and CLI verdict paths are tested
against deterministic fixtures and monkeypatched probes — no live network
access is performed.
"""

import importlib.util
import os

BIN_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRIPT = os.path.join(BIN_DIR, "vpn_node_rank.py")

_spec = importlib.util.spec_from_file_location("vpn_node_rank", SCRIPT)
vnr = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(vnr)

NETSTAT_SAMPLE = """Routing tables

Internet:
Destination        Gateway            Flags               Netif Expire
default            link#19            UCSg                utun4
default            192.168.1.1        UGScIg                en0
1.1.1.1            link#19            UHWIig              utun4
"""

SCUTIL_LIST_SAMPLE = """Available network connection services in the current set (*=enabled):
* (Disconnected)   37A7D20A-9B42-4ADE-8F2D-65BAF87AD974 VPN (com.liguangming.Shadowrocket) "Shadowrocket" [VPN]
* (Connected)      0FC13490-629C-493B-BFAA-630E6C58604C VPN (net.fiberlogic.jamjams-standalone) "c62s2.portablesubmarines.com" [VPN]
"""

SCUTIL_SHOW_SAMPLE = """* (Connected) 0FC13490-629C-493B-BFAA-630E6C58604C VPN "c62s2.portablesubmarines.com"
VPN <dictionary> {
  OnDemandEnabled : TRUE
  RemoteAddress : 144.34.180.123:443
}
"""

PING_MAC_CLEAN = """PING 104.193.9.150 (104.193.9.150): 56 data bytes
--- 104.193.9.150 ping statistics ---
10 packets transmitted, 10 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 149.000/157.610/215.665/19.699 ms
"""

PING_MAC_LOSS = """PING 144.34.180.123 (144.34.180.123): 56 data bytes
--- 144.34.180.123 ping statistics ---
10 packets transmitted, 8 packets received, 20.0% packet loss
round-trip min/avg/max/stddev = 220.744/229.718/252.375/11.254 ms
"""

PING_LINUX_DEAD = """PING 192.0.2.1 (192.0.2.1) 56(84) bytes of data.
--- 192.0.2.1 ping statistics ---
5 packets transmitted, 0 received, 100% packet loss, time 4099ms
"""


def test_parse_physical_iface_skips_utun():
    assert vnr.parse_physical_iface(NETSTAT_SAMPLE) == "en0"
    assert vnr.parse_physical_iface("default link#19 UCSg utun4\n") is None


def test_parse_connected_vpn_and_remote_address():
    assert vnr.parse_connected_vpn(SCUTIL_LIST_SAMPLE) == (
        "0FC13490-629C-493B-BFAA-630E6C58604C",
        "c62s2.portablesubmarines.com",
    )
    assert vnr.parse_connected_vpn("* (Disconnected) 123 VPN \"x\"\n") is None
    assert vnr.parse_remote_address(SCUTIL_SHOW_SAMPLE) == "144.34.180.123"
    assert vnr.parse_remote_address("RemoteAddress : [2001:db8::1]:443\n") == "2001:db8::1"


def test_expand_sibling_hosts_jms_pattern():
    hosts = vnr.expand_sibling_hosts("c62s2.portablesubmarines.com", "144.34.180.123")
    assert hosts == [
        "c62s1.portablesubmarines.com",
        "c62s2.portablesubmarines.com",
        "c62s3.portablesubmarines.com",
        "c62s4.portablesubmarines.com",
        "c62s5.portablesubmarines.com",
        "c62s801.portablesubmarines.com",
    ]
    # Custom suffix outside defaults is preserved.
    extra = vnr.expand_sibling_hosts("c62s802.portablesubmarines.com")
    assert extra[-1] == "c62s802.portablesubmarines.com"
    # --no-siblings keeps only the active target.
    single = vnr.expand_sibling_hosts(
        "c62s2.portablesubmarines.com", "144.34.180.123", include_siblings=False
    )
    assert single == ["c62s2.portablesubmarines.com"]
    # Non-hostname VPN label falls back to RemoteAddress IP.
    assert vnr.expand_sibling_hosts("Shadowrocket", "144.34.180.123") == [
        "144.34.180.123"
    ]


def test_parse_ping_output_clean_loss_and_dead():
    clean = vnr.parse_ping_output(PING_MAC_CLEAN)
    assert clean["tx"] == 10 and clean["rx"] == 10
    assert clean["loss"] == 0.0
    assert clean["avg_ms"] == 157.61
    assert vnr.classify_result(clean) == "clean"

    degraded = vnr.parse_ping_output(PING_MAC_LOSS)
    assert degraded["loss"] == 20.0
    assert vnr.classify_result(degraded) == "degraded"

    dead = vnr.parse_ping_output(PING_LINUX_DEAD)
    assert dead["rx"] == 0 and dead["avg_ms"] is None
    assert vnr.classify_result(dead) == "unreachable"


def test_rank_results_orders_by_loss_then_rtt():
    items = [
        {"host": "s2", "ip": "1.1.1.2", "rx": 8, "loss": 20.0, "avg_ms": 230.0, "error": None},
        {"host": "s5", "ip": "1.1.1.5", "rx": 10, "loss": 0.0, "avg_ms": 158.0, "error": None},
        {"host": "s1", "ip": "1.1.1.1", "rx": 10, "loss": 0.0, "avg_ms": 120.0, "error": None},
        {"host": "s3", "ip": None, "rx": 0, "loss": 100.0, "avg_ms": None, "error": "dns"},
    ]
    assert [r["host"] for r in vnr.rank_results(items)] == ["s1", "s5", "s2", "s3"]


def test_build_ping_cmd_platform_flags():
    mac = vnr.build_ping_cmd("1.2.3.4", "en0", 10, 0.2, 5, platform="darwin")
    assert mac == ["ping", "-c", "10", "-i", "0.2", "-t", "5", "-b", "en0", "1.2.3.4"]
    linux = vnr.build_ping_cmd("1.2.3.4", "eth0", 5, 0.5, 4, platform="linux")
    assert linux == ["ping", "-c", "5", "-i", "0.5", "-w", "4", "-I", "eth0", "1.2.3.4"]


def test_main_recommends_clean_sibling_when_active_degraded(monkeypatch, capsys):
    monkeypatch.setattr(vnr, "detect_physical_iface", lambda: "en0")
    monkeypatch.setattr(
        vnr,
        "detect_active_vpn",
        lambda: ("c62s2.portablesubmarines.com", "144.34.180.123"),
    )
    fake = {
        "223.5.5.5": {"host": "223.5.5.5", "ip": "223.5.5.5", "tx": 10, "rx": 10, "loss": 0.0, "min_ms": 8.0, "avg_ms": 17.0, "max_ms": 30.0, "error": None},
        "c62s1.portablesubmarines.com": {"host": "c62s1.portablesubmarines.com", "ip": "95.163.196.228", "tx": 10, "rx": 9, "loss": 10.0, "min_ms": 220.0, "avg_ms": 230.0, "max_ms": 260.0, "error": None},
        "c62s2.portablesubmarines.com": {"host": "c62s2.portablesubmarines.com", "ip": "144.34.180.123", "tx": 10, "rx": 8, "loss": 20.0, "min_ms": 220.0, "avg_ms": 230.0, "max_ms": 252.0, "error": None},
        "c62s3.portablesubmarines.com": {"host": "c62s3.portablesubmarines.com", "ip": "144.168.59.96", "tx": 10, "rx": 6, "loss": 40.0, "min_ms": 188.0, "avg_ms": 224.0, "max_ms": 303.0, "error": None},
        "c62s4.portablesubmarines.com": {"host": "c62s4.portablesubmarines.com", "ip": "23.106.128.134", "tx": 10, "rx": 8, "loss": 20.0, "min_ms": 86.0, "avg_ms": 94.0, "max_ms": 117.0, "error": None},
        "c62s5.portablesubmarines.com": {"host": "c62s5.portablesubmarines.com", "ip": "104.193.9.150", "tx": 10, "rx": 10, "loss": 0.0, "min_ms": 149.0, "avg_ms": 158.0, "max_ms": 216.0, "error": None},
        "c62s801.portablesubmarines.com": {"host": "c62s801.portablesubmarines.com", "ip": None, "tx": 0, "rx": 0, "loss": 100.0, "min_ms": None, "avg_ms": None, "max_ms": None, "error": "dns: nodename"},
    }
    monkeypatch.setattr(vnr, "probe_host", lambda h, *_a, **_kw: fake[h])

    rc = vnr.main(["vpn_node_rank.py"])
    out = capsys.readouterr().out
    assert rc == 1
    assert "switch to c62s5.portablesubmarines.com" in out
    assert "* c62s2.portablesubmarines.com" in out


def test_main_exits_zero_when_active_healthy(monkeypatch, capsys):
    monkeypatch.setattr(vnr, "detect_physical_iface", lambda: "en0")
    monkeypatch.setattr(
        vnr,
        "detect_active_vpn",
        lambda: ("c62s5.portablesubmarines.com", "104.193.9.150"),
    )
    monkeypatch.setattr(
        vnr,
        "probe_host",
        lambda h, *_a, **_kw: {
            "host": h,
            "ip": "104.193.9.150",
            "tx": 10,
            "rx": 10,
            "loss": 0.0,
            "min_ms": 149.0,
            "avg_ms": 158.0,
            "max_ms": 180.0,
            "error": None,
        },
    )
    rc = vnr.main(["vpn_node_rank.py", "--no-siblings"])
    out = capsys.readouterr().out
    assert rc == 0
    assert "active node c62s5.portablesubmarines.com is healthy" in out


def test_main_blames_local_isp_when_canary_degraded(monkeypatch, capsys):
    monkeypatch.setattr(vnr, "detect_physical_iface", lambda: "en0")
    monkeypatch.setattr(vnr, "detect_active_vpn", lambda: (None, None))
    monkeypatch.setattr(
        vnr,
        "probe_host",
        lambda h, *_a, **_kw: {
            "host": h,
            "ip": "1.2.3.4",
            "tx": 10,
            "rx": 7,
            "loss": 30.0,
            "min_ms": 10.0,
            "avg_ms": 20.0,
            "max_ms": 50.0,
            "error": None,
        },
    )
    rc = vnr.main(["vpn_node_rank.py", "example.com"])
    out = capsys.readouterr().out
    assert rc == 1
    assert "local ISP/Wi-Fi baseline" in out


def test_main_errors_when_no_vpn_and_no_hosts(monkeypatch, capsys):
    monkeypatch.setattr(vnr, "detect_physical_iface", lambda: "en0")
    monkeypatch.setattr(vnr, "detect_active_vpn", lambda: (None, None))
    rc = vnr.main(["vpn_node_rank.py"])
    assert rc == 2
    assert "no active VPN server detected" in capsys.readouterr().err
