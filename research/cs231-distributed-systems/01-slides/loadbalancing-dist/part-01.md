# loadbalancing-dist - Part 01 (Pages 1-12)

---

## Page 1

c
⃝
Isaac D. Scherson
Distributed [Computing] Systems
Load Balancing
Isaac D. Scherson (aka The Schark c¨^ )
Dept. of Computer Science (Systems)
Bren School of Information and Computer Sciences
University of California, Irvine
Irvine, CA 92697-3425
isaac@ics.uci.edu
www.ics.uci.edu/˜isaac
www.ics.uci.edu/˜schark
CompSci-230, Spring 2019
1 / 45
c
⃝
Isaac D. Scherson
Load Balancing
2 / 45

---

## Page 2

c
⃝
Isaac D. Scherson
Target Environment
PE
Memory
Interconnection
Network
PE
Memory
PE
Memory
Target Environment: MIMD. Multiple Tasks Per Processor.
3 / 45
c
⃝
Isaac D. Scherson
Assumptions
I System assumed MIMD.
I Multiple jobs in system at any time.
I Jobs assumed parallel or sequential.
I Local Scheduling at each processor.
I Each Processor capable of self monitoring its performance.
4 / 45

---

## Page 3

c
⃝
Isaac D. Scherson
Load Balancing: Deﬁnition 1
I Load Balancing is the activity of migrating load units from one
processing element (PE) to another so that the number of load units
in different PEs is approximately the same.
5 / 45
c
⃝
Isaac D. Scherson
Load Balancing: Classiﬁcation
Static
Dynamic
Centralized
Distributed
Load Balancing
6 / 45

---

## Page 4

c
⃝
Isaac D. Scherson
Load Balancing: Classiﬁcation
I Static:
I Task information (execution time) is computed from the application
before load distribution. The allocation remains the same throughout the
application’s execution
I Dynamic:
I No a priori task information is used in initial distribution. Must satisfy
changing requirements by making task distribution decisions at run-time
7 / 45
c
⃝
Isaac D. Scherson
Load Balancing: Classiﬁcation
I Centralized:
I Load Balancing decisions are made by one processing element only,
which is responsible for maintaining global load information.
I Distributed:
I Load Balancing decisions are made locally. Global load information is
distributed among all processing elements and they all share the
responsibility of achieving global load balance.
8 / 45

---

## Page 5

c
⃝
Isaac D. Scherson
Load Balancing: Classiﬁcation
I Implicit:
I Load Balancing performed automatically by the system
I Explicit:
I User decides which and when tasks should migrate
9 / 45
c
⃝
Isaac D. Scherson
Load Balancing: Phases
I When to load balance
I Where to migrate the tasks
I How many tasks to transfer/request
I Which tasks to transfer
10 / 45

---

## Page 6

c
⃝
Isaac D. Scherson
Load Balancing: Advantages
I Improves single application overall performance by redistributing
the workload among processors.
I Increases throughput if multi-application environment.
I System function, hence transparent to user.
11 / 45
c
⃝
Isaac D. Scherson
Load Balancing: Disadvantages
I Load Balancing activity comes at the expense of useful computation.
I Incurs into communications overhead:
I Transfer of tasks among Pes.
I Cost of collecting load information.
I Message forwarding.
I Space required to maintain load balancing information.
12 / 45

---

## Page 7

c
⃝
Isaac D. Scherson
Load Balancing: Previous work
I Gradient Model
I Central Job Dispatcher
I Sender Initiated/Receiver Initiated Diffusion
I Randomize seeking
I Dimension Exchange Method
I Hierarchical Balancing Method
13 / 45
c
⃝
Isaac D. Scherson
According to Deﬁnition 1
I Fully distributed algorithm:
I Can look at neighbors only and transfer marbles so that two
neighbors have same number of marbles + or - 1
I Converges to following conﬁguration:
14 / 45

---

## Page 8

c
⃝
Isaac D. Scherson
According to Deﬁnition 1
I Is this BALANCED ?
I Solution ?
15 / 45
c
⃝
Isaac D. Scherson
According to Deﬁnition 1
16 / 45

---

## Page 9

c
⃝
Isaac D. Scherson
Load Balancing: Deﬁnition 2
I Load Balancing is the activity of migrating load units from one
processing element (PE) to another so that PEs have at least one load
unit at all times (if enough workload is available).
17 / 45
c
⃝
Isaac D. Scherson
I Redistribute workload among processors to increase throughput by
maximizing processor utilization.
I Minimize processor idle time with minimum task redistribution
overhead.
18 / 45

---

## Page 10

c
⃝
Isaac D. Scherson
Load Balancing: Goals
I To minimize processor idling time.
I To minimize overhead:
I Communications.
I Load balancing activity.
I To be stable.
I To quickly (re-)distribute the load.
19 / 45
c
⃝
Isaac D. Scherson
Rate-of-Change Load Balancing
I The load balancing algorithm proposed for:
I High throughput
I High Processor utilization
I Fault tolerant
I On-line repairable
I Scalable
20 / 45

---

## Page 11

c
⃝
Isaac D. Scherson
Rate of Change Load Balancing (RoC-LB)
I Dynamically compute the way in which local load changes in time
(rate of change).
I Redistribute load if and only if future starvation is predicted.
I Assumes time slicing at each PE (time interval).
21 / 45
c
⃝
Isaac D. Scherson
RoC-LB: Our Approach
I Uses local tables containing system’s load distribution information to
determine where tasks should be transferred to.
I Uses three thresholds to determine when and how many tasks to
transfer.
I Uses task size and previous execution time to determine which tasks
to transfer.
22 / 45

---

## Page 12

c
⃝
Isaac D. Scherson
RoC-LB: Phases
I When to load balance
I Where to migrate the tasks
I How many tasks to transfer/request
I Which tasks to transfer
23 / 45
c
⃝
Isaac D. Scherson
RoC-LB: When Phase
Each Processor
I Calculates its local rate of change (DL).
I Uses DL as predictor of the probable number of tasks in subsequent
intervals.
I If DL is negative, computes number of sampling intervals before idle
state reached.
I Initiates a migration request if number of intervals to starvation is
less than network delay (ND).
I Two thresholds are used to determine the load status of a PE:
I Above HT : Source PE
I Below LT : Sink PE
I Between HT and LT : Neutral PE
I Two exceptions:
I When the load falls below CT
I When the load is above HT
24 / 45
