# lab-01

---

## Page 1

LAB ONE– Introduction
In this lab you will get familiar with the simulation environment, GNS3, and other software
packages such as VirtualBox, IPterm, etc., that all form part of the complete lab environment.
You will need to download all the appropriate software on your computer/laptop (PCs, Macs) to
work on the labs.
PART1. GNS3 Installation & Settings
In this first part of the lab, you will learn how to install and configure GNS3 VM, the network
simulator software that will run on a Virtual Machine.

Exercise 1(A). Installation and Initiation of VIrtualBox and GNS3
System Requirements
•
Windows 7 or higher with an Internet connection
•
Mac OS X 10.9 or above with an Internet connection

Note: Click on choices in figures as shown in red rectangles.

1. Download VirtualBox for your platform (Windows, Mac OS X):

<https://www.virtualbox.org/wiki/Downloads>.

Follow the installation instructions as given on the website (use default settings).

2. Upon successful installation, you should see the following screen. Close the window.

Figure 1.1

1

---

## Page 2

3. Open Host Network Manager window by opening the “File” menu and selecting “Host
Network Manager” or by pressing the keyboard shortcut “Ctrl + W” for Windows or
“Command + W” for Mac OSX. For older versions of VirtualBox, press a shortcut key “Ctrl

+ ,” for Windows or “Command + ,” for Mac OSX.

Figure 1.2

4. If you see a host-only adapter already in the window (as shown in Figure 1.2), you can skip
this step. Otherwise, create a Host-only network by pressing “Create” button in the menu.

5. Make sure the DHCP Server Enable option is checked. Now close the Host Network
Manager window.

6. Click Properties icon in the menu. And check if the adapter ‘s IP address is set to
192.168.56.1, and the netmask is set to 255.255.255.0 in Adapter tab as shown in Figure
1.3 under the Adapter tab.

7. Then click on the DHCP server tab, check if “Enable Server” option is enabled in DHCP
Server tab, 192.168.56.100 is set for Server Address, 255.255.255.0 is set for Server Mask,
192.168.56.101 is set for Lower Address Bound, and 192.168.56.254 is set for Upper
Address Bound as shown in Figure 1.4.

2

---

## Page 3

Figure 1.3

Figure 1.4

8. Download GNS3 (sample download window view shown below):

<https://www.gns3.com/software1>

1 Login required to download. Create your own personal account. Download appropriate version
for your laptop.
3

---

## Page 4

Figure 1.5

9. Install the downloaded GNS3 software. Note:
•
For Windows, when prompted for “Choose Components”, please uncheck
“SolarWinds Response Time Viewer” as shown high-lighted in Figure 1.6 below, and
click No for Toolset as shown in Figure 1.7.

Figure 1.6

4

---

## Page 5

Figure 1.7

10. Finish the installation process2.

Figure 1.8

11. The GNS3 simulator will open automatically if Start GNS3 is checked (see Figure 1.8
above).

2 When done with this lab, download the "GNS3 Getting Started Guide" for future reference.
This lab walks you through a simplified installation process.
5

---

## Page 6

12. You will see the following Setup Wizard screen (Figure 1.9). Click "Next". Please note that
you can always restart this setup wizard by opening Help menu in GNS3 and selecting
“Setup Wizard”.

Figure 1.9

13. Select 192.168.56.1 for “Host binding” option and click “Next” as shown in Figure 1.10
below3.

Figure 1.10

3 Please note that for Macs, if it doesnt allow you to select 192.168.56.1, you can select 127.0.0.1
instead.
6

---

## Page 7

14. Installation in progress, wait till DONE. Figure 1.11.

Figure 1.11

15. Installation done. Click “Next”.

Figure 1.12

7

---

## Page 8

16. You will see a screen as shown in Figure 1.13. Click OK to proceed to the next screen.

Figure 1.13

17. Check “VirtualBox” as shown in Figure 1.14. You will see a screen pop up as shown in
Figure 1.15. Click “OK”. Then you will see another screen with an error message as shown
in Figure 1.16. Click “OK”.

Figure 1.14

Figure 1.15

Figure 1.16
8

---

## Page 9

18. Click the link “download it here” as shown in Figure 1.17. Your web browser will
automatically download the GSN3 VM file “GNS3.VM.VirtualBox.2.x.x.zip”.

Figure 1.17

19. NOTE: Do not close the setup wizard screen Figure 1.17. You will come back to this screen
after installation of GNS3 VM on VirtualBox.

20. Go to your default Downloads folder on your computer and extract the “GNS3 VM.ova” file
from the downloaded GNS3 VM file “GNS3.VM.VirtualBox.2.x.x.zip” as shown in Figure
1.18. Please note that the version of the GNS3 VM should match the version of GNS3.

Figure 1.18

9

---

## Page 10

21. After you have extracted the ".ova" file, open VirtualBox (recall you installed it in the first
step of this lab) and click on File menu and select “Import Appliance” as shown in Figure
1.19.

Figure 1.19

22. Select the “GNS3 VM.ova” file that you just downloaded and extracted. The example below
shows the file in a sample (on a Windows computer) Downloads folder. Click “Next”.

Figure 1.20
10

---

## Page 11

23. Click “Import”. Wait for the process to be completed.

Figure 1.21

24. You should see the following screen once import is completed.

Figure 1.22

25. Click "Settings" Icon as shown in Figure 1.23.
11

---

## Page 12

Figure 1.23

26. Select “Network” and make sure the “Enable Network Adapter” option is checked for
Adapter 1 as shown in Figure 1.24. Also check if a Host-Only Ethernet Adapter is assigned
as shown in Figure 1.24. If any Host-Only adapter option is empty, then follow the previous
steps 3, 4 and 5 to add a host-only adapter. Then, select the created adapter.

Figure 1.24

12

---

## Page 13

27. Expand "Advanced" as shown below.

Figure 1.25

28. Choose Allow All under “Promiscuous Mode” as shown in Figure 1.26.

Figure 1.26

13

---

## Page 14

29. Select Adapter 2 option and make sure if the “Enable Network Adapter” is checked for
Adapter2. Also check if the adapter is attached to “NAT” as shown in Figure 1.27.

Figure 1.27

30. Return to the GNS3 Setup wizard window that you left earlier (Figure 1.17) and click
“Refresh”.

Figure 1.28
14

---

## Page 15

31. You should see the VM name field as shown in the red box. Click "Next".

Figure 1.29

32. Setup wizard will appear as shown previously in Figure 1.28 and GNS VM will start "running"
on Virtual Box as shown in Figure 1.31.

Figure 1.30

15

---

## Page 16

Figure 1.31

33. You can now click "Finish" on the Setup Wizard screen.

Figure 1.32

16

---

## Page 17

34. Click "Cancel" in New appliance template screen.

Figure 1.33

35. Click "Cancel" in Project screen.

Figure 1.34

17

---

## Page 18

36. You should see the following GNS3 screen. Ignore the error messages that appear on the
Console window.

Figure 1.35

37. If 1) the GNS3 VM’s status indicator is in red in the Server Summary section, 2) the GNS3
VM’s screen does not change from black screen and 3) you observe GNU GRUB screen in
the GNS3 VM’s booting sequence, then try to check if Hardware Virtualization is enabled
from BIOS. Please note that the steps to enable Hardware Virtualization in BIOS could vary
depending on the computer manufacturer and the computer models. The sample steps are
given in the link.

38. If the GNS3 VM’s status indicator is in grey or in red in the Server Summary section, If the
GNS3 VM’s screen is similar to Figure 1.31 then try to make sure if the DHCP option is
checked in the host-only adapter and adapter is correctly set up as shown in the Figure 1.2,
Figure 1.3, and Figure 1.4. If not then, quit GNS3 and delete GNS3 VM from VirtualBox.
Follow step 3 through 6. Then, import GNS3 VM following step 20 through 28. Try to open
GNS3 again and check the indicator becomes in green after a while.

39. If the status indicator of GNS3 VM is not in green, then quit GNS3 (GNS3 VM will also quit)
and restart the GNS3 VM from Virtual Box manually (see figure 1.23). Wait until you see the
GNS3 VM screen as shown in Figure 1.31. Then, start the GNS3 from the desktop.

40. If the issue does not go away, try to install VMWare and run the GNS3 VM on the VMWare
instead. The instruction video is given in this link. Please check the version compatibility of
VMWare VIX-API to the version of VMWare Workstation Player or VMWare Fusion. For
example, the VIX-API 1.15 is compatible to VMWare Fusion 8 or to VMWare Workstation
Player 12.

41. If you want to restart the setup wizard from the beginning, open Help menu in GNS3 and
select “Setup Wizard”.

18

---

## Page 19

42. If the server indicators in the Server Summary are in green as shown in Figure 1.35, GNS3
software installation is done. Quit GNS3.

19

---

## Page 20

Exercise 1(B). Importing Cisco Router IOS image into GNS3

1. First you will need to download the Cisco IOS image “c3640-a3js-mz.124-19b.bin’’ from
the UCI-ICS masterhit network drive (network_lab directory, cisco folder). To do that
you have to map the “UCI-ICS masterhit network drive” to your desktop. Click Windows
or Mac for instructions. A UCI VPN4 client will be necessary to access the UCI masterhit
network drive from a non UCI campus location. Once you are on "network_lab", go to
forlder "cisco" and copy the Cisco IOS image mentioned above (only one in folder) to
your computer. NOTE: The following are not links to web pages they are locations
to the network drives from which you download the software.

•
Windows:
\\masterhit.ics.uci.edu\network_lab
•
Mac:
smb://masterhit.ics.uci.edu/network_lab

2. Open GNS3 on your computer. You should see a screen as shown in Figure 1.36.

Figure 1.36

3. Go to:

•
Windows: Edit -> Preferences
•
Mac: GNS3 -> Preferences

4. In the left-hand pane, click on the arrow next to “Dynamips”, then click on the sub-menu
“IOS routers” and click “New” as shown in Figure 1.37.

4 If you don't have the VPN client, click UCI-VPN to download. You need to login with your
UCI ID and password to activate the VPN.
20

---

## Page 21

Figure 1.37 Creating router template

5. Select “Run this IOS router on my local computer” and Click “Next” as shown in Figure
1.38.

Figure 1.38

6. Then click on "Browse" to select the Cisco IOS image on your computer “c3640-ik9o3s-
mz124-13.bin’’. Click “Next”.

21

---

## Page 22

7. Edit “Name” as c3640, select the "Platform" as c3600 and "Chassis" as 3640 as shown
in Figure 1.39 below.

Figure 1.39 Cisco router selection

8. Click "Next" and check to see if memory size is set to 128MiB, if not, set it to that size.
Please note that the memory size setting is strict, i.e., not optional. Setting memory to
more than 128MiB can cause a problem when you are running large network
configurations with several routers.

9. Click "Next" to get to screen for "Network adapters" selection as shown in Figure 1.40
below.  Choose NM-1FE-TX from the dropdown menu for slot 0 through slot 3.

Figure 1.40 Cisco router’s WIC module setup

10. Click “Next”. Find the Idle PC value by clicking on Idle-PC finder. Please note that you
can skip this step if the Idle-PC finder fails more than 2 times. Click “Finish.”

11. After finishing the setup, you should see the following screen as shown in Figure 1.41
below. Click "Apply", then click "OK".

22

---

## Page 23

Figure 1.41 Cisco router preferences

12. In the GNS3 console window that appears (shown below in Figure 1.42), click on the
“folder icon” in upper left hand corner or choose “New blank project” from “File” menu5.

Figure 1.42 GNS3 startup screen

5 For Mac users, the “create new project window” appears automatically after step 11.
23

---

## Page 24

13. Click on "Browse All Devices" icon, (5th icon on the left-hand side shown in red
rectangle)) and select “Installed appliances”, to browse all possible network devices.
Select c3640 and drag it to the empty space (project pane) to the right of the devices
window as shown in Figure 1.43. Please note that if the c3640 does not appear in the
installed appliances list as shown in Figure 1.43, then quit GNS3 and open GNS3 again.
Then the icon should appear.

Figure 1.43 How to add a router to the GNS3 "Project" pane

14. Right-click on R1 and choose "Start".

15. Right click on R1 again and select “Auto Idle-PC”. The system will choose the best
value. It is recommended that you do this every time you add a router to a project. It is
also recommended that you do this when starting a saved project too.

16. Check CPU load of your system6. If  > 50%, repeat step 14 for each router and recheck.
If it does not drop, quit GNS3. Restart GNS3 and repeat steps 11 - 15 if creating a new
project, or repeat steps 13-15 on a saved project after starting each router.

17. Right-click on R1 and choose "Console". Console window will open. You maybe
prompted in console window to press "Return" key to get the prompt line.

18. You have finished the first step in running GNS3. Congratulations!!!!

19. Stop all running devices by clicking the “Stop All Nodes” button (red square button on
upper tool bar) in GNS3. Quit GNS3.

6 Check with Task Manager for Windows, or Activity Monitor for MacOS the cpu % value being
used by process “dynamips”.
24

---

## Page 25

Exercise 1(C). Importing ipterm into GNS3 VM

1. First you will need to download the ipterm GNS appliance from the GNS3 Market Place
as shown in Figure 1.44 and Figure 1.45 using the following link:

<https://www.gns3.com/marketplace/appliances>

Figure 1.44

Figure 1.45

2. Open File menu and select Import appliance as shown in Figure 1.46.
25

---

## Page 26

Figure 1.46

3. Select the downloaded impterm.gns3a file and click Open.

4. The following screens will appear. Click "Next" all the way through Figure 1.49 and click
Finish as shown in Figure 1.50. Then you will see the message box shown in Figure
1.51. Click OK.

Figure 1.47

26

---

## Page 27

Figure 1.48

Figure 1.49

Figure 1.50

Figure 1.51

27

---

## Page 28

5. When completed, select “Browse all devices” icon on the left side menu of GNS3, then
you should see the ipterm in the “installed appliances” list. If the ipterm icon does not
appear in the list after step 4, quit GNS3 and restart GNS3 again. The ipterm icon should
appear in the appliances list as shown in Figure 1.52.

Figure 1.52

6. Rename ipterm to PC using the following steps and remove “-“ from Default name format
in Figure 1.55.

Figure 1.53

28

---

## Page 29

Figure 1.54

Figure 1.55

7. You will see the following screens. Click OK.
29

---

## Page 30

Figure 1.56

Figure 1.57

8. Create a new project.
30

---

## Page 31

Figure 1.58

9. Give your project a name for example “pcsetup” as shown in Figure 1.59 and Click OK.

Figure 1.59

31

---

## Page 32

10. Expand Browse End Devices and drag and drop PC icon to project window as shown in
Figure 1.60. Note: GNS3 automatically numbers all devices.

Figure 1.60

11. Start PC-1 as shown below in Figure 1.61. Console screen will scroll with the ipterm
setup progress as shown in Figure 1.62.

Figure 1.61

32

---

## Page 33

Figure 1.62

12. PC setup is now complete. Stop all devices by clicking on large red button in upper icon
bar in GNS3. Quit GNS3

33

---

## Page 34

PART2. Testing the software set up
In this part we will set up a very simple network configuration to test the installed software
components and to make sure all your PCs and GNS3 are working well together.
Exercise 2(A). Initiation of devices

1. Open GNS3.

2. Start a new project as explained in Exercise 1(C), step 8. Drag two instances of PC to
create PC1 and PC2 in the project pane to start a network simulation as shown in Figure
2.1.

Figure 2.1 PC1 and PC2 in a GNS3 project

3. In GNS3, click on the "Add a link" tab (the 6th icon down on the left-hand side). Note that
the 6th icon will change to an icon with an “X” mark (as shown in Figure 2.2 below). Click
34

---

## Page 35

on PC1 and select eth0 as shown in Figure 2.2. Then repeat the process for PC2. You
can press "esc" on your keyboard, or click the 6thicon, to exit the add a link feature.

Figure 2.2 How to link two PCs

4. Please note that the color of the dots indicates the status of the devices in GNS3. The red
dots indicate that the PCs are not currently active. Now you are ready to test the
simulation. Click the "Start/Resume all devices" button (large green arrow) as shown in
Figure 2.3.

Figure 2.3 Two connected PCs with an active link
5. Click “Console connect all nodes” button to open console windows for each running
device in the project panel as shown in Figure 2.4.

(1
(2
(3
35

---

## Page 36

Figure 2.4

36

---

## Page 37

Exercise 2(B). Assigning and manipulating IP addresses

Figure 2.5
To assign an IP address A.B.C.D/xx to interface interface on a Linux device use the
ifconfig command as shown below in the terminal window.
ifconfig interface A.B.C.D/xx

Where interface indicates the output port, e.g., eth0, A.B.C.D indicates
the IP address, e.g., 10.0.1.4, and /xx indicates the length of the subnet
mask, e.g. /24 (255.255.255.0).

1. Assign an IP address on each of PC1 and PC2 with the following command:
a) For PC1: PC1% ifconfig eth0 10.0.1.1/24
b) For PC2: PC2% ifconfig eth0 10.0.1.2/24

Figure 2.6
2. To check if you have configured the IP address correctly on each PC, type in the terminal
window for each PC:

PC1% ifconfig
PC2% ifconfig
37

---

## Page 38

3. You should see the following output on their terminal windows

Figure 2.7 ifconfig output
Exercise 2(C). Using the command Ping
One of the most basic, but also most effective tools to debug IP networks is the ping command.
The ping command tests whether another host or router on the Internet is reachable. The ping
command sends an ICMP Echo Request datagram to an interface and expects an ICMP Echo
Replay datagram in return. A few ping usage scenarios are listed below.

COMMON USES OF THE PING COMMAND
ping IPaddress
Issues a ping command for the host with the given IP address. The system
will issue one ICMP Echo Request packet with a size of 56 bytes every
second. The command is stopped by pressing Ctrl-C.
ping IPaddress –c <num>
The command stops after sending a number, num, of ICMP Echo Requests.
ping IPaddress –s <num>
The number of data bytes in the ICMP Echo Request is set to num bytes.

ISSUING PING COMMANDS
When using ping on the Linux PCs, we recommend to always send at least two
ICMP Echo Request packets. We have observed that the first ICMP Echo Request
may often be dropped due to the delay in ARP protocol finding the hardware address.

1. From PC1, send five ping messages (using the -c option) to PC2. On PC1, this is done by
typing

PC1% ping 10.0.1.2 –c 5
38

---

## Page 39

2. From PC2, send five ping messages to PC1.

PC2% ping 10.0.1.1 –c 5

3. If you did everything correctly, you should see the ping response messages as shown in
Figure 2.8.

Figure 2.8 Terminal output for ping commands

4. Stop the PCs (red button) and quit GNS3.

39
