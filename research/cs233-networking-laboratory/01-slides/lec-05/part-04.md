# lec-05 - Part 04 (Pages 43-56)

---

## Page 43

§ two-level hierarchy: local area, backbone.
• link-state advertisements only in area
• each nodes has detailed area topology; only know
direction (shortest path) to nets in other areas.
§ area border routers: summarize distances  to nets in
own area, advertise to other Area Border routers.
§ backbone routers: run OSPF routing limited to
backbone.
§ boundary routers: connect to other ASes.
Hierarchical OSPF
5-55
Network Layer: Control Plane

---

## Page 44

5.1 introduction
5.2 routing protocols
§ link state
§ distance vector
5.3 intra-AS routing in the Internet:
§ RIP
§ OSPF
5.4 inter-AS routing in the Internet BGP
Chapter 5: outline
5-
56
Network Layer: Control Plane

---

## Page 45

Internet inter-AS routing: BGP
§ BGP (Border Gateway Protocol): the de facto
inter-domain routing protocol (v 4)
• glue that holds the Internet together
§ BGP provides each AS a means to:
• eBGP: obtain subnet reachability information from
neighboring ASes
• iBGP: propagate reachability information to all AS-
internal routers.
• determine good routes to other networks based on
reachability information and policy
§ allows subnet to advertise its existence to rest of
Internet: I am here
§ uses TCP for reliable communications to transmit
routing messages
5-57
Network Layer: Control Plane

---

## Page 46

eBGP, iBGP connections
eBGP connectivity
iBGP connectivity
1b
1d
1c
1a
2b
2d
2c
2a
3b
3d
3c
3a
AS 2
AS 3
AS 1
5-58
Network Layer: Control Plane
1c
∂
∂
gateway routers run both eBGP and iBGP protools

---

## Page 47

BGP basics
§ when AS3 gateway router 3a advertises path AS3,X to AS2
gateway router 2c:
• AS3 promises to AS2 it will forward datagrams towards X
§ BGP session: two BGP routers (peers) exchange BGP
messages over semi-permanent TCP connection:
• advertising paths to different destination network prefixes
(BGP  is a path vector protocol)
1b
1d
1c
1a
2b
2d
2c
2a
3b
3d
3c
3a
AS 2
AS 3
AS 1
X
BGP advertisement:
AS3, X
5-59
Network Layer: Control Plane

---

## Page 48

Path attributes and BGP routes
§ advertised prefix includes BGP attributes
• prefix + attributes = route
§ two important attributes:
• AS-PATH: list of ASes through which prefix advertisement
has passed
• NEXT-HOP: indicates specific internal-AS router to next-
hop AS
§ Policy-based routing:
• gateway receiving route advertisement uses import policy to
accept/decline path (e.g., never route through AS Y).
• AS export policy also determines whether to advertise path
to other neighboring ASes
5-60
Network Layer: Control Plane

---

## Page 49

BGP path advertisement
§ Based on AS2 import policy, AS2 router 2c accepts path AS3,X, and
propagates (via iBGP) to all AS2 routers
1b
1d
1c
1a
2b
2d
2c
2a
3b
3d
3c
3a
AS2
AS3
AS1
X
AS3,X
AS2,AS3,X
§ AS2 router 2c receives path advertisement AS3,X (via eBGP) from AS3
router 3a
§ Based on AS2 export policy,  AS2 router 2a advertises (via eBGP)  path
AS2, AS3, X  to AS1 router 1c
5-61
Network Layer: Control Plane

---

## Page 50

BGP path advertisement
§ AS1 gateway router 1c learns path AS2,AS3,X from 2a
1b
1d
1c
1a
2b
2d
2c
2a
3b
3d
3c
3a
AS2
AS3
AS1
X
AS3,X
AS2,AS3,X
gateway router may learn about multiple paths to destination:
AS3,X
§ AS1 gateway router 1c learns path AS3,X from 3a
§ Based on policy,  AS1 gateway router 1c chooses path AS3,X, and
advertises path within AS1 via iBGP
5-62
Network Layer: Control Plane

---

## Page 51

BGP, OSPF, forwarding table entries
§ recall: 1a, 1b, 1d learn about dest X via iBGP
from 1c: “path to X goes through 1c”
1b
1d
1c
1a
2b
2d
2c
2a
3b
3d
3c
3a
AS2
AS3
AS1
X
AS3,X
AS2,AS3,X
AS3,X
§ 1d: OSPF intra-domain routing: to get to 1c,
forward over outgoing local interface 1
AS3,X
Q: how does router set forwarding table entry to distant prefix?
1
2
1
2
dest
interface
…
…
X
…
…
1
physical link
local link
interfaces
at routers
1a, 1d
5-63
Network Layer: Control Plane

---

## Page 52

BGP, OSPF, forwarding table entries
§ recall: 1a, 1b, 1d learn about dest X via iBGP
from 1c: “path to X goes through 1c”
1b
1d
1c
1a
2b
2d
2c
2a
3b
3d
3c
3a
AS2
AS3
AS1
X
§ 1d: OSPF intra-domain routing: to get to 1c,
forward over outgoing local interface 1
Q: how does router set forwarding table entry to distant prefix?
dest
interface
…
…
X
…
…
2
§ 1a: OSPF intra-domain routing: to get to 1c,
forward over outgoing local interface 2
1
2
5-64
Network Layer: Control Plane

---

## Page 53

AS 1
Advertise path to
10.0.1.0/24
AS 1
Advertise path to
10.0.1.0/24
AS 3
AS 2
AS 4
Advertise path to
10.0.1.0/24
Advertise path to
10.0.1.0/24
BGP route selection
§
gateway router may learn
about more than one route
to destination AS, selects
route based on:
1.
local preference value
attribute: policy decision
2.
shortest AS-PATH
3.
closest NEXT-HOP
internal router: hot potato
routing
4.
additional criteria
5-65
Network Layer: Control Plane
AS 1
AS 3
AS 4
AS 5
AS 2
AS 6
§
shortest AS-PATH may not mean
shortest router/hop path
5
Local pref = 10
Local pref = 50
Local pref
= 100
Local pref = 80
AS 5
§
best cost intra path may not mean
best cost overall
 AS 2
 AS 1
Low bandwidth network
Cost=20
Destination
Source
Cost=5
High bandwidth network

---

## Page 54

Hot Potato Routing
§ 2d learns (via iBGP) it can route to X via 2a or 2c
§ hot potato routing: choose local gateway that has least intra-
domain cost (e.g., 2d chooses 2a, even though more AS hops
to X): don’t worry about inter-domain cost!
§ Note that BGP will go with shortest AS path first. If 2 routes
have same length AS path, use hot potato (shortest path)
internally (IGP).
1b
1d
1c
1a
2b
2d
2c
2a
3b
3d
3c
3a
AS2
AS3
AS1
X
AS3,X
AS1,AS3,X
OSPF link weights
201
152
112
263
5-66
Network Layer: Control Plane

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
