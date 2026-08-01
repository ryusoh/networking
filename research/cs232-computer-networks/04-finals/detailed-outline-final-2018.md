# detailed-outline-final-2018

---

## Page 1

1
Detailed Outline - Final
All the material, comments, etc. in the slides.
I. QUEUEING AND BUFFERS
Leon-Garcia - Appendix A + Notes:
• Arrival, departure, blocking model and processes.
• Little’s equation (+ proof).
• Buffer/Server model and terminology.
• Exponential distribution (inter arrival, service) + Poisson process
• Properties: memoryless, minimum interarrival time of multiple exponential processes (distribution, average,
probability of arrival from process i), aggregate of exponential processes, sub-sampled exponential process.
• M/M/1/K - number of packets in the system (distribution and average + proof, K ﬁnite and inﬁnite), blocking
probability, empty buffer probability, average time in the system (sketch of proofs).
• Erlang B formula - M/M/c/c (sketch of the proof).
II. APPLICATION LAYER
Kurose:
• 2.1: client-server and peer-to-peer architectures, processes and sockets, transport services, TCP and UDP
services, Application layer protocols
• 2.2: architecture, non-persistent and persistent connections (no header format), cookies
• 2.4: architecture, SMTP (operations, skip the message part), comparison with HTTP, mail access protocols,
POP3, Imap (functioning, no need to memorize the commands).
• 2.6: architecture and motivation, bitTorrent (architecture and operations).
• 7.1: whole sub-chapter
• 7.2: 7.2.1, 7.2.2
• 7.3: best-effort and QoS (packet loss, delay, jitter), Removing jitter, Recovering packet loss (FEC, interleaving)
• 7.4: RTP (basics, ﬁelds)
• 7.5: dimensioning, multiple classes of service (motivation, scheduling, policing), Per-connection QoS
III. TRANSPORT LAYER
Kurose:
• 3.1: interaction between transport and network layers, overview.
• 3.2: connection-oriented and connectionless multiplexing and demultiplexing.
• 3.3: UDP services, pro and cons of connectionless transport
• 3.4: principles (retransmission, feedback, error detection, numbering, timeouts), stop-and-wait, Go-Back-N,
selective repeat
• 3.5: timeout and RTT, timeout and fast retransmit, ﬂow control
• 3.6: congestion control principles and approaches
• 3.7: TCP congestion control: principles of congestion estimation (lost segment, acknowledgment, probing),
slow start, congestion avoidance, fast recovery. TCP Reno

---

## Page 2

2
IV. NETWORK LAYER
Kurose:
• 2.5 - DNS: services, overview, hierarchical architecture.
• 5.4.1 - Link layer addressing: MAC addresses.
• 4.2 - transport layer vs network layer services, datagram networks (forwarding tables, forwarding rules).
• 4.3 - Routers: architecture and components, input processing, switching, output processing, queueing.
• 4.4 - ICMP (overview).
• 4.5 - graph model, shortest path, global vs decentralized routing algorithms, Link State protocol, Distance
Vector, comparison LS vs DV, Hierarchical routing.
• 4.6 - intra-AS routing, RIP and OSPF (overview), inter-AS routing, BGP basics, BGP route selection, routing
policy, why inter and intra-AS routing.
• 4.7 - Broadcast routing, uncontrolled and controlled ﬂooding, spanning tree, multicast routing, multicast trees
V. LAN
Not included in ﬁnal.
