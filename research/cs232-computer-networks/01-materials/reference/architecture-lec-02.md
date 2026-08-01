# architecture-lec-02

---

## Page 1

Internet and Packet switching

---

## Page 2

Resource Sharing: Mul2plexing

---

## Page 3

Method 1 - Circuit-switching
CS 232 / © Marco Levorato
3
Tanenbaum ﬁg. 2-34(a)
“circuit-switching” refers to crea2ng an electrical
circuit for the dura2on of each telephone call.

---

## Page 4

Telephone switches
CS 232 / © Marco Levorato
4
Wikipedia Commons

---

## Page 5

Telephone crossbar switch
CS 232 / © Marco Levorato
5
Telephone switches oOen connect 10,000 lines
(not 8 as shown).
Tanenbaum ﬁg. 2-38

---

## Page 6

Telephone space division switch
CS 232 / © Marco Levorato
6
Telephone switches oOen connect 10,000 lines
(not 16 as shown).

---

## Page 7

Trunks: mul2plexing
•  Method 2 -- Frequency Division
Mul2plexing (FDM):
CS 232 / © Marco Levorato
7
Tanenbaum ﬁg. 2-24

---

## Page 8

Trunks: mul2plexing
•  Method 3 – Time Division Mul2plexing
(TDM):
– Sample each 125 μsec. Quan2ze each sample
into 7 bits. Combine 24 telephone calls.
CS 232 / © Marco Levorato
8
Tanenbaum ﬁg. 2-26

---

## Page 9

Trunks for TDM streams
CS 232 / © Marco Levorato
9
Tanenbaum ﬁg. 2-28

---

## Page 10

Time versus distance
CS 232 / © Marco Levorato
10
distance
2me
one hop
ﬁrst bit transmi^ed
last bit transmi^ed
dura2on of
call
ﬁrst bit received
last bit received
propaga2on
delay

---

## Page 11

Propaga2on delay
CS 232 / © Marco Levorato
11
distance
2me
one hop
ﬁrst bit transmi^ed
ﬁrst bit received
Propaga2on delay
= distance / propaga2on speed
Example:
Hop = 100 km
Propaga2on delay
= 100 km / (3 * 108 m/s)
= 333 μsec
propaga2on
delay

---

## Page 12

Time and distance
CS 232 / © Marco Levorato
12
Tanenbaum ﬁg. 2-35(a)
Horizontal axis is distance:
source = A, des2na2on =
D.
Ver2cal axis is 2me,
star2ng with the
beginning of the call at the
top.
Lines slope according to
propaga2on delay from
one loca2on to another.

---

## Page 13

Design comments
CS 232 / © Marco Levorato
13
•  1 Applica2on
•  Constant genera2on rate
•  Long unicast sessions
•  Sparse calls
•  Circuit switching
•  Resource reserved for
the en2re call
•  Delay to set up a path

---

## Page 14

Key no2ons:
CS 232 / © Marco Levorato
14
•  Topology
•  Hierarchy: mo2va2on
•  Structure of  the network (oﬃces, lines, trunks)
•  Mul2plexing (trunks)
•  FDM
•  TDM
•  Circuit switching
•  Physical switching
•  TDM switching
•  Delay

---

## Page 15

Telephone network design
CS 232 / © Marco Levorato
15
•  1 Applica2on (voice)
•  Constant traﬃc genera2on rate
•  Long unicast sessions
•  Sparse calls
•  Circuit switching
•  Resource reserved for the en2re call
•  QoS guaranteed (once the connec2on is
established)

---

## Page 16

Internet design
CS 232 / © Marco Levorato
16
•  Mul2ple applica2ons (e.g., ﬁle transfer, email)
•  Bursty traﬃc genera2on
•  Short (frequent) connec2ons
•  Packet switching
•  Resource sharing
•  Best eﬀort (design variable)

---

## Page 17

Packet Switching
•  Idea: decompose message into packets
–  Transmit the packets one by one.
•  Packet switches/routers replace telephone
routers.
–  Instead of sekng up “circuits” for each call, route
packets one by one.
–  Packets are buﬀered, ﬁrst in ﬁrst out.
•  Eﬃcient for bursty traﬃc
CS 232 / © Marco Levorato
17
Payload
Header
Trailer

---

## Page 18

Terminology
•
synchronous

–  all packets experience same delay from source to des2na2on
•
vs. asynchronous
–  packets experience diﬀerent delays from source to des2na2on, depending on
queuing in routers
•
connec2on-oriented
–  packets arrive in sequence sent
•
vs. connec2onless
–  packets don’t necessarily arrive in sequence sent; need packet ordering
•
reliable
–  no packets are dropped
•
vs. unreliable
–  some packets dropped by routers; may need packets retransmission
CS 232 / © Marco Levorato
18

---

## Page 19

Circuit switching vs. packet switching
•
Circuit switching
–  synchronous
–  connec2on-oriented
–  reliable
•
Datagram packet switching (without addi2onal mechanisms, e.g. UDP)
–  asynchronous
–  connec2onless
–  unreliable
•
Datagram packet switching (with addi2onal mechanisms, e.g. TCP)
–  To get synchronous, add buﬀering before playout (e.g. streaming
programs)
–  To connec2on-oriented, add resequencing (e.g. TCP or in applica2on)
–  To get reliable, add retransmissions (e.g. TCP or in applica2on)
CS 232 / © Marco Levorato
19

---

## Page 20

Topologies
CS 232 / © Marco Levorato
20
Tanenbaum ﬁg. 2-29

---

## Page 21

Topology: network of networks
CS 232 / © Marco Levorato
21
Access
ISP
Access
ISP
Access
ISP
Regional
ISP
IXP
IXP
Regional
ISP
Tier 1
ISP
Tier 1
ISP
Access
ISP
Access
ISP
Content
provider
ISP: internet service
provider
IXP: internet exchange
points
Hierarchal structure of networks (sub-level 2er is a costumer of
the higher level 2er)
Hosts connect to ISP via some access network
Tier 1 ISP: AT&T,
Sprint, NTT, etc.

---

## Page 22

ARPANET 12/69
CS 232 / © Marco Levorato
22
<www.cybergeography.org>

---

## Page 23

ARPANET 9/71
CS 232 / © Marco Levorato
23
<www.cybergeography.org>

---

## Page 24

ARPANET 10/80
CS 232 / © Marco Levorato
24
<www.cybergeography.org>

---

## Page 25

Internet (USA part) 1990
CS 232 / © Marco Levorato
25
Walrand ﬁg. 3.1

---

## Page 26

Internet core 8/10
CS 232 / © Marco Levorato
26
CAIDA / UC Regents

---

## Page 27

Internet host count
CS 232 / © Marco Levorato
27

---

## Page 28

Time and distance
CS 232 / © Marco Levorato
28
Tanenbaum ﬁg. 2-35(a)
Horizontal axis is distance:
source = A, des2na2on =
D.
Ver2cal axis is 2me,
star2ng with the
beginning of the call at the
top.
Lines slope according to
propaga2on delay from
one loca2on to another.

---

## Page 29

Queueing
CS 232 / © Marco Levorato
29
Packet is processed, then sent to the output queue
Input link
Output queues
Pkt is
processed
Router
Router
Router

---

## Page 30

CS 232 / © Marco Levorato
30
Payload
Header
Trailer
Why is the en2re packet processed before it is
forwarded?
First bit received
Last bit received
Error correc2on performed at each hop
Packet regenera2on (two steps: demodula2on/remodula2on,
and error correc2on)

---

## Page 31

Mul2plexing: TDM streams
CS 232 / © Marco Levorato
31
Tanenbaum ﬁg. 2-28

---

## Page 32

Multiplexing
CS 232 / © Marco Levorato
32
A
B
C
100 Mb/s
Ethernet
1.5 Mb/s
D
E
queue of packets
waiting for output
link
Kurose fig. 1.14
Statistical (vs deterministic) TDM
multiplexing
Function of: traffic rate of other nodes, congestion
(tx speed), etc.

---

## Page 33

Consequence
CS 232 / © Marco Levorato
33
Performance metrics (delay, throughput, packet
loss probability) of an individual packet are:
Random variables!

---

## Page 34

Demand
CS 232 / © Marco Levorato
34
2me
demand in bits per second
peak demand
average demand

---

## Page 35

Sharing
CS 232 / © Marco Levorato
35
2me
demand in bits per second
total of peak demand
total average demand
Beneﬁt of sharing

---

## Page 36

Cell phone networks
•  1G – circuit-switched analog voice
•  2G – circuit-switched digital voice &
rudimentary data
•  3G – circuit-switched digital voice & packet
switched data
•  4G – packet switched digital voice (VoIP) &
packet switched data
CS 232 / © Marco Levorato
36

---

## Page 37

Wired vs Wireless
CS 232 / © Marco Levorato
37
Wired: spa2al mul2plexing
Wireless: broadcast channel
Interference

---

## Page 38

Cell structure
•  Larger capacity
•  Larger infrastructure cost
•  More Uniform coverage
CS 232 / © Marco Levorato
38
6
1
2
5
4
3
7
2
6
1
3
1
7
2
4
5
4
6
3
7
5
Leon-Garcia ﬁg. 4.63
Channel reuse

---

## Page 39

Cell phone networks
CS 232 / © Marco Levorato
39
Kurose/Ross
Mobile
Switching
Center
Public telephone
network, and
Internet
Mobile
Switching
Center
MSCs control end-to-end connec2on, channel assignment and
handoﬀ, and are connected to the PTN and internet
To make calls:
Access channel
(conten2on based)
Incoming calls:
paging channel

---

## Page 40

GSM
CS 232 / © Marco Levorato
40
Tanenbaum
The BSC (Base sta2on controller) control channel
resource and handoﬀ
The MSC (Mobile Switching Center) routes calls using
the Visitor Loca2on Register (local users) and the Home
Loca2on Register (last known loca2on)
TDM: channels are assigned to mul2ple users

---

## Page 41

GSM
CS 232 / © Marco Levorato
41
Tanenbaum
FDM + TDM: channels are assigned to mul2ple users
Downstream/upstream in diﬀerent slots (half-duplex)

---

## Page 42

Cell phone Internet access
•  2 merging families of standards (GSM, CDMA)
•  FDM/TDM/CDMA used to deﬁne “channels”
•  downstream (base sta2on to mobile)
–  packet switching
–  no conten2on!
•  upstream (mobile to base sta2on)
–  conten2on!
–  typically use a version of slo^ed ALOHA to reserve
2meslots
–  also uses power and rate alloca2on
CS 232 / © Marco Levorato
42

---

## Page 43

Cable TV networks
CS 232 / © Marco Levorato
43
Head
end
= Unidirec2onal
ampliﬁer
Leon-Garcia ﬁg. 3.51

---

## Page 44

Cable TV networks
CS 232 / © Marco Levorato
44
Leon-Garcia ﬁg. 3.52
Head
end
Upstream ﬁber
Downstream ﬁber
Fiber
node
Coaxial
distribu2on
plant
Fiber
node
= Bidirec2onal
split-band
ampliﬁer
Fiber
Fiber

---

## Page 45

Cable TV networks
CS 232 / © Marco Levorato
45
Leon-Garcia ﬁg. 3.53
Downstream
54 MHz
500 MHz
Downstream
 only
550 MHz
750
 MHz
Upstream
Downstream
5 MHz
42 MHz
54 MHz
500 MHz
Upstream &
downstream
Addi2onal
 downstream
