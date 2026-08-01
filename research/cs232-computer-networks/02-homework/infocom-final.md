# infocom-final

---

## Page 1

Probabilistic Analysis of Buffer Starvation in
Markovian Queues
Yuedong Xu†, Eitan Altman‡, Rachid El-Azouzi†, Salaheddine Elayoubi∗, Majed Haddad‡, Tania Jimenez†
†University of Avignon, 339 Chemin des Meinajaries, Avignon, France
‡INRIA Sophia Antipolis, 2004 Route des Lucioles, France
∗Orange Labs, Paris, France
Email: <yuedong.xu@gmail.com>, <eitan.altman@inria.fr>, <Rachid.Elazouzi@univ-avignon.fr>,
<majed.haddad@inria.fr>, <salaheddine.elayoubi@orange-ftgroup.com>, <Tania.Jimenez@univ-avignon.fr>
Abstract—Our purpose in this paper is to obtain the exact
distribution of the number of buffer starvations within a sequence
of N consecutive packet arrivals. The buffer is modeled as an
M/M/1 queue.When the buffer is empty, the service restarts
after a certain amount of packets are prefetched. With this goal,
we propose two approaches, one of which is based on Ballot
theorem, and the other uses recursive equations. The Ballot
theorem approach gives an explicit solution, but at the cost of the
high complexity order in certain circumstances. The recursive
approach, though not offering an explicit result, needs fewer
computations. We further propose a ﬂuid analysis of starvation
probability on the ﬁle level, given the distribution of ﬁle size and
the trafﬁc intensity. The starvation probabilities of this paper
have many potential applications. We apply them to optimize
the quality of experience (QoE) of media streaming service,
by exploiting the tradeoff between the start-up delay and the
starvation.
I. INTRODUCTION
The starvation probability of a buffer is an important per-
formance measure for protocol design of telecommunication
networks, as well as in storage systems and ecological systems
(e.g. dams). Starvation is said to occur when the buffer is
empty. Various applications use buffering in order to control
the rate at which packets are served at the destination. As
long as there are packets in the buffer, packets arrive at the
destination regularly, i.e. they are spaced by the service time
of the buffer. Once the buffer empties packets may arrive at the
destination separated by larger times, as the spacing between
packets now depends also on the inter-arrival times at the
queue. Starvation is in particular undesirable in real time voice
as well as in video streaming applications.
The time till starvation of a queue is related to the busy
period which has been well studied under the assumption of
a stationary arrival process (see [2], [3] and their references).
In contrast to this assumption, we consider a ﬁnite number of
arrivals as we are interested in statistics of starvation when a
ﬁle of ﬁxed size is transferred.
The main goal of this paper is to ﬁnd the distribution of
the number of starvations within a ﬁle of N packets. We ﬁrst
model the buffer as an M/M/1 queue, and then extend it to
incorporate the bursty packet arrival that is modeled by an in-
terrupted Poisson process (IPP). In this system, a ﬁxed amount
of packets are prefetched (also called “prefetching threshold”)
before the service begins or resumes after a starvation event.
In this paper, we propose two approaches (that give the same
result) to compute the starvation probabilities and the distri-
bution of the number of starvations for a single ﬁle. The ﬁrst
approach gives an explicit result based on the Ballot theorem
[1]. The second approach provides a recursive computation
algorithm. Both are done in an M/M/1 queue on a packet level.
Using Ballot theorem, we can compute in a simple way the
exact distribution of the number of starvations explicitly. As
the ﬁle size approaches inﬁnity, we present the asymptotic
starvation probability using Gaussian (interchangeable with
Normal) approximation as well as an approximation of the
Riemann integral. Whereas the Ballot Theorem provides an
explicit solution, we propose an alternative approach which
constitutes a recursive algorithm for computing starvation
probabilities. Although the recursive approach does not gener-
ate an explicit solution, it does perform better than the Ballot
Theorem in terms of complexity under certain circumstances.
We further propose a ﬂuid analysis of starvation behavior
on the ﬁle level. This approach, instead of looking into the
stochastic packet arrivals and departures, predicts the starva-
tion where the servers manage a large quantity of ﬁle transfers.
Given the trafﬁc intensity and the distribution of ﬁle size, we
are able to compute the starvation probability as a function of
the prefetching threshold. The ﬂuid analysis, though simple,
offers an important insight on how to control the probability
of starvation for many ﬁles, instead of for one particular ﬁle.
The probabilities of starvations developed in this work
have various applications in the different ﬁelds. A prominent
example is the media streaming service. This application
demonstrates a dilemma between the prefetching process and
the starvation. A longer prefetching process causes a larger
start-up delay, while a shorter one might result in starvations.
The user perceived media quality (or QoE equivalently) is
impaired by either the large start-up delay or the undesirable
starvations. This problem becomes increasingly important in
the epoch that web video hogs up to more than 37% of total
trafﬁc during peak hours in USA [18]. In contrast to the rapid
growth of trafﬁc load, the bandwidth provision usually lags
behind. In this context, media providers and network operators
face a crucial challenge of maintaining a satisfactory QoE of
streaming service. With the results developed in this work,
we are able to answer the fundamental question: How many
packets should the media player prefetch to optimize the users’

---

## Page 2

quality of experience? We propose a set of QoE metrics for
both the ﬁnite and the inﬁnite ﬁle size. The optimal QoE
is achieved by conﬁguring the start-up threshold in packets.
Recently, the similar QoE issue is studied in the important
works [5], [6], [7]. Liang et al. [6] studies the bounds of start-
up delay, given the deterministic playout and arrival curves.
Authors in [7] present a minimum prefetching threshold for
an M/D/1 queue, other than an exact solution. They further
extend their method to consider the arrival process depicted
by a two-state Markov chain. Luan et al. [5] adopts diffusion
approximation to investigate the time-dependent starvation
behavior. Their technique is inadequate to provide insights
on starvation in a media ﬁle with small number of units
(in packets or chunks). Compared to state of the art, our
approaches target at the exact solution, and can analyze the
starvation of small ﬁles. This is particularly important in the
evaluation of adaptive streaming where the entire media ﬁle
is subdivided into many chunks encoded by multiple playback
rates. The starvation is more likely to happen when the packets
from one or several high-deﬁnition video chunks are being
played.
The rest of this paper is organized as follows. Section II
reviews the related work. We propose a Ballot approach in
Section III. Section IV presents the recursive approach for
an M/M/1 queue. Section V performs a ﬂuid analysis for a
large number of ﬁles. Section VI presents the QoE metrics and
their optimization issues. Our theoretical results are veriﬁed in
section VII. Section VIII concludes this paper and discusses
the future work.
II. RELATED WORK
The analysis of starvation is close to that of busy period in
transient queues. In [2], [3] authors solve the distribution of
the buffer size as a function of time for the M/M/1 queue. The
exact result is expressed as an inﬁnite sum of modiﬁed Bessel
functions. The starvation analysis of this work is different from
the transient queueing analysis in two aspects. First, the former
aims to ﬁnd the probability generating function of starvation
events while not the queue size. Second, the former does not
assume a stationary arrival process.
Ballot theorem and recursive equations have been used to
analyze the packet loss probability in a ﬁnite buffer when
the forward error-correcting technique is deployed. Citon et
al. [9] propose a recursive approach that enables them to
compute the packet loss probability in a block of consecu-
tive packet arrivals into an M/M/1/K queue. Based on their
recursive approach, Altman and Jean-Marie in [10] obtain the
expressions for the multidimensional generating function of
the packet loss probability. The distribution of message delay
is given in an extended work [11]. Dubea and Altman in
[12] analyze the packet loss probability with the consideration
of random loss in incoming and outgoing links. In [14],
Gurewitz et al. introduce the powerful Ballot theorem to
ﬁnd this probability within a block of packet arrivals into
an M/M/1/K queue. They consider two cases, in which the
block size is smaller or greater than the buffer limit. Another
example of applying Ballot theorem to evaluate networking
system is found in [13]. Humblet et al. present a method
based on Ballot theorem to study the performance of nD/D/1
queue with periodical arrivals and deterministic service time.
In [16], He and Sohraby use Ballot theorem to ﬁnd the
stationary probability distribution in a general class of discrete
time systems with batch arrivals and departures. Privalov and
Sohraby [17] study the underﬂow behavior of CBR trafﬁc in
a time-slotted queueing system. However, they do not provide
the insights of having a certain number of starvations.
In the applications related to our work, Stockhammer et al.
[15] specify the minimum start-up delay and the minimum
buffer size for a given video stream and a deterministic
variable bit rate (VBR) wireless channel. Recently, [6] presents
a deterministic bound, and [7] provides a stochastic bound
of start-up delay to avoid starvation. Authors in [5] model
the playout buffer as a G/G/1 queue. By using diffusion ap-
proximation, they obtain the closed-form starvation probability
with asymptotically large ﬁle size. Xu et.al [21] study the
scheduling algorithms for multicast streaming in multicarrier
wireless downlink. In the application ﬁeld, our paper differs
from state of the art works in the following ways: i) we present
new theories that yield an exact probability of starvation, and
the probability generating function of starvation events; ii)
we study of asymptotic behavior with error analysis; iii) we
perform a macroscopic starvation analysis using a ﬂuid model;
iv) we conﬁgure optimal prefetching thresholds to optimize the
QoE metrics.
III. STARVATION ANALYSIS USING BALLOT THEOREM
In this section, we study the starvation behavior of an
M/M/1 queue with ﬁnite number of arrivals. The analytical
method is based on the powerful Ballot theorem.
A. System Description
We consider a single media ﬁle with ﬁnite size N. The
media content is pre-stored in the media server. When a user
makes a request, the server segments this media into packets,
and transfers them to the user by use of TCP or UDP protocols.
When packets traverse the wired or wireless links, their arrivals
to the media player of a user are not deterministic due to the
dynamics of the available bandwidth. The Poisson assumption
is not the most realistic way to describe packet arrivals, but
it reveals the essential features of the system, and is the ﬁrst
step for more general arrival processes. After the streaming
packets are received, they are ﬁrst stored in the playout buffer.
The interval between two packets that are served is assumed
to be exponentially distributed so that we can model the
receiver buffer as an M/M/1 queue. The maximum buffer size
is assumed to be large enough so that the whole ﬁle can
be stored. This simpliﬁcation is justiﬁed by the fact that the
storage space is usually very large in the receiver side (e.g.
several GB).
The user perceived media quality has two measures called
start-up delay and starvation. As explained earlier, the media
player wants to avoid the starvation by prefetching packets.
However, this action might incur a long waiting time. In what
follows, we reveal the relationship between the start-up delay
and the starvation behavior, with the consideration of ﬁle size.

---

## Page 3

B. A Packet Level Model
We present a packet level model to investigate the starvation
behavior. Denote by λ the Poisson arrival rate of the packets,
and by µ the Poisson service rate. Deﬁne ρ := λ/µ as the
trafﬁc intensity.
In a non-empty M/M/1 queue with everlasting arrivals, the
rate at which either an arrival or a departure occurs is given by
λ+ µ. This event corresponds to an arrival with probability p,
or is otherwise to an end of service with probability q, where
p =
λ
λ + µ =
ρ
1 + ρ;
q =
µ
λ + µ =
1
1 + ρ.
The buffer is initially empty. Let T1 be the start-up delay,
in which x1 packets are accumulated in the buffer. Once
the service begins, the probability of starvation is given by
Theorem 1.
Theorem 1: For the initial queue length x1 and the total
size N of a ﬁle, the probability of starvation is given by:
Ps =
N−1
X
k=x1
x1
2k −x1
2k −x1
k −x1

pk−x1(1 −p)k.
(1)
Proof: Before proving this theorem, we iterate the classical
Ballot theorem ﬁrst.
Ballot Theorem: In a ballot, candidate A scores NA votes
and candidate B scores NB votes, where NA > NB. Assume
that while counting, all the ordering (i.e. all sequences of A’s
and B’s) are equally alike, the probability that throughout the
counting, A is always ahead in the count of votes is NA−NB
NA+NB .
We deﬁne Ek to be an event that the buffer becomes empty
for the ﬁrst time when the service of packet k is ﬁnished. It
is obvious that all the events Ek, k = 1, · · · N, are mutually
exclusive. Then, the event of starvation is the union ∪N−1
k=x1Ek.
This union of events excludes EN because the empty buffer
seen by packet N is not a starvation. When the buffer is empty
at the end of the service of the kth packet, the number of
arrivals is k−x1 after the prefetching process. The probability
of having k −x1 arrivals and k departures is computed from
a binomial distribution,
 2k−x1
k−x1

pk−x1(1 −p)k. We next ﬁnd
the necessary and sufﬁcient condition of the event Ek. If we
have a backward time axis that starts from the time point when
the buffer is empty for the ﬁrst time, the number of departure
packets is always more than that of arrival packets. As a result,
the Ballot Theorem can be applied. For example, among the
last m events (i.e. m ≤2k −x1), the number of packets that
have been played is always greater than the number of arrivals.
Otherwise, the empty buffer already happens before the kth
packet is served. According to the Ballot theorem, the prob-
ability of event Ek is computed by
x1
2k−x1
 2k−x1
k−x1

pk−x1qk.
Therefore, the probability of starvation, Ps, is the probability
of the union ∪N−1
k=x1Ek, given by eq.(1).
The starvation event may happen for more than once during
the ﬁle transfer. We are particularly interested in the proba-
bility distribution of starvations, given a ﬁnite ﬁle size N.
The maximum number of starvations is J = ⌊N
x1 ⌋where ⌊·⌋
is the ﬂoor of a real number. We deﬁne path as a complete
sequence of packet arrivals and departures. The probability of
a path depends on the number of starvations. We illustrate a
typical path with j starvations in Figure 1. To carry out the
analysis, we start from the event that the ﬁrst starvation takes
place. Denote by kl the lth departure of a packet that sees an
empty queue. We notice that the path can be decomposed into
three types of mutually exclusive events as follows:
• Event E(k1): the buffer becoming empty for the ﬁrst time
in the entire path.
• Event Sl(kl, kl+1): the empty buffer after the service of
packet kl+1 given that the previous empty buffer happens
at the departure of packet kl.
• Event Uj(kj): the last empty buffer observed after the
departure of packet kj.
Obviously, a path with j starvations is composed of a succes-
sion of events
E(k1), S1(k1, k2), S2(k2, k3), · · · ,
Sj−2(kj−2, kj−1), Sj−1(kj−1, kj), Uj(kj).
Let PE(k1), PSl(kl,kl+1) and PUj(kj) be the probabilities of
events E(k1), Sl(kl, kl+1) and Uj(kj) respectively. The main
difﬁculty to analyze the probability mass function is that the
media player pauses for x1 packets upon starvation. In what
follows, we analyze the probabilities of these events step by
step. The event E(k1) can happen after the departure of packet
k1 ∈[x1, N −1]. According to the proof of Theorem 1, the
probability distribution of event E(k1) can be expressed as
PE(k1) :=

0
if k1 < x1 or k1 = N;
x1
2k1−x1
 2k1−x1
k1−x1

pk1−x1qk1
otherwise .
(2)
The ﬁrst starvation cannot happen at the departure of ﬁrst
(x1 −1) packets, and cannot happen after all N packets have
been served. We next solve the probability distribution of
the event Uj(kj). Suppose that there are j starvations after
the service of packet kj. The extreme case is that these j
starvations take place consecutively. Thus, kj should be greater
than jx1 −1. Otherwise there cannot have j starvations. If
kj is no less than N −x1, the media player resumes until
all the remaining N −kj packets are stored in the buffer.
Then, starvation will not appear afterwards. In the remaining
cases, the event Uj(kj) is equivalent to the event that no
starvation happens after the service of packet kj. We can take
the complement of starvation probability as the probability
of no starvation. Hence, the probability distribution of event
Uj(kj) is given by
PUj(kj) :=







0,
if kj < jx1 or kj = N;
1,
if N −x1 ≤kj < N;
1 −PN−kj−1
m=x1
x1
2m−x1
 2m−x1
m

pm−x1qm,
otherwise .
(3)
Denote by Ps(j) the probability of having j starvations. The
probability Ps(0) can be obtained from Theorem 1 directly.
For the case with one starvation, Ps(1) is solved by
Ps(1) =
N
X
i=1
PE(i)PU1(i) = PE · PT
U1
(4)
where PE is the row vector of PE(i), and PU1 is the row vector
of PU1(i), for i = 1, 2, · · · , N.

---

## Page 4

Fig. 1.
A path with j starvations
To compute the probability of having more than one star-
vations, we need to ﬁnd the probability of event Sl(kl, kl+1)
beforehand. Solving PSl(kl,kl+1) is non-trivial due to that the
probability of this event depends on the remaining ﬁle size
and the number of starvations. After packet kl is served, the
lth starvation is observed. It is clear that kl should not be
less than lx1 in order to have l starvations. Given that the
buffer is empty after serving packet kl, the (l + 1)th cannot
happen at kl+1 ∈[kl + 1, kl + x1 −1]. Since there are
j starvations in total, the (l + 1)th starvation must satisfy
kl+1 < N −(j −l −1)x1. We next compute the remaining
case that the lth and the (l + 1)th starvations happen after
packets kl and kl+1 are served. Then, there are (kl+1 −kl)
departures, and (kl+1 −kl −x1) arrivals after the prefetching
process. According to the Ballot theorem, a path without
starvation between the departure of packet (kl + 1) and that
of packet (kl+1) is expressed as
x1
2kl+1−2kl−x1 . Therefore, we
can express PSl(kl,kl+1) as



x1
2kl+1−2kl−x1
 2kl+1−2kl−x1
kl+1−kl−x1

pkl+1−kl−x1qkl+1−kl,
if kl ≥lx1, kl + x1 ≤kl+1 < N −(j −l −1)x1;
0,
otherwise .
(5)
We denote by PSl the matrix of PSl(kl,kl+1) for kl, kl+1 ∈
[1, N]. Here, PSl is an upper triangle matrix where all the
elements in the ﬁrst (lx1 −1) rows, and the last x1 rows are
0. The probability of having j(j ≥2) starvations is given by
Ps(j) =
N
X
k1=1
N
X
k2=1
· · ·
N
X
kj−1=1
N
X
kj=1
PE(k1) · PS1(k1,k2) · · ·
PSj−1(kj−1,kj) · PUj(kj=1) = PE
 j−1
Y
l=1
PSl

PT
Uj . (6)
Since the starvation event takes non-negative integer values,
we can write the probability generating function G(z) by
G(z) = E(zj) =
J
X
j=0
Ps(j)zj = PE
 j−1
Y
l=1
PSl

PT
Uj · zj.
(7)
In P, PSl and PUj, the binomial distributions can be approx-
imated by the corresponding Normal distributions with negli-
gible errors (see Appendix in the technical report [22]). The
Gaussian approximation signiﬁcantly reduces the computa-
tional complexity of binomial distributions. The approximated
probability of no starvation computed by the complement
of eq.(1) has a complexity O(N) obviously. The probability
of having only one starvation is a product of two vectors,
which also yields a complexity O(N). If there are only two
starvations, we need to compute the product of two vectors
and one matrix, which has a complexity order O(N 2). When
j ≥3, the computation of Ps(j) involves the product of
two matrices. In general, multiplying two matrices has a
complexity O(N 3) so that the direct computation of eq.(7) is
extremely difﬁcult for large N. Recall that PSl satisﬁes i) an
upper triangle matrix, ii) ﬁrst lx1 −1 rows being 0, iii) last x1
rows being 0 and iv) PSl(kl, kl+1) = PSl(kl + 1, kl+1 + 1) if
they are not zero. These properties facilitate us to compute the
product of the upper triangle matrices with much less effort.
Due to the properties i) and iv), the product of two upper
triangle matrices has a complexity order O(N 2). Detailed
analysis is provided in the Appendix. When there are j(j ≥3)
starvations, the number of matrix production is j−2, resulting
in a complexity order O(N 2(j−2)) for multiplying all the
matrices. To obtain Ps(j), we still need to compute the product
of the vector PE(k1) and the matrix. To sum up, the total
complexity is O(N 2j−2) for j ≥2.
Asymptotic Property:
We want to know whether the starvation event yields simple
implications as the ﬁle size N approaches ∞. The asymptotic
behavior of the starvation probability is given by
lim
N→∞Ps :=
(
1
if ρ < 1;
exp
  x1(1−2p)
2pq

otherwise .
(8)
The detailed analysis can be found in the Appendix of [22].
The asymptotic analysis reveals that the probability of
starvation has nothing to do with the start-up threshold when
ρ < 1. Under this situation, it is necessary to know how
frequent the starvation event happens. Here, we compute the
average time interval between two starvations. Let Ts be the
duration of starvation interval. Its expectation E[Ts] is the
expected busy period of an M/M/1 queue with x1 customers
in the beginning [4], i.e.
E[Ts] =
x1
λ(1 −ρ).
(9)
IV. STARVATION ANALYSIS VIA A RECURSIVE APPROACH
In this section, we present a recursive approach to compute
the starvation probability based on [9]. Compared with the one
using Ballot theorem, the recursive approach has less compu-
tational complexity, though without an explicit expression.
A. Probability of Starvation
The probability of starvation and the p.g.f can be analyzed
all in once. However, we compute them separately because the
analysis of the starvation probability provides an easier route
to understand this approach.

---

## Page 5

We denote by Pi(n) the probability of starvation with a ﬁle
of n packets, given that there are i packets in the system just
before the arrival epoch of the ﬁrst packet of this ﬁle. In the
original system, our purpose is to obtain the starvation proba-
bility of a ﬁle with the size N when x1 packets are prefetched
before the service begins. This corresponds to Pi(n) with
n = N −x1 and i = x1 −1. Here, the expression i = x1 −1
means that the service starts when the packet x1 sees x1 −1
packets accumulated in the buffer. To compute Pi(n), we will
introduce recursive equations. We deﬁne a quantity Qi(k),
i = 0, 1, · · · , n, 0 ≤k ≤i, which is the probability that k
packets out of i leave the system during an inter-arrival period.
This probability is equivalent to the probability of k Poisson
arrivals with rate µ during an exponentially distributed period
with parameter 1/λ. According to [8], we obtain
Qi(k)
=

ρ
 1
1 + ρ
k+1 = pqk, 0 ≤k ≤i −1, (10)
Qi(i)
=

 1
1 + ρ
i = qi.
(11)
To carry out the recursive calculation, we start from the case
n = 1.
Pi(1) = 0,
∀i ≥1.
(12)
When the ﬁle size is 1 and the only packet observes a non-
empty queue, the probability of starvation is 0 obviously. If i
is 0, the starvation happens for sure, thus yielding
P0(n) = 1,
∀n.
(13)
For n ≥2, we have the following recursive equations:
Pi(n) =
i+1
X
k=0
Qi+1(k)Pi+1−k(n −1),
0 ≤i ≤N −1. (14)
We explain (14) as the following. When the ﬁrst packet of
the ﬁle arrives and sees i packets in the system, the starvation
does not happen. However, the starvation might happen in the
service of remaining n −1 packets. Upon the arrival of the
next packet, k packets out of i + 1 leave the system with
probability Qi+1(k). We next add constraints to the recursive
equation (14) for a ﬁle of size N. Since the total number of
packets is N, the starvation probability must satisfy Pi(n) = 0
for i + n > N.
B. P.G.F. of Starvations
To compute the p.g.f. of starvation, we use the same
recursive approach, despite of the more complicated structure.
With certain reuse of notation, we denote by Pi(j, n) the
probability of j starvation of a ﬁle with size n, given that
the ﬁrst packet of the ﬁle sees i packets in the system upon
its arrival. Our ﬁnal purpose is to compute the probability of
starvation for a ﬁle of size N. It can be obtained from Pi(j, n)
with i = x1 −1 and n = N −x1.
In order to compute Pi(j, n) recursively, we provide the
initial conditions ﬁrst:
Pi(j, 1) =

0
∀i = 1, 2, · · · , N −1, and j ≥1;
1
∀i = 1, 2, · · · , N −1, and j = 0,
(15)
and
P0(j, 1) =
0
j = 0 or j ≥2;
1
j = 1.
(16)
The equation (15) means that the probability of no starvation
is 1 conditioned by i ≥1 and n = 1. Thus, the probability
of having one or more starvations is 0 obviously if the only
packet sees a nonempty system. The equation (16) reﬂects that
the starvation happens for sure when the only packet observes
an empty queue. However, there can only have one starvation
event due to n = 1. Another practical constraint is
Pi(j, n) = 0,
if i + n ≥N
(17)
because of the ﬁnite ﬁle size N.
To compute Pi(j, n), we need to know what will happen if
the buffer is empty, i.e. i = 0. One intuitive observation is
P0(0, n) = 0,
∀1 ≤n ≤N −b;
(18)
because an empty queue means at least one starvation event.
For a more general probability P0(j, n), we begin with the
case j = 1. If only one starvation event exists, there has
P0(1, n) = 1,
∀1 ≤n ≤b,
(19)
where b := x1 −1 is denoted to be the prefetching threshold.
If n > b, b packets will be prefetched. Thus, the remaining ﬁle
size is n −b. We see b packets in the system upon the arrival
of the ﬁrst packet in the remaining ﬁle. Given that the only
one starvation event has taken place, there will be no future
starvations. Therefore, the following equality holds,
P0(1, n) = Pb(0, n −b),
∀b < n ≤N −b.
(20)
Using the similar method, we can solve P0(j, n) for j > 1.
However, the property of P0(j, n) with j > 1 is quite different
P0(j, n) = 0,
∀j > 1 and 1 ≤n ≤b.
(21)
This means that the probability of having > 1 starvations is 0
if the ﬁle size is no larger than b. If n is greater than b, then b
packets are prefetched, leaving n−b packets in the remaining
ﬁle. The remaining n −b packets encounter j −1 starvations,
given that the ﬁrst packet sees b packets in the system upon
arrival, i.e.
P0(j, n) = Pb(j −1, n −b),
∀j > 1 and n > b.
(22)
So far, we have computed a critical quantity P0(j, n), the
probability of meeting an empty buffer. Next, we construct
recursive equations to compute Pi(j, n) as the following:
Pi(j, n) =
i+1
X
k=0
Qi+1(k)Pi+1−k(j, n −1)
=

i
X
k=0
pqkPi+1−k(j, n −1) + qi+1P0(j −1, n −1),(23)
for 0 ≤i ≤N −1. The eq.(23) contains two parts. The former
expression reﬂects the cases that the next arrival sees an non-
empty queue. The latter one characterizes the transition of the
system to a prefetching process.

---

## Page 6

We are interested in how efﬁcient the recursive method is.
Hence, we present the roadmap to compute Pi(j, n) and its
complexity:
• Step 1: Solving Pi(0, 2), for i = 1 to N −2;
• Step 2: Solving Pi(0, n), for i = 1 to N −2, and n = 3
to N −x1 + 1 based on Step 1;
• Step 3: Adding j by 1 and computing Pi(j, n) based on
Step 1 and Step 2.
The complexity analysis is carried out from this roadmap. In
step 1, the computation of Pi(0, 2) incurs up to N summations
for each i, resulting in at most N 2 sums in total. The Step 2
compute Pi(0, n) repeatedly for each n and the Step 3 repeats
Step 1&2 for each j. Therefore, the total complexity has a
order O
 (j + 1)N 3
.
Remark 1: The complexity orders of the Ballot approach
with Gaussian approximation and the recursive approach are
O
 N 2j−2) for j ≥2 and O
 (j + 1)N 3
respectively. When
j ≥3, the recursive approach may have less computational
complexity than the Ballot approach.
V. FLUID MODEL ANALYSIS OF STARVATION
PROBABILITY
So far we have studied the starvation behavior of a single
ﬁle, which is concerned by either the media servers or the
users. In fact, the media servers are more interested in the QoE
evaluation scaled to a large quantity of ﬁles they supply. They
cannot afford the effort of conﬁguring each ﬁle a different
start-up delay. In this section, we present a ﬂuid analysis of
starvation probability, given the distribution of ﬁle size.
In the ﬂuid model, the arrival and departure rates are
deterministic. We let λ be the number of packet arrivals per
second, and µ be the number of departures per second. Here,
µ depends on the encoding rate that the media ﬁles use. We
focus on the setting µ ≥λ because no starvation will happen
with µ < λ in the ﬂuid model. Let x1 be the start-up threshold.
The start-up delay T1 is simply computed by x1/λ. Once the
media packets are played, the queue length decreases at a rate
µ −λ. The time needed to empty the queue is thus
x1
µ−λ.
Let Np be the total number of packets that are served until a
starvation happens,
Np = x1
 1 +
λ
µ −λ

= x1µ
µ −λ.
(24)
If the size of a ﬁle is less than Np, there will be no starvation
event.
The distribution of media ﬁle size depends on the types
of contents. A measurement study in [19] reveals that the
music, entertainment, comedy and sports videos have different
distributions of ﬁle size. In this section, we compare the
starvation probability of several commonly used distributions,
given the start-up threshold. Note that these distributions
possess the same mean ﬁle size. We further assume that the
users are homogeneous so that λ and µ are the same for
different types of ﬁle size distributions.
i) Exponential distribution: Suppose that the ﬁle size N
follows an exponential distribution with parameter θ. The
probability of starvation, P (1)
s
, is obtained by
P (1)
s
= Prob (N > Np) = exp(−θx1µ
µ −λ).
(25)
ii) Pareto distribution: It is frequently adopted to model the
ﬁle size distribution of Internet trafﬁc using TCP protocol.
Let Nm be the minimum possible value of the ﬁle size, and
υ be the exponent in the Pareto distribution. The probability
of starvation is computed by
P (2)
s
= Prob (N > Np) =
(  Nm(µ−λ)
µx1
υ
∀Nm ≤x1µ
µ−λ;
1
otherwise ,
(26)
where the expectation of the Pareto distribution is equal to that
of the exponential distribution, i.e. υNm
υ−1 = 1
θ.
iii) Log-Normal distribution: We suppose that the ﬁle size
follows a log-normal distribution ln N(̺ , σ), where̺
and σ
are the mean and the standard deviation of a natural normal
distribution. Given that Np packets can be served without an
interruption, the starvation probability P (3)
s
is computed by
P (3)
s
= Prob (N > Np) = 1
2 −1
2erf
log x1µ
µ−λ −̺
√
2σ

,
(27)
where its expectation exp(̺ + σ2
2 ) equals to 1
θ.
Equations (25),(26) and (27) show that the probability of
starvation can be controled by setting x1, if the distribution of
ﬁle size, the arrival and departure rates are pre-knowledge1.
VI. APPLICATION TO STREAMING-LIKE SERVICE
This section presents three scenarios in streaming-like ser-
vice in which our analyses can be utilized to optimize the
quality of experience. Here, we focus on the M/M/1 system.
The cost of a user reﬂects the tradeoff between the start-
up delay and the starvation behaviors (either the starvation
probability or the continuous playback interval). We ﬁrst let
the starvation probability be one of the QoE metrics. Let g(·)
be a strictly increasing but convex function of the expected
start-up delay E[T1]. We denote by C1(x1) the cost of a user
watching the media stream,
C1(x1) = Ps + γg(E(T1)),
(28)
where γ is a positive constant. A large γ represents that the
users are more sensitive to the start-up delay, and a smaller γ
means a higher sensitivity to the starvation. Our purpose is to
ﬁnd the optimal start-up threshold x∗
1 to minimize C1(x1).
The choice of C1(x1) should satisfy three basic principles.
First, it is convex in x1 so that only one optimal threshold
x∗
1 exists. Second, C1(x1) is bounded even if ρ is close to 1.
Otherwise, the conﬁguration of x1 is extremely sensitive to ρ.
Third, though x∗
1 is not required to be a decreasing function
of the arrival rate λ, it cannot grow unbounded when λ is
large enough. In what follows, we simply let g(E(T1)) :=
(E(T1))2 =
  x1
λ
2.
1Because the starvation probabilities P (1)
s
, P (2)
s
and P (3)
s
take complicated
forms, we will compare their dependency on x1 numerically in section
VII. Both Pareto and Log-normal distributions have two parameters. In the
comparison, we ﬁx one of them, and solve the other according to the property
of identical expectations.

---

## Page 7

We apply our models to optimize QoE in three scenarios:
i) ﬁnite media streaming, ii) everlasting media streaming and
iii) ﬁle level. The scenarios i) and ii) are designed for a single
stream, while iii) is designed for a large number of streams.
When the streaming ﬁle has a ﬁnite size, the congested
bottlenecks such as the 3G base station or the wiﬁaccess point
can conﬁgure or suggest a start-up threshold before the media
stream is played. If the steaming ﬁle is large enough (e.g.
realtime sport channel), a user can measure the arrival/service
processes, and then conﬁgure the rebuffering delay locally.
In the third scenario, the media server can set up one start-
up threshold for all the streams that it distributes. To avoid
malfunctions in realistic scenarios, a user can conﬁgure lower
and upper bounds for the start-up delay. Once the upper bound
is reached, the media player starts to play regardless of the
prefetching threshold.
A. Finite Media Size
We hereby consider the adaptive buffering technique for a
stream with ﬁnite size. The eq.(1) and eq.(28) yield
C1(x1) =
N−1
X
k=x1
x1
2k −x1
2k −x1
k −x1

pk−x1(1 −p)k + γ(x1
λ )2.
The starvation probability decreases and the start-up delay
increases strictly as x1 grows. In the QoE optimization of
ﬁnite media size, there does not exist a simple expression of
the optimal threshold x∗

1. To ﬁnd x∗
1 numerically, we need
to compare the costs using the binary search method. The
complexity order is low if the binomial distribution in eq.(1)
is replaced by the Gaussian distribution. If a user can tolerate
up to 1 starvations, Ps will be replaced by the probability
(Ps(0) + Ps(1)) according to eq.(4).
B. Inﬁnite Media Size
We revisit the user perceived streaming quality in two
scenarios: 1) ρ ≥1 and 2) ρ < 1.
Case 1: ρ ≥1. The starvation probability converges to a ﬁxed
value when the ﬁle size approaches inﬁnity. We adopt the same
QoE metric as that of the ﬁnite media size. Note that Ps can be
directly replaced by its asymptotic value in eq.(8). Submitting
Ps to C1(x1), we have the following cost function
C1(x1) = exp
 x1(1 −2p)
2pq


+ γ(x1
λ )2.
Letting the derivative dC1
dx1 be 0, we obtain
x1 · exp
 x1(2p −1)
2pq

= (2p −1)λ2
4γpq
.
The optimal threshold x∗
1 is solved by
x∗
1 = LambertW
 ((2p −1)λ
2pq
)2 · 1
2γ

·
2pq
2p −1,
(29)
where LambertW(·) is the Lambert W-function.
Case 2: ρ < 1. When ρ < 1, Ps is 1 for an inﬁnite media size.
If we adopt the QoE metric C1 directly, the optimal start-up
delay is always 0. This requires a new QoE metric for the
case ρ < 1. Since the starvation happens many times, the
continuous playback interval can serve as a measure of users’
satisfaction. We denote by C2(x1) the cost function for an
inﬁnite media size with ρ < 1,
C2(x1) := exp(−
δx1
λ(1 −ρ)) + γ(x1
λ )2,
where δ is a user deﬁned weighting factor to the expected
playback duration. We differentiate C2(x1) over x1, and let
the derivative be 0, then the optimal start-up threshold is
x∗
1 = LambertW
 δ2
2γ(1 −ρ)2

· λ(1 −ρ)
δ
.
(30)
C. Optimal QoE in the File Level
Unlike the above QoE optimizations, the threshold x1 for
many ﬁles is conﬁgured by the media server, instead of the
users. The objective is still to balance the tradeoff between
the start-up delay and the starvation probability. Here, only
the exponentially distributed ﬁle size is considered. We choose
the cost function C1(x1) that yields C1(x1) = exp(−θx1µ
µ−λ ) +
γ
  x1
λ
2. The optimal threshold x∗
1 can be easily found as
x∗
1 = LambertW
 ( θµλ
µ −λ)2 · 1
2γ

· µ −λ
µθ
.
(31)
VII. NUMERICAL EXAMPLES
A. Starvation of M/M/1 Queue
This set of experiments compare the probability of starva-
tions with the event driven simulations using MATLAB. We
simulate up to 5000 samples of the M/M/1 queue with arrivals
from ﬁles of different sizes. We deliberately consider four
combinations of parameters: ρ = 0.95 or 1.1, and x1 = 20
or 40 pkts. The departure rate µ is normalized as 1 if not
mentioned explicitly. The choice of the start-up thresholds
coincides with the playout of audio or video streaming services
in roughly a couple of seconds (e.g. 200∼400kbps playback
rate on average given the packet size of 1460 bytes in TCP).
The ﬁle size in the experiments ranges between 40 and 1000 in
terms of packets. Figure 2 displays the probability of 0,1, and
2 starvations with parameters ρ = 0.95 and x1 = 20. When the
ﬁle size grows, the probability of no starvation decreases. We
observe that the probabilities of 1 and 2 starvations increase
ﬁrst, and then decline after reaching the maximum values. The
reason lies in that the trafﬁc intensity ρ is less than 1. Figure
2 also shows that our analytical results match the simulation
well. Figure 3 exhibits the similar results when the start-up
threshold is 40 pkts. The comparison between ﬁgure 2 and
3 manifests that a larger x1 is very effective in reducing
starvation probability.
Figure 4 plots the probability of no starvation with the
trafﬁc intensity ρ = 1.1. The probability of no starvation is
improved by more than 10% (e.g. N ≥300) when x1 increases
from 20 to 40. Figure 4 also validates the asymptotic proba-
bility of no starvation obtained from Gaussian and Riemann
integral approximations etc. Figure 5 plots the probability
of one starvation with the same parameters. Recall that the
probability of one starvation decreases to 0 as N increases in
the case ρ = 0.95. While ﬁgure 5 exhibits a different trend
along with the increase of ﬁle size. This probability becomes
saturated, instead of decreasing to 0. When ρ is greater than
1, the probability of having a particular number of starvations

---

## Page 8

approaches a constant. In both ﬁgure 4 and 5, simulation
results validate the correctness of our analysis. Hence, in the
following experiments, we only illustrate the analytical results.
B. Starvation in the File Level
This set of numerical experiments show the relationship
between the starvation probability and the distribution of ﬁle
size. The trafﬁc intensity ρ is set to 0.95. Let θ be 1/2000
in the exponential distribution. Then, the average ﬁle size is
2000 pkts. For the Pareto distribution, we set the minimum
ﬁle size to be 300 pkts so that the exponent υ is 1.1765. The
parameters̺
and σ of the Log-normal distribution are set to
5.0 and 2.2807. We plot the CDF curves of the ﬁle size and
the starvation probabilities in ﬁgure 6. The left-side subﬁgure
illustrates the distribution of ﬁle size with the parameters
conﬁgured above. The Pareto and the Log-normal distributions
exhibit heave-tail property. In the right-side subﬁgure, we plot
the starvation probability of different ﬁle distributions when
x1 increases from 10 to 150. The starvation probability of
the Pareto distribution is very high with small x1. This is
because the ﬁles have a minimum size (i.e. Np < Nm).
The log-normal distribution demonstrates a small starvation
probability. In addition, increasing the threshold x1 does not
having a signiﬁcant impact on the starvation probability when
x1 is greater than 90. Therefore, as the take-home message of
ﬂuid analysis, the conﬁguration of x1 relies on the distribution
of ﬁle size to a great extent. To obtain a better QoE, the media
servers can set different x1 for different classes of media ﬁles.
C. QoE Optimization in the File Level
We investigate the cost minimization problem at the media
server side numerically. Let µ := 25 which means that 25
packets are served per second. Given the packet size of 1460
bytes, this service rate is equivalent to 292Kbps (without
considering protocol overheads). Let the mean ﬁle size 1/θ be
1000 and 2000 packets respectively (equivalent to the playback
time of 40 and 80 seconds). The sensitivity γ is set to 0.01
or 0.005. Figure 7 illustrates the choice of the optimal start-
up thresholds when λ increases from 20 to 25 (i.e. ρ ≤1).
We evaluate four combinations of θ and γ numerically. Our
observations are summarized as follows. First, for the same ﬁle
size distribution, a smaller γ causes a higher optimal start-up
threshold. Second, x∗
1 is not a strictly decreasing function of
λ. When λ is small (e.g. 20pkts/s), a large start-up threshold
does not help much in reducing the starvation probability, but
causes impatience of users of waiting the end of prefetching.
If λ increases, the adverse impact of setting a larger x1 on the
start-up delay can be compensated by the gain in the reduction
of starvation probability. Third, with the same sensitivity γ, the
optimal x∗
1 of a long video stream can be smaller than that
of a short one in some situations. This is caused by the fact
that the large threshold might not signiﬁcantly improve the
starvation probability for a ﬁle of large size.
VIII. CONCLUSION, DISCUSSION AND FUTURE WORK
We have conducted an exact analysis of the starvation
behavior in Markovian queues with a ﬁnite number of packet
arrivals. We perform a packet level analysis and a ﬂuid
level analysis. The packet level study is carried out via two
approaches, the Ballot theorem and the recursive equations.
Both of them have pros and cons; the former providing an
explicit expression, but with high complexity order in general,
while the latter is more computationally efﬁcient, but without
an explicit result. In order to analyze the behavior from a
media service provider’s point of view, we perform a ﬂuid level
analysis that computes the probability of starvation among
many ﬁles. We further apply the theoretical results to perform
QoE optimization for media streaming services. Our work
can be extended to study the QoE metrics in a more general
network with multiple bottlenecks between the server and the
user. In this situation, the arrival process can be modeled as a
phase-type renewal process.
In terms of future works, we aim at extending the analytical
methods to perform QoE optimization in adaptive streaming
services. Another important extension is the starvation analysis
in a wireless environment where the wireless link is shared by
multiple connections. In such a case, the arrival rate to a user
is time varying due to the arrivals and departures of other calls.
Acknowledgements: The work of the authors from INRIA
and from Univ of Avignon was supported by a contract with
Orange Lab, Issy Les Moulineaux.
REFERENCES
[1] L. Takacs, “Ballot problems”, Prob. Theory Related Fields, Vol. 1, No.2,
pp:154-158, 1962.
[2] F. Baccelli and W.A. Massey, “A Sample Path Analysis of the M/M/1
Queue”, Journal of Applied Probability, Vol.26, No.2, pp:418-422, 1989.
[3] W. Ledermann and G. Reuter, “Spectral Theory for the Differential
Equations of Simple Birth and Death Processes”, Phi. Trans. Roy. Soc.
London, Vol.246, No.914, pp:321-369, 1954.
[4] L. Liu and D.H. Shi, “Busy period in GI(X)/G/∞”, J. Appl. Prob., Vol.33,
pp:815-829, 1996.
[5] Hao Luan, Lin X. Cai, and Xuemin (Sherman) Shen, “Impact of net-
work dynamics on users’ video quality: analytical framework and QoS
provision” IEEE Trans. on Multimedia, Vol.12, No.1, pp:64-78, 2010.
[6] G. Liang and B. Liang, “Effect of delay and buffering on jitter-free
streaming over random VBR channels”, IEEE Trans. on Multimedia,
Vol.10, No.6 pp:1128-1141, 2008.
[7] A. ParandehGheibi, M. Medard, A. Ozdaglar, S. Shakkottai, “Avoiding
Interruptions a QoE Reliability Function for Streaming Media Applica-
tions”, IEEE Journal on Selected Area in Communications, Vol.29, No.5,
pp:1064-1074, 2011.
[8] A. Papoulis, “Probability, Random Variables and Stochastic Processes”,
McGraw-Hill Publisher, pp:360-361, 1984.
[9] I. Citon, A. Khamisy, and M. Sidi, “Analysis of packet loss processes in
high-speed networks”, IEEE Trans. Info. Theory, Vol.39, No.1, 1993.
[10] E. Altman, A. Jean-Marie, “Loss probabilities for messages with redun-
dant packets feeding a ﬁnite buffer”, IEEE J. Sel. Area. Comm., Vo.16,
No.5, pp:778-787, 1998.
[11] E. Altman, A. Jean-Marie, “The distribution of delays of dispersed
messages in an M/M/1 queue”, Proc. IEEE Infocom, Boston, 1995.
[12] P. Dubea, O. Ait-Hellal, E. Altman, “On loss probabilities in presence
of redundant packets with random drop”, Elsevier Perf. Eval., Vol.53,
pp:147-167, 2003.
[13] P. Humblet, A. Bhargava, M.G. Hluchyj, “Ballot theorems applied to
the transient analysis of nD/D/1 queues”, IEEE Trans. Networking, Vol.1,
No.1, pp:81-95, 1993.
[14] O. Gurewitz, M. Sidi, I. Cidon, “The Ballot Theorem Strikes Again:
Packet Loss Process Distribution ”, IEEE Trans. Info. Theory, Vol.46,
No.7, 2000.
[15] T. Stockhammer, H. Jenkac, and G. Kuhn, “Streaming video over
variable bit-rate wireless channels,” IEEE Trans. Multimedia, Vol.6, No.2,
pp:268-277, 2002.
[16] J.F. He and K. Sohraby, “New Analysis Framework for Discrete Time
Queueing Systems with General Stochastic Sources”, Proc. of IEEE
Infocom 2001, pp:1075-1084, Anchorage, 2001.

---

## Page 9

0
200
400
600
800
1000
0
0.1
0.2
0.3
0.4
0.5
0.6
0.7
0.8
0.9
1
File Size (pkt)
Probability
Parameters: ρ = 0.95, x1 = 20
0 starv. − model
0 starv. − simu
1 starv. − model
1 starv. − simu
2 starv. − model
2 starv. − simu
Fig. 2.
Probability of 0, 1, and 2 starvations
with ρ = 0.95 and x1 = 20
0
200
400
600
800
1000
0
0.1
0.2
0.3
0.4
0.5
0.6
0.7
0.8
0.9
1
File Size (pkt)
Probability
Parameters: ρ = 0.95, x1 = 40
0 starv. − model
0 starv. − simu
1 starv. − model
1 starv. − simu
2 starv. − model
2 starv. − simu
Fig. 3.
Probability of 0, 1, and 2 starvations
with ρ = 0.95 and x1 = 40
0
200
400
600
800
1000
0.84
0.86
0.88
0.9
0.92
0.94
0.96
0.98
1
File Size (pkt)
Probability
Zero starvations with parameters: ρ = 1.1, x1 = 20 and 40
x1 = 20 − model
x1 = 20 − simu
x1 = 20 − Asympt.
x1 = 40 − model
x1 = 40 − simu
x1 = 40 − Asympt.
Fig. 4.
Probability of no starvation with ρ =
1.1: x1 = 20 and x1 = 40
0
200
400
600
800
1000
0
0.02
0.04
0.06
0.08
0.1
0.12
0.14
File Size (pkt)
Probability
One starvations with parameters: ρ = 1.1, x1 = 20 and 40
x1 = 20 − model
x1 = 20 − simu
x1 = 40 − model
x1 = 40 − simu
Fig. 5.
Probability of one starvation with ρ =
1.1: x1 = 20 and x1 = 40
0
2000 4000 6000 8000
0
0.2
0.4
0.6
0.8
1
File Size (pkts)
CDF
50
100
150
0
0.2
0.4
0.6
0.8
1
Threshold (x1)
Prob. of starvation
Exponential
Pareto
Log−normal
Exponential
Pareto
Log−normal
Fig. 6.
Fluid analysis: prob. of starvation
versus the threshold x1
20
21
22
23
24
25
20
40
60
80
100
120
140
Arrival rate (pkts)
Optimal start−up threshold (pkts)
Optimal Setting of Start−up Thresholds
1/θ=1000; γ=0.01
1/θ=1000; γ=0.005
1/θ=2000; γ=0.01
1/θ=2000; γ=0.005
Fig. 7.
Optimal threshold x∗
1 for QoE enhancement at the
ﬁle level: µ = 25 pkts/s
[17] A.Y. Privalova and K. Sohraby, “Playout in Slotted CBR Networks:
Single and Multiple Nodes”, Problems of Information Transmission,
Vol.43, No.2, pp:143-166, 2007.
[18] <http://techcrunch.com/2010/11/19/web-video-37-percent-internet-trafﬁc/>
[19] X. Cheng, C. Dale, J.C. Liu, “Statistics and Social Network of YouTube
Videos”, Proc. of IEEE IWQoS, pp:229-238, Enschede, 2008
[20] S. Alcock, R. Nelson, “Application ﬂow control in YouTube video
streams”, ACM Comp. Commun. Review, Vol.41, No.2, pp:25-30, 2011.
[21] Y.D. Xu, X.X. Wu, J.C.S. Lui, “Cross-Layer Qos Scheduling for Layered
Multicast Streaming in OFDMA Wireless Networks”, Wireless Pers.
Commun., Vol.51, No.3, pp:565-591, 2009.
[22] Y.D. Xu, E. Altman, et al., “Probabilistic Analysis of Buffer Starvation
in Markovian Queues”, Technical report <http://arxiv.org/abs/1108.0187>
APPENDIX
A. Complexity Analysis of (6)
We focus on the cases with more than two starvations (j ≥
2). Recall that PSl satisﬁes i) an upper triangle matrix, ii)
ﬁrst lx1 −1 rows being 0, iii) last x1 rows being 0 and iv)
PSl(kl, kl+1) = PSl(kl +1, kl+1+1) if they are not zero. For
ease of understanding, we only give an example with N = 8
and j = 3. The method can be extended to any N and j.
Given the above parameters, there have
PS1 =


0
0
0
0
0
0
0
0
0
0
0
a1
a2
a3
a4
a5
0
0
0
0
a1
a2
a3
a4
0
0
0
0
0
a1
a2
a3
0
0
0
0
0
0
a1
a2
0
0
0
0
0
0
0
a1
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0


and
PS2 =


0
0
0
0
0
0
0
0
0
0
0
0
0
b1
b2
b3
0
0
0
0
0
0
b1
b2
0
0
0
0
0
0
0
b1
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0


where ai, bi are the variables to denote the probabilities in a
simple way.
In order to obtain the probability of having 3 starvations,
we need to compute PS1 × PS2 ﬁrst, PS1 × PS2 =


0
0
0
0
0
0
0
0
0
0
0
0
0
a1b1
a1b2+a2b1
P3
k=1 akb4−k
0
0
0
0
0
0
a1b1
a1b2+a2b1
0
0
0
0
0
0
0
a1b1
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0


.
Here, it is observed that the third row is obtained if we shift
the second row to the right by 1 digit. Thus, we only need
to multiply the second row of PS1 with the matrix PS2. The
product is also an upper triangle matrix, where the elements
exhibit the same structure as those of PS2. The complexity
order is thus upper bounded by O(N 2). Given that there are
j(> 2) starvations, the complexity order of matrix product
is O(N 2(j−2)). Combined with the products of PE, the total
complexity has the order O(N 2j−2).
