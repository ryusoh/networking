#!/usr/bin/env python3
import sys
import os
import shutil
import json
import glob

def get_chrome_extension_path(extension_id, profile="Default"):
    home = os.path.expanduser("~")
    base_path = os.path.join(home, "Library/Application Support/Google/Chrome", profile, "Extensions", extension_id)
    return base_path

def _find_extension_path(extension_id):
    src_base = get_chrome_extension_path(extension_id)
    if os.path.exists(src_base):
        return src_base

    home = os.path.expanduser("~")
    profiles = glob.glob(os.path.join(home, "Library/Application Support/Google/Chrome/Profile *"))
    for p in profiles:
        src_base = os.path.join(p, "Extensions", extension_id)
        if os.path.exists(src_base):
            return src_base

    return None

def _get_latest_version(src_base):
    versions = [d for d in os.listdir(src_base) if os.path.isdir(os.path.join(src_base, d)) and not d.startswith('Temp')]
    if not versions:
        return None
    return sorted(versions)[-1]

def _get_target_name(src_path, extension_id):
    manifest_path = os.path.join(src_path, "manifest.json")
    target_name = extension_id
    if os.path.exists(manifest_path):
        try:
            with open(manifest_path, 'r') as f:
                manifest = json.load(f)
                name = manifest.get('name', extension_id)
                name = name.replace(':', '').replace('-', ' ')
                words = name.split()
                if len(words) > 1:
                    target_name = words[0].lower() + ''.join(word.capitalize() for word in words[1:])
                else:
                    target_name = name.lower()
                target_name = "".join([c for c in target_name if c.isalnum()])
        except Exception:
            pass
    return target_name

def _get_target_directory(target_name):
    cwd = os.getcwd()
    if os.path.basename(cwd) == 'retriever':
        parent_dir = os.path.dirname(cwd)
        return os.path.abspath(os.path.join(parent_dir, target_name))
    return os.path.abspath(os.path.join(cwd, target_name))

def pull_extension(extension_id):
    src_base = _find_extension_path(extension_id)
    if not src_base:
        print(f"Error: Extension {extension_id} not found in Chrome Extensions directory.")
        return

    latest_version = _get_latest_version(src_base)
    if not latest_version:
        print(f"Error: No version subdirectories found for {extension_id}.")
        return

    src_path = os.path.join(src_base, latest_version)
    target_name = _get_target_name(src_path, extension_id)
    target_dir = _get_target_directory(target_name)

    print(f"Pulling {extension_id} (version {latest_version}) into {target_dir}...")
    
    if os.path.exists(target_dir):
        print(f"Warning: Target directory {target_dir} already exists. Overwriting...")
        shutil.rmtree(target_dir)
    
    try:
        shutil.copytree(src_path, target_dir)
        metadata_dir = os.path.join(target_dir, "_metadata")
        if os.path.exists(metadata_dir):
            print(f"Removing obsolete {metadata_dir}...")
            shutil.rmtree(metadata_dir)
        print("Success.")
    except Exception as e:
        print(f"Failed to copy: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: pull <extension_id>")
        sys.exit(1)
    
    pull_extension(sys.argv[1])
