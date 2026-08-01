# ch05-chapter-5-v6.01 - Part 03 (Pages 67-97)

---

## Page 67

Link Layer 5-67
Interconnecting switches
v switches can be connected together
Q: sending from A to G - how does S1 know to
forward frame destined to F via S4 and S3?
v A: self learning! (works exactly the same as in
single-switch case!)
A
B
S1
C
D
E
F
S2
S4
S3
H
I
G

---

## Page 68

Link Layer 5-68
Self-learning multi-switch example
Suppose C sends frame to I, I responds to C
v Q: show switch tables and packet forwarding in S1, S2, S3, S4
A
B
S1
C
D
E
F
S2
S4
S3
H
I
G

---

## Page 69

Link Layer 5-69
Institutional network
to external
network
router
IP subnet
mail server
web server

---

## Page 70

Link Layer 5-70
Switches vs. routers
both are store-and-forward:
§ routers: network-layer
devices (examine network-
layer headers)
§ switches: link-layer devices
(examine link-layer
headers)
both have forwarding tables:
§ routers: compute tables
using routing algorithms, IP
addresses
§ switches: learn forwarding
table using flooding,
learning, MAC addresses
application
transport
network
link
physical
network
link
physical
link
physical
switch
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
v CS user moves office to
EE, but wants connect to
CS switch?
v single broadcast domain:
§ all layer-2 broadcast
traffic (ARP, DHCP,
unknown location of
destination MAC
address) must cross
entire LAN
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
grouped (by switch management
software) so that single physical
switch ……
switch(es) supporting
VLAN capabilities can
be configured to
define multiple virtual
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
Electrical Engineering
(VLAN ports 1-8)
Computer Science
(VLAN ports 9-15)
15
…
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
… operates as multiple virtual switches

---

## Page 73

Link Layer 5-73
Port-based VLAN
1
8
9
16
10
2
7
…
Electrical Engineering
(VLAN ports 1-8)
Computer Science
(VLAN ports 9-15)
15
…
v traffic isolation: frames to/from
ports 1-8 can only reach ports
1-8
§ can also define VLAN based on
MAC addresses of endpoints,
rather than switch port
v dynamic membership: ports
can be dynamically assigned
among VLANs
router
v forwarding between VLANS: done via
routing (just as with separate
switches)
§ in practice vendors sell combined
switches plus routers

---

## Page 74

Link Layer 5-74
VLANS spanning multiple switches
v trunk port: carries frames between VLANS defined over
multiple physical switches
§ frames forwarded within VLAN between switches cant be vanilla
802.1 frames (must carry VLAN ID info)
§ 802.1q protocol adds/removed additional header fields for frames
forwarded between trunk ports
1
8
9
10
2
7
…
Electrical Engineering
(VLAN ports 1-8)
Computer Science
(VLAN ports 9-15)
15
…
2
7
3
Ports 2,3,5 belong to EE VLAN
Ports 4,6,7,8 belong to CS VLAN
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
802.1Q frame
dest.
address
source
address
data (payload)
CRC
preamble
dest.
address
source
address
preamble
data (payload)
CRC
type

---

## Page 76

Link Layer 5-76
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

## Page 77

Link Layer 5-77
Multiprotocol label switching (MPLS)
v initial goal: high-speed IP forwarding using fixed
length label (instead of IP address)
§ fast lookup using fixed length identifier (rather than
shortest prefix matching)
§ borrowing ideas from Virtual Circuit (VC) approach
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
v forward packets to outgoing interface based only on
label value (dont inspect IP address)
§ MPLS forwarding table distinct from IP forwarding tables
v flexibility:  MPLS forwarding decisions can differ from
those of IP
§ use destination and source addresses to route flows to
same destination differently (traffic engineering)
§ re-route flows quickly if link fails: pre-computed backup
paths (useful for VoIP)

---

## Page 79

Link Layer 5-79
R2
D
R3
R5
A
R6
MPLS versus IP paths
IP router
v IP routing: path to destination determined
by destination address alone
R4

---

## Page 80

Link Layer 5-80
R2
D
R3
R4
R5
A
R6
MPLS versus IP paths
IP-only
router
v IP routing: path to destination determined
by destination address alone
MPLS and
IP router
v MPLS routing: path to destination can be
based on source and dest. address
§ fast reroute: precompute backup routes in
case of link failure
entry router (R4)  can use different MPLS
routes to A based, e.g., on source address

---

## Page 81

Link Layer 5-81
MPLS signaling
v modify OSPF, IS-IS link-state flooding protocols to
carry info used by MPLS routing,
§ e.g., link bandwidth, amount of reserved link bandwidth
D
R4
R5
A
R6
v entry MPLS router uses RSVP-TE signaling protocol to set
up MPLS forwarding at downstream routers
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
6        -
A       0
in         out                 out
label     label   dest    interface
10      6      A       1
12      9      D       0
in         out                 out
label     label   dest    interface
10      A       0
12      D       0
1
in         out                 out
label     label   dest    interface
8        6      A       0
0
8      A       1
MPLS forwarding tables

---

## Page 83

Link Layer 5-83
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

## Page 84

Link Layer 5-84
Data center networks
v 10’s to 100’s of thousands of hosts, often closely
coupled, in close proximity:
§ e-business (e.g. Amazon)
§ content-servers (e.g., YouTube, Akamai, Apple, Microsoft)
§ search engines, data mining (e.g., Google)
v challenges:
§ multiple applications, each
serving massive numbers of
clients
§ managing/balancing load,
avoiding processing,
networking, data bottlenecks
Inside a 40-ft Microsoft container,
Chicago data center

---

## Page 85

Link Layer 5-85
Server racks
TOR switches
Tier-1 switches
Tier-2 switches
Load
balancer
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
Border router
Access router
Internet
Data center networks
load balancer: application-layer routing
§ receives external client requests
§ directs workload within data center
§ returns results to external client (hiding data
center internals from client)

---

## Page 86

Server racks
TOR switches
Tier-1 switches
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
§ increased throughput between racks (multiple routing
paths possible)
§ increased reliability via redundancy

---

## Page 87

Link Layer 5-87
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

## Page 88

Link Layer 5-88
Synthesis: a day in the life of a web request
v journey down protocol stack complete!
§ application, transport, network, link
v putting-it-all-together: synthesis!
§ goal: identify, review, understand protocols (at all
layers) involved in seemingly simple scenario:
requesting www page
§ scenario: student attaches laptop to campus network,
requests/receives <www.google.com>

---

## Page 89

Link Layer 5-89
A day in the life: scenario
Comcast network
68.80.0.0/13
Googles network
64.233.160.0/19
64.233.169.105
web server
DNS server
school network
68.80.2.0/24
web page
browser

---

## Page 90

router
(runs DHCP)
Link Layer 5-90
A day in the life… connecting to the Internet
v connecting laptop needs to
get its own IP address, addr
of first-hop router, addr of
DNS server: use DHCP
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
v DHCP request encapsulated
in UDP, encapsulated in IP,
encapsulated in 802.3
Ethernet
v Ethernet frame broadcast
(dest: FFFFFFFFFFFF) on LAN,
received at router running
DHCP server
v Ethernet demuxed to IP
demuxed, UDP demuxed to
DHCP

---

## Page 91

router
(runs DHCP)
Link Layer 5-91
v DHCP server formulates
DHCP ACK containing
clients IP address, IP
address of first-hop router
for client, name & IP
address of DNS server
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
UDP
IP
Eth
Phy
DHCP
DHCP
DHCP
DHCP
DHCP
v encapsulation at DHCP
server, frame forwarded
(switch learning) through
LAN, demultiplexing at
client
Client now has IP address, knows name & addr of DNS
server, IP address of its first-hop router
v DHCP client receives
DHCP ACK reply
A day in the life… connecting to the Internet

---

## Page 92

router
(runs DHCP)
Link Layer 5-92
A day in the life… ARP (before DNS, before HTTP)
v before sending HTTP request, need
IP address of <www.google.com>:
DNS
DNS
UDP
IP
Eth
Phy
DNS
DNS
DNS
v DNS query created, encapsulated in
UDP, encapsulated in IP,
encapsulated in Eth.  To send frame
to router, need MAC address of
router interface: ARP
v ARP query broadcast, received by
router, which replies with ARP
reply giving MAC address of
router interface
v client now knows MAC address
of first hop router, so can now
send frame containing DNS
query
ARP query
Eth
Phy
ARP
ARP
ARP reply

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
v IP datagram containing DNS
query forwarded via LAN
switch from client to 1st hop
router
v IP datagram forwarded from
campus network into comcast
network, routed (tables created
by RIP, OSPF, IS-IS and/or BGP
routing protocols) to DNS server
v demuxed to DNS server
v DNS server replies to client
with IP address of
<www.google.com>
Comcast network
68.80.0.0/13
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
A day in the life…TCP connection carrying HTTP
HTTP
TCP
IP
Eth
Phy
HTTP
v to send HTTP request,
client first opens TCP socket
to web server
v TCP SYN segment (step 1 in 3-
way handshake) inter-domain
routed to web server
v TCP connection established!
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
v web server responds with TCP
SYNACK (step 2 in 3-way
handshake)

---

## Page 95

router
(runs DHCP)
Link Layer 5-95
A day in the life… HTTP request/reply
HTTP
TCP
IP
Eth
Phy
HTTP
v HTTP request sent into TCP
socket
v IP datagram containing HTTP
request routed to
<www.google.com>
v IP datagram containing HTTP
reply routed back to client
64.233.169.105
web server
HTTP
TCP
IP
Eth
Phy
v web server responds with
HTTP reply (containing web
page)
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
v web page finally (!!!) displayed

---

## Page 96

Link Layer 5-96
Chapter 5: Summary
v principles behind data link layer services:
§ error detection, correction
§ sharing a broadcast channel: multiple access
§ link layer addressing
v instantiation and implementation of various link
layer technologies
§ Ethernet
§ switched LANS, VLANs
§ virtualized networks as a link layer: MPLS
v synthesis: a day in the life of a web request

---

## Page 97

Link Layer 5-97
Chapter 5: lets take a breath
v journey down protocol stack complete (except
PHY)
v solid understanding of networking principles,
practice
v ….. could stop here …. but lots of interesting
topics!
§ wireless
§ multimedia
§ security
§ network management
