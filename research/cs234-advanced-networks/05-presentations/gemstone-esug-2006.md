# gemstone-esug-2006

---

## Page 1

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
1
Norman R. Green
<norm.green@gemstone.com>
Director of Engineering
GemStone Systems Inc.

---

## Page 2

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
2
Subjects For Today’s Talk
• GemStone Systems At A Glance (briefly)
• What Is GemStone/S? (briefly)
• Why 64 Bit?
• Phas
• Smalltalk Coding Changes
• Future Features

---

## Page 3

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
3
GemStone Systems at a Glance
• Founded 1982
• Headquarters: Beaverton, Oregon, USA
• Privately Hel
• Experienced Engineering Team
ØMany employees with 10+ years tenure
ØSome over 20 years.
• Over 200 installed customers
• 24 x 7 global support.

---

## Page 4

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
4
Banking / Finance
Government
Telecommunications
Transportation/Shipping
GemStone/S Customers

---

## Page 5

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
5
What Is GemStone/S?
Three Easy Pieces:
1.
An Object Oriented Database
Ø
Objects stored in object format
Ø
No tables,
Ø
A
Ø
Atomic – all or nothing
Ø
Consistent – start/end states are consistent
Ø
Isolation – Commit in Session A does not
immediately affect Session B
Ø
Durable – cannot be rolled back once committed.

---

## Page 6

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
6
What Is GemStone/S?
2. A Smalltalk dialect
Ø Comes with a complete set of Kernel
Classes.

a
rs, etc).

---

## Page 7

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
7
What Is GemStone/S?
3. An Application Server
Ø Applications have been written entirely in
GemStone/S.
Ø Java
Ø C & C++
Ø UNIX shell (using topaz)

---

## Page 8

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
8
Why GemStone 64 Bit?
• Customers desired to scale beyond
the 32-bit limits:
Ø4 GB Addr
ory
Ø1

---

## Page 9

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
9
Why GemStone 64 Bit?
• Why Do We Care About 32 Bit Limits?
• Examples
Ø5 GB reposi
ed page cache
Ø100 GB repository, 2 GB Shared page cache
• 2% of database cached
• Performance: POOR

---

## Page 10

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
10
Moving to 64 Bit
• Project Divided Into 2 Phases:
ØPhase 1: 64 bit address space
ØPhase 2: 6
entifiers

---

## Page 11

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
11
GemStone/64 Phase 1
Phase 1 Goals
• Performance Scalability
ØExploit 64
ce
ØRe

---

## Page 12

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
12
GemStone/64 Phase 1
Phase 1 Features
Ø100% 64 bit
Ø2 billion O
ØSu
• Solaris 9, 10
• HPUX 11.11 (PA-RISC)
• AIX 5.2, 5.3
• Linux x86_64 (RH 4, SuSE 9.3)

---

## Page 13

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
13
GemStone/64 Phase 1
Phase 1 Features
ØGemBuilder for Smalltalk (GBS) Support
• VisualWor

---

## Page 14

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
14
GemStone/64 Phase 1
Phase 1 Improvements
ØSupports very large Shared Page
Caches

---

## Page 15

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
15
GemStone/64 Phase 1
Phase 1 Improvements
ØShared Cache Warming
• Loads dat
d cache
•
mes full
or all data was loaded.

---

## Page 16

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
16
GemStone/64 Phase 1
Phase 1 Improvements
ØNo more “large object leaks”
• Old Design
• New Design
– Objects only go to disk if referenced by a committed
object.
– No exceptions for large objects.
• Net effect: Large reduction in garbage object
creation.

---

## Page 17

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
17
GemStone/64 Phase 1
Phase 1 Improvements
ØImproved Symbol Management
• Symbol G
.
– Guarantees symbols are always canonical
• Faster Symbol Lookup
– AllSymbols collection redesigned for speed
– Lookups now use binary searches

---

## Page 18

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
18
GemStone/64 Phase 1
Phase 1 Improvements
ØOnline Backups
• Safely co
nts while system
•
borts are
allowed.

---

## Page 19

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
19
GemStone/64 Phase 1
Phase 1 Improvements
ØParallelized Garbage Collection
• Reclaim
ts
– Run “online” with production
– Improved reclaim performance for large
production systems.

---

## Page 20

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
20
GemStone/64 Phase 1
Phase 1 Improvements
ØMajor Virtual Machine Redesign
• Copy-on-r
ger (OM)
– All objects read/written are copied to private VM
memory.
– Large working set = large memory footprint
• Byte code dispatch loop written in assembler

---

## Page 21

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
21
GemStone/64 Phase 1
Te
GS 6.1
GS64 1.1
100 factorial
2.397
2.092
Commit 6.5 MB data
54.541
20.136
Fault and verify 30 MB data
3.478
2.469
Create & de-ref 6.5MB objs
3.8879
0.3809
Phase 1 Improvements
Faster Smalltalk Virtual Machine

---

## Page 22

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
22
GemStone/64 Phase 1
Phase 1 Engineering Tasks
• For 615,000 lines of C code:
ØConvert to C
• long -> int
• unsigned long -> unsigned int
ØRewrite object manager and LOM garbage
collector from scratch
• Duration: 15 months

---

## Page 23

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
23
GemStone/64 Phase 1
Phase 1 Production Customers
ØChina Ocean Shipping Company (COSCO)
• Location: Shanghai, China
• Business: C
•
ØIntercontinental Exchange (ICE)
• Location: Atlanta, GA
• Business: Energy Futures Trading
• Platforms: AIX, Windows XP
• URL: <www.theice.com>

---

## Page 24

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
24
GemStone/64 Phase 1
Phase 1 Production Customers
ØNorthwater Capital
• Location: Toronto, Canada
•
ØSoon: Dutch Agricultural Institute (LEI)
• Location: The Hague, Netherlands
• Business: Government
• Platforms: Solaris, Windows
• URL: <www.lei.nl>

---

## Page 25

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
25
GemStone/64 Phase 2
Phase 2 Goals
• Object Volume Scalability
ØSupport ve
tories
ØFu
s

---

## Page 26

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
26
GemStone/64 Phase 2
Phase 2 Features
Ø64 bit object IDs
• Maximum
cts
•
• Max extent size: 32 TB
• Max database size:  8,160 TB

---

## Page 27

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
27
GemStone/64 Phase 2
Phase 2 Features
ØFaster Smalltalk VM
• Add 100 A
lk byte codes
ØEx
• ±260 (±1,152,921,504,606,846,976)
• Previous range: ±229

---

## Page 28

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
28
GemStone/64 Phase 2
Phase 2 Features
ØNew Special Class: SmallDouble
• Subset of
ormat
– Range: 5.0e-39 to 6.0e+38 (approx)
• Specials encapsulate their value in the in
the object ID
• No disk I/O

---

## Page 29

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
29
GemStone/64 Phase 2
Phase 2 Features
ØBetter Indexes on Collections
• Complete
indexing
•
• Fewer concurrency conflicts
• Same query semantics as before
AllEmployees detect:{:e| e.firstName = ‘Stephane’ & e.lastName = ‘Ducasse’ }

---

## Page 30

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
30
GemStone/64 Phase 2
GemStone/64 2.x Features
ØConversion From Previous Releases
• GemSton

---

## Page 31

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
31
GemStone/64 Phase 2
GemStone/64 2.0
ØReleased 3/31/2006
ØSupported
•

---

## Page 32

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
32
GemStone/64 Phase 2
Production Customers
• OOCL (Orient Overseas Container
Limited)
ØBu
ØPlatforms: Solaris, HPUX, Windows XP
ØURL: <www.oocl.com>

---

## Page 33

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
33
GemStone/64 Phase 2
Production Customers
• OOCL
ØProduction
7/30/06
Ø1.7 billion objects
Ø1800 concurrent users

---

## Page 34

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
34
GemStone/64 Phase 2
OOCL
• Performance:
ØServer VM
ØClient – Server Network load:
• 20% more bytes
– 32 -> 64 bit oops

---

## Page 35

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
35
GemStone/64 Phase 2
OOCL
• Performance:
ØVW Client
•
ntegers
• GemBuilder For Smalltalk (GBS)
performance loss
• Improved GBS coming in October
ØOverall Application Performance: 15%
slower.

---

## Page 36

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
36
GemStone/64 Phase 2
GemStone/64 2.1
ØTarget: October 2006:
ØAdd suppo
•
ØVM Performance Improvements
ØIndex improvements
ØBug fixes

---

## Page 37

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
37
GS/64 Coding Changes
Possible Problems
• In the new GS64 VM design:
ØAll objects
he interpreter
obj
ity.
• This was not true before GemStone64

---

## Page 38

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
38
GS/64 Coding Changes
Possible Problems: Example
So this code…
^Object
…may be fast in GS 6.1, but not in GS 64.
Who Knows Why ?

---

## Page 39

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
39
GS/64 Coding Changes
aLargeArray do:[:each| each == someObject
ifTrue:[^each]. ].
^Object error: #keyNotFound.
• == co
GS 64:
• == compares identity, but each must be read into
memory.

---

## Page 40

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
40
GS/64 Coding Changes
Solution: Do it this way:
|index|
index := aLargeArr
cal: someObject.
ifFals

## indexOfIdentical calls a primitive,
which is smart enough to search
without faulting in the objects in
aLargeArray

---

## Page 41

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
41
GS/64 Coding Changes
Other Methods Added To Avoid
Unnecessary Object Faulting
• IdentityBag >> copyFrom:count:into:startingAt:
• Ordere
• SequencableCollection >>
copyFrom:count:into:startingAt:

---

## Page 42

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
42
GemStone/64 Future Releases
• Multi-threaded garbage collection
ØmarkForCollection, etc
• Multi-threade
lay
ØCr
• Multi-thread the Stone process
• Improved VM Performance

---

## Page 43

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
43
GemStone/64 Future Features
• Additional Special Classes
ØCandidates:
• Date
•
• ScaledDecimal
• Reduced Conflict (RC) Indexes on
Collections

---

## Page 44

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
44
GemStone/64 Future Features
• Thread-safe C-interface (GCI layer)
• Support for Seaside
ØNeed native
inuations

---

## Page 45

Copyright © 2006, GemStone Systems Inc. All Rights Reserved.
45
Questions?
