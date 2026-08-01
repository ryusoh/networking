# cs234-08 - Part 06 (Pages 31-36)

---

## Page 31

Simulation Setup
´ Hardware
´Edge server: Intel 40-cores workstation with 256 GB RAM
´HMD client: Oculus Rift DK2 with an i7 PC
´ Encoding
´No. tiles = {5x5}
´DASH segment length = {2} secs
´Encoding bitrates outside/inside viewport = {1, 8} Mbps
´FoV size = {100  100}
´ Viewers: Randomly select 40 traces from the dataset (40/100)
´ Network: The outbound bandwidth of the edge server is set to 1 Gbps
´ Baselines
´Current streaming approach (CUR)
´CPLEX Solver (OPT)
´Proposed system (PRO)
31

---

## Page 32

Sample Results: Better Video
Quality
´High video quality (V-PSNR ≥ 40 dB)
´The min/avg/max improvements are 6/7.4/8.4 dB
32
{1, 2, 3}: Natural, Fast
{4, 5, 6, 7}: Natural, Slow
{8, 9, 10}: Synthesis, Fast

---

## Page 33

Sample Results: Reduced
Bandwidth Consumption
´Save min/avg/max 35%/56%/62% bandwidth
consumption
´Higher edge
capacity, more
bandwidth
33
9.9
6.5

---

## Page 34

Agenda
´Cameras and Displays
´Projection Models
´Tiled Streaming (PA1)
´Edge Rendering
´Fixation Prediction
´Other Challenges
34

---

## Page 35

Predict the Viewers’ Head
Movements
´ Q: Why bother to predict that?
´ A: Want to know which FoV should we
stream to meet the viewer’s needs in the
next moment (a few secs from now)
´ Goal: predict which tiles are most likely
viewed by the viewers
➔which tiles should be included in the
next segment
35

---

## Page 36

New Way to Predict Fixations
36
´ Neural network with the features
´content:
saliency and motion maps
´sensor: ß new, only from HMDs
viewer’s yaw, roll, and pitch
saliency
detection
motion
detection
roll
yaw
