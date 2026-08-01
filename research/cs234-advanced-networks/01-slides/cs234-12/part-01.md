# cs234-12 - Part 01 (Pages 1-7)

---

## Page 1

CompSci 234/NetSys 210
Advanced Topics in Networking
Winter 2019
Unit 12: Wireless Networks
Cheng-Hsin Hsu (<chsu@cs.nthu.edu.tw>)
Some Slide adopted from Peter Egli ‘s and Prof. Venkatasubramanian’s materials
1

---

## Page 2

Different Wireless Networks
2
WAN
MAN
LAN
PAN /
HAN
Bandwidth [Mb/s]
0.0001
0.001
0.01
0.1
1
10
Range
[km]  100
10
0.01
0.001
0.1
1
100
1000
IEEE 802.15.3a
UWB WPAN
110-480Mb/s
10m
IEEE 802.16 WiMAX
75Mb/s  1-6km
>>100 users
IEEE 802.11 WLAN/WiFi
54Mb/s (802.11a)
5Mb/s (802.11b)
30Mbps (802.11g)
500Mbps (802.11n)
100m
~100 users
HomeRF
<20Mbps
<150m
RFID
~0B/s
<1m
VSAT
Satellite
Kb/s…Mb/s
>300km
IEEE 802.22
WRAN
CDMA2000
EDGE (2.75G) 384KBps
UMTS (3G)
HSDPA(3.5G)
2Mbps / 15km
GSM (2G, HSCSD)
GPRS (2.5G)
CDMA
10Kb/s
15km
IEEE 802.15.1 BlueTooth
WPAN
723Kb/s
10m
IEEE 802.15.4 / ZigBee
WPAN / HAN
128Kb/s
100m
DECT
TDMA
552Kb/s
PAN:
HAN:
LAN:
Personal Area Network
Home Area Network
Local Area Network
MAN:
WAN:
Metropolitan Area Network
Wide Area Network
© Peter R. Egli 2015
Q: What is the difference between Green and Orange boxes?

---

## Page 3

Technology Advances in Wireless
Communication/Networks
´ Physical: Lower power consumption, faster
processor, larger battery (but still not enough)
´ Link: Better/more antenna, more aggressive
modulation and coding schemes
´ Network: Mobility support, resource allocation
(unicast/multicast)
´ Application: Adaptive QoS
´ Overall: Software-Defined Radio Networks
´ Cognitive Radio
´ Cloud Radio Access Networks (CRANs)
3

---

## Page 4

General Challenges in
Wireless Networks
´ Hidden terminal problem
´ Eavesdropping
´ Reliability
´ Fading
´ Shadowing
´ Multipath
´ Interference (co-channel, inter-channel)
´ Power control/consumption
´ Q: Why do we need power control?
´ Limited wireless spectrum: licensed versus unlicensed (ISM
band, industrial, scientific, and medical)
4
STA3
STA1
STA2
Q: ISM band is widely used nowadays, what is the side effect?

---

## Page 5

How Can We Increase Capacity
5
More
Antennas
Advanced multiple antenna
techniques to create
spatially  separated data
paths, e.g., 4 way  receive
diversity, 4x4 MIMO
Shannon’sLaw
! ≈
" · # · log2(1 + $%&)
Capacity
Spectrum
Antennas
SignalQuality
Interference
Mitigation
Advanced receivers and
antenna  techniques, e.g.,
LTE FeICIC/IC,  HSPA+
advanced devicereceiver
More
Spectrum
Making the best use of all
spectrum  types with more
licensed spectrum  as the top
priority, e.g., ASA, ~3.5  GHz,
unlicensedspectrum
~3.5GHz  &
ASA
Source: Qualcomm

---

## Page 6

WiFi is Probably and Most
Widely
´ Low cost WLAN solution over ISM band
´ 802.11 standard family:
´ IEEE 802.11a: 54 Mbit/s, 5 GHz standard (1999, shipping
products in 2001)
´ IEEE 802.11b: Enhancements to 802.11 to support 5.5 Mbit/s
and 11 Mbit/s (1999)
´ IEEE 802.11e: Enhancements: QoS, including packet bursting
(2005)
´ IEEE 802.11g: 54 Mbit/s, 2.4 GHz standard (backwards
compatible with b) (2003)
´ IEEE 802.11n: Higher-throughput improvements using MIMO
(multiple-input, multiple-output antennas) (September 2009)
´ IEEE 802.11ac: Very High Throughput <6 GHz; potential
improvements over 802.11n: better modulation scheme
(expected ~10% throughput increase), wider channels
(estimate in future time 80 to 160 MHz), multi user MIMO
(December 2013)
6
Note: 802.11 standards are more than radios!

---

## Page 7

Two WiFi Modes
7
Ad-hoc mode:
No access points; STAs communicate
directly with each other.
IBSS:
Independent Basic Service Set
BSS: Basic Service Set (Single cell)
AP: Access Points
Infrastructure mode:
Usage of access points interconnected with wired
LAN.
DS: Distribution System (wired LAN)
ESS: Extended Service Set (Multiple cells)
Handover
STA(STAtion)
STA(STAtion)
