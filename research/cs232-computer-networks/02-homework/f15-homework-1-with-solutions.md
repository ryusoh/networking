# f15-homework-1-with-solutions

---

## Page 1

Homework 1 with Solutions – Fall 2015

Equation 1.1 says

The packets are transmitted back-to-back, and that all links have the same transmission rate 𝑅. The first
packet arrives after 𝑁𝐿𝑅
⁄ , and it takes (𝑃−1) ⋅𝐿𝑅
⁄ more time to transmit the rest of them. Therefore
the answer is
𝑑= (𝑁+ 𝑃−1) ⋅𝐿
𝑅

(a) 𝑑prop = 𝑚𝑠
⁄
(b) 𝑑trans = 𝐿𝑅
⁄
(c) 𝑑end−end = 𝑚𝑠
⁄ + 𝐿𝑅
⁄
(d) Just left Host A.

---

## Page 2

(e) On the link.
(f) At Host B.
(g) 𝑑prop = 𝑚𝑠
⁄ = 𝑑trans = 𝐿𝑅
⁄
𝑚= 𝑠⋅𝐿𝑅
⁄
= 2.5 × 108 ⋅120 56 × 103
⁄
≈536 × 103𝑚= 536𝑘𝑚

𝑑end−end = 𝐿
𝑅1

+ 𝑑1
𝑠1
+ 𝑑proc + 𝐿
𝑅2
+ 𝑑2
𝑠2
+ 𝑑proc + 𝐿
𝑅3
+ 𝑑3
𝑠3

𝑑end−end = 3 ⋅1500 × 8
2 × 106 + (5000 + 4000 + 1000) × 103
2.5 × 108

+ 2 × 0.003 = 0.064𝑠= 64𝑚𝑠

𝑑queue = 1500 × 8
2 × 106 ⋅(1
2 + 4) = 0.027𝑠= 27𝑚𝑠
𝑑queue = 𝑛⋅𝐿+ (𝐿−𝑥)
𝑅

(a)
𝑑̅ = 1
𝑁⋅[1 + 2 + ⋯+ (𝑁−1)] ⋅𝐿
𝑅= 1
𝑁⋅𝑁⋅(𝑁−1)
2
⋅𝐿
𝑅= (𝑁−1) ⋅𝐿
2𝑅

(b) Same. It takes 𝑁⋅𝐿𝑅
⁄ to transmit a batch of packets, so the average queuing delay is the same
for all batches.

---

## Page 3

(a) 4 sec
(b) 5.5 sec
(c) 10.5 sec

(a) According to the memoryless property of exponential distribution

The answer is 𝑃= 𝑒−𝜆𝑠
(b) The length is larger than 𝑅⋅𝜏 if the transmission time is larger than 𝜏. Hence, the probability is
𝑃= 𝑒−𝑅⋅𝜏𝐿
⁄
(c) The expected transmission time for one packet is 𝐿𝑅
⁄ . Hence the answer is
𝐿
𝑅(𝑁+ 1)

---

## Page 4

(a)
𝜆1
𝜆1 + 𝜆2

(b)
1
𝜆1 + 𝜆2

Case
Probability
(c)
(d)
(e)
A leaves first
𝜇
𝜆1 + 𝜆2 + 𝜇
1
1
 𝜇
1
𝜇+
1
𝜆1 + 𝜆2

+ 1
𝜇
B arrives first
𝜆1 + 𝜆2
𝜆1 + 𝜆2 + 𝜇
2
2
 𝜇
2
 𝜇
Sum
𝟏

(c)
𝜇
𝜆1 + 𝜆2 + 𝜇⋅1 +
𝜆1 + 𝜆2
𝜆1 + 𝜆2 + 𝜇⋅2 = 2 ⋅(𝜆1 + 𝜆2) + 𝜇
𝜆1 + 𝜆2 + 𝜇

(d)
𝜇
𝜆1 + 𝜆2 + 𝜇⋅1
𝜇+
𝜆1 + 𝜆2
𝜆1 + 𝜆2 + 𝜇⋅2
𝜇
(e)
𝜇
𝜆1 + 𝜆2 + 𝜇⋅(1
𝜇+
1
𝜆1 + 𝜆2

+ 1
𝜇) +
𝜆1 + 𝜆2
𝜆1 + 𝜆2 + 𝜇⋅2
𝜇
Solution 2 of this part is
1
𝜆1 + 𝜆2
+

𝜇
𝜆1 + 𝜆2 + 𝜇⋅1
𝜇+
𝜆1 + 𝜆2
𝜆1 + 𝜆2 + 𝜇⋅2
𝜇
Where the first term is the time it takes before packet B arrives. Since then, if A leaves first, then after B
comes, it takes 1 𝜇
⁄ to transmit B. Otherwise, i.e. if B arrives first, then after B arrives, it takes 1 𝜇
⁄ to
transmit A, then another 1 𝜇
⁄ to transmit B, which in total is 2 𝜇
⁄ .
Solution 3 of this part is
1
𝜆1 + 𝜆2 + 𝜇+
𝜇
𝜆1 + 𝜆2 + 𝜇⋅(
1
𝜆1 + 𝜆2

+ 1
𝜇) +
𝜆1 + 𝜆2
𝜆1 + 𝜆2 + 𝜇⋅2
𝜇
Where the first term is the time it takes before the first event occurs, which could be A’s transmission or
B’s arrival. If the first event is A’s transmission, then it takes time to wait for B to come and then
transmit it. If the first event is B’s arrival, then it takes time to transmit both packets.
