# cs234-12 - Part 02 (Pages 8-14)

---

## Page 8

Pros/Cons of WiFi
´Pros
´Mobility
´Simple Installation
´Inexpensive
´Cons
´Security
´Low bandwidth (compared to wired
networks)
´Interference with other devices (e.g.,
Bluetooth or even microwave oven!)
8

---

## Page 9

Mobile Supports May Come
From?
´ Link layer:
´ Examples: IEEE 802.11r Fast Roaming (not widely used) or cellular networks
´ Allows to handover among access points
´ Pro: No changes to clients (mobile nodes) needed
´ Con: Works only for specific wireless networks
´ Network layer:
´ Examples: Mobile IP, Proxy MIP
´ Transparent to transport protocols; thus applications are unaware of changes of
network attachment (handover)
´ Pro: Works for different wireless technologies
´ Con: Changes in OS for mobile nodes required
´ Application layer:
´ Examples: SIP registrations, DNS/dynDNS
´ Pro: No changes to clients (mobile nodes) needed
´ Con: Disruptive (an open connection will be dropped), thus only suited for quasi-static
attachment to network using DHCP or PPPoE for obtaining IP address, e.g. once a
day)
9

---

## Page 10

LPWAN – Low Power Wide
Area Network
10
Long Range
Short Range
Low BW
High BW
Medium BW
Medium Range
LPWAN
BlueTooth
BLE
ZigBee /
802.15.4
802.11a
802.11b
802.11g
802.11ac
802.11ad
802.11n
RFID /
NFC
WBAN
802.15.6
3G
2G
5G
4G
VSAT
WPAN
802.15.3
Become popular due to IoT and M2M applications

---

## Page 11

LPWANs Have Unique
Requirements
11
Power
Consumption
Bandwidth
Radio Chipset
Costs
Radio
Subscription Costs
Transmission
Latency
Number of
Base Stations
Geographical
Coverage, Penetration
LPWAN
3G/4G/5G
ZigBee
802.15.4

---

## Page 12

Targets of LPWANs
12
Requirement
Target
Long range
5 – 40km in the open field
Ultra low power
Battery lifetime of 10 years
Throughput
A few hundred bps or less
Radio chipset costs
$2 or less
Radio subscription costs
$1 per device and year
Transmission latency
Not a primary requirement for LPWAN
Required number of
base  stations for
coverage
Very low. LPWAN base stations are able to serve
thousands of devices.
Geographic coverage,
penetration
Excellent coverage also in remote and rural areas.
Good in building and in-ground penetration (e.g. for
reading power meters).

---

## Page 13

LPWAN over the ISM Band
13
LPWAN
Technology
Standard /
Specificiation
Range
Spectrum
ETSI LTN
ETSI GS LTN 001 - 003
40 km in open field
Any unlicensed
spectrum such as  ISM
(433MHz, 868MHz,
2.4GHz)
LoRaWAN
LoRa Alliance
LoRaWAN
2-5km in urban areas
<15km in suburban
areas
Any unlicensed spectrum
868MHz (Eu)
915MHz (US)
433MHz (Asia)
Weightless-N
Weightless SIG
<5km in urban areas  20-
30km in rural areas
800MHz – 1GHz (ISM)
RPMA
Proprietary (On-Ramp
Wireless), planned to
become an IEEE
standard
<65km line of sight
<20km non line of
sight
2.4GHz

---

## Page 14

14
Questions
<chsu@cs.nthu.edu.tw>
