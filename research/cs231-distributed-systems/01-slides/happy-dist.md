# happy-dist

---

## Page 1

c
⃝
Isaac D. Scherson
Distributed [Computing] Systems
Modeling Resource Management in Concurrent Computing Systems
Isaac D. Scherson (aka The Schark c¨^ )
Dept. of Computer Science (Systems)
Bren School of Information and Computer Sciences
University of California, Irvine
Irvine, CA 92697-3425
isaac@ics.uci.edu
www.ics.uci.edu/˜isaac
www.ics.uci.edu/˜schark
CompSci-230, Winter 2019
1 / 51
c
⃝
Isaac D. Scherson
Modeling Resource Management in Concurrent
Computing Systems
2 / 51

---

## Page 2

c
⃝
Isaac D. Scherson
Acknowledgements
This work was started in 1994-95 and the following were the pioneers to
whom we owe the ideas presented here.
I Piotr Chrza¸stowski-Wachtel - Institute of Informatics, Warsaw
University
I Dinesh Ramanathan - Somewhere in the Silicon Valley
I Raghu Subramanian - Somewhere in the Silicon Valley
This work was supported in part through various grants from NASA, the
NSF and the AFOSR
3 / 51
c
⃝
Isaac D. Scherson
Warning !
This is a thought-provoking presentation. The ideas are very simple and
are presented to motivate a little formal thinking about the scheduling
problem in Concurrent Computing Systems.
4 / 51

---

## Page 3

c
⃝
Isaac D. Scherson
Concurrent Computing OS Model
General Purpose Parallel Operating System
5 / 51
c
⃝
Isaac D. Scherson
The Programming Model
I There seems to be a convergence on the data parallel programming in
the form of HPF and Fortran 90.
I In a survey of 120 parallel algorithms from three ACM Symposia on
Theory of Computing (STOC), all were found to be data parallel.
I This preponderance of the data parallel programming model is
perhaps because it allows one to express a large degree of
parallelism, while retaining the single-thread-of-control philosophy
of sequential programming.
6 / 51

---

## Page 4

c
⃝
Isaac D. Scherson
The Machine Model
I A natural way of executing a data parallel program is on a SIMD
machine.
I BUT . . . data parallelism does not equal SIMD.
I A data parallel program may be executed on an asynchronous MIMD
machine:
I Chief advantage: It is possible to run several jobs on a MIMD machine
simultaneously.
I A MIMD machine does not force unnecessary synchronization after every
instruction, or unnecessary sequentialization of non-interfering
branches, as a SIMD machine does.
7 / 51
c
⃝
Isaac D. Scherson
SPMD Programs
I The combination of the data parallel programming model and a
MIMD machine model is called a SPMD execution model
I SPMD stands for Single Program Multiple Data
I All processors execute the same program, but may be at different stages
of the program at a given time
I For the remainder of this presentation, our discussion is predicated
on the SPMD execution model.
8 / 51
Single instruction, multiple data (SIMD) is a class of
parallel computers in Flynn's taxonomy. It describes
computers with multiple processing elements that perform
the same operation on multiple data points simultaneously.
MIMD: multiple instruction multiple data

---

## Page 5

c
⃝
Isaac D. Scherson
Virtual Processors
I A program is expressed in a language that describes a virtual
machine.
I For a data parallel program, the virtual machine consists of a
(typically large) number of identical virtual processors (VPs),
communicating through an interconnection network.
I For instance, the standard data parallel program to multiply two N ⇥N
matrices may be viewed as a virtual machine consisting of N2 VPs
communicating in a mesh.
9 / 51
c
⃝
Isaac D. Scherson
Virtual Processors (Cont’d)
I For many years now, the concept of virtual processors has been
relegated to the status of a mere logical aid to programmers
I In our view, the notion of virtual processors should form the fundamental
basis for the deﬁnition of a Concurrent Computer System and for the
resource management strategies embedded in the OS.
10 / 51

---

## Page 6

c
⃝
Isaac D. Scherson
Redeﬁning Massive Parallelism
I A Programmer sees only a VM with as many Virtual Processors as
s/he needs.
I Solutions are cast in the space of the problem and not on that of the
physical machine.
I The measure of Massive Parallelism is through the number of VPs
the physical machine is capable of emulating per unit of time.
I HENCE . . . It does not matter what the physical machine looks like,
provided it can emulate Concurrent Computing Virtual Machines.
11 / 51
c
⃝
Isaac D. Scherson
Resource Management Operations
I Spatial scheduling: A space sharing policy that deﬁnes which
physical processor each VP is allocated to.
I Temporal scheduling: A time sharing policy that dictates how each
physical processor switches between the execution of the VPs
allocated to it.
I Load balancing: Static and/or Dynamic redistribution of VPs
among physical processors responding to some predetermined
objective function.
12 / 51

---

## Page 7

c
⃝
Isaac D. Scherson
Resource Management Operations
I Memory and I/O problems: Memory limitations and I/O
bottlenecks may also be phrased in terms of VPs. Memory limitations
occur when a processor does not have enough local memory to hold
all the VPs allocated to it. I/O bottlenecks are most pronounced while
loading (roll-in) the VPs of a job from the disk into the local memories
of various processors.
13 / 51
c
⃝
Isaac D. Scherson
AND NOW ...
A game you can play in your free time . . . . . .
14 / 51

---

## Page 8

c
⃝
Isaac D. Scherson
Model of the System
I Let ⇧= {⇡1, ⇡2, . . . , ⇡n}. denote the set of physical processors or
processing elements (PEs).
I Interconnection network details are ignored, only assuming that it
guarantees the completion of all communications within a reasonable
time bound (not necessarily a constant, as in the PRAM model).
I Let J = {J1, J2, . . . , Jm} denote the set of jobs in the system at some
time.
I For notational convenience, job Ji is identiﬁed with its set of VPs
{Pi1, Pi2, . . . , Pi|Ji|}.
15 / 51
c
⃝
Isaac D. Scherson
Handling Time
I Break time into time slices: discrete intervals of equal length.
I The time slice is assumed to be machine dependent and constant.
I Within each time slice, every ⇡i runs some VP chosen from the VPs
allocated to it, or it idles.
16 / 51

---

## Page 9

c
⃝
Isaac D. Scherson
Handling Time (Cont’d)
I A PE ⇡i runs a VP of a Job until:
I The VP issues a communication request which cannot be completed (data
to be read is not ready), or
I The time slice expires.
I The communication instruction is considered an indivisible instruction and
time slices are extended accordingly.
17 / 51
c
⃝
Isaac D. Scherson
Execution of Programs
I For simplicity of analysis, it is assumed that jobs run indeﬁnitely.
I The OS schedules an arriving Job as if the job is going to last forever in
the system
I This approximation reﬂects that the time slice is very small (in the
order of milliseconds) compared to the execution times of the jobs (in
the order of minutes).
I The assumption of inﬁnite running time might be removed with
negligible change to the ﬁnal results, but with signiﬁcant
complications in the deﬁnitions and proofs.
18 / 51

---

## Page 10

c
⃝
Isaac D. Scherson
The 2 Types of Scheduling
I Given a job, J, as a set of |J| VPs, how is this job allocated over the n
physical PEs of the concurrent computer so that the resources are
efﬁciently utilized?
I More generally, how are VPs of the same and different jobs, say
J1, J2, . . . , Jm, allocated over the PEs to efﬁciently utilize all system
resources?
I This is called the problem of spatial scheduling or spatial allocation.
I Intuitively. Spatial schedule: “Where to run the VPs of job J?”.
Temporal schedule: “When to run the VPs of job J?”.
19 / 51
c
⃝
Isaac D. Scherson
. . . and more formally
Deﬁnition
A spatial schedule is an n-tuple allocation function (The terms
allocation and spatial scheduling will be used interchangeably)
A : J −! IN|⇧|
such that for any job J, A(J) = (a1, a2, . . . , an), ai VPs of J are allocated to
processor ⇡i 2 ⇧, (
n
X
i=1
ai = |J|).
20 / 51

---

## Page 11

c
⃝
Isaac D. Scherson
. . . and more formally (Cont’d)
Deﬁnition
A temporal schedule for a time slice t is deﬁned as an n-tuple function, S(t),
such that S(t)[i] is the job run by ⇡i in the time slice t. A temporal schedule, S, is
a time ordered sequence of S(t) for all t > 0.
Deﬁnition
Deﬁne a schedule, S, to be impartial if every job J 2 J occurs inﬁnitely many times
in S.
An impartial schedule ensures that every job in it completes.
21 / 51
c
⃝
Isaac D. Scherson
Example
Consider a machine with 5 PEs and 5 jobs:
J1 requires 1 VP,
J2 requires 4 VPs,
J3 requires 1 VP,
J4 requires 5 VPs,
J5 requires 1 VP.
. . . suppose we allocate the VPs of the Jobs as follows . . .
22 / 51

---

## Page 12

c
⃝
Isaac D. Scherson
Example (Graphical)
With the following allocation functions:
A(J1) = (0, 0, 0, 0, 1)
A(J2) = (1, 1, 1, 0, 1)
A(J3) = (1, 0, 0, 0, 0)
A(J4) = (1, 1, 0, 3, 0)
A(J5) = (0, 0, 1, 0, 0)
23 / 51
c
⃝
Isaac D. Scherson
Job Execution
I Global communication: all VPs of a given Job execute a
communication instruction.
I Legal execution of a Job: no VP of the Job is ahead of any other
VP of the same job by more than one global communication step at
any time.
I Legal scheduling strategy: will always choose any trailing VP
before any non-trailing VP.
I A step begins when all VPs of a job have executed the same number
of global communications and it ends at the occurrence of the same
condition at a future time slice (after at least one VP of the job has
been executed).
24 / 51

---

## Page 13

c
⃝
Isaac D. Scherson
A Job’s Schedule Vector
Deﬁnition
Deﬁne a job J’s t-schedule vector, ✏(t, J) as a 0-1 n-tuple such that,
✏(t, J)[k] =
⇢1
if ⇡k 2 ⇧runs job J in time slice t
0
otherwise
25 / 51
c
⃝
Isaac D. Scherson
A Job’s Progress Vector
Deﬁnition
Deﬁne progress of a job (at the begining of a time slice t) as an n-tuple
function
P : t ⇥J −! IN⇧
such that:
1. P(t, J) = ~0 for t = 0,
2. If P(t −1, J) + ✏(t, J) = A(J) then P(t, J) = ~0,
else P(t, J) = P(t −1, J) + ✏(t, J) (where the addition is
componentwise)
3. P(t, J) A(J) where the order is applied componentwise.
26 / 51

---

## Page 14

c
⃝
Isaac D. Scherson
Progress Vector in English
The intuition behind the progress vector is as follows:
Start at the ﬁrst step of a job J, let job J proceed on the processor’s having
1’s on the ✏(t, J). If the progress vector reaches A(J) then another step of
job J is complete and progress counters associated with each processor
are reset. A new step cannot be started until the previous one is complete.
Every job has a progress vector associated with it at the beginning of
every time slice.
27 / 51
c
⃝
Isaac D. Scherson
A more complete Example
Consider an allocation on 5 processors (same example):
And consider the problem of scheduling J4.
28 / 51

---

## Page 15

c
⃝
Isaac D. Scherson
A more complete Example (Cont’d)
An arbitrary schedule for job J4 is as follows:
A(J4)
=
(1, 1, 0, 3, 0)
P(0, J4)
=
(0, 0, 0, 0, 0)
✏(1, J4)
=
(0, 1, 0, 1, 0)
P(0, J4) + ✏(1, J4)
=
P(1, J4)
=
(0, 1, 0, 1, 0)
✏(2, J4)
=
(1, 0, 0, 1, 0)
✏(1, J4) = (0, 1, 0, 1, 0) indicates that processors ⇡2 and ⇡4 run job J4.
✏(1, J4) is added to P(0, J4) componentwise to give the new progress vector
P(1, J4) for job J4 and so on.
29 / 51
c
⃝
Isaac D. Scherson
A more complete Example (Cont’d)
Continuing to schedule J4 . . .
P(1, J4) + ✏(2, J4)
=
P(2, J4)
=
(1, 1, 0, 2, 0)
✏(3, J4)
=
(0, 0, 0, 1, 0)
P(2, J4) + ✏(3, J4)
=
(1, 1, 0, 3, 0)
Now, P(3, J4) = A(J4), so reset, P(3, J4) = (0, 0, 0, 0, 0)
30 / 51

---

## Page 16

c
⃝
Isaac D. Scherson
System’s Progress and Schedule
Deﬁnition
Deﬁne the system progress matrix, Q, as a (n ⇥m)-array of progress
vectors (columns) of all jobs (rows) in the system.
Deﬁnition
Deﬁne the system schedule matrix, S, as a n −column matrix such that
each column corresponds to a physical processor while each row
corresponds to a time slice. Each entry is numbered with the job number
whose VP is executed at that time slice.
31 / 51
c
⃝
Isaac D. Scherson
A Schedule for the Example
Time/PE
⇡1
⇡2
⇡3
⇡4
⇡5
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
32 / 51

---

## Page 17

c
⃝
Isaac D. Scherson
Another Schedule for the Example
Time/PE
⇡1
⇡2
⇡3
⇡4
⇡5
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
Same period as the previous schedule (3) but only one idle slice per period.
33 / 51
c
⃝
Isaac D. Scherson
Schedules and Allocations
I A Schedule will strongly depend upon the initial Allocation.
I Challenge: Find another allocation/schedule for the example such
that there are no idle time slices.
34 / 51

---

## Page 18

c
⃝
Isaac D. Scherson
Metrics
There are two points of view when measuring the system’s performance.
I One focuses on the functional quality from the system manager’s
point of view, who is concerned with the throughput and utilization of
the machine.
I The second focuses on the functional quality from the users’ point of
view who expects the system to respond within a speciﬁc time.
35 / 51
c
⃝
Isaac D. Scherson
Scheduling Metrics
For the case of Scheduling:
I Question: Which schedule is the “best”?
I The parallel OS should be able to satisfy two objectives:
I Minimize processor idling time (important for the System).
I Guarantee an upper limit on the system response time to every job
(important to the single user).
36 / 51

---

## Page 19

c
⃝
Isaac D. Scherson
Idling Ratio
Deﬁnition
For a n-processor system, for a schedule S, and over and interval of ∆t
time slices, deﬁne an idling ratio or throughput ıS : IN ! IR as:
ıS(∆t) =
X
k2∆t
ik
n ⇥∆t
where ik is the total number of idling processors during time slice k.
The idling ratio is a measure of the resource utilization.
37 / 51
c
⃝
Isaac D. Scherson
Idling Ratio for the Example
Time/PE
⇡1
⇡2
⇡3
⇡4
⇡5
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
38 / 51

---

## Page 20

c
⃝
Isaac D. Scherson
Idling Ratio for the Example
Time/PE
⇡1
⇡2
⇡3
⇡4
⇡5
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
39 / 51
c
⃝
Isaac D. Scherson
An Interesting Case
Consider a system where only one job is running and utilizes all
processors (J1 has 5 VPs):
Time/PE
⇡1
⇡2
⇡3
⇡4
⇡5
1
1
1
1
1
1
40 / 51

---

## Page 21

c
⃝
Isaac D. Scherson
An Interesting Case
. . . SUDDENLY . . .
41 / 51
c
⃝
Isaac D. Scherson
An Interesting Case
. . . SUDDENLY . . .
Another job J2 arrives and requires 4 VPs
42 / 51

---

## Page 22

c
⃝
Isaac D. Scherson
An Interesting Case
In a hurry, the system allocates and schedules J2 in the apparently
obvious manner:
Time/PE
⇡1
⇡2
⇡3
⇡4
⇡5
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
43 / 51
c
⃝
Isaac D. Scherson
An Interesting Case
BUT . . . Consider the following 0% Idling Ratio Schedule:
Time/PE
⇡1
⇡2
⇡3
⇡4
⇡5
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
44 / 51

---

## Page 23

c
⃝
Isaac D. Scherson
Happiness Function
Deﬁnition
Deﬁne the happiness function, ~∆t(J), of a job J for a time length ∆t as,
~∆t(J) = min
t≥0
8
>
>
>
>
>
<
>
>
>
>
>
:
t+∆t−1
X
⌧=t
X
⇡2⇧
✏(⌧, J)
|J| · ∆t
9
>
>
>
>
>
=
>
>
>
>
>
;
The time interval ∆t is the Impatience Latency of the user.
45 / 51
c
⃝
Isaac D. Scherson
Happiness Function
I Intuitively, happiness represents the machine power that a job is
given during a time slice. The term in the braces represents the
fraction of the full parallel speedup that was achieved by job J in
time interval (t, t + ∆t −1).
I ∆t represents the expected impatience latency of the user. It is the
minimum time the user is required to wait before the system
responds.
46 / 51

---

## Page 24

c
⃝
Isaac D. Scherson
Virtual Happiness
I The proposed parallel OS paradigm allows the user to program in a
virtual parallel model with no limit on the number of VPs in a job.
I To get a handle on the maximum parallel speedup that can be
achieved for a job given n physical processors, deﬁne virtual
happiness,
v(J) = min{1,
n
|J|}.
I Virtual happiness of a job J represents the happiness of the job if the
entire machine is used by J.
I Hence, J cannot be happier than v(J).
47 / 51
c
⃝
Isaac D. Scherson
Happiness is a Balancing Act
I A Job (user) will be happier if it acquires more parallel speedup over
time.
I If a schedule is unable to provide the required happiness for a job,
rescheduling with a different allocation may have to be considered.
I If the required happiness for a set of jobs cannot be achieved by any
allocation, then some jobs must be queued for later allocation.
I A happy schedule is not necessarily optimal for throughput. It
merely guarantees an upper limit on the response time.
48 / 51

---

## Page 25

c
⃝
Isaac D. Scherson
Periodic Temporal Schedules
Deﬁnition
For an allocation A, Sp = S(t), S(t + 1), . . . , S(t + p −1) is called a
periodic schedule, iff 9 p > 0 such that S(t) = S(t + p) for all t > ts,
where ts is called the startup time of the schedule. p is the period of the
schedule.
Also for each job J in Sp,
X
1tp,1i|⇧|
[S(t)[i] = J] = k · |J|
must be true for some positive integer k to ensure that each job executes
iat least k steps during each period (k need not be the same for every job).
49 / 51
c
⃝
Isaac D. Scherson
How far did we go?
I This is Work in Progress. A lot to be done !
I We have proven a few theorems on Impartial Periodic Schedules.
I Periodic Schedules are the BEST !!
I We have conditions to minimize Idling Ratio and maximize Happiness.
50 / 51

---

## Page 26

c
⃝
Isaac D. Scherson
Collaborations Welcome
Anybody interested ? . . . Let’s work together !!!
THANKS !!
51 / 51
