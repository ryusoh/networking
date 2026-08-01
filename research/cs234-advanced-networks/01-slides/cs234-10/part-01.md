# cs234-10 - Part 01 (Pages 1-14)

---

## Page 1

CompSci 234/NetSys 210
Advanced Topics in Networking
Winter 2019
Unit 10: Software-Defined
Networks
Cheng-Hsin Hsu (<chsu@cs.nthu.edu.tw>)
Slide adopted from Prof. Yeh’s materials
1

---

## Page 2

Agenda
´Motivations
´Concepts
´OpenFlow Protocol
´Network Virtualization
´Virtual Switches
2

---

## Page 3

Network Switches are Too
Complex to Work with…
3
Million of lines
of source code
8521 RFCs
Barrier to entry
500M gates
10Gbytes RAM
Bloated
Power Hungry
Many complex functions baked into the infrastructure
OSPF, BGP, multicast, differentiated services,
Traffic Engineering, NAT, firewalls, MPLS, redundant layers, …
An industry with a “mainframe-mentality”
Specialized Packet
Forwarding Hardware
Operating
System
App
App
App
Routing, management, mobility management,
access control, VPNs, …

---

## Page 4

In Reality, Network Switches
Look like This
´
Lack of competition means slow innovation
´
Closed architecture means blurry, closed interfaces
´
Vertically integrated, complex, closed, and proprietary
´
Not suitable for experimental ideas (bad for researchers)
´
Not good for network admins and users
4
Operating System
App
App
App
Specialized Packet
Forwarding Hardware
Specialized Packet
Forwarding Hardware
Operating
System
App
App
App

---

## Page 5

Standardization Process
Makes it Even Worse
´ Driven by vendors
´ Consumers largely locked out
´ Least intersected denominator features
´ Slow innovation
5
Deployment
Idea
Standardize
Wait 10 years

---

## Page 6

Virtualization for Computations
and Networking
6
Windows
(OS)
Windows
(OS)
Linux
Mac
OS
x86
(Computer)
Windows
(OS)
App
App
Linux
Linux
Mac
OS
Mac
OS
Virtualization layer
App
Controller 1
App
App
Controller
2
Virtualization or “Slicing”
App
OpenFlow
Controller 1
NOX
(Network OS)
Controller
2
Network OS
Computations
Networking

---

## Page 7

From Today’s Network
Switches
7
Specialized Packet
Forwarding Hardware
Ap
p
Ap
p
Ap
p
Specialized Packet
Forwarding Hardware
Ap
p
Ap
p
Ap
p
Specialized Packet
Forwarding Hardware
Ap
p
Ap
p
Ap
p
Specialized Packet
Forwarding Hardware
Ap
p
Ap
p
Ap
p
Specialized Packet
Forwarding Hardware
Operating
System
Operating
System
Operating
System
Operating
System
Operating
System
Ap
p
Ap
p
Ap
p
Network Operating  System
App
App
App

---

## Page 8

To Software-Defined
Networking Switches
8
App
Simple Packet
Forwarding
Hardware
Simple Packet
Forwarding
Hardware
Simple Packet
Forwarding
Hardware
App
App
Simple Packet
Forwarding
Hardware
Simple Packet
Forwarding
Hardware
Network Operating  System

1. Open interface to hardware
3. Well-defined open API
2. At least one good operating system
Extensible, possibly open-source

---

## Page 9

Network Virtualization
Becomes a Reality
9
Simple Packet
Forwarding
Hardware
Network
Operating
System 1
Open interface to hardware
Virtualization or “Slicing” Layer
Network
Operating
System 2
Network
Operating
System 3
Network
Operating
System 4
App
App
App
App
App
App
App
App
Many operating systems, or
Multiple instances
Open interface to software
Isolated “slices”
Simple Packet
Forwarding
Hardware
Simple Packet
Forwarding
Hardware
Simple Packet
Forwarding
Hardware

---

## Page 10

Advantages of Software-
Defined Networking
´ More innovation in network services
´ Owners, operators, 3rd party developers, researchers can
improve the network
´ E.g. energy management, data center management, policy
routing, access control, denial of service, mobility
´ Lower barrier to entry for competition
´ Healthier markets for new players
´ Anything else?
´ Q: What are the cons?
´ Costs ß like other s/w, co-processors, FPGA, ASIC examples! ß
Why we have to learn P4 two days later….
´ Legacy networks/switches/hosts
´ New applications (more precisely, which cannot be realized
before SDN appears?)
10

---

## Page 11

Agenda
´Motivations
´Concepts
´OpenFlow Protocol
´Network Virtualization
´Virtual Switches
11

---

## Page 12

Traditional Routers are
Partitioned into…
12
§ Management plane/ configuration
§ Control plane / Decision:  OSPF
§ Data plane / Forwarding: Longest Prefix Matching
Adjacent Router
Router
Management/Policy plane
Configuration / CLI / GUI
Static routes
Control plane
OSPF
Neighbor
table
Link state
database
IP routing
table
Forwarding table
Data plane
Data plane
Control plane
OSPF
Adjacent Router
Data plane
Control plane
OSPF
Routing
Switching

---

## Page 13

Traditional Switches are
Partitioned into…
13
•
Software: Control Plane – The brain and
decision maker
•
Hardware: Data Plane – Packet forwarder

---

## Page 14

Key Concepts of SDN
´ Separate Control plane and Data plane entities
´ Network intelligence and state are logically centralized
´ The underlying network infrastructure is abstracted from the
applications
´ Execute or run Control plane software on general purpose
hardware
´ Decouple from specific networking hardware
´ Use commodity servers for routing
´ Have programmable data planes
´ Maintain, control and program data plane state from a central
entity
´ An architecture to control not just a networking device but
an entire network
14
