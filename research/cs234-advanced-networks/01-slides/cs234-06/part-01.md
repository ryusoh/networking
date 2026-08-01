# cs234-06 - Part 01 (Pages 1-14)

---

## Page 1

CompSci 234/NetSys 210
Advanced Topics in Networking
Winter 2019
Unit 6: Video Compression
Overview
Cheng-Hsin Hsu (<chsu@cs.nthu.edu.tw>)
Slide adopted from Profs. Ooi and Zimmerman, and Ross’ materials
1

---

## Page 2

Agenda
´Why Compression
´Image Coding Tools
´Video Coding Tools
´Popular Video Codecs
2

---

## Page 3

We are Here
3
Network
Encoder
Sender
Middlebox
Receiver
Decoder

---

## Page 4

Why Compression
´“Bandwidth is Not Enough”
´“Disk Space is Not Enough”
´Size of Uncompressed DVD Movie =
(720 x 576) pixels x 3 bytes x 25 fps x
60 sec/min x 120 min = 208.6 GB
´NTSC: 29.97 fps (30/1.001); PAL 25
fps
4

---

## Page 5

Optical Disc Formats (1)
´CD: ~650 MB
´Video CD: codec MPEG-1
´1X max. read speed: 1.5 Mb/s
´DVD:
´4.7 (4.38) GB (single layer)
´8.5 (7.92) GB (dual layer)
´Double layer and dual sided (up to 18
GB)
´1X max. read speed: ~10 Mb/s
´Video codec: MPEG-2
5

---

## Page 6

Optical Disc Formats (2)
´Blu-ray
´Capacity: 25 GB and 50 GB
´1X speed: 36 Mb/s ß Still too slow
´Video codec: VC-1, H.264, MPEG-2
´Solution: Lossy compression
6

---

## Page 7

Agenda
´Why Compression
´Image Coding Tools
´Video Coding Tools
´Popular Video Codecs
7

---

## Page 8

Core Idea of Image
Compression
´Throw away information we cannot
see, i.e., based on human visual
systems:
´Color information: we are more sensitive
to luminance info.
´High frequency signals
´Rearrange data for good
compression
´Use common compression tools
´DCT -> Quantizer -> Entropy Coding
8

---

## Page 9

Controllable Compression
Ratio
9
Quality
Size
Ratio
Raw TIFF
1153KB
1:1
Zipped TIFF
982KB
1.2:1
Q=100
331KB
3.5:1
Q=70
67KB
17:1
Q=40
43KB
27:1
Q=10
16KB
72:1
Q=1
6KB
192:1
Lossless
Lossy
No Compression
JPEG

---

## Page 10

Original Image (1153KB)
1:1
10

---

## Page 11

Original Image (1153KB)
27:1
11

---

## Page 12

Original Image (1153KB)
192:1
12

---

## Page 13

(Discard) Color Information
13
Y
V
U
RGB

---

## Page 14

Color Subsampling
´ The subsampling scheme is commonly expressed as
a three part ratio (e.g. 4:2:2). The parts are (in their
respective order):
´ Luma (Y) horizontal sampling reference (originally, as
a multiple of 3.579 MHz in the NTSC television system).
´ Cr (U) horizontal factor (relative to first digit).
´ Cb (V) horizontal factor (relative to first digit), except
when zero. Zero indicates that Cb horizontal factor is
equal to second digit, and, in addition, both Cr and
Cb are subsampled 2:1 vertically. Zero is chosen for
the bandwidth calculation formula to remain
correct.
´ To calculate required bandwidth factor relative to
4:4:4, one needs to sum all the factors and divide the
result by 12.
14
