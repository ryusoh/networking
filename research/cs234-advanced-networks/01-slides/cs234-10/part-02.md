# cs234-10 - Part 02 (Pages 15-28)

---

## Page 15

Control Plane Programs
´ Control program operates on view of
network
´ Input: global network view (graph/database)
´ Output: configuration of each network device
´ Examples:
´ Routing
´ Traffic engineering
´ Deep packet inspection
´ etc.
´ Q: Are control programs distributed?
15

---

## Page 16

Abstractions in the Control
Plane
16
Network Operating System
Routing
Traffic
Engineering
Other
Applications
Well-defined API
Network Map
Abstraction
Forwarding
Forwarding
Forwarding
Forwarding
Separation of Data
and Control Plane
Network
Virtualization

---

## Page 17

Data Plane Abstraction
´ Purpose: Abstract away forwarding
hardware
´ Flexible
´ Behavior specified by control plane
´ Built from basic set of forwarding primitives
´ Minimal
´ Streamlined for speed and low-power
´ Control program not vendor-specific
´ OpenFlow is a sample protocol of such an
abstraction
17

---

## Page 18

OpenFlow in a Nutshell
18
Control Program A
Control Program B
Network OS
Packet
Forwarding
Packet
Forwarding
Packet
Forwarding
Flow
Table(s)
“If header = p, send to port 4”
“If header = ?, send to me” ß
a.k.a. PACKET_IN
“If header = q, overwrite header with r,
add header s, and send to ports 5,6”

---

## Page 19

Agenda
´Motivations
´Concepts
´OpenFlow Protocol
´Network Virtualization
´Virtual Switches
19

---

## Page 20

What is OpenFlow
´ Similar to an x86 instruction set for the network
´ Provide open interface to “black box” networking node
´ (i.e., Routers, L2/L3 switch) to enable visibility and
openness in network
´ Separation of control plane and data plane.
´ The data plane of an OpenFlow Switch consists of a Flow
Table, and an action associated with each flow entry
´ The control path consists of a controller which programs
the flow entry in the flow table
´ OpenFlow is based on an Ethernet switch, with an
internal flow-table, and a standardized interface
to add and remove flow entries
20

---

## Page 21

OpenFlow Networks
21
´ Controller (like ONOS)
´ OpenFlow protocol messages
´ Controlled channel
´ Processing
´Pipeline Processing
´Packet Matching
´Instructions & Action Set
´ OpenFlow switch (like
Open vSwtich)
´ Secure Channel (SC)
´ Flow Table
´Flow entry

---

## Page 22

Secure Channel (SC)
´ SC is the interface that connects each OpenFlow switch
to controller
´ A controller configures and manages the switch via this
interface.
´ Receives events from the switch
´ Send packets out the switch
´ SC establishes and terminates the connection between
OpneFlow Switch and the controller using the procedures
´ Connection Setup
´ Connection Interrupt
´ The SC connection is a TLS  connection.  Switch and
controller mutually authenticate by exchanging
certificates signed by a site-specific private key.
22

---

## Page 23

Flow Table in Switches,
Routers, and Chipsets
23
Rule
(exact & wildcard)
Action
Statistics
Rule
(exact & wildcard)
Action
Statistics
Rule
(exact & wildcard)
Action
Statistics
Rule
(exact & wildcard)
Default Action
Statistics
Flow 1.
Flow 2.
Flow 3.
Flow N.

---

## Page 24

A Flow Entry Consists of
24
§ Match fields
• Match against packets
§ Action
• Modify the action set or pipeline processing
§ Stats
• Update the matching packets
Match
Fields
Stats
Action
In Port
Src
MAC
Dst
MAC
Eth
Type
Vlan Id
IP Tos
IP
Proto
IP Src
IP Dst
TCP Src
Port
TCP Dst
Port
Layer 2
Layer 3
Layer 4
1.
Forward packet to port(s)
2.
Encapsulate and forward to controller
3.
Drop packet
4.
Send to normal processing pipeline

1. Packet
2. Byte counters

---

## Page 25

Different Usage of Flow
Entries
25
Switching
*
Switch
Port
MAC
src
MAC
dst
Eth
type
VLAN
ID
IP
Src
IP
Dst
IP
Prot
TCP
sport
TCP
dport
Action
*
00:1f:.. *
*
*
*
*
*
*
port6
Firewall
*
Switch
Port
MAC
src
MAC
dst
Eth
type
VLAN
ID
IP
Src
IP
Dst
IP
Prot
TCP
sport
TCP
dport
Action
*
*
*
*
*
*
*
*
22
drop
Routing
*
Switch
Port
MAC
src
MAC
dst
Eth
type
VLAN
ID
IP
Src
IP
Dst
IP
Prot
TCP
sport
TCP
dport
Action
*
*
*
*
*
5.6.7.8 *
*
*
port6

---

## Page 26

OpenFlow in Actions
26
Controller
OpenFlow
Switch
PC
OpenFlow
Switch
OpenFlow
Switch
OpenFlow
Protocol
Peter’s code
Rule
Action
Statistics
Rule
Action
Statistics
Rule
Action
Statistics
Peter
Q: What can possibly be in Peter’s code?
Q: What can possibly be in Peter’s code?

---

## Page 27

Sample OpenFlow
Application: Aggregation
´ Different Networks want different flow granularity (ISP,
Backbone,…)
´ Current solutions: MPLS, IP aggregation
´ OpenFlow-based solution:
´ Dynamically define flow granularity by wildcarding
arbitrary header fields
´ Granularity is on the switch flow
entries, no packet rewrite nor
encapsulation
´ Create meaningful bundles and
manage them using your own
software (reroute, monitor)
27

---

## Page 28

What if we need different
controllers?
´ Solution: virtualizing networks!
28
Normal L2/L3 Processing
Flow Table
Production VLANs
Research VLAN 1
Controller
Research VLAN 2
Flow Table
Controller
