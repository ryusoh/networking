# cs234-14 - Part 03 (Pages 21-30)

---

## Page 21

Real-Time Systems
´ “In real-time computing the correctness of the system
depends not only on the logical results of the computation
but also on the time at which the results are produced” [J.
Stankovic]
´ Many real-time systems are control systems
´ A “thing” can be modelled as a real-time system
´ A multi-domain IoT application (e.g. smart city) is often a
distributed real-time system
´ Classification: hard/soft time constraints
´ Workload characteristics: periodic/aperiodic tasks
´ Scheduling:
´ Preemptive and Non-preemptive
´ Static and Dynamic
´ Online and Offline
´ Optimal and Heuristic
21

---

## Page 22

Agenda
´Internet-of-Things (IoT)
´IoT Versus Cyber-Physical
Systems (CPS)
´IoT Data Processing
´IoT Analytics
22

---

## Page 23

IoT Networks
23
Sink
node
Gateway
Core network
e.g. Internet
Gateway
End-user
Computer services
Operating
Systems?
Services?
Protocols?
Protocols?
In-node
Data
Processing
Data
Aggregation
/ Fusion
Inference/
Processing
of IoT data

---

## Page 24

Characteristics of IoT
Devices
´ Often inexpensive sensors (actuators) equipped
with a radio transceiver for various applications,
typically low data rate ~ 10-250 kbps (but not
always).
´ Deployed in large numbers
´ The sensors should coordinate to perform the
desired task.
´ The acquired information (periodic or event-
based) is reported back to the information
processing center (or some cases in-network
processing is required)
24

---

## Page 25

In-Network Processing
´ Mobile Ad-hoc Networks can be seen as a set of
nodes that deliver bits from one end to the other;
´ WSNs, on the other end, are expected to provide
information, not necessarily original bits
´ manipulate or process the data in the network
´ Main example: aggregation
´ Applying aggregation functions to a obtain an average
value of measurement data
´ Typical functions: minimum, maximum, average, sum, …
´ More sophisticated processing of data can take
place within the network or at the edge
´ Exploit temporal and spatial correlation
25

---

## Page 26

Example of Data
Aggregation
26
1
1
3
1
1
6
1
1
1
1
1
1

---

## Page 27

Performance Metrics for
Aggregation
´ Accuracy: difference between the resulting value or representation
and the original data
´ Lossless versus lossy
´ Coverage: the percentage of all the data items that are included in
the computation of the aggregated data.
´ Latency: delay time to compute and report the aggregated data
´ Computation foot-print; complexity;
´ Overhead: the main advantage of the aggregation is reducing the
size of the data representation;
´ Aggregation functions can trade-off between accuracy, latency and
overhead;
´ Aggregation should happen close to the source.
27

---

## Page 28

Data Exchanges
28
´ Achieved by publish/subscribe paradigm
´ Idea: Entities can publish data under certain names
´ Entities can subscribe to updates of such named data
´ Conceptually: Implemented by a software bus
´ Software bus stores subscriptions, published data; names used as filters;
subscribers notified when values of named data changes
Software bus
Publisher 1
Publisher 2
Subscriber 1
Subscriber 2
Subscriber 3

---

## Page 29

MQTT Pub-Sub Protocol
´ MQTT is designed to be open, simple, lightweight and
easy to implement.
´ A small transport overhead (the fixed-length header is
just 2 bytes)
´ It supports publish/subscribe message pattern to
provide one-to-many message distribution and
decoupling of applications
´ The use of TCP/IP to provide basic network
connectivity
´ Three qualities of service for message delivery:
´ "At most once”
´ “At least once”
´ “Exactly once”
29

---

## Page 30

Time-Series Sensor Data
´ The sensor data (or IoT data in general)
can be seen as time-series data.
´ A sensor stream refers to a source that
provide sensor data over time.
´ The data can be sampled/collected at a
rate (can be also variable) and is sent as a
series of values.
´ Over time, there will be a large number of
data items collected.
´ Using time-series processing techniques
can help to reduce the size of the data
that is communicated
30
