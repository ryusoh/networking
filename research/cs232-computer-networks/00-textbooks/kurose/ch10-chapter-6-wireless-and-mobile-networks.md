# ch10-chapter-6-wireless-and-mobile-networks

---

## Page 1

CHAPTER 6
Wireless and
Mobile
Networks
513
In the telephony world, the past 15 years have arguably been the golden years of cel-
lular telephony. The number of worldwide mobile cellular subscribers increased
from 34 million in 1993 to nearly 5.5 billion subscribers by 2011, with the number
of cellular subscribers now surpassing the number of wired telephone lines. The
many advantages of cell phones are evident to all—anywhere, anytime, untethered
access to the global telephone network via a highly portable lightweight device.
With the advent of laptops, palmtops, smartphones, and their promise of anywhere,
anytime, untethered access to the global Internet, is a similar explosion in the use of
wireless Internet devices just around the corner?
Regardless of the future growth of wireless Internet devices, it’s already clear
that wireless networks and the mobility-related services they enable are here to stay.
From a networking standpoint, the challenges posed by these networks, particularly
at the link layer and the network layer, are so different from traditional wired com-
puter networks that an individual chapter devoted to the study of wireless and
mobile networks (i.e., this chapter) is appropriate.
We’ll begin this chapter with a discussion of mobile users, wireless links, and
networks, and their relationship to the larger (typically wired) networks to which
they connect. We’ll draw a distinction between the challenges posed by the wireless
nature of the communication links in such networks, and by the mobility that these
wireless links enable. Making this important distinction—between wireless and

---

## Page 2

514
CHAPTER 6
•
WIRELESS AND MOBILE NETWORKS
mobility—will allow us to better isolate, identify, and master the key concepts in
each area. Note that there are indeed many networked environments in which the
network nodes are wireless but not mobile (e.g., wireless home or office networks
with stationary workstations and large displays), and that there are limited forms of
mobility that do not require wireless links (e.g., a worker who uses a wired laptop at
home, shuts down the laptop, drives to work, and attaches the laptop to the com-
pany’s wired network). Of course, many of the most exciting networked environ-
ments are those in which users are both wireless and mobile—for example, a
scenario in which a mobile user (say in the back seat of car) maintains a Voice-over-IP
call and multiple ongoing TCP connections while racing down the autobahn at
160 kilometers per hour. It is here, at the intersection of wireless and mobility, that
we’ll find the most interesting technical challenges!
We’ll begin by illustrating the setting in which we’ll consider wireless commu-
nication and mobility—a network in which wireless (and possibly mobile) users are
connected into the larger network infrastructure by a wireless link at the network’s
edge. We’ll then consider the characteristics of this wireless link in Section 6.2. We
include a brief introduction to code division multiple access (CDMA), a shared-
medium access protocol that is often used in wireless networks, in Section 6.2. In
Section 6.3, we’ll examine the link-level aspects of the IEEE 802.11 (WiFi) wire-
less LAN standard in some depth; we’ll also say a few words about Bluetooth and
other wireless personal area networks. In Section 6.4, we’ll provide an overview of
cellular Internet access, including 3G and emerging 4G cellular technologies that
provide both voice and high-speed Internet access. In Section 6.5, we’ll turn our
attention to mobility, focusing on the problems of locating a mobile user, routing to
the mobile user, and “handing off” the mobile user who dynamically moves from
one point of attachment to the network to another. We’ll examine how these mobil-
ity services are implemented in the mobile IP standard and in GSM, in Sections 6.6
and 6.7, respectively. Finally, we’ll consider the impact of wireless links and mobil-
ity on transport-layer protocols and networked applications in Section 6.8.
6.1 Introduction
Figure 6.1 shows the setting in which we’ll consider the topics of wireless data com-
munication and mobility. We’ll begin by keeping our discussion general enough to
cover a wide range of networks, including both wireless LANs such as IEEE 802.11
and cellular networks such as a 3G network; we’ll drill down into a more detailed
discussion of specific wireless architectures in later sections. We can identify the
following elements in a wireless network:
•
Wireless hosts. As in the case of wired networks, hosts are the end-system devices
that run applications. A wireless host might be a laptop, palmtop, smartphone, or
desktop computer. The hosts themselves may or may not be mobile.

---

## Page 3

6.1
•
INTRODUCTION
515
•
Wireless links. A host connects to a base station (defined below) or to another
wireless host through a wireless communication link. Different wireless link
technologies have different transmission rates and can transmit over different
distances. Figure 6.2 shows two key characteristics (coverage area and link rate)
of the more popular wireless network standards. (The figure is only meant to pro-
vide a rough idea of these characteristics. For example, some of these types of
networks are only now being deployed, and some link rates can increase or
decrease beyond the values shown depending on distance, channel conditions,
and the number of users in the wireless network.) We’ll cover these standards
PUBLIC WIFI ACCESS: COMING SOON TO A LAMP POST NEAR YOU?
WiFi hotspots—public locations where users can find 802.11 wireless access—are
becoming increasingly common in hotels, airports, and cafés around the world. Most
college campuses offer ubiquitous wireless access, and it’s hard to find a hotel that
doesn’t offer wireless Internet access.
Over the past decade a number of cities have designed, deployed, and operated
municipal WiFi networks. The vision of providing ubiquitous WiFi access to the commu-
nity as a public service (much like streetlights)—helping to bridge the digital divide by
providing Internet access to all citizens and to promote economic development—is
compelling. Many cities around the world, including Philadelphia, Toronto, Hong
Kong, Minneapolis, London, and Auckland, have plans to provide ubiquitous wireless
within the city, or have already done so to varying degrees. The goal in Philadelphia
was to “turn Philadelphia into the nation’s largest WiFi hotspot and help to improve
education, bridge the digital divide, enhance neighborhood development, and reduce
the costs of government.” The ambitious program—an agreement between the city,
Wireless Philadelphia (a nonprofit entity), and the Internet Service Provider Earthlink—
built an operational network of 802.11b hotspots on streetlamp pole arms and traffic
control devices that covered 80 percent of the city. But financial and operational con-
cerns caused the network to be sold to a group of private investors in 2008, who later
sold the network back to the city in 2010. Other cities, such as Minneapolis, Toronto,
Hong Kong, and Auckland, have had success with smaller-scale efforts.
The fact that 802.11 networks operate in the unlicensed spectrum (and hence can
be deployed without purchasing expensive spectrum use rights) would seem to make
them financially attractive. However, 802.11 access points (see Section 6.3) have
much shorter ranges than 3G cellular base stations (see Section 6.4), requiring a larg-
er number of deployed endpoints to cover the same geographic region. Cellular data
networks providing Internet access, on the other hand, operate in the licensed spec-
trum. Cellular providers pay billions of dollars for spectrum access rights for their net-
works, making cellular data networks a business rather than municipal undertaking.
CASE HISTORY

---

## Page 4

later in the first half of this chapter; we’ll also consider other wireless link char-
acteristics (such as their bit error rates and the causes of bit errors) in Section 6.2.
In Figure 6.1, wireless links connect wireless hosts located at the edge of the net-
work into the larger network infrastructure. We hasten to add that wireless links
are also sometimes used within a network to connect routers, switches, and other
network equipment. However, our focus in this chapter will be on the use of
wireless communication at the network edge, as it is here that many of the most
exciting technical challenges, and most of the growth, are occurring.
•
Base station. The base station is a key part of the wireless network infrastructure.
Unlike the wireless host and wireless link, a base station has no obvious counterpart
in a wired network. Abase station is responsible for sending and receiving data (e.g.,
packets) to and from a wireless host that is associated with that base station. A base
station will often be responsible for coordinating the transmission of multiple wire-
less hosts with which it is associated. When we say a wireless host is “associated”
with a base station, we mean that (1) the host is within the wireless communication
516
CHAPTER 6
•
WIRELESS AND MOBILE NETWORKS
Network
infrastructure
Key:
Wireless access point
Coverage area
Wireless host
Wireless host in motion
Figure 6.1  Elements of a wireless network

---

## Page 5

distance of the base station, and (2) the host uses that base station to relay data
between it (the host) and the larger network. Cell towers in cellular networks and
access points in 802.11 wireless LANs are examples of base stations.
In Figure 6.1, the base station is connected to the larger network (e.g., the Inter-
net, corporate or home network, or telephone network), thus functioning as a
link-layer relay between the wireless host and the rest of the world with which
the host communicates.
Hosts associated with a base station are often referred to as operating in
infrastructure mode, since all traditional network services (e.g., address assign-
ment and routing) are provided by the network to which a host is connected via
the base station. In ad hoc networks, wireless hosts have no such infrastructure
with which to connect. In the absence of such infrastructure, the hosts themselves
must provide for services such as routing, address assignment, DNS-like name
translation, and more.
When a mobile host moves beyond the range of one base station and into the
range of another, it will change its point of attachment into the larger network
(i.e., change the base station with which it is associated)—a process referred to as
handoff. Such mobility raises many challenging questions. If a host can move,
how does one find the mobile host’s current location in the network so that data
can be forwarded to that mobile host? How is addressing performed, given that a
host can be in one of many possible locations? If the host moves during a TCP
6.1
•
INTRODUCTION
517
802.11a,g
802.11n
802.11b
802.15.1
3G: UMTS/WCDMA, CDMA2000
2G: IS-95, CDMA, GSM
Indoor
Outdoor
Mid range
outdoor
Long range
outdoor
10–30m
50–200m
200m–4Km
5Km–20Km
54 Mbps
4 Mbps
5–11 Mbps
200 Mbps
1 Mbps
384 Kbps
Enhanced 3G: HSPA
4G: LTE
802.11a,g point-to-point
Figure 6.2  Link characteristics of selected wireless network standards

---

## Page 6

connection or phone call, how is data routed so that the connection continues
uninterrupted? These and many (many!) other questions make wireless and
mobile networking an area of exciting networking research.
•
Network infrastructure. This is the larger network with which a wireless host
may wish to communicate.
Having discussed the “pieces” of a wireless network, we note that these
pieces can be combined in many different ways to form different types of wireless
networks. You may find a taxonomy of these types of wireless networks useful as
you read on in this chapter, or read/learn more about wireless networks beyond
this book. At the highest level we can classify wireless networks according to two
criteria: (i) whether a packet in the wireless network crosses exactly one wireless
hop or multiple wireless hops, and (ii) whether there is infrastructure such as a base
station in the network:
•
Single-hop, infrastructure-based. These networks have a base station that is
connected to a larger wired network (e.g., the Internet). Furthermore, all com-
munication is between this base station and a wireless host over a single wire-
less hop. The 802.11 networks you use in the classroom, café, or library; and
the 3G cellular data networks that we will learn about shortly all fall in this
category.
•
Single-hop, infrastructure-less. In these networks, there is no base station that is
connected to a wireless network. However, as we will see, one of the nodes in
this single-hop network may coordinate the transmissions of the other nodes.
Bluetooth networks (which we will study in Section 6.3.6) and 802.11 networks
in ad hoc mode are single-hop, infrastructure-less networks.
•
Multi-hop, infrastructure-based. In these networks, a base station is present that
is wired to the larger network. However, some wireless nodes may have to relay
their communication through other wireless nodes in order to communicate via
the base station. Some wireless sensor networks and so-called wireless mesh
networks fall in this category.
•
Multi-hop, infrastructure-less. There is no base station in these networks, and
nodes may have to relay messages among several other nodes in order to reach a
destination. Nodes may also be mobile, with connectivity changing among
nodes—a class of networks known as mobile ad hoc networks (MANETs). If
the mobile nodes are vehicles, the network is a vehicular ad hoc network
(VANET). As you might imagine, the development of protocols for such net-
works is challenging and is the subject of much ongoing research.
In this chapter, we’ll mostly confine ourselves to single-hop networks, and then
mostly to infrastructure-based networks.
518
CHAPTER 6
•
WIRELESS AND MOBILE NETWORKS

---

## Page 7

Let’s now dig deeper into the technical challenges that arise in wireless and
mobile networks. We’ll begin by first considering the individual wireless link, defer-
ring our discussion of mobility until later in this chapter.
6.2 Wireless Links and Network Characteristics
Let’s begin by considering a simple wired network, say a home network, with a
wired Ethernet switch (see Section 5.4) interconnecting the hosts. If we replace
the wired Ethernet with a wireless 802.11 network, a wireless network interface
would replace the host’s wired Ethernet interface, and an access point would
replace the Ethernet switch, but virtually no changes would be needed at the net-
work layer or above. This suggests that we focus our attention on the link layer
when looking for important differences between wired and wireless networks.
Indeed, we can find a number of important differences between a wired link and a
wireless link:
•
Decreasing signal strength. Electromagnetic radiation attenuates as it passes
through matter (e.g., a radio signal passing through a wall). Even in free space,
the signal will disperse, resulting in decreased signal strength (sometimes
referred to as path loss) as the distance between sender and receiver increases.
•
Interference from other sources. Radio sources transmitting in the same fre-
quency band will interfere with each other. For example, 2.4 GHz wireless
phones and 802.11b wireless LANs transmit in the same frequency band. Thus,
the 802.11b wireless LAN user talking on a 2.4 GHz wireless phone can expect
that neither the network nor the phone will perform particularly well. In addition
to interference from transmitting sources, electromagnetic noise within the envi-
ronment (e.g., a nearby motor, a microwave) can result in interference.
•
Multipath propagation. Multipath propagation occurs when portions of the
electromagnetic wave reflect off objects and the ground, taking paths of different
lengths between a sender and receiver. This results in the blurring of the received
signal at the receiver. Moving objects between the sender and receiver can cause
multipath propagation to change over time.
For a detailed discussion of wireless channel characteristics, models, and measure-
ments, see [Anderson 1995].
The discussion above suggests that bit errors will be more common in wireless
links than in wired links. For this reason, it is perhaps not surprising that wireless
link protocols (such as the 802.11 protocol we’ll examine in the following section)
employ not only powerful CRC error detection codes, but also link-level reliable-
data-transfer protocols that retransmit corrupted frames.
6.2
•
WIRELESS LINKS AND NETWORK CHARACTERISTICS
519

---

## Page 8

520
CHAPTER 6
•
WIRELESS AND MOBILE NETWORKS
Figure 6.3  Bit error rate, transmission rate, and SNR
10–7
10–6
10–5
10–4
10–3
10–2
10–1
10
20
30
40
0
SNR (dB)
BER
QAM16
(4 Mbps)
QAM256
(8 Mbps)
BPSK
(1Mpbs)
Having considered the impairments that can occur on a wireless channel, let’s
next turn our attention to the host receiving the wireless signal. This host receives an
electromagnetic signal that is a combination of a degraded form of the original signal
transmitted by the sender (degraded due to the attenuation and multipath propagation
effects that we discussed above, among others) and background noise in the environ-
ment. The signal-to-noise ratio (SNR) is a relative measure of the strength of the
received signal (i.e., the information being transmitted) and this noise. The SNR is
typically measured in units of decibels (dB), a unit of measure that some think is used
by electrical engineers primarily to confuse computer scientists. The SNR, measured
in dB, is twenty times the ratio of the base-10 logarithm of the amplitude of the
received signal to the amplitude of the noise. For our purposes here, we need only
know that a larger SNR makes it easier for the receiver to extract the transmitted sig-
nal from the background noise.
Figure 6.3 (adapted from [Holland 2001]) shows the bit error rate (BER)—
roughly speaking, the probability that a transmitted bit is received in error at the
receiver—versus the SNR for three different modulation techniques for encoding
information for transmission on an idealized wireless channel. The theory of modu-
lation and coding, as well as signal extraction and BER, is well beyond the scope of
this text (see [Schwartz 1980] for a discussion of these topics). Nonetheless, Figure
6.3 illustrates several physical-layer characteristics that are important in understand-
ing higher-layer wireless communication protocols:
•
For a given modulation scheme, the higher the SNR, the lower the BER. Since
a sender can increase the SNR by increasing its transmission power, a sender

---

## Page 9

can decrease the probability that a frame is received in error by increasing its
transmission power. Note, however, that there is arguably little practical gain
in increasing the power beyond a certain threshold, say to decrease the BER
from 10-12 to 10-13. There are also disadvantages associated with increasing the
transmission power: More energy must be expended by the sender (an impor-
tant concern for battery-powered mobile users), and the sender’s transmissions
are more likely to interfere with the transmissions of another sender (see
Figure 6.4(b)).
•
For a given SNR, a modulation technique with a higher bit transmission rate
(whether in error or not) will have a higher BER. For example, in Figure 6.3,
with an SNR of 10 dB, BPSK modulation with a transmission rate of 1 Mbps has
a BER of less than 10-7, while with QAM16 modulation with a transmission rate
of 4 Mbps, the BER is 10-1, far too high to be practically useful. However, with
an SNR of 20 dB, QAM16 modulation has a transmission rate of 4 Mbps and a
BER of 10-7, while BPSK modulation has a transmission rate of only 1 Mbps and
a BER that is so low as to be (literally) “off the charts.” If one can tolerate a BER
of 10-7, the higher transmission rate offered by QAM16 would make it the pre-
ferred modulation technique in this situation. These considerations give rise to
the final characteristic, described next.
•
Dynamic selection of the physical-layer modulation technique can be used to
adapt the modulation technique to channel conditions. The SNR (and hence the
BER) may change as a result of mobility or due to changes in the environment.
Adaptive modulation and coding are used in cellular data systems and in the
802.11 WiFi and 3G cellular data networks that we’ll study in Sections 6.3 and
6.4. This allows, for example, the selection of a modulation technique that
provides the highest transmission rate possible subject to a constraint on the
BER, for given channel characteristics.
A higher and time-varying bit error rate is not the only difference between a
wired and wireless link. Recall that in the case of wired broadcast links, all nodes
receive the transmissions from all other nodes. In the case of wireless links, the situ-
ation is not as simple, as shown in Figure 6.4. Suppose that Station A is transmitting
to Station B. Suppose also that Station C is transmitting to Station B. With the so-
called hidden terminal problem, physical obstructions in the environment (for
example, a mountain or a building) may prevent A and C from hearing each other’s
transmissions, even though A’s and C’s transmissions are indeed interfering at the
destination, B. This is shown in Figure 6.4(a). A second scenario that results in
undetectable collisions at the receiver results from the fading of a signal’s strength
as it propagates through the wireless medium. Figure 6.4(b) illustrates the case
where A and C are placed such that their signals are not strong enough to detect each
other’s transmissions, yet their signals are strong enough to interfere with each other
at station B. As we’ll see in Section 6.3, the hidden terminal problem and fading
6.2
•
WIRELESS LINKS AND NETWORK CHARACTERISTICS
521

---

## Page 10

make multiple access in a wireless network considerably more complex than in a
wired network.
6.2.1 CDMA
Recall from Chapter 5 that when hosts communicate over a shared medium, a pro-
tocol is needed so that the signals sent by multiple senders do not interfere at the
receivers. In Chapter 5 we described three classes of medium access protocols:
channel partitioning, random access, and taking turns. Code division multiple
access (CDMA) belongs to the family of channel partitioning protocols. It is preva-
lent in wireless LAN and cellular technologies. Because CDMA is so important in
the wireless world, we’ll take a quick look at CDMA now, before getting into spe-
cific wireless access technologies in the subsequent sections.
In a CDMA protocol, each bit being sent is encoded by multiplying the bit by
a signal (the code) that changes at a much faster rate (known as the chipping rate)
than the original sequence of data bits. Figure 6.5 shows a simple, idealized
CDMA encoding/decoding scenario. Suppose that the rate at which original data
bits reach the CDMA encoder defines the unit of time; that is, each original data
bit to be transmitted requires a one-bit slot time. Let di be the value of the data bit
for the ith bit slot. For mathematical convenience, we represent a data bit with a 0
value as –1. Each bit slot is further subdivided into M mini-slots; in Figure 6.5, M
= 8, although in practice M is much larger. The CDMA code used by the sender
consists of a sequence of M values, cm, m = 1, . . . , M, each taking a +1 or –1
522
CHAPTER 6
•
WIRELESS AND MOBILE NETWORKS
A
A
C
B
C
Location
b.
a.
0
Signal strength
B
Figure 6.4  Hidden terminal problem caused by obstacle (a) and
fading (b)

---

## Page 11

value. In the example in Figure 6.5, the M-bit CDMA code being used by the
sender is (1, 1, 1, –1, 1, –1, –1, –1).
To illustrate how CDMA works, let us focus on the ith data bit, di. For the mth
mini-slot of the bit-transmission time of di, the output of the CDMA encoder, Zi,m, is
the value of di multiplied by the mth bit in the assigned CDMA code, cm:
(6.1)
Zi, m = di  cm
6.2
•
WIRELESS LINKS AND NETWORK CHARACTERISTICS
523
Figure 6.5  A simple CDMA example: sender encoding, receiver
decoding
1
1 1 1
-1
-1 -1 -1
1
1 1 1
-1
-1 -1 -1
1
-1
-1
-1 -1
1 1 1
1
-1
-1 -1 -1
1 1 1
Time slot 1
received input
Time slot 0
received input
Code
1
-1
-1
-1 -1
1 1 1
1
-1
-1 -1 -1
1 1 1
Data bits
Code
1
1 1 1
-1
-1 -1 -1
1
1 1 1
-1
-1 -1 -1
d1 = -1
d0 = 1
Time slot 1
Sender
Channel output Zi,m
Receiver
Zi,m
di • cm
=
Zi,m • cm
d
M
i
m=1
M
=
∑
Time slot 1
channel output
Time slot 0
channel output
Time slot 0
d1 = -1
d0 = 1

---

## Page 12

In a simple world, with no interfering senders, the receiver would receive the
encoded bits, Zi,m, and recover the original data bit, di, by computing:
(6.2)
The reader might want to work through the details of the example in Figure 6.5 to
see that the original data bits are indeed correctly recovered at the receiver using
Equation 6.2.
The world is far from ideal, however, and as noted above, CDMA must work in
the presence of interfering senders that are encoding and transmitting their data using
a different assigned code. But how can a CDMA receiver recover a sender’s original
data bits when those data bits are being tangled with bits being transmitted by other
senders? CDMA works under the assumption that the interfering transmitted bit
signals are additive. This means, for example, that if three senders send a 1 value, and
a fourth sender sends a –1 value during the same mini-slot, then the received
signal at all receivers during that mini-slot is a 2 (since 1  1  1  1 = 2). In the
presence of multiple senders, sender s computes its encoded transmissions, Zs
i,m, in
exactly the same manner as in Equation 6.1. The value received at a receiver during
the mth mini-slot of the ith bit slot, however, is now the sum of the transmitted bits
from all N senders during that mini-slot:
Amazingly, if the senders’ codes are chosen carefully, each receiver can recover the
data sent by a given sender out of the aggregate signal simply by using the sender’s
code in exactly the same manner as in Equation 6.2:
(6.3)
as shown in Figure 6.6, for a two-sender CDMAexample. The M-bit CDMAcode being
used by the upper sender is (1, 1, 1, –1, 1, –1, –1, –1), while the CDMA code being used
by the lower sender is (1, –1, 1, 1, 1, –1, 1, 1). Figure 6.6 illustrates a receiver recovering
the original data bits from the upper sender. Note that the receiver is able to extract
the data from sender 1 in spite of the interfering transmission from sender 2.
Recall our cocktail analogy from Chapter 5. A CDMA protocol is similar to hav-
ing partygoers speaking in multiple languages; in such circumstances humans are
actually quite good at locking into the conversation in the language they understand,
while filtering out the remaining conversations. We see here that CDMA is a partition-
ing protocol in that it partitions the codespace (as opposed to time or frequency) and
assigns each node a dedicated piece of the codespace.
di = 1
M a
M
m=1
Zi, m
*
 cm
Z*
i, m = a
N
s=1
Zs
i, m
di = 1
M a
M
m=1
Zi, m  cm
524
CHAPTER 6
•
WIRELESS AND MOBILE NETWORKS

---

## Page 13

6.2
•
WIRELESS LINKS AND NETWORK CHARACTERISTICS
525
Receiver 1
1
1 1 1
-1
-1 -1 -1
1
1 1 1
-1
-1 -1 -1
Time slot 1
received input
Time slot 0
received input
Data bits
Data bits
1
1 1 1
-1
-1 -1 -1
1
1 1 1
-1
-1 -1 -1
Code
Senders
1 1 1
-1
1 1 1
-1
1
-1
-1
1 1 1
1 1
Code
Code
+
-2
2
2 2 2
2
-2
2
-2
2
2 2 2
2
-2
2
Channel, Zi,m
*
Zi,m
di • cm
=
Zi,m • cm
d
M
i
m=1
M
=
∑
d1 = -1
d0 = 1
d1 = 1
2
1
1
*
2
2
2
Zi,m
di • cm
=
1
1
1
d0 = 1
2
1
1
d1 = -1
d0 = 1
1
1
Figure 6.6  A two-sender CDMA example
Our discussion here of CDMA is necessarily brief; in practice a number of
difficult issues must be addressed. First, in order for the CDMA receivers to be
able to extract a particular sender’s signal, the CDMA codes must be carefully
chosen. Second, our discussion has assumed that the received signal strengths

---

## Page 14

from various senders are the same; in reality this can be difficult to achieve. There
is a considerable body of literature addressing these and other issues related to
CDMA; see [Pickholtz 1982; Viterbi 1995] for details.
6.3 WiFi: 802.11 Wireless LANs
Pervasive in the workplace, the home, educational institutions, cafés, airports, and
street corners, wireless LANs are now one of the most important access network
technologies in the Internet today. Although many technologies and standards for
wireless LANs were developed in the 1990s, one particular class of standards has
clearly emerged as the winner: the IEEE 802.11 wireless LAN, also known as
WiFi. In this section, we’ll take a close look at 802.11 wireless LANs, examining
its frame structure, its medium access protocol, and its internetworking of 802.11
LANs with wired Ethernet LANs.
There are several 802.11 standards for wireless LAN technology, including
802.11b, 802.11a, and 802.11g. Table 6.1 summarizes the main characteristics of
these standards. 802.11g is by far the most popular technology. A number of dual-
mode (802.11a/g) and tri-mode (802.11a/b/g) devices are also available.
The three 802.11 standards share many characteristics. They all use the same
medium access protocol, CSMA/CA, which we’ll discuss shortly. All three use the
same frame structure for their link-layer frames as well. All three standards have the
ability to reduce their transmission rate in order to reach out over greater distances.
And all three standards allow for both “infrastructure mode” and “ad hoc mode,” as
we’ll also shortly discuss. However, as shown in Table 6.1, the three standards have
some major differences at the physical layer.
The 802.11b wireless LAN has a data rate of 11 Mbps and operates in the
unlicensed frequency band of 2.4–2.485 GHz, competing for frequency spectrum
with 2.4 GHz phones and microwave ovens. 802.1la wireless LANs can run at
526
CHAPTER 6
•
WIRELESS AND MOBILE NETWORKS
Table 6.1  Summary of IEEE 802.11 standards
Standard
Frequency Range (United States)
Data Rate
802.11b
2.4–2.485 GHz
up to 11 Mbps
802.11a
5.1–5.8 GHz
up to 54 Mbps
802.11g
2.4–2.485 GHz
up to 54 Mbps

---

## Page 15

significantly higher bit rates, but do so at higher frequencies. By operating at a
higher frequency, 802.11a LANs have a shorter transmission distance for a given
power level and suffer more from multipath propagation. 802.11g LANs, operat-
ing in the same lower-frequency band as 802.11b and being backwards compati-
ble with 802.11b (so one can upgrade 802.11b clients incrementally) yet with the
higher-speed transmission rates of 802.11a, allows users to have their cake and
eat it too.
A relatively new WiFi standard, 802.11n [IEEE 802.11n 2012], uses multiple-
input multiple-output (MIMO) antennas; i.e., two or more antennas on the
sending side and two or more antennas on the receiving side that are transmit-
ting/receiving different signals [Diggavi 2004]. Depending on the modulation
scheme used, transmission rates of several hundred megabits per second are pos-
sible with 802.11n.
6.3.1 The 802.11 Architecture
Figure 6.7 illustrates the principal components of the 802.11 wireless LAN archi-
tecture. The fundamental building block of the 802.11 architecture is the basic
service set (BSS). A BSS contains one or more wireless stations and a central
6.3
•
WIFI: 802.11 WIRELESS LANS
527
Internet
Switch or router
AP
BSS 1
BSS 2
AP
Figure 6.7  IEEE 802.11 LAN architecture

---

## Page 16

base station, known as an access point (AP) in 802.11 parlance. Figure 6.7
shows the AP in each of two BSSs connecting to an interconnection device (such
as a switch or router), which in turn leads to the Internet. In a typical home net-
work, there is one AP and one router (typically integrated together as one unit)
that connects the BSS to the Internet.
As with Ethernet devices, each 802.11 wireless station has a 6-byte MAC
address that is stored in the firmware of the station’s adapter (that is, 802.11 network
interface card). Each AP also has a MAC address for its wireless interface. As with
Ethernet, these MAC addresses are administered by IEEE and are (in theory) glob-
ally unique.
As noted in Section 6.1, wireless LANs that deploy APs are often referred to
as infrastructure wireless LANs, with the “infrastructure” being the APs along
with the wired Ethernet infrastructure that interconnects the APs and a router.
Figure 6.8 shows that IEEE 802.11 stations can also group themselves together
to form an ad hoc network—a network with no central control and with no con-
nections to the “outside world.” Here, the network is formed “on the fly,” by
mobile devices that have found themselves in proximity to each other, that have
a need to communicate, and that find no preexisting network infrastructure in
their location. An ad hoc network might be formed when people with laptops get
together (for example, in a conference room, a train, or a car) and want to
exchange data in the absence of a centralized AP. There has been tremendous
interest in ad hoc networking, as communicating portable devices continue to
proliferate. In this section, though, we’ll focus our attention on infrastructure
wireless LANs.
528
CHAPTER 6
•
WIRELESS AND MOBILE NETWORKS
BSS
Figure 6.8  An IEEE 802.11 ad hoc network

---

## Page 17

Channels and Association
In 802.11, each wireless station needs to associate with an AP before it can send or
receive network-layer data. Although all of the 802.11 standards use association,
we’ll discuss this topic specifically in the context of IEEE 802.11b/g.
When a network administrator installs an AP, the administrator assigns a one-
or two-word Service Set Identifier (SSID) to the access point. (When you “view
available networks” in Microsoft Windows XP, for example, a list is displayed
showing the SSID of each AP in range.) The administrator must also assign a chan-
nel number to the AP. To understand channel numbers, recall that 802.11 operates in
the frequency range of 2.4 GHz to 2.485 GHz. Within this 85 MHz band, 802.11
defines 11 partially overlapping channels. Any two channels are non-overlapping if
and only if they are separated by four or more channels. In particular, the set of
channels 1, 6, and 11 is the only set of three non-overlapping channels. This means
that an administrator could create a wireless LAN with an aggregate maximum
transmission rate of 33 Mbps by installing three 802.11b APs at the same physical
location, assigning channels 1, 6, and 11 to the APs, and interconnecting each of the
APs with a switch.
Now that we have a basic understanding of 802.11 channels, let’s describe an
interesting (and not completely uncommon) situation—that of a WiFi jungle. A
WiFi jungle is any physical location where a wireless station receives a sufficiently
strong signal from two or more APs. For example, in many cafés in New York City,
a wireless station can pick up a signal from numerous nearby APs. One of the APs
might be managed by the café, while the other APs might be in residential apart-
ments near the café. Each of these APs would likely be located in a different IP sub-
net and would have been independently assigned a channel.
Now suppose you enter such a WiFi jungle with your portable computer,
seeking wireless Internet access and a blueberry muffin. Suppose there are five
APs in the WiFi jungle. To gain Internet access, your wireless station needs to join
exactly one of the subnets and hence needs to associate with exactly one of the
APs. Associating means the wireless station creates a virtual wire between itself
and the AP. Specifically, only the associated AP will send data frames (that is,
frames containing data, such as a datagram) to your wireless station, and your
wireless station will send data frames into the Internet only through the associated
AP. But how does your wireless station associate with a particular AP? And more
fundamentally, how does your wireless station know which APs, if any, are out
there in the jungle?
The 802.11 standard requires that an AP periodically send beacon frames, each
of which includes the AP’s SSID and MAC address. Your wireless station, knowing
that APs are sending out beacon frames, scans the 11 channels, seeking beacon
frames from any APs that may be out there (some of which may be transmitting on
the same channel—it’s a jungle out there!). Having learned about available APs
6.3
•
WIFI: 802.11 WIRELESS LANS
529

---

## Page 18

from the beacon frames, you (or your wireless host) select one of the APs for
association.
The 802.11 standard does not specify an algorithm for selecting which of the
available APs to associate with; that algorithm is left up to the designers of the 802.11
firmware and software in your wireless host. Typically, the host chooses the AP
whose beacon frame is received with the highest signal strength. While a high signal
strength is good (see, e.g., Figure 6.3), signal strength is not the only AP characteris-
tic that will determine the performance a host receives. In particular, it’s possible that
the selected AP may have a strong signal, but may be overloaded with other affiliated
hosts (that will need to share the wireless bandwidth at that AP), while an unloaded
AP is not selected due to a slightly weaker signal. A number of alternative ways of
choosing APs have thus recently been proposed [Vasudevan 2005; Nicholson 2006;
Sundaresan 2006]. For an interesting and down-to-earth discussion of how signal
strength is measured, see [Bardwell 2004].
The process of scanning channels and listening for beacon frames is known as
passive scanning (see Figure 6.9a). A wireless host can also perform active scan-
ning, by broadcasting a probe frame that will be received by all APs within the wire-
less host’s range, as shown in Figure 6.9b. APs respond to the probe request frame
with a probe response frame. The wireless host can then choose the AP with which
to associate from among the responding APs.
After selecting the AP with which to associate, the wireless host sends an asso-
ciation request frame to the AP, and the AP responds with an association response
frame. Note that this second request/response handshake is needed with active scan-
ning, since an AP responding to the initial probe request frame doesn’t know which
of the (possibly many) responding APs the host will choose to associate with, in
much the same way that a DHCP client can choose from among multiple DHCP
servers (see Figure 4.21). Once associated with an AP, the host will want to join the
subnet (in the IP addressing sense of Section 4.4.2) to which the AP belongs. Thus,
the host will typically send a DHCP discovery message (see Figure 4.21) into the
subnet via the AP in order to obtain an IP address on the subnet. Once the address is
obtained, the rest of the world then views that host simply as another host with an IP
address in that subnet.
In order to create an association with a particular AP, the wireless station may
be required to authenticate itself to the AP. 802.11 wireless LANs provide a number
of alternatives for authentication and access. One approach, used by many compa-
nies, is to permit access to a wireless network based on a station’s MAC address. A
second approach, used by many Internet cafés, employs usernames and passwords.
In both cases, the AP typically communicates with an authentication server, relay-
ing information between the wireless end-point station and the authentication server
using a protocol such as RADIUS [RFC 2865] or DIAMETER [RFC 3588]. Sepa-
rating the authentication server from the AP allows one authentication server to
serve many APs, centralizing the (often sensitive) decisions of authentication and
access within the single server, and keeping AP costs and complexity low. We’ll see
530
CHAPTER 6
•
WIRELESS AND MOBILE NETWORKS

---

## Page 19

in Section 8.8 that the new IEEE 802.11i protocol defining security aspects of the
802.11 protocol family takes precisely this approach.
6.3.2 The 802.11 MAC Protocol
Once a wireless station is associated with an AP, it can start sending and receiving
data frames to and from the access point. But because multiple stations may want to
transmit data frames at the same time over the same channel, a multiple access proto-
col is needed to coordinate the transmissions. Here, a station is either a wireless sta-
tion or an AP. As discussed in Chapter 5 and Section 6.2.1, broadly speaking there
are three classes of multiple access protocols: channel partitioning (including
CDMA), random access, and taking turns. Inspired by the huge success of Ethernet
and its random access protocol, the designers of 802.11 chose a random access proto-
col for 802.11 wireless LANs. This random access protocol is referred to as CSMA
with collision avoidance, or more succinctly as CSMA/CA. As with Ethernet’s
CSMA/CD, the “CSMA” in CSMA/CA stands for “carrier sense multiple access,”
meaning that each station senses the channel before transmitting, and refrains from
transmitting when the channel is sensed busy. Although both Ethernet and 802.11 use
carrier-sensing random access, the two MAC protocols have important differences.
6.3
•
WIFI: 802.11 WIRELESS LANS
531
1
1
3
2
H1
AP 2
AP 1
BBS 1
a. Passive scanning
1. Beacon frames sent from APs
2. Association Request frame sent:

H1 to selected AP
3. Association Response frame sent:

Selected AP to H1
a. Active scanning

1. Probe Request frame broadcast from H1

2. Probes Response frame sent from APs

3. Association Request frame sent:

H1 to selected AP

4. Association Response frame sent:

Selected AP to H1
BBS 2
2
2
4
3
H1
AP 2
AP 1
BBS 1
BBS 2
1
Figure 6.9  Active and passive scanning for access points

---

## Page 20

First, instead of using collision detection, 802.11 uses collision-avoidance tech-
niques. Second, because of the relatively high bit error rates of wireless channels,
802.11 (unlike Ethernet) uses a link-layer acknowledgment/retransmission (ARQ)
scheme. We’ll describe 802.11’s collision-avoidance and link-layer acknowledgment
schemes below.
Recall from Sections 5.3.2 and 5.4.2 that with Ethernet’s collision-detection
algorithm, an Ethernet station listens to the channel as it transmits. If, while trans-
mitting, it detects that another station is also transmitting, it aborts its transmission
and tries to transmit again after waiting a small, random amount of time. Unlike the
802.3 Ethernet protocol, the 802.11 MAC protocol does not implement collision
detection. There are two important reasons for this:
•
The ability to detect collisions requires the ability to send (the station’s own sig-
nal) and receive (to determine whether another station is also transmitting) at the
same time. Because the strength of the received signal is typically very small
compared to the strength of the transmitted signal at the 802.11 adapter, it is
costly to build hardware that can detect a collision.
•
More importantly, even if the adapter could transmit and listen at the same time
(and presumably abort transmission when it senses a busy channel), the adapter
would still not be able to detect all collisions, due to the hidden terminal problem
and fading, as discussed in Section 6.2.
Because 802.11wireless LANs do not use collision detection, once a station
begins to transmit a frame, it transmits the frame in its entirety; that is, once a sta-
tion gets started, there is no turning back. As one might expect, transmitting entire
frames (particularly long frames) when collisions are prevalent can significantly
degrade a multiple access protocol’s performance. In order to reduce the likelihood
of collisions, 802.11 employs several collision-avoidance techniques, which we’ll
shortly discuss.
Before considering collision avoidance, however, we’ll first need to examine
802.11’s link-layer acknowledgment scheme. Recall from Section 6.2 that when a
station in a wireless LAN sends a frame, the frame may not reach the destination
station intact for a variety of reasons. To deal with this non-negligible chance of fail-
ure, the 802.11 MAC protocol uses link-layer acknowledgments. As shown in
Figure 6.10, when the destination station receives a frame that passes the CRC, it
waits a short period of time known as the Short Inter-frame Spacing (SIFS) and
then sends back an acknowledgment frame. If the transmitting station does not
receive an acknowledgment within a given amount of time, it assumes that an error
has occurred and retransmits the frame, using the CSMA/CA protocol to access the
channel. If an acknowledgment is not received after some fixed number of retrans-
missions, the transmitting station gives up and discards the frame.
532
CHAPTER 6
•
WIRELESS AND MOBILE NETWORKS

---

## Page 21

Having discussed how 802.11 uses link-layer acknowledgments, we’re now in
a position to describe the 802.11 CSMA/CA protocol. Suppose that a station (wire-
less station or an AP) has a frame to transmit.
1. If initially the station senses the channel idle, it transmits its frame after a short
period of time known as the Distributed Inter-frame Space (DIFS); see
Figure 6.10.
2. Otherwise, the station chooses a random backoff value using binary exponen-
tial backoff (as we encountered in  Section 5.3.2) and counts down this value
when the channel is sensed idle. While the channel is sensed busy, the counter
value remains frozen.
3. When the counter reaches zero (note that this can only occur while the channel
is sensed idle), the station transmits the entire frame and then waits for an
acknowledgment.
6.3
•
WIFI: 802.11 WIRELESS LANS
533
Destination
DIFS
SIFS
data
ack
Source
Figure 6.10  802.11 uses link-layer acknowledgments

---

## Page 22

4. If an acknowledgment is received, the transmitting station knows that its frame
has been correctly received at the destination station. If the station has another
frame to send, it begins the CSMA/CA protocol at step 2. If the acknowledg-
ment isn’t received, the transmitting station reenters the backoff phase in step
2, with the random value chosen from a larger interval.
Recall that under Ethernet’s CSMA/CD, multiple access protocol (Section
5.3.2), a station begins transmitting as soon as the channel is sensed idle. With
CSMA/CA, however, the station refrains from transmitting while counting down,
even when it senses the channel to be idle.Why do CSMA/CD and CDMA/CA take
such different approaches here?
To answer this question, let’s consider a scenario in which two stations each
have a data frame to transmit, but neither station transmits immediately because
each senses that a third station is already transmitting. With Ethernet’s CSMA/CD,
the two stations would each transmit as soon as they detect that the third station has
finished transmitting. This would cause a collision, which isn’t a serious issue in
CSMA/CD, since both stations would abort their transmissions and thus avoid the
useless transmissions of the remainders of their frames. In 802.11, however, the sit-
uation is quite different. Because 802.11 does not detect a collision and abort trans-
mission, a frame suffering a collision will be transmitted in its entirety. The goal in
802.11 is thus to avoid collisions whenever possible. In 802.11, if the two stations
sense the channel busy, they both immediately enter random backoff, hopefully
choosing different backoff values. If these values are indeed different, once the
channel becomes idle, one of the two stations will begin transmitting before the
other, and (if the two stations are not hidden from each other) the “losing station”
will hear the “winning station’s” signal, freeze its counter, and refrain from trans-
mitting until the winning station has completed its transmission. In this manner, a
costly collision is avoided. Of course, collisions can still occur with 802.11 in this
scenario: The two stations could be hidden from each other, or the two stations
could choose random backoff values that are close enough that the transmission
from the station starting first have yet to reach the second station. Recall that we
encountered this problem earlier in our discussion of random access algorithms in
the context of Figure 5.12.
Dealing with Hidden Terminals: RTS and CTS
The 802.11 MAC protocol also includes a nifty (but optional) reservation scheme
that helps avoid collisions even in the presence of hidden terminals. Let’s investi-
gate this scheme in the context of Figure 6.11, which shows two wireless stations
and one access point. Both of the wireless stations are within range of the AP
(whose coverage is shown as a shaded circle) and both have associated with the AP.
However, due to fading, the signal ranges of wireless stations are limited to the
534
CHAPTER 6
•
WIRELESS AND MOBILE NETWORKS

---

## Page 23

interiors of the shaded circles shown in Figure 6.11. Thus, each of the wireless sta-
tions is hidden from the other, although neither is hidden from the AP.
Let’s now consider why hidden terminals can be problematic. Suppose Station
H1 is transmitting a frame and halfway through H1’s transmission, Station H2 wants
to send a frame to the AP. H2, not hearing the transmission from H1, will first wait a
DIFS interval and then transmit the frame, resulting in a collision. The channel will
therefore be wasted during the entire period of H1’s transmission as well as during
H2’s transmission.
In order to avoid this problem, the IEEE 802.11 protocol allows a station to use
a short Request to Send (RTS) control frame and a short Clear to Send (CTS) con-
trol frame to reserve access to the channel. When a sender wants to send a DATA
frame, it can first send an RTS frame to the AP, indicating the total time required to
transmit the DATA frame and the acknowledgment (ACK) frame. When the AP
receives the RTS frame, it responds by broadcasting a CTS frame. This CTS frame
serves two purposes: It gives the sender explicit permission to send and also
instructs the other stations not to send for the reserved duration.
Thus, in Figure 6.12, before transmitting a DATA frame, H1 first broadcasts an
RTS frame, which is heard by all stations in its circle, including the AP. The AP then
responds with a CTS frame, which is heard by all stations within its range, includ-
ing H1 and H2. Station H2, having heard the CTS, refrains from transmitting for the
time specified in the CTS frame. The RTS, CTS, DATA, and ACK frames are shown
in Figure 6.12.
6.3
•
WIFI: 802.11 WIRELESS LANS
535
AP
H1
H2
Figure 6.11  Hidden terminal example: H1 is hidden from H2,
and vice versa

---

## Page 24

The use of the RTS and CTS frames can improve performance in two important
ways:
•
The hidden station problem is mitigated, since a long DATA frame is transmitted
only after the channel has been reserved.
536
CHAPTER 6
•
WIRELESS AND MOBILE NETWORKS
Destination
All other nodes
Defer access
Source
DIFS
ACK
SIFS
SIFS
SIFS
DATA
CTS
CTS
ACK
RTS
Figure 6.12  Collision avoidance using the RTS and CTS frames

---

## Page 25

•
Because the RTS and CTS frames are short, a collision involving an RTS or CTS
frame will last only for the duration of the short RTS or CTS frame. Once the
RTS and CTS frames are correctly transmitted, the following DATA and ACK
frames should be transmitted without collisions.
You are encouraged to check out the 802.11 applet in the textbook’s companion Web
site. This interactive applet illustrates the CSMA/CA protocol, including the
RTS/CTS exchange sequence.
Although the RTS/CTS exchange can help reduce collisions, it also introduces
delay and consumes channel resources. For this reason, the RTS/CTS exchange is
only used (if at all) to reserve the channel for the transmission of a long DATA
frame. In practice, each wireless station can set an RTS threshold such that the
RTS/CTS sequence is used only when the frame is longer than the threshold. For
many wireless stations, the default RTS threshold value is larger than the maximum
frame length, so the RTS/CTS sequence is skipped for all DATA frames sent.
Using 802.11 as a Point-to-Point Link
Our discussion so far has focused on the use of 802.11 in a multiple access setting.
We should mention that if two nodes each have a directional antenna, they can point
their directional antennas at each other and run the 802.11 protocol over what is
essentially a point-to-point link. Given the low cost of commodity 802.11 hardware,
the use of directional antennas and an increased transmission power allow 802.11 to
be used as an inexpensive means of providing wireless point-to-point connections
over tens of kilometers distance. [Raman 2007] describes such a multi-hop wireless
network operating in the rural Ganges plains in India that contains point-to-point
802.11 links.
6.3.3 The IEEE 802.11 Frame
Although the 802.11 frame shares many similarities with an Ethernet frame, it also
contains a number of fields that are specific to its use for wireless links. The 802.11
frame is shown in Figure 6.13. The numbers above each of the fields in the frame
represent the lengths of the fields in bytes; the numbers above each of the subfields
in the frame control field represent the lengths of the subfields in bits. Let’s now
examine the fields in the frame as well as some of the more important subfields in
the frame’s control field.
Payload and CRC Fields
At the heart of the frame is the payload, which typically consists of an IP datagram
or an ARP packet. Although the field is permitted to be as long as 2,312 bytes, it is
6.3
•
WIFI: 802.11 WIRELESS LANS
537

---

## Page 26

typically fewer than 1,500 bytes, holding an IP datagram or an ARP packet. As with
an Ethernet frame, an 802.11 frame includes a 32-bit cyclic redundancy check
(CRC) so that the receiver can detect bit errors in the received frame. As we’ve seen,
bit errors are much more common in wireless LANs than in wired LANs, so the
CRC is even more useful here.
Address Fields
Perhaps the most striking difference in the 802.11 frame is that it has four address
fields, each of which can hold a 6-byte MAC address. But why four address fields?
Doesn’t a source MAC field and destination MAC field suffice, as they do for
Ethernet? It turns out that three address fields are needed for internetworking pur-
poses—specifically, for moving the network-layer datagram from a wireless station
through an AP to a router interface. The fourth address field is used when APs for-
ward frames to each other in ad hoc mode. Since we are only considering infrastruc-
ture networks here, let’s focus our attention on the first three address fields. The
802.11 standard defines these fields as follows:
•
Address 2 is the MAC address of the station that transmits the frame. Thus, if a
wireless station transmits the frame, that station’s MAC address is inserted in the
address 2 field. Similarly, if an AP transmits the frame, the AP’s MAC address is
inserted in the address 2 field.
•
Address 1 is the MAC address of the wireless station that is to receive the
frame. Thus if a mobile wireless station transmits the frame, address 1 contains
the MAC address of the destination AP. Similarly, if an AP transmits the frame,
address 1 contains the MAC address of the destination wireless station.
538
CHAPTER 6
•
WIRELESS AND MOBILE NETWORKS
Frame
control
2
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
2
6
6
6
2
6
0-2312
4
Frame (numbers indicate field length in bytes):
Address
1
Duration
Payload
CRC
Protocol
version
To
AP
From
AP
More
frag
Power
mgt
More
data
Address
2
Address
3
Address
4
Seq
control
Type
Subtype
Retry
WEP
Rsvd
Frame control field expanded (numbers indicate field length in bits):
Figure 6.13  The 802.11 frame

---

## Page 27

•
To understand address 3, recall that the BSS (consisting of the AP and wireless sta-
tions) is part of a subnet, and that this subnet connects to other subnets via some
router interface. Address 3 contains the MAC address of this router interface.
To gain further insight into the purpose of address 3, let’s walk through an inter-
networking example in the context of Figure 6.14. In this figure, there are two APs,
each of which is responsible for a number of wireless stations. Each of the APs has
a direct connection to a router, which in turn connects to the global Internet. We
should keep in mind that an AP is a link-layer device, and thus neither “speaks” IP
nor understands IP addresses. Consider now moving a datagram from the router
interface R1 to the wireless Station H1. The router is not aware that there is an AP
between it and H1; from the router’s perspective, H1 is just a host in one of the sub-
nets to which it (the router) is connected.
•
The router, which knows the IP address of H1 (from the destination address of
the datagram), uses ARP to determine the MAC address of H1, just as in an
ordinary Ethernet LAN. After obtaining H1’s MAC address, router interface R1
encapsulates the datagram within an Ethernet frame. The source address field of
this frame contains R1’s MAC address, and the destination address field contains
H1’s MAC address.
6.3
•
WIFI: 802.11 WIRELESS LANS
539
Internet
Router
AP
H1
R1
BSS 1
BSS 2
AP
Figure 6.14  The use of address fields in 802.11 frames: Sending
frames between H1 and R1

---

## Page 28

•
When the Ethernet frame arrives at the AP, the AP converts the 802.3 Ethernet
frame to an 802.11 frame before transmitting the frame into the wireless chan-
nel. The AP fills in address 1 and address 2 with H1’s MAC address and its
own MAC address, respectively, as described above. For address 3, the AP
inserts the MAC address of R1. In this manner, H1 can determine (from
address 3) the MAC address of the router interface that sent the datagram into
the subnet.
Now consider what happens when the wireless station H1 responds by moving a
datagram from H1 to R1.
•
H1 creates an 802.11 frame, filling the fields for address 1 and address 2 with the
AP’s MAC address and H1’s MAC address, respectively, as described above. For
address 3, H1 inserts R1’s MAC address.
•
When the AP receives the 802.11 frame, it converts the frame to an Ethernet
frame. The source address field for this frame is H1’s MAC address, and the des-
tination address field is R1’s MAC address. Thus, address 3 allows the AP to
determine the appropriate destination MAC address when constructing the Eth-
ernet frame.
In summary, address 3 plays a crucial role for internetworking the BSS with a wired
LAN.
Sequence Number, Duration, and Frame Control Fields
Recall that in 802.11, whenever a station correctly receives a frame from another
station, it sends back an acknowledgment. Because acknowledgments can get lost,
the sending station may send multiple copies of a given frame. As we saw in our dis-
cussion of the rdt2.1 protocol (Section 3.4.1), the use of sequence numbers allows
the receiver to distinguish between a newly transmitted frame and the retransmis-
sion of a previous frame. The sequence number field in the 802.11 frame thus serves
exactly the same purpose here at the link layer as it did in the transport layer in
Chapter 3.
Recall that the 802.11 protocol allows a transmitting station to reserve the chan-
nel for a period of time that includes the time to transmit its data frame and the time
to transmit an acknowledgment. This duration value is included in the frame’s dura-
tion field (both for data frames and for the RTS and CTS frames).
As shown in Figure 6.13, the frame control field includes many subfields. We’ll
say just a few words about some of the more important subfields; for a more com-
plete discussion, you are encouraged to consult the 802.11 specification [Held 2001;
Crow 1997; IEEE 802.11 1999]. The type and subtype fields are used to distinguish
the association, RTS, CTS, ACK, and data frames. The to and from fields are used
to define the meanings of the different address fields. (These meanings change
540
CHAPTER 6
•
WIRELESS AND MOBILE NETWORKS

---

## Page 29

depending on whether ad hoc or infrastructure modes are used and, in the case of
infrastructure mode, whether a wireless station or an AP is sending the frame.)
Finally the WEP field indicates whether encryption is being used or not. (WEP is
discussed in Chapter 8.)
6.3.4 Mobility in the Same IP Subnet
In order to increase the physical range of a wireless LAN, companies and universities
will often deploy multiple BSSs within the same IP subnet. This naturally raises the
issue of mobility among the BSSs—how do wireless stations seamlessly move from
one BSS to another while maintaining ongoing TCP sessions? As we’ll see in this sub-
section, mobility can be handled in a relatively straightforward manner when the BSSs
are part of the subnet. When stations move between subnets, more sophisticated mobil-
ity management protocols will be needed, such as those we’ll study in Sections 6.5
and 6.6.
Let’s now look at a specific example of mobility between BSSs in the same
subnet. Figure 6.15 shows two interconnected BSSs with a host, H1, moving
from BSS1 to BSS2. Because in this example the interconnection device that
connects the two BSSs is not a router, all of the stations in the two BSSs, includ-
ing the APs, belong to the same IP subnet. Thus, when H1 moves from BSS1 to
BSS2, it may keep its IP address and all of its ongoing TCP connections. If the
interconnection device were a router, then H1 would have to obtain a new IP
address in the subnet in which it was moving. This address change would disrupt
(and eventually terminate) any on-going TCP connections at H1. In Section 6.6,
we’ll see how a network-layer mobility protocol, such as mobile IP, can be used
to avoid this problem.
6.3
•
WIFI: 802.11 WIRELESS LANS
541
BSS 1
BSS 2
H1
Switch
AP 1
AP 2
Figure 6.15  Mobility in the same subnet

---

## Page 30

But what specifically happens when H1 moves from BSS1 to BSS2? As H1
wanders away from AP1, H1 detects a weakening signal from AP1 and starts to scan
for a stronger signal. H1 receives beacon frames from AP2 (which in many corpo-
rate and university settings will have the same SSID as AP1). H1 then disassociates
with AP1 and associates with AP2, while keeping its IP address and maintaining its
ongoing TCP sessions.
This addresses the handoff problem from the host and AP viewpoint. But what
about the switch in Figure 6.15? How does it know that the host has moved from
one AP to another? As you may recall from Chapter 5, switches are “self-learning”
and automatically build their forwarding tables. This self-learning feature nicely
handles occasional moves (for example, when an employee gets transferred from
one department to another); however, switches were not designed to support highly
mobile users who want to maintain TCP connections while moving between BSSs.
To appreciate the problem here, recall that before the move, the switch has an entry
in its forwarding table that pairs H1’s MAC address with the outgoing switch inter-
face through which H1 can be reached. If H1 is initially in BSS1, then a datagram
destined to H1 will be directed to H1 via AP1. Once H1 associates with BSS2, how-
ever, its frames should be directed to AP2. One solution (a bit of a hack, really) is
for AP2 to send a broadcast Ethernet frame with H1’s source address to the switch
just after the new association. When the switch receives the frame, it updates its for-
warding table, allowing H1 to be reached via AP2. The 802.11f standards group is
developing an inter-AP protocol to handle these and related issues.
6.3.5 Advanced Features in 802.11
We’ll wrap up our coverage of 802.11 with a short discussion of two advanced capa-
bilities found in 802.11 networks. As we’ll see, these capabilities are not completely
specified in the 802.11 standard, but rather are made possible by mechanisms speci-
fied in the standard. This allows different vendors to implement these capabilities
using their own (proprietary) approaches, presumably giving them an edge over the
competition.
802.11 Rate Adaptation
We saw earlier in Figure 6.3 that different modulation techniques (with the differ-
ent transmission rates that they provide) are appropriate for different SNR scenar-
ios. Consider for example a mobile 802.11 user who is initially 20 meters away
from the base station, with a high signal-to-noise ratio. Given the high SNR, the
user can communicate with the base station using a physical-layer modulation tech-
nique that provides high transmission rates while maintaining a low BER. This is
one happy user! Suppose now that the user becomes mobile, walking away from
542
CHAPTER 6
•
WIRELESS AND MOBILE NETWORKS

---

## Page 31

the base station, with the SNR falling as the distance from the base station
increases. In this case, if the modulation technique used in the 802.11 protocol
operating between the base station and the user does not change, the BER will
become unacceptably high as the SNR decreases, and eventually no transmitted
frames will be received correctly.
For this reason, some 802.11 implementations have a rate adaptation capability
that adaptively selects the underlying physical-layer modulation technique to use
based on current or recent channel characteristics. If a node sends two frames in a
row without receiving an acknowledgment (an implicit indication of bit errors on
the channel), the transmission rate falls back to the next lower rate. If 10 frames in a
row are acknowledged, or if a timer that tracks the time since the last fallback
expires, the transmission rate increases to the next higher rate. This rate adaptation
mechanism shares the same “probing” philosophy as TCP’s congestion-control
mechanism—when conditions are good (reflected by ACK receipts), the transmis-
sion rate is increased until something “bad” happens (the lack of ACK receipts);
when something “bad” happens, the transmission rate is reduced. 802.11 rate adap-
tation and TCP congestion control are thus similar to the young child who is con-
stantly pushing his/her parents for more and more (say candy for a young child, later
curfew hours for the teenager) until the parents finally say “Enough!” and the child
backs off (only to try again later after conditions have hopefully improved!). A num-
ber of other schemes have also been proposed to improve on this basic automatic
rate-adjustment scheme [Kamerman 1997; Holland 2001; Lacage 2004].
Power Management
Power is a precious resource in mobile devices, and thus the 802.11 standard pro-
vides power-management capabilities that allow 802.11 nodes to minimize the
amount of time that their sense, transmit, and receive functions and other circuitry
need to be “on.” 802.11 power management operates as follows. A node is able to
explicitly alternate between sleep and wake states (not unlike a sleepy student in a
classroom!). A node indicates to the access point that it will be going to sleep by set-
ting the power-management bit in the header of an 802.11 frame to 1. A timer in the
node is then set to wake up the node just before the AP is scheduled to send its bea-
con frame (recall that an AP typically sends a beacon frame every 100 msec). Since
the AP knows from the set power-transmission bit that the node is going to sleep, it
(the AP) knows that it should not send any frames to that node, and will buffer any
frames destined for the sleeping host for later transmission.
A node will wake up just before the AP sends a beacon frame, and quickly enter
the fully active state (unlike the sleepy student, this wakeup requires only 250
microseconds [Kamerman 1997]!). The beacon frames sent out by the AP contain a
list of nodes whose frames have been buffered at the AP. If there are no buffered
frames for the node, it can go back to sleep. Otherwise, the node can explicitly
6.3
•
WIFI: 802.11 WIRELESS LANS
543

---

## Page 32

request that the buffered frames be sent by sending a polling message to the AP.
With an inter-beacon time of 100 msec, a wakeup time of 250 microseconds, and a
similarly small time to receive a beacon frame and check to ensure that there are no
buffered frames, a node that has no frames to send or receive can be asleep 99% of
the time, resulting in a significant energy savings.
6.3.6 Personal Area Networks: Bluetooth and Zigbee
As illustrated in Figure 6.2, the IEEE 802.11 WiFi standard is aimed at communi-
cation among devices separated by up to 100 meters (except when 802.11 is used in
a point-to-point configuration with a directional antenna). Two other IEEE 802
protocols—Bluetooth and Zigbee (defined in the IEEE 802.15.1 and IEEE 802.15.4
standards [IEEE 802.15 2012]) and WiMAX (defined in the IEEE 802.16 standard
[IEEE 802.16d 2004; IEEE 802.16e 2005])—are standards for communicating
over shorter and longer distances, respectively. We will touch on WiMAX briefly
when we discuss cellular data networks in Section 6.4, and so here, we will focus
on networks for shorter distances.
Bluetooth
An IEEE 802.15.1 network operates over a short range, at low power, and at low
cost. It is essentially a low-power, short-range, low-rate “cable replacement” technol-
ogy for interconnecting notebooks, peripheral devices, cellular phones, and smart-
phones, whereas 802.11 is a higher-power, medium-range, higher-rate “access”
technology. For this reason, 802.15.1 networks are sometimes referred to as wireless
personal area networks (WPANs). The link and physical layers of 802.15.1 are based
on the earlier Bluetooth specification for personal area networks [Held 2001, Bis-
dikian 2001]. 802.15.1 networks operate in the 2.4 GHz unlicensed radio band in a
TDM manner, with time slots of 625 microseconds. During each time slot, a sender
transmits on one of 79 channels, with the channel changing in a known but pseudo-
random manner from slot to slot. This form of channel hopping, known as
frequency-hopping spread spectrum (FHSS), spreads transmissions in time over
the frequency spectrum. 802.15.1 can provide data rates up to 4 Mbps.
802.15.1 networks are ad hoc networks: No network infrastructure (e.g., an
access point) is needed to interconnect 802.15.1 devices. Thus, 802.15.1 devices
must organize themselves. 802.15.1 devices are first organized into a piconet of up
to eight active devices, as shown in Figure 6.16. One of these devices is designated
as the master, with the remaining devices acting as slaves. The master node truly
rules the piconet—its clock determines time in the piconet, it can transmit in each
odd-numbered slot, and a slave can transmit only after the master has communicated
with it in the previous slot and even then the slave can only transmit to the master.
In addition to the slave devices, there can also be up to 255 parked devices in the
544
CHAPTER 6
•
WIRELESS AND MOBILE NETWORKS

---

## Page 33

network. These devices cannot communicate until their status has been changed
from parked to active by the master node.
For more information about 802.15.1 WPANs, the interested reader should con-
sult the Bluetooth references [Held 2001, Bisdikian 2001] or the official IEEE
802.15 Web site [IEEE 802.15 2012].
Zigbee
A second personal area network standardized by the IEEE is the 802.14.5 standard
[IEEE 802.15 2012] known as Zigbee. While Bluetooth networks provide a “cable
replacement” data rate of over a Megabit per second, Zigbee is targeted at lower-
powered, lower-data-rate, lower-duty-cycle applications than Bluetooth. While we
may tend to think that “bigger and faster is better,” not all network applications need
high bandwidth and the consequent higher costs (both economic and power costs).
For example, home temperature and light sensors, security devices, and wall-
mounted switches are all very simple, low-power, low-duty-cycle, low-cost devices.
Zigbee is thus well-suited for these devices. Zigbee defines channel rates of 20, 40,
100, and 250 Kbps, depending on the channel frequency.
Nodes in a Zigbee network come in two flavors. So-called “reduced-function
devices” operate as slave devices under the control of a single “full-function
device,” much as Bluetooth slave devices. A full-function device can operate as a
master device as in Bluetooth by controlling multiple slave devices, and multiple
full-function devices can additionally be configured into a mesh network in
which full-function devices route frames amongst themselves. Zigbee shares
6.3
•
WIFI: 802.11 WIRELESS LANS
545
Radius of
coverage
Master device
Slave device
Parked device
Key:
M
M
S
S
S
S
P
P
P
P
P
Figure 6.16  A Bluetooth piconet

---

## Page 34

many protocol mechanisms that we’ve already encountered in other link-layer
protocols: beacon frames and link-layer acknowledgments (similar to 802.11),
carrier-sense random access protocols with binary exponential backoff (similar
to 802.11 and Ethernet), and fixed, guaranteed allocation of time slots (similar to
DOCSIS).
Zigbee networks can be configured in many different ways. Let’s consider the
simple case of a single full-function device controlling multiple reduced-function
devices in a time-slotted manner using beacon frames. Figure 6.17 shows the case
where the Zigbee network divides time into recurring super frames, each of which
begins with a beacon frame. Each beacon frame divides the super frame into an
active period (during which devices may transmit) and an inactive period (during
which all devices, including the controller, can sleep and thus conserve power). The
active period consists of 16 time slots, some of which are used by devices in a
CSMA/CA random access manner, and some of which are allocated by the con-
troller to specific devices, thus providing guaranteed channel access for those
devices. More details about Zigbee networks can be found at [Baronti 2007, IEEE
802.15.4 2012].
6.4 Cellular Internet Access
In the previous section we examined how an Internet host can access the Internet
when inside a WiFi hotspot—that is, when it is within the vicinity of an 802.11
access point. But most WiFi hotspots have a small coverage area of between 10 and
100 meters in diameter. What do we do then when we have a desperate need for
wireless Internet access and we cannot access a WiFi hotspot?
Given that cellular telephony is now ubiquitous in many areas throughout the
world, a natural strategy is to extend cellular networks so that they support not
only voice telephony but wireless Internet access as well. Ideally, this Internet
access would be at a reasonably high speed and would provide for seamless
546
CHAPTER 6
•
WIRELESS AND MOBILE NETWORKS
Figure 6.17  Zigbee 802.14.4 super-frame structure
Beacon
Guaranteed slots
Contention slots
Inactive period
Super frame

---

## Page 35

mobility, allowing users to maintain their TCP sessions while traveling, for
example, on a bus or a train. With sufficiently high upstream and downstream bit
rates, the user could even maintain video-conferencing sessions while roaming
about. This scenario is not that far-fetched. As of 2012, many cellular telephony
providers in the U.S. offer their subscribers a cellular Internet access service for
under $50 per month with typical downstream and upstream bit rates in the hun-
dreds of kilobits per second. Data rates of several megabits per second are
becoming available as broadband data services such as those we will cover here
become more widely deployed.
In this section, we provide a brief overview of current and emerging cellular
Internet access technologies. Our focus here will be on both the wireless first hop as
well as the network that connects the wireless first hop into the larger telephone net-
work and/or the Internet; in Section 6.7 we’ll consider how calls are routed to a user
moving between base stations. Our brief discussion will necessarily provide only a
simplified and high-level description of cellular technologies. Modern cellular com-
munications, of course, has great breadth and depth, with many universities offering
several courses on the topic. Readers seeking a deeper understanding are encouraged
to see [Goodman 1997; Kaaranen 2001; Lin 2001; Korhonen 2003; Schiller 2003;
Scourias 2012; Turner 2012; Akyildiz 2010], as well as the particularly excellent and
exhaustive reference [Mouly 1992].
6.4.1 An Overview of Cellular Network Architecture
In our description of cellular network architecture in this section, we’ll adopt the ter-
minology of the Global System for Mobile Communications (GSM) standards. (For
history buffs, the GSM acronym was originally derived from Groupe Spécial Mobile,
until the more anglicized name was adopted, preserving the original acronym letters.)
In the 1980s, Europeans recognized the need for a pan-European digital cellular
telephony system that would replace the numerous incompatible analog cellular
telephony systems, leading to the GSM standard [Mouly 1992]. Europeans deployed
GSM technology with great success in the early 1990s, and since then GSM has
grown to be the 800-pound gorilla of the cellular telephone world, with more than
80% of all cellular subscribers worldwide using GSM.
When people talk about cellular technology, they often classify the technology
as belonging to one of several “generations.” The earliest generations were designed
primarily for voice traffic. First generation (1G) systems were analog FDMA sys-
tems designed exclusively for voice-only communication. These 1G systems are
almost extinct now, having been replaced by digital 2G systems. The original 2G
systems were also designed for voice, but later extended (2.5G) to support data (i.e.,
Internet) as well as voice service. The 3G systems that currently are being deployed
also support voice and data, but with an ever increasing emphasis on data capabili-
ties and higher-speed radio access links.
6.4
•
CELLULAR INTERNET ACCESS
547

---

## Page 36

Cellular Network Architecture, 2G: Voice Connections to the
Telephone Network
The term cellular refers to the fact that the region covered by a cellular network
is partitioned into a number of geographic coverage areas, known as cells, shown
as hexagons on the left side of Figure 6.18. As with the 802.11WiFi standard we
studied in Section 6.3.1, GSM has its own particular nomenclature. Each cell
contains a base transceiver station (BTS) that transmits signals to and receives
signals from the mobile stations in its cell. The coverage area of a cell depends
548
CHAPTER 6
•
WIRELESS AND MOBILE NETWORKS
3G CELLULAR MOBILE VERSUS WIRELESS LANS
Many cellular mobile phone operators are deploying 3G cellular mobile systems with
indoor data rates of 2 Mbps and outdoor data rates of 384 kbps and higher. These 3G
systems are being deployed in licensed radio-frequency bands, with some operators
paying considerable sums to governments for spectrum-use licenses. 3G systems allow
users to access the Internet from remote outdoor locations while on the move, in a
manner similar to today’s cellular phone access. For example, 3G technology permits a
user to access road map information while driving a car, or movie theater information
while sunbathing on a beach. Nevertheless, one may question the extent to which 3G
systems will be used, given their cost and the fact that users may often have simultane-
ous access to both wireless LANs and 3G:
•
The emerging wireless LAN infrastructure may become nearly ubiquitous. IEEE 802.11
wireless LANs, operating at 54 Mbps, are enjoying widespread deployment. Almost
all portable computers and smartphones are factory-equipped with 802.11 LAN
capabilities. Furthermore, emerging Internet appliances—such as wireless cameras
and picture frames—will also have small and low-powered wireless LAN capabilities.
•
Wireless LAN base stations can also handle mobile phone appliances. Many
phones are already capable of connecting to the cellular phone network or to an
IP network either natively or using a Skype-like Voice-over-IP service, thus bypass-
ing the operator’s cellular voice and 3G data services.
Of course, many other experts believe that 3G not only will be a major success,
but will also dramatically revolutionize the way we work and live. Most likely,
both WiFi and 3G will both become prevalent wireless technologies, with roaming
wireless devices automatically selecting the access technology that provides the
best service at their current physical location.
CASE HISTORY

---

## Page 37

6.4
•
CELLULAR INTERNET ACCESS
549
on many factors, including the transmitting power of the BTS, the transmitting
power of the user devices, obstructing buildings in the cell, and the height of base
station antennas. Although Figure 6.18 shows each cell containing one base
transceiver station residing in the middle of the cell, many systems today place
the BTS at corners where three cells intersect, so that a single BTS with direc-
tional antennas can service three cells.
The GSM standard for 2G cellular systems uses combined FDM/TDM (radio)
for the air interface. Recall from Chapter 1 that, with pure FDM, the channel is par-
titioned into a number of frequency bands with each band devoted to a call. Also
recall from Chapter 1 that, with pure TDM, time is partitioned into frames with each
frame further partitioned into slots and each call being assigned the use of a particu-
lar slot in the revolving frame. In combined FDM/TDM systems, the channel is par-
titioned into a number of frequency sub-bands; within each sub-band, time is
partitioned into frames and slots. Thus, for a combined FDM/TDM system, if
the channel is partitioned into F sub-bands and time is partitioned into T slots, then
BSC
BSC
MSC
Key:
Base transceiver station
(BTS)
Base station controller
(BSC)
Mobile switching center
(MSC)
Mobile subscribers
Gateway
MSC
Base Station System
(BSS)
Base Station System (BSS)
Public telephone
network
G
Figure 6.18  Components of the GSM 2G cellular network architecture

---

## Page 38

the channel will be able to support F.T simultaneous calls. Recall that we saw in
Section 5.3.4 that cable access networks also use a combined FDM/TDM approach.
GSM systems consist of 200-kHz frequency bands with each band supporting eight
TDM calls. GSM encodes speech at 13 kbps and 12.2 kbps.
A GSM network’s base station controller (BSC) will typically service several
tens of base transceiver stations. The role of the BSC is to allocate BTS radio chan-
nels to mobile subscribers, perform paging (finding the cell in which a mobile user
is resident), and perform handoff of mobile users—a topic we’ll cover shortly in
Section 6.7.2. The base station controller and its controlled base transceiver stations
collectively constitute a GSM base station system (BSS).
As we’ll see in Section 6.7, the mobile switching center (MSC) plays the cen-
tral role in user authorization and accounting (e.g., determining whether a mobile
device is allowed to connect to the cellular network), call establishment and tear-
down, and handoff. A single MSC will typically contain up to five BSCs, resulting
in approximately 200K subscribers per MSC. A cellular provider’s network will
have a number of MSCs, with special MSCs known as gateway MSCs connecting
the provider’s cellular network to the larger public telephone network.
6.4.2 3G Cellular Data Networks: Extending the Internet to
Cellular Subscribers
Our discussion in Section 6.4.1 focused on connecting cellular voice users to the
public telephone network. But, of course, when we’re on the go, we’d also like to
read email, access the Web, get location-dependent services (e.g., maps and restau-
rant recommendations) and perhaps even watch streaming video. To do this, our
smartphone will need to run a full TCP/IP protocol stack (including the physical
link, network, transport, and application layers) and connect into the Internet via
the cellular data network. The topic of cellular data networks is a rather bewilder-
ing collection of competing and ever-evolving standards as one generation (and
half-generation) succeeds the former and introduces new technologies and services
with new acronyms. To make matters worse, there’s no single official body that
sets requirements for 2.5G, 3G, 3.5G, or 4G technologies, making it hard to sort
out the differences among competing standards. In our discussion below, we’ll
focus on the UMTS (Universal Mobile Telecommunications Service) 3G standards
developed by the 3rd Generation Partnership project (3GPP) [3GPP 2012], a
widely deployed 3G technology.
Let’s take a top-down look at 3G cellular data network architecture shown in
Figure 6.19.
3G Core Network
The 3G core cellular data network connects radio access networks to the public Inter-
net. The core network interoperates with components of the existing cellular voice
550
CHAPTER 6
•
WIRELESS AND MOBILE NETWORKS

---

## Page 39

6.4
•
CELLULAR INTERNET ACCESS
551
Gateway
MSC
G
Key:
Serving GPRS
Support Node
(SGSN)
Gateway GPRS
Support Node
(GGSN)
Radio Network
Controller (RNC)
GGSN
SGSN
G
G
MSC
Public telephone
network
Radio Interface
(WCDMA, HSPA)
Radio Access Network
Universal Terrestrial Radio
Access Network (UTRAN)
Core Network
General Packet Radio Service
(GPRS) Core Network
Public
Internet
Public
Internet
Figure 6.19  3G system architecture
network (in particular, the MSC) that we previously encountered in Figure 6.18.
Given the considerable amount of existing infrastructure (and profitable services!) in
the existing cellular voice network, the approach taken by the designers of 3G data
services is clear: leave the existing core GSM cellular voice network untouched,
adding additional cellular data functionality in parallel to the existing cellular voice
network. The alternative—integrating new data services directly into the core of the
existing cellular voice network—would have raised the same challenges encountered

---

## Page 40

in Section 4.4.4, where we discussed integrating new (IPv6) and legacy (IPv4) tech-
nologies in the Internet.
There are two types of nodes in the 3G core network: Serving GPRS Sup-
port Nodes (SGSNs) and Gateway GPRS Support Nodes (GGSNs). (GPRS
stands for Generalized Packet Radio Service, an early cellular data service in 2G
networks; here we discuss the evolved version of GPRS in 3G networks). An
SGSN is responsible for delivering datagrams to/from the mobile nodes in the
radio access network to which the SGSN is attached. The SGSN interacts with
the cellular voice network’s MSC for that area, providing user authorization and
handoff, maintaining location (cell) information about active mobile nodes, and
performing datagram forwarding between mobile nodes in the radio access net-
work and a GGSN. The GGSN acts as a gateway, connecting multiple SGSNs
into the larger Internet. A GGSN is thus the last piece of 3G infrastructure that a
datagram originating at a mobile node encounters before entering the larger Inter-
net. To the outside world, the GGSN looks like any other gateway router; the
mobility of the 3G nodes within the GGSN’s network is hidden from the outside
world behind the GGSN.
3G Radio Access Network: The Wireless Edge
The 3G radio access network is the wireless first-hop network that we see as a
3G user. The Radio Network Controller (RNC) typically controls several cell
base transceiver stations similar to the base stations that we encountered in 2G
systems (but officially known in 3G UMTS parlance as a “Node Bs”—a rather
non-descriptive name!). Each cell’s wireless link operates between the mobile
nodes and a base transceiver station, just as in 2G networks. The RNC connects
to both the circuit-switched cellular voice network via an MSC, and to the
packet-switched Internet via an SGSN. Thus, while 3G cellular voice and cellu-
lar data services use different core networks, they share a common first/last-hop
radio access network.
A significant change in 3G UMTS over 2G networks is that rather than using
GSM’s FDMA/TDMA scheme, UMTS uses a CDMA technique known as Direct
Sequence Wideband CDMA (DS-WCDMA) [Dahlman 1998] within TDMA
slots; TDMA slots, in turn, are available on multiple frequencies—an interesting
use of all three dedicated channel-sharing approaches that we earlier identified in
Chapter 5 and similar to the approach taken in wired cable access networks (see
Section 5.3.4). This change requires a new 3G cellular wireless-access network
operating in parallel with the 2G BSS radio network shown in Figure 6.19. The
data service associated with the WCDMA specification is known as HSP (High
Speed Packet Access) and promises downlink data rates of up to 14 Mbps.
Details regarding 3G networks can be found at the 3rd Generation Partnership
Project (3GPP) Web site [3GPP 2012].
552
CHAPTER 6
•
WIRELESS AND MOBILE NETWORKS

---

## Page 41

6.4.3 On to 4G: LTE
With 3G systems now being deployed worldwide, can 4G systems be far behind?
Certainly not! Indeed, the design, early testing, and initial deployment of 4G sys-
tems are already underway. The 4G Long-Term Evolution (LTE) standard put for-
ward by the 3GPP has two important innovations over 3G systems:
•
Evolved Packet Core (EPC) [3GPP Network Architecture 2012]. The EPC is
a simplified all-IP core network that unifies the separate circuit-switched cel-
lular voice network and the packet-switched cellular data network shown in
Figure 6.19. It is an “all-IP” network in that both voice and data will be car-
ried in IP datagrams. As we’ve seen in Chapter 4 and will study in more detail
in Chapter 7, IP’s “best effort” service model is not inherently well-suited to
the stringent performance requirements of Voice-over-IP (VoIP) traffic unless
network resources are carefully managed to avoid (rather than react to) con-
gestion. Thus, a key task of the EPC is to manage network resources to pro-
vide this high quality of service. The EPC also makes a clear separation
between the network control and user data planes, with many of the mobility
support features that we will study in Section 6.7 being implemented in the
control plane. The EPC allows multiple types of radio access networks,
including legacy 2G and 3G radio access networks, to attach to the core
network. Two very readable introductions to the EPC are [Motorola 2007;
Alcatel-Lucent 2009].
•
LTE Radio Access Network. LTE uses a combination of frequency division
multiplexing and time division multiplexing on the downstream channel,
known as orthogonal frequency division multiplexing (OFDM) [Rohde 2008;
Ericsson 2011]. (The term “orthogonal” comes from the fact the signals being
sent on different frequency channels are created so that they interfere very lit-
tle with each other, even when channel frequencies are tightly spaced). In LTE,
each active mobile node is allocated one or more 0.5 ms time slots in one or
more of the channel frequencies. Figure 6.20 shows an allocation of eight time
slots over four frequencies. By being allocated increasingly more time slots
(whether on the same frequency or on different frequencies), a mobile node is
able to achieve increasingly higher transmission rates. Slot (re)allocation
among mobile nodes can be performed as often as once every millisecond. Dif-
ferent modulation schemes can also be used to change the transmission rate;
see our earlier discussion of Figure 6.3 and dynamic selection of modulation
schemes in WiFi networks. Another innovation in the LTE radio network is the
use of sophisticated multiple-input, multiple output (MIMO) antennas. The
maximum data rate for an LTE user is 100 Mbps in the downstream direction
and 50 Mbps in the upstream direction, when using 20 MHz worth of wireless
spectrum.
6.4
•
CELLULAR INTERNET ACCESS
553

---

## Page 42

The particular allocation of time slots to mobile nodes is not mandated by the
LTE standard. Instead, the decision of which mobile nodes will be allowed to
transmit in a given time slot on a given frequency is determined by the schedul-
ing algorithms provided by the LTE equipment vendor and/or the network opera-
tor. With opportunistic scheduling [Bender 2000; Kolding 2003; Kulkarni 2005],
matching the physical-layer protocol to the channel conditions between the
sender and receiver and choosing the receivers to which packets will be sent
based on channel conditions allow the radio network controller to make best use
of the wireless medium. In addition, user priorities and contracted levels of serv-
ice (e.g., silver, gold, or platinum) can be used in scheduling downstream packet
transmissions. In addition to the LTE capabilities described above, LTE-Advanced
allows for downstream bandwidths of hundreds of Mbps by allocating aggregated
channels to a mobile node [Akyildiz 2010].
An additional 4G wireless technology—WiMAX (World Interoperability for
Microwave Access)—is a family of IEEE 802.16 standards that differ significantly
from LTE. Whether LTE or WiMAX becomes the 4G technology of choice is still to
be seen, but at the time of this writing (spring 2012), LTE appears to have signifi-
cantly more momentum. A detailed discussion of WiMAX can be found on this
book’s Web site.
554
CHAPTER 6
•
WIRELESS AND MOBILE NETWORKS
f1
f2
f3
f4
f5
f6
0
0.5
1.0
1.5
2.0
2.5
9.0
9.5
10.0
Figure 6.20  Twenty 0.5 ms slots organized into 10 ms frames at each
frequency. An eight-slot allocation is shown shaded.

---

## Page 43

6.5 Mobility Management: Principles
Having covered the wireless nature of the communication links in a wireless net-
work, it’s now time to turn our attention to the mobility that these wireless links
enable. In the broadest sense, a mobile node is one that changes its point of attach-
ment into the network over time. Because the term mobility has taken on many
meanings in both the computer and telephony worlds, it will serve us well first to
consider several dimensions of mobility in some detail.
•
From the network layer’s standpoint, how mobile is a user? A physically mobile
user will present a very different set of challenges to the network layer, depend-
ing on how he or she moves between points of attachment to the network. At one
end of the spectrum in Figure 6.21, a user may carry a laptop with a wireless net-
work interface card around in a building. As we saw in Section 6.3.4, this user is
not mobile from a network-layer perspective. Moreover, if the user associates
with the same access point regardless of location, the user is not even mobile
from the perspective of the link layer.
At the other end of the spectrum, consider the user zooming along the autobahn
in a BMW at 150 kilometers per hour, passing through multiple wireless access
networks and wanting to maintain an uninterrupted TCP connection to a remote
application throughout the trip. This user is definitely mobile! In between these
extremes is a user who takes a laptop from one location (e.g., office or dormi-
tory) into another (e.g., coffeeshop, classroom) and wants to connect into the
network in the new location. This user is also mobile (although less so than the
BMW driver!) but does not need to maintain an ongoing connection while mov-
ing between points of attachment to the network. Figure 6.21 illustrates this spec-
trum of user mobility from the network layer’s perspective.
6.5
•
MOBILITY MANAGEMENT: PRINCIPLES
555
User moves only
within same wireless
access network
No mobility
High mobility
User moves between
access networks,
shutting down while
moving between
networks
User moves between
access networks,
while maintaining
ongoing connections
Figure 6.21  Various degrees of mobility, from the network layer’s point
of view

---

## Page 44

•
How important is it for the mobile node’s address to always remain the same?
With mobile telephony, your phone number—essentially the network-layer
address of your phone—remains the same as you travel from one provider’s
mobile phone network to another. Must a laptop similarly maintain the same IP
address while moving between IP networks?
The answer to this question will depend strongly on the applications being run.
For the BMW driver who wants to maintain an uninterrupted TCP connection to
a remote application while zipping along the autobahn, it would be convenient to
maintain the same IP address. Recall from Chapter 3 that an Internet application
needs to know the IP address and port number of the remote entity with which it
is communicating. If a mobile entity is able to maintain its IP address as it
moves, mobility becomes invisible from the application standpoint. There is
great value to this transparency—an application need not be concerned with a
potentially changing IP address, and the same application code serves mobile
and nonmobile connections alike. We’ll see in the following section that mobile
IP provides this transparency, allowing a mobile node to maintain its permanent
IP address while moving among networks.
On the other hand, a less glamorous mobile user might simply want to turn off an
office laptop, bring that laptop home, power up, and work from home. If the laptop
functions primarily as a client in client-server applications (e.g., send/read e-mail,
browse the Web, Telnet to a remote host) from home, the particular IP address used
by the laptop is not that important. In particular, one could get by fine with an
address that is temporarily allocated to the laptop by the ISP serving the home. We
saw in Section 4.4 that DHCP already provides this functionality.
•
What supporting wired infrastructure is available? In all of our scenarios above,
we’ve implicitly assumed that there is a fixed infrastructure to which the mobile
user can connect—for example, the home’s ISP network, the wireless access net-
work in the office, or the wireless access networks lining the autobahn. What if
no such infrastructure exists? If two users are within communication proximity
of each other, can they establish a network connection in the absence of any other
network-layer infrastructure? Ad hoc networking provides precisely these capa-
bilities. This rapidly developing area is at the cutting edge of mobile networking
research and is beyond the scope of this book. [Perkins 2000] and the IETF
Mobile Ad Hoc Network (manet) working group Web pages [manet 2012] pro-
vide thorough treatments of the subject.
In order to illustrate the issues involved in allowing a mobile user to maintain
ongoing connections while moving between networks, let’s consider a human
analogy. A twenty-something adult moving out of the family home becomes
mobile, living in a series of dormitories and/or apartments, and often changing
addresses. If an old friend wants to get in touch, how can that friend find the
address of her mobile friend? One common way is to contact the family, since a
556
CHAPTER 6
•
WIRELESS AND MOBILE NETWORKS

---

## Page 45

6.5
•
MOBILITY MANAGEMENT: PRINCIPLES
557
mobile adult will often register his or her current address with the family (if for no
other reason than so that the parents can send money to help pay the rent!). The
family home, with its permanent address, becomes that one place that others can
go as a first step in communicating with the mobile adult. Later communication
from the friend may be either indirect (for example, with mail being sent first to
the parents’ home and then forwarded to the mobile adult) or direct (for example,
with the friend using the address obtained from the parents to send mail directly to
her mobile friend).
In a network setting, the permanent home of a mobile node (such as a laptop
or smartphone) is known as the home network, and the entity within the home
network that performs the mobility management functions discussed below on
behalf of the mobile node is known as the home agent. The network in which
the mobile node is currently residing is known as the foreign (or visited) network,
and the entity within the foreign network that helps the mobile node with
the mobility management functions discussed below is known as a foreign agent.
For mobile professionals, their home network might likely be their company net-
work, while the visited network might be the network of a colleague they are visit-
ing. A correspondent is the entity wishing to communicate with the mobile node.
Figure 6.22 illustrates these concepts, as well as addressing concepts considered
below. In Figure 6.22, note that agents are shown as being collocated with routers
(e.g., as processes running on routers), but alternatively they could be executing on
other hosts or servers in the network.
6.5.1 Addressing
We noted above that in order for user mobility to be transparent to network applica-
tions, it is desirable for a mobile node to keep its address as it moves from one net-
work to another. When a mobile node is resident in a foreign network, all traffic
addressed to the node’s permanent address now needs to be routed to the foreign
network. How can this be done? One option is for the foreign network to advertise
to all other networks that the mobile node is resident in its network. This could be
via the usual exchange of intradomain and interdomain routing information and
would require few changes to the existing routing infrastructure. The foreign net-
work could simply advertise to its neighbors that it has a highly specific route to the
mobile node’s permanent address (that is, essentially inform other networks that it
has the correct path for routing datagrams to the mobile node’s permanent address;
see Section 4.4). These neighbors would then propagate this routing information
throughout the network as part of the normal procedure of updating routing infor-
mation and forwarding tables. When the mobile node leaves one foreign network
and joins another, the new foreign network would advertise a new, highly specific
route to the mobile node, and the old foreign network would withdraw its routing
information regarding the mobile node.

---

## Page 46

558
CHAPTER 6
•
WIRELESS AND MOBILE NETWORKS
This solves two problems at once, and it does so without making significant
changes to the network-layer infrastructure. Other networks know the location of
the mobile node, and it is easy to route datagrams to the mobile node, since the for-
warding tables will direct datagrams to the foreign network. A significant drawback,
however, is that of scalability. If mobility management were to be the responsibility
of network routers, the routers would have to maintain forwarding table entries for
potentially millions of mobile nodes, and update these entries as nodes move. Some
additional drawbacks are explored in the problems at the end of this chapter.
An alternative approach (and one that has been adopted in practice) is to push
mobility functionality from the network core to the network edge—a recurring
theme in our study of Internet architecture. A natural way to do this is via the mobile
node’s home network. In much the same way that parents of the mobile twenty-
something track their child’s location, the home agent in the mobile node’s home
network can track the foreign network in which the mobile node resides. A protocol
Home agent
Home network:
128.119.40/24
Visited network:
79.129.13/24
Mobile node
Permanent address:
128.119.40.186
Permanent address:
128.119.40.186
Foreign agent
Care-of address:
79.129.13.2
Correspondent
Wide area
network
Figure 6.22  Initial elements of a mobile network architecture

---

## Page 47

6.5
•
MOBILITY MANAGEMENT: PRINCIPLES
559
between the mobile node (or a foreign agent representing the mobile node) and the
home agent will certainly be needed to update the mobile node’s location.
Let’s now consider the foreign agent in more detail. The conceptually simplest
approach, shown in Figure 6.22, is to locate foreign agents at the edge routers in the
foreign network. One role of the foreign agent is to create a so-called care-of address
(COA) for the mobile node, with the network portion of the COA matching that of
the foreign network. There are thus two addresses associated with a mobile node, its
permanent address (analogous to our mobile youth’s family’s home address) and its
COA, sometimes known as a foreign address (analogous to the address of the house
in which our mobile youth is currently residing). In the example in Figure 6.22, the
permanent address of the mobile node is 128.119.40.186. When visiting network
79.129.13/24, the mobile node has a COA of 79.129.13.2. A second role of the for-
eign agent is to inform the home agent that the mobile node is resident in its (the for-
eign agent’s) network and has the given COA. We’ll see shortly that the COA will be
used to “reroute” datagrams to the mobile node via its foreign agent.
Although we have separated the functionality of the mobile node and the for-
eign agent, it is worth noting that the mobile node can also assume the responsibili-
ties of the foreign agent. For example, the mobile node could obtain a COA in the
foreign network (for example, using a protocol such as DHCP) and itself inform the
home agent of its COA.
6.5.2 Routing to a Mobile Node
We have now seen how a mobile node obtains a COA and how the home agent can
be informed of that address. But having the home agent know the COA solves only
part of the problem. How should datagrams be addressed and forwarded to the
mobile node? Since only the home agent (and not network-wide routers) knows the
location of the mobile node, it will no longer suffice to simply address a datagram to
the mobile node’s permanent address and send it into the network-layer infrastruc-
ture. Something more must be done. Two approaches can be identified, which we
will refer to as indirect and direct routing.
Indirect Routing to a Mobile Node
Let’s first consider a correspondent that wants to send a datagram to a mobile node.
In the indirect routing approach, the correspondent simply addresses the datagram
to the mobile node’s permanent address and sends the datagram into the network,
blissfully unaware of whether the mobile node is resident in its home network or is
visiting a foreign network; mobility is thus completely transparent to the correspon-
dent. Such datagrams are first routed, as usual, to the mobile node’s home network.
This is illustrated in step 1 in Figure 6.23.
Let’s now turn our attention to the home agent. In addition to being responsible
for interacting with a foreign agent to track the mobile node’s COA, the home agent

---

## Page 48

560
CHAPTER 6
•
WIRELESS AND MOBILE NETWORKS
has another very important function. Its second job is to be on the lookout for arriv-
ing datagrams addressed to nodes whose home network is that of the home agent but
that are currently resident in a foreign network. The home agent intercepts these
datagrams and then forwards them to a mobile node in a two-step process. The data-
gram is first forwarded to the foreign agent, using the mobile node’s COA (step 2 in
Figure 6.23), and then forwarded from the foreign agent to the mobile node (step 3
in Figure 6.23).
It is instructive to consider this rerouting in more detail. The home agent will
need to address the datagram using the mobile node’s COA, so that the network
layer will route the datagram to the foreign network. On the other hand, it is
desirable to leave the correspondent’s datagram intact, since the application receiv-
ing the datagram should be unaware that the datagram was forwarded via the home
agent. Both goals can be satisfied by having the home agent encapsulate the corre-
spondent’s original complete datagram within a new (larger) datagram. This larger
Home
agent
Home network:
128.119.40/24
Visited network:
79.129.13/24
Mobile node
Permanent address:
128.119.40.186
Permanent address:
128.119.40.186
Foreign
agent
Care-of
address:
79.129.13.2
Wide area
network
Correspondent
1
2
4
3
Figure 6.23  Indirect routing to a mobile node

---

## Page 49

6.5
•
MOBILITY MANAGEMENT: PRINCIPLES
561
datagram is addressed and delivered to the mobile node’s COA. The foreign agent,
who “owns” the COA, will receive and decapsulate the datagram—that is, remove
the correspondent’s original datagram from within the larger encapsulating data-
gram and forward (step 3 in Figure 6.23) the original datagram to the mobile node.
Figure 6.24 shows a correspondent’s original datagram being sent to the home net-
work, an encapsulated datagram being sent to the foreign agent, and the original
datagram being delivered to the mobile node. The sharp reader will note that the
encapsulation/decapsulation described here is identical to the notion of tunneling,
discussed in Chapter 4 in the context of IP multicast and IPv6.
Let’s next consider how a mobile node sends datagrams to a correspondent.
This is quite simple, as the mobile node can address its datagram directly to the cor-
respondent (using its own permanent address as the source address, and the corre-
spondent’s address as the destination address). Since the mobile node knows the
correspondent’s address, there is no need to route the datagram back through the
home agent. This is shown as step 4 in Figure 6.23.
Let’s summarize our discussion of indirect routing by listing the new network-
layer functionality required to support mobility.
Home
agent
Permanent address:
128.119.40.186
Permanent address:
128.119.40.186
Foreign
agent
Correspondent
dest: 128.119.40.186
dest: 79.129.13.2
dest: 128.119.40.186
dest: 128.119.40.186
Care-of address:
79.129.13.2
Figure 6.24  Encapsulation and decapsulation

---

## Page 50

•
A mobile-node–to–foreign-agent protocol. The mobile node will register with
the foreign agent when attaching to the foreign network. Similarly, a mobile
node will deregister with the foreign agent when it leaves the foreign network.
•
A foreign-agent–to–home-agent registration protocol. The foreign agent will
register the mobile node’s COA with the home agent. A foreign agent need not
explicitly deregister a COA when a mobile node leaves its network, because the
subsequent registration of a new COA, when the mobile node moves to a new
network, will take care of this.
•
A home-agent datagram encapsulation protocol. Encapsulation and forward-
ing of the correspondent’s original datagram within a datagram addressed to
the COA.
•
A foreign-agent decapsulation protocol. Extraction of the correspondent’s origi-
nal datagram from the encapsulating datagram, and the forwarding of the origi-
nal datagram to the mobile node.
The previous discussion provides all the pieces—foreign agents, the home
agent, and indirect forwarding—needed for a mobile node to maintain an ongo-
ing connection while moving among networks. As an example of how these
pieces fit together, assume the mobile node is attached to foreign network A, has
registered a COA in network A with its home agent, and is receiving datagrams
that are being indirectly routed through its home agent. The mobile node now
moves to foreign network B and registers with the foreign agent in network B,
which informs the home agent of the mobile node’s new COA. From this point
on, the home agent will reroute datagrams to foreign network B. As far as a cor-
respondent is concerned, mobility is transparent—datagrams are routed via the
same home agent both before and after the move. As far as the home agent is con-
cerned, there is no disruption in the flow of datagrams—arriving datagrams are
first forwarded to foreign network A; after the change in COA, datagrams are for-
warded to foreign network B. But will the mobile node see an interrupted flow of
datagrams as it moves between networks? As long as the time between the
mobile node’s disconnection from network A (at which point it can no longer
receive datagrams via A) and its attachment to network B (at which point it will
register a new COA with its home agent) is small, few datagrams will be lost.
Recall from Chapter 3 that end-to-end connections can suffer datagram loss due
to network congestion. Hence occasional datagram loss within a connection
when a node moves between networks is by no means a catastrophic problem. If
loss-free communication is required, upper-layer mechanisms will recover from
datagram loss, whether such loss results from network congestion or from user
mobility.
An indirect routing approach is used in the mobile IP standard [RFC 5944], as
discussed in Section 6.6.
562
CHAPTER 6
•
WIRELESS AND MOBILE NETWORKS

---

## Page 51

6.5
•
MOBILITY MANAGEMENT: PRINCIPLES
563
Direct Routing to a Mobile Node
The indirect routing approach illustrated in Figure 6.23 suffers from an inefficiency
known as the triangle routing problem—datagrams addressed to the mobile node
must be routed first to the home agent and then to the foreign network, even when a
much more efficient route exists between the correspondent and the mobile node. In
the worst case, imagine a mobile user who is visiting the foreign network of a col-
league. The two are sitting side by side and exchanging data over the network. Data-
grams from the correspondent (in this case the colleague of the visitor) are routed to
the mobile user’s home agent and then back again to the foreign network!
Direct routing overcomes the inefficiency of triangle routing, but does so at the
cost of additional complexity. In the direct routing approach, a correspondent agent in
the correspondent’s network first learns the COA of the mobile node. This can be done
by having the correspondent agent query the home agent, assuming that (as in the case
of indirect routing) the mobile node has an up-to-date value for its COA registered with
its home agent. It is also possible for the correspondent itself to perform the function of
the correspondent agent, just as a mobile node could perform the function of the for-
eign agent. This is shown as steps 1 and 2 in Figure 6.25. The correspondent agent then
tunnels datagrams directly to the mobile node’s COA, in a manner analogous to the tun-
neling performed by the home agent, steps 3 and 4 in Figure 6.25.
While direct routing overcomes the triangle routing problem, it introduces two
important additional challenges:
•
A mobile-user location protocol is needed for the correspondent agent to query
the home agent to obtain the mobile node’s COA (steps 1 and 2 in Figure 6.25).
•
When the mobile node moves from one foreign network to another, how will data
now be forwarded to the new foreign network? In the case of indirect routing, this
problem was easily solved by updating the COA maintained by the home
agent. However, with direct routing, the home agent is queried for the COA by
the correspondent agent only once, at the beginning of the session. Thus, updat-
ing the COA at the home agent, while necessary, will not be enough to solve the
problem of routing data to the mobile node’s new foreign network.
One solution would be to create a new protocol to notify the correspondent of
the changing COA. An alternate solution, and one that we’ll see adopted in practice in
GSM networks, works as follows. Suppose data is currently being forwarded to the
mobile node in the foreign network where the mobile node was located when the ses-
sion first started (step 1 in Figure 6.26). We’ll identify the foreign agent in that for-
eign network where the mobile node was first found as the anchor foreign agent.
When the mobile node moves to a new foreign network (step 2 in Figure 6.26), the
mobile node registers with the new foreign agent (step 3), and the new foreign agent
provides the anchor foreign agent with the mobile node’s new COA (step 4). When

---

## Page 52

564
CHAPTER 6
•
WIRELESS AND MOBILE NETWORKS
Home
agent
Home network:
128.119.40/24
Visited network:
79.129.13/24
Mobile node
Permanent address:
128.119.40.186
Key:
Permanent address:
128.119.40.186
Foreign
agent
Care-of address:
79.129.13.2
Wide area
network
Correspondent
Control messages
Correspondent
agent
1
2
3
Data flow
4
Figure 6.25  Direct routing to a mobile user
the anchor foreign agent receives an encapsulated datagram for a departed mobile
node, it can then re-encapsulate the datagram and forward it to the mobile node
(step 5) using the new COA. If the mobile node later moves yet again to a new for-
eign network, the foreign agent in that new visited network would then contact the
anchor foreign agent in order to set up forwarding to this new foreign network.
6.6 Mobile IP
The Internet architecture and protocols for supporting mobility, collectively known
as mobile IP, are defined primarily in RFC 5944 for IPv4. Mobile IP is a flexible
standard, supporting many different modes of operation (for example, operation

---

## Page 53

6.6
•
MOBILE IP
565
Home
agent
Home network:
Foreign network
being visited at
session start:
New foreign
network:
Anchor
foreign
agent
New foreign agent
Wide area
network
Correspondent
Correspondent
agent
1
4
2
3
5
Figure 6.26  Mobile transfer between networks with direct routing
with or without a foreign agent), multiple ways for agents and mobile nodes to dis-
cover each other, use of single or multiple COAs, and multiple forms of encapsula-
tion. As such, mobile IP is a complex standard, and would require an entire book to
describe in detail; indeed one such book is [Perkins 1998b]. Our modest goal here is
to provide an overview of the most important aspects of mobile IP and to illustrate
its use in a few common-case scenarios.
The mobile IP architecture contains many of the elements we have considered
above, including the concepts of home agents, foreign agents, care-of addresses, and
encapsulation/decapsulation. The current standard [RFC 5944] specifies the use of
indirect routing to the mobile node.
The mobile IP standard consists of three main pieces:
•
Agent discovery. Mobile IP defines the protocols used by a home or foreign agent
to advertise its services to mobile nodes, and protocols for mobile nodes to solicit
the services of a foreign or home agent.

---

## Page 54

566
CHAPTER 6
•
WIRELESS AND MOBILE NETWORKS
•
Registration with the home agent. Mobile IP defines the protocols used by the
mobile node and/or foreign agent to register and deregister COAs with a mobile
node’s home agent.
•
Indirect routing of datagrams. The standard also defines the manner in which
datagrams are forwarded to mobile nodes by a home agent, including rules for
forwarding datagrams, rules for handling error conditions, and several forms of
encapsulation [RFC 2003, RFC 2004].
Security considerations are prominent throughout the mobile IP standard. For
example, authentication of a mobile node is clearly needed to ensure that a mali-
cious user does not register a bogus care-of address with a home agent, which
could cause all datagrams addressed to an IP address to be redirected to the mali-
cious user. Mobile IP achieves security using many of the mechanisms that we will
examine in Chapter 8, so we will not address security considerations in our discus-
sion below.
Agent Discovery
A mobile IP node arriving to a new network, whether attaching to a foreign network
or returning to its home network, must learn the identity of the corresponding for-
eign or home agent. Indeed it is the discovery of a new foreign agent, with a new
network address, that allows the network layer in a mobile node to learn that it has
moved into a new foreign network. This process is known as agent discovery.
Agent discovery can be accomplished in one of two ways: via agent advertisement
or via agent solicitation.
With agent advertisement, a foreign or home agent advertises its services
using an extension to the existing router discovery protocol [RFC 1256]. The
agent periodically broadcasts an ICMP message with a type field of 9 (router dis-
covery) on all links to which it is connected. The router discovery message con-
tains the IP address of the router (that is, the agent), thus allowing a mobile node
to learn the agent’s IP address. The router discovery message also contains a
mobility agent advertisement extension that contains additional information
needed by the mobile node. Among the more important fields in the extension are
the following:
•
Home agent bit (H). Indicates that the agent is a home agent for the network in
which it resides.
•
Foreign agent bit (F). Indicates that the agent is a foreign agent for the network
in which it resides.
•
Registration required bit (R). Indicates that a mobile user in this network must
register with a foreign agent. In particular, a mobile user cannot obtain a care-
of address in the foreign network (for example, using DHCP) and assume the

---

## Page 55

6.6
•
MOBILE IP
567
functionality of the foreign agent for itself, without registering with the for-
eign agent.
•
M, G encapsulation bits. Indicate whether a form of encapsulation other than IP-
in-IP encapsulation will be used.
•
Care-of address (COA) fields. A list of one or more care-of addresses provided
by the foreign agent. In our example below, the COA will be associated with the
foreign agent, who will receive datagrams sent to the COA and then forward
them to the appropriate mobile node. The mobile user will select one of these
addresses as its COA when registering with its home agent.
Figure 6.27 illustrates some of the key fields in the agent advertisement message.
With agent solicitation, a mobile node wanting to learn about agents without
waiting to receive an agent advertisement can broadcast an agent solicitation mes-
sage, which is simply an ICMP message with type value 10. An agent receiving the
solicitation will unicast an agent advertisement directly to the mobile node, which
can then proceed as if it had received an unsolicited advertisement.
Type = 9
Code = 0
Type = 16
Length
Sequence number
Registration lifetime
Reserved
RBHFMGrT
bits
Checksum
Standard
ICMP fields
0
8
16
24
Router address
0 or more care-of addresses
Mobility agent
advertisement
extension
Figure 6.27  ICMP router discovery message with mobility agent
advertisement extension

---

## Page 56

568
CHAPTER 6
•
WIRELESS AND MOBILE NETWORKS
Registration with the Home Agent
Once a mobile IP node has received a COA, that address must be registered with the
home agent. This can be done either via the foreign agent (who then registers
the COA with the home agent) or directly by the mobile IP node itself. We consider
the former case below. Four steps are involved.
1. Following the receipt of a foreign agent advertisement, a mobile node sends a
mobile IP registration message to the foreign agent. The registration message is
carried within a UDP datagram and sent to port 434. The registration message
carries a COA advertised by the foreign agent, the address of the home agent
(HA), the permanent address of the mobile node (MA), the requested lifetime
of the registration, and a 64-bit registration identification. The requested regis-
tration lifetime is the number of seconds that the registration is to be valid. If
the registration is not renewed at the home agent within the specified lifetime,
the registration will become invalid. The registration identifier acts like a
sequence number and serves to match a received registration reply with a reg-
istration request, as discussed below.
2. The foreign agent receives the registration message and records the mobile node’s
permanent IP address. The foreign agent now knows that it should be looking for
datagrams containing an encapsulated datagram whose destination address
matches the permanent address of the mobile node. The foreign agent then sends a
mobile IP registration message (again, within a UDP datagram) to port 434 of the
home agent. The message contains the COA, HA, MA, encapsulation format
requested, requested registration lifetime, and registration identification.
3. The home agent receives the registration request and checks for authenticity
and correctness. The home agent binds the mobile node’s permanent IP address
with the COA; in the future, datagrams arriving at the home agent and
addressed to the mobile node will now be encapsulated and tunneled to the
COA. The home agent sends a mobile IP registration reply containing the HA,
MA, actual registration lifetime, and the registration identification of the
request that is being satisfied with this reply.
4. The foreign agent receives the registration reply and then forwards it to the
mobile node.
At this point, registration is complete, and the mobile node can receive data-
grams sent to its permanent address. Figure 6.28 illustrates these steps. Note that the
home agent specifies a lifetime that is smaller than the lifetime requested by the
mobile node.
A foreign agent need not explicitly deregister a COA when a mobile node
leaves its network. This will occur automatically, when the mobile node moves to a
new network (whether another foreign network or its home network) and registers a
new COA.

---

## Page 57

6.6
•
MOBILE IP
569
The mobile IP standard allows many additional scenarios and capabilities in
addition to those described previously. The interested reader should consult [Perkins
1998b; RFC 5944].
Home agent
HA: 128.119.40.7
Mobile agent
MA: 128.119.40.186
Visited network:
79.129.13/24
ICMP agent adv.
COA: 79.129.13.2
. . .
COA: 79.129.13.2
HA:128.119.40.7
MA: 128.119.40.186
Lifetime: 9999
identification: 714
. . .
Registration req.
COA: 79.129.13.2
HA:128.119.40.7
MA: 128.119.40.186
Lifetime: 9999
identification: 714
encapsulation format
. . .
Registration req.
Time
Time
Time
HA: 128.119.40.7
MA: 128.119.40.186
Lifetime: 4999
identification: 714
encapsulation format
. . .
Registration reply
HA: 128.119.40.7
MA: 128.119.40.186
Lifetime: 4999
identification: 714
. . .
Registration reply
Foreign agent
COA: 79.129.13.2
Figure 6.28  Agent advertisement and mobile IP registration

---

## Page 58

570
CHAPTER 6
•
WIRELESS AND MOBILE NETWORKS
6.7 Managing Mobility in Cellular Networks
Having examined how mobility is managed in IP networks, let’s now turn our atten-
tion to networks with an even longer history of supporting mobility—cellular
telephony networks. Whereas we focused on the first-hop wireless link in cellular
networks in Section 6.4, we’ll focus here on mobility, using the GSM cellular net-
work architecture [Goodman 1997; Mouly 1992; Scourias 2012; Kaaranen 2001;
Korhonen 2003; Turner 2012] as our case study, since it is a mature and widely
deployed technology. As in the case of mobile IP, we’ll see that a number of the fun-
damental principles we identified in Section 6.5 are embodied in GSM’s network
architecture.
Like mobile IP, GSM adopts an indirect routing approach (see Section 6.5.2),
first routing the correspondent’s call to the mobile user’s home network and from
there to the visited network. In GSM terminology, the mobile users’s home network
is referred to as the mobile user’s home public land mobile network (home
PLMN). Since the PLMN acronym is a bit of a mouthful, and mindful of our quest
to avoid an alphabet soup of acronyms, we’ll refer to the GSM home PLMN simply
as the home network. The home network is the cellular provider with which the
mobile user has a subscription (i.e., the provider that bills the user for monthly cel-
lular service). The visited PLMN, which we’ll refer to simply as the visited net-
work, is the network in which the mobile user is currently residing.
As in the case of mobile IP, the responsibilities of the home and visited net-
works are quite different.
•
The home network maintains a database known as the home location register
(HLR), which contains the permanent cell phone number and subscriber pro-
file information for each of its subscribers. Importantly, the HLR also con-
tains information about the current locations of these subscribers. That is, if a
mobile user is currently roaming in another provider’s cellular network, the
HLR contains enough information to obtain (via a process we’ll describe
shortly) an address in the visited network to which a call to the mobile user
should be routed. As we’ll see, a special switch in the home network, known
as the Gateway Mobile services Switching Center (GMSC) is contacted by
a correspondent when a call is placed to a mobile user. Again, in our quest to
avoid an alphabet soup of acronyms, we’ll refer to the GMSC here by a more
descriptive term, home MSC.
•
The visited network maintains a database known as the visitor location register
(VLR). The VLR contains an entry for each mobile user that is currently in the
portion of the network served by the VLR. VLR entries thus come and go as
mobile users enter and leave the network. A VLR is usually co-located with the
mobile switching center (MSC) that coordinates the setup of a call to and from
the visited network.

---

## Page 59

6.7
•
MANAGING MOBILITY IN CELLULAR NETWORKS
571
In practice, a provider’s cellular network will serve as a home network for its sub-
scribers and as a visited network for mobile users whose subscription is with a dif-
ferent cellular provider.
6.7.1 Routing Calls to a Mobile User
We’re now in a position to describe how a call is placed to a mobile GSM user in a
visited network. We’ll consider a simple example below; more complex scenarios are
described in [Mouly 1992]. The steps, as illustrated in Figure 6.29, are as follows:
1. The correspondent dials the mobile user’s phone number. This number itself
does not refer to a particular telephone line or location (after all, the phone
number is fixed and the user is mobile!). The leading digits in the number are
sufficient to globally identify the mobile’s home network. The call is routed
from the correspondent through the PSTN to the home MSC in the mobile’s
home network. This is the first leg of the call.
2. The home MSC receives the call and interrogates the HLR to determine the
location of the mobile user. In the simplest case, the HLR returns the mobile
Mobile
user
Visited
network
Home
network
Public switched
telephone
network
1
3
Correspondent
VLR
HLR
2
Figure 6.29  Placing a call to a mobile user: indirect routing

---

## Page 60

572
CHAPTER 6
•
WIRELESS AND MOBILE NETWORKS
station roaming number (MSRN), which we will refer to as the roaming
number. Note that this number is different from the mobile’s permanent phone
number, which is associated with the mobile’s home network. The roaming
number is ephemeral: It is temporarily assigned to a mobile when it enters a vis-
ited network. The roaming number serves a role similar to that of the care-of
address in mobile IP and, like the COA, is invisible to the correspondent and the
mobile. If HLR does not have the roaming number, it returns the address of the
VLR in the visited network. In this case (not shown in Figure 6.29), the home
MSC will need to query the VLR to obtain the roaming number of the mobile
node. But how does the HLR get the roaming number or the VLR address in the
first place? What happens to these values when the mobile user moves to
another visited network? We’ll consider these important questions shortly.
3. Given the roaming number, the home MSC sets up the second leg of the call
through the network to the MSC in the visited network. The call is completed,
being routed from the correspondent to the home MSC, and from there to the
visited MSC, and from there to the base station serving the mobile user.
An unresolved question in step 2 is how the HLR obtains information about
the location of the mobile user. When a mobile telephone is switched on or enters a
part of a visited network that is covered by a new VLR, the mobile must register
with the visited network. This is done through the exchange of signaling messages
between the mobile and the VLR. The visited VLR, in turn, sends a location update
request message to the mobile’s HLR. This message informs the HLR of either the
roaming number at which the mobile can be contacted, or the address of the VLR
(which can then later be queried to obtain the mobile number). As part of this
exchange, the VLR also obtains subscriber information from the HLR about the
mobile and determines what services (if any) should be accorded the mobile user
by the visited network.
6.7.2 Handoffs in GSM
A handoff occurs when a mobile station changes its association from one base sta-
tion to another during a call. As shown in Figure 6.30, a mobile’s call is initially
(before handoff) routed to the mobile through one base station (which we’ll refer to
as the old base station), and after handoff is routed to the mobile through another
base station (which we’ll refer to as the new base station). Note that a handoff
between base stations results not only in the mobile transmitting/receiving to/from a
new base station, but also in the rerouting of the ongoing call from a switching point
within the network to the new base station. Let’s initially assume that the old and
new base stations share the same MSC, and that the rerouting occurs at this MSC.
There may be several reasons for handoff to occur, including (1) the signal
between the current base station and the mobile may have deteriorated to such an
extent that the call is in danger of being dropped, and (2) a cell may have become

---

## Page 61

6.7
•
MANAGING MOBILITY IN CELLULAR NETWORKS
573
overloaded, handling a large number of calls. This congestion may be alleviated by
handing off mobiles to less congested nearby cells.
While it is associated with a base station, a mobile periodically measures the
strength of a beacon signal from its current base station as well as beacon signals from
nearby base stations that it can “hear.” These measurements are reported once or twice
a second to the mobile’s current base station. Handoff in GSM is initiated by the old
base station based on these measurements, the current loads of mobiles in nearby cells,
and other factors [Mouly 1992]. The GSM standard does not specify the specific algo-
rithm to be used by a base station to determine whether or not to perform handoff.
Figure 6.31 illustrates the steps involved when a base station does decide to
hand off a mobile user:
1. The old base station (BS) informs the visited MSC that a handoff is to be per-
formed and the BS (or possible set of BSs) to which the mobile is to be handed off.
2. The visited MSC initiates path setup to the new BS, allocating the resources
needed to carry the rerouted call, and signaling the new BS that a handoff is
about to occur.
3. The new BS allocates and activates a radio channel for use by the mobile.
4. The new BS signals back to the visited MSC and the old BS that the visited-
MSC-to-new-BS path has been established and that the mobile should be
informed of the impending handoff. The new BS provides all of the informa-
tion that the mobile will need to associate with the new BS.
5. The mobile is informed that it should perform a handoff. Note that up until this
point, the mobile has been blissfully unaware that the network has been laying
the groundwork (e.g., allocating a channel in the new BS and allocating a path
from the visited MSC to the new BS) for a handoff.
6. The mobile and the new BS exchange one or more messages to fully activate
the new channel in the new BS.
Old BS
New BS
Old
routing
New
routing
VLR
Figure 6.30  Handoff scenario between base stations with a common
MSC

---

## Page 62

574
CHAPTER 6
•
WIRELESS AND MOBILE NETWORKS
7. The mobile sends a handoff complete message to the new BS, which is for-
warded up to the visited MSC. The visited MSC then reroutes the ongoing call
to the mobile via the new BS.
8. The resources allocated along the path to the old BS are then released.
Let’s conclude our discussion of handoff by considering what happens when the
mobile moves to a BS that is associated with a different MSC than the old BS, and what
happens when this inter-MSC handoff occurs more than once. As shown in Figure 6.32,
GSM defines the notion of an anchor MSC. The anchor MSC is the MSC visited by
the mobile when a call first begins; the anchor MSC thus remains unchanged during
the call. Throughout the call’s duration and regardless of the number of inter-MSC
transfers performed by the mobile, the call is routed from the home MSC to the anchor
MSC, and then from the anchor MSC to the visited MSC where the mobile is currently
located. When a mobile moves from the coverage area of one MSC to another, the
ongoing call is rerouted from the anchor MSC to the new visited MSC containing the
new base station. Thus, at all times there are at most three MSCs (the home MSC, the
anchor MSC, and the visited MSC) between the correspondent and the mobile. Figure
6.32 illustrates the routing of a call among the MSCs visited by a mobile user.
Rather than maintaining a single MSC hop from the anchor MSC to the current
MSC, an alternative approach would have been to simply chain the MSCs visited by
the mobile, having an old MSC forward the ongoing call to the new MSC each time
the mobile moves to a new MSC. Such MSC chaining can in fact occur in IS-41 cel-
lular networks, with an optional path minimization step to remove MSCs between the
anchor MSC and the current visited MSC [Lin 2001].
Let’s wrap up our discussion of GSM mobility management with a comparison
of mobility management in GSM and Mobile IP. The comparison in Table 6.2 indi-
cates that although IP and cellular networks are fundamentally different in many
ways, they share a surprising number of common functional elements and overall
approaches in handling mobility.
Old
BS
New
BS
1
5
7
8
2
3
6
4
VLR
Figure 6.31  Steps in accomplishing a handoff between base stations
with a common MSC

---

## Page 63

6.8
•
WIRELESS AND MOBILITY: IMPACT ON HIGHER-LAYER PROTOCOLS
575
6.8 Wireless and Mobility: Impact on Higher-
Layer Protocols
In this chapter, we’ve seen that wireless networks differ significantly from their wired
counterparts at both the link layer (as a result of wireless channel characteristics such as
fading, multipath, and hidden terminals) and at the network layer (as a result of mobile
users who change their points of attachment to the network). But are there important dif-
ferences at the transport and application layers? It’s tempting to think that these differ-
ences will be minor, since the network layer provides the same best-effort delivery
service model to upper layers in both wired and wireless networks. Similarly, if proto-
cols such as TCP or UDP are used to provide transport-layer services to applications in
both wired and wireless networks, then the application layer should remain unchanged as
well. In one sense our intuition is right—TCP and UDP can (and do) operate in networks
with wireless links. On the other hand, transport protocols in general, and TCP in partic-
ular, can sometimes have very different performance in wired and wireless networks,
and it is here, in terms of performance, that differences are manifested. Let’s see why.
Recall that TCP retransmits a segment that is either lost or corrupted on the path
between sender and receiver. In the case of mobile users, loss can result from either
Home network
Correspondent
a.  Before handoff
Anchor
MSC
PSTN
b.  After handoff
Correspondent
Anchor
MSC
PSTN
Home network
Figure 6.32  Rerouting via the anchor MSC

---

## Page 64

576
CHAPTER 6
•
WIRELESS AND MOBILE NETWORKS
network congestion (router buffer overflow) or from handoff (e.g., from delays in
rerouting segments to a mobile’s new point of attachment to the network). In all
cases, TCP’s receiver-to-sender ACK indicates only that a segment was not received
intact; the sender is unaware of whether the segment was lost due to congestion,
during handoff, or due to detected bit errors. In all cases, the sender’s response is
the same—to retransmit the segment. TCP’s congestion-control response is also the
same in all cases—TCP decreases its congestion window, as discussed in Section
3.7. By unconditionally decreasing its congestion window, TCP implicitly assumes
that segment loss results from congestion rather than corruption or handoff. We saw
in Section 6.2 that bit errors are much more common in wireless networks than in
wired networks. When such bit errors occur or when handoff loss occurs, there’s
really no reason for the TCP sender to decrease its congestion window (and thus
decrease its sending rate). Indeed, it may well be the case that router buffers are
empty and packets are flowing along the end-to-end path unimpeded by congestion.
Researchers realized in the early to mid 1990s that given high bit error rates on
wireless links and the possibility of handoff loss, TCP’s congestion-control response
could be problematic in a wireless setting. Three broad classes of approaches are
possible for dealing with this problem:
•
Local recovery. Local recovery protocols recover from bit errors when and where
(e.g., at the wireless link) they occur, e.g., the 802.11 ARQ protocol we studied
GSM element
Comment on GSM element
Mobile IP element
Home system
Network to which the mobile user’s permanent phone
Home network
number belongs.
Gateway mobile switching center or
Home MSC: point of contact to obtain routable address of
Home agent
simply home MSC, Home
mobile user. HLR: database in home system containing permanent
location register (HLR)
phone number, profile information, current location of mobile user,
subscription information.
Visited system
Network other than home system where mobile user is currently residing.
Visited network.
Visited mobile services switching center,
Visited MSC: responsible for setting up calls to/from mobile nodes
Foreign agent
Visitor location register (VLR)
in cells associated with MSC. VLR: temporary database entry in
visited system, containing subscription information for each
visiting mobile user.
Mobile station roaming number
Routable address for telephone call segment between home MSC
Care-of address
(MSRN) or simply roaming number
and visited MSC, visible to neither the mobile nor the correspondent.
Table 6.2
 Commonalities between mobile IP and GSM mobility

---

## Page 65

6.8
•
WIRELESS AND MOBILITY: IMPACT ON HIGHER-LAYER PROTOCOLS
577
in Section 6.3, or more sophisticated approaches that use both ARQ and FEC
[Ayanoglu 1995].
•
TCP sender awareness of wireless links. In the local recovery approaches, the
TCP sender is blissfully unaware that its segments are traversing a wireless link.
An alternative approach is for the TCP sender and receiver to be aware of the
existence of a wireless link, to distinguish between congestive losses occurring in
the wired network and corruption/loss occurring at the wireless link, and to
invoke congestion control only in response to congestive wired-network losses.
[Balakrishnan 1997] investigates various types of TCP, assuming that end systems
can make this distinction. [Liu 2003] investigates techniques for distinguishing
between losses on the wired and wireless segments of an end-to-end path.
•
Split-connection approaches. In a split-connection approach [Bakre 1995], the
end-to-end connection between the mobile user and the other end point is broken
into two transport-layer connections: one from the mobile host to the wireless
access point, and one from the wireless access point to the other communication
end point (which we’ll assume here is a wired host). The end-to-end connection
is thus formed by the concatenation of a wireless part and a wired part. The trans-
port layer over the wireless segment can be a standard TCP connection [Bakre
1995], or a specially tailored error recovery protocol on top of UDP. [Yavatkar
1994] investigates the use of a transport-layer selective repeat protocol over the
wireless connection. Measurements reported in [Wei 2006] indicate that split
TCP connections are widely used in cellular data networks, and that significant
improvements can indeed be made through the use of split TCP connections.
Our treatment of TCP over wireless links has been necessarily brief here. In-
depth surveys of TCP challenges and solutions in wireless networks can be found in
[Hanabali 2005; Leung 2006]. We encourage you to consult the references for
details of this ongoing area of research.
Having considered transport-layer protocols, let us next consider the effect of
wireless and mobility on application-layer protocols. Here, an important considera-
tion is that wireless links often have relatively low bandwidths, as we saw in Figure
6.2. As a result, applications that operate over wireless links, particularly over cellu-
lar wireless links, must treat bandwidth as a scarce commodity. For example, a Web
server serving content to a Web browser executing on a 3G phone will likely not be
able to provide the same image-rich content that it gives to a browser operating over
a wired connection. Although wireless links do provide challenges at the application
layer, the mobility they enable also makes possible a rich set of location-aware and
context-aware applications [Chen 2000; Baldauf 2007]. More generally, wireless
and mobile networks will play a key role in realizing the ubiquitous computing envi-
ronments of the future [Weiser 1991]. It’s fair to say that we’ve only seen the tip of
the iceberg when it comes to the impact of wireless and mobile networks on net-
worked applications and their protocols!

---

## Page 66

6.9 Summary
Wireless and mobile networks have revolutionized telephony and are having an
increasingly profound impact in the world of computer networks as well. With their
anytime, anywhere, untethered access into the global network infrastructure, they
are not only making network access more ubiquitous, they are also enabling an
exciting new set of location-dependent services. Given the growing importance of
wireless and mobile networks, this chapter has focused on the principles, common
link technologies, and network architectures for supporting wireless and mobile
communication.
We began this chapter with an introduction to wireless and mobile networks,
drawing an important distinction between the challenges posed by the wireless
nature of the communication links in such networks, and by the mobility that these
wireless links enable. This allowed us to better isolate, identify, and master the key
concepts in each area. We focused first on wireless communication, considering the
characteristics of a wireless link in Section 6.2. In Sections 6.3 and 6.4, we exam-
ined the link-level aspects of the IEEE 802.11 (WiFi) wireless LAN standard, two
IEEE 802.15 personal area networks (Bluetooth and Zigbee), and 3G and 4G cellu-
lar Internet access. We then turned our attention to the issue of mobility. In Section
6.5, we identified several forms of mobility, with points along this spectrum posing
different challenges and admitting different solutions. We considered the problems
of locating and routing to a mobile user, as well as approaches for handing off the
mobile user who dynamically moves from one point of attachment to the network to
another. We examined how these issues were addressed in the mobile IP standard
and in GSM, in Sections 6.6 and 6.7, respectively. Finally, we considered the impact
of wireless links and mobility on transport-layer protocols and networked applica-
tions in Section 6.8.
Although we have devoted an entire chapter to the study of wireless and mobile
networks, an entire book (or more) would be required to fully explore this exciting
and rapidly expanding field. We encourage you to delve more deeply into this field
by consulting the many references provided in this chapter.
Homework Problems and Questions
Chapter 6 Review Questions
SECTION 6.1
R1. What does it mean for a wireless network to be operating in “infrastructure
mode?” If the network is not in infrastructure mode, what mode of operation
is it in, and what is the difference between that mode of operation and infra-
structure mode?
578
CHAPTER 6
•
WIRELESS AND MOBILE NETWORKS

---

## Page 67

R2. What are the four types of wireless networks identified in our taxonomy in
Section 6.1? Which of these types of wireless networks have you used?
SECTION 6.2
R3. What are the differences between the following types of wireless channel
impairments: path loss, multipath propagation, interference from other
sources?
R4. As a mobile node gets farther and farther away from a base station, what are
two actions that a base station could take to ensure that the loss probability of
a transmitted frame does not increase?
SECTIONS 6.3 AND 6.4
R5. Describe the role of the beacon frames in 802.11.
R6. True or false: Before an 802.11 station transmits a data frame, it must first
send an RTS frame and receive a corresponding CTS frame.
R7. Why are acknowledgments used in 802.11 but not in wired Ethernet?
R8. True or false: Ethernet and 802.11 use the same frame structure.
R9. Describe how the RTS threshold works.
R10. Suppose the IEEE 802.11 RTS and CTS frames were as long as the standard
DATA and ACK frames. Would there be any advantage to using the CTS and
RTS frames? Why or why not?
R11. Section 6.3.4 discusses 802.11 mobility, in which a wireless station moves
from one BSS to another within the same subnet. When the APs are intercon-
nected with a switch, an AP may need to send a frame with a spoofed MAC
address to get the switch to forward the frame properly. Why?
R12. What are the differences between a master device in a Bluetooth network and
a base station in an 802.11 network?
R13. What is meant by a super frame in the 802.15.4 Zigbee standard?
R14. What is the role of the “core network” in the 3G cellular data architecture?
R15. What is the role of the RNC in the 3G cellular data network architecture?
What role does the RNC play in the cellular voice network?
SECTIONS 6.5 AND 6.6
R16. If a node has a wireless connection to the Internet, does that node have to be
mobile? Explain. Suppose that a user with a laptop walks around her house
with her laptop, and always accesses the Internet through the same access
point. Is this user mobile from a network standpoint? Explain.
R17. What is the difference between a permanent address and a care-of address?
Who assigns a care-of address?
HOMEWORK PROBLEMS AND QUESTIONS
579

---

## Page 68

R18. Consider a TCP connection going over Mobile IP. True or false: The TCP
connection phase between the correspondent and the mobile host goes
through the mobile’s home network, but the data transfer phase is directly
between the correspondent and the mobile host, bypassing the home network.
SECTION 6.7
R19. What are the purposes of the HLR and VLR in GSM networks? What ele-
ments of mobile IP are similar to the HLR and VLR?
R20. What is the role of the anchor MSC in GSM networks?
SECTION 6.8
R21. What are three approaches that can be taken to avoid having a single wireless
link degrade the performance of an end-to-end transport-layer TCP connection?
Problems
P1. Consider the single-sender CDMA example in Figure 6.5. What would be the
sender’s output (for the 2 data bits shown) if the sender’s CDMA code were
(1, –1, 1, –1, 1, –1, 1, –1)?
P2. Consider sender 2 in Figure 6.6. What is the sender’s output to the channel
(before it is added to the signal from sender 1), Z2
i,m?
P3. Suppose that the receiver in Figure 6.6 wanted to receive the data being sent
by sender 2. Show (by calculation) that the receiver is indeed able to recover
sender 2’s data from the aggregate channel signal by using sender 2’s code.
P4. For the two-sender, two-receiver example, give an example of two CDMA
codes containing 1 and 1 values that do not allow the two receivers to
extract the original transmitted bits from the two CDMA senders.
P5. Suppose there are two ISPs providing WiFi access in a particular café, with
each ISP operating its own AP and having its own IP address block.
a. Further suppose that by accident, each ISP has configured its AP to oper-
ate over channel 11. Will the 802.11 protocol completely break down in
this situation? Discuss what happens when two stations, each associated
with a different ISP, attempt to transmit at the same time.
b. Now suppose that one AP operates over channel 1 and the other over
channel 11. How do your answers change?
P6. In step 4 of the CSMA/CA protocol, a station that successfully transmits a
frame begins the CSMA/CA protocol for a second frame at step 2, rather than
at step 1. What rationale might the designers of CSMA/CA have had in mind
by having such a station not transmit the second frame immediately (if the
channel is sensed idle)?
580
CHAPTER 6
•
WIRELESS AND MOBILE NETWORKS

---

## Page 69

P7. Suppose an 802.11b station is configured to always reserve the channel with the
RTS/CTS sequence. Suppose this station suddenly wants to transmit 1,000 bytes
of data, and all other stations are idle at this time. As a function of SIFS and
DIFS, and ignoring propagation delay and assuming no bit errors, calculate the
time required to transmit the frame and receive the acknowledgment.
P8. Consider the scenario shown in Figure 6.33, in which there are four wireless
nodes, A, B, C, and D. The radio coverage of the four nodes is shown via the
shaded ovals; all nodes share the same frequency. When A transmits, it can
only be heard/received by B; when B transmits, both A and C can
hear/receive from B; when C transmits, both B and D can hear/receive from
C; when D transmits, only C can hear/receive from D.
Suppose now that each node has an infinite supply of messages that it wants
to send to each of the other nodes. If a message’s destination is not an imme-
diate neighbor, then the message must be relayed. For example, if A wants to
send to D, a message from A must first be sent to B, which then sends the
message to C, which then sends the message to D. Time is slotted, with a
message transmission time taking exactly one time slot, e.g., as in slotted
Aloha. During a slot, a node can do one of the following: (i) send a message;
(ii) receive a message (if exactly one message is being sent to it), (iii) remain
silent. As always, if a node hears two or more simultaneous transmissions, a
collision occurs and none of the transmitted messages are received success-
fully. You can assume here that there are no bit-level errors, and thus if
exactly one message is sent, it will be received correctly by those within the
transmission radius of the sender.
a. Suppose now that an omniscient controller (i.e., a controller that knows
the state of every node in the network) can command each node to do
whatever it (the omniscient controller) wishes, i.e., to send a message, to
receive a message, or to remain silent. Given this omniscient controller,
what is the maximum rate at which a data message can be transferred
from C to A, given that there are no other messages between any other
source/destination pairs?
PROBLEMS
581
A
B
C
D
Figure 6.33  Scenario for problem P8

---

## Page 70

b. Suppose now that A sends messages to B, and D sends messages to C.
What is the combined maximum rate at which data messages can flow
from A to B and from D to C?
c. Suppose now that A sends messages to B, and C sends messages to D.
What is the combined maximum rate at which data messages can flow
from A to B and from C to D?
d. Suppose now that the wireless links are replaced by wired links. Repeat
questions (a) through (c) again in this wired scenario.
e. Now suppose we are again in the wireless scenario, and that for every data
message sent from source to destination, the destination will send an ACK
message back to the source (e.g., as in TCP). Also suppose that each ACK
message takes up one slot. Repeat questions (a) – (c) above for this scenario.
P9. Describe the format of the 802.15.1 Bluetooth frame. You will have to do
some reading outside of the text to find this information. Is there anything in
the frame format that inherently limits the number of active nodes in an
802.15.1 network to eight active nodes? Explain.
P10. Consider the following idealized LTE scenario. The downstream channel
(see Figure 6.20) is slotted in time, across F frequencies. There are four
nodes, A, B, C, and D, reachable from the base station at rates of 10 Mbps,
5 Mbps, 2.5 Mbps, and 1 Mbps, respectively, on the downstream channel.
These rates assume that the base station utilizes all time slots available on
all F frequencies to send to just one station. The base station has an infinite
amount of data to send to each of the nodes, and can send to any one of
these four nodes using any of the F frequencies during any time slot in the
downstream sub-frame.
a. What is the maximum rate at which the base station can send to the nodes,
assuming it can send to any node it chooses during each time slot? Is your
solution fair? Explain and define what you mean by “fair.”
b. If there is a fairness requirement that each node must receive an equal
amount of data during each one second interval, what is the average
transmission rate by the base station (to all nodes) during the downstream
sub-frame? Explain how you arrived at your answer.
c. Suppose that the fairness criterion is that any node can receive at most
twice as much data as any other node during the sub-frame. What is the
average transmission rate by the base station (to all nodes) during the sub-
frame? Explain how you arrived at your answer.
P11. In Section 6.5, one proposed solution that allowed mobile users to maintain
their IP addresses as they moved among foreign networks was to have a for-
eign network advertise a highly specific route to the mobile user and use the
existing routing infrastructure to propagate this information throughout the
582
CHAPTER 6
•
WIRELESS AND MOBILE NETWORKS

---

## Page 71

network. We identified scalability as one concern. Suppose that when a
mobile user moves from one network to another, the new foreign network
advertises a specific route to the mobile user, and the old foreign network
withdraws its route. Consider how routing information propagates in a
distance-vector algorithm (particularly for the case of interdomain routing
among networks that span the globe).
a. Will other routers be able to route datagrams immediately to the new for-
eign network as soon as the foreign network begins advertising its route?
b. Is it possible for different routers to believe that different foreign networks
contain the mobile user?
c. Discuss the timescale over which other routers in the network will eventu-
ally learn the path to the mobile users.
P12. Suppose the correspondent in Figure 6.22 were mobile. Sketch the additional
network-layer infrastructure that would be needed to route the datagram from
the original mobile user to the (now mobile) correspondent. Show the struc-
ture of the datagram(s) between the original mobile user and the (now
mobile) correspondent, as in Figure 6.23.
P13. In mobile IP, what effect will mobility have on end-to-end delays of data-
grams between the source and destination?
P14. Consider the chaining example discussed at the end of Section 6.7.2. Suppose
a mobile user visits foreign networks A, B, and C, and that a correspondent
begins a connection to the mobile user when it is resident in foreign network A.
List the sequence of messages between foreign agents, and between foreign
agents and the home agent as the mobile user moves from network A to net-
work B to network C. Next, suppose chaining is not performed, and the cor-
respondent (as well as the home agent) must be explicitly notified of the
changes in the mobile user’s care-of address. List the sequence of messages
that would need to be exchanged in this second scenario.
P15. Consider two mobile nodes in a foreign network having a foreign agent. Is it
possible for the two mobile nodes to use the same care-of address in mobile
IP? Explain your answer.
P16. In our discussion of how the VLR updated the HLR with information about
the mobile’s current location, what are the advantages and disadvantages of
providing the MSRN as opposed to the address of the VLR to the HLR?
Wireshark Lab
At the companion Web site for this textbook, http://www.awl.com/kurose-ross,
you’ll find a Wireshark lab for this chapter that captures and studies the 802.11
frames exchanged between a wireless laptop and an access point.
WIRESHARK LAB
583

---

## Page 72

Please describe a few of the most exciting projects you have worked on during your
career. What were the biggest challenges?
In the mid-90s at USC and ISI, I had the great fortune to work with the likes of Steve
Deering, Mark Handley, and Van Jacobson on the design of multicast routing protocols (in
particular, PIM). I tried to carry many of the architectural design lessons from multicast into
the design of ecological monitoring arrays, where for the first time I really began to take
applications and multidisciplinary research seriously. That interest in jointly innovating in
the social and technological space is what interests me so much about my latest area of
research, mobile health. The challenges in these projects were as diverse as the problem
domains, but what they all had in common was the need to keep our eyes open to whether
we had the problem definition right as we iterated between design and deployment, proto-
type and pilot. None of them were problems that could be solved analytically, with simula-
tion or even in constructed laboratory experiments. They all challenged our ability to retain
584
Deborah Estrin
Deborah Estrin is Professor of Computer Science at UCLA, the
Jon Postel Chair in Computer Networks, Director of the Center for
Embedded Networked Sensing (CENS), and co-founder of the non-
profit openmhealth.org. She received her Ph.D. (1985) in Computer
Science from M.I.T., and her B.S. (1980) from UC Berkeley. Estrin’s
early research focused on the design of network protocols, including
multicast and inter-domain routing. In 2002 Estrin founded the
NSF-funded Science and Technology Center, CENS (http://cens
.ucla.edu), to develop and explore environmental monitoring technologies and applications.
Currently Estrin and collaborators are developing participatory sensing systems, leveraging
the programmability, proximity, and pervasiveness of mobile phones; the primary deployment
contexts are mobile health (http://openmhealth.org), community data gathering, and STEM
education (http://mobilizingcs.org). Professor Estrin is an elected member of the American
Academy of Arts and Sciences (2007) and the National Academy of Engineering (2009).
She is a fellow of the IEEE, ACM, and AAAS. She was selected as the first ACM-W Athena
Lecturer (2006), awarded the Anita Borg Institute’s Women of Vision Award for Innovation
(2007), inducted into the WITI hall of fame (2008) and awarded Doctor Honoris Causa from
EPFL (2008) and Uppsala University (2011).
AN INTERVIEW WITH...

---

## Page 73

clean architectures in the presence of messy problems and contexts, and they all called for
extensive collaboration.
What changes and innovations do you see happening in wireless networks and
mobility in the future?
I have never put much faith into predicting the future, but I would say we might see the end
of feature phones (i.e., those that are not programmable and are used only for voice and text
messaging) as smart phones become more and more powerful and the primary point of
Internet access for many. I also think that we will see the continued proliferation of embed-
ded SIMs by which all sorts of devices have the ability to communicate via the cellular net-
work at low data rates.
Where do you see the future of networking and the Internet?
The efforts in named data and software-defined networking will emerge to create a more
manageable, evolvable, and richer infrastructure and more generally represent moving the
role of architecture higher up in the stack. In the beginnings of the Internet, architecture was
layer 4 and below, with applications being more siloed/monolithic, sitting on top. Now data
and analytics dominate transport.
What people inspired you professionally?
There are three people who come to mind. First, Dave Clark, the secret sauce and unsung
hero of the Internet community. I was lucky to be around in the early days to see him act as
the “organizing principle” of the IAB and Internet governance; the priest of rough consen-
sus and running code. Second, Scott Shenker, for his intellectual brilliance, integrity, and
persistence. I strive for, but rarely attain, his clarity in defining problems and solutions. He
is always the first person I email for advice on matters large and small. Third, my sister
Judy Estrin, who had the creativity and courage to spend her career bringing ideas and con-
cepts to market. Without the Judys of the world the Internet technologies would never have
transformed our lives.
What are your recommendations for students who want careers in computer science
and networking?
First, build a strong foundation in your academic work, balanced with any and every real-
world work experience you can get. As you look for a working environment, seek opportu-
nities in problem areas you really care about and with smart teams that you can learn from.
585

---

## Page 74

This page intentionally left blank
