# cs234-05 - Part 01 (Pages 1-23)

---

## Page 1

CompSci 234/NetSys 210
Advanced Topics in Networking
Winter 2019
Unit 5: Multimedia
Networking Principle
Cheng-Hsin Hsu (<chsu@cs.nthu.edu.tw>)
Slide adopted from Profs. Ooi and Zimmerman, and Ross’ materials
1

---

## Page 2

Agenda
´Media Streaming
´Video Quality Metrics
´Network Communication
Models
´Different Transport Protocols
´Multimedia Friendly Internet
2

---

## Page 3

Networked Media Applications
´ Live Webcast and IPTV
´Twitch, …
´ Pre-recorded Webcast
´YouTube, …
´ Video Conferencing
´Skype, …
´ Video on Demand
´Netflix, …
3
Interactive
Non-Interactive
Live
Video
Conferencing
Webcasts
Pre-
recorded
Computer
Games
Lecture/Video
on Demand

---

## Page 4

Unique Requirements of
Media Streaming
´Plenty of bandwidth
´Low latency
´Bounded latency
´Reliable networks
´But, Internet was designed as
a best-effort  network
4

---

## Page 5

Bird's-Eye View of Media
Streaming
5
Network
Encoder
Sender
Middlebox
Receiver
Decoder

---

## Page 6

Challenges: Codec and
Networking
6
´Network Communication Model
´Media Compression
Network
Encoder
Sender
Middlebox
Receiver
Decoder

---

## Page 7

Challenges: Sender
7
´Adaptation
´RTP conversational streaming
´Video on Demand, MPEG-DASH
Network
Encoder
Sender
Middlebox
Receiver
Decoder

---

## Page 8

Challenges: Receiver
8
´Buffering
´Audio/Video Synchronization
´Packet Loss Recovery
Network
Encoder
Sender
Middlebox
Receiver
Decoder

---

## Page 9

Challenges: Middlebox
9
´Caching
´Application-Level Multicast
´Media-Aware Network Elements
Network
Encoder
Sender
Middlebox
Receiver
Decoder

---

## Page 10

Agenda
´Media Streaming
´Video Quality Metrics
´Network Communication
Models
´Different Transport Protocols
´Multimedia Friendly Internet
10

---

## Page 11

How to Quantify Video
(Media) Quality
´Basic concepts
´Quality of Service (QoS)
´Quality of Experience (QoE)
´Resource reservation
´End-to-end path must respond
to real-time requirements and
provide a certain level of
service quality
11

---

## Page 12

QoS vs QoE
´ QoS – Quality of Service:
´Network characteristics/behavior
´Performance guarantees given by network provider
based on measurements
´ QoE – Quality of Experience:
´Impact of network behavior on end user s
´some imperfections may go unnoticed
´some imperfections may render application useless
´Not captured by network measurements
´a 5% packet loss could be invisible if it affects
background
´a missed target due to a 100ms delay can affect
game outcome
12

---

## Page 13

Possible QoE/QoS Factors
´Startup delay
´Stall events (number and
duration)
´Visual quality measure:
´PSNR: Peak Signal-to-Noise Ratio
´SSIM, SSIMPlus Index: try to model
human visual perception
´Quality switches
13
Rehman, K. Zeng and Z. Wang,
“Display device-adapted video quality-of-experience assessment,”
IS&T-SPIE Electronic Imaging, Human Vision and Electronic Imaging XX, Feb. 2015.

---

## Page 14

Sample Metric: Peak-Signal
to Noise Ratio (PSNR)
´ Mean Square Error (MSE):
´M, N: Columns and rows, i.e., pixels
´ PSNR:
´R: input value domain range, e.g., 255
14

---

## Page 15

Real-time Requirements (of
Video)
´Periodic sampling: streams
´Affects scheduling policy
´Fault tolerance
´Missed deadlines
´Imperfect playout, e.g., frozen video
´Bandwidth demand
´Bandwidth versus quality tradeoff
15

---

## Page 16

Service and Protocol
Requirements
´Time-sensitive requirements
´High data throughput
requirements
´Service guarantee requirements
´High or partial reliability
requirements
´Cost-based fairness
requirements
16

---

## Page 17

Resource Reservation
´Proper resource management helps to
establish desired QoS/QoE (memory,
bandwidth, CPU, …)
´E.g.: network bandwidth: Circuit-switched
versus Packet-switched
´Rule of Thumb
´E.g.: In circuit-switched telephone system
“silence” will consume bandwidth
17
Shared resources can often be
more (cost-) effectively used
compared with dedicated resources

---

## Page 18

Reality on Offering Media
Services with High-QoS/QoE
´(Networked) multimedia systems
have certain requirements
´Best-effort, shared network:
Internet
´Non real-time OS: Windows,
Linux
18
But, we have
Need to find clever techniques

---

## Page 19

Agenda
´Media Streaming
´Video Quality Metrics
´Network Communication
Models
´Different Transport Protocols
´Multimedia Friendly Internet
19

---

## Page 20

Let’s Talk About Networks
(Network and Transport Layers)
20
Network
Encoder
Sender
Middlebox
Receiver
Decoder

---

## Page 21

Comm. Model: Unicast
21
Traditional applications:
One-to-One
Receiver
Sender

---

## Page 22

Comm. Model: Multicast
(1/3)
22
Media applications:
One-to-Many
Sender
Receivers

---

## Page 23

Comm. Model: Multicast
(2/3)
23
Media applications:
Many-to-Many
Mesh topology
