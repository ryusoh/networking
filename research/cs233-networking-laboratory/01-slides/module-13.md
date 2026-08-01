# module-13

---

## Page 1

1
Relates to Lab 5. First module on TCP which covers packet format, data
transfer, and connection management.

---

## Page 2

2
Overview
TCP = Transmission Control Protocol
• Connection-oriented protocol
• Provides a reliable  unicast end-to-end byte stream over an

---

## Page 3

3
Connection-Oriented
• Before any data transfer, TCP establishes a connection:
• One TCP entity is waiting for a connection (“server”)
• The other TCP entity (“client”) contacts the server
•
c
• Each con
full duplex

---

## Page 4

4
Reliable
• Byte Stream Service:
– At the sender, the byte stream from the application is broken up into
chunks which are ca
– TCP sender maintains a timer. If an ACK is not received in time from
the receiver, the segment is retransmitted
• Detecting errors:
– TCP uses a checksum to detect errors. Segments with invalid
checksums are discarded
– Each byte that is transmitted has a sequence number

---

## Page 5

5
Byte Stream Service
• To the lower layers, TCP handles data in blocks - segments
• To the higher layers TCP handles data as a sequence of
bytes and does not identify boundaries between bytes
•

---

## Page 6

6
TCP Packet Format
TCP segments have a 20-60 byte header with >= 0 bytes of
application data

---

## Page 7

7
TCP header fields
• Port Number:
• A port number identifies the process associated with a
connection.
• A pair  <IP ad
mber> identifies one
number>
<server IP address, server port
number> identify a TCP connection.

---

## Page 8

8
TCP header fields
• Sequence Number (SeqNo):
– Sequence number is 32 bits long.
– So the range of SeqNo is

stream
– An Initial Sequence Number (ISN) for a new connection is
picked randomly at each end of the connection and is
exchanged during connection establishment

---

## Page 9

9
TCP header fields
• Acknowledgement  Number (AckNo):
– Acknowledgements can be piggybacked
• a segment  from A -> B can contain an acknowledgement for data
sent in the B -> A
ts
• if a h
K flag”
– The AckNo contains the next SeqNo that a receiving host
is expecting to receive from the sender. Eg:
• The acknowledgement for a segment with sequence number “0”
and data length of 1500 bytes  is AckNo = 1500 (0-1499 = 1500
bytes, next byte is byte # 1500)
• The next segment sent from sender should have a SeqNo = 1500.

---

## Page 10

10
TCP header fields
• Data Offset -> Header Length (4bits):
– Length of header in units of 32-bit words (4bytes)
• Note: 24 = 16 (0-15)
• max
ue to the
40byte options field)
• Reserved (3bits):
– Bits left open for future use. Set to ZERO

---

## Page 11

11
TCP header fields
• Flag bits (9 x 1 bit control bits):
– NS (1 bit) – ECN-nonce concealment protection (experimental: see
RFC 3540). Proposal to prevent a receiver from hiding congested state
from a sender.
e
E
flag set
nism
– ECE (1 bit) – ECN-Echo has a dual role, depending on the value of the
SYN flag. When ECE = 1, it indicates:
• If the SYN flag is set (1) (i.e., a connection setup packet) -> the TCP
peer is ECN capable. (Used during connection setup to indicate it
will partake in congestion notification.)
• If the SYN flag is clear (0) ->  a packet with Congestion
Experienced flag set (ECN=11) in IP header was received during
normal transmission. This serves as an indication of network
congestion (or impending congestion) to the TCP sender.

---

## Page 12

ECE and Congestion Notification
12
        ECN=11
EC  ECN=00
TCP Segment
IP Datagram
Sending Host
Receiving Host

---

## Page 13

13
TCP header fields
• Flag bits contd.:
– URG (1 bit) – indicates that the Urgent pointer field is significant (has a
value) and the following bytes contain an urgent message in the range:
SeqNo = 1st by
 All
packets
ould have this
flag set.
– PSH (1 bit) – Push function. Sender asks receiver to push the buffered
data to the receiving application. Normally set by sender when the
sender’s buffer is empty – has no more data to send for now.
– RST (1 bit) – Sender tells receiver to reset the connection. Receiver of
a RST terminates the connection and indicates higher layer application
about the reset.

---

## Page 14

TCP header fields
• Flag bits contd:
– SYN (1 bit) – Synchronize sequence numbers. Only the
first packet sent from each end should have this flag set
(during connectio
n
this
 set, and
others when it is clear.
– FIN (1 bit) – Last package from sender. Sender is done
with transmitting
– Used for closing a connection
– Both sides of a connection must send a FIN
– One side can be done before the other
14

---

## Page 15

15
TCP header fields
•
Window Size:
– flow control from a receiver R limiting transmissions from a sender –
“controlling flow by R of data being sent from S -> R”
– Each side of the con
ceive window size in bytes
•
– Only val
– It indicates that the following bytes in the data field contain an urgent
message:
SeqNo = 1st byte of data field is start of urgent message
1st byte of “Normal” data starts at = SeqNo + urgent pointer

---

## Page 16

TCP header fields
•
TCP Checksum:
– TCP checksum covers both TCP Pseudo header and TCP header and
data. Pseudo header consists of:
–
IP Source address
–
IP Destination address
TCP lengt
16

---

## Page 17

17
TCP header fields
• Some Options:
The “len” field indicates length in
bytes of the option (>1byte):
a

---

## Page 18

MTU and MSS:
•
The Maximum Transmission Unit (MTU) is the maximum length of data
that can be transmitted by a protocol in one instance.
•
Ethernet interface- the MTU size of an Ethernet interface is 1500 bytes by
default
– excludes the Ethern
ailer.
•
F
– 20 byte
– 1500- 40 = 1460 byte
•
1460 is the maximum TCP payload that can be carried.
•
This is what we refer to as TCP MSS. The diagram below visualizes this
concept
•
Note: For UDP it would be 20+8=28. 1500-28=1472.
20
IP Header
TCP Header
Payload
FCFS
Ethernet Header
MTU (on Cisco router referred to as IP MTU)
TCP MSS
14 bytes
20-40 bytes
20-40 bytes
4 bytes

---

## Page 19

Path Discovery Protocol
• Used for determining the maximum transmission unit
(MTU) size on the network path between two Internet Protocol
(IP) hosts, usually with the goal of avoiding IP fragmentation
• Path MTU Discovery
he Don't
ts
•
size of th
 an Internet
Control Message Protocol (ICMP) Fragmentation
Needed (Type 3, Code 4)
• This will result in the source host reducing its MTU (via MSS)
and trying again (trial and error).
• The process is repeated until the MTU is small enough to
traverse each link on the entire path without fragmentation.
21

---

## Page 20

22
Connection Management in TCP
• Opening a TCP Connection
• Closing a TCP Connection
•
•

---

## Page 21

23
TCP Connection Establishment
• TCP uses a three-way handshake to open a connection:
(1) ACTIVE OPEN: Client sends a segment with
– SYN bit set
– port number of
(2) PASS
ent with
– SYN bit set
– initial sequence number of server, e.g. y
– ACK for ISN of client: x+1
(3) Client acknowledges by sending a segment with:
– SeqNo = x+1
– ACK ISN of server: y+1

---

## Page 22

24
Three-Way Handshake

---

## Page 23

A TCP SYN Packet
26

---

## Page 24

A TCP SYN, ACK Packet
27

---

## Page 25

A TCP ACK Packet (last in 3 way handshake
28

---

## Page 26

A TCP Data Packet (Ping)
29
Data
Data
ACK
ACK
FIN Process
SYN Process
Ping

---

## Page 27

37
TCP Connection Termination
• Each end of the data flow must be shut down independently
(“half-close”)
• If one end is done it sends a FIN segment. This means that
no more data will be
• Four step
(1) X sends a FIN to Y (active close)
(2) Y  ACKs the FIN,
(at this time: Y can still send data to X)
(3) and Y  sends a FIN to X (passive close)
(4)  X ACKs the FIN.

---

## Page 28

38
TCP Connection Termination

---

## Page 29

39
TCP States in “Normal” Connection
Lifetime

---

## Page 30

40
TCP States

---

## Page 31

41
TIME_WAIT state
TIME_WAIT = 2MSL
• When TCP is in active close state and sends the final ACK,
the connection must stay in the TIME_WAIT state for twice
the maximum seg
2M
• Why?
TCP is given a chance to resend the final ACK. (Server will
timeout after sending the first FIN segment and resend the
FIN)

---

## Page 32

42
Resetting Connections
• Resetting connections is done by setting the  RST flag
• When the RST is flag set
– Indicates to Abort (Terminate) a connection
