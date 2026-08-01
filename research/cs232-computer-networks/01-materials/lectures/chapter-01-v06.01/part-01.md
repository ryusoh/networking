# chapter-01-v06.01 - Part 01 (Pages 1-38)

---

## Page 1

Introduction 1-1
Chapter 1
Introduction
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

---

## Page 2

Introduction
Chapter 1: introduction
our goal:
v get “feel” and
terminology
cour
v approach:
§ use Internet
as example
overview:
v what’s the Internet?
v what’s a protocol?
 edge; hosts, access
uit
t structure
v performance: loss, delay,
throughput
v security
v protocol layers, service
models
v history
1-2

---

## Page 3

Introduction
Chapter 1: roadmap
1.1 what is the Internet?
1.2 network edge
§ end syste
orks, links
structure
1.4 delay, loss, throughput in networks
1.5 protocol layers, service models
1.6 networks under attack: security
1.7 history
1-3

---

## Page 4

Introduction
What’s the Internet: “nuts and
bolts” view
vmillions of connected
computing devices:
§ hosts = end
syste
§ fiber, copper,
radio, satellite
§ transmission
rate:
bandwidth
vPacket switches:
forward packets
(chunks of data)
§ routers and
switches
wired
links
wireless
links
router
mobile network
global ISP
regional ISP
institutional
       network
smartphone
PC
server
wireless
laptop
1-4

---

## Page 5

Introduction
“Fun” internet appliances
Web-enabled toaster +
weather forecaster
Internet phones
Internet
refrigerator
Slingbox: watch,
control cable TV remotely
1-5
Tweet-a-watt:
monitor energy use

---

## Page 6

Introduction
v Internet: “network of
networks”
§ Interconnected ISPs
v protocols contro
802.
v Internet  standards
§ RFC: Request for comments
§ IETF: Internet Engineering
Task Force
What’s the Internet: “nuts and
bolts” view
mobile network
global ISP
regional ISP
institutional
       network
1-6

---

## Page 7

What’s the Internet: a service view
v Infrastructure that
provides services to
applications:
soci
v provides
programming
interface to apps
§ hooks that allow
sending and receiving
app programs to
“connect” to Internet
§ provides service
options analogous to
mobile network
global ISP
regional ISP
institutional
       network
Introduction 1-7

---

## Page 8

Introduction
What’s a protocol?
human protocols:
v “what’s the time?”
v “I have a question”
v introductions
… specific actions
taken when msgs
received, or other
events
network protocols:
v machines rather
than humans
munication
protocols define
format, order of
msgs sent and
received among
network entities,
and actions taken
on msg
1-8

---

## Page 9

Introduction
a human protocol and a computer network
protocol:
Q: other human
protocols?
Hi
Got the
time?
2:00
Get <http://www.awl.com/kurose-ross>
<file>
time
P connection
What’s a protocol?
1-9

---

## Page 10

Introduction
Chapter 1: roadmap
1.1 what is the Internet?
1.2 network edge
§ end syste
orks, links
structure
1.4 delay, loss, throughput in networks
1.5 protocol layers, service models
1.6 networks under attack: security
1.7 history
1-10

---

## Page 11

Introduction
A closer look at network
structure:
v network edge:
§ hosts: clients and
servers
§ servers often
v
physi
wired, wireless
communication
links
v network core:
§interconnected
routers
§network of
networks
mobile network
global ISP
regional ISP
institutional
       network
1-11

---

## Page 12

Introduction
Access networks and physical
media
Q: How to connect
end systems to
edge router?
v residential acc
comp
v mobile access
networks
keep in mind:
v bandwidth (bits per
second) of access
network?
v shared or dedicated?
1-12

---

## Page 13

Introduction
Access net: digital subscriber
line (DSL)
central office
telephone
network
voic
at differe
dedicated line to central office
v use existing telephone line to central office DSLAM
§ data over DSL phone line goes to Internet
§ voice over DSL phone line goes to telephone net
v < 2.5 Mbps upstream transmission rate (typically <
1 Mbps)
v < 24 Mbps downstream transmission rate (typically
< 10 Mbps)
DSL
modem
splitter
multiplexer
1-13

---

## Page 14

Introduction
Access net: cable
network
cable
modem
splitter
…
cable headend
Channels
V
I
D
E
O
V
I
D
E
O
V
I
D
E
O
V
I
D
E
O
V
I
D
E
O
V
I
D
E
O
D
A
T
A
D
A
T
A
C
O
N
T
R
O
L
1
2
3
4
5
6
7
8
9
frequency division multiplexing: different channels tra
in different frequency bands
1-14

---

## Page 15

Introduction
da
f
dis
cable
modem
splitter
…
cable headend
CMTS
cable modem
termination system
v HFC: hybrid fiber coax
§ asymmetric: up to 30Mbps downstream
transmission rate, 2 Mbps upstream
transmission rate
v network of cable, fiber attaches homes to ISP
router
§ homes share access network to cable headend
unlike DSL which has dedicated access to
Access net: cable
network
1-15

---

## Page 16

Introduction
Access net: home
network

l office
cable or DSL modem
router, firewall, NAT
wired Ethernet (100 Mbps)
wireless access
point (54 Mbps)
wireless
devices
often combined
in single box
1-16

---

## Page 17

Introduction
Enterprise access networks
(Ethernet)
v typically used in companies, universities, etc
v 10 Mbps, 100Mbps, 1Gbps, 10Gbps transmission
rates
v today, end systems typically connect into
Ethernet switch
switch
ail,
web servers
institutional link to
ISP (Internet)
1-17

---

## Page 18

Introduction
Wireless access networks
v shared wireless access network connects end
system to router
§ via base station aka “access point”
wireless LANs:
§ within building (
rate
wide-area wireless access
vided by telco (cellular)

to Internet
to Internet
1-18

---

## Page 19

Host: sends packets of data
host sending function:
v takes application
message
v breaks into sma
v transmits packet
into access network
at transmission rate
R
§ link transmission
rate, aka link
capacity, aka link
bandwidth
R: link transmission rate
host
two packets,
L bits each
packet
transmission
delay
time needed to
transmit L-bit
packet into link
L (bits)
R (bits/sec)
=

=
1-19

---

## Page 20

Introduction
Physical media
v bit: propagates between
transmitter/receiver
pairs
v physical link: w
v guide
§ signals propagate in
solid media: copper,
fiber, coax
v unguided media:
§ signals propagate
freely, e.g., radio
twisted pair (TP)
o insulated copper
bs
Ethernet
§ Category 6: 10Gbps
1-20

---

## Page 21

Introduction
Physical media: coax, fiber
coaxial cable:
v two concentric copper
conductors
v bidirectional
cabl
§ HFC
fiber optic cable:
v glass fiber carrying
light pulses, each pulse
int
e.g., 10’s-
100’s Gpbs transmission
rate)
v low error rate:
§ repeaters spaced far
apart
§ immune to
electromagnetic noise
1-21

---

## Page 22

Introduction
Physical media: radio
v signal carried in
electromagnetic
spectrum
v no physical “wir
enviro
§ reflection
§ obstruction by
objects
§ interference
radio link types:
v terrestrial  microwave
§ e.g. up to 45 Mbps
annels
., cellular)
§ 3G cellular: ~ few Mbps
v satellite
§ Kbps to 45Mbps channel
(or multiple smaller
channels)
§ 270 msec end-end delay
§ geosynchronous versus low
altitude
1-22

---

## Page 23

Introduction
Chapter 1: roadmap
1.1 what is the Internet?
1.2 network edge
§ end syst
works, links
§
, network
structure
1.4 delay, loss, throughput in networks
1.5 protocol layers, service models
1.6 networks under attack: security
1.7 history
1-23

---

## Page 24

Introduction
v mesh of
interconnected
routers
appli
messages into
packets
§ forward packets from
one router to the
next, across links on
path from source to
destination
§ each packet
transmitted at full
The network core
1-24

---

## Page 25

Introduction
Packet-switching: store-and-
forward
v takes
transmit (push out) L-
bit packet into link at R
bps
v store and forward:
entire packet must
arrive at router before
it can be transmitted
on next link
merical
example:
§ L = 7.5 Mbits
§ R = 1.5 Mbps
§ one-hop
transmission delay
= 5 sec
more on delay shortly …
1-25
ion
1
2
3
L bits
per packet
v end-end delay = 2L/R
(assuming zero
propagation delay)

---

## Page 26

Introduction
Packet Switching: queueing delay,
loss
A
C
R = 100 Mb/s
D
1-26
queuing and loss:
v If arrival rate (in bits) to link exceeds
transmission rate of link for a period of time:
§ packets will queue, wait to be transmitted on
link
§ packets can be dropped (lost) if memory
(buffer) fills up

---

## Page 27

Network Layer 4-27
Two key network-core
functions
forwarding: move
packets from router’s
input to appropriate
utput
routing: determines
source-destination route
taken by packets
§ routing algorit
r
local forwarding table
header value output link
0100
0101
0111
1001
3
2
2
1
1
2
3
0111
dest address in arriving
packet’s header

---

## Page 28

Introduction
Alternative core: circuit
switching
end-end resources
allocated to, reserved
for “call” between
source & dest
v
§ call
top link and 1st circuit
in right link.
v dedicated resources: no
sharing
§ circuit-like
(guaranteed)
performance
v circuit segment idle if not
used by call (no sharing)
1-28

---

## Page 29

Introduction
Circuit switching: FDM versus
TDM
FDM
TDM
frequency
time
4 users
Example:
1-29

---

## Page 30

Introduction
Packet switching versus circuit
switching
example:
§ 1 Mb/s link
• activ
vcircuit-switching:
§ 10 users
vpacket switching:
§ with 35 users,
probability > 10 active
at same time is less
than .0004 *
packet switching allows more users to use
network!
1 Mbps link
Q: how did we get value 0.0
Q: what happens if > 35 use
1-30

* Check out the online interactive exercises for more examples

---

## Page 31

Introduction
v great for bursty data
§ resource sharing
§ simpler, no ca
v
§ prot
fer,
congestion control
v Q: How to provide circuit-like behavior?
§ bandwidth guarantees needed for audio/video
apps
§ still an unsolved problem (chapter 7)
is packet switching a “slam dunk
winner?”
Q:  human analogies of reserved resources (circuit
switching) versus on-demand allocation (packet-
switching)?
Packet switching versus circuit
switching
1-31

---

## Page 32

Internet structure: network of
networks
v End systems connect to Internet via access ISPs
(Internet Service Providers)
§ Residential, company and university ISPs
v Access ISPs in t
rconnected.
v Result
plex
v Evolution was driven by economics and
national policies
v Let’s take a stepwise approach to describe
current Internet structure

---

## Page 33

Internet structure: network of
networks
Question: given millions of access ISPs, how to
connect them together?
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
…
…
…
…
…
…

---

## Page 34

Internet structure: network of
networks
Option: connect each access ISP to every other
access ISP?
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
…
…
…
…
…
…
…
…
…
to each other directly doesn’t
scale: O(N2) connections.

---

## Page 35

Internet structure: network of
networks
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
…
…
…
…
…
…
Option: connect each access ISP to a global transit
ISP? Customer and provider ISPs have economic
agreement.
ISP

---

## Page 36

Internet structure: network of
networks
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
…
…
…
…
…
…
But if one global ISP is viable business, there will
be competitors ….
ISP B
ISP C

---

## Page 37

Internet structure: network of
networks
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
…
…
…
…
…
…
But if one global ISP is viable business, there will
be competitors ….  which must be interconnected
ISP B
ISP C
IXP
peering link
Internet exchange point

---

## Page 38

Internet structure: network of
networks
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
…
…
…
…
…
…
… and regional networks may arise to connect
access nets to ISPS
ISP B
ISP C
IXP
regional net
