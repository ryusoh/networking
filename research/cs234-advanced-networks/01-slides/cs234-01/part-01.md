# cs234-01 - Part 01 (Pages 1-14)

---

## Page 1

CompSci 234/NetSys 210
Advanced Topics in Networking
Winter 2019
Unit 1: The Internet and
Layering Structure
Cheng-Hsin Hsu (<chsu@cs.nthu.edu.tw>)
Slide adopted from Kurose/Ross and Prof.  Venkatasubramanian
1

---

## Page 2

Agenda
´What is the Internet
´Network Edge
´Network Core: Circuit Switched
vs. Packet Switched
´Protocol Layers and UNIX
Sockets
´History and Internet design
philosophy
2

---

## Page 3

Network Evolution
´1st Gen (Circuit Switching), Telephone : wires
´Running a pair of wires to every home & office
´Dynamically constructing a path from caller to
callee
´2nd Gen (Packet Switching), The Internet:
computing devices
´Data sent in independent chunks
´Each chunk contains the name of the final
destination.
´3rd Gen, Information-Centric Network? : data
´Don’t care where the data are from
´Supported by the network infrastructure? Or by
applications?
3

---

## Page 4

Internet Consists of ….
´Too many Connected
computing devices:
´hosts = end systems
´running network apps
´Communication links
´fiber, copper, radio, satellite
´transmission rate: bandwidth
´Packet switches: forward packets
(chunks of data)
´routers and switches
smartphone
PC
server
wireless
laptop
wired
links
wireless
links
4

---

## Page 5

Internet: Network of Networks
Mobile
Network
Global
ISP
Regional
ISP
Residential
Network
Institutional
Network
´Interconnected ISPs
5

---

## Page 6

Software Components in the
Internet
´Internet  standards
´RFC: Request for comments
´IETF: Internet Engineering Task
Force
´protocols control sending,
receiving of messages
´e.g., HTTP, TCP, IP,  802.11
6

---

## Page 7

What is a Protocol
´protocols define format, order of
messages sent and received among
network entities, and actions taken
on message transmission, receipt
´all communication
activity in Internet
governed by
protocols
TCP connection
response
<file>
time
TCP connection
request
7

---

## Page 8

The Internet Provides
Services
´Infrastructure that provides services
to applications:
´Web, VoIP, email, games, e-
commerce, social networks, …
´Programming interface to apps
´hooks that allow sending and receiving
app programs to “connect” to Internet:
socket APIs
´provides service options, analogous to
postal service: different classes
8

---

## Page 9

Agenda
´What is the Internet
´Network Edge
´Network Core: Circuit Switched
vs. Packet Switched
´Protocol Layers and UNIX
Sockets
´History and Internet design
philosophy
9

---

## Page 10

Access Networks
´Q: How to connect end systems to
edge router?
´residential access nets
´institutional access
networks (university, company)
´mobile access networks
(T-Mobile, A&T, Verizon..)
´Q: Main performance factors
´bandwidth (bits per
second) of access
network?
´shared versus dedicated?
10

---

## Page 11

Sample Wired Access
Network: ADSL
´use existing telephone line to central
office DSLAM
´data over DSL phone line goes to Internet
´voice over DSL phone line goes to
telephone net
ISP
central office
telephone
network
DSLAM
voice, data transmitted
at different frequencies over
dedicated line to central office
DSL
modem
splitter
DSL access
multiplexer
Q: Can you come
up with a shared
wired access
network technology?
11

---

## Page 12

Two Types of Wireless Access
Networks
´shared air medium with wireless hosts
´via base stations, or access points
wireless LANs:
§ within building (100 ft.)
§ 802.11b/g/n (WiFi): 11, 54, 450
Mbps transmission rate
wide-area wireless access
§ provided by telco (cellular)
operator, 10s km
§ between 1 and 10 Mbps
§ 3G, 4G: LTE
to Internet
12

---

## Page 13

Home Networks
to/from headend or
central office
cable or DSL modem
router, firewall, NAT
wired Ethernet (1 Gbps)
wireless access
point (WiFi)
wireless
devices
often combined
in single box
13

---

## Page 14

Enterprise Access Networks
´Typically used in companies, universities,
etc.
´10 Mbps, 100Mbps, 1Gbps, 10Gbps Ethernet
Ethernet
switch
institutional mail,
web servers
institutional router
institutional link to
ISP (Internet)
14
