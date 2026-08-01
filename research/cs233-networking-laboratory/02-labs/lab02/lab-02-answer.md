# lab-02-answer

---

## Page 1

_________________________________________________________________
__
Hey everyone, we can collaborate on the lab questions on here. Please write
what you think the answer is in different colors excluding black to differ from
each other’s answers. Don’t cross out answers unless you know completely for
sure that you are correct (and please comment why you think an answer is not
correct). Hope this helps everyone!
_____________________________________________________________

LAB 2
Part 3(A)
-

What is the destination MAC address of an ARP Request packet?
o
 ​00:00:00:00:00:00 (broadcast message)
o
Are we sure the above is correct? My wireshark capture shows broadcasts
as ff:ff:ff:ff:ff:ff
o
ff:ff:ff:ff:ff:ff should be the correct answer.
I think the ethernet frame uses a broadcast address of ff:ff:ff:ff:ff:ff while the encapsulated ARP
frame uses 00:00:00:00:00:00.

-

What are the different Type Field values in the Ethernet headers that you observed?
o
ARP: ARP (0x0806)
o
 ​ICMP: IP (0x0800)
-

Use the captured data to analyze the process in which ARP acquires the MAC address for IP
address 10.0.1.12.
Part 3(B)
VMs
IP Address of eth0
MAC address of eth0
PC1
10.0.1.11/24
08:00:27:6d:e5:15
PC2
10.0.1.12/24
08:00:27:73:ef:62
PC3
10.0.1.13/24
08:00:27:6f:46:37
PC4
10.0.1.14/24
08:00:27:09:97:06

Part 3(C)
-

Using the saved output, describe the time interval between each ARP Request packet issued
by PC1. Observe the method used by ARP to determine the time between retransmissions
of an unsuccessful ARP Request.
o
Each ARP Request appears to have a time interval of 1 second. The method appears
to be a simple timeout and retry for n+2 total tries, where n is the number of pings
sent out. (example: “ping 10.0.1.22 -c 8” will generate 10 ARP Requests)
-

Why are ARP Request packets not transmitted (i.e. not encapsulated) as IP packets?

---

## Page 2

Because ARP is not a part of the IP protocol
The arp message also needs to be broadcast to all host so that can be done with the ARP
protocol as opposed to the IP protocol. In addition the IP protocol is in the transport layer while the
ARP protocol deals with the data link layer.

Part 4
-

What are the network interfaces of PC1 and what are the MTU (Maximum Transmission
Unit) values of the interfaces?
o
Command: ​netstat -in
o
eth0 has MTU of 1500
o
lo has MTU of 65536
-

How many IP datagrams, ICMP messages, UDP datagrams, and TCP segments has PC1
transmitted and received since it was last rebooted.
o
Command: ​netstat -s
o
IP datagrams
▪
26 total packets received
▪
0 forwarded
o
ICMP messages
▪
18 ICMP messages received
▪
28 ICMP messages sent
o
UDP datagrams
▪
0 packets received
▪
8 packets sent
o
 TCP segments
▪
0 segments received
▪
0 segments send out
-

Explain the role of interface ​lo, the loopback interface. In the ​netstat -in
​
 output, why are the
values of ​RX-OK (packets received) and ​TX-OK (packets transmitted) different for interface
eth0 but identical for interface ​lo?

“The loopback interface (lo) is a virtual network interface implemented in
software only and is not connected to any hardware.  It is fully integrated
into the computer system's internal network infrastructure.  Any traffic that
a computer program sends to the loopback interface is immediately received on
the same interface.  Therefore, the RX-OK and TX-OK are the same for interface
lo.

For eth0, RX-OK and TX-OK are measuring completely different things.  One is
the packets that are received.  The other one is the packets that are sent.”

the loop back interface is a virtual network interface implemented in software only and is not connected
to any hardware. it is fully
integrated into the computer
system’s internal network
infrastructure. any traffic that
a computer program sends to
the loopback interface is
immediately received on the
same interface, therefore, the
rx-ok and tx-ok are the same
for interface lo
for eth0, rx-ok and tx-ok are measuring completely different things. one is the
packets that are received. the other one is the packets that are sent.

---

## Page 3

Part 5
1.
On  PC4, run ​ifconfig and screenshot the output.

2.

Change the IP address of interface ​eth0 of PC4 to ​10.0.1.11/24.
3.
Run ​ifconfig again and screenshot the output

---

## Page 4

-

Explain the fields of the ​ifconfig output.
o
Link encap: Ethernet
▪
Denotes that the interface is an Ethernet related device
o
HWaddr
▪
Indicates the hardware address/MAC address. This is unique to each Ethernet
card that is manufactured.
o
Inet addr
▪
Indicates the machine IP address
o
Bcast
▪
Denotes the broadcast address
o
Mask
▪
Indicates the network mask which is passed using the netmask option
o
UP
▪
Flag, means that the kernel modules related to the Ethernet interface has
been loaded
o
BROADCAST
▪
Flag, denotes the Ethernet device supports broadcasting. This is necessary to
obtain IP address via DHCP
o
RUNNING
▪
Flag, means the interface is ready to accept data
o
MULTICAST
denotes that the interface is an ethernet related device
indicates the hardware address / mac address
this is unique to each ethernet card that is manufactured
indicates the machine ip address
denotes the broadcast address
indicates the network mask which is
passed using the netmask option
flag, means that the kernel modules related to the ethernet
interface has been loaded
flag, denotes the ethernet device supports
broadcasting. this is necessary to obtain ip
adderss via dhcp
interface is ready to accept data

---

## Page 5

▪
Flag, indicates that the Ethernet interface supports multicasting (this allows a
source to send a packet or packets to multiple machines as long as the
machines are watching out for that packet)
o
MTU
▪
Maximum Transmission Unit, size of each packet received by the Ethernet
card
▪
1500 is the default value for all Ethernet devices
o
Metric
▪
Option can take value of 0, 1, 2, 3, ... and the lower the value, the more
leverage it has. The value of this property decides the priority of the device.
This parameter has significance only while routing packets
o
RX packets
▪
Shows total number of packets received
o
TX packets
▪
Shows total number of packets transmitted
o
Collisions
▪
Value of this field should ideally be 0; if greater than 0, this could mean
network congestion
o
Txqueuelen
▪
Denotes the length of the transmit queue of the device. Usually set to smaller
values for slower devices with high latency such as modem links and ISDN
o
RX bytes, TX bytes
▪
Indicate total amount of data that has passed through the Ethernet interface
either way
Part 6
Screenshot of the ARP cache of PC3 using ​arp -a:
the interface supports multicasting
size of each packet received by the
ethernet card
the lower the value, the more leverage it has
the value of this property decides  the priority of the devide
show total number of packets received
show total number of packets transmitted
if larger than 0 network congestion
denotes the length of the transmit queue of the device
usually set to smaller values for slower devices with
high latency such as modem links and isdn
indicate toal amount of data that has passed
through the ethernet interface either way

---

## Page 6

-

Explain how the ping packets were issued by the hosts with duplicate addresses.
-

Since both hosts have the same IP address, when there is an ARP request that is sent
broadcast, both hosts will respond with their own MAC address. Whichever reply gets to the
sending host first will be sent the ping packet. The sending host would place the first ​received
MAC address in its ARP cache. Then when the second duplicate IP address replies with its MAC
address, there is a warning that ARP issues, indicating that a duplicate IP address detected for
10.0.1.11 and even has a security level of “warn”.
-

Did the ping command result in error messages? ​(​The ping command itself didn’t result in
any error messages (ICMP related). There is a warning in the ARP request, but I think it is
asking something else, which eludes to why data security can be compromised.​)
o
Yes. When the sending host receives the second reply of the MAC address coming
from the duplicate IP address, there is an error saying that a duplicate IP address is
detected for 10.0.1.11 and even has a security level of “warn”.
-

How can duplicate IP addresses be used to compromise the data security?
o
Private data that is meant only for one IP address can be directed elsewhere and
security can be compromised. Important information can forwarded to someone
malicious and issues such as identity theft can be a big problem.
-

Give an example. Use the ARP cache and the captured packets to support your explanation.
o
If you are trying to ping something important to PC1, who originally has the IP address
of 10.0.1.11, but when PC1 gets a broadcast message asking if it has an IP address of
10.0.1.11 and sends a reply a second too late, the other PC, PC4, might reply faster
than PC1 and you, the sending host, will think you knows who the true receiving host
since both hosts have the same ip
address, when there is a arp request that
is sent broadcast, both hosts will respond
with their own mac address. whichever
reply gets to the sending host first will
be sent the ping packet. the sending host
would place the first received mac address
in its arp cache. then when the second
dulplicate ip address relies with its mac
address, there is a warning that arp issues,
indicating that a dulplicate ip address
detected for 10.0.1.11 and even has a
security level of warn
private data that is meant only for one
ip address can be directed elsewheree and
security can be compromised. important
information can be forwarded to someone
malicious and issues such as identity theft can be
a big problem

if you are trying to ping something important
to pc1 who originally has the ip address of
10.0.1.11, but when pc1 gets a broadcast
message asking if it has an ip address of
10.0.1.11 and sends a reply a second too
late, the other pc, pc4, might reply faster
than
pc1 and you, the sending host, whill think
you knows
who the true receiving host is and pc1 will
be deemed
as having a duplicate ip address. pc4, who
had a faster reply, can now receive packets
from the sending host instead of pc1

---

## Page 7

is and PC1 will be deemed as having a duplicate IP address. PC4, who had a faster
reply, can now receive packets from the sending host instead of PC1.
Part 7
-

Use your output data and ping results to explain what happened in each of the ping
commands.
o
First, there is an ARP broadcast message sent from the sending host asking who has a
certain IP address and to send a reply to IP address of the sending host. If a host finds
that it has a matching IP address, it sends a unicast ARP message back to the sending
host that it matches. Then the receiving host gets sent an ICMP package from the
sending host. After that, the receiving host adds the IP address of the sending host to
its own ARP table.
o
If no one answers the broadcast message, then after 3 queries (according to the
captured outputs), the ping returns an error.
-

Which ping operations were successful and which were unsuccessful? Why?
a.
From PC1 ping PC3: SUCCESS
a.
Attempts and succeeds. PC1 and PC3 are on the same network.
b.
From PC1 ping PC2: SUCCESS
a.
Attempts and succeeds. PC1 and PC2 are on the same network.
c.
From PC1 ping PC4: FAIL
a.
Attempts and fails. PC1 thinks PC4 is on the same network but PC4 is on its own
subnet so they are not connected.
d.
From PC4 ping PC1: FAIL
a.
No attempts, immediately errors and says “Network is unreachable” because it
already knows that PC1’s IP address is not of the same network mask so it is not
on the same subnet.
e.
From PC2 ping PC4: FAIL
a.
No attempts, immediately errors and says “Network is unreachable” because it
already knows that PC4’s IP address is not of the same network mask so it is not
on the same subnet.
f.
From PC2 ping PC3: FAIL
a.
No attempts, immediately errors and says “Network is unreachable” because it
already knows that PC3’s IP address is not of the same network mask so it is not
on the same subnet.
-

first, there is an arp broadcast message
sent from the sending host asking who has a certain ip
address and to send a reply to ip address of the
sending host. if a host finds that it has a matching
ip address, it sends a unicast arp message back
to the sending host that it matches. then the receiving
host gets sent an icmp package from the sending host
after that, the receiving host adds the ip address of the
sending host to its own arp table
if no one answer the broadcast message, then
after 3 queries, the ping returns an error

---

## Page 8

LAB 3
Part 1(C)
-

Explain the fields of the routing table entries of the Cisco router.
Part 2(A)
-

What is the output on PC1 when the ping commands are issued?
o
It succeeds in sending 5 packets to PC2 but immediately says
network is unreachable when it attempts to ping Router1 and
PC4.
-

Which packets, if any, are captured by Wireshark?
o
Only packets sent to PC2 from PC1 are captured.
-

Do you observe any ARP or ICMP packets? If so, what do they indicate?
o
There are ARP packets to ask for the IP address of PC2 and
the reply. There are ICMP packets sent unicastly between PC1
and PC2.
-

Why are some of the destinations not reachable? Which ones are they?
o
Router1 and PC4 are unreachable since PC1 is not yet
connected to a router. PC1 is not on the same network as
Router1 or PC4.
Part 2(C)
-

Explain the entries in the routing table and discuss the values of the fields for each entry.
Part 3(A)
-

Using the Wireshark output and the previously saved routing tables, explain the operation
of ​traceroute command.
o
Shows the route through which the packet travels. For example, when running
traceroute from PC4 to PC1, it shows which router it goes through until it reaches its
destination. This is good for debugging purposes if a host can’t reach another host.
You can look at which routers it goes through, or which ones don’t show up which
means it never reached that router.
Part 3(B)
-

Determine the source and destination addresses in the Ethernet and IP headers, for the
ICMP Echo Request messages that were captured at PC1.
-

Determine the source and destination addresses in the Ethernet and IP headers, for the
ICMP Echo Request messages that were captured at PC4.
-

Use your answers above to explain how the source and destination Ethernet and IP
addresses are changed when a datagram is forwarded by a router.
o
As mentioned in class many times, IP destination and source never change since IP is
end to end, however the MAC addresses changes every time a datagram is
forwarded with the source MAC address being the address from which the datagram

---

## Page 9

is being forwarded from and the source MAC address being the address of the next
hop or even the host destination of the datagram.
Part 3(C)
-

Use the saved output to indicate the number of matches for each of the IP addresses above.
Explain how PC1 resolves multiple matches in the routing table.
Part 3(D)
-

What is the output on PC1, when the ​ping command is issued?
-

Determine how far the ICMP Echo Request message travels.
-

Which, if any, ICMP Echo Reply message returns to PC1?
Part 4
-

Use the captured data to explain the outcome of the exercise.
-

Use the data to explain how Proxy ARP allowed PC4 to communicate with PC1.

What happened was PC4 falsely believed that PC1 was directly reachable
because PC4 was assigned a netmask containing all the subnets 10.0.1.0/24 and
10.0.2.0/24.  PC4, however, had to go through the router and PC2 in order to
deliver packets to PC1, while PC4 didn't have the default gateway to the router.

PC4 sent out ARP requests addressed to PC1.  The router received it, and the
router knew that PC1 was reachable, so the router sent back its MAC address as a
proxy ARP reply.  PC4 put this MAC address in its ARP table to pair up with
PC1's IP address.  From then on, PC4 just sent packets to the router thinking
that was PC1, while the router sent them to PC2 and then to PC1.

Part 5
-

Is there a difference between the contents of the routing table and the routing cache
immediately after the ICMP route redirect message?
-

When you viewed the cache a few minutes later, what did you observe?
-

Describe how the ICMP route redirect works using the outputs you saved. Include only
relevant data from your saved output to support your explanations.
-

Explain how Router1, in the above example, knows that datagrams destined to network
10.0.3.10 should be forwarded to 10.0.2.2?

---

## Page 10

Part 6
-

Are the two packets that you saved identical? If not, what is different?
o
The two packets are near identical except that one will have a lower TTL number
than the other one since TTL is decremented by one each time before it is forwarded
by a router.
-

Why does the ICMP Echo Request not loop forever in the network?
o
As the TTL which starts at 64 decreases to 0 since each hop between the routers (R2,
R3, and R4) will decrease it by 1, the packet will get dropped in since it only takes 64
or less hops to send a datagram from and to anywhere in the world so any more
hops than 64 will mean that the datagram is stuck in a loop and will get dropped.
Part 7
-

Explain what you observed in steps 3, 4 and 5. Use the saved data to support your answer.
Provide explanations of the observations. Try to explain each observed phenomenon, e.g., if
you observe more ICMP Echo Requests than Echo Replies, try to explain the reason.
-

If PC3 had no default entry in its table, would you have seen the same results? Explain for
each of the pings above what would have been different.
