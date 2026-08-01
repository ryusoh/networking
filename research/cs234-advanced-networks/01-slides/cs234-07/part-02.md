# cs234-07 - Part 02 (Pages 22-41)

---

## Page 22

Real-Time Transport in
WebRTC
´RTP: Real-Time Transport Protocol
´RTCP: RTP Control Protocol
´Published in 1996 as RFC 1889, and
superseded by RFC 3550 in 2003
´UDP, binary
´Transmission direction:
´RTP: from server to client (receiver)
´RTCP: either way (SR, RR)
22

---

## Page 23

Session Control in WebRTC
´RTSP: Real-Time Streaming Protocol
´Published as RFC 2326 in 1998
´TCP, text
´Transmission direction:
´Initiation from client, response by server
´“VCR”-type commands: PLAY, PAUSE,
RECORD, TEARDOWN, …
´Session initiation: DESCRIBE, SETUP
23

---

## Page 24

Protocol Suite
24
• Flow diagram: RTP, RTCP, RTSP
Sender
Receiver
RTSP
RTP
RTCP
Commands, e.g.: “Play”
Media Flow
Status Information,
Transmission Statistics,
Quality of Service (QoS)

---

## Page 25

Real-Time Control Protocol
(RTCP) Overview
´ Provides
´ receiver’s feedback
´ network conditions
´ time synchronization
´ receiver’s description
´ Packet types
´ Sender’s Report (SR)
´ Receiver’s Report (RR)
´ Source Description (SDES)
´ Application Specific (APP)
´ BYE
´ RCTP scaling: limit RTCP traffic to 5% of bandwidth; limit
RR to 1.25%
25

---

## Page 26

Receiver Reports Contain…
´Statistics
´Number of lost packets
´% of lost packets
´Inter-arrival jitter
´Timestamp of last SR
´Delay since last SR
´Which can be used to derive
´Packet Loss Rate
´Interarrival Jitter
´Round Trip Time
26

---

## Page 27

Example: RTT Calculation
27
tLSR
tDLSR
SR
RR
Calc RTT
RTT: 6.125 s – 5.250 s =
0.875 s
Sender
Receiver
Q: Who (server or client) calculate
this (and other stats)?

---

## Page 28

Real-Time Transport (RTP)
Protocol  Overview
Q:  Why do we need RTP Payload Header?
28
RTP Header
RTP Payload
Header
RTP Payload
12 bytes
4-12 bytes
≤ Rest of IP packet

---

## Page 29

´ 9 bits: protocol version, alignment,
header extension, CSRC length, marker
RTP Header
29

---

## Page 30

´ Payload type: 7 bits
´Identify content
´E.g. 14: mp3; 32: MPEG-1
RTP Header
30

---

## Page 31

RTP Header
´Sequence number: 16 bits
´Packet sequence number
31

---

## Page 32

RTP Header
´ Media timestamp: 32 bits
´ The instant when the first byte in this packet
was captured
´ 90 kHz timestamp (90,000 = 1 second)
´ Note: timestamps for audio and video
trackers are in different time scale ß Why?
32

---

## Page 33

RTP Header
´ SSRC: 32 bits
´Random, unique in a session
´Identifies a source (not host!)
33

---

## Page 34

RTP Header
´ Marker bit:
´Depends on payload
´E.g., beginning of frame
34

---

## Page 35

What Clients Do After
Receiving an RTP Packet?
´Check SSRC
´New source?
´Existing source? which one?
´Check payload type
´Has format been changed?
´Which decoder should I use?
35

---

## Page 36

Real-Time Streaming Protocol
(RTSP) Overview
´ Application-level protocol for establishing
and controlling media sessions with real-
time properties between end points control
´ Simple, text-based
´ Published in RFC 2326 (1998)
´ Uses TCP
´ Standard port: 554
´ Allows VCR-type commands:
´ DESCRIBE, SETUP, PLAY, TEARDOWN, PAUSE,
RECORD, OPTIONS
36

---

## Page 37

Sample RTSP
Request/Response
37
DESCRIBE rtsp://genesis/hackers.mov RTSP/1.0
RTSP/1.0 200 OK
Server: QTSS/v96
Cseq:
Content-Type: application/sdp
Content-Base: rtsp://genesis/hackers.mov/
Content-length: 179
v=0
s=hackers.mov
u=<http://genesis.usc.edu/>
e=<admin@genesis.usc.edu>
c=IN IP4 128.125.163.19
a=control:/
a=range:npt=0-3714.90167
m=audio 0 RTP/AVP 10
a=control:trackID=2

---

## Page 38

Application Level Framing
´ How/When to send/recv?
´ Let the application decide, not the protocol stack
´ Applications know
´ How to reorder packets
´ Whether to ignore loss
´ Which packet to retransmit
´ Application Data Unit (ADU)
´ Can be processed individually, even out-of-order
´ Unit of error-recovery
´ 8-Bit PCM audio:  1 ADU = 1 Byte
´ MPEG(1, 2, …) Video:  1 ADU = 1 Slice
´ Ideally, 1 ADU in 1 packet ß Why?
38

---

## Page 39

Agenda
´DASH Overview
´ABR: Adaptive Bitrate
Allocation
´WebRTC and  Underlaying
Protocols (RTP, RTCP, RTSP)
´DASH versus RTP
39

---

## Page 40

DASH versus RTP
40
DASH
RTP
Transport Protocol
TCP
UDP
Latency
long
short
Media unit
segment
packet
Topology
client-server
peer-to-peer
Codec
many
many
Caching
yes (web caches)
no
Applications
VoD, 1-way live
VoIP, video
conferencing

---

## Page 41

41
Questions
<chsu@cs.nthu.edu.tw>
