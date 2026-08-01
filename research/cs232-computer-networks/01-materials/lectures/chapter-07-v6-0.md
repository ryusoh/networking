# chapter-07-v6-0

---

## Page 1

Chapter 7
Multimedia
Networking
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
Multmedia Networking
7-1

---

## Page 2

Multimedia networking:
outline
7.1 multimedia networking
applications
7.2 streamin
o
7.4 pr
conversational      applications
7.5 network support for multimedia
Multmedia Networking
7-2

---

## Page 3

Multimedia networking:
outline
7.1 multimedia networking
applications
7.2 streamin
o
7.4 pr
conversational      applications
7.5 network support for multimedia
Multmedia Networking
7-3

---

## Page 4

Multimedia:
audio
Multmedia Networking
7-4
v analog audio signal
sampled at constant
rate
§ telephone: 8
sa
v each sample
quantized, i.e.,
rounded
§ e.g., 28=256
possible quantized
values
§ each quantized
value represented
by bits, e.g., 8
f
time
audio
quantized
value of
analog value
quantization
error
sampling rate
(N sample/sec)

---

## Page 5

Multimedia:
audio
Multmedia Networking
7-5
v example: 8,000
samples/sec, 256
quantized values:
64,000 bps
§ so
reduction
v example rates
v CD: 1.411 Mbps
v MP3: 96, 128, 160
kbps
v Internet telephony: 5.3
kbps and up
time
audio
quantized
value of
analog value
quantization
error
sampling rate
(N sample/sec)

---

## Page 6

v video: sequence of
images displayed at
constant rate
§ e.g. 24 image
v
§ eac
represented by bits
v coding: use
redundancy within
and between images
to decrease # bits
used to encode image
§ spatial (within
image)
§ temporal (from one
i
t
t)
Multmedia Networking
7-6
Multimedia:
video
……………………...…
spatial coding example: instead
of sending N values of same
color (all purple), send only two
values: color  value (purple)  and
number of repeated values (N)
……………………...…
frame i
frame i+1
temporal coding example:
instead of sending
complete frame at i+1,
send only differences from
frame i

---

## Page 7

Multmedia Networking
7-7
Multimedia:
video
……………………...…
spatial coding example: instead
of sending N values of same
color (all purple), send only two
values: color  value (purple)  and
number of repeated values (N)
……………………...…
frame i
frame i+1
temporal coding example:
instead of sending
complete frame at i+1,
send only differences from
frame i
v CBR: (constant bit
rate): video encoding
rate fixed
v VBR:  (variable bit
rate): video enco
tempor
changes
v examples:
§ MPEG 1 (CD-ROM)
1.5 Mbps
§ MPEG2 (DVD) 3-6
Mbps
§ MPEG4 (often used
in Internet, < 1
Mbps)

---

## Page 8

Multimedia networking: 3 application
types
Multmedia Networking
7-8
v streaming, stored audio, video
§ streaming: can begin playout before
downloading entire file
§ stored (at se
mit faster than
§ e.g
v conversational voice/video over IP
§ interactive nature of human-to-human
conversation limits delay tolerance
§ e.g., Skype
v streaming live audio, video
§ e.g., live sporting event (futbol)

---

## Page 9

Multimedia networking:
outline
7.1 multimedia networking
applications
7.2 streamin
o
7.4 pr
conversational      applications
7.5 network support for multimedia
Multmedia Networking
7-9

---

## Page 10

Streaming stored video:

1. video
recorded
(e.g., 30
frames/sec)
Cumulative data
streaming: at this time, client
playing out early part of video,
while server still sending later
part of video
network delay
(fixed in this
example)
time
Multmedia Networking 7-10
3. video received,
played out at client
(30 frames/sec)

---

## Page 11

Streaming stored video:
challenges
v continuous playout constraint: once
client playout begins, playback must
match origina
(ji
buffer to match playout
requirements
v other challenges:
§
client interactivity: pause, fast-
forward, rewind, jump through
video
§
video packets may be lost
Multmedia Networking 7-11

---

## Page 12

constant bit
      rate video
transmission
Cumulative data
time
client video
reception
       constant bit
     rate video
 playout at client
client playout
delay
v client-side buffering and playout delay:
compensate for network-added delay,
delay jitter
Multmedia Networking 7-12
Streaming stored video:
revisted

---

## Page 13

Client-side buffering,
playout
Multmedia Networking 7-13
variable fill
rate, x(t)
playout rate,
e.g., CBR r
buffer fill level,
Q(t)
vid
client

---

## Page 14

Client-side buffering,
playout
Multmedia Networking 7-14
variable fill
rate, x(t)
playout rate,
e.g., CBR r

buffer fill level,
Q(t)
vid
client

1. Initial fill of buffer until playout begins at tp
2. playout begins at tp,
3. buffer fill level varies over time as fill
rate x(t) varies and playout rate r is
constant

---

## Page 15

playou
),
playout rate (r):
v x < r: buffer eventually empties (causing
freezing of video playout until buffer again fills)
v x > r: buffer will not empty, provided initial
playout delay is large enough to absorb
variability in x(t)
§ initial playout delay tradeoff: buffer
starvation less likely with larger delay, but
l
d l
til
b
i
t hi
Multmedia Networking 7-15
variable fill
rate, x(t)
playout rate,
e.g., CBR r
buffer fill level,
Q(t)
vid
Client-side buffering,
playout

---

## Page 16

Streaming multimedia: UDP
v server sends at rate appropriate for
client
§ often: send rate = encoding rate =
constant r
co
v short playout delay (2-5 seconds) to
remove network jitter
v error recovery: application-level,
timeipermitting
v RTP [RFC 2326]: multimedia payload
types
v UDP may not go through firewalls
Multmedia Networking 7-16

---

## Page 17

Streaming multimedia:
HTTP
v multimedia file retrieved via HTTP GET
v send at maximum possible rate under
TCP
v fill rate fluctuates due to TCP
congestion control, retransmissions (in-
order delivery)
v larger playout delay: smooth TCP
delivery rate
Multmedia Networking 7-17
buffer
video
file
buffer
plication
playout buffer
server
client

---

## Page 18

Streaming multimedia:
DASH
v DASH: Dynamic, Adaptive Streaming
over HTTP
v server:
§ divides vide
e chunks
rat
§ manifest file: provides URLs for different
chunks
v client:
§ periodically measures server-to-client
bandwidth
§ consulting manifest, requests one chunk at
a time
• chooses maximum coding rate
sustainable given current bandwidth
Multmedia Networking 7-18

---

## Page 19

Streaming multimedia:
DASH
v DASH: Dynamic, Adaptive Streaming
over HTTP
v “intelligence” at client: client
determines
§ what encoding rate to request (higher
quality when more bandwidth available)
§ where to request chunk (can request from
URL server that is “close” to client or has
high available bandwidth)
Multmedia Networking 7-19

---

## Page 20

Content distribution
networks
v challenge: how to stream content
(selected from millions of videos) to
hundreds of thousands of simultaneous
users?
v optio
r”
§ single point of failure
§ point of network congestion
§ long path to distant clients
§ multiple copies of video sent over outgoing
link
….quite simply: this solution doesn’t scale
Multmedia Networking 7-20

---

## Page 21

Content distribution
networks
v challenge: how to stream content
(selected from millions of videos) to
hundreds of thousands of simultaneous
users?
v optio
es of
videos at multiple geographically
distributed sites (CDN)
§ enter deep: push CDN servers deep into
many access networks
• close to users
• used by Akamai, 1700 locations
§ bring home: smaller number (10’s) of larger
clusters in POPs near (but not within)
access networks
Multmedia Networking 7-21

---

## Page 22

CDN: “simple” content access
scenario
Multmedia Networking 7-22
Bob (client) requests video <http://netcinema.com/6>
§
video stored in CDN at <http://KingCDN.com/NetC6y&>
netcinema.com
KingCDN.com

1. Bob gets URL for for video
http:
from
web page
netcinema’s
authorative DNS
3
3. netcinema’s DNS returns URL
<http://KingCDN.com/NetC6y&B23V>
4
4&5. Resolve
<http://KingCDN.com/NetC6y&B23>
via KingCDN’s authoritative DNS,
which returns IP address of KIingCDN
server  with video
5
6. request video from
KINGCDN server,
streamed via HTTP
KingCDN
authoritative DNS

---

## Page 23

CDN cluster selection
strategy
v challenge: how does CDN DNS select
“good” CDN node to stream to client
§ pick CDN node geographically closest to
client
pin
CDN
DNS)
§ IP anycast
v alternative: let client decide - give client
a list of several CDN servers
§ client pings servers, picks “best”
§ Netflix approach
Multmedia Networking 7-23

---

## Page 24

Case study: Netflix
v 30% downstream US traffic in 2011
v owns very little infrastructure, uses 3rd
party services:
•
azon
cloud
• create multiple version of movie
(different endodings) in cloud
• upload versions from cloud to CDNs
• Cloud hosts Netflix web pages for user
browsing
§ three 3rd party CDNs host/stream
N tfli
t
t
Ak
i Li
li ht
Multmedia Networking 7-24

---

## Page 25

Case study: Netflix
Multmedia Networking 7-25
1

1. Bob manages
Netflix account
Netflix registration,
acco
Amazon cloud
Akamai CDN
ht CDN
Level-3 CDN
2
Netflix video
3
4. DASH
streaming
upload copies of
multiple versions of
video to CDNs

---

## Page 26

Multimedia networking:
outline
7.1 multimedia networking
applications
7.2 streamin
o
7.4 pr
conversational      applications
7.5 network support for multimedia
Multmedia Networking 7-26

---

## Page 27

Voice-over-IP (VoIP)
Multmedia Networking 7-27
v VoIP end-end-delay requirement:
needed to maintain “conversational”
aspect
§ higher delay
air interactivity
§ > 4
§ includes application-level
(packetization,playout), network delays
v session initialization: how does callee
advertise IP address, port number,
encoding algorithms?
v value-added services: call forwarding,
screening, recording
v emergency services: 911

---

## Page 28

VoIP characteristics
v speaker’s audio: alternating talk spurts,
silent periods.
§ 64 kbps during talk spurt
§ pkts genera
talk spurts
of
v application-layer header added to each
chunk
v chunk+header encapsulated into UDP
or TCP segment
v application sends segment into socket
every 20 msec during talkspurt
Multmedia Networking 7-28

---

## Page 29

VoIP: packet loss, delay
v network loss: IP datagram lost due to
network congestion (router buffer
overflow)
v delay loss: I
rives too late
en
§ typical maximum tolerable delay: 400 ms
v loss tolerance: depending on voice
encoding, loss concealment, packet loss
rates between 1% and 10% can be
tolerated
Multmedia Networking 7-29

---

## Page 30

constant bit
               rate
transmission
Cumulative data
time
client
reception
       constant bit
     rate playout
 at client
client playout
delay
Delay jitter
v end-to-end delays of two consecutive
packets: difference can be more or less
than 20 msec (transmission time
difference)
Multmedia Networking 7-30

---

## Page 31

VoIP: fixed playout delay
v receiver attempts to playout each chunk
exactly q msecs after chunk was
generated.
§ chunk ha
: play out
t
v tradeoff in choosing q:
§ large q: less packet loss
§ small q: better interactive experience
Multmedia Networking 7-31

---

## Page 32

§ sender generates packets every 20 msec during ta
§ first packet received at time r
§ first playout schedule: begins at p
§ second playout schedule: begins at p’
Multmedia Networking 5-32
VoIP: fixed playout delay

---

## Page 33

Adaptive playout delay (1)
v goal: low playout delay, low late loss
rate
v approach: adaptive playout delay
adjustment:
§ sile
ed
§ chunks still played out every 20 msec
during talk spurt
v adaptively estimate packet delay:
(EWMA - exponentially weighted moving
average, recall TCP RTT estimate):
Multmedia Networking 7-33
di = (1-α)di-1 + α (ri – ti)
delay estimate
after ith packet
small constant,
e.g. 0.1
time received  - time sent
(timestamp)
measured delay of ith packet

---

## Page 34

v also useful to estimate average deviation of d
start
v for first packet in talk spurt, playout
time is:
     remaining packets in talkspurt are
played out     periodically
Multmedia Networking 5-34
vi = (1-β)vi-1 + β |ri – ti – di|
playout-timei = ti + di + Kvi
Adaptive playout delay (2)

---

## Page 35

Q: How does receiver determine whether
packet is first in a talkspurt?
v if no loss, receiver looks at successive
timestamps
v with
ok at
both time stamps and sequence numbers
§ difference of successive stamps > 20 msec
and sequence numbers without gaps --> talk
spurt begins.
Multmedia Networking 7-35
Adaptive playout delay (3)

---

## Page 36

VoiP: recovery from packet
loss (1)
Challenge: recover from packet loss given
small tolerable delay between original
transmission and playout
v each ACK/NAK
retr
 parity
in Ch. 5)
simple FEC
v for every group of n chunks, create redundant
chunk by exclusive OR-ing n original chunks
v send n+1 chunks, increasing bandwidth by
factor 1/n
v can reconstruct original n chunks if at most one
lost chunk from n+1 chunks with playout delay
Multmedia Networking 7-36

---

## Page 37

another FEC scheme:
v“piggyback lower
quality stream”
vsend lower resol
ve.g., n
stream PCM at 64 kbps
and redundant stream
GSM at 13 kbps
vnon-consecutive loss: receiver can conceal loss
vgeneralization: can also append (n-1)st and (n-2)nd lo
chunk
Multmedia Networking 7-37
VoiP: recovery from packet
loss (2)

---

## Page 38

interleaving to
conceal loss:
v audio chunks divided
into smaller units, e.g.
four 5 msec units per
20 msec audio chunk
v packet contains small
units from different
v if packet lost, still
have most of every
original chunk
v no redundancy
overhead, but
increases playout
delay
Multmedia Networking 7-38
VoiP: recovery from packet
loss (3)

---

## Page 39

Application Layer 2-39
overlay
    network
Voice-over-IP: Skype
v proprietary
application-layer
protocol (inferred
via reverse
engineering)
v
Skype clients (SC)
dire
other for VoIP call
§ super nodes (SN):
skype peers with
special functions
§ overlay network:
among SNs to locate
SCs
§ login server
N)

---

## Page 40

Application Layer 2-40
P2P voice-over-IP: skype
skype client
operation:

1. joins skype
network by
contacting SN (I
central
login server
3. obtains IP address
for callee from SN,
SN overlay
§or client buddy list
4. initiate call directly
to callee

---

## Page 41

Application Layer 2-41
v problem: both Alice,
Bob are behind
“NATs”
§ NAT prevents outside
peer from initiati
§ insid
connection to outside
v relay s
Bob maintain open
connection
    to their SNs
§ Alice signals her SN to
connect to Bob
§ Alice’s SN connects to
Bob’s SN
§ Bob’s SN connects to Bob
over open connection Bob
initially initiated to his SN
Skype: peers as relays

---

## Page 42

Multimedia networking:
outline
7.1 multimedia networking
applications
7.2 streamin
o
7.4 pr
conversational      applications:
RTP, SIP
7.5 network support for multimedia
Multmedia Networking 7-42

---

## Page 43

Real-Time Protocol (RTP)
v RTP specifies
packet structure
for packets
carrying audi
v
v RTP packet
provides
§ payload type
identification
§ packet sequence
numbering
§ time stamping
v RTP runs in end
systems
v RTP packets
psulated in
ty: if
two VoIP
applications run
RTP, they may be
able to work
together
Multmedia Networking 7-43

---

## Page 44

RTP runs on top of UDP
RTP libraries provide transport-layer interface
that extends UDP:
• port numbers, IP addresses
• ti
Multmedia Networking 5-44

---

## Page 45

RTP example
example: sending 64
kbps PCM-encoded
voice over RTP
v application c
20
bytes in a chunk
v audio chunk + RTP
header form RTP
packet, which is
encapsulated in
UDP segment
v RTP header
indicates type of
audio encoding in
ch packet
ference
v RTP header also
contains
sequence
numbers,
timestamps
Multmedia Networking 7-45

---

## Page 46

RTP and QoS
v RTP does not provide any mechanism to
ensure timely data delivery or other
QoS  guarantees
v RTP encapsul
n at end
§ rou
e,
making no special effort to ensure
that RTP packets arrive at destination
in timely matter
Multmedia Networking 7-46

---

## Page 47

RTP header
payload type (7 bits): indicates type of encoding
currently being
er
Paylo
Payload type 3: GSM, 13 kbps
Payload type 7: LPC, 2.4 kbps
Payload type 26: Motion JPEG
Payload type 31: H.261
Payload type 33: MPEG2 video
sequence # (16 bits): increment by one for each RTP
packet sent
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

v timestamp field (32 bits long): sampling
instant of firs
RTP data
§

for
25
usecs for 8 KHz sampling clock)
§ if application generates chunks of 160
encoded samples, timestamp increases by
160 for each RTP packet when source is
active. Timestamp clock continues to
increase at constant rate when source is
inactive.
v SSRC field (32 bits long): identifies source
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

RTSP/RTP programming
assignment
v build a server that encapsulates stored
video frames into RTP packets
§ grab video fr
eaders, create
§ incl
§ client RTP provided for you
v also write client side of RTSP
§ issue play/pause commands
§ server RTSP provided for you
Multmedia Networking 7-49

---

## Page 50

Real-Time Control Protocol
(RTCP)
v works in
conjunction with
RTP
v each particip
RTCP
packets to all other
participants
v each RTCP packet
contains sender
and/or receiver
rts

#

packets sent, #
packets lost,
interarrival jitter
v feedback used to
control performance
§ sender may modify
its transmissions
based on  feedback
Multmedia Networking 7-50

---

## Page 51

RTCP: multiple multicast
senders
veach RTP session: typically a single multicast
address; all RTP /RTCP packets belonging to session
use multicast address
vRTP, RTCP packets distinguished from each other via
distinct port numbers
vto limit traffic, each participant reduces RTCP traffic
as number of conference participants increases
Multmedia Networking 5-51
RTCP
RTP
sender

---

## Page 52

RTCP: packet types
receiver report
packets:
v fraction of packets
lost, last seque
sender
packets:
v SSRC of RTP stream,
current time, number
of packets sent,
number of bytes sent
source description
packets:
v e-mail address of
er, sender's
v provide mapping
between the SSRC
and the user/host
name
Multmedia Networking 7-52

---

## Page 53

RTCP: stream
synchronization
v RTCP can
synchronize different
media streams
within a RTP se
genera
stream for video, one for
audio.
v timestamps in RTP
packets tied to the
video, audio
sampling clocks
§ not tied to wall-
clock time
v each RTCP sender-
report packet
contains (for most
tly generated
f RTP
packet
§ wall-clock time for
when packet was
created
v receivers uses
association to
synchronize playout
of audio, video
Multmedia Networking 7-53

---

## Page 54

RTCP: bandwidth scaling
RTCP attempts to
limit its traffic to
5% of session
bandwidth
sendi
Mbps
v RTCP attempts to
limit RTCP traffic to
100 Kbps
v RTCP gives 75% of
rate to receivers;
remaining 25% to
sender
v 75 kbps is equally
shared among
receivers:
R receivers,  each
v sender gets to send
RTCP traffic at 25 kbps.
v participant determines
RTCP packet
transmission period by
calculating avg RTCP
packet size (across
entire session) and
dividing by  allocated
rate
Multmedia Networking 7-54

---

## Page 55

SIP: Session Initiation
Protocol [RFC 3261]
long-term vision:
v all telephone calls, video conference
calls take place over Internet
v people identi
 or e-mail
v can r
s),
no matter where callee roams, no
matter what IP device callee is currently
using
Multmedia Networking 7-55

---

## Page 56

SIP services
v SIP provides
mechanisms for
call setup:
§ for caller to
est
§ so caller, callee
can agree on
media type,
encoding
§ to end call
v determine current
IP address of
callee:
ps mnemonic
ent:
§ add new media
streams during
call
§ change encoding
during call
§ invite others
§ transfer, hold calls
Multmedia Networking 7-56

---

## Page 57

Example: setting up call to known
IP address
v Alice’s SIP invite
message indicates her
port number, IP address,
encoding she prefers to
 OK message
indicates his port
number, IP address,
preferred encoding
(GSM)
v SIP messages can be
sent over TCP or UDP;
here sent over RTP/UDP

v default SIP port
b
i
5060
Multmedia Networking 5-57

---

## Page 58

Setting up a call (more)
v codec negotiation:
§ suppose Bob
doesn’t have PCM
μlaw encoder
Acc
listing his encoders.
Alice can then send
new INVITE
message,
advertising different
encoder
v rejecting a call
§ Bob can reject
with replies
usy,” “gone,”
v media can be
sent over RTP or
some other
protocol
Multmedia Networking 7-58

---

## Page 59

Example of SIP message
INVITE sip:bob@domain.com SIP/2.0
Via: SIP/2.0/UDP 167.180.112.24
From: sip:alice@hereway.com
To: sip:bob@domain.com
Call-ID: a2e3a@pig
c=IN IP4 167.180.112.24
m=audio 38060 RTP/AVP 0
Notes:
v HTTP message syntax
v sdp = session description protocol
v Call-ID is unique for every call
v Here we don’t
know Bob’s IP
address

rs needed
 SIP
messages using
SIP default port
506
v Alice specifies
in header that
SIP client
sends, receives
SIP
Multmedia Networking 7-59

---

## Page 60

Name translation, user
location
v caller wants to call
callee, but only has
callee’s name or e-
mail address.
curre
§ user moves around
§ DHCP protocol
§ user has different IP
devices (PC,
smartphone, car
device)
v result can be based
on:
§ time of day (work,
e)
§ status of callee
(calls sent to
voicemail when
callee is already
talking to someone)
Multmedia Networking 7-60

---

## Page 61

SIP registrar
REGISTER
Via: SIP/2.0/UDP 193.64.210.89
From: sip:bob@domain.com
To: sip:bob@domain.com
Expires: 3600
v one function of SIP server: registrar
v when Bob starts SIP client, client sends
SIP REGISTER message to Bob’s registrar
r
Multmedia Networking 7-61

---

## Page 62

SIP proxy
v another function of SIP server: proxy
v Alice sends invite message to her proxy
server

call
s
v Bob sends response back through same
set of SIP proxies
v proxy returns Bob’s SIP response
message to Alice
§ contains Bob’s IP address
v SIP proxy analogous to local DNS server
plus TCP setup
Multmedia Networking 7-62

---

## Page 63

SIP example: <jim@umass.edu> calls
<keith@poly.edu>
Multmedia Networking 7-63
1

1. Jim sends INVITE
message to UMass
SIP proxy.
2. UMass proxy forwards request
 to Poly registrar server
2
3. Poly server returns redirect response,
ld  try <keith@eurecom.fr>
3
5. eurecom
registrar
forwards INVITE
to 197.87.54.21,
which is running
keith’s SIP client
5
8
6
7
6-8. SIP response returned to Jim
9
9. Data flows between clients
SIP p
Poly SIP
registrar
P
egistrar
197.87.54.21
128.119.40.186

---

## Page 64

Comparison with H.323
v H.323: another
signaling protocol for
real-time, interactive
multimedia
suite
multimedia
conferencing:
signaling,
registration,
admission control,
transport, codecs
v SIP: single
component. Works
with RTP, but does
not mandate it Can
v H.323 comes from
the ITU (telephony)
v
mes from
borrows much

flavor; H.323 has
telephony flavor
v SIP uses KISS
principle: Keep It
Simple Stupid
Multmedia Networking 7-64

---

## Page 65

Multimedia networking:
outline
7.1 multimedia networking
applications
7.2 streamin
o
7.4 pr
conversational      applications
7.5 network support for multimedia
Multmedia Networking 7-65

---

## Page 66

Network support for
multimedia
Multmedia Networking 7-66

---

## Page 67

Dimensioning best effort
networks
v approach: deploy enough link capacity so
that congestion doesn’t occur, multimedia
traffic flows
r loss
§ hig
v challenges:
§ network dimensioning: how much bandwidth is
“enough?”
§ estimating network traffic demand: needed to
determine how much bandwidth is “enough”
(for that much traffic)
Multmedia Networking 7-67

---

## Page 68

Providing multiple classes of
service
v thus far: making the best of best effort
service
§ one-size fits all service model
v alternative:
s of service
diff
s regular
service)
0111
v granularity:
differential service
among multiple
classes, not among
individual
connections
v history: ToS bits
Multmedia Networking 7-68

---

## Page 69

Multiple classes of service:
scenario
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

Scenario 1: mixed HTTP and
VoIP
v example:  1Mbps VoIP, HTTP share 1.5
Mbps link.
§ HTTP bursts can congest router, cause audio
loss
want to give
 over HTTP
packet marking needed for router to distinguish
between different classes; and new router policy to
treat packets accordingly
Principle 1
Multmedia Networking 7-70

---

## Page 71

Principles for QOS guarantees
(more)
v what if applications misbehave (VoIP sends higher than
declared rate)
§ policing: force source adherence to bandwidth
allocations
v marking, policing
provide protection (isolation) for one class from
others
Principle 2
1.5 Mbps link
pho
packet marking and policing
Multmedia Networking 7-71

---

## Page 72

v allocating fixed (non-sharable)
bandwidth to flow: inefficient use of
bandwidth if flows doesn’t use its
allocation
while providing isolation, it is desirable to u
resources as efficiently as possible
Principle 3
1.5 Mbps link
0.5 Mbps logical link
Multmedia Networking 7-72
Principles for QOS guarantees
(more)

---

## Page 73

Scheduling and policing
mechanisms
v scheduling: choose next packet to send on
link
v FIFO (first in first out) scheduling: send in
order of arriv
§ dis
queue:
wh
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

Scheduling policies:
priority
priority scheduling:
send highest
priority queued
packet
prior
§ class may depend
on marking or
other header info,
e.g. IP
source/dest, port
numbers, etc.
§ real world
example?
Multmedia Networking 7-74
high priority queue
(waiting area)
arrivals
y
departures
link
1
3
2
4
5
5
5
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

Scheduling policies: still
more
Round Robin (RR) scheduling:
v multiple classes
v cyclically scan class queues, sending
one complete
each class (if
v
Multmedia Networking 7-75
1
2
3
4
5
5
5
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
v each class gets weighted amount of
service in ea
Multmedia Networking 7-76
Scheduling policies: still
more

---

## Page 77

Policing mechanisms
goal: limit traffic to not exceed declared
parameters
Three common-used criteria:
v
§ cruc
ngth:
100 packets per sec or 6000 packets per min
have same average!
v peak rate: e.g., 6000 pkts per min (ppm)
avg.; 1500 ppm peak rate
v (max.) burst size: max number of pkts
sent consecutively (with no intervening
idle)
Multmedia Networking 7-77

---

## Page 78

Policing mechanisms:
implementation
token bucket: limit input to specified burst
size and average rate
v bucket can hold b tokens
v tokens generated at rate r token/sec
unless bucket full
v over interval of length t: number of
packets admitted less than or equal to  (r
t + b)
Multmedia Networking 7-78

---

## Page 79

Policing and QoS
guarantees
v token bucket, WFQ combine to provide
guaranteed upper bound on delay, i.e.,
QoS guarantee!
WFQ
bucket size, b
per-flow
rate, R
D     = b/R
max
traffic
Multmedia Networking 7-79
arriving
traffic

---

## Page 80

Differentiated services
v want “qualitative” service classes
§ “behaves like a wire”
§ relative service distinction: Platinum, Gold,
Silver
edge
§ signaling, maintaining per-flow router state
difficult with large number of flows
v don’t define define service classes,
provide functional components to build
service classes
Multmedia Networking 7-80

---

## Page 81

edge router:
v per-flow traffic management
v marks packets as in-profile and
out-profile
core router:
v per class traffic management
v buffering and scheduling based on
marking at edge
v preference given to in-profile
packets over out-of-profile packets
Diffserv architecture
Multmedia Networking 7-81
r
b
marking
scheduling
..

---

## Page 82

Edge-router packet
marking
v class-based marking: packets of different classes
marked differently
v intra-class marking: conforming portion of flow
marked differently than non-conforming one
v profile: pre-negotiated rate r, bucket size
b
v packet marking at edge based on per-
flow profile
possible use of
marking:
user packets
rate r
Multmedia Networking 5-82

---

## Page 83

Diffserv packet marking:
details
v packet is marked in the Type of Service
(TOS) in IPv4, and Traffic Class in IPv6
v 6 bits used for Differentiated Service
Code Point (
§ 2 b
Multmedia Networking 7-83
DSCP
unused

---

## Page 84

Classification, conditioning
may be desirable to limit traffic injection
rate of some class:
v user declares traffic profile (e.g., rate,
burst size)
Multmedia Networking 7-84

---

## Page 85

Forwarding Per-hop Behavior
(PHB)
v PHB result in a different observable
(measurable) forwarding performance
behavior
v PHB does not
mechanisms
v exam
§ class A gets x% of outgoing link bandwidth
over time intervals of a specified length
§ class A packets leave first before packets
from class B
Multmedia Networking 7-85

---

## Page 86

Forwarding PHB
PHBs proposed:
v expedited forwarding: pkt departure
rate of a clas
ceeds
v assu
ffic
§ each guaranteed minimum amount of
bandwidth
§ each with three drop preference partitions
Multmedia Networking 7-86

---

## Page 87

Per-connection QOS
guarantees
v basic fact of life: can not support traffic
demands beyond link capacity
call admission: flow declares its needs, netwo
block call (e.g., busy signal) if it cannot meet
Principle 4
1.5 Mbps link
1 Mbps
1 Mbps
phone
Multmedia Networking 7-87

---

## Page 88

QoS guarantee scenario
v resource reservation
§ call setup, signaling (RSVP)
§ traffic, QoS declaration
ent admission
§ QoS-sensitive scheduling
(e.g., WFQ)
request/
reply
Multmedia Networking 7-88

---

## Page 89

Multimedia networking:
outline
7.1 multimedia networking
applications
7.2 streamin
o
7.4 pr
conversational      applications
7.5 network support for multimedia
Multmedia Networking 7-89
