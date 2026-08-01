# nature07127

---

## Page 1

In the past two decades, a broad range of fundamental discoveries have
been made in the field of quantum information science, from a quantum
algorithm that places public-key cryptography at risk to a protocol for
the teleportation of quantum states1. This union of quantum mechan-
ics and information science has allowed great advances in the under-
standing of the quantum world and in the ability to control coherently
individual quantum systems2. Unique ways in which quantum systems
process and distribute information have been identified, and powerful
new perspectives for understanding the complexity and subtleties of
quantum dynamical phenomena have emerged.
In the broad context of quantum information science, quantum
networks have an important role, both for the formal analysis and the
physical implementation of quantum computing, communication
and metrology2–5. A notional quantum network based on proposals in
refs 4, 6 is shown in Fig. 1a. Quantum information is generated, pro-
cessed and stored locally in quantum nodes. These nodes are linked
by quantum channels, which transport quantum states from site to
site with high fidelity and distribute entanglement across the entire
network. As an extension of this idea, a ‘quantum internet’ can be envis-
aged; with only moderate processing capabilities, such an internet could
accomplish tasks that are impossible in the realm of classical physics,
including the distribution of ‘quantum software’7.
Apart from the advantages that might be gained from a particular
algorithm, there is an important advantage in using quantum connec-
tivity, as opposed to classical connectivity, between nodes. A network
of quantum nodes that is linked by classical channels and comprises k
nodes each with n quantum bits (qubits) has a state space of dimension
k2n, whereas a fully quantum network has an exponentially larger state
space, 2kn. Quantum connectivity also provides a potentially powerful
means to overcome size-scaling and error-correlation problems that
would limit the size of machines for quantum processing8. At any stage
in the development of quantum technologies, there will be a largest size
attainable for the state space of individual quantum processing units,
and it will be possible to surpass this size by linking such units together
into a fully quantum network.
A different perspective of a quantum network is to view the nodes
as components of a physical system that interact by way of the quan-
tum channels. In this case, the underlying physical processes used
for quan tum network protocols are adapted to simulate the evolution of
quan tum many-body systems9. For example, atoms that are localized
at separate nodes can have effective spin–spin interactions catalysed by
single-photon pulses that travel along the channels between the nodes10.
This ‘quantum wiring’ of the network allows a wide range for the effec-
tive hamiltonian and for the topology of the resultant ‘lattice’. Moreover,
from this perspective, the extension of entanglement across quantum
networks can be related to the classical problem of percolation11.
These exciting opportunities provide the motivation to examine
research related to the physical processes for translating the abstract
illustration in Fig. 1a into reality. Such considerations are timely because
scientific capabilities are now passing the threshold from a learning phase
with individual systems and advancing into a domain of rudimentary
functionality for quantum nodes connected by quantum channels.
In this review, I convey some basic principles for the physical imp-
lementation of quantum networks, with the aim of stimulating the
involvement of a larger community in this endeavour, including in
systems-level studies. I focus on current efforts to harness optical pro-
cesses at the level of single photons and atoms for the transportation of
quantum states reliably across complex quantum networks.
Two important research areas are strong coupling of single photons
and atoms in the setting of cavity quantum electrodynamics (QED)12 and
quantum information processing with atomic ensembles13, for which
crucial elements are long-lived quantum memories provided by the
atomic system and efficient, quantum interfaces between light and
matter. Many other physical systems are also being investigated and are
discussed elsewhere (ref. 2 and websites for the Quantum Computa-
tion Roadmap (<http://qist.lanl.gov/qcomp_map.shtml>), the SCALA Int-
egrated Project (<http://www.scala-ip.org/public>) and Qubit Applications
(<http://www.qubitapplications.com>)).
A quantum interface between light and matter
The main scientific challenge in the quest to distribute quantum states
across a quantum network is to attain coherent control over the inter-
actions of light and matter at the single-photon level. In contrast to
atoms and electrons, which have relatively large long-range interac-
tions for their spin and charge degrees of freedom, individual photons
typically have interaction cross-sections that are orders of magnitude
too small for non-trivial dynamics when coupled to single degrees of
freedom for a material system.
The optical physics community began to address this issue in the
1990s, with the development of theoretical protocols for the coherent
transfer of quantum states between atoms and photons in the setting of
cavity QED6,14,15. Other important advances have been made in the past
The quantum internet
H. J. Kimble1
Quantum networks provide opportunities and challenges across a range of intellectual and technical
frontiers, including quantum computation, communication and metrology. The realization of quantum
networks composed of many nodes and channels requires new scientific capabilities for generating and
characterizing quantum coherence and entanglement. Fundamental to this endeavour are quantum
interconnects, which convert quantum states from one physical system to those of another in a reversible
manner. Such quantum connectivity in networks can be achieved by the optical interactions of single
photons and atoms, allowing the distribution of entanglement across the network and the teleportation
of quantum states between nodes.
1Norman Bridge Laboratory of Physics 12–33, California Institute of Technology, Pasadena, California 91125, USA.
1023
INSIGHT REVIEW
NATURE|Vol 453|19 June 2008|doi:10.1038/nature07127

---

## Page 2

decade2,4, including with atomic ensembles13,16. The reversible mapping of
quantum states between light and matter provides the basis for quantum-
optical interconnects and is a fundamental primitive (building block)
for quantum networks. Although the original schemes for such inter-
connects are sensitive to experimental imperfections, a complete set of
theoretical protocols has subsequently been developed for the robust
distribution of quantum information over quantum networks, inclu-
ding, importantly, the quantum repeater4,17 and scalable quantum
networks with atomic ensembles13.
A generic quantum interface between light and matter is depicted
in Fig. 1b. This interface is described by the interaction hamiltonian
Hint(t), where for typical states Hint(t) ≈ χ(t), with  being h/2π (where
h is Planck’s constant) and χ(t) being the time-dependent coupling
strength between the internal material system and the electromagnetic
field. Desirable properties for a quantum interface include that χ(t)
should be ‘user controlled’ for the clocking of states to and from the
quantum memory (for example, by using an auxiliary laser), that the
physical processes used should be robust in the face of imperfections
(for example, by using adiabatic transfer) and that mistakes should be
efficiently detected and fixed (for example, with quantum error correc-
tion). In qualitative terms, the rate κ, which characterizes the bandwidth
of the input–output channel, should be large compared with the rate γ,
which characterizes parasitic losses, and both of these rates should be
small compared with the rate of coherent coupling χ.
Examples of physical systems for realizing a quantum interface and
distributing coherence and entanglement between nodes are shown
in Fig. 1c, d. In the first example (Fig. 1c), single atoms are trapped in
optical cavities at nodes A and B, which are linked by an optical fibre.
External fields control the transfer of the quantum state Ψ stored in the
atom at node A to the atom at node B by way of photons that propagate
from node A to node B6,18. In the second example (Fig. 1d), a single-
photon pulse that is generated at node A is coherently split into two
a
b
c
d
Quantum
node
Quantum channel
out(t)
Node A
Node B
k
in(t)
(t)
(t)
k
k
Node B
Node C
k
Node A
c ≈
〈Hint〉

k
c ≈
〈Hint〉

g
Y
A
W
Y
B
W
B
W
C
W
g
g
g
Figure 1 | Quantum networks. a, Shown is a notional quantum network
composed of quantum nodes for processing and storing quantum states and
quantum channels for distributing quantum information. Alternatively, such
a network can be viewed as a strongly correlated many-particle system. b, The
quantum interface between matter (coloured cube) and light (red curves) is
depicted. Coherent interactions in the node are characterized by the rate χ;
coupling between the node and photons in the external channel occurs at the
rate κ; and parasitic losses occur at the rate γ. c, Quantum state transfer and
entanglement distribution from node A to node B is shown in the setting of
cavity quantum electrodynamics (QED)6. At node A, a pulse of the control
field ΩA
out(t) causes the transformation of atomic state Ψ into the state of a
propagating optical field (that is, into a flying photon). At node B, the pulse
Ωi
B
n(t) is applied to map the state of the flying photon into an atom in the
cavity, thereby realizing the transfer of the state Ψ from node A to node B
(ref. 18). d, The distribution of entanglement by using ensembles of a large
number of atoms is shown13. A single-photon pulse at node A is coherently
split into two entangled components that propagate to node B and node C
and then are coherently mapped by the control fields Ωin
B, C(t) into a state that
is entangled between collective excitations in each ensemble at node B and
node C. At later times, components of the entangled state can be retrieved
from the quantum memories by separate control fields, Ωo
B,
u
C
t(t) (ref. 19).
Hint(t), interaction hamiltonian; , h/2π (where h is Planck’s constant).
1024
NATURE|Vol 453|19 June 2008
INSIGHT REVIEW

---

## Page 3

components and propagates to nodes B and C, where the entangled
photon state is coherently mapped into an entangled state between col-
lective excitations at each of the two nodes13,19. Subsequent read-out of
entanglement from the memories at node B and/or node C as photon
pulses is implemented at the ‘push of a button’.
Cavity QED
At the forefront of efforts to achieve strong, coherent interactions
between light and matter has been the study of cavity QED20. In both
the optical12,21 and the microwave22–25 domains, strong coupling of single
atoms and photons has been achieved by using electromagnetic reso-
nators of small mode volume (or cavity volume) Vm with quality fac-
tors Q ≈ 107–1011. Extensions of cavity QED to other systems26 include
quantum dots coupled to micropillars and photonic bandgap cavities27,
and Cooper pairs interacting with superconducting resonators (that is,
circuit QED; see ref. 28 for a review).
Physical basis of strong coupling
Depicted in Fig. 2a is a single atom that is located in an optical resona-
tor and for which strong coupling to a photon requires that a single
intracavity photon creates a ‘large’ electric field. Stated more quanti-
tatively, if the coupling frequency of one atom to a single mode of an
optical resonator is g (that is, 2g is the one-photon Rabi frequency),
then

________

ε•μ02 ωC

g = ________
(1)

√ 2ε0Vm
where μ0 is the transition dipole moment between the relevant atomic
states (with transition frequency ωA), and ωC ≈ ωA is the resonant fre-
quency of the cavity field, with polarization vector ε. Experiments in cav-
ity QED explore strong coupling with g >> (γ, κ), where γ is the atomic
decay rate to modes other than the cavity mode and κ is the decay rate
of the cavity mode itself. Expressed in the language of traditional opti-
cal physics, the number of photons required to saturate the intracavity
atom is n0 ≈ γ2/g2, and the number of atoms required to have an appreci-
able effect on the intracavity field is N0 ≈ κγ/g2. Strong coupling in cavity
QED moves beyond traditional optical physics, for which (n0, N0) >> 1,
to explore a qualitatively new regime with (n0, N0) << 1 (ref. 12).
In the past three decades, a variety of approaches have been used to
achieve strong coupling in cavity QED12,20–25. In the optical domain, a
route to strong coupling is the use of high-finesse optical resonators
(F ≈ 105–106) and atomic transitions with a large μ0 (that is, oscillator
strengths near unity). Progress along this path is illustrated in Fig. 2c,
with research now far into the domain (n0, N0) << 1.
As the cavity volume Vm is reduced to increase g (equation (1)), the
requirement for atomic localization becomes more stringent. Not sur-
prisingly, efforts to trap and localize atoms in high-finesse optical cavi-
ties in a regime of strong coupling have been central to studies of cavity
QED in the past decade, and the initial demonstration was in 1999
(ref. 29). Subsequent advances include extending the time for which an
atom is trapped to 10 s (refs 30, 31); see ref. 32 for a review. Quantum
control over both internal degrees of freedom (that is, the atomic dipole
and the cavity field) and external degrees of freedom (that is, atomic
motion) has now been achieved for a strongly coupled atom–cavity
system33. And an exciting prospect is cavity QED with single trapped
ions, for which the boundary for strong coupling has been reached34.
Coherence and entanglement in cavity QED
Applying these advances to quantum networks has allowed single pho-
tons to be generated ‘on demand’ (Box 1). Through strong coupling of
the cavity field to an atomic transition, an external control field Ω(t)
transfers one photon into the cavity mode and then to free space by
way of the cavity output mirror, leading to a single-photon pulse ϕ1(t)
as a collimated beam. The temporal structure (both amplitude and
phase) of the resultant ‘flying photon’ ϕ1(t) can be tailored by way of
the control field Ω(t) (refs 6, 35), with the spatial structure of the wave
packet being set by the cavity mode.
Several experiments have confirmed the essential aspects of this
process for the deterministic generation of single photons30,34,36. Sig-
nificantly, in the ideal (adiabatic) limit, the excited state e of the atom
is not populated because of the use of a ‘dark state’ protocol37. By deter-
ministically generating a bit stream of single-photon pulses from single
trapped atoms, these experiments are a first step in the development of
quantum networks based on flying photons.
Compared with the generation of single photons by a variety of other
systems38, one of the distinguishing aspects of the dark-state protocol
(Box 1) is that it should be reversible. That is, a photon that is emitted
from a system A should be able to be efficiently transferred to another
system B by applying the time-reversed (and suitably delayed) field Ω(t)
to system B (Fig. 1c). Such an advance was made18 by implementing
the reversible mapping of a coherent optical field to and from internal
states of a single trapped caesium atom. Although this experiment was
imperfect, it provides the initial verification of the fundamental primi-
tive on which the protocol for the physical implementation of quantum
networks in ref. 6 is based (an important theoretical protocol that has
been adapted to many theoretical and experimental settings).
a
10 µm
c
b
10–4
10–2
1
102
104
2010
2005
2000
1995
1990
1985
1980
Time (years)
Critical photon number n0
k
g
g
Figure 2 | Elements of cavity QED. a, Shown is a simple schematic of an
atom–cavity system depicting the three governing rates (g, κ, γ) in cavity
QED, where g ≈ χ in Fig. 1. Coherent exchange of excitation between the
atom and the cavity field proceeds at rate g, as indicated by the dashed arrow
for the atom and the green arrows for the cavity field. b, A photograph of
two mirror substrates that form the Fabry–Pérot cavity, which is also shown
schematically. The cavity length l = 10 μm, waist w0 = 12 μm transverse to the
cavity axis, and finesse F ≈ 5 × 105. The supporting structure allows active
servo control of the cavity length to δl ≈ 10−14 m (ref. 12). Scale bar, 3 mm.
c, The reduction in the critical photon number n0 over time is shown for
a series of experiments in cavity QED that were carried out by the Caltech
Quantum Optics Group. These experiments involved either spherical-mirror
Fabry–Pérot cavities (circles) or the whispering-gallery modes of monolithic
SiO2 resonators (squares). The data points shown for 2006 and 2008 are for a
microtoroidal SiO2 resonator75,76; those for 2009 and 2011 (open squares) are
projections for this type of resonator77.
1025
NATURE|Vol 453|19 June 2008
INSIGHT REVIEW

---

## Page 4

The adiabatic transfer of quantum states (as described in Box 1, as
well as related possibilities10,35) relies on strong coupling between an
atom and a single polarization of the intracavity field. However, by
extending the ideas in Box 1 to the two polarization eigenmodes of the
cavity for given transverse and longitudinal mode orders, it is possible
to generate entanglement between the internal states of the atom and
the polarization state of a coherently generated photon39–41. An initial
control field Ω1(t1) results in entanglement between internal states of the
atom b, b±, and the polarization state of a flying photon ϕ±
field(t1) that
is coherently generated by the coupled atom–cavity system. Applying a
second control field Ω2(t2) returns the atom to its initial (unentangled)
state while generating a second flying photon ξ±
field(t2), thereby leading
to entanglement between the polarizations of the fields, ϕ±
field and ξ±
field,
emitted at times t1 and t2.
Such a sequence of operations has been applied to single rubidium atoms
falling through a high-finesse optical cavity21. In this study, entangled pho-
tons were generated with a time separation τ = t2 − t1 limited by the atomic
transit time. Although the atoms arrived randomly into the cavity mode
in this case, the protocol itself is intrinsically deterministic. With trapped
atoms, it will be possible to generate entangled states at user selected times
(t1, t2) at the ‘push of a button.’ Moreover, the scheme is inherently revers-
ible, so the entanglement between atom and field can be used to distribute
entanglement to a second atom–cavity system in a network.
In a broader context, important advances have been made in the
generation and transfer of quantum states in other physical systems,
including quantum dots42 and circuits28 coupled to cavities.
With the maturation of experimental capabilities in cavity QED that is
now evident, many previously developed theoretical protocols will become
possible. These include the sequential generation of entangled multiqubit
states43, the teleportation of atomic states from one node to another15,
photonic quantum computation by way of photon–photon interactions
at the nodes35 and reversible mapping of quantum states of atomic motion
to and from light44. Clearly, new technical capabilities beyond conven-
tional (Fabry–Pérot) cavities will be required to facilitate such scientific
investigations; several candidate systems are discussed in Box 2.
Quantum networks with atomic ensembles
An area of considerable research activity in the quest to distribute
coherence and entanglement across quantum networks has been the
interaction of light with atomic ensembles that consist of a large col-
lection of identical atoms. For the regime of continuous variables,
entangle ment has been achieved between two atomic ensembles, each
of which consists of ~1012 atoms45, and the quantum teleportation of
light to matter has been demonstrated by mapping coherent optical
states to the collective spin states of an atomic memory46. Further
research of the continuous variables regime is reviewed elsewhere47.
Here I focus, instead, on the regime of discrete variables, with photons
and atomic excitations considered one by one.
Reversible transfer of a state between light and a single trapped atom
can be achieved through the mappings b1 䧛 a0 and a0 䧛 b1
for the coherent absorption and emission of single photons (in panel A,
a and b of the figure, respectively)18. In this case, a and b represent
internal states of the atom with long-lived coherence (for example,
atomic hyperfine states in the 6S1/2, F = 3 and F = 4 manifolds of atomic
caesium), and 0 and 1 are Fock states of the photons in the intracavity
field with n = 0 and n = 1 excitations, respectively. The transition
between b and e is strongly coupled to a mode of an optical
cavity with interaction energy g, where g (in green) is the coherent
coupling rate of the atom and the photon. In this simple setting, the
interaction hamiltonian for atom and cavity field has a dark state D
(that is, there is no excited state component e)37, as given by
D = cosθa0 + sinθb1, where

Ω2(t)

cosθ = 1+ ______
−1/2

(1)

g2
with Ω(t) as a classical control field14. For Ω(t = 0) = 0, then D = a0.
By contrast, for Ω(t 䧛 ∞) >> g, D 䧛 b1.
Panel A, a of the figure shows that by adiabatically ramping a control
field Ω1(t) >> g from on to off over a time ∆t that is slow compared
with 1/g, the atomic state is mapped from b to a with the
accompanying coherent absorption of one intracavity photon.
Conversely, in panel A, b of the figure, by turning a control field Ω2(t)
from off to on, the atomic state is mapped from a to b with the
transfer of one photon into the cavity mode.
These two processes can be combined to achieve the coherent
transfer of the state of a propagating optical field λ(t) = ϕfield(t) into
and out of a quantum memory formed by the atomic states a and b
(ref. 18; figure, panel B). In the ideal case, the mapping is specified by
ϕfield(t)b 䧛 0(c1a + c0b) … (storage) … 0(c1a + c0b) 䧛 ϕfield(t + τ)b,
where the field state is taken to be a coherent superposition of zero (c0)
and one (c1) photon, ϕfield(t) = E[t](c00field + c11field). E(t) is the envelope
of the field external to the cavity, with ∫E(t)2dt = 1; t + τ is a user-selected
time (discussed below). Given timing information for the incoming field
ϕfield(t), the first step in this process (figure, panel B, a) is accomplished by
adiabatically ramping the control field Ω1(t) from on to off, as in A, a. After
this step, the internal states of the atom provide a long-lived quantum
memory (figure, panel B, b). At a user-selected later time t + τ, the final
step is initiated (figure, panel B, c) by turning Ω2(t + τ) from off to on (as
in A, b), thereby coherently mapping the atomic state c1a + c0b back to
the ‘flying’ field state β(t) = ϕfield(t + τ).
Box 1 | Mapping quantum states between atoms and photons
a
b
c
a
b
1(t)
Ω
2(t)
Ω
1(t)
Ω
2(t)
Ω
e〉
a〉
b〉
g
e〉
a〉
b〉
g
1(t)
Ω
2(t + t)
Ω
l(t)
b(t)
t
t
A
B
1〉
1〉


1026
NATURE|Vol 453|19 June 2008
INSIGHT REVIEW

---

## Page 5

Writing and reading collective spin excitations
Research on discrete quantum variables is based on the remarkable
theoretical protocol described in ref. 13, in which Luming Duan,
Mikhail Lukin, Juan Ignacio Cirac and Peter Zoller presented a realistic
scheme for entanglement distribution by way of a quantum-repeater
architecture4,17. Fundamental to this protocol, which is known as the
DLCZ protocol, is the generation and retrieval of single ‘spin’ exci-
tations within an ensemble of a large number of atoms48 (Box 3).
Together with photoelectric detection of field 1, a laser pulse (‘write’
pulse) creates a single excitation 1a that is stored collectively within
the atomic ensemble. At a later time, a second laser pulse (‘read’ pulse)
deterministically converts excitation stored within the atomic memory
in the state 1a into a propagating field, denoted field 2.
The basic processes illustrated in Box 3 can be extended to create an
entangled pair of ensembles, L and R (ref. 13; Fig. 3a). The entangled
state is generated in a probabilistic but heralded49 manner from quan-
tum interference in the measurement process. That is, detection of a
photon from one atomic ensemble or the other in an indistinguishable
manner results in an entangled state with one collective spin excita-
tion shared coherently between the ensembles. In the ideal case, and
to lowest-order probability, a photoelectric detection event at either
of the two detectors projects the ensembles into the entangled state
ΨL,R =   —
√ (0aL1aR ± eiη11aL0aR), with the sign (+ or −) set by whether
detector 1 or detector 2 records the event. The phase η1 is determined by
the difference between the phase shifts along the two channels, η1 = βL - βR
(ref. 49), which must be stable. Any given trial with a ‘write’ pulse is
unlikely to produce a detection event at either detector, and such failed
trials require the system to be reinitialized. However, a photo electric
detection event at either detector unambiguously heralds the creation
of the entangled state. Limited by the coherence time between the meta-
stable lower atomic states gi and si for all atoms i = 1, 2, ... , Na within
the ensemble (ref. 50; Box 3), this entangled state is stored in the quan-
tum memory provided by the ensembles and is available ‘on demand’ for
subsequent tasks, such as entanglement connection13,51.
Although the above description is for an ideal case and neglects
higher-order terms, the DLCZ protocol is designed to be resilient to
To build large-scale quantum networks4,6, many quantum nodes
will need to be interconnected over quantum channels. Because
conventional (Fabry–Pérot) configurations are ill suited for this purpose,
there have been efforts to develop alternative microcavity systems26,
both for single atoms75,76,78 and for atom-like systems (such as nitrogen–
vacancy centres in diamond79). A quantitative comparison of candidate
systems is provided in ref. 77.
A remarkable resonator for this purpose is the microtoroidal cavity
that is formed from fused SiO2 (refs 80,81) (shown in the figure).
Such a resonator supports a whispering-gallery mode82 circulating
around the outer circumference of the toroid (shown in cross-section
in grey, in panel a of the figure), with an evanescent field external to
the resonator. The intensity of the resonator mode is indicated by the
coloured contours. Because of the small mode volume Vm and large
quality factor Q, an atom (blue) interacting with the evanescent field of
a whispering-gallery mode can be far into the regime of strong coupling,
with projected values for the critical photon n0 and atom N0 numbers
(n0 ≈ 2 x 10−5 and N0 ≈ 10−6)77 that are significantly greater than current12
and projected77 values for cavity QED with Fabry–Pérot cavities (Fig. 2c).
Pioneering fabrication techniques80,81 lend themselves to the
integration of many microtoroidal resonators to form optical networks,
as illustrated in panel b and c of the figure. Panel b shows a photograph
of a silicon chip with a linear array of microtoroidal resonators within
an ultrahigh-vacuum apparatus76. The toroids appear as small
scattering centres on a silicon chip that runs vertically down the centre
of the picture. Black arrows indicate a horizontal SiO2 fibre taper for
coupling light to and from one resonator. Scale bar, 2 mm. Panel c is a
scanning electron micrograph of an array of microtoroidal resonators
(a magnification of the region bounded by the white box in panel b),
showing toroids of fused SiO2 on silicon supports80.
These resonators have the capability for input–output coupling with
small parasitic loss81 for the configuration shown in panel d (scale
bar, 10 μm), which is a micrograph of an individual toroid and fibre
taper from panel b76. Q = 4 × 108 has been realized at λ = 1,550 nm, and
Q ≈ 108 at λ = 850 nm, with good prospects for improvement to Q ≈ 1010
(ref. 77). For these parameters, the efficiency ε for coupling quantum
fields into and out of the resonator could approach ε ≈ 0.99–0.999
while remaining firmly in the regime of strong coupling77. Such high
efficiency is crucial for the realization of complex quantum networks,
including for distributing and processing quantum information4,6,35 and
for investigating the association between quantum many-body systems
and quantum networks9,11.
The initial step in this quest to realize a quantum network was the
demonstration of strong coupling between individual atoms and
the field of a microtoroidal resonator75. More recently, non-classical
fields have been generated from the interaction of single atoms with
a microtoroidal resonator by way of a ‘photon turnstile’, for which a
single atom dynamically regulates the transport of photons one by one
through the microtoroidal resonator76 (figure, panel d). Only single
photons can be transmitted in the forward direction (from right to left
in the figure), with excess photons n > 1 dynamically rerouted to the
backward direction.
Box 2 | A new paradigm for cavity QED
a
b
c
d
Out
Photons
In
Out
Atom
1027
NATURE|Vol 453|19 June 2008
INSIGHT REVIEW

---

## Page 6

important sources of imperfections, including losses in propagation
and detection, and detector dark counts. Indeed, the scheme functions
with ‘built-in entanglement purification’13 and enables entanglement
to be extended beyond the separation of two ensembles in an efficient
and scalable manner. Theoretical extensions52,53 of the DLCZ protocol
have examined related network architectures for optimizing scalability
in view of laboratory capabilities (discussed below).
Coherence and entanglement with atomic ensembles
The initial, enabling, steps in the implementation of the DLCZ proto-
col were observations of quantum correlations both for single photon
pairs54,55 and for a large number of photons (103–104) (ref. 56) generated
in the collective emission from atomic ensembles. Single photons were
generated by the efficient mapping of stored collective atomic excita-
tion to propagating wave packets for field 2 (refs 57–61; Box 3). Condi-
tional read-out efficiencies of 50% in free space58 and 84% in a cavity62
were realized for state transfer from a single collective ‘spin’ excitation
stored in the atomic ensemble to a single photon for field 2.
With these capabilities for coherent control of collective atomic emis-
sion, heralded entanglement between ensembles separated by 3 m was
achieved in 2005 (ref. 49). More recent work has led to the inference
that the concurrence C (ref. 63) of entanglement stored between the two
ensembles in Fig. 3 is C = 0.9±0.3 (ref. 50), with the associated density
matrix shown in Fig. 3b.
The DLCZ protocol is based on a quantum-repeater architecture
involving independent operations on parallel chains of quantum
systems13, with scalability relying crucially on conditional control of
quantum states stored in remote quantum memories64. The experiment
shown in Fig. 3c took an important step towards this goal by achieving
the minimal functionality required for scalable quantum networks65.
Apart from the DLCZ protocol, which involves measurement-
induced entanglement, it is also possible to achieve deterministic
mapping of quantum states of light into and out of atomic ensembles
by using electromagnetically induced transparency16,66. Pioneering
work67,68 demonstrated the storage and retrieval of classical pulses to
and from an atomic ensemble. This work was then extended into the
quantum regime of single photons69,70. Entanglement between two
ensembles coupled to a cavity mode was achieved by adiabatic transfer
of excitation71, thereby providing a means for on-demand entangle-
ment. In addition, the reversible mapping of photonic entanglement
into and out of pairs of quantum memories has been achieved19 by an
electromagnetically-induced-transparency process, which should assist
the distribution of entanglement over quantum networks (Fig. 1d).
Contemporary with this work on heralded and deterministic entangle-
ment, a variety of experiments based on entanglement as a post diction
have been carried out72 (that is, for cases in which a physical state is not
available for use in a scalable network but which are nonetheless signifi-
cant). An important advance in this regard is the use of a pair of ensembles
for entanglement generation to achieve a posteriori teleportation of light
to an atomic memory73.
There has also been considerable effort devoted to the detailed charac-
terization of decoherence for stored atomic excitation and entangle-
ment50,65,73. Decoherence of entanglement between distinct atomic
ensembles has been observed in the decay of the violation of Bell’s
inequality65 and of the fidelity for teleportation73. By measuring concur-
rence C(t), quantitative characterizations of the relationship between
the global evolution of the entangled state and the temporal dynamics
of various local correlations were also able to be made50.
Extending entanglement for quantum networks
The entangled states that have been created so far both in cavity QED
and by using the DLCZ protocol are between pairs of systems (known
as bipartite entanglement) for which there are definitive procedures
for operational verification72. The creation of more-general classes of
entangled state shared between more than two nodes would be of great
interest. However, as researchers progress towards more-complex quan-
tum networks, the issue of entanglement verification becomes increas-
ingly problematic. At present, the theoretical tools and experimental
The DLCZ protocol13 is based on ensembles of Na identical atoms (blue)
with a Λ-level configuration, as shown in the figure. The metastable
lower states g and s can be, for example, atomic hyperfine states
of the electronic ground level to ensure a long lifetime for coherence.
All atoms are initially prepared in state g with no excitation (figure,
panel a), namely 0a  i
Na gi, and a weak off-resonant ‘write’ pulse
is then sent through the ensemble. This results in a small probability
of amplitude √p that one of the Na atoms will be transferred from g
to s and will emit a photon into the forward-scattered optical mode
(designated field 1) with a frequency and/or polarization distinct from
the write field.
For small excitation probability p<<1, in most cases nothing happens
as a result of the writing pulse, so the resultant state ϕa,1 for the atomic
ensemble and field 1 in the ideal case is given by

ϕa,1  0a01 + eiβ√p1a11 + O(p)
(1)
where n1 is the state of the forward-propagating field 1 with n1 photons
(n1 = 0 or 1), the phase β is determined by the propagation phases of
the write pulse and field 1, and O(p) denotes of order p. The atomic
state 1a in equation (1) (above) is a collective (entangled) state with
one excitation shared symmetrically between the Na atoms (that is,
one ‘spin flip’ from g to s), where in the ideal case13

1
Na

1a = ____ Σ gi … si … gNa
(2)

√N—
a
i=1
Field 1 is directed to a single-photon detector, where a detection event is
recorded with probability p. Such an event for field 1 heralds that a single
excitation (or spin flip from g to s) has been created and stored in the
atomic ensemble in the state 1a with high probability. Higher-order
processes with multiple atomic and field 1 excitations are also possible
and ideally occur, to lowest order, with probability p2.
After a user-defined delay (subject to the finite lifetime of the
quantum memory), the collective atomic excitation 1a can be
efficiently converted to a propagating beam (designated field 2) by way
of a strong ‘read’ pulse (figure, panel b), where in the ideal case there
is a one-to-one transformation of atomic excitation to field excitation,
1a to 12. In the case of resonance with the transition from s to e,
the reading process utilizes the phenomenon of electromagnetically
induced transparency16,66.
Box 3 | Writing and reading single atomic excitations
Write
Field 1
Field 2
Read
Field 1
Field 2
Write
Read
a
b
e〉
e〉
g〉
s〉
s〉
g〉
1028
NATURE|Vol 453|19 June 2008
INSIGHT REVIEW

---

## Page 7

capabilities for characterizing the general states of quantum networks
do not exist.
Perhaps surprisingly, a non-trivial task will be to find out whether a
quantum network ‘works’. As moderately complex quantum networks are
realized in the laboratory, it will become increasingly more difficult to assess
the characteristics of a network quantitatively, including whether entangle-
ment extends across the whole network. One strategy, motivated by the
underlying physical processes of the network, could be to try to determine
the density matrix ρ(t) for the network. However, this approach would fail
because of the exponential growth in ρ(t) with the size of a network.
An alternative strategy could be based on more functional issues
of algorithmic capability. An attempt could be made to implement a
quantum algorithm for computation or communication to test whether
the purported quantum network has greater capabilities than any clas-
sical counterpart. This course is, however, problematic because the
advantage of a quantum network might only be realized above some
threshold in the size of the network. Furthermore, from an experi-
mental perspective, this strategy does not offer much in the way of
diagnostics for ‘fixing’ the network when it fails.
Another, less obvious, approach might be to adopt more seriously
the perspective of a quantum network as a quantum many-body sys-
tem and to search for more ‘physical’ characteristics of the network (for
example, the scaling behaviour of pair correlation functions and multi-
partite entanglement). Indeed, an active area of research is the nature of
entanglement for systems that undergo quantum phase transitions, and
there have been pioneering advances in the study of one-dimensional
spin chains74.
Conclusion
Progress has been made towards the development of quantum net-
works, but the current state of the art is primitive relative to that
required for the robust and scalable implementation of sophisticated
network protocols, whether over short or long distances. The real-
ization of quantum memories, local quantum processing, quantum
repeaters and error-corrected teleportation are ambitious goals. Nev-
ertheless, there is considerable activity directed towards these goals
worldwide.
Here cavity-QED-based networks and networks implemented using
the DLCZ protocol were considered separately, but it is clear that quan-
tum networks will evolve as heterogeneous entities. For example, the
same protocol that creates the entanglement between the two ensem-
bles shown in Fig. 3a can be used to create an entangled state with one
excitation shared between an atom in a cavity and an atomic ensemble.
A crucial task will be the development of unambiguous procedures for
verifying entanglement, a non-trivial undertaking that has not always
been carried out correctly72.
I have used quantum networks as a unifying theme, but the research
described here has broader value, including advancing the understand-
ing of quantum dynamical systems and, for the cases considered here,
creating new physics from controlled nonlinear interactions of single
photons and atoms. These are exciting times in quantum information
science as researchers pass from the regime of individual building
blocks (for example, a single atom–cavity system) to the realm of com-
plex quantum systems that are assembled block by block from many
such units.
■
1.
Nielsen, M. A. & Chuang, I. L. Quantum Computation and Quantum Information
(Cambridge Univ. Press, Cambridge, UK, 2000).
2.
Zoller, P. et al. Quantum information processing and communication. Strategic report
on current status, visions and goals for research in Europe. Eur. Phys. J. D 36, 203–228
(2005).
3.
Bennett, C. H., Brassard, G. & Ekert, A. K. Quantum cryptography. Sci. Am. 267 (4),
50–57 (1992).
4.
Bouwmeester, D., Ekert, A. & Zeilinger, A. (eds) The Physics of Quantum Information
(Springer, Berlin, 2000).
5.
Giovannetti, V., Lloyd, S. & Maccone, L. Quantum-enhanced measurements: beating the
standard quantum limit. Science 306, 1330–1336 (2004).
6.
Cirac, J. I., Zoller, P., Kimble, H. J. & Mabuchi, H. Quantum state transfer and
entanglement distribution among distant nodes in a quantum network. Phys. Rev. Lett.
78, 3221–3224 (1997).
7.
Preskill, J. P. Plug-in quantum software. Nature 402, 357–358 (1999).
8.
Copsey, D. et al. Toward a scalable, silicon-based quantum computing architecture.
IEEE J. Quantum Electron. 9, 1552–1569 (2003).
9.
Illuminati, D. Light does matter. Nature Phys. 2, 803–804 (2006).
10. Duan, L.-M., Wang, B. & Kimble, H. J. Robust quantum gates on neutral atoms with
cavity-assisted photon scattering. Phys. Rev. A 72, 032333 (2005).
11.
Acín, A., Cirac, J. I. & Lewenstein, M., Entanglement percolation in quantum networks.
Nature Phys. 3, 256–259 (2007).
12. Miller, R. et al. Trapped atoms in cavity QED: coupling quantized light and matter. J. Phys.
B. 38, S551–S565 (2005).
13. Duan, L.-M., Lukin, M. D., Cirac, J. I. & Zoller, P. Long-distance quantum communication
with atomic ensembles and linear optics. Nature 414, 413–418 (2001).
14. Parkins, A. S., Marte, P., Zoller, P. & Kimble, H. J. Synthesis of arbitrary quantum states via
adiabatic transfer of Zeeman coherence. Phys. Rev. Lett. 71, 3095–3098 (1993).
a
b
c
Write (R)
Write (L)
Detector 1
Detector 2
1L
1R
u
I
R
u
I
L
rideal
L,R
1
0.5
0
11〉
01〉
10〉
00〉
11〉
01〉
10〉
00〉
50/50
beam
splitter
rexp
L,R
1
0.5
0
11〉
01〉
10〉
00〉
11〉
01〉
10〉
00〉
Figure 3 | Fundamentals of the DLCZ protocol. A realistic scheme for
entanglement distribution by way of a quantum-repeater architecture was
proposed by Duan, Lukin, Cirac and Zoller and is known as the DLCZ
protocol13. a, Measurement-induced entanglement between two atomic
ensembles13,49, L and R, is shown. Synchronized laser pulses incident
on the ensembles (denoted write beams, blue arrows) generate small
amplitudes for optical fields from spontaneous Raman scattering48; these
fields are denoted 1L and 1R (red arrows). These fields interfere at a 50/50
beam splitter, with outputs directed to two single-photon detectors. A
measurement event at either detector (shown for detector 1) projects the
ensembles into the entangled state ΨL,R with one quantum of excitation
shared remotely between the ensembles. Entanglement is stored in the
quantum memory provided by the ensembles and can subsequently be
converted to propagating light pulses by a set of ‘read’ laser pulses (Box 3).
b, Experimentally determined components of the density matrix ρe
L,
x
R
p for
entanglement between two atomic ensembles are shown50, corresponding
to concurrence C = 0.9±0.3, where C = 0 for an unentangled state. The first
number in each ket refers to the excitation number for the ensemble L, and
the second is for the ensemble R. For comparison, the density matrix ρL,
id
R
eal
for the ideal state ΨL,R is shown, with concurrence C = 1. c, The laboratory
set-up is shown for the entanglement of two pairs of atomic ensembles to
generate the functional quantum nodes L and R, which are separated by 3 m
(ref. 65). Each of the four elongated ovals shows a cylinder of 105 caesium
atoms, which forms an atomic ensemble at each site. Entangled states
between the upper u and lower l pairs at the L and R nodes, Ψu
L,R Ψl
L,R, are
generated and stored in an asynchronous manner for each pair (u and l) as
is the case in panel a. Atomic excitations for the pairs Lu, Ll and Ru, Rl are
subsequently converted to flying photons at each node, with a polarization
encoding that results in violation of Bell’s inequality65. The entire experiment
functions under the quantum control of single photon detection events.
1029
NATURE|Vol 453|19 June 2008
INSIGHT REVIEW

---

## Page 8

15. van Enk, S. J., Cirac, J. I. & Zoller, P. Photonic channels for quantum communication.
Science 279, 205–208 (1998).
16. Lukin, M. D. Trapping and manipulating photon states in atomic ensembles. Rev. Mod.
Phys. 75, 457–472 (2003).
17.

Briegel, H.-J., Dür, W., Cirac, J. I. & Zoller, P. Quantum repeaters: the role of imperfect
local operations in quantum communication. Phys. Rev. Lett. 81, 5932–5935
(1998).
18. Boozer, A. D., Boca, A., Miller, R., Northup, T. E. & Kimble, H. J. Reversible state transfer
between light and a single trapped atom. Phys. Rev. Lett. 98, 193601 (2007).
19. Choi, K. S., Deng, H., Laurat, J. & Kimble, H. J. Mapping photonic entanglement into and
out of a quantum memory. Nature 452, 67–71 (2008).
20. Berman, P. (ed.) Cavity Quantum Electrodynamics (Academic, San Diego, 1994).
21. Wilk, T., Webster, S. C., Kuhn, A. & Rempe, G. Single-atom single-photon quantum
interface. Science 317, 488–490 (2007).
22. Walther, H. Quantum optics of single atoms. Fortschr. Phys. 52, 1154–1164 (2004).
23. Meschede, D., Walther, H. & Mueller, G. One-atom maser. Phys. Rev. Lett. 54, 551–554
(1985).
24. Raimond, J. M. et al. Probing a quantum field in a photon box. J. Phys. B 38, S535–S550
(2005).
25. Guerlin, C. et al. Progressive field-state collapse and quantum non-demolition photon
counting. Nature 448, 889–893 (2007).
26. Vahala, K. J. Optical microcavities. Nature 424, 839–846 (2004).
27. Khitrova, G., Gibbs, H. M., Kira, M., Koch, S. W. & Scherer, A. Vacuum Rabi splitting in
semiconductors. Nature Phys. 2, 81–90 (2006).
28. Schoelkopf, R. J. & Girvin, S. M. Wiring up quantum systems. Nature 451, 664–669
(2008).
29. Ye, J., Vernooy, D. W. & Kimble, H. J. Trapping of single atoms in cavity QED. Phys. Rev.
Lett. 83, 4987–4990 (1999).
30. Hijlkema, M. et al. A single-photon server with just one atom. Nature Phys. 3, 253–255
(2007).
31. Fortier, K. M., Kim, S. Y., Gibbons, M. J. Ahmadi, P. & Chapman, M. S. Deterministic
loading of individual atoms to a high-finesse optical cavity. Phys. Rev. Lett. 98, 233601
(2007).
32. Ye, J., Kimble, H. J. & Katori, H. Quantum state engineering and precision metrology
using state-insensitive light traps. Science (in the press).
33. Boozer, A. D., Boca, A., Miller, R., Northup, T. E. & Kimble, H. J. Cooling to the ground
state of axial motion for one atom strongly coupled to an optical cavity. Phys. Rev. Lett. 97,
083602 (2006).
34. Keller, M., Lange, B., Hayasaka, K., Lange, W. & Walther, H. Continuous generation
of single photons with controlled waveform in an ion-trap cavity system. Nature 431,
1075–1078 (2004).
35. Duan, L.-M. & Kimble, H. J. Scalable photonic quantum computation through cavity-
assisted interactions. Phys. Rev. Lett. 92, 127902 (2004).
36. McKeever, J. et al. Deterministic generation of single photons from one atom trapped in
a cavity. Science 303, 1992–1994 (2004).
37. Bergmann, K., Theuer, H. & Shore, B. W. Coherent population transfer among quantum
states of atoms and molecules. Rev. Mod. Phys. 70, 1003–1025 (1998).
38. Lounis, B. & Orrit, M. Single-photon sources. Rep. Prog. Phys. 68, 1129–1179 (2005).
39. Lange, W. & Kimble, H. J. Dynamic generation of maximally entangled photon multiplets
by adiabatic passage. Phys. Rev. A 61, 063817 (2000).
40. Duan, L.-M. & Kimble, H. J. Efficient engineering of multiatom entanglement through
single-photon detections. Phys. Rev. Lett. 90, 253601 (2003).
41. Sun, B., Chapman, M. S. & You, L. Atom–photon entanglement generation and
distribution. Phys. Rev. A 69, 042316 (2004).
42. Englund, D., Faraon, A., Zhang, B., Yamamoto, Y. & Vuckovic, J. Generation and transfer
of single photons on a photonic crystal chip. Opt. Express 15, 5550–5558 (2007).
43. Schön, C., Solano, E., Verstraete, F., Cirac, J. I. & Wolf, M. M. Sequential generation of
entangled multiqubit states. Phys. Rev. Lett. 95, 110503 (2005).
44. Parkins, A. S. & Kimble, H. J. Quantum state transfer between motion and light. J. Opt. B
1, 496–504 (1999).
45. Julsgaard, B., Kozhekin, A. & Polzik, E. S. Experimental long-lived entanglement of two
macroscopic objects. Nature 413, 400–403 (2001).
46. Sherson, J. F. et al. Quantum teleportation between light and matter. Nature 443,
557–560 (2006).
47. Cerf, N. J., Leuchs, G. & Polzik, E. S. (eds) Quantum Information with Continuous Variables
of Atoms and Light (World Scientific, New Jersey, 2007).
48. Raymer, M. G., Walmsley, I. A., Mostowski, J. & Sobolewska, B. Quantum theory of
spatial and temporal coherence properties of stimulated Raman scattering. Phys. Rev. A
32, 332–344 (1985).
49. Chou, C.-W. et al. Measurement-induced entanglement for excitation stored in remote
atomic ensembles. Nature 438, 828–832 (2005).
50. Laurat, J., Choi, K. S., Deng, H., Chou, C.-W. & Kimble, H. J. Heralded entanglement
between atomic ensembles: preparation, decoherence, and scaling. Phys. Rev. Lett. 99,
180504 (2007).
51. Laurat, J. et al. Towards experimental entanglement connection with atomic ensembles
in the single excitation regime. New J. Phys. 9, 207–220 (2007).
52. Jiang, L., Taylor, J. M. & Lukin, M. D. Fast and robust approach to long-distance quantum
communication with atomic ensembles. Phys. Rev. A 76, 012301 (2007).
53. Sangouard, N. et al. Robust and efficient quantum repeaters with atomic ensembles and
linear optics. Preprint at <http://arxiv.org/abs/0802.1475> (2008).
54. Kuzmich, A. et al. Generation of nonclassical photon pairs for scalable quantum
communication with atomic ensembles. Nature 423, 731–734 (2003).
55. Balic, V., Braje, D. A., Kolchin, P., Yin, G. Y. & Harris, S. E. Generation of paired photons
with controllable waveforms. Phys. Rev. Lett. 94, 183601 (2005).
56. van der Wal, C. H. et al. Atomic memory for correlated photon states. Science 301,
196–200 (2003).
57. Chou, C. W., Polyakov, S. V., Kuzmich, A. & Kimble, H. J. Single-photon generation from
stored excitation in an atomic ensemble. Phys. Rev. Lett. 92, 213601 (2004).
58. Laurat, J. et al. Efficient retrieval of a single excitation stored in an atomic ensemble.
Opt. Express 14, 6912–6918 (2006).
59. Thompson, J. K., Simon, J., Loh, H. & Vuletic, V. A high-brightness source of narrowband,
identical-photon pairs. Science 313, 74–77 (2006).
60. Matsukevich, D. N. et al. Deterministic single photons via conditional quantum evolution.
Phys. Rev. Lett. 97, 013601 (2006).
61. Chen, S. et al. Deterministic and storable single-photon source based on a quantum
memory. Phys. Rev. Lett. 97, 173004 (2006).
62. Simon, J., Tanji, H., Thompson, J. K. & Vuletic, V. Interfacing collective atomic excitations
and single photons. Phys.Rev. Lett. 98, 183601 (2007).
63. Wootters, W. K. Entanglement of formation of an arbitrary state of two qubits.
Phys. Rev. Lett. 80, 2245–2248 (1998).
64. Felinto, D. et al. Conditional control of the quantum states of remote atomic memories
for quantum networking. Nature Phys. 2, 844–848 (2006).
65. Chou, C.-W. et al. Functional quantum nodes for entanglement distribution over scalable
quantum networks. Science 316, 1316–1320 (2007).
66. Harris, S. E. Electromagnetically induced transparency. Phys. Today 50, 36–40 (1997).
67. Liu, C., Dutton, Z., Behroozi, C. H. & Hau, L. V. Observation of coherent optical
information storage in an atomic medium using halted light pulses. Nature 409,
490–493 (2001).
68. Phillips, D. F., Fleischhauer, A., Mair, A., Walsworth, R. L. & Lukin, M. D. Storage of light in
atomic vapor. Phys. Rev. Lett. 86, 783–786 (2001).
69. Chanelière, T. et al. Storage and retrieval of single photons transmitted between remote
quantum memories. Nature 438, 833–836 (2005).
70. Eisaman, M. D. et al. Electromagnetically induced transparency with tunable single-
photon pulses. Nature 438, 837–841 (2005).
71. Simon, J., Tanji, H., Ghosh, S. & Vuletic, V. Single-photon bus connecting spin-wave
quantum memories. Nature Phys. 3, 765–769 (2007).
72. van Enk, S. J., Lütkenhaus, N. & Kimble, H. J. Experimental procedures for entanglement
verification. Phys. Rev. A 75, 052318 (2007).
73. Chen, Y.-A. et al. Memory-built-in quantum teleportation with photonic and atomic
qubits. Nature Phys. 4, 103–107 (2008).
74. Vidal, G., Latorre, J. I., Rico, E. & Kitaev, A. Entanglement in quantum critical phenomena.
Phys. Rev. Lett. 90, 227902 (2003).
75. Aoki, T. et al. Observation of strong coupling between one atom and a monolithic
microresonator. Nature 443, 671–674 (2006).
76. Dayan, B. et al. A photon turnstile dynamically regulated by one atom. Science 319,
1062–1065 (2008).
77. Spillane, S. M. et al. Ultrahigh-Q toroidal microresonators for cavity quantum
electrodynamics. Phys. Rev. A 71, 013817 (2005).
78. Trupke, M. et al. Atom detection and photon production in a scalable, open, optical
microcavity. Phys. Rev. Lett. 99, 063601 (2007).
79. Park, Y.-S., Cook, A. K. & Wang, H. Cavity QED with diamond nanocrystals and silica
microspheres. Nano Lett. 6, 2075–2079 (2006).
80. Armani, D. K., Kippenberg, T. J., Spillane, S. M. & Vahala, K. J. Ultra-high-Q toroid
microcavity on a chip. Nature 421, 925–928 (2003).
81. Spillane, S. M., Kippenberg, T. J., Painter, O. J. & Vahala, K. J. Ideality in a fiber-taper-
coupled microresonator system for application to cavity quantum electrodynamics.
Phys. Rev. Lett. 91, 043902 (2003).
82. Braginsky, V. B., Gorodetsky, M. L. & Ilchenko, V. S. Quality-factor and nonlinear
properties of optical whispering-gallery modes. Phys. Lett. A 137, 393–397 (1989).
Acknowledgements I am grateful for the contributions of members of the Caltech
Quantum Optics Group, especially K. S. Choi, B. Dayan and R. Miller. I am indebted
to J. P. Preskill and S. J. van Enk for critical insights. My research is supported by the
National Science Foundation, IARPA and Northrop Grumman Space Technology.
Author Information Reprints and permissions information is available at
<www.nature.com/reprints>. The author declares no competing financial interests.
Correspondence should be addressed to the author (<hjkimble@caltech.edu>).
1030
NATURE|Vol 453|19 June 2008
INSIGHT REVIEW
