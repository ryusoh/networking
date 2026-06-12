# VPS User Proxy (X-UI Setup)

Application-layer proxy management — decoupled from the kernel-space eBPF work in `vps_kernel_proxy/`.

## Architecture

```
networking/
├── vps_kernel_proxy/   # eBPF packet processing (kernel space)
└── vps_user_proxy/     # X-UI automation & templates (user space)
```

## Quick Start

1. SSH into your VPS
2. Copy `.env.example` → `.env`, fill in real credentials
3. Run `bash deploy_template.sh`

## Manual SOP

### 1. Fully disable firewall (prevent panel lockout)

```bash
ufw disable
iptables -F && iptables -X
iptables -P INPUT ACCEPT
iptables -P OUTPUT ACCEPT
iptables -P FORWARD ACCEPT
```

### 2. Enable BBR (cross-ocean latency optimization)

```bash
echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf
echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf
sysctl -p
```

### 3. Install X-UI panel

```bash
bash <(curl -Ls https://raw.githubusercontent.com/vaxilu/x-ui/master/install.sh)
```

## Security

- **Public repo safe**: This directory contains ZERO credentials, IPs, or ports.
- **Secrets live in `.env`** (gitignored) or your local password manager.
- Never commit: real IPs, X-UI ports/credentials, VLESS URIs, or `x-ui.db`.
