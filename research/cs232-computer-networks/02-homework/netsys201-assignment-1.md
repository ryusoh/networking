# netsys201-assignment-1

---

## Page 1

Assignment 1
for CS232/NetSys201 Fall 2017
Problem 1:
Suppose there is a 10Mbps microwave link between a geostationary satellite and its base
station on Earth. Every minute the satellite takes a digital picture (of the earth) and sends it to
the base station. Assume that propagation speed is "
.
a)
What is the propagation delay?
b) What is the bandwidth-delay product, "

c)
Let X be a the size of the photo. What is the minimum value for x that keeps the link
continuously transmitting?
d) If the pictures are half of such size, what is the maximum interval of time between pictures
that keeps the link busy?
e)
What is the average queueing time if I take a burst of 100 pictures of size S? What is the
maximum S such that I ﬁnish transmitting them before the next scheduled picture is taken
f)
How wide is a bit over the channel?
g)
What is the size of a picture such that it starts to be received before the transmitter stops
sending it? And what is the maximum amount of bits that can be on the channel at the
same time?
Problem 2:
(cont from P1) Let’s now suppose that the satellite takes pictures every Y seconds, with Y
distributed as an exponential random variable, with mean one minute.
f) What is the probability a picture will be taken in the next K seconds?
g) What is the average time at which the base station will have the next picture?
Problem 3:
Suppose N packets arrive simultaneously to a link in which no packets are currently being
transmitted or queued. Each packet is of length L and the link has transmission rate R.
a)
What is the average queueing delay for the N packets?
b) For each problem parameter, how can modify it (increase/decrease/uncorrelated) in order to
decrease the average queueing time?
c)
What is the maximum rate at which the link can accept packets if it doesn’t have a queue?
Problem 4:
Consider a link between a Server and a Client that is the concatenation of N links, each of
which has a packet loss probability p, and suppose that packet loss probabilities are
independent for each link. What is the probability that a packet, sent from the server, is
received at the client side? If a packet is lost in the path, the server “will know” and retransmit
a new packet. How many times, on average, will the server have to send the packet over the
link?
Problem 5:
Suppose that we have a network as in Figure 1. Routers 1,2,3,4 forward packets at ﬁxed rates
"
.
Packets A, B and C have all same length L = 1 Mbps. A starts from router 1, B and C from
router 2. Routers 1 and 2 start transmitting packets A, B simultaneously, and 2 sends B and C
back to back.
A) ﬁnd the end-to-end delay of packets A,B,C
B) Solve the problem for "

2.99x108m /s
R * dprop
R1 = 0.5Mbps, R2 = 2Mbps, R3 = 2Mbps, R4 = 3Mbps
R3 = 1Mbps

---

## Page 2

Problem 6:
A server receives packets from two diﬀerent clients. The time between the generation of two
consecutive packets at each client is exponentially distributed with parameter "
 for node 1,
and "
 at node B. Call A the next packet that 1 sends, and B the next packet node 2 sends.
The time the server takes to serve one packet is also exponentially distributed, with parameter
" . Assume no time is in the buﬀer at time 0.
A) ﬁnd the probability packet A ﬁnishes transmission before the second packet B arrives.
B) Deﬁne N as the number of packets in the buﬀer after packet B arrives. Find E[N].
C) compute the average permanence time of packet B in the buﬀer (waiting time plus
transmission time).
D) deﬁne T as the time when the last bit of packet B is transmitted by the router. Find E[T].
Problem 7: (extra)
Experiment with P19 in the Kurose Ross. Report any interesting result here.
λ1
λ2
μ
1
2
3
4
