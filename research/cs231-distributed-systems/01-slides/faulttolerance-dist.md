# faulttolerance-dist

---

## Page 1

c
⃝
Isaac D. Scherson
Distributed [Computing] Systems
Fault Tolerance
Isaac D. Scherson (aka The Schark c¨^ )
Dept. of Computer Science (Systems)
Bren School of Information and Computer Sciences
University of California, Irvine
Irvine, CA 92697-3425
isaac@ics.uci.edu
www.ics.uci.edu/˜isaac
www.ics.uci.edu/˜schark
CompSci-230, Winter 2019
1 / 41
c
⃝
Isaac D. Scherson
Fault Tolerance
2 / 41

---

## Page 2

c
⃝
Isaac D. Scherson
Basic Concepts
Dependability includes:
I Availability: Fraction of time system is “up”
I Reliability: System up long time (MTBF)
I Safety: Failures do not corrupt system/data
I Maintainability: How easy is system to ﬁx?
3 / 41
c
⃝
Isaac D. Scherson
Failure Models
Fail-stop versus Byzantine failures
Type of Failure
Description
Crash failure
A server halts, but is working correctly until it halts
Omission failure:
Receive omission
Send omission
A server fails to respond to incoming requests
A server fails to receive incoming messages
A server fails to send messages
Timing failure
A server’s response lies outside the speciﬁed time interval
Response failure:
Value failure
State transition failure
The server’s response is incorrect.
The value of the response is wrong,
Server deviates from the correct ﬂow of control
Arbitrary failure
A server may produce arbitrary responses at arbitrary times
4 / 41

---

## Page 3

c
⃝
Isaac D. Scherson
Building Fault Tolerant Systems
Four major techniques:
I Redundancy:
I Multiple copies of everything (processes & data)
I Quorums and voting (agreement)
I Checkpointing
I Track state changes and be ready to “rollback”
I Consistent versus independent checkpoints
I Message logging (and checkpointing)
I Augment checkpoints with dynamic event logs
I Transactions
I Rewrite apps to be fault tolerant via abort-retry
5 / 41
c
⃝
Isaac D. Scherson
Other Issues
Designers of FT systems also need to handle:
I Detecting faults
I Heartbeats, voting, CRCs...
I Recovering lost data and/or computation
I Checkpoints, other replicas...
I Coping with interactions with the “outside world”
I Outside world: Components outside your control
I Problem: Cannot just roll them back (no “Oops!”)
6 / 41

---

## Page 4

c
⃝
Isaac D. Scherson
Replication (Active vs Passive)
I Idea: Replicate key data and/or resources
I If data/resources are lost, use remaining copies
I Active replication
I All processes/data are replicated (e.g., Triple Modular Redundancy)
I All replicas perform same set of ops (multicast)
I Need an agreement algorithm (e.g., voting)
I Passive replication
I Master-slave replication
I Only master does work normally ! pushes state
7 / 41
c
⃝
Isaac D. Scherson
Failure Masking by Redundancy
Triple modular redundancy
8 / 41

---

## Page 5

c
⃝
Isaac D. Scherson
Implementing Active Replication
I Basic idea:
I Create N copies of each service/resource
I Ensure all ops done in same order everywhere (One idea ! reliable
ordered multicast (hard, slow))
I If a node fails, re-replicate from surviving node
I Questions:
I In what ways does this model restrict generality?
I What if replicas do not agree on outcome of op?
I How do we handle Byzantine failures?
I How do we distinguish server failure from dropped message?
9 / 41
c
⃝
Isaac D. Scherson
Flat Groups versus Hierarchical Groups
(a) Communication in a ﬂat group.(b) Communication in a simple hierarchical
group
10 / 41

---

## Page 6

c
⃝
Isaac D. Scherson
Voting and Quorums
I Issue: Replicas might not agree on outcome
I Non-determinism, faults, lost messages, . . .
I Need to agree on ultimate outcome
I Typical solution: Voting
I Deﬁne “read” and “write” quorums (Typical: R=1, W=N or R = W =
(N+1)/2)
I N replicas compare their outcomes
I Pick outcome of operation based on quorum vote
I Many variants of voting schemes
I Check literature...
11 / 41
c
⃝
Isaac D. Scherson
Byzantine Agreement (review)
The Byzantine generals problem for 3 loyal generals and 1 traitor. (a) The generals
announce their troop strengths (in units of 1 kilosoldiers). (b) The vectors that each
general assembles based on (a). (c) The vectors that each general receives in step 3.
12 / 41

---

## Page 7

c
⃝
Isaac D. Scherson
Byzantine Agreement
The same as in previous slide, except now with 2 loyal generals and one traitor.
13 / 41
c
⃝
Isaac D. Scherson
Byzantine Agreement
A server in client-server communication
(a) Normal case
(b) Crash after execution
(c) Crash before execution
14 / 41

---

## Page 8

c
⃝
Isaac D. Scherson
Server Crash Strategies
        Client
            Server
         Strategy M  P
     Strategy P  M
Reissue strategy
MPC
MC(P) C(MP)
PMC
PC(M) C(PM)
Always
DUP
OK
OK
DUP
DUP
OK
Never
OK
ZERO
ZERO
OK
OK
ZERO
Only when ACKed
DUP
OK
ZERO
DUP
OK
ZERO
Only when not ACKed
OK
ZERO
OK
OK
DUP
OK
Different combinations of client and server strategies in the presence of server
crashes.
15 / 41
c
⃝
Isaac D. Scherson
Basic Reliable-Multicasting Schemes
A simple solution to reliable multicasting when all receivers are known
and are assumed not to fail
(a) Message transmission
(b) Reporting feedback
16 / 41

---

## Page 9

c
⃝
Isaac D. Scherson
Virtual Synchrony (Ordered Multicast)
The logical organization of a distributed system to distinguish between message
receipt and message delivery
17 / 41
c
⃝
Isaac D. Scherson
Virtual Synchrony
The principle of virtual synchronous multicast.
18 / 41

---

## Page 10

c
⃝
Isaac D. Scherson
Implementing Virtual Synchrony
Multicast
Basic Message Ordering Total-ordered Delivery?
Reliable multicast
None
No
FIFO multicast
FIFO-ordered delivery
No
Causal multicast
Causal-ordered delivery No
Atomic multicast
None
Yes
FIFO atomic multicast FIFO-ordered delivery
Yes
Causal atomic
multicast
Causal-ordered delivery Yes
Six different versions of virtually synchronous reliable multicasting.
19 / 41
c
⃝
Isaac D. Scherson
Passive Replication
Request
Response
Ping
I Master-slave replication
I Only “master” computes
I Slaves receive updates
I If master dies, pick new leader
I Fail-over issues:
I New master might take a while to bring up to date
(apply updates). (Checkpoint/restore or
Checkpoint/apply logged ops)
I Clients must switch to new master (Preferably
seamless, invisible, fast)
I Failover usually slower than active replication
20 / 41

---

## Page 11

c
⃝
Isaac D. Scherson
Distributed Checkpointing
I Idea:
I Periodically record state of process(es)
I If process fails, can restart from checkpoint.
I Issues :
I How often should you take checkpoints?
I Where do we store checkpoints?
I What state must be saved in a checkpoint?
I Do we coordinate the N checkpoints?
I What can happen if we do not coordinate?
I How much overhead will checkpointing add?
21 / 41
c
⃝
Isaac D. Scherson
Stable Storage (e.g., RAID)
(a) Stable Storage
(b) Crash after drive 1 is updated
(c) Bad spot
22 / 41

---

## Page 12

c
⃝
Isaac D. Scherson
Checkpointing
A recovery line.
23 / 41
c
⃝
Isaac D. Scherson
Independent Checkpointing
Issue: Domino effect.
24 / 41

---

## Page 13

c
⃝
Isaac D. Scherson
Consistent Checkpointing
I Problem: Independent checkpoints can lead to cascading rollbacks
(domino effect)
I Idea: Eliminate domino effect by only taking checkpoint that are
“globally consistent”
I Coordinator takes checkpoint and updates “era”
I Coordinator tags outgoing messages w/ new “era”
I If you receive a message from “newer era” ! take a checkpoint
I Can send NULL messages to force checkpoints
25 / 41
c
⃝
Isaac D. Scherson
Consistent Checkpointing
26 / 41

---

## Page 14

c
⃝
Isaac D. Scherson
Discussion
I What state do we need to save?
I All state a process depends on:
I Address space, OS state, timer state, machine state, message layer state, ...
I Virtual machine technology can simplify problem
I How much overhead does checkpointing add?
I If done well, only aprox. 10% failure-free overhead (app-dependent,
interval-dependent)
I How can we keep checkpointing overhead low?
I Incremental checkpoints (copy-on-write)
I Increase checkpoint interval (tradeoff)
27 / 41
c
⃝
Isaac D. Scherson
Discussion (cont’d)
I Coordinated vs independent checkpoints
I Extra overhead of coordination is small (surprise!)
I Major hit is the synchronized hit on ﬁleserver
I What about outside world?
I Cannot rollback outside world
I Option: Checkpoint state before/after interaction
I What are some potential problems:
I Failure forces rollback of ALL processes
I Hard to checkpoint all important information
I Interactions with outside world are ugly
28 / 41

---

## Page 15

c
⃝
Isaac D. Scherson
Message Logging and Checkpointing
I Idea: Enhance checkpointing w/ logs
I Upon failure
I Rollback only failed process
I Replay events to process in same order as originally
I Cull retransmissions sent during original execution
I Assumptions:
I Process execution is deterministic
I All important events can be logged
I Fail-stop processing
29 / 41
c
⃝
Isaac D. Scherson
Message Logging Implementation
30 / 41

---

## Page 16

c
⃝
Isaac D. Scherson
Message Logging: Orphans
Incorrect replay of messages after recovery, leading to an orphan process.
31 / 41
c
⃝
Isaac D. Scherson
Forms of Message Logging
I Pessimistic Logging:
I Log events before applying them to process
I Problem: Slows failure-free performance
I Beneﬁt : Can always recover
I Optimistic Logging:
I Log events in parallel with handing to process
I Faster but leaves small window of vulnerability
I Sender-based versus receiver-based logging
I Logging in volatile storage
32 / 41

---

## Page 17

c
⃝
Isaac D. Scherson
Discussion
I What events can/should we log?
I What problems arise?
I Does this help interactions w/ outside world?
I Why or why not?
I What performance overheads can we expect?
I Better or worse than checkpointing alone?
I Transparent versus programmer-induced?
33 / 41
c
⃝
Isaac D. Scherson
Transaction-Based Fault Tolerance
I Idea: Expose fault tolerance issues to apps
I App writers write in terms of “transactions”
I If a fault occurs – abort transaction(s) and retry
I Issue: Getting N replicas to commit/abort
I Solution: Two-phase commit
I One replica designated “coordinator”
I Require same semantics as database transactions (ACID)
I Tricky part: Distributed agreement on commit/abort
34 / 41

---

## Page 18

c
⃝
Isaac D. Scherson
ACID properties of transactions
In the context of transaction processing, the acronym ACID refers to the
four key properties of a transaction:
I atomicity
I consistency
I isolation
I durability
35 / 41
c
⃝
Isaac D. Scherson
ACID properties of transactions
I Atomicity: All changes to data are performed as if they are a single
operation. That is, all the changes are performed, or none of them
are. For example, in an application that transfers funds from one
account to another, the atomicity property ensures that, if a debit is
made successfully from one account, the corresponding credit is made
to the other account.
I Consistency: Data is in a consistent state when a transaction starts
and when it ends. For example, in an application that transfers funds
from one account to another, the consistency property ensures that
the total value of funds in both the accounts is the same at the start
and end of each transaction.
36 / 41

---

## Page 19

c
⃝
Isaac D. Scherson
ACID properties of transactions
I Isolation: The intermediate state of a transaction is invisible to
other transactions. As a result, transactions that run concurrently
appear to be serialized. For example, in an application that transfers
funds from one account to another, the isolation property ensures
that another transaction sees the transferred funds in one account or
the other, but not in both, nor in neither.
I Durability: After a transaction successfully completes, changes to
data persist and are not undone, even in the event of a system
failure. For example, in an application that transfers funds from one
account to another, the durability property ensures that the changes
made to each account will not be reversed.
37 / 41
c
⃝
Isaac D. Scherson
Two-Phase Commit
I Coordinator sends “PREPARE TO COMMIT”
I Cohorts write current state and “TENT COMMIT” record in log
I Cohorts reply to coordinator with “READY TO COMMIT”
I If all are ready, coordinator writes “COMMIT” record to log, else
“ABORT”
I If transaction commits, coordinator sends out “COMMITED” message
38 / 41

---

## Page 20

c
⃝
Isaac D. Scherson
Two-Phase Commit
(a) The ﬁnite state machine for the coordinator in 2PC.
(b) The ﬁnite state machine for a participant.
39 / 41
c
⃝
Isaac D. Scherson
Two-Phase Commit
State of Q
Action by P
COMMIT
Make transition to COMMIT
ABORT
Make transition to ABORT
INIT
Make transition to ABORT
READY
Contact another participant
Actions taken by a participant P when residing in state READY and having
contacted another participant Q.
40 / 41

---

## Page 21

c
⃝
Isaac D. Scherson
Summary
I Fault tolerance is HARD:
I Many tradeoffs:
I Resources dedicated to FT versus performance
I User transparency versus performance
I Failure-free overhead versus recovery time
I Availability versus “correctness” (network partitions)
I Replication versus logging versus transactions
I Byzantine fault tolerance particularly hard
41 / 41
