# lec-05 - Part 01 (Pages 1-14)

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
Chapter 5
Network Layer:
The Control Plane
5-1
Network Layer: Control Plane

---

## Page 2

Chapter 5: network layer control plane
understand principles behind network control plane
§ traditional routing algorithms
and their instantiation, implementation in the Internet:
§ OSPF, BGP
5-2
Network Layer: Control Plane

---

## Page 3

5.1 introduction
§ Control Plane
§ Autonomous Systems
5.2 routing protocols
§ link state
§ distance vector
5.3 intra-AS routing in the Internet:
§ RIP
§ OSPF
5.4 inter-AS routing in the Internet: B
Chapter 5: outline
5-3
Network Layer: Control Plane

---

## Page 4

Network-layer functions
§ forwarding: move packets
from routers input to
appropriate router output
data plane
control plane
Two approaches to structuring network control plane:
§ per-router control (traditional)
§ logically centralized control (software defined networking)
Recall: two network-layer functions:
5-4
Network Layer: Control Plane
§ routing: determine route
taken by packets from source
to destination

---

## Page 5

Per-router control plane
Routing
Algorithm
Individual routing algorithm components in each and every
router interact with each other in control plane to compute
forwarding tables
data
plane
control
plane
Local forwarding
table
header
0100
0110
0111
1001
3
2
2
1
output
5-5
Network Layer: Control Plane

---

## Page 6

Making routing scalable
scale: with billions of
destinations:
§ cant store all
destinations in routing
tables!
§ routing table exchange
would swamp links!
administrative autonomy
§ internet = network of
networks
§ each network admin may
want to control routing in
its own network
our routing study thus far - idealized
§
all routers identical
§
network flat
… not true in practice
5-6
Network Layer: Control Plane

---

## Page 7

7
Autonomous Systems
§ an autonomous system (AS) is a region of the Internet
that is administered by a single entity and that has a unified
routing policy
§ each autonomous system is assigned an Autonomous System
Number (ASN). Each ASN is either 16bits or 32bits
• ASN assigned by Regional Internet Registries
• some are reserved for private use and never appear on the
Internet
• example ASNs
– U of Ts campus network (AS239)
– Sprint (AS1239, AS1240, AS 6211, …)

---

## Page 8

Number of Autonomous Systems
8

---

## Page 9

9
Autonomous Systems terminology
§ local traffic: traffic with source and destination
in AS
§ transit traffic: traffic that passes through the AS
§ Stub AS: has connection to only one AS, only
carries local traffic
§ Multihomed Stub AS: has connection to >1
AS, but does not carry transit traffic
§ Transit AS: has connection to >1 AS and carries
transit traffic

---

## Page 10

10
Stub and Transit Networks
§
AS 1 is a multi-homed stub network
§
AS 3 and AS 4 are transit networks
§
AS 2 and AS 5 are stub networks
AS 3
AS 1
AS 2
AS 4
AS 5

---

## Page 11

aggregate routers into regions known as autonomous
systems (AS) (a.k.a. “domains”)
inter-AS routing
§ routing among AS’es
§ gateways perform inter-
domain routing (as well
as intra-domain routing)
Internet approach to scalable routing
intra-AS routing
§ routing among hosts, routers
in same AS (“network”)
§ all routers in AS must run
same intra-domain protocol
§ routers in different AS can run
different intra-domain routing
protocol
§ gateway router: at “edge” of
its own AS, has link(s) to
router(s) in other AS’es
5-11
Network Layer: Control Plane

---

## Page 12

12
Interdomain and Intradomain Routing
§
routing protocols used inside an AS, referred to as intradomain routing,
are called interior gateway protocols (IGP)
• objective: shortest path, only operate within an AS
§
routing protocols used between ASs, referred to as interdomain routing,
are called exterior gateway protocols (EGP)
• objective: satisfy policy of the ASs, not always shortest path
AS 6
AS 7
AS 4
AS 2
AS 5
AS 1
AS 3

---

## Page 13

13
Interdomain and Intradomain Routing
Intradomain Routing
§
routing within an Autonomous
System (AS)
§
ignores the Internet outside
the AS
§
protocols for Intradomain
routing are collectively called
Interior Gateway Protocols
or IGPs.
§
popular protocols are:
• RIP (simple, old)
• OSPF (better)
Interdomain Routing
§
routing between ASs
§
assumes that the Internet
consists of a collection of
interconnected ASs
§
normally, there is one
dedicated router in each AS
that handles interdomain traffic.
§
protocols are collectively called
Exterior Gateway
Protocols or EGPs.
§
popular protocols are:
• Border Gateway Protocol
(BGP) v4 current

---

## Page 14

14
EGP and IGP
§ Interior Gateway Protocol (IGP)
• routing is done based on metrics
• routing domain is one AS
§ Exterior Gateway Protocol (EGP)
• routing is done based on policies
• routing domain is the entire Internet
EGP (e.g., BGP)
AS 2
AS 2
IGP (e.g., OSPF)
IGP (e.g., RIP)
1
