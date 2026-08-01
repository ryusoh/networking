# cs234-04 - Part 03 (Pages 21-30)

---

## Page 21

Agenda
´Modern Data Centers
´Design Goals of Data Center
Networks
´(Old) Data Center Networks
´Fat-Tree Network Topology
´Virtual Layer 2 (VL2) Networks
21

---

## Page 22

Case Study: Fat-Tree
´ [DC-Fat-Tree] M. Al-Fares, A. Loukissas and A.
Vahdat, "A Scalable, Commodity Data Center
Network Architecture," In. Proc of ACM
SIGCOMM'08, Aug 2008.
´To address the limitations of the old
architecture
´ single point of failure
´ over subscription of links higher up in the topology ß
trade-offs between cost and providing
´A new Fat-tree topology to increases bi-
section bandwidth ß any two servers
have multiple paths!
´ Novel addressing, forwarding/routing
22

---

## Page 23

Fat-Tree’s Design Goals
´Allows host communication at line
speed
´no matter where they are located!
´Backwards compatible with existing
infrastructure
´no changes in application & support of
layer 2 (Ethernet)
´Cost effective
´cheap infrastructure
´low power consumption & heat emission
23

---

## Page 24

K-nary Fat-Tree Architecture
´ Fat-Tree: a special type of Clos Networks (after C. Clos)
´ each pod consists of (k/2)2 servers & 2 layers of k/2 k-port switches
´ each edge switch connects to k/2 servers & k/2 aggr. switches
´ each aggr. switch connects to k/2 edge & k/2 core switches
´ (k/2)2 core switches: each connects to k pods
24
Fat-tree
with k=4

---

## Page 25

Pros of Fat-Tree Architecture
´ Why Fat-Tree?
´ Fat tree has identical bandwidth at any bisections
´ Each layer has the same aggregated bandwidth
´ Can be built using cheap devices with uniform
capacity
´ Each port supports same speed as end host
´ All devices can transmit at line speed if packets
are distributed uniform along available paths
´ Great scalability: k-port switch supports k3/4
servers
25
K = 3 è 54 hosts

---

## Page 26

How About
Routing/Switching?
´ Ethernet switching (layer 2)
ü Fixed IP addresses and auto-configuration (plug &
play)
ü Seamless mobility, migration, and failover
x Broadcast limits scale (ARP)
x No multipath (Spanning Tree Protocol)
´ IP routing (layer 3)
ü Scalability through hierarchical addressing
ü Multipath routing through equal-cost multipath
x Can’t migrate w/o changing IP address
x Complex configuration
26

---

## Page 27

Fat-Tree Goes with Layer-3
Routing
´ Layer 2 switch algorithm: data plane
flooding!
´ Layer 3 IP routing:
´ shortest path IP routing will typically use only one
path despite the path diversity in the topology
´ if using equal-cost multi-path routing at each
switch independently and blindly, packet re-
ordering may occur; further load may not
necessarily be well-balanced
´ Aside: control plane flooding!
´ OK, what is their neat proposal?
27

---

## Page 28

Addressing and Routing in
Fat-Tree
´ Enforce a special (IP) addressing scheme
´ unused.PodNumber.switchnumber.Endhost
´ Allows host attached to same switch to route only
through switch
´ Allows inter-pod traffic to stay within pod
´ Use two level look-ups to distribute traffic and
maintain packet ordering ß compatible to
TCAM lookup!
28
Ø First level is prefix lookup
Ø used to route down the topology
to servers
Ø Second level is a suffix lookup
Ø used to route up towards core
Ø maintain packet ordering by using
same ports for same server

---

## Page 29

Agenda
´Modern Data Centers
´Design Goals of Data Center
Networks
´(Old) Data Center Networks
´Fat-Tree Network Topology
´Virtual Layer 2 (VL2) Networks
29

---

## Page 30

Case Study: VL2
´ [VL2] A. Greenberg, et al., "VL2: A Scalable and
Flexible Data Center Network", In. Proc of ACM
SIGCOMM'09, Aug 2009.
´ A virtual (logical) layer 2 for the whole network
´ employs a 3-level Clos topology (full-mesh in top-2
levels) with non-uniform switch capacities
´ Separate identity and location
´ application and location addresses
´ employs a directory service for name resolution
´ but needs direct host participation (agents on servers)
´ Explicitly accounts for DC traffic matrix dynamics
´ Valiant load-balancing (VLB) à using randomization to
cope with volatility
30
