# final-2013-fall

---

## Page 1

Prof. Athina Markopoulou
Introduction to Computer Networks
Fall 2013
CompSci 132/EECS148
Final Exam
(Friday, Dec. 13th, 2013, 1:30-3:30pm)
Open books, open notes. Computers and cellphones should be turned oﬀ.
Student’s Last Name:
Student’s First Name:
Student ID:
Email:
Problem #
Points
Out of Total
1
20
2
20
3
30
3
30
Total
100
Academic Honesty Policy:
I agree to abide by the UCI Academic Senate Policy on Academic Honesty (Appendix VIII.B),
which speciﬁes that students have responsibility for:

1. Refraining from cheating and plagiarism.
2. Refusing to aid or abet any form of academic dishonesty.
3. Notifying professors and/or appropriate administrative oﬃcials about observed incidents of
academic misconduct. The anonymity of a student reporting an incident of academic dishon-
esty will be protected.
Student’s Signature:
GOOD LUCK!
1

---

## Page 2

1. (20 Points) TCP. Consider the following plot of TCP window size as a function of time
(counted in number of RTTs). The coordinate of each turning point has been marked in the
plot.
(a) (5) Identify the intervals of time when TCP slow start is operating. What is the respec-
tive SSThres (slow start threshold) in TCP congestion control?
Answer:(0,4.5) and (13, 16). The SSThres are 25 and 16, respectively.
(b) (2 Points) Identify the interval(s) of time when TCP congestion avoidance is operating.
What is the respective SSThres?
Answer:(4,5, 12). The SSThres is 25.
(c) (3 Points) How many segments are lost from time 0 to 16?
Answer: 1
(d) (10 Points) Assume that no packet is lost during time 16-26. Complete the TCP con-
gestion window curve from time 16 to 26.
Answer:The critical information in the curve was the y-coordinate of the turning point
in what you add, which is the indicator of the SSThres.
2
Observe the exponential growth
in the window size
Observe a linear
Growth in
window size

---

## Page 3

2. (20 Points) Random Access Protocols. Consider hosts A,B,C that transmit on a shared
medium, using a random access protocol. Each host has exactly one frame to send, with
transmission time = 14 time units. Host A wants to transmit at time t = 0. Hosts B,C both
want to transmit at time t = 7, as shown in the ﬁgure below. Time is slotted and all hosts
are synchronized to the clock.
4
Frame transmission:
14 time units
0
14
28
A
B, C
Time
7
Frames arriving
from higher layers
If needed to make randomized decisions, each host has access to the following sequence of
random numbers, drawn uniformly at random between 0 and 1:
• Station A draws numbers: 0.45, 0.11, 0.71....
• Station B draws numbers: 0.10, 0.65, 0.91....
• Station C draws numbers: 0.83, 0.41, 0.25 ....
The numbers must be used in the sequence they are provided and each random number must
be used only once. You can decide to use these random numbers to make randomize decisions
as you like, as long as you state your rule. A commonly used rule is the following: given a
random number r ∈[0, 1], if you want to choose among N points, the point chosen is the kth
point (1 ≤k ≤N) where k = ⌈rN⌉. (Example 1: if you want to ﬂip a fair coin you can use
the random numbers as follows: r ≤0.5 means Heads, r > 0.5 means tails. Example 2: if
you try to pick one slot randomly out of two slots total: same, as before. Example 3: if you
try to pick one slot randomly out of four slots total, you can do the following: 0 ≤r < 0.25,
0.25 ≤r < 0.5, 0.5 ≤r < 0.75, 0.75 ≤r < 1 can correspond to the ﬁrst, second, third or
fourth timeslot.) You can use the same random numbers for both questions (a) and (b).
(a) (9 Points) Consider that nodes run a Slotted Aloha protocol, where the time slot equals
the ﬁxed duration of each frame =14 time units; i.e., slots start at time 0, 14, 28, ... etc.
Show all transmissions that take place according to the Slotted Aloha Protocol, until all
three frames are successful.
Answer: B and C start transmitting in the next slide they arrive. This will result in a
collision in the second slot. C ﬂips a coin for transmitting in the next slide and succeeds.
B on the other hand fails in the ﬁrst try and succeeds in the second try. Therefore it
will transmit in 2 slots after collision.
(b) (9 Points) Consider a CSMA/CD protocol with negligible propagation delay. This
means that all stations can detect very quickly whether there is a collision, let’s say
3

---

## Page 4

within one time-unit, which deﬁnes the contention slot (“mini-slot”) for CSMA/CD to
be one time unit. Frames are still 14 time units long.
As speciﬁed in CSMA (repeated here for your convenience), in a given mini-slot:
• If no host has seized the channel, then all hosts can compete. If exactly one host
transmits, then this host will continue until it completes its frame (1+13 minislots
long). If two or more nodes transmit, all colliding nodes detect the collision by
the end of the minislot and re-schedule their transmission to another minislot using
exponential backoﬀ. If no host transmits, the channel remains idle in that mini-slot.
• If some host has already seized the channel, all other hosts sense that and refrain
from transmitting until the end of transmission.
Answer:
At the beginning of the second slot both B and C sense the idle channel and start
transmitting. Quickly, in the ﬁrst mini slot they will sense the collision. They would try
to retransmit in the following mini slots with exponential beckoﬀ( 0 or 1). B will choose
the next minislot and will start retransmission. C will choose 1 in exponential back oﬀ
and choose the second mini slot. But before transmitting it will sense that B is using
channel so it will wait for B to ﬁnish his transmission then starts transmitting at time
29.
Question: show all transmissions that take place according to CSMA/CD until all frames
are successful.
(c) (2 Points) For this particular scenario, which protocol had the higher throughput: Slot-
ted Aloha or CSMA/CD?
Answer:
Slotted Aloha: 3∗14
56
CSMA/CD: 3∗14
43
4

---

## Page 5

3. (30 Points) Routers and Switches. Consider the following ﬁgure, depicting 6 desktops
(A,B,C,D,E,F), 3 switches (S1, S2, S3), 3 routers (R1, R2, R3) and one BSS. The BSS
consists of a WiFi Access Point (AP), 2 laptops (L1, L2) and one smartphone (P).
L1
AP
BBS
L2
P
Internet
R2
R1
R3
S1
S2
S3
A
C
D
E
F
B
<www.uci.edu>
dns.uci.edu
(a) (10 Points) IP addresses:
i. How many subnets are there? Assign IP addresses to all interfaces using subnets of
the form 192.168.1.xxx, 192.168.2.xxx, etc.
ii. Show the routing tables at each router, R1, R2, R3.
iii. When laptop L1 joins the BSS, describe the DHCP messages exchanged.
Note: For question (a)(iii),you do not need to describe layer-2 headers.
(b) (10 Points) Assume that all ARP tables are empty. Describe all MAC frames sent on
the network (for each frame indicate the source MAC, dest MAC, src IP, dest IP) when:
i. B sends a packet to D.
ii. D sends a packet to B.
5

---

## Page 6

(c) (10 Points) Assume that L1 knows the IP address of the web server (F), has already
set up a TCP connection and wants to send an HTTP request. Describe all the MAC
frames sent on the network (including at least the source MAC, dest MAC, src IP, dest
IP, and also some higher layer information) in the following cases:
i. L1 sends an HTTP request to F.
ii. F sends an HTTP response back to L1.
Note: For questions (b) and (c), when you describe the frames, it is ok to refer to the IP and
MAC addresses of an interface with a short name, e.g. IPA, MACA for A, etc.).
Answer:
(A)
i. 5 subnets (without considering the WAN connection to Internet).
Subnet 1: (R1-R2), 192.168.4/24
Subnet 2: (R2-S1-A-BSS), 192.168.5/24
Subnet 3: (R1-R3), 192.168.1/24
Subnet 4: (R3-S2-B-C-D), 192.168.2/24
Subnet 5: (R3-S3-E-F), 192.168.3/24
IP range assignment is arbitrary and you may use any range in 192.168.1.xxx, 192.168.2.xxx,
etc. Each subnet has 256 hosts and you may assign an IP address to each interface in a
subnet.
ii.
R1
192.168.0/22 to subnet3 interface
192.168.4/23 to subnet1 interface
192.168.0/24 to Internet interface
Others to Internet interface
R2
192.168.4/24 to subnet2 interface
Others to subnet1 interface
R3
192.168.2/24 to subnet4 interface
192.168.3/24 to subnet5 interface
Others to subnet1 interface
iii. Connecting laptop (L1) needs its IP address, addr of ﬁrst-hop router, addr of DNS server:
DHCP request encapsulated in UDP, encapsulated in IP, encapsulated in a link frame
The frame broadcast on LAN, received at DHCP server
The frame demuxed to IP demuxed to DHCP DHCP server formulated DHCP ACK contain-
ing client’s IP address, IP address of ﬁrst hop router for client, name and IP address of DNS
6

---

## Page 7

server Encapsulation of DHCP server, frame forwarded to client, demuxing up to DHCP at
client
Client now knows its IP address, name and IP address of DSN server, IP address of its ﬁrst-
hop router
(B) In this example, both the source and destination are in the same subnet.
i. B wants to send datagram to D, but D?s MAC address not in B?s ARP table. B broadcasts
ARP query packet, containing:
src MAC: MAC B
dest MAC: FF-FF-FF-FF-FF-FF
src IP: IPB
dest IP: IPD
All nodes on LAN receive ARP query as well as D. D replies to B with its MACD address,
and frame unicast to B, containing:
src MAC: MACD
dest MAC: MACB
src IP: IPD
dest IP: IPB
Now the B is able to send the packet to D:
src MAC: MACB
dest MAC: MACD
src IP: IPB
dest IP: IPD
ii. D wants to send datagram to B, and B?s MAC address is in Ds ARP table from previous
step (assuming that ARP query from B updated the ARP table in D). D sends the packet,
containing:
src MAC: MACD
dest MAC: MACB
src IP: IPD
dest IP: IPB
(C) i.
L1 to AP: (802.11 frame)
Addr1 MAC: MACAP
Addr2 MAC: MACL1
Addr3 MAC: MACR2
src IP: IPL1
dest IP: IPF
AP to R2: (802.3 frame)
src MAC: MACL1
7

---

## Page 8

dest MAC: MACR2
src IP: IPL1
dest IP: IPF
R2 to R1:
src MAC: MACR2
dest MAC: MACR1
src IP: IPL1
dest IP: IPF
R1 to R3:
src MAC: MACR1
dest MAC: MACR3
src IP: IPL1
dest IP: IPF
R3 to F:
src MAC: MACR3
dest MAC: MACF
src IP: IPL1
dest IP: IPF
ii.
F to R3:
src MAC: MACF
dest MAC: MACR3
src IP: IPF
dest IP: IPL1
R3 to R1:
src MAC: MACR3
dest MAC: MACR1
src IP: IPF
dest IP: IPL1
R1 to R2:
src MAC: MACR1
dest MAC: MACR2
8

---

## Page 9

src IP: IPF
dest IP: IPL1
R2 to AP: (802.3 frame)
src MAC: MACR2
dest MAC: MACL1
src IP: IPF
dest IP: IPL1
AP to L1: (802.11 frame)
Addr1 MAC: MACL1
Addr2 MAC: MACAP
Addr3 MAC: MACR2
src IP: IPF
dest IP: IPL1
9

---

## Page 10

SPACE for answer
10

---

## Page 11

4. (30 Points) Routing Algorithms.
Consider the undirected graph shown on the ﬁgure below. The nodes correspond to routers
and the edges correspond to links between the routers. There is a cost associated with every
edge as indicated on the ﬁgure.
S
C
T
B
F
G
D
E
 24
 18
 2
 9
 14
 15
 5
 10
 20
 44
 16
 11
 6
 19
 6
(a) (15 Points) Find the shortest paths from every node to destination node C. Use one
algorithm that you are comfortable with (Dijkstra, Bellman-Ford asynchronous or syn-
chronous). State which algorithm you chose and show your calculation on page 8. At
the end, show: (i) the shortest path tree from every node to C and (ii) the entry that
every node has in the routing table for destination C: (C, next hop, distance) (i.e., the
shortest path to destination C is “distance” away and via node “next hop”).
(b) (3 Points) If you use a synchronous version of distance-vector, what s the maximum
number of iterations before the distributed algorithm converges? (Notes: You can answer
that question without running the algorithm. In each “iteration”, nodes exchange their
distance vectors. The algorithm starts with all nodes having only information about
their costs to their nearest neighbors.)
(c) (12 Points) After the algorithm has converged, the link between C and E changes cost
from 2 to 1000. Use Bellman-Ford to compute the changes in the shortest paths, if any.
Show your calculation and the end result (as n question (a) above) on page 9.
Answer: Here is a summary of solution for both Dijkstra and Bellman-Ford. For complete ani-
mations refer to week8 of discussion slides.First set of ﬁguress show Dijkstra algorithm implemented
on this graph. The table shows the iterations of Bellman-Ford algorithm.
11

---

## Page 12

12

---

## Page 13

ADDITIONAL SPACE
13

---

## Page 14

14

---

## Page 15

Figure 1: iterations of bellman-Ford
Figure 2: shortest path
Figure 3: link change value
15

---

## Page 16

Figure 4: update of Bellman-Ford based on link value change
16
