# load-balancng-roc-lb

---

## Page 1

2/1/17
1
1
Target Environment: MIMD.
Multiple Tasks Per Processor.
Network
PE
PE
PE
PE
. . . . . .
Local
Memory
Local
Memory
Local
Memory
Local
Memory
Local
Memory
Local
Memory
2
Assumptions
• System assumed MIMD.
• Multiple jobs in system at any time.
• Jobs assumed parallel or sequential.
• Local Scheduling at each processor.
• Each Processor capable of self monitoring
its performance.

---

## Page 2

2/1/17
2
3
Load Balancing: Definition 1
Load Balancing is the activity of migrating
load units from one processing element
(PE) to another so that the number of
load units in different PEs is approximately
the same.
4
Load Balancing: Classification
Load Balancing
Static
Dynamic
Centralized
Distributed

---

## Page 3

2/1/17
3
5
Load Balancing: Classification
• Static:
• Task information (execution time) is computed from the
application before load distribution. The allocation remains
the same throughout the application’s execution
• Dynamic:
• No a priori task information is used in initial distribution.
Must satisfy changing requirements by making task
distribution decisions at run-time
6
Load Balancing: Classification
• Centralized:
• Load Balancing decisions are made by one processing
element only, which is responsible for maintaining global
load information.
• Distributed:
• Load Balancing decisions are made locally. Global load
information is distributed among all processing elements
and they all share the responsibility of achieving global load
balance.

---

## Page 4

2/1/17
4
7
Load Balancing: Classification
• Implicit:
• Load Balancing performed automatically by the system
• Explicit:
• User decides which tasks should migrate and when
8
Load Balancing: Phases
• When to load balance
• Where to migrate the tasks
• How many tasks to transfer/request
• Which tasks to transfer

---

## Page 5

2/1/17
5
9
Load Balancing: Advantages
• Improves single application overall
performance by redistributing the
workload among processors.
• Increases throughput if multi-application
environment.
• System function, hence transparent to
user.
10
Load Balancing: Disadvantages
• Load Balancing activity comes at the expense of
useful computation.
• Incurs into communications overhead:
• Transfer of tasks among Pes.
• Cost of collecting load information.
• Message forwarding.
• Space required to maintain load balancing
information.

---

## Page 6

2/1/17
6
11
Load Balancing: Previous work
• Gradient Model
• Central Job Dispatcher
• Sender Initiated/Receiver Initiated Diffusion
• Randomize seeking
• Dimension Exchange Method
• Hierarchical Balancing Method
12
According to Definition 1
• Fully distributed algorithm:
• Can look at neighbors only and transfer marbles so that
two neighbors have same number of marbles + or - 1
• Converges to following configuration:

---

## Page 7

2/1/17
7
13
According to Definition 1
• Is this BALANCED ?
• Solution ?
14
According to Definition 1

---

## Page 8

2/1/17
8
15
Load Balancing: Definition 2
Load Balancing is the activity of migrating load
units from one processing element (PE) to
another so that PEs have at least one load
unit at all times (if enough workload is
available).
16
Load Balancing: Problem Statement
Redistribute workload among processors to
increase throughput by maximizing processor
utilization.
Minimize processor idle time with minimum task
redistribution overhead.

---

## Page 9

2/1/17
9
17
Load Balancing: Goals
• To minimize processor idling time.
• To minimize overhead:
• communications
• load balancing activity
• To be stable.
• To quickly (re-)distribute the load.
18
Rate-of-Change Load Balancing
• The load balancing algorithm proposed for:
– High throughput
– High Processor utilization
– Fault tolerant
– On-line repairable
– Scalable

---

## Page 10

2/1/17
10
19
Rate of Change Load Balancing
(RoC-LB)
• Dynamically compute the way in which local
load changes in time (rate of change).
• Redistribute load if and only if future
starvation is predicted.
– Assumes time slicing at each PE (time interval).
20
RoC-LB: Our Approach
• Uses local tables containing system’s load
distribution information to determine where tasks
should be transferred to.
• Uses three thresholds to determine when and how
many tasks to transfer.
• Uses task size and previous execution time to
determine which tasks to transfer.

---

## Page 11

2/1/17
11
21
RoC-LB: Phases
• When to load balance
• Where to migrate the tasks
• How many tasks to transfer/request
• Which tasks to transfer
22
RoC-LB: When Phase
Each Processor
• Calculates its local rate of change (DL).
• Uses DL as predictor of the probable
number of tasks in subsequent intervals.
• If DL is negative, computes number of
sampling intervals before idle state
reached.

---

## Page 12

2/1/17
12
23
RoC-LB: When Phase (cont’d)
Each Processor
• Initiates a migration request if number of
intervals to starvation is less than network
delay (ND).
24
RoC-LB: When Phase (cont’d)
• Two thresholds are used to determine the
load status of a PE:
• Above HT : Source PE
• Below LT : Sink PE
• Between HT and LT : Neutral PE
• Two exceptions:
• When the load falls below CT
• When the load is above HT

---

## Page 13

2/1/17
13
25
RoC-LB depicted in time
26
RoC-LB: Where Phase
• Sink processor initiates process
• Select source processor from table
• Sends request to selected processor
• Deletes source entry from table
• Upon receiving reply updates table

---

## Page 14

2/1/17
14
27
RoC-LB: Where Phase
• Receiving processor
• Transfers tasks to sink if still source
• Increments count
• Forward request to another source processor if no
longer source or not able to satisfy whole request
• Updates table based on request message
28
RoC-LB: Transfer request protocol
• Request Fields:
• Sink processor identification
• number  of load units
• load state of  preceding processor
• count number

---

## Page 15

2/1/17
15
29
ROC-LB: Transfer request protocol
30
RoC-LB: How many / Which Phases
• Sender Side: Assuming DL constant for the
duration of a ND calculate Predicted Load
(PL). Request abs(PL)
• Receiver Side: Transfer tasks above HT
• Older Tasks. Higher probability of living
long enough to amortize their migration
cost

---

## Page 16

2/1/17
16
31
ROC-LB: Classification
• Dynamic
• Distributed
• On demand
• Preemptive
• Implicit
32
RoC-LB: Experiments
• Each simulation uses 32 000 tasks.
• Tasks have different sizes and life span.
• Four different Load Balancing Algorithms used.
• Four different network topologies:
• mesh
• hypercube
• fully connected network
• Network of Workstations

---

## Page 17

2/1/17
17
33
RoC-LB: Performance Metrics
Normalized Performance
opt
noLB
LB
noLB
T
T
T
T
NP
-
-
=
34
RoC-LB: Results
Symmetric distribution
Mesh
Hypercube
Fully Connected
Network of workstations
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

---

## Page 18

2/1/17
18
35
RoC-LB: Results
Asymmetric distribution
Mesh
Hypercube
Fully Connected
Network of workstations
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
36
RoC-LB: Results
Symmetric distribution with Arrivals
Mesh
Hypercube
Fully Connected
Network of workstations
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

---

## Page 19

2/1/17
19
37
Influence of ND in RoC-LB
ND = 4xOverhead + 2xNetwork Latency
38
Influence of ND in RoC-LB
ND = NumberHops x (2xNL + 4xOv)

---

## Page 20

2/1/17
20
39
Influence of ND in RoC-LB
Very sensitive to even small changes in the load
40
RoC-LB: Table information accuracy
• First Hop Hit
• The first entry in the table is accurate in the first hop
• First Entry Hit
• The first entry in the table leads to a load transfer
• Complete Entry Hit
• The load request is completely satisfied

---

## Page 21

2/1/17
21
41
RoC-LB: Results (experiment 1)
42
RoC-LB: Results (experiment 1)
78
80
82
84
86
88
90
92
94
96
98
100
Hit Ratio
one
two
three
four
Number of entries

---

## Page 22

2/1/17
22
43
RoC-LB: Results (experiment 2)
44
RoC-LB: Improvements
• How to increase the probability of a complete
hit in shorter time?
– Alternative 1:Every PE sends a load request to all
entries in the source table.
– Alternative 2:Only the request initiator PE sends
a load request to all entries in the source table.
Any intermediate PE forwards the message to just
one other PE.

---

## Page 23

2/1/17
23
45
RoC-LB: Improvements
• How to increase the probability of a complete
hit in shorter time?
– Alternative 3:The initiator PE multicasts a request
to all PEs in its source table.
– Each request will contain a different number of loads units or
– Each request will be forwarded a different number of times.
46
Conjecture
Parallel Scheduling > Local Scheduling +
Load Balancing
“For every Parallel Schedule, there exist an equally
effective Local Scheduling + Load Balancing”
