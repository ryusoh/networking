# module-12

---

## Page 1

1
Relates to Lab 5. An overview of the transport protocols of the TCP/IP
protocol suite. Also, a short discussion of UDP.

---

## Page 2

2
Orientation
• We move one layer up and look at the transport layer.

---

## Page 3

3
Orientation
• Transport layer protocols are end-to-end protocols
• They are only implemented at the hosts

---

## Page 4

4
Transport Protocols in the Internet
UDP - User Datagram Protocol
UDP - User Datagram Protocol
•
datagram oriented
•
•
•
unicast and
•
useful only for few applications,
e.g., multimedia applications
•
used a lot for services
– network management
(SNMP), routing (RIP),
naming (DNS), etc.
TCP - Transmission Control
Protocol
, full duplex
•
reliable
•
complex
•
only unicast
•
used for most Internet
applications:
– web (http), email (smtp), file
transfer (ftp), terminal (telnet),
etc.
• The Internet supports 2 transport protocols

---

## Page 5

5
Port Numbers
• UDP and TCP use port numbers to identify applications
• A globally unique address at the transport layer (for both UDP
and TCP) is the tuple <IP address, port number>
• There are 216 = 65,5
er protocol.
•
s
like email
for random
allocations.

---

## Page 6

6
UDP - User Datagram Protocol
•
UDP supports unreliable transmissions of datagrams
•
UDP merely extends the host-to-to-host delivery service of  IP datagram to
an application-to-application service
•
The only thing that UDP adds is multiplexing and demultiplexing

---

## Page 7

7
UDP Format
•
Port numbers identify sending and receiving applications (processes).
Maximum port number is 216-1= 65,535
•
Message Length is at least 8 bytes (i.e., Data field can be empty) and
at most 65,535

---

## Page 8

UDP Checksum
•
UDP checksum computation is optional for IPv4. If a checksum is not used it should be set to
the value zero.
•
The UDP checksum is calculated using a UDP-pseudo header, and UDP packet consisting
of UDP header and the UDP data.
•
The UDP pseudo header cont
, the destination IP-address, the
protocol identifier (UDP in this
ength taken from UDP header.
IP Destina
–
Protocol T
–
UDP length – header and data
8
