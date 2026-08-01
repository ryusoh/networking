# intro-int-nets-dist

---

## Page 1

c
⃝
Isaac D. Scherson
Distributed [Computing] Systems
Interconnection Networks, Communications and the OSI Model
- Part I
Isaac D. Scherson (aka The Schark c¨^ )
Dept. of Computer Science (Systems)
Bren School of Information and Computer Sciences
University of California, Irvine
Irvine, CA 92697-3425
isaac@ics.uci.edu
www.ics.uci.edu/˜isaac
www.ics.uci.edu/˜schark
CompSci-230, Winter 2019
1 / 38
c
⃝
Isaac D. Scherson
The Interconnection Network
2 / 38

---

## Page 2

c
⃝
Isaac D. Scherson
Differences between Interconnection Networks
I Interconnection Network Speed (Latency and Bandwidth)
differentiates between different concurrent computing architectures.
I Many network details have been oversimpliﬁed here... for simplicity’s
sake...
3 / 38
c
⃝
Isaac D. Scherson
Differences between Interconnection Networks (cont”d)
PE
Local
Mem
PE
Local
Mem
PE
Local
Mem
Interconnection Network:
I Tightly
Coupled-X-bar/Multistage:
SIMD – Data Parallel – MPP
I Switch/Hub/Router/: Cluster
I LAN (Ethernet): WorkStation
Farm
I WAN/Internet: GRID
4 / 38
Interconnection network
Wait time  access time

---

## Page 3

c
⃝
Isaac D. Scherson
Network Characteristics ! Parallel Processing Architectures
5 / 38
c
⃝
Isaac D. Scherson
Network Characteristics ! Parallel Processing Architectures
6 / 38

---

## Page 4

c
⃝
Isaac D. Scherson
Two Examples of point-to-point Architectures
PE
MEM
PE
MEM
PE
MEM
PE
MEM
Linear Array
Two Dimensional Array
(Mesh-Connected Parallel Computer)
I These architectures have planar topologies, hence thought suitable
for VLSI
I Tons of work on algorithms for linear and 2D systems
I However, a more general model won the popularity contest
7 / 38
c
⃝
Isaac D. Scherson
Network Characteristics ! Parallel Processing Architectures
8 / 38

---

## Page 5

c
⃝
Isaac D. Scherson
Network Characteristics ! Parallel Processing Architectures
9 / 38
c
⃝
Isaac D. Scherson
Network Characteristics ! Parallel Processing Architectures
10 / 38

---

## Page 6

c
⃝
Isaac D. Scherson
Network Characteristics ! Parallel Processing Architectures
11 / 38
c
⃝
Isaac D. Scherson
Network Characteristics ! Parallel Processing Architectures
12 / 38

---

## Page 7

c
⃝
Isaac D. Scherson
Network Characteristics ! Parallel Processing Architectures
13 / 38
c
⃝
Isaac D. Scherson
Network Characteristics ! Parallel Processing Architectures
The Maspar Inc. Massively Parallel Computer Architecture:
A two-network massively parallel computer.
T
h
e
M
a
s
P
a
r
M
P
-
2
HOST
Array Control Unit
Global Router
(MIN)
14 / 38

---

## Page 8

c
⃝
Isaac D. Scherson
Network Characteristics ! Parallel Processing Architectures
The Maspar Inc. Massively Parallel Computer Architecture:
A two-network massively parallel computer.
15 / 38
c
⃝
Isaac D. Scherson
Network Characteristics ! Parallel Processing Architectures
The Maspar Inc. Massively Parallel Computer Architecture:
The Global Router.
16 / 38

---

## Page 9

c
⃝
Isaac D. Scherson
Network Characteristics ! Parallel Processing Architectures
CRAY Research’s C90-Y-MP Computer
17 / 38
c
⃝
Isaac D. Scherson
Network Characteristics ! Parallel Processing Architectures
CRAY Research’s C90-Y-MP Computer
18 / 38

---

## Page 10

c
⃝
Isaac D. Scherson
Network Characteristics ! Parallel Processing Architectures
I Dan Hillis at MIT introduced the Connection Machine as part of his
PhD thesis.
I Based on the idea, Thinking Machines Corporation was funded.
I CM1 and CM2 evolved into CM5, one of the most popular
supercomputers of the time.
I CM5 had a Data and a Synchronization tree-like networks.
CM5 used a Network called a Fat Tree
19 / 38
c
⃝
Isaac D. Scherson
Network Characteristics ! Parallel Processing Architectures
The CM5 sales pitch transparencies
The fat tree network.
20 / 38

---

## Page 11

c
⃝
Isaac D. Scherson
Network Characteristics ! Parallel Processing Architectures
The CM5 sales pitch transparencies
The fat tree network.
21 / 38
c
⃝
Isaac D. Scherson
Network Characteristics ! Parallel Processing Architectures
Lipovski and Malek
The Texas Reconﬁgurable Array Computer (TRAC).
22 / 38

---

## Page 12

c
⃝
Isaac D. Scherson
Network Characteristics ! Parallel Processing Architectures
Lipovski and Malek
The Texas Reconﬁgurable Array Computer (TRAC).
23 / 38
c
⃝
Isaac D. Scherson
Network Characteristics ! Parallel Processing Architectures
Lipovski and Malek
The Texas Reconﬁgurable Array Computer (TRAC).
24 / 38

---

## Page 13

c
⃝
Isaac D. Scherson
Network Characteristics ! Parallel Processing Architectures
Lipovski and Malek
The Texas Reconﬁgurable Array Computer (TRAC).
25 / 38
c
⃝
Isaac D. Scherson
Network Characteristics ! Parallel Processing Architectures
Another view of a Fat Tree
26 / 38

---

## Page 14

c
⃝
Isaac D. Scherson
Network Characteristics ! Parallel Processing Architectures
Another view of a Fat Tree.
27 / 38
c
⃝
Isaac D. Scherson
Network Characteristics ! Parallel Processing Architectures
Another view of a Fat Tree.
28 / 38

---

## Page 15

c
⃝
Isaac D. Scherson
Network Characteristics ! Parallel Processing Architectures
A 3D representation of the Fat Tree.
Play Video
29 / 38
c
⃝
Isaac D. Scherson
Network Characteristics ! Parallel Processing Architectures
A network we shall look at derived
from Fat Trees.
These will be called Least Comon
Ancestor Networks (LCANs)
30 / 38

---

## Page 16

c
⃝
Isaac D. Scherson
Clusters
31 / 38
c
⃝
Isaac D. Scherson
Problems with Conventional Supercomputers
I Very costly
I Specialized processors not cheaply available
I Specialized interconnects to support bandwidth needed
I Harder to program
I Uncommon processors
I Lack of standard programming model and interface
I Lack of standard tools
I Shorter life span
I Harder to upgrade
I Scalability a problem for many
32 / 38

---

## Page 17

c
⃝
Isaac D. Scherson
Enablers for Clusters
I Individual machines are becoming very powerful, no need for
specialized processors to achieve required speed at each node
I Faster network technology reduces the need for specialized,
proprietary interconnects between processors
I Incremental scalability – add nodes as needed
I Use of common-off-the-shelf (COTS) components implies lower cost
and ready availability
I Development tools are more mature
I Standardized programming interfaces like PVM, MPI etc. makes
programs portable
33 / 38
c
⃝
Isaac D. Scherson
Popularity of Clusters in HPC
I www.top500.org - list of the top 500 supercomputers in the world,
updated twice per year
I Ranked according to their performance on the standard Linpack
benchmark
I 294 of them in the list of Nov. 2004 are clusters!
I Highest rank of a cluster – 2 (approx. 51 teraﬂops)
34 / 38

---

## Page 18

c
⃝
Isaac D. Scherson
Cluster Components
I A typical cluster
I Stand alone machines
I A fast network connecting them
I Low latency communication protocols
I Software to give Single System Image
I Programming Tools
I Additional components
I Network RAM
I Parallel I/O
35 / 38
c
⃝
Isaac D. Scherson
Typical Cluster Architecture
Computer
Node n
Computer
Node 3
Computer
Node 2
Computer
Node 1
PE
Mem
Large TCP/IP X-Bar Switch
PE
Mem
PE
Mem
PE
Mem
Several interconnected
stand-alone machines
36 / 38

---

## Page 19

c
⃝
Isaac D. Scherson
Example: Berkeley NOW
I 100+ SUN UltraSparc machines (Ultra 170)
I 200 disks
I Myrinet interconnection within cluster– 160 MB/s
I Switched Ethernet to ATM backbone for external communication
I GLUnix – global OS over Solaris for process management
I AM (Active Message) communication protocol
I MPI for programming
37 / 38
c
⃝
Isaac D. Scherson
Cluster Classiﬁcation
I Target applications
I High-Performance Clusters – for scientiﬁc apps.
I High-Availability Clusters – for critical apps.
I Node ownership
I Node Hardware
I Node OS
I Node Conﬁguration
I Clustering Levels
38 / 38
