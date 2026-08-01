# opnet-full-presentation

---

## Page 1

Copyright © 2002 OPNET Technologies, Inc.
 1
Traffic Behavior and Queuing in a QoS Environment
Session 1813
Networking Tutorials
Prof. Dimitri P. Bertsekas
Department of Electrical Engineering
M.I.T.

---

## Page 2

Copyright © 2002 OPNET Technologies, Inc.
 2
Traffic Behavior and Queuing in a QoS Environment
Objectives
• Provide some basic understanding of queuing phenomena
• Explain the available solution approaches and associated
trade-offs
• Give guidelines on ho
ns and solutions

---

## Page 3

Copyright © 2002 OPNET Technologies, Inc.
 3
Traffic Behavior and Queuing in a QoS Environment
Outline
• Basic concepts
• Source models
• Service models (demo)
• Single-queue systems
•
• Networks
• Hybrid simulation (demo)

---

## Page 4

Copyright © 2002 OPNET Technologies, Inc.
 4
Traffic Behavior and Queuing in a QoS Environment
Outline
• Basic concepts
– Performance measures
– Solution methodologies
– Queuing system concepts
– Stability and steady-st
•
• Service models (demo)
• Single-queue systems
• Priority/shared service systems
• Networks of queues
• Hybrid simulation (demo)

---

## Page 5

Copyright © 2002 OPNET Technologies, Inc.
 5
Traffic Behavior and Queuing in a QoS Environment
Performance Measures
• Delay
• Delay variation (jitter)
• Packet loss
• Efficient sharing of ba
•
file transfe
• Challenge: Provide adequate performance for (possibly)
heterogeneous traffic

---

## Page 6

Copyright © 2002 OPNET Technologies, Inc.
 6
Traffic Behavior and Queuing in a QoS Environment
Solution Methodologies
• Analytical results (formulas)
– Pros: Quick answers, insight
– Cons: Often inaccurate or inapplicable
• Explicit simulation
• Hybrid si
– Intermediate solution approach
– Combines advantages and disadvantages of analysis and simulation

---

## Page 7

Copyright © 2002 OPNET Technologies, Inc.
 7
Traffic Behavior and Queuing in a QoS Environment
Examples of Applications

---

## Page 8

Copyright © 2002 OPNET Technologies, Inc.
 8
Traffic Behavior and Queuing in a QoS Environment
Queuing System Concepts:
Arrival Rate, Occupancy, Time in the System
• Queuing system
– Data network where packets arrive, wait in various queues, receive
service at various points, and exit after some time
• Arrival rate
• Occupanc
– Number of packets in the system (averaged over a long time)
• Time in the system (delay)
– Time from packet entry to exit (averaged over many packets)

---

## Page 9

Copyright © 2002 OPNET Technologies, Inc.
 9
Traffic Behavior and Queuing in a QoS Environment
Stability and Steady-State
• A single queue system is stable if
packet arrival rate < system transmission capacity
• For a single queue, the ratio
packet arrival ra
sion capacity
i
• In an unsta
eues
and/or get dropped
• For unstable systems with large buffers some packet delays
become very large
– Flow/admission control may be used to limit the packet arrival rate
– Prioritization of flows keeps delays bounded for the important traffic
• Stable systems with time-stationary arrival traffic approach a
steady-state

---

## Page 10

Copyright © 2002 OPNET Technologies, Inc.
 10
Traffic Behavior and Queuing in a QoS Environment
Little’s Law
• For a given arrival rate, the time in the system is proportional
to packet occupancy
N =  T
where
    
    T: average delay (time in the system) per packet
• Examples:
– On rainy days, streets and highways are more crowded
– Fast food restaurants need a smaller dining room than regular
restaurants with the same customer arrival rate
– Large buffering together with large arrival rate cause large delays

---

## Page 11

Copyright © 2002 OPNET Technologies, Inc.
 11
Traffic Behavior and Queuing in a QoS Environment
Explanation of Little’s Law
• Amusement park analogy: people arrive, spend time at
various sites, and leave
• They pay $1 per unit time in the park
• The rate at which the p
unit time (N:
a
•
traffic arri
• Over a long horizon:
Rate of park earnings = Rate of people’s payment
or
N =  T

---

## Page 12

Copyright © 2002 OPNET Technologies, Inc.
 12
Traffic Behavior and Queuing in a QoS Environment
Delay is Caused by Packet Interference
• If arrivals  are regular or sufficiently spaced apart, no queuing
delay occurs
Irregular but
Spaced Apart Traffic

---

## Page 13

Copyright © 2002 OPNET Technologies, Inc.
 13
Traffic Behavior and Queuing in a QoS Environment
Burstiness Causes Interference
• Note that the departures are less bursty

---

## Page 14

Copyright © 2002 OPNET Technologies, Inc.
 14
Traffic Behavior and Queuing in a QoS Environment
Burstiness Example
Different Burstiness Levels at Same Packet Rate
Source:  Fei Xue and S. J. Ben Yoo, UCDavis, “On the Generation and Shaping Self-similar Traffic in Optical Packet-switched Networks”, OPNETWORK 2002

---

## Page 15

Copyright © 2002 OPNET Technologies, Inc.
 15
Traffic Behavior and Queuing in a QoS Environment
Packet Length Variation Causes
Interference
Regular arrivals, irregular packet lengths

---

## Page 16

Copyright © 2002 OPNET Technologies, Inc.
 16
Traffic Behavior and Queuing in a QoS Environment
High Utilization Exacerbates Interference
As the work arrival rate:
(packet arrival rate * packet length)
increases, the opportunity for interference increases

---

## Page 17

Copyright © 2002 OPNET Technologies, Inc.
 17
Traffic Behavior and Queuing in a QoS Environment
Bottlenecks
• Types of bottlenecks
– At access points (flow control, prioritization, QoS enforcement needed)
– At points within the network core
– Isolated (can be analyzed in isolation)
•
– High loa
– Convergence of sufficient number of moderate load sessions at the same
queue

---

## Page 18

Copyright © 2002 OPNET Technologies, Inc.
 18
Traffic Behavior and Queuing in a QoS Environment
Bottlenecks Cause Shaping
• The departure traffic from a bottleneck is more regular than the
arrival traffic
• The inter-departure time between two packets is at least as
large as the transmission time of the 2nd packet

---

## Page 19

Copyright © 2002 OPNET Technologies, Inc.
 19
Traffic Behavior and Queuing in a QoS Environment
Bottlenecks Cause Shaping
Bottleneck
90% utilization
Outgoing traffic
Incoming traffic
Exponential
gap

---

## Page 20

Copyright © 2002 OPNET Technologies, Inc.
 20
Traffic Behavior and Queuing in a QoS Environment
Bottleneck
90% utilization
Outgoing traffic
Incoming traffic
Large
Medium
Small

---

## Page 21

Copyright © 2002 OPNET Technologies, Inc.
 21
Traffic Behavior and Queuing in a QoS Environment
Packet Trains
Inter-departure times for small packets

---

## Page 22

Copyright © 2002 OPNET Technologies, Inc.
 22
Traffic Behavior and Queuing in a QoS Environment
Variable packet sizes
Histogram of inter-departure times for small packets
sec

## of packets

     Variable packet sizes
     Constant packet sizes

---

## Page 23

Copyright © 2002 OPNET Technologies, Inc.
 23
Traffic Behavior and Queuing in a QoS Environment
Outline
• Basic concepts
• Source models
– Poisson traffic
– Batch arrivals
•
• Single-que
• Priority/shared service systems
• Networks of queues
• Hybrid simulation (demo)

---

## Page 24

Copyright © 2002 OPNET Technologies, Inc.
 24
Traffic Behavior and Queuing in a QoS Environment
Poisson Process with Rate λ
• Interarrival times are independent and
exponentially distributed
• Models well the accumulated traffic of many
independent sources
• T
(secs/pack
(packets/sec)

---

## Page 25

Copyright © 2002 OPNET Technologies, Inc.
 25
Traffic Behavior and Queuing in a QoS Environment
Batch Arrivals
• Some sources transmit in packet bursts
• May be better modeled by a batch arrival process (e.g., bursts
of packets arriving according to a Poisson process)
• The case for a batch m
eues after the first,
b

---

## Page 26

Copyright © 2002 OPNET Technologies, Inc.
 26
Traffic Behavior and Queuing in a QoS Environment
Markov Modulated Rate Process (MMRP)
• Extension: Models with more than two states
distr
Tra
(e.g., Poisson, deterministic, etc) at each state
State 0
State 1
OFF
ON

---

## Page 27

Copyright © 2002 OPNET Technologies, Inc.
 27
Traffic Behavior and Queuing in a QoS Environment
Source Types
• Voice sources
• Video sources
• File transfers
• Web traffic
• I
• Different a
ents,
e.g., delay, jitter, loss, throughput, etc.

---

## Page 28

Copyright © 2002 OPNET Technologies, Inc.
 28
Traffic Behavior and Queuing in a QoS Environment
Source Type Properties
Characteristics
QoS
Requirements
Model
Voice

* Alternating talk-
   spurts and silence
   intervals.

Delay < ~150 ms
Jitter < ~30 ms

* Two-state (on-off) Markov
   Modulated Rate Process (MMRP)
ponentially distributed time at
Video
* Highly bursty traffic
   (when encoded)
* Long range
   dependencies
Delay < ~ 400 ms
Jitter < ~ 30 ms
Packet loss < ~1%
K-state (on-off) Markov Modulated
Rate Process (MMRP)
Interactive
FTP
telnet
web
* Poisson type
* Sometimes batch-
   arrivals, or bursty,
   or sometimes on-off
Zero or near-sero
packet loss
Delay may be
important
Poisson, Poisson with batch arrivals,
Two-state MMRP

---

## Page 29

Copyright © 2002 OPNET Technologies, Inc.
 29
Traffic Behavior and Queuing in a QoS Environment
Typical Voice Source Behavior

---

## Page 30

Copyright © 2002 OPNET Technologies, Inc.
 30
Traffic Behavior and Queuing in a QoS Environment
MPEG1 Video Source Model
Diagram Source:  Mark W. Garrett and Walter Willinger, “Analysis, Modeling, and Generation of Self-Similar VBR Video Traffic, BELLCORE, 1994
• The MPEG1 MMRP model can be extremely bursty, and has
“long range dependency” behavior due to the deterministic
frame sequence

---

## Page 31

Copyright © 2002 OPNET Technologies, Inc.
 31
Traffic Behavior and Queuing in a QoS Environment
Outline
• Basic concepts
• Source models
• Service models
– Single vs. multiple-ser
• Single-que
• Priority/shared service systems
• Networks of queues
• Hybrid simulation (demo)

---

## Page 32

Copyright © 2002 OPNET Technologies, Inc.
 32
Traffic Behavior and Queuing in a QoS Environment
Device Queuing Mechanisms
• Common queue examples for IP routers
– FIFO: First In First Out
– PQ: Priority Queuing
– WFQ: Weighted Fair Queuing
•
– Single se
– Multiple server (one queue - several transmission lines)
– Priority server (several queues with hard priorities - one transmission
line)
– Shared server (several queues with soft priorities - one transmission
line)

---

## Page 33

Copyright © 2002 OPNET Technologies, Inc.
 33
Traffic Behavior and Queuing in a QoS Environment
Single Server FIFO
• Single transmission line serving packets on a FIFO (First-In-
First-Out) basis
• Each packet must wait for all packets found in the system to
complete transmission
smission
• Packets ar

---

## Page 34

Copyright © 2002 OPNET Technologies, Inc.
 34
Traffic Behavior and Queuing in a QoS Environment
FIFO Queue
• Packets are placed on outbound link to egress device in FIFO order
– Device (router, switch) multiplexes different flows arriving on various ingress
ports onto an output buffer forming a FIFO queue

---

## Page 35

Copyright © 2002 OPNET Technologies, Inc.
 35
Traffic Behavior and Queuing in a QoS Environment
Multiple Servers
• Multiple packets are transmitted simultaneously on multiple
lines/servers
• Head of the line service: packets wait in a FIFO queue, and
when a server become
t goes into service

---

## Page 36

Copyright © 2002 OPNET Technologies, Inc.
 36
Traffic Behavior and Queuing in a QoS Environment
Priority Servers
• Packets form priority classes (each may have several flows)
• There is a separate FIFO queue for each priority class
• Packets of lower priority start transmission only if no higher
priority packet is waiti
•
packet fo
– Preemptive (high priority packet does not have to wait …)

---

## Page 37

Copyright © 2002 OPNET Technologies, Inc.
 37
Traffic Behavior and Queuing in a QoS Environment
Priority Queuing
• Packets are classified into separate queues
– E.g., based on source/destination IP address, source/destination TCP port, etc.
• All packets in a higher priority queue are served before a lower priority
queue is served
– Typically in routers, if a hi
 while a lower priority

---

## Page 38

Copyright © 2002 OPNET Technologies, Inc.
 38
Traffic Behavior and Queuing in a QoS Environment
Shared Servers
• Again we have multiple classes/queues, but they are served
with a “soft” priority scheme
• Round-robin
• Weighted fair queuing

---

## Page 39

Copyright © 2002 OPNET Technologies, Inc.
 39
Traffic Behavior and Queuing in a QoS Environment
Round-Robin/Cyclic Service
• Round-robin serves each queue in sequence
– A queue that is empty is skipped
– Each queue when served may have limited service (at most k packets
transmitted with k = 1 or k > 1)
•
n
• Round-rob
ation
among the queues.

---

## Page 40

Copyright © 2002 OPNET Technologies, Inc.
 40
Traffic Behavior and Queuing in a QoS Environment
Fair Queuing
• This scheduling method is inspired by the “most fair” of methods:
– Transmit one bit from each queue in cyclic order (bit-by-bit round robin)
– Skip queues that are empty
• To approximate the bit-by-bit processing behavior, for each packet
– We calculate upon arrival its “finish time under bit-by-bit round robin”
assuming all other queues
 we transmit by FIFO
• Important pr
– Priority is given to short packets
– Equal bandwidth is allocated to all queues that are continuously busy

---

## Page 41

Copyright © 2002 OPNET Technologies, Inc.
 41
Traffic Behavior and Queuing in a QoS Environment
Weighted Fair Queuing
• Fair queuing cannot be used to implement bandwidth allocation and soft
priorities
• Weighted fair queuing is a variation that corrects this deficiency
– Let wk be the weight of the kth queue
– Think of round-robin with
ts upon its turn
– If all queues have always s
ueue receives bandwidth
• F
• Priority queu
 move to
higher priorities
• Again, to deal with the segmentation problem, we approximate as follows:
For each packet:
– We calculate its “finish time” (under the weighted bit-by-bit round robin
scheme)
– We next transmit the packet with the minimum finish time

---

## Page 42

Copyright © 2002 OPNET Technologies, Inc.
 42
Traffic Behavior and Queuing in a QoS Environment
Weighted Fair Queuing Illustration
Weights:
Queue 1 = 3
Queue 2 = 1
Queue 3 = 1

---

## Page 43

Copyright © 2002 OPNET Technologies, Inc.
 43
Traffic Behavior and Queuing in a QoS Environment
Combination of Several Queuing Schemes
• Example – voice (PQ), guaranteed b/w (WFQ), Best Effort
   (Cisco’s LLQ implementation)

---

## Page 44

Copyright © 2002 OPNET Technologies, Inc.
 44
Traffic Behavior and Queuing in a QoS Environment
Demo:  FIFO
FIFO
Bottleneck
90% utilization

---

## Page 45

Copyright © 2002 OPNET Technologies, Inc.
 45
Traffic Behavior and Queuing in a QoS Environment
Demo:  FIFO Queuing Delay
Applications have different
requirements
•
Video
» delay, jitter
rt” needed
•
Priority Queuing (PQ)
•
Weighted Fair Queuing (WFQ)

---

## Page 46

Copyright © 2002 OPNET Technologies, Inc.
 46
Traffic Behavior and Queuing in a QoS Environment
Demo:  Priority Queuing (PQ)
Bottleneck
90% utilization

---

## Page 47

Copyright © 2002 OPNET Technologies, Inc.
 47
Traffic Behavior and Queuing in a QoS Environment
Demo:  PQ Queuing Delays
FIFO
PQ Video
PQ FTP

---

## Page 48

Copyright © 2002 OPNET Technologies, Inc.
 48
Traffic Behavior and Queuing in a QoS Environment
Demo:  Weighted Fair Queuing (WFQ)
Bottleneck
90% utilization

---

## Page 49

Copyright © 2002 OPNET Technologies, Inc.
 49
Traffic Behavior and Queuing in a QoS Environment
Demo:  WFQ Queuing Delays
FIFO
WFQ/PQ Video
 FTP

---

## Page 50

Copyright © 2002 OPNET Technologies, Inc.
 50
Traffic Behavior and Queuing in a QoS Environment
Queuing: Take Away Points
• Choice of queuing mechanism can have a profound effect on
performance
• To achieve desired service differentiation, appropriate queuing
mechanisms can be used
• Complex queuing mec
 simulation
t
• Improper
tion or
weights) may impact performance of low priority traffic

---

## Page 51

Copyright © 2002 OPNET Technologies, Inc.
 51
Traffic Behavior and Queuing in a QoS Environment
Outline
• Basic concepts
• Source models
• Service models (demo)
• Single-queue systems
– Demo: Analytics vs. simulation
• Priority/shared service systems
• Networks of queues
• Hybrid simulation (demo)

---

## Page 52

Copyright © 2002 OPNET Technologies, Inc.
 52
Traffic Behavior and Queuing in a QoS Environment
M/M/1 System
• Nomenclature: M stands for “Memoryless” (a property of the
exponential distribution)
– M/M/1 stands for Poisson arrival process (which is memoryless)
– M/M/1 stands for exponentially distributed transmission times
•
– Packet tra
ean 1/μ
– One server
– Independent interarrival times and packet transmission times
• Transmission time is proportional to packet length
• Note 1/μ  is secs/packet so μ is packets/sec (packet
transmission rate of the queue)
• Utilization factor: ρ = λ/μ (stable system if ρ 1)

---

## Page 53

Copyright © 2002 OPNET Technologies, Inc.
 53
Traffic Behavior and Queuing in a QoS Environment
Delay Calculation
• Let
Q = Average time spent waiting in queue
T = Average packet delay (transmission plus queuing)
• Note that T = 1/μ + Q
•
N =
where
Nq = Average number waiting in queue
• These quantities can be calculated with formulas derived by
Markov chain analysis (see references)

---

## Page 54

Copyright © 2002 OPNET Technologies, Inc.
 54
Traffic Behavior and Queuing in a QoS Environment
• The analysis gives the steady-state probabilities of
number of packets in queue or transmission
• P{n packets} = ρn(1-ρ)     where ρ = λ/μ
•
T =

M/M/1 Results

---

## Page 55

Copyright © 2002 OPNET Technologies, Inc.
 55
Traffic Behavior and Queuing in a QoS Environment
Example: How Delay Scales with Bandwidth
• Occupancy and delay formulas
N = ρ/(1 - ρ)
T = 1/( - )
ρ = λ/
• Assume:
– System tr
• Then:
– Queue sizes stay at the same level (ρ stays the same)
– Packet delay is cut in half ( and  are doubled
• A conclusion: In high speed networks
– propagation delay increases in importance relative to delay
– buffer size and packet loss may still be a problem

---

## Page 56

Copyright © 2002 OPNET Technologies, Inc.
 56
Traffic Behavior and Queuing in a QoS Environment
M/M/m, M/M/ System
• Same as M/M/1, but it has m (or ) servers
• In M/M/m, the packet at the head of the queue moves
to service when a server becomes free
•
• There are

probabilities and average delay of these systems

---

## Page 57

Copyright © 2002 OPNET Technologies, Inc.
 57
Traffic Behavior and Queuing in a QoS Environment
Finite Buffer Systems: M/M/m/k
• The M/M/m/k system
– Same as M/M/m, but there is buffer space for at most k
packets. Packets arriving at a full buffer are dropped
• Formulas for avera
tate occupancy
• The M/
telephone or circuit switching systems

---

## Page 58

Copyright © 2002 OPNET Technologies, Inc.
 58
Traffic Behavior and Queuing in a QoS Environment
Characteristics of M/M/. Systems
• Advantage: Simple analytical formulas
• Disadvantages:
– The Poisson assumption may be violated
–
– Interarr
dependent (particularly in the network core)
– Head-of-the-line assumption precludes heterogeneous input
traffic with priorities (hard or soft)

---

## Page 59

Copyright © 2002 OPNET Technologies, Inc.
 59
Traffic Behavior and Queuing in a QoS Environment
M/G/1 System
• Same as M/M/1 but the packet transmission time
distribution is general, with given mean 1/μ and
variance σ2
• Utilization factor
•
Average t
Average delay = 1/μ + λ(σ2 + 1/μ2)/2(1- )
• The formulas for the steady-state occupancy
probabilities are more complicated
• Insight: As σ2 increases, delay increases

---

## Page 60

Copyright © 2002 OPNET Technologies, Inc.
 60
Traffic Behavior and Queuing in a QoS Environment
G/G/1 System
• Same as M/G/1 but now the packet interarrival time
distribution is also general, with mean  and
variance 2
• We still assume FIF
nt interarrival
t
• Heavy tr
Average time in queue ~ λ(σ2 + 2)/2(1- )
• Becomes increasingly accurate as 

---

## Page 61

Copyright © 2002 OPNET Technologies, Inc.
 61
Traffic Behavior and Queuing in a QoS Environment
Demo:  M/G/1
Packet inter-arrival times
exponential (0.02) sec
Capacity
1 Mbps
Packet size
1250 bytes
(10000 bits)
Packet size distribution:
exponential
constant
lognormal
What is the average delay and queue size ?

---

## Page 62

Copyright © 2002 OPNET Technologies, Inc.
 62
Traffic Behavior and Queuing in a QoS Environment
Demo:  M/G/1  Analytical Results
Packet Size
Distribution
Delay T (sec)
Queue Size (packets)
Exponential

Consta
mean = 10000
variance  = N/A
0.015
0.75
Lognormal
mean = 10000
variance  = 9.0 *108
0.06
3.0

---

## Page 63

Copyright © 2002 OPNET Technologies, Inc.
 63
Traffic Behavior and Queuing in a QoS Environment
Demo:  M/G/1  Simulation Results
Average Delay (sec)
Average Queue Size (packets)

---

## Page 64

Copyright © 2002 OPNET Technologies, Inc.
 64
Traffic Behavior and Queuing in a QoS Environment
Demo:  M/G/1  Limitations
Application traffic mix not memoryless
•
Video
» constant packet inter-arrivals
•
Http
P-K formula
Simulation

---

## Page 65

Copyright © 2002 OPNET Technologies, Inc.
 65
Traffic Behavior and Queuing in a QoS Environment
Outline
• Basic concepts
• Source models
• Service models (demo)
• Single-queue systems
•
– Preempt
– Cyclic, WFQ, PQ systems
– Demo: Simulation results
• Networks of queues
• Hybrid simulation (demo)

---

## Page 66

Copyright © 2002 OPNET Technologies, Inc.
 66
Traffic Behavior and Queuing in a QoS Environment
Non-preemptive Priority Systems
• We distinguish between different classes of traffic (flows)
• Non-preemptive priority: packet under transmission is not
preempted by a packet of higher priority
• P-K formula for delay

---

## Page 67

Copyright © 2002 OPNET Technologies, Inc.
 67
Traffic Behavior and Queuing in a QoS Environment
Cyclic Service Systems
• Multiple flows, each with its own queue
• Fair system: Each flow gets access to the transmission line in
turn
• Several possible assu
any packets each
f
•
available

---

## Page 68

Copyright © 2002 OPNET Technologies, Inc.
 68
Traffic Behavior and Queuing in a QoS Environment
Weighted Fair Queuing
• A combination of priority and cyclic service
• No exact analytical formulas are available

---

## Page 69

Copyright © 2002 OPNET Technologies, Inc.
 69
Traffic Behavior and Queuing in a QoS Environment
Outline
• Basic concepts
• Source models
• Service models (demo)
• Single-queue systems
•
• Networks
– Violation of M/M/. assumptions
– Effects on delays and traffic shaping
– Analytical approximations
• Hybrid simulation (demo)

---

## Page 70

Copyright © 2002 OPNET Technologies, Inc.
 70
Traffic Behavior and Queuing in a QoS Environment
Two Queues in Series
• First queue shapes the traffic into second queue
• Arrival times and packet lengths are correlated
• M/M/1 and M/G/1 formulas yield significant error for second
queue

---

## Page 71

Copyright © 2002 OPNET Technologies, Inc.
 71
Traffic Behavior and Queuing in a QoS Environment
Two bottlenecks in series
Bottleneck
Exponential
inter-arrivals
Bottleneck
No queuing
delay
Delay

---

## Page 72

Copyright © 2002 OPNET Technologies, Inc.
 72
Traffic Behavior and Queuing in a QoS Environment
Approximations
• Kleinrock independence approximation
– Perform a delay calculation in each queue independently of other
queues
– Add the results (including propagation delay)
•
a
• Tends to b
ffic
mixing”, e.g., nodes serving many relatively small flows from
several different locations

---

## Page 73

Copyright © 2002 OPNET Technologies, Inc.
 73
Traffic Behavior and Queuing in a QoS Environment
Outline
• Basic concepts
• Source models
• Service models (demo)
• Single-queue systems
•
• Networks
• Hybrid simulation
– Explicit vs. aggregated traffic
– Conceptual Framework
– Demo: PQ and WFQ with aggregated traffic

---

## Page 74

Copyright © 2002 OPNET Technologies, Inc.
 74
Traffic Behavior and Queuing in a QoS Environment
Basic Concepts of Hybrid Simulation
• Aims to combine the best of analytical results and simulation
• Achieve significant gain in simulation speed with little loss of
accuracy
• Divides the traffic thro
licit and
– Backgrou
• The interaction of explicit and background is modeled either
analytically or through a “fast” simulation (or a combination)

---

## Page 75

Copyright © 2002 OPNET Technologies, Inc.
 75
Traffic Behavior and Queuing in a QoS Environment
Explicit Traffic
• Modeled in detail, including the effects of various protocols
• Each packet’s arrival and departure times are recorded (together
with other data of interest, e.g., loss, etc.) along each link that it
traverses
• Departure times at a link
t the next link (plus
•
lengths), d

---

## Page 76

Copyright © 2002 OPNET Technologies, Inc.
 76
Traffic Behavior and Queuing in a QoS Environment
Aggregated Traffic
• Simplified modeling
– We don’t keep track of individual packets, only workload counts
(number of packets or bytes)
– We “generate” workload counts
» by probabilistic/analyti
• Aggregate
• Shaping effects are complex to incorporate
• Some dependences between explicit and background traffic
along a chain of links are complicated and are ignored

---

## Page 77

Copyright © 2002 OPNET Technologies, Inc.
 77
Traffic Behavior and Queuing in a QoS Environment
Hybrid Simulation (FIFO Links): Conceptual
Framework
• Given the arrival time ak of the kth explicit packet
• Generate the workload wk found in queue by the kth packet
• From ak and wk generate the departure time of the kth packet as
Time
aK
aK+1
wK
wK+1
dK = aK + wK + sK
Explicit
Explicit
Explicit
Explicit
Background
Background
DEPARTURE TIMES

---

## Page 78

Copyright © 2002 OPNET Technologies, Inc.
 78
Traffic Behavior and Queuing in a QoS Environment
Simulating the Background Traffic Effects
• Use a traffic descriptor for the background traffic (e.g., carried
by special packets)
• Traffic descriptor includes:
– Traffic volume information (e.g., packets/sec, bits/sec)
– Probability distribution
• Generate
k
ns
thereof
– Successive sampling (for FIFO case)
– Steady-state queue length distribution (if we can get it)
– Simplified simulation (microsim - applies to complex queuing
disciplines)

---

## Page 79

Copyright © 2002 OPNET Technologies, Inc.
 79
Traffic Behavior and Queuing in a QoS Environment
Hybrid Simulation (FIFO Case)
• Critical Question: Given arrival times ak and ak+1, workload wk, and background
traffic descriptor, how do we find wk+1?
• Note: wk+1 consists of wk  and two more terms:
– Background arrivals in interval ak+1 - ak
– (Minus) transmitted workload in interval ak+1 - ak
• Must calculate/simulate the two terms
• The first term is simulated based on the traffic descriptor of the background traffic
• The second term is easily calculated if the queue is continuously busy in ak+1 - ak
a1
a2
. .  .
Arrival times/Workload found
w1
w2
d
Departure times

---

## Page 80

Copyright © 2002 OPNET Technologies, Inc.
 80
Traffic Behavior and Queuing in a QoS Environment
Short Interval Case (Easy Case)
• Short interval ak+1 - ak (i.e., ak+1 <  dk)
• Queue is busy continuously in ak+1 - ak
• So wk+1 is quickly simulated
– Sample the background
on to simulate the new
– Do the ac
kload in
ak+1 - ak )
k
d
ak
Time
. .  .
Short Interval
wk
wk+1 = wk + (New bkg arrivals) - (Old bkg transmissions)
d
ak+1
wk+1
k+1

---

## Page 81

Copyright © 2002 OPNET Technologies, Inc.
 81
Traffic Behavior and Queuing in a QoS Environment
Long Interval Case
• Long interval ak+1 - ak (i.e., ak+1 >  dk)
• Queue may be idle during portions of the interval ak+1 - ak
• Need to generate/simulate
– The new arrivals in ak+1 - ak
– The lengths of the busy pe
•
p
• Other alterna

---

## Page 82

Copyright © 2002 OPNET Technologies, Inc.
 82
Traffic Behavior and Queuing in a QoS Environment
Steady-State Queue Length Distribution
• If the interval between two successive explicit packets is very
long, we can assume that the queue found by the second
packet is in steady state
• So, we can obtain wk+1
ady-state
d
•
found or c
– M/M/1 and other M/M/. Queues
– Some M/G/. systems

---

## Page 83

Copyright © 2002 OPNET Technologies, Inc.
 83
Traffic Behavior and Queuing in a QoS Environment
Micro Simulation: Conceptual Framework
• Handles complex queuing systems
– Micro-packets are generated to represent traffic load within the context
of the queue only (i.e., they are not transmitted to any external links)
– For long intervals, wher
y-state is likely
» Sampl
• Microsim speeds up the simulation without sacrificing
accuracy
• Microsim provides a general framework
– Applies to non-stationary background traffic
– Applies to non-FIFO service models (with proper modification)

---

## Page 84

Copyright © 2002 OPNET Technologies, Inc.
 84
Traffic Behavior and Queuing in a QoS Environment
Examples of Applications

---

## Page 85

Copyright © 2002 OPNET Technologies, Inc.
 85
Traffic Behavior and Queuing in a QoS Environment
Demo End-to-end Delay:  Baseline Network
Traffic modeled as

1) Explicit traffic
2) Background traffic

---

## Page 86

Copyright © 2002 OPNET Technologies, Inc.
 86
Traffic Behavior and Queuing in a QoS Environment
Target Flow: ETE delay as a function of ToS
Target flow: Seattle  Houston - modeled using explicit traffic
– Varying its Type of Service (ToS)
» Best Effort (0)
» Streaming Multimedia (4)

---

## Page 87

Copyright © 2002 OPNET Technologies, Inc.
 87
Traffic Behavior and Queuing in a QoS Environment
Explicit Simulation Results for Target Flow
– Total traffic volume
» 500 Mbps
– Time modeled
– Simulatio
» 31 hours

---

## Page 88

Copyright © 2002 OPNET Technologies, Inc.
 88
Traffic Behavior and Queuing in a QoS Environment
Hybrid Simulation Results for Target Flow
– Total traffic volume
» 500 Mbps
– Time modeled
– Simulatio
» 14 minutes

---

## Page 89

Copyright © 2002 OPNET Technologies, Inc.
 89
Traffic Behavior and Queuing in a QoS Environment
Comparison:  Hybrid vs Explicit Simulation

---

## Page 90

Copyright © 2002 OPNET Technologies, Inc.
 90
Traffic Behavior and Queuing in a QoS Environment
References
• Networking
– Bertsekas and Gallager, Data Networks, Prentice-Hall, 1992
• Device Queuing Implementations
– Vegesna, IP Quality of Service, Ciscopress.com, 2001
– <http://www.juniper.net/tec>
.pdf
• P
<http://ww>
– Cohen, Th
– Takagi, Queuing Analysis: A Foundation of Performance Evaluation. (3
Volumes), North-Holland, 1991
– Gross and Harris, Fundamentals of Queuing Theory, Wiley, 1985
– Cooper, Introduction to Queuing Theory, CEEPress, 1981
• OPNET Hybrid Simulation and Micro Simulation
– See Case Studies papers in
<http://secure.opnet.com/services/muc/mtdlogis_cse_stdies_81.html>
