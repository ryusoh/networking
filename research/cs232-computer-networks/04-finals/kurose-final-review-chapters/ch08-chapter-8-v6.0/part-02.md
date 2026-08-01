# ch08-chapter-8-v6.0 - Part 02 (Pages 67-131)

---

## Page 67

8-67
Network Security
Toy: data records
v why not encrypt data in constant stream as we write it to
TCP?
§ where would we put the MAC? If at end, no message integrity
until all data processed.
§ e.g., with instant messaging, how can we do integrity check over
all bytes sent before displaying?
v instead, break stream in series of records
§ each record carries a MAC
§ receiver can act on each record as it arrives
v issue: in record, receiver needs to distinguish MAC from
data
§ want to use variable-length records
length
data
MAC

---

## Page 68

8-68
Network Security
Toy: sequence numbers
v problem: attacker can capture and replay record
or re-order records
v solution: put sequence number into MAC:
§ MAC = MAC(Mx, sequence||data)
§ note: no sequence number field
v problem: attacker could replay all records
v solution: use nonce

---

## Page 69

8-69
Network Security
Toy: control information
v problem: truncation attack:
§ attacker forges TCP connection close segment
§ one or both sides thinks there is less data than there
actually is.
v solution: record types, with one type for closure
§ type 0 for data; type 1 for closure
v MAC = MAC(Mx, sequence||type||data)
length
type
data
MAC

---

## Page 70

8-70
Network Security
Toy SSL: summary
hello
certificate, nonce
KB+(MS) = EMS
type 0, seq 1, data
type 0, seq 2, data
type 0, seq 1, data
type 0, seq 3, data
type 1, seq 4, close
type 1, seq 2, close
encrypted
bob.com

---

## Page 71

8-71
Network Security
Toy SSL isnt complete
v how long are fields?
v which encryption protocols?
v want negotiation?
§ allow client and server to support different
encryption algorithms
§ allow client and server to choose together specific
algorithm before data transfer

---

## Page 72

8-72
Network Security
SSL cipher suite
v cipher suite
§ public-key algorithm
§ symmetric encryption algorithm
§ MAC  algorithm
v SSL supports several cipher
suites
v negotiation: client, server
agree on cipher suite
§ client offers choice
§ server picks one
common SSL symmetric
ciphers
§ DES – Data Encryption
Standard: block
§ 3DES – Triple strength: block
§ RC2 – Rivest Cipher 2: block
§ RC4 – Rivest Cipher 4:
stream
SSL Public key encryption
§ RSA

---

## Page 73

8-73
Network Security
Real SSL: handshake (1)
Purpose
1.
server authentication
2.
negotiation: agree on crypto algorithms
3.
establish keys
4.
client authentication (optional)

---

## Page 74

8-74
Network Security
Real SSL: handshake (2)
1.
client sends list of algorithms it supports, along with
client nonce
2.
server chooses algorithms from list; sends back:
choice + certificate + server nonce
3.
client verifies certificate, extracts servers public
key, generates pre_master_secret, encrypts with
servers public key, sends to server
4.
client and server independently compute encryption
and MAC keys from pre_master_secret and nonces
5.
client sends a MAC of all the handshake messages
6.
server sends a MAC of all the handshake messages

---

## Page 75

8-75
Network Security
Real SSL: handshaking (3)
last 2 steps protect handshake from tampering
v client typically offers range of algorithms, some
strong, some weak
v man-in-the middle could delete stronger algorithms
from list
v last 2 steps prevent this
§ last two messages are encrypted

---

## Page 76

8-76
Network Security
Real SSL: handshaking (4)
v why two random nonces?
v suppose Trudy sniffs all messages between Alice
& Bob
v next day, Trudy sets up TCP connection with
Bob, sends exact same sequence of records
§ Bob (Amazon) thinks Alice made two separate orders
for the same thing
§ solution: Bob sends different random nonce for each
connection. This causes encryption keys to be different
on the two days
§ Trudys messages will fail Bobs integrity check

---

## Page 77

8-77
Network Security
SSL record protocol
data
data
fragment
data
fragment
MAC
MAC
encrypted
data and MAC
encrypted
data and MAC
record
header
record
header
record header:  content type; version; length
MAC:  includes sequence number, MAC key Mx
fragment:  each SSL fragment 214 bytes (~16 Kbytes)

---

## Page 78

8-78
Network Security
SSL record format
content
type
SSL version
length
MAC
data
1 byte
2 bytes
3 bytes
data and MAC encrypted (symmetric algorithm)

---

## Page 79

8-79
Network Security
handshake: ClientHello
handshake: ServerHello
handshake: Certificate
handshake: ServerHelloDone
handshake: ClientKeyExchange
ChangeCipherSpec
handshake: Finished
ChangeCipherSpec
handshake: Finished
application_data
application_data
Alert: warning, close_notify
Real SSL
connection
TCP FIN follows
everything
henceforth
is encrypted

---

## Page 80

8-80
Network Security
Key derivation
v client nonce, server nonce, and pre-master secret input
into pseudo random-number generator.
§ produces master secret
v master secret and new nonces input into another
random-number generator: key block
§ because of resumption: TBD
v key block sliced and diced:
§ client MAC key
§ server MAC key
§ client encryption key
§ server encryption key
§ client initialization vector (IV)
§ server initialization vector (IV)

---

## Page 81

8-81
Network Security
Chapter 8 roadmap
8.1 What is network security?
8.2 Principles of cryptography
8.3 Message integrity
8.4 Securing e-mail
8.5 Securing TCP connections: SSL
8.6 Network layer security: IPsec
8.7 Securing wireless LANs
8.8 Operational security: firewalls and IDS

---

## Page 82

8-82
Network Security
What is network-layer confidentiality ?
between two network entities:
v sending entity encrypts datagram payload, payload
could be:
§ TCP or UDP segment, ICMP message, OSPF message ….
v all data sent from one entity to other would be
hidden:
§ web pages, e-mail, P2P file transfers, TCP SYN packets
…
v blanket coverage

---

## Page 83

8-83
Network Security
Virtual Private Networks (VPNs)
motivation:
vinstitutions often want private networks for security.
§ costly: separate routers, links, DNS infrastructure.
vVPN: institution’s inter-office traffic is sent over
public Internet instead
§ encrypted before entering public Internet
§ logically separate from other traffic

---

## Page 84

8-84
Network Security
IP
header
IPsec
header
Secure
payload
IP
header
IPsec
header
Secure
payload
IP
header
IPsec
header
Secure
payload
IP
header
payload
IP
header
payload
headquarters
branch office
salesperson
in hotel
laptop
w/ IPsec
router w/
IPv4 and IPsec
router w/
IPv4 and IPsec
public
Internet
Virtual Private Networks (VPNs)

---

## Page 85

8-85
Network Security
IPsec services
v data integrity
v origin authentication
v replay attack prevention
v confidentiality
v two protocols providing different service models:
§ AH
§ ESP

---

## Page 86

8-86
Network Security
IPsec transport mode
v IPsec datagram emitted and received by end-system
v protects upper level protocols
IPsec
IPsec

---

## Page 87

8-87
Network Security
IPsec – tunneling mode
v edge routers IPsec-
aware
IPsec
IPsec
IPsec
IPsec
v hosts IPsec-aware

---

## Page 88

8-88
Network Security
Two IPsec protocols
v Authentication Header (AH) protocol
§ provides source authentication & data integrity but not
confidentiality
v Encapsulation Security Protocol (ESP)
§ provides source authentication, data integrity, and
confidentiality
§ more widely used than AH

---

## Page 89

8-89
Network Security
Four combinations are possible!
Host mode
with AH
Host mode
with ESP
Tunnel mode
with AH
Tunnel mode
with ESP
most common and
most important

---

## Page 90

8-90
Network Security
Security associations (SAs)
v before sending data, security association (SA)
established from sending to receiving entity
§ SAs are simplex: for only one direction
v ending, receiving entitles maintain state information
about SA
§ recall: TCP endpoints also maintain state info
§ IP is connectionless; IPsec is connection-oriented!
v how many SAs in VPN w/ headquarters, branch
office, and n traveling salespeople?

---

## Page 91

8-91
Network Security
Example SA from R1 to R2
R1 stores for SA:
v 32-bit SA identifier: Security Parameter Index (SPI)
v origin SA interface (200.168.1.100)
v destination SA interface (193.68.2.23)
v type of encryption used (e.g., 3DES with CBC)
v encryption key
v type of integrity check used (e.g., HMAC with MD5)
v authentication key
193.68.2.23
200.168.1.100
172.16.1/24
172.16.2/24
security association
Internet
headquarters
branch office
R1
R2

---

## Page 92

8-92
Network Security
Security Association Database (SAD)
v endpoint holds SA state in security association
database (SAD), where it can locate them during
processing.
v with n salespersons, 2 + 2n SAs in R1s SAD
v when sending IPsec datagram, R1 accesses SAD to
determine how to process datagram.
v when IPsec datagram arrives to R2, R2 examines
SPI in IPsec datagram, indexes SAD with SPI, and
processes datagram accordingly.

---

## Page 93

8-93
Network Security
IPsec datagram
focus for now on tunnel mode with ESP
new IP
header
ESP
hdr
original
IP hdr
Original IP
datagram payload
ESP
trl
ESP
auth
encrypted
enchilada authenticated
padding
pad
length
next
header
SPI
Seq

#

---

## Page 94

8-94
Network Security
What happens?
new IP
header
ESP
hdr
original
IP hdr
Original IP
datagram payload
ESP
trl
ESP
auth
encrypted
enchilada authenticated
padding
pad
length
next
header
SPI
Seq

#

193.68.2.23
200.168.1.100
172.16.1/24
172.16.2/24
security association
Internet
headquarters
branch office
R1
R2

---

## Page 95

8-95
Network Security
R1: convert original datagram to IPsec datagram
v appends to back of original datagram (which includes original
header fields!) an ESP trailer field.
v encrypts result using algorithm & key specified by SA.
v appends to front of this encrypted quantity the ESP header,
creating enchilada.
v creates authentication MAC over the whole enchilada, using
algorithm and key specified in SA;
v appends MAC to back of enchilada, forming payload;
v creates brand new IP header, with all the classic IPv4 header
fields, which it appends before payload.

---

## Page 96

8-96
Network Security
Inside the enchilada:
v ESP trailer: Padding for block ciphers
v ESP header:
§ SPI, so receiving entity knows what to do
§ Sequence number, to thwart replay attacks
v MAC in ESP auth field is created with shared secret key
new IP
header
ESP
hdr
original
IP hdr
Original IP
datagram payload
ESP
trl
ESP
auth
encrypted
enchilada authenticated
padding
pad
length
next
header
SPI
Seq

#

---

## Page 97

8-97
Network Security
IPsec sequence numbers
v for new SA, sender initializes seq. # to 0
v each time datagram is sent on SA:
§ sender increments seq # counter
§ places value in seq # field
v goal:
§ prevent attacker from sniffing and replaying a packet
§ receipt of duplicate, authenticated IP packets may
disrupt service
v method:
§ destination checks for duplicates
§ doesn’t keep track of all received packets; instead uses
a window

---

## Page 98

8-98
Network Security
Security Policy Database (SPD)
v policy: For a given datagram, sending entity needs
to know if it should use IPsec
v needs also to know which SA to use
§ may use: source and destination IP address; protocol
number
v info in SPD indicates what to do with arriving
datagram
v info in SAD indicates how to do it

---

## Page 99

8-99
Network Security
Summary: IPsec services
v suppose Trudy sits somewhere between R1 and
R2. she doesnt know the keys.
§ will Trudy be able to see original contents of
datagram? How about source, dest IP address,
transport protocol, application port?
§ flip bits without detection?
§ masquerade as R1 using R1s IP address?
§ replay a datagram?

---

## Page 100

8-100
Network Security
IKE: Internet Key Exchange
v previous examples: manual establishment of IPsec SAs in
IPsec endpoints:
Example SA
SPI: 12345
Source IP: 200.168.1.100
Dest IP: 193.68.2.23
Protocol: ESP
Encryption algorithm: 3DES-cbc
HMAC algorithm: MD5
Encryption key: 0x7aeaca…
HMAC key:0xc0291f…
v manual keying is impractical for VPN with 100s of
endpoints
v instead use IPsec IKE (Internet Key Exchange)

---

## Page 101

8-101
Network Security
IKE: PSK and PKI
v authentication (prove who you are) with either
§ pre-shared secret (PSK) or
§ with PKI (pubic/private keys and certificates).
v PSK: both sides start with secret
§ run IKE to authenticate each other and to generate IPsec
SAs (one in each direction), including encryption,
authentication keys
v PKI: both sides start with public/private key pair,
certificate
§ run IKE to authenticate each other, obtain IPsec SAs (one
in each direction).
§ similar with handshake in SSL.

---

## Page 102

8-102
Network Security
IKE phases
v IKE has two phases
§ phase 1: establish bi-directional IKE SA
• note: IKE SA different from IPsec SA
• aka ISAKMP security association
§ phase 2: ISAKMP is used to securely negotiate IPsec
pair of SAs
v phase 1 has two modes: aggressive mode and
main mode
§ aggressive mode uses fewer messages
§ main mode provides identity protection and is more
flexible

---

## Page 103

8-103
Network Security
IPsec summary
v IKE message exchange for algorithms, secret keys,
SPI numbers
v either AH or ESP protocol  (or both)
§ AH provides integrity, source authentication
§ ESP protocol (with AH) additionally provides
encryption
v IPsec peers can be two end systems, two
routers/firewalls, or a router/firewall and an end
system

---

## Page 104

8-104
Network Security
Chapter 8 roadmap
8.1 What is network security?
8.2 Principles of cryptography
8.3 Message integrity
8.4 Securing e-mail
8.5 Securing TCP connections: SSL
8.6 Network layer security: IPsec
8.7 Securing wireless LANs
8.8 Operational security: firewalls and IDS

---

## Page 105

8-105
Network Security
WEP design goals
v symmetric key crypto
§ confidentiality
§ end host authorization
§ data integrity
v self-synchronizing: each packet separately encrypted
§ given encrypted packet and key, can decrypt; can
continue to decrypt packets when preceding packet was
lost (unlike Cipher Block Chaining (CBC) in block
ciphers)
v Efficient
§ implementable in hardware or software

---

## Page 106

8-106
Network Security
Review: symmetric stream ciphers
v combine each byte of keystream with byte of plaintext to get
ciphertext:
§ m(i) = ith unit of message
§ ks(i) = ith unit of keystream
§ c(i) = ith unit of ciphertext
§ c(i) = ks(i) Å m(i)   (Å = exclusive or)
§ m(i) = ks(i) Å c(i)
v WEP uses RC4
keystream
generator
key
keystream

---

## Page 107

8-107
Network Security
Stream cipher and packet independence
v recall design goal: each packet separately encrypted
v if for frame n+1, use keystream from where we left off for
frame n, then each frame is not separately encrypted
§ need to know where we left off for packet n
v WEP approach: initialize keystream with key + new IV for
each packet:
keystream
generator
Key+IVpacket
keystreampacket

---

## Page 108

8-108
Network Security
WEP encryption (1)
v sender calculates Integrity Check Value (ICV) over data
§ four-byte hash/CRC for data integrity
v each side has 104-bit shared key
v sender creates 24-bit initialization vector (IV), appends to key: gives
128-bit key
v sender also appends keyID (in 8-bit field)
v 128-bit key inputted into pseudo random number generator to get
keystream
v data in frame + ICV is encrypted with RC4:
§ B\bytes of keystream are XORed with bytes of data & ICV
§ IV & keyID are appended to encrypted data to create payload
§ payload inserted into 802.11 frame
encrypted
data
ICV
IV
MAC payload
Key
ID

---

## Page 109

8-109
Network Security
WEP encryption (2)
IV
(per frame)
KS: 104-bit
secret
symmetric
k1
IV    k2
IV   k3
IV   … kN
IV    kN+1
IV…  kN+1
IV
d1
      d2     d3   …    dN
     CRC1   … CRC4
c1
      c2      c3   …    cN
      cN+1    …  cN+4
plaintext
 frame data
plus CRC
key sequence generator
( for given KS, IV)
802.11
header IV
WEP-encrypted data
plus ICV
Figure 7.8-new1:  802.11 WEP protocol
new IV for each frame

---

## Page 110

8-110
Network Security
WEP decryption overview
v receiver extracts IV
v inputs IV, shared secret key into pseudo random
generator, gets keystream
v XORs keystream with encrypted data to decrypt data +
ICV
v verifies integrity of data with ICV
§ note: message integrity approach used here is different
from MAC (message authentication code) and
signatures (using PKI).
encrypted
data
ICV
IV
MAC payload
Key
ID

---

## Page 111

8-111
Network Security
End-point authentication w/ nonce
Nonce: number (R) used only once –in-a-lifetime
How to prove Alice live:  Bob sends Alice nonce, R.  Alice
must return R, encrypted with shared secret key
I am Alice
R
K    (R)
A-B
Alice is live, and only
Alice knows key to
encrypt nonce, so it
must be Alice!

---

## Page 112

8-112
Network Security
WEP authentication
authentication request
nonce (128 bytes)
nonce encrypted shared key
success if decrypted value equals nonce
Notes:
v not all APs do it, even if WEP is being used
v AP indicates if authentication is necessary in beacon frame
v done before association

---

## Page 113

8-113
Network Security
Breaking 802.11 WEP encryption
security hole:
v 24-bit IV, one IV per frame, -> IVs eventually reused
v IV transmitted in plaintext -> IV reuse detected
attack:
§ Trudy causes Alice to encrypt known plaintext d1 d2 d3 d4
…
§ Trudy sees: ci = di XOR ki
IV
§ Trudy knows ci di, so can compute ki
IV
§ Trudy knows encrypting key sequence k1
IV k2
IV k3
IV …
§ Next time IV is used, Trudy can decrypt!

---

## Page 114

8-114
Network Security
802.11i: improved security
v numerous (stronger) forms of encryption possible
v provides key distribution
v uses authentication server separate from access
point

---

## Page 115

8-115
Network Security
AP: access point
AS:
Authentication
server
wired
network
STA:
client station
1   Discovery of
security capabilities
STA and AS mutually authenticate, together
generate Master Key (MK). AP serves as pass through
2
3
3
STA derives
Pairwise Master
Key (PMK)
AS derives
same PMK,
sends to AP
4
STA, AP use PMK to derive
Temporal Key (TK) used for message
encryption, integrity
802.11i: four phases of operation

---

## Page 116

8-116
Network Security
EAP TLS
EAP
EAP over LAN (EAPoL)
IEEE 802.11
RADIUS
UDP/IP
EAP: extensible authentication protocol
v EAP: end-end client (mobile) to authentication server
protocol
v EAP sent over separate links
§ mobile-to-AP (EAP over LAN)
§ AP to authentication server (RADIUS over UDP)
wired
network

---

## Page 117

8-117
Network Security
Chapter 8 roadmap
8.1 What is network security?
8.2 Principles of cryptography
8.3 Message integrity
8.4 Securing e-mail
8.5 Securing TCP connections: SSL
8.6 Network layer security: IPsec
8.7 Securing wireless LANs
8.8 Operational security: firewalls and IDS

---

## Page 118

8-118
Network Security
Firewalls
isolates organizations internal net from larger Internet,
allowing some packets to pass, blocking others
firewall
administered
network
public
Internet
firewall
trusted “good guys”
untrusted “bad guys”

---

## Page 119

8-119
Network Security
Firewalls: why
prevent denial of service attacks:
v SYN flooding: attacker establishes many bogus TCP
connections, no resources left for real connections
prevent illegal modification/access of internal data
v e.g., attacker replaces CIAs homepage with something else
allow only authorized access to inside network
v set of authenticated users/hosts
three types of firewalls:
v stateless packet filters
v stateful packet filters
v application gateways

---

## Page 120

8-120
Network Security
Stateless packet filtering
v internal network connected to Internet via router firewall
v router filters packet-by-packet, decision to forward/drop
packet based on:
§ source IP address, destination IP address
§ TCP/UDP source and destination port numbers
§ ICMP message type
§ TCP SYN and ACK bits
Should arriving
packet be allowed in?
Departing packet let
out?

---

## Page 121

8-121
Stateless packet filtering: example
Network Security
v example 1: block incoming and outgoing datagrams with
IP protocol field = 17 and with either source or dest
port = 23
§ result: all incoming, outgoing UDP flows and telnet
connections are blocked
v example 2: block inbound TCP segments with ACK=0.
§ result: prevents external clients from making TCP
connections with internal clients, but allows internal
clients to connect to outside.

---

## Page 122

8-122
Network Security
Policy
Firewall Setting
No outside Web access.
Drop all outgoing packets to any IP
address, port 80
No incoming TCP connections,
except those for institutions
public Web server only.
Drop all incoming TCP SYN packets
to any IP except 130.207.244.203,
port 80
Prevent Web-radios from eating
up the available bandwidth.
Drop all incoming UDP packets -
except DNS and router broadcasts.
Prevent your network from being
used for a smurf DoS attack.
Drop all ICMP packets going to a
broadcast address (e.g.
130.207.255.255).
Prevent your network from being
tracerouted
Drop all outgoing ICMP TTL expired
traffic
Stateless packet filtering: more examples

---

## Page 123

8-123
Network Security
action
source
address
dest
address
protocol
source
port
dest
port
flag
bit
allow
222.22/16
outside of
222.22/16
TCP
> 1023
80
any
allow
outside of
222.22/16
222.22/16
TCP
80
> 1023
ACK
allow
222.22/16
outside of
222.22/16
UDP
> 1023
53
---
allow
outside of
222.22/16
222.22/16
UDP
53
> 1023
----
deny
all
all
all
all
all
all
Access Control Lists
v ACL: table of rules, applied top to bottom to incoming
packets: (action, condition) pairs

---

## Page 124

8-124
Network Security
Stateful packet filtering
v stateless packet filter: heavy handed tool
§ admits packets that make no sense, e.g., dest port =
80, ACK bit set, even though no TCP connection
established:
action
source
address
dest
address
protocol
source
port
dest
port
flag
bit
allow
outside of
222.22/16
222.22/16
TCP
80
> 1023
ACK
v stateful packet filter: track status of every TCP connection
§ track connection setup (SYN), teardown (FIN): determine
whether incoming, outgoing packets makes sense
§ timeout inactive connections at firewall: no longer admit
packets

---

## Page 125

8-125
Network Security
action
source
address
dest
address
proto
source
port
dest
port
flag
bit
check
conxion
allow
222.22/16
outside of
222.22/16
TCP
> 1023
80
any
allow
outside of
222.22/16
222.22/16
TCP
80
> 1023
ACK
x
allow
222.22/16
outside of
222.22/16
UDP
> 1023
53
---
allow
outside of
222.22/16
222.22/16
UDP
53
> 1023
----
x
deny
all
all
all
all
all
all
Stateful packet filtering
v ACL augmented to indicate need to check connection
state table before admitting packet

---

## Page 126

8-126
Network Security
Application gateways
v filters packets on application
data as well as on
IP/TCP/UDP fields.
v example: allow select internal
users to telnet outside.
host-to-gateway
telnet session
gateway-to-remote
host telnet session
application
gateway
router and filter

1. require all telnet users to telnet through gateway.
2. for authorized users, gateway sets up telnet connection to
dest host. Gateway relays data between 2 connections
3. router filter blocks all telnet connections not originating
from gateway.

---

## Page 127

8-127
Network Security
Application gateways
v filter packets on
application data as well as
on IP/TCP/UDP fields.
v example: allow select
internal users to telnet
outside

1. require all telnet users to telnet through gateway.
2. for authorized users, gateway sets up telnet connection to
dest host. Gateway relays data between 2 connections
3. router filter blocks all telnet connections not originating
from gateway.
application
gateway
host-to-gateway
telnet session
router and filter
gateway-to-remote
host telnet session

---

## Page 128

8-128
Network Security
Limitations of firewalls, gateways
v IP spoofing: router cant
know if data really
comes from claimed
source
v if multiple apps. need
special treatment, each has
own app. gateway
v client software must know
how to contact gateway.
§ e.g., must set IP
address of proxy in
Web browser
v filters often use all or
nothing policy for UDP
v tradeoff:  degree of
communication with
outside world, level of
security
v many highly protected
sites still suffer from
attacks

---

## Page 129

8-129
Network Security
Intrusion detection systems
v packet filtering:
§ operates on TCP/IP headers only
§ no correlation check among sessions
v IDS: intrusion detection system
§ deep packet inspection: look at packet contents (e.g.,
check character strings in packet against database of
known virus, attack strings)
§ examine correlation among multiple packets
• port scanning
• network mapping
• DoS attack

---

## Page 130

8-130
Network Security
Web
server FTP
server
DNS
server
Internet
demilitarized
zone
firewall
IDS
sensors
Intrusion detection systems
v multiple IDSs: different types of checking at
different locations
internal
network

---

## Page 131

8-131
Network Security
Network Security (summary)
basic techniques…...
§ cryptography (symmetric and public)
§ message integrity
§ end-point authentication
…. used in many different security scenarios
§ secure email
§ secure transport (SSL)
§ IP sec
§ 802.11
operational security: firewalls and IDS
