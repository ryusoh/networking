# osimodel-dist

---

## Page 1

c
⃝
Isaac D. Scherson
Distributed [Computing] Systems
Interconnection Networks, Communications and the OSI Model
- Part II
Isaac D. Scherson (aka The Schark c¨^ )
Dept. of Computer Science (Systems)
Bren School of Information and Computer Sciences
University of California, Irvine
Irvine, CA 92697-3425
isaac@ics.uci.edu
www.ics.uci.edu/˜isaac
www.ics.uci.edu/˜schark
CompSci-230, Winter 2019
1 / 26
c
⃝
Isaac D. Scherson
The OSI Reference Model
2 / 26

---

## Page 2

c
⃝
Isaac D. Scherson
Source
I Source: http://www.dcs.napier.ac.uk/~bill/
cisco_presentation/osi31.ppt
3 / 26
c
⃝
Isaac D. Scherson
Overview
I The need for standards
I Osi - organisation for standardisation
I The osi reference model
I A layered network model
I The seven osi reference model layers
I Summary
4 / 26

---

## Page 3

c
⃝
Isaac D. Scherson
The Need For Standards
I Over the past couple of decades many of the networks that were built
used different hardware and software implementations, as a result
they were incompatible and it became difﬁcult for networks using
different speciﬁcations to communicate with each other.
I To address the problem of networks being incompatible and unable to
communicate with each other, the International Organisation for
Standardisation (ISO) researched various network schemes.
I The ISO recognized there was a need to create a NETWORK MODEL
that would help vendors create interoperable network
implementations.
5 / 26
c
⃝
Isaac D. Scherson
ISO - Organisation For Standardisation
I The International Organisation for Standardisation (ISO) is an
International standards organisation responsible for a wide range of
standards, including many that are relevant to networking.
I In 1984 in order to aid network interconnection without necessarily
requiring complete redesign, the Open Systems Interconnection
(OSI) reference model was approved as an international standard for
communications architecture.
6 / 26

---

## Page 4

c
⃝
Isaac D. Scherson
The OSI Reference Model
I The model was developed by the International Organisation for
Standardisation (ISO) in 1984. It is now considered the primary
Architectural model for inter-computer communications.
I The Open Systems Interconnection (OSI) reference model is a
descriptive network scheme. It ensures greater compatibility and
interoperability between various types of network technologies.
I The OSI model describes how information or data makes its way
from application programmes (such as spreadsheets) through a
network medium (such as wire) to another application programme
located on another network.
I The OSI reference model divides the problem of moving information
between computers over a network medium into SEVEN smaller and
more manageable problems.
I This separation into smaller more manageable functions is known as
layering.
7 / 26
c
⃝
Isaac D. Scherson
A Layered Network Model
I The OSI Reference Model is composed of seven layers, each
specifying particular network functions.
I The process of breaking up the functions or tasks of networking into
layers reduces complexity.
I Each layer provides a service to the layer above it in the protocol
speciﬁcation.
I Each layer communicates with the same layer’s software or hardware
on other computers.
I The lower 4 layers (transport, network, data link and physical
—Layers 4, 3, 2, and 1) are concerned with the ﬂow of data from end
to end through the network.
I The upper four layers of the OSI model (application, presentation
and session—Layers 7, 6 and 5) are orientated more toward services
to the applications.
I Data is Encapsulated with the necessary protocol information as it
moves down the layers before network transit.
8 / 26

---

## Page 5

c
⃝
Isaac D. Scherson
The Seven OSI reference model layers
Application
7
Network Processes to
Applications
Presentation
6
Data Representation
Session
5
Interhost Communication
Transport
4
End-to-End Connections
Network
3
Address and Best Path
Data Link
2
Access to Media
Physical
1
Binary Transmission
9 / 26
c
⃝
Isaac D. Scherson
Layer 7: Application
I The application layer is the OSI layer that is closest to the user.
I It provides network services to the user’s applications.
I It differs from the other layers in that it does not provide services to
any other OSI layer, but rather, only to applications outside the OSI
model.
I Examples of such applications are spreadsheet programs, word
processing programs, and bank terminal programs.
I The application layer establishes the availability of intended
communication partners, synchronizes and establishes agreement on
procedures for error recovery and control of data integrity.
10 / 26

---

## Page 6

c
⃝
Isaac D. Scherson
Layer 6: Presentation
I The presentation layer ensures that the information that the
application layer of one system sends out is readable by the
application layer of another system.
I If necessary, the presentation layer translates between multiple data
formats by using a common format.
I Provides encryption and compression of data.
I Examples :- JPEG, MPEG, ASCII, EBCDIC, HTML.
11 / 26
c
⃝
Isaac D. Scherson
Layer 5: Session
I The session layer deﬁnes how to start, control and end conversations
(called sessions) between applications.
I This includes the control and management of multiple bi-directional
messages using dialogue control.
I It also synchronizes dialogue between two hosts’ presentation layers
and manages their data exchange.
I The session layer offers provisions for efﬁcient data transfer.
I Examples :- SQL, ASP(AppleTalk Session Protocol).
12 / 26

---

## Page 7

c
⃝
Isaac D. Scherson
Layer 4: Transport
I The transport layer regulates information ﬂow to ensure end-to-end
connectivity between host applications reliably and accurately.
I The transport layer segments data from the sending host’s system
and reassembles the data into a data stream on the receiving host’s
system.
I The boundary between the transport layer and the session layer can
be thought of as the boundary between application protocols and
data-ﬂow protocols. Whereas the application, presentation, and
session layers are concerned with application issues, the lower four
layers are concerned with data transport issues.
I Layer 4 protocols include TCP (Transmission Control Protocol) and
UDP (User Datagram Protocol).
13 / 26
c
⃝
Isaac D. Scherson
Layer 3: Network
I Deﬁnes end-to-end delivery of packets.
I Deﬁnes logical addressing so that any endpoint can be identiﬁed.
I Deﬁnes how routing works and how routes are learned so that the
packets can be delivered.
I The network layer also deﬁnes how to fragment a packet into smaller
packets to accommodate different media.
I Routers operate at Layer 3.
I Examples :- IP, IPX, AppleTalk.
14 / 26

---

## Page 8

c
⃝
Isaac D. Scherson
Layer 2: Data Link
I The data link layer provides access to the networking media and
physical transmission across the media and this enables the data to
locate its intended destination on a network.
I The data link layer provides reliable transit of data across a physical
link by using the Media Access Control (MAC) addresses.
I The data link layer uses the MAC address to deﬁne a hardware or
data link address in order for multiple stations to share the same
medium and still uniquely identify each other.
I Concerned with network topology, network access, error notiﬁcation,
ordered delivery of frames, and ﬂow control.
I Examples :- Ethernet, Frame Relay, FDDI.
15 / 26
c
⃝
Isaac D. Scherson
Layer 1: Physical
I The physical layer deals with the physical characteristics of the
transmission medium.
I It deﬁnes the electrical, mechanical, procedural, and functional
speciﬁcations for activating, maintaining, and deactivating the
physical link between end systems.
I Such characteristics as voltage levels, timing of voltage changes,
physical data rates, maximum transmission distances, physical
connectors, and other similar attributes are deﬁned by physical layer
speciﬁcations.
I Examples :- EIA/TIA-232, RJ45, NRZ.
16 / 26

---

## Page 9

c
⃝
Isaac D. Scherson
Summary
I There was no standard for networks in the early days and as a result
it was difﬁcult for networks to communicate with each other.
I The International Organisation for Standardisation (ISO) recognised
this. and researched various network schemes, and in 1984
introduced the Open Systems Interconnection (OSI) reference model.
I The OSI reference model has standards which ensure vendors
greater compatibility and interoperability between various types of
network technologies.
I The OSI reference model organizes network functions into seven
numbered layers.
I Each layer provides a service to the layer above it in the protocol
speciﬁcation and communicates with the same layer’s software or
hardware on other computers.
I Layers 1-4 are concerned with the ﬂow of data from end to end
through the network and Layers 5-7 are concerned with services to
the applications.
17 / 26
c
⃝
Isaac D. Scherson
The OSI Model
18 / 26

---

## Page 10

c
⃝
Isaac D. Scherson
Layer 1: Physical Layer
I Handles bit level communication across the network channel.
I Deﬁnes speciﬁcations for activating, maintaining and deactivating
the physical link between connecting network systems.
I Standards: RS232,T1, DSL, 10BASE-T
I Deﬁnes physical means of sending data over network devices
I Interfaces between network medium and devices
I Deﬁnes optical, electrical and mechanical characteristics
19 / 26
c
⃝
Isaac D. Scherson
Layer 2: Data Link Layer
I Controls how a computer gains access to the data and permission to
transmit it (MAC sub layer).
I Synchronizes frames, performs ﬂow control and error checking (LLC
sub layer).
I This layer has the important task of creating and managing what
frames are sent out on the network.
I Protocols: Ethernet, PPP, MPLS, ATM, Frame Relay
I Deﬁnes procedures for operating the communication links
I Frames packets
I Detects and corrects packets transmit errors
20 / 26

---

## Page 11

c
⃝
Isaac D. Scherson
Layer 3: Network Layer
I Provides means to establish, maintain and terminate network
connections.
I Main functions performed:
I Addressing and delivery of packets
I Routing – determining the path that the data should take.
I Provides an abstraction of the network to the transport layer, either
as a Virtual Circuit or a Datagram.
I IP lives in this layer!
I Other Protocols: ICMP, IPX, IPSec
I This layer handles the routing of the data
I Determines how data are transferred between network devices.
I Routes packets according to unique network device addresses (sending it
in the right direction to the right destination on outgoing transmissions
and receiving incoming transmissions at the packet level).
I Provides ﬂow and congestion control to prevent network resource
depletion.
I The network layer does routing and forwarding.
21 / 26
c
⃝
Isaac D. Scherson
Layer 4: Transport Layer
I Provides transparent transfer of data between end users
I Provides reliable and cost-effective transfer of data
I Connection-oriented (TCP)
I Connectionless (UDP)
I This layer manages the end-to-end and error-checking.
I Manages end-to-end message delivery in network
I Provides reliable and sequential packet delivery through error recovery
and ﬂow control mechanisms (for example, determining whether all
packets have arrived)
I Provides connectionless oriented packet delivery
I Ensures complete data transfer
22 / 26

---

## Page 12

c
⃝
Isaac D. Scherson
Layer 5: Session Layer (Enhanced Version Of The Transport Layer)
I Provides dialog control between end-user application processes
(duplex or half-duplex operations)
I Establishes checkpointing, adjournment, termination, and restart
procedures
I Sets up and tears down TCP/IP sessions
I This layer sets up, coordinates, and terminates conversations,
exchanges, and dialogs between the applications at each end.
I Manages user sessions and dialogues
I Controls establishment and termination of logic links between users
I Reports upper layer errors
23 / 26
c
⃝
Isaac D. Scherson
Layer 6: Presentation Layer
I Relieves the Application layer of concern regarding syntactical
differences in data representation within the end-user systems.
I Multipurpose Internet Mail Extensions (MIME)
I Data compression
I Encryption
I Character conversions
I This is a layer, usually part of an operating system, that converts
incoming and outgoing data from one presentation format to another
I Masks the differences of data formats between dissimilar systems
I Speciﬁes architecture-independent data transfer format
I Encodes and decodes data; Encrypts and decrypts data; Compresses and
decompresses data
24 / 26

---

## Page 13

c
⃝
Isaac D. Scherson
Layer 7: Application Layer
I Facilitates communication between software applications
I Mediates negotiations between applications:
I Formatting
I Security
I Synchronization
I HTTP – deﬁnes protocol for remote management and transfer
handling of Web pages (web browsers and web servers)
I FTP – deﬁnes protocol for transferring ﬁles between a client and
server machine
I This is the layer at which communication partners are identiﬁed,
quality of service is identiﬁed, user authentication and privacy are
considered, and any constraints on data syntax are identiﬁed.
I Deﬁnes interface to user processes for communication and data transfer
in network
I Provides standardized services such as virtual terminal, ﬁle and job
transfer and operations
25 / 26
c
⃝
Isaac D. Scherson
26 / 26
