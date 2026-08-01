# cs234-06 - Part 03 (Pages 29-40)

---

## Page 29

P, B Frames, and Group of
Pictures
29
H.261 (1988)
MPEG-1 (1992)

---

## Page 30

GoP and Dependency
´ Example display order:
´ IBBPBBP …
´ Example encoding order:
´ IPBBPBB
´ Careful about the difference between them
30
Frame Type
Typical
Ratio
I
10:1
P
20:1
B
50:1

---

## Page 31

Video Structure
31
Q: Having more slices in the bitstream
allows better error concealment, but also
lead to lower coding efficiency. Why?
More threads

---

## Page 32

I, P, B Settings are at
Macroblock Level: B-Frame as
an Example
´Every macroblock is either
´I-macroblock
´P-macroblock
´B-macroblock
´a motion vector + residue wrt a
future I/P-frame
´2 motion vectors + residue wrt a
previous/future I/P-frame
32
Determined by the encoder

---

## Page 33

Video Codecs Are…
´DCT + Quantization + Entropy Coding +
Motion Compensation
´There are more advanced tools in
recent codecs
´Half-pel motion prediction
´Skipped macroblock
´Different sizes of macroblocks
´Motion vectors across multiple frames
´Key observation: More compression
tools are thrown into more recent
codec standards to trade
computation for coding efficiency
33
decrete cosine transform

---

## Page 34

Agenda
´Why Compression
´Image Coding Tools
´Video Coding Tools
´Popular Video Codecs
34

---

## Page 35

Common Codecs from
MPEG
35
MPEG
Standards
Bit-rate
Usage
MPEG-1
1.5Mbps
VCD
MPEG-2
3-45 Mbps
DVD, SVCD, HDTV
MPEG-4/
H.264/AVC
Scalable,
½ MPEG-2
QuickTime, DivX,
AVCHD, Cable TV,
YouTube, …
H.265/HEVC
Scalable,
½ H.264
New generation,
4K content
“H.266”
Scalable,
½ H.265
Next generation,
8K content

---

## Page 36

Other Codecs: VP9 and AV1
´VP9 is an open and royalty free video
coding format developed by Google
´Same concepts/tools compared to
MPEG codecs
´Successor to VP8
´Supported by most web browsers
(except Safari)
´Used by YouTube
´Successor: AV1
36

---

## Page 37

Try A Few Public Reference
Codecs
´Download source code, compile
and play with
´ffmpeg
´mpeg_stat
´jsvm
´shm
´Find raw video sequences in YUV420
format
´Try different encoding parameters
37

---

## Page 38

How Codecs Affect Media
Streaming?
´How to package data into
packets? ß packtization
´How to deal with packet loss? ß
error detection, error recovery, error
concealment
´How to deal with bursty traffic? ß
rate control
´How to predict decoding time? ß
real-timeness
:
38

---

## Page 39

Take-Away Messages
´Compression removes data for which the
human visual system is not sensitive.
´Current codecs are based on DCT,
quantization, entropy coding, and motion
compensation
´Motion compensation, motion estimation (or
prediction), motion vector, …….
´Codec standards are essentially defined by
their bitstreams (not encoders)
´Container formats (MPEG-2 TS, ISOBMFF) are
important for system designers ß didn’t
cover
39

---

## Page 40

40
Questions
<chsu@cs.nthu.edu.tw>
