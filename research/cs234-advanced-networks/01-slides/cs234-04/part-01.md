# cs234-04 - Part 01 (Pages 1-10)

---

## Page 1

CompSci 234/NetSys 210
Advanced Topics in Networking
Winter 2019
Unit 4: Data Center
Networks
Cheng-Hsin Hsu (<chsu@cs.nthu.edu.tw>)
Slide adopted from Profs. Alizadeh, Jain, and Zhangs’ materials
1

---

## Page 2

Agenda
´Modern Data Centers
´Design Goals of Data Center
Networks
´(Old) Data Center Networks
´Fat-Tree Network Topology
´Virtual Layer 2 (VL2) Networks
2

---

## Page 3

What is Data Center
´ Large facilities with 10s of thousands of
networked servers
´ Compute, storage, and networking working in concert
´ Warehouse-Scale Computers
´ Huge investment: ~ 0.5 billion for large datacenter
3

---

## Page 4

Data Center Servers
4
1U
Source: G. Santana, “Data Center Virtualization Fundamentals,” Cisco Press, 2014.
1U=1.75 inch
Rack-Mounted
Blade
Tower

---

## Page 5

They Are Expensive
´ Server cost dominates
´ Networking cost nontrivial
´ Long provisioning timescale: Quarterly
purchases in the best scenario
´ Careful design is a Must
5
Amortized Cost*
Component
Sub-Components
~45%
Servers
CPU, memory, disk
~25%
Power infrastructure
UPS, cooling, power distribution
~15%
Power draw
Electrical utility costs
~15%
Network
Switches, links, transit
Source: the Cost of a Cloud: Research Problems in Data Center Networks.  Sigcomm CCR 2009.  Greenberg,
Hamilton, Maltz, Patel.

---

## Page 6

Cabling
Unstructured
Structured
6

---

## Page 7

Data Center Networks
7
10,000s of ports
Compute
Storage (Disk, Flash, …)
Provide the illusion of
“One Big Switch”

---

## Page 8

Data Center Traffic Growth
8
Source:  “Jupiter Rising: A Decade of Clos Topologies and Centralized Control in  Google’s Datacenter
Network”, SIGCOMM 2015.
Today: Petabits/s in one DC
Ø More than core of the Internet!
Q: WHY

---

## Page 9

In Fact, Data Center
Networks are Quite Unique!
9
Large-scale Web Application
Data
Structures
Traditional Application
App.
Logic
App
Logic
App
Logic
App
Logic
App
Logic
App
Logic
App
Logic
App
Logic
App
Logic
App
Logic
App
Logic
Alice
App
Logic
Who does she know?
What has she done?
Minni
e
Eric
Pics
Video
s
App
s
´ 1 user request à 1000s of
messages over DC network
´ ms of latency matter
´ Even at the tail (e.g., 99.9th
percentile)

---

## Page 10

Agenda
´Modern Data Centers
´Design Goals of Data Center
Networks
´(Old) Data Center Networks
´Fat-Tree Network Topology
´Virtual Layer 2 (VL2) Networks
10
