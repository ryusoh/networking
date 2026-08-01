# final-sample

---

## Page 1

1
1.
The following two IP addresses and associated network prefixes, refer to two
hosts attached to different campus networks that have each been subnetted to allow for 5
distinct subnets to be configured on each campus. (10pts.)
• 128.36.199.3/19
• 200.3.7.54/28
For each one of these two IP addresses, identify:
i
The network ID
ii
The subnet mask
iii The campus network ID
iv
The host ID
v
The local broadcast address

Use the table below for your responses:

128.36.199.3/19
200.3.7.54/28
Local Network ID

Subnet Mask

Campus Network ID

Host ID

Broadcast Address

128.36
199.3

---

## Page 2

2
2.
Given the following network configuration:  (22pts.)

Four PCs are connected to 4 LANs (one PC per LAN). One bridge and 2 routers are used
to interconnect the 4 LANs. The campus network address is: 165.143.0.0/16
a. Assign an IP address to each network interface. Assume that the upper interface is
numbered “eth0/0” and the lower interface is numbered “eth0/1” for the 2 routers
and the bridge.(5pts.)

PC1:
PC2:
PC3:
PC4:
R1_0:
R1_1:
R2_0:
R2_1:
B_0:
B_1:

Assume that the network uses static routing.

Workstation
Workstation
Workstation
Workstation
Router
R1
PC1
PC2
PC3
PC4
Router
R2
Bridge B

---

## Page 3

3
b. Give the routing table for each host.  Ignore the loopback and the multicast entries
but include any appropriate flags and explain the meaning of each. (4pts)

c. On a Linux PC, what command is used to add a route to a network destination
address via a gateway? Illustrate with an example. (1pt.)

d. Show the source and destination physical/MAC addresses for a frame carrying an IP
address as it is traversing the 3 Ethernets from host PC4 to host PC2. For your
answer use the following notation: MAC_R1_1 for physical/MAC interface eth0/1
on R1, IP_R1_1 for IP address of interface eth0/1 on R1, etc. (1.5pts.)

e. Show the entries in the bridge B forwarding table after several pings have been
exchanged between all 4 PCs. (4.5pts)

f. If router R2 is replaced with a bridge, B2, what changes would have to be made to
the routing tables of the PCs so that they can continue communicating with each
other. Give the forwarding table of bridge B2 after several pings have been
exchanged between all 4 PCs. Will you see a change in the entries of the forwarding
table of bridge B (after any invalid entries existent in table have expired)? Explain
your answer. (6pts.)

3.

Suppose we have the RIP forwarding tables shown below for routing nodes A and
F, in a network where all links have cost 1. Give a diagram of the smallest network
consistent with these tables. (6pts)

Node A

Node F

node
cost
next hop
node
cost
next hop
B
1
B
A
3
E
C
2
B
B
2
C
D
1
D
C
1
C
E
2
B
D
2
E
F
3
D
E
1
E

---

## Page 4

4
4.
A client and a server establish a TELNET session and the client types in a
character “r”. Fill in the blanks representing the fields in the packets transmitted between
the client and the server from time to establish the session to sending the character “r”.
Use “*” to indicate empty entries. The* in the table below represents an empty field.
(4pts)

Direction
Sequence
Number
ACK
number
Flags
Set
Length Payload
Client->server
4592367891
*
SYN
0
*
Server->client
8814357119

Client->server

ACK

Client->server

*
*

1
r
Server->client

Client->server

ACK
0
*

5.

Given the following routing table on a particular host: (4pts.)
% netstat -rn
Destination      Gateway      Genmask              Flags   Iface
10.0.96.100      10.0.160.1   255.255.255.255  UGH   eth0
10.0.32.0          10.0.160.2   255.255.224.0      UG      eth0
10.0.96.0          10.0.160.3   255.255.224.0      UG      eth0
10.0.192.0        10.0.160.4   255.255.224.0      UG      eth0
10.0.160.0         *255.255.224.0      U         eth0
127.0.0.0*                 255.0.0.0              U         lo
0.0.0.0(default) 10.0.160.5   0.0.0.0                  UG      eth0

If you type the following commands:

a) % ping 10.0.96.100
Where would this ping packet be forwarded to? Explain why.

b) % ping 10.0.197.101
Where would this ping packet be forwarded to?  Explain why.

 6.

If a 3000 byte IP datagram, carrying a TCP segment,  is sent over a data link that
has an MTU of 500 bytes: (4pts.)

a) How many fragments will be generated?

b) How many bytes of overhead will each fragment have (assume no options in the
headers)?

c) If  the original IP datagram is stamped with ID 0x433, what will be the ID of each
subsequent fragment?

d) How many ACKs will TCP send? Why?

---

## Page 5

5
