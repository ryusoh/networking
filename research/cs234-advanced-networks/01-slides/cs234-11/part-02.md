# cs234-11 - Part 02 (Pages 15-28)

---

## Page 15

Alternative Switch Model
15
Packet
Queuing,
Replication &
Scheduling
• Symmetric Ingress and Egress Pipelines
• Fully and independently programmable parsers and deparsers
Ingress pipeline
Egress pipeline

---

## Page 16

Extended Pipeline Model
16
• “Non-standard” combination of programmable components
◦Two parsers can be very useful for tunnel processing
◦Many other combinations are also possible
• Specialized components available for advanced functionality
Programmable
Parser 1
Programmable
Deparser
Programmable
Parser 2

---

## Page 17

The New P4_16 Approach
17
Community-Developed
Term
Explanation
P4 Target
An embodiment of a specific hardware implementation
P4 Architecture
A specific set of P4-programmable components, externs, fixed components and their
interfaces available to the P4 programmer
P4 Platform
P4 Architecture implemented on a given P4 Target
P416
Language
P416Core
Library
Vendor-supplied
Extern
Libraries
Architecture
Definition

---

## Page 18

P4_16 Program Portability
18
P4 programs
C/C++ programs
Target-Independent
Generally portable across a wide variety of CPUs
Architecture-Dependent
Generally not portable when non-standard libraries or OS-specific
features are used
Targets can implement multiple architectures
Multiple Operating Systems can be implemented for a given CPU
Multiple targets can support the same
architecture
A portable Operating System or library can run on different CPUs
Community-Developed
P416
Language
P416Core
Library
Vendor-supplied
Extern
Libraries
Architecture
Definition

---

## Page 19

V1 Architecture
19
• Compatible with P4_14 architecture
• Is implemented on top of bmv2-simple_switch target
• Will be gradually introduced in the due course
Packet
Queuing,
Replication &
Scheduling
Programmable
Parser
Programmable
Deparser

---

## Page 20

P416 Language Elements
20
Architecture
Description
Extern Libraries
Programmable blocks
and their interfaces
Support for specialized
components
Data Types
Bistrings, headers,
structures, arrays
Controls
Tables, Actions,
control flow
statements
Parsers
Expressions
Basic operations
and operators
State machine,
bitfield extraction
We will quickly skim through them

---

## Page 21

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
21

---

## Page 22

Sample Header Definitions
22
Example: Declaring L2 headers
header ethernet_t {
bit<48>
dstAddr;
bit<48>
srcAddr;
bit<16>
etherType;
}
header vlan_tag_t {
bit<3>
pri;
bit<1>
cfi;
bit<12>
vid;
bit<16>
etherType;
}
struct my_headers_t {
ethernet_t
ethernet;
vlan_tag_t[2] vlan_tag;
}
• Basic Types
◦bit<n> – Unsigned integer (bitsrting) of length n
■bit is the same as bit<1>
◦int<n> – Signed integer of length n (>=2)
◦varbit<n> – Variable-length bitstring
• Derived Types
◦header – Ordered collection of members
■Byte-aligned
■Can be valid or invalid
■Can contain bit<n>, int<n> and varbit<n>
◦struct – Unordered collection of members
■No alignment restrictions
■Can contain any basic or derived types
◦Header Stacks -- arrays of headers

---

## Page 23

Using structs for Intrinsic
Metadata
23
typedef
bit<9>
port_id_t;
/*
Switch
port
*/
typedef
bit<16>
mgid_t;
/*
Multicast
Group
*/
typedef bit<5> qid_t; /* Queue ID
*/
struct parser_input_t {
port_id_t ingress_port;
bit<1>
resubmit_flag;
}
struct ingress_input_t {
portid_t
ingress_port;
timestamp_t
ingress_timestamp;
}
struct ingress_output_t {
portid_t
egress_port;
mgid_t
mcast_group;
bit<1>
drop_flag;
qid_t
egress_queue;
}
• Intrinsic Metadata is the data that a P4-
programmable components can use to
interface with the rest of the system
• These definitions come from the files,
supplied by the vendor
P4 Platform
parser_
input_t
ingress_
input_t
ingress_
output_t

---

## Page 24

The Need for Externs
24
• Most platforms contain specialized facilities
◦They differ from vendor to vendor
◦They can’t be expressed in the core language
■Specialized computations
◦They might have control-plane accessible state or configuration
• The language should stay the same
◦In P414 almost 1/3 of all the constructs were dedicated to specialized
processing
◦In P416 all specialized objects use the same interface
• Objects can be used even if their implementation is hidden
◦Through instantiation and method calling

---

## Page 25

Stateless and Stateful
Objects
25
• Stateless Objects: Reinitialized for each packet
◦Variables (metadata), packet headers, packet_in, packet_out
• Stateful Objects: Keep their state between packets
◦Tables
◦Externs
■P414: Counters, Meters, Registers, Parser Value Sets, Selectors, etc.
Object
Data Plane Interface
Control Plane Can
Read State
Modify/Write State
Read
Modify/Write
Table
apply()
---

Yes
Yes
Parser Value Set
get()
---

Yes
Yes
Counter
---

count()
Yes
Yes*
Meter
execute ()
Configuration Only
Configuration Only
Register
read()
write()
Yes
Yes

---

## Page 26

Meters in V1 Architecture
26
Definition
Usage
/*Definition in v1model.p4*/
enum MeterType {
packets,
bytes
}
extern meter {
meter(bit<32> instance_count, MeterType type);
void execute_meter<T>(in bit<32> index, out T result);
}
typedef bit<2> meter_color_t;
const
meter_color_t
METER_COLOR_GREEN
=

0;
const meter_color_t METER_COLOR_YELLOW = 1;
const meter_color_t METER_COLOR_RED = 2;
meter(1024, MeterType.bytes) acl_meter;
action color_my_packets(bit<10> index) {
acl_meter.execute_meter((bit<32>)index, meta.color);
}
table acl {
key = { . . .}
actions = { color_my_packets; . . .}
}
apply {
acl.apply();
if (meta.color == METER_COLOR_RED) {
mark_to_drop();
}
}
Color Coding:
1 – Green
2 – Yellow
3 -- Red
This is a template
definition. The method
will accept the
parameter of any type

---

## Page 27

Hashes and Random
Numbers – Stateless Externs
27
IPv4 Checksum Update
IPv4 Checksum Verification
control MyVerifyChecksum(in
my_headers_t
hdr,
inout my_metadata_t
meta)
{
Checksum16() ipv4_checksum;
bit<16>
ck;
apply {
if (hdr.ipv4.isValid()) {
ck = ipv4_checksum.get(
{
hdr.ipv4.version,
hdr.ipv4.diffserv,
hdr.ipv4.ihl,
hdr.ipv4.totalLen,
hdr.ipv4.identification, hdr.ipv4.flags,
hdr.ipv4.fragOffset,
hdr.ipv4.ttl,
hdr.ipv4.protocol,
hdr.ipv4.srcAddr,
hdr.ipv4.dstAddr
});
if (hdr.ipv4.hdrChecksum != ck) {
mark_to_drop();
}
}
}
}
control MyComputeChecksum(inout my_headers_t
hdr,
inout my_metadata_t meta)
{
Checksum16() ipv4_checksum;
apply {
if (hdr.ipv4.isValid()) {
hdr.ipv4.hdrChecksum = ipv4_checksum.get(
{
hdr.ipv4.version,
hdr.ipv4.ihl,
hdr.ipv4.diffserv,
hdr.ipv4.totalLen,
hdr.ipv4.identification, hdr.ipv4.flag,
hdr.ipv4.fragOffset,
hdr.ipv4.ttl,
hdr.ipv4.protocol,
hdr.ipv4.srcAddr,
hdr.ipv4.dstAddr
});
}
}
}

---

## Page 28

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
28
