# ch02-chapter-2-v6.3 - Part 02 (Pages 56-109)

---

## Page 56

Application Layer 2-56
Mail message format
SMTP: protocol for
exchanging email msgs
RFC 822: standard for text
message format:
v header lines, e.g.,
§ To:
§ From:
§ Subject:
different from SMTP MAIL
FROM, RCPT TO:
commands!
v Body: the message
§ ASCII characters only
header
body
blank
line

---

## Page 57

Application Layer 2-57
Mail access protocols
v SMTP: delivery/storage to receivers server
v mail access protocol: retrieval from server
§ POP: Post Office Protocol [RFC 1939]: authorization,
download
§ IMAP: Internet Mail Access Protocol [RFC 1730]: more
features, including manipulation of stored msgs on
server
§ HTTP: gmail, Hotmail, Yahoo! Mail, etc.
senders mail
server
SMTP
SMTP
mail access
protocol
receivers mail
server
(e.g., POP,
IMAP)
user
agent
user
agent

---

## Page 58

Application Layer 2-58
POP3 protocol
authorization phase
v client commands:
§ user: declare username
§ pass: password
v server responses
§ +OK
§ -ERR
transaction phase, client:
v list: list message numbers
v retr: retrieve message by
number
v dele: delete
v quit
C: list
S: 1 498
S: 2 912
S: .
C: retr 1
S: <message 1 contents>
S: .
C: dele 1
C: retr 2
S: <message 1 contents>
S: .
C: dele 2
C: quit
S: +OK POP3 server signing off
S: +OK POP3 server ready
C: user bob
S: +OK
C: pass hungry
S: +OK user successfully logged on

---

## Page 59

Application Layer 2-59
POP3 (more) and IMAP
more about POP3
v previous example uses
POP3 download and
delete mode
§ Bob cannot re-read e-
mail if he changes
client
v POP3 download-and-
keep: copies of messages
on different clients
v POP3 is stateless across
sessions
IMAP
v keeps all messages in one
place: at server
v allows user to organize
messages in folders
v keeps user state across
sessions:
§ names of folders and
mappings between
message IDs and folder
name

---

## Page 60

Application Layer 2-60
Chapter 2: outline
2.1 principles of network
applications
§ app architectures
§ app requirements
2.2 Web and HTTP
2.3 FTP
2.4 electronic mail
§ SMTP, POP3, IMAP
2.5 DNS
2.6 P2P applications
2.7 socket programming
with UDP and TCP

---

## Page 61

Application Layer 2-61
DNS: domain name system
people: many identifiers:
§ SSN, name, passport #
Internet hosts, routers:
§ IP address (32 bit) -
used for addressing
datagrams
§ name, e.g.,
<www.yahoo.com> -
used by humans
Q: how to map between IP
address and name, and
vice versa ?
Domain Name System:
v distributed database
implemented in hierarchy of
many name servers
v application-layer protocol: hosts,
name servers communicate to
resolve names (address/name
translation)
§ note: core Internet function,
implemented as application-
layer protocol
§ complexity at networks
edge

---

## Page 62

Application Layer 2-62
DNS: services, structure
why not centralize DNS?
v single point of failure
v traffic volume
v distant centralized database
v maintenance
DNS services
v hostname to IP address
translation
v host aliasing
§ canonical, alias names
v mail server aliasing
v load distribution
§ replicated Web
servers: many IP
addresses correspond
to one name
A: doesnt scale!

---

## Page 63

Application Layer 2-63
Root DNS Servers
com DNS servers
org DNS servers
edu DNS servers
poly.edu
DNS servers
umass.edu
DNS servers
yahoo.com
DNS servers
amazon.com
DNS servers
pbs.org
DNS servers
DNS: a distributed, hierarchical database
client wants IP for <www.amazon.com>; 1st approx:
v client queries root server to find com DNS server
v client queries .com DNS server to get amazon.com DNS server
v client queries amazon.com DNS server to get  IP address for
<www.amazon.com>
…
…

---

## Page 64

Application Layer 2-64
DNS: root name servers
v contacted by local name server that can not resolve name
v root name server:
§ contacts authoritative name server if name mapping not known
§ gets mapping
§ returns mapping to local name server
13 root name
servers
worldwide
a. Verisign, Los Angeles CA
(5 other sites)
b. USC-ISI Marina del Rey, CA
l. ICANN Los Angeles, CA
(41 other sites)
e. NASA Mt View, CA
f. Internet Software C.
Palo Alto, CA (and 48 other
sites)
i. Netnod, Stockholm (37 other sites)
k. RIPE London (17 other sites)
m. WIDE Tokyo
(5 other sites)
c. Cogent, Herndon, VA (5 other sites)
d. U Maryland College Park, MD
h. ARL Aberdeen, MD
j. Verisign, Dulles VA (69 other sites )
g. US DoD Columbus,
OH (5 other sites)

---

## Page 65

Application Layer 2-65
TLD, authoritative servers
top-level domain (TLD) servers:
§ responsible for com, org, net, edu, aero, jobs, museums,
and all top-level country domains, e.g.: uk, fr, ca, jp
§ Network Solutions maintains servers for .com TLD
§ Educause for .edu TLD
authoritative DNS servers:
§ organizations own DNS server(s), providing
authoritative hostname to IP mappings for organizations
named hosts
§ can be maintained by organization or service provider

---

## Page 66

Application Layer 2-66
Local DNS name server
v does not strictly belong to hierarchy
v each ISP (residential ISP, company, university) has
one
§ also called default name server
v when host makes DNS query, query is sent to its
local DNS server
§ has local cache of recent name-to-address translation
pairs (but may be out of date!)
§ acts as proxy, forwards query into hierarchy

---

## Page 67

Application Layer 2-67
requesting host
cis.poly.edu
gaia.cs.umass.edu
root DNS server
local DNS server
dns.poly.edu
1
2
3
4
5
6
authoritative DNS server
dns.cs.umass.edu
7
8
TLD DNS server
DNS name
resolution example
v host at cis.poly.edu
wants IP address for
gaia.cs.umass.edu
iterated query:
v contacted server
replies with name of
server to contact
v I dont know this
name, but ask this
server

---

## Page 68

Application Layer 2-68
4
5
6
3
recursive query:
v puts burden of name
resolution on
contacted name
server
v heavy load at upper
levels of hierarchy?
requesting host
cis.poly.edu
gaia.cs.umass.edu
root DNS server
local DNS server
dns.poly.edu
1
2
7
authoritative DNS server
dns.cs.umass.edu
8
DNS name
resolution example
TLD DNS
server

---

## Page 69

Application Layer 2-69
DNS: caching, updating records
v once (any) name server learns mapping, it caches
mapping
§ cache entries timeout (disappear) after some time (TTL)
§ TLD servers typically cached in local name servers
• thus root name servers not often visited
v cached entries may be out-of-date (best effort
name-to-address translation!)
§ if name host changes IP address, may not be known
Internet-wide until all TTLs expire
v update/notify mechanisms proposed IETF standard
§ RFC 2136

---

## Page 70

Application Layer 2-70
DNS records
DNS: distributed db storing resource records (RR)
type=NS
§ name is domain (e.g.,
foo.com)
§ value is hostname of
authoritative name
server for this domain
RR format: (name, value, type, ttl)
type=A
§ name is hostname
§ value is IP address
type=CNAME
§ name is alias name for some
canonical (the real) name
§ <www.ibm.com> is really
servereast.backup2.ibm.com
§ value is canonical name
type=MX
§ value is name of mailserver
associated with name

---

## Page 71

Application Layer 2-71
DNS protocol, messages
v query and reply messages, both with same message
format
msg header
v identification: 16 bit # for
query, reply to query uses
same #
v flags:
§ query or reply
§ recursion desired
§ recursion available
§ reply is authoritative
identification
flags

## questions

questions (variable # of questions)

## additional RRs

## authority RRs

## answer RRs

answers (variable # of RRs)
authority (variable # of RRs)
additional info (variable # of RRs)
2 bytes
2 bytes

---

## Page 72

Application Layer 2-72
name, type fields
for a query
RRs in response
to query
records for
authoritative servers
additional helpful
info that may be used
identification
flags

## questions

questions (variable # of questions)

## additional RRs

## authority RRs

## answer RRs

answers (variable # of RRs)
authority (variable # of RRs)
additional info (variable # of RRs)
DNS protocol, messages
2 bytes
2 bytes

---

## Page 73

Application Layer 2-73
Inserting records into DNS
v example: new startup Network Utopia
v register name networkuptopia.com at DNS registrar
(e.g., Network Solutions)
§ provide names, IP addresses of authoritative name server
(primary and secondary)
§ registrar inserts two RRs into .com TLD server:
(networkutopia.com, dns1.networkutopia.com, NS)
(dns1.networkutopia.com, 212.212.212.1, A)
v create authoritative server type A record for
<www.networkuptopia.com>; type MX record for
networkutopia.com

---

## Page 74

Attacking DNS
DDoS attacks
v Bombard root servers
with traffic
§ Not successful to date
§ Traffic Filtering
§ Local DNS servers
cache IPs of TLD
servers, allowing root
server bypass
v Bombard TLD servers
§ Potentially more
dangerous
Redirect attacks
v Man-in-middle
§ Intercept queries
v DNS poisoning
§ Send bogus relies to
DNS server, which
caches
Exploit DNS for DDoS
v Send queries with
spoofed source
address: target IP
v Requires amplification
Application Layer 2-74

---

## Page 75

Application Layer 2-75
Chapter 2: outline
2.1 principles of network
applications
§ app architectures
§ app requirements
2.2 Web and HTTP
2.3 FTP
2.4 electronic mail
§ SMTP, POP3, IMAP
2.5 DNS
2.6 P2P applications
2.7 socket programming
with UDP and TCP

---

## Page 76

Application Layer 2-76
Pure P2P architecture
v no always-on server
v arbitrary end systems
directly communicate
v peers are intermittently
connected and change IP
addresses
examples:
§ file distribution
(BitTorrent)
§ Streaming (KanKan)
§ VoIP (Skype)

---

## Page 77

Application Layer 2-77
File distribution: client-server vs P2P
Question: how much time to distribute file (size F) from
one server to N  peers?
§ peer upload/download capacity is limited resource
us
uN
dN
server
network (with abundant
bandwidth)
file, size F
us: server upload
capacity
ui: peer i upload
capacity
di: peer i download
capacity
u2
d2
u1
d1
di
ui

---

## Page 78

Application Layer 2-78
File distribution time: client-server
v server transmission: must
sequentially send (upload) N
file copies:
§ time to send one copy: F/us
§ time to send N copies: NF/us
increases linearly in N
time to  distribute F
to N clients using
client-server approach Dc-s > max{NF/us,,F/dmin}
v client: each client must
download file copy
§ dmin = min client download rate
§ min client download time: F/dmin
us
network
di
ui
F

---

## Page 79

Application Layer 2-79
File distribution time: P2P
v server transmission: must
upload at least one copy
§ time to send one copy: F/us
time to  distribute F
to N clients using
P2P approach
us
network
di
ui
F
DP2P > max{F/us,,F/dmin,,NF/(us + Sui)}
v client: each client must
download file copy
§ min client download time: F/dmin
v clients: as aggregate must download NF bits
§ max upload rate (limting max download rate) is us + Sui
… but so does this, as each peer brings service capacity
increases linearly in N …

---

## Page 80

Application Layer 2-80
0
0.5
1
1.5
2
2.5
3
3.5
0
5
10
15
20
25
30
35
N
Minimum Distribution Time
P2P
Client-Server
Client-server vs. P2P: example
client upload rate = u,  F/u = 1 hour,  us = 10u,  dmin ≥ us

---

## Page 81

Application Layer 2-81
P2P file distribution: BitTorrent
tracker: tracks peers
participating in torrent
torrent: group of peers
exchanging  chunks of a file
Alice arrives  …
v file divided into 256Kb chunks
v peers in torrent send/receive file chunks
… obtains list
of peers from tracker
… and begins exchanging
file chunks with peers in torrent

---

## Page 82

Application Layer 2-82
v peer joining torrent:
§ has no chunks, but will
accumulate them over time
from other peers
§ registers with tracker to get
list of peers, connects to
subset of peers
(neighbors)
P2P file distribution: BitTorrent
v while downloading, peer uploads chunks to other peers
v peer may change peers with whom it exchanges chunks
v churn: peers may come and go
v once peer has entire file, it may (selfishly) leave or
(altruistically) remain in torrent

---

## Page 83

Application Layer 2-83
BitTorrent: requesting, sending file chunks
requesting chunks:
v at any given time, different
peers have different subsets
of file chunks
v periodically, Alice asks each
peer for list of chunks that
they have
v Alice requests missing
chunks from peers, rarest
first
sending chunks: tit-for-tat
v Alice sends chunks to those
four peers currently sending her
chunks at highest rate
§ other peers are choked by Alice
(do not receive chunks from her)
§ re-evaluate top 4 every10 secs
v every 30 secs: randomly select
another peer, starts sending
chunks
§ optimistically unchoke this peer
§ newly chosen peer may join top 4

---

## Page 84

Application Layer 2-84
BitTorrent: tit-for-tat
(1) Alice optimistically unchokes Bob
(2) Alice becomes one of Bobs top-four providers; Bob reciprocates
(3) Bob becomes one of Alices top-four providers
higher upload rate: find better
trading partners, get file faster !

---

## Page 85

Distributed Hash Table (DHT)
v Hash table
v DHT paradigm
v Circular DHT and overlay networks
v Peer churn

---

## Page 86

Key
Value
John Washington
132-54-3570
Diana Louise Jones
761-55-3791
Xiaoming Liu
385-41-0902
Rakesh Gopal
441-89-1956
Linda Cohen
217-66-5609
…….
………
Lisa Kobayashi
177-23-0199
Simple database with(key, value) pairs:
• key: human name; value: social security #
Simple Database
• key: movie title; value: IP address

---

## Page 87

Original Key
Key
Value
John Washington
8962458
132-54-3570
Diana Louise Jones
7800356
761-55-3791
Xiaoming Liu
1567109
385-41-0902
Rakesh Gopal
2360012
441-89-1956
Linda Cohen
5430938
217-66-5609
…….
………
Lisa Kobayashi
9290124
177-23-0199
• More convenient to store and search on
numerical representation of key
• key = hash(original key)
Hash Table

---

## Page 88

v Distribute (key, value) pairs over millions of peers
§ pairs are evenly distributed over peers
v Any peer can query database with a key
§ database returns value for the key
§ To resolve query, small number of messages exchanged among
peers
v Each peer only knows about a small number of other
peers
v Robust to peers coming and going (churn)
Distributed Hash Table (DHT)

---

## Page 89

Assign key-value pairs to peers
v rule: assign key-value pair to the peer that has the
closest ID.
v convention: closest is the immediate successor of
the key.
v e.g., ID space {0,1,2,3,…,63}
v suppose 8 peers: 1,12,13,25,32,40,48,60
§ If key = 51, then assigned to peer 60
§ If key = 60, then assigned to peer 60
§ If key = 61, then assigned to peer 1

---

## Page 90

1
12
13
25
32
40
48
60
Circular DHT
• each peer only aware of
immediate successor and
predecessor.
overlay network

---

## Page 91

1
12
13
25
32
40
48
60
What is the value
associated with key 53 ?
value
O(N) messages
on avgerage to resolve
query, when there
are N peers
Resolving a query

---

## Page 92

Circular DHT with shortcuts
•
each peer keeps track of IP addresses of predecessor,
successor, short cuts.
•
reduced from 6 to 3 messages.
•
possible to design shortcuts with O(log N) neighbors, O(log N)
messages in query
1
12
13
25
32
40
48
60
What is the value for
key 53
value

---

## Page 93

Peer churn
example: peer 5 abruptly leaves
1
3
4
5
8
10
12
15
handling peer churn:
vpeers may come and go (churn)
veach peer knows address of its
two successors
veach peer periodically pings its
two successors to check aliveness
vif immediate successor leaves,
choose next successor as new
immediate successor

---

## Page 94

Peer churn
example: peer 5 abruptly leaves
vpeer 4 detects peer 5s departure; makes 8 its immediate
successor
v 4 asks 8 who its immediate successor is; makes 8s
immediate successor its second successor.
1
3
4
8
10
12
15
handling peer churn:
vpeers may come and go (churn)
veach peer knows address of its
two successors
veach peer periodically pings its
two successors to check aliveness
vif immediate successor leaves,
choose next successor as new
immediate successor

---

## Page 95

Application Layer 2-95
Chapter 2: outline
2.1 principles of network
applications
§ app architectures
§ app requirements
2.2 Web and HTTP
2.3 FTP
2.4 electronic mail
§ SMTP, POP3, IMAP
2.5 DNS
2.6 P2P applications
2.7 socket programming
with UDP and TCP

---

## Page 96

Application Layer 2-96
Socket programming
goal: learn how to build client/server applications that
communicate using sockets
socket: door between application process and end-
end-transport protocol
Internet
controlled
by OS
controlled by
app developer
transport
application
physical
link
network
process
transport
application
physical
link
network
process
socket

---

## Page 97

Application Layer 2-97
Socket programming
Two socket types for two transport services:
§ UDP: unreliable datagram
§ TCP: reliable, byte stream-oriented
Application Example:
1.
Client reads a line of characters (data) from its
keyboard and sends the data to the server.
2.
The server receives the data and converts
characters to uppercase.
3.
The server sends the modified data to the client.
4.
The client receives the modified data and displays
the line on its screen.

---

## Page 98

Application Layer 2-98
Socket programming with UDP
UDP: no connection between client & server
v no handshaking before sending data
v sender explicitly attaches IP destination address and
port # to each packet
v rcvr extracts sender IP address and port# from
received packet
UDP: transmitted data may be lost or received
out-of-order
Application viewpoint:
v UDP provides unreliable transfer  of groups of bytes
(datagrams)  between client and server

---

## Page 99

Client/server socket interaction: UDP
close
clientSocket
read datagram from
clientSocket
create socket:
clientSocket =
socket(AF_INET,SOCK_DGRAM)
Create datagram with server IP and
port=x; send datagram via
clientSocket
create socket, port= x:
serverSocket =
socket(AF_INET,SOCK_DGRAM)
read datagram from
serverSocket
write reply to
serverSocket
specifying
client address,
port number
Application  2-99
server (running on serverIP)
client

---

## Page 100

Application Layer 2-100
Example app: UDP client
from socket import *
serverName = ‘hostname’
serverPort = 12000
clientSocket = socket(socket.AF_INET,
socket.SOCK_DGRAM)
message = raw_input(’Input lowercase sentence:’)
clientSocket.sendto(message,(serverName, serverPort))
modifiedMessage, serverAddress =
clientSocket.recvfrom(2048)
print modifiedMessage
clientSocket.close()
Python UDPClient
include Python’s socket
library
create UDP socket for
server
get user keyboard
input
Attach server name, port to
message; send into socket
print out received string
and close socket
read reply characters from
socket into string

---

## Page 101

Application Layer 2-101
Example app: UDP server
from socket import *
serverPort = 12000
serverSocket = socket(AF_INET, SOCK_DGRAM)
serverSocket.bind(('', serverPort))
print The server is ready to receive”
while 1:
message, clientAddress = serverSocket.recvfrom(2048)
modifiedMessage = message.upper()
serverSocket.sendto(modifiedMessage, clientAddress)
Python UDPServer
create UDP socket
bind socket to local port
number 12000
loop forever
Read from UDP socket into
message, getting client’s
address (client IP and port)
send upper case string
back to this client

---

## Page 102

Application Layer 2-102
Socket programming with TCP
client must contact server
v server process must first be
running
v server must have created
socket (door) that
welcomes clients contact
client contacts server by:
v Creating TCP socket,
specifying IP address, port
number of server process
v when client creates socket:
client TCP establishes
connection to server TCP
v when contacted by client,
server TCP creates new socket
for server process to
communicate with that
particular client
§ allows server to talk with
multiple clients
§ source port numbers used
to distinguish clients
(more in Chap 3)
TCP provides reliable, in-order
byte-stream transfer (pipe)
between client and server
application viewpoint:

---

## Page 103

Application Layer 2-103
Client/server socket interaction: TCP
wait for incoming
connection request
connectionSocket =
serverSocket.accept()
create socket,
port=x, for incoming
request:
serverSocket = socket()
create socket,
connect to hostid, port=x
clientSocket = socket()
server (running on hostid)
client
send request using
clientSocket
read request from
connectionSocket
write reply to
connectionSocket
TCP
connection setup
close
connectionSocket
read reply from
clientSocket
close
clientSocket

---

## Page 104

Application Layer 2-104
Example  app: TCP client
from socket import *
serverName = ’servername’
serverPort = 12000
clientSocket = socket(AF_INET, SOCK_STREAM)
clientSocket.connect((serverName,serverPort))
sentence = raw_input(‘Input lowercase sentence:’)
clientSocket.send(sentence)
modifiedSentence = clientSocket.recv(1024)
print ‘From Server:’, modifiedSentence
clientSocket.close()
Python TCPClient
create TCP socket for
server, remote port 12000
No need to attach server
name, port

---

## Page 105

Application Layer 2-105
Example app: TCP server
from socket import *
serverPort = 12000
serverSocket = socket(AF_INET,SOCK_STREAM)
serverSocket.bind((‘’,serverPort))
serverSocket.listen(1)
print ‘The server is ready to receive’
while 1:
connectionSocket, addr = serverSocket.accept()
sentence = connectionSocket.recv(1024)
capitalizedSentence = sentence.upper()
connectionSocket.send(capitalizedSentence)
connectionSocket.close()
Python TCPServer
create TCP welcoming
socket
server begins listening for
incoming TCP requests
loop forever
server waits on accept()
for incoming requests, new
socket created on return
read bytes from socket (but
not address as in UDP)
close connection to this
client (but not welcoming
socket)

---

## Page 106

Application Layer 2-106
Chapter 2: summary
v application architectures
§ client-server
§ P2P
v application service
requirements:
§ reliability, bandwidth, delay
v Internet transport service
model
§ connection-oriented,
reliable: TCP
§ unreliable, datagrams: UDP
our study of network apps now complete!
v specific protocols:
§ HTTP
§ FTP
§ SMTP, POP, IMAP
§ DNS
§ P2P: BitTorrent, DHT
v socket programming: TCP,
UDP sockets

---

## Page 107

Application Layer 2-107
v typical request/reply
message exchange:
§ client requests info or
service
§ server responds with
data, status code
v message formats:
§ headers: fields giving
info about data
§ data: info being
communicated
important themes:
v control vs. data msgs
§ in-band, out-of-band
v centralized vs. decentralized
v stateless vs. stateful
v reliable vs. unreliable msg
transfer
v complexity at network
edge
Chapter 2: summary
most importantly: learned about protocols!

---

## Page 108

Introduction 1-108
Chapter 1
Additional Slides

---

## Page 109

Transport (TCP/UDP)
Network (IP)
Link (Ethernet)
Physical
application
(www browser,
email client)
application
OS
packet
capture
(pcap)
packet
analyzer
copy of all
Ethernet
frames
sent/receive
d
