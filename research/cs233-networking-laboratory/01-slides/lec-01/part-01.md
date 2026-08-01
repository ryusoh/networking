# lec-01 - Part 01 (Pages 1-12)

---

## Page 1

Introduction 1-1
Chapter 1
Introduction
Computer
Networking: A Top
Down Approach
7th edition
Jim Kurose, Keith Ross
Pearson/Addison Wesley
April 2016

---

## Page 2

Introduction
Chapter 1: roadmap
1.1 what is the Internet?
1.2 network edge
§ end systems, access networks, links
1.3 network core
§ packet switching, network structure
1.5 protocol layers, service models
1-2

---

## Page 3

Introduction
Whats the Internet: a nuts and bolts view
§ billions of connected
computing devices:
• hosts = end systems
• running network apps
§ communication links
• fiber, copper, radio,
satellite
• transmission rate:
bandwidth
§ switches: forward chunks
of data (packets)
• routers and switches
wired
links
wireless
links
router
smartphone
PC
server
wireless
laptop
1-3
mobile network
global ISP
regional ISP
home
network
institutional
network
components
configurations

---

## Page 4

Introduction
§ Internet network of networks
• interconnected networks transport
data
§ protocols control sending, receiving
of information – data exchange
between end devices
• e.g., TCP, IP, HTTP, Skype,  802.11
§ Internet  standards
• IETF: Internet Engineering Task Force
§ RFC: Request for comments
• IEEE: Inst. of Electrical & Electronic
Eng.
• ITU: Intl Telecomm. Union (UN)
Whats the Internet:  a nuts and bolts view
1-5
mobile network
global ISP
regional ISP
home
network
institutional
network
tying it all together

---

## Page 5

Whats the Internet: a “service view”
§ an infrastructure that provides
services to applications:
• Web, VoIP, email, games, e-
commerce, social nets, …
§ it provides programming
interface to apps
• software modules (socket)
that allow sending and
receiving  application
programs to connect to
Internet
• service options
(options/choices) necessary
for the functionality of
applications
Introduction 1-6
mobile network
global ISP
regional ISP
home
network
institutional
network

---

## Page 6

Postal Service Analogy
Introduction 1-7
From address
To address
Stamp
Letter à Data
Delivery à Transmission
Postal Service Rules  à Internet Rules
Envelope à Packet
Delivery  Options
(registered, certified, priority)
à Trans. Options
(error control, priority)

---

## Page 7

Introduction
Whats a protocol?
human protocols:
§ asking a question
§ in a classroom
§ introductions
§ a courtroom
§ dinner conversation
network protocols – similar
but:
§ devices rather than
humans
§ diversity of devices
§ type of application:
§ queries
§ reports/files
protocols define format, order of
messages sent and received
and actions taken on
message transmission, receipt
1-8

---

## Page 8

Introduction
a human protocol and a computer network protocol:
Hi
Hi
Got the
time?
2:00
TCP connection
response
Get <http://www.awl.com/kurose-ross>
<file>
time
TCP connection
request
Whats a protocol?
1-9
Bye
Bye
Disconnect
Disconnect

---

## Page 9

Introduction
Chapter 1: roadmap
1.1 what is the Internet?
1.2 network edge
§ end systems, access networks, links
1.3 network core
§ packet switching, network structure
1.5 protocol layers, service models
1-14

---

## Page 10

Introduction
§ mesh of interconnected
switches referred to as
routers
§ packet-switching: hosts
break application-layer
data into chunks and put
into packets
• forward packets from one
router to the next, across
links on path from source
to destination
• each packet transmitted at
full link capacity
The network core
1-15

---

## Page 11

End devices: generate data
host sending function:
§ takes application data
§ breaks into smaller
chunks, known as packets,
of length L bits
§ transmits packet into
access network at
transmission rate R
• link transmission rate,
aka link capacity, aka
link bandwidth
R: link transmission rate
host
1
2
two packets,
L bits each
packet
transmission
delay
time needed to
transmit L-bit
packet over link
L (bits)
R (bits/sec)
=

=
1-16
Introduction

---

## Page 12

Introduction
Packet-switching: store-and-forward
§ store and forward: entire packet
must  arrive at router before it
can be transmitted on next
link – hop by hop
1-17
source
R bps
destination
1
2
3
L bits
per packet
R bps
