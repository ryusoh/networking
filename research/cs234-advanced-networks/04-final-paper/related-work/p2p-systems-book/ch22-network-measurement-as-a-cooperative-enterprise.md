# ch22-network-measurement-as-a-cooperative-enterprise

---

## Page 1

Network Measurement as a Cooperative
Enterprise
Sridhar Srinivasan and Ellen Zegura
Networking and Telecommunications Group
College of Computing
Georgia Institute of Technology
Atlanta, GA 30332
{sridhar,ewz}@cc.gatech.edu
Abstract. Real-time network measurements can be used to improve
performance of existing Internet services and support the deployment of
new services dependent on performance information (e.g., topologically-
aware overlay networks). Internet-wide measurement faces numerous
scaling-related challenges, including the problem of deploying enough
measurement endpoints for wide-spread coverage. We observe that peer-
to-peer networks, made up of “volunteer” hosts around the Internet wor-
ld, have the potential to provide a level of coverage that greatly exceeds
that made possible with the tedious human process of negotiating end-
point locations. We therefore propose a distributed peer-to-peer system
that can be queried for network performance information. We sketch the
architecture and operation of such a system and brieﬂy relate it to alter-
native proposals for measurement infrastructures. Finally, we list open
problems related to the design and realization of such a system.
1
Introduction
Measurements of network performance are valuable for improving performance,
assessing utilization, engineering traﬃc and validating design choices. We are
particularly interested in real-time measurements that can be used to improve
the performance of existing Internet services and support the deployment of new
services dependent on performance information (e.g., topologically-aware overlay
networks).
The challenges involved in constructing an Internet-scale measurement infras-
tructure are considerable. First, there is the diﬃculty of coverage, that is, ob-
taining access to a large number of distributed measurement endpoints. Current
measurement systems generally involve human-negotiated access to endpoints
either with ISPs and/or friends at diverse locations [3, 6]. Second, there is the
diﬃculty of obtaining accurate measurements, given the time-varying nature
of network properties of interest (e.g., loss rate, available bandwidth, latency).
Third, there is the issue of overhead. Care must be taken to avoid a measurement
process that imposes excessive overhead on the overall system. These challenges
P. Druschel, F. Kaashoek, and A. Rowstron (Eds.): IPTPS 2002, LNCS 2429, pp. 166–177, 2002.
c
⃝Springer-Verlag Berlin Heidelberg 2002

---

## Page 2

Network Measurement as a Cooperative Enterprise
167
have obvious interactions; for example, one can reduce overhead with less accu-
rate measurements or more coarse-grained coverage.
We observe that peer-to-peer networks, made up of “volunteer” hosts around
the Internet world, have the potential to provide a level of coverage that greatly
exceeds that made possible with the tedious human process of negotiating end-
point locations. We therefore propose a distributed peer-to-peer system that can
be queried for network performance information. The M-coop (or Measurement
co-operative) is a system that answers queries about the path between two ar-
bitrary IP addresses. In addition to performance metric information, the system
returns assessments of the metric accuracy and trustworthiness.
Such a system does not, on its own, solve the problem of obtaining accurate
measurements. Nor does it solve the problem of measurement overhead. Indeed,
because such a system may involve a very large number of end systems, the
scaling problem is signiﬁcant. We will rely on known techniques for dealing with
accuracy (e.g., using moving weighted averages); we will introduce mechanisms
for reducing the number of end systems that form measurement pairs to help
with the scale problem.
Such a system brings with it a number of additional challenges. Well-known
are the problems that result from a peer-to-peer system of hosts that may join
and leave on a frequent basis [4, 5, 8, 9]. Merely keeping the M-coop system
connected can be challenging in this environment. Because the measurement en-
tities are volunteers, and not under any accountable control, we must deal with
issues of inaccurate information due to misconﬁguration or malicious use. The
inclusion of a trustworthiness value recognizes the fact that information quality
may vary. We must also consider the question of incentive. What would motivate
someone to include their host in an M-coop measurement infrastructure? The
limited examples of deployed peer-to-peer systems indicate that people are moti-
vated by self-interest (e.g., Napster, Gnutella) and by a sense of contributing to a
larger “good” (e.g., SETI@home). An Internet-scale measurement infrastructure
has the potential to tap both sources of motivation.
In the next section, we sketch the design of an M-coop system. In Section3,
we describe some details of the architecture and brieﬂy sketch the operation
of this system. In Section4, we brieﬂy describe related work and then conclude
with a section discussing the open problems in the design and realization of an
Internet-wide peer-to-peer measurement system.
2
An M-coop Design
We sketch one possible design of a cooperative measurement system. The system
has some features in common with other measurement infrastructures (most
notably IDMaps [1] and NIMI [3]). Some similarities and diﬀerences are discussed
in the Related Work section.

---

## Page 3

168
Sridhar Srinivasan and Ellen Zegura
2.1
The Service
The M-coop system answers queries of the form (IP1, IP2, measurement type)
where IP1 and IP2 are IP addresses. The measurement type may be any network
quantity measurable by hosts on a network, e.g., delay, bandwidth, jitter. The
system returns the answer to the query along with trust and accuracy parameters
if available. As a voluntary peer-to-peer system, the possibility of misinformation
is high, so a trust value is reported with the information returned. The trust value
is an indication of the past reliability (with respect to quality of information) of
the node that responded to the query.
The size of the Internet dictates that any measurement will only be an esti-
mate. To keep the system manageable, instead of the measurement being from
the requested host, it might be from a “nearby” node on the overlay network.
Also, the measurement process may contain some inaccuracies due to changing
paths in the Internet, inherent inaccuracies in the measurement process, conges-
tion, etc. The accuracy value tries to quantify the “nearness” of the host to the
measurement node as well as the inaccuracies in the measurement process.
We do not address the question of who is allowed to make queries. In the spirit
of cooperatives, one might imagine that only participants are allowed access
to the community information. This sort of access control (or any other) is
orthogonal to the base system design.
2.2
The Architecture
Architecturally, the system consists of two overlay networks, a logical overlay
formed as a Distributed Hash Table (DHT), (e.g. Chord [8], SCAN [4], Pas-
try [5] and Tapestry [9]), and a measurement overlay (m-overlay) based on the
AS level graph of the Internet. Each node in M-Coop belongs to both overlays.
The DHT is used for storing and looking up information about the nodes that
compose the overlays. Nodes connected by edges in the m-overlay form measure-
ment peers. The key of a node in the DHT is generated by its neighbours during
the join process while the key of a node in the m-overlay is its IP address. An
important issue is the construction of the m-overlay graph to support accurate
measurements without undue overhead. Measurements are taken by the end-
points of the edge in two ways, actively, by sending probe packets to each other,
and passively, by monitoring the system traﬃc that traverses this edge of the
graph.
For scalability, each node on the network is assigned an “area of responsi-
bility” (AOR), deﬁning a set of addresses for which it can answer queries. The
AOR is assigned when the node joins the network. It changes as other nodes join
and leave the network.
A query to the system, (IP1, IP2, measurement type) is ﬁrst routed through
the DHT to the node which has IP1 in its AOR. We denote this node R(IP1)
to indicate it is responsible for IP1. If the measurement information is available,
node R(IP1) will reply, along with the available accuracy and trust information.
If the data is not available, it may trigger a measurement or a new query. This

---

## Page 4

Network Measurement as a Cooperative Enterprise
169
new query, called a composition query, will traverse a path on the m-overlay
from R(IP1) to R(IP2) collecting metric data about the links traversed. This
data is then returned as the reply to the composition query and ﬁnally as a reply
to the original query.
A node on the system thus consists of three modules:

1. Routing. This module is responsible for maintaining the overlays, commu-
nicating with the peer nodes and routing queries and responses through the
overlays.
2. Measurement. This module performs measurements between itself and its
measurement peers, veriﬁes the measurements obtained by other nodes and
responds to queries about the node’s AOR.
3. Trust. This module maintains the trust database, performs trust metric
calculations and responds to trust queries.
The next section describes the architecture in more detail.
3
Architecture Details and Operation
3.1
Routing
There are many ongoing research eﬀorts trying to develop better methods of
locating data in a distributed system. These eﬀorts are directed towards scal-
ability, reliability, graceful degradation under dynamic conditions, and eﬃcient
search [4, 5, 8, 9]. Based on this, we assume that a method of locating data in
the DHT is available to us and we will use the generic term routing to imply
that a packet is using one of the above methods to reach its destination node.
The routing module is responsible for routing data queries and their responses
through the DHT overlay based on the AOR of the nodes. Composition queries
are routed in the m-overlay. Ideally, the routing on this overlay is the same as
the network-layer routing, but this requires knowledge of BGP policies of each
AS. To approximate this in the application-layer, a heuristic such as shortest-AS
path may be used.
3.2
Measurement
Measurements are taken from the node to its measurement peers. The set of
measurement peers is identiﬁed when the node joins the system and is updated
as needed when peer nodes join or depart. The set of measurement peers is se-
lected to map onto the underlying network topology in the following fashion. If a
node in the overlay network is the only one in its autonomous system (AS), then
it has one edge for each AS-level neighbor in the underlying network. If there are
multiple nodes in the same AS, a clustering protocol is run when new nodes join
or depart to ensure that there is only one node which has edges to the AS level
neighbors. The remaining nodes are organized to provide redundancy and intra-
AS measurement. The AS-level edges join this node to the m-overlay network

---

## Page 5

170
Sridhar Srinivasan and Ellen Zegura
0.0
0.5
1.0
1.5
2.0
2.5
3.0
0.0
0.2
0.4
0.6
0.8
1.0
((a,c)+(c,b))/(a,b)
CDF
UW3
UW4b
Fig. 1. CDF of composition of AS-level paths
nodes responsible for the IP addresses in the AS level neighbors. The intent is
that the measurements obtained by the M-coop system will then better approx-
imate the values seen by a packet on the underlying network. The measurement
data obtained is stored with meta-information such as time of measurement,
whether it is composed from other measurement data, whether it is cached, the
accuracy, trust value, etc. Measurements may be taken periodically, triggered by
options in a data query, and/or determined passively by examining packets in
the system.
We performed some simple experiments to verify that such an AS-level com-
position of paths gives reasonable estimates of the original query between two
IP addresses. We used data from the UW-3 and UW-4b datasets used for the
Detour study[6]. These are end-to-end traceroute measurements collected from
public traceroute servers. Details of the data collection method can be found in
the referenced study. For each dataset, we calculate the average latency between
two nodes a and b and also compute the AS-level path between them. The com-
position path is computed by ﬁnding a node c which lies on the AS-level path
from a to b, and calculating (a,c)+(c,b) for all possible such c’s. This simulates
our scheme in which the composition packets are forwarded at the AS-level from
the source AOR to the destination AOR. The results are shown in Fig. 1 as a
CDF of the ratio ((a,c)+(c,b))/(a,b). It can be observed that most of the com-
position values are within a factor of two of the actual path value. These results
are similar to those obtained by IDMaps [1] and show that forwarding at the
relatively coarse level of ASes can give reasonable estimates.
3.3
Trust
Measurements are of two types, data and veriﬁcation. Data measurements are
performed between a node and its measurement peers and these are reported
in response to queries. Veriﬁcation measurements are performed to verify the

---

## Page 6

Network Measurement as a Cooperative Enterprise
171
b
c
d
f
e
a
Fig. 2. Veriﬁcation
responses of the peer nodes. These measurements are part of the process by
which the trust module calculates the trust value to be assigned to the peer
nodes.
The trust value of a node in the context of a particular link is a measure
of its measurement reliability in the past. We assume that past behaviour is an
indication of future actions, i.e., if a node has been providing reasonably accurate
responses about a link in the past, it is likely to provide a reasonably accurate
response when queried now. We will use the term “trust of a node” to implicitly
mean the trust of a node with respect to a speciﬁc link.
The node checks the operation of its peers in the m-overlay using a veriﬁcation
process, which is run regularly. The results of this process are used to calculate
the trust value of a node. This trust factors in the time since the last veriﬁcation
process was run, as well as reports from other nodes on the trust of the node in
question. In the system, a node reports on the trust of its immediate neighbours.
It also gathers information about nodes two and three hops away, which is then
reported only if a query about that node’s trust passes through.
We now explain the veriﬁcation process in more detail. In Fig. 2, node a
responds to trust queries about the nodes b, c and d. Periodically, a runs the
veriﬁcation process on the nodes b, c and d. The veriﬁcation process is in two
parts: a queries b about the path from b to e, which is b’s neighbour; a also
performs a measurement from itself to e directly. Since a knows the value of the
measurement of the a-b link, it can estimate the b-e link and compare it with
the value reported by b. The two values thus obtained are then used to update
the trust of node b.

---

## Page 7

172
Sridhar Srinivasan and Ellen Zegura
It is important to note that the b-e link measurement estimated by a has
higher chances of being inaccurate and so a single value which doesn’t tally with
the reported value may not be enough to aﬀect the trust value of the node b.
This veriﬁcation mechanism requires that the point-to-point measurements
made by the node be independent of the trustworthiness of the other end point,
and hence reliable. This can be partly achieved if at least some of the measure-
ments can be performed without the cooperation of the other node (perhaps
at the operating system level). For example, a ping query to measure latency
does not reach the application layer of the other end-point and hence is harder
to aﬀect maliciously. Given this assumption, a can verify the functioning of b
by making a direct measurement to e to estimate the b-e link. Since b is in
a’s neighbouring AS and similarly, e in b’s, it is reasonable to suppose that the
direct measurement by a will produce a good estimate. Another solution could
be to have a measure directly to other nodes in b’s AS, if they exist. These solu-
tions partly address the problem of veriﬁcation, but do not provide a completely
reliable method of verifying a neighboring node’s measurements.
Trust Computation Procedure The veriﬁcation process is used as a building
block to compute the trust value of a response to a query using a trust com-
putation procedure. When a query is answered by a node, the querying node
has no knowledge of the reliability of the reported result. To determine the
trustworthiness of the result, the querying node must ask the neighbours of the
responding node about its trustworthiness. To ﬁnd out the trustworthiness of
the neighbours, the node must query their neighbours, and so on. This recursive
chain is terminated at the querying node itself. Eﬀectively, the node is building a
chain of trust from itself to the responding node. This chain follows the AS-level
path from the querying node to the neighbours of the responding node on the
m-overlay. Each node on the chain reports the trust it has on the node preceding
it (which is its neighbour).
The actual procedure is as follows. A querying node, on receiving a response
to its query, can decide to calculate the trustworthiness of the response. It looks
up the node information of the responding node on the DHT and gets the list of
neighbours. It then selects a set of nodes (potentially all) to send the trust query
to. Each query is routed through the m-overlay to its destination (a neighbour of
the responding node). The destination node replies with the trust it has on the
responding node. As this reply makes its way back to the querying node, each
node along the path adds the trust it has on the node from which it received the
reply. At the querying node, it applies a function all the information to obtain
the trust value of the responding node.
3.4
AOR Assignment and Overlay Construction
The AOR assignment for a node takes place when the node joins the overlay net-
work. The startup procedure for nodes joining the network assumes two things:

---

## Page 8

Network Measurement as a Cooperative Enterprise
173
a node is capable of ﬁnding its AS number;1 and a node knows the IP address
of an existing node on the overlay. (The case of the ﬁrst node in the overlay is
discussed separately.) A further assumption that is useful, but not required, is
that a node has access to the list of ASes connected to its AS.2 The creation
and maintenance of the measurement overlay is performed by the following al-
gorithms.
– Join. This is executed by a node joining the measurement overlay.
– Failure recovery. This is executed by the neighbours of a node that has
failed.
– Maintenance. This is executed with low frequency to redistribute the AORs
across the peers.
The invariant that these algorithms maintain, is that every AS is in the AOR
of some node. When a new node joins the overlay, it may be assigned a part of
the AS space as its AOR by splitting oﬀportions of a small set of pre-existing
nodes’ AORs. When a node leaves the overlay, its AOR is merged into the AOR
of a neighbour of that node, thus maintaining the invariant. In the following
discussion, we restrict our attention to joins and departures in the m-overlay.
We do not discuss the DHT join and leave algorithms as they are handled by
the DHT schemes.
Join Procedure In Fig. 3, node n is a new node that is attempting to join the
network. On startup, the node n contacts a node s that is already a member of
M-Coop. The address of the node s is assumed to be known to node n through
some out-of-band mechanism such as from a website or an ftp server. In its initial
message, n advertises its entire AS as its AOR. Since the overlay already exists,
some node b already has this AS in its AOR. Node s queries the DHT to ﬁnd
that node b and returns its address to n. Node n then contacts b with the same
advertisement. There are two cases: b and n are in diﬀerent ASes, or they are
in the same AS. We shall consider the cases separately. When the nodes b and
n are not in the same AS, n performs the following procedure:
– n uses its list of neighbouring ASes to claim them from the AOR of b. If the
ASes appear in b’s list of neighbouring ASes as well, then they are assigned
to n probabilistically.
– After the basic AOR for n is created, n looks up the nodes responsible for
the ASes that are in its neighbour list but not in its AOR or in the AOR
of b. These nodes are sent peer requests by n to make them peers in the
m-overlay.
– If these nodes have b as a peer, they replace b by n, otherwise they add n
as a peer.
– n also peers with b.
1 A repository of AS information is available at <www.arin.net/whois>.
2 NLANR maintains such a list at <http://moat.nlanr.net/AS/>.

---

## Page 9

174
Sridhar Srinivasan and Ellen Zegura
b
n
a
d
c
s
ASes
b
AOR for
Fig. 3. Overlay before node n joins the network
– n runs the maintenance procedure to resize its AOR and potentially ﬁnd
new peers.
At this point, n is ready to begin making measurements with its peers. A key
is generated for n by its peers and n uses this key to join the DHT and publish
its peer and AOR information on the DHT. This marks the end of the join
algorithm for n.
When the nodes b and n are in the same AS, n joins the cluster of nodes under
b for that AS. The process is similar to that of the previous case except that the
AORs contain IP preﬁxes, and the splitting of AORs is based on partitioning
the set of IP addresses assigned to each node. Also, the node information of n
is published in the intra-AS DHT.
When n is the ﬁrst node in the overlay, it assigns all AS numbers to its AOR
and waits for further nodes to join the network.
Note that the number of nodes that can join the measurement overlay at the
intra-AS level is limited. This is to ensure that the AORs remain of reasonable
size. Any nodes that join after this limit is reached do not participate in the
measurement overlay but remain connected in the DHT. The information pub-
lished in the DHT is soft state and must be refreshed periodically using the node
key generated during the join process.
Failure Recovery The main elements for the failure recovery algorithm, namely
the node information and the node key, are put in place during the join process.
When a node fails or leaves the M-Coop network, it is the responsibility of its

---

## Page 10

Network Measurement as a Cooperative Enterprise
175
neighbours in the m-overlay to recover from the departure. The periodic mea-
surements taken between the peers in this overlay serve as a heartbeat mech-
anism and enable the detection of a departure. When a departure is detected,
each neighbour of the missing node looks up the missing node information by
querying the DHT using the missing node’s node key. The neighbour also looks
up the node information of the other neighbours to ﬁnd the neighbour with the
smallest AOR. This node incorporates the departed node’s AOR into its own
AOR, then peers with those nodes from the departed node’s peers which are
not already peers, runs the maintenance algorithm and then updates the node
information published on the DHT.
Maintenance The objective of the maintenance procedure is to distribute the
AORs across the peers so that each AS belongs in the AOR of the node closest
to it. The maintenance algorithm consists of contacting each of the peers in the
m-overlay in turn to negotiate the transfer of ASes based on the contents of the
lists of neighbouring ASes. ASes are transferred only if necessary, i.e., if they are
in a node’s AOR but belong in the peer’s neighbour list. This is to minimize the
updates of the node information published in the DHT.
We are currently in the process of evaluating these algorithms using simula-
tions.
4
Related Work
There have been several prior projects that concern measurement infrastructures
(e.g., IDMaps [1], NIMI [3], SPAND [7] and Remos [2]). Our work is most closely
to the IDMaps project, so we limit our related work discussion to that project.
IDMaps [1] is a proposal for a global infrastructure for gathering and dis-
tributing Internet host distance information. The goal of the IDMaps project is
to provide distance metrics between two hosts on the Internet in an accurate
and timely manner. The IDMaps architecture consists of a network of Tracers,
which gather Internet distance information, and Clients, which use this infor-
mation to estimate distances between hosts. The distance estimate between any
two IP addresses is calculated from the Address Preﬁxes (APs) that contain
the IP addresses, serving a similar function to our Areas of Responsibility. The
calculation is performed by ﬁnding the APs to which the IP addresses belong,
locating the systems or “boxes” to which the APs are closest and then run-
ning a spanning-tree algorithm to to ﬁnd the shortest distance between the two
boxes. This calculation requires that a substantial portion of the box connection
topology must be maintained.
The actual box-box topology can be achieved in two ways, the Hop-by-Hop
(HbH) and the End-to-End (E2E) models. In the HbH model, every transit
backbone router is modeled as a box and the calculation is the sum of inter-AS
and intra-AS paths from one AP to the other. The distances on these paths are
calculated by the Tracers probing the routers at random intervals. In the E2E

---

## Page 11

176
Sridhar Srinivasan and Ellen Zegura
model, the Tracers are the boxes and the distances are calculated as the sum of
the AP to box distances and the distance between the two boxes.
Our goals for the M-coop system are to provide a generalized metric collec-
tion and distribution infrastructure that is simple and rapid to deploy on a large
scale. The information returned by the system also contains some indication of
how reliable (in terms of accuracy and trustworthiness) the information is. Our
approach to the problem is similar to the HbH model proposed in the IDMaps
architecture but our method of distance estimation and information dissemina-
tion is fundamentally diﬀerent. We intend to have a little more complexity at the
nodes gathering the distance information to avoid the problem of maintaining a
global view of the box topology. We also try to address the deployment of the
system in the Internet by means of our peer-to-peer design.
5
Open Questions
We have sketched out the design and architecture of an Internet-wide measure-
ment service. Some of the challenges that we are currently working on include:
– Participation. Will such a scheme generate enough participation to achieve
critical mass, i.e., a level where the query results are a good approximation
of the actual values? Related to this issue is the broader question of what
will motivate people to participate in peer-to-peer systems. Will people even-
tually subscribe to peer-to-peer systems, like they subscribe to magazines?
Or will they contribute their host to peer-to-peer systems, a la charitable
donations? What are the best analogies to the peer-to-peer experience?
– Generality. Can a single system be used to satisfy the diﬀerent measure-
ment requirements of the diverse applications which might want to take
advantage of this service? Can such a system be used as a common measure-
ment service for peer-to-peer systems to use for optimizing their operation?
– Usefulness of Parameters. Can trust and accuracy be made useful to
applications?
– Composition. Can composition of measurements from intermediate hops
give meaningful values for the actual measurement between two IP ad-
dresses?
– Collusion. Collusion is a problem in trust systems. Can the amount of
collusion required to subvert the system be made large enough to deter
attacks?
6
Acknowledgments
The authors would like to acknowledge the helpful suggestions of the anonymous
reviewers. We would also like to thank Andy Collins and Stefan Savage for
providing the datasets for the experiments.

---

## Page 12

Network Measurement as a Cooperative Enterprise
177
References
[1] P. Francis, S. Jamin, C. Jin, Y. Jin, D. Raz, Y. Shavitt and L. Zhang. IDMaps:
A global Internet host distance estimation service. In IEEE/ACM Trans. on Net-
working, October 2001.
[2] N. Miller and P. Steenkiste. Collecting network status information for network-
aware applications. In Proceedings of Infocom’00, Tel Aviv, March 2000.
[3] V. Paxson, J. Mahdavi, A. Adams, and M. Mathis. An architecture for large-scale
Internet measurement. In IEEE Communications, volume 36, pages 48–54, August
1998.
[4] S. Ratnasamy, P. Francis, M. Handley, R. Karp, and S. Shenker. A scalable content-
addressable network. In Proceedings of the ACM SIGCOMM ’01, San Diego, CA,
September 2001.
[5] A. Rowstron and P. Druschel. Pastry: Scalable, distributed object location and
routing for large-scale peer-to-peer systems. In Middleware, 2001.
[6] S. Savage, A. Collins, E. Hoﬀman, J. Snell, and T. Anderson. The end-to-end eﬀects
of Internet path selection. In Proceedings of the ACM SIGCOMM’99, Boston, MA,
September 1999.
[7] S. Seshan, M. Stemm, and R. H. Katz. A network measurement architecture for
adaptive applications. In Proceedings of Infocom ’00, Tel Aviv, March 2000.
[8] I. Stoica, R. Morris, D. Karger, F. Kaashoek, and H. Balakrishnan.
Chord: A
peer-to-peer lookup service for Internet applications. In Proceedings of the ACM
SIGCOMM ’01, San Diego, CA, September 2001.
[9] B. Zhao, J. Kubiatowicz, and A. Joseph. Tapestry: An infrastructure for fault-
tolerant wide-area location and routing. UCB Tech. Report UCB/CSD-01-1141.
