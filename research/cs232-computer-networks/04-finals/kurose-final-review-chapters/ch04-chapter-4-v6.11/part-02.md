# ch04-chapter-4-v6.11 - Part 02 (Pages 80-157)

---

## Page 80

Network Layer 4-80
A Link-State Routing Algorithm
Dijkstras algorithm
v net topology, link costs
known to all nodes
§ accomplished via link state
broadcast
§ all nodes have same info
v computes least cost paths
from one node (source)
to all other nodes
§ gives forwarding table for
that node
v iterative: after k
iterations, know least cost
path to k dest.s
notation:
v c(x,y): link cost from
node x to y;  = ∞ if not
direct neighbors
v D(v): current value of
cost of path from source
to dest. v
v p(v): predecessor node
along path from source to
v
v N': set of nodes whose
least cost path definitively
known

---

## Page 81

Network Layer 4-81
Dijsktras Algorithm
1  Initialization:
2    N' = {u}
3    for all nodes v
4      if v adjacent to u
5          then D(v) = c(u,v)
6      else D(v) = ∞
7
8   Loop
9     find w not in N' such that D(w) is a minimum
10    add w to N'
11    update D(v) for all v adjacent to w and not in N' :
12       D(v) = min( D(v), D(w) + c(w,v) )
13    /*new cost to v is either old cost to v or known
14     shortest path cost to w plus cost from w to v*/
15  until all nodes in N'

---

## Page 82

Network Layer 4-82
w
3
4
v
x
u
5
3
7
4
y
8
z
2
7
9
Dijkstras algorithm: example
Step
N'
D(v)
p(v)
0
1
2
3
4
5
D(w)
p(w)
D(x)
p(x)
D(y)
p(y)
D(z)
p(z)
u
∞
∞
7,u
3,u
5,u
uw
∞
11,w
6,w
5,u
14,x
11,w
6,w
uwx
uwxv
14,x
10,v
uwxvy
12,y
notes:
v construct shortest path tree by
tracing predecessor nodes
v ties can exist (can be broken
arbitrarily)
uwxvyz

---

## Page 83

Network Layer 4-83
Dijkstras algorithm: another example
Step
0
1
2
3
4
5
N'
u
ux
uxy
uxyv
uxyvw
uxyvwz
D(v),p(v)
2,u
2,u
2,u
D(w),p(w)
5,u
4,x
3,y
3,y
D(x),p(x)
1,u
D(y),p(y)
∞
2,x
D(z),p(z)
∞
∞
4,y
4,y
4,y
u
y
x
w
v
z
2
2
1
3
1
1
2
5
3
5

---

## Page 84

Network Layer 4-84
Dijkstras algorithm: example (2)
u
y
x
w
v
z
resulting shortest-path tree from u:
v
x
y
w
z
(u,v)
(u,x)
(u,x)
(u,x)
(u,x)
destination
link
resulting forwarding table in u:

---

## Page 85

Network Layer 4-85
Dijkstras algorithm, discussion
algorithm complexity: n nodes
v each iteration: need to check all nodes, w, not in N
v n(n+1)/2 comparisons: O(n2)
v more efficient implementations possible: O(nlogn)
oscillations possible:
v e.g., support link cost equals amount of carried traffic:
A
D
C
B
1
1+e
e
0
e
1
1
0
0
initially
A
D
C
B
given these costs,
find new routing….
resulting in new costs
2+e
0
0
0
1+e 1
A
D
C
B
given these costs,
find new routing….
resulting in new costs
0
2+e
1+e
1
0
0
A
D
C
B
given these costs,
find new routing….
resulting in new costs
2+e
0
0
0
1+e 1

---

## Page 86

Network Layer 4-86
4.1 introduction
4.2 virtual circuit and
datagram networks
4.3 whats inside a router
4.4 IP: Internet Protocol
§ datagram format
§ IPv4 addressing
§ ICMP
§ IPv6
4.5 routing algorithms
§ link state
§ distance vector
§ hierarchical routing
4.6 routing in the Internet
§ RIP
§ OSPF
§ BGP
4.7 broadcast and multicast
routing
Chapter 4: outline

---

## Page 87

Network Layer 4-87
Distance vector algorithm
Bellman-Ford equation (dynamic programming)
let
dx(y) := cost of least-cost path from x to y
then
dx(y) = min {c(x,v) + dv(y) }
v
cost to neighbor v
min taken over all neighbors v of x
cost from neighbor v to destination y

---

## Page 88

Network Layer 4-88
Bellman-Ford example
u
y
x
w
v
z
2
2
1
3
1
1
2
5
3
5
clearly, dv(z) = 5, dx(z) = 3, dw(z) = 3
du(z) = min { c(u,v) + dv(z),
c(u,x) + dx(z),
c(u,w) + dw(z) }
= min {2 + 5,
1 + 3,
5 + 3}  = 4
node achieving minimum is next
hop in shortest path, used in forwarding table
B-F equation says:

---

## Page 89

Network Layer 4-89
Distance vector algorithm
v Dx(y) = estimate of least cost from x to y
§ x maintains  distance vector Dx = [Dx(y): y є N ]
v node x:
§ knows cost to each neighbor v: c(x,v)
§ maintains its neighbors distance vectors. For
each neighbor v, x maintains
Dv = [Dv(y): y є N ]

---

## Page 90

Network Layer 4-90
key idea:
v from time-to-time, each node sends its own
distance vector estimate to neighbors
v when x receives new DV estimate from neighbor,
it updates its own DV using B-F equation:
Dx(y) ← minv{c(x,v) + Dv(y)}  for each node y ∊N
v under minor, natural conditions, the estimate Dx(y)
converge to the actual least cost dx(y)
Distance vector algorithm

---

## Page 91

Network Layer 4-91
iterative, asynchronous:
each local iteration
caused by:
v local link cost change
v DV update message from
neighbor
distributed:
v each node notifies
neighbors only when its
DV changes
§ neighbors then notify their
neighbors if necessary
wait for (change in local link
cost or msg from neighbor)
recompute estimates
if DV to any dest has
changed, notify neighbors
each node:
Distance vector algorithm

---

## Page 92

Network Layer 4-92
x   y   z
x
y
z
0  2   7
∞∞
∞
∞∞
∞
from
cost to
from
from
x   y   z
x
y
z
0
x   y   z
x
y
z
∞∞
∞∞
∞
cost to
x   y   z
x
y
z
∞∞
∞
7 1
0
cost to
∞
2   0   1
∞ ∞  ∞
2   0   1
7   1   0
time
x
z
1
2
7
y
node x
table
Dx(y) = min{c(x,y) + Dy(y), c(x,z) + Dz(y)}
= min{2+0 , 7+1} = 2
Dx(z) = min{c(x,y) +
Dy(z), c(x,z) + Dz(z)}
= min{2+1 , 7+0} = 3
3
2
node y
table
node z
table
cost to
from

---

## Page 93

Network Layer 4-93
x   y   z
x
y
z
0  2   3
from
cost to
x   y   z
x
y
z
0  2   7
from
cost to
x   y   z
x
y
z
0  2   3
from
cost to
x   y   z
x
y
z
0  2   3
from
cost to
x   y   z
x
y
z
0  2   7
from
cost to
2  0   1
7   1   0
2  0   1
3  1   0
2   0   1
3  1   0
2  0   1
3  1   0
2  0   1
3  1   0
time
x   y   z
x
y
z
0  2   7
∞∞
∞
∞∞
∞
from
cost to
from
from
x   y   z
x
y
z
0
x   y   z
x
y
z
∞∞
∞∞
∞
cost to
x   y   z
x
y
z
∞∞
∞
7 1
0
cost to
∞
2   0   1
∞ ∞  ∞
2   0   1
7   1   0
time
x
z
1
2
7
y
node x
table
Dx(y) = min{c(x,y) + Dy(y), c(x,z) + Dz(y)}
= min{2+0 , 7+1} = 2
Dx(z) = min{c(x,y) +
Dy(z), c(x,z) + Dz(z)}
= min{2+1 , 7+0} = 3
3
2
node y
table
node z
table
cost to
from

---

## Page 94

Network Layer 4-94
Distance vector: link cost changes
link cost changes:
v node detects local link cost change
v updates routing info, recalculates
distance vector
v if DV changes, notify neighbors
good
news
travels
fast
x
z
1
4
50
y
1
t0 : y detects link-cost change, updates its DV, informs its
neighbors.
t1 : z receives update from y, updates its table, computes new
least cost to x , sends its neighbors its DV.
t2 : y receives zs update, updates its distance table.  ys least costs
do not change, so y does not send a message to z.

---

## Page 95

Network Layer 4-95
Distance vector: link cost changes
link cost changes:
v node detects local link cost change
v bad news travels slow - count to
infinity problem!
v 44 iterations before algorithm
stabilizes: see text
x
z
1
4
50
y
60
poisoned reverse:
v If Z routes through Y to get to X :
§ Z tells Y its (Zs) distance to X is infinite (so Y wont route
to X via Z)
v will this completely solve count to infinity problem?

---

## Page 96

Network Layer 4-96
Comparison of LS and DV algorithms
message complexity
v LS: with n nodes, E links, O(nE)
msgs sent
v DV: exchange between neighbors
only
§ convergence time varies
speed of convergence
v LS: O(n2) algorithm requires
O(nE) msgs
§ may have oscillations
v DV: convergence time varies
§ may be routing loops
§ count-to-infinity problem
robustness: what happens if
router malfunctions?
LS:
§ node can advertise incorrect
link cost
§ each node computes only its
own table
DV:
§ DV node can advertise
incorrect path cost
§ each nodes table used by
others
• error propagate thru
network

---

## Page 97

Network Layer 4-97
4.1 introduction
4.2 virtual circuit and
datagram networks
4.3 whats inside a router
4.4 IP: Internet Protocol
§ datagram format
§ IPv4 addressing
§ ICMP
§ IPv6
4.5 routing algorithms
§ link state
§ distance vector
§ hierarchical routing
4.6 routing in the Internet
§ RIP
§ OSPF
§ BGP
4.7 broadcast and multicast
routing
Chapter 4: outline

---

## Page 98

Network Layer 4-98
Hierarchical routing
scale: with 600 million
destinations:
v cant store all dests in
routing tables!
v routing table exchange
would swamp links!
administrative autonomy
v internet = network of
networks
v each network admin may
want to control routing in
its own network
our routing study thus far - idealization
v all routers identical
v network flat
… not true in practice

---

## Page 99

Network Layer 4-99
v aggregate routers into
regions, autonomous
systems (AS)
v routers in same AS
run same routing
protocol
§ intra-AS routing
protocol
§ routers in different AS
can run different intra-
AS routing protocol
gateway router:
v at edge of its own AS
v has  link to router in
another AS
Hierarchical routing

---

## Page 100

Network Layer 4-100
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
v forwarding table
configured by both intra-
and inter-AS routing
algorithm
§ intra-AS sets entries
for internal dests
§ inter-AS & intra-AS
sets entries for
external dests

---

## Page 101

Network Layer 4-101
Inter-AS tasks
v suppose router in AS1
receives datagram
destined outside of AS1:
§ router should forward
packet to gateway
router, but which one?
AS1 must:
1.
learn which dests are
reachable through AS2,
which through AS3
2.
propagate this
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

---

## Page 102

Network Layer 4-102
Example: setting forwarding table in router 1d
v suppose AS1 learns (via inter-AS protocol) that subnet x
reachable via AS3 (gateway 1c), but not via AS2
§ inter-AS protocol propagates reachability info to all internal
routers
v router 1d determines from intra-AS routing info that its
interface I is on the least cost path to 1c
§ installs forwarding table entry (x,I)
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
x
…

---

## Page 103

Network Layer 4-103
Example: choosing among multiple ASes
v now suppose AS1 learns from inter-AS protocol that subnet
x is reachable from AS3 and from AS2.
v to configure forwarding table, router 1d must determine
which gateway it should forward packets towards for dest x
§ this is also job of inter-AS routing protocol!
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
x
……
…
?

---

## Page 104

Network Layer 4-104
learn from inter-AS
protocol that subnet
x is reachable via
multiple gateways
use routing info
from intra-AS
protocol to determine
costs of least-cost
paths to each
of the gateways
hot potato routing:
choose the gateway
that has the
smallest least cost
determine from
forwarding table the
interface I that leads
to least-cost gateway.
Enter (x,I) in
forwarding table
Example: choosing among multiple ASes
v now suppose AS1 learns from inter-AS protocol that subnet
x is reachable from AS3 and from AS2.
v to configure forwarding table, router 1d must determine
towards which gateway it should forward packets for dest x
§ this is also job of inter-AS routing protocol!
v hot potato routing: send packet towards closest of two
routers.

---

## Page 105

Network Layer 4-105
4.1 introduction
4.2 virtual circuit and
datagram networks
4.3 whats inside a router
4.4 IP: Internet Protocol
§ datagram format
§ IPv4 addressing
§ ICMP
§ IPv6
4.5 routing algorithms
§ link state
§ distance vector
§ hierarchical routing
4.6 routing in the Internet
§ RIP
§ OSPF
§ BGP
4.7 broadcast and multicast
routing
Chapter 4: outline

---

## Page 106

Network Layer 4-106
Intra-AS Routing
v also known as interior gateway protocols (IGP)
v most common intra-AS routing protocols:
§ RIP: Routing Information Protocol
§ OSPF: Open Shortest Path First
§ IGRP: Interior Gateway Routing Protocol
(Cisco proprietary)

---

## Page 107

Network Layer 4-107
RIP ( Routing Information Protocol)
v included in BSD-UNIX distribution in 1982
v distance vector algorithm
§ distance metric: # hops (max = 15 hops), each link has cost 1
§ DVs exchanged with neighbors every 30 sec in response message (aka
advertisement)
§ each advertisement: list of up to 25 destination subnets (in IP addressing
sense)
D
C
B
A
u
v
w
x
y
z
subnet
hops
u         1
v         2
w        2
x         3
y         3
z         2
from router A to destination subnets:

---

## Page 108

Network Layer 4-108
RIP: example
destination subnet
next  router      # hops to dest
w
A
2
y
B
2
z
B
7
x
--

1
….
….
....
routing table in router D
w
x
y
z
A
C
D
B

---

## Page 109

Network Layer 4-109
w
x
y
z
A
C
D
B
destination subnet
next  router      # hops to dest
w
A
2
y
B
2
z
B
7
x
--

1
….
….
....
routing table in router D
A
5
dest     next  hops
w
-

1
x
-

1
z
C      4
….
…     ...
A-to-D advertisement
RIP: example

---

## Page 110

Network Layer 4-110
RIP: link failure, recovery
if no advertisement heard after 180 sec -->
neighbor/link declared dead
§ routes via neighbor invalidated
§ new advertisements sent to neighbors
§ neighbors in turn send out new advertisements (if tables
changed)
§ link failure info quickly (?) propagates to entire net
§ poison reverse used to prevent ping-pong loops (infinite
distance = 16 hops)

---

## Page 111

Network Layer 4-111
RIP table processing
v RIP routing tables managed by application-level
process called route-d (daemon)
v advertisements sent in UDP packets, periodically
repeated
physical
link
network       forwarding
(IP)             table
transport
(UDP)
routed
physical
link
network
(IP)
transprt
(UDP)
routed
forwarding
table

---

## Page 112

Network Layer 4-112
OSPF (Open Shortest Path First)
v open: publicly available
v uses link state algorithm
§ LS packet dissemination
§ topology map at each node
§ route computation using Dijkstras algorithm
v OSPF advertisement carries one entry per neighbor
v advertisements flooded to entire AS
§ carried in OSPF messages directly over IP (rather than
TCP or UDP
v IS-IS routing protocol: nearly identical to OSPF

---

## Page 113

Network Layer 4-113
OSPF advanced features (not in RIP)
v security: all OSPF messages authenticated (to prevent
malicious intrusion)
v multiple same-cost paths allowed (only one path in
RIP)
v for each link, multiple cost metrics for different TOS
(e.g., satellite link cost set low for best effort ToS;
high for real time ToS)
v integrated uni- and multicast support:
§ Multicast OSPF (MOSPF) uses same topology data
base as OSPF
v hierarchical OSPF in large domains.

---

## Page 114

Network Layer 4-114
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

---

## Page 115

Network Layer 4-115
v two-level hierarchy: local area, backbone.
§ link-state advertisements only in area
§ each nodes has detailed area topology; only know
direction (shortest path) to nets in other areas.
v area border routers: summarize distances  to nets in
own area, advertise to other Area Border routers.
v backbone routers: run OSPF routing limited to
backbone.
v boundary routers: connect to other ASs.
Hierarchical OSPF

---

## Page 116

Network Layer 4-116
Internet inter-AS routing: BGP
v BGP (Border Gateway Protocol): the de facto
inter-domain routing protocol
§ glue that holds the Internet together
v BGP provides each AS a means to:
§ eBGP: obtain subnet reachability information from
neighboring ASs.
§ iBGP: propagate reachability information to all AS-
internal routers.
§ determine good routes to other networks based on
reachability information and policy.
v allows subnet to advertise its existence to rest of
Internet: I am here

---

## Page 117

Network Layer 4-117
BGP basics
v when AS3 advertises a prefix to AS1:
§ AS3 promises it will forward datagrams towards that prefix
§ AS3 can aggregate prefixes in its advertisement
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
v BGP session: two BGP routers (peers) exchange BGP
messages:
§ advertising paths to different destination network prefixes (path vector
protocol)
§ exchanged over semi-permanent TCP connections
BGP
message

---

## Page 118

Network Layer 4-118
BGP basics: distributing path information
AS3
AS2
3b
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
v using eBGP session between 3a and 1c, AS3 sends prefix
reachability info to AS1.
§ 1c can then use iBGP do distribute new prefix info to all routers
in AS1
§ 1b can then re-advertise new reachability info to AS2 over 1b-to-
2a eBGP session
v when router learns of new prefix, it creates entry for
prefix in its forwarding table.
eBGP session
iBGP session

---

## Page 119

Network Layer 4-119
Path attributes and BGP routes
v advertised prefix includes BGP attributes
§ prefix + attributes = route
v two important attributes:
§ AS-PATH: contains ASs through which prefix
advertisement has passed: e.g., AS 67, AS 17
§ NEXT-HOP: indicates specific internal-AS router to next-
hop AS. (may be multiple links from current AS to next-
hop-AS)
v gateway router receiving route advertisement uses
import policy to accept/decline
§ e.g., never route through AS x
§ policy-based routing

---

## Page 120

Network Layer 4-120
BGP route selection
v router may learn about more than 1 route to
destination AS, selects route based on:

1. local preference value attribute: policy decision
2. shortest AS-PATH
3. closest NEXT-HOP router: hot potato routing
4. additional criteria

---

## Page 121

Network Layer 4-121
BGP messages
v BGP messages exchanged between peers over TCP
connection
v BGP messages:
§ OPEN: opens TCP connection to peer and authenticates
sender
§ UPDATE: advertises new path (or withdraws old)
§ KEEPALIVE: keeps connection alive in absence of
UPDATES; also ACKs OPEN request
§ NOTIFICATION: reports errors in previous msg; also
used to close connection

---

## Page 122

Putting it Altogether:
How Does an Entry Get Into a
Routers Forwarding Table?
v Answer is complicated!
v Ties together hierarchical routing (Section 4.5.3)
with BGP (4.6.3) and OSPF (4.6.2).
v Provides nice overview of BGP!

---

## Page 123

1
2
3
Dest IP
routing algorithms
local forwarding table
prefix
output port
138.16.64/22
124.12/16
212/8
…………..
3
2
4
…
How does entry get in forwarding table?
entry
Assume prefix is
in another AS.

---

## Page 124

High-level overview
1.
Router becomes aware of prefix
2.
Router determines output port for prefix
3.
Router enters prefix-port in forwarding table
How does entry get in forwarding table?

---

## Page 125

Router becomes aware of prefix
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
BGP
message
v BGP message contains routes
v route is a prefix and attributes: AS-PATH, NEXT-
HOP,…
v Example: route:
v Prefix:138.16.64/22 ;  AS-PATH:  AS3  AS131 ;
NEXT-HOP:  201.44.13.125

---

## Page 126

Router may receive multiple routes
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
BGP
message
v Router may receive multiple routes for same prefix
v Has to select one route

---

## Page 127

v Router selects route based on shortest AS-PATH
Select best BGP route to prefix
v Example:
v AS2 AS17  to 138.16.64/22
v AS3 AS131 AS201 to 138.16.64/22
v What if there is a tie? Well come back to that!
select

---

## Page 128

Find best intra-route to BGP route
v Use selected routes NEXT-HOP attribute
§ Routes NEXT-HOP attribute is the IP address of the
router interface that begins the AS PATH.
v Example:
v AS-PATH:  AS2  AS17 ;  NEXT-HOP: 111.99.86.55
v Router uses OSPF to find shortest path from 1c to
111.99.86.55
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
111.99.86.55

---

## Page 129

Router identifies port for route
v Identifies port along the OSPF shortest path
v Adds prefix-port entry to its forwarding table:
§ (138.16.64/22 , port 4)
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
router
port
1
2 3
4

---

## Page 130

Hot Potato Routing
v Suppose there two or more best inter-routes.
v Then choose route with closest NEXT-HOP
§ Use OSPF to determine which gateway is closest
§ Q: From 1c, chose AS3 AS131 or AS2 AS17?
§ A: route AS3 AS201 since it is closer
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

---

## Page 131

Summary
1.
Router becomes aware of prefix
§
via BGP route advertisements from other routers
2.
Determine router output port for prefix
§
Use BGP route selection to find best inter-AS route
§
Use OSPF to find best intra-AS route  leading to best
inter-AS route
§
Router identifies router port for that best route
3.
Enter prefix-port entry in forwarding table
How does entry get in forwarding table?

---

## Page 132

Network Layer 4-132
BGP routing policy
v A,B,C are provider networks
v X,W,Y are customer (of provider networks)
v X is dual-homed: attached to two networks
§ X does not want to route from B via X to C
§ .. so X will not advertise to B a route to C
A
B
C
W
X
Y
legend:
customer
network:
provider
network

---

## Page 133

Network Layer 4-133
BGP routing policy (2)
v A advertises path AW  to B
v B advertises path BAW to X
v Should B advertise path BAW to C?
§ No way! B gets no revenue for routing CBAW since neither W nor
C are Bs customers
§ B wants to force C to route to w via A
§ B wants to route only to/from its customers!
A
B
C
W
X
Y
legend:
customer
network:
provider
network

---

## Page 134

Network Layer 4-134
Why different Intra-, Inter-AS routing ?
policy:
v inter-AS: admin wants control over how its traffic
routed, who routes through its net.
v intra-AS: single admin, so no policy decisions needed
scale:
v hierarchical routing saves table size, reduced update
traffic
performance:
v intra-AS: can focus on performance
v inter-AS: policy may dominate over performance

---

## Page 135

Network Layer 4-135
4.1 introduction
4.2 virtual circuit and
datagram networks
4.3 whats inside a router
4.4 IP: Internet Protocol
§ datagram format
§ IPv4 addressing
§ ICMP
§ IPv6
4.5 routing algorithms
§ link state
§ distance vector
§ hierarchical routing
4.6 routing in the Internet
§ RIP
§ OSPF
§ BGP
4.7 broadcast and multicast
routing
Chapter 4: outline

---

## Page 136

Network Layer 4-136
R1
R2
R3
R4
source
duplication
R1
R2
R3
R4
in-network
duplication
duplicate
creation/transmission
duplicate
duplicate
Broadcast routing
v deliver packets from source to all other nodes
v source duplication is inefficient:
v source duplication: how does source determine
recipient addresses?

---

## Page 137

Network Layer 4-137
In-network duplication
v flooding: when node receives broadcast packet,
sends copy to all neighbors
§ problems: cycles & broadcast storm
v controlled flooding: node only broadcasts pkt if it
hasnt broadcast same packet before
§ node keeps track of packet ids already broadacsted
§ or reverse path forwarding (RPF): only forward packet
if it arrived on shortest path between node and source
v spanning tree:
§ no redundant packets received by any node

---

## Page 138

Network Layer 4-138
A
B
G
D
E
c
F
A
B
G
D
E
c
F
(a) broadcast initiated at A
(b) broadcast initiated at D
Spanning tree
v first construct a spanning tree
v nodes then forward/make copies only along
spanning tree

---

## Page 139

Network Layer 4-139
A
B
G
D
E
c
F
1
2
3
4
5
(a) stepwise construction of
spanning tree (center: E)
A
B
G
D
E
c
F
(b) constructed spanning
tree
Spanning tree: creation
v center node
v each node sends unicast join message to center
node
§ message forwarded until it arrives at a node already
belonging to spanning tree

---

## Page 140

Network Layer 4-140
Multicast routing: problem statement
goal: find a tree (or trees) connecting routers having
local mcast group members
v tree: not all paths between routers used
v shared-tree: same tree used by all group members
shared tree
source-based trees
group
member
not group
member
router
with a
group
member
router
without
group
member
legend
v source-based: different tree from each sender to rcvrs

---

## Page 141

Network Layer 4-141
Approaches for building mcast trees
approaches:
v source-based tree: one tree per source
§ shortest path trees
§ reverse path forwarding
v group-shared tree: group uses one tree
§ minimal spanning (Steiner)
§ center-based trees
…we first look at basic approaches, then specific protocols
adopting these approaches

---

## Page 142

Network Layer 4-142
Shortest path tree
v mcast forwarding tree: tree of shortest path
routes from source to all receivers
§ Dijkstras algorithm
i
router with attached
group member
router with no attached
group member
link used for forwarding,
i indicates order link
added by algorithm
LEGEND
R1
R2
R3
R4
R5
R6
R7
2
1
6
3
4
5
s: source

---

## Page 143

Network Layer 4-143
Reverse path forwarding
if (mcast datagram received on incoming link on
shortest path back to center)
then flood datagram onto all outgoing links
else ignore datagram
v rely on routers knowledge of unicast shortest
path from it  to sender
v each router has simple forwarding behavior:

---

## Page 144

Network Layer 4-144
Reverse path forwarding: example
v result is a source-specific reverse SPT
§ may be a bad choice with asymmetric links
router with attached
group member
router with no attached
group member
datagram will be  forwarded
LEGEND
R1
R2
R3
R4
R5
R6
R7
s: source
datagram will not be
forwarded

---

## Page 145

Network Layer 4-145
Reverse path forwarding: pruning
v forwarding tree contains subtrees with no mcast group
members
§ no need to forward datagrams down subtree
§ prune msgs sent upstream by router with no
downstream group members
router with attached
group member
router with no attached
group member
prune message
LEGEND
links with multicast
forwarding
P
R1
R2
R3
R4
R5
R6
R7
s: source
P
P

---

## Page 146

Network Layer 4-146
Shared-tree: steiner tree
v steiner tree: minimum cost tree connecting all
routers with attached group members
v problem is NP-complete
v excellent heuristics exists
v not used in practice:
§ computational complexity
§ information about entire network needed
§ monolithic: rerun whenever a router needs to
join/leave

---

## Page 147

Network Layer 4-147
Center-based trees
v single delivery tree shared by all
v one router identified as center of tree
v to join:
§ edge router sends unicast join-msg addressed to center
router
§ join-msg processed by intermediate routers and
forwarded towards center
§ join-msg either hits existing tree branch for this center,
or arrives at center
§ path taken by join-msg becomes new branch of tree for
this router

---

## Page 148

Network Layer 4-148
Center-based trees: example
suppose R6 chosen as center:
router with attached
group member
router with no attached
group member
path order in which join
messages generated
LEGEND
2
1
3
1
R1
R2
R3
R4
R5
R6
R7

---

## Page 149

Network Layer 4-149
Internet Multicasting Routing: DVMRP
v DVMRP: distance vector multicast routing
protocol, RFC1075
v flood and prune: reverse path forwarding, source-
based tree
§ RPF tree based on DVMRPs own routing tables
constructed by communicating DVMRP routers
§ no assumptions about underlying unicast
§ initial datagram to mcast group flooded  everywhere
via RPF
§ routers not wanting group: send upstream prune msgs

---

## Page 150

Network Layer 4-150
DVMRP: continued…
v soft state: DVMRP router periodically (1 min.)
forgets branches are pruned:
§ mcast data again flows down unpruned branch
§ downstream router: reprune or else continue to receive
data
v routers can quickly regraft to tree
§ following IGMP join at leaf
v odds and ends
§ commonly implemented in commercial router

---

## Page 151

Network Layer 4-151
Tunneling
Q: how to connect islands of multicast  routers in a
sea of unicast routers?
v mcast datagram encapsulated inside normal (non-
multicast-addressed) datagram
v normal IP datagram sent thru tunnel via regular IP unicast
to receiving mcast router (recall IPv6 inside IPv4 tunneling)
v receiving mcast router unencapsulates to get mcast
datagram
physical topology
logical topology

---

## Page 152

Network Layer 4-152
PIM: Protocol Independent Multicast
v not dependent on any specific underlying unicast
routing algorithm (works with all)
v two different multicast distribution scenarios :
dense:
v group members densely
packed, in close
proximity.
v bandwidth more plentiful
sparse:
v # networks with group
members small wrt #
interconnected networks
v group members widely
dispersed
v bandwidth not plentiful

---

## Page 153

Network Layer 4-153
Consequences of sparse-dense dichotomy:
dense
v group membership by
routers assumed until
routers explicitly prune
v data-driven construction on
mcast tree (e.g., RPF)
v bandwidth and non-group-
router processing profligate
sparse:
v no membership until routers
explicitly join
v receiver- driven construction
of mcast tree (e.g., center-
based)
v bandwidth and non-group-
router processing conservative

---

## Page 154

Network Layer 4-154
PIM- dense mode
flood-and-prune RPF: similar to DVMRP but…
v underlying unicast protocol provides RPF info
for incoming datagram
v less complicated (less efficient) downstream
flood than DVMRP reduces reliance on
underlying routing algorithm
v has protocol mechanism for router to detect it
is a leaf-node router

---

## Page 155

Network Layer 4-155
PIM - sparse mode
v center-based approach
v router sends join msg to
rendezvous point (RP)
§ intermediate routers
update state and
forward join
v after joining via RP, router
can switch to source-
specific tree
§ increased
performance: less
concentration, shorter
paths
all data multicast
from rendezvous
point
rendezvous
point
join
join
join
R1
R2
R3
R4
R5
R6
R7

---

## Page 156

Network Layer 4-156
sender(s):
v unicast data to RP,
which distributes
down RP-rooted tree
v RP can extend mcast
tree upstream to
source
v RP can send stop msg
if no attached
receivers
§ no one is listening!
all data multicast
from rendezvous
point
rendezvous
point
join
join
join
R1
R2
R3
R4
R5
R6
R7
PIM - sparse mode

---

## Page 157

Network Layer 4-157
4.1 introduction
4.2 virtual circuit and
datagram networks
4.3 whats inside a router
4.4 IP: Internet Protocol
§ datagram format, IPv4
addressing, ICMP, IPv6
4.5 routing algorithms
§ link state, distance vector,
hierarchical routing
4.6 routing in the Internet
§ RIP, OSPF, BGP
4.7 broadcast and multicast
routing
Chapter 4: done!
v understand principles behind network layer services:
§ network layer service models, forwarding versus routing
how a router works, routing (path selection), broadcast,
multicast
v instantiation, implementation in the Internet
