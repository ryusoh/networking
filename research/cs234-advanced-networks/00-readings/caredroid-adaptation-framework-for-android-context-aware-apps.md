# p386-elmalaki

---

## Page 1

CAreDroid: Adaptation Framework for Android
Context-Aware Applications
Salma Elmalaki
University of California, Los
Angeles
<selmalaki@ucla.edu>
Lucas Wanner
Department of Informatics and
Statistics, Federal University
of Santa Catarina, Brazil
<lucas@lisha.ufsc.br>
Mani Srivastava
University of California, Los
Angeles
<mbs@ucla.edu>
ABSTRACT
Context-awareness is the ability of software systems to sense
and adapt to their physical environment. Many contempo-
rary mobile applications adapt to changing locations, con-
nectivity states, available computational and energy resources,
and proximity to other users and devices.
Nevertheless,
there is little systematic support for context-awareness in
contemporary mobile operating systems.
Because of this,
application developers must build their own context-awareness
adaptation engines, dealing directly with sensors and pollut-
ing application code with complex adaptation decisions.
In this paper, we introduce CAreDroid, which is a frame-
work that is designed to decouple the application logic from
the complex adaptation decisions in Android context-aware
applications. In this framework, developers are required—
only—to focus on the application logic by providing a list
of methods that are sensitive to certain contexts along with
the permissible operating ranges under those contexts. At
run time, CAreDroid monitors the context of the physical
environment and intercepts calls to sensitive methods, ac-
tivating only the blocks of code that best ﬁt the current
physical context.
CAreDroid is implemented as part of the Android runtime
system. By pushing context monitoring and adaptation into
the runtime system, CAreDroid eases the development of
context-aware applications and increases their eﬃciency. In
particular, case study applications implemented using CAre-
Droid are shown to have: (1) at least half lines of code fewer
and (2) at least 10× more eﬃcient in execution time com-
pared to equivalent context-aware applications that use only
standard Android APIs.
Categories and Subject Descriptors
D.4.7 [OPERATING SYSTEMS]: Organization and De-
sign—Real-time systems and embedded systems
Permission to make digital or hard copies of all or part of this work for personal or
classroom use is granted without fee provided that copies are not made or distributed
for proﬁt or commercial advantage and that copies bear this notice and the full cita-
tion on the ﬁrst page. Copyrights for components of this work owned by others than
ACM must be honored. Abstracting with credit is permitted. To copy otherwise, or re-
publish, to post on servers or to redistribute to lists, requires prior speciﬁc permission
and/or a fee. Request permissions from <Permissions@acm.org>.
MobiCom’15, September 7–11, 2015, Paris, France.
DOI: <http://dx.doi.org/10.1145/2789168.2790108>.
General Terms
Design, Performance
Keywords
Context-aware computing, Android, Context-adaptation
1.
INTRODUCTION
Computation is becoming increasingly coupled with the
physical world. It is now commonplace for mobile applica-
tions and systems to adapt their functionality to user loca-
tion, connectivity status, device orientation, and remaining
battery percentage. This ability for software to sense, re-
act, and adapt to the physical environment has been termed
context-awareness [31].
Context-aware applications typically feature multiple in-
terchangeable methods and sets of parameters, each of which
is activated when the system is under a speciﬁc set of physi-
cal conditions. A music streaming application, for example,
may request lower quality streams from a server when us-
ing a cellular network radio than when using WiFi. Social
network applications may discover and promote interaction
between users in close physical proximity. A video encoding
application may delay or lower the quality of its processing
to save energy when the system is running out of battery.
When implementing context-aware applications, develop-
ers typically must probe sensors, derive a context from sen-
sor information, and design an adaptation engine that ac-
tivates diﬀerent methods for diﬀerent contexts. With ade-
quate support from the runtime system, context monitoring
could be performed eﬃciently in the background and adap-
tation could happen automatically [27]. Application devel-
opers would then only be required to implement methods
tailored to diﬀerent contexts. Just as ﬁle and socket abstrac-
tions help applications handle traditional input, output, and
communication; a context-aware runtime system could help
applications adapt according to user behavior and physical
context.
In this paper we introduce CAreDroid, a framework for
Android that makes context-aware applications easier to de-
velop and more eﬃcient by decoupling functionality, map-
ping, and monitoring and by integrating context adaptation
into the runtime. In CAreDroid, context-aware methods are
deﬁned in application source code, the mapping of meth-
ods to context is deﬁned in conﬁguration ﬁles, and context-
monitoring, and method replacement are performed by the
runtime system.
386
© 2015 ACM. ISBN 978-1-4503-3619-2/15/09…$15.00.

---

## Page 2

Because applications using CAreDroid do not need to mon-
itor and handle changes in context directly, they can be
written using signiﬁcantly fewer lines of code than would
be required if only using the standard Android APIs. Be-
cause CAreDroid introduces context-monitoring at the sys-
tem level, it can avoid the indirection overhead of read-
ing sensor data in the application layer, therefore making
context-aware applications more eﬃcient.
To allow for transparent switching between polymorphic
implementations—which are alternative implementations of
the same method that either provide same functionality with
diﬀerent performances or provide alternative functionality
for the same method—the CAreDroid framework is inte-
grated as part of the Dalvik Virtual Machine (DVM). In par-
ticular, at runtime, CAreDroid intercepts the various sensor
ﬂows in order to determine the current context of the phone
(where context parameters include energy, network connec-
tivity, location, and user activity). CAreDroid uses this in-
formation along with the provided per-application conﬁg-
uration in order to dynamically and transparently trigger
adaptations and to ﬁnd the set of methods that, at any
point in time, better suit the device’s context.
1.1
Related Work
A context-aware system requires three major elements:
(1) a set of mutually replaceable polymorphic methods, (2) a
context monitoring system, and (3) an adaptation engine
that switches between diﬀerent methods based on the mon-
itored context.
We divide the related work based on the
three elements mentioned above.
1.1.1
Developing Context-Dependent Behavior
We can identify three main strategies in developing the
context-dependent behaviors as follows.
Code partitioning: Code partitioning for remote exe-
cution is based on the idea of cyber-foraging
[30] where
mobile devices oﬄoad some of the work to a remote ma-
chine with more resources like a server [23]. The server can
then execute the heavy work on behalf of the mobile de-
vices that have scarce energy. The idea of cyber foraging
has been addressed in previous work with diﬀerent aspects.
Both Spectra and Chroma [16, 9] do program partitioning
and run part of the code on a surrogate server. They both
rely on an earlier work called Odyssey [26] that explored the
idea of application adaptation based on network bandwidth
and CPU load. Puppeteer
[15] focusses on adaptation to
limited bandwidth by making transcoding. Transcoding is
a transformation of data to change the ﬁdelity [26] of the
application to save energy.
Reﬂective techniques: Reﬂection, originally noted by
Smith [32], is a technique that has emerged in computing
languages to provide inspection and adaptation of the under-
lying virtual machine. Reﬂective techniques have been ex-
ploited in mobile computing middleware to address context
change. Reﬂective mechanisms have been used by Capra et
al.
[11] such that applications acquire information about
the context, and then the middleware behavior and the un-
derlined device conﬁguration are tuned accordingly.
Alternate code paths: Alternate code paths or algo-
rithmic choice has been addressed in energy-aware software
literature such as Petabricks [5] and Eon [33]. The choice
between alternate algorithmic implementations of the same
code is done dynamically based on the energy availability.
Each code path has diﬀerent energy consumption in a trade-
oﬀwith quality or the accuracy of the result. A code path
that is chosen by a pre-determined battery life has been
explored in [21] in which tasks that have identical function-
ality are deﬁned by developers. These tasks have diﬀerent
quality of service versus energy usage characteristics for em-
bedded sensors application. In Green [7] a calibration phase
is done at the beginning to determine the sampling rate—
which eventually aﬀects the accuracy of the result—in order
to adapt to the available energy.
Algorithmic choice has
been further used in software libraries to deliver the best
performance based on the hardware conﬁguration [17, 22].
1.1.2
Context Monitoring
Eﬃcient context monitoring has been studied throughly
in literature. The work reported in [19, 24] provides frame-
works for sensor-rich context monitoring. The main focus
of that work is to minimize the energy consumption of the
context-monitoring system. To further enhance the energy
eﬃciency, Suman [25] exploits the temporal correlation be-
tween contexts in order to infer some context from others
without reading the actual sensor measurements. To avoid
performance degradation due to minimizing the energy con-
sumption in context monitoring frameworks, the work in [20,
13] focuses on the optimization between continuous context
monitoring, energy, latency and accuracy.
Moreover, mo-
bile operating systems currently support context monitoring
functionalities. For example, the recently added getMost-
ProbableActivity() API can be used to return the result of
the Android OS activity recognition engine (e.g. biking or
walking). Other examples are the Geofencing APIs provided
by both Andorid and iOS which allow listening to the en-
trance and exit events from particular places and therefore
allow for location based context applications.
1.1.3
Adaptation Engine
Prior work related to adaptation engines can be classiﬁed
into two broad categories (i) application-oriented adaptation
engines and (ii) operation system-oriented adaptation en-
gines. The work reported in [10, 35] is a representative work
for the ﬁrst class. In this work, an application speciﬁc adap-
tation engines are designed and implemented with speciﬁc
focus on energy-aware context adaptation. The work in [6,
34, 12] lies in the second category, where adaptation engines
are proposed to perform context-aware OS functionalities
such as context-aware memory management, context-aware
scheduling, ... etc.
1.2
Paper Contribution
The work reported in this paper can be categorized under
the class of application-oriented adaptation engines. While
there is a rich body of work in designing application-speciﬁc
adaptation engines, a systematic support for context-awareness
is still missing from contemporary mobile operating systems.
The work in this paper aims to ﬁll this gap by providing OS
support for the adaptation needed by context-aware Android
applications.
In this paper we discuss the design and implementation of
CAreDroid and present application case studies demonstrat-
ing the eﬀectiveness of the system. Technically, we make the
following contributions:
• We design CAreDroid, a framework for the implemen-
tation of context-aware polymorphic methods and for
387

---

## Page 3

app
      f
 f1
 f2
 f3
g1
g2
g3
Application Layer
Sensitivity
   Conﬁg
     File
System Layer
   Sensitive method
     registration &
     conﬁg parsing
   Context
 Monitoring
Context Sensors
  Adaptation
    Engine
Location
Mobility
Connectivity
…
      g
Figure 1: CAreDroid System Architecture. The de-
veloper provides a set of polymorphic methods and
provides a conﬁguration ﬁle describing how these
methods shall be called.
At runtime, CAreDroid
monitors the phone context and adapts the applica-
tion behavior accordingly.
the deﬁnition of application-speciﬁc rules used to map
methods to contexts (Section 3);
• We extend the Dalvik Virtual Machine in the Android
OS to provide adaptation support for context-aware
application.
The resulting CAreDroid can transpar-
ently switch between polymorphic versions of applica-
tion methods at runtime (Section 5);
• We provide two levels of complexity of the mapping be-
tween contexts to methods, (i) a binary criteria (called
must ﬁt) and a relaxed criteria (called best ﬁt) (Sec-
tion 5.2);
• We demonstrate how application developers can lever-
age CAreDroid to make applications context-aware with
minimal disruptions to the standard application devel-
opment process (Section 6).
The remainder of this paper is organized as follows. Sec-
tion 2 introduces the system architecture of CAreDroid. De-
tails of CAreDroid including its conﬁguration, monitoring,
and context adaptation algorithms are presented in Sections
3, 4, and 5 respectively.
Section 6 shows the evaluation
and case studies. Finally, we discuss some issues related to
the design of CAreDroid and give conclusions in Sections 7
and 8, respectively.
2.
SYSTEM ARCHITECTURE
The main objective of CAreDroid is to provide the ap-
plication developer with support to easily build adaptation
in context-aware applications. Hence, from a developer per-
spective, the design of CAreDroid needs to satisfy the fol-
lowing properties:

1. Usability: CAreDroid needs to add minimal overhead
on the application developer at development time.
2. Performance: The adaptation engined needs to add
minimal execution overhead when the application is
running.
Motivated by these two design objectives, we designed
CAreDroid as discussed in this section. A conceptual overview
of the CAreDroid architecture is shown in Figure 1. Appli-
cations normally call polymorphic methods f and g. Each
method is aliased to one of its versions (f1 and g2, respec-
tively, in the example). A sensitivity conﬁguration ﬁle, de-
ﬁned on a per-application basis, describes rules that deter-
mine under what context each of the polymorphic versions
should be used. For each version of a method, sensitivity
rules deﬁne acceptable ranges of operation for diﬀerent sen-
sors of system context. Method f1 could deﬁne, for example,
two rules stating that WiFi connectivity and battery charg-
ing status should be equal to true, while f2 could deﬁne one
rule stating that remaining battery capacity should be be-
tween 0% and 20%. Rules are assigned priorities that help
determine which of the versions should be used when multi-
ple rules are valid.
In the system layer, CAreDroid parses the application
conﬁguration ﬁle to discover adaptable methods and their
rules of operation. A context-monitoring module abstracts
the various sensors in the system, and exposes context in-
formation to an adaptation engine. When changes in con-
text occur, the adaptation engine changes the aliasing of
the adaptable methods according to the sensitivity rules. If
more than one version of a method matches the current con-
text, the priorities of the sensitivity rules are used to choose
between them. When there are no alternatives of a method
that exactly matches the context, CAreDroid chooses the
version that most closely conforms to the current state of
the device. CAreDroid is organized in three modules:
Context Sensitivity Conﬁguration File
For each context-aware application, a sensitivity conﬁgura-
tion ﬁle maps methods to contexts. The ﬁle is structured
as a series of sensitive methods and their respective context
sensitivity lists described in XML format. In keeping with
our goal of decreasing development complexity for context-
aware applications, the ﬁle is a straightforward description
of acceptable ranges of operation for each method under
diﬀerent contexts. A detailed description of the CAreDroid
conﬁguration ﬁle is presented in Section 3.
Context Monitor
CAreDroid has a dedicated module that continuously probes
the current phone context. CAreDroid supports both raw
contexts that can be directly known by reading the state of
the hardware (e.g. WiFi connectivity, battery level) as well
as higher level inferred contexts such as mobility status (e.g.,
walking, running) that require advanced processing of sen-
sor information. As mentioned in Section 1.1.2, the design
of context monitoring systems is a well studied topic. The
main work in this paper does not focus on eﬃcient imple-
mentation of context monitoring system. However, context
monitoring is yet an essential part in order to evaluate any
adaptation engine. Hence, in Section 4 we describe a sim-
plistic implementation of context monitoring which can be
augmented by any of the previous proposed context moni-
toring algorithms.
388

---

## Page 4

Adaptation Engine
In order to choose the correct polymorphic implementation
that best suits the current context, CAreDroid uses the data
supplied by the developer in the conﬁguration ﬁle. Alterna-
tive implementations of sensitive methods are connected to-
gether through a replacement map that lists all candidates
methods that can be used for a sensitive call.
Whenever
more than one candidate implementation ﬁts the current
context, CAreDroid uses a conﬂict resolution mechanism to
pick the implementation with the highest priority. Because
it frees developers from having to implement adaptation
strategies in the application layer, the CAreDroid adapta-
tion engine is the main factor in meeting our goal of decreas-
ing development complexity for context-aware appications.
Section 5 shows how context-to-method matching and con-
ﬂict detection are implemented eﬃciently to meet our goal
of reducing runtime overhead.
3.
SENSITIVITY CONFIGURATION FILE
The conﬁguration ﬁle is an XML ﬁle that is supplied by
the application developer. To ﬁt in the Android ﬂow, the
conﬁguration ﬁle is stored as an asset ﬁle packed with the
application package ﬁle (APK). In this section, we describe
the structure of this XML ﬁle along with the post-processing
steps performed by CAreDroid over this ﬁle.
3.1
Conﬁguration File Structure
For each sensitive method, the developer provides diﬀer-
ent polymorphic implementations. Each polymorphic imple-
mentation of a method is described by a name, a tag, and
a priority. The name corresponds to the method name in
source code. The tag associates diﬀerent implementations of
a method with one another. For example, if methods f1 and
f2 are polymorphic implementations of the same method,
then both of them must be associated with the same tag, for
example f. Finally the priority for a method helps the sys-
tem resolve ambiguities when multiple versions of a method
satisfy the current context.
For each polymorphic implementation, the developer as-
signs a sensitivity list. This sensitivity list is the list of con-
text states for which this polymorphic implementation shall
be triggered. In our current implementation of CAreDroid,
we focus on four context categories:
• Battery state: In this category, we deﬁne three con-
texts which are (1) the remaining battery capacity
(0% −100%) (2) the battery temperature (−30◦C –
100◦C) which is an indicative of high battery load as
well as elevated power consumption; and (3) operating
battery voltage, which is an indicative of the battery
health.
• Connectivity state: In this category, we deﬁne three
contexts: (1) WiFi connection status (On - Oﬀ), (2)
WiFi link quality (0−70 A/V◦), and (3) RSSI Received
signal strength indication (0 −4).
• Location: In this category, we consider one context
state, which is GPS location. In this state, the devel-
oper is allowed to provide the latitude and longitude
coordinates of a square area.
• Mobility state: In this category, we consider only the
current mobility state of the phone holder, which can
<Method>
<MethodName>AdjustCameraPowerAware
</MethodName>
<priority>1</priority>
<tag>cameraAdjust</tag>
<batterycapacity>
<vstart>0</vstart>
<vend>25</vend>
</batterycapacity>
</Method>
<Method>
<MethodName>AdjustCameraWhileRunning
</MethodName>
<priority>2</priority>
<tag>cameraAdjust</tag>
<batterycapacity>
<vstart>20</vstart>
<vend>100</vend>
</batterycapacity>
<mobility>run</mobility>
</Method>
Figure 2: Snippet of a CAreDroid conﬁguration ﬁle.
take one of the following values: still, walking, running
and driving.
3.1.1
Example
To illustrate the construction of the conﬁguration ﬁle,
we provide a small example in Figure
2.
In this exam-
ple, we have two polymorphic methods for adjusting the
camera parameters under diﬀerent contexts. One method,
AdjustCameraPowerAware, is designed to save energy.
Hence, its BatteryCapacity range is from 0% up to 25%,
and it can execute whether wifi is on or oﬀ. The second
method is dedicated to adjusting the camera while the user
of the device is running. For example, this method should
adjust the focus and the scene parameters of the camera to
give a better quality image. Accordingly, the mobility is
assigned to be run.
3.2
Conﬁguration File Processing
After the developer supplies the CAreDroid conﬁguration
ﬁle, several post-processing steps are required at the instal-
lation time of the application. In particular, the XML ﬁle
needs to be parsed, and the extracted information is then
used to ﬁll speciﬁc data structures.
Figure 3 shows how
CAreDroid ﬂow extends the normal Android compilation
and installation ﬂow.
This ﬂow diagram shows the steps
needed to post-process the conﬁguration ﬁle. Parsing of the
conﬁguration ﬁle, discovery of sensitive methods, and reg-
istration of adaptation parameters with the adaptation en-
gine is implemented in the Dalvik Virtual Machine (DVM),
as described in the remainder of this section.
3.2.1
Sensitive Method Discovery
Upon compilation of the Java code, the generated Dalvik
Executable File (DEX) contains all compiled bytecodes of
methods stacked on top of each other. A call to a method
is then accomplished by pointing to the oﬀset of the ﬁrst in-
struction inside the DEX ﬁle. For example, let us consider a
call to the myObject.foo() method. The following byte-
code:
invoke-virtual {v14}, [method@101e]
389

---

## Page 5

.apk
       extended .odex
Development
       time
Sensitivity
Conﬁg
File
Installation time
       Sensitive
        Method
       Discovery
CAreDroid Flow
Sensitivity
   Conﬁg
     File
Sensitivity
Conﬁg
File
    .java
Sensitivity
Conﬁg
File
Sensitivity
Conﬁg
File
  .class
Compilation and packaging time
    .dex
Sensitivity
   Conﬁg
     File
Normal Android
Flow
    .odex
  Replacement
         Map
Table of Range
Identiﬁers
intercept
Table of Range
Identiﬁers
Table of Range
   Identiﬁers
Figure 3: CAreDroid’s extended installation ﬂow. CAreDroid intercepts the installation process of the app
on the device in order to parse the sensitivity conﬁguration ﬁle. The ﬁnal outcome of this process is two data
structures named “Replacement Map” and “Table of Range Identiﬁers.”
is used, where v14 is the reference to the object instanti-
ated from the class myObject, and 0x101e is the oﬀset of
the ﬁrst instruction in myObject.foo() in the DEX ﬁle.
Note that the textual name of the method (e.g. “foo”) is
still preserved in the generated DEX ﬁle and the association
between the method name and the method oﬀset can still
be extracted.
The DEX ﬁle along with all asset ﬁles (including the CAre-
Droid conﬁguration ﬁle) are then packaged in the application
package ﬁle (APK). When the APK ﬁle is installed, Android
creates a new virtual machine to host the application. Dur-
ing this process, the Android ﬂow extracts the DEX ﬁle and
post-processes it in order to generate the Optimized DEX
(ODEX) ﬁle.
The DEX optimization consists of two main steps. The
ﬁrst step is executed while class loading takes place. During
this step, each method is assigned with a local method ID
(compared to the global method ID assigned in the DEX).
The second step of the DEX optimization process takes place
when object references are linked with their classes. In this
step, inheritance, polymorphism, method overriding, and
method overloading are resolved.
In particular, a virtual
table is generated for each class. Each resolved method cor-
responds to an entry in this virtual table. Therefore, each
method is now identiﬁed with its unique index inside it class
virtual table. As a result, the call to the myObject.foo()
method is further translated into:
invoke-virtual-quick {v14}, [000c]
where v14 is the reference to the class object, myObject,
and 000c is the index for method foo inside that class’s
virtual table. Note that the association of the method name
with its index in the virtual table is no longer preserved in
the ODEX ﬁle.
Switching between diﬀerent polymorphic implementations
is equivalent to intercepting the operation of the bytecode
corresponding to invoke-virtual-quick and supplying
a diﬀerent method ID. To perform this operation, CAre-
Droid must be able to keep track of the method IDs and
relate them back to the IDs of diﬀerent polymorphic imple-
mentations. Therefore, CAreDroid modiﬁes the DEX/ODEX
build process in Android to add hooks for context-awareness
in sensitive method calls. This is accomplished through a ta-
ble of range identiﬁers and a replacement map. This process
is shown in Figure 3.
3.2.2
Replacement Map (RM) and
Table of Range Identiﬁers (TRI)
The“Replacement Map”(RM) is a collection of (key, value)
pairs deﬁned for each polymorphic method.
The purpose of this map is to link each of the multiple poly-
morphic alternatives with their sensitivity lists. The key of
this map is a composite key that consists of the pair of class-
id and method-id extracted initially from the DEX ﬁle. The
value ﬁeld of the RM is an array whose length is equal to
the number of contexts (mobility, location, battery capac-
ity, etc.). This array speciﬁes the sensitive operation range
for this method for all diﬀerent contexts. To facilitate this
association, we introduce another data structure called the
“Table of Range Identiﬁers” (TRI).
The TRI consists of multiple associative arrays. For each
of the context sensors, we create a corresponding associative
array. To construct such an array, we extract all the opera-
tion ranges provided in the conﬁguration ﬁle, and and asso-
ciate a uniquely generated operation range identiﬁer (ORI)
to each of the operation ranges. An example for such an
associative array for battery capacity is shown in Table 1.
Since the ranges of operations can vary from one class to an-
other (based on the developer’s intent , as described by the
conﬁguration ﬁle), we generate a TRI per class per context.
The association between the class and the corresponding set
of TRIs is made after the optimization of the DEX ﬁle pro-
cess takes place. Once all TRI tables are built, we connect
them to the RM by copying the corresponding ORI from
the TRI data structure. An example of the RM is shown in
Table 1.
At runtime, CAreDroid uses the TRI along with the cur-
rent context to retrieve all ORIs that satisfy the current
context.
These ORIs are then used as inputs to the RM
to retrieve the corresponding method IDs. If more than one
method matches the ORIs, a conﬂict is discovered and needs
to be resolved as described in Section 5.
390

---

## Page 6

B-Range
ORI
0→100
1
20→30
2
10→20
3
30→100
4
S-Range
ORI
0→2
1
1→4
2
2→3
3
0→3
4
. . .
Class ID
Method ID
B
T
V
W
Q
S
M
L
0x01
0x00F
1
2
1
2
4
2
1
4
0x01
0x01E
2
3
4
2
3
3
2
2
0x02
0x02A
2
2
1
0
0
0
2
1
0x02
0x01F
2
2
1
0
0
0
8
3
Table 1:
On the left, examples of TRI tables for Battery capacity and Signal strength (RSSI) contexts.
Each TRI associates a unique Operation Range Identiﬁer (ORI) to each record. For each class, CAreDroid
creates TRI for all diﬀerent contexts. The association between the TRIs and the class is done later, after
the optimization of the DEX ﬁles takes place.
On the right, a Replacement Map that associates each
key = (class-id, method-id) with its corresponding ORIs. CAreDroid creates a unique RM for the application.
— legend: B: Battery Capacity, T: Battery Temperature, V: Battery Voltage, W: WiFi connectivity, S: Signal
strength, Q: Signal Quality M: Mobility L: Location.
3.2.3
ODEX Extension
After CAreDroid constructs all the TRIs and the RM
data structures, the DEX ﬁle passes through the normal
Android optimization process, resulting in the generation of
the ODEX ﬁle. Since the optimization process of the DEX
ﬁle can result in a change in the method IDs, CAreDroid
intercepts the process of optimizing the DEX ﬁles in order
to update the RM, as shown in Table 1.
Finally, we extend the ODEX ﬁle structure by adding
a reference to the RM data structure, which is generated
by the described process. We extend the internal Android
class data structure in order to associate the corresponding
TRIs generated for that particular class. We also extended
the internal Android object and method data structures by
adding sensitivity ﬂags. These ﬂags are used later by the
CAreDroid Adaptation Engine to facilitate the method
switching.
3.3
Online Change of Context Ranges
While the conﬁguration ﬁle needs to be speciﬁed by the
developer at development time, the sensitive values of some
sensitive contexts may not known until the code is running
on the phone. For example, an application that changes its
behavior whether the user is at home or at work. The loca-
tion information (longitude and latitude of home and work)
is not known at development time. Accordingly, CAreDroid
supports online modiﬁcation of the values associated with
each sensitivity context. This takes place by asking the de-
veloper to write a speciﬁc ﬁle to the ﬁle system. CAreDroid
parses this ﬁle whenever appropriate and re-updates the TOI
accordingly. Note, that CAreDroid allows only changing the
values associated with each sensitivity list but not the num-
ber of sensitive contexts associated to a polymorphic imple-
mentation.
4.
CAREDROID CONTEXT MONITORING
In this section, we describe how CAreDroid acquires the
current context at runtime with less overhead than Android
Java APIs. Phone contexts can be numerous, and include
raw values (like accelerometer data, GPS longitude and lat-
itude, remaining battery capacity, etc.), or inferred states
(like user mobility). While the in contribution of this paper
is not eﬃcient implementation of a context monitoring sys-
tem, this is an essential part of any adaptation engine. In
this section, we give details on how CAreDroid acquires both
raw and inferred phone contexts. The work in this section
can be indeed complemented by any of the context monitor-
ing systems that appeared currently in the literature.
4.1
Raw Context Monitoring
Android exposes sensor information to the software stack
through a Hardware Abstraction Layer (HAL). The HAL
features a set of sensor managers that work as an interme-
diate layer between the low-level drivers and the high-level
applications.
In order to reduce the overhead, we need to bypass the
HAL layer and the associated sensor managers. This can be
done by snooping on the interface between the HAL and the
low-level device drivers through the sysfs virtual ﬁle sys-
tem. In particular, each sensor (e.g. accelerometer, battery
sensors, and WiFi) device driver exports its data into a set
of ﬁles located under /sys/class/. In our work, we create
an internal Dalvik VM thread that continuously reads these
ﬁles to determine the state of the battery sensors and WiFi
availability. The WiFi signal quality and signal strength are
monitored via reading /proc/net/wireless. Similarly,
the GPS location is determined by snooping over the An-
droid Binder that connects the Android LocationManager
with the GPS hardware driver.
4.2
Inferred Context: Mobility State
Mobility state detection is calculated by processing the
raw accelerometer data obtained by the internal VM thread
described above.
In order to infer the mobility state, we
adapt the classiﬁcation procedure described in
[28, 29] to
detect whether the user is stationary, walking, or running.
This classiﬁer is based on the Geortzel algorithm [18]. Fi-
nally, to reduce the computational delay due to running the
mobility state classiﬁer, we let the classiﬁer run on a sepa-
rate DVM internal thread.
5.
CAreDroid ADAPTATION ENGINE
The adaptation Engine is the core of CAreDroid.
It is
where the method replacement happens at runtime. In this
section, we explain how CAreDroid extends the execution
phase of the Android ﬂow to automatically and transpar-
ently switch between methods.
5.1
Dalvik Interpreter Extension
Recall that the developed application is compiled and
translated into an ODEX ﬁle. Bytecode stored in the ODEX
ﬁle is then interpreted at runtime. In particular, the Dalvik
Virtual Machine (DVM) runtime utilizes two types of inter-
preters. The ﬁrst is called the portable interpreter, which is
391

---

## Page 7

invoke-virtual-quick
CAreDroid Flow
Normal Android
         Flow
  Replacement
        Map
intercept
Dalvik Interpreter Method ID
   Class Virtual
          Table
Class ID,
Pointer to
method byte
code
Execute method
CAreDroid Dalvik
     Interpreter
      Extension
Class ID
Table of Range
Identiﬁers
Table of Range
Identiﬁers
Table of Range
     Identiﬁers
Operation
Range
Identiﬁers
       CAreDroid
   Decision Graph
Current Context
Replaced
Method ID
Class ID,
Resolution
   Cache
update cache
Replaced
Method ID
Class ID,
cache miss
cache hit
Method ID
Class ID,
Figure 4: Flow of CAreDroid Adaptation Engine at runtime. The CAreDroid extended interpreter intercepts
the execution of the Dalvik opcode invoke-virtual-quick to check whether the method invoked is sensitive or
not. If the method is sensitive, then the CAreDroid adaptation engine checks the current context and picks
the correct polymorphic method. This process is done through leveraging the information in the TRI and
RM data structures along with the conﬂict resolution mechanism implemented using the decision graph.
Finally, to speed up the process, CAreDroid uses a resolution cache, which exploits the temporal locality of
the context.
implemented in C code and is not speciﬁc to a certain plat-
form architecture. The second interpreter is called the fast
interpreter which is implemented in assembly language and
tailored towards a speciﬁc platform.
The DVM supports
switching between the two interpreters at runtime.
In our framework, we extend the portable interpreter to
support the CAreDroid runtime engine. The extended in-
terpreter checks the current interpreted ODEX bytecode.
Whenever the bytecode corresponding to the invoke-virtual
instruction is detected, CAreDroid intercepts the execution
of the interpreter.
It then checks the arguments of the
invoke-virtual instruction — the method ID and the
class ID — against the sensitivity ﬂags in the extended
ODEX ﬁle, described in Section
3.2.3.
If the sensitivity
ﬂag is set, then CAreDroid needs to pick the polymorphic
method that best ﬁts the current context.
The process of choosing the best polymorphic implemen-
tation needs to resolve the conﬂicts in the user conﬁgura-
tion. This is done through the CAreDroid decision graph
module (discussed later) along with the TRI and RM data
structures. In order to accelerate the process of picking the
correct polymorphic implementation, CAreDroid uses a res-
olution cache that exploits the temporal locality of the adap-
tation decisions. This process is shown in Figure 4 and illus-
trated in the CAreDroid decision graph and the resolution
cache in the following subsections.
Note that the portable interpreter (where CAreDroid is
running)has a negative eﬀect on the execution time of the
application. To address this issue, we switch between the
fast interpreter and the portable interpreter at runtime. The
execution starts normally with the fast interpreter and, when
the interpreter hits an invocation of a sensitive class, the in-
terpreter switches to the portable interpreter and the CAre-
Droid adaptation process takes place. After executing the
sensitive method, the interpreter switches back to the fast
version.
5.2
Which Polymorphic Implementation
to Pick?
In order to choose the correct implementation that best
suits the current context, our framework utilizes the data
supplied by the developer in the conﬁguration ﬁle.
Note
that it is possible that, for a given context, multiple methods
are valid candidates, leading to a conﬂict that needs to be
resolved.
5.2.1
Best Fit vs Must Fit
The ﬁrst step is to choose a set of candidate methods. We
allow for two policies. In the ﬁrst policy, must ﬁt, a method
is considered a valid candidate if the current context satisﬁes
all the operation ranges for all sensitive contexts.
In the
second policy, best ﬁt, a method is a valid candidate if the
current context satisﬁes at least one operation range of the
sensitive contexts. The choice of policy is determined by the
conﬁguration ﬁle.
5.2.2
Decision Graph
We use a Directed Acyclic Graph (DAG) to choose the
candidate method. Each level of the graph marks one sen-
sitive context (e.g. battery capacity, mobility state). The
sensitive contexts are ordered based on their priority as de-
ﬁned in the conﬁguration ﬁle. For each sensitive context,
we create nodes for all operation range identiﬁers (ORI)—
previously discussed in Section 4— that appear in the re-
placement map (RM) data structure.
In other words, to
build the decision tree, we traverse the RM horizontally.
392

---

## Page 8

B
T
V
S
W
Q
M
L
M1
M2
M3
M4
M5
1 2 3 4 5
2 3 4 1 2
1 4 2 3 4
1 2 3 4 5
2 2 1 3 3
4 3 2 1 2
2 3 3 1 2
1 4 3 2 3
1
2
3
4
5
1
2
3
4
1
2
3
4
1
2
3
4
1
2
3
1
2
3
4
1
2
3
1
2
3
4
5
Figure 5: An example of a Replacement Map(RM)
(right) and its associated decision graph (left). The
nodes at each level correspond to the ORIs in the
same level of the associated RM. The edges in
the decision graph correspond to the ﬁve methods
shown in the RM. The shaded nodes correspond to
the ORIs that match the current context. The solid
arrows correspond to the active paths that match
both the RM and the current context. Finally the
path marked in green corresponds to the method
that satisﬁes all the ORIs, and therefore this method
is the one picked by CAreDroid for execution.
For each row of the RM, we create nodes corresponding to
all distinctive ORIs in that row. This process is repeated
for all the rows in the RM. An example of an RM and the
associated decision graph is shown in Figure 5.
The methods contained in the RM columns dictate the
decision graph topology. Accordingly, we traverse the RM
vertically and connect the ORIs that correspond to the same
method by edges. This is shown for the same example, in
Figure 5.
When the phone context is reported, we use the TRIs
in order to know which ORIs are active, i.e., which ORIs
match the current context.
The next step is to use this
information to eliminate some choices in the decision graph.
For example, in Figure 5, we mark the active ORIs with
a gray color and the corresponding active edges with solid
arrows.
The ﬁnal step is to compare the available active paths
that start from the top level. In the must ﬁt policy, CAre-
Droid considers only the active paths that connect the ﬁrst
level all the way to the lower level. If no such path exists,
then no method replacement is going to take place. On the
other hand, the best ﬁt policy considers the longest path that
starts from ﬁrst level. Referring to the example in Figure 5,
only one active path is passing through all the DAG levels
and corresponds to method M4. Therefore, CAreDroid picks
this method for execution. The Class ID and Method ID of
this method is reported back to the normal Android ﬂow
to be executed. If further conﬂict exits, we use the method
priority reported in the conﬁguration ﬁle.
Platform
SLOC
% Increase
Non-context aware (Base)
275
-

Context-aware (Pure Java)
606
120%
CAreDroid
275 +78a
28.3%
aSLOC of the XML Conﬁguration ﬁle
Table 2: signiﬁcant line of code (SLOC) results for
case study 1 showing the SLOC for diﬀerent im-
plementations along with the percentage increase of
SLOC relative to the non-context aware implemen-
tation.
5.3
Conﬂict Resolution Cache
While the adaptation strategy for CAreDroid is fairly straight-
forward, performing it for every individual sensitive method
call in the system would incur in an unnecessary overhead.
In order to decrease the overhead of the context-to-method
resolution mechanism, our framework uses a resolution cache.
Our heuristic assumes that the operating point does not
change over short time periods. Therefore, if a method is
called multiple times within a short amount of time (inside
a loop for example), the same polymorphic implementation
might be used for all of these calls. The cache is used to
store the recently resolved candidates, that is, the recent
phone context along the method ID that is chosen for each
phone context. Each entry corresponds to the eight values
of the phone context along with the method ID for the opti-
mal method. The cache uses a Least Recently Used (LRU)
approach to replace entries.
6.
EVALUATION
We evaluate CAreDroid with four case studies. In the ﬁrst
one, we focus on assessing two metrics namely, reducing the
number of signiﬁcant lines of code and the execution time of
the context-aware application. In the remaining three case
studies, we show examples of applications that can beneﬁt
from context adaptation using CAreDroid.
All case studies are carried over a Nexus 4 phone running
a modiﬁed system image for platform 4.2 API 17 [3]. The
execution time is obtained using the Android SDK tracer
[4]. The size of the original system image for Android 4.2 is
234.368 MB, the modiﬁed system image that support CAre-
Droid is 245.26 MB. Hence, the overhead in the system im-
age is 4.6%.
6.1
Case Study 1: A Simple Application
In this case study, we implement a simple application that
has only one sensitive method with three polymorphic im-
plementations. In particular, this simple application imple-
ments a numerical solver for linear equations (which is a
cornerstone algorithm in many image processing algorithms
used to enhance photos before posting them to social media
applications). We implement three polymorphic variants of
this solver named LUP-decomposition (LU), Cholesky de-
composition (CHD), and Conjugate Gradient (CG). These
three methods have diﬀerent memory and computation time
characteristics. These mathematical functions are exhaus-
tively used in image processing applications. Each imple-
mentation corresponds to a particular tradeoﬀbetween per-
formance and computation time. In particular, CHD gives
393

---

## Page 9

Platform
Solver
CPU time (ms)
Overhead
Method
Decision Tree
Context
Total
without
with
Monitoring
without
with
without
with
time
cache
cache
(parallel thread)
cache
cache
cache
cache
Non-context
aware (Base)
LU
8.322
-

-

8.322
-

CHD
16.872
-

-

16.872
-

CG
13.375
-

-

13.375
-

Context
aware
(Pure Java)
LU
8.322
0.227
5.093
13.642
63.92%
CHD
16.872
0.776
5.093
25.741
52.56%
CG
13.375
0.351
5.093
18.819
40.70%
CAreDroid
(Must Fit)
LU
8.322
0.183
0.030
0.336
8.841
8.688
6.23%
4.39%
CHD
16.872
0.335
0.031
0.336
17.543
17.239
3.98%
2.17%
CG
13.375
0.198
0.030
0.336
13.909
13.741
3.99%
2.736%
CAreDroid
(Best Fit)
LU
8.322
0.183
0.031
0.336
8.841
8.689
6.23%
4.41%
CHD
16.872
0.732
0.031
0.336
17.635
17.239
4.522%
2.17%
CG
13.375
0.489
0.030
0.336
14.2
13.741
6.17%
2.73%
Table 3: Execution time results for case study 1 showing the proﬁling of diﬀerent parts for all the three
implementations. The overhead is computed relative to the non context-aware implementation. The results
show the eﬃciency of both the must ﬁt and best ﬁt policies. It also shows the performance increase resulting
from using the cache.
the most accurate results while suﬀers from high computa-
tion time. On the other extreme, LU gives the least accurate
results (compared to CHD and CG) while leads to better
computation time.
The purpose of this case study is to
characterize the performance of CAreDroid while switching
between these three polymorphic implementations.
In order to characterize the CAreDroid performance, we
generate an arbitrary conﬁguration ﬁle that assigns each of
the three solvers to diﬀerent battery and connectivity con-
texts. We evaluate CAreDroid against a pure Java imple-
mentation performing the same functionality. That is, the
pure Java application listens to changes in battery and WiFi
connectivity using the standard HAL callback mechanism
provided by the Android APIs. We implement a non-context
aware implementation that magically knows which polymor-
phic method shall be called without knowing the context
(for the purpose of comparison) and we call it the base non-
context aware.
6.1.1
Reduction in Signiﬁcant Line of Code (SLOC)
In this example, using CAreDroid reduces the SLOC for
the application by a factor of 2x compared to a Java imple-
mentation using standard Android APIs. Table 2 shows the
SLOC for each of the implementations.
6.1.2
Reduction in Execution Time
In this test case, we let the 4 diﬀerent implementations
(non context aware, pure Java, must ﬁt and best ﬁt) run over
the phone for several hours while collecting proﬁling infor-
mation. The proﬁling information are then averaged out and
the result is reported in Table 3. To further investigate the
eﬀect of the resolution cache, we run the test with and with-
out the cache functionality to allow for comparison.
The
results in Table 3 show that CAreDroid reduces the CPU
time overhead (compared to the pure Java implementation)
by a factor of 12x, on average, while adding a minimal over-
head (2.5%–4.4%) compared to the non context-aware case.
Furthermore, the resolution cache leads to decreasing the
decision tree time by at least an order of magnitude when-
ever there is no change in the operating point. Finally, with
no cache (or alternatively when a cache miss occurs) best ﬁt
policy adds slightly more overhead compared to the must
ﬁt policy due to the complexity of the decision graph used
by the former. The same order of overhead also appears in
the pure Java implementation because of the added code for
switching between contexts.
6.1.3
Energy Proﬁling
Finally, we characterize the energy consumption (and hence
the battery life time) due to context monitoring and adap-
tation. In this experiment, we monitor the voltage and dis-
charging current of the battery during 2.5 hours while run-
ning the application under the four platforms (best ﬁt, must
ﬁt, pure Java, and non-context aware).
The experiment
starts at the same battery capacity and at room temper-
ature. We run each experiment three times. In the ﬁrst one,
we deactivate the context switching functionalities and fo-
cus only on the energy consumed by the context monitoring.
These results are reported in Figure 6(a). In the second run,
we run both context monitoring as well as context switch-
ing but calling an empty method. The energy measurements
are then subtracted from the energy measurements from the
previous experiment. The purpose of this experiment is to
proﬁle the eﬀect of the decision tree and the context switch-
ing mechanism. This is shown in Figure 6(b). Finally, we
run the full implementation to get the overall energy con-
sumption of our system and compare it to the non-context
aware one.
Overall, the results show that bypassing the HAL layer
and performing the context monitoring inside the OS lead
to decreasing the energy consumed by a factor of 36%. The
results also show a similar decrease of energy consumption
due to implementing the context switching inside the OS
with a slight diﬀerence between the must ﬁt and the best ﬁt
switching policies. Also, as seen in Figure 6(c), the energy
consumption of pure Java implementation consumes around
69.33% more energy compared to CAreDroid. This energy
consumption can be further improved by using energy-aware
context monitoring techniques that previously reported in
the related work (Section 1.1.2).
394

---

## Page 10

0
0.5
1
1.5
2
2.5
0
1,000
2,000
3,000
4,000
5,000
Time [hr]
Energy [J]
Pure Java
Must ﬁt
Best ﬁt
(a)
0
0.5
1
1.5
2
2.5
0
1,000
2,000
3,000
4,000
5,000
Time [hr]
Energy [J]
Pure Java
Must ﬁt
Best ﬁt
(b)
0
0.5
1
1.5
2
2.5
0
1,000
2,000
3,000
4,000
5,000
Time [hr]
Energy [J]
Pure Java
Must ﬁt
Best ﬁt
Non-context aware
(c)
Figure 6: Energy consumption results for case study 1 showing (a) energy used when context monitoring is
running alone (b) energy consumed by the context switching subsystem and (c) the total energy consumed.
On each case, we plot the energy consumed by the pure Java implementation as well as the must ﬁt and best
ﬁt implementations of CAreDroid. The results in (a) show that bypassing the HAL layer and implementing
the context monitoring inside the OS allowed CAreDroid to use 36% less energy within the 2.5 hours lapse
of the experiment. The results in (b) show that both Must ﬁt and Best ﬁt adaptation signiﬁcant outperform
the pure Java implementation in terms of energy consumed (and hence battery lifetime). The overall results
(c) show that CAreDroid consumes only 6.73% energy compared with the non-context aware implementation
and provides 69.33% energy saving compared to the pure Java implementation.
6.2
Case Study 2: A Context-Aware Phone
Conﬁguration
With increasing reported accidents resulting from texting
while driving, we develop an application that changes the
phone conﬁguration based on the underlying context of the
phone1. We manifest the location, mobility state, and
battery in this application. In particular, we would like the
application to change the phone conﬁguration as follows:
• Default: keep the phone in its default conﬁguration.
• Driving: (1) disable messaging and email notiﬁca-
tions, (2) block certain caller numbers speciﬁed by a
list (i.e. forward calls from this list to the voice mail)
and (3) enable bluetooth (to connect the phone to car
speaker).
• Running: (1) enable GPS (if not enabled), (2) block
certain caller numbers speciﬁed by a list, and (3) mute
the alarms.
• At home: (1) enable WiFi, (2) block certain caller
numbers speciﬁed by a list, (3) raise the alarm volume,
and (4) set ringer volume to normal.
• At work: (1) enable WiFi, (2) lower the alarm vol-
ume, (3) put the phone in vibrating mode, and (4)
block certain list of caller numbers.
• Power saving: (1) lower the ringer volume, (2) dis-
able bluetooth (if enabled), and (3) enable the auto-
matic adjustment of screen brightness.
1Some applications in the market attempt to control the
phone conﬁguration like Tasker [2] and Locale [1] by pro-
viding hooks to the user to conﬁgure the phone based on
certain rules that the user deﬁnes.
However, these appli-
cations have only boolean decision. The rules must be all
satisﬁed in order to change the conﬁguration, while CAre-
Droid provides more complex formula (the best-ﬁt policy).
Moreover, Tasker and Locale do not support all the contexts
supported by CAreDroid.
Platform
SLOC
% Increase
Non-context aware (Base)
282
-

Context-aware (Pure Java)
873
201%
CAreDroid
282 +277a
98.2%
aSLOC of the XML Conﬁguration ﬁle
Table 4:
Signiﬁcant lines of code (SLOC) results
for case study 2 showing the SLOC for the three
implementations along with the percentage increase
of SLOC relative to the non-context aware imple-
mentation.
Platform
CPU timea
Overhead
Non-context aware (Base)
1.942
-

Context aware (Pure Java)
12.14
525.12%
CAreDroid (Best Fit)
2.015
3.76%
aCPU Time (ms) = Method time + HAL Callback time +
Inferences
Table 5:
Execution time results for case study 2
showing the overhead for the diﬀerent implementa-
tions.
For each of these conﬁgurations, a polymorphic method is
implemented. The objective is to call the correct method
based on the context. Similar to the previous case study,
we implemented a non-context aware implementation (for
the purpose of comparison), a context-aware implementa-
tion using the normal Android ﬂow, and a context-aware
implementation using CAreDroid.
6.2.1
Reduction in Signiﬁcant Line of Code (SLOC)
CAreDroid decreases the code complexity (quantiﬁed by
SLOC) by a factor of 2× (including the SLOC of the XML
conﬁguration ﬁle) compared to the implementation based on
the normal Android ﬂow, as shown in Table 4.
395

---

## Page 11

6.2.2
Reduction in Execution Time
In this test case, CAreDroid is conﬁgured and the phone
is allowed to change between diﬀerent contexts leading to
a change in the application behavior. The time proﬁling is
done across diﬀerent contexts and the one with maximum
CPU overhead is reported in Table 5.
For this case study, the pure Java implementation adds
a 525.12% CPU overhead. On the other hand, CAreDroid
introduces a minimal overhead of 3.76% compared to the
non-context aware implementation. The large overhead of
the former can be explained by observing that there are 16
possible cases that need to be handled if the application
developer were to implement the same app without using
CAreDroid.
Needless to say that the developer—without
CAreDroid—has to implement all the Android listeners to
all contexts as well as provide the high-level inferences of mo-
bility state from the raw data. The small overhead in CAre-
Droid compared to the pure Java implementations again
can be accounted to the fact that all the context-awareness
operations (context monitoring and adaptation) are imple-
mented natively inside the operating system.
6.3
Case Study 3: Context-Aware Camera
In this case study, we build a context-aware camera ap-
plication. The camera adjusts its features parameters based
on the phone context. We have ﬁve diﬀerent methods that
CAreDroid alternates between. The focus of this study is
on making the focus, scene mode and ﬂash mode adaptive
to the context. However, this can be extended to handle all
the camera features. The ﬁve modes are listed as follows:
• Default: Conﬁgure the focus mode to “default”
• When runing: adjust the focus mode to the “contin-
uous picture” mode.
• When walking: adjust the scene mode to the“steady
photo” mode.
• When still:
adjust the focus mode to the “ﬁxed”
mode”.
• Power saver: (1) adjust the ﬂash mode to “oﬀ”, (2)
adjust the focus mode to “ﬁxed” mode, and (3) adjust
the quality of the picture to “minimum.”
Similar to previous case studies, we implemented a polymor-
phic method for each of these modes and the objective is to
call the appropriate method based on the phone context.
Platform
SLOC
% Increase
Non-context aware (Base)
277
-

Context-aware (Pure Java)
782
182%
CAreDroid
277 +133a
48%
aXML Conﬁguration ﬁle
Table 6:
Results of the signiﬁcant line of code
(SLOC) for the three implementations of the Smart
Camera application used in case study 3. The results
shows the SLOC along with the percentage increase
relative to the non-context aware implementation.
The test is performed as follows. First a photo is captured
while the phone is held in a standstill position using the orig-
inal camera application provided by the phone. Next, the
(a)
(b)
(c)
Figure 7: Photos taken by the Smart Camera ap-
plication developed for case study 3: (a) the photo
taken while the phone holder is standing still, (b)
the photo taken while the phone holder is walking
and no context-awareness is taking place, and (c)
photo taken while the phone holder is walking and
using the Smart Camera application built on top of
CAreDroid.
user starts to walk/run while trying to capture the photo
for the same object again using the original camera applica-
tion. Finally, the same experiment is done while using the
CAreDroid-based context-aware camera application.
The results of the implemented application is shown in
Figure 7. Figure 7(a) shows the original photo captured from
a stand still position. Figure 7(b) shows the captured photo
while the phone holder is walking and no context-awareness
processing is taking place, and ﬁnally, Figure 7(c) shows
the captured photo with the user is walking and using the
developed context-aware camera with CAreDroid. As with
the previous case studies, Table 6 shows the reduction of the
overhead in SLOC when the context-aware Camera applica-
tion is developed using normal Android ﬂow compared to
the proposed CAreDroid ﬂow. The table shows a reduction
of SLOC by more than a factor of 3×.
7.
DISCUSSION
The underlying idea behind CAreDroid is the ability of
the system to sense and adapt to variations in the environ-
ment and available resources. In this section we discuss some
issues that faced us during the design and implementation
of CAreDroid.
7.1
Why is CAreDroid implemented inside the
OS?
One possible design of CAreDroid was to design it as a
library which provided context adaptation functionalities
through a set of exposed APIs. Compared to the current
design of CAreDroid, the library-based design falls behind
in terms of the two design criteria discussed in Section 2
named Usability design and Performance. From the usabil-
ity point of view, the library implementation of the adap-
tation engine forces the developer to issue subsequent calls
to the library APIs. Missing calls to the library APIs may
result to degradation in the context awareness of the devel-
oped application.
On the other hand, the current design
of CAreDroid makes the application developer completely
oblivious from the adaptation. He is asked only to provide
the adaptation policy in the XML conﬁguration ﬁle. After-
wards, CAreDroid intercepts the execution of the methods
while it is being interpreted by the Dalvik VM and perform
the adaptation automatically. From the performance point
of view, implementing the context adaptation and monitor-
396

---

## Page 12

ing in the low level results into less execution time as proved
by the experimental test cases shown in Section 6.
7.2
Privacy
Sensing and understanding the user’s context and tak-
ing decisions accordingly can lead to various privacy leaks.
Android privacy mechanism depends on providing the user
with diﬀerent queries in order to grant permissions to the
application to use the sensory data.
In our work, CAre-
Droid ensures that the adaptation policy speciﬁed by the
developer does not use sensory data that are not permitted
by the user. For this end, CAreDroid parses the applica-
tion’s permissions included in the Android manifest ﬁle2.
The adaptation engine in CAreDroid uses only permissible
contexts as per application permissions.
7.3
Developer Matters
Despite the fact that the adaptation engine decision is
obfuscated from the developing phase, in some scenarios—
for example when the best ﬁt policy is used—the developer
may be interested in retrieving the current operating point.
Therefore, CAreDroid addresses this issue by providing an
API called “read_operating_point()” which can be used to
read the current values of diﬀerent contexts.
7.4
Limitations
The CAreDroid framework described here is not without
some limitations:
• Polymorphic methods in CAreDroid must be pure func-
tions, i.e., they cannot perform I/O and cannot change
global program states, and their output must depend
only on the method arguments.
To allow for non-
pure functions, the framework would require state-
migration procedures between every possible pair of
polymorphic methods.
• CAreDroid assumes that an application developer can
provide multiple implementations of sensitive meth-
ods. Specifying the right constraints is not an easy task
and it may be better to suggest the right constraints
to the developer during a validation phase of the ap-
plication. However, this is an open research point and
previous work [14, 8] has identiﬁed the importance of
enforcing the developer to suggest the adaptation pol-
icy and not letting the adaptation engine automati-
cally synthesize the adaptation policy.
• CAreDroid also expects the application programmer to
be aware of suitable ranges of operations for diﬀerent
sensitive methods. In the future, we intend to explore
automated code proﬁlers that could suggest ranges of
operation for each of the choices, helping users in deﬁn-
ing suitable adaptation conﬁguration ﬁles.
7.5
Broader Uses of CAreDroid
CAreDroid supports connectivity context such as Wiﬁ
connectivity, signal strength and quality of the signal as well
as low level context such as battery temperature.
These
contexts can be manifested to decide if some intensive com-
putation should be oﬄoaded to a server or if an approxi-
mate computation should be used. In particular, if battery
2an Android XML ﬁle that declares the permissions required
by the application
capacity is good (high enough) and there is WiFi connec-
tivity with good strength then CAreDroid can switch to a
method that oﬄoads intensive computation to a server and
remove the burden of computation from the phone. Hence,
the concept of cyber-foraging discussed in Section 1.1.1 can
be directly implemented using CAreDroid.
Similarly, ap-
proximate computation (or algorithmic choice as discussed
in Section 1.1.1) can be implemented using CAreDroid by
manifesting the temperature context as well as the battery
capacity context.
8.
CONCLUSION
Context-aware computing is a powerful technique for phys-
ically coupled software.
It can enhance functionality and
improve resource usage of applications by adapting them to
context. In this paper, we present CAreDroid, an adaptation
framework for context-aware applications in Android. CAre-
Droid allows applications developers to develop context-aware
applications without having to deal directly with context
monitoring and context adaptation in the application code.
In CAreDroid, multiple versions of methods that are sensi-
tive to context are dynamically and transparently replaced
with each other according to application-speciﬁc conﬁgura-
tion ﬁle. By pushing the context monitoring and adapta-
tion functionalities to the Android runtime, CAreDroid is
able to provide context-awareness more eﬃciently and with
signiﬁcantly fewer lines of code compared to current An-
droid development ﬂow. In particular, using diﬀerent case
studies, we show how CAreDroid can be used to develop
context-aware applications. Results from these case stud-
ies show that CAreDroid reduces the code complexity by at
least half while decreasing the computation overhead by at
least a factor of 10× compared to non-CAreDroid applica-
tions.
Acknolwedgment
This research is funded in part by the National Science
Foundation under grant CCF-1029030, by the Center for
Excellence for Mobile Sensor Data-to-Knowledge under Na-
tional Institutes of Health grant #1U54EB020404, and by
the U.S. ARL, U.K. Ministry of defense (MoD) under Agree-
ment Number W911NF-06-3-0001. Any opinions, ﬁndings
and conclusions or recommendations expressed in this ma-
terial are those of the author(s) and do not necessarily reﬂect
the views of the funding agencies. The U.S. and U.K. Gov-
ernments are authorized to reproduce and distribute reprints
for Government purposes notwithstanding any copyright no-
tation hereon.
9.
REFERENCES
[1] Locale for android. <http://www.twofortyfouram.com>.
[2] Tasker for android. total automation for android.
<http://tasker.dinglisch.net/index.html>.
[3] Android. Android open source project.
<https://source.android.com>.
[4] Android SDK. Proﬁling with traceview.
<http://developer.android.com/tools/debugging/>.
[5] J. Ansel, C. Chan, Y. L. Wong, M. Olszewski,
Q. Zhao, A. Edelman, and S. Amarasinghe.
Petabricks: a language and compiler for algorithmic
choice. SIGPLAN Notices, 44:38–49, June 2009.
397

---

## Page 13

[6] K. Ariyapala, M. Conti, and C. Keppitiyagama.
Contextos: A context aware operating system for
mobile devices. In Green Computing and
Communications (GreenCom), 2013 IEEE and
Internet of Things (iThings/CPSCom), IEEE
International Conference on and IEEE Cyber, Physical
and Social Computing, pages 976–984, Aug 2013.
[7] W. Baek and T. M. Chilimbi. Green: a framework for
supporting energy-conscious programming using
controlled approximation. SIGPLAN Notices,
45:198–209, June 2010.
[8] G. Bai, L. Gu, T. Feng, Y. Guo, and X. Chen.
Context-aware usage control for android. In Security
and Privacy in Communication Networks, pages
326–343. Springer, 2010.
[9] R. K. Balan, M. Satyanarayanan, S. Y. Park, and
T. Okoshi. Tactics-based remote execution for mobile
computing. In Proceedings of the 1st international
conference on Mobile systems, applications and
services, pages 273–286. ACM, 2003.
[10] A. Beach, M. Gartrell, X. Xing, R. Han, Q. Lv,
S. Mishra, and K. Seada. Fusing mobile, sensor, and
social data to fully enable context-aware computing.
In Proceedings of the Eleventh Workshop on Mobile
Computing Systems & Applications, pages 60–65.
ACM, 2010.
[11] L. Capra, G. S. Blair, C. Mascolo, W. Emmerich, and
P. Grace. Exploiting reﬂection in mobile computing
middleware. ACM SIGMOBILE Mobile Computing
and Communications Review, 6(4):34–44, Oct. 2002.
[12] D. Chu, A. Kansal, J. Liu, and F. Zhao. Mobile apps:
It’s time to move up to condos. In 13th Workshop on
Hot Topics in Operating Systems (HotOS XIII).
USENIX, May 2011.
[13] D. Chu, N. D. Lane, T. T.-T. Lai, C. Pang, X. Meng,
Q. Guo, F. Li, and F. Zhao. Balancing energy, latency
and accuracy for mobile sensor data classiﬁcation. In
Proceedings of the 9th ACM Conference on Embedded
Networked Sensor Systems, SenSys ’11, pages 54–67,
New York, NY, USA, 2011. ACM.
[14] M. Conti, B. Crispo, E. Fernandes, and
Y. Zhauniarovich. Crˆepe: A system for enforcing
ﬁne-grained context-related policies on android.
Information Forensics and Security, IEEE
Transactions on, 7(5):1426–1438, 2012.
[15] E. De Lara, D. S. Wallach, and W. Zwaenepoel.
Puppeteer: Component-based adaptation for mobile
computing. In USENIX Symposium on Internet
Technologies and Systems - USITS, volume 1, pages
14–14, 2001.
[16] J. Flinn, S. Park, and M. Satyanarayanan. Balancing
performance, energy, and quality in pervasive
computing. In Distributed Computing Systems, 2002.
Proceedings. 22nd International Conference on, pages
217–226. IEEE, 2002.
[17] M. Frigo and S. G. Johnson. The design and
implementation of FFTW3. Proceedings of the IEEE,
93(2):216–231, 2005. Special issue on “Program
Generation, Optimization, and Platform Adaptation”.
[18] G. Goertzel. An algorithm for the evaluation of ﬁnite
trigonometric series. American mathematical monthly,
pages 34–35, 1958.
[19] S. Kang, J. Lee, H. Jang, H. Lee, Y. Lee, S. Park,
T. Park, and J. Song. Seemon: Scalable and
energy-eﬃcient context monitoring framework for
sensor-rich mobile environments. In Proceedings of the
6th International Conference on Mobile Systems,
Applications, and Services, MobiSys ’08, pages
267–280, New York, NY, USA, 2008. ACM.
[20] A. Kansal, S. Saponas, A. B. Brush, K. S. McKinley,
T. Mytkowicz, and R. Ziola. The latency, accuracy,
and battery (lab) abstraction: Programmer
productivity and energy eﬃciency for continuous
mobile context sensing. In Proceedings of the 2013
ACM SIGPLAN International Conference on Object
Oriented Programming Systems Languages &
Applications, OOPSLA ’13, pages 661–676, New York,
NY, USA, 2013. ACM.
[21] A. Lachenmann, P. J. Marr´on, D. Minder, and
K. Rothermel. Meeting lifetime goals with energy
levels. In Proceedings of the 5th international
conference on Embedded networked sensor systems,
SenSys ’07, pages 131–144, New York, NY, USA,
2007. ACM.
[22] X. Li, M. Garzaran, and D. Padua. Optimizing sorting
with machine learning algorithms. In Proceedings of
Parallel and Distributed Processing Symposium, March
2007.
[23] T.-Y. Lin, T.-A. Lin, C.-H. Hsu, and C.-T. King.
Context-aware decision engine for mobile cloud
oﬄoading. In Wireless Communications and
Networking Conference Workshops (WCNCW), 2013
IEEE, pages 111–116, April 2013.
[24] H. Lu, J. Yang, Z. Liu, N. D. Lane, T. Choudhury,
and A. T. Campbell. The jigsaw continuous sensing
engine for mobile phone applications. In Proceedings of
the 8th ACM Conference on Embedded Networked
Sensor Systems, SenSys ’10, pages 71–84, New York,
NY, USA, 2010. ACM.
[25] S. Nath. Ace: Exploiting correlation for
energy-eﬃcient and continuous context sensing. In
Proceedings of the 10th International Conference on
Mobile Systems, Applications, and Services, MobiSys
’12, pages 29–42, New York, NY, USA, 2012. ACM.
[26] B. D. Noble, M. Satyanarayanan, D. Narayanan, J. E.
Tilton, J. Flinn, and K. R. Walker. Agile
application-aware adaptation for mobility. SIGOPS
Oper. Syst. Rev., 31(5):276–287, Oct. 1997.
[27] C. Perera, A. Zaslavsky, P. Christen, and
D. Georgakopoulos. Context aware computing for the
internet of things: A survey. Communications Surveys
Tutorials, IEEE, 16(1):414–454, First 2014.
[28] S. Reddy, J. Burke, D. Estrin, M. Hansen, and
M. Srivastava. Determining transportation mode on
mobile phones. In Wearable Computers, 2008. ISWC
2008. 12th IEEE International Symposium on, pages
25–28. IEEE, 2008.
[29] J. Ryder, B. Longstaﬀ, S. Reddy, and D. Estrin.
Ambulation: A tool for monitoring mobility patterns
over time using mobile phones. In Computational
Science and Engineering, 2009. CSE’09. International
Conference on, volume 4, pages 927–931. IEEE, 2009.
398

---

## Page 14

[30] M. Satyanarayanan. Pervasive computing: Vision and
challenges. Personal Communications, IEEE,
8(4):10–17, 2001.
[31] B. Schilit and M. Theimer. Disseminating active map
information to mobile hosts. Network, IEEE,
8(5):22–32, Sept 1994.
[32] B. C. Smith. Procedural reﬂection in programming
languages. PhD thesis, Massachusetts Institute of
Technology, 1982.
[33] J. Sorber, A. Kostadinov, M. Garber, M. Brennan,
M. D. Corner, and E. D. Berger. Eon: a language and
runtime system for perpetual systems. In Proceedings
of the 5th international conference on Embedded
networked sensor systems, SenSys ’07, pages 161–174,
New York, NY, USA, 2007. ACM.
[34] N. Vallina-Rodriguez and J. Crowcroft. Erdos:
Achieving energy savings in mobile os. In Proceedings
of the Sixth International Workshop on MobiArch,
MobiArch ’11, pages 37–42, New York, NY, USA,
2011. ACM.
[35] X. Zhao, Y. Guo, Q. Feng, and X. Chen. A system
context-aware approach for battery lifetime prediction
in smart phones. In Proceedings of the 2011 ACM
Symposium on Applied Computing, SAC ’11, pages
641–646, New York, NY, USA, 2011. ACM.
399
