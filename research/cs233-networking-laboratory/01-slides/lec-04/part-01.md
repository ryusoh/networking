# lec-04 - Part 01 (Pages 1-14)

---

## Page 1

Computer
Networking: A Top
Down Approach
A note on the use of these Powerpoint slides:
Were making these slides freely available to all (faculty, students, readers).
They’re in PowerPoint form so you see the animations; and can add, modify,
and delete slides  (including this one) and slide content to suit your needs.
They obviously represent a lot of work on our part. In return for use, we only
ask the following:
§ If you use these slides (e.g., in a class) that you mention their source
(after all, wed like people to use our book!)
§ If you post any slides on a www site, that you note that they are adapted
from (or perhaps identical to) our slides, and note our copyright of this
material.
Thanks and enjoy!  JFK/KWR
All material copyright 1996-2016
J.F Kurose and K.W. Ross, All Rights Reserved
7th edition
Jim Kurose, Keith Ross
Pearson/Addison Wesley
April 2016
Chapter 6
The Link Layer
and LANs
6-1
Link Layer and LANs

---

## Page 2

Link layer, LANs: outline
6.4 LAN Switches
• Interconnection devices – Repeaters,
Bridges1, Routers
• Bridges/LAN switches vs. Routers
• Bridges
• Learning Bridges
• Transparent Bridges
1bridge: old name for switch
6-2
Link Layer and LANs

---

## Page 3

3
Interconnection Devices
• there are many different devices for interconnecting networks.
Ethernet
Router
Ethernet
Ethernet
Token-
ring
Gateway
Bridge
Repeater
X.25
Network

---

## Page 4

4
Repeaters
• used to interconnect multiple Ethernet segments
• merely extends the baseband cable
• amplifies all signals including collisions/errors
Repeater
IP
LLC
802.3 MAC
IP
LLC
802.3 MAC
Repeater

---

## Page 5

5
Bridges/LAN switches
• interconnect multiple LANs, possibly different types
• bridges operate at the Data Link Layer (Layer 2) and only forward
(switch) link layer frames
• forwarding is done based on MAC addresses and hop-by-hop
Bridge
Token-ring
Bridge
IP
LLC
802.3 MAC
802.3 MAC
802.5 MAC
LLC
IP
LLC
802.5 MAC
LAN
LAN

---

## Page 6

6
Routers
• routers operate at the Network Layer (Layer 3)
• interconnect different subnetworks
• use a forwarding table and IP addresses to route packets hop-by-hop
Subnet-
work
Router
Subnet-
work
Router
Subnet-
work
Application
TCP
IP
Network
Access
Application
TCP
IP
Network
Access
IP protocol
IP protocol
Data
Link
Network
Access
IP
Network
Access
Network
Access
IP
Network
Access
Data
Link
Data
Link
IP protocol
Router
Router
Host
Host

---

## Page 7

Ethernet switch
• link-layer device: takes an active role in forwarding frames
• store, forward Ethernet frames
• examine incoming frames MAC address,
• selectively forward  frame to one-or-more outgoing links
• when frame is to be forwarded on segment, uses CSMA/CD to
access segment
• transparent
• hosts are unaware of presence of switches
• plug-and-play, self-learning
• switches do not need to be configured, i.e., they create
and manage their own forwarding tables
6-7
Link Layer and LANs

---

## Page 8

Switch: multiple simultaneous transmissions
• hosts have dedicated, direct
connection to switch
• switches buffer packets
• Ethernet protocol used on each
incoming link, but no collisions;
full duplex
• each link is its own collision
domain
• switching: A-to-A and B-to-B
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
6-8
Link Layer and LANs

---

## Page 9

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
A: each switch has a forwarding
(switch) table, each entry consist of:
§ MAC address of host, interface to
reach host, time stamp
§ looks like a routing table!
Q: how are entries created, maintained
in forwarding table?
§ uses a backwards learning algorithm
(something like a routing protocol) to
populate table with forwarding entries
6-9
Link Layer and LANs

---

## Page 10

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
Switch: self-learning
• switch learns which hosts
can be reached through
which interfaces
• when frame received,
switch learns location
of sender: incoming
LAN segment
• records sender/location
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
6-10
Link Layer and LANs

---

## Page 11

11
• assume a MAC frame arrives on port X
Frame Forwarding
Bridge 2
Port A
Port C
Port x
Port B
Is  MAC address of
destination in forwarding
database  for ports A, B, or C ?
Forward the frame on the
stored port
Flood the frame
send the frame on all
ports except port X
Found?
Not found ?

---

## Page 12

12
• routing tables entries are set automatically with a simple heuristic:
• the source address field of a frame that arrives on a port informs switch that
this address (host) is reachable from this port
Self Learning (Backwards Learning)
Port 1
Port 2
Port 3
Port 4
Port 5
Port 6
Src=x, Dest=y
Src=x, Dest=y
Src=x, Dest=y
Src=x, Dest=y
Src=x, Dest=y
Src=x, Dest=y
Src=y, Dest=x
Src=y, Dest=x
Src=x, Dest=y
Src=x, Dest=y
x is at Port 3
y is at Port 4

---

## Page 13

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
• frame destination, A’,
location unknown: flood
A A
§ destination A location
known:
A
4
60
selectively send
on just one link
6-13
Link Layer and LANs

---

## Page 14

14
For each frame received:
• the bridge enters the source mac address and port in forwarding table
or refreshes timer of an existing entry (address seen previously and not
yet expired)
• the bridge looks to find entry for destination MAC address in
forwarding database
• if port/interface on which frame is received is same as that for destination, drop
frame (e.g., broadcast environment, see next slide)
• if an entry for destination MAC address exists in forwarding table, reset timer
and forward the frame
• if entry not found, the bridge floods all ports with the frame except for port on
which the frame was received
• all entries are deleted after some time  (default is 15 seconds).
Learning Bridges Algorithm
