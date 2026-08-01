# material-1

---

## Page 1

138
THE PHYSICAL LAYER
CHAP. 2
To see why this works, just imagine that two stations, A and C, both transmit a
1 bit at the same time that B transmits a 0 bit, as is the case in the third example.
The receiver sees the sum, S = A + B + C, and computes
S C = (A + B + C) C = A C + B C + C C = 0 + 0 + 1 = 1
The first two terms vanish because all pairs of chip sequences have been carefully
chosen to be orthogonal, as shown in Eq. (2-5). Now it should be clear why this
property must be imposed on the chip sequences.
To make the decoding process more concrete, we show six examples in
Fig. 2-28(d). Suppose that the receiver is interested in extracting the bit sent by
station C from each of the six signals S 1 through S 6. It calculates the bit by sum-
ming the pairwise products of the received S and the C vector of Fig. 2-28(a) and
then taking 1/8 of the result (since m = 8 here). The examples include cases
where C is silent, sends a 1 bit, and sends a 0 bit, individually and in combination
with other transmissions. As shown, the correct bit is decoded each time. It is
just like speaking French.
In principle, given enough computing capacity, the receiver can listen to all
the senders at once by running the decoding algorithm for each of them in paral-
lel. In real life, suffice it to say that this is easier said than done, and it is useful to
know which senders might be transmitting.
In the ideal, noiseless CDMA system we have studied here, the number of sta-
tions that send concurrently can be made arbitrarily large by using longer chip se-
quences. For 2n stations, Walsh codes can provide 2n orthogonal chip sequences
of length 2n. However, one significant limitation is that we have assumed that all
the chips are synchronized in time at the receiver. This synchronization is not
even approximately true in some applications, such as cellular networks (in which
CDMA has been widely deployed starting in the 1990s). It leads to different de-
signs. We will return to this topic later in the chapter and describe how asynchro-
nous CDMA differs from synchronous CDMA.
As well as cellular networks, CDMA is used by satellites and cable networks.
We have glossed over many complicating factors in this brief introduction. En-
gineers who want to gain a deep understanding of CDMA should read Viterbi
(1995) and Lee and Miller (1998). These references require quite a bit of back-
ground in communication engineering, however.
2.6 THE PUBLIC SWITCHED TELEPHONE NETWORK
When two computers owned by the same company or organization and locat-
ed close to each other need to communicate, it is often easiest just to run a cable
between them. LANs work this way. However, when the distances are large or
there are many computers or the cables have to pass through a public road or other
public right of way, the costs of running private cables are usually prohibitive.

---

## Page 2

SEC. 2.6
THE PUBLIC SWITCHED TELEPHONE NETWORK
139
Furthermore, in just about every country in the world, stringing private transmis-
sion lines across (or underneath) public property is also illegal. Consequently, the
network designers must rely on the existing telecommunication facilities.
These facilities, especially the PSTN (Public Switched Telephone Net-
work), were usually designed many years ago, with a completely different goal in
mind: transmitting the human voice in a more-or-less recognizable form. Their
suitability for use in computer-computer communication is often marginal at best.
To see the size of the problem, consider that a cheap commodity cable running be-
tween two computers can transfer data at 1 Gbps or more. In contrast, typical
ADSL, the blazingly fast alternative to a telephone modem, runs at around 1
Mbps. The difference between the two is the difference between cruising in an
airplane and taking a leisurely stroll.
Nonetheless, the telephone system is tightly intertwined with (wide area)
computer networks, so it is worth devoting some time to study it in detail. The
limiting factor for networking purposes turns out to be the ‘‘last mile’’ over which
customers connect, not the trunks and switches inside the telephone network.
This situation is changing with the gradual rollout of fiber and digital technology
at the edge of the network, but it will take time and money. During the long wait,
computer systems designers used to working with systems that give at least three
orders of magnitude better performance have devoted much time and effort to fig-
ure out how to use the telephone network efficiently.
In the following sections we will describe the telephone system and show how
it works. For additional information about the innards of the telephone system see
Bellamy (2000).
2.6.1 Structure of the Telephone System
Soon after Alexander Graham Bell patented the telephone in 1876 (just a few
hours ahead of his rival, Elisha Gray), there was an enormous demand for his new
invention. The initial market was for the sale of telephones, which came in pairs.
It was up to the customer to string a single wire between them. If a telephone
owner wanted to talk to n other telephone owners, separate wires had to be strung
to all n houses. Within a year, the cities were covered with wires passing over
houses and trees in a wild jumble. It became immediately obvious that the model
of connecting every telephone to every other telephone, as shown in Fig. 2-29(a),
was not going to work.
To his credit, Bell saw this problem early on and formed the Bell Telephone
Company, which opened its first switching office (in New Haven, Connecticut) in
1878. The company ran a wire to each customer’s house or office. To make a
call, the customer would crank the phone to make a ringing sound in the telephone
company office to attract the attention of an operator, who would then manually
connect the caller to the callee by using a short jumper cable to connect the caller
to the callee. The model of a single switching office is illustrated in Fig. 2-29(b).

---

## Page 3

140
THE PHYSICAL LAYER
CHAP. 2
(a)
(b)
(c)
Figure 2-29. (a) Fully interconnected network. (b) Centralized switch.
(c) Two-level hierarchy.
Pretty soon, Bell System switching offices were springing up everywhere and
people wanted to make long-distance calls between cities, so the Bell System
began to connect the switching offices. The original problem soon returned: to
connect every switching office to every other switching office by means of a wire
between them quickly became unmanageable, so second-level switching offices
were invented. After a while, multiple second-level offices were needed, as illus-
trated in Fig. 2-29(c). Eventually, the hierarchy grew to five levels.
By 1890, the three major parts of the telephone system were in place: the
switching offices, the wires between the customers and the switching offices (by
now balanced, insulated, twisted pairs instead of open wires with an earth return),
and the long-distance connections between the switching offices. For a short
technical history of the telephone system, see Hawley (1991).
While there have been improvements in all three areas since then, the basic
Bell System model has remained essentially intact for over 100 years. The fol-
lowing description is highly simplified but gives the essential flavor nevertheless.
Each telephone has two copper wires coming out of it that go directly to the tele-
phone company’s nearest end office (also called a local central office). The dis-
tance is typically 1 to 10 km, being shorter in cities than in rural areas. In the
United States alone there are about 22,000 end offices. The two-wire connections
between each subscriber’s telephone and the end office are known in the trade as
the local loop. If the world’s local loops were stretched out end to end, they
would extend to the moon and back 1000 times.
At one time, 80% of AT&T’s capital value was the copper in the local loops.
AT&T was then, in effect, the world’s largest copper mine. Fortunately, this fact
was not well known in the investment community. Had it been known, some cor-
porate raider might have bought AT&T, ended all telephone service in the United
States, ripped out all the wire, and sold it to a copper refiner for a quick payback.

---

## Page 4

SEC. 2.6
THE PUBLIC SWITCHED TELEPHONE NETWORK
141
If a subscriber attached to a given end office calls another subscriber attached
to the same end office, the switching mechanism within the office sets up a direct
electrical connection between the two local loops. This connection remains intact
for the duration of the call.
If the called telephone is attached to another end office, a different procedure
has to be used. Each end office has a number of outgoing lines to one or more
nearby switching centers, called toll offices (or, if they are within the same local
area, tandem offices). These lines are called toll connecting trunks. The num-
ber of different kinds of switching centers and their topology varies from country
to country depending on the country’s telephone density.
If both the caller’s and callee’s end offices happen to have a toll connecting
trunk to the same toll office (a likely occurrence if they are relatively close by),
the connection may be established within the toll office. A telephone network
consisting only of telephones (the small dots), end offices (the large dots), and toll
offices (the squares) is shown in Fig. 2-29(c).
If the caller and callee do not have a toll office in common, a path will have to
be established between two toll offices. The toll offices communicate with each
other via high-bandwidth intertoll trunks (also called interoffice trunks). Prior
to the 1984 breakup of AT&T, the U.S. telephone system used hierarchical rout-
ing to find a path, going to higher levels of the hierarchy until there was a switch-
ing office in common. This was then replaced with more flexible, nonhierarchical
routing. Figure 2-30 shows how a long-distance connection might be routed.
Telephone
End
office
Toll
office
Intermediate
switching
office(s)
Telephone
End
office
Toll
office
Local
loop
Toll
connecting
trunk
Very high
bandwidth
intertoll
trunks
Toll
connecting
trunk
Local
loop
Figure 2-30. A typical circuit route for a long-distance call.
A variety of transmission media are used for telecommunication.
Unlike
modern office buildings, where the wiring is commonly Category 5, local loops to
homes mostly consist of Category 3 twisted pairs, with fiber just starting to
appear. Between switching offices, coaxial cables, microwaves, and especially
fiber optics are widely used.
In the past, transmission throughout the telephone system was analog, with
the actual voice signal being transmitted as an electrical voltage from source to
destination. With the advent of fiber optics, digital electronics, and computers, all
the trunks and switches are now digital, leaving the local loop as the last piece of

---

## Page 5

142
THE PHYSICAL LAYER
CHAP. 2
analog technology in the system. Digital transmission is preferred because it is
not necessary to accurately reproduce an analog waveform after it has passed
through many amplifiers on a long call. Being able to correctly distinguish a 0
from a 1 is enough. This property makes digital transmission more reliable than
analog. It is also cheaper and easier to maintain.
In summary, the telephone system consists of three major components:

1. Local loops (analog twisted pairs going to houses and businesses).
2. Trunks (digital fiber optic links connecting the switching offices).
3. Switching offices (where calls are moved from one trunk to another).
After a short digression on the politics of telephones, we will come back to each
of these three components in some detail. The local loops provide everyone ac-
cess to the whole system, so they are critical. Unfortunately, they are also the
weakest link in the system. For the long-haul trunks, the main issue is how to col-
lect multiple calls together and send them out over the same fiber. This calls for
multiplexing, and we apply FDM and TDM to do it. Finally, there are two funda-
mentally different ways of doing switching; we will look at both.
2.6.2 The Politics of Telephones
For decades prior to 1984, the Bell System provided both local and long-dis-
tance service throughout most of the United States. In the 1970s, the U.S. Federal
Government came to believe that this was an illegal monopoly and sued to break
it up. The government won, and on January 1, 1984, AT&T was broken up into
AT&T Long Lines, 23 BOCs (Bell Operating Companies), and a few other
pieces. The 23 BOCs were grouped into seven regional BOCs (RBOCs) to make
them economically viable. The entire nature of telecommunication in the United
States was changed overnight by court order (not by an act of Congress).
The exact specifications of the divestiture were described in the so-called
MFJ (Modified Final Judgment), an oxymoron if ever there was one—if the
judgment could be modified, it clearly was not final. This event led to increased
competition, better service, and lower long-distance rates for consumers and busi-
nesses. However, prices for local service rose as the cross subsidies from long-
distance calling were eliminated and local service had to become self supporting.
Many other countries have now introduced competition along similar lines.
Of direct relevance to our studies is that the new competitive framework
caused a key technical feature to be added to the architecture of the telephone net-
work. To make it clear who could do what, the United States was divided up into
164 LATAs (Local Access and Transport Areas). Very roughly, a LATA is
about as big as the area covered by one area code. Within each LATA, there was
one LEC (Local Exchange Carrier) with a monopoly on traditional telephone

---

## Page 6

SEC. 2.6
THE PUBLIC SWITCHED TELEPHONE NETWORK
143
service within its area. The most important LECs were the BOCs, although some
LATAs contained one or more of the 1500 independent telephone companies op-
erating as LECs.
The new feature was that all inter-LATA traffic was handled by a different
kind of company, an IXC (IntereXchange Carrier). Originally, AT&T Long
Lines was the only serious IXC, but now there are well-established competitors
such as Verizon and Sprint in the IXC business. One of the concerns at the
breakup was to ensure that all the IXCs would be treated equally in terms of line
quality, tariffs, and the number of digits their customers would have to dial to use
them. The way this is handled is illustrated in Fig. 2-31. Here we see three ex-
ample LATAs, each with several end offices. LATAs 2 and 3 also have a small
hierarchy with tandem offices (intra-LATA toll offices).
1
2
To local loops
IXC #1’s
toll office
IXC #2’s
toll office
IXC POP
Tandem
office
End
office
LATA 3
LATA 2
LATA 1
1
2
1
2
1
2
Figure 2-31. The relationship of LATAs, LECs, and IXCs. All the circles are
LEC switching offices. Each hexagon belongs to the IXC whose number is in it.
Any IXC that wishes to handle calls originating in a LATA can build a
switching office called a POP (Point of Presence) there. The LEC is required to
connect each IXC to every end office, either directly, as in LATAs 1 and 3, or
indirectly, as in LATA 2. Furthermore, the terms of the connection, both techni-
cal and financial, must be identical for all IXCs. This requirement enables, a sub-
scriber in, say, LATA 1, to choose which IXC to use for calling subscribers in
LATA 3.
As part of the MFJ, the IXCs were forbidden to offer local telephone service
and the LECs were forbidden to offer inter-LATA telephone service, although

---

## Page 7

144
THE PHYSICAL LAYER
CHAP. 2
both were free to enter any other business, such as operating fried chicken restau-
rants. In 1984, that was a fairly unambiguous statement. Unfortunately, technolo-
gy has a funny way of making the law obsolete. Neither cable television nor mo-
bile phones were covered by the agreement. As cable television went from one
way to two way and mobile phones exploded in popularity, both LECs and IXCs
began buying up or merging with cable and mobile operators.
By 1995, Congress saw that trying to maintain a distinction between the vari-
ous kinds of companies was no longer tenable and drafted a bill to preserve ac-
cessibility for competition but allow cable TV companies, local telephone com-
panies, long-distance carriers, and mobile operators to enter one another’s busi-
nesses. The idea was that any company could then offer its customers a single
integrated package containing cable TV, telephone, and information services and
that different companies would compete on service and price. The bill was en-
acted into law in February 1996 as a major overhaul of telecommunications regu-
lation. As a result, some BOCs became IXCs and some other companies, such as
cable television operators, began offering local telephone service in competition
with the LECs.
One interesting property of the 1996 law is the requirement that LECs imple-
ment local number portability. This means that a customer can change local
telephone companies without having to get a new telephone number. Portability
for mobile phone numbers (and between fixed and mobile lines) followed suit in
2003. These provisions removed a huge hurdle for many people, making them
much more inclined to switch LECs. As a result, the U.S. telecommunications
landscape became much more competitive, and other countries have followed
suit. Often other countries wait to see how this kind of experiment works out in
the U.S. If it works well, they do the same thing; if it works badly, they try some-
thing else.
2.6.3 The Local Loop: Modems, ADSL, and Fiber
It is now time to start our detailed study of how the telephone system works.
Let us begin with the part that most people are familiar with: the two-wire local
loop coming from a telephone company end office into houses. The local loop is
also frequently referred to as the ‘‘last mile,’’ although the length can be up to
several miles. It has carried analog information for over 100 years and is likely to
continue doing so for some years to come, due to the high cost of converting to
digital.
Much effort has been devoted to squeezing data networking out of the copper
local loops that are already deployed. Telephone modems send digital data be-
tween computers over the narrow channel the telephone network provides for a
voice call. They were once widely used, but have been largely displaced by
broadband technologies such as ADSL that. reuse the local loop to send digital
data from a customer to the end office, where they are siphoned off to the Internet.

---

## Page 8

SEC. 2.6
THE PUBLIC SWITCHED TELEPHONE NETWORK
145
Both modems and ADSL must deal with the limitations of old local loops: rel-
atively narrow bandwidth, attenuation and distortion of signals, and susceptibility
to electrical noise such as crosstalk.
In some places, the local loop has been modernized by installing optical fiber
to (or very close to) the home. Fiber is the way of the future. These installations
support computer networks from the ground up, with the local loop having ample
bandwidth for data services. The limiting factor is what people will pay, not the
physics of the local loop.
In this section we will study the local loop, both old and new. We will cover
telephone modems, ADSL, and fiber to the home.
Telephone Modems
To send bits over the local loop, or any other physical channel for that matter,
they must be converted to analog signals that can be transmitted over the channel.
This conversion is accomplished using the methods for digital modulation that we
studied in the previous section. At the other end of the channel, the analog signal
is converted back to bits.
A device that converts between a stream of digital bits and an analog signal
that represents the bits is called a modem, which is short for ‘‘modulator demodu-
lator.’’ Modems come in many varieties: telephone modems, DSL modems, cable
modems, wireless modems, etc. The modem may be built into the computer
(which is now common for telephone modems) or be a separate box (which is
common for DSL and cable modems). Logically, the modem is inserted between
the (digital) computer and the (analog) telephone system, as seen in Fig. 2-32.
End
office
Codec
Modem
Computer
Local loop
(analog)
Trunk (digital, fiber)
Digital line
Analog line
Codec
Modem
ISP 1
ISP 2
Figure 2-32. The use of both analog and digital transmission for a computer-
to-computer call. Conversion is done by the modems and codecs.
Telephone modems are used to send bits between two computers over a
voice-grade telephone line, in place of the conversation that usually fills the line.
The main difficulty in doing so is that a voice-grade telephone line is limited to
3100 Hz, about what is sufficient to carry a conversation. This bandwidth is more
than four orders of magnitude less than the bandwidth that is used for Ethernet or

---

## Page 9

146
THE PHYSICAL LAYER
CHAP. 2
802.11 (WiFi). Unsurprisingly, the data rates of telephone modems are also four
orders of magnitude less than that of Ethernet and 802.11.
Let us run the numbers to see why this is the case. The Nyquist theorem tells
us that even with a perfect 3000-Hz line (which a telephone line is decidedly not),
there is no point in sending symbols at a rate faster than 6000 baud. In practice,
most modems send at a rate of 2400 symbols/sec, or 2400 baud, and focus on get-
ting multiple bits per symbol while allowing traffic in both directions at the same
time (by using different frequencies for different directions).
The humble 2400-bps modem uses 0 volts for a logical 0 and 1 volt for a logi-
cal 1, with 1 bit per symbol. One step up, it can use four different symbols, as in
the four phases of QPSK, so with 2 bits/symbol it can get a data rate of 4800 bps.
A long progression of higher rates has been achieved as technology has im-
proved. Higher rates require a larger set of symbols or constellation. With many
symbols, even a small amount of noise in the detected amplitude or phase can re-
sult in an error. To reduce the chance of errors, standards for the higher-speed
modems use some of the symbols for error correction. The schemes are known as
TCM (Trellis Coded Modulation) (Ungerboeck, 1987).
The V.32 modem standard uses 32 constellation points to transmit 4 data bits
and 1 check bit per symbol at 2400 baud to achieve 9600 bps with error cor-
rection. The next step above 9600 bps is 14,400 bps. It is called V.32 bis and
transmits 6 data bits and 1 check bit per symbol at 2400 baud. Then comes V.34,
which achieves 28,800 bps by transmitting 12 data bits/symbol at 2400 baud. The
constellation now has thousands of points. The final modem in this series is V.34
bis which uses 14 data bits/symbol at 2400 baud to achieve 33,600 bps.
Why stop here? The reason that standard modems stop at 33,600 is that the
Shannon limit for the telephone system is about 35 kbps based on the average
length of local loops and the quality of these lines. Going faster than this would
violate the laws of physics (department of thermodynamics).
However, there is one way we can change the situation. At the telephone
company end office, the data are converted to digital form for transmission within
the telephone network (the core of the telephone network converted from analog
to digital long ago). The 35-kbps limit is for the situation in which there are two
local loops, one at each end. Each of these adds noise to the signal. If we could
get rid of one of these local loops, we would increase the SNR and the maximum
rate would be doubled.
This approach is how 56-kbps modems are made to work. One end, typically
an ISP, gets a high-quality digital feed from the nearest end office. Thus, when
one end of the connection is a high-quality signal, as it is with most ISPs now, the
maximum data rate can be as high as 70 kbps. Between two home users with
modems and analog lines, the maximum is still 33.6 kbps.
The reason that 56-kbps modems (rather than 70-kbps modems) are in use has
to do with the Nyquist theorem. A telephone channel is carried inside the tele-
phone system as digital samples. Each telephone channel is 4000 Hz wide when

---

## Page 10

SEC. 2.6
THE PUBLIC SWITCHED TELEPHONE NETWORK
147
the guard bands are included. The number of samples per second needed to
reconstruct it is thus 8000. The number of bits per sample in the U.S. is 8, one of
which may be used for control purposes, allowing 56,000 bits/sec of user data. In
Europe, all 8 bits are available to users, so 64,000-bit/sec modems could have
been used, but to get international agreement on a standard, 56,000 was chosen.
The end result is the V.90 and V.92 modem standards. They provide for a
56-kbps downstream channel (ISP to user) and a 33.6-kbps and 48-kbps upstream
channel (user to ISP), respectively. The asymmetry is because there is usually
more data transported from the ISP to the user than the other way. It also means
that more of the limited bandwidth can be allocated to the downstream channel to
increase the chances of it actually working at 56 kbps.
Digital Subscriber Lines
When the telephone industry finally got to 56 kbps, it patted itself on the back
for a job well done. Meanwhile, the cable TV industry was offering speeds up to
10 Mbps on shared cables. As Internet access became an increasingly important
part of their business, the telephone companies (LECs) began to realize they need-
ed a more competitive product. Their answer was to offer new digital services
over the local loop.
Initially, there were many overlapping high-speed offerings, all under the gen-
eral name of xDSL (Digital Subscriber Line), for various x. Services with more
bandwidth than standard telephone service are sometimes called broadband, al-
though the term really is more of a marketing concept than a specific technical
concept. Later, we will discuss what has become the most popular of these ser-
vices, ADSL (Asymmetric DSL). We will also use the term DSL or xDSL as
shorthand for all flavors.
The reason that modems are so slow is that telephones were invented for car-
rying the human voice and the entire system has been carefully optimized for this
purpose. Data have always been stepchildren. At the point where each local loop
terminates in the end office, the wire runs through a filter that attenuates all fre-
quencies below 300 Hz and above 3400 Hz. The cutoff is not sharp—300 Hz and
3400 Hz are the 3-dB points—so the bandwidth is usually quoted as 4000 Hz even
though the distance between the 3 dB points is 3100 Hz. Data on the wire are thus
also restricted to this narrow band.
The trick that makes xDSL work is that when a customer subscribes to it, the
incoming line is connected to a different kind of switch, one that does not have
this filter, thus making the entire capacity of the local loop available. The limiting
factor then becomes the physics of the local loop, which supports roughly 1 MHz,
not the artificial 3100 Hz bandwidth created by the filter.
Unfortunately, the capacity of the local loop falls rather quickly with distance
from the end office as the signal is increasingly degraded along the wire. It also
depends on the thickness and general quality of the twisted pair. A plot of the

---

## Page 11

148
THE PHYSICAL LAYER
CHAP. 2
potential bandwidth as a function of distance is given in Fig. 2-33. This figure as-
sumes that all the other factors are optimal (new wires, modest bundles, etc.).
50
40
20
30
10
00
1000
2000
3000
4000
Meters
5000
6000
Mbps
Figure 2-33. Bandwidth versus distance over Category 3 UTP for DSL.
The implication of this figure creates a problem for the telephone company.
When it picks a speed to offer, it is simultaneously picking a radius from its end
offices beyond which the service cannot be offered. This means that when distant
customers try to sign up for the service, they may be told ‘‘Thanks a lot for your
interest, but you live 100 meters too far from the nearest end office to get this ser-
vice. Could you please move?’’ The lower the chosen speed is, the larger the
radius and the more customers are covered. But the lower the speed, the less
attractive the service is and the fewer the people who will be willing to pay for it.
This is where business meets technology.
The xDSL services have all been designed with certain goals in mind. First,
the services must work over the existing Category 3 twisted pair local loops. Sec-
ond, they must not affect customers’ existing telephones and fax machines. Third,
they must be much faster than 56 kbps. Fourth, they should be always on, with
just a monthly charge and no per-minute charge.
To meet the technical goals, the available 1.1 MHz spectrum on the local loop
is divided into 256 independent channels of 4312.5 Hz each. This arrangement is
shown in Fig. 2-34. The OFDM scheme, which we saw in the previous section, is
used to send data over these channels, though it is often called DMT (Discrete
MultiTone) in the context of ADSL. Channel 0 is used for POTS (Plain Old
Telephone Service). Channels 1–5 are not used, to keep the voice and data sig-
nals from interfering with each other. Of the remaining 250 channels, one is used
for upstream control and one is used for downstream control. The rest are avail-
able for user data.
In principle, each of the remaining channels can be used for a full-duplex data
stream, but harmonics, crosstalk, and other effects keep practical systems well

---

## Page 12

SEC. 2.6
THE PUBLIC SWITCHED TELEPHONE NETWORK
149
Power
Voice
Upstream
Downstream
256 4-kHz Channels
0
25
1100 kHz
Figure 2-34. Operation of ADSL using discrete multitone modulation.
below the theoretical limit. It is up to the provider to determine how many chan-
nels are used for upstream and how many for downstream. A 50/50 mix of
upstream and downstream is technically possible, but most providers allocate
something like 80–90% of the bandwidth to the downstream channel since most
users download more data than they upload. This choice gives rise to the ‘‘A’’ in
ADSL. A common split is 32 channels for upstream and the rest downstream. It
is also possible to have a few of the highest upstream channels be bidirectional for
increased bandwidth, although making this optimization requires adding a special
circuit to cancel echoes.
The international ADSL standard, known as G.dmt, was approved in 1999. It
allows speeds of as much as 8 Mbps downstream and 1 Mbps upstream. It was
superseded by a second generation in 2002, called ADSL2, with various im-
provements to allow speeds of as much as 12 Mbps downstream and 1 Mbps up-
stream. Now we have ADSL2+, which doubles the downstream speed to 24
Mbps by doubling the bandwidth to use 2.2 MHz over the twisted pair.
However, the numbers quoted here are best-case speeds for good lines close
(within 1 to 2 km) to the exchange. Few lines support these rates, and few pro-
viders offer these speeds.
Typically, providers offer something like 1 Mbps
downstream and 256 kbps upstream (standard service), 4 Mbps downstream and 1
Mbps upstream (improved service), and 8 Mbps downstream and 2 Mbps
upstream (premium service).
Within each channel, QAM modulation is used at a rate of roughly 4000
symbols/sec. The line quality in each channel is constantly monitored and the
data rate is adjusted by using a larger or smaller constellation, like those in
Fig. 2-23. Different channels may have different data rates, with up to 15 bits per
symbol sent on a channel with a high SNR, and down to 2, 1, or no bits per sym-
bol sent on a channel with a low SNR depending on the standard.
A typical ADSL arrangement is shown in Fig. 2-35. In this scheme, a tele-
phone company technician must install a NID (Network Interface Device) on the
customer’s premises. This small plastic box marks the end of the telephone com-
pany’s property and the start of the customer’s property. Close to the NID (or
sometimes combined with it) is a splitter, an analog filter that separates the

---

## Page 13

150
THE PHYSICAL LAYER
CHAP. 2
0–4000-Hz band used by POTS from the data. The POTS signal is routed to the
existing telephone or fax machine. The data signal is routed to an ADSL modem,
which uses digital signal processing to implement OFDM. Since most ADSL
modems are external, the computer must be connected to them at high speed.
Usually, this is done using Ethernet, a USB cable, or 802.11.
DSLAM
Splitter
Codec
Splitter
Telephone
To ISP
ADSL
modem
Ethernet
Computer
Telephone
line
Telephone company end office
Customer premises
Voice
switch
NID
Figure 2-35. A typical ADSL equipment configuration.
At the other end of the wire, on the end office side, a corresponding splitter is
installed. Here, the voice portion of the signal is filtered out and sent to the nor-
mal voice switch. The signal above 26 kHz is routed to a new kind of device call-
ed a DSLAM (Digital Subscriber Line Access Multiplexer), which contains the
same kind of digital signal processor as the ADSL modem. Once the bits have
been recovered from the signal, packets are formed and sent off to the ISP.
This complete separation between the voice system and ADSL makes it rel-
atively easy for a telephone company to deploy ADSL. All that is needed is buy-
ing a DSLAM and splitter and attaching the ADSL subscribers to the splitter.
Other high-bandwidth services (e.g., ISDN) require much greater changes to the
existing switching equipment.
One disadvantage of the design of Fig. 2-35 is the need for a NID and splitter
on the customer’s premises. Installing these can only be done by a telephone
company technician, necessitating an expensive ‘‘truck roll’’ (i.e., sending a tech-
nician to the customer’s premises). Therefore, an alternative, splitterless design,
informally called G.lite, has also been standardized. It is the same as Fig. 2-35
but without the customer’s splitter. The existing telephone line is used as is. The
only difference is that a microfilter has to be inserted into each telephone jack

---

## Page 14

SEC. 2.6
THE PUBLIC SWITCHED TELEPHONE NETWORK
151
between the telephone or ADSL modem and the wire. The microfilter for the
telephone is a low-pass filter eliminating frequencies above 3400 Hz; the microfil-
ter for the ADSL modem is a high-pass filter eliminating frequencies below 26
kHz. However, this system is not as reliable as having a splitter, so G.lite can be
used only up to 1.5 Mbps (versus 8 Mbps for ADSL with a splitter). For more
information about ADSL, see Starr (2003).
Fiber To The Home
Deployed copper local loops limit the performance of ADSL and telephone
modems. To let them provide faster and better network services, telephone com-
panies are upgrading local loops at every opportunity by installing optical fiber all
the way to houses and offices. The result is called FttH (Fiber To The Home).
While FttH technology has been available for some time, deployments only began
to take off in 2005 with growth in the demand for high-speed Internet from cus-
tomers used to DSL and cable who wanted to download movies. Around 4% of
U.S. houses are now connected to FttH with Internet access speeds of up to 100
Mbps.
Several variations of the form ‘‘FttX’’ (where X stands for the basement, curb,
or neighborhood) exist. They are used to note that the fiber deployment may
reach close to the house. In this case, copper (twisted pair or coaxial cable) pro-
vides fast enough speeds over the last short distance. The choice of how far to lay
the fiber is an economic one, balancing cost with expected revenue. In any case,
the point is that optical fiber has crossed the traditional barrier of the ‘‘last mile.’’
We will focus on FttH in our discussion.
Like the copper wires before it, the fiber local loop is passive. This means no
powered equipment is required to amplify or otherwise process signals. The fiber
simply carries signals between the home and the end office. This in turn reduces
cost and improves reliability.
Usually, the fibers from the houses are joined together so that only a single
fiber reaches the end office per group of up to 100 houses. In the downstream di-
rection, optical splitters divide the signal from the end office so that it reaches all
the houses. Encryption is needed for security if only one house should be able to
decode the signal. In the upstream direction, optical combiners merge the signals
from the houses into a single signal that is received at the end office.
This architecture is called a PON (Passive Optical Network), and it is shown
in Fig. 2-36. It is common to use one wavelength shared between all the houses
for downstream transmission, and another wavelength for upstream transmission.
Even with the splitting, the tremendous bandwidth and low attenuation of
fiber mean that PONs can provide high rates to users over distances of up to 20
km. The actual data rates and other details depend on the type of PON. Two kinds
are common. GPONs (Gigabit-capable PONs) come from the world of telecom-
munications, so they are defined by an ITU standard. EPONs (Ethernet PONs)

---

## Page 15

152
THE PHYSICAL LAYER
CHAP. 2
Fiber
Optical
splitter/combiner
End office
Rest of
network
Figure 2-36. Passive optical network for Fiber To The Home.
are more in tune with the world of networking, so they are defined by an IEEE
standard. Both run at around a gigabit and can carry traffic for different services,
including Internet, video, and voice. For example, GPONs provide 2.4 Gbps
downstream and 1.2 or 2.4 Gbps upstream.
Some protocol is needed to share the capacity of the single fiber at the end
office between the different houses. The downstream direction is easy. The end
office can send messages to each different house in whatever order it likes. In the
upstream direction, however, messages from different houses cannot be sent at the
same time, or different signals would collide. The houses also cannot hear each
other’s transmissions so they cannot listen before transmitting. The solution is
that equipment at the houses requests and is granted time slots to use by equip-
ment in the end office. For this to work, there is a ranging process to adjust the
transmission times from the houses so that all the signals received at the end
office are synchronized. The design is similar to cable modems, which we cover
later in this chapter. For more information on the future of PONs, see Grobe and
Elbers (2008).
2.6.4 Trunks and Multiplexing
Trunks in the telephone network are not only much faster than the local loops,
they are different in two other respects. The core of the telephone network carries
digital information, not analog information; that is, bits not voice. This necessi-
tates a conversion at the end office to digital form for transmission over the long-
haul trunks. The trunks carry thousands, even millions, of calls simultaneously.
This sharing is important for achieving economies of scale, since it costs essen-
tially the same amount of money to install and maintain a high-bandwidth trunk as
a low-bandwidth trunk between two switching offices. It is accomplished with
versions of TDM and FDM multiplexing.
Below we will briefly examine how voice signals are digitized so that they
can be transported by the telephone network. After that, we will see how TDM is
used to carry bits on trunks, including the TDM system used for fiber optics

---

## Page 16

SEC. 2.6
THE PUBLIC SWITCHED TELEPHONE NETWORK
153
(SONET). Then we will turn to FDM as it is applied to fiber optics, which is call-
ed wavelength division multiplexing.
Digitizing Voice Signals
Early in the development of the telephone network, the core handled voice
calls as analog information. FDM techniques were used for many years to multi-
plex 4000-Hz voice channels (comprised of 3100 Hz plus guard bands) into larger
and larger units. For example, 12 calls in the 60 kHz–to–108 kHz band is known
as a group and five groups (a total of 60 calls) are known as a supergroup, and
so on. These FDM methods are still used over some copper wires and microwave
channels. However, FDM requires analog circuitry and is not amenable to being
done by a computer. In contrast, TDM can be handled entirely by digital elec-
tronics, so it has become far more widespread in recent years. Since TDM can
only be used for digital data and the local loops produce analog signals, a conver-
sion is needed from analog to digital in the end office, where all the individual
local loops come together to be combined onto outgoing trunks.
The analog signals are digitized in the end office by a device called a codec
(short for ‘‘coder-decoder’’). The codec makes 8000 samples per second (125
μsec/sample) because the Nyquist theorem says that this is sufficient to capture all
the information from the 4-kHz telephone channel bandwidth. At a lower sam-
pling rate, information would be lost; at a higher one, no extra information would
be gained. Each sample of the amplitude of the signal is quantized to an 8-bit
number.
This technique is called PCM (Pulse Code Modulation). It forms the heart
of the modern telephone system. As a consequence, virtually all time intervals
within
the
telephone
system
are
multiples
of
125
μsec.
The
standard
uncompressed data rate for a voice-grade telephone call is thus 8 bits every 125
μsec, or 64 kbps.
At the other end of the call, an analog signal is recreated from the quantized
samples by playing them out (and smoothing them) over time. It will not be ex-
actly the same as the original analog signal, even though we sampled at the
Nyquist rate, because the samples were quantized. To reduce the error due to
quantization, the quantization levels are unevenly spaced. A logarithmic scale is
used that gives relatively more bits to smaller signal amplitudes and relatively
fewer bits to large signal amplitudes. In this way the error is proportional to the
signal amplitude.
Two versions of quantization are widely used: μ-law, used in North America
and Japan, and A-law, used in Europe and the rest of the world. Both versions are
specified in standard ITU G.711. An equivalent way to think about this process is
to imagine that the dynamic range of the signal (or the ratio between the largest
and smallest possible values) is compressed before it is (evenly) quantized, and
then expanded when the analog signal is recreated. For this reason it is called

---

## Page 17

154
THE PHYSICAL LAYER
CHAP. 2
companding. It is also possible to compress the samples after they are digitized
so that they require much less than 64 kbps. However, we will leave this topic for
when we explore audio applications such as voice over IP.
Time Division Multiplexing
TDM based on PCM is used to carry multiple voice calls over trunks by send-
ing a sample from each call every 125 μsec. When digital transmission began
emerging as a feasible technology, ITU (then called CCITT) was unable to reach
agreement on an international standard for PCM. Consequently, a variety of
incompatible schemes are now in use in different countries around the world.
The method used in North America and Japan is the T1 carrier, depicted in
Fig. 2-37. (Technically speaking, the format is called DS1 and the carrier is call-
ed T1, but following widespread industry tradition, we will not make that subtle
distinction here.) The T1 carrier consists of 24 voice channels multiplexed toget-
her. Each of the 24 channels, in turn, gets to insert 8 bits into the output stream.
Channel
1
Channel
2
Channel
3
Channel
4
Channel
24
193-bit frame (125 μsec)
7 Data
bits per
channel
per sample
Bit 1 is
a framing
code
Bit 8 is for
signaling
0
1
Figure 2-37. The T1 carrier (1.544 Mbps).
A frame consists of 24 × 8 = 192 bits plus one extra bit for control purposes,
yielding 193 bits every 125 μsec. This gives a gross data rate of 1.544 Mbps, of
which 8 kbps is for signaling. The 193rd bit is used for frame synchronization and
signaling. In one variation, the 193rd bit is used across a group of 24 frames call-
ed an extended superframe. Six of the bits, in the 4th, 8th, 12th, 16th, 20th, and
24th positions, take on the alternating pattern 001011 . . . . Normally, the receiver
keeps checking for this pattern to make sure that it has not lost synchronization.
Six more bits are used to send an error check code to help the receiver confirm
that it is synchronized. If it does get out of sync, the receiver can scan for the pat-
tern and validate the error check code to get resynchronized. The remaining 12

---

## Page 18

SEC. 2.6
THE PUBLIC SWITCHED TELEPHONE NETWORK
155
bits are used for control information for operating and maintaining the network,
such as performance reporting from the remote end.
The T1 format has several variations. The earlier versions sent signaling
information in-band, meaning in the same channel as the data, by using some of
the data bits. This design is one form of channel-associated signaling, because
each channel has its own private signaling subchannel. In one arrangement, the
least significant bit out of an 8-bit sample on each channel is used in every sixth
frame. It has the colorful name of robbed-bit signaling. The idea is that a few
stolen bits will not matter for voice calls. No one will hear the difference.
For data, however, it is another story. Delivering the wrong bits is unhelpful,
to say the least. If older versions of T1 are used to carry data, only 7 of 8 bits, or
56 kbps can be used in each of the 24 channels. Instead, newer versions of T1
provide clear channels in which all of the bits may be used to send data. Clear
channels are what businesses who lease a T1 line want when they send data across
the telephone network in place of voice samples. Signaling for any voice calls is
then handled out-of-band, meaning in a separate channel from the data. Often,
the signaling is done with common-channel signaling in which there is a shared
signaling channel. One of the 24 channels may be used for this purpose.
Outside North America and Japan, the 2.048-Mbps E1 carrier is used instead
of T1. This carrier has 32 8-bit data samples packed into the basic 125-μsec
frame. Thirty of the channels are used for information and up to two are used for
signaling. Each group of four frames provides 64 signaling bits, half of which are
used for signaling (whether channel-associated or common-channel) and half of
which are used for frame synchronization or are reserved for each country to use
as it wishes.
Time division multiplexing allows multiple T1 carriers to be multiplexed into
higher-order carriers. Figure 2-38 shows how this can be done. At the left we see
four T1 channels being multiplexed into one T2 channel. The multiplexing at T2
and above is done bit for bit, rather than byte for byte with the 24 voice channels
that make up a T1 frame. Four T1 streams at 1.544 Mbps should generate 6.176
Mbps, but T2 is actually 6.312 Mbps. The extra bits are used for framing and re-
covery in case the carrier slips. T1 and T3 are widely used by customers, whereas
T2 and T4 are only used within the telephone system itself, so they are not well
known.
At the next level, seven T2 streams are combined bitwise to form a T3 stream.
Then six T3 streams are joined to form a T4 stream. At each step a small amount
of overhead is added for framing and recovery in case the synchronization be-
tween sender and receiver is lost.
Just as there is little agreement on the basic carrier between the United States
and the rest of the world, there is equally little agreement on how it is to be multi-
plexed into higher-bandwidth carriers. The U.S. scheme of stepping up by 4, 7,
and 6 did not strike everyone else as the way to go, so the ITU standard calls for
multiplexing four streams into one stream at each level. Also, the framing and

---

## Page 19

156
THE PHYSICAL LAYER
CHAP. 2
6 5 4 3 2 1 0
5 1
4 0
6 2
7 3
6:1
7:1
4:1
4 T1 streams in
1 T2 stream out
6.312 Mbps
T2
1.544 Mbps
T1
44.736 Mbps
T3
274.176 Mbps
T4
7 T2 streams in
6 T3 streams in
Figure 2-38. Multiplexing T1 streams into higher carriers.
recovery data are different in the U.S. and ITU standards. The ITU hierarchy for
32, 128, 512, 2048, and 8192 channels runs at speeds of 2.048, 8.848, 34.304,
139.264, and 565.148 Mbps.
SONET/SDH
In the early days of fiber optics, every telephone company had its own
proprietary optical TDM system. After AT&T was broken up in 1984, local tele-
phone companies had to connect to multiple long-distance carriers, all with dif-
ferent optical TDM systems, so the need for standardization became obvious. In
1985, Bellcore, the RBOC’s research arm, began working on a standard, called
SONET (Synchronous Optical NETwork).
Later, ITU joined the effort, which resulted in a SONET standard and a set of
parallel ITU recommendations (G.707, G.708, and G.709) in 1989. The ITU
recommendations are called SDH (Synchronous Digital Hierarchy) but differ
from SONET only in minor ways. Virtually all the long-distance telephone traffic
in the United States, and much of it elsewhere, now uses trunks running SONET
in the physical layer. For additional information about SONET, see Bellamy
(2000), Goralski (2002), and Shepard (2001).
The SONET design had four major goals. First and foremost, SONET had to
make it possible for different carriers to interwork. Achieving this goal required
defining a common signaling standard with respect to wavelength, timing, fram-
ing structure, and other issues.
Second, some means was needed to unify the U.S., European, and Japanese
digital systems, all of which were based on 64-kbps PCM channels but combined
them in different (and incompatible) ways.
Third, SONET had to provide a way to multiplex multiple digital channels.
At the time SONET was devised, the highest-speed digital carrier actually used
widely in the United States was T3, at 44.736 Mbps. T4 was defined, but not used

---

## Page 20

SEC. 2.6
THE PUBLIC SWITCHED TELEPHONE NETWORK
157
much, and nothing was even defined above T4 speed. Part of SONET’s mission
was to continue the hierarchy to gigabits/sec and beyond. A standard way to mul-
tiplex slower channels into one SONET channel was also needed.
Fourth, SONET had to provide support for operations, administration, and
maintenance (OAM), which are needed to manage the network. Previous systems
did not do this very well.
An early decision was to make SONET a traditional TDM system, with the
entire bandwidth of the fiber devoted to one channel containing time slots for the
various subchannels. As such, SONET is a synchronous system. Each sender and
receiver is tied to a common clock. The master clock that controls the system has
an accuracy of about 1 part in 109. Bits on a SONET line are sent out at extreme-
ly precise intervals, controlled by the master clock.
The basic SONET frame is a block of 810 bytes put out every 125 μsec.
Since SONET is synchronous, frames are emitted whether or not there are any
useful data to send. Having 8000 frames/sec exactly matches the sampling rate of
the PCM channels used in all digital telephony systems.
The 810-byte SONET frames are best described as a rectangle of bytes, 90
columns wide by 9 rows high. Thus, 8 × 810 = 6480 bits are transmitted 8000
times per second, for a gross data rate of 51.84 Mbps. This layout is the basic
SONET channel, called STS-1 (Synchronous Transport Signal-1). All SONET
trunks are multiples of STS-1.
The first three columns of each frame are reserved for system management
information, as illustrated in Fig. 2-39. In this block, the first three rows contain
the section overhead; the next six contain the line overhead. The section overhead
is generated and checked at the start and end of each section, whereas the line
overhead is generated and checked at the start and end of each line.
A SONET transmitter sends back-to-back 810-byte frames, without gaps be-
tween them, even when there are no data (in which case it sends dummy data).
From the receiver’s point of view, all it sees is a continuous bit stream, so how
does it know where each frame begins? The answer is that the first 2 bytes of
each frame contain a fixed pattern that the receiver searches for. If it finds this
pattern in the same place in a large number of consecutive frames, it assumes that
it is in sync with the sender. In theory, a user could insert this pattern into the
payload in a regular way, but in practice it cannot be done due to the multiplexing
of multiple users into the same frame and other reasons.
The remaining 87 columns of each frame hold 87 × 9 × 8 × 8000 = 50.112
Mbps of user data. This user data could be voice samples, T1 and other carriers
swallowed whole, or packets. SONET is simply a convenient container for tran-
sporting bits. The SPE (Synchronous Payload Envelope), which carries the user
data does not always begin in row 1, column 4. The SPE can begin anywhere
within the frame. A pointer to the first byte is contained in the first row of the line
overhead. The first column of the SPE is the path overhead (i.e., the header for
the end-to-end path sublayer protocol).

---

## Page 21

158
THE PHYSICAL LAYER
CHAP. 2
Sonet
frame
(125 μsec)
Sonet
frame
(125 μsec)
9
Rows
. . .
. . .
87 Columns
3 Columns
for overhead
SPE
Section
overhead
Line
overhead
Path
overhead
Figure 2-39. Two back-to-back SONET frames.
The ability to allow the SPE to begin anywhere within the SONET frame and
even to span two frames, as shown in Fig. 2-39, gives added flexibility to the sys-
tem. For example, if a payload arrives at the source while a dummy SONET
frame is being constructed, it can be inserted into the current frame instead of
being held until the start of the next one.
The SONET/SDH multiplexing hierarchy is shown in Fig. 2-40. Rates from
STS-1 to STS-768 have been defined, ranging from roughly a T3 line to 40 Gbps.
Even higher rates will surely be defined over time, with OC-3072 at 160 Gbps
being the next in line if and when it becomes technologically feasible. The opti-
cal carrier corresponding to STS-n is called OC-n but is bit for bit the same except
for a certain bit reordering needed for synchronization. The SDH names are dif-
ferent, and they start at OC-3 because ITU-based systems do not have a rate near
51.84 Mbps. We have shown the common rates, which proceed from OC-3 in
multiples of four. The gross data rate includes all the overhead. The SPE data
rate excludes the line and section overhead. The user data rate excludes all over-
head and counts only the 87 payload columns.
As an aside, when a carrier, such as OC-3, is not multiplexed, but carries the
data from only a single source, the letter c (for concatenated) is appended to the
designation, so OC-3 indicates a 155.52-Mbps carrier consisting of three separate
OC-1 carriers, but OC-3c indicates a data stream from a single source at 155.52
Mbps.
The three OC-1 streams within an OC-3c stream are interleaved by
column—first column 1 from stream 1, then column 1 from stream 2, then column
1 from stream 3, followed by column 2 from stream 1, and so on—leading to a
frame 270 columns wide and 9 rows deep.

---

## Page 22

SEC. 2.6
THE PUBLIC SWITCHED TELEPHONE NETWORK
159
SONET
SDH
Data rate (Mbps)
Electrical
Optical
Optical
Gross
SPE
User
STS-1
OC-1
51.84
50.112
49.536
STS-3
OC-3
STM-1
155.52
150.336
148.608
STS-12
OC-12
STM-4
622.08
601.344
594.432
STS-48
OC-48
STM-16
2488.32
2405.376
2377.728
STS-192
OC-192
STM-64
9953.28
9621.504
9510.912
STS-768
OC-768
STM-256
39813.12
38486.016
38043.648
Figure 2-40. SONET and SDH multiplex rates.
Wavelength Division Multiplexing
A form of frequency division multiplexing is used as well as TDM to harness
the tremendous bandwidth of fiber optic channels. It is called WDM (Wave-
length Division Multiplexing). The basic principle of WDM on fibers is dep-
icted in Fig. 2-41. Here four fibers come together at an optical combiner, each
with its energy present at a different wavelength. The four beams are combined
onto a single shared fiber for transmission to a distant destination. At the far end,
the beam is split up over as many fibers as there were on the input side. Each out-
put fiber contains a short, specially constructed core that filters out all but one
wavelength. The resulting signals can be routed to their destination or recombin-
ed in different ways for additional multiplexed transport.
There is really nothing new here. This way of operating is just frequency di-
vision multiplexing at very high frequencies, with the term WDM owing to the
description of fiber optic channels by their wavelength or ‘‘color’’ rather than fre-
quency. As long as each channel has its own frequency (i.e., wavelength) range
and all the ranges are disjoint, they can be multiplexed together on the long-haul
fiber. The only difference with electrical FDM is that an optical system using a
diffraction grating is completely passive and thus highly reliable.
The reason WDM is popular is that the energy on a single channel is typically
only a few gigahertz wide because that is the current limit of how fast we can con-
vert between electrical and optical signals. By running many channels in parallel
on different wavelengths, the aggregate bandwidth is increased linearly with the
number of channels. Since the bandwidth of a single fiber band is about 25,000
GHz (see Fig. 2-7), there is theoretically room for 2500 10-Gbps channels even at
1 bit/Hz (and higher rates are also possible).
WDM technology has been progressing at a rate that puts computer technolo-
gy to shame. WDM was invented around 1990. The first commercial systems
had eight channels of 2.5 Gbps per channel. By 1998, systems with 40 channels

---

## Page 23

160
THE PHYSICAL LAYER
CHAP. 2
Spectrum
on the
shared fiber
Power
λ
Fiber 4
spectrum
Power
λ
Fiber 3
spectrum
Power
λ
Fiber 2
spectrum
Power
λ
λ1
λ1+λ2+λ3+λ4
Fiber 1
spectrum
Power
λ
Fiber 1
λ2
Fiber 2
λ3
Fiber 3
Combiner
Splitter
Long-haul shared fiber
λ4
λ2
λ4
λ1
λ3
Fiber 4
Filter
Figure 2-41. Wavelength division multiplexing.
of 2.5 Gbps were on the market. By 2006, there were products with 192 channels
of 10 Gbps and 64 channels of 40 Gbps, capable of moving up to 2.56 Tbps. This
bandwidth is enough to transmit 80 full-length DVD movies per second. The
channels are also packed tightly on the fiber, with 200, 100, or as little as 50 GHz
of separation. Technology demonstrations by companies after bragging rights
have shown 10 times this capacity in the lab, but going from the lab to the field
usually takes at least a few years. When the number of channels is very large and
the wavelengths are spaced close together, the system is referred to as DWDM
(Dense WDM).
One of the drivers of WDM technology is the development of all-optical com-
ponents. Previously, every 100 km it was necessary to split up all the channels
and convert each one to an electrical signal for amplification separately before
reconverting them to optical signals and combining them. Nowadays, all-optical
amplifiers can regenerate the entire signal once every 1000 km without the need
for multiple opto-electrical conversions.
In the example of Fig. 2-41, we have a fixed-wavelength system. Bits from
input fiber 1 go to output fiber 3, bits from input fiber 2 go to output fiber 1, etc.
However, it is also possible to build WDM systems that are switched in the opti-
cal domain. In such a device, the output filters are tunable using Fabry-Perot or
Mach-Zehnder interferometers. These devices allow the selected frequencies to
be changed dynamically by a control computer. This ability provides a large
amount of flexibility to provision many different wavelength paths through the
telephone network from a fixed set of fibers. For more information about optical
networks and WDM, see Ramaswami et al. (2009).

---

## Page 24

SEC. 2.6
THE PUBLIC SWITCHED TELEPHONE NETWORK
161
2.6.5 Switching
From the point of view of the average telephone engineer, the phone system is
divided into two principal parts: outside plant (the local loops and trunks, since
they are physically outside the switching offices) and inside plant (the switches,
which are inside the switching offices). We have just looked at the outside plant.
Now it is time to examine the inside plant.
Two different switching techniques are used by the network nowadays: circuit
switching and packet switching. The traditional telephone system is based on cir-
cuit switching, but packet switching is beginning to make inroads with the rise of
voice over IP technology. We will go into circuit switching in some detail and
contrast it with packet switching. Both kinds of switching are important enough
that we will come back to them when we get to the network layer.
Circuit Switching
Conceptually, when you or your computer places a telephone call, the switch-
ing equipment within the telephone system seeks out a physical path all the way
from your telephone to the receiver’s telephone. This technique is called circuit
switching. It is shown schematically in Fig. 2-42(a). Each of the six rectangles
represents a carrier switching office (end office, toll office, etc.). In this example,
each office has three incoming lines and three outgoing lines. When a call passes
through a switching office, a physical connection is (conceptually) established be-
tween the line on which the call came in and one of the output lines, as shown by
the dotted lines.
In the early days of the telephone, the connection was made by the operator
plugging a jumper cable into the input and output sockets. In fact, a surprising lit-
tle story is associated with the invention of automatic circuit switching equipment.
It was invented by a 19th-century Missouri undertaker named Almon B. Strowger.
Shortly after the telephone was invented, when someone died, one of the survivors
would call the town operator and say ‘‘Please connect me to an undertaker.’’ Un-
fortunately for Mr. Strowger, there were two undertakers in his town, and the
other one’s wife was the town telephone operator. He quickly saw that either he
was going to have to invent automatic telephone switching equipment or he was
going to go out of business. He chose the first option. For nearly 100 years, the
circuit-switching equipment used worldwide was known as Strowger gear. (His-
tory does not record whether the now-unemployed switchboard operator got a job
as an information operator, answering questions such as ‘‘What is the phone num-
ber of an undertaker?’’)
The model shown in Fig. 2-42(a) is highly simplified, of course, because parts
of the physical path between the two telephones may, in fact, be microwave or
fiber links onto which thousands of calls are multiplexed. Nevertheless, the basic
idea is valid: once a call has been set up, a dedicated path between both ends
exists and will continue to exist until the call is finished.

---

## Page 25

162
THE PHYSICAL LAYER
CHAP. 2
(a)
(b)
Switching office
Physical (copper)
connection set up
when call is made
Packets queued
for subsequent
transmission
Computer
Computer
Figure 2-42. (a) Circuit switching. (b) Packet switching.
An important property of circuit switching is the need to set up an end-to-end
path before any data can be sent. The elapsed time between the end of dialing and
the start of ringing can easily be 10 sec, more on long-distance or international
calls. During this time interval, the telephone system is hunting for a path, as
shown in Fig. 2-43(a). Note that before data transmission can even begin, the call
request signal must propagate all the way to the destination and be acknowledged.
For many computer applications (e.g., point-of-sale credit verification), long setup
times are undesirable.
As a consequence of the reserved path between the calling parties, once the
setup has been completed, the only delay for data is the propagation time for the
electromagnetic signal, about 5 msec per 1000 km. Also as a consequence of the
established path, there is no danger of congestion—that is, once the call has been
put through, you never get busy signals. Of course, you might get one before the
connection has been established due to lack of switching or trunk capacity.
Packet Switching
The alternative to circuit switching is packet switching, shown in Fig. 2-
42(b) and described in Chap. 1. With this technology, packets are sent as soon as
they are available. There is no need to set up a dedicated path in advance, unlike

---

## Page 26

SEC. 2.6
THE PUBLIC SWITCHED TELEPHONE NETWORK
163
Call request signal
Data
AB
trunk
A
B
C
(a)
D
A
B
C
(b)
D
BC
trunk
CD
trunk
Call
accept
signal
Propagation
delay
Queuing
delay
Pkt 1
Pkt 2
Pkt 3
Pkt 1
Pkt 2
Pkt 3
Pkt 1
Pkt 2
Pkt 3
Time
spent
hunting
for an
outgoing
trunk
Time
Figure 2-43. Timing of events in (a) circuit switching, (b) packet switching.
with circuit switching. It is up to routers to use store-and-forward transmission to
send each packet on its way to the destination on its own. This procedure is
unlike circuit switching, in which the result of the connection setup is the reserva-
tion of bandwidth all the way from the sender to the receiver. All data on the cir-
cuit follows this path. Among other properties, having all the data follow the
same path means that it cannot arrive out of order. With packet switching there is
no fixed path, so different packets can follow different paths, depending on net-
work conditions at the time they are sent, and they may arrive out of order.
Packet-switching networks place a tight upper limit on the size of packets.
This ensures that no user can monopolize any transmission line for very long (e.g.,
many milliseconds), so that packet-switched networks can handle interactive traf-
fic. It also reduces delay since the first packet of a long message can be for-
warded before the second one has fully arrived. However, the store-and-forward
delay of accumulating a packet in the router’s memory before it is sent on to the

---

## Page 27

164
THE PHYSICAL LAYER
CHAP. 2
next router exceeds that of circuit switching. With circuit switching, the bits just
flow through the wire continuously.
Packet and circuit switching also differ in other ways. Because no bandwidth
is reserved with packet switching, packets may have to wait to be forwarded.
This introduces queuing delay and congestion if many packets are sent at the
same time. On the other hand, there is no danger of getting a busy signal and
being unable to use the network. Thus, congestion occurs at different times with
circuit switching (at setup time) and packet switching (when packets are sent).
If a circuit has been reserved for a particular user and there is no traffic, its
bandwidth is wasted. It cannot be used for other traffic. Packet switching does
not waste bandwidth and thus is more efficient from a system perspective. Under-
standing this trade-off is crucial for comprehending the difference between circuit
switching and packet switching. The trade-off is between guaranteed service and
wasting resources versus not guaranteeing service and not wasting resources.
Packet switching is more fault tolerant than circuit switching. In fact, that is
why it was invented. If a switch goes down, all of the circuits using it are termi-
nated and no more traffic can be sent on any of them. With packet switching,
packets can be routed around dead switches.
A final difference between circuit and packet switching is the charging algo-
rithm. With circuit switching, charging has historically been based on distance
and time. For mobile phones, distance usually does not play a role, except for in-
ternational calls, and time plays only a coarse role (e.g., a calling plan with 2000
free minutes costs more than one with 1000 free minutes and sometimes nights or
weekends are cheap). With packet switching, connect time is not an issue, but the
volume of traffic is. For home users, ISPs usually charge a flat monthly rate be-
cause it is less work for them and their customers can understand this model, but
backbone carriers charge regional networks based on the volume of their traffic.
The differences are summarized in Fig. 2-44. Traditionally, telephone net-
works have used circuit switching to provide high-quality telephone calls, and
computer networks have used packet switching for simplicity and efficiency.
However, there are notable exceptions. Some older computer networks have been
circuit switched under the covers (e.g., X.25) and some newer telephone networks
use packet switching with voice over IP technology. This looks just like a stan-
dard telephone call on the outside to users, but inside the network packets of voice
data are switched. This approach has let upstarts market cheap international calls
via calling cards, though perhaps with lower call quality than the incumbents.
2.7 THE MOBILE TELEPHONE SYSTEM
The traditional telephone system, even if it someday gets multigigabit end-to-
end fiber, will still not be able to satisfy a growing group of users: people on the
go. People now expect to make phone calls and to use their phones to check

---

## Page 28

SEC. 2.7
THE MOBILE TELEPHONE SYSTEM
165
Item
Circuit switched
Packet switched
Call setup
Required
Not needed
Dedicated physical path
Yes
No
Each packet follows the same route
Yes
No
Packets arrive in order
Yes
No
Is a switch crash fatal
Yes
No
Bandwidth available
Fixed
Dynamic
Time of possible congestion
At setup time
On every packet
Potentially wasted bandwidth
Yes
No
Store-and-forward transmission
No
Yes
Charging
Per minute
Per packet
Figure 2-44. A comparison of circuit-switched and packet-switched networks.
email and surf the Web from airplanes, cars, swimming pools, and while jogging
in the park. Consequently, there is a tremendous amount of interest in wireless
telephony. In the following sections we will study this topic in some detail.
The mobile phone system is used for wide area voice and data communica-
tion. Mobile phones (sometimes called cell phones) have gone through three
distinct generations, widely called 1G, 2G, and 3G. The generations are:

1. Analog voice.
2. Digital voice.
3. Digital voice and data (Internet, email, etc.).
(Mobile phones should not be confused with cordless phones that consist of a
base station and a handset sold as a set for use within the home. These are never
used for networking, so we will not examine them further.)
Although most of our discussion will be about the technology of these sys-
tems, it is interesting to note how political and tiny marketing decisions can have
a huge impact. The first mobile system was devised in the U.S. by AT&T and
mandated for the whole country by the FCC. As a result, the entire U.S. had a
single (analog) system and a mobile phone purchased in California also worked in
New York. In contrast, when mobile phones came to Europe, every country de-
vised its own system, which resulted in a fiasco.
Europe learned from its mistake and when digital came around, the govern-
ment-run PTTs got together and standardized on a single system (GSM), so any
European mobile phone will work anywhere in Europe. By then, the U.S. had de-
cided that government should not be in the standardization business, so it left digi-
tal to the marketplace. This decision resulted in different equipment manufact-
urers producing different kinds of mobile phones. As a consequence, in the U.S.

---

## Page 29

166
THE PHYSICAL LAYER
CHAP. 2
two major—and completely incompatible—digital mobile phone systems were
deployed, as well as other minor systems.
Despite an initial lead by the U.S., mobile phone ownership and usage in
Europe is now far greater than in the U.S. Having a single system that works any-
where in Europe and with any provider is part of the reason, but there is more. A
second area where the U.S. and Europe differed is in the humble matter of phone
numbers. In the U.S., mobile phones are mixed in with regular (fixed) telephones.
Thus, there is no way for a caller to see if, say, (212) 234-5678 is a fixed tele-
phone (cheap or free call) or a mobile phone (expensive call). To keep people
from getting nervous about placing calls, the telephone companies decided to
make the mobile phone owner pay for incoming calls. As a consequence, many
people hesitated buying a mobile phone for fear of running up a big bill by just re-
ceiving calls. In Europe, mobile phone numbers have a special area code (analo-
gous to 800 and 900 numbers) so they are instantly recognizable. Consequently,
the usual rule of ‘‘caller pays’’ also applies to mobile phones in Europe (except for
international calls, where costs are split).
A third issue that has had a large impact on adoption is the widespread use of
prepaid mobile phones in Europe (up to 75% in some areas). These can be pur-
chased in many stores with no more formality than buying a digital camera. You
pay and you go. They are preloaded with a balance of, for example, 20 or 50
euros and can be recharged (using a secret PIN code) when the balance drops to
zero. As a consequence, practically every teenager and many small children in
Europe have (usually prepaid) mobile phones so their parents can locate them,
without the danger of the child running up a huge bill. If the mobile phone is used
only occasionally, its use is essentially free since there is no monthly charge or
charge for incoming calls.
2.7.1 First-Generation (1G) Mobile Phones: Analog Voice
Enough about the politics and marketing aspects of mobile phones. Now let
us look at the technology, starting with the earliest system. Mobile radiotele-
phones were used sporadically for maritime and military communication during
the early decades of the 20th century. In 1946, the first system for car-based tele-
phones was set up in St. Louis. This system used a single large transmitter on top
of a tall building and had a single channel, used for both sending and receiving.
To talk, the user had to push a button that enabled the transmitter and disabled the
receiver. Such systems, known as push-to-talk systems, were installed in several
cities beginning in the late 1950s. CB radio, taxis, and police cars often use this
technology.
In the 1960s, IMTS (Improved Mobile Telephone System) was installed.
It, too, used a high-powered (200-watt) transmitter on top of a hill but it had two
frequencies, one for sending and one for receiving, so the push-to-talk button was

---

## Page 30

SEC. 2.7
THE MOBILE TELEPHONE SYSTEM
167
no longer needed. Since all communication from the mobile telephones went
inbound on a different channel than the outbound signals, the mobile users could
not hear each other (unlike the push-to-talk system used in taxis).
IMTS supported 23 channels spread out from 150 MHz to 450 MHz. Due to
the small number of channels, users often had to wait a long time before getting a
dial tone. Also, due to the large power of the hilltop transmitters, adjacent sys-
tems had to be several hundred kilometers apart to avoid interference. All in all,
the limited capacity made the system impractical.
Advanced Mobile Phone System
All that changed with AMPS (Advanced Mobile Phone System), invented
by Bell Labs and first installed in the United States in 1982. It was also used in
England, where it was called TACS, and in Japan, where it was called MCS-L1.
AMPS was formally retired in 2008, but we will look at it to understand the con-
text for the 2G and 3G systems that improved on it.
In all mobile phone systems, a geographic region is divided up into cells,
which is why the devices are sometimes called cell phones. In AMPS, the cells
are typically 10 to 20 km across; in digital systems, the cells are smaller. Each
cell uses some set of frequencies not used by any of its neighbors. The key idea
that gives cellular systems far more capacity than previous systems is the use of
relatively small cells and the reuse of transmission frequencies in nearby (but not
adjacent) cells. Whereas an IMTS system 100 km across can have only one call
on each frequency, an AMPS system might have 100 10-km cells in the same area
and be able to have 10 to 15 calls on each frequency, in widely separated cells.
Thus, the cellular design increases the system capacity by at least an order of
magnitude, more as the cells get smaller. Furthermore, smaller cells mean that
less power is needed, which leads to smaller and cheaper transmitters and
handsets.
The idea of frequency reuse is illustrated in Fig. 2-45(a). The cells are nor-
mally roughly circular, but they are easier to model as hexagons. In Fig. 2-45(a),
the cells are all the same size. They are grouped in units of seven cells. Each
letter indicates a group of frequencies. Notice that for each frequency set, there is
a buffer about two cells wide where that frequency is not reused, providing for
good separation and low interference.
Finding locations high in the air to place base station antennas is a major
issue. This problem has led some telecommunication carriers to forge alliances
with the Roman Catholic Church, since the latter owns a substantial number of
exalted potential antenna sites worldwide, all conveniently under a single man-
agement.
In an area where the number of users has grown to the point that the system is
overloaded, the power can be reduced and the overloaded cells split into smaller

---

## Page 31

168
THE PHYSICAL LAYER
CHAP. 2
G
F
A
B
C
D
E
G
F
A
B
C
D
E
G
F
A
B
C
D
E
(a)
(b)
Figure 2-45. (a) Frequencies are not reused in adjacent cells. (b) To add more
users, smaller cells can be used.
microcells to permit more frequency reuse, as shown in Fig. 2-45(b). Telephone
companies sometimes create temporary microcells, using portable towers with
satellite links at sporting events, rock concerts, and other places where large num-
bers of mobile users congregate for a few hours.
At the center of each cell is a base station to which all the telephones in the
cell transmit. The base station consists of a computer and transmitter/receiver
connected to an antenna. In a small system, all the base stations are connected to
a single device called an MSC (Mobile Switching Center) or MTSO (Mobile
Telephone Switching Office). In a larger one, several MSCs may be needed, all
of which are connected to a second-level MSC, and so on. The MSCs are essen-
tially end offices as in the telephone system, and are in fact connected to at least
one telephone system end office. The MSCs communicate with the base stations,
each other, and the PSTN using a packet-switching network.
At any instant, each mobile telephone is logically in one specific cell and un-
der the control of that cell’s base station. When a mobile telephone physically
leaves a cell, its base station notices the telephone’s signal fading away and asks
all the surrounding base stations how much power they are getting from it. When
the answers come back, the base station then transfers ownership to the cell get-
ting the strongest signal; under most conditions that is the cell where the tele-
phone is now located. The telephone is then informed of its new boss, and if a
call is in progress, it is asked to switch to a new channel (because the old one is
not reused in any of the adjacent cells). This process, called handoff, takes about
300 msec. Channel assignment is done by the MSC, the nerve center of the sys-
tem. The base stations are really just dumb radio relays.

---

## Page 32

SEC. 2.7
THE MOBILE TELEPHONE SYSTEM
169
Channels
AMPS uses FDM to separate the channels. The system uses 832 full-duplex
channels, each consisting of a pair of simplex channels. This arrangement is
known as FDD (Frequency Division Duplex). The 832 simplex channels from
824 to 849 MHz are used for mobile to base station transmission, and 832 simplex
channels from 869 to 894 MHz are used for base station to mobile transmission.
Each of these simplex channels is 30 kHz wide.
The 832 channels are divided into four categories. Control channels (base to
mobile) are used to manage the system. Paging channels (base to mobile) alert
mobile users to calls for them. Access channels (bidirectional) are used for call
setup and channel assignment. Finally, data channels (bidirectional) carry voice,
fax, or data. Since the same frequencies cannot be reused in nearby cells and 21
channels are reserved in each cell for control, the actual number of voice channels
available per cell is much smaller than 832, typically about 45.
Call Management
Each mobile telephone in AMPS has a 32-bit serial number and a 10-digit
telephone number in its programmable read-only memory. The telephone number
is represented as a 3-digit area code in 10 bits and a 7-digit subscriber number in
24 bits. When a phone is switched on, it scans a preprogrammed list of 21 control
channels to find the most powerful signal. The phone then broadcasts its 32-bit
serial number and 34-bit telephone number. Like all the control information in
AMPS, this packet is sent in digital form, multiple times, and with an error-cor-
recting code, even though the voice channels themselves are analog.
When the base station hears the announcement, it tells the MSC, which
records the existence of its new customer and also informs the customer’s home
MSC of his current location. During normal operation, the mobile telephone
reregisters about once every 15 minutes.
To make a call, a mobile user switches on the phone, enters the number to be
called on the keypad, and hits the SEND button. The phone then transmits the
number to be called and its own identity on the access channel. If a collision oc-
curs there, it tries again later. When the base station gets the request, it informs
the MSC. If the caller is a customer of the MSC’s company (or one of its
partners), the MSC looks for an idle channel for the call. If one is found, the
channel number is sent back on the control channel. The mobile phone then auto-
matically switches to the selected voice channel and waits until the called party
picks up the phone.
Incoming calls work differently. To start with, all idle phones continuously
listen to the paging channel to detect messages directed at them. When a call is
placed to a mobile phone (either from a fixed phone or another mobile phone), a
packet is sent to the callee’s home MSC to find out where it is. A packet is then

---

## Page 33

170
THE PHYSICAL LAYER
CHAP. 2
sent to the base station in its current cell, which sends a broadcast on the paging
channel of the form ‘‘Unit 14, are you there?’’ The called phone responds with a
‘‘Yes’’ on the access channel. The base then says something like: ‘‘Unit 14, call
for you on channel 3.’’ At this point, the called phone switches to channel 3 and
starts making ringing sounds (or playing some melody the owner was given as a
birthday present).
2.7.2 Second-Generation (2G) Mobile Phones: Digital Voice
The first generation of mobile phones was analog; the second generation is
digital. Switching to digital has several advantages. It provides capacity gains by
allowing voice signals to be digitized and compressed. It improves security by al-
lowing voice and control signals to be encrypted. This in turn deters fraud and
eavesdropping, whether from intentional scanning or echoes of other calls due to
RF propagation. Finally, it enables new services such as text messaging.
Just as there was no worldwide standardization during the first generation,
there was also no worldwide standardization during the second, either. Several
different systems were developed, and three have been widely deployed. D-
AMPS (Digital Advanced Mobile Phone System) is a digital version of AMPS
that coexists with AMPS and uses TDM to place multiple calls on the same fre-
quency channel. It is described in International Standard IS-54 and its successor
IS-136. GSM (Global System for Mobile communications) has emerged as the
dominant system, and while it was slow to catch on in the U.S. it is now used vir-
tually everywhere in the world. Like D-AMPS, GSM is based on a mix of FDM
and TDM. CDMA (Code Division Multiple Access), described in International
Standard IS-95, is a completely different kind of system and is based on neither
FDM mor TDM. While CDMA has not become the dominant 2G system, its
technology has become the basis for 3G systems.
Also, the name PCS (Personal Communications Services) is sometimes
used in the marketing literature to indicate a second-generation (i.e., digital) sys-
tem. Originally it meant a mobile phone using the 1900 MHz band, but that dis-
tinction is rarely made now.
We will now describe GSM, since it is the dominant 2G system. In the next
section we will have more to say about CDMA when we describe 3G systems.
GSM—The Global System for Mobile Communications
GSM started life in the 1980s as an effort to produce a single European 2G
standard. The task was assigned to a telecommunications group called (in French)
Groupe Speciale´ Mobile. The first GSM systems were deployed starting in 1991
and were a quick success. It soon became clear that GSM was going to be more
than a European success, with uptake stretching to countries as far away as Aus-
tralia, so GSM was renamed to have a more worldwide appeal.

---

## Page 34

SEC. 2.7
THE MOBILE TELEPHONE SYSTEM
171
GSM and the other mobile phone systems we will study retain from 1G sys-
tems a design based on cells, frequency reuse across cells, and mobility with
handoffs as subscribers move. It is the details that differ. Here, we will briefly
discuss some of the main properties of GSM. However, the printed GSM stan-
dard is over 5000 [sic] pages long. A large fraction of this material relates to en-
gineering aspects of the system, especially the design of receivers to handle mul-
tipath signal propagation, and synchronizing transmitters and receivers. None of
this will be even mentioned here.
Fig. 2-46 shows that the GSM architecture is similar to the AMPS architec-
ture, though the components have different names. The mobile itself is now di-
vided into the handset and a removable chip with subscriber and account infor-
mation called a SIM card, short for Subscriber Identity Module. It is the SIM
card that activates the handset and contains secrets that let the mobile and the net-
work identify each other and encrypt conversations. A SIM card can be removed
and plugged into a different handset to turn that handset into your mobile as far as
the network is concerned.
VLR
MSC
Air
interface
Cell tower and
base station
PSTN
SIM
card
Handset
HLR
BSC
BSC
Figure 2-46. GSM mobile network architecture.
The mobile talks to cell base stations over an air interface that we will de-
scribe in a moment. The cell base stations are each connected to a BSC (Base
Station Controller) that controls the radio resources of cells and handles handoff.
The BSC in turn is connected to an MSC (as in AMPS) that routes calls and con-
nects to the PSTN (Public Switched Telephone Network).
To be able to route calls, the MSC needs to know where mobiles can currently
be found. It maintains a database of nearby mobiles that are associated with the
cells it manages. This database is called the VLR (Visitor Location Register).
There is also a database in the mobile network that gives the last known location
of each mobile. It is called the HLR (Home Location Register). This database is
used to route incoming calls to the right locations. Both databases must be kept
up to date as mobiles move from cell to cell.
We will now describe the air interface in some detail. GSM runs on a range
of frequencies worldwide, including 900, 1800, and 1900 MHz. More spectrum is
allocated than for AMPS in order to support a much larger number of users. GSM

---

## Page 35

172
THE PHYSICAL LAYER
CHAP. 2
is a frequency division duplex cellular system, like AMPS. That is, each mobile
transmits on one frequency and receives on another, higher frequency (55 MHz
higher for GSM versus 80 MHz higher for AMPS). However, unlike with AMPS,
with GSM a single frequency pair is split by time-division multiplexing into time
slots. In this way it is shared by multiple mobiles.
To handle multiple mobiles, GSM channels are much wider than the AMPS
channels (200-kHz versus 30 kHz). One 200-kHz channel is shown in Fig. 2-47.
A GSM system operating in the 900-MHz region has 124 pairs of simplex chan-
nels. Each simplex channel is 200 kHz wide and supports eight separate con-
nections on it, using time division multiplexing. Each currently active station is
assigned one time slot on one channel pair. Theoretically, 992 channels can be
supported in each cell, but many of them are not available, to avoid frequency
conflicts with neighboring cells. In Fig. 2-47, the eight shaded time slots all be-
long to the same connection, four of them in each direction. Transmitting and re-
ceiving does not happen in the same time slot because the GSM radios cannot
transmit and receive at the same time and it takes time to switch from one to the
other. If the mobile device assigned to 890.4/935.4 MHz and time slot 2 wanted
to transmit to the base station, it would use the lower four shaded slots (and the
ones following them in time), putting some data in each slot until all the data had
been sent.
959.8 MHz
935.4 MHz
935.2 MHz
914.8 MHz
890.4 MHz
890.2 MHz
Frequency
Base
to mobile
Mobile
to base
124
2
1
124
2
1
Channel
TDM frame
Time
Figure 2-47. GSM uses 124 frequency channels, each of which uses an eight-
slot TDM system.
The TDM slots shown in Fig. 2-47 are part of a complex framing hierarchy.
Each TDM slot has a specific structure, and groups of TDM slots form mul-
tiframes, also with a specific structure. A simplified version of this hierarchy is
shown in Fig. 2-48. Here we can see that each TDM slot consists of a 148-bit
data frame that occupies the channel for 577 μsec (including a 30-μsec guard time

---

## Page 36

SEC. 2.7
THE MOBILE TELEPHONE SYSTEM
173
after each slot). Each data frame starts and ends with three 0 bits, for frame del-
ineation purposes. It also contains two 57-bit Information fields, each one having
a control bit that indicates whether the following Information field is for voice or
data. Between the Information fields is a 26-bit Sync (training) field that is used
by the receiver to synchronize to the sender’s frame boundaries.
C
T
L
0
1
2
3
4
5
6
7
8
9
10 11
13 14 15 16 17 18 19
20 21 22 23 24
32,500-Bit multiframe sent in 120 msec
0
1
2
3
4
5
6
7
1250-Bit TDM frame sent in 4.615 msec
8.25–bit
(30 μsec)
guard time
Reserved
for future
use
000
000
Information
Information
Sync
148-Bit data frame sent in 547 μsec
Bits
3
3
57
57
26
Voice/data bit
Figure 2-48. A portion of the GSM framing structure.
A data frame is transmitted in 547 μsec, but a transmitter is only allowed to
send one data frame every 4.615 msec, since it is sharing the channel with seven
other stations. The gross rate of each channel is 270,833 bps, divided among eight
users. However, as with AMPS, the overhead eats up a large fraction of the band-
width, ultimately leaving 24.7 kbps worth of payload per user before error cor-
rection. After error correction, 13 kbps is left for speech. While this is substan-
tially less than 64 kbps PCM for uncompressed voice signals in the fixed tele-
phone network, compression on the mobile device can reach these levels with lit-
tle loss of quality.
As can be seen from Fig. 2-48, eight data frames make up a TDM frame and
26 TDM frames make up a 120-msec multiframe. Of the 26 TDM frames in a
multiframe, slot 12 is used for control and slot 25 is reserved for future use, so
only 24 are available for user traffic.
However, in addition to the 26-slot multiframe shown in Fig. 2-48, a 51-slot
multiframe (not shown) is also used. Some of these slots are used to hold several
control channels used to manage the system. The broadcast control channel is a
continuous stream of output from the base station containing the base station’s
identity and the channel status. All mobile stations monitor their signal strength
to see when they have moved into a new cell.

---

## Page 37

174
THE PHYSICAL LAYER
CHAP. 2
The dedicated control channel is used for location updating, registration,
and call setup. In particular, each BSC maintains a database of mobile stations
currently under its jurisdiction, the VLR. Information needed to maintain the
VLR is sent on the dedicated control channel.
Finally, there is the common control channel, which is split up into three
logical subchannels. The first of these subchannels is the paging channel, which
the base station uses to announce incoming calls. Each mobile station monitors it
continuously to watch for calls it should answer. The second is the random ac-
cess channel, which allows users to request a slot on the dedicated control chan-
nel. If two requests collide, they are garbled and have to be retried later. Using
the dedicated control channel slot, the station can set up a call. The assigned slot
is announced on the third subchannel, the access grant channel.
Finally, GSM differs from AMPS in how handoff is handled. In AMPS, the
MSC manages it completely without help from the mobile devices. With time
slots in GSM, the mobile is neither sending nor receiving most of the time. The
idle slots are an opportunity for the mobile to measure signal quality to other
nearby base stations. It does so and sends this information to the BSC. The BSC
can use it to determine when a mobile is leaving one cell and entering another so
it can perform the handoff. This design is called MAHO (Mobile Assisted
HandOff).
2.7.3 Third-Generation (3G) Mobile Phones: Digital Voice and Data
The first generation of mobile phones was analog voice, and the second gen-
eration was digital voice. The third generation of mobile phones, or 3G as it is
called, is all about digital voice and data.
A number of factors are driving the industry. First, data traffic already
exceeds voice traffic on the fixed network and is growing exponentially, whereas
voice traffic is essentially flat. Many industry experts expect data traffic to dom-
inate voice on mobile devices as well soon. Second, the telephone, entertainment,
and computer industries have all gone digital and are rapidly converging. Many
people are drooling over lightweight, portable devices that act as a telephone, mu-
sic and video player, email terminal, Web interface, gaming machine, and more,
all with worldwide wireless connectivity to the Internet at high bandwidth.
Apple’s iPhone is a good example of this kind of 3G device. With it, people
get hooked on wireless data services, and AT&T wireless data volumes are rising
steeply with the popularity of iPhones. The trouble is, the iPhone uses a 2.5G net-
work (an enhanced 2G network, but not a true 3G network) and there is not
enough data capacity to keep users happy. 3G mobile telephony is all about pro-
viding enough wireless bandwidth to keep these future users happy.
ITU tried to get a bit more specific about this vision starting back around
1992. It issued a blueprint for getting there called IMT-2000, where IMT stood

---

## Page 38

SEC. 2.7
THE MOBILE TELEPHONE SYSTEM
175
for International Mobile Telecommunications.
The basic services that the
IMT-2000 network was supposed to provide to its users are:

1. High-quality voice transmission.
2. Messaging (replacing email, fax, SMS, chat, etc.).
3. Multimedia (playing music, viewing videos, films, television, etc.).
4. Internet access (Web surfing, including pages with audio and video).
Additional services might be video conferencing, telepresence, group game play-
ing, and m-commerce (waving your telephone at the cashier to pay in a store).
Furthermore, all these services are supposed to be available worldwide (with
automatic connection via a satellite when no terrestrial network can be located),
instantly (always on), and with quality of service guarantees.
ITU envisioned a single worldwide technology for IMT-2000, so manufact-
urers could build a single device that could be sold and used anywhere in the
world (like CD players and computers and unlike mobile phones and televisions).
Having a single technology would also make life much simpler for network opera-
tors and would encourage more people to use the services. Format wars, such as
the Betamax versus VHS battle with videorecorders, are not good for business.
As it turned out, this was a bit optimistic. The number 2000 stood for three
things: (1) the year it was supposed to go into service, (2) the frequency it was
supposed to operate at (in MHz), and (3) the bandwidth the service should have
(in kbps). It did not make it on any of the three counts. Nothing was imple-
mented by 2000. ITU recommended that all governments reserve spectrum at 2
GHz so devices could roam seamlessly from country to country. China reserved
the required bandwidth but nobody else did. Finally, it was recognized that 2
Mbps is not currently feasible for users who are too mobile (due to the difficulty
of performing handoffs quickly enough). More realistic is 2 Mbps for stationary
indoor users (which will compete head-on with ADSL), 384 kbps for people walk-
ing, and 144 kbps for connections in cars.
Despite these initial setbacks, much has been accomplished since then. Sev-
eral IMT proposals were made and, after some winnowing, it came down to two
main ones. The first one, WCDMA (Wideband CDMA), was proposed by
Ericsson and was pushed by the European Union, which called it UMTS (Univer-
sal
Mobile
Telecommunications
System).
The
other
contender
was
CDMA2000, proposed by Qualcomm.
Both of these systems are more similar than different in that they are based on
broadband CDMA; WCDMA uses 5-MHz channels and CDMA2000 uses 1.25-
MHz channels. If the Ericsson and Qualcomm engineers were put in a room and
told to come to a common design, they probably could find one fairly quickly.
The trouble is that the real problem is not engineering, but politics (as usual).
Europe wanted a system that interworked with GSM, whereas the U.S. wanted a

---

## Page 39

176
THE PHYSICAL LAYER
CHAP. 2
system that was compatible with one already widely deployed in the U.S. (IS-95).
Each side also supported its local company (Ericsson is based in Sweden; Qual-
comm is in California). Finally, Ericsson and Qualcomm were involved in num-
erous lawsuits over their respective CDMA patents.
Worldwide, 10–15% of mobile subscribers already use 3G technologies. In
North America and Europe, around a third of mobile subscribers are 3G. Japan
was an early adopter and now nearly all mobile phones in Japan are 3G. These
figures include the deployment of both UMTS and CDMA2000, and 3G continues
to be one great cauldron of activity as the market shakes out. To add to the confu-
sion, UMTS became a single 3G standard with multiple incompatible options, in-
cluding CDMA2000. This change was an effort to unify the various camps, but it
just papers over the technical differences and obscures the focus of ongoing
efforts. We will use UMTS to mean WCDMA, as distinct from CDMA2000.
We will focus our discussion on the use of CDMA in cellular networks, as it
is the distinguishing feature of both systems. CDMA is neither FDM nor TDM
but a kind of mix in which each user sends on the same frequency band at the
same time. When it was first proposed for cellular systems, the industry gave it
approximately the same reaction that Columbus first got from Queen Isabella
when he proposed reaching India by sailing in the wrong direction. However,
through the persistence of a single company, Qualcomm, CDMA succeeded as a
2G system (IS-95) and matured to the point that it became the technical basis for
3G.
To make CDMA work in the mobile phone setting requires more than the
basic CDMA technique that we described in the previous section. Specifically,
we described synchronous CDMA, in which the chip sequences are exactly
orthogonal. This design works when all users are synchronized on the start time of
their chip sequences, as in the case of the base station transmitting to mobiles.
The base station can transmit the chip sequences starting at the same time so that
the signals will be orthogonal and able to be separated. However, it is difficult to
synchronize the transmissions of independent mobile phones. Without care, their
transmissions would arrive at the base station at different times, with no guarantee
of orthogonality. To let mobiles send to the base station without synchronization,
we want code sequences that are orthogonal to each other at all possible offsets,
not simply when they are aligned at the start.
While it is not possible to find sequences that are exactly orthogonal for this
general case, long pseudorandom sequences come close enough. They have the
property that, with high probability, they have a low cross-correlation with each
other at all offsets. This means that when one sequence is multiplied by another
sequence and summed up to compute the inner product, the result will be small; it
would be zero if they were orthogonal. (Intuitively, random sequences should al-
ways look different from each other. Multiplying them together should then pro-
duce a random signal, which will sum to a small result.) This lets a receiver filter
unwanted transmissions out of the received signal. Also, the auto-correlation of

---

## Page 40

SEC. 2.7
THE MOBILE TELEPHONE SYSTEM
177
pseudorandom sequences is also small, with high probability, except at a zero off-
set. This means that when one sequence is multiplied by a delayed copy of itself
and summed, the result will be small, except when the delay is zero. (Intuitively,
a delayed random sequence looks like a different random sequence, and we are
back to the cross-correlation case.) This lets a receiver lock onto the beginning of
the wanted transmission in the received signal.
The use of pseudorandom sequences lets the base station receive CDMA mes-
sages from unsynchronized mobiles. However, an implicit assumption in our dis-
cussion of CDMA is that the power levels of all mobiles are the same at the re-
ceiver. If they are not, a small cross-correlation with a powerful signal might
overwhelm a large auto-correlation with a weak signal. Thus, the transmit power
on mobiles must be controlled to minimize interference between competing sig-
nals. It is this interference that limits the capacity of CDMA systems.
The power levels received at a base station depend on how far away the trans-
mitters are as well as how much power they transmit. There may be many mobile
stations at varying distances from the base station. A good heuristic to equalize
the received power is for each mobile station to transmit to the base station at the
inverse of the power level it receives from the base station. In other words, a
mobile station receiving a weak signal from the base station will use more power
than one getting a strong signal. For more accuracy, the base station also gives
each mobile feedback to increase, decrease, or hold steady its transmit power. The
feedback is frequent (1500 times per second) because good power control is im-
portant to minimize interference.
Another improvement over the basic CDMA scheme we described earlier is to
allow different users to send data at different rates. This trick is accomplished
naturally in CDMA by fixing the rate at which chips are transmitted and assigning
users chip sequences of different lengths. For example, in WCDMA, the chip rate
is 3.84 Mchips/sec and the spreading codes vary from 4 to 256 chips. With a 256-
chip code, around 12 kbps is left after error correction, and this capacity is suffi-
cient for a voice call. With a 4-chip code, the user data rate is close to 1 Mbps.
Intermediate-length codes give intermediate rates; to get to multiple Mbps, the
mobile must use more than one 5-MHz channel at once.
Now let us describe the advantages of CDMA, given that we have dealt with
the problems of getting it to work. It has three main advantages. First, CDMA
can improve capacity by taking advantage of small periods when some trans-
mitters are silent. In polite voice calls, one party is silent while the other talks. On
average, the line is busy only 40% of the time. However, the pauses may be small
and are difficult to predict. With TDM or FDM systems, it is not possible to reas-
sign time slots or frequency channels quickly enough to benefit from these small
silences. However, in CDMA, by simply not transmitting one user lowers the in-
terference for other users, and it is likely that some fraction of users will not be
transmitting in a busy cell at any given time. Thus CDMA takes advantage of ex-
pected silences to allow a larger number of simultaneous calls.

---

## Page 41

178
THE PHYSICAL LAYER
CHAP. 2
Second, with CDMA each cell uses the same frequencies. Unlike GSM and
AMPS, FDM is not needed to separate the transmissions of different users. This
eliminates complicated frequency planning tasks and improves capacity. It also
makes it easy for a base station to use multiple directional antennas, or sectored
antennas, instead of an omnidirectional antenna. Directional antennas concen-
trate a signal in the intended direction and reduce the signal, and hence inter-
ference, in other directions. This in turn increases capacity. Three sector designs
are common. The base station must track the mobile as it moves from sector to
sector. This tracking is easy with CDMA because all frequencies are used in all
sectors.
Third, CDMA facilitates soft handoff, in which the mobile is acquired by the
new base station before the previous one signs off. In this way there is no loss of
continuity. Soft handoff is shown in Fig. 2-49. It is easy with CDMA because all
frequencies are used in each cell. The alternative is a hard handoff, in which the
old base station drops the call before the new one acquires it. If the new one is
unable to acquire it (e.g., because there is no available frequency), the call is
disconnected abruptly. Users tend to notice this, but it is inevitable occasionally
with the current design. Hard handoff is the norm with FDM designs to avoid the
cost of having the mobile transmit or receive on two frequencies simultaneously.
(a)
(b)
(c)
Figure 2-49. Soft handoff (a) before, (b) during, and (c) after.
Much has been written about 3G, most of it praising it as the greatest thing
since sliced bread. Meanwhile, many operators have taken cautious steps in the
direction of 3G by going to what is sometimes called 2.5G, although 2.1G might
be more accurate. One such system is EDGE (Enhanced Data rates for GSM
Evolution), which is just GSM with more bits per symbol. The trouble is, more
bits per symbol also means more errors per symbol, so EDGE has nine different
schemes for modulation and error correction, differing in terms of how much of
the bandwidth is devoted to fixing the errors introduced by the higher speed.
EDGE is one step along an evolutionary path that is defined from GSM to
WCDMA.
Similarly, there is an evolutionary path defined for operators to
upgrade from IS-95 to CDMA2000 networks.
Even though 3G networks are not fully deployed yet, some researchers regard
3G as a done deal. These people are already working on 4G systems under the

---

## Page 42

SEC. 2.7
THE MOBILE TELEPHONE SYSTEM
179
name of LTE (Long Term Evolution). Some of the proposed features of 4G in-
clude: high bandwidth; ubiquity (connectivity everywhere); seamless integration
with other wired and wireless IP networks, including 802.11 access points; adap-
tive resource and spectrum management; and high quality of service for multi-
media. For more information see Astely et al. (2009) and Larmo et al. (2009).
Meanwhile, wireless networks with 4G levels of performance are already
available. The main example is 802.16, also known as WiMAX. For an overview
of mobile WiMAX see Ahmadi (2009). To say the industry is in a state of flux is
a huge understatement. Check back in a few years to see what has happened.
2.8 CABLE TELEVISION
We have now studied both the fixed and wireless telephone systems in a fair
amount of detail. Both will clearly play a major role in future networks. But
there is another major player that has emerged over the past decade for Internet
access: cable television networks. Many people nowadays get their telephone and
Internet service over cable. In the following sections we will look at cable tele-
vision as a network in more detail and contrast it with the telephone systems we
have just studied. Some relevant references for more information are Donaldson
and Jones (2001), Dutta-Roy (2001), and Fellows and Jones (2001).
2.8.1 Community Antenna Television
Cable television was conceived in the late 1940s as a way to provide better
reception to people living in rural or mountainous areas. The system initially con-
sisted of a big antenna on top of a hill to pluck the television signal out of the air,
an amplifier, called the headend, to strengthen it, and a coaxial cable to deliver it
to people’s houses, as illustrated in Fig. 2-50.
Tap
Coaxial cable
Drop cable
Headend
Antenna for picking
up distant signals
Figure 2-50. An early cable television system.
In the early years, cable television was called Community Antenna Televis-
ion. It was very much a mom-and-pop operation; anyone handy with electronics

---

## Page 43

180
THE PHYSICAL LAYER
CHAP. 2
could set up a service for his town, and the users would chip in to pay the costs.
As the number of subscribers grew, additional cables were spliced onto the origi-
nal cable and amplifiers were added as needed. Transmission was one way, from
the headend to the users. By 1970, thousands of independent systems existed.
In 1974, Time Inc. started a new channel, Home Box Office, with new content
(movies) distributed only on cable. Other cable-only channels followed, focusing
on news, sports, cooking, and many other topics. This development gave rise to
two changes in the industry. First, large corporations began buying up existing
cable systems and laying new cable to acquire new subscribers. Second, there
was now a need to connect multiple systems, often in distant cities, in order to dis-
tribute the new cable channels. The cable companies began to lay cable between
the cities to connect them all into a single system. This pattern was analogous to
what happened in the telephone industry 80 years earlier with the connection of
previously isolated end offices to make long-distance calling possible.
2.8.2 Internet over Cable
Over the course of the years the cable system grew and the cables between the
various cities were replaced by high-bandwidth fiber, similar to what happened in
the telephone system. A system with fiber for the long-haul runs and coaxial
cable to the houses is called an HFC (Hybrid Fiber Coax) system. The electro-
optical converters that interface between the optical and electrical parts of the sys-
tem are called fiber nodes. Because the bandwidth of fiber is so much greater
than that of coax, a fiber node can feed multiple coaxial cables. Part of a modern
HFC system is shown in Fig. 2-51(a).
Over the past decade, many cable operators decided to get into the Internet
access business, and often the telephony business as well. Technical differences
between the cable plant and telephone plant had an effect on what had to be done
to achieve these goals. For one thing, all the one-way amplifiers in the system
had to be replaced by two-way amplifiers to support upstream as well as down-
stream transmissions. While this was happening, early Internet over cable sys-
tems used the cable television network for downstream transmissions and a dial-
up connection via the telephone network for upstream transmissions. It was a
clever workaround, but not much of a network compared to what it could be.
However, there is another difference between the HFC system of Fig. 2-51(a)
and the telephone system of Fig. 2-51(b) that is much harder to remove. Down in
the neighborhoods, a single cable is shared by many houses, whereas in the tele-
phone system, every house has its own private local loop. When used for televis-
ion broadcasting, this sharing is a natural fit. All the programs are broadcast on
the cable and it does not matter whether there are 10 viewers or 10,000 viewers.
When the same cable is used for Internet access, however, it matters a lot if there
are 10 users or 10,000. If one user decides to download a very large file, that
bandwidth is potentially being taken away from other users. The more users there

---

## Page 44

SEC. 2.8
CABLE TELEVISION
181
Copper
twisted pair
Switch
Toll
office
Head-
end
High-bandwidth
fiber trunk
End
office
Local
loop
(a)
(b)
House
High-bandwidth
fiber
trunk
Coaxial
cable
House
Tap
Fiber node
Fiber
Fiber
Figure 2-51. (a) Cable television. (b) The fixed telephone system.
are, the more competition there is for bandwidth. The telephone system does not
have this particular property: downloading a large file over an ADSL line does not
reduce your neighbor’s bandwidth. On the other hand, the bandwidth of coax is
much higher than that of twisted pairs, so you can get lucky if your neighbors do
not use the Internet much.
The way the cable industry has tackled this problem is to split up long cables
and connect each one directly to a fiber node. The bandwidth from the headend to
each fiber node is effectively infinite, so as long as there are not too many sub-
scribers on each cable segment, the amount of traffic is manageable. Typical

---

## Page 45

182
THE PHYSICAL LAYER
CHAP. 2
cables nowadays have 500–2000 houses, but as more and more people subscribe
to Internet over cable, the load may become too great, requiring more splitting and
more fiber nodes.
2.8.3 Spectrum Allocation
Throwing off all the TV channels and using the cable infrastructure strictly
for Internet access would probably generate a fair number of irate customers, so
cable companies are hesitant to do this. Furthermore, most cities heavily regulate
what is on the cable, so the cable operators would not be allowed to do this even if
they really wanted to. As a consequence, they needed to find a way to have tele-
vision and Internet peacefully coexist on the same cable.
The solution is to build on frequency division multiplexing. Cable television
channels in North America occupy the 54–550 MHz region (except for FM radio,
from 88 to 108 MHz). These channels are 6-MHz wide, including guard bands,
and can carry one traditional analog television channel or several digital television
channels. In Europe the low end is usually 65 MHz and the channels are 6–8
MHz wide for the higher resolution required by PAL and SECAM, but otherwise
the allocation scheme is similar. The low part of the band is not used. Modern
cables can also operate well above 550 MHz, often at up to 750 MHz or more.
The solution chosen was to introduce upstream channels in the 5–42 MHz band
(slightly higher in Europe) and use the frequencies at the high end for the down-
stream signals. The cable spectrum is illustrated in Fig. 2-52.
0
108
TV
TV
Downstream data
Downstream frequencies
Upstream
data
Upstream
frequencies
FM
550
750 MHz
5 42 54 88
Figure 2-52. Frequency allocation in a typical cable TV system used for Inter-
net access.
Note that since the television signals are all downstream, it is possible to use
upstream amplifiers that work only in the 5–42 MHz region and downstream
amplifiers that work only at 54 MHz and up, as shown in the figure. Thus, we get
an asymmetry in the upstream and downstream bandwidths because more spec-
trum is available above television than below it. On the other hand, most users
want more downstream traffic, so cable operators are not unhappy with this fact

---

## Page 46

SEC. 2.8
CABLE TELEVISION
183
of life. As we saw earlier, telephone companies usually offer an asymmetric DSL
service, even though they have no technical reason for doing so.
In addition to upgrading the amplifiers, the operator has to upgrade the
headend, too, from a dumb amplifier to an intelligent digital computer system
with a high-bandwidth fiber interface to an ISP. Often the name gets upgraded as
well, from ‘‘headend’’ to CMTS (Cable Modem Termination System). In the
following text, we will refrain from doing a name upgrade and stick with the tra-
ditional ‘‘headend.’’
2.8.4 Cable Modems
Internet access requires a cable modem, a device that has two interfaces on it:
one to the computer and one to the cable network. In the early years of cable In-
ternet, each operator had a proprietary cable modem, which was installed by a
cable company technician. However, it soon became apparent that an open stan-
dard would create a competitive cable modem market and drive down prices, thus
encouraging use of the service. Furthermore, having the customers buy cable
modems in stores and install them themselves (as they do with wireless access
points) would eliminate the dreaded truck rolls.
Consequently, the larger cable operators teamed up with a company called
CableLabs to produce a cable modem standard and to test products for compli-
ance. This standard, called DOCSIS (Data Over Cable Service Interface Spe-
cification), has mostly replaced proprietary modems. DOCSIS version 1.0 came
out in 1997, and was soon followed by DOCSIS 2.0 in 2001. It increased up-
stream rates to better support symmetric services such as IP telephony. The most
recent version of the standard is DOCSIS 3.0, which came out in 2006. It uses
more bandwidth to increase rates in both directions. The European version of
these standards is called EuroDOCSIS. Not all cable operators like the idea of a
standard, however, since many of them were making good money leasing their
modems to their captive customers. An open standard with dozens of manufact-
urers selling cable modems in stores ends this lucrative practice.
The modem-to-computer interface is straightforward. It is normally Ethernet,
or occasionally USB. The other end is more complicated as it uses all of FDM,
TDM, and CDMA to share the bandwidth of the cable between subscribers.
When a cable modem is plugged in and powered up, it scans the downstream
channels looking for a special packet periodically put out by the headend to pro-
vide system parameters to modems that have just come online. Upon finding this
packet, the new modem announces its presence on one of the upstream channels.
The headend responds by assigning the modem to its upstream and downstream
channels. These assignments can be changed later if the headend deems it neces-
sary to balance the load.
The use of 6-MHz or 8-MHz channels is the FDM part. Each cable modem
sends data on one upstream and one downstream channel, or multiple channels

---

## Page 47

184
THE PHYSICAL LAYER
CHAP. 2
under DOCSIS 3.0. The usual scheme is to take each 6 (or 8) MHz downstream
channel and modulate it with QAM-64 or, if the cable quality is exceptionally
good, QAM-256. With a 6-MHz channel and QAM-64, we get about 36 Mbps.
When the overhead is subtracted, the net payload is about 27 Mbps. With QAM-
256, the net payload is about 39 Mbps. The European values are 1/3 larger.
For upstream, there is more RF noise because the system was not originally
designed for data, and noise from multiple subscribers is funneled to the headend,
so a more conservative scheme is used. This ranges from QPSK to QAM-128,
where some of the symbols are used for error protection with Trellis Coded Mod-
ulation. With fewer bits per symbol on the upstream, the asymmetry between
upstream and downstream rates is much more than suggested by Fig. 2-52.
TDM is then used to share bandwidth on the upstream across multiple sub-
scribers. Otherwise their transmissions would collide at the headend. Time is di-
vided into minislots and different subscribers send in different minislots. To
make this work, the modem determines its distance from the headend by sending
it a special packet and seeing how long it takes to get the response. This process
is called ranging. It is important for the modem to know its distance to get the
timing right. Each upstream packet must fit in one or more consecutive minislots
at the headend when it is received. The headend announces the start of a new
round of minislots periodically, but the starting gun is not heard at all modems si-
multaneously due to the propagation time down the cable. By knowing how far it
is from the headend, each modem can compute how long ago the first minislot
really started. Minislot length is network dependent. A typical payload is 8 bytes.
During initialization, the headend assigns each modem to a minislot to use for
requesting upstream bandwidth. When a computer wants to send a packet, it
transfers the packet to the modem, which then requests the necessary number of
minislots for it. If the request is accepted, the headend puts an acknowledgement
on the downstream channel telling the modem which minislots have been reserved
for its packet. The packet is then sent, starting in the minislot allocated to it. Ad-
ditional packets can be requested using a field in the header.
As a rule, multiple modems will be assigned the same minislot, which leads to
contention. Two different possibilities exist for dealing with it. The first is that
CDMA is used to share the minislot between subscribers. This solves the con-
tention problem because all subscribers with a CDMA code sequence can send at
the same time, albeit at a reduced rate. The second option is that CDMA is not
used, in which case there may be no acknowledgement to the request because of a
collision. In this case, the modem just waits a random time and tries again. After
each successive failure, the randomization time is doubled. (For readers already
somewhat familiar with networking, this algorithm is just slotted ALOHA with bi-
nary exponential backoff. Ethernet cannot be used on cable because stations can-
not sense the medium. We will come back to these issues in Chap. 4.)
The downstream channels are managed differently from the upstream chan-
nels. For starters, there is only one sender (the headend), so there is no contention

---

## Page 48

SEC. 2.8
CABLE TELEVISION
185
and no need for minislots, which is actually just statistical time division multi-
plexing. For another, the amount of traffic downstream is usually much larger
than upstream, so a fixed packet size of 204 bytes is used. Part of that is a Reed-
Solomon error-correcting code and some other overhead, leaving a user payload
of 184 bytes. These numbers were chosen for compatibility with digital television
using MPEG-2, so the TV and downstream data channels are formatted the same
way. Logically, the connections are as depicted in Fig. 2-53.
Figure 2-53. Typical details of the upstream and downstream channels in North
America.
2.8.5 ADSL Versus Cable
Which is better, ADSL or cable? That is like asking which operating system
is better. Or which language is better. Or which religion. Which answer you get
depends on whom you ask. Let us compare ADSL and cable on a few points.
Both use fiber in the backbone, but they differ on the edge. Cable uses coax;
ADSL uses twisted pair. The theoretical carrying capacity of coax is hundreds of
times more than twisted pair. However, the full capacity of the cable is not avail-
able for data users because much of the cable’s bandwidth is wasted on useless
stuff such as television programs.
In practice, it is hard to generalize about effective capacity. ADSL providers
give specific statements about the bandwidth (e.g., 1 Mbps downstream, 256 kbps
upstream) and generally achieve about 80% of it consistently. Cable providers
may artificially cap the bandwidth to each user to help them make performance
predictions, but they cannot really give guarantees because the effective capacity
depends on how many people are currently active on the user’s cable segment.
Sometimes it may be better than ADSL and sometimes it may be worse. What
can be annoying, though, is the unpredictability. Having great service one minute
does not guarantee great service the next minute since the biggest bandwidth hog
in town may have just turned on his computer.

---

## Page 49

186
THE PHYSICAL LAYER
CHAP. 2
As an ADSL system acquires more users, their increasing numbers have little
effect on existing users, since each user has a dedicated connection. With cable,
as more subscribers sign up for Internet service, performance for existing users
will drop. The only cure is for the cable operator to split busy cables and connect
each one to a fiber node directly. Doing so costs time and money, so there are
business pressures to avoid it.
As an aside, we have already studied another system with a shared channel
like cable: the mobile telephone system. Here, too, a group of users—we could
call them cellmates—share a fixed amount of bandwidth. For voice traffic, which
is fairly smooth, the bandwidth is rigidly divided in fixed chunks among the active
users using FDM and TDM. But for data traffic, this rigid division is very ineffi-
cient because data users are frequently idle, in which case their reserved band-
width is wasted. As with cable, a more dynamic means is used to allocate the
shared bandwidth.
Availability is an issue on which ADSL and cable differ. Everyone has a tele-
phone, but not all users are close enough to their end offices to get ADSL. On the
other hand, not everyone has cable, but if you do have cable and the company pro-
vides Internet access, you can get it. Distance to the fiber node or headend is not
an issue. It is also worth noting that since cable started out as a television distrib-
ution medium, few businesses have it.
Being a point-to-point medium, ADSL is inherently more secure than cable.
Any cable user can easily read all the packets going down the cable. For this rea-
son, any decent cable provider will encrypt all traffic in both directions. Never-
theless, having your neighbor get your encrypted messages is still less secure than
having him not get anything at all.
The telephone system is generally more reliable than cable. For example, it
has backup power and continues to work normally even during a power outage.
With cable, if the power to any amplifier along the chain fails, all downstream
users are cut off instantly.
Finally, most ADSL providers offer a choice of ISPs. Sometimes they are
even required to do so by law. Such is not always the case with cable operators.
The conclusion is that ADSL and cable are much more alike than they are dif-
ferent. They offer comparable service and, as competition between them heats
up, probably comparable prices.
2.9 SUMMARY
The physical layer is the basis of all networks. Nature imposes two funda-
mental limits on all channels, and these determine their bandwidth. These limits
are the Nyquist limit, which deals with noiseless channels, and the Shannon limit,
which deals with noisy channels.
