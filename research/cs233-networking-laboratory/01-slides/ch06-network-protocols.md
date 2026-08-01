# ch06-network-protocols

---

## Page 1

Wireless &
unications
Ø Motivation
Ø Data transfer
Ø Encapsulation
Ø Security
Ø IPv6
Ø Problems
Ø DHCP
Ø Ad-hoc networks
Ø Routing protocols

---

## Page 2

Winter 2001
ICS 243E - Ch 6 Net. Protocols
2
Why Mobile IP?
Ø What do cellular networks and wireless LANs provide?
q Wireless connectivity
q Mobility at the data link layer
Ø What is Dynamic Host Configuration Protocol (DHCP)?
q It provides local I
e hosts
Ø What t
q Transparent connectivity at the network layer
q Mobility with local access
Ø The difference between mobility and nomadicity!

---

## Page 3

Winter 2001
ICS 243E - Ch 6 Net. Protocols
3
What is Mobile IP?
Ø Mobile IP provides network layer mobility
Ø Provides seamless roaming
Ø ‘‘Extends’’ the home network over the entire Internet

---

## Page 4

Winter 2001
ICS 243E - Ch 6 Net. Protocols
4
IP Overview 1/3
Ø IP Addressing :
q Dotted Decimal Notation: 32 bits (4x8) used to represent IPv4
addresses - 192.19.241.18
q Network Prefix and Host Portions: p - prefix, h - host, p + h =
32. If p = 24 then h = 32 - 24 = 8. Using above address the
network prefix w
st will be 18. For those
255
92.

---

## Page 5

Winter 2001
ICS 243E - Ch 6 Net. Protocols
5
IP Overview 2/3
Ø IP Routing:
q Network prefix is used for routing. Routing tables are used to
look up next hop and the interface on the router that is to be
used.
q In the routing tables we use the following notation:
target/prefix leng
4, or 192.19.241.192/26.
foll
t specific)
and 7.7.7.0/24 (0<p<32 network prefix) and 0.0.0.0/0 (p=0
default) will use entry 2 for an IP packet with destination
7.7.7.1 and entry 3 for destination 192.33.14.12.

---

## Page 6

Winter 2001
ICS 243E - Ch 6 Net. Protocols
6
IP Overview 3/3
Ø Domain Name System (DNS): used to translate a host name
to an IP address. A host sends a query to a server to obtain
the IP address of a destination of which it only has the host
name.
Ø Link Layer Addresses - Address Resolution Protocol (ARP):
q Once a host has
tination it then needs
ho
q A proxy ARP is a response by a node for another node that
cannot respond at the time the request is made (e.g. the node
is a mobiel node and not on its host net at the time, its home
agent will respond in its stead).
q A gratuitous ARP, is a reply to no ARP request, used by a node
that just joins the network and wants to make its address
known. Can be used by a mobile node upon its return to its
home net.

---

## Page 7

Winter 2001
ICS 243E - Ch 6 Net. Protocols
7
Motivation for Mobile IP
Ø IP Routing
q based on IP destination address, network prefix (e.g.
129.13.42) determines physical subnet
q change of physical subnet implies change of IP address to
have a topologically correct address (standard IP) or needs
special entries in
to t
q does not scale with the number of mobile hosts and frequent
changes in the location, security problems
Ø Changing the IP-address?
q adjust the host IP address depending on the current location
q almost impossible to find a mobile system, DNS updates take
long time
q TCP connections break, security problems

---

## Page 8

Winter 2001
ICS 243E - Ch 6 Net. Protocols
8
What Mobile IP does:
Ø Mobile IP solves the following problems:
q if a node moves without changing its IP address it will be unable
to receive its packets,
q if a node changes its IP address it will have to terminate and
restart its ongoing connections  everytime it moves to a new
network area (ne
Ø Mobil
ility in the
Internet.
Ø Mobile IP is not a complete solution to mobility, changes to the
transport protocols need to be made for a better solution (i.e., the
transport layers are unaware of the mobile node’s point of
attachment and it might be useful if, e.g., TCP knew that a
wireless link was being used!).

---

## Page 9

Winter 2001
ICS 243E - Ch 6 Net. Protocols
9
Requirements to Mobile IP (RFC 2002)
Ø Transparency
q mobile end-systems keep their IP address
q continuation of communication after interruption of link
possible
q point of connection to the fixed network can be changed
Ø Compatibility
q mo
tems
Ø Security
q authentication of all registration messages
Ø Efficiency and scalability
q only little additional messages to the mobile system required
(connection typically via a low bandwidth radio link)
q world-wide support of a large number of mobile systems in the
whole Internet

---

## Page 10

Winter 2001
ICS 243E - Ch 6 Net. Protocols
10
Mobile IP Terminology
Ø
Mobile Node (MN)
q system (node) that can change the point of connection
to the network without changing its IP address
Ø
Home Agent (HA)
q system in the home network of the MN, typically a router
q registers the location of the MN, tunnels IP datagrams to the COA
Ø
Foreign Agent (FA)
ro
Ø
Care-of Address (COA)
q address of the current tunnel end-point for the MN (at FA or MN)
q actual location of the MN from an IP point of view
q can be chosen, e.g., via DHCP
Ø
Correspondent Node (CN)
q communication partner

---

## Page 11

Winter 2001
ICS 243E - Ch 6 Net. Protocols
11
Mobile IP Operation: Summary
Ø Consists of 3 steps:
q Agent discovery,
q Registration, and
q Routing/Tunneling

---

## Page 12

Winter 2001
ICS 243E - Ch 6 Net. Protocols
12
Operation Summary 1/3
Ø Agent Advertisement/Discovery: consists of broadcast
messages used by mobiles to detect that they have moved
and are required to register with a new FA.
q FAs send agent advertisements
q MNs can solicit
ve not heard an agent
advertisement i
e other mechanism to
q MN
A.

---

## Page 13

Winter 2001
ICS 243E - Ch 6 Net. Protocols
13
Operation Summary 2/3
Ø Registration: used by a MN to inform the FA that it is
visiting.
q The new care of address of the MN is sent to the HA.
q Registration expires, duration is negotiated during registration
q Mobile must re-r
pas
 to the FA
which then informs the MN that all is in order and registration
is complete.

---

## Page 14

Winter 2001
ICS 243E - Ch 6 Net. Protocols
14
Operation Summary 3/3
Ø Routing/Encapsulation/Tunneling: consists of the delivery
of the packets to the mobile node at its current care of
address.
q Sender does not need to know that the destination is a MN.
q HA intercepts all
d passes them along to
MN using a tunn
q Ref

---

## Page 15

Winter 2001
ICS 243E - Ch 6 Net. Protocols
15
Example network
ystem
router
router
router
end-system
HA
MN
foreign
network
(physical home n
for the MN)
(current physical network
for the MN)
CN

---

## Page 16

Winter 2001
ICS 243E - Ch 6 Net. Protocols
16
Data transfer to the mobile system
sender
HA
MN
foreign
network
1
2

1. Sender sends to the IP address of MN,
    HA intercepts packet (proxy ARP)
2. HA tunnels packet to COA, here FA,
    by encapsulation
3. FA forwards the packet
    to the MN
CN

---

## Page 17

Winter 2001
ICS 243E - Ch 6 Net. Protocols
17
Data transfer from the mobile system
receiver
HA
MN
foreign
network
1

1. Sender sends to the IP address
    of the receiver as usual,
    FA works as default router
CN

---

## Page 18

Winter 2001
ICS 243E - Ch 6 Net. Protocols
18
Overview
CN
router
HA
router
FA
Internet
router
1.
2.
3.
home
network
MN
foreign
network
4.
router
HA
router
FA
Internet
home
network
MN
foreign
network
COA

---

## Page 19

Winter 2001
ICS 243E - Ch 6 Net. Protocols
19
Network integration
Ø Agent Advertisement Discovery
q HA and FA periodically send advertisement messages into their
physical subnets
q MN listens to these messages and detects, if it is in the home or a
foreign network (standard case for home network)
q MN reads a COA
ent messages
o
MN
q these actions have to be secured by authentication
Ø Routing/Encapsulation/Tunneling
q HA advertises the IP address of the MN (as for fixed systems), i.e.
standard routing information
q packets to the MN are sent to the HA,
q independent of changes in COA/FA

---

## Page 20

Winter 2001
ICS 243E - Ch 6 Net. Protocols
20
Agent advertisement
router address 1

## addresses
type
addr. size
lifetime
checksum
COA 1
COA 2
type
sequence number
length
0
7 8
15 16
31
24
23
code
registration lifetime
. . .
R B H F M G V
reserved

---

## Page 21

Winter 2001
ICS 243E - Ch 6 Net. Protocols
21
Registration
MN
HA
registration
request
stration
ly
t
MN
FA
HA
registration
request
registration
request
regi
reply

---

## Page 22

Winter 2001
ICS 243E - Ch 6 Net. Protocols
22
Mobile IP registration request
home agent
home address
type
lifetime
0
7 8
15 16
31
24
23
rsv
S B DMGV

---

## Page 23

Winter 2001
ICS 243E - Ch 6 Net. Protocols
23
Processing Registration Messages 1/3
Ø
A MN, depending on which registration scenario it is in, will figure
what addresses to use in the various fields of the Registration
request message.
q Link layer addresses are tricky:
 A MN may not use ARP if it is using a FA COA. It needs to use the address of the FA
as the destination address.
If it is using a coll
 to locate the default router using its
tion
nd it uses its own
q For network layer addresses (i.e., IP addresses):
It uses the FA address as destination address when using the FA COA and its own
home address as the source address.
If using a collocated COA it uses its COA as source address and the HA address as
destination address. Note that if the ‘R’ bit is set  then is must use the same
addresses as for the FA COA scenario.
For de-registration it uses its own home address as source and the HA address as
destination.

---

## Page 24

Winter 2001
ICS 243E - Ch 6 Net. Protocols
24
Processing Registration Messages 2/3
Ø For the FA:
q A FA may refuse a Registration request for a number of
reasons: lifetime too long, authentication failed, requested
tunneling not supported, cannot handle another MN (current
load too high).
q If an FA does not
lays it to the HA.
q So
orded for
use later on: MN link layer address, MN IP address, UDP
source port, HA IP address, identification number and
requested lifetime.
q Regarding a Registration reply message, the FA can refuse it
and send a decline to the MN is it finds the reply from the HA
to be invalid. Otherwise it updates its list of visiting MNs and
begins acting on behalf of the MN.

---

## Page 25

Winter 2001
ICS 243E - Ch 6 Net. Protocols
25
Processing Registration Messages 3/3
Ø For a HA
q The HA will determine, as the FA did, whether it will accept the
request. If it does not it returns a code in the reply message
indicating the cause of the failed request.
q If the request is accepted, the reply is sent back by reversing
all the IP address
ers.

---

## Page 26

Winter 2001
ICS 243E - Ch 6 Net. Protocols
26
Routing/Tunneling 1/5
Ø Routing a packet to a MN involves the following:
q A router on the home link, possibly the HA, advertises
reachability to the network prefix of the MN’s home address.
q All packets are therefore routed to the MN’s home link.
q A HA intercepts
 and tunnels a copy to
(co
orwards it
to the MN.

---

## Page 27

Winter 2001
ICS 243E - Ch 6 Net. Protocols
27
Routing/Tunneling 2/5
Ø A HA can use one of two methods to intercept a MN’s
packets:
q The HA is a router with multiple network interfaces. In that
case it advertises reachability to the MN’s home network
prefix.
q The HA is not a r
faces. It must use ARP
AR
 the MN’s
IP packets. This is to update any ARP caches that hosts and
other devices might have.

---

## Page 28

Winter 2001
ICS 243E - Ch 6 Net. Protocols
28
Routing/Tunneling 3/5
Ø How to ‘fool’ the routing table into handling tunneled packets
at the HA?
q A virtual interface is used to do the encapsulation.
q A packet destined for the MN is handled by the routing routine
as all received IP
t

tha
ulation.
q Once encapsulation has been performed the packet is sent to
be processed by the routing routine again. This time the
destination address is the COA and it is routed normally.

---

## Page 29

Winter 2001
ICS 243E - Ch 6 Net. Protocols
29
Routing/Tunneling 4/5
Ø How to ‘fool’ the routing table into handling tunneled packets
at the FA?
q The same procedure is used as above.
q A packet coming in with a COA that is one of the FA addresses’ is
handled by the r
le
a
virt
q The virtual interface consists of a process that decapsulates the
packet and re-routes it to the routing routine.
q The routing routine routes the packet normally based upon  a
host specific entry that is the MN’s home address (for which it
has the link layer address!).

---

## Page 30

Winter 2001
ICS 243E - Ch 6 Net. Protocols
30
Routing/Tunneling 5/5
Ø How does a MN route its packets?
q It needs to find a router to send all its packets to.
q It can select a router in one of a number of ways dependent upon
whether it has a FA COA or a collocated COA.
q Having a FA CO
he MN needs to use it as
t
t
q If the MN is using a collocated COA it needs to listen for router
advertisements or is it hears none, use DHCP to find the default
router.
q Determining the link layer address is another issue. Collocated
COA MNs can use ARP. FA COA must note the link layer address
when
they
receive
router
advertisements
or
agent
advertisements.

---

## Page 31

Winter 2001
ICS 243E - Ch 6 Net. Protocols
31
Encapsulation Process
original IP header
original data

---

## Page 32

Winter 2001
ICS 243E - Ch 6 Net. Protocols
32
Types of Encapsulation
Ø Three types of encapsulation protocols are specified for
Mobile IP:
q IP-in-IP encapsulation: required to be supported. Full IP
header added to the original IP packet. The new header
contains HA address as source and Care of Address as
destination.
cha
ddress is
maintained as is.
q Generic Routing Encapsulation (GRE): optional. Allows
packets of a different protocol suite to be encapsulated by
another protocol suite.
Ø Type of tunneling/encapsulation supported is indicated in
registration.

---

## Page 33

Winter 2001
ICS 243E - Ch 6 Net. Protocols
33
IP in IP Encapsulation
Ø IP in IP encapsulation (mandatory in RFC 2003)
q tunnel between HA and COA
Care-of address COA
IP address of HA
IP address of MN
IP address of CN
TTL
IP identification
lay. 4 prot.
IP checksum
flags
fragment offset
length
TOS
ver.
IHL
TCP/UDP/ ... payload

---

## Page 34

Winter 2001
ICS 243E - Ch 6 Net. Protocols
34
Minimum Encapsulation
Ø Minimal encapsulation (optional)
q avoids repetition of identical fields
q e.g. TTL, IHL, version, TOS
q only applicable for unfragmented packets, no space left for
fragment identification
care-of address COA
IP address of HA
IP address of MN
original sender IP address (if S=1)
S
lay. 4 protoc.
IP checksum
TCP/UDP/ ... payload
reserved

---

## Page 35

Winter 2001
ICS 243E - Ch 6 Net. Protocols
35
Generic Routing Encapsulation
original
header
original data
new data
new header
outer header
GRE
header
original data
original
header
Care
len
TOS
ver.
IHL
IP address of MN
IP address of CN
TTL
IP identification
lay. 4 prot.
IP checksum
flags
fragment offset
length
TOS
ver.
IHL
TCP/UDP/ ... payload
routing (optional)
sequence number (optional)
key (optional)
offset (optional)
checksum (optional)
rec.
rsv.
CRK S s

---

## Page 36

Winter 2001
ICS 243E - Ch 6 Net. Protocols
36
Routing techniques
Ø Triangle Routing: tunneling in its simplest form has all
packets go to home network (HA) and then sent to MN via a
tunnel.
q This involves two IP routes that need to be set-up, one original
and the second the tunnel route.
q Causes unnece
ead and adds to the
Ø Route
node to
learn the current location of the MN and tunnel its own
packets directly. Problems arise with
q mobility: correspondent node has to update/maintain its
cache.
q authentication:
HA
has
to
communicate
with
the
correspondent node to do authentication, i.e., security
association is with HA not with MN.

---

## Page 37

Winter 2001
ICS 243E - Ch 6 Net. Protocols
37
Optimization of packet forwarding
Ø Change of FA
q packets on-the-fly during the change can be lost
q new FA informs old FA to avoid packet loss, old FA now
forwards remaining packets to new FA
q this information also enables the old FA to release resources
for the MN

---

## Page 38

Winter 2001
ICS 243E - Ch 6 Net. Protocols
38
Change of foreign agent
CN
HA
FAold
FAnew
MN
t
request
update
ACK
data
data
MN changes
location
data
data
data
warning
update
ACK
data
data

---

## Page 39

Winter 2001
ICS 243E - Ch 6 Net. Protocols
39
Problems with Triangle Routing
Ø Triangle routing has the MN correspond directly with the
CN using its home address as the SA
q Firewalls at the foreign network may not allow that
q Multicasting: if a MN is to participate in a multicast group, it
needs to use a reverse tunnel to maintain its association with
the home networ
mo
 a reverse
tunnel, it only counts as a single hop. A MN does not want to
change the TTL everytime it moves.
Ø Solution: reverse tunneling

---

## Page 40

Winter 2001
ICS 243E - Ch 6 Net. Protocols
40
Reverse tunneling (RFC 2344)
receiver
HA
MN
foreign
network
3
2

1. MN sends to FA
2. FA tunnels packets to HA
    by encapsulation
3. HA forwards the packet to the
    receiver (standard case)
CN

---

## Page 41

Winter 2001
ICS 243E - Ch 6 Net. Protocols
41
Mobile IP with reverse tunneling
Ø Routers accept often only “topologically correct“
addresses (firewall!)
q a packet from the MN encapsulated by the FA is now
topologically correct
Ø Multicast and TTL problems solved
Ø Reverse tunneling
q opt
ded
through the tunnel via the HA to a sender (longer routes)
Ø The new standard is backwards compatible
q the extensions can be implemented easily

---

## Page 42

Winter 2001
ICS 243E - Ch 6 Net. Protocols
42
Mobile IP and IPv6
Ø Mobile IP was developed for IPv4, but IPv6 simplifies the
protocols
q security is integrated and not an add-on, authentication of
registration is included
q COA can be assigned via auto-configuration (DHCPv6 is one
candidate), every
oconfiguration
q no need for a se
rform router
q MN
 HA not
needed in this case (automatic path optimization)
q „soft“ hand-over, i.e. without packet loss, between two
subnets is supported
MN sends the new COA to its old router
the old router encapsulates all incoming packets for the MN and
forwards them to the new COA
authentication is always granted

---

## Page 43

Winter 2001
ICS 243E - Ch 6 Net. Protocols
43
Problems with Mobile IP
Ø Security
q authentication with FA problematic, for the FA typically
belongs to another organization
q no protocol for key management and key distribution has been
standardized in the Internet
q patent and expor
q
spe
g)
Ø QoS
q many new reservations in case of RSVP
q tunneling makes it hard to give a flow of packets a special
treatment needed for the QoS
Ø Security, firewalls, QoS etc. are topics of current research
and discussions!

---

## Page 44

Winter 2001
ICS 243E - Ch 6 Net. Protocols
44
Security in Mobile IP
Ø Security requirements (Security Architecture for the
Internet Protocol, RFC 1825)
q Integrity
any changes to data between sender and receiver can be
detected by the receiver
q Authentication
q Co
only sender and receiver can read the data
q Non-Repudiation
sender cannot deny sending of data
q Traffic Analysis
creation of traffic and user profiles should not be possible
q Replay Protection
receivers can detect replay of messages

---

## Page 45

Winter 2001
ICS 243E - Ch 6 Net. Protocols
45
not encrypted
encrypted
IP security architecture 1/2
Ø Two or more partners have to negotiate security
mechanisms to setup a security association
q typically, all partners choose the same parameters and
mechanisms
Ø Two headers have been defined for securing IP packets:
q Authentication-H
q Encapsulation Security Payload
protects confidentiality between communication partners
Authentification-Header
IP-Header
UDP/TCP-Paket
authentication header
IP header
UDP/TCP data
ESP header
IP header
encrypted data

---

## Page 46

Winter 2001
ICS 243E - Ch 6 Net. Protocols
46
Ø Mobile Security Association for registrations
q parameters for the mobile host (MH), home agent (HA), and
foreign agent (FA)
Ø Extensions of the IP security architecture
q extended authentication of registration
q prevention of replays of registrations
time stamps: 32 bit time stamps + 32 bit random number
responses: 32 bit random number (MH) + 32 bit random number (HA)
registration reply
IP security architecture 2/2
MH
FA
HA
registration reply

---

## Page 47

Winter 2001
ICS 243E - Ch 6 Net. Protocols
47
Key distribution
Ø Home agent distributes session keys
Ø foreign agent has a security association with the home
agent
Ø mobile host registers a new binding at the home agent
Ø home agent answers with a new session key for foreign
agent and mobile node
FA
MH
HA
HA-MH

---

## Page 48

Winter 2001
ICS 243E - Ch 6 Net. Protocols
48
DHCP: Dynamic Host Configuration Protocol
Ø Application
q simplification of installation and maintenance of networked
computers
q supplies systems with all necessary information, such as IP
address, DNS server address, domain name, subnet mask,
default router etc
Ø Client/
q the client sends via a MAC broadcast a request to the DHCP
server (might be via a DHCP relay)
client
relay
client
server
DHCPDISCOVER
DHCPDISCOVER

---

## Page 49

Winter 2001
ICS 243E - Ch 6 Net. Protocols
49
DHCP - protocol mechanisms
e
server
(not selected)
client
server
(selected)
initialization
initialization completed
release
tion of
configuration
delete context
determine the
configuration
DHCPDISCOVER
DHCPOFFER
(reject)
DHCPACK
DHCPRELEASE
DHCPDISCOVER
DHCPOFFER
(options)
determine the
configuration

---

## Page 50

Winter 2001
ICS 243E - Ch 6 Net. Protocols
50
DHCP characteristics
Ø Server
q several servers can be configured for DHCP, coordination not
yet standardized (i.e., manual configuration)
Ø Renewal of configurations
q IP addresses have to be requested periodically, simplified
protocol
q ava
e
pro
directory,
DNS (domain name system)
Ø Big security problems!
q no authentication of DHCP information specified

---

## Page 51

Winter 2001
ICS 243E - Ch 6 Net. Protocols
51
Ad hoc networks
Ø Standard Mobile IP needs an infrastructure
q Home Agent/Foreign Agent in the fixed network
q DNS, routing etc. are not designed for mobility
Ø Sometimes there is no infrastructure!
q remote areas, ad
r areas
q no
q every node should be able to forward
A
B
C

---

## Page 52

Winter 2001
ICS 243E - Ch 6 Net. Protocols
52
Routing examples for an ad-hoc network
N1
N4
N2
5
N1
N
5
N3
good link
weak link
time = t1
time = t2

---

## Page 53

Winter 2001
ICS 243E - Ch 6 Net. Protocols
53
Traditional routing algorithms
Ø Distance Vector
q periodic exchange of messages with all physical neighbors
that contain information about who can be reached at what
distance
q selection of the shortest path if several paths available
Ø Link State
q rou
Ø Example
q ARPA packet radio network (1973), DV-Routing
every 7.5s exchange of routing tables including link quality
updating of tables also by reception of packets
routing problems solved with limited flooding

---

## Page 54

Winter 2001
ICS 243E - Ch 6 Net. Protocols
54
Problems of traditional routing algorithms
Ø Dynamics of the topology
q frequent changes of connections, connection quality,
participants
Ø Limited performance of mobile systems
q periodic updates
 energy without
q limi
e due to
the
q links can be asymmetric, i.e., they can have a direction
dependent transmission quality
Ø Problem
q protocols have been designed for fixed networks with
infrequent changes and typically assume symmetric links

---

## Page 55

Winter 2001
ICS 243E - Ch 6 Net. Protocols
55
DSDV (Destination Sequenced Distance Vector)
Ø Expansion of distance vector routing
Ø Sequence numbers for all routing updates
q assures in-order execution of all updates
q avoids loops and inconsistencies
Ø Decrease of updat
tim

---

## Page 56

Winter 2001
ICS 243E - Ch 6 Net. Protocols
56
Dynamic source routing I
Ø Split routing into discovering a path and maintainig a path
Ø Discover a path
q only if a path for sending packets to a certain destination is
needed and no path is currently available
Ø Maintaining a path
Ø No periodic updates needed!

---

## Page 57

Winter 2001
ICS 243E - Ch 6 Net. Protocols
57
Dynamic source routing II
Ø Path discovery
q broadcast a packet with destination address and unique ID
q if a station receives a broadcast packet
if the station is the receiver (i.e., has the correct destination address)
then return the packet to the sender (path was collected in the packet)
if the packet ha
lier (identified via ID) then
q sen
s list)
Ø Optimizations
q limit broadcasting if maximum diameter of the network is
known
q caching of address lists (i.e. paths) with help of passing
packets
stations can use the cached information for path discovery (own paths
or paths for other hosts)

---

## Page 58

Winter 2001
ICS 243E - Ch 6 Net. Protocols
58
Dynamic Source Routing III
Ø Maintaining paths
q after sending a packet
wait for a layer 2 acknowledgement (if applicable)
listen into the medium to detect if other stations forward the packet (if
possible)
request an expli

---

## Page 59

Winter 2001
ICS 243E - Ch 6 Net. Protocols
59
Clustering of ad-hoc networks
Internet
super cluster
cluster

---

## Page 60

Winter 2001
ICS 243E - Ch 6 Net. Protocols
60
Interference-based routing
Ø Routing based on assumptions about interference between
signals
N5
N1
N2
R1
R2
N6
N8
S2
N9
N7
neighbors
(i.e. within radio range)

---

## Page 61

Winter 2001
ICS 243E - Ch 6 Net. Protocols
61
Examples for interference based routing
Ø Least Interference Routing (LIR)
q calculate the cost of a path based on the number of stations
that can receive a transmission
Ø Max-Min Residual Capacity Routing (MMRCR)
q calculate the cost of a path based on a probability function of
successful trans
nce
q cal
ming
an
Ø LIR is very simple to implement, only information from
direct neighbors is necessary
