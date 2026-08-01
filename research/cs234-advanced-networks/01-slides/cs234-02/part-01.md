# cs234-02 - Part 01 (Pages 1-18)

---

## Page 1

CompSci 234/NetSys 210
Advanced Topics in Networking
Winter 2019
Unit 2: Application Layer
Protocols
Cheng-Hsin Hsu (<chsu@cs.nthu.edu.tw>)
Slide adopted from Kurose/Ross
1

---

## Page 2

Agenda
´Architecture: Client-Server
versus P2P
´Application Service
Requirements: TCP versus UDP
´Sample Application Protocol:
HTTP
´Socket Programming in Python
2

---

## Page 3

Sample Network
Applications
´ e-mail
´ web
´ text messaging
´ remote login
´ P2P file sharing
´ multi-user network
games
´ streaming stored video
(YouTube, Hulu, Netflix)
´ voice over IP (e.g.,
Skype)
´ real-time video
conferencing
´ social networking
´ search
´ Internet-of-things (IoT)
´ pub/sub
´ …
3

---

## Page 4

How to Write a Network
Application
´ a network program:
´ runs on (different) end
systems
´ communicates over network
´ e.g., web server and browser
software
´ no need to write software
for network-core devices
´ network-core devices do not
run user applications
´ applications on end systems
allows for rapid app
development, propagation
4
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
application
transport
network
data link
physical
Runs on different end systems
Communicates over network
No need to write software for network core devices
Network-core devices do not run user applications
Applications on end systems allows for rapid app development
                                                           Propagation

---

## Page 5

Application Architecture
´ Architecture is not the implementation
itself, but “design blueprint” on how to
“organize” instead
´ what interfaces are supported
´ where each functionality is implemented
´ Application architectures
´ Client-to-Server
´ Peer-to-Peer (P2P)
5
General…
more than
app. arch.
What interfaces are
supported

Where each functionality
is implemented
Client to server
Peer to peer

---

## Page 6

Client-Server Architecture
´server:
´always-on host
´permanent IP address
´data centers for scaling
´clients:
´communicate with server
´may be intermittently
connected
´may have dynamic IP
addresses
´do not communicate directly
with each other
6
client
server
Always on host
Permanent IP address
Data centers for scaling
Communicate with server
May be intermittently connected
May have dynamic ip addresses
Do not communicate directly with
each other

---

## Page 7

P2P Architecture
´ no always-on server
´ arbitrary end systems
directly communicate
´ peers request service from
other peers, provide
service in return to other
peers
´ self scalability – new peers
bring new service capacity,
as well as new service
demands
´ peers are intermittently
connected and change IP
addresses
´ complex management
7
peer-peer
no always on server
Arbitrary end systems directly communicate
Peer request service from other peers
provide service in return to other peers
Self scalability
New peers bring new
service capacity
As well as new
service demands
Peers are intermittently connected ad
change ip addresses
Complex management

---

## Page 8

Agenda
´Architecture: Client-Server
versus P2P
´Application Service
Requirements: TCP versus UDP
´Sample Application Protocol:
HTTP
´Socket Programming in Python
8

---

## Page 9

Application Protocol
Defines…
´ types of messages
exchanged,
´ e.g., request, response
´ message syntax:
´ what fields in messages
& how fields are
delineated
´ message semantics
´ meaning of information
in fields
´ rules for when and how
processes send & respond
to messages
´ open protocols:
´ defined in RFCs
´ allows for
interoperability
´ e.g., HTTP, SMTP
´ proprietary protocols:
´ e.g., Skype
9
Types of messages | message syntax | message semantics | rules for processes | open protocols
Rfcs allow for interoperability proprietary protocols

---

## Page 10

Transport Service
Requirements
10
data integrity
§ some apps (e.g., file transfer,
web transactions) require
100% reliable data transfer
§ other apps (e.g., audio) can
tolerate some loss
timing
´ some apps (e.g., Internet
telephony, interactive
games) require low delay
to be effective
throughput
§ some apps (e.g.,
multimedia) require
minimum amount of
throughput to be
effective
§ other apps (elastic apps)
make use of whatever
throughput they get
security
§ encryption, data integrity,
…
Data integrity
timing
throughput
Security

---

## Page 11

Typical Applications and
Their Requirements
11
application
file transfer
e-mail
Web documents
real-time audio/video
stored audio/video
networked games
text messaging
data loss
no loss
no loss
no loss
loss-tolerant
loss-tolerant
loss-tolerant
no loss
throughput
elastic
elastic
elastic
audio: 5kbps-1Mbps
video:10kbps-5Mbps
same as above
few kbps up
elastic
time critical
no
no
no
yes, 100s msec
yes, few secs
yes, 100s msec
yes and no
Q: Why networked gaming traffic is loss tolerant?

---

## Page 12

TCP versus UDP
´ TCP service:
´ reliable transport
between sending and
receiving process
´ flow control: sender
won’t overwhelm
receiver
´ congestion control:
throttle sender when
network overloaded
´ connection-oriented:
setup required
between client and
server processes
´ does not provide:
timing, minimum
throughput
guarantee, security
´ UDP service:
´ unreliable data transfer
between sending and
receiving process
´ does not provide:
reliability, flow control,
congestion control,
timing, throughput
guarantee, security, or
connection setup,
´ Q: why bother?  Why is
there a UDP?
12
Reliable transport between
sending and receiving process

Flow control sender won’t
overwhelm receiver

Congestion control
Throttle sender when network
Overloaded

Connection-oriented
Setup required between client
and server processes

Does not provide timing
minimum throughput
guarantee security

---

## Page 13

Transport Protocols Used by
Typical Applications
13
application
e-mail
remote terminal access
Web
file transfer
streaming multimedia
Internet telephony
application
layer protocol
SMTP [RFC 2821]
Telnet [RFC 854]
HTTP [RFC 2616]
FTP [RFC 959]
HTTP (e.g., YouTube),
RTP [RFC 1889]
SIP, RTP, proprietary
(e.g., Skype)
underlying
transport protocol
TCP
TCP
TCP
TCP
TCP or UDP
TCP or UDP
Q: Multimedia streaming and Internet
telephony used to be on UDP; but now on
both. Why?

---

## Page 14

Secured TCP
´ TCP & UDP
´no encryption
´cleartext passwds sent
into socket traverse
Internet  in cleartext
´ SSL: Secured Socket Layer
´provides encrypted
TCP connection
´data integrity
´end-point
authentication
´ SSL is at app layer
´apps use SSL
libraries, that
“talk” to TCP
´ SSL socket API
´cleartext
passwords sent
into socket
traverse Internet
encrypted
14
Secured socket layer

Provides encrypted
tcp connection

Data integrity

End-point
authentication
Ssl is at app layer
Ssl socket api: cleartext passwords sent
into socket traverse internet encrypted

---

## Page 15

Agenda
´Architecture: Client-Server
versus P2P
´Application Service
Requirements: TCP versus UDP
´Sample Application Protocol:
HTTP
´Socket Programming in Python
15

---

## Page 16

What is HTTP?
´ HTTP: hypertext
transfer protocol
´ Web’s application
layer protocol
´ client/server model
´ client: browser that
requests, receives,
(using HTTP protocol)
and “displays” Web
objects
´ server: Web server
sends (using HTTP
protocol) objects in
response to requests
16
PC running
Firefox browser
server
running
Apache Web
server
iPhone running
Safari browser
HTTP request
HTTP response
HTTP request
HTTP response
Hypertext transfer protocol
Web’s application layer protocol

---

## Page 17

Properties of HTTP
´ Use TCP, server port 80
´ HTTP clients and servers exchange
messages
´ HTTP is stateless
´ protocols that maintain “state” are
complex!
´ past history (state) must be maintained
´ if server/client crashes, their views of “state” may
be inconsistent, must be reconciled
´ scalability concern
17
tcp
Messages
Stateless

---

## Page 18

Persistent and Non-Persistent
HTTP
´ non-persistent
HTTP
´ at most one
object sent over
TCP connection
´ connection then
closed
´ downloading
multiple objects
required multiple
connections
´ persistent HTTP
´ multiple objects
can be sent over
single TCP
connection
between client,
server
18
At most one object sent over
tcp connection

Connection then closed

Downloading multiple objects
Required multiple connections
Multiple objects can be sent over
single tcp connection between client
and server
