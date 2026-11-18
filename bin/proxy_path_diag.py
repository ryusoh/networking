#!/usr/bin/env python3
"""proxy_path_diag — end-to-end path diagnosis for one host behind a fake-ip/TUN proxy client.

Answers "why can't I reach this host" for setups like Shadowrocket / Clash /
sing-box running in TUN mode with fake-ip DNS, where the DNS answer alone
tells you nothing (198.18.0.x is the client's own fake-ip, not pollution).

Usage: proxy_path_diag.py <host> [path...]
  host  e.g. gemini.google.com
  path  extra https:// URLs to probe through the same proxy (default: the
        host itself plus https://www.google.com/ as a canary)

What it checks, in order:
  1. system DNS answer + fake-ip detection (198.18.0.0/15)
  2. DoH ground truth (dns.google) for comparison
  3. local proxy discovery from macOS system proxy settings (scutil), plus
     common proxy ports that accept a TCP connect
  4. per-path curl probes through the discovered proxy: TCP connect time,
     TLS handshake time, HTTP status, total time
  5. verdict: classifies the failure as dns / proxy-path / rule-or-node /
     host-up

Exit codes: 0 = host reachable, 1 = not reachable, 2 = usage error.
Stdlib only; curl is used for the probes (same binary the other canary
scripts in this repo use).
"""

import ipaddress
import json
import shutil
import socket
import subprocess
import sys
from urllib.request import urlopen

FAKE_IP_NET = ipaddress.ip_network("198.18.0.0/15")  # reused by TUN clients for fake-ip
DEFAULT_CANARY = "https://www.google.com/"
CONNECT_TIMEOUT = 8
TOTAL_TIMEOUT = 15

# Ports probed when scutil reveals no usable system proxy.
COMMON_PROXY_PORTS = (7897, 7890, 1080, 1082, 10808, 8888, 7891)


def is_fake_ip(addr):
    """True if addr sits in the fake-ip range (TUN DNS hijack address).

    Shadowrocket also returns an IPv4-translatable form of the fake-ip
    (e.g. ::ffff:0:c612:ad for 198.18.0.173, RFC 6052 ::ffff:0:0:0/96),
    which is treated the same.
    """
    try:
        ip = ipaddress.ip_address(addr)
    except ValueError:
        return False
    if isinstance(ip, ipaddress.IPv6Address):
        embedded = ip.ipv4_mapped
        if embedded is None and ip in ipaddress.ip_network("::ffff:0:0:0/96"):
            embedded = ipaddress.IPv4Address(int(ip) & 0xFFFFFFFF)
        if embedded is None:
            return False
        ip = embedded
    return ip in FAKE_IP_NET


def parse_scutil_proxy(text):
    """Extract enabled proxies from `scutil --proxy` output.

    Returns {scheme: (host, port)} with scheme in http/https/socks5h.
    The output is flat key/value lines; disabled entries (Enable : 0)
    and unconfigured schemes are ignored.
    """
    kv = {}
    for line in text.splitlines():
        key, sep, value = line.partition(":")
        if sep:
            kv[key.strip()] = value.strip()
    found = {}
    for scheme, prefix in (("http", "HTTP"), ("https", "HTTPS"), ("socks5h", "SOCKS")):
        if kv.get(prefix + "Enable") != "1":
            continue
        host, port = kv.get(prefix + "Proxy"), kv.get(prefix + "Port")
        if host and port:
            found[scheme] = (host, port)
    return found


def resolve_system(host):
    """System-resolver addresses for host (what the browser would get)."""
    try:
        infos = socket.getaddrinfo(host, 443, proto=socket.IPPROTO_TCP)
    except OSError as exc:
        return [], str(exc)
    return sorted({info[4][0] for info in infos}), None


def resolve_doh(host, timeout=8):
    """Ground-truth A records from dns.google (JSON API)."""
    url = "https://dns.google/resolve?name=%s&type=A" % host
    try:
        with urlopen(url, timeout=timeout) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except Exception as exc:  # the network stack here is the thing under test
        return [], str(exc)
    addrs = [a["data"] for a in data.get("Answer", []) if a.get("type") == 1]
    return addrs, None


def tcp_connect_ok(host, port, timeout=3):
    """True if a TCP connection to host:port can be established."""
    try:
        with socket.create_connection((host, int(port)), timeout=timeout):
            return True
    except OSError:
        return False


def discover_proxies():
    """Local proxies worth probing: system proxy settings, plus common ports.

    Each entry is (label, proxy_url). Ports that accept a TCP connect but
    carry no system-proxy entry are labelled "candidate".
    """
    found = []
    seen = set()
    if sys.platform == "darwin" and shutil.which("scutil"):
        out = subprocess.run(
            ["scutil", "--proxy"], capture_output=True, text=True, timeout=10
        ).stdout
        for scheme, (host, port) in sorted(parse_scutil_proxy(out).items()):
            found.append(("system %s" % scheme, "%s://%s:%s" % (scheme, host, port)))
            seen.add(int(port))
    for port in COMMON_PROXY_PORTS:
        if port not in seen and tcp_connect_ok("127.0.0.1", port):
            found.append(("candidate", "http://127.0.0.1:%d" % port))
    return found


EXIT_GEO_URL = "http://ip-api.com/json/?fields=status,countryCode,query"


def exit_geo(proxy, timeout=12):
    """Egress IP geolocation seen through proxy (ip-api.com).

    Returns {country, ip} or None when the lookup failed — the lookup host
    itself may be unreachable through a sick node, which is signal too.
    """
    cmd = ["curl", "-sS", "-m", str(timeout), EXIT_GEO_URL]
    if proxy:
        cmd += ["-x", proxy]
    try:
        out = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout + 5)
    except subprocess.TimeoutExpired:
        return None
    if out.returncode != 0:
        return None
    try:
        data = json.loads(out.stdout)
    except ValueError:
        return None
    if data.get("status") != "success":
        return None
    return {"country": data.get("countryCode"), "ip": data.get("query")}


def probe(url, proxy, connect_timeout=CONNECT_TIMEOUT, total_timeout=TOTAL_TIMEOUT):
    """curl one URL, optionally through proxy; return a timing/status dict.

    Keys: http, connect, tls, total, error. http=000 with error set means
    the fetch failed (timeout, reset, ...). An empty proxy string probes
    the direct path.
    """
    fmt = "%{http_code} %{time_connect} %{time_appconnect} %{time_total}"
    cmd = [
        "curl", "-sS", "-o", "/dev/null",
        "--connect-timeout", str(connect_timeout), "-m", str(total_timeout), "-w", fmt,
    ]
    if proxy:
        cmd += ["-x", proxy]
    cmd.append(url)
    try:
        out = subprocess.run(cmd, capture_output=True, text=True, timeout=total_timeout + 5)
    except subprocess.TimeoutExpired:
        return {"http": "000", "connect": 0.0, "tls": 0.0, "total": float(total_timeout),
                "error": "timeout"}
    if out.returncode != 0:
        tail = (out.stderr or out.stdout).strip().splitlines()
        detail = tail[-1] if tail else "curl exit %d" % out.returncode
        return {"http": "000", "connect": 0.0, "tls": 0.0, "total": 0.0, "error": detail}
    http, connect, tls, total = out.stdout.strip().split()
    return {"http": http, "connect": float(connect), "tls": float(tls),
            "total": float(total), "error": None}


def verdict(system_ips, target, canary):
    """Classify the situation into one of four buckets.

    target/canary are probe() result dicts for the host and the canary URL,
    both taken through the same proxy.
    """
    if not system_ips:
        return "dns", "system resolver returned no addresses"
    if not all(is_fake_ip(ip) for ip in system_ips):
        return _verdict_real_dns(target)
    if target["error"] and canary.get("error"):
        return "proxy-path", (
            "fake-ip DNS is fine, but nothing works through the proxy "
            "(canary failed too): the local proxy/TUN path is dead"
        )
    if target["error"]:
        return "rule-or-node", (
            "fake-ip DNS is fine, proxy path is up (canary ok), but this "
            "host fails: its rule routes it somewhere broken, or the "
            "current node cannot reach the host's real IPs"
        )
    return "host-up", "host reachable through the proxy"


def _verdict_real_dns(target):
    if target["error"]:
        return "proxy-path", (
            "real (non-fake) system DNS answer and the fetch failed: either "
            "the host is blocked on the direct path or no proxy is in use"
        )
    return "host-up", "host reachable"


def main(argv):
    if len(argv) < 2:
        print(__doc__.strip(), file=sys.stderr)
        return 2
    host = argv[1]
    paths = argv[2:] or ["https://%s/" % host, DEFAULT_CANARY]

    print("== dns ==")
    system_ips, err = resolve_system(host)
    print("system: %s%s" % (", ".join(system_ips) or "(none)",
                            " (%s)" % err if err else ""))
    for ip in system_ips:
        if is_fake_ip(ip):
            print("  %s is a fake-ip (TUN client DNS hijack), not pollution" % ip)
    doh_ips, err = resolve_doh(host)
    print("doh:    %s%s" % (", ".join(doh_ips) or "(none)",
                            " (%s)" % err if err else ""))

    print("== local proxy ==")
    proxies = discover_proxies()
    if not proxies:
        print("(none — direct path only)")
    for label, url in proxies:
        print("  %s: %s" % (label, url))

    proxy = proxies[0][1] if proxies else ""
    if proxy:
        geo = exit_geo(proxy)
        if geo:
            print("exit: %s (%s)" % (geo["country"], geo["ip"]))
        else:
            print("exit: (geo lookup failed through this proxy)")

    print("== probes via %s ==" % (proxy or "direct"))
    results = {}
    for url in paths:
        result = probe(url, proxy)
        results[url] = result
        if result["error"]:
            print("  %-40s FAIL %s" % (url, result["error"]))
        else:
            print("  %-40s http=%s connect=%.3fs tls=%.3fs total=%.2fs"
                  % (url, result["http"], result["connect"],
                     result["tls"], result["total"]))

    target = results.get("https://%s/" % host) or next(iter(results.values()))
    bucket, message = verdict(system_ips, target, results.get(DEFAULT_CANARY, {}))
    print("== verdict: %s ==" % bucket)
    print(message)
    return 0 if bucket == "host-up" else 1


if __name__ == "__main__":
    sys.exit(main(sys.argv))
