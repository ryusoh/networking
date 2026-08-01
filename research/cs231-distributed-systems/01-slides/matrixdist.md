# matrixdist

---

## Page 1

c
⃝
Isaac D. Scherson
Distributed [Computing] Systems
Matrix Multiplication
Isaac D. Scherson (aka The Schark c¨^ )
Dept. of Computer Science (Systems)
Bren School of Information and Computer Sciences
University of California, Irvine
Irvine, CA 92697-3425
isaac@ics.uci.edu
www.ics.uci.edu/˜isaac
www.ics.uci.edu/˜schark
CompSci-230, Winter 2019
1 / 19
c
⃝
Isaac D. Scherson
Matrix Multiplication
2 / 19

---

## Page 2

c
⃝
Isaac D. Scherson
Problem Statement
I Consider the problem of computing the product of two n ⇥n complex
matrices A and B
I The problem is to be solved on a n-processor ring.
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
B =
2
6664
b00
b01
. . .
b0(n−1)
b10
b11
. . .
b1(n−1)
...
...
b(n−1)0
b(n−1)1
. . .
b(n−1)(n−1)
3
7775
C = A ⇥B
3 / 19
c
⃝
Isaac D. Scherson
The power of a simple computation
BEFORE ...
Way back when, computer architects designed CPUs with a simple
accumulator oriented operation in a memory oriented Von Neumann
computer:
Recall the Von Neumann Cycle:
IF
!
ID
!
EA
!
OF
!
EX
If a is the accumulator, b is a CPU register, and M[EA] is the location in
memory where we ﬁnd an operand, the basic operation is:
a M[EA] + a ⇥b
4 / 19

---

## Page 3

c
⃝
Isaac D. Scherson
The power of a simple computation
Consider the problem of computing the value of the polynomial
P(x) = ↵n−1xn−1 + ↵n−2xn−2 + . . . . . . + ↵1x + ↵0
at x = x0, without computing the powers of x.
5 / 19
c
⃝
Isaac D. Scherson
Solution using the power of a simple computation
The polynomial evaluation is obtained by substituting x by x0
P(x0) = ↵n−1x0
n−1 + ↵n−2x0
n−2 + . . . . . . + ↵1x0 + ↵0
and the following factorization allows the evaluation without computing
the powers of x:
P(x0) = (. . . (((↵n−1x0 + ↵n−2)x0 + ↵n−3)x0 + . . . . . .)x0 + ↵0
Code:
P = 0
For i = 0, n −1, do:
P = P ⇥x0 + ↵n−1−i
endfor
Referring to the Powerful basic computation, M[EA] contains the array of
coefﬁcients, b contains x0 and P is assigned to the accumulator.
This polynomial evaluation method is known as Horner’s rule.
6 / 19

---

## Page 4

c
⃝
Isaac D. Scherson
Basic Sequential Nested Loop
Back to Matrix Multiplication
On a single processor system:
For i = 0, n −1, do:
For j = 0, n −1, do:
For k = 0, n −1, do:
ci,j = ci,j + aik ⇥bk,j
endfor
endfor
endfor
Complexity
Time = O(n3) Multiplications
Memory = O(n2)
Communications = 0
Note that the expression ci,j = ci,j + aik ⇥bk,j is the powerful simple
computation, which can be used to do the Scalar Product of two vectors.
In this case, the dot product of row vectors of A and column vectors of B.
7 / 19
c
⃝
Isaac D. Scherson
Map Matrix Multiply to a Parallel Architecture
The Architecture: n-processor Ring.
For simplicity, size matches the size of the problem.
We must ﬁrst decide on how to allocate the data in memory ... Just like
we do in a single processor system.
8 / 19

---

## Page 5

c
⃝
Isaac D. Scherson
Very ﬁrst approximation
Store the matrices A and B in ALL local memories (global knowledge) in
row major form.
For Matrix A:
P0
P1
P2
. . .
Pn−1
a00
a00
a00
. . . . . .
a00
·
·
·
·
·
·
·
·
a0(n−1)
a0(n−1)
a0(n−1)
. . . . . .
a0(n−1)
a10
a10
a00
. . . . . .
a10
·
·
·
·
·
·
·
·
a1(n−1)
a1(n−1)
a1(n−1)
. . . . . .
a1,(n−1)
·
·
·
·
a(n−1)0
a(n−1)0
a(n−1)0
. . . . . .
a(n−1)0
·
·
·
·
·
·
·
·
a(n−1)(n−1)
a(n−1)(n−1)
a(n−1)(n−1)
. . . . . .
a(n−1)(n−1)
9 / 19
c
⃝
Isaac D. Scherson
Global Knowledge Algorithm
P0
P1
P2
. . .
Pn−1
A
A
A
. . . . . .
A
B
B
B
. . . . . .
B
c00
c10
c20
. . . . . .
c(n−1)0
·
·
·
·
·
·
·
·
c0(n−1)
c1(n−1)
c2(n−1)
. . . . . .
c(n−1)(n−1)
I Every Processor Pi computes the i −th row of C
I The SPMD program becomes:
Do All Pi=0,n−1:
For j = 0, n −1, do:
For k = 0, n −1, do:
ci,j = ci,j + aik ⇥bk,j
endfor
endfor
enddoall
10 / 19

---

## Page 6

c
⃝
Isaac D. Scherson
Global Knowledge Algorithm: What did we learn?
I Parallelization occurred by unfolding the loop on i
I Complexity:
Time = O(n2) Multiplications
Memory = O(n2)
Communications = 0
I Used only ONE row of A at each processor, but had ALL of A
available ! can save storage.
I Could also store B by columns and use the interconnection network
in between each row-column scalar multiply iteration.
I Would use the network to bring ONE column of B to each processor
when needed for the current iteration.
11 / 19
c
⃝
Isaac D. Scherson
Reducing Storage Requirements
Store the matrices A and B in by rows and columns respectively.
The result C will be obtained by rows as in the previous case.
P0
P1
P2
. . .
Pn−1
a00
a10
a20
. . . . . .
a(n−1)0
·
·
·
·
·
·
·
·
a0(n−1)
a1(n−1)
a2(n−1)
. . . . . .
a(n−1)(n−1)
b00
b01
b02
. . . . . .
b0(n−1)
·
·
·
·
·
·
·
·
b(n−1)0
b(n−1)1
b(n−1)2
. . . . . .
b(n−1),(n−1)
c00
c10
c20
. . . . . .
c(n−1)0
·
·
·
·
·
·
·
·
c0(n−1)
c1(n−1)
c2(n−1)
. . . . . .
c(n−1)(n−1)
12 / 19

---

## Page 7

c
⃝
Isaac D. Scherson
Reducing Storage Requirements
Store the matrices A and B in by rows and columns respectively.
The result C will be obtained by rows as in the previous case.
P0
P1
P2
. . .
Pn−1
a00
a10
a20
. . . . . .
a(n−1)0
·
·
·
·
·
·
·
·
a0(n−1)
a1(n−1)
a2(n−1)
. . . . . .
a(n−1)(n−1)
b00
b01
b02
. . . . . .
b0(n−1)
·
·
·
·
·
·
·
·
b(n−1)0
b(n−1)1
b(n−1)2
. . . . . .
b(n−1),(n−1)
c00
c10
c20
. . . . . .
c(n−1)0
·
·
·
·
·
·
·
·
c0(n−1)
c1(n−1)
c2(n−1)
. . . . . .
c(n−1)(n−1)
13 / 19
c
⃝
Isaac D. Scherson
Mixed Row-Column Algorithm
I Every Processor Pi computes the i −th row of C
I The SPMD program becomes:
Do All Pi=0,n−1:
For j = i, do n times:
For k = 0, n −1, do:
ci,j = ci,j + aik ⇥bk,j
endfor
Every processor i sends its current
column of B to processor (i + 1)mod(n)
endfor
enddoall
I Complexity:
Time = O(n2) Multiplications
Memory = O(n)
Communications = O(n2) network cycles
Assumption: Only ONE data item can be transmitted in a single network cycle.
14 / 19

---

## Page 8

c
⃝
Isaac D. Scherson
Global knowledge and Mixed Row-Column
I In BOTH Global knowledge and Mixed Row-Column algorithms
parallelization occurred by unfolding the loop on i
I Both exhibit the same time complexity: a speedup of n with n
processors.
I Mixed Row-Column gains in storage at the expense of
communications.
15 / 19
c
⃝
Isaac D. Scherson
A Challenge !!!
Store the matrices A, B and C consistently by rows.
Devise an algorithm that works with this storage scheme.
P0
P1
P2
. . .
Pn−1
a00
a10
a20
. . . . . .
a(n−1)0
·
·
·
·
·
·
·
·
a0(n−1)
a1(n−1)
a2(n−1)
. . . . . .
a(n−1)(n−1)
b00
b10
b20
. . . . . .
b(n−1)0
·
·
·
·
·
·
·
·
b0(n−1)
b1(n−1)
b2(n−1)
. . . . . .
b(n−1)(n−1)
c00
c10
c20
. . . . . .
c(n−1)0
·
·
·
·
·
·
·
·
c0(n−1)
c1(n−1)
c2(n−1)
. . . . . .
c(n−1)(n−1)
16 / 19

---

## Page 9

c
⃝
Isaac D. Scherson
Observation
I When multiplying rows of A by columns of B, one element of the row
of A multiplies ALL the elements of the corresponding row of B.
A =
2
6666664
a00
a01
. . .
a0(n−1)
a10
a11
. . .
a1(n−1)
...
aij
...
...
...
a(n−1)0
a(n−1)1
. . .
a(n−1)(n−1)
3
7777775
B =
2
666666664
b00
b01
. . .
b0(n−1)
b10
b11
. . .
b1(n−1)
...
...
bj0
bj1
. . .
bj(n−1)
...
...
b(n−1)0
b(n−1)1
. . .
b(n−1)(n−1)
3
777777775
17 / 19
c
⃝
Isaac D. Scherson
Storage by Rows Algorithm
I Every Processor Pi computes the i −th row of C
I The SPMD program becomes:
Do All Pi=0,n−1:
For j = i, do n times:
For k = 0, n −1, do:
ci,j = ci,j + aij ⇥bj,k
endfor
Every processor i sends its current
row of B to processor (i + 1)mod(n)
endfor
enddoall
I Complexity:
Time = O(n2) Multiplications
Memory = O(n)
Communications = O(n2) network cycles
Assumption: Only ONE data item can be transmitted in a single network cycle.
18 / 19

---

## Page 10

c
⃝
Isaac D. Scherson
Another Challenge
For i = 0, n −1, do:
For j = 0, n −1, do:
For k = 0, n −1, do:
ci,j = ci,j +aik ⇥bk,j
endfor
endfor
endfor
I Starting with the basic sequential loop, the loop on i was unfolded to
expose the data parallelism.
I Invariant program transformations allow for changing the order of
the loops leaving the result unchanged.
I QUESTION: What algorithms result when unfolding (parallelizing)
on j or k ???
19 / 19
