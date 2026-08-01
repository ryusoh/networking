# cs132-midterm-study-guide

---

## Page 1

Internet Architecture
5 Layers
Application (HTTP, DNS, FTP, SMTP):
network applications and their protocols
defines the way a client interacts with a given protocol
data in this layer is a message
Transport (TCP, UDP):
transports data from source application layer to the dest application layer
handles sending/receiving of raw data
data in this layer is a segment
Network (IP):
delivers sent transport-layer data to the receiving transport layer
defines sockets & the means to transport the data from transport layer
data in this layer is a datagram
Link (DSL, ethernet, â€¦)
moves datagrams from one node (host or router) to the next node
handles establishment of connections & reliable transfer between nodes
data in this layer is a frame
Physical (copper wire, fiber optics, â€¦):
moves the individual bits from node to the next
IP Stack?
application - transport - network - link - physical
ISO/OSI model?
application - presentation - session - transport - network - link - physical
Application Layer
HTTP- Hypertext Transport Protocol
Foundation of data communication for the internet
Protocol for webpages
•
◦
▪
▪
▪
◦
▪
▪
▪
◦
▪
▪
▪
◦
▪
▪
▪
◦
▪
•
◦
•
◦
•
◦
◦

---

## Page 2

Request/response protocol
Uses TCP for communication
1 port: 80
Maintains no info about past clients
Non-persistent HTTP connection
TCP connection is closed after object is sent back
Bad because the RTT overhead increases
Persistent HTTP
Stays open for a certain amount of time while client is requesting data
Steps:
client initiates TCP connection to server on port 80
HTTP request message is sent to server via socket
HTTP server receives request,retrieves it, and sends back a response
client gets response and closes TCP connection
Pull protocol- pulls (requests) data from a server.
FTP- File Transfer Protocol
Used to transfer computer files from one host to another over a TCP-based network
Client/Server architecture
Separate control/data connections between client/server
2 ports: 20,21
Must maintain states about the user, control connection, and local/remote directory
Port 20
Connection port, a non-persistent connection that handles authentication of
account accessing
used to send files
Port 21
Command port
Used to take the client commands
persistent connection
◦
◦
◦
◦
◦
▪
▪
◦
▪
◦
▪
▪
▪
▪
◦
•
◦
◦
◦
◦
◦
◦
▪
▪
◦
▪
▪
▪

---

## Page 3

keeps track of user command, connection, current directory
When FTP first starts:
client initiates TCP on port 21 and send authorization and commands to server.
persist
Port 20 is the transfer connection. Non-persistent. The data is transferred to
this port
Server sends one file per request, and closes the TCP after the file has been
transferred (opens more as new requests come in)
DNS- Domain Name Service
Hierarchical distributed naming system for computer services or any resource
connected to the internet or a private network
Root domain
Top Level domains
Second level domains
Computer
Translates domain names to IP addresses
Internet's primary directory service
1 port: 53
SMTP- Simple Mail Transfer Protocol
Protocol for email transmission
Sender User Agent (email account) -> Sender SMTP server -> TCP Send SMTP<-
>Receive SMTP -> Receiver SMTP server ->Receiver User agent
▪
◦
▪
▪
▪
•
◦
▪
▪
▪
▪
◦
◦
◦
•
◦
◦

---

## Page 4

Sender -> submission -> transfer -> record -> delivery -> dest
2 ports: 25, 587
Push protocol- pushes(sends) data from servers to other servers or clients
Transport Layer
TCP & UDP: protocols used to send data over the internet/local address to an IP address
TCP- Transfer Control Protocol
Multiplexing/Demultiplexing
does require info about the data file and its contents in order to ensure
connection-based transmission where delivery in order is required Reliable but
slower
Good for web-browsing/sending files
[source IP, source Port, dest IP, dest Port]
Makes sure to receive packets in order
Most commonly used protocol on the WWW
Check-sum length???
Does binary addition and stores it
To check if none of the data is corrupt in between packets
UDP- User Datagram Protocol
No overhead but also not as reliable
Doesnâ€™t check for errors
Good for real-time applications like live-broadcast or video or online video games
Multiplexing/Demultiplexing
does not require info about the size/control of the connection, since its
connectionless [dest IP, dest Port]
Network Layer
Responsible for packet forwarding
Routing through intermediate routers
Link Layer (briefly)
Error-checking
Flow control
◦
◦
◦
•
◦
▪
▪
▪
◦
◦
◦
◦
◦
•
◦
◦
◦
◦
▪
•
•
•
•

---

## Page 5

Access control
Congestion Control
Controls traffic entry into a telecommunications network to avoid congestive collapse
Avoids oversubscription of any of the processing/link capabilities
Different Types of Delays
Processing delay: time it takes router to examine the packet header and determine where
to direct the packet
Queuing Delay: time a packet spends in the output buffer waiting to be transmitted.
based on amount of congestion at the time.
traffic intensity: (L*a)/R
L = # bits
R = rate
a = # of packets
Transmission Delay: time it takes to to push a packetâ€™s bits into the link
L bits / R(rate)
based on the size of the packet
Propogation delay: time it takes for bits to physically travel from point A to B
based on the medium/distance between points
Concepts of Transport Layer (no computations)
1 rigorous computational problem
What are all the different formulas weâ€™ve learned to date?
Propagation time/delay
Distance/ Prop_Rate
Header Transmission Time
Size/Link-Speed
Data Transmission Time
Data-packet-size/Link-Speed
•
•
•
•
•
◦
◦
▪
▪
▪
•
◦
◦
•
◦
•
◦
•
◦
•
◦

---

## Page 6

Transmission Time/Delay
Number of bits/ Rate of transmission
Distribution Times
Client/Server = Max(NF/ Us, F/dmin)
N = # of peers
F = length in bits
Us = Upload speed of server
dmin = lowest download rate of any of the peers
P2P = Max(F/Us, F/dmin, NF/Us + sum(Ui))
sum(Ui) = upload speed for all peers
Bandwidth-delay:max number of bits the link has at any time
R *d_prop
d_prop = round trip propagation delay = distance* prop_rate
Average Throughput: if file has F bits, transfers over T seconds:
AvgThroughput = F/T
End-to-End delay: dE2E = (# routers) *(dprocessing+dtransmission+dpropogation)
Nodal Delay: dnodal = dprocessing+dtransmission+dpropogation
any others???
Conversions:
Bytes -> Bits: (Bytes* 8): 1 byte = 8 bits
Kb = 1,000 bits
Mb = 1,000,000 bits
Gb = 1,000,000,000 bits
Circuit-Switching:
Allocates a set amount of memory per operation.
Phone call would be circuit-switching because we are transmitting and receiving a steady
amount of data.
Itâ€™s not at random, the connection is a full circuit. This is much more expensive but also
very reliable.
•
◦
•
◦
▪
▪
▪
▪
◦
▪
•
◦
◦
•
◦
•
•
•
•
•
•
•
•
•

---

## Page 7

We are moving away from circuiting switching because it is too expensive
Switches are reserved
Packet-Switching
Message gets broken into smaller data packets
Gets sent through the most efficient route as circuits become available
Less reliable than Circuit Switching
Persistent vs Non-persistent
In a persistent connection, the server always keeps its connection open (unless there is a
timeout IE the internet is down)
less reliable
In a non-persistent connection, the client establishes a connection with the server, request
data from a server, the server responds to client, the connection is closed.
less efficient
Winter 2015 Midterm Questions
T/F
In the Internet Protocol (IP) stack, the network layer can guarantee the reliable transmission
from the source to the destination.
False. IP uses UDP to transfer data
Virtual circuits (ie circuit switching) always has longer transmission delays than packet
switching
TCP segment headers are always 20 bytes in length
False. Can be greater than 20 (if â€œoptions* section is used)
In a packet-switched network, all routers must keep information for all end-to-end
connections
False. routers donâ€™t store any client information.
The DNS uses UDP transport to exchange messages
True
SMTP uses UDP transport to exchange messages
False
The Selective Repeat (SR) does not require buffers on both the sender and receiver
TCP congestion control is used to prevent the sender from overflowing the receiver
•
•
•
•
•
•
◦
•
◦
1.
1.
2.
3.
1.
4.
1.
5.
1.
6.
1.
7.
8.

---

## Page 8

FILL IN THE BLANK
Link Layer is responsible for end-to-end flow control
Link layer is responsible for reliable transfer of information
Transport layer is responsible for creating data segments
Network Layer is responsible for routing decisions
Physical Layer is responsible for transmission of raw bit stream
Transport layer is responsible for defining sockets and transport mechanisms: this should
be applicatoin
SHORT ANSWER
Briefly describe the difference between a â€œpushâ€வ and â€œpullâ€வ protocol. Give an
example for each.
Push protocol: instantly streams data to you, like a cell-phone call.
Pull protocol: send/receive. You ask for a webpage, you get one in response.
Briefly define each of the seven layers in the ISO/OSI layering architecture. Describe how
the IP protocol is derived from this.
Define the connections and port numbers that FTP uses. What is the purpose of each of
them? Which connections are persistent and non-persistent?
What information is necessary for UDP mutiplexing/ demultiplexing? What information is
necessary for TCP multiplexing/demultia
Spring Midterm
Choose only one answer.
You will not receive any points if you choose multiple answers.

1. In the OSI networking stack, routing is performed by the
a) Session Layer b) Network Layer c) Transport Layer d) Data-Link Layer e) None of these
choices
2. Four bits are used for sequence numbering in a sliding window protocol used in a computer
network. What is the maximum window size? a) 4 b) 8 c) 15 d) 16 e) None of these choices
3. Which of the following TCP/IP protocols is used for remote terminal connection services?
a) TELNET b) FTP c) RARP d) UDP e) None of these choices
4. Which protocol is used for sending email on the Internet?
a) SMTP b) SMPP c) SNMP d) FTP e) None of these choices
1.
2.
3.
4.
5.
6.
1.
1.
2.
2.
1.
3.
4.

---

## Page 9

5. Which one of the following uses the greatest number of layers in the TCP/IP stack?
a) Switch b) Repeater c) Router d) End Host e) None of these choices
6. What is the default port number for HTTP? a) 21 b) 80 c) 25 d) 8080 e) None of these choices
7. A basic telephone network is an example of a) Packet Switching b) Cell Switching c) Circuit
Switching d) Message Switching e) None of these choices
8. Which one of the following is used to communicate between different networks? a) ADSL b)
HDSL c) Gateway/Router d) Modem e) None of these choices
9. Which of the following OSI layers corresponds to the layer where TCP operates in the TCP/IP
stack? a) Network Layer b) Data-Link Layer c) Session Layer d) Transport Layer e) None of
these Choices
10. TCP uses the following mechanism for increasing the congestion window size (cwnd): a)
additive increase additive decrease b) additive increase multiplicative decrease c)
multiplicative increase additive decrease d) multiplicative increase multiplicative decrease e)
None of these choices
Problem #2: (6 points, 1 point each) Determine whether each of the following statements is True
(T) or False (F). No explanation is necessary; partial credit will not be awarded.
1. All nodes connected to the Internet must implement UDP. ( F )
2. Media access control is a function of the data-link layer. ( T )
3. Forward Error Correction (FEC) can be more efficient than Automatic Repeat Request (ARQ)
in a broadcast environment with many receivers. ( T )
4. End hosts implement transport layer protocols but routers do not. ( T )
5. In a packet switched network, all packets belonging to the same transport layer session must
follow the same route. ( F )
6. Peer-to-Peer (P2P) systems are scalable because available resources increase with a quadratic
factor with each new member that joins the P2P system. ( F )
Problem #3: (6 points) Answer the following questions regarding the Application Layer. (1
points)
1. Briefly describe what HTTP is and sketch its operation using a simple figure (i.e., the typical
messages exchanged during operation of HTTP).
The HyperText Transfer Protocol (HTTP) is a stateless application layer protocol. HTTP is used
to transfer web content between a browser application (client) and an HTTP server. All web
content is identified by a URL. HTTP is a request response protocol that uses TCP for assured
delivery. HTTP uses ASCII encoded headers. The HTTP GET command retrieves HTML files
and other objects. The GET header includes the URL of the object and other optional fields such
as capability, language, and so on. The response includes a response header with a response code
(code 200 is OK and 404 is page not found). Other commands include POST and HEAD. +--------

+ +--------+ | Client |----- Request ------>| Server | | |<---- Response ------| | +--------+ +--------+
(1/2 point)

---

## Page 10

2. We say that FTP has out-of-band control. What do we mean by that? We mean that commands
and data flow across different TCP connections. (1 point)
3. What is the minimum value for the timeout of a reliable transmission protocol? Why is there a
minimum value? One RTT; anything shorter would timeout before the ACK had a chance to
arrive. (1/2 point)
4. What is the difference between congestion control and flow control? Congestion control
prevents overrunning buffers in the network, while flow control prevents overflowing the end
hosts (or receivers). (3 points)
5. Consider 5 users (call them A, B, C, D, and E) that have connections on a single 10 Mb/s link.
Connections last for several minutes or perhaps even hours (i.e., they are bounded in time).
Assume that user A requests 2 Mb/s for its connection, B requests 1 Mb/s, C requests 3 Mb/s, D
requests 4 Mb/s, and E request 10 Mb/s. Note that the total requested bandwidth (20 Mb/s)
exceeds the link bandwidth (10 Mb/s). Describe at least three ways of fairly allocating the 10 Mb/
s to the five users. Carefully discuss/describe what is â€œfairâ€வ. Carefully discuss the tradeoffs
between your different definitions of â€œfairâ€வ. Multiple definitions of fair are possible. One
definition of fair can be to allocate resource proportional to need. So, A gets (2/20)(10) Mb/s =
1.0 Mb/s B gets (1/20)(10) = 0.5 C gets (3/20)(10) = 1.5 D gets (4/20)(10) = 2.0 E get (10/20)(10)
= 5.0 This definition of fairness rewards over-requesting (cheating) to get a larger share against
other users. We note that in this example, no user is 100% happy.
<http://www.ics.uci.edu/~keldefra/teaching/spring2013/uci_cs132/exams/>
cs132_midterm_sol_ked.pdf
CS 132 Outline
Overview
-Ââ€வ Terminology
Network Edge
Internet Service Provider (ISP)
Network Core
-Ââ€வ Latencies / Rates
Transmission Rate
Processing Delay
Queueing Delay
Transmission Delay
Propogation Delay
-Ââ€வ Packet Switching vs Circuit Switching
Time Division Multiplexing
Frequency Division Multiplexing
•
•
•
•
•
•
•
•
•
•

---

## Page 11

Pros / Cons for each
-Ââ€வ OSI 7-Ââ€வlayer stack
-Ââ€வ IP Stack
Application Layer
-Ââ€வ Architectures
Client-Ââ€வserver
Peer-Ââ€வto-Ââ€வpeer (P2P)
-Ââ€வ Ports
-Ââ€வ Processes
-Ââ€வ Sockets
-Ââ€வ Common transport services applications can use
TCP / UDP
-Ââ€வ Applications
HTTP
â–ªâ–ª Cookies
â–ªâ–ª Web Caching (Proxy Server)
FTP
â–ªâ–ªControl Connection
â–ªâ–ª Data Connection
SMTP
â–ªâ–ª Push vs pull protocol
DNS
â–ªâ–ª Hierarchy
Root DNS
Top-Ââ€வlevel Domain (TLD)
Autoritative
Local DNS
•
•
•
•
•
•
•
•
•
•
•
•

---

## Page 12

â–ªâ–ª Recursive vs Iterative Queries
P2P applications
â–ªâ–ª Distributed Hash Tables
â–ªâ–ª P2P vs. Client / Server Distribution Time
Overlay Networks
Transport Layer
-Ââ€வ Multiplexing / Demultiplexing
TCP vs UDP
-Ââ€வ UDP
Characteristics
â–ªâ–ª Memory required
â–ªâ–ª Lack of congestion control
Segment Structure
â–ªâ–ª Source / Destination Port
â–ªâ–ª Length in bytes (size of data + header)
â–ªâ–ª Checksum
-Ââ€வ Reliable Transport
Stop-Ââ€வand-Ââ€வwait protocol
Pipelining
Go-Ââ€வBack-Ââ€வN
Selective Repeat
Piggybacking
Differences between each of these
-Ââ€வ TCP
Characteristics
â–ªâ–ª Memory required
â–ªâ–ª Congestion Control vs Flow Control
Segment Structure
•
•
•
•
•
•
•
•
•
•
•
•
•

---

## Page 13

â–ªâ–ª Source / Destination Port
â–ªâ–ª Checksum
â–ªâ–ª Sequence / ACK number
â–ªâ–ª Receive Window Size
â–ªâ–ª Header length
â–ªâ–ª Options
â–ªâ–ª Flags
ACK, RST, SYN, FIN, PSH, URG
Timeout Estimation
TCP Optimizations
â–ªâ–ª Doubleing Timeout Interval
â–ªâ–ª Fast Retransmit
â–ªâ–ª Flow Control
Receiver Variables
LastByteRead, LastByteRcvd, RcvBuffer, rwnd
rwnd = RcvBuffer â€“ [LastByteRcvd â€“ LastByteRead]
Sender Variables
LastByteSent, LastByteAcked
LastByteSent â€“ LastByteAcked <= rwnd
â–ªâ–ª Congestion Control
Congestion Window (cwnd)
Slow Start
Congestion Avoidance
Fast Recovery
TCP Tahoe vs TCP Reno
TCP Connection Management
â–ªâ–ª Three-Ââ€வway handshake
â–ªâ–ª TCP Connection Teardown
•
•
•
•
◦
•
•
◦
◦
•
•
•
•
•
•

---

## Page 14

Network Layer
-Ââ€வ Forwarding vs Routing
Forwarding - single router, moves data from an input, port to an output
Routing - Determines path taken from sender to receiver
-Ââ€வ Packet vs Circuit Switching
Packet/Datagram - Resources are first come, first serve (no state to keep track of)
Circuit Switched/Virtual Circuit - Resources are reserved from source to destination
-Ââ€வ Router
Each router has a forwarding table that maps destination addresses to link interfaces;
when a packet arrives at the router, the router uses the packetâ€™s destination
address to look up the appropriate output link interface in the forwarding table. The
router then intentionally forwards the packet to that output link interface. All
destination address 32 bits
Input ports - Terminate incoming physical link on physical layer. Look up function
with forwarding table. Decides if arrving packet will be forwarded with switching
fabric.
Switching fabric - Connects router input ports to output ports. Encapsulated within
router (network inside network router)
Output ports - Stores packets received from switching fabric and transmit on
outgoing link on physical and link layer.
Routing processor - Executes routing protocols and maintains routing tables with
link state information and computes forwarding table.
Router Forwarding Tables
Packet/Datagram - No connection state information, but maintains forwarding state
information in their forwarding tables. Time depends on routing algorithm to update
table about every 1-5 minutes
Circuit Switched/VC network - a forwarding table in a router is modified whenever a
new connection is set up through the router or whenever an existing connection
through the router is torn down
â–ªâ–ª Longest Prefix Matching
Finds the longest matching entry in the table and forwards the packet to the link
interface associated with the longest prefix match.
Packet Scheduling (Active Queue Management)
Packet loss occurs when queue gets too big and router runs out of memory.
•
•

---

## Page 15

Packet scheduler at the output port must choose one packet among those queued for
transmission. This selection might be done on a simple basis, such as first-come-
first-served (FCFS) scheduling, or a more sophisticated scheduling discipline such as
weighted fair queuing (WFQ), which
â–ªâ–ª Weighted Fair Queueing (WFQ)
Shares the outgoing link fairly among the different end-to-end connections that have
packets queued for transmission.
â–ªâ–ª Drop Tail
Decides to drop arriving packet or remove queued packet for room.
â–ªâ–ª Provides some level of Quality of Service (QoS)
-Ââ€வ Internet Protocol (IP) Datagram Header
20 bytes of header with no options. 40 bytes if carries TCP(nonfragmented)
Version Number - 4 bits, Interprets remainder of datagram by version (ipv4, ipv6)
Header Length- 4 bits determines where data begins, usually 20 byte header
Type of Service (ToS)- Real-time(IP) or non-real time traffic(FTP)
Datagram Length- 16 bits; Total length of IP datagram(header+data) Max 65535 bytes,
usually less than 1500 bytes.
Identifier, Flags, Fragmentation Offset - ipv6 does not allow fragmentation
Time-Ââ€வto-Ââ€வLive (TTL)- Ensure datagrams donâ€™t circulate forever.
Decrements by one each time until 0 and drops datagram.
Protocol - Indicates transport-layer protocol to which datagram should be passed. Used
when IP datagram reaches destination. (ie 6 = TCP, 17 = UDP)
Checksum - Header checksum detects bit errors in received datagram. Computed by 2
bytes in header as a number and summing numbers using 1s complement. Router discards
datagram if does not match.
IP header is checksummed at the IP layer, while the TCP/UDP checksum is
computed over the entire TCP/UDP segment.
TCP/UDP and IP do not necessarily both have to belong to the same protocol stack.
TCP can, in principle, run over a different protocol (for example, ATM) and IP can
carry data that will not be passed to TCP/UDP
Source / Destination IP addresses
Options (variable, rarely used) - Allows IP header to be extended, not in ipv6
Data (payload)- Contains TCP/UDP to be delivered, can carry other data like ICMP
•
•
•
•
•
•
•
•
•
•
•

---

## Page 16

-Ââ€வ IP Data Fragmentation
MTU â€“ largest link-Ââ€வlayer frame that can be sent on the link
Maximum amount of data link-layer frame can carry. Useful when forwarding table determines
outgoing link has MTU smaller than IP datagram length. Fragments datagram into smaller IP
datagrams, encapsulated in separate link-layer frame and send frames over outgoing link. Smaller
datagrams are fragments.
Fragments packets based on the MTU along the path
ipv4 has identification flag and fragmentation offset in IP header.
Identification number increments for each datagram sent. Used to determine if
fragments of same datagram.
Last fragment flag - set to 0, 1 for all other fragments.
Offset field - specifies where fragment fits to check for missing fragments
-Ââ€வ IPv4 Addressing
Host typically has one single link on network to send datagram on IP.
Interface - boundary between host and physical link. (router and link)
Applies to host interfaces
IP requires host and router interface to have own IP address.
IP address associated with interface, not host or router with interface
Network connecting 3 host interfaces and one router forms subnet/network.
Dotted Decimal Notation
32 bits long, 4 bytes. 2^32 possible addresses
Each interface on host and router must have globally unique IP address
determined by subnet it is connected to.
â–ªâ–ª 0.0.0.0 â†’â†’ 255.255.255.255
Classless Interdomain Routing (CIDR)
Generalizes notion of subnet addressing. 32 bit IP address divided into two and again.
a.b.c.d/x; x = prefix (number of bits in first part of address)
â–ªâ–ª Network prefix vs host IP address
when a router outside forwards a datagram to address inside, only the leading x bits
of the address need be considered. Reduces the size of the forwarding table in these
•
•
•
•
•

---

## Page 17

routers, since a single entry of the form a.b.c.d/x will be sufficient to forward packets
to any destination within the organization.
Classfull Addressing
Network portions of an IP address were constrained to be 8, 16, or 24 bits in length, an addressing
scheme known as classful addressing, since subnets with 8-, 16-, and 24-bit subnet addresses
were known as
class A, B, and C networks, respectively.
â–ªâ–ª Class A: /8
â–ªâ–ª Class B: /16
supports up to 65,634 hosts
â–ªâ–ª Class C: /24
Supports up to 28 â€“ 2 = 254 hosts(two of the 28 = 256 addresses are reserved for
special use)â€”too small for many organizations.
Broadcast Address
ICANN allocates IP addresses and manages DNS root servers.
â–ªâ–ª 255.255.255.255
-Ââ€வ Dynamic Host Configuration Protocol (DHCP)
Client-server protocol and plug&play capability. DHCP allows a host to obtain (be allocated) an
IP address automatically instead of assigning individual IP addresses from IP block. DHCP also
allows a host to learn additional information, such as its subnet mask, the address of its first-hop
router (often called the default gateway), and the address of its local DNS server.
4 step process protocol:
DHCP Server Discovery- done using a DHCP discover message, which a client sends
within a UDP packet to port 67. The UDP packet is encapsulated in an IP datagram.
DHCP Server Offer- DHCP offer message that is broadcast to all nodes on the subnet,
again using the IP broadcast address of 255.255.255.255. Each server offer message
contains the transaction ID of the received discover message, the proposed IP address for
the client, the network mask, and an IP address lease timeâ€”the amount of time for which
the IP address will be valid. (ranges from hours or days)
DHCP Request- choose from among one or more server offers and respond to its selected
offer with a DHCP request message, echoing back the configuration parameters.
DHCP ACK-Server responds to the DHCP request message with a DHCP ACK message,
confirming the requested parameters.
Once the client receives the DHCP ACK, the interaction is complete and the
client can use the DHCP-allocated IP address for the lease duration.
•
•
•
•
•
•

---

## Page 18

-Ââ€வ Network Address Translation (NAT)
Mapping of â€œprivateâ€வ IP and port numbers to â€œpublicâ€வ IP and port numbers
-Ââ€வ Internet Control Message Protocol (ICMP)
â€œTypesâ€வ and â€œCodesâ€வ
Common examples
â–ªâ–ª Ping
â–ªâ–ª Traceroute
-Ââ€வ IPv4 vs IPv6
Address space
Constant header length
Removal of Fragmentation
Removal of Checksum
Problems with migrating from IPv4 to IPv6
-Ââ€வ Routing Algorithms
Global Routing Algorithms
â–ªâ–ª Link-Ââ€வstate algorithms
â–ªâ–ª Djikstraâ€™s Link State algorithm
Decentralized Routing Algorithms
â–ªâ–ª Distance-Ââ€வvector algorithm (Bellman-Ââ€வFord Equation)
â–ªâ–ª Count-Ââ€வto-Ââ€வInfinity Problem
Poison Reverse
Hierarchical Routing
â–ªâ–ª Autonomous Systems
â–ªâ–ª Gateway Routers
â–ªâ–ª Hot Potato Routing
â–ªâ–ª Intra-Ââ€வAS Routing
Routing Information Protocol (RIP)
Open Shortest Path First (OSPF)
•
•
•
•
•
•
•
•
•
•
•
•
•
•

---

## Page 19

â–ªâ–ª Inter-Ââ€வAS Routing
Border Gateway Protocol (BGP)
External BGP (eBGP) sessions
Internal BGP (iBGP) sessions
Link Layer
-Ââ€வ Responsible for sending data across individual links
-Ââ€வ Node: Computational device running a link-Ââ€வlayer protocol (hosts,
routers, switches)
-Ââ€வ Link: Communication channels connecting adjacent nodes.
-Ââ€வ Network Adapter / Network Interface Card (NIC)
Where hardware meets software
-Ââ€வ Error Detection and Correction
Parity Bits
â–ªâ–ª Even / Odd Parity
â–ªâ–ª Two-Ââ€வDimensional Parity Checks
Forward Error Correction (FEC)
Checksumming
Cyclic Redundancy Check (CRC)
-Ââ€வ Multiple Access Links and Protocols
Channel Partitioning
â–ªâ–ª Time Division Multiplexing
â–ªâ–ª Frequency Division Multiplexing
-Ââ€வ Random Access Protocols
Slotted ALOHA
ALOHA
-Ââ€வ Carrier Sense Multiple Access / Collision Detection (CSMA / CD)
-Ââ€வ Binary Exponential Backoff
-Ââ€வ Taking-Ââ€வTurns Protocol
Polling Protocol
•
•
•
•
•
•
•
•
•
•
•
•

---

## Page 20

Token Passing
-Ââ€வ Switched Local Area Networks
MAC address
â–ªâ–ª 48 bits
â–ªâ–ª 00-Ââ€வ00-Ââ€வ00-Ââ€வ00-Ââ€வ00-Ââ€வ00 â†’â†’ FF-Ââ€வFF-Â
â€வFF-Ââ€வFF-Ââ€வFF-Ââ€வFF
Broadcast Address
â–ªâ–ª FF-Ââ€வFF-Ââ€வFF-Ââ€வFF-Ââ€வFF-Ââ€வFF
Address Resolution Protocol (ARP)
â–ªâ–ª ARP Table
â–ªâ–ª Forwarding packet within a subnet
â–ªâ–ª Forwarding packet to an external subnet
-Ââ€வ Link Layer Switches
Switch Table
Switch Filtering vs Broadcasting
-Ââ€வ Switches vs Routers
Pros / Cons for each.
•
•
•
•
•
•
•
