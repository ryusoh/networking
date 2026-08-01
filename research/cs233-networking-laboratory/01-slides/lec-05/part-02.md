# lec-05 - Part 02 (Pages 15-28)

---

## Page 15

Intra-AS Routing
§ also known as interior gateway protocols (IGP)
§ most common intra-AS routing protocols:
• RIP: Routing Information Protocol
• OSPF: Open Shortest Path First (IS-IS protocol
essentially same as OSPF)
• IGRP: Interior Gateway Routing Protocol
(Cisco proprietary for decades, until 2016)
5-15
Network Layer: Control Plane

---

## Page 16

3b
1d
3a
1c
2a
AS3
AS1
AS2
1a
2c
2b
1b
Intra-AS
Routing
algorithm
Inter-AS
Routing
algorithm
Forwarding
table
3c
Interconnected ASes
§ forwarding table
configured by both intra-
and inter-AS routing
algorithm
• intra-AS routing
determine entries for
destinations within AS
• inter-AS & intra-AS
determine entries for
external destinations
5-16
Network Layer: Control Plane

---

## Page 17

Inter-AS tasks
§ suppose router in AS1
receives datagram
destined outside of AS1:
• router should forward
packet to gateway
router, but which one?
AS1 must:

1. learn which destinations
are reachable through
AS2, and which through
AS3
2. propagate this
reachability info to all
routers in AS1
job of inter-AS routing!
AS3
AS2
3b
3c
3a
AS1
1c
1a
1d
1b
2a
2c
2b
other
networks
other
networks
5-17
Network Layer: Control Plane

---

## Page 18

18
Multiple Routing Protocols
§ multiple routing protocols can run on the same router
§ if a router is an exterior gateway router then usually one
IGP and one EGP protocol will be in operation
§ each routing protocol updates the routing table accordingly
routing
table
IP
Forwarding
routing table
lookup
incoming IP
datagrams
outgoing IP
datagrams
routing
protocol
routing
protocol
RIP
Process
OSPF
Process
BGP
Process
routing table updates

---

## Page 19

5.1 introduction
5.2 routing protocols
§ link state
§ distance vector
5.3 intra-AS routing in the Internet:
§ RIP
§ OSPF
5.4 inter-AS routing in the Internet: BGP
Chapter 5: outline
5-
19
Network Layer: Control Plane

---

## Page 20

Routing protocols
Routing protocol goal: determine “good” paths
(equivalently, routes), from sending host to
receiving host, through network of routers
§ path: sequence of routers packets will traverse
in going from given initial source host to given
final destination host
§ “good”: “ least cost”, “fastest”, “least
congested”
§ routing: a “top-10” networking challenge!
5-20
Network Layer: Control Plane

---

## Page 21

21
Components of a Routing Algorithm
§ a procedure for sending and receiving reachability
information about a network to other routers
§ a procedure for calculating optimal routes
• Routes are calculated using a shortest path algorithm
(least “cost”)
§ a procedure for reacting to and advertising
topology changes

---

## Page 22

Routing algorithm classification
Q: global or local information?
global:
§ all routers have complete
topology, link cost info
§ link state algorithms
local:
§ router knows physically-
connected neighbors, link
costs to neighbors
§ iterative process of
computation, exchange of
info with neighbors
§ distance vector algorithms
Q: quasi-static or dynamic?
quasi-static:
§ routes change slowly over
time
dynamic:
§ routes change more
quickly
• periodic update
• in response to link
cost changes
5-22
Network Layer: Control Plane

---

## Page 23

23
Two Shortest Path IGP Routing Algorithms
Distance Vector Routing
§
each node knows the distance (cost) to its directly connected
neighbors
§
a node periodically sends a list of routing updates to its neighbors
§
if all nodes update their distances to destinations using neighbor
information, the routing tables eventually converge
Link State Routing
§
each node knows the distance (cost) to its directly connected
neighbors
§
the distance information is flooded to all nodes in the network
§
each node calculates the routing tables independently using a network
map (topology) created by the node using the global information it
received

---

## Page 24

5.1 introduction
5.2 routing protocols
§ link state
§ distance vector
5.3 intra-AS routing in the Internet:
§ RIP
§ OSPF
5.4 inter-AS routing in the Internet: BGP
Chapter 5: outline
5-
25
Network Layer: Control Plane

---

## Page 25

Routing Information Protocol (RIP)
§ open: publicly available
§ uses distance vector algorithm
• routing table dissemination
• only link cost to neighbors at each node
• route computation using Bellman Ford’s algorithm
§ router advertises its routing table to all its neighbors
• carried in RIP messages over UDP
• routing table entries give cost from that node (source) to
all other nodes (destinations) in AS
5-26
Network Layer: Control Plane

---

## Page 26

RIP: Basic principles
§ periodically, every router sends to its neighbors a
complete list of its routes to all destinations
within an AS
§ list contains pairs of: destination, distance
§ receiver replaces/updates entries in its routing
table if routing through a neighbor costs less than
the current route in its table

---

## Page 27

Rip Example
assume:
•
link cost is 1 on all hops
•
all updates occur simultaneously
initially each router only knows its directly
connected interfaces -> cost = 0

---

## Page 28

After First Update
