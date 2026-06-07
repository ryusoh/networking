#!/usr/bin/env bash
#
# vmx-antidetect.sh — Append anti-VM-detection settings to VMware .vmx files.
# Searches common locations for .vmx files and lets the user choose which to patch.

set -euo pipefail

ANTI_DETECT_SETTINGS=(
    'isolation.tools.getPtrLocation.disable = "TRUE"'
    'isolation.tools.setPtrLocation.disable = "TRUE"'
    'isolation.tools.setVersion.disable = "TRUE"'
    'isolation.tools.getVersion.disable = "TRUE"'
    'monitor_control.restrict_backdoor = "TRUE"'
    'monitor_control.disable_directexec = "TRUE"'
    'hypervisor.cpuid.v0 = "FALSE"'
    'SMBIOS.reflectHost = "TRUE"'
)

# Directories to search for .vmx files
SEARCH_DIRS=(
    "$HOME/Virtual Machines.localized"
    "$HOME/Virtual Machines"
    "$HOME/Documents/Virtual Machines.localized"
    "$HOME/Documents/Virtual Machines"
)

find_vmx_files() {
    local files=()
    for dir in "${SEARCH_DIRS[@]}"; do
        if [[ -d "$dir" ]]; then
            while IFS= read -r -d '' f; do
                files+=("$f")
            done < <(find "$dir" -name '*.vmx' -type f -print0 2>/dev/null)
        fi
    done
    printf '%s\n' "${files[@]}"
}

check_all_patched() {
    local file="$1"
    for setting in "${ANTI_DETECT_SETTINGS[@]}"; do
        local key="${setting%% =*}"
        if ! grep -qi "^${key} " "$file" 2>/dev/null; then
            return 1
        fi
    done
    return 0
}

patch_vmx() {
    local file="$1"
    if check_all_patched "$file"; then
        echo "  [SKIP] Already patched: $(basename "$file")"
        return 0
    fi
    local added=0 skipped=0
    for setting in "${ANTI_DETECT_SETTINGS[@]}"; do
        local key="${setting%% =*}"
        if grep -qi "^${key} " "$file" 2>/dev/null; then
            ((skipped++))
        else
            echo "$setting" >> "$file"
            ((added++))
        fi
    done
    echo "  [OK]   Patched: $(basename "$file") ($added added, $skipped already present)"
}

main() {
    echo "Searching for .vmx files..."
    vmx_files=()
    while IFS= read -r line; do
        [[ -n "$line" ]] && vmx_files+=("$line")
    done < <(find_vmx_files)

    if [[ ${#vmx_files[@]} -eq 0 ]]; then
        echo "No .vmx files found."
        exit 1
    fi

    echo ""
    echo "Found ${#vmx_files[@]} .vmx file(s):"
    echo ""
    for ((i = 1; i <= ${#vmx_files[@]}; i++)); do
        local status=""
        if check_all_patched "${vmx_files[$i-1]}"; then
            status=" (already patched)"
        fi
        echo "  $i) $(basename "${vmx_files[$i-1]}")${status}"
        echo "     ${vmx_files[$i-1]}"
    done

    echo ""
    printf "Enter numbers to patch (comma-separated), or 'all': "
    read -r selection

    local indices=()
    if [[ "$selection" == "all" ]]; then
        for ((i = 1; i <= ${#vmx_files[@]}; i++)); do
            indices+=("$i")
        done
    else
        IFS=',' read -ra indices <<< "$selection"
    fi

    echo ""
    for idx in "${indices[@]}"; do
        idx=$(echo "$idx" | tr -d ' ')
        if [[ "$idx" -ge 1 && "$idx" -le ${#vmx_files[@]} ]] 2>/dev/null; then
            patch_vmx "${vmx_files[$idx-1]}"
        else
            echo "  [ERR]  Invalid selection: $idx"
        fi
    done

    echo ""
    echo "Done. Make sure VMs are powered off before starting them."
}

main
