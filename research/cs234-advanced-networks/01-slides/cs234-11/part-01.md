# cs234-11 - Part 01 (Pages 1-14)

---

## Page 1

CompSci 234/NetSys 210
Advanced Topics in Networking
Winter 2019
Unit 11: Dataplan
Programming with P4
Cheng-Hsin Hsu (<chsu@cs.nthu.edu.tw>)
Slide adopted from p4.org materials, in particular, from V. Gurevich’s tutorial
1

---

## Page 2

Agenda
´Why Dataplan Programming
´P4 Overview
´Main Data Types
´Packet Parsing
´Packet Processing
´Packet Deparsing
´Program Structure
´P4 Runtime
´Summary
2

---

## Page 3

Standard Telecommunications
Architecture
3
• Traditional architecture consists
of the three planes
• A Plane is a group of algorithms
• These algorithms
◦Process different kinds of traffic
◦Have different performance requirements
◦Are designed using different
methodologies
◦Are implemented using different
programming languages
◦Run on different hardware
Management Plane
Control Plane
OSPF
PIM-SM
BGP
Data Plane
LLDP

---

## Page 4

What Constitutes a NOS?
4
NOS
Management Plane
Control Plane
OSPF
PIM-SM
BGP
LLDP
Fixed
• Control Plane
• Management Plane
• How about Data Plane?
◦In many modern, high-speed devices it is
no longer a part of a NOS

---

## Page 5

Designing NOS for a Fixed
Data Plane
5
Management Plane
Control Plane
??
PIM-SM
BGP
???
That’s how I
want to build my
network!
Requirements
That’s how
packets should
be processed!
That’s how I
process the
packets!
Fixed

---

## Page 6

Bringing Data Plane back in
the NOS
6
Management Plane
Control Plane
??
PIM-SM
BGP
???
Data Plane
That’s how I
want to build my
network!
Requirements
That’s how
packets should
be processed!

---

## Page 7

Advantages of Data Plane
Programmability
7
C
• Control and Customization. Make the device behave exactly as you want
R
• Reliability. Reduce the risk by removing unused features
E
• Efficiency. Reduce energy consumption and expand scale by doing only what you need
A
• Add new features on your schedule/roadmap
T
• Telemetry. Be able to see inside the Data Plane
E
• Exclusivity and Differentiation. No need to share your IP with the chip vendor

---

## Page 8

Agenda
´Why Dataplan Programming
´P4 Overview
´Main Data Types
´Packet Parsing
´Packet Processing
´Packet Deparsing
´Program Structure
´P4 Runtime
´Summary
8

---

## Page 9

Brief History and Trivia
9
• May 2013:
• July 2014:
• Aug 2014:
• Sep 2014:
• Jan 2015:
• Mar 2015:
• Nov 2016:
• May 2017:
Initial idea and the name “P4”
First paper (SIGCOMM ACR)
First P414 Draft Specification (v0.9.8)
P414 Specification released (v1.0.0)
P414 v1.0.1
P414v1.0.2
P414 v1.0.3
P414v1.0.4
P416 – first commits
First P416 Draft Specification
P416 Specification released
• Apr 2016:
• Dec 2016:
• May 2017:
• . . .
• Official Spelling P4_16 on terminals, P416 in publications

---

## Page 10

The P4 Language
Consortium
10
•
Consortium of academic
and industry members
•
Open source, evolving,
domain-specific language
•
Permissive Apache license,
code on GitHub today
•
Membership is free:
contributions are welcome
•
Independent, set up as a
California nonprofit

---

## Page 11

P416 Design Goals
• Logical Evolution of P414
◦Same basic building blocks and concepts
◦More expressive and convenient to use
◦More formally defined semantics
■Strong Type System
◦Support for good software engineering practices
• Target-Independence
◦Support for a variety of targets (ASICs, FPGAs, NICs,
software)
■Language/Architecture separation
■Flexible data plane model
• Non-goals
◦New constructs
◦General-purpose programming
11

---

## Page 12

PISA: Protocol-Independent
Switch Architecture
12
Memory
ALU
Programmable
Parser
Programmable
Deparser
Programmable Match-Action Pipeline
Programmer declares the
headers that should be
recognized and their order
in the packet
Programmer defines the
tables and the exact
processing algorithm
Programmer declares
how the output packet will
look on the wire
Match+Action
Stage (Unit)

---

## Page 13

Sample Data Plane Program
on PISA
13
Programmable
Parser
Programmable
Deparser
Programmable Match-Action Pipeline
Ethernet
MAC
Address
Table
ACL
Rules
IPv4
Address
Table
L2
ACL
IPv4
IPv6
Address
Table
IPv4
Address
Table
MPLS
Table
MPLS
IPv6
Match+Action
Stage (Unit)

---

## Page 14

P414 Switch Model
14
Packet
Queuing,
Replication &
Scheduling
• Ingress Pipeline
• Egress Pipeline
• Traffic Manager
◦N:1 Relationships: Queueing, Congestion Control
◦1:N Relationships: Replication
◦Scheduling
Implicitly
Programmable
Deparser
Ingress pipeline
Egress pipeline
Programmable
Parser
