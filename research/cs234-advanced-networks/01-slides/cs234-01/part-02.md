# cs234-01 - Part 02 (Pages 15-28)

---

## Page 15

Host’s Sending Function
´takes application message
´breaks into smaller chunks, known as
packets, of length L bits
´transmits packet into access network at
transmission rate R
´link transmission rate =  link capacity = link
bandwidth
R: link transmission rate
host
1
2
two packets,
L bits each
Q: What is the packet
transmission delay?
15

---

## Page 16

Agenda
´What is the Internet
´Network Edge
´Network Core: Circuit Switched
vs. Packet Switched
´Protocol Layers and UNIX
Sockets
´History and Internet design
philosophy
16

---

## Page 17

Network Core and Packet
Switching
´interconnected routers
´packet-switching: hosts
break application-layer
messages into packets
´forward packets from one
router to the next, across
links on path from source to
destination
´each packet transmitted at
full link capacity
17

---

## Page 18

Store-and-Forwarding Principle
´takes L/R seconds to transmit (push out) L-
bit packet into link at R bps
´store and forward: entire packet must
arrive at router before it can be
transmitted on next link
source
R bps
destination
1
2
3
L bits
per packet
R bps
Q: What is the
end-to-end
delay?
18

---

## Page 19

Queueing Delay and Packet
Loss
´Q: Why does packet switching
suffer from queueing delay and
packet loss?
A
B
C
R = 100 Mb/s
R = 1.5 Mb/s
D
E
egress queue: packets
waiting for output link
19

---

## Page 20

Two Main Functions of Routers
forwarding: move packets
from routers input to
appropriate router output
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
20

---

## Page 21

Circuit Switching
´end-end resources allocated to, reserved
for “call” between source & dest:
´dedicated (guaranteed) resources: no
sharing
´circuit segment
idle if not used
by call: no sharing
´telephone networks
21

---

## Page 22

How Circuit Switching
Multiplexing Among Hosts
FDM
frequency
time
4 users
Example:
TDM
22

---

## Page 23

Packet Switching Versus
Circuit Switching
´Q: human analogies of reserved
resources (circuit switching) versus on-
demand allocation (packet-switching)?
´Packet switching is great for bursty data
´resource sharing
´simpler, no call setup
´But it suffers from packet delay and loss
´protocols needed for reliable data transfer, congestion
control
´Q: How to provide circuit-like behavior?
´bandwidth guarantees needed for audio/video apps
´open problems ß will be discussed in weeks 3 and 4
23

---

## Page 24

Core Network Structure:
Network of Networks
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
…
…
connecting each access ISP
to each other directly doesn’t
scale: O(N2) connections.
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
access
net
access
net
access
net
access
net
…
access
net
access
net
access
net
access
net
…
Challenge: given millions of access ISPs, how to
connect them together?
24

---

## Page 25

Current Core Network
Structure
IXP
IXP
IXP
Tier 1 ISP
Tier 1 ISP
Google
Regional ISP
Regional ISP
access
ISP
access
ISP
access
ISP
access
ISP
access
ISP
access
ISP
access
ISP
access
ISP
25

---

## Page 26

Agenda
´What is the Internet
´Network Edge
´Network Core: Circuit Switched
vs. Packet Switched
´Protocol Layers and UNIX
Sockets
´History and Internet design
philosophy
26

---

## Page 27

How to Deal With the
Excessive Complexity
´Too many pieces:
´hosts, routers, links of various physical media,
applications, protocols, hardware, software
´Layering approach: each layer
implements a service
´via internal-layer actions
´relying on services provided by the layer
below
´ Benefits: Ease of discussion and system
updates
27

---

## Page 28

Internet Protocol Stack
´ application: supporting network
applications
´ FTP, SMTP, HTTP
´ transport: process-process data
transfer
´ TCP, UDP
´ network: routing of datagrams from
source to destination hosts
´ IP, routing protocols
´ link: data transfer between
neighboring network elements
´ Ethernet, 802.111 (WiFi), PPP
´ physical: bits on the wire
application
transport
network
link
physical
28
