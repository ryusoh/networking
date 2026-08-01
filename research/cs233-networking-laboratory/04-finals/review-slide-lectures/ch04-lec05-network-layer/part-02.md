# ch04-lec05-network-layer - Part 02 (Pages 19-36)

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

---

## Page 29

After Second Update

---

## Page 30

After Third Update

---

## Page 31

Last Update for Convergence

---

## Page 32

Convergence and Loops
§ Distance Vector Protocols are subject to loop formations
because of the myopic view of each router.
• routers only hear from neighbors and use that to create a global
connectivity map.
§ when changes occur, they are broadcast but take a while
to propagate and during that time cycles can form.
§ one particular problem is the count to infinity problem,
where updates bounce back and forth and the distance or
cost creeps up in value.
§ to counter that, a maximum value is set that once it is
reached, the destination is considered to be unreachable
and the route is removed from the routing table.

---

## Page 33

RIP Summary and demise
§ low overhead – fully distributed … BUT
§ slow convergence
§ low overhead
§ limited to 15 hops (max path cost à infinity =16)
§ only uses local information from immediate
neighbors for routing decisions - relies on
propagation of information for global view of
network – cycle formations
§ No longer used – Rest in Peace (RIP)

---

## Page 34

OSPF (Open Shortest Path First)
§ open: publicly available
§ uses link-state algorithm
• link state packet dissemination
• topology map at each node
• route computation using Dijkstras algorithm
§ router floods OSPF link-state advertisements to all
other routers in entire AS
• carried in OSPF messages directly over IP (rather than
TCP or UDP – protocol type 89
• link state: for each attached link
5-46
Network Layer: Control Plane

---

## Page 35

47
OSPF: Basic principles
§ routers establish a relationship (adjacency) with
neighbors
§ each router generates link state advertisements (LSAs)
which are distributed to all “adjacent” routers (after
routers have established adjacencies).
LSA = (link id, state of the link, cost, neighbors of the
link)
§ each router maintains a database (LSDB). consists of
all received LSAs (topological database or link state
database), which describes the network as a graph with
weighted edges
§ each router uses its link state database to run a
shortest path algorithm (Dijikstras algorithm) to
produce the shortest path to each network
Network Layer: Control Plane

---

## Page 36

5-48
Operation of a Link State Routing protocol
Received
LSAs
IP Routing
Table
Dijkstras
Algorithm
Link State
Database
LSAs are flooded
to other interfaces
Network Layer: Control Plane
