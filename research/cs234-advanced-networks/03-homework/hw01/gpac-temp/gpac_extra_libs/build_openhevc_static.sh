#!/bin/sh

is_64=`uname -a | grep 64`

if test ! -z "$is_64" ; then

echo "64 bit compilation of OpenHEVC"

branch="ffmpeg_update"
if [ "$1" = "osx" ]; then
	branch="HEVC_extensions"
fi

git submodule update --init
cd ./openhevc/
git checkout "$branch"
git pull
cmake -DENABLE_STATIC=ON -DENABLE_EXECUTABLE=OFF -DCMAKE_BUILD_TYPE=RELEASE ../openhevc
make || exit 1
mkdir -p ../../gpac_public/extra_lib/lib/gcc
cp ./libLibOpenHevcWrapper.a ../../gpac_public/extra_lib/lib/gcc
cd ..

else

echo "32 bit compilation of OpenHEVC not yet supported - skipping"

fi

