# chapter-03-v6-01

---

## Page 1

Transport Layer 3-1
Chapter 3
Transport
Layer

orking: A
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
     All material copyright 1996-2013
     J.F Kurose and K.W. Ross, All Rights Reserved

---

## Page 2

Transport Layer 3-2
Chapter 3: Transport
Layer
our goals:
v understand
principles be
§ mul
demultiplexing
§ reliable data
transfer
§ flow control
§ congestion
control
v learn about Internet
ort layer
§ TCP: connection-
oriented reliable
transport
§ TCP congestion
control

---

## Page 3

Transport Layer 3-3
Chapter 3 outline
3.1 transport-layer
services
3.2 multiplexin
3.3 co
transport: UDP
3.4 principles of
reliable data
transfer
3.5 connection-
oriented transport:
§ flow control
§ connection
management
3.6 principles of
congestion control
3.7 TCP congestion
control

---

## Page 4

Transport Layer 3-4
Transport services and
protocols
v provide logical
communication
between app
processes runni
v
in end
§ send side: breaks
app messages into
segments, passes to
network layer
§ rcv side:
reassembles
segments into
messages, passes to
app layer
h
application
transport
network
data link
physical
logical
 transport
application
transport
network
data link
physical

---

## Page 5

Transport Layer 3-5
Transport vs. network
layer
v network layer:
logical
communica
logic
communication
between
processes
§ relies on,
enhances,
network layer
services
12 kids in Ann’s house
ing letters to 12
ids
v app messages =
letters in envelopes
v transport protocol =
Ann and Bill who
demux to in-house
siblings
v network-layer
protocol = postal
service
household analogy:

---

## Page 6

Transport Layer 3-6
Internet transport-layer
protocols
v reliable, in-order
delivery (TCP)
§ congestion control
§ flow control
v unreli
unordered
delivery: UDP
§ no-frills extension
of “best-effort” IP
v services not
available:
§ delay guarantees
§ bandwidth
g a antees
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
logical e
ransport

---

## Page 7

Transport Layer 3-7
Chapter 3 outline
3.1 transport-layer
services
3.2 multiplexin
3.3 co
transport: UDP
3.4 principles of
reliable data
transfer
3.5 connection-
oriented transport:
§ flow control
§ connection
management
3.6 principles of
congestion control
3.7 TCP congestion
control

---

## Page 8

Transport Layer 3-8
Multiplexing/demultiplexin
g
process
socket
use header info to deliver
received segments to corre
t
demultiplexing at receiver:
handle data from
multiple
sockets, add transport
header (later used
d
multiplexing at sender:
transport
physical
link
network
transport
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
v host receives IP
datagrams
§ each datagra
§ eac
one transport-layer
segment
§ each segment has
source, destination
port number
v host uses IP
addresses & port
numbers to direct
segment to
source port #
dest port #
32 bits
application
data
(payload)
TCP/UDP segment format

---

## Page 10

Transport Layer 3-10
Connectionless
demultiplexing
v recall: created socket
has host-local port #:
  DatagramSocket mySocket1
= new DatagramSock
v when host receives
UDP segment:
§ checks destination
port # in segment
§ directs UDP segment
to socket with that
port #
v recall: when creating
datagram to send
into UDP socket,
ess
 port #
IP datagrams with
same dest. port #,
but different source
IP addresses and/or
source port numbers
will be directed to
same socket at dest

---

## Page 11

Transport Layer 3-11
Connectionless demux:
example
DatagramSocket
serverSocket = new
DatagramSocket
 (6428);
transport
physical
link
network
physical
link
network
sport
physical
link
network
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
Connection-oriented
demux
v TCP socket
identified by 4-
tuple:
§ dest
§ dest port number
v demux: receiver
uses all four
values to direct
segment to
appropriate socket
v server host may
support many
ltaneous TCP
its own
4-tuple
v web servers have
different sockets
for each connecting
client
§ non-persistent HTTP
will have different
socket for each
request

---

## Page 13

Transport Layer 3-13
Connection-oriented demux:
example
application
physical
link
P3
application
P4
transport
application
ical
P2
source IP,port: A,9157
dest IP, port: B,80
source IP,port: B,80
dest IP,port: A,9157
host: IP
address
A
host: IP
address
C
P6
P5
P3
source IP,port: C,5775
dest IP,port: B,80
source IP,port: C,9157
dest IP,port: B,80
three segments, all destined to IP address: B,
 dest port: 80 are demultiplexed to different sockets
server:
IP
address
B

---

## Page 14

Transport Layer 3-14
Connection-oriented demux:
example
application
physical
link
P3
application
transport
application
ical
P2
source IP,port: A,9157
dest IP, port: B,80
source IP,port: B,80
dest IP,port: A,9157
host: IP
address
A
host: IP
address
C
server:
IP
address
B
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
3.2 multiplexin
3.3 co
transport: UDP
3.4 principles of
reliable data
transfer
3.5 connection-
oriented transport:
§ flow control
§ connection
management
3.6 principles of
congestion control
3.7 TCP congestion
control

---

## Page 16

Transport Layer 3-16
UDP: User Datagram Protocol
[RFC 768]
v “no frills,” “bare
bones” Internet
transport protocol
v “best effort” ser
§ lost
§ delivered out-of-
order to app
v connectionless:
§ no handshaking
between UDP
sender, receiver
§ each UDP segment
handled
independently of
th
v UDP use:
§ streaming
multimedia apps
ss tolerant, rate
v reliable transfer
over UDP:
§ add reliability at
application layer
§ application-specific
error recovery!

---

## Page 17

Transport Layer 3-17
UDP: segment header
source port #
dest port #
32 bits
ap
(payload)
UDP segment format
length
checks
length, in bytes of
UDP segment,
including header
t (which
can add delay)
v simple: no
connection state at
sender, receiver
v small header size
v no congestion
control: UDP can
blast away as fast as
desired

---

## Page 18

Transport Layer 3-18
UDP checksum
sender:
head
sequence of 16-bit
integers
v checksum: addition
(one’s complement
sum) of segment
contents
v sender puts
checksum value
into UDP checksum
field
er:

v check if computed
checksum equals
checksum field value:
§ NO - error detected
§ YES - no error
detected. But
maybe errors
nonetheless? More
later ….
Goal: detect “errors” (e.g., flipped bits) in
transmitted segment

---

## Page 19

Transport Layer 3-19
Internet checksum:
example
example: add two 16-bit integers
1  1  1  1  0  0  1  1  0  0  1  1  0  0  1  1  0
1  1  1  0
  0  1  0  1  0  1
1  1  0  1  1  1  0  1  1  1  0  1  1  1  1  0  0
1  0  1  0  0  0  1  0  0  0  1  0  0  0  0  1  1
wr
sum
checksum
Note: when adding numbers, a carryout from
the most significant bit needs to be added to the
result

---

## Page 20

Transport Layer 3-20
Chapter 3 outline
3.1 transport-layer
services
3.2 multiplexin
3.3 co
transport: UDP
3.4 principles of
reliable data
transfer
3.5 connection-
oriented transport:
§ flow control
§ connection
management
3.6 principles of
congestion control
3.7 TCP congestion
control

---

## Page 21

Transport Layer 3-21
Principles of reliable data
transfer
v important in application, transport, link
layers
§ top-10 list of important networking topics!
v characteristics of unreliable channel will
determine complexity of reliable data transfer
protocol (rdt)

---

## Page 22

Transport Layer 3-22
v characteristics of unreliable channel will
determine complexity of reliable data transfer
protocol (rdt)
Principles of reliable data
transfer
v important in application, transport, link
layers
§ top-10 list of important networking topics!

---

## Page 23

Transport Layer 3-23
v characteristics of unreliable channel will
determine complexity of reliable data transfer
protocol (rdt)
v important in application, transport, link
layers
§ top-10 list of important networking topics!
Principles of reliable data
transfer

---

## Page 24

Transport Layer 3-24
Reliable data transfer: getting
started
side
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
we’ll:
v incrementally develop sender, receiver
sides of reliable data transfer protocol
(rdt)
v use fi
specify sender, receiver
state
1
state
2
event causing state transition
actions taken on state transition
state: when in this
“state” next state
uniquely determined
by next event
event
actions
Reliable data transfer: getting
started

---

## Page 26

Transport Layer 3-26
rdt1.0: reliable transfer over a
reliable channel
v underlying channel perfectly reliable
§ no bit errors
§ no loss of packets
v separate FSM
eceiver:
§ rece
nnel
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
v underlying channel may flip bits in
packet
§ checksum to detect bit errors
v the question
er from
ex
 OK
§ negative acknowledgements (NAKs): receiver
explicitly tells sender that pkt had errors
§ sender retransmits pkt on receipt of NAK
v new mechanisms in rdt2.0 (beyond
rdt1.0):
§ error detection
§ receiver feedback: control msgs (ACK,NAK)
rcvr->sender
rdt2.0: channel with bit
errors
How do humans recover from “errors”
during conversation?

---

## Page 28

Transport Layer 3-28
v underlying channel may flip bits in
packet
§ checksum to detect bit errors
v the question
er from
ex
 OK
§ negative acknowledgements (NAKs): receiver
explicitly tells sender that pkt had errors
§ sender retransmits pkt on receipt of NAK
v new mechanisms in rdt2.0 (beyond
rdt1.0):
§ error detection
§ feedback: control msgs (ACK,NAK) from
receiver to sender
rdt2.0: channel with bit
errors

---

## Page 29

Transport Layer 3-29
rdt2.0: FSM specification
Wait for
call from
sndpkt = make_pkt(data, checksum)
udt_send(sndpkt)
extract(rcvpkt,data)
deliver_data(data)
udt_send(ACK)
rdt_rcv(rcvpkt) &&
   notcorrupt(rcvpkt)
rdt_rcv(
rdt_rcv(rcvpkt) &&
   isNAK(rcvpkt)
rdt_rcv(rcvpkt) &&
  corrupt(rcvpkt)
Wait for
ACK or
Wait for
call from
below
sender
receiver
rdt_send(data)
Λ

---

## Page 30

Transport Layer 3-30
rdt2.0: operation with no
errors
Wait for
call from
snkpkt = make_pkt(data, checksum)
udt_send(sndpkt)
extract(rcvpkt,data)
deliver_data(data)
udt_send(ACK)
rdt_rcv(rcvpkt) &&
   notcorrupt(rcvpkt)
rdt_rcv(
rdt_rcv(rcvpkt) &&
   isNAK(rcvpkt)
rdt_rcv(rcvpkt) &&
  corrupt(rcvpkt)
Wait for
ACK or
Wait for
call from
below
rdt_send(data)
Λ

---

## Page 31

Transport Layer 3-31
rdt2.0: error scenario
Wait for
call from
snkpkt = make_pkt(data, checksum)
udt_send(sndpkt)
extract(rcvpkt,data)
deliver_data(data)
udt_send(ACK)
rdt_rcv(rcvpkt) &&
   notcorrupt(rcvpkt)
rdt_rcv(
rdt_rcv(rcvpkt) &&
   isNAK(rcvpkt)
rdt_rcv(rcvpkt) &&
  corrupt(rcvpkt)
Wait for
ACK or
Wait for
call from
below
rdt_send(data)
Λ

---

## Page 32

Transport Layer 3-32
rdt2.0 has a fatal flaw!
what happens if
ACK/NAK
corrupted?
v can’t j
possible duplicate
handling
duplicates:
r retransmits
sequence number to
each pkt
v receiver discards
(doesn’t deliver up)
duplicate pkt
stop and wait
sender sends one
packet,
then waits for
receiver
response

---

## Page 33

Transport Layer 3-33
rdt2.1: sender, handles garbled
ACK/NAKs
Wai
call 0
sndpkt = make_pkt(0, data, checksum)
udt_send(sndpkt)
rdt_send(data)
Wait for
udt_send(sndpkt)
rdt_rcv(rcvpkt) &&
( corrupt(rcvpkt) ||
isNAK(rcvpkt) )
sndpkt = make_pkt(1, data, checksum)
udt_send(sndpkt)
rdt_send(data)
vpkt)
&& isACK(rcvpkt)
udt_send(sndpkt)
rdt_rcv(rcvpkt) &&
( corrupt(rcvpkt) ||
isNAK(rcvpkt) )
&& isACK(rc
Wait for
 call 1 from
above
Wait for
ACK or
NAK 1
Λ
Λ

---

## Page 34

Transport Layer 3-34
below
sum)
rdt_rcv(rcvpkt) &&
   not corrupt(rcvpkt) &&
   has_seq0(rcvpkt)
rdt_rcv(rcvpkt) && notcorrupt(rcvpkt)
  && has_seq1(rcvpkt)
extract(rcvpkt,data)
deliver_data(data)
sndpkt = make_pkt(ACK, chksum)
udt_send(sndpkt)
1 from
below
rdt_rcv(rcvpkt) && notcorrupt(rcvpkt)
  && has_seq0(rcvpkt)
extract(rcvpkt,data)
deliver_data(data)
sndpkt = make_pkt(ACK, chksum)
u
rdt_rcv(rcvpkt) && (corrupt(rcvpkt)
sndpkt = make_pkt(ACK, chksum)
udt_send(sndpkt)
rdt_rcv(rcvpkt) &&
   not corrupt(rcvpkt) &&
   has_seq1(rcvpkt)
rdt_rcv(rcvpkt) && (corrupt(rcvpkt)
sndpkt = make_pkt(ACK, chksum)
udt_send(sndpkt)
sndp
udt_s
rdt2.1: receiver, handles garbled
ACK/NAKs

---

## Page 35

Transport Layer 3-35
rdt2.1: discussion
sender:
v seq # added to
pkt
v must check if
received ACK/NAK
corrupted
v twice as many
states
§ state must
“remember”
whether
“expected” pkt
receiver:
v must check if
ved packet is
 1 is
expected pkt seq

#

v note: receiver can
not know if its
last ACK/NAK
received OK at
sender

---

## Page 36

Transport Layer 3-36
rdt2.2: a NAK-free protocol
v same functionality as rdt2.1, using ACKs
only
v instead of NA
ds ACK for
bein
v duplicate ACK at sender results in same
action as NAK: retransmit current pkt

---

## Page 37

Transport Layer 3-37
rdt2.2: sender, receiver
fragments
Wait for
call 0 fr
above
sndpkt = make_pkt(0, data, checksum)
udt_send(sndpkt)
rdt_send(data)
udt_send(sndpkt)
rdt_rcv(rcvpkt) &&
( corrupt(rcvpkt) ||
  isACK(rcvpkt,1) )
pt(rcvpkt)
&& isACK(rcvpkt,0)
Wait for
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
Λ

---

## Page 38

Transport Layer 3-38
rdt3.0: channels with errors and
loss
new assumption:
underlying
channel can
§ che
ACKs,
retransmissions
will be of help …
but not enough
approach: sender
waits “reasonable”
nt of time for
 time
v if pkt (or ACK) just
delayed (not lost):
§ retransmission will
be  duplicate, but
seq. #’s already
handles this
§ receiver must
specify seq # of pkt
being ACKed
v requires countdown

---

## Page 39

Transport Layer 3-39
rdt3.0
sender
sndpkt = make_pkt(0, data, checksum)
udt_send(sndpkt)
start_timer
rdt_send(data)
Wait
for
K0
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
pt(rcvpkt)
cvpkt,0)
rdt_rcv(rcvpkt) &&
( corrupt(rcvpkt) ||
isACK(rcvpkt,0) )
&& isACK(r
stop_timer
stop_timer
udt_send(sndpkt)
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
Λ
rdt_rcv(rcvpkt)
Λ
Λ
Λ

---

## Page 40

Transport Layer 3-40
sender
receiver
rcv pkt0
send ack0
send ack0
rcv ack0
send pkt0
send
rcv ack1
send pkt0
rcv pkt0
pkt0
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
send pkt0
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
timeout
resend pkt1
rdt3.0 in
action

---

## Page 41

Transport Layer 3-41
rdt3.0 in
action
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
v e.g.: 1 Gbps link, 15 ms prop. delay, 8000
bit packet:
§ U sender
der busy
sending
§ if RTT=30 msec, 1KB pkt every 30 msec:
33kB/sec thruput over 1 Gbps link
v network protocol limits use of physical
resources!
L

---

## Page 43

Transport Layer 3-43
rdt3.0: stop-and-wait
operation
first packet bit transmitted, t = 0
sender
receiver
last packet bit transmitted, t = L / R
ACK
ACK arrives, send next
packet, t = RTT + L / R

---

## Page 44

Transport Layer 3-44
Pipelined protocols
pipelining: sender allows multiple, “in-
flight”, yet-to-be-acknowledged pkts
§ range of sequence numbers must be
increased
v two generic forms of pipelined protocols:
go-Back-N, selective repeat

---

## Page 45

Transport Layer 3-45
Pipelining: increased
utilization
first packet bit transmitted, t = 0
sender
receiver
last bit transmitted, t = L / R
packet bit arrives
ACK arriv
packet, t = RTT + L / R
ACK
CK
3-packet pipelining increases
 utilization by a factor of 3!

---

## Page 46

Transport Layer 3-46
Pipelined protocols:
overview
Go-back-N:
v sender can have
up to N unacked
packets in pi
ack
§ doesn’t ack packet
if there’s a gap
v sender has timer
for oldest unacked
packet
§ when timer expires,
retransmit all
unacked packets
Selective Repeat:
v sender can have up
to N unack’ed
ets in pipeline
al
t
v sender maintains
timer for each
unacked packet
§ when timer expires,
retransmit only that
unacked packet

---

## Page 47

Transport Layer 3-47
Go-Back-N: sender
v k-bit seq # in pkt header
v “window” of up to N, consecutive unack’ed pkts
allowed
v ACK(n): ACKs all pkts up to, including seq # n -
“cumulative ACK”
§ may receive duplicate ACKs (see receiver)
v timer for oldest in-flight pkt
v timeout(n): retransmit packet n and all higher seq

## pkts in window

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
rdt_send(data)
if (nextseqnum < base+N) {
    sndpkt[nextseqnum] = make_pkt(nextseqnum,data,chksum)
    udt_send(sndpkt[nextseqnum])
    if (base == nextseqnum)
       start_timer

base = getacknum(rcvpkt)+1
If (base == nextseqnum)
    stop_timer
  else
    start_timer
rdt_rcv(rcvpkt) &&
   notcorrupt(rcvpkt)
next
rdt_rcv(rcvpkt)
   && corrupt(rcvpkt)

---

## Page 49

Transport Layer 3-49
ACK-
ectly-
received pkt with highest in-order seq #
§ may generate duplicate ACKs
§ need only remember expectedseqnum
v out-of-order pkt:
§ discard (don’t buffer): no receiver buffering!
§ re-ACK pkt with highest in-order seq #
Wait
udt_send(sndpkt)
default
rdt_rcv(rcvpkt)
  && notcurrupt(rcvpkt)
  && hasseqnum(rcvpkt,expectedseqnum)
extract(rcvpkt,data)
)
kt(expectedseqnum,ACK,chksum)
expectedseqnum=1
sndpkt =
Λ
GBN: receiver extended
FSM

---

## Page 50

Transport Layer 3-50
GBN in action
send  pkt0
send  pkt1
send  pkt2
send  pkt3
(
sender
receiver
receive pkt0, send ack0
receive pkt1, send ack1

pkt 2 timeout
send  pkt2
send  pkt3
send  pkt4
send  pkt5
Xloss
, discard,
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
0 1 2
0 1 2 3 4 5 6 7 8
0 1 2 3 4 5 6 7 8
0 1 2 3 4 5 6 7 8
0 1 2 3 4 5 6 7 8
0 1 2 3 4 5 6 7 8

---

## Page 51

Transport Layer 3-51
Selective repeat
v receiver individually acknowledges all
correctly received pkts
§ buffers pkts, as needed, for eventual in-
order deliver
ACK
§ sender timer for each unACKed pkt
v sender window
§ N consecutive seq #’s
§ limits seq #s of sent, unACKed pkts

---

## Page 52

Transport Layer 3-52
Selective repeat: sender, receiver
windows

---

## Page 53

Transport Layer 3-53
Selective repeat
data from above:
v if next available seq

## in window, s

v resen
timer
ACK(n) in
[sendbase,sendbase+N]:
v mark pkt n as
received
v if n smallest
unACKed pkt,
advance window
base to next
ACK d

#

sender
pkt n in [rcvbase,
rcvbase+N-1]
v send ACK(n)

order
pkts), advance
window to next not-
yet-received pkt
pkt n in [rcvbase-
N,rcvbase-1]
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
(
sender
receiver
receive pkt0, send ack0
receive pkt1, send ack1

pkt 2 timeout
send  pkt2
Xloss
, buffer,
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
0 1 2
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
v seq #’s: 0, 1, 2,
3
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
n both cases!
rong!
v duplicate data
accepted as new
in (b)
Q: what
relationship
between seq #
size and window
size to avoid
problem in (b)?

---

## Page 56

Transport Layer 3-56
Chapter 3 outline
3.1 transport-layer
services
3.2 multiplexin
3.3 co
transport: UDP
3.4 principles of
reliable data
transfer
3.5 connection-
oriented transport:
§ flow control
§ connection
management
3.6 principles of
congestion control
3.7 TCP congestion
control

---

## Page 57

Transport Layer 3-57
TCP: Overview  RFCs: 793,1122,1323,
2018, 2581
v full duplex data:
§ bi-directional data
ow in same
nnection
v connection-
oriented:
§ handshaking
(exchange of
control msgs) inits
sender, receiver
state before data
exchange
v flow controlled:
v point-to-point:
§ one sender, one
receiver
§ no
boundaries”
v pipelined:
§ TCP congestion and
flow control set
window size

---

## Page 58

Transport Layer 3-58
TCP segment structure
source port #
dest port #
32 bits
application
data
(variable length)
sequence number
ber
head
options (variable length)
URG: urgent data
(generally not used)
ACK: ACK #
valid
PSH
(ge
RST, SYN, FIN:
connection estab
(setup, teardown
commands)
rcvr willing
to accept
counting
by bytes
of data
(not segments!)
Internet
checksum
(as in UDP)

---

## Page 59

Transport Layer 3-59
TCP seq. numbers, ACKs
sequence numbers:
§byte stream
“number” of first
byte in segmen
a
§seq #
expected from other
side
§cumulative ACK
Q: how receiver
handles out-of-order
segments
§A: TCP spec doesn’t
say, - up to
implementor
source port #
dest port #
sequence number
acknowledgement number
checksum
rwnd
urg pointer
incoming segment to sender
A
sent
ACKed
sent, not-
yet ACKed
(“in-flight”)
usable
but not
yet sent
not
usable
window size
er space
source port #
dest port #
sequence number
acknowledgement number
checksum
rwnd
urg pointer
outgoing segment from sender

---

## Page 60

Transport Layer 3-60
TCP seq. numbers, ACKs
User
types
host ACKs
receipt
of echoed
‘C’
back ‘C’
simple telnet scenario
Host B
Host A
Seq=79, ACK=43, data = ‘C’
Seq=43, ACK=80

---

## Page 61

Transport Layer 3-61
TCP round trip time,
timeout
Q: how to set
TCP timeout
value?
v too s
premature
timeout,
unnecessary
retransmissions
v too long: slow
reaction to
segment loss
Q: how to estimate
RTT?
v SampleRTT: measured
from segment

retransmissions
v SampleRTT will vary,
want estimated RTT
“smoother”
§ average several
recent
measurements, not
just current
SampleRTT

---

## Page 62

Transport Layer 3-62
EstimatedRTT = (1- )*EstimatedRTT + *SampleRTT
v exponential weighted moving average
v influence of past sample decreases
exponential
TCP round trip time,
timeout
RTT (milliseconds)
sampleRTT
EstimatedRTT
time (seconds)

---

## Page 63

Transport Layer 3-63
v timeout interval: EstimatedRTT plus “safety
margin”
§ large variation i
 larger safety
margin
Estim
TCP round trip time,
timeout
0.25)
TimeoutInterval = EstimatedRTT + 4*DevRTT
estimated RTT
“safety margin”

---

## Page 64

Transport Layer 3-64
Chapter 3 outline
3.1 transport-layer
services
3.2 multiplexin
3.3 co
transport: UDP
3.4 principles of
reliable data
transfer
3.5 connection-
oriented transport:
§ flow control
§ connection
management
3.6 principles of
congestion control
3.7 TCP congestion
control

---

## Page 65

Transport Layer 3-65
TCP reliable data transfer
v TCP creates rdt
service on top of
IP’s unreliable
§ cu
§ single
retransmission timer
v retransmissions
triggered by:
§ timeout events
§ duplicate acks

§ ignore duplicate
acks
§ ignore flow control,
congestion control

---

## Page 66

Transport Layer 3-66
TCP sender events:
data rcvd from app:
v create segment
with seq #
v seq # is byte
segm
v start timer if not
already running
§ think of timer as
for oldest unacked
segment
§ expiration interval:
TimeOutInterval
timeout:
v retransmit
segment that
d timeout
v if ack
acknowledges
previously
unacked
segments
§ update what is
known to be
ACKed
§ start timer if there

---

## Page 67

Transport Layer 3-67
TCP sender (simplified)
Nex
Sen
Λ
create segment, seq. #: NextSeqNum
pass segment to IP (i.e., “send”)
NextSeqNum = NextSeqNum + length(data)
rently not running)
r
data received from application above
retransmit not-yet-acked segment
with smallest seq. #
start timer
if (y > SendBase) {
    SendBase = y
    /*SendBase–1: last cumulatively ACKed byte*/
    if (there are currently not-yet-acked segments)
         start timer
       else stop timer
     }
ACK received, with ACK field value y

---

## Page 68

Transport Layer 3-68
TCP: retransmission
scenarios
lost ACK scenario
Host B
Host A
Seq=92, 8 bytes of data
Seq=92, 8 bytes of data
tim
ACK=100
premature timeout
Host B
Host A
Seq=92, 8 bytes of data
100
Seq=92,  8
bytes of data
ACK=120
ACK=120
SendBase=100
SendBase=120
SendBase=120
SendBase=92

---

## Page 69

Transport Layer 3-69
TCP: retransmission
scenarios
cumulative ACK
Host B
Host A
Seq=92, 8 bytes of dat
Seq=120,  15 bytes of data
timeout
ACK=120

---

## Page 70

Transport Layer 3-70
TCP ACK generation [RFC 1122, RFC
2581]
event at receiver
arrival of in-order segment with
expected seq #. All data
arrival of i
expected
segment has ACK pending
arrival of out-of-order segment
higher-than-expect seq. # .
Gap detected
arrival of segment that
partially or completely fills gap
TCP receiver action
delayed ACK. Wait up to 500ms
ment. If no next segment,
mulative
r segments
immediately send duplicate ACK,
indicating seq. # of next expected byte
immediate send ACK, provided that
segment starts at lower end of gap

---

## Page 71

Transport Layer 3-71
TCP fast
retransmit
v time-out period
often relatively
long:
§ long delay be
v detec
segments via
duplicate ACKs.
§ sender often sends
many segments
back-to-back
§ if segment is lost,
there will likely be
many duplicate
ACKs
if sender receives
Ks for same

unacked segment
with smallest seq

#

§ likely that unacked
segment lost, so
don’t wait for
timeout
TCP fast retransmit

---

## Page 72

Transport Layer 3-72
fast retransmit after sender
receipt of triple duplicate ACK
Host B
Host A
Seq=92, 8 bytes of data
timeout
ACK=100
ACK=100
ACK=100
TCP fast
retransmit
S
Seq=100, 20 bytes of data

---

## Page 73

Transport Layer 3-73
Chapter 3 outline
3.1 transport-layer
services
3.2 multiplexin
3.3 co
transport: UDP
3.4 principles of
reliable data
transfer
3.5 connection-
oriented transport:
§ flow control
§ connection
management
3.6 principles of
congestion control
3.7 TCP congestion
control

---

## Page 74

Transport Layer 3-74
TCP flow control
application
process
TCP socket
receiver buffers
IP
code
application
OS
receiver protocol stack
application may
remove data from
TCP socket buffers ….
from sender
receiver controls sender,
so sender won’t overflow
receiver’s buffer by
transmitting too much,
too fast
flow control

---

## Page 75

Transport Layer 3-75
TCP flow control
er space
TCP segment payloads
to application process
v receiver “advertises”
free buffer space by
including rwnd value in
TCP header of
§ RcvB
socket options (typical
default is 4096 bytes)
§ many operating systems
autoadjust RcvBuffer
v sender limits amount
of unacked (“in-
flight”) data to
receiver’s rwnd value
v guarantees receive
buffer will not
receiver-side buffering

---

## Page 76

Transport Layer 3-76
Chapter 3 outline
3.1 transport-layer
services
3.2 multiplexin
3.3 co
transport: UDP
3.4 principles of
reliable data
transfer
3.5 connection-
oriented transport:
§ flow control
§ connection
management
3.6 principles of
congestion control
3.7 TCP congestion
control

---

## Page 77

Transport Layer 3-77
Connection Management
before exchanging data, sender/receiver
“handshake”:
v agree to establish connection (each knowing the
other willing to establish connection)
v agree on conn
rs
connec
connection variables:
seq # client-to-server
         server-to-client
rcvBuffer size
   at server,client

network
AB
connection Variables:
seq # client-to-server
          server-to-client
rcvBuffer size
   at server,client

network
Socket clientSocket =
  newSocket("hostname","port
number");
Socket connectionSocket =
welcomeSocket.accept();

---

## Page 78

Transport Layer 3-78
Q: will 2-way
handshake always
 in network?

req_conn(x)) due to
message loss
v message reordering
v can’t “see” other side
2-way handshake:
Let’s talk
choose x
req_conn(x)
ESTAB
ESTAB
acc_conn(x)
Agreeing to establish a
connection

---

## Page 79

Transport Layer 3-79
Agreeing to establish a
connection
2-way handshake failure scenarios:
r
ESTAB
req_conn(x)
half open connection!
(no client!)
client
terminates
server
forgets x
connection
x completes
ESTAB
req_conn(x)
data(x+1)
retransmit
data(x+1)
accept
data(x+1)
choose x
req_conn(x)
ESTAB
client
terminates
choose x
req_conn(x)
ESTAB
data(x+1)
accept
data(x+1)
connection
x completes
server
forgets x

---

## Page 80

Transport Layer 3-80
TCP 3-way handshake
choose init seq num, x
send TCP SYN msg
ESTAB
ACKbit=1; ACKnum=x+1
ACKbit=1, ACKnum=y+1
received SYNACK(x)
indicates server is live;
send ACK for SYNACK;
this segment may contain
client-to-server data
received ACK(y)
indicates client is live
SYNSENT
ESTAB
VD
client state
LISTEN
server state
LISTEN

---

## Page 81

Transport Layer 3-81
TCP 3-way
handshake: FSM
closed
SYN
rcvd
SYN
sent
ESTAB
cket clientSocket =
Socket connectionSocket =
welcomeSocket.accept();
create
communic
SYNACK(seq=y,ACKnum=x+1)
ACK(ACKnum=y+1)
ACK(ACKnum=y+1)
Λ

---

## Page 82

Transport Layer 3-82
TCP: closing a connection
v client, server each close their side of
connection
§ send TCP segment with FIN bit = 1
v respond to r
ith ACK
v simultaneous FIN exchanges can be
handled

---

## Page 83

Transport Layer 3-83
F
FINbit=1, seq=y
ACKbit=1; ACKnum=y+1
can no longer
send data
LAST_ACK
CLOSED
TIMED_WAIT
 timed wait
for 2*max
segment lifetime
CLOSED
TCP: closing a connection
FIN_WAIT_1
can no longer
send but can
clientSocket.close()
client state
server state
ESTAB
ESTAB

---

## Page 84

Transport Layer 3-84
Chapter 3 outline
3.1 transport-layer
services
3.2 multiplexin
3.3 co
transport: UDP
3.4 principles of
reliable data
transfer
3.5 connection-
oriented transport:
§ flow control
§ connection
management
3.6 principles of
congestion control
3.7 TCP congestion
control

---

## Page 85

Transport Layer 3-85
congestion:
v informally: “too many sources sending
too much dat
network to
v
v manifestations:
§ lost packets (buffer overflow at
routers)
§ long delays (queueing in router
buffers)
v a top-10 problem!
Principles of congestion
control

---

## Page 86

Transport Layer 3-86
Causes/costs of congestion:
scenario 1
v two senders, two
receivers
v one router, infinite
buffers
v output link capacity:
v
v maximum per-
connection
throughput: R/2
unlimited shared
output link buffers
Host A
original data: λin
throughput: λout
R/2
R/2
λout
λin
R/2
delay
λin
v large delays as arrival
rate, λin, approaches
capacity

---

## Page 87

Transport Layer 3-87
v one router, finite buffers
v sender retransmission of timed-out
packet
§ application-la
lication-layer
: λin
finite shared output
link buffers
Host A
Host B
λout
λ'in: original data, plus
retransmitted data
Causes/costs of congestion:
scenario 2

---

## Page 88

Transport Layer 3-88
idealization: perfect
knowledge
v sender sends only
when router b
available
finite shared output
link buffers
λout
λ'in: original data, plus
retransmitted data
copy
free buffer space!
R/2
R/2
λout
λin
Causes/costs of congestion:
scenario 2
Host B
A

---

## Page 89

Transport Layer 3-89
λout
λ'in: original data, plus
retransmitted data
copy
no buffer space!
Idealization:
known loss
packets can be
lost, dropped at
router due  to f
resen
known to be lost
Causes/costs of congestion:
scenario 2
A
Host B

---

## Page 90

Transport Layer 3-90
λout
λ'in: original data, plus
retransmitted data
free buffer space!
Causes/costs of congestion:
scenario 2
Idealization:
known loss
packets can be
lost, dropped at
router due  to f
resen
known to be lost
R/2
λout
when sending at R/2,
some packets are
retransmissions but
asymptotic goodput
is still R/2 (why?)
A
Host B

---

## Page 91

Transport Layer 3-91
A
λout
λ'in
copy
free buffer space!
timeout
R/2
λout
when sending at R/2,
some packets are
retransmissions
including duplicated
that are delivered!
Host B
Realistic: duplicates
v packets can be lost,
dropped at router due
to full buffers
v sender times ou
which
Causes/costs of congestion:
scenario 2

---

## Page 92

Transport Layer 3-92
R/2
λout
when sending at R/2,
some packets are
retransmissions
including duplicated
that are delivered!
“costs” of congestion:
v more work (retrans) for given “goodput”
v unneeded retransmissions: link carries multiple
copies of pkt
§ decreasing goodput
Causes/costs of congestion:
scenario 2
Realistic: duplicates
v packets can be lost,
dropped at router due
to full buffers
v sender times ou
which

---

## Page 93

Transport Layer 3-93
v four senders
v multihop paths
v timeout/retransmit
Q: what happens as λin
and λin
’ increase ?
finite shared output
link buffers
Causes/costs of congestion:
scenario 3
Host C
Host D
A: as red  λin
’ increases, all
arriving blue pkts at upper
re dropped, blue

---

## Page 94

Transport Layer 3-94
another “cost” of congestion:
v when packet dropped, any “upstream
transmission capacity used for that
packet was wasted!
Causes/costs of congestion:
scenario 3
C/2
λout

---

## Page 95

Transport Layer 3-95
Approaches towards congestion
control
two broad approaches towards congestion
control:
end-end
v no e
feedback from
network
v congestion
inferred from
end-system
observed loss,
delay
v approach taken
by TCP
rk-assisted
v
e
feedback to end
systems
§single bit
indicating
congestion (SNA,
DECbit, TCP/IP
ECN, ATM)
§explicit rate for
sender to send at

---

## Page 96

Transport Layer 3-96
Case study: ATM ABR congestion
control
ABR: available bit
rate:
v “elastic service
§ sen
use available
bandwidth
v if sender’s path
congested:
§ sender throttled
to minimum
guaranteed rate
RM (resource
management) cells:
y sender,
et by
switches (“network-
assisted”)
§ NI bit: no increase in
rate (mild
congestion)
§ CI bit: congestion
indication
v RM cells returned to
sender by receiver, with
bit
i t
t

---

## Page 97

Transport Layer 3-97
Case study: ATM ABR congestion
control
v two-byte ER (explicit rate) field in RM cell
§ congested switch may lower ER value in cell
§ senders’ send rate thus max supportable rate
on path
v EFCI bit in data cells: set to 1 in
congested switch
§ if data cell preceding RM cell has EFCI set,
receiver sets CI bit in returned RM cell
RM cell
data cell

---

## Page 98

Transport Layer 3-98
Chapter 3 outline
3.1 transport-layer
services
3.2 multiplexin
3.3 co
transport: UDP
3.4 principles of
reliable data
transfer
3.5 connection-
oriented transport:
§ flow control
§ connection
management
3.6 principles of
congestion control
3.7 TCP congestion
control

---

## Page 99

Transport Layer 3-99
TCP congestion control: additive
increase multiplicative decrease
v approach: sender increases transmission
rate (window size), probing for usable
bandwidth, until loss occurs
§ additive inc
e  cwnd by 1
§

after loss
cwnd: TCP sender
congestion window size
AIMD saw tooth
behavior: probing
for bandwidth
 …
…. until loss occurs (then cut window in half)
time

---

## Page 100

Transport Layer 3-100
TCP Congestion Control:
details
v sender limits
transmission:
v cwnd is dynamic,
function of perceived
network congestion
TCP sending rate:
v roughly: send
wnd bytes, wait
(
cwnd
LastByteSent-
LastByteAcked
<
cwnd
sender sequence number space
rate ~~
RTT
bytes/sec

---

## Page 101

Transport Layer 3-101
TCP Slow Start
v when connection
begins, increase
rate exponentially
until first los
RT
§ done by incrementing
cwnd for every ACK
received
v summary: initial
rate is slow but
ramps up
exponentially fast
Host A
one segment
T
Host B
time
four segments

---

## Page 102

Transport Layer 3-102
TCP: detecting, reacting to
loss
v loss indicated by timeout:
§ cwnd set to 1 MSS;
§ window the
entially (as in
v loss i
Ks: TCP
RENO
§ dup ACKs indicate network capable of
delivering some segments
§ cwnd is cut in half window then grows
linearly
v TCP Tahoe always sets cwnd to 1
(timeout or 3 duplicate acks)

---

## Page 103

Transport Layer 3-103
Q: when should
the
exponential
increase
switch to
gets t
its value
before
timeout.

Implementation:
v variable ssthresh
v on loss event,
ssthresh is set to
1/2 of cwnd just
before loss event
TCP: switching from slow start
to CA

---

## Page 104

Transport Layer 3-104
Summary: TCP Congestion
Control
cwnd > ssthresh
congestion
cwnd = cwnd + MSS    (MSS/cwnd)
dupACKcount = 0
transmit new segment(s), as allowed
new ACK.
dupACKcount++
fast
recovery
cwnd = cwnd + MSS
transmit new segment(s), as allowed
duplicate ACK
ssthresh= cwnd/2
cwnd = ssthresh + 3
retransmit missing segment
dupACKcount == 3
timeout
ssthresh = cwnd/2
cwnd = 1
dupACKcount = 0
retransmit missing segment
ssthresh= cwnd/2
cwnd = ssthresh + 3
retransmit missing segment
dupACKcount == 3
cwnd = ssthresh
dupACKcount = 0
New ACK
slow
timeou
ssthresh = c
cwnd = 1 MSS
dupACKcount = 0
retransmit missing segment
cwnd = cwnd+MSS
dupACKcount = 0
transmit new segment(s), as allowed
new ACK
dupACKcount++
duplicate ACK
Λ
cwnd = 1 MSS
ssthresh = 64 KB
dupACKcount = 0
New
ACK!
New
ACK!
New
ACK!

---

## Page 105

Transport Layer 3-105
TCP throughput
v avg. TCP thruput as function of window
size, RTT?
§ ignore slow start, assume always data to send
v W: window s
s) where loss
§ av
¾ W
§ avg. thruput is 3/4W per RTT
W
W/2
4 RTT

---

## Page 106

Transport Layer 3-106
TCP Futures: TCP over “long, fat
pipes”
v example: 1500 byte segments, 100ms
RTT, want 10 Gbps throughput
v requires W =
ht segments
➜

t
o

a
c
h
i
e
v
e

1
0

G
b
p
s

t
h
r
o
u
g
h
p
u
t
,

n
e
e
d

a

l
o
s
s

r
a
t
e

o
f

L

=

2
·
1
0
-

1
0

–

a

v
e
r
y

s
m
a
l
l

l
o
s
s

r
a
t
e
!
v
n
e
w

v
e
r
s
i
o
n
s

o
f

T
C
P

f
o
r

h
i
g
h
-

s
p
e
e
d
TCP throughput = RTT
L

---

## Page 107

Transport Layer 3-107
fairness goal: if K TCP sessions share
same bottleneck link of bandwidth R,
each should have average rate of R/K
bottleneck
router
capacity R
TCP Fairness
TCP connection 2

---

## Page 108

Transport Layer 3-108
Why is TCP fair?
two competing sessions:
v additive increase gives slope of 1, as throughout
increases
v multiplicative d
es throughput
R
Connection 1 throughput
Connection 2 throug
congestion avoidance: additive increase
loss: decrease window by factor of 2
congestion avoidance: additive increase
loss: decrease window by factor of 2

---

## Page 109

Transport Layer 3-109
Fairness (more)
Fairness and UDP
v multimedia apps
often do not use
TCP
con
v instead use UDP:
§ send audio/video
at constant rate,
tolerate packet
loss
Fairness, parallel TCP
connections
v application can open
le parallel

v web browsers do this
v e.g., link of rate R
with 9 existing
connections:
§ new app asks for 1 TCP,
gets rate R/10
§ new app asks for 11 TCPs,
gets R/2

---

## Page 110

Transport Layer 3-110
Chapter 3: summary
v principles behind
transport layer
services:
§ multiplexin
§ rel
transfer
§ flow control
§ congestion control
v instantiation,
implementation in
the Internet
§ UDP
§ TCP
ext:
”
tion,
transport
layers)
v into the
network “core”
