# chapter-02-v6-3

---

## Page 1

Application Layer 2-1
Chapter 2
Application
Layer
rking: A
Top Down
Approach
6th edition
Jim Kurose, Keith
Ross
Addison-Wesley
March 2012
A note on the
We’re making these
They’re in PowerPoint form so you see the animations; and can add, modify,
and delete slides  (including this one) and slide content to suit your needs.
They obviously represent a lot of work on our part. In return for use, we only
ask the following:
v If you use these slides (e.g., in a class) that you mention their source
(after all, we’d like people to use our book!)
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
2.1 principles of
network
applications
2.4 electronic mail
§ SMTP, POP3,
IMAP
2.5 DNS
2.6 P2P applications
2.7 socket
gramming

---

## Page 3

Application Layer 2-3
Chapter 2: application
layer
our goals:
v conceptual,
implementation
aspects of netw
§ tra
service models
§ client-server
paradigm
§ peer-to-peer
paradigm
v learn about
protocols by
examining popular
tion-level
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
v multi-
games
v streaming stored
video (YouTube,
Hulu, Netflix)
v voice over IP (e.g.,
Skype)
ime video
encing
v …
v …

---

## Page 5

Application Layer 2-5
Creating a network app
write programs that:
v run on (different) end
systems
v communicate over
network
with b
no need to write software
for network-core
devices
v network-core devices
do not run user
applications
v applications on end
systems  allows for
id
d
l
t
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
v peer-to-peer

---

## Page 7

Application Layer 2-7
Client-server architecture
server:
v always-on host
v permanent IP address
 centers for scaling
v communicate with
server
v may be intermittently
connected
v may have dynamic IP
addresses
v do not communicate
directly with each
other
client/server

---

## Page 8

Application Layer 2-8
P2P architecture
v no always-on server
v arbitrary end systems
directly communicate
v peers request se
§ self scalability –
new peers bring
new service
capacity, as well as
new service
demands
v peers are
intermittently
connected and change
IP addresses
peer-peer

---

## Page 9

Application Layer 2-9
Processes communicating
process: program
running within a
host
comm
inter-
communication
(defined by OS)
v processes in different
hosts communicate by
exchanging messages
client process:
cess that initiates
waits to
be contacted
v aside: applications
with P2P architectures
have client processes
& server processes
clients, servers

---

## Page 10

Application Layer 2-10
Sockets
v process sends/receives messages to/from its
socket
v socket analogous to door
§ sending process shoves message out door
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
process  must have
identifier
v host device has
v Q: do
host on which process
runs suffice for
identifying the
process?
v identifier includes both
IP address and port
numbers associated
with process on host.
80
§ mail server: 25
v to send HTTP message
to gaia.cs.umass.edu
web server:
§ IP address:
128.119.245.12
§ port number: 80
v more shortly…
§ A: no, many
processes can be
running on same
host

---

## Page 12

Application Layer 2-12
App-layer protocol defines
v types of messages
exchanged,
§ e.g., request,
response
me
fields are
delineated
v message semantics
§ meaning of
information in
fields
v rules for when and
how processes send &
respond to messages
open protocols:
v defined in RFCs
v allows for
roperability
v

---

## Page 13

Application Layer 2-13
What transport service does an
app need?
data integrity
v some apps (e.g., file
transfer, web
transactions) require
100% reliable d
v other a
can tolerate some loss
timing
v some apps (e.g.,
Internet telephony,
interactive games)
require low delay to
be “effective”
throughput
v some apps (e.g.,
multimedia) require
minimum amount of
oughput to be
 use of
whatever throughput
they get
security
v encryption, data
integrity, …

---

## Page 14

Application Layer 2-14
Transport service requirements:
common apps
application
file transfer
real-time audi
stored audio/video
interactive games
text messaging
data loss
no l
loss-tolerant
loss-tolerant
no loss
throughput
same as above
few kbps up
elastic
time sensitive
no
s, 100’s msec
yes, few secs
yes, 100’s msec
yes and no

---

## Page 15

Application Layer 2-15
Internet transport protocols
services
TCP service:
v reliable transport
between sending and
receiving proce
receiv
v congestion control:
throttle sender when
network overloaded
v does not provide:
timing, minimum
throughput guarantee,
security
v connection-oriented:
setup required
between client and
server processes
UDP service:
v unreliable data
transfer between
ing and

control, congestion
control, timing,
throughput
guarantee, security,
orconnection setup,
Q: why bother?  Why
is there a UDP?

---

## Page 16

Application Layer 2-16
Internet apps:  application, transport
protocols
application
e-mail
rem
fil
streaming m
Internet telephony
application
layer protocol
RTP [RFC 1889]
SIP, RTP, proprietary
(e.g., Skype)
underlying
transport protocol
TCP
TCP or UDP
TCP or UDP

---

## Page 17

Securing TCP
TCP & UDP
v no encryption
v cleartext pas
in cle
SSL
v provides
encrypted TCP
connection
v data integrity
v end-point
authentication
SSL is at app layer
v Apps use SSL
ies, which
v cleartext passwds
sent into socket
traverse Internet
encrypted
v See Chapter 7
Application Layer 2-17

---

## Page 18

Application Layer 2-18
Chapter 2: outline
2.1 principles of
network
applications
2.2 We
2.3 FTP
2.4 electronic mail
§ SMTP, POP3,
IMAP
2.5 DNS
2.6 P2P applications
2.7 socket
gramming

---

## Page 19

Application Layer 2-19
Web and HTTP
First, a review…
v web page consists of objects
v object can be
EG image,
whic
objects
v each object is addressable by a URL,
e.g.,
<www.someschool.edu/someDept/pic.gif>
host name
path name

---

## Page 20

Application Layer 2-20
HTTP overview
HTTP: hypertext
transfer protocol
v Web’s application
layer protocol
tha
receives, (using
HTTP protocol)
and “displays”
Web objects
§ server: Web
server sends
(using HTTP
protocol) objects
in response to
requests
ser
server
running
Apache Web
server
iphone running
Safari browser
HTTP request
HT
HTTP requ
HTTP response

---

## Page 21

Application Layer 2-21
HTTP overview (continued)
uses TCP:
v client initiates TCP
connection (creates
socket) to serv
v
conne
v HTTP messages
(application-layer
protocol messages)
exchanged between
browser (HTTP client)
and Web server (HTTP
server)
v TCP connection closed
HTTP is
“stateless”
v server maintains
 information
maintain “state” are
complex!
v past history (state) must
be maintained
v if server/client crashes,
their views of “state”
may be inconsistent,
must be reconciled

---

## Page 22

Application Layer 2-22
HTTP connections
non-persistent
HTTP
v at most one
§ co
closed
v downloading
multiple objects
required multiple
connections
persistent HTTP
v multiple objects
e sent over
t,
server

---

## Page 23

Application Layer 2-23
Non-persistent HTTP
suppose user enters URL:
1a. HTTP client initiates TCP
connection to HTT
(process) at
2. HTTP client sends HTTP
request message
(containing URL) into
TCP connection socket.
Message indicates that
client wants object
someDepartment/home.i
ndex
P server at host
rt 80.
“accepts” connection,
notifying client
3. HTTP server receives
request message, forms
response message
containing requested
object, and sends
message into its socket
time
(contains text,
references to 10
jpeg images)
<www.someSchool.edu/someDepartment/home.index>

---

## Page 24

Application Layer 2-24
Non-persistent HTTP (cont.)
5. HTTP client receives
response message
containing html
6. St
each of 10 jpeg objects
4. HTTP server closes TCP
connection.
time

---

## Page 25

Application Layer 2-25
Non-persistent HTTP: response
time
RTT (definition): time for
a small packet to
travel from client to
server and back
HTTP response ti
v one R
request and first few
bytes of HTTP
response to return
v file transmission time
v non-persistent HTTP
response time =
   2RTT+ file
transmission  time
time to
transmit
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
non-persistent HTTP
issues:
v requires 2 RTTs per
object
v
v brows
parallel TCP
connections to fetch
referenced objects
persistent  HTTP:
v server leaves
connection open
 sending
ween
same client/server
sent over open
connection
v client sends requests
as soon as it
encounters a
referenced object
v as little as one RTT
for all the referenced
bj
t

---

## Page 27

Application Layer 2-27
HTTP request message
v two types of HTTP messages: request,
response
v HTTP request m
ASCII (human-
req
(GET, POST,
HEAD commands)
header
 lines
carriage return,
line feed at start
of line indicates
end of header lines
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

---

## Page 28

Application Layer 2-28
HTTP request message: general
format
request
line
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
v web page often
includes form input
v input is upload
URL
v uses GET method
v input is uploaded in
URL field of request
line: <www.somesite.com/animalsearch?monkeys&banana>

---

## Page 30

Application Layer 2-30
Method
types
HTTP/1.0:
v GET
v POST
lea
object out of
response
HTTP/1.1:
v GET, POST, HEAD
d in
URL field
v DELETE
§ deletes file
specified in the
URL field

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
Server:
ntOS)\r\n
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
g
301 M
§ requested object moved, new location specified later in
this msg (Location:)
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
Trying out HTTP (client side) for
yourself

1. Telnet to your favorite Web server:
opens TCP connection to port 80
rver port) at cis.poly.edu.
telnet cis.poly.edu 80
2. type in a GET HTTP request:
GET /~ross/ HTTP/1.1
Host: cis.poly.edu
by typing this in (hit carriage
return twice), you send
this minimal (but complete)
GET request to HTTP server
3. look at response message sent by HTTP server!
(or use Wireshark to look at captured HTTP request/resp

---

## Page 34

Application Layer 2-34
User-server state: cookies
many Web sites use
cookies
four components:
me
2) cookie header
line in next HTTP
request message
3) cookie file kept
on user’s host,
managed by
user’s browser
4) back-end
database at Web
example:
v Susan always access
Internet from PC
pecific e-
P
requests arrives at
site, site creates:
§ unique ID
§ entry in backend
database for ID

---

## Page 35

Application Layer 2-35
Cookies: keeping “state” (cont.)
client
server
usual http response msg
usual http response msg
cookie file
one week later:
cookie: 1678
cookie-
specific
action
access
ebay 8734
usual http request msg
Amazon server
eates ID
usual
usual http request msg
cookie: 1678
cookie-
specific
action
access
ebay 8734
amazon 1678
nd
ase

---

## Page 36

Application Layer 2-36
Cookies (continued)
what cookies can be
used for:
v authorization
v shopping carts
(Web
cookies and privacy:
v cookies permit sites
to learn a lot about
aside
how to keep “state”:
v protocol endpoints: maintain
state at sender/receiver over
multiple transactions
v cookies: http messages carry
state

---

## Page 37

Application Layer 2-37
Web caches (proxy server)
v user sets browser:
Web accesses via
cache
v
cache
§ object in cache:
cache returns
object
§ else cache
requests object
from origin server,
then returns
object to client
goal: satisfy client request without involving
origin server
client
HTTP request
HTTP response
origin
server
origin
server
ponse
HTTP espons

---

## Page 38

Application Layer 2-38
More about Web caching
v cache acts as
both client and
server
§ clie
v typically cache is
installed by ISP
(university,
company,
residential ISP)
why Web caching?
v reduce response
for client

ccess
link
v Internet dense with
caches: enables
“poor” content
providers to
effectively deliver
content (so too
does P2P file

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
v avg request rate from
browsers to origin
servers:15/sec
v
v RTT fro
to any origin server: 2 sec
v access link rate: 1.54 Mbps
consequences:
v LAN utilization: 15%
v access link utilization = 99%
v total delay   = Internet delay

+ access delay + LAN delay
     =  2 sec + minutes + usecs
problem!

---

## Page 40

Application Layer 2-40
assumptions:
v avg object size: 100K bits
v avg request rate from
browsers to origin
servers:15/sec
v
v RTT fro
to any origin server: 2 sec
v access link rate: 1.54 Mbps
consequences:
v
LAN utilization: 15%
v
access link utilization = 99%
v
total delay   = Internet delay +
access delay + LAN delay
     =  2 sec + minutes + usecs
Caching example: fatter
access link
origin
servers
1.54 Mbps
access link
154
Mbps
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
Caching example: install local
cache
origin
servers
1.54 Mbps
access link
local web
cache
assumptions:
v avg object size: 100K bits
v avg request rate from
browsers to origin
servers:15/sec
v
v RTT fro
to any origin server: 2 sec
v access link rate: 1.54 Mbps
consequences:
v
LAN utilization: 15%
v
access link utilization = 100%
v
total delay   = Internet delay +
access delay + LAN delay
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
Caching example: install local
cache
Calculating access link
utilization, delay with
cache:
v suppose cache h
cache
satisf

origin
servers
1.54 Mbps
access link
§ 60%
link
v data rate to browsers over
access link = 0.6*1.50 Mbps =
.9 Mbps
§ utilization = 0.9/1.54 = .58
v total delay
§ = 0.6* (delay from origin
servers) +0.4 * (delay when
satisfied at cache)
§ = 0.6 (2.01) + 0.4 (~msecs)
§ = ~ 1.2 secs
§ less than with 154 Mbps link
(and cheaper too!)
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
v Goal: don’t send
object if cache has
up-to-date cached
version
v cache:
of cached copy in
HTTP request
If-modified-since:
<date>
v server: response
contains no object if
cached copy is up-
to-date:
HTTP/1.0 304 Not
M difi d
HTTP request msg
If-modified-since: <date>
object
not
ified
ore
te>
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
2.1 principles of
network
applications
2.2 We
2.3 FTP
2.4 electronic mail
§ SMTP, POP3,
IMAP
2.5 DNS
2.6 P2P applications
2.7 socket
gramming

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
remote file
system
user
at host
v transfer file to/from remote host
v client/server model
§ client: side that initiates transfer (either
to/from remote)
§ server: remote host
v ftp: RFC 959
v ftp server: port 21

---

## Page 46

Application Layer 2-46
FTP: separate control, data
connections
v FTP client contacts FTP
server at port 21, using
TCP
v client authorized
v
directo
commands over control
connection
v when server receives
file transfer command,
server opens 2nd TCP
data connection (for
file) to client
v after transferring one
file, server closes data
i
FTP
r
TCP control connection,
server port 21
TCP data connection,
server port 20
nother
TCP data connection to
transfer another file
v control connection:
“out of band”
v FTP server maintains
“state”: current
directory, earlier
authentication

---

## Page 47

Application Layer 2-47
FTP commands, responses
sample commands:
v sent as ASCII text
over control channel
v USER username
file in
directory
v RETR filename
retrieves (gets) file
v STOR filename
stores (puts) file
onto remote host
sample return
codes
v status code and
ase (as in HTTP)
connection
already open;
transfer starting
v 425 Can’t open
data connection
v 452 Error writing
file

---

## Page 48

Application Layer 2-48
Chapter 2: outline
2.1 principles of
network
applications
2.2 We
2.3 FTP
2.4 electronic mail
§ SMTP, POP3,
IMAP
2.5 DNS
2.6 P2P applications
2.7 socket
gramming

---

## Page 49

Application Layer 2-49
Electronic mail
Three major
components:
v user agents
v mail servers
User Agent
v a.k.a. “mail reader”
v composing, editing,
reading mail
messages
v e.g., Outlook,
Thunderbird, iPhone
mail client
user mailbox
outgoing
message queue
mail
server
mail
SMTP
user
agent
user
agent
er
nt
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
v mailbox contains
incoming messages
for user
v
mail
v SMTP protocol
between mail servers
to send email
messages
§ client: sending
mail server
§ “server”: receiving
mail server
mail
server
mail
SMTP
user
agent
user
agent
er
nt
user
agent
user
agent
user
agent

---

## Page 51

Application Layer 2-51
Electronic Mail: SMTP [RFC
2821]
v uses TCP to reliably transfer email
message from client to server, port 25
v direct transfer: sending server to
§ ha
§ transfer of messages
§ closure
v command/response interaction (like
HTTP, FTP)
§ commands: ASCII text
§ response: status code and phrase
v messages must be in 7-bit ASCI

---

## Page 52

Application Layer 2-52
user
agent
Scenario: Alice sends message
to Bob

1) Alice uses UA to
compose message “to”
<bob@someschool.edu>
2) Alice’s UA sends
message to her
queue
3) client side of SMTP
opens TCP connection
with Bob’s mail server
4) SMTP client sends
Alice’s message over
the TCP connection
5) Bob’s mail server
 the message in
ssage
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
Alice’s mail server
Bob’s mail server
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
     S: 250 alice@cre
ok

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
Try SMTP interaction for
yourself:
v telnet servername 25
v see 220 reply from server
v enter HELO, M
TO, DATA,
above l
ail
client (reader)

---

## Page 55

Application Layer 2-55
SMTP: final words
v SMTP uses persistent
connections
v SMTP requires
message (head
v SMTP
CRLF.CRLF to
determine end of
message
comparison with
HTTP:
 pull
I
command/response
interaction, status
codes
v HTTP: each object
encapsulated in its
own response msg
v SMTP: multiple
objects sent in
multipart msg

---

## Page 56

Application Layer 2-56
Mail message format
SMTP: protocol for
exchanging email
msgs
RFC 822: standar
v heade
§ To:
§ From:
§ Subject:
different from SMTP
MAIL FROM, RCPT
TO: commands!
v Body: the “message”
§ ASCII characters only
header
blank
line

---

## Page 57

Application Layer 2-57
Mail access protocols
v
v mail
r
§ POP: Post Office Protocol [RFC 1939]:
authorization, download
§ IMAP: Internet Mail Access Protocol [RFC
1730]: more features, including manipulation
of stored msgs on server
§ HTTP: gmail, Hotmail, Yahoo! Mail, etc.
send
SMTP
SMTP
mail access
protocol
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
§ user: declare
username
v
§ +OK
§ -ERR
transaction phase,
client:
v list: list message
numbers
v retr: retrieve message
by number
v dele: delete
v quit
st
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
v previous example
uses POP3
“download and
rea
changes client
v POP3 “download-
and-keep”: copies of
messages on
different clients
v POP3 is stateless
across sessions
IMAP
v keeps all messages
in one place: at
v keeps user state
across sessions:
§ names of folders
and mappings
between message
IDs and folder
name

---

## Page 60

Application Layer 2-60
Chapter 2: outline
2.1 principles of
network
applications
2.2 We
2.3 FTP
2.4 electronic mail
§ SMTP, POP3,
IMAP
2.5 DNS
2.6 P2P applications
2.7 socket
gramming

---

## Page 61

Application Layer 2-61
DNS: domain name system
people: many
identifiers:
§ SSN, name,
passport #
I
§ IP a
bit) - used for
addressing
datagrams
§ “name”, e.g.,
<www.yahoo.com> -
used by humans
Q: how to map
between IP address
and name, and vice
Domain Name
System:
v distributed database
mented in
e
v
r
protocol: hosts, name
servers communicate to
resolve names
(address/name
translation)
§ note: core Internet
function, implemented
as application-layer
protocol

---

## Page 62

Application Layer 2-62
DNS: services, structure
why not centralize
DNS?
v single point of failure
 volume
DNS services
v hostname to IP
address translation
v host aliasing
v load
§ replicated Web
servers: many IP
addresses
correspond to one
name
ale!

---

## Page 63

Application Layer 2-63
Root DNS Servers
com DNS servers
org DNS servers
edu DNS servers
s
y
D
DNS: a distributed, hierarchical
database
client wants IP for <www.amazon.com>; 1st approx:
v client queries root server to find com DNS server
v client queries .com DNS server to get amazon.com
DNS server
v client queries amazon.com DNS server to get  IP
address for <www.amazon.com>
…
…

---

## Page 64

Application Layer 2-64
DNS: root name servers
v contacted by local name server that can not
resolve name
v root name server:
§ contacts autho
ver if name mapping
§ retu
    13 root name
“servers”
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
c. C
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
§ responsible for com, org, net, edu, aero, jobs,
museums, a
ountry domains,
TL
§ Educause for .edu TLD
authoritative DNS servers:
§ organization’s own DNS server(s), providing
authoritative hostname to IP mappings for
organization’s named hosts
§ can be maintained by organization or service
provider

---

## Page 66

Application Layer 2-66
Local DNS name server
v does not strictly belong to hierarchy
v each ISP (residential ISP, company,
university) h
v
sent
§ has local cache of recent name-to-address
translation pairs (but may be out of date!)
§ acts as proxy, forwards query into hierarchy

---

## Page 67

Application Layer 2-67
requesting host
cis.poly.edu
gaia.cs.umass.edu
root DNS server
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
resolution
example
v host at cis.poly.edu
wants IP address
for
v conta
replies with name
of server to
contact
v “I don’t know this
name, but ask this
server”

---

## Page 68

Application Layer 2-68
6
3
recursive query:
v puts burden of
name resolution
name
v heavy load at
upper levels of
hierarchy?
requesting host
cis.poly.edu
gaia.cs.umass.edu
root DNS server
1
2
7
authoritative DNS server
dns.cs.umass.edu
8
DNS name
resolution
example
TLD DNS
server

---

## Page 69

Application Layer 2-69
DNS: caching, updating
records
v once (any) name server learns mapping,
it caches mapping
§ cache entries timeout (disappear) after some
time (TTL)
•
v cached entries may be out-of-date (best
effort name-to-address translation!)
§ if name host changes IP address, may not be
known Internet-wide until all TTLs expire
v update/notify mechanisms proposed
IETF standard
§ RFC 2136

---

## Page 70

Application Layer 2-70
DNS records
DNS: distributed db storing resource records
(RR)
type=NS
§ name is domain
(e.g., foo.com)
§ value is hostname
of authoritative
name server for this
domain
RR format: (name, value, type, ttl)
§ val
e
eal) name
§ <www.ibm.com> is really
  servereast.backup2.ibm.com
§ value is canonical name
type=MX
§ value is name of
mailserver associated with
name

---

## Page 71

Application Layer 2-71
DNS protocol, messages
v query and reply messages, both with
same message format
msg header
query u
v flags:
§ query or reply
§ recursion desired
§ recursion available
§ reply is authoritative
flags
questions (variable # of questions)
 RRs
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
RRs in
response
to query
records for
authoritative servers
additional “helpful”
info that may be used
flags
questions (variable # of questions)
 RRs
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
v example: new startup “Network Utopia”
v register name networkuptopia.com at DNS
registrar (e.g., Network Solutions)
§ provide nam
 of authoritative
§
:
(ne
com, NS)
  (dns1.networkutopia.com, 212.212.212.1, A)
v create authoritative server type A record for
<www.networkuptopia.com>; type MX record
for networkutopia.com

---

## Page 74

Attacking DNS
DDoS attacks
v Bombard root
servers with
dat
§ Traffic Filtering
§ Local DNS servers
cache IPs of TLD
servers, allowing
root server bypass
v Bombard TLD
servers
§ Potentially more
d
Redirect attacks
v Man-in-middle
ercept queries
r,
which caches
Exploit DNS for
DDoS
v Send queries with
spoofed source
address: target IP
v Requires
amplification
Application Layer 2-74

---

## Page 75

Application Layer 2-75
Chapter 2: outline
2.1 principles of
network
applications
2.2 We
2.3 FTP
2.4 electronic mail
§ SMTP, POP3,
IMAP
2.5 DNS
2.6 P2P applications
2.7 socket
gramming

---

## Page 76

Application Layer 2-76
Pure P2P architecture
v no always-on server
v arbitrary end systems
directly communicate
v peers are
examples:
§ file distribution
(BitTorrent)
§ Streaming
(KanKan)
§ VoIP (Skype)

---

## Page 77

Application Layer 2-77
File distribution: client-server vs
P2P
Question: how much time to distribute file
(size F) from one server to N  peers?
§ peer upload/download capacity is limited
resource
us
uN
dN
server
network (with abundant
 bandwidth)
file, size F
ui: peer i upload
capacity
i
i download
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
v server transmission:
must sequentially send
(upload) N file copies:
§ time to send one copy:
F/us
s
increases linearly in N
time to  distribute F
to N clients using
client-server approach  Dc-s > max{NF/us,,F/dmin}
v
downlo
§ dmin = min client
download rate
§ min client download time:
F/dmin
us
network
di
u
F

---

## Page 79

Application Layer 2-79
File distribution time: P2P
v server transmission:
must upload at least
one copy
§ time to send one copy:
F/us
time to  distribute F
to N clients using
P2P approach
us
network
di
u
F
 DP2P > max{F/us,,F/dmin,,NF/(us + Σui)}
v client: each clien
download file co
min
v clients:
bits
§ max upload rate (limting max download
rate) is us + Σui
… but so does this, as each peer brings service capacity
increases linearly in N …

---

## Page 80

Application Layer 2-80
Client-server vs. P2P: example
client upload rate = u,  F/u = 1 hour,  us = 10u,  dmin ≥ us

---

## Page 81

Application Layer 2-81
P2P file distribution:
BitTorrent
tracker: tracks peers
participating in torren
torrent: group of
ers exchanging
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
accumulate them over
time from oth
con
peers (“neighbors”)
P2P file distribution:
BitTorrent
v while downloading, peer uploads chunks to other
peers
v peer may change peers with whom it exchanges
chunks
v churn: peers may come and go
v once peer has entire file, it may (selfishly) leave
or (altruistically) remain in torrent

---

## Page 83

Application Layer 2-83
BitTorrent: requesting, sending file
chunks
requesting chunks:
v at any given time,
different peers have
different subsets
v
each pe
chunks that they have
v Alice requests missing
chunks from peers,
rarest first
sending chunks: tit-for-
tat
ends chunks to
§
choked by
Alice (do not receive
chunks from her)
§ re-evaluate top 4 every10
secs
v every 30 secs: randomly
select another peer,
starts sending chunks
§ “optimistically unchoke”
this peer
§ newly chosen peer may join

---

## Page 84

Application Layer 2-84
BitTorrent: tit-for-tat
(1) Alice “optimistically unchokes” Bob
(2) Alice becomes one of Bob’s top-four providers; Bob reciprocat
(3) Bob becomes one of Alice’s top-four providers
higher upload rate: find
better trading partners,
get file faster !

---

## Page 85

Distributed Hash Table
(DHT)
v Hash table
v DHT paradig
v
v Peer churn

---

## Page 86

Key
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
• key: human name; value: social
security #
Simple Database
• key: movie title; value: IP address

---

## Page 87

Diana
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
• More convenient to store and search
on numerical representation of key
• key = hash(
Hash Table

---

## Page 88

v Distribute (key, value) pairs over millions of
peers
§ pairs are evenly distributed over peers
v Any peer can
e with a key
exch
v Each peer only knows about a small number
of other peers
v Robust to peers coming and going (churn)
Distributed Hash Table
(DHT)

---

## Page 89

Assign key-value pairs to
peers
v rule: assign key-value pair to the peer
that has the closest ID.
v convention: closest is the immediate
successor of
v supp
1,12,13,25,32,40,48,60
§ If key = 51, then assigned to peer 60
§ If key = 60, then assigned to peer 60
§ If key = 61, then assigned to peer 1

---

## Page 90

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
“overlay network”

---

## Page 91

1
12
13
25
32
40
48
What is the value
associated with key
v
O(N) messages
on avgerage to resolve
query, when there
are N peers
Resolving a query

---

## Page 92

Circular DHT with shortcuts
•
each peer keeps track of IP addresses of
predecessor, successor, short cuts.
•
reduced from 6 to 3 messages.
•
possible to design shortcuts with O(log N)
neighbors, O(log N) messages in query
1
12
32
40
60
What is the
value for
key 53
value

---

## Page 93

Peer churn
example: peer 5 abruptly leaves
1
3
8
10
1
15
handling peer churn:
vpeers may come and go
(churn)
veach peer knows address
of its two successors
eer periodically
vif immediate successor
leaves, choose next
successor as new
immediate successor

---

## Page 94

Peer churn
example: peer 5 abruptly leaves
vpeer 4 detects peer 5’s departure; makes 8 its
immediate successor
v 4 asks 8 who its immediate successor is;
makes 8’s immediate successor its second
successor.
1
3
8
10
1
15
handling peer churn:
vpeers may come and go
(churn)
veach peer knows address
of its two successors
eer periodically
vif immediate successor
leaves, choose next
successor as new
immediate successor

---

## Page 95

Application Layer 2-95
Chapter 2: outline
2.1 principles of
network
applications
2.2 We
2.3 FTP
2.4 electronic mail
§ SMTP, POP3,
IMAP
2.5 DNS
2.6 P2P applications
2.7 socket
gramming

---

## Page 96

Application Layer 2-96
Socket programming
goal: learn how to build client/server
applications that communicate using
sockets
socket: door be
tion process
Internet
controlled
by OS
ntrolled by
app developer
transport
physical
link
network
process
transport
physical
link
network
process

---

## Page 97

Application Layer 2-97
Socket programming
Two socket types for two transport
services:
§ UDP: unreliable datagram
§
A

1. Client
ta)
from its keyboard and sends the data to
the server.
2. The server receives the data and
converts characters to uppercase.
3. The server sends the modified data to
the client.
4. The client receives the modified data
and displays the line on its screen

---

## Page 98

Application Layer 2-98
Socket programming with
UDP
UDP: no “connection” between client &
server
v no handshaking before sending data
v sender explicitly
tination
v
from r
UDP: transmitted data may be lost or
received out-of-order
Application viewpoint:
v UDP provides unreliable transfer  of groups
of bytes (“datagrams”)  between client and
server

---

## Page 99

Client/server socket interaction:
UDP
close
clientSocket
read datagram from
clientSocket
create socket:
clientSocket =
ket(AF_INET,SOCK_DGRAM)
P and
gram via
clientSocket
create socket, port= x:
serverSocket =
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
serv
RAM)
message = raw_input(’Input lowercase sentence:’)
clientSocket.sendto(message,(serverName, serverPort))
modifiedMessage, serverAddress =
                                   clientSocket.recvfrom(2048)
print modifiedMessage
clientSocket.close()
Python UDPClient
include Python’s socket
library
creat
serve
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
serv
INET, SOCK_DGRAM)
while 1:
    message, clientAddress = serverSocket.recvfrom(2048)
    modifiedMessage = message.upper()
    serverSocket.sendto(modifiedMessage, clientAddress)
Python UDPServer
create UDP socket
bind s
numb
loop forever
Read from UDP socket into
message, getting client’s
address (client IP and port)
send upper case string
back to this client

---

## Page 102

Application Layer 2-102
Socket programming with
TCP
client must contact
server
v server process must
first be running
contac
client contacts server
by:
v Creating TCP socket,
specifying IP address,
port number of server
process
v when client creates
socket: client TCP
establishes connection
t
TCP
v when contacted by
client, server TCP
creates new socket for
server process to
unicate with that
clients
§ source port numbers
used to distinguish
clients (more in Chap
3)
TCP provides reliable, in-ord
byte-stream transfer (“pipe”
between client and server
application viewpoint:

---

## Page 103

Application Layer 2-103
Client/server socket interaction:
TCP
conn
serverSocket.accept()
create socket,
port=x, for incoming
request:
serverSocket = socket()
server (running on hostid)
client
send request using
clientSocket
read request from
connectionSocket
write reply to
connectionSocket
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
serv
rPort))
sentence = raw_input(‘Input lowercase sentence:’)
clientSocket.send(sentence)
modifiedSentence = clientSocket.recv(1024)
print ‘From Server:’, modifiedSentence
clientSocket.close()
Python TCPClient
create TCP socket for
server, r
No need to attach server
name, port

---

## Page 105

Application Layer 2-105
Example app: TCP server
 from socket import *
serverPort = 12000
serv
INET,SOCK_STREAM)
while 1:
     connectionSocket, addr = serverSocket.accept()

     sentence = connectionSocket.recv(1024)
     capitalizedSentence = sentence.upper()
     connectionSocket.send(capitalizedSentence)
     connectionSocket.close()
Python TCPServer
create TCP welcoming
socket
server
incom
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
Chapter 2:
summary
v application architectures
§ client-server
§ P2P
§ reliability, bandwidth,
delay
v Internet transport
service model
§ connection-oriented,
reliable: TCP
§ unreliable,
datagrams: UDP
our study of network apps now
complete!
v specific protocols:
HTTP
§ P2P: BitTorrent,
DHT
v socket programming:
TCP, UDP sockets

---

## Page 107

Application Layer 2-107
v typical request/reply
message excha
§ ser
with data, status
code
v message formats:
§ headers: fields
giving info about
data
§ data: info being
communicated
important themes:
ol vs. data msgs
v centralized vs.
decentralized
v stateless vs. stateful
v reliable vs. unreliable
msg transfer
v “complexity at
network edge”
Chapter 2:
summary
most importantly: learned about
protocols!

---

## Page 108

Introduction 1-108
Chapter 1
Additional

---

## Page 109

Physical
application
(www browser,
email client)
application
OS
(pcap)
packet
analyzer
sent/receive
d
