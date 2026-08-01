# loadbalancing-dist - Part 02 (Pages 13-23)

---

## Page 13

c
⃝
Isaac D. Scherson
RoC-LB depicted in time
25 / 45
c
⃝
Isaac D. Scherson
RoC-LB: Where Phase
I Sink processor initiates process
I Select source processor from table
I Sends request to selected processor
I Deletes source entry from table
I Upon receiving reply updates table
26 / 45

---

## Page 14

c
⃝
Isaac D. Scherson
RoC-LB: Where Phase
I Receiving processor
I Transfers tasks to sink if still source
I Increments count
I Forward request to another source processor if no longer source or not
able to satisfy whole request
I Updates table based on request message
27 / 45
c
⃝
Isaac D. Scherson
RoC-LB: Transfer request protocol
I Request Fields:
I Sink processor identiﬁcation
I number of load units
I load state of preceding processor
I count number
28 / 45

---

## Page 15

c
⃝
Isaac D. Scherson
ROC-LB: Transfer request protocol
29 / 45
c
⃝
Isaac D. Scherson
RoC-LB: How many / Which Phases
I Sender Side: Assuming DL constant for the duration of a ND
calculate Predicted Load (PL). Request abs(PL)
I Receiver Side: Transfer tasks above HT
I Older Tasks. Higher probability of living long enough to amortize
their migration cost
30 / 45

---

## Page 16

c
⃝
Isaac D. Scherson
ROC-LB: Classiﬁcation
I Dynamic
I Distributed
I On demand
I Preemptive
I Implicit
31 / 45
c
⃝
Isaac D. Scherson
RoC-LB: Experiments
I Each simulation uses 32 000 tasks.
I Tasks have different sizes and life span.
I Four different Load Balancing Algorithms used.
I Four different network topologies:
I Mesh
I Hypercube
I Fully connected network
I Network of Workstations
32 / 45

---

## Page 17

c
⃝
Isaac D. Scherson
RoC-LB: Performance Metrics
Normalized Performance
NP = TnoLB −TLB
TnoLB −Topt
33 / 45
c
⃝
Isaac D. Scherson
RoC-LB: Results
Symmetric distribution
Mesh
HyperCube
Fully Connected
Network of
Workstations
Gradient Model
0.66
0.69
0.73
0.52
Sender Initiated Diffusion
0.70
0.71
0.74
0.59
Central Job Dispatcher
0.59
0.62
0.73
0.37
Rate of Change Model
0.79
0.79
0.87
0.61
34 / 45

---

## Page 18

c
⃝
Isaac D. Scherson
RoC-LB: Results
Asymmetric distribution
Mesh
HyperCube
Fully Connected
Network of
Workstations
Gradient Model
0.72
0.74
0.76
0.54
Sender Initiated Diffusion
0.65
0.65
0.68
0.52
Central Job Dispatcher
0.65
0.66
0.65
0.45
Rate of Change Model
0.74
0.75
0.81
0.60
35 / 45
c
⃝
Isaac D. Scherson
RoC-LB: Results
Symmetric distribution with Arrivals
Mesh
HyperCube
Fully Connected
Network of
Workstations
Gradient Model
0.70
0.77
0.81
0.54
Sender Initiated Diffusion
0.73
0.76
0.81
0.58
Central Job Dispatcher
0.52
0.53
0.53
0.42
Rate of Change Model
0.82
0.82
0.88
0.62
36 / 45

---

## Page 19

c
⃝
Isaac D. Scherson
Inﬂuence of ND in RoC-LB
ND = 4 ⇥Overhead + 2 ⇥Network Latency
37 / 45
c
⃝
Isaac D. Scherson
Inﬂuence of ND in RoC-LB
ND = Number Hops ⇥(2 ⇥NL + 4 ⇥Ov)
38 / 45

---

## Page 20

c
⃝
Isaac D. Scherson
Inﬂuence of ND in RoC-LB
Very sensitive to even small changes in the load
39 / 45
c
⃝
Isaac D. Scherson
RoC-LB: Table information accuracy
I First Hop Hit
I The ﬁrst entry in the table is accurate in the ﬁrst hop
I First Entry Hit
I The ﬁrst entry in the table leads to a load transfer
I Complete Entry Hit
I The load request is completely satisﬁed
40 / 45

---

## Page 21

c
⃝
Isaac D. Scherson
RoC-LB: Results (experiment 1)
41 / 45
c
⃝
Isaac D. Scherson
RoC-LB: Results (experiment 1)
42 / 45

---

## Page 22

c
⃝
Isaac D. Scherson
RoC-LB: Results (experiment 2)
43 / 45
c
⃝
Isaac D. Scherson
RoC-LB: Improvements
I How to increase the probability of a complete hit in shorter time?
I Alternative 1: Every PE sends a load request to all entries in the source
table.
I Alternative 2: Only the request initiator PE sends a load request to all
entries in the source table. Any intermediate PE forwards the message
to just one other PE.
I Alternative 3: The initiator PE multicasts a request to all PEs in its
source table.
I Each request will contain a different number of loads units or
I Each request will be forwarded a different number of times.
44 / 45

---

## Page 23

c
⃝
Isaac D. Scherson
Conjecture
Parallel Scheduling > Local Scheduling + Load Balancing
“For every Parallel Schedule, there exist an equally effective
Local Scheduling + Load Balancing”
45 / 45
