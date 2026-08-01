# ch10-dynamic-kerneldevice-mapping-strategies-for-gpu-assisted-hpc-systems

---

## Page 1

Dynamic Kernel/Device Mapping Strategies
for GPU-Assisted HPC Systems
Jiadong Wu, Weiming Shi, and Bo Hong
School of Electric and Computer Engineering
Georgia Institute of Technology
Atlanta, GA 30332
{jwu65,weimingshi,bohong}@gatech.edu
Abstract. With their high computation throughput and outstanding
performance-per-watt ﬁgures, the graphics processing units (GPU) are
becoming increasingly important for high-performance computing (HPC)
systems. Existing GPU execution environment restricts the GPU usage
to local host node. This is suitable for standalone computer nodes, but
becomes ineﬃcient for HPC systems that consist of a large number of
GPU-assisted nodes. In this paper, a novel framework is proposed to
support dynamic GPU kernel/device mapping strategies for HPC sys-
tems. Adaptive mapping policies are designed to mitigate the impact of
network transfer overhead. The performance of the framework is stud-
ied through extensive simulations. The results show that compared with
existing local-only static mapping method, the proposed framework is
capable of improving the system-wide GPU utilization rate and com-
putation throughput, especially when the concurrent workloads exhibit
diﬀerent GPU usage intensities.
1
Introduction
The last two decades witnessed the evolution of graphics processing units (GPUs)
from the graphics accelerators to the coprocessors that are becoming increas-
ingly important for high-performance computing (HPC) systems. Thanks to the
rapid advancement in GPU programming frameworks such as CUDA[11] and
OpenCL[7], GPU computing has been successfully deployed for a wide range of
applications in both desktop and HPC settings [12,10]. These applications cover
a wide distribution of GPU usage intensities.
Existing GPU-assisted HPC systems often have a cluster structure where mul-
tiple GPU-assisted compute nodes are interconnected with high speed networks
such as the InﬁniBand. For such emerging GPU clusters, their resource manage-
ment systems often adopt existing scheduling systems such as PBS [13]. These
scheduling systems were originally designed for CPU-only systems, and are aug-
mented to treat GPUs as one more type of resource on the compute nodes. When
these job scheduling systems allocate user processes to the compute nodes, the
execution of each process is controlled by the GPU execution environment of its
host node. The user process is subsequently restricted to utilize the local GPU
devices on the host node.
W. Cirne et al. (Eds.): JSSPP 2012, LNCS 7698, pp. 96–113, 2013.
c
⃝Springer-Verlag Berlin Heidelberg 2013

---

## Page 2

Dynamic Kernel/Device Mapping Strategies for GPU-Assisted HPC Systems
97
The per-node static kernel/device mapping method, while working well for
standalone computer nodes, has signiﬁcant shortcomings in HPC settings. Inef-
ﬁciency would arise when the physical node conﬁguration mismatches the work-
load pattern of the user processes:
1. GPU underutilization would be observed as GPU cards may be idle between
kernels, especially when GPUs are used sporadically. Additionally, algorith-
mic requirements may restrict a host process to utilize only a subset of the
locally available GPUs, thus wasting other GPUs. For example, an HPC
application may be designed to use 2 GPUs on each node but is wastefully
deployed to a 4-GPU-per-node system.
2. GPU oversubscription would be observed as the user processes of compu-
tation intensive applications may launch kernels faster than what the local
GPUs can process. This is especially the case when the application consists of
a large number GPU intensive tasks. With the static kernel/device mapping,
the host processes may be starving for GPUs to process the tasks.
The overall system performance may therefore suﬀer from great performance
degradation if applications with diﬀerent GPU utilization run concurrently in
the system, which will cause some GPUs to be underutilized while others over-
subscribed.
Such static mapping method also aﬀects programmability. With the existing
method, a GPU-accelerated application may be (painfully) hand-optimized for
a particular HPC deployment. But such optimization relies on the static ker-
nel/device mapping and is therefore customized to the hardware conﬁguration
of that HPC system. When porting to a new/upgraded system with diﬀerent
conﬁgurations, those optimizations will become impaired and the code will un-
derperform in the new system.
In this paper, we argue that these ﬂaws of the current GPU-assisted HPC
clusters can be alleviated and that the overall system performance and utiliza-
tion can be improved when running unbalanced mixed workloads if a dynamic
mapping strategies could be established between the GPU devices and the GPU
kernels of the user applications. We present a novel idea of GPU resource man-
agement module (GREMM) that incorporates with existing remote GPU kernel
execution technique and allows dynamic GPU kernel/device mapping. In partic-
ular, our study focuses on the dynamic kernel/device mapping policies that can
proactively assign GPU kernels to remote GPUs that would otherwise be under-
utilized if the communication overhead is lower than the local waiting time. The
main objective of the dynamic mapping framework is to reﬁne the granularity of
resource management and to explore both CPUs and GPUs to bridge the mis-
match between the ﬁxed physical node conﬁgurations and the varied workload
requirement.
We demonstrate the eﬃciency of the proposed strategies by comparing against
native systems (with static local kernel/device mapping). The results show that
the dynamic kernel/device mapping outperforms the existing static execution
environment in terms of the GPU utilization ratio and the computation

---

## Page 3

98
J. Wu, W. Shi, and B. Hong
throughput, especially for unbalanced mixed workloads. We expect the proposed
framework to improve the eﬃciency of GPU-assisted HPC systems.
The rest of the paper is organized as follows. In Section 2, we provide the
background information on our work and survey the related works. In Section 3,
we introduce the dynamic kernel/device mapping framework and categorize its
overheads, which lays down the foundation for our design of mapping strategies.
In Section 4, we present the design of three mapping policies. In Section 5, we
develop discrete event simulation to evaluate the performance. Some concluding
remarks and future work are given in Section 6.
2
Background and Related Works
Existing GPU execution environments such as the Nvidia CUDA framework [11]
assume the user processes to be bound to the local GPUs. A GPU kernel request
is handled by the local GPU driver, which then loads the kernel on a local GPU
device, executes it, and returns the results to the requesting process. As a way
to resolve the scarcity of GPUs in many computer systems, GPU sharing has
attracted intensive research attention. The existing techniques employed in GPU
sharing is brieﬂy summarized as follows.
PBS[13] and Slurm[14] are two widely adopted resource management systems
for HPC systems. They were originally designed for CPU-based systems and
have been upgraded to support GPU-assisted nodes. PBS and Slurm track user
requests and system status, and map user processes to the compute nodes. In
current PBS and Slurm systems, the process/kernel mapping is static, and the
execution of the processes, once mapped, is governed by the compute nodes. For
GPU-accelerated applications, the execution of each process is therefore subject
to existing GPU execution environment on the compute nodes, which restricts
user processes to utilize local GPU devices.
rCUDA [4] is proposed to enable the compute nodes not equipped with local
GPUs to access the remote GPUs hosted on remote compute nodes. It employs
API remoting technique to reroute the GPU calls to a remote GPU-assisted
compute node. With rCUDA, the remote GPUs are statically speciﬁed in a con-
ﬁguration ﬁle on the requesting node. rCUDA works between a pair of designated
nodes, and is particularly useful in a cluster environment where only a few nodes
are equipped with GPUs. In such settings, rCUDA allows other non-GPU nodes
to execute their GPU kernels on the GPU-assisted nodes, but the kernels in
rCUDA-based system remains statically bound to devices, since the users have
to hard-code the remote rCUDA server IP into their application. rCUDA is not
designed to manage GPUs in an GPU-assisted HPC system.
GViM[6] is an API level solution to virtualize GPU systems. GViM is not de-
signed to access remote GPUs since it can only virtualize GPUs on a standalone
computer. Shadowfax[9] is proposed to address the access limit and to support
unmodiﬁed applications in multiple virtual machines in order to share both local
and remote GPUs. Similar to the static designation of remote GPUs in rCUDA,
all virtual GPUs in Shadowfax need to be manually mapped to a physical GPU,

---

## Page 4

Dynamic Kernel/Device Mapping Strategies for GPU-Assisted HPC Systems
99




















		

	


















		

	
!"#













Fig. 1. Illustration of GPU kernel/device mapping models
which is unsuitable for managing GPUs in HPC systems where user application
requests are not known as a priori.
The capability of remote GPU kernel execution is also explored in several
other projects such as SnuCL[8], MGP[1], and gVirtuS [5]. Both SnuCL and
MGP target to improve the programmability of GPU-assisted applications on a
GPU cluster by providing a single system image. gVirtus focuses on providing
a virtualization service which supports the remote GPU sharing. However, to
the best of our knowledge, little research has been done on how to eﬃciently
schedule the remote GPU device accesses in HPC systems.
3
Dynamic Kernel-Device Mapping
A novel HPC system framework is presented to facilitate dynamic kernel/device
mapping strategies, and thereby improving the system-wide GPU resource uti-
lization. The framework is essentially a combination of the existing remote kernel
execution infrastructure and the decision maker of the kernel/device mapping.
3.1
The Framework
As we noted before, the prevailing GPU invocation method is restricted to access
the GPUs on the board of the local compute node only - the kernel calls are
routinely directed to the binding local GPUs as illustrated in Figure 1(A). With
the development of the middleware such as rCUDA[4] and gVirtus[5], the scope
of invocable GPUs is expanded to all the GPUs across the cluster system, as
is illustrated in Figure 1(B). In these existing remote execution infrastructures,
the mapping between the GPU kernel and device is still statically bound. But
the restriction can be removed by extending such existing infrastructures.
While our work mainly focuses on the dynamic kernel-device mapping policy,
it is informative to have an idea on how the framework would be constructed. To
put it into perspective, such a framework can be decomposed into three compo-
nents: (1) the front-end library of user API, (2) the GPU Resource Management
Module (GREMM), and (3) the GPU execution proxy.

---

## Page 5

100
J. Wu, W. Shi, and B. Hong
1. The front-end API library should provide equivalent interface as existing
GPU programming environment such as CUDA or OpenCL, and implement
functionalities that communicate to GREMM. By linking to this library, pro-
grammers can write conventional GPU codes for their applications without
considering how the GPU calls are handled. Once the executable is linked
with this library instead of the stock one, GPU related functions will be
automatically wrapped into task messages and dynamically forwarded to
proper proxy based on GREMM’s decision.
2. The GPU resource management module is the middle layer of our framework
that connects GPU API calls and the execution proxies. As the heart of the
system, the GREMM is responsible for making the kernel mapping decisions.
A variety of policies can be included in our design. Based on a speciﬁc policy,
the modules will work either independently or cooperatively to assign GPU
kernels.
3. The GPU execution proxy is the bottom layer of the dynamic mapping
framework responsible for the host/device memory copying, kernel launch-
ing, and other device control functions. Each proxy controls one local GPU
device and communicates with the local and remote API callers. Guided
by the GREMM, every GPU task message will eventually be served at a
execution proxy.
The described framework constitutes a direct and easy extension of the existing
remote kernel execution infrastructure. More importantly, among all the design
choices, we contend that the decision maker can be put into a separate module,
referred to as GREMM and also illustrated in Figure 1(C), so that not too much
change would be made on the side of remote kernel execution infrastructure to
install various mapping policies.
3.2
Categorization of Overheads
Applications running on existing GPU-assisted HPC systems are subjected to
the overhead of queuing for the statically mapped GPU devices. At the system
level, this overhead is expected to be lowered through balanced allocation of
GPU devices in dynamic mapping framework.
However, remote kernel execution does introduce a new type of overhead:
the network overhead. Network overhead will not incur for the traditional ker-
nel/device mapping method since it only uses local GPUs, but will incur when
the GPU kernel needs to be executed on a remote node. The amount of this
overhead is directly related to the volume of transfered data and network per-
formance. Data intensive workloads will lead to negative performance gains.
But the performance degradation could be avoided if an appropriate policy is
available to track workload data/computation ratio and decide when to activate
remote execution and when to fall back to the local-only method.
We will study the impact of network overhead and also the beneﬁts of reduced
queuing overhead in the following sections.

---

## Page 6

Dynamic Kernel/Device Mapping Strategies for GPU-Assisted HPC Systems
101
4
Dynamic Kernel/Device Mapping Policies
In this section, an abstraction of GPU-assisted HPC clusters is presented, fol-
lowed by the design and evaluation of three mapping policies for the dynamic
kernel/device mapping framework.
4.1
System Abstraction
We consider the following abstraction of GPU-assisted HPC clusters. There are
N homogeneous compute nodes in the system, each conﬁgured with M processor
cores per node and K GPU devices per node. And we assume M ≥K. A user
application consists of multiple processes. Processes from all the applications
are mapped to the compute nodes by a job scheduling system that employs the
following rules: (1) a compute node will not be split among multiple applications,
(2) processes do not migrate once mapped, (3) each compute node receives less
than M processes, and (4) compute nodes receive balanced workload for each
application. Such a job scheduling policy represents the typical practice of many
popular scheduling systems (e.g. PBS).
We assume that each process executes a program code consisting of multiple
iterations, where each iteration consists of a CPU code segment followed by a
GPU code segment – the GPU kernel.
We further assume that the programmer will explicitly copy back any useful
data from GPU after a kernel is ﬁnished, so the GPU context associated with
certain process becomes volatile when its new kernel is not launched on the same
GPU device as before. Discussions on this limitation will be presented in the ﬁnal
section.
4.2
Global Reservation Policy
In Global Reservation (GR) Policy, a FIFO queue is set up for the GPU cluster.
GPU tasks launched by any process will be registered in this queue, which will
later be served by a total number of N × K GPU devices. The actual data
transfer occurs directly between the requesting process and the serving GPU,
and is not transferred via the queue. Theoretically, if an inﬁnite fast network
interconnection is given, the global reservation policy is expected to achieve the
best system-wide GPU utilization.
However, because the GPU device needs to be reserved while data/kernel is
being transferred from a remote node, the eﬃciency of this policy is highly sensi-
tive to the network overhead. For the proposed dynamic kernel/device mapping
to perform well under environments of varied workload, adaptive policies are
then explored.
4.3
Adaptive Greedy Policy
Adaptive Greedy (AG) Policy aims to map the kernel call to the GPU device
that requires the least total waiting time every time a new kernel call is initiated.

---

## Page 7

102
J. Wu, W. Shi, and B. Hong
Denote all the GPUs in the system be G, the set of local GPUs be L. The
number of all GPUs in the system is |G| = NK.
AG examines every GPU device g in the system, estimates the total waiting
time τg if the kernel call is mapped to that GPU. The total waiting time τg is
composed of the queueing delay τq
g and the data transfer delay τd
g .
τg = τq
g + τ d
g
(1)
The queueing delay τq
g is estimated by the number of queued kernel calls on that
GPU device Ng and the average execution time of last k kernel calls on that
GPU device τk
g .
τ q
g = Ng · τ k
g
(2)
The data transfer delay τd
g is zero if g is a local GPU device and is estimated
by the amount of data transferred from the host node to the remote node Dout,
the amount of data transferred back from the remote node to the host node Din
and the outbound (resp. inbound) bandwidth Bout
g
(resp. Bin
g ) if g is a remote
device.
τ d
g =
⎧
⎨
⎩
0
if g ∈L
(3)
Dout
Bout
g
+ Din
Bin
g
if g̸ ∈L
(4)
Bout
g
is estimated by the nominated inter-node bandwidth BW and the number
of out-bound kernel calls on the host node, namely Ol and the number of in-
bound kernel calls on g, namely Ig when the kernel call is to be assigned.
Bout
g
=
BW
maxg∈G−l(Ol, Ig) + 1
(5)
Bin
g
is estimated by the nominated inter-node bandwidth BW and the system-
wide average number of queued kernel calls per node. Notice that Bin
g is diﬀerent
from Bout
g
as the bandwidth may change with the progress of the kernel execu-
tion.
Bin
g =
BW

g∈G−l max(Og, Il)/|G|
(6)
AG chooses the node g∗with the least total waiting time as the candidate node
that the kernel call is to be assigned. The computational complexity of AG is
O(|G|) = O(NK).
g∗= arg min
g∈G τg
(7)
4.4
Adaptive Random Policy
Adaptive Random (AR) Policy is a randomized policy. It tries to construct and
maintain a table which records the probability that a particular GPU device

---

## Page 8

Dynamic Kernel/Device Mapping Strategies for GPU-Assisted HPC Systems
103
should be chosen to serve the kernel call. It assigns the kernel call based on the
probabilities in the maintained table. It resorts to the GPU driver to handle the
contention for the GPU device on a particular node if there is any.
The probability of being chosen is calculated based on a weight table that
is associated with the system-wide GPU availability. In this table, each GPU
device is assigned a weight indicating the relative probability of being chosen.
Denote the nominated inter-node bandwidth be B, the weight of a remote
idle (resp. busy) GPU device be wri (resp. wrb), the weight of a local idle (resp.
busy) GPU device be wli (resp. wlb).
Assume that the inertia towards choosing the busy GPU devices over the
idle ones is characterized by a ‘penalty’ factor α(< 1), and that the preference
towards choosing the local GPU devices over the remote ones is characterized
by a ‘bonus’ factor β(> 1). Hence we have
α = wlb
wli
= wrb
wri
,
(8)
β = wlb
wrb
= wli
wri
.
(9)
Without loss of generality, if we set the wri = 1, then wli = β, wrb = α, wlb = αβ.
The ‘penalty’ factor α can be quantiﬁed by the average execution time of
received kernel calls τk
g and the node conﬁguration of the host node.
α = M
K · 1
τ kg
(10)
The design philosophy of α is that the relative probability ratio of choosing a
busy node over choosing a idle node should be proportional to the relative ratio
of the time ticks that a node is idle, and that the larger the ratio of the number
of GPUs versus the number of CPUs on a host node, the less chance the kernel
calls should be assigned to remote nodes.
The ‘bonus’ factor β can be quantiﬁed by the amount of transferred data
D, the average execution time of received kernel calls τk
g and the number of
nodes in the system N. The design philosophy of β is that the higher the ratio
of the communication time to the computation time, or the higher the data
consumption rate, or the more nodes in the system, the more chance the local
nodes are favored over the remote nodes.
β =

D/B
τ kg

·

 D
τ kg

· N =

 D
τ kg

2
· N
B
(11)
The computational complexity of AR is also O(|G|) = O(NK) while the infor-
mation it needs to keep is less than AG. When a GPU task arrives, GREMM
makes the randomized assignment decisions based on the weights in this table.
More sophisticated mapping policies can be designed, for example, to explore
execution history of the system and to accept users’ hint about the pattern of
their jobs. We leave the exploration of the advanced mapping policies for our fu-
ture work. In this paper, we focus on the beneﬁts of dynamic GPU kernel/device

---

## Page 9

104
J. Wu, W. Shi, and B. Hong
mapping and its eﬀectiveness under diﬀerent workload and system conditions.
Greater performance improvement is expected when more advanced mapping
policies are adopted.
5
Performance Evaluation
In this section we develop a discrete event simulator to simulate the runtime
behavior of large-scale GPU-assisted clusters. The performance of dynamic ker-
nel/device mapping strategies is then veriﬁed through extensive simulations.
It is desirable to evaluate the dynamic kernel/device mapping framework in a
large-scale production GPU-assisted HPC using real benchmark workloads. But
because GPU-based HPC computing is an emerging ﬁeld, there does not exist
well-established workload traces for this type of systems. Available GPU bench-
marks (e.g. RODINIA[2] and SHOC[3]) are designed to stress micro-architectural
features of GPUs, which are unsuitable to describe multiple concurrent work-
loads at the system level for our study. To address this issue, we synthesized our
workload traces, which are designed to be representative of GPU-HPC work-
loads.
5.1
Experimental Setup
The four GPU mapping policies tested are: 1) ST, the static kernel/device map-
ping policy; 2) GR, the global reservation policy; 3) AR, the adaptive random
mapping policy with k = 10; and 4) AG, the adaptive greedy mapping policy
with k = 10. The ST policy, as our baseline, is the conventional policy in GPU
execution environment which shows the GPU utilization of the native system
without remote execution or dynamic mapping. GR, AR, and AG are dynamic
kernel/device mapping policies.
The two major performance metrics evaluated are GPU Utilization Rate and
Mean Waiting Time. GPU Utilization Rate is the ratio of the GPU busy time to
the total GPU time available. This rate directly reﬂects the utilization eﬃciency
of the entire GPU cluster. The Mean Waiting Time measures the average time
that a GPU task spends on data transfer and queuing for GPU devices. It reﬂects
the average overhead for each kernel execution.
5.2
GPU-Assisted Cluster Simulator
The simulated cluster consists of N computing nodes. Each node consists of M
CPU cores, K GPU devices, and a full-duplex network interface card (NIC) with
max bandwidth B. The CPU cores are characterized by the processing capabil-
ities. GPU devices are also characterized by their processing capabilities. The
latency of remote execution API functions is modeled based-on data observed
in previous researches[4,6,9].
The NIC on each node has two independent ports: the inbound port and the
outbound port. A max bandwidth B is enforced on each port. Once any data

---

## Page 10

Dynamic Kernel/Device Mapping Strategies for GPU-Assisted HPC Systems
105
is to be transmitted from one node to another, a connection will be established
from the outbound NIC port of the source to the inbound NIC port of the
sink. Concurrent connections on a single port share the port’s bandwidth evenly.
However, the eﬀective bandwidth of a connection is limited by the busier one
of the two participating ports. So, if any one of the concurrent connections
fails to fully utilize its share, the remaining bandwidth will be utilized by other
concurrent connections. According to this scheme, the system-wide bandwidth
allocation changes when a new connection is established or a current connection
is completed. We adopt this simpliﬁed network model as our focus is on the
impact of network transfer overhead, rather than on how the overheads are
generated. Therefore, the detail characteristics of a typical network such as the
topology and the routing are not taken into account in this work.
Unless explicitly noted later, the cluster in following simulations is conﬁgured
as N = 24, M = 12, K = 3. The bandwidth is set to B = 100KB/ms for GbE
and B = 1000KB/ms for IB. The simulated time span is 10, 000s.
5.3
Generation of Workload Traces
The input to the simulator is the workload trace, which is organized as groups
of consecutive tasks. Each group is associated with one software process. We
characterize a CPU task by the amount of time Tc delayed on the CPU core,
and a GPU task by three parameters: the amount of data Du uploaded to the
GPU device; the amount of execution time Tg on GPU device; and the amount
of data Dd downloaded from the GPU device to host process.
The workload used for the evaluation of the dynamic mapping framework is
generated based on following assumptions:
– Each process executes CPU and GPU tasks alternatively.
– The execution time of CPU and GPU task is random variable of exponential
distribution with parameter λ = 1/Tc, μ = 1/Tg respectively.
– The size of the input and output data sets of a GPU kernel is proportional
to the kernel execution time.
For example, a process P generated with parameters Tg = 2250ms, Du = 10×Tg,
Dd = 0.5 × Du, and Tc = 750ms will have the following characteristics: the
average length of GPU kernel is 2250ms; the average data uploaded to GPU
each time is 22500KB; the average data downloaded from GPU each time is
11250KB; and the average time spent on CPU before next GPU kernel launch
is 750ms.
Since the policies are designed to address unbalanced GPU utilizations of
concurrent GPU workloads in an HPC system. The traces we used are mixed
combinations of a heavy-GPU application and a light-GPU application. We as-
sume that the system runs these two applications with full capacity: there are ni
(assuming ni is a multiple of M
K ) processes in Workload i, and n1 + n2 = N · M.
In such case, the GPUs in the system are subject to the diﬀerent computation

---

## Page 11

106
J. Wu, W. Shi, and B. Hong






	



	



	






  !"

#$

%

%


&

&










	
'







(
""$)
*)+,
Fig. 2. Impact of workload mix
intensity. The beneﬁt of routing a kernel from a stressed node to an idle re-
mote node can potentially overweigh the extra overhead of network transfer.
Our analysis can be extended to scenarios with more applications.
5.4
Workload Mix
Our ﬁrst set of experiments examines a set of mixed workloads. Traces W1 to
W5 are synthesized from two client applications submitted to the cluster. Client
H’s application consists of tasks with heavy GPU usage (with Tc = 750ms,
Tg = 2250ms, Du = 10 × Tg, Dd = 0.5 × Du) and client L’s application consists
of tasks with light GPU usage (with Tc = 2250ms, Tg = 750ms, Du = 10 × Tg,
Dd = 0.5 × Du). The ﬁve traces are synthesized to represent the mix of two
workloads with diﬀerent GPU demands. The process population ratio of H/L is
24/0 in W1, 18/6 in W2, 12/12 in W3, 6/18 in W4, and 0/24 in W5.
The system is simulated with the network bandwidth set to 100KB/ms
(GbE). As shown in the left subplot of Figure 2, the system-wide GPU utilization
rate can be improved by dynamic mapping policies in most of the cases. Since
there are underutilized GPU devices on the nodes, transferring GPU tasks from
heavily occupied local devices to remote idle devices is beneﬁcial. It is worth not-
ing that signiﬁcant improvement can be observed for the adaptive policies even
for such low bandwidth network. This indicates that the dynamic kernel/device
mapping is particularly useful for mixed workloads that have diﬀerent GPU de-
mands. Meanwhile, the mean waiting time is also improved as is shown in the
right subplot of Figure 2.
Figure 3 shows the number of completed GPU kernels under diﬀerent policies
on Traces W1 to W5. Taking W3 as an example, in the simulated time span,
the conventional ST policy ﬁnishes about 12K kernels for client H and about
28K kernels for client L. When the dynamic policies are applied, the overall

---

## Page 12

Dynamic Kernel/Device Mapping Strategies for GPU-Assisted HPC Systems
107























	












!
"#
$
%&'

(

(

(

(

(

)

	)

)

)

)
Fig. 3. Number of completed GPU kernels with diﬀerent policies




	

	

	












 !
"

#"$"%
&'

('&

&'

'

'

)'

'
Fig. 4. Detailed GPU Utilization of the Cluster with static and dynamic policies
system-wide GPU utilization rate is improved. It is also interesting to note that
client L is aﬀected by the other policies, i.e. client L completes less kernels if
remote GPU mapping is allowed. This is because the GPUs previously dedi-
cated to client L are now executing client H’s kernels too. This set of experiment
suggests that if certain client’s application is mission-critical, it is desirable to
exclude other applications from utilizing its GPU devices, even though this will
reduce the GPU utilization rate of the system. We plan to investigate the prior-
itized policy in our future study.
5.5
Load Balance
Figure 4 lists the detailed GPU utilization of the cluster with diﬀerent policies
on the mixed workload trace W4, since W4 is a very good example to demon-
strate the performance improvement of the dynamic kernel/device mapping. The
bandwidth is set to 100KB/ms in this and the following experiments as well.

---

## Page 13

108
J. Wu, W. Shi, and B. Hong







	












 !!
"#








	












 !!
"#



	$


$
%&

'

'
Fig. 5. Impact of GPU utilization intensity
It shows that the utilization with ST is negatively aﬀected by the unbalanced
node utilizations. The GR policy is capable of balancing GPU utilization. The
AR and AG policy outperforms the other policies for this set of experiments.
As mentioned in the background section, techniques such as rCUDA allow a
process to send all its GPU kernels to a statically designated remote node, but
they do not support run-time kernel/device mapping. For fair comparison, we
tested three static schedulers for rCUDA on workload W4: 1/4, 1/2, and 3/4 of
the client H’s GPU kernels were directed to client L’s GPUs. The results show
that when 1/2 of client H’s processes can use rCUDA, the system achieves GPU
utilization rate of 92.5%, which is still worse than the performance of the dynamic
mapping policies. Nevertheless, the results also demonstrate the diﬃculty in
optimizing the performance by the static scheduler of rCUDA: ratios 1/4 and
3/4 are less eﬃcient, ﬁnding the better ratio of 1/2 is non-trivial. Furthermore,
since the rCUDA mapping decision needs to be made before launching user
applications, it is infeasible to use rCUDA for actual HPC applications since
there does not exist a single static mapping policy that will be suitable for all
kinds of workloads.
5.6
Workload Intensity
The impact on the GPU utilization intensity is demonstrated in Figure 5. Two
new groups of workloads (W6-W10 and W11-W15) are used in the experiment.
The generating parameters of these workloads are the same as that of W1 to
W5, except that the (Tc, Tg) of light workload is set to (2625, 325) in W6-W10
and (1815, 1125) in W11-W15. As the results show, the dynamic policies are
signiﬁcantly eﬀective only if enough underutilized GPUs exist. In the lighter
group (W6-W10), up to 26% improvement can be observed, but in the heavier
group (W11-W15) the improvement is limited by the existence of over-utilized
GPUs.

---

## Page 14

Dynamic Kernel/Device Mapping Strategies for GPU-Assisted HPC Systems
109





























 


 



!"
 
!"
 
!"






#
$
%

#
##
#$
#%







&	'	
(
)*+
Fig. 6. Impact of network bandwidth
5.7
Network Overhead and Eﬃcacy of Adaptation
In this experiment, we examine the sensitivity of the policies to the network
bandwidth and the data/computation ratio of the GPU kernels, which are two
key factors that aﬀect the network transfer overheads introduced by the remote
execution of GPU kernels.
Figure 6 shows the system-wide GPU utilization of diﬀerent policies and the
underlying interconnect with varied Du/Tg (data/computation ratio). Here Du
of the workload W4 is sampled exponentially from Du = 1 × Tg to Du =
10000 × Tg. As Du/Tg increases, the overhead of remote-execution increases,
which negatively aﬀects the performance of the dynamic mapping policies (and
especially of the GR policy). This indicates that the amount of transferred data
or the network bandwidth plays an important role in making dynamic mapping
policies eﬀective and eﬃcient. However, thanks to the adaptation mechanism,
the performance of AR and AG can still be as good as ST when the ratio is
extremely high.
The beneﬁt of the adaptation mechanism can be clearly demonstrated with
Figure 7. In this experiment, we explicitly assign several ﬁxed values to α and β,
and compare these ﬁxed-weight random policies to AR. The result reveals that
the ﬁxed-weight may favor either the low data/computation ratio workload or
the high data/computation workload. Only the adaptive-weight in AR can track
the best performance over the entire range of data/computation ratio.
5.8
Scalability
The scalability of the dynamic mapping policies is evaluated in the following two
experiments: scalability with respect to the number of GPUs per node, and with
respect to the number of nodes. Trace W4 is used for the ﬁrst set of experiments.
For the second set of experiments, the four tested traces are half-sized, normal-
sized, double-sized, and quadruple-sized versions of W4. The network bandwidth

---

## Page 15

110
J. Wu, W. Shi, and B. Hong




























 !

 !

 !

 !






"
#
$

"
""
"#
"$







%	&	
'
()*
Fig. 7. Beneﬁt of the adaptation mechanism












	









!"







	







#

#
$%	

$%
	
Fig. 8. Scalability of dynamic mapping policies over static mapping
is set to 100KB/ms. The GR policy is excluded in this experiment due to its
poor performance over lower-bandwidth network.
In the experiments, we observe higher possibility of underutilization by static
mapping when more GPUs are installed in the cluster. In such cases, the necessity
of an eﬃcient GPU resource management policy becomes more signiﬁcant.
The values reported in Figure 8 are the GPU utilization rate margin of the dy-
namic mapping policies over the ST policy. According to the results, both AR and
AG exhibit good scalability over the number of GPUs per node. The AR policy also
exhibits good scalability over the number of nodes. However,the AG policy doesn’t
scale well with the number of nodes. The key reason is that estimating the delay
times in a larger-scalesystem becomes harder and less accurate. The larger amount
of collaborative communication incurred during AG’s decision making process also
impairs its scalability over the number of nodes.

---

## Page 16

Dynamic Kernel/Device Mapping Strategies for GPU-Assisted HPC Systems
111






	

	

	

	

































 
!"##
$ %

Fig. 9. The impact of false positive and false negative ratio on AR
Since both AG and AR rely on certain amount of global information to make
scheduling decisions, their performance could be signiﬁcantly compromised if the
system scales up to thousands of nodes. To accommodate such large systems,
one eﬀective way is to group the nodes into subsets and schedule remote GPU
accesses within each subset. In future research, an alternative policy relying on
distributed information and local estimation will be studied.
5.9
Design Choices for the AR Policy
This set of experiments evaluates the performance of AR policy over certain
design choices. As demonstrated in the previous experiments, AR is a balanced
policy with several distinct advantages. One important choice in the implementa-
tion of this policy is how to maintain the distributed table about the GPU status.
Real-time update is less desirable since it may incur extra network overhead. On
the other hand, if the table is updated less frequently, outdated information may
be used for GPU kernel/device mapping. We deﬁne a case to be false positive if
an idle GPU is identiﬁed as busy, and false negative if a busy GPU is identiﬁed
as idle. We used traces W1 to W5 to evaluate the performance of AR policy over
diﬀerent false positive ratio/false negative ratio. The values reported in Figure 9
are the GPU utilization rate margin of AR over ST. As shown in the ﬁgure, the
performance is more sensitive to the false negative ratio than the false positive
ratio. This implies that the status should be updated as soon as possible when a
certain GPU becomes busy and the update is less urgent when a GPU becomes
idle if the performance of the AR policy is valued.
6
Conclusion and Future Work
To address the performance degradation of GPU-assisted HPC system due to
the mismatch between the physical node conﬁguration and the GPU utilization

---

## Page 17

112
J. Wu, W. Shi, and B. Hong
of mixed workloads, we present the idea of dynamic kernel/device mapping,
which relaxes the static binding between GPU kernels and local GPUs as in
existing systems, and provide a sample design with the functionalities of remote
kernel execution and GPU resource management, based on which the dynamic
GPU allocation policies are further designed to balance the utilization of GPUs.
The beneﬁt and eﬃciency of the strategies is demonstrated through simulation-
based studies, which show that the dynamic mapping strategies outperforms the
existing static kernel/device binding in terms of the GPU utilization and the
mean waiting time for processes to acquire GPUs.
As we noted, communication intensive workload does pose challenges for the
dynamic kernel/device mapping. However, if an advisable adaptive policy is
adopted such as the proposed AR and AG policies, the dynamic mapping strate-
gies will outperform existing methods for suitable workloads, and (eﬀectively)
fall back to the existing method for unsuitable workloads (e.g. communication
intensive or very short kernels, both of which are untypical for GPU-assisted
HPC applications). The dynamic mapping strategies provide the mechanism to
improve GPU utilization for HPC systems when possible.
Additionally, existing GPU supports the concept of context where all the
kernels launched from a user process are able to reuse the data that reside
in GPU’s global memory. Consequently, utilizing the same device for multiple
kernels can save considerable amount of time for data movement. We plan to
explore such context-based locality and design policies to re-utilize a remote GPU
device for consecutive kernel calls from a process in order to reduce the cost of
network transfer. We also plan to study the impact of process synchronization
(e.g. MPI barriers) on the dynamic mapping kernel/device policy.
Acknowledgment. This work is supported by the US National Science Foun-
dation under award number CNS-0845583.
References
1. Barak, A., Ben-Nun, T., Levy, E., Shiloh, A.: A package for opencl based heteroge-
neous computing on clusters with many gpu devices. In: 2010 IEEE International
Conference on Cluster Computing Workshops and Posters (Cluster Workshops),
pp. 1–7 (September 2010)
2. Che, S., Boyer, M., Meng, J., Tarjan, D., Sheaﬀer, J., Lee, S., Skadron, K.: Ro-
dinia: A benchmark suite for heterogeneous computing. In: IEEE International
Symposium on Workload Characterization, IISWC 2009, pp. 44–54. IEEE (2009)
3. Danalis, A., Marin, G., McCurdy, C., Meredith, J., Roth, P., Spaﬀord, K., Tip-
paraju, V., Vetter, J.: The scalable heterogeneous computing (shoc) benchmark
suite. In: Proceedings of the 3rd Workshop on General-Purpose Computation on
Graphics Processing Units, pp. 63–74. ACM (2010)
4. Duato, J., Pena, A., Silla, F., Mayo, R., Quintana-Ort´ı, E.: rcuda: Reducing the
number of gpu-based accelerators in high performance clusters. In: 2010 Interna-
tional Conference on High Performance Computing and Simulation (HPCS), pp.
224–231. IEEE (2010)

---

## Page 18

Dynamic Kernel/Device Mapping Strategies for GPU-Assisted HPC Systems
113
5. Giunta, G., Montella, R., Agrillo, G., Coviello, G.: A GPGPU Transparent Vir-
tualization Component for High Performance Computing Clouds. In: D’Ambra,
P., Guarracino, M., Talia, D. (eds.) Euro-Par 2010, Part I. LNCS, vol. 6271, pp.
379–391. Springer, Heidelberg (2010)
6. Gupta, V., Gavrilovska, A., Schwan, K., Kharche, H., Tolia, N., Talwar, V., Ran-
ganathan, P.: Gvim: Gpu-accelerated virtual machines. In: Proceedings of the 3rd
ACM Workshop on System-level Virtualization for High Performance Computing,
pp. 17–24. ACM (2009)
7. Khronos-Group. Opencl - the open standard for parallel programming of hetero-
geneous systems (2011)
8. Kim, J., Kim, H., Lee, J., Lee, J.: Achieving a single compute device image in opencl
for multiple gpus. In: Proceedings of the 16th ACM Symposium on Principles and
Practice of Parallel Programming, pp. 277–288. ACM (2011)
9. Merritt, A., Gupta, V., Verma, A., Gavrilovska, A., Schwan, K.: Shadowfax: scaling
in heterogeneous cluster systems via gpgpu assemblies. In: Proceedings of the 5th
International Workshop on Virtualization Technologies in Distributed Computing,
pp. 3–10. ACM (2011)
10. Nickolls, J., Dally, W.: The gpu computing era. IEEE Micro. 30(2), 56–69 (2010)
11. Nvidia. Gpu computing sdk (2011)
12. Owens, J., Houston, M., Luebke, D., Green, S., Stone, J., Phillips, J.: Gpu com-
puting. Proceedings of the IEEE 96(5), 879–899 (2008)
13. PBS-Works. Scheduling jobs onto nvidia tesla gpu computing processors using pbs
professional (2011)
14. Troﬁnoﬀ, S.: Scheduling gpus with slurm (2011)
