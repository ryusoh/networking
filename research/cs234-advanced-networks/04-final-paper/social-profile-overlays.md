# social-profile-overlays

---

## Page 1

1
OverSoc: Social Proﬁle Based Overlays
David Isaac Wolinsky, Pierre St. Juste, P. Oscar Boykin, Renato Figueiredo University of Florida
Abstract—Online social networking has quickly become one
of the most common Internet activities. As social networks
evolve, they encourage users to share more information, requiring
the users, in turn, to place more trust into social networks.
In
centralized
systems,
this
means
trusting
a
third-party
commercial entity, like Facebook or MySpace. Peer-to-peer
(P2P) systems can enable the creation of online social networks
extending trust to friends only. In this paper, we present a
novel approach to constructing completely decentralized social
networks through P2P overlays, OverSoc. Our approach relies
on a common directory overlay, which facilitates friend discovery
and bootstraps connectivity to individualized proﬁle overlays.
Each user has their own individual proﬁle overlay managed
transparently using a public key infrastructure (PKI). We deﬁne
necessary interfaces for constructing the system and describe
some examples of user interactions with the system.
I. INTRODUCTION
Online social networking has become pervasive in daily
life, though as social networks grow so does the wealth of
personal information that they store. Once information has
been released on a social network, known as a user’s proﬁle,
the user and the data are at the mercy of the terms dictated
by the social network infrastructure, which today is typically
third-party, centrally owned. If the social network engages in
activities disagreeable to the user, due to change of terms
or opt-out programs not well understood by users such as
recent issues with Facebook’s Beacon program [1], the options
presented to the user are limited. The options include leaving
the social network, surrendering their identity and features
provided by the social network; accepting the disagreeable
activities; or to petition and hope that the social network
changes its behavior.
As the use of social networking expands to become the
primary way in which users communicate and express their
identity amongst their peers, the users become more dependent
on the policies of social network infrastructure owners. Recent
work [2] explores the coupling between social networks and
P2P systems as a means to return ownership to the users,
noting that a social network made up of social links is
inherently a P2P system with the aside that they are currently
developed on top of centralized systems. In this paper, we
extend this idea with focus on the topic of topology; that
is, how to organize social proﬁles that leverage the beneﬁts
offered by a structured P2P overlay abstraction.
Structured P2P overlays provide a scalable, resilient,
autonomic platform for distributed applications. Structured
overlays enable users to easily create their own decentralized
systems for the purpose of data sharing, interactive activities,
and other networking-enabled activities. In this paper, we
extend our previous work [3] to enable social network proﬁle
overlays. The previous work addresses the challenges of
bootstrapping secure, private overlays in network address
translator (NAT) and ﬁrewall environments by using a public
overlay for discovery and as a relay or communication
transport.
A typical social network consists of users and groups. Each
user has a proﬁle, a set of friends, and private messaging; and
each group consists of one or more managers, users, and a
messaging board. Proﬁles contain user’s personal information,
status updates, and public conversations, similar to a message
board. Friends are individuals trusted sufﬁciently by a user
to view the user’s proﬁle. Private messaging sends messages
discretely between users without leaking the message to other
members. Groups have similar features, though identity is
shared by many users.
Using this social networking model, we have designed
OverSoc. OverSoc uses a public overlay can be used as
a directory for ﬁnding and befriending peers or ﬁnding
and accessing groups. Once group and proﬁle access has
been offered, the public overlay can be used to bootstrap
connectivity to existing proﬁle and group overlays. Security
for proﬁle are provided by a public key infrastructure (PKI),
where proﬁle owners or group managers are the certiﬁcate
authorities (CA) and all members have signed certiﬁcates.
The overlay stores proﬁle data or group information in its
distributed data store, supporting decentralized access using
scalable mechanisms regardless of the proﬁle owner’s online
presence. In this paper, we present the architecture of these
overlays, as presented in Figure 1.
Fig. 1.
An example OverSoc social overlay network. Alice has a friendship
with Bob and Carol, hence both are members of her proﬁle overlay. Bob
has a friendship with Alice and Dave but not Carol; hence Alice and Dave
are members of his proﬁle overlay, while Carol is not. Each peer has many
overlay memberships but a single root represented by dashed lines in various
shades of gray. For clarity, overlay shortcut connections are not shown.
The rest of this paper is organized as follows. Section II
provides background and related work. Section III describes
OverSoc, explaining how to map social networks onto
structured P2P overlays. We express our expectations for user
interaction with the system in Section IV. In Section V, we
explore some of the remaining challenges introduced by our
approach. We conclude the paper in Section VI.

---

## Page 2

2
II. BACKGROUND
In
this
section,
we
review
structured
P2P
overlays,
challenges and solutions for bootstrapping overlays, and other
methods for constructing decentralized online social networks.
P2P systems build upon existing decentralized concepts by
creating scalable, autonomic environments, thereby limiting
user exposure to the gory details of system conﬁguration
and organization. Since our system consists of many proﬁle
overlays, we focus on the challenges of bootstrapping P2P
systems, when the system lacks dedicated bootstrapping nodes.
A. Structured P2P Overlays
P2P systems typically come in two ﬂavors: unstructured
and structured. Unstructured systems [4], [5] are generally
constructed by peers attempting to maintain a certain amount
of connections to other peers in the P2P system, whereas
structured systems organize into well-deﬁned topologies, such
as trees, 1-D rings, or hypercubes. Though unstructured
systems are typically simpler to bootstrap and maintain, they
rely on global knowledge, ﬂooding, or stochastic techniques
to search for information in an overlay, creating potential
scalability constraints. Alternatively, structured systems [6],
[7], [8], [9], [10] have guaranteed search time typically with a
lower bound of O(log N) and in some cases even O(1) [11].
The most common feature found in structured overlays is the
support for a decentralized storage / retrieval system called a
distributed hash table (DHT), that maps keys with associated
data to speciﬁc node IDs in an overlay.
The bootstrap problem presents a challenge to scenario
discussed in this paper, where peers will be joining many
overlays with overlay peers behind NATs. [12] presents an
abstraction layer to bootstrapping across existing overlays.
The key components are a method for reﬂection in order
to obtain publicly reachable addresses, so peers behind
network address translators and ﬁrewalls can receive incoming
connection requests; communication relaying to share public
addresses and communicate when direct communication is not
feasible; and rendezvous for discovering remote peers, when
the overlay lacks stable membership. The solution has been
applied to structured overlays, that enables peers to bootstrap
structured overlays from a structured overlay regardless of
NAT conditions. In this application, a peer obtains a public
address mapping, when connecting to the public overlay, has
the ability to route packets through recursive routing on the
overlay, and uses the DHT to discover other peers in the private
overlay. Peers multiplex the same UDP and TCP sockets in
the private overlay to reuse the reﬂection services provided in
the public overlay.
B. Peer-to-Peer Social Networks
In [13], Buchegger et al. describe how to use a DHT to
store social networking proﬁle. The DHT provides look-up
services for storing meta data pertaining to a peer’s proﬁle.
Peers query the DHT for updated content from their friends by
hashing their unique identiﬁers (e.g. friends’ email addresses).
The retrieved meta data contains information for obtaining the
proﬁle data such as IP address and ﬁle version. Their work
relies on a PKI system that provides identiﬁcation, encryption,
and access control. In contrast, OverSoc maps individual user
proﬁles and groups to a private overlay secured by point-to-
point encryption and authentication amongst all peers in the
overlay. The private overlay provides a clean abstraction of
access control, whereby once admitted to a private overlay,
users can access a distributed data store which holds the
contents of the owners proﬁle.
Shakimov et al. in [14] take a different approach by
depending on virtual individual servers (VIS) hosted on a
cloud infrastructure such as Amazon EC2. Friends contact
each other’s VIS directly for updates. A DHT is used
as
a
directory
for
groups
and
interest-based
searches.
Their approach assumes bidirectional end-to-end connectivity
between each VIS, where a proﬁle is only available during
the up time of the VIS. Because of the demands on network
connectivity and up time, the approach assumes a cloud-hosted
VIS and has difﬁculty being used on user-owned resources.
OverSoc allows peers to have asymmetric connectivity and
does not require constant up time through the use of NAT
traversal support and the ability to store the proﬁle in the
overlay’s distributed data store.
The approach presented by Cutillo et al. in [15] relies on a
central system to host identities and certiﬁcates that can then
be used to query a DHT to discover an initial hop in a route
to a speciﬁc peer through their circle of friends. The circle
of friends consists of an unstructured overlay, where direct
friends maintain direct connections with the peer, and outer
circles consist of friends of friends and friends of friends of
friends. The main goal of this work is to remove the private
components of a proﬁle from a central entity, whereas OverSoc
makes a clean break from all centralization and emphasizes
scalability through distributed replica techniques.
Unlike the above approaches, the P2P social network
presented by Abbas et al. in [16] uses an unstructured overlay
without a DHT where peers connect directly to each other
rather than through the overlay establishing unique identiﬁers
to deal with dynamic IPs. Peers cache each other’s data to
improve availability. While helper nodes are used to assist with
communication between peers behind NATs. The approach
lacks security and access control considerations and lacks the
guarantees and the simplicity of the abstraction offered by a
structured overlay.
III. SOCIAL OVERLAYS
In this section, we explain how OverSoc maps online social
networking to virtual private overlays consisting of a public
directory overlay with many private proﬁle overlays. The
directory overlay supports friend discovery and veriﬁcation
and stores a lists of peers currently active in each proﬁle
overlay. Proﬁle overlays support message boards, private
messages, and media sharing.
A. Finding Friends
In a traditional social network, directories are used to search
for users based upon public information, such as the user’s full
name, user ID, e-mail address, group afﬁliations, and friends.

---

## Page 3

3
Fig. 2.
Alice requests and receives a friendship from Bob.
The resulting search returns zero or more matching directory
entries. In OverSoc, directory entries are inserted into the
DHT of a public overlay. Since the public information has
many components, various subsets form DHT keys that all
point to a common, complete listing of the matching public
information. For example, a user can store a pointer at the
DHT key hash(”alice”) or hash(”alicebob”). The key here
is that any subset of the user’s public information in lower-
case format can be hashed into a DHT index that would
eventually direct the searching user to one or more users
public information. More explicit searches could sift through
the results and present to the user only those peers, which
match all the search parameters. The amount of information
shared publicly should be conﬁgurable by the user.
While looking for an individual, a peer may discover
that many individuals have overlapping public information
components, such as the user’s name. Assuming all entries are
legitimate, the overlay must have some method of supporting
multiple, distinct values at the same key, requiring the
application and user to parse the responses and determine
the best match by reviewing the contents of each certiﬁcate.
Alternatively, a technique like Sword [17], which supports
attribute based searching, could be used to efﬁciently ﬁnd
peers in an overlay.
To address trust levels when searching for friends, a PGP
certiﬁcate can be used to store user’s public information
and verify user’s friends and groups. In OverSoc, the main
portion of a PGP certiﬁcate contains information such as user
name, full name, e-mail address, potentially other user-deﬁned
data, and a signature packets from the user and those that
trust the certiﬁcate including groups and individuals. These
signature packets represent a list of veriﬁable friends and
groups assisting to further uniquely identify a user. Each time
a user befriends someone, they should exchange signature
packets containing at a minimum the friends PGP certiﬁcate
ID, a signature expiration time, and a signature binding this
information with the new friend’s existing PGP certiﬁcate.
This increases the trust level of individuals searching for
others especially if they have common friendships or group
membership. The use of a time stamp in the signature assists in
deciding whether or not a friendship link is still active without
accessing the proﬁle overlay of either peers. Thus peers that
maintain friendships need to periodically exchange signature
packets.
B. Making Friends
In this example, Alice becomes friends with Bob, as
illustrated in Figure 2. Once a user, Alice, has found a friend
candidate, Bob, Alice can issue a friendship request and store
it in the DHT using the hash of Bob’s certiﬁcate as an index,
this acts a public overlay mailbox. Bob can review the public
information of Alice prior to making a decision. If Bob accepts
the request, Alice and Bob exchange signature packets and are
granted access to each other’s proﬁles. Once proﬁle access has
been enabled, the Alice and Bob can learn more information,
and if it turns out to be a mistake, either one of them can
unilaterally end the relationship.
Alice’s friendship request should contain a pointer to her
certiﬁcate in the overlay, a time stamp, and Bob’s certiﬁcate
identiﬁer. The friendship request is encrypted using Bob’s
public key and signed using Alice’s private key for the
purposes of anonymity and authenticity. When Bob receives
the friendship request, he can verify that the request was
made for Bob by Alice. Upon receiving the friendship request,
he has three choices: a conditional accept, an unconditional
accept, or a reject. During an unconditional accept, Bob signs
Alice’s PGP certiﬁcate and issues a request to befriend her.
Alternatively, he could issue a request to befriend her and
wait for her to sign his certiﬁcate and investigates her proﬁle
prior to signing hers.
Discovery of a user is not limited to the directory entries.
Because users have a public overlay based mailbox, they are
not required to discover each other only through the directory.
Instead, they can use out of band discovery, using mechanisms
like e-mail, chat, or personal websites to exchange certiﬁcates.
Once a peer has received another peer’s certiﬁcate, they can

---

## Page 4

4
Fig. 3.
Alice, already a friend of Bob, connects to his social overlay.
submit secure friendship requests using the public overlay. In
fact, this sort of system can leverage the trust established by
an existing social network to sign and exchange OverSoc’s
certiﬁcates.
C. The Proﬁle Overlay
In a traditional social network, the proﬁle or user-centric
portion consists of private messaging, data sharing, friendship
maintenance, and a public message board for status updates
or public messages. In this section, we explain how these
components can be applied to a structured overlay dedicated
to an individual proﬁle.
Using the techniques such as those described in [3], it
is feasible to efﬁciently multiplex a P2P system across
multiple, virtual private overlays enabling each proﬁle owner
to have a proﬁle overlay consisting of their online friends.
For access control, OverSoc employs point-to-point encryption
and authentication, peers bootstrap private connections by
exchanging the base of the PGP certiﬁcate and the proﬁle
overlays signature packet obtained in the “making friends”
stage. Because the proﬁle owner also is the CA, control
of which could be distributed across the users resources,
for all members of the overlay, they can easily revoke
users from access to the proﬁle overlay. [3] describes
efﬁcient mechanisms for overlay revocation through the use
of broadcasting for immediate revocation and the use of DHT
for indirect and permanent revocation.
The message board of a proﬁle can be stored in two
ways: distributed within the proﬁle overlay via a data store
or stored on the proﬁle owner’s personal computing devices.
The distributed data store provides the proﬁle when the owner
is ofﬂine and also distributes the load for popular proﬁles.
For higher availability, each peer always stores and provides
all data in their proﬁle when they are online. To ensure
authenticity and integrity, peers sign their messages and each
peer’s certiﬁcate is available in the overlay as well as stored
by mutual friends for veriﬁcation. Messages that are unsigned
are ignored by all members of the overlay. An ideal overlay
for this purpose should support complex queries [18] allowing
easy access to data stored chronologically, by content, by type,
i.e., media, status updates, or message board discussions.
Private messaging in the proﬁle overlay is unidirectional;
only the proﬁle owner can receive private messages using
their overlay. To enforce this, a private message should be
prepended with a symmetric key encrypted by the proﬁle
owners public key, the message should be appended by a
signature of the message using the private key of the message
sender, and the entire message encrypted by the symmetric
key. This approach ensures that only the sender and the proﬁle
owner can decrypt the private message and verify the senders
identity. The contents of the private message include the
sender, time sent, and the subject. Messages are be stored in
well known locations in the DHT, like “private messages for
me”, so that the proﬁle owner can either poll the location.
D. Active Peers
The directory overlay should be used to assist in ﬁnding
currently active peers in the proﬁle overlays. By placing their
node IDs at a well-known, unique per-proﬁle overlay keys in
the DHT, active peers can bootstrap incoming peers into the
proﬁle overlay. We implemented and evaluated this concept
in [3]. Because the proﬁle overlay members all use PKI to
ensure membership, even if malicious peers insert their ID
into the active list, it would be useless as the peer would
only form connections with peers who also have a signed
certiﬁcate. Extending from the earlier example, where Alice
became Bob’s friends, Figure 3 presents in detail how she
would join his private overlay.
E. Groups
Groups can be considered extensions of proﬁle overlays.
The fundamental difference between a group and a proﬁle is
that a group lacks private messaging and has shared ownership.
So just as a peer can ﬁnd a proﬁle in the directory by hashing
the name of the user and other identiﬁable information, so
can the user ﬁnd the group. Like the certiﬁcate of the user,
the members of a group sign the group’s certiﬁcate to represent
their membership to that group. In OverSoc, users request
membership to the group like they do friendship requests, in

---

## Page 5

5
response a group manager can sign their certiﬁcate allowing
that member access to the group. Finally, the group can be
bootstrapped in the same way as the proﬁle overlay through
the directory overlay.
The unique challenge presented by groups is the sharing
of the CA task. A decentralized solution would be for all
members of the group to be listed in the groups DHT and
when a peer becomes a manager, they obtain a new signature
packet that contains a user-deﬁned component stating that they
are managers. If an administrator loses their position, then all
members who had their certiﬁcate signed by that administrator
would need to obtain a new certiﬁcate. To avoid member
churn, the owner could provide signature packets for all group
members. Thus the managers just allow temporary access until
the owner comes online and provides more permanent access.
IV. USER INTERACTION
OverSoc consists of many components that are transparent
to the user, the user experience should appear to the user
no differently than an existing online social network. The
OverSoc could be a downloadable application or a browser
based Flash or Silverlight application. If the user, Bob, had
already created an account, Bob would be presented with an
interface showing their friends proﬁles. Based upon Bob’s
conﬁguration, the social application could retrieve proﬁle
updates as he navigates to individual proﬁles or as soon as the
application joins an individual proﬁle overlay, reactive versus
proactive proﬁle querying.
If this was Bob’s ﬁrst time starting OverSoc, he would
be presented with screens asking for his privacy preferences,
such as whether or not he wants his information in the
directory overlay, if he felt comfortable enough with the idea
of people knowing he was a member of the social network
and who his friends are. Then OverSoc would ask for personal
information to populate his proﬁle and to generate his directory
information. At which point, the OverSoc would join the
overlay and create Bob’s private overlay. Bob could then start
searching for friends, make friend requests, and respond to
friend requests.
Recently, Bob had been thinking about his high school days
and was curious if Alice was also a member of OverSoc,
though Bob did not have Alice’s e-mail address, just her ﬁrst
and last name. Bob enters Alice’s name into the OverSoc
search box and is presented by a list of Alice’s. As Bob
reviews each of the entries, he recognizes an Alice that is
friend’s with some of the same people Bob was in high
school. Bob selects to become her friend. At which point,
the OverSoc transparently inserts a friendship request to Alice
and signs Alice’s certiﬁcate so Alice can view Bob’s proﬁle.
Of course that is because Bob has chosen to allow user-
initiated friend requests access to his proﬁle. Alice receives
Bob’s request, peruses his proﬁle and feels ﬁne becoming
friends with Bob, which initiates a transparent process of
signing Bob’s certiﬁcate and placing the result in the public
overlay. There is one problem though, when Bob receives
Alice’s signature and views her proﬁle, he realizes that this
is some other Alice. He quickly chooses to defriend her. This
causes Bob’s OverSoc instance to broadcast a revocation for
Alice’s signature and to store the revocation in the DHT. Alice,
who was viewing Bob’s proﬁle, is notiﬁed of this sudden loss
of trust and while she is able to view the contents of Bob’s
proﬁle, which she has already accessed and obtained, she can
no longer receive updates as members of Bob’s overlay prevent
her from accessing it.
In another instance, Bob bumped into Carol, who e-mailed
Bob a copy of her certiﬁcate. Bob points OverSoc to the
certiﬁcate, and OverSoc veriﬁes that he wants to become
friends with the identity associated with the certiﬁcate. When
he accepts, OverSoc immediately submits a request to become
Carol’s friend. Carol receives notiﬁcation and accepts Bob’s
friendship request. At this point, both Bob and Carol have
transparently exchanged signed certiﬁcates and have mutual
access to each other proﬁles. As Bob reads Carol’s latest news,
he remembers a funny personal story and that he would like to
share with Carol. So he sends Carol a private message. Carol
is ofﬂine though. The next time Carol goes online, her social
application discovers the message and presents it to her. In
this scenario, OverSoc has taken the private message, secured
it with her public key and a symmetric key and signed it with
his private key. After which, it inserts the message into the
DHT and sends a notice to the event notiﬁcation system, which
detects that there were no listeners. When Carol’s application
comes online, it queries the DHT receiving the message. Prior
to presenting Carol the message, the OverSoc decrypts and
veriﬁes the message.
The OverSoc architecture can leverage existing social
networks to bootstrap trust. For example, consider Bob and
David are two friends on Facebook. Bob joins a Facebook
application called “OverSoc/Facebook Bridge”, which stores
a copy of his OverSoc certiﬁcate in his personal proﬁle. Bob
has been bragging to David about OverSoc and mentions to
him how easy it is to migrate from Facebook to OverSoc
using this application. So David joins OverSoc as well as the
application. When David accesses the application, it pastes
his certiﬁcate to his proﬁle, notiﬁes notiﬁes him that he has
a friend already using it, Bob, and that he can immediately
sign Bob’s certiﬁcate, and leaves a request for Bob to sign his
certiﬁcate. Additionally, when David logs into OverSoc, he
can leave a friend request there as well, so that the next time
Bob accesses Facebook or OverSoc, he will receive David’s
request and can sign David’s certiﬁcate. At which point, both
will have access to each others OverSoc proﬁle overlays.
V. CHALLENGES
While structured P2P overlays have been well-studied in
a variety of applications, their use in social proﬁle overlays
raises new interesting questions, including:

1) Handling small overlay networks - P2P overlay
research typically focuses on networks larger than the typical
user’s friend count (Facebook’s average is 1301). Because
social proﬁle overlays are comparatively smaller, this can
impact the reliability of the overlay and availability of proﬁle
data. A user can host their own proﬁle; however when the
user is disconnected it is important that their proﬁle remains
1<http://www.facebook.com/press/info.php?statistics>

---

## Page 6

6
available even under churn. It is thus important to characterize
churn in this application to understand how to best approach
this problem. An optional of per-user deployment of a virtual
individual server (VIS) and the use of replication schemes
aware of a user’s resources provide possible directions to
address this issue.
2) Overlay support for low throughput, unconnected
devices - devices such as smart phones cannot constantly be
actively connected to the overlay and the connection time
necessary to retrieve something like a phone number may be
too much to make this approach useful. Similar to the previous
challenge, this approach could beneﬁt from using a VIS
enabling users access to their social overlays by proxy without
establishing a direct connection to the overlay network.
3) Reliability of the directory and proﬁle overlay -
Overlays are susceptible to attacks that can nullify their
usefulness. While the proﬁle overlay does have point-to-point
security, in the public, directory overlay, the lack of any
form centralization makes policing the system a complicated
procedure. While our approach of appending friends list can
assist users in making decisions on identity, it does not
protect against denial of service attacks. For example, users
could attempt create many similar identities in an attempt
to overwhelm a user in their attempt to ﬁnd a speciﬁc peer.
Previous work has proposed methods to ensure the usability of
overlays even while under attack. For the social overlay to be
successful, we must identify which methods should be used.
A possible approach is to replicate public information within
a user’s proﬁle overlay thus providing an alternative directory
overlay for querying prior to using the public directory overlay.
4) Social proﬁle data storage - In previous works, DHTs
have been used as the building blocks to form more complex
distributed data stores as presented in Past [19] and Kosha [20].
Application of data stores will be heavily dependent on the
churn rate associated with the overlay. If the system lacks
any reasonably stable membership, large data ﬁles may be
corrupted while smaller data sets are completely lost. Ideally,
the usage model would be similar to those of Skype and
Twitter, which have active processes for the duration of the
computers usage. In an environment like this, data storage
would be limited only by the available bandwidth of the
participants.
VI. CONCLUSION
In this paper, we proposed OverSoc, a system that constructs
a decentralized online social network through the use of
structure P2P overlays. P2P systems, in general, have very
nice properties that make them attractive for average users.
Namely, they require minimal conﬁguration and organization
of resources, in addition, P2P systems naturally handle
increased demand due to additional peers. Our approach is
based upon the use of a multiple overlay system, where
all users join a public directory overlay which assists in
ﬁnding friends and groups and bootstrapping into their private
overlays. When making a friendship or joining groups, peers
exchange signatures that enable access to each others overlays.
Each private overlay employs point-to-point encryption and
authentication so that only trusted peers can access the
overlays. The use of unique overlays for each proﬁle and group
allows a clean abstraction for privacy purposes that simpliﬁes
security handling of access to private data. Existing work in
the realm of structured overlays describes mechanisms for
efﬁciently and securely storing proﬁle information into the
proﬁle overlay. Our proposed system returns control of the
social network and more importantly users’ identity to the
users and eliminates the need for centralized social networks.
The most important insight in this paper is that structured
overlays can be used to efﬁciently organize and maintain a
social network.
REFERENCES
[1] J. C. Perez, “Facebook’s
beacon more intrusve than previously
thought,”
<http://www.pcworld.com/article/140182/facebooks> beacon
more intrusive than previously thought.html, 2007.
[2] S. Buchegger and A. Datta, “A case for P2P infrastructure for social
networks - opportunities & challenges,” in WONS ’09: The Sixth
International Conference on Wireless On-demand Network Systems and
Services, 2009.
[3] D. I. Wolinsky, K. Lee, T. W. Choi, P. O. Boykin, and R. Figueiredo,
“Virtual private
overlays: Secure group communication
in NAT-
constrained environments,” January 2010.
[4] T. Klingberg and R. Manfredi, “Gnutella 0.6,” <http://rfc-gnutella>.
sourceforge.net/src/rfc-0 6-draft.html, June 2002.
[5] hex, “The fasttrack protocol,” <http://cvs.berlios.de/cgi-bin/viewcvs.cgi/>
gift-fasttrack/giFT-FastTrack/PROTOCOL, September 2004.
[6] A.
Rowstron
and
P.
Druschel,
“Pastry:
Scalable,
decentralized
object location and routing for large-scale peer-to-peer systems,” in
IFIP/ACM International Conference on Distributed Systems Platforms
(Middleware), November 2001.
[7] I. Stoica and et al., “Chord: A scalable Peer-To-Peer lookup service for
internet applications,” in SIGCOMM, 2001.
[8] G. S. Manku, M. Bawa, and P. Raghavan, “Symphony: distributed
hashing in a small world,” in USITS, 2003.
[9] P.
Maymounkov
and
D.
Mazi`eres,
“Kademlia:
A
peer-to-peer
information system based on the XOR metric,” in IPTPS ’02, 2002.
[10] S. Ratnasamy, P. Francis, S. Shenker, and M. Handley, “A scalable
content-addressable network,” in In Proceedings of ACM SIGCOMM,
2001.
[11] V.
Ramasubramanian
and
E.
G.
Sirer,
“Beehive:
O(1)lookup
performance for power-law query distributions in peer-to-peer overlays,”
in Symposium on Networked Systems Design and Implementation, 2004.
[12] D. I. Wolinsky, P. S. Juste, P. O. Boykin, and R. Figueiredo, “Addressing
the p2p bootstrap problem for small overlay networks,” , 2010.
[13] S. Buchegger, D. Schi¨oberg, L. H. Vu, and A. Datta, “Peerson: P2p social
networking: early experiences and insights,” in SNS ’09: Proceedings of
the Second ACM EuroSys Workshop on Social Network Systems, 2009.
[14] A. Shakimov, H. Lim, L. P. Cox, and R. Caceres, “Vis-`a-vis:online social
networking via virtual individual servers,” Tech. Rep., May 2008.
[15] L. A. Cutillo, R. Molva, and T. Strufe, “Privacy preserving social
networking through decentralization,” in Wireless On-Demand Network
Systems and Services (WONS’09).
[16] S. M. A. Abbas, J. A. Pouwelse, D. H. J. Epema, and H. J. Sips,
“A gossip-based distributed social networking system,” in Enabling
Technologies, IEEE International Workshops on, 2009.
[17] J. Albrecht, D. Oppenheimer, A. Vahdat, and D. A. Patterson, “Design
and implementation trade-offs for wide-area resource discovery,” in ACM
Trans. Internet Technol., 2008.
[18] M. Harren, J. M. Hellerstein, R. Huebsch, B. T. Loo, S. Shenker, and
I. Stoica, “Complex queries in dht-based peer-to-peer networks,” in
IPTPS ’01: Revised Papers from the First International Workshop on
Peer-to-Peer Systems, 2002.
[19] A. Rowstron and P. Druschel, “Storage management and caching
in PAST, a large-scale, persistent peer-to-peer storage utility,” in
Symposium on Operating Systems Principles (SOSP’01).
[20] A. R. Butt, T. A. Johnson, Y. Zheng, and Y. C. Hu, “Kosha: A
peer-to-peer enhancement for the network ﬁle system,” in IEEE/ACM
Supercomputing 2004.
