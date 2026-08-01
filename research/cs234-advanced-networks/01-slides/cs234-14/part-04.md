# cs234-14 - Part 04 (Pages 31-40)

---

## Page 31

Agenda
´Internet-of-Things (IoT)
´IoT Versus Cyber-Physical
Systems (CPS)
´IoT Data Processing
´IoT Analytics
31

---

## Page 32

Cloud-to-Things Continuum
32
Fog computing is the system-level architecture that
brings computing, storage, control, and networking
functions closer to the data-producing sources along
the cloud-to-thing continuum (OpenFog Consortium)

---

## Page 33

What is Analytics
´A process of deriving knowledge
from data, producing additional
values from data [1]
´Examples:
´Health: wellness recommendations
´Transport: illegal parking detection
´Living: building air conditioning
´Environment: smart energy
´Industry: smart archiculture
33
[1] Eugene Siow, Thanassis Tiropanis, and Wendy Hall. 2018. Analytics for the Internet of Things: A
Survey. ACM Comput. Surv. 51, 4, Article 74 (July 2018)

---

## Page 34

What is Knowledge
34
Data (from IoT Sensors)
Description
Diagnosis
Discovery
Prediction
Prescription
[1] Eugene Siow, Thanassis Tiropanis, and Wendy Hall. 2018. Analytics for the Internet of Things: A
Survey. ACM Comput. Surv. 51, 4, Article 74 (July 2018)
Information
Knowledge
Wisdom
More condense,
but need more resources
•
Computational
•
Networking (data exg.)
•
Storage (history)
•
Sensors
Cloud-to-
Things
Continuum
is needed

---

## Page 35

Research Problems for IoT Analytics
in  Cloud-to-Things Continuum
´Virtualization/Software-Defined:
multi-tenant supports
´Quality-of-Service:
quantify/guarantee service quality
´Resource management: aggregate
resources to meet demand [joint work
with Nalini and Yusuf]
´Security and privacy
´Business model
35
Analytics
Deployment
Problem

---

## Page 36

System Topology
36
Controller
Device
Device
Device
…
•
Air Pollution Map
•
Sound Classifier
•
Object Recognizer
•
Manage/monitor devices
•
Deploy IoT Analytics

---

## Page 37

Architecture to Realize
Cloud-to-Thing Continuum
37
Global Optimizer
Analytics Deployment
Algorithm
Virtualization
IoT Analytics
Controller
Virtualization/Containerization
Management
Computing
Networks
Storage
Sensors
Hardware Security Module
Devices
C
Management
Container
C
Management

---

## Page 38

Picking the Right Way to Deploy
An IoT Analytics is Hard
38
Operator 2
Operator 1
Long Latency
Long Execution Time

---

## Page 39

Preview: Analytic
Deployment Problem
39
Devices
Analytics
Goal: Maximize
number of deployed
analytics (requests)

---

## Page 40

Formal Problem Statement
´ Problem: Given a set of requests ! and a
set of fog devices ". Each request
consists of: (i) an IoT analytics, (ii) a
target QoS, and (iii) a specified location.
Devices have # kinds of resources. Our
problem is to determine which request
$ ∈! should be served on which
device & ∈" to maximize number
of served requests.
40
Deployment
Algorithm
Device
Capacities
Deployment
Decisions
Requests
