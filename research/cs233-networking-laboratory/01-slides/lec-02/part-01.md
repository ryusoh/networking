# lec-02 - Part 01 (Pages 1-23)

---

## Page 1

Computer
Networking: A Top
Down Approach
A note on the use of these Powerpoint slides:
Were making these slides freely available to all (faculty, students, readers).
They’re in PowerPoint form so you see the animations; and can add, modify,
and delete slides  (including this one) and slide content to suit your needs.
They obviously represent a lot of work on our part. In return for use, we only
ask the following:
§ If you use these slides (e.g., in a class) that you mention their source
(after all, wed like people to use our book!)
§ If you post any slides on a www site, that you note that they are adapted
from (or perhaps identical to) our slides, and note our copyright of this
material.
Thanks and enjoy!  JFK/KWR
All material copyright 1996-2016
J.F Kurose and K.W. Ross, All Rights Reserved
7th edition
Jim Kurose, Keith Ross
Pearson/Addison Wesley
April 2016
Chapter 6
The Link Layer
and LANs
6-1
Link Layer and LANs
1 of 46

---

## Page 2

Link layer, LANs: outline
6.1 introduction, services
6.2 error detection,
correction
6.3 multiple access
protocols
6.4 LANs
• addressing, ARP
• Ethernet
6-2
Link Layer and LANs
2 of 46

---

## Page 3

Link layer: introduction
terminology:
§ hosts and routers: nodes
§ communication channels that
connect adjacent nodes along
communication path: links
• wired links
• wireless links
• LANs
§ layer-2 packet: frame,
encapsulates datagram
data-link layer has responsibility of
transferring datagram from one node
to physically adjacent node over a link
6-3
Link Layer and LANs
3 of 46

---

## Page 4

Data Link Layer in IETF
Data Link Layer
5-4
Network
Layer
Data Link
Layer
Physical
Layer
Network
Layer
Data Link
Layer
Physical
Layer
Datagram
Frame
Bits - Signal
neon.tcpip-lab.edu
"Neon"
128.143.71.21
argon.tcpip-lab.edu
"Argon"
128.143.137.144
router137.tcpip-lab.edu
"Router137"
128.143.137.1
router71.tcpip-lab.edu
"Router71"
128.143.71.1
Ethernet Network
Ethernet Network
Router
Argon
Neon
The actual path
followed by data
4 of 46

---

## Page 5

Link layer services
§ framing:
• encapsulate datagram into a frame, adding
header, trailer
• header contains hardware (network interface
card) source and destination addresses
§ link access:
• channel access – when to transmit
• point to point - half vs full duplex (with half duplex,
nodes at both ends of link can transmit, but not at
same time, full duplex allows transmission in both
directions simultaneously)
• shared medium - much more involved
§ flow control:
• pacing between sending and receiving nodes
6-6
Link Layer and LANs
5 of 46

---

## Page 6

§ reliable delivery between nodes
• links have different error rates –> different error
control schemes
• simple schemes (e.g., detection only) used on low bit-
error links (fiber, coax, ……)
• more complex schemes (e.g., includes error recovery)
used on wireless links - have high error rates
Link layer services (more)
6-7
Link Layer and LANs
6 of 46

---

## Page 7

Where is the link layer implemented?
§ in each and every host
§ link layer implemented in
adaptor (aka network interface
card NIC) or on a chip
• e.g., Ethernet card, 802.11
card; Ethernet chipset
• implements link, physical
layer
§ attaches into host’s system
buses
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
6-8
Link Layer and LANs
• link-layer is combination of
software in host CPU
(addressing), hardware
(framing, error recovery, access
control), and firmware on NIC
7 of 46

---

## Page 8

Adaptors communicating
§ sending side:
• encapsulates datagram in
frame
• adds error checking bits,
flow control, error
recovery, etc.
§ receiving side
• looks for errors, flow
control, error recovery,
etc.
• extracts datagram, passes
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
6-9
Link Layer and LANs
8 of 46

---

## Page 9

Link layer, LANs: outline
6.1 introduction, services
6.2 error detection,
correction
6.3 multiple access
protocols
6.4 LANs
• addressing, ARP
• Ethernet
6-10
Link Layer and LANs
9 of 46

---

## Page 10

Reliable or unreliable delivery
§ errors caused by signal attenuation, noise,
interference
§ error detection:
• receiver detects presence of errors in received
information
• can drop frame and ignore error relying on higher layers
• can try to recover
§ error recovery:
• receiver, after detecting errors, can try to recover the
data
• correction: receiver identifies and corrects the bit error(s)
• retransmission: signals sender for retransmission of errored
frame
Data Link Layer
5-11
10 of 46

---

## Page 11

Error detection
EDC = Error Detection and Correction bits (redundancy)
D = Data protected by error checking, may include header fields
•
Error detection not 100% reliable!
•
protocol may miss some errors, but rarely
•
larger EDC field yields better detection and maybe some
correction
otherwise
6-12
Link Layer and LANs
D’=D -> ??
What next?
11 of 46

---

## Page 12

Error recovery
§ correction - EDC bits can also be used to correct
some bit errors (in conjunction with detection)
• correction requires larger number of EDC bits than just
detection - high overhead
• used for applications that cannot wait for correct data to be
retransmitted
§ retransmission - when error(s) detected
• receiver drops packet and data is retransmitted by sender
1.
waits for sender to timeout (no ACK received) and retransmit, or
2.
receiver sends a negative ACK (NACK) (speeds up process)
Data Link Layer
5-13
12 of 46

---

## Page 13

Link layer, LANs: outline
6.1 introduction, services
6.2 error detection,
correction
6.3 multiple access
protocols
6.4 LANs
• addressing, ARP
• Ethernet
6-14
Link Layer and LANs
13 of 46

---

## Page 14

Multiple access links, protocols
two types of links:
§ point-to-point: -> two people talking one on one
• point-to-point link (wired or wireless) between two devices
§ broadcast (shared wire or medium): –> group conversation
– has to be managed to avoid interference
• old-fashioned Ethernet (bus or hub)
• upstream cable network
• 802.11 wireless LAN (WiFi)
humans at a
cocktail party
(shared air, acoustical)
shared RF
(e.g., 802.11 WiFi)
shared wire (e.g.,
cabled Ethernet)
6-15
Link Layer and LANs
--->
14 of 46

---

## Page 15

Multiple access protocols
§ single shared channel
§ if two or more simultaneous transmissions on the
channel by nodes à interference
• interference à collision if node receives two or more signals
at the same time
multiple access protocol
§ distributed algorithm that determines how nodes
share channel, i.e., determine when node(s) can
transmit to hopefully avoid collision
§ communication about channel sharing often uses
channel itself!
• i.e., inband, instead of out-of-band (separate) channel for
coordination
6-16
Link Layer and LANs
15 of 46

---

## Page 16

MAC protocols: taxonomy
three broad classes:
§ channel partitioning
• divide channel into smaller pieces (time slots, frequency, code)
• allocate piece to node for exclusive use
§ random access
• no allocations, allow collisions
• recover from collisions
§ taking turns
• nodes take turns, but nodes with more to send can take longer
turns
6-17
Link Layer and LANs
16 of 46

---

## Page 17

Random access protocols
§ when node has packet to send
• transmit, possibly at full channel data rate R or in
random time slots
• no a priori coordination among nodes
§ two or more transmitting nodes on channel or
use same time slot  collision
§ random access MAC protocol should specify:
• how to detect collisions – signal comparison, no ACK,
etc
• how to recover from collisions (e.g., via delayed
retransmissions)
§ examples of random access MAC protocols:
• ALOHA, slotted ALOHA
• CSMA, CSMA/CD, CSMA/CA
6-18
Link Layer and LANs
17 of 46

---

## Page 18

CSMA (carrier sense multiple access)
CSMA: listen before transmit:
if channel sensed idle: transmit entire frame
§ if channel sensed busy, defer
transmission
§ human analogy: don’t interrupt when
someone starts talking!
6-19
Link Layer and LANs
18 of 46

---

## Page 19

CSMA collisions
§ collisions can still occur:
propagation delay
means  two nodes may
not hear each others
transmission
§ collision: entire packet
transmission time
wasted
• distance &
propagation delay
play role in in
determining collision
probability
spatial layout of nodes
6-20
Link Layer and LANs
19 of 46

---

## Page 20

CSMA/CD (collision detection)
CSMA/CD: carrier sensing, deferral as in CSMA
• collisions detected within short time
• colliding transmissions aborted, reducing channel wastage
§ collision detection:
• easy in wired LANs: measure signal strengths, compare
transmitted, received signals – requires a constraint on
distance and min frame size
• difficult in wireless LANs: received signal strength
overwhelmed by local transmission strength
§ human analogy - abort: the polite conversationalist
stops when someone else starts talking.
6-21
Link Layer and LANs
20 of 46

---

## Page 21

CSMA/CD (collision detection)
spatial layout of nodes
6-22
Link Layer and LANs
21 of 46

---

## Page 22

CSMA/CD algorithm

1. NIC receives datagram
from network layer,
creates frame
2. If NIC senses channel idle,
starts frame transmission.
If NIC senses channel
busy, waits until channel
idle, then transmits
(sometimes with prob.
“p”). Why???
3. If NIC transmits entire
frame without detecting
another transmission, NIC
is done with frame!
4. If NIC detects another
transmission while
transmitting,  aborts and
sends jam signal
5. After aborting, NIC enters
binary (exponential) backoff:
• after mth collision, NIC
chooses K randomly
from {0,1,2, …, 2m-1}.
NIC waits K·512 bit
times, returns to Step 2
• longer backoff interval
with more collisions (m  )
6-23
Link Layer and LANs
22 of 46

---

## Page 23

Link layer, LANs: outline
6.1 introduction, services
6.2 error detection,
correction
6.3 multiple access
protocols
6.4 LANs
• Ethernet
• addressing, ARP
6-24
Link Layer and LANs
23 of 46
