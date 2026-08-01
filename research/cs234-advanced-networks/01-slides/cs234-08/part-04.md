# cs234-08 - Part 04 (Pages 19-24)

---

## Page 19

Smart Decisions Need to be
Made by DASH Client
19
Equirecntangular
Client
• Which quality level to request?
• Which tiles to request?
• When to request?

---

## Page 20

Programming Assignment #1
´ You will modify the GPAC MP4Client to
request tiled segments at different
quality levels
´ Please submit a PDF report
´ If a demo is needed, I will let you know
20

---

## Page 21

Agenda
´Cameras and Displays
´Projection Models
´Tiled Streaming (PA1)
´Edge Rendering
´Fixation Prediction
´Other Challenges
21

---

## Page 22

Why Edge Servers are Useful for
Large-Scale 360 Video Streaming?
´ High bandwidth consumption
´ Tiled streaming, but we want to cache some
common tiled segmented at the edge server
´ Latency sensitive
´ Tiled segments need to be near-by (at the
edge server)
´ For weaker HMDs, computations can be done
at the edge server
´ Heterogeneous HMDs
´ How to allocate bandwidth (downstream from
the edge server) to individual clients
22

---

## Page 23

Edge Servers Help to …
´ Tile Rewriting (TR): Merge tiles into a single video
stream
´ ViewPort Rendering (VPR): Generate two views
for HMDs
23

---

## Page 24

Tile Rewriting: Merging Tiles
at the Edge Server
24
´ Parse Media Presentation Description (MPD) (with Spatial
Representation Description (SRD) info)
´ Download tiles at different qualities
´ Combine tiles into a single HEVC bitstream based on SRD info
´ Encapsulate the HEVC bitstream into an MP4 container
MPD File
Representation….........
BaseURL…....................
Segmentbase...............
SRD info……………..
MPD/SRD
Parser
Tile
Downloader
MP4
Encapsulator
Tile
Rewriter
SRD
Info
