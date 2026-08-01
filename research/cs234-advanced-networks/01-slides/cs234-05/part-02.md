# cs234-05 - Part 02 (Pages 24-45)

---

## Page 24

Comm. Model: Multicast
(3/3)
24
Media applications:
Many-to-Many
Star topology
(client-server)
Example:
MCU for video
conferencing
(Multipoint Control Unit)

---

## Page 25

Tradeoff Between Mesh and
Star Topologies (in App Layer)
´Mesh
´N-1 connections at each client
´(N × (N-1))/2 connections total
´Not scalable!
´Star
´1 connection per client
´Server resources become a
bottleneck
´Single point of failure
25
Tradeoff is common in
multimedia networking!

---

## Page 26

IP Multicast Comes to
Rescue
26
Router
Router
Router
Router
A
B
C
S
G
G
BTW, you can only do IP multicast with UDP packets…Why?

---

## Page 27

Current Status of Multicast
´IP multicast has been standardized long
ago and is implemented in almost all
major routers, but
´Technical and non-technical reasons hinder
its adoption in much of the Internet
´More precisely, it failed….
´Because of the unavailability of IP
multicast, still too many applications use
application-level multicast
´Can you think of some reasons?
27

---

## Page 28

What I can Think of….
´Who assigns a multicast address?
´Who pays for multicast traffic?
´How to inter-operate between
protocols?
´How can we prevent DoS?
´Next question is: What do unicast
transport protocols offer?
28

---

## Page 29

Agenda
´Media Streaming
´Video Quality Metrics
´Network Communication
Models
´Different Transport Protocols
´Multimedia Friendly Internet
29

---

## Page 30

Recap: What Is the Difference
Between TCP and UDP?
´TCP
´connection oriented
´packet ordering
´reliability
´congestion control
´UDP
´just send!
30

---

## Page 31

Conventional Wisdom
´Continuous media uses UDP
´Retransmission may not be useful
ß Why?
´Congestion control makes
throughput unpredictable ß Even
worse than low throughput
´Multicast + TCP has problems
31

---

## Page 32

The Fact is UDP Alone is Not
Enough
´Receiver will run into these
questions:
´Who sent this packet?
´How do I interpret this packet?
´When was this packet
generated?
´Which packets come first?
´Is this packet important?
´Should I ask for retransmission?
32

---

## Page 33

Solution: Application-Level
Framing
´Expose details to applications
´Let application decide what
to do with a packet, not
transport protocol
´Example: RTP for push-based
streaming ß More about this
next week
33

---

## Page 34

UDP and NAT Traversal
´Many residential computers use
network address translation (NAT)
34
Peer 1
Peer 2
NAT device
(Cable modem gateway)
NAT device
(DSL gateway)
192.168.0.1
192.168.1.3
128.125.4.204
209.7.114.157

---

## Page 35

NAT Traversal (1/2)
´Connection reversal
´When only the server is behind the NAT
´UPnP and ICE protocols
´Configure your gateway automatically
´TURN
´Concatenate two connections into a
single one
´ STUN
´STUN protocol (RFC 5389) and server to find my
public IP address
35

---

## Page 36

NAT Traversal (2/2)
´UDP hole punching
´Third party host is used to initially
establish correct state in the routers
´State periodically expires: keep-
alive messages may be needed in
the absence of traffic
´But only sub-80% successful rate!
´Modern workaround: TCP (a.k.a.
DASH) streaming
36

---

## Page 37

Agenda
´Media Streaming
´Video Quality Metrics
´Network Communication
Models
´Different Transport Protocols
´Multimedia Friendly Internet
37

---

## Page 38

Network Supports
38

---

## Page 39

Principle 1: Multiple Classes
of Services
´packet marking needed for router
to distinguish between different
classes; and new router policy to
treat packets accordingly
39
R1
R2

---

## Page 40

Principle 2: Marking and
Policing at the Edge
´provide protection (isolation)
for one class from others
40
R1
R2
1.5 Mbps link
1 Mbps
phone
packet marking and policing

---

## Page 41

Principle 3: Efficient Usage of
Left-Over Bandwidth
´while providing isolation, it is
desirable to use resources as
efficiently as possible
41
R1
R2
1.5 Mbps link
1 Mbps
phone
1 Mbps logical link
0.5 Mbps logical link

---

## Page 42

Principle 4: Can Not Go
Beyond Link Capacity
´Admission control: flow declares its
needs, network may block call
(e.g., busy signal) if it cannot meet
needs
42
R1
R2
1.5 Mbps link
1 Mbps
phone
1 Mbps
phone

---

## Page 43

Sample Mechanism: Policing
´goal: limit traffic to not exceed
declared parameters
´Three common-used metrics:
´average rate: how many pkts can be
sent per unit time (in the long run)
´peak rate: e.g., 6000 pkts per min (ppm)
avg.; 1500 ppm peak rate
´maximal burst size: max number of pkts
sent consecutively (with no intervening
idle)
43

---

## Page 44

Sample Implementation:
Policing
´ Token bucket:
´bucket can hold b tokens
´tokens generated at rate r token/sec unless
bucket full
´over interval of length t: number of packets
admitted less than or equal to  (r t + b)
´ Q1: What does a token bucket control? Average
rate? Peak Rate? Or Burst Size?
´ Q2: How do you control all three common
metrics?
44

---

## Page 45

45
Questions
<chsu@cs.nthu.edu.tw>
