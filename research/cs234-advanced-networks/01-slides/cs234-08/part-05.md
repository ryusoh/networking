# cs234-08 - Part 05 (Pages 25-30)

---

## Page 25

Viewport Rendering: Computation
Offload to the Edge Server
25
MPD File
Representation….........
BaseURL…....................
Segmentbase...............
SRD info……………..
MPD/SRD
Parser
Tile
Downloader
Viewport
Renderer
MP4
Encapsulator
SRD
Info
´ Parse MPD (with SRD info)
´ Download tiles with different qualities
´ Render user’s viewport scene (FoV size, FPS, and resolution)
´ Encapsulate HEVC bitstream into MP4 container

---

## Page 26

Choosing Between TR or VPR
26
…and allocate
bandwidth
among HMDs

---

## Page 27

Resource Allocation
27
●Limited resources of edge server
○Computing power
○Network bandwidth
●Capitalize edge server to help HMDs for maximizing
the overall video quality ß wisely assign bandwidth
and computing power
Rate-Distortion Curves

---

## Page 28

Formulation
28
Objective: Maximize overall video
quality (V-PSNR) improvement
Avoid overloading the edge server
Bandwidth consumption of VPR
Bandwidth consumption of TR
Outbound bandwidth of edge server doesn’t exceed the limit

---

## Page 29

A (Greedy) Heuristic Algorithm
29
Sort in desc. order
Calculate Δq and saved bandwidth
Max. video quality improvement
Max. ratio of quality improvement to bandwidth
consumption
Max. bandwidth consumption
The Proposed Algorithm runs in O(NlogN)

---

## Page 30

Viewing Dataset
´ 50 subjects
´ Collect from HMDs while viewers are
watching 360° videos
´ Frame Capturer: GamingAnywhere[2]
´ Sensor Logger: OpenTrack[3]
30
[1] W. Lo, C. Fan, J. Lee, C. Huang, K. Chen, and C. Hsu, “360◦video viewing dataset in head-mounted virtual reality,”
in Proc. of ACM International Conference on Multimedia Systems (MMSys’17), Taipei, Taiwan, June 2017, pp. 211–216.
[2] GamingAnywhere, <http://gaminganywhere.org/>
[3] OpenTrack, <https://github.com/opentrack/opentrack>
