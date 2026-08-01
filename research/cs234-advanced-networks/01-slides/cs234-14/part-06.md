# cs234-14 - Part 06 (Pages 51-60)

---

## Page 51

!
|#| Approximation Factor
(Sketch)
´ 1: Design an upper bound solution (OPT’)
´ Some simplifications: e.g., Sum up different resource
types
´ 2: Prove results of OPT’ >= optimal solution
(OPT)
´ 3: Derive the approximation factor !
|#|
(APX/OPT’)
´ The algorithm results in optimal solution while |U| = 1
51

---

## Page 52

Validation
52
Optimal Solution
´APX is always above theoretical 1/U bound
´APX == OPT when U=1

---

## Page 53

Formulation #2 (Fewer
Assumptions)
53
Formulation #1
Formulation #2
Operator
Any Size
Predefined
Location
Grids
Any
Device
Heterogeneity
Proportional
Any
Resource
Constraints
Node
Node + Link

---

## Page 54

Problem Formulation
54
Decision Variable
Objective
Constraints
Node
Link

---

## Page 55

SSE Heuristics (Algorithm)
´ Analytics selection
´ Scarcest resource first
´ Source/destination device selection
´ Shortest path first
´ Near-by device selection
´ Early feature extraction
55
Device
Selection
Lower device load
Lower latency
Lower network load
Polynomial-Time as well!

---

## Page 56

Evaluations
´ Analytics (requests)
´ Poisson arrival / departure rates: 1 min / 10 mins
´ Network topology (BRITE [1])
´ Number of devices: [10, 25, 50, 75, 100]
´ Device location and network bandwidth are from BRITE
´ Available resources
´ CPU: [100% ~ 800%]
´ RAM: [1 GB ~ 16 GB]
´ Bandwidth of links:
´ [45 kbps (LoRa), 8 Mbps (WiFi), 25 Mbps (4G)]
56
[1] BRITE, <https://www.cs.bu.edu/brite/user_manual/>

---

## Page 57

Baseline Algorithms
´ Optimal Data Stream Processing Placement (ODP)
algorithm [DEBS’16]
´ Commercial Solvers, e.g., CPLEX
´ Fog and Cloud Placement (FCP) algorithm [IM’17]
´ Heuristic
´ Linear algorithm
´ Greedily deploys operators to neighboring devices
´ Considers all the constraints
´ Random algorithm
´ Mimics a platform without centralized server
´ Does not consider any constraint
57
[DEBS’16] V. Cardellini, V. Grassi, F. Presti, and M. Nardelli. Optimal operator placement for distributed stream processing applications. In
Proc. of ACM International Conference on Distributed and Event-based Systems (DEBS), Irvine, CA, June 2016.
[IM’17] M. Taneja and A. Davy. 2017. Resource aware placement of IoT application modules in Fog-Cloud Computing Paradigm. In Proc. of
IFIP/IEEE Symposium on Integrated Network and Service Management (IM). Lisbon, Portugal.
State-of-the-art

---

## Page 58

SSE Serves More Analytics
Requests (While Achieveing the
QoS Requirements)
´ 140%, 49%, and 46% compared to
Linear, FCP, and ODP
´ Random satisfies
zero requests after
running for 14 hours
58
46%
49%
140%

---

## Page 59

Why SSE Serves More
Analytics?
´ Random, FCP, and ODP are too
aggressive
´ Overload links by
up to 21, 12, and
10 links
59
12
1
21

---

## Page 60

SSE is (Also) Resource
Efficient
´ 6% and 12% more inactive devices (which can
be turned off) compared to ODP and FCP
´ Use less CPU/RAM/bandwidth to satisfy more
requests
60
