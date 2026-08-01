# ch09-chapter-9-v6.0

---

## Page 1

Chapter 9
Network Management
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
Network Management
9-1

---

## Page 2

Network Management
9-2
Chapter 9: Network Management
Chapter goals:
v introduction to network management
§ motivation
§ major components
v Internet network management framework
§ MIB: management information base
§ SMI: data definition language
§ SNMP: protocol for network management
§ security and administration
v presentation services: ASN.1

---

## Page 3

Network Management
9-3
Chapter 9 outline
v What is network management?
v Internet-standard management framework
§ Structure of Management Information: SMI
§ Management Information Base: MIB
§ SNMP Protocol Operations and Transport
Mappings
§ Security and Administration
v ASN.1

---

## Page 4

Network Management
9-4
What is network management?
v autonomous systems (aka network): 1000s of interacting
hardware/software components
v other complex systems requiring monitoring, control:
§ jet airplane
§ nuclear power plant
§ others?
"Network management includes the deployment, integration
and coordination of the hardware, software, and human
elements to monitor, test, poll, configure, analyze, evaluate,
and control the network and element resources to meet the
real-time, operational performance, and Quality of Service
requirements at a reasonable cost."

---

## Page 5

Network Management
9-5
Infrastructure for network management
managed device
managed device
managed device
managed device
definitions:
managed devices
contain
managed objects
whose
data is gathered into a
Management
Information
Base (MIB)
managing
entity
data
managing entity
agent data
agent data
agent data
agent data
network
management
protocol
managed device
agent data

---

## Page 6

Network Management
9-6
Network management standards
OSI CMIP
v Common
Management
Information Protocol
v designed 1980s: the
unifying net
management standard
v too slowly
standardized
SNMP: Simple Network
Management Protocol
v Internet roots (SGMP)
v started simple
v deployed, adopted rapidly
v growth: size, complexity
v currently: SNMP V3
v de facto network
management standard

---

## Page 7

Network Management
9-7
v What is network management?
v Internet-standard management framework
§ Structure of Management Information: SMI
§ Management Information Base: MIB
§ SNMP Protocol Operations and Transport
Mappings
§ Security and Administration
v ASN.1
Chapter 9 outline

---

## Page 8

Network Management
9-8
SNMP overview: 4 key parts
v Management information base (MIB):
§ distributed information store of network management data
v Structure of Management Information (SMI):
§ data definition language for MIB objects
v SNMP protocol
§ convey manager<->managed object info, commands
v security, administration capabilities
§ major addition in SNMPv3

---

## Page 9

Network Management
9-9
SMI: data definition language
Purpose: syntax, semantics of
management data well-
defined, unambiguous
v base data types:
§ straightforward, boring
v OBJECT-TYPE
§ data type, status, semantics
of managed object
v MODULE-IDENTITY
§ groups related objects into
MIB module
Basic Data Types
INTEGER
Integer32
Unsigned32
OCTET STRING
OBJECT IDENTIFIED
IPaddress
Counter32
Counter64
Guage32
Time Ticks
Opaque

---

## Page 10

Network Management
9-10
SNMP MIB
OBJECT TYPE:
OBJECT TYPE:OBJECT TYPE:
objects specified via SMI
OBJECT-TYPE construct
MIB module specified via SMI
MODULE-IDENTITY
(100 standardized MIBs, more vendor-specific)
MODULE

---

## Page 11

Network Management
9-11
SMI: object, module examples
OBJECT-TYPE: ipInDelivers
MODULE-IDENTITY: ipMIB
ipInDelivers OBJECT TYPE
SYNTAX       Counter32
MAX-ACCESS   read-only
STATUS   current
DESCRIPTION
The total number of input
datagrams successfully
delivered to IP user-
protocols (including ICMP)
::= { ip   9}
ipMIB MODULE-IDENTITY
LAST-UPDATED 941101000Z
ORGANZATION IETF SNPv2
Working Group
CONTACT-INFO
 Keith McCloghrie
……
DESCRIPTION
The MIB module for managing
IP
and ICMP implementations, but
excluding their management of
IP routes.
REVISION 019331000Z
………
::= {mib-2 48}

---

## Page 12

Network Management
9-12
MIB example: UDP module
Object ID          Name                 Type             Comments
1.3.6.1.2.1.7.1     UDPInDatagrams Counter32      total # datagrams delivered
at this node
1.3.6.1.2.1.7.2    UDPNoPorts
Counter32       # underliverable datagrams:
no application at port
1.3.6.1.2.1.7.3    UDInErrors
Counter32       # undeliverable datagrams:
all other reasons
1.3.6.1.2.1.7.4    UDPOutDatagrams Counter32       # datagrams sent
1.3.6.1.2.1.7.5    udpTable
SEQUENCE
one entry for each port
in use by app, gives port #
and IP address

---

## Page 13

Network Management
9-13
SNMP naming
question: how to name every possible standard object
(protocol, data, more..) in every possible network
standard??
answer: ISO Object Identifier tree:
§ hierarchical naming of all objects
§ each branchpoint has name, number
1.3.6.1.2.1.7.1
ISO
ISO-ident. Org.
US DoD
Internet
udpInDatagrams
UDP
MIB2
management

---

## Page 14

Network Management
9-14
OSI
Object
Identifier
Tree

---

## Page 15

Network Management
9-15
SNMP protocol
Two ways to convey MIB info, commands:
agent
data
managed device
managing
entity
agent
data
managed device
managing
entity
trap msg
request
request/response mode
trap mode
response

---

## Page 16

Network Management
9-16
SNMP protocol: message types
GetRequest
GetNextRequest
GetBulkRequest
Mgr-to-agent: get me data
(instance,next in list, block)
Message type
Function
InformRequest
Mgr-to-Mgr: heres MIB value
SetRequest
Mgr-to-agent: set MIB value
Response
Agent-to-mgr: value, response to
Request
Trap
Agent-to-mgr: inform manager
of exceptional event

---

## Page 17

Network Management
9-17
SNMP protocol: message formats
….
PDU
type
(0-3)
Request
ID
Error
Status
(0-5)
Error
Index
Name
Value
Name
Value
….
PDU
type
4
Enterprise
Agent
Addr
Trap
Type
(0-7)
Specific
code
Time
stamp
Name Value
Get/set header
Variables to get/set
Trap header
Trap info
SNMP PDU

---

## Page 18

Network Management
9-18
SNMP security and administration
v encryption: DES-encrypt SNMP message
v authentication: compute, send  MIC(m,k):
compute hash (MIC) over message (m), secret
shared key (k)
v protection against playback: use nonce
v view-based access control:
§ SNMP entity maintains database of access rights,
policies for various users
§ database itself accessible as managed object!

---

## Page 19

Network Management
9-19
v What is network management?
v Internet-standard management framework
§ Structure of Management Information: SMI
§ Management Information Base: MIB
§ SNMP Protocol Operations and Transport
Mappings
§ Security and Administration
v The presentation problem: ASN.1
Chapter 9 outline

---

## Page 20

Network Management
9-20
The presentation problem
Q: does perfect memory-to-memory copy solve
the communication problem?
A: not always!
problem: different data format, storage conventions
struct {
char code;
int x;
} test;
test.x = 256;
test.code=a
a
00000001
00000011
a
00000011
00000001
test.code
test.x
test.code
test.x
host 1 format
host 2 format

---

## Page 21

Network Management
9-21
A real-life presentation problem:
aging 60s
hippie
2012  teenager
grandma
Groovy!
?
?
?
?
?
?
?
?

---

## Page 22

Network Management
9-22
Presentation problem: potential solutions

1. Sender learns receivers format. Sender translates
into receivers format. Sender sends.
– real-world analogy?
– pros and cons?
2. Sender sends. Receiver learns senders format.
Receiver translate into receiver-local format
– real-world-analogy
– pros and cons?
3. Sender translates host-independent format. Sends.
Receiver translates to receiver-local format.
– real-world analogy?
– pros and cons?

---

## Page 23

Network Management
9-23
Solving the presentation problem

1. Translate local-host format to host-independent format
2. Transmit data in host-independent format
3. Translate host-independent format to remote-host format
2012  teenager
aging 60s
hippie
grandma
presentation
service
presentation
service
presentation
service
“Groovy!”
“It is pleasing
to me!”
“It is pleasing
to me!”
“Cat’s pajamas!”
“Awesome, dude!”
!
!
!
!
!
!
!
!

---

## Page 24

Network Management
9-24
ASN.1: Abstract Syntax Notation 1
v ISO standard X.680
§ used extensively in Internet
§ like eating vegetables, knowing this good for you!
v defined data types, object constructors
§ like SMI
v BER: Basic Encoding Rules
§ specify how ASN.1-defined data objects to be transmitted
§ each transmitted object has Type, Length, Value (TLV)
encoding

---

## Page 25

Network Management
9-25
TLV Encoding
Idea: transmitted data is self-identifying
§ T: data type, one of ASN.1-defined types
§ L: length of data in bytes
§ V: value of data, encoded according to ASN.1 standard
1
2
3
4
5
6
9
Boolean
Integer
Bitstring
Octet string
Null
Object Identifier
Real
Tag Value
Type

---

## Page 26

Network Management
9-26
TLV
encoding:
example
Length, 5 bytes
Type=4, octet string
Length, 2 bytes
Type=2, integer
lastname ::= OCTET STRING
weight ::= INTEGER
{weight, 259}
{lastname, “smith”}
module of data type
declarations written
in ASN.1
instances of data type
specified in module
Basic Encoding Rules
(BER)
3
1
2
2
h
t
i
m
s
5
4
transmitted
byte
stream
Value, 5 octets (chars)
Value, 259

---

## Page 27

Network Management
9-27
Network management: summary
v network management
§ extremely important: 80% of network cost
§ ASN.1 for data description
§ SNMP protocol as a tool for conveying
information
v network management: more art than science
§ what to measure/monitor
§ how to respond to failures?
§ alarm correlation/filtering?
