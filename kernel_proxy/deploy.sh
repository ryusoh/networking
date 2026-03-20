#!/bin/bash

# eBPF Deployment Tool
# --------------------
# Automates the loading and unloading of eBPF programs 
# on your NAS network interface.

# Default network interface (Change to 'eth0' or 'ovs_eth0' for Synology)
IFACE="eth0"
PROG="adblock.bpf.o"

show_help() {
    echo "Usage: sudo ./deploy.sh [load|unload|status] [program.o] [interface]"
    echo ""
    echo "Example:"
    echo "  sudo ./deploy.sh load adblock.bpf.o eth0"
    echo "  sudo ./deploy.sh unload eth0"
    echo "  sudo ./deploy.sh status"
}

load_prog() {
    local p=$1
    local i=$2
    echo "[+] Loading $p onto $i..."
    # 1. Try modern syntax
    ip link set dev "$i" xdp obj "$p" sec xdp 2>/dev/null || \
    # 2. Try generic mode syntax
    ip link set dev "$i" xdp generic obj "$p" sec xdp 2>/dev/null || \
    # 3. Try alternative syntax (no dev keyword)
    ip link set "$i" xdp obj "$p" 2>/dev/null || \
    # 4. Final attempt with verbose error
    ip link set dev "$i" xdp object "$p" section xdp
    
    if [ $? -eq 0 ]; then
        echo "[SUCCESS] $p is now active on $i."
    else
        echo "[ERROR] Failed to load $p. Your NAS 'ip' command might not support XDP."
        echo "Try checking if 'bpftool' can load it instead."
    fi
}

unload_prog() {
    local i=$1
    echo "[-] Unloading eBPF from $i..."
    ip link set dev "$i" xdp off
    echo "[DONE] Interface $i is now clean."
}

show_status() {
    echo "--- [ INTERFACE STATUS ] ---"
    ip link show | grep xdp
    echo ""
    echo "--- [ LOADED BPF PROGS ] ---"
    bpftool prog show
}

# Main Logic
case "$1" in
    load)
        load_prog "${2:-$PROG}" "${3:-$IFACE}"
        ;;
    unload)
        unload_prog "${2:-$IFACE}"
        ;;
    status)
        show_status
        ;;
    *)
        show_help
        ;;
esac
