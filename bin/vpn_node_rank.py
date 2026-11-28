#!/usr/bin/env python3
"""vpn_node_rank — rank VPN upstream servers by real packet loss and RTT.

Measures upstream nodes directly over the physical interface (e.g. en0),
bypassing utun* so userspace TUN stubs that synthesize local 0.5 ms ICMP
replies cannot mask real packet loss.

Usage:
  vpn_node_rank.py [options] [host ...]

When no hosts are given, discovers the active VPN service via `scutil --nc`
and expands JustMySocks/Jamjams `c<N>s<M>.<domain>` sibling nodes
(s1..s5, s801). Runs probes in parallel (~3 s total), without disconnecting
or modifying the active VPN.

Exit codes:
  0 = active node (or best explicit host) has packet loss below --loss-warn
  1 = active node degraded / no healthy node found
  2 = usage or discovery error
"""

import argparse
from concurrent.futures import ThreadPoolExecutor
import ipaddress
import re
import shutil
import socket
import subprocess
import sys

DEFAULT_CANARY = "223.5.5.5"
DEFAULT_SIBLING_SUFFIXES = ("s1", "s2", "s3", "s4", "s5", "s801")
TUNNEL_IF_PREFIXES = ("utun", "tun", "ppp", "ipsec", "lo")

_CONNECTED_RE = re.compile(
    r'^\*\s+\(Connected\)\s+([0-9A-Fa-f-]+)\s+.*?"([^"]+)"'
)
_REMOTE_ADDR_RE = re.compile(r"^\s*RemoteAddress\s*:\s*(\S+)", re.IGNORECASE)
_JMS_HOST_RE = re.compile(r"^(c\d+)(s\d+)\.([A-Za-z0-9.-]+)$")
_PKT_RE = re.compile(
    r"(\d+)\s+packets transmitted,\s+(\d+)\s+(?:packets\s+)?received,"
    r".*?([0-9]+(?:\.[0-9]+)?)%\s+packet loss"
)
_RTT_RE = re.compile(
    r"(?:round-trip|rtt)\s+min/avg/max/(?:stddev|mdev)\s*=\s*"
    r"([0-9.]+)/([0-9.]+)/([0-9.]+)/([0-9.]+)\s*ms"
)


def parse_physical_iface(netstat_out):
    """Return the first non-tunnel default-route interface from netstat."""
    for line in netstat_out.splitlines():
        parts = line.split()
        if len(parts) < 2 or parts[0] != "default":
            continue
        iface = parts[-1]
        if not iface.startswith(TUNNEL_IF_PREFIXES):
            return iface
    return None


def parse_connected_vpn(scutil_nc_list):
    """Return (uuid, service_name) for the first connected VPN service."""
    for line in scutil_nc_list.splitlines():
        match = _CONNECTED_RE.search(line)
        if match:
            return match.group(1), match.group(2)
    return None


def _strip_port(addr):
    """Strip trailing :port from an IPv4/hostname address."""
    if not addr:
        return None
    if addr.startswith("["):
        end = addr.find("]")
        return addr[1:end] if end != -1 else addr
    if addr.count(":") == 1:
        host, port = addr.rsplit(":", 1)
        if port.isdigit():
            return host
    return addr


def parse_remote_address(scutil_nc_show):
    """Extract the server host/IP from `scutil --nc show <uuid>` output."""
    for line in scutil_nc_show.splitlines():
        match = _REMOTE_ADDR_RE.match(line)
        if match:
            return _strip_port(match.group(1))
    return None


def _looks_like_target(value):
    """True if value looks like an IP address or a dotted hostname."""
    if not value or " " in value:
        return False
    try:
        ipaddress.ip_address(value)
        return True
    except ValueError:
        return "." in value and all(
            part and re.match(r"^[A-Za-z0-9-]+$", part)
            for part in value.split(".")
        )


def expand_sibling_hosts(service_name, remote_host=None, include_siblings=True):
    """Build candidate host list from the active VPN name / RemoteAddress.

    When include_siblings is True and a JustMySocks/Jamjams hostname
    (`c<N>s<M>.<domain>`) is detected, returns the standard sibling nodes
    plus the active node itself.
    """
    candidates = [service_name or "", remote_host or ""]
    if include_siblings:
        for cand in candidates:
            match = _JMS_HOST_RE.match(cand.strip())
            if match:
                prefix, active_s, domain = match.groups()
                suffixes = list(DEFAULT_SIBLING_SUFFIXES)
                if active_s not in suffixes:
                    suffixes.append(active_s)
                return ["%s%s.%s" % (prefix, s, domain) for s in suffixes]
    for cand in (service_name, remote_host):
        if _looks_like_target(cand):
            return [cand]
    return []


def parse_ping_output(text):
    """Parse ping summary lines into a metrics dict."""
    pkt = _PKT_RE.search(text)
    rtt = _RTT_RE.search(text)
    if not pkt:
        return {
            "tx": 0,
            "rx": 0,
            "loss": 100.0,
            "min_ms": None,
            "avg_ms": None,
            "max_ms": None,
        }
    return {
        "tx": int(pkt.group(1)),
        "rx": int(pkt.group(2)),
        "loss": float(pkt.group(3)),
        "min_ms": float(rtt.group(1)) if rtt else None,
        "avg_ms": float(rtt.group(2)) if rtt else None,
        "max_ms": float(rtt.group(3)) if rtt else None,
    }


def classify_result(result, loss_warn=5.0):
    """Label one probe result as clean / minor-loss / degraded / unreachable."""
    if result.get("error") or result["rx"] == 0 or result["loss"] >= 100.0:
        return "unreachable"
    if result["loss"] >= loss_warn:
        return "degraded"
    if result["loss"] > 0.0:
        return "minor-loss"
    return "clean"


def rank_results(results):
    """Sort probe results best-first: lowest loss, then lowest avg RTT."""
    return sorted(
        results,
        key=lambda r: (
            1 if r.get("error") else 0,
            r["loss"],
            r["avg_ms"] if r["avg_ms"] is not None else float("inf"),
            r["host"],
        ),
    )


def detect_physical_iface():
    """Find the active non-tunnel default-route interface on macOS."""
    if not shutil.which("netstat"):
        return None
    out = subprocess.run(
        ["netstat", "-rn", "-f", "inet"],
        capture_output=True,
        text=True,
        timeout=5,
    ).stdout
    return parse_physical_iface(out)


def detect_active_vpn():
    """Return (service_name, remote_host) for the connected macOS VPN, or (None, None)."""
    if sys.platform != "darwin" or not shutil.which("scutil"):
        return None, None
    list_out = subprocess.run(
        ["scutil", "--nc", "list"], capture_output=True, text=True, timeout=5
    ).stdout
    conn = parse_connected_vpn(list_out)
    if not conn:
        return None, None
    uuid, name = conn
    show_out = subprocess.run(
        ["scutil", "--nc", "show", uuid],
        capture_output=True,
        text=True,
        timeout=5,
    ).stdout
    return name, parse_remote_address(show_out)


def resolve_ipv4(host):
    """Resolve host to an IPv4 address string, or return (None, error)."""
    try:
        ipaddress.IPv4Address(host)
        return host, None
    except ValueError:
        pass
    try:
        infos = socket.getaddrinfo(host, None, socket.AF_INET)
    except OSError as exc:
        return None, str(exc)
    return infos[0][4][0], None


def build_ping_cmd(ip, iface, count, interval, timeout, platform=None):
    """Construct OS-appropriate ping command bound to iface when provided."""
    plat = platform or sys.platform
    if plat == "darwin":
        cmd = ["ping", "-c", str(count), "-i", str(interval), "-t", str(timeout)]
        if iface:
            cmd += ["-b", iface]
        cmd.append(ip)
        return cmd
    cmd = ["ping", "-c", str(count), "-i", str(interval), "-w", str(timeout)]
    if iface:
        cmd += ["-I", iface]
    cmd.append(ip)
    return cmd


def probe_host(host, iface, count=10, interval=0.2, timeout=5):
    """Resolve host and measure real ICMP loss/RTT directly over iface."""
    ip, err = resolve_ipv4(host)
    if err:
        return {
            "host": host,
            "ip": None,
            "tx": 0,
            "rx": 0,
            "loss": 100.0,
            "min_ms": None,
            "avg_ms": None,
            "max_ms": None,
            "error": "dns: %s" % err,
        }
    cmd = build_ping_cmd(ip, iface, count, interval, timeout)
    try:
        proc = subprocess.run(
            cmd, capture_output=True, text=True, timeout=timeout + 5
        )
    except subprocess.TimeoutExpired:
        return {
            "host": host,
            "ip": ip,
            "tx": count,
            "rx": 0,
            "loss": 100.0,
            "min_ms": None,
            "avg_ms": None,
            "max_ms": None,
            "error": "ping timeout",
        }
    parsed = parse_ping_output(proc.stdout + "\n" + proc.stderr)
    parsed["host"] = host
    parsed["ip"] = ip
    parsed["error"] = None
    return parsed


def format_row(result, active_target=None, loss_warn=5.0):
    """Render one benchmark result as an aligned summary line."""
    is_active = bool(
        active_target
        and (
            result["host"] == active_target
            or result.get("ip") == active_target
        )
    )
    marker = "*" if is_active else " "
    status = classify_result(result, loss_warn=loss_warn)
    ip_str = result.get("ip") or "-"
    if result.get("error"):
        return "%s %-30s %-15s  FAIL (%s)" % (
            marker,
            result["host"],
            ip_str,
            result["error"],
        )
    if result["avg_ms"] is not None:
        rtt_str = "%.0f / %.0f / %.0f ms" % (
            result["min_ms"],
            result["avg_ms"],
            result["max_ms"],
        )
    else:
        rtt_str = "-"
    return "%s %-30s %-15s  %5.1f%% loss  %-20s  [%s]" % (
        marker,
        result["host"],
        ip_str,
        result["loss"],
        rtt_str,
        status,
    )


def _find_active_result(ranked, active_name, active_ip):
    for res in ranked:
        if active_name and res["host"] == active_name:
            return res
        if active_ip and (res["host"] == active_ip or res.get("ip") == active_ip):
            return res
    return None


def _print_verdict(ranked, canary_res, active_name, active_ip, loss_warn):
    print()
    if canary_res and classify_result(canary_res, loss_warn) in ("degraded", "unreachable"):
        print(
            "verdict: local ISP/Wi-Fi baseline (%s) shows %.1f%% loss — "
            "fix local network before blaming VPN nodes."
            % (canary_res["host"], canary_res["loss"])
        )
        return 1

    best = ranked[0]
    best_status = classify_result(best, loss_warn)
    active = _find_active_result(ranked, active_name, active_ip)
    if active is None:
        if best_status in ("clean", "minor-loss"):
            print(
                "verdict: best node is %s (%.1f%% loss, %.0f ms avg)."
                % (best["host"], best["loss"], best["avg_ms"] or 0.0)
            )
            return 0
        print("verdict: all tested nodes are degraded or unreachable.")
        return 1

    active_status = classify_result(active, loss_warn)
    if active_status in ("clean", "minor-loss"):
        print(
            "verdict: active node %s is healthy (%.1f%% loss, %.0f ms avg)."
            % (active["host"], active["loss"], active["avg_ms"] or 0.0)
        )
        return 0

    if best["host"] != active["host"] and best_status in ("clean", "minor-loss"):
        print(
            "verdict: active node %s is %s (%.1f%% loss) — switch to %s "
            "(%.1f%% loss, %.0f ms avg)."
            % (
                active["host"],
                active_status,
                active["loss"],
                best["host"],
                best["loss"],
                best["avg_ms"] or 0.0,
            )
        )
        return 1

    print(
        "verdict: active node %s is %s (%.1f%% loss) and no clean sibling "
        "was found." % (active["host"], active_status, active["loss"])
    )
    return 1


def build_parser():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("hosts", nargs="*", help="explicit hostnames/IPs to rank")
    parser.add_argument("--iface", default=None, help="physical interface (e.g. en0)")
    parser.add_argument("--count", type=int, default=10, help="ICMP probes per host")
    parser.add_argument("--interval", type=float, default=0.2, help="probe interval (s)")
    parser.add_argument("--timeout", type=int, default=5, help="ping deadline (s)")
    parser.add_argument(
        "--loss-warn", type=float, default=5.0, help="degraded loss threshold (%%)"
    )
    parser.add_argument(
        "--canary", default=DEFAULT_CANARY, help="local ISP canary IP"
    )
    parser.add_argument(
        "--no-siblings",
        action="store_true",
        help="only test the active VPN server without sibling expansion",
    )
    return parser


def _run_probes(hosts, canary, iface, args):
    """Probe the ISP canary and all candidate hosts in parallel."""
    targets = [canary] + hosts if canary else list(hosts)
    with ThreadPoolExecutor(max_workers=min(8, len(targets))) as pool:
        futures = {
            h: pool.submit(
                probe_host, h, iface, args.count, args.interval, args.timeout
            )
            for h in targets
        }
        canary_res = futures[canary].result() if canary else None
        raw_results = [futures[h].result() for h in hosts]
    return canary_res, raw_results


def _print_table(raw_results, active_name, active_ip, loss_warn):
    """Sort and print benchmark rows; return the ranked list."""
    resolved = [r for r in raw_results if not r.get("error")]
    failed = [r for r in raw_results if r.get("error")]
    ranked = rank_results(resolved) if resolved else rank_results(failed)

    active_marker = (
        active_name if any(r["host"] == active_name for r in ranked) else active_ip
    )
    for res in ranked:
        print(format_row(res, active_target=active_marker, loss_warn=loss_warn))
    if resolved:
        for res in failed:
            if not res["error"].startswith("dns:"):
                print(
                    format_row(res, active_target=active_marker, loss_warn=loss_warn)
                )
    return ranked


def main(argv):
    args = build_parser().parse_args(argv[1:])
    iface = args.iface or detect_physical_iface()
    active_name, active_ip = detect_active_vpn()

    hosts = list(args.hosts) or expand_sibling_hosts(
        active_name, active_ip, include_siblings=not args.no_siblings
    )
    if not hosts:
        print(
            "vpn_node_rank: no active VPN server detected; pass hostnames/IPs explicitly.",
            file=sys.stderr,
        )
        return 2

    print(
        "== VPN upstream node rank (iface: %s, %d pings each, bypassing utun) =="
        % (iface or "default", args.count)
    )
    if active_name or active_ip:
        print("active VPN: %s (%s)" % (active_name or "-", active_ip or "-"))

    canary_res, raw_results = _run_probes(hosts, args.canary, iface, args)
    if canary_res:
        print(
            "ISP canary: %s"
            % format_row(canary_res, loss_warn=args.loss_warn).strip()
        )
    print()

    ranked = _print_table(raw_results, active_name, active_ip, args.loss_warn)
    return _print_verdict(ranked, canary_res, active_name, active_ip, args.loss_warn)


if __name__ == "__main__":
    sys.exit(main(sys.argv))
