# cs234-13 - Part 04 (Pages 25-32)

---

## Page 25

Layering Structure of 3G/4G
Networks
25
PHY
MAC
PDCP
IP
L1
L2
L3
4G-PHY
4G-MAC
4G-RLC
IP
PDCP
Data
Plane
3G
4G LTE
RLC
Control
Plane
Data
Plane
Radio Resource Contol
Mobility Management
Connectivity Mangement
Connectivity
Management
Mobility
Management
Radio
Resource
Control
Session
Management
(SM)
EPS Session
Management
(ESM)
Mobility
Management
(GMM)
Radio Resource Control
(3G-RRC)
4G LTE
3G
Call Control
(CM/CC)
Mobility
Management
(MM)
Radio
Resource
Control
(4G-RRC)
Mobility
Management
(EMM)
PS Domain
PS Domain
CS Domain
EPS: Evolved Packet System
PDCP: Packet Data Convergence Protoco
RLC: Radio Link Control
MAC: Medium Access Control

---

## Page 26

Data-plane Protocols
26
´ Packet Data Convergence Protocol (PDCP) – header
compression, radio encryption
´ Radio Link Control (RLC) – Readies packets to be
transferred over the air interface
´ Medium Access Control (MAC) – Multiplexing, QoS
PDCP
RLC
@eNB  (IP)
PDCP
RLC
@UE   (IP)
MAC
PHY
MAC
PHY

---

## Page 27

Jobs of Control-plane
Protocols
27
Internet
Data-plane
Control-plane
P1: Radio conn. setup
P2: Location
update
P3: Conn.
context
(QoS)
Radio Resource Control (RRC)
Mobility Management (MM)
Connectivity Management

---

## Page 28

Control-Plane Protocols
28
PHY
MAC
PDCP
IP
L1
L2
L3
4G-PHY
4G-MAC
4G-RLC
IP
PDCP
Data
Plane
3G
4G LTE
RLC
Control
Plane
Data
Plane
Radio Resource Contol
Mobility Management
Connectivity Mangement
Connectivity
Management
Mobility
Management
Radio
Resource
Control
Session
Management
(SM)
EPS Session
Management
(ESM)
Mobility
Management
(GMM)
Radio Resource Control
(3G-RRC)
4G LTE
3G
Call Control
(CM/CC)
Mobility
Management
(MM)
Radio
Resource
Control
(4G-RRC)
Mobility
Management
(EMM)
PS Domain
PS Domain
CS Domain
• Variants of control functions
• Hybrid 4G/3G systems
• Voice versus data
• Circuit- versus packet-switched

---

## Page 29

Devices, Base Stations, Core
Networks
29
3G CS Gateway
MME
3G PS Gateway
3G
4G
Core
Network
User
Device
PS
CS
Base
Station
3G-RRC
MM
MM
CM
CM
4G-RRC
MM
CM

---

## Page 30

Control/Data Planes in LTE
30
• eNodeB, S-GW
and P-GW are
involved in
session setup,
handoff, routing
User
Equipme
nt (UE)
Gateway
(S-GW)
Mobility
Manageme
nt Entity
(MME)
Network
Gateway
(P-GW)
Home
Subscriber
Server (HSS)
\Station
(eNodeB)
Base
Station
Serving
Packet Data
Control Plane
Data Plane

---

## Page 31

Control-Plane Functions
Putting Everything Together
in LTE
31
User
Equipment
4G BS
MME
4G-
RRC
4G-
RRC
4G-
MM
4G-
MM
4G-
CM
4G-
CM
(1) Setup radio
connection
(2) Registration (attach)
(3) Authentication
(4) Setup Connectivity Context
(e.g., IP, routing path, QoS)
Others
(HSS, GWs)
HSS
P-
Gw
(5) data-plane delivery

---

## Page 32

32
Questions
<chsu@cs.nthu.edu.tw>
Q: What is the largest difference
between telecom networks and
IP networks?
