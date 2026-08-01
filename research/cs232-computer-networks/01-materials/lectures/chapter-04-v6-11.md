# chapter-04-v6-11

---

## Page 1

Chapter 4
Network Layer
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
     All material copyright 1996-2013
     J.F Kurose and K.W. Ross, All Rights Reserved
Network Layer 4-1

---

## Page 2

Network Layer 4-2
Chapter 4: network layer
chapter goals:
v understand principles behind network
layer service
§ how a router works
§ routing (path selection)
§ broadcast, multicast
v instantiation, implementation in the
Internet

---

## Page 3

Network Layer 4-3
4.1 introduction
4.2 virtual circuit and
datagram netw
4.4 IP: I
Protocol
§ datagram format
§ IPv4 addressing
§ ICMP
§ IPv6
4.5 routing algorithms
§ link state
§ distance vector
archical routing
§ OSPF
§ BGP
4.7 broadcast and
multicast routing
Chapter 4: outline

---

## Page 4

Network Layer 4-4
Network layer
v transport segment
from sending to
receiving host
v on sending si
data
v on receiving side,
delivers segments to
transport layer
v network layer
protocols in every
host, router
v router examines
header fields in all IP
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
network
data link
physical
network
data link
network
data link
physical
network
data link
physical
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
Two key network-layer
functions
v forwarding: move
packets from
router’s input
v routing: determine
route taken by
packets from source
to dest.
§ routing algorithms
analogy:
ting: process of

v forwarding: process
of getting through
single interchange

---

## Page 6

Network Layer 4-6
1
2
3
0111
value in arriving
packet’s header
routing algorithm
local forwarding table
header value output link
0
Interplay between routing and forwar
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
§ ATM, frame r

conn
§ routers get involved
v network vs transport layer connection
service:
§ network: between two hosts (may also involve
intervening routers in case of VCs)
§ transport: between two processes

---

## Page 8

Network Layer 4-8
Network service model
Q: What service model for “channel”
transporting datagrams from sender to
receiver?
e
v guaranteed delivery
v guaranteed delivery
with less than 40
msec delay
le services
v in-order datagram
delivery
v guaranteed
minimum bandwidth
to flow
v restrictions on
changes in inter-
packet spacing

---

## Page 9

Network Layer 4-9
Network layer service
models:
Network
Architecture
Internet
ATM
ATM
ATM
Service
Model
best effort
VBR
ABR
UBR
Bandwidth
guaranteed
rate
guaranteed
minimum
none
Loss
yes
no
no
Order
yes
yes
yes
Timing
no
yes
no
no
Congestion
feedback
no (inferred
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
datagram netw
4.4 IP: I
Protocol
§ datagram format
§ IPv4 addressing
§ ICMP
§ IPv6
4.5 routing algorithms
§ link state
§ distance vector
archical routing
§ OSPF
§ BGP
4.7 broadcast and
multicast routing
Chapter 4: outline

---

## Page 11

Network Layer 4-11
Connection, connection-less
service
v datagram network provides network-
layer connectionless service
v virtual-circuit
ides
v
orien
-

layer services, but:
§ service: host-to-host
§ no choice: network provides one or
the other
§ implementation: in network core

---

## Page 12

Network Layer 4-12
Virtual circuits
v call s
 data
can flow
v each packet carries VC identifier (not
destination host address)
v every router on source-dest path maintains
“state” for each passing connection
v link, router resources (bandwidth, buffers)
may be allocated to VC (dedicated resources
= predictable service)
“source-to-dest path behaves much like
telephone circuit”
§ performan

---

## Page 13

Network Layer 4-13
VC implementation
a VC consists of:

1. path from source to destination
2. VC number
r each link
al
v
packet belonging to VC carries VC
number (rather than dest address)
v
VC number can be changed on each
link.
§
new VC number comes from forwarding
table

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
Incoming int
ing VC #
1                          12                               3                          22
2                          63                               1                          18
3                           7                                2                          17
1                          97                               3                           87
…                          …                                …                            …
forwarding table in
no
VC routers maintain connection state info

---

## Page 15

Network Layer 4-15
application
transport
network
data link
physical
Virtual circuits: signaling
protocols
v used to setup, maintain
teardown VC
v used in ATM, frame-relay, X.25

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
v routers: no state about end-to-end
connections
§ no network-
 “connection”

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
Datagram forwarding
table
IP destination address in
arriving packet’s header
routing algorithm
local forwarding table
dest address output  link
address-ran
4 billion IP
addresses, so rather
than list individual
destination address
list range of
ddresses

---

## Page 18

Network Layer 4-18
Destination Address Range
11001000 00010111 00010000 00000000
through
11001000 00010111 0
through
11001000
11001000 00010111 00011001 00000000
through
11001000 00010111 00011111 11111111
otherwise
Link Interface
0
2
3
Q: but what happens if ranges don’t divide up so nicely
Datagram forwarding
table

---

## Page 19

Network Layer 4-19
Longest prefix matching
11001
11001000 00010111 00011000 *********
11001000 00010111 00011*** *********
otherwise
DA: 11001000  00010111  00011000  10101010
examples:
DA: 11001000  00010111  00010110  10100001
which interface?
which interface?
when looking for forwarding table entry
for given destination address, use longest
address prefix that matches destination
address.
longest prefix matching
1
2
3

---

## Page 20

Network Layer 4-20
Datagram or VC network:
why?
Internet (datagram)
v data exchange among
computers
§ “elastic” servi
§ dif
§ uniform service difficult
v “smart” end systems
(computers)
§ can adapt, perform
control, error recovery
§ simple inside
network, complexity
at “edge”
ATM (VC)
v evolved from
telephony
an conversation:
trict timing,
ranteed
v “dumb” end systems
§ telephones
§ complexity inside
network

---

## Page 21

Network Layer 4-21
4.1 introduction
4.2 virtual circuit and
datagram netw
4.4 IP: I
Protocol
§ datagram format
§ IPv4 addressing
§ ICMP
§ IPv6
4.5 routing algorithms
§ link state
§ distance vector
archical routing
§ OSPF
§ BGP
4.7 broadcast and
multicast routing
Chapter 4: outline

---

## Page 22

Network Layer 4-22
Router architecture overview
two key router functions:
v run routing algorithms/protocol (RIP, OSPF,
BGP)
v forwarding datagrams from incoming to outgoing
link
high-seed
switching
fabric
router input ports
router output ports
forwarding data
plane  (hardware)
ent
re)
forwarding tables computed,

---

## Page 23

Network Layer 4-23
line
termination
link
layer
protocol
lookup,
forwarding
ing
Input port functions
decentralized switching:
v given datagram dest., lookup
output port using forwarding table
in input port memory (“match plus
action”)
v goal: complete input port
processing at ‘line speed’
v queuing: if datagrams arrive
faster than forwarding rate into
switch fabric
bit-level recep
data link layer:
e.g., Ethernet
see chapter 5
switch
fabric

---

## Page 24

Network Layer 4-24
Switching fabrics
v transfer packet from input buffer to
appropriate output buffer
v switching rate: rate at which packets
can be trans
s to outputs
v thre
memory
memory
bus
crossbar

---

## Page 25

Network Layer 4-25
Switching via memory
first generation routers:
v traditional computers with switching under
direct control of CPU
v packet copied t
ory
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
v datagram from input port
memory
    to output p
a
spee
bandwidth
v 32 Gbps bus, Cisco 5600:
sufficient speed for access
and enterprise routers
bus

---

## Page 27

Network Layer 4-27
Switching via interconnection
network
v overcome  bus bandwidth
limitations
v banyan networks, crossbar,
other intercon
v advanced design:
fragmenting datagram into
fixed length cells, switch cells
through the fabric.
v Cisco 12000: switches 60
Gbps through the
interconnection network
crossbar

---

## Page 28

Network Layer 4-28
Output ports
v buffering required when datagrams
arrive from fabric faster than the
transmission rate
v scheduling discipline chooses
among queued datagrams for
transmission
line
termination
link
layer
protocol
switch
fabric
datagram
buffer
queue
This slide in HUGELY important!
Datagram (packets) can be lost
due to congestion, lack of buffers
Priority scheduling – who gets best
performance, network neutrality

---

## Page 29

Network Layer 4-29
Output port queueing
v buffering when arrival rate via switch
exceeds output line speed
v queueing (delay) and loss due to output
port buffer overflow!
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
v RFC 3439 rule of thumb: average
buffering equal to “typical” RTT (say
250 msec) ti
ity C
buffe
RTT  C
.
N

---

## Page 31

Network Layer 4-31
Input port queuing
v fabric slower than input ports combined ->
queueing may occur at input queues
§ queueing delay and loss due to input buffer
overflow!
v Head-of-the-L
ng: queued
output port contention:
only one red datagram can
be transferred.
lower red packet is blocked
switch
fabric
one packet time
later: green
packet
experiences HOL
blocking
switch
fabric

---

## Page 32

Network Layer 4-32
4.1 introduction
4.2 virtual circuit and
datagram netw
4.4 IP: I
Protocol
§ datagram format
§ IPv4 addressing
§ ICMP
§ IPv6
4.5 routing algorithms
§ link state
§ distance vector
archical routing
§ OSPF
§ BGP
4.7 broadcast and
multicast routing
Chapter 4: outline

---

## Page 33

Network Layer 4-33
The Internet network layer
forwarding
table
host, router network layer functions:
otocol
entions
ICMP
protocol
• error reporting
• router
“signaling”
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
t
head.
len
type of
service
flgs
fragment
 offset
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
“type” of data
for
fragmentation/
reassembly
max number
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
IP fragmentation,
reassembly
v network links have
MTU (max.transfer
size) - largest
possible link-leve
type
MTUs
v large IP datagram
divided
(“fragmented”)
within net
§ one datagram
becomes several
datagrams
§ “reassembled”
only at final
fragmentation:
in: one large datagram
rams
reassembly
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
t
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
becomes
grams
example:
v 4000 byte
datagram
v
data fie
offset =
1480/8
IP fragmentation,
reassembly

---

## Page 37

Network Layer 4-37
4.1 introduction
4.2 virtual circuit and
datagram netw
4.4 IP: I
Protocol
§ datagram format
§ IPv4 addressing
§ ICMP
§ IPv6
4.5 routing algorithms
§ link state
§ distance vector
archical routing
§ OSPF
§ BGP
4.7 broadcast and
multicast routing
Chapter 4: outline

---

## Page 38

Network Layer 4-38
IP addressing: introduction
v IP address: 32-bit
identifier for host,
router interface
v interface:
physic
§ router’s typically
have multiple
interfaces
§ host typically has
one or two interfaces
(e.g., wired Ethernet,
wireless 802.11)
v IP addresses
associated with
each interface
223.1.1.1
223.1.1.2
223.1.1.4
223.1.2.9
223.1.2.2
223.1.2.1
223.1.3.2
223.1.3.1
223.1.1.1 = 11011111 00000001 00000001 00000001
223
1
1
1

---

## Page 39

Network Layer 4-39
IP addressing: introduction
Q: how are
interfaces actually
connected?
t
6.
223.1.1.1
223.1.1.2
223.1.1.4
223.1.2.9
223.1.2.2
223.1.2.1
223.1.3.2
223.1.3.1
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
§subnet part - high
order bits
§host part - low
§devic
with same subnet
part of IP address
§can physically
reach each other
without intervening
router
network consisting of 3 subnets
223.1.1.1
223.1.1.4
223.1.2.9
223.1.3.2
223.1.3.1
bnet
223.1.1.2
223.1.2.1

---

## Page 41

Network Layer 4-41
recipe
v to determine the
subnets, deta
route
islands of isolated
networks
v each isolated
network is called
a subnet
subnet mask: /24
Subnets
223.1.1.0/24
223.1.2.0/24
223.1.3.0/24
223.1.1.1
223.1.1.4
223.1.2.9
223.1.3.2
223.1.3.1
bnet
223.1.1.2
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
Subnets

---

## Page 43

Network Layer 4-43
IP addressing: CIDR
CIDR: Classless InterDomain Routing
§ subnet portion of address of arbitrary
length

11001000  00010111  00010000  00000000
subnet
part
host
part
200.23.16.0/23

---

## Page 44

Network Layer 4-44
IP addresses: how to get
one?
Q: How does a host get IP address?
v hard-coded b
in in a file
§ UN
v DHCP: Dynamic Host Configuration
Protocol: dynamically get address from
as server
§ “plug-and-play”

---

## Page 45

Network Layer 4-45
DHCP: Dynamic Host Configuration
Protocol
goal: allow host to dynamically obtain its IP address
from network server when it joins network
§ can renew its
s in use
§ sup
oin
network (more shortly)
DHCP overview:
§ host broadcasts “DHCP discover” msg [optional]
§ DHCP server responds with “DHCP offer” msg
[optional]
§ host requests IP address: “DHCP request” msg
§ DHCP server sends address: “DHCP ack” msg

---

## Page 46

Network Layer 4-46
DHCP client-server
scenario
223.1.1.0/24
223.1.2.0/24
223.1.3.0/24
223.1.1.1
223.1.1.3
223.1.3.2
223.1.3.1
223.1.3.27
223.1.2.2
223.1.2.1
DHCP
server
t needs
ss in this
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
DHCP client-server
scenario
Broadcast: is there a
DHCP server out there?
Broadcast: OK.  I’ll take
that IP address!
Broadcast: OK.  You’ve
got that IP address!

---

## Page 48

Network Layer 4-48
DHCP: more than IP
addresses
DHCP can return more than just allocated
IP address on subnet:
§ address of fir
r client
hos

---

## Page 49

Network Layer 4-49
v connecting laptop
needs its IP
address, addr of
first-hop router,
dr of DNS server:
router with DHCP
server built into
router
CP request
 in 802.1
Ethernet
v Ethernet frame
broadcast (dest:
FFFFFFFFFFFF) on LAN,
received at router
running DHCP server
v Ethernet demuxed to
IP demuxed, UDP
demuxed to DHCP
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
v DCP server
formulates DHCP
ACK containing
client’s IP address,
IP address of first-
p router for
 client,
demuxing up to
DHCP at client
DHCP: example
router with DHCP
server built into
router
DHCP
DHCP
DHCP
DHCP
U
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
v client now knows its
IP address, name
and IP address of
DSN server, IP
address of its first-
hop router

---

## Page 51

Network Layer 4-51
DHCP:
Wireshark
output (home
LAN)
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
e not given
t given
255.255.0
1
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
Your (c
Next s
Relay
Client MAC address:
Server host name not gi
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
IP addresses: how to get
one?
Q: how does network get subnet part of IP
addr?
A: gets allocated portion of its provider
ISP’s address
ISP's block
0.23.16.0/20
Organization 0    11001000  00010111  00010000  00000000    200.23.16.0/23
Organization 1    11001000  00010111  00010010  00000000    200.23.18.0/23
Organization 2    11001000  00010111  00010100  00000000    200.23.20.0/23
   ...                                          …..                                   ….                ….
Organization 7    11001000  00010111  00011110  00000000    200.23.30.0/23

---

## Page 53

Network Layer 4-53
Hierarchical addressing: route
aggregation
beginning
200.23.16.0/20”
200.23.
200.23.30.0/23
Fly-By-Night-ISP
Organization 0
Organization 7
Internet
ISPs-R-Us
“Send me anything
with addresses
beginning
199.31.0.0/16”
200.23.20.0/23
Organization 2
...
...
hierarchical addressing allows efficient advertisement o
information:

---

## Page 54

Network Layer 4-54
ISPs-R-Us has a more specific route to Organization 1
beginning
200.23.16.0/20”
200.23.18.0/23
200.23.30.0/23
Fly-By-Night-ISP
Organization 0
Organization 7
Internet
Organization 1
ISPs-R-Us
“Send me anything
with addresses
beginning 199.31.0.0/16
or 200.23.18.0/23”
200.23.20.0/23
Organization 2
...
...
Hierarchical addressing: more specific
routes

---

## Page 55

Network Layer 4-55
IP addressing: the last word...
Q: how does an ISP get block of
addresses?
A: ICANN: Inte
on for
http:
§ allocates addresses
§ manages DNS
§ assigns domain names, resolves
disputes

---

## Page 56

Network Layer 4-56
NAT: network address
translation
10.0.0.1
.2
10.0.0.3
local network
(e.g., home network)
10.0.0/24
rest of
Internet
datagrams with source or
destination in this network
have 10.0.0/24 address for
source, destination (as usual)
all datagrams leaving
local
network have same
single source NAT IP
address:
138.76.29.7,different
source port numbers

---

## Page 57

Network Layer 4-57
motivation: local network uses just one IP
address as far as outside world is
concerned:
:
§ can
n local
network without notifying outside world
§ can change ISP without changing
addresses of devices in local network
§ devices inside local net not explicitly
addressable, visible by outside world (a
security plus)
NAT: network address
translation

---

## Page 58

Network Layer 4-58
   implementation: NAT router must:
§ outgoing datagrams: replace (source IP address,
port #) of ever
gram to (NAT IP
(N
nation
addr
§ remember (in NAT translation table) every
(source IP address, port #)  to (NAT IP address,
new port #) translation pair
§ incoming datagrams: replace (NAT IP address,
new port #) in dest fields of every incoming
datagram with corresponding (source IP address,
port #) stored in NAT table
NAT: network address
translation

---

## Page 59

Network Layer 4-59
.0.1
10.0.0.2
10.0.0.3
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
updat
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
NAT: network address
translation

---

## Page 60

Network Layer 4-60
v 16-bit port-number field:
§ 60,000 simultaneous connections
with a sing
dress!
§
layer 3
§ violates end-to-end argument
• NAT possibility must be taken into
account by app designers, e.g., P2P
applications
§ address shortage should instead be
solved by IPv6
NAT: network address
translation

---

## Page 61

Network Layer 4-61
NAT traversal problem
v client wants to connect to
server with address
10.0.0.1
§ server address
local to LAN (cli
NAT
138.76.29.7
v solution1: statically
configure NAT to forward
incoming connection
requests at given port to
server
§ e.g., (123.76.29.7, port
2500) always forwarded to
10.0.0.1 port 25000
10.0.0.1
router
client
?

---

## Page 62

Network Layer 4-62
NAT traversal problem
v solution 2: Universal Plug
and Play (UPnP) Internet
Gateway Device (IGD)
Protocol.  Allow
v ad
mappings (with lease
times)
i.e., automate static NAT
port map configuration
10.0.0.1
router
IGD

---

## Page 63

Network Layer 4-63
NAT traversal problem
v solution 3: relaying (used in Skype)
§ NATed client establishes connection to relay
§ external client connects to relay
§ relay bridges
n to
138.76.29.7
client

1. connection
to
relay initiated
by NATed host
2. conn
to
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
datagram netw
4.4 IP: I
Protocol
§ datagram format
§ IPv4 addressing
§ ICMP
§ IPv6
4.5 routing algorithms
§ link state
§ distance vector
archical routing
§ OSPF
§ BGP
4.7 broadcast and
multicast routing
Chapter 4: outline

---

## Page 65

Network Layer 4-65
ICMP: internet control message
protocol
v used by hosts &
routers to
communicate
network-level
unre
network, port,
protocol
§ echo request/reply
(used by ping)
v network-layer
“above” IP:
§ ICMP msgs carried in
IP datagrams
v ICMP message: type,
code plus first 8
b t
f IP d t
Type  Code  description
0        0         echo reply (ping)
3        0         dest. network unreachable
   dest host unreachable
le
 unknown
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
v source sends series
of UDP segments to
dest
§ first set has TTL =1
§ second set has
v when
datagrams  arrives to
nth router:
§ router discards
datagrams
§ and sends source ICMP
messages (type 11,
code 0)
§ ICMP messages
includes name of
router & IP address
v when ICMP
messages arrives,
source records RTTs
ing criteria:

ost
v destination returns
ICMP “port
unreachable”
message (type 3,
code 3)
v source stops
3 probes
3 probes
3 probes

---

## Page 67

Network Layer 4-67
IPv6: motivation
v initial motivation: 32-bit address space
soon to be completely allocated.
v additional motivation:
§ hea
IPv6 datagram format:
§ fixed-length 40 byte header
§ no fragmentation allowed

---

## Page 68

Network Layer 4-68
IPv6 datagram format
priority:  identify priority among datagrams in fl
flow Label: identify datagrams in same “flow.”
                    (concept of“flow” not well defined)
r da
data
destination address
(128 bits)
source address
(128 bits)
payload len
next hdr
hop limit
32 bits

---

## Page 69

Network Layer 4-69
Other changes from IPv4
v checksum: removed entirely to reduce
processing time at each hop
v options: allo
e of header,
v
§ add
 Too
Big”
§ multicast group management functions

---

## Page 70

Network Layer 4-70
Transition from IPv4 to
IPv6
v not all routers can be upgraded
simultaneously
§ no “flag days”
v tunn
s
payload in IPv4 datagram among IPv4
routers
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
A
E
F
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
src: A
dest: F
data
A-to-B:
IPv6
Flow: X
Src: A
Dest: F
data
dest: E
B-to-C:
IPv6 inside
IPv4
E-to-F:
IPv6
X
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
dest: E
physical view:
A
E
F
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

---

## Page 73

Network Layer 4-73
IPv6:
adoption
v US National Institutes of Standards
estimate [2013]:
§ ~3% of industry IP routers
§ ~11% of US
v Long
se
§ 20 years and counting!
§ think of application-level changes in last 20
years: WWW, Facebook, …
§ Why?

---

## Page 74

Network Layer 4-74
4.1 introduction
4.2 virtual circuit and
datagram netw
4.4 IP: I
Protocol
§ datagram format
§ IPv4 addressing
§ ICMP
§ IPv6
4.5 routing algorithms
§ link state
§ distance vector
archical routing
§ OSPF
§ BGP
4.7 broadcast and
multicast routing
Chapter 4: outline

---

## Page 75

Network Layer 4-75
1
2
3
IP destination address in
arriving packet’s header
routing algorithm
local forwarding table
dest addr
Interplay between routing,
forwarding
routing algorithm determines
end-end-path through network
forwarding table determines
ocal forwarding at this router

---

## Page 76

Network Layer 4-76
w
v
z
2
5
3
5
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
w
v
2
2
1
5
3
5
c(x,x’) = cost of link (x,x’)
      e.g., c(w,z) = 5
 could always be 1, or
dth,
cost of path (x1, x2, x3,…, xp) = c(x1,x2) + c(x2,x3) + … + c(xp-1,xp)
key question: what is the least-cost path between u
routing algorithm: algorithm that finds that least co

---

## Page 78

Network Layer 4-78
Routing algorithm
classification
Q: global or decentralized
information?
global:
v all routers have
v “link s
decentralized:
v router knows
physically-connected
neighbors, link costs to
neighbors
v iterative process of
computation, exchange
of info with neighbors
v “distance vector”
Q: static or
dynamic?
static:
tes change slowly
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
datagram netw
4.4 IP: I
Protocol
§ datagram format
§ IPv4 addressing
§ ICMP
§ IPv6
4.5 routing algorithms
§ link state
§ distance vector
archical routing
§ OSPF
§ BGP
4.7 broadcast and
multicast routing
Chapter 4: outline

---

## Page 80

Network Layer 4-80
A Link-State Routing
Algorithm
Dijkstra’s algorithm
v net topology, link
costs known to
nodes
§ all n
info
v computes least cost
paths from one node
(‘source”) to all
other nodes
§ gives forwarding table
for that node
v iterative: after k
iterations, know
least cost path to k
notation:
v c(x,y): link cost from
x to y;  = ∞ if
rect neighbors
v
v p(v): predecessor
node along path
from source to v
v N': set of nodes
whose least cost
path definitively
known

---

## Page 81

Network Layer 4-81
Dijsktra’s Algorithm
1  Initialization:
2    N' = {u}
3    for all nodes v
4      if v adjacent t
7
8   Lo
9     find w not in N' such that D(w) is a minimum
10    add w to N'
11    update D(v) for all v adjacent to w and not in N' :
12       D(v) = min( D(v), D(w) + c(w,v) )
13    /*new cost to v is either old cost to v or known
14     shortest path cost to w plus cost from w to v*/
15  until all nodes in N'

---

## Page 82

Network Layer 4-82
w
3
4
v
u
5
3
7
4
y
8
z
2
7
9
Dijkstra’s algorithm: example
Step
N'
D(v)
p(v)
0
1
2
3
4
5
D(w)
p(w)
D(x)
p(x)
D(y)
p(y)
D(z)
p(z)
u
∞
∞
7,u
3,u
5,u
uw
∞
11,w
6,w
5,u
14,x
11,w
6,w
uwx
uwxv
notes:
v construct shortest path
tree by tracing
predecessor nodes
v ties can exist (can be
broken arbitrarily)

---

## Page 83

Network Layer 4-83
Dijkstra’s algorithm: another
example
Step
0
1
2
5
N'
u
ux
uxy
uxyv
D(v),p(v)
2,u
2,u
2
D(w),p(w)
5,u
4,x
D(x),p(x)
1,u
D(y),p(y)
∞
2,x
D(z),p(z)
∞
∞
4,y
,y
,y
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

---

## Page 84

Network Layer 4-84
Dijkstra’s algorithm: example
(2)
u
w
v
resulting shortest-path tree from u:
v
x
y
w
z
(u,v)
(u,x)
(u,x)
(u,x)
(u,x)
destination
link
resulting forwarding table in u:

---

## Page 85

Network Layer 4-85
Dijkstra’s algorithm,
discussion
algorithm complexity: n nodes
v each iteration: need to check all nodes, w,
not in N
v n(n+1)/2 com
oscilla
v e.g., support link cost equals amount of
carried traffic:
A
D
C
B
1
1+e
e
0
e
1
1
0
0
initially
A
D
C
B
given these costs,
find new routing….
resulting in new costs
2+e
0
0
0
1+e 1
A
D
C
B
given these costs,
find new routing….
resulting in new costs
0
2+e
1+e
1
0
0
A
D
C
B
given these costs,
find new routing….
resulting in new cost
2+e
0
0
0
1+e 1

---

## Page 86

Network Layer 4-86
4.1 introduction
4.2 virtual circuit and
datagram netw
4.4 IP: I
Protocol
§ datagram format
§ IPv4 addressing
§ ICMP
§ IPv6
4.5 routing algorithms
§ link state
§ distance vector
archical routing
§ OSPF
§ BGP
4.7 broadcast and
multicast routing
Chapter 4: outline

---

## Page 87

Network Layer 4-87
Distance vector algorithm
Bellman-Ford equation (dynamic
programming)
l
x
y
then
   dx(y) = min {c(x,v) + dv(y) }

v
cost to neighbor v
min taken over all neighbors v of x
cost from neighbor v to destinat

---

## Page 88

Network Layer 4-88
Bellman-Ford example
u
w
v
2
2
1
5
3
5
clearly, dv(z) = 5, dx(z) = 3, dw(z) = 3
x(z),
                    c(u,w) + dw(z) }
         = min {2 + 5,
                    1 + 3,
                    5 + 3}  = 4
node achieving minimum is next
hop in shortest path, used in forwarding table
says:

---

## Page 89

Network Layer 4-89
Distance vector algorithm
v Dx(y) = estimate of least cost from x to
y
§ x maintains
Dx = [Dx(y): y
§ kn
(x,v)
§ maintains its neighbors’ distance
vectors. For each neighbor v, x
maintains
Dv = [Dv(y): y є N ]

---

## Page 90

Network Layer 4-90
key idea:
v from time-to-time, each node sends its
own distance
te to
v
neig
ng
B-F equation:
Dx(y) ← minv{c(x,v) + Dv(y)}  for each node y ∊ N
v under minor, natural conditions, the
estimate Dx(y) converge to the actual
least cost dx(y)
Distance vector algorithm

---

## Page 91

Network Layer 4-91
iterative,
asynchronous:
each local iteration
caused by:
v DV u
from neighbor
distributed:
v each node notifies
neighbors only when
its DV changes
§ neighbors then notify
their neighbors if
necessary
t for (change in local link
recompute estimates
if DV to any dest has
changed, notify neighbors
each node:
Distance vector algorithm

---

## Page 92

Network Layer 4-92
x   y   z
x
y
z
0  2   7
∞∞
∞
∞∞
∞
from
cost to
from
from
x   y   z
x
y
z
0
x
y
z
∞
∞∞
∞
x   y   z
x
y
z
∞∞
∞
7 1
0
cost to
∞
2   0   1
∞ ∞  ∞
2   0   1
7   1   0
time
z
7
node x
table
Dx(y) = min{c(x,y) + Dy(y), c(x,z) + Dz(y)}
             = min{2+0 , 7+1} = 2
Dx(z) = min{c(x,y) +
      Dy(z), c(x,z) + Dz(z)}
= min{2+1 , 7+0} = 3
3
2
no
t
node z
table
cost to
from

---

## Page 93

Network Layer 4-93
x   y   z
x
y
0  2   3
from
cost to
y
z
from
y
z
from
x   y   z
x
y
z
0  2   3
from
cost to
x   y   z
x
y
z
0  2   7
from
cost to
2  0   1
7   1   0
2  0   1
3  1   0
2   0   1
 1   0
2  0   1
3  1   0
2  0   1
3  1   0
time
x   y   z
x
y
z
0  2   7
∞∞
∞
∞∞
∞
from
cost to
from
from
x   y   z
x
y
z
0
x
y
z
∞
∞∞
∞
x   y   z
x
y
z
∞∞
∞
7 1
0
cost to
∞
2   0   1
∞ ∞  ∞
2   0   1
7   1   0
time
z
7
node x
table
Dx(y) = min{c(x,y) + Dy(y), c(x,z) + Dz(y)}
             = min{2+0 , 7+1} = 2
Dx(z) = min{c(x,y) +
      Dy(z), c(x,z) + Dz(z)}
= min{2+1 , 7+0} = 3
3
2
no
t
node z
table
cost to
from

---

## Page 94

Network Layer 4-94
Distance vector: link cost
changes
link cost changes:
v node detects local link cost
change
v updates routin
v if DV
neighbors
“good
news
travels
fast”
x
z
1
4
50
y
1
t0 : y detects link-cost change, updates its DV, informs its
neighbors.
t1 : z receives update from y, updates its table, computes new
least cost to x , sends its neighbors its DV.
t2 : y receives z’s update, updates its distance table.  y’s least costs
do not change, so y  does not send a message to z.

---

## Page 95

Network Layer 4-95
Distance vector: link cost
changes
link cost changes:
v node detects local link cost
change
v bad news trave
v
algori
text
x
z
1
4
50
y
60
poisoned reverse:
v If Z routes through Y to get to X :
§ Z tells Y its (Z’s) distance to X is infinite (so Y
won’t route to X via Z)
v will this completely solve count to infinity
problem?

---

## Page 96

Network Layer 4-96
Comparison of LS and DV
algorithms
message complexity
v LS: with n nodes, E links,
O(nE) msgs sent
v DV: exchange between
neighbors only
speed
convergence
v LS: O(n2) algorithm
requires O(nE) msgs
§ may have oscillations
v DV: convergence time
varies
§ may be routing loops
§ count-to-infinity
problem
robustness: what
happens if router
malfunctions?
able
DV:
§ DV node can advertise
incorrect path cost
§ each node’s table used
by others
• error propagate thru
network

---

## Page 97

Network Layer 4-97
4.1 introduction
4.2 virtual circuit and
datagram netw
4.4 IP: I
Protocol
§ datagram format
§ IPv4 addressing
§ ICMP
§ IPv6
4.5 routing algorithms
§ link state
§ distance vector
archical routing
§ OSPF
§ BGP
4.7 broadcast and
multicast routing
Chapter 4: outline

---

## Page 98

Network Layer 4-98
Hierarchical
routing
scale:
million
destinations:
v can’t store all dest’s
in routing tables!
v routing table
exchange would
swamp links!
autonomy
v internet = network of
networks
v each network admin
may want to control
routing in its own
network
our routing study thus far -
idealization
v all routers identical
v network

---

## Page 99

Network Layer 4-99
v aggregate routers
into regions,
“autonomous
systems” (AS
AS r
routing protocol
§ “intra-AS” routing
protocol
§ routers in
different AS can
run different intra-
AS routing
protocol
gateway router:
v at “edge” of its own
AS
  link to router in
Hierarchical
routing

---

## Page 100

Network Layer 4-100
3b
3a
1c
2a
AS3
2c
Intra-AS
Routing
algorithm
Inter-AS
Routing
algorithm
Forwarding
table
3c
Interconnected ASes
by both
intra- and inter-AS
routing algorithm
§ intra-AS sets
entries for internal
dests
§ inter-AS & intra-
AS sets entries for
external dests

---

## Page 101

Network Layer 4-101
Inter-AS tasks
v suppose router in
AS1 receives
datagram destined
outside of AS1:
§ router shoul
but
AS1 must:
1.
learn which dests
are reachable
through AS2, which
ugh AS3
AS1
job of inter-AS routing!
AS3
AS2
3b
3c
3a
AS1
1c
1a
1d
1b
2a
2c
2b
other
networks
other
networks

---

## Page 102

Network Layer 4-102
Example: setting forwarding table in
router 1d
v suppose AS1 learns (via inter-AS protocol) that
subnet x reachable via AS3 (gateway 1c), but not
via AS2
§ inter-AS protocol propagates reachability info to
all internal ro
v
§ inst
AS3
AS2
3b
3c
3a
AS1
1c
1a
1d
1b
2a
2c
2b
other
networks
other
networks
x
…

---

## Page 103

Network Layer 4-103
Example: choosing among multiple
ASes
v now suppose AS1 learns from inter-AS protocol
that subnet x is reachable from AS3 and from
AS2.
v to configure for
uter 1d must
§ this
col!
AS3
AS2
3b
3c
3a
AS1
1c
1a
1d
1b
2a
2c
2b
other
networks
other
networks
x
……
…
?

---

## Page 104

Network Layer 4-104
learn from inter-AS
protocol that subnet
x is reachable via
multiple gateways
use routing info
from intra-AS
protocol to determine
costs of least-cost
paths to each
of the gateways
hot potato routing:
choose the gateway
that has the
smallest least cost
determine from
forwarding table the
interface I that leads
to least-cost gateway.
Enter (x,I) in
forwarding table
Example: choosing among multiple
ASes
v now suppose AS1 learns from inter-AS protocol
that subnet x is reachable from AS3 and from
AS2.
v to configure forwarding table, router 1d must
determine towar
y it should
v hot po
losest
of two routers.

---

## Page 105

Network Layer 4-105
4.1 introduction
4.2 virtual circuit and
datagram netw
4.4 IP: I
Protocol
§ datagram format
§ IPv4 addressing
§ ICMP
§ IPv6
4.5 routing algorithms
§ link state
§ distance vector
archical routing
§ OSPF
§ BGP
4.7 broadcast and
multicast routing
Chapter 4: outline

---

## Page 106

Network Layer 4-106
Intra-AS Routing
v also known as interior gateway
protocols (IGP)
v most commo
ting
§ OSPF: Open Shortest Path First
§ IGRP: Interior Gateway Routing
Protocol (Cisco proprietary)

---

## Page 107

Network Layer 4-107
RIP ( Routing Information
Protocol)
v included in BSD-UNIX distribution in 1982
v distance vector algorithm
§ distance metric: # hops (max = 15 hops), each link has
cost 1
§ DVs exchanged
 30 sec in response
(in IP
D
C
B
A
u
v
w
x
y
z
subnet    hops
      u         1
      v         2
      w        2
      x         3
      y         3
      z         2

from router A to destination subnets:

---

## Page 108

Network Layer 4-108
RIP: example
destination subnet
  next  router      # hops to dest

w
A
2
y
B
2

z
B
7
x
--

1
….
….
....
routing table in router D
w
x
y
z
A

---

## Page 109

Network Layer 4-109
w
x
y
z
destination subnet
  next  router      # hops to dest

w
A
2
y
B
2

z
B
7
x
--

1
….
….
....
routing table in router D
A
5
 dest     next  hops
   w

-       1

   x

-       1

   z
  C      4
   ….
  …     ...
A-to-D advertisement
RIP:
example

---

## Page 110

Network Layer 4-110
RIP: link failure, recovery
if no advertisement heard after 180 sec -->
neighbor/link declared dead
§ routes via neighbor invalidated
§ new advertis
eighbors
s
§ link
to entire
net
§ poison reverse used to prevent ping-pong
loops (infinite distance = 16 hops)

---

## Page 111

Network Layer 4-111
RIP table processing
v RIP routing tables managed by
application-level process called route-d
(daemon)
physical
link
network       forwarding
   (IP)             table
transport
  (UDP)
physical
link
network
   (IP)
transprt
  (UDP)
forwarding
table

---

## Page 112

Network Layer 4-112
OSPF (Open Shortest Path
First)
v “open”: publicly available
v uses link state algorithm
§ LS packet di
v OSPF
try per
neighbor
v advertisements flooded to entire AS
§ carried in OSPF messages directly over IP
(rather than TCP or UDP
v IS-IS routing protocol: nearly identical to
OSPF

---

## Page 113

Network Layer 4-113
OSPF “advanced” features (not
in RIP)
v security: all OSPF messages authenticated
(to prevent malicious intrusion)
v multiple same-cost paths allowed (only
one path in R
differ
t set
“low” for best effort ToS; high for real time
ToS)
v integrated uni- and multicast support:
§ Multicast OSPF (MOSPF) uses same
topology data base as OSPF
v hierarchical OSPF in large domains.

---

## Page 114

Network Layer 4-114
Hierarchical
OSPF
boundary router
backbone router
area 1
area 2
area 3
internal
routers

---

## Page 115

Network Layer 4-115
v two-level hierarchy: local area, backbone.
§ link-state advertisements only in area
§ each nodes
area topology;
v area
distances  to nets in own area, advertise
to other Area Border routers.
v backbone routers: run OSPF routing
limited to backbone.
v boundary routers: connect to other AS’s.
Hierarchical
OSPF

---

## Page 116

Network Layer 4-116
Internet inter-AS routing:
BGP
v BGP (Border Gateway Protocol): the de
facto inter-domain routing protocol
§ “glue that holds the Internet together”
inf
§ iBGP: propagate reachability information
to all AS-internal routers.
§ determine “good” routes to other networks
based on reachability information and
policy.
v allows subnet to advertise its existence
to rest of Internet: “I am here”

---

## Page 117

Network Layer 4-117
BGP basics
efix
§ AS3
nt
AS3
AS2
3b
3c
3a
AS1
1c
1a
1d
1b
2a
2c
2b
other
networks
other
networks
v BGP session: two BGP routers (“peers”) exchange
BGP messages:
§ advertising paths to different destination network prefixes
(“path vector” protocol)
§ exchanged over semi-permanent TCP connections
BGP
message

---

## Page 118

Network Layer 4-118
BGP basics: distributing path
information
AS3
AS2
3b
3a
AS1
1c
1a
1d
1b
2a
2c
2b
other
networks
other
networks
v using eBGP session between 3a and 1c, AS3
sends prefix reachability info to AS1.
§ 1c can then use iBGP do distribute new prefix info to
all routers in AS1
§ 1b can then re-
ability info to AS2
entry
eBGP session
iBGP session

---

## Page 119

Network Layer 4-119
Path attributes and BGP
routes
v advertised prefix includes BGP attributes
§ prefix + attributes = “route”
v two importan
§ NEX
S router
to next-hop AS. (may be multiple links from
current AS to next-hop-AS)
v gateway router receiving route
advertisement uses import policy to
accept/decline
§ e.g., never route through AS x
§ policy-based routing

---

## Page 120

Network Layer 4-120
BGP route selection
v router may learn about more than 1
route to destination AS, selects route
based on:

1. local prefe
bute: policy
3. closest NEXT-HOP router: hot potato
routing
4. additional criteria

---

## Page 121

Network Layer 4-121
BGP messages
v BGP messages exchanged between peers over
TCP connection
v BGP messages:
§ OPEN: opens
 to peer and
§
old
§ KEEPALIVE: keeps connection alive in absence
of UPDATES; also ACKs OPEN request
§ NOTIFICATION: reports errors in previous
msg; also used to close connection

---

## Page 122

Putting it Altogether:
How Does an Entry Get
Into a Router’s Forwarding
Table?
v Ties together hierarchical routing
(Section 4.5.3) with BGP (4.6.3) and
OSPF (4.6.2).
v Provides nice overview of BGP!

---

## Page 123

1
2
3
Dest IP
routing algorithms
212/8
…………..
4
…
How does entry get in forwarding
table?
Assume prefix is

---

## Page 124

High-level overview

1. Router beco
prefix
3. Rou
ding
table
How does entry get in forwarding
table?

---

## Page 125

Router becomes aware of
prefix
AS3
3b
3c
3a
2c
other
networks
ot
ne
BGP
message
v BGP message contains “routes”
v “route” is a prefix and attributes: AS-PATH, NEXT-
HOP,…
v Example: route:
v Prefix:138.16.64/22 ;  AS-PATH:  AS3  AS131 ;
NEXT-HOP:  201.44.13.125

---

## Page 126

Router may receive multiple
routes
AS3
3b
3c
3a
2c
other
networks
ot
ne
BGP
message
v Router may receive multiple routes for
same prefix
v Has to select one route

---

## Page 127

v Router selects route based on shortest
AS-PATH
Select best BGP route to
prefix
v AS
v AS3 AS131 AS201 to 138.16.64/22
v What if there is a tie? We’ll come back
to that!

---

## Page 128

Find best intra-route to BGP
route
v Use selected route’s NEXT-HOP attribute
§ Route’s NEXT-HOP attribute is the IP address of
the router interface that begins the AS PATH.
v Example:
v Rout
ath
from 1c to 111.99.86.55
AS3
AS2
3b
3c
3a
AS1
1c
1a
1d
1b
2a
2c
2b
other
networks
other
networks
111.99.86.55

---

## Page 129

Router identifies port for
route
v Identifies port along the OSPF shortest
path
v Adds prefix-
s forwarding
§ (1
AS3
AS2
3b
3c
3a
AS1
1c
1a
1d
1b
2a
2c
2b
other
networks
other
networks
router
port
1
2 3
4

---

## Page 130

Hot Potato Routing
v Suppose there two or more best inter-
routes.
v Then choose
sest NEXT-HOP
§ Q:
AS17?
§ A: route AS3 AS201 since it is closer
AS3
AS2
3b
3c
3a
AS1
1c
1a
1d
1b
2a
2c
2b
other
networks
other
networks

---

## Page 131

Summary

1. Router beco
prefix
2. Det
refix
§
Use BGP route selection to find best inter-
AS route
§
Use OSPF to find best intra-AS route
leading to best inter-AS route
§
Router identifies router port for that best
route
3. Enter prefix-port entry in forwarding
table
How does entry get in forwarding
table?

---

## Page 132

Network Layer 4-132
BGP routing policy
v A,B,C are provider networks
v X,W,Y are customer (of provider networks)
v X is dual-homed: attached to two networks
§ X does not want to route from B via X to C
§ .. so X will not advertise to B a route to C
A
B
C
W
X
legend:
customer
network:
provider
network

---

## Page 133

Network Layer 4-133
BGP routing policy (2)
v A adve
v B advertises path BAW to X
v Should B advertise path BAW to C?
§ No way! B gets no “revenue” for routing CBAW since
neither W nor C are B’s customers
§ B wants to force C to route to w via A
§ B wants to route only to/from its customers!
A
B
C
W
X
legend:
customer
network:
provider
network

---

## Page 134

Network Layer 4-134
Why different Intra-, Inter-AS
routing ?
policy:
v inter-AS: admin wants control over how its
traffic routed
hrough its net.
scale:
v hierarchical routing saves table size,
reduced update traffic
performance:
v intra-AS: can focus on performance
v inter-AS: policy may dominate over
performance

---

## Page 135

Network Layer 4-135
4.1 introduction
4.2 virtual circuit and
datagram netw
4.4 IP: I
Protocol
§ datagram format
§ IPv4 addressing
§ ICMP
§ IPv6
4.5 routing algorithms
§ link state
§ distance vector
archical routing
§ OSPF
§ BGP
4.7 broadcast and
multicast routing
Chapter 4: outline

---

## Page 136

Network Layer 4-136
R1
R3
R4
source
duplication
R3
R4
in-network
duplication
duplicate
cre
duplicate
Broadcast routing
v deliver packets from source to all other
nodes
v source duplication is inefficient:
v source duplication: how does source
determine recipient addresses?

---

## Page 137

Network Layer 4-137
In-network duplication
v flooding: when node receives broadcast
packet, sends copy to all neighbors
§ problems: cy
t storm
same
§ node keeps track of packet ids already
broadacsted
§ or reverse path forwarding (RPF): only
forward packet if it arrived on shortest path
between node and source
v spanning tree:
§ no redundant packets received by any node

---

## Page 138

Network Layer 4-138
B
G
D
E
c
F
B
G
D
E
c
F
(a) broadcast initiated at A
(b) broadcast initiated at D
Spanning tree
v first construct a spanning tree
v nodes then forward/make copies only
along spanni

---

## Page 139

Network Layer 4-139
B
G
D
E
c
F
1
2
3
4
5
(a) stepwise construction of
spanning tree (center: E)
B
G
D
E
c
F
(b) constructed spanning
tree
Spanning tree: creation
v center node
v each node sends unicast join message
to center node
§ message for
rives at a node

---

## Page 140

Network Layer 4-140
Multicast routing: problem
statement
goal: find a tree (or trees) connecting
routers having local mcast group members
v tree: not all paths between routers used
v shared-tree: sa
roup members
shared tree
source-based trees
group
member
not group
r
router
with a
group
member
router
without
group
member
legend
v

---

## Page 141

Network Layer 4-141
Approaches for building mcast
trees
approaches:
v source-based tree: one tree per source
§ shortest path trees
§ reverse path
§ mi
§ center-based trees
…we first look at basic approaches, then specific protocols
adopting these approaches

---

## Page 142

Network Layer 4-142
Shortest path tree
v mcast forwarding tree: tree of shortest
path routes from source to all receivers
§ Dijkstra’s alg
i
ttached
group member
router with no attached
group member
link used for forwarding,
i indicates order link
added by algorithm
R2
R3
R4
R5
R6
R7
1
6
3
4
5

---

## Page 143

Network Layer 4-143
Reverse path forwarding
if (
ng
link on shortest path back to center)
   then flood datagram onto all outgoing
links
   else ignore datagram
v rely on router’s knowledge of unicast
shortest pat
ender

---

## Page 144

Network Layer 4-144
Reverse path forwarding:
example
v result is a source-specific reverse SPT
§ may be a bad choice with asymmetric
links
router with attached
group member
ll be  forwarded
LEGEND
R1
R2
R3
R4
R6
R7
s: source
datagram will not be
forwarded

---

## Page 145

Network Layer 4-145
Reverse path forwarding:
pruning
v forwarding tree contains subtrees with no mcast
group members
§ no need to forward datagrams down subtree
§ “prune” msgs sent upstream by router with
no downstre
ers
router with attached
group member
router with no attached
group member
prune message
links with multicast
forwarding
P
R
R2
R3
R4
R5
R6
R7
s:
P
P

---

## Page 146

Network Layer 4-146
Shared-tree: steiner tree
v steiner tree: minimum cost tree
connecting all routers with attached
group memb
v
v not used in practice:
§ computational complexity
§ information about entire network needed
§ monolithic: rerun whenever a router needs
to join/leave

---

## Page 147

Network Layer 4-147
Center-based trees
v single delivery tree shared by all
v one router identified as “center” of tree
v to join:
§ joi
routers and forwarded towards center
§ join-msg either hits existing tree branch for
this center, or arrives at center
§ path taken by join-msg becomes new
branch of tree for this router

---

## Page 148

Network Layer 4-148
Center-based trees:
example
suppose R6 chosen as center:
router with no attached
group member
path order in which join
messages generated
2
1
1
R2
R3
R5
R6
R7

---

## Page 149

Network Layer 4-149
Internet Multicasting Routing:
DVMRP
v DVMRP: distance vector multicast
routing protocol, RFC1075
v flood and pru
ath
tab
DVMRP routers
§ no assumptions about underlying unicast
§ initial datagram to mcast group flooded
everywhere via RPF
§ routers not wanting group: send upstream
prune msgs

---

## Page 150

Network Layer 4-150
DVMRP: continued…
v soft state: DVMRP router periodically (1
min.) “forgets”  branches are pruned:
§ mcast data again flows down unpruned branch
v route
§ following IGMP join at leaf
v odds and ends
§ commonly implemented in commercial router

---

## Page 151

Network Layer 4-151
Tunneling
Q: how to connect “islands” of multicast
routers in a “sea” of unicast routers?
v mcast datagram encapsulated inside “normal”
(non-multicast-addressed) datagram
v normal IP datagram sent thru “tunnel” via
regular IP unicast to receiving mcast router
(recall IPv6 inside IPv4 tunneling)
v receiving mcast router unencapsulates to get
mcast datagram
physical topology
logical topology

---

## Page 152

Network Layer 4-152
PIM: Protocol Independent
Multicast
v not dependent on any specific
underlying unicast routing algorithm
(works with all)
v group members
densely packed, in
“close” proximity.
v bandwidth more
plentiful
v
 group
members small wrt #
interconnected
networks
v group members “widely
dispersed”
v bandwidth not plentiful

---

## Page 153

Network Layer 4-153
Consequences of sparse-dense
dichotomy:
dense
v group membership by
routers assume
routers explicitl
v
constr
tree (e.g., RPF)
v bandwidth and non-
group-router
processing profligate
sparse:
v no membership until
s explicitly join
v bandwidth and non-
group-router
processing conservative

---

## Page 154

Network Layer 4-154
PIM- dense mode
flood-and-prune RPF: similar to
DVMRP but…
v underlying u
l provides
v less
downstream flood than DVMRP
reduces reliance on underlying
routing algorithm
v has protocol mechanism for router to
detect it is a leaf-node router

---

## Page 155

Network Layer 4-155
PIM - sparse
mode
v center-based
approach
v router sends joi
msg to rendezv
§
rou
state and forward
join
v after joining via RP,
router can switch to
source-specific tree
§ increased
performance: less
concentration,
shorter paths
all data multicast
from rendezvous
point
rendezvous
point
join
R1
R3
R4
R5
R6
R7

---

## Page 156

Network Layer 4-156
sender(s):
v unicast data to
RP, which
v RP c
mcast tree
upstream to
source
v RP can send stop
msg if no
attached
receivers
§ “no one is
all data multicast
from rendezvous
point
rendezvous
point
join
R1
R3
R4
R5
R6
R7
PIM - sparse
mode

---

## Page 157

Network Layer 4-157
4.1 introduction
4.2 virtual circuit and
datagram networks
4.3 what’s inside
Proto
§ datagram format,
IPv4 addressing,
ICMP, IPv6
4.5 routing algorithms
§ link state, distance
vector, hierarchical
ing
4.7 broadcast and
multicast routing
Chapter 4: done!
v understand principles behind network layer
services:
§ network layer service models, forwarding
versus routing how a router works, routing
(path selection), broadcast, multicast
v instantiation, implementation in the Internet
