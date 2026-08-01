# ch08-chapter-8-v6.0 - Part 01 (Pages 1-66)

---

## Page 1

8-1
Chapter 8
Security
Computer
Networking: A Top
Down Approach
6th edition
Jim Kurose, Keith Ross
Addison-Wesley
March 2012
A note on the use of these ppt slides:
Were making these slides freely available to all (faculty, students, readers).
Theyre in PowerPoint form so you see the animations; and can add, modify,
and delete slides  (including this one) and slide content to suit your needs.
They obviously represent a lot of work on our part. In return for use, we only
ask the following:
v If you use these slides (e.g., in a class) that you mention their source
(after all, wed like people to use our book!)
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
Chapter 8: Network Security
Chapter goals:
v understand principles of network security:
§ cryptography and its many uses beyond confidentiality
§ authentication
§ message integrity
v security in practice:
§ firewalls and intrusion detection systems
§ security in application, transport, network, link layers

---

## Page 3

8-3
Network Security
Chapter 8 roadmap
8.1 What is network security?
8.2 Principles of cryptography
8.3 Message integrity, authentication
8.4 Securing e-mail
8.5 Securing TCP connections: SSL
8.6 Network layer security: IPsec
8.7 Securing wireless LANs
8.8 Operational security: firewalls and IDS

---

## Page 4

8-4
Network Security
What is network security?
confidentiality: only sender, intended receiver should
understand message contents
§ sender encrypts message
§ receiver decrypts message
authentication: sender, receiver want to confirm identity of
each other
message integrity: sender, receiver want to ensure message
not altered (in transit, or afterwards) without detection
access and availability: services must be accessible and
available to users

---

## Page 5

8-5
Network Security
Friends and enemies: Alice, Bob, Trudy
v well-known in network security world
v Bob, Alice (lovers!) want to communicate securely
v Trudy (intruder) may intercept, delete, add messages
secure
sender
ssecure
receiver
channel
data, control
messages
data
data
Alice
Bob
Trudy

---

## Page 6

8-6
Network Security
Who might Bob, Alice be?
v … well, real-life Bobs and Alices!
v Web browser/server for electronic transactions
(e.g., on-line purchases)
v on-line banking client/server
v DNS servers
v routers exchanging routing table updates
v other examples?

---

## Page 7

8-7
Network Security
There are bad guys (and girls) out there!
Q: What can a bad guy do?
A: A lot! See section 1.6
§ eavesdrop: intercept messages
§ actively insert messages into connection
§ impersonation: can fake (spoof) source address in
packet (or any field in packet)
§ hijacking: take over ongoing connection by
removing sender or receiver, inserting himself in
place
§ denial of service: prevent service from being used
by others (e.g.,  by overloading resources)

---

## Page 8

8-8
Network Security
Chapter 8 roadmap
8.1 What is network security?
8.2 Principles of cryptography
8.3 Message integrity, authentication
8.4 Securing e-mail
8.5 Securing TCP connections: SSL
8.6 Network layer security: IPsec
8.7 Securing wireless LANs
8.8 Operational security: firewalls and IDS

---

## Page 9

8-9
Network Security
The language of cryptography
m plaintext message
KA(m) ciphertext, encrypted with key KA
m = KB(KA(m))
plaintext
plaintext
ciphertext
KA
encryption
algorithm
decryption
algorithm
Alices
encryption
key
Bobs
decryption
key
KB

---

## Page 10

8-10
Network Security
Breaking an encryption scheme
v cipher-text only attack:
Trudy has ciphertext she
can analyze
v two approaches:
§ brute force: search
through all keys
§ statistical analysis
v known-plaintext attack:
Trudy has plaintext
corresponding to ciphertext
§ e.g., in monoalphabetic
cipher, Trudy determines
pairings for a,l,i,c,e,b,o,
v chosen-plaintext attack:
Trudy can get ciphertext for
chosen plaintext

---

## Page 11

8-11
Network Security
Symmetric key cryptography
symmetric key crypto: Bob and Alice share same (symmetric)
key: K
v e.g., key is knowing substitution pattern in mono alphabetic
substitution cipher
Q: how do Bob and Alice agree on key value?
plaintext
ciphertext
K S
encryption
algorithm
decryption
algorithm
S
K S
plaintext
message, m
K    (m)
S
m = KS(KS(m))

---

## Page 12

8-12
Network Security
Simple encryption scheme
substitution cipher: substituting one thing for another
§ monoalphabetic cipher: substitute one letter for another
plaintext:  abcdefghijklmnopqrstuvwxyz
ciphertext:  mnbvcxzasdfghjklpoiuytrewq
Plaintext: bob. i love you. alice
ciphertext: nkn. s gktc wky. mgsbc
e.g.:
Encryption key: mapping from set of 26 letters
to set of 26 letters

---

## Page 13

8-13
Network Security
A more sophisticated encryption approach
v n substitution ciphers, M1,M2,…,Mn
v cycling pattern:
§ e.g., n=4: M1,M3,M4,M3,M2;   M1,M3,M4,M3,M2; ..
v for each new plaintext symbol, use subsequent
subsitution pattern in cyclic pattern
§ dog: d from M1, o from M3, g from M4
Encryption key: n substitution ciphers, and cyclic
pattern
§ key need not be just n-bit pattern

---

## Page 14

8-14
Network Security
Symmetric key crypto: DES
DES: Data Encryption Standard
v US encryption standard [NIST 1993]
v 56-bit symmetric key, 64-bit plaintext input
v block cipher with cipher block chaining
v how secure is DES?
§ DES Challenge: 56-bit-key-encrypted phrase  decrypted
(brute force) in less than a day
§ no known good analytic attack
v making DES more secure:
§ 3DES: encrypt 3 times with 3 different keys

---

## Page 15

8-15
Network Security
Symmetric key
crypto: DES
initial permutation
16 identical rounds of
function application,
each using different 48
bits of key
final permutation
DES operation

---

## Page 16

8-16
Network Security
AES: Advanced Encryption Standard
v symmetric-key NIST standard, replacied DES
(Nov 2001)
v processes data in 128 bit blocks
v 128, 192, or 256 bit keys
v brute force decryption (try each key) taking 1 sec
on DES, takes 149 trillion years for AES

---

## Page 17

8-17
Network Security
Public Key Cryptography
symmetric key crypto
v requires sender, receiver
know shared secret key
v Q: how to agree on key in
first place (particularly if
never met)?
public key crypto
v radically different
approach [Diffie-
Hellman76, RSA78]
v sender, receiver do not
share secret key
v public encryption key
known to all
v private decryption key
known only to receiver

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
Bobs public
key
plaintext
message
K  (m)
B
+
K B
+
Bobs private
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
Public key encryption algorithms
need K  ( ) and K  ( ) such that
B
B
.
.
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

K  (K  (m))  =  m
B
B
-

+
+
+

---

## Page 20

8-20
Network Security
Prerequisite: modular arithmetic
v
x mod n = remainder of x when divide by n
v
facts:
[(a mod n) + (b mod n)] mod n = (a+b) mod n
[(a mod n) - (b mod n)] mod n = (a-b) mod n
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
v bit pattern can be uniquely represented by an integer
number
v thus, encrypting a message is equivalent to encrypting a
number.
example:
v m= 10010001 . This message is uniquely represented by
the decimal number 145.
v to encrypt m, we encrypt the corresponding number,
which gives a new number (the ciphertext).

---

## Page 22

8-22
Network Security
RSA: Creating public/private key pair

1. choose two large prime numbers p, q.
(e.g., 1024 bits each)
2. compute n = pq,  z = (p-1)(q-1)
3. choose e (with e<n) that has no common factors
with z (e, z are relatively prime).
4. choose d such that ed-1 is  exactly divisible by z.
(in other words: ed mod z  = 1 ).
5. public key is (n,e). private key is (n,d).
K B

+

K B
-

---

## Page 23

8-23
Network Security
RSA: encryption, decryption
0. given (n,e) and (n,d) as computed above

1. to encrypt message m (<n), compute
c = m   mod n
e
2. to decrypt received bit pattern, c, compute
m = c   mod n
d
m  =  (m   mod n)
e
mod n
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
e=5 (so e, z relatively prime).
d=29 (so ed-1 exactly divisible by z).
bit pattern
m
me
c = m  mod  n
e
0000l000
12
24832
17
encrypt:
encrypting 8-bit messages.
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
v fact: for any x and y: xy mod n = x(y mod z) mod n
§ where n= pq and z = (p-1)(q-1)
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
RSA: another important property
The following property will be very useful later:
K  (K  (m)) =  m
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
use public key first,
followed by
private key
use private key
first, followed by
public key
result is the same!

---

## Page 27

8-27
Network Security
follows directly from modular arithmetic:
(me mod n)d mod n = med mod n
= mde mod n
= (md mod n)e mod n
K  (K  (m)) =  m
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
v suppose you know Bobs public key (n,e). How
hard is it to determine d?
v essentially need to find factors of n without
knowing the two factors p and q
§ fact: factoring a big number is hard

---

## Page 29

8-29
Network Security
RSA in practice: session keys
v exponentiation in RSA is computationally
intensive
v DES is at least 100 times faster than RSA
v use public key cryto to establish secure
connection, then establish second key –
symmetric session key – for encrypting data
session key, KS
v Bob and Alice use RSA to exchange a symmetric key KS
v once both have KS, they use symmetric key cryptography

---

## Page 30

8-30
Network Security
Chapter 8 roadmap
8.1 What is network security?
8.2 Principles of cryptography
8.3 Message integrity, authentication
8.4 Securing e-mail
8.5 Securing TCP connections: SSL
8.6 Network layer security: IPsec
8.7 Securing wireless LANs
8.8 Operational security: firewalls and IDS

---

## Page 31

8-31
Network Security
Authentication
Goal: Bob wants Alice to prove her identity to him
Protocol ap1.0: Alice says I am Alice
Failure scenario??
I am Alice

---

## Page 32

8-32
Network Security
in a network,
Bob can not see Alice,
so Trudy simply declares
herself to be Alice
I am Alice
Authentication
Goal:  Bob wants Alice to prove her identity to him
Protocol ap1.0: Alice says I am Alice

---

## Page 33

8-33
Network Security
Authentication: another try
Protocol ap2.0: Alice says I am Alice in an IP packet
containing her source IP address
Failure scenario??
I am Alice
Alices
IP address

---

## Page 34

8-34
Network Security
Trudy can create
a packet
spoofing
Alices address
I am Alice
Alices
IP address
Authentication: another try
Protocol ap2.0: Alice says I am Alice in an IP packet
containing her source IP address

---

## Page 35

8-35
Network Security
Protocol ap3.0:  Alice says I am Alice and sends her
secret password to prove it.
Failure scenario??
Im Alice
Alices
IP addr
Alices
password
OK
Alices
IP addr
Authentication: another try

---

## Page 36

8-36
Network Security
playback attack: Trudy
records Alices packet
and later
plays it back to Bob
Im Alice
Alices
IP addr
Alices
password
OK
Alices
IP addr
Im Alice
Alices
IP addr
Alices
password
Protocol ap3.0:  Alice says I am Alice and sends her
secret password to prove it.
Authentication: another try

---

## Page 37

8-37
Network Security
Authentication: yet another try
Protocol ap3.1:  Alice says I am Alice and sends her
encrypted secret password to prove it.
Failure scenario??
Im Alice
Alices
IP addr
encrypted
password
OK
Alices
IP addr

---

## Page 38

8-38
Network Security
record
and
playback
still works!
Im Alice
Alices
IP addr
encrypted
password
OK
Alices
IP addr
Im Alice
Alices
IP addr
encrypted
password
Authentication: yet another try
Protocol ap3.1:  Alice says I am Alice and sends her
encrypted secret password to prove it.

---

## Page 39

8-39
Network Security
Goal: avoid playback attack
Failures, drawbacks?
nonce: number (R) used only once-in-a-lifetime
ap4.0: to prove Alice live, Bob sends Alice nonce, R.  Alice
must return R, encrypted with shared secret key
I am Alice
R
K    (R)
A-B
Alice is live, and
only Alice knows
key to encrypt
nonce, so it must
be Alice!
Authentication: yet another try

---

## Page 40

8-40
Network Security
Authentication: ap5.0
ap4.0 requires shared symmetric key
v can we authenticate using public key techniques?
ap5.0: use nonce, public key cryptography
I am Alice
R
Bob computes
K   (R)
A
-

send me your public key
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
ap5.0: security hole
man (or woman) in the middle attack: Trudy poses as Alice
(to Bob) and as Bob (to Alice)
I am Alice
I am Alice
R
T
K   (R)
-

Send me your public key
T
K   +
A
K   (R)
-

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
Alices public key
A
K  (m)
+
A
m = K  (K   (m))
+
A
-

R

---

## Page 42

8-42
Network Security
difficult to detect:
v Bob receives everything that Alice sends, and vice versa.
(e.g., so Bob, Alice can meet one week later and recall
conversation!)
v problem is that Trudy receives all messages as well!
ap5.0: security hole
man (or woman) in the middle attack: Trudy poses as Alice (to
Bob) and as Bob (to Alice)

---

## Page 43

8-43
Network Security
Chapter 8 roadmap
8.1 What is network security?
8.2 Principles of cryptography
8.3 Message integrity, authentication
8.4 Securing e-mail
8.5 Securing TCP connections: SSL
8.6 Network layer security: IPsec
8.7 Securing wireless LANs
8.8 Operational security: firewalls and IDS

---

## Page 44

8-44
Network Security
Digital signatures
cryptographic technique analogous to hand-written
signatures:
v sender (Bob) digitally signs document,  establishing
he is document owner/creator.
v verifiable, nonforgeable: recipient (Alice) can prove to
someone that Bob, and no one else (including Alice),
must have signed document

---

## Page 45

8-45
Network Security
simple digital signature for message m:
v Bob signs m by encrypting with his private key KB,
creating signed message, KB(m)
-
+

Dear Alice
Oh, how I have missed
you. I think of you all the
time! …(blah blah blah)
Bob
Bobs message, m
Public key
encryption
algorithm
Bobs private
key
K B
-

Bob’s message,
m, signed
(encrypted) with
his private key
m,K B
+ (m)
Digital signatures

---

## Page 46

8-46
Network Security
-

Alice thus verifies that:
ü Bob signed m
ü no one else signed m
ü Bob signed m and not m
non-repudiation:
ü Alice can take m, and signature KB(m) to court and
prove that Bob signed m
-

Digital signatures
v suppose Alice receives msg m, with signature: m, KB(m)
v Alice verifies m signed by Bob by applying Bobs public key
KB to KB(m) then checks KB(KB(m) ) = m.
v If KB(KB(m) ) = m, whoever signed m must have used Bobs
private key
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
computationally expensive to
public-key-encrypt long
messages
goal: fixed-length, easy- to-
compute digital
fingerprint
v apply hash function H to
m, get fixed size message
digest, H(m).
Hash function properties:
v many-to-1
v produces fixed-size msg
digest (fingerprint)
v given message digest x,
computationally infeasible to
find m such that x = H(m)
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
Internet checksum: poor crypto hash function
Internet checksum has some properties of hash function:
ü produces fixed length digest (16-bit sum) of message
ü is many-to-one
But given message with given hash value, it is easy to find another
message with same hash value:
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
H: Hash
function
H(m)
digital
signature
(encrypt)
Bobs
private
key K B
-

+

Bob sends digitally signed
message:
Alice verifies signature, integrity
of digitally signed message:
KB(H(m))
-

encrypted
msg digest
KB(H(m))
-

encrypted
msg digest
large
message
m
H: Hash
function
H(m)
digital
signature
(decrypt)
H(m)
Bobs
public
key K B
+
equal
?
Digital signature = signed message digest

---

## Page 50

8-50
Network Security
Hash function algorithms
v MD5 hash function widely used (RFC 1321)
§ computes 128-bit message digest in 4-step process.
§ arbitrary 128-bit string x, appears difficult to construct
msg m whose MD5 hash is equal to x
v SHA-1 is also used
§ US standard [NIST, FIPS PUB 180-1]
§ 160-bit message digest

---

## Page 51

8-51
Network Security
Recall: ap5.0 security hole
man (or woman) in the middle attack: Trudy poses as Alice
(to Bob) and as Bob (to Alice)
I am Alice
I am Alice
R
T
K   (R)
-

Send me your public key
T
K   +
A
K   (R)
-

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
Alices public key
A
K  (m)
+
A
m = K  (K   (m))
+
A
-

R

---

## Page 52

8-52
Network Security
Public-key certification
v motivation: Trudy plays pizza prank on Bob
§ Trudy creates e-mail order:
Dear Pizza Store, Please deliver to me four pepperoni
pizzas. Thank you, Bob
§ Trudy signs order with her private key
§ Trudy sends order to Pizza Store
§ Trudy sends to Pizza Store her public key, but says its
Bobs public key
§ Pizza Store verifies signature; then delivers four
pepperoni pizzas to Bob
§ Bob doesnt even like pepperoni

---

## Page 53

8-53
Network Security
Certification authorities
v certification authority (CA): binds public key to particular
entity, E.
v E (person, router) registers its public key with CA.
§ E provides proof of identity to CA.
§ CA creates certificate binding E to its public key.
§ certificate containing Es public key digitally signed by CA – CA
says this is Es public key
Bobs
public
key K B
+
Bobs
identifying
information
digital
signature
(encrypt)
CA
private
key K CA
-

K B
+
certificate for
Bobs public key,
signed by CA

---

## Page 54

8-54
Network Security
v when Alice wants Bobs public key:
§ gets Bobs certificate (Bob or elsewhere).
§ apply CAs public key to Bobs certificate, get Bobs
public key
Bobs
public
key
K B
+
digital
signature
(decrypt)
CA
public
key
K CA
+
K B
+
Certification authorities

---

## Page 55

8-55
Network Security
Chapter 8 roadmap
8.1 What is network security?
8.2 Principles of cryptography
8.3 Message integrity, authentication
8.4 Securing e-mail
8.5 Securing TCP connections: SSL
8.6 Network layer security: IPsec
8.7 Securing wireless LANs
8.8 Operational security: firewalls and IDS

---

## Page 56

8-56
Network Security
Secure e-mail
Alice:
v generates random symmetric private key, KS
v encrypts message with KS  (for efficiency)
v also encrypts KS with Bobs public key
v sends both KS(m) and KB(KS) to Bob
v Alice wants to send confidential e-mail, m, to Bob.
KS( ).
KB( ).
+
+
-

KS(m )
KB(KS )
+
m
KS
KS
KB+
Internet
KS( ).
KB( )
-

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
v uses his private key to decrypt and recover KS
v uses KS to decrypt KS(m) to recover m
v Alice wants to send confidential e-mail, m, to Bob.
KS( ).
KB( ).
+
+
-

KS(m )
KB(KS )
+
m
KS
KS
KB+
Internet
KS( ).
KB( )
-

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
v Alice wants to provide sender authentication message integrity
v Alice digitally signs message
v sends both message (in the clear) and digital signature
H( ).
KA( )
-

+
+

H(m )
KA(H(m))
-

m
KA-
Internet
m
KA( ).
+
KA+
KA(H(m))
-

m
H( ).
H(m )
compare

---

## Page 59

8-59
Network Security
Secure e-mail (continued)
v Alice wants to provide secrecy, sender authentication,
message integrity.
Alice uses three keys: her private key, Bobs public key, newly
created symmetric key
H( ).
KA( )
-

+

KA(H(m))
-

m
KA
-

m
KS( ).
KB( ).
+
+
KB(KS )
+
KS
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
8.3 Message integrity
8.4 Securing e-mail
8.5 Securing TCP connections: SSL
8.6 Network layer security: IPsec
8.7 Securing wireless LANs
8.8 Operational security: firewalls and IDS

---

## Page 61

8-61
Network Security
SSL: Secure Sockets Layer
vwidely deployed security
protocol
§ supported by almost all
browsers, web servers
§ https
§ billions $/year over SSL
vmechanisms: [Woo 1994],
implementation: Netscape
vvariation -TLS: transport layer
security, RFC 2246
vprovides
§ confidentiality
§ integrity
§ authentication
voriginal goals:
§ Web e-commerce
transactions
§ encryption (especially
credit-card numbers)
§ Web-server authentication
§ optional client
authentication
§ minimum hassle in doing
business with new
merchant
vavailable to all TCP
applications
§ secure socket interface

---

## Page 62

8-62
Network Security
SSL and TCP/IP
Application
TCP
IP
normal application
Application
SSL
TCP
IP
application  with SSL
v
SSL provides application programming interface
(API) to applications
v
C and Java SSL libraries/classes readily available

---

## Page 63

8-63
Network Security
Could do something like PGP:
v but want to send byte streams & interactive data
v want set of secret keys for entire connection
v want certificate exchange as part of protocol: handshake phase
H( ).
KA( )
-

+

KA(H(m))
-

m
KA-
m
KS( ).
KB( ).
+
+
KB(KS )
+
KS
KB
+
Internet
KS

---

## Page 64

8-64
Network Security
Toy SSL: a simple secure channel
v handshake: Alice and Bob use their certificates,
private keys to authenticate each other and
exchange shared secret
v key derivation: Alice and Bob use shared secret to
derive set of keys
v data transfer: data to be transferred is broken up
into series of records
v connection closure: special messages to securely
close connection

---

## Page 65

8-65
Network Security
Toy: a simple handshake
MS: master secret
EMS: encrypted master secret
hello
public key certificate
KB+(MS) = EMS

---

## Page 66

8-66
Network Security
Toy: key derivation
v considered bad to use same key for more than one
cryptographic operation
§ use different keys for message authentication code (MAC) and
encryption
v four keys:
§ Kc = encryption key for data sent from client to server
§ Mc = MAC key for data sent from client to server
§ Ks = encryption key for data sent from server to client
§ Ms = MAC key for data sent from server to client
v keys derived from key derivation function (KDF)
§ takes master secret and (possibly) some additional random data
and creates the keys
