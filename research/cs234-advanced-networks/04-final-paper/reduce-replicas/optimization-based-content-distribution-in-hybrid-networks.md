# paper-14-optimisation-based-approach-for-content-distribution

---

## Page 1

(IJACSA) International Journal of Advanced Computer Science and Applications,
Vol. 9, No. 3, 2018
90 | P a g e
<www.ijacsa.thesai.org>
Optimization based Approach for Content
Distribution in Hybrid Mobile Social Networks
Rizwan Akhtar1, Imran Memon2, Zuhaib Ashfaq Khan3 and Changda Wang1,*
1School of Computer Science and Communication Engineering
Jiangsu University, Zhenjiang P.R China
2College of Computer Science
Zhejiang University, Hangzhou P.R China
3Department of Electrical Engineering
Comsats Insititute of Information Technology, Attock, Pakistan

Abstract—This paper presents the new strategy for smooth
content distribution in the mobile social network.  We proposed a
new method, hybrid mobile social network architecture scheme
considered as one node of a social community called social super
node with higher capacity provides the services of content
distribution. We proposed methods and techniques that are
introduced to set the criteria to select a social super node (SSN).
The simulation results are carried out to measure the correctness
of the network performance of the proposed method. These
results indicate that the accessing of those content of nearby
social super node instead of the content provider is used to
improve overall network performance in terms of content end-to-
end delays, delivery ratio, throughput, and cost.
 Keywords—Mobile social network; social super node; delays;
network performance; end-to-end delays; content delivery
I.
INTRODUCTION
The mobile social network (MSN) is a future emerging
wireless network that provides the combination of social
science with wireless communications for purpose of creating
mobile networking. The MSN is kind of network which gives
different variety of content delivery services and application
while involving the social interest of the mobile users. The
technique  of social networking has been implemented in the
research domain of communication technologies to support
efficient data exchange, delivery services and sharing [2]. The
mobile social networking can be build on the existing mobile
network infrastructure i.e. centralized or distributed. The
interdependency of such network devices can be exploited by
the use of social network analysis concept to provide a better
quality of service (QoS).
Different types of network infrastructures utilize in the
MSN for the improvement of the performance of content
delivery service in MSN such as cellular and Wi-Fi networks,
a delay-tolerant network which include opportunistic networks
[4]. Other types are MANETs, disconnected delay-tolerant [6],
[8], and wireless sensor networks [11]. Nowadays cellular
network is most popular and it can be utlized as a backhaul of
the network where MSN can be deployed. The cellular
networking is able to provide the network infrastructure that
can provide social web-based mobile networking services. In
this context Facebook, QQ, Twitter, and MySpace are the
commonly availabale applications. WI-Fi networks are also
supporting the similar services like in cellular networks along
with higher content rate but their coverage areas are smaller.
In [14] the method of social networking is described to
support the teachers to access the desired content through the
social network site (SNS) called ‘Facebook’. In this method,
the teachers can share their content with their community in
six different ways by creating online groups. It gives the
evidence from a large, open social teachers online group over
the time frame of the 12 week period. The findings indicate
that large social online open groups in SNSs are useful for the
pragmatic advice for teachers.
Content distribution in the MSN is one of the challenging
issues that needs to be addressed due to its sparse connectivity
along with resource limitation of the mobile devices. To
ensure smooth content distribution among the nodes of the
MSN, the new appropriate methods and techniques are
required for forwarding the data to nodes and also the links for
the purpose of increasing the delivery efficiency and reduces
the delay. Furthermore, several important factors those are
important for content distribution are mobility, time,
bandwidth utilization and along with duration of encounters, a
freshness of the content, and message duplication available to
the users.
Our major contribution of this work is to improve the
network performance in term of increasing the probability of
successful content delivery and minimizes the delay. It also
includes saving the users cost and lowering the system-wide
traffic on the backbone of MSN. We proposed a hybrid
infrastructure of MSN for efficient content distribution among
the users of a certain social community exploiting the social
relationship. We select a social super node (SSN) from the
social community users of MSN by setting strategies by
considering the fluctuating link quality, closeness centrality,
mobility pattern and computing resources. Social super node
encounters with the content provider server by accessing the
cellular network and broadcast to all the users of a certain
social community.
This manuscript is organized as follows. Section II
explains some related approaches. In Section III we present
the analytical model of our scheme.  Section IV details our
social super node strategies. Section V describes simulation

---

## Page 2

(IJACSA) International Journal of Advanced Computer Science and Applications,
Vol. 9, No. 3, 2018
91 | P a g e
<www.ijacsa.thesai.org>
results. Section VI concludes the research. Lastly, Section VII
Presents the future research direction of the MSN.
II.
RELATED WORK
The approaches that mainly based on social network
analysis such as degree centralities, tie strength, a distance of
the links and the node, and mobility pattern  is implemented to
distribute the data efficiently among the social nodes of the
MSN. The affect of the social patterns not only influence the
node’s interest but  their willingness as well (i.e., selfish
behavior) for sharing their content [10]. In [1] Peer-to-peer
streaming is proposed to enable end-to-end users to
communicate and utilize the available resources in the
network to share video content. In [3], the time duration of the
contact and the frequency of the social pattern (called tie
strength) has been used to recognize the contact pattern of the
mobile nodes to create a opportunistic contacts social group.
In [4],  the concept based on flooding is given to distribute the
content in the detected social community. However, in such
scheme, the flooding message incurs a high volume of the data
traffic on the network, which unnecessarily consumes energy,
bandwidth usage, and also memory.
In [5]  the method of distributed buffer storage in  MSN is
implemented. Based on such method, a novel solution for the
intermittently connected MSN with distributed aid storage for
fast and reliable end-to-end content delivery is presented.
They proposed an architecture of MSN that is able to offer fast
delivery services with the help of distributing buffer storage at
the edge of the MSN. It was the attempt to give the solution
for connected MSN in the situation, where an offered content
rate is higher than the processing content rate of the mobile
devices having limited buffer storage. The contribution of that
research work is the suppression of information congestion
before it occurs by utilizing an extra buffer storage on the
access of MSN.
In [12], an algorithm called SMDRA (simple message
duplication reduction algorithm) is proposed. This algorithm
uses the property of mobility predictability. The limitation of
such algorithm is that it incurs larger memory usage, this
because it uses graphs pattern to store the desired information
related to nodes and edges. In [7], the performance of
hierarchical
super-node
overlays
under
different
configurations is investigated. The configuration parameters
include super-node neighbor number (out degree), super node
redundancy and request TTL (time to live). In [1], another
aspect of the super-node selection for file sharing and
streaming application is discussed. The authors developed
theoretical methodologies for a super-node selection schemes.
In the work proposed by Nazir et al. [2] discribe that the
mobility patterns of the nodes can be predicted if  both the
record of the time and duration of encounters are maintained.
Such information is also beneficial to improve the content
delivery ratio.  In [8], Costa et al. Present social cast for
efficient message routing for publish and subscribe given
network by the help of co-location and movement patterns of
the nodes mobility pattern together with co-location metric
can be utilize to predict the nodes availability so that the
appropriate  node for forwarding can be selected for content
dissemination. In [9], a scheme to direct unconnected social
nodes toward connecting mobile social nodes of the social
community is proposed. The connected nodes communicate
with the main server via a base station, the unconnected nodes
can use these connected users to build a relay to obtain
connectivity. In [13], an optimized solution based on the
content update is proposed. In order to distribute new arrival
content as fresh as possible from the server (content provider)
to the mobile users.
All the above work are proposed to solve the problems
related to content distribution in the MSN. But none of the
approach was given for the in shape of  the super social node
(SSN) across MSN to distribute the content efficiently. Our
proposed network architecture is the attempt to fill research
gape by taking advantage of the declaring one node as a social
super node from the certain social communities.
III.
PROPOSED MSN ARCHITECTURE
Our proposed scheme is based on a hybrid architecture of
MSN that utilizes social super node as an intelligent agent for
sharing the content by exploting the social relationship among
users. Since our scheme is based on hybrid infrastructure of
the MSN that involve both cellular network and ad hoc
network. Hybrid MSN guarantee the performance of content
delivery and can reduce the network cost.

Fig. 1. Social super node of MSN.
In Fig. 1 content provider services declare one node as an
SSN on the basis of assumptions in term of a Node, closeness
and degree centrality, physical location and storage capacity
of the single social community.
In this scheme SSN selection of the P2P applications is
designed to work in backbone networks; SSN is selected to
active for a certain period of time to get the content and
distribute to the MSN users. Fig. 2 shows there can be
multiple communities under base stations of the cellular
network. Every community has its own social super node
(Table I).

---

## Page 3

(IJACSA) International Journal of Advanced Computer Science and Applications,
Vol. 9, No. 3, 2018
92 | P a g e
<www.ijacsa.thesai.org>

Fig. 2. Multiple social communities.
TABLE I.
BINDING TABLE FOR SSN
Social Super Node
ID
IP Addresses
Community ID
2
192.168.2.0
C1
6
192.168.5.71
C2
7
192.168.5.111
C3
3
192.168.4.42
C4
MSS is the mobile social server and C is a social
community. The main contribution of this paper is to define
efficient and simple strategies for social super node admission,
adapted to wireless ad-hoc network conditions of mobile
social network.
IV.
SOCIAL SUPER NODE SELECTION
A social super node can be selected from social
community nodes on the assumption of closeness and degree
centrality, tie strength, similarity and physical location of the
node. The SSN must have higher storage capacity, processing
power and energy. The selected SSN of the community can
announce it to all associated nodes about its status by
broadcasting or MSN server can send a contact message to all
the associated node of community and provide information
about SSN. Algorithm 1 explains our proposed scheme.
Algorithm 1: Selection / Re-selection of Social Super Node

Input N, C           // N is number of nodes and C is the social
community
Input µ, α           // µ is processing rate of SSN and α is arrival
rate
Output SSN       // Selecting Social Super Node
Begin
  N ← C
  SSN ← N
  SSN ← C
  If (TTL N = 2-hop count && distance L= threshold)
   // distance of node N with other nodes
        Equation      ∑

  If (Nµ ≥  Nα)    // processing rate is greater than arrival rate
of Node N
         Equation

           (     )
       Return N = SSN1    // social node N is set as Social super
node 1
   If (TTL N = 2-hop count && distance L= threshold  && Nµ
≤  Nα)
        Return N2 = SSN 2   // Set another node N as SSN2
to share the traffic load
              End If
                     End If
                            End If
  End Begin
In case of failure of a selected social super node because of
overloading, long distance or weak tie strength, MSN server
can select another better-positioned node of the community by
the assumption of physical location and distance to all the
associated nodes and past history of mobility area. MSN
services can keep track the social super node and its associated
social clients via a cellular system. In case of any social node
moves out of the community radio range the MSN server can
request them to move back to the community range.
The distance between social super nodes and its node can
be calculated as

       ∑

         (1)
In our system, each super social node of every community
C determines its mean distance to its node. Let Lij denote the
number of physical hops between SNi and its j-th node. Then,
the mean hop number between the social super node and its
node is denoted by Li, can be calculated based on the distance
and the hit rate of each node To calculate Li, each Social super
node estimates qij for each node j, as follows:

    (2)
NQi is Total number of queries received in by SSN and
NQij is Number of queries with j as the MSN server.
In case if the current SSN is far from its community nodes,
the admission strategy should seek to replace Selected SSN
with a better positioned social super node as SSN-2.
The selected social super node becomes overloaded in a
situation where arrival content rate is much higher than the
processing rate of super node. The probability of buffer
overloaded with its size  J of a SSN can be calculated as
                                                                                     (3)
Where c is the constant value, and α is the exponential
controlling the stability margin of the buffer content queue
 (  –  )     (  –  )
       (4)
λ is arrival probability with arrival rate,  μ  is departure
probability with departure rate  and π is limiting distribution

( (  –  ))
( (  –  ))    and

Using (3) we get
                =

            (     )                                                                     (5)

---

## Page 4

(IJACSA) International Journal of Advanced Computer Science and Applications,
Vol. 9, No. 3, 2018
93 | P a g e
<www.ijacsa.thesai.org>
Equation (5) shows that if the value of alpha (Arrival
content) is larger, it can be prone to have more contents in the
queue and thus SSN can be in the overloaded state.
We assume that the SSN has 100 KB of the buffer with
size J and arrival content rate  (AR) at SSN via MSN server is
at very high than processing rate. We found out the number of
times a buffer overflow occurs for a particular time span of
2000 seconds when the same experiment is conducted 100
times at  SSN of MSN. The SSN can be overloaded by
considering content rate λ =0. 43KB while processing rate
(PR) of contents μ=0. 40 KB on the fixed buffer J of the
mobile node of 100 KB. By the help of the probabilistic
model, we found out the number of overflows incur for an
experiment that is repeated for 100 times across the super
social node of MSN. The results show that buffer J overflow
occurred 34, 55 and 73 times out of 100 experiments in the
conditions when offered content rate is greater, equal and less
than the processing rate of the contents. In Fig. 3 red color
curve indicates that SSN is in the overloaded state. Whenever
an overloaded state is achieved by SSN the admission strategy
should seek for the associated social super node as an
Assistant Social Super Node (ASSN) for the purpose of
sharing loads of the content and can control the arrival traffic
rate from the MSN server.
Closeness centrality measures the shortest distance to the
entire nodes, whereas degree centrality measures the most
direct connections to all nodes of MSN. These two social
metrics are also based on the quality of links between nodes,
So a selection of SSN also depends on these two social
matrices. The best candidate among nodes for the selection of
SSN is one who has the shortest distance and most direct
connection with all the associated nodes of social community.

Fig. 3. Curve of overloaded social super node.
V.
PERFORMANCE EVALUATION
In this section, the simulation results are conducted by
using NS-2 to evaluate our proposed scheme for efficient
content distribution. In the simulation scenario, we have taken
several mobile social nodes and declare one social node from
the social community as social super node (SSN) for
experiments, a SSN encounter with the mobile social server
via cellular network and share the content of all connected
friends (nodes) by direct link along with multi-hop
connectivity.
Simulation results leverage network performance can be
significantly improved if the nodes of the social community
can have fresh content from the nearby super node to access
instead of content provider at the core of networking. Table II
summarizes the parameters used in the simulations.
TABLE II.
SYSTEM PARAMETERS FOR SIMULATIONS
Parameters
Values
Number of server
1 or 2.... N
Number of nodes
1,30,50,100
Distance
10-50 km/h
Simulation time
36 hours
Bandwidth/good put
3 Mbit/s
3G bandwidth/good  put
200 kbit/s
Nodes access network bandwidth
10 Mbit/s
Content sizes
1, 20, 40,60 MB
Content popularity
0.1 to 1.0
Latency (deferred transmission)
0, 10, 50, 80, 150,300, 600,
1800, 2200 s

Fig. 4. Successful delivery ratio and delay.
Fig. 4 shows the comparison between the content accessed
from source available on access closer to the user with the
content access by users from core network by accessing the
main social server. Fig. 3 demonstrate that by accessing the
content locally from SSN of MSN can increase the successful
delivery ratio and reduce the delay.

---

## Page 5

(IJACSA) International Journal of Advanced Computer Science and Applications,
Vol. 9, No. 3, 2018
94 | P a g e
<www.ijacsa.thesai.org>

Fig. 5. Latency.
Fig. 5 shows that if nodes access the content of the local
SSN would have better latency with a high probability of
delivery ratio and lower the delays.
VI.
CONCLUSION
We present the new strategy for smooth content
distribution in mobile social network.  We proposed a new
method, hybrid mobile social network architecture scheme
considered as one node of social community called social
super node with higher capacity provide the services of
content distribution. In this method, techniques are introduced
to set the criteria to select a social super node. Our major
contribution of this work is to improve the network
performance in term of increasing the probability of successful
content delivery and minimizes the delay. It also includes
saving the users cost and lowering the system wide traffic on
the backbone of MSN.
VII.
FUTURE WORK
Although some challenges in the MSN are identified in
this research paper,  there are still many problems remaining
that  need to be addressed. Also, there exist  many
opportunities to improve the effectiveness and efficiency of
the MSN. In this section, some of the future possible research
recommendations are presented from the perspective of
protocol and architecture design in the MSN.
Interoperability is now an important issue because multiple
MSN want to communicate at the same with each other. For
routing
standard
protocol,
interfaces
for
exchanging
information and signaling of social-based relationship and
content delivery among different MSN may be required that
can ensure seamless applications. The standard protocols can
be useful for data distribution and context awareness and
secrecy in the MSNs. Also, the interoperability among mobile
users and desktop platforms is an important factor.
Bandwidth allocation within the MSN can be optimized
for achieving the best performances However, the impact of
mobile social network of exporting social relationship within
the radio resources management of several wireless systems
has not been yet investigated. In addition, some of the existing
optimization formulations ignore the QoS of the MSN
applications. Due to the absence of centralized control, radio
resources management and also the QoS support are coming
more challenging in the distributed architecture of the MSN.
ACKNOWLEDGMENT
This work was supported by the National Science
Foundation of China under grant 61172269 and the Jiangsu
Provincial Science and Technology Project under grant
BA2015161.
REFERENCES
[1] Adler M, Kumar R, Ross KW, Rubenstein D, Suel T, Yao DD (2005)
Optimal peer selection for P2P downloading and streaming. In:
Proceeding of 24th annual joint conference of the IEEE computer and
communications societies (INFOCOM), vol 3, pp 1538–1549
[2] F. Nazir, J. Ma, and A. Seneviratne, Time critical content delivery
usingpredictable patterns in mobile social networks, in Proc. Int. Conf.
Comput. Sci. Eng., Aug. 2009, vol. 4,pp. 1066–1073
[3] R. Cabaniss, S. Madria, G. Rush, A. Trotta, and S. S. Vulli, Dynamic
social grouping based routing in a mobile ad-hoc network,[ in Proc. 11th
Int. Conf.Mobile Data Manage., May 23–26, 2010, pp. 295–296
[4] E. Yoneki, P. Hui, S. Chan, and J. Crowcroft, A socio-aware overlay for
publish/ subscribe communication in delay tolerant networks, in Proc.
ACM Symp. Model. Anal. Simul. Wireless Mobile Syst., Oct. 2007, pp.
225–234
[5] Akhtar R, Leng S, Memon I, et al. Architecture of hybrid mobile social
networks
for
efficient
content
delivery[J].
Wireless
Personal
Communications, 2015, 80(1): 85-96.
[6] E. M. Daly and M. Haahr, Social network analysis for routing in
disconnected delay-tolerant manets, in Proc. ACM Int. Symp. Mobile
Ad Hoc Netw. Comput., Sep. 2007, pp. 32–40
[7] Yang B, Garcia-Molina H (2003) Designing a super-peer network. In:
Proceeding of 19th International Conference on  Data Engineering
(ICDE). Bangalore, India, pp 49–60
[8] P. Costa, C. Mascolo, M. Musolesi, and G. P. Picco, Socially-aware
routing for publish-subscribe in delay-tolerant mobile ad hoc networks,
IEEE J. Sel. Areas Commun., vol. 26, no. 5, Jun. 2008, pp. 748–760
[9] B. Chelly and N. Malouch, Movement and connectivity algorithms for
location-based mobile social networks, in Proc. IEEE Int. Conf.
Wireless Mobile Comput. Netw.Commun., Oct. 2008, pp. 190–195
[10] K. Kwong, A. Chaintreau, and R. Guerin, Quantifying content
consistency improvements through opportunistic contacts, in Proc. 4th
ACM
Workshop
Challenged
Netw.,
Sep.
25,
2009,
DOI:
10.1145/1614222.1614230.
[11] E. Miluzzo, N. D. Lane, K. Fodor, R. Peterson, H. Lu, M. Musolesi, S.
B. Eisenman, X. Zheng, and A. T. Campbell, BSensing meets mobile
social networks: The design, implementation and evaluation of the
CenceMe application, in Proc. ACM Conf. Embedded Netw. Sensor
Syst., Apr. 2008, pp.337–350
[12] K. Kawarabayashi, F. Nazir, and H. Prendinger, Message duplication
reduction in dense mobile social networks, in Proc. 19th Int. Conf.
Comput.
Commun.
Netw.,
Aug.
2–5,
2010,
DOI:
10.1109/
ICCCN.2010.5560124
[13] S. Ioannidis, A. Chaintreau, and L. Massoulie, Optimal and scalable
distribution of content updates over a mobile social network, in Proc.
IEEE Int. Conf. Comput. Commun., Apr. 2009, pp. 1422–1430
[14] Kelly, N.; Antonio, A. (2016). "Teacher peer support in social network
sites.". Teaching
and
Teacher
Education. 56 (1):
2016
138-
149. doi:10.1016/j.tate.2016.02.007.
