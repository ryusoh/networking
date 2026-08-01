# cs234-01 - Part 03 (Pages 29-40)

---

## Page 29

ISO/OSI 7-Layer Reference
Model
´presentation: common data
interpretation, e.g., encryption,
compression, machine-specific
conventions
´session: synchronization,
checkpointing, recovery of data
exchange
´Internet stack misses
these layers!
´these services, if needed,
are done in app layer
´Example: SSL
application
presentation
session
transport
network
link
physical
29

---

## Page 30

UNIX Socket API
´ A socket is an abstraction of a communication
endpoint
´ Socket descriptors are implemented as file
descriptors in the UNIX System
´ General functions that deal with file descriptors,
such as read and write, also work with a socket
descriptor
´ Creating a socket: int socket(int domain,
int type, int protocol);
´ Release a socket: close(..)
30

---

## Page 31

Sample Socket APIs
´ For connection oriented (TCP) only
´ ssize_t send(int sockfd, const void *buf,
size_t nbytes, int flags);
´ For both Connection oriented (TCP) and
connectionless (UDP)
´ ssize_t sendto(int sockfd, const void*buf,
size_t nbytes, int flags, const struct
sockaddr *destaddr, socklen_t destlen);
´ Returns: number of bytes sent if success, or
-1 on error
31

---

## Page 32

Encapsulation and
Decapsulation of Packets
application
transport
network
link
physical
Ht
Hn
M
segment
Ht
datagram
destination
application
transport
network
link
physical
Ht
Hn
Hl
M
Ht
Hn
M
Ht
M
M
network
link
physical
link
physical
Ht
Hn
Hl
M
Ht
Hn
M
Ht
Hn
M
Ht
Hn
Hl
M
router
switch
message
M
Ht
M
Hn
frame
32

---

## Page 33

Agenda
´What is the Internet
´Network Edge
´Network Core: Circuit Switched
vs. Packet Switched
´Protocol Layers and UNIX
Sockets
´History and Internet design
philosophy
33

---

## Page 34

History of the Internet
´ 1961-1972: Early packet-switching principles
´ 1972: ARPAnet has 15 nodes
´ 1972-1980: Internetworking, new and proprietary
networks
´ 1974: Cerf and Kahn’s internetworking principles
defines today’s Internet
´ 1979: ARPAnet has 200 nodes
´ 1980-1990: new protocols, a proliferation of
networks
´ 1990: 100,000 hosts
´ 1990-2000’s: commercialization, the Web, new
apps
´ Late 1990’s: 50 million hosts, 100 million+ users
34

---

## Page 35

2005-Present’s Internet
´ ~5B devices attached to Internet (2016)
´ smartphones and tablets
´ More broadband and high-speed wireless
access
´ emergence of online social networks:
´ Facebook 2.27 billion users; Instagram 1 billion users,
Twitter 336 million (late 2018)…..
´ Service/content  providers (like Google) create
their own networks
´ bypass traditional ISPs
´ universities, enterprises run their services in cloud
35

---

## Page 36

Cerf and Kahn’s Internetworking
Principles (1974)
´minimalism, autonomy
´interconnect difference networks
´best effort service model
´simplify routers
´stateless routers
´keep complexity at the edge (hosts)
´decentralized control
´scalability
36

---

## Page 37

Design Principles Learned
from the Internet History
´Modularity (e.g., layering)
´how to break network functionality into
modules
´End-to-End Argument
´where to implement functionality
´Separating policies from mechanisms
´decouple control from data
´another form of modularization
´Design for scale
´hierarchy, aggregation, etc.
37

---

## Page 38

A Packet-Switched Datagram Network
with IP as the Compatibility Layer

1. Connect existing networks
´ initially ARPANET and ARPA packet radio network
2. Survivability
´ ensure communication service even with network and
router failures
3. Support multiple types of services
4. Must accommodate a variety of
networks
5. Allow distributed management
6. Allow host attachment with a low level of
effort
7. Be cost effective
8. Allow resource accountability
A prioritized list
IP
TCP
UDP
ATM
Satellite
Ethernet
38

---

## Page 39

Wish List for Today (Future?)
Internet
´ Availability and reliability
´ “Always on”, fault-tolerant, fast recovery from failures, …
´ Quality-of-service (QoS) for applications
´ fast response time, adequate quality for VoIP, IPTV, etc.
´ Scalability
´ billions or more of users, devices, …
´ Mobility
´ untethered access,  mobile users, devices, …
´ Security and Privacy
´ Protect against malicious attacks, accountability of user
actions
´ Manageability
´ configure, operate and manage networks
´ trouble-shooting network problems
´ Flexibility, Extensibility, Evolvability, ……
´ ease of new service creation and deployment
´ evolvable to meet future needs?
39

---

## Page 40

40
Questions
<chsu@cs.nthu.edu.tw>
