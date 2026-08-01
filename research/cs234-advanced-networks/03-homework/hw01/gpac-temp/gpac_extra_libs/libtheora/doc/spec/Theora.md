# Theora

---

## Page 1

Theora Speciﬁcation
Xiph.Org Foundation
September 23, 2010

---

## Page 3

Contents
1
Introduction
1
1.1
VP3 and Theora . . . . . . . . . . . . . . . . . . . . . . . . . . .
1
1.2
Video Formats
. . . . . . . . . . . . . . . . . . . . . . . . . . . .
1
1.3
Classiﬁcation . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
2
1.4
Assumptions
. . . . . . . . . . . . . . . . . . . . . . . . . . . . .
2
1.5
Codec Setup and Probability Model
. . . . . . . . . . . . . . . .
2
1.6
Format Conformance . . . . . . . . . . . . . . . . . . . . . . . . .
3
2
Coded Video Structure
5
2.1
Frame Layout . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
5
2.2
Picture Region
. . . . . . . . . . . . . . . . . . . . . . . . . . . .
6
2.3
Blocks and Super Blocks . . . . . . . . . . . . . . . . . . . . . . .
7
2.4
Macro Blocks . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
9
2.5
Coding Modes and Prediction . . . . . . . . . . . . . . . . . . . .
11
2.6
DCT Coeﬃcients . . . . . . . . . . . . . . . . . . . . . . . . . . .
11
3
Decoding Overview
13
3.1
Decoder Conﬁguration . . . . . . . . . . . . . . . . . . . . . . . .
13
3.1.1
Global Conﬁguration . . . . . . . . . . . . . . . . . . . . .
13
3.1.2
Quantization Matrices . . . . . . . . . . . . . . . . . . . .
13
3.1.3
Huﬀman Codebooks . . . . . . . . . . . . . . . . . . . . .
14
3.2
High-Level Decode Process
. . . . . . . . . . . . . . . . . . . . .
15
3.2.1
Decoder Setup
. . . . . . . . . . . . . . . . . . . . . . . .
15
3.2.2
Decode Procedure
. . . . . . . . . . . . . . . . . . . . . .
15
4
Video Formats
21
4.1
Color Space Conventions . . . . . . . . . . . . . . . . . . . . . . .
21
4.2
Color Space Conversions and Parameters
. . . . . . . . . . . . .
22
4.3
Available Color Spaces . . . . . . . . . . . . . . . . . . . . . . . .
24
4.3.1
Rec. 470M (Rec. ITU-R BT.470-6 System M/NTSC with
Rec. ITU-R BT.601-5) . . . . . . . . . . . . . . . . . . . .
24
4.3.2
Rec. 470BG (Rec. ITU-R BT.470-6 Systems B and G with
Rec. ITU-R BT.601-5) . . . . . . . . . . . . . . . . . . . .
25
4.4
Pixel Formats . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
26
i

---

## Page 4

ii
CONTENTS
4.4.1
4:4:4 Subsampling
. . . . . . . . . . . . . . . . . . . . . .
27
4.4.2
4:2:2 Subsampling
. . . . . . . . . . . . . . . . . . . . . .
27
4.4.3
4:2:0 Subsampling
. . . . . . . . . . . . . . . . . . . . . .
28
4.4.4
Subsampling and the Picture Region . . . . . . . . . . . .
29
5
Bitpacking Convention
33
5.1
Overview
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
33
5.1.1
Octets and Bytes . . . . . . . . . . . . . . . . . . . . . . .
33
5.1.2
Words and Byte Order . . . . . . . . . . . . . . . . . . . .
33
5.1.3
Bit Order . . . . . . . . . . . . . . . . . . . . . . . . . . .
34
5.2
Coding Bits into Bytes . . . . . . . . . . . . . . . . . . . . . . . .
34
5.2.1
Signedness
. . . . . . . . . . . . . . . . . . . . . . . . . .
34
5.2.2
Encoding Example . . . . . . . . . . . . . . . . . . . . . .
35
5.2.3
Decoding Example . . . . . . . . . . . . . . . . . . . . . .
36
5.2.4
End-of-Packet Alignment
. . . . . . . . . . . . . . . . . .
37
5.2.5
Reading Zero Bit Integers . . . . . . . . . . . . . . . . . .
37
6
Bitstream Headers
39
6.1
Common Header Decode . . . . . . . . . . . . . . . . . . . . . . .
40
6.2
Identiﬁcation Header Decode
. . . . . . . . . . . . . . . . . . . .
40
6.3
Comment Header . . . . . . . . . . . . . . . . . . . . . . . . . . .
47
6.3.1
Comment Length Decode . . . . . . . . . . . . . . . . . .
47
6.3.2
Comment Header Decode . . . . . . . . . . . . . . . . . .
48
6.3.3
User Comment Format . . . . . . . . . . . . . . . . . . . .
49
6.4
Setup Header . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
51
6.4.1
Loop Filter Limit Table Decode . . . . . . . . . . . . . . .
51
6.4.2
Quantization Parameters Decode . . . . . . . . . . . . . .
52
6.4.3
Computing a Quantization Matrix . . . . . . . . . . . . .
56
6.4.4
DCT Token Huﬀman Tables . . . . . . . . . . . . . . . . .
59
6.4.5
Setup Header Decode
. . . . . . . . . . . . . . . . . . . .
60
7
Frame Decode
63
7.1
Frame Header Decode . . . . . . . . . . . . . . . . . . . . . . . .
63
7.2
Run-Length Encoded Bit Strings . . . . . . . . . . . . . . . . . .
65
7.2.1
Long-Run Bit String Decode
. . . . . . . . . . . . . . . .
65
7.2.2
Short-Run Bit String Decode . . . . . . . . . . . . . . . .
67
7.3
Coded Block Flags Decode
. . . . . . . . . . . . . . . . . . . . .
69
7.4
Macro Block Coding Modes . . . . . . . . . . . . . . . . . . . . .
71
7.5
Motion Vectors . . . . . . . . . . . . . . . . . . . . . . . . . . . .
74
7.5.1
Motion Vector Decode . . . . . . . . . . . . . . . . . . . .
74
7.5.2
Macro Block Motion Vector Decode
. . . . . . . . . . . .
76
7.6
Block-Level qi Decode . . . . . . . . . . . . . . . . . . . . . . . .
81
7.7
DCT Coeﬃcients . . . . . . . . . . . . . . . . . . . . . . . . . . .
85
7.7.1
EOB Token Decode
. . . . . . . . . . . . . . . . . . . . .
85
7.7.2
Coeﬃcient Token Decode
. . . . . . . . . . . . . . . . . .
88
7.7.3
DCT Coeﬃcient Decode . . . . . . . . . . . . . . . . . . .
96

---

## Page 5

CONTENTS
iii
7.8
Undoing DC Prediction
. . . . . . . . . . . . . . . . . . . . . . .
98
7.8.1
Computing the DC Predictor . . . . . . . . . . . . . . . .
99
7.8.2
Inverting the DC Prediction Process . . . . . . . . . . . . 103
7.9
Reconstruction . . . . . . . . . . . . . . . . . . . . . . . . . . . . 105
7.9.1
Predictors . . . . . . . . . . . . . . . . . . . . . . . . . . . 105
7.9.1.1
The Intra Predictor . . . . . . . . . . . . . . . . 106
7.9.1.2
The Whole-Pixel Predictor . . . . . . . . . . . . 106
7.9.1.3
The Half-Pixel Predictor
. . . . . . . . . . . . . 108
7.9.2
Dequantization . . . . . . . . . . . . . . . . . . . . . . . . 110
7.9.3
The Inverse DCT . . . . . . . . . . . . . . . . . . . . . . . 113
7.9.3.1
The 1D Inverse DCT
. . . . . . . . . . . . . . . 113
7.9.3.2
The 2D Inverse DCT
. . . . . . . . . . . . . . . 118
7.9.3.3
The 1D Forward DCT (Non-Normative) . . . . . 119
7.9.4
The Complete Reconstruction Algorithm
. . . . . . . . . 122
7.10 Loop Filtering . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 129
7.10.1 Horizontal Filter . . . . . . . . . . . . . . . . . . . . . . . 130
7.10.2 Vertical Filter . . . . . . . . . . . . . . . . . . . . . . . . . 131
7.10.3 Complete Loop Filter
. . . . . . . . . . . . . . . . . . . . 133
7.11 Complete Frame Decode . . . . . . . . . . . . . . . . . . . . . . . 137
A Ogg Bitstream Encapsulation
145
A.1 Overview
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 145
A.1.1
MIME type . . . . . . . . . . . . . . . . . . . . . . . . . . 145
A.2 Embedding in a logical bitstream . . . . . . . . . . . . . . . . . . 146
A.2.1
Headers . . . . . . . . . . . . . . . . . . . . . . . . . . . . 146
A.2.2
Frame data . . . . . . . . . . . . . . . . . . . . . . . . . . 146
A.2.3
Granule position . . . . . . . . . . . . . . . . . . . . . . . 146
A.3 Multiplexed stream mapping
. . . . . . . . . . . . . . . . . . . . 147
A.3.1
Chained streams . . . . . . . . . . . . . . . . . . . . . . . 147
A.3.2
Grouped streams . . . . . . . . . . . . . . . . . . . . . . . 147
B VP3
149
B.1
VP3 Compatibility . . . . . . . . . . . . . . . . . . . . . . . . . . 149
B.2
Loop Filter Limit Values . . . . . . . . . . . . . . . . . . . . . . . 150
B.3
Quantization Parameters . . . . . . . . . . . . . . . . . . . . . . . 150
B.4
Huﬀman Tables . . . . . . . . . . . . . . . . . . . . . . . . . . . . 151
C Colophon
193

---

## Page 6

iv
CONTENTS

---

## Page 7

List of Figures
2.1
Location of frame and picture regions
. . . . . . . . . . . . . . .
6
2.2
Subdivision of a frame into blocks and super blocks . . . . . . . .
7
2.3
Raster ordering of n × m blocks . . . . . . . . . . . . . . . . . . .
8
2.4
Hilbert curve ordering of blocks within a super block . . . . . . .
9
2.5
Subdivision of a frame into macro blocks . . . . . . . . . . . . . .
10
2.6
Hilbert curve ordering of macro blocks within a super block . . .
10
2.7
Example of reference frames for an inter frame
. . . . . . . . . .
11
2.8
Zig-zag order . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
12
4.1
Pixels encoded 4:4:4
. . . . . . . . . . . . . . . . . . . . . . . . .
27
4.2
Pixels encoded 4:2:2
. . . . . . . . . . . . . . . . . . . . . . . . .
28
4.3
Pixels encoded 4:2:0
. . . . . . . . . . . . . . . . . . . . . . . . .
29
4.4
Pixel correspondence between color planes with even picture oﬀ-
set and even picture size . . . . . . . . . . . . . . . . . . . . . . .
30
4.5
Pixel correspondence with even picture oﬀset and odd picture size 31
4.6
Pixel correspondence with odd picture oﬀset and odd picture size
31
4.7
Pixel correspondence with odd picture oﬀset and even picture size 31
6.1
Common Header Packet Layout . . . . . . . . . . . . . . . . . . .
39
6.2
Identiﬁcation Header Packet . . . . . . . . . . . . . . . . . . . . .
41
6.3
Length encoded string layout . . . . . . . . . . . . . . . . . . . .
47
6.4
Comment Header Layout
. . . . . . . . . . . . . . . . . . . . . .
48
6.5
Setup Header structure
. . . . . . . . . . . . . . . . . . . . . . .
51
7.1
Signal Flow Graph for the 1D Inverse DCT . . . . . . . . . . . . 115
7.2
Signal Flow Graph for the 1D Forward DCT
. . . . . . . . . . . 121
7.3
The loop ﬁlter response function. . . . . . . . . . . . . . . . . . . 129
v

---

## Page 8

vi
LIST OF FIGURES

---

## Page 9

List of Tables
2.1
Color Plane Indices . . . . . . . . . . . . . . . . . . . . . . . . . .
5
3.1
Quantization Type Indices . . . . . . . . . . . . . . . . . . . . . .
14
4.1
Rec. 470M Parameters . . . . . . . . . . . . . . . . . . . . . . . .
25
4.2
Rec. 470BG Parameters . . . . . . . . . . . . . . . . . . . . . . .
26
6.3
Enumerated List of Color Spaces . . . . . . . . . . . . . . . . . .
45
6.4
Enumerated List of Pixel Formats
. . . . . . . . . . . . . . . . .
46
6.5
Number of Super Blocks for each Pixel Format . . . . . . . . . .
46
6.6
Number of Blocks for each Pixel Format . . . . . . . . . . . . . .
47
6.18 Minimum Quantization Values
. . . . . . . . . . . . . . . . . . .
58
7.3
Frame Type Values . . . . . . . . . . . . . . . . . . . . . . . . . .
64
7.7
Huﬀman Codes for Long Run Lengths . . . . . . . . . . . . . . .
67
7.11 Huﬀman Codes for Short Run Lengths . . . . . . . . . . . . . . .
68
7.18 Macro Block Coding Modes . . . . . . . . . . . . . . . . . . . . .
73
7.19 Macro Block Mode Schemes . . . . . . . . . . . . . . . . . . . . .
73
7.23 Huﬀman Codes for Motion Vector Components . . . . . . . . . .
83
7.33 EOB Token Summary . . . . . . . . . . . . . . . . . . . . . . . .
86
7.38 Coeﬃcient Token Summary . . . . . . . . . . . . . . . . . . . . .
90
7.42 Huﬀman Table Groups . . . . . . . . . . . . . . . . . . . . . . . .
98
7.46 Reference Frames for Each Coding Mode . . . . . . . . . . . . . . 101
7.47 Weights and Divisors for Each Set of Available DC Predictors . . 103
7.65 16-bit Approximations of Sines and Cosines . . . . . . . . . . . . 115
7.75 Reference Planes and Sizes for Each rﬁand pli . . . . . . . . . . 127
7.85 Reconstructed Planes and Sizes for Each pli . . . . . . . . . . . . 135
7.89 Width and Height of Chroma Planes for each Pixel Format
. . . 142
vii

---

## Page 10

viii
LIST OF TABLES

---

## Page 11

Notation and Conventions
All parameters either passed in or out of a decoding procedure are given in
bold face.
The preﬁx b indicates that the following value is to be interpreted as a binary
number (base 2).
Example: The value b1110100 is equal to the decimal value 116.
The preﬁx 0x indicates the the following value is to be interpreted as a
hexadecimal number (base 16).
Example: The value 0x74 is equal to the decimal value 116.
All arithmetic deﬁned by this speciﬁcation is exact. However, any real num-
bers that do arise will always be converted back to integers again in short order.
The entire speciﬁcation can be implemented using only normal integer opera-
tions. All operations are to be implemented with suﬃciently large integers so
that overﬂow cannot occur. Where the result of a computation is to be trun-
cated to a ﬁxed-sized binary representation, this will be explicitly noted. The
size given for all variables is the maximum number of bits needed to store any
value in that variable. Intermediate computations involving that variable may
require more bits.
The following operators are deﬁned:
|a| The absolute value of a number a.
|a| =
 −a,
a < 0
a,
a ≥0
a ∗b Multiplication of a number a by a number b.
a
b Exact division of a number a by a number b, producing a potentially non-
integer result.
⌊a⌋The largest integer less than or equal to a real number a.
⌈a⌉The smallest integer greater than or equal to a real number a.
ix

---

## Page 12

x
Notation and Conventions
a//b Integer division of a by b.
a//b =
  a
b

,
a < 0
 a
b

,
a ≥0
a%b The remainder from the integer division of a by b.
a%b = a −|b| ∗
 a
|b|

Note that with this deﬁnition, the result is always non-negative and less
than |b|.
a << b The value obtained by left-shifting the two’s complement integer a by
b bits. For purposes of this speciﬁcation, overﬂow is ignored, and so this
is equivalent to integer multiplication of a by 2b.
a >> b The value obtained by right-shifting the two’s complement integer a by
b bits, ﬁlling in the leftmost bits of the new value with 0 if a is non-negative
and 1 if a is negative. This is not equivalent to integer division of a by 2b.
Instead,
a >> b =
j a
2b
k
.
round(a) Rounds a number a to the nearest integer, with ties rounded away
from 0.
round(a) =
 ⌈a −1
2⌉
a ≤0
⌊a + 1
2⌋
a > 0
sign(a) Returns the sign of a given number.
sign(a) =



−1
a < 0
0
a = 0
1
a > 0
ilog(a) The minimum number of bits required to store a positive integer a in
two’s complement notation, or 0 for a non-positive integer a.
ilog(a) =
 0,
a ≤0
⌊log2 a⌋+ 1,
a > 0
Examples:
 ilog(−1) = 0
 ilog(0) = 0
 ilog(1) = 1
 ilog(2) = 2

---

## Page 13

Notation and Conventions
xi
 ilog(3) = 2
 ilog(4) = 3
 ilog(7) = 3
min(a, b) The minimum of two numbers a and b.
max(a, b) The maximum of two numbers a and b.

---

## Page 14

xii
Notation and Conventions

---

## Page 15

Key words
The key words “MUST”, “MUST NOT”, “REQUIRED”, “SHALL”, “SHALL
NOT”, “SHOULD”, “SHOULD NOT”, “RECOMMENDED”, “MAY”, and
“OPTIONAL” in this document are to be intrepreted as described in RFC
2119 [Bra97].
Where such assertions are placed on the contents of a Theora bitstream itself,
implementations should be prepared to encounter bitstreams that do not follow
these requirements. An application’s behavior in the presecence of such non-
conforming bitstreams is not deﬁned by this speciﬁcation, but any reasonable
method of handling them MAY be used. By way of example, applications MAY
discard the current frame, retain the current output thus far, or attempt to
continue on by assuming some default values for the erroneous bits. When such
an error occurs in the bitstream headers, an application MAY refuse to decode
the entire stream. An application SHOULD NOT allow such non-conformant
bitstreams to overﬂow buﬀers and potentially execute arbitrary code, as this
represents a serious security risk.
An application MUST, however, ensure any bits marked as reserved have
the value zero, and refuse to decode the stream if they do not. These are used
as place holders for future bitstream features with which the current bitstream
is forward-compatible. Such features may not increment the bitstream version
number, and can only be recognized by checking the value of these reserved bits.
xiii

---

## Page 16

xiv
Key words

---

## Page 17

Chapter 1
Introduction
Theora is a general purpose, lossy video codec. It is based on the VP3 video
codec produced by On2 Technologies (<http://www.on2.com/>). On2 donated
the VP3.1 source code to the Xiph.Org Foundation and released it under a
BSD-like license. On2 also made an irrevocable, royalty-free license grant for
any patent claims it might have over the software and any derivatives. No formal
speciﬁcation exists for the VP3 format beyond this source code, however Mike
Melanson maintains a detailed description [Mel04]. Portions of this speciﬁcation
were adopted from that text with permission.
1.1
VP3 and Theora
Theora contains a superset of the features that were available in the original
VP3 codec. Content encoded with VP3.1 can be losslessly transcoded into the
Theora format. Theora content cannot, in general, be losslessly transcoded into
the VP3 format. If a feature is not available in the original VP3 format, this
is mentioned when that feature is deﬁned. A complete list of these features
appears in Appendix B.1.
1.2
Video Formats
Theora currently supports progressive video data of arbitrary dimensions at a
constant frame rate in one of several Y ′CbCr color spaces. The precise deﬁnition
the supported color spaces appears in Section 4.3. Three diﬀerent chroma sub-
sampling formats are supported: 4:2:0, 4:2:2, and 4:4:4. The precise details of
each of these formats and their sampling locations are described in Section 4.4.
The Theora format does not support interlaced material, variable frame
rates, bit-depths larger than 8 bits per component, nor alternate color spaces
such as RGB or arbitrary multi-channel spaces. Black and white content can
be eﬃciently encoded, however, because the uniform chroma planes compress
well. Support for interlaced material is planned for a future version.
1

---

## Page 18

2
CHAPTER 1. INTRODUCTION
Note: Infrequently changing frame rates—as when ﬁlm and video
sequences are cut together—can be supported in the Ogg con-
tainer format by chaining several Theora streams together.
Support for increased bit depths or additional color spaces is not planned.
1.3
Classiﬁcation
Theora is a block-based lossy transform codec that utilizes an 8 × 8 Type-II
Discrete Cosine Transform and block-based motion compensation. This places
it in the same class of codecs as MPEG-1, -2, -4, and H.263. The details of
how individual blocks are organized and how DCT coeﬃcients are stored in the
bitstream diﬀer substantially from these codecs, however. Theora supports only
intra frames (I frames in MPEG) and inter frames (P frames in MPEG). There
is no equivalent to the bi-predictive frames (B frames) found in MPEG codecs.
1.4
Assumptions
The Theora codec design assumes a complex, psychovisually-aware encoder and
a simple, low-complexity decoder.
Theora provides none of its own framing, synchronization, or protection
against transmission errors. An encoder is solely a method of accepting input
video frames and compressing these frames into raw, unformatted ‘packets’.
The decoder then accepts these raw packets in sequence, decodes them, and
synthesizes a fascimile of the original video frames. Theora is a free-form variable
bit rate (VBR) codec, and packets have no minimum size, maximum size, or
ﬁxed/expected size.
Theora packets are thus intended to be used with a transport mechanism that
provides free-form framing, synchronization, positioning, and error correction in
accordance with these design assumptions, such as Ogg (for ﬁle transport) or
RTP (for network multicast). For the purposes of a few examples in this doc-
ument, we will assume that Theora is embedded in an Ogg stream speciﬁcally,
although this is by no means a requirement or fundamental assumption in the
Theora design.
The speciﬁcation for embedding Theora into an Ogg transport stream is
given in Appendix A.
1.5
Codec Setup and Probability Model
Theora’s heritage is the proprietary commerical codec VP3, and it retains a
fair amount of inﬂexibility when compared to Vorbis [Xip02], the ﬁrst Xiph.Org
codec, which began as a research codec. However, to provide additional scope
for encoder improvement, Theora adopts some of the conﬁgurable aspects of

---

## Page 19

1.6. FORMAT CONFORMANCE
3
decoder setup that are present in Vorbis. This conﬁguration data is not available
in VP3, which uses hardcoded values instead.
Theora makes the same controversial design decision that Vorbis made to
include the entire probability model for the DCT coeﬃcients and all the quan-
tization parameters in the bitstream headers.
This is often several hundred
ﬁelds. It is therefore impossible to decode any frame in the stream without
having previously fetched the codec info and codec setup headers.
Note: Theora can initiate decode at an arbitrary intra-frame packet
within a bitstream so long as the codec has been initialized with
the setup headers.
Thus, Theora headers are both required for decode to begin and relatively
large as bitstream headers go. The header size is unbounded, although as a
rule-of-thumb less than 16kB is recommended, and Xiph.Org’s reference encoder
follows this suggestion.
Our own design work indicates that the primary liability of the required
header is in mindshare; it is an unusual design and thus causes some amount
of complaint among engineers as this runs against current design trends and
points out limitations in some existing software/interface designs. However, we
ﬁnd that it does not fundamentally limit Theora’s suitable application space.
1.6
Format Conformance
The Theora format is well-deﬁned by its decode speciﬁcation; any encoder that
produces packets that are correctly decoded by an implementation following this
speciﬁcation may be considered a proper Theora encoder. A decoder must faith-
fully and completely implement the speciﬁcation deﬁned herein to be considered
a conformant Theora decoder. A decoder need not be implemented strictly as
described, but the actual decoder process MUST be entirely mathematically
equivalent to the described process. Where appropriate, a non-normative de-
scription of encoder processes is included. These sections will be marked as
such, and a proper Theora encoder is not bound to follow them.

---

## Page 20

4
CHAPTER 1. INTRODUCTION

---

## Page 21

Chapter 2
Coded Video Structure
Theora’s encoding and decoding process is based on 8 × 8 blocks of pixels. This
sections describes how a video frame is laid out, divided into blocks, and how
those blocks are organized.
2.1
Frame Layout
A video frame in Theora is a two-dimensional array of pixels. Theora, like VP3,
uses a right-handed coordinate system, with the origin in the lower-left corner
of the frame. This is contrary to many video formats which use a left-handed
coordinate system with the origin in the upper-left corner of the frame.
Theora divides the pixel array up into three separate color planes, one for
each of the Y ′, Cb, and Cr components of the pixel. The Y ′ plane is also called
the luma plane, and the Cb and Cr planes are also called the chroma planes.
Each plane is assigned a numerical value, as shown in Table 2.1.
Index
Color Plane
0
Y ′
1
Cb
2
Cr
Table 2.1: Color Plane Indices
In some pixel formats, the chroma planes are subsampled by a factor of two
in one or both directions. This means that the width or height of the chroma
planes may be half that of the total frame width and height. The luma plane is
never subsampled.
5

---

## Page 22

6
CHAPTER 2. CODED VIDEO STRUCTURE
2.2
Picture Region
An encoded video frame in Theora is required to have a width and height that are
multiples of sixteen, making an integral number of blocks even when the chroma
planes are subsampled. However, inside a frame a smaller picture region may
be deﬁned to present material whose dimensions are not a multiple of sixteen
pixels, as shown in Figure 2.1. The picture region can be oﬀset from the lower-
left corner of the frame by up to 255 pixels in each direction, and may have
an arbitrary width and height, provided that it is contained entirely within the
coded frame. It is this picture region that contains the actual video data. The
portions of the frame which lie outside the picture region may contain arbitrary
image data, so the frame must be cropped to the picture region before display.
The picture region plays no other role in the decode process, which operates on
the entire video frame.
X Offset
Picture
Picture
Y Offset
Picture Width
Frame Height
Frame Width
Picture Height
Frame
Picture
(0,0)
Figure 2.1: Location of frame and picture regions

---

## Page 23

2.3. BLOCKS AND SUPER BLOCKS
7
2.3
Blocks and Super Blocks
Each color plane is subdivided into blocks of 8 × 8 pixels. Blocks are grouped
into 4×4 arrays called super blocks as shown in Figure 2.2. Each color plane has
its own set of blocks and super blocks. If the chroma planes are subsampled,
they are still divided into 8 × 8 blocks of pixels; there are just fewer blocks
than in the luma plane. The boundaries of blocks and super blocks in the luma
plane do not necessarily coincide with those of the chroma planes, if the chroma
planes have been subsampled.
(0,0)
Frame
Super Block (4x4)
8x8
Block
...
...
Figure 2.2: Subdivision of a frame into blocks and super blocks
Blocks are accessed in two diﬀerent orders in the various decoder processes.
The ﬁrst is raster order, illustrated in Figure 2.3. This accesses each block in
row-major order, starting in the lower left of the frame and continuing along
the bottom row of the entire frame, followed by the next row up, starting on
the left edge of the frame, etc.
The second is coded order. In coded order, blocks are accessed by super
block. Within each frame, super blocks are traversed in raster order, similar to

---

## Page 24

8
CHAPTER 2. CODED VIDEO STRUCTURE
0
1
2
...
...
m−1
2m−1
m
(n−1)*m
n*m−1
Figure 2.3: Raster ordering of n × m blocks
raster order for blocks. Within each super block, however, blocks are accessed
in a Hilbert curve pattern, illustrated in Figure 2.4. If a color plane does not
contain a complete super block on the top or right sides, the same ordering is
still used, simply with any blocks outside the frame boundary ommitted.
To illustrate this ordering, consider a frame that is 240 pixels wide and 48
pixels high. Each row of the luma plane has 30 blocks and 8 super blocks, and
there are 6 rows of blocks and two rows of super blocks.
When accessed in coded order, each block in the luma plane is assigned the
following indices:
123
122
125
124
. . .
179
178
120
121
126
127
. . .
176
177
5
6
9
10
. . .
117
118
4
7
8
11
. . .
116
119
3
2
13
12
. . .
115
114
0
1
14
15
. . .
112
113
Here the index values specify the order in which the blocks would be accessed.
The indices of the blocks are numbered continuously from one color plane to
the next. They do not reset to zero at the start of each plane. Instead, the
numbering increases continuously from the Y ′ plane to the Cb plane to the Cr

---

## Page 25

2.4. MACRO BLOCKS
9
0
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
Figure 2.4: Hilbert curve ordering of blocks within a super block
plane. The implication is that the blocks from all planes are treated as a unit
during the various processing steps.
Although blocks are sometimes accessed in raster order, in this document
the index associated with a block is always its index in coded order.
2.4
Macro Blocks
A macro block contains a 2 × 2 array of blocks in the luma plane and the co-
located blocks in the chroma planes, as shown in Figure 2.5. Thus macro blocks
can represent anywhere from six to twelve blocks, depending on how the chroma
planes are subsampled. This is in contrast to super blocks, which only contain
blocks from a single color plane. Macro blocks contain information about coding
mode and motion vectors for the corresponding blocks in all color planes.
Macro blocks are also accessed in a coded order. This coded order proceeds by
examining each super block in the luma plane in raster order, and traversing the
four macro blocks inside using a smaller Hilbert curve, as shown in Figure 2.6.
If the luma plane does not contain a complete super block on the top or right
sides, the same ordering is still used, with any macro blocks outside the frame
boundary simply omitted. Because the frame size is constrained to be a multiple
of 16, there are never any partial macro blocks. Unlike blocks, macro blocks
need never be accessed in a pure raster order.

---

## Page 26

10
CHAPTER 2. CODED VIDEO STRUCTURE
(0,0)
Frame: chroma plane
Macroblock
Block
Block
8x8
Frame: chroma plane
Frame: luma plane
Figure 2.5: Subdivision of a frame into macro blocks
0
1
2
3
Figure 2.6: Hilbert curve ordering of macro blocks within a super block

---

## Page 27

2.5. CODING MODES AND PREDICTION
11
Using the same frame size as the example above, there are 15 macro blocks
in each row and 3 rows of macro blocks. The macro blocks are assigned the
following indices:
30
31
32
33
· · ·
42
43
44
1
2
5
6
· · ·
25
26
29
0
3
4
7
· · ·
24
27
28
2.5
Coding Modes and Prediction
Each block is coded using one of a small, ﬁxed set of coding modes that deﬁne
how the block is predicted from previous frames. A block is predicted using
one of two reference frames, selected according to the coding mode. A reference
frame is the fully decoded version of a previous frame in the stream. The ﬁrst
available reference frame is the previous intra frame, called the golden frame.
The second available reference frame is the previous frame, whether it was an
intra frame or an inter frame. If the previous frame was an intra frame, then
both reference frames are the same. See Figure 2.7 for an illustration of the
reference frames used for an intra frame that does not follow an intra frame.
...
Intra
Inter
Inter
Inter
Inter
Inter
Inter
current
reference
frame
frame
golden
frame
Figure 2.7: Example of reference frames for an inter frame
Two coding modes in particular are worth mentioning here. The INTRA
mode is used for blocks that are not predicted from either reference frame. This
is the only coding mode allowed in intra frames. The INTER NOMV coding
mode uses the co-located contents of the block in the previous frame as the
predictor. This is the default coding mode.
2.6
DCT Coeﬃcients
A residual is added to the predicted contents of a block to form the ﬁnal re-
construction. The residual is stored as a set of quantized coeﬃcients from an

---

## Page 28

12
CHAPTER 2. CODED VIDEO STRUCTURE
integer approximation of a two-dimensional Type II Discrete Cosine Transform.
The DCT takes an 8×8 array of pixel values as input and returns an 8×8 array
of coeﬃcient values. The natural ordering of these coeﬃcients is deﬁned to be
row-major order, from lowest to highest frequency. They are also often indexed
in zig-zag order, as shown in Figure 2.8.
c
0
1
2
3
4
5
6
7
0
0 →1
5 →6
14→15
27→28
↙
↗
↙
↗
↙
↗
↙
1
2
4
7
13
16
26
29
42
↓↗
↙
↗
↙
↗
↙
↗↓
2
3
8
12
17
25
30
41
43
↙
↗
↙
↗
↙
↗
↙
3
9
11
18
24
31
40
44
53
r
↓↗
↙
↗
↙
↗
↙
↗↓
4
10
19
23
32
39
45
52
54
↙
↗
↙
↗
↙
↗
↙
5
20
22
33
38
46
51
55
60
↓↗
↙
↗
↙
↗
↙
↗↓
6
21
34
37
47
50
56
59
61
↙
↗
↙
↗
↙
↗
↙
7
35→36
48→49
57→58
62→63
Figure 2.8: Zig-zag order
Note: the row and column indices refer to frequency number and
not pixel locations.
The frequency numbers are deﬁned inde-
pendently of the memory organization of the pixels. They have
been written from top to bottom here to follow conventional no-
tation, despite the right-handed coordinate system Theora uses
for pixel locations. Many implementations of the DCT operate
‘in-place’.
That is, they return DCT coeﬃcients in the same
memory buﬀer that the initial pixel values were stored in. Due
to the right-handed coordinate system used for pixel locations in
Theora, one must note carefully how both pixel values and DCT
coeﬃcients are organized in memory in such a system.
DCT coeﬃcient (0, 0) is called the DC coeﬃcient. All the other coeﬃcients
are called AC coeﬃcients.

---

## Page 29

Chapter 3
Decoding Overview
This section provides a high level description of the Theora codec’s construction.
A bit-by-bit speciﬁcation appears beginning in Section 5. The later sections as-
sume a high-level understanding of the Theora decode process, which is provided
below.
3.1
Decoder Conﬁguration
Decoder setup consists of conﬁguration of the quantization matrices and the
Huﬀman codebooks for the DCT coeﬃcients, and a table of limit values for the
deblocking ﬁlter. The remainder of the decoding pipeline is not conﬁgurable.
3.1.1
Global Conﬁguration
The global codec conﬁguration consists of a few video related ﬁelds, such as
frame rate, frame size, picture size and oﬀset, aspect ratio, color space, pixel
format, and a version number. The version number is divided into a major
version, a minor version, amd a minor revision number. For the format deﬁned in
this speciﬁcation, these are ‘3’, ‘2’, and ‘1’, respectively, in reference to Theora’s
origin as a successor to the VP3.1 format.
3.1.2
Quantization Matrices
Theora allows up to 384 diﬀerent quantization matrices to be deﬁned, one for
each quantization type, color plane (Y ′, Cb, or Cr), and quantization index, qi,
which ranges from zero to 63, inclusive. There are currently two quantization
types deﬁned, which depend on the coding mode of the block being dequantized,
as shown in Table 3.1.
The quantization index, on the other hand, nominally represents a progres-
sive range of quality levels, from low quality near zero to high quality near 63.
However, the interpretation is arbitrary, and it is possible, for example, to par-
tition the scale into two completely separate ranges with 32 levels each that are
13

---

## Page 30

14
CHAPTER 3. DECODING OVERVIEW
Quantization Type
Usage
0
INTRA-mode blocks
1
Blocks in any other mode.
Table 3.1: Quantization Type Indices
meant to represent diﬀerent classes of source material, or any other arrangement
that suits the encoder’s requirements.
Each quantization matrix is an 8×8 matrix of 16-bit values, which is used to
quantize the output of the 8×8 DCT. Quantization matrices are speciﬁed using
three components: a base matrix and two scale values. The ﬁrst scale value is
the DC scale, which is applied to the DC component of the base matrix. The
second scale value is the AC scale, which is applied to all the other components
of the base matrix. There are 64 DC scale values and 64 AC scale values, one
for each qi value.
There are 64 elements in each base matrix, one for each DCT coeﬃcient.
They are stored in natural order (cf.
Section 2.6).
There is a separate set
of base matrices for each quantization type and each color plane, with up to
64 possible base matrices in each set, one for each qi value.
Typically the
bitstream contains matrices for only a sparse subset of the possible qi values.
The base matrices for the remainder of the qi values are computed using linear
interpolation. This conﬁguration allows the encoder to adjust the quantization
matrices to approximate the complex, non-linear response of the human visual
system to diﬀerent quantization errors.
Finally, because the in-loop deblocking ﬁlter strength depends on the strength
of the quantization matrices deﬁned in this header, a table of 64 loop ﬁlter limit
values is deﬁned, one for each qi value.
The precise speciﬁcation of how all of this information is decoded appears
in Section 6.4.1 and Section 6.4.2.
3.1.3
Huﬀman Codebooks
Theora uses 80 conﬁgurable binary Huﬀman codes to represent the 32 tokens
used to encode DCT coeﬃcients. Each of the 32 token values has a diﬀerent
semantic meaning and is used to represent single coeﬃcient values, zero runs,
combinations of the two, and End-Of-Block markers.
The 80 codes are divided up into ﬁve groups of 16, with each group corre-
sponding to a set of DCT coeﬃcient indices. The ﬁrst group corresponds to the
DC coeﬃcient, while the remaining four groups correspond to diﬀerent subsets
of the AC coeﬃcients. Within each frame, two pairs of 4-bit codebook indices
are stored. The ﬁrst pair selects which codebooks to use from the DC coeﬃcient
group for the Y ′ coeﬃcients and the Cb and Cr coeﬃcients. The second pair
selects which codebooks to use from all four of the AC coeﬃcient groups for the
Y ′ coeﬃcients and the Cb and Cr coeﬃcients.

---

## Page 31

3.2. HIGH-LEVEL DECODE PROCESS
15
The precise speciﬁcation of how the codebooks are decoded appears in Sec-
tion 6.4.4.
3.2
High-Level Decode Process
3.2.1
Decoder Setup
Before decoding can begin, a decoder MUST be initialized using the bitstream
headers corresponding to the stream to be decoded. Theora uses three header
packets; all are required, in order, by this speciﬁcation. Once set up, decode
may begin at any intra-frame packet—or even inter-frame packets, provided the
appropriate decoded reference frames have already been decoded and cached—
belonging to the Theora stream. In Theora I, all packets after the three initial
headers are intra-frame or inter-frame packets.
The header packets are, in order, the identiﬁcation header, the comment
header, and the setup header.
Identiﬁcation Header
The identiﬁcation header identiﬁes the stream as Theora, provides a version
number, and deﬁnes the characteristics of the video stream such as frame size.
A complete description of the identiﬁcation header appears in Section 6.2.
Comment Header
The comment header includes user text comments (‘tags’) and a vendor string
for the application/library that produced the stream. The format of the com-
ment header is the same as that used in the Vorbis I and Speex codecs, with
slight modiﬁcations due to the use of a diﬀerent bit packing mechanism. A com-
plete description of how the comment header is coded appears in Section 6.3,
along with a suggested set of tags.
Setup Header
The setup header includes extensive codec setup information, including the com-
plete set of quantization matrices and Huﬀman codebooks needed to decode the
DCT coeﬃcients. A complete description of the setup header appears in Sec-
tion 6.4.
3.2.2
Decode Procedure
The decoding and synthesis procedure for all video packets is fundamentally the
same, with some steps omitted for intra frames.
 Decode packet type ﬂag.
 Decode frame header.

---

## Page 32

16
CHAPTER 3. DECODING OVERVIEW
 Decode coded block information (inter frames only).
 Decode macro block mode information (inter frames only).
 Decode motion vectors (inter frames only).
 Decode block-level qi information.
 Decode DC coeﬃcient for each coded block.
 Decode 1st AC coeﬃcient for each coded block.
 Decode 2nd AC coeﬃcient for each coded block.
 . . .
 Decode 63rd AC coeﬃcient for each coded block.
 Perform DC coeﬃcient prediction.
 Reconstruct coded blocks.
 Copy uncoded bocks.
 Perform loop ﬁltering.
Note: clever rearrangement of the steps in this process is possi-
ble. As an example, in a memory-constrained environment, one
can make multiple passes through the DCT coeﬃcients to avoid
buﬀering them all in memory.
On the ﬁrst pass, the starting
location of each coeﬃcient is identiﬁed, and then 64 separate get
pointers are used to read in the 64 DCT coeﬃcients required to
reconstruct each coded block in sequence. This operation pro-
duces entirely equivalent output and is naturally perfectly legal.
It may even be a beneﬁt in non-memory-constrained environ-
ments due to a reduced cache footprint.
Theora makes equivalence easy to check by deﬁning all decoding operations
in terms of exact integer operations. No ﬂoating-point math is required, and
in particular, the implementation of the iDCT transform MUST be followed
precisely. This prevents the decoder mismatch problem commonly associated
with codecs that provide a less rigorous transform speciﬁcation. Such a mis-
match problem would be devastating to Theora, since a single rounding error in
one frame could propagate throughout the entire succeeding frame due to DC
prediction.

---

## Page 33

3.2. HIGH-LEVEL DECODE PROCESS
17
Packet Type Decode
Theora uses four packet types. The ﬁrst three packet types mark each of the
three Theora headers described above. The fourth packet type marks a video
packet. All other packet types are reserved; packets marked with a reserved
type should be ignored.
Additionally, zero-length packets are treated as if they were an inter frame
with no blocks coded. That is, as a duplicate frame.
Frame Header Decode
The frame header contains some global information about the current frame.
The ﬁrst is the frame type ﬁeld, which speciﬁes if this is an intra frame or
an inter frame.
Inter frames predict their contents from previously decoded
reference frames. Intra frames can be independently decoded with no established
reference frames.
The next piece of information in the frame header is the list of qi values
allowed in the frame. Theora allows from one to three diﬀerent qi values to be
used in a single frame, each of which selects a set of six quantization matrices,
one for each quantization type (inter or intra), and one for each color plane.
The ﬁrst qi value is always used when dequantizing DC coeﬃcients. The qi
value used when dequantizing AC coeﬃcients, however, can vary from block to
block. VP3, in contrast, only allows a single qi value per frame for both the DC
and AC coeﬃcients.
Coded Block Information
This stage determines which blocks in the frame are coded and which are un-
coded. A coded block list is constructed which lists all the coded blocks in coded
order. For intra frames, every block is coded, and so no data needs to be read
from the packet.
Macro Block Mode Information
For intra frames, every block is coded in INTRA mode, and this stage is skipped.
In inter frames a coded macro block list is constructed from the coded block list.
Any macro block which has at least one of its luma blocks coded is considered
coded; all other macro blocks are uncoded, even if they contain coded chroma
blocks. A coding mode is decoded for each coded macro block, and assigned
to all its constituent coded blocks. All coded chroma blocks in uncoded macro
blocks are assigned the INTER NOMV coding mode.
Motion Vectors
Intra frames are coded entirely in INTRA mode, and so this stage is skipped.
Some inter coding modes, however, require one or more motion vectors to be

---

## Page 34

18
CHAPTER 3. DECODING OVERVIEW
speciﬁed for each macro block. These are decoded in this stage, and an appro-
priate motion vector is assigned to each coded block in the macro block.
Block-Level qi Information
If a frame allows multiple qi values, the qi value assigned to each block is
decoded here. Frames that use only a single qi value have nothing to decode.
DCT Coeﬃcients
Finally, the quantized DCT coeﬃcients are decoded. A list of DCT coeﬃcients
in zig-zag order for a single block is represented by a list of tokens. A token
can take on one of 32 diﬀerent values, each with a diﬀerent semantic meaning.
A single token can represent a single DCT coeﬃcient, a run of zero coeﬃcients
within a single block, a combination of a run of zero coeﬃcients followed by a
single non-zero coeﬃcient, an End-Of-Block marker, or a run of EOB markers.
EOB markers signify that the remainder of the block is one long zero run. Unlike
JPEG and MPEG, there is no requirement for each block to end with a special
marker. If non-EOB tokens yield values for all 64 of the coeﬃcients in a block,
then no EOB marker occurs.
Each token is associated with a speciﬁc token index in a block. For single-
coeﬃcient tokens, this index is the zig-zag index of the token in the block. For
zero-run tokens, this index is the zig-zag index of the ﬁrst coeﬃcient in the
run. For combination tokens, the index is again the zig-zag index of the ﬁrst
coeﬃcient in the zero run. For EOB markers, which signify that the remainder
of the block is one long zero run, the index is the zig-zag index of the ﬁrst zero
coeﬃcient in that run. For EOB runs, the token index is that of the ﬁrst EOB
marker in the run. Due to zero runs and EOB markers, a block does not have
to have a token for every zig-zag index.
Tokens are grouped in the stream by token index, not by the block they
originate from. This means that for each zig-zag index in turn, the tokens with
that index from all the coded blocks are coded in coded block order. When
decoding, a current token index is maintained for each coded block. This index
is advanced by the number of coeﬃcients that are added to the block as each
token is decoded. After fully decoding all the tokens with token index ti, the
current token index of every coded block will be ti or greater.
If an EOB run of n blocks is decoded at token index ti, then it ends the
next n blocks in coded block order whose current token index is equal to ti, but
not greater. If there are fewer than n blocks with a current token index of ti,
then the decoder goes through the coded block list again from the start, ending
blocks with a current token index of ti + 1, and so on, until n blocks have been
ended.
Tokens are read by parsing a Huﬀman code that depends on ti and the color
plane of the next coded block whose current token index is equal to ti, but not
greater. The Huﬀman codebooks are selected on a per-frame basis from the 80
codebooks deﬁned in the setup header. Many tokens have a ﬁxed number of

---

## Page 35

3.2. HIGH-LEVEL DECODE PROCESS
19
extra bits associated with them. These bits are read from the packet immediately
after the token is decoded. These are used to deﬁne things such as coeﬃcient
magnitude, sign, and the length of runs.
DC Prediction
After the coeﬃcients for each block are decoded, the quantized DC value of each
block is adjusted based on the DC values of its neighbors. This adjustment is
performed by scanning the blocks in raster order, not coded block order.
Reconstruction
Finally, using the coding mode, motion vector (if applicable), quantized coeﬃ-
cient list, and qi value deﬁned for each block, all the coded blocks are recon-
structed. The DCT coeﬃcients are dequantized, an inverse DCT transform is
applied, and the predictor is formed from the coding mode and motion vector
and added to the result.
Loop Filtering
To complete the reconstructed frame, an “in-loop” deblocking ﬁlter is applied
to the edges of all coded blocks.

---

## Page 36

20
CHAPTER 3. DECODING OVERVIEW

---

## Page 37

Chapter 4
Video Formats
This section gives a precise description of the video formats that Theora is ca-
pable of storing.
The Theora bitstream is capable of handling video at any
arbitrary resolution up to 1048560 × 1048560.
Such video would require al-
most three terabytes of storage per frame for uncompressed data, so compliant
decoders MAY refuse to decode images with sizes beyond their capabilities.
The remainder of this section talks about two speciﬁc aspects of the video
format: the color space and the pixel format. The ﬁrst describes how color
is represented and how to transform that color representation into a device
independent color space such as CIE XY Z (1931). The second describes the
various schemes for sampling the color values in time and space.
4.1
Color Space Conventions
There are a large number of diﬀerent color standards used in digital video. Since
Theora is a lossy codec, it restricts itself to only a few of them to simplify play-
back. Unlike the alternate method of describing all the parameters of the color
model, this allows a few dedicated routines for color conversion to be written
and heavily optimized in a decoder. More ﬂexible conversion functions should
instead be speciﬁed in an encoder, where additional computational complexity
is more easily tolerated. The color spaces were selected to give a fair represen-
tation of color standards in use around the world today. Most of the standards
that do not exactly match one of these can be converted to one fairly easily.
All Theora color spaces are Y ′CbCr color spaces with one luma channel
and two chroma channels. Each channel contains 8-bit discrete values in the
range 0 . . . 255, which represent non-linear gamma pre-corrected signals. The
Theora identiﬁcation header contains an 8-bit value that describes the color
space. This merely selects one of the color spaces available from an enumerated
list. Currently, only two color spaces are deﬁned, with a third possibility that
indicates the color space is “unknown”.
21

---

## Page 38

22
CHAPTER 4. VIDEO FORMATS
4.2
Color Space Conversions and Parameters
The parameters which describe the conversions between each color space are
listed below. These are the parameters needed to map colors from the encoded
Y ′CbCr representation to the device-independent color space CIE XY Z (1931).
These parameters deﬁne abstract mathematical conversion functions which are
inﬁnitely precise. The accuracy and precision with which the conversions are
performed in a real system is determined by the quality of output desired and the
available processing power. Exact decoder output is deﬁned by this speciﬁcation
only in the original Y ′CbCr space.
Y ′CbCr to Y ′PbPr:
This conversion takes 8-bit discrete values in the range [0 . . . 255] and maps
them to real values in the range [0 . . . 1] for Y and [−1
2 . . . 1
2] for Pb and
Pr. Because some values may fall outside the oﬀset and excursion deﬁned
for each channel in the Y ′CbCr space, the results may fall outside these
ranges in Y ′PbPr space. No clamping should be done at this stage.
Y ′
out = Y ′
in −OﬀsetY
ExcursionY
(4.1)
Pb = Cb −OﬀsetCb
ExcursionCb
(4.2)
Pr = Cr −OﬀsetCr
ExcursionCr
(4.3)
Parameters: OﬀsetY,Cb,Cr, ExcursionY,Cb,Cr.
Y ′PbPr to R′G′B′:
This conversion takes the one luma and two chroma channel representation
and maps it to the non-linear R′G′B′ space used to drive actual output
devices. Values should be clamped into the range [0 . . . 1] after this stage.
R′ = Y ′ + 2(1 −Kr)Pr
(4.4)
G′ = Y ′ −2 (1 −Kb)Kb
1 −Kb −Kr
Pb −2 (1 −Kr)Kr
1 −Kb −Kr
Pr
(4.5)
B′ = Y ′ + 2(1 −Kb)Pb
(4.6)
Parameters: Kb, Kr.
R′G′B′ to RGB (Output device gamma correction):

---

## Page 39

4.2. COLOR SPACE CONVERSIONS AND PARAMETERS
23
This conversion takes the non-linear R′G′B′ voltage levels and maps them
to linear light levels produced by the actual output device. Note that this
conversion is only that of the output device, and its inverse is not that
used by the input device. Because a dim viewing environment is assumed
in most television standards, the overall gamma between the input and
output devices is usually around 1.1 to 1.2, and not a strict 1.0.
For calibration with actual output devices, the model
L = (E′ + ∆)γ
(4.7)
should be used, with ∆the free parameter and γ held ﬁxed to the value
speciﬁed in this document. The conversion function presented here is an
idealized version with ∆= 0.
R = R′γ
(4.8)
G = G′γ
(4.9)
B = B′γ
(4.10)
Parameters: γ.
RGB to R′G′B′ (Input device gamma correction):
This conversion takes linear light levels and maps them to the non-linear
voltage levels produced in the actual input device. This information is
merely informative. It is not required for building a decoder or for con-
verting between the various formats and the actual output capabilities of
a particular device.
A linear segment is introduced on the low end to reduce noise in dark
areas of the image. The rest of the scale is adjusted so that the power
segment of the curve intersects the linear segment with the proper slope,
and so that it still maps 0 to 0 and 1 to 1.
R′ =
 αR,
0 ≤R < δ
(1 + ϵ)Rβ −ϵ,
δ ≤R ≤1
(4.11)
G′ =
 αG,
0 ≤G < δ
(1 + ϵ)Gβ −ϵ,
δ ≤G ≤1
(4.12)
B′ =
 αB,
0 ≤B < δ
(1 + ϵ)Bβ −ϵ,
δ ≤B ≤1
(4.13)
Parameters: β, α, δ, ϵ.
RGB to CIE XY Z (1931):

---

## Page 40

24
CHAPTER 4. VIDEO FORMATS
This conversion maps a device-dependent linear RGB space to the device-
independent linear CIE XY Z space. The parameters are the CIE chro-
maticity coordinates of the three primaries—red, green, and blue—as well
as the chromaticity coordinates of the white point of the device. This is
how hardware manufacturers and standards typically describe a particular
RGB space. The math required to convert these parameters into a useful
transformation matrix is reproduced below.
F =


xr
yr
xg
yg
xb
yb
1
1
1
1−xr−yr
yr
1−xg−yg
yg
1−xb−yb
yb


(4.14)


sr
sg
sb

= F −1


xw
yw
1
1−xw−yw
yw


(4.15)


X
Y
Z

= F


srR
sgG
sbB


(4.16)
Parameters: xr, xg, xb, xw, yr, yg, yb, yw.
4.3
Available Color Spaces
These are the color spaces currently deﬁned for use by Theora video. Each one
has a short name, with which it is referred to in this document, and a more
detailed speciﬁcation of the standards from which its parameters are derived.
Some standards do not specify all the parameters necessary. For these unspeci-
ﬁed parameters, this document serves as the deﬁnition of what should be used
when encoding or decoding Theora video.
4.3.1
Rec. 470M (Rec. ITU-R BT.470-6 System M/NTSC
with Rec. ITU-R BT.601-5)
This color space is used by broadcast television and DVDs in much of the
Americas, Japan, Korea, and the Union of Myanmar [ITU98]. This color space
may also be used for System M/PAL (Brazil), with an appropriate conversion
supplied by the encoder to compensate for the diﬀerent gamma value.
See
Section 4.3.2 for an appropriate gamma value to assume for M/PAL input.
In the US, studio monitors are adjusted to a D65 white point (xw, yw =
0.313, 0.329). In Japan, studio monitors are adjusted to a D white of 9300K
(xw, yw = 0.285, 0.293).
Rec. 470 does not specify a digital encoding of the color signals. For Theora,
Rec. ITU-R BT.601-5 [ITU95] is used, starting from the R′G′B′ signals speciﬁed
by Rec. 470.

---

## Page 41

4.3. AVAILABLE COLOR SPACES
25
Rec. 470 does not specify an input gamma function. For Theora, the Rec. 709
[ITU02] input function is assumed. This is the same as that speciﬁed by SMPTE
170M [SMP94], which claims to reﬂect modern practice in the creation of NTSC
signals circa 1994.
The parameters for all the color transformations deﬁned in Section 4.2 are
given in Table 4.1.
OﬀsetY,Cb,Cr = (16, 128, 128)
ExcursionY,Cb,Cr = (219, 224, 224)
Kr = 0.299
Kb = 0.114
γ = 2.2
β = 0.45
α = 4.5
δ = 0.018
ϵ = 0.099
xr, yr = 0.67, 0.33
xg, yg = 0.21, 0.71
xb, yb = 0.14, 0.08
(Illuminant C) xw, yw = 0.310, 0.316
Table 4.1: Rec. 470M Parameters
4.3.2
Rec. 470BG (Rec. ITU-R BT.470-6 Systems B and
G with Rec. ITU-R BT.601-5)
This color space is used by the PAL and SECAM systems in much of the rest
of the world [ITU98] This can be used directly by systems (B, B1, D, D1, G, H,
I, K, N)/PAL and (B, D, G, H, K, K1, L)/SECAM.
Note: the Rec. 470BG chromaticity values are diﬀerent from those
speciﬁed in Rec. 470M. When PAL and SECAM systems were
ﬁrst designed, they were based upon the same primaries as NTSC.
However, as methods of making color picture tubes have changed,
the primaries used have changed as well. The U.S. recommends
using correction circuitry to approximate the existing, standard
NTSC primaries. Current PAL and SECAM systems have stan-
dardized on primaries in accord with more recent technology.

---

## Page 42

26
CHAPTER 4. VIDEO FORMATS
Rec. 470 provisionally permits the use of the NTSC chromaticity values
(given in Section 4.3.1) with legacy PAL and SECAM equipment. In Theora,
material must be decoded assuming the new PAL and SECAM primaries. Ma-
terial intended for display on old legacy devices should be converted by the
decoder.
The oﬃcial Rec. 470BG speciﬁes a gamma value of γ = 2.8. However, in
practice this value is unrealistically high [Poy97]. Rec. 470BG states that the
overall system gamma should be approximately γβ = 1.2. Since most cameras
pre-correct with a gamma value of β = 0.45, this suggests an output device
gamma of approximately γ = 2.67. This is the value recommended for use with
PAL systems in Theora.
Rec. 470 does not specify a digital encoding of the color signals. For Theora,
Rec. ITU-R BT.601-5 [ITU95] is used, starting from the R′G′B′ signals speciﬁed
by Rec. 470.
Rec. 470 does not specify an input gamma function. For Theora, the Rec
709 [ITU02] input function is assumed.
The parameters for all the color transformations deﬁned in Section 4.2 are
given in Table 4.2.
OﬀsetY,Cb,Cr = (16, 128, 128)
ExcursionY,Cb,Cr = (219, 224, 224)
Kr = 0.299
Kb = 0.114
γ = 2.67
β = 0.45
α = 4.5
δ = 0.018
ϵ = 0.099
xr, yr = 0.64, 0.33
xg, yg = 0.29, 0.60
xb, yb = 0.15, 0.06
(D65) xw, yw = 0.313, 0.329
Table 4.2: Rec. 470BG Parameters
4.4
Pixel Formats
Theora supports several diﬀerent pixel formats, each of which uses diﬀerent
subsampling for the chroma planes relative to the luma plane. A decoder may

---

## Page 43

4.4. PIXEL FORMATS
27
need to recover a full resolution chroma plane with samples co-sited with the
luma plane in order to convert to RGB for display or perform other process-
ing. Decoders can assume that the chroma signal satisﬁes the Nyquist-Shannon
sampling theorem. The ideal low-pass reconstruction ﬁlter this implies is not
practical, but any suitable approximation can be used, depending on the avail-
able computing power. Decoders MAY simply use a box ﬁlter, assigning to each
luma sample the chroma sample closest to it. Encoders would not go wrong in
assuming that this will be the most common approach.
4.4.1
4:4:4 Subsampling
All three color planes are stored at full resolution—each pixel has a Y ′, a Cb
and a Cr value (see Figure 4.1). The samples in the diﬀerent planes are all at
co-located sites.
Frame: chroma plane Cb
Frame: chroma plane Cr
Frame: luma planeY’
Pixels
(0,0)
Figure 4.1: Pixels encoded 4:4:4
4.4.2
4:2:2 Subsampling
The Cb and Cr planes are stored with half the horizontal resolution of the Y ′
plane. Thus, each of these planes has half the number of horizontal blocks as the

---

## Page 44

28
CHAPTER 4. VIDEO FORMATS
luma plane (see Figure 4.2). Similarly, they have half the number of horizontal
super blocks, rounded up. Macro blocks are deﬁned across color planes, and
so their number does not change, but each macro block contains half as many
chroma blocks.
The chroma samples are vertically aligned with the luma samples, but hor-
izontally centered between two luma samples. Thus, each luma sample has a
unique closest chroma sample.
A horizontal phase shift may be required to
produce signals which use diﬀerent horizontal chroma sampling locations for
compatibility with diﬀerent systems.
Frame: chroma plane Cb
Frame: chroma plane Cr
Frame: luma planeY’
Pixels
(0,0)
Figure 4.2: Pixels encoded 4:2:2
4.4.3
4:2:0 Subsampling
The Cb and Cr planes are stored with half the horizontal and half the vertical
resolution of the Y ′ plane. Thus, each of these planes has half the number of
horizontal blocks and half the number of vertical blocks as the luma plane, for a
total of one quarter the number of blocks (see Figure 4.3). Similarly, they have
half the number of horizontal super blocks and half the number of vertical super
blocks, rounded up. Macro blocks are deﬁned across color planes, and so their

---

## Page 45

4.4. PIXEL FORMATS
29
number does not change, but each macro block contains within it one quarter
as many chroma blocks.
The chroma samples are vertically and horizontally centered between four
luma samples. Thus, each luma sample has a unique closest chroma sample.
This is the same sub-sampling pattern used with JPEG, MJPEG, and MPEG-
1, and was inherited from VP3. A horizontal or vertical phase shift may be
required to produce signals which use diﬀerent chroma sampling locations for
compatibility with diﬀerent systems.
Frame: chroma plane Cb
Frame: chroma plane Cr
Frame: luma planeY’
Pixels
(0,0)
Figure 4.3: Pixels encoded 4:2:0
4.4.4
Subsampling and the Picture Region
Although the frame size must be an integral number of macro blocks, and thus
both the number of pixels and the number of blocks in each direction must be
even, no such requirement is made of the picture region. Thus, when using sub-
sampled pixel formats, careful attention must be paid to which chroma samples
correspond to which luma samples.
As mentioned above, for each pixel format, there is a unique chroma sample
that is the closest to each luma sample. When cropping the chroma planes to
the picture region, all the chroma samples corresponding to a luma sample in

---

## Page 46

30
CHAPTER 4. VIDEO FORMATS
the cropped picture region must be included. Thus, when dividing the width or
height of the picture region by two to obtain the size of the subsampled chroma
planes, they must be rounded up.
Furthermore, the sampling locations are deﬁned relative to the frame, not
the picture region. When using the 4:2:2 and 4:2:0 formats, the locations of
chroma samples relative to the luma samples depends on whether or not the X
oﬀset of the picture region is odd. If the oﬀset is even, each column of chroma
samples corresponds to two columns of luma samples (see Figure 4.4 for an
example). The only exception is if the width is odd, in which case the last
column corresponds to only one column of luma samples (see Figure 4.5). If
the oﬀset is odd, then the ﬁrst column of chroma samples corresponds to only
one column of luma samples, while the remaining columns each correspond to
two (see Figure 4.6). In this case, if the width is even, the last column again
corresponds to only one column of luma samples (see Figure 4.7).
A similar process is followed with the rows of a picture region of odd height
encoded in the 4:2:0 format. If the Y oﬀset is even, each row of chroma samples
corresponds to two rows of luma samples (see Figure 4.4), except with an odd
height, where the last row corresponds to one row of chroma luna samples only
(see Figure 4.5). If the oﬀset is odd, then it is the ﬁrst row of chroma samples
which corresponds to only one row of luma samples, while the remaining rows
each correspond to two (Figure 4.6), except with an even height, where the last
row also corresponds to one (Figure 4.7).
Encoders should be aware of these diﬀerences in the subsampling when using
an even or odd oﬀset. In the typical case, with an even width and height, where
one expects two rows or columns of luma samples for every row or column of
chroma samples, the encoder must take care to ensure that the oﬀsets used are
both even.
...
...
...
...
(0,0)
(0,0)
(0,0)
Pixels
...
...
Frame: chroma (4:2:0 case)
Frame: chroma (4:2:2 case)
Frame: luma
Figure 4.4: Pixel correspondence between color planes with even picture oﬀset
and even picture size

---

## Page 47

4.4. PIXEL FORMATS
31
...
...
...
...
(0,0)
(0,0)
(0,0)
Pixels
...
...
Frame: chroma (4:2:0 case)
Frame: chroma (4:2:2 case)
Frame: luma
Figure 4.5: Pixel correspondence with even picture oﬀset and odd picture size
...
...
...
...
(0,0)
(0,0)
(0,0)
Pixels
...
...
Frame: chroma (4:2:0 case)
Frame: chroma (4:2:2 case)
Frame: luma
Figure 4.6: Pixel correspondence with odd picture oﬀset and odd picture size
...
...
...
...
(0,0)
(0,0)
(0,0)
Pixels
...
...
Frame: chroma (4:2:0 case)
Frame: chroma (4:2:2 case)
Frame: luma
Figure 4.7: Pixel correspondence with odd picture oﬀset and even picture size

---

## Page 48

32
CHAPTER 4. VIDEO FORMATS

---

## Page 49

Chapter 5
Bitpacking Convention
5.1
Overview
The Theora codec uses relatively unstructured raw packets containing binary
integer ﬁelds of arbitrary width. Logically, each packet is a bitstream in which
bits are written one-by-one by the encoder and then read one-by-one in the same
order by the decoder. Most current binary storage arrangements group bits into
a native storage unit of eight bits (octets), sixteen bits, thirty-two bits, or less
commonly other ﬁxed sizes.
The Theora bitpacking convention speciﬁes the
correct mapping of the logical packet bitstream into an actual representation in
ﬁxed-width units.
5.1.1
Octets and Bytes
In most contemporary architectures, a ‘byte’ is synonymous with an ‘octect’,
that is, eight bits. For purposes of the bitpacking convention, a byte implies the
smallest native integer storage representation oﬀered by a platform. Modern
ﬁle systems invariably oﬀer bytes as the fundamental atom of storage.
The most ubiquitous architectures today consider a ‘byte’ to be an octet.
Note, however, that the Theora bitpacking convention is still well deﬁned for
any native byte size; an implementation can use the native bit-width of a given
storage system. This document assumes that a byte is one octet for purposes
of example only.
5.1.2
Words and Byte Order
A ‘word’ is an integer size that is a grouped multiple of the byte size. Most
architectures consider a word to be a group of two, four, or eight bytes. Each
byte in the word can be ranked by order of ‘signiﬁcance’, e.g. the signiﬁcance
of the bits in each byte when storing a binary integer in the word. Several byte
orderings are possible in a word. The common ones are
33

---

## Page 50

34
CHAPTER 5. BITPACKING CONVENTION
 Big-endian: in which the most signiﬁcant byte comes ﬁrst, e.g. 3-2-1-0,
 Little-endian: in which the least signiﬁcant byte comes ﬁrst, e.g. 0-1-2-3,
and
 Mixed-endian: one of the less-common orderings that cannot be put into
the above two categories, e.g. 3-1-2-0 or 0-2-1-3.
The Theora bitpacking convention speciﬁes storage and bitstream manipu-
lation at the byte, not word, level. Thus host word ordering is of a concern only
during optimization, when writing code that operates on a word of storage at
a time rather than a byte. Logically, bytes are always encoded and decoded in
order from byte zero through byte n.
5.1.3
Bit Order
A byte has a well-deﬁned ‘least signiﬁcant’ bit (LSb), which is the only bit set
when the byte is storing the two’s complement integer value +1. A byte’s ‘most
signiﬁcant’ bit (MSb) is at the opposite end. Bits in a byte are numbered from
zero at the LSb to n for the MSb, where n = 7 in an octet.
5.2
Coding Bits into Bytes
The Theora codec needs to encode arbitrary bit-width integers from zero to 32
bits wide into packets. These integer ﬁelds are not aligned to the boundaries of
the byte representation; the next ﬁeld is read at the bit position immediately
after the end of the previous ﬁeld.
The decoder logically unpacks integers by ﬁrst reading the MSb of a binary
integer from the logical bitstream, followed by the next most signiﬁcant bit,
etc., until the required number of bits have been read. When unpacking the
bytes into bits, the decoder begins by reading the MSb of the integer to be read
from the most signiﬁcant unread bit position of the source byte, followed by the
next-most signiﬁcant bit position of the destination integer, and so on up to the
requested number of bits. Note that this diﬀers from the Vorbis I codec, which
begins decoding with the LSb of the source integer, reading it from the LSb of
the source byte. When all the bits of the current source byte are read, decoding
continues with the MSb of the next byte. Any unﬁlled bits in the last byte of
the packet MUST be cleared to zero by the encoder.
5.2.1
Signedness
The binary integers decoded by the above process may be either signed or
unsigned. This varies from integer to integer, and this speciﬁcation indicates
how each value should be interpreted as it is read.
That is, depending on
context, the three bit binary pattern b111 can be taken to represent either ‘7’
as an unsigned integer or ‘−1’ as a signed, two’s complement integer.

---

## Page 51

5.2. CODING BITS INTO BYTES
35
5.2.2
Encoding Example
The following example shows the state of an (8-bit) byte stream after several
binary integers are encoded, including the location of the put pointer for the
next bit to write to and the total length of the stream in bytes.
Encode the 4 bit unsigned integer value ‘12’ (b1100) into an empty byte
stream.
↓
7
6
5
4
3
2
1
0
byte 0
1
1
0
0
0
0
0
0
←
byte 1
0
0
0
0
0
0
0
0
byte 2
0
0
0
0
0
0
0
0
byte 3
0
0
0
0
0
0
0
0
...
...
byte n
0
0
0
0
0
0
0
0
byte stream length: 1 byte
Continue by encoding the 3 bit signed integer value ‘-1’ (b111).
↓
7
6
5
4
3
2
1
0
byte 0
1
1
0
0
1
1
1
0
←
byte 1
0
0
0
0
0
0
0
0
byte 2
0
0
0
0
0
0
0
0
byte 3
0
0
0
0
0
0
0
0
...
...
byte n
0
0
0
0
0
0
0
0
byte stream length: 1 byte
Continue by encoding the 7 bit integer value ‘17’ (b0010001).
↓
7
6
5
4
3
2
1
0
byte 0
1
1
0
0
1
1
1
0
byte 1
0
1
0
0
0
1
0
0
←
byte 2
0
0
0
0
0
0
0
0
byte 3
0
0
0
0
0
0
0
0
...
...
byte n
0
0
0
0
0
0
0
0
byte stream length: 2 bytes
Continue by encoding the 13 bit integer value ‘6969’ (b11011 00111001).

---

## Page 52

36
CHAPTER 5. BITPACKING CONVENTION
↓
7
6
5
4
3
2
1
0
byte 0
1
1
0
0
1
1
1
0
byte 1
0
1
0
0
0
1
1
1
byte 2
0
1
1
0
0
1
1
1
byte 3
0
0
1
0
0
0
0
0
←
...
...
byte n
0
0
0
0
0
0
0
0
byte stream length: 4 bytes
5.2.3
Decoding Example
The following example shows the state of the (8-bit) byte stream encoded in
the previous example after several binary integers are decoded, including the
location of the get pointer for the next bit to read.
Read a two bit unsigned integer from the example encoded above.
↓
7
6
5
4
3
2
1
0
byte 0
1
1
0
0
1
1
1
0
←
byte 1
0
1
0
0
0
1
1
1
byte 2
0
1
1
0
0
1
1
1
byte 3
0
0
1
0
0
0
0
0
byte stream length: 4 bytes
Value read: 3 (b11).
Read another two bit unsigned integer from the example encoded above.
↓
7
6
5
4
3
2
1
0
byte 0
1
1
0
0
1
1
1
0
←
byte 1
0
1
0
0
0
1
1
1
byte 2
0
1
1
0
0
1
1
1
byte 3
0
0
1
0
0
0
0
0
byte stream length: 4 bytes
Value read: 0 (b00).
Two things are worth noting here.
 Although these four bits were originally written as a single four-bit in-
teger, reading some other combination of bit-widths from the bitstream
is well deﬁned. No artiﬁcial alignment boundaries are maintained in the
bitstream.
 The ﬁrst value is the integer ‘3’ only because the context stated we were
reading an unsigned integer. Had the context stated we were reading a
signed integer, the returned value would have been the integer ‘−1’.

---

## Page 53

5.2. CODING BITS INTO BYTES
37
5.2.4
End-of-Packet Alignment
The typical use of bitpacking is to produce many independent byte-aligned
packets which are embedded into a larger byte-aligned container structure, such
as an Ogg transport bitstream. Externally, each bitstream encoded as a byte
stream MUST begin and end on a byte boundary. Often, the encoded packet
bitstream is not an integer number of bytes, and so there is unused space in the
last byte of a packet.
When a Theora encoder produces packets for embedding in a byte-aligned
container, unused space in the last byte of a packet is always zeroed during the
encoding process. Thus, should this unused space be read, it will return binary
zeroes. There is no marker pattern or stuﬃng bits that will allow the decoder
to obtain the exact size, in bits, of the original bitstream. This knowledge is
not required for decoding.
Attempting to read past the end of an encoded packet results in an ‘end-of-
packet’ condition. Any further read operations after an ‘end-of-packet’ condition
shall also return ‘end-of-packet’. Unlike Vorbis, Theora does not use truncated
packets as a normal mode of operation. Therefore if a decoder encounters the
‘end-of-packet’ condition during normal decoding, it may attempt to use the
bits that were read to recover as much of encoded data as possible, signal a
warning or error, or both.
5.2.5
Reading Zero Bit Integers
Reading a zero bit integer returns the value ‘0’ and does not increment the
stream pointer. Reading to the end of the packet, but not past the end, so
that an ‘end-of-packet’ condition is not triggered, and then reading a zero bit
integer shall succeed, returning ‘0’, and not trigger an ‘end-of-packet’ condition.
Reading a zero bit integer after a previous read sets the ‘end-of-packet’ condition
shall fail, also returning ‘end-of-packet’.

---

## Page 54

38
CHAPTER 5. BITPACKING CONVENTION

---

## Page 55

Chapter 6
Bitstream Headers
A Theora bitstream begins with three header packets.
The header packets
are, in order, the identiﬁcation header, the comment header, and the setup
header. All are required for decode compliance. An end-of-packet condition
encountered while decoding the identiﬁcation or setup header packets renders
the stream undecodable. An end-of-packet condition encountered while decode
the comment header is a non-fatal error condition, and MAY be ignored by a
decoder.
VP3 Compatibility
VP3 relies on the headers provided by its container, usually either AVI or Quick-
time. As such, several parameters available in these headers are not available
to VP3 streams. These are indicated as they appear in the sections below.
0
1
2
3
0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|
header type
|
‘t’
|
‘h’
|
‘e’
|
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|
‘o’
|
‘r’
|
‘a’
|
data...
|
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|
... header-specific data ...
|
|
...
|
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
Figure 6.1: Common Header Packet Layout
39

---

## Page 56

40
CHAPTER 6. BITSTREAM HEADERS
6.1
Common Header Decode
Input parameters:
None.
Output parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
HEADERTYPE
Integer
8
No
The type of the header be-
ing decoded.
Variables used:
None.
Each header packet begins with the same header ﬁelds, which are decoded
as follows:

1. Read an 8-bit unsigned integer as HEADERTYPE. If the most signiﬁ-
cant bit of this integer is not set, then stop. This is not a header packet.
2. Read 6 8-bit unsigned integers. If these do not have the values 0x74, 0x68,
0x65, 0x6F, 0x72, and 0x61, respectively, then stop. This stream is not
decodable by this speciﬁcation. These values correspond to the ASCII
values of the characters ‘t’, ‘h’, ‘e’, ‘o’, ‘r’, and ‘a’.
Decode continues according to HEADERTYPE. The identiﬁcation header
is type 0x80, the comment header is type 0x81, and the setup header is type
0x82. These packets must occur in the order: identiﬁcation, comment, setup.
All header packets have the most signiﬁcant bit of the type ﬁeld—which is the
initial bit in the packet—set. This distinguishes them from video data packets
in which the ﬁrst bit is unset. Packets with other header types (0x83–0xFF) are
reserved and MUST be ignored.
6.2
Identiﬁcation Header Decode
Input parameters:
None.

---

## Page 57

6.2. IDENTIFICATION HEADER DECODE
41
0
1
2
3
0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|
0x80
|
‘t’
|
‘h’
|
‘e’
|
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|
‘o’
|
‘r’
|
‘a’
|
VMAJ
|
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|
VMIN
|
VREV
|
FMBW
|
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|
FMBH
|
PICW...
|
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|
...PICW
|
PICH
|
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|
PICX
|
PICY
|
FRN...
|
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|
...FRN
|
FRD...
|
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|
...FRD
|
PARN...
|
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|
...PARN
|
PARD
|
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|
CS
|
NOMBR
|
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|
QUAL
| KFGSHIFT| PF| Res |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
Figure 6.2: Identiﬁcation Header Packet

---

## Page 58

42
CHAPTER 6. BITSTREAM HEADERS
Output parameters:

---

## Page 59

6.2. IDENTIFICATION HEADER DECODE
43
Name
Type
Size
(bits)
Signed?
Description and restrictions
VMAJ
Integer
8
No
The major version number.
VMIN
Integer
8
No
The minor version number.
VREV
Integer
8
No
The version revision number.
FMBW
Integer
16
No
The width of the frame in macro
blocks.
FMBH
Integer
16
No
The height of the frame in macro
blocks.
NSBS
Integer
32
No
The total number of super blocks
in a frame.
NBS
Integer
36
No
The total number of blocks in a
frame.
NMBS
Integer
32
No
The
total
number
of
macro
blocks in a frame.
PICW
Integer
20
No
The width of the picture region
in pixels.
PICH
Integer
20
No
The height of the picture region
in pixels.
PICX
Integer
8
No
The X oﬀset of the picture region
in pixels.
PICY
Integer
8
No
The Y oﬀset of the picture region
in pixels.
FRN
Integer
32
No
The frame-rate numerator.
FRD
Integer
32
No
The frame-rate denominator.
PARN
Integer
24
No
The pixel aspect-ratio numera-
tor.
PARD
Integer
24
No
The pixel aspect-ratio denomina-
tor.
CS
Integer
8
No
The color space.
PF
Integer
2
No
The pixel format.
NOMBR
Integer
24
No
The
nominal
bitrate
of
the
stream, in bits per second.
QUAL
Integer
6
No
The quality hint.
KFGSHIFT
Integer
5
No
The amount to shift the key
frame number by in the granule
position.
Variables used:
None.
The identiﬁcation header is a short header with only a few ﬁelds used to
declare the stream deﬁnitively as Theora and provide detailed information about
the format of the fully decoded video data. The identiﬁcation header is decoded
as follows:

---

## Page 60

44
CHAPTER 6. BITSTREAM HEADERS

1. Decode the common header ﬁelds according to the procedure described in
Section 6.1. If HEADERTYPE returned by this procedure is not 0x80,
then stop. This packet is not the identiﬁcation header.
2. Read an 8-bit unsigned integer as VMAJ. If VMAJ is not 3, then stop.
This stream is not decodable according to this speciﬁcation.
3. Read an 8-bit unsigned integer as VMIN. If VMIN is not 2, then stop.
This stream is not decodable according to this speciﬁcation.
4. Read an 8-bit unsigned integer as VREV. If VREV is greater than 1,
then this stream may contain optional features or interpretational changes
documented in a future version of this speciﬁcation. Regardless of the
value of VREV, the stream is decodable according to this speciﬁcation.
5. Read a 16-bit unsigned integer as FMBW. This MUST be greater than
zero. This speciﬁes the width of the coded frame in macro blocks. The
actual width of the frame in pixels is FMBW ∗16.
6. Read a 16-bit unsigned integer as FMBH. This MUST be greater than
zero. This speciﬁes the height of the coded frame in macro blocks. The
actual height of the frame in pixels is FMBH ∗16.
7. Read a 24-bit unsigned integer as PICW.
This MUST be no greater
than (FMBW ∗16). Note that 24 bits are read, even though only 20 bits
are suﬃcient to specify any value of the picture width. This is done to
preserve octet alignment in this header, to allow for a simpliﬁed parser
implementation.
8. Read a 24-bit unsigned integer as PICH.
This MUST be no greater
than (FMBH ∗16). Together with PICW, this speciﬁes the size of the
displayable picture region within the coded frame. See Figure 2.1. Again,
24 bits are read instead of 20.
9. Read an 8-bit unsigned integer as PICX. This MUST be no greater than
(FMBW ∗16 −PICX).
10. Read an 8-bit unsigned integer as PICY. This MUST be no greater than
(FMBH ∗16 −PICY). Together with PICX, this speciﬁes the location
of the lower-left corner of the displayable picture region. See Figure 2.1.
11. Read a 32-bit unsigned integer as FRN. This MUST be greater than
zero.
12. Read a 32-bit unsigned integer as FRD. This MUST be greater than
zero. Theora is a ﬁxed-frame rate video codec. Frames are sampled at
the constant rate of FRN
FRD frames per second. The presentation time of
the ﬁrst frame is at zero seconds. No mechanism is provided to specify a
non-zero oﬀset for the initial frame.

---

## Page 61

6.2. IDENTIFICATION HEADER DECODE
45
13. Read a 24-bit unsigned integer as PARN.
14. Read a 24-bit unsigned integer as PARD. Together with PARN, these
specify the aspect ratio of the pixels within a frame, deﬁned as the ratio
of the physical width of a pixel to its physical height. This is given by
the ratio PARN : PARD. If either of these ﬁelds are zero, this indicates
that pixel aspect ratio information was not available to the encoder. In
this case it MAY be speciﬁed by the application via an external means,
or a default value of 1 : 1 MAY be used.
15. Read an 8-bit unsigned integer as CS. This is a value from an enumerated
list of the available color spaces, given in Table 6.3. The ‘Undeﬁned’ value
indicates that color space information was not available to the encoder. It
MAY be speciﬁed by the application via an external means. If a reserved
value is given, a decoder MAY refuse to decode the stream.
Value
Color Space
0
Undeﬁned.
1
Rec. 470M (see Section 4.3.1).
2
Rec. 470BG (see Section 4.3.2).
3
Reserved.
...
255
Table 6.3: Enumerated List of Color Spaces
16. Read a 24-bit unsigned integer as NOMBR signifying a rate in bits per
second. Rates equal to or greater than 224 −1 bits per second are repre-
sented as 224 −1. The NOMBR ﬁeld is used only as a hint. For pure
VBR streams, this value may be considerably oﬀ. The ﬁeld MAY be set
to zero to indicate that the encoder did not care to speculate.
17. Read a 6-bit unsigned integer as QUAL. This value is used to provide
a hint as to the relative quality of the stream when compared to others
produced by the same encoder. Larger values indicate higher quality. This
can be used, for example, to select among several streams containing the
same material encoded with diﬀerent settings.
18. Read a 5-bit unsigned integer as KFGSHIFT.
The KFGSHIFT is
used to partition the granule position associated with each packet into two
diﬀerent parts. The frame number of the last key frame, starting from zero,
is stored in the upper 64−KFGSHIFT bits, while the lower KFGSHIFT
bits contain the number of frames since the last keyframe.
Complete
details on the granule position mapping are speciﬁed in Section REF.

---

## Page 62

46
CHAPTER 6. BITSTREAM HEADERS
19. Read a 2-bit unsigned integer as PF. The PF ﬁeld contains a value from
an enumerated list of the available pixel formats, given in Table 6.4. If the
reserved value 1 is given, stop. This stream is not decodable according to
this speciﬁcation.
Value
Pixel Format
0
4:2:0 (see Section 4.4.3).
1
Reserved.
2
4:2:2 (see Section 4.4.2).
3
4:4:4 (see Section 4.4.1).
Table 6.4: Enumerated List of Pixel Formats
20. Read a 3-bit unsigned integer.
These bits are reserved.
If this value
is not zero, then stop. This stream is not decodable according to this
speciﬁcation.
21. Assign NSBS a value according to PF, as given by Table 6.5.
22. Assign NBS a value according to PF, as given by Table 6.6.
23. Assign NMBS the value (FMBW ∗FMBH).
VP3 Compatibility
VP3 does not correctly handle frame sizes that are not a multiple of 16. Thus,
PICW and PICH should be set to the frame width and height in pixels,
respectively, and PICX and PICY should be set to zero. VP3 headers do not
specify a color space. VP3 only supports the 4:2:0 pixel format.
PF
NSBS
0
((FMBW + 1)//2) ∗((FMBH + 1)//2)

+ 2 ∗((FMBW + 3)//4) ∗((FMBH + 3)//4)
2
((FMBW + 1)//2) ∗((FMBH + 1)//2)
+ 2 ∗((FMBW + 3)//4) ∗((FMBH + 1)//2)
3
3 ∗((FMBW + 1)//2) ∗((FMBH + 1)//2)
Table 6.5: Number of Super Blocks for each Pixel Format

---

## Page 63

6.3. COMMENT HEADER
47
PF
NBS
0
6 ∗FMBW ∗FMBH
2
8 ∗FMBW ∗FMBH
3
12 ∗FMBW ∗FMBH
Table 6.6: Number of Blocks for each Pixel Format
4 byte length
UTF-8 encoded string ...
Figure 6.3: Length encoded string layout
6.3
Comment Header
The Theora comment header is the second of three header packets that begin
a Theora stream. It is meant for short text comments, not aribtrary metadata;
arbitrary metadata belongs in a separate logical stream that provides greater
structure and machine parseability.
The comment ﬁeld is meant to be used much like someone jotting a quick
note on the label of a video. It should be a little information to remember the
disc or tape by and explain it to others; a short, to-the-point text note that can
be more than a couple words, but isn’t going to be more than a short paragraph.
The essentials, in other words, whatever they turn out to be, e.g.:
The comment header is stored as a logical list of eight-bit clean vectors; the
number of vectors is bounded at 232 −1 and the length of each vector is limited
to 232 −1 bytes. The vector length is encoded; the vector contents themselves
are not null terminated. In addition to the vector list, there is a single vector
for a vendor name, also eight-bit clean with a length encoded in 32 bits.
6.3.1
Comment Length Decode
Input parameters:
None.
Output parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
LEN
Integer
32
No
A single 32-bit length value.
Variables used:
Name
Type
Size
(bits)
Signed?
Description and restrictions
LEN0
Integer
8
No
The ﬁrst octet of the string length.
LEN1
Integer
8
No
The second octet of the string length.
LEN2
Integer
8
No
The third octet of the string length.
LEN3
I t
8
N
Th f
th
t t
f th
t i
l
th

---

## Page 64

48
CHAPTER 6. BITSTREAM HEADERS
vendor string
number of comments
comment string
comment string
...
Figure 6.4: Comment Header Layout

1. Read an 8-bit unsigned integer as LEN0.
2. Read an 8-bit unsigned integer as LEN1.
3. Read an 8-bit unsigned integer as LEN2.
4. Read an 8-bit unsigned integer as LEN3.
5. Assign LEN the value (LEN0+(LEN1 << 8)+(LEN2 << 16)+(LEN3 <<
24)). This construction is used so that on platforms with 8-bit bytes, the
memory organization of the comment header is identical with that of Vor-
bis I, allowing for common parsing code despite the diﬀerent bit packing
conventions.
6.3.2
Comment Header Decode
Input parameters:
None.
Output parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
VENDOR
String
The vendor string.
NCOMMENTS
Integer
32
No
The number of user com-
ments.
COMMENTS
String Array
A list of NCOMMENTS
user comment values.
Variables used:
Name
Type
Size
(bits)
Signed?
Description and restrictions
ci
Integer
32
No
The index of the current user comment.
The complete comment header is decoded as follows:
1. Decode the common header ﬁelds according to the procedure described in
Section 6.1. If HEADERTYPE returned by this procedure is not 0x81,
then stop. This packet is not the comment header.

---

## Page 65

6.3. COMMENT HEADER
49
2. Decode the length of the vendor string using the procedure given in Sec-
tion 6.3.1 into LEN.
3. Read LEN 8-bit unsigned integers.
4. Set the string VENDOR to the contents of these octets.
5. Decode the number of user comments using the procedure given in Sec-
tion 6.3.1 into LEN.
6. Assign NCOMMENTS the value stored in LEN.
7. For each consecutive value of ci from 0 to (NCOMMENTS −1), inclu-
sive:
(a) Decode the length of the current user comment using the procedure
given in Section 6.3.1 into LEN.
(b) Read LEN 8-bit unsigned integers.
(c) Set the string COMMENTS[ci] to the contents of these octets.
The comment header comprises the entirety of the second header packet.
Unlike the ﬁrst header packet, it is not generally the only packet on the second
page and may span multiple pages. The length of the comment header packet is
(practically) unbounded. The comment header packet is not optional; it must
be present in the stream even if it is logically empty.
6.3.3
User Comment Format
The user comment vectors are structured similarly to a UNIX environment
variable. That is, comment ﬁelds consist of a ﬁeld name and a corresponding
value and look like:
COMMENTS[0]
=

“TITLE=the look of Theora”
COMMENTS[1]
=

“DIRECTOR=me”
The ﬁeld name is case-insensitive and MUST consist of ASCII characters
0x20 through 0x7D, 0x3D (‘=’) excluded. ASCII 0x41 through 0x5A inclusive
(characters ‘A’–‘Z’) are to be considered equivalent to ASCII 0x61 through
0x7A inclusive (characters ‘a’–‘z’). An entirely empty ﬁeld name—one that is
zero characters long—is not disallowed.
The ﬁeld name is immediately followed by ASCII 0x3D (‘=’); this equals sign
is used to terminate the ﬁeld name.
The data immediately after 0x3D until the end of the vector is the eight-bit
clean value of the ﬁeld contents encoded as a UTF-8 string [Yer96].
Field names MUST NOT be ‘internationalized’; this is a concession to sim-
plicity, not an attempt to exclude the majority of the world that doesn’t speak
English. Applications MAY wish to present internationalized versions of the
standard ﬁeld names listed below to the user, but they are not to be stored in

---

## Page 66

50
CHAPTER 6. BITSTREAM HEADERS
the bitstream. Field contents, however, use the UTF-8 character encoding to
allow easy representation of any language.
Individual ‘vendors’ MAY use non-standard ﬁeld names within reason. The
proper use of comment ﬁelds as human-readable notes has already been ex-
plained. Abuse will be discouraged.
There is no vendor-speciﬁc preﬁx to ‘non-standard’ ﬁeld names. Vendors
SHOULD make some eﬀort to avoid arbitrarily polluting the common names-
pace. Xiph.Org and other bodies will generally collect and rationalize the more
useful tags to help with standardization.
Field names are not restricted to occur only once within a comment header.
Field Names
Below is a proposed, minimal list of standard ﬁeld names with a description
of their intended use. No ﬁeld names are mandatory; a comment header may
contain one or more, all, or none of the names in this list.
TITLE: Video name.
ARTIST: Filmmaker or other creator name.
VERSION: Subtitle, remix info, or other text distinguishing versions of a video.
DATE: Date associated with the video. Implementations SHOULD attempt
to parse this ﬁeld as an ISO 8601 date for machine interpretation and
conversion.
LOCATION: Location associated with the video. This is usually the ﬁlming
location for non-ﬁction works.
COPYRIGHT: Copyright statement.
LICENSE: Copyright and other licensing information. Implementations wish-
ing to do automatic parsing of e.g of distribution terms SHOULD look
here for a URL uniquely deﬁning the license. If no instance of this ﬁeld is
present, or if no instance contains a parseable URL, and implementation
MAY look in the COPYRIGHT ﬁeld for such a URL.
ORGANIZATION: Studio name, Publisher, or other organization involved in
the creation of the video.
DIRECTOR: Director or Filmmaker credit, similar to ARTIST.
PRODUCER: Producer credit for the video.
COMPOSER: Music credit for the video.
ACTOR: Acting credit for the video.

---

## Page 67

6.4. SETUP HEADER
51
common header block
loop ﬁlter table resolution
loop ﬁlter table
scale table resolution
AC scale table
DC scale table
number of base matricies
base quatization matricies
...
quant range interpolation table
DCT token Huﬀman tables
Figure 6.5: Setup Header structure
TAG: subject or category tag, keyword, or other content classiﬁcation labels.
The value of each instance of this ﬁeld SHOULD be treated as a single
label, with multiple instances of the ﬁeld for multiple tags. The value of
a single ﬁeld SHOULD NOT be parsed into multiple tags based on some
internal delimeter.
DESCRIPTION: General description, summary, or blurb.
6.4
Setup Header
The Theora setup header contains the limit values used to drive the loop ﬁlter,
the base matrices and scale values used to build the dequantization tables, and
the Huﬀman tables used to unpack the DCT tokens. Because the contents of
this header are speciﬁc to Theora, no concessions have been made to keep the
ﬁelds octet-aligned for easy parsing.
6.4.1
Loop Filter Limit Table Decode
Input parameters:
None.
Output parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
LFLIMS
Integer
array
7
No
A 64-element array of loop ﬁlter
limit values.

---

## Page 68

52
CHAPTER 6. BITSTREAM HEADERS
Name
Type
Size
(bits)
Signed?
Description and restrictions
Variables used:
Name
Type
Size
(bits)
Signed?
Description and restrictions
qi
Integer
6
No
The quantization index.
NBITS
Integer
3
No
The size of values being read in the cur-
rent table.
This procedure decodes the table of loop ﬁlter limit values used to drive the
loop ﬁlter, which is described in Section 6.4.1. It is decoded as follows:

1. Read a 3-bit unsigned integer as NBITS.
2. For each consecutive value of qi from 0 to 63, inclusive:
(a) Read an NBITS-bit unsigned integer as LFLIMS[qi].
VP3 Compatibility
The loop ﬁlter limit values are hardcoded in VP3. The values used are given in
Appendix B.2.
6.4.2
Quantization Parameters Decode
Input parameters:
None.
Output parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
ACSCALE
Integer
array
16
No
A 64-element array of scale
values for AC coeﬃcients for
each qi value.

---

## Page 69

6.4. SETUP HEADER
53
Name
Type
Size
(bits)
Signed?
Description and restrictions
DCSCALE
Integer
array
16
No
A 64-element array of scale
values for the DC coeﬃcient
for each qi value.
NBMS
Integer
10
No
The number of base matrices.
BMS
2D Integer
array
8
No
A NBMS×64 array contain-
ing the base matrices.
NQRS
2D Integer
array
6
No
A 2 × 3 array containing the
number of quant ranges for a
given qti and pli, respectively.
This is at most 63.
QRSIZES
3D Integer
array
6
No
A 2 × 3 × 63 array of the
sizes of each quant range for a
given qti and pli, respectively.
Only the ﬁrst NQRS[qti][pli]
values are used.
QRBMIS
3D Integer
array
9
No
A 2 × 3 × 64 array of the
bmi’s used for each quant
range for a given qti and pli,
respectively.
Only the ﬁrst
(NQRS[qti][pli] + 1) values
are used.
Variables used:
Name
Type
Size
(bits)
Signed?
Description and restrictions
qti
Integer
1
No
A quantization type index.
See Ta-
ble 3.1.
qtj
Integer
1
No
A quantization type index.
pli
Integer
2
No
A color plane index. See Table 2.1.
plj
Integer
2
No
A color plane index.
qi
Integer
6
No
The quantization index.
ci
Integer
6
No
The DCT coeﬃcient index.
bmi
Integer
9
No
The base matrix index.
qri
Integer
6
No
The quant range index.
NBITS
Integer
5
No
The size of ﬁelds to read.
NEWQR
Integer
1
No
Flag that indicates a new set of quant
ranges will be deﬁned.

---

## Page 70

54
CHAPTER 6. BITSTREAM HEADERS
Name
Type
Size
(bits)
Signed?
Description and restrictions
RPQR
Integer
1
No
Flag that indicates the quant ranges
to copy will come from the same color
plane.
The AC scale and DC scale values are deﬁned in two simple tables with 64
values each, one for each qi value. The same scale values are used for every
quantization type and color plane.
The base matrices for all quantization types and color planes are stored in a
single table. These are then referenced by index in several sets of quant ranges.
The purpose of the quant ranges is to specify which base matrices are used for
which qi values.
A set of quant ranges is deﬁned for each quantization type and color plane.
To save space in the header, bit ﬂags allow a set of quant ranges to be copied from
a previously deﬁned set instead of being speciﬁed explicitly. Every set except
the ﬁrst one can be copied from the immediately preceding set. Similarly, if the
quantization type is not 0, the set can be copied from the set deﬁned for the
same color plane for the preceding quantization type. This formulation allows
compact representation of, for example, the same set of quant ranges in both
chroma channels, as is done in the original VP3, or the same set of quant ranges
in INTRA and INTER modes.
Each quant range is deﬁned by a size and two base matrix indices, one for
each end of the range. The base matrix for the end of one range is used as the
start of the next range, so that for n ranges, n + 1 base matrices are speciﬁed.
The base matrices for the qi values between the two endpoints of the range are
generated by linear interpolation.
The location of the endpoints of each range is encoded by their size. The qi
value for the left end-point is the sum of the sizes of all preceding ranges, and
the qi value for the right end-point adds the size of the current range. Thus the
sum of the sizes of all the ranges MUST be 63, so that the last range falls on
the last possible qi value.
The complete set of quantization parameters are decoded as follows:

1. Read a 4-bit unsigned integer. Assign NBITS the value read, plus one.
2. For each consecutive value of qi from 0 to 63, inclusive:
(a) Read an NBITS-bit unsigned integer as ACSCALE[qi].
3. Read a 4-bit unsigned integer. Assign NBITS the value read, plus one.
4. For each consecutive value of qi from 0 to 63, inclusive:
(a) Read an NBITS-bit unsigned integer as DCSCALE[qi].

---

## Page 71

6.4. SETUP HEADER
55
5. Read a 9-bit unsigned integer. Assign NBMS the value decoded, plus
one. NBMS MUST be no greater than 384.
6. For each consecutive value of bmi from 0 to (NBMS −1), inclusive:
(a) For each consecutive value of ci from 0 to 63, inclusive:
i. Read an 8-bit unsigned integer as BMS[bmi][ci].
7. For each consecutive value of qti from 0 to 1, inclusive:
(a) For each consecutive value of pli from 0 to 2, inclusive:
i. If qti > 0 or pli > 0, read a 1-bit unsigned integer as NEWQR.
ii. Else, assign NEWQR the value one.
iii. If NEWQR is zero, then we are copying a previously deﬁned set
of quant ranges. In that case:
A. If qti > 0, read a 1-bit unsigned integer as RPQR.
B. Else, assign RPQR the value zero.
C. If RPQR is one, assign qtj the value (qti −1) and assign plj
the value pli. This selects the set of quant ranges deﬁned
for the same color plane as this one, but for the previous
quantization type.
D. Else assign qtj the value (3 ∗qti + pli −1)//3 and assign plj
the value (pli + 2)%3. This selects the most recent set of
quant ranges deﬁned.
E. Assign NQRS[qti][pli] the value NQRS[qtj][plj].
F. Assign QRSIZES[qti][pli] the values in QRSIZES[qtj][plj].
G. Assign QRBMIS[qti][pli] the values in QRBMIS[qtj][plj].
iv. Else, NEWQR is one, which indicates that we are deﬁning a new
set of quant ranges. In that case:
A. Assign qri the value zero.
B. Assign qi the value zero.
C. Read an ilog(NBMS −1)-bit unsigned integer as
QRBMIS[qti][pli][qri]. If this is greater than or equal to
NBMS, stop. The stream is undecodable.
D. Read an ilog(62 −qi)-bit unsigned integer. Assign
QRSIZES[qti][pli][qri] the value read, plus one.
E. Assign qi the value qi + QRSIZES[qti][pli][qri].
F. Assign qri the value qri + 1.
G. Read an ilog(NBMS −1)-bit unsigned integer as
QRBMIS[qti][pli][qri].
H. If qi is less than 63, go back to step 7(a)ivD.
I. If qi is greater than 63, stop. The stream is undecodable.
J. Assign NQRS[qti][pli] the value qri.

---

## Page 72

56
CHAPTER 6. BITSTREAM HEADERS
VP3 Compatibility
The quantization parameters are hardcoded in VP3. The values used are given
in Appendix B.3.
6.4.3
Computing a Quantization Matrix
Input parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
ACSCALE
Integer
array
16
No
A 64-element array of scale
values for AC coeﬃcients for
each qi value.
DCSCALE
Integer
array
16
No
A 64-element array of scale
values for the DC coeﬃcient
for each qi value.
BMS
2D Integer
array
8
No
A NBMS×64 array contain-
ing the base matrices.
NQRS
2D Integer
array
6
No
A 2 × 3 array containing the
number of quant ranges for a
given qti and pli, respectively.
This is at most 63.
QRSIZES
3D Integer
array
6
No
A 2 × 3 × 63 array of the
sizes of each quant range for a
given qti and pli, respectively.
Only the ﬁrst NQRS[qti][pli]
values are used.
QRBMIS
3D Integer
array
9
No
A 2 × 3 × 64 array of the
bmi’s used for each quant
range for a given qti and pli,
respectively.
Only the ﬁrst
(NQRS[qti][pli] + 1) values
are used.
qti
Integer
1
No
A quantization type index.
See Table 3.1.
pli
Integer
2
No
A color plane index. See Ta-
ble 2.1.
qi
Integer
6
No
The quantization index.

---

## Page 73

6.4. SETUP HEADER
57
Output parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
QMAT
Integer
array
16
No
A 64-element array of quantization
values for each DCT coeﬃcient in
natural order.
Variables used:
Name
Type
Size
(bits)
Signed?
Description and restrictions
ci
Integer
6
No
The DCT coeﬃcient index.
bmi
Integer
9
No
The base matrix index.
bmj
Integer
9
No
The base matrix index.
qri
Integer
6
No
The quant range index.
QISTART
Integer
6
No
The left end-point of the qi range.
QIEND
Integer
6
No
The right end-point of the qi
range.
BM
Integer
array
8
No
A 64-element array containing the
interpolated base matrix.
QMIN
Integer
16
No
The minimum quantization value
allowed for the current coeﬃcient.
QSCALE
Integer
16
No
The current scale value.
The following procedure can be used to generate a single quantization matrix
for a given quantization type, color plane, and qi value, given the quantization
parameters decoded in Section 6.4.2.
Note that the product of the scale value and the base matrix value is in units
of 100ths of a pixel value, and thus is divided by 100 to return it to units of a
single pixel value. This value is then scaled by four, to match the scaling of the
DCT output, which is also a factor of four larger than the orthonormal version
of the transform.

1. Assign qri the index of a quant range such that
qi ≥
qri−1
X
qrj=0
QRSIZES[qti][pli][qrj],

---

## Page 74

58
CHAPTER 6. BITSTREAM HEADERS
and
qi ≤
qri
X
qrj=0
QRSIZES[qti][pli][qrj],
where summation from 0 to −1 is deﬁned to be zero. If there is more than
one such value of qri, i.e., if qi lies on the boundary between two quant
ranges, then the output will be the same regardless of which one is chosen.
2. Assign QISTART the value
qri−1
X
qrj=0
QRSIZES[qti][pli][qrj].
3. Assign QIEND the value
qri
X
qrj=0
QRSIZES[qti][pli][qrj].
4. Assign bmi the value QRBMIS[qti][pli][qri].
5. Assign bmj the value QRBMIS[qti][pli][qri + 1].
6. For each consecutive value of ci from 0 to 63, inclusive:
(a) Assign BM[ci] the value
(2 ∗(QIEND −qi) ∗BMS[bmi][ci]

+ 2 ∗(qi −QISTART) ∗BMS[bmj][ci]
+ QRSIZES[qti][pli][qri])//(2 ∗QRSIZES[qti][pli][qri])
(b) Assign QMIN the value given by Table 6.18 according to qti and ci.
Coeﬃcient
qti
QMIN
ci = 0
0 (Intra)
16
ci > 0
0 (Intra)
8
ci = 0
1 (Inter)
32
ci > 0
1 (Inter)
16
Table 6.18: Minimum Quantization Values
(c) If ci equals zero, assign QSCALE the value DCSCALE[qi].
(d) Else, assign QSCALE the value ACSCALE[qi].
(e) Assign QMAT[ci] the value
max(QMIN, min((QSCALE ∗BM[ci]//100) ∗4, 4096)).

---

## Page 75

6.4. SETUP HEADER
59
6.4.4
DCT Token Huﬀman Tables
Input parameters:
None.
Output parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
HTS
Huﬀman table array
An 80-element array of Huﬀman tables
with up to 32 entries each.
Variables used:
Name
Type
Size
(bits)
Signed?
Description and restrictions
HBITS
Bit string
32
No
A string of up to 32 bits.
TOKEN
Integer
5
No
A single DCT token value.
ISLEAF
Integer
1
No
Flag that indicates if the current
node of the tree being decoded is
a leaf node.
The Huﬀman tables used to decode DCT tokens are stored in the setup
header in the form of a binary tree. This enforces the requirements that the
code be full—so that any sequence of bits will produce a valid sequence of
tokens—and that the code be preﬁx-free so that there is no ambiguity when
decoding.
One more restriction is placed on the tables that is not explicitly enforced by
the bitstream syntax, but nevertheless must be obeyed by compliant encoders.
There must be no more than 32 entries in a single table. Note that this re-
striction along with the fullness requirement limit the maximum size of a single
Huﬀman code to 32 bits. It is probably a good idea to enforce this latter con-
sequence explicitly when implementing the decoding procedure as a recursive
algorithm, so as to prevent a possible stack overﬂow given an invalid bitstream.
Although there are 32 diﬀerent DCT tokens, and thus a normal table will
have exactly 32 entries, this is not explicitly required. It is allowable to use a
Huﬀman code that omits some—but not all—of the possible token values. It is
also allowable, if not particularly useful, to specify multiple codes for the same

---

## Page 76

60
CHAPTER 6. BITSTREAM HEADERS
token value in a single table. Note also that token values may appear in the
tree in any order. In particular, it is not safe to assume that token value zero
(which ends a single block), has a Huﬀman code of all zeros.
The tree is decoded as follows:

1. For each consecutive value of hti from 0 to 79, inclusive:
(a) Set HBITS to the empty string.
(b) If HBITS is longer than 32 bits in length, stop. The stream is unde-
codable.
(c) Read a 1-bit unsigned integer as ISLEAF.
(d) If ISLEAF is one:
i. If the number of entries in table HTS[hti] is already 32, stop.
The stream is undecodable.
ii. Read a 5-bit unsigned integer as TOKEN.
iii. Add the pair (HBITS, TOKEN) to Huﬀman table HTS[hti].
(e) Otherwise:
i. Add a ‘0’ to the end of HBITS.
ii. Decode the ‘0’ sub-tree using this procedure, starting from step 1b.
iii. Remove the ‘0’ from the end of HBITS and add a ‘1’ to the end
of HBITS.
iv. Decode the ‘1’ sub-tree using this procedure, starting from step 1b.
v. Remove the ‘1’ from the end of HBITS.
VP3 Compatibility
The DCT token Huﬀman tables are hardcoded in VP3. The values used are
given in Appendix B.4.
6.4.5
Setup Header Decode
Input parameters:
None.
Output parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
LFLIMS
Integer
array
7
No
A 64-element array of loop ﬁl-
ter limit values.

---

## Page 77

6.4. SETUP HEADER
61
Name
Type
Size
(bits)
Signed?
Description and restrictions
ACSCALE
Integer
array
16
No
A 64-element array of scale
values for AC coeﬃcients for
each qi value.
DCSCALE
Integer
array
16
No
A 64-element array of scale
values for the DC coeﬃcient
for each qi value.
NBMS
Integer
10
No
The number of base matrices.
BMS
2D Integer
array
8
No
A NBMS×64 array contain-
ing the base matrices.
NQRS
2D Integer
array
6
No
A 2 × 3 array containing the
number of quant ranges for a
given qti and pli, respectively.
This is at most 63.
QRSIZES
3D Integer
array
6
No
A 2 × 3 × 63 array of the
sizes of each quant range for a
given qti and pli, respectively.
Only the ﬁrst NQRS[qti][pli]
values will be used.
QRBMIS
3D Integer
array
9
No
A 2 × 3 × 64 array of the
bmi’s used for each quant
range for a given qti and pli,
respectively.
Only the ﬁrst
(NQRS[qti][pli] + 1) values
will be used.
HTS
Huﬀman table array
An 80-element array of Huﬀ-
man tables with up to 32 en-
tries each.
Variables used:
None.
The complete setup header is decoded as follows:

1. Decode the common header ﬁelds according to the procedure described in
Section 6.1. If HEADERTYPE returned by this procedure is not 0x82,
then stop. This packet is not the setup header.
2. Decode the loop ﬁlter limit value table using the procedure given in Sec-
tion 6.4.1 into LFLIMS.
3. Decode the quantization parameters using the procedure given in Sec-
tion 6.4.2. The results are stored in ACSCALE, DCSCALE, NBMS,
BMS, NQRS, QRSIZES, and QRBMIS.

---

## Page 78

62
CHAPTER 6. BITSTREAM HEADERS
4. Decode the DCT token Huﬀman tables using the procedure given in Sec-
tion 6.4.4 into HTS.

---

## Page 79

Chapter 7
Frame Decode
This section describes the complete procedure necessary to decode a single
frame. This begins with the frame header, followed by coded block ﬂags, macro
block modes, motion vectors, block-level qi values, and ﬁnally the DCT residual
tokens, which are used to reconstruct the frame.
7.1
Frame Header Decode
Input parameters:
None.
Output parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
FTYPE
Integer
1
No
The frame type.
NQIS
Integer
2
No
The number of qi values.
QIS
Integer
array
6
No
An NQIS-element array of qi val-
ues.
Variables used:
63

---

## Page 80

64
CHAPTER 7. FRAME DECODE
Name
Type
Size
(bits)
Signed?
Description and restrictions
MOREQIS
Integer
1
No
A ﬂag indicating there are more qi
values to be decoded.
The frame header selects which type of frame is being decoded, intra or inter,
and contains the list of qi values that will be used in this frame. The ﬁrst qi
value will be used for all DC coeﬃcients in all blocks. This is done to ensure
that DC prediction, which is done in the quantized domain, works as expected.
The AC coeﬃcients, however, can be dequantized using any qi value on the list,
selected on a block-by-block basis.

1. Read a 1-bit unsigned integer. If the value read is not zero, stop. This is
not a data packet.
2. Read a 1-bit unsigned integer as FTYPE. This is the type of frame being
decoded, as given in Table 7.3. If this is the ﬁrst frame being decoded,
this MUST be zero.
FTYPE
Frame Type
0
Intra frame
1
Inter frame
Table 7.3: Frame Type Values
3. Read in a 6-bit unsigned integer as QIS[0].
4. Read a 1-bit unsigned integer as MOREQIS.
5. If MOREQIS is zero, set NQIS to 1.
6. Otherwise:
(a) Read in a 6-bit unsigned integer as QIS[1].
(b) Read a 1-bit unsigned integer as MOREQIS.
(c) If MOREQIS is zero, set NQIS to 2.
(d) Otherwise:
i. Read in a 6-bit unsigned integer as QIS[2].
ii. Set NQIS to 3.
7. If FTYPE is 0, read a 3-bit unsigned integer. These bits are reserved. If
this value is not zero, stop. This frame is not decodable according to this
speciﬁcation.

---

## Page 81

7.2. RUN-LENGTH ENCODED BIT STRINGS
65
VP3 Compatibility
The precise format of the frame header is substantially diﬀerent in Theora than
in VP3. The original VP3 format includes a larger number of unused, reserved
bits that are required to be zero. The original VP3 frame header also can contain
only a single qi value, because VP3 does not support block-level qi values and
uses the same qi value for all the coeﬃcients in a frame.
7.2
Run-Length Encoded Bit Strings
Two variations of run-length encoding are used to store sequences of bits for
the block coded ﬂags and the block-level qi values. The procedures to decode
these bit sequences are speciﬁed in the following two sections.
7.2.1
Long-Run Bit String Decode
Input parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
NBITS
Integer
36
No
The number of bits to decode.
Output parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
BITS
Bit string
The decoded bits.
Variables used:
Name
Type
Size
(bits)
Signed?
Description and restrictions
LEN
Integer
36
No
The number of bits decoded so far.
BIT
Integer
1
No
The value associated with the current
run.
RLEN
Integer
13
No
The length of the current run.

---

## Page 82

66
CHAPTER 7. FRAME DECODE
Name
Type
Size
(bits)
Signed?
Description and restrictions
RBITS
Integer
4
No
The number of extra bits needed to
decode the run length.
RSTART
Integer
6
No
The start of the possible run-length
values for a given Huﬀman code.
ROFFS
Integer
12
No
The oﬀset from RSTART of the run-
length.
There is no practical limit to the number of consecutive 0’s and 1’s that
can be decoded with this procedure. In reality, the run length is limited by
the number of blocks in a single frame, because more will never be requested.
A separate procedure described in Section 7.2.2 is used when there is a known
limit on the maximum size of the runs.
For the ﬁrst run, a single bit value is read, and then a Huﬀman-coded rep-
resentation of a run length is decoded, and that many copies of the bit value
are appended to the bit string. For each consecutive run, the value of the bit is
toggled instead of being read from the bitstream.
The only exception is if the length of the previous run was 4129, the max-
imum possible length encodable by the Huﬀman-coded representation. In this
case another bit value is read from the stream, to allow for consecutive runs of
0’s or 1’s longer than this maximum.
Note that in both cases—for the ﬁrst run and after a run of length 4129—if
no more bits are needed, then no bit value is read.
The complete decoding procedure is as follows:

1. Assign LEN the value 0.
2. Assign BITS the empty string.
3. If LEN equals NBITS, return the completely decoded string BITS.
4. Read a 1-bit unsigned integer as BIT.
5. Read a bit at a time until one of the Huﬀman codes given in Table 7.7 is
recognized.
6. Assign RSTART and RBITS the values given in Table 7.7 according to
the Huﬀman code read.
7. Read an RBITS-bit unsigned integer as ROFFS.
8. Assign RLEN the value (RSTART + ROFFS).
9. Append RLEN copies of BIT to BITS.
10. Add RLEN to the value LEN.
LEN MUST be less than or equal to
NBITS.

---

## Page 83

7.2. RUN-LENGTH ENCODED BIT STRINGS
67
Huﬀman Code
RSTART
RBITS
Run Lengths
b0
1
0
1
b10
2
1
2 . . . 3
b110
4
1
4 . . . 5
b1110
6
2
6 . . . 9
b11110
10
3
10 . . . 17
b111110
18
4
18 . . . 33
b111111
34
12
34 . . . 4129
Table 7.7: Huﬀman Codes for Long Run Lengths
11. If LEN equals NBITS, return the completely decoded string BITS.
12. If RLEN equals 4129, read a 1-bit unsigned integer as BIT.
13. Otherwise, assign BIT the value (1 −BIT).
14. Continue decoding runs from step 5.
VP3 Compatibility
VP3 does not read a new bit value after decoding a run length of 4129. This
limits the maximum number of consecutive 0’s or 1’s to 4129 in VP3-compatible
streams. For reasonable video sizes of 1920 × 1080 or less in 4:2:0 format—the
only pixel format VP3 supports—this does not pose any problems because runs
longer than 4129 are not needed.
7.2.2
Short-Run Bit String Decode
Input parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
NBITS
Integer
36
No
The number of bits to decode.
Output parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
BITS
Bit string
The decoded bits.
Variables used:
Name
Type
Size
(bits)
Signed?
Description and restrictions
LEN
I t
36
N
Th
b
f bit d
d d
f

---

## Page 84

68
CHAPTER 7. FRAME DECODE
Name
Type
Size
(bits)
Signed?
Description and restrictions
RLEN
Integer
13
No
The length of the current run.
RBITS
Integer
4
No
The number of extra bits needed to
decode the run length.
RSTART
Integer
6
No
The start of the possible run-length
values for a given Huﬀman code.
ROFFS
Integer
12
No
The oﬀset from RSTART of the run-
length.
This procedure is similar to the procedure outlined in Section 7.2.1, except
that the maximum number of consecutive 0’s or 1’s is limited to 30. This is the
maximum run length needed when encoding a bit for each of the 16 blocks in a
super block when it is known that not all the bits in a super block are the same.
The complete decoding procedure is as follows:

1. Assign LEN the value 0.
2. Assign BITS the empty string.
3. If LEN equals NBITS, return the completely decoded string BITS.
4. Read a 1-bit unsigned integer as BIT.
5. Read a bit at a time until one of the Huﬀman codes given in Table 7.11
is recognized.
Huﬀman Code
RSTART
RBITS
Run Lengths
b0
1
1
1 . . . 2
b10
3
1
3 . . . 4
b110
5
1
5 . . . 6
b1110
7
2
7 . . . 10
b11110
11
2
11 . . . 14
b11111
15
4
15 . . . 30
Table 7.11: Huﬀman Codes for Short Run Lengths
6. Assign RSTART and RBITS the values given in Table 7.11 according to
the Huﬀman code read.
7. Read an RBITS-bit unsigned integer as ROFFS.
8. Assign RLEN the value (RSTART + ROFFS).
9. Append RLEN copies of BIT to BITS.

---

## Page 85

7.3. CODED BLOCK FLAGS DECODE
69
10. Add RLEN to the value LEN.
LEN MUST be less than or equal to
NBITS.
11. If LEN equals NBITS, return the completely decoded string BITS.
12. Assign BIT the value (1 −BIT).
13. Continue decoding runs from step 5.
7.3
Coded Block Flags Decode
Input parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
FTYPE
Integer
1
No
The frame type.
NSBS
Integer
32
No
The total number of super blocks in a
frame.
NBS
Integer
36
No
The total number of blocks in a frame.
Output parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
BCODED
Integer
Array
1
No
An NBS-element array of ﬂags
indicating
which
blocks
are
coded.
Variables used:
Name
Type
Size
(bits)
Signed?
Description and restrictions
NBITS
Integer
36
No
The length of a bit string to de-
code.
BITS
Bit string
A decoded set of ﬂags.

---

## Page 86

70
CHAPTER 7. FRAME DECODE
Name
Type
Size
(bits)
Signed?
Description and restrictions
SBPCODED
Integer
Array
1
No
An NSBS-element array of
ﬂags indicating whether or not
each super block is partially
coded.
SBFCODED
Integer
Array
1
No
An NSBS-element array of
ﬂags indicating whether or not
each non-partially coded super
block is fully coded.
sbi
Integer
32
No
The index of the current super
block.
bi
Integer
36
No
The index of the current block
in coded order.
This procedure determines which blocks are coded in a given frame. In an
intra frame, it marks all blocks coded. In an inter frame, however, any or all of
the blocks may remain uncoded. The output is a list of bit ﬂags, one for each
block, marking it coded or not coded.
It is important to note that ﬂags are still decoded for any blocks which lie
entirely outside the picture region, even though they are not displayed. Encoders
MAY choose to code such blocks. Decoders MUST faithfully reconstruct such
blocks, because their contents can be used for predictors in future frames. Flags
are not decoded for portions of a super block which lie outside the full frame,
as there are no blocks in those regions.
The complete procedure is as follows:

1. If FTYPE is zero (intra frame):
(a) For each consecutive value of bi from 0 to (NBS−1), assign BCODED[bi]
the value one.
2. Otherwise (inter frame):
(a) Assign NBITS the value NSBS.
(b) Read an NBITS-bit bit string into BITS, using the procedure de-
scribed in Section 7.2.1. This represents the list of partially coded
super blocks.
(c) For each consecutive value of sbi from 0 to (NSBS −1), remove the
bit at the head of the string BITS and assign it to SBPCODED[sbi].
(d) Assign NBITS the total number of super blocks such that
SBPCODED[sbi] equals zero.
(e) Read an NBITS-bit bit string into BITS, using the procedure de-
scribed in Section 7.2.1. This represents the list of fully coded super
blocks.

---

## Page 87

7.4. MACRO BLOCK CODING MODES
71
(f) For each consecutive value of sbi from 0 to (NSBS −1) such that
SBPCODED[sbi] equals zero, remove the bit at the head of the string
BITS and assign it to SBFCODED[sbi].
(g) Assign NBITS the number of blocks contained in super blocks where
SBPCODED[sbi] equals one. Note that this might not be equal to 16
times the number of partially coded super blocks, since super blocks
which overlap the edge of the frame will have fewer than 16 blocks
in them.
(h) Read an NBITS-bit bit string into BITS, using the procedure de-
scribed in Section 7.2.2.
(i) For each block in coded order—indexed by bi:
i. Assign sbi the index of the super block containing block bi.
ii. If SBPCODED[sbi] is zero, assign BCODED[bi] the value SBFCODED[sbi].
iii. Otherwise, remove the bit at the head of the string BITS and
assign it to BCODED[bi].
7.4
Macro Block Coding Modes
Input parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
FTYPE
Integer
1
No
The frame type.
NMBS
Integer
32
No
The
total
number
of
macro
blocks in a frame.
NBS
Integer
36
No
The total number of blocks in a
frame.
BCODED
Integer
Array
1
No
An NBS-element array of ﬂags
indicating
which
blocks
are
coded.
Output parameters:

---

## Page 88

72
CHAPTER 7. FRAME DECODE
Name
Type
Size
(bits)
Signed?
Description and restrictions
Name
Type
Size
(bits)
Signed?
Description and restrictions
MBMODES
Integer
Array
3
No
An NMBS-element array of
coding modes for each macro
block.
Variables used:
Name
Type
Size
(bits)
Signed?
Description and restrictions
MSCHEME
Integer
3
No
The mode coding scheme.
MALPHABET
Integer
array
3
No
The list of modes correspond-
ing to each Huﬀman code.
mbi
Integer
32
No
The
index
of
the
current
macro block.
bi
Integer
36
No
The
index
of
the
current
block in coded order.
mi
Integer
3
No
The
index
of
a
Huﬀman
code from Table 7.19, start-
ing from 0.
In an intra frame, every macro block marked as coded in INTRA mode. In
an inter frame, however, a macro block can be coded in one of eight coding
modes, given in Table 7.18. All of the blocks in all color planes contained in a
macro block will be assigned the coding mode of that macro block.
An important thing to note is that a coding mode is only stored in the
bitstream for a macro block if it has at least one luma block coded. A macro
block that contains coded blocks in the chroma planes, but not in the luma
plane, MUST be coded in INTER NOMV mode. Thus, no coding mode needs
to be decoded for such a macro block.
Coding modes are encoded using one of eight diﬀerent schemes. Schemes 0
through 6 use the same simple Huﬀman code to represent the mode numbers, as
given in Table 7.19. The diﬀerence in the schemes is the mode number assigned
to each code. Scheme 0 uses an assignment speciﬁed in the bitstream, while
schemes 1–6 use a ﬁxed assignment, also given in Table 7.19. Scheme 7 simply
codes each mode directly in the bitstream using three bits.

1. If FTYPE is 0 (intra frame):

---

## Page 89

7.4. MACRO BLOCK CODING MODES
73
Index
Coding Mode
0
INTER NOMV
1
INTRA
2
INTER MV
3
INTER MV LAST
4
INTER MV LAST2
5
INTER GOLDEN NOMV
6
INTER GOLDEN MV
7
INTER MV FOUR
Table 7.18: Macro Block Coding Modes
Scheme
1
2
3
4
5
6
7
Huﬀman Code
Coding Mode
mi
b0
3
3
3
3
0
0
0
b10
4
4
2
2
3
5
1
b110
2
0
4
0
4
3
2
b1110
0
2
0
4
2
4
3
b11110
1
1
1
1
1
2
4
b111110
5
5
5
5
5
1
5
b1111110
6
6
6
6
6
6
6
b1111111
7
7
7
7
7
7
7
Table 7.19: Macro Block Mode Schemes

---

## Page 90

74
CHAPTER 7. FRAME DECODE
(a) For each consecutive value of mbi from 0 to (NMBS −1), inclusive,
assign MBMODES[mbi] the value 1 (INTRA).
2. Otherwise (inter frame):
(a) Read a 3-bit unsigned integer as MSCHEME.
(b) If MSCHEME is 0:
i. For each consecutive value of MODE from 0 to 7, inclusive:
A. Read a 3-bit unsigned integer as mi.
B. Assign MALPHABET[mi] the value MODE.
(c) Otherwise, if MSCHEME is not 7, assign the entries of MALPHABET
the values in the corresponding column of Table 7.19.
(d) For each consecutive macro block in coded order (cf. Section 2.4)—
indexed by mbi:
i. If a block bi in the luma plane of macro block mbi exists such
that BCODED[bi] is 1:
A. If MSCHEME is not 7, read one bit at a time until one of
the Huﬀman codes in Table 7.19 is recognized, and assign
MBMODES[mbi] the value MALPHABET[mi], where mi
is the index of the Huﬀman code decoded.
B. Otherwise, read a 3-bit unsigned integer as MBMODES[mbi].
ii. Otherwise, if no luma-plane blocks in the macro block are coded,
assign MBMODES[mbi] the value 0 (INTER NOMV).
7.5
Motion Vectors
In an intra frame, no motion vectors are used, and so motion vector decoding is
skipped. In an inter frame, however, many of the inter coding modes require a
motion vector in order to specify an oﬀset into the reference frame from which to
predict a block. These procedures assigns such a motion vector to every block.
7.5.1
Motion Vector Decode
Input parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
MVMODE
Integer
1
No
The
motion
vector
decoding
method.

---

## Page 91

7.5. MOTION VECTORS
75
Output parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
MVX
Integer
6
Yes
The X component of the motion vector.
MVY
Integer
6
Yes
The Y component of the motion vector.
Variables used:
Name
Type
Size
(bits)
Signed?
Description and restrictions
MVSIGN
Integer
1
No
The sign of the motion vector compo-
nent just decoded.
The individual components of a motion vector can be coded using one of two
methods. The ﬁrst uses a variable length Huﬀman code, given in Table 7.23.
The second encodes the magnitude of the component directly in 5 bits, and the
sign in one bit. Note that in this case there are two representations for the value
zero. For compatibility with VP3, a sign bit is read even if the magnitude read
is zero. One scheme is chosen and used for the entire frame.
Each component can take on integer values from −31 . . . 31, inclusive, at
half-pixel resolution, i.e. −15.5 . . . 15.5 pixels in the luma plane. For each sub-
sampled axis in the chroma planes, the corresponding motion vector component
is interpreted as being at quarter-pixel resolution, i.e. −7.75 . . . 7.75 pixels. The
precise details of how these vectors are used to compute predictors for each
block are described in Section 7.9.1.
A single motion vector is decoded is follows:

1. If MVMODE is 0:
(a) Read 1 bit at a time until one of the Huﬀman codes in Table 7.23 is
recognized, and assign the value to MVX.
(b) Read 1 bit at a time until one of the Huﬀman codes in Table 7.23 is
recognized, and assign the value to MVY.
2. Otherwise:
(a) Read a 5-bit unsigned integer as MVX.
(b) Read a 1-bit unsigned integer as MVSIGN.

---

## Page 92

76
CHAPTER 7. FRAME DECODE
(c) If MVSIGN is 1, assign MVX the value −MVX.
(d) Read a 5-bit unsigned integer as MVY.
(e) Read a 1-bit unsigned integer as MVSIGN.
(f) If MVSIGN is 1, assign MVY the value −MVY.
7.5.2
Macro Block Motion Vector Decode
Input parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
PF
Integer
2
No
The pixel format.
NMBS
Integer
32
No
The total number of macro
blocks in a frame.
MBMODES
Integer
Array
3
No
An NMBS-element array of
coding modes for each macro
block.
NBS
Integer
36
No
The total number of blocks in
a frame.
BCODED
Integer
Array
1
No
An
NBS-element
array
of
ﬂags indicating which blocks
are coded.
Output parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
MVECTS
Array
of
2D Integer
Vectors
6
Yes
An NBS-element array of mo-
tion vectors for each block.
Variables used:

---

## Page 93

7.5. MOTION VECTORS
77
Name
Type
Size
(bits)
Signed?
Description and restrictions
LAST1
2D Integer
Vector
6
Yes
The last motion vector.
LAST2
2D Integer
Vector
6
Yes
The second to last motion vector.
MVX
Integer
6
Yes
The X component of a motion vec-
tor.
MVY
Integer
6
Yes
The Y component of a motion vec-
tor.
mbi
Integer
32
No
The index of the current macro
block.
A
Integer
36
No
The index of the lower-left luma
block in the macro block.
B
Integer
36
No
The index of the lower-right luma
block in the macro block.
C
Integer
36
No
The index of the upper-left luma
block in the macro block.
D
Integer
36
No
The index of the upper-right luma
block in the macro block.
E
Integer
36
No
The index of a chroma block in
the macro block, depending on the
pixel format.
F
Integer
36
No
The index of a chroma block in
the macro block, depending on the
pixel format.
G
Integer
36
No
The index of a chroma block in
the macro block, depending on the
pixel format.
H
Integer
36
No
The index of a chroma block in
the macro block, depending on the
pixel format.
I
Integer
36
No
The index of a chroma block in
the macro block, depending on the
pixel format.
J
Integer
36
No
The index of a chroma block in
the macro block, depending on the
pixel format.
K
Integer
36
No
The index of a chroma block in
the macro block, depending on the
pixel format.
L
Integer
36
No
The index of a chroma block in
the macro block, depending on the
pixel format.

---

## Page 94

78
CHAPTER 7. FRAME DECODE
Motion vectors are stored for each macro block. In every mode except for
INTER MV FOUR, every block in all the color planes are assigned the same
motion vector. In INTER MV FOUR mode, all four blocks in the luma plane
are assigned their own motion vector, and motion vectors for blocks in the
chroma planes are computed from these, using averaging appropriate to the
pixel format.
For INTER MV and INTER GOLDEN MV modes, a single motion vector
is decoded and applied to each block. For INTER MV FOUR macro blocks, a
motion vector is decoded for each coded luma block, in raster order, not coded
order. Uncoded luma blocks receive the default (0, 0) vector for the purposes of
computing the chroma motion vectors.
None of the remaining macro block coding modes require decoding motion
vectors from the stream. INTRA mode does not use a motion-compensated
predictor, and thus does not require a motion vector. Both the INTER NOMV
and the INTER GOLDEN NOMV modes use the default vector (0, 0) for each
block. This also includes all macro blocks with no coded luma blocks, as they
are coded in INTER NOMV mode by deﬁnition.
The modes INTER MV LAST and INTER MV LAST2 use the motion vec-
tor from the last macro block (in coded order) and the second to last macro
block, respectively, that contained a motion vector pointing to the previous
frame. Thus no explicit motion vector needs to be decoded for these modes.
Macro blocks coded in INTRA mode or one of the GOLDEN modes are not con-
sidered in this process. For macro blocks coded in INTER MV FOUR mode,
this process uses the vector from the last coded luma block in the macro block,
again in raster order, not coded order. This is usually the upper-right block. If
an insuﬃcient number of macro blocks have been coded in one of the INTER
modes, then the (0, 0) vector is used instead.
The motion vectors are decoded from the stream as follows:

1. Assign LAST1 and LAST2 both the value (0, 0).
2. Read a 1-bit unsigned integer as MVMODE. Note that this value is read
even if no macro blocks require a motion vector to be decoded.
3. For each consecutive value of mbi from 0 to (NMBS −1):
(a) If MBMODES[mbi] is 7 (INTER MV FOUR):
i. Let A, B, C, and D be the indices in coded order bi of the luma
blocks in macro block mbi, arranged into raster order. Thus, A
is the index in coded order of the block in the lower left, B the
lower right, C the upper left, and D the upper right.
ii. If BCODED[A] is non-zero:
A. Decode a single motion vector into MVX and MVY using
the procedure described in Section 7.5.1.
B. Assign MVECTS[A] the value (MVX, MVY).
iii. Otherwise, assign MVECTS[A] the value (0, 0).

---

## Page 95

7.5. MOTION VECTORS
79
iv. If BCODED[B] is non-zero:
A. Decode a single motion vector into MVX and MVY using
the procedure described in Section 7.5.1.
B. Assign MVECTS[B] the value (MVX, MVY).
v. Otherwise assign MVECTS[B] the value (0, 0).
vi. If BCODED[C] is non-zero:
A. Decode a single motion vector into MVX and MVY using
the procedure described in Section 7.5.1.
B. Assign MVECTS[C] the value (MVX, MVY).
vii. Otherwise assign MVECTS[C] the value (0, 0).
viii. If BCODED[D] is non-zero:
A. Decode a single motion vector into MVX and MVY using
the procedure described in Section 7.5.1.
B. Assign MVECTS[D] the value (MVX, MVY).
ix. Otherwise, assign MVECTS[D] the value (0, 0).
x. If PF is 0 (4:2:0):
A. Let E and F be the index in coded order of the one block in
the macro block from the Cb and Cr planes, respectively.
B. Assign MVECTS[E] and MVECTS[F] the value
(round

MVECTS[A]x + MVECTS[B]x+
MVECTS[C]x + MVECTS[D]x
4

,
round

MVECTS[A]y + MVECTS[B]y+
MVECTS[C]y + MVECTS[D]y
4

)
xi. If PF is 2 (4:2:2):
A. Let E and F be the indices in coded order of the bottom and
top blocks in the macro block from the Cb plane, respectively,
and G and H be the indices in coded order of the bottom and
top blocks in the Cr plane, respectively.
B. Assign MVECTS[E] and MVECTS[G] the value
(round
MVECTS[A]x + MVECTS[B]x
2

,
round
MVECTS[A]y + MVECTS[B]y
2

)

---

## Page 96

80
CHAPTER 7. FRAME DECODE
C. Assign MVECTS[F] and MVECTS[H] the value
(round
MVECTS[C]x + MVECTS[D]x
2

,
round
MVECTS[C]y + MVECTS[D]y
2

)
xii. If PF is 3 (4:4:4):
A. Let E, F, G, and H be the indices bi in coded order of the Cb
plane blocks in macro block mbi, arranged into raster order,
and I, J, K, and L be the indices bi in coded order of the Cr
plane blocks in macro block mbi, arranged into raster order.
B. Assign MVECTS[E] and MVECTS[I] the value
MVECTS[A].
C. Assign MVECTS[F] and MVECTS[J] the value
MVECTS[B].
D. Assign MVECTS[G] and MVECTS[K] the value
MVECTS[C].
E. Assign MVECTS[H] and MVECTS[L] the value
MVECTS[D].
xiii. Assign LAST2 the value LAST1.
xiv. Assign LAST1 the value (MVX, MVY). This is the value of the
motion vector decoded from the last coded luma block in raster
order. There must always be at least one, since macro blocks
with no coded luma blocks must use mode 0: INTER NOMV.
(b) Otherwise, if MBMODES[mbi] is 6 (INTER GOLDEN MV), de-
code a single motion vector into MVX and MVY using the procedure
described in Section 7.5.1.
(c) Otherwise, if MBMODES[mbi] is 4 (INTER MV LAST2):
i. Assign (MVX, MVY) the value LAST2.
ii. Assign LAST2 the value LAST1.
iii. Assign LAST1 the value (MVX, MVY).
(d) Otherwise, if MBMODES[mbi] is 3 (INTER MV LAST), assign
(MVX, MVY) the value LAST1.
(e) Otherwise, if MBMODES[mbi] is 2 (INTER MV):
i. Decode a single motion vector into MVX and MVY using the
procedure described in Section 7.5.1.
ii. Assign LAST2 the value LAST1.
iii. Assign LAST1 the value (MVX, MVY).
(f) Otherwise (MBMODES[mbi] is 5: INTER GOLDEN NOMV, 1: IN-
TRA, or 0: INTER NOMV), assign MVX and MVY the value zero.
(g) If MBMODES[mbi] is not 7 (not INTER MV FOUR), then for each
coded block bi in macro block mbi:
i. Assign MVECTS[bi] the value (MVX, MVY).

---

## Page 97

7.6. BLOCK-LEVEL QI DECODE
81
VP3 Compatibility
Unless all four luma blocks in the macro block are coded, the VP3 encoder does
not select mode INTER MV FOUR. Theora removes this restriction by treating
the motion vector for an uncoded luma block as the default (0, 0) vector. This
is consistent with the premise that the block has not changed since the previous
frame and that chroma information can be largely ignored when estimating
motion.
No modiﬁcation is required for INTER MV FOUR macro blocks in VP3
streams to be decoded correctly by a Theora decoder. However, regardless of
how many of the luma blocks are actually coded, the VP3 decoder always reads
four motion vectors from the stream for INTER MV FOUR mode. The motion
vectors read are used to calculate the motion vectors for the chroma blocks, but
are otherwise ignored. Thus, care should be taken when creating Theora streams
meant to be backwards compatible with VP3 to only use INTER MV FOUR
mode when all four luma blocks are coded.
7.6
Block-Level qi Decode
Input parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
NBS
Integer
36
No
The total number of blocks in a
frame.
BCODED
Integer
Array
1
No
An NBS-element array of ﬂags
indicating
which
blocks
are
coded.
NQIS
Integer
2
No
The number of qi values.
Output parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
QIIS
Integer
Array
2
No
An NBS-element array of qii values
for each block.

---

## Page 98

82
CHAPTER 7. FRAME DECODE
Variables used:
Name
Type
Size
(bits)
Signed?
Description and restrictions
NBITS
Integer
36
No
The length of a bit string to decode.
BITS
Bit string
A decoded set of ﬂags.
bi
Integer
36
No
The index of the current block in
coded order.
qii
Integer
2
No
The index of qi value in the list of qi
values deﬁned for this frame.
This procedure selects the qi value to be used for dequantizing the AC
coeﬃcients of each block. DC coeﬃcients all use the same qi value, so as to avoid
interference with the DC prediction mechanism, which occurs in the quantized
domain.
The value is actually represented by an index qii into the list of qi values
deﬁned for the frame. The decoder makes multiple passes through the list of
coded blocks, one for each qi value except the last one. In each pass, an RLE-
coded bitmask is decoded to divide the blocks into two groups: those that use
the current qi value in the list, and those that use a value from later in the list.
Each subsequent pass is restricted to the blocks in the second group.

1. For each value of bi from 0 to (NBS −1), assign QIIS[bi] the value zero.
2. For each consecutive value of qii from 0 to (NQIS −2):
(a) Assign NBITS be the number of blocks bi such that BCODED[bi]
is non-zero and QIIS[bi] equals qii.
(b) Read an NBITS-bit bit string into BITS, using the procedure de-
scribed in Section 7.2.1. This represents the list of blocks that use qi
value qii or higher.
(c) For each consecutive value of bi from 0 to (NBS −1) such that
BCODED[bi] is non-zero and QIIS[bi] equals qii:
i. Remove the bit at the head of the string BITS and add its value
to QIIS[bi].
VP3 Compatibility
For VP3 compatible streams, only one qi value can be speciﬁed in the frame
header, so the main loop of the above procedure, which would iterate from 0 to
−1, is never executed. Thus, no bits are read, and each block uses the one qi
value deﬁned for the frame.

---

## Page 99

7.6. BLOCK-LEVEL QI DECODE
83
Huﬀman Code
Value
Huﬀman Code
Value
b000
0
b001
1
b010
−1
b0110
2
b0111
−2
b1000
3
b1001
−3
b101000
4
b101001
−4
b101010
5
b101011
−5
b101100
6
b101101
−6
b101110
7
b101111
−7
b1100000
8
b1100001
−8
b1100010
9
b1100011
−9
b1100100
10
b1100101
−10
b1100110
11
b1100111
−11
b1101000
12
b1101001
−12
b1101010
13
b1101011
−13
b1101100
14
b1101101
−14
b1101110
15
b1101111
−15
b11100000
16
b11100001
−16
b11100010
17
b11100011
−17
b11100100
18
b11100101
−18
b11100110
19
b11100111
−19
b11101000
20
b11101001
−20
b11101010
21
b11101011
−21
b11101100
22
b11101101
−22
b11101110
23
b11101111
−23
b11110000
24
b11110001
−24
b11110010
25
b11110011
−25
b11110100
26
b11110101
−26
b11110110
27
b11110111
−27
b11111000
28
b11111001
−28
b11111010
29
b11111011
−29
b11111100
30
b11111101
−30
b11111110
31
b11111111
−31
Table 7.23: Huﬀman Codes for Motion Vector Components

---

## Page 100

84
CHAPTER 7. FRAME DECODE

---

## Page 101

7.7. DCT COEFFICIENTS
85
7.7
DCT Coeﬃcients
The quantized DCT coeﬃcients are decoded by making 64 passes through the
list of coded blocks, one for each token index in zig-zag order.
For the DC
tokens, two Huﬀman tables are chosen from among the ﬁrst 16, one for the luma
plane and one for the chroma planes. The AC tokens, however, are divided into
four diﬀerent groups. Again, two 4-bit indices are decoded, one for the luma
plane, and one for the chroma planes, but these select the codebooks for all four
groups. AC coeﬃcients in group one use codebooks 16 . . . 31, while group two
uses 32 . . . 47, etc. Note that this second set of indices is decoded even if there
are no non-zero AC coeﬃcients in the frame.
Tokens are divided into two major types: EOB tokens, which ﬁll the re-
mainder of one or more blocks with zeros, and coeﬃcient tokens, which ﬁll in
one or more coeﬃcients within a single block. A decoding procedure for the
ﬁrst is given in Section 7.7.1, and for the second in Section 7.7.2. The decoding
procedure for the complete set of quantized coeﬃcients is given in Section 7.7.3.
7.7.1
EOB Token Decode
Input parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
TOKEN
Integer
5
No
The
token
being
decoded.
This must be in the range
0 . . . 6.
NBS
Integer
36
No
The total number of blocks in
a frame.
TIS
Integer
Array
7
No
An NBS-element array of the
current token index for each
block.
NCOEFFS
Integer
Array
7
No
An
NBS-element
array
of
the coeﬃcient count for each
block.
COEFFS
2D Integer
Array
16
Yes
An NBS × 64 array of quan-
tized DCT coeﬃcient values
for each block in zig-zag or-
der.
bi
Integer
36
No
The index of the current block
in coded order.
ti
Integer
6
No
The current token index.

---

## Page 102

86
CHAPTER 7. FRAME DECODE
Output parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
TIS
Integer
Array
7
No
An NBS-element array of the
current token index for each
block.
COEFFS
2D Integer
Array
16
Yes
An NBS×64 array of quantized
DCT coeﬃcient values for each
block in zig-zag order.
EOBS
Integer
36
No
The remaining length of the
current EOB run.
Variables used:
Name
Type
Size
(bits)
Signed?
Description and restrictions
bj
Integer
36
No
Another index of a block in coded order.
tj
Integer
6
No
Another token index.
A summary of the EOB tokens is given in Table 7.33. An important thing
to note is that token 6 does not add an oﬀset to the decoded run value, even
though in general it should only be used for runs of size 32 or longer.
If a
value of zero is decoded for this run, it is treated as an EOB run the size of the
remaining coded blocks.
Token Value
Extra Bits
EOB Run Lengths
0
0
1
1
0
2
2
0
3
3
2
4 . . . 7
4
3
8 . . . 15
5
4
16 . . . 31
6
12
1 . . . 4095, or all remaining blocks
Table 7.33: EOB Token Summary
There is no restriction that one EOB token cannot be immediately followed

---

## Page 103

7.7. DCT COEFFICIENTS
87
by another, so no special cases are necessary to extend the range of the maximum
run length as were required in Section 7.2.1. Indeed, depending on the lengths
of the Huﬀman codes, it may even cheaper to encode, by way of example, an
EOB run of length 31 followed by an EOB run of length 1 than to encode an
EOB run of length 32 directly. There is also no restriction that an EOB run
stop at the end of a color plane or a token index. The run MUST, however, end
at or before the end of the frame.

1. If TOKEN is 0, assign EOBS the value 1.
2. Otherwise, if TOKEN is 1, assign EOBS the value 2.
3. Otherwise, if TOKEN is 2, assign EOBS the value 3.
4. Otherwise, if TOKEN is 3:
(a) Read a 2-bit unsigned integer as EOBS.
(b) Assign EOBS the value (EOBS + 4).
5. Otherwise, if TOKEN is 4:
(a) Read a 3-bit unsigned integer as EOBS.
(b) Assign EOBS the value (EOBS + 8).
6. Otherwise, if TOKEN is 5:
(a) Read a 4-bit unsigned integer as EOBS.
(b) Assign EOBS the value (EOBS + 16).
7. Otherwise, TOKEN is 6:
(a) Read a 12-bit unsigned integer as EOBS.
(b) If EOBS is zero, assign EOBS to be the number of coded blocks bj
such that TIS[bj] is less than 64.
8. For each value of tj from ti to 63, assign COEFFS[bi][tj] the value zero.
9. Assign NCOEFFS[bi] the value TIS[bi].
10. Assign TIS[bi] the value 64.
11. Assign EOBS the value (EOBS −1).
VP3 Compatibility
The VP3 encoder does not use the special interpretation of a zero-length EOB
run, though its decoder does support it. That may be due more to a happy ac-
cident in the way the decoder was written than intentional design, however, and
other VP3 implementations might not reproduce it faithfully. For backwards
compatibility, it may be wise to avoid it, especially as for most frame sizes there
are fewer than 4095 blocks, making it unnecessary.

---

## Page 104

88
CHAPTER 7. FRAME DECODE
7.7.2
Coeﬃcient Token Decode
Input parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
TOKEN
Integer
5
No
The token being decoded. This
must be in the range 7 . . . 31.
NBS
Integer
36
No
The total number of blocks in a
frame.
TIS
Integer
Array
7
No
An NBS-element array of the
current token index for each
block.
COEFFS
2D Integer
Array
16
Yes
An NBS×64 array of quantized
DCT coeﬃcient values for each
block in zig-zag order.
bi
Integer
36
No
The index of the current block
in coded order.
ti
Integer
6
No
The current token index.
Output parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
TIS
Integer
Array
7
No
An NBS-element array of the
current token index for each
block.
NCOEFFS
Integer
Array
7
No
An
NBS-element
array
of
the coeﬃcient count for each
block.
COEFFS
2D Integer
Array
16
Yes
An NBS × 64 array of quan-
tized DCT coeﬃcient values
for each block in zig-zag or-
der.
Variables used:

---

## Page 105

7.7. DCT COEFFICIENTS
89
Name
Type
Size
(bits)
Signed?
Description and restrictions
SIGN
Integer
1
No
A ﬂag indicating the sign of the current
coeﬃcient.
MAG
Integer
10
No
The magnitude of the current coeﬃ-
cient.
RLEN
Integer
6
No
The length of the current zero run.
tj
Integer
6
No
Another token index.
Each of these tokens decodes one or more coeﬃcients in the current block. A
summary of the meanings of the token values is presented in Table 7.38. There
are often several diﬀerent ways to tokenize a given coeﬃcient list. Which one is
optimal depends on the exact lengths of the Huﬀman codes used to represent
each token. Note that we do not update the coeﬃcient count for the block if we
decode a pure zero run.
For tokens which represent more than one coeﬃcient, they MUST NOT bring
the total number of coeﬃcients in the block to more than 64. Care should be
taken in a decoder to check for this, as otherwise it may permit buﬀer overﬂows
from invalidly formed packets.
Note: One way to achieve this eﬃciently is to combine the inverse
zig-zag mapping (described later in Section 7.9.2) with coeﬃcient
decode, and use a table look-up to map zig-zag indices greater
than 63 to a safe location.

1. If TOKEN is 7:
(a) Read in a 3-bit unsigned integer as RLEN.
(b) Assign RLEN the value (RLEN + 1).
(c) For each value of tj from ti to (ti+RLEN−1), assign COEFFS[bi][tj]
the value zero.
(d) Assign TIS[bi] the value TIS[bi] + RLEN.
2. Otherwise, if TOKEN is 8:
(a) Read in a 6-bit unsigned integer as RLEN.
(b) Assign RLEN the value (RLEN + 1).
(c) For each value of tj from ti to (ti+RLEN−1), assign COEFFS[bi][tj]
the value zero.
(d) Assign TIS[bi] the value TIS[bi] + RLEN.
3. Otherwise, if TOKEN is 9:
(a) Assign COEFFS[bi][ti] the value 1.

---

## Page 106

90
CHAPTER 7. FRAME DECODE
Token Value
Extra Bits
Number
of
Coeﬃcients
Description
7
3
1 . . . 8
Short zero run.
8
6
1 . . . 64
Zero run.
9
0
1
1.
10
0
1
−1.
11
0
1
2.
12
0
1
−2.
13
1
1
±3.
14
1
1
±4.
15
1
1
±5.
16
1
1
±6.
17
2
1
±7 . . . 8.
18
3
1
±9 . . . 12.
19
4
1
±13 . . . 20.
20
5
1
±21 . . . 36.
21
6
1
±37 . . . 68.
22
10
1
±69 . . . 580.
23
1
2
One zero followed by ±1.
24
1
3
Two zeros followed by ±1.
25
1
4
Three zeros followed by ±1.
26
1
5
Four zeros followed by ±1.
27
1
6
Five zeros followed by ±1.
28
3
7 . . . 10
6 . . . 9 zeros followed by ±1.
29
4
11 . . . 18
10 . . . 17 zeros followed by ±1.
30
2
2
One zero followed by ±2 . . . 3.
31
3
3 . . . 4
2 . . . 3 zeros followed by ±2 . . . 3.
Table 7.38: Coeﬃcient Token Summary

---

## Page 107

7.7. DCT COEFFICIENTS
91
(b) Assign TIS[bi] the value TIS[bi] + 1.
(c) Assign NCOEFFS[bi] the value TIS[bi].
4. Otherwise, if TOKEN is 10:
(a) Assign COEFFS[bi][ti] the value −1.
(b) Assign TIS[bi] the value TIS[bi] + 1.
(c) Assign NCOEFFS[bi] the value TIS[bi].
5. Otherwise, if TOKEN is 11:
(a) Assign COEFFS[bi][ti] the value 2.
(b) Assign TIS[bi] the value TIS[bi] + 1.
(c) Assign NCOEFFS[bi] the value TIS[bi].
6. Otherwise, if TOKEN is 12:
(a) Assign COEFFS[bi][ti] the value −2.
(b) Assign TIS[bi] the value TIS[bi] + 1.
(c) Assign NCOEFFS[bi] the value TIS[bi].
7. Otherwise, if TOKEN is 13:
(a) Read a 1-bit unsigned integer as SIGN.
(b) If SIGN is zero, assign COEFFS[bi][ti] the value 3.
(c) Otherwise, assign COEFFS[bi][ti] the value −3.
(d) Assign TIS[bi] the value TIS[bi] + 1.
(e) Assign NCOEFFS[bi] the value TIS[bi].
8. Otherwise, if TOKEN is 14:
(a) Read a 1-bit unsigned integer as SIGN.
(b) If SIGN is zero, assign COEFFS[bi][ti] the value 4.
(c) Otherwise, assign COEFFS[bi][ti] the value −4.
(d) Assign TIS[bi] the value TIS[bi] + 1.
(e) Assign NCOEFFS[bi] the value TIS[bi].
9. Otherwise, if TOKEN is 15:
(a) Read a 1-bit unsigned integer as SIGN.
(b) If SIGN is zero, assign COEFFS[bi][ti] the value 5.
(c) Otherwise, assign COEFFS[bi][ti] the value −5.
(d) Assign TIS[bi] the value TIS[bi] + 1.
(e) Assign NCOEFFS[bi] the value TIS[bi].

---

## Page 108

92
CHAPTER 7. FRAME DECODE
10. Otherwise, if TOKEN is 16:
(a) Read a 1-bit unsigned integer as SIGN.
(b) If SIGN is zero, assign COEFFS[bi][ti] the value 6.
(c) Otherwise, assign COEFFS[bi][ti] the value −6.
(d) Assign TIS[bi] the value TIS[bi] + 1.
(e) Assign NCOEFFS[bi] the value TIS[bi].
11. Otherwise, if TOKEN is 17:
(a) Read a 1-bit unsigned integer as SIGN.
(b) Read a 1-bit unsigned integer as MAG.
(c) Assign MAG the value (MAG + 7).
(d) If SIGN is zero, assign COEFFS[bi][ti] the value MAG.
(e) Otherwise, assign COEFFS[bi][ti] the value −MAG.
(f) Assign TIS[bi] the value TIS[bi] + 1.
(g) Assign NCOEFFS[bi] the value TIS[bi].
12. Otherwise, if TOKEN is 18:
(a) Read a 1-bit unsigned integer as SIGN.
(b) Read a 2-bit unsigned integer as MAG.
(c) Assign MAG the value (MAG + 9).
(d) If SIGN is zero, assign COEFFS[bi][ti] the value MAG.
(e) Otherwise, assign COEFFS[bi][ti] the value −MAG.
(f) Assign TIS[bi] the value TIS[bi] + 1.
(g) Assign NCOEFFS[bi] the value TIS[bi].
13. Otherwise, if TOKEN is 19:
(a) Read a 1-bit unsigned integer as SIGN.
(b) Read a 3-bit unsigned integer as MAG.
(c) Assign MAG the value (MAG + 13).
(d) If SIGN is zero, assign COEFFS[bi][ti] the value MAG.
(e) Otherwise, assign COEFFS[bi][ti] the value −MAG.
(f) Assign TIS[bi] the value TIS[bi] + 1.
(g) Assign NCOEFFS[bi] the value TIS[bi].
14. Otherwise, if TOKEN is 20:
(a) Read a 1-bit unsigned integer as SIGN.
(b) Read a 4-bit unsigned integer as MAG.

---

## Page 109

7.7. DCT COEFFICIENTS
93
(c) Assign MAG the value (MAG + 21).
(d) If SIGN is zero, assign COEFFS[bi][ti] the value MAG.
(e) Otherwise, assign COEFFS[bi][ti] the value −MAG.
(f) Assign TIS[bi] the value TIS[bi] + 1.
(g) Assign NCOEFFS[bi] the value TIS[bi].
15. Otherwise, if TOKEN is 21:
(a) Read a 1-bit unsigned integer as SIGN.
(b) Read a 5-bit unsigned integer as MAG.
(c) Assign MAG the value (MAG + 37).
(d) If SIGN is zero, assign COEFFS[bi][ti] the value MAG.
(e) Otherwise, assign COEFFS[bi][ti] the value −MAG.
(f) Assign TIS[bi] the value TIS[bi] + 1.
(g) Assign NCOEFFS[bi] the value TIS[bi].
16. Otherwise, if TOKEN is 22:
(a) Read a 1-bit unsigned integer as SIGN.
(b) Read a 9-bit unsigned integer as MAG.
(c) Assign MAG the value (MAG + 69).
(d) If SIGN is zero, assign COEFFS[bi][ti] the value MAG.
(e) Otherwise, assign COEFFS[bi][ti] the value −MAG.
(f) Assign TIS[bi] the value TIS[bi] + 1.
(g) Assign NCOEFFS[bi] the value TIS[bi].
17. Otherwise, if TOKEN is 23:
(a) Assign COEFFS[bi][ti] the value zero.
(b) Read a 1-bit unsigned integer as SIGN.
(c) If SIGN is zero, assign COEFFS[bi][ti + 1] the value 1.
(d) Otherwise, assign COEFFS[bi][ti + 1] the value −1.
(e) Assign TIS[bi] the value TIS[bi] + 2.
(f) Assign NCOEFFS[bi] the value TIS[bi].
18. Otherwise, if TOKEN is 24:
(a) For each value of tj from ti to (ti + 1), assign COEFFS[bi][tj] the
value zero.
(b) Read a 1-bit unsigned integer as SIGN.
(c) If SIGN is zero, assign COEFFS[bi][ti + 2] the value 1.

---

## Page 110

94
CHAPTER 7. FRAME DECODE
(d) Otherwise, assign COEFFS[bi][ti + 2] the value −1.
(e) Assign TIS[bi] the value TIS[bi] + 3.
(f) Assign NCOEFFS[bi] the value TIS[bi].
19. Otherwise, if TOKEN is 25:
(a) For each value of tj from ti to (ti + 2), assign COEFFS[bi][tj] the
value zero.
(b) Read a 1-bit unsigned integer as SIGN.
(c) If SIGN is zero, assign COEFFS[bi][ti + 3] the value 1.
(d) Otherwise, assign COEFFS[bi][ti + 3] the value −1.
(e) Assign TIS[bi] the value TIS[bi] + 4.
(f) Assign NCOEFFS[bi] the value TIS[bi].
20. Otherwise, if TOKEN is 26:
(a) For each value of tj from ti to (ti + 3), assign COEFFS[bi][tj] the
value zero.
(b) Read a 1-bit unsigned integer as SIGN.
(c) If SIGN is zero, assign COEFFS[bi][ti + 4] the value 1.
(d) Otherwise, assign COEFFS[bi][ti + 4] the value −1.
(e) Assign TIS[bi] the value TIS[bi] + 5.
(f) Assign NCOEFFS[bi] the value TIS[bi].
21. Otherwise, if TOKEN is 27:
(a) For each value of tj from ti to (ti + 4), assign COEFFS[bi][tj] the
value zero.
(b) Read a 1-bit unsigned integer as SIGN.
(c) If SIGN is zero, assign COEFFS[bi][ti + 5] the value 1.
(d) Otherwise, assign COEFFS[bi][ti + 5] the value −1.
(e) Assign TIS[bi] the value TIS[bi] + 6.
(f) Assign NCOEFFS[bi] the value TIS[bi].
22. Otherwise, if TOKEN is 28:
(a) Read a 1-bit unsigned integer as SIGN.
(b) Read a 2-bit unsigned integer as RLEN.
(c) Assign RLEN the value (RLEN + 6).
(d) For each value of tj from ti to (ti+RLEN−1), assign COEFFS[bi][tj]
the value zero.
(e) If SIGN is zero, assign COEFFS[bi][ti + RLEN] the value 1.

---

## Page 111

7.7. DCT COEFFICIENTS
95
(f) Otherwise, assign COEFFS[bi][ti + RLEN] the value −1.
(g) Assign TIS[bi] the value TIS[bi] + RLEN + 1.
(h) Assign NCOEFFS[bi] the value TIS[bi].
23. Otherwise, if TOKEN is 29:
(a) Read a 1-bit unsigned integer as SIGN.
(b) Read a 3-bit unsigned integer as RLEN.
(c) Assign RLEN the value (RLEN + 10).
(d) For each value of tj from ti to (ti+RLEN−1), assign COEFFS[bi][tj]
the value zero.
(e) If SIGN is zero, assign COEFFS[bi][ti + RLEN] the value 1.
(f) Otherwise, assign COEFFS[bi][ti + RLEN] the value −1.
(g) Assign TIS[bi] the value TIS[bi]+RLEN+1. Assign NCOEFFS[bi]
the value TIS[bi].
24. Otherwise, if TOKEN is 30:
(a) Assign COEFFS[bi][ti] the value zero.
(b) Read a 1-bit unsigned integer as SIGN.
(c) Read a 1-bit unsigned integer as MAG.
(d) Assign MAG the value (MAG + 2).
(e) If SIGN is zero, assign COEFFS[bi][ti + 1] the value MAG.
(f) Otherwise, assign COEFFS[bi][ti + 1] the value −MAG.
(g) Assign TIS[bi] the value TIS[bi] + 2. Assign NCOEFFS[bi] the
value TIS[bi].
25. Otherwise, if TOKEN is 31:
(a) Read a 1-bit unsigned integer as SIGN.
(b) Read a 1-bit unsigned integer as MAG.
(c) Assign MAG the value (MAG + 2).
(d) Read a 1-bit unsigned integer as RLEN.
(e) Assign RLEN the value (RLEN + 2).
(f) For each value of tj from ti to (ti+RLEN−1), assign COEFFS[bi][tj]
the value zero.
(g) If SIGN is zero, assign COEFFS[bi][ti + RLEN] the value MAG.
(h) Otherwise, assign COEFFS[bi][ti + RLEN] the value −MAG.
(i) Assign TIS[bi] the value TIS[bi]+RLEN+1. Assign NCOEFFS[bi]
the value TIS[bi].

---

## Page 112

96
CHAPTER 7. FRAME DECODE
7.7.3
DCT Coeﬃcient Decode
Input parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
NBS
Integer
36
No
The total number of blocks in a
frame.
BCODED
Integer
Array
1
No
An NBS-element array of ﬂags
indicating
which
blocks
are
coded.
NMBS
Integer
32
No
The
total
number
of
macro
blocks in a frame.
HTS
Huﬀman table array
An 80-element array of Huﬀman
tables with up to 32 entries each.
Output parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
COEFFS
2D Integer
Array
16
Yes
An NBS × 64 array of quan-
tized DCT coeﬃcient values
for each block in zig-zag or-
der.
NCOEFFS
Integer
Array
7
No
An
NBS-element
array
of
the coeﬃcient count for each
block.
Variables used:
Name
Type
Size
(bits)
Signed?
Description and restrictions
NLBS
Integer
34
No
The number of blocks in the luma
plane.
TIS
Integer
Array
7
No
An NBS-element array of the cur-
rent token index for each block.

---

## Page 113

7.7. DCT COEFFICIENTS
97
Name
Type
Size
(bits)
Signed?
Description and restrictions
EOBS
Integer
36
No
The remaining length of the current
EOB run.
TOKEN
Integer
5
No
The current token being decoded.
HG
Integer
3
No
The current Huﬀman table group.
cbi
Integer
36
No
The index of the current block in the
coded block list.
bi
Integer
36
No
The index of the current block in
coded order.
bj
Integer
36
No
Another index of a block in coded
order.
ti
Integer
6
No
The current token index.
tj
Integer
6
No
Another token index.
htiL
Integer
4
No
The index of the current Huﬀman
table to use for the luma plane
within a group.
htiC
Integer
4
No
The index of the current Huﬀman
table to use for the chroma planes
within a group.
hti
Integer
7
No
The index of the current Huﬀman
table to use.
This procedure puts the above two procedures to work to decode the entire
set of DCT coeﬃcients for the frame.
At the end of this procedure, EOBS
MUST be zero, and TIS[bi] MUST be 64 for every coded bi.
Note that we update the coeﬃcient count of every block before continuing
an EOB run or decoding a token, despite the fact that it is already up to date
unless the previous token was a pure zero run. This is done intentionally to
mimic the VP3 accounting rules. Thus the only time the coeﬃcient count does
not include the coeﬃcients in a pure zero run is when when that run reaches all
the way to coeﬃcient 63. Note, however, that regardless of the coeﬃcient count,
any additional coeﬃcients are still set to zero. The only use of the count is in
determining if a special case of the inverse DCT can be used in Section 7.9.3.2.

1. Assign NLBS the value (NMBS ∗4).
2. For each consecutive value of bi from 0 to (NBS −1), assign TIS[bi] the
value zero.
3. Assign EOBS the value 0.
4. For each consecutive value of ti from 0 to 63:
(a) If ti is 0 or 1:
i. Read a 4-bit unsigned integer as htiL.

---

## Page 114

98
CHAPTER 7. FRAME DECODE
ii. Read a 4-bit unsigned integer as htiC.
(b) For each consecutive value of bi from 0 to (NBS −1) for which
BCODED[bi] is non-zero and TIS[bi] equals ti:
i. Assign NCOEFFS[bi] the value ti.
ii. If EOBS is greater than zero:
A. For each value of tj from ti to 63, assign COEFFS[bi][tj]
the value zero.
B. Assign TIS[bi] the value 64.
C. Assign EOBS the value (EOBS −1).
iii. Otherwise:
A. Assign HG a value based on ti from Table 7.42.
ti
HG
0
0
1 . . . 5
1
6 . . . 14
2
15 . . . 27
3
28 . . . 63
4
Table 7.42: Huﬀman Table Groups
B. If bi is less than NLBS, assign hti the value (16∗HG+htiL).
C. Otherwise, assign hti the value (16 ∗HG + htiC).
D. Read one bit at a time until one of the codes in HTS[hti] is
recognized, and assign the value to TOKEN.
E. If TOKEN is less than 7, expand an EOB token using the pro-
cedure given in Section 7.7.1 to update TIS[bi], COEFFS[bi],
and EOBS.
F. Otherwise, expand a coeﬃcient token using the procedure
given in Section 7.7.2 to update TIS[bi], COEFFS[bi], and
NCOEFFS[bi].
7.8
Undoing DC Prediction
The actual value of a DC coeﬃcient decoded by Section 7.7 is the residual from
a predicted value computed by the encoder. This prediction is only applied to
DC coeﬃcients. Quantized AC coeﬃcients are encoded directly.
This section describes how to undo this prediction to recover the original
DC coeﬃcients. The predicted DC value for a block is computed from the DC
values of its immediate neighbors which precede the block in raster order. Thus,
reversing this prediction must procede in raster order, instead of coded order.
Note that this step comes before dequantizing the coeﬃcients.
For this
reason, DC coeﬃcients are all quantized with the same qi value, regardless of

---

## Page 115

7.8. UNDOING DC PREDICTION
99
the block-level qi values decoded in Section 7.6. Those qi values are applied
only to the AC coeﬃcients.
7.8.1
Computing the DC Predictor
Input parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
BCODED
Integer
Array
1
No
An NBS-element array of
ﬂags indicating which blocks
are coded.
MBMODES
Integer
Array
3
No
An NMBS-element array
of coding modes for each
macro block.
LASTDC
Integer
Array
16
Yes
A 3-element array contain-
ing the most recently de-
coded DC value, one for in-
ter mode and for each refer-
ence frame.
COEFFS
2D Integer
Array
16
Yes
An NBS×64 array of quan-
tized DCT coeﬃcient values
for each block in zig-zag or-
der.
bi
Integer
36
No
The index of the current
block in coded order.
Output parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
DCPRED
Integer
16
Yes
The predicted DC value for the cur-
rent block.
Variables used:

---

## Page 116

100
CHAPTER 7. FRAME DECODE
Name
Type
Size
(bits)
Signed?
Description and restrictions
P
Integer
Array
1
No
A 4-element array indicating which
neighbors can be used for DC predic-
tion.
PBI
Integer
Array
36
No
A 4-element array containing the
coded-order block index of the cur-
rent block’s neighbors.
W
Integer
Array
7
Yes
A 4-element array of the weights to
apply to each neighboring DC value.
PDIV
Integer
8
No
The valud to divide the weighted sum
by.
bj
Integer
36
No
The index of a neighboring block in
coded order.
mbi
Integer
32
No
The index of the macro block contain-
ing block bi.
mbi
Integer
32
No
The index of the macro block contain-
ing block bj.
rﬁ
Integer
2
No
The index of the reference frame indi-
cated by the coding mode for macro
block mbi.
This procedure outlines how a predictor is formed for a single block.
The predictor is computed as a weighted sum of the neighboring DC values
from coded blocks which use the same reference frame. This latter condition is
determined only by checking the coding mode for the block. Even if the golden
frame and the previous frame are in fact the same, e.g. for the ﬁrst inter frame
after an intra frame, they are still treated as being diﬀerent for the purposes of
DC prediction. The weighted sum is divided by a power of two, with truncation
towards zero, and the result is checked for outranging if necessary.
If there are no neighboring coded blocks which use the same reference frame
as the current block, then the most recent DC value of any block that used that
reference frame is used instead. If no such block exists, then the predictor is set
to zero.

1. Assign mbi the index of the macro block containing block bi.
2. Assign rﬁthe value of the Reference Frame Index column of Table 7.46
corresponding to MBMODES[mbi].
3. If block bi is not along the left edge of the coded frame:
(a) Assign bj the coded-order index of block bi’s left neighbor, i.e., in
the same row but one column to the left.
(b) If BCODED[bj] is not zero:

---

## Page 117

7.8. UNDOING DC PREDICTION
101
Coding Mode
Reference Frame Index
0 (INTER NOMV)
1 (Previous)
1 (INTRA)
0 (None)
2 (INTER MV)
1 (Previous)
3 (INTER MV LAST)
1 (Previous)
4 (INTER MV LAST2)
1 (Previous)
5 (INTER GOLDEN NOMV)
2 (Golden)
6 (INTER GOLDEN MV)
2 (Golden)
7 (INTER MV FOUR)
1 (Previous)
Table 7.46: Reference Frames for Each Coding Mode
i. Assign mbj the index of the macro block containing block bj.
ii. If the value of the Reference Frame Index column of Table 7.46
corresonding to MBMODES[mbj] equals rﬁ:
A. Assign P[0] the value 1.
B. Assign PBI[0] the value bj.
iii. Otherwise, assign P[0] the value zero.
(c) Otherwise, assign P[0] the value zero.
4. Otherwise, assign P[0] the value zero.
5. If block bi is not along the left edge nor the bottom edge of the coded
frame:
(a) Assign bj the coded-order index of block bi’s lower-left neighbor, i.e.,
one row down and one column to the left.
(b) If BCODED[bj] is not zero:
i. Assign mbj the index of the macro block containing block bj.
ii. If the value of the Reference Frame Index column of Table 7.46
corresonding to MBMODES[mbj] equals rﬁ:
A. Assign P[1] the value 1.
B. Assign PBI[1] the value bj.
iii. Otherwise, assign P[1] the value zero.
(c) Otherwise, assign P[1] the value zero.
6. Otherwise, assign P[1] the value zero.
7. If block bi is not along the the bottom edge of the coded frame:
(a) Assign bj the coded-order index of block bi’s lower neighbor, i.e., in
the same column but one row down.
(b) If BCODED[bj] is not zero:

---

## Page 118

102
CHAPTER 7. FRAME DECODE
i. Assign mbj the index of the macro block containing block bj.
ii. If the value of the Reference Frame Index column of Table 7.46
corresonding to MBMODES[mbj] equals rﬁ:
A. Assign P[2] the value 1.
B. Assign PBI[2] the value bj.
iii. Otherwise, assign P[2] the value zero.
(c) Otherwise, assign P[2] the value zero.
8. Otherwise, assign P[2] the value zero.
9. If block bi is not along the right edge nor the bottom edge of the coded
frame:
(a) Assign bj the coded-order index of block bi’s lower-right neighbor,
i.e., one row down and one column to the right.
(b) If BCODED[bj] is not zero:
i. Assign mbj the index of the macro block containing block bj.
ii. If the value of the Reference Frame Index column of Table 7.46
corresonding to MBMODES[mbj] equals rﬁ:
A. Assign P[3] the value 1.
B. Assign PBI[3] the value bj.
iii. Otherwise, assign P[3] the value zero.
(c) Otherwise, assign P[3] the value zero.
10. Otherwise, assign P[3] the value zero.
11. If none of the values P[0], P[1], P[2], nor P[3] are non-zero, then assign
DCPRED the value LASTDC[rﬁ].
12. Otherwise:
(a) Assign the array W and the variable PDIV the values from the row
of Table 7.47 corresonding to the values of each P[i].
(b) Assign DCPRED the value zero.
(c) If P[0] is non-zero, assign DCPRED the value (DCPRED+W[0]∗
COEFFS[PBI[0]][0]).
(d) If P[1] is non-zero, assign DCPRED the value (DCPRED+W[1]∗
COEFFS[PBI[1]][0]).
(e) If P[2] is non-zero, assign DCPRED the value (DCPRED+W[2]∗
COEFFS[PBI[2]][0]).
(f) If P[3] is non-zero, assign DCPRED the value (DCPRED+W[3]∗
COEFFS[PBI[3]][0]).
(g) Assign DCPRED the value (DCPRED//PDIV).

---

## Page 119

7.8. UNDOING DC PREDICTION
103
P[0]
(L)
P[1]
(DL)
P[2]
(D)
P[3]
(DR)
W[3]
(L)
W[1]
(DL)
W[2]
(D)
W[3]
(DR)
PDIV
1
0
0
0
1
0
0
0
1
0
1
0
0
0
1
0
0
1
1
1
0
0
1
0
0
0
1
0
0
1
0
0
0
1
0
1
1
0
1
0
1
0
1
0
2
0
1
1
0
0
0
1
0
1
1
1
1
0
29
−26
29
0
32
0
0
0
1
0
0
0
1
1
1
0
0
1
75
0
0
53
128
0
1
0
1
0
1
0
1
2
1
1
0
1
75
0
0
53
128
0
0
1
1
0
0
1
0
1
1
0
1
1
75
0
0
53
128
0
1
1
1
0
3
10
3
16
1
1
1
1
29
−26
29
0
32
Table 7.47: Weights and Divisors for Each Set of Available DC Predictors
(h) If P[0], P[1], and P[2] are all non-zero:
i. If |DCPRED−COEFFS[PBI[2]][0]| is greater than 128, assign
DCPRED the value COEFFS[PBI[2]][0].
ii. Otherwise, if |DCPRED−COEFFS[PBI[0]][0]| is greater than
128, assign DCPRED the value COEFFS[PBI[0]][0].
iii. Otherwise, if |DCPRED−COEFFS[PBI[1]][0]| is greater than
128, assign DCPRED the value COEFFS[PBI[1]][0].
7.8.2
Inverting the DC Prediction Process
Input parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
BCODED
Integer
Array
1
No
An NBS-element array of
ﬂags indicating which blocks
are coded.
MBMODES
Integer
Array
3
No
An NMBS-element array
of coding modes for each
macro block.

---

## Page 120

104
CHAPTER 7. FRAME DECODE
Name
Type
Size
(bits)
Signed?
Description and restrictions
COEFFS
2D Integer
Array
16
Yes
An NBS×64 array of quan-
tized DCT coeﬃcient values
for each block in zig-zag or-
der.
Output parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
COEFFS
2D Integer
Array
16
Yes
An NBS×64 array of quantized
DCT coeﬃcient values for each
block in zig-zag order. The DC
value of each block will be up-
dated.
Variables used:
Name
Type
Size
(bits)
Signed?
Description and restrictions
LASTDC
Integer
Array
16
Yes
A 3-element array containing the
most recently decoded DC value,
one for inter mode and for each ref-
erence frame.
DCPRED
Integer
11
Yes
The predicted DC value for the
current block.
DC
Integer
17
Yes
The actual DC value for the cur-
rent block.
bi
Integer
36
No
The index of the current block in
coded order.
mbi
Integer
32
No
The index of the macro block con-
taining block bi.
rﬁ
Integer
2
No
The index of the reference frame
indicated by the coding mode for
macro block mbi.
pli
Integer
2
No
A color plane index.

---

## Page 121

7.9. RECONSTRUCTION
105
This procedure describes the complete process of undoing the DC prediction
to recover the original DC values. Because it is possible to add a value as large
as 580 to the predicted DC coeﬃcient value at every block, which will then be
used to increase the predictor for the next block, the reconstructed DC value
could overﬂow a 16-bit integer. This is handled by truncating the result to a
16-bit signed representation, simply throwing away any higher bits in the two’s
complement representation of the number.

1. For each consecutive value of pli from 0 to 2:
(a) Assign LASTDC[0] the value zero.
(b) Assign LASTDC[1] the value zero.
(c) Assign LASTDC[2] the value zero.
(d) For each block of color plane pli in raster order, with coded-order
index bi:
i. If BCODED[bi] is non-zero:
A. Compute the value DCPRED using the procedure outlined
in Section 7.8.1.
B. Assign DC the value (COEFFS[bi][0] + DCPRED).
C. Truncate DC to a 16-bit representation by dropping any
higher-order bits.
D. Assign COEFFS[bi][0] the value DC.
E. Assign mbi the index of the macro block containing block bi.
F. Assign rﬁthe value of the Reference Frame Index column of
Table 7.46 corresponding to MBMODES[mbi].
G. Assign LASTDC[rﬁ] the value DC.
7.9
Reconstruction
At this stage, the complete contents of the data packet have been decoded. All
that remains is to reconstruct the contents of the new frame. This is applied
on a block by block basis, and as each block is independent, the order they are
processed in does not matter.
7.9.1
Predictors
For each block, a predictor is formed based on its coding mode and motion
vector. There are three basic types of predictors: the intra predictor, the whole-
pixel predictor, and the half-pixel predictor. The former is used for all blocks
coded in INTRA mode, while all other blocks use one of the latter two. The
whole-pixel predictor is used if the fractional part of both motion vector com-
ponents is zero, otherwise the half-pixel predictor is used.

---

## Page 122

106
CHAPTER 7. FRAME DECODE
7.9.1.1
The Intra Predictor
Input parameters:
None.
Output parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
PRED
2D Integer
Array
8
No
An 8 × 8 array of predictor values
to use for INTRA coded blocks.
Variables used:
Name
Type
Size
(bits)
Signed?
Description and restrictions
bx
Integer
3
No
The horizontal pixel index in the block.
by
Integer
3
No
The vertical pixel index in the block.
The intra predictor is nothing more than the constant value 128. This is
applied for the sole purpose of centering the range of possible DC values for
INTRA blocks around zero.

1. For each value of by from 0 to 7, inclusive:
(a) For each value of bx from 0 to 7, inclusive:
i. Assign PRED[by][bx] the value 128.
7.9.1.2
The Whole-Pixel Predictor
Input parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
RPW
Integer
20
No
The width of the current plane of
the reference frame in pixels.

---

## Page 123

7.9. RECONSTRUCTION
107
Name
Type
Size
(bits)
Signed?
Description and restrictions
RPH
Integer
20
No
The height of the current plane of
the reference frame in pixels.
REFP
2D Integer
Array
8
No
A RPH × RPW array containing
the contents of the current plane of
the reference frame.
BX
Integer
20
No
The horizontal pixel index of the
lower-left corner of the current
block.
BY
Integer
20
No
The vertical pixel index of the
lower-left corner of the current
block.
MVX
Integer
5
No
The horizontal component of the
block motion vector. This is always
a whole-pixel value.
MVY
Integer
5
No
The
vertical
component
of
the
block motion vector. This is always
a whole-pixel value.
Output parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
PRED
2D Integer
Array
8
No
An 8 × 8 array of predictor values
to use for INTER coded blocks.
Variables used:
Name
Type
Size
(bits)
Signed?
Description and restrictions
bx
Integer
3
Yes
The horizontal pixel index in the block.
by
Integer
3
Yes
The vertical pixel index in the block.
rx
Integer
20
No
The horizontal pixel index in the refer-
ence frame.
ry
Integer
20
No
The vertical pixel index in the reference
frame.

---

## Page 124

108
CHAPTER 7. FRAME DECODE
The whole pixel predictor simply copies verbatim the contents of the refer-
ence frame pointed to by the block’s motion vector. If the vector points outside
the reference frame, then the closest value on the edge of the reference frame
is used instead. In practice, this is usually implemented by expanding the size
of the reference frame by 8 or 16 pixels on each side—depending on whether or
not the corresponding axis is subsampled in the current plane—and copying the
border pixels into this region.

1. For each value of by from 0 to 7, inclusive:
(a) Assign ry the value (BY + MVY + by).
(b) If ry is greater than (RPH −1), assign ry the value (RPH −1).
(c) If ry is less than zero, assign ry the value zero.
(d) For each value of bx from 0 to 7, inclusive:
i. Assign rx the value (BX + MVX + bx).
ii. If rx is greater than (RPW−1), assign rx the value (RPW−1).
iii. If rx is less than zero, assign rx the value zero.
iv. Assign PRED[by][bx] the value REFP[ry][rx].
7.9.1.3
The Half-Pixel Predictor
Input parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
RPW
Integer
20
No
The width of the current plane of
the reference frame in pixels.
RPH
Integer
20
No
The height of the current plane of
the reference frame in pixels.
REFP
2D Integer
Array
8
No
A RPH×RPW array containing
the contents of the current plane
of the reference frame.
BX
Integer
20
No
The horizontal pixel index of the
lower-left corner of the current
block.
BY
Integer
20
No
The vertical pixel index of the
lower-left corner of the current
block.
MVX
Integer
5
No
The horizontal component of the
ﬁrst whole-pixel motion vector.
MVY
Integer
5
No
The vertical component of the ﬁrst
whole-pixel motion vector.

---

## Page 125

7.9. RECONSTRUCTION
109
Name
Type
Size
(bits)
Signed?
Description and restrictions
MVX2
Integer
5
No
The horizontal component of the
second whole-pixel motion vector.
MVY2
Integer
5
No
The vertical component of the sec-
ond whole-pixel motion vector.
Output parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
PRED
2D Integer
Array
8
No
An 8 × 8 array of predictor values
to use for INTER coded blocks.
Variables used:
Name
Type
Size
(bits)
Signed?
Description and restrictions
bx
Integer
3
Yes
The horizontal pixel index in the block.
by
Integer
3
Yes
The vertical pixel index in the block.
rx1
Integer
20
No
The ﬁrst horizontal pixel index in the
reference frame.
ry1
Integer
20
No
The ﬁrst vertical pixel index in the ref-
erence frame.
rx2
Integer
20
No
The second horizontal pixel index in the
reference frame.
ry2
Integer
20
No
The second vertical pixel index in the
reference frame.
If one or both of the components of the block motion vector is not a whole-
pixel value, then the half-pixel predictor is used. The half-pixel predictor con-
verts the fractional motion vector into two whole-pixel motion vectors. The
ﬁrst is formed by truncating the values of each component towards zero, and
the second is formed by truncating them away from zero. The contributions
from the reference frame at the locations pointed to by each vector are aver-
aged, truncating towards negative inﬁnity.
Only two samples from the reference frame contribute to each predictor

---

## Page 126

110
CHAPTER 7. FRAME DECODE
value, even if both components of the motion vector have non-zero fractional
components.
Motion vector components with quarter-pixel accuracy in the
chroma planes are treated exactly the same as those with half-pixel accuracy.
Any non-zero fractional part gets rounded one way in the ﬁrst vector, and the
other way in the second.

1. For each value of by from 0 to 7, inclusive:
(a) Assign ry1 the value (BY + MVY1 + by).
(b) If ry1 is greater than (RPH −1), assign ry1 the value (RPH −1).
(c) If ry1 is less than zero, assign ry1 the value zero.
(d) Assign ry2 the value (BY + MVY2 + by).
(e) If ry2 is greater than (RPH −1), assign ry2 the value (RPH −1).
(f) If ry2 is less than zero, assign ry2 the value zero.
(g) For each value of bx from 0 to 7, inclusive:
i. Assign rx1 the value (BX + MVX1 + bx).
ii. If rx1 is greater than (RPW−1), assign rx1 the value (RPW−
1).
iii. If rx1 is less than zero, assign rx1 the value zero.
iv. Assign rx2 the value (BX + MVX2 + bx).
v. If rx2 is greater than (RPW−1), assign rx2 the value (RPW−
1).
vi. If rx2 is less than zero, assign rx2 the value zero.
vii. Assign PRED[by][bx] the value
(REFP[ry1][rx1] + REFP[ry2][rx2]) >> 1.
7.9.2
Dequantization
Input parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
COEFFS
2D Integer
Array
16
Yes
An NBS × 64 array of quan-
tized DCT coeﬃcient values
for each block in zig-zag or-
der.
ACSCALE
Integer
array
16
No
A 64-element array of scale
values for AC coeﬃcients for
each qi value.

---

## Page 127

7.9. RECONSTRUCTION
111
Name
Type
Size
(bits)
Signed?
Description and restrictions
DCSCALE
Integer
array
16
No
A 64-element array of scale
values for the DC coeﬃcient
for each qi value.
BMS
2D Integer
array
8
No
A NBMS×64 array contain-
ing the base matrices.
NQRS
2D Integer
array
6
No
A 2 × 3 array containing the
number of quant ranges for a
given qti and pli, respectively.
This is at most 63.
QRSIZES
3D Integer
array
6
No
A 2 × 3 × 63 array of the
sizes of each quant range for a
given qti and pli, respectively.
Only the ﬁrst NQRS[qti][pli]
values are used.
QRBMIS
3D Integer
array
9
No
A 2 × 3 × 64 array of the
bmi’s used for each quant
range for a given qti and pli,
respectively.
Only the ﬁrst
(NQRS[qti][pli] + 1) values
are used.
qti
Integer
1
No
A quantization type index.
See Table 3.1.
pli
Integer
2
No
A color plane index. See Ta-
ble 2.1.
qi0
Integer
6
No
The quantization index of the
DC coeﬃcient.
qi
Integer
6
No
The quantization index of the
AC coeﬃcients.
bi
Integer
36
No
The index of the current block
in coded order.
Output parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
DQC
Integer
Array
14
Yes
A 64-element array of dequantized
DCT coeﬃcients in natural order (cf.
Section 2.6).

---

## Page 128

112
CHAPTER 7. FRAME DECODE
Variables used:
Name
Type
Size
(bits)
Signed?
Description and restrictions
QMAT
Integer
array
16
No
A 64-element array of quantization
values for each DCT coeﬃcient in
natural order.
ci
Integer
6
No
The DCT coeﬃcient index in natural
order.
zzi
Integer
6
No
The DCT coeﬃcient index in zig-zag
order.
C
Integer
29
Yes
A single dequantized coeﬃcient.
This procedure takes the quantized DCT coeﬃcient values in zig-zag order
for a single block—after DC prediction has been undone—and returns the de-
quantized values in natural order. If large coeﬃcient values are decoded for
coarsely quantized coeﬃcients, the resulting dequantized value can be signiﬁ-
cantly larger than 16 bits. Such a coeﬃcient is truncated to a signed 16-bit
representation by discarding the higher-order bits of its twos-complement rep-
resentation.
Although this procedure recomputes the quantization matrices from the pa-
rameters in the setup header for each block, there are at most six diﬀerent ones
used for each color plane. An eﬃcient implementation could compute them once
in advance.

1. Using ACSCALE, DCSCALE, BMS, NQRS, QRSIZES, QRBMIS,
qti, pli, and qi0, use the procedure given in Section 6.4.3 to compute the
DC quantization matrix QMAT.
2. Assign C the value COEFFS[bi][0] ∗QMAT[0].
3. Truncate C to a 16-bit representation by dropping any higher-order bits.
4. Assign DQC[0] the value C.
5. Using ACSCALE, DCSCALE, BMS, NQRS, QRSIZES, QRBMIS,
qti, pli, and qi, use the procedure given in Section 6.4.3 to compute the
AC quantization matrix QMAT.
6. For each value of ci from 1 to 63, inclusive:
(a) Assign zzi the index in zig-zag order corresponding to ci. E.g., the
value at row (ci//8) and column (ci%8) in Figure 2.8
(b) Assign C the value COEFFS[bi][zzi] ∗QMAT[ci].

---

## Page 129

7.9. RECONSTRUCTION
113
(c) Truncate C to a 16-bit representation by dropping any higher-order
bits.
(d) Assign DQC[ci] the value C.
7.9.3
The Inverse DCT
The 2D inverse DCT is separated into two applications of the 1D inverse DCT.
The transform is ﬁrst applied to each row, and then applied to each column of
the result.
Each application of the 1D inverse DCT scales the values by a factor of two
relative to the orthonormal version of the transform, for a total scale factor of
four for the 2D transform. It is assumed that a similar scale factor is applied
during the forward DCT used in the encoder, so that a division by 16 is required
after the transform has been applied in both directions. The inclusion of this
scale factor allows the integerized transform to operate with increased precision.
All divisions throughout the transform are implemented with right shifts. Only
the ﬁnal division by 16 is rounded, with ties rounded towards positive inﬁnity.
All intermediate values are truncated to a 32-bit signed representation by
discarding any higher-order bits in their two’s complement representation. The
ﬁnal output of each 1D transform is truncated to a 16-bit signed value in the
same manner. In practice, if the high word of a 16×16 bit multiplication can be
obtained directly, 16 bits is suﬃcient for every calculation except scaling by C4.
Thus we truncate to 16 bits before that multiplication to allow an implemen-
tation entirely in 16-bit registers. Implementations using larger registers must
sign-extend the 16-bit value to maintain compatibility.
Note that if 16-bit register are used, overﬂow in the additions and subtrac-
tions should be handled using unsaturated arithmetic. That is, the high-order
bits should be discarded and the low-order bits retained, instead of clamping the
result to the maximum or minimum value. This allows the maximum ﬂexibility
in re-ordering these instructions without deviating from this speciﬁcation.
The 1D transform can only overﬂow if input coeﬃcients larger than ±6201
are present. However, the result of applying the 2D forward transform on pixel
values in the range −255 . . . 255 can be as large as ±8157 due to the scale factor
of four that is applied, and quantization errors could make this even larger.
Therefore, the coeﬃcients cannot simply be clamped into a valid range before
the transform.
7.9.3.1
The 1D Inverse DCT
Input parameters:

---

## Page 130

114
CHAPTER 7. FRAME DECODE
Name
Type
Size
(bits)
Signed?
Description and restrictions
Y
Integer
Array
16
Yes
An 8-element array of DCT coeﬃ-
cients.
Output parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
X
Integer
Array
16
Yes
An 8-element array of output values.
Variables used:
Name
Type
Size
(bits)
Signed?
Description and restrictions
T
Integer
Array
32
Yes
An 8-element array containing the
current value of each signal line.
R
Integer
32
Yes
A temporary value.
A compliant decoder MUST use the exact implementation of the inverse
DCT deﬁned in this speciﬁcation. Some operations may be re-ordered, but the
result must be precisely equivalent. This is a design decision that limits some
avenues of decoder optimization, but prevents any drift in the prediction loop.
The full inverse DCT described in this section is only used when there is at least
one non-zero AC coeﬃcient. Otherwise, a special DC-only case is used, which
is described below in step 2(d)vii of Section 7.9.4. The DC-only special case is
not exactly equivalent to applying the full inverse transform, because it avoids
the intermediate multiplications and truncation, and it MUST be used in place
of the full transform to ensure bit-exact decode.
Theora uses a 16-bit integerized approximation of of the 8-point 1D inverse
DCT based on the Chen factorization [CSF77]. It requires 16 multiplications
and 26 additions and subtractions.
A signal ﬂow graph of the transformation is presented in Figure 7.1. This
graph provides a good visualization of which parts of the transform are paral-
lelizable. Time increases from left to right.
Each signal line is involved in an operation where the line is marked with a

---

## Page 131

7.9. RECONSTRUCTION
115
−
−
−
−
−
−
−
−
−
−
0
4
2
6
5
3
7
1
C6 S6
C6
−S6
C4
C4
0
1
2
3
4
5
6
7
C4
C4
C3 S3
C3
−S3
C7
−S7
C7
S7
Figure 7.1: Signal Flow Graph for the 1D Inverse DCT
dot · or a circled plus sign ⊕. The constants Ci and Sj are the 16-bit integer
approximations of cos( iπ
16) and sin( jπ
16 ) listed in Table 7.65. When they appear
next to a signal line, the value on that line is scaled by the given constant. A
circled minus sign ⊖next to a signal line indicates that the value on that line
is negated.
Operations on a single signal path through the graph cannot be reordered,
but operations on diﬀerent paths may be, or may be executed in parallel. Dif-
ferent graphs may be obtainable using the associative, commutative, and dis-
tributive properties of unsaturated arithmetic. The column of numbers on the
left represents an initial permutation of the input DCT coeﬃcients. The col-
umn on the right represents the unpermuted output. One can be obtained by
bit-reversing the 3-bit binary representation of the other.
Ci
Sj
Value
C1
S7
64277
C2
S6
60547
C3
S5
54491
C4
S4
46341
C5
S3
36410
C6
S2
25080
C7
S1
12785
Table 7.65: 16-bit Approximations of Sines and Cosines

---

## Page 132

116
CHAPTER 7. FRAME DECODE

1. Assign T[0] the value Y[0] + Y[4].
2. Truncate T[0] to a 16-bit signed representation by dropping any higher-
order bits.
3. Assign T[0] the value C4 ∗T[0] >> 16.
4. Assign T[1] the value Y[0] −Y[4].
5. Truncate T[1] to a 16-bit signed representation by dropping any higher-
order bits.
6. Assign T[1] the value C4 ∗T[1] >> 16.
7. Assign T[2] the value (C6 ∗Y[2] >> 16) −(S6 ∗Y[6] >> 16).
8. Assign T[3] the value (S6 ∗Y[2] >> 16) + (C6 ∗Y[6] >> 16).
9. Assign T[4] the value (C7 ∗Y[1] >> 16) −(S7 ∗Y[7] >> 16).
10. Assign T[5] the value (C3 ∗Y[5] >> 16) −(S3 ∗Y[3] >> 16).
11. Assign T[6] the value (S3 ∗Y[5] >> 16) + (C3 ∗Y[3] >> 16).
12. Assign T[7] the value (S7 ∗Y[1] >> 16) + (C7 ∗Y[7] >> 16).
13. Assign R the value T[4] + T[5].
14. Assign T[5] the value T[4] −T[5].
15. Truncate T[5] to a 16-bit signed representation by dropping any higher-
order bits.
16. Assign T[5] the value C4 ∗T[5] >> 16.
17. Assign T[4] the value R.
18. Assign R the value T[7] + T[6].
19. Assign T[6] the value T[7] −T[6].
20. Truncate T[6] to a 16-bit signed representation by dropping any higher-
order bits.
21. Assign T[6] the value C4 ∗T[6] >> 16.
22. Assign T[7] the value R.
23. Assign R the value T[0] + T[3].
24. Assign T[3] the value T[0] −T[3].
25. Assign T[0] the value R.
26. Assign R the value T[1] + T[2]

---

## Page 133

7.9. RECONSTRUCTION
117
27. Assign T[2] the value T[1] −T[2]
28. Assign T[1] the value R.
29. Assign R the value T[6] + T[5].
30. Assign T[5] the value T[6] −T[5].
31. Assign T[6] the value R.
32. Assign R the value T[0] + T[7].
33. Truncate R to a 16-bit signed representation by dropping any higher-order
bits.
34. Assign X[0] the value R.
35. Assign R the value T[1] + T[6].
36. Truncate R to a 16-bit signed representation by dropping any higher-order
bits.
37. Assign X[1] the value R.
38. Assign R the value T[2] + T[5].
39. Truncate R to a 16-bit signed representation by dropping any higher-order
bits.
40. Assign X[2] the value R.
41. Assign R the value T[3] + T[4].
42. Truncate R to a 16-bit signed representation by dropping any higher-order
bits.
43. Assign X[3] the value R.
44. Assign R the value T[3] −T[4].
45. Truncate R to a 16-bit signed representation by dropping any higher-order
bits.
46. Assign X[4] the value R.
47. Assign R the value T[2] −T[5].
48. Truncate R to a 16-bit signed representation by dropping any higher-order
bits.
49. Assign X[5] the value R.
50. Assign R the value T[1] −T[6].

---

## Page 134

118
CHAPTER 7. FRAME DECODE
51. Truncate R to a 16-bit signed representation by dropping any higher-order
bits.
52. Assign X[6] the value R.
53. Assign R the value T[0] −T[7].
54. Truncate R to a 16-bit signed representation by dropping any higher-order
bits.
55. Assign X[7] the value R.
7.9.3.2
The 2D Inverse DCT
Input parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
DQC
Integer
Array
14
Yes
A 64-element array of dequantized
DCT coeﬃcients in natural order (cf.
Section 2.6).
Output parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
RES
2D Integer
Array
16
Yes
An 8 × 8 array containing the
decoded residual for the current
block.
Variables used:
Name
Type
Size
(bits)
Signed?
Description and restrictions
ci
Integer
3
No
The column index.
ri
Integer
3
No
The row index.
Y
Integer
Array
16
Yes
An 8-element array of 1D iDCT input
values.

---

## Page 135

7.9. RECONSTRUCTION
119
Name
Type
Size
(bits)
Signed?
Description and restrictions
X
Integer
Array
16
Yes
An 8-element array of 1D iDCT out-
put values.
This procedure applies the 1D inverse DCT transform 16 times to a block
of dequantized coeﬃcients: once for each of the 8 rows, and once for each of the
8 columns of the result. Note that the coordinate system used for the columns
is the same right-handed coordinate system used by the rest of Theora. Thus,
the column is indexed from bottom to top, not top to bottom. The ﬁnal values
are divided by sixteen, rounding with ties rounded towards postive inﬁnity.

1. For each value of ri from 0 to 7:
(a) For each value of ci from 0 to 7:
i. Assign Y[ci] the value DQC[ri ∗8 + ci].
(b) Compute X, the 1D inverse DCT of Y using the procedure described
in Section 7.9.3.1.
(c) For each value of ci from 0 to 7:
i. Assign RES[ri][ci] the value X[ci].
2. For each value of ci from 0 to 7:
(a) For each value of ri from 0 to 7:
i. Assign Y[ri] the value RES[ri][ci].
(b) Compute X, the 1D inverse DCT of Y using the procedure described
in Section 7.9.3.1.
(c) For each value of ri from 0 to 7:
i. Assign RES[ri][ci] the value (X[ri] + 8) >> 4.
7.9.3.3
The 1D Forward DCT (Non-Normative)
Input parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
X
Integer
Array
14
Yes
An 8-element array of input values.

---

## Page 136

120
CHAPTER 7. FRAME DECODE
Output parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
Y
Integer
Array
16
Yes
An 8-element array of DCT coeﬃ-
cients.
Variables used:
Name
Type
Size
(bits)
Signed?
Description and restrictions
T
Integer
Array
16
Yes
An 8-element array containing the
current value of each signal line.
R
Integer
16
Yes
A temporary value.
The forward transform used in the encoder is not mandated by this standard
as the inverse one is. Precise equivalence in the inverse transform alone is all
that is required to guarantee that there is no mismatch in the prediction loop
between encoder and any compliant decoder implementation. However, a for-
ward transform is provided here as a convenience for implementing an encoder.
This is the version of the transform used by Xiph.Org’s Theora encoder, which
is the same as that used by VP3. Like the inverse DCT, it is ﬁrst applied to
each row, and then applied to each column of the result.
The signal ﬂow graph for the forward transform is given in Figure 7.2. It is
largely the reverse of the ﬂow graph given for the inverse DCT. It is important
to note that the signs on the constants in the rotations have changed, and the
C4 scale factors on one of the lower butterﬂies now appear on the opposite side.
The column of numbers on the left represents the unpermuted input, and the
column on the right the permuted output DCT coeﬃcients.
A proper division by 216 is done after the multiplications instead of a shift
in the forward transform. This can be implemented quickly by adding an oﬀset
of 0xFFFF if the number is negative, and then shifting as before. This slightly
increases the computational complexity of the transform. Unlike the inverse
DCT, 16-bit registers and a 16 × 16 →32 bit multiply are suﬃcient to avoid
any overﬂow, so long as the input is in the range −6270 . . . 6270, which is larger
than required.

1. Assign T[0] the value X[0] + X[7].

---

## Page 137

7.9. RECONSTRUCTION
121
−
−
−
−
−
−
−
−
−
−
C4
C4
C6 −S6
C6
S6
C7
S7
C7
−S7
C3 −S3
C3
S3
C4
C4
0
4
2
6
5
3
7
1
0
1
2
3
4
5
6
7
Figure 7.2: Signal Flow Graph for the 1D Forward DCT
2. Assign T[1] the value X[1] + X[6].
3. Assign T[2] the value X[2] + X[5].
4. Assign T[3] the value X[3] + X[4].
5. Assign T[4] the value X[3] −X[4].
6. Assign T[5] the value X[2] −X[5].
7. Assign T[6] the value X[1] −X[6].
8. Assign T[7] the value X[0] −X[7].
9. Assign R the value T[0] + T[3].
10. Assign T[3] the value T[0] −T[3].
11. Assign T[0] the value R.
12. Assign R the value T[1] + T[2].
13. Assign T[2] the value T[1] −T[2].
14. Assign T[1] the value R.
15. Assign R the value T[6] −T[5].
16. Assign T[6] the value (C4 ∗(T[6] + T[5]))//16.
17. Assign T[5] the value (C4 ∗R)//16.

---

## Page 138

122
CHAPTER 7. FRAME DECODE
18. Assign R the value T[4] + T[5].
19. Assign T[5] the value T[4] −T[5].
20. Assign T[4] the value R.
21. Assign R the value T[7] + T[6].
22. Assign T[6] the value T[7] −T[6].
23. Assign T[7] the value R.
24. Assign Y[0] the value (C4 ∗(T[0] + T[1]))//16.
25. Assign Y[4] the value (C4 ∗(T[0] −T[1]))//16.
26. Assign Y[2] the value ((S6 ∗T[3])//16) + ((C6 ∗T[2])//16).
27. Assign Y[6] the value ((C6 ∗T[3])//16) −((S6 ∗T[2])//16).
28. Assign Y[1] the value ((S7 ∗T[7])//16) + ((C7 ∗T[4])//16).
29. Assign Y[5] the value ((S3 ∗T[6])//16) + ((C3 ∗T[5])//16).
30. Assign Y[3] the value ((C3 ∗T[6])//16) −((S3 ∗T[5])//16).
31. Assign Y[7] the value ((C7 ∗T[7])//16) −((S7 ∗T[4])//16).
7.9.4
The Complete Reconstruction Algorithm
Input parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
ACSCALE
Integer
array
16
No
A
64-element
array
of
scale values for AC coef-
ﬁcients for each qi value.
DCSCALE
Integer
array
16
No
A
64-element
array
of
scale values for the DC
coeﬃcient
for
each
qi
value.
BMS
2D Integer
array
8
No
A NBMS×64 array con-
taining the base matrices.
NQRS
2D Integer
array
6
No
A 2 × 3 array contain-
ing the number of quant
ranges for a given qti and
pli, respectively. This is
at most 63.

---

## Page 139

7.9. RECONSTRUCTION
123
Name
Type
Size
(bits)
Signed?
Description and restrictions
QRSIZES
3D Integer
array
6
No
A 2 × 3 × 63 array of the
sizes of each quant range
for a given qti and pli,
respectively.
Only the
ﬁrst NQRS[qti][pli] val-
ues are used.
QRBMIS
3D Integer
array
9
No
A
2 × 3 × 64
array
of
the
bmi’s
used
for
each quant range for a
given qti and pli, respec-
tively.
Only the ﬁrst
(NQRS[qti][pli] + 1) val-
ues are used.
RPYW
Integer
20
No
The width of the Y ′ plane
of the reference frames in
pixels.
RPYH
Integer
20
No
The
height
of
the
Y ′
plane
of
the
reference
frames in pixels.
RPCW
Integer
20
No
The width of the Cb and
Cr planes of the reference
frames in pixels.
RPCH
Integer
20
No
The height of the Cb and
Cr planes of the reference
frames in pixels.
GOLDREFY
2D Integer
Array
8
No
A RPYH × RPYW ar-
ray containing the con-
tents
of
the
Y ′
plane
of the golden reference
frame.
GOLDREFCB
2D Integer
Array
8
No
A RPCH × RPCW ar-
ray containing the con-
tents
of
the
Cb
plane
of the golden reference
frame.
GOLDREFCR
2D Integer
Array
8
No
A RPCH × RPCW ar-
ray containing the con-
tents of the Cr
plane
of the golden reference
frame.

---

## Page 140

124
CHAPTER 7. FRAME DECODE
Name
Type
Size
(bits)
Signed?
Description and restrictions
PREVREFY
2D Integer
Array
8
No
A RPYH × RPYW ar-
ray containing the con-
tents
of
the
Y ′
plane
of the previous reference
frame.
PREVREFCB
2D Integer
Array
8
No
A RPCH × RPCW ar-
ray containing the con-
tents
of
the
Cb
plane
of the previous reference
frame.
PREVREFCR
2D Integer
Array
8
No
A RPCH × RPCW ar-
ray containing the con-
tents of the Cr
plane
of the previous reference
frame.
NBS
Integer
36
No
The
total
number
of
blocks in a frame.
BCODED
Integer
Array
1
No
An NBS-element array
of ﬂags indicating which
blocks are coded.
MBMODES
Integer
Array
3
No
An NMBS-element ar-
ray of coding modes for
each macro block.
MVECTS
Array
of
2D Integer
Vectors
6
Yes
An NBS-element array
of motion vectors for each
block.
COEFFS
2D Integer
Array
16
Yes
An
NBS × 64
array
of
quantized
DCT
co-
eﬃcient values for each
block in zig-zag order.
NCOEFFS
Integer
Array
7
No
An NBS-element array
of the coeﬃcient count
for each block.
QIS
Integer
array
6
No
An NQIS-element array
of qi values.
QIIS
Integer
Array
2
No
An NBS-element array
of
qii
values
for
each
block.
Output parameters:

---

## Page 141

7.9. RECONSTRUCTION
125
Name
Type
Size
(bits)
Signed?
Description and restrictions
RECY
2D Integer
Array
8
No
A RPYH × RPYW array con-
taining the contents of the Y ′
plane of the reconstructed frame.
RECCB
2D Integer
Array
8
No
A RPCH × RPCW array con-
taining the contents of the Cb
plane of the reconstructed frame.
RECCR
2D Integer
Array
8
No
A RPCH × RPCW array con-
taining the contents of the Cr
plane of the reconstructed frame.
Variables used:
Name
Type
Size
(bits)
Signed?
Description and restrictions
RPW
Integer
20
No
The width of the current plane of
the current reference frame in pix-
els.
RPH
Integer
20
No
The height of the current plane of
the current reference frame in pix-
els.
REFP
2D Integer
Array
8
No
A RPH × RPW array containing
the contents of the current plane of
the current reference frame.
BX
Integer
20
No
The horizontal pixel index of the
lower-left corner of the current
block.
BY
Integer
20
No
The vertical pixel index of the
lower-left corner of the current
block.
MVX
Integer
5
No
The horizontal component of the
ﬁrst whole-pixel motion vector.
MVY
Integer
5
No
The vertical component of the ﬁrst
whole-pixel motion vector.
MVX2
Integer
5
No
The horizontal component of the
second whole-pixel motion vector.
MVY2
Integer
5
No
The vertical component of the sec-
ond whole-pixel motion vector.
PRED
2D Integer
Array
8
No
An 8 × 8 array of predictor values
to use for the current block.

---

## Page 142

126
CHAPTER 7. FRAME DECODE
Name
Type
Size
(bits)
Signed?
Description and restrictions
RES
2D Integer
Array
16
Yes
An 8 × 8 array containing the
decoded residual for the current
block.
QMAT
Integer
array
16
No
A 64-element array of quantization
values for each DCT coeﬃcient in
natural order.
DC
Integer
29
Yes
The dequantized DC coeﬃcient of
a block.
P
Integer
17
Yes
A reconstructed pixel value.
bi
Integer
36
No
The index of the current block in
coded order.
mbi
Integer
32
No
The index of the macro block con-
taining block bi.
pli
Integer
2
No
The color plane index of the current
block.
rﬁ
Integer
2
No
The index of the reference frame
indicated by the coding mode for
macro block mbi.
bx
Integer
3
No
The horizontal pixel index in the
block.
by
Integer
3
No
The vertical pixel index in the
block.
qti
Integer
1
No
A quantization type index. See Ta-
ble 3.1.
qi0
Integer
6
No
The quantization index of the DC
coeﬃcient.
qi
Integer
6
No
The quantization index of the AC
coeﬃcients.
This section takes the decoded packet data and uses the previously deﬁned
procedures to reconstruct each block of the current frame. For coded blocks,
a predictor is formed using the coding mode and, if applicable, the motion
vector, and then the residual is computed from the quantized DCT coeﬃcients.
For uncoded blocks, the contents of the co-located block are copied from the
previous frame and the residual is cleared to zero.
Then the predictor and
residual are added, and the result clamped to the range 0 . . . 255 and stored in
the current frame.
In the special case that a block contains only a DC coeﬃcient, the dequanti-
zation and inverse DCT transform is skipped. Instead the constant pixel value
for the entire block is computed in one step. Note that the truncation of in-
termediate operations is omitted and the ﬁnal rounding is slightly diﬀerent in
this case. The check for whether or not the block contains only a DC coeﬃcient

---

## Page 143

7.9. RECONSTRUCTION
127
is based on the coeﬃcient count returned from the token decode procedure of
Section 7.7, and not by checking to see if the remaining coeﬃcient values are
zero. Also note that even when the coeﬃcient count indicates the block contains
zero coeﬃcients, the DC coeﬃcient is still processed, as undoing DC prediction
might have made it non-zero.
After this procedure, the frame is completely reconstructed, but before it
can be used as a reference frame, a loop ﬁlter must be run over it to help reduce
blocking artifacts. This is detailed in Section 7.10.

1. Assign qi0 the value QIS[0].
2. For each value of bi from 0 to (NBS −1):
(a) Assign pli the index of the color plane block bi belongs to.
(b) Assign BX the horizontal pixel index of the lower-left corner of block
bi.
(c) Assign BY the vertical pixel index of the lower-left corner of block
bi.
(d) If BCODED[bi] is non-zero:
i. Assign mbi the index of the macro block containing block bi.
ii. If MBMODES[mbi] is 1 (INTRA), assign qti the value 0.
iii. Otherwise, assign qti the value 1.
iv. Assign rﬁthe value of the Reference Frame Index column of
Table 7.46 corresponding to MBMODES[mbi].
v. If rﬁis zero, compute PRED using the procedure given in Sec-
tion 7.9.1.1.
vi. Otherwise:
A. Assign REFP, RPW, and RPH the values given in Table 7.75
corresponding to current value of rﬁand pli.
rﬁ
pli
REFP
RPW
RPH
1
0
PREVREFY
RPYW
RPYH
1
1
PREVREFCB
RPCW
RPCH
1
2
PREVREFCR
RPCW
RPCH
2
0
GOLDREFY
RPYW
RPYH
2
1
GOLDREFCB
RPCW
RPCH
2
2
GOLDREFCR
RPCW
RPCH
Table 7.75: Reference Planes and Sizes for Each rﬁand pli
B. Assign MVX the value
⌊|MVECTS[bi]x|⌋∗sign(MVECTS[bi]x).

---

## Page 144

128
CHAPTER 7. FRAME DECODE
C. Assign MVY the value
⌊|MVECTS[bi]y|⌋∗sign(MVECTS[bi]y).
D. Assign MVX2 the value
⌈|MVECTS[bi]x|⌉∗sign(MVECTS[bi]x).
E. Assign MVY2 the value
⌈|MVECTS[bi]y|⌉∗sign(MVECTS[bi]y).
F. If MVX equals MVX2 and MVY equals MVY2, use the val-
ues REFP, RPW, RPH, BX, BY, MVX, and MVY, compute
PRED using the procedure given in Section 7.9.1.2.
G. Otherwise, use the values REFP, RPW, RPH, BX, BY,
MVX, MVY, MVX2, and MVY2 to compute PRED using
the procedure given in Section 7.9.1.3.
vii. If NCOEFFS[bi] is less than 2:
A. Using ACSCALE, DCSCALE, BMS, NQRS,
QRSIZES, QRBMIS, qti, pli, and qi0, use the procedure
given in Section 6.4.3 to compute the DC quantization matrix
QMAT.
B. Assign DC the value
(COEFFS[bi][0] ∗QMAT[0] + 15) >> 5.
C. Truncate DC to a 16-bit signed representation by dropping
any higher-order bits.
D. For each value of by from 0 to 7, and each value of bx from
0 to 7, assign RES[by][bx] the value DC.
viii. Otherwise:
A. Assign qi the value QIS[QIIS[bi]].
B. Using ACSCALE, DCSCALE, BMS, NQRS,
QRSIZES, QRBMIS, qti, pli, qi0, and qi, compute DQC
using the procedure given in Section 7.9.2.
C. Using DQC, compute RES using the procedure given in Sec-
tion 7.9.3.2.
(e) Otherwise:
i. Assign rﬁthe value 1.
ii. Assign REFP, RPW, and RPH the values given in Table 7.75
corresponding to current value of rﬁand pli.
iii. Assign MVX the value 0.
iv. Assign MVY the value 0.

---

## Page 145

7.10. LOOP FILTERING
129
v. Using the values REFP, RPW, RPH, BX, BY, MVX, and MVY,
compute PRED using the procedure given in Section 7.9.1.2.
This is simply a copy of the co-located block in the previous
reference frame.
vi. For each value of by from 0 to 7, and each value of bx from 0 to
7, assign RES[by][bx] the value 0.
(f) For each value of by from 0 to 7, and each value of bx from 0 to 7:
i. Assign P the value (PRED[by][bx] + RES[by][bx]).
ii. If P is greater than 255, assign P the value 255.
iii. If P is less than 0, assign P the value 0.
iv. If pli equals 0, assign RECY[BY + by][BX + bx] the value P.
v. Otherwise, if pli equals 1, assign RECB[BY + by][BX + bx] the
value P.
vi. Otherwise, pli equals 2, so assign RECR[BY +by][BX +bx] the
value P.
7.10
Loop Filtering
(−2L,0)
(−L,−L)
lflim
(L,L)
(2L,0)
R
Figure 7.3: The loop ﬁlter response function.
The loop ﬁlter is a simple deblocking ﬁlter that is based on running a small
edge detecting ﬁlter over the coded block edges and adjusting the pixel values by

---

## Page 146

130
CHAPTER 7. FRAME DECODE
a tapered response. The ﬁlter response is modulated by the following non-linear
function:
lﬂim(R, L) =











0,
R ≤−2 ∗L
−R −2 ∗L,
−2 ∗L < R ≤−L
R,
−L < R < L
−R + 2 ∗L,
L ≤R < 2 ∗L
0,
2 ∗L ≤R
Here L is a limiting value equal to LFLIMS[qi0]. It deﬁnes the peaks of the
function, illustrated in Figure 7.3. LFLIMS is an array of values speciﬁed in
the setup header and is indexed by qi0, the ﬁrst quantization index for the
frame, the one used for all the DC coeﬃcients. Larger values of L indicate a
stronger ﬁlter.
7.10.1
Horizontal Filter
Input parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
RECP
2D Integer
Array
8
No
A RPH × RPW array containing
the contents of a plane of the re-
constructed frame.
FX
Integer
20
No
The horizontal pixel index of the
lower-left corner of the area to be
ﬁltered.
FY
Integer
20
No
The vertical pixel index of the
lower-left corner of the area to be
ﬁltered.
L
Integer
7
No
The loop ﬁlter limit value.
Output parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
RECP
2D Integer
Array
8
No
A RPH × RPW array containing
the contents of a plane of the re-
constructed frame.

---

## Page 147

7.10. LOOP FILTERING
131
Variables used:
Name
Type
Size
(bits)
Signed?
Description and restrictions
R
Integer
9
Yes
The edge detector response.
P
Integer
9
Yes
A ﬁltered pixel value.
by
Integer
20
No
The vertical pixel index in the block.
This procedure applies a 4-tap horizontal ﬁlter to each row of a vertical block
edge.

1. For each value of by from 0 to 7:
(a) Assign R the value
(RECP[FY + by][FX] −3 ∗RECP[FY + by][FX + 1]+
3∗RECP[FY+by][FX+2]−RECP[FY+by][FX+3]+4) >> 3
(b) Assign P the value (RECP[FY + by][FX + 1] + lﬂim(R, L)).
(c) If P is less than zero, assign RECP[FY+by][FX+1] the value zero.
(d) Otherwise, if P is greater than 255, assign RECP[FY + by][FX + 1]
the value 255.
(e) Otherwise, assign RECP[FY + by][FX + 1] the value P.
(f) Assign P the value (RECP[FY + by][FX + 2] −lﬂim(R, L)).
(g) If P is less than zero, assign RECP[FY+by][FX+2] the value zero.
(h) Otherwise, if P is greater than 255, assign RECP[FY + by][FX + 2]
the value 255.
(i) Otherwise, assign RECP[FY + by][FX + 2] the value P.
7.10.2
Vertical Filter
Input parameters:

---

## Page 148

132
CHAPTER 7. FRAME DECODE
Name
Type
Size
(bits)
Signed?
Description and restrictions
RECP
2D Integer
Array
8
No
A RPH × RPW array containing
the contents of a plane of the re-
constructed frame.
FX
Integer
20
No
The horizontal pixel index of the
lower-left corner of the area to be
ﬁltered.
FY
Integer
20
No
The vertical pixel index of the
lower-left corner of the area to be
ﬁltered.
L
Integer
7
No
The loop ﬁlter limit value.
Output parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
RECP
2D Integer
Array
8
No
A RPH × RPW array containing
the contents of a plane of the re-
constructed frame.
Variables used:
Name
Type
Size
(bits)
Signed?
Description and restrictions
R
Integer
9
Yes
The edge detector response.
P
Integer
9
Yes
A ﬁltered pixel value.
bx
Integer
20
No
The horizontal pixel index in the block.
This procedure applies a 4-tap vertical ﬁlter to each column of a horizontal
block edge.

1. For each value of bx from 0 to 7:
(a) Assign R the value
(RECP[FY][FX + bx] −3 ∗RECP[FY + 1][FX + bx]+
3∗RECP[FY+2][FX+bx]−RECP[FY+3][FX+bx]+4) >> 3

---

## Page 149

7.10. LOOP FILTERING
133
(b) Assign P the value (RECP[FY + 1][FX + bx] + lﬂim(R, L)).
(c) If P is less than zero, assign RECP[FY+1][FX+bx] the value zero.
(d) Otherwise, if P is greater than 255, assign RECP[FY + 1][FX + bx]
the value 255.
(e) Otherwise, assign RECP[FY + 1][FX + bx] the value P.
(f) Assign P the value (RECP[FY + 2][FX + bx] −lﬂim(R, L)).
(g) If P is less than zero, assign RECP[FY+2][FX+bx] the value zero.
(h) Otherwise, if P is greater than 255, assign RECP[FY + 2][FX + bx]
the value 255.
(i) Otherwise, assign RECP[FY + 2][FX + bx] the value P.
7.10.3
Complete Loop Filter
Input parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
LFLIMS
Integer
array
7
No
A 64-element array of loop ﬁl-
ter limit values.
RPYW
Integer
20
No
The width of the Y ′ plane of
the reconstruced frame in pix-
els.
RPYH
Integer
20
No
The height of the Y ′ plane of
the reconstruced frame in pix-
els.
RPCW
Integer
20
No
The
width
of
the
Cb
and
Cr planes of the reconstruced
frame in pixels.
RPCH
Integer
20
No
The height of the Cb
and
Cr planes of the reconstruced
frame in pixels.
NBS
Integer
36
No
The total number of blocks in
a frame.
BCODED
Integer
Array
1
No
An NBS-element array of ﬂags
indicating
which
blocks
are
coded.
QIS
Integer
array
6
No
An NQIS-element array of qi
values.
RECY
2D Integer
Array
8
No
A RPYH × RPYW array
containing the contents of the
Y ′ plane of the reconstructed
frame.

---

## Page 150

134
CHAPTER 7. FRAME DECODE
Name
Type
Size
(bits)
Signed?
Description and restrictions
RECCB
2D Integer
Array
8
No
A RPCH × RPCW array
containing the contents of the
Cb plane of the reconstructed
frame.
RECCR
2D Integer
Array
8
No
A RPCH × RPCW array
containing the contents of the
Cr plane of the reconstructed
frame.
Output parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
RECY
2D Integer
Array
8
No
A RPYH × RPYW array con-
taining the contents of the Y ′
plane of the reconstructed frame.
RECCB
2D Integer
Array
8
No
A RPCH × RPCW array con-
taining the contents of the Cb
plane of the reconstructed frame.
RECCR
2D Integer
Array
8
No
A RPCH × RPCW array con-
taining the contents of the Cr
plane of the reconstructed frame.
Variables used:
Name
Type
Size
(bits)
Signed?
Description and restrictions
RPW
Integer
20
No
The width of the current plane of
the reconstructed frame in pixels.
RPH
Integer
20
No
The height of the current plane of
the reconstructed frame in pixels.
RECP
2D Integer
Array
8
No
A RPH × RPW array containing
the contents of the current plane of
the reconstruced frame.

---

## Page 151

7.10. LOOP FILTERING
135
Name
Type
Size
(bits)
Signed?
Description and restrictions
BX
Integer
20
No
The horizontal pixel index of the
lower-left corner of the current
block.
BY
Integer
20
No
The vertical pixel index of the
lower-left corner of the current
block.
FX
Integer
20
No
The horizontal pixel index of the
lower-left corner of the area to be
ﬁltered.
FY
Integer
20
No
The vertical pixel index of the
lower-left corner of the area to be
ﬁltered.
L
Integer
7
No
The loop ﬁlter limit value.
bi
Integer
36
No
The index of the current block in
coded order.
bj
Integer
36
No
The index of a neighboring block in
coded order.
pli
Integer
2
No
The color plane index of the current
block.
This procedure deﬁnes the order that the various block edges are ﬁltered.
Because each application of one of the two ﬁlters above destructively modiﬁes
the contents of the reconstructed image, the precise output obtained diﬀers
depending on the order that horizontal and vertical ﬁlters are applied to the
edges of a single block. The order deﬁned here conforms to that used by VP3.

1. Assign L the value LFLIMS[QIS[0]].
2. For each block in raster order, with coded-order index bi:
(a) If BCODED[bi] is non-zero:
i. Assign pli the index of the color plane block bi belongs to.
ii. Assign RECP, RPW, and RPH the values given in Table 7.85
corresponding to the value of pli.
pli
RECP
RPW
RPH
0
RECY
RPYW
RPYH
1
RECCB
RPCW
RPCH
2
RECCR
RPCW
RPCH
Table 7.85: Reconstructed Planes and Sizes for Each pli

---

## Page 152

136
CHAPTER 7. FRAME DECODE
iii. Assign BX the horizontal pixel index of the lower-left corner of
the block bi.
iv. Assign BY the vertical pixel index of the lower-left corner of the
block bi.
v. If BX is greater than zero:
A. Assign FX the value (BX −2).
B. Assign FY the value BY.
C. Using RECP, FX, FY, and L, apply the horizontal block
ﬁlter to the left edge of block bi with the procedure described
in Section 7.10.1.
vi. If BY is greater than zero:
A. Assign FX the value BX.
B. Assign FY the value (BY −2)
C. Using RECP, FX, FY, and L, apply the vertical block ﬁlter
to the bottom edge of block bi with the procedure described
in Section 7.10.2.
vii. If (BX + 8) is less than RPW and BCODED[bj] is zero, where
bj is the coded-order index of the block adjacent to bi on the
right:
A. Assign FX the value (BX + 6).
B. Assign FY the value BY.
C. Using RECP, FX, FY, and L, apply the horizontal block ﬁl-
ter to the right edge of block bi with the procedure described
in Section 7.10.1.
viii. If (BY + 8) is less than RPH and BCODED[bj] is zero, where
bj is the coded-order index of the block adjacent to bi above:
A. Assign FX the value BX.
B. Assign FY the value (BY + 6)
C. Using RECP, FX, FY, and L, apply the vertical block ﬁlter
to the top edge of block bi with the procedure described in
Section 7.10.2.
VP3 Compatibility
The original VP3 decoder implemented unrestricted motion vectors by enlarging
the reconstructed frame buﬀers and repeating the pixels on its edges into the
padding region. However, for the previous reference frame this padding ocurred
before the loop ﬁlter was applied, but for the golden reference frame it occurred
afterwards.
This means that for the previous reference frame, the padding values were
required to be stored separately from the main image values. Furthermore, even
if the previous and golden reference frames were in fact the same frame, they
could have diﬀerent padding values. Finally, the encoder did not apply the loop

---

## Page 153

7.11. COMPLETE FRAME DECODE
137
ﬁlter at all, which resulted in artifacts, particularly in near-static scenes, due to
prediction-loop mismatch. This last can only be considered a bug in the VP3
encoder.
Given all these things, Theora now uniformly applies the loop ﬁlter before
the reference frames are padded. This means it is possible to use the same buﬀer
for the previous and golden reference frames when they do indeed refer to the
same frame. It also means that on architectures where memory bandwidth is
limited, it is possible to avoid storing padding values, and simply clamp the
motion vectors applied to each pixel as described in Sections 7.9.1.2 and 7.9.1.3.
This means that the predicted pixel values along the edges of the frame might
diﬀer slightly between VP3 and Theora, but since the VP3 encoder did not
apply the loop ﬁlter in the ﬁrst place, this is not likely to impose any serious
compatibility issues.
7.11
Complete Frame Decode
Input parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
FMBW
Integer
16
No
The width of the frame in
macro blocks.
FMBH
Integer
16
No
The height of the frame
in macro blocks.
NSBS
Integer
32
No
The total number of su-
per blocks in a frame.
NBS
Integer
36
No
The
total
number
of
blocks in a frame.
NMBS
Integer
32
No
The
total
number
of
macro blocks in a frame.
FRN
Integer
32
No
The frame-rate numera-
tor.
FRD
Integer
32
No
The frame-rate denomi-
nator.
PARN
Integer
24
No
The
pixel
aspect-ratio
numerator.
PARD
Integer
24
No
The pixel aspect-ratio de-
nominator.
CS
Integer
8
No
The color space.
PF
Integer
2
No
The pixel format.
NOMBR
Integer
24
No
The nominal bitrate of
the stream, in bits per
second.

---

## Page 154

138
CHAPTER 7. FRAME DECODE
Name
Type
Size
(bits)
Signed?
Description and restrictions
QUAL
Integer
6
No
The quality hint.
KFGSHIFT
Integer
5
No
The amount to shift the
key frame number by in
the granule position.
LFLIMS
Integer
array
7
No
A
64-element
array
of
loop ﬁlter limit values.
ACSCALE
Integer
array
16
No
A
64-element
array
of
scale values for AC coef-
ﬁcients for each qi value.
DCSCALE
Integer
array
16
No
A
64-element
array
of
scale values for the DC
coeﬃcient
for
each
qi
value.
NBMS
Integer
10
No
The number of base ma-
trices.
BMS
2D Integer
array
8
No
A NBMS×64 array con-
taining the base matrices.
NQRS
2D Integer
array
6
No
A 2 × 3 array contain-
ing the number of quant
ranges for a given qti and
pli, respectively. This is
at most 63.
QRSIZES
3D Integer
array
6
No
A 2 × 3 × 63 array of the
sizes of each quant range
for a given qti and pli,
respectively.
Only the
ﬁrst NQRS[qti][pli] val-
ues will be used.
QRBMIS
3D Integer
array
9
No
A
2 × 3 × 64
array
of
the
bmi’s
used
for
each quant range for a
given qti and pli, respec-
tively.
Only the ﬁrst
(NQRS[qti][pli] + 1) val-
ues will be used.
HTS
Huﬀman table array
An 80-element array of
Huﬀman tables with up
to 32 entries each.
GOLDREFY
2D Integer
Array
8
No
A RPYH × RPYW ar-
ray containing the con-
tents
of
the
Y ′
plane
of the golden reference
frame.

---

## Page 155

7.11. COMPLETE FRAME DECODE
139
Name
Type
Size
(bits)
Signed?
Description and restrictions
GOLDREFCB
2D Integer
Array
8
No
A RPCH × RPCW ar-
ray containing the con-
tents
of
the
Cb
plane
of the golden reference
frame.
GOLDREFCR
2D Integer
Array
8
No
A RPCH × RPCW ar-
ray containing the con-
tents of the Cr
plane
of the golden reference
frame.
PREVREFY
2D Integer
Array
8
No
A RPYH × RPYW ar-
ray containing the con-
tents
of
the
Y ′
plane
of the previous reference
frame.
PREVREFCB
2D Integer
Array
8
No
A RPCH × RPCW ar-
ray containing the con-
tents
of
the
Cb
plane
of the previous reference
frame.
PREVREFCR
2D Integer
Array
8
No
A RPCH × RPCW ar-
ray containing the con-
tents of the Cr
plane
of the previous reference
frame.
Output parameters:
Name
Type
Size
(bits)
Signed?
Description and restrictions
RECY
2D Integer
Array
8
No
A RPYH × RPYW ar-
ray containing the con-
tents of the Y ′ plane of
the reconstructed frame.
RECCB
2D Integer
Array
8
No
A RPCH × RPCW ar-
ray containing the con-
tents of the Cb plane of
the reconstructed frame.

---

## Page 156

140
CHAPTER 7. FRAME DECODE
Name
Type
Size
(bits)
Signed?
Description and restrictions
RECCR
2D Integer
Array
8
No
A RPCH × RPCW ar-
ray containing the con-
tents of the Cr plane of
the reconstructed frame.
GOLDREFY
2D Integer
Array
8
No
A RPYH × RPYW ar-
ray containing the con-
tents
of
the
Y ′
plane
of the golden reference
frame.
GOLDREFCB
2D Integer
Array
8
No
A RPCH × RPCW ar-
ray containing the con-
tents
of
the
Cb
plane
of the golden reference
frame.
GOLDREFCR
2D Integer
Array
8
No
A RPCH × RPCW ar-
ray containing the con-
tents of the Cr
plane
of the golden reference
frame.
PREVREFY
2D Integer
Array
8
No
A RPYH × RPYW ar-
ray containing the con-
tents
of
the
Y ′
plane
of the previous reference
frame.
PREVREFCB
2D Integer
Array
8
No
A RPCH × RPCW ar-
ray containing the con-
tents
of
the
Cb
plane
of the previous reference
frame.
PREVREFCR
2D Integer
Array
8
No
A RPCH × RPCW ar-
ray containing the con-
tents of the Cr
plane
of the previous reference
frame.
Variables used:
Name
Type
Size
(bits)
Signed?
Description and restrictions
FTYPE
Integer
1
No
The frame type.

---

## Page 157

7.11. COMPLETE FRAME DECODE
141
Name
Type
Size
(bits)
Signed?
Description and restrictions
NQIS
Integer
2
No
The number of qi values.
QIS
Integer
array
6
No
An NQIS-element array of qi
values.
BCODED
Integer
Array
1
No
An
NBS-element
array
of
ﬂags indicating which blocks
are coded.
MBMODES
Integer
Array
3
No
An NMBS-element array of
coding modes for each macro
block.
MVECTS
Array
of
2D Integer
Vectors
6
Yes
An NBS-element array of mo-
tion vectors for each block.
QIIS
Integer
Array
2
No
An NBS-element array of qii
values for each block.
COEFFS
2D Integer
Array
16
Yes
An NBS × 64 array of quan-
tized DCT coeﬃcient values
for each block in zig-zag order.
NCOEFFS
Integer
Array
7
No
An
NBS-element
array
of
the coeﬃcient count for each
block.
RPYW
Integer
20
No
The width of the Y ′ plane of
the reference frames in pixels.
RPYH
Integer
20
No
The height of the Y ′ plane of
the reference frames in pixels.
RPCW
Integer
20
No
The width of the Cb and Cr
planes of the reference frames
in pixels.
RPCH
Integer
20
No
The height of the Cb and Cr
planes of the reference frames
in pixels.
bi
Integer
36
No
The index of the current block
in coded order.
This procedure uses all the procedures deﬁned in the previous section of this
chapter to decode and reconstruct a complete frame. It takes as input values
decoded from the headers, as well as the current reference frames. As output,
it gives the uncropped, reconstructed frame. This should be cropped to picture
region before display. As a special case, a 0-byte packet is treated exactly like
an inter frame with no coded blocks.

1. If the size of the data packet is non-zero:
(a) Decode the frame header values FTYPE, NQIS, and QIS using the
procedure given in Section 7.1.

---

## Page 158

142
CHAPTER 7. FRAME DECODE
PF
RPCW
RPCH
0
8 ∗FMBW
8 ∗FMBH
2
8 ∗FMBW
16 ∗FMBH
3
16 ∗FMBW
16 ∗FMBH
Table 7.89: Width and Height of Chroma Planes for each Pixel Format
(b) Using FTYPE, NSBS, and NBS, decode the list of coded block
ﬂags into BCODED using the procedure given in Section 7.3.
(c) Using FTYPE, NMBS, NBS, and BCODED, decode the macro
block coding modes into MBMODES using the procedure given in
Section 7.4.
(d) If FTYPE is non-zero (inter frame), using PF, NMBS, MBMODES,
NBS, and BCODED, decode the motion vectors into MVECTS using
the procedure given in Section 7.5.1.
(e) Using NBS, BCODED, and NQIS, decode the block-level qi values
into QIIS using the procedure given in Section 7.6.
(f) Using NBS, NMBS, BCODED, and HTS, decode the DCT coeﬃ-
cients into NCOEFFS and NCOEFFS using the procedure given in
Section 7.7.3.
(g) Using BCODED and MBMODES, undo the DC prediction on the
DC coeﬃcients stored in COEFFS using the procedure given in Sec-
tion 7.8.2.
2. Otherwise:
(a) Assign FTYPE the value 1 (inter frame).
(b) Assign NQIS the value 1.
(c) Assign QIS[0] the value 63.
(d) For each value of bi from 0 to (NBS −1), assign BCODED[bi] the
value zero.
3. Assign RPYW and RPYH the values (16 ∗FMBW) and (16 ∗FMBH),
respectively.
4. Assign RPCW and RPCH the values from the row of Table 7.89 corre-
sponding to PF.
5. Using ACSCALE, DCSCALE, BMS, NQRS, QRSIZES, QRBMIS,
NBS, BCODED, MBMODES, MVECTS, COEFFS, NCOEFFS, QIS,
QIIS, RPYW, RPYH, RPCW, RPCH, GOLDREFY, GOLDREFCB,
GOLDREFCR, PREVREFY, PREVREFCB, and PREVREFCR,
reconstruct the complete frame into RECY, RECCB, and RECCR us-
ing the procedure given in Section 7.9.4.

---

## Page 159

7.11. COMPLETE FRAME DECODE
143
6. Using LFLIMS, RPYW, RPYH, RPCW, RPCH, NBS, BCODED, and
QIS, apply the loop ﬁlter to the reconstructed frame in RECY, RECCB,
and RECCR using the procedure given in Section 7.10.3.
7. If FTYPE is zero (intra frame), assign GOLDREFY, GOLDREFCB,
and GOLDREFCR the values RECY, RECCB, and RECCR, re-
spectively.
8. Assign PREVREFY, PREVREFCB, and PREVREFCR the values
RECY, RECCB, and RECCR, respectively.

---

## Page 160

144
CHAPTER 7. FRAME DECODE

---

## Page 161

Appendix A
Ogg Bitstream
Encapsulation
A.1
Overview
This document speciﬁes the embedding or encapsulation of Theora packets in
an Ogg transport stream.
Ogg is a stream oriented wrapper for coded, linear time-based data. It pro-
vides syncronization, multiplexing, framing, error detection and seeking land-
marks for the decoder and complements the raw packet format used by the
Theora codec.
This document assumes familiarity with the details of the Ogg standard.
The Xiph.Org documentation provides an overview of the Ogg transport stream
format at <http://www.xiph.org/ogg/doc/oggstream.html> and a detailed de-
scription at <http://www.xiph.org/ogg/doc/framing.html>. The format is also
deﬁned in RFC 3533 [Pfe03]. While Theora packets can be embedded in a wide
variety of media containers and streaming mechanisms, the Xiph.Org Founda-
tion recommends Ogg as the native format for Theora video in ﬁle-oriented
storage and transmission contexts.
A.1.1
MIME type
The generic MIME type of any Ogg ﬁle is application/ogg.
The speciﬁc
MIME type for the Ogg Theora proﬁle documented here is video/ogg. This
is the MIME type recommended for ﬁles conforming to this appendix.
The
recommended ﬁlename extension is .ogv.
Outside of an encapsulation, the mime type video/theora may be used to
refer speciﬁcally to the Theora compressed video stream.
145

---

## Page 162

146
APPENDIX A. OGG BITSTREAM ENCAPSULATION
A.2
Embedding in a logical bitstream
Ogg separates the concept of a logical bitstream consisting of the framing of
a particular sequence of packets and complete within itself from the physical
bitstream which may consist either of a single logical bitstream or a number of
logical bitstreams multiplexed together. This section speciﬁes the embedding
of Theora packets in a logical Ogg bitstream.
The mapping of Ogg Theora
logical bitstreams into a multiplexed physical Ogg stream is described in the
next section.
A.2.1
Headers
The initial identiﬁcation header packet appears by itself in a single Ogg page.
This page deﬁnes the start of the logical stream and MUST have the ‘beginning
of stream’ ﬂag set.
The second and third header packets (comment metadata and decoder setup
data) can together span one or more Ogg pages. If there are additional non-
normative header packets, they MUST be included in this sequence of pages
as well. The comment header packet MUST begin the second Ogg page in the
logical bitstream, and there MUST be a page break between the last header
packet and the ﬁrst frame data packet.
These two page break requirements facilitate stream identiﬁcation and sim-
plify header acquisition for seeking and live streaming applications.
All header pages MUST have their granule position ﬁeld set to zero.
A.2.2
Frame data
The ﬁrst frame data packet in a logical bitstream MUST begin a new Ogg page.
All other data packets are placed one at a time into Ogg pages until the end of
the stream. Packets can span pages and multiple packets can be placed within
any one page. The last page in the logical bitstream SHOULD have its ’end of
stream’ ﬂag set to indicate complete transmission of the available video.
Frame data pages MUST be marked with a granule position corresponding
to the end of the display interval of the last frame/packet that ﬁnishes in that
page. See the next section for details.
A.2.3
Granule position
Data packets are marked by a granulepos derived from the count of decodable
frames after that packet is processed. The ﬁeld itself is divided into two sections,
the width of the less signiﬁcant section being given by the KFGSHIFT param-
eter decoded from the identiﬁcation header (Section 6.2). The more signiﬁcant
portion of the ﬁeld gives the count of coded frames after the coding of the last
keyframe in stream, and the less signiﬁcant portion gives the count of frames
since the last keyframe. Thus a stream would begin with a split granulepos of

---

## Page 163

A.3. MULTIPLEXED STREAM MAPPING
147
1|0 (a keyframe), followed by 1|1, 1|2, 1|3, etc. Around a keyframe in the mid-
dle of the stream the granulepos sequence might be 1234|35, 1234|36, 1234|37,
1271|0 (for the keyframe), 1271|1, and so on. In this way the granulepos ﬁeld in-
creased monotonically as required by the Ogg format, but contains information
necessary to eﬃciently ﬁnd the previous keyframe to continue decoding after a
seek.
Prior to bitstream version 3.2.1, data packets were marked by a granulepos
derived from the index of the frame being decoded, rather than the count. That
is they marked the beginning of the display interval of a frame rather than the
end. Such streams have the VREV ﬁeld of the identiﬁcation header set to ‘0’
instead of ‘1’. They can be interpreted according to the description above by
adding 1 to the more signiﬁcation ﬁeld of the split granulepos when VREV is
less than 1.
A.3
Multiplexed stream mapping
Applications supporting Ogg Theora must support Theora bitstreams multi-
plexed with compressed audio data in the Vorbis I and Speex formats, and
should support Ogg-encapsulated MNG graphics for overlays.
Multiple audio and video bitstreams may be multiplexed together.
How
playback of multiple/alternate streams is handled is up to the application. Some
conventions based on included metadata aide interoperability in this respect.
A.3.1
Chained streams
Ogg Theora decoders and playback applications MUST support both grouped
streams (multiplexed concurrent logical streams) and chained streams (sequen-
tial concatenation of independent physical bitstreams).
The number and codec data types of multiplexed streams and the decoder
parameters for those stream types that re-occur can all change at a chaining
boundary. A playback application MUST be prepared to handle such changes
and SHOULD do so smoothly with the minimum possible visible disruption.
The speciﬁcation of grouped streams below applies independently to each seg-
ment of a chained bitstream.
A.3.2
Grouped streams
At the beginning of a multiplexed stream, the ‘beginning of stream’ pages for
each logical bitstream will be grouped together. Within these, the ﬁrst page
to occur MUST be the Theora page. This facilitates identiﬁcation of Ogg The-
ora ﬁles among other Ogg-encapsulated content. A playback application must
nevertheless handle streams where this arrangement is not correct.
If there is more than one Theora logical stream, the ﬁrst page should be from
the primary stream. That is, the best choice for the stream a generic player
should begin displaying without special user direction. If there is more than

---

## Page 164

148
APPENDIX A. OGG BITSTREAM ENCAPSULATION
one audio stream, or of any other stream type, the identiﬁcation page of the
primary stream of that type should be placed before the others.
After the ‘beginning of stream’ pages, the header pages of each of the logical
streams MUST be grouped together before any data pages occur.
After all the header pages have been placed, the data pages are multiplexed
together. They should be placed in the stream in increasing order by the time
equivalents of their granule position ﬁelds. This facilitates seeking while limiting
the buﬀering requirements of the playback demultiplexer.

---

## Page 165

Appendix B
VP3
B.1
VP3 Compatibility
This section lists all of the encoder and decoder issues that may aﬀect VP3
compatibly.
Each is described in more detail in the text itself.
This list is
provided merely for reference.
 Bitstream headers (Section 6).
– Identiﬁcation header (Section 6.2).
+ Non-multiple of 16 picture sizes.
+ Standardized color spaces.
+ Support for 4 : 4 : 4 and 4 : 2 : 2 pixel formats.
– Setup header
+ Loop ﬁlter limit values (Section 6.4.1).
+ Quantization parameters (Section 6.4.2).
+ Huﬀman tables (Section 6.4.4).
 Frame header format (Section 7.1).
 Extended long-run bit strings (Section 7.2.1).
 INTER MV FOUR handling of uncoded blocks (Section 7.5.2).
 Block-level qi values (Section 7.6).
 Zero-length EOB runs (Section 7.7.1).
 Unrestricted motion vector padding and the loop ﬁlter (Section 7.10.3).
149

---

## Page 166

150
APPENDIX B. VP3
B.2
Loop Filter Limit Values
The hard-coded loop ﬁlter limit values used in VP3 are deﬁned as follows:
LFLIMS = {30,
25,
20,
20,
15,
15,
14,
14,
13,
13,
12,
12,
11,
11,
10,
10,
9,
9,
8,
8,
7,
7,
7,
7,
6,
6,
6,
6,
5,
5,
5,
5,
4,
4,
4,
4,
3,
3,
3,
3,
2,
2,
2,
2,
2,
2,
2,
2,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0,
0}
B.3
Quantization Parameters
The hard-coded quantization parameters used by VP3 are deﬁned as follows:
ACSCALE = {500,
450,
400,
370,
340,
310,
285,
265,
245,
225,
210,
195,
185,
180,
170,
160,
150,
145,
135,
130,
125,
115,
110,
107,
100,
96,
93,
89,
85,
82,
75,
74,
70,
68,
64,
60,
57,
56,
52,
50,
49,
45,
44,
43,
40,
38,
37,
35,
33,
32,
30,
29,
28,
25,
24,
22,
21,
19,
18,
17,
15,
13,
12,
10}
DCSCALE = {220,
200,
190,
180,
170,
170,
160,
160,
150,
150,
140,
140,
130,
130,
120,
120,
110,
110,
100,
100,
90,
90,
90,
80,
80,
80,
70,
70,
70,
60,
60,
60,
60,
50,
50,
50,
50,
40,
40,
40,
40,
40,
30,
30,
30,
30,
30,
30,
30,
20,
20,
20,
20,
20,
20,
20,
20,
10,
10,
10,
10,
10,
10,
10}
VP3 deﬁnes only a single quantization range for each quantization type and
color plane, and the base matrix used is constant throughout the range. There
are three base matrices deﬁned. The ﬁrst is used for the Y ′ channel of INTRA
mode blocks, and the second for both the Cb and Cr channels of INTRA mode
blocks. The last is used for INTER mode blocks of all channels.

---

## Page 167

B.4. HUFFMAN TABLES
151
BMS = { {16,
11,
10,
16,
24,
40,
51,
61,
12,
12,
14,
19,
26,
58,
60,
55,
14,
13,
16,
24,
40,
57,
69,
56,
14,
17,
22,
29,
51,
87,
80,
62,
18,
22,
37,
58,
68,
109,
103,
77,
24,
35,
55,
64,
81,
104,
113,
92,
49,
64,
78,
87,
103,
121,
120,
101,
72,
92,
95,
98,
112,
100,
103,
99},
{17,
18,
24,
47,
99,
99,
99,
99,
18,
21,
26,
66,
99,
99,
99,
99,
24,
26,
56,
99,
99,
99,
99,
99,
47,
66,
99,
99,
99,
99,
99,
99,
99,
99,
99,
99,
99,
99,
99,
99,
99,
99,
99,
99,
99,
99,
99,
99,
99,
99,
99,
99,
99,
99,
99,
99,
99,
99,
99,
99,
99,
99,
99,
99},
{16,
16,
16,
20,
24,
28,
32,
40,
16,
16,
20,
24,
28,
32,
40,
48,
16,
20,
24,
28,
32,
40,
48,
64,
20,
24,
28,
32,
40,
48,
64,
64,
24,
28,
32,
40,
48,
64,
64,
64,
28,
32,
40,
48,
64,
64,
64,
96,
32,
40,
48,
64,
64,
64,
96,
128,
40,
48,
64,
64,
64,
96,
128,
128} }
The remaining parameters simply assign these matrices to the proper quant
ranges.
NQRS ={{1, 1, 1}, {1, 1, 1}}
QRSIZES ={{{1}, {1}, {1}}, {{1}, {1}, {1}}}
QRBMIS ={{{0, 0}, {1, 1}, {1, 1}}, {{2, 2}, {2, 2}, {2, 2}}}
B.4
Huﬀman Tables
The following tables contain the hard-coded Huﬀman codes used by VP3. There
are 80 tables in all, each with a Huﬀman code for all 32 token values. The tokens
are sorted by the most signiﬁcant bits of their Huﬀman code. This is the same
order in which they will be decoded from the setup header.

---

## Page 168

152
APPENDIX B. VP3
Huﬀman Code
Token Value
b000
20
b001
19
b01000
7
b010010
30
b0100110
1
b01001110
3
b010011110
28
b010011111000
26
b010011111001
8
b01001111101
6
b0100111111
29
b0101
14
b0110
12
b0111
17
b1000
13
b1001
21
b101000
24
b101001
23
b10101
16
b1011000
31
b10110010
25
b101100110
2
b1011001110
4
b10110011110
5
b10110011111
27
b101101
0
b10111
22
b1100
18
b11010
15
b11011
11
b1110
10
b1111
9
VP3.1 Huﬀman Table Number 0
Huﬀman Code
Token Value
b000
20
b001
19
b0100
11
b0101
12
b0110
14
b0111
17
b10000
0
b100010
7
b10001100
3
b1000110100000
29
b1000110100001
8
b100011010001
26
b10001101001
6
b10001101010
5
b10001101011
28
b100011011
25
b1000111
1
b1001
13
b1010
21
b10110
16
b10111
22
b1100
18
b1101
10
b1110
9
b11110
15
b1111100
30
b1111101
23
b1111110
24
b11111110
31
b1111111100
4
b1111111101
27
b111111111
2
VP3.1 Huﬀman Table Number 1

---

## Page 169

B.4. HUFFMAN TABLES
153
Huﬀman Code
Token Value
b000
20
b001
19
b0100
11
b0101
12
b0110
14
b0111
17
b100000
1
b1000010
30
b10000110
2
b10000111
3
b10001
16
b1001
21
b1010
13
b10110
0
b10111
22
b1100
18
b11010
15
b11011000
31
b1101100100
25
b11011001010
27
b11011001011
6
b11011001100
5
b110110011010
26
b11011001101100
29
b11011001101101
8
b1101100110111
28
b1101100111
4
b1101101
24
b1101110
7
b1101111
23
b1110
10
b1111
9
VP3.1 Huﬀman Table Number 2
Huﬀman Code
Token Value
b0000
0
b0001
17
b0010
14
b00110
21
b001110
7
b001111
23
b010
10
b011
9
b1000
11
b1001
12
b1010
20
b1011000
3
b101100100
25
b1011001010
6
b1011001011
5
b1011001100000
29
b1011001100001
8
b101100110001
28
b10110011001
26
b1011001101
27
b101100111
4
b101101
1
b10111
16
b1100
18
b1101
13
b1110
19
b1111000
22
b1111001
30
b1111010
24
b11110110
31
b11110111
2
b11111
15
VP3.1 Huﬀman Table Number 3

---

## Page 170

154
APPENDIX B. VP3
Huﬀman Code
Token Value
b0000
15
b000100000
5
b000100001
25
b00010001
22
b0001001
31
b000101
24
b000110
7
b000111000
27
b0001110010
6
b0001110011000
29
b0001110011001
8
b000111001101
28
b00011100111
26
b00011101
4
b0001111
2
b0010
17
b0011
0
b0100
14
b0101
11
b0110
12
b0111
19
b100
9
b101
10
b110000
21
b110001
23
b11001
16
b1101
18
b1110
13
b111100
1
b1111010
3
b1111011
30
b11111
20
VP3.1 Huﬀman Table Number 4
Huﬀman Code
Token Value
b0000
15
b00010
1
b000110
7
b000111
3
b0010
17
b0011
19
b0100
14
b0101
18
b01100
20
b011010000
27
b011010001
5
b0110100100000
29
b0110100100001
8
b011010010001
28
b01101001001
26
b0110100101
25
b0110100110
6
b0110100111
22
b0110101
21
b011011
23
b0111
12
b1000
11
b1001
0
b101
9
b110
10
b11100
16
b1110100
2
b1110101
30
b11101100
4
b11101101
31
b1110111
24
b1111
13
VP3.1 Huﬀman Table Number 5

---

## Page 171

B.4. HUFFMAN TABLES
155
Huﬀman Code
Token Value
b000
13
b0010
17
b0011
18
b010000
30
b010001
24
b010010
2
b010011000
27
b010011001
6
b01001101
21
b0100111
31
b0101
14
b01100
1
b011010
20
b011011
3
b01110
16
b01111
19
b1000
12
b1001
11
b1010
0
b101100
23
b1011010
7
b101101100
5
b1011011010
25
b1011011011000
8
b10110110110010
29
b10110110110011
22
b101101101101
28
b10110110111
26
b10110111
4
b10111
15
b110
10
b111
9
VP3.1 Huﬀman Table Number 6
Huﬀman Code
Token Value
b00
10
b01000
3
b01001
19
b010100
24
b0101010
7
b01010110
5
b010101110
21
b010101111
6
b01011
16
b0110
14
b011100
23
b011101
2
b01111
1
b1000
11
b1001
12
b1010000
20
b1010001
4
b1010010000
25
b101001000100
28
b1010010001010
8
b10100100010110
29
b10100100010111
22
b10100100011
26
b101001001
27
b10100101
31
b1010011
30
b10101
18
b10110
17
b10111
15
b1100
13
b1101
0
b111
9
VP3.1 Huﬀman Table Number 7

---

## Page 172

156
APPENDIX B. VP3
Huﬀman Code
Token Value
b00000
29
b00001
7
b0001
0
b0010
13
b001100
26
b001101
19
b00111
14
b0100
24
b0101
12
b0110
11
b011100
17
b011101
1
b01111
28
b100000
18
b100001
8
b10001
25
b1001000
20
b10010010
21
b10010011000
6
b10010011001
5
b1001001101
4
b100100111
22
b100101
15
b10011
31
b101
10
b110
9
b1110
23
b111100
27
b11110100
3
b11110101
2
b1111011
16
b11111
30
VP3.1 Huﬀman Table Number 8
Huﬀman Code
Token Value
b0000
30
b00010
7
b0001100000
6
b0001100001
5
b000110001
4
b00011001
22
b0001101
3
b000111
16
b0010
13
b0011
24
b010000
19
b010001
26
b01001
14
b0101
0
b0110
12
b0111
11
b1000000
2
b1000001
20
b100001
17
b10001
25
b100100
18
b100101
15
b10011
31
b101
10
b110
9
b1110
23
b111100
1
b11110100
21
b11110101
8
b1111011
29
b111110
28
b111111
27
VP3.1 Huﬀman Table Number 9

---

## Page 173

B.4. HUFFMAN TABLES
157
Huﬀman Code
Token Value
b0000000
22
b0000001
8
b000001
2
b00001
31
b0001
24
b001000
29
b001001
3
b00101
25
b00110
30
b00111
1
b0100
23
b010100
16
b010101
7
b010110
19
b010111
26
b0110
13
b0111
12
b1000
11
b10010
14
b1001100000
6
b1001100001
5
b100110001
4
b10011001
21
b1001101
20
b100111
17
b1010
0
b101100
28
b101101
18
b101110
27
b101111
15
b110
10
b111
9
VP3.1 Huﬀman Table Number 10
Huﬀman Code
Token Value
b000
0
b0010000
4
b0010001
21
b001001
30
b00101
15
b00110
25
b001110
29
b0011110
7
b0011111000
6
b0011111001
5
b001111101
22
b00111111
8
b0100
23
b010100
26
b010101
19
b010110
16
b010111
2
b0110
13
b01110
1
b01111
14
b1000
12
b1001
11
b1010000
20
b1010001
31
b101001
17
b101010
3
b101011
18
b101100
27
b101101
28
b10111
24
b110
10
b111
9
VP3.1 Huﬀman Table Number 11

---

## Page 174

158
APPENDIX B. VP3
Huﬀman Code
Token Value
b00
9
b010
0
b01100
14
b01101
3
b011100
26
b011101
18
b011110
17
b01111100
8
b01111101
21
b0111111
30
b1000
12
b1001
11
b101000
15
b10100100
7
b1010010100
6
b1010010101
5
b101001011
22
b1010011
4
b101010
28
b101011
27
b10110
24
b101110
25
b101111
2
b11000
1
b11001
23
b1101000
29
b1101001
19
b1101010
16
b11010110
31
b11010111
20
b11011
13
b111
10
VP3.1 Huﬀman Table Number 12
Huﬀman Code
Token Value
b00
9
b010
0
b01100
2
b01101
14
b01110
24
b011110
17
b0111110
29
b01111110
21
b01111111
5
b1000
12
b1001
11
b101000
28
b101001
4
b101010
15
b101011
27
b10110
23
b101110
25
b1011110000
6
b1011110001
22
b101111001
8
b10111101
30
b1011111
19
b11000
3
b1100100
16
b1100101
26
b110011000
7
b110011001
31
b11001101
20
b1100111
18
b11010
13
b11011
1
b111
10
VP3.1 Huﬀman Table Number 13

---

## Page 175

B.4. HUFFMAN TABLES
159
Huﬀman Code
Token Value
b00
9
b010
0
b0110
3
b0111
1
b1000
12
b1001
11
b10100
23
b101010
15
b10101100
30
b10101101
21
b101011100
7
b101011101
6
b101011110
31
b1010111110
22
b1010111111
8
b10110
2
b1011100
5
b1011101
19
b1011110
16
b1011111
26
b11000
13
b1100100
18
b11001010
29
b11001011
20
b110011
24
b110100
14
b1101010
17
b1101011
28
b110110
4
b1101110
25
b1101111
27
b111
10
VP3.1 Huﬀman Table Number 14
Huﬀman Code
Token Value
b00
10
b01
9
b1000
12
b1001
11
b101000
15
b101001
5
b101010000
30
b101010001
29
b10101001
28
b101010100000
22
b101010100001
8
b10101010001
7
b1010101001
31
b101010101
21
b10101011
26
b1010110
19
b1010111
16
b1011
3
b11000
2
b11001
4
b1101000
18
b1101001
24
b1101010
17
b11010110
6
b11010111
25
b11011
13
b111000
14
b11100100
27
b11100101
20
b1110011
23
b11101
1
b1111
0
VP3.1 Huﬀman Table Number 15

---

## Page 176

160
APPENDIX B. VP3
Huﬀman Code
Token Value
b0000
15
b0001
11
b0010
12
b0011
21
b01000
0
b0100100
26
b0100101
1
b010011
24
b01010
22
b01011
30
b0110
14
b0111
10
b1000
9
b1001
17
b1010
13
b10110
23
b1011100
28
b1011101
25
b10111100
27
b101111010
2
b10111101100
29
b1011110110100
5
b10111101101010
8
b10111101101011
6
b101111011011
4
b1011110111
3
b1011111
31
b1100
20
b1101
18
b11100
16
b11101
7
b1111
19
VP3.1 Huﬀman Table Number 16
Huﬀman Code
Token Value
b0000
15
b0001
7
b0010
11
b0011
12
b010000
1
b010001
31
b0100100
26
b01001010
27
b01001011
2
b010011
22
b0101
17
b0110
14
b01110
30
b01111
0
b1000
9
b1001
10
b1010
20
b1011
13
b110000
24
b1100010
25
b11000110
3
b110001110000
6
b110001110001
5
b110001110010
29
b110001110011
8
b1100011101
4
b110001111
28
b11001
21
b1101
18
b11100
16
b11101
23
b1111
19
VP3.1 Huﬀman Table Number 17

---

## Page 177

B.4. HUFFMAN TABLES
161
Huﬀman Code
Token Value
b00000
21
b000010
25
b000011
1
b0001
15
b0010
20
b0011
7
b0100
11
b0101
12
b0110
17
b0111
14
b1000000
3
b1000001
22
b100001
31
b100010
24
b10001100
27
b10001101
2
b100011100000
6
b1000111000010
29
b1000111000011
8
b10001110001
5
b1000111001
4
b100011101
28
b10001111
26
b1001
10
b1010
9
b1011
19
b1100
18
b11010
30
b11011
0
b1110
13
b11110
16
b11111
23
VP3.1 Huﬀman Table Number 18
Huﬀman Code
Token Value
b0000000
28
b0000001
27
b00000100
22
b000001010000
8
b000001010001
6
b00000101001
29
b0000010101
5
b000001011
4
b0000011
2
b000010
21
b000011
1
b0001
15
b0010
23
b0011
7
b0100
11
b0101
17
b0110
12
b0111
19
b100000
25
b1000010
26
b1000011
3
b10001
20
b1001
18
b1010
14
b101100
31
b101101
24
b10111
30
b1100
10
b1101
9
b1110
13
b11110
16
b11111
0
VP3.1 Huﬀman Table Number 19

---

## Page 178

162
APPENDIX B. VP3
Huﬀman Code
Token Value
b0000
30
b0001
15
b0010
17
b0011
0
b0100
7
b0101
18
b0110
23
b0111000
21
b0111001
27
b0111010
2
b0111011
26
b011110
25
b011111
1
b1000
12
b1001
11
b1010
14
b10110
16
b10111000
28
b1011100100
5
b10111001010
22
b1011100101100
8
b1011100101101
6
b101110010111
29
b101110011
4
b1011101
3
b101111
20
b1100
13
b11010
19
b110110
31
b110111
24
b1110
10
b1111
9
VP3.1 Huﬀman Table Number 20
Huﬀman Code
Token Value
b000
9
b0010
30
b001100
3
b0011010
28
b0011011
27
b00111
31
b0100
7
b01010
24
b01011
19
b0110
0
b0111
12
b1000
11
b1001
14
b1010
23
b10110
16
b101110000
21
b10111000100
6
b1011100010100
22
b1011100010101
8
b101110001011
29
b1011100011
5
b10111001
4
b1011101
2
b1011110
20
b1011111
26
b1100
13
b11010
18
b110110
25
b110111
1
b11100
17
b11101
15
b1111
10
VP3.1 Huﬀman Table Number 21

---

## Page 179

B.4. HUFFMAN TABLES
163
Huﬀman Code
Token Value
b000
10
b001
9
b01000
18
b01001
25
b010100
26
b010101
19
b01011
1
b01100
31
b01101
17
b0111
14
b10000
24
b100010
3
b1000110000
6
b100011000100
8
b1000110001010
22
b1000110001011
21
b10001100011
29
b100011001
5
b10001101
20
b1000111
27
b1001
12
b1010
11
b1011
13
b1100
0
b1101
23
b11100
15
b11101
7
b11110000
4
b11110001
28
b1111001
2
b111101
16
b11111
30
VP3.1 Huﬀman Table Number 22
Huﬀman Code
Token Value
b000
0
b001
10
b010
9
b01100
3
b011010
27
b011011
16
b0111
13
b10000
31
b100010
17
b1000110
4
b1000111
28
b1001
11
b1010
12
b10110
24
b10111
7
b11000
25
b110010
26
b110011
2
b11010
1
b11011
14
b1110
23
b11110000
19
b1111000100000
20
b1111000100001
8
b1111000100010
22
b1111000100011
21
b11110001001
29
b1111000101
6
b111100011
5
b1111001
18
b111101
15
b11111
30
VP3.1 Huﬀman Table Number 23

---

## Page 180

164
APPENDIX B. VP3
Huﬀman Code
Token Value
b000
9
b0010
24
b0011
7
b01000
17
b010010
19
b0100110
20
b01001110
2
b010011110
3
b01001111100
4
b0100111110100
6
b0100111110101
5
b010011111011
22
b0100111111
21
b0101
14
b01100
25
b01101
15
b011100
27
b011101
29
b01111
28
b1000
30
b1001
13
b1010
12
b1011
11
b1100000
8
b1100001
1
b110001
16
b11001
31
b1101
23
b111000
18
b111001
26
b11101
0
b1111
10
VP3.1 Huﬀman Table Number 24
Huﬀman Code
Token Value
b000
10
b001
9
b010000
27
b0100010
20
b010001100000
6
b010001100001
5
b01000110001
22
b0100011001
4
b010001101
21
b01000111
8
b01001
25
b0101
14
b011000
19
b011001
1
b01101
15
b0111
0
b1000
30
b1001
13
b10100
31
b1010100
29
b10101010
3
b10101011
2
b101011
26
b1011
12
b1100
11
b110100
28
b110101
16
b11011
7
b1110
23
b111100
18
b111101
17
b11111
24
VP3.1 Huﬀman Table Number 25

---

## Page 181

B.4. HUFFMAN TABLES
165
Huﬀman Code
Token Value
b000
9
b001000
2
b0010010
8
b001001100000
22
b001001100001
6
b00100110001
5
b0010011001
21
b001001101
4
b00100111
20
b00101
1
b00110
15
b00111
26
b0100
24
b010100
29
b010101
18
b01011
28
b0110
13
b011100
16
b011101
27
b01111
25
b1000
30
b1001
12
b1010
11
b101100
17
b1011010
19
b1011011
3
b10111
31
b1100
0
b11010
7
b11011
14
b1110
23
b1111
10
VP3.1 Huﬀman Table Number 26
Huﬀman Code
Token Value
b0000
12
b0001
11
b001
10
b010
9
b011
23
b10000
7
b10001
14
b100100
3
b10010100000
6
b100101000010
22
b100101000011
21
b1001010001
5
b100101001
20
b10010101
4
b1001011
18
b10011
1
b1010
24
b101100
15
b101101
29
b10111
28
b11000
26
b11001000
8
b11001001
19
b1100101
16
b110011
27
b11010
13
b11011
30
b11100
25
b1110100
17
b1110101
2
b111011
31
b1111
0
VP3.1 Huﬀman Table Number 27

---

## Page 182

166
APPENDIX B. VP3
Huﬀman Code
Token Value
b000
10
b001
9
b0100
25
b0101000
4
b0101001
18
b0101010
16
b0101011
17
b01011
28
b011
0
b100
23
b1010
24
b101100
29
b101101
2
b10111
13
b11000
26
b11001
30
b11010
1
b110110
27
b110111
7
b111000
3
b11100100
8
b1110010100000
22
b1110010100001
21
b111001010001
6
b11100101001
20
b1110010101
5
b111001011
19
b1110011
15
b111010
14
b111011
31
b11110
12
b11111
11
VP3.1 Huﬀman Table Number 28
Huﬀman Code
Token Value
b000
10
b001
9
b0100
1
b01010
13
b010110
29
b010111
7
b011
23
b100
0
b1010
24
b10110
30
b10111
3
b11000
28
b110010
14
b110011
31
b11010
12
b11011
11
b11100
26
b1110100
15
b1110101
4
b111011
27
b11110
25
b11111000
16
b11111001
17
b111110100000
20
b1111101000010
22
b1111101000011
21
b11111010001
6
b1111101001
19
b111110101
5
b111110110
8
b111110111
18
b111111
2
VP3.1 Huﬀman Table Number 29

---

## Page 183

B.4. HUFFMAN TABLES
167
Huﬀman Code
Token Value
b000
10
b001
9
b010
23
b0110000000
19
b01100000010
20
b011000000110
22
b011000000111
21
b011000001
18
b01100001
17
b0110001
5
b011001
14
b01101
30
b0111
1
b100
0
b1010
24
b10110
28
b1011100
15
b10111010
16
b101110110
8
b101110111
6
b101111
31
b11000
2
b11001
12
b11010
11
b110110
4
b110111
27
b11100
26
b111010
13
b1110110
29
b1110111
7
b11110
3
b11111
25
VP3.1 Huﬀman Table Number 30
Huﬀman Code
Token Value
b000
0
b001
10
b010
9
b0110
24
b0111000
29
b0111001000
17
b0111001001000
22
b0111001001001
21
b0111001001010
18
b01110010010110
20
b01110010010111
19
b01110010011
8
b011100101
16
b01110011
15
b011101
27
b01111
12
b100
23
b1010
1
b10110
11
b101110
13
b1011110
7
b1011111
14
b1100
3
b11010
2
b11011
26
b111000
28
b111001
5
b11101
4
b1111000
6
b1111001
31
b111101
30
b11111
25
VP3.1 Huﬀman Table Number 31

---

## Page 184

168
APPENDIX B. VP3
Huﬀman Code
Token Value
b00000
24
b000010
28
b000011
21
b0001
23
b0010
7
b0011
15
b0100
17
b010100
25
b01010100
2
b010101010
22
b010101011
8
b0101011
1
b01011
0
b0110
19
b0111
11
b1000
12
b1001
9
b1010
10
b1011
18
b1100
14
b11010
20
b1101100
26
b11011010
27
b110110110000
6
b110110110001
5
b11011011001
4
b1101101101
29
b110110111
3
b110111
31
b11100
30
b11101
16
b1111
13
VP3.1 Huﬀman Table Number 32
Huﬀman Code
Token Value
b0000
30
b000100
1
b000101
28
b00011
24
b0010
17
b0011
15
b0100
18
b0101
23
b01100
31
b0110100
27
b01101010
3
b01101011
21
b011011
25
b0111
7
b1000
12
b1001
11
b1010
14
b101100
20
b1011010
26
b10110110
2
b1011011100000
6
b1011011100001
5
b101101110001
22
b10110111001
4
b1011011101
29
b101101111
8
b10111
16
b1100
9
b1101
10
b11100
19
b11101
0
b1111
13
VP3.1 Huﬀman Table Number 33

---

## Page 185

B.4. HUFFMAN TABLES
169
Huﬀman Code
Token Value
b000
13
b0010
15
b0011
0
b0100
30
b01010
24
b01011
31
b0110
23
b0111
7
b1000000
20
b10000010
8
b1000001100
4
b100000110100
5
b1000001101010
22
b1000001101011
6
b10000011011
21
b100000111
29
b100001
28
b10001
16
b1001
14
b10100000
3
b10100001
2
b1010001
27
b101001
25
b10101
18
b1011
11
b1100
12
b1101
10
b1110
9
b11110
17
b111110
19
b1111110
26
b1111111
1
VP3.1 Huﬀman Table Number 34
Huﬀman Code
Token Value
b0000
30
b00010
18
b00011
16
b001
9
b010
10
b01100
31
b011010
26
b011011
1
b0111
0
b1000
14
b10010
17
b10011
24
b1010
23
b1011
11
b1100
12
b1101
13
b11100
15
b11101000000
5
b111010000010
6
b1110100000110
22
b1110100000111
21
b1110100001
4
b111010001
20
b11101001
3
b1110101
19
b111011
25
b111100
28
b1111010
27
b11110110
2
b111101110
29
b111101111
8
b11111
7
VP3.1 Huﬀman Table Number 35

---

## Page 186

170
APPENDIX B. VP3
Huﬀman Code
Token Value
b0000
30
b0001
14
b001
9
b010
10
b01100
25
b011010
18
b0110110000
20
b01101100010
5
b011011000110
6
b0110110001110
22
b0110110001111
21
b011011001
4
b01101101
29
b0110111
3
b01110
31
b01111
15
b100000
27
b1000010
2
b10000110
8
b10000111
19
b10001
28
b100100
26
b100101
16
b10011
24
b1010
13
b1011
12
b1100
11
b1101
0
b1110
23
b111100
17
b111101
1
b11111
7
VP3.1 Huﬀman Table Number 36
Huﬀman Code
Token Value
b000
0
b0010
30
b00110
31
b00111
25
b010
9
b011
10
b1000
13
b10010
1
b10011
7
b101000
27
b10100100
29
b10100101
8
b1010011000
19
b1010011001000
20
b1010011001001
6
b1010011001010
22
b1010011001011
21
b10100110011
5
b101001101
4
b10100111
18
b101010
26
b101011
15
b1011
11
b1100
12
b11010
14
b11011
28
b11100
24
b1110100
17
b1110101
16
b1110110
2
b1110111
3
b1111
23
VP3.1 Huﬀman Table Number 37

---

## Page 187

B.4. HUFFMAN TABLES
171
Huﬀman Code
Token Value
b000
23
b00100
7
b00101
31
b00110
14
b00111
25
b010
0
b011
10
b100
9
b101000000
18
b101000001000
22
b101000001001
21
b101000001010
6
b1010000010110
20
b1010000010111
19
b1010000011
5
b10100001
8
b10100010
17
b10100011
16
b101001
27
b101010
26
b101011
2
b1011
11
b1100
12
b11010
1
b11011
30
b11100
28
b111010
3
b11101100
29
b11101101
4
b1110111
15
b11110
24
b11111
13
VP3.1 Huﬀman Table Number 38
Huﬀman Code
Token Value
b000
23
b0010
1
b00110
13
b00111000
15
b001110010
8
b001110011000
18
b0011100110010
20
b0011100110011
19
b0011100110100
22
b0011100110101
21
b001110011011
17
b00111001110
16
b00111001111
6
b0011101
7
b001111
27
b010
0
b0110
11
b0111
12
b100
9
b101
10
b11000
2
b11001
30
b110100
26
b110101
4
b11011
25
b111000
31
b11100100
5
b11100101
29
b1110011
14
b11101
3
b11110
28
b11111
24
VP3.1 Huﬀman Table Number 39

---

## Page 188

172
APPENDIX B. VP3
Huﬀman Code
Token Value
b000
10
b001
9
b01000
26
b01001
15
b0101
24
b0110
7
b011100
16
b011101
17
b01111
25
b1000
30
b1001
13
b1010000
1
b1010001
8
b101001
27
b10101
31
b10110
0
b10111000
19
b101110010
2
b1011100110000
22
b1011100110001
21
b1011100110010
4
b10111001100110
6
b10111001100111
5
b10111001101
20
b1011100111
3
b1011101
18
b101111
29
b1100
12
b1101
11
b11100
14
b11101
28
b1111
23
VP3.1 Huﬀman Table Number 40
Huﬀman Code
Token Value
b000
9
b001
23
b0100
28
b0101
24
b0110
13
b0111
30
b1000000
2
b1000001
18
b100001
1
b10001
14
b1001
0
b10100
25
b101010
15
b1010110000
4
b1010110001000
6
b1010110001001
5
b1010110001010
22
b1010110001011
21
b10101100011
20
b101011001
19
b10101101
3
b1010111
16
b10110
31
b101110
27
b1011110
17
b1011111
8
b1100
12
b1101
11
b11100
7
b111010
29
b111011
26
b1111
10
VP3.1 Huﬀman Table Number 41

---

## Page 189

B.4. HUFFMAN TABLES
173
Huﬀman Code
Token Value
b000
9
b0010
30
b0011000
17
b001100100
4
b001100101000
22
b001100101001
21
b001100101010
5
b0011001010110
20
b0011001010111
6
b0011001011
19
b00110011
18
b001101
8
b00111
1
b010
23
b0110
24
b01110
26
b01111
29
b10000
31
b1000100
16
b1000101
3
b1000110
2
b1000111
15
b1001
28
b1010
11
b1011
12
b11000
7
b11001
25
b11010
13
b110110
14
b110111
27
b1110
0
b1111
10
VP3.1 Huﬀman Table Number 42
Huﬀman Code
Token Value
b000
23
b001
10
b010
9
b011
0
b10000
27
b100010
14
b100011
2
b1001
24
b10100
13
b10101
26
b10110
30
b10111
29
b11000
1
b1100100
15
b110010100
4
b11001010100
19
b1100101010100
22
b1100101010101
21
b1100101010110
5
b11001010101110
20
b11001010101111
6
b1100101011
18
b110010110
17
b110010111
16
b110011
31
b1101
28
b11100
25
b111010
7
b1110110
8
b1110111
3
b11110
12
b11111
11
VP3.1 Huﬀman Table Number 43

---

## Page 190

174
APPENDIX B. VP3
Huﬀman Code
Token Value
b000
23
b001
10
b010
9
b0110
1
b0111
24
b10000
3
b10001
26
b1001000
4
b10010010
15
b100100110
16
b1001001110
17
b10010011110
18
b10010011111000
22
b10010011111001
21
b10010011111010
6
b100100111110110
20
b100100111110111
19
b100100111111
5
b100101
31
b10011
29
b101
0
b11000
25
b110010
7
b1100110
14
b1100111
8
b110100
13
b110101
30
b11011
11
b1110
28
b11110
12
b111110
2
b111111
27
VP3.1 Huﬀman Table Number 44
Huﬀman Code
Token Value
b000
28
b001
9
b010
10
b0110
24
b011100
4
b01110100
15
b011101010
5
b0111010110
16
b0111010111000
22
b0111010111001
21
b01110101110100
18
b01110101110101
6
b01110101110110
20
b01110101110111
19
b01110101111
17
b0111011
14
b011110
7
b011111
13
b1000
1
b10010
2
b10011
25
b101
0
b11000
29
b110010
30
b1100110
8
b1100111
31
b11010
12
b11011
11
b11100
3
b111010
27
b111011
26
b1111
23
VP3.1 Huﬀman Table Number 45

---

## Page 191

B.4. HUFFMAN TABLES
175
Huﬀman Code
Token Value
b000
28
b001
10
b010
9
b011000
13
b011001
30
b01101
4
b01110
25
b01111
29
b100
0
b1010
1
b10110
12
b10111
11
b1100
3
b110100000
15
b11010000100
6
b110100001010
18
b1101000010110
20
b1101000010111
19
b11010000110
16
b1101000011100
22
b1101000011101
21
b110100001111
17
b11010001
14
b1101001
31
b110101
26
b11011
2
b111000
27
b1110010
7
b11100110
5
b11100111
8
b11101
24
b1111
23
VP3.1 Huﬀman Table Number 46
Huﬀman Code
Token Value
b000
3
b00100
25
b001010000
14
b001010001
6
b0010100100
15
b001010010100
16
b0010100101010
18
b0010100101011
17
b0010100101100
20
b0010100101101
19
b0010100101110
22
b0010100101111
21
b001010011
8
b0010101
13
b001011
29
b0011
4
b010
10
b011
0
b100
9
b101000
26
b101001
27
b10101
12
b10110
11
b101110
5
b10111100
7
b10111101
31
b1011111
30
b1100
1
b11010
24
b11011
2
b1110
23
b1111
28
VP3.1 Huﬀman Table Number 47

---

## Page 192

176
APPENDIX B. VP3
Huﬀman Code
Token Value
b000
9
b001000
29
b001001
1
b0010100
20
b0010101
8
b001011
26
b0011
0
b0100
7
b01010
16
b01011
24
b01100
31
b01101
18
b0111
30
b1000
23
b1001
14
b10100
17
b101010
19
b101011
25
b1011
11
b1100
12
b11010000
2
b1101000100
4
b110100010100
5
b1101000101010
22
b1101000101011
6
b11010001011
21
b110100011
3
b1101001
27
b110101
28
b11011
15
b1110
13
b1111
10
VP3.1 Huﬀman Table Number 48
Huﬀman Code
Token Value
b000
10
b001
9
b0100
14
b010100
18
b010101
27
b01011
28
b0110000
3
b011000100000
6
b011000100001
5
b011000100010
22
b011000100011
21
b0110001001
20
b011000101
4
b01100011
19
b0110010
2
b0110011
8
b01101
15
b0111
30
b10000
31
b100010
26
b100011
29
b10010
24
b100110
16
b100111
17
b1010
0
b1011
23
b1100
13
b1101
12
b1110
11
b111100
1
b111101
25
b11111
7
VP3.1 Huﬀman Table Number 49

---

## Page 193

B.4. HUFFMAN TABLES
177
Huﬀman Code
Token Value
b000
10
b001
9
b010000
3
b01000100
4
b0100010100
5
b010001010100
20
b010001010101
6
b010001010110
22
b010001010111
21
b010001011
19
b0100011
8
b01001
15
b01010
25
b010110
17
b010111
16
b01100
1
b01101
28
b0111
30
b100000
27
b1000010
18
b1000011
2
b10001
31
b1001
13
b101000
29
b101001
26
b10101
24
b1011
23
b11000
7
b11001
14
b1101
12
b1110
11
b1111
0
VP3.1 Huﬀman Table Number 50
Huﬀman Code
Token Value
b0000000
8
b0000001
17
b000001
15
b00001
31
b00010
7
b00011
25
b001
0
b010
9
b011
10
b1000
13
b10010
14
b10011
28
b10100000
4
b10100001000
19
b1010000100100
20
b1010000100101
6
b1010000100110
22
b1010000100111
21
b1010000101
5
b101000011
18
b1010001
16
b101001
2
b101010
3
b101011
27
b1011
12
b1100
11
b11010
1
b110110
29
b110111
26
b11100
24
b11101
30
b1111
23
VP3.1 Huﬀman Table Number 51

---

## Page 194

178
APPENDIX B. VP3
Huﬀman Code
Token Value
b000
23
b00100
26
b00101000
17
b0010100100
18
b00101001010
6
b0010100101100
20
b0010100101101
19
b0010100101110
22
b0010100101111
21
b001010011
5
b00101010
8
b00101011
16
b0010110
4
b0010111
15
b00110
3
b00111
25
b010
9
b011
10
b100
0
b10100
28
b10101
30
b1011
11
b1100
12
b110100
7
b110101
27
b110110
29
b110111
14
b11100
13
b11101
24
b111100
31
b111101
2
b11111
1
VP3.1 Huﬀman Table Number 52
Huﬀman Code
Token Value
b000
23
b001000
7
b001001
4
b00101
30
b00110
25
b00111
2
b010
10
b011
9
b100
0
b1010
1
b101100
29
b101101
31
b10111
13
b1100
12
b1101
11
b111000
27
b111001
26
b11101
3
b11110
24
b111110000
8
b1111100010000
22
b1111100010001
21
b1111100010010
18
b11111000100110
20
b11111000100111
19
b11111000101
17
b11111000110
16
b11111000111
6
b111110010
15
b111110011
5
b1111101
14
b111111
28
VP3.1 Huﬀman Table Number 53

---

## Page 195

B.4. HUFFMAN TABLES
179
Huﬀman Code
Token Value
b000
23
b001000
31
b0010010
7
b00100110
14
b0010011100000
20
b0010011100001
19
b0010011100010
22
b0010011100011
21
b0010011100100
16
b0010011100101
8
b0010011100110
18
b0010011100111
17
b0010011101
15
b001001111
6
b00101
4
b0011
3
b010
0
b01100
25
b0110100
29
b0110101
5
b011011
30
b0111
1
b100
10
b101
9
b11000
2
b110010
28
b110011
13
b1101
11
b1110
12
b111100
27
b111101
26
b11111
24
VP3.1 Huﬀman Table Number 54
Huﬀman Code
Token Value
b000
0
b0010
4
b00110
24
b00111
5
b0100
1
b01010
25
b0101100
26
b0101101
31
b010111
27
b011
23
b100
10
b101
9
b1100
12
b1101
11
b11100
2
b11101000
7
b1110100100
30
b1110100101000
22
b1110100101001
21
b1110100101010
8
b11101001010110
16
b11101001010111
15
b111010010110
14
b11101001011100
18
b11101001011101
17
b11101001011110
20
b11101001011111
19
b111010011
29
b1110101
6
b1110110
28
b1110111
13
b1111
3
VP3.1 Huﬀman Table Number 55

---

## Page 196

180
APPENDIX B. VP3
Huﬀman Code
Token Value
b00000
26
b00001
29
b0001
24
b001
9
b010
10
b0110
30
b0111
13
b100000
8
b100001000000
22
b100001000001
21
b100001000010
5
b1000010000110
20
b1000010000111
6
b1000010001
4
b100001001
19
b10000101
3
b1000011
17
b10001
25
b100100
1
b100101
15
b10011
14
b1010
0
b10110
31
b101110
27
b1011110
16
b10111110
18
b10111111
2
b11000
7
b11001
28
b1101
12
b1110
11
b1111
23
VP3.1 Huﬀman Table Number 56
Huﬀman Code
Token Value
b000
9
b001
10
b010
0
b0110
24
b01110
26
b01111
1
b1000
28
b10010
7
b10011
25
b1010
11
b1011
12
b1100000
15
b1100001
3
b110001
14
b11001
30
b11010
13
b110110
8
b11011100
16
b1101110100
4
b1101110101000
5
b11011101010010
20
b11011101010011
6
b11011101010100
22
b11011101010101
21
b1101110101011
19
b11011101011
18
b110111011
17
b1101111
2
b1110
23
b11110
29
b111110
27
b111111
31
VP3.1 Huﬀman Table Number 57

---

## Page 197

B.4. HUFFMAN TABLES
181
Huﬀman Code
Token Value
b000
9
b001
10
b01000
27
b01001
30
b01010
26
b01011
13
b011
0
b1000
29
b100100
3
b100101
2
b10011
25
b1010
12
b1011
11
b1100
28
b1101
23
b11100
1
b111010
31
b11101100
15
b111011010
4
b1110110110
16
b11101101110
17
b11101101111000
22
b11101101111001
21
b1110110111101
5
b11101101111100
6
b111011011111010
20
b111011011111011
19
b1110110111111
18
b1110111
14
b111100
7
b111101
8
b11111
24
VP3.1 Huﬀman Table Number 58
Huﬀman Code
Token Value
b0000
12
b0001
11
b00100
2
b00101
26
b0011
1
b010
9
b011
10
b10000
3
b100010
30
b1000110
14
b100011100
15
b1000111010000
18
b1000111010001
6
b1000111010010
20
b1000111010011
19
b10001110101
5
b1000111011000
22
b1000111011001
21
b100011101101
17
b10001110111
16
b10001111
4
b10010
25
b100110
13
b100111
8
b101
0
b1100
28
b1101
23
b1110
29
b1111000
31
b1111001
7
b111101
27
b11111
24
VP3.1 Huﬀman Table Number 59

---

## Page 198

182
APPENDIX B. VP3
Huﬀman Code
Token Value
b0000
3
b00010
25
b000110
4
b0001110
30
b0001111
7
b001
29
b010
10
b011
9
b1000
23
b1001
28
b101
0
b1100
1
b110100
8
b110101
27
b11011
2
b11100
24
b11101
12
b11110
11
b111110000
14
b1111100010
5
b11111000110
15
b11111000111000
20
b11111000111001
19
b11111000111010
22
b11111000111011
21
b11111000111100
16
b11111000111101
6
b11111000111110
18
b11111000111111
17
b11111001
31
b1111101
13
b111111
26
VP3.1 Huﬀman Table Number 60
Huﬀman Code
Token Value
b0000
23
b0001
2
b001
29
b0100000
13
b01000010
31
b01000011
30
b010001
27
b01001
24
b0101
28
b01100
12
b01101
11
b011100000
5
b0111000010
14
b0111000011000
18
b0111000011001
17
b0111000011010
20
b0111000011011
19
b0111000011100
22
b0111000011101
21
b0111000011110
6
b01110000111110
16
b01110000111111
15
b01110001
7
b0111001
8
b011101
25
b011110
4
b011111
26
b100
0
b1010
3
b1011
1
b110
10
b111
9
VP3.1 Huﬀman Table Number 61

---

## Page 199

B.4. HUFFMAN TABLES
183
Huﬀman Code
Token Value
b00
9
b010
3
b01100
23
b011010
27
b011011
26
b0111
2
b100
0
b10100
4
b101010
24
b101011
12
b101100
11
b1011010
25
b101101100
5
b1011011010000
14
b1011011010001
6
b1011011010010
16
b1011011010011
15
b10110110101
31
b1011011011000
22
b1011011011001
21
b10110110110100
18
b10110110110101
17
b10110110110110
20
b10110110110111
19
b10110110111
30
b101101110
8
b1011011110
13
b1011011111
7
b10111
28
b1100
29
b1101
1
b111
10
VP3.1 Huﬀman Table Number 62
Huﬀman Code
Token Value
b00
10
b01
9
b10
0
b1100
3
b1101000
12
b1101001
11
b110101000
24
b110101001
23
b11010101
27
b110101100
5
b1101011010
25
b1101011011000
6
b11010110110010
8
b11010110110011
7
b11010110110100
22
b11010110110101
21
b11010110110110
31
b11010110110111
30
b11010110111000
18
b11010110111001
17
b11010110111010
20
b11010110111011
19
b11010110111100
14
b11010110111101
13
b11010110111110
16
b11010110111111
15
b11010111
26
b11011
29
b11100
2
b111010
28
b111011
4
b1111
1
VP3.1 Huﬀman Table Number 63

---

## Page 200

184
APPENDIX B. VP3
Huﬀman Code
Token Value
b000
0
b0010
28
b0011
13
b010
9
b011
10
b10000
1
b10001
14
b10010
25
b10011
31
b10100
7
b1010100
16
b101010100
4
b101010101000
6
b1010101010010
20
b1010101010011
19
b1010101010100
22
b1010101010101
21
b101010101011
5
b1010101011
18
b10101011
17
b101011
27
b1011
12
b1100
11
b1101
23
b1110000
8
b1110001
3
b1110010
2
b1110011
15
b11101
30
b11110
24
b111110
26
b111111
29
VP3.1 Huﬀman Table Number 64
Huﬀman Code
Token Value
b00000
26
b00001
31
b00010
7
b0001100
4
b000110100000
22
b000110100001
21
b0001101000100
18
b0001101000101
6
b0001101000110
20
b0001101000111
19
b0001101001
5
b0001101010
17
b0001101011
16
b00011011
15
b000111
14
b001
10
b010
9
b011
0
b1000
28
b10010
25
b10011
30
b101000
8
b101001
2
b10101
13
b1011
23
b1100
12
b11010
24
b11011
29
b1110
11
b111100
27
b111101
3
b11111
1
VP3.1 Huﬀman Table Number 65

---

## Page 201

B.4. HUFFMAN TABLES
185
Huﬀman Code
Token Value
b000
9
b001
10
b0100
1
b0101
29
b01100
13
b01101
25
b0111
28
b100
0
b10100
3
b101010
8
b1010110
4
b101011100
5
b1010111010000
20
b1010111010001
19
b1010111010010
22
b1010111010011
21
b1010111010100
16
b1010111010101
6
b1010111010110
18
b1010111010111
17
b1010111011
15
b10101111
14
b1011
23
b110000
31
b110001
27
b11001
24
b1101
12
b1110
11
b111100
7
b111101
30
b111110
26
b111111
2
VP3.1 Huﬀman Table Number 66
Huﬀman Code
Token Value
b0000
3
b000100000000
18
b000100000001
17
b000100000010
20
b000100000011
19
b000100000100
22
b000100000101
21
b000100000110
6
b0001000001110
16
b0001000001111
15
b000100001
14
b00010001
5
b0001001
31
b0001010
7
b0001011
30
b00011
25
b0010
12
b0011
11
b010
9
b011
10
b1000
1
b1001
28
b101
0
b1100
23
b11010
2
b110110
4
b1101110
8
b1101111
13
b1110
29
b11110
24
b111110
26
b111111
27
VP3.1 Huﬀman Table Number 67

---

## Page 202

186
APPENDIX B. VP3
Huﬀman Code
Token Value
b000
29
b00100
25
b0010100
8
b00101010
13
b0010101100
31
b0010101101
6
b0010101110000
18
b0010101110001
17
b0010101110010
20
b0010101110011
19
b0010101110100
22
b0010101110101
21
b0010101110110
14
b00101011101110
16
b00101011101111
15
b0010101111
7
b001011
27
b0011
23
b010
0
b011
10
b100
9
b1010
28
b10110
24
b10111
12
b1100
3
b11010
11
b110110
26
b1101110
5
b1101111
30
b1110
1
b11110
2
b11111
4
VP3.1 Huﬀman Table Number 68
Huﬀman Code
Token Value
b000
23
b001
3
b0100
4
b0101
1
b011
2
b100
0
b101000
24
b101001000
26
b1010010010000
17
b1010010010001
16
b1010010010010
19
b1010010010011
18
b1010010010100
13
b1010010010101
7
b1010010010110
15
b1010010010111
14
b10100100110
6
b101001001110
30
b10100100111100
21
b10100100111101
20
b10100100111110
31
b10100100111111
22
b10100101
25
b10100110
8
b10100111
27
b10101
29
b101100
12
b101101
11
b101110
28
b101111
5
b110
10
b111
9
VP3.1 Huﬀman Table Number 69

---

## Page 203

B.4. HUFFMAN TABLES
187
Huﬀman Code
Token Value
b000
23
b001
3
b0100
4
b0101
1
b011
2
b100
0
b101000
24
b101001000
26
b1010010010000
17
b1010010010001
16
b1010010010010
19
b1010010010011
18
b1010010010100
13
b1010010010101
7
b1010010010110
15
b1010010010111
14
b10100100110
6
b101001001110
30
b10100100111100
21
b10100100111101
20
b10100100111110
31
b10100100111111
22
b10100101
25
b10100110
8
b10100111
27
b10101
29
b101100
12
b101101
11
b101110
28
b101111
5
b110
10
b111
9
VP3.1 Huﬀman Table Number 70
Huﬀman Code
Token Value
b000
23
b001
3
b0100
4
b0101
1
b011
2
b100
0
b101000
24
b101001000
26
b1010010010000
17
b1010010010001
16
b1010010010010
19
b1010010010011
18
b1010010010100
13
b1010010010101
7
b1010010010110
15
b1010010010111
14
b10100100110
6
b101001001110
30
b10100100111100
21
b10100100111101
20
b10100100111110
31
b10100100111111
22
b10100101
25
b10100110
8
b10100111
27
b10101
29
b101100
12
b101101
11
b101110
28
b101111
5
b110
10
b111
9
VP3.1 Huﬀman Table Number 71

---

## Page 204

188
APPENDIX B. VP3
Huﬀman Code
Token Value
b000
10
b001
9
b0100
24
b01010
7
b01011
26
b011
0
b100000
2
b1000010
15
b100001100000
6
b1000011000010
20
b1000011000011
19
b1000011000100
22
b1000011000101
21
b100001100011
5
b1000011001
18
b100001101
4
b100001110
17
b100001111
16
b10001
1
b1001
28
b1010
12
b1011
11
b11000
13
b11001
25
b11010
30
b11011
29
b111000
14
b111001
27
b1110100
3
b1110101
8
b111011
31
b1111
23
VP3.1 Huﬀman Table Number 72
Huﬀman Code
Token Value
b00000
13
b00001
3
b0001
1
b001
10
b010
9
b0110
29
b01110
25
b011110
31
b011111
8
b1000
12
b1001
11
b101
0
b1100
28
b1101
23
b1110000
14
b11100010
4
b1110001100
16
b11100011010
17
b11100011011000
18
b11100011011001
6
b11100011011010
20
b11100011011011
19
b11100011011100
22
b11100011011101
21
b1110001101111
5
b111000111
15
b111001
7
b11101
24
b111100
27
b111101
30
b111110
2
b111111
26
VP3.1 Huﬀman Table Number 73

---

## Page 205

B.4. HUFFMAN TABLES
189
Huﬀman Code
Token Value
b000000
31
b000001
7
b00001
25
b0001
28
b001
9
b010
10
b0110
12
b0111
11
b100000
30
b100001
8
b10001
2
b1001
29
b1010
23
b1011
1
b110
0
b11100
24
b1110100
4
b111010100
15
b1110101010
5
b1110101011000
20
b1110101011001
19
b1110101011010
22
b1110101011011
21
b1110101011100
6
b11101010111010
18
b11101010111011
17
b111010101111
16
b11101011
14
b111011
27
b11110
3
b111110
13
b111111
26
VP3.1 Huﬀman Table Number 74
Huﬀman Code
Token Value
b0000
12
b0001
11
b00100
25
b001010
13
b0010110
30
b0010111
7
b0011
28
b0100
3
b01010
24
b010110
4
b010111
27
b0110
23
b0111
29
b100
0
b1010
1
b101100
26
b10110100
31
b101101010
5
b1011010110000
16
b1011010110001
6
b1011010110010
18
b1011010110011
17
b101101011010
15
b10110101101100
20
b10110101101101
19
b10110101101110
22
b10110101101111
21
b1011010111
14
b1011011
8
b10111
2
b110
9
b111
10
VP3.1 Huﬀman Table Number 75

---

## Page 206

190
APPENDIX B. VP3
Huﬀman Code
Token Value
b00
9
b0100
28
b0101
2
b01100000
30
b01100001
7
b0110001
8
b011001
27
b011010
24
b011011
25
b0111
29
b10000
11
b10001
12
b1001
3
b101
0
b11000
23
b11001000
13
b1100100100
31
b1100100101000
18
b1100100101001
17
b1100100101010
20
b1100100101011
19
b1100100101100
6
b11001001011010
16
b11001001011011
15
b11001001011100
22
b11001001011101
21
b1100100101111
14
b110010011
5
b1100101
26
b110011
4
b1101
1
b111
10
VP3.1 Huﬀman Table Number 76
Huﬀman Code
Token Value
b000
1
b0010
2
b00110
29
b001110
12
b001111
11
b01
9
b10
10
b110
0
b111000
23
b111001
4
b111010
28
b111011000000
30
b1110110000010
6
b11101100000110
15
b11101100000111
14
b11101100001
7
b11101100010
13
b11101100011000
21
b11101100011001
20
b11101100011010
31
b11101100011011
22
b11101100011100
17
b11101100011101
16
b11101100011110
19
b11101100011111
18
b111011001
5
b11101101
25
b11101110
27
b111011110
24
b1110111110
8
b1110111111
26
b1111
3
VP3.1 Huﬀman Table Number 77

---

## Page 207

B.4. HUFFMAN TABLES
191
Huﬀman Code
Token Value
b00
0
b010
1
b0110
3
b011100
4
b0111010000
5
b0111010001000
14
b0111010001001
13
b0111010001010
16
b0111010001011
15
b0111010001100
6
b01110100011010
8
b01110100011011
7
b01110100011100
27
b01110100011101
26
b01110100011110
31
b01110100011111
30
b011101001
12
b011101010
11
b01110101100000
22
b01110101100001
21
b01110101100010
25
b01110101100011
24
b01110101100100
18
b01110101100101
17
b01110101100110
20
b01110101100111
19
b01110101101
23
b0111010111
29
b0111011
28
b01111
2
b10
10
b11
9
VP3.1 Huﬀman Table Number 78
Huﬀman Code
Token Value
b00
10
b01
9
b10
0
b1100
3
b1101000
12
b1101001
11
b110101000
24
b110101001
23
b11010101
27
b110101100
5
b1101011010
25
b1101011011000
6
b11010110110010
8
b11010110110011
7
b11010110110100
22
b11010110110101
21
b11010110110110
31
b11010110110111
30
b11010110111000
18
b11010110111001
17
b11010110111010
20
b11010110111011
19
b11010110111100
14
b11010110111101
13
b11010110111110
16
b11010110111111
15
b11010111
26
b11011
29
b11100
2
b111010
28
b111011
4
b1111
1
VP3.1 Huﬀman Table Number 79

---

## Page 208

192
APPENDIX B. VP3

---

## Page 209

Appendix C
Colophon
Ogg is a Xiph.Org Foundation eﬀort to protect essential tenets of Internet mul-
timedia from corporate hostage-taking; Open Source is the net’s greatest tool
to keep everyone honest. See About the Xiph.Org Foundation for details.
Ogg Theora is the ﬁrst Ogg video codec. Anyone may freely use and dis-
tribute the Ogg and Theora speciﬁcations, whether in private, public, or corpo-
rate capacity. However, the Xiph.Org Foundation and the Ogg project reserve
the right to set the Ogg Theora speciﬁcation and certify speciﬁcation compli-
ance.
Xiph.Org’s Theora software codec implementation is distributed under a
BSD-like license. This does not restrict third parties from distributing indepen-
dent implementations of Theora software under other licenses.
These pages are Copyright © 2004-2007 Xiph.Org Foun-
dation. All rights reserved. Ogg, Theora, Vorbis, Xiph.Org
Foundation and their logos are trademarks () of the
Xiph.Org Foundation.
This document is set in LATEX.
193

---

## Page 210

194
APPENDIX C. COLOPHON

---

## Page 211

Bibliography
[Bra97] Scott Bradner. RFC 2119: Key words for use in RFCs to Indicate Re-
quirement Levels, March 1997. <http://www.ietf.org/rfc/rfc2119>.
txt.
[CSF77] Wen-Hsiung Chen, C. Harrison Smith, and S. C. Fralick. A fast compu-
tational algorithm for the discrete cosine transform. IEEE Transactions
on Communications, COM-25(9):1004–1011, September 1977.
[ITU95] International Telecommunications Union, 1211 Geneva 20, Switzer-
land. Reccomendation ITU-R BT.601-5: Studio Encoding Parameters
of Digital Television for Standard 4:3 and Wide-Screen 16:9 Aspect Ra-
tios, 1982, revised edition, 1995.
[ITU98] International Telecommunications Union, 1211 Geneva 20, Switzer-
land. Reccomendation ITU-R BT.470-6: Conventional Television Sys-
tems, 1970, revised edition, 1998.
[ITU02] International Telecommunications Union, 1211 Geneva 20, Switzer-
land.
Recommendation ITU-R BT.709-5: Parameter values for the
HDTV standards for production and international programme exchange,
1990, revised edition, 2002.
[Mel04] Mike Melanson. VP3 bitstream format and decoding process. http:
//www.multimedia.cx/vp3-format.txt, March 2004.
[Pfe03] Silvia Pfeiﬀer. RFC 3533: The Ogg Encapsulation Format Version 0,
May 2003. <http://www.ietf.org/rfc/rfc3533.txt>.
[Poy97] Charles Poynton.
Frequently-asked questions about gamma.
http:
//www.poynton.com/GammaFAQ.html, February 1997.
[SMP94] Society of Motion Pciture and Television Engineers. SMPTE-170M:
Television — Composite Analog Video Signal — NTSC for Studio Ap-
plications, 1994.
[Xip02] Xiph.Org Foundation. Vorbis I speciﬁcation, 2002. <http://www.xiph>.
org/ogg/vorbis/doc/.
195

---

## Page 212

196
BIBLIOGRAPHY
[Yer96] Francois Yergeau.
RFC 2044:
UTF-8, a transformation format of
Unicode and ISO 10646, October 1996. <http://www.ietf.org/rfc/>
rfc2044.txt.
