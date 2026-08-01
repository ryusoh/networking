# cs234-08 - Part 03 (Pages 13-18)

---

## Page 13

Agenda
´Cameras and Displays
´Projection Models
´Tiled Streaming (PA1)
´Edge Rendering
´Fixation Prediction
´Other Challenges
13

---

## Page 14

Streaming 360 Videos is
Difficult, Because…
14
´ 4k resolution in HMD requires 12k resolution for the
whole 360° video (≈ 135 Mbps in HEVC             )
´extremely large file size ⇒insufficient bandwidth
Source: 360Heros

---

## Page 15

Potential Solution
15
´ The HMD viewer only gets to see a small part of
the whole 360˚ video (< 1/3 )
´ The viewer actively changes the viewing
orientation when rotating his/her head.
⇒Only stream the current Field-of-View (FoV) of
the viewer
FoV

---

## Page 16

Tiled Encoding and (DASH)
Streaming
16
• 360° video is split into tiles of sub-videos (spatial)
and independently encoded
• Only the tiles overlapped with the viewer’s FoV are
streamed to the client
α
β
θ
FoV
0°
1
1
1
1
1
1
1
1
1
1
1
0
0
0
0
0
1
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
1
1
1
1
1
1
1
1
1
1
1
1
1
1

---

## Page 17

Tiled Segments in Different
Quality
17
´Tiles are split into temporal segments
´tile qualities can change in every segments
Time
Seg. 1
Seg. 2
Low-quality
High-quality
Selected tiles
Available
Bandwidth
Time
Viewer Orientation
0°, 0°

---

## Page 18

Adaptive to Bandwidth and
Viewer Orientation
18
Time
Seg. 3
Seg. 2
Low-quality
High-quality
Selected tiles
Available
Bandwidth
Time
Viewer Orientation
-15°, 75°
