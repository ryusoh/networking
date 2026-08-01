# cs234-02 - Part 02 (Pages 19-36)

---

## Page 19

Response Time of Non-
Persistent HTTP
´Sum of:
´one RTT to initiate
TCP connection
´one RTT for HTTP
request and first few
bytes of HTTP
response to return
´file transmission time
´Hence, non-
persistent HTTP
response time =
2RTT+ file
transmission time
19
time to
transmit
file
initiate TCP
connection
RTT
request
file
RTT
file
received
time
time
One rrt to initiate tcp connection
One rrt for http request and ﬁrst few bytes of http response
to return
File transmission time

---

## Page 20

Persistent HTTP
´ server leaves connection open after
sending response
´ subsequent HTTP messages  between same
client/server sent over open connection
´ client sends requests as soon as it
encounters a referenced object
´ as little as one RTT for all the referenced
objects
´ advantages: shorter response time, lower OS
and network overhead
20
Server leaves connection open after sending response
Subsequent http messages between same client server sent over open connection
Client sends requests as soon as it encounters a referenced object
As little as one rtt for all the referenced objects
Shorter response time lower os and network overhead

---

## Page 21

User-Server State: Cookies
´ four components:
´ cookie header
line of HTTP
response
message
´ cookie header
line in next HTTP
request message
´ cookie file kept on
user’s host,
managed by
user’s browser
´ back-end
database at Web
site
´ Susan visits
specific e-
commerce site
for first time
´ when initial HTTP
requests arrives at
site, site creates:
´ unique ID
´ entry in backend
database for ID
´ one week later the
same cookie is sent
back to the same
website
21
Cookie header line
of http response
message
Next http
request message
Cookie ﬁle kept on
user’s host managed
by user’s browser
Back-end database
at website

---

## Page 22

What Cookies Can Do?
´ Keep user states for:
´authorization
´shopping carts
´recommendations
´user session state
(Web e-mail)
´ Q: Didn’t we say
HTTP is stateless?
´ privacy concern
´cookies permit
sites to learn a
lot about you
´you may
supply name
and e-mail to
sites
22

---

## Page 23

Agenda
´Architecture: Client-Server
versus P2P
´Application Service
Requirements: TCP versus UDP
´Sample Application Protocol:
HTTP
´Socket Programming in Python
23

---

## Page 24

How Processes
Communicate?
´ process: program
running within a
host
´ within same host,
two processes
communicate
using  inter-process
communication
(IPC, defined by
OS)
´ processes in
different hosts
communicate by
exchanging
messages
´ client process:
process that initiates
communication
´ server process:
process that waits to
be contacted
´ Note: Both client-
server and P2P
applications have
client and server
process
24

---

## Page 25

Sockets
´ process sends/receives messages to/from
its sockets
25
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

## Page 26

Addressing…
´ to receive messages,
process  must have
identifier
´ host device has unique
32-bit IP address
´ but, many processes
can be running on
same host
´ identifier includes both
IP address and port
numbers
´ example port numbers:
´ HTTP server: 80
´ mail server: 25
´ to send HTTP message
to gaia.cs.umass.edu
web server:
´ IP address:
128.119.245.12
´ port number: 80
26
IP routers route each packet using the 5-tuple in the
header <src_ip, src_port, dst_ip, dst_port, proto>

---

## Page 27

Socket Programming with
UDP
´ UDP: no “connection” between client & server
´ no handshaking before sending data
´ sender explicitly attaches IP destination address and
port # to each packet
´ receiver extracts sender IP address and port# from
received packet
´ UDP: transmitted data may be lost or received
out-of-order
´ Application viewpoint:
´ UDP provides unreliable transfer of groups of bytes
(“datagrams”)  between client and server ß nature
boundary between adjacent messages
27

---

## Page 28

Client/Server Socket
Interaction: UDP
28
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
server (running on serverIP)
client

---

## Page 29

UDP Client Example
29
from socket import *
serverName = ‘hostname’
serverPort = 12000
clientSocket = socket(AF_INET,
SOCK_DGRAM)
message = raw_input(’Input lowercase sentence:’)
clientSocket.sendto(message.encode(),
(serverName, serverPort))
modifiedMessage, serverAddress =
clientSocket.recvfrom(2048)
print modifiedMessage.decode()
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

## Page 30

UDP Server Example
30
from socket import *
serverPort = 12000
serverSocket = socket(AF_INET, SOCK_DGRAM)
serverSocket.bind(('', serverPort))
print (The server is ready to receive”)
while True:
message, clientAddress = serverSocket.recvfrom(2048)
modifiedMessage = message.decode().upper()
serverSocket.sendto(modifiedMessage.encode(),
clientAddress)
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

## Page 31

Socket Programming with
TCP
´ client must contact
server
´ server process must
first be running
´ server must have
created socket (door)
that welcomes client’s
contact
´ client contacts server
by:
´ Creating TCP socket,
specifying IP address,
port number of server
process
´ when client creates
socket: client TCP
establishes connection
to server TCP
´ when contacted by
client, server TCP creates
new socket for server
process to communicate
with that particular client
´ allows server to talk with
multiple clients
´ source port numbers
used to distinguish
clients (5-tuple)
´ application viewport:
´ TCP provides reliable, in-
order byte-stream
transfer (“pipe”)
between client and
server ß no nature
boundary between two
messages
31

---

## Page 32

Client/Server Socket
Interaction: TCP
32
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

## Page 33

TCP Client Example
33
from socket import *
serverName = ’servername’
serverPort = 12000
clientSocket = socket(AF_INET, SOCK_STREAM)
clientSocket.connect((serverName,serverPort))
sentence = raw_input(‘Input lowercase sentence:’)
clientSocket.send(sentence.encode())
modifiedSentence = clientSocket.recv(1024)
print (‘From Server:’, modifiedSentence.decode())
clientSocket.close()
Python TCPClient
create TCP socket for
server, remote port 12000
No need to attach server
name, port

---

## Page 34

TCP Server Example
34
from socket import *
serverPort = 12000
serverSocket = socket(AF_INET,SOCK_STREAM)
serverSocket.bind((‘’,serverPort))
serverSocket.listen(1)
print ‘The server is ready to receive’
while True:
connectionSocket, addr = serverSocket.accept()
sentence = connectionSocket.recv(1024).decode()
capitalizedSentence = sentence.upper()
connectionSocket.send(capitalizedSentence.
encode())
connectionSocket.close()
Python TCPServer
create TCP server socket
server begins listening for
incoming TCP requests
loop forever
server waits on accept()
for incoming requests, new
socket created on return
read bytes from socket (but
not address as in UDP)
close connection to this
client (but not server socket)

---

## Page 35

Take-Away Messages
´ typical request/reply message exchange:
´ client requests info or service
´ server responds with data, status code
´ message formats:
´ headers: fields giving info about data
´ payload: info (data)  being communicated
´ important design decisions
´ control vs. messages
´ in-band, out-of-band
´ centralized vs. decentralized
´ stateless vs. stateful
´ reliable vs. unreliable message transfer
´ philosophy: complexity at network edge
35

---

## Page 36

36
Questions
<chsu@cs.nthu.edu.tw>
