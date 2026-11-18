#!/usr/bin/env python3
"""proxy_watch — poll a host through the local proxy while you flip proxy nodes.

Companion to proxy_path_diag.py for the "try nodes until one works" workflow:
run this in a terminal, then switch nodes in your proxy client's UI; each
poll prints one status line so you can see immediately which node makes the
host reachable. Stops (exit 0) as soon as the host answers.

Usage: proxy_watch.py <host> [--interval S] [--url URL]
  host      e.g. gemini.google.com
  --interval seconds between polls (default 10)
  --url     full URL to probe (default https://<host>/)

Exit codes: 0 = host became reachable, 130 = interrupted, 2 = usage error.
"""

import argparse
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import proxy_path_diag as ppd  # noqa: E402

CANARY = ppd.DEFAULT_CANARY


def status_line(when, url, result):
    """One poll result as a compact timestamped line."""
    if result["error"]:
        detail = "FAIL %s" % result["error"]
    else:
        detail = "http=%s tls=%.2fs total=%.2fs" % (
            result["http"], result["tls"], result["total"])
    return "%s  %-36s %s" % (time.strftime("%H:%M:%S"), url, detail)


def watch(host, url, interval):
    """Poll url + canary through the discovered proxy until url answers.

    Returns True once the host has responded without error.
    """
    proxies = ppd.discover_proxies()
    proxy = proxies[0][1] if proxies else ""
    print("probing via %s every %ds — switch nodes in your client; Ctrl-C to stop"
          % (proxy or "direct", interval))
    while True:
        target = ppd.probe(url, proxy)
        canary = ppd.probe(CANARY, proxy)
        print(status_line(time.time(), url, target))
        print(status_line(time.time(), "  canary " + CANARY, canary))
        if not target["error"]:
            print("reachable via the current node")
            return True
        time.sleep(interval)


def main(argv):
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("host")
    parser.add_argument("--interval", type=float, default=10)
    parser.add_argument("--url", default=None)
    args = parser.parse_args(argv[1:])
    url = args.url or "https://%s/" % args.host
    try:
        watch(args.host, url, args.interval)
    except KeyboardInterrupt:
        return 130
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
