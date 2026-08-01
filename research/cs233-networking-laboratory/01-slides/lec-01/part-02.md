# lec-01 - Part 02 (Pages 13-24)

---

## Page 13

Introduction
Packet Switching: queueing delay, loss
A
B
C
R = 100 Mb/s
R = 1.5 Mb/s
D
E
queue of packets
waiting for output link
1-18
queuing and loss:
§ if arrival rate (in bits) to link exceeds transmission rate of link
for a period of time:
• packets will queue, wait to be transmitted on link
• packets can be dropped (lost) if memory (buffer) fills up

---

## Page 14

Two key network-core functions
forwarding: move packets from
routers input (port) to
appropriate router output
(port) based on forwarding table
created by routing algorithm
Introduction1-19
routing: determines source-
destination route taken by
packets
§ routing algorithms
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
1
2
3
0111
destination address in arriving
packets header

---

## Page 15

ISP C
ISP B
ISP A
Internet structure: network of networks
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
Introduction 1-20
access
net
access
net
access
net
access
net
regional net
Autonomous Systems (AS) interconnected by gateway routers

---

## Page 16

Introduction
Chapter 1: roadmap
1.1 what is the Internet?
1.2 network edge
§ end systems, access networks, links
1.3 network core
§ packet switching, network structure
1.5 protocol layers, service models
1-21

---

## Page 17

Introduction
Protocol layers
Networks are complex,
with many pieces:
§ hosts
§ routers
§ links of various
media
§ applications
§ protocols
§ hardware,
software
Question:
how should we organize
such a complex system?
…. or at least our
discussion of networks?
1-22

---

## Page 18

Introduction
Analogy: Organization of air travel
§ a series of steps
ticket (purchase)
baggage (check)
gates (load)
runway takeoff
airplane routing
ticket (complain or not)
baggage (claim)
gates (unload)
runway landing
airplane routing
airplane routing
1-23

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
