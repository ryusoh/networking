# cs234-10 - Part 03 (Pages 29-42)

---

## Page 29

Agenda
´Motivations
´Concepts
´OpenFlow Protocol
´Network Virtualization
´Virtual Switches
29

---

## Page 30

FlowVisor for Network
Virtualization
30
OpenFlow
Switch
OpenFlow
Protocol
OpenFlow FlowVisor
& Policy Control
Craig’s
Controller
Heidi’s
Controller
Aaron’s
Controller
OpenFlow
Protocol
OpenFlow
Switch
OpenFlow
Switch
Topology
discovery is
per slice

---

## Page 31

FlowVisor Slicing
´ Slices are defined using a slice definition
policy
´ The policy language specifies the slice’s
resource limits, flowspace, and controller’s
location in terms of IP and TCP port-pair
´ FlowVisor enforces transparency and isolation
between slices by inspecting, rewriting, and
policing OpenFlow messages as they pass
31

---

## Page 32

Resource Limits Assigned in
FlowVisor
´ Topology
´ Network devices
´ Physical ports
´ Bandwidth
´ Each slice can be assigned a per port queue with a
fraction of the total bandwidth
´ CPU
´ Employs Course Rate Limiting techniques to keep
new flow events from one slice from overrunning the
CPU
´ Forwarding Tables
´ Each slice has a finite quota of forwarding rules per
device
32

---

## Page 33

FlowSpace Determine
Assignments of Packets to Slices
´ Source/Destination MAC address
´ VLAN ID
´ Ethertype
´ IP protocol
´ Source/Destination IP address
´ ToS/DSCP
´ Source/Destination port number
33

---

## Page 34

OpenFlow Messages are
Intercepted by FlowVisor
34
OpenFlow
Firmware
Data Path
Alice
Controller
Bob
Controller
Cathy
Controller
FlowVisor
OpenFlow
OpenFlow
Packet
Exception
Policy Check:
Is this rule
allowed?
Policy Check:
Who controls
this packet?
Full Line Rate
Forwarding
Rule
Packet

---

## Page 35

Agenda
´Motivations
´Concepts
´OpenFlow Protocol
´Network Virtualization
´Virtual Switches
35

---

## Page 36

Virtual Switches
´ Due to the cloud computing service, the
number of virtual switches begins to expand
dramatically
´ Management complexity
´ Security issues
´ Performance degradation
´ Machine virtualization is enhanced by:
´ Software or hardware based virtual switches
36

---

## Page 37

Limitations of vSwitches
(before SDN)
37
´ The hypervisors implement vSwitch
´ Each VM has at least one virtual
network interface cards (vNICs) and
shared physical network interface
cards (pNICs) on the physical host
through vSwitch
´ Administrators don’t have effective
solution to separate packets from
different VM users
´ For VMs reside in the same physical
machine, their traffic visibility is a big
issue

---

## Page 38

Open vSwitch
´ A software-based solution
´ Resolve the problems of network separation and
traffic visibility, so the cloud users can be assigned
VMs with elastic and secure network configurations
´ Flexible Controller in User-Space
´ Fast Datapath in Kernel
38
Server
Open vSwitch Datapath
Open vSwitch Controller

---

## Page 39

Features of Open vSwitch
´ Multiple ports to physical switches
´ A port may have one or more interfaces
´ Bonding allows more than once interface per port
´ Centralized control through OpenFlow
´ Works on Linux-based hypervisors:
´ Xen
´ KVM
´ VirtualBox
´ IEEE 802.1Q Support
´ Enable virtual LAN function
´ By attaching VLAN ID to Linux virtual interfaces, each user
will have its own LAN environment separated from other
users
39

---

## Page 40

Open vSwitch Defines Flows
as…
´ Any combination of
´ Input port
´ VLAN ID (802.1Q)
´ Ethernet Source MAC address
´ Ethernet Destination MAC address
´ IP Source MAC address
´ IP Destination MAC address
´ TCP/UDP/... Source Port
´ TCP/UDP/... Destination Port
40

---

## Page 41

Open vSwitch Operates as
Other OpenFlow Switches
´ The 1st packet of a flow is sent to the controller
´ The controller programs the datapath's actions for a flow
´ Usually one, but may be a list
´ Actions include:
´ Forward to a port or ports
´ mirror
´ Encapsulate and forward to controller
´ Drop
´ And returns the packet to
the datapath
´ Subsequent packets are
handled directly by the
datapath
41

---

## Page 42

42
Questions
<chsu@cs.nthu.edu.tw>
