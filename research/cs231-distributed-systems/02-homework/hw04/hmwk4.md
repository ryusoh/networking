# hmwk4

---

## Page 1

Zhuang Liu
SID: 25727277
CS 230 Distributed Computer Systems
Homework 4
1
Why the Schedule is Legal
At ﬁrst, we should ﬁgure out what is a legal schedule. From the course slide, we
can see that a legal scheduling strategy will always choose any trailing VP before
any non-trailing VP.
Then, we can write down all the allocation functions of all processors:
A(J1) = (2, 0, 1, 1, 0)
A(J2) = (0, 1, 0, 0, 2)
A(J3) = (1, 1, 0, 1, 1)
A(J4) = (0, 1, 0, 0, 0)
A(J5) = (1, 1, 2, 1, 2)
A(J6) = (1, 0, 0, 0, 1)
Based on the initial allocation, we can propose a time schedule as follows:
Time/PE
pi1
pi2
pi3
pi4
pi5
1
1
2
1
1
2
2
1
3
5
3
2
3
3
4
5
5
3
4
5
5
5
5
6
5
6
6
It is very obvious that this schedule is legal, because it is the simplest one which
shares the same matrix topology with the allocation matrix. All temporarily neigh-
boring VPs inside the processor are adjacent spatially. So all VP of the processor
is ahead of any other VP of the same processor by more than one global commu-
nication step. And trailing VPs are ahead of non-trailing VPs.
As we can infer from the number of time slices, there are 6 cycles in its period.
The idling ratio of this schedule is 9 / 30 = 30%.

---

## Page 2

2
New Schedule
At this stage, we can modify the previous schedule. As we can see, processor pi3
and p4 still get a full time window within the period whose length is equal to its
cycle.
So we can simply dub pi3 and pi4 to reduce idling rate. The scheduling matrix
is as follows:
Time/PE
pi1
pi2
pi3
pi4
pi5
1
1
2
1
1
2
2
1
3
5
3
2
3
3
4
5
5
3
4
5
5
1
1
5
5
6
5
3
5
6
5
5
6
In this schedule, we can calculate that the idling rate is 3 / 30 = 10%.
3
Optimal Schedule
I think there is a best schedule. It is modiﬁed on the schedule in section 2. We can
dub the table to see it more clearly:
Time/PE
pi1
pi2
pi3
pi4
pi5
1
1
2
1
1
2
2
1
3
5
3
2
3
3
4
5
5
3
4
5
5
1
1
5
5
6
4
5
3
5
6
3
5
5
6
7
1
2
1
1
2
8
1
3
5
3
2
9
3
4
5
5
3
10
5
5
1
1
5
11
6
4
5
3
5
12
3
5
5
6
We can see that it’s legal because in pi2, 4 is adjacent to 5, 3 is adjacent to 4 and
2.
And the idling rate is 1 / 30 = 1/30.
