# lec-05 - Part 03 (Pages 29-42)

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

---

## Page 37

LSA Updates
§ link-state routing protocols generate routing updates
only when a change occurs in the network topology.
§ when a link changes state, the device that detected the
change creates a link-state advertisement (LSA)
concerning that link and sends it to all neighboring
devices using a special multicast address.
§ each routing device reads the LSA.
• the LSA has a sequence number that allows the router to
check to see if it has already seen that update
• if old, it is discarded, if new, link-state database (LSDB) info
updated and LSA passed along to next neighbors
5-49
Network Layer: Control Plane

---

## Page 38

Flow Chart
5-50
Network Layer: Control Plane

---

## Page 39

OSPF Link State Packets
There are five types of Link-State Packets (LSPs).
1.
hello: are used to establish and maintain adjacency with other
OSPF routers. They are also used to elect the Designated
Router (DR) and BackupDesignated Router (BDR) on multi-
access networks.
2.
database description (DBD or DD): contains an abbreviated
list of the sending router’s link-state database and is used by
receiving routers to check against the local link-state database
to make sure it has the latest information.
3.
link-state request (LSR): used by routers to request more
information about any entry in the DBD
4.
link-state update (LSU): used to reply to LSRs as well as to
announce new information. LSUs can contain 7 different types
of Link-State Advertisements (LSAs)
5.
link-state acknowledgement (LSAck): sent to confirm receipt
of an LSU message
5-51
Network Layer: Control Plane

---

## Page 40

OSPF Packet Format
5-52
OSPF Message
IP header
Body of OSPF Message
OSPF Message
Header
Message Type
Specific Data
LSA
LSA
LSA
...
LSA
Header
LSA
Data
...
Destination IP: neighbors IP address or 224.0.0.5
(ALLSPFRouters) or 224.0.0.6 (AllDRouters:
(designated and backup designated only)
TTL: set to 1 (in most cases)
OSPF packets are not
carried as UDP or TCP
payload!
OSPF has its own IP
protocol number: 89
Network Layer: Control Plane

---

## Page 41

OSPF advanced features
§ security: all OSPF messages authenticated (to prevent
malicious intrusion)
§ multiple same-cost paths allowed (only one path in
RIP)
§ for each link, multiple cost metrics for different TOS
(e.g., satellite link cost set low for best effort ToS;
high for real-time ToS)
§ integrated uni- and multi-cast support:
• Multicast OSPF (MOSPF) uses same topology data
base as OSPF
§ hierarchical OSPF in large domains.
5-53
Network Layer: Control Plane

---

## Page 42

Hierarchical OSPF
boundary router
backbone router
area 1
area 2
area 3
backbone
area
border
routers
internal
routers
5-54
Network Layer: Control Plane
