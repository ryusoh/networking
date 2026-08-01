# hmwk6

---

## Page 1

Zhuang Liu
SID: 25727277
CS 230 Distributed Computer Systems
Homework 6
1
Primary Spatial Schedule
At ﬁrst, we can propose a 0% idling ratio spacial schedule as follows:
6
6
6
6
6
5
5
2
5
5
5
5
2
5
5
1
1
2
1
1
3
3
4
3
3
π1
π2
π3
π4
π5
2
New Spatial Schedule
If the processor 3 has broken, we can propose a brand new spatial schedule with
0% idling ratio as follows:
1
1
1
1
3
3
3
3
5
5
5
5
5
5
5
6
2
2
2
6
4
4
4
4
π1
π2
π3
π4
π5
If the new schedule is based on the original one, by re-assigning the VPs of the
processor 3, it would be as follows:
6
6
6
6
5
5
5
5
5
5
5
5
1
1
1
1
3
3
3
3
2
2
2
4
π1
π2
π3
π4
π5

---

## Page 2

3
Migrating Cost
By counting the diﬀerent VPs of each two new schedules with the original schedule
except the defunct processor, we can see that the diﬀerent between the ﬁrst new
schedule and the original schedule is 20 VPs.
By the mean time, the diﬀerent between the second new schedule and the
original schedule is 4 VPs. We can conclude that the migrating cost in the second
option is much lower than the ﬁrst one.
