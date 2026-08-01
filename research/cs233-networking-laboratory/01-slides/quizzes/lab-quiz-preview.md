# lab-quiz-preview

---

## Page 1

1. Given the network configuration below, with a campus network prefix of /16, assign IP
addresses and network prefixes to all device interfaces and clearly indicate the network
address and prefix on each link using the annotate command in GNS3. Take a screenshot of
your GNS3 project panel and include in your answer. Setup static routing where
appropriate.

Fig. 1: Problem 1

• Configure the PCs and setup routing tables where appropriate.
• Start Wireshark on PC1 and PC3.
• Ping PC3 from PC1
PC1% ping PC3 –c 2
• Save the captured data (ICMP and ARP messages).

a) Find the ARP reply and response on Network1 and Network4, and extract the
Ethernet/MAC addresses being exchanged.
b) Find the ICMP Request and Reply datagrams on Network1 and Network4, and
extract the IP Source and Destination addresses and the Ethernet Frame Source and
Destination addresses.
Include the above extracted frames of your Wireshark output to support your
responses, highlighting the required fields in parts a) and b).
