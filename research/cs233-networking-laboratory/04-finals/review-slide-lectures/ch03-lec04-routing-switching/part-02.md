# ch03-lec04-routing-switching - Part 02 (Pages 21-40)

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

---

## Page 29

29
Steps of Spanning Tree Algorithm

1. Determine the root bridge
2. Determine the root port on all other bridges
3. Determine the designated port on each LAN
Each bridge sends out BPDUs that contain the following information:
root bridge (what the sender thinks it is)
root path cost for sending bridge
Identifies sending bridge
root ID
cost
bridge ID/port ID

---

## Page 30

30
Ordering of Messages
• We can order BPDU messages with the following ordering
relation <<:
If (R1 < R2)
M1<< M2
elseif ((R1 == R2) and (C1 < C2))
M1 << M2
elseif ((R1 == R2) and (C1 == C2) and (B1 < B2))
M1 << M2
• If above holds, M1 is dominant and M2 will change its
information to match M1
• Else M2 is dominant and M1 changes to follow M2
ID R1
C1
ID B1
ID R2
C2
ID B2
<
M1
M2

---

## Page 31

31
• initially, all bridges assume they are the root bridge.
• each bridge B sends BPDUs of this form on its LANs:
• each bridge looks at the BPDUs received on all its ports
and its own transmitted BPDUs.
• root bridge, at any point in time, is the smallest received
root ID that has been received so far.
• Whenever a smaller bridge ID arrives, the root field is updated in
a bridges BPDU root bridge field
• Otherwise bridge maintains the current value
Determine the Root Bridge
B
0
B

---

## Page 32

32
• at  some point bridge B has a belief of who the root is, say R.
• bridge B determines the Root Path Cost (Cost) as follows:
• if B = R : Cost = 0 (i.e., it is the root)
• if B ¹ R: Cost = {Lowest Cost found in a received BPDU with R as root} + 1
Calculate the Root Path Cost - Determine the Root Port

---

## Page 33

Updating and Sharing Information
• Bs root port is the port from which B received the lowest cost
path to R (in terms of relation <<‘’). E.g., port A
• knowing R and Cost, B can generate a current BPDU with its root
port A.
• bridge B will only send its current BPDU to a neighbor if it receives
“worse news” on any of its ports from that neighbor.
• it updates its BPDU it if receives “better news” from a neighbor on
one of its ports (that port now becomes the root port) and
broadcasts an updated “new” BPDU on all its non root ports.
33
R
Cost
B
A
Worse news
New BPDU
Better news
Current BPDU
Update BPDU
BRIDGE

---

## Page 34

34
• now that B has generated an updated BPDU, it shares the
new information on all of its “other” ports
• B will send this BPDU on all of its ports, except port X, if
X is port from which it received better news.
• in this case, B also assumes that it
is the designated bridge for the
LAN to which port X connects.
• and Port X is the root port.
In Summary
Bridge B
Port A
Port C
Port x
Port B
R
Cost
B
A

---

## Page 35

35
Example
• bridge B (ID 8) receives on port “X” the following BPDU from a
neighboring bridge (ID 12):
• and B’s current BPDU is:
• because Cost 2 << Cost 3, B will broadcast on its port “X” its current
BPDU to let bridge (ID 12) know it has a shorter path to the root
bridge (ID 2) via port A (its current root port).
• if instead B’s current BPDU is:
• then B will broadcast on all its other ports (A,B,C) the following
BPDU:
• where “4” (3+1) is new cost from Bridge B on port X to root bridge
(ID 2) (via bridge ID 12). And port X is now its root port
R=2
Cost=3
12
C
R=2
Cost=2
8
A
2
5
8
A
2
3+1=4
8
X

---

## Page 36

36
Selecting the Ports for the Spanning Tree
• now that Bridge B has calculated the root, the root path cost, and the
designated bridge and port for each LAN.
• B can decide which ports are in the spanning tree:
• Bs root port is part of the spanning tree (every bridge has to have a root port)
• The ports on all the LANs for which B is the designated bridge are part of the
spanning tree (designated ports).
• Bs ports that are in the spanning tree will forward packets (=forwarding
state)
• Bs ports that are not in the spanning tree will not forward packets
(=blocking state)
• note that a bridge may not be the designated bridge on any LAN. As such, all
its ports, other than the root port will be blocked.

---

## Page 37

37
Spanning Tree example – what is the spanning tree?
• consider the network on
the right.
• assume that the bridges
have calculated the
designated ports (D), the
blocked ports (B) and the
root ports (R) as indicated.
• what is the spanning tree?
LAN 2
Bridge
LAN 5
LAN 3
LAN 1
LAN 4
Bridge
Bridge
Bridge
d
Bridge
D
D
D
R
D
R
R
R
D
1
2
3
4
5
B
B

---

## Page 38

Spanning Tree example – what is the spanning tree?
Data Link Layer
5-38
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

## Page 39

Health of the Spanning Tree
• consider the network
on the right - if link
between S5 and S2 goes
down or S2 fails -> tree
is damaged
• S5 is now isolated and
cannot send to, or
receive traffic from, the
rest of the tree
• using “hello” messages,
the switches will notice
the failure of a
component and re-
calculate the spanning
tree
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

## Page 40

Detecting and Recovering from Failures
• hello messages are generated periodically by
the root switch, which sends them out on
each link to the next level of switches
• every switch that receives a hello message,
replaces the bridge ID with its own, and
passes it on to the next level of switches
• all switches receive the hello messages on
their root ports, and forward them via their
designated ports
• if a switch does not receive a hello message
within a certain period of time (fixed
interval), it starts a “recovery” timer that is
3x the hello message interval
• if that timer expires, it will assume the tree
is broken and initiate the “spanning tree”
process
• when a problem is detected by a switch
(i.e., timer expired), it resets all its ports
and initiates the spanning tree algorithm by
sending out a BPDU declaring itself as Root.
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
S5
0
S5
“hello”
“hello”
“hello”
“hello”
“hello”
“hello”X
S5 0 S5
S5 0 S5
