# ch05-chapter-5-v6.01 - Part 01 (Pages 1-33)

---

## Page 1

Chapter 5
Link Layer
Computer
Networking: A Top
Down Approach
6th edition
Jim Kurose, Keith Ross
Addison-Wesley
March 2012
A note on the use of these ppt slides:
Were making these slides freely available to all (faculty, students, readers).
Theyre in PowerPoint form so you see the animations; and can add, modify,
and delete slides  (including this one) and slide content to suit your needs.
They obviously represent a lot of work on our part. In return for use, we only
ask the following:
v If you use these slides (e.g., in a class) that you mention their source
(after all, wed like people to use our book!)
v If you post any slides on a www site, that you note that they are adapted
from (or perhaps identical to) our slides, and note our copyright of this
material.
Thanks and enjoy!  JFK/KWR
All material copyright 1996-2012
J.F Kurose and K.W. Ross, All Rights Reserved
Link Layer
5-1

---

## Page 2

Link Layer
5-2
Chapter 5: Link layer
our goals:
v understand principles behind link layer
services:
§ error detection, correction
§ sharing a broadcast channel: multiple access
§ link layer addressing
§ local area networks: Ethernet, VLANs
v instantiation, implementation of various link
layer technologies

---

## Page 3

Link Layer
5-3
Link layer, LANs: outline
5.1 introduction, services
5.2 error detection,
correction
5.3 multiple access
protocols
5.4 LANs
§ addressing, ARP
§ Ethernet
§ switches
§ VLANS
5.5 link virtualization:
MPLS
5.6 data center
networking
5.7 a day in the life of a
web request

---

## Page 4

Link Layer
5-4
Link layer: introduction
terminology:
v hosts and routers: nodes
v communication channels that
connect adjacent nodes along
communication path: links
§ wired links
§ wireless links
§ LANs
v layer-2 packet: frame,
encapsulates datagram
data-link layer has responsibility of
transferring datagram from one node
to physically adjacent node over a link
global ISP

---

## Page 5

Link Layer
5-5
Link layer: context
v datagram transferred by
different link protocols over
different links:
§ e.g., Ethernet on first link,
frame relay on
intermediate links, 802.11
on last link
v each  link protocol provides
different services
§ e.g., may or may not
provide rdt over link
transportation analogy:
v trip from Princeton to Lausanne
§ limo: Princeton to JFK
§ plane: JFK to Geneva
§ train: Geneva to Lausanne
v tourist = datagram
v transport segment =
communication link
v transportation mode = link
layer protocol
v travel agent = routing
algorithm

---

## Page 6

Link Layer
5-6
Link layer services
v framing, link access:
§ encapsulate datagram into frame, adding header, trailer
§ channel access if shared medium
§ MAC addresses used in frame headers to identify
source, dest
• different from IP address!
v reliable delivery between adjacent nodes
§ we learned how to do this already (chapter 3)!
§ seldom used on low bit-error link (fiber, some twisted
pair)
§ wireless links: high error rates
• Q: why both link-level and end-end reliability?

---

## Page 7

Link Layer
5-7
v flow control:
§ pacing between adjacent sending and receiving nodes
v error detection:
§ errors caused by signal attenuation, noise.
§ receiver detects presence of errors:
• signals sender for retransmission or drops frame
v error correction:
§ receiver identifies and corrects bit error(s) without resorting to
retransmission
v half-duplex and full-duplex
§ with half duplex, nodes at both ends of link can transmit, but not
at same time
Link layer services (more)

---

## Page 8

Link Layer
5-8
Where is the link layer implemented?
v in each and every host
v link layer implemented in
adaptor (aka network
interface card NIC) or on a
chip
§ Ethernet card, 802.11
card; Ethernet chipset
§ implements link, physical
layer
v attaches into hosts system
buses
v combination of hardware,
software, firmware
controller
physical
transmission
cpu
memory
host
bus
(e.g., PCI)
network adapter
card
application
transport
network
link
link
physical

---

## Page 9

Link Layer
5-9
Adaptors communicating
v sending side:
§ encapsulates datagram in
frame
§ adds error checking bits,
rdt, flow control, etc.
v receiving side
§ looks for errors, rdt,
flow control, etc
§ extracts datagram, passes
to upper layer at
receiving side
controller
controller
sending host
receiving host
datagram
datagram
datagram
frame

---

## Page 10

Link Layer 5-10
Link layer, LANs: outline
5.1 introduction, services
5.2 error detection,
correction
5.3 multiple access
protocols
5.4 LANs
§ addressing, ARP
§ Ethernet
§ switches
§ VLANS
5.5 link virtualization:
MPLS
5.6 data center
networking
5.7 a day in the life of a
web request

---

## Page 11

Link Layer 5-11
Error detection
EDC= Error Detection and Correction bits (redundancy)
D    = Data protected by error checking, may include header fields
• Error detection not 100% reliable!
• protocol may miss some errors, but rarely
• larger EDC field yields better detection and correction
otherwise

---

## Page 12

Link Layer 5-12
Parity checking
single bit parity:
v detect single bit
errors
two-dimensional bit parity:
v detect and correct single bit errors
0
0

---

## Page 13

Link Layer 5-13
Internet checksum (review)
sender:
v treat segment contents
as sequence of 16-bit
integers
v checksum: addition (1s
complement sum) of
segment contents
v sender puts checksum
value into UDP
checksum field
receiver:
v compute checksum of
received segment
v check if computed
checksum equals checksum
field value:
§ NO - error detected
§ YES - no error detected.
But maybe errors
nonetheless?
goal: detect errors (e.g., flipped bits) in transmitted packet
(note: used at transport layer only)

---

## Page 14

Link Layer 5-14
Cyclic redundancy check
v more powerful error-detection coding
v view data bits, D, as a binary number
v choose r+1 bit pattern (generator), G
v goal: choose r CRC bits, R, such that
§
<D,R> exactly divisible by G (modulo 2)
§ receiver knows G, divides <D,R> by G.  If non-zero remainder:
error detected!
§ can detect all burst errors less than r+1 bits
v widely used in practice (Ethernet, 802.11 WiFi, ATM)

---

## Page 15

Link Layer 5-15
CRC example
want:
D.2r XOR R = nG
equivalently:
D.2r = nG XOR R
equivalently:
if we divide D.2r by
G, want remainder R
to satisfy:
R = remainder[           ]
D.2r
G

---

## Page 16

Link Layer 5-16
Link layer, LANs: outline
5.1 introduction, services
5.2 error detection,
correction
5.3 multiple access
protocols
5.4 LANs
§ addressing, ARP
§ Ethernet
§ switches
§ VLANS
5.5 link virtualization:
MPLS
5.6 data center
networking
5.7 a day in the life of a
web request

---

## Page 17

Link Layer 5-17
Multiple access links, protocols
two types of links:
v point-to-point
§ PPP for dial-up access
§ point-to-point link between Ethernet switch, host
v broadcast (shared wire or medium)
§ old-fashioned Ethernet
§ upstream HFC
§ 802.11 wireless LAN
shared wire (e.g.,
cabled Ethernet)
shared RF
(e.g., 802.11 WiFi)
shared RF
(satellite)
humans at a
cocktail party
(shared air, acoustical)

---

## Page 18

Link Layer 5-18
Multiple access protocols
v single shared broadcast channel
v two or more simultaneous transmissions by nodes:
interference
§ collision if node receives two or more signals at the same
time
multiple access protocol
v distributed algorithm that determines how nodes share
channel, i.e., determine when node can transmit
v communication about channel sharing must use channel itself!
§ no out-of-band channel for coordination

---

## Page 19

Link Layer 5-19
An ideal multiple access protocol
given: broadcast channel of rate R bps
desiderata:

1. when one node wants to transmit, it can send at rate R.
2. when M nodes want to transmit, each can send at average
rate R/M
3. fully decentralized:
• no special node to coordinate transmissions
• no synchronization of clocks, slots
4. simple

---

## Page 20

Link Layer 5-20
MAC protocols: taxonomy
three broad classes:
v channel partitioning
§ divide channel into smaller pieces (time slots, frequency, code)
§ allocate piece to node for exclusive use
v random access
§ channel not divided, allow collisions
§ recover from collisions
v taking turns
§ nodes take turns, but nodes with more to send can take longer
turns

---

## Page 21

Link Layer 5-21
Channel partitioning MAC protocols: TDMA
TDMA: time division multiple access
v access to channel in "rounds"
v each station gets fixed length slot (length = pkt
trans time) in each round
v unused slots go idle
v example: 6-station LAN, 1,3,4 have pkt, slots
2,5,6 idle
1
3
4
1
3
4
6-slot
frame
6-slot
frame

---

## Page 22

Link Layer 5-22
FDMA: frequency division multiple access
v channel spectrum divided into frequency bands
v each station assigned fixed frequency band
v unused transmission time in frequency bands go idle
v example: 6-station LAN, 1,3,4 have pkt, frequency bands 2,5,6
idle
frequency bands
time
FDM cable
Channel partitioning MAC protocols: FDMA

---

## Page 23

Link Layer 5-23
Random access protocols
v when node has packet to send
§ transmit at full channel data rate R.
§ no a priori coordination among nodes
v two or more transmitting nodes  collision,
v random access MAC protocol specifies:
§ how to detect collisions
§ how to recover from collisions (e.g., via delayed
retransmissions)
v examples of random access MAC protocols:
§ slotted ALOHA
§ ALOHA
§ CSMA, CSMA/CD, CSMA/CA

---

## Page 24

Link Layer 5-24
Slotted ALOHA
assumptions:
v all frames same size
v time divided into equal size
slots (time to transmit 1
frame)
v nodes start to transmit
only slot beginning
v nodes are synchronized
v if 2 or more nodes transmit
in slot, all nodes detect
collision
operation:
v when node obtains fresh
frame, transmits in next slot
§ if no collision: node can send
new frame in next slot
§ if collision: node retransmits
frame in each subsequent
slot with prob. p until
success

---

## Page 25

Link Layer 5-25
Pros:
v single active node can
continuously transmit at
full rate of channel
v highly decentralized: only
slots in nodes need to be
in sync
v simple
Cons:
v collisions, wasting slots
v idle slots
v nodes may be able to
detect collision in less
than time to transmit
packet
v clock synchronization
Slotted ALOHA
1
1
1
1
2
3
2
2
3
3
node 1
node 2
node 3
C
C
C
S
S
S
E
E
E

---

## Page 26

Link Layer 5-26
v suppose: N nodes with
many frames to send, each
transmits in slot with
probability p
v prob that given node has
success in a slot  = p(1-
p)N-1
v prob that any node has a
success = Np(1-p)N-1
v max efficiency: find p*that
maximizes
Np(1-p)N-1
v for many nodes, take limit
of Np*(1-p*)N-1 as N goes
to infinity, gives:
max efficiency = 1/e = .37
efficiency: long-run
fraction of successful slots
(many nodes, all with many
frames to send)
at best: channel
used for useful
transmissions 37%
of time!
!
Slotted ALOHA: efficiency

---

## Page 27

Link Layer 5-27
Pure (unslotted) ALOHA
v unslotted Aloha: simpler, no synchronization
v when frame first arrives
§ transmit immediately
v collision probability increases:
§ frame sent at t0 collides with other frames sent in [t0-
1,t0+1]

---

## Page 28

Link Layer 5-28
Pure ALOHA efficiency
P(success by given node) = P(node transmits) .
P(no other node transmits in [t0-1,t0] .
P(no other node transmits in [t0-1,t0]
= p . (1-p)N-1 . (1-p)N-1
= p . (1-p)2(N-1)
… choosing optimum p and then letting n
= 1/(2e) = .18
even worse than slotted Aloha!

---

## Page 29

Link Layer 5-29
CSMA (carrier sense multiple access)
CSMA: listen before transmit:
if channel sensed idle: transmit entire frame
v if channel sensed busy, defer transmission
v human analogy: dont interrupt others!

---

## Page 30

Link Layer 5-30
CSMA collisions
v collisions can still occur:
propagation delay means
two nodes may not hear
each others
transmission
v collision: entire packet
transmission time
wasted
§ distance & propagation
delay play role in in
determining collision
probability
spatial layout of nodes

---

## Page 31

Link Layer 5-31
CSMA/CD (collision detection)
CSMA/CD: carrier sensing, deferral as in CSMA
§ collisions detected within short time
§ colliding transmissions aborted, reducing channel wastage
v collision detection:
§ easy in wired LANs: measure signal strengths, compare
transmitted, received signals
§ difficult in wireless LANs: received signal strength
overwhelmed by local transmission strength
v human analogy: the polite conversationalist

---

## Page 32

Link Layer 5-32
CSMA/CD (collision detection)
spatial layout of nodes

---

## Page 33

Link Layer 5-33
Ethernet CSMA/CD algorithm

1. NIC receives datagram
from network layer,
creates frame
2. If NIC senses channel
idle, starts frame
transmission. If NIC
senses channel busy,
waits until channel idle,
then transmits.
3. If NIC transmits entire
frame without detecting
another transmission,
NIC is done with frame !
4. If NIC detects another
transmission while
transmitting,  aborts and
sends jam signal
5. After aborting, NIC
enters binary (exponential)
backoff:
§ after mth collision, NIC
chooses K at random
from {0,1,2, …, 2m-1}.
NIC waits K·512 bit
times, returns to Step 2
§ longer backoff interval
with more collisions
