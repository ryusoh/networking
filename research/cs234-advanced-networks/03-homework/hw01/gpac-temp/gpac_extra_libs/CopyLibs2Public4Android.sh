#!/bin/sh
mkdir -p ../gpac_public/extra_lib/lib/android/armeabi
cp -r lib/android/armeabi/*.so ../gpac_public/extra_lib/lib/android/armeabi
mkdir -p ../gpac_public/extra_lib/lib/android/armeabi-v7a
cp -r lib/android/armeabi-v7a/*.so ../gpac_public/extra_lib/lib/android/armeabi-v7a
mkdir -p ../gpac_public/extra_lib/lib/android/x86
cp -r lib/android/x86/*.so ../gpac_public/extra_lib/lib/android/x86
mkdir -p ../gpac_public/applications/osmo4_android/libs
cp -f ../tools/osmo4_android_libs/real3d.jar ../gpac_public/applications/osmo4_android/libs
