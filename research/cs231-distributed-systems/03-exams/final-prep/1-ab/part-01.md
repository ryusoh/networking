# 1-ab - Part 01 (Pages 1-12)

---

## Page 1

Tanenbaum & Van Steen, Distributed Systems: Principles and Paradigms, 2e, (c) 2007
Prentice-Hall, Inc. All rights reserved. 0-13-239227-5
1

---

## Page 2

 A distributed system is:
 A collection of independent
computers that appears to its users
computers that appears to its users
as a single coherent system.
Tanenbaum & Van Steen, Distributed Systems: Principles and Paradigms, 2e, (c) 2007
Prentice-Hall, Inc. All rights reserved. 0-13-239227-5
2

---

## Page 3

Figure 1-1. A distributed system organized as middleware. The middleware
layer extends over multiple machines, and offers each  application the
same interface.
Tanenbaum & Van Steen, Distributed Systems: Principles and Paradigms, 2e, (c) 2007
Prentice-Hall, Inc. All rights reserved. 0-13-239227-5
3

---

## Page 4

Hid
h
Make
Hide the
fact that
resources
It should
Resources
Easily
resources
are
distributed
It should
be Open.
It should
be
Scalable
Accessible.
distributed
across a
network.
Scalable.
Tanenbaum & Van Steen, Distributed Systems: Principles and Paradigms, 2e, (c) 2007
Prentice-Hall, Inc. All rights reserved. 0-13-239227-5
4

---

## Page 5

Main goal of D S is to make it easy for the users to
Main goal of D. S. is to make it easy for the users to
access remote resources and share them.
Reasons for sharing Resources:
• Economics
• Collaborate and Exchange Information
• Collaborate and Exchange Information.
Security
Security.
Tanenbaum & Van Steen, Distributed Systems: Principles and Paradigms, 2e, (c) 2007
Prentice-Hall, Inc. All rights reserved. 0-13-239227-5
5

---

## Page 6

Figure 1-2. Different forms of transparency in a
Tanenbaum & Van Steen, Distributed Systems: Principles and Paradigms, 2e, (c) 2007
Prentice-Hall, Inc. All rights reserved. 0-13-239227-5
6
distributed system (ISO, 1995).

---

## Page 7

 Trade‐off between high degree of
transparency and the performance of a
transparency and the performance of a
system.
l
 Conclusion:
 Aiming for distribution transparency is a nice goal.
g
p
y
g
 Should be considered with other issues:
▪Performance
Performance.
▪Comprehensibility.
 Price for not being full transparent may be high
 Price for not being full transparent may be high
Tanenbaum & Van Steen, Distributed Systems: Principles and Paradigms, 2e, (c) 2007
Prentice-Hall, Inc. All rights reserved. 0-13-239227-5
7

---

## Page 8

 Is a system that offers services according to
standard rules that describe the syntax and
standard rules that describe the syntax and
semantics of those services.
 Interface Definition Language.
 Interoperability.
p
y
 Portability.
 Extensible
 Extensible.
Tanenbaum & Van Steen, Distributed Systems: Principles and Paradigms, 2e, (c) 2007
Prentice-Hall, Inc. All rights reserved. 0-13-239227-5
8

---

## Page 9

 Separating Policy from Mechanism:
S
t
h
ld b
ll
ti
f
l ti
l
 System should be as a collection of relatively
small and easily replaceable or adaptable
t
components.
 E.g. monolithic approach (closed system).
 World wide web (Caching ).
Tanenbaum & Van Steen, Distributed Systems: Principles and Paradigms, 2e, (c) 2007
Prentice-Hall, Inc. All rights reserved. 0-13-239227-5
9

---

## Page 10

Can be measured a long at least
three different dimensions:
With respect to
( dd
Geographically
Administratively
size ( add users,
resources).
Geographically
scalable.
Administratively
Scalable.
Tanenbaum & Van Steen, Distributed Systems: Principles and Paradigms, 2e, (c) 2007
Prentice-Hall, Inc. All rights reserved. 0-13-239227-5
10

---

## Page 11

Tanenbaum & Van Steen, Distributed Systems: Principles and Paradigms, 2e, (c) 2007
Prentice-Hall, Inc. All rights reserved. 0-13-239227-5
11

---

## Page 12

N
hi
h
l t
• No machine has complete
information about the system state.
• Machines make decisions based only
Characteristics
• Machines make decisions based only
on local information.
• Failure of one machine does not ruin
of
decentralized
the algorithm.
• There is no implicit assumption that
l b l l
k
i
decentralized
algorithms:
a global clock exists.
Tanenbaum & Van Steen, Distributed Systems: Principles and Paradigms, 2e, (c) 2007 Prentice-Hall, Inc. All rights
reserved. 0-13-239227-5
12
