# ch04-table-of-contents

---

## Page 1

xvii
Table of Contents
Chapter 1 Computer Networks and the Internet
1
1.1
What Is the Internet?
2
1.1.1
A Nuts-and-Bolts Description
2
1.1.2
A Services Description
5
1.1.3
What Is a Protocol?
7
1.2
The Network Edge
9
1.2.1
Access Networks
12
1.2.2
Physical Media
18
1.3
The Network Core
22
1.3.1
Packet Switching
22
1.3.2
Circuit Switching
27
1.3.3
A Network of Networks
32
1.4
Delay, Loss, and Throughput in Packet-Switched Networks
35
1.4.1
Overview of Delay in Packet-Switched Networks
35
1.4.2
Queuing Delay and Packet Loss
39
1.4.3
End-to-End Delay
42
1.4.4
Throughput in Computer Networks
44
1.5
Protocol Layers and Their Service Models
47
1.5.1
Layered Architecture
47
1.5.2
Encapsulation
53
1.6
Networks Under Attack
55
1.7
History of Computer Networking and the Internet
60
1.7.1
The Development of Packet Switching: 1961–1972
60
1.7.2
Proprietary Networks and Internetworking: 1972–1980
62
1.7.3
A Proliferation of Networks: 1980–1990
63
1.7.4
The Internet Explosion: The 1990s
64
1.7.5
The New Millennium
65
1.8
Summary
66
Homework Problems and Questions
68
Wireshark Lab
78
Interview: Leonard Kleinrock
80

---

## Page 2

Chapter 2 Application Layer
83
2.1
Principles of Network Applications
84
2.1.1
Network Application Architectures
86
2.1.2
Processes Communicating
88
2.1.3
Transport Services Available to Applications
91
2.1.4
Transport Services Provided by the Internet
93
2.1.5
Application-Layer Protocols
96
2.1.6
Network Applications Covered in This Book
97
2.2
The Web and HTTP
98
2.2.1
Overview of HTTP
98
2.2.2
Non-Persistent and Persistent Connections
100
2.2.3
HTTP Message Format
103
2.2.4
User-Server Interaction: Cookies
108
2.2.5
Web Caching
110
2.2.6
The Conditional GET
114
2.3
File Transfer: FTP
116
2.3.1
FTP Commands and Replies
118
2.4
Electronic Mail in the Internet
118
2.4.1
SMTP
121
2.4.2
Comparison with HTTP
124
2.4.3
Mail Message Format
125
2.4.4
Mail Access Protocols
125
2.5
DNS—The Internet’s Directory Service
130
2.5.1
Services Provided by DNS
131
2.5.2
Overview of How DNS Works
133
2.5.3
DNS Records and Messages
139
2.6
Peer-to-Peer Applications
144
2.6.1
P2P File Distribution
145
2.6.2
Distributed Hash Tables (DHTs)
151
2.7
Socket Programming: Creating Network Applications
156
2.7.1
Socket Programming with UDP
157
2.7.2
Socket Programming with TCP
163
2.8
Summary
168
Homework Problems and Questions
169
Socket Programming Assignments
179
Wireshark Labs: HTTP, DNS
181
Interview: Marc Andreessen
182
xviii
Table of Contents

---

## Page 3

Table of Contents
xix
Chapter 3 Transport Layer
185
3.1
Introduction and Transport-Layer Services
186
3.1.1
Relationship Between Transport and Network Layers
186
3.1.2
Overview of the Transport Layer in the Internet
189
3.2
Multiplexing and Demultiplexing
191
3.3
Connectionless Transport: UDP
198
3.3.1
UDP Segment Structure
202
3.3.2
UDP Checksum
202
3.4
Principles of Reliable Data Transfer
204
3.4.1
Building a Reliable Data Transfer Protocol
206
3.4.2
Pipelined Reliable Data Transfer Protocols
215
3.4.3
Go-Back-N (GBN)
218
3.4.4
Selective Repeat (SR)
223
3.5
Connection-Oriented Transport: TCP
230
3.5.1
The TCP Connection
231
3.5.2
TCP Segment Structure
233
3.5.3
Round-Trip Time Estimation and Timeout
238
3.5.4
Reliable Data Transfer
242
3.5.5
Flow Control
250
3.5.6
TCP Connection Management
252
3.6
Principles of Congestion Control
259
3.6.1
The Causes and the Costs of Congestion
259
3.6.2
Approaches to Congestion Control
265
3.6.3
Network-Assisted Congestion-Control Example:
ATM ABR Congestion Control
266
3.7
TCP Congestion Control
269
3.7.1
Fairness
279
3.8
Summary
283
Homework Problems and Questions
285
Programming Assignments
300
Wireshark Labs: TCP, UDP
301
Interview: Van Jacobson
302
Chapter 4 The Network Layer
305
4.1
Introduction
306
4.1.1
Forwarding and Routing
308
4.1.2
Network Service Models
310
4.2
Virtual Circuit and Datagram Networks
313
4.2.1
Virtual-Circuit Networks
314
4.2.2
Datagram Networks
317
4.2.3
Origins of VC and Datagram Networks
319

---

## Page 4

4.3
What’s Inside a Router?
320
4.3.1
Input Processing
322
4.3.2
Switching
324
4.3.3
Output Processing
326
4.3.4
Where Does Queuing Occur?
327
4.3.5
The Routing Control Plane
331
4.4
The Internet Protocol (IP): Forwarding and Addressing in the Internet
331
4.4.1
Datagram Format
332
4.4.2
IPv4 Addressing
338
4.4.3
Internet Control Message Protocol (ICMP)
353
4.4.4
IPv6
356
4.4.5
A Brief Foray into IP Security
362
4.5
Routing Algorithms
363
4.5.1
The Link-State (LS) Routing Algorithm
366
4.5.2
The Distance-Vector (DV) Routing Algorithm
371
4.5.3
Hierarchical Routing
379
4.6
Routing in the Internet
383
4.6.1
Intra-AS Routing in the Internet: RIP
384
4.6.2
Intra-AS Routing in the Internet: OSPF
388
4.6.3
Inter-AS Routing: BGP
390
4.7
Broadcast and Multicast Routing
399
4.7.1
Broadcast Routing Algorithms
400
4.7.2
Multicast
405
4.8
Summary
412
Homework Problems and Questions
413
Programming Assignments
429
Wireshark Labs: IP, ICMP
430
Interview: Vinton G. Cerf
431
Chapter 5 The Link Layer: Links, Access Networks, and LANs
433
5.1
Introduction to the Link Layer
434
5.1.1
The Services Provided by the Link Layer
436
5.1.2
Where Is the Link Layer Implemented?
437
5.2
Error-Detection and -Correction Techniques
438
5.2.1
Parity Checks
440
5.2.2
Checksumming Methods
442
5.2.3
Cyclic Redundancy Check (CRC)
443
5.3
Multiple Access Links and Protocols
445
5.3.1
Channel Partitioning Protocols
448
5.3.2
Random Access Protocols
449
5.3.3
Taking-Turns Protocols
459
5.3.4
DOCSIS: The Link-Layer Protocol for Cable Internet Access
460
xx
Table of Contents

---

## Page 5

Table of Contents
xxi
5.4
Switched Local Area Networks
461
5.4.1
Link-Layer Addressing and ARP
462
5.4.2
Ethernet
469
5.4.3
Link-Layer Switches
476
5.4.4
Virtual Local Area Networks (VLANs)
482
5.5
Link Virtualization: A Network as a Link Layer
486
5.5.1
Multiprotocol Label Switching (MPLS)
487
5.6
Data Center Networking
490
5.7
Retrospective: A Day in the Life of a Web Page Request
495
5.7.1
Getting Started: DHCP, UDP, IP, and Ethernet
495
5.7.2
Still Getting Started: DNS and ARP
497
5.7.3
Still Getting Started: Intra-Domain Routing to the DNS Server
498
5.7.4
Web Client-Server Interaction: TCP and HTTP
499
5.8
Summary
500
Homework Problems and Questions
502
Wireshark Labs: Ethernet and ARP, DHCP
510
Interview: Simon S. Lam
511
Chapter 6 Wireless and Mobile Networks
513
6.1
Introduction
514
6.2
Wireless Links and Network Characteristics
519
6.2.1
CDMA
522
6.3
WiFi: 802.11 Wireless LANs
526
6.3.1
The 802.11 Architecture
527
6.3.2
The 802.11 MAC Protocol
531
6.3.3
The IEEE 802.11 Frame
537
6.3.4
Mobility in the Same IP Subnet
541
6.3.5
Advanced Features in 802.11
542
6.3.6
Personal Area Networks: Bluetooth and Zigbee
544
6.4
Cellular Internet Access
546
6.4.1
An Overview of Cellular Network Architecture
547
6.4.2
3G Cellular Data Networks: Extending the Internet to Cellular
Subscribers
550
6.4.3
On to 4G: LTE
553
6.5
Mobility Management: Principles
555
6.5.1
Addressing
557
6.5.2
Routing to a Mobile Node
559
6.6
Mobile IP
564
6.7
Managing Mobility in Cellular Networks
570
6.7.1
Routing Calls to a Mobile User
571
6.7.2
Handoffs in GSM
572

---

## Page 6

6.8
Wireless and Mobility: Impact on Higher-Layer Protocols
575
6.9
Summary
578
Homework Problems and Questions
578
Wireshark Lab: IEEE 802.11 (WiFi)
583
Interview: Deborah Estrin
584
Chapter 7 Multimedia Networking
587
7.1
Multimedia Networking Applications
588
7.1.1
Properties of Video
588
7.1.2
Properties of Audio
590
7.1.3
Types of Multimedia Network Applications
591
7.2
Streaming Stored Video
593
7.2.1
UDP Streaming
595
7.2.2
HTTP Streaming
596
7.2.3
Adaptive Streaming and DASH
600
7.2.4
Content Distribution Networks
602
7.2.5
Case Studies: Netflix, YouTube, and Kankan
608
7.3
Voice-over-IP
612
7.3.1
Limitations of the Best-Effort IP Service
612
7.3.2
Removing Jitter at the Receiver for Audio
614
7.3.3
Recovering from Packet Loss
617
7.3.4
Case Study: VoIP with Skype
620
7.4
Protocols for Real-Time Conversational Applications
623
7.4.1
RTP
624
7.4.2
SIP
627
7.5
Network Support for Multimedia
632
7.5.1
Dimensioning Best-Effort Networks
634
7.5.2
Providing Multiple Classes of Service
636
7.5.3
Diffserv
648
7.5.4
Per-Connection Quality-of-Service (QoS) Guarantees:
Resource Reservation and Call Admission
652
7.6
Summary
655
Homework Problems and Questions
656
Programming Assignment
666
Interview: Henning Schulzrinne
668
Chapter 8 Security in Computer Networks
671
8.1
What Is Network Security?
672
8.2
Principles of Cryptography
675
8.2.1
Symmetric Key Cryptography
676
8.2.2
Public Key Encryption
683
xxii
Table of Contents

---

## Page 7

Table of Contents
xxiii
8.3
Message Integrity and Digital Signatures
688
8.3.1
Cryptographic Hash Functions
689
8.3.2
Message Authentication Code
691
8.3.3
Digital Signatures
693
8.4
End-Point Authentication
700
8.4.1
Authentication Protocol ap1.0
700
8.4.2
Authentication Protocol ap2.0
701
8.4.3
Authentication Protocol ap3.0
702
8.4.4
Authentication Protocol ap3.1
703
8.4.5
Authentication Protocol ap4.0
703
8.5
Securing E-Mail
705
8.5.1
Secure E-Mail
706
8.5.2
PGP
710
8.6
Securing TCP Connections: SSL
711
8.6.1
The Big Picture
713
8.6.2
A More Complete Picture
716
8.7
Network-Layer Security: IPsec and Virtual Private Networks
718
8.7.1
IPsec and Virtual Private Networks (VPNs)
718
8.7.2
The AH and ESP Protocols
720
8.7.3
Security Associations
720
8.7.4
The IPsec Datagram
721
8.7.5
IKE: Key Management in IPsec
725
8.8
Securing Wireless LANs
726
8.8.1
Wired Equivalent Privacy (WEP)
726
8.8.2
IEEE 802.11i
728
8.9
Operational Security: Firewalls and Intrusion Detection Systems
731
8.9.1
Firewalls
731
8.9.2
Intrusion Detection Systems
739
8.10
Summary
742
Homework Problems and Questions
744
Wireshark Lab: SSL
752
IPsec Lab
752
Interview: Steven M. Bellovin
753
Chapter 9 Network Management
755
9.1
What Is Network Management?
756
9.2
The Infrastructure for Network Management
760
9.3
The Internet-Standard Management Framework
764
9.3.1
Structure of Management Information: SMI
766
9.3.2
Management Information Base: MIB
770

---

## Page 8

9.3.3
SNMP Protocol Operations and Transport Mappings
772
9.3.4
Security and Administration
775
9.4
ASN.1
778
9.5
Conclusion
783
Homework Problems and Questions
783
Interview: Jennifer Rexford
786
References
789
Index
823
xxiv
Table of Contents

---

## Page 9

COMPUTER
NETWORKING
A Top-Down Approach
SIXTH EDITION

---

## Page 10

This page intentionally left blank
