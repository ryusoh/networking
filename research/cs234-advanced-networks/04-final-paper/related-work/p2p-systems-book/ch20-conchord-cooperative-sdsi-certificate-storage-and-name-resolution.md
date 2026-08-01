# ch20-conchord-cooperative-sdsi-certificate-storage-and-name-resolution

---

## Page 1

ConChord: Cooperative SDSI Certiﬁcate
Storage and Name Resolution
Sameer Ajmani, Dwaine E. Clarke, Chuang-Hue Moh, and Steven Richman⋆
MIT Laboratory for Computer Science
200 Technology Square, Cambridge, MA 02139, USA
{ajmani,declarke,chmoh,richman}@lcs.mit.edu
Abstract. We present ConChord, a large-scale certiﬁcate distribution
system built on a peer-to-peer distributed hash table. ConChord provides
load-balanced storage while eliminating many of the administrative dif-
ﬁculties of traditional, hierarchical server architectures.
ConChord is speciﬁcally designed to support SDSI, a fully-decentralized
public key infrastructure that allows principals to deﬁne local names
and link their namespaces to delegate trust. We discuss the particular
challenges ConChord must address to support SDSI eﬃciently, and we
present novel algorithms and distributed data structures to address them.
Experiments show that our techniques are eﬀective and practical for large
SDSI name hierarchies.
1
Introduction
SDSI (Simple Distributed Security Infrastructure) [19] is a proposed public key
infrastructure that is more powerful and ﬂexible than existing systems like DNS-
EXT [7] and X.509 [17]. In SDSI, names are deﬁned in local namespaces, and
longer names can link multiple namespaces to delegate trust. This design obvi-
ates central certiﬁcation authorities, allowing principals to declare and modify
complex trust relationships.
For example, suppose Acme wants to allow access to their web site only
to their partner companies’ employees. SDSI allows Acme to deﬁne the group
“Acme’s partners” and delegate trust to each partner to deﬁne their own group
of “employees.” Acme’s web server can enforce the access control policy by re-
quiring that each HTTP client prove membership in the group “Acme’s partners’
employees.” A client satisﬁes this requirement by presenting two certiﬁcates: one
that shows that she is the “employee” of a company, and another that shows
that her company is a “partner” of Acme.
Locating the certiﬁcates that a client needs is simple when certiﬁcates are
stored at a central server, but this defeats the purpose of SDSI’s decentralized
design and scales poorly. We could distribute certiﬁcate storage using a server
hierarchy, like DNS. However, unlike DNS, SDSI has no single root, and so re-
quires some non-hierarchical way to locate the server that stores a certiﬁcate.
⋆Authors in alphabetical order.
P. Druschel, F. Kaashoek, and A. Rowstron (Eds.): IPTPS 2002, LNCS 2429, pp. 141–154, 2002.
c
⃝Springer-Verlag Berlin Heidelberg 2002

---

## Page 2

142
Sameer Ajmani et al.
The SPKI/SDSI IETF working group suggests embedding URIs in public keys
for this purpose [9], but this seems undesirable, as changes to a key’s URI inval-
idate certiﬁcates issued for that key. Also, since one SDSI name can be deﬁned
in terms of another, SDSI name resolution is fundamentally more complex than
DNS name resolution. Certiﬁcates from many diﬀerent organizations may be
required to create a proof, and it is not always clear which organization should
store a partial or completed proof.
Server hierarchies also suﬀer from administrative problems. A large fraction
of DNS traﬃc is caused by “misconﬁguration and faulty implementation of the
name servers” [5]. Making such systems fault-tolerant requires even more exper-
tise and resources.
To address these challenges, we present ConChord,1 a distributed SDSI cer-
tiﬁcate directory built on a peer-to-peer storage system. Peer-to-peer systems
[6, 8] conﬁgure themselves to provide immense storage capacity, high reliability,
balanced load, and eﬃcient lookups. ConChord uses the Chord [22] lookup sys-
tem, with storage and caching techniques based on the Cooperative File System
(CFS) [6]. ConChord locates certiﬁcates using relevant information (such as the
name a certiﬁcate resolves), eliminating the need to embed URIs in public keys.
ConChord supports three operations: inserting a new certiﬁcate, resolving
a name, and checking whether a name resolves to a speciﬁc key. ConChord’s
prototype implementation supports these operations, but does not yet support
replication or recovery from network partitions. ConChord’s current design does
not handle server failures, restrict access to certiﬁcates, enforce storage quotas,
or resist malicious attacks; these issues are left for future work.
The rest of this paper is organized as follows: Section 2 describes the capabil-
ities and semantic richness of the SDSI naming system. Section 3 presents Con-
Chord’s data structures, algorithms, and storage design, and Section 4 presents
a brief evaluation. Section 5 discusses related work, and Section 6 concludes.
2
SDSI Background
The main innovation of SDSI is the use of local names. Unlike DNS, in which
names must be unique in a global namespace, a SDSI name has meaning relative
to the principal deﬁning that name. For instance, Professor X and Professor Y
can each deﬁne the name “RAs” to refer to their respective research assistants.
The two groups of RAs are referred to by the local names “KProfX RAs” and
“KProfY RAs”, where KP is principal P’s public key. In a system that uses SDSI
for authorization, Professor X might add “KProfX RAs” to the access control
list for a ﬁle, eﬀectively stating that her RAs are the only principals allowed to
access that ﬁle.
Principals deﬁne local names with two kinds of cryptographically-signed cer-
tiﬁcates: reducing and non-reducing [4]. A reducing certiﬁcate binds a local name
to a principal. So, if Professor X wants to add Bob and Carol to her group of
RAs, she can issue two reducing certiﬁcates:
1 Certiﬁcates on Chord

---

## Page 3

ConChord: Cooperative SDSI Certiﬁcate Storage and Name Resolution
143
KProfX RAs −→KBob
(1)
KProfX RAs −→KCarol
The value of a SDSI name is the union of all keys that are bound to it, so here
the value of the name “KProfX RAs” is the set {KBob, KCarol}.
We call the operation that returns the value of a name name resolution, or
simply resolution. We call the operation that veriﬁes that a speciﬁed principal
is in the set of keys bound to a name membership checking. Finally, we call the
issuance of a new SDSI certiﬁcate insertion.
Although certiﬁcates can only be issued for local names (which have exactly
one string component), resolutions and membership checks can be carried out
for longer extended names. For instance, if MIT issues the certiﬁcate
KMIT faculty −→KProfX
(2)
then we can resolve the extended name “KMIT faculty RAs”. Semantically, this
name denotes all principals that have been designated as RAs by all principals
designated as MIT faculty. Given the above certiﬁcates, this name resolves to
the set {KBob, KCarol}. If MIT also issued the certiﬁcate “KMIT faculty” −→
KProfY , then “KMIT faculty RAs” would also include Professor Y’s RAs. Bob
can prove that he is a member of “KMIT faculty RAs” by presenting the sequence
of certiﬁcates (2)(1); anyone can verify this proof by checking the signatures on
the two certiﬁcates.
The second type of certiﬁcate is the non-reducing certiﬁcate, which binds a
local name to another (local or extended) name:
KMIT staﬀ−→KMIT faculty
KMIT staﬀ−→KMIT faculty RAs
(3)
KMIT staﬀ−→KHR visiting
Notice that the right-hand sides (called subjects) of the above non-reducing cer-
tiﬁcates are names, whereas the subjects of reducing certiﬁcates are principals’
keys. A non-reducing certiﬁcate states that the value of a local name includes the
value of the subject. So, given these certiﬁcates, we can resolve “KMIT staﬀ” as
the union of the values of “KMIT faculty”, “KMIT faculty RAs”, and “KHR vis-
iting”.
Since the name bound by reducing certiﬁcate (2), “KMIT faculty”, is a pre-
ﬁx of the subject of non-reducing certiﬁcate (3), these certiﬁcates are called
compatible, and we can compose (3) with (2) to yield a new, derived certiﬁcate:
KMIT staﬀ−→KProfX RAs
(4)
This new certiﬁcate doesn’t introduce any new trust relationships. Rather, it
represents a trust relationship that already exists (we can use the original, signed
certiﬁcates to prove this fact).
If we repeatedly perform all possible compositions over a certiﬁcate set until
no more compositions are possible, we eventually have a set of reducing cer-
tiﬁcates that directly bind each local name to each key in that name’s value.

---

## Page 4

144
Sameer Ajmani et al.
We call such a set closed under name-reduction. This closure is important for
supporting eﬃcient name resolutions and membership checks.
3
Design
ConChord’s key design assumption is that membership checking is by far the
most common operation on SDSI names, followed by name resolution. Insertion
is comparatively rare. Accordingly, ConChord maintains closure over its certiﬁ-
cates on each insertion, thereby reducing the amount of work required for name
resolution and membership checking. Users can thus accelerate resolutions and
checks for extended names by inserting non-reducing certiﬁcates.
ConChord’s algorithms use three hash tables: check, value, and compatible
(proposed in [10]). These tables are summarized in Table 1.
Membership Checking Every certiﬁcate inserted into ConChord is stored in
the check table, where the hash key for each certiﬁcate c is a function applied
to the tuple ⟨c’s name, c’s subject⟩. If multiple certiﬁcates that bind the same
name to the same subject are inserted into the check table, then the certiﬁcate
with the latest expiration time overwrites the others.
To check whether a key K is bound to name n, we can resolve n and check
whether K is in the resulting set. If n is a local name (like “KMIT staﬀ”), then
the closure property guarantees that the binding from n to K (if one exists) is
already in the check table, so we can instead fetch ⟨n, K⟩directly from check.
Name Resolution For each local name bound by a certiﬁcate, value stores the
set of keys bound to that name. The hash key for value is a function of the name.
To resolve a local name, we just look it up in value. To resolve an extended
name, we look up the value of the name’s preﬁx (the preﬁx of an extended name
“K n1 . . . nm” is the local name “K n1”), then we recursively resolve the rest
of the name. For instance, to resolve “KMIT staﬀspouse”, we ﬁrst fetch the
value for “KMIT staﬀ”. Then, for each staﬀmember KS, we fetch the value for
“KS spouse” and take the union of those values to compute the result.
Table 1. ConChord Hash Tables
Table
Index
Value
check
name, subject
an entry whose name is name and whose subject
is subject
value
name
a set of entries whose name is name and whose
subject is a public key
compatible
name
a set of entries whose subject is a name that
starts with name

---

## Page 5

ConChord: Cooperative SDSI Certiﬁcate Storage and Name Resolution
145
Insertion The above algorithms rely on two invariants. First, check and value
are both up to date with respect to each other (if a name binding is in value,
then the corresponding certiﬁcate is in check, and vice versa). We maintain this
invariant by updating both tables when new certiﬁcates are inserted.
Second, closure is always maintained over the certiﬁcates. To maintain this
invariant, we compose each new certiﬁcate with each other compatible certiﬁcate
in the system. We then recursively insert the resulting derived certiﬁcates, since
they may trigger further compositions.
When a new non-reducing certiﬁcate is inserted, we locate all compatible
reducing certiﬁcates by looking up the preﬁx of the new certiﬁcate’s subject in
the value table. When a new reducing certiﬁcate is inserted, we must locate all
compatible non-reducing certiﬁcates. To make this fast, ConChord maintains a
third table, compatible, that stores non-reducing certiﬁcates, where the hash key
of a certiﬁcate is a function of the preﬁx of its subject.
Maintaining Proofs We have said that check stores certiﬁcates, value stores
keys, and compatible stores non-reducing certiﬁcates. In reality, these tables store
entries, which are proofs of name bindings, and a single proof might consist of
a sequence of certiﬁcates (if the binding was derived from a composition).
An entry consists of a name, a subject, and a certiﬁcate sequence that proves
that the name is bound to the subject. For example, the entry for the derived
certiﬁcate (4) would be:
name = KMIT staﬀ
subject = KProfX RAs
sequence = (3), (3)K−1
MIT , (2), (2)K−1
MIT
where XK−1 represents the digital signature of X using K−1, K’s private key.
Like certiﬁcates, entries can be composed, in which case their sequences are
concatenated. The expiration time of an entry is the earliest expiration of any
certiﬁcate in its sequence.
Figure 1 presents the complete insertion algorithm using entries.
3.1
Peer-to-Peer Architecture
ConChord locates entries on servers using the Chord [22] distributed lookup
system.2 ConChord distributes its hash tables by mapping each hash key to a
Chord ID. Clients access the hash tables by calculating the Chord ID for each
hash key and contacting the appropriate server.
A problem, however, arises with maintaining our invariants on each insertion.
The ﬁrst invariant (if an entry is in check, it is also in value or compatible, and
vice versa) might be violated if a client crashes during an insertion. The second
invariant (closure is maintained over the certiﬁcate set) might be violated if
two compatible certiﬁcates are inserted concurrently or if a client crashes before
inserting all derived certiﬁcates.
2 ConChord could also use CAN [18], Pastry[20], or Tapestry[23].

---

## Page 6

146
Sameer Ajmani et al.
insert(certiﬁcate c)
entry e
e.name ←K n (the name bound by c)
e.subject ←c’s subject
e.sequence ←c, cK−1
insert(e)
insert(entry e)
if (check[e.name, e.subject] is empty)
check[e.name, e.subject] ←e
if (e.subject is a public key)
value[e.name] ←value[e.name] ∪{e}
set ←compatible[e.name]
for each e′ ∈set
insert(compose(e′, e))
else
compatible[preﬁx(e.subject)]
←compatible[preﬁx(e.subject)] ∪{e}
set ←value[preﬁx(e.subject)]
for each e′ ∈set
insert(compose(e,e′))
else if (check[e.name, e.subject] expires before e)
check[e.name, e.subject] ←e
// requires e1.subject = e2.name · X
// for some (possibly empty) sequence of strings X
// returns the composed entry e
compose(entry e1, entry e2)
e.name ←e1.name
e.subject ←e2.subject · X
e.sequence ←e1.sequence · e2.sequence
return e
Fig. 1. Insertion with closure
We could solve these problems using synchronization to provide transactional
consistency for insertions; however, this is slow in the wide area. Instead, we allow
the system to temporarily violate our invariants in the rare case that a problem
occurs. To restore consistency, each server periodically reinserts the check entries
it stores, so all compositions eventually happen. This is an eﬃcient solution
because the work of reinsertion is spread among the servers, and reinsertions
can be infrequent.
Allowing such temporary inconsistencies safe with respect to security; they
can only make some entries temporarily unavailable. Since SPKI/SDSI semantics
are monotonic, the inability to locate some certiﬁcates cannot grant undeserved
authority [12].

---

## Page 7

ConChord: Cooperative SDSI Certiﬁcate Storage and Name Resolution
147
Storage Details The value and compatible tables store sets of entries, rather
than single entries. A very large set (such as the value of “KUSA citizens”) might
cause load imbalance or even exceed the capacity of a single server. Therefore,
ConChord distributes entries in a set among several servers.
We might consider using CFS-style Merkle trees to distribute large data
sets [6], but such data structures do not support concurrent modiﬁcation by
multiple clients. Because ConChord periodically reinserts entries and garbage-
collects expired entries, sets must support concurrent modiﬁcation. To do so,
ConChord distributes the elements of a set over many servers, but serializes set
modiﬁcations through a single server.
The members of the set whose Chord ID is s are stored at Chord IDs
hash(s, 1) . . . hash(s, T), where T is the size of the set. The value of T is
stored as a set size record at ID s. Servers support two atomic operations on set
size records: get-size and increment-and-get.
To fetch the members of a set, a client calls get-size, calculates the Chord
IDs for all of the set’s members, and retrieves them in parallel. To optimize for
singleton sets, the client fetches the ﬁrst entry of a set in parallel with the size.
To add a new entry to set s, a client ﬁrst calls increment-and-get. This incre-
ments T and returns the updated size, T ′. The client then stores the new entry
at ID hash(s, T ′).
When an entry e in a set expires, the server storing e ﬁrst looks for updated
versions of the expired certiﬁcates in the check table. If no new certiﬁcates are
found, the server storing e tells the set size server that e is no longer valid.
The set size server compacts the set by fetching the last element in the set (e′),
overwriting e with e′, and decrementing the set size. As an optimization, the set
size server can instead direct the next set insertion to overwrite e.
Recall that servers periodically reinsert entries; this involves (1) checking that
each entry appears in the appropriate value or compatible set, and (2) checking
that each entry is composed with all other compatible entries. The ﬁrst check in-
volves scanning the appropriate set; once done, this check need not be repeated.
However, the second check needs to be repeated indeﬁnitely in case new com-
patible entries are added. In the common case, the set of compatible entries will
be unchanged from the previous reinsertion. To make checking for changes fast,
we store a version number alongside each set size record. The version number
is incremented each time an element is added to the set. Thus, a reinsertion
usually only needs to check that the version number is unchanged, which is a
single Chord lookup.
Network Partitions If a network partition splits the set of ConChord servers,
servers in diﬀerent partitions may store diﬀerent values for the same Chord ID.
When the partition heals, ConChord automatically resolves such inconsistencies.
The server responsible for storing a set entry (in the healed partition) temporar-
ily stores all entries accepted for that ID and lazily diverts all but one entry to
the end of the set. Similarly, the server responsible for a set size record temporar-
ily accepts the maximum size value proposed by any server, and lazily corrects
the size (if necessary).

---

## Page 8

148
Sameer Ajmani et al.
Load Imbalance To balance request load for popular entries, ConChord caches
entries along lookup paths, as in CFS. Cached entries are expunged from a full
cache in LRU order. Cached copies may become out-of-date, so servers assign
them time-to-live values. Cached set size records have small TTLs, since inser-
tions and compactions change the actual size values. Cached set entries have
relatively larger TTLs, since they only become invalid when a server temporar-
ily stores multiple entries (after a partition heals) or when a set is compacted
after an expiration.
Clients and servers can detect and recover from out-of-date set size records
by fetching past the expected end of the set until no more entries are found
(locations T+1, T+2, etc.3). Set modiﬁcations cannot use cached set size records;
they must update the original record.
3.2
Accelerating the Operations
Resolution of an extended name requires a value lookup for each part of the name,
so resolution latency scales with name length. To reduce the number of lookups,
we allow clients to share resolutions by caching extended name resolutions in
the value and check tables. Then, clients can use cached preﬁxes when resolving
a name. For example, if “KMIT faculty assistant” −→
{KA, KB} is cached,
resolving “KMIT faculty assistant supervisor” can resolve “KA supervisor” and
“KB supervisor” directly.
Figure 2 presents a name resolution algorithm that takes advantage of cached
resolutions. Calls to yield return proofs of the resolution; calls to insert mark
resolutions that are cached back into ConChord.
Another way to accelerate extended name resolutions is to leverage closure.
For example, if we know that we will need to resolve the name “KMIT faculty
assistants”, we could create an entry whose name and subject are both that
name and whose sequence is empty. We call such an entry a truism, as it simply
states that a name is bound to itself. Since the subject of a truism is a name, it
is stored in the compatible table. Closure then causes the values of the name to
be stored in the value table, so the name can be resolved in a single lookup!
Li et al. [15] propose that membership checking can adapt between issuer-
to-subject and subject-to-issuer searches to avoid large branching factors in the
certiﬁcate graph. Implementing this algorithm on ConChord simply requires
maintaining a subject-to-issuer table for entries and is an area of future work.
4
Evaluation
4.1
DNS Traces
We evaluate the eﬀectiveness of name resolution sharing using a trace of 30,000
DNS requests captured at MIT’s Laboratory for Computer Science [14]. We do
not propose ConChord as a replacement for DNS; rather, we use the trace to
3 Binary search is possible by fetching T+2, T+4, etc.

---

## Page 9

ConChord: Cooperative SDSI Certiﬁcate Storage and Name Resolution
149
resolve (name n)
entry e
e.name ←n
e.subject ←n
e.sequence ←ø
resolve(e)
resolve (entry e)
name n ←e.subject
for i ←n.length down to 1
set ←value[preﬁx(n,i)]
for each e′ ∈set
entry r ←compose(e, e′)
if (r.subject is a public key)
yield(r)
insert(r)
else
resolve(r)
entry p ←extract(r)
if(p̸ = e′)
insert(p)
// requires r.name = N · X and r.subject = K · X
// for some name N, public key K,
// and (possibly empty) sequence of strings X
// returns the extracted entry e
extract (entry r)
e.name ←N
e.subject ←K
e.sequence ←r.sequence
return e
Fig. 2. Name resolution
generate a simple SDSI name hierarchy and a realistic name resolution workload.
For each DNS address query of the form “www.foo.com”, we generate a name
resolution request “Kdns com foo www” and a set of certiﬁcates:
Kdns com −→Kdns.com
Kdns.com foo −→Kdns.com.foo
Kdns.com.foo www −→Kdns.com.foo.www
None of the certiﬁcates expire during the trace.
We run the trace between a single client and server and count the number of
sequential lookups made for each request. While the total number of lookups for
a name of length l is O(l2) (due to fetching preﬁxes in parallel), the number of

---

## Page 10

150
Sameer Ajmani et al.
1
2
3
4
5
6
7
8
Sequential lookups per resolution
0.0
0.2
0.4
0.6
0.8
1.0
Cumulative fraction of resolutions
No Caching
Name Caching Only
Prefix + Name Caching
Fig. 3. Cumulative distribution of sequential lookups per DNS name resolution.
The No Caching distribution is equivalent to the distribution of DNS name
lengths.
sequential lookups (thus, latency) is O(l). Since every lookup is for a singleton
set in the value table, we expect exactly l sequential lookups per resolution.4
To evaluate the eﬀectiveness of name resolution sharing, we run the trace
with no caching, with caching of full name resolutions only (like a DNS proxy),
and with caching of full names and name preﬁxes. Each resolution caches all its
results (and preﬁxes) before the next one begins.
Figure 3 plots the cumulative distribution of sequential lookups per name
resolution for each trace. With no caching, one lookup is made for each part of
the DNS name, so the distribution of lookups is the same as the distribution of
name lengths. Full name caching reduces the mean by 23%, but variance is high,
since many names are requested only once. Preﬁx caching reduces the mean by
43%, and 73% of the requests succeed in one or two lookups, suggesting that
many requests share a common preﬁx.
We conclude that preﬁx caching is quite eﬀective at reducing the latency of
name resolutions for this dataset. This is not particularly surprising, as preﬁx
caching is analogous to NS record caching in DNS (shown to be particularly
eﬀective in [14]). However, we believe that preﬁx caching will also beneﬁt other
datasets with hierarchical structures.
4.2
Mailing Lists
The DNS dataset is too simple to require closure over its certiﬁcates, so we eval-
uate the overhead of closure using a second dataset based on MIT course mailing
4 We could also have created truisms for each DNS hostname and thus reduced each
name resolution to a single lookup. This might be reasonable, since each domain
owner knows in advance what hostnames are valid and might be resolved.

---

## Page 11

ConChord: Cooperative SDSI Certiﬁcate Storage and Name Resolution
151
lists. Course lists are composed of section lists, which are in turn composed of
students, forming a widely-branching hierarchy of large groups. We gathered
mailing lists for 27 courses, containing 38 sections and 2,073 students (1,706 dis-
tinct) and used the lists to generate a total of 5,624 certiﬁcates. For each entry of
the form “6.033-students: 6.033-sec9: alice” (6.033 is a course number),
we add the following certiﬁcates to an insertion trace (suppressing duplicates):
Kmit registered −→Kmit courses students
Kmit students −→Kmit alice
Kmit alice −→Kalice
Kmit courses −→Kmit 6.033
Kmit 6.033 −→K6.033
K6.033 students −→K6.033 secs students
K6.033 secs −→K6.033 sec9
K6.033 sec9 −→Ksec9
Ksec9 students −→Kmit alice
If the course does not have recitation sections, students are added directly to
the course’s “students” group. This dataset is designed to support a number
of useful queries, such as determining whether Alice is registered in 6.033 or
enumerating all the students registered in MIT courses.
We count the number of Chord lookups required to insert each certiﬁcate and
the resulting derived certiﬁcates. Figure 4 shows that the number of lookups per
insertion is fairly constant. This is because the number of compositions needed to
maintain closure after adding a member to a group is proportional to the number
of parent groups aﬀected, which is usually small. For example, adding a student
to a section only requires closure with the groups that transitively contain that
section. The raised parts of the curves correspond to insertions for courses with
sections, as these require one addition composition to maintain the section list.
Reordering the trace changes the distribution of lookups per insertion, but does
not aﬀect the total number of lookups. We conclude that maintaining closure is
practical for such datasets.
Since no access trace is available for this dataset, we cannot evaluate the
total beneﬁt that closure provides for name resolutions or membership checks.
However, speciﬁc examples show that the beneﬁt can be substantial: given clo-
sure, a membership check for any local name requires a single check lookup.
Without closure, a check on a name like “KMIT registered” can require up to
eight successive lookups to retrieve the necessary certiﬁcates.
5
Related Work
Alternatives to SDSI, such as DNSEXT [7] and X.509 [17], are used almost ex-
clusively for Internet host identiﬁcation, rather than applications like webs of
trust or access control. While X.509 could support richer applications, it is not
deployed in any way that facilitates them. PGP [24] supports user-authorized
names and webs of trust, but not linked namespaces or named groups. Policy-
Maker [3] and Keynote [2] support more general policies than SDSI, but they do
not specify a way to locate the certiﬁcates needed to satisfy a particular policy.

---

## Page 12

152
Sameer Ajmani et al.
0
1000
2000
3000
4000
5000
Insertions
0
5
10
15
Number of lookups
averaged over 24 insertions
Puts + Gets
Successful Puts
Fig. 4. Number of Chord lookups averaged over 24 insertions for the MIT course
mailing list dataset. Each lookup is used either to “put” data in or “get” data
from the system. Each insertion triggers a (nearly) constant number of other
insertions to maintain closure. Insertions are grouped by course; the raised parts
of the curves indicate additional compositions for insertions into courses with
sections.
Previous work [1, 15] proposes algorithms for resolving SDSI names using a
distributed set of certiﬁcates, but does not address the practical challenges of
storing and locating those certiﬁcates. Nikander and Viljanen [16] describe how
to deploy SPKI/SDSI [21] using DNS, but do not support SDSI name resolution.
QCM [11] introduced policy-directed certiﬁcate retrieval as a general tech-
nique for locating the certiﬁcates needed to satisfy a given assertion. QCM and
its successor, SD3 [13], use authoritative servers to implement distributed resolu-
tion of SDSI-like names and rely on embedded URIs or IPs to map principals to
servers. ConChord supports policy-directed certiﬁcate retrieval to resolve SDSI
names and eliminates the need for a mapping between principals and servers.
While ConChord loses some of the beneﬁts of authoritative servers, such as
online signing and control over certiﬁcate dissemination, ConChord gains scala-
bility, self-conﬁguration, and load-balance.
6
Conclusion
We have presented ConChord, a distributed SDSI certiﬁcate directory built on a
peer-to-peer system. ConChord supports three operations: membership checks,
name resolutions, and certiﬁcate insertions. To accelerate checks and resolutions,
ConChord maintains closure on each insertion and supports name resolution
sharing. Experiments show that these techniques are eﬀective and practical.
ConChord provides a novel deployment design that oﬀers a number of prac-
tical advantages over traditional, hierarchical server architectures. ConChord

---

## Page 13

ConChord: Cooperative SDSI Certiﬁcate Storage and Name Resolution
153
eliminates any need to embed location information in certiﬁcates and automat-
ically balances load among storage servers. Servers periodically reinsert entries
to guarantee eventual consistency and can automatically resolve conﬂicts that
occur due to network partitions.
Our prototype implementation supports the basic features described in this
paper. Future work includes implementing replication, supporting SPKI/SDSI
authorization certiﬁcates and revocation, limiting per-user storage, handling ma-
licious failures, and generalizing ConChord for use with other certiﬁcate systems.
Acknowledgments
We thank Barbara Liskov for her valuable advice on the presentation of this
paper. We also thank Russ Cox, Robert Morris, Athicha Muthitacharoen, Ronald
Rivest, Emil Sit, and the anonymous referees for their helpful comments.
References
[1] S. Ajmani. A Trusted Execution Platform for multiparty computation. Master’s
thesis, MIT, 2000. App A: Certiﬁcate Chain Algorithms.
[2] M. Blaze, J. Feigenbaum, and A. D. Keromytis.
Keynote: Trust management
for public-key infrastructures (position paper). In Security Protocols Workshop,
pages 59–63, 1998.
[3] M. Blaze, J. Feigenbaum, and J. Lacy. Decentralized trust management. Technical
Report 96-17, 28, 1996.
[4] D. Clarke, J. Elien, C. Ellison, M. Fredette, A. Morcos, and R. L. Rivest. Certiﬁ-
cate chain discovery in SPKI/SDSI. Journal of Computer Security, 2001.
[5] R. Cox and A. Muthitacharoen. Serving DNS using Chord. In Proc. IPTPS, 2002.
[6] F. Dabek, M. F. Kaashoek, D. Karger, R. Morris, and I. Stoica. Wide-area coop-
erative storage with CFS. In Proc. ACM SOSP, Oct. 2001.
[7] DNS extensions (IETF DNSEXT), Mar. 1999.
<http://www.ietf.org/html.char->
ters/dnsext-charter.html.
[8] P. Druschel and A. Rowstron. PAST a large-scale, persistent peer-to-peer storage
utility. In HotOS VIII, May 2001.
[9] C. Ellison, B. Frantz, B. Lampson, R. Rivest, B. Thomas, and T. Ylonen. SPKI
certiﬁcate theory. RFC 2693, Sept. 1999.
[10] C. M. Ellison and D. E. Clarke. High speed TUPLE reduction. Memo, Intel,
1999.
[11] C. A. Gunter and T. Jim. Policy-directed certiﬁcate retreival. Technical Report
MS-CIS-99-07, U. Penn., Sept. 1998.
[12] J. Y. Halpern and R. van der Meyden. A logic for SDSI’s linked local name spaces.
Journal of Computer Security, 9(1,2):47–74, 2000.
[13] T. Jim. SD3: A trust management system with certiﬁed evaluation. In Proc. 2001
IEEE Symposium on Security and Privacy, May 2001.
[14] J. Jung, E. Sit, H. Balakrishnan, and R. Morris. DNS performance and the eﬀec-
tiveness of caching. In Proc. ACM SIGCOMM Internet Measurement Workshop,
2001.
[15] N. Li, W. H. Winsborough, and J. C. Mitchell.
Distributed credential chain
discovery in trust management. In Proc. 8th ACM CCS, Nov. 2001.

---

## Page 14

154
Sameer Ajmani et al.
[16] P. Nikander and L. Viljanen. Storing and retrieving internet certiﬁcates. In Proc.
3rd Nordic Workshop on Secure IT Systems, 1998.
[17] Public-key infrastructure (IETF PKIX), Feb. 2000.
<http://www.ietf.org/html.charters/pkix-charter.html>.
[18] S. Ratnasamy, P. Francis, M. Handley, R. Karp, and S. Shenker.
A scalable
content-addressable network. In Proc. ACM SIGCOMM, 2001.
[19] R. L. Rivest and B. Lampson. SDSI – A simple distributed security infrastructure.
Apr. 1996.
[20] A. Rowstron and P. Druschel. Pastry: Scalable, distributed object location and
routing for large-scale peer-to-peer systems.
In Proc. IFIP/ACM Middleware,
2001.
[21] Simple public key infrastructure (IETF SPKI), Feb. 1998.
<http://www.ietf.org/html.charters/spki-charter.html>.
[22] I. Stoica, R. Morris, D. Karger, M. Kaashoek, and H. Balakrishnan.
Chord:
A scalable peer-to-peer lookup service for Internet applications. In Proc. ACM
SIGCOMM, Aug. 2001.
[23] B. Y. Zhao, J. Kubiatowicz, and A. Joseph. Tapestry: An infrastructure for fault-
tolerant wide-area location and routing. Technical Report UCB/CSD-01-1141,
UC Berkeley, Apr. 2001.
[24] P. R. Zimmermann. The Oﬃcial PGP User’s Guide. MIT Press, 1995.
