# chapter-06-v6-0

---

## Page 1

Chapter 6
Wireless and
Mobile
Networks
rking: A
Top Down
Approach
6th edition
Jim Kurose, Keith
Ross
Addison-Wesley
March 2012
A note on the
We’re making these
They’re in PowerPoint form so you see the animations; and can add, modify,
and delete slides  (including this one) and slide content to suit your needs.
They obviously represent a lot of work on our part. In return for use, we only
ask the following:
v If you use these slides (e.g., in a class) that you mention their source
(after all, we’d like people to use our book!)
v If you post any slides on a www site, that you note that they are adapted
from (or perhaps identical to) our slides, and note our copyright of this
material.
Thanks and enjoy!  JFK/KWR
     All material copyright 1996-2012
     J.F Kurose and K.W. Ross, All Rights Reserved
Wireless, Mobile Networks
6-1

---

## Page 2

Wireless, Mobile Networks
6-2
Ch. 6: Wireless and Mobile
Networks
Background:
v # wireless (mobile) phone subscribers now
exceeds # wired phone subscribers (5-to-
equal
devices
§ laptops, Internet-enabled phones promise
anytime untethered Internet access
v two important (but different) challenges
§ wireless: communication over wireless link
§ mobility: handling the mobile user who changes
point of attachment to network

---

## Page 3

Wireless, Mobile Networks
6-3
Chapter 6 outline
6.1 Introduction
Wireless
§ CD
6.3 IEEE 802.11
wireless LANs (“Wi-
Fi”)
6.4 Cellular Internet
Access
§ architecture
§ standards (e.g., GSM)
Mobility
6.5 Principles:
ssing and
6.7 Handling mobility in
cellular networks
6.8 Mobility and higher-
layer protocols
6.9 Summary

---

## Page 4

Wireless, Mobile Networks
6-4
Elements of a wireless
network

---

## Page 5

Wireless, Mobile Networks
6-5
wireless hosts
v laptop, smartphone
v run applications
may be stationary
 does not
always mean
mobility
Elements of a wireless
network

---

## Page 6

Wireless, Mobile Networks
6-6
 base station
v typically connected
to wired network
relay - responsible
for sending packets
ost(s) in
its “area”
§ e.g., cell towers,
802.11 access
points
Elements of a wireless
network

---

## Page 7

Wireless, Mobile Networks
6-7
 wireless link
v typically used to
connect mobile(s)
to base station
also used as
ordinates
link access
v various data rates,
transmission
distance
Elements of a wireless
network

---

## Page 8

Wireless, Mobile Networks
6-8
Characteristics of selected
wireless links
Indoor
10-30m
Outdoor
50-200m
Mid-range
outdoor
200m – 4 Km
Long-range
outdoor
5Km – 20 Km
.056
.384
1
54
2G: IS-95, CDMA, GSM
2.5G: UMTS/WCDMA, CDMA2000
802.15
802.11a,g
point
200
802.11n
Data rate (Mbps)

---

## Page 9

Wireless, Mobile Networks
6-9
 infrastructure
mode
v base station
connects mobiles
into wired network
viding
connection into
wired network
Elements of a wireless
network

---

## Page 10

Wireless, Mobile Networks 6-10
ad hoc mode
v no base stations
v nodes can only
transmit to other

ganize
themselves into
a network: route
among
themselves
Elements of a wireless
network

---

## Page 11

Wireless, Mobile Networks 6-11
Wireless network
taxonomy
single hop
multiple hops
infrastructure
no
infrastructure
host connects to
base
no base station, no
connection to larger
Internet (Bluetooth,
ad hoc nets)
host may have to
 through several
no base station, no
connection to larger
Internet. May have to
relay to reach other
a given wireless node
MANET, VANET

---

## Page 12

Wireless, Mobile Networks 6-12
Chapter 6 outline
6.1 Introduction
Wireless
§ CD
6.3 IEEE 802.11
wireless LANs (“Wi-
Fi”)
6.4 Cellular Internet
Access
§ architecture
§ standards (e.g., GSM)
Mobility
6.5 Principles:
ssing and
6.7 Handling mobility in
cellular networks
6.8 Mobility and higher-
layer protocols
6.9 Summary

---

## Page 13

Wireless, Mobile Networks 6-13
Wireless Link Characteristics (1)
important differences from wired link ….
§ decreased signal strength: radio signal
attenuates
s through matter
sta
encies
(e.g., 2.4 GHz) shared by other devices
(e.g., phone); devices (motors) interfere as
well
§ multipath propagation: radio signal reflects
off objects ground, arriving ad destination
at slightly different times
…. make communication across (even a point to
point) wireless link much more “difficult”

---

## Page 14

Wireless, Mobile Networks 6-14
Wireless Link Characteristics (2)
v SNR: signal-to-noise
ratio
§ larger SNR – easier to
extract signal
trade
§ given physical layer:
increase power ->
increase SNR->decrease
BER
§ given SNR: choose
physical layer that meets
BER requirement, giving
highest thruput
• SNR may change with
10
20
30
40
QAM256 (8 Mbps)
QAM16 (4 Mbps)
BPSK (1 Mbps)
SNR(dB)
10-1
10-2
10-3
10-6
10-7

---

## Page 15

Wireless, Mobile Networks 6-15
Wireless network characteristics
Multiple wireless senders and receivers create
additional problems (beyond multiple access):
A
C
Hidden terminal problem
v B, A hear each other
v B, C hear each other
v A, C can not hear each
other means A, C
unaware of their
interference at B
A
B
C
space
l
Signal attenuation:
v B, A hear each other
v B, C hear each other
v A, C can not hear each
other interfering at B

---

## Page 16

Wireless, Mobile Networks 6-16
Code Division Multiple Access
(CDMA)
v unique “code” assigned to each user;
i.e., code set partitioning
§ all users share same frequency, but each
user has own
ence (i.e.,
code) to enc
inte
)
v encoded signal = (original data) X
(chipping sequence)
v decoding: inner-product of encoded
signal and chipping sequence

---

## Page 17

Wireless, Mobile Networks 6-17
CDMA encode/decode
d1 = -1
1 1 1
1
1-
1-
1-
1-
Zi,m= di.cm
d0 = 1
1
1 1 1
1
1-
1-
1-
1-
1 1 1
1
1-
1-
1-
1-
slot 0
channel
slot 1
annel
channel output Zi,m
sender
code
data
bits
slot 1
slot 0
d1 = -1
d0 = 1
1 1 1
1
1-
1-
1-
1-
1 1 1
1
1-
1-
1-
1-
1 1 1
1
1-
1-
1-
1-
1 1 1
1
1-
1-
1-
1-
slot 0
channel
output
slot 1
channel
output
receiver
code
received
input
Di = Σ Zi,m.cm
m=1
M

---

## Page 18

Wireless, Mobile Networks 6-18
CDMA: two-sender interference
using same code as
sender 1, receiver
recovers sender 1’s
original data from
summed channel
data!
Sender 1
S
channel sums
together
transmissions by
sender 1 and 2

---

## Page 19

Wireless, Mobile Networks 6-19
Chapter 6 outline
6.1 Introduction
Wireless
§ CD
6.3 IEEE 802.11
wireless LANs (“Wi-
Fi”)
6.4 Cellular Internet
Access
§ architecture
§ standards (e.g., GSM)
Mobility
6.5 Principles:
ssing and
6.7 Handling mobility in
cellular networks
6.8 Mobility and higher-
layer protocols
6.9 Summary

---

## Page 20

Wireless, Mobile Networks 6-20
IEEE 802.11 Wireless LAN
802.11b
v 2.4-5 GHz unlicensed
spectrum
v
v
spectru
physical layer
§ all hosts use same
chipping code
802.11a
§ 5-6 GHz range
§ up to 54 Mbps
1g
802.11n: multiple
antennae
§ 2.4-5 GHz range
§ up to 200 Mbps
v all use CSMA/CA for multiple access
v all have base-station and ad-hoc network
versions

---

## Page 21

Wireless, Mobile Networks 6-21
802.11 LAN architecture
v wireless host
communicates with
base station
base station = access
cell”) in
infrastructure mode
contains:
§ wireless hosts
§ access point (AP): base
station
§ ad hoc mode: hosts
only
BSS 1
BSS 2
Internet
or router

---

## Page 22

Wireless, Mobile Networks 6-22
802.11: Channels,
association
v 802.11b: 2.4GHz-2.485GHz spectrum divided
into 11 channels at different frequencies
§ AP admin ch
 for AP
v host:
§ scans channels, listening for beacon frames
containing AP’s name (SSID) and MAC
address
§ selects AP to associate with
§ may perform authentication [Chapter 8]
§ will typically run DHCP to get IP address in
AP’s subnet

---

## Page 23

Wireless, Mobile Networks 6-23
802.11: passive/active
scanning
AP 1
BBS 2
BBS 1
1
1
passive scanning:
(1)beacon frames sent from APs
(2)association Request frame
sent: H1 to selected AP
(3)association Response frame
sent from  selected AP to H1
AP 2
BBS 2
BBS 1
1
2
2
active  scanning:
(1) Probe Request frame broadcast
from H1
(2) Probe Response frames sent
from APs
(3) Association Request frame sent:
H1 to selected AP
(4) Association Response frame sent
from selected AP to H1

---

## Page 24

Wireless, Mobile Networks 6-24
IEEE 802.11: multiple
access
v avoid collisions: 2+ nodes transmitting at same
time
v 802.11: CSMA - sense before transmitting
§ don’t collide wit
sion by other node
due
§ can’t sense all collisions in any case: hidden terminal,
fading
§ goal: avoid collisions: CSMA/C(ollision)A(voidance)
space
A
B
C
A
B
C
A’s signal
strength
C’s signal
strength

---

## Page 25

Wireless, Mobile Networks 6-25
IEEE 802.11 MAC Protocol:
CSMA/CA
802.11 sender
1 if sense channel idle for DIFS  then
transmit entire frame (no CD)
2 if sense channel busy t
transmit
if no ACK, increase random backoff interval,
repeat 2
802.11 receiver

- if frame received OK
   return ACK after SIFS (ACK needed due to
hidden terminal problem)
sender
receiver
DIFS
ta
SIFS
ACK

---

## Page 26

Wireless, Mobile Networks 6-26
Avoiding collisions (more)
idea:  allow sender to “reserve” channel rather
than random access of data frames: avoid
collisions of long  data frames
§ RTS
y’re
short)
v BS broadcasts clear-to-send CTS in response
to RTS
v CTS heard by all nodes
§ sender transmits data frame
§ other stations defer transmissions
avoid data frame collisions completely
using small reservation packets!

---

## Page 27

Wireless, Mobile Networks 6-27
Collision Avoidance: RTS-CTS
exchange
AP
A
B
time
RTS(A)
RTS(B)
DATA (A)
ACK(A)
ACK(A)
n collision
defer

---

## Page 28

Wireless, Mobile Networks 6-28
frame
control
duration address
1
address
2
address
address
payload
CRC
2
2
6
6
6
2
6
0 - 2312
4
seq
802.11 frame:
addressing
Address 2: MAC address
of wireless host or AP
transmitting this frame
Address 1:
of wireless host or AP
to receive this frame
Address 3: MAC
address
of router interface to
which AP is attached
hoc
mode

---

## Page 29

Wireless, Mobile Networks 6-29
Internet
router
H1
AP MAC addr  H1 MAC addr R1 MAC addr
address 1
address 2
address 3
802.11 frame
R1 MAC addr  H1 MAC addr
dest. address
source address
802.3 frame
802.11 frame:
addressing

---

## Page 30

Wireless, Mobile Networks 6-30
frame
c
duration address ad
dress
payload
CRC
2
2
6
6
6
2
6
0 - 2312
4
Type
From
AP
Subtype
To
AP
More
frag
WEP
More
data
Power
mgt
Retry
Rsvd
Protocol
version
2
2
4
1
1
1
1
1
1
1
1
duration of reserved
transmission time (RTS/CTS)
frame seq #
(for RDT)
frame type
(RTS, CTS, ACK, data)
802.11 frame: more

---

## Page 31

Wireless, Mobile Networks 6-31
802.11: mobility within same
subnet
v H1 remains in
same IP subnet:
IP address can
remain same
is ass
with H1?
§ self-learning (Ch.
5): switch will
see frame from
H1 and
“remember”
which switch port
can be used to
reach H1
H1
BBS 2
BBS 1

---

## Page 32

Wireless, Mobile Networks 6-32
802.11: advanced
capabilities
Rate adaptation
v base station, mobile
dynamically change
modul
technique) as mobile
moves, SNR varies
QAM256 (8 Mbps)
QAM16 (4 Mbps)
BPSK (1 Mbps)
0
SNR(dB)
ER
10-1
10-2
10-3
-4
operating point

1. SNR decreases, BER
increase as node moves
away from base station
2. When BER becomes too
high, switch to lower
transmission rate but with
lower BER

---

## Page 33

Wireless, Mobile Networks 6-33
power management
v node-to-AP: “I am going to sleep
until next bea
§ nod
e
v beacon frame: contains list of
mobiles with AP-to-mobile frames
waiting to be sent
§ node will stay awake if AP-to-mobile
frames to be sent; otherwise sleep again
until next beacon frame
802.11: advanced
capabilities

---

## Page 34

Wireless, Mobile Networks 6-34
S
P
P
P
P
M
S
Master device
Slave device
Parked device (inactive)
P
802.15: personal area
network
v less than 10 m diameter
v replacement for cables
(mouse, keyboard,
headphones)
v maste
§ slaves request permission
to send (to master)
§ master grants requests
v 802.15: evolved from
Bluetooth specification
§ 2.4-2.5 GHz radio band
§ up to 721 kbps

---

## Page 35

Wireless, Mobile Networks 6-35
Chapter 6 outline
6.1 Introduction
Wireless
6.2 Wireless links
§ CD
6.3 IEEE 802.11
wireless LANs (“Wi-
Fi”)
6.4 Cellular Internet
access
§ architecture
§ standards (e.g., GSM)
Mobility
6.5 Principles:
ssing and
6.7 Handling mobility in
cellular networks
6.8 Mobility and higher-
layer protocols
6.9 Summary

---

## Page 36

Wireless, Mobile Networks 6-36
Mobile
Switching
Center
blic telephone
network
Components of cellular network architectur
v connects cells to wired tel. net.
v manages call setup (more later!)
v handles mobility (more later!)
MSC
v covers
g
r
v base sta
(BS) analogous to
802.11 AP
v mobile users
attach to network
through BS
v air-interface:
physical and link
layer protocol
between mobile
and BS
cell
wired network

---

## Page 37

Wireless, Mobile Networks 6-37
Cellular networks: the first
hop
Two techniques for sharing
mobile-to-BS radio
spectrum
frequ
divide each channel into
time slots
v CDMA: code division
multiple access
frequency
bands

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
G

---

## Page 39

Wireless, Mobile Networks 6-39
3G (voice+data) network architect
MSC
SGSN
Public
telephone
network
Gateway
G
Serving GPRS Support Node (SGSN)
Gateway GPRS Support Node (GGSN)
Public
Internet
GGSN
Key insight: new cellular data
network operates in parallel
(except at edge) with existing
cellular voice network
v voice network unchanged in core
v data network operates in parallel

---

## Page 40

Wireless, Mobile Networks 6-40
MSC
SGSN
Public
telephone
network
Gateway
G
Public
Internet
GGSN
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
3G (voice+data) network architect

---

## Page 41

Wireless, Mobile Networks 6-41
Chapter 6 outline
6.1 Introduction
Wireless
6.2 Wireless links
§ CD
6.3 IEEE 802.11
wireless LANs (“Wi-
Fi”)
6.4 Cellular Internet
Access
§ architecture
§ standards (e.g., GSM)
Mobility
6.5 Principles:
ssing and
6.7 Handling mobility in
cellular networks
6.8 Mobility and higher-
layer protocols
6.9 Summary

---

## Page 42

Wireless, Mobile Networks 6-42
What is mobility?
v spectrum of mobility, from the network
perspective:
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
“home” of mobile
(e.g., 128.119.40/24)
permanent address:
address in home
network, can always be
used to reach mobile
e.g., 128.119.40.186
home agent: entity that will
perform mobility functions on
behalf of mobile, when mobile is

---

## Page 44

Wireless, Mobile Networks 6-44
Mobility: more vocabulary
wide area
network
care-of-address: address
in
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
How do you contact a mobile
friend:
v search all phon
v call he
v expect her to let you
know where he/she
is?
I wonder where
Alice moved to?
Consider friend frequently
changing addresses, how
do you find he

---

## Page 46

Wireless, Mobile Networks 6-46
Mobility: approaches
v let routing handle it: routers advertise
permanent address of mobile-nodes-in-residence
via usual routi
e.
§ no
v let end-systems handle it:
§ indirect routing: communication from
correspondent to mobile goes through home
agent, then forwarded to remote
§ direct routing: correspondent gets foreign
address of mobile, sends directly to mobile

---

## Page 47

Wireless, Mobile Networks 6-47
v let routing handle it: routers advertise
permanent address of mobile-nodes-in-residence
via usual routi
e.
§ no
v let end-systems handle it:
§ indirect routing: communication from
correspondent to mobile goes through home
agent, then forwarded to remote
§ direct routing: correspondent gets foreign
address of mobile, sends directly to mobile
not
scalable
Mobility: approaches

---

## Page 48

Wireless, Mobile Networks 6-48
Mobility: registration
end result:
v foreign agent knows about mobile
v home agent knows location of mobile
home network
visited network
1
le contacts
foreign agent on
entering visited
network
foreign agent contacts home
agent home: “this mobile is
resident in my network”

---

## Page 49

Wireless, Mobile Networks 6-49
Mobility via indirect routing
wide area
network
h
n
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
foreign
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
§ permanent address: used by correspondent
(hence mobile location is transparent to
corresponde
for
v foreign agent functions may be done by
mobile itself
v triangle routing: correspondent-home-
network-mobile
§ inefficient when
correspondent, mobile
are in same network

---

## Page 51

Wireless, Mobile Networks 6-51
Indirect routing: moving between
networks
v suppose mobile user moves to another
network
§ registers w
n agent
§ home agent update care-of-address for
mobile
§ packets continue to be forwarded to
mobile (but with new care-of-address)
v mobility, changing foreign networks
transparent: on going connections can be
maintained!

---

## Page 52

1
2
3
4
Wireless, Mobile Networks 6-52
Mobility via direct routing
h
n
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
Mobility via direct routing:
comments
v overcome triangle routing problem
v non-transparent to correspondent:
corresponde
re-of-address
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
t
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
Accommodating mobility with direct
routing
v anchor foreign agent: FA in first visited
network
v data always routed first to anchor FA
v when mobile
A arranges
5

---

## Page 55

Wireless, Mobile Networks 6-55
Chapter 6 outline
6.1 Introduction
Wireless
6.2 Wireless links
§ CD
6.3 IEEE 802.11
wireless LANs (“Wi-
Fi”)
6.4 Cellular Internet
Access
§ architecture
§ standards (e.g., GSM)
Mobility
6.5 Principles:
ssing and
6.7 Handling mobility in
cellular networks
6.8 Mobility and higher-
layer protocols
6.9 Summary

---

## Page 56

Wireless, Mobile Networks 6-56
Mobile IP
v RFC 3344
v has many features we’ve seen:
enc
)
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
R bit: registration
required
H,
foreign agent

---

## Page 59

Wireless, Mobile Networks 6-59
Mobile IP: registration
example
visited network: 79.129.13/24
home agent
HA: 128.119.40.7
foreign agent
COA: 79.129.13.2
mobile agent
MA: 128.119.40.186
identification:714
….
registration
reply
HA: 128.119.40.7
MA: 128.119.40.186
Lifetime: 4999
Identification: 714
encapsulation format
….
registration
reply
HA: 128.119.40.7
MA: 128.119.40.186
Lifetime: 4999
Identification: 714
….
time
ICMP agent
adv.
COA:
79.129.13.2
Lifetime: 9999
identification: 714
encapsulation format
….

---

## Page 60

Wireless, Mobile Networks 6-60
Components of cellular network archite
correspondent
MSC
MSC
MSC
wired public
different cellular networks,
operated by different providers
recall:

---

## Page 61

Wireless, Mobile Networks 6-61
Handling mobility in cellular
networks
v home network: network of cellular
provider you subscribe to (e.g., Sprint
PCS, Verizon
ph

preferences, billing), information about
current location (could be in another
network)
v visited network: network in which
mobile currently resides
§ visitor location register (VLR): database
with entry for each user currently in
network

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
GSM: indirect routing to
mobile
 home network
2
home MSC consults HLR,
gets roaming number of
mo
home MSC sets up 2nd leg of call
to MSC in visited network
4
MSC in visited network completes
call through base station to mobile

---

## Page 63

Wireless, Mobile Networks 6-63
VLR
old BSS
new BSS
old
routing
new
routing
GSM: handoff with common
MSC
v handoff goal: route call
via new base station
ut interruption)

connectivity, less battery
drain)
§ load balance: free up
channel in current BSS
§ GSM doesnt mandate why
to perform handoff (policy),
only how (mechanism)
v handoff initiated by old
BSS

---

## Page 64

Wireless, Mobile Networks 6-64
VLR
old BSS
1
3
5
6
7
8
new BSS

1. old BSS informs MSC of impending
handoff, provides list of 1+ new BSSs
2. MSC sets up path (allocates resources)
r
ld BSS: ready
5. old BSS tells mobile: perform handoff to
new BSS
6. mobile, new BSS signal to activate new
channel
7. mobile signals via new BSS to MSC:
handoff complete.  MSC reroutes call
8 MSC-old-BSS resources released
GSM: handoff with common
MSC

---

## Page 65

Wireless, Mobile Networks 6-65
home network
Home
corresp
MSC
anchor MSC
MSC
MSC
(a) before handoff
GSM: handoff between
MSCs
v anchor MSC: first MSC
visited during call
ll remains routed
C
ain as
mobile moves to new
MSC
v optional path
minimization step to
shorten multi-MSC
chain

---

## Page 66

Wireless, Mobile Networks 6-66
home network
Home
corresp
MSC
anchor MSC
MSC
MSC
(b) after handoff
v anchor MSC: first MSC
visited during call
ll remains routed
C
ain as
mobile moves to new
MSC
v optional path
minimization step to
shorten multi-MSC
chain
GSM: handoff between
MSCs

---

## Page 67

Wireless, Mobile Networks 6-67
Mobility: GSM versus
Mobile IP
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
Home MSC: point of contact to obtain routable
add
atabase in
hom
nent phone
Home agent
Visited Syst
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
(MSRN), or
“roaming number”
Routable address for telephone call segment
between home MSC and  visited MSC, visible
to neither the mobile nor the correspondent.
Care-of-
address

---

## Page 68

Wireless, Mobile Networks 6-68
Wireless, mobility: impact on higher layer
protocols
v logically, impact should be minimal …
§ best effort service model remains unchanged
§ TCP and UDP
 over wireless,
v
§ packet loss/delay due to bit-errors (discarded
packets, delays for link-layer retransmissions),
and handoff
§ TCP interprets loss as congestion, will decrease
congestion window un-necessarily
§ delay impairments for real-time traffic
§ limited bandwidth of wireless links

---

## Page 69

Wireless, Mobile Networks 6-69
Chapter 6 summary
Wireless
v wireless links:
§ capacity, distan
v IEEE
Fi”)
§ CSMA/CA reflects
wireless channel
characteristics
v cellular access
§ architecture
§ standards (e.g., GSM,
3G, 4G LTE)
Mobility
v principles: addressing,
g to mobile
routing
§ care-of-addresses
v case studies
§ mobile IP
§ mobility in GSM
v impact on higher-layer
protocols
