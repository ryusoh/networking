# cs234-06 - Part 02 (Pages 15-28)

---

## Page 15

4:2:2 Sub-sampling
15
Y
V
U
RGB

---

## Page 16

Common Color Subsampling
Schemes
16
4:4:4
4:2:2
4:2:0
4:1:1

---

## Page 17

Tools #1: Discrete Cosine
Transform
17
Image Domain
Frequency Domain

---

## Page 18

Zig-zag Ordering
So that lower frequency component
are at the upper-left corner
18
27
3
2
1
1
0
0
0
4
0
0
0
1
0
0
0
27, 3, 2, 4, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0

---

## Page 19

Tool #2: Quantization
19
242 65
-54 -10
23
5
-4
-2
13
6
2
1
3
5
-1
-2
8
8
8
8
8
8
8
16
8
8
8
16
16 32
32 64
30
8
-6 -1
2
0
0
0
1
0
0
0
0
0
0
0
/
=

Quantization
Table
DC
AC
Q: Why the values of Quantization
Table toward lower-right corner are
larger?

---

## Page 20

Tool #3: Entropy Coding
Run-length coding + Huffman coding
20
27
3
2
1
1
0
0
0
4
0
0
0
1
0
0
0
27, 3, 2, 4, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0
(27, 1) (3, 1) (2, 1), (4, 1), (1, 2), (0, 5), (1, 1), (0, 4)

---

## Page 21

Summary of JPEG
´Essentially, JPEG is DCT + Quantization

+ Entropy Coding
´Q1: Which component is the lossy
part?
´Q2: How do we control ”how lossy is
it”?
´Q3: Can we use JPEG to encode
video
´Yes, as a sequence of images
´No, much (inter-frame) redundancy is not
leveraged
21
Essentially, jpeg is dct + quantization + entropy coding
Quantization
Quantize ratio
Yes as a sequence of images
No much redundancy is not leveraged

---

## Page 22

Agenda
´Why Compression
´Image Coding Tools
´Video Coding Tools
´Popular Video Codecs
22

---

## Page 23

(Backward)Motion
Estimation
23
Frame t
Frame t+1

---

## Page 24

Bi-directional Prediction
24
Frame t
Frame t+1
Frame t+2

---

## Page 25

Sample Motion Vector
25

---

## Page 26

Original Frame 1
26
By (c) copyright 2006, Blender Foundation /
Netherlands Media Art Institute /
<www.elephantsdream.org> - Screenshot from
"Elephants Dream"
<http://orange.blender.org/download>, CC BY 2.5,
<https://commons.wikimedia.org/w/index.php?curid=>
7395132

---

## Page 27

Delta Between Frames 1
and 2
27
By (c) copyright 2006, Blender Foundation /
Netherlands Media Art Institute /
<www.elephantsdream.org> - Screenshot from
"Elephants Dream"
<http://orange.blender.org/download>, CC BY 2.5,
<https://commons.wikimedia.org/w/index.php?curid=>
7395132

---

## Page 28

Motion Compensated
Difference
28
By (c) copyright 2006, Blender Foundation /
Netherlands Media Art Institute /
<www.elephantsdream.org> - Screenshot from
"Elephants Dream"
<http://orange.blender.org/download>, CC BY 2.5,
<https://commons.wikimedia.org/w/index.php?curid=>
7395132
Idea: Just encode this “residue image”!
Such encoders (intra + inter-frame coding) are
referred to as hybrid codecs
