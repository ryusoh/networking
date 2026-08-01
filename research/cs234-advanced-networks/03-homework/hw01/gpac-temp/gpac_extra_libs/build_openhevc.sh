#!/bin/sh
git submodule update --init
cd ./openhevc/
git checkout HEVC_extensions
cmake -DENABLE_STATIC=OFF -DCMAKE_BUILD_TYPE=RELEASE ../openhevc
make || exit 1
cp ./libLibOpenHevcWrapper.so ../../gpac_public/extra_lib/lib/gcc
cp ./libLibOpenHevcWrapper.dylib ../../gpac_public/extra_lib/lib/gcc
cd ..
