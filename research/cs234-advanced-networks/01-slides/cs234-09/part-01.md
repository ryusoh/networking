# cs234-09 - Part 01 (Pages 1-21)

---

## Page 1

CompSci 234/NetSys 210
Advanced Topics in Networking
Winter 2019
Unit 9: Peer-to-Peer
Networks
Cheng-Hsin Hsu (<chsu@cs.nthu.edu.tw>)
Slide adopted from Prof. Venkatasubramanian’s and Kurose/Ross’ book materials
1

---

## Page 2

Agenda
´Overview on P2P Networks
´P2P Applications
´Properties of P2P Systems
´Structured and Unstructured
P2P
´Distributed Hash Table (DHT)
2

---

## Page 3

Pure P2P Architectures
3
´ no always-on server
´ arbitrary end systems directly
communicate
´ peers are intermittently
connected and change IP
addresses
examples:
´ file distribution (BitTorrent)
´ Streaming (Xunlei Kankan)
´ VoIP (Skype)

---

## Page 4

What is the Overlay Network?
4
Applications
Overlay Network
Physical Network

---

## Page 5

File Dissemination Under
Different Architectures
5
Question: how much time to distribute file (size F)
from one server to N  peers?
´ peer upload/download capacity is limited resource
us
uN
dN
server
Network (with abundant
bandwidth)
file, size F
us: server upload
capacity
ui: peer i upload
capacity
di: peer i download
capacity
u2
d2
u1
d1
di
ui

---

## Page 6

File Dissemination with Client-
Server
6
´ server transmission: must
sequentially send (upload) N
file copies:
´ time to send one copy: F/us
´ time to send N copies: NF/us
increases linearly in N
time to  distribute F
to N clients using
client-server approach Dc-s > max{NF/us,,F/dmin}
´ client: each client must download file
copy
´ dmin = min client download rate
´ min client download time: F/dmin
us
Network
di
ui
F

---

## Page 7

File Dissemination with P2P
7
´ server transmission: must
upload at least one copy
´time to send one copy: F/us
time to  distribute F
to N clients using
P2P approach
us
Network
di
ui
F
DP2P > max{F/us,,F/dmin,,NF/(us + Sui)}
´ client: each client must download file
copy
´ min client download time: F/dmin
´ clients: as aggregate must download NF bits
´max upload rate (limiting max download rate) is us + Sui
… but so does this, as each peer brings service capacity
increases linearly in N …

---

## Page 8

Sample Comparison Results:
Client-Server versus P2P
8
0
0.5
1
1.5
2
2.5
3
3.5
0
5
10
15
20
25
30
35
N
Minimum Distribution Time
P2P
Client-Server
client upload rate = u,  F/u = 1 hour,  us = 10u,  dmin ≥ us

---

## Page 9

Sample Application: BitTorrent
9
tracker: tracks peers
participating in torrent
torrent: group of peers
exchanging  chunks of a file
Alice arrives  …
§ file divided into 256Kb chunks
§ peers in torrent send/receive file chunks
… obtains list
of peers from tracker
… and begins exchanging
file chunks with peers in torrent

---

## Page 10

Peers Joining/Leaving
BitTorrent
10
´ peer joining torrent:
´has no chunks, but will
accumulate them over time
from other peers
´registers with tracker to get
list of peers, connects to
subset of peers (neighbors)
´while downloading, peer uploads chunks to other peers
´peer may change peers with whom it exchanges chunks
´churn: peers may come and go
´once peer has entire file, it may (selfishly) leave or
(altruistically) remain in torrent

---

## Page 11

Requesting/Sending Chunks
in BitTorrent
11
requesting chunks:
§ at any given time, different
peers have different subsets
of file chunks
§ periodically, Alice asks each
peer for list of chunks that
they have ß availability
map
§ Alice requests missing
chunks from peers, rarest first
sending chunks: tit-for-tat:
§ Alice sends chunks to those four
peers currently sending her chunks
at highest rate
§ other peers are choked by
Alice (do not receive chunks
from her)
§ re-evaluate top 4 every 10 secs
§ every 30 secs: randomly select
another peer, starts sending
chunks
§ optimistically unchoke this
peer
§ newly chosen peer may join
top 4

---

## Page 12

Why do We Need tit-for-tat?
12
(1) Alice optimistically unchokes Bob
(2) Alice becomes one of Bobs top-four providers; Bob reciprocates
(3) Bob becomes one of Alices top-four providers
higher upload rate: find better
trading partners, get file faster !
Key of the success of BitTorrent

---

## Page 13

Summary: How BitTorrent
Work (at Very High Level)
13
P2P
System
Alice
Bob
0. Registers
files including
“ Hey Jude”

1. Where is
“ Hey Jude” ?
2. List of
peers having
“ Hey Jude”
3. Gets “ Hey
Jude” from Bob

---

## Page 14

Agenda
´Overview on P2P Networks
´P2P Applications
´Properties of P2P Systems
´Structured and Unstructured
P2P
´Distributed Hash Table (DHT)
14

---

## Page 15

A Partial List of P2P
Applications
15

---

## Page 16

Classes of P2P Applications
´ Search, File Sharing and Content
dissemination
´ Napster, Gnutella, Kazaa, eDonkey, BitTorrent
´ Chord, CAN, Pastry/Tapestry, Kademlia,
´ Bullet, SplitStream, CREW, FareCAST
´ Communications
´ MSN, Skype, Social Networking Apps
´ Storage
´ OceanStore/POND, CFS (Collaborative
FileSystems),TotalRecall, FreeNet, Wuala
´ Distributed Computing
´ Seti@home
´ Q: Can you think of anything else?
16

---

## Page 17

P2P/Grid Distributed Processing
and Crowdsouring
´ seti@home
´ Search for Extraterrestrial intelligence
´ Central site collects radio telescope data
´ Data is divided into work chunks of 300 Kbytes
´ User obtains client, which runs in background
´ Peer sets up TCP connection to central computer,
downloads chunk
´ Peer does FFT on chunk, uploads results, gets new
chunk
´ Not P2P communication, but exploit Peer
computing power
´ Crowdsourcing – Human-oriented P2P
17

---

## Page 18

Agenda
´Overview on P2P Networks
´P2P Applications
´Properties of P2P Systems
´Structured and Unstructured
P2P
´Distributed Hash Table (DHT)
18

---

## Page 19

Characteristics of P2P
Systems
´ Exploit edge resources
´Storage, content, CPU, Human presence
´ Significant autonomy from any centralized
authority
´Each node can act as a Client as well as a
Server
´ Resources at edge have intermittent connectivity,
constantly being added & removed
´Infrastructure is untrusted and the components
are unreliable ß main weakness….
19

---

## Page 20

Promising Points of P2P
´Self-organizing
´Massive scalability
´Autonomy: non single point of
failure
´Resilience to Denial of Service
´Load distribution
´Resistance to censorship
20

---

## Page 21

Revisit Overlay Networks
21
´ Tremendous design flexibility
´ Topology, maintenance
´ Message types
´ Protocol
´ Messaging over TCP or UDP
´ Underlying physical network
is transparent to developer
´ But some overlays exploit
proximity ß example: reducing
RTT among gamers
