# lec-06 - Part 02 (Pages 45-88)

---

## Page 45

Transport Layer 3-55
Selective repeat
data from above:
§ if available seq # in
window, send pkt
timeout(n):
§ resend pkt n, restart timer
ACK(n) in [sendbase,sendbase+N]:
§ mark pkt n as received
§ if n oldest unACKed pkt,
advance window base to
next unACKed seq #
§ restart timer for next
unACKed seq #
sender
pkt n in [rcvbase, rcvbase+N-1]
§ send ACK(n)
§ out-of-order: buffer
§ in-order: delivery (like
GBN, deliver buffered, in-
order pkts), advance
window to next not-yet-
received pkt
pkt n in [rcvbase-N,rcvbase-1]
§ ACK(n) (ACK lost, repeat)
otherwise:
§ ignore
receiver

---

## Page 46

Transport Layer 3-56
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
SR: every pkt has
a timer or oldest
unACKed
window moves forward to cover all now ACKed pkts that are in seq.
Here it will be 6 as 3,4,5 all previously ACKed when ack2 sent/arrives
Q: window at receiver?
rcv pkt3; deliver pkt0, pkt1

---

## Page 47

3-57
Selective repeat:
dilemma
example:
§ seq #s: 0, 1, 2, 3
§ window size=3
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
§ receiver sees no
difference in two
scenarios!
§ duplicate data
accepted as new in (b)
A: window size must be << than
seq # space
Q: what relationship
between seq # size and
window size to avoid
problem in (b)?
à half or less

---

## Page 48

Transport Layer 3-58
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

## Page 49

Transport Layer 3-59
TCP: Overview  RFCs: 793,1122,1323, 2018, 2581
§ full duplex data:
• bi-directional data flow
in same connection
• MSS: maximum segment
size
§ connection-oriented:
• handshaking (exchange
of control msgs) inits
sender, receiver state
before data exchange
§ flow controlled:
• sender will not
overwhelm receiver
§ point-to-point:
• one sender, one receiver
§ reliable, in-order byte
stream:
• no message
boundaries
§ pipelined:
• TCP congestion and
flow control set window
size

---

## Page 50

Transport Layer 3-60
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
URG: =1
urgent data
(generally not used)
ACK: =1
ACK # valid
PSH: =1
push data now
(generally not used)
RST, SYN, FIN: =1
connection estabishment
(reset, setup, teardown)

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

## Page 51

61
Sequence Nos
§ sequence number is 32 bits long
• the range of SeqNo is
0 <= SeqNo <= 232 -1  » 4.3 Gbyte
• a sequence number identifies a specific byte in
the byte stream. Each byte has a sequence
number
• an Initial Sequence Number (ISN) for a new
connection is picked randomly at each end of
the connection and is exchanged during
connection establishment
0
1
1499
5500
1500
2590
2591
//
//
//
//
//
//
Segment 1 – 0 to1499 bytes
Segment 2 – 1500 to 2590 bytes
Segment 3 – 2591 to 5500 bytes

---

## Page 52

62
Acknowledgement Nos
§ ACKs can be piggybacked
• a segment  from A -> B can contain an acknowledgement for data
sent in the B -> A direction
§ a hosts uses the acknowledgment field to ACK a pkt
• if a host sends an ACK# in a segment it sets the  ACK flag
§ the ACK# contains the next Seq# that a receiving
host is expecting to receive from the sender.
• the ACK# for a segment with Seq# 0 and data length of 1500 bytes
(0-1499)  is  = 1500
• next byte TCP receiver is expecting is byte # 1500 (received 0-1499)
• next segment sent from sender should have Seq# = 1500.
0
1
1499
5500
1500
2590
2591
//
//
//
//
//
//
Segment 1 – 0 to1499 bytes
Segment 2 – 1500 to 2590 bytes
Segment 3 – 2591 to 5500 bytes

---

## Page 53

Transport Layer 3-63
TCP seq. numbers, ACKs
sequence numbers:
• byte stream number of
first byte in segment’s
data
acknowledgements:
• seq # of next byte
expected from other side
• cumulative ACK
Q: how receiver handles
out-of-order segments?
A: TCP spec doesn’t say, -
up to implementor
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
(in-
flight)
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

## Page 54

Transport Layer 3-64
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
ACK = 42 + ”C”
“C” = 1 byte
à 42+1 = 43

---

## Page 55

Transport Layer 3-65
TCP round trip time, timeout
Q: how to set TCP
timeout value?
§ longer than RTT
• but RTT varies
§ too short: premature
timeout, unnecessary
retransmissions
§ too long: slow reaction
to segment loss
Q: how to estimate RTT?
§ SampleRTT: measured
time from segment
transmission until ACK
receipt
• ignore retransmissions
§ SampleRTT will vary, want
estimated RTT smoother
• average over several
recent measurements, not
just current SampleRTT

---

## Page 56

Transport Layer 3-66
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
§ exponential weighted moving average
§ influence of past sample decreases exponentially fast
§ typical value: a = 0.125
TCP round trip time, timeout
RTT (milliseconds)
RTT: gaia.cs.umass.edu to fantasia.eurecom.fr
sampleRTT
EstimatedRTT
time (seconds)

---

## Page 57

Transport Layer 3-67
§ timeout interval: EstimatedRTT plus safety margin
• large variation in EstimatedRTT -> larger safety margin
§ estimate SampleRTT deviation from EstimatedRTT:
DevRTT = (1-b)*DevRTT +
b*|SampleRTT-EstimatedRTT|
TCP round trip time, timeout
(typically, b = 0.25)
TimeoutInterval = EstimatedRTT + 4*DevRTT
estimated RTT
safety margin

---

## Page 58

Transport Layer 3-68
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

## Page 59

Transport Layer 3-69
TCP reliable data transfer
§ TCP creates a reliable
service on top of IP’s
unreliable service
• pipelined segments
• cumulative acks
• single retransmission
timer
§ retransmissions
triggered by:
• timeout events
• duplicate acks
lets initially consider
simplified TCP sender:
• ignore duplicate acks
• ignore flow control,
congestion control

---

## Page 60

Transport Layer 3-70
TCP sender events:
data rcvd from app:
§ create segment with
seq #
§ seq # is byte-stream
number of first data
byte in  segment
§ start timer if not
already running
• think of timer as for
oldest unacked
segment
• expiration interval:
TimeOutInterval
timeout:
§ retransmit segment
that caused timeout
§ restart timer
ack rcvd:
§ if ack acknowledges
previously unacked
segments
• update what is known
to be ACKed
• start timer if there are
still unacked segments

---

## Page 61

Transport Layer 3-72
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
Seq=92,  8 bytes of data
ACK=120
timeout
Seq=100, 20 bytes of data
ACK=120
SendBase=100
SendBase=120
SendBase=120
SendBase=92
timeout

---

## Page 62

Transport Layer 3-73
TCP: retransmission scenarios
X
timeout better estimate, cumulative ACK
Host B
Host A
Seq=92, 8 bytes of data
ACK=100
Seq=120,  15 bytes of data
timeout
Seq=100, 20 bytes of data
ACK=120

---

## Page 63

Transport Layer 3-74
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

## Page 64

Transport Layer 3-75
TCP fast retransmit
§ time-out period  often
relatively long:
• long delay before
resending lost packet
§ detect lost segments
via duplicate ACKs.
• sender often sends
many segments back-
to-back
• if segment is lost, there
will likely be many
duplicate ACKs (every
out of order segment
will generate an ACK).
§
if sender receives 1+3
ACKs for same data
(i.e., original + triple
or 3” duplicate
ACKs),
§
resend unacked
segment with smallest
seq #
•
likely that unacked
segment lost, so don’t
wait for timeout
TCP fast retransmit
Note: triple” duplicate ACKs, means one ACK
and 2 duplicates of that ACK

---

## Page 65

Transport Layer 3-76
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

## Page 66

Transport Layer 3-77
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

## Page 67

Transport Layer 3-78
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
-> this may cause
buffer overflow
from sender
receiver controls sender, so sender
won’t overflow receiver’s buffer by
transmitting too much, too fast
flow control

---

## Page 68

Transport Layer 3-79
TCP flow control (FC)
§ receiver advertises free buffer
space by including rwnd value in
TCP header of receiver-to-sender
segments
• RcvBuffer size set via socket
options (typical default is 4096
bytes)
• many operating systems auto
adjust RcvBuffer
§ sender limits amount of unacked
(in-flight) data to receivers
rwnd value (changes value of
sending window à FC window =
rwnd)
§ guarantees receive buffer will not
overflow
buffered data
free buffer space
rwnd
RcvBuffer
TCP segment payloads
to application process
receiver-side buffering
source port #
dest port #
sequence number
acknowledgement number
checksum
rwnd
urg pointer
segment sent to sender from receiver
original sending window
rwnd window

---

## Page 69

Transport Layer 3-80
TCP flow control (FC)
§ receiver advertises free buffer
space by including rwnd value in
TCP header of receiver-to-sender
segments
• RcvBuffer size set via socket
options (typical default is 4096
bytes)
• many operating systems auto
adjust RcvBuffer
§ sender limits amount of unacked
(in-flight) data to receivers
rwnd value (changes value of
sending window à FC window =
rwnd)
§ guarantees receive buffer will not
overflow
buffered data
free buffer space
rwnd
RcvBuffer
TCP segment payloads
to application process
receiver-side buffering
source port #
dest port #
sequence number
acknowledgement number
checksum
rwnd
urg pointer
segment sent to sender from receiver
original sending window
rwnd window
if rwnd > unACKed,
then sender can send
more packets up to rwnd

---

## Page 70

81
Example
3K
2K SeqNo=0
Receiver
Buffer
0
4K
Sender
sends 2K
of data
2K
AckNo=2048 Win=2048
Sender
sends 2K
of data
2K SeqNo=2048
4K
AckNo=4096 Win=0
AckNo=4096 Win=1024
Sender blocked
sender ACKs data
closes window
sender opens window again

---

## Page 71

Transport Layer 3-82
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

## Page 72

Transport Layer 3-83
Connection Management
before exchanging data, sender/receiver handshake:
§ agree to establish connection (each knowing the other willing
to establish connection)
§ agree on connection parameters
connection state: ESTAB
connection variables:
seq # client-to-server
server-to-client
rcvBuffer size
at server, client
application
network
connection state: ESTAB
connection Variables:
seq # client-to-server
server-to-client
rcvBuffer size
at server, client
application
network
Socket clientSocket =
newSocket("hostname","port
number");
Socket connectionSocket =
welcomeSocket.accept();
TCP

---

## Page 73

Transport Layer 3-84
Q: will 2-way handshake
always work in
network?
A: No
§ variable delays
§ retransmitted messages (e.g.
req_conn(x)) due to
message loss
§ message reordering
§ cant see other side
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

## Page 74

Transport Layer 3-86
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

## Page 75

Transport Layer 3-88
TCP: closing a connection
§ client, server each close their side of connection
• send TCP segment with FIN bit = 1
§ respond to received FIN with ACK
• on receiving FIN, ACK can be combined with own FIN
§ simultaneous FIN exchanges can be handled

---

## Page 76

Transport Layer 3-89
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

## Page 77

Transport Layer 3-90
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

## Page 78

Transport Layer 3-91
congestion:
§ informally: too many sources sending too much
data too fast for network to handle
§ different from flow control!
§ manifestations:
• lost packets (buffer overflow at routers)
• long delays (queueing in router buffers)
Principles of congestion control

---

## Page 79

Transport Layer 3-101
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

## Page 80

Transport Layer 3-102
TCP congestion control: principles
§ approach: sender increases transmission rate (window
size), probing for usable bandwidth, until loss occurs
• Additive Increase: increase  cwnd by 1 MSS every
RTT (i.e., received ACK) until loss detected
• Multiplicative Decrease: cut cwnd in half after loss
cwnd: TCP sender
congestion window size
AIMD saw tooth
behavior: probing
for bandwidth
additively increase window size …
…. until loss occurs (then cut window in half)
time

---

## Page 81

Transport Layer 3-103
TCP Congestion Control: details
§ sender limits transmission:
§ cwnd is dynamic, function
of perceived network
congestion
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

---

## Page 82

Transport Layer 3-104
TCP Slow Start
§ when connection begins,
increase rate exponentially
until first loss event or
threshold is reached, after
which cwnd grows more
slowly (linearly - congestion
avoidance CA phase):
• initially cwnd = 1 MSS
• double cwnd every RTT
• done by incrementing cwnd for
every ACK received
§ summary: initial rate is slow
but ramps up exponentially
fast – 1, 2, 4..
§ linear growth after threshold
Host A
one segment
RTT
Host B
time
two segments
four segments

---

## Page 83

Transport Layer 3-105
TCP: detecting, reacting to loss
§ loss indicated by timeout:
• cwnd set to 1 MSS again;
• window then grows exponentially (as in slow start) to
threshold, then grows linearly
• loss indicated by 3 duplicate ACKs (1+3 in total):
• TCP Tahoe sets cwnd to 1 MSS and goes to slow start again
(same behavior as for timeout)
• resends packet
§ TCP RENO
• dup ACKs indicate network capable of  delivering some
segments
• cwnd is cut in half window
• resends packet
• goes into fast recovery – if it receives ACK it stays in linear
mode, else it goes into slow start.

---

## Page 84

Transport Layer 3-106
Q: when should the
exponential
increase switch to
linear?
A: when cwnd gets
to a threshold.
Implementation:
§ variable ssthresh,
starts with default value
§ on loss event, ssthresh
is set to 1/2 of cwnd just
before loss event
TCP: switching from slow start to CA
Note: here we show Reno in fast recovery mode.

---

## Page 85

Transport Layer 3-110
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

## Page 86

Transport Layer 3-111
Why is TCP fair?
two competing sessions:
§ additive increase gives slope of 1, as throughout increases
§ multiplicative decrease decreases throughput proportionally
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

## Page 87

Transport Layer 3-112
Fairness (more)
Fairness and UDP
§ multimedia apps often
do not use TCP
• do not want rate
throttled by congestion
control
§ instead use UDP:
• send audio/video at
constant rate, tolerate
packet loss
Fairness, parallel TCP
connections
§ application can open
multiple parallel
connections between
two hosts
§ web browsers do this
§ e.g., link of rate R with 9
existing connections:
• new app asks for 1 TCP, gets
rate R/10 (1/(9+1=10)R)
• new app asks for 11 TCPs,
gets ~ R/2 (11/(9+11=20)R)

---

## Page 88

Transport Layer 3-113
network-assisted congestion control:
§ two end points negotiated ECN capability in setup phase with options in SYN,
SYN ACK packets)
§ two bits in IP header (ToS field) marked by network router to indicate
congestion capability (01 or 10) and congestion (11)
§ congestion indication carried to receiving host (packet not dropped)
§ receiver (seeing 11 in IP datagram) sets ECE bit on receiver-to-sender ACK
segment to notify sender of congestion (unused flag fields in TCP)
§ sender reduces cwnd and sets CRW bit (second unused flag bit) on next
segment transmission
Explicit Congestion Notification (ECN)
source
application
transport
network
link
physical
destination
application
transport
network
link
physical
ECN=01
ECN=11
ECE=1
IP datagram
TCP ACK segment
