# 08404099

---

## Page 1

1939-1374 (c) 2018 IEEE. Personal use is permitted, but republication/redistribution requires IEEE permission. See <http://www.ieee.org/publications_standards/publications/rights/index.html> for more information.
This article has been accepted for publication in a future issue of this journal, but has not been fully edited. Content may change prior to final publication. Citation information: DOI 10.1109/TSC.2018.2853167, IEEE
Transactions on Services Computing
Blockchain For Large-Scale Internet of Things Data
Storage and Protection
Ruinian Li1, Tianyi Song1, Bo Mei2, Hong Li3,∗, Xiuzhen Cheng4, Liming Sun3
1Department of Computer Science, Bowling Green State University, Bowling Green, Ohio, 43403 USA
2Department of Computer Science, Texas Christian University, Fort Worth, TX, USA
3Institute of Information Engineering, Chineses Academy of Sciences, Beijing, China
3School of Cyber Security, University of Chinese Academy of Sciences, Beijing, China
4Department of Computer Science, The George Washington University, Washington, DC, USA
E-mail: {lir,tsong}@bgsu.edu, <b.mei@tcu.edu>, <cheng@gwu.edu>, {lihong,sunliming}@iie.ac.cn
Abstract—With the dramatically increasing deployment of
IoT devices, storing and protecting the large volume of IoT
data has become a signiﬁcant issue. Traditional cloud-based
IoT structures impose extremely high computation and storage
demands on the cloud servers. Meanwhile, the strong dependen-
cies on the centralized servers bring signiﬁcant trust issues. To
mitigate these problems, we propose a distributed data storage
scheme employing blockchain and cetriﬁcateless cryptography.
Our scheme eliminates the traditional centralized servers by
leveraging the blockchain miners who perform “transaction”
veriﬁcations and records audit with the help of certiﬁcateless
cryptography. We present a clear deﬁnition of the transactions in
a non-cryptocurrency system and illustrate how the transactions
are processed. To the best of our knowledge, this is the ﬁrst
work designing a secure and accountable IoT storage system
using blockchain. Additionally, we extend our scheme to enable
data trading and elaborate how data trading can be efﬁciently
and effectively achieved.
Index Terms—IoT; Blockchain; Certiﬁcateless Cryptography
I. INTRODUCTION
Internet of Things (IoT) is an emerging term that de-
scribes the ubiquitous connection of everyday objects [1]–
[4]. With the dramatically increasing deployment of IoT
devices, tremendous interactions among the physical objects
are enabled, which brings improved efﬁciency, accuracy, and
economic beneﬁts while reducing human interventions [5]. It
is estimated by Gartner that there will be over 20 billion
connected IoT devices all over the world by 2020 [6]. The
great amount of these devices brings lots of challenges in data
storage. How to efﬁciently store the large-scale IoT data, and
how to protect the data are issues of great signiﬁcance.
IoT applications such as smart grid and implantable medical
system, involve tremendous data aggregations. In a traditional
cloud-based IoT structure, a centralized cloud server collects
and controls all the data, which brings two drawbacks: 1) the
cloud server needs very high storage capacity to store the IoT
data; 2) sensitive data can be easily leaked from the server. For
example, server might trade sensitive data with other entities
without notifying the data owner. A decentralized structure
will properly handle these issues: Data can be transferred and
*Corresponding Author.
controlled in a distributed manner as opposed to that in a
centralized structure.
Blockchain offers a convenient platform for distributed data
storage and protection. In blockchain, a group of users, also
known as miners, work cooperately to create blocks as a
public ledger that validate and record transactions. In an IoT
application such as implantable medical system, data can be
stored in Distributed Hash Tables (DHTs) [7] while the pointer
to the DHT storage address can be stored in the blockchain.
When an entity requests data from the DHT, the blockchain
will decide whether the access can be granted or not, i.e., the
authentication of the requester is handled by the distributed
blockchain miners instead of a trusted centralized server,
which achieves the following advantages:

1) Decentralized Storage: The IoT data is stored off-chain
in a distributed way, and an entity can easily ﬁnd the
storage address through the blockchain.
2) No Centralized Trusted Server: The access to IoT data
is controlled by the majority of the blockchain miners,
without any intervention from a trusted server. Users do
not need to worry about unauthorized access to his/her
data.
3) Traceability and Accountability: Activities such as ac-
cessing and modifying the IoT data, can be recorded
by the blockchain. No malicious attempts can be made
undetected.
IoT devices have low computational power, and they are not
capable of conducting complex computations. Edge computing
is one way to help mitigate this problem. Edge computing, as
opposed to cloud computing, is a method to process data at the
network edge, rather than in the remote cloud [8], [9]. Edge
computing brings realtime computations and communications
by leveraging nearby edge servers. A lot of companies such as
Intel, Amazon, and Cisco are developing edge-based services
to facilitate IoT development. An edge device could be any
computing resource residing between data source and cloud.
In our scheme a smartphone or any local computing device can
be used as edge server. We assume that the communications
between an edge server and IoT devices are secure. This
This is the author's version of an article that has been published in this journal. Changes were made to this version by the publisher prior to publication.
The final version of record is available at
 <http://dx.doi.org/10.1109/TSC.2018.2853167>
Copyright (c) 2018 IEEE. Personal use is permitted. For any other purposes, permission must be obtained from the IEEE by emailing <pubs-permissions@ieee.org>.

---

## Page 2

1939-1374 (c) 2018 IEEE. Personal use is permitted, but republication/redistribution requires IEEE permission. See <http://www.ieee.org/publications_standards/publications/rights/index.html> for more information.
This article has been accepted for publication in a future issue of this journal, but has not been fully edited. Content may change prior to final publication. Citation information: DOI 10.1109/TSC.2018.2853167, IEEE
Transactions on Services Computing
is a reasonable assumption as an edge server is placed in
the same local network as the IoT devices, aiming to help
the IoT devices perform certain kinds of computations. For
example, in implantable medical system, an edge server within
physical proximity of a patient can collect health data from
the implanted sensors. In our scheme, an edge server has
two duties: 1) helping the IoT devices perform cryptographic
computations; and 2) collecting data from IoT devices and
forwarding data to the DHT.
Fig. 1 illustrates the proposed structure for IoT data storage
using blockchain. In this structure, a group of IoT sensors
send realtime data to an edge device that manages the data
storage in DHT through the blockchain. Blockchain works as
a “trusted third party” in the following two ways:

1) Before an edge device forwards data to DHT, it posts
a “transaction” to the blockchain, announcing that the
data belonging to certain IoT device will be stored in an
address of DHT. Blockchain veriﬁes the transaction and
records the identity of the IoT device and the storage
address. In this way, blockchain helps manage data
storage.
2) When an IoT device requests data from DHT, it posts a
“transactions” to the blockchain. The blockchain will
work as a “trusted third party” to authenticate the
requester. If the transaction is validated and written into
a block, the DHT node storing the data will send data
to the requester. Therefore, authentication is performed
through the blockchain, without a trusted server.
Blockchain
Edge Device
DHT
IoT Sensors
Fig. 1. The structure of data storage scheme with blockchain
Applying blockchain in large-scale IoT data storage and
protection is challenging. The most signiﬁcant issue is how
to manage the identities of IoT devices so that authentication
can be easily done through blockchain. Note that the miners
take charge of authentication when an entity requests to access
the data. However, the miners should not have any knowledge
of the credentials to perform authentation. This implies that the
system must have some cryptographic mechanism that allows
an IoT device to be identiﬁed and veriﬁed by other parties
without utilizing a secret value such as password. Traditional
Public Key Infrastructure (PKI) with certiﬁcate introduces too
much redundency. Identity Based Encryption (IBE) is one
alternative that enables a user’s public key to be created using
his identity, so that other entities can verify the user’s identity
through the public key. However, IBE suffers from the key
Escrow problem: the Key Generation Center (KGC) is aware
of the user’s private key, and there is no way to authenticate
a user unless we assume the KGC is completely trusted.
This is where Certiﬁcateless Cryptography [10]–[12] steps in.
Certiﬁcateless cryptography is different than IBE as a user’s
public key is generated by both the user’s identity and some
secret of which the KGC is not aware. Therefore, KGC has
no knowledge of the user’s private key, while a public key can
be veriﬁed whether it belongs to certain user or not. The only
drawback of certiﬁcateless cryptography compared to IBE is
that the public key of a user, even though can be veriﬁed,
needs to be pre-broadcasted. The good thing is, blockchain
offers a platform to share public information, which means
that the user’s public key can be shared via the blockchain.
For example, an IoT device can append its public key to his
data access request and sends the request to the blockchain
where the blockchain miners are able to verify the public key
of the device.
Our contributions are listed as follows:
1) We propose a scheme for large-scale IoT data storage
and protection. The scheme eliminates the centralized
server and guarantees data protection by letting a large
group of blockchain miners control the IoT data.
2) We incorporate edge computing in our proposed scheme
in order to perform computations for IoT devices and
forward the data to DHT for storage.
3) We propose to utilize certiﬁcateless cryptography in
the blockchain-based IoT systems. The public ledger of
blockchain system offers a convenient way to broad-
cast any IoT device’s public key, which overcomes
the drawback of a certiﬁcateless cryptography system.
Meantime, certiﬁcateless cryptography highly reduces
redundancy brought by traditional PKI and offers an
efﬁcient way to authenticate an IoT device. To the best
of our knowledge, none of previous research has tackled
this problem.
The paper is organized as follows. Section II introduces
blockchain, edge computing and the the preliminary setting
of the system. Section III discusses how authentication are
done in the proposed system. In Section IV, we extend our
protocol to enable data trading. In Sections V, we study the
security issues in the system. In Section VI, deployment issues
are discussed. In Section VII, the most related works are
summarized. We conclude this paper with a future research
discussion in Section VIII.
This is the author's version of an article that has been published in this journal. Changes were made to this version by the publisher prior to publication.
The final version of record is available at
 <http://dx.doi.org/10.1109/TSC.2018.2853167>
Copyright (c) 2018 IEEE. Personal use is permitted. For any other purposes, permission must be obtained from the IEEE by emailing <pubs-permissions@ieee.org>.

---

## Page 3

1939-1374 (c) 2018 IEEE. Personal use is permitted, but republication/redistribution requires IEEE permission. See <http://www.ieee.org/publications_standards/publications/rights/index.html> for more information.
This article has been accepted for publication in a future issue of this journal, but has not been fully edited. Content may change prior to final publication. Citation information: DOI 10.1109/TSC.2018.2853167, IEEE
Transactions on Services Computing
Fig. 2. Blockchain Network
II. APPLYING BLOCKCHAIN AND EDGE COMPUTING IN
IOT APPLICATIONS
A. Blockchain Description
Blockchain works as a peer-to-peer network without a
trusted third party. Fig.2 illustrates a typical blockchain net-
work. In this network, a user creates a transaction and sends
it to a peer-to-peer (P2P) network. The workers in the P2P
network will utilize one agreed algorithm to determine how
to write transactions into an empty block, and the transactions
will only be validated after they are written into a block. As
time goes on, there will be more and more blocks forming
a blockchain. Blockchain can be viewed as a continuously
growing list of records that can be seen by any user in the
network. However, Blockchain is not merely a data structure,
but more generally considered as the technology that enables
a large group of users agreeing on writing transactions into
the blocks. The key point of blockchain technology is how to
design an algorithm of consensus, and most designs are based
on Byzantine Fault Tolerance (BFT) [13]–[15].
The early version of blockchain, such as Bitcoin, is imple-
mented by a clever mechanism called Proof of Work (PoW). In
such a system, each block Bn contains a list T of transactions,
a random salt, and the hash of the previous block. A new block
can be created only if a random salt is found for a block Bn
such that Hash(Bn−1, T, salt) starts with a certain number
of 0s. Finding a valid salt is a crypto puzzle that needs lots
of computational power, and the computing process is called
Mining. Once a crypto puzzle is solved, a new block Bn is
created and the transactions T can be written into this new
block. The smart idea behind PoW is that the transactions in
the system are performed and audited by a large group of
miners who take great efforts to run this system. Therefore, it
is reasonable to assume that the system is secure as long as the
majority of miners are honest. However, this scheme does not
ﬁt our structure. For example, the most famous cryptocurrency
system using PoW – the Bitcoin, is only able to process seven
transactions per second [16]. Furthermore, PoW consumes
too much computation power without creating true ﬁnancial
welfare, which renders the system too costly for IoT systems.
To tackle the power-consumption issues of the Bitcoin,
other mechanisms have been explored to replace PoW such
as Proof of Stake (PoS) [17], Proof of Space (PoSpace) [18],
and Rem (Intel SGX) [19], etc. We found that Rem is the
most suitable mechanism among them. The idea of “Rem” is
to replace the power-consuming “Proof of Work (PoW)” with
“Proof of Useful Work (PoUW)” where the miners provide
trustworthy reports on CPU cycles devoted to inherently useful
workloads. PoUW is achieved by adopting Intel’s Software
Guard extensions “SGX”, which permits trustworthy code to
be executed in an isolated and tamper-free environment, and
SGX can prove remotely the result of such executions. To
put it simply, this smart idea is to let the miners compute
useful work for Intel, and in return Intel provides workers
with a proof of their work so that the workers can build a
block. Generally speaking, any company can construct similar
structures to the Intel “SGX” to outsource its work to the
miners. Such a mechanism is practical and is suitable for
applications that utilize blockchain.
B. Blockchain Transactions
We are using blockchain as a platform to serve IoT data
storage and protection, rather than utilizing blockchain as a
cryptocurrency. Therefore, “transactions” in our scheme are
different from those in the cryptocurrency schemes such as
Bitcoin and Ethereum. A transaction in our scheme is any
request sent from an IoT device asking for services of data
storage or data access. For example, a medical sensor A
sends a transaction claiming that it stores data in a certain
address Addr in DHT. The transaction can be written in
the following form: T
= (IDA, Timestamp, Action =
store data in Addr). When a doctor’s implantable medical
device (IMD) programmer, which we shall call it B, requests
data from A, it will post a transaction to the blockchain,
requesting sensor A’s data stored in DHT in the following
form: T = (IDB, IDA, Timestamp, Action = access data
in Addr). Note that a DHT node in “Addr” does not send data
to a requester until the DHT node conﬁrms that the transaction
of the request has been veriﬁed and written into the blockchain.
C. Miner Awards
The proposed system is built upon the blockchain run by
a large group of miners. One critical question is how to
incentivize miners to work for IoT applications. We believe
there is sufﬁcient income for mining the blockchain in the
proposed scheme from the following three aspects:

1) The proposed structure eliminates the centralized server,
and the service fee from a traditional server should be
transferred to the miners in the blockchain. This can be
done by depositing transaction fees in the blockchain
transactions. Once a transaction is done, the miners can
get the transaction fee immediately.
2) As we discussed before, a practical blockchain mecha-
nism for IoT applications, such as Rem, utilizes miners
to compute useful work for large companies, such as
Intel. In return, these companies will pay back miners
for their work.
3) Blockchain itself is a cryptocurrency that creates block
awards all the time. Though we are utilizing blockchain
for data storage services, the operations of blockchain
This is the author's version of an article that has been published in this journal. Changes were made to this version by the publisher prior to publication.
The final version of record is available at
 <http://dx.doi.org/10.1109/TSC.2018.2853167>
Copyright (c) 2018 IEEE. Personal use is permitted. For any other purposes, permission must be obtained from the IEEE by emailing <pubs-permissions@ieee.org>.

---

## Page 4

1939-1374 (c) 2018 IEEE. Personal use is permitted, but republication/redistribution requires IEEE permission. See <http://www.ieee.org/publications_standards/publications/rights/index.html> for more information.
This article has been accepted for publication in a future issue of this journal, but has not been fully edited. Content may change prior to final publication. Citation information: DOI 10.1109/TSC.2018.2853167, IEEE
Transactions on Services Computing
will inevitability create block awards that can be split
among the miners as their rewards.
D. Edge Computing
An edge device plays a signiﬁcant role in the proposed
blockchain based IoT storage scheme. It not only relays mes-
sages/transactions for the IoT devices, but also helps manage
data storage and perform computations. We list the roles of
an edge device as follows:

1) Manage the identities of IoT devices. An edge server
stores a copy of identities of all nearby IoT devices and
helps each device build a pair of keys for authentication
through a KGC.
2) Create transactions for IoT devices. A valid transaction
should include the signature of an IoT device, and the
signing process should be conducted by the edge server.
Also, sensitive data should be encrypted before sending
out for storage, and edge server can help handle the
computations.
3) Collect and forward data to DHT. The edge server
continuously collects data from nearby devices. It de-
termines the DHT address to store the data and sends
the encrypted data to the designated address.
E. Security Model
In our proposed scheme, we assume the communications
between an edge device and an IoT device are secure. All
cryptographic computations are processed at the edge device
to reduce the workload of an IoT device. A KGC is utilized
to help establish keys for IoT devices, and this KGC is
semi-honest, which means that KGC follows the rule to
perform computations, but tries to infer sensitive information
collected by the IoT devices. In our design with certiﬁcateless
cryptography, KGC is not able to obtain any user’s private
key. Data storage and protection are performed solely by the
blockchain, without intervention of any other entity. Therefore,
the security of our scheme is based on the security of the
blockchain mechanism.
III. AUTHENTICATION OF BLOCKCHAIN TRANSACTIONS
Establishing the asymmetric key pairs using traditional
PKI [20] or IBE [21]–[23] both have their limitations, as
we discussed before. Efﬁcient authentication for IoT devices
should be enforced. With certiﬁcateless cryptography, an IoT
device can be easily veriﬁed. For example, an IoT device posts
a transaction signed with its private key SKA, and appends
its public key PKA and ID IDA to the transaction. A miner
is able to check that: 1) this transaction is indeed signed with
a private key associated with PKA, and 2) PKA does belong
to IDA. In this way, it can be easily veriﬁed that whether the
transaction was created by an IoT device with IDA.
A simpler mechanism adopted in current cryptocurrency
also achieves the above result, but it does not ﬁt in our applica-
tions. For example, Bitcoin lets each user create a pair of keys
(PKi, SKi) based on Elliptic-Curve Cryptography (ECC),
and a transaction is veriﬁed by a signature scheme based
on Elliptic Curve Digital Signature Algorithm (ECDSA). The
public key PKi is hashed twice as an address of the user
Addr. Therefore, other users are able to check if a public key
PKi belongs to an address by checking if H(H(PKi)) =
Addr [24], [25]. This brings lots of convenience compared to
traditional PKI as it eliminates the burden of traditional digital
certiﬁcates and all users are able to verify a user’s public key.
However, this system does not achieve user authentication or
accountability. Firstly, constantly changing identities will make
authentication hard. In a system with full anonymity, the only
way to check whether an IoT device has rights to access certain
data or not is to verify some credentials only known to this
device. However, blockchain is an open ledger and devices’
credentials will be exposed. Zero-knowledge Proof [26] is a
theoretical solution but hard to deploy. Secondly, a system
with full anonymity is not accountable. Therefore, assigning
IoT devices with unique identities is necessary to maintain a
secure and accountable storage system.
We proposed to utilize certiﬁcateless cryptography to
achieve both authentication and accountability. In certiﬁcate-
less cryptography, each IoT device’s unique identity can be
used to create the public key, and all other users are able to
verify that the public key belongs to this unique identity. Also,
if an IoT device revokes the old key, it is able to create a new
public key pair using its unique identity. The new key pair
is different from the old one, but it is still bounded with the
unique ID.
In the following part, we give a detailed description of
certiﬁcateless cryptography, and how it can be used in our
proposed scheme. To make it simple, we omit the description
of an edge device in our algorithms. However, all the compu-
tations of an IoT device are performed at the edge device.
A. Certiﬁcateless Cryptography
Certiﬁcateless cryptography was derived from the IBE in
order to solve the key escrow problem. In certiﬁcateless
cryptography, a key generation center (KGC) creates a partial
private key based on a user’s identity; the user utilizes the
partial private key and its own secret value to establish a
private key. Since the secret value is only known to the user,
KGC is not able compute the private key. Therefore, key
escrow problem in IBE is avoided. The user also creates the
public key based on the secret value and makes it public. In
detail, there are ﬁve general steps for establishing keys PKA
and SKA for a user A.
1) Setup(1λ) →(K, MSK): The setup algorithm takes
security parameter λ and returns the system parameters
K and a secret master key MSK. This algorithm is run
by KGC and only KGC knows the value of MSK.
2) PSkeyGen(K, IDA, MSK) →(PSKA): The partial
private key generation algorithm takes the system pa-
rameters K, a user A’s identity IDA ∈{0, 1}∗, and
the master key MSK, and outputs a partial private key
PSKA. This algorithm is run by KGC and the output
will be transported to entity A.
This is the author's version of an article that has been published in this journal. Changes were made to this version by the publisher prior to publication.
The final version of record is available at
 <http://dx.doi.org/10.1109/TSC.2018.2853167>
Copyright (c) 2018 IEEE. Personal use is permitted. For any other purposes, permission must be obtained from the IEEE by emailing <pubs-permissions@ieee.org>.

---

## Page 5

1939-1374 (c) 2018 IEEE. Personal use is permitted, but republication/redistribution requires IEEE permission. See <http://www.ieee.org/publications_standards/publications/rights/index.html> for more information.
This article has been accepted for publication in a future issue of this journal, but has not been fully edited. Content may change prior to final publication. Citation information: DOI 10.1109/TSC.2018.2853167, IEEE
Transactions on Services Computing
3) SValGen (K, IDA) →(XA): The secret value genera-
tion algorithm takes the system parameters K and user
A’s identity IDA, and outputs secret value XA. This
algorithm is run by the user and XA will be used to
transform the partial private key to a private key. This
algorithm is run by the user.
4) SKeyGen (K, PSKA, XA)
→
(SKA). The private
key generation algorithm takes as input the system
parameters K, the partial private key PSKA and the
secret value XA, and returns the private key SKA. This
algorithm is run the the user and only this user knows
his private key.
5) PKeyGen (K, XA) →PKA: The public key generation
algorithm takes the system parameter K and the secret
value XA to construct the public key PKA. This algo-
rithm is run by the user and PKA will be broadcast to
the public.
The above steps illustrate how to generate the public key
pairs using certiﬁcateless cryptography. The function of en-
crypt, decrypt, sign and verify are described as follows.

1) Encrypt (K, M ∈M, IDA, PKA) →C ∈C ∨⊥
This algorithm takes the system parameters K, a mes-
sage M in ﬁnite message space, user’s identity and
public key, and outputs a ciphertext C in ciphertext
space.
2) Decrypt (C ∈C, SKA), →M ∈M ∨⊥
This algorithm takes a ciphertext C and user’s private
key SKA, and outputs a message M.
3) Sign (K, M ∈M, SKA) →Sig
This algorithm takes system parameters K, a message
M and user’s private key SKA, and outputs a signature.
4) Ver (M ∈M, Sig, IDA, PKA) →V alid∨Invalid∨⊥
This algorithm takes a message M, a signature Sig,
user’s ID IDA and user’s private key SKA, and outputs
if the signature is valid or not.
There are many ways to achieve certiﬁcateless cryptography,
with both lightweight encrypting and signing features achieved
The readers can refer to Al-Riyami’s scheme as an example
for details [10], and we do not give complete constructions
of the cryptography scheme here to save space. We also give
a deﬁnition of the veriﬁcation function that is used to check
whether PKA belongs to IDA or not:
VerID(IDA, PKA, K) →V alid ∨Invalid ∨⊥
To make the description of our algorithms clear, we gen-
erally denote the encryption to ciphertext C of data M with
public key PK by C = EP K(M), and decryption of cipher-
text C with private key SK by M = DSK(C). Similarly,
we denote the signing of a message M by SignSK(M), and
veriﬁcation of a signature Sig by V erP K(Sig).
B. How Blockchain Transactions Work in IoT Applications
In this section, we give details how transactions are pro-
cessed in the proposed scheme. To start, an IoT device needs
to register in the blockchain network by contacting KGC for
establishing its keys. After successfully obtaining a pair of
keys, an IoT device is able to post transactions that can be
veriﬁed by the blockchain.
1) Registration: To start, KGC broadcasts the system pa-
rameters K and keeps a secret master key MSK. All IoT
devices should have the knowledge of K. Meantime, an IoT
device creates a secret value XA, and generates its public key
using XA and the system parameter K.
When an IoT device would like to register in a blockchain,
it will contact the KGC with its ID IDA. Upon receiving the
request, KGC will generate a partial private key PSKA for
this IoT device, sign IDA and PSKA with his private key
SKK, and sends the signed message back to the IoT device.
The IoT device will verify if the message comes from the
KGC, and if yes, it will generate private key using PSKA,
XA and K. Note that only this IoT device is able to create
the private key because it is the only entity that knows XA.
Algorithm 1 illustrates an IoT devices’ operations in the
registration process. SendRequest() and RecvReq() denote
the functions of sending and receiving messages, respectively.
Algorithm 1 Device Registration
Input: IDA
Output: PKA, SKA
1: procedure KEYGEN(1λ, IDA)
2:
XA ←SV alGen(K, IDA)
3:
SendRequest (IDA)
4:
RecvReq(PSKA, SignSKK(IDA))
5:
V ←V er(IDA, SignSKK(IDA), SKK)
6:
if V = V alid then:
7:
SKA ←SKeyGen(K, PSKA, XA)
8:
PKA ←PKeyGen(K, XA)
9:
end if
return
10: end procedure
2) Transactions Description and Veriﬁcation: After suc-
cessfully registered at the blockchain, an IoT device is
able to take advantage of the blockchain to store data.
Generally, a transaction includes the identity of an IoT
device, a timestamp and an action, for example, TA
=
(IDA, Timestamp, Action). An action can be a claim to
store data at a DHT address, a request to access data, or
a request to update data. To save space, we use Addr to
represent actions on the DHT address. To verify a transaction
TA, the miners have to check the following requirements:
1) If the the public key PKA is derived from the identity
IDA associated with it.
2) If the signed transaction can be veriﬁed with the public
key PKA.
By checking the two requirements above, the miners are
able to verify whether a transaction TA is created from IDA
or not. Algorithm 2 illustrates how to verify a transaction
with a procedure VerTrans(). When a transaction is posted,
it is automatically marked with a ﬂag s = 0. The ﬂag of
successfully veriﬁed transactions will be set to “1”, and then
the veriﬁed transactions will be written into a block.
This is the author's version of an article that has been published in this journal. Changes were made to this version by the publisher prior to publication.
The final version of record is available at
 <http://dx.doi.org/10.1109/TSC.2018.2853167>
Copyright (c) 2018 IEEE. Personal use is permitted. For any other purposes, permission must be obtained from the IEEE by emailing <pubs-permissions@ieee.org>.

---

## Page 6

1939-1374 (c) 2018 IEEE. Personal use is permitted, but republication/redistribution requires IEEE permission. See <http://www.ieee.org/publications_standards/publications/rights/index.html> for more information.
This article has been accepted for publication in a future issue of this journal, but has not been fully edited. Content may change prior to final publication. Citation information: DOI 10.1109/TSC.2018.2853167, IEEE
Transactions on Services Computing
Algorithm 2 Verify A Transaction
Input: TA, σTA
Output: a veriﬁed TA
1: procedure VERTRANS( TA, σTA)
2:
s ←0
3:
V1 ←V erID(IDA, PKA, K)
4:
if V1 = V alid then
5:
V2 ←V er(TA, σTA, IDA, PKA)
6:
elseAbort
7:
if V2 = V alid then
8:
s ←1
9:
elseAbort
10:
end if
11:
end if
return
12: end procedure
3) IoT Data Storage and Protection: We take implantable
medical applications as an example. The proposed scheme
works for various IoT applications such as smart grid, smart
home etc. For example, in smart grid, smart meters send data
via edge devices to blockchain storage and server/aggregator
can access data on billing date. In smart home, personal data
generated by IoT devices can be sent to the blockchain storage
and the data owner/authorized user is able to access data.
Firstly, a medical device creates an access control list
through the edge server, which speciﬁes clearly who can
access his data. Then it creates a transaction TA
=

(PKA, IDA, ACL, Addr) with its public key, identity, access
control list and storage address, creates a validation σA ap-
pended to the transaction, and publishes TA to the blockchain
system. The process is illustrate in Algorithm 3.
Algorithm 3 Store Data
Input: IDA, ACL
Output: a veriﬁed TA
1: procedure SETACL(ACL)
2:
Create TA = (PKA, IDA, ACL, Addr)
3:
Broadcast (TA, σA)
return
4: end procedure
5: procedure VERTRANS(TA, σA)
▷run by the miners
6:
s ←0
7:
V1 ←V erID(IDA, PKA, K)
8:
if V1 = V alid then
9:
V2 ←V er(TA, σA, IDA, PKA)
10:
elseAbort
11:
if V2 = V alid then
12:
s ←1
13:
elseAbort
14:
end if
15:
end if
return
16: end procedure
The miners in the blockchain system, once received the
transaction TA, will have to verify the validation of the
transaction by checking if the signature is valid, and if the
message is signed with the transaction creator’s public key. If
the veriﬁcation passes, the ﬂag on TA will be set to “1,” and
TA will be written into new block. If a doctor’s device with
IDB would like to access the data, it can create a transaction
TB = (IDB, IDA||Addr), signs TB with its private key
SKB and appends the signature to TB. The miners in the
system will verify ﬁrstly if TB is validated, and secondly if
the identity of IDB belongs to the access control list. Both
the two veriﬁcation need to be passed in order to validate this
transaction. The process is illustrated in Algorithm 4.
Algorithm 4 Access Data
Input: IDA||Addr, IDB
Output: a veriﬁed TB
1: procedure REQUESTDATA(IDB, IDA||Addr)
2:
Create TB = (IDB, IDA||Addr)
3:
σTB ←Sign(K, TB, SkB)
4:
Broadcast (TB, σTB)
return
5: end procedure
6: procedure VERTRANS(TB, σTB)
▷run by the miners
7:
s ←0
8:
V1 ←V erID(IDB, PKB, K)
9:
if V1 = V alid then
10:
V2 ←V er(TB, σTB, IDB, PKB)
11:
elseAbort
12:
if V2 = V alid then
13:
if IDB ∈ACL then
14:
s ←1
15:
elseAbort
16:
end if
17:
end if
18:
end if
return
19: end procedure
In the proposed scheme, only transactions passing access
control can be written into a block. A DHT node that stores
data will check if the transaction requesting data exists in
the blockchain before it can send data to the requester. If
an unauthorized IoT device tries to access sensitive data of
a patient, it will be blocked by the blockchain as it can
not pass the veriﬁcation. Note that the access control list is
determined by the data owner himself and nobody is able to
modify it. Therefore, no entity is able to access data without
the data owner’s permission. Furthermore, the security of such
a scheme is based on the majority of miners, which guarantees
the protection of sensitive medical data.
IV. EXTENSION TO DATA TRADING
With the proposed scheme, any user can easily trade his
data through the blockchain. Data trading can be done in a
transparent and accountable way. For example, a user would
This is the author's version of an article that has been published in this journal. Changes were made to this version by the publisher prior to publication.
The final version of record is available at
 <http://dx.doi.org/10.1109/TSC.2018.2853167>
Copyright (c) 2018 IEEE. Personal use is permitted. For any other purposes, permission must be obtained from the IEEE by emailing <pubs-permissions@ieee.org>.

---

## Page 7

1939-1374 (c) 2018 IEEE. Personal use is permitted, but republication/redistribution requires IEEE permission. See <http://www.ieee.org/publications_standards/publications/rights/index.html> for more information.
This article has been accepted for publication in a future issue of this journal, but has not been fully edited. Content may change prior to final publication. Citation information: DOI 10.1109/TSC.2018.2853167, IEEE
Transactions on Services Computing
like to sell his IoT data collected by electrocardiogram (ECG)
sensors for years to some research institutes. This user can
post a transaction through the network edge to the blockchain
claiming to sell his data. An interested party can post a
transaction, in which it commits a deposit to request the data.
If the data owner thinks the deposit is enough, he can post
a transaction with an updated access control that includes
the requester. The blockchain will verify if the requester can
access the data, and if yes, the deposit will be sent to the data
owner.
Fig 3 illustrates how data trading is processed. Firstly, data
buyer posts a transaction DepositA with a valid signature
SigskA(DepositA) appended to it. The transaction includes
an input of the buyer’s identity IDA, the public key of
IDA, and the seller’s identity IDB. The buyer will make
a commitment of d dollars, which is locked until certain
situations are satisﬁed: 1) the data seller publishes a transaction
TB that writes the buyer’s identity into the access control list
of requested data, then the d dollars will be sent to the seller;
or 2) after t time, the seller does not sell the data, then the
buyer can get his deposit back.
If the seller would like to sell his data to the buyer, he can
post a transaction TB through the edge device to update his
access control list by including the buyer’s identity inside the
access control list for a period of t time. Then the seller is
able to post a transaction GetpaidB that unlocks the d dollars
in DepositA. Note that only the buyer is able to unlock the
d because the blockchain will strictly check the following
two requirements: 1) if TB speciﬁes that IDA ∈ACLB
for t time; and 2) if GetpaidB is indeed created by the
device IDB. If the seller does not sell his data within t time,
buyer is able to redeem his money by posting a transaction
GetDepoositA. The blockchain will verify 1) if it is the buyer
himself redeeming the money; and 2) if t time has passed
since the post of DepositA. If the veriﬁcation succeeds, then
GetDepoositA will be validated and written into blocks, such
that the buyer can get his deposit back.
In the above example, data trading is achieved in an effective
and efﬁcient way. The trading process is controlled and audited
by the blockchain, which makes trading transparent and ac-
countable. Furthermore, through this mechanism, a seller can
quickly obtain trading fee from the buyer by redeeming the
deposit transaction, without waiting for a period of time.
V. SECURITY
A. Protocol Security
Theorem 1: Algorithms 1 to 4 form a secure protocol in
authentication under the assumption that the adopted certiﬁ-
cateless cryptography algorithm is secure.
Proof
The security of authentication in the proposed scheme
is based on the certiﬁcateless cryptography. There exists lots
of schemes that are IND-CCA secure. In such a scheme,
an adversary has a negligible ”advantage” to distinguish two
distinct plaintext from a ciphertext with probability 1/2+ϵ(k),
where k is a negligible function in the security parameter k.
That is to say, an adversary is not able to guess the private
key of a user even from large number of ciphertext in the IoT
system. Therefore, it is impossible for an adversary to forge
a digital signature σ(T) for any transactions T published in
the system. Furthermore, to forge a public key PKA of a user
IDA is also not possible, as the fake key cannot pass the
veriﬁcation function V erID.
B. Privacy
To protect sensitive IoT data, necessary encryption needs
to be carried. Data sent out from an edge device to the
ﬁnal storage can be sent in an encrypted form such that
eavesdroppers in the network cannot get sensitive data. The
data can be encrypted under the IoT device’s public key or
under a speciﬁed entity’s public key. When sharing data to
another entity, the data owner could choose to encrypt the
data under the entity’s public key, or he could choose to use
re-encryption [27]. Re-encryption is a useful cryptography
primitive that enables data encrypted under one public key
to be transformed to data under another public key, without
decrypting the message. Data sharing will become easy with
the incorporation of re-encryption.
If the IoT data is encrypted when stored, data trading can
become more complicated than the example we gave, as the
buyer has to make sure that the requested data has been
transformed to ciphertext under his own key before making
payments. Therefore, re-encryption has to be performed by
the DHT node that holds that data, instead of the data owner
himself. Particularly, one more step should be added: when the
data owner posts a transaction to sell the data, the DHT node
re-encrypts the data and posts a transaction to the blockchain
claiming that the data is now encrypted under the buyer
device’s public key. Only after this step, data owner is able to
get payment from the buyer’s deposit.
C. Traceability and Accountability
The proposed scheme brings traceability and accountability.
Any IoT device accessing data in a certain DHT address will
be recorded and there is no way to deny this operation. Data
owner will know which entity accessed his data, and he is
able to make sure none unauthorized entity has accessed his
data. Also, malicious attempts to access data will be recorded
and detected, which could largely mitigate Denial of Service
attacks. When a malicious device constantly challenges the
system to access the data, this device can be easily detected
and recorded, and will be blocked permanently.
D. Blockchain Security
It is clear that the security of the proposed scheme is based
on the security of blockchain and certiﬁcateless cryptography.
The security of blockchain lies on the hardness of preventing
sibyl attacks. In a blockchain, if an adversary is powerful
enough to take over the majority of the nodes, then it can
perform arbitrary malicious operations on the transactions.
Therefore, whether a blockchain system is secure enough
depends on if we can incentivize sufﬁcient large number of
This is the author's version of an article that has been published in this journal. Changes were made to this version by the publisher prior to publication.
The final version of record is available at
 <http://dx.doi.org/10.1109/TSC.2018.2853167>
Copyright (c) 2018 IEEE. Personal use is permitted. For any other purposes, permission must be obtained from the IEEE by emailing <pubs-permissions@ieee.org>.

---

## Page 8

1939-1374 (c) 2018 IEEE. Personal use is permitted, but republication/redistribution requires IEEE permission. See <http://www.ieee.org/publications_standards/publications/rights/index.html> for more information.
This article has been accepted for publication in a future issue of this journal, but has not been fully edited. Content may change prior to final publication. Citation information: DOI 10.1109/TSC.2018.2853167, IEEE
Transactions on Services Computing
d dollars
d dollars
d dollars
d dollars
d dollars
Buyer makes
a deposit:
Seller gets paid:
Buyer gets
deposit back:
Fig. 3. Data trading with the blockchain
miners in the blockchain. As discussed before, our system
brings mining award from transaction fees of data storage and
protection, apart from block award in a traditional blockchain
cryptocurrency system. Therefore, miners will be attracted in
building such a storage system for IoT applications. Further-
more, a single blockchain can work for various IoT applica-
tions. The more IoT applications adopt blockchain, the more
transaction fee there will be, and the more miners will be
attracted to the blockchain. Therefore, the blockchain platform
serving IoT data storage and protection will be secure.
VI. DISCUSSIONS
The deployment of the proposed system relies heavily on
the design of blockchain system. Without highly scalable
blockchain system, it is hard to deploy the IoT storage system.
This is the trade-off brought by eliminating the centralized
server. Scalability is a major problem in blockchain’s design.
There are a lot of ongoing research working on it [14], [15],
[28]–[30], and two most studied mechanisms to solve the
scalability problem are Sharding [31], [32] and sidechains
[33]. To ﬁnd the most scalable system that exists currently, we
have to evaluate the blockchain systems that have already been
deployed in very large networks. Some very new blockchain
technologies such as Ripple [34] could process thousands of
transactions per second, but the design is partially decentral-
ized. Decentralized designs such as Ethereum [35] could take
only thirteen transactions per second. However, there exists
new-emerging blockchain design built based on Ethereum
that have much better scalability. For example, Tomochain
is supposed to process up to one thousand transactions per
second [36]. Supposing a blockchain mechanism is adopted
that could process around 1000 transactions per second, then
10, 000 transactions could be processed in roughly 10 seconds
in the IoT storage system. One good thing is that, with the
development of blockchain technology, it can be foreseen that
more and more blockchain designs suitable for the proposed
IoT storage system will come out.
VII. RELATED WORK
The rapid growth of Internet of Things promotes the sharp
growth of data, and brings lots of challenges in big data
storage, analytic and management [37]. For data storage, most
researchers focus on building databased management models
to mitigate the massive IoT data storage problem. NoSQL [38],
[39] and Hadoop [40] databases are attracting most of the
attention. Besides, the authors in [41] proposed a new IoT data
storage platform based on combined multiple database models.
Our work is distinct from these researches as we focus on
constructing a novel distributed data storage system based on
blockchain technology. To process the massive IoT data, edge
computing has become a popular enabled technology [42].
Edge computing and IoT have been extensively studied [8],
[43], [44]. The visions and challenges in edge computing are
comprehensively studied in [45], and the security and privacy
issues in edge computing are extensively discussed in [46].
Blockchain, as a decentralized cryptocurrency mechanism,
has received lots of attention. Most research are focused on
the blockchain mechanism themselves, aiming to solve the
scalability problem [14], [15], [29] or reducing the power
consumption of a PoW [17], [19]. There are some research
utilizing blockchain on practical applications. In 2014, for the
ﬁrst time, Bitcoin is proposed to form a lottery protocol as as
a multiparty computation method [47]. The authors demon-
strated that Bitcoin provides an attractive way to construct
a “timed commitments” and a multiparty protocol can be
constructed by letting the miners emulating a trusted server.
Bitcoin was also proposed as an incentive mechanism for
distributed P2P application [48], in which the relay of the
network helps to transfer messages and gets reward from
the Bitcoin system. In 2016, Christidis et al. discussed how
blockchain could possibly work in the IoT domain. They
This is the author's version of an article that has been published in this journal. Changes were made to this version by the publisher prior to publication.
The final version of record is available at
 <http://dx.doi.org/10.1109/TSC.2018.2853167>
Copyright (c) 2018 IEEE. Personal use is permitted. For any other purposes, permission must be obtained from the IEEE by emailing <pubs-permissions@ieee.org>.

---

## Page 9

1939-1374 (c) 2018 IEEE. Personal use is permitted, but republication/redistribution requires IEEE permission. See <http://www.ieee.org/publications_standards/publications/rights/index.html> for more information.
This article has been accepted for publication in a future issue of this journal, but has not been fully edited. Content may change prior to final publication. Citation information: DOI 10.1109/TSC.2018.2853167, IEEE
Transactions on Services Computing
illustrated several IoT applications that blockchain might ﬁt
in, but did not give detailed solutions [49]. The most related
work is [50], in which Zyskind et al. proposed a decentral-
ized personal data management system using blockchain and
illustrated how blockchains could become a vital resource in
trusted computing [50]. This work assumed the existence of a
secure channel through which the data requester shared secret
keys with the data owner. The authentication was processed
through the blockchain, and only the users holding the secret
keys are able to access data. The work has its limitations as

1) the assumption of such a secure channel is not practical; 2)
the secret keys will be leaked to the blockchain miners who
perform the authentication. In our research, we take advantage
of certiﬁcateless cryptography to achieve effective and efﬁcient
authentications without a secure channel.
Certiﬁcateless cryptography was proposed in 2003 [10] to
overcome the key escrow problem in identity based encryption.
Compared to traditional PKI, certiﬁcateless cryptography does
not require certiﬁcates to guarantee the authenticity of public
keys. Followed by this pioneer research, Seo et al. proposed
a more efﬁcient way to construct certiﬁcateless cryptography
withouting using paring [51]. The most Efﬁcient Certiﬁcateless
signature scheme to date was proposed that involve only
simple hash operations for signing [52]. Also, certiﬁcateless
signcryption algorithm was proposed in order to reduce the
computation cost and encryption and signing, such that it can
be easily carried by the lightweight IoT devices [53]. The
above proposed protocols suffer from one problem: it is hard
to broadcast the public key of a user. Our proposed scheme
with blockchain overcomes this problem as blockchain is a
perfect media for spreading public keys to all users in one
network.
VIII. CONCLUSION
In this paper, we propose a secure scheme for IoT data
storage and protection based on blockchain. Edge computing
is incorporated to help manage data storage and small IoT
devices perform computations. Certiﬁcateless cryptography is
adopted to set up a convenient authentication system for the
blockchain-based IoT applications, and blockchain overcomes
the drawback of certiﬁcatess cryptography by offering a plat-
form for broadcasting the public key of a user. We give detailed
algorithms on how to process transactions in such a system and
how to achieve authentication and accountability. To the best
of our knowledge, this is the ﬁrst paper tackling the problem
of building a secure and accountable storage system for large-
scale IoT data, and the ﬁrst to combine edge computing,
certiﬁcateless cryptography, and blockchain as a whole to
serve IoT applications.
Our future work lies on improving our authentication
scheme for blockchain based system. In our current scheme,
authentication is done by verifying the identity of the data re-
quester. For a system with complicated access control policies,
more comprehensive designs need to be explored.
ACKNOWLEDGMENT
This work was partially supported by the US National Sci-
ence Foundation under grants CNS-1704397 and IIS-1741279,
the National Natural Science Foundation of China under
grant 61771289 and 61702503, and IIE CAS International
Cooperation Project under Y7Z0461104.
REFERENCES
[1] F. Xia, L. T. Yang, L. Wang, and A. Vinel, “Internet of things,”
International Journal of Communication Systems, vol. 25, no. 9, p. 1101,

2012.

[2] L. Atzori, A. Iera, and G. Morabito, “The internet of things: A survey,”
Computer networks, vol. 54, no. 15, pp. 2787–2805, 2010.
[3] R. Li, T. Song, N. Capurso, J. Yu, J. Couture, and X. Cheng, “Iot
applications on secure smart shopping system,” IEEE Internet of Things
Journal, vol. 4, no. 6, pp. 1945–1954, 2017.
[4] T. Song, R. Li, B. Mei, J. Yu, X. Xing, and X. Cheng, “A privacy
preserving communication protocol for iot applications in smart homes,”
IEEE Internet of Things Journal, 2017.
[5] O. Vermesan and P. Friess, Internet of things: converging technologies
for smart environments and integrated ecosystems.
River Publishers,
2013.
[6] (2017)
Iot
devices
will
outnumber
the
world’s
population.
[Online].
Available:
<https://www.zdnet.com/article/iot-devices-will->
outnumber-the-worlds-population-this-year-for-the-ﬁrst-time/
[7] M. F. Kaashoek and D. R. Karger, “Koorde: A simple degree-optimal
distributed hash table,” in International Workshop on Peer-to-Peer Sys-
tems.
Springer, 2003, pp. 98–107.
[8] F. Bonomi, R. Milito, J. Zhu, and S. Addepalli, “Fog computing and its
role in the internet of things,” in Proceedings of the ﬁrst edition of the
MCC workshop on Mobile cloud computing.
ACM, 2012, pp. 13–16.
[9] I. Stojmenovic and S. Wen, “The fog computing paradigm: Scenarios
and security issues,” in Computer Science and Information Systems
(FedCSIS), 2014 Federated Conference on.
IEEE, 2014, pp. 1–8.
[10] S. S. Al-Riyami and K. G. Paterson, “Certiﬁcateless public key cryp-
tography,” in Asiacrypt, vol. 2894.
Springer, 2003, pp. 452–473.
[11] X. Huang, W. Susilo, Y. Mu, and F. Zhang, “On the security of
certiﬁcateless signature schemes from asiacrypt 2003,” in CANS, vol.
2005, no. 3810.
Springer, 2005, pp. 13–25.
[12] S. S. Chow, C. Boyd, and J. M. G. Nieto, “Security-mediated certiﬁcate-
less cryptography,” in Public key cryptography, vol. 3958.
Springer,
2006, pp. 508–524.
[13] E. Buchman, “Tendermint: Byzantine fault tolerance in the age of
blockchains,” Ph.D. dissertation, University of Guelph, 2016.
[14] M. Vukoli´c, “The quest for scalable blockchain fabric: Proof-of-work
vs. bft replication,” in International Workshop on Open Problems in
Network Security.
Springer, 2015, pp. 112–125.
[15] I. Eyal, A. E. Gencer, E. G. Sirer, and R. Van Renesse, “Bitcoin-ng: A
scalable blockchain protocol.” in NSDI, 2016, pp. 45–59.
[16] (2017)
Botcoin
wiki
scalability.
[Online].
Available:
<https://en.bitcoin.it/wiki/Scalability>
[17] A. Kiayias, A. Russell, B. David, and R. Oliynykov, “Ouroboros: A
provably secure proof-of-stake blockchain protocol,” in Annual Interna-
tional Cryptology Conference.
Springer, 2017, pp. 357–388.
[18] S. Dziembowski, S. Faust, V. Kolmogorov, and K. Pietrzak, “Proofs of
space,” in Annual Cryptology Conference. Springer, 2015, pp. 585–605.
[19] F. Zhang, I. Eyal, R. Escriva, A. Juels, and R. van Renesse, “Rem:
Resource-efﬁcient mining for blockchains.” IACR Cryptology ePrint
Archive, vol. 2017, p. 179, 2017.
[20] D. R. Kuhn, V. C. Hu, W. T. Polk, and S.-J. Chang, “Introduction to
public key technology and the federal pki infrastructure,” National Inst
of Standards and Technology Gaithersburg MD, Tech. Rep., 2001.
[21] S. Chatterjee and P. Sarkar, Identity-based encryption. Springer Science
& Business Media, 2011.
[22] D. Boneh and M. Franklin, “Identity-based encryption from the weil
pairing,” in Annual international cryptology conference. Springer, 2001,
pp. 213–229.
[23] A. Sahai and B. Waters, “Fuzzy identity-based encryption,” in Advances
in Cryptology–EUROCRYPT 2005.
Springer, 2005, pp. 457–473.
This is the author's version of an article that has been published in this journal. Changes were made to this version by the publisher prior to publication.
The final version of record is available at
 <http://dx.doi.org/10.1109/TSC.2018.2853167>
Copyright (c) 2018 IEEE. Personal use is permitted. For any other purposes, permission must be obtained from the IEEE by emailing <pubs-permissions@ieee.org>.

---

## Page 10

1939-1374 (c) 2018 IEEE. Personal use is permitted, but republication/redistribution requires IEEE permission. See <http://www.ieee.org/publications_standards/publications/rights/index.html> for more information.
This article has been accepted for publication in a future issue of this journal, but has not been fully edited. Content may change prior to final publication. Citation information: DOI 10.1109/TSC.2018.2853167, IEEE
Transactions on Services Computing
[24] S. Goldfeder, R. Gennaro, H. Kalodner, J. Bonneau, J. A. Kroll, E. W.
Felten, and A. Narayanan, “Securing bitcoin wallets via a new dsa/ecdsa
threshold signature scheme,” 2015.
[25] R. Gennaro, S. Goldfeder, and A. Narayanan, “Threshold-optimal
dsa/ecdsa signatures and an application to bitcoin wallet security,”
in International Conference on Applied Cryptography and Network
Security.
Springer, 2016, pp. 156–174.
[26] C. Rackoff and D. R. Simon, “Non-interactive zero-knowledge proof
of knowledge and chosen ciphertext attack,” in Annual International
Cryptology Conference.
Springer, 1991, pp. 433–444.
[27] S. Yu, C. Wang, K. Ren, and W. Lou, “Achieving secure, scalable, and
ﬁne-grained data access control in cloud computing,” in Infocom, 2010
proceedings IEEE.
Ieee, 2010, pp. 1–9.
[28] J. Herrera-Joancomart´ı and C. P´erez-Sol`a, “Privacy in bitcoin transac-
tions: new challenges from blockchain scalability solutions,” in Model-
ing Decisions for Artiﬁcial Intelligence.
Springer, 2016, pp. 26–44.
[29] K. Croman, C. Decker, I. Eyal, A. E. Gencer, A. Juels, A. Kosba,
A. Miller, P. Saxena, E. Shi, E. G. Sirer et al., “On scaling decentralized
blockchains,” in International Conference on Financial Cryptography
and Data Security.
Springer, 2016, pp. 106–125.
[30] G. Karame, “On the security and scalability of bitcoin’s blockchain,” in
Proceedings of the 2016 ACM SIGSAC Conference on Computer and
Communications Security.
ACM, 2016, pp. 1861–1862.
[31] L. Luu, V. Narayanan, C. Zheng, K. Baweja, S. Gilbert, and P. Saxena,
“A secure sharding protocol for open blockchains,” in Proceedings of
the 2016 ACM SIGSAC Conference on Computer and Communications
Security.
ACM, 2016, pp. 17–30.
[32] A. E. Gencer, R. van Renesse, and E. G. Sirer, “Short paper: Service-
oriented sharding for blockchains,” in International Conference on
Financial Cryptography and Data Security.
Springer, 2017, pp. 393–
401.
[33] A. Back, M. Corallo, L. Dashjr, M. Friedenbach, G. Maxwell,
A.
Miller,
A.
Poelstra,
J.
Tim´on,
and
P.
Wuille,
“Enabling
blockchain innovations with pegged sidechains,” URL: <http://www>.
opensciencereview.
com/papers/123/enablingblockchain-innovations-
with-pegged-sidechains, 2014.
[34] L. Lee, “New kids on the blockchain: How bitcoin’s technology could
reinvent the stock market,” Hastings Bus. LJ, vol. 12, p. 81, 2015.
[35] G. Wood, “Ethereum: A secure decentralised generalised transaction
ledger,” Ethereum project yellow paper, vol. 151, pp. 1–32, 2014.
[36] (2018) Tomochain. [Online]. Available: <https://tomochain.com/>
[37] M. Chen, S. Mao, and Y. Liu, “Big data: A survey,” Mobile networks
and applications, vol. 19, no. 2, pp. 171–209, 2014.
[38] T. Li, Y. Liu, Y. Tian, S. Shen, and W. Mao, “A storage solution for
massive iot data based on nosql,” in Green Computing and Communi-
cations (GreenCom), 2012 IEEE International Conference on.
IEEE,
2012, pp. 50–57.
[39] J. Guo, L. Da Xu, G. Xiao, and Z. Gong, “Improving multilingual se-
mantic interoperation in cross-organizational enterprise systems through
concept disambiguation,” IEEE Transactions on Industrial Informatics,
vol. 8, no. 3, pp. 647–658, 2012.
[40] K. Shvachko, H. Kuang, S. Radia, and R. Chansler, “The hadoop
distributed ﬁle system,” in Mass storage systems and technologies
(MSST), 2010 IEEE 26th symposium on.
Ieee, 2010, pp. 1–10.
[41] L. Jiang, L. Da Xu, H. Cai, Z. Jiang, F. Bu, and B. Xu, “An iot-
oriented data storage framework in cloud computing platform,” IEEE
Transactions on Industrial Informatics, vol. 10, no. 2, pp. 1443–1451,
2014.
[42] W. Shi and S. Dustdar, “The promise of edge computing,” Computer,
vol. 49, no. 5, pp. 78–81, 2016.
[43] M. Satyanarayanan, “The emergence of edge computing,” Computer,
vol. 50, no. 1, pp. 30–39, 2017.
[44] P. Corcoran and S. K. Datta, “Mobile-edge computing and the internet
of things for consumers: Extending cloud computing and services to the
edge of the network,” IEEE Consumer Electronics Magazine, vol. 5,
no. 4, pp. 73–74, 2016.
[45] W. Shi, J. Cao, Q. Zhang, Y. Li, and L. Xu, “Edge computing: Vision
and challenges,” IEEE Internet of Things Journal, vol. 3, no. 5, pp.
637–646, 2016.
[46] R. Roman, J. Lopez, and M. Mambo, “Mobile edge computing, fog et
al.: A survey and analysis of security threats and challenges,” Future
Generation Computer Systems, vol. 78, pp. 680–698, 2018.
[47] M. Andrychowicz, S. Dziembowski, D. Malinowski, and L. Mazurek,
“Secure multiparty computations on bitcoin,” in 2014 IEEE Symposium
on Security and Privacy (SP).
IEEE, 2014, pp. 443–458.
[48] Y. He, H. Li, X. Cheng, Y. Liu, and L. Sun, “A bitcoin based incentive
mechanism for distributed p2p applications,” in International Conference
on Wireless Algorithms, Systems, and Applications. Springer, 2017, pp.
457–468.
[49] K. Christidis and M. Devetsikiotis, “Blockchains and smart contracts for
the internet of things,” IEEE Access, vol. 4, pp. 2292–2303, 2016.
[50] G. Zyskind, O. Nathan et al., “Decentralizing privacy: Using blockchain
to protect personal data,” in Security and Privacy Workshops (SPW),
2015 IEEE.
IEEE, 2015, pp. 180–184.
[51] S.-H. Seo, M. Nabeel, X. Ding, and E. Bertino, “An efﬁcient certiﬁcate-
less cryptography scheme without pairing,” in Proceedings of the third
ACM conference on Data and application security and privacy.
ACM,
2013, pp. 181–184.
[52] L. Zhang, J. Liu, H. Wu, and R. Sun, “An efﬁcient and robust certiﬁ-
cateless short signature scheme,” in Information and Network Security
(ICINS 2013).
IET, 2013.
[53] F. Li, Y. Han, and C. Jin, “Certiﬁcateless online/ofﬂine signcryption for
the internet of things,” Wireless Networks, vol. 23, no. 1, pp. 145–158,
2017.
Ruinian Li received her Ph.D. degree in computer
science from the George Washington University in
2018. He is currently an assistant professor in the
department of computer science in the Bowling
Green State University. His research interests in-
clude Internet of Things (IoT), network security,
applied cryptography, privacy-aware computing, and
blockchain technology.
Tianyi Song received her Ph.D. degree in computer
science from the George Washington University in
2017. She is a full-time faculty in the department
of computer science in the Bowling Green State
University. Her current research interests include
secure and privacy-aware computing for the Inter-
net of Things (IoT) and Cyber Physical Systems
(CPS), mobile computing, wireless networking, and
blockchain technology.
Bo Mei received her Ph.D. degree in computer
science from the George Washington University in
2018. He is currently an assistant professor in the
department of computer science in the Texas Chris-
tian University. He began his research focusing on
Mobile Computing since 2014, and has conducted
extensive study on system applications for IoT de-
vices. Currently, his research spans the broad area of
mobile computing, IoT, and social network inference
attacks.
This is the author's version of an article that has been published in this journal. Changes were made to this version by the publisher prior to publication.
The final version of record is available at
 <http://dx.doi.org/10.1109/TSC.2018.2853167>
Copyright (c) 2018 IEEE. Personal use is permitted. For any other purposes, permission must be obtained from the IEEE by emailing <pubs-permissions@ieee.org>.

---

## Page 11

1939-1374 (c) 2018 IEEE. Personal use is permitted, but republication/redistribution requires IEEE permission. See <http://www.ieee.org/publications_standards/publications/rights/index.html> for more information.
This article has been accepted for publication in a future issue of this journal, but has not been fully edited. Content may change prior to final publication. Citation information: DOI 10.1109/TSC.2018.2853167, IEEE
Transactions on Services Computing
Hong Li obtained his Ph.D. degree in 2016, from
the University of the Chinese Academy of Sciences.
He received his B.A. from Xian Jiaotong Univer-
sity. He currently works under Prof. Limin Sun in
the Institute of Information Engineering, Chinese
Academy of Sciences. His primary research interests
include security and privacy in wireless networks,
and localization.
Xiuzhen Cheng received her M.S. and Ph.D.
degrees in computer science from the University of
Minnesota
Twin Cities in 2000 and 2002, respec-
tively. She is a professor in the Department of Com-
puter Science, The George Washington University,
Washington, DC. Her current research interests in-
clude privacy-aware computing, wireless and mobile
security, cyber physical systems, mobile computing,
and algorithm design and analysis. She has served
on the editorial boards of several technical journals
and the technical program committees of various
professional conferences/workshops. She also has chaired several international
conferences. She worked as a program director for the US National Science
Foundation (NSF) from April to October in 2006 (full time), and from April
2008 to May 2010 (part time). She received the NSF CAREER Award in
2004. She is a member of ACM, and a Fellow of IEEE.
Liming Sun received the MS and PhD degrees
from the National University of Defense Technol-
ogy, Changsha, China, in 1995 and 1998, respec-
tively. From June 1998 to June 2000, he was a
postdoctoral fellow in the Institute of Software,
Chinese Academy of Sciences, Beijing, China. He
is currently a professor at Institute of Information
Engineering at Chineses Academy of Sciences, and
School of Cyber Security at University of Chinese
Academy of Sciences. His research interests include
wireless sensor networks, vehicular ad hoc networks,
and and wireless broadband access networks.
This is the author's version of an article that has been published in this journal. Changes were made to this version by the publisher prior to publication.
The final version of record is available at
 <http://dx.doi.org/10.1109/TSC.2018.2853167>
Copyright (c) 2018 IEEE. Personal use is permitted. For any other purposes, permission must be obtained from the IEEE by emailing <pubs-permissions@ieee.org>.
