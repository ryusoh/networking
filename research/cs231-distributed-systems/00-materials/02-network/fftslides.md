# fftslides

---

## Page 1

Two-Dimensional FFT on Clusters
Isaac D. Scherson (aka The Schark c¨⌣)
Dept. of Computer Science (Systems)
School of Information and Computer Sciences
University of California, Irvine
Irvine, CA 92697-3425
isaac@ics.uci.edu
www.ics.uci.edu/ ˜ isaac
www.ics.uci.edu/ ˜ schark
c
⃝
Isaac D. Scherson
2004 – p.1/13

---

## Page 2

Preliminary Assumptions
Jean Baptiste Joseph Fourier (1768-1830)
We assume basic knowledge of the Fourier
Transform and its variations: the DFT and its
implementation as FFT.
Cooley and Tukey’s algorithm.
Decimation in time or frequency.
If necessary, pause to remind basic FFT
algorithm. Use PPT ﬁle fft_intro.ppt
c
⃝
Isaac D. Scherson
2004 – p.2/13

---

## Page 3

Problem Statement
Consider the problem of
computing the 2D-FFT of the
n × n complex matrix A
The problem is to be solved on a
k-processor Cluster
A =


a00
a01
. . .
a0(n−1)
a10
a11
. . .
a1(n−1)
...
...
a(n−1)0
a(n−1)1
. . .
a(n−1)(n−1)


P0
Processors
Memory
Network
Interconnection
P1
P2
P3
P(k−1)
c
⃝
Isaac D. Scherson
2004 – p.3/13

---

## Page 4

2D-FFT
2D FFT is based on the 1D FFT
FFT of rows followed by FFT of columns
Basic Procedure:
FFT rows
Transpose
FFT rows
Transpose
An example of the data ﬂow for an
eight-point FFT
c
⃝
Isaac D. Scherson
2004 – p.4/13

---

## Page 5

Data Distribution
Each processor Pi is given a band of n
k rows of the matrix starting with row i × n
k
k bands

























B00
B01
B02
. . .
B0(k−1)
B10
B11
B12
. . .
B1(k−1)
B20
B21
B22
. . .
B2(k−1)
...
B(k−1)0
B(k−1)1
B(k−1)2
. . .
B(k−1)(k−1)


Each block Bij is a square block of n
k × n
k elements of A
c
⃝
Isaac D. Scherson
2004 – p.5/13

---

## Page 6

Implementation of 2D FFT
Eack processor Pi computes n
k 1D-FFTs on the n −element row vectors in its
memory
The problem now is how to transpose ...
Note that the transpose of A is obtained by transposing the blocks
c
⃝
Isaac D. Scherson
2004 – p.6/13

---

## Page 7

Transposing by Blocks
Observations:
All Processors need to distribute all,
but one, of their blocks among all
other processors:
Processor Pi sends Block Bij to
Processor Pj for all
j ∈[0, k −1] −[i]
Basic Sequential Loop:
For i = 0, k −1, do:
For j = 0, k −1, do:
Pi sends Block Bij
to Processot Pj
endfor
endfor
For simplicity, the loop does not optimize
for a Processor sending to itself
Complexity of Transfer = O(k2) block transfers
P0
P(K−1)
P3
P2
P1
Graph of All Required
Communication Patterns
c
⃝
Isaac D. Scherson
2004 – p.7/13

---

## Page 8

Parallelizing on i
Choosing to transfer according to the loop:
For all i, do parallel:
For j = 0, k −1, do:
Pi sends Block Bij
to Processot Pj
endfor
endfor
Complexity of Transfer = O(k2) block transfers
P(K−1)
B(k−1)2
B32
B12
B02
P0
P1
P2
P3
c
⃝
Isaac D. Scherson
2004 – p.8/13

---

## Page 9

Parallelizing on j
Choosing to transfer according to the loop:
For i = 0, k −1, do:
For all j, do parallel:
Pi sends Block Bij
to Processot Pj
endfor
endfor
Complexity of Transfer = O(k2) block transfers
P(K−1)
B3(k−1)
B32
B31
B30
P0
P1
P2
P3
c
⃝
Isaac D. Scherson
2004 – p.9/13

---

## Page 10

Astute Parallelizing on i
Choosing to transfer according to the loop:
For all i, do parallel:
For all j = 1, k −1, do:
Pi sends Block Bi(j+i)modk
to Processot P(j+i)modk
endfor
endfor
Complexity
of
Transfer
=
O(k)
block
trans-
fers
If the network cooperates !!!
...
That is, if it
is a X-bar Switch.
P0
P(K−1)
P3
P2
P1
j=1
P0
P(K−1)
P3
P2
P1
j=2
c
⃝
Isaac D. Scherson
2004 – p.10/13

---

## Page 11

Final Implementation Discussion
k bands

























B00
B01
B02
. . .
B0(k−1)
B10
B11
B12
. . .
B1(k−1)
B20
B21
B22
. . .
B2(k−1)
...
B(k−1)0
B(k−1)1
B(k−1)2
. . .
B(k−1)(k−1)


Using MPI, the solution is trivial and takes advantage of the astute transpose
mechanism.
Using DSM, the solution takes advantage of the same principle and can overlap
communications and computations by using the following two conditions:
1. Use a double buffer to write into at the last iteration of the 1D-FFT
2. At processor Pi, start iterations with butterﬂy anchored on element i of each row
vector. This skews the vector writing and avoids the all to one problem.
c
⃝
Isaac D. Scherson
2004 – p.11/13

---

## Page 12

Performance Analysis
Each of the k processors performs 2 × n
k 1D-FFts
This is a factor of O(k) speedup with respect to the sequential case.
In the sequential case, there is no need to transpose
The FFT of rows and columns are done by two separate loops that index over
rows and columns respectively
HENCE
The Maximum Speedup one can expect, in the BEST POSSIBLE CASE:
Speedup
=
T ime in Single P rocessor
T ime in Cluster
=
2×n2×log n
2 n2
k log n+O(k ( n
k × n
k ) block transfers)
c
⃝
Isaac D. Scherson
2004 – p.12/13

---

## Page 13

THE END
. . . QUESTIONS ?
c
⃝
Isaac D. Scherson
2004 – p.13/13
