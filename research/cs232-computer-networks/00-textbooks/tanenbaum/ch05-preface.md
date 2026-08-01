# ch05-preface

---

## Page 1

PREFACE
This book is now in its ﬁfth edition. Each edition has corresponded to a dif-
ferent phase in the way computer networks were used. When the ﬁrst edition ap-
peared in 1980, networks were an academic curiosity. When the second edition
appeared in 1988, networks were used by universities and large businesses. When
the third edition appeared in 1996, computer networks, especially the Internet, had
become a daily reality for millions of people. By the fourth edition, in 2003, wire-
less networks and mobile computers had become commonplace for accessing the
Web and the Internet. Now, in the ﬁfth edition, networks are about content dis-
tribution (especially videos using CDNs and peer-to-peer networks) and mobile
phones are small computers on the Internet.
New in the Fifth Edition
Among the many changes in this book, the most important one is the addition
of Prof. David J. Wetherall as a co-author. David brings a rich background in net-
working, having cut his teeth designing metropolitan-area networks more than 20
years ago. He has worked with the Internet and wireless networks ever since and
is a professor at the University of Washington, where he has been teaching and
doing research on computer networks and related topics for the past decade.
Of course, the book also has many changes to keep up with the: ever-changing
world of computer networks. Among these are revised and new material on
Wireless networks (802.12 and 802.16)
The 3G networks used by smart phones
RFID and sensor networks
Content distribution using CDNs
Peer-to-peer networks
Real-time media (from stored, streaming, and live sources)
Internet telephony (voice over IP)
Delay-tolerant networks
A more detailed chapter-by-chapter list follows.
xix

---

## Page 2

xx
PREFACE
Chapter 1 has the same introductory function as in the fourth edition, but the
contents have been revised and brought up to date. The Internet, mobile phone
networks, 802.11, and RFID and sensor networks are discussed as examples of
computer networks. Material on the original Ethernet—with its vampire taps—
has been removed, along with the material on ATM.
Chapter 2, which covers the physical layer, has expanded coverage of digital
modulation (including OFDM as widely used in wireless networks) and 3G net-
works (based on CDMA). New technologies are discussed, including Fiber to the
Home and power-line networking.
Chapter 3, on point-to-point links, has been improved in two ways. The mater-
ial on codes for error detection and correction has been updated, and also includes
a brief description of the modern codes that are important in practice (e.g., convo-
lutional and LDPC codes). The examples of protocols now use Packet over
SONET and ADSL. Sadly, the material on protocol veriﬁcation has been removed
as it is little used.
In Chapter 4, on the MAC sublayer, the principles are timeless but the tech-
nologies have changed. Sections on the example networks have been redone
accordingly, including gigabit Ethernet, 802.11, 802.16, Bluetooth, and RFID.
Also updated is the coverage of LAN switching, including VLANs.
Chapter 5, on the network layer, covers the same ground as in the fourth edi-
tion. The revisions have been to update material and add depth, particularly for
quality of service (relevant for real-time media) and internetworking. The sec-
tions on BGP, OSPF and CIDR have been expanded, as has the treatment of
multicast routing. Anycast routing is now included.
Chapter 6, on the transport layer, has had material added, revised, and re-
moved. New material describes delay-tolerant networking and congestion control
in general. The revised material updates and expands the coverage of TCP con-
gestion control. The material removed described connection-oriented network lay-
ers, something rarely seen any more.
Chapter 7, on applications, has also been updated and enlarged. While mater-
ial on DNS and email is similar to that in the fourth edition, in the past few years
there have been many developments in the use of the Web, streaming media and
content delivery. Accordingly, sections on the Web and streaming media have
been brought up to date. A new section covers content distribution, including
CDNs and peer-to-peer networks.
Chapter 8, on security, still covers both symmetric and public-key crypto-
graphy for conﬁdentiality and authenticity. Material on the techniques used in
practice, including ﬁrewalls and VPNs, has been updated, with new material on
802.11 security and Kerberos V5 added.
Chapter 9 contains a renewed list of suggested readings and a comprehensive
bibliography of over 300 citations to the current literature. More than half of
these are to papers and books written in 2000 or later, and the rest are citations to
classic papers.

---

## Page 3

PREFACE
xxi
List of Acronyms
Computer books are full of acronyms. This one is no exception. By the time
you are ﬁnished reading this one, the following should ring a bell: ADSL, AES,
AJAX, AODV, AP, ARP, ARQ, AS, BGP, BOC, CDMA, CDN, CGI, CIDR,
CRL, CSMA, CSS, DCT, DES, DHCP, DHT, DIFS, DMCA, DMT, DMZ, DNS,
DOCSIS, DOM, DSLAM, DTN, FCFS, FDD, FDDI, FDM, FEC, FIFO, FSK,
FTP, GPRS, GSM, HDTV, HFC, HMAC, HTTP, IAB, ICANN, ICMP, IDEA,
IETF, IMAP, IMP, IP, IPTV, IRTF, ISO, ISP, ITU, JPEG, JSP, JVM, LAN,
LATA, LEC, LEO, LLC, LSR, LTE, MAN, MFJ, MIME, MPEG, MPLS, MSC,
MTSO, MTU, NAP, NAT, NRZ, NSAP, OFDM, OSI, OSPF, PAWS, PCM, PGP,
PIM, PKI, POP, POTS, PPP, PSTN, QAM, QPSK, RED, RFC, RFID, RPC, RSA,
RTSP, SHA, SIP, SMTP, SNR, SOAP, SONET, SPE, SSL, TCP, TDD, TDM,
TSAP, UDP, UMTS, URL, VLAN, VSAT, WAN, WDM, and XML. But don’t
worry. Each will appear in boldface type and be carefully deﬁned before it is
used. As a fun test, see how many you can identify before reading the book, write
the number in the margin, then try again after reading the book.
How to Use the Book
To help instructors use this book as a text for courses ranging in length from
quarters to semesters, we have structured the chapters into core and optional ma-
terial. The sections marked with a ‘‘*’’ in the table of contents are the optional
ones. If a major section (e.g., 2.7) is so marked, all of its subsections are optional.
They provide material on network technologies that is useful but can be omitted
from a short course without loss of continuity. Of course, students should be
encouraged to read those sections as well, to the extent they have time, as all the
material is up to date and of value.
Instructors’ Resource Materials
The following protected instructors’ resource materials are available on the
publisher’s Web site at www.pearsonhighered.com/tanenbaum. For a username
and password, please contact your local Pearson representative.
Solutions manual
PowerPoint lecture slides
Students’ Resource Materials
Resources for students are available through the open-access Companion Web
site link on www.pearsonhighered.com/tanenbaum, including
Web resources, links to tutorials, organizations, FAQs, and more
Figures, tables, and programs from the book
Steganography demo
Protocol simulators

---

## Page 4

xxii
PREFACE
Acknowledgements
Many people helped us during the course of the ﬁfth edition. We would espe-
cially like to thank Emmanuel Agu (Worcester Polytechnic Institute), Yoris Au
(University of Texas at Antonio), Nikhil Bhargava (Aircom International, Inc.),
Michael Buettner (University of Washington), John Day (Boston University),
Kevin Fall (Intel Labs), Ronald Fulle (Rochester Institute of Technology), Ben
Greenstein (Intel Labs), Daniel Halperin (University of Washington), Bob Kinicki
(Worcester Polytechnic Institute), Tadayoshi Kohno (University of Washington),
Sarvish Kulkarni (Villanova University), Hank Levy (University of Washington),
Ratul Mahajan (Microsoft Research), Craig Partridge (BBN), Michael Piatek
(University of Washington), Joshua Smith (Intel Labs), Neil Spring (University of
Maryland), David Teneyuca (University of Texas at Antonio), Tammy VanDe-
grift (University of Portland), and Bo Yuan (Rochester Institute of Technology),
for providing ideas and feedback. Melody Kadenko and Julie Svendsen provided
administrative support to David.
Shivakant Mishra (University of Colorado at Boulder) and Paul Nagin (Chim-
borazo Publishing, Inc.) thought of many new and challenging end-of-chapter
problems. Our editor at Pearson, Tracy Dunkelberger, was her usual helpful self
in many ways large and small. Melinda Haggerty and Jeff Holcomb did a good
job of keeping things running smoothly. Steve Armstrong (LeTourneau Univer-
sity) prepared the PowerPoint slides. Stephen Turner (University of Michigan at
Flint) artfully revised the Web resources and the simulators that accompany the
text. Our copyeditor, Rachel Head, is an odd hybrid: she has the eye of an eagle
and the memory of an elephant. After reading all her corrections, both of us won-
dered how we ever made it past third grade.
Finally, we come to the most important people. Suzanne has been through
this 19 times now and still has endless patience and love. Barbara and Marvin
now know the difference between good textbooks and bad ones and are always an
inspiration to produce good ones. Daniel and Matilde are welcome additions to
our family. Aron is unlikely to read this book soon, but he likes the nice pictures
on page 866 (AST). Katrin and Lucy provided endless support and always man-
aged to keep a smile on my face. Thank you (DJW).
ANDREW S. TANENBAUM
DAVID J. WETHERALL
