# cops-presentation

---

## Page 1

OverSoc
David Wolinsky, Pierre St. Juste,
Oscar Boykin, and Renato
Figueiredo
ACIS P2P Group
University of Florida

---

## Page 2

Issues
• Social networking profiles are the
ultimate means to make targeted
advertisements
– Targets situ
 life: marriage
– Foll
• Facebook’s beacon
• “Personalize” websites (example: CNN)
• Access control is difficult
– OSNs favor open models, users must
explicitly disable content or opt out
– OSNs, overtime, have made more
private information public

---

## Page 3

Privacy in Facebook

---

## Page 4

Motivation
• Centralized services require capital to
continue, motivating OSNs to be
invasive
• Users can ch
ing different,
• Many ways to organize a decentralized
OSN, existing work:
– Requires a user to be online to be
accessible
– Replicate entire profiles to many users
– Challenges in finding friends
• Structured overlays can be leveraged

---

## Page 5

Outline
• Issues and Motivation
• OverSoc Introduction
• State of Str
rlays
•
• Rem

---

## Page 6

Outline
• Issues and Motivation
• OverSoc Introduction
• State of Str
rlays
•
• Rem

---

## Page 7

Introducing OverSoc
• User-centric
– Each has their own overlay
– Content stored on self
and peers
– All l
d, only
authorized peers can access
• Share a common directory overlay
– Used to find peers
– Used to connect to users’ overlays
• Groups – shared user overlays

---

## Page 8

Outline
• Issues and Motivation
• OverSoc Introduction
• State of Str
rlays
•
• Rem

---

## Page 9

Structured Overlays
• Efficient key/value lookup through DHT
– O(log N) look up time
– Results from eDonkey KAD studies show
that DHT da
 sharing
t
• Replicate sufficiently (10 times)
• Real world usage
– eDonkey KAD finds media via hashes /
keywords
– Torrentless BitTorrent Tracker
– LimeWire to assist in firewall / NAT
traversal (push proxies)

---

## Page 10

Structured Overlays
• Efficient broadcasting
– Log^2(n), no overlap
– Distribute / aggregate [2]
• First broad
r
– DeeToo [3]
• Broadcasting can efficiently find things, but
efficient distribution is still challenging
• Use two rings, one transposes the other, one
used for storing the other for searching
• Broadcasts store, Distribute/aggregate
searches

---

## Page 11

Our Related Work
Our foray into OSNs thus far has
focused on Social IP connectivity and
bootstrapping private overlays
•
– Lev
 to
create IP links
– Reuse existing network applications
– Each peer has their own VPN address
space, no IP collisions

---

## Page 12

Our Related Work
• Creating private overlays
– DTLS secures all P2P links
– Certificates
a CA
Add a node to an existing overlay
Bootstrap from a public overlay
into a private overlay

---

## Page 13

Outline
• Issues and Motivation
• OverSoc Introduction
• State of Str
rlays
•
• Rem

---

## Page 14

Identity in the Directory
Overlay
• Peers are identified by their PGP
certificate
• Key feature
friends
– Embed text data such as full name, e-
mail address, and other data
• PGP has a weak revocation model
– Each friend signature should have a TTL
– Friends renew signatures, keep
friendship active

---

## Page 15

Finding Friends
• Peers can use DeeToo to distribute and
find their PGP certificates
• PGP certificates contain:

as
• Third party services can store the
certificate and friendships can be
established out of band
• Peers seeking extreme privacy, need
not store anything inside the Directory
overlay

---

## Page 16

Establishing a Friendship
Alice has found Bob’s certificate and
now is establishing a friendship

---

## Page 17

Defriending
• Occurs if a peer does not renew a
PGP signature prior to the timeout
expiring
•
• Stor
HT

---

## Page 18

Connecting to a Profile
Overlay
Alice and Bob have a relationship, Alice
wants to connect to Bob’s overlay

---

## Page 19

Private Messages
• Two types:
– Friendship requests in the directory
– Private mes
rofile overlay
•
– Encr
blic_key,
secr
• Only peer with the private key can
read message
• Msg contains information such as the
sender, receiver, and time of
transmission

---

## Page 20

Operations inside the Profile
Overlay
• Private messages
– Store private messages in an explicit
key space
i
• Private message to Bob from Alice is stored
in Alice’s overlay
• Public messages are unencrypted but
are signed to prevent unidentifiable
messages
• Owner can insert a public message

---

## Page 21

Outline
• Issues and Motivation
• OverSoc Introduction
• State of Str
rlays
•
• Rem

---

## Page 22

Remaining Challenges
• Handling Small Overlay Networks
– Most P2P research has been performed
on scalability and reliability of large ( >
frie
– How to efficiently leverage small
structured overlays
• Overlay support for low throughput,
unconnected devices
– Passive nodes – common to many DHTs
– Ability to modify and update users

---

## Page 23

Remaining Challenges
• Preventing flood attacks in public
overlays
– Published d
ecurity
ap
• Data storage
– No need to reimplement data stores for
messages
– Examples of previous work: Past /
Kosha

---

## Page 24

Related Work
The techniques in OverSoc could be
used to enhance existing projects:
• PeerSon pla
s into a
• Vis-à
user’s
node
• SafeBook relies on a central
database to coordinate friendships
Challenges to getting users
bootstrapped…. Maybe Diaspora will
be successful

---

## Page 25

Conclusion
• OverSoc techniques leverage existing
structured overlay techniques to
construct profile based overlays
•
– Inv
 OSNs
and integrate OverSoc concepts into
them
– Address “Remaining Challenges”

---

## Page 26

New References

1. M. Steiner, T. En-Najjary , and E.W.
Biersack.  “A Global View of KAD.”  IMC’07
2. J. Li, K. Sollins, and D. Lim. “Implementing
Aggregation
over
3. T. Ch
able
“Unstructured Search Built on a Structured
Overlay.”  HOTP2P’10
4. P. St. Juste, D. Wolinsky. O. Boykin, M.
Covington, and R. Figueiredo.  “SocialVPN:
Enabling wide-area collaboration with
integrated social and overlay networks.”
Journal of Computer Networks. 01/2010

---

## Page 27

Thank you!
