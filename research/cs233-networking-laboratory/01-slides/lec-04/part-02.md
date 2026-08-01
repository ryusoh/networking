# lec-04 - Part 02 (Pages 15-28)

---

## Page 15

Switch & Broadcast Environment
Data Link Layer
5-15
switch with six interfaces
(1,2,3,4,5,6)
A
A
B
D
C
C
1
2
3
4
5
6
Hub
E
F
D
Broadcast
Environment
Address
Port
D
5
D’
5

---

## Page 16

Switch: frame filtering/forwarding
when  frame received at switch:

1. record incoming link, MAC address of sending host
2. index switch table using MAC destination address
3. if entry found for destination
then {
if destination on segment from which frame arrived (i.e., same segment)
then drop frame
(i.e, destination and source in same direction, no need to forward, see D-D’ next slide)
else forward frame on interface indicated by entry
}
else flood  /*forward on all interfaces except arriving
interface*/
6-16
Link Layer and LANs

---

## Page 17

Interconnecting switches
self-learning switches can be connected together:
Q: sending from A to G - how does S1 know to
forward frame destined to G via S4 and S3?
A: self learning! (works exactly the same as in single-
switch case!)
A
B
S1
C
D
E
F
S2
S4
S3
H
I
G
6-17
Link Layer and LANs

---

## Page 18

18
Example
Bridge 2
Port1
LAN 1
A
LAN 2
C
B
D
LAN 3
E
F
Port2
Bridge 2
Port1
Port2
• the following packets have been transmitted in the two bridge
network below:
(Src=A, Dest=F),  (Src=C, Dest=A), (Src=E, Dest=C)
• After the 3 transmissions: what have the bridges learned?
Bridge 1

---

## Page 19

Self-learning multi-switch example
Suppose C sends frame to I, I responds to C
§ Q: show switch tables and packet forwarding in S1, S2, S3, S4
A
B
S1
C
D
E
F
S2
S4
S3
H
I
G
6-19
Link Layer and LANs
Address
Port
C
1
I
4
1
4
S1
Address
Port
C
1
I
3
S4
Address
Port
C
1
I
2
S3
1
Address
Port
C
1
S2
3
2
1
1

---

## Page 20

Loops and Routing
Data Link Layer
5-20
A
B
S2
C
D
E
F
S3
S1
S4
H
I
G
K
L
S5
M
N
O
S6
P

---

## Page 21

21
• Consider the two LANs that are
connected by two bridges.
• Assume host n is transmitting a
frame F with unknown destination.
What happens?
• Bridges A and B flood the frame
to LAN 2 and enter LAN1 as source
for host n.
• Bridge B sees F on LAN 2, and copies
the frame back to LAN 1 as it has no
destination for F.
• Bridge A does the same.
• The copying continues
Wheres the problem? Whats the
solution? Prevent looping
Danger of Loops
LAN 2
LAN 1
Bridge B
Bridge A
host n
F
F
F
F
F
F
F

---

## Page 22

Spanning Tree
• a solution is to prevent loops in the topology
• IEEE 802.1d standardized an algorithm that builds and maintains a
spanning tree in a dynamic environment
• switches exchange messages to configure the spanning tree
(Configuration Bridge Protocol Data Unit - Configuration BPDU)
• uses flooding, takes sometime to converge
• one bridge elected the root, switches choose shortest path to root
• bridges that run 802.1d are called transparent bridges
Data Link Layer
5-22

---

## Page 23

BPDUs and Spanning Tree
with the help of BPDUs, switches:
• elect a single switch as the root switch (switch with lowest ID)
• calculate the distance of the shortest path to the root switch
• a shared medium (broadcast LAN) with multiple switches, picks a
designated switch, which is the switch with shortest path to root
• ties in shortest paths are broken by choosing a path leading to a
switch with lower ID
• each switch has a root port, it is the port that leads to the root via
the shortest path
• a designated switch will have a designated port that will be used for
frame forwarding (part of spanning tree)
• switches will forward packets on root and designated ports only
• some ports on a switch will be blocked, i.e., not in spanning tree, will
not forward data (prevent looping)
• root and designated ports are active – forward traffic
Data Link Layer
5-23

---

## Page 24

Spanning Tree example
Data Link Layer
5-24
A
B
S2
C
D
E
F
S3
S1
S4
H
I
G
K
L
S5
M
N
O
S6
P
root
d
d
d
d
d
r
r
d
r
b
r
r

---

## Page 25

25
What do the BPDUs do?
with the help of the BPDUs, bridges can:
• elect a single bridge as the root bridge.
• calculate the distance of the shortest path to the root bridge
• each LAN can determine a designated bridge, which is the bridge
closest to the root on  a shared medium (e.g., Ethernet). The
designated bridge will forward packets towards the root bridge.
• each bridge can determine a root port, the port that gives the best
path to the root.
• select ports to be included in the spanning tree (Active and
Passive/Blocked).

---

## Page 26

26
Configuration BPDUs
time since root sent a
message on
which this message is based
Destination
MAC address
Source MAC
address
Configuration
Message
protocol identifier
version
message type
flags
root ID
Cost
bridge ID
port ID
message age
maximum age
hello time
forward delay
Set to 0
Set to 0
Set to 0
lowest bit is "topology change bit (TC bit)
ID of root
Cost of the path from the
bridge sending this
message
priority of configurable interface
(used for loop detection)
ID of bridge sending this message
Time between
recalculations of the
spanning tree
(default: 15 secs)
Time between
BPDUs from the root
(default: 1sec)

---

## Page 27

27
Concept
• Each bridge as a unique identifier:
Bridge ID = <priority level.MAC address>
• Note that a bridge has several MAC addresses (one for each port), but only one ID. It
picks the lowest MAC address
• Each port within a bridge has a unique identifier - port ID.
• Root Bridge:
The bridge with the lowest ID is the root of the
spanning tree.
I.e., lowest MAC and priority
level.
• Root Port:
Each bridge has a root port which identifies the
next hop from
that bridge to the root. This port is identified during the spanning tree process

---

## Page 28

28
Building a Spanning Tree
• Root Path Cost:
For each bridge, the cost of the min-cost path to the root.
Usually it is measured in #hops to the root
• Designated Bridge, Designated Port:
• Single bridge on a LAN that provides the minimal cost path to the root bridge
for this LAN:
•
if two bridges on a LAN have the same cost, select the one with lowest ID
•
if the min-cost bridge has two or more ports on the LAN, select the port with the lowest
port ID
