# ch02-chapter-2-v6.3 - Part 01 (Pages 1-55)

---

## Page 1

Application Layer 2-1
Chapter 2
Application Layer
Computer
Networking: A Top
Down Approach
6th edition
Jim Kurose, Keith Ross
Addison-Wesley
March 2012
A note on the use of these ppt slides:
Were making these slides freely available to all (faculty, students, readers).
Theyre in PowerPoint form so you see the animations; and can add, modify,
and delete slides  (including this one) and slide content to suit your needs.
They obviously represent a lot of work on our part. In return for use, we only
ask the following:
v If you use these slides (e.g., in a class) that you mention their source
(after all, wed like people to use our book!)
v If you post any slides on a www site, that you note that they are adapted
from (or perhaps identical to) our slides, and note our copyright of this
material.
Thanks and enjoy!  JFK/KWR
All material copyright 1996-2012
J.F Kurose and K.W. Ross, All Rights Reserved

---

## Page 2

Application Layer 2-2
Chapter 2: outline
2.1 principles of network
applications
2.2 Web and HTTP
2.3 FTP
2.4 electronic mail
§ SMTP, POP3, IMAP
2.5 DNS
2.6 P2P applications
2.7 socket programming
with UDP and TCP

---

## Page 3

Application Layer 2-3
Chapter 2: application layer
our goals:
v conceptual,
implementation aspects
of network application
protocols
§ transport-layer
service models
§ client-server
paradigm
§ peer-to-peer
paradigm
v learn about protocols by
examining popular
application-level
protocols
§ HTTP
§ FTP
§ SMTP / POP3 / IMAP
§ DNS
v creating network
applications
§ socket API

---

## Page 4

Application Layer 2-4
Some network apps
v e-mail
v web
v text messaging
v remote login
v P2P file sharing
v multi-user network games
v streaming stored video
(YouTube, Hulu, Netflix)
v voice over IP (e.g., Skype)
v real-time video
conferencing
v social networking
v search
v …
v …

---

## Page 5

Application Layer 2-5
Creating a network app
write programs that:
v run on (different) end systems
v communicate over network
v e.g., web server software
communicates with browser
software
no need to write software for
network-core devices
v network-core devices do not
run user applications
v applications on end systems
allows for rapid app
development, propagation
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

---

## Page 6

Application Layer 2-6
Application architectures
possible structure of applications:
v client-server
v peer-to-peer (P2P)

---

## Page 7

Application Layer 2-7
Client-server architecture
server:
v always-on host
v permanent IP address
v data centers for scaling
clients:
v communicate with server
v may be intermittently
connected
v may have dynamic IP
addresses
v do not communicate directly
with each other
client/server

---

## Page 8

Application Layer 2-8
P2P architecture
v no always-on server
v arbitrary end systems
directly communicate
v peers request service from
other peers, provide service
in return to other peers
§ self scalability – new
peers bring new service
capacity, as well as new
service demands
v peers are intermittently
connected and change IP
addresses
§ complex management
peer-peer

---

## Page 9

Application Layer 2-9
Processes communicating
process: program running
within a host
v within same host, two
processes communicate
using  inter-process
communication (defined by
OS)
v processes in different hosts
communicate by exchanging
messages
client process: process that
initiates communication
server process: process that
waits to be contacted
v aside: applications with P2P
architectures have client
processes & server
processes
clients, servers

---

## Page 10

Application Layer 2-10
Sockets
v process sends/receives messages to/from its socket
v socket analogous to door
§ sending process shoves message out door
§ sending process relies on transport infrastructure on
other side of door to deliver message to socket at
receiving process
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

## Page 11

Application Layer 2-11
Addressing processes
v to receive messages,
process  must have identifier
v host device has unique 32-
bit IP address
v Q: does  IP address of host
on which process runs
suffice for identifying the
process?
v identifier includes both IP
address and port numbers
associated with process on
host.
v example port numbers:
§ HTTP server: 80
§ mail server: 25
v to send HTTP message to
gaia.cs.umass.edu web
server:
§ IP address: 128.119.245.12
§ port number: 80
v more shortly…
§ A: no, many processes
can be running on same
host

---

## Page 12

Application Layer 2-12
App-layer protocol defines
v types of messages
exchanged,
§ e.g., request, response
v message syntax:
§ what fields in messages
& how fields are
delineated
v message semantics
§ meaning of information
in fields
v rules for when and how
processes send & respond
to messages
open protocols:
v defined in RFCs
v allows for interoperability
v e.g., HTTP, SMTP
proprietary protocols:
v e.g., Skype

---

## Page 13

Application Layer 2-13
What transport service does an app need?
data integrity
v some apps (e.g., file transfer,
web transactions) require
100% reliable data transfer
v other apps (e.g., audio) can
tolerate some loss
timing
v some apps (e.g., Internet
telephony, interactive
games) require low delay
to be effective
throughput
v some apps (e.g.,
multimedia) require
minimum amount of
throughput to be
effective
v other apps (elastic apps)
make use of whatever
throughput they get
security
v encryption, data integrity,
…

---

## Page 14

Application Layer 2-14
Transport service requirements: common apps
application
file transfer
e-mail
Web documents
real-time audio/video
stored audio/video
interactive games
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
time sensitive
no
no
no
yes, 100s
msec
yes, few secs
yes, 100s
msec
yes and no

---

## Page 15

Application Layer 2-15
Internet transport protocols services
TCP service:
v reliable transport between
sending and receiving
process
v flow control: sender wont
overwhelm receiver
v congestion control: throttle
sender when network
overloaded
v does not provide: timing,
minimum throughput
guarantee, security
v connection-oriented: setup
required between client and
server processes
UDP service:
v unreliable data transfer
between sending and
receiving process
v does not provide:
reliability, flow control,
congestion control,
timing, throughput
guarantee, security,
orconnection setup,
Q: why bother?  Why is
there a UDP?

---

## Page 16

Application Layer 2-16
Internet apps:  application, transport protocols
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

---

## Page 17

Securing TCP
TCP & UDP
v no encryption
v cleartext passwds sent
into socket traverse
Internet  in cleartext
SSL
v provides encrypted
TCP connection
v data integrity
v end-point
authentication
SSL is at app layer
v Apps use SSL libraries,
which talk to TCP
SSL socket API
v cleartext passwds sent
into socket traverse
Internet  encrypted
v See Chapter 7
Application Layer 2-17

---

## Page 18

Application Layer 2-18
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

## Page 19

Application Layer 2-19
Web and HTTP
First, a review…
v web page consists of objects
v object can be HTML file, JPEG image, Java applet,
audio file,…
v web page consists of base HTML-file which
includes several referenced objects
v each object is addressable by a URL, e.g.,
<www.someschool.edu/someDept/pic.gif>
host name
path name

---

## Page 20

Application Layer 2-20
HTTP overview
HTTP: hypertext
transfer protocol
v Webs application layer
protocol
v client/server model
§ client: browser that
requests, receives,
(using HTTP protocol)
and displays Web
objects
§ server: Web server
sends (using HTTP
protocol) objects in
response to requests
PC running
Firefox browser
server
running
Apache Web
server
iphone running
Safari browser
HTTP request
HTTP response
HTTP request
HTTP response

---

## Page 21

Application Layer 2-21
HTTP overview (continued)
uses TCP:
v client initiates TCP
connection (creates
socket) to server,  port 80
v server accepts TCP
connection from client
v HTTP messages
(application-layer protocol
messages) exchanged
between browser (HTTP
client) and Web server
(HTTP server)
v TCP connection closed
HTTP is stateless
v server maintains no
information about
past client requests
protocols that maintain
state are complex!
v past history (state) must be
maintained
v if server/client crashes, their
views of state may be
inconsistent, must be
reconciled
aside

---

## Page 22

Application Layer 2-22
HTTP connections
non-persistent HTTP
v at most one object
sent over TCP
connection
§ connection then
closed
v downloading multiple
objects required
multiple connections
persistent HTTP
v multiple objects can
be sent over single
TCP connection
between client, server

---

## Page 23

Application Layer 2-23
Non-persistent HTTP
suppose user enters URL:
1a. HTTP client initiates TCP
connection to HTTP server
(process) at
<www.someSchool.edu> on port
80
2. HTTP client sends HTTP request
message (containing URL) into
TCP connection socket.
Message indicates that client
wants object
someDepartment/home.index
1b. HTTP server at host
<www.someSchool.edu> waiting
for TCP connection at port 80.
accepts connection, notifying
client
3. HTTP server receives request
message, forms response
message containing requested
object, and sends message into
its socket
time
(contains text,
references to 10
jpeg images)
<www.someSchool.edu/someDepartment/home.index>

---

## Page 24

Application Layer 2-24
Non-persistent HTTP (cont.)
5. HTTP client receives response
message containing html file,
displays html.  Parsing html file,
finds 10 referenced jpeg  objects
6. Steps 1-5 repeated for each of
10 jpeg objects
4. HTTP server closes TCP
connection.
time

---

## Page 25

Application Layer 2-25
Non-persistent HTTP: response time
RTT (definition): time for a
small packet to travel from
client to server and back
HTTP response time:
v one RTT to initiate TCP
connection
v one RTT for HTTP request
and first few bytes of HTTP
response to return
v file transmission time
v non-persistent HTTP
response time =
2RTT+ file transmission
time
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

---

## Page 26

Application Layer 2-26
Persistent HTTP
non-persistent HTTP issues:
v requires 2 RTTs per object
v OS overhead for each TCP
connection
v browsers often open
parallel TCP connections
to fetch referenced objects
persistent  HTTP:
v server leaves connection
open after sending
response
v subsequent HTTP
messages  between same
client/server sent over
open connection
v client sends requests as
soon as it encounters a
referenced object
v as little as one RTT for all
the referenced objects

---

## Page 27

Application Layer 2-27
HTTP request message
v two types of HTTP messages: request, response
v HTTP request message:
§ ASCII (human-readable format)
request line
(GET, POST,
HEAD commands)
header
lines
carriage return,
line feed at start
of line indicates
end of header lines
GET /index.html HTTP/1.1\r\n
Host: www-net.cs.umass.edu\r\n
User-Agent: Firefox/3.6.10\r\n
Accept: text/html,application/xhtml+xml\r\n
Accept-Language: en-us,en;q=0.5\r\n
Accept-Encoding: gzip,deflate\r\n
Accept-Charset: ISO-8859-1,utf-8;q=0.7\r\n
Keep-Alive: 115\r\n
Connection: keep-alive\r\n
\r\n
carriage return character
line-feed character

---

## Page 28

Application Layer 2-28
HTTP request message: general format
request
line
header
lines
body
method
sp
sp
cr
lf
version
URL
cr
lf
value
header field name
cr
lf
value
header field name
~~
~~
cr
lf
entity body
~~
~~

---

## Page 29

Application Layer 2-29
Uploading form input
POST method:
v web page often includes
form input
v input is uploaded to
server in entity body
URL method:
v uses GET method
v input is uploaded in URL
field of request line:
<www.somesite.com/animalsearch?monkeys&banana>

---

## Page 30

Application Layer 2-30
Method types
HTTP/1.0:
v GET
v POST
v HEAD
§ asks server to leave
requested object out
of response
HTTP/1.1:
v GET, POST, HEAD
v PUT
§ uploads file in entity
body to path specified
in URL field
v DELETE
§ deletes file specified in
the URL field

---

## Page 31

Application Layer 2-31
HTTP response message
status line
(protocol
status code
status phrase)
header
lines
data, e.g.,
requested
HTML file
HTTP/1.1 200 OK\r\n
Date: Sun, 26 Sep 2010 20:09:20 GMT\r\n
Server: Apache/2.0.52 (CentOS)\r\n
Last-Modified: Tue, 30 Oct 2007 17:00:02
GMT\r\n
ETag: "17dc6-a5c-bf716880"\r\n
Accept-Ranges: bytes\r\n
Content-Length: 2652\r\n
Keep-Alive: timeout=10, max=100\r\n
Connection: Keep-Alive\r\n
Content-Type: text/html; charset=ISO-8859-
1\r\n
\r\n
data data data data data ...

---

## Page 32

Application Layer 2-32
HTTP response status codes
200 OK
§ request succeeded, requested object later in this msg
301 Moved Permanently
§ requested object moved, new location specified later in this msg
(Location:)
400 Bad Request
§ request msg not understood by server
404 Not Found
§ requested document not found on this server
505 HTTP Version Not Supported
v status code appears in 1st line in server-to-
client response message.
v some sample codes:

---

## Page 33

Application Layer 2-33
Trying out HTTP (client side) for yourself

1. Telnet to your favorite Web server:
opens TCP connection to port 80
(default HTTP server port) at cis.poly.edu.
anything typed in sent
to port 80 at cis.poly.edu
telnet cis.poly.edu 80
2. type in a GET HTTP request:
GET /~ross/ HTTP/1.1
Host: cis.poly.edu
by typing this in (hit carriage
return twice), you send
this minimal (but complete)
GET request to HTTP server
3. look at response message sent by HTTP server!
(or use Wireshark to look at captured HTTP request/response)

---

## Page 34

Application Layer 2-34
User-server state: cookies
many Web sites use cookies
four components:

1) cookie header line of
HTTP response
message
2) cookie header line in
next HTTP request
message
3) cookie file kept on
users host, managed
by users browser
4) back-end database at
Web site
example:
v Susan always access Internet
from PC
v visits specific e-commerce
site for first time
v when initial HTTP requests
arrives at site, site creates:
§ unique ID
§ entry in backend
database for ID

---

## Page 35

Application Layer 2-35
Cookies: keeping state (cont.)
client
server
usual http response msg
usual http response msg
cookie file
one week later:
usual http request msg
cookie: 1678
cookie-
specific
action
access
ebay 8734
usual http request msg
Amazon server
creates ID
1678 for user
create
entry
usual http response
set-cookie: 1678
ebay 8734
amazon 1678
usual http request msg
cookie: 1678
cookie-
specific
action
access
ebay 8734
amazon 1678
backend
database

---

## Page 36

Application Layer 2-36
Cookies (continued)
what cookies can be used
for:
v authorization
v shopping carts
v recommendations
v user session state (Web
e-mail)
cookies and privacy:
v cookies permit sites to
learn a lot about you
v you may supply name and
e-mail to sites
aside
how to keep state:
v protocol endpoints: maintain state at
sender/receiver over multiple
transactions
v cookies: http messages carry state

---

## Page 37

Application Layer 2-37
Web caches (proxy server)
v user sets browser: Web
accesses via  cache
v browser sends all HTTP
requests to cache
§ object in cache: cache
returns object
§ else cache requests
object from origin
server, then returns
object to client
goal: satisfy client request without involving origin server
client
proxy
server
client
HTTP request
HTTP response
HTTP request
HTTP request
origin
server
origin
server
HTTP response
HTTP response

---

## Page 38

Application Layer 2-38
More about Web caching
v cache acts as both
client and server
§ server for original
requesting client
§ client to origin server
v typically cache is
installed by ISP
(university, company,
residential ISP)
why Web caching?
v reduce response time
for client request
v reduce traffic on an
institutions access link
v Internet dense with
caches: enables poor
content providers to
effectively deliver
content (so too does
P2P file sharing)

---

## Page 39

Application Layer 2-39
Caching example:
origin
servers
public
Internet
institutional
network
1 Gbps LAN
1.54 Mbps
access link
assumptions:
v avg object size: 100K bits
v avg request rate from browsers to
origin servers:15/sec
v avg data rate to browsers: 1.50 Mbps
v RTT from institutional router to any
origin server: 2 sec
v access link rate: 1.54 Mbps
consequences:
v LAN utilization: 15%
v access link utilization = 99%
v total delay   = Internet delay + access
delay + LAN delay
=  2 sec + minutes + usecs
problem!

---

## Page 40

Application Layer 2-40
assumptions:
v avg object size: 100K bits
v avg request rate from browsers to
origin servers:15/sec
v avg data rate to browsers: 1.50 Mbps
v RTT from institutional router to any
origin server: 2 sec
v access link rate: 1.54 Mbps
consequences:
v
LAN utilization: 15%
v
access link utilization = 99%
v
total delay   = Internet delay + access
delay + LAN delay
=  2 sec + minutes + usecs
Caching example: fatter access link
origin
servers
1.54 Mbps
access link
154 Mbps
154 Mbps
msecs
Cost: increased access link speed (not cheap!)
9.9%
public
Internet
institutional
network
1 Gbps LAN

---

## Page 41

institutional
network
1 Gbps LAN
Application Layer 2-41
Caching example: install local cache
origin
servers
1.54 Mbps
access link
local web
cache
assumptions:
v avg object size: 100K bits
v avg request rate from browsers to
origin servers:15/sec
v avg data rate to browsers: 1.50 Mbps
v RTT from institutional router to any
origin server: 2 sec
v access link rate: 1.54 Mbps
consequences:
v
LAN utilization: 15%
v
access link utilization = 100%
v
total delay   = Internet delay + access
delay + LAN delay
=  2 sec + minutes + usecs
?
?
How to compute link
utilization, delay?
Cost: web cache (cheap!)
public
Internet

---

## Page 42

Application Layer 2-42
Caching example: install local cache
Calculating access link
utilization, delay with cache:
v suppose cache hit rate is 0.4
§ 40% requests satisfied at cache,
60% requests satisfied at origin
origin
servers
1.54 Mbps
access link
v access link utilization:
§ 60% of requests use access link
v data rate to browsers over access link
= 0.6*1.50 Mbps = .9 Mbps
§ utilization = 0.9/1.54 = .58
v total delay
§ = 0.6* (delay from origin servers) +0.4

* (delay when satisfied at cache)
§ = 0.6 (2.01) + 0.4 (~msecs)
§ = ~ 1.2 secs
§ less than with 154 Mbps link (and
cheaper too!)
public
Internet
institutional
network
1 Gbps LAN
local web
cache

---

## Page 43

Application Layer 2-43
Conditional GET
v Goal: dont send object if
cache has up-to-date
cached version
§ no object transmission
delay
§ lower link utilization
v cache: specify date of
cached copy in HTTP
request
If-modified-since:
<date>
v server: response contains
no object if cached copy
is up-to-date:
HTTP/1.0 304 Not
Modified
HTTP request msg
If-modified-since: <date>
HTTP response
HTTP/1.0
304 Not Modified
object
not
modified
before
<date>
HTTP request msg
If-modified-since: <date>
HTTP response
HTTP/1.0 200 OK
<data>
object
modified
after
<date>
client
server

---

## Page 44

Application Layer 2-44
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

## Page 45

Application Layer 2-45
FTP: the file transfer protocol
file transfer
FTP
server
FTP
user
interface
FTP
client
local file
system
remote file
system
user
at host
v transfer file to/from remote host
v client/server model
§ client: side that initiates transfer (either to/from remote)
§ server: remote host
v ftp: RFC 959
v ftp server: port 21

---

## Page 46

Application Layer 2-46
FTP: separate control, data connections
v FTP client contacts FTP server
at port 21, using TCP
v client authorized over control
connection
v client browses remote
directory, sends commands
over control connection
v when server receives file
transfer command, server
opens 2nd TCP data
connection (for file) to client
v after transferring one file,
server closes data connection
FTP
client
FTP
server
TCP control connection,
server port 21
TCP data connection,
server port 20
v server opens another TCP
data connection to transfer
another file
v control connection: out of
band
v FTP server maintains
state: current directory,
earlier authentication

---

## Page 47

Application Layer 2-47
FTP commands, responses
sample commands:
v sent as ASCII text over
control channel
v USER username
v PASS password
v LIST return list of file in
current directory
v RETR filename
retrieves (gets) file
v STOR filename stores
(puts) file onto remote
host
sample return codes
v status code and phrase (as
in HTTP)
v 331 Username OK,
password required
v 125 data
connection
already open;
transfer starting
v 425 Cant open
data connection
v 452 Error writing
file

---

## Page 48

Application Layer 2-48
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

## Page 49

Application Layer 2-49
Electronic mail
Three major components:
v user agents
v mail servers
v simple mail transfer
protocol: SMTP
User Agent
v a.k.a. mail reader
v composing, editing, reading
mail messages
v e.g., Outlook, Thunderbird,
iPhone mail client
v outgoing, incoming
messages stored on server
user mailbox
outgoing
message queue
mail
server
mail
server
mail
server
SMTP
SMTP
SMTP
user
agent
user
agent
user
agent
user
agent
user
agent
user
agent

---

## Page 50

Application Layer 2-50
Electronic mail: mail servers
mail servers:
v mailbox contains incoming
messages for user
v message queue of outgoing
(to be sent) mail messages
v SMTP protocol between
mail servers to send email
messages
§ client: sending mail
server
§ server: receiving mail
server
mail
server
mail
server
mail
server
SMTP
SMTP
SMTP
user
agent
user
agent
user
agent
user
agent
user
agent
user
agent

---

## Page 51

Application Layer 2-51
Electronic Mail: SMTP [RFC 2821]
v uses TCP to reliably transfer email message from
client to server, port 25
v direct transfer: sending server to receiving
server
v three phases of transfer
§ handshaking (greeting)
§ transfer of messages
§ closure
v command/response interaction (like HTTP, FTP)
§ commands: ASCII text
§ response: status code and phrase
v messages must be in 7-bit ASCI

---

## Page 52

Application Layer 2-52
user
agent
Scenario: Alice sends message to Bob

1) Alice uses UA to compose
message to
<bob@someschool.edu>
2) Alices UA sends message
to her mail server; message
placed in message queue
3) client side of SMTP opens
TCP connection with Bobs
mail server
4) SMTP client sends Alices
message over the TCP
connection
5) Bobs mail server places the
message in Bobs mailbox
6) Bob invokes his user agent
to read message
mail
server
mail
server
1
2
3
4
5
6
Alices mail server
Bobs mail server
user
agent

---

## Page 53

Application Layer 2-53
Sample SMTP interaction
S: 220 hamburger.edu
C: HELO crepes.fr
S: 250  Hello crepes.fr, pleased to meet you
C: MAIL FROM: <alice@crepes.fr>
S: 250 <alice@crepes.fr>... Sender ok
C: RCPT TO: <bob@hamburger.edu>
S: 250 <bob@hamburger.edu> ... Recipient ok
C: DATA
S: 354 Enter mail, end with "." on a line by itself
C: Do you like ketchup?
C: How about pickles?
C: .
S: 250 Message accepted for delivery
C: QUIT
S: 221 hamburger.edu closing connection

---

## Page 54

Application Layer 2-54
Try SMTP interaction for yourself:
v telnet servername 25
v see 220 reply from server
v enter HELO, MAIL FROM, RCPT TO, DATA, QUIT
commands
above lets you send email without using email client (reader)

---

## Page 55

Application Layer 2-55
SMTP: final words
v SMTP uses persistent
connections
v SMTP requires message
(header & body) to be in
7-bit ASCII
v SMTP server uses
CRLF.CRLF to
determine end of message
comparison with HTTP:
v HTTP: pull
v SMTP: push
v both have ASCII
command/response
interaction, status codes
v HTTP: each object
encapsulated in its own
response msg
v SMTP: multiple objects
sent in multipart msg
