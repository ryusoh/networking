# exponential-poisson

---

## Page 1

21
The Exponential Distribution
From Discrete-Time to Continuous-Time:
In Chapter 6 of the text we will be considering Markov processes in con-
tinuous time. In a sense, we already have a very good understanding of
continuous-time Markov chains based on our theory for discrete-time
Markov chains. For example, one way to describe a continuous-time
Markov chain is to say that it is a discrete-time Markov chain, except
that we explicitly model the times between transitions with contin-
uous, positive-valued random variables and we explicity consider the
process at any time t, not just at transition times.
The single most important continuous distribution for building and
understanding continuous-time Markov chains is the exponential dis-
tribution, for reasons which we shall explore in this lecture.
177

---

## Page 2

178
21. THE EXPONENTIAL DISTRIBUTION
The Exponential Distribution:
A continuous random variable X is said to have an Exponential(λ)
distribution if it has probability density function
fX(x|λ) =
 λe−λx for x > 0
0
for x ≤0 ,
where λ > 0 is called the rate of the distribution.
In the study of continuous-time stochastic processes, the exponential
distribution is usually used to model the time until something hap-
pens in the process. The mean of the Exponential(λ) distribution is
calculated using integration by parts as
E[X] =
Z ∞
0
xλe−λxdx
= λ
−xe−λx
λ

∞
0

+ 1
λ
Z ∞
0
e−λxdx

= λ

0 + 1
λ
−e−λx
λ

∞
0

= λ 1
λ2 = 1
λ.
So one can see that as λ gets larger, the thing in the process we’re
waiting for to happen tends to happen more quickly, hence we think
of λ as a rate.
As an exercise, you may wish to verify that by applying integration by
parts twice, the second moment of the Exponential(λ) distribution is
given by
E[X2] =
Z ∞
0
x2λe−λx = . . . = 2
λ2.

---

## Page 3

179
From the ﬁrst and second moments we can compute the variance as
Var(X) = E[X2] −E[X]2 = 2
λ2 −1
λ2 = 1
λ2.
The Memoryless Property:
The following plot illustrates a key property of the exponential distri-
bution. The graph after the point s is an exact copy of the original
function. The important consequence of this is that the distribution
of X conditioned on {X > s} is again exponential.
The Exponential Function
x
exp( - x)
0.0
0.5
1.0
1.5
2.0
0.2
0.4
0.6
0.8
1.0
s
Figure 21.1: The Exponential Function e−x

---

## Page 4

180
21. THE EXPONENTIAL DISTRIBUTION
To see how this works, imagine that at time 0 we start an alarm clock
which will ring after a time X that is exponentially distributed with
rate λ. Let us call X the lifetime of the clock. For any t > 0, we
have that
P(X > t) =
Z ∞
t
λe−λxdx = λ −e−λx
λ

∞
t
= e−λt.
Now we go away and come back at time s to discover that the alarm
has not yet gone oﬀ. That is, we have observed the event {X > s}.
If we let Y denote the remaining lifetime of the clock given that
{X > s}, then
P(Y > t|X > s) = P(X > s + t|X > s)
= P(X > s + t, X > s)
P(X > s)
= P(X > s + t)
P(X > s)
= e−λ(s+t)
e−λs
= e−λt.
But this implies that the remaining lifetime after we observe the alarm
has not yet gone oﬀat time s has the same distribution as the original
lifetime X. The really important thing to note, though, is that this
implies that the distribution of the remaining lifetime does not depend
on s.
In fact, if you try setting X to have any other continuous
distribution, then ask what would be the distribution of the remaining
lifetime after you observe {X > s}, the distribution will depend on s.

---

## Page 5

181
This property is called the memoryless property of the exponential
distribution because I don’t need to remember when I started the
clock. If the distribution of the lifetime X is Exponential(λ), then if
I come back to the clock at any time and observe that the clock has
not yet gone oﬀ, regardless of when the clock started I can assert that
the distribution of the time till it goes oﬀ, starting at the time I start
observing it again, is Exponential(λ). Put another way, given that the
clock has currently not yet gone oﬀ, I can forget the past and still
know the distribution of the time from my current time to the time
the alarm will go oﬀ. The resemblance of this property to the Markov
property should not be lost on you.
It is a rather amazing, and perhaps unfortunate, fact that the exponen-
tial distribution is the only one for which this works. The memoryless
property is like enabling technology for the construction of continuous-
time Markov chains. We will see this more clearly in Chapter 6. But
the exponential distribution is even more special than just the memo-
ryless property because it has a second enabling type of property.
Another Important Property of the Exponential:
Let X1, . . . , Xn be independent random variables, with Xi having an
Exponential(λi) distribution. Then the distribution of min(X1, . . . , Xn)
is Exponential(λ1 + . . . + λn), and the probability that the minimum
is Xi is λi/(λ1 + . . . + λn).
Proof:
P(min(X1, . . . , Xn) > t) = P(X1 > t, . . . , Xn > t)
= P(X1 > t) . . . P(Xn > t)
= e−λ1t . . . e−λnt
= e−(λ1+...+λn)t.

---

## Page 6

182
21. THE EXPONENTIAL DISTRIBUTION
The preceding shows that the CDF of min(X1, . . . , Xn) is that of an
Exponential(λ1 +. . .+λn) distribution. The probability that Xi is the
minimum can be obtained by conditioning:
P (Xi is the minimum)
= P(Xi < Xj for j̸ = i)
=

Z ∞
0
P(Xi < Xj for j̸ = i|Xi = t)λie−λitdt
=

Z ∞
0
P(t < Xj for j̸ = i)λie−λitdt
=

Z ∞
0
λie−λit Y
j̸=i
P(Xj > t)dt
=

Z ∞
0
λie−λit Y
j̸=i
e−λjtdt
= λi
Z ∞
0
e−(λ1+...+λn)tdt
= λi
−e−(λ1+...+λn)t
λ1 + . . . + λn

∞
0
=

λi
λ1 + . . . + λn
,
as required.
□
To see how this works together with the the memoryless property,
consider the following examples.

---

## Page 7

183
Example: (Ross, p.332 #20).
Consider a two-server system in
which a customer is served ﬁrst by server 1, then by server 2, and
then departs. The service times at server i are exponential random
variables with rates µi, i = 1, 2. When you arrive, you ﬁnd server
1 free and two customers at server 2 — customer A in service and
customer B waiting in line.
(a) Find PA, the probability that A is still in service when you move
over to server 2.
(b) Find PB, the probability that B is still in the system when you
move over to 2.
(c) Find E[T], where T is the time that you spend in the system.
Solution:
(a) A will still be in service when you move to server 2 if your service at
server 1 ends before A’s remaining service at server 2 ends. Now
A is currently in service at server 2 when you arrive, but because
of memorylessness, A’s remaining service is Exponential(µ2), and
you start service at server 1 that is Exponential(µ1). Therefore,
PA is the probability that an Exponential(µ1) random variable is
less than an Exponential(µ2) random variable, which is
PA =
µ1
µ1 + µ2
.
(b) B will still be in the system when you move over to server 2 if
your service time is less than the sum of A’s remaining service
time and B’s service time. Let us condition on the ﬁrst thing to
happen, either A ﬁnishes service or you ﬁnish service:

---

## Page 8

184
21. THE EXPONENTIAL DISTRIBUTION
P(B in system) = P(B in system|A ﬁnishes before you)
µ2
µ1 + µ2

+ P(B in system|you ﬁnish before A)
µ1
µ1 + µ2
Now P(B in system|you ﬁnish before A) = 1 since B will still be
waiting in line when you move to server 2. On the other hand,
if the ﬁrst thing to happen is that A ﬁnishes service, then at
that point, by memorylessness, your remaining service at server
1 is Exponential(µ1), and B will still be in the system if your
remaining service at server 1 is less than B’s service at server 2,
and the probability of this is µ1/(µ1 + µ2). That is,
P(B in system|A ﬁnishes before you) =
µ1
µ1 + µ2
.
Therefore,
P(B in system) =
µ1µ2
(µ1 + µ2)2 +
µ1
µ1 + µ2
.
(c) To compute the expected time you are in the system, we ﬁrst
divide up your time in the system into
T = T1 + R,
where T1 is the time until the ﬁrst thing that happens, and R
is the rest of the time. The time until the ﬁrst thing happens is
Exponential(µ1 + µ2), so that
E[T1] =
1
µ1 + µ2
.
To compute E[R], we condition on what was the ﬁrst thing to
happen, either A ﬁnished service at server 2 or you ﬁnished service

---

## Page 9

185
at server 1. If the ﬁrst thing to happen was that you ﬁnished
service at server 1, which occurs with probability µ1/(µ1 + µ2),
then at that point you moved to server 2, and your remaining
time in the system is the remaining time of A at server 2, the
service time of B at server 2, and your service time at server
2. A’s remaining time at server 2 is again Exponential(µ2) by
memorylessness, and so your expected remaining time in service
will be 3/µ2. That is,
E[R|ﬁrst thing to happen is you ﬁnish service at server 1] = 3
µ2
,
and so
E[R] =
3
µ2
µ1
µ1 + µ2

+ E[R|ﬁrst thing is A ﬁnishes]
µ2
µ1 + µ2
.
Now if the ﬁrst thing to happen is that A ﬁnishes service at server
2, we can again compute your expected remaining time in the
system as the expected time until the next thing to happen (either
you or B ﬁnishes service) plus the expected remaining time after
that. To compute the latter we can again condition on what was
that next thing to happen. We will obtain
E[R|ﬁrst thing is A ﬁnishes] =
1
µ1 + µ2
+ 2
µ2
µ1
µ1 + µ2
+

 1
µ1

+ 1
µ2

µ2
µ1 + µ2
Plugging everything back gives E[T].
□
As an exercise you should consider how you might do the preceding
problem assuming a diﬀerent service time distribution, such as a Uni-
form distribution on [0, 1] or a deterministic service time such as 1
time unit.

---

## Page 10

186
21. THE EXPONENTIAL DISTRIBUTION

---

## Page 11

22
The Poisson Process: Introduction
We now begin studying our ﬁrst continuous-time process – the Poisson
Process. Its relative simplicity and signiﬁcant practical usefulness make
it a good introduction to more general continuous time processes. To-
day we will look at several equivalent deﬁnitions of the Poisson Process
that, each in their own way, give some insight into the structure and
properties of the Poisson process.
187

---

## Page 12

188
22. THE POISSON PROCESS: INTRODUCTION
Stationary and Independent Increments:
We ﬁrst deﬁne the notions of stationary increments and independent
increments. For a continuous-time stochastic process {X(t) : t ≥0},
an increment is the diﬀerence in the process at two times, say s and
t. For s < t, the increment from time s to time t is the diﬀerence
X(t) −X(s).
A process is said to have stationary increments if the distribution of
the increment X(t) −X(s) depends on s and t only through the
diﬀerence t −s, for all s < t. So the distribution of X(t1) −X(s1)
is the same as the distribution of X(t2) −X(s2) if t1 −s1 = t2 −s2.
Note that the intervals [s1, t1] and [s2, t2] may overlap.
A process is said to have independent increments if any two increments
involving disjoint intervals are independent. That is, if s1 < t1 < s2 <
t2, then the two increments X(t1) −X(s1) and X(t2) −X(s2) are
independent.
Not many processes we will encounter will have both stationary and
independent increments. In general they will have neither stationary
increments nor independent increments. An exception to this we have
already seen is the simple random walk. If ξ1, ξ2, . . . is a sequence of
independent and identically distributed random variables with P(ξi =

1) = p and P(ξi = −1) = q = 1 −p, the the simple random walk
{Xn : n ≥0} starting at 0 can be deﬁned as X0 = 0 and
Xn =
n
X
i=1
ξi.
From this representation it is not diﬃcult to see that the simple random
walk has stationary and independent increments.

---

## Page 13

189
Deﬁnition 1 of a Poisson Process:
A continuous-time stochastic process {N(t) : t ≥0} is a Poisson
process with rate λ > 0 if
(i) N(0) = 0.
(ii) It has stationary and independent increments.
(iii) The distribution of N(t) is Poisson with mean λt, i.e.,
P(N(t) = k) = (λt)k
k! e−λt
for k = 0, 1, 2, . . ..
This deﬁnition tells us some of the structure of a Poisson process
immediately:
• By stationary increments the distribution of N(t)−N(s), for s < t
is the same as the distribution of N(t −s) −N(0) = N(t −s),
which is a Poisson distribution with mean λ(t −s).
• The process is nondecreasing, for N(t)−N(s) ≥0 with probabil-
ity 1 for any s < t since N(t) −N(s) has a Poisson distribution.
• The state space of the process is clearly S = {0, 1, 2, . . .}.
We can think of the Poisson process as counting events as it progresses:
N(t) is the number of events that have occurred up to time t and at
time t + s, N(t + s) −N(t) more events will have been counted, with
N(t + s) −N(t) being Poisson distributed with mean λs.
For this reason the Poisson process is called a counting process. Count-
ing processes are a more general class of processes of which the Pois-
son process is a special case.
One common modeling use of the
Poisson process is to interpret N(t) as the number of arrivals of
tasks/jobs/customers to a system by time t.

---

## Page 14

190
22. THE POISSON PROCESS: INTRODUCTION
Note that N(t) →∞as t →∞, so that N(t) itself is by no means
stationary, even though it has stationary increments. Also note that, in
the customer arrival interpetation, as λ increases customers will tend
to arrive faster, giving one justiﬁcation for calling λ the rate of the
process.
We can see where this deﬁnition comes from, and in the process try to
see some more low level structure in a Poisson process, by considering
a discrete-time analogue of the Poisson process, called a Bernoulli
process, described as follows.
The Bernoulli Process: A Discrete-Time “Poisson Process”:
Suppose we divide up the positive half-line [0, ∞) into disjoint inter-
vals, each of length h, where h is small. Thus we have the intervals
[0, h), [h, 2h), [2h, 3h), and so on. Suppose further that each interval
corresponds to an independent Bernoulli trial, such that in each inter-
val, independently of every other interval, there is a successful event
(such as an arrival) with probability λh. Deﬁne the Bernoulli process
to be {B(t) : t = 0, h, 2h, 3h, . . .}, where B(t) is the number of
successful trials up to time t.
The above deﬁnition of the Bernoulli process clearly corresponds to
the notion of a process in which events occur randomly in time, with
an intensity, or rate, that increases as λ increases, so we can think of
the Poisson process in this way too, assuming the Bernoulli process
is a close approximation to the Poisson process. The way we have
deﬁned it, the Bernoulli process {B(t)} clearly has stationary and
independent increments.
As well, B(0) = 0.
Thus the Bernoulli
process is a discrete-time approximation to the Poisson process with
rate λ if the distribution of B(t) is approximately Poisson(λt).

---

## Page 15

191
For a given t of the form nh, we know the exact distribution of B(t).
Up to time t there are n independent trials, each with probability λh
of success, so B(t) has a Binomial distribution with parameters n and
λh. Therefore, the mean number of successes up to time t is nλh =
λt. So E[B(t)] is correct. The fact that the distribution of B(t) is
approximately Poisson(λt) follows from the Poisson approximation to
the Binomial distribution (p.32 of the text), which we can re-derive
here. We have, for k a nonnegative integer and t > 0, (and keeping
in mind that t = nh for some positive integer n),
P(B(t) = k) =
n
k

(λh)k(1 −λh)n−k
=

n!
(n −k)!k!
λt
n
k 
1 −λt
n
n−k
=

n!
(n −k)!nk

1 −λt
n
−k (λt)k
k!

1 −λt
n
n
≈
n!
(n −k)!nk

1 −λt
n
−k (λt)k
k! e−λt,
for n very large (or h very small). But also, for n large

1 −λt
n
−k
≈1
and
n!
(n −k)!nk = n(n −1) . . . (n −k + 1)
nk
≈1.
Therefore, P(B(t) = k) ≈(λt)k/k!e−λt (this approximation gets
exact as h →0).

---

## Page 16

192
22. THE POISSON PROCESS: INTRODUCTION
Thinking intuitively about how the Poisson process can be expected
to behave can be done by thinking about the conceptually simpler
Bernoulli process. For example, given that there are n events in the
interval [0, t) (i.e. N(t) = n), the times of those n events should
be uniformly distributed in the interval [0, t) because that is what we
would expect in the Bernoulli process. This intuition is true, and we’ll
prove it more carefully later.
Thinking in terms of the Bernoulli process also leads to a more low-
level (in some sense better) way to deﬁne the Poisson process. This
way of thinking about the Poisson process will also be useful later
when we consider continuous-time Markov chains. In the Bernoulli
process the probability of a success in any given interval is λh and the
probability of two or more successes is 0 (that is, P(B(h) = 1) = λh
and P(B(h) ≥2) = 0). Therefore, in the Poisson process we have
the approximation that P(N(h) = 1) ≈λh and P(N(h) ≥2) ≈0.
We write this approximation in a more precise way by saying that
P(N(n) = 1) = λh + o(h) and P(N(h) ≥2) = o(h).
The notation “o(h)” is called Landau’s o(h) notation, read “little o of
h”, and it means any function of h that is of smaller order than h. This
means that if f(h) is o(h) then f(h)/h →0 as h →0 (f(h) goes
to 0 faster that h goes to 0). Notationally, o(h) is a very clever and
useful quantity because it lets us avoid writing out long, complicated,
or simply unknown expressions when the only crucial property of the
expression that we care about is how fast it goes to 0. We will make
extensive use of this notation in this and the next chapter, so it is
worthwhile to pause and make sure you understand the properties of
o(h).

---

## Page 17

193
Landau’s “Little o of h” Notation:
Note that o(h) doesn’t refer to any speciﬁc function. It denotes any
quantity that goes to 0 at a faster rate than h, as h →0:
o(h)
h
→0 as h →0.
Since the sum of two such quantities retains this rate property, we get
the potentially disconcerting property that
o(h) + o(h) = o(h)
as well as
o(h)o(h) = o(h)
c × o(h) = o(h),
where c is any constant (note that c can be a function of other variables
as long as it remains constant as h varies).
Example: The function hk is o(h) for any k > 1 since
hk
h = hk−1 →0 as h →0.
h however is not o(h). The inﬁnite series P∞
k=2 ckhk, where |ck| < 1,
is o(h) since
lim
h→0
P∞
k=2 ckhk
h
= lim
h→0
∞
X
k=2
ckhk−1
=

∞
X
k=2
ck lim
h→0 hk−1 = 0,
where taking the limit inside the summation is justiﬁed because the
sum is bounded by 1/(1 −h) for h < 1.
□

---

## Page 18

194
22. THE POISSON PROCESS: INTRODUCTION
Deﬁnition 2 of a Poisson Process:
A continuous-time stochastic process {N(t) : t ≥0} is a Poisson
process with rate λ > 0 if
(i) N(0) = 0.
(ii) It has stationary and independent increments.
(iii) P(N(h) = 1) = λh + o(h),
P(N(h) ≥2) = o(h), and
P(N(h) = 0) = 1 −λh + o(h).
This deﬁnition can be more useful than Deﬁnition 1 because its con-
ditions are more “primitive” and correspond more directly with the
Bernoulli process, which is more intuitive to imagine as a process evolv-
ing in time.
We need to check that Deﬁnitions 1 and 2 are equivalent (that is,
they deﬁne the same process). We will show that Deﬁnition 1 implies
Deﬁnition 2. The proof that Deﬁnition 2 implies Deﬁnition 1 is shown
in the text in Theorem 5.1 on p.292 (p.260 in the 7th Edition), which
you are required to read.
Proof that Deﬁnition 1 ⇒Deﬁnition 2: (Problem #35, p.335)
We just need to show part(iii) of Deﬁnition 2. By Deﬁnition 1, N(h)
has a Poisson distribution with mean λh. Therefore,
P(N(h) = 0) = e−λh.
If we expand out the exponential in a Taylor series, we have that
P(N(h) = 0) = 1 −λh + (λh)2
2!
−(λh)3
3!

+ . . .
= 1 −λh + o(h).

---

## Page 19

195
Similarly,
P(N(h) = 1) = λhe−λh
= λh

1 −λh + (λh)2
2!
−(λh)3
3!

+ . . .

= λh −λ2h2 + (λh)3
2!
−(λh)4
3!
+ . . .
= λh + o(h).
Finally,
P(N(h) ≥2) = 1 −P(N(h) = 1) −P(N(h) = 0)
= 1 −(λh + o(h)) −(1 −λh + o(h))
= −o(h) −o(h) = o(h).
Thus Deﬁnition 1 implies Deﬁnition 2.
□
A third way to deﬁne the Poisson process is to deﬁne the distribution
of the time between events.
We will see in the next lecture that
the times between events are independent and identically distributed
Exponential(λ) random variables. For now we can gain some insight
into this fact by once again considering the Bernoulli process.
Imagine that you start observing the Bernoulli process at some arbitrary
trial, such that you don’t know how many trials have gone before and
you don’t know when the last successful trial was. Still you would know
that the distribution of the time until the next successful trial was h
times a Geometric random variable with parameter λh. In other words,
you don’t need to know anything about the past of the process to know
the distribution of the time to the next success, and in fact this is the
same as the distribution until the ﬁrst success. That is, the distribution
of the time between successes in the Bernoulli process is memoryless.

---

## Page 20

196
22. THE POISSON PROCESS: INTRODUCTION
When you pass to the limit as h →0 you get the Poisson process with
rate λ, and you should expect that you will retain this memoryless
property in the limit. Indeed you do, and since the only continuous
distribution on [0, ∞) with the memoryless property is the Exponential
distribution, you may deduce that this is the distribution of the time
between events in a Poisson process. Moreover, you should also inherit
from the Bernoulli process that the times between successive events
are independent and identically distributed.
As a ﬁnal aside, we remark that this discussion also suggests that the
Exponential distribution is a limiting form of the Geometric distribu-
tion, as the probability of success λh in each trial goes to 0. This is
indeed the case. As we mentioned above, the time between successful
trials in the Bernoulli process is distributed as Y = hX, where X is
a Geometric random variable with parameter λh. One can verify that
for any t > 0, we have P(Y > t) →e−λt as h →0:
P(Y > t) = P(hX > t)
= P(X > t/h)
= (1 −λh)⌈t/h⌉
= (1 −λh)t/h(1 −λh)⌈t/h⌉−t/h
=


1 −λt
t/h
t/h
(1 −λh)⌈t/h⌉−t/h
→e−λt
as h →0,
where ⌈t/h⌉is the smallest integer greater than or equal to t/h. In
other words, the distribution of Y converges to the Exponential(λ)
distribution as h →0.
Note that the above discussion also illustrates that the Geometric
distribution is a discrete distribution with the memoryless property.

---

## Page 21

23
Properties of the Poisson Process
Today we will consider the distribution of the times between events in a
Poisson process, called the interarrival times of the process. We will see
that the interarrival times are independent and identically distributed
Exponential(λ) random variables, where λ is the rate of the Poisson
process. This leads to our third deﬁnition of the Poisson process.
Using this deﬁnition, as well as our previous deﬁnitions, we can de-
duce some further properties of the Poisson process. Today we will
see that the time until the nth event occurs has a Gamma(n,λ) dis-
tribution. Later we will consider the sum, called the superposition,
of two independent Poisson processes, as well as the thinned Poisson
process obtained by independently marking, with some ﬁxed probabil-
ity p, each event in a Poisson process, thereby identifying the events
in the thinned process.
197

---

## Page 22

198
23. PROPERTIES OF THE POISSON PROCESS
Interarrival Times of the Poisson Process:
We can think of the Poisson process as a counting process with a given
interarrival distribution That is, N(t) is the number of events that have
occurred up to time t, where the times between events, called the
interarrival times, are independent and identically distributed random
variables.
Comment: We will see that the interarrival distribution for a Poisson
process with rate λ is Exponential(λ), which is expected based on the
discussion at the end of the last lecture. In general, we can replace
the Exponential interarrival time distribution with any distribution on
[0, ∞), to obtain a large class of counting processes. Such processes
(when the interarrival time distribution is general) are called Renewal
Processes, and the area of their study is called Renewal Theory. We
will not study this topic in this course, but for those interested this
topic is covered in Chapter 7 of the text.
However, we make the
comment here that if the interarrival time is not Exponential, then the
process will not have stationary and independent increments. That is,
the Poisson process is the only Renewal process with stationary and
independent increments.

---

## Page 23

199
Proof that the Interarrival Distribution is Exponential(λ):
We can prove that the interarrival time distribution in the Poisson
process is Exponential directly from Deﬁnition 1. First, consider the
time until the ﬁrst event, say T1. Then for any t > 0, the event
{T1 > t} is equivalent to the event {N(t) = 0}. Therefore,
P(T1 > t) = P(N(t) = 0) = e−λt.
This shows immediately that T1 has an Exponential distribution with
rate λ.
In general let Ti denote the time between the (i −1)st and the ith
event. We can use an induction argument in which the nth propo-
sition is that T1, . . . , Tn are independent and identically distributed
Exponential(λ) random variables:
Proposition n : T1, . . . , Tn are i.i.d. Exponential(λ).
We have shown that Proposition 1 is true. Now assume that Propo-
sition n is true (the induction hypothesis). Then we show this implies
Proposition n + 1 is true. To do this ﬁx t, t1, . . . , tn > 0. Proposition
n + 1 will be true if we show that the distribution of Tn+1 conditioned
on T1 = t1, . . . , Tn = tn does not depend on t1, . . . , tn (which shows
that Tn+1 is independent of T1, . . . , Tn), and P(Tn > t) = e−λt. So
we wish to consider the conditional probability
P(Tn+1 > t|Tn = tn, . . . , T1 = t1).
First, we will re-express the event {Tn = tn, . . . , T1 = t1} which
involves the ﬁrst n interarrival times into an equivalent event which
involves the ﬁrst n arrival times. Let Sk = T1 + . . . + Tk be the kth

---

## Page 24

200
23. PROPERTIES OF THE POISSON PROCESS
arrival time (the time of the kth event) and let sk = t1 + . . . + tk, for
k = 1, . . . , n. Then
{Tn = tn, . . . , T1 = t1} = {Sn = sn, . . . , S1 = s1},
and we can rewrite our conditional probability as
P(Tn+1 > t|Tn = tn, . . . , T1 = t1) = P(Tn+1 > t|Sn = sn, . . . , S1 = s1)
The fact that the event {Tn+1 > t} is independent of the event
{Sn = sn, . . . , S1 = s1} is because of independent increments, though
it may not be immediately obvious. We’ll try to see this in some detail.
If the event {Sn = sn, . . . , S1 = s1} occurs then the event {Tn+1 > t}
occurs if and only if there are no arrivals in the interval (sn, sn + t],
so we can write
P (Tn+1 > t|Sn = sn, . . . , S1 = s1)
= P(N(sn + t) −N(sn) = 0|Sn = sn, . . . , S1 = s1).
Therefore, we wish to express the event {Sn = sn, . . . , S1 = s1} in
terms of increments disjoint from the increment N(sn + t) −N(sn).
At the cost of some messy notation we’ll do this, just to see how it
might be done at least once. Deﬁne the increments
I(k)
1
= N(s1 −1/k) −N(0)
I(k)
i
= N(si −1/k) −N(si−1 + 1/k)
for i = 2, . . . , n,
for k > M, where M is chosen so that 1/k is smaller than the smallest
interarrival time, and also deﬁne the increments
B(k)
i
= N(si + 1/k) −N(si −1/k)
for i = 1, . . . , n −1
B(k)
n
= N(sn) −N(sn −1/k),

---

## Page 25

201
for k > M. The increments I(k)
1 , B(k)
1 , . . . , I(k)
n , B(k)
n
are all disjoint
and account for the entire interval [0, sn]. Now deﬁne the event
Ak = {I1 = 0}
\
. . .
\
{In = 0}
\
{B1 = 1}
\
. . .
\
{Bn = 1}.
Then Ak implies Ak−1 (that is, Ak is contained in Ak−1) so that the
sequence {Ak}∞
k=M is a decreasing sequence of sets, and in fact
{Sn = sn, . . . , S1 = s1} =
∞
\
k=M
Ak,
because one can check that each event implies the other.
However (and this is why we constructed the events Ak), for any k the
event Ak is independent of the event {N(sn+t)−N(sn) = 0} because
the increment N(sn +t)−N(sn) is independent of all the increments
I(k)
1 , . . . , I(k)
n , B(k)
1 , . . . , B(k)
n , as they are all disjoint increments. But
if the event {N(sn + t) −N(sn) = 0} is independent of Ak for every
k, it is independent of the intersection of the Ak. Thus, we have
P (Tn+1 > t|Sn = sn, . . . , S1 = s1)
= P(N(sn + t) −N(sn) = 0|Sn = sn, . . . , S1 = s1)
= P

N(sn + t) −N(sn) = 0

∞
\
k=M
Ak

= P((N(sn + t) −N(sn) = 0)
= P(N(t) = 0) = e−λt,
and we have shown that Tn+1 has an Exponential(λ) distribution and is
independent of T1, . . . , Tn. We conclude from the induction argument
that the sequence of interarrival times T1, T2, . . . are all independent
and identically distributed Exponential(λ) random variables.
□

---

## Page 26

202
23. PROPERTIES OF THE POISSON PROCESS
Deﬁnition 3 of a Poisson Process:
A continuous-time stochastic process {N(t) : t ≥0} is a Poisson
process with rate λ > 0 if
(i) N(0) = 0.
(ii) N(t) counts the number of events that have occurred up to time
t (i.e. it is a counting process).
(iii) The times between events are independent and identically dis-
tributed with an Exponential(λ) distribution.
We have seen how Deﬁnition 1 implies (i), (ii) and (iii) in Deﬁnition 3.
One can show that Exponential(λ) interarrival times implies part(iii)
of Deﬁnition 2 by expanding out the exponential function as a Taylor
series, much as we did in showing that Deﬁnition 1 implies Deﬁnition
2. One can also show that Exponential interarrival times implies sta-
tionary and independent increments by using the memoryless property.
As an exercise, you may wish to prove this. However, we will not do
so here. That Deﬁnition 3 actually is a deﬁnition of the Poisson pro-
cess is nice, but not necessary. It suﬃces to take either Deﬁnition 1
or Deﬁnition 2 as the deﬁnition of the Poisson process, and to see
that either deﬁnition implies that the times between events are i.i.d.
Exponential(λ) random variables.
Distribution of the Time to the nth Arrival:
If we let Sn denote the time of the nth arrival in a Poisson process,
then Sn = T1 + . . . + Tn, the sum of the ﬁrst n interarrival times.
The distribution of Sn is Gamma with parameters n and λ. Before
showing this, let us brieﬂy review the Gamma distribution.

---

## Page 27

203
The Gamma(α, λ) Distribution:
A random variable X on [0, ∞) is said to have a Gamma distribution
with parameters α > 0 and λ > 0 if its probability density function is
given by
fX(x|α, λ) =
(
λα
Γ(α)xα−1e−λx for x ≥0
0
for x < 0 ,
where Γ(α), called the Gamma function, is deﬁned by
Γ(α) =
Z ∞
0
yα−1e−ydy.
We can verify that the density of the Gamma(α,λ) distribution inte-
grates to 1, by writing down the integral
Z ∞
0
λα
Γ(α)xα−1e−λxdx
and making the substitution y = λx. This gives dy = λdx or dx =
(1/λ)dy, and x = y/λ, and so
Z ∞
0
λα
Γ(α)xα−1e−λxdx =
Z ∞
0
λα
Γ(α)
y
λ
α−1
e−λy/λ 1
λdy
=

1
Γ(α)
Z ∞
0
yα−1e−ydy = 1,
by looking again at the deﬁnition of Γ(α).

---

## Page 28

204
23. PROPERTIES OF THE POISSON PROCESS
The Γ(α) function has a useful recursive property. For α > 1 we
can start to evaluate the integral deﬁning the Gamma function using
integration by parts:
Z b
a
udv = uv|b
a −
Z b
a
vdu.
We let
u = yα−1
and
dv = e−ydy,
giving
du = (α −1)yα−2dy
and
v = −e−y,
so that
Γ(α) =
Z ∞
0
yα−1e−ydy
= −yα−1e−y

∞
0 + (α −1)
Z ∞
0
yα−2e−ydy
= 0 + (α −1)Γ(α −1).
That is, Γ(α) = (α −1)Γ(α −1). In particular, if α = n, a positive
integer greater than or equal to 2, then we recursively get
Γ(n) = (n −1)Γ(n −1) = . . . = (n −1)(n −2) . . . (2)(1)Γ(1)
= (n −1)!Γ(1).
However,
Γ(1) =
Z ∞
0
e−ydy = −e−y

∞
0 = 1,
is just the area under the curve of the Exponential(1) density. There-
fore, Γ(n) = (n −1)! for n ≥2. However, since Γ(1) = 1 = 0! we
have in fact that Γ(n) = (n −1)! for any positive integer n.

---

## Page 29

205
So for n a positive integer, the Gamma(n,λ) density can be written
as
fX(x|n, λ) =
(
λn
(n−1)!xn−1e−λx for x ≥0
0
for x < 0 .
An important special case of the Gamma(α, λ) distribution is the
Exponential(λ) distribution, which is obtained by setting α = 1. Get-
ting back to the Poisson process, we are trying to show that the sum
of n independent Exponential(λ) random variables has a Gamma(n,λ)
distribution, and for n = 1, the result is immediate. For n > 1, the
simplest way to get our result is to observe that the time of the nth
arrival is less than or equal to t if and only if the number of arrivals in
the interval [0, t] is greater than or equal to n. That is, the two events
{Sn ≤t}
and
{N(t) ≥n}
are equivalent. However, the probability of the ﬁrst event {Sn ≤t}
gives the CDF of Sn, and so we have a means to calculate the CDF:
FSn(t) ≡P(Sn ≤t) = P(N(t) ≥n) =
∞
X
j=n
(λt)n
n! e−λt.
To get the density of Sn, we diﬀerentiate the above with respect to t,
giving
fSn(t) = −
∞
X
j=n
λ(λt)j
j! e−λt +
∞
X
j=n
λ (λt)j−1
(j −1)!e−λt
= λ (λt)n−1
(n −1)!e−λt =
λn
(n −1)!tn−1e−λt.
Comparing with the Gamma(n,λ) density above we have our result.

---

## Page 30

206
23. PROPERTIES OF THE POISSON PROCESS

---

## Page 31

24
Further Properties of the Poisson Process
Today we will consider two further properties of the Poisson process
that both have to do with deriving new processes from a given Poisson
process. Speciﬁcally, we will see that
(1) The sum of two independent Poisson processes (called the super-
position of the processes), is again a Poisson process but with rate
λ1 + λ2, where λ1 and λ2 are the rates of the constituent Poisson
processes.
(2) If each event in a Poisson process is marked with probability
p, independently from event to event, then the marked process
{N1(t) : t ≥0}, where N1(t) is the number of marked events up
to time t, is a Poisson process with rate λp, where λ is the rate
of the original Poisson process. This is called thinning a Poisson
process.
The operations of taking the sum of two or more independent Poisson
processes and of thinning a Poisson process can be of great practical
use in modeling many systems where the Poisson process(es) represent
arrival streams to the system and we wish to classify diﬀerent types of
arrivals because the system will treat each arrival diﬀerently based on
its type.
207

---

## Page 32

208
24. FURTHER PROPERTIES OF THE POISSON PROCESS
Superposition of Poisson Processes:
Suppose that {N1(t) : t ≥0} and {N2(t) : t ≥0} are two indepen-
dent Poisson processes with rates λ1 and λ2, respectively. The sum of
N1(t) and N2(t),
{N(t) = N1(t) + N2(t) : t ≥0},
is called the superposition of the two processes N1(t) and N2(t). Since
N1(t) and N2(t) are independent and N1(t) is Poisson(λ1t) and N2(t)
is Poisson(λ2t), their sum has a Poisson distribution with mean (λ1 +
λ2)t. Also, it is clear that N(0) = N1(0) + N2(0) = 0. That is,
properties (i) and (iii) of Deﬁnition 1 of a Poisson process are satisﬁed
by the process N(t) if we take the rate to be λ1 + λ2. Thus, to show
that N(t) is indeed a Poisson process with rate λ1 +λ2 it just remains
to show that N(t) has stationary and independent increments.
First, consider any increment I(t1, t2) = N(t2)−N(t1), with t1 < t2.
Then
I(t1, t2) = N(t2) −N(t1)
= N1(t2) + N2(t2) −(N1(t1) + N2(t1))
= (N1(t2) −N1(t1)) + (N2(t2) −N2(t1))
≡I1(t1, t2) + I2(t1, t2),
where I1(t1, t2) and I2(t1, t2) are the corresponding increments in the
N1(t) and N2(t) processes, respectively. But the increment I1(t1, t2)
has a Poisson(λ1(t2 −t1)) distribution and the increment I2(t1, t2)
has a Poisson(λ2(t2 −t1)) distribution. Furthermore, I1(t1, t2) and
I2(t1, t2) are independent. Therefore, as before, their sum has a Pois-
son distribution with mean (λ1+λ2)(t2−t1). That is, the distribution
of the increment I(t1, t2) depends on t1 and t2 only through the dif-
ference t2 −t1, which says that N(t) has stationary increments.

---

## Page 33

209
Second, for t1 < t2 and t3 < t4, let I(t1, t2) = N(t2) −N(t1) and
I(t3, t4) = N(t4) −N(t3) be any two disjoint increments (i.e. the
intervals (t1, t2] and (t3, t4] are disjoint). Then
I(t1, t2) = I1(t1, t2) + I2(t1, t2)
and
I(t3, t4) = I1(t3, t4) + I2(t3, t4).
But I1(t1, t2) is independent of I1(t3, t4) because the N1(t) process
has independent increments, and I1(t1, t2) is independent of I2(t3, t4)
because the processes N1(t) and N2(t) are independent. Similarly, we
can see that I2(t1, t2) is independent of both I1(t3, t4) and I2(t3, t4).
From this it is clear that the increment I(t1, t2) is independent of the
increment I(t3, t4). Therefore, the process N(t) also has independent
increments.
Thus, we have shown that the process {N(t) : t ≥0} satisﬁes the
conditions in Deﬁnition 1 for it to be a Poisson process with rate
λ1 + λ2.
Remark 1:
By repeated application of the above arguments we can
see that the superposition of k independent Poisson processes with
rates λ1, . . . , λk is again a Poisson process with rate λ1 + . . . + λk.
Remark 2:
There is a useful result in probability theory which says
that if we take N independent counting processes and sum them up,
then the resulting superposition process is approximately a Poisson
process. Here N must be “large enough” and the rates of the in-
dividual processes must be “small” relative to N (this can be made
mathematically precise, but here in this remark our interest is in just

---

## Page 34

210
24. FURTHER PROPERTIES OF THE POISSON PROCESS
the practical implications of the result), but the individual processes
that go into the superposition can otherwise be arbitrary.
This can sometimes be used as a justiﬁcation for using a Poisson pro-
cess model. For example, in the classical voice telephone system, each
individual produces a stream of connection requests to a given tele-
phone exchange, perhaps in a way that does not look at all like a
Poisson process. But the stream of requests coming from any given
individual typically makes up a very small part of the total aggregate
stream of connection requests to the exchange. It is also reasonable
that individuals make telephone calls largely independently of one an-
other. Such arguments provide a theoretical justiﬁcation for modeling
the aggregate stream of connection requests to a telephone exchange
as a Poisson process. Indeed, empirical observation also supports such
a model.
In contrast to this, researchers in recent years have found that arrivals
of packets to gateway computers in the internet can exhibit some
behaviour that is not very well modeled by a Poisson process. The
packet traﬃc exhibits large “spikes”, called bursts, that do not suggest
that they are arriving uniformly in time.
Even though many users
may make up the aggregate packet traﬃc to a gateway or router, the
number of such users is likely still not as many as the number of users
that will make requests to a telephone exchange. More importantly,
the aggregate traﬃc at an internet gateway tends to be dominated by
just a few individual users at any given time. The connection to our
remark here is that as the bandwidth in the internet increases and the
number of users grows, a Poisson process model should theoretically
become more and more reasonable.

---

## Page 35

211
Thinning a Poisson Process:
Let {N(t) : t ≥0} be a Poisson process with rate λ. Suppose we mark
each event with probability p, independently from event to event, and
let {N1(t) : t ≥0} be the process which counts the marked events.
We can use Deﬁnition 2 of a Poisson process to show that the thinned
process N1(t) is a Poisson process with rate λp. To see this, ﬁrst
note that N1(0) = N(0) = 0. Next, the probability that there is one
marked event in the interval [0, h] is
P(N1(h) = 1) = P(N(h) = 1)p +
∞
X
k=2
P(N(h) = k)
k
1

p(1 −p)k−1
= (λh + o(h))p +
∞
X
k=2
o(h)kp(1 −p)k−1
= λph + o(h).
Similarly,
P(N1(h) = 0) = P(N(h) = 0) + P(N(h) = 1)(1 −p)
+
∞
X
k=2
P(N(h) = k)(1 −p)k
= 1 −λh + o(h) + (λh + o(h))(1 −p)
+
∞
X
k=2
o(h)(1 −p)k
= 1 −λph + o(h).
Finally, P(N1(h) ≥2) can be obtained by subtraction:
P(N1(h) ≥2) = 1 −P(N1(h) = 0) −P(N1(h) = 1)
= 1 −(1 −λph + o(h)) −(λph + o(h)) = o(h).

---

## Page 36

212
24. FURTHER PROPERTIES OF THE POISSON PROCESS
We can show that the increments in the thinned process are stationary
by computing P(I1(t1, t2) = k), where I1(t1, t2) ≡N1(t2) −N1(t1)
is the increment from t1 to t2 in the thinned process, by conditioning
on the increment I(t1, t2) ≡N(t2) −N(t1) in the original process:
P(I1(t1, t2) = k) =
∞
X
n=0
P(I1(t1, t2) = k|I(t1, t2) = n)P(I(t1, t2) = n)
=

∞
X
n=k
P(I1(t1, t2) = k|I(t1, t2) = n)P(I(t1, t2) = n)
=

∞
X
n=k
n
k

pk(1 −p)n−k[λ(t2 −t1)]n
n!
e−λ(t2−t1)
= [λp(t2 −t1)]k
k!
e−λp(t2−t1)
×
∞
X
n=k
[λ(1 −p)(t2 −t1)]n−k
(n −k)!
e−λ(1−p)(t2−t1)
= [λp(t2 −t1)]k
k!
e−λp(t2−t1).
This shows that the distribution of the increment I1(t1, t2) depends
on t1 and t2 only through the diﬀerence t2 −t1, and so the increments
are stationary. Finally, the fact that the increments in the thinned
process are independent is directly inherited from the independence of
the increments in the original Poisson process N(t).
Remark: The process consisting of the unmarked events, call it N2(t),
is also a Poisson process, this time with rate λ(1−p). The text shows
that the two processes N1(t) and N2(t) are independent. Please read
this section of the text (Sec.5.3.4).

---

## Page 37

213
The main practical advantage that the Poisson process model has over
other counting process models is the fact that many of its properties
are explicitly known. For example, it is in general diﬃcult or impossible
to obtain explicitly the distribution of N(t) for any t if N(t) were a
counting process other than a Poisson process. The memoryless prop-
erty of the exponential interarrival times is also extremely convenient
when doing calculations that involve the Poisson process.
(Please read the class notes for material on the ﬁltered Poisson
process and Proposition 5.3 of the text).
