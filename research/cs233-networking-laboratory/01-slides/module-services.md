# module-services

---

## Page 1

Networking Services: NAT,
Magda El Zarki
Prof. of CS
Univ. of CA, Irvine
Email: <elzarki@uci.edu>
http: <www.ics.uci.edu/~magda>

---

## Page 2

Network Address Translation - NAT

---

## Page 3

3
Private Network
 Private IP network is an IP network that is not directly
connected to the Internet
 Not
e
 All appear to have the same IP to the outside world
 Generally, private networks use addresses from the following
experimental address ranges (non-routable addresses):
 10.0.0.0 – 10.255.255.255
 172.16.0.0 – 172.31.255.255
 192.168.0.0 – 192.168.255.255

---

## Page 4

Implication of NATs
 NAT breaks one of the fundamental assumption of Internet: that
all machines are peers and are routable by IP number.
As such:


NAT uses
 The NAT needs to discover or be told that port 80 (web service)
packets need to be routed to a specific machine
 Most home gateways have functionality for this specifically for
running (web, game) servers!
 This is a problem for any peer to peer system. Your likely
experience with it is using Skype (discuss later)

---

## Page 5

5
Private Addresses

---

## Page 6

6
Network Address Translation (NAT)
 NAT is a router function where IP addresses (and
possibly port numbers) of IP datagrams are replaced at
the boundary of a
 NAT i
etworks
to communicate with hosts on the Internet
 NAT is run on routers that connect private networks to
the public Internet, to replace the IP address-port pair
of an IP packet with another IP address-port pair.

---

## Page 7

7
Basic operation of NAT
 NAT device has address translation table
 One to one address translation

---

## Page 8

8
Pooling of IP addresses
 Scenario: Corporate network has many hosts but only a
small number of public IP addresses
 NA
rporate
network and the public Internet, manages a pool of public IP
addresses
 When a host from the corporate network sends an IP
datagram to a host in the public Internet, the NAT device
picks a public IP address from the address pool, and binds
this address to the private address of the host

---

## Page 9

7
Pooling of IP addresses

---

## Page 10

10
Supporting migration between network service
providers
 Scenario: In CIDR, the IP addresses in a corporate network are
obtained from the service provider. Changing the service provider
requires changing all
twork.
 NAT
 bind
the private address of a host to the public address.
 Migration to a new network service provider merely requires an
update of the NAT device. The migration is not noticeable to the
hosts on the network.
Note:
 The difference to the use of NAT with IP address pooling is that
the mapping of public and private IP addresses is static.

---

## Page 11

11
Supporting migration between network service
providers

---

## Page 12

12
IP masquerading
 Also called: Network address and port translation
(NAPT), port address translation (PAT).
 NAT solution:
 Assign private addresses to the hosts of the corporate
network
 NAT device modifies the port numbers for outgoing traffic

---

## Page 13

13
IP masquerading

---

## Page 14

14
Load balancing of servers
 Scenario: Balance the load on a set of identical servers,
which are accessible from a single IP address
 Her
 NAT device acts as a proxy for requests to the server from
the public network
 The NAT device changes the destination IP address of
arriving packets to one of the private addresses for a server
 A sensible strategy for balancing the load of the servers is to
assign the addresses of the servers in a round-robin fashion.

---

## Page 15

15
Load balancing of servers

---

## Page 16

16
Concerns about NAT
 Performance:

Modifying the IP header by changing the IP address requires that NAT
boxes recalculate the IP header checksum

Modifying port num
s that NAT boxes
recalculate TCP and
 header)

NAT
e Internet.

A host in the public Internet often cannot initiate communication to a
host in a private network unless permanently mapped in table.

The problem is worse, when two hosts that are in a private network
need to communicate with each other.  Peer to Peer

Solution to that is using NAT traversal.

Skype uses that but a server is used to relay the messages between
clients.

---

## Page 17

UDP Hole Punching
ClientA
NATA
ClientB
NATB
Name
A
Name
B
PortA
PortB
NameA:NatA,PortA
NameB:NatB,PortB

---

## Page 18

ClientA
NATA
ClientB
NATB
Help Connect
with NameB
NameA:NatA,Port
A
NameB:NatB,Port
B
PortA
PortB
NameB at
NATB, PortB
NameA at
NATA, PortA
UDP Hole Punching

---

## Page 19

UDP Hole Punching
ClientA
NATA
ClientB
NATB
Server
PortA
PortB
Connect to
NATB, PortB
Connect to
NATA, PortA

---

## Page 20

UDP Hole Punching
ClientA
NATA
ClientB
NATB
Server
PortA
PortB
Send to
NATB, PortB
Send to
NATA, PortA

---

## Page 21

21
Concerns about NAT
 IP address in application data:
 Applications that
in the payload of the
application data
rk across a private-
 So
ly used
application layer protocols and, if an IP address is detected
in the application-layer header or the application payload,
translate the address according to the address translation
table.

---

## Page 22

Dynamic Host Control Protocol -
DHCP

---

## Page 23

23
Dynamic Assignment of IP
addresses
 Dynamic assignment of IP addresses is desirable for
several reasons:
 IP addresses are
 Sup

---

## Page 24

27
DHCP Interaction (simplified)

---

## Page 25

28
DHCP Operation – First search for
DHCP servers
 DCHP DISCOVER
•
DCHP OFFER

---

## Page 26

29
Client-Server Interactions
 The client broadcasts a DHCPDISCOVER message on its local
physical subnet.
 The DHCPDISCOV
e some options such
an avai
configuration options.
 The servers record the address as offered to the client to prevent
the same address being offered to other clients in the event of
further DHCPDISCOVER messages being received before the first
client has completed its configuration.

---

## Page 27

30
DHCP Operation - accepts offer
from one server
•
DCHP REQUEST
Accepts one offer
At t
client can start
address
•
Renewing a Lease (sent
when 50% of lease has
expired)
•
If DHCP server sends
DHCPNACK, then address
is released when timer
expires

---

## Page 28

31
Contd.
 If the client receives one or more DHCPOFFER messages from
one or more servers.
 The client choos
onfiguration
IP a

selected offer.
 In the event that no offers are received, if the client has
knowledge of a previous network address, the client may
reuse that address if its lease is still valid, until the lease
expires.

---

## Page 29

32
Contd.
 The servers receive the DHCPREQUEST broadcast from the client.
 Those servers not selected by the DHCPREQUEST message use
the message as notification that the client has declined that
server's offer.

DHCPA
eters for
the requesting client.

---

## Page 30

33
Contd.
 The combination of client hardware and assigned
network address constitute a unique identifier for the
client's lease and
e client and server

contai

---

## Page 31

34
Contd.
 The client receives the DHCPACK message with configuration
parameters.
 The client perfor
e parameters, for
is c
 If the client detects a problem with the parameters in the
DHCPACK message (the address is already in use on the
network, for example), the client sends a DHCPDECLINE
message to the server and restarts the configuration
process.

---

## Page 32

36
DHCP Operation - Release
•
DCHP RELEASE
At t
client has relea
address

---

## Page 33

37
Contd.
 The client may choose to relinquish its lease on a
network address by sending a DHCPRELEASE message
to the server.
includ
ddress.

---

## Page 34

43
DHCP Pros
 It relieves the network administrator of a great deal of manual
configuration work.
 The ability for a devic
ork to network and to
 Becau
ctually
active, it is possible, by the use of reasonably short lease times and
the fact that mobile clients do not need to be allocated more than one
address, to reduce the total number of addresses in use in an
organization.

---

## Page 35

44
DHCP Cons
 Uses UDP, an unreliable and insecure protocol.
 DNS cannot be u
ured hosts.

---

## Page 36

45
Domain Name Service - DNS

---

## Page 37

46
Outline
 What is DNS?
 What services d
 Mess
 Types of messages

---

## Page 38

47
What is DNS?
 DNS is a host name to IP address translation service
 DNS is
 an
nge
between clients and servers

---

## Page 39

48
Why DNS?
 It is easier to remember a host name than it
is to remember an IP address.
 A name has
 a user than a
 Appl
, etc.,
all require the user to input a destination.
 The user generally enters a host name.
 The application takes the host name
supplied by the user and forwards it to DNS
for translation to an IP address.

---

## Page 40

49
How does it work?
 DNS works by exchanging messages between client
and server machines.
 The application then sits and waits for the response
to return.

---

## Page 41

50
Root DNS Servers
com DNS servers
org DNS servers
edu DNS servers
s
y
D
Distributed, Hierarchical Database
Client wants IP for <www.amazon.com>; 1st approx:
 client queries a root server to find “com” DNS server
 client queries “com” DNS server to get “amazon.com”
DNS server
 client queries “amazon.com” DNS server to get  IP
address for “www.amazon.com”
Top Level Domain
Servers
Authorative Domain Servers

---

## Page 44

53
DNS: Root name servers
 contacted by local name server that cannot resolve name
 root name server:
 contacts authoritative name server if name mapping not known
 gets mapping
 returns mapping t
    13 root name
server operators
worldwide
USC-ISI Marina del Rey, CA
ICANN Los Angeles, CA
NASA Mt View, CA
Internet Systems Consortium. Palo Alto, CA
Autonomica, Stockholm
RIPE London
WIDE Tokyo
Ve
Co
U Maryland College Par
US DoD Vienna, VA
ARL Aberdeen, MD
Verisign

---

## Page 45

54
TLD and Authoritative Servers
 Top-level domain (TLD) servers:
 responsible for com, org, net, edu, etc, and all
top-level coun
r, ca, jp.
 Educause for edu TLD
 Authoritative DNS servers:
 organization’s DNS servers, providing
authoritative hostname to IP mappings for
organization’s servers (e.g., Web, mail).
 can be maintained by organization or service
provider

---

## Page 46

55
Local Name Server
 does not strictly belong to hierarchy
 each ISP (reside
 university) has
 when host makes DNS query, query is sent to its
local DNS server
 acts as proxy, forwards query into hierarchy

---

## Page 47

56
DNS Queries
 Recursive:
 The client machine sends a request to the local name
server, which, i
 address in its
or
 name
server can contain some hostname to IP address
mappings. The intermediate or Top Level name server
always knows who the authoritative name server is.

---

## Page 48

local DNS
server
dns.poly.edu
requesting host
cis.poly.edu
authoritative DNS server
dns.cs.umass.edu
57
destination host
gaia.cs.umass.edu
root DNS
server
1
2
5
6
7
8
TLD DNS
server
3
•
Host at cis.poly.edu
wants IP address
for:
gaia.cs.umass.edu
recursive qu
r puts burden of
name resolution on
contacted root
name server
r heavy load
DNS name resolution example

---

## Page 49

58
DNS Queries (cont’d)
 Iterative:
 The local server queries the root server. If address not
in its database,
address of an
dir
aut
e
overloading of the root servers that handle millions of
requests.

---

## Page 50

requesting host
cis.poly.edu
S
s.umass.edu
59
destination
gaia.cs.umass.edu
root DNS
server
local DNS server
1
2
3
4
5
6
7
8
TLD DNS server
DNS name resolution example
 Host at cis.poly.edu
wants IP address for
gaia.cs.umass.edu
r contact
replies with name of
server to contact
->“I don’t know this
name, but ask this
server”

---

## Page 51

60
DNS: caching and updating
records
 once (any) name server learns a mapping, it
caches mapping
 cache entries time
me time

---

## Page 52

61
Operation of DNS
 The DNS data is stored in the database in the form
of resource records (RR). The RRs are directly
inserted in the

---

## Page 53

62
RRs
 TTL: time to live, used to indicate when an RR can
be removed from the DNS cache.
 Type =
addre
 CNAME - then NAME is an alias for a host and Value is the
canonical name for the host
 MX - then NAME is an alias for an email host and Value is
the canonical name for the email server

---

## Page 54

63
DNS records
DNS: distributed db storing resource records (RR)
o Type=NS
o name is domain (eg.,
foo.com)
o value is hostname of
authoritative name
server for this domain
RR format: (name, value, type, ttl)
o
Type=A
o
Type=CNAME
 is alias name for
really
servereast.backup2.ibm.com
o
value is canonical name
o
Type=MX
o value is canonical
name of mailserver
associated with name

---

## Page 55

64
Summary
 DNS provides a mechanism for maintaining the user
friendliness of the Internet by hiding some of the
operational deta
to ex
.

---

## Page 56

65
IP Multicasting

---

## Page 57

66
Multicasting
 Multicast communications refers to one-to-many or many-to-many
communications.
IP Multicasting refers to the implementation of multicast communication in the Internet
Unicast
B
Multicast

---

## Page 58

67
Multicasting over a Packet
Network
•
Without support for multicast at the network layer:
Multiple copies
of the same
message is
transmitted on
the same link

---

## Page 59

68
Multicasting over a Packet
Network
•
With support for multicast at the network layer:
Requires a set of mechanisms:
•
Packet forwarding can send multiple copies of
same packet
•
Multicast routing algorithm which builds  a
spanning tree (dynamically)

---

## Page 60

69
Semantics of IP Multicast
IP multicast works as follows:
 Multicast groups are identified by IP addresses in the range
224.0.0.0 - 239.
D address)
 Every IP datagram sent to a multicast group is transmitted to
all members of the group
 The IP Multicast service is unreliable

---

## Page 61

70
Network Interface
IP
IP Multicast
UDP
TCP
The IP Protocol Stack
 IP Multicasting only supports UDP as higher layer
 There is no multicast TCP !
Application Layer

---

## Page 62

71
Multicast Addressing
• All multicast addresses start with (old class D addresses):
• Multicast addresses are dynamically assigned.
• An IP datagram sent to a multicast address is forwarded to everyone
who has joined  the multicast group
• If an application is terminated, the multicast address is (implicitly)
released.

---

## Page 63

72
Types of Multicast addresses
 The range of addresses between 224.0.0.0 and 224.0.0.255,
inclusive, is reserved for the use of routing protocols and other
low-level topology discovery or maintenance protocols
 M
th
d
 Examples

---

## Page 64

73
Multicast Address Translation
 In Ethernet MAC addresses, a multicast address is identified by
setting the lowest bit of the “most left byte”
Not all Ethernet cards can filter multicast addresses in hardware
Then:  Filtering is done in software by device driver.
Ethernet uses multicasting for various protocols such as spanning
tree protocol or VLAN set up. IP Multicast is distinguished a special
code in the 3rd octet.

---

## Page 65

74
IP Multicast Address Mapping

---

## Page 66

75
IGMP
 The Internet Group Management Protocol (IGMP) is a
simple management protocol for the support of IP
multicast.
 IGMP
f
membership in a multicast group.
 Support for:
 Joining a multicast group
 Query membership
 Send membership reports

---

## Page 67

Network Time Protocol - NTP

---

## Page 68

To Synchronize or not to synchronize
 Criticality of the situation – how does timing affect the
outcome of an action or sequence of actions
 The ordering of events is done using a common clock
 Network Time Protocol allows for timing exchange to
synchronize clocks.

---

## Page 69

NTP
 NTP is a protocol
 NTP is a set of ti
(strat
 Stratum “0” being the top and they are atomic clocks
 Stratum “1” are time servers connected to stratum “0”
 And Stratum “2” are connected to stratum “1” etc.
 Clients get information from their local time server at
stratum “N”

---

## Page 70

NTP Daemon - ntpd
 On most systems, there is an ntdp daemon that
synchronizes the local clock to a time server in the
area. Often a per
time server they
 NTP operates by getting the time from the local time
server and estimating a clock offset to adjust its own
clock.

---

## Page 71

NTP calculation
 Client A sends a packet to time server at time t0.
 Client A receives
e server at time t3
 Serve
 Network latency estimate = ((t3 – t0)  - (t2 – t1))/2
 Clock offset estimate = (t1 – t0) – Network latency estimate
 Packet from Server to Client contains t0, t1, t2

---

## Page 72

NTP Packet Exchange
 UDP port 123
 Packets sent:
 Client request wi
 R
 Time of response to client – t2
 Client can have several servers
 Client chooses one to sync with
 Uses feedback loop to keep running estimate of RTT and
offset.
