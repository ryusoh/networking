# cs234-16 - Part 01 (Pages 1-10)

---

## Page 1

CompSci 234/NetSys 210
Advanced Topics in Networking
Winter 2019
Unit 16: Quantum Internet
Cheng-Hsin Hsu (<chsu@cs.nthu.edu.tw>)
slides adopted from IRTF QIRG Bangkok Meeting, Nov. 2018
1

---

## Page 2

Quantum Bits
´ Quantum mechanics: there exist superpositions
of 0 and 1 states.
´ Mathematically, the state of a quantum
bit (qubit) is described by:
´
´ where      and     are complex number, and
´ Measuring the above state gives
with prob.
and        with prob.
´ Then the qubit gets into the
measured state
2
Note:        is called Dirac notation, but
it’s nothing but a column vector

---

## Page 3

Vision of Quantum Internet
´ Enabling quantum communications
among (quantum) computers anywhere
on earth.
3

---

## Page 4

Why Construct a Quantum
Internet?
4
For quantum communications
•
Quantum secure communications
•
Secure Identification
•
Clock synchronization
•
Protocols for distributed systems
•
Combining telescopes
•
Testing Physics
•
Exponential savings incommunications
•
….
For quantum computations
•
Linking small quantum computers
•
Access the quantum “mainframe”

---

## Page 5

Entanglement
´ Properties of entanglement:
´ Complete coordination: Measurement outcomes
are random but  perfectly correlated.
´ Inherently private: No one can have any share of
the  entanglement.
5

---

## Page 6

Quantum Repeater
´ Entanglements can only be created in short distance
à need teleportation or entanglement swapping
6

---

## Page 7

Quantum Internet (with
Classical Internet)
7
Quantum node
Quantum link
Classical node
Classical link
Classical networkparallels the quantum network
Classical nodes initiate quantum operations on the
quantum nodes

---

## Page 8

Key Objective of Quantum
Internet
8
A
B
Quantum End Nodes
running quantum
application (e.g., QKD)
Want entanglement here!
What you get
Very challenging, because qubits are fragile
Classic routing problems arise here, but with different utility function

---

## Page 9

Layering Structure (Delft
Version)
9
Quantum DeviceLayer
Quantum ApplicationProtocols
“Alice sends n qubits to Bob, andthen…”
Entanglement generation services across diff. networks
Entanglement generation services on a network,
connected by alink
(Near) deterministic end-to-end qubitdelivery

---

## Page 10

Six Stages Proposed in [WKH’08]
10
