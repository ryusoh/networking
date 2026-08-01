# lab-04

---

## Page 1

Lab 4 – Page 1
LAB FOUR – LAN SWITCHING

A bridge or LAN switch is a device that interconnects two or more local area networks (LANs)
and forwards packets between these networks. Different from IP router, bridges and LAN
switches operate at the data link layer. For example, bridges and LAN switches forward packets
based on MAC addresses, whereas IP routers forward packets abased on IP addresses.

LAN switches are widely deployed in enterprise networks, including university campus
networks. Many enterprise networks primarily use LAN switches to interconnect LANs, using IP
routers only to connect the enterprise network to the public Internet.

The term bridge was coined in the early 1980s. Today, when referring to data link layer
interconnection devices, the terms LAN switch or Ethernet switch (in the context of Ethernet) are
much more common. Since many of the concepts, configuration commands, and protocols for
LAN switches in Lab 6 use the old term bridge, we will, with few exceptions, refer to LAN
switches as bridges.

This lab covers the main concepts of LAN switching in Ethernet networks: how packets are
forwarded between LANs and how the routes of packets are determined. In Part 1 you learn
how to configure a Cisco router as a bridge. Parts 2, 3, and 4 explore how forwarding tables of
bridges are set up. You learn about the concepts of learning bridges and transparent bridges, as
well as the operation of the spanning tree protocol that enables loop-free routing between
interconnected LANs. Part 5 of the lab explores issues that arise when IP routers and bridges
operate in the same network.

In this lab, we will first show you how to configure a Cisco router to operate as a bridge. All
bridges henceforth in this lab will be Routers configured as bridges.

---

## Page 2

Lab 4 – Page 2
PART 1. Configuring a Cisco Router as a Bridge

The network configuration for Part 1 is shown in Figure 4.1 and Table 4.1. Router1 is set up as
a bridge.

Figure 4.1 Network topology for Part 1.

PCs
eth0
PC1
10.0.1.11 / 24
PC2
10.0.1.21 / 24
PC3
10.0.1.31 / 24
PC4
10.0.1.41 / 24
Table 4.1 IP addresses of the PCs

---

## Page 3

Lab 4 – Page 3
Exercise 1(A). How to Configure a Cisco router to act as a bridge
A Cisco router can be configured to perform the functions of multiple independently operating
bridges. This is done by defining a bridge group, which is identified by a number, and
associating two or more network interfaces with each bridge group. Packets are forwarded only
between interfaces that are assigned to the same bridge group. Since the exercises in Lab 6
use only on bridge group, we always use 1 to identify the group.

IOS MODE: GLOBAL CONFIGURATION
bridge 1 protocol ieee
Defines a bridge group and signs the spanning tree protocol as defined in the IEEE
802.1d Standard to bridge group 1. After the command is issued, the Cisco router
forwards packets between all interfaces that are assigned to bridge group 1. A bridge
group can be any number between 1 and 63. After defining a bridge group, one can
assign network interfaces to the bridge group. It is possible to define multiple bridge
groups. In Lab 6, only one bridge group (with identifier 1) is used.
bridge 1 priority 128
Assigns the priority 128 to bridge group 1. The priority of a bridge group plays a role in the
spanning tree protocol, which is covered in Part5.

IOS MODE: INTERFACE CONFIGURATION
bridge-group 1
Assigns this network interface to bridge group 1
no bridge-group 1
Removes this network interface from bridge group 1.
bridge-group 1 spanning-disabled
Disables the spanning tree protocol on this interface for bridge group 1
no bridge-group 1 spanning-disabled
Enables the spanning tree protocol on this interface for bridge group 1

Once a Cisco router is configured as a bridge, the commands in the next list can be used to
display the status of the bridge.

---

## Page 4

Lab 4 – Page 4
IOS MODE: PRIVILEGED EXEC
show bridge
Displays the entries of the MAC forwarding table
show spanning-tree brief
Displays the spanning tree topology information known to this bridge
show interfaces
Displays statistics of all interfaces, including the MAC addresses of all interfaces
The commands in the next list disable bridging functions on a Cisco router.

IOS MODE: PRIVILEGED EXEC
no bridge 1
Deletes the defined bridge group. After the command is issued, the cisco router stops
forwarding packets between interfaces that are assigned to bridge group 1.
clear bridge
Removes all entries from the MAC forwarding table
clear arp-cache
Clears the ARP table.

1. Configuring Router 1: Use the following commands to configure Router1 as a bridge:

Router1> enable
Router1# configure terminal
Router1(config)# no ip routing
Router1(config)# bridge 1 protocol ieee
Router1(config)# bridge 1 priority 128
Router1(config)# interface FastEthernet0/0
Router1(config-if)# bridge-group 1
Router1(config-if)# bridge-group 1 spanning-disabled
Router1(config-if)# no shutdown
Router1(config-if)# interface FastEthernet1/0
Router1(config-if)# bridge-group 1
Router1(config-if)# bridge-group 1 spanning-disabled
Router1(config-if)# no shutdown
Router1(config-if)# end
Router1# clear bridge
Router1# clear arp-cache

The commands disable IP forwarding and set up Router1 as a bridge that runs with priority 128.
Both Ethernet interfaces are assigned to the bridge, but the spanning tree protocol is disabled.

2. Once Router1 has been configured as a bridge, configure the PCs as shown in Figure 4.1
with the IP addresses given in Table 4.1.

---

## Page 5

Lab 4 – Page 5

3. Delete all entries in the ARP caches of all PCs.

4. Start 2 Wireshark captures, one on the link between bridge (R1) and Hub1 and the other on
link between bridge (R1) to Hub2.

5. Issue a ping command from PC1 to PC2, and from PC1 to PC3:

PC1% ping 10.0.1.21 -c 10
PC1% ping 10.0.1.31 –c 10

6. Stop Wireshark captures and save the output.

7. Run traceroute from PC1 to PC3. Screenshot the output.

PC1% traceroute 10.0.1.31

Lab Questions
•
From the saved Wireshark output, comment on the route of the ARP and the ICMP
packets for both pings.
•
From the traceroute output, what is the recorded path between PC1 to PC3?

---

## Page 6

Lab 4 – Page 6
PART 2. Learning Bridges
Each bridge has a MAC forwarding table that determines the outgoing port for a packet. When a
packet arrives, the bridge looks up the destination MAC address of the packet in its MAC
forwarding table and retrieves the outgoing port for this packet. If the destination MAC address
is not found in the MAC forwarding table, the bridge floods the packet on all ports, with the
exception of the port where the packet arrived on.

Bridges update their MAC forwarding table using what is called a learning algorithm, which
works as follows. A bridge examines the source MAC address of each packet that arrives on a
particular port and memorizes that the source address is reachable via that port. This is done by
adding the source MAC address and the port to the MAC forwarding table. The next time the
bridge receives a packet that has this MAC address as destination, the bridge finds the outgoing
port in its forwarding table. Bridges that run this algorithm are referred to as learning bridges. All
currently deployed Ethernet switches execute the learning algorithm.

An entry in the MAC forwarding table is deleted if is not used (looked up) for a certain amount of
time. The maximum time that a MAC address can stay in the forwarding table without a lookup
is determined by the ageing value, which is a configuration parameter.

Here you investigate the learning algorithm of bridges. The network configuration is as shown in
Figure 4.2.

Figure 4.2 Network topology for Part 2.
Exercise 2(A). Exploring the learning algorithm of bridges
In this exercise you study how bridges set up their MAC forwarding tables from the network
traffic.

1. Set up the network configuration as shown in Figure 4.2 and Table 4.1.

---

## Page 7

Lab 4 – Page 7
2. Configure Router1, Router2 and Router3 as bridges. On each of the bridges, delete the
contents of the MAC forwarding table with the clear bridge command.

3. Start to capture traffic with Wireshark on the eth0 interfaces of PC1, PC2, PC3 and PC4.

4. Clear the ARP cache on all the PCs.

5. Now, issue a set of ping commands. After each command, save the MAC forwarding table
on all bridges with the command show bridge, and observe how far the ICMP Echo Request
and Reply packets travel.

PC1% ping 10.0.1.21 -c 10
PC2% ping 10.0.1.11 -c 10
PC2% ping 10.0.1.41 -c 10
PC3% ping 10.0.1.21 -c 10

6. Stop the traffic capture on the PCs and save the Wireshark output.

Lab Questions
•
Use the captured data to illustrate the algorithm used by bridges to forward packets.
•
For each of the transmitted packets, explain if the learning algorithm results in changes
to the MAC forwarding table. Describe the changes.
Exercise 2(B). Learning about new locations of hosts
Learning bridges adapt their MAC forwarding tables automatically when the location of a host
changes. Due to the learning algorithm, the time it takes to adapt to a change depends on the
network traffic and on the value of the ageing parameter. This is illustrated in the following
exercise.

1. Continue with the configuration of the previous exercise.

2. Start Wireshark capture on all 4 PCs.

3. Issue a ping command from PC1 that continuously sends ICMP Echo Request packets to
PC2:

PC1% ping 10.0.1.21

4. After a few seconds, disconnect PC2 from Hub2 and connect PC2 to the same hub that PC4
is connected to (Hub4).

5. Record the amount of time that the ping from PC1 to PC2 is not successful after PC2 has
been moved to Hub4.

6. Stop the ping from PC1 to PC2.

7. Now issue a ping command from PC1 to PC3 that continuously sends ICMP Echo Request
packets to PC3:

---

## Page 8

Lab 4 – Page 8
PC1% ping 10.0.1.31

8. Then disconnect PC3 from Hub3 and reconnect PC3 to Hub4, the same hub as PC4 is
connected to.

9. Immediately generate a set of pings from PC3 to PC1 with the command:

PC3% ping 10.0.1.11 -c 5

You will notice that the ping command will fail for a short while and then is successful again.

10. Record the amount of time that the ping from PC1 to PC3 is not successful after PC3 has
been moved to Hub4.

11. Stop the ping from PC1 to PC3.

12. Stop the traffic capture on the PC's and save the Wireshark output

Lab Questions
•
Discuss what you observe in the Wireshark outputs and use that to explain the
difference in time that is takes for the pings from PC1 to be successful again in the two
ping scenarios above (PC1 to PC2 and PC1 to PC3).

---

## Page 9

Lab 4 – Page 9
PART 3.  Spanning Tree Protocol
The learning algorithm from Part 3 builds the MAC forwarding tables of bridges, without the
need for a routing protocol. However, since learning bridges flood a packet on all ports when a
destination is not known, it may happen that packets are forwarded in a cycle and loop
indefinitely. The spanning tree protocol for bridges, standardized in the IEEE 802.1d
specification, prevents such forwarding loops from occurring. This is done by organizing the
bridges in a spanning tree topology. Learning bridges that run the spanning tree protocol are
called transparent bridges.

The spanning tree protocol, which is used by virtually all Ethernet switches, works as follows.
One bridge, called the root bridge, is elected to be the root of the tree. Each bridge determines
which of it ports has the best path to the root bridge. This is the root port of the bridge. On each
LAN, the bridges elect one bridge, called the designated bridge, which among all bridges on
the same LAN, has the best path to the root bridge. The port that connects a bridge to the LAN
where it is a designated bridge is called the designated port. Then, all bridges disable
(blocking state as opposed to forwarding state) all ports that are not root ports or designated
ports. What results is a spanning tree of bridges. Since a tree topology does no have a loop,
forwarding packets along the edges of the tree guarantees that forwarding loops are entirely
avoided.

This part of the lab has three components: (1) You set up a new network configuration. (2) You
verify that bridges without the spanning tree result in forwarding loops. (3) You configure the
spanning tree protocol and observe how it prevents loops from occurring.

---

## Page 10

Lab 4 – Page 10
Exercise 3(A). Configuring a topology that results in forwarding loops

1. Set up the network topology as shown in Figure 4.3. Router 1, Router 2, Router 3, Router 4
and Router 5 are configured as Bridges. The PC's are configured as the hosts.

Figure 4.3 Network topology for Part 3.

Note:
For the time being, do not connect the cables to FastEthernet1/0 of Router 2 and Router 4,
shown as dotted lines in Figure 4.3. Making these two connections will result in a forwarding
loop. We delay the completion of the loop until you have set up the tools that allow you to
observe the forwarding loop.

2. Verify the MAC address of each interface on each of the devices (hosts and routers). Note
them down as you will use them in step 3 to set up static ARP tables.

3. Since ARP traffic interferes with the forwarding and bridge learning operations that you need
to observe, preconfigure the ARP tables with static entries so that no ARP Request packets
need to be sent.

PC1% arp -s 10.0.1.31 <PC2’s MAC Address>
PC1% arp -s 10.0.1.41 <PC3’s MAC Address>

PC2% arp -s 10.0.1.11 <PC1’s MAC Address>
PC2% arp -s 10.0.1.41 <PC3’s MAC Address>
PC3% arp -s 10.0.1.11 <PC1’s MAC Address>

---

## Page 11

Lab 4 – Page 11
PC3% arp -s 10.0.1.31 <PC2’s MAC Address>

In the preceding commands, <PC#’s MAC_address> is the 48-bit MAC address verified in Step
2. The MAC addresses are entered in hexadecimal notation, with each 2 byte separated by a
period (e.g., 00:a0:24:71:e4:44).
Exercise 3(B). Observing forwarding loops
The problem with learning bridges that do not run the spanning tree algorithm is that bridges
flood a packet on all outgoing links when a destination MAC address is not found in the MAC
forwarding table. This results in a forwarding loop. The packet will be flooded over and over
again, with each reception of the packet at a bridge generating a new round of copies. Thus, not
only are packets forwarded in an infinite loop, but also, the number of packets that are
forwarded increases due to the repeated flooding of the same packet in each round of the loop.

In this exercise you observe that the bridges in the topology of Figure 4.3, forward packets in a
loop.

1. Ensure that the Spanning Tree Algorithm (SPT) is disabled on all the Bridges.

•
On the Cisco routers (bridges), type “show running-config” and make sure the line
“bridge-group 1 spanning-disabled” exists for both Ethernet interfaces.

2. Clear the contents of the forwarding tables on all the Bridges.

•
On Cisco routers, execute the command clear bridge

3. Start Wireshark on all hosts, and capture all traffic on interface FastEthernet0/0.

4. Now complete the topology in Figure 4.3. by connecting interface FastEthernet1/0 of Bridge
2 and Bridge 4 to HUB 4 in Figure 4.3.

5. Issue a ping command from PC1 to PC3.

PC1% ping 10.0.1.41 -c 10

Use the Wireshark outputs to observe the route of ICMP Echo Request and Reply packets.
You should be able to see that the ICMP packets are looping.

6. Wait for several seconds and break the loop by disconnecting the cables to FastEthernet1/0
of Bridge 2 and Bridge 4 and shutting down the interface with the IOS command shutdown.
Otherwise, the packets will loop forever and cause the bridges to freeze up.

Note:
If the bridges freeze up, disconnect the cables to both interfaces of all the bridges and wait a
few minutes; they should clear themselves up. Please do not reboot the Cisco routers.

7. Stop the packet capture of Wireshark, and save a few ICMP packets. Observe the route
traversed by the ICMP packets.

---

## Page 12

Lab 4 – Page 12
8. For each bridge, save the output of the forwarding table.

9. Stop GNS3.

Lab Questions
•
Use the data saved to verify for one packet, that the packet is forwarded in a loop.
•
Use the output of Wireshark and the MAC forwarding tables to explain why some
packets are looping indefinitely?
•
Note that the network has more than one cycle until the reply reaches PC1. Explain why
the ICMP packets are looping through Bridge 2, but not through PC2 and Bridge 1 after
the ICMP reply reaches PC1.

---

## Page 13

Lab 4 – Page 13
Exercise 3(C). Enabling the spanning tree protocol
Next, you will enable the spanning tree protocol on the bridges in Figure 4.3 using the loop
setup in Ex 3B (i.e., with B2 and B4 connected to Hub 4). Before starting the exercise, we
provide a brief description of the spanning tree protocol.

AN OVERVIEW OF THE SPANNING TREE PROTOCOL
The IEEE 802.1d spanning tree protocol (STP) organizes bridges in a tree topology without any
central coordination. Every bridge has only a limited view of the spanning tree, and no bridge has
complete knowledge of the spanning tree.
Bridge ID: In the spanning tree protocol, each bridge has a unique identifier, called the bridge ID.
The bridge ID has a length of 8 bytes. The first 2 bytes are the bridge priority, and the remaining 6
bytes are the bridge MAC address. The bridge priority is a configuration parameter. The bridge
MAC address is set to the lowest MAC addressor any of the ports of the bridge. In the spanning
tree protocol, the bridge with the lowest bridge ID selected as the root bridge.
BPDU: Bridges build the spanning tree by exchanging bridge protocol data units (BPDU). Bridges
send BPDUs approximately once every 4 seconds. BPDUs are exchanged only between bridges
that are connected to the same LAN.
In Table 4.2 we illustrate the four fields of a BPDU that are relevant to the spanning tree protocol.
The BPDU of a bridge advertises the best path from this bridge to the root bridge. Specifically, a
BPDU-(R, C, B, P), where R is the value of the root ID, C is the value of the root path cost, B is
the bridge ID, and P is the port ID- is interpreted as follows: “I am bridge B and I am sending from
my port P. I believe R to be the root bridge, and the cost of my path to the root bridge is C.”

Length (in Bytes) Field Name
Content
8
Root ID
Identifies the root bridge (as seen by the sender of this BPDU)
4
Root path cost Cost of the path from the sender of this BPDU to the root bridge
8
Bridge ID
Identifies the sender of this BPDU
2
Port ID
Identifies the network interface (port) where this BPDU is sent.

Table 4.2. Fields of a BPDU relevant to the spanning tree construction.

---

## Page 14

Lab 4 – Page 14
Operation of the spanning tree protocol
Each bridge listens on all its ports to BPDUs sent by other bridges. If a bridge receives a BPDU that
advertises a “better” path than advertised in its own BPDU, the bridge updates its BPDU. To determine
if a received BPDU advertises a better path, the bridge compares the received BPDU to its own BPDU.
If the root ID in the received BPDU is smaller than the root ID of the bridge, the received BPDU is seen
as advertising a better path. If the root ID are identical, the BPDU with the lower root path cost
advertises a better path. If both the root ID and root path cost are identical, then the BPDU with the
lower bridge ID is seen as advertising a better path. Finally, if root ID, root path cost, and bridge ID are
all identical, then the BPDU with the lowest port ID is interpreted as advertising a better BPDU.
When a bridge with BPDU (R1, C1, B1, P1) receives a BPDU (R2, C2, B2, P2) and the received BPDU
advertises a better path, the bridge updates its own BPDU to (R2, C2+increment, B1, P1). The
increment value is a configuration parameter that accounts for the cost increase of the path due to
bridge B1 being now on the path. When the increment value is set to 1 on all bridges, then the bridges
establish a minimum hop route to the root bridge. The increment can also be set to account for the
data rate of a LAN. For example, to make a path on a 100 Mbps LAN more desirable than on a 10
Mbps LAN, the 10 Mbps LAN can be assigned a larger increment value.
A bridge transmits its BPDU on a port only if its BPDU advertises a better route than any of the BPDUs
received on that port. In this case, the bridge assumes that it is the designated bridge for the LAN to
which the port connects, and the port that connects the bridge to the LAN is called the designated port
of the LAN. A bridge that is not the designated bridge for a LAN does not send BPDUs on that LAN.
Constructing the spanning tree
Each bridge locally decides which of its ports are part of the spanning tree. Only the root port and the
designated ports of a bridge are part of the spanning tree; the other ports are not part of the spanning
tree. One can reconstruct the complete tree by connecting, for each LAN, the root ports that connect to
this LAN with the designated port of the LAN.
Each bridge forwards packets only on ports that are part of the spanning tree, that is, if they are
received on the root port or sent on its designated ports. These ports are said to be in a Forwarding
state. All other ports are said to be in a Blocking state. In this way, packets are forwarded only along
the edges of the spanning tree. As a result, since a tree topology does not have a loop, the forwarding
of packets does not result in loops.
Initializing the spanning tree protocol
When a bridge, say, with bridge ID B, is started, it assumes that it is the root bridge. It sends a BPDU
(B, O, B, p) on all its ports p. The root path cost is set to 0, since B believes itself to be root. Within a
short amount of time, the bridge learns about better paths, and the protocol quickly on verges to a new
spanning tree.
Your task is to capture the BPDU packets and analyze how the spanning tree is built. If you run
into a problem with this exercise it could be because GNS3 “froze up” due to Exercise 3(B)’s

---

## Page 15

Lab 4 – Page 15
infinite looping of the packets. In this case, save project and restart GNS3 where you left off
below.

1. Clear the forwarding tables on all bridges (1 to 5) as described in the previous exercise.

2. Complete the topology in Figure 4.3. by connecting interface FastEthernet1/0 of Bridge 2
and Bridge 4 to HUB 4 in Figure 4.3

3. Now set-up the bridges as follows, enabling the Spanning Tree Algorithm on all bridges by
undoing the spanning-disabled.

Sequence of commands shown for Bridge 1 below. Repeat for the rest of the bridges:

Router1# configure terminal
Router1(config)# interface FastEthernet0/0
Router1(config-if)# bridge-group 1
Router1(config-if)# no bridge-group 1 spanning-disabled
Router1(config-if)# interface FastEthernet0/1
Router1(config-if)# bridge-group 1
Router1(config-if)# no bridge-group 1 spanning-disabled
Router1(config-if)# exit

4. Verify that all the bridges have a bridge priority set to 128.

Shown for bridge 1 here, repeat for all the bridges:

Router1# show spanning-tree

You should see the line “Bridge Identifier has priority 128 ...”. If not, follow the instructions as
given in Exercise 1(A) on configuring a router as a bridge.

5. Start GNS3. Wait for a minute until the spanning tree stabilizes. The spanning tree has
stabilized when all interfaces of the bridges are no longer in “Learning” state, but are either
in the “Blocking” or “Forwarding” state. To observe that use the show spanning tree
command. You can obtain the state of a bridge by typing:

Router1# show spanning-tree

6. Clear the ARP table on all hosts including the static entries made in Exercise 3(A).

7. Run Wireshark on all hosts.

8. Issue a ping command from PC1 (10.0.1.11) to PC3 (10.0.1.41).

PC1% ping 10.0.1.41 -c 10

9. On each bridge save the output of the show spanning-tree.

---

## Page 16

Lab 4 – Page 16
10. Use the data to determine the relevant information of the spanning tree, such as the root
bridge, the root ports of each bridge, the designated bridges, the designated ports, the
forwarding ports, and the blocked ports.
•
By how much is the path cost incremented at each bridge?

11. Stop Wireshark. For each PC, save a few BPDU packets and all the ICMP and ARP packets
that have been captured by Wireshark. Use filtering to show fewer packets, if desired (e.g.
enter “arp || icmp || stp” as the display filter).

Lab Questions
•
Draw the spanning tree as seen by the bridges. Include all relevant information, such as
a root bridge, root ports, designated bridges, designated ports, and blocked ports. You
may want to use Figure 5 as a template.
•
Identify which bridges are sending the BPDUs on each segment, and check the following
fields for each such BPDU: root ID, root path cost, and the bridge ID. Explain how the
messages are interpreted. Show how the entire spanning tree can be constructed from
these messages.
•
Use Figure 4.3 to trace the packets resulting from the ping command (e.g. ARP Request
and Reply, ICMP Echo Request and Reply). Justify your answer with the saved data
from steps 9 and 10 above.
•
Using what you have observed, explain why bridges are not useful to connect large
networks with many (thousands) bridges.

Note:
Remember which bridge was the root bridge. You will be using that information in the
next part. If you don’t do Part 4 immediately, you will have to rerun Exercise (3C) to
determine the root bridge before proceeding with the exercises in Part 4.

---

## Page 17

Lab 4 – Page 17
Part 4. Adaptation of the Spanning Tree to Network
Changes
The spanning tree protocol adapts to changes in the network topology. Here you observe how
the spanning tree topology adapts when a link fails.
Exercise 4(A). Reconfiguration of the spanning tree
You will simulate a failed link in the network shown in Figure 4.3 by disconnecting an Ethernet
cable, i.e., shutting down the interface. You will observe how the bridges adjust to a change in
the network topology.

1. Use the network configuration as shown in Figure 4.3 with all links connected as in Ex 3(C).

Make sure that the spanning tree protocol is enabled on Bridges 1-5 and that the priorities of
all bridges are set to 128.

2. Run Wireshark on PC1, PC2, and PC3.

3. From PC1 (10.0.1.11) issue 100 pings to PC3 (10.0.1.41)

PC1% ping 10.0.1.41 -c 100

4. Disconnect one of the cables connected to the root bridge by shutting down the interface. If
you did not just complete Exercise 3(C), you will need to determine the root bridge by
completing Exercise 3(C).

•
BPDUs will be used to build a new spanning tree. Observe that the ping command at
PC1 will be unsuccessful for awhile, but will return to its successful state when a new
spanning tree is built.

•
Measure the time it takes to build a new spanning tree. (Hint: examine the statistics at
the end of the ping command)

5. Save the necessary information that describes the new spanning tree (see Steps 8 and 9 in
Exercise 3(C).

Lab Questions
•
Draw the spanning tree as seen by the bridges.  For each bridge indicate: the root ports,
designated ports, and blocked ports. Briefly explain the changes in the spanning tree.

---

## Page 18

Lab 4 – Page 18
Exercise 4(B). Configuring a bridge to be the root bridge
Here you force a certain bridge to become the root bridge. Recall that the priority of a bridge is
used in the first 2 bytes of the bridge ID. Thus, the bridge with the lowest priority value has the
lowest bridge ID. Since the spanning tree protocol elects the bridge with the lowest bridge ID as
the root bridge, the root bridge can be fixed by modifying the priority field.

Being able to fix a certain bridge as the root bridge provides some control over the spanning
tree topology. For example, one can select the device with the highest capacity to become the
root bridge.

1. Choose any non-root bridge from Exercise 4(A.) (Note that we are still using the
configuration with one cable disconnected).

2. Change the priority of this non-root bridge to 64. (Note that all the other bridges still have a
bridge priority of 128.). To change the priority of Bridge 1, type:

Router1# configure terminal
Router1(config)# bridge 1 priority 64
Router1(config)# end

3. Verify that a new root bridge has been selected, and save the necessary information that
describes the new spanning tree (see Steps 8 and 9 in Exercise 3(C)).

Lab Questions
•
Draw the spanning tree as seen by the bridges.  Briefly explain the changes in the
spanning tree.

---

## Page 19

Lab 4 – Page 19
Part 5.  Mixed Router and Bridge Network Topology
In this part of the lab, you set up a network topology that contains bridges as well as IP routers.
Both bridges and routers are devices that connect networks and forward packets between
networks. Bridges make forwarding decisions based on destination MAC addresses. IP routers
make forwarding decisions based on destination IP addresses. In a properly configured
network, bridges and IP routers coexist without causing network problems. Sometimes,
however, the forwarding of packets in a network with bridges and IP routers can be difficult to
trace. The following exercises explore such a scenario.
Exercise 5(A). Setting up the network configuration

1. Connect the PCs, Bridges, and Cisco routers as shown in Figure 4.5.

2. Complete the IP configuration of all PCs and Cisco routers Router2 and Router3 as given in
Tables 4.5 and 4.6.

•
All routing table entries are statically configured.

•
You must enable IP forwarding on Router2 and Router3.

•
NOTE: The network prefix of PC4 has been changed to 16 bits as shown in Table 4.5.
All other IP network interfaces have 24 bit long netmasks.

Here are the configuration commands for Router2:

Router2# configure terminal
Router2(config)# ip routing
Router2(config)# ip route 0.0.0.0 0.0.0.0 10.0.3.3
Router2(config)# interface FastEthernet0/0
Router2(config-if)# ip address 10.0.3.2 255.255.255.0
Router2(config-if)# no shutdown
Router2(config-if)# interface FastEthernet1/0
Router2(config-if)# ip address 10.0.1.2 255.255.255.0
Router2(config-if)# no shutdown
Router2(config)# end

---

## Page 20

Lab 4 – Page 20

Figure 4.5. Network topology for Part 5.

Cisco Routers
eth0
Default Gateway
PC1
10.0.1.11 / 24
10.0.1.2
PC2
10.0.3.21 / 24
10.0.3.2
PC3
10.0.4.31 / 24
10.0.4.3
PC4
10.0.4.41 / 16
10.0.4.3

Table 4.5. PC configurations for Part 5.

Cisco Routers Configured As Configuration Information
Router1

Router4
Bridge
• Enable bridging on both interfaces FastEthernet0/0 and
FastEthernet1/0
• The spanning tree protocol can be enabled or disabled.
• IP addresses need not be configured.
Router2
IP Router
• IP configuration on FastEthernet0/0: 10.0.3.2/24
• IP configuration on FastEthernet1/0: 10.0.1.2/24
• Default gateway set to 10.0.3.3
• IP forwarding is enabled.

---

## Page 21

Lab 4 – Page 21
Cisco Routers Configured As Configuration Information
Router3
IP Router
• IP configuration on FastEthernet0/0: 10.0.3.3/24
• IP configuration on FastEthernet1/0: 10.0.4.3/24
• Default gateway set to 10.0.3.2
• IP forwarding is enabled.

Table 4.6. Routers and Bridges configurations for Part 5.
Exercise 5(B). Observing traffic flow in a network with IP routers and
bridges
Here you observe the paths of packets between the PCs. You will see that in a mixed IP router
and bridge environment, tracing the path of a packet is not always straightforward.

1. Clear the forwarding tables on all bridges and clear the ARP table on all hosts and Cisco
routers.

2. Run Wireshark on all hosts.

3. Issue the following ping commands. Save the traffic captured by Wireshark and examine the
outputs to determine the path of the ICMP Request and Reply packets.

PC1% ping 10.0.4.31 -c 10
PC1% ping 10.0.4.41 -c 10
PC4% ping 10.0.1.11 -c 10
PC1% ping 10.0.3.21 -c 10
PC4% ping 10.0.3.21 -c 10

4. Stop the packet capture with Wireshark on all PCs. On each PC, save enough ICMP
packets so that you can address the questions raised in below.

Lab Questions
•
Determine which of the ping commands are successful and which fail.
•
Use the data displayed by Wireshark to determine the route of the ICMP Echo Request
and Reply packets (e.g. PC1 -> Bridge 1 -> Router 2 -> Bridge 2 -> PC4) for each ping.
•
For each path, provide an explanation why a certain route is taken by the ICMP Echo
Request and Reply packets.
