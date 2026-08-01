# chapter-05-v6-01

---

## Page 1

Chapter 5
Link Layer
rking: A
Top Down
Approach
6th edition
Jim Kurose, Keith
Ross
Addison-Wesley
March 2012
A note on the
We’re making these
They’re in PowerPoint form so you see the animations; and can add, modify,
and delete slides  (including this one) and slide content to suit your needs.
They obviously represent a lot of work on our part. In return for use, we only
ask the following:
v If you use these slides (e.g., in a class) that you mention their source
(after all, we’d like people to use our book!)
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
v understand principles behind link
layer services:
acc
§ link layer addressing
§ local area networks: Ethernet, VLANs
v instantiation, implementation of
various link layer technologies

---

## Page 3

Link Layer
5-3
Link layer, LANs: outline
5.1 introduction,
services
5.2 error detec
prot
5.4 LANs
§ addressing, ARP
§ Ethernet
§ switches
§ VLANS
5.5 link
virtualization:
S
 life
of a web request

---

## Page 4

Link Layer
5-4
Link layer:
introduction
terminology:
v hosts and routers:
nodes
v communication
comm
links
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
v datagram transferred
by different link
protocols over different
links:
relay
intermediate links,
802.11 on last link
v each  link protocol
provides different
services
§ e.g., may or may
not provide rdt over
link
transportation
analogy:
v trip from Princeton to
nne
to
Lausanne
v tourist = datagram
v transport segment =
communication link
v transportation mode =
link layer protocol
v travel agent = routing
algorithm

---

## Page 6

Link Layer
5-6
Link layer services
v framing, link access:
§ encapsulate datagram into frame, adding
header, trailer
§ channel acce
ium
• d
v reliable delivery between adjacent
nodes
§ we learned how to do this already (chapter
3)!
§ seldom used on low bit-error link (fiber,
some twisted pair)
§ wireless links: high error rates
• Q: why both link-level and end-end
reliability?

---

## Page 7

Link Layer
5-7
v flow control:
§ pacing between adjacent sending and receiving
nodes
v
§ rece
• signals sender for retransmission or drops frame
v error correction:
§ receiver identifies and corrects bit error(s) without
resorting to retransmission
v half-duplex and full-duplex
§ with half duplex, nodes at both ends of link can
transmit, but not at same time
Link layer services
(more)

---

## Page 8

Link Layer
5-8
Where is the link layer
implemented?
v in each and every host
v link layer implemented
in “adaptor” (aka
network interface card
NIC) or on a chi
Ethe
§ implements link,
physical layer
v attaches into host’s
system buses
v combination of
hardware, software,
firmware
controller
physical
transmission
host
bus
(e.g., PCI)
network adapter
card
n
link
physical

---

## Page 9

Link Layer
5-9
Adaptors communicating
v sending side:
§ encapsulates
datagram in frame
§ adds error checking
bits, rdt, flow
control, etc.
v receiving side
§ looks for errors, rdt,
flow control, etc
§ extracts datagram,
passes to upper
layer at receiving
side
controller
controller
datagram
datagram
frame

---

## Page 10

Link Layer 5-10
Link layer, LANs: outline
5.1 introduction,
services
5.2 error detec
prot
5.4 LANs
§ addressing, ARP
§ Ethernet
§ switches
§ VLANS
5.5 link
virtualization:
S
 life
of a web request

---

## Page 11

Link Layer 5-11
Error detection
EDC= Error Detection and Correction bits (redundancy)
D    = Data protected by error checking, may include header fields
• Error detection not 100% reliable!
• protocol may miss
y
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
sequ
integers
v checksum: addition
(1’s complement
sum) of segment
contents
v sender puts
checksum value
into UDP checksum
field
r:

ted
checksum equals
checksum field value:
§ NO - error detected
§ YES - no error
detected. But
maybe errors
nonetheless?
goal: detect “errors” (e.g., flipped bits) in
transmitted packet (note: used at transport
layer only)

---

## Page 14

Link Layer 5-14
Cyclic redundancy check
v more powerful error-detection coding
v view data bits, D, as a binary number
v choose r+1 bit pattern (generator), G
v goal: choose r
 that
rem
§ can detect all burst errors less than r+1 bits
v widely used in practice (Ethernet, 802.11 WiFi,
ATM)

---

## Page 15

Link Layer 5-15
CRC example
want:
D.2r XOR R = nG
equivalently:
.
r
    if w
by G, want
remainder R to
satisfy:
R = remainder[           ]
D.2r
G

---

## Page 16

Link Layer 5-16
Link layer, LANs: outline
5.1 introduction,
services
5.2 error detec
prot
5.4 LANs
§ addressing, ARP
§ Ethernet
§ switches
§ VLANS
5.5 link
virtualization:
S
 life
of a web request

---

## Page 17

Link Layer 5-17
Multiple access links,
protocols
two types of “links”:
v point-to-point
§ PPP for dial-up access
§ point-to-point link between Ethernet switch, host
§ ups
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
v two or more simultaneous transmissions by
nodes: interference
§ collision if no
or more signals at
multipl
v distributed algorithm that determines how nodes
share channel, i.e., determine when node can
transmit
v communication about channel sharing must use
channel itself!
§ no out-of-band channel for coordination

---

## Page 19

Link Layer 5-19
An ideal multiple access
protocol
given: broadcast channel of rate R bps
desiderata:

1. when one n
nsmit, it can send
sen
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
§ divide channel into smaller “pieces” (time slots,
frequency, code
§ cha
§ “recover” from collisions
v “taking turns”
§ nodes take turns, but nodes with more to send can
take longer turns

---

## Page 21

Link Layer 5-21
Channel partitioning MAC protocols:
TDMA
TDMA: time division multiple access
v access to channel in "rounds"
v each station gets fixed length slot
(length = pkt
 each round
v exam
 pkt,
slots
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
v unused transmi
quency bands go
v
freque
frequency bands
time
FDM cable
Channel partitioning MAC protocols:
FDMA

---

## Page 23

Link Layer 5-23
Random access protocols
v when node has packet to send
§ transmit at full channel data rate R.
§ no a priori coordination among nodes
v
t
w
o

o
r

m
o
r
e

t
r
a
n
s
m
i
t
t
i
n
g

n
o
d
e
s

➜

“
c
o
l
l
i
s
i
o
n
”
,
v
r
a
n
d
o
m

a
c
c
e
s
s

M
A
C

p
r
o
t
o
c
o
l

s
p
e
c
i
f
i
e
s
:

§
h
o
w

t
o

d
e
t
e
c
t

c
o
l
l
i
s
i
o
n
s
§
h
o
w

t
o

r
e
c
o
v
e
r

f
r
o
m

c
o
l
l
i
s
i
o
n
s

(
e
.
g
.
,

v
i
a

d
e
l
a
y
e
d

r
e
t
r
a
n
s
m
i
s
s
i
o
n
s
)
v
e
x
a
m
p
l
e
s

o
f

r
a
n
d
o
m

a
c
c
e
s
s

M
A
C

p
r
o
t
o
c
o
l
s
:
§
s
l
o
t
t
e
d

A
L
O
H
A
§
A
L
O
H
A
§
C
S
M
A
,

C
S
M
A
/
C
D
,

C
S
M
A
/
C
A

---

## Page 24

Link Layer 5-24
Slotted ALOHA
assumptions:
v all frames same size
v time divided int
v nodes
trans
beginning
v nodes are
synchronized
v if 2 or more nodes
transmit in slot, all
nodes detect collision
operation:
v when node obtains fresh
, transmits in next
 frame
in next slot
§ if collision: node
retransmits frame in
each subsequent slot
with prob. p until
success

---

## Page 25

Link Layer 5-25
Pros:
v single active node
can continuously
transmit at full rate
of channel
v highly decentralized:
only slots in nodes
need to be in sync
v simple
v collisions, wasting
slots
v idle slots
v nodes may be able
to detect collision in
less than time to
transmit packet
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

---

## Page 26

Link Layer 5-26
v
with
send, each transmits
in slot with
probability p
v prob that given node
has success in a slot
= p(1-p)N-1
v prob that any node
has a success =
Np(1-p)N-1
v max efficiency: find
p* that maximizes
Np(1-p)N-1
s:
    max efficiency = 1/e
= .37
efficiency: long-run
fraction of successful
slots
at best:
channel
used for useful
transmissions
37%
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
v collision probab
t

---

## Page 28

Link Layer 5-28
Pure ALOHA efficiency
P(success by given node) = P(node transmits) .
                                              P(no other node transmits in
[t0-1,t0] .
                                              P(no other node transmits in
[t0-1,t0]

                              … choosing optimum p and then letting n
                                                 = 1/(2e) = .18
even worse than slotted Aloha!

---

## Page 29

Link Layer 5-29
CSMA (carrier sense multiple
access)
CSMA: listen before transmit:
if channel sensed idle: transmit entire
frame
v human analogy: don’t interrupt
others!

---

## Page 30

Link Layer 5-30
CSMA collisions
v collisions can still
occur: propagation
delay means  two
nodes may not
v collisi
packet transmission
time wasted
§ distance &
propagation delay
play role in in
determining collision
probability
spatial layout of nodes

---

## Page 31

Link Layer 5-31
CSMA/CD (collision
detection)
CSMA/CD: carrier sensing, deferral as in
CSMA
§ collisions detected within short time
v collis
§ easy in wired LANs: measure signal strengths,
compare transmitted, received signals
§ difficult in wireless LANs: received signal
strength overwhelmed by local transmission
strength
v human analogy: the polite
conversationalist

---

## Page 32

Link Layer 5-32
CSMA/CD (collision
detection)
spatial layout of nodes

---

## Page 33

Link Layer 5-33
Ethernet CSMA/CD
algorithm

1. NIC receives
datagram from
network layer,
creates frame
frame
If NIC senses
channel busy, waits
until channel idle,
then transmits.
3. If NIC transmits
entire frame without
detecting another
transmission, NIC is
done with frame !
4. If NIC detects
another
transmission while
mitting,  aborts
g, NIC
enters binary
(exponential)
backoff:
§ after mth collision,
NIC chooses K at
random from
{0,1,2, …, 2m-1}.
NIC waits K·512 bit
times returns to

---

## Page 34

Link Layer 5-34
CSMA/CD efficiency
v Tprop = max prop delay between 2 nodes in
LAN
v ttrans = time to t
e frame
v efficiency goes to 1
§ as tprop goes to 0
§ as ttrans goes to infinity
v better performance than ALOHA: and simple,
cheap, decentralized!

---

## Page 35

Link Layer 5-35
“Taking turns” MAC
protocols
channel partitioning MAC protocols:
§ share channel efficiently and fairly at high
load
onl
random access MAC protocols
§ efficient at low load: single node can fully
utilize channel
§ high load: collision overhead
“taking turns” protocols
look for best of both worlds!

---

## Page 36

Link Layer 5-36
polling:
v master node
“invites” slave
nodes to trans
v
“du
devices
v concerns:
§ polling
overhead
§ latency
§ single point of
failure (master)
slaves
poll
“Taking turns” MAC
protocols

---

## Page 37

Link Layer 5-37
token passing:
v control token
passed from one
node to next
v
v conce
§ token overhead
§ latency
§ single point of
failure (token)

T
data
T
“Taking turns” MAC
protocols

---

## Page 38

cable headend
CMTS
ISP
v multiple 40Mbps downstream (broadcast) channels
§ single CMTS transmits into channels
v multiple 30 Mbps upstream channels
§ multiple access: all users contend for certain
upstream channel time slots (others assigned)
Cable access
network
Internet frames,TV channels, control  transmitted
downstream at different frequencies
upstream Internet frames, TV control,  transmitted
upstream at different frequencies in time slots

---

## Page 39

Link Layer 5-39
DOCSIS: data over cable service interface
spec
v FDM over upstream, downstream frequency
channels
v TDM upstream: some slots assigned, some
have contention
§ downstream MAP frame: assigns upstream
slots
MAP frame for
Interval [t1, t2]
Downstream channel i
Upstream channel j
upstream data frames
minislots request frames
cable headend
CMTS
Cable access
network

---

## Page 40

Link Layer 5-40
 Summary of MAC
protocols
v channel partitioning, by time, frequency or
code
§ Time Division, Frequency Division
v random access
§ car
gies
(wire), hard in others (wireless)
§ CSMA/CD used in Ethernet
§ CSMA/CA used in 802.11
v taking turns
§ polling from central site, token passing
§ bluetooth, FDDI,  token ring

---

## Page 41

Link Layer 5-41
Link layer, LANs: outline
5.1 introduction,
services
5.2 error detec
prot
5.4 LANs
§ addressing, ARP
§ Ethernet
§ switches
§ VLANS
5.5 link
virtualization:
S
 life
of a web request

---

## Page 42

Link Layer 5-42
MAC addresses and ARP
v 32-bit IP address:
§ network-layer address for interface
§ used for laye
er) forwarding
§ fun
om one
interface to another physically-connected
interface (same network, in IP-addressing
sense)
§ 48 bit MAC address (for most LANs) burned in
NIC ROM, also sometimes software settable
§ e.g.: 1A-2F-BB-76-09-AD
hexadecimal (base 16) notation
(each “number” represents 4 bits)

---

## Page 43

Link Layer 5-43
LAN addresses and ARP
each adapter on LAN has unique LAN address
adapter
58-23-D7-FA-20-B0
0C-C4-11-6F-E3-98
71-65-F7-2B-08-53
   LAN
(wired or
wireless)

---

## Page 44

Link Layer 5-44
LAN addresses (more)
v MAC address allocation administered by
IEEE
v manufacturer
of MAC
v
§ MA
ber
§ IP address: like postal address
v

M
A
C

f
l
a
t

a
d
d
r
e
s
s

➜

p
o
r
t
a
b
i
l
i
t
y

§
c
a
n

m
o
v
e

L
A
N

c
a
r
d

f
r
o
m

o
n
e

L
A
N

t
o

a
n
o
t
h
e
r
v
I
P

h
i
e
r
a
r
c
h
i
c
a
l

a
d
d
r
e
s
s

n
o
t

p
o
r
t
a
b
l
e
§

a
d
d
r
e
s
s

d
e
p
e
n
d
s

o
n

I
P

s
u
b
n
e
t

t
o

w
h
i
c
h

n
o
d
e

i
s

a
t
t
a
c
h
e
d

---

## Page 45

Link Layer 5-45
ARP: address resolution
protocol
ARP table: each IP node
, router) on LAN
for some
LAN nodes:
          < IP address; MAC
address; TTL>
§ TTL (Time To Live):
time after which
address mapping
will be forgotten
(typically 20 min)
Question: how to determine
interface’s MAC address,
knowing its IP address?
58-23-D7-FA-20-B0
0C-C4-11-6F-E3-98
71-65-F7-2B-08-53
   LAN
137.196.7.23
137.196.7.14
137.196.7.88

---

## Page 46

Link Layer 5-46
ARP protocol: same LAN
v A wants to send
datagram to B
§ B’s MAC address not
in A’s ARP table.
v A broadcasts A
addre
§ dest MAC address =
FF-FF-FF-FF-FF-FF
§ all nodes on LAN
receive ARP query
v B receives ARP
packet, replies to A
with its (B's) MAC
address
§ frame sent to A’s MAC
address (unicast)
v A caches (saves) IP-
to-MAC address pair
its ARP table until
s
nformation
that times out (goes
away) unless
refreshed
v ARP is “plug-and-
play”:
§ nodes create their
ARP tables without
intervention from net
administrator

---

## Page 47

Link Layer 5-47
walkthrough: send datagram from A to B via R
§ focus on addressing – at IP (datagram) and MAC
layer (frame)
§ assume A knows B’s IP address
§ assume A know
irst hop router, R
Addressing: routing to
another LAN
R
1A-23-F9-CD-06-9B
222.222.222.220
111.111.111.110
E6-E9-00-17-BB-4B
CC-49-DE-D0-AB-7D
111.111.111.112
111.111.111.111
74-29-9C-E8-FF-55
A
222.222.222.222
49-BD-D2-C7-56-2A
222.222.222.221
88-B2-2F-54-1A-0F
B

---

## Page 48

R
1A-23-F9-CD-06-9B
222.222.222.220
111.111.111.110
E6-E9-00-17-BB-4B
CC-49-DE-D0-AB-7D
111.111.111.112
111.111.111.111
74-29-9C-E8-FF-55
A
222.222.222.222
49-BD-D2-C7-56-2A
222.222.222.221
88-B2-2F-54-1A-0F
B
Link Layer 5-48
Addressing: routing to
another LAN
Eth
Phy
IP src: 111.111.111.1
v A creates IP datagram with IP source A, destination B
v A creates link-layer frame with R's MAC address as dest,
frame contains A-to-B IP datagram
MAC src: 74-29-9C-E8-FF-55
   MAC dest: E6-E9-00-17-

---

## Page 49

R
1A-23-F9-CD-06-9B
222.222.222.220
111.111.111.110
E6-E9-00-17-BB-4B
CC-49-DE-D0-AB-7D
111.111.111.112
111.111.111.111
74-29-9C-E8-FF-55
A
222.222.222.222
49-BD-D2-C7-56-2A
222.222.222.221
88-B2-2F-54-1A-0F
B
Link Layer 5-49
Addressing: routing to
another LAN
Eth
Phy
v frame sent from A to R
Phy
v frame received at R, datagram removed, passed up to
IP
MAC src: 74-29-9C-E8-FF-55
   MAC dest: E6-E9-00-17-
IP src: 111.111.111.1
IP src: 11
   IP dest

---

## Page 50

R
1A-23-F9-CD-06-9B
222.222.222.220
111.111.111.110
E6-E9-00-17-BB-4B
CC-49-DE-D0-AB-7D
111.111.111.112
111.111.111.111
74-29-9C-E8-FF-55
A
222.222.222.222
49-BD-D2-C7-56-2A
222.222.222.221
88-B2-2F-54-1A-0F
B
Link Layer 5-50
Addressing: routing to
another LAN
111.111.111.111
v R forwards datagram with IP source A, destination B
v R creates link-layer frame with B's MAC address as dest,
frame contains A-to-B IP datagram
MAC src: 1A-23-F9-CD-06-9B
9-BD-D2-C7-56-2A
Phy
IP
Eth
Phy

---

## Page 51

R
1A-23-F9-CD-06-9B
222.222.222.220
111.111.111.110
E6-E9-00-17-BB-4B
CC-49-DE-D0-AB-7D
111.111.111.112
111.111.111.111
74-29-9C-E8-FF-55
A
222.222.222.222
49-BD-D2-C7-56-2A
222.222.222.221
88-B2-2F-54-1A-0F
B
Link Layer 5-51
Addressing: routing to
another LAN
v R forwards datagram with IP source A, destination B
v R creates link-layer frame with B's MAC address as dest,
frame contains A-to-B IP datagram
111.111.111.111
MAC src: 1A-23-F9-CD-06-9B
9-BD-D2-C7-56-2A
Phy
IP
Eth
Phy

---

## Page 52

R
1A-23-F9-CD-06-9B
222.222.222.220
111.111.111.110
E6-E9-00-17-BB-4B
CC-49-DE-D0-AB-7D
111.111.111.112
111.111.111.111
74-29-9C-E8-FF-55
A
222.222.222.222
49-BD-D2-C7-56-2A
222.222.222.221
88-B2-2F-54-1A-0F
B
Link Layer 5-52
Addressing: routing to
another LAN
v R forwards datagram with IP source A, destination B
v R creates link-layer frame with B's MAC address as dest,
frame contains A-to-B IP datagram
IP src: 111.111.111.111
   IP dest: 222.222.222.222
MAC src: 1A-23-F9-CD-06-9B
  MAC dest: 49-BD-D2-C7-56-2A
IP
Eth
Phy

---

## Page 53

Link Layer 5-53
Link layer, LANs: outline
5.1 introduction,
services
5.2 error detec
prot
5.4 LANs
§ addressing, ARP
§ Ethernet
§ switches
§ VLANS
5.5 link
virtualization:
S
 life
of a web request

---

## Page 54

Link Layer 5-54
Ethernet
“dominant” wired LAN technology:
v cheap $20 for NIC
v first widely used LAN technology
v simpler, cheap
Ns and ATM
Metcalfe’s Ethernet sketch

---

## Page 55

Link Layer 5-55
Ethernet: physical topology
v bus: popular through mid 90s
§ all nodes in same collision domain (can collide
with each other)
v star: prevails today
§ active switch
switch
bus: coaxial cable
star

---

## Page 56

Link Layer 5-56
Ethernet frame structure
sending adapter encapsulates IP
datagram (or other network layer
protocol pac
et frame
preamble:
v 7 bytes with pattern 10101010 followed
by one byte with pattern 10101011
v used to synchronize receiver, sender
clock rates

---

## Page 57

Link Layer 5-57
Ethernet frame structure
(more)
v addresses: 6 byte source, destination MAC
addresses
§ if adapter receives frame with matching
destination a
roadcast address
§ oth
v type: indicates higher layer protocol
(mostly IP but others possible, e.g., Novell
IPX, AppleTalk)
v CRC: cyclic redundancy check at receiver
§ error detected: frame is dropped
dest.
address
source
address
data
(payload)
CRC
preamble
type

---

## Page 58

Link Layer 5-58
Ethernet: unreliable,
connectionless
v connectionless: no handshaking between
sending and receiving NICs
v unreliable: re
oesnt send acks
if
ini
t (e.g.,
TCP), otherwise dropped data lost
v Ethernet’s MAC protocol: unslotted
CSMA/CD wth binary backoff

---

## Page 59

Link Layer 5-59
802.3 Ethernet standards: link & physical
layers
v many different Ethernet standards
§ common MAC protocol and frame format
§ different speeds: 2 Mbps, 10 Mbps, 100
Mbps, 1Gbps
application
transport
network
link
physical
MAC protocol
and frame format
100BASE-TX
100BASE-T4
100BASE-FX
100BASE-T2
100BASE-SX
100BASE-BX
fiber physical layer
copper (twister
pair) physical layer

---

## Page 60

Link Layer 5-60
Link layer, LANs: outline
5.1 introduction,
services
5.2 error detec
prot
5.4 LANs
§ addressing, ARP
§ Ethernet
§ switches
§ VLANS
5.5 link
virtualization:
S
 life
of a web request

---

## Page 61

Link Layer 5-61
Ethernet switch
v link-layer device: takes an active role
§ store, forward Ethernet frames
§ examine incoming frame’s MAC
address, s
ard  frame to
us
t
v transparent
§ hosts are unaware of presence of
switches
v plug-and-play, self-learning
§ switches do not need to be configured

---

## Page 62

Link Layer 5-62
Switch: multiple simultaneous
transmissions
v hosts have dedicated,
direct connection to
switch
v switches buffer
v
but no
duplex
§ each link is its own
collision domain
v switching: A-to-A’ and B-
to-B’ can transmit
simultaneously, without
collisions
switch with six interfaces
(1,2,3,4,5,6)
A
A’
B
B’
C
C’
1
2
3

---

## Page 63

Link Layer 5-63
Switch forwarding table
Q: how does switch know
A’ reachable via interface
4, B’ reachable via
interface 5?
switch with six interfaces
(1,2,3,4,5,6)
A
A’
B
B’
C
C’
1
2
3
v A:  each swit
entry
§ (MAC address of host,
interface to reach host,
time stamp)
§ looks like a routing table!
Q: how are entries
created, maintained in
switch table?
§ something like a routing
protocol?

---

## Page 64

A
A’
B
C
C’
1
2
6
Link Layer 5-64
Switch: self-learning
v switch learns which
hosts can be reached
through which
interfaces
of s
incoming LAN
segment
§ records
sender/location
pair in switch table
A A’
Source: A
Dest: A’
MAC addr   interface    TTL
Switch table
(initially empty)
A
1
60

---

## Page 65

Link Layer 5-65
Switch: frame
filtering/forwarding
when  frame received at switch:

1. record incoming link, MAC address of sending
host
3. if
  then {
     if destination on segment from which frame
arrived
       then drop frame
           else forward frame on interface indicated
by entry
       }
      else flood  /* forward on all interfaces
except arriving

---

## Page 66

A
A’
B
C
C’
1
2
6
Link Layer 5-66
Self-learning, forwarding:
example
A A’
Source: A
Dest: A’
MAC addr   interface    TTL
switch table
(initially empty)
A
1
60
v frame destination,
A’, locaton
unknown:
flood
A’ A
v destination A
A’
4
60
on just one link

---

## Page 67

Link Layer 5-67
Interconnecting switches
v switches can be connected together
Q: sending from A to G - how does S1
know to forward frame destined to F via
S4 and S3?
v A: self learning! (works exactly the
same as in single-switch case!)
B
S1
E
S4
S3

---

## Page 68

Link Layer 5-68
Self-learning multi-switch
example
Suppose C sends frame to I, I responds to C
v Q: show switch tables and packet forwarding
in S1, S2, S3, S4
B
S1
E
S4
S3

---

## Page 69

Link Layer 5-69
Institutional network
to external
network
route
net
mail server
web server

---

## Page 70

Link Layer 5-70
Switches vs.
routers
both are store-and-
forward:
§ routers: network-
layer devices
(examine netwo
§
device
link-layer headers)
both have forwarding
tables:
§ routers: compute
tables using routing
algorithms, IP
addresses
§ switches: learn
forwarding table using
application
transport
network
link
physical
work
link
physical
link
physical
datagram
application
transport
network
link
physical
frame
frame
frame
datagram

---

## Page 71

Link Layer 5-71
VLANs: motivation
consider:
v CS user moves office
to EE, but wants
nnect to CS switch?
2
broadcast traffic
(ARP, DHCP,
unknown location
of destination MAC
address) must
cross entire LAN
§ security/privacy,
efficiency issues
Computer
Science
Electrical
Engineering
Computer
Engineering

---

## Page 72

Link Layer 5-72
VLANs
port-based VLAN: switch ports
grouped (by switch
management software) so
that single physical switch
……
switch(es) supporting
VLAN capabilities ca
define m
LANS over single
physical LAN
infrastructure.
Virtual Local
Area Network
1
8
9
16
10
2
7
…
N ports 9-15)
15
Electrical Engineering
(VLAN ports 1-8)
…
1
8
2
7
9
16
10
15
…
Computer Science
(VLAN ports 9-16)
… operates as multiple virtual
switches

---

## Page 73

Link Layer 5-73
Port-based VLAN
9
7
…
Electrical Engineering
(VLAN ports 1-8)
Computer Science
(VLAN ports 9-15)
15
v traffic isolation: frames
to/from ports 1-8 can
only reach ports 1-8
§ can also define VLAN based
on MAC addresses
v
ports c
dynamically assigned
among VLANs
router
v forwarding between VLANS:
done via routing (just as
with separate switches)
§ in practice vendors sell
combined switches plus routers

---

## Page 74

Link Layer 5-74
VLANS spanning multiple
switches
v trunk port: carries frames between VLANS defined
over multiple physical switches
§ frames forwarded within VLAN between switches can’t be
vanilla 802.1 frames (must carry VLAN ID info)
§ 802.1q protocol adds/removed additional header fields
for frames forwarded between trunk ports
1
8
9
10
2
7
(VLAN ports 1-8
15
…
2
7
3
 CS VLAN
5
4
6
8
16
1

---

## Page 75

Link Layer 5-75
type
2-byte Tag Protocol Identifier
                        (value: 81-00)
Tag Control Information (12 bit VLAN ID field,
                          3 bit priority field like IP TOS)
Recomputed
CRC
802.1Q VLAN frame format
802.1 frame
e
dest.
address
source
address
data (payload)
CRC
preamble

---

## Page 76

Link Layer 5-76
Link layer, LANs: outline
5.1 introduction,
services
5.2 error detec
prot
5.4 LANs
§ addressing, ARP
§ Ethernet
§ switches
§ VLANS
5.5 link
virtualization:
S
 life
of a web request

---

## Page 77

Link Layer 5-77
Multiprotocol label switching
(MPLS)
v initial goal: high-speed IP forwarding
using fixed length label (instead of IP
address)
§ fast lookup u
 identifier
app
§ but IP datagram still keeps IP address!
PPP or Ethernet
header
IP header
remainder of link-layer frame
MPLS header
label
Exp S TTL
20
3
1
5

---

## Page 78

Link Layer 5-78
MPLS capable routers
v a.k.a. label-switched router
v forward packets to outgoing interface
based only o
don’t inspect IP
for
v flexibility:  MPLS forwarding decisions can
differ from those of IP
§ use destination and source addresses to route
flows to same destination differently (traffic
engineering)
§ re-route flows quickly if link fails: pre-
computed backup paths (useful for VoIP)

---

## Page 79

Link Layer 5-79
R2
D
A
R6
MPLS versus IP paths
IP router
v IP routing: path to destination
determined by destination
address alone

---

## Page 80

Link Layer 5-80
R2
D
R4
A
R6
MPLS versus IP paths
IP-only
router
v IP routing: path to destination
determined by destination
address alone
MPLS and
IP router
v MPLS routing: path to
destination can be based on
source and dest. address
§ fast reroute: precompute backup
routes in case of link failure
entry router (R4)  can use different MPLS
routes to A based, e.g., on source address

---

## Page 81

Link Layer 5-81
MPLS signaling
v modify OSPF, IS-IS link-state flooding
protocols to carry info used by MPLS
routing,
§ e.g., link ban
 of “reserved” link
D
R4
R5
A
R6
v entry MPLS r
VP-TE signaling
modified
link state
flooding
RSVP-TE

---

## Page 82

Link Layer 5-82
R1
R2
D
R3
R4
R5
0
1
0
0
A
R6
  in         out                 out
label     label   dest    interface
 6        -      A       0
  in         out                 out
 dest    interface
  in         out                 out
label     label   dest    interface
        10      A       0
        12      D
1
  in         out                 out
label     label   dest    interface
 8        6      A       0
0
MPLS forwarding tables

---

## Page 83

Link Layer 5-83
Link layer, LANs: outline
5.1 introduction,
services
5.2 error detec
prot
5.4 LANs
§ addressing, ARP
§ Ethernet
§ switches
§ VLANS
5.5 link
virtualization:
S
 life
of a web request

---

## Page 84

Link Layer 5-84
Data center networks
v 10’s to 100’s of thousands of hosts, often
closely coupled, in close proximity:
§ e-business (e.g. Amazon)
§ content-serv
be, Akamai, Apple,
v chal
§ multiple applications,
each serving massive
numbers of clients
§ managing/balancing
load, avoiding
processing, networking,
data bottlenecks
Inside a 40-ft Microsoft container,
Chicago data center

---

## Page 85

Link Layer 5-85
Server racks
TOR
switches
Tier-1 switches
Tier-2 switches

cer
Load
balancer
B
1
2
3
4
5
6
7
8
A
C
Internet
Data center networks
load balancer: application-layer
routing
§ receives external client requests
§ directs workload within data center
ults to external client
m

---

## Page 86

Server racks
TOR
switches
ier-1 switches
Tier-2 switches
1
2
3
4
5
6
7
8
Data center networks
v rich interconnection among switches, racks:
§ increased throughput between racks (multiple
routing paths possible)
§ increased rel
dancy

---

## Page 87

Link Layer 5-87
Link layer, LANs: outline
5.1 introduction,
services
5.2 error detec
prot
5.4 LANs
§ addressing, ARP
§ Ethernet
§ switches
§ VLANS
5.5 link
virtualization:
S
 life
of a web request

---

## Page 88

Link Layer 5-88
Synthesis: a day in the life of a web
request
v journey down protocol stack complete!
§ application, transport, network, link
v putting-it-all-together: synthesis!
§ goal: identify
tand protocols
§ sce
campus network, requests/receives
<www.google.com>

---

## Page 89

Link Layer 5-89
A day in the life: scenario
Comcast network
68.80.0.0/13
Google’s network
64.233.160.0/19
64.233.169.105
web server
DNS server
68.80.2.0
web page
browser

---

## Page 90

router
(runs DHCP)
Link Layer 5-90
A day in the life… connecting to the
Internet
v connecting laptop
needs to get its own
IP address, addr of
first-hop router, addr
of DNS server: use
CP
DHCP
UDP
IP
Eth
Phy
DHCP
DHCP
DHCP
DHCP
DHCP
U
I
Eth
Phy
DHCP
DHCP
DHCP
CP request

 in 802.3
Ethernet
v Ethernet frame
broadcast (dest:
FFFFFFFFFFFF) on LAN,
received at router
running DHCP server
v Ethernet demuxed to
IP demuxed, UDP
demuxed to DHCP

---

## Page 91

router
(runs DHCP)
Link Layer 5-91
v DHCP server
formulates DHCP ACK
containing client’s IP
address, IP address of
first-hop router for
nt, name & IP
dress of DNS server
DHCP
UDP
IP
Eth
Phy
DHCP
DHCP
DHCP
DHCP
U
I
Eth
Phy
DHCP
DHCP
DHCP
DHCP
gh
LAN, demultiplexing
at client
Client now has IP address, knows name & addr of DNS
server, IP address of its first-hop router
v DHCP client receives
DHCP ACK reply
A day in the life… connecting to the
Internet

---

## Page 92

router
(runs DHCP)
Link Layer 5-92
A day in the life… ARP (before DNS,
before HTTP)
v before sending HTTP
request, need IP address of
<www.google.com>:  DNS
DNS
UDP
IP
Eth
Phy
DNS
DNS
DNS
v DNS query created,
ulated in UDP,

uter
interface: ARP
v ARP query broadcast,
received by router, which
replies with ARP reply
giving MAC address of
router interface
v client now knows MAC
address of first hop router,
so can now send frame
containing DNS query
ARP query
ARP

---

## Page 93

router
(runs DHCP)
Link Layer 5-93
DNS
UDP
IP
Eth
Phy
DNS
DNS
DNS
DNS
DNS
v IP datagram containing
DNS query forwarded
via LAN switch from
client to 1st hop router
v IP datagram forwarded
from campus network into
comcast network, routed
(tables created by RIP,
OSPF, IS-IS and/or BGP
routing protocols) to DNS
server
v demux’ed to DNS
server
v DNS server replies to
client with IP address
of <www.google.com>
cast network
DNS server
DNS
UDP
IP
Eth
Phy
DNS
DNS
DNS
DNS
A day in the life… using DNS

---

## Page 94

router
(runs DHCP)
Link Layer 5-94
A day in the life…TCP connection carrying
HTTP
HTTP
TCP
IP
Eth
Phy
HTTP

 server
v TCP SYN segment (step
1 in 3-way handshake)
inter-domain routed to
web server
v TCP connection
established!
64.233.169.105
web server
SYN
SYN
SYN
SYN
TCP
IP
Eth
Phy
SYN
SYN
SYN
SYNACK
SYNACK
SYNACK
SYNACK
SYNACK
SYNACK
SYNACK
v web server responds
with TCP SYNACK (step 2
in 3-way handshake)

---

## Page 95

router
(runs DHCP)
Link Layer 5-95
A day in the life… HTTP
request/reply
HTTP
TCP
IP
Eth
Phy
HTTP

v IP datagram containing
HTTP request routed to
<www.google.com>
v IP datagram containing
HTTP reply routed back to
client
64.233.169.105
web server
HTTP
TCP
IP
Eth
Phy
v web server responds
with HTTP reply
(containing web page)
HTTP
HTTP
HTTP
HTTP
HTTP
HTTP
HTTP
HTTP
HTTP
HTTP
HTTP
HTTP
HTTP
v web page finally (!!!)
displayed

---

## Page 96

Link Layer 5-96
Chapter 5: Summary
v principles behind data link layer
services:
§ error detection, correction
§ sharing a bro
 multiple access
v insta

various link layer technologies
§ Ethernet
§ switched LANS, VLANs
§ virtualized networks as a link layer: MPLS
v synthesis: a day in the life of a web
request

---

## Page 97

Link Layer 5-97
Chapter 5: let’s take a
breath
v journey down protocol stack complete
(except PHY)
v solid understanding of networking
principles, pr
inter
§ wireless
§ multimedia
§ security
§ network management
