# cs234-07 - Part 01 (Pages 1-21)

---

## Page 1

CompSci 234/NetSys 210
Advanced Topics in Networking
Winter 2019
Unit 7: DASH and RTP
Streaming
Cheng-Hsin Hsu (<chsu@cs.nthu.edu.tw>)
Slide adopted from Profs. Ooi and Zimmerman, and Timmerers’ materials
1

---

## Page 2

Agenda
´DASH Overview
´ABR: Adaptive Bitrate
Allocation
´WebRTC and  Underlaying
Protocols (RTP, RTCP, RTSP)
´DASH versus RTP
2

---

## Page 3

Where Did DASH Come
From?
´ Video not accessible
´ Behind a firewall
´ Plugin not available
´ Bandwidth not sufficient
´ Wrong/non-trusted
device
´ Wrong format
´ Fragmentation
´ Devices
´ Content Formats
´ DRMs
´ Low Quality of Experience
´ Long start-up delay
´ Frequent Re-buffering
´ Low playback quality
´ No lip-sync
´ No DVD quality
(language, subtitle)
´ Expensive
´ Sucks my bandwidth
´ Need a dedicated
devices
´ Other costs…
3
To resolve the user frustration ➪Open Standards

---

## Page 4

HTTP Streaming of Media
4
Server
MF
DF
ISOBM
FF
M2TS
easy
conversion
MF
DF
ISOBM
FF
M2TS
Client
easy
conversion
1
2
ISOBMFF … ISO Base Media File Format (e.g., mp4 – others: avi)
M2TS … MPEG-2 Transport Stream (e.g., DVB, DMB)
MF … Manifest Format (e.g., MPD, FMF)
DF … Delivery Format (e.g., F4F, 3gs)

---

## Page 5

(Earlier) Proprietary Solutions
5

---

## Page 6

Dynamic Adaptive
Streaming over HTTP (DASH)
6

---

## Page 7

What Are (Aren’t) Specified
in the Standard
7

---

## Page 8

DASH Data Model
8
Segment Info
Initialization Segment
<http://www.e.com/ahs-5.3gp>
Media Presentation
Period, start=0s
…
Period, start=100s
…
Period, start=295s
…
…
Period,
•start=100
•baseURL=<http://www.e.com/>
Representation 1
500kbit/s
…
Representation 2
100kbit/s
…
Representation 1
•bandwidth=500kbit/s
•width 640, height 480
Segment Info
duration=10s
Template:
./ahs-5-$Index$.3gs
…
Media Segment 1
start=0s
<http://www.e.com/ahs-5-1.3gs>
Media Segment 2
start=10s
<http://www.e.com/ahs-5-2.3gs>
Media Segment 3
start=20s
<http://www.e.com/ahs-5-3.3gh>
Media Segment 20
start=190s
<http://www.e.com/ahs-5-20.3gs>

---

## Page 9

Media Presentation
Description (MPD)
´ Info for choosing groups or representations
´ codec, DRM, language, resolution, bandwidth
´ Access and Timing Information
´ HTTP-URL(s) and byte range for each accessible Segment
´ Earliest next update of the MPD on the server
´ Segment availability start and end time in wall-clock time
´ Approximated media start time and duration of a Media
Segment in the media presentation timeline
´ For live service, instructions on starting playout such that
media segments will be available in time for smooth playout
in the future
´ Info for switching across representations
9

---

## Page 10

DASH Groups and Subsets
10
Group by codec, language, resolution, bandwidth,
views, etc. – very flexible (in combination with xlink)!
§
Ranges for the @bandwidth, @width, @height and
@frameRate
Group id="grp-1"
Representation id="rep-1"
. . .
Representation id="rep-2"
Representation id="rep-n"
Group id="grp-2"
Representation id="rep-1"
. . .
Representation id="rep-2"
Representation id="rep-n"
. . .
Subset id="ss-1"
Contains group="grp-1"
Contains group="grp-4"
Contains group="grp-7"
Subsets
§ Mechanism to restrict the combination of
active Groups
§ Expresses the intention of the creator of the
Media Presentation

---

## Page 11

Segment Index
´ Hierarchical binary info on
´ Accessible units of data in a media segment
´ Each unit is described by
´Byte range in the segments (easy access through HTTP
partial GET)
´Accurate presentation duration (seamless switching)
´Presence of representation access positions, e.g. IDR
frames
´ Provides a compact bitrate-over-time profile to
client
´ Generic Data Structure usable for any media
segment format, e.g. ISO BMFF, MPEG-2 TS,
MP4, and etc.
11

---

## Page 12

Different Segment Index
Approaches
12
Segment Index in MPD only
Segment Index in MPD + Segment
Segment Index in Segment only
<MPD>
...
<URL sourceURL="seg1.mp4"/>
<URL sourceURL="seg2.mp4"/>
</MPD>
seg1.mp4
seg2.mp4
...
<MPD>
...
<URL sourceURL="seg.mp4" range="0-499"/>
<URL sourceURL="seg.mp4" range="500-999"/>
</MPD>
seg.mp4
<MPD>
...
<Index sourceURL="idx.mp4"/>
<URL sourceURL="seg.mp4"/>
</MPD>
seg.mp4
idx.
mp4
<MPD>
...
<BaseURL>seg.mp4</BaseURL>
</MPD>
seg.mp4
idx

---

## Page 13

Summary: DASH Streaming
´ Asynchronous delivery of the same content to many
users is a first-class network service
´ HTTP CDNs may not be the “perfect” architecture, but it’s
working pretty well at scale
´ Naturally traverse through NAT, Firewall, and Gateway boxes
´ DASH is simple: Fits market needs!
´ Some parameters/designs need to be carefully
chosen/done
13

---

## Page 14

Agenda
´DASH Overview
´ABR: Adaptive Bitrate
Allocation
´WebRTC and  Underlaying
Protocols (RTP, RTCP, RTSP)
´DASH versus RTP
14

---

## Page 15

Rate Adaptation Problem
15
Pick segments and request timing to minimize re-
buffering events and maximize quality
Q: Who (server or client) is making this decision?

---

## Page 16

Client Side Bit Rate Adaptation
16
Q: What are the KEY inputs to the bitrate
adaptation algorithms?

---

## Page 17

Two Main Approaches and
Potential Issues
´Bandwidth based algorithms
´Bandwidth estimation is inherently hard
´Each client works alone => unfairness,
congestion
´Heterogeneous devices with various
capabilities?
´May suffer from buffer starvation and low QoE
´Buffer-level based algorithms
´Frequent bitrate switch à low QoE
´Slower reactions to rapid/sudden bandwidth
changes
´Other approaches?
17

---

## Page 18

Other Adaptive Bitrate
Allocation Approaches
´ Server side approaches
´ Centralized decision at the streaming servers
´ In-network adaptations (with MANE)
´ Some intermediate network equipment participate in
the adaptations
´ E.g., if the downstream network is congested why
bother to send the segment which will be late
anyway?
´ Other tools that have been thrown in
´ Scalable video coding (SVC): Layered Coding or
Multiple Description Coding
´ Software-Defined Networking
18

---

## Page 19

Agenda
´DASH Overview
´ABR: Adaptive Bitrate
Allocation
´WebRTC and  Underlaying
Protocols (RTP, RTCP, RTSP)
´DASH versus RTP
19

---

## Page 20

Limitations of DASH
Streaming
´ DASH has a number of advantages
´ Server is simple, i.e., regular web server
´ No firewall problems (use port 80 for HTTP)
´ Web caching works (this is very tricky for UDP, Why?)
´ However, DASH sends segments, typically 2-10 sec long
´ DASH client has to buffer a few segments, and does
not:
´ Provide low latency for interactive, two-way applications
(e.g., video conferencing)
´ Presentational versus conversational video services
20

---

## Page 21

Alternate Solution: WebRTC
21
• Web browsers with Real-Time Comm. (RTC)
capabilities via simple JavaScript APIs
• Pipeline for video conferencing in WebRTC
(only one-way shown):
© Muaz Khan
RTP/RTCP
