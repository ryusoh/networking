# cs234-14 - Part 05 (Pages 41-50)

---

## Page 41

Challenges (And How We
Cope With Them?)
´Different IoT analytics à resource
consumption models
´Temperature average versus people-counting
video analytics
´Heterogeneous devices à analytics
decomposition
´Raspberry Pi versus Xeon servers
´Time constraints à polynomial-time
algorithms
´Real-time requirements of trigger-action or IFTTT
(if this, then that) rules
41

---

## Page 42

Resource Consumption
Modeling
´ Input:
´IoT Analytics
´Target QoS
´Hardware Spec
´ Output:
´CPU load
´RAM usage
´Network throughput
42
Resource
Consumption
Models
Analytics
Target QoS
Required
Resources
Hardware
Specification

---

## Page 43

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
Testbed
´ Devices: 5 Raspberry PI3s + 5 PCs (i7)
´ Docker + Kubernetes
´ Server: a tiny PC (i5/8GB RAM)
´ Kubernetes
´ Ethernet
´ IoT Analytics (on TensorFlow)
´ Air quality monitor (QoS: 0.25 – 4 Hz)
´ Sound classifier (QoS: 6/60 – 10/60 Hz)
´ Object recognizer (QoS: 5/60 – 9/60 Hz)
43

---

## Page 44

Deriving the Models for
Raspberry PIs
Analytics
CPU
Network
Air Quality Monitor
0.99
0.99
Sound Classifier
0.85
0.84
Object Recognizer
0.99
0.97
44
´ QoS parameter
´Frame rate (could be others)
´ Power functions: CPU and network
´ Constant: RAM

---

## Page 45

New Devices (Say a PC)?
´Online regression
´Bootstrap from Raspberry PIs’
system models
´15 Iterations
´Mean error
´CPU: 2%
´RAM:13%
45

---

## Page 46

Analytics Decomposition is
Possible
´ Equally divide the complexity among
devices maximizes the performance
46
Cut
RPi 1
RPi 2
Cut

---

## Page 47

But How to Cut Them is Non-
Trivial
´ Perform more computations on device 1
à less network traffic
´ Complex tradeoff between QoS versus
resource
´ The best tradeoff?
47
RPi 1
RPi 2

---

## Page 48

Back to The Analytics
Deployment Problem
48
Devices
Analytics
Goal: Maximize
number of deployed
analytics (requests)

---

## Page 49

Formulation #1 (More
Tractable)
´ Decomposable analytics
´Arbitrary operator sizes
´ Location-aware
´One of the grids
´ Reduced device heterogeneity
´Proportional available resources
´ Convert link constraints to node
constraints
49
ü NP hard
4 cores 2 GHz
4 GB RAM
…
8 cores 2 GHz
8 GB RAM
…
1 core 2 GHz
1 GB RAM
…
X2
X4

---

## Page 50

APproXimation Algorithm
(APX)
50

1. Step 1: Analytics selection
•
Least total required resource
first
•
q: request
•
u: resource type
•
F: model
2. Step 2: Device selection
•
Round robin
3. Step 3: Analytics decomposition
•
As many operators as
possible
Analytics
Selection
Device
Selection
Analytics
Decomposition
Remaining
Operators
Next
Analytics ?
Next
Device
Step 2
Step 1
Step 3
