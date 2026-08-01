# chapter-08-v6-0

---

## Page 1

8-1
Chapter 8
Security
rking: A
Top Down
Approach
6th edition
Jim Kurose, Keith
Ross
Addison-Wesley
March 2012
A note on the
We’re making these
They’re in PowerPoint form so you see the animations; and can add, modify,
and delete slides  (including this one) and slide content to suit your needs.
They obviously represent a lot of work on our part. In return for use, we only
ask the following:
v If you use these slides (e.g., in a class) that you mention their source
(after all, we’d like people to use our book!)
v If you post any slides on a www site, that you note that they are adapted
from (or perhaps identical to) our slides, and note our copyright of this
material.
Thanks and enjoy!  JFK/KWR
     All material copyright 1996-2012
     J.F Kurose and K.W. Ross, All Rights Reserved

---

## Page 2

8-2
Network Security
Chapter 8: Network
Security
Chapter goals:
v understand principles of network security:
§ cryptography
ses beyond
§ message integrity
v security in practice:
§ firewalls and intrusion detection systems
§ security in application, transport, network, link
layers

---

## Page 3

8-3
Network Security
Chapter 8 roadmap
8.1 What is network security?
8.2 Principles of cryptography
8.5 Securing TCP connections: SSL
8.6 Network layer security: IPsec
8.7 Securing wireless LANs
8.8 Operational security: firewalls and
IDS

---

## Page 4

8-4
Network Security
What is network security?
confidentiality: only sender, intended receiver
should “understand” message contents
§ sender encry
authen
confirm identity of each other
message integrity: sender, receiver want to
ensure message not altered (in transit, or
afterwards) without detection
access and availability: services must be
accessible and available to users

---

## Page 5

8-5
Network Security
Friends and enemies: Alice,
Bob, Trudy
v well-known in network security world
v Bob, Alice (lovers!) want to communicate
“securely”
v Trudy (intruder
 delete, add
secure
sender
ssecure
receiver
messages
data
data
Trudy

---

## Page 6

8-6
Network Security
Who might Bob, Alice be?
v … well, real-life Bobs and Alices!
v Web browser/server for electronic
transactions
urchases)
v DNS
v routers exchanging routing table
updates
v other examples?

---

## Page 7

8-7
Network Security
There are bad guys (and girls)
out there!
Q: What can a “bad guy” do?
A: A lot! See section 1.6
§ eavesdrop: intercept messages
§ im
source address in packet (or any field
in packet)
§ hijacking: “take over” ongoing
connection by removing sender or
receiver, inserting himself in place
§ denial of service: prevent service from
being used by others (e.g.,  by

---

## Page 8

8-8
Network Security
Chapter 8 roadmap
8.1 What is network security?
8.2 Principles of cryptography
8.5 Securing TCP connections: SSL
8.6 Network layer security: IPsec
8.7 Securing wireless LANs
8.8 Operational security: firewalls and
IDS

---

## Page 9

8-9
Network Security
The language of cryptography
m plaintext message
KA(m) ciphertext, encrypted with key KA
m = KB(KA(m))
KA
encryption
decryption
Alice’s
encryption
key
Bob’s
decryption
key
KB

---

## Page 10

8-10
Network Security
Breaking an encryption
scheme
v cipher-text only
attack: Trudy has
ciphertext she
§ bru
search through all
keys
§ statistical analysis
v known-plaintext
attack: Trudy has
ext
monoalphabetic
cipher, Trudy
determines pairings
for a,l,i,c,e,b,o,
v chosen-plaintext
attack: Trudy can get
ciphertext for chosen
plaintext

---

## Page 11

8-11
Network Security
Symmetric key cryptography
symmetric key crypto: Bob and Alice share same
(symmetric) key: K
v e.g., key is knowing substitution pattern in mono
alphabetic substitution cipher
Q: how do Bob and Alice agree on key value?
plaintext
K S
encryption
ption
S
K S
plaintext
m
S
S

---

## Page 12

8-12
Network Security
Simple encryption scheme
substitution cipher: substituting one thing for
another
§ monoalphabetic cipher: substitute one letter for
another
plaintext:
nopqrstuvwxyz
ciph
trewq
Plaintext: bob. i love you. alice
ciphertext: nkn. s gktc wky. mgsbc
e.g.:
Encryption key: mapping from set of
26 letters
                     to set of 26 letters

---

## Page 13

8-13
Network Security
A more sophisticated encryption
approach
v n substitution ciphers, M1,M2,…,Mn
v cycling pattern:
§ e.g., n=4: M1,M3,M4,M3,M2;   M1,M3,M4,M3,M2;
..
subs
yclic
pattern
§ dog: d from M1, o from M3, g from M4
    Encryption key: n substitution ciphers,
and cyclic             pattern
§ key need not be just n-bit pattern

---

## Page 14

8-14
Network Security
Symmetric key crypto: DES
DES: Data Encryption Standard
v US encryption standard [NIST 1993]
v 56-bit symmetric key, 64-bit plaintext input
v block cipher wi
haining
§ DE
phrase
decrypted (brute force) in less than a day
§ no known good analytic attack
v making DES more secure:
§ 3DES: encrypt 3 times with 3 different keys

---

## Page 15

8-15
Network Security
Symmetric key
crypto: DES
initial permutatio
of fun
application, each
using different 48
bits of key
final permutation
DES operation

---

## Page 16

8-16
Network Security
AES: Advanced Encryption
Standard
v symmetric-key NIST standard, replacied
DES (Nov 2001)
v
v brute
y)
taking 1 sec on DES, takes 149 trillion
years for AES

---

## Page 17

8-17
Network Security
Public Key Cryptography
symmetric key
crypto
v requires sender,
shared
v Q: how to agree on
key in first place
(particularly if never
“met”)?
public key crypto
v radically different
ach [Diffie-
r do
not share secret
key
v public encryption
key  known to all
v private decryption
key known only to
receiver

---

## Page 18

8-18
Network Security
Public key cryptography
plaintext
message, m
ciphertext
encryption
algorithm
decryption
algorithm
Bob’s public
key
plaintext
message
K  (m)
B
+
K B
+
Bob’s private
key
K B
-

m = K  (K  (m))
B
+
B
-

---

## Page 19

8-19
Network Security
Public key encryption
algorithms
need K
ch that
given public key K  , it should be
impossible to compute private
key K  B
B
requirements:
1
2
RSA: Rivest, Shamir, Adelson algorithm
+
-

+
+

---

## Page 20

8-20
Network Security
Prerequisite: modular
arithmetic
v
x mod n = remainder of x when divide
by n
v
facts:
[(a m
mod n
[(a mod n) *(b mod n)] mod n = (a*b) mod n
v
thus
      (a mod n)d mod n = ad mod n
v
example: x=14, n=10, d=2:
(x mod n)d mod n = 42 mod 10 = 6
xd = 142 = 196   xd mod 10  = 6

---

## Page 21

8-21
Network Security
RSA: getting ready
v message: just a bit pattern
v bit pattern can be uniquely represented by an
integer number
example:
v m= 10010001 . This message is uniquely
represented by the decimal number 145.
v to encrypt m, we encrypt the corresponding
number, which gives a new number (the
ciphertext).

---

## Page 22

8-22
Network Security
RSA: Creating public/private key
pair

1. choose two large prime numbers p, q.
   (e.g., 1024 bits each)
2. compute n
)(q-1)
 fac
    wit
.
4. choose d such that ed-1 is  exactly divisible
    (in other words: ed mod z  = 1 ).
5. public key is (n,e).  private key is (n,d).
K B

+

K B
-

---

## Page 23

8-23
Network Security
RSA: encryption,
decryption
0.  given (n,e) and (n,d) as computed above

1. to encrypt message m (<n), compute
2. to
 compute
m = c
mod  n
d
m  =  (m   mod  n)
e
 mod  n
d
magic
happens!
c

---

## Page 24

8-24
Network Security
RSA example:
Bob chooses p=5, q=7.  Then n=35, z=24.
e=5  (so e, z  relatively prime).
d=29 (so ed-1 exactly divisible by z).

m  mod  n
e
0000l000
12
24832
17
encrypt:
c
m = c  mod  n
d
17
481968572106750915091411825223071697
12
cd
decrypt:

---

## Page 25

8-25
Network Security
Why does RSA work?
v must show that cd mod n = m
where c = me mod n
v fact: for any x
= x(y mod z) mod
v thus,
 cd mod n = (me mod n)d mod n
                  = med mod n
                  = m(ed mod z) mod n
                  = m1 mod n
                  = m

---

## Page 26

8-26
Network Security
RSA: another important
property
The following property will be very useful later:
K  (K  (m)
-

+

(m))
-

us
first, followed
by private key
key first,
followed by
public key
result is the
same!

---

## Page 27

8-27
Network Security
follows directly from modular arithmetic:

                             = (md mod n)e mod n

K  (K  (m))  =  m
B
B
-

+

K  (K  (m))
B
B
+
-

=
Why
?

---

## Page 28

8-28
Network Security
Why is RSA secure?
v suppose you know Bob’s public key
(n,e). How hard is it to determine d?
v essentially ne
ors of n
§ fact: factoring a big number is hard

---

## Page 29

8-29
Network Security
RSA in practice: session
keys
v exponentiation in RSA is
computationally intensive
v DES is at lea
ster than
v use p
cure
connection, then establish second key –
symmetric session key – for encrypting
data
session key, KS
v Bob and Alice use RSA to exchange a
symmetric key KS
v once both have KS, they use symmetric key

---

## Page 30

8-30
Network Security
Chapter 8 roadmap
8.1 What is network security?
8.2 Principles of cryptography
8.5 Securing TCP connections: SSL
8.6 Network layer security: IPsec
8.7 Securing wireless LANs
8.8 Operational security: firewalls and
IDS

---

## Page 31

8-31
Network Security
Authentication
Goal: Bob wants Alice to “prove” her
identity to him
rotocol ap1.0:  Alic
Alice”
Failure scenario??
“I am Alice”

---

## Page 32

8-32
Network Security
in a network,
Bob can not “see” Alice,
so Trudy simply declares
herself to be Alice
“I am Alice”
Authentication
Goal:  Bob wants Alice to “prove” her
identity to him
rotocol ap1.0:  Alic
Alice”

---

## Page 33

8-33
Network Security
Authentication: another
try
Protocol ap2.0: Alice says “I am Alice” in an IP packet
containing her source IP address
Failure scenario??
IP address

---

## Page 34

8-34
Network Security
Trudy can create
a packet “spoofing”
Alice’s address
“I am Alice”
Alice’s
IP address
Authentication: another
try
Protocol ap2.0: Alice says “I am Alice” in an IP packet
containing her source IP address

---

## Page 35

8-35
Network Security
ol ap3.0:  Alice says “I am Alice” and sends her
 secret password to “prove” it.
Failure scenario??
Ali
IP
OK
Alice’s
IP addr
Authentication: another
try

---

## Page 36

8-36
Network Security
playback attack: Trudy
records Alice’s packet
and later
plays it back to Bob
Ali
IP
OK
Alice’s
IP addr
“I’m Alice”
Alice’s
IP addr
Alice’s
password
ol ap3.0:  Alice says “I am Alice” and sends her
 secret password to “prove” it.
Authentication: another
try

---

## Page 37

8-37
Network Security
Authentication: yet
another try
ol ap3.1:  Alice says “I am Alice” and sends her
 encrypted secret password to “prove” it.
Failure scenario??
Ali
IP
OK
Alice’s
IP addr

---

## Page 38

8-38
Network Security
ecord
and
playback
still works!
Ali
IP
OK
Alice’s
IP addr
“I’m Alice”
Alice’s
IP addr
encrypted
password
Authentication: yet
another try
ol ap3.1:  Alice says “I am Alice” and sends her
 encrypted secret password to “prove” it.

---

## Page 39

8-39
Network Security
Goal: avoid playback attack
Failures, drawbacks?
ce: number (R) used only once-in-a-lifetime
ap4.0: to prove Alice “live”, Bob sends Alice
key
R
K    (R)
A-B
Alice is live, and
only Alice knows
key to encrypt
nonce, so it must
be Alice!
Authentication: yet
another try

---

## Page 40

8-40
Network Security
Authentication: ap5.0
ap4.0 requires shared symmetric key
v can we authenticate using public key
techniques?
R
omputes
K   (R)
A
-

“send me your public key”
K  A
+
(K  (R)) = R
A
-

K   A
+
and knows only Alice
could have the private
key, that encrypted R
such that
(K  (R)) = R
A
-

K  A
+

---

## Page 41

8-41
Network Security
ap5.0: security
hole
man (or woman) in the middle attack: Trudy
poses as Alice (to Bob) and as Bob (to Alice)
I am Alice
m Alice
ey
T
K   +
A
Send me your public key
A
K   +
T
K   (m)
+
T
m = K  (K   (m))
+
T
-

Trudy gets
sends m to Alice
encrypted with
Alice’s public key
A
K  (m)
+
A
m = K  (K   (m))
+
A
-

---

## Page 42

8-42
Network Security
difficu
v Bob receives everything that Alice sends, and
vice versa. (e.g., so Bob, Alice can meet one
week later and recall conversation!)
v problem is that Trudy receives all messages as
well!
ap5.0: security
hole
man (or woman) in the middle attack: Trudy
poses as Alice (to Bob) and as Bob (to Alice)

---

## Page 43

8-43
Network Security
Chapter 8 roadmap
8.1 What is network security?
8.2 Principles of cryptography
8.5 Securing TCP connections: SSL
8.6 Network layer security: IPsec
8.7 Securing wireless LANs
8.8 Operational security: firewalls and
IDS

---

## Page 44

8-44
Network Security
Digital
signatures
cryptographic technique analogous to
hand-written signatures:
v verif
lice)
can prove to someone that Bob, and no
one else (including Alice), must have
signed document

---

## Page 45

8-45
Network Security
simple digital signature for message m:
v Bob signs m by encrypting with his private
key KB, creat
ssage, KB(m)
-
+

Dear Alice
Oh, how I have missed
you. I think of you all the
time! …(blah blah blah)
Bob
Bob’s m
Public key
encryption
algorithm
Bob’s message,
m, signed
(encrypted) with
his private key
K B (m)
Digital
signatures

---

## Page 46

8-46
Network Security
-

Alice thus verifies that:
ü Bob signed m
ü no one else signed m
ü Bob signed m and not m‘
non-repudiation:
ü Alice can take m, and signature KB(m) to
court and prove that Bob signed m
-

Digital
signatures
v suppose Alice receives msg m, with signature:
m, KB(m)
v Alice verifies m signed by Bob by applying Bob’s
public key K
ecks K (K (m) ) =
v If KB
ust have
used Bob’s private key
-
+
+

+
+
+

---

## Page 47

8-47
Network Security
Message digests
computationally
expensive to public-
key-encrypt lo
goal: f
easy- to-compute
digital “fingerprint”
v apply hash function H
to m, get fixed size
message digest,
H(m).
v many-to-1
v produces fixed-size
msg digest
(fingerprint)
v given message digest
x, computationally
infeasible to find m
such that x = H(m)
large
message
m
H: Hash
Function
H(m)

---

## Page 48

8-48
Network Security
Internet checksum: poor crypto hash
function
Internet checksum has some properties of hash
function:
ü produces fixed length digest (16-bit sum) of
message
üB

I O U 1
0 0 . 9
9 B O B
49 4F 55 31
30 30 2E 39
39 42 D2 42
message
ASCII format
B2 C1 D2 AC
I O U 9
0 0 . 1
9 B O B
49 4F 55 39
30 30 2E 31
39 42 D2 42
message
ASCII format
B2 C1 D2 AC
different messages
but identical checksums!

---

## Page 49

8-49
Network Security
large
message
m
p
key K B
-

+

Bob sends digitally
signed message:
Alice verifies signature,
integrity of digitally
signed message:
KB(H(m))
-

encrypted
msg digest
))
encrypted
msg digest
m
H(m)
H(m)
Bob’s
public
key K B
+
equal
 ?
Digital signature = signed
message digest

---

## Page 50

8-50
Network Security
Hash function algorithms
v MD5 hash function widely used (RFC
1321)
§ computes 1
igest in 4-step
co
qual to
x
v SHA-1 is also used
§ US standard [NIST, FIPS PUB 180-1]
§ 160-bit message digest

---

## Page 51

8-51
Network Security
Recall: ap5.0 security
hole
man (or woman) in the middle attack: Trudy
poses as Alice (to Bob) and as Bob (to Alice)
I am Alice
m Alice
ey
T
K   +
A
Send me your public key
A
K   +
T
K   (m)
+
T
m = K  (K   (m))
+
T
-

Trudy gets
sends m to Alice
encrypted with
Alice’s public key
A
K  (m)
+
A
m = K  (K   (m))
+
A
-

---

## Page 52

8-52
Network Security
Public-key certification
v motivation: Trudy plays pizza prank on
Bob
§ Trudy create
§ Tru
§ Trudy sends order to Pizza Store
§ Trudy sends to Pizza Store her public key,
but says it’s Bob’s public key
§ Pizza Store verifies signature; then delivers
four pepperoni pizzas to Bob
§ Bob doesn’t even like pepperoni

---

## Page 53

8-53
Network Security
Certification
authorities
v certification authority (CA): binds public
key to particular entity, E.
v E (person, rout
public key with
§ CA
y.
§ certificate containing E’s public key digitally signed by
CA – CA says “this is E’s public key”
Bob’s
public
key K B
+
Bob’s
identifying
information
CA
private
key K CA
-

K B
+
certificate for
Bob’s public key,
signed by CA

---

## Page 54

8-54
Network Security
v when Alice wants Bob’s public key:
§ gets Bob’s certificate (Bob or elsewhere).
§ apply CA’s public key to Bob’s certificate,
get Bob’s pu
b’s
public
key
K B
+
CA
public
key
K CA
+
K B
Certification
authorities

---

## Page 55

8-55
Network Security
Chapter 8 roadmap
8.1 What is network security?
8.2 Principles of cryptography
8.5 Securing TCP connections: SSL
8.6 Network layer security: IPsec
8.7 Securing wireless LANs
8.8 Operational security: firewalls and
IDS

---

## Page 56

8-56
Network Security
Secure e-mail
Alice:
v generates random symmetric private key, KS
v encrypts message with KS  (for efficiency)
v also encrypts KS with Bob’s public key
v sends both KS(m) and KB(KS) to Bob
v Alice wants to send confidential e-mail, m, to Bob.
KS( ).
KB( )
KS(m )
KB(KS )
+
m
KS
KB+
KS( ).
KB( ).
KB-
KS
m
KS(m )
KB(KS )
+

---

## Page 57

8-57
Network Security
Secure e-mail
Bob:
v  uses his private key to decrypt and
recover KS
v  uses KS to decrypt KS(m) to recover
m
v Alice wants to send confidential e-mail, m, to Bob.
KS( ).
KB( )
KS(m )
KB(KS )
+
m
KS
KB+
KS( ).
KB( ).
KB-
KS
m
KS(m )
KB(KS )
+

---

## Page 58

8-58
Network Security
Secure e-mail (continued)
v Alice wants to provide sender authentication
message integrity
v  Alice digitally signs message
v  sends both message (in the clear) and digital signatu
-

H(m )
KA(-
KA-
m
+
KA+
A(H(m))
-

m
H( ).
H(m )
ompare

---

## Page 59

8-59
Network Security
Secure e-mail (continued)
v Alice wants to provide secrecy, sender authentication,
   message integrity.
Alice uses three keys: her private key, Bob’s
public key, newly created symmetric key
-

KA
-

m
KB( ).
+
+
KB(KS )
+
KB+
Internet
KS

---

## Page 60

8-60
Network Security
Chapter 8 roadmap
8.1 What is network security?
8.2 Principles of cryptography
8.5 Securing TCP connections: SSL
8.6 Network layer security: IPsec
8.7 Securing wireless LANs
8.8 Operational security: firewalls and
IDS

---

## Page 61

8-61
Network Security
SSL: Secure Sockets Layer
vwidely deployed
security protocol
§ supported by almost all
browsers, web s
vmecha
1994], implementation:
Netscape
vvariation -TLS:
transport layer security,
RFC 2246
vprovides
§ confidentiality
§ integrity
voriginal goals:
§ Web e-commerce
transactions
ryption (especially
n
§ optional client
authentication
§ minimum hassle in
doing business with
new merchant
vavailable to all TCP
applications
§ secure socket
interface

---

## Page 62

8-62
Network Security
SSL and TCP/IP
Application
TCP
normal application
Application
SSL
application  with SSL
v SSL provides application programming
interface (API) to applications
v C and Java SSL libraries/classes
readily available

---

## Page 63

8-63
Network Security
Could do something like
PGP:
v but want to send byte streams & interactive data
v want set of secret keys for entire connection
v want certificate exchange as part of protocol:
handshake phase
H( ).
KA( )
-

+

KA(H(m))
-

m
KA-
KS( ).
KB(KS )
KS
KB+

---

## Page 64

8-64
Network Security
Toy SSL: a simple secure
channel
v handshake: Alice and Bob use their
certificates, private keys to authenticate
each other a
hared secret
shar
v data transfer: data to be transferred is
broken up into series of records
v connection closure: special messages to
securely close connection

---

## Page 65

8-65
Network Security
Toy: a simple handshake
MS: master secret
EMS: encrypted master secret
hello
pub
te

---

## Page 66

8-66
Network Security
Toy: key derivation
v considered bad to use same key for more than
one cryptographic operation
§ use different ke
hentication code
(MAC) and encr
§ Kc

client to server
§ Mc = MAC key for data sent from client to
server
§ Ks = encryption key for data sent from
server to client
§ Ms = MAC key for data sent from server to
client
v keys derived from key derivation function

---

## Page 67

8-67
Network Security
Toy: data records
v why not encrypt data in constant stream as
we write it to TCP?
§ where would we put the MAC? If at end, no message
integrity until all data processed.
§ e.g., with insta
can we do
§ eac
§ receiver can act on each record as it arrives
v issue: in record, receiver needs to distinguish
MAC from data
§ want to use variable-length records
length
data
MAC

---

## Page 68

8-68
Network Security
Toy: sequence numbers
v problem: attacker can capture and
replay record or re-order records
v
§ MA
x
§ note: no sequence number field
v problem: attacker could replay all
records
v solution: use nonce

---

## Page 69

8-69
Network Security
Toy: control information
v problem: truncation attack:
§ attacker forges TCP connection close
segment
v solution: record types, with one type for
closure
§ type 0 for data; type 1 for closure
v MAC = MAC(Mx, sequence||type||data)
length
type
data
MAC

---

## Page 70

8-70
Network Security
Toy SSL: summary
hello
certificate, nonce
type 0, seq 1, data
type 0, seq 3, data
type 1, seq 4, close
type 1, seq 2, close
encrypted

---

## Page 71

8-71
Network Security
Toy SSL isn’t complete
v how long are fields?
v which encryption protocols?
enc
§ allow client and server to choose together
specific algorithm before data transfer

---

## Page 72

8-72
Network Security
SSL cipher suite
v cipher suite
§ public-key algorithm
§ symmetric encryption
algorithm
v
cipher suites
v negotiation: client,
server agree on
cipher suite
§ client offers choice
§ server picks one
common SSL symmetric
ciphers
§ DES – Data Encryption
ndard: block
ck
pher 2: block
§ RC4 – Rivest Cipher 4:
stream
SSL Public key encryption
§ RSA

---

## Page 73

8-73
Network Security
Real SSL: handshake (1)
Purpose

1. server authentication
3. esta
4. client authentication (optional)

---

## Page 74

8-74
Network Security
Real SSL: handshake (2)

1. client sends list of algorithms it supports,
along with client nonce
2. server choose
om list; sends
3.

publi
ret,
encrypts with server’s public key, sends to
server
4. client and server independently compute
encryption and MAC keys from
pre_master_secret and nonces
5. client sends a MAC of all the handshake
messages

---

## Page 75

8-75
Network Security
Real SSL: handshaking (3)
last 2 steps protect handshake from
tampering
v

v man-
nger
algorithms from list
v last 2 steps prevent this
§ last two messages are encrypted

---

## Page 76

8-76
Network Security
Real SSL: handshaking (4)
v why two random nonces?
v suppose Trudy sniffs all messages
between Alic
with
ce
of records
§ Bob (Amazon) thinks Alice made two
separate orders for the same thing
§ solution: Bob sends different random nonce
for each connection. This causes encryption
keys to be different on the two days
§ Trudy’s messages will fail Bob’s integrity
check

---

## Page 77

8-77
Network Security
SSL record protocol
data
encrypted
data and MAC
encrypted
data and MAC
record
header
record
header
record header:  content type; version; length
MAC:  includes sequence number, MAC key Mx
fragment:  each SSL fragment 214 bytes (~16 Kby

---

## Page 78

8-78
Network Security
SSL record format
content
type
SSL version
length
MAC
1 byte
2 bytes
3 bytes
data and MAC encrypted (symmetric algorithm)

---

## Page 79

8-79
Network Security
handshake: ClientHello
handshake: ServerHello
handshake: Certificate
handshake: ServerHelloDone
handshake: ClientKeyExchange
ec
ChangeCiph
handshake: Finished
application_data
application_data
Alert: warning, close_notify
Real SSL
connectio
n
TCP FIN follows
is encr

---

## Page 80

8-80
Network Security
Key derivation
v client nonce, server nonce, and pre-master
secret input into pseudo random-number
generator.
§ produces maste
block”
§ because of resumption: TBD
v key block sliced and diced:
§ client MAC key
§ server MAC key
§ client encryption key
§ server encryption key
§ client initialization vector (IV)
§ server initialization vector (IV)

---

## Page 81

8-81
Network Security
Chapter 8 roadmap
8.1 What is network security?
8.2 Principles of cryptography
8.5 Securing TCP connections: SSL
8.6 Network layer security: IPsec
8.7 Securing wireless LANs
8.8 Operational security: firewalls and
IDS

---

## Page 82

8-82
Network Security
What is network-layer
confidentiality ?
between two network entities:
v sending entity encrypts datagram
payload, payl
v all data sent from one entity to other
would be hidden:
§ web pages, e-mail, P2P file transfers, TCP
SYN packets …
v “blanket coverage”

---

## Page 83

8-83
Network Security
Virtual Private Networks
(VPNs)
motivation:
vinstitutions often want private networks
for security.
§ costly: separ
s, DNS
vVPN:
is sent
over public Internet instead
§ encrypted before entering public Internet
§ logically separate from other traffic

---

## Page 84

8-84
Network Security
IP
header
IPsec
header
Secure
payload
IP
header
Secure
payload
IP
head
IP
header
payload
IP
header
payload
headquarters
branch office
salesperson
laptop
w/ IPsec
IPv4 and IPsec
IPv4 and IPsec
public
Internet
Virtual Private Networks
(VPNs)

---

## Page 85

8-85
Network Security
IPsec services
v data integrity
v origin authentication
v two protocols providing different service
models:
§ AH
§ ESP

---

## Page 86

8-86
Network Security
IPsec transport mode
v IPsec datagram emitted and received by
end-system
v protects upper level protocols
IPsec
sec

---

## Page 87

8-87
Network Security
IPsec – tunneling mode
v edge routers IPsec-
aware
IPsec
v hosts IPsec-aware

---

## Page 88

8-88
Network Security
Two IPsec protocols
v Authentication Header (AH) protocol
§ provides source authentication & data
integrity but
ty
§ pro
integrity, and confidentiality
§ more widely used than AH

---

## Page 89

8-89
Network Security
Four combinations are
possible!
Host mode
with A
Host mode
SP
Tunnel mode
with AH
Tunnel mode
with ESP
most common and
most important

---

## Page 90

8-90
Network Security
Security associations
(SAs)
v before sending data, “security association
(SA)”  established from sending to
receiving ent
v endi
state
information about SA
§ recall: TCP endpoints also maintain state info
§ IP is connectionless; IPsec is connection-
oriented!
v how many SAs in VPN w/ headquarters,
branch office, and n traveling
salespeople?

---

## Page 91

8-91
Network Security
Example SA from R1 to R2
R1 st
v 32-bit SA identifier: Security Parameter Index (SPI)
v origin SA interface (200.168.1.100)
v destination SA interface (193.68.2.23)
v type of encryption used (e.g., 3DES with CBC)
v encryption key
v type of integrity check used (e.g., HMAC with MD5)
v authentication key
193.68.2.23
200.168.1.100
Internet
headquarters
branch office
R1
R2

---

## Page 92

8-92
Network Security
Security Association Database
(SAD)
v endpoint holds SA state in security
association database (SAD), where it
can locate the
essing.
SAD
v when sending IPsec datagram, R1
accesses SAD to determine how to
process datagram.
v when IPsec datagram arrives to R2, R2
examines SPI in IPsec datagram,
indexes SAD with SPI, and processes
datagram accordingly

---

## Page 93

8-93
Network Security
IPsec datagram
focus for now on tunnel mode with ESP
new IP
header
hdr
IP hdr
datagram payload
trl
auth
“e
padding
pad
length
next
header
SPI
Seq

#

---

## Page 94

8-94
Network Security
What happens?
new IP
header
ESP
hdr
original
IP hdr
Original IP
datagram payload
ESP
trl
ESP
auth
encrypted
“enchilada” authenticated
padding
pad
length
next
header
SPI
Seq

#

193.68.2.23
200.168.1.100
Internet
headquarters
branch office
R1
R2

---

## Page 95

8-95
Network Security
R1: convert original datagram to IPsec
datagram
v appends to back of original datagram (which
includes original header fields!) an “ESP trailer”
field.
y
v appen
ty the
“ESP header, creating “enchilada”.
v creates authentication MAC over the whole
enchilada, using algorithm and key specified in
SA;
v appends MAC to back of enchilada, forming
payload;
v creates brand new IP header, with all the classic
IP 4 h
d
fi ld
hi h it
d
b f

---

## Page 96

8-96
Network Security
Inside the enchilada:
v ESP trailer: Padding for block ciphers
v ESP header:
§ SPI, so receiving entity knows what to do
§ Sequence number, to thwart replay attacks
v MAC in ESP auth field is created with shared
secret key
new IP
header
ESP
hdr
original
IP h
Original IP
ESP
trl
ESP
auth
encrypted
“enchilada” authenticated
r

---

## Page 97

8-97
Network Security
IPsec sequence numbers
v for new SA, sender initializes seq. # to
0
v each time dat
 on SA:
v goal:
§ prevent attacker from sniffing and replaying
a packet
§ receipt of duplicate, authenticated IP
packets may disrupt service
v method:
§ destination checks for duplicates

---

## Page 98

8-98
Network Security
Security Policy Database
(SPD)
v policy: For a given datagram, sending
entity needs to know if it should use
IPsec
§ ma
address; protocol number
v info in SPD indicates “what” to do with
arriving datagram
v info in SAD indicates “how” to do it

---

## Page 99

8-99
Network Security
Summary: IPsec services
v suppose Trud
ere between
§ will
nts of
datagram? How about source, dest IP
address, transport protocol, application
port?
§ flip bits without detection?
§ masquerade as R1 using R1’s IP address?
§ replay a datagram?

---

## Page 100

8-100
Network Security
IKE: Internet Key
Exchange
v previous examples: manual establishment of
IPsec SAs in IPsec endpoints:
Example SA
SPI: 12345
Encryption algorithm: 3DES-cbc
HMAC algorithm: MD5
Encryption key: 0x7aeaca…
HMAC key:0xc0291f…
v manual keying is impractical for VPN with 100s
of endpoints
v instead use IPsec IKE (Internet Key Exchange)

---

## Page 101

8-101
Network Security
IKE: PSK and PKI
v authentication (prove who you are) with
either
§ pre-shared secret (PSK) or
§ with PKI (pu
and certificates).
§ run
 to
generate IPsec SAs (one in each direction),
including encryption, authentication keys
v PKI: both sides start with public/private
key pair, certificate
§ run IKE to authenticate each other, obtain
IPsec SAs (one in each direction).
§ similar with handshake in SSL.

---

## Page 102

8-102
Network Security
IKE phases
v IKE has two phases
§ phase 1: establish bi-directional IKE SA
• note: IKE
 IPsec SA
ne
v phase 1 has two modes: aggressive
mode and main mode
§ aggressive mode uses fewer messages
§ main mode provides identity protection and
is more flexible

---

## Page 103

8-103
Network Security
IPsec summary
v IKE message exchange for algorithms,
secret keys, SPI numbers
v
au
§ ESP protocol (with AH) additionally
provides encryption
v IPsec peers can be two end systems,
two routers/firewalls, or a
router/firewall and an end system

---

## Page 104

8-104
Network Security
Chapter 8 roadmap
8.1 What is network security?
8.2 Principles of cryptography
8.5 Securing TCP connections: SSL
8.6 Network layer security: IPsec
8.7 Securing wireless LANs
8.8 Operational security: firewalls and
IDS

---

## Page 105

8-105
Network Security
WEP design goals
v symmetric key crypto
§ confidentiality
§ end host aut
v self-s
separately encrypted
§ given encrypted packet and key, can decrypt;
can continue to decrypt packets when
preceding packet was lost (unlike Cipher
Block Chaining (CBC) in block ciphers)
v Efficient
§ implementable in hardware or software

---

## Page 106

8-106
Network Security
Review: symmetric stream
ciphers
§ m(i) = ith unit of message
§ ks(i) = ith unit of keystream
§ c(i) = ith unit of ciphertext
§ c(i) = ks(i)  m(i)   ( = exclusive or)
§ m(i) = ks(i)  c(i)
v WEP uses RC4
keystream
generator
key
keystream

---

## Page 107

8-107
Network Security
Stream cipher and packet
independence
v recall design goal: each packet separately
encrypted
v if for frame n+
 from where we
§ nee
ket n
v WEP approach: initialize keystream with key +
new IV for each packet:
keystream
generator
Key+IVpacket
keystreampacket

---

## Page 108

8-108
Network Security
WEP encryption (1)
v sender calculates Integrity Check Value (ICV) over data
§ four-byte hash/CRC for data integrity
v each side has 104-bit shared key
v sender creates 24-bit initialization vector (IV), appends
to key: gives 128-bit key
v sender also appen
eld)
v data in
§ B\bytes of keystream are XORed with bytes of data & ICV
§ IV & keyID are appended to encrypted data to create
payload
§ payload inserted into 802.11 frame
encrypted
data
ICV
IV
MAC payload
Key
ID

---

## Page 109

8-109
Network Security
WEP encryption (2)
new IV for each
frame

---

## Page 110

8-110
Network Security
WEP decryption overview
v
rando
v XORs keystream with encrypted data to
decrypt data + ICV
v verifies integrity of data with ICV
§ note: message integrity approach used here
is different from MAC (message
authentication code) and signatures (using
PKI).
encrypted
data
ICV
IV
M
Key
ID

---

## Page 111

8-111
Network Security
End-point authentication
w/ nonce
ce: number (R) used only once –in-a-lifetime
How to prove Alice “live”:  Bob sends Alice
nonce, R.  Alice
R
K    (R)
A-B
Alice is live, and
only Alice knows
key to encrypt
nonce, so it
must be Alice!

---

## Page 112

8-112
Network Security
WEP authentication
authentication request
success if decrypted value equals nonce
Notes:
v not all APs do it, even if WEP is being used
v AP indicates if authentication is necessary in
beacon frame
v done before association

---

## Page 113

8-113
Network Security
Breaking 802.11 WEP
encryption
security hole:
v 24-bit IV, one IV per frame, -> IV’s eventually
reused
v
a
§ Trudy causes Alice to encrypt known plaintext d1
d2 d3 d4 …
§ Trudy sees: ci = di XOR  ki
IV
§ Trudy knows ci di, so can compute  ki
IV
§ Trudy knows encrypting key sequence k1
IV k2
IV
k3
IV …
§ Next time IV is used, Trudy can decrypt!

---

## Page 114

8-114
Network Security
 802.11i: improved
security
v numerous (stronger) forms of
encryption possible
v
from

---

## Page 115

8-115
Network Security
AP: access point
AS:
Authentication
 server
wired
network
STA:
client station
STA and AS mutually authenticate, together
generate Master Key (MK). AP serves as “pass through”
2
3
3
STA derives
Pairwise Master
Key (PMK)
AS derives
same PMK,
sends to AP
4
STA, AP use PMK to derive
Temporal Key (TK) used for message
encryption, integrity
 802.11i: four phases of
operation

---

## Page 116

8-116
Network Security
EAP TLS
EAP
EAP over LAN (EAPoL)
IEEE 802.11
RADIUS
UDP/IP
EAP: extensible authentication
protocol
v EAP: end-end client (mobile) to
authentication server protocol
v EAP sent ove
ks”
)
wired
network

---

## Page 117

8-117
Network Security
Chapter 8 roadmap
8.1 What is network security?
8.2 Principles of cryptography
8.5 Securing TCP connections: SSL
8.6 Network layer security: IPsec
8.7 Securing wireless LANs
8.8 Operational security: firewalls and
IDS

---

## Page 118

8-118
Network Security
Firewalls
isolates organization’s internal net from
larger Internet, allowing some packets to
firewall
administered
network
public
Internet
firewall
trusted “good guys”
untrusted “bad guys”

---

## Page 119

8-119
Network Security
Firewalls: why
prevent denial of service attacks:
v SYN flooding: attacker establishes many bogus
TCP connections, no resources left for “real”
connections
p
v e.g.,
with
something else
allow only authorized access to inside network
v set of authenticated users/hosts
three types of firewalls:
v stateless packet filters
v stateful packet filters
v application gateways

---

## Page 120

8-120
Network Security
Stateless packet filtering
v internal network connected to Internet via
router firewall
v router filters packet-by-packet, decision to
forward/drop packet based on:
§ source IP address, destination IP address
§ TCP/UDP source and destination port
numbers
§ ICMP message type
TCP SYN
nd ACK bit
Should arriving
packet be allowed in?
Departing packet let
out?

---

## Page 121

8-121
Stateless packet filtering:
example
Network Security
v example 1: block incoming and outgoing
datagrams with IP protocol field = 17 and
with either sou
 = 23
v exa
 with
ACK=0.
§ result: prevents external clients from
making TCP connections with internal
clients, but allows internal clients to
connect to outside.

---

## Page 122

8-122
Network Security
Policy
Firewall Setting
No outside Web access.
Drop all outgoing packets to any IP
address, port 80
public We
Prevent Web-radios from eating
up the available bandwidth.
Drop all incoming UDP packets -
except DNS and router broadcasts.
Prevent your network from being
used for a smurf DoS attack.
Drop all ICMP packets going to a
“broadcast” address (e.g.
130.207.255.255).
Prevent your network from being
tracerouted
Drop all outgoing ICMP TTL expired
traffic
Stateless packet filtering: more
examples

---

## Page 123

8-123
Network Security
action
source
ource
dest
flag
allow
2
allow
outside of
222.22/16
222.22/16
TCP
80
> 1023
ACK
allow
222.22/16
outside of
222.22/16
UDP
> 1023
53
---
allow
outside of
222.22/16
222.22/16
UDP
53
> 1023
----
deny
all
all
all
all
all
all
Access Control Lists
v ACL: table of rules, applied top to bottom to
incoming packets: (action, condition) pairs

---

## Page 124

8-124
Network Security
Stateful packet filtering
v stateless packet filter: heavy handed tool
§ admits packets that “make no sense,” e.g.,
dest port = 80, ACK bit set, even though no
TCP connectio
allow
222.22/16
ACK
v stateful packet filter: track status of every TCP
connection
§ track connection setup (SYN), teardown (FIN):
determine whether incoming, outgoing packets
“makes sense”
§ timeout inactive connections at firewall: no
longer admit packets

---

## Page 125

8-125
Network Security
action
source
dest
flag
check
xion
allow
outside of
222.22/16
222.22/16
TCP
80
> 1023
ACK
x
allow
222.22/16
outside of
222.22/16
UDP
> 1023
53
---
allow
outside of
222.22/16
222.22/16
UDP
53
> 1023
----
x
deny
all
all
all
all
all
all
Stateful packet filtering
v ACL augmented to indicate need to check
connection state table before admitting
packet

---

## Page 126

8-126
Network Security
Application gateways
v filters packets on
application data as well
as on IP/TCP/UD
v
internal
outside.
host-to-gateway
telnet session
gateway-to-remote
host telnet session
application
gateway
router and filter

1. require all telnet users to telnet through
gateway.
2. for authorized users, gateway sets up telnet
connection to dest host. Gateway relays data
between 2 connections
3. router filter blocks all telnet connections not
originating from gateway.

---

## Page 127

8-127
Network Security
Application gateways
v filter packets on
application data as
well as on
IP/TCP/UDP field
v
internal
telnet outside

1. require all telnet users to telnet through
gateway.
2. for authorized users, gateway sets up telnet
connection to dest host. Gateway relays data
between 2 connections
3. router filter blocks all telnet connections not
originating from gateway
application
gateway
host-to-gateway
telnet session
router and filter
gateway-to-remote
host telnet session

---

## Page 128

8-128
Network Security
Limitations of firewalls,
gateways
v IP spoofing: router
can’t know if data
“really” comes from
need
treatment, each has
own app. gateway
v client software must
know how to contact
gateway.
§ e.g., must set IP
address of proxy in
Web browser
v filters often use all
or nothing policy for
 level
of security
v many highly
protected sites still
suffer from attacks

---

## Page 129

8-129
Network Security
Intrusion detection
systems
v packet filtering:
§ operates on TCP/IP headers only
§ no correlatio
essions
§ dee

contents (e.g., check character strings in
packet against database of known virus,
attack strings)
§ examine correlation among multiple packets
• port scanning
• network mapping
• DoS attack

---

## Page 130

8-130
Network Security
Web
server FTP
server
DNS
server
Internet
demilitarized
zone
IDS
sensors
Intrusion detection
systems
v multiple IDSs: different types of
checking at different locations

---

## Page 131

8-131
Network Security
Network Security
(summary)
basic techniques…...
§ cryptography (symmetric and public)
§ message int
§ secure email
§ secure transport (SSL)
§ IP sec
§ 802.11
operational security: firewalls and IDS
