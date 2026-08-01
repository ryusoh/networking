# ch03-copyright-page

---

## Page 1

Vice President and Editorial Director, ECS:
Marcia Horton
Editor in Chief: Michael Hirsch
Editorial Assistant: Emma Snider
Vice President Marketing: Patrice Jones
Marketing Manager: Yez Alayan
Marketing Coordinator: Kathryn Ferranti
Vice President and Director of Production:
Vince O’Brien
Managing Editor: Jeff Holcomb
Senior Production Project Manager:
Marilyn Lloyd
Manufacturing Manager: Nick Sklitsis
Operations Specialist: Lisa McDowell
Art Director, Cover: Anthony Gemmellaro
Art Coordinator: Janet Theurer/
Theurer Briggs Design
Art Studio: Patrice Rossi Calkin/
Rossi Illustration and Design
Cover Designer: Liz Harasymcuk
Text Designer: Joyce Cosentino Wells
Cover Image: ©Fancy/Alamy
Media Editor: Dan Sandin
Full-Service Vendor: PreMediaGlobal
Senior Project Manager: Andrea Stefanowicz
Printer/Binder: Edwards Brothers
Cover Printer: Lehigh-Phoenix Color
Copyright © 2013, 2010, 2008, 2005, 2003 by Pearson Education, Inc., publishing as
Addison-Wesley. All rights reserved. Manufactured in the United States of America. This
publication is protected by Copyright, and permission should be obtained from the pub-
lisher prior to any prohibited reproduction, storage in a retrieval system, or transmission
in any form or by any means, electronic, mechanical, photocopying, recording, or like-
wise. To obtain permission(s) to use material from this work, please submit a written
request to Pearson Education, Inc., Permissions Department, One Lake Street, Upper
Saddle River, New Jersey 07458, or you may fax your request to 201-236-3290.
Many of the designations by manufacturers and sellers to distinguish their products are
claimed as trademarks. Where those designations appear in this book, and the publisher was
aware of a trademark claim, the designations have been printed in initial caps or all caps.
Library of Congress Cataloging-in-Publication Data
Kurose, James F.
Computer networking : a top-down approach / James F. Kurose, Keith W. Ross.—6th ed.
p. cm.
Includes bibliographical references and index.
ISBN-13: 978-0-13-285620-1
ISBN-10: 0-13-285620-4
1. Internet. 2. Computer networks. I. Ross, Keith W., 1956- II. Title.
TK5105.875.I57K88 2012
004.6—dc23
2011048215
10  9  8  7  6  5  4  3  2  1
ISBN-13: 978-0-13-285620-1
ISBN-10:
0-13-285620-4
This book was composed in Quark. Basal font is Times. Display font is Berkeley.

---

## Page 2

iii
About the Authors
Jim Kurose
Jim Kurose is a Distinguished University Professor of Computer Science at the
University of Massachusetts, Amherst.
Dr. Kurose has received a number of recognitions for his educational
activities including Outstanding Teacher Awards from the National
Technological University (eight times), the University of Massachusetts, and
the Northeast Association of Graduate Schools. He received the IEEE Taylor
Booth Education Medal and was recognized for his leadership of
Massachusetts’ Commonwealth Information Technology Initiative. He has
been the recipient of a GE Fellowship, an IBM Faculty Development Award,
and a Lilly Teaching Fellowship.
Dr. Kurose is a former Editor-in-Chief of IEEE Transactions on
Communications and of IEEE/ACM Transactions on Networking. He has
been active in the program committees for IEEE Infocom, ACM SIGCOMM,
ACM Internet Measurement Conference, and ACM SIGMETRICS for a
number of years and has served as Technical Program Co-Chair for those
conferences. He is a Fellow of the IEEE and the ACM. His research interests
include network protocols and architecture, network measurement, sensor
networks, multimedia communication, and modeling and performance
evaluation. He holds a PhD in Computer Science from Columbia University.
Keith Ross
Keith Ross is the Leonard J. Shustek Chair Professor and Head of the Computer
Science Department at Polytechnic Institute of NYU. Before joining NYU-Poly in
2003, he was a professor at the University of Pennsylvania (13 years) and a
professor at Eurecom Institute (5 years). He received a B.S.E.E from Tufts
University, a M.S.E.E. from Columbia University, and a Ph.D. in Computer and
Control Engineering from The University of Michigan. Keith Ross is also the
founder and original CEO of Wimba, which develops online multimedia
applications for e-learning and was acquired by Blackboard in 2010.
Professor Ross’s research interests are in security and privacy, social networks,
peer-to-peer networking, Internet measurement, video streaming, content distribution
networks, and stochastic modeling. He is an IEEE Fellow, recipient of the Infocom
2009 Best Paper Award, and recipient of 2011 and 2008 Best Paper Awards
for Multimedia Communications (awarded by IEEE Communications Society). He
has served on numerous journal editorial boards and conference program commit-
tees, including IEEE/ACM Transactions on Networking, ACM SIGCOMM, ACM
CoNext, and ACM Internet Measurement Conference. He also has served as an
advisor to the Federal Trade Commission on P2P file sharing.

---

## Page 3

This page intentionally left blank

---

## Page 4

To Julie and our three precious
ones—Chris, Charlie, and Nina
JFK
A big THANKS to my professors, colleagues,
and students all over the world.
KWR

---

## Page 5

This page intentionally left blank

---

## Page 6

Preface
Welcome to the sixth edition of Computer Networking: A Top-Down Approach. Since
the publication of the first edition 12 years ago, our book has been adopted for use at
many hundreds of colleges and universities, translated into 14 languages, and used
by over one hundred thousand students and practitioners worldwide. We’ve heard
from many of these readers and have been overwhelmed by the positive response.
What’s New in the Sixth Edition?
We think one important reason for this success has been that our book continues to offer
a fresh and timely approach to computer networking instruction. We’ve made changes
in this sixth edition, but we’ve also kept unchanged what we believe (and the instruc-
tors and students who have used our book have confirmed) to be the most important
aspects of this book: its top-down approach, its focus on the Internet and a modern
treatment of computer networking, its attention to both principles and practice, and its
accessible style and approach toward learning about computer networking. Neverthe-
less, the sixth edition has been revised and updated substantially:
•
The Companion Web site has been significantly expanded and enriched to
include VideoNotes and interactive exercises, as discussed later in this Preface.
•
In Chapter 1, the treatment of access networks has been modernized, and the
description of the Internet ISP ecosystem has been substantially revised, account-
ing for the recent emergence of content provider networks, such as Google’s. The
presentation of packet switching and circuit switching has also been reorganized,
providing a more topical rather than historical orientation.
•
In Chapter 2, Python has replaced Java for the presentation of socket program-
ming. While still explicitly exposing the key ideas behind the socket API, Python
code is easier to understand for the novice programmer. Moreover, unlike Java,
Python provides access to raw sockets, enabling students to build a larger variety
of network applications. Java-based socket programming labs have been
replaced with corresponding Python labs, and a new Python-based ICMP Ping
lab has been added. As always, when material is retired from the book, such as
Java-based socket programming material, it remains available on the book’s
Companion Web site (see following text).
•
In Chapter 3, the presentation of one of the reliable data transfer protocols has
been simplified and a new sidebar on TCP splitting, commonly used to optimize
the performance of cloud services, has been added.
•
In Chapter 4, the section on router architectures has been significantly updated,
reflecting recent developments and practices in the field. Several new integrative
sidebars involving DNS, BGP, and OSPF are included.

---

## Page 7

•
Chapter 5 has been reorganized and streamlined, accounting for the ubiquity of
switched Ethernet in local area networks and the consequent increased use of
Ethernet in point-to-point scenarios. Also, a new section on data center network-
ing has been added.
•
Chapter 6 has been updated to reflect recent advances in wireless networks, par-
ticularly cellular data networks and 4G services and architecture.
•
Chapter 7, which focuses on multimedia networking, has gone through a major
revision. The chapter now includes an in-depth discussion of streaming video,
including adaptive streaming, and an entirely new and modernized discussion of
CDNs. A newly added section describes the Netflix, YouTube, and Kankan video
streaming systems. The material that has been removed to make way for these
new topics is still available on the Companion Web site.
•
Chapter 8 now contains an expanded discussion on endpoint authentication.
•
Significant new material involving end-of-chapter problems has been added. As
with all previous editions, homework problems have been revised, added, and
removed.
Audience
This textbook is for a first course on computer networking. It can be used in both
computer science and electrical engineering departments. In terms of programming
languages, the book assumes only that the student has experience with C, C++, Java,
or Python (and even then only in a few places). Although this book is more precise
and analytical than many other introductory computer networking texts, it rarely
uses any mathematical concepts that are not taught in high school. We have made a
deliberate effort to avoid using any advanced calculus, probability, or stochastic
process concepts (although we’ve included some homework problems for students
with this advanced background). The book is therefore appropriate for undergradu-
ate courses and for first-year graduate courses. It should also be useful to practition-
ers in the telecommunications industry.
What Is Unique about This Textbook?
The subject of computer networking is enormously complex, involving many
concepts, protocols, and technologies that are woven together in an intricate
manner. To cope with this scope and complexity, many computer networking texts
are often organized around the “layers” of a network architecture. With a layered
organization, students can see through the complexity of computer networking—
they learn about the distinct concepts and protocols in one part of the architecture
while seeing the big picture of how all parts fit together. From a pedagogical
perspective, our personal experience has been that such a layered approach
viii
Preface

---

## Page 8

Preface
ix
indeed works well. Nevertheless, we have found that the traditional approach of
teaching—bottom up; that is, from the physical layer towards the application
layer—is not the best approach for a modern course on computer networking.
A Top-Down Approach
Our book broke new ground 12 years ago by treating networking in a top-down
manner—that is, by beginning at the application layer and working its way down
toward the physical layer. The feedback we received from teachers and students
alike have confirmed that this top-down approach has many advantages and does
indeed work well pedagogically. First, it places emphasis on the application layer
(a “high growth area” in networking). Indeed, many of the recent revolutions in
computer networking—including the Web, peer-to-peer file sharing, and media
streaming—have taken place at the application layer. An early emphasis on application-
layer issues differs from the approaches taken in most other texts, which have only a
small amount of material on network applications, their requirements, application-layer
paradigms (e.g., client-server and peer-to-peer), and application programming inter-
faces. Second, our experience as instructors (and that of many instructors who have
used this text) has been that teaching networking applications near the beginning of
the course is a powerful motivational tool. Students are thrilled to learn about how
networking applications work—applications such as e-mail and the Web, which most
students use on a daily basis. Once a student understands the applications, the student
can then understand the network services needed to support these applications. The
student can then, in turn, examine the various ways in which such services might be
provided and implemented in the lower layers. Covering applications early thus pro-
vides motivation for the remainder of the text.
Third, a top-down approach enables instructors to introduce network appli-
cation development at an early stage. Students not only see how popular applica-
tions and protocols work, but also learn how easy it is to create their own
network applications and application-level protocols. With the top-down
approach, students get early exposure to the notions of socket programming, serv-
ice models, and protocols—important concepts that resurface in all subsequent
layers. By providing socket programming examples in Python, we highlight the
central ideas without confusing students with complex code. Undergraduates in
electrical engineering and computer science should not have difficulty following
the Python code.
An Internet Focus
Although we dropped the phrase “Featuring the Internet” from the title of this book
with the fourth edition, this doesn’t mean that we dropped our focus on the Internet!
Indeed, nothing could be further from the case! Instead, since the Internet has
become so pervasive, we felt that any networking textbook must have a significant

---

## Page 9

focus on the Internet, and thus this phrase was somewhat unnecessary. We continue
to use the Internet’s architecture and protocols as primary vehicles for studying fun-
damental computer networking concepts. Of course, we also include concepts and
protocols from other network architectures. But the spotlight is clearly on the Inter-
net, a fact reflected in our organizing the book around the Internet’s five-layer archi-
tecture: the application, transport, network, link, and physical layers.
Another benefit of spotlighting the Internet is that most computer science and
electrical engineering students are eager to learn about the Internet and its protocols.
They know that the Internet has been a revolutionary and disruptive technology and
can see that it is profoundly changing our world. Given the enormous relevance of
the Internet, students are naturally curious about what is “under the hood.” Thus, it
is easy for an instructor to get students excited about basic principles when using the
Internet as the guiding focus.
Teaching Networking Principles
Two of the unique features of the book—its top-down approach and its focus on the
Internet—have appeared in the titles of our book. If we could have squeezed a third
phrase into the subtitle, it would have contained the word principles. The field of
networking is now mature enough that a number of fundamentally important issues
can be identified. For example, in the transport layer, the fundamental issues include
reliable communication over an unreliable network layer, connection establishment/
teardown and handshaking, congestion and flow control, and multiplexing. Two fun-
damentally important network-layer issues are determining “good” paths between
two routers and interconnecting a large number of heterogeneous networks. In the
link layer, a fundamental problem is sharing a multiple access channel. In network
security, techniques for providing confidentiality, authentication, and message
integrity are all based on cryptographic fundamentals. This text identifies fundamen-
tal networking issues and studies approaches towards addressing these issues. The
student learning these principles will gain knowledge with a long “shelf life”—long
after today’s network standards and protocols have become obsolete, the principles
they embody will remain important and relevant. We believe that the combination of
using the Internet to get the student’s foot in the door and then emphasizing funda-
mental issues and solution approaches will allow the student to quickly understand
just about any networking technology.
The Web Site
Each new copy of this textbook includes six months of access to a Companion Web site
for all book readers at http://www.pearsonhighered.com/kurose-ross, which includes:
•
Interactive learning material. An important new component of the sixth edition
is the significantly expanded online and interactive learning material. The
book’s Companion Web site now contains VideoNotes—video presentations of
x
Preface

---

## Page 10

Preface
xi
important topics thoughout the book done by the authors, as well as walk-
throughs of solutions to problems similar to those at the end of the chapter.
We’ve also added Interactive Exercises that can create (and present solutions
for) problems similar to selected end-of-chapter problems. Since students can
generate (and view solutions for) an unlimited number of similar problem
instances, they can work until the material is truly mastered. We’ve seeded the
Web site with VideoNotes and online problems for chapters 1 through 5 and will
continue to actively add and update this material over time. As in earlier edi-
tions, the Web site contains the interactive Java applets that animate many key
networking concepts. The site also has interactive quizzes that permit students
to check their basic understanding of the subject matter. Professors can integrate
these interactive features into their lectures or use them as mini labs.
•
Additional technical material. As we have added new material in each edition of
our book, we’ve had to remove coverage of some existing topics to keep the
book at manageable length. For example, to make room for the new material in
this edition, we’ve removed material on ATM networks and the RTSP protocol
for multimedia. Material that appeared in earlier editions of the text is still of
interest, and can be found on the book’s Web site.
•
Programming assignments. The Web site also provides a number of detailed
programming assignments, which include building a multithreaded Web
server, building an e-mail client with a GUI interface, programming the sender
and receiver sides of a reliable data transport protocol, programming a distrib-
uted routing algorithm, and more.
•
Wireshark labs. One’s understanding of network protocols can be greatly deep-
ened by seeing them in action. The Web site provides numerous Wireshark
assignments that enable students to actually observe the sequence of messages
exchanged between two protocol entities. The Web site includes separate Wire-
shark labs on HTTP, DNS, TCP, UDP, IP, ICMP, Ethernet, ARP, WiFi, SSL, and
on tracing all protocols involved in satisfying a request to fetch a web page.
We’ll continue to add new labs over time.
Pedagogical Features
We have each been teaching computer networking for more than 20 years.
Together, we bring more than 50 years of teaching experience to this text, during
which time we have taught many thousands of students. We have also been active
researchers in computer networking during this time. (In fact, Jim and Keith first
met each other as master’s students in a computer networking course taught by
Mischa Schwartz in 1979 at Columbia University.) We think all this gives us a
good perspective on where networking has been and where it is likely to go in the
future. Nevertheless, we have resisted temptations to bias the material in this book

---

## Page 11

towards our own pet research projects. We figure you can visit our personal Web
sites if you are interested in our research. Thus, this book is about modern com-
puter networking—it is about contemporary protocols and technologies as well as
the underlying principles behind these protocols and technologies. We also believe
that learning (and teaching!) about networking can be fun. A sense of humor, use
of analogies, and real-world examples in this book will hopefully make this mate-
rial more fun.
Supplements for Instructors
We provide a complete supplements package to aid instructors in teaching this course.
This material can be accessed from Pearson’s Instructor Resource Center
(http://www.pearsonhighered.com/irc). Visit the Instructor Resource Center or send
e-mail to computing@aw.com for information about accessing these instructor’s
supplements.
•
PowerPoint® slides. We provide PowerPoint slides for all nine chapters. The
slides have been completely updated with this sixth edition. The slides cover
each chapter in detail. They use graphics and animations (rather than relying
only on monotonous text bullets) to make the slides interesting and visually
appealing. We provide the original PowerPoint slides so you can customize them
to best suit your own teaching needs. Some of these slides have been contributed
by other instructors who have taught from our book.
•
Homework solutions. We provide a solutions manual for the homework problems
in the text, programming assignments, and Wireshark labs. As noted earlier, we’ve
introduced many new homework problems in the first five chapters of the book.
Chapter Dependencies
The first chapter of this text presents a self-contained overview of computer net-
working. Introducing many key concepts and terminology, this chapter sets the stage
for the rest of the book. All of the other chapters directly depend on this first chap-
ter. After completing Chapter 1, we recommend instructors cover Chapters 2
through 5 in sequence, following our top-down philosophy. Each of these five chap-
ters leverages material from the preceding chapters. After completing the first five
chapters, the instructor has quite a bit of flexibility. There are no interdependencies
among the last four chapters, so they can be taught in any order. However, each of
the last four chapters depends on the material in the first five chapters. Many
instructors first teach the first five chapters and then teach one of the last four chap-
ters for “dessert.”
xii
Preface

---

## Page 12

Preface
xiii
One Final Note: We’d Love to Hear from You
We encourage students and instructors to e-mail us with any comments they might
have about our book. It’s been wonderful for us to hear from so many instructors
and students from around the world about our first four editions. We’ve incorporated
many of these suggestions into later editions of the book. We also encourage instructors
to send us new homework problems (and solutions) that would complement the
current homework problems. We’ll post these on the instructor-only portion of the
Web site. We also encourage instructors and students to create new Java applets that
illustrate the concepts and protocols in this book. If you have an applet that you
think would be appropriate for this text, please submit it to us. If the applet (including
notation and terminology) is appropriate, we’ll be happy to include it on the text’s
Web site, with an appropriate reference to the applet’s authors.
So, as the saying goes, “Keep those cards and letters coming!” Seriously,
please do continue to send us interesting URLs, point out typos, disagree with
any of our claims, and tell us what works and what doesn’t work.  Tell us what
you think should or shouldn’t be included in the next edition. Send your e-mail
to kurose@cs.umass.edu and ross@poly.edu.
Acknowledgments
Since we began writing this book in 1996, many people have given us invaluable
help and have been influential in shaping our thoughts on how to best organize and
teach a networking course. We want to say A BIG THANKS to everyone who has
helped us from the earliest first drafts of this book, up to this fifth edition. We are also
very thankful to the many hundreds of readers from around the world—students, fac-
ulty, practitioners—who have sent us thoughts and comments on earlier editions of
the book and suggestions for future editions of the book. Special thanks go out to:
Al Aho (Columbia University)
Hisham Al-Mubaid (University of Houston-Clear Lake)
Pratima Akkunoor (Arizona State University)
Paul Amer (University of Delaware)
Shamiul Azom (Arizona State University)
Lichun Bao (University of California at Irvine)
Paul Barford (University of Wisconsin)
Bobby Bhattacharjee (University of Maryland)
Steven Bellovin (Columbia University)
Pravin Bhagwat (Wibhu)
Supratik Bhattacharyya (previously at Sprint)
Ernst Biersack (Eurécom Institute)

---

## Page 13

Shahid Bokhari (University of Engineering & Technology, Lahore)
Jean Bolot (Technicolor Research)
Daniel Brushteyn (former University of Pennsylvania student)
Ken Calvert (University of Kentucky)
Evandro Cantu (Federal University of Santa Catarina)
Jeff Case (SNMP Research International)
Jeff Chaltas (Sprint)
Vinton Cerf (Google)
Byung Kyu Choi (Michigan Technological University)
Bram Cohen (BitTorrent, Inc.)
Constantine Coutras (Pace University)
John Daigle (University of Mississippi)
Edmundo A. de Souza e Silva (Federal University of Rio de Janeiro)
Philippe Decuetos (Eurécom Institute)
Christophe Diot (Technicolor Research)
Prithula Dhunghel (Akamai)
Deborah Estrin (University of California, Los Angeles)
Michalis Faloutsos (University of California at Riverside)
Wu-chi Feng (Oregon Graduate Institute)
Sally Floyd (ICIR, University of California at Berkeley)
Paul Francis (Max Planck Institute)
Lixin Gao (University of Massachusetts)
JJ Garcia-Luna-Aceves (University of California at Santa Cruz)
Mario Gerla (University of California at Los Angeles)
David Goodman (NYU-Poly)
Yang Guo (Alcatel/Lucent Bell Labs)
Tim Griffin (Cambridge University)
Max Hailperin (Gustavus Adolphus College)
Bruce Harvey (Florida A&M University, Florida State University)
Carl Hauser (Washington State University)
Rachelle Heller (George Washington University)
Phillipp Hoschka (INRIA/W3C)
Wen Hsin (Park University)
Albert Huang (former University of Pennsylvania student)
Cheng Huang (Microsoft Research)
Esther A. Hughes (Virginia Commonwealth University)
Van Jacobson (Xerox PARC)
Pinak Jain (former NYU-Poly student)
Jobin James (University of California at Riverside)
Sugih Jamin (University of Michigan)
Shivkumar Kalyanaraman (IBM Research, India)
Jussi Kangasharju (University of Helsinki)
Sneha Kasera (University of Utah)
Parviz Kermani (formerly of IBM Research)
xiv
Preface

---

## Page 14

Preface
xv
Hyojin Kim (former University of Pennsylvania student)
Leonard Kleinrock (University of California at Los Angeles)
David Kotz (Dartmouth College)
Beshan Kulapala (Arizona State University)
Rakesh Kumar (Bloomberg)
Miguel A. Labrador (University of South Florida)
Simon Lam (University of Texas)
Steve Lai (Ohio State University)
Tom LaPorta (Penn State University)
Tim-Berners Lee (World Wide Web Consortium)
Arnaud Legout (INRIA)
Lee Leitner (Drexel University)
Brian Levine (University of Massachusetts)
Chunchun Li (former NYU-Poly student)
Yong Liu (NYU-Poly)
William Liang (former University of Pennsylvania student)
Willis Marti (Texas A&M University)
Nick McKeown (Stanford University)
Josh McKinzie (Park University)
Deep Medhi (University of Missouri, Kansas City)
Bob Metcalfe (International Data Group)
Sue Moon (KAIST)
Jenni Moyer (Comcast)
Erich Nahum (IBM Research)
Christos Papadopoulos (Colorado Sate University)
Craig Partridge (BBN Technologies)
Radia Perlman (Intel)
Jitendra Padhye (Microsoft Research)
Vern Paxson (University of California at Berkeley)
Kevin Phillips (Sprint)
George Polyzos (Athens University of Economics and Business)
Sriram Rajagopalan (Arizona State University)
Ramachandran Ramjee (Microsoft Research)
Ken Reek (Rochester Institute of Technology)
Martin Reisslein (Arizona State University)
Jennifer Rexford (Princeton University)
Leon Reznik (Rochester Institute of Technology)
Pablo Rodrigez (Telefonica)
Sumit Roy (University of Washington)
Avi Rubin (Johns Hopkins University)
Dan Rubenstein (Columbia University)
Douglas Salane (John Jay College)
Despina Saparilla (Cisco Systems)
John Schanz (Comcast)

---

## Page 15

Henning Schulzrinne (Columbia University)
Mischa Schwartz (Columbia University)
Ardash Sethi (University of Delaware)
Harish Sethu (Drexel University)
K. Sam Shanmugan (University of Kansas)
Prashant Shenoy (University of Massachusetts)
Clay Shields (Georgetown University)
Subin Shrestra (University of Pennsylvania)
Bojie Shu (former NYU-Poly student)
Mihail L. Sichitiu (NC State University)
Peter Steenkiste (Carnegie Mellon University)
Tatsuya Suda (University of California at Irvine)
Kin Sun Tam (State University of New York at Albany)
Don Towsley (University of Massachusetts)
David Turner (California State University, San Bernardino)
Nitin Vaidya (University of Illinois)
Michele Weigle (Clemson University)
David Wetherall (University of Washington)
Ira Winston (University of Pennsylvania)
Di Wu (Sun Yat-sen University)
Shirley Wynn (NYU-Poly)
Raj Yavatkar (Intel)
Yechiam Yemini (Columbia University)
Ming Yu (State University of New York at Binghamton)
Ellen Zegura (Georgia Institute of Technology)
Honggang Zhang (Suffolk University)
Hui Zhang (Carnegie Mellon University)
Lixia Zhang (University of California at Los Angeles)
Meng Zhang (former NYU-Poly student)
Shuchun Zhang (former University of Pennsylvania student)
Xiaodong Zhang (Ohio State University)
ZhiLi Zhang (University of Minnesota)
Phil Zimmermann (independent consultant)
Cliff C. Zou (University of Central Florida)
We also want to thank the entire Addison-Wesley team—in particular, Michael Hirsch,
Marilyn Lloyd, and Emma Snider—who have done an absolutely outstanding job on
this sixth edition (and who have put up with two very finicky authors who seem con-
genitally unable to meet deadlines!). Thanks also to our artists, Janet Theurer and
Patrice Rossi Calkin, for their work on the beautiful figures in this book, and to Andrea
Stefanowicz and her team at PreMediaGlobal for their wonderful production work on
this edition. Finally, a most special thanks go to Michael Hirsch, our editor at Addison-
Wesley, and Susan Hartman, our former editor at Addison-Wesley. This book would
not be what it is (and may well not have been at all) without their graceful manage-
ment, constant encouragement, nearly infinite patience, good humor, and perseverance.
xvi
Preface
