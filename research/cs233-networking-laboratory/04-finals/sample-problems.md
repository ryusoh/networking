# sample-problems

---

## Page 1

1

1. You are given the following network topology: (14pts.)

• Router is set as a default router for both HostA and HostB.
• HostA and HostB's ARP tables are cleared, the router ARP tables are not cleared (i.e.,
removing the need of two transmissions to router – no packet dropping).
• Then HostB pings HostA

a. Below find a list of packets that may or may not be transmitted, on each indicated
LAN, when the HostB pings HostA. For each frame/packet, indicate if it was or was
not transmitted on the indicated LAN (True or False).
b. For those that you determine were transmitted (i.e., TRUE), arrange in order of
transmission, i.e., indicate the sequence of packet transmission events as they play out
on the two LANs.
c. Fill in the fields of the various frames/packets transmitted, e.g., Ethernet source and
destination addresses, IP source and destination addresses, etc. for the frames/packets
that traverse the two LANs. (Use the following notation for your answer: HostA_eth0,
or Router_eth1, HostA_IP, HostB_IP, etc., for broadcast use the hexadecimal
notation). Assume the Router interface on LAN1 is eth0 and IP address is IP1 and on
LAN2 it is eth1 and IP2

         [Transmissions on LAN1]

         ARP Request: sent? True or False
         eth_src   =
         eth_dst   =
         sender_ip =
         target ip =

         ARP Reply: sent? True or False
         eth_src   =
         eth_dst   =
         sender_ip =
         target ip =

         ICMP Echo Request: sent? True or False
         eth_src  =
         eth_dest =
         ip_src   =
         ip_dest  =
HostB
Router
HostA
LAN2
LAN1

---

## Page 2

2

         ICMP Echo Reply: sent? True or False
         eth_src  =
         eth_dest =
         ip_src   =
         ip_dest  =

         [Transmissions on LAN2]

         ARP Request: sent? True or False
         eth_src   =
         eth_dst   =
         sender_ip =
         target ip =

         ARP Reply: sent? True or False
         eth_src   =
         eth_dst   =
         sender_ip =
         target ip =

         ICMP Echo Request: sent? True or False
         eth_src  =
         eth_dest =
         ip_src   =
         ip_dest  =

         ICMP Echo Reply: sent? True or False
         eth_src  =
         eth_dest =
         ip_src   =
         ip_dest  =

---

## Page 3

3
2. A datagram is sent from Host A on LAN1 to Host B on LAN2 via a bridge B as
shown in the figure below. Assume that all ARP caches, routing tables and
forwarding tables are up to date.  Draw the Ethernet and IP headers of the packet as it
flows from Host A over LAN1 via the bridge B and over LAN2 to Host2. Use
Eth_HostA, IP_HostA, Eth_Bridge, IP_Bridge, etc. for your addressing scheme.
(2pts.)

3. Now assume that instead of a bridge we have a router R instead connecting the two
LANs as shown below. Repeat problem 11 above with the same assumptions. (2pts.)

4. Four Hosts are connected to one hub. (-2pts. - +2pts.)
Host1 10.0.1.100/8
Host2 10.0.1.142/16
Host3 10.0.1.124/24
Host4 10.0.1.130/28

Cirlce all the pairs that can ping successfully to each other.

HostB
Ethernet
Hub
HostA
Ethernet
Hub
Cisco Bridge
Eth_HostA
 IP_HostA
Eth_HostB
 IP_HostB
Eth0_Bridge
 IP0_Bridge
Eth1_Bridge
 IP1_Bridge
HostB
Ethernet
Hub
HostA
Ethernet
Hub
Cisco Router
Eth_HostA
 IP_HostA
Eth_HostB
 IP_HostB
Eth0_Router
 IP0_Rouer
Eth1_Router
 IP1_Router

---

## Page 4

4

1. Host1 and Host2
2. Host1 and Host3
3. Host1 and Host4
4. Host2 and Host3
5. Host2 and Host4
6. Host3 and Host4

5. 4 PCs and 3 bridges are connected as shown below. Assume all the ARP caches are
up to date and all the forwarding tables are empty. Host1 sent 10 ping request packets
to Host2. (Host1% ping –c 10 IP_Host2). Answer the following questions:

a. After the 10 successful pings, list all the entries in the forwarding table of
each bridge. (5pts.)

b. How many ICMP echo request/reply packets did Host3 and Host4 observe?
(2pts.)
