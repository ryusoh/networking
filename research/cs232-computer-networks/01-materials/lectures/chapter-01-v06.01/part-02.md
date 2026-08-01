# chapter-01-v06.01 - Part 02 (Pages 39-75)

---

## Page 39

Internet structure: network of
networks
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
access
net
…
…
…
…
…
…
… and content provider networks  (e.g., Google,
Microsoft,   Akamai ) may run their own network,
to bring services, content close to end users
ISP B
ISP B
IXP
regional net

---

## Page 40

Introduction
Internet structure: network of
networks
v at center: small # of well-connected large
networks
§ “tier-1” commercial ISPs (e.g., Level 3, Sprint, AT&T,
NTT), national & international coverage
§ content provider network (e.g, Google): private network
that connects it data centers to Internet often bypassing
1-40
access
ISP
access
ISP
access
ISP
access
ISP
access
ISP
access
ISP
access
ISP
access
ISP
IX
IX
Tier 1 ISP
Tier 1 ISP
Google
IX

---

## Page 41

Introduction
Tier-1 ISP: e.g., Sprint
to/from customers
 to/from backbone
…
…
…
POP: point-of-presence
1-41

---

## Page 42

Introduction
Chapter 1: roadmap
1.1 what is the Internet?
1.2 network edge
§ end syste
orks, links
§
network
structure
1.4 delay, loss, throughput in networks
1.5 protocol layers, service models
1.6 networks under attack: security
1.7 history
1-42

---

## Page 43

Introduction
How do loss and delay
occur?
packets queue in router buffers
v packet arrival rate to link (temporarily) exceeds
output link capacity
v packets queue,
A
B
packets queueing (delay)
free (available) buffers: arriving packets
dropped (loss) if no free buffers
1-43

---

## Page 44

Introduction
Four sources of packet
delay
dproc: nodal
processing
§ check bit errors
§ determine output
link
§ typically < msec
A
B
propagation
transmission
 dqueue: queueing
delay
§ time waiting at
output link for
transmission
§ depends on
congestion level of
nodal
proc
queue
trans
dprop
1-44

---

## Page 45

Introduction
dtrans: transmission
delay:
§
L: packet length (bits)
§
R: link bandwidth (bps)
§
dtrans = L/R
dprop: propagation delay:
§
d: length of physical link
§
s: propagation speed in
medium (~2x108 m/sec)
§
dprop = d/s
dtrans and dprop
very different
Four sources of packet
delay
propagation
nodal
proc
queue
trans
dprop
1-45
A
B
transmission

* Check out the Java applet for an interactive animation on trans vs. prop delay

---

## Page 46

Introduction
Caravan analogy
v toll b
to service car (bit
transmission time)
v car~bit; caravan ~
packet
v Q: How long until
caravan is lined up
before 2nd toll booth?
ll booth
onto highway =
12*10 = 120 sec
§ time for last car to
propagate from 1st
to 2nd toll both:
100km/(100km/hr)
= 1 hr
§ A: 62 minutes
toll
booth
toll
booth
ten-car
caravan
100 km
100 km
1-46

---

## Page 47

Introduction
Caravan analogy (more)
v
servic
v Q: Will cars arrive to 2nd booth before all cars
serviced at first booth?
§ A: Yes!  after 7 min, 1st car arrives at second
booth; three cars still at 1st booth.
toll
booth
toll
booth
ten-car
caravan
100 km
100 km
1-47

---

## Page 48

Introduction
v R: link bandwidth
(bps)
v L: packet lengt
arrival
= La/R
v La/R ~ 0: avg. queueing delay small
v La/R -> 1: avg. queueing delay large
v La/R > 1: more “work” arriving
    than can be serviced, average delay
infinite!
  queueing
delay
La/R ~ 0
Queueing delay (revisited)
La/R -> 1
1-48

* Check out the Java applet for an interactive animation on queuing and loss

---

## Page 49

Introduction
“Real” Internet delays and
routes
v what do “real” Internet delay & loss
look like?
v traceroute program: provides delay
measuremen
to router
§ sen
ter i
on path towards destination
§ router i will return packets to sender
§ sender times interval between transmission
and reply.
3 probes
3 probes
3 probes
1-49

---

## Page 50

Introduction
“Real” Internet delays,
routes
1  cs-gw (128.119.240.254)  1 ms  1 ms  2 ms
2  border1-rt-fa5-1-0.gw.uma
s  1 ms  2 ms
3  cht-vbns.gw.umass.edu (1
 ms
6  abilene-v
7  nycm-wa
8  62.40.103.253 (62.40.103.253)  104 ms 109 ms 106 ms
9  de2-1.de1.de.geant.net (62.40.96.129)  109 ms 102 ms 104 ms
10  de.fr1.fr.geant.net (62.40.96.50)  113 ms 121 ms 114 ms
11  renater-gw.fr1.fr.geant.net (62.40.103.54)  112 ms  114 ms  112 ms
12  nio-n2.cssi.renater.fr (193.51.206.13)  111 ms  114 ms  116 ms
13  nice.cssi.renater.fr (195.220.98.102)  123 ms  125 ms  124 ms
14  r3t2-nice.cssi.renater.fr (195.220.98.110)  126 ms  126 ms  124 ms
15  eurecom-valbonne.r3t2.ft.net (193.48.50.54)  135 ms  128 ms  133 ms
16  194.214.211.25 (194.214.211.25)  126 ms  128 ms  126 ms
17  ** *
18* **
19  fantasia.eurecom.fr (193.55.113.142)  132 ms  128 ms  136 ms
traceroute: gaia.cs.umass.edu to <www.eurecom.fr>
3 delay measurements from
gaia.cs.umass.edu to cs-gw.cs.umass.edu

* means no response (probe lost, router not replying)
rans-oceanic
link
1-50
* Do some traceroutes from exotic countries at <www.traceroute.org>

---

## Page 51

Introduction
Packet loss
v queue (aka buffer) preceding link in buffer
has finite capacity
v packet arriving to full queue dropped (aka
lost)
v
not at all
A
B
packet being transmitted
packet arriving to
full buffer is lost
buffer
(waiting area)
1-51

* Check out the Java applet for an interactive animation on queuing and loss

---

## Page 52

Introduction
Throughput
v throughput: rate (bits/time unit) at
which bits transferred between
sender/receiver
§ instantaneou
point in time
server, with
file of F bits
to send to client
link capacity
 Rs bits/sec
link capacity
 Rc bits/sec
server sends
bits
(fluid) into pipe
 pipe that can carry
fluid at rate
 Rs bits/sec)
 pipe that can carry
fluid at rate
 Rc bits/sec)
1-52

---

## Page 53

Introduction
Throughput (more)
v Rs < Rc  What is average end-end
throughput?
  R bits
R bits/sec
v Rs >
throughput?
link on end-end path that constrains  end-end
throughput
bottleneck
link
Rs bits/sec
  Rc bits/sec
1-53

---

## Page 54

Introduction
Throughput: Internet
scenario
10 connections (fairly) share
backbone bottleneck link R bits/sec
Rs
Rs
Rc
Rc
Rc
v per-connection
end-end
throughput:
Rs is
bottleneck
1-54

---

## Page 55

Introduction
Chapter 1: roadmap
1.1 what is the Internet?
1.2 network edge
§ end syste
orks, links
§
network
structure
1.4 delay, loss, throughput in networks
1.5 protocol layers, service models
1.6 networks under attack: security
1.7 history
1-55

---

## Page 56

Introduction
Protocol “layers”
Networks are
complex,
with many
“pieces”:
§ links of
various media
§ applications
§ protocols
§ hardware,
software
uestion:
 of
network?
…. or at least our
discussion of
networks?
1-56

---

## Page 57

Introduction
Organization of air travel
v a series of steps
ticket (purchase)
baggage (check)
run
airplane routing
ticket (complain)
baggage (claim)
airplane routing
airplane routing
1-57

---

## Page 58

Introduction
ticket (purchase)
baggage (check)
gates (load)
r
departure
airport
arrival
airport
intermediate air-traffic
control centers
ticket (complain)
baggage (claim
ates (unload)
ticket
baggage
gate
ing
ting
Layering of airline
functionality
layers: each layer implements a service
§ via its own internal-layer actions
§ relying on services provided by layer
below
1-58

---

## Page 59

Introduction
Why layering?
dealing with complex systems:
v explicit structure allows identification,
relationship o
tem’s pieces
upda
§ change of implementation of layer’s service
transparent to rest of system
§ e.g., change in gate procedure doesn’t
affect rest of system
v layering considered harmful?
1-59

---

## Page 60

Introduction
Internet protocol stack
v application: supporting
network applications
§ FTP, SMTP, HTTP
v transport: pr

v netw
datagrams from source to
destination
§ IP, routing protocols
v link: data transfer between
neighboring  network
elements
§ Ethernet, 802.111 (WiFi), PPP
v physical: bits “on the wire”
application
work
link
physical
1-60

---

## Page 61

Introduction
ISO/OSI reference
model
v presentation: allow
applications to interpret
meaning of data, e.g.,
encryption, c
v session: synchronization,
checkpointing, recovery
of data exchange
v Internet stack “missing”
these layers!
§ these services, if needed,
must be implemented in
application
§ needed?
application
presentation
sport
network
link
physical
1-61

---

## Page 62

Introduction
source
application
transport
network
link
physical
Ht
Hn
M
segment
Ht
datagram
destination
application
transport
network
link
physical
Ht
Hn
Hl
M
Ht
Hn
M
Ht
M
M
network
link
physical
link
physical
Ht
Hn
Hl
M
Ht
Hn
M
Ht
Hn
M
Ht
Hn
Hl
M
router
ch
Encapsulatio
n
message
M
Ht
M
Hn
frame
1-62

---

## Page 63

Introduction
Chapter 1: roadmap
1.1 what is the Internet?
1.2 network edge
§ end syste
orks, links
structure
1.4 delay, loss, throughput in networks
1.5 protocol layers, service models
1.6 networks under attack: security
1.7 history
1-63

---

## Page 64

Introduction
Network security
v field of network security:
§ how bad guys can attack computer
networks
§ how we can
 against
im
v Internet not originally designed with
(much) security in mind
§ original vision: “a group of mutually trusting
users attached to a transparent network” 
§ Internet protocol designers playing “catch-
up”
§ security considerations in all layers!
1-64

---

## Page 65

Introduction
Bad guys: put malware into hosts via
Internet
v malware can get in host from:
§ virus: self-replicating infection by
receiving/executing  object (e.g., e-mail
attachment)
rec
ed
v spyware malware can record
keystrokes, web sites visited, upload
info to collection site
v infected host can be enrolled in  botnet,
used for spam. DDoS attacks
1-65

---

## Page 66

Introduction
target
Denial of Service (DoS): attackers make
resources (server, bandwidth) unavailable
to legitimate traffic by overwhelming
resource with
1
2
aroun
(see botnet)
3. send packets to target
from compromised
hosts
Bad guys: attack server, network
infrastructure
1-66

---

## Page 67

Introduction
Bad guys can sniff packets
packet “sniffing”:
§ broadcast media (shared ethernet, wireless)
§ promiscuous network interface reads/records
all packets (e
sswords!)
A
B
src:B dest:A     payload
v wireshark software used for end-of-chapter
labs is a (free) packet-sniffer
1-67

---

## Page 68

Introduction
Bad guys can use fake
addresses
IP spoofing: send packet with false source
address
A
B
1-68
… lots more on security (throughout, Chapter

---

## Page 69

Introduction
Chapter 1: roadmap
1.1 what is the Internet?
1.2 network edge
§ end syste
orks, links
§
network
structure
1.4 delay, loss, throughput in networks
1.5 protocol layers, service models
1.6 networks under attack: security
1.7 history
1-69

---

## Page 70

Introduction
Internet history
v 1961: Kleinrock -
queueing theory
shows effectiv
pack
military nets
v 1967: ARPAnet
conceived by
Advanced Research
Projects Agency
v 1969: first ARPAnet
node operational
v 1972:
§ ARPAnet public demo
(Network Control
st
gram
§ ARPAnet has 15 nodes
1961-1972: Early packet-switching principles
1-70

---

## Page 71

Introduction
v 1970: ALOHAnet satellite
network in Hawaii
v 1974: Cerf and K
v 1976:
PARC
v late70’s: proprietary
architectures: DECnet,
SNA, XNA
v late 70’s: switching fixed
length packets (ATM
precursor)
v 1979: ARPAnet has 200
nodes
Cerf and Kahn’s
ernetworking
y
l changes
required to
interconnect networks
§ best effort service
model
§ stateless routers
§ decentralized control
define today’s Internet
architecture
1972-1980: Internetworking, new and proprietary nets
Internet history
1-71

---

## Page 72

Introduction
v 1983: deployment of
TCP/IP
v 1982: smtp e-
for na
address translation
v 1985: ftp protocol
defined
v 1988: TCP
congestion control
v new national
networks: Csnet,
t, NSFnet,
confederation of
networks
1980-1990: new protocols, a proliferation of networks
Internet history
1-72

---

## Page 73

Introduction
vearly 1990’s: ARPAnet
decommissioned
v1991: NSF lifts
(decom
vearly 1990s: Web
§ hypertext [Bush 1945,
Nelson 1960’s]
§ HTML, HTTP: Berners-
Lee
§ 1994: Mosaic, later
Netscape
§ late 1990’s:
commercialization of the
late 1990’s – 2000’s:
v more killer apps:
ant messaging,
v est. 50 million host,
100 million+ users
v backbone links
running at Gbps
1990, 2000’s: commercialization, the Web,
new apps
Internet history
1-73

---

## Page 74

Introduction
2005-present
v ~750 million hosts
§ Smartphones and tablets
v Aggressive depl
band access
v Emerg
§ Facebook: soon one billion users
v Service providers (Google, Microsoft) create
their own networks
§ Bypass  Internet, providing
“instantaneous” access to search, emai,
etc.
v E-commerce, universities, enterprises
running their services in “cloud” (eg,
Amazon EC2)
Internet history
1-74

---

## Page 75

Introduction
Introduction: summary
covered a “ton” of
material!
v Internet overview
v
§ pac
versus circuit-
switching
§ Internet structure
v performance: loss,
delay, throughput
v layering, service models
v security
v history
you now have:
v context, overview,
“feel” of networking
ore depth, detail
1-75
