# rtr-queue

---

## Page 1

1
Electrical Engineering E6761
Computer Communication Networks
Lecture 5
Professor Dan Rubenstein
Tues 4:10-6:40, Mudd 1127
Course URL:
<http://www.cs.columbia.edu/~danr/EE6761>

---

## Page 2

2
Overview
r Finish Last time: TCP latency modeling
r Queueing Theory
m Little’s Law
m M/
r Queueing “styles”
m scheduling: FIFO, Priority, Round-Robin, WFQ
m policing: leaky-bucket
r Router Components / Internals
m ports, switching fabric, crossbar
m IP lookups via tries

---

## Page 3

3
TCP latency modeling
Q: How long does it take to
receive an object from a
Web server after sending
a request?
r
r data trans
Notation, assumptions:
r Assume one link between
client and server of rate R
: fixed congestion
r O: object size (bits)
r no retransmissions (no loss,
no corruption)
Two cases to consider:
r WS/R > RTT + S/R: ACK for first segment in
window returns before window’s worth of data
sent
r WS/R < RTT + S/R: wait for ACK after sending
window’s worth of data sent
S/R = time to
send a
packet’s bits
into the link

---

## Page 4

4
TCP latency Modeling
Case 1: latency = 2RTT + O/R
Case 2: latency = 2RTT + O/R

+ [K-1](S/R + RTT - WS/R)
K:= O/WS = # of windows
needed to fit object
RTT
RTT
RTT
idle time bet.
window transmissions

---

## Page 5

5
TCP Latency Modeling: Slow Start
r Now suppose window grows according to slow start.
r Will show that the latency of one object of size O is:
+ where Q is the number of times the server would stall
   if the object were of infinite size.
+ and  K is the number of windows that cover the object.

---

## Page 6

6
TCP Latency Modeling: Slow Start (cont.)
Example:
O/S  = 15 segments
K = 4 windows
Q
P = min{K-1,Q
Server stalls P=2 times.

---

## Page 7

7
TCP Latency Modeling: Slow Start (cont.)

---

## Page 8

8
What we’ve seen so far (layered
perspective)…
application
ne
link
physical
Sockets: application
interface to transport
layer
IP addressing (CIDR)
MAC addressing,
switches, bridges
hubs, repeaters
DNS
Today: part 1 of network layer: inside a router
Queueing, switching, lookups

---

## Page 9

9
Queueing
r 3 aspects of queueing in a router:
m arrival rate and service time distributions for
traffic
m poli

---

## Page 10

10
Model of a queue
Queuing model (a single router or link)
r Buffer of size K (# of customers in system)
r Packets (customers) arrive at rate 
r Packets are processed at rate μ
r  and μ are average rates

---

## Page 11

11
Queues: General Observations
queue
r Decrease in μ leads to longer delays to get
processed, leads to more packets in queue
r Decrease in K:
m packet drops more likely
m less delay for the “average” packet accepted into the
queue
K
μ


---

## Page 12

12
Little’s Law (a.k.a. Little’s Theorem)
r Let pi be the ith packet into the queue
r Let Ni = # of pkts already in the queue when pi
arrives
m time
r If K = ∞ (unlimited queue size) then
                     lim E[Ni] =  lim E[Ti]
                     i∞                  i∞
Holds for any distribution of , μ (which means
for any distribution of Ti as well)!!

---

## Page 13

13
Little’s Law: examples
r People arrive at a bank at an avg. rate of 5/min.
They spend an average of 20 min in the bank.
What is the aver
n the bank at
r To keep the average # of people under 50, how
much time should be spent by customers on
average in the bank?
 100
=5, E[N] < 50, E[T] = E[N] /  < 50 / 5 = 10

---

## Page 14

14
r Two ways of looking at the same set of events
r {Ti} =
 by a
Poisson process”
r {ti} = time between arrivals are “exponentially
distributed”
r The process / distribution is special because it’s
memoryless:
m observing that an event hasn’t yet occurred doesn’t increase
the likelihood of it occurring any sooner
m observing “resets” the state of the system
Poisson Process / Exponential Distribution
t1
time

---

## Page 15

15
r An example of a memoryless R.V., T
m Let T be the time of arrival of a memoryless event, E
m Choose any const
r We “c
and
found out that it didn’t
m Given that it did not occur before time x, the likelihood
that it now occurs by time D+x is the same as if the
timer just started and we’re only waiting for time D
Memorylessness

---

## Page 16

16
Which are memoryless?
r The time of the first head for a fair coin
m tossed every second
r The on-time arrival of a bus
m arriving uniformly between 2 and 3pm
m if P(T > D) = 1 / 2D
Yes (for discrete time units)!

| T>x) for x an integer
No (e.g., P(T>1) = .5, P(T>2 | T>1) = .25)
Yes: P(T>D+x | T>x) = (1/2D+x) / (1/2x) = 1 / 2D
No (e.g., P(T>2:30 = .5), P(T>3:00 | T>2:30) = 0

---

## Page 17

17
t
P(T > t)
The exponential distribution
r If T is an exponentially distributed r.v. with rate
, then P(T > t) = e-t, hence:
m P(T < t) = 1 - e-t
m P(T > t+x | T > x)
Note bounds:
P(T > 0) = 1
lim P(T > t) = 0
        t 

---

## Page 18

18
Expo Distribution: useful facts
r Let green packets arrive as a Poisson process with rate
1, and red packets arrive as a Poisson process with rate
2
m (green + red) packe
 process with rate 1 + 2
r Q: is the
isson
process?
r PASTA (Poisson Arrivals See Time Averages)
m P(system in state X when Poisson arrival arrives) = E[state of
system]
m Why? due to memorylessness
m Note: rarely true for other distributions!!

---

## Page 19

19
What about 2 Poisson arrivals?
r Let Ti be the time it takes for i Poisson arrivals
with rate  to occur.  Let ti be the time between
arrivals i and i-1

               = e-t     + ∫    -e-t  •  e-(t-x) dx
                                              x=0
               = e-t (1 + t)
r Note: T2 is not a memoryless R.V.:
P(T2 > t | T2 > s) = e-(t-s) (1 - t) / (1 - s)
    P(T2 > t-s) = e-(t-s) (1 - (t-s))

---

## Page 20

20
What about n Poisson arrivals?
r Let N(t) be the number of arrivals in time t
r P(N(t) = 0) = P(T1 > t) = e-t
r P(N(t) = 1) = P(T2
-t (1 + t) - e-
r

r Solving gives P(N(t) = n) = (t)ne-t/n!

n-1
r So P(Tn > t) = ΣP(N(t) = i)
                                      i=0

---

## Page 21

21
A/S/N/K systems (Kendall’s notation)
A/S/N/K gives a theoretical
description of a system
r A is the arrival p
m G =
r S is the service process
m M,D,G same as above
r N is the number of parallel
processors
r K is the buffer size of the queues
m K term can be dropped when buffer
size is infinite
μ
A: 
μ
μ
N
S:

---

## Page 22

22
The M/M/1 Queue (a.k.a., birth-death process)
r a.k.a., M/M/1/∞
m Poisson arrivals
m Exponential service time
m 1 processor, infinit
Markov
memory
r Distribution of time
spent in state n the
or all n > 0
0
1
2
3

## pkts in

system
(When > 1,
is 1 larger
than # pkts
in queue)
/(+μ) /(+μ)
/(+μ)
/(+μ)
μ/(+μ)
μ/(+μ)
μ/(+μ)
μ/(+μ)
. . .
transition probs

---

## Page 23

23
M/M/1 cont’d
As long as  < μ,
queue has following
steady-state
m ρ =
m N = # pkts in system
m T = packet time in
system
m NQ = # pkts in queue
m W = waiting time in
queue
r P(N=n) = ρn(1-ρ)
m (indicates fraction of time spent w/
n pkts in queue)
 factor = 1 – P(N=0) = ρ
r E[T] = E[N] /  (Little’s Law) =
ρ/( (1-ρ)) = 1 / (μ - )
                   ∞
r E[NQ] = Σ (n-1) P(N=n) = ρ2/(1-ρ)
                  n=1
r E[W] = E[T] – 1/μ (or = E[NQ]/ by
Little’s Law) = ρ / (μ - )

---

## Page 24

24
M/M/1/K queue
r Also can be modeled as a Markov Model
m requires K+1 states for a system (queue +
processor) th
 (why?)
m Not
0
1
2
3
1
/(+μ)
/(+μ)
/(+μ)
μ/(+μ)
μ/(+μ)
μ/(+μ)
μ/(+μ)
K
/(+μ)
μ/(+μ)
. . .
/(+μ)

---

## Page 25

25
M/M/1/K properties
                  ρn(1-ρ) / (1 – ρK+1), ρ≠1
r P(N=n) =
                     1 / (K

r E[N] =
                 1 / (K+1),                  ρ=1
r i.e., divide M/M/1 values by (1 – ρK+1)

---

## Page 26

26
Scheduling And Policing Mechanisms
Scheduling: choosing the next packet for
transmission on a link can be done following a
number of policies;
r FIFO (First In First Out) a.k.a. FCFS (First Come
First Serve): in
 the queue
m
to d
d)

---

## Page 27

27
Scheduling Policies
r Priority Queuing:
m Classes have different priorities
m May depend on explicit marking or other header info, eg IP
source or destination, TCP Port numbers, etc.
m Transmit a packet
ority class with a non-

---

## Page 28

28
Scheduling Policies
r Priority Queueing cont’d:
m 2 versions:
• Preemptive: (
 processing if high-
p

---

## Page 29

29
Modeling priority queues as M/M/1/K
r preemptive version (K=2): assuming preempted packet
placed back into queue
m state w/ x,y indicates x priority queued, y non-priority queued
m what are the transition probabilities?
m what if preempted is discarded?
0, 0
1, 0
2, 0
0, 2
1, 2
2, 2

---

## Page 30

30
Modeling priority queues as M/M/1/K
r Non-preemptive version (K=2)
m yellow (solid border) = nothing or high-priority being proc’d
m red (dashed border) = low-priority being processed
m what are the transition probabilities?
0, 0
1, 0
2, 0
0, 2
1, 2
2, 2
1, 2
2, 2

---

## Page 31

31
Scheduling Policies (more)
r Round Robin:
m each flow gets its own queue
m circulate through queues, process one pkt (if queue non-
empty), then mo

---

## Page 32

32
Scheduling Policies (more)
r Weighted Fair Queuing: is a generalized Round
Robin in which an attempt is made to provide a
class with a diff
 of service over

---

## Page 33

33
WFQ details
r Each flow, i, has a weight, Wi > 0
r A Virtual Clock is maintained: V(t) is the “clock” at
time t
r Each packet k in
r The Vi
 queue
is empty
r When a pkt arrives at (real) time t, it is assigned:
m Si,k = max{Fi,k-1, V(t)}
m Fi,k = Si,k + length(k) / Wi
m V(t) = V(t’) + (t-t’) / ΣWj
                                                                  B(t’,t)
• t’ = last time virtual clock was updated
• B(t’,t) = set of sessions with pkts in queue during (t’,t]

---

## Page 34

34
Policing Mechanisms
r Three criteria:
m (Long term) Average Rate (100 packets per sec or 6000
packets per min?
he interval length
m (Ma
consecutively, ie over a short period of time

---

## Page 35

35
Policing Mechanisms
r Token Bucket mechanism, provides a means
for limiting input to specified Burst Size
and Average R

---

## Page 36

36
Policing Mechanisms (more)
r Bucket can hold b tokens; token are generated at a
rate of r token/sec unless bucket is full of tokens.
r Over an interval of length t, the number of
packets that are admitted is less than or equal to
(r t + b).
combi
provide upper
bound on delay.

---

## Page 37

37
Routing Architectures
r We’ve seen the queueing policies a router can
implement to determine the order in which it
services packets
Routing
Processor
Switching
Fabric
r A rout
m ports: connections to wires to other
network entities
m switching fabric: a “network” inside
the router that transfers packets
between ports
m routing processor: brain of the router
• maintains lookup tables
• in some cases, does lookups
s

---

## Page 38

38
Router Archs
Ports
switching
fabric w/ bus
Lowest End router:
all packets processed by 1
CPU, share the same bus
2 passes on the bus per pkt
              Next step up
pool of CPUs (still have shared
bus, 2 passes per pkt)
main CPU keeps pool up-to-date
updates
bus can carry 1 pkt at a time!

---

## Page 39

39
Router Archs (high end today)
High End:
Each interface has its own
CPU
lookup done before using
bus  1 pass on bus
Highest:
Interface’s processing
done in hardware
Crossbar switch can
deliver pkts simultaneously

---

## Page 40

40
Crossbar Architecture
r To complete transfer from Ix to
Oy, close crosspoint at (x,y)
r Can simultaneously transfer pairs
with differing input and output
ports
r multiple crossbars can be used at
once
I1
I2
I
1
2
3
4
I1  O3
I3  O4

---

## Page 41

41
Head-of-line Blocking
r How to get packets with different input/output
port pairings to the cross bar at the same time
r Problem: what if 1st pkt in every input queue wants
to go to the same output port?
r Packets at the head of the line are blocking packets
deeper in queue from being serviced
I3
I4
O1
O2
O3
O4

---

## Page 42

42
Virtual Output Queueing
r Each input queue is
split into separate
virtual queues for
utput port
ost
one per input port per
round)
Q: how do routers know
where to send pkt to?

---

## Page 43

43
Fast IP Lookups: Tries
r Task: choose the appropriate
output port
r Given: router stores longest
matching prefixes
r Goal: quickly identi
r Data str
m a binary tree
m some nodes marked by an outgoing
interface
m ith bit is 0 take ith step left
m ith bit is 1 take ith step right
m keep track of last interface crossed
m no link for step, return last
interface
Start
O1
O2
1
O2
O1
O2
0
1
1
1
0
0
0

---

## Page 44

44
r Lookup Table:
r Examples:
m 0001010
m 110101
m 00101011
Trie example
Start
O1
O2
O2
O1
O2
0
1
1
1
0
0
Prefix
0
001
00101
0011
Interface
O1
O1
O2

---

## Page 45

45
Next time…
r Routing Algorithms
m how to determine which prefix is associated
with which ou
