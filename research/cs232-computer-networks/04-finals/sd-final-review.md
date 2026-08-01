# sd-final-review

---

## Page 1

DNS:
IF (IP/hostname resolved): Just IP
Else: <nameserver, IP>
NAT
IF same IP:port send with established outfacing
IP:Port. WAN side address: Router Interface IP,
Port++. LAN: IP and port.
SPLIT HORIZON/POISON REVERSE:
Does neighbor use focus to get to node on first
hop. Yes, infinity. No, count.
Distance Vector: when computing use full weights
Create Node x Node table
Initially fill with immediate nodes (1 edge)
Fill with distance to node starting at 2 edges now
LINK STATE ROUTING:
Run Dijkstra's on a node (To, Distance, Using)
Remember it’s weight from starting so make sure
to count up
(B,0,-) (E,1,E) | (A,2,A) Added E
(B,0,-) (E,1,E) | (A,2,A) (C,7,E) (F,4,E) E explore
(B,0,-) (E,1,E) (A,2,A) | (C,7,E) (F,4,E) Added A
(B,0,-) (E,1,E) (A,2,A) (C,7,E) (F,4,E) (D,5,A) Aexp
Vectors A would receive from neighbors
D: A B C D E F Inf Inf Inf 0 Inf Inf
B: A B C D E F Inf 0 5 Inf 1 4
C: A B C D E F 7 5 0 10 4 1

ARP Format: :SRC Type Port DST Port

BGP Routing:
  Customer-Provider
      Customer needs to be reachable from everyone
          Provider tells all neighbors how to reach the customer
      Customer does not want to provide transit service
          Customer does not let its providers route through it
  Peer-Peer
      Peers exchange traffic between customers
          AS exports only customer routes to a peer
          AS exports a peer’s routes only  to its customers

Traffic shaping controls the rate of sending by buffering excess incoming
traffic, while traffic policing drops any excess.
Signaling:
NRZ(Non return to zero) - High 1, Low 0
NRZI(NRZ Inverted) - Change 1, Maintain 0
Manchester - NRZ (xor) clock - 50% efficiency
Asynchronous: send these training bits every time
Synchronous:  big up front(preamble) send for long period
                          (trailer) - (i.e. NRZ NRZI Manchester)
Formulas:
RTT = 2 *(distance)/(speed of light)
Bandwidth-delay = (bandwidth)* (RTT/2)
Time to transmit all data = (data to transfer)/(bandwidth)
Total Time to get all data = (time to transmit all data) + (RTT/2)
Bandwidth: Power of 10 (1 Mbps: 1 * 10^6)File Size: Power of 2 (2^20 bytes
is 1 MB)
Scheduling & QOS
-

Treat flows individually, treat size as time
-

If weighted, divide size by weight
Speed of Light: (3 * 10^8)
Distance: meters
Bandwidth: bits/second

HW 1: (ASes do not wish to expose their internal topology to other ASes)
1.
Sentinel: 101 1111 10
2.
2d + 1 = hamming distance, 2d = detection, d correction, one bit parity has hamming distance of 2
3.
CRC: Pad data with len(CRC)-1 0s, divide by CRC replace 0s with remainder
4.
Learning Bridges: If a a packet is sent by a host, bridges will know how to get to that host, else transmit to everyone
5.
Spanning Tree: take shortest path to B1, if tie pick smaller router number
Naming
-

DHCP - Automates host boot up, given a MAC assigns IP
-

On Boot up : Host: “DHCP discover” -> DHCP server: “DHCP offer”-> Host:
“DHCP
request”-> DHCP server: IP, “DHCP Ack”
Link State Routing AND Distance Vector Routing
-

Forwarding Options: Source Routing vs  Virtual Circuits vs  Destination Based Forwarding
(Forwarding Tables)
-

Routing Options: Link State Routing vs Distance Vector vs Path Vector
-

Link State Routing - Reliable Flooding (tell all routers what you know) then Path Calculation
(Dijkstra's)
-

Link State Converges quickly on topology failure, but causes flood of
updates(Transient Disruption)
-

Examples: IS-IS, OSPF(Open Shortest Path First)
-

Strengths: Loop Free, Messages are small, converges quickly,
guaranteed convergence
-

Weakness: Must flood data across entire network & Must maintain
state for
entire topology
-

Distance Vector: Each Router knows own address and cost to reach direct neighbors
-

dx(y) = min {c(x,v) + dv(y)} - Iterative, asynchronous, distributed
-

Problem: Counting to infinity if one edge goes down
-

Solutions: Hold Downs, Loop Avoidance, Split Horizon w/ Poison Reverse (only
works
on loops size 2)
-

Examples: RIP(Routing Information Protocol) & EIGRP: (ensures loop freedom)
-

Weaknesses: Weak at adapting to changes out of the box
Interdomain Routing
-

Exterior Gateway Protocols (EGPs): Only exchange reachability information (not specific metrics)
-

Path vector: send the entire path for each destination - Node can easily detect/discard a loop/keep local policies
-

Border Gateway Protocol (BGP): Establish Session -> Exchange all active routes ->Exchange incremental updates
-

Attributes: AS path, next hop, ORigin, Local pref(rankings), multi exit discriminator, community
-

Problems: Instability: not guaranteed to converge, Performance, Scalability
Router Design
-

Control pane(slow, handles firewall, routing table, admission control) vs Data Pane ( ast, per packet, handles forwarding, switching, output scheduling)
-

Buffer management: Which packets to drop? Vs Scheduling: which packets to transmit next
-

AQM(Active Queue Management): Engage the router in the congestion control by detecting overloading b/c router can see actual queue occupancy
RED - If avg < min-th do nothing - If avg > max-th, drop packet - Else drop/mark packet proportional to queue length
Token Bucket - r (average rate token gets dropped), b(bucket depth), R(maximum rate tokens leave - drain rate)

---

## Page 2

Links And Signaling
‒
Integrated Services (guarantees end-to-end delivery) vs Differentiated Services (motivated by economics)
‒
Modem: takes input stream of bits, modulates some physical media to send data, demodulates the signal to get bits.
‒
Signal: is some form of energy (light, voltage,etc) travels on Channel (a physical medium that conveys energy)
‒
Bandwidth-Limited: refers to the the range of frequencies the channel will transmit
‒
Power attenuates over distance
‒
Different frequencies have different response (distortion) AKA attenuate differently.
‒
Coaxial Cable: copper core, insulation, braided outer conductor, outer insulation (twisted pair)
‒
Fiber Optics: comes in two modes (multimode and single mode - longer but stricter)
‒
Spectrum Allocation: a policy that forces the radio spectrum to be allocated like a fixed spatial resource
‒
Baseband modulation: means to send the “bare” signal so all signals fall in the same frequency range
‒
Broadband modulation: shifts signal to carrier frequency and sends it out
 Weighted Fair Queing implements max-min fairness
Modulation/Clock Recovery
●
Delay(seconds), Overhead(seconds/cycles), Error rate(probability)
●
Amplitude Shift Keying(louder: 1, quieter: 0) vs Frequency Shift Keying(high: 1, low: 0) vs Phase SK(Shift phase)
●
Bandlimited channels cannot respond faster than some maximum frequency f, if attempted(intersymbol interference)
●
Nyquist Limit tells us In a channel bandlimited to f, we can send at maximum 2f symbol (baud rate).
●
Baud rate is the speed at which symbols can be communicated across a channel; bit rate depends on the information rate of each symbol. I.e., if each symbol corresponds
to more than one bit, bit rate will exceed baud rate.
●
Channel Capacity: C < 2 (bandwidth) log (base 2) (M) Where M is levels in voltage
●
Real channels are noisy and thus limits how many levels we can send
○
Number of bits per symbol: log (base 2) (S/2N)
○
S = Signal Power, 0V-3B, N = Noise, 0.5V, log(base 2) (3/1) = 1.58 bits per symbol
●
Shannon’s Law -  upper bound on any channel’s performance: Transmit Time: T = M/R + D
●
Bandwidth-Delay Product: R *D - Refers to how many bits can be “stored” in transfit, fill the channel.
●
So long as the receiver samples at 2f All is good, based off of the Nyquist formula
●
determine when to start sampling by sending a few training bits (initial training bits)
●
We also need to combat clock drift as signal proceeds, so we use transitions to keep clocks synced up
●
Congestion control prevents overrunning buffers in the network, while flow control prevents overflowing the receiver’s
Collision: Window-based flow control is simple to implement than rate based and does not require fine-grained clocks, but leads to more bursty behavior than rate-based flow
control.
Media Access Control
●
4B/5B - is a byproduct of manchester trying to prevent baseline drift by making sure 1 and 0s occur frequently(80%)
●
How to share Medium with multiple nodes Frequency Division Multiple Access (FDMA) vs Time Division Multiple Access (TDMA) vs Code Division Multiple Access
(CDMA)
●
Guaranteed bandwidth but aren’t well suited for random access usage bc wasteful when not used
●
Aloha -  retransmit after a random delay vs Slotted Aloha  backoff in slots instead of seconds (37%)
○
Requires time synchronization between hosts
●
Carrier Sense Multiple Access (CSMA)  - sending and listening at the same time
○
Non-persistent CSMA: give up, or send after some random delay vs 1-persistent CSMA: send as soon as channel is idle. Vs P-persistent CSMA: send the
packet with probability p where (p* number of packets) < 1
●
CSMA/CD - collision detection - Requires a minimum frame size
○
In order for collision detection to work, one of the hosts must be sending for 2 * (the propagation delay) amount
○
works well at load but collisions are a problem when load is high
●
Contention Free Protocols - (Polling vs Token Passing - Fiber Distributed Data Interface (FDDI))
○
 can make bandwidth guarantees, but complex and fragile
Ethernet: Ethernet won because it was cheap and easy to scale
802.11 (Frame Format - Start Frame Delimiter + Signal(describes data rate of the payload) + Data) - uses CSMA
●
Hidden Terminal Problem  [  A-------B-------C ]
○
B can communicate with both A and C. A and C cannot hear each other. A transmits to B, C cannot detect the transmission using the carrier sense mechanism.
Collision will occur at B.

●
Wifi uses half duplex so it can’t detect collision,uses  collision avoidance with carrier sense
●
Collision Avoidance - RTS/CTS (MACA) - Ensures C hears A when B rebroadcasts - If RTS packet collide, backoff in proportion to contention window
●
Distributed Coordination Function (DCF) - CSMA/CA
○
Uses a Network Allocation Vector (NAV) to implement collision avoidance
■
“The stations listening on the wireless medium read the Duration field and set their NAV, which is an indicator for a station on how long it must defer
from accessing the medium.”
■
Combined with RTS/CTS Avoids hidden terminal problem
