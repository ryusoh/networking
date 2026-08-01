# ch02-preface

---

## Page 1

Preface
This volume contains the papers presented at the 16th workshop on Job Schedul-
ing Strategies for Parallel Processing (JSSPP) that was held in Shanghai, China,
on May 25, 2012, in conjunction with the IEEE International Parallel Processing
Symposium 2012.
This year 24 papers were submitted to the workshop. All submitted papers
went through a complete review process, with the full version being read and
evaluated by an average of four reviewers. We would like to especially thank
the Program Committee members and additional referees for their willingness
to participate in this eﬀort and their detailed, constructive reviews.
This workship saw the crystallization of a trend in the parallel scheduling
landscape. In addition to papers discussing traditional JSSPP topics like parallel
batch scheduling, workload analysis and modeling, and resource management
system software studies, Web scheduling emerged as a new topic this year. This
volume includes a paper summarizing Walfredo Cirne’s keynote on Web-scale
scheduling at Google. This paper provides a high-level overview of Web-scale
scheduling workloads, as well as an approach that Google uses to meet service
availability SLAs. The paper represents an early example of a broad class of
scheduling problems impacting so-called “web scale” service providers.
In addition to this topic, scheduling issues were discussed in a broader con-
text in more established areas, from hardware scheduling, to scheduling within
budget constraints, scheduling for performance, and analysis of scheduling tasks
within resource management software. Adopting a broader basis for scheduling
discussions was an explicit goal this year for the workshop, and will be continued
in future workshops.
A major goal of the JSSPP workshop is to explore new applications of
scheduling approaches to novel scenarios. Many of papers presented this year
attacked new schedule ﬁtness metrics. In presenting their DEMB system, Lee et
al. developed approaches to partition query parameter spaces in order to improve
query locality in a distributed pool of servers. Wu et al. presented the Critical
Path-base Priority Scheduling (CPPS) algorithm that improves end-to-end per-
formance for DAG scheduling. Tian et al. demonstrated a series of algorithms
that improve makespan of jobs on chip multiprocessors (CMPs).
In a more traditional parallel job scheduling vein, Klus´aˇcek et al. oﬀered a
detailed analysis of the fairness impact of a variety of popular scheduling algo-
rithms. On the basis of this assessment, they have built an extension to con-
servative backﬁlling, using Tabu search, that performs explicit optimization for
fairness as a part of the backﬁlling process. This approach represents an interest-
ing addition of optimization into an often rigid phase of the scheduling process.
Krakov et al. performed a high-resolution analysis of workload data, including
the use of not only job workloads, but also the actual schedule on the system

---

## Page 2

VI
Preface
as well. This comparison shows several discrepancies between these schedules
and the results of simulation with commonly used scheduling algorithms. This
ﬁnding suggests that simulation results may not be quite as comparable to real
system performance as previously assumed. Zhang et al. analyzed 12 months of
workload data from the Kraken petascale system. Niu et al. tackled the prob-
lem of inaccurate runtime estimates through the application of checkpointing to
aggressive backﬁlling. This approach results in greatly improved system perfor-
mance with low checkpointing overhead. Zakay et al. comprehensively discuss
several alternative approaches to determine user session boundaries in workload
data. This problem is particularly important to supercomputing centers because
user sessions signal modal shifts in user expectations for scheduling.
Two papers analyzed the performance of production-grade resources that
managers often used on extreme scale systems. Georgiou et al. analyzed the per-
formance of the SLURM resource manager using a variant of NERSC’s ESP
toolkit for load testing. This work highlighted the diﬃculties in conducting
benchmarking at large scales, and presented several techniques to project per-
formance using combinations of full-scale testing and emulation. Bresford et al.
discussed improvements to the LoadLeveller resource manager needed to ac-
comodate the Blue Waters system. In order to scale to a system of this size,
resource allocation was reworked to be a hybrid distributed process where node
local resources are allocated at the node level. This approach trades scalabil-
ity for increased communication. This paper also provides a detailed case study
of improving the scalability of a production resource manager, detailing several
performance bottlenecks and respective mitigation strategies.
Over the last few years, it has become clear there is a profound shift oc-
curing in the scheduling landscape. While supercomputer workloads remain a
substantial consumer of scheduling technology, and are driving the ﬁeld in terms
of scheduling heterogenous resources and optimizing end-to-end behavior, it has
become clear that these use cases are not the only ones in need of sophisticated
scheduling approaches. Cloud schedulers that support interactive Web applica-
tions and services now manage larger quantities of resources in aggregate than
traditional supercomputing centers and smaller HPC systems. As scheduling
needs have expanded to include both interactive and hybrid workloads, new
challenges have emerged. Therefore, we strongly believe that research in the
ﬁeld of this workshop will remain interesting and challenging for years to come.
The proceedings of previous workshops are available from Springer as LNCS
volumes 949, 1162, 1291, 1459, 1659, 1911, 2221, 2537, 2862, 3277, 3834, 4376,
4942, 5798, and 6253. Since 1995 these volumes have also been available online.
September 2012
Walfredo Cirne
Narayan Desai
Eitan Frachtenberg
Uwe Schwiegelshohn
