# homework-1-w17-solutions

---

## Page 1

1
Homework 1 - W17 - Solutions
• Due date: Saturday, February 18, 2017 at midnight (11:59:59 pm)
• Partial or unsatisfactory solutions will only receive a fraction of the points.
Electronic Submission Guidelines
• All homework submissions must be electronic and submitted to the corresponding EEE dropbox.
• Only PDF ﬁles are accepted. Please DO NOT submit in any other format including plain text ﬁles, pictures,
Microsoft Word documents, LATEX source ﬁles, compressed archives, etc.
• Please submit only one ﬁle for solutions to all problems.
• PDF ﬁles must be typed. Please DO NOT submit or include handwritten/drawn parts (including those from
handwriting/drafting applications) or anything from a camera/scanner picture.
• Please name your submission “<student ID number>.pdf”, e.g. “12345678.pdf”, and indicate your
full name and student ID number in the ﬁle.
P1 (15 Points) Based on the textbook (Kurose-Ross) problem Chapter 1, P2 on page 71. Equation 1.1 on the
book gives a formula for the end-to-end delay of sending one packet of length L over N links of transmission rate
R, which is
d = N · L
R
(1)
(a) Assume one of the N links degraded and its transmission rate becomes R′ < R. Find the end-to-end delay of
the packet.
(b) Suppose the degraded link is the ﬁrst one of the N links. Generalize the end-to-end delay for sending P such
packets back-to-back over the N links.
(c) Suppose the degraded link is the last (N-th) one. Generalize the end-to-end delay as in (b).
Solution
(a) (5 pt) The given formula only counts transmission delay. Therefore, the end-to-end delay is the total trans-
mission time over (N −1) normal links and one degraded link, which is
d = (N −1) · L
R + L
R′
(b) (5 pt) The end-to-end delay of the ﬁrst packet is the expression we got in (a). Each other packet is L/R′ time
behind the previous one. Hence, the answer is
d = (N −1) · L
R + P · L
R′
(c) (5 pt) The same with (b).
P2 (10 Points) Solve the textbook (Kurose-Ross) problem Chapter 1, P8 on page 72. (Suppose users share a
3 Mbps link...)
Solution
(a) (2 pt) When circuit switching is used, each user needs a dedicated link of 150 kbps bandwidth. Therefore,
the total number of supported users is 3 × 106/150 × 103 = 20.
(b) (2 pt) 1/10 = 0.1.
(c) (3 pt) The answer is the product of (1) the probability that n speciﬁc users are transmitting, (2) the probability
that the other users are not transmitting, and (3) the number of combinations to choose such n users from the
total of 120 users, which is
0.1n · (1 −0.1)120−n · C120
n
,

---

## Page 2

2
where Cn
k is the combination number (binomial coefﬁcient), i.e.
Cn
k =
n
k

=

n!
k! · (n −k)!
(d) (3 pt) There are 121 different possible cases in total, where there are exactly 0, 1, 2, ..., 120 users transmitting
simultaneously, respectively. Hence, the answer is the sum of probability from multiple cases, which is
120
X
n=21
0.1n · (1 −0.1)120−n · C120
n
,
or equivalently
1 −
20
X
n=0
0.1n · (1 −0.1)120−n · C120
n
The numerical value is approximately 0.007941.
P3 (10 Points) Solve the textbook (Kurose-Ross) problem Chapter 1, P24 on page 75. (Suppose you would like
to urgently deliver 40 terabytes data from Boston to Los Angeles...)
Solution
The transmission time using the dedicated link is 40 × 1012 × 8/(100 × 106) = 3.2 × 106 sec ≈37.04 d. Hence, it
takes approximately 37 days to transmit these data via this dedicated link, while FedEx overnight delivery could
deliver these data in approximately one day. Since it is urgent, we would prefer FedEx overnight delivery.
P4 (10 Points) Solve the textbook (Kurose-Ross) problem Chapter 1, P25 on page 76. (Suppose two hosts, A
and B, are separated by 20,000 kilometers and are connected...)
Solution
(a) (2 pt) The propagation delay is dprop = 20000 × 103/(2.5 × 108) = 0.08 sec. Therefore, the bandwidth-delay
product is
R · dprop = 2 × 106 · 0.08 = 1.6 × 105 bit = 160 kbit
(b) (2 pt) The same with (a).
(c) (1 pt) The bandwidth-delay product is the maximum number of bits that could be in the link.
(d) (2 pt) The width of a bit is 20000 × 103/(1.6 × 105) = 125 m. It is longer than a football ﬁeld.
(e) (3 pt) The general expression for the width of a bit is
m
.
R · m
s

= s
R
P5 (20 Points) Consider the network shown in Fig. 1. Routers 1, 2, 3, and 4 forward packets at ﬁxed rates
R1=0.5 Mbit/s, R2=1.0 Mbit/s, R3=0.5 Mbit/s, and R4=2.0 Mbit/s, respectively. Routers 1 and 2 start the trans-
mission of packets A and B simultaneously. Router 2 transmits packets B and C back-to-back. The buffers of
routers 3 and 4 are empty. The size of packets A, B, and C is L=1 Mbit. Assume processing and propagation
delay are negligible. (Hint: Routers transmit packets at ﬁxed deterministic rates.)
(a) Find the end-to-end delay of packets A, B, and C.
(b) Solve the same problem, when R3=2.0 Mbit/s, and the rates of other routers remain unchanged.
(c) Find the end-to-end delay of packet C, when R3=2.0 Mbit/s, R4=1.0 Mbit/s, and the rates of other routers
remain unchanged.
Solution
(a) (7 pt) Compute the timelines of routers as follows:
Router 1 (0.5 Mbps)
0.0 – 2.0 sec
Packet A

---

## Page 3

3
Figure 1. Problem 1
Router 2 (1.0 Mbps)
0.0 – 1.0 sec
Packet B
1.0 – 2.0 sec
Packet C
Router 3 (0.5 Mbps)
1.0 – 3.0 sec
Packet B
3.0 – 5.0 sec
Packet C
Router 4 (2.0 Mbps)
2.0 – 2.5 sec
Packet A
3.0 – 3.5 sec
Packet B
5.0 – 5.5 sec
Packet C
Hence, the end-to-end delay of packets A, B, and C is respectively 2.5 sec, 3.5 sec, 5.5 sec.
(b) (7 pt) Compute the timelines of routers as follows:
Router 3 (2.0 Mbps)
1.0 – 1.5 sec
Packet B
2.0 – 2.5 sec
Packet C
Router 4 (2.0 Mbps)
1.5 – 2.0 sec
Packet B
2.0 – 2.5 sec
Packet A
2.5 – 3.0 sec
Packet C
Hence, the end-to-end delay of packets A, B, and C is respectively 2.5 sec, 2.0 sec, 3.0 sec.
(c) (6 pt) Compute the timelines of routers as follows:
Router 4 (1.0 Mbps)
1.5 – 2.5 sec
Packet B
2.5 – 3.5 sec
Packet A
3.5 – 4.5 sec
Packet C
Hence, the end-to-end delay of packet C is 4.5 sec.
P6 (10 Points) Consider a router whose transmission rate is R bit/s (ﬁxed rate). The time between two consecutive
packet arrivals in its (inﬁnite) buffer is an exponentially distributed variable with rate λ. The length of the packets
is an exponentially distributed variable with an average of L bits. At time 0, there is no packet in the buffer.
(a) Deﬁne T as the time when the last bit of the ﬁrst packet is transmitted by the router. Find E[T].
(b) Suppose by time s sec, no packet has ever arrived. Find the probability that the ﬁrst packet arrives before
(s + t) sec.
(c) Assume when packet A arrives, there are already N packets in the system, including the ﬁrst one of them
being served. Deﬁne dqueue as the queuing delay of packet A. Find E[dqueue].
Solution
(a) (3 pt) T is the sum of (1) the time to wait for the ﬁrst packet to come, and (2) the time to transmit the
ﬁrst packet, whose expectation is
E[T] = 1
λ + L
R
(b) (3 pt) P(X > s + t|X > s) = P(X > t) = e−λt. Hence, P(X < s + t|X > s) = 1 −e−λt.

---

## Page 4

4
(c) (4 pt) The queuing delay dqueue of packet A is the transmission time of the N packets that are already in the
buffer when A arrives. Therefore,
E[dqueue] = N · L
R
P7 (15 Points) A router receives packets from N applications. The time between the generation of two consecutive
packets of application k, k ∈1, 2, . . . , N is an exponentially distributed variable with rate λk. Assume no packet
is in the buffer at time 0.
(a) Deﬁne T1 as the inter arrival time of packets at the router. Find E[T1].
(b) Find the probability that the ﬁrst packet received by the router is generated by application 1.
(c) Deﬁne TN as the earliest time when the router has received at least one packet from each of the N applications.
For λ1 = λ2 = · · · = λN = λ and N = 3, solve E[TN]
Solution
(a) (4 pt) The inter arrival time T1 is the time to wait for the ﬁrst packet to come, whose expectation is
E[T1] = 1
, N
X
j=1
λj
(b) (4 pt) The probability that the ﬁrst packet is generated by application 1 is
λ1
, N
X
j=1
λj
(c) (7 pt) Method 1 – Using time to next packet from a different application, where
E[T3] =
1
3 · λ +
1
2 · λ + 1
λ =
1
3 + 1
2 + 1

· 1
λ = 11
6 · 1
λ
Method 2 – Using expected number of packets multiplied by average time to next packet, where
E[T3] = E[n3] ·
1
3 · λ =

1 + 3
2 + 3

·
1
3 · λ = 11
2 ·
1
3 · λ = 11
6 · 1
λ
P8 (10 Points) A router receives packets from one application. The time between the generation of two consecutive
packets of the application is an exponentially distributed variable with rate λ. The service time of the router is an
exponentially distributed variable with rate µ. Assume no packet is in the buffer at time 0.
(a) Find the probability that the ﬁrst packet (packet A) ﬁnishes transmission before the second packet (packet B)
arrives.
(b) Deﬁne N as the number of packets in the buffer after packet B arrives. Find E[N].
(c) Compute the average permanence time of packet B in the buffer (waiting time plus transmission time).
(d) Deﬁne T as the time when the last bit of packet B is transmitted by the router. Find E[T].
Solution
(a) (2 pt) There are two random events, (1) packet A ﬁnishes transmission with rate µ, and (2) packet B arrives
with rate λ. Therefore, the probability that “A ﬁnishes transmission” happens ﬁrst is
µ
λ + µ
(b) (2 pt) If packet A ﬁnishes transmission before packet B arrives, there is one packet (just B itself) in the
buffer after B arrives. Otherwise (i.e. if packet B arrives before A ﬁnishes transmission), there are two
packets (both A and B) in the buffer. Hence,
E[N] =
µ
λ + µ · 1 +
λ
λ + µ · 2 = 2 · λ + µ
λ + µ

---

## Page 5

5
(c) (2 pt) The permanence time of packet B is the transmission time of B plus the transmission time of any packet
that is in the buffer when B arrives, which equals
E[N] · 1
µ =
µ
λ + µ · 1
µ +
λ
λ + µ · 2
µ =
1
λ + µ +
2 · λ
λ · µ + µ2
(d) (4 pt) If packet A ﬁnishes transmission before packet B arrives, then T is the sum of (1) the time to wait
for A, (2) the time to transmit A, (3) the time to wait for B, and (4) the time to transmit B. Otherwise (i.e. if
packet B arrives before A ﬁnishes transmission), T is the sum of (1) the time to wait for A, (2) the time
to transmit A, and (3) the time to transmit B. Hence,
E[T] =
µ
λ + µ ·
 2
µ + 2
λ

+
λ
λ + µ ·
 2
µ + 1
λ

