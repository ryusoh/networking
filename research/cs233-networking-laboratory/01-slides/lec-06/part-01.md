# lec-06 - Part 01 (Pages 1-44)

---

## Page 1

Computer
Networking: A Top
Down Approach
A note on the use of these Powerpoint slides:
Were making these slides freely available to all (faculty, students, readers).
They’re in PowerPoint form so you see the animations; and can add, modify,
and delete slides  (including this one) and slide content to suit your needs.
They obviously represent a lot of work on our part. In return for use, we only
ask the following:
§ If you use these slides (e.g., in a class) that you mention their source
(after all, wed like people to use our book!)
§ If you post any slides on a www site, that you note that they are adapted
from (or perhaps identical to) our slides, and note our copyright of this
material.
Thanks and enjoy!  JFK/KWR
All material copyright 1996-2016
J.F Kurose and K.W. Ross, All Rights Reserved
7th edition
Jim Kurose, Keith Ross
Pearson/Addison Wesley
April 2016
Chapter 3
Transport Layer
Transport Layer 2-1

---

## Page 2

Transport Layer 3-2
Chapter 3: Transport Layer
our goals:
§ understand principles
behind transport
layer services:
• multiplexing,
demultiplexing
• reliable data transfer
• flow control
• congestion control
§ learn about Internet
transport layer protocols:
• UDP: connectionless
transport
• TCP: connection-oriented
reliable transport
• TCP congestion control

---

## Page 3

Transport Layer 3-3
Chapter 3 outline
3.1 transport-layer
services
3.2 multiplexing and
demultiplexing
3.3 connectionless
transport: UDP
3.4 principles of reliable
data transfer
3.5 connection-oriented
transport: TCP
• segment structure
• reliable data transfer
• flow control
• connection management
3.6 principles of congestion
control
3.7 TCP congestion control

---

## Page 4

Transport Layer 3-4
Transport services and protocols
§ provide logical communication
between app processes
running on different hosts
§ transport protocols run in
end systems
• send side: breaks app
messages into segments,
passes to  network layer
• rcv side: reassembles
segments into messages,
passes to app layer
§ more than one transport
protocol available to apps
• Internet: TCP and UDP
application
transport
network
data link
physical
logical end-end transport
application
transport
network
data link
physical

---

## Page 5

Transport Layer 3-5
Transport vs. network layer
§ network layer: logical
communication
between end
devices (hosts)
§ transport layer:
logical
communication
between processes
• relies on, enhances,
network layer
services
Postal service – sending and
receiving letters to homes:
§ hosts => homes
§ processes => people living
in the homes
§ application messages =>
letters in envelopes
§ transport protocol => sort
the letters by name to the
people in the homes
§ network-layer protocol =>
postal service delivery
human analogy:

---

## Page 6

6
Orientation
§ Where is the transport layer?
Application
Layer
Network
Layer
Link Layer
IP
ARP
Hardware
Interface
RARP
Media
ICMP
IGMP
Transport
Layer
TCP
UDP
User
Process
User
Process
User
Process
User
Process

---

## Page 7

Transport Layer 3-7
Internet transport-layer protocols
§ reliable, in-order
delivery (TCP)
• congestion control
• flow control
• connection setup
§ unreliable, unordered
delivery: UDP
• no-frills extension of
best-effort IP
§ services not available:
• delay guarantees
• bandwidth guarantees
application
transport
network
data link
physical
application
transport
network
data link
physical
network
data link
physical
network
data link
physical
network
data link
physical
network
data link
physical
network
data link
physical
network
data link
physical
network
data link
physical
logical end-end transport

---

## Page 8

Transport Layer 3-8
Chapter 3 outline
3.1 transport-layer
services
3.2 multiplexing and
demultiplexing
3.3 connectionless
transport: UDP
3.4 principles of reliable
data transfer
3.5 connection-oriented
transport: TCP
• segment structure
• reliable data transfer
• flow control
• connection management
3.6 principles of congestion
control
3.7 TCP congestion control

---

## Page 9

9
Port Numbers
§ UDP and TCP use port numbers to identify connections
between end user processes
§ A globally unique address at the transport layer (for both
UDP and TCP) is the tuple <IP address, port number>
§ 16 bits are reserved for port numbers in the header -->
216 = 65,535 ports per host.
IP
TCP
UDP
User
Process
Demultiplex
based on
Protocol field in IP
header
User
Process
User
Process
User
Process
User
Process
User
Process
Demultiplex
based on
port number

---

## Page 10

Transport Layer 3-10
Multiplexing/demultiplexing
process
socket
use header info to deliver
received segments from P3, P4
to correct socket using port #s
demultiplexing at receiver:
handle data from multiple
Sockets (P1,P2), add transport
header (includes port #s for
demultiplexing)
multiplexing at sender:
transport
application
physical
link
network
P2
P1
transport
application
physical
link
network
P4
transport
application
physical
link
network
P3

---

## Page 11

Transport Layer 3-11
How demultiplexing works
§ host receives IP datagrams
• each datagram has source IP
address, destination IP
address and protocol type
• each datagram carries one
transport-layer segment
• each segment has source
and destination port number
§ host uses IP addresses,
protocol field & port numbers
to receive data and direct
segment to appropriate
socket in transport layer
(TCP or UDP)
source port #
dest port #
32 bits
application
data
(payload)
other header fields
TCP/UDP segment format

---

## Page 12

Transport Layer 3-12
Connectionless (UDP) demultiplexing
§ create a socket w host-local
(origin) port #:
DatagramSocket mySocket1
= new DatagramSocket(12534);
§ when host receives UDP
segment:
• checks destination port #
in segment
• directs UDP segment to
socket with that port #
§ when creating datagram
to send into UDP socket,
must specify
• destination IP address
• destination port #
IP datagrams with same
dest. port #, but different
source IP addresses
and/or source port
numbers will be directed
to same socket at
destination

---

## Page 13

Transport Layer 3-13
Connectionless demux: example
transport
application
physical
link
network
P3
transport
application
physical
link
network
P1
transport
application
physical
link
network
P4
source port: 9157
dest port: 6428
source port: 6428
dest port: 9157
source port: ?
dest port: 5775
source port: 5775
dest port: ?
What is ?

---

## Page 14

Transport Layer 3-14
Connection-oriented TCP demux
§ TCP socket identified
by 4-tuple:
• source IP address
• source port number
• dest IP address
• dest port number
§ demux: receiver uses all
four values to direct
segment to appropriate
socket
§ server host may support
many simultaneous TCP
sockets:
• each socket identified by
its own 4-tuple
§ e.g., web servers have
different sockets for
each connecting client
• e.g., (non-persistent)
HTTP will have different
socket for each request

---

## Page 15

Transport Layer 3-15
Connection-oriented demux: example
transport
application
physical
link
network
P3
transport
application
physical
link
P4
transport
application
physical
link
network
P2
source IP,port: A,9157
dest IP, port: B,80
source IP,port: B,80
dest IP,port: A,9157
host: IP
address A
host: IP
address C
network
P6
P5
P3
source IP,port: C,5775
dest IP,port: B,80
source IP,port: C,9157
dest IP,port: B,80
three segments, all destined to IP address: B,
dest port: 80 are demultiplexed to different sockets
server: IP
address B

---

## Page 16

Transport Layer 3-16
Connection-oriented demux: example
transport
application
physical
link
network
P3
transport
application
physical
link
transport
application
physical
link
network
P2
source IP,port: A,9157
dest IP, port: B,80
source IP,port: B,80
dest IP,port: A,9157
host: IP
address A
host: IP
address C
server: IP
address B
network
P3
source IP,port: C,5775
dest IP,port: B,80
source IP,port: C,9157
dest IP,port: B,80
P4
threaded server

---

## Page 17

Transport Layer 3-17
Chapter 3 outline
3.1 transport-layer
services
3.2 multiplexing and
demultiplexing
3.3 connectionless
transport: UDP
3.4 principles of reliable
data transfer
3.5 connection-oriented
transport: TCP
• segment structure
• reliable data transfer
• flow control
• connection management
3.6 principles of congestion
control
3.7 TCP congestion control

---

## Page 18

Transport Layer 3-18
UDP: User Datagram Protocol [RFC 768]
§ no frills, bare bones
Internet transport
protocol
§ best effort service, UDP
segments may be:
• lost
• delivered out-of-order
to app
§ connectionless:
• no handshaking
between UDP sender,
receiver
• each UDP segment
handled independently
of others
§ UDP use:
§ streaming multimedia
apps (loss tolerant, rate
sensitive)
§ DNS
§ SNMP
§ need reliable transfer
over UDP?
§ add reliability at
application layer
§ application-specific error
recovery!

---

## Page 19

Transport Layer 3-19
UDP: segment header
source port #
dest port #
32 bits
application
data
(payload)
UDP segment format
length
checksum
length, in bytes of
UDP segment,
including header
§ demuxing
why not use TCP?
§ no connection establishment
(which can add delay)
§ simple: no connection state
at sender, receiver
§ small header size
§ no congestion control: UDP
can blast away as fast as
desired
why use UDP?

---

## Page 20

Transport Layer 3-20
UDP checksum
sender:
§ treat segment contents,
including header fields,
as sequence of 16-bit
integers
§ checksum: ones
complement sum of
segment contents
§ sender puts checksum
value into UDP checksum
field
receiver:
§ compute checksum of
received segment (one’s
complement of received
segment content)
§ computed checksum equals
checksum field value??
• NO - error detected,
drop segment
• YES - no error detected
But maybe errors
nonetheless? Yes!
Goal: detect errors (e.g., flipped bits) in transmitted
segment

---

## Page 21

Transport Layer 3-22
Chapter 3 outline
3.1 transport-layer
services
3.2 multiplexing and
demultiplexing
3.3 connectionless
transport: UDP
3.4 principles of reliable
data transfer
3.5 connection-oriented
transport: TCP
• segment structure
• reliable data transfer
• flow control
• connection management
3.6 principles of congestion
control
3.7 TCP congestion control

---

## Page 22

Transport Layer 3-23
Principles of reliable data transfer
§ characteristics of unreliable channel will determine
complexity of reliable data transfer protocol (rdt)

---

## Page 23

Transport Layer 3-24
§ characteristics of unreliable channel will determine
complexity of reliable data transfer protocol (rdt)
Principles of reliable data transfer

---

## Page 24

Transport Layer 3-25
§ characteristics of unreliable channel will determine
complexity of reliable data transfer protocol (rdt)
Principles of reliable data transfer
Note:
rdt -> reliable data transfer
udt -> unreliable data transmission (unreliable channel)

---

## Page 25

Transport Layer 3-26
Reliable data transfer (rdt): getting started
send
side
receive
side
rdt_send(): called from above,
(e.g., by app.). Passes data for
delivery to receiver upper layer
udt_send(): called by rdt,
to transfer packet over
unreliable channel to receiver
rdt_rcv(): called when packet
arrives on rcv-side of channel
deliver_data(): called by rdt
to deliver received data to upper
layer

---

## Page 26

Transport Layer 3-27
We will:
§ incrementally develop sender, receiver sides of
reliable data transfer protocol (rdt)
§ consider only unidirectional data transfer
• but control info will flow in both directions!
§ use finite state machines (FSM)  to specify sender,
receiver
state
1
state
2
event causing state transition
actions taken on state transition
state: when in this
state next state
uniquely determined
by next event
event
actions
Reliable data transfer: getting started

---

## Page 27

Transport Layer 3-28
rdt1.0: reliable transfer over a reliable channel
§ underlying channel perfectly reliable
• no bit errors
• no loss of packets
§ separate FSMs for sender, receiver:
• sender sends data into underlying channel
• receiver reads data from underlying channel
Wait for
call from
above
packet = make_pkt(data)
udt_send(packet)
rdt_send(data)
extract (packet,data)
deliver_data(data)
Wait for
call from
below
rdt_rcv(packet)
sender
receiver

---

## Page 28

Transport Layer 3-29
§ underlying channel may flip bits in packet
• checksum to detect bit errors
§ the question: how to recover from errors:
• acknowledgements (ACKs): receiver explicitly tells sender
that pkt received OK
• negative acknowledgements (NAKs): receiver explicitly tells
sender that pkt had errors
• sender retransmits pkt on receipt of NAK
§ new mechanisms in rdt2.0 (beyond rdt1.0):
• error detection
• receiver feedback: control msgs (ACK,NAK) rcvr-
>sender
rdt2.0: channel with bit errors
How do humans recover from errors
during conversation?

---

## Page 29

Transport Layer 3-30
§ underlying channel may flip bits in packet
• checksum to detect bit errors
§ the question: how to recover from errors:
• acknowledgements (ACKs): receiver explicitly tells sender
that pkt received OK
• negative acknowledgements (NAKs): receiver explicitly tells
sender that pkt had errors
• sender retransmits pkt on receipt of NAK
§ new mechanisms in rdt2.0 (beyond rdt1.0):
• error detection
• feedback: control msgs (ACK,NAK) from receiver to
sender
rdt2.0: channel with bit errors

---

## Page 30

Transport Layer 3-31
rdt2.0: FSM specification
Wait for
call from
above
sndpkt = make_pkt(data, checksum)
udt_send(sndpkt)
extract(rcvpkt,data)
deliver_data(data)
udt_send(ACK)
rdt_rcv(rcvpkt) &&
notcorrupt(rcvpkt)
rdt_rcv(rcvpkt) && is ACK(rcvpkt)
udt_send(sndpkt)
rdt_rcv(rcvpkt) &&
is NAK(rcvpkt)
udt_send(NAK)
rdt_rcv(rcvpkt) &&
corrupt(rcvpkt)
Wait for
ACK or
NAK
Wait for
call from
below
sender
receiver
rdt_send(data)

---

## Page 31

Transport Layer 3-32
rdt2.0: operation with no errors
Wait for
call from
above
snkpkt = make_pkt(data, checksum)
udt_send(sndpkt)
extract(rcvpkt,data)
deliver_data(data)
udt_send(ACK)
rdt_rcv(rcvpkt) &&
notcorrupt(rcvpkt)
rdt_rcv(rcvpkt) && isACK(rcvpkt)
udt_send(sndpkt)
rdt_rcv(rcvpkt) &&
isNAK(rcvpkt)
udt_send(NAK)
rdt_rcv(rcvpkt) &&
corrupt(rcvpkt)
Wait for
ACK or
NAK
Wait for
call from
below
rdt_send(data)

---

## Page 32

Transport Layer 3-33
rdt2.0: error scenario
Wait for
call from
above
snkpkt = make_pkt(data, checksum)
udt_send(sndpkt)
extract(rcvpkt,data)
deliver_data(data)
udt_send(ACK)
rdt_rcv(rcvpkt) &&
notcorrupt(rcvpkt)
rdt_rcv(rcvpkt) && is ACK(rcvpkt)
udt_send(sndpkt)
rdt_rcv(rcvpkt) &&
is NAK(rcvpkt)
udt_send(NAK)
rdt_rcv(rcvpkt) &&
corrupt(rcvpkt)
Wait for
ACK or
NAK
Wait for
call from
below
rdt_send(data)

---

## Page 33

Transport Layer 3-34
rdt2.0 has a fatal flaw!
what happens if
ACK/NAK corrupted?
§ sender doesnt know
what happened at
receiver!
§ can’t just retransmit:
possible duplicate
how to handling
duplicates:
§ sender retransmits
current pkt if ACK/NAK
corrupted
§ sender adds sequence
number to each pkt
§ receiver discards (doesn’t
deliver up) duplicate pkt
stop and wait
sender sends one packet,
then waits for receiver
response

---

## Page 34

Transport Layer 3-42
sender
receiver
rcv pkt1
rcv pkt0
send ack0
send ack1
send ack0
rcv ack0
send pkt0
send pkt1
rcv ack1
send pkt0
rcv pkt0
pkt0
pkt0
pkt1
ack1
ack0
ack0
(a) no loss
sender
receiver
rcv pkt1
rcv pkt0
send ack0
send ack1
send ack0
rcv ack0
send pkt0
send pkt1
rcv ack1
send pkt0
rcv pkt0
pkt0
pkt0
ack1
ack0
ack0
(b) packet loss
pkt1
X
loss
pkt1
timeout
resend pkt1
Stop and Wait with Seq. Nos

---

## Page 35

Transport Layer 3-43
rcv pkt1
send ack1
(detect duplicate)
pkt1
sender
receiver
rcv pkt1
rcv pkt0
send ack0
send ack1
send ack0
rcv ack0
send pkt0
send pkt1
rcv ack1
send pkt0
rcv pkt0
pkt0
pkt0
ack1
ack0
ack0
(c) ACK loss
ack1
X
loss
pkt1
timeout
resend pkt1
rcv pkt1
send ack1
(detect duplicate)
pkt1
sender
receiver
rcv pkt1
send ack0
rcv ack0
send pkt1
send pkt0
rcv pkt0
pkt0
ack0
(d) premature timeout/ delayed ACK
pkt1
timeout
resend pkt1
ack1
send ack1
send pkt0
rcv ack1
pkt0
ack1
ack0
send pkt0
rcv ack1
pkt0
rcv pkt0
send ack0
ack0
rcv pkt0
send ack0
(detect duplicate)
Stop and Wait with Seq. Nos

---

## Page 36

Transport Layer 3-44
Performance of Protocol
§ it is correct, but performance is poor
§ e.g.: 1 Gbps link, 15 ms prop. delay, 8000 bit packet:
§ U sender: utilization is fraction of time sender busy sending
U
sender =
.008
30.008
= 0.00027
L / R
RTT + L / R
=

Dtrans = L
R
8000 bits
109 bits/sec
=

= 8 microsecs

---

## Page 37

Transport Layer 3-45
rdt3.0: stop-and-wait operation
first packet bit transmitted, t = 0
sender
receiver
RTT
last packet bit transmitted, t = L / R
first packet bit arrives
last packet bit arrives, send ACK
ACK arrives, send next
packet, t = RTT + L / R
U sender =
.008
30.008
= 0.00027
L / R
RTT + L / R
=

- if RTT=30 msec, one 8KB pkt every 30 msec
à ~265kB/sec throughput over 1 Gbps link
- network protocol limits use of physical resources!

---

## Page 38

Transport Layer 3-46
Pipelined protocols
pipelining: sender allows multiple, in-flight, yet-
to-be-acknowledged pkts (window of packets in
transit)
• range of sequence numbers must be increased
• buffering at sender and/or receiver
§ two generic forms of pipelined protocols: go-Back-N
(GBN), selective repeat (SR)

---

## Page 39

Transport Layer 3-47
Pipelining: increased utilization
first packet bit transmitted, t = 0
sender
receiver
RTT
last bit transmitted, t = L / R
first packet bit arrives
last packet bit arrives, send ACK
ACK arrives, send next
packet, t = RTT + L / R
last bit of 2nd packet arrives, send ACK
last bit of 3rd packet arrives, send ACK
3-packet pipelining increases
utilization by a factor of 3!
U sender =
.0024
30.008
= 0.00081
3L / R
RTT + L / R
=

---

## Page 40

Transport Layer 3-48
Pipelined protocols: overview
Go-back-N:
§ sender can have up to
N unacked packets in
pipeline
§ receiver only sends
cumulative ack
• doesn’t ack packet if
there’s a gap
§ sender has timer for
oldest unacked packet
• when timer expires,
retransmit all unacked
packets
Selective Repeat:
§ sender can have up to N
unack’ed packets in
pipeline
§ rcvr sends individual ack
for each packet
§ sender maintains timer
for each unacked packet
• when timer expires,
retransmit only that
unacked packet

---

## Page 41

Transport Layer 3-49
Go-Back-N: sender
§ k-bit seq # in pkt header
§ window of up to N consecutive unack’ed pkts allowed
between sender and receiver
§ ACK(n): ACKs all pkts up to and including seq # n - cumulative
ACK à waiting for next packet with seq # n+1
• may receive duplicate ACKs (see receiver)
§ timer for oldest in-flight pkt
§ timeout(n): retransmit packet n and all older seq # pkts in
window (note window is all “unack’ed” packets)

---

## Page 42

Transport Layer 3-52
GBN in action
send  pkt0
send  pkt1
send  pkt2
send  pkt3
(wait – window full)
sender
receiver
receive pkt0, send ack0
receive pkt1, send ack1
receive pkt3, discard,
(re)send ack1
rcv ack0, send pkt4
rcv ack1, send pkt5
pkt 2 timeout
send  pkt2
send  pkt3
send  pkt4
send  pkt5
Xloss
receive pkt4, discard,
(re)send ack1
receive pkt5, discard,
(re)send ack1
rcv pkt2, deliver, send ack2
rcv pkt3, deliver, send ack3
rcv pkt4, deliver, send ack4
rcv pkt5, deliver, send ack5
ignore duplicate ACK
0 1 2 3 4 5 6 7 8
sender window (N=4)
0 1 2 3 4 5 6 7 8
0 1 2 3 4 5 6 7 8
0 1 2 3 4 5 6 7 8
0 1 2 3 4 5 6 7 8
0 1 2 3 4 5 6 7 8
0 1 2 3 4 5 6 7 8
0 1 2 3 4 5 6 7 8
0 1 2 3 4 5 6 7 8
0 1 2 3 4 5 6 7 8
Timer reset after every received ACK for oldest
unACKed pkt. Here last ACK was for pkt(1),
so timer reset for unACKed pkt(2)
GBN - resend all pkts
from (n=1 +1) onwards
GBN – discard all pkts from
(n=1) onwards, out of order
-GBN - only one timer
-tracks oldest pkt
-updated every ACK
Timer reset
for pkt(2)

---

## Page 43

Transport Layer 3-53
Selective repeat
§ receiver individually acknowledges all correctly
received pkts
• buffers pkts, as needed, for eventual in-order delivery
to upper layer
§ sender only resends pkts for which ACK not
received
• sender timer for each unACKed pkt (actually oldest
unACKed pkt, timer reset everytime a pkt is ACKed
for oldest unACKed packet, all ACKed packets
marked as received, and no timer reset if packets are
not oldest)
§ sender window
• N consecutive seq #s
• Limit on seq #s of sent, unACKed pkts (max window
size is set for transmission)

---

## Page 44

Transport Layer 3-54
Selective repeat: sender, receiver windows
