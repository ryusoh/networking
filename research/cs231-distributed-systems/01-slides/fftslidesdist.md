# fftslidesdist

---

## Page 1

c
⃝
Isaac D. Scherson
Distributed [Computing] Systems
Two-Dimensional FFT on Clusters
A step in SAR data processing
Isaac D. Scherson (aka The Schark c¨^ )
Dept. of Computer Science (Systems)
Bren School of Information and Computer Sciences
University of California, Irvine
Irvine, CA 92697-3425
isaac@ics.uci.edu
www.ics.uci.edu/˜isaac
www.ics.uci.edu/˜schark
CompSci-230, Winter 2019
1 / 14
c
⃝
Isaac D. Scherson
2D FFT on Clusters
2 / 14

---

## Page 2

c
⃝
Isaac D. Scherson
Preliminary Assumptions
Jean Baptiste Joseph Fourier
(1768-1830)
We assume basic knowledge of the Fourier
Transform and its variations:
the DFT
and its implementation as FFT.
I Cooley and Tukey’s algorithm.
Decimation in time or frequency.
I If necessary, pause to remind basic
FFT algorithm. Use PPT ﬁle
fft intro.ppt
3 / 14
c
⃝
Isaac D. Scherson
Problem Statement
I Consider the problem of
computing the 2D-FFT of the
n ⇥n complex matrix A
I The problem is to be solved on a
k-processor Cluster
A =
2
6664
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
3
7775
P0
Processors
Memory
Network
Interconnection
P1
P2
P3
P(k−1)
4 / 14

---

## Page 3

c
⃝
Isaac D. Scherson
2D-FFT
I 2D FFT is based on the 1D FFT
I FFT of rows followed by FFT of
columns
I Basic Procedure:
I FFT rows
I Transpose
I FFT rows
I Transpose
An
example
of
the
data
ﬂow
graph
for
an
eight-point
FFT.
Decimation in frequency leads to
bit-reversed output.
5 / 14
c
⃝
Isaac D. Scherson
A 16 point FFT
An example of the data ﬂow graph for a sixteen-point FFT. Decimation in
time.
6 / 14

---

## Page 4

c
⃝
Isaac D. Scherson
Data Distribution
I Each processor Pi is given a band of n
k rows of the matrix starting
with row i ⇥n
k
k bands
8
>
>
>
>
>
>
>
>
>
<
>
>
>
>
>
>
>
>
>
:
2
6666666664
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
3
7777777775
I Each block Bij is a square block of n
k ⇥n
k elements of A
7 / 14
c
⃝
Isaac D. Scherson
Implementation of 2D FFT
I Eack processor Pi computes n
k 1D-FFTs on the n −element row
vectors in its memory
I
The problem now is how to transpose ...
I Note that the transpose of A is obtained by transposing the blocks
8 / 14

---

## Page 5

c
⃝
Isaac D. Scherson
Transposing by Blocks
I All Processors need to distribute all,
but one, of their blocks among all other
processors:
I Processor Pi sends Block Bij to
Processor Pj for all j 2 [0, k −1] −[i]
I Basic Sequential Loop:
For i = 0, k −1, do:
For j = 0, k −1, do:
Pi sends Block Bij
to Processot Pj
endfor
endfor
I For simplicity, the loop does not optimize
for a Processor sending to itself
P0
P(K−1)
P3
P2
P1
Graph of All Required Communication Patterns
Complexity of Transfer = O(k2) block transfers
9 / 14
c
⃝
Isaac D. Scherson
Parallelizing on i
I Choosing to transfer according to the loop:
Do all i, Pi=0,(n−1):
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
10 / 14

---

## Page 6

c
⃝
Isaac D. Scherson
Parallelizing on j
I Choosing to transfer according to the loop:
For i = 0, k −1, do:
Do all j, Pj=0,(n−1):
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
11 / 14
c
⃝
Isaac D. Scherson
Astute Parallelizing on i
I Choosing to transfer according to the
loop:
Do all i, Pi=0,(n−1):
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
transfers
If the network cooperates !!!
...
That
is, if it is a X-bar Switch.
j=1
P0
P(K−1)
P3
P2
P1
j=2
P0
P(K−1)
P3
P2
P1
12 / 14

---

## Page 7

c
⃝
Isaac D. Scherson
Final Implementation Discussion
k bands
8
>
>
>
>
>
>
>
>
>
<
>
>
>
>
>
>
>
>
>
:
2
6666666664
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
3
7777777775
I Using MPI, the solution is trivial and takes advantage of the astute
transpose mechanism.
I Using DSM, the solution takes advantage of the same principle and
can overlap communications and computations by using the following
two conditions:
1. Use a double buffer to write into at the last iteration of the 1D-FFT
2. At processor Pi, start iterations with butterﬂy anchored on element i of
each row vector. This skews the vector writing and avoids the all to one
problem.
13 / 14
c
⃝
Isaac D. Scherson
Performance Analysis
I Each of the k processors performs 2 ⇥n
k 1D-FFts
I This is a factor of O(k) speedup with respect to the sequential case.
I In the sequential case, there is no need to transpose
I The FFT of rows and columns are done by two separate loops that index
over rows and columns respectively
HENCE
The Maximum Speedup one can expect, in the BEST POSSIBLE CASE:
Speedup
=
Time in Single Processor
Time in Cluster
=
2⇥n2⇥log n
2 n2
k log n+O(k ( n
k ⇥n
k ) block transfers)
14 / 14
