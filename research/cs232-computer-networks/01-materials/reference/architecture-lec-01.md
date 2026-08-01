# architecture-lec-01

---

## Page 1

CS 232
Computer and Communication Networks
Some figures on these slides are reproduced from textbooks, and are provided under Fair
Use solely to  those enrolled in this course. The remainder of these slides are copyright
Marco Levorato. Unauthorized reproduction or distribution (including posting on a website)
of any portion of these slides is a violation of the UCI Student Code of Conduct and may
constitute copyright infringement.

---

## Page 2

CS 232 / © Marco Levorato
Instructor:
 2
Marco Levorato
Professor
Computer Science - ICS
DBH3212
<levorato@uci.edu>
Office hours: by appointment (preference
1:30-3:30pm on Thursday)

---

## Page 3

CS 232 / © Marco Levorato
I am italian!!!
 3
Did he just say “spaghetti” or  “network
configuration”????

---

## Page 4

CS 232 / © Marco Levorato
TA:
 4
Hao Tang
<htang6@uci.edu>
Office hours: -:--

---

## Page 5

CS 232 / © Marco Levorato
Networks:
 5
•Architecture
•Applications
•Protocols
•LANS
• No: Physical layer, hardware, coding,
etc.

---

## Page 6

CS 232 / © Marco Levorato
Objectives:
 6
• Notions
• Modeling/understanding
• Design principles

---

## Page 7

CS 232 / © Marco Levorato
Pre-requisites
 7
• CS 132, EE 148
• Or similar
• Probability theory
Revise: probability, distribution
(exponential distribution),…

---

## Page 8

CS 232 / © Marco Levorato
Take notes:
 8
•You won’t find ALL the material in the
book/slides!!!!
• E.g., problems
•I won’t ask you “numbers”, but
understanding and knowledge of the
material

---

## Page 9

CS 232 / © Marco Levorato
Keep up with readings
 9
• You’ll retain more information
from class
• You’ll be able to ask questions
and clarify doubts
• You’ll make me happy!

---

## Page 10

CS 232 / © Marco Levorato
Website
 10
Piazza – I’ll send you an invitation
• Additional material
• Slides, outlines, etc.
• Discussion

---

## Page 11

CS 232 / © Marco Levorato
Evaluation
 11
• Assignments (problems) 40%
• Midterm (questions)       20%
• Final (questions)            40%

---

## Page 12

CS 232 / © Marco Levorato
 12
Comprehensive exam:
The CS232 portion of the CS MS Comprehensive Exam will
consist of the course final. Students scoring a B+ or better
will pass the CS 232 portion of the comprehensive exam.
You must let me know by October 15 if you wish to attempt
the CS 232 portion of the CS MS Comprehensive Exam
Send an email to <htang6@uci.edu> and <fangqil2@uci.edu>

---

## Page 13

CS 232 / © Marco Levorato
 13
Comprehensive exam:
The CS232 portion of the CS MS Comprehensive Exam will consist of
the course final. Students scoring a B+ or better on the final will pass
the CS 232 portion of the comprehensive exam.
You must let me know by the end of the second week of the quarter
if you wish to attempt the CS 232 portion of the CS MS
Comprehensive Exam

---

## Page 14

CS 232 / © Marco Levorato
Networks
 14
•Architecture
•Applications
•Protocols
•LANS

---

## Page 15

Architecture
Part 1:

---

## Page 16

Telephone network and circuit switching

---

## Page 17

CS 232 / © Marco Levorato
Telephone networks
 17
• 1 application (voice)
• Long unicast connections/sessions
(calls)
• Almost constant traffic generation
during the connection
• Sparse call arrival
Network design

---

## Page 18

CS 232 / © Marco Levorato
Topologies
 18
Tanenbaum fig. 2-29

---

## Page 19

CS 232 / © Marco Levorato
 19
• Large number of
links
Fully-connected topology
Expensive infrastructure!

---

## Page 20

CS 232 / © Marco Levorato
 20
Centralized switch topology
• Small number of
links
Local infrastructure:
• Connections from any point to a central
switch
• Very long wires

---

## Page 21

CS 232 / © Marco Levorato
 21
Multi-level hierarchical topology
• Slightly larger number
of links (2 levels)
Scalable infrastructure:
• Many short connections
• Fewer long-distance connections

---

## Page 22

CS 232 / © Marco Levorato
Topology with long distance
 22
Tanenbaum fig. 2-16
Multiple long-
distance carriers
LATA = Local
Access and
Transport Area
LEC = local
exchange carrier
IXC =
Interexchange
(long distance)
carrier

---

## Page 23

CS 232 / © Marco Levorato
Lines and trunks
 23
Tanenbaum fig. 2-15
Local loop line is often twisted-pair copper (low capacity, analog)
Trunks are often fiber (high capacity, digital)
WHY?

---

## Page 24

CS 232 / © Marco Levorato
Trunks
• Trunk lines carry more than 1 call
simultaneously (thousands-millions)
 24
Tanenbaum fig. 2-24
▪Digital vs Analog
High capacity
Signal degrades with distance
• Analog sensitive to noise
• Digital: regeneration, recovery
Long distance
