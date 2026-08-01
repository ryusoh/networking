# cs234-04 - Part 02 (Pages 11-20)

---

## Page 11

Data Center Requirements
´ Data centers run two types of apps
´ outward (user) facing (e.g., serving web pages to users)
´ internal computations (e.g., MapReduce for web
indexing)
´ Workloads often unpredictable:
´ Multiple services run concurrently within a DC
´ Demand for new services may spike unexpected
´Spike of demands for new services mean success!
´But this is when success spells trouble (if not prepared)!
´ Failures of servers are the norm
´ Resort to dynamic re-assignment of servers, jobs/tasks
(to deal with failures; data is often replicated across
racks, …
´ Traffic matrix between servers are constantly changing
11

---

## Page 12

Data Center Design Goals
´Agility – Any service, Any Server
´Turn servers into a single large pool
´Let services “breathe”: dynamically expand
and contract their footprint as needed
´Benefits ß three motivators for most
data center infrastructure projects!
´More productive service developers
´Lower cost
´Higher performance and reliability
12

---

## Page 13

How to Achieve Agility
´ Workload Management
´ rapidly launching a service program on a server
´ dynamical cluster scheduling and server
assignment
´ prepare virtual images
´ Storage Management
´ each server has access persistent data
´ (often) distributed file systems
´ Network Management
´ communicating with other servers: in or outside of
the data center
´ high performance and reliability
13

---

## Page 14

Requirements of (Data
Center) Networking
´ Uniform high capacity
´ Capacity between (any two) servers limited only by their
NICs
´ No need to consider topology when adding servers ß
predefined topology
´ Performance isolation
´ Traffic of one service should not be interfered by others
ß multi-tenants
´ Easy to manage: “Plug-&-Play” (layer-2 semantics
ß more later…)
´ Flat addressing, so any server can have any IP address
´ Server configuration is the same as in a LAN
´ Legacy apps (e.g., depending on broadcast) must work
14

---

## Page 15

Agenda
´Modern Data Centers
´Design Goals of Data Center
Networks
´(Old) Data Center Networks
´Fat-Tree Network Topology
´Virtual Layer 2 (VL2) Networks
15

---

## Page 16

Old Data Center Architecture
•
Hierarchical network
•
1+1 redundancy
•
Switches higher in the hierarchy handles more traffic
•
more expensive,
more efforts made
at availability à
scale-up design
•
Servers connect via 1
Gbps cateroty-5 cable
to Top-of-Rack (ToR) switches
•
Other links are mix of 1G,
10G; fiber, copper
16
Internet
CR
CR = Core Router
AR
AR
AR
AR=
Aggregate
Router
…
S
S
LB
LB
Data Center
Layer 3
Internet
S
S
A
A
A …
S
S
A
A
A …
…
Layer 2
Key:
• CR = L3 Core
Router
• AR = L3 Access
Router
• S = L2 Switch
• LB = Load
Balancer
• A = Top of Rack
switch

---

## Page 17

Does It Meet the
Requirements?
´ Uniform high capacity?
´ Performance isolation?
´ typically via VLANs
´ Agility in terms of dynamically adding or
shrinking servers?
´ Agility in terms of
adapting to failures,
and traffic dynamics?
´ Ease of management?
17
No. There exists a large
room for improvement

---

## Page 18

High Oversubscription Ratio
18
CR
CR
AR
AR
AR
AR
S
S
S
S
A
A
A …
S
S
A
A
A …
. . .
S
S
S
S
A
A
A …
S
S
A
A
A …
~ 5:1
~ 40:1
~ 200:1
´ Extremely limited server-to-server capacity

---

## Page 19

VLAN-based Isolation
19
CR
CR
AR
AR
AR
AR
S
S
S
S
S
S
S
S
S
S
S
S
IP subnet (VLAN) #1
~ 200:1
IP subnet (VLAN) #2
A
A
A …
A
A
A …
A
A
…
A
A …
A
A
A
´ Resource fragmentation

---

## Page 20

Tedious Configurations
20
CR
CR
AR
AR
AR
AR
S
S
S
S
S
S
S
S
S
S
S
S
IP subnet (VLAN) #1
~ 200:1
IP subnet (VLAN) #2
A
A
A …
A
A
A …
A
A
…
A
A …
A
A
A
Complicated manual
L2/L3 re-
configuration
OK, we need something new
