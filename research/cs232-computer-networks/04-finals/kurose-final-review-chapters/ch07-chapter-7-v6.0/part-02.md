# ch07-chapter-7-v6.0 - Part 02 (Pages 46-89)

---

## Page 46

RTP and QoS
v RTP does not provide any mechanism to ensure
timely data delivery or other QoS  guarantees
v RTP encapsulation only seen at end systems (not
by intermediate routers)
§ routers provide best-effort service, making no
special effort to ensure that RTP packets arrive
at destination in timely matter
Multmedia Networking 7-46

---

## Page 47

RTP header
payload type (7 bits): indicates type of encoding currently being
used.  If sender changes encoding during call, sender
informs receiver via  payload type field
Payload type 0: PCM mu-law, 64 kbps
Payload type 3: GSM, 13 kbps
Payload type 7: LPC, 2.4 kbps
Payload type 26: Motion JPEG
Payload type 31: H.261
Payload type 33: MPEG2 video
sequence # (16 bits): increment by one for each RTP packet sent
v detect packet loss, restore packet sequence
Multmedia Networking 5-47
payload
type
sequence
number
type
time stamp
Synchronization
Source ID
Miscellaneous
fields

---

## Page 48

v timestamp field (32 bits long): sampling instant of first
byte in this RTP data packet
§ for audio, timestamp clock increments by one for each
sampling period (e.g., each 125 usecs for 8 KHz sampling
clock)
§ if application generates chunks of 160 encoded samples,
timestamp increases by 160 for each RTP packet when
source is active. Timestamp clock continues to increase
at constant rate when source is inactive.
v SSRC field (32 bits long): identifies source of RTP
stream. Each stream in RTP session has distinct SSRC
Multmedia Networking 7-48
RTP header
payload
type
sequence
number
type
time stamp
Synchronization
Source ID
Miscellaneous
fields

---

## Page 49

RTSP/RTP programming assignment
v build a server that encapsulates stored video
frames into RTP packets
§ grab video frame, add RTP headers, create UDP
segments, send segments to UDP socket
§ include seq numbers and time stamps
§ client RTP provided for you
v also write client side of RTSP
§ issue play/pause commands
§ server RTSP provided for you
Multmedia Networking 7-49

---

## Page 50

Real-Time Control Protocol (RTCP)
v works in conjunction
with RTP
v each participant in RTP
session periodically
sends RTCP control
packets to all other
participants
v each RTCP packet
contains sender and/or
receiver reports
§ report statistics useful to
application: # packets
sent, # packets lost,
interarrival jitter
v feedback used to control
performance
§ sender may modify its
transmissions based on
feedback
Multmedia Networking 7-50

---

## Page 51

RTCP: multiple multicast senders
veach RTP session: typically a single multicast address; all RTP
/RTCP packets belonging to session use multicast address
vRTP, RTCP packets distinguished from each other via distinct port
numbers
vto limit traffic, each participant reduces RTCP traffic as number of
conference participants increases
Multmedia Networking 5-51
RTCP
RTP
RTCP
RTCP
sender
receivers

---

## Page 52

RTCP: packet types
receiver report packets:
v
fraction of packets lost, last
sequence number, average
interarrival jitter
sender report packets:
v SSRC of RTP stream,
current time, number of
packets sent, number of
bytes sent
source description packets:
v e-mail address of sender,
sender's name, SSRC  of
associated RTP stream
v provide mapping between
the SSRC and the
user/host name
Multmedia Networking 7-52

---

## Page 53

RTCP: stream synchronization
v RTCP can synchronize
different media streams
within a RTP session
v e.g., videoconferencing
app: each sender
generates one RTP
stream for video, one for
audio.
v timestamps in RTP
packets tied to the video,
audio sampling clocks
§ not tied to wall-clock
time
v each RTCP sender-report
packet contains (for most
recently generated packet
in associated RTP stream):
§ timestamp of RTP
packet
§ wall-clock time for
when packet was
created
v receivers uses association
to synchronize playout of
audio, video
Multmedia Networking 7-53

---

## Page 54

RTCP: bandwidth scaling
RTCP attempts to limit its
traffic to 5% of session
bandwidth
example : one sender,
sending video at 2 Mbps
v RTCP attempts to limit
RTCP traffic to 100 Kbps
v RTCP gives 75% of  rate
to receivers; remaining
25% to sender
v 75 kbps is equally shared
among receivers:
§ with R receivers,  each receiver
gets to send RTCP traffic at
75/R kbps.
v sender gets to send RTCP
traffic at 25 kbps.
v participant determines RTCP
packet transmission period
by calculating avg RTCP
packet size (across entire
session) and dividing by
allocated rate
Multmedia Networking 7-54

---

## Page 55

SIP: Session Initiation Protocol [RFC 3261]
long-term vision:
v all telephone calls, video conference calls take
place over Internet
v people identified by names or e-mail addresses,
rather than by phone numbers
v can reach callee (if callee so desires), no matter
where callee roams, no matter what IP device
callee is currently using
Multmedia Networking 7-55

---

## Page 56

SIP services
v SIP provides
mechanisms for call
setup:
§ for caller to let
callee know she
wants to establish a
call
§ so caller, callee can
agree on media type,
encoding
§ to end call
v determine current IP
address of callee:
§ maps mnemonic
identifier to current IP
address
v call management:
§ add new media
streams during call
§ change encoding
during call
§ invite others
§ transfer, hold calls
Multmedia Networking 7-56

---

## Page 57

Example: setting up call to known IP address
v Alices SIP invite message
indicates her port number, IP
address, encoding she prefers
to receive (PCM µlaw)
v Bobs 200 OK message
indicates his port number, IP
address, preferred encoding
(GSM)
v SIP messages can be sent
over TCP or UDP; here sent
over RTP/UDP
v default SIP port number is
5060
time
time
Bob's
terminal rings
Alice
167.180.112.24
Bob
193.64.210.89
port 5060
port 38060
µ Law audio
GSM
port 48753
INVITE bob@193.64.210.89
c=IN IP4 167.180.112.24
m=audio 38060 RTP/AVP 0
port 5060
200 OK
c=IN IP4 193.64.210.89
m=audio 48753 RTP/AVP 3
ACK
port 5060
Multmedia Networking 5-57

---

## Page 58

Setting up a call (more)
v codec negotiation:
§ suppose Bob doesnt
have PCM µlaw encoder
§ Bob will instead reply
with 606 Not
Acceptable Reply, listing
his encoders. Alice can
then send new INVITE
message, advertising
different encoder
v rejecting a call
§ Bob can reject with
replies busy, gone,
payment required,
forbidden
v media can be sent
over RTP or some
other protocol
Multmedia Networking 7-58

---

## Page 59

Example of SIP message
INVITE sip:bob@domain.com SIP/2.0
Via: SIP/2.0/UDP 167.180.112.24
From: sip:alice@hereway.com
To: sip:bob@domain.com
Call-ID: <a2e3a@pigeon.hereway.com>
Content-Type: application/sdp
Content-Length: 885
c=IN IP4 167.180.112.24
m=audio 38060 RTP/AVP 0
Notes:
v HTTP message syntax
v sdp = session description protocol
v Call-ID is unique for every call
v Here we dont know
Bobs IP address
§ intermediate SIP
servers needed
v Alice sends, receives
SIP messages using SIP
default port 506
v Alice specifies in
header that SIP client
sends, receives SIP
messages over UDP
Multmedia Networking 7-59

---

## Page 60

Name translation, user location
v caller wants to call
callee, but only has
callees name or e-mail
address.
v need to get IP address of
callee’s current host:
§ user moves around
§ DHCP protocol
§ user has different IP
devices (PC, smartphone,
car device)
v result can be based on:
§ time of day (work,
home)
§ caller (dont want boss
to call you at home)
§ status of callee (calls sent
to voicemail when callee
is already talking to
someone)
Multmedia Networking 7-60

---

## Page 61

SIP registrar
REGISTER sip:domain.com SIP/2.0
Via: SIP/2.0/UDP 193.64.210.89
From: sip:bob@domain.com
To: sip:bob@domain.com
Expires: 3600
v one function of SIP server: registrar
v when Bob starts SIP client, client sends SIP REGISTER
message to Bobs registrar server
register message:
Multmedia Networking 7-61

---

## Page 62

SIP proxy
v another function of SIP server: proxy
v Alice sends invite message to her proxy server
§ contains address sip:bob@domain.com
§ proxy responsible for routing SIP messages to callee,
possibly through multiple proxies
v Bob sends response back through same set of SIP
proxies
v proxy returns Bob’s SIP response message to Alice
§ contains Bobs IP address
v SIP proxy analogous to local DNS server plus TCP
setup
Multmedia Networking 7-62

---

## Page 63

SIP example: <jim@umass.edu> calls <keith@poly.edu>
Multmedia Networking 7-63
1

1. Jim sends INVITE
message to UMass
SIP proxy.
2. UMass proxy forwards request
to Poly registrar server
2
3. Poly server returns redirect response,
indicating that it should  try <keith@eurecom.fr>
3
5. eurecom
registrar
forwards INVITE
to 197.87.54.21,
which is running
keiths SIP
client
5
4
4. Umass proxy forwards request
to Eurecom registrar server
8
6
7
6-8. SIP response returned to Jim
9
9. Data flows between clients
UMass
SIP proxy
Poly SIP
registrar
Eurecom  SIP
registrar
197.87.54.21
128.119.40.186

---

## Page 64

Comparison with H.323
v H.323: another signaling
protocol for real-time,
interactive multimedia
v H.323: complete,
vertically integrated suite
of protocols for
multimedia conferencing:
signaling, registration,
admission control,
transport, codecs
v SIP: single component.
Works with RTP, but
does not mandate it. Can
be combined with other
protocols, services
v H.323 comes from the
ITU (telephony)
v SIP comes from IETF:
borrows much of its
concepts from HTTP
§ SIP has Web flavor;
H.323 has  telephony
flavor
v SIP uses KISS principle:
Keep It Simple Stupid
Multmedia Networking 7-64

---

## Page 65

Multimedia networking: outline
7.1 multimedia networking applications
7.2 streaming stored video
7.3 voice-over-IP
7.4 protocols for real-time conversational
applications
7.5 network support for multimedia
Multmedia Networking 7-65

---

## Page 66

Network support for multimedia
Multmedia Networking 7-66

---

## Page 67

Dimensioning best effort networks
v approach: deploy enough link capacity so that
congestion doesn’t occur, multimedia traffic flows
without delay or loss
§ low complexity of network mechanisms (use current “best
effort” network)
§ high bandwidth costs
v challenges:
§ network dimensioning: how much bandwidth is “enough?”
§ estimating network traffic demand: needed to determine how
much bandwidth is “enough” (for that much traffic)
Multmedia Networking 7-67

---

## Page 68

Providing multiple classes of service
v thus far: making the best of best effort service
§ one-size fits all service model
v alternative: multiple classes of service
§ partition traffic into classes
§ network treats different classes of traffic differently (analogy:
VIP service versus regular service)
0111
v granularity: differential
service among multiple
classes, not among
individual connections
v history: ToS bits
Multmedia Networking 7-68

---

## Page 69

Multiple classes of service: scenario
R1
R2
H1
H2
H3
H4
1.5 Mbps link
R1 output
interface
queue
Multmedia Networking 7-69

---

## Page 70

Scenario 1: mixed HTTP and VoIP
v example:  1Mbps VoIP, HTTP share 1.5 Mbps link.
§ HTTP bursts can congest router, cause audio loss
§ want to give priority to audio over HTTP
packet marking needed for router to distinguish
between different classes; and new router policy to
treat packets accordingly
Principle 1
R1
R2
Multmedia Networking 7-70

---

## Page 71

Principles for QOS guarantees (more)
v what if applications misbehave (VoIP sends higher
than declared rate)
§ policing: force source adherence to bandwidth allocations
v marking, policing at network edge
provide protection (isolation) for one class from others
Principle 2
R1
R2
1.5 Mbps link
1 Mbps
phone
packet marking and policing
Multmedia Networking 7-71

---

## Page 72

v allocating fixed (non-sharable) bandwidth to flow:
inefficient use of bandwidth if flows doesn’t use its
allocation
while providing isolation, it is desirable to use
resources as efficiently as possible
Principle 3
R1
R2
1.5 Mbps link
1 Mbps
phone
1 Mbps logical link
0.5 Mbps logical link
Multmedia Networking 7-72
Principles for QOS guarantees (more)

---

## Page 73

Scheduling and policing mechanisms
v scheduling: choose next packet to send on link
v FIFO (first in first out) scheduling: send in order of
arrival to queue
§ real-world example?
§ discard policy: if packet arrives to full queue: who to
discard?
• tail drop: drop arriving packet
• priority: drop/remove on priority basis
• random: drop/remove randomly
Multmedia Networking 7-73
queue
(waiting area)
packet
arrivals
packet
departures
link
(server)

---

## Page 74

Scheduling policies: priority
priority scheduling: send
highest priority
queued packet
v multiple classes, with
different priorities
§ class may depend on
marking or other
header info, e.g. IP
source/dest, port
numbers, etc.
§ real world example?
Multmedia Networking 7-74
high priority queue
(waiting area)
low priority queue
(waiting area)
arrivals
classify
departures
link
(server)
1
3
2
4
5
5
5
2
2
1
1
3
3
4
4
arrivals
departures
packet
in
service

---

## Page 75

Scheduling policies: still more
Round Robin (RR) scheduling:
v multiple classes
v cyclically scan class queues, sending one complete
packet from each class (if available)
v real world example?
Multmedia Networking 7-75
1
2
3
4
5
5
5
2
3
1
1
3
3
4
4
arrivals
departures
packet
in
service

---

## Page 76

Weighted Fair Queuing (WFQ):
v generalized Round Robin
v each class gets weighted amount of service in
each cycle
v real-world example?
Multmedia Networking 7-76
Scheduling policies: still more

---

## Page 77

Policing mechanisms
goal: limit traffic to not exceed declared parameters
Three common-used criteria:
v (long term) average rate: how many pkts can be sent
per unit time (in the long run)
§ crucial question: what is the interval length: 100 packets
per sec or 6000 packets per min have same average!
v peak rate: e.g., 6000 pkts per min (ppm) avg.; 1500
ppm peak rate
v (max.) burst size: max number of pkts sent
consecutively (with no intervening idle)
Multmedia Networking 7-77

---

## Page 78

Policing mechanisms: implementation
token bucket: limit input to specified burst size and
average rate
v bucket can hold b tokens
v tokens generated at rate r token/sec unless bucket
full
v over interval of length t: number of packets admitted
less than or equal to  (r t + b)
Multmedia Networking 7-78

---

## Page 79

Policing and QoS guarantees
v token bucket, WFQ combine to provide
guaranteed upper bound on delay, i.e., QoS
guarantee!
WFQ
token rate, r
bucket size, b
per-flow
rate, R
D     = b/R
max
arriving
traffic
Multmedia Networking 7-79
arriving
traffic

---

## Page 80

Differentiated services
v want qualitative service classes
§ behaves like a wire
§ relative service distinction: Platinum, Gold, Silver
v scalability: simple functions in network core,
relatively complex functions at edge routers (or
hosts)
§ signaling, maintaining per-flow router state  difficult
with large number of flows
v dont define define service classes, provide
functional components to build service classes
Multmedia Networking 7-80

---

## Page 81

edge router:
v per-flow traffic management
v marks packets as in-profile and
out-profile
core router:
v per class traffic management
v buffering and scheduling based
on marking at edge
v preference given to in-profile
packets over out-of-profile
packets
Diffserv architecture
Multmedia Networking 7-81
r
b
marking
scheduling
...

---

## Page 82

Edge-router packet marking
v class-based marking: packets of different classes marked
differently
v intra-class marking: conforming portion of flow marked
differently than non-conforming one
v profile: pre-negotiated rate r, bucket size b
v packet marking at edge based on per-flow profile
possible use of marking:
user packets
rate r
b
Multmedia Networking 5-82

---

## Page 83

Diffserv packet marking: details
v packet is marked in the Type of Service (TOS) in
IPv4, and Traffic Class in IPv6
v 6 bits used for Differentiated Service Code Point
(DSCP)
§ determine PHB that the packet will receive
§ 2 bits currently unused
Multmedia Networking 7-83
DSCP
unused

---

## Page 84

Classification, conditioning
may be desirable to limit traffic injection rate of
some class:
v user declares traffic profile (e.g., rate, burst size)
v traffic metered, shaped if non-conforming
Multmedia Networking 7-84

---

## Page 85

Forwarding Per-hop Behavior (PHB)
v PHB result in a different observable (measurable)
forwarding performance behavior
v PHB does not specify what mechanisms to use to
ensure required PHB performance behavior
v examples:
§ class A gets x% of outgoing link bandwidth over time
intervals of a specified length
§ class A packets leave first before packets from class B
Multmedia Networking 7-85

---

## Page 86

Forwarding PHB
PHBs proposed:
v expedited forwarding: pkt departure rate of a class
equals or exceeds specified rate
§ logical link with a minimum guaranteed rate
v assured forwarding: 4 classes of traffic
§ each guaranteed minimum amount of bandwidth
§ each with three drop preference partitions
Multmedia Networking 7-86

---

## Page 87

Per-connection QOS guarantees
v basic fact of life: can not support traffic demands
beyond link capacity
call admission: flow declares its needs, network may
block call (e.g., busy signal) if it cannot meet needs
Principle 4
R1
R2
1.5 Mbps link
1 Mbps
phone
1 Mbps
phone
Multmedia Networking 7-87

---

## Page 88

QoS guarantee scenario
v resource reservation
§ call setup, signaling (RSVP)
§ traffic, QoS declaration
§ per-element admission control
§ QoS-sensitive scheduling
(e.g., WFQ)
request/
reply
Multmedia Networking 7-88

---

## Page 89

Multimedia networking: outline
7.1 multimedia networking applications
7.2 streaming stored video
7.3 voice-over-IP
7.4 protocols for real-time conversational
applications
7.5 network support for multimedia
Multmedia Networking 7-89
