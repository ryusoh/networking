# ch06-chapter-6-v6.0 - Part 01 (Pages 1-35)

---

## Page 1

Chapter 6
Wireless and
Mobile Networks
Computer
Networking: A Top
Down Approach
6th edition
Jim Kurose, Keith Ross
Addison-Wesley
March 2012
A note on the use of these ppt slides:
Were making these slides freely available to all (faculty, students, readers).
Theyre in PowerPoint form so you see the animations; and can add, modify,
and delete slides  (including this one) and slide content to suit your needs.
They obviously represent a lot of work on our part. In return for use, we only
ask the following:
v If you use these slides (e.g., in a class) that you mention their source
(after all, wed like people to use our book!)
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
Ch. 6: Wireless and Mobile Networks
Background:
v # wireless (mobile) phone subscribers now exceeds #
wired phone subscribers (5-to-1)!
v # wireless Internet-connected devices equals #
wireline Internet-connected devices
§ laptops, Internet-enabled phones promise anytime untethered
Internet access
v two important (but different) challenges
§ wireless: communication over wireless link
§ mobility: handling the mobile user who changes point of
attachment to network

---

## Page 3

Wireless, Mobile Networks
6-3
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

## Page 4

Wireless, Mobile Networks
6-4
Elements of a wireless network
network
infrastructure

---

## Page 5

Wireless, Mobile Networks
6-5
wireless hosts
v laptop, smartphone
v run applications
v may be stationary (non-
mobile) or mobile
§ wireless does not always
mean mobility
Elements of a wireless network
network
infrastructure

---

## Page 6

Wireless, Mobile Networks
6-6
base station
v typically connected to
wired network
v relay - responsible for
sending packets between
wired network and
wireless host(s) in its
area
§ e.g., cell towers,
802.11 access points
Elements of a wireless network
network
infrastructure

---

## Page 7

Wireless, Mobile Networks
6-7
wireless link
v typically used to connect
mobile(s) to base station
v also used as backbone
link
v multiple access protocol
coordinates link access
v various data rates,
transmission distance
Elements of a wireless network
network
infrastructure

---

## Page 8

Wireless, Mobile Networks
6-8
Characteristics of selected wireless links
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
4
5-11
54
2G: IS-95, CDMA, GSM
2.5G: UMTS/WCDMA, CDMA2000
802.15
802.11b
802.11a,g
3G: UMTS/WCDMA-HSPDA, CDMA2000-1xEVDO
4G: LTWE WIMAX
802.11a,g point-to-point
200
802.11n
Data rate (Mbps)

---

## Page 9

Wireless, Mobile Networks
6-9
infrastructure mode
v base station connects
mobiles into wired
network
v handoff: mobile changes
base station providing
connection into wired
network
Elements of a wireless network
network
infrastructure

---

## Page 10

Wireless, Mobile Networks 6-10
ad hoc mode
v no base stations
v nodes can only
transmit to other
nodes within link
coverage
v nodes organize
themselves into a
network: route
among themselves
Elements of a wireless network

---

## Page 11

Wireless, Mobile Networks 6-11
Wireless network taxonomy
single hop
multiple hops
infrastructure
(e.g., APs)
no
infrastructure
host connects to
base station (WiFi,
WiMAX, cellular)
which connects to
larger Internet
no base station, no
connection to larger
Internet (Bluetooth,
ad hoc nets)
host may have to
relay through several
wireless nodes to
connect to larger
Internet: mesh net
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

## Page 13

Wireless, Mobile Networks 6-13
Wireless Link Characteristics (1)
important differences from wired link ….
§ decreased signal strength: radio signal attenuates as it
propagates through matter (path loss)
§ interference from other sources: standardized wireless
network frequencies (e.g., 2.4 GHz) shared by other
devices (e.g., phone); devices (motors) interfere as
well
§ multipath propagation: radio signal reflects off objects
ground, arriving ad destination at slightly different
times
…. make communication across (even a point to point)
wireless link much more difficult

---

## Page 14

Wireless, Mobile Networks 6-14
Wireless Link Characteristics (2)
v SNR: signal-to-noise ratio
§ larger SNR – easier to
extract signal from noise (a
good thing)
v SNR versus BER tradeoffs
§ given physical layer: increase
power -> increase SNR-
>decrease BER
§ given SNR: choose physical layer
that meets BER requirement,
giving highest thruput
• SNR may change with
mobility: dynamically adapt
physical layer (modulation
technique, rate)
10
20
30
40
QAM256 (8 Mbps)
QAM16 (4 Mbps)
BPSK (1 Mbps)
SNR(dB)
BER
10-1
10-2
10-3
10-5
10-6
10-7
10-4

---

## Page 15

Wireless, Mobile Networks 6-15
Wireless network characteristics
Multiple wireless senders and receivers create additional
problems (beyond multiple access):
A
B
C
Hidden terminal problem
v B, A hear each other
v B, C hear each other
v A, C can not hear each other
means A, C unaware of their
interference at B
A
B
C
As signal
strength
space
Cs signal
strength
Signal attenuation:
v B, A hear each other
v B, C hear each other
v A, C can not hear each other
interfering at B

---

## Page 16

Wireless, Mobile Networks 6-16
Code Division Multiple Access (CDMA)
v unique code assigned to each user; i.e., code set
partitioning
§ all users share same frequency, but each user has own
chipping sequence (i.e., code) to encode data
§ allows multiple users to coexist and transmit
simultaneously with minimal interference (if codes are
orthogonal)
v encoded signal = (original data) X (chipping
sequence)
v decoding: inner-product of encoded signal and
chipping sequence

---

## Page 17

Wireless, Mobile Networks 6-17
CDMA encode/decode
slot 1
slot 0
d1 = -1
1 1 1
1
1-
1-
1-
1-
Zi,m= di.cm
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
slot 0
channel
output
slot 1
channel
output
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
Di = S Zi,m.cm
m=1
M
M

---

## Page 18

Wireless, Mobile Networks 6-18
CDMA: two-sender interference
using same code as
sender 1, receiver recovers
sender 1’s original data
from summed channel
data!
Sender 1
Sender 2
channel sums together
transmissions by sender 1
and 2

---

## Page 19

Wireless, Mobile Networks 6-19
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

## Page 20

Wireless, Mobile Networks 6-20
IEEE 802.11 Wireless LAN
802.11b
v 2.4-5 GHz unlicensed spectrum
v up to 11 Mbps
v direct sequence spread spectrum
(DSSS) in physical layer
§ all hosts use same chipping
code
802.11a
§ 5-6 GHz range
§ up to 54 Mbps
802.11g
§ 2.4-5 GHz range
§ up to 54 Mbps
802.11n: multiple antennae
§ 2.4-5 GHz range
§ up to 200 Mbps
v all use CSMA/CA for multiple access
v all have base-station and ad-hoc network versions

---

## Page 21

Wireless, Mobile Networks 6-21
802.11 LAN architecture
v wireless host
communicates with base
station
§ base station = access point
(AP)
v Basic Service Set (BSS) (aka
cell) in infrastructure
mode contains:
§ wireless hosts
§ access point (AP): base
station
§ ad hoc mode: hosts only
BSS 1
BSS 2
Internet
hub, switch
or router

---

## Page 22

Wireless, Mobile Networks 6-22
802.11: Channels, association
v 802.11b: 2.4GHz-2.485GHz spectrum divided into 11
channels at different frequencies
§ AP admin chooses frequency for AP
§ interference possible: channel can be same as that
chosen by neighboring AP!
v host: must associate with an AP
§ scans channels, listening for beacon frames containing
APs name (SSID) and MAC address
§ selects AP to associate with
§ may perform authentication [Chapter 8]
§ will typically run DHCP to get IP address in APs
subnet

---

## Page 23

Wireless, Mobile Networks 6-23
802.11: passive/active scanning
AP 2
AP 1
H1
BBS 2
BBS 1
1
2
3
1
passive scanning:
(1) beacon frames sent from APs
(2) association Request frame sent: H1 to
selected AP
(3) association Response frame sent from
selected AP to H1
AP 2
AP 1
H1
BBS 2
BBS 1
1
2
2
3
4
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
IEEE 802.11: multiple access
v avoid collisions: 2+ nodes transmitting at same time
v 802.11: CSMA - sense before transmitting
§ dont collide with ongoing transmission by other node
v 802.11: no collision detection!
§ difficult to receive (sense collisions) when transmitting due to weak
received signals (fading)
§ cant sense all collisions in any case: hidden terminal, fading
§ goal: avoid collisions: CSMA/C(ollision)A(voidance)
space
A
B
C
A
B
C
As signal
strength
Cs signal
strength

---

## Page 25

Wireless, Mobile Networks 6-25
IEEE 802.11 MAC Protocol: CSMA/CA
802.11 sender
1 if sense channel idle for DIFS then
transmit entire frame (no CD)
2 if sense channel busy then
start random backoff time
timer counts down while channel idle
transmit when timer expires
if no ACK, increase random backoff interval,
repeat 2
802.11 receiver

- if frame received OK
return ACK after SIFS (ACK needed due to
hidden terminal problem)
sender
receiver
DIFS
data
SIFS
ACK

---

## Page 26

Wireless, Mobile Networks 6-26
Avoiding collisions (more)
idea: allow sender to reserve channel rather than random
access of data frames: avoid  collisions of long  data frames
v sender first transmits small request-to-send (RTS) packets
to BS using CSMA
§ RTSs may still collide with each other (but theyre short)
v BS broadcasts clear-to-send CTS in response to RTS
v CTS heard by all nodes
§ sender transmits data frame
§ other stations defer transmissions
avoid data frame collisions completely
using small reservation packets!

---

## Page 27

Wireless, Mobile Networks 6-27
Collision Avoidance: RTS-CTS exchange
AP
A
B
time
RTS(A)
RTS(B)
RTS(A)
CTS(A)
CTS(A)
DATA (A)
ACK(A)
ACK(A)
reservation collision
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
4
address
3
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
control
802.11 frame: addressing
Address 2: MAC address
of wireless host or AP
transmitting this frame
Address 1: MAC address
of wireless host or AP
to receive this frame
Address 3: MAC address
of router interface to
which AP is attached
Address 4: used only in
ad hoc mode

---

## Page 29

Wireless, Mobile Networks 6-29
Internet
router
H1
R1
AP MAC addr  H1 MAC addr R1 MAC addr
address 1
address 2
address 3
802.11 frame
R1 MAC addr  H1 MAC addr
dest. address
source address
802.3 frame
802.11 frame: addressing

---

## Page 30

Wireless, Mobile Networks 6-30
frame
control
duration address
1
address
2
address
4
address
3
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
control
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
802.11: mobility within same subnet
v H1 remains in same
IP subnet: IP address
can remain same
v switch: which AP is
associated with H1?
§ self-learning (Ch. 5):
switch will see frame
from H1 and
remember which
switch port can be
used to reach H1
H1
BBS 2
BBS 1

---

## Page 32

Wireless, Mobile Networks 6-32
802.11: advanced capabilities
Rate adaptation
v base station, mobile
dynamically change
transmission rate
(physical layer modulation
technique) as mobile
moves, SNR varies
QAM256 (8 Mbps)
QAM16 (4 Mbps)
BPSK (1 Mbps)
10
20
30
40
SNR(dB)
BER
10-1
10-2
10-3
10-5
10-6
10-7
10-4
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
v node-to-AP: I am going to sleep until next
beacon frame
§ AP knows not to transmit frames to this node
§ node wakes up before next beacon frame
v beacon frame: contains list of mobiles with AP-
to-mobile frames waiting to be sent
§ node will stay awake if AP-to-mobile frames to be
sent; otherwise sleep again until next beacon frame
802.11: advanced capabilities

---

## Page 34

Wireless, Mobile Networks 6-34
M
radius of
coverage
S
S
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
802.15: personal area network
v less than 10 m diameter
v replacement for cables (mouse,
keyboard, headphones)
v ad hoc: no infrastructure
v master/slaves:
§ slaves request permission to send
(to master)
§ master grants requests
v 802.15: evolved from Bluetooth
specification
§ 2.4-2.5 GHz radio band
§ up to 721 kbps

---

## Page 35

Wireless, Mobile Networks 6-35
Chapter 6 outline
6.1 Introduction
Wireless
6.2 Wireless links,
characteristics
§ CDMA
6.3 IEEE 802.11 wireless
LANs (Wi-Fi)
6.4 Cellular Internet access
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
