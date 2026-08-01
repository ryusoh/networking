# cs234-03 - Part 02 (Pages 18-33)

---

## Page 18

Agenda
´What is Cloud
´Cloud Service Models
´Deployments
´Advantages
´Challenges and Potential
Solutions
18

---

## Page 19

Four Deployment Models
´ Public cloud (off-site and remote): resources are
dynamically provisioned on an on-demand, self-service
basis over the Internet, via web applications/web services,
open API,  from a third-party provider who bills on a utility
computing basis.
´ Private cloud: corporations discover the benefits of
consolidating shared services on virtualized hardware
deployed from a primary datacenter to serve local and
remote users
´ Hybrid cloud: some computing resources are on-site (on
premise) and some are off-site (public cloud). To leverage
cloud solutions that are too costly to maintain on-premise,
like disaster recovery, backups and test environments
´ Community cloud: several organizations/corporations with
similar requirements share common infrastructure.
Somewhere between public and private cloud
19

---

## Page 20

Virtualization
´ Virtual workspaces
´ An execution environment that can be made dynamically
available
´ Resource quota (e.g. CPU, memory)
´ Software configuration (e.g. O/S, provided services)
´ Implement on Virtual Machines (VMs):
´ Abstraction of a physical host machine (a.k.a. bare metal)
´ Hypervisor intercepts and emulates instructions from VMs, and
allows management of VMs,
´ VMWare, VirtualBox, Xen, etc.
´ Provide infrastructure API:
´ Plug-ins to hardware/support structures
20
Hardware
OS
App
App
App
Hypervisor
OS
OS
Virtualized Stack
Three VMs

---

## Page 21

Virtual Machines
21
´ multiple virtual machines on a physical machine
´ emulation
´ full virtualization
´ para-virtualization
Hardware
Virtual Machine Monitor (VMM) / Hypervisor
Guest OS
(Linux)
Guest OS
(NetBSD)
Guest OS
(Windows)
VM
VM
VM
App
App
App
App
App
Xen
VMWare
UML
Denali
etc.
Para-virtualization (e.g., Xen) is very close to raw physical performance!

---

## Page 22

Benefits of Virtualization
´ Easier to create new machines, backup machines,
etc., ß running environment, e.g., for our
programming asignments
´ Easier migration
´ more machines than the physical ones ß running
experiments
´ Timeshare lightly loaded systems on one host
´ suspend and resume VMs ß debugging and
troubleshooting
´ Run operating systems where the physical hardware
is unavailable ß emulation
´ Run legacy systems ß Mupen64Plus (N64), DeSmuME
(DS)
22

---

## Page 23

Sample IaaS Service
´ Amazon Elastic Compute Cloud (EC2):
´ Elastic, marshal 1 to 100+ PCs
´ Machine Specs to meet your needs
´ Fairly cheap, if your jobs are not resource hungry
´ Powered by Xen
´ Different from VMware as uses “para-virtualization”
where the guest OS is modified to use special hyper-
calls
´ Hardware accelerated virtualization by Intel (VT-
x/Vanderpool) and AMD (AMD-V)
´ Supports “Live Migration” of a virtual machine between
hosts.
´ Linux, Windows, and OpenSolaris
´ Management Console
23
Load image to S3
Boot your image
Open up ports
SSH into your image
Run your binaries

---

## Page 24

Agenda
´What is Cloud
´Cloud Service Models
´Deployments
´Advantages
´Challenges and Potential
Solutions
24

---

## Page 25

Advantage of Cloud
Computing (1/2)
´ Lower computer costs
´ No more dedicated powerful and expensive
workstations that are seldom used
´ Desktop PCs can be lighter-weight since software runs
in the cloud
´ Improved performance
´ Can request for more powerful cloud server on-
demand
´ Your PCs may run faster due to lower load
´ Universal availability (to, but not limited to, documents)
´ Any client device will work
´ Higher reliability
´ Both data and hardware
25

---

## Page 26

Advantage of Cloud
Computing (2/2)
´ Reduced software costs
´ Most cloud applications, like Google Doc Suite, is free ß
But is it really free?
´ Some commercial software may be installed on a
shared cloud server
´ No more foreground software update if it runs in the cloud
´ Large storage space
´ Some cloud storage service providers offer (virtually)
unlimited storage space
´ Cloud storage automatically cache files on your local
harddisks
´ Implicit version control
´ Easier for collaborations over the Internet
26

---

## Page 27

Agenda
´What is Cloud
´Cloud Service Models
´Deployments
´Advantages
´Challenges and Potential
Solutions
27

---

## Page 28

Need a Constant Internet
Access
´ Limitation: Pure cloud computing requires always-on Internet
access
´ Solution approach: keep temporal states on clients
´ cloud storage systems (like dropbox) sync with the cloud server
whenever Internet access is available
´ Waze leverage cached maps to provide directions even when
the Internet is temporarily out
´ Solution approach: edge clouds or cloudlets may be
leveraged when Internet connectivity is unavailable
´ Even more general, an dynamically deployed VMs to
computing devices in proximality
´ Typically need a middleware-based solution, instead of
reinventing the wheel all the time
´ Other thoughts?
28

---

## Page 29

Can Be Slow
´ Limitation: Too many factors may cause slow
responsiveness of cloud applications
´ Insufficient reserved resources, busy cloud server (e.g.,
when backing up the data), long network latency, and
insufficient network bandwidth ß determining the root
cause itself is a research problem
´ Solution approach: Through modeling (cloud)
application resource consumption under different
quality target, we may better choose the optimal
resource levels to reserve
´ Solution approach: Find closer data center server or
(better) the data center with less-congested networks
´ Solution approach: Compress data (lossless or lossy) or
feature extraction before transmitting data
´ Any other thoughts?
29

---

## Page 30

Data Security
´ Limitation: Once the data are stored in the cloud,
unauthorized users may gain access to your confidential
data
´ Solution approach: Save only parts of data on a cloud
server provider
´ Solution approach: Encrypt/decrypt your data on your PC
ß but then the PC workload is increased
´ Solution approach: Variants of partial encryption
offloading to an edge or cloud servers have also been
proposed
´ Even with encrypted data, many inference can and have
been done based on traffic statistics (without looking into
the payload)
´ Other thoughts?
30

---

## Page 31

Segmented Cloud Service
Providers
´ Limitation: Each cloud systems uses different
protocols and different APIs à may not be possible
to run the same application on different cloud
based systems
´ Solution approach: Open-source projects, such as
Open Stack, could be used to build private cloud
´ Then migrate to
public clouds
´ Solution approach:
Broker based
federated clouds
´ Other thoughts?
31
Source: A Decentralized Approach For The Management Of Federated Cloud Environments

---

## Page 32

Energy Consumption
´ Limitation: Data centers become the major source of high
electricity demands ß Cooling is an issue if we put too many
computers together
´ Solution approach: Better data center design to cool the
computers downß several fun papers from Google to read
´ Solution approach: Better job scheduling? For example, more
balanced workload would reduce
the extreme temperature at some
data centers
´ Solution approach: Crowdsourcing
computing, storage, and networking
resources of otherwise idling PCs to
reduce the loads on data centers ß
would it be really more energy
efficient?
´ Other thoughts?
32
[Source] Andrae, A. & Edler, “On Global Electricity Usage of Communication Technology: Trends to 2030 “ T. Challenges 6, 117–157 (2015)

---

## Page 33

33
Questions
<chsu@cs.nthu.edu.tw>
