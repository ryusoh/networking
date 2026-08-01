# ch03-chapter-3-v6.01 - Part 01 (Pages 1-55)

---

## Page 1

Transport Layer 3-1
Chapter 3
Transport Layer
Computer
Networking: A Top
Down Approach
6th edition
Jim Kurose, Keith Ross
Addison-Wesley
March 2012
A note on the use of these ppt slides:
Were making these slides freely available to all (faculty, students, readers).
Theyre in PowerPoint form so you see the animations; and can add, modify,
and delete slides  (including this one) and slide content to suit your needs.
They obviously represent a lot of work on our part. In return for use, we only
ask the following:
v If you use these slides (e.g., in a class) that you mention their source
(after all, wed like people to use our book!)
v If you post any slides on a www site, that you note that they are adapted
from (or perhaps identical to) our slides, and note our copyright of this
material.
Thanks and enjoy!  JFK/KWR
All material copyright 1996-2013
J.F Kurose and K.W. Ross, All Rights Reserved

---

## Page 2

Transport Layer 3-2
Chapter 3: Transport Layer
our goals:
v understand
principles behind
transport layer
services:
§ multiplexing,
demultiplexing
§ reliable data transfer
§ flow control
§ congestion control
v learn about Internet
transport layer protocols:
§ UDP: connectionless
transport
§ TCP: connection-oriented
reliable transport
§ TCP congestion control

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
§ segment structure
§ reliable data transfer
§ flow control
§ connection management
3.6 principles of congestion
control
3.7 TCP congestion control

---

## Page 4

Transport Layer 3-4
Transport services and protocols
v provide logical communication
between app processes
running on different hosts
v transport protocols run in
end systems
§ send side: breaks app
messages into segments,
passes to  network layer
§ rcv side: reassembles
segments into messages,
passes to app layer
v more than one transport
protocol available to apps
§ Internet: TCP and UDP
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
v network layer: logical
communication
between hosts
v transport layer:
logical
communication
between processes
§ relies on, enhances,
network layer
services
12 kids in Anns house sending
letters to 12 kids in Bills
house:
v hosts = houses
v processes = kids
v app messages = letters in
envelopes
v transport protocol = Ann
and Bill who demux to in-
house siblings
v network-layer protocol =
postal service
household analogy:

---

## Page 6

Transport Layer 3-6
Internet transport-layer protocols
v reliable, in-order
delivery (TCP)
§ congestion control
§ flow control
§ connection setup
v unreliable, unordered
delivery: UDP
§ no-frills extension of
best-effort IP
v services not available:
§ delay guarantees
§ bandwidth guarantees
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

## Page 7

Transport Layer 3-7
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
§ segment structure
§ reliable data transfer
§ flow control
§ connection management
3.6 principles of congestion
control
3.7 TCP congestion control

---

## Page 8

Transport Layer 3-8
Multiplexing/demultiplexing
process
socket
use header info to deliver
received segments to correct
socket
demultiplexing at receiver:
handle data from multiple
sockets, add transport header
(later used for demultiplexing)
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

## Page 9

Transport Layer 3-9
How demultiplexing works
v host receives IP datagrams
§ each datagram has source IP
address, destination IP
address
§ each datagram carries one
transport-layer segment
§ each segment has source,
destination port number
v host uses IP addresses &
port numbers to direct
segment to appropriate
socket
source port #
dest port #
32 bits
application
data
(payload)
other header fields
TCP/UDP segment format

---

## Page 10

Transport Layer 3-10
Connectionless demultiplexing
v recall: created socket has
host-local port #:
DatagramSocket mySocket1
= new DatagramSocket(12534);
v when host receives UDP
segment:
§ checks destination port #
in segment
§ directs UDP segment to
socket with that port #
v recall: when creating
datagram to send into
UDP socket, must specify
§ destination IP address
§ destination port #
IP datagrams with same
dest. port #, but different
source IP addresses
and/or source port
numbers will be directed
to same socket at dest

---

## Page 11

Transport Layer 3-11
Connectionless demux: example
DatagramSocket
serverSocket = new
DatagramSocket
(6428);
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
DatagramSocket
mySocket1 = new
DatagramSocket
(5775);
DatagramSocket
mySocket2 = new
DatagramSocket
(9157);
source port: 9157
dest port: 6428
source port: 6428
dest port: 9157
source port: ?
dest port: ?
source port: ?
dest port: ?

---

## Page 12

Transport Layer 3-12
Connection-oriented demux
v TCP socket identified
by 4-tuple:
§ source IP address
§ source port number
§ dest IP address
§ dest port number
v demux: receiver uses
all four values to direct
segment to appropriate
socket
v server host may support
many simultaneous TCP
sockets:
§ each socket identified by
its own 4-tuple
v web servers have
different sockets for
each connecting client
§ non-persistent HTTP will
have different socket for
each request

---

## Page 13

Transport Layer 3-13
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

## Page 14

Transport Layer 3-14
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

## Page 15

Transport Layer 3-15
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
§ segment structure
§ reliable data transfer
§ flow control
§ connection management
3.6 principles of congestion
control
3.7 TCP congestion control

---

## Page 16

Transport Layer 3-16
UDP: User Datagram Protocol [RFC 768]
v no frills, bare bones
Internet transport
protocol
v best effort service,
UDP segments may be:
§ lost
§ delivered out-of-order
to app
v connectionless:
§ no handshaking
between UDP sender,
receiver
§ each UDP segment
handled independently
of others
v UDP use:
§ streaming multimedia
apps (loss tolerant, rate
sensitive)
§ DNS
§ SNMP
v reliable transfer over
UDP:
§ add reliability at
application layer
§ application-specific error
recovery!

---

## Page 17

Transport Layer 3-17
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
v no connection
establishment (which can
add delay)
v simple: no connection
state at sender, receiver
v small header size
v no congestion control:
UDP can blast away as
fast as desired
why is there a UDP?

---

## Page 18

Transport Layer 3-18
UDP checksum
sender:
v treat segment contents,
including header fields,
as sequence of 16-bit
integers
v checksum: addition
(ones complement
sum) of segment
contents
v sender puts checksum
value into UDP
checksum field
receiver:
v compute checksum of
received segment
v check if computed
checksum equals checksum
field value:
§ NO - error detected
§ YES - no error detected.
But maybe errors
nonetheless? More later
….
Goal: detect errors (e.g., flipped bits) in transmitted
segment

---

## Page 19

Transport Layer 3-19
Internet checksum: example
example: add two 16-bit integers
1
1  1  1  0  0  1  1  0  0  1  1  0  0  1  1  0
1
1  1  0  1  0  1  0  1  0  1  0  1  0  1  0  1
1  1  0  1  1  1  0  1  1  1  0  1  1  1  0  1  1
1
1  0  1  1  1  0  1  1  1  0  1  1  1  1  0  0
1
0  1  0  0  0  1  0  0  0  1  0  0  0  0  1  1
wraparound
sum
checksum
Note: when adding numbers, a carryout from the most
significant bit needs to be added to the result

---

## Page 20

Transport Layer 3-20
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
§ segment structure
§ reliable data transfer
§ flow control
§ connection management
3.6 principles of congestion
control
3.7 TCP congestion control

---

## Page 21

Transport Layer 3-21
Principles of reliable data transfer
v important in application, transport, link layers
§ top-10 list of important networking topics!
v characteristics of unreliable channel will determine
complexity of reliable data transfer protocol (rdt)

---

## Page 22

Transport Layer 3-22
v characteristics of unreliable channel will determine
complexity of reliable data transfer protocol (rdt)
Principles of reliable data transfer
v important in application, transport, link layers
§ top-10 list of important networking topics!

---

## Page 23

Transport Layer 3-23
v characteristics of unreliable channel will determine
complexity of reliable data transfer protocol (rdt)
v important in application, transport, link layers
§ top-10 list of important networking topics!
Principles of reliable data transfer

---

## Page 24

Transport Layer 3-24
Reliable data transfer: getting started
send
side
receive
side
rdt_send(): called from above,
(e.g., by app.). Passed data to
deliver to receiver upper layer
udt_send(): called by rdt,
to transfer packet over
unreliable channel to receiver
rdt_rcv(): called when packet
arrives on rcv-side of channel
deliver_data(): called by
rdt to deliver data to upper

---

## Page 25

Transport Layer 3-25
well:
v incrementally develop sender, receiver sides of
reliable data transfer protocol (rdt)
v consider only unidirectional data transfer
§ but control info will flow on both directions!
v use finite state machines (FSM)  to specify sender,
receiver
state
1
state
2
event causing state transition
actions taken on state transition
state: when in this
state next state
uniquely determined
by next event
event
actions
Reliable data transfer: getting started

---

## Page 26

Transport Layer 3-26
rdt1.0: reliable transfer over a reliable channel
v underlying channel perfectly reliable
§ no bit errors
§ no loss of packets
v separate FSMs for sender, receiver:
§ sender sends data into underlying channel
§ receiver reads data from underlying channel
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

## Page 27

Transport Layer 3-27
v underlying channel may flip bits in packet
§ checksum to detect bit errors
v the question: how to recover from errors:
§ acknowledgements (ACKs): receiver explicitly tells sender
that pkt received OK
§ negative acknowledgements (NAKs): receiver explicitly tells
sender that pkt had errors
§ sender retransmits pkt on receipt of NAK
v new mechanisms in rdt2.0 (beyond rdt1.0):
§ error detection
§ receiver feedback: control msgs (ACK,NAK) rcvr-
>sender
rdt2.0: channel with bit errors
How do humans recover from errors
during conversation?

---

## Page 28

Transport Layer 3-28
v underlying channel may flip bits in packet
§ checksum to detect bit errors
v the question: how to recover from errors:
§ acknowledgements (ACKs): receiver explicitly tells sender
that pkt received OK
§ negative acknowledgements (NAKs): receiver explicitly tells
sender that pkt had errors
§ sender retransmits pkt on receipt of NAK
v new mechanisms in rdt2.0 (beyond rdt1.0):
§ error detection
§ feedback: control msgs (ACK,NAK) from receiver to
sender
rdt2.0: channel with bit errors

---

## Page 29

Transport Layer 3-29
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
sender
receiver
rdt_send(data)
L

---

## Page 30

Transport Layer 3-30
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
L

---

## Page 31

Transport Layer 3-31
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
L

---

## Page 32

Transport Layer 3-32
rdt2.0 has a fatal flaw!
what happens if
ACK/NAK corrupted?
v sender doesnt know
what happened at
receiver!
v cant just retransmit:
possible duplicate
handling duplicates:
v sender retransmits
current pkt if ACK/NAK
corrupted
v sender adds sequence
number to each pkt
v receiver discards (doesnt
deliver up) duplicate pkt
stop and wait
sender sends one packet,
then waits for receiver
response

---

## Page 33

Transport Layer 3-33
rdt2.1: sender, handles garbled ACK/NAKs
Wait for
call 0 from
above
sndpkt = make_pkt(0, data, checksum)
udt_send(sndpkt)
rdt_send(data)
Wait for
ACK or
NAK 0
udt_send(sndpkt)
rdt_rcv(rcvpkt) &&
( corrupt(rcvpkt) ||
isNAK(rcvpkt) )
sndpkt = make_pkt(1, data, checksum)
udt_send(sndpkt)
rdt_send(data)
rdt_rcv(rcvpkt)
&& notcorrupt(rcvpkt)
&& isACK(rcvpkt)
udt_send(sndpkt)
rdt_rcv(rcvpkt) &&
( corrupt(rcvpkt) ||
isNAK(rcvpkt) )
rdt_rcv(rcvpkt)
&& notcorrupt(rcvpkt)
&& isACK(rcvpkt)
Wait for
call 1 from
above
Wait for
ACK or
NAK 1
L
L

---

## Page 34

Transport Layer 3-34
Wait for
0 from
below
sndpkt = make_pkt(NAK, chksum)
udt_send(sndpkt)
rdt_rcv(rcvpkt) &&
not corrupt(rcvpkt) &&
has_seq0(rcvpkt)
rdt_rcv(rcvpkt) && notcorrupt(rcvpkt)
&& has_seq1(rcvpkt)
extract(rcvpkt,data)
deliver_data(data)
sndpkt = make_pkt(ACK, chksum)
udt_send(sndpkt)
Wait for
1 from
below
rdt_rcv(rcvpkt) && notcorrupt(rcvpkt)
&& has_seq0(rcvpkt)
extract(rcvpkt,data)
deliver_data(data)
sndpkt = make_pkt(ACK, chksum)
udt_send(sndpkt)
rdt_rcv(rcvpkt) && (corrupt(rcvpkt)
sndpkt = make_pkt(ACK, chksum)
udt_send(sndpkt)
rdt_rcv(rcvpkt) &&
not corrupt(rcvpkt) &&
has_seq1(rcvpkt)
rdt_rcv(rcvpkt) && (corrupt(rcvpkt)
sndpkt = make_pkt(ACK, chksum)
udt_send(sndpkt)
sndpkt = make_pkt(NAK, chksum)
udt_send(sndpkt)
rdt2.1: receiver, handles garbled ACK/NAKs

---

## Page 35

Transport Layer 3-35
rdt2.1: discussion
sender:
v seq # added to pkt
v two seq. #s (0,1) will
suffice.  Why?
v must check if received
ACK/NAK corrupted
v twice as many states
§ state must
remember whether
expected pkt should
have seq # of 0 or 1
receiver:
v must check if received
packet is duplicate
§ state indicates whether
0 or 1 is expected pkt
seq #
v note: receiver can not
know if its last
ACK/NAK received
OK at sender

---

## Page 36

Transport Layer 3-36
rdt2.2: a NAK-free protocol
v same functionality as rdt2.1, using ACKs only
v instead of NAK, receiver sends ACK for last pkt
received OK
§ receiver must explicitly include seq # of pkt being ACKed
v duplicate ACK at sender results in same action as
NAK: retransmit current pkt

---

## Page 37

Transport Layer 3-37
rdt2.2: sender, receiver fragments
Wait for
call 0 from
above
sndpkt = make_pkt(0, data, checksum)
udt_send(sndpkt)
rdt_send(data)
udt_send(sndpkt)
rdt_rcv(rcvpkt) &&
( corrupt(rcvpkt) ||
isACK(rcvpkt,1) )
rdt_rcv(rcvpkt)
&& notcorrupt(rcvpkt)
&& isACK(rcvpkt,0)
Wait for
ACK
0
sender FSM
fragment
rdt_rcv(rcvpkt) && notcorrupt(rcvpkt)
&& has_seq1(rcvpkt)
extract(rcvpkt,data)
deliver_data(data)
sndpkt = make_pkt(ACK1, chksum)
udt_send(sndpkt)
Wait for
0 from
below
rdt_rcv(rcvpkt) &&
(corrupt(rcvpkt) ||
has_seq1(rcvpkt))
udt_send(sndpkt)
receiver FSM
fragment
L

---

## Page 38

Transport Layer 3-38
rdt3.0: channels with errors and loss
new assumption:
underlying channel can
also lose packets
(data, ACKs)
§ checksum, seq. #,
ACKs, retransmissions
will be of help … but
not enough
approach: sender waits
reasonable amount of
time for ACK
v retransmits if no ACK
received in this time
v if pkt (or ACK) just delayed
(not lost):
§ retransmission will be
duplicate, but seq. #s
already handles this
§ receiver must specify seq

## of pkt being ACKed

v requires countdown timer

---

## Page 39

Transport Layer 3-39
rdt3.0 sender
sndpkt = make_pkt(0, data, checksum)
udt_send(sndpkt)
start_timer
rdt_send(data)
Wait
for
ACK0
rdt_rcv(rcvpkt) &&
( corrupt(rcvpkt) ||
isACK(rcvpkt,1) )
Wait for
call 1 from
above
sndpkt = make_pkt(1, data, checksum)
udt_send(sndpkt)
start_timer
rdt_send(data)
rdt_rcv(rcvpkt)
&& notcorrupt(rcvpkt)
&& isACK(rcvpkt,0)
rdt_rcv(rcvpkt) &&
( corrupt(rcvpkt) ||
isACK(rcvpkt,0) )
rdt_rcv(rcvpkt)
&& notcorrupt(rcvpkt)
&& isACK(rcvpkt,1)
stop_timer
stop_timer
udt_send(sndpkt)
start_timer
timeout
udt_send(sndpkt)
start_timer
timeout
rdt_rcv(rcvpkt)
Wait for
call 0from
above
Wait
for
ACK1
L
rdt_rcv(rcvpkt)
L
L
L

---

## Page 40

Transport Layer 3-40
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
rdt3.0 in action

---

## Page 41

Transport Layer 3-41
rdt3.0 in action
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

---

## Page 42

Transport Layer 3-42
Performance of rdt3.0
v rdt3.0 is correct, but performance stinks
v e.g.: 1 Gbps link, 15 ms prop. delay, 8000 bit packet:
§ U sender: utilization – fraction of time sender busy sending
U sender =
.008
30.008
= 0.00027
L / R
RTT + L / R
=

§ if RTT=30 msec, 1KB pkt every 30 msec: 33kB/sec thruput
over 1 Gbps link
v network protocol limits use of physical resources!
Dtrans = L
R
8000 bits
109 bits/sec
=

= 8 microsecs

---

## Page 43

Transport Layer 3-43
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

---

## Page 44

Transport Layer 3-44
Pipelined protocols
pipelining: sender allows multiple, in-flight, yet-
to-be-acknowledged pkts
§ range of sequence numbers must be increased
§ buffering at sender and/or receiver
v two generic forms of pipelined protocols: go-Back-N,
selective repeat

---

## Page 45

Transport Layer 3-45
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

## Page 46

Transport Layer 3-46
Pipelined protocols: overview
Go-back-N:
v sender can have up to
N unacked packets in
pipeline
v receiver only sends
cumulative ack
§ doesnt ack packet if
theres a gap
v sender has timer for
oldest unacked packet
§ when timer expires,
retransmit all unacked
packets
Selective Repeat:
v sender can have up to N
unacked packets in
pipeline
v rcvr sends individual ack
for each packet
v sender maintains timer
for each unacked packet
§ when timer expires,
retransmit only that
unacked packet

---

## Page 47

Transport Layer 3-47
Go-Back-N: sender
v k-bit seq # in pkt header
v window of up to N, consecutive unacked pkts allowed
v ACK(n): ACKs all pkts up to, including seq # n - cumulative
ACK
§ may receive duplicate ACKs (see receiver)
v timer for oldest in-flight pkt
v timeout(n): retransmit packet n and all higher seq # pkts in
window

---

## Page 48

Transport Layer 3-48
GBN: sender extended FSM
Wait
start_timer
udt_send(sndpkt[base])
udt_send(sndpkt[base+1])
…
udt_send(sndpkt[nextseqnum-1])
timeout
rdt_send(data)
if (nextseqnum < base+N) {
sndpkt[nextseqnum] = make_pkt(nextseqnum,data,chksum)
udt_send(sndpkt[nextseqnum])
if (base == nextseqnum)
start_timer
nextseqnum++
}
else
refuse_data(data)
base = getacknum(rcvpkt)+1
If (base == nextseqnum)
stop_timer
else
start_timer
rdt_rcv(rcvpkt) &&
notcorrupt(rcvpkt)
base=1
nextseqnum=1
rdt_rcv(rcvpkt)
&& corrupt(rcvpkt)
L

---

## Page 49

Transport Layer 3-49
ACK-only: always send ACK for correctly-received
pkt with highest in-order seq #
§ may generate duplicate ACKs
§ need only remember expectedseqnum
v out-of-order pkt:
§ discard (dont buffer): no receiver buffering!
§ re-ACK pkt with highest in-order seq #
Wait
udt_send(sndpkt)
default
rdt_rcv(rcvpkt)
&& notcurrupt(rcvpkt)
&& hasseqnum(rcvpkt,expectedseqnum)
extract(rcvpkt,data)
deliver_data(data)
sndpkt = make_pkt(expectedseqnum,ACK,chksum)
udt_send(sndpkt)
expectedseqnum++
expectedseqnum=1
sndpkt =
make_pkt(expectedseqnum,ACK,chksum)
L
GBN: receiver extended FSM

---

## Page 50

Transport Layer 3-50
GBN in action
send  pkt0
send  pkt1
send  pkt2
send  pkt3
(wait)
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

---

## Page 51

Transport Layer 3-51
Selective repeat
v receiver individually acknowledges all correctly
received pkts
§ buffers pkts, as needed, for eventual in-order delivery
to upper layer
v sender only resends pkts for which ACK not
received
§ sender timer for each unACKed pkt
v sender window
§ N consecutive seq #s
§ limits seq #s of sent, unACKed pkts

---

## Page 52

Transport Layer 3-52
Selective repeat: sender, receiver windows

---

## Page 53

Transport Layer 3-53
Selective repeat
data from above:
v if next available seq # in
window, send pkt
timeout(n):
v resend pkt n, restart
timer
ACK(n) in [sendbase,sendbase+N]:
v mark pkt n as received
v if n smallest unACKed
pkt, advance window base
to next unACKed seq #
sender
pkt n in [rcvbase, rcvbase+N-1]
v send ACK(n)
v out-of-order: buffer
v in-order: deliver (also
deliver buffered, in-order
pkts), advance window to
next not-yet-received pkt
pkt n in [rcvbase-N,rcvbase-1]
v ACK(n)
otherwise:
v ignore
receiver

---

## Page 54

Transport Layer 3-54
Selective repeat in action
send  pkt0
send  pkt1
send  pkt2
send  pkt3
(wait)
sender
receiver
receive pkt0, send ack0
receive pkt1, send ack1
receive pkt3, buffer,
send ack3
rcv ack0, send pkt4
rcv ack1, send pkt5
pkt 2 timeout
send  pkt2
Xloss
receive pkt4, buffer,
send ack4
receive pkt5, buffer,
send ack5
rcv pkt2; deliver pkt2,
pkt3, pkt4, pkt5; send ack2
record ack3 arrived
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
record ack4 arrived
record ack5 arrived
Q: what happens when ack2 arrives?

---

## Page 55

Transport Layer 3-55
Selective repeat:
dilemma
example:
v seq #s: 0, 1, 2, 3
v window size=3
receiver window
(after receipt)
sender window
(after receipt)
0 1 2 3 0 1 2
0 1 2 3 0 1 2
0 1 2 3 0 1 2
pkt0
pkt1
pkt2
0 1 2 3 0 1 2
pkt0
timeout
retransmit pkt0
0 1 2 3 0 1 2
0 1 2 3 0 1 2
0 1 2 3 0 1 2
X
X
X
will accept packet
with seq number 0
(b) oops!
0 1 2 3 0 1 2
0 1 2 3 0 1 2
0 1 2 3 0 1 2
pkt0
pkt1
pkt2
0 1 2 3 0 1 2
pkt0
0 1 2 3 0 1 2
0 1 2 3 0 1 2
0 1 2 3 0 1 2
X
will accept packet
with seq number 0
0 1 2 3 0 1 2
pkt3
(a) no problem
receiver cant see sender side.
receiver behavior identical in both cases!
somethings (very) wrong!
v receiver sees no
difference in two
scenarios!
v duplicate data
accepted as new in
(b)
Q: what relationship
between seq # size
and window size to
avoid problem in (b)?
