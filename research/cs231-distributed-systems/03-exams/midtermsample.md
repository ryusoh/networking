# midtermsample

---

## Page 1

Name:                                                                                ID#:

SAMPLE MIDTERM EXAMINATION
CompSci 237 Distributed Systems Middleware
Spring 2016

In recognition of and in the spirit of the University of California Honor Code,
I certify that I will neither give nor receive unpermitted aid on this exam.

Signature__________________________________

Instructions:
1. Do not start this test until the proctors say you can begin.
2. There are 100 points possible on this test.
3. The exam contains X pages, please check to see if you have all of them.
4. Place all class materials under your desk.  This is a CLOSED book exam.
5. Quickly browse each problem before beginning the test.  Note that some questions are worth more
points than others.
6. You may use the reverse side of each sheet if you need more room.
7. If you have any questions about any problems, raise your hand until a proctor can help you.
8. Be brief in your answers.

The exam consists of the following parts:
l
Part A: 15 True/False questions worth 30 points.
l
Part B:  6 short answer questions worth 30 points
l
Part C: 2 X 2 problems worth 40 points
l
The time limit for the exam is 1 hour 15 minutes.

PART
MAX POINTS
SCORE
A
30

B
30

C
40

Total:______________

https://www.coursehero.com/file/34066760/midtermsamplepdf/
This study resource was
shared via CourseHero.com

---

## Page 2

Part A     [True/False, 30 Points]
Mark the following True/False questions using T for True and F for False. Please mark
in front of each question number.

___  1. In Berkeley UNIX algorithm, one daemon asks all machines for their time and
computes an average time and broadcasts this average time.

___  2. The global state of a distributed system is calculated by collecting the local states
of the processes.

___  3. The Horus group communication system implements the notion of extended
virtual synchrony.

___  4. Distributed OS looks like a virtual uniprocessor (more or less), contains n copies
of the OS, communicates via shared files.

___  5. Lamport’s algorithm for mutual exclusion requires between 3(N − 1) and 2(N −
1) messages per CS execution.

___  6. Mosix allows processes to access a distributed file system through the current
kernel.

…… (15 questions)

Part B - Short questions: Try to limit your answer to about 4-5 lines per question

1. Lamport defined a notion of virtual time based on event ordering – the
“happenedbefore” relation. Show how a global total ordering of events can be achieved
based on this notion of Lamport’s logical clocks

2. Describe the role of “marker” messages in the Chandy Lamport distributed snapshot
algorithm. State one drawback of this algorithm and a possible method to overcome this
limitation.

3. State the leader election problem as applied to distributed operating systems in your
own words. Suggest 2 techniques to solve the leader election problem. What are tradeoffs
that need to be addressed.

https://www.coursehero.com/file/34066760/midtermsamplepdf/
This study resource was
shared via CourseHero.com

---

## Page 3

4. Given n processes, calculate an upper bound on the number of messages required per
critical section in the token-ring algorithm for distributed mutual exclusion.
…. (8 questions)

Part C – Long questions (2 questions worth 15 points each) --
30 points

C.1 Vector Clocks and Global Snapshots:
(a) What is the structure used to maintain logical time in the Fidge/Mattern scheme of
vector clocks. What are the update rules for this structure?

(b) Consider the following event diagram for processes P1,P2 and P3 executing in a
distributed system. Compute the vector that is piggybacked on each message.

(c) The vector clock method has the drawback of high message overhead when the
number of processes are large. Briefly discuss one possible method to reduce the
overhead of message transmission in vector clocks.

https://www.coursehero.com/file/34066760/midtermsamplepdf/
This study resource was
shared via CourseHero.com
Powered by TCPDF (www.tcpdf.org)
