# ch04-lec05-network-layer - Part 04 (Pages 55-69)

---

## Page 55

67
Selective transit
Example:
§
AS 3 carries traffic
between AS 1 and AS 4 and
between AS 2 and AS 4
§
But AS 3 does not carry traffic
between AS 1 and AS 2
•
The example shows a routing
policy. In other words, AS3 is
perfectly capable of carrying AS1
-> AS2 traffic, but a policy
decision prevents AS1 and AS2
from using AS3 to reach each
other.
AS 2
AS 1
AS 3
AS 4

---

## Page 56

68
Customer/Provider and Peers
§
a stub network typically obtains access to the Internet through a transit
network. E.g., AS7 –> AS5 –> AS 8
§
a transit network that is a provider may be a customer of another
network (provider) – AS4 is a customer of AS2 as is AS5.
§
customer pays provider for service
AS 5
AS 2
Customer/
Provider
AS 7
Customer/
Provider
AS 8
Customer/
Provider
AS 4
Customer/
Provider
AS 6
Customer/
Provider
peers
peers

---

## Page 57

AS 3
AS 5
AS 2
Peers
Customer/
Provider
AS 7
Customer/Provider
AS 1
Peers
AS 8
Customer/
Provider
AS 4
Customer/
Provider
AS 6
Customer/
Provider
69
Customer/Provider and Peers
§
stubs can have peer relationships – direct link, carries no transit
§
transit networks can have a peer relationship
§
peers provide transit between their respective customers
§
peers do not provide transit between peers, i.e., traffic from AS1 to AS3
cannot go through AS2.
§
peers have to go up one layer to reach another peer if not directly connected
§
peers normally do not pay each other for service
peers
(ISPs, lv 2)
peers
(stubs)
peers
(ISPs, lv1)

---

## Page 58

Apply Import
Rules
Select Best
Route
Update IP
routing table
Apply Export
Rules
IP routing
table
Import and Export Policies
Network Layer
4-72
BGP
updates
arrive
Based on
attributes
Best entry is
entered in
IP routing
table
Policies
Policies
BGP
updates
depart

---

## Page 59

Why different Intra-, Inter-AS routing ?
policy:
§ inter-AS: manager of an AS wants control over how
its traffic is routed externally, and who routes
through its net (not applicable for STUB networks).
§ intra-AS: single admin, so no policy decisions needed
scale:
§ hierarchical routing saves table size, reduced update
traffic
performance:
§ intra-AS: can focus on performance (e.g., cost)
§ inter-AS: policy may dominate over performance
5-73
Network Layer: Control Plane

---

## Page 60

74
BGP interactions
§
BGP is executed between two routers
•
BGP session
•
BGP peers
§
procedure:
1.
establishes TCP connection (port 175) to
BGP peer
2.
exchange all BGP routes
3.
as long as connection is alive:
Periodically send incremental updates
§
Note: Not all autonomous systems need to
run BGP. On many stub networks, the route
to the provider can be statically configured
AS 1
AS 2
BGP Session

---

## Page 61

BGP messages
§ BGP messages exchanged between peers over TCP session
§ BGP messages:
• OPEN: opens TCP connection to remote BGP peer (port
179) and authenticates sending BGP peer
• UPDATE: advertises new path (or withdraws old)
• KEEPALIVE: keeps connection alive in absence of
UPDATES; also ACKs OPEN request
• NOTIFICATION: reports errors in previous msg; also
used to close connection
5-75
Network Layer: Control Plane

---

## Page 62

BGP message header
Marker is an agreed upon value (synchronization pattern) between two peers.
Usually all one’s, but can be used for authentication. Used to synchronize the
two ends.
Length gives total message length in octets
Type contains one of the message types shown in previous slide

---

## Page 63

BGP Open message

---

## Page 64

BGP Update message
Note that any field labeled “variable”, can be omitted if there is no information for
a parameter

---

## Page 65

79
BGP route updates
§
BGP route advertisement is sent in a BGP UPDATE
message
§
a route is announced as a Network Prefix, e.g.,
10.0.1.0/24, and Attributes
§
Attributes specify details about a route:
• Mandatory attributes:
ORIGIN
AS_PATH
NEXT_HOP
• many other attributes

---

## Page 66

80
ORIGIN  attribute
§
originating domain sends a route to a network (here 10.0.1.0/24) with
ORIGIN attribute (AS number)
 AS 1
 AS 2
 AS 4
 AS 5
 AS 3
10.0.1.0/24,
ORIGIN {1}
10.0.1.0/24,
ORIGIN {1}
10.0.1.0/24,
ORIGIN {1}
10.0.1.0/24,
ORIGIN {1}
10.0.1.0/24,
ORIGIN {1}
Network Prefix
10.0.1.0/24

---

## Page 67

AS 1
 AS 2
 AS 4
 AS 5
 AS 3
81
AS-PATH attributes
§
each AS that propagates a route prepends its own AS number
• AS-PATH creates a full path to reach the network prefix 10.0.1.0/24
§
path information prevents routing loops from occurring
§
path information also provides information on the length of a path (no. of
ASes enroute, by default, a shorter route is preferred)
§
Note: BGP aggregates routes according to CIDR rules
10.0.1.0/24,
AS-PATH {2,1}
10.0.1.0/24,
AS-PATH {3,1}
10.0.1.0/24,
AS-PATH {4,2,1}
10.0.1.0/24,
AS-PATH {1}
10.0.1.0/24,
AS-PATH {1}

---

## Page 68

82
NEXT-HOP attributes
§
each router that sends a route advertisement, includes its own IP
address of the forwarding port in a NEXT-HOP attribute
§
the attribute provides information for the routing table of the
receiving router in the next AS on the path
 AS 5
 AS 1
 AS 3
128.100.11.1
128.143.71.21
10.0.1.0/24,
NEXT-HOP {128.100.11.1}
10.0.1.0/24,
NEXT-HOP {128.143.71.21}

---

## Page 69

Dest.
Next hop
128.100.11.0/24
192.0.1.2
83
BGP NEXT-HOP -> IGP information
 AS 1
 AS 3
128.100.11.1/24
192.0.1.2
eBGP
iBGP
R1
IGP router
10.0.1.0/24,
NEXT-HOP {128.100.11.1}
10.0.1.0/24,
NEXT-HOP {128.100.11.1}
At R1:
Dest.
Next hop
10.0.1.0/24
128.100.11.1
IGP Routing table
BGP info
Dest.
Next hop
128.100.11.0/24
192.0.1.2
10.0.1.0/24
192.0.1.2
Combined Routing table
At R1
