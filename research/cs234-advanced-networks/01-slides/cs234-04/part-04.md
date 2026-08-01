# cs234-04 - Part 04 (Pages 31-38)

---

## Page 31

VL2 Topology Design: Scale-out
vs. Scale-up
´ Exploit the gap in switch-to-switch capacity vs.
switch-to-server capacities
´ current: 10Gbps vs. 1Gbps; future: 40 Gpbs vs. 10
Gbps
´ A scale-out design with broad layers
´ E.g.,  a 3-level Clos topology with full-mesh in top-2
levels
´ ToR switches, aggregation switches & intermediate
switches
´ less wiring complexity, and more path diversity
´ Same bisection capacity at each layer à no
oversubscription
´ Extensive path diversity à graceful degradation
under failure
32

---

## Page 32

Sample VL2 Topology
33
10G
D/2  ports
D/2 ports
Aggregation
switches
. . .
. . .
D switches
D/2 switches
Intermediate
node switches
in VLB
D ports
Top Of Rack switch
[D2/4] * 20 Servers
20
ports
Node degree (D) of
available switches &

## servers supported

D

## Servers in pool

4
80
24
2,880
48
11,520
144
103,680
33

---

## Page 33

Addressing and Routing in
VL2
´ Allows to use low-cost switches
´ Protects network and hosts from host-state churn
´ Obviates host and switch reconfiguration
34
payload
ToR3
. . .
. . .
y
x
Servers use flat names
Switches run link-state routing and
maintain only switch-level topology
y
z
payload
ToR4
z
ToR2
ToR4
ToR1
ToR3
y, z
payload
ToR3
z
. . .
Directory
Service
…
x à ToR2
y à ToR3
z à ToR4
…
Lookup &
Response
…
x à ToR2
y à ToR3
z à ToR3
…

---

## Page 34

Traffic Matrix Measurements:
No Predictivity!
´ Collapse similar traffic matrices (over 100sec) into
“clusters”
´ Need 50-60 clusters to cover a day’s traffic
´ Run length is 100s to 80% percentile; 99th is 800s
´ Traffic pattern changes nearly constantly
35

---

## Page 35

Randomization to Rescue
´ Valiant Load Balancing
´ Every flow bounced off a random intermediate switch
´ Provably hotspot free for any admissible traffic matrix
36
Node degree (D) of
available switches &

## servers supported

D

## Servers in pool

4
80
24
2,880
48
11,520
144
103,680
10G
D/2  ports
D/2 ports
. . .
. . .
D switches
D/2 switches
Intermediate
node switches
in VLB
D ports
Top Of Rack switch
[D2/4] * 20 Servers
20 ports
Aggregation
switches

---

## Page 36

VL2 Achieves Agility at Scale
Via….
37

1. L2 semantics
2. Uniform high
capacity
3. Performance
isolation
A
A
A …
A
A
A …
A
A
A …
A
A
A …
A
A
A
A
A
A
A
A
A
A
A
A
A
A
A
A
A
A
A
A
A
A
A
A
A

---

## Page 37

Take-Away Message
´Main Question for Data Center
Networks:
´What are the unique/new networking
issues posed by large-scale data centers?
´We have seen
´Network Architecture?
´Topology design?
´Addressing?
´Routing?
´Forwarding?
´Anything else?
38

---

## Page 38

39
Questions
<chsu@cs.nthu.edu.tw>
