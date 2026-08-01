# finals-copy

---

## Page 1

James Ortiz-Luis, 32386064
Mario Ruiz, 46301389
EECS 148 Homework 4

1. IP Addressing
Chapter 4, P13
Subnet 1: 223.1.17.0/26
Subnet 2: 223.1.17.128/25
Subnet 3: 223.1.17.64/28
Chapter 4, P21
Home addresses: 192.168.1.1, 192.168.1.2, 192.168.1.3
Router interface: 192.168.1.4
NAT Translation Table
WAN Side
LAN Side
24.34.112.235, 5001
192.168.1.1, 3345
24.34.112.235, 5002
192.168.1.1, 3346
24.34.112.235, 5003
192.168.1.2, 3347
24.34.112.235, 5004
192.168.1.2, 3348
24.34.112.235, 5005
192.168.1.3, 3349
24.34.112.235, 5006
192.168.1.3, 3350
2. BGP
Chapter 4, P40
Wâ€™s view Xâ€™s view
From Xâ€™s view, there is no link between A and C because X does not get an
advertised route that uses that link to get to W or Y.
3. Routing Algorithms
(a) Route: H1-A-B-C-D-E-H2
1.
2.

---

## Page 2

Step S
d(A), p(A)
d(B), p(B) d(C), p(C) d(D), p(D) d(E), p(E) d(H2), p(H2)
0
H1
10, H1
âˆž
âˆž
âˆž
âˆž
âˆž
1
H1A
20, A
âˆž
60, A
âˆž
âˆž
2
H1AB
40, B
60, A
100, B
âˆž
3
H1ABC
50, C
100, B
âˆž
4
H1ABCD
90, D
âˆž
5
H1ABCDE
100, E
6
H1ABCDEH2
*cost for each link is transmission delay + propagation delay in milliseconds
(b) No. This route is not the same as the minimum number of hops.
(c) Initial Tables
Node A (B,D) | Node B (A,C,D,E) | Node C (B,D,E) | Node D (A,B,C,E) | Node E(B,C,D)
Dest Via Delay Dest Via Delay Dest Via Delay Dest Via Delay Dest Via Delay
A
B
C
D
E
A
-

-
-
-

0
âˆž
âˆž
âˆž
âˆž
A
B
C
D
E
-

B
-

-
-

âˆž
0
âˆž
âˆž
âˆž
A
B
C
D
E
-

-

C
-

-

âˆž
âˆž
0
âˆž
âˆž
A
B
C
D
E
-

-
-

D
-

âˆž
âˆž
âˆž
0
âˆž
A
B
C
D
E
-

-
-
-

E
âˆž
âˆž
âˆž
âˆž
0
Tables after first exchange
Node A (B,D) | Node B (A,C,D,E) | Node C (B,D,E) | Node D (A,B,C,E) | Node E(B,C,D)
Dest Via Delay
Dest Via Delay
Dest Via Delay Dest Via Delay Dest Via Delay
A
B
C
D
E
A
A
-

A
-

0
10
âˆž
50
âˆž
A
B
C
D
E
B
B
B
B
B
10
0
20
40
80
A
B
C
D
E
-

C
C
C
C
âˆž
20
0
10
60
A
B
C
D
E
D
D
D
D
D
50
40
10
0
40
A
B
C
D
E
-

E
E
E
E
âˆž
80
60
40
0
Tables after second exchange
Node A (B,D) | Node B (A,C,D,E) | Node C (B,D,E) | Node D (A,B,C,E) | Node E(B,C,D)

---

## Page 3

Dest Via
Delay Dest Via Delay
Dest Via Delay Dest Via Delay Dest Via Delay
A
B
C
D
E
A
A
B
A
B
0
10
30
50
90
A
B
C
D
E
B
B
B
C
B
10
0
20
30
80
A
B
C
D
E
B
C
C
C
D
30
20
0
10
50
A
B
C
D
E
D
C
D
D
D
50
30
10
0
40
A
B
C
D
E
B
E
D
E
E
90
80
50
40
0
Tables after third exchange
Node A (B,D) | Node B (A,C,D,E) | Node C (B,D,E) | Node D (A,B,C,E) | Node E(B,C,D)
Dest Via Delay
Dest Via Delay Dest Via Delay Dest Via Delay Dest Via Delay
A
B
C
D
E
A
A
B
C
B
0
10
30
40
90
A
B
C
D
E
B
B
B
C
D
10
0
20
30
70
A
B
C
D
E
B
C
C
C
D
30
20
0
10
50
A
B
C
D
E
B
C
D
D
D
40
30
10
0
40
A
B
C
D
E
B
C
D
E
E
90
70
50
40
0
Tables after fourth exchange
Node A (B,D) | Node B (A,C,D,E) | Node C (B,D,E) | Node D (A,B,C,E) | Node E(B,C,D)
Dest Via
Delay Dest Via Delay Dest Via Delay Dest Via Delay Dest Via Delay
A
B
C
D
E
A
A
B
C
D
0
10
30
40
80
A
B
C
D
E
B
B
B
C
D
10
0
20
30
70
A
B
C
D
E
B
C
C
C
D
30
20
0
10
50
A
B
C
D
E
B
C
D
D
D
40
30
10
0
40
A
B
C
D
E
B
C
D
E
E
80
70
50
40
0
(d) Yes. The algorithm converges.
Tables at steady state
Node A (B,D) | Node B (A,C,D,E) | Node C (B,D,E) | Node D (A,B,C,E) | Node E(B,C,D)
Dest Via Delay
Dest Via Delay Dest Via Delay Dest Via Delay Dest
Via Delay

---

## Page 4

A
B
C
D
E
A
A
B
C
D
0
10
30
40
80
A
B
C
D
E
B
B
B
C
D
10
0
20
30
70
A
B
C
D
E
B
C
C
C
D
30
20
0
10
50
A
B
C
D
E
B
C
D
D
D
40
30
10
0
40
A
B
C
D
E
B
C
D
E
E
80
70
50
40
0
Tables after links AB and BE fail: first exchange
Node A (B,D) | Node B (A,C,D,E) | Node C (B,D,E) | Node D (A,B,C,E) | Node E(B,C,D)
Dest Via Delay Dest Via Delay Dest Via Delay Dest Via Delay Dest
Via Delay
A
B
C
D
E
A
A
B
A
D
0
âˆž
30
50
80
A
B
C
D
E
B
B
B
C
D
âˆž
0
20
30
70
A
B
C
D
E
B
C
C
C
D
âˆž
20
0
10
50
A
B
C
D
E
B
C
D
D
D
âˆž
30
10
0
40
A
B
C
D
E
B
C
D
E
E
âˆž
70
50
40
0
Tables after links AB and BE fail: second exchange
Node A (B,D) | Node B (A,C,D,E) | Node C (B,D,E) | Node D (A,B,C,E) | Node E(B,C,D)
Dest Via Delay
Dest Via Delay Dest Via Delay Dest Via Delay Dest
Via Delay
A
B
C
D
E
A
D
B
A
D
0
90
30
50
90
A
B
C
D
E
D
B
B
C
D
80
0
20
30
70
A
B
C
D
E
D
C
C
C
D
60
20
0
10
50
A
B
C
D
E
D
C
D
D
D
50
30
10
0
40
A
B
C
D
E
D
C
D
E
E
90
70
50
40
0
***delay is in milliseconds for question 3, parts (c) and (d)
