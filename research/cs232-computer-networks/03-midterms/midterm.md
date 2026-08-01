# midterm

---

## Page 1

Architecture
Lecture 1
Networks
-Architecture (Chapter 1)
-Application (Chapter 2 and 7)
-Protocols (Chapter 3 and 4)
-LANs (Chapter 5, 6.3)
No: Physical Layer, hardware, coding
Telephone networks design and Circuit switching
-1 application(voice)
-long unicast connections/sessions(calls)
-almost constant traffic generation during the connection
-sparse(thinly dispersed) call arrival
-resource reserved for the entire call
-QoS (quality of service) guaranteed (once the connection is established)
Topologies
-fully interconnected network: every node connected to every other node)
-large number of links and the infrastructure is expensive
-centralized switch: all nodes connected to one central node
-small number of links, connects from any point to a central switch, very long wires
-two-level hierarchy: nodes connected to outside notes that connect to interconnected inside ones.
Kind of/actually like what we are studying
-slightly larger number of links
-scalable infrastructure: many short connections, fewer long-distance connections
-Topologies with long distance (Multiple long-distance carriers)
-LATA: Local Access and Transport Area, LEC: local exchange carrier, IXC: interexchange
carrier
Network of networks: ISP (internet service provider) -> IXP (internet exchange points) -> Tier 1
ISP (AT&T, Sprint, NTT, etc) consumer level to high level tier. Hosts connect to some ISP via
some access network that connects to these higher ones

---

## Page 2

Lines and trunks
-local loop line: often twisted-pair copper. Low capacity, analog
-trunks: often fiber. High capacity, digital
-high capacity: trunk lines carry more than 1 call simultaneously (thousands-millions)
-digital vs analog
-digital: regeneration, recovery vs analog: sensitive to noise
Lecture 2 Circuit & Packet switching (Practice Problems)
Telephone networks
-circuit switching
-lines and trunks
-multiplexing
-frequency division multiplexing (FDM)
-time division multiplexing (TDM)
Telephone Network Design
-telephone networks were engineered for voice
-service characteristics:
-constant bit rate
-call duration measured in minutes
-performance:
-throughput â€“ design variable
-delay â€“ firm deadline
-loss â€“ design variable
Computer Networks/Internet Design
-Packet Switching
-Idea: decompose message into packets (transmit the packets one by one)
-efficient for burst traffic
-packet switches/routers replace telephone routers (instead of setting up â€œcircuitsâ€வ for each
call, route packets one by one) packets are buffered, FIFO
-no need of setting up a â€˜circuitâ€™

---

## Page 3

-Statistical multiplexing
Internet Design
-was originally engineered for data and multiple applications (e.g. file transfer, email)
ABOVE
-bursty traffic generation
-short(frequency) connections
-packet switching, resource sharing, best effort(design variable)
-service characteristics:
-variable bit rate (burst)
 -connection duration
measured in seconds
-performance:
-throughput â€“ design variable
-delay â€“ firm deadline
-loss â€“ often not ok (e.g. email)
Lecture 3(Resource sharing- trunks: Multiplexing)
Method 1-Circuit switching
-refers to creating an electrical circuit for the duration of each telephone call
-examples of telephone switches: telephone crossbar switch, telephone space division switch
Method 2- Frequency division multiplexing (FDM)
Method 3- Time Division Multiplexing (TDM)
Time and distance/ Time vs distance
-seconds, one hop = km
Propagation delay = distance / propagation speed

---

## Page 4

What are TDM Streams?
-Statistical (vs deterministic) TDM multiplexing
function of: traffic rate of other nodes, congestion
consequence: performance metrics (delay, throughput, packet loss probability) of an individual
packet are: RANDOM VARIABLES
Synchronous vs. asynchronous(depending on queuing in routers)
-packets experience same delay vs different delays from source to destination
Connection-oriented vs connectionless (need packet ordering)
-packets arrive in sequence sent vs donâ€™t necessarily arrive in sequence sent
Reliable vs unreliable
Circuit switching vs Packet switching
Circuit switching: synchronous, connection-oriented, reliable
Datagram packet switching (without additional mechanism e.g. UDP): asynchronous,
connectionless, unreliable
Datagram packet switching (with additional mechanisms e.g. TCP or in application):
-to get synchronous, add buffering before playout(e.g. streaming programs)
-to connection-oriented, add resequencing (e.g. TCP or in application)
-to get reliable, add retransmission (e.g. TCP or in application)
Why is the entire packet processed before it is forwarded?
[Header | Payload | Trailer]
-Error correction performed at each hop
-Packet regeneration (two steps: demodulation/remodulation, and error correction)
Cell phone networks
1G â€“ circuit-switched analog voice
2G â€“ circuit-switched digital voice & rudimentary data
3G â€“ circuit-switched digital voice & packet switched data
4G â€“ packet switched digital voice (VoIP) & packet switched data
Wired vs Wireless
-Wired: spatial multiplexing vs Wireless: broadcast channel interference
Cell structure

---

## Page 5

-Channel reuse: larger capacity, larger infrastructure cost, more uniform coverage
Cell phone networks
-MSCs (Mobile Switching Center) control end-to-end connection, channel assignment and
handoff, and are connected to the PTN (Public telephone network) and internet
-To make calls: Access channel (contention based), Incoming calls: paging channel
GSM
-TDM: channels are assigned to multiple users
-BSC(Base station controller): control channel resource and handoff
-MSC(Mobile Switching Center): routes calls using the Visitor Location Register (local users)
and the Home Location Register (last known location)
FDM + TDM: channels are assigned to multiple users
Downstream/upstream in different slots (half-duplex)
Cell phone Internet access
-2 merging families of standards (GSM, CDMA)
-FDM/TDM/CDMA used to define â€˜channelsâ€™
-downstream (base station to mobile): packet switching, no contention! (no disagreement)
-upstream (mobile to base station): contention!, typically use a version of slotted ALOHA to
reserve timeslots, also uses power and rate allocation
Cable TV Networks
Lecture 4 (Performance metrics)
Technology convergence
-Before vs Now
-Telephone networks were for telephone calls vs. telephone + internet + video
-Internet was for file transfer and email
-Cable TV networks for broadcast video vs. video + internet + telephone
-Cell phone networks(cellular networks) for telephone calls vs. telephone + internet + video
-Convergence:
-email, web browsing, streaming, telephone calls, video chat, gaming..
-over all networks
MORE INTERACTIVE LESS INTERACTIVE

---

## Page 6

Telephone calls Internet tv web browser email
Video conferencing Internet radio
BETTER PERFORMANCE WORSE PERFORMANCE
-different applications may have different Quality of Service (QoS) constraints
Packet switching performance metrics
-Packet delay, packet loss, throughput, efficiency
-Performance metrics are interdependent (e.g. no delay constraint = packet loss probability close
to zero)
-End-to-end performance:
-Multi-hop
-Link (capacity, physical length, etc.)
-Node (processing speed, buffer)
-Topology
-Active end hosts
d(nodal) = d(processing is defined by the hardware) + d(queuing) + d(trans) + d(propagation)
Delays
Packet = 512B (B = byte, b = bit)
Hop = 100 km
Transmission rate = 10 Mbps
-some examples might have multiple hops
Propagation delay example
-from the first bit transmitted to the first bit received
Propagation delay = distance / propagation speed
= 100km / (3*10^8 m/s)
Transmission delay example
-from first bit pushed to last bit pushed
Transmission delay = packet size(in bits) / transmission rate
= (512B)(8bits/byte)/(10*10^6 bps)
Packet loss

---

## Page 7

What is the difference between queueing delay and (procession, transmission, and propagation
delay?)
-Queueing delay is random
-processing, transmission, and propagation delay are deterministic
Throughput
-bits/second, calculated over a time window of many seconds
-what throughput will the user see in this web page download?
Min(R(s), R(c))
Efficiency
Data successfully delivered to the destination / Overall resource used
-includes overhead, idle time/frequency, lost packets, etc
Resource sharing!
Lecture 5 (Layering â€“ the protocol stack)
-Internet = network of networks
-Provide a layering diagram
-Layers provide functionalities/services to the upper layers
-Some information exchange (e.g. failure resports)
-Not optimal
OSI Layering Model
OSI Layer 7: application
-implemented by hosts
-Applications: browsers, email programs, media players, etc.
-Protocols that support applications (type of messages, syntax): www:http; email: pop,smtp,
imap; ftp, telnet, â€¦
OSI layer 4: transport
-end-to-end control
-TCP (transmission control protocol)
-segmentation
-source and destination work together to decide pace (flow control)
-retransmit dropped packets (reliable)

---

## Page 8

-packet ordering
-UDP (user datagram protocol)
OSI layer 3: network
-end-to-end packet forwarding
-Determine next router to send packet to
-Addressing
-routing
-Receive packet and determine next router to send packet to
-Queueing
-Routing
-Packet scheduling
OSI layer 2: link
-link scale services
-Channel access, who gets to transmit when
-framing
-error detection
-retransmission of corrupted packets
OSI layer 1: physical
-bits to analog signal
-modulation
-depends on transmission medium (e.g. twisted pair, coax, fiber, wireless)
-analog signal to bits
-synchronization
-sampling
-challenges: delay, attenuation, dispersion, noise
Layering, Layering + peering, packet format & layering
Internet Applications
Lecture 1
Application Layer

---

## Page 9

-Applications: Browsers, email programs, media players, etc
-Protocols that support applications (type of messages, syntax)
-www: http; email: pop, smtp, imap; ftp, telnet, etc.
-examples: email, file transfer, www, e-commerce, file sharing, streaming, gaming, voice over IP,
video over IP
Application requirements
-Metrics: packet loss, delay, throughput
-Bounds: max/min, variations, firm/flexible
Application architecture: client-server
-client requests content: client must know server name or address
-server replies with content: server always on to listen for requests
Application architecture: peer-to-peer
-each machine acts as both a client and a server
-same task
-as a client: must have some way to find peer acting as a server that is on and has desired content
-as a server: must have some way of advertising availability and content
-scalable
-hybrid architectures
HyperText Transfer Protocol (HTTP)
-Purpose: request and transfer a webpage from a server to a user (client-server)
-Service characteristics
-pages requested and sent at random times
-connected only for duration of download
-Performance:
-loss: no okay
-delay: few seconds ok, but flexible
-throughput: higher is better, but flexible
http: connection management
-connection initiation

---

## Page 10

-well-known ports (e.g. port 80)
-client (browser) â€“ server (webserver)
-connection access control (limited resources, TCP): server may clock a connection
-server balancing: server may redirect a connection
-connection termination:
-non-persistent: each file requires a separate connection
-first request main page, close connection
-if main page has images:
for each image, open connection, request image, close connection
-workaround: open parallel connections, one for each image (but, server may have limited
resources in terms of # of tcp connections)
-persistent:
close connection only after client is done with server(or timeout)
serial objects transfer
TCP connection
-RTT â€“ round trip time (transmission, propagation
-number of packets depends on file size
-timing of packets depends on layers below
E-commerce over http
-purpose: purchase something on the www
-service characteristics:
-login using id and password
-select items
-checkout
E-commerce requires â€˜stateâ€™
-â€˜stateâ€™ = information from previous communication (e.g. who you are, your basket,
checkout status)
-problem: http doesnâ€™t keep track of state
-solution: client and server application (above http) must jointly keep track of state
-client: cookie

---

## Page 11

-server: database
email
-Purpose: transfer a message from one user to another
-Service characteristics:
-messages sent at random times
-connected only for duration of upload or download
-Performance:
-loss â€“ not ok
-delay â€“ few mintues ok, but flexible
-throughput â€“ higher is better, but flexible
email: method & connection management
SMTP is used to transfer mail from the senderâ€™s mail server to the recipientâ€™s mail server;
SMTP is also used to transfer mail from the senderâ€™s user agent to the senderâ€™s mail
server. A mail access protocol, such as POP3, is used to transfer mail from the recipientâ€™s
mail server to the recipientâ€™s user agent.
-well-known ports(e.g. 25, 110, 143)
-SMTP(simple mail transfer protocol)
-principal application-layer protocol for Internet electronic mail. It uses the reliable data transfer
service of TCP to transfer mail from the senderâ€™s mail server to the recipientâ€™s mail server
mail access protocols
-POP(post office protocol):

- IMAP(internet mail access protocol) standards plus email format standard mean Alice and Bob
donâ€™t need to use the same email program
User agent: (client)
-dedicated program (e.g. outlook, elm, iphone mail)
-or webmail (e.g. uci webmail, gmail)
Mail server: (server)
-server that talks to a dedicated program (e.g. smtp.uci.edu, smtp.cox.net)
-server that runs webmail (all user agents and mail servers are at application layer)
Upload protocol:
SMTP(simple mail transfer protocol)

---

## Page 12

-open TCP connection, upload messages, close TCP connection
Download protocols:
POP = Post Office Protocol
-messages downloaded from mailbox on server to mailbox on non webmail client
IMAP = Internet Mail Access Protocol
-messages kept in (multiple) server mailboxes
-or moved to mailboxes on non webmail clients
email: location
-client-server or peer-to-peer?
two functions:
-upload/download (client-server)
-mail transfer: peer-to-peer (really server-to-server)
MAKE A CHART OF APPLICATION REQUIREMENTS EXAMPLE
Lecture 2
File sharing
-Purpose: find a file and transfer it from multiple other users
-Service characteristics:
-search for file
-identify which users have which pieces
-transfer pieces and put it together
-Performance:
-Loss: not okay
-Delay: very flexible, often hours
-Throughput: higher is better, but flexible
File sharing: search
-Location? (e.g. tracker)
-Client-server or peer-to-peer?
-client-server followed by peer-to-peer
-server: put peer in contact with peers

---

## Page 13

-peer-to-peer: file transfer
e.g. obtain list of peers from server then distribute to peers (file distribution with BitTorrent
example diagram)
-Two functions:
-Search: usually client-server
-File transfer: peer-to-peer
File sharing: Method & Connection Management
-Method (e.g. BitTorrent)
-Connection Management
-often uses a large number of unregistered ports
-peers determined by protocol
-connections set up directly to peers
File sharing: action management
-BitTorrent:
-File splits into â€œchunksâ€வ
-Client side: request missing chunks directly from other peers, via TCP
-Server side: list for and service requests for chunks you have, via TCP
-client algorithm determines which chunk to request first (e.g. rarest firs)
-server algorithm determines rate (e.g. number of connections, max rate)
Multimedia
Streaming
-Purpose: 1 way transmission of audio or video
-Service characteristics:
-constant bit rate (unless compressed)
-duration: minutes to hours
-Performance:
-Loss: small amount ok
-delay: seconds, firm once stream started
-throughput: fixed

---

## Page 14

Voice or Voice Over IP
-Purpose: 2 way interactive transmission of voice or video
-Service characteristics:
-constant bit rate (unless compressed)
-duration: minutes to hours
-Performance:
-Loss: small amount ok
-delay: a few tenths of a second
-throughput: fixed
-Crude version: similar to streaming
-Better version: give priority to these packets over packets such as email or web browsing
Voice Over IP (VoIP)
-Real time application
-Multimedia streams
-Both directions
QoS Requirements of VoIP
-Packet loss
-up to 20% is tolerated
-Reasons for packet loss: buffer overflow, link layer, delay
-UDP vs TCP: reliability (retransmission), delay, buffer starvation, delay variations
-End-to-end delay
-Sum of all the delays (transmission, propagation, processing, queueing delays(
-up to 400 ms tolerable
-Jitter
-Packets generated periodically
-delay variations at the receiver (e.g. queue conditions)
Best effort
-individual pkt end-to-end performance is random
-possibily large variables

---

## Page 15

-average may vary over time
Jitter-Countermeasure
-Timestamp: generation time
-delayed playout
-(most of the) packets arrive before playout time
-introduces delay
-packets after playout time are discarded
-delay is a random variable
-variations due to network conditions
-min delay with loss constraint
-fixed playout
-t + q
-generation + delay + max variations
-large variations = large delays
-adaptive playout
-talk spur = delay re-estimated
-fixed during talk spur
-recent measured delays used for estimation
Packet loss recovery
-TCP: retransmission, delay!
-Recovery: FEC, Interleaving, no additional RTT
FEC
-redundancy
+1 packet every N
N small: larger generation rate, better recovery
Delay: wait for the entire group
-low rate stream
-low-quality/low-bitrate stream appended
Interleaving

---

## Page 16

-samples are re-sequenced: adjacent samples assigned to different chunks
-packet loss mitigated: avoids gaps
-increased latency
-same bandwidth
Real Time Protocol (RTP)
-UDP
-RTP â€“ UDP â€“IP
-RTP
-Independent RTP stream per source
-Video/audio payload + header
-RTP header fields (payload type, sequence number, timestamp, synchronization source identifier,
miscellaneous fields)
-Payload type: encoding
-sequence number: re-sequencing, packet recovery
-timestamp: playout control
-synchronization source ID: identification
Supporting Multimedia Application
Supporting Multimedia
-Network dimensioning: enough bandwidth to support QoS
-Differentiated service: hierarchy of priorities
-Per-connection guarantees: end-to-end resource reservation
Dimensioning
-Avoid congestion: Links have enough bandwidth; No loss, small delay, small jitter etc.
-No changes to best-effort model
-End-to-end : Multiple ISP â€“ cooperation
-How much is enough
â€“ Traffic demand
â€“ Performance requirements
â€“ End-to-end performance predic,on
Multiple service classes

---

## Page 17

-Multimedia/priority first, then the others
-priority per class and not per user/stream
-improved service
-avoids congestion
-Operations: packet marking, router processing, end-to-end
-issues
-too many prioritized streams or too much prioritized traffic
-congestion of low-priority traffic
-Solutions
-policing: traffic control (router), drop/delay packets
-fixed allocation: link level scheduling
-Efficiency?
Scheduling
-FIFO
-Priority queue
-Preemptive: service is interrupted
-Non-preemptive: service is not interrupted
Weighted round-robin
-round-robin: classes with non-empty queue sequentially served
-weighted fair queueing
-weight defines amount of time
-minimum fraction (due to empty queues)
The leaky-bucket
-limited injection of traffic in the buffers
-B tokens
-tokens assigned to incoming packets
-tokens generated with rate r
-policing
-average injection rate

---

## Page 18

-peak rate
-burst size
-multiple buckets
leaky-bucket + weighted round robin
FORMULA
DiffServ
-supports service differentiation
-edge functions: packet classification/marking, traffic conditioning
-core functions: per-hop behavior only function of the class
-traffic conditioning: pre-negotiated characterization, leaky bucket
Per-connection Qos
-end-to-end resource is pre-assigned
-QoS guarantees
-stream admission
-avoid unusable flow
-stream admission procedure
-setup signaling
-RSVP protocol
Connections
Traffic characterization by layer
CHAPTER 3!!
Whereas a transport-layer protocol provides logical communication between processes running
on different hosts, a network-layer protocol provides logical communication between hosts.
The IP service model is a best-effort delivery service and an unreliable service
transport-layer multiplexing(collecting letters to send and giving them to delivery guy)
Extending host-to-host delivery to process-to-process delivery
-gathering data chunks at the source host from different sockets, encapsulating each data chunk
with header information (that will later be used in demultiplexing) to create segments, and
passing the segments to the network
demultiplexing: finding the right sockets to put the stuff through. job of delivering the data in a
transport-layer segment to the correct socket is called

---

## Page 19

socket direction is determined by ALL the arguments in the tuple
UDP socket = (destination IP address and a destination port number)
-source port number = return address
TCP = source IP address, source port number, destination IP address, destination port number).
UDP
In fact, if the application developer chooses UDP instead of TCP, then the application is almost
directly talking with IP.
Connectionless = no handshaking.
The network layer encapsulates the UDP segment into a datagram and sends the datagram to a
name server. The DNS application at the querying host then waits for a reply to its query. If it
doesnâ€™t receive a reply (possibly because the underlying network lost the query or the reply),
either it tries sending the query to another name server, or it informs the invoking application that
it canâ€™t get a reply.
Why UDP?
-no congestion control mechanism (more control but w/o congestion control there would be so
much packet overflow and high loss rates)
-no connection establbishment is faster
-does not maintain connection state and does not track any of these parameters(needed to
implement TCPâ€™s reliable data transfer service and to provide congestion control â€¨

- small packet header overhead. The TCP segment has 20 bytes of header over- head in
every segment, whereas UDP has only 8 bytes of overhead. â€¨
length field specifies the number of bytes in the UDP segment (header plus data)
UDP checksum provides for error detection
-provides error detection on an end to end basis but does not do anything to recover
sender will not send a new piece of data until it is sure that the receiver has â€¨ correctly received
the current packet : stop-and-wait protocols
Why layered architecture? Modularity, changes affecting only one layer at a time, standard
interfaces
Every layer offers service to adjacent layers.
OSI layers
Different name data for different layers: message, segment, datagrams, frames, etc.
Encapsulation Layers:
Layer 7 = Application: HTTP, SMTP, FTP...
Layer 4: Transport: TCP, UDP
Layer 3: Network: Routing, Queuing, pck sched,
•
•

---

## Page 20

Layer 2: Link: Channel access, error detection, retrx of corrupted Layer 1: Physical: depends on
medium (e.g. modulation); synchronization, sampling, noise reduction, ...
Step in a HTTP request
First, we need to obtain the IP address of the webserver from the local DNS server.
Second, we need to establish a TCP connection with the server. There are three messages in
a TCP handshake: SYN, SYN-ACK
and ACK.
The third message (ACK) can also be used to send the HTTP request.
Ones the connection is ready, client sends a HTTP request and get a response
•
•
•
