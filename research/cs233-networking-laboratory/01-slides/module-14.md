# module-14

---

## Page 1

1
Relates to Lab 5. This is an extended module that covers TCP flow
control, congestion control, and error control in TCP.

---

## Page 2

2

Flow Control
 C
rol

---

## Page 3

3
What is Flow/Congestion/Error Control ?
• Flow Control:
Algorithms to prevent that the sender
overruns the receiver with information?
• Congestion Control:
ent that the sender
• Error Con
eal the
effects from packet losses
 The goal of each control mechanism is different.
 But the implementation is combined

---

## Page 4

TCP -> Reliable
• Traditional technique: Positive Acknowledgement
with Retransmission (PAR)
– Receiver sends
when data arrives
ackno
4

---

## Page 5

ACKs and Retransmission – Simple Method
5

---

## Page 6

Packet Loss and Error Recovery
6

---

## Page 7

Multiple Packet Transmission – Increased
Efficiency
• Allow multiple packets to be outstanding at any time
• Still require acknowledgements and retransmission
• Known as sliding
– When
s forward
7

---

## Page 8

Illustration of Sliding Window
8
Because a well-tuned sliding window protocol keeps the network
completely saturated with packets, it obtains substantially higher
throughput than a simple positive acknowledgement protocol.
Window = 3
Send Packet 4
Send Packet 5
Receive Packet 4
Receive Packet 5
Send ACK 4

---

## Page 9

TCP’s Sliding Window
• Measured in byte positions – window is 7bytes
• Bytes 1 through 2 are acknowledged
• Bytes 3 through 6 sent but not yet acknowledged
• Bytes 7 through 9 can be sent if in buffer
• Any bytes above 9 lie outside the window and cannot
be sent
9

---

## Page 10

15

---

## Page 11

16
TCP Flow Control – At Receiver
 TCP implements a form of sliding window flow control
– Sending acknowledgements is separated from setting
the window siz

win
– Acknowledgements are cumulative

---

## Page 12

17
Window Management in TCP
• The receiver returns two parameters to the sender to control
the flow
•
• I a
SeqNo= AckNo
• And number of bytes that I can receive is:
AckNo, AckNo+1, …., AckNo+Win-1
• Receiver can acknowledge data without opening the window
• Receiver can change the window size without acknowledging
data
With size up to Window size (win)
Byte # of first byte in next segment

---

## Page 13

18
Sliding Window: Example
•
Sender Acks data
•
Closes window
•
Sender Opens window

---

## Page 14

20

---

## Page 15

21
TCP Congestion Control – Implemented at
Sender to prevent overflow in the Network
• The sender uses two parameters:
– Congestion Window (cwnd)
Initial value is 1 MSS (=maximum segment size) counted in bytes
– Slow-start thres
resh)
• I

(i.e., the s
• Congestion control works in two modes:
– slow start (cwnd < ssthresh)
– congestion avoidance (cwnd >= ssthresh)

---

## Page 16

22
Slow Start
• Initial value:
– cwnd = 1 segment
• cwnd is measured in bytes
– 1 segment = MS
•
increased
– cwnd = cwnd + 1segment
– If an ACK acknowledges two or more segments (cumulative ACK),
cwnd is still increased by only 1 segment.
– Even if ACK acknowledges a segment that is smaller than MSS bytes
long, cwnd is still increased by 1 segment.
• Does Slow Start increment slowly? Not really.
In fact, the increase of cwnd can be exponential

---

## Page 17

23
Slow Start Example
• The congestion
window size grows
very rapidly
– For every ACK, w
1 irres
the number of
segments ACK’ed
• TCP slows down the
increase of cwnd and
goes into congestion
avoidance mode
when
cwnd >= ssthresh

---

## Page 18

24
Congestion Avoidance
• Congestion avoidance phase is started if cwnd has reached
the slow-start threshold value
• I
i
– cwnd
Where [cwnd] is the largest integer smaller than cwnd
• So cwnd is increased by one segment (=MSS bytes) only if all
segments have been acknowledged in the previous
congestion window size.

---

## Page 19

25
Slow Start / Congestion Avoidance

If   cwnd <= ssthresh then
else
/*  c
Each time an Ack is received :
cwnd = cwnd + 1 / [ cwnd ]
endif

---

## Page 20

26
Example  of
Slow Start/Congestion Avoidance
Assume that ssthresh = 8
Roundtrip times
Cwnd (in segments)
ssthresh

---

## Page 21

27
TCP Detection of Congestion
• TCP tries to prevent cpongestion
• However congestion can still occur. SO:
• When TCP transmits a packet, it sets a timer.
• When a packet’s tim
es it is due to
c
– Bit error
n a packet is
not acknowledged on time, a sender assumes a loss due to buffer
overflow
• Uses retransmissions as measure of congestion – when they
happen frequently - > high congestion
• Reduces the congestion window (cwnd) as retransmissions
increase

---

## Page 22

28
Detecting Congestion
• A TCP sender can detect a packet loss via:
– Timeout of a retransmission timer
• rece
n out of
order packet – i.e. received Seq No. = Ack No it sent the
sender in last packet.

---

## Page 23

29
TCP Tahoe – Classic TCP
• Congestion is assumed if sender has  timed-out or received a
duplicate ACK
• Each time when con
cw
– ssthresh is set to half the current size of the congestion
window:
ssthressh = [cwnd / 2]
– and slow-start is entered

---

## Page 24

30
Slow Start / Congestion Avoidance
• A typical plot of cwnd for a TCP connection (MSS = 1500
bytes) with TCP Tahoe:

---

## Page 25

31
TCP Error Control

---

## Page 26

Go Back N Error Control
•
Assume a sliding window protocol with a transmit (send) window size of N
•
The sender transmits bytes in its buffer up to the allowed value  - Send
window size = N
•
The receiver will discard
hat do not have the Seq.
•
•
duplicate A
k and send all
packets again starting from Seq. No = Ack No. of the last ACK it received
from the receiver
32

---

## Page 27

33
Error Control in TCP
• TCP implements a variation of the Go-back-N retransmission
scheme
• That means that if a segment is lost, all subsequent segments
are dropped by the re
as to retransmit all
s
ers
the tra
peating the
SeqNo. of the missing segment –> Duplicate ACKs (DUPAck)
• TCP Tahoe reacts after receiving the 3rd DUPAck by
retransmitting that segment and all subsequent segments.
• TCP uses cumulative ACKs. Several received segments can be
ACKed by one ACK by sending an ACKNo that corresponds to
the last correctly received consecutive segment.

---

## Page 28

34
Go-Back-N Illustrated
S
 0
3 Duplicate ACKs
A
B
S
 2
4
S
1
Se
3
ACK 4
Se
Se
ACK
Segments 5 and 6
are discarded
(out of order segments not desired in buffer)

Start Timer
for Segment 0
Start Timer
for Segment
4
ReStart Timer
for Segment 4
Lowest unACKed
segment
ACK 4

---

## Page 29

TCP Tahoe
• TCP couples error control and congestion control (i.e., it
assumes that errors (losses) are caused by congestion)
• Two conditions will cause TCP to go into Slow Start Mode
(from any state):
–
n
– When 3
t is lost,
retransmit and go back into SLOW START mode
• Note that when a segment is received by TCP and an error is
detected the receiver will discard the segment and send a
DUPAck repeating the last ACK No. it sent out.
• DUPAcks are also sent when segments are received out of
order.
35

---

## Page 30

TCP Reno
• TCP Reno allows accelerated retransmissions when you are
in Congestion Avoidance Mode - Fast Retransmit
• If the sender receives 3 Duplicate ACKs it retransmits the assumed
lost segment imm
•
– After a f
 Mode using
(current
 = new
SSThresh
• When in Fast Recovery mode:
– if a timeout occurs for retransmitted segment, you go into SLOW
START mode with SSThresh = CWND/2, and CWND = 1.
– if you receive an ACK for retransmitted segment you go back into
Congestion Avoidance
36

---

## Page 31

TCP Send Window
• In TCP we have two parameters to keep track of when
deciding how much data may be transmitted:
• Readiness of receiver to accept sent data – flow control
window
•

network c
• A sender’s Send window is therefore the min of receiver’s
flow control window and the congestion window
– flow control window is advertised by the receiver
– congestion window is computed/set at sender and adjusted based
upon feedback from the network
37
Send Window = MIN (flow control window, congestion window)

---

## Page 32

38
Retransmission Timer when Errors Occur
•
First timeout timer for a
segment is set to Estimated
RTT (round trip time)
•
The interval between
retransmission attempts
(s
inc
ret
values are not
calculation.
•
Time between retransmissions
is doubled each time
(Exponential Backoff Algorithm)
•
Timer is not increased beyond
64
•
TCP gives up after 13th attempt
1, 2, 4, 8, 16, 32, 64, 64, 64,
64, 64, 64, 64
