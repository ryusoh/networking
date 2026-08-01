# ch35-dynamic-replica-placement-for-scalable-content-delivery

---

## Page 1

Dynamic Replica Placement for Scalable
Content Delivery
Yan Chen, Randy H. Katz, and John D. Kubiatowicz
Computer Science Division,
University of California, Berkeley
{yanchen, randy, kubitron}@cs.berkeley.edu
Abstract. In this paper, we propose the dissemination tree, a dynamic
content distribution system built on top of a peer-to-peer location ser-
vice. We present a replica placement protocol that builds the tree while
meeting QoS and server capacity constraints. The number of replicas as
well as the delay and bandwidth consumption for update propagation
are signiﬁcantly reduced. Simulation results show that the dissemination
tree has close to the optimal number of replicas, good load distribution,
small delay and bandwidth penalties for update multicast compared with
the ideal case: static replica placement on IP multicast.
1
Introduction
The eﬃcient distribution of Web content and streaming media is of growing im-
portance. The challenge is to provide content distribution to clients with good
Quality of Service (QoS) while retaining eﬃcient and balanced resource con-
sumption of the underlying infrastructure. Central to these goals is the careful
placement of data replicas and the dissemination of updates.
Previous work on replica placement involves static placement of replicas – as-
suming that clients’ distribution and access patterns are known in advance[13, 8].
These techniques ignore server capacity constraints and assume explicit knowl-
edge of the global IP network topology.
Actual Web content distribution requires dynamic or online replica place-
ment. Most current Content Distribution Networks (CDNs) use DNS-based redi-
rection to route clients’ requests [1, 4, 10, 17]. Due to the nature of centralized
location services, the CDN name server cannot aﬀord to keep records for the
locations of each replica. Thus the CDN often places many more replicas than
necessary and consumes unnecessary storage resources and update bandwidth.
For update dissemination, IP multicast has fundamental problems for In-
ternet distribution [5]. Further, there is no widely available inter-domain IP
multicast. As an alternative, Application Level Multicast (ALM) tries to build
an eﬃcient network of unicast connections and to construct data distribution
trees on top of this overlay structure [5, 2, 3, 9, 21]. Most ALM systems have
scalability problems, since they utilize a central node to maintain state for all
existing children [3, 9, 11, 2], or to handle all “join” requests [21]. Replicating the
P. Druschel, F. Kaashoek, and A. Rowstron (Eds.): IPTPS 2002, LNCS 2429, pp. 306–318, 2002.
c
⃝Springer-Verlag Berlin Heidelberg 2002

---

## Page 2

Dynamic Replica Placement for Scalable Content Delivery
307
Fig. 1. Architecture of a dissemination tree.
root is the common solution [9, 21], but this suﬀers from consistency problems
and communication overhead.
There are two crucial design issues that we try to address in this paper:

1. How to dynamically choose the number and placement of replicas while
satisfying QoS requirements and server capacity constraints.
2. How to disseminate updates to these replicas with small delay and bandwidth
consumption.
Both must be addressed without explicit knowledge of the global network topol-
ogy. Further, we would like to scale to millions of objects, clients, and servers.
To tackle these challenges, we propose a new Web content distribution sys-
tem: dissemination tree (in short, d-tree). Figure 1 illustrates a d-tree system.
There are three kinds of data in the system: sources, replicas, and caches. The
d-tree targets dynamic Web content distribution; hence there is a single source
on the Web server. A replica is a copy of source data that is stored on the overlay
server and is always kept up-to-date, while a cache is stored on clients and may
be stale. These components self-organize into a d-tree and use application-level
multicast to disseminate updates from source to replicas. Coherence of caches
is maintained dynamically through approaches such as [15]. We assume that d-
tree servers are placed in Internet Data Centers (IDC) of major ISPs with good
connectivity to the backbone. These servers form a peer-to-peer overlay network
called Tapestry [20], to ﬁnd nearby replicas for the clients. Note that Tapestry
is shared across objects, while each object for dissemination has a hierarchical
d-tree.
We make the following contributions in the paper:
– We propose novel algorithms to dynamically place close to minimum number
of replicas while meeting the clients’ QoS and servers’ capacity constraints.

---

## Page 3

308
Yan Chen, Randy H. Katz, and John D. Kubiatowicz
– We self-organize these replicas into an application-level multicast tree with
small delay and bandwidth consumption for update dissemination.
– We leverage Tapestry to improve scalability. Tapestry permits clients to
locate nearby replica servers without contacting a root; as a result, each
node in a d-tree maintains state only for its parent and direct children.
Note that all these are achieved with limited local network topology knowledge
only.
The rest of the paper is organized as follows: We formulate the replica place-
ment problem in Sec. 2 and introduce Tapestry in Sec. 3. Sec. 4 describes the
protocols for building and maintaining a d-tree. Evaluation and results are given
in Sec. 5, and ﬁnally conclusions and future work in Sec. 6.
2
Problem Formulation
There is a big design space for modeling Web replica placement as an optimiza-
tion problem and we describe it as follows. Consider a popular Web site or a
CDN hosting server, which aims to improve its performance by pushing its con-
tent to some hosting server nodes. The problem is to dynamically decide where
content is to be replicated so that some objective function is optimized under a
dynamic traﬃc pattern and set of clients’ QoS and/or resource constraints. The
objective function can either minimize clients’ QoS metrics, such as latency, loss
rate, throughput, etc., or minimize the replication cost of CDN service providers,
e.g., network bandwidth consumption, or an overall cost function if each link is
associated with a cost. For Web content delivery, the major resource consump-
tion in replication cost is the network access bandwidth at each Internet Data
Center (IDC) to the backbone network. Thus when given a Web object, the cost
is linearly proportional to the number of replicas.
As Qiu et al. tried to minimize the total response latency of all the clients’
requests with the number of replicas as constraint [13], we tackle the replica
placement problem from another angle: minimize the number of replicas when
meeting clients’ latency constraints and servers’ capacity constraints. Here we
assume that clients give reasonable latency constraints as it can be negotiated
through a service-level agreement (SLA) between clients and CDN vendors. Thus
we formulate the Web content placement problem as follows. Given a network
G with C clients and S server nodes, each client ci has its latency constraint di,
and each server sj has its load/bandwidth/storage capacity constraint lj. The
problem is to ﬁnd a smallest set of servers S′ such that the distance between
any client ci and its “parent” server sci ∈S′ is bounded by di. More formally,
ﬁnd the minimum K, such that there is a set S′ ⊂S with |S′| = K and ∀c ∈C,
∃sc ∈S′ such that distance(c, sc) ≤dc. Meanwhile, these clients C and servers
S′ self-organize into an application-level multicast tree with C as leaves and ∀
si ∈S′, its fan-out degree (i.e., number of direct children) satisﬁes f(si) ≤li.

---

## Page 4

Dynamic Replica Placement for Scalable Content Delivery
309
3598
2218
0325
B4F8
9098
4432
9598
Gateway of client
3A40
L4
L4
CE42
L1
L1
L2
L1 L1
L1
L2
Root
Replica−2
L1
Replica−1
L4
L3
L2
L1
L1
L2
L2
1212
4432
4598
4432
7598
0128
1010
Fig. 2. The Tapestry Infrastructure: Nodes route to nodes one digit at a time:
e.g. 0325 →B4F8 →9098 →7598 →4598. Objects are associated with a par-
ticular “root” node (e.g. 4598). Servers publish replicas by sending messages
toward root, leaving back-pointers (dotted arrows). Clients route directly to repli-
cas by sending messages toward root until encountering a pointer (e.g. 0325 →
B4F8 →4432).
3
Peer-to-Peer Location Services: The Tapestry
Infrastructure
Networking researchers have begun to explore decentralized peer-to-peer loca-
tion services [20, 14, 18, 16]. Such services oﬀer a distributed infrastructure for
locating objects quickly, with guaranteed success and locality. Rather than de-
pending on a single server to locate an object, a query in this model is passed
around the network until it reaches a node that knows the location of the re-
quested object. Our dissemination tree is built on top of Tapestry [20] and takes
advantage of two features: distributed location services and search with locality.
Tapestry is an IP overlay network that uses a distributed, fault-tolerant ar-
chitecture to track the location of objects in the network. In our architecture
(Figure 1), the d-tree servers (i.e., CDN edge servers) and multicast root server
(i.e., Web source server) are Tapestry nodes. Each client talks to its nearby
Tapestry node (the gateway) to send object requests. In practice, the gateway
node can be located through certain bootstrap mechanisms.
3.1
Tapestry Routing Mesh
Figure 2 shows a portion of Tapestry. Each node joins Tapestry in a distributed
fashion through nearby surrogate servers and set up neighboring links for con-
nection to other Tapestry nodes [20]. The neighboring links are shown as solid

---

## Page 5

310
Yan Chen, Randy H. Katz, and John D. Kubiatowicz
arrows. Such neighboring links provide a route from every node to every other
node; the routing process resolves the destination address one digit at a time
(e.g., ***8 =⇒**98 =⇒*598 =⇒4598, where*’s represent wildcards). This
routing scheme is based on the hashed-suﬃx routing structure originally pre-
sented by Plaxton, Rajaraman, and Richa [12].
3.2
Tapestry Distributed Location Service
Tapestry employs this infrastructure for data location. Each object is associated
with a Tapestry location root through a deterministic mapping function. This
root is for location purposes only and has nothing to do with the multicast root
server (such as the Web content server in Figure 1). To advertise an object o, the
server s storing the object sends a publish message toward the Tapestry location
root for that object, depositing location pointers in the form of <Object-ID(o),
Server-ID(s)> at each hop. These mappings are simply pointers to the server
s where o is being stored, and not a copy of the object itself. A node s that
keeps location mappings for multiple replicas keeps them sorted in the order of
distance from s.
Figure 2 shows two replicas and the Tapestry root for an object. Location
pointers are shown as dotted arrows that point back to replica servers. To locate
an object, a client sends a message toward the object’s root. When the message
encounters a pointer, it routes directly to the object. It is shown in [12] that the
average distance traveled in locating an object is proportional to the distance
from that object in terms of the number of hops traversed. In addition, it is
proved that for any node c that requests object o, Tapestry can route the request
to the asymptotically optimal node s (in terms of the shortest path network
distance) that contains a replica of o [12].
4
Dissemination Tree Protocols
4.1
Replica Placement and Tree Construction
In this section, we present an algorithm that dynamically places replicas and or-
ganizes them into an application-level multicast tree with only limited knowledge
of the network topology. This algorithm attempts to satisﬁes both client latency
and server capacity constraints. Our goal is to minimize the number of repli-
cas deployed and to self-organize the servers with replicas into a load-balanced
tree. We contrast static solutions that assume global knowledge of clients and
topology.
Dynamic Replica Placement We consider two algorithms: naive placement
and smart placement, for comparison. We describe these as procedures for a
new client c to join the tree of object o, possibly generating new replicas in the
process. Following the notations in Sec. 2, the latency constraint of c is dc and
the capacity constraint of s is ls. We deﬁne the following notations: current load

---

## Page 6

Dynamic Replica Placement for Scalable Content Delivery
311
procedure DynamicReplicaPlacement Naive(c, o)
1 c sends a “join” request to s with o through Tapestry, piggybacks the IP ad-
dresses, distoverlay(c, s′) and rcs′, for each server s′ on the path
2 if rcs > 0 then
3
if distoverlay(c, s) ≤dc then s becomes c’s parent, exit.
else
4
s pings c to get distIP(s, c)
5
if distIP (s, c) ≤dc then s becomes c’s parent, exit.
end
end
6 From the closest one to c, foreach server s′ on the path do
search for t that satisﬁes rct > 0 and distoverlay(t, c) ≤dc
end
7 s puts a replica on t and becomes its parent, t becomes c’s parent
8 t publishes o in Tapestry, exit.
9 foreach path server si whose rcsi > 0 do si pings c to get distIP (si, c)
10 c chooses t which has the smallest distIP (t, c) ≤dc
11 Same as steps 7 and 8.
Algorithm 1: Dynamic Replica Placement (Naive)
of s: lcs; remaining capacity of s: rcs = ls - lcs; overlay distance on Tapestry:
distoverlay and IP distance: distIP . As periodically there are “refresh” messages
going from a child server to its parent for soft state management, we assume that
each parent server knows the current remaining capacity of each child server.
Naive placement: Client c sends the request for object o through Tapestry
and is routed to server s. For the naive approach, s only considers itself to be
c’s parent server, i.e., whether rcs > 0 and distIP (s, c) ≤dc are satisﬁed. If
unsatisﬁed, it will try to place a replica on the overlay path server that is as
close to c as possible (see Algorithm 1). Note that given the limited search, the
naive approach may not always ﬁnd the suitable parent server for every client,
even when such a parent exists.
Smart placement: Essentially, the smart approach (Algorithm 2) attempts to
optimize the “best” parent selection for c in a larger set: including s, its parent,
siblings and its other server children. Among qualiﬁed candidates, c chooses the
one with the lightest load as parent. If none of them meet the client’s latency
and server’s load constraints, s will try to place a replica on the overlay path
server that is as far from c as possible. We call it lazy placement. All these steps
aim to distribute the load with the greedy algorithm to reduce the number of
replicas needed while satisfying the constraints.
Note that we try to use the overlay latency to estimate the IP latency in order
to save “ping” messages. Here the client can start a daemon program provided
by its CDN service provider when launching the browser so that it can actively

---

## Page 7

312
Yan Chen, Randy H. Katz, and John D. Kubiatowicz
procedure DynamicReplicaPlacement Smart(c, o)
1 c sends a “join” request to s with o through Tapestry
2 s sends c’s IP address to its parent p and other server children sc if rcsc > 0
3 p forwards the request to s’s siblings ss if rcss > 0
4 s, p, ss and sc send c its rc if its rc > 0
5 if c gets any reply then
6
c chooses the parent t which has the biggest rc and distIP(t, c) ≤dc, exit.
else
7
c sends a message to s through Tapestry again and the message piggybacks
the IP addresses, distoverlay(c, s′) and rcs′ for each server s′ on the path
8
From the closest one to s, foreach server s′ on the path do
search for t that satisﬁes rct > 0 and distoverlay(t, c) ≤dc
end
9
Same as steps 7, 8 and 9 in procedure DynamicReplicaPlacement Naive.
10
c chooses t which has the biggest distIP (t, c) ≤dc
11
Same as step 11 in procedure DynamicReplicaPlacement Naive.
end
Algorithm 2: Dynamic Replica Placement (Smart)
participate in the protocols. The locality property of Tapestry naturally leads to
the locality of d-tree, i.e., the parent and children tend to be close to each other
in terms of the number of IP hops between them. This provides good delay and
multicast bandwidth consumption when disseminating updates, as measured in
Sec. 5. The tradeoﬀbetween the smart and naive approaches is that the smart
one consumes more “join” traﬃc to construct a tree with fewer replicas, covering
more clients, with less delay and multicast bandwidth consumption. We evaluate
this tradeoﬀin Sec. 5.
Static Replica Placement The replica placement methods given above are
unlikely to be optimal in terms of the number of replicas deployed, since clients
are added sequentially and with limited knowledge of the network topology. In
the static approach, the root server has complete knowledge of the network and
places replicas after getting all the requests from the clients. In this scheme,
updates are disseminated through IP multicast. Static placement is not very
realistic, but may provide better performance since it exploits knowledge of the
client distribution and global network topology.
The problem formulated in Sec. 2 can be converted to a special case of the
capacitated facility location problem [7] deﬁned as follows. Given a set of loca-
tions i at which facilities may be built, building a facility at location i incurs
a cost of fi. Each client j must be assigned to one facility, incurring a cost of
djcij where dj denotes the demand of the node j, and cij denotes the distance
between i and j. Each facility can serve at most li clients. The objective is to
ﬁnd the number of facilities and their locations yielding the minimum total cost.

---

## Page 8

Dynamic Replica Placement for Scalable Content Delivery
313
To map the facility location problem to ours, we set fi always 1, and set
cij 0 if location i can cover client j or ∞otherwise. The best approximation
algorithm known today uses the primal-dual schema and Lagrangian relaxation
to achieve a guaranteed factor of 4 [7]. However, this algorithm is too complicated
for practical use. Instead, we designed a greedy algorithm that has a logarithmic
approximation ratio.
Besides the previous notations, we deﬁne the following variables: set of cov-
ered clients by s: Cs, Cs ⊆C and ∀c ∈Cs, distIP (c, s) ≤dc; set of possible
server parents for client c: Sc, Sc ⊆S and ∀s ∈Sc, distIP (c, s) ≤dc.
procedure ReplicaPlacement Greedy DistLoadBalancing(C, S)
input
: Set of clients to be covered: C, total set of servers: S
output : Set of servers chosen for replica placement: S′
while C is not empty do
Choose s ∈S which has the largest value of min(cardinality |Cs|, remaining
capacity rcs)
S′ = S′ 
{s}
S = S - {s}
if |Cs| ≤rcs then C = C - Cs
else
Sort each element c ∈Cs in increasing order of |Sc|
Choose the ﬁrst rcs clients in Cs as CsChosen
C = C - CsChosen
end
recompute Sc for ∀c ∈C
end
return S′.
A
S
Algorithm 3: Static Replica Placement with Distributed Load Balancing
We consider two types of static replica placement: with only overlay path
topology vs. with global IP topology. For the former, to each client c, the root
only knows the servers on the Tapestry path from c to root which can cover that
client (in IP distance). On the other hand, the latter assumes the knowledge of
global IP topology and gives close-to-optimal bound on the number of replicas.
4.2
Soft State Tree Maintenance
The liveness of the tree is maintained using a soft-state mechanism. Periodically,
we send “heartbeat” messages from the root down to each member. We assume
that all the nodes are loosely synchronized through the Network Time Protocol
(NTP) [6]. Thus if any member (except the root) gets the message within a
certain threshold, it will know that it is still alive on the tree. Otherwise it will
time out and start rejoining the tree. Meanwhile, each member will periodically

---

## Page 9

314
Yan Chen, Randy H. Katz, and John D. Kubiatowicz
send out a “refresh” message to its parent. If the parent does not get the “refresh”
message within a certain threshold, it will kick out the child’s entry.
5
Evaluation
In this section, we evaluate the performance of our d-tree algorithms. We use
the GT-ITM transit-stub model to generate ﬁve 5000-node topologies [19]. The
results are averaged over the experiments on the ﬁve topologies. A packet-level,
priority-queue based event manager is implemented to simulate the network
latency.
We utilize two strategies for placing d-tree servers. One selects all d-tree
servers at random (labeled random d-tree). The other preferentially chooses
transit and gateway nodes (labeled backbone d-tree). This approach mimics the
strategy of placing d-tree servers strategically in the network.
We couple the server placement with four diﬀerent replica placement tech-
niques: overlay dynamic naive placement (od naive), overlay dynamic smart
placement (od smart), overlay static placement (overlay s), and static placement
on IP network (IP s). 500 nodes are chosen to be d-tree servers with either “ran-
dom” or “backbone” approach. The rest of nodes are clients and join the d-tree
in a random order. We randomly choose one non-transit d-tree server to be the
multicast source and set as 50KB the size of data to be replicated. Further, we
assume the latency constraint is 50ms and the load capacity is 200 clients/server.
In the following, we consider three metrics:
– Quality of Replica Placement: Includes number of deployed replicas and
degree of load distribution, measured by the ratio of the standard deviation
vs. the mean of the number of client children for each replica server. A smaller
ratio implies better load distribution.
– Multicast performance: We measure the relative delay penalty (RDP)
and the bandwidth consumption which is computed by summing the number
of bytes multiplied by the transmission time over every link in the network.
– Tree construction traﬃc: We count both the number of application-level
messages sent and the bandwidth consumption for constructing the d-tree.
Figure 3 shows the number of replicas placed and the load distribution on
these servers. Od smart approach uses only about 30% to 60% of the servers
used by od naive, is even better than overlay s, and is very close to the optimal
case: IP s. Also note that od smart has better load distribution than od naive
and overlay s, close to IP s for both random and backbone d-tree.
In Figure 4, od smart has better RDP than od naive, and 85% of od smart
RDPs between any member server and the root pairs are within 4. Figure 5
contrasts the bandwidth consumption of various d-tree construction techniques
with optimal IP placement. The results are very encouraging: the bandwidth
consumption of od smart is quite close to the optimal IP s and is much less than
that of od naive.

---

## Page 10

Dynamic Replica Placement for Scalable Content Delivery
315
Fig. 3. Number of replicas deployed (top) and load distribution on selected
servers (bottom) (500 d-tree servers).
The performance above is achieved at the cost of d-tree construction (Figure
6). However, for both random and backbone d-tree, od smart approach produces
less than three times of the messages of od naive and less than six times of that
for optimal case: IP s. Meanwhile, od naive uses almost the same amount of
bandwidth as IP s while od smart uses about three to ﬁve times that of IP s.
In short, the smart dynamic replica placement has a close-to-optimal number
of replicas, better load distribution, and less delay and multicast bandwidth
consumption than the naive approach, at the price of three to ﬁve times as much
tree construction traﬃc. Usually, tree reconstruction is a much less frequent event
than Web data access and update. Further, its performance is quite close to the
ideal case: static placement on IP multicast. Hence, the “smart approach” is
more advantageous.
Due to the limited number and/or distribution of servers, there may exist
some clients who cannot be covered when facing the QoS and capacity require-
ments. In this case, our algorithm can provide hints as where to place more
servers. And the experiments show that the naive scheme has many more un-
covered clients than the smart one, due to the nature of its unbalanced load.

---

## Page 11

316
Yan Chen, Randy H. Katz, and John D. Kubiatowicz
0
0.1
0.2
0.3
0.4
0.5
0.6
0.7
0.8
0.9
1
0
1
2
3
4
5
6
7
Cumulative Percentage of Source to Member pairs
RDP
overlay_naive, 500 random servers
overlay_smart, 500 random servers
overlay_naive, 500 backbone servers
overlay_smart, 500 backbone servers
Fig. 4. Cumulative distribution of RDP with various approaches (500
d-tree servers).
Fig. 5. Bandwidth consumption when multicast 1MB update data (500
d-tree servers).
6
Conclusions and Future Work
In this paper, we explore techniques for building the dissemination tree, a dy-
namic content distribution network. First, we propose and compare several
replica placement algorithms which reduce the number of replicas deployed and
self-organize them into a balanced dissemination tree. Second, we use Tapestry, a
peer-to-peer location service, for better scalability and locality. In the future, we
would like to continue evaluation with more diverse topologies and workloads,
add dynamic replica deletion to d-tree, and investigate how to build a better
CDN with other peer-to-peer techniques.

---

## Page 12

Dynamic Replica Placement for Scalable Content Delivery
317
Fig. 6. Number of application-level messages (top) and total bandwidth
consumed (bottom) for d-tree construction (500 d-tree servers).
7
Acknowledgments
We graciously acknowledge sponsorship and grants from DARPA (grant N66061-
99-2-8913), California Micro Grant #01-042, Ericsson, Nokia, Siemens, Sprint,
NTTDoCoMo and HRL laboratories. We thank Hao Chen, Matthew Caesar and
Chen-nee Chuah for reviewing the draft of the paper and thank the anonymous
reviewers for their valuable suggestions.
References
[1] Akamai Technologies Inc. <http://www.akamai.com>.
[2] Y. Chawathe, S. McCanne, and E. Brewer. RMX: Reliable multicast for hetero-
geneous networks. In Proceedings of IEEE INFOCOM, 2000.
[3] Y. Chu, S. Rao, and H. Zhang. A case for end system multicast. In Proceedings
of ACM SIGMETRICS, June 2000.
[4] Digital Island Inc. <http://www.digitalisland.com>.
[5] P. Francis.
Yoid: Your own Internet distribution.
Technical report, ACIRI,
<http://www.aciri.org/yoid>, April, 2000.
[6] J. D. Guyton and M. F. Schwartz. Experiences with a survey tool for discovering
network time protocol servers. In Proc. of USENIX, 1994.
[7] K. Jain and V. Varirani. Approximation algorithms for metric facility location
and k-median problems using the primal-dual schema and lagrangian relaxation.
In Proc. of FOCS, 1999.

---

## Page 13

318
Yan Chen, Randy H. Katz, and John D. Kubiatowicz
[8] S. Jamin, C. Jin, A. Kurc, D. Raz, and Y. Shavitt. Constrained mirror placement
on the Internet. In Proceedings of IEEE Infocom, 2001.
[9] J. Jannotti et al. Overcast: Reliable multicasting with an overlay network. In
Proceedings of OSDI, 2000.
[10] Mirror Image Internet Inc. <http://www.mirror-image.com>.
[11] D. Pendarakis, S. Shi, D. Verma, and M. Waldvogel. ALMI: An application level
multicast infrastructure. In Proceedings of 3rd USITS, 2001.
[12] C. G. Plaxton, R. Rajaraman, and A. W. Richa.
Accessing nearby copies of
replicated objects in a distributed environment. In Proc. of the SCP SPAA, 1997.
[13] L. Qiu, V. N. Padmanabhan, and G. Voelker. On the placement of Web server
replicas. In Proceedings of IEEE Infocom, 2001.
[14] S. Ratnasamy, P. Francis, M. Handley, R. Karp, and S. Shenker.
A scalable
content-addressable network. In Proceedings of ACM SIGCOMM, 2001.
[15] P. Rodriguez and S. Sibal. SPREAD: Scaleable platform for reliable and eﬃcient
automated distribution. In Proceedings of WWW, 2000.
[16] A. Rowstron and P. Druschel. Pastry: Scalable, distributed object location and
routing for large-scale peer-to-peer systems. In Proc. of Middleware 2001.
[17] Speedera Inc. <http://www.speedera.com>.
[18] I. Stoica et al. Chord: A scalable peer-to-peer lookup service for Internet appli-
cations. In Proceedings of ACM SIGCOMM, 2001.
[19] E. Zegura, K. Calvert, and S. Bhattacharjee. How to model an Internetwork. In
Proceedings of IEEE INFOCOM, 1996.
[20] B. Y. Zhao, J. Kubiatowicz, and A. Joseph. Tapestry: An infrastructure for fault-
tolerant wide-area location and routing. UCB Tech. Report UCB/CSD-01-1141.
[21] S. Q. Zhuang et al. Bayeux: An architecture for scalable and fault-tolerant wide-
area data dissemination. In Proceedings of ACM NOSSDAV, 2001.
