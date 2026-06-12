#!/bin/bash
# VPS User Proxy — Automated initialization script
# Safe for public repo: contains NO credentials, IPs, or ports.
#
# Usage:
#   1. Copy .env.example -> .env and fill in your real values
#   2. Run: bash deploy_template.sh

set -euo pipefail

# Load credentials from local .env (never committed)
if [ -f "$(dirname "$0")/.env" ]; then
    source "$(dirname "$0")/.env"
else
    echo "Error: .env file missing! Copy .env.example and fill in your values."
    exit 1
fi

echo "=== Phase 1: Disable system firewall (prevent web panel lockout) ==="
ufw disable || true
iptables -F
iptables -X
iptables -P INPUT ACCEPT
iptables -P OUTPUT ACCEPT
iptables -P FORWARD ACCEPT

echo "=== Phase 2: Enable BBR congestion control (optimize cross-ocean links) ==="
if ! grep -q "tcp_congestion_control=bbr" /etc/sysctl.conf; then
    echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf
    echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf
    sysctl -p
    echo "BBR enabled."
else
    echo "BBR already configured, skipping."
fi

echo "=== Phase 3: Install X-UI panel ==="
bash <(curl -Ls https://raw.githubusercontent.com/vaxilu/x-ui/master/install.sh)

echo ""
echo "=== Done ==="
echo "Access panel at: http://${MY_VPS_IP:-<your-ip>}:${MY_VPS_PORT:-<your-port>}"
