# ch28-locating-data-in-small-world-peer-to-peer-scientific-collaborations

---

## Page 1

Locating Data in (Small-World?) Peer-to-Peer
Scientiﬁc Collaborations
Adriana Iamnitchi1, Matei Ripeanu1, and Ian Foster1,2
1 Department of Computer Science, The University of Chicago
1100 E. 58th Street, Chicago, IL 60637, USA
{anda, matei, foster}@cs.uchicago.edu
2 Mathematics and Computer Science Division, Argonne National Laboratory
Argonne, IL 60439, USA
Abstract. Data-sharing scientiﬁc collaborations have particular char-
acteristics, potentially diﬀerent from the current peer-to-peer environ-
ments. In this paper we advocate the beneﬁts of exploiting emergent pat-
terns in self-conﬁguring networks specialized for scientiﬁc data-sharing
collaborations. We speculate that a peer-to-peer scientiﬁc collaboration
network will exhibit small-world topology, as do a large number of social
networks for which the same pattern has been documented. We pro-
pose a solution for locating data in decentralized, scientiﬁc, data-sharing
environments that exploits the small-worlds topology. The research chal-
lenge we raise is: what protocols should be used to allow a self-conﬁguring
peer-to-peer network to form small worlds similar to the way in which
the humans that use the network do in their social interactions?
1
Introduction
Locating ﬁles based on their names is an essential mechanism for large-scale data
sharing collaborations. A peer-to-peer (P2P) approach is preferable in many
cases due to its ability to operate robustly in dynamic environments.
Existing P2P location mechanisms focus on speciﬁc data sharing environ-
ments and, therefore, on speciﬁc requirements: in Gnutella [1], the emphasis is
on easy sharing and fast ﬁle retrieval, with no guarantees that ﬁles will always be
located. In Freenet [2], the emphasis is on ensuring anonymity. In contrast, sys-
tems such as CAN [3], Chord [4] and Tapestry [5] guarantee that ﬁles are always
located, while accepting increased overhead for ﬁle insertion and removal.
Data usage in scientiﬁc communities is diﬀerent than in, for example, music
sharing environments: data usage often leads to creation of new ﬁles, inserting a
new dimension of dynamism into an already dynamic system. Anonymity is not
typically a requirement, being generally undesirable for security and monitoring
reasons.
Among the scientiﬁc domains that have expressed interest in building data-
sharing communities are physics (e.g., GriPhyN project [6]), astronomy (Sloan
Digital Sky Survey project [7]) and genomics [8]. The Large Hadron Collider
(LHC) experiment at CERN is a proof of the physicists’ interest and pressing
P. Druschel, F. Kaashoek, and A. Rowstron (Eds.): IPTPS 2002, LNCS 2429, pp. 232–241, 2002.
c
⃝Springer-Verlag Berlin Heidelberg 2002

---

## Page 2

Locating Data in (Small-World?) Peer-to-Peer Scientiﬁc Collaborations
233
need for large-scale data-sharing solutions. Starting 2005, the LHC will produce
Petabytes of raw data a year that needs to be pre-processed, stored, and analyzed
by teams comprising 1000s of physicists around the world. In this process, even
more derived data will be produced. 100s of millions of ﬁles will need to be
managed, and storage at 100s of institutions will be involved.
In this paper we advocate the beneﬁts of exploiting emergent patterns in self-
conﬁguring networks specialized for scientiﬁc data-sharing collaborations. We
speculate that a P2P scientiﬁc collaboration network will exhibit small-world
topology, as do a large number of social networks for which the same pattern
has been documented.
We sustain our intuition by observing the characteristics of scientiﬁc data-
sharing collaborations and studying the sharing patterns of a high-energy physics
community (Section 2). In Section 3 we propose a solution for locating data
in decentralized, scientiﬁc, data-sharing environments that exploits the small-
worlds topology. The research challenge we raise is: what protocols should be
used to allow a self-conﬁguring P2P network to form small worlds similar to the
way in which the humans that use the network do in their social interactions?
While we do not have a complete solution, we discuss this problem in Section 5.
2
Small Worlds in Scientiﬁc Communities
In many network-based applications, topology determines performance. This ob-
servation captivated researchers who started to study large real networks and
found fascinating results: recurring patterns emerge in real networks [9]. For ex-
ample, social networks, in which nodes are people and edges are relationships; the
world wide web, in which nodes are pages and edges are hyperlinks; and neural
networks, in which nodes are neurons and edges are synapses or gap junctions, are
all small-world networks [10]. Two characteristics distinguish small-world net-
works: ﬁrst, a small average path length, typical of random graphs (here ’path’
means shortest node-to-node path); second, a large clustering coeﬃcient that is
independent of network size. The clustering coeﬃcient captures how many of a
node’s neighbors are connected to each other. One can picture a small world as
a graph constructed by loosely connecting a set of almost complete subgraphs.
The small world example of most interest to us is the scientiﬁc collaboration
graph, where the nodes are scientists and two scientists are connected if they have
written an article together. Multiple studies have shown that such graphs have a
small-world character in scientiﬁc collaborations spanning a variety of diﬀerent
domains, including physics, biomedical research, neuroscience, mathematics, and
computer science.
Typical uses of shared data in scientiﬁc collaborations have particular char-
acteristics:
– Group locality. Users tend to work in groups: a group of users, although
not always located in geographical proximity, tends to use the same set
of resources (ﬁles). For example, members of a science group access newly
produced data to perform analyses or simulations. This work may result

---

## Page 3

234
Adriana Iamnitchi, Matei Ripeanu, and Ian Foster
into new data that will be of interest to all scientists in the group, e.g.,
for comparison. File location mechanisms such as those proposed in CAN,
Chord, or Tapestry [5] do not attempt to exploit this behavior: each member
of the group will hence pay the cost of locating a ﬁle of common interest.
– Time locality. The same user may request the same ﬁle multiple times within
short time intervals. This situation is diﬀerent, for example, from Gnutella
usage patterns, where a user seldom downloads a ﬁle again if it downloaded
it in the past. (We mention that this characteristic is inﬂuenced by the
perceived costs of storing vs. downloading, which may change in time.)
It is the intuition provided by the small-world phenomenon in real networks
and the typical use of scientiﬁc data presented above that lead us to the follow-
ing questions. Let us consider the following network: a node is formed of data
and its provider (the scientist who produced the data), and two nodes are con-
nected if the humans in those nodes are interested in each other’s data. The ﬁrst
question is: is this a small-world network? Based on the analysis of data sharing
patterns in a physics collaboration (presented in Section 2.1) we speculate that
this network will be a small world. Second, how can such small-world topology
be exploited for performance in the data-sharing environments of interest to
us? Finally, how do we translate the dynamics of scientiﬁc collaborations into
self-conﬁguring network protocols (such as joining the network, ﬁnding the right
group of interests, adapting to changes in user’s interests, etc.)?
We believe this last question is relevant and challenging in the context of
self-conﬁguring P2P networks. We support this idea by answering the second
question: in Section 3 we sketch a ﬁle location strategy that exploits the small-
world topology in the context of scientiﬁc data-sharing collaborations. Once
we show that a small-world topology can be eﬀectively exploited, designing self-
conﬁguring topology protocols to induce speciﬁc topology patterns becomes more
interesting.
2.1
Data Sharing in a Physics Collaboration
The D0 collaboration [11] involves hundreds of physicists from 18 countries that
share large amounts of data. Data is accessed from remote locations through a
software layer (SAM [12]) that provides ﬁle-based data management. We ana-
lyzed data access traces logged by this system during January 2002.
We considered the graph whose nodes are users and whose links connect users
that shared at least one ﬁle during a speciﬁed interval. We found that the graphs
generated for various interval lengths exhibit small-world characteristics: short
average path lengths and large clustering coeﬃcients. Although these graphs are
relatively small compared to our envisioned target (e.g., 155 users accessed ﬁles
through SAM in January), we expect similar usage patterns for larger graphs.
Table 1 presents the characteristics of the graphs of users who shared data
within various time intervals ranging from 1 day to 30 days. The small-world
pattern is evident when comparing the clustering coeﬃcient and average path
length with those of a random graph of the same size (same number of nodes

---

## Page 4

Locating Data in (Small-World?) Peer-to-Peer Scientiﬁc Collaborations
235
Fig. 1. The ﬁle-sharing graph of January 2002.
and edges): the clustering coeﬃcient of a small-world graph is signiﬁcantly larger
than that of a similar random graph, while the average path length is about the
same.
Table 1. File-sharing graph characteristics for intervals from 1 to 30 days.
Interval
Whole Graph
Largest Connected Component
Random Graph

## Nodes # Links # Nodes # Links Clustering

Path Clustering
Path
Lenght
Lenght
1 day
20
38
12
34
0.827
1.61
0.236
2.39
2 days
20
77
15
75
0.859
1.29
0.333
1.68
7 days
63
331
58
327
0.816
2.21
0.097
2.35
14 days
87
561
81
546
0.777
2.56
0.083
2.30
30 days
128
1046
126
1045
0.794
2.45
0.067
2.29
3
Locating Files in Small-World Networks
We consider an environment with potentially hundreds of thousands of geograph-
ically distributed nodes that provide location information as <logical ﬁlename,
physical location> pairs.

---

## Page 5

236
Adriana Iamnitchi, Matei Ripeanu, and Ian Foster
Locating ﬁles in this environment is challenging because of scale and dy-
namism: the number of nodes, logical ﬁles, requests, and concurrent users (seen
as ﬁle location requesters) may all be large. The system has multiple sources of
variation over time: ﬁles are created and removed frequently; nodes join and leave
the system without a predictable pattern. In such a system with a large number
of components (nodes and ﬁles), even a low variation rate at the individual level
may aggregate into frequent group level changes.
We exploit the two environmental characteristics introduced in Section 2—
group and time locality—to advance our performance objective of minimizing ﬁle
location latency. We also build on our assumption that small-world structures
eventually emerge in P2P scientiﬁc collaborations.
Consider a small world of C clusters, each comprising, on average, G nodes.
A cluster is deﬁned as a community with overlapping data interests, indepen-
dent of geographical or administrative proximity. Clusters are linked together in
a connected network. In this structure, we combine information dissemination
techniques with request-forwarding search mechanisms: location information is
propagated aggressively within clusters, while inter-cluster search uses request
forwarding techniques.
We chose gossip [13] as the information dissemination mechanism: nodes
gossip location information to other nodes within the cluster. Eventually, with
high probability, all nodes will learn about all other nodes in the cluster. They
will also know, with high probability, all location information provided by all
nodes within the cluster. Hence, a request addressed to any node in the cluster
can be satisﬁed at that node, if the answer exists within the cluster.
A request that cannot be answered by the local node is forwarded to other
cluster(s), by unicast, multicast, or ﬂooding. Ideally, clusters can organize them-
selves dynamically in search-optimized structures, thus allowing a low cost inter-
cluster ﬁle retrieval. Since any node in a cluster has all information provided in
that cluster, the search space reduces from C × G to C.
In this context, nodes need to store the total amount of information provided
by the cluster to which they belong. In order to reduce storage costs, we use
a compact, probabilistic representation of information based on Bloom Filters
(Section 4.2). Nodes can trade oﬀthe amount of memory used for the accuracy
in representing information.
Each node needs to have suﬃcient topology knowledge to forward requests
outside the cluster. Not every node needs to be connected to nodes from remote
clusters, but, probabilistically, every node needs to know a local node that has
external connections. The question of how to form and maintain inter-cluster
connections pertains to the open question we raise in this paper and discuss in
Section 5: what topology protocols can induce the small-world phenomenon?
4
Gossiping Bloom Filters for Information Dissemination
In this section we brieﬂy explain how we use the mechanisms mentioned above:
gossip for information dissemination and Bloom ﬁlters for reducing the amount

---

## Page 6

Locating Data in (Small-World?) Peer-to-Peer Scientiﬁc Collaborations
237
of communication. We also provide an intuitive quantitative estimation of the
system we consider.
4.1
Gossip Mechanism
Gossip protocols have been employed as scalable and reliable information dis-
semination mechanisms for group communication. Each node in the group knows
a partial, possibly inaccurate set of group members. When a node has informa-
tion to share, it sends it to a number of f nodes (fanout) in its set. A node that
receives new information will process it (for example, combine it with or update
its own information) and gossip it further to f nodes chosen from its set.
We use gossip protocols for two purposes: (1) to maintain accurate mem-
bership information in a potentially dynamic cluster and (2) to disseminate ﬁle
location information to nodes in the local cluster. We rely on soft-state mech-
anisms to remove stale information: a node not heard about for some time is
considered departed; a logical ﬁle not advertised for some time is considered
removed.
4.2
Bloom Filters
Bloom ﬁlters [14] are compact data structures used for probabilistic representa-
tion of a set in order to support membership queries (”Is element x in set X?”).
The cost of this compact representation is a small rate of false positives: the
structure sometimes incorrectly recognizes an element as member of the set.
Bloom ﬁlters describe membership of a set A by using a bit vector of length
m and k hash functions, h1, h2, ..., hk with hi : X →1..m. For a ﬁxed size (n)
of the set to be represented, the tradeoﬀbetween accuracy and space (m bits) is
controlled by the number of hash functions used (k). The probability of a false
positive is:
perr ≈(1 −e−kn/m)k
Here perr is minimized for m/n ln 2 hash functions. In practice, however, a
smaller number of hash functions is used: the computational overhead of each
additional hash function is constant while the incremental beneﬁt of adding a
new hash function decreases after a certain threshold. Experience shows that
Bloom ﬁlters can be successfully used to compress a set to 2 bytes per entry
with false positive rates of less than 0.1% and lookup time of about 100µs.
A nice feature of Bloom ﬁlters is that they can be built incrementally: as new
elements are added to a set, the corresponding positions are computed through
the hash functions and bits are set in the ﬁlter. Moreover, the ﬁlter expressing
the reunion of multiple sets is simply computed as the bit-wise OR applied over
the corresponding ﬁlters.
Bloom ﬁlters can be compressed when transferred across the network and,
in this case, ﬁlter parameters can be chosen to maximize compression rate, as
shown in [15].

---

## Page 7

238
Adriana Iamnitchi, Matei Ripeanu, and Ian Foster
4.3
Advantages of Building the System around Shared Data
Interests
We model this system built on group and time locality assumptions as follows:

1. Zipf distribution for request popularity. In Zipf distributions, the number of
requests for the k-th most popular item is proportional to k−α, where α
is a constant. Zipf distributions are widely present in the Internet world.
For example, the popularity of documents requested from an Internet proxy
cache (with 0.65 < α < 0.85), Web server document popularity (0.75 <
α < 0.85), and Gnutella query popularity (0.63 < α < 1.24) all exhibit Zipf
distributions. For our problem we assume that ﬁle popularity in each cluster
(group) follows a Zipf distribution.
2. Locality of interests. As discussed above, clusters are formed based on shared
interest. We therefore assume that information on the most popular ﬁles is
available within the cluster and only requests for not-so-popular ﬁles are
forwarded.
Fig. 2. Fraction of requests served locally (by one member of the group) assum-
ing various values of α.
With these assumptions, we can estimate the fraction of ﬁle requests served
by the group as a function of the distribution parameter α and the fraction of
ﬁles about which the group maintains information. For example, as Figure 2
shows, 68% of all requests are served by the group when information about only
top 1% most popular ﬁles is available at group level, for α = 1. Figure 2 strongly
emphasizes the need for eﬃcient, interest-based cluster creation.
We estimate 100s of clusters with 1,000s of nodes in a cluster, sharing infor-
mation on about 10 million ﬁles per cluster. Using Bloom ﬁlters, for 0.1% false

---

## Page 8

Locating Data in (Small-World?) Peer-to-Peer Scientiﬁc Collaborations
239
positives rate, each node needs 2 bytes per ﬁle or 20MB of memory to store
information about all ﬁles available in the cluster. Assuming a 10-day average
lifetime for a ﬁle at a node, and a self-imposed threshold of 0.1% false posi-
tives, then the generated traﬃc needed to maintain this accuracy level within
the cluster can be estimated at about 24 KBps at each node.
False negatives may have two sources: the probabilistic information dissemi-
nation mechanism and inaccuracy in the inter-cluster search algorithm. By ap-
propriately tuning the gossip periodicity and fanout, the system can control the
rate of false negatives by increasing communication costs.
5
Creating a Small World
The question raised and not answered in this paper is: what protocols should be
used for allowing a self-conﬁguring network to reﬂect the small-world properties
that exist at the social (as in a scientiﬁc collaboration) level? There are at least
two ways to attempt to answer this question. The ﬁrst approach is to look at
existing small worlds and to identify the characteristics that foster the small-
world phenomenon. The second approach is to start from theoretical models that
generate small worlds [10] and mirror them into protocol design.
The Gnutella network is an interesting case study as it is a P2P self-conﬁg-
uring technological network that exhibits (moderate) small-world characteristics
[16]. How are the small-world characteristics generated? One possible answer
is that the social network formed by the Gnutella users reﬂects its small-world
patterns onto the technological network. While this is not impossible, we observe
that a user has a very limited contribution to the Gnutella network topology.
Hence, we believe the social inﬂuence on the Gnutella topology is insigniﬁcant.
More signiﬁcant for the small-world phenomenon may be Gnutella’s network
exploration protocol based on ping and pong messages: a ping is sent to all
neighbors and each neighbor forwards it further to its own neighbors, and so
on. The pong messages return on the same path, allowing a node to learn of its
neighbor’s neighbors, and hence to improve clustering. However, the inﬂuence of
this mechanism is limited by the (comparatively) small number of connections
per node. This fact explains why, despite an aggressive exploration of the net-
work, the clustering coeﬃcient in Gnutella is not large (e.g., it is an order of
magnitude lower than the clustering coeﬃcients in coauthorship networks).
The theoretical model for building small-world graphs [10] starts from a
highly clustered graph (e.g., a lattice) and randomly adds or rewires edges to
connect diﬀerent clusters. This methodology would be relevant to us if we had
the clusters already formed and connected. Allowing clusters to form dynam-
ically based on shared interests, allowing them to learn about each others, to
adapt to users’ changing interests (e.g., divide or merge with other clusters) are
parts of the problem we formulate and do not answer. However, let us assume
that clusters form independently based on out of band information (the way
the Gnutella network forms) and let us assume further that they do eventually

---

## Page 9

240
Adriana Iamnitchi, Matei Ripeanu, and Ian Foster
learn about each other. Possible approaches for transforming a loosely connected
graph of clusters into a small world (hence, with small average path length) are:

1. The hands-oﬀapproach: random graphs have small average path length. It
is thus intuitive that ”randomly” connected clusters will form a small world.
2. The centralized approach at the cluster level: in each cluster, one or multiple
nodes are assigned the task of creating external connections.
3. The agent-based approach: allow an agent to explore the network and rewire
it where necessary. This approach is usually rejected due to associated secu-
rity issues.
6
Summary
We studied the ﬁle location problem in decentralized, self-conﬁguring P2P net-
works associated with scientiﬁc data sharing collaborations. A qualitative anal-
ysis of the characteristics of these collaborations, quantitative analysis of ﬁle
sharing information from one such collaboration, and previous analyses of vari-
ous social networks lead us to speculate that a P2P scientiﬁc collaboration may
beneﬁt from a small-world topology. We sketch a mechanism for low-latency
ﬁle retrieval that beneﬁts from the particularities of the scientiﬁc collaboration
environments and a small-world topology. While we do not provide a solution
for building topology protocols ﬂexible enough to resemble the dynamics and
patterns of social interactions, we stress the relevance of this problem and we
discuss some possible directions for research.
Acknowledgements
We are grateful to John Weigand, Gabriele Garzoglio, and their colleagues at
Fermi National Accelerator Laboratory for their generous help. This work was
supported by the National Science Foundation under contract ITR-0086044.
References
[1] Clip2. The gnutella protocol speciﬁcations v0.4, <http://www.clip2.com>.
[2] Ian Clarke, Oskar Sandberg, Brandon Wiley, and Theodore W. Hong. Freenet: A
distributed anonymous information storage and retrieval system. In ICSI Work-
shop on Design Issues in Anonymity and Unobservability, Berkeley, California,
2000.

[3] Sylvia Ratnasamy, Paul Francis, Mark Handley, Richard Karp, and Scott Shenker.
A scalable content-addressable network. In SIGCOMM, San Diego USA, 2001.
[4] Ion Stoica, Robert Morris, David Karger, M. Frans Kaashoek, and Hari Balakr-
ishnan. Chord: A scalable peer-to-peer lookup service for internet applications.
In SIGCOMM 2001, San Diego, USA, 2001.
[5] Ben Y. Zhao, John D. Kubiatowicz, and Anthony D. Joseph. Tapestry: An in-
frastructure for fault-tolerant wide-area location and routing. Technical Report
CSD-01-1141, Berkeley, 2001.

---

## Page 10

Locating Data in (Small-World?) Peer-to-Peer Scientiﬁc Collaborations
241
[6] The GriPyN Project, <http://www.griphyn.org>.
[7] Sloan Digital Sky Survey, <http://www.sdss.org/sdss.html>.
[8] The Human Genome Project, <http://www.nhgri.nih.gov>.
[9] Reka Albert and Albert-Laszlo Barabasi. Statistical mechanics of complex net-
works. Reviews of Modern Physics, 74:47–97, January 2002.
[10] Duncan J. Watts. Small Worlds: The Dynamics of Networks between Order and
Randomness. Princeton University Press, 1999.
[11] The D0 Experiment, <http://www-d0.fnal.gov>.
[12] Lauri Loebel-Carpenter, Lee Lueking, Carmenita Moore, Ruth Pordes, Julie
Trumbo, Sinisa Veseli, Igor Terekhov, Matthew Vranicar, Stephen White, and
Victoria White. SAM and the particle physics data grid. In Proceedings of Com-
puting in High-Energy and Nuclear Physics, Beijing, China, 2001.
[13] Anne-Marie Kermarrec, Laurent Massoulie, and Ayalvadi Ganesh. Reliable proba-
bilistic communication in large-scale information dissemination systems. Technical
Report MSR-TR-2000-105, Microsoft Research Cambridge, Oct. 2000 2000.
[14] Burton Bloom. Space/time trade-oﬀs in hash coding with allowable errors. Com-
munications of the ACM, 13(7):422–426, 1970.
[15] Michael Mitzenmacher. Compressed bloom ﬁlters. In Twentieth ACM Symposium
on Principles of Distributed Computing (PODC 2001), Newport, Rhode Island,
2001.
[16] Mihajlo A. Jovanovic, Fred S. Annexstein, and Kenneth A. Berman. Scalability
issues in large peer-to-peer networks - a case study of gnutella. Technical report,
University of Cincinnati, 2001.
