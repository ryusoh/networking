# ch01-lec01-introduction - Part 02 (Pages 19-35)

---

## Page 19

Introduction
ticket (purchase)
baggage (check)
gates (load)
runway (takeoff)
airplane routing
departure
airport
arrival
airport
intermediate air-traffic
control centers
airplane routing
airplane routing
ticket (complain?)
baggage (claim
gates (unload)
runway (land)
airplane routing
ticket
baggage
gate
takeoff/landing
airplane routing
Layering of airline functionality
layers: each layer implements a service
§ via its own internal-layer actions
§ relying on services provided by layer below
1-24

---

## Page 20

Introduction
Why layering?
§ layered structure allows breakdown of a
complex system into smaller, well
identified modules with explicit
responsibilities/relationships to each
other
• layered reference model – up/down relationships
only - well defined
§ layering considered harmful?
• Overlap in functionality (e.g., error control),
dependency wrt specific requirements (e.g.,
timestamps) – not fully independent
1-25

---

## Page 21

Introduction
Why modules?
§ modularization eases
maintenance/updating of system
• change of implementation of a layers service
transparent to rest of system – internals are
hidden
§ e.g., change in gate procedure doesn’t affect
rest of system operation, a flight is still a flight,
passenger still gets to destination
§ but a change in a layer’s service could impact
performance of end system -> passengers may
not be happy with a new gate procedure – unless
reflected in their ticket purchase
1-26

---

## Page 22

Introduction
Is layering the right choice?
§ is layering harmful?
• overlap in functionality (e.g., error control),
• dependency with respect to specific requirements
(e.g., timestamps) – not fully independent
1-27

---

## Page 23

Introduction
Internet protocol stack - layers
§ application: supporting networked
applications, process to process transfer
– data stream à managed as messages
• FTP, SMTP, HTTP,….
§ transport: process to process message
transfer à managed as
segments/datagrams
• TCP, UDP
§ network: routing of data segments from
source to destination hop by hop à
managed as datagrams
• IP (Internet Protocol)
§ link: data transfer between neighboring
network elements à managed as frames
• Ethernet, 802.11 (WiFi), PPP
§ physical: data on the wireà managed
as bits
• optical, electrical, electromagnetic…..
application
transport
network
link
physical
1-28

---

## Page 24

Layers: Functionality & Services
§ Data Link Layer: Transmission of frames
• Functions:
Framing, media access control, error checking,
flow control
§ Network Layer: Forwarding of packets (datagrams)
• Functions:
Network addressing, hop by hop routing, header
checking, loop prevention
§ Transport Layer: Transfer of “chunks of application data”
• Functions:
Connection establishment/termination, error
control, flow control, congestion control
§ Application Layer: Application specific – display/presentation
• Functions:
Synchronization/timing, error recovery
Introduction 1-29

---

## Page 25

IEFT Protocol Stack Example
Introduction 1-30

---

## Page 26

Protocols in Action
Introduction 2-31
31
Send HTTP Request
to neon
Establish a connection to Neon
Open TCP connection to Neon
Send connection request to Neon
Send IP datagram to Neon
Forward datagram to next hop - Router
Forward IP datagram to Neon
Send Ethernet frame
to Neon
Send Ethernet frame
to Router
Forward the datagram
to Neon
Frame is an IP
datagram
Frame is an IP
datagram for Neon
IP datagram is  a TCP segment
IP Router
Argon
128.143.137.144
Neon
128.143.71.21
Data in segment is for HTTP

---

## Page 27

Encapsulation
§ with layering comes encapsulation
§ each layer adds control bits used to process the
information to provide the desired type of service
to the layer above it and ultimately to the
application
§ the packet grows in size as it drops from
application to datalink at the source
§ the packet is stripped of bits as it travels back up
the stack to the application layer
Introduction 1-32

---

## Page 28

IETF Encapsulation
Introduction 1-33
transport layer segment with header Ht
network layer datagram with header Hn
link layer frame with header Hl
linkh
networkh
transporth
linkt
message

---

## Page 29

Introduction
source
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
M
Ht
Hn
M
router
switch
Example
message
M
Ht
M
Hn
1-34
Ht
Hn
Hl
M
frame 1
Tl
Ht
Hn
Hl
M
frame 1
Tl
Ht
Hn
Hl
M
frame 2
Tl
Ht
Hn
Hl
M
frame 1
Tl
Ht
Hn
Hl
M
frame 1
Tl
=

---

## Page 30

4.3 IP: Internet Protocol
• IPv4 addressing
Chapter 4: Network Layer
4-35
Network Layer: Data Plane

---

## Page 31

Internet Addressing: Introduction
§ Internet address: 32-bit
identifier for host, router
interface
§ interface: connection
between host/router and
physical link
• routers typically have
multiple interfaces
§ each interface creates a
distinct/separate network
• host typically has one or two
interfaces (e.g., wired
Ethernet, wireless 802.11)
§ interfaces may or may not
be on a same network
§ Internet address associated
with each interface
223.1.1.1 = 11011111 00000001 00000001 00000001
223
1
1
1
4-36
Network Layer: Data Plane
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

---

## Page 32

What is an Internet address?
§ Internet address is usually referred to as the IP (Internet
Procotol) address.
§ henceforth we will refer to it as IP address
§ an IP address is a unique global address for a network
interface
§ an IP address:
• is a 32 bit long identifier – 4bytes
• encodes a network number referred to as  network prefix and a
device number referred to as host address
§ human analogy:
• network prefix à street name
• host number à house number

---

## Page 33

IP Dotted Decimal Notation
§ IP addresses are written in a dotted decimal format
§ each byte is identified by a decimal number in the range
[0….255] – 28
§ example
10001111
10000000
10001001
10010000
1st Byte
= 128
2nd Byte
= 143
3rd Byte
= 137
4th Byte
= 144
128.143.137.144

---

## Page 34

§ the network prefix identifies a network and the device
number identifies a specific device (actually, interface on
the network as a device can have more than 1 ”network
card”, and each card will have a unique IP address).
§ real life analogy? - street name and house number
§ how do we know how long the network prefix is?
• the network prefix used to be implicitly defined (class-based
addressing, A,B,C,D…)
• the network prefix now is flexible and is indicated by a
prefix/netmask (classless).
Network prefix and host number
network prefix
host number

---

## Page 35

Example: argon.cs.virginia.edu
§ IP address is 128.143.137.144
• is that enough info to route/forward a datagram??? -> No.
• must indicate a network prefix for every IP device (host and router)
§ using prefix notation an IP address is: 128.143.137.144/x
• e.g., x = 16 means network prefix is16 bits long
§ the prefix is identified by a network mask: prefix =16 à mask
consists of 16 ‘one’s
§ i.e., mask is represented as: 255.255.0.0
or hex format: ffff0000
--> network prefix (or ID or address) (IP address AND netmask) is:
128.143.0.0
--> host number (IP address AND inverse of netmask(=0000ffff) is:
0.0.137.144
Example
128.143
137.144
