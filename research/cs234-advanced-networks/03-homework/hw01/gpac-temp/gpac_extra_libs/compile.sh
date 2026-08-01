#!/bin/sh -e


#compulsory: zlib
cd zlib
./configure
make
cp libz.a ../lib/gcc/
cd ..


#optional: alphabetic order
#faad
cd faad2
./bootstrap
./configure
make
cp libfaad/.libs/libfaad.a ../lib/gcc/
cd ..

#ffmpeg - please check FFMPEG web site

#freetype
cd freetype
./autogen.sh
make setup ansi
make
cp objs/libfreetype.a ../lib/gcc/
cd ..

#js
cd  js
make -f Makefile.ref
cp Linux_All_DBG.OBJ/libjs.so ../lib/gcc/
cd ..

#libjpg
cd libjpg
./configure
make
cp libjpeg.a ../lib/gcc/
cd ..

#libmad
cd libmad
./configure
make
cp .libs/libmad.a ../lib/gcc/
cd ..

#libogg
cd libogg
./configure
make
cp src/.libs/libogg.a ../lib/gcc/
cd ..

#libopenjpeg
cd OpenJPEG
make
cp libopenjpeg.a ../lib/gcc/
cd ..

#libpng
cd libpng
./configure
make
cp .libs/libpng.a ../lib/gcc/
cd ..

#libtheora
cd libtheora
./configure --disable-examples
make
cp lib/.libs/libtheora.a ../lib/gcc/
cd ..

#libvorbis
cd libvorbis
./configure
make
cp lib/.libs/libvorbis.a ../lib/gcc/
cd ..

#xvidcore
cd xvidcore/build/generic
./configure
make
cp \=build/libxvidcore.a ../../../lib/gcc/
cd ../../..

