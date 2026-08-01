# p4-tutorial

---

## Page 1

SIGCOMM’16
Tutorial
Jeongkeun “JK” Lee, Chang Kim
Aug 2016
1
Programming The Network

---

## Page 2

P4 Introduction
2

---

## Page 3

Networking App /
Switch OS
“This is how I know to
process packets”
(i.e. the ASIC datasheet
makes the rules)
Fixed-function ASIC
Status Quo: Bottom-up design
3
Custom requirements
from your network

---

## Page 4

Networking App /
Switch OS
“This is how I want the
network to behave and how to
switch packets…”
(the user / controller
makes the rules)
P4 Programmable Device
A Better Approach: Top-down design
4
Custom requirements
from your network
P4

---

## Page 5

Programmable Network Devices
• PISA: Flexible Match+Action ASICs
◦Intel Flexpipe, Cisco Doppler, Cavium (Xpliant), Barefoot Tofino, …
• NPU
◦EZchip, Netronome, …
•
• FPGA
◦Xilinx, Altera, ...
These devices let us tell them how to process packets.
5

---

## Page 6

Why we call it
Protocol Independent Packet Processing
6

---

## Page 7

Switc
Protocol-Independent Switch Architecture (PISA)
 Programmable
Parser
Memory
ALU

---

## Page 8

Switc
Protocol-Independent Switch Architecture (PISA)
8
Queues
Parser
Fixed Action
Match Table
Match Table
Match Table
Match Table
L2
IPv4
ACL
Action Macro
Action Macro
Action Macro
Action Macro

---

## Page 9

Match Table
Action Macro
Mapping to Physical Resources
9
Queues
Parser
Match Table
Match Table
Match Table
L2 Table
IPv4 Table
IPv6 Table
ACL Table
Action Macro
Action Macro
Action Macro
L2
IPv4
ACL
Switc
L2
ACL
IPv4
L2 Action Macro
v4 Action Macro
v6 Action
ACL Action Macro
packet

---

## Page 10

Switc
Re-configurability
10
Queues
Parser
L2 Table
IPv4 Table
ACL Table
IPv6 Table
MyEncap
L2
IPv4
ACL
MyEncap
L2 Action Macro
v4 Action Macro
ACL Action
Macro
Action
MyEncap
v6 Action Macro
IPv4
Action
IPv4
Action
IPv6
Action

---

## Page 11

P4: Three Goals
Protocol independence
◦Define a packet parser
◦Define a set of typed match+action tables
Target independence
◦
◦
In-field Re-c
◦Allow the users to change parsing and processing program in the field
11

---

## Page 12

What does this mean?
§ To network device vendors
§
S/W programming practices and tools used in every phase
§
Extremely fast iteration a
§
§
§ To large on-line service providers and carriers
§
No more “black boxes” in the “white boxes”
§
Your devs can program, test, and debug your network devices all the way down
§
You keep your own ideas
12
You wear
both hats 

---

## Page 13

Key benefits of programmable forwarding

1. New features: Realize new protocols and behaviors very quickly
2. Reduce complexity: Remove unnecessary features and tables
3. Efficient use of H/W re
gest bang for buck
4.
5.
6. Portabilit
any devices
7. Own your own network: No need to wait for next chips or systems
13

---

## Page 14

Parser
Match+Action Tables
Scheduling
Packet Metadata
P4-Based Workflow
• Device is not yet programmed
◦Does not know about any packet formats or protocols
14

---

## Page 15

Protocol
Authoring
1
2
4
Parser
Match+Action Tables
Scheduling
Packet Metadata
IPv4
IPv6
VLAN
Eth
 API
Switch OS
Run!
5
P4-Based Workflow
15
L2_L3.p4

---

## Page 16

Protocol
Authoring
1
2
4
Parser
Match+Action Tables
Scheduling
Packet Metadata
IPv4
IPv6
VLAN
Eth
 API
Switch OS
Run!
5
P4-Based Workflow
16
L2_L3.p4
VXLAN.p4
UDP
VXLAN

---

## Page 17

The P4 Language Consortium
•
Consortium of academic
and industry members
•
Open source, evolving,
d
•
P
code on GitHub
•
Membership is free:
contributions are welcome
•
Independent, set up as a
California nonprofit

---

## Page 18

Syste
P4.org Membership
Academia
Targets
Operators
Original P4 Paper Authors:
•
Open source, evolving, domain-specific language
•
Permissive Apache license, code on GitHub today
•
Membership is free: contributions are welcome
•
Independent, set up as a California nonprofit

---

## Page 19

P4 Concepts
• Pipelin
19

---

## Page 20

Parser
Deparser
The anatomy of a basic pipeline
20
• Parser
◦Converts packet data into a metadata (Parsed Representation)
• Match+Action Tables
◦Operate on metadata
• Deparser
◦Converts metadata back into a serialized packet
• Metadata Bus
◦Carries the information within the pipeline
All are
optional
Metadata Bus

---

## Page 21

Anatomy of a Switch
• Ingress Pipeline
• Egress Pipeline
• Traffic Manager
◦N:1 Relationships: Queuei
◦
◦
21
Deparser
Metadata
Parser
Metadata
Queueing,
Replication
&
Scheduling
Parser
Deparser
Parser
Deparser
Queueing,
Replication
&
Scheduling

---

## Page 22

P4 Program Sections
24
Parser
Deparser
parser parse_ethernet {
   extract(ethernet);
   return switch(etherne
      0x8100 : parse_vlan_tag;
      0x0800 : parse_ipv4;
      0x8847 : parse_mpls;
      default: ingress;
}
table port_table { … }
control ingress {
    apply(port_table);
    if (l2_meta.vlan_tags == 0) {
        process_assign_vlan();
    }
}
header_type  ethernet_t    { … }
header_type  l2_metadata_t { … }
header    ethernet_t    ethernet;
header    vlan_tag_t    vlan_tag[2];
metadata  l2_metadata_t l2_meta;
program.p4
Data Declarations
Pars
Table + Control Flow Program
P4 program defines what each table CAN do

---

## Page 23

Control Plane Roles
25
Parser
Deparser
program.p4
P4 defined what each table CAN do
Queueing,
Replication
&
Scheduling
...
Parser
Data Declarations
Pars
Table + Control Flow Program
Control plane or NOS decides switch runtime behavior
SDN controller or Network OS
queue, multicast, mirror

---

## Page 24

P4 & OpenFlow: Traditional SDN before P4
26
Fixed function data plane
Driver
OpenFlow Agent
Applications
Northbound API
OpenFlow Protocol

---

## Page 25

P4 with OpenFlow
27
Data Plane
Driver
SBI Agent
Southbound API
Applications
Northbound API
Compile
Target Binary
Auto-Generated API
User/Application
Intent

---

## Page 26

P4 with Network OS
28
Data Plane
Driver
Network OS (Linux, OPS, SONIC,
FBOSS, ...)
Configuration API
(NOT per-flow)
Applications
Northbound API
Compile
Target Binary
Auto-Generated API
User/Application
Intent

---

## Page 27

P4 Constructs
• P4 Spe
29

---

## Page 28

P4 Language Components
• Data declarations
◦Packet Headers and Metadata
• Parser Programming
◦Parser Functions (Parser st
◦Checksum Units
• P
◦
■Primitive and
■Counters, Meters, Registers
◦Tables
■Match keys
■Attributes
◦Control Functions (Imperative Programs)
No: pointers, loops, recursion, floating point
30

---

## Page 29

Example: Declaring packet headers
header_type ethernet_t {
    fields {
        dstAddr   : 48;
        srcAddr   : 48;
        etherType : 16;
    }
}
header_type vlan_tag_
    fields {
        pcp       : 3;
        cfi       : 1;
        vid       : 12;
        etherType : 16;
    }
}
header ethernet_t ethernet;
header vlan_tag_t vlan_tag[3];
Headers and Fields (Packet)
31
Actual Header
Instantiation
Header Type
Declar
Handy Arrays for
Header Stacks

---

## Page 30

Example: Declaring Metadata
header_type ingress_metadata_t {
    fields {
     /*Inputs */
        ingress_port          : 9;  /*
/
        packet_length         : 16; /*
/

     /* Outputs from Ingress Pipeline */
        egress_spec           : 16;
        queue_id              : 9;
   }
}
metadata ingress_metadata_t ingress_metadata;
Headers and Fields (Metadata)
32
Actual Metadata
Instantiation
Metadata is a header
too

---

## Page 31

Metadata vs. Packet Headers
• Layout definition
◦Packet header declarations define both the fields and the actual layout in the
packet.
◦Layout is not defined for m
• B
◦
◦No special r
• Validity
◦Packet headers are valid only if present in the packet
◦Metadata is ALWAYS valid
■Default value is either 0 or can be specified explicitly
• Acceptable fields
◦Packet headers can contain calculated and variable length fields
33

---

## Page 32

Example: Declaring IPv4 packet header
header_type ipv4_t {
    fields {
        version        : 4;
        ihl            : 4;
        diffserv       : 8;

        flags
        fragOffset
        ttl            : 8;
        protocol       : 8;
        hdrChecksum    : 16;
        srcAddr        : 32;
        dstAddr        : 32;
        options        : *;
    }
    length     : (ihl << 2);
    max_length : 60;
}
Variable-Length Fields
34
Calculated, based on
another field
Variable-length Field

---

## Page 33

Example: Simple Parser for L2/L3 Packets
header ethernet_t ethernet;
header vlan_tag_t vlan_tag[2];
header ipv4_t ipv4;
header ipv6_t ipv6;
parser
    ext
    ret

        0x0800
        0x86DD
        default        : ingress;
    }
}
parser parse_vlan_tag {
    extract(vlan_tag[next]);
    return select(latest.etherType) {
        0x8100 mask 0xEFFF : parse_vlan_tag;
        0x0800             : parse_ipv4;
        0x86DD             : parse_ipv6;
        default            : ingress;
    }
}
Defining a Parser Tree
35
This is not a reserved
word, but a name of the
Control Flow Function
IPv4
IPv6
VLAN
Eth
UDP
VXLAN

---

## Page 34

Example: Simple Parser for L2/L3 Packets
header ethernet_t ethernet;
header vlan_tag_t vlan_tag[2];
header ipv4_t ipv4;
header ipv6_t ipv6;
parser
    ext
    ret

        0x0800
        0x86DD
        default        : ingress;
    }
}
parser parse_vlan_tag {
    extract(vlan_tag[next]);
    return select(latest.etherType) {
        0x8100 mask 0xEFFF : parse_vlan_tag;
        0x0800             : parse_ipv4;
        0x86DD             : parse_ipv6;
        default            : ingress;
    }
}
Defining a Parser Tree (cont.)
36
parser parse_ipv4 {
    extract(ipv4);
    return ingress;
IPv4
IPv6
VLAN
Eth
UDP
VXLAN

---

## Page 35

Example: Ipv4 Header Parsing
parser parse_ipv4 {
    extract(ipv4);
    set_metadata(ipv4_metadata.lkp_ipv4_sa, ipv4.srcAddr);
    set_metadata(ipv4_metadata.lkp_ipv4_
    set_metadata(l3_metadata.lkp_ip_prot
    se
    re

        0x0000506 : p
        0x0000511 : p
        default   : ingress;
}
Multi-field select statement
39
Fields are joined
for a match
Metadata can be
initialized by the
parser

---

## Page 36

Deparsing (Serializing packet headers)
• Fundamental assumption of P4
◦The device must be able to parse any packet it can produce
• Consequence
◦Packet headers can be rea
er definition
◦
40
• Example: insert my_header after udp
•
parser parse_udp {
    extract(udp);
    return select(latest.dst_port) {
        0x0 mask 0x00 : ingress;
        default       : parse_my_header;
•
}
Ingress parser will
always transit to
ingress
Parser tree has a
branch to my_header
for deparsing

---

## Page 37

P4 Language Components
• Data declarations
• Parser Programming
•P
◦
■Primitive and
■Counters, M
◦Tables
■Match keys
■Attributes
◦Control Functions
41

---

## Page 38

Actions
• Primitive actions
◦no_op, drop
◦modify_field, modify_field_with_hash_based_offset
◦add, add_to_field
◦add_header, remove_heade
◦
◦
◦generate_dig
◦truncate
◦resubmit, recirculate, clone{_i2i,_e2i, _i2e,_e2e}
• Compound actions
action route_ipv4(dst_port, dst_mac, src_mac, vid) {
    modify_field(standard_metadata.egress_spec, dst_port);
    modify_field(ethernet.dst_addr, dst_mac);
    modify_field(ethernet.src_addr, src_mac);
    modify_field(vlan_tag.vid, vid);
    add_to_field(ipv4.ttl, -1);
}
42

---

## Page 39

Arithmetic and Logical Primitives
• The current standard (v1.0.2)
◦Primitive actions
■Standard: add(), add_to_field()
■Additional: subtract(), subtract
r(), bit_xor(), shift_left(),
shift_right(), …
■
◦
• Developing
◦Expressions with +, -, &, |, ^, ~, <<, >>, etc.
■modify_field(ipv4.ttl, ipv4.ttl – 1)
◦Specific targets might restrict expression complexity
43

---

## Page 40

Action Execution Semantics
• All actions within a compound action are assumed to be executed
sequentially
action parallel_test() {
    modify_field(hdr.fieldA, 1);
    modify_field(hdr.fieldB, hdr.f
• This is an important specification change
◦Up to version 1.0.2 action execution was parallel
◦After 1.0.2 action execution is sequential
• The maximum number of steps supported for a compound action is
target-dependent
44
fieldB
1
fieldA before action

---

## Page 41

Match-Action Tables
• The most fundamental units of the Match-Action Pipeline
• P4 defines
◦What to match on and match type
◦A list of possible actions
◦
■
• In runtime,
ws)
• An entry contains:
◦A specific key to match on
◦A single action
■to be executed when a packet matches the entry
◦(Optional) action data
45

---

## Page 42

Example: IPv4 Processing
• P4 Program
◦Defines the format of the table
■Key Fields
Actions
Action Data
ntries with
specific information
■Based on the configuration
■Based on automatic discovery
■Based on protocol calculations
• Data Plane (populated table)
◦Performs the lookup
◦Executes the chosen action
46
192.168.23.45
10.1.
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
port=     mac_da=    mac_sa=     vlan=
192.168.1.2
l3_switch
port=     mac_da=    mac_sa=    vlan=…
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

## Page 43

action l3_switch(port, mac_da, mac_sa, vlan) {
    modify_field(metadata.egress_spec, port);
    modify_field(ethernet.dstAddr, mac_da);
    modify_field(ethernet.srcAddr, mac_sa);
    modify_field(vlan_tag[0].vlanid, vlan);
    modify_field(ipv4.ttl, ipv4.ttl – 1);
}
action l3_l2_switch(port) {
    mod
}
action l3_drop() {
    drop();
}
action l3_switch_nexthop(nexthop_index) {
    modify_field(l3_metadata.nexthop, nexthop_index);
    modify_field(l3_metadata.nexthop_type, NEXTHOP_TYPE_SIMPLE);
}
action l3_switch_ecmp(ecmp_group) {
    modify_field(l3_metadata.nexthop, ecmp_group);
    modify_field(l3_metadata.nexthop_type, NEXTHOP_TYPE_ECMP);
}
Defining Actions
47

---

## Page 44

Example: A typical L3 (IPv4) Host table
table ipv4_host {
    reads {
        ingress_metadata.vrf    : exact;
        ipv4.dstAddr            : exact;
    }
    ac

        l3_switch_nex
        l3_switch_ecm
        l3_drop;
    }
    size : HOST_TABLE_SIZE;
}
Match-Action Table (Exact Match)
vrf
ipv4.dstAddr
action
data
1
192.168.1.10
l3_switch
port_id=  mac_da=  mac_sa=
100
192.168.1.10
l3_l2_switch
port_id=<CPU>
1
192.168.1.3
l3_drop
5
10.10.1.1
l3_switch_ecmp
ecmp_group=127

---

## Page 45

Example: A typical L3 (IPv4) Routing table
table ipv4_lpm {
    reads {
        ingress_metadata.vrf    : exact;
        ipv4.dstAddr            : lpm;
    }
    ac

        l3_ecmp;
        l3_drop;
   }
   size : 65536;
}
Match-Action Table (Longest Prefix Match)
vrf
ipv4.dstAddr / prefix
action
data
1
192.168.1.0  / 24
l3_l2_switch
port_id=64
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
Prefix also serves
as a priority
indicator
Different fields can
use different
match types

---

## Page 46

Example: A typical L3 (IPv4) Routing table
table ipv4_lpm {
    reads {
        ingress_metadata.vrf    : ternary;
        ipv4.dstAddr            : ternar
    }
    ac

        l3_ecmp;
        l3_drop;
   }
   size : 65536;
}
Match-Action Table (Ternary Match)
Prio
vrf / mask
ipv4.dstAddr / mask
action
data
100
0x001/0xFFF
192.168.1.5 / 255.255.255.255
l3_swith_nexthop
nexthop_index=10
10
0x000/0x000
192.168.2.0/255.255.255.0
l3_switch_ecmp
ecmp_index=25
10
0x000/0x000
192.168.3.0/255.255.255.0
l3_switch_nexthop
nexthop_index=31
5
0x000/0x000
0.0.0.0/0.0.0.0
l3_l2_switch
port_id=64
Ternary tables require
an explicit
specification of entry
priority

---

## Page 47

Match Types
• Exact
◦port_index : exact
• Ternary
◦ethernet.srcAddr : ternary
• L
◦i
• Range
◦udp.dstPort : range
• Valid
◦vlan_tag[0] : valid
51

---

## Page 48

Table Miss
• Each table can have a Default Action
◦Chosen by the Control Path at runtime from the list of table Actions
■P4 Program does not have an indication which action (and which action data) will be the
default
• W
◦

control path
◦If no Default Action has been specified, it is no_op()
52

---

## Page 49

Stateful Objects
• Count
53

---

## Page 50

What are stateful objects
• Stateful objects keep their state between packets
◦Metadata and packet headers are stateless
■They are re-initialized for each packet
◦Counters, Meters and Regi
■
■
■
54

---

## Page 51

A counter per table entry
counter ip_acl_stats {
    type : packets_and_bytes;
    direct : ip_acl;
}
table ip_acl {
    rea

        l3_metadata.lk
        l3_metadata.lk
    }
    actions {
        nop;
        acl_log;
        acl_deny;
        acl_permit;
        acl_mirror;
        acl_redirect_nexthop;
        acl_redirect_ecmp;
    }
    size : INGRESS_IP_ACL_TABLE_SIZE;
}
Direct Counters
55
matched entry
ABCD_xxxx_0123
Match Fields
acl_permit
acl_deny
p
Action Sel
8b
Action Data
pkt/byte counts
counter A
counter Z
Counter
8b
table ip_acl
counter ip_acl_stats

---

## Page 52

Flexibly linked counters
counter ingress_bd_stats {
    type : packets_and_bytes;
    instance_count : BD_STATS_TABLE_SIZE;
}
action
    mo
    co
}
table port_vlan {
    reads {
         ingress_metadata.ingress_port : exact;
         vlan_tag[0]                   : valid;
         vlan_tag[0].vlan_id           : exact;
    }
    actions {
         set_bd;
    }
}
Indirect Counters
56
Different VLANs (BDs) can share
the same counter
matched entry
ABCD_0123
BA8E_F007
Match Fields
set_bd
set_bd
set_bd
set_bd
set_bd
set_bd
set_bd
Action Sel
bd
bd
bd
Action Data
table port_vlan
bd
bd
bd
bd
bd_stat_index
bd_stat_index A
bd_stat_index
bd_stat_index
bd_stat_index
bd_stat_index
bd_stat_index A
pkt/byte counts
counter
ingress_bd_stats

---

## Page 53

/*Direct Meter */
meter acl_meter {
     t
     d
     r
}
/* Indirect Meter Array*/
meter bd_meter {
    type: bytes;
    instance_count: 1000;
}
action do_bd_meter(meter_index) {
    execute_meter(bd_meter, meter_index, metadata.color);
}
Meters
57
• Declaration is similar to counters
◦Action: execute_meter(meter_array, meter_index, color_destination)
Color Coding:
0 – Green
1 – Yellow
2 -- Red

---

## Page 54

/*Register Array (Indirect)*/
regist
    wi
    sta
    instance_count:  1
}
action get_flow_age(flow_index) {
    register_read(last_syn, flow_index, metadata.flow_start_time);
    modify_field(metadata.flow_age,
                 metadata.flow_start_time – metadata.ingress_global_stamp);
}
action start_new_flow(flow_index) {
    register_write(last_syn, flow_index, metadata.ingress_global_timestamp);
}
Registers
58
• Declaration is similar to indirect counters
◦Actions
■register_read(register_array, register_index, destination_field)
■register_write(register_array, register_index, value)

---

## Page 55

Control Flow Functions
• Primitives
◦Perform a table lookup: apply
◦if/else statement
◦apply with the case clause
• S
◦
• Standard c
◦ingress() – Ingress Pipeline processing
◦egress() – Egress Pipeline processing
• User-defined control functions
59

---

## Page 56

contr
    a
    a
    apply(dmac);
}
control egress {
    apply(vlan_tag_removal);
}
Standard Control Functions
60
• ingress() control function starts processing
◦remember “return ingress;” statement in the parser functions
• egress() control function is called implicitly from the Packet Replication Engine

---

## Page 57

control assign_vlan {
    ap
    ap
    ap
    apply(port_vlan)
    apply(resolve_vl
}
control ingress {
    . . .
    if (!valid(vlan_tag[0]) {
        assign_vlan();
    }
    . . .
}
User-Defined Control Functions
61
• Help improve code readability
◦No specific performance advantages: the code is flattened by the compiler
• No parameters are accepted

---

## Page 58

Example: Separate Ipv4 and IPv6 Processing Paths
if ((l3_metadata.lkp_ip_type == IPTYPE_IPV4) and (ipv4_metadata.ipv4_unicast_enabled == TRUE)) {
    process_ipv4_racl();
    process_nat();
    process_ipv4_urpf();
    process_ipv4_fib();
} else
    if
 {
        process_ipv6
        process_ipv6
        process_ipv6_fib();
    }
}
If/Else Branching
62

---

## Page 59

Example: Use per-router-mac decapsulation
table router_mac {
    reads {
        l2_metadata.lkup_dst_mac : ternary;
        l2_metadata.bd           : ternary;
        ingress_metadata.src_port: ternar
    }
    act

        enable_ipv6_lo
        enable_mpls_de
        enable_mim_decap;
    }
}
control process_router_mac_lookup {
    apply(router_mac) {
        enable_ipv4_lookup { process_ipv4_fib(); }
        enable_ipv6_lookup { process_ipv6_fib(); }
        enable_mpls_decap  { process_mpls_label_lookup(); }
           /*etc.*/
    }
}
Action Branching
63

---

## Page 60

Miss branching
64
action on_miss() {}
table ipv4_fib {
   reads {
   . . .
       l3_switch_ecmp;
       on_miss;
   }
}
control process_ipv4_fib {
    apply(ipv4_fib) {
        on_miss {
            apply(ipv4_fib_lpm);
        }
    }
}
We choose to use only
this action as the default

---

## Page 61

control process_counters {
    if (my_meta.drop_packet == 0) {
        count(bd_counter,
              metadata.bd_counter_index);
        count(vrf_counter,
              metadata.vrf_counter_index);
    }
}
Executing actions in the control flow
65
• Actions cannot be directly referenced in the control flow functions
◦Instead, they need to be “wrapped” into tables
• Tables without keys can be used to implement unconditional execution
◦They always miss and hence the desired action needs to be set as a default
action update_counters() {
    count(bd_counter,
          metadata.bd_counter_index);
    count(vrf_counter,
          metadata.vrf_counter_index);
}
counters {
    if (my_meta.drop_packet == 0) {
        apply(do_process_counters);
    }
}

---

## Page 62

P4 Compiler Ov
82

---

## Page 63

Modular Compiler Overview
• Single Front-End (p4-hlir)
◦Translates P4 code into High-Level Intermediate Representation (HLIR)
■Similar to AST (Abstract Syntax Trees)
■Currently represented as a hie
■Frees backend developers fro
is and target-independent
■
• Multiple ba
◦Code generators for various targets
■Software Switch Model (p4c-bm)
■Network Interface Cards
■Packet Processors / NPUs
■FPGAs, GPUs, ASICs
◦Validators and graph generators
◦Run-time API generators
83

---

## Page 64

P4 Modular Compiler
84
Control
Flow &
Parse
Graphs
JSON
config for
bmv2, PD-
lib
Drivers
P4 Compiler
(p4-hlir)
Outputs
Ba
Frontend
Intermediate
Device-
specific
config, PD-
Lib
P4 program
Drivers

---

## Page 65

Automatic API Generation
92

---

## Page 66

Network Device API Basics
• Object Definitions (Schema)
◦Reflects the object properties and methods
• Object Relationships (Behavior)
◦The quality of th
ent on how well
93

---

## Page 67

P4 is an Ideal Base for a Network APIs
• Clearly defined objects
◦Tables
◦Counters
◦Meters
◦
• U
◦Control Flo
• Idea:
◦Each of fundamental P4 objects has a “natural” schema
94

---

## Page 68

Tables
• Uniform representation
◦Primary key: Entry ID
◦Match Fields
◦Action
◦Action Data
■Depends on the action
• Operations
◦En
■(
◦Ent
■(Entry ID, Action, Action Data) 
◦Entry Lookup
■(Match Fields, [Action, Action Data])  Entry ID
◦Table Traverse
■ [ EntryID0, EntryID1, … EntryIDn ]
◦Table Default_Action Set
■(Action, Action Data) 
◦Table Default_Action Get
■ (Action, Action Data)
◦Table Default Action Clear
■
95
◦Table Occupancy Get
◦Table Clear
ABCD_0123
Match Fields
action A
Action Sel
Action Data
EntryID

---

## Page 69

Example API. Match & Action Specs
myprog.p4
pd_myprog.h
96
action a1(p11, p12) {…}
action a2(p21, p22, p23) {…}
action a3() {…}
table t1 {
       h
    }
typedef struct p4_pd_myprog_a1_action_spec {
    <type> p11;
    <type> p12;
typedef struct p4_pd_myprog_a3_action_spec {
} p4_pd_myprog_a3_action_spec_t;
typedef struct p4_pd_myprog_t1_match_spec {
    <type>   meta_f1;
    <type>   meta_f2;
    <type>   meta_f2_mask;
    uint8_t  h1_valid;
} p4_pd_myprog_t1_match_spec_t;
exact:
f
ternary:f and f_mask
lpm:
f and f_prefix_len
valid:
f_valid
range: f_min and f_max

---

## Page 70

Example API. Entry Add
myprog.p4
pd_myprog.h
97
action a1(p11, p12) {…}
action a2(p21, p22, p23) {…}
action a3() {…}
table t1 {
       h
    }
    actions {
       a1;
       a2;
       a3;
    }
}
p4_pd_status_t p4_pd_myprog_t1_entry_add_with_a1(
    p4_pd_target_t                        device_target,
    p4_pd_session_t                       session_handle,
          priority,
spec_t   *match_spec,
t,
le,
    p4_pd_priority_t                      priority,
    const p4_pd_myprog_t1_match_spec_t*match_spec,
    const p4_pd_myprog_a2_action_spec_t  *action_spec,
    p4_pd_entry_handle_t*entry_hdl);
p4_pd_status_t p4_pd_myprog_t1_entry_add_with_a3(
    p4_pd_target_t                        device_target,
    p4_pd_session_t                       session_handle,
    p4_pd_priority_t                      priority,
    const p4_pd_myprog_t1_match_spec_t   *match_spec,
    const p4_pd_myprog_a3_action_spec_t*action_spec,
    p4_pd_entry_handle_t                 *entry_hdl);

---

## Page 71

Example API. Entry Modify
myprog.p4
pd_myprog.h
98
action a1(p11, p12) {…}
action a2(p21, p22, p23) {…}
action a3() {…}
table t1 {
       h
    }
    actions {
       a1;
       a2;
       a3;
    }
}
p4_pd_status_t p4_pd_myprog_t1_entry_modify_with_a1(
    p4_pd_target_t                        device_target,
    p4_pd_session_t                       session_handle,
          entry_hdl,
_spec_t  *action_spec);
le,
    const p4_pd_myprog_a2_action_spec_t*action_spec);

p4_pd_status_t p4_pd_myprog_t1_entry_modify_with_a3(
    p4_pd_target_t                        device_target,
    p4_pd_session_t                       session_handle,
    p4_pd_entry_handle_t                  entry_hdl,
    const p4_pd_myprog_a3_action_spec_t  *action_spec);

---

## Page 72

Example API. Entry Delete and Lookup
myprog.p4
pd_myprog.h
99
action a1(p11, p12) {…}
action a2(p21, p22, p23) {…}
action a3() {…}
       m
       h
    }
    actions {
       a1;
       a2;
       a3;
    }
}
p4_pd_status_t p4_pd_myprog_t1_entry_delete(
    p4_pd_target_t                        device_target,
    p4_pd_session_t                       session_handle,
          entry_hdl);

---

## Page 73

Example API. Entry Get
myprog.p4
pd_myprog.h
100
action a1(p11, p12) {…}
action a2(p21, p22, p23) {…}
action a3() {…}
table t1 {
       h
    }
    actions {
       a1;
       a2;
       a3;
    }
}
typedef enum {
   P4_PD_MYPROG_ACTION_A1,
   P4_PD_MYPROG_ACTION_A2,
   p4_pd_myprog_a2_action_spec_t a2;
   . . .
} p4_pd_myprog_action_spec_t;
p4_pd_status_t p4_pd_myprog_t1_entry_get(
    p4_pd_target_t                        device_target,
    p4_pd_session_t                       session_handle,
    p4_pd_entry_handle_t                  entry_hdl,
    p4_pd_myprog_t1_match_spec_t         *match_spec,
    p4_pd_myprog_actions_t*action,
    p4_pd_myprog_action_spec_t           *action_spec_t);

---

## Page 74

Example API. Default Action APIs
myprog.p4
pd_myprog.h
101
action a1(p11, p12) {…}
action a2(p21, p22, p23) {…}
action a3() {…}
table t1 {
       h
    }
    actions {
       a1;
       a2;
       a3;
    }
}
p4_pd_status_t p4_pd_myprog_t1_set_default_action_a1(
    p4_pd_target_t                        device_target,
    p4_pd_session_t                       session_handle,
_spec_t  *action_spec);
;
p4_pd_status_t p4_pd_myprog_t1_set_default_action_a3(
    p4_pd_target_t                        device_target,
    p4_pd_session_t                       session_handle,
    const p4_pd_myprog_a3_action_spec_t*action_spec);
p4_pd_status_t p4_pd_myprog_t1_clear_default_action(
    p4_pd_target_t                        device_target,
    p4_pd_session_t                       session_handle);

---

## Page 75

Program-Dependent API style
myprog.p4
pd_myprog_style1.h
107
action a1(p11, p12) {…}
action a2(p21, p22, p23) {…}
action a3() {…}
    actions {
       a1;
       a2;
       a3;
    }
}
typedef enum {
    P4_PD_MYPROG_ACTION__A1,
    P4_PD_MYPROG_ACTION__A2,
    . . .
    P4_PD_MYPROG_ACTION__MAX
} p4_pd_myprog_actionid_t;
LE__MAX
_id_t;
typedef enum {
    P4_PD_MYPROG_FIELD__META_F1,
    P4_PD_MYPROG_FIELD__META_F2,
    P4_PD_MYPROG_FIELD__META_F2__MASK,
    P4_PD_MYPROG_FIELD__H1__VALID,
    P4_PD_MYPROG_FIELD__P11,
    P4_PD_MYPROG_FIELD__P12,
    P4_PD_MYPROG_FIELD__P22,
    P4_PD_MYPROG_FIELD__P23,
    . . .
    P4_MD_MYPROG_FIELD__MAX
} p4_pd_myprog_field_id_t;
Uniform structure and small number
of P4 objects allow APIs to be
generated automatically

---

## Page 76

github.com/p4lang
• switch
am
• Project summaries: link
114

---

## Page 77

BMv2 Primitives
• standard primitives <https://github.com/p4lang/p4->
hlir/blob/master/p4_hlir/frontend/primitives.json
• bmv2 specific primitives
lang/p4c-
b
115

---

## Page 78

Intrinsic Metadata, provided by BMv2 switch
• If one defines all these fields, all the simple_switch features will be supported, so it is recommended to define these fields in
every program (to avoid a headache).
header_type intrinsic_metadata_t {
    fields {
        ingress_global_timestamp : 48;  // ingress timestamp, in microseconds
        mcast_grp : 4;  // to be set in the ingre
        egress_rid : 4;  // replication id, availab
        mcast_hash : 16;  // unused

    }
}
metadata intrinsic_metadata_t intrinsic_metadata;
header_type queueing_metadata_t {
    fields {
        enq_timestamp : 48;  // in microseconds
        enq_qdepth : 16;
        deq_timedelta : 32;
        deq_qdepth : 16;
    }
}
metadata queueing_metadata_t queueing_metadata;
116

---

## Page 79

Thank you
117
