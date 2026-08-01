# cs234-08 - Part 07 (Pages 37-42)

---

## Page 37

Recurrent Neural Networks
´Goal: predict the viewing
probability of each tile in the next
few seconds
´Orientation-based network
´Tile-based network
37
RNN
(t-1)
RNN
(t)
RNN
(t+1)
Input
Output
RNN
(t-2)

---

## Page 38

Orientation-Based Network
38
Orientation
Motion
Saliency
!f+1
!f+n
Predicted Viewing Probability
Features
…
Ff-m
Ff
m
…
Orientation
Motion
Saliency
LSTM
LSTM
…=
n
Output: Predicted
viewing probabilities

---

## Page 39

Tile-Based Network
39
Viewed
Tiles
Motion
Saliency
!f+1
!f+n
Predicted Viewing Probability
Features
…
Ff-m
Ff
m
n
…
…
Viewed
Tiles
Motion
Saliency
Predicted
Tiles
Motion
Saliency
LSTM
LSTM
LSTM
Output: Predicted
viewing probabilities

---

## Page 40

Training Results
40
´ Orientation-based network
´ Tile-based network
Parameters
Training Set
Testing Set
No.
Neu.
LSTM
Layers
Drop.
Rank.
Loss
Accurac
y
F-score
Rank.
Loss
Accurac
y
F-
score
256
1
T
0.1
88.20%
0.67
0.15
85.72%
0.60
512
1
T
0.09
89.25%
0.70
0.14
86.35%
0.62
1024
1
T
0.09
89.28%
0.71
0.14
86.06%
0.62
Parameters
Training Set
Testing Set
No.
Neu.
LSTM
Layers
Drop.
Rank.
Loss
Accurac
y
F-score
Rank.
Loss
Accurac
y
F-
score
256
2
F
0.14
86.58%
0.57
0.20
83.94%
0.52
512
2
F
0.13
86.91%
0.58
0.19
84.11%
0.52
1024
2
F
0.12
87.29%
0.60
0.19
84.22%
0.53

---

## Page 41

Sample Results
´Configure the streaming server to
ensure < 10% missing tile ratio
´Shorter initial buffering time
´Smaller bandwidth consumption
41
2.38s
4 Mbps

---

## Page 42

Agenda
´Cameras and Displays
´Projection Models
´Tiled Streaming (PA1)
´Edge Rendering
´Fixation Prediction
´Other Challenges
42
