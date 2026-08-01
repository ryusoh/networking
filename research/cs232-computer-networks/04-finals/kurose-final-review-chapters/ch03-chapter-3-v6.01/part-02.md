# ch03-chapter-3-v6.01 - Part 02 (Pages 56-110)

---

## Page 56

Transport Layer 3-56
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

## Page 57

Transport Layer 3-57
TCP: Overview  RFCs: 793,1122,1323, 2018, 2581
v full duplex data:
§ bi-directional data flow
in same connection
§ MSS: maximum segment
size
v connection-oriented:
§ handshaking (exchange
of control msgs) inits
sender, receiver state
before data exchange
v flow controlled:
§ sender will not
overwhelm receiver
v point-to-point:
§ one sender, one receiver
v reliable, in-order byte
steam:
§ no message
boundaries
v pipelined:
§ TCP congestion and
flow control set window
size

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
acknowledgement number
receive window
Urg data pointer
checksum
F
S
R
P
A
U
head
len
not
used
options (variable length)
URG: urgent data
(generally not used)
ACK: ACK #
valid
PSH: push data now
(generally not used)
RST, SYN, FIN:
connection estab
(setup, teardown
commands)

## bytes

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
§byte stream number of
first byte in segments
data
acknowledgements:
§seq # of next byte
expected from other side
§cumulative ACK
Q: how receiver handles
out-of-order segments
§A: TCP spec doesnt say,

- up to implementor
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
(in-
flight)
usable
but not
yet sent
not
usable
window size
N
sender sequence number space
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
C
host ACKs
receipt
of echoed
C
host ACKs
receipt of
C, echoes
back C
simple telnet scenario
Host B
Host A
Seq=42, ACK=79, data = C
Seq=79, ACK=43, data = C
Seq=43, ACK=80

---

## Page 61

Transport Layer 3-61
TCP round trip time, timeout
Q: how to set TCP
timeout value?
v longer than RTT
§ but RTT varies
v too short: premature
timeout, unnecessary
retransmissions
v too long: slow reaction
to segment loss
Q: how to estimate RTT?
v SampleRTT: measured
time from segment
transmission until ACK
receipt
§ ignore retransmissions
v SampleRTT will vary, want
estimated RTT smoother
§ average several recent
measurements, not just
current SampleRTT

---

## Page 62

Transport Layer 3-62
RTT: gaia.cs.umass.edu to fantasia.eurecom.fr
100
150
200
250
300
350
1
8
15
22
29
36
43
50
57
64
71
78
85
92
99
106
time (seconnds)
RTT (milliseconds)
SampleRTT
Estimated RTT
EstimatedRTT = (1- a)*EstimatedRTT + a*SampleRTT
v exponential weighted moving average
v influence of past sample decreases exponentially fast
v typical value: a = 0.125
TCP round trip time, timeout
RTT (milliseconds)
RTT: gaia.cs.umass.edu to fantasia.eurecom.fr
sampleRTT
EstimatedRTT
time (seconds)

---

## Page 63

Transport Layer 3-63
v timeout interval: EstimatedRTT plus safety margin
§ large variation in EstimatedRTT -> larger safety margin
v estimate SampleRTT deviation from EstimatedRTT:
DevRTT = (1-b)*DevRTT +
b*|SampleRTT-EstimatedRTT|
TCP round trip time, timeout
(typically, b = 0.25)
TimeoutInterval = EstimatedRTT + 4*DevRTT
estimated RTT
safety margin

---

## Page 64

Transport Layer 3-64
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

## Page 65

Transport Layer 3-65
TCP reliable data transfer
v TCP creates rdt service
on top of IPs unreliable
service
§ pipelined segments
§ cumulative acks
§ single retransmission
timer
v retransmissions
triggered by:
§ timeout events
§ duplicate acks
lets initially consider
simplified TCP sender:
§ ignore duplicate acks
§ ignore flow control,
congestion control

---

## Page 66

Transport Layer 3-66
TCP sender events:
data rcvd from app:
v create segment with
seq #
v seq # is byte-stream
number of first data
byte in  segment
v start timer if not
already running
§ think of timer as for
oldest unacked
segment
§ expiration interval:
TimeOutInterval
timeout:
v retransmit segment
that caused timeout
v restart timer
ack rcvd:
v if ack acknowledges
previously unacked
segments
§ update what is known
to be ACKed
§ start timer if there are
still unacked segments

---

## Page 67

Transport Layer 3-67
TCP sender (simplified)
wait
for
event
NextSeqNum = InitialSeqNum
SendBase = InitialSeqNum
L
create segment, seq. #: NextSeqNum
pass segment to IP (i.e., send)
NextSeqNum = NextSeqNum + length(data)
if (timer currently not running)
start timer
data received from application above
retransmit not-yet-acked segment
with smallest seq. #
start timer
timeout
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
TCP: retransmission scenarios
lost ACK scenario
Host B
Host A
Seq=92, 8 bytes of data
ACK=100
Seq=92, 8 bytes of data
X
timeout
ACK=100
premature timeout
Host B
Host A
Seq=92, 8 bytes of data
ACK=100
Seq=92,  8
bytes of data
timeout
ACK=120
Seq=100, 20 bytes of data
ACK=120
SendBase=100
SendBase=120
SendBase=120
SendBase=92

---

## Page 69

Transport Layer 3-69
TCP: retransmission scenarios
X
cumulative ACK
Host B
Host A
Seq=92, 8 bytes of data
ACK=100
Seq=120,  15 bytes of data
timeout
Seq=100, 20 bytes of data
ACK=120

---

## Page 70

Transport Layer 3-70
TCP ACK generation [RFC 1122, RFC 2581]
event at receiver
arrival of in-order segment with
expected seq #. All data up to
expected seq # already ACKed
arrival of in-order segment with
expected seq #. One other
segment has ACK pending
arrival of out-of-order segment
higher-than-expect seq. # .
Gap detected
arrival of segment that
partially or completely fills gap
TCP receiver action
delayed ACK. Wait up to 500ms
for next segment. If no next segment,
send ACK
immediately send single cumulative
ACK, ACKing both in-order segments
immediately send duplicate ACK,
indicating seq. # of next expected byte
immediate send ACK, provided that
segment starts at lower end of gap

---

## Page 71

Transport Layer 3-71
TCP fast retransmit
v time-out period  often
relatively long:
§ long delay before
resending lost packet
v detect lost segments
via duplicate ACKs.
§ sender often sends
many segments back-
to-back
§ if segment is lost, there
will likely be many
duplicate ACKs.
if sender receives 3
ACKs for same data
(triple duplicate ACKs),
resend unacked
segment with smallest
seq #
§ likely that unacked
segment lost, so dont
wait for timeout
TCP fast retransmit
(triple duplicate ACKs),

---

## Page 72

Transport Layer 3-72
X
fast retransmit after sender
receipt of triple duplicate ACK
Host B
Host A
Seq=92, 8 bytes of data
ACK=100
timeout
ACK=100
ACK=100
ACK=100
TCP fast retransmit
Seq=100, 20 bytes of data
Seq=100, 20 bytes of data

---

## Page 73

Transport Layer 3-73
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

## Page 74

Transport Layer 3-74
TCP flow control
application
process
TCP socket
receiver buffers
TCP
code
IP
code
application
OS
receiver protocol stack
application may
remove data from
TCP socket buffers ….
… slower than TCP
receiver is delivering
(sender is sending)
from sender
receiver controls sender, so
sender wont overflow
receivers buffer by transmitting
too much, too fast
flow control

---

## Page 75

Transport Layer 3-75
TCP flow control
buffered data
free buffer space
rwnd
RcvBuffer
TCP segment payloads
to application process
v receiver advertises free
buffer space by including
rwnd value in TCP header
of receiver-to-sender
segments
§ RcvBuffer size set via
socket options (typical default
is 4096 bytes)
§ many operating systems
autoadjust RcvBuffer
v sender limits amount of
unacked (in-flight) data to
receivers rwnd value
v guarantees receive buffer
will not overflow
receiver-side buffering

---

## Page 76

Transport Layer 3-76
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

## Page 77

Transport Layer 3-77
Connection Management
before exchanging data, sender/receiver handshake:
v agree to establish connection (each knowing the other willing
to establish connection)
v agree on connection parameters
connection state: ESTAB
connection variables:
seq # client-to-server
server-to-client
rcvBuffer size
at server,client
application
network
connection state: ESTAB
connection Variables:
seq # client-to-server
server-to-client
rcvBuffer size
at server,client
application
network
Socket clientSocket =
newSocket("hostname","port
number");
Socket connectionSocket =
welcomeSocket.accept();

---

## Page 78

Transport Layer 3-78
Q: will 2-way handshake
always work in
network?
v variable delays
v retransmitted messages
(e.g. req_conn(x)) due to
message loss
v message reordering
v cant see other side
2-way handshake:
Lets talk
OK
ESTAB
ESTAB
choose x
req_conn(x)
ESTAB
ESTAB
acc_conn(x)
Agreeing to establish a connection

---

## Page 79

Transport Layer 3-79
Agreeing to establish a connection
2-way handshake failure scenarios:
retransmit
req_conn(x)
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
retransmit
req_conn(x)
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
ESTAB
acc_conn(x)
client
terminates
ESTAB
choose x
req_conn(x)
ESTAB
acc_conn(x)
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
SYNbit=1, Seq=x
choose init seq num, x
send TCP SYN msg
ESTAB
SYNbit=1, Seq=y
ACKbit=1; ACKnum=x+1
choose init seq num, y
send TCP SYNACK
msg, acking SYN
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
SYN RCVD
client state
LISTEN
server state
LISTEN

---

## Page 81

Transport Layer 3-81
TCP 3-way handshake: FSM
closed
L
listen
SYN
rcvd
SYN
sent
ESTAB
Socket clientSocket =
newSocket("hostname","port
number");
SYN(seq=x)
Socket connectionSocket =
welcomeSocket.accept();
SYN(x)
SYNACK(seq=y,ACKnum=x+1)
create new socket for
communication back to client
SYNACK(seq=y,ACKnum=x+1)
ACK(ACKnum=y+1)
ACK(ACKnum=y+1)
L

---

## Page 82

Transport Layer 3-82
TCP: closing a connection
v client, server each close their side of connection
§ send TCP segment with FIN bit = 1
v respond to received FIN with ACK
§ on receiving FIN, ACK can be combined with own FIN
v simultaneous FIN exchanges can be handled

---

## Page 83

Transport Layer 3-83
FIN_WAIT_2
CLOSE_WAIT
FINbit=1, seq=y
ACKbit=1; ACKnum=y+1
ACKbit=1; ACKnum=x+1
wait for server
close
can still
send data
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
FINbit=1, seq=x
can no longer
send but can
receive data
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

## Page 85

Transport Layer 3-85
congestion:
v informally: too many sources sending too much
data too fast for network to handle
v different from flow control!
v manifestations:
§ lost packets (buffer overflow at routers)
§ long delays (queueing in router buffers)
v a top-10 problem!
Principles of congestion control

---

## Page 86

Transport Layer 3-86
Causes/costs of congestion: scenario 1
v two senders, two
receivers
v one router, infinite
buffers
v output link capacity: R
v no retransmission
v maximum per-connection
throughput: R/2
unlimited shared
output link buffers
Host A
original data: lin
Host B
throughput: lout
R/2
R/2
lout
lin
R/2
delay
lin
v large delays as arrival rate, lin,
approaches capacity

---

## Page 87

Transport Layer 3-87
v one router, finite buffers
v sender retransmission of timed-out packet
§ application-layer input = application-layer output: lin =
lout
§ transport-layer input includes retransmissions : lin
lin
finite shared output
link buffers
Host A
lin : original data
Host B
lout
l'in: original data, plus
retransmitted data

Causes/costs of congestion: scenario 2

---

## Page 88

Transport Layer 3-88
idealization: perfect
knowledge
v sender sends only when
router buffers available
finite shared output
link buffers
lin : original data
lout
l'in: original data, plus
retransmitted data
copy
free buffer space!
R/2
R/2
lout
lin
Causes/costs of congestion: scenario 2
Host B
A

---

## Page 89

Transport Layer 3-89
lin : original data
lout
l'in: original data, plus
retransmitted data
copy
no buffer space!
Idealization: known loss
packets can be lost,
dropped at router due
to full buffers
v sender only resends if
packet known to be lost
Causes/costs of congestion: scenario 2
A
Host B

---

## Page 90

Transport Layer 3-90
lin : original data
lout
l'in: original data, plus
retransmitted data
free buffer space!
Causes/costs of congestion: scenario 2
Idealization: known loss
packets can be lost,
dropped at router due
to full buffers
v sender only resends if
packet known to be lost
R/2
R/2
lin
lout
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
lin
lout
l'in
copy
free buffer space!
timeout
R/2
R/2
lin
lout
when sending at R/2,
some packets are
retransmissions
including duplicated
that are delivered!
Host B
Realistic: duplicates
v packets can be lost, dropped
at router due  to full buffers
v sender times out prematurely,
sending two copies, both of
which are delivered
Causes/costs of congestion: scenario 2

---

## Page 92

Transport Layer 3-92
R/2
lout
when sending at R/2,
some packets are
retransmissions
including duplicated
that are delivered!
costs of congestion:
v more work (retrans) for given goodput
v unneeded retransmissions: link carries multiple copies of pkt
§ decreasing goodput
R/2
lin
Causes/costs of congestion: scenario 2
Realistic: duplicates
v packets can be lost, dropped
at router due  to full buffers
v sender times out prematurely,
sending two copies, both of
which are delivered

---

## Page 93

Transport Layer 3-93
v four senders
v multihop paths
v timeout/retransmit
Q: what happens as lin and lin
increase ?
finite shared output
link buffers
Host A
lout
Causes/costs of congestion: scenario 3
Host B
Host C
Host D
lin : original data
l'in: original data, plus
retransmitted data
A: as red  lin increases, all arriving
blue pkts at upper queue are
dropped, blue throughput g 0

---

## Page 94

Transport Layer 3-94
another cost of congestion:
v when packet dropped, any upstream
transmission capacity used for that packet was
wasted!
Causes/costs of congestion: scenario 3
C/2
C/2
lout
lin

---

## Page 95

Transport Layer 3-95
Approaches towards congestion control
two broad approaches towards congestion control:
end-end congestion
control:
v no explicit feedback
from network
v congestion inferred
from end-system
observed loss, delay
v approach taken by
TCP
network-assisted
congestion control:
v routers provide
feedback to end systems
§single bit indicating
congestion (SNA,
DECbit, TCP/IP ECN,
ATM)
§explicit rate for
sender to send at

---

## Page 96

Transport Layer 3-96
Case study: ATM ABR congestion control
ABR: available bit rate:
v elastic service
v if senders path
underloaded:
§ sender should use
available bandwidth
v if senders path
congested:
§ sender throttled to
minimum guaranteed
rate
RM (resource management)
cells:
v sent by sender, interspersed
with data cells
v bits in RM cell set by switches
(network-assisted)
§ NI bit: no increase in rate
(mild congestion)
§ CI bit: congestion
indication
v RM cells returned to sender
by receiver, with bits intact

---

## Page 97

Transport Layer 3-97
Case study: ATM ABR congestion control
v two-byte ER (explicit rate) field in RM cell
§ congested switch may lower ER value in cell
§ senders send rate thus max supportable rate on path
v EFCI bit in data cells: set to 1 in congested switch
§ if data cell preceding RM cell has EFCI set, receiver sets
CI bit in returned RM cell
RM cell
data cell

---

## Page 98

Transport Layer 3-98
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

## Page 99

Transport Layer 3-99
TCP congestion control: additive increase
multiplicative decrease
v approach: sender increases transmission rate (window
size), probing for usable bandwidth, until loss occurs
§ additive increase: increase  cwnd by 1 MSS every
RTT until loss detected
§ multiplicative decrease: cut cwnd in half after loss
cwnd: TCP sender
congestion window size
AIMD saw tooth
behavior: probing
for bandwidth
additively increase window size …
…. until loss occurs (then cut window in half)
time

---

## Page 100

Transport Layer 3-100
TCP Congestion Control: details
v sender limits transmission:
v cwnd is dynamic, function
of perceived network
congestion
TCP sending rate:
v roughly: send cwnd
bytes, wait RTT for
ACKS, then send
more bytes
last byte
ACKed
sent, not-
yet ACKed
(in-
flight)
last byte
sent
cwnd
LastByteSent-
LastByteAcked
<
cwnd
sender sequence number space
rate ~~
cwnd
RTT
bytes/sec

---

## Page 101

Transport Layer 3-101
TCP Slow Start
v when connection begins,
increase rate
exponentially until first
loss event:
§ initially cwnd = 1 MSS
§ double cwnd every RTT
§ done by incrementing
cwnd for every ACK
received
v summary: initial rate is
slow but ramps up
exponentially fast
Host A
one segment
RTT
Host B
time
two segments
four segments

---

## Page 102

Transport Layer 3-102
TCP: detecting, reacting to loss
v loss indicated by timeout:
§ cwnd set to 1 MSS;
§ window then grows exponentially (as in slow start)
to threshold, then grows linearly
v loss indicated by 3 duplicate ACKs: TCP RENO
§ dup ACKs indicate network capable of  delivering
some segments
§ cwnd is cut in half window then grows linearly
v TCP Tahoe always sets cwnd to 1 (timeout or 3
duplicate acks)

---

## Page 103

Transport Layer 3-103
Q: when should the
exponential
increase switch to
linear?
A: when cwnd gets
to 1/2 of its value
before timeout.
Implementation:
v variable ssthresh
v on loss event, ssthresh
is set to 1/2 of cwnd just
before loss event
TCP: switching from slow start to CA

---

## Page 104

Transport Layer 3-104
Summary: TCP Congestion Control
timeout
ssthresh = cwnd/2
cwnd = 1 MSS
dupACKcount = 0
retransmit missing segment
L
cwnd > ssthresh
congestion
avoidance
cwnd = cwnd + MSS    (MSS/cwnd)
dupACKcount = 0
transmit new segment(s), as allowed
new ACK.
dupACKcount++
duplicate ACK
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
start
timeout
ssthresh = cwnd/2
cwnd = 1 MSS
dupACKcount = 0
retransmit missing segment
cwnd = cwnd+MSS
dupACKcount = 0
transmit new segment(s), as allowed
new ACK
dupACKcount++
duplicate ACK
L
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
v avg. TCP thruput as function of window size, RTT?
§ ignore slow start, assume always data to send
v W: window size (measured in bytes) where loss occurs
§ avg. window size (# in-flight bytes) is ¾ W
§ avg. thruput is 3/4W per RTT
W
W/2
avg TCP thruput = 3
4
W
RTT bytes/sec

---

## Page 106

Transport Layer 3-106
TCP Futures: TCP over long, fat pipes
v example: 1500 byte segments, 100ms RTT, want
10 Gbps throughput
v requires W = 83,333 in-flight segments
v throughput in terms of segment loss probability, L
[Mathis 1997]:
 to achieve 10 Gbps throughput, need a loss rate of L
= 2·10-10  – a very small loss rate!
v new versions of TCP for high-speed
TCP throughput = 1.22 . MSS
RTT
L

---

## Page 107

Transport Layer 3-107
fairness goal: if K TCP sessions share same
bottleneck link of bandwidth R, each should have
average rate of R/K
TCP connection 1
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
v additive increase gives slope of 1, as throughout increases
v multiplicative decrease decreases throughput proportionally
R
R
equal bandwidth share
Connection 1 throughput
Connection 2 throughput
congestion avoidance: additive increase
loss: decrease window by factor of 2
congestion avoidance: additive increase
loss: decrease window by factor of 2

---

## Page 109

Transport Layer 3-109
Fairness (more)
Fairness and UDP
v multimedia apps often
do not use TCP
§ do not want rate
throttled by congestion
control
v instead use UDP:
§ send audio/video at
constant rate, tolerate
packet loss
Fairness, parallel TCP
connections
v application can open
multiple parallel
connections between two
hosts
v web browsers do this
v e.g., link of rate R with 9
existing connections:
§ new app asks for 1 TCP, gets rate
R/10
§ new app asks for 11 TCPs, gets R/2

---

## Page 110

Transport Layer 3-110
Chapter 3: summary
v principles behind
transport layer services:
§ multiplexing,
demultiplexing
§ reliable data transfer
§ flow control
§ congestion control
v instantiation,
implementation in the
Internet
§ UDP
§ TCP
next:
v leaving the
network edge
(application,
transport layers)
v into the network
core
