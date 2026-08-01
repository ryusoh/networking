# ch06-table-of-contents

---

## Page 1

Table of Contents
Workshop Report for IPTPS’02: 1st International Workshop on
Peer-to-Peer Systems . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
1
Richard Clayton (Cambridge University)
Structure Overlay Routing Protocols: State of the
Art and Future Directions
Observations on the Dynamic Evolution of Peer-to-Peer Networks . . . . . . .
22
David Liben-Nowell, Hari Balakrishnan, and David Karger (MIT)
Brocade: Landmark Routing on Overlay Networks . . . . . . . . . . . . . . . . . . . .
34
Ben Y. Zhao, Yitao Duan, Ling Huang, Anthony D. Joseph, and
John D. Kubiatowicz (UC Berkeley)
Routing Algorithms for DHTs: Some Open Questions. . . . . . . . . . . . . . . . . .
45
Sylvia Ratnasamy, Ion Stoica (UC Berkeley), and Scott Shenker
(ICSI, Berkeley)
Kademlia: A Peer-to-Peer Information System Based on the
XOR Metric . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
53
Petar Maymounkov and David Mazi`eres (New York University)
Eﬃcient Peer-to-Peer Lookup Based on a Distributed Trie . . . . . . . . . . . . .
66
Michael J. Freedman (MIT) and Radek Vingralek (Oracle Corporation)
Self-Organizing Subsets: From Each According to His Abilities, to Each
According to His Needs . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
76
Amin Vahdat, Jeﬀrey Chase, Rebecca Braynard, Dejan Kosti´c,
Patrick Reynolds, and Adolfo Rodriguez (Duke University)
Deployed Peer-to-Peer Systems
Mapping the Gnutella Network: Macroscopic Properties of Large-Scale
Peer-to-Peer Systems . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
85
Matei Ripeanu and Ian Foster (The University of Chicago)
Can Heterogeneity Make Gnutella Scalable? . . . . . . . . . . . . . . . . . . . . . . . . . .
94
Qin Lv (Princeton University), Sylvia Ratnasamy (UC Berkeley), and
Scott Shenker (ICSI, Berkeley)
Experiences Deploying a Large-Scale Emergent Network . . . . . . . . . . . . . . .
104
Bryce Wilcox-O’Hearn (zooko.com)

---

## Page 2

VIII
Table of Contents
Anonymous Overlays
Anonymizing Censorship Resistant Systems . . . . . . . . . . . . . . . . . . . . . . . . . .
111
Andrei Serjantov (Cambridge University)
Introducing Tarzan, a Peer-to-Peer Anonymizing Network Layer . . . . . . . .
121
Michael J. Freedman, Emil Sit, Josh Cates, and Robert Morris (MIT)
Applications
Mnemosyne: Peer-to-Peer Steganographic Storage . . . . . . . . . . . . . . . . . . . . .
130
Steven Hand (Cambridge University) and Timothy Roscoe (Sprint
Advanced Technology Lab)
ConChord: Cooperative SDSI Certiﬁcate Storage and Name Resolution . .
141
Sameer Ajmani, Dwaine E. Clarke, Chuang-Hue Moh, and
Steven Richman (MIT)
Serving DNS Using a Peer-to-Peer Lookup Service . . . . . . . . . . . . . . . . . . . .
155
Russ Cox, Athicha Muthitacharoen, and Robert T. Morris (MIT)
Network Measurement as a Cooperative Enterprise . . . . . . . . . . . . . . . . . . . .
166
Sridhar Srinivasan and Ellen Zegura (Georgia Institute of Technology)
The Case for Cooperative Networking . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
178
Venkata N. Padmanabhan (Microsoft Research) and
Kunwadee Sripanidkulchai (Carnegie Mellon University)
Internet Indirection Infrastructure. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
191
Ion Stoica, Dan Adkins, Sylvia Ratnasamy (UC Berkeley),
Scott Shenker (ICSI, Berkeley), Sonesh Surana, and Shelley Zhuang
(UC Berkeley)
Peer-to-Peer Caching Schemes to Address Flash Crowds . . . . . . . . . . . . . . .
203
Tyron Stading, Petros Maniatis, and Mary Baker (Stanford University)
Evaluation
Exploring the Design Space of Distributed and Peer-to-Peer Systems:
Comparing the Web, TRIAD, and Chord/CFS. . . . . . . . . . . . . . . . . . . . . . . .
214
Stefan Saroiu, P. Krishna Gummadi, and Steven D. Gribble (University
of Washington)
Are Virtualized Overlay Networks Too Much of a Good Thing? . . . . . . . . .
225
Pete Keleher, Samrat Bhattacharjee, and Bujor Silaghi (University of
Maryland)

---

## Page 3

Table of Contents
IX
Searching and Indexing
Locating Data in (Small-World?) Peer-to-Peer Scientiﬁc Collaborations . .
232
Adriana Iamnitchi, Matei Ripeanu, and Ian Foster (University of
Chicago)
Complex Queries in DHT-based Peer-to-Peer Networks . . . . . . . . . . . . . . . .
242
Matthew Harren, Joseph M. Hellerstein, Ryan Huebsch,
Boon Thau Loo (UC Berkeley), Scott Shenker (ICSI, Berkeley), and
Ion Stoica (UC Berkeley)
The Sybil Attack . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
251
John R. Douceur (Microsoft Research)
Security Considerations for Peer-to-Peer Distributed Hash Tables . . . . . . .
261
Emil Sit and Robert Morris (MIT)
Dynamically Fault-Tolerant Content Addressable Networks . . . . . . . . . . . . .
270
Jared Saia (University of Washington), Amos Fiat (Tel Aviv
University), Steven Gribble, Anna R. Karlin, and Stefan Saroiu
(University of Washington)
Data Management
Scalable Management and Data Mining Using Astrolabe . . . . . . . . . . . . . . .
280
Robbert van Renesse, Kenneth Birman, Dan Dumitriu, and
Werner Vogels (Cornell University)
Atomic Data Access in Distributed Hash Tables . . . . . . . . . . . . . . . . . . . . . .
295
Nancy Lynch (MIT), Dahlia Malkhi (Hebrew University), and
David Ratajczak (UC Berkeley)
Dynamic Replica Placement for Scalable Content Delivery . . . . . . . . . . . . .
306
Yan Chen, Randy H. Katz, and John D. Kubiatowicz (UC Berkeley)
Peer-to-Peer Resource Trading in a Reliable Distributed System . . . . . . . .
319
Brian F. Cooper and Hector Garcia-Molina (Stanford University)
Erasure Coding Vs. Replication: A Quantitative Comparison . . . . . . . . . . .
328
Hakim Weatherspoon and John D. Kubiatowicz (UC Berkeley)
Author Index . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
339
