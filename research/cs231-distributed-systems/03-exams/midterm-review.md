# midterm-review

---

## Page 1

Midterm Review
CS 230 – Distributed Systems
(http://www.ics.uci.edu/~cs230)
Nalini Venkatasubramanian
nalini@ics.uci.edu

---

## Page 2

Characterizing Distributed Systems
Distributed Systems
2
! Multiple Autonomous Computers
! each consisting of CPU’s, local memory, stable storage, I/O paths
connecting to the environment
! Geographically Distributed
! Interconnections
! some I/O paths interconnect computers that talk to each other
! Shared State
! No shared memory
! systems cooperate to maintain shared state
! maintaining global invariants requires correct and coordinated operation of
multiple computers.

---

## Page 3

Classifying Distributed Systems
Distributed Systems
3
! Based on degree of synchrony
! Synchronous
! Asynchronous
! Based on communication medium
! Message Passing
! Shared Memory
! Fault model
! Crash failures
! Byzantine failures

---

## Page 4

Computation in distributed systems
Distributed Systems
4
! Asynchronous system
! no assumptions about process execution speeds and message delivery delays
! Synchronous system
! make assumptions about relative speeds of processes and delays associated
with communication channels
! constrains implementation of processes and communication
! Models of concurrency
! Communicating processes
! Functions, Logical clauses
! Passive Objects
! Active objects, Agents

---

## Page 5

Communication in Distributed Systems
Distributed Systems
5
! Provide support for entities to communicate among
themselves
! Centralized (traditional) OS’s - local communication support
! Distributed systems - communication across machine
boundaries (WAN, LAN).
! 2 paradigms
! Message Passing
! Processes communicate by sharing messages
! Distributed Shared Memory (DSM)
! Communication through a virtual shared memory.

---

## Page 6

Fault Models in Distributed Systems
Distributed Systems
6
! Crash failures
! A processor experiences a crash failure when it ceases to
operate at some point without any warning. Failure may not be
detectable by other processors.
! Failstop - processor fails by halting; detectable by other processors.
! Byzantine failures
! completely unconstrained failures
! conservative, worst-case assumption for behavior of hardware
and software
! covers the possibility of intelligent (human) intrusion.

---

## Page 7

Client/Server Computing
Distributed Systems
7
! Client/server computing allocates application processing
between the client and server processes.
! A typical application has three basic components:
! Presentation logic
! Application logic
! Data management logic

---

## Page 8

Distributed Systems Middleware
Distributed Systems
8
! Middleware is the software between the application
programs and the operating System and base networking
! Integration Fabric that knits together applications, devices,
systems software, data
! Middleware provides a comprehensive set of higher-level
distributed computing capabilities and a set of interfaces to
access the capabilities of the system.

---

## Page 9

Virtual Time and Global States in
Distributed Systems
Prof. Nalini Venkatasubramanian
Distributed Systems Middleware - Lecture 2
Includes slides modified from :
A. Kshemkalyani and M. Singhal (Book slides: Distributed Computing: Principles, Algorithms, and Systems

---

## Page 10

Global Time & Global State of Distributed
Systems
! Asynchronous distributed systems consist of several processes without
common memory which communicate (solely) via messages with
unpredictable transmission delays
! Global time & global state are hard to realize in distributed systems
!
Processes are distributed geographically
!
Rate of event occurrence can be high (unpredictable)
!
Event execution times can be  small
! We can only approximate the global view
!
Simulate synchronous distributed system on  given asynchronous systems
!
Simulate a global time – Logical Clocks
!
Simulate a global state – Global Snapshots

---

## Page 11

Simulating global time
! An accurate notion of global time is difficult to achieve in distributed
systems.
! We often derive “causality” from loosely synchronized clocks
! Clocks in a distributed system drift
! Relative to each other
! Relative to a real world clock
! Determination of this real world clock itself may be an issue
! Clock Skew versus Drift
• Clock Skew = Relative Difference in clock values of two processes
• Clock Drift = Relative Difference in clock frequencies (rates) of two processes
! Clock synchronization is needed to simulate global time
! Correctness – consistency, fairness
! Physical Clocks vs. Logical clocks
! Physical clocks - must not deviate from the real-time by more than a certain amount.

---

## Page 12

Physical Clocks
! How do we measure real time?
! 17th century - Mechanical clocks based on astronomical
measurements
! Problem (1940) - Rotation of the earth varies (gets slower)
! Mean solar second - average over many days
! 1948
! counting transitions of a crystal (Cesium 133) used as atomic clock
! TAI - International Atomic Time
! 9192631779 transitions = 1 mean solar second in 1948
! UTC (Universal Coordinated Time)
! From time to time, we skip a solar second to stay in phase with the sun (30+
times since 1958)
! UTC is broadcast by several sources (satellites…)

---

## Page 13

Cristian’s (Time Server) Algorithm
! Uses a time server to synchronize clocks
! Time server keeps the reference time (say UTC)
! A client asks the time server for time, the server responds with its current time,
and the client uses the received value T to set its clock
! But network round-trip time introduces errors…
! Let RTT = response-received-time – request-sent-time (measurable at client),
! If we know (a) min = minimum client-server one-way transmission time and (b) that the
server timestamped the message at the last possible instant before sending it back
! Then, the actual time could be between [T+min,T+RTT— min]

---

## Page 14

Berkeley UNIX algorithm
! One daemon without UTC
! Periodically, this daemon polls and asks all the machines for
their time
! The machines respond.
! The daemon computes an average time and then broadcasts
this average time.

---

## Page 15

Decentralized Averaging Algorithm
! Each machine has a daemon without UTC
! Periodically, at fixed agreed-upon times, each machine
broadcasts its local time.
! Each of them calculates the average time by averaging all the
received local times.

---

## Page 16

Clock Synchronization in DCE
! DCE’s time model is actually in an interval
! I.e. time in DCE is actually an interval
! Comparing 2 times may yield 3 answers
! t1 < t2
! t2 < t1
! not determined
! Each machine is either a time server or a clerk
! Periodically a clerk contacts all the time servers on its LAN
! Based on their answers, it computes a new time and gradually
converges to it.

---

## Page 17

Network Time Protocol (NTP)
! Most widely used physical clock synchronization protocol on the
Internet
! 10-20 million NTP servers and clients  in the Internet
! Claimed Accuracy (Varies)
! milliseconds on WANs, submilliseconds on LANs
! Hierarchical tree of time servers.
! The primary server at the root synchronizes with the UTC.
! Secondary servers - backup to primary server.
! Lowest
!
synchronization subnet with clients.

---

## Page 18

Logical Time

---

## Page 19

Causal Relations
! Distributed application results in a set of distributed events
! Induces a partial order à causal precedence relation
! Knowledge of this causal precedence relation is useful in
reasoning about and analyzing the properties of distributed
computations
! Liveness and fairness in mutual exclusion
! Consistency in replicated databases
! Distributed debugging, checkpointing

---

## Page 20

Event Ordering
! Lamport defined the “happens before” (<) relation
! If a and b are events in the same process, and a occurs before b,
then a<b.
! If a is the event of a message being sent by one process and b is
the event of the message being received by another process,
then a < b.
! If X <Y and Y<Z then X < Z.
If a < b then time (a) < time (b)

---

## Page 21

Causal Ordering
! “Happens Before” also called causal ordering
! Possible to draw a causality relation between  2 events if
! They happen in the same process
! There is a chain of messages between them
! “Happens Before” notion is not straightforward in
distributed systems
! No guarantees of synchronized clocks
! Communication latency

---

## Page 22

Implementing Logical Clocks
! Requires
! Data structures local to every process to represent logical time and
! a protocol to update the data structures to ensure the consistency condition.
! Each process Pi maintains data structures that allow it the following two capabilities:
! A local logical clock, denoted by LCi , that helps process Pi measure its own progress.
! A logical global clock, denoted by GCi , that is a representation of process Pi ’s local view
of the logical global time. Typically, LCi is a part of GCi
! The protocol ensures that a process’s logical clock, and thus its view of the global
time, is managed consistently.
! The protocol consists of the following two rules:
! R1: This rule governs how the local logical clock is updated by a process when it executes an
event.
! R2: This rule governs how a process updates its global logical clock to update its view of the
global time and global progress.

---

## Page 23

Types of Logical Clocks
! Systems of logical clocks differ in their representation of
logical time and also in the protocol to update the logical
clocks.
! 3 kinds of logical clocks
! Scalar
! Vector
! Matrix

---

## Page 24

Scalar Logical Clocks - Lamport
! Proposed by Lamport in 1978 as an attempt to totally
order events in a distributed system.
! Time domain is the set of non-negative integers.
! The logical local clock of a process Pi and its local view
of the global time are squashed into one integer variable
Ci .
! Monotonically increasing counter
! No relation with real clock
! Each process keeps its own logical clock used to
timestamp events

---

## Page 25

Consistency with Scalar Clocks
! Local clocks must obey a simple protocol:
! When executing an internal event or a send event at process Pi
the clock Ci ticks
! Ci += d (d>0)
! When Pi sends a message m, it piggybacks a logical timestamp t
which equals the time of the send event
! When executing a receive event at Pi where a message with
timestamp t is received, the clock is advanced
! Ci = max(Ci,t)+d   (d>0)
! Results in a partial ordering of events.

---

## Page 26

Total Ordering
! Extending partial order to total order
! Global timestamps:
! (Ta, Pa) where Ta is the local timestamp and Pa is the process id.
! (Ta,Pa) < (Tb,Pb) iff
! (Ta < Tb) or   ( (Ta = Tb) and (Pa < Pb))
! Total order is consistent with partial order.
time
Proc_id

---

## Page 27

Vector Times
! The system of vector clocks was developed independently by Fidge, Mattern and
Schmuck.
! In the system of vector clocks, the time domain is represented by a set of n-
dimensional non-negative integer vectors.
! Each process has a clock Ci consisting of a vector  of length n, where n is the total
number of processes vt[1..n], where vt[j ] is the local logical clock of Pj and
describes the logical time progress at process Pj .
! A process Pi ticks by incrementing its own component of its clock
! Ci[i] += 1
! The timestamp C(e) of an event e is the clock value after ticking
! Each message gets a piggybacked timestamp consisting of the vector of the local
clock
! The process gets some knowledge about the other process’ time approximation
! Ci=sup(Ci,t):: sup(u,v)=w : w[i]=max(u[i],v[i]), "i

---

## Page 28

Vector Clocks example
From A. Kshemkalyani and M. Singhal (Distributed Computing)
Figure 3.2: Evolution of vector time.

---

## Page 29

Matrix Time
! Vector time contains information about latest direct
dependencies
! What does Pi know about Pk
! Also contains info about latest direct dependencies of
those dependencies
! What does Pi know about what Pk knows about Pj
! Message and computation overheads are high
! Powerful and useful for applications like distributed
garbage collection

---

## Page 30

Simulate A Global State
! Recording the global state of a distributed system on-the-fly is an
important paradigm.
! Challenge: lack of globally shared memory, global clock and unpredictable
message delays in a distributed system
! Notions of global time and global state closely related
! A process can (without freezing the whole computation) compute the
best possible approximation of global state
! A global state that could have occurred
! No process in the system can decide whether the state did really occur
! Guarantee stable properties (i.e. once they become true, they remain true)

---

## Page 31

Consistent Cuts
! A cut (or time slice) is a zigzag line cutting a time diagram into 2 parts
(past and future)
! E is augmented with a cut event ci for each process Pi:E’ =E È {ci,…,cn} \
! A cut C of an event set E is a finite subset CÍE: eÎC Ù e’<le ®e’ÎC
! A cut C1 is later than C2 if C1ÊC2
! A consistent cut C of an event set E is a finite subset CÍE : eÎC Ù e’<e ®e’ ÎC
! i.e. a cut is consistent if every message received was previously sent (but not necessarily vice
versa!)

---

## Page 32

P2
P1
P3
Time
Instant of local
observation
ideal
(vertical)
cut
(15)
consistent
cut
(15)
inconsistent
cut
(19)
5
5
5
3
2
8
Cuts (Summary)
1
4
3
4
0
7
initial
value
not attainable
equivalent to a vertical cut
(rubber band transformation)
can’t be made vertical
(message from the future)
“Rubber band transformation” changes metric, but keeps topology

---

## Page 33

System Model for Global Snapshots
! The system consists of a collection of n processes p1, p2, ..., pn
that are connected by channels.
! There are no globally shared memory and physical global clock
and processes communicate by passing messages through
communication channels.
! Cij denotes the channel from process pi to process pj and its state
is denoted by SCij .
! The actions performed by a process are modeled as three types of
events:
! Internal events,the message send event and the message receive event.
! For a message mij that is sent by process pi to process pj , let send(mij ) and
rec(mij ) denote its send and receive events.

---

## Page 34

Process States and Messages in transit
! At any instant, the state of process pi , denoted by LSi , is a result of the
sequence of all the events executed by pi till that instant.
! For an event e and a process state LSi , e∈LSi iff e belongs to the sequence of
events that have taken process pi to state LSi .
! For an event e and a process state LSi , e (not in) LSi iff e does not belong to the
sequence of events that have taken process pi to state LSi .
! For a channel Cij , the following set of messages can be defined based on the
local states of the processes pi and pj
Transit: transit(LSi , LSj ) = {mij |send(mij ) ∈LSi V
rec(mij ) (not in) LSj }

---

## Page 35

Global States of Consistent Cuts
! The global state of a distributed system is a collection of the local
states of the processes and the channels.
! A global state computed along a consistent cut is correct
! The global state of a consistent cut comprises the local state of each
process at the time the cut event  happens and the set of all
messages sent but not yet received
! The snapshot problem consists in designing an efficient protocol
which yields only consistent cuts and to collect the local state
information
! Messages crossing the cut must be captured
! Chandy & Lamport presented an algorithm assuming that message transmission is
FIFO

---

## Page 36

Chandy-Lamport Distributed Snapshot
Algorithm
! Assumes FIFO communication in channels
! Uses a control message, called a marker to separate messages in the channels.
! After a site has recorded its snapshot, it sends a marker, along all of its outgoing
channels before sending out any more messages.
! The marker separates the messages in the channel into those to be included in the
snapshot from those not to be recorded in the snapshot.
! A process must record its snapshot no later than when it receives a marker on
any of its incoming channels.
! The algorithm terminates after each process has received a marker on all of its
incoming channels.
! All the local snapshots get disseminated to all other processes and all the
processes can determine the global state.

---

## Page 37

Chandy-Lamport Distributed Snapshot
Algorithm
Marker receiving rule for Process Pi
If (Pi has not yet recorded its state) it
records its process state now
records the state of c as the empty set
turns on recording of messages arriving over other channels
else
Pi records the state of c as the set of messages received over c
since it saved its state
Marker sending rule for Process Pi
After Pi has recorded its state,for each outgoing channel c:
Pi sends one marker message over c
(before it sends any other message over c)

---

## Page 38

Chandy-Lamport Extensions: Spezialetti-
Kerns and others
❚
Exploit concurrently initiated snapshots to reduce overhead of local snapshot
exchange
! Snapshot Recording
! Markers carry identifier of initiator – first initiator recorded in a per process“master”
variable.
! Region - all the processes whose master field has same initiator.
! Identifiers of concurrent initiators recorded in “id-border-set.”
! Snapshot Dissemination
! Forest of spanning trees is implicitly created in the system. Every Initiator is root of a
spanning tree; nodes relay snapshots of rooted subtree to parent in spanning tree
! Each initiator assembles snapshot for processes in its region and exchanges with initiators in
adjacent regions.
! Others: multiple repeated snapshots; wave algorithm

---

## Page 39

Computing Global States without FIFO
Assumption
! In a non-FIFO system, a marker cannot be used to
delineate messages into those to be recorded in the
global state from those not to be recorded in the global
state.
! In a non-FIFO system, either some degree of inhibition
or piggybacking of control information on computation
messages to capture out-of-sequence messages.

---

## Page 40

Non-FIFO Channel Assumption:
Lai-Yang Algorithm
! Emulates marker by using a coloring scheme
! Every Process: White (before snapshot);  Red (after snapshot).
! Every message sent by a white (red) process is colored white (red) indicating if it was sent
before(after) snapshot.
! Each process (which is initially white) becomes red as soon as it receives a red message for the first
time and starts a virtual broadcast algorithm to ensure that all processes will eventually become red
!
Get Dummy red messages to all processes (Flood neighbors)
! Determining Messages in transit
! White process records history of white msgs sent/received on  each channel.
! When a process turns red, it sends these histories along with its snapshot to the initiator process that
collects the global snapshot.
! Initiator process evaluates transit(LSi , LSj ) to compute state of a channel Cij :
! SCij = white messages sent by pi on Cij − white messages received by pj on Cij = \
{send(mij )|send(mij ) ∈LSi } − {rec(mij )|rec(mij ) ∈LSj }.

---

## Page 41

Non-FIFO Channel Assumption:
Termination Detection
! Required to detect that no white messages are in transit.
! Method 1: Deficiency Counting
! Each process Pi keeps a counter cntri that indicates the difference between the number of white
messages it has sent and received before recording its snapshot.
! It reports this value to the initiator process along with its snapshot and forwards all white messages, it
receives henceforth, to the initiator.
! Snapshot collection terminates when the initiator has received Σi cntri number of forwarded white
messages.
! Method 2
! Each red message sent by a process carries a piggybacked value of the number of white messages sent
on that channel before the local state recording.
! Each process keeps a counter for the number of white messages received on each channel.
! A process can detect termination of recording the states of incoming channels when it receives as
many white messages on each channel as the value piggybacked on red messages received on that
channel.

---

## Page 42

Non-FIFO Channel Assumption: Mattern Algorithm
! Uses Vector Clocks and assumes a single initiator
! All process agree on some future virtual time s or a set of virtual time instants
s1,…sn which are mutually concurrent and did not yet occur
! A process takes its local snapshot at virtual time s
! After time s the local snapshots are collected to construct a global snapshot
! Pi ticks and then fixes its next time s=Ci +(0,…,0,1,0,…,0) to be the common
snapshot time
! Pi broadcasts s
! Pi blocks waiting for all the acknowledgements
! Pi ticks again (setting Ci=s), takes its snapshot and broadcast a dummy message (i.e.
force everybody else to advance their clocks to a value ³ s)
! Each process takes its snapshot and sends it to Pi when its local clock becomes ³ s

---

## Page 43

Non-FIFO Channel Assumption:
Mattern Algorithm
! Inventing a n+1 virtual process whose clock is managed by Pi
! Pi can use its clock and because the virtual clock Cn+1 ticks only when Pi initiates a
new run of snapshot :
! The first n component of the vector can be omitted
! The first broadcast phase is unnecessary
! Counter modulo 2

---

## Page 44

Distributed Operating Systems -
Introduction
Prof. Nalini Venkatasubramanian
(includes slides from Prof. Petru Eles and Profs. textbook slides by
Kshemkalyani/Singhal)

---

## Page 45

! Process/Thread Management
! Scheduling
! Communication
! Synchronization
! Memory Management
! Storage Management
! FileSystems Management
! Protection and Security
! Networking
What does an OS do?

---

## Page 46

Operating System Types
! Multiprocessor OS
! Looks like a virtual uniprocessor, contains only one copy of the OS,
communicates via shared memory, single run queue
! Network OS
! Does not look like a virtual uniprocessor, contains n copies of the OS,
communicates via shared files, n run queues
! Distributed OS
! Looks like a virtual uniprocessor (more or less), contains n copies of the
OS, communicates via messages, n run queues

---

## Page 47

Design Elements
! Communication
! Two basic IPC paradigms used in DOS
! Message Passing (RPC)  and Shared Memory
! synchronous, asynchronous
! Process Management
! Process synchronization
! Coordination of distributed processes is inevitable
! mutual exclusion, deadlocks, leader election
! Task Partitioning, allocation, load balancing, migration
! FileSystems
! Naming of files/directories
! File sharing semantics
! Caching/update/replication

---

## Page 48

Remote Procedure Call
A convenient way to construct a client-server connection without
explicitly writing send/ receive type programs (helps maintain
transparency).

---

## Page 49

Remote Procedure Call (cont.)
! Client procedure calls the client stub in a normal way
! Client stub builds a message and traps to the kernel
! Kernel sends the message to remote kernel
! Remote kernel gives the message to server stub
! Server stub unpacks parameters and calls the server
! Server computes results and returns it to server stub
! Server stub packs results in a message and traps to kernel
! Remote kernel sends message to client kernel
! Client kernel gives message to client stub
! Client stub unpacks results and returns to client

---

## Page 50

Distributed Shared Memory
! Provides a shared-memory abstraction in the loosely coupled
distributed-memory processors.
! Issues
! Granularity of the block size
! Synchronization
! Memory Coherence (Consistency models)
! Data Location and Access
! Replacement Strategies
! Thrashing
! Heterogeneity

---

## Page 51

Distributed Mutual Exclusion
! Mutual exclusion
! ensures that concurrent processes have serialized access to shared
resources  - the critical section problem.
! At any point in time, only one process can be executing in its critical
section.
! Shared variables (semaphores) cannot be used in a distributed
system
! Mutual exclusion must be based on message passing, in the context of
unpredictable delays and incomplete knowledge
! In some applications (e.g. transaction processing) the resource is managed
by a server which implements its own lock along with mechanisms to
synchronize access to the resource.

---

## Page 52

Approaches to Distributed Mutual Exclusion
! Central coordinator based approach
! A centralized coordinator determines who enters the CS
! Distributed approaches to mutual exclusion
! Token based approach
! A unique token is shared among the sites. A site is allowed to enter its CS if it possesses the
token.
! Mutual exclusion is ensured because the token is unique.
! Non-token based approach
! Two or more successive rounds of messages are exchanged among the sites to determine
which site will enter the CS next.
! Quorum based approach
! Each site requests permission to execute the CS from a subset of sites (called a quorum).
! Any two quorums contain a common site. This common site is responsible to make sure that
only one request executes the CS at any time.

---

## Page 53

Requirements/Conditions
! Safety Property (Mutual Exclusion)
! At any instant, only one process can execute the critical section.
! Liveness Property (Progress)
! This property states the absence of deadlock and starvation.
Two or more sites should not endlessly wait for messages which
will never arrive.
! Fairness (Bounded Waiting)
! Each process gets a fair chance to execute the CS. Fairness
property generally means the CS execution requests are
executed in the order of their arrival (time is determined by a
logical clock) in the system.

---

## Page 54

Performance Metrics for Mutual Exclusion
Algorithms
! Message complexity
! The number of messages required per CS execution by a site.
! Synchronization delay
! After a site leaves the CS, it is the time required before the next site enters
the CS
! Response time
! The time interval a request waits for its CS execution to be over after its
request messages have been sent out
! System throughput
! The rate at which the system executes requests for the CS.
System throughput=1/(SD+E)
where SD is the synchronization delay and E is the average critical section
execution time

---

## Page 55

Mutual Exclusion Techniques Covered
! Central Coordinator Algorithm
! In a distributed environment it seems more natural to implement
mutual exclusion, based upon distributed agreement - not on a
central coordinator.
! Distributed Non-token based (Timestamp-Based Algorithms)
! Lamport’sAlgorithm
! Ricart-Agrawala1 Algorithm
! Variation – Quorum based (Maekawa’sAlgorithm)
! Distributed Token Based
! Ricart-Agrawala Second Algorithm
! Token Ring Algorithm

---

## Page 57

Lamport’s Algorithm
! Basic Idea
! Requests for CS are executed in the increasing order of
timestamps and time is determined by logical clocks.
! Every site S_i keeps a queue, request queue_i , which contains
mutual exclusion requests ordered by their timestamps.
! This algorithm requires communication channels to deliver
messages the FIFO order.

---

## Page 58

Lamport’s Algorithm
! Requesting the critical section
! When a site Si wants to enter the CS, it broadcasts a REQUEST(ts_i , i ) message to all other
sites and places the request on request queuei . ((ts_i , i ) denotes the timestamp of the
request.)
! When a site Sj receives the REQUEST(ts_i , i ) message from site Si , it places site Si ’s request
on request queue of j and returns a timestamped REPLY message to Si
! Executing the critical section
! Site Si enters the CS when the following two conditions hold:
!
L1: Si has received a message with timestamp larger than (ts_i, i)from all other sites.
!
L2: Si ’s request is at the top of request queue_i .
! Releasing the critical section
! Site Si , upon exiting the CS, removes its request from the top of its request queue and
broadcasts a timestamped RELEASE message to all other sites.
! When a site Sj receives a RELEASE message from site Si , it removes Si ’s request from its
request queue.
! When a site removes a request from its request queue, its own request may come at the top of
the queue, enabling it to enter the CS.

---

## Page 59

Performance – Lamport’s Algorithm
! For each CS execution Lamport’s algorithm requires
! (N − 1) REQUEST messages, (N − 1) REPLY messages, and (N − 1) RELEASE
messages.
! Thus, Lamport’s algorithm requires 3(N − 1) messages per CS invocation.
! Optimization
! In Lamport’s algorithm, REPLY messages can be omitted in certain situations.
! For example, if site Sj receives a REQUEST message from site Si after it has sent its
own REQUEST message with timestamp higher than the timestamp of site Si ’s
request, then site Sj need not send a REPLY message to site Si .
! This is because when site Si receives site Sj ’s request with timestamp higher than its
own, it can conclude that site Sj does not have any smaller timestamp request which
is still pending.
! With this optimization, Lamport’s algorithm requires between 3(N − 1) and 2(N −
1) messages per CS execution.

---

## Page 60

Ricart-Agrawala Algorithm
! Uses only two types of messages – REQUEST and REPLY.
! It is assumed that all processes keep a (Lamport’s) logical clock which is
updated according to the clock rules.
! The algorithm requires a total ordering of requests. Requests are ordered according
to their global logical timestamps; if timestamps are equal, process identifiers are
compared to order them.
! The process that requires entry to a CS multicasts the request message to all
other processes competing for the same resource.
! Process is allowed to enter the CS when all processes have replied to this message.
! The request message consists of the requesting process’ timestamp (logical clock) and
its identifier.
! Each process keeps its state with respect to the CS: released, requested, or held.

---

## Page 62

Quorum-Based Consensus –
Maekawa’s Algorithm
! Site obtains permission only from a subset of sites to enter CS
! Multicasts messages to a voting subset of processes’
! Each process pi is associated with a voting set vi (of processes)
! Each process belongs to its own voting set
! The intersection of any two voting sets is non-empty
! Each voting set is of size K
! Each process belongs to M other voting sets
! To access a critical section, pi requests permission from all other processes in its own voting set
vi
! Voting set member gives permission to only one requestor at a time, and queues all other requests
! Guarantees safety
! May not guarantee liveness (may deadlock)
! Maekawa showed that K=M=ÖN works best
!
One way of doing this is to put N processes in a ÖN by ÖN  matrix and take union of row & column containing pi as
its voting set.

---

## Page 64

Ricart-Agrawala Second Algorithm
! A process is allowed to enter the critical section when it gets the token.
! Initially the token is assigned arbitrarily to one of the processes.
! In order to get the token it sends a request to all other processes competing for the same
resource.
! The request message consists of the requesting process’ timestamp (logical clock) and its identifier.
! When a process Pi leaves a critical section
! it passes the token to one of the processes which are waiting for it; this will be the first process Pj,
where j is searched in order [ i+1, i+2, ..., n, 1, 2, ..., i-2, i-1] for which there is a pending request.
! If no process is waiting, Pi retains the token (and is allowed to enter the CS if it needs); it will pass
over the token as result of an incoming request.
! How does Pi find out if there is a pending request?
! Each process Pi records the timestamp corresponding to the last request it got from process Pj, in
request Pi[ j]. In the token itself, token[ j] records the timestamp (logical clock) of Pj’s last holding of
the token. If requestPi[ j] > token[ j] then Pj has a pending request.

---

## Page 66

Suzuki-Kazami Broadcast Algorithm
! If a site wants to enter the CS and it does not have the token, it broadcasts a
REQUEST message for the token to all other sites.
! A site which possesses the token sends it to the requesting site upon the receipt
of its REQUEST message.
! If a site receives a REQUEST message when it is executing the CS, it sends the
token only after it has completed the execution of the CS.
! Two Issues
! Outdated Requests: Due to variable message delays, site may receive token request message
after request has been satisfied.  Token to outdated requestor results in poor performance
! When a process is done, which of the outstanding requests should it satisfy?

---

## Page 67

Election Algorithms
! It doesn’t matter which process is elected.
! What is important is that one and only one process is chosen (we call this process the
coordinator) and all processes agree on this decision.
! Assume that each process has a unique number (identifier).
! In general, election algorithms attempt to locate the process with the highest number, among
those which currently are up.
! Election is typically started after a failure occurs.
! The detection of a failure (e.g. the crash of the current coordinator) is normally based on time-
out à a process that gets no response for a period of time suspects a failure and initiates an
election process.
! An election process is typically performed in two phases:
! Select a leader with the highest priority.
! Inform all processes about the winner.

---

## Page 68

The Bully Algorithm
!
A process has to know the identifier of all other processes
!
(it doesn’t know, however, which one is still up); the process with the highest identifier, among those which are up,
is selected.
!
Any process could fail during the election procedure.
!
When a process Pi detects a failure and a coordinator has to be elected
!
it sends an election message to all the processes with a higher identifier and then waits for an answer message:
!
If no response arrives within a time limit
!
Pi becomes the coordinator (all processes with higher identifier are down)
!
it broadcasts a coordinator message to all processes to let them know.
!
If an answer message arrives,
!
Pi knows that another process has to become the coordinator à it waits in order to receive the coordinator message.
!
If this message fails to arrive within a time limit (which means that a potential coordinator crashed after sending the answer
message) Pi resends the election message.
!
When receiving an election message from Pi
!
a process Pj replies with an answer message to Pi and
!
then starts an election procedure itself( unless it has already started one) it sends an election message to all processes
with higher identifier.
!
Finally all processes get an answer message, except the one which becomes the coordinator.

---

## Page 70

The Ring-based Algorithm
! We assume that the processes are arranged in a logical ring
! Each process knows the address of one other process, which is its neighbor in the clockwise
direction.
! The algorithm elects a single coordinator, which is the process with the highest
identifier.
! Election is started by a process which has noticed that the current coordinator has
failed.
! The process places its identifier in an election message that is passed to the following
process.
! When a process receives an election message
! It compares the identifier in the message with its own.
! If the arrived identifier is greater, it forwards the received election message to its neighbor
! If the arrived identifier is smaller it substitutes its own identifier in the election message before
forwarding it.
! If the received identifier is that of the receiver itself à this will be the coordinator.
! The new coordinator sends an elected message through the ring.

---

## Page 72

Distributed Deadlocks
! Deadlocks is a fundamental problem in distributed systems.
! A process may request resources in any order, which may not be known a priori
and a process can request resource while holding others.
! If the sequence of the allocations of resources to the processes is not controlled,
deadlocks can occur.
! A deadlock is a state where a set of processes request resources that are held by
other processes in the set.
! Conditions for a deadlocks
! Mutual exclusion, hold-and-wait, No-preemption and circular wait.

---

## Page 73

Modeling Deadlocks
! In addition to the standard assumptions (no shared memory, no global clock, no
failures), we make the following assumptions:
! The systems have only reusable resources.
! Processes are allowed to make only exclusive access to resources.
! There is only one copy of each resource.
! A process can be in two states: running or blocked.
! In the running state (also called active state), a process has all the needed resources and is either
executing or is ready for execution.
! In the blocked state, a process is waiting to acquire some resource.
! The state of the system can be modeled by directed graph, called a wait for graph
(WFG).
! In a WFG , nodes are processes and there is a directed edge from node P1 to mode P2 if P1 is blocked
and is waiting for P2 to release some resource.
! A system is deadlocked if and only if there exists a directed cycle or knot in the
WFG.

---

## Page 74

Techniques for Handling Deadlocks
! Note: No site has accurate knowledge of the current state of the
system
! Techniques
! Deadlock Prevention (collective/ordered requests, preemption)
! Inefficient, impractical
! Deadlock Avoidance
! A resource is granted to a process if the resulting global system state is safe
! Requires advance knowledge of processes and their resource requirements
! Impractical
! Deadlock Detection and Recovery
! Maintenance of local/global WFG and searching of the WFG for the presence of cycles (or knots),
local/centralized deadlock detectors
! Recovery by operator intervention, break wait-for dependencies, termination and rollback

---

## Page 75

Classes of Deadlock Detection
Algorithms
! Path-pushing
! distributed deadlocks are detected by maintaining an explicit global WFG (constructed
locally and pushed to neighbors)
! Edge-chasing (single resource model, AND model)
! the presence of a cycle in a distributed graph structure is be verified by propagating
special messages called probes, along the edges of the graph. The formation of cycle
can be detected by a site if it receives the matching probe sent by it previously.
! Diffusion computation (OR model, AND-OR model)
! deadlock detection computation is diffused through the WFG of the system.
! Global state detection (Unrestricted, P-out-of-Q model)
! Take a snapshot of the system and examining it for the condition of a
deadlock.

---

## Page 76

Process Management
! Process migration
! Freeze the process on the source node and restart it at the destination node
! Transfer of the process address space
! Forwarding messages meant for the migrant process
! Handling communication between cooperating processes separated as a
result of migration
! Handling child processes
! Process migration in heterogeneous systems

---

## Page 77

Mosix: File Access
Each file access must go back to deputy…
= = Very Slow for I/O apps.
Solution: Allow processes to access a distributed file system
through the current kernel.

---

## Page 78

Mosix: File Access
! DFSA
! Requirements (cache coherent, monotonic timestamps, files not deleted until all nodes
finished)
! Bring the process to the files.
! MFS
! Single cache (on server)
! /mfs/1405/var/tmp/myfiles

---

## Page 79

Dynamic Load Balancing
! Dynamic Load Balancing on Highly Parallel Computers
! Seek to minimize total execution time of a single application running in parallel on a multiprocessor
system
! Sender Initiated Diffusion (SID), Receiver Initiated Diffusion(RID), Hierarchical Balancing
Method (HBM), Gradient Model (GM), Dynamic Exchange method (DEM)
!
Dynamic Load Balancing on Web Servers
! Seek to improve response time using distributed web-server architectures , by scheduling client requests
among multiple nodes in a transparent way
! Client-based approach, DNS-Based approach, Dispatcher-based approach, Server-based approach
! Dynamic Load Balancing on Multimedia Servers
! Aim to maximize requests and preserve QoS for admitted requests by adaptively scheduling requests
given knowledge  of where objects are placed
! Adaptive Scheduling of Video Objects, Predictive Placement of Video Objects

---

## Page 80

Distributed File Systems (DFS)
! DFS is a distributed implementation of the classical file system model
! Issues - File and directory naming, semantics of file sharing
! Important features of DFS
! Transparency, Fault Tolerance
! Implementation considerations
! caching, replication, update protocols
! The general principle of designing DFS: know the clients have cycles to burn,
cache whenever possible, exploit usage properties, minimize system wide
change, trust the fewest possible entries and batch if possible.

---

## Page 81

File Sharing Semantics
! One-copy semantics
! Updates are written to the single copy and are available immediately
! Serializability
! Transaction semantics (file locking protocols implemented - share for
read, exclusive for write).
! Session semantics
! Copy file on open, work on local copy and copy back on close

---

## Page 82

Example: Sun-NFS
! Supports heterogeneous systems
! Architecture
! Server exports one or more directory trees for access by remote clients
! Clients access exported directory trees by mounting them to the client
local tree
! Diskless clients mount exported directory to the root directory
! Protocols
! Mounting protocol
! Directory and file access protocol - stateless, no open-close messages, full
access path on read/write
! Semantics - no way to lock files

---

## Page 83

Example: Andrew File System
! Supports information sharing on a large scale
! Uses a session semantics
! Entire file is copied to the local machine (Venus) from the
server (Vice) when open.  If file is changed, it is copied to
server when closed.
! Works because in practice, most files are changed by one person

---

## Page 84

The Coda File System
! Descendant of AFS that is substantially more resilient to server and
network failures.
! Support for “mobile” users.
! Directories are replicated in several servers (Vice)
! When the Venus is disconnected, it uses local versions of files.
When Venus reconnects, it reintegrates using optimistic update
scheme.

---

## Page 85

Messaging and Group
Communication
ICS 230  Distributed Systems
(with some slides modified from S.Ghosh’s classnotes)

---

## Page 86

What type of group communication ?
! Open group (anyone can join, customers of Walmart)
! Closed groups (closed membership, class of 2000)
! Peer
! All members are equal, All members send messages to the group
! All members receive all the messages
! E.g. UCI students, UCI faculty
! Client-Server
! Common communication pattern
! replicated servers
! Client may or may not care which server answers
! Diffusion group
! Servers sends to other servers and clients
! Hierarchical (one or more members are diff. from the rest)
! Highly and easy scalable
Svrs
Clients

---

## Page 87

Multicast
! Basic Multicast: Does not consider failures
❚
Liveness: Each process must receive every message
❚
Integrity : No spurious message received
❚
No duplicates: Accepts exactly one copy of a message
❚Reliable multicast:  tolerates (certain kinds of) failures.
❚Atomic Multicast:
❚
A multicast is atomic, when the message is delivered to every correct
member, or to no member at all.
❚
In general, processes may crash, yet the atomicity of the multicast is to be
guaranteed.
❚Reliable Atomic Multicast
❚
Scalability a key issue

---

## Page 88

Steiner Trees and Core Based Trees
! Given a weighted graph (N, L) and a subset N’ in  N, identify a subset L’ in L
such that (N’ ,L’) is a subgraph of (N,L) that connects all the nodes of N’.
!
A minimal Steiner tree is a minimal weight subgraph (N’; L’).
!
NP-complete ; need heuristics
! Core-based Trees
!
Multicast tree constructed dynamically, grows on demand.
!
Each group has a core node(s)
!
A node wishing to join the tree as a receiver sends a unicast join message to the core node.
!
The join marks the edges as it travels; it either reaches the core node, or some node already part of the tree.
The path followed by the join till the core/multicast tree is grafted to the multicast tree.
!
A node on the tree multicasts a message by using flooding on the core tree.
!
A node not on the tree sends a message towards the core node; as soon as the message reaches any node on
the tree, it is flooded on the tree.

---

## Page 89

Using Traditional Transport Protocols
! TCP/IP
! Automatic flow control, reliable delivery, connection service, complexity
! linear degradation in performance
! Unreliable broadcast/multicast
! UDP, IP-multicast - assumes h/w support
! IP-multicast
! A bandwidth-conserving technology where the router reduces traffic by replicating a single
stream of information and forwarding them to multiple clients.
! Sender sends a single copy to a special multicast IP address (Class D) that represents a group,
where other members register.
! message losses high(30%) during heavy load
! Reliable IP-multicast very expensive

---

## Page 90

Group Communication Issues
! Ordering
! Delivery Guarantees
! Membership
! Failure

---

## Page 91

Ordering Service
! Unordered
! Single-Source FIFO (SSF)
! For all messages m1, m2 and all objects ai, aj, if ai sends m1 before it sends m2, then m2 is
not received at aj before m1 is
! Totally Ordered
! For all messages m1, m2 and all objects ai, aj, if m1 is received at ai before m2 is, the m2 is
not received at aj before m1 is
! Causally Ordered
! For all messages m1, m2 and all objects ai, aj, if m1 happens before  m2, then  m2 is not
received at  ai before m1 is

---

## Page 92

Delivery guarantees
! Agreed Delivery
! guarantees total order of message delivery and  allows a message to be
delivered as soon as all of its predecessors in the total order have been
delivered.
! Safe Delivery
! requires in addition, that if a message is delivered by the GC to any of
the processes in a configuration, this message has been received and
will be delivered to each of the processes in the configuration unless it
crashes.

---

## Page 93

Membership
! Messages addressed to the group are received by all group members
! If processes are added to a group or deleted from it (due to process crash, changes in
the network or the user's preference), need to report the change to all active group
members, while keeping consistency among them
! Every message is delivered in the context of a certain configuration, which is not
always accurate. However, we may want to guarantee
! Failure atomicity
! Uniformity
! Termination

---

## Page 94

Some GC Properties
! Atomic Multicast
! Message is delivered to all processes or to none at all.  May also require
that messages are delivered in the same order to all processes.
! Failure Atomicity
! Failures do not result in incomplete delivery of multicast messages or
holes in the causal delivery order
! Uniformity
! A view change reported to a member is reported to all other members
! Liveness
! A machine that does not respond to messages sent to it is removed from
the local view of the sender within a finite amount of time.

---

## Page 95

Virtual Synchrony
! Virtual Synchrony
! Introduced in ISIS, orders group membership changes along with the regular
messages
! Ensures that failures do not result in incomplete delivery of multicast messages
or holes in the causal delivery order(failure atomicity)
! Ensures that, if two processes observe the same two consecutive membership
changes, receive the same set of regular multicast messages between the two
changes
! A view change acts as a barrier across which no multicast can pass
! Does not constrain the behavior of faulty or isolated processes

---

## Page 97

Faults and Partitions
! When detecting a processor P from
which we did not hear for a certain
timeout, we issue a fault message
! When we get a fault message, we
adopt it (and issue our copy)
! Problem: maybe P is only slow
! When a partition occurs, we can not
always  completely determine  who
received which messages (there is no
solution to this problem)

---

## Page 98

Extended Virtual Synchrony(cont.)
! Virtual synchrony handles recovered processes as new
processes
! Can cause inconsistencies with network partitions
! Network partitions are real
! Gateways, bridges, wireless communication

---

## Page 99

Extended Virtual Synchrony Model
! Network may partition into finite number of components
! Two or more may merge to form a larger component
! Each membership with a unique identifier is a configuration.
! Membership ensures that all processes in a configuration agree on the
membership of that configuration

---

## Page 100

Regular and Transitional Configurations
! To achieve safe delivery with partitions and remerges,
the EVS model defines:
! Regular Configuration
! New messages are broadcast and delivered
! Sufficient for FIFO and causal communication modes
! Transitional Configuration
! No new messages are broadcast, only remaining messages from prior
regular configuration are delivered.
! Regular configuration may be followed and preceeded by
several transitional configurations.

---

## Page 101

Totem
! Provides a Reliable totally ordered multicast service over LAN
! Intended for complex applications in which fault-tolerance and soft real-time
performance are critical
! High throughput and low predictable latency
! Rapid detection of, and recovery from, faults
! System wide total ordering of messages
! Scalable via hierarchical group communication
! Exploits hardware broadcast to achieve high-performance
! Provides 2 delivery services
! Agreed
! Safe
! Use timestamp to ensure total order and sequence numbers to ensure reliable
delivery

---

## Page 102

ISIS
! Tightly coupled distributed system developed over loosely coupled processors
! Provides a toolkit mechanism for distributing programming, whereby a DS is built
by interconnecting fairly conventional non-distributed programs, using tools drawn
from the kit
! Define
! how to create, join and leave a group
! group membership
! virtual synchrony
! Initially point-to-point (TCP/IP)
! Fail-stop failure model

---

## Page 103

Horus
! Aims to provide a very flexible environment to configure group of protocols
specifically adapted to problems at hand
! Provides efficient support for virtual synchrony
! Replaces point-to-point communication with group communication as the
fundamental abstraction, which is provided by stacking protocol modules that have a
uniform (upcall, downcall) interface
! Not every sort of protocol blocks make sense
! HCPI
! Stability of messages
! membership
! Electra
! CORBA-Compliant interface
! method invocation transformed into multicast

---

## Page 104

Transis
! How different components of a partitioned network can operate autonomously and
then merge operations when they become reconnected ?
! Are different protocols for fast-local and slower-cluster communication needed ?
! A large-scale multicast service designed with the following goals
! Tackling network partitions and providing tools for recovery from them
! Meeting needs of large networks through hierarchical communication
! Exploiting fast-clustered communication using IP-Multicast
! Communication modes
! FIFO
! Causal
! Agreed
! Safe

---

## Page 105

Fault Tolerant
Distributed Systems
ICS 230
Prof. Nalini Venkatasubramanian
(with some slides modified from Prof. Ghosh,
University of Iowa and Indranil Gupta, UIUC)

---

## Page 106

Classification of failures
Crash failure
Omission failure
Transient failure
Byzantine failure
Software failure
Temporal failure
Security failure
Environmental perturbations

---

## Page 107

Crash failures
Crash failure = the process halts. It is irreversible.
In synchronous system, it is easy to detect crash failure (using heartbeat
signals and timeout). But in asynchronous systems, it is never accurate, since it
is not possible to distinguish between a process that has crashed, and a
process that is running very slowly.
Some failures may be complex and nasty. Fail-stop failure is a simple
abstraction that mimics crash failure when program execution becomes
arbitrary. Implementations help detect which processor has failed. If a system
cannot tolerate fail-stop failure, then it cannot tolerate crash.

---

## Page 108

Transient failure
(Hardware) Arbitrary perturbation of the global state. May be
induced by power surge, weak batteries, lightning, radio-
frequency interferences, cosmic rays etc.
(Software) Heisenbugs are a class of temporary internal faults
and are intermittent. They are essentially permanent faults
whose conditions of activation occur rarely or are not easily
reproducible, so they are harder to detect during the testing
phase.
Over 99% of bugs in IBM DB2 production code are non-
deterministic and transient (Jim Gray)
Not Heisenberg

---

## Page 109

Temporal failures
Inability to meet deadlines – correct results are
generated, but too late to be useful. Very important in
real-time systems.
May be caused by poor algorithms, poor design
strategy or loss of synchronization among the
processor clocks

---

## Page 110

Byzantine failure
Anything goes! Includes every conceivable form of
erroneous behavior. The weakest type of failure
Numerous possible causes. Includes malicious
behaviors (like a process executing a different
program instead of the specified one) too.
Most difficult kind of failure to deal with.

---

## Page 111

Hardware Errors and Error Control
Schemes
111
Failures
Causes
Metric
s
Traditional
Approaches
Soft Errors,
Hard Failures,
System Crash
External Radiations,
Thermal Effects,
Power Loss, Poor
Design, Aging
FIT, MTTF,
MTBF
Spatial Redundancy (TMR,
Duplex,  RAID-1 etc.) and
Data Redundancy (EDC,
ECC, RAID-5, etc.)
•FIT: Failures in Time (109 hours)
•MTTF: Mean Time To Failure
•MTBF: Mean Time b/w Failures
•TMR: Triple Modular Redundancy
•EDC: Error Detection Codes
•ECC: Error Correction Codes
•RAID: Redundant Array of
Inexpensive Drives
¨ Hardware failures are increasing as technology scales
¤ (e.g.) SER increases by up to 1000 times [Mastipuram, 04]
¨ Redundancy techniques are expensive
¤ (e.g.) ECC-based protection in caches can incur 95% performance
penalty [Li, 05]

---

## Page 112

Software Errors and Error Control
Schemes
112
Failures
Causes
Metrics
Traditional
Approaches
Wrong
outputs,
Infinite
loops, Crash
Incomplete
Specification, Poor
software design,
Bugs, Unhandled
Exception
Number of
Bugs/Klines,
QoS, MTTF,
MTBF
Spatial Redundancy (N-
version Programming,
etc.), Temporal
Redundancy (Checkpoints
and Backward Recovery,
etc.)
•QoS: Quality of Service
¨ Software errors become dominant as system’s complexity increases
¤ (e.g.) Several bugs per kilo lines
¨ Hard to debug, and redundancy techniques are expensive
¤ (e.g.) Backward recovery with checkpoints is inappropriate for real-time applications

---

## Page 113

Network Errors and Error Control
Schemes
113
Failures
Causes
Metrics
Traditional
Approaches
Data Losses,
Deadline
Misses, Node
(Link) Failure,
System Down
Network
Congestion,
Noise/Interfere
nce, Malicious
Attacks
Packet Loss
Rate,
Deadline
Miss Rate,
SNR, MTTF,
MTBF, MTTR
Resource Reservation, Data
Redundancy (CRC, etc.),
Temporal Redundancy
(Retransmission, etc.),
Spatial Redundancy
(Replicated Nodes, MIMO,
etc.)
•SNR: Signal to Noise Ratio
•MTTR: Mean Time To Recovery
•CRC: Cyclic Redundancy Check
•MIMO: Multiple-In Multiple-Out
¨ Omission Errors – lost/dropped messages
¨ Network is unreliable (especially, wireless networks)
❙
Buffer overflow, Collisions at the MAC layer, Receiver out of range
¨ Joint approaches across OSI layers have been investigated for
minimal costs [V
06][S h
07]

---

## Page 114

Classifying fault-tolerance
Fail-safe tolerance
Given safety predicate is preserved, but liveness may be affected
Example. Due to failure, no process can enter its critical section for
an indefinite period. In a traffic crossing, failure changes the traffic in
both directions to red.
Graceful degradation
Application continues, but in a “degraded” mode. Much depends on
what kind of degradation is acceptable.
Example. Consider message-based mutual exclusion. Processes will
enter their critical sections, but not in timestamp order.

---

## Page 115

Conventional Approaches
!
Build redundancy into hardware/software
!
Modular Redundancy,  N-Version ProgrammingConventional TRM
(Triple Modular Redundancy) can incur 200% overheads without
optimization.
!
Replication of tasks and processes may result in overprovisioning
!
Error Control Coding
!
Checkpointing and rollbacks
!
Usually accomplished through logging (e.g. messages)
!
Backward Recovery with Checkpoints cannot guarantee the completion
time of a task.
!
Hybrid
!
Recovery Blocks
115

---

## Page 116

Defining Consensus
!
N processes
!
Each process p has
!
input variable xp : initially either 0 or 1
1.
output variable yp : initially b (b=undecided) – can be changed
only once
!
Consensus problem: design a protocol so that either
1.
all non-faulty processes set their output variables to 0
2.
Or non-faulty all processes set their output variables to 1
3.
There is at least one initial state that leads to each outcomes 1
and 2 above

---

## Page 117

Solving Consensus
! No failures – trivial
! All-to-all broadcast
! With failures
! Assumption: Processes fail only by crash-stopping
! Synchronous system: bounds on
! Message delays
! Max time for each process step
e.g., multiprocessor (common clock across processors)
! Asynchronous system: no such bounds!
e.g., The Internet! The Web!

---

## Page 118

Asynchronous Consensus
! Messages have arbitrary delay, processes arbitrarily
slow
! Impossible to achieve!
! a slow process indistinguishable from a crashed process
! Theorem: In a purely asynchronous distributed
system,  the consensus problem is impossible to
solve  if even a single process crashes
! Result due to Fischer, Lynch, Patterson (commonly
known as FLP 85).

---

## Page 119

Failure detection
The design of fault-tolerant algorithms will be simple if
processes can detect failures.
! In synchronous systems with bounded delay channels,
crash failures can definitely be detected using timeouts.
! In asynchronous distributed systems, the detection of
crash failures is imperfect.
! Completeness – Every crashed process is suspected
! Accuracy – No correct process is suspected.

---

## Page 120

Classification of completeness
! Strong completeness. Every crashed process is
eventually suspected by every correct process, and
remains a suspect thereafter.
! Weak
completeness.
Every
crashed
process
is
eventually suspected by at least one correct process, and
remains a suspect thereafter.
! Strong accuracy. No correct process is ever suspected.
! Weak accuracy. There is at least one correct process
that is never suspected.
Note that we don’t care what mechanism is used for suspecting a process.

---

## Page 121

Classifying failure detectors
Perfect P. (Strongly) Complete and strongly accurate
Strong S. (Strongly) Complete and weakly accurate
Eventually perfect ◊P.
(Strongly) Complete and eventually strongly accurate
Eventually strong ◊S
(Strongly) Complete and eventually weakly accurate
Other classes are feasible: W (weak completeness) and
weak accuracy) and ◊W

---

## Page 122

Replication
v Enhances a service by replicating data
v Increased Availability
v Of service. When servers fail or when the network is
partitioned.
v Fault Tolerance
v Under the fail-stop model, if up to f of f+1 servers crash, at
least one is alive.
vLoad Balancing
v One approach: Multiple server IPs can be assigned to the
same name in DNS, which returns answers round-robin.
P:  probability that one server fails= 1 – P= availability of service. e.g. P =
5% => service is available 95% of the time.
Pn:  probability that n servers fail= 1 – Pn= availability of service. e.g. P =
5%, n = 3 => service available 99.875% of the time

---

## Page 123

Replication Management
v Request Communication
v Requests can be made to a single RM or to multiple RMs
v Coordination: The RMs decide
v whether the request is to be applied
v the order of requests
vFIFO ordering: If a FE issues r then r’, then any correct RM handles r and
then r’.
vCausal ordering: If the issue of r “happened before” the issue of r’, then
any correct RM handles r and then r’.
vTotal ordering: If a correct RM handles r and then r’, then any correct RM
handles r and then r’.
v Execution: The RMs execute the request (often they
do this tentatively).

---

## Page 124

Passive Replication
(Primary-Backup)
vRequest Communication: the request is issued to the primary RM and
carries a unique request id.
vCoordination: Primary takes requests atomically, in order, checks id
(resends response if not new id.)
vExecution: Primary executes & stores the response
vAgreement: If update, primary sends updated state/result, req-id and
response to all backup RMs (1-phase commit enough).
vResponse: primary sends result to the front end
Client
Front End
RM
RM
RM
Client
Front End
RM
primary
Backup
Backup
Backup
….

---

## Page 125

Active Replication
vRequest Communication: The request contains a unique identifier and
is multicast to all by a reliable totally-ordered multicast.
vCoordination: Group communication ensures that requests are delivered
to each RM in the same order (but may be at different physical times!).
vExecution: Each replica executes the request.  (Correct replicas return
same result since they are running the same program, i.e., they are
replicated protocols or replicated state machines)
vAgreement: No agreement phase is needed, because of multicast
delivery semantics of requests
vResponse: Each replica sends response directly to FE
Client
Front End
RM
RM
Client
Front End
RM
….

---

## Page 126

Message Logging
! Tolerate crash failures
! Each process periodically records its local state and log
messages received after
! Once a crashed process recovers, its state must be consistent with the
states of other processes
! Orphan processes
! surviving processes whose states are inconsistent with the recovered
state of a crashed process
! Message Logging protocols guarantee that upon recovery no processes are
orphan processes
! Pessimistic Logging – avoid creation of orphans
! Optimistic Logging – eliminate orphans during recovery
! Causal Logging -- no orphans when failures happen and do not block
processes when failures do not occur (add info to messages)
