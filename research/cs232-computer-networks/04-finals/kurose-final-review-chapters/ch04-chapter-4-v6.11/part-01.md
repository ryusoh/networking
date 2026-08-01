# ch04-chapter-4-v6.11 - Part 01 (Pages 1-79)

---

## Page 1

Chapter 4
Network Layer
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
All material copyright 1996-2013
J.F Kurose and K.W. Ross, All Rights Reserved
Network Layer 4-1

---

## Page 2

Network Layer 4-2
Chapter 4: network layer
chapter goals:
v understand principles behind network layer
services:
§ network layer service models
§ forwarding versus routing
§ how a router works
§ routing (path selection)
§ broadcast, multicast
v instantiation, implementation in the Internet

---

## Page 3

Network Layer 4-3
4.1 introduction
4.2 virtual circuit and
datagram networks
4.3 whats inside a router
4.4 IP: Internet Protocol
§ datagram format
§ IPv4 addressing
§ ICMP
§ IPv6
4.5 routing algorithms
§ link state
§ distance vector
§ hierarchical routing
4.6 routing in the Internet
§ RIP
§ OSPF
§ BGP
4.7 broadcast and multicast
routing
Chapter 4: outline

---

## Page 4

Network Layer 4-4
Network layer
v transport segment from
sending to receiving host
v on sending side
encapsulates segments
into datagrams
v on receiving side, delivers
segments to transport
layer
v network layer protocols
in every host, router
v router examines header
fields in all IP datagrams
passing through it
application
transport
network
data link
physical
application
transport
network
data link
physical
network
data link
physical
network
data link
physical
network
data link
physical
network
data link
physical
network
data link
physical
network
data link
physical
network
data link
physical
network
data link
physical
network
data link
physical
network
data link
physical
network
data link
physical

---

## Page 5

Network Layer 4-5
Two key network-layer functions
v forwarding: move packets
from routers input to
appropriate router
output
v routing: determine route
taken by packets from
source to dest.
§ routing algorithms
analogy:
v routing: process of
planning trip from source
to dest
v forwarding: process of
getting through single
interchange

---

## Page 6

Network Layer 4-6
1
2
3
0111
value in arriving
packets header
routing algorithm
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
Interplay between routing and forwarding
routing algorithm determines
end-end-path through network
forwarding table determines
local forwarding at this router

---

## Page 7

Network Layer 4-7
Connection setup
v 3rd important function in some network
architectures:
§ ATM, frame relay, X.25
v before datagrams flow, two end hosts and
intervening routers establish virtual connection
§ routers get involved
v network vs transport layer connection service:
§ network: between two hosts (may also involve intervening
routers in case of VCs)
§ transport: between two processes

---

## Page 8

Network Layer 4-8
Network service model
Q: What service model for channel transporting
datagrams from sender to receiver?
example services for
individual datagrams:
v guaranteed delivery
v guaranteed delivery with
less than 40 msec delay
example services for a flow
of datagrams:
v in-order datagram
delivery
v guaranteed minimum
bandwidth to flow
v restrictions on changes in
inter-packet spacing

---

## Page 9

Network Layer 4-9
Network layer service models:
Network
Architecture
Internet
ATM
ATM
ATM
ATM
Service
Model
best effort
CBR
VBR
ABR
UBR
Bandwidth
none
constant
rate
guaranteed
rate
guaranteed
minimum
none
Loss
no
yes
yes
no
no
Order
no
yes
yes
yes
yes
Timing
no
yes
yes
no
no
Congestion
feedback
no (inferred
via loss)
no
congestion
no
congestion
yes
no
Guarantees ?

---

## Page 10

Network Layer 4-10
4.1 introduction
4.2 virtual circuit and
datagram networks
4.3 whats inside a router
4.4 IP: Internet Protocol
§ datagram format
§ IPv4 addressing
§ ICMP
§ IPv6
4.5 routing algorithms
§ link state
§ distance vector
§ hierarchical routing
4.6 routing in the Internet
§ RIP
§ OSPF
§ BGP
4.7 broadcast and multicast
routing
Chapter 4: outline

---

## Page 11

Network Layer 4-11
Connection, connection-less service
v datagram network provides network-layer
connectionless service
v virtual-circuit network provides network-layer
connection service
v analogous to TCP/UDP connecton-oriented /
connectionless transport-layer services, but:
§ service: host-to-host
§ no choice: network provides one or the other
§ implementation: in network core

---

## Page 12

Network Layer 4-12
Virtual circuits
v call setup, teardown for each call before data can flow
v each packet carries VC identifier (not destination host
address)
v every router on source-dest path maintains state for
each passing connection
v link, router resources (bandwidth, buffers) may be
allocated to VC (dedicated resources = predictable
service)
source-to-dest path behaves much like telephone
circuit
§ performance-wise
§ network actions along source-to-dest path

---

## Page 13

Network Layer 4-13
VC implementation
a VC consists of:

1. path from source to destination
2. VC numbers, one number for each link along path
3. entries in forwarding tables in routers along path
v
packet belonging to VC carries VC number
(rather than dest address)
v
VC number can be changed on each link.
§
new VC number comes from forwarding table

---

## Page 14

Network Layer 4-14
VC forwarding table
12
22
32
1
2
3
VC number
interface
number
Incoming interface    Incoming VC #     Outgoing interface    Outgoing VC #
1                          12                               3                          22
2                          63                               1                          18
3                           7                                2                          17
1                          97                               3                           87
…                          …                                …                            …
forwarding table in
northwest router:
VC routers maintain connection state information!

---

## Page 15

Network Layer 4-15
application
transport
network
data link
physical
Virtual circuits: signaling protocols
v used to setup, maintain  teardown VC
v used in ATM, frame-relay, X.25
v not used in todays Internet

1. initiate call
2. incoming call
3. accept call
4. call connected
5. data flow begins
6. receive data
application
transport
network
data link
physical

---

## Page 16

Network Layer 4-16
Datagram networks
v no call setup at network layer
v routers: no state about end-to-end connections
§ no network-level concept of connection
v packets forwarded using destination host address

1. send datagrams
application
transport
network
data link
physical
application
transport
network
data link
physical
2. receive datagrams

---

## Page 17

Network Layer 4-17
1
2
3
Datagram forwarding  table
IP destination address in
arriving packets header
routing algorithm
local forwarding table
dest address output  link
address-range 1
address-range 2
address-range 3
address-range 4
3
2
2
1
4 billion IP addresses, so
rather than list individual
destination address
list range of addresses
(aggregate table entries)

---

## Page 18

Network Layer 4-18
Destination Address Range
11001000 00010111 00010000 00000000
through
11001000 00010111 00010111 11111111
11001000 00010111 00011000 00000000
through
11001000 00010111 00011000 11111111
11001000 00010111 00011001 00000000
through
11001000 00010111 00011111 11111111
otherwise
Link Interface
0
1
2
3
Q: but what happens if ranges dont divide up so nicely?
Datagram forwarding  table

---

## Page 19

Network Layer 4-19
Longest prefix matching
Destination Address Range
11001000 00010111 00010************
11001000 00010111 00011000 *********
11001000 00010111 00011*** *********
otherwise
DA: 11001000  00010111  00011000  10101010
examples:
DA: 11001000  00010111  00010110  10100001
which interface?
which interface?
when looking for forwarding table entry for given
destination address, use longest address prefix that
matches destination address.
longest prefix matching
Link interface
0
1
2
3

---

## Page 20

Network Layer 4-20
Datagram or VC network: why?
Internet (datagram)
v data exchange among
computers
§ elastic service, no strict
timing req.
v many link types
§ different characteristics
§ uniform service difficult
v smart end systems
(computers)
§ can adapt, perform control,
error recovery
§ simple inside network,
complexity at edge
ATM (VC)
v evolved from telephony
v human conversation:
§ strict timing, reliability
requirements
§ need for guaranteed service
v dumb end systems
§ telephones
§ complexity inside
network

---

## Page 21

Network Layer 4-21
4.1 introduction
4.2 virtual circuit and
datagram networks
4.3 whats inside a router
4.4 IP: Internet Protocol
§ datagram format
§ IPv4 addressing
§ ICMP
§ IPv6
4.5 routing algorithms
§ link state
§ distance vector
§ hierarchical routing
4.6 routing in the Internet
§ RIP
§ OSPF
§ BGP
4.7 broadcast and multicast
routing
Chapter 4: outline

---

## Page 22

Network Layer 4-22
Router architecture overview
two key router functions:
v run routing algorithms/protocol (RIP, OSPF, BGP)
v forwarding datagrams from incoming to outgoing link
high-seed
switching
fabric
routing
processor
router input ports
router output ports
forwarding data
plane  (hardware)
routing, management
control plane (software)
forwarding tables computed,
pushed to input ports

---

## Page 23

Network Layer 4-23
line
termination
link
layer
protocol
(receive)
lookup,
forwarding
queueing
Input port functions
decentralized switching:
v given datagram dest., lookup output port
using forwarding table in input port
memory (“match plus action”)
v goal: complete input port processing at
line speed
v queuing: if datagrams arrive faster than
forwarding rate into switch fabric
physical layer:
bit-level reception
data link layer:
e.g., Ethernet
see chapter 5
switch
fabric

---

## Page 24

Network Layer 4-24
Switching fabrics
v transfer packet from input buffer to appropriate
output buffer
v switching rate: rate at which packets can be
transfer from inputs to outputs
§ often measured as multiple of input/output line rate
§ N inputs: switching rate N times line rate desirable
v three types of switching fabrics
memory
memory
bus
crossbar

---

## Page 25

Network Layer 4-25
Switching via memory
first generation routers:
v traditional computers with switching under direct control
of CPU
v packet copied to systems memory
v speed limited by memory bandwidth (2 bus crossings per
datagram)
input
port
(e.g.,
Ethernet)
memory
output
port
(e.g.,
Ethernet)
system bus

---

## Page 26

Network Layer 4-26
Switching via a bus
v datagram from input port memory
to output port memory via a
shared bus
v bus contention: switching speed
limited by bus bandwidth
v 32 Gbps bus, Cisco 5600: sufficient
speed for access and enterprise
routers
bus

---

## Page 27

Network Layer 4-27
Switching via interconnection network
v overcome  bus bandwidth limitations
v banyan networks, crossbar, other
interconnection nets initially
developed to connect processors in
multiprocessor
v advanced design: fragmenting
datagram into fixed length cells,
switch cells through the fabric.
v Cisco 12000: switches 60 Gbps
through the interconnection
network
crossbar

---

## Page 28

Network Layer 4-28
Output ports
v buffering required when datagrams arrive
from fabric faster than the transmission
rate
v scheduling discipline chooses among queued
datagrams for transmission
line
termination
link
layer
protocol
(send)
switch
fabric
datagram
buffer
queueing
This slide in HUGELY important!
Datagram (packets) can be lost
due to congestion, lack of buffers
Priority scheduling – who gets best
performance, network neutrality

---

## Page 29

Network Layer 4-29
Output port queueing
v buffering when arrival rate via switch exceeds
output line speed
v queueing (delay) and loss due to output port buffer
overflow!
at t, packets more
from input to output
one packet time later
switch
fabric
switch
fabric

---

## Page 30

Network Layer 4-30
How much buffering?
v RFC 3439 rule of thumb: average buffering equal
to typical RTT (say 250 msec) times link
capacity C
§ e.g., C = 10 Gpbs link: 2.5 Gbit buffer
v recent recommendation: with N flows, buffering
equal to
RTT  C
.
N

---

## Page 31

Network Layer 4-31
Input port queuing
v fabric slower than input ports combined -> queueing may
occur at input queues
§ queueing delay and loss due to input buffer overflow!
v Head-of-the-Line (HOL) blocking: queued datagram at front
of queue prevents others in queue from moving forward
output port contention:
only one red datagram can be
transferred.
lower red packet is blocked
switch
fabric
one packet time later:
green packet
experiences HOL
blocking
switch
fabric

---

## Page 32

Network Layer 4-32
4.1 introduction
4.2 virtual circuit and
datagram networks
4.3 whats inside a router
4.4 IP: Internet Protocol
§ datagram format
§ IPv4 addressing
§ ICMP
§ IPv6
4.5 routing algorithms
§ link state
§ distance vector
§ hierarchical routing
4.6 routing in the Internet
§ RIP
§ OSPF
§ BGP
4.7 broadcast and multicast
routing
Chapter 4: outline

---

## Page 33

Network Layer 4-33
The Internet network layer
forwarding
table
host, router network layer functions:
routing protocols
• path selection
• RIP, OSPF, BGP
IP protocol
• addressing conventions
• datagram format
• packet handling conventions
ICMP protocol
• error reporting
• router
signaling
transport layer: TCP, UDP
link layer
physical layer
network
layer

---

## Page 34

Network Layer 4-34
ver
length
32 bits
data
(variable length,
typically a TCP
or UDP segment)
16-bit identifier
header
checksum
time to
live
32 bit source IP address
head.
len
type of
service
flgs
fragment
offset
upper
layer
32 bit destination IP address
options (if any)
IP datagram format
IP protocol version
number
header length
(bytes)
upper layer protocol
to deliver payload to
total datagram
length (bytes)
type of data
for
fragmentation/
reassembly
max number
remaining hops
(decremented at
each router)
e.g. timestamp,
record route
taken, specify
list of routers
to visit.
how much overhead?
v 20 bytes of TCP
v 20 bytes of IP
v = 40 bytes + app
layer overhead

---

## Page 35

Network Layer 4-35
IP fragmentation, reassembly
v network links have MTU
(max.transfer size) -
largest possible link-level
frame
§ different link types,
different MTUs
v large IP datagram divided
(fragmented) within net
§ one datagram becomes
several datagrams
§ reassembled only at
final destination
§ IP header bits used to
identify, order related
fragments
fragmentation:
in: one large datagram
out: 3 smaller datagrams
reassembly
…
…

---

## Page 36

Network Layer 4-36
ID
=x
offset
=0
fragflag
=0
length
=4000
ID
=x
offset
=0
fragflag
=1
length
=1500
ID
=x
offset
=185
fragflag
=1
length
=1500
ID
=x
offset
=370
fragflag
=0
length
=1040
one large datagram becomes
several smaller datagrams
example:
v 4000 byte datagram
v MTU = 1500 bytes
1480 bytes in
data field
offset =
1480/8
IP fragmentation, reassembly

---

## Page 37

Network Layer 4-37
4.1 introduction
4.2 virtual circuit and
datagram networks
4.3 whats inside a router
4.4 IP: Internet Protocol
§ datagram format
§ IPv4 addressing
§ ICMP
§ IPv6
4.5 routing algorithms
§ link state
§ distance vector
§ hierarchical routing
4.6 routing in the Internet
§ RIP
§ OSPF
§ BGP
4.7 broadcast and multicast
routing
Chapter 4: outline

---

## Page 38

Network Layer 4-38
IP addressing: introduction
v IP address: 32-bit
identifier for host, router
interface
v interface: connection
between host/router and
physical link
§ routers typically have
multiple interfaces
§ host typically has one or
two interfaces (e.g., wired
Ethernet, wireless 802.11)
v IP addresses associated
with each interface
223.1.1.1
223.1.1.2
223.1.1.3
223.1.1.4
223.1.2.9
223.1.2.2
223.1.2.1
223.1.3.2
223.1.3.1
223.1.3.27
223.1.1.1 = 11011111 00000001 00000001 00000001
223
1
1
1

---

## Page 39

Network Layer 4-39
IP addressing: introduction
Q: how are interfaces
actually connected?
A: we’ll learn about that
in chapter 5, 6.
223.1.1.1
223.1.1.2
223.1.1.3
223.1.1.4
223.1.2.9
223.1.2.2
223.1.2.1
223.1.3.2
223.1.3.1
223.1.3.27
A: wired Ethernet interfaces
connected by Ethernet switches
A: wireless WiFi interfaces
connected by WiFi base station
For now: don’t need to worry
about how one interface is
connected to another (with no
intervening router)

---

## Page 40

Network Layer 4-40
Subnets
vIP address:
§subnet part - high order
bits
§host part - low order
bits
vwhats a subnet ?
§device interfaces with
same subnet part of IP
address
§can physically reach
each other without
intervening router
network consisting of 3 subnets
223.1.1.1
223.1.1.3
223.1.1.4
223.1.2.9
223.1.3.2
223.1.3.1
subnet
223.1.1.2
223.1.3.27
223.1.2.2
223.1.2.1

---

## Page 41

Network Layer 4-41
recipe
v to determine the
subnets, detach each
interface from its host
or router, creating
islands of isolated
networks
v each isolated network
is called a subnet
subnet mask: /24
Subnets
223.1.1.0/24
223.1.2.0/24
223.1.3.0/24
223.1.1.1
223.1.1.3
223.1.1.4
223.1.2.9
223.1.3.2
223.1.3.1
subnet
223.1.1.2
223.1.3.27
223.1.2.2
223.1.2.1

---

## Page 42

Network Layer 4-42
how many?
223.1.1.1
223.1.1.3
223.1.1.4
223.1.2.2
223.1.2.1
223.1.2.6
223.1.3.2
223.1.3.1
223.1.3.27
223.1.1.2
223.1.7.0
223.1.7.1
223.1.8.0
223.1.8.1
223.1.9.1
223.1.9.2
Subnets

---

## Page 43

Network Layer 4-43
IP addressing: CIDR
CIDR: Classless InterDomain Routing
§ subnet portion of address of arbitrary length
§ address format: a.b.c.d/x, where x is # bits in
subnet portion of address
11001000  00010111  00010000  00000000
subnet
part
host
part
200.23.16.0/23

---

## Page 44

Network Layer 4-44
IP addresses: how to get one?
Q: How does a host get IP address?
v hard-coded by system admin in a file
§ Windows: control-panel->network->configuration-
>tcp/ip->properties
§ UNIX: /etc/rc.config
v DHCP: Dynamic Host Configuration Protocol:
dynamically get address from as server
§ plug-and-play

---

## Page 45

Network Layer 4-45
DHCP: Dynamic Host Configuration Protocol
goal: allow host to dynamically obtain its IP address from network
server when it joins network
§ can renew its lease on address in use
§ allows reuse of addresses (only hold address while
connected/on)
§ support for mobile users who want to join network (more
shortly)
DHCP overview:
§ host broadcasts DHCP discover msg [optional]
§ DHCP server responds with DHCP offer msg [optional]
§ host requests IP address: DHCP request msg
§ DHCP server sends address: DHCP ack msg

---

## Page 46

Network Layer 4-46
DHCP client-server scenario
223.1.1.0/24
223.1.2.0/24
223.1.3.0/24
223.1.1.1
223.1.1.3
223.1.1.4
223.1.2.9
223.1.3.2
223.1.3.1
223.1.1.2
223.1.3.27
223.1.2.2
223.1.2.1
DHCP
server
arriving DHCP
client needs
address in this
network

---

## Page 47

Network Layer 4-47
DHCP server: 223.1.2.5
arriving
client
DHCP discover
src : 0.0.0.0, 68
dest.: 255.255.255.255,67
yiaddr:    0.0.0.0
transaction ID: 654
DHCP offer
src: 223.1.2.5, 67
dest:  255.255.255.255, 68
yiaddrr: 223.1.2.4
transaction ID: 654
lifetime: 3600 secs
DHCP request
src:  0.0.0.0, 68
dest::  255.255.255.255, 67
yiaddrr: 223.1.2.4
transaction ID: 655
lifetime: 3600 secs
DHCP ACK
src: 223.1.2.5, 67
dest:  255.255.255.255, 68
yiaddrr: 223.1.2.4
transaction ID: 655
lifetime: 3600 secs
DHCP client-server scenario
Broadcast: is there a
DHCP server out there?
Broadcast: I’m a DHCP
server! Here’s an IP
address you can use
Broadcast: OK.  I’ll take
that IP address!
Broadcast: OK.  You’ve
got that IP address!

---

## Page 48

Network Layer 4-48
DHCP: more than IP addresses
DHCP can return more than just allocated IP
address on subnet:
§ address of first-hop router for client
§ name and IP address of DNS sever
§ network mask (indicating network versus host portion
of address)

---

## Page 49

Network Layer 4-49
v connecting laptop needs
its IP address, addr of
first-hop router, addr of
DNS server: use DHCP
router with DHCP
server built into
router
v DHCP request encapsulated
in UDP, encapsulated in IP,
encapsulated in 802.1
Ethernet
v Ethernet frame broadcast
(dest: FFFFFFFFFFFF) on LAN,
received at router running
DHCP server
v Ethernet demuxed to IP
demuxed, UDP demuxed to
DHCP
168.1.1.1
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
DHCP: example

---

## Page 50

Network Layer 4-50
v DCP server formulates
DHCP ACK containing
clients IP address, IP
address of first-hop
router for client, name &
IP address of DNS server
v encapsulation of DHCP
server, frame forwarded
to client, demuxing up to
DHCP at client
DHCP: example
router with DHCP
server built into
router
DHCP
DHCP
DHCP
DHCP
DHCP
UDP
IP
Eth
Phy
DHCP
DHCP
UDP
IP
Eth
Phy
DHCP
DHCP
DHCP
DHCP
v client now knows its IP
address, name and IP
address of DSN server, IP
address of its first-hop
router

---

## Page 51

Network Layer 4-51
DHCP: Wireshark
output (home LAN)
Message type: Boot Reply (2)
Hardware type: Ethernet
Hardware address length: 6
Hops: 0
Transaction ID: 0x6b3a11b7
Seconds elapsed: 0
Bootp flags: 0x0000 (Unicast)
Client IP address: 192.168.1.101 (192.168.1.101)
Your (client) IP address: 0.0.0.0 (0.0.0.0)
Next server IP address: 192.168.1.1 (192.168.1.1)
Relay agent IP address: 0.0.0.0 (0.0.0.0)
Client MAC address: Wistron_23:68:8a (00:16:d3:23:68:8a)
Server host name not given
Boot file name not given
Magic cookie: (OK)
Option: (t=53,l=1) DHCP Message Type = DHCP ACK
Option: (t=54,l=4) Server Identifier = 192.168.1.1
Option: (t=1,l=4) Subnet Mask = 255.255.255.0
Option: (t=3,l=4) Router = 192.168.1.1
Option: (6) Domain Name Server
Length: 12; Value: 445747E2445749F244574092;
IP Address: 68.87.71.226;
IP Address: 68.87.73.242;
IP Address: 68.87.64.146
Option: (t=15,l=20) Domain Name = "hsd1.ma.comcast.net."
reply
Message type: Boot Request (1)
Hardware type: Ethernet
Hardware address length: 6
Hops: 0
Transaction ID: 0x6b3a11b7
Seconds elapsed: 0
Bootp flags: 0x0000 (Unicast)
Client IP address: 0.0.0.0 (0.0.0.0)
Your (client) IP address: 0.0.0.0 (0.0.0.0)
Next server IP address: 0.0.0.0 (0.0.0.0)
Relay agent IP address: 0.0.0.0 (0.0.0.0)
Client MAC address: Wistron_23:68:8a (00:16:d3:23:68:8a)
Server host name not given
Boot file name not given
Magic cookie: (OK)
Option: (t=53,l=1) DHCP Message Type = DHCP Request
Option: (61) Client identifier
Length: 7; Value: 010016D323688A;
Hardware type: Ethernet
Client MAC address: Wistron_23:68:8a (00:16:d3:23:68:8a)
Option: (t=50,l=4) Requested IP Address = 192.168.1.101
Option: (t=12,l=5) Host Name = "nomad"
Option: (55) Parameter Request List
Length: 11; Value: 010F03062C2E2F1F21F92B
1 = Subnet Mask; 15 = Domain Name
3 = Router; 6 = Domain Name Server
44 = NetBIOS over TCP/IP Name Server
……
request

---

## Page 52

Network Layer 4-52
IP addresses: how to get one?
Q: how does network get subnet part of IP addr?
A: gets allocated portion of its provider ISPs address
space
ISP's block          11001000  00010111  00010000 00000000    200.23.16.0/20
Organization 0    11001000  00010111  00010000  00000000    200.23.16.0/23
Organization 1    11001000  00010111  00010010  00000000    200.23.18.0/23
Organization 2    11001000  00010111  00010100  00000000    200.23.20.0/23
...                                          …..                                   ….                ….
Organization 7    11001000  00010111  00011110  00000000    200.23.30.0/23

---

## Page 53

Network Layer 4-53
Hierarchical addressing: route aggregation
Send me anything
with addresses
beginning
200.23.16.0/20
200.23.16.0/23
200.23.18.0/23
200.23.30.0/23
Fly-By-Night-ISP
Organization 0
Organization 7
Internet
Organization 1
ISPs-R-Us
Send me anything
with addresses
beginning
199.31.0.0/16
200.23.20.0/23
Organization 2
...
...
hierarchical addressing allows efficient advertisement of routing
information:

---

## Page 54

Network Layer 4-54
ISPs-R-Us has a more specific route to Organization 1
Send me anything
with addresses
beginning
200.23.16.0/20
200.23.16.0/23
200.23.18.0/23
200.23.30.0/23
Fly-By-Night-ISP
Organization 0
Organization 7
Internet
Organization 1
ISPs-R-Us
Send me anything
with addresses
beginning 199.31.0.0/16
or 200.23.18.0/23
200.23.20.0/23
Organization 2
...
...
Hierarchical addressing: more specific routes

---

## Page 55

Network Layer 4-55
IP addressing: the last word...
Q: how does an ISP get block of addresses?
A: ICANN: Internet Corporation for Assigned
Names and Numbers <http://www.icann.org/>
§ allocates addresses
§ manages DNS
§ assigns domain names, resolves disputes

---

## Page 56

Network Layer 4-56
NAT: network address translation
10.0.0.1
10.0.0.2
10.0.0.3
10.0.0.4
138.76.29.7
local network
(e.g., home network)
10.0.0/24
rest of
Internet
datagrams with source or
destination in this network
have 10.0.0/24 address for
source, destination (as usual)
all datagrams leaving local
network have same single
source NAT IP address:
138.76.29.7,different source
port numbers

---

## Page 57

Network Layer 4-57
motivation: local network uses just one IP address as far
as outside world is concerned:
§ range of addresses not needed from ISP:  just one
IP address for all devices
§ can change addresses of devices in local network
without notifying outside world
§ can change ISP without changing addresses of
devices in local network
§ devices inside local net not explicitly addressable,
visible by outside world (a security plus)
NAT: network address translation

---

## Page 58

Network Layer 4-58
implementation: NAT router must:
§ outgoing datagrams: replace (source IP address, port #) of
every outgoing datagram to (NAT IP address, new port #)
. . . remote clients/servers will respond using (NAT IP
address, new port #) as destination addr
§ remember (in NAT translation table) every (source IP address,
port #)  to (NAT IP address, new port #) translation pair
§ incoming datagrams: replace (NAT IP address, new port #) in
dest fields of every incoming datagram with corresponding
(source IP address, port #) stored in NAT table
NAT: network address translation

---

## Page 59

Network Layer 4-59
10.0.0.1
10.0.0.2
10.0.0.3
S: 10.0.0.1, 3345
D: 128.119.40.186, 80
1
10.0.0.4
138.76.29.7
1: host 10.0.0.1
sends datagram to
128.119.40.186, 80
NAT translation table
WAN side addr        LAN side addr
138.76.29.7, 5001   10.0.0.1, 3345
……                                         ……
S: 128.119.40.186, 80
D: 10.0.0.1, 3345
4
S: 138.76.29.7, 5001
D: 128.119.40.186, 80
2
2: NAT router
changes datagram
source addr from
10.0.0.1, 3345 to
138.76.29.7, 5001,
updates table
S: 128.119.40.186, 80
D: 138.76.29.7, 5001
3
3: reply arrives
dest. address:
138.76.29.7, 5001
4: NAT router
changes datagram
dest addr from
138.76.29.7, 5001 to 10.0.0.1, 3345
NAT: network address translation

---

## Page 60

Network Layer 4-60
v 16-bit port-number field:
§ 60,000 simultaneous connections with a single
LAN-side address!
v NAT is controversial:
§ routers should only process up to layer 3
§ violates end-to-end argument
• NAT possibility must be taken into account by app
designers, e.g., P2P applications
§ address shortage should instead be solved by
IPv6
NAT: network address translation

---

## Page 61

Network Layer 4-61
NAT traversal problem
v client wants to connect to
server with address 10.0.0.1
§ server address 10.0.0.1 local to
LAN (client cant use it as
destination addr)
§ only one externally visible NATed
address: 138.76.29.7
v solution1: statically configure
NAT to forward incoming
connection requests at given
port to server
§ e.g., (123.76.29.7, port 2500)
always forwarded to 10.0.0.1 port
25000
10.0.0.1
10.0.0.4
NAT
router
138.76.29.7
client
?

---

## Page 62

Network Layer 4-62
NAT traversal problem
v solution 2: Universal Plug and Play
(UPnP) Internet Gateway Device
(IGD) Protocol.  Allows NATed
host to:
v learn public IP address
(138.76.29.7)
v add/remove port mappings
(with lease times)
i.e., automate static NAT port
map configuration
10.0.0.1
NAT
router
IGD

---

## Page 63

Network Layer 4-63
NAT traversal problem
v solution 3: relaying (used in Skype)
§ NATed client establishes connection to relay
§ external client connects to relay
§ relay bridges packets between to connections
138.76.29.7
client

1. connection to
relay initiated
by NATed host
2. connection to
relay initiated
by client
3. relaying
established
NAT
router
10.0.0.1

---

## Page 64

Network Layer 4-64
4.1 introduction
4.2 virtual circuit and
datagram networks
4.3 whats inside a router
4.4 IP: Internet Protocol
§ datagram format
§ IPv4 addressing
§ ICMP
§ IPv6
4.5 routing algorithms
§ link state
§ distance vector
§ hierarchical routing
4.6 routing in the Internet
§ RIP
§ OSPF
§ BGP
4.7 broadcast and multicast
routing
Chapter 4: outline

---

## Page 65

Network Layer 4-65
ICMP: internet control message protocol
v used by hosts & routers
to communicate network-
level information
§ error reporting:
unreachable host, network,
port, protocol
§ echo request/reply (used by
ping)
v network-layer above IP:
§ ICMP msgs carried in IP
datagrams
v ICMP message: type, code
plus first 8 bytes of IP
datagram causing error
Type Code description
0        0         echo reply (ping)
3        0         dest. network unreachable
3        1         dest host unreachable
3        2         dest protocol unreachable
3        3         dest port unreachable
3        6         dest network unknown
3        7         dest host unknown
4        0         source quench (congestion
control - not used)
8        0         echo request (ping)
9        0         route advertisement
10      0         router discovery
11      0         TTL expired
12      0         bad IP header

---

## Page 66

Network Layer 4-66
Traceroute and ICMP
v source sends series of
UDP segments to dest
§ first set has TTL =1
§ second set has TTL=2, etc.
§ unlikely port number
v when nth set of datagrams
arrives to nth router:
§ router discards datagrams
§ and sends source ICMP
messages (type 11, code 0)
§ ICMP messages includes
name of router & IP address
v when ICMP messages
arrives, source records
RTTs
stopping criteria:
v UDP segment eventually
arrives at destination host
v destination returns ICMP
port unreachable
message (type 3, code 3)
v source stops
3 probes
3 probes
3 probes

---

## Page 67

Network Layer 4-67
IPv6: motivation
v initial motivation: 32-bit address space soon to be
completely allocated.
v additional motivation:
§ header format helps speed processing/forwarding
§ header changes to facilitate QoS
IPv6 datagram format:
§ fixed-length 40 byte header
§ no fragmentation allowed

---

## Page 68

Network Layer 4-68
IPv6 datagram format
priority: identify priority among datagrams in flow
flow Label: identify datagrams in same flow.
(concept offlow not well defined).
next header: identify upper layer protocol for data
data
destination address
(128 bits)
source address
(128 bits)
payload len
next hdr
hop limit
flow label
pri
ver
32 bits

---

## Page 69

Network Layer 4-69
Other changes from IPv4
v checksum: removed entirely to reduce processing
time at each hop
v options: allowed, but outside of header, indicated
by Next Header field
v ICMPv6: new version of ICMP
§ additional message types, e.g. Packet Too Big
§ multicast group management functions

---

## Page 70

Network Layer 4-70
Transition from IPv4 to IPv6
v not all routers can be upgraded simultaneously
§ no flag days
§ how will network operate with mixed IPv4 and
IPv6 routers?
v tunneling: IPv6 datagram carried as payload in IPv4
datagram among IPv4 routers
IPv4 source, dest addr
IPv4 header fields
IPv4 datagram
IPv6 datagram
IPv4 payload
UDP/TCP payload
IPv6 source dest addr
IPv6 header fields

---

## Page 71

Network Layer 4-71
Tunneling
physical view:
IPv4
IPv4
A
B
IPv6
IPv6
E
IPv6
IPv6
F
C
D
logical view:
IPv4 tunnel
connecting IPv6 routers
E
IPv6
IPv6
F
A
B
IPv6
IPv6

---

## Page 72

Network Layer 4-72
flow: X
src: A
dest: F
data
A-to-B:
IPv6
Flow: X
Src: A
Dest: F
data
src:B
dest: E
B-to-C:
IPv6 inside
IPv4
E-to-F:
IPv6
flow: X
src: A
dest: F
data
B-to-C:
IPv6 inside
IPv4
Flow: X
Src: A
Dest: F
data
src:B
dest: E
physical view:
A
B
IPv6
IPv6
E
IPv6
IPv6
F
C
D
logical view:
IPv4 tunnel
connecting IPv6 routers
E
IPv6
IPv6
F
A
B
IPv6
IPv6
Tunneling
IPv4
IPv4

---

## Page 73

Network Layer 4-73
IPv6: adoption
v US National Institutes of Standards estimate [2013]:
§ ~3% of industry IP routers
§ ~11% of US gov’t routers
v Long (long!) time for deployment, use
§ 20 years and counting!
§ think of application-level changes in last 20 years: WWW,
Facebook, …
§ Why?

---

## Page 74

Network Layer 4-74
4.1 introduction
4.2 virtual circuit and
datagram networks
4.3 whats inside a router
4.4 IP: Internet Protocol
§ datagram format
§ IPv4 addressing
§ ICMP
§ IPv6
4.5 routing algorithms
§ link state
§ distance vector
§ hierarchical routing
4.6 routing in the Internet
§ RIP
§ OSPF
§ BGP
4.7 broadcast and multicast
routing
Chapter 4: outline

---

## Page 75

Network Layer 4-75
1
2
3
IP destination address in
arriving packets header
routing algorithm
local forwarding table
dest address output  link
address-range 1
address-range 2
address-range 3
address-range 4
3
2
2
1
Interplay between routing, forwarding
routing algorithm determines
end-end-path through network
forwarding table determines
local forwarding at this router

---

## Page 76

Network Layer 4-76
u
y
x
w
v
z
2
2
1
3
1
1
2
5
3
5
graph: G = (N,E)
N = set of routers = { u, v, w, x, y, z }
E = set of links ={ (u,v), (u,x), (v,x), (v,w), (x,w), (x,y), (w,y), (w,z), (y,z) }
Graph abstraction
aside: graph abstraction is useful in other network contexts, e.g.,
P2P, where N is set of peers and E is set of TCP connections

---

## Page 77

Network Layer 4-77
Graph abstraction: costs
u
y
x
w
v
z
2
2
1
3
1
1
2
5
3
5
c(x,x) = cost of link (x,x)
e.g., c(w,z) = 5
cost could always be 1, or
inversely related to bandwidth,
or inversely related to
congestion
cost of path (x1, x2, x3,…, xp) = c(x1,x2) + c(x2,x3) + … + c(xp-1,xp)
key question: what is the least-cost path between u and z ?
routing algorithm: algorithm that finds that least cost path

---

## Page 78

Network Layer 4-78
Routing algorithm classification
Q: global or decentralized
information?
global:
v all routers have complete
topology, link cost info
v link state algorithms
decentralized:
v router knows physically-
connected neighbors, link
costs to neighbors
v iterative process of
computation, exchange of
info with neighbors
v distance vector algorithms
Q: static or dynamic?
static:
v routes change slowly over
time
dynamic:
v routes change more
quickly
§ periodic update
§ in response to link
cost changes

---

## Page 79

Network Layer 4-79
4.1 introduction
4.2 virtual circuit and
datagram networks
4.3 whats inside a router
4.4 IP: Internet Protocol
§ datagram format
§ IPv4 addressing
§ ICMP
§ IPv6
4.5 routing algorithms
§ link state
§ distance vector
§ hierarchical routing
4.6 routing in the Internet
§ RIP
§ OSPF
§ BGP
4.7 broadcast and multicast
routing
Chapter 4: outline
