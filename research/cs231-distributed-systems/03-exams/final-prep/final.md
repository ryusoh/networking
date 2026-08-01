# final

---

## Page 1

CS 230 – Distributed Computer Systems

          February, 2017
Professor: Isaac D. Scherson

Take-Home Examination
(Due 02/20 11:59PM)

This is a take home examination based on the honor system. We trust that you will submit your
work and not that of your peers. You are welcome to discuss issues with your fellow students in
the class, or anybody else for that matter. However, we expect you to write your own paper,
abstaining yourself from copying from your colleagues and/or copying and pasting from the
Internet. Thanks.

1) (20 points) (Research/Essay-like question)
a) Give a definition of Distributed Computing System. (Hint: there is a good one in
Tannenbaum’s book).
b) Discuss the general structure/architecture of such a system and discuss its different
components (hardware, interconnection network, system’s software, etc.).
c) Explain the differences between tightly and loosely coupled Distributed Computer
Systems. Can you relate the distinctions to the OSI Layered Model of Communication?
d) Discuss the application domain of Distributed Computer Systems.

2) (20 points) (Algorithm Mapping)
Given the Fast Fourier Transformation (FFT) of a linear vector array, the 2D FFT can be
computed using the 1D FFD by FFTing rows and then FFTing columns of the 2D array.
a) Propose a method to compute the 3D FFT based on 1D and/or 2D FFTs.
b) Suppose the 3D FFT is to be programmed on a cross-bar interconnected cluster.
Suggest an implementation of this 3D FFT and discuss its performance. (Identify
possible bottlenecks and propose solutions).

3) (20 points) (Data Allocation, Data access in distributed data bases)
Consider a distributed data base where many computer resources are used to increase
storage capacity.
a) What are the differences, if any, between a Networked File System (NTFS) and a
Distributed Shared Memory System?
b) Access to records, measured in network delays, will depend on where the data is stored
with respect to the requesting device. Discuss dynamic storage strategies for the on-line
optimization of data-base-like operations on a geographically distributed data base.
Relate your answer to topology as well as latency and bandwidth parameters of the
network.

---

## Page 2

4) (20 points) (Research/System’s resource management)
Find and choose two currently available Distributed Operating Systems.
a) Using the scheduling models given in class, explain how each of the chosen Distributed
Operating Systems effects the scheduling of concurrent computations.
b) If these OSs implement Load Balancing, explain how they do it. Otherwise, suggest a
method to incorporate Load Balancing in each.

5) (20 points)
Consider the fault tolerance problem.
a) What is ABFT? Is there a systematic way of converting a concurrent computation into a
ABFT one based on the algorithm itself? Can you suggest such a systematic (or a
different one) approach?
b) What types of faults can be tolerated using:
-
leader election
-
consensus
-
solution(s) to the Byzantine Generals Problem
