# cs234-15 - Part 01 (Pages 1-20)

---

## Page 1

CompSci 234/NetSys 210
Advanced Topics in Networking
Winter 2019
Unit 15: Context Awareness
Cheng-Hsin Hsu (<chsu@cs.nthu.edu.tw>)
Some slide adopted from Prof. Christian Poellabauer’materials
1

---

## Page 2

Agenda
´Location-Based Services
´Context-Aware Systems
´Challenges and Design
Guidelines
´Sample Work: Coordinated
Sensor Activations
2

---

## Page 3

Location-based Services:
Definition
LBS: A certain service that is offered to the users based on
their locations.
3

---

## Page 4

Convergence of Technologies
Internet
Mobile Devices
GIS/ Spatial Database
Web GIS
LBS
Mobile
Internet
Mobile
GIS
4

---

## Page 5

Origin of Location-Based
Services
´ The main origin of Location-Based Services (LBS)
was the E911 (Enhanced 911) mandate, which the
U.S. government passed in 1996.
´ The mandate was for mobile-network operators to
locate emergency callers with prescribed accuracy,
so that the operators could deliver a caller’s location
to Public Safety Answering Points.
´ Cellular technology couldn’t fulfill these accuracy
demands back then, so operators started enormous
efforts to introduce advanced positioning methods.
5

---

## Page 6

(The Failed) Finder Services
´To gain returns on the E911 investments, operators
launched a series of commercial LBSs.
´In most cases, these consisted of finder services
that, on request, delivered to users a list of nearby
points of interest, such as restaurants or gas
stations.
´However, most users weren’t interested in this
kind of LBS, so many operators quickly phased
out their LBS offerings and stopped related
development efforts.
´Limitations: Reactive, self-referenced, content-
oriented, operator-centric
6

---

## Page 7

Situations Changed as the
Technologies Advance
´ The emergence of GPS-capable mobile devices,
the advent of the Web 2.0 paradigm, and the
introduction of 3G broadband wireless services
were among the enabling developments.
7

---

## Page 8

New (and Successful)
Location-Based Services
´ In 2004, operators and other providers started offering
services for fleet management and for tracking children and
pets—these were the first examples of cross-referencing
LBSs.
´ Initial versions of these services were based on cell-ID
positioning using triangulation techniques, which suffered
from low accuracy and were soon replaced by GPS.
´ An overlay of geo-location technologies consisting of
cellular and Wi-Fi triangulations, in addition to low-power
GPS receivers (e.g., assisted GPS), made it possible for
location information to be available most of the time and with
variable accuracies.
8

---

## Page 9

Maps for Location-Based
Services
´ Interactive digital maps; used in many applications,
with many map features (location, navigation, nearby
sites, traffic overlay, …)
´ The world of digital navigable maps can be traced
back to NAVTEQ, the most dominant company in
geographic information systems and electronic maps.
´ Indoor maps, e.g., major airports, shopping malls,
stadiums, resorts and other complex architectural
spaces; seamlessly embedded and laid over outdoor
maps, which requires no switching actions by the users

- only zooming is required to see the details of an
indoor map.
´ Both iOS and Android provide comprehensive APIs.
9

---

## Page 10

Agenda
´Location-Based Services
´Context-Aware Systems
´Challenges and Design
Guidelines
´Sample Work: Coordinated
Sensor Activations
10

---

## Page 11

System Structure (Without
Context Awareness)
explicit
input
explicit
output
11

---

## Page 12

Context as Implicit Input
explicit
input
explicit
output
Context:
• state of the user
• state of the physical environment
• state of the computing system
• history of user-computer interaction
• ...
12

---

## Page 13

What is Context?
13

---

## Page 14

Examples of Context
´ Identity (user, others, objects)
´ Location
´ Date/Time
´ Environment
´ Emotional state
´ Focus of attention
´ Orientation
´ User preferences
´ Calendar (events)
´ Browsing history
´ Behavioral patterns
´ Relationships (phonebook, call history)
´ … the elements of the user’s environment that the
computer knows about…
14

---

## Page 15

Relevance of Context
Information
´ Trying to arrange lunch meeting
´ Going to a job interview
´ Going home after work and making evening plans
´ Shopping
´ Tourist
´ ...
15

---

## Page 16

Sample Scene 1
16

---

## Page 17

Sample Scene 1
17

---

## Page 18

Sample Scene 2
18

---

## Page 19

Sample Scene 2
19

---

## Page 20

Examples
´ Smartphone adjusts the screen to the
orientation of the device
´ Apple Watch turns on display if arm
lifted/rotated
´ Orientation is determined by using both
a gyroscope and an accelerometer
20
