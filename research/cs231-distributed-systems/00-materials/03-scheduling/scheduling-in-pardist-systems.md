# scheduling-in-pardist-systems

---

## Page 1

Modeling Resource Management in
Concurrent Computing Systems
Isaac D. Scherson (aka The Schark)
Dept. of Computer Science (Systems)
School of Information and Computer Science
University of California, Irvine
Irvine, CA 92697-3425
isaac@ics.uci.edu - www.ics.uci.edu/ ˜ isaac
c
⃝
Isaac D. Scherson
UCI - cs230 – p.1/50

---

## Page 2

Acknowledgement
This work was started in 1994-95 and the following were the pioneers to
whom we owe the ideas presented here.
Piotr Chrza¸stowski-Wachtel - Institute of Informatics, Warsaw
University
Dinesh Ramanathan - Somewhere in the Silicon Valley
Raghu Subramanian - Somewhere in the Silicon Valley
This work was supported in part through various grants from NASA, the
NSF and the AFOSR
c
⃝
Isaac D. Scherson
UCI - cs230 – p.2/50

---

## Page 3

Warning !
This is a thought-provoking presentation. The ideas are very simple and
are presented to motivate a little formal thinking about the scheduling
problem in Concurrent Computing Systems.
c
⃝
Isaac D. Scherson
UCI - cs230 – p.3/50

---

## Page 4

Concurrent Computing OS Model
Machine
Physical
VM
VM
VM
VM
VM
VM
VM
Programming Model
Operating System
VM - Virtual Machine
Each VM is a user job
General Purpose Parallel Operating System
c
⃝
Isaac D. Scherson
UCI - cs230 – p.4/50

---

## Page 5

The Programming Model
There seems to be a convergence on the data parallel
programming in the form of HPF and Fortran 90.
In a survey of 120 parallel algorithms from three ACM Symposia on
Theory of Computing (STOC), all were found to be data parallel.
This preponderance of the data parallel programming model is
perhaps because it allows one to express a large degree of
parallelism, while retaining the single-thread-of-control philosophy
of sequential programming.
c
⃝
Isaac D. Scherson
UCI - cs230 – p.5/50

---

## Page 6

The Machine Model
A natural way of executing a data parallel program is on a SIMD
machine.
BUT . . . data parallelism does not equal SIMD.
A data parallel program may be executed on an asynchronous
MIMD machine:
Chief advantage: It is possible to run several jobs on a MIMD
machine simultaneously.
A MIMD machine does not force unnecessary synchronization
after every instruction, or unnecessary sequentialization of
non-interfering branches, as a SIMD machine does.
c
⃝
Isaac D. Scherson
UCI - cs230 – p.6/50

---

## Page 7

SPMD Programs
The combination of the data parallel programming model and a
MIMD machine model is called a SPMD execution model
SPMD stands for Single Program Multiple Data
All processors execute the same program, but may be at
different stages of the program at a given time
For the remainder of this presentation, our discussion is predicated
on the SPMD execution model.
c
⃝
Isaac D. Scherson
UCI - cs230 – p.7/50

---

## Page 8

Virtual Processors
A program is expressed in a language that describes a virtual
machine.
For a data parallel program, the virtual machine consists of a
(typically large) number of identical virtual processors (VPs),
communicating through an interconnection network.
For instance, the standard data parallel program to multiply two
N × N matrices may be viewed as a virtual machine
consisting of N 2 VPs communicating in a mesh.
c
⃝
Isaac D. Scherson
UCI - cs230 – p.8/50

---

## Page 9

Virtual Processors (Cont’d)
For many years now, the concept of virtual processors has been
relegated to the status of a mere logical aid to programmers
In our view, the notion of virtual processors should form the
fundamental basis for the deﬁnition of a Concurrent Computer
System and for the resource management strategies
embedded in the OS.
c
⃝
Isaac D. Scherson
UCI - cs230 – p.9/50

---

## Page 10

Redeﬁning Massive Parallelism
A Programmer sees only a VM with as many Virtual Processors as
s/he needs.
Solutions are cast in the space of the problem and not on that of
the physical machine.
The measure of Massive Parallelism is through the number of VPs
the physical machine is capable of emulating per unit of time.
HENCE . . . It does not matter what the physical machine looks like,
provided it can emulate Concurrent Computing Virtual Machines.
c
⃝
Isaac D. Scherson
UCI - cs230 – p.10/50

---

## Page 11

Resource Management Operations
Spatial scheduling: A space sharing policy that deﬁnes which
physical processor each VP is allocated to.
Temporal scheduling: A time sharing policy that dictates how
each physical processor switches between the execution of the
VPs allocated to it.
Load balancing: Static and/or Dynamic redistribution of VPs
among physical processors responding to some predetermined
objective function.
c
⃝
Isaac D. Scherson
UCI - cs230 – p.11/50

---

## Page 12

Resource Management Operations
Memory and I/O problems: Memory limitations and I/O
bottlenecks may also be phrased in terms of VPs. Memory
limitations occur when a processor does not have enough local
memory to hold all the VPs allocated to it. I/O bottlenecks are most
pronounced while loading (roll-in) the VPs of a job from the disk
into the local memories of various processors.
c
⃝
Isaac D. Scherson
UCI - cs230 – p.12/50

---

## Page 13

AND NOW ...
A game you can play in your free time . . . . . .
c
⃝
Isaac D. Scherson
UCI - cs230 – p.13/50

---

## Page 14

Model of the System
Let Π = {π1, π2, . . . , πn}. denote the set of physical processors
or processing elements (PEs).
Interconnection network details are ignored, only assuming that it
guarantees the completion of all communications within a
reasonable time bound (not necessarily a constant, as in the
PRAM model).
Let J = {J1, J2, . . . , Jm} denote the set of jobs in the system at
some time.
For notational convenience, job Ji is identiﬁed with its set of VPs
{Pi1, Pi2, . . . , Pi|Ji|}.
c
⃝
Isaac D. Scherson
UCI - cs230 – p.14/50

---

## Page 15

Handling Time
Break time into time slices: discrete intervals of equal length.
The time slice is assumed to be machine dependent and constant.
Within each time slice, every πi runs some VP chosen from the
VPs allocated to it, or it idles.
c
⃝
Isaac D. Scherson
UCI - cs230 – p.15/50

---

## Page 16

Handling Time (Cont’d)
A PE πi runs a VP of a Job until:
The VP issues a communication request which cannot be
completed (data to be read is not ready), or
The time slice expires.
The communication instruction is considered an indivisible
instruction and time slices are extended accordingly.
c
⃝
Isaac D. Scherson
UCI - cs230 – p.16/50

---

## Page 17

Execution of Programs
For simplicity of analysis, it is assumed that jobs run indeﬁnitely.
The OS schedules an arriving Job as if the job is going to last
forever in the system
This approximation reﬂects that the time slice is very small (in the
order of milliseconds) compared to the execution times of the jobs
(in the order of minutes).
The assumption of inﬁnite running time might be removed with
negligible change to the ﬁnal results, but with signiﬁcant
complications in the deﬁnitions and proofs.
c
⃝
Isaac D. Scherson
UCI - cs230 – p.17/50

---

## Page 18

The 2 Types of Scheduling
Given a job, J, as a set of |J| VPs, how is this job allocated over
the n physical PEs of the concurrent computer so that the
resources are efﬁciently utilized?
More generally, how are VPs of the same and different jobs, say
J1, J2, . . . , Jm, allocated over the PEs to efﬁciently utilize all
system resources?
This is called the problem of spatial scheduling or spatial
allocation.
Intuitively. Spatial schedule: “Where to run the VPs of job J?”.
Temporal schedule: “When to run the VPs of job J?”.
c
⃝
Isaac D. Scherson
UCI - cs230 – p.18/50

---

## Page 19

. . . and more formally
Deﬁnition 1 A spatial schedule is an n-tuple allocation function (The
terms allocation and spatial scheduling will be used interchangeably)
A : J −→IN |Π|
such that for any job J, A(J) = (a1, a2, . . . , an), ai VPs of J are
allocated to processor πi ∈Π, (
n
X
i=1
ai = |J|).
c
⃝
Isaac D. Scherson
UCI - cs230 – p.19/50

---

## Page 20

. . . and more formally (Cont’d)
Deﬁnition 2 A temporal schedule for a time slice t is deﬁned as an
n-tuple function, S(t), such that S(t)[i] is the job run by πi in the time
slice t. A temporal schedule, S, is a time ordered sequence of S(t)
for all t > 0.
Deﬁnition 3 Deﬁne a schedule, S, to be impartial if every job J ∈J
occurs inﬁnitely many times in S.
An impartial schedule ensures that every job in it completes.
c
⃝
Isaac D. Scherson
UCI - cs230 – p.20/50

---

## Page 21

Example
Consider a machine with 5 PEs and 5 jobs:
J1 requires 1 VP,
J2 requires 4 VPs,
J3 requires 1 VP,
J4 requires 5 VPs,
J5 requires 1 VP.
. . . suppose we allocate the VPs of the Jobs as follows . . .
c
⃝
Isaac D. Scherson
UCI - cs230 – p.21/50

---

## Page 22

Example (Graphical)
π5
π4
π1
π2
π3
4
2
2
2
4
5
4
4
3
4
1
2
With the following allocation functions:
A(J1) = (0, 0, 0, 0, 1)
A(J2) = (1, 1, 1, 0, 1)
A(J3) = (1, 0, 0, 0, 0)
A(J4) = (1, 1, 0, 3, 0)
A(J5) = (0, 0, 1, 0, 0)
c
⃝
Isaac D. Scherson
UCI - cs230 – p.22/50

---

## Page 23

Job Execution
Global communication: all VPs of a given Job execute a
communication instruction.
Legal execution of a Job: no VP of the Job is ahead of any other
VP of the same job by more than one global communication step at
any time.
Legal scheduling strategy: will always choose any trailing VP
before any non-trailing VP.
A step begins when all VPs of a job have executed the same
number of global communications and it ends at the occurrence of
the same condition at a future time slice (after at least one VP of
the job has been executed).
c
⃝
Isaac D. Scherson
UCI - cs230 – p.23/50

---

## Page 24

A Job’s Schedule Vector
Deﬁnition 4 Deﬁne a job J’s t-schedule vector, ǫ(t, J) as a 0-1
n-tuple such that,
ǫ(t, J)[k] =



1
if πk ∈Π runs job J in time slice t
0
otherwise
c
⃝
Isaac D. Scherson
UCI - cs230 – p.24/50

---

## Page 25

A Job’s Progress Vector
Deﬁnition 5 Deﬁne progress of a job (at the begining of a time slice t)
as an n-tuple function
P : t × J −→IN Π
such that:
1. P(t, J) =⃗0 for t = 0,
2. If P(t −1, J) + ǫ(t, J) = A(J) then P(t, J) =⃗0,
else P(t, J) = P(t −1, J) + ǫ(t, J) (where the addition is
componentwise)
3. P(t, J) ≤A(J) where the ≤order is applied componentwise.
c
⃝
Isaac D. Scherson
UCI - cs230 – p.25/50

---

## Page 26

Progress Vector in English
The intuition behind the progress vector is as follows:
Start at the ﬁrst step of a job J, let job J proceed on the processor’s
having 1’s on the ǫ(t, J). If the progress vector reaches A(J) then
another step of job J is complete and progress counters associated
with each processor are reset. A new step cannot be started until the
previous one is complete. Every job has a progress vector associated
with it at the beginning of every time slice.
c
⃝
Isaac D. Scherson
UCI - cs230 – p.26/50

---

## Page 27

A more complete Example
Consider an allocation on 5 processors (same example):
π5
π4
π1
π2
π3
4
2
2
2
4
5
4
4
3
4
1
2
And consider the problem of scheduling J4.
c
⃝
Isaac D. Scherson
UCI - cs230 – p.27/50

---

## Page 28

A more complete Example (Cont’d)
An arbitrary schedule for job J4 is as follows:
A(J4)
=
(1, 1, 0, 3, 0)
P(0, J4)
=
(0, 0, 0, 0, 0)
ǫ(1, J4)
=
(0, 1, 0, 1, 0)

P(0, J4) + ǫ(1, J4)
=
P(1, J4)
=
(0, 1, 0, 1, 0)
ǫ(2, J4)
=
(1, 0, 0, 1, 0)
ǫ(1, J4) = (0, 1, 0, 1, 0) indicates that processors π2 and π4 run job
J4. ǫ(1, J4) is added to P(0, J4) componentwise to give the new
progress vector P(1, J4) for job J4 and so on.
c
⃝
Isaac D. Scherson
UCI - cs230 – p.28/50

---

## Page 29

A more complete Example (Cont’d)
Continuing to schedule J4 . . .

P(1, J4) + ǫ(2, J4)
=
P(2, J4)
=
(1, 1, 0, 2, 0)
ǫ(3, J4)
=
(0, 0, 0, 1, 0)
P(2, J4) + ǫ(3, J4)
=
(1, 1, 0, 3, 0)
Now, P(3, J4) = A(J4), so reset, P(3, J4) = (0, 0, 0, 0, 0)
c
⃝
Isaac D. Scherson
UCI - cs230 – p.29/50

---

## Page 30

System’s Progress and Schedule
Deﬁnition 6 Deﬁne the system progress matrix, Q, as a
(n × m)-array of progress vectors (columns) of all jobs (rows) in the
system.
Deﬁnition 7 Deﬁne the system schedule matrix, S, as a
n −column matrix such that each column corresponds to a physical
processor while each row corresponds to a time slice. Each entry is
numbered with the job number whose VP is executed at that time slice.
c
⃝
Isaac D. Scherson
UCI - cs230 – p.30/50

---

## Page 31

A Schedule for the Example
Time/PE
π1
π2
π3
π4
π5
1
2
2
2
4
1
2
3
4
5
4
2
3
4
4
The same three lines can be repeated until all jobs terminate.
The above will be dubbed the Scheduling Matrix
HINT: We’ll be seeing periodic schedules.
c
⃝
Isaac D. Scherson
UCI - cs230 – p.31/50

---

## Page 32

Another Schedule for the Example
Time/PE
π1
π2
π3
π4
π5
1
2
2
2
4
2
2
3
4
5
4
1
3
4
5
4
1
4
2
2
2
4
2
5
3
4
5
4
1
6
4
5
4
1
Same period as the previous schedule (3) but only one idle slice per
period.
c
⃝
Isaac D. Scherson
UCI - cs230 – p.32/50

---

## Page 33

Schedules and Allocations
A Schedule will strongly depend upon the initial Allocation.
Challenge: Find another allocation/schedule for the example such
that there are no idle time slices.
c
⃝
Isaac D. Scherson
UCI - cs230 – p.33/50

---

## Page 34

Metrics
There are two points of view when measuring the system’s performance.
One focuses on the functional quality from the system manager’s
point of view, who is concerned with the throughput and utilization
of the machine.
The second focuses on the functional quality from the users’ point
of view who expects the system to respond within a speciﬁc time.
c
⃝
Isaac D. Scherson
UCI - cs230 – p.34/50

---

## Page 35

Scheduling Metrics
For the case of Scheduling:
Question: Which schedule is the “best”?
The parallel OS should be able to satisfy two objectives:
Minimize processor idling time (important for the System).
Guarantee an upper limit on the system response time to every
job (important to the single user).
c
⃝
Isaac D. Scherson
UCI - cs230 – p.35/50

---

## Page 36

Idling Ratio
Deﬁnition 8 For a n-processor system, for a schedule S, and over and
interval of ∆t time slices, deﬁne an idling ratio or throughput
ıS : IN →IR as:
ıS(∆t) =
X
k∈∆t
ik
n × ∆t
where ik is the total number of idling processors during time slice k.
The idling ratio is a measure of the resource utilization.
c
⃝
Isaac D. Scherson
UCI - cs230 – p.36/50

---

## Page 37

Idling Ratio for the Example
Time/PE
π1
π2
π3
π4
π5
1
2
2
2
4
1
2
3
4
5
4
2
3
4
4
Idling Ratio for this schedule over the period of 3 time slices =
3/15 = 1/5 = 20%
c
⃝
Isaac D. Scherson
UCI - cs230 – p.37/50

---

## Page 38

Idling Ratio for the Example
Time/PE
π1
π2
π3
π4
π5
1
2
2
2
4
2
2
3
4
5
4
1
3
4
5
4
1
Idling Ratio for this schedule over the period of 3 time slices = 1/15
c
⃝
Isaac D. Scherson
UCI - cs230 – p.38/50

---

## Page 39

An Interesting Case
Consider a system where only one job is running and utilizes all
processors (J1 has 5 VPs):
Time/PE
π1
π2
π3
π4
π5
1
1
1
1
1
1
c
⃝
Isaac D. Scherson
UCI - cs230 – p.39/50

---

## Page 40

An Interesting Case
. . . SUDDENLY . . .
c
⃝
Isaac D. Scherson
UCI - cs230 – p.40/50

---

## Page 41

An Interesting Case
. . . SUDDENLY . . .
Another job J2 arrives and requires 4 VPs
c
⃝
Isaac D. Scherson
UCI - cs230 – p.41/50

---

## Page 42

An Interesting Case
In a hurry, the system allocates and schedules J2 in the apparently
obvious manner:
Time/PE
π1
π2
π3
π4
π5
1
1
1
1
1
1
2
2
2
2
2
With an Idling Ratio of 1/10 = 10%
c
⃝
Isaac D. Scherson
UCI - cs230 – p.42/50

---

## Page 43

An Interesting Case
BUT . . . Consider the following 0% Idling Ratio Schedule:
Time/PE
π1
π2
π3
π4
π5
1
1
2
2
2
2
2
1
2
2
2
2
3
1
2
2
2
2
4
1
2
2
2
2
5
1
2
2
2
2
The response time of J1 was sacriﬁced in favor of full 100% Physical
Processor utilization. AN UNHAPPY USER !!!
c
⃝
Isaac D. Scherson
UCI - cs230 – p.43/50

---

## Page 44

Happiness Function
Deﬁnition 9 Deﬁne the happiness function, ℏ∆t(J), of a job J for a
time length ∆t as,
ℏ∆t(J) = min
t≥0













t+∆t−1
X
τ=t
X
π∈Π
ǫ(τ, J)
|J| · ∆t













The time interval ∆t is the Impatience Latency of the user.
c
⃝
Isaac D. Scherson
UCI - cs230 – p.44/50

---

## Page 45

Happiness Function
Intuitively, happiness represents the machine power that a job is
given during a time slice. The term in the braces represents the
fraction of the full parallel speedup that was achieved by job J in
time interval (t, t + ∆t −1).
∆t represents the expected impatience latency of the user. It is
the minimum time the user is required to wait before the system
responds.
c
⃝
Isaac D. Scherson
UCI - cs230 – p.45/50

---

## Page 46

Virtual Happiness
The proposed parallel OS paradigm allows the user to program in a
virtual parallel model with no limit on the number of VPs in a job.
To get a handle on the maximum parallel speedup that can be
achieved for a job given n physical processors, deﬁne virtual
happiness,
v(J) = min{1, n
|J|}.
Virtual happiness of a job J represents the happiness of the job if
the entire machine is used by J.
Hence, J cannot be happier than v(J).
c
⃝
Isaac D. Scherson
UCI - cs230 – p.46/50

---

## Page 47

Happiness is a Balancing Act
A Job (user) will be happier if it acquires more parallel speedup
over time.
If a schedule is unable to provide the required happiness for a job,
rescheduling with a different allocation may have to be considered.
If the required happiness for a set of jobs cannot be achieved by
any allocation, then some jobs must be queued for later allocation.
A happy schedule is not necessarily optimal for throughput. It
merely guarantees an upper limit on the response time.
c
⃝
Isaac D. Scherson
UCI - cs230 – p.47/50

---

## Page 48

Periodic Temporal Schedules
Deﬁnition 10 For an allocation A,
Sp = S(t), S(t + 1), . . . , S(t + p −1) is called a periodic
schedule, iff ∃p > 0 such that S(t) = S(t + p) for all t > ts, where
ts is called the startup time of the schedule. p is the period of the
schedule.
Also for each job J in Sp,
X
1≤t≤p,1≤i≤|Π|
[S(t)[i] = J] = k · |J|
must be true for some positive integer k to ensure that each job
executes iat least k steps during each period (k need not be the same
for every job).
c
⃝
Isaac D. Scherson
UCI - cs230 – p.48/50

---

## Page 49

How far did we go?
This is Work in Progress. A lot to be done !
We have proven a few theorems on Impartial Periodic Schedules.
Periodic Schedules are the BEST !!
We have conditions to minimize Idling Ratio and maximize
Happiness.
c
⃝
Isaac D. Scherson
UCI - cs230 – p.49/50

---

## Page 50

Collaborations Welcome
Anybody interested ? . . . Let’s work together !!!
THANKS !!
c
⃝
Isaac D. Scherson
UCI - cs230 – p.50/50
