# midterm-ex

---

## Page 1

R1 (10Points) Why is circuit switching used instead of packet switching in the public
telephone network? Why is packet switching more efficient in the Internet
infrastructure?

Because when telephone first built, it’s transmitted by analog signal, with circuit
switching, the network can guarantee the service in a good, continuous quality, and
without long package delay. Packet switching on the other hand is implemented on
our internet, and is more efficient because it won’t waste any resource if the
particular sender is not sending data. Other people could use the same frequency or
same time-division slot to transmit at the same time.

R2 (10Points) List and describe the sources of delay in the Internet.

Propagation delay – the delay time which occurs when the package are transmitted
through the hardware, such as the wire. It may occur some physical, collision delay.
It’s about the distance.
Transmission delay – The time which router need to push all the data outside, it’s
about the transmission rate and the packet’s size.
Queuing delay – if the receive router’s can’t handle all the data that fast, the arriving
g packet has to wait at the buffer
Processing delay – the time which the router analyze the header, encode or decode
the packet.

R3 (10Points) Describe the non persistent and persistent connection approach in
HTTP. What are the pros and cons of the two approaches?

When Client ask a page downloading from server, the element is transferred through
TCP. With non persistent mechanism, TCP has to establish a connection every time
when the server needs to download each element, which will cause a lot of RTT.
With persistent connection, TCP only request one connection, and transfer all the
elements, which will save a lot of Acking(checking is the client ready for receiving
packet)
What is the cons of persistent connection?

---

## Page 2

R4 (15Points) Briefly describe the performance requirements of real-time multimedia
applications. Why is Forward Error Correction preferable to packet retransmission?
Briefly describe the interleaving technique and explain why it is used. R5 (10Points)

Real-time multimedia such as VoIP have really low tolerance for delaying and loss-
package, so the basic requirements is to keep the download rate, and use fixed
played out delay or adaptive played out delay to remove jitter.
Forward Error Correction is to transmit a next chunk’s data in a lower quality. If in the
future the packet Is drop, the system will get the lower quality data from previous
transmission and played. This mechanism won’t affect the bandwith.
First, original stream is putting the packet in order it works is like 圖  1234 5678 9
10 11 12, instead of transmitting in order, the packet is devided separately. By doing
so, when the packet is transmitted, even if some of it is lost, after it is reconstructed,
there won’t be a big part lossed.

Concisely describe the client-server and the peer-to-peer application architectures
and highlight their differences.
Client – server is an architecture of most website, server is running all the time, if the
client request, server will response. In different type of service, HTTP, FTP…… . In P2P,
every individual node is server and client at the same time, it won’t need a very high
level infrastructure to handle a heavy weight of requesting, and it won’t need to
download the file in order.

R6 (10Points) With HTTP streaming, are the TCP receive buffer and the clients
application buffer the same thing? If not, how do they interact?

---

## Page 3

R8 (20Points) List and describe Internet protocol stack.
Physical layer – where bits moves, and all those hardware and wire’s protocal.
Datalink layer – Where switch or hub transmit ARP with mac address.
Network layer – Where router forward the IP packet
Transport layer – TCP, UDP send segments
Session layer – connecting the conversation between two host
Presentation layer – encoding the file type
Application layer  -   the application we use today, like browser
