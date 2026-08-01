# ch06-chapter-6-v6.0 - Part 02 (Pages 36-69)

---

## Page 36

Wireless, Mobile Networks 6-36
Mobile
Switching
Center
Public telephone
network
Mobile
Switching
Center
Components of cellular network architecture
v connects cells to wired tel. net.
v manages call setup (more later!)
v handles mobility (more later!)
MSC
v covers geographical
region
v base station (BS)
analogous to 802.11 AP
v mobile users attach to
network through BS
v air-interface: physical
and link layer protocol
between mobile and BS
cell
wired network

---

## Page 37

Wireless, Mobile Networks 6-37
Cellular networks: the first hop
Two techniques for sharing
mobile-to-BS radio spectrum
v combined FDMA/TDMA:
divide spectrum in frequency
channels, divide each channel
into time slots
v CDMA: code division multiple
access
frequency
bands
time slots

---

## Page 38

Wireless, Mobile Networks 6-38
BSC
BTS
Base transceiver station (BTS)
Base station controller (BSC)
Mobile Switching Center (MSC)
Mobile subscribers
Base station system (BSS)
Legend
2G (voice) network architecture
MSC
Public
telephone
network
Gateway
MSC
G

---

## Page 39

Wireless, Mobile Networks 6-39
3G (voice+data) network architecture
radio
network
controller
MSC
SGSN
Public
telephone
network
Gateway
MSC
G
Serving GPRS Support Node (SGSN)
Gateway GPRS Support Node (GGSN)
Public
Internet
GGSN
G
Key insight: new cellular data
network operates in parallel
(except at edge) with existing
cellular voice network
v voice network unchanged in core
v data network operates in parallel

---

## Page 40

Wireless, Mobile Networks 6-40
radio
network
controller
MSC
SGSN
Public
telephone
network
Gateway
MSC
G
Public
Internet
GGSN
G
radio access network
Universal Terrestrial Radio
Access Network (UTRAN)
core network
General Packet Radio Service
(GPRS) Core Network
public
Internet
radio interface
(WCDMA, HSPA)
3G (voice+data) network architecture

---

## Page 41

Wireless, Mobile Networks 6-41
Chapter 6 outline
6.1 Introduction
Wireless
6.2 Wireless links,
characteristics
§ CDMA
6.3 IEEE 802.11 wireless
LANs (Wi-Fi)
6.4 Cellular Internet Access
§ architecture
§ standards (e.g., GSM)
Mobility
6.5 Principles: addressing and
routing to mobile users
6.6 Mobile IP
6.7 Handling mobility in
cellular networks
6.8 Mobility and higher-layer
protocols
6.9 Summary

---

## Page 42

Wireless, Mobile Networks 6-42
What is mobility?
v spectrum of mobility, from the network perspective:
no mobility
high mobility
mobile wireless user,
using same access
point
mobile user, passing
through multiple
access point while
maintaining ongoing
connections (like cell
phone)
mobile user,
connecting/
disconnecting from
network using
DHCP.

---

## Page 43

wide area
network
Wireless, Mobile Networks 6-43
Mobility: vocabulary
home network: permanent
home of mobile
(e.g., 128.119.40/24)
permanent address:
address in home
network, can always be
used to reach mobile
e.g., 128.119.40.186
home agent: entity that will
perform mobility functions on
behalf of mobile, when mobile is
remote

---

## Page 44

Wireless, Mobile Networks 6-44
Mobility: more vocabulary
wide area
network
care-of-address: address
in visited network.
(e.g., 79,129.13.2)
visited network: network in
which mobile currently
resides (e.g., 79.129.13/24)
permanent address: remains
constant (e.g., 128.119.40.186)
foreign agent: entity in
visited network that
performs mobility
functions on behalf of
mobile.
correspondent: wants
to communicate with
mobile

---

## Page 45

Wireless, Mobile Networks 6-45
How do you contact a mobile friend:
v search all phone books?
v call her parents?
v expect her to let you
know where he/she is?
I wonder where
Alice moved to?
Consider friend frequently changing
addresses, how do you find her?

---

## Page 46

Wireless, Mobile Networks 6-46
Mobility: approaches
v let routing handle it: routers advertise permanent address of
mobile-nodes-in-residence via usual routing table exchange.
§ routing tables indicate where each mobile located
§ no changes to end-systems
v let end-systems handle it:
§ indirect routing: communication from correspondent to
mobile goes through home agent, then forwarded to
remote
§ direct routing: correspondent gets foreign address of
mobile, sends directly to mobile

---

## Page 47

Wireless, Mobile Networks 6-47
v let routing handle it: routers advertise permanent address of
mobile-nodes-in-residence via usual routing table exchange.
§ routing tables indicate where each mobile located
§ no changes to end-systems
v let end-systems handle it:
§ indirect routing: communication from correspondent to
mobile goes through home agent, then forwarded to
remote
§ direct routing: correspondent gets foreign address of
mobile, sends directly to mobile
not
scalable
to millions of
mobiles
Mobility: approaches

---

## Page 48

wide area
network
Wireless, Mobile Networks 6-48
Mobility: registration
end result:
v foreign agent knows about mobile
v home agent knows location of mobile
home network
visited network
1
mobile contacts
foreign agent on
entering visited
network
2
foreign agent contacts home
agent home: this mobile is
resident in my network

---

## Page 49

Wireless, Mobile Networks 6-49
Mobility via indirect routing
wide area
network
home
network
visited
network
3
2
4
1
correspondent
addresses packets
using home address of
mobile
home agent intercepts
packets, forwards to
foreign agent
foreign agent
receives packets,
forwards to mobile
mobile replies
directly to
correspondent

---

## Page 50

Wireless, Mobile Networks 6-50
Indirect Routing: comments
v mobile uses two addresses:
§ permanent address: used by correspondent (hence
mobile location is transparent to correspondent)
§ care-of-address: used by home agent to forward
datagrams to mobile
v foreign agent functions may be done by mobile itself
v triangle routing: correspondent-home-network-
mobile
§ inefficient when
correspondent, mobile
are in same network

---

## Page 51

Wireless, Mobile Networks 6-51
Indirect routing: moving between networks
v suppose mobile user moves to another network
§ registers with new foreign agent
§ new foreign agent registers with home agent
§ home agent update care-of-address for mobile
§ packets continue to be forwarded to mobile (but
with new care-of-address)
v mobility, changing foreign networks transparent: on
going connections can be maintained!

---

## Page 52

1
2
3
4
Wireless, Mobile Networks 6-52
Mobility via direct routing
home
network
visited
network
correspondent
requests, receives
foreign address of
mobile
correspondent forwards
to foreign agent
foreign agent
receives packets,
forwards to mobile
mobile replies
directly to
correspondent

---

## Page 53

Wireless, Mobile Networks 6-53
Mobility via direct routing: comments
v overcome triangle routing problem
v non-transparent to correspondent: correspondent
must get care-of-address from home agent
§ what if mobile changes visited network?
1
2
3
4

---

## Page 54

Wireless, Mobile Networks 6-54
wide area
network
1
foreign net  visited
at session start
anchor
foreign
agent
2
4
new foreign
agent
3
correspondent
agent
correspondent
new
foreign
network
Accommodating mobility with direct routing
v anchor foreign agent: FA in first visited network
v data always routed first to anchor FA
v when mobile moves: new FA arranges to have
data forwarded from old FA (chaining)
5

---

## Page 55

Wireless, Mobile Networks 6-55
Chapter 6 outline
6.1 Introduction
Wireless
6.2 Wireless links,
characteristics
§ CDMA
6.3 IEEE 802.11 wireless
LANs (Wi-Fi)
6.4 Cellular Internet Access
§ architecture
§ standards (e.g., GSM)
Mobility
6.5 Principles: addressing and
routing to mobile users
6.6 Mobile IP
6.7 Handling mobility in
cellular networks
6.8 Mobility and higher-layer
protocols
6.9 Summary

---

## Page 56

Wireless, Mobile Networks 6-56
Mobile IP
v RFC 3344
v has many features weve seen:
§ home agents, foreign agents, foreign-agent registration,
care-of-addresses, encapsulation (packet-within-a-
packet)
v three components to standard:
§ indirect routing of datagrams
§ agent discovery
§ registration with home agent

---

## Page 57

Wireless, Mobile Networks 6-57
Mobile IP: indirect routing
Permanent address:
128.119.40.186
Care-of address:
79.129.13.2
dest: 128.119.40.186
packet sent by
correspondent
dest: 79.129.13.2
dest: 128.119.40.186
packet sent by home agent to foreign
agent: a packet within a packet
dest: 128.119.40.186
foreign-agent-to-mobile packet

---

## Page 58

Wireless, Mobile Networks 6-58
Mobile IP: agent discovery
v agent advertisement: foreign/home agents advertise
service by broadcasting ICMP messages (typefield = 9)
RBHFMGV
bits
reserved
type = 16
type = 9
code = 0
checksum
router address
standard
ICMP fields
mobility agent
advertisement
extension
length
sequence #
registration lifetime
0 or more care-of-
addresses
0
8
16
24
R bit: registration
required
H,F bits: home and/or
foreign agent

---

## Page 59

Wireless, Mobile Networks 6-59
Mobile IP: registration example
visited network: 79.129.13/24
home agent
HA: 128.119.40.7
foreign agent
COA: 79.129.13.2
mobile agent
MA: 128.119.40.186
registration req.
COA: 79.129.13.2
HA: 128.119.40.7
MA: 128.119.40.186
Lifetime: 9999
identification:714
….
registration reply
HA: 128.119.40.7
MA: 128.119.40.186
Lifetime: 4999
Identification: 714
encapsulation format
….
registration reply
HA: 128.119.40.7
MA: 128.119.40.186
Lifetime: 4999
Identification: 714
….
time
ICMP agent adv.
COA:
79.129.13.2
….
registration req.
COA: 79.129.13.2
HA: 128.119.40.7
MA: 128.119.40.186
Lifetime: 9999
identification: 714
encapsulation format
….

---

## Page 60

Wireless, Mobile Networks 6-60
Components of cellular network architecture
correspondent
MSC
MSC
MSC
MSC
MSC
wired public
telephone
network
different cellular networks,
operated by different providers
recall:

---

## Page 61

Wireless, Mobile Networks 6-61
Handling mobility in cellular networks
v home network: network of cellular provider you
subscribe to (e.g., Sprint PCS, Verizon)
§ home location register (HLR): database in home network
containing permanent cell phone #, profile information
(services, preferences, billing), information about
current location (could be in another network)
v visited network: network in which mobile currently
resides
§ visitor location register (VLR): database with entry for
each user currently in network
§ could be home network

---

## Page 62

Wireless, Mobile Networks 6-62
Public
switched
telephone
network
mobile
user
home
Mobile
Switching
Center
HLR
home
network
visited
network
correspondent
Mobile
Switching
Center
VLR
GSM: indirect routing to mobile
1
call routed
to home network
2
home MSC consults HLR,
gets roaming number of
mobile in visited network
3
home MSC sets up 2nd leg of call
to MSC in visited network
4
MSC in visited network completes
call through base station to mobile

---

## Page 63

Wireless, Mobile Networks 6-63
Mobile
Switching
Center
VLR
old BSS
new BSS
old
routing
new
routing
GSM: handoff with common MSC
v handoff goal: route call via
new base station (without
interruption)
v reasons for handoff:
§ stronger signal to/from new BSS
(continuing connectivity, less
battery drain)
§ load balance: free up channel in
current BSS
§ GSM doesnt mandate why to
perform handoff (policy), only
how (mechanism)
v handoff initiated by old BSS

---

## Page 64

Wireless, Mobile Networks 6-64
Mobile
Switching
Center
VLR
old BSS
1
3
2
4
5
6
7
8
new BSS

1. old BSS informs MSC of impending
handoff, provides list of 1+ new BSSs
2. MSC sets up path (allocates resources)
to new BSS
3. new BSS allocates radio channel for
use by mobile
4. new BSS signals MSC, old BSS: ready
5. old BSS tells mobile: perform handoff to
new BSS
6. mobile, new BSS signal to activate new
channel
7. mobile signals via new BSS to MSC:
handoff complete.  MSC reroutes call
8 MSC-old-BSS resources released
GSM: handoff with common MSC

---

## Page 65

Wireless, Mobile Networks 6-65
home network
Home
MSC
PSTN
correspondent
MSC
anchor MSC
MSC
MSC
(a) before handoff
GSM: handoff between MSCs
v anchor MSC: first MSC
visited during call
§ call remains routed
through anchor MSC
v new MSCs add on to end of
MSC chain as mobile moves
to new MSC
v optional path minimization
step to shorten multi-MSC
chain

---

## Page 66

Wireless, Mobile Networks 6-66
home network
Home
MSC
PSTN
correspondent
MSC
anchor MSC
MSC
MSC
(b) after handoff
v anchor MSC: first MSC
visited during call
§ call remains routed
through anchor MSC
v new MSCs add on to end of
MSC chain as mobile moves
to new MSC
v optional path minimization
step to shorten multi-MSC
chain
GSM: handoff between MSCs

---

## Page 67

Wireless, Mobile Networks 6-67
Mobility: GSM versus Mobile IP
GSM element
Comment on GSM element
Mobile IP element
Home system
Network to which mobile user’s permanent
phone number belongs
Home
network
Gateway Mobile
Switching Center, or
“home MSC”. Home
Location Register
(HLR)
Home MSC: point of contact to obtain routable
address of mobile user. HLR: database in
home system containing  permanent phone
number, profile information, current location of
mobile user, subscription information
Home agent
Visited System
Network other than home system where
mobile user is currently residing
Visited
network
Visited Mobile
services Switching
Center.
Visitor Location
Record (VLR)
Visited MSC: responsible for setting up calls
to/from mobile nodes in cells associated with
MSC. VLR: temporary database entry in
visited system, containing subscription
information  for each visiting mobile user
Foreign agent
Mobile Station
Roaming Number
(MSRN), or “roaming
number”
Routable address for telephone call segment
between home MSC and  visited MSC, visible
to neither the mobile nor the correspondent.
Care-of-
address

---

## Page 68

Wireless, Mobile Networks 6-68
Wireless, mobility: impact on higher layer protocols
v logically, impact should be minimal …
§ best effort service model remains unchanged
§ TCP and UDP can (and do) run over wireless, mobile
v … but performance-wise:
§ packet loss/delay due to bit-errors (discarded packets,
delays for link-layer retransmissions), and handoff
§ TCP interprets loss as congestion, will decrease congestion
window un-necessarily
§ delay impairments for real-time traffic
§ limited bandwidth of wireless links

---

## Page 69

Wireless, Mobile Networks 6-69
Chapter 6 summary
Wireless
v wireless links:
§ capacity, distance
§ channel impairments
§ CDMA
v IEEE 802.11 (Wi-Fi)
§ CSMA/CA reflects wireless
channel characteristics
v cellular access
§ architecture
§ standards (e.g., GSM, 3G,
4G LTE)
Mobility
v principles: addressing,
routing to mobile users
§ home, visited networks
§ direct, indirect routing
§ care-of-addresses
v case studies
§ mobile IP
§ mobility in GSM
v impact on higher-layer
protocols
