# cs234-11 - Part 03 (Pages 29-42)

---

## Page 29

Parser Model (V1 Architecture)
29

## include <core.p4>

## include <v1model.p4>
/*User-defined inputs and outputs */
struct my_headers_t {
ethernet_t
ethernet;
vlan_tag_t[2] vlan_tag;
ipv4_t
ipv6_t
ipv4;
ipv6;
}
struct my_metadata_t {
/* Nothing yet */
}
/* System-provided inputs. Others to follow */
struct standard_metadata_t {
bit<9>
ingress_port;
. . .
}
/* Parser Declaration*/
parser MyParser(packet_in
out
my_headers_t
inout my_metadata_t
inout standard_metada_t
packet,
hdr,
meta,
standard_metadata)
{
. . .
9
ingress_port
hdr
meta
meta
The platform Initializes
User Metadata to 0
standard_metadata
MyParser
packet_in

---

## Page 30

Parsers in P416
30
• Parsers are special functions written in a
state machine style
• Parsers have three predefined states
◦start
◦accept
◦reject
■Can be reached explicitly or implicitly
■What happens in reject state is defined by an architecture
• Other states are user-defined
start
accept
reject

---

## Page 31

Sample Parser State
Machine
31
parser MyParser(packet_in
out
my_headers_t
inout my_metadata_t
in
standard_metadata_t
packet,
hdr,
meta,
standard_metadata)
{
state start {
packet.extract(hdr.ethernet);
transition select(hdr.ethernet.etherType) {
0x8100 &&& 0xEFFF : parse_vlan_tag;
0x0800
: parse_ipv4;
0x86DD
: parse_ipv6;
0x0806
: parse_arp;
default : accept;
}
}
state parse_vlan_tag {
packet.extract(hdr.vlan_tag.next);
transition select(hdr.vlan_tag.last.etherType) {
0x8100 : parse_vlan_tag;
0x0800 : parse_ipv4;
0x86DD : parse_ipv6;
0x0806 : parse_arp;
default : accept;
}
}
state parse_ipv4 {
packet.extract(hdr.ipv4);
transition select(hdr.ipv4.ihl) {
0 .. 4: reject;
5: accept;
default: parse_ipv4_options;
}
state parse_ipv4_options {
packet.extract(hdr.ipv4.options,
(hdr.ipv4.ihl - 5) << 2);
transition accept;
}
state parse_ipv6 {
packet.extract(hdr.ipv6);
transition accept;
}

---

## Page 32

Lookahead
32
Example: Typical MPLS Heuristic
header ip46_t {
/*Common for both IPv4 and IPv6*/
bit<4> version;
bit<4> reserved;
}
state parse_mpls {
packet.extract(hdr.mpls.next);
transition select(hdr.mpls.last.bos) {
0: parse_mpls;
1: guess_mpls_payload;
}
}
state guess_mpls_payload {
transition select(packet.lookahead<ip46_t>().version) {
4 : parse_inner_ipv4;
6 : parse_inner_ipv6;
default : parse_inner_ethernet;
}
}
• lookahead is a generic method
◦Compiler generates the method with the proper
return type (ipv4_t) at the compile time
• Returns the packet data without advancing
the cursor
◦The packet length is still checked
• Much safer and easier to use than bit
offsets

---

## Page 33

Agenda
´Why Dataplan Programming
´P4 Overview
´Main Data Types
´Packet Parsing
´Packet Processing
´Packet Deparsing
´Program Structure
´P4 Runtime
´Summary
33

---

## Page 34

Controls in P4
• Very similar to C functions without loops
◦Algorithms should be representable as Direct Acyclic
Graphs (DAG)
• Represent all kinds of processing that are
expressible as DAG:
◦Match-Action Pipelines
◦Deparsers
◦Additional processing (checksum updates)
• Interface with other blocks via user- and
architecture-defined  data
34

---

## Page 35

Simple Reflector (V1
Architecture)
35
control MyIngress(
inout my_headers_t
hdr,
inout my_metadata_t
meta,
inout standard_metadata_t
standard_metadata)
{
bit<48> tmp;
apply {
tmp = hdr.ethernet.dstAddr;
hdr.ethernet.dstAddr = hdr.ethernet.srcAddr;
hdr.ethernet.srcAddr = tmp;
standard_metadata.egress_spec =
standard_metadata.ingress_port;
}
}
9
ingress_port
resubmit_flag
hdr
meta
meta
standard_metadata
48
hdr
9
egress_spec
mcast_grp
16
16
clone_spec
ingress_timestamp
resubmit_flag
5
egress_queue
standard_metadata

---

## Page 36

How Does V1 Architecture
Work?
36
9
ingress_port
resubmit_flag
meta
meta
48
MyIngress()
hdr
hdr
9
egress_spec
mcast_grp
16
16
clone_spec
ingress_timestamp
resubmit_flag
5
egress_queue
9
meta
meta
16
MyEgress()
hdr
hdr
clone_id
drop_flag
16
egress_port
egress_rid
clone_id
16
packet_length
16
deq_qdepth
16
Packet
Replication
Engine

---

## Page 37

Match-Action Tables
37
• The fundamental units of the Match-Action Pipeline
◦What to match on and match type
◦A list of possible actions
◦Additional properties
■Size
■DefaultAction
■Entries
■etc.
• Each table contains one or more entries (rows)
• An entry contains:
◦A specific key to match on
◦A single action
■to be executed when a packet matches the entry
◦(Optional) action data

---

## Page 38

Tables: Match-Action
Processing
38
Directional
(DataPlane)
Parameters
Directionless
(Action Data)
Parameters
Action
Code
Action
Execution
Lookup Key
Default
Action
Default Action
Data
Key
Action
Action Data
Hit
Data
Headers and
Metadata
(Input)
Headers and
Metadata
(Output)
Action
Hit/Miss
Selector
Control Plane
Headers and Metadata

---

## Page 39

Example: Basic IPv4
Forwarding
39
• Data Plane (P4) Program
◦Defines the format of the table
■Key Fields
■Actions
■Action Data
◦Performs the lookup
◦Executes the chosen action
• Control Plane (IP stack,
Routing protocols)
◦Populates table entries with
specific information
■Based on the configuration
■Based on automatic discovery
■Based on protocol calculations
192.168.23.45
10.1.2.0/22
192.168.1.1
192.168.1.4
192.168.1.2
192.168.1.3
192.168.1.254
192.168.23.254
Key
Action
Action Data
192.168.1.1
l3_switch
port=
mac_da=   mac_sa=
vlan=
192.168.1.2
l3_switch
port=
mac_da= mac_sa= vlan=…
192.168.1.3
l3_drop
192.168.1.254
l3_l2_switch
port=
192.168.1.0/24
l3_l2_switch
port=
10.1.2.0/22
l3_switch_ecmp
ecmp_group=

---

## Page 40

Defining Actions for L3
forwarding
40
action l3_switch(bit<9>
port,
bit<48> new_mac_da,
bit<48> new_mac_sa,
bit<12> new_vlan)
{
/*Forward the packet to the specified port */
standard_metadata.metadata.egress_spec = port;
/* L2 Modifications */
hdr.ethernet.dstAddr
= new_mac_da;
hdr.ethernet.srcAddr
= mac_sa;
hdr.vlan_tag[0].vlanid = new_vlan;
/* IP header modification (TTL decrement)*/
hdr.ipv4.ttl = hdr.ipv4.ttl – 1;
}
action l3_l2_switch(bit<9> port) {
standard_metadata.metadata.egress_spec = port;
}
action l3_drop() {
mark_to_drop();
}
• Actions can use two
types of  parameters
◦Directional (from the Data Plane)
◦Directionless (from the Control
Plane)
• Actions that are called
directly:
◦Only use directional parameters
• Actions used in tables:
◦Typically use direction-less
parameters
◦May sometimes use directional
parameters too
Directional
(DataPlane)
Parameters
Directionless
(Action Data)
Parameters
Action
Code
Action
Execution

---

## Page 41

Match-Action Table
41
Example: A typical L3 (IPv4) Routing table
: exact;
: lpm;
table ipv4_lpm {
key = {
meta.ingress_metadata.vrf
hdr.ipv4.dstAddr
}
actions = {
l3_switch;
l3_l2_switch;
l3_switch_nexthop(meta.l3.nexthop_info);
l3_switch_ecmp(meta.l3.nexthop_info);
l3_drop;
noAction;
}
const default_action = l3_l2_switch(CPU_PORT);
size = 16384;
}
vrf
ipv4.dstAddr / prefix
action
data
1
192.168.1.0 / 24
l3_l2_switch
port_id=3
10
10.0.16.0 / 22
l3_ecmp
ecmp_index=12
1
192.168.0.0 / 16
l3_switch_nexthop
nexthop_index=451
1
0.0.0.0 / 0
l3_switch_nexthop
nexthop_index=1
DEFAULT
l3_l2_switch
port_id=CPU_PORT
Different fields can
use different
match types
Different fields can
use different
match types
Prefix length also
serves as a priority
indicator

---

## Page 42

Agenda
´Why Dataplan Programming
´P4 Overview
´Main Data Types
´Packet Parsing
´Packet Processing
´Packet Deparsing
´Program Structure
´P4 Runtime
´Summary
42
