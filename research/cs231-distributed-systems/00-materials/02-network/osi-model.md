# osi-model

---

## Page 1

8/13/2008
1
THE  OSI  REFERENCE  MODEL
LES MCLELLAN
DEAN WHITTAKER
SANDY WORKMAN
Source
http://www.dcs.napier.ac.uk/~bill/cisco_present
ation/osi31.ppt

---

## Page 2

8/13/2008
2
OVERVIEW
•
THE NEED FOR STANDARDS
•
OSI - ORGANISATION FOR STANDARDISATION
•
THE OSI REFERENCE MODEL
•
A LAYERED NETWORK MODEL
•
THE SEVEN OSI REFERENCE MODEL LAYERS
•
SUMMARY
THE NEED FOR STANDARDS
•
Over the past couple of decades many of the networks that were built
used different hardware and software implementations, as a result they
were incompatible and it became difficult for networks using different
specifications to communicate  with each other.
•
To address the problem of networks being incompatible and unable to
communicate with each other, the International Organisation for
Standardisation (ISO) researched various network schemes.
•
The ISO recognised there was a need to create a NETWORK MODEL that
would help vendors create interoperable network implementations.

---

## Page 3

8/13/2008
3
ISO - ORGANISATION FOR
STANDARDISATION
•
The International Organisation for Standardisation (ISO) is an
International standards organisation responsible for a wide range
of standards, including many that are relevant to networking.
•
In 1984 in order to aid network interconnection without
necessarily requiring complete redesign, the Open Systems
Interconnection (OSI) reference model was approved as an
international standard for communications architecture.
THE OSI REFERENCE MODEL
•
The model was developed by the International Organisation for
Standardisation (ISO) in 1984. It is now considered the primary
Architectural  model for inter-computer communications.
•
The Open Systems Interconnection (OSI) reference model is a
descriptive network scheme. It ensures greater compatibility and
interoperability between various types of network technologies.
•
The OSI model describes how information or data makes its way
from application programmes (such as spreadsheets) through a
network medium (such as wire) to another application programme
located on another network.
•
The OSI reference model divides the problem of moving
information between computers over a network medium into
SEVEN smaller and more manageable problems .
•
This separation into smaller more manageable functions is known
as layering.

---

## Page 4

8/13/2008
4
A LAYERED NETWORK MODEL
•
The OSI Reference Model is composed of seven layers, each specifying
particular network functions.
•
The process of breaking up the functions or tasks of networking into layers
reduces complexity.
•
Each layer provides a service to the layer above it in the protocol specification.
•
Each layer communicates with the same layer’s software or hardware on
other computers.
•
The lower 4 layers (transport, network, data link and physical —Layers 4, 3, 2,
and 1) are concerned with the flow of data from end to end through the
network.
•
The upper four layers of the OSI model (application, presentation and
session—Layers 7, 6 and 5) are orientated more toward services to the
applications.
•
Data is Encapsulated with the necessary protocol information as it moves
down the layers before network transit.
THE SEVEN OSI REFERENCE
MODEL LAYERS

---

## Page 5

8/13/2008
5
LAYER 7: APPLICATION
•
The application layer is the OSI layer that is closest to the user.
•
It provides network services to the user’s applications.
•
It differs from the other layers in that it does not provide services to any
other OSI layer, but rather, only to applications outside the OSI model.
•
Examples of such applications are spreadsheet programs, word
processing programs, and bank terminal programs.
•
The application layer establishes the availability of intended
communication partners, synchronizes and establishes agreement on
procedures for error recovery and control of data integrity.
LAYER 6: PRESENTATION
•
The presentation layer ensures that the information that the application
layer of one system sends out is readable by the application layer of
another system.
•
If necessary, the presentation layer translates between multiple data
formats by using a common format.
•
Provides encryption and compression of data.
•
Examples :- JPEG, MPEG, ASCII, EBCDIC, HTML.

---

## Page 6

8/13/2008
6
LAYER 5: SESSION
•
The session layer defines how to start, control and end conversations (called
sessions) between applications.
•
This includes the control and management of multiple bi-directional
messages using dialogue control.
•
It also synchronizes dialogue between two hosts' presentation layers and
manages their data exchange.
•
The session layer offers provisions for efficient data transfer.
•
Examples :- SQL, ASP(AppleTalk Session Protocol).
LAYER 4: TRANSPORT
•
The transport layer regulates information flow to ensure end-to-end
connectivity between host applications reliably and accurately.
•
The transport layer segments data from the sending host's system and
reassembles the data into a data stream on the receiving host's system.
•
The boundary between the transport layer and the session layer can be
thought of as the boundary between application protocols and data-flow
protocols. Whereas the application, presentation, and session layers are
concerned with application issues, the lower four layers are concerned
with data transport issues.
•
Layer 4 protocols include TCP (Transmission Control Protocol) and UDP
(User Datagram Protocol).

---

## Page 7

8/13/2008
7
LAYER 3: NETWORK
•
Defines end-to-end delivery of packets.
•
Defines logical addressing so that any endpoint can be identified.
•
Defines how routing works and how routes are learned so that the
packets can be delivered.
•
The network layer also defines how to fragment a packet into smaller
packets to accommodate different media.
•
Routers operate at Layer 3.
•
Examples :- IP, IPX, AppleTalk.
LAYER 2: DATA LINK
•
The data link layer provides access to the networking media and physical
transmission across the media and this enables the data to locate its
intended destination on a network.
•
The data link layer provides reliable transit of data across a physical link
by using the Media Access Control (MAC) addresses.
•
The data link layer uses the MAC address to define a hardware or data
link address in order for multiple stations to share the same medium and
still uniquely identify each other.
•
Concerned with network topology, network access, error notification,
ordered delivery of frames, and flow control.
•
Examples :- Ethernet, Frame Relay, FDDI.

---

## Page 8

8/13/2008
8
LAYER 1: PHYSICAL
•
The physical layer deals with the physical characteristics of the
transmission medium.
•
It defines the electrical, mechanical, procedural, and functional
specifications for activating, maintaining, and deactivating the physical
link between end systems.
•
Such characteristics as voltage levels, timing of voltage changes, physical
data rates, maximum transmission distances, physical connectors, and
other similar attributes are defined by physical layer specifications.
•
Examples :- EIA/TIA-232, RJ45, NRZ.
SUMMARY
•
There was no standard for networks in the early days and as a result it was
difficult for networks to communicate with each other.
•
The International Organisation for Standardisation (ISO) recognised this. and
researched various network schemes, and in 1984 introduced the Open
Systems Interconnection (OSI) reference model.
•
The OSI reference model has standards which ensure vendors greater
compatibility and interoperability between various types of network
technologies.
•
The OSI reference model organizes network functions into seven numbered
layers.
•
Each layer provides a service to the layer above it in the protocol specification
and communicates with the same layer’s software or hardware on other
computers.
•
Layers 1-4 are concerned with the flow of data from end to end through the
network and Layers 5-7 are concerned with services to the applications.

---

## Page 9

8/13/2008
9
ICS 242 OSI Model
18

---

## Page 10

8/13/2008
10
ICS 242 OSI Model
19
Layer 1: Physical Layer
• Handles bit level communication across the
network channel.
• Defines specifications for activating,
maintaining and deactivating the physical link
between connecting network systems.
• Standards: RS232,T1, DSL, 10BASE-T
20
Layer 1: The physical layer
– Defines physical means of sending data over
network devices
– Interfaces between network medium and devices
– Defines optical, electrical and mechanical
characteristics

---

## Page 11

8/13/2008
11
ICS 242 OSI Model
21
Layer 2: Data Link Layer
• Controls how a computer gains access to the data
and permission to transmit it (MAC sub layer).
• Synchronizes frames, performs flow control and error
checking (LLC sub layer).
• This layer has the important task of creating and
managing what frames are sent out on the network.
• Protocols: Ethernet, PPP, MPLS, ATM, Frame Relay
22
Layer 2: The data-link layer
– Defines procedures for operating the
communication links
– Frames packets
– Detects and corrects packets transmit errors

---

## Page 12

8/13/2008
12
ICS 242 OSI Model
23
Layer 3: Network Layer
• Provides means to establish, maintain and terminate network
connections.
• Main functions performed:
– Addressing and delivery of packets
– Routing – determining the path that the data should take.
• Provides an abstraction of the network to the transport layer
– either as a Virtual Circuit or a Datagram.
• IP lives in this layer!
• Other Protocols: ICMP, IPX, IPSec
24
Layer 3: The network layer
• This layer handles the routing of the data
– Determines how data are transferred between network
devices
– Routes packets according to unique network device
addresses
• (sending it in the right direction to the right destination on
outgoing transmissions and receiving incoming transmissions at
the packet level).
– Provides flow and congestion control to prevent network
resource depletion
– The network layer does routing and forwarding.

---

## Page 13

8/13/2008
13
ICS 242 OSI Model
25
Layer 4: Transport Layer
• Provides transparent transfer of data between
end users
• Provides reliable and cost-effective transfer of
data
– Connection-oriented (TCP)
– Connectionless (UDP)
26
Layer 4: The transport layer
• This layer manages the end-to-end and error-
checking.
– Manages end-to-end message delivery in network
– Provides reliable and sequential packet delivery through
error recovery and flow control mechanisms
• control (for example, determining whether all packets have
arrived)
– Provides connectionless oriented packet delivery
– Ensures complete data transfer

---

## Page 14

8/13/2008
14
ICS 242 OSI Model
27
Layer 5: Session Layer (enhanced version of
the transport layer)
• Provides dialog control between end-user
application processes (duplex or half-duplex
operations)
• Establishes checkpointing, adjournment,
termination, and restart procedures
• Sets up and tears down TCP/IP sessions
28
Layer 5: The session layer
• This layer sets up, coordinates, and terminates
conversations, exchanges, and dialogs
between the applications at each end.
– Manages user sessions and dialogues
– Controls establishment and termination of logic
links between users
– Reports upper layer errors

---

## Page 15

8/13/2008
15
ICS 242 OSI Model
29
Layer 6: Presentation Layer
• Relieves the Application layer of concern
regarding syntactical differences in data
representation within the end-user systems
– Multipurpose Internet Mail Extensions (MIME)
– Data compression
– Encryption
– Character conversions
30
Layer 6: The presentation layer
• This is a layer, usually part of an operating system,
that converts incoming and outgoing data from one
presentation format to another
– Masks the differences of data formats between dissimilar
systems
– Specifies architecture-independent data transfer format
– Encodes and decodes data; Encrypts and decrypts data;
Compresses and decompresses data

---

## Page 16

8/13/2008
16
ICS 242 OSI Model
31
Layer 7: Application Layer
• Facilitates communication between software
applications
• Mediates negotiations between applications:
– Formatting
– Security
– Synchronization
• HTTP – defines protocol for remote management and
transfer handling of Web pages (web browsers and
web servers)
• FTP – defines protocol for transferring files between
a client and server machine
32
Layer 7: The application layer
• This is the layer at which communication
partners are identified, quality of service is
identified, user authentication and privacy are
considered, and any constraints on data
syntax are identified.
– Defines interface to user processes for
communication and data transfer in network
– Provides standardized services such as virtual
terminal, file and job transfer and operations

---

## Page 17

8/13/2008
17
ICS 242 OSI Model
33
