# cs234-15 - Part 03 (Pages 41-59)

---

## Page 41

System Architecture
API:

1. Register()/Unregister()
2. Feedback()
Request Manager
1. Manages a Request Queue
2. Preprocess the requests
Context Analyzer
1. Context Updater
2. Model Trainer
Resource Manager
1. Battery Monitor
2. Scheduling Algorithm
System Model
Combination/Accuracy/Energy
41
Infer Algo
Sensory Data
Context
41

---

## Page 42

System Models
´ Combination model
´ The sensor combination of each inference algorithm
´ Accuracy model
´ The precision (accuracy) of each inference algorithm
´ Energy model
´ The energy consumption of each sensor
´ Example:
´ InMeeting { <Acc. Mic. Wifi.> <  80% > <265mW> }
42
42

---

## Page 43

System Architecture
API:

1. Register()/Unregister()
2. Feedback()
Request Manager
1. Manages a Request Queue
2. Preprocess the requests
Context Analyzer
1. Context Updater
2. Model Trainer
Resource Manager
1. Battery Monitor
2. Scheduling Algorithm
System Model
Combination/Accuracy/Energy
*Coordinated and efficient sensor usage !
*Avoid redundant energy waste !
43
Infer
Algo
Sensory
Data
Context
43

---

## Page 44

Scheduling Problem: Two
Criteria
´Energy Minimization (EM):
Minimize the energy consumption
Satisfy all the apps’ requirements
´Accuracy Maximization (AM):
Maximize the overall accuracy
within an energy budget
44
44

---

## Page 45

Problem Formulation
´Decision variable:  !" ∈{ 0, 1}
!" indicates whether the sensor ) should be activated
´Energy Minimization :
Minimize energy
Satisfy all requirements
45
45

---

## Page 46

Problem Formulation
´Decision variable:  !" ∈{ 0, 1}
!" indicates whether the sensor s should be activated
´Accuracy Maximization :
Energy budget
Maximize accuracy
46
46

---

## Page 47

Proposed Scheduling
Algorithms
´ Optimal algorithms :
´ The formulations are “Integer Programming
Problem”
´ We use a commercial optimization solver
´ Energy Minimization Algorithm (EMA)
Accuracy Maximization Algorithm (AMA)
´ + Good performance
´ - Only for small problems
´ Heuristic algorithms :
´ Efficient Energy Minimization Algorithm (EEMA)
Efficient Accuracy Maximization Algorithm (EAMA)
´ + Shorter running time
´ - Suitable for smartphones
47

---

## Page 48

Efficient Energy Minimization
Algorithm (EEMA)
´ EEMA is inspired by the Set Cover Problem
´ Define an utility function, and turn on the sensors that satisfy
more requests with less energy cost
Choose the most efficiency combination
Calculate and Update the gc
48
48

---

## Page 49

Efficient Accuracy Maximization
Algorithm (EAMA)
´ EAMA is inspired by the 0/1 knapsack Problem
´ Define an utility function, and turn on the sensors that
achieve higher accuracy with less energy cost
Choose the most efficiency combination
Calculate and Update the !"#
Check the energy budget
49

---

## Page 50

Heterogeneous Frequencies and
Sampling Rates
´ Extend the EEMA and the EAMA with
heterogeneous frequencies/sampling rates as
EEMA*and EAMA*
´ Ex: a context requires 70 % accuracy, and the
accuracy which decreases 10% per minute
0          1
2            3           4          5
Time (m)
70%
60%
80%
70%
*Efficiently cache  the
sensory data !
*Reduce energy
consumption !
50

---

## Page 51

Simulations
´Developed an event-driven simulator in Java
´Baseline algorithm :
´ Selects sensors with the highest accuracy for each
context
´Compare scheduling algorithms :
´Optimal : EMA / AMA
´Efficient : EEMA / EAMA
´With frequencies/sampling rates : EEMA*
/ EAMA*
´Baseline
51
51

---

## Page 52

Data Collection
´ Collect active apps in the Android activity
stack from 5 users in three weeks
´ Collect inference algorithms (from literature)
´ Create the energy model
*Use Agilent 66321D
battery emulator on a
Galaxy Nexus phone
52
52

---

## Page 53

Parameters
´Set a fixed scheduling time T = 5min
´Set E as the Energy budget in a
scheduling time
´E= {45, 52.5, 60, 67.5, 75}J
53
53

---

## Page 54

Energy Saving in EM
´The average energy consumption with 5
users in 21 days

* Saves at least 30%
* EEMA achieves a small
gap with EMA
* EMA terminates in 50ms and EEMA terminates in 1ms
54
54

---

## Page 55

Improvement of Accuracy with
Energy Minimization Crietrion
´The accuracy with 5 users in 21 days

* EEMA achieves at least
30% higher accuracy
* EEMA achieves a small
gap with EMA
55
55

---

## Page 56

Accuracy Improvement with
Accuracy Maximization Criterion
´The average accuracy with 5 users in 21
days

* Accuracy is 72.38%
higher than the baseline
* EAMA achieves a
~0.1% gap with AMA
* AMA terminates in 5 s and EAMA terminates in 1ms
56
56

---

## Page 57

Energy Saving with
Heterogeneous
Frequencies/Sampling Rates

* EEMA saves 64.58%
EEMA* saves 84.66%
* EAMA saves 33.68%
EAMA* saves 80.48%
* Higher performance in EAMA*
=> high precision which is achieved by EAMA
57
57

---

## Page 58

Implementations on Android

* EAMA:
Prolongs battery life 1.5 times
Achieves accuracy : 94.85%
* EEMA :
Prolongs battery life two times
Achieves accuracy : 93.94%
* Execution times :
EEMA and EAMA at most 306 ms and 503 ms
58
58

---

## Page 59

59
Questions
<chsu@cs.nthu.edu.tw>
