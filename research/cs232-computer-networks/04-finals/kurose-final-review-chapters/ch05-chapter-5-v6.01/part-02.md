# ch05-chapter-5-v6.01 - Part 02 (Pages 34-66)

---

## Page 34

Link Layer 5-34
CSMA/CD efficiency
v Tprop = max prop delay between 2 nodes in LAN
v ttrans = time to transmit max-size frame
v efficiency goes to 1
§ as tprop goes to 0
§ as ttrans goes to infinity
v better performance than ALOHA: and simple, cheap,
decentralized!
trans
prop/t
t
efficiency
5
1
1
+
=

---

## Page 35

Link Layer 5-35
Taking turns MAC protocols
channel partitioning MAC protocols:
§ share channel efficiently and fairly at high load
§ inefficient at low load: delay in channel access, 1/N
bandwidth allocated even if only 1 active node!
random access MAC protocols
§ efficient at low load: single node can fully utilize
channel
§ high load: collision overhead
taking turns protocols
look for best of both worlds!

---

## Page 36

Link Layer 5-36
polling:
v master node invites
slave nodes to transmit
in turn
v typically used with
dumb slave devices
v concerns:
§ polling overhead
§ latency
§ single point of
failure (master)
master
slaves
poll
data
data
Taking turns MAC protocols

---

## Page 37

Link Layer 5-37
token passing:
v control token passed
from one node to next
sequentially.
v token message
v concerns:
§ token overhead
§ latency
§ single point of failure
(token)
T
data
(nothing
to send)
T
Taking turns MAC protocols

---

## Page 38

cable headend
CMTS
ISP
cable modem
termination system
v multiple 40Mbps downstream (broadcast) channels
§ single CMTS transmits into channels
v multiple 30 Mbps upstream channels
§ multiple access: all users contend for certain upstream
channel time slots (others assigned)
Cable access network
cable
modem
splitter
…
…
Internet frames,TV channels, control  transmitted
downstream at different frequencies
upstream Internet frames, TV control,  transmitted
upstream at different frequencies in time slots

---

## Page 39

Link Layer 5-39
DOCSIS: data over cable service interface spec
v FDM over upstream, downstream frequency channels
v TDM upstream: some slots assigned, some have contention
§ downstream MAP frame: assigns upstream slots
§ request for upstream slots (and data) transmitted
random access (binary backoff) in selected slots
MAP frame for
Interval [t1, t2]
Residences with cable modems
Downstream channel i
Upstream channel j
t1
t2
Assigned minislots containing cable modem
upstream data frames
Minislots containing
minislots request frames
cable headend
CMTS
Cable access network

---

## Page 40

Link Layer 5-40
Summary of MAC protocols
v channel partitioning, by time, frequency or code
§ Time Division, Frequency Division
v random access (dynamic),
§ ALOHA, S-ALOHA, CSMA, CSMA/CD
§ carrier sensing: easy in some technologies (wire), hard
in others (wireless)
§ CSMA/CD used in Ethernet
§ CSMA/CA used in 802.11
v taking turns
§ polling from central site, token passing
§ bluetooth, FDDI, token ring

---

## Page 41

Link Layer 5-41
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

## Page 42

Link Layer 5-42
MAC addresses and ARP
v 32-bit IP address:
§ network-layer address for interface
§ used for layer 3 (network layer) forwarding
v MAC (or LAN or physical or Ethernet) address:
§ function: used ‘locally” to get frame from one interface to
another physically-connected interface (same network, in IP-
addressing sense)
§ 48 bit MAC address (for most LANs) burned in NIC
ROM, also sometimes software settable
§ e.g.: 1A-2F-BB-76-09-AD
hexadecimal (base 16) notation
(each number represents 4 bits)

---

## Page 43

Link Layer 5-43
LAN addresses and ARP
each adapter on LAN has unique LAN address
adapter
1A-2F-BB-76-09-AD
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
v MAC address allocation administered by IEEE
v manufacturer buys portion of MAC address space
(to assure uniqueness)
v analogy:
§ MAC address: like Social Security Number
§ IP address: like postal address
v MAC flat address   portability
§ can move LAN card from one LAN to another
v IP hierarchical address not portable
§ address depends on IP subnet to which node is
attached

---

## Page 45

Link Layer 5-45
ARP: address resolution protocol
ARP table: each IP node (host,
router) on LAN has table
§ IP/MAC address
mappings for some LAN
nodes:
< IP address; MAC address; TTL>
§ TTL (Time To Live):
time after which address
mapping will be
forgotten (typically 20
min)
Question: how to determine
interface’s MAC address,
knowing its IP address?
1A-2F-BB-76-09-AD
58-23-D7-FA-20-B0
0C-C4-11-6F-E3-98
71-65-F7-2B-08-53
LAN
137.196.7.23
137.196.7.78
137.196.7.14
137.196.7.88

---

## Page 46

Link Layer 5-46
ARP protocol: same LAN
v A wants to send datagram
to B
§ Bs MAC address not in
As ARP table.
v A broadcasts ARP query
packet, containing B's IP
address
§ dest MAC address = FF-FF-
FF-FF-FF-FF
§ all nodes on LAN receive
ARP query
v B receives ARP packet,
replies to A with its (B's)
MAC address
§ frame sent to As MAC
address (unicast)
v A caches (saves) IP-to-
MAC address pair in its
ARP table until
information becomes old
(times out)
§ soft state: information that
times out (goes away)
unless refreshed
v ARP is plug-and-play:
§ nodes create their ARP
tables without intervention
from net administrator

---

## Page 47

Link Layer 5-47
walkthrough: send datagram from A to B via R
§ focus on addressing – at IP (datagram) and MAC layer (frame)
§ assume A knows Bs IP address
§ assume A knows IP address of first hop router, R (how?)
§ assume A knows Rs MAC address (how?)
Addressing: routing to another LAN
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
Addressing: routing to another LAN
IP
Eth
Phy
IP src: 111.111.111.111
IP dest: 222.222.222.222
v A creates IP datagram with IP source A, destination B
v A creates link-layer frame with R's MAC address as dest, frame
contains A-to-B IP datagram
MAC src: 74-29-9C-E8-FF-55
MAC dest: E6-E9-00-17-BB-4B

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
Addressing: routing to another LAN
IP
Eth
Phy
v frame sent from A to R
IP
Eth
Phy
v frame received at R, datagram removed, passed up to IP
MAC src: 74-29-9C-E8-FF-55
MAC dest: E6-E9-00-17-BB-4B
IP src: 111.111.111.111
IP dest: 222.222.222.222
IP src: 111.111.111.111
IP dest: 222.222.222.222

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
Addressing: routing to another LAN
IP src: 111.111.111.111
IP dest: 222.222.222.222
v R forwards datagram with IP source A, destination B
v R creates link-layer frame with B's MAC address as dest, frame
contains A-to-B IP datagram
MAC src: 1A-23-F9-CD-06-9B
MAC dest: 49-BD-D2-C7-56-2A
IP
Eth
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
Addressing: routing to another LAN
v R forwards datagram with IP source A, destination B
v R creates link-layer frame with B's MAC address as dest, frame
contains A-to-B IP datagram
IP src: 111.111.111.111
IP dest: 222.222.222.222
MAC src: 1A-23-F9-CD-06-9B
MAC dest: 49-BD-D2-C7-56-2A
IP
Eth
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
Addressing: routing to another LAN
v R forwards datagram with IP source A, destination B
v R creates link-layer frame with B's MAC address as dest, frame
contains A-to-B IP datagram
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

## Page 54

Link Layer 5-54
Ethernet
dominant wired LAN technology:
v cheap $20 for NIC
v first widely used LAN technology
v simpler, cheaper than token LANs and ATM
v kept up with speed race: 10 Mbps – 10 Gbps
Metcalfes Ethernet sketch

---

## Page 55

Link Layer 5-55
Ethernet: physical topology
v bus: popular through mid 90s
§ all nodes in same collision domain (can collide with each
other)
v star: prevails today
§ active switch in center
§ each spoke runs a (separate) Ethernet protocol (nodes
do not collide with each other)
switch
bus: coaxial cable
star

---

## Page 56

Link Layer 5-56
Ethernet frame structure
sending adapter encapsulates IP datagram (or other
network layer protocol packet) in Ethernet frame
preamble:
v 7 bytes with pattern 10101010 followed by one
byte with pattern 10101011
v used to synchronize receiver, sender clock rates
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

## Page 57

Link Layer 5-57
Ethernet frame structure (more)
v addresses: 6 byte source, destination MAC addresses
§ if adapter receives frame with matching destination
address, or with broadcast address (e.g. ARP packet), it
passes data in frame to network layer protocol
§ otherwise, adapter discards frame
v type: indicates higher layer protocol (mostly IP but
others possible, e.g., Novell IPX, AppleTalk)
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
Ethernet: unreliable, connectionless
v connectionless: no handshaking between sending and
receiving NICs
v unreliable: receiving NIC doesnt send acks or nacks
to sending NIC
§ data in dropped frames recovered only if initial
sender uses higher layer rdt (e.g., TCP), otherwise
dropped data lost
v Ethernets MAC protocol: unslotted CSMA/CD wth
binary backoff

---

## Page 59

Link Layer 5-59
802.3 Ethernet standards: link & physical layers
v many different Ethernet standards
§ common MAC protocol and frame format
§ different speeds: 2 Mbps, 10 Mbps, 100 Mbps, 1Gbps,
10G bps
§ different physical layer media: fiber, cable
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

## Page 61

Link Layer 5-61
Ethernet switch
v link-layer device: takes an active role
§ store, forward Ethernet frames
§ examine incoming frames MAC address,
selectively forward  frame to one-or-more
outgoing links when frame is to be forwarded on
segment, uses CSMA/CD to access segment
v transparent
§ hosts are unaware of presence of switches
v plug-and-play, self-learning
§ switches do not need to be configured

---

## Page 62

Link Layer 5-62
Switch: multiple simultaneous transmissions
v hosts have dedicated, direct
connection to switch
v switches buffer packets
v Ethernet protocol used on each
incoming link, but no collisions;
full duplex
§ each link is its own collision
domain
v switching: A-to-A and B-to-B
can transmit simultaneously,
without collisions
switch with six interfaces
(1,2,3,4,5,6)
A
A
B
B
C
C
1
2
3
4
5
6

---

## Page 63

Link Layer 5-63
Switch forwarding table
Q: how does switch know A
reachable via interface 4, B
reachable via interface 5?
switch with six interfaces
(1,2,3,4,5,6)
A
A
B
B
C
C
1
2
3
4
5
6
v A: each switch has a switch
table, each entry:
§ (MAC address of host, interface to
reach host, time stamp)
§ looks like a routing table!
Q: how are entries created,
maintained in switch table?
§ something like a routing protocol?

---

## Page 64

A
A
B
B
C
C
1
2
3
4
5
6
Link Layer 5-64
Switch: self-learning
v switch learns which hosts
can be reached through
which interfaces
§ when frame received,
switch learns
location of sender:
incoming LAN segment
§ records sender/location
pair in switch table
A A
Source: A
Dest: A
MAC addr   interface    TTL
Switch table
(initially empty)
A
1
60

---

## Page 65

Link Layer 5-65
Switch: frame filtering/forwarding
when  frame received at switch:

1. record incoming link, MAC address of sending host
2. index switch table using MAC destination address
3. if entry found for destination
then {
if destination on segment from which frame arrived
then drop frame
else forward frame on interface indicated by entry
}
else flood  /*forward on all interfaces except arriving
interface*/

---

## Page 66

A
A
B
B
C
C
1
2
3
4
5
6
Link Layer 5-66
Self-learning, forwarding: example
A A
Source: A
Dest: A
MAC addr   interface    TTL
switch table
(initially empty)
A
1
60
A A
A A
A A
A A
A A
v frame destination, A’,
locaton unknown: flood
A A
v destination A location
known:
A
4
60
selectively send
on just one link
