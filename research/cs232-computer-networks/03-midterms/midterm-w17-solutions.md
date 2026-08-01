# midterm-w17-solutions

---

## Page 1

1
Midterm - 2/15/2017
• Points pre-assigned to review questions and problems are just an indication of the ﬁnal score: partial and
unsatisfactory answer/solution will receive a fraction of the points, whereas excellent answers may exceed the
indicated points.
• Use of books/notes is forbidden.
• Indicate name and UC ID number in ALL the solution sheets. Number the solution sheets and indicate total
number of sheets (e.g., ﬁrst sheet 1/3, second sheet 2/3, third sheet 3/3).
R1 (5 Points) Consider two random variables X1 and X2, distributed according to an exponential distribution with
parameters λ1 and λ2. The expectation of the random variable X= min(X1, X2) is
a)
λ1 + λ2;
b)
min(λ1, λ2);
c)
1/(λ1 + λ2)
d)
1/ min(λ1, λ2);
R2 (10 Points) A Poisson process generates events at rate λ. Each event is discarded with probability p. What is
the rate of the resulting process?
a)
pλ
b)
p/λ
c)
(1 −p)λ
d)
(1 −p)/λ
R3 (5 Points) List and describe the sources of delay in the Internet.
Answer
Processing delay (1 pt): The time to examine the packet’s header and determine where to direct the packet. There
could be other types of processing, e.g. checking for bit-level errors.
Queuing delay (1 pt): The time for the packet to wait for earlier-arrived packets to be transmitted. It depends on
the packets in the queue when the packet arrives.
Transmission delay (1 pt): The time to transmit the packet onto the link. It depends on the length (size) of the
packet and the transmission rate of the link.
Propagation delay (1 pt): The time for the packet to travel (propagate) through the link physically. It depends on
the distance and the propagation speed on the link.
R4 (10 Points) Brieﬂy describe the salient differences between packet switching and circuit switching. Why is the
circuit switching model used in the design of the telephone network?
Answer
Difference (4 pt): In circuit switching, a physical link is established and dedicated for the call (session). All trafﬁc
goes through that link. In packet switching, data are grouped into small chunks (packets). Each packet is switched
and routed separately.
Circuit switching is used for telephone network, because (1) (3 pt) phone calls are sparse, but generate data at
relatively constant rate during the session, (2) (3 pt) circuit switching provides stable quality of service, given the
predictable rate.
R5 (5 Points) What is the main source of packet loss in packet switched wired networks?

---

## Page 2

2
Answer
Packets are dropped (1 pt) at full (1 pt) buffers (queues).
R6 (10 Points) Concisely describe the client-server and the peer-to-peer application architectures and highlight
their differences.
Answer
The client-server architecture requires always-on infrastructure servers (2 pt) that all users (clients) connect
to. In a P2P architecture, there is minimal (or no) reliance on always-on infrastructure servers. Instead, pairs of
intermittently connected hosts, called peers, communicate directly with each other (2 pt).
R7 (10Points) Describe the non persistent and persistent connection approach in HTTP. What are the pros and
cons of the two approaches?
Answer
Description (4 pt): In non-persistent HTTP, each request/response pair is sent over a separate TCP connection
(1 pt). In persistent HTTP, all of the requests and their corresponding responses are sent over the same TCP
connection.
Non-persistent HTTP allows transmission of multiple objects at the same time, but requires TCP connection
setup for each object, which results in bigger overhead. Persistent HTTP transmits the objects back-to-back in one
TCP connection, which has less overhead, but the connection is kept alive until it times out.
R8 (15 Points) List and describe the layers of the Internet stack.
Answer
Four-layer Internet stack (8 pt): Link layer, network (Internet or IP) layer, transport layer, and application
layer (2 pt each). The link layer of the Internet stack covers the physical layer and the data link layer in the OSI
model.
Refer to Kurose-Ross Section 1.5 for description of each layer.
R9 (15 Points) Brieﬂy describe the performance requirements of real-time multimedia applications. Why is Forward
Error Correction preferable to packet retransmission?
Answer
Performance requirements (8 pt): High bit rate (bandwidth), small jitter, but tolerant to non-signiﬁcant delay.
Content can be compressed for quality-bandwidth trade-off.
FEC increases the effective systems throughput, even with the extra check bits added to the data bits, by
eliminating the need to retransmit data corrupted by random noise, which is non predictable and causes jitter.
R10 (15 Points) Describe time division multiplexing in digital telephone networks.
Answer
Time division multiplexing (TDM) is a communications process that transmits two or more streaming digital
signals over a common channel (5 pt). In TDM, incoming signals are divided into equal ﬁxed-length time slots
(5 pt). After multiplexing, these signals are transmitted over a shared medium and reassembled into their original
format after de-multiplexing.
