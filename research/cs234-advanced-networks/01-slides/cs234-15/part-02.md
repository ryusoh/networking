# cs234-15 - Part 02 (Pages 21-40)

---

## Page 21

Examples
´Phone display adjusts the
brightness of the display based on
the surrounding area
´Uses a light sensor
21

---

## Page 22

Examples
• Device displays user’s location, shows
route to a desired destination, find
nearby stores, geotag images on social
media, etc.
• Uses location sensor
22

---

## Page 23

User-Interface  leveraging
Contextual (Location) Information
23

---

## Page 24

Automatic Contextual
Reconfiguration
´ Add, remove, or alter components
based on context
´ Smart notifications on phone (ring,
vibrate, auto-response)
´ Could be largely
based on sensor
readings (may
discuss more next
time)
24

---

## Page 25

Context-Triggered Actions
´ Simple if-then condition-action rules,
automatically invoked
´ Reminder: if I step into the car on
weekday morning and don’t
have suitcase with me, remind
me to get it
´ Although tremendous advances have
been made, context-aware systems
still haven’t freed us from manually
creating memos/schedules!
25

---

## Page 26

Why Use Context?
´ Reduce cognitive load of user
´ Proactivity
´ Set up environment according to user’s
preferences/history
´ Auto-completion of forms (location, time in timetable)
´ Reminders
´ Search and filter information according to user’s needs
´ Avoid interrupting the user in inappropriate situations
´ Smart environments
´ Turn devices on/off, start applications, … depending
on location, time, situation (lecture, meeting, home
cinema, …)
´ Discover and use nearby interaction devices
26

---

## Page 27

Definitions of Context
´ “Context is any information that can be used to
characterize the situation of an entity. An entity is a person,
place, or object that is considered relevant to the
interaction between a user and an application, including
the user and applications themselves” [Dey et al. 2001]
´ Auxiliary: not essential
´ Relevant: can actually be used
27

---

## Page 28

Classification
´ External (physical)
´ Context that can be measured by hardware
sensors
´ Examples: location, light, sound, movement,
touch, temperature, air pressure, etc.
´ Internal (logical)
´ Mostly specified by the user or captured
monitoring the user’s interaction
´ Examples: the user’s goal, tasks, work context,
business processes, the user’s emotional state,
etc.
28

---

## Page 29

Agenda
´Location-Based Services
´Context-Aware Systems
´Challenges and Design
Guidelines
´Sample Work: Coordinated
Sensor Activations
29

---

## Page 30

Challenges: Self-Awareness
´ Context-awareness helps technology to
“get it right”
´ But context is hard to sense (quantity,
subtleness)
´ Computers are not self-aware like
humans
´ When the system does the wrong thing
´ auto-locking car doors
´ screen saver during presentation
´ microphone amplifying a whisper
30

---

## Page 31

Challenges: Intelligence
´ Context data must be coupled with the ability
to interpret it, but computers are bad at
“common sense”.
´ More rules ≠ intelligence
´ More rules = more complexity, harder to
understand
´ Keep “Human in the Loop”?
´ computers can detect, aggregate, portray
information
´ allow human users to interpret and act on it
´ is this a good strategy for all context-aware
systems?
31

---

## Page 32

Challenges: Programming
´ Developers have little experience with devices
that gather the data (e.g., gyroscopes).
´ Data gathered from a sensor must be
interpreted correctly in order for it to be useful.
´ Context comes from various sources and in
order for this data to be useful it must be
combined correctly (i.e., the gyroscope and
accelerometer working together to determine
orientation).
´ The context changes constantly in real time.
32

---

## Page 33

Challenges: Losing Control?
• Automation reduces the amount of work
that users have to do
• Users like the idea of a device that
completes tasks on their behalf
• However, when users use these devices
they feel a loss of control if a device has
a high level of automation
33

---

## Page 34

Challenges: Other
•
Privacy
•
Should law enforcement be able to access the
history of a user?
•
Correctness
•
Errors fusing data
•
Detection errors
•
Interpretation errors
•
Complexity
•
Difficult to develop, maintain, understand
•
Reduces accuracy of the application
•
Extra resource consumptions!
34

---

## Page 35

Challenges: Other (cont.)
• User preferences
´ May not match what the device does!
´ Everyone is different!
´ What is your idea of “nighttime”?
´ What is your idea of “warm”? Or “loud”?
• Information overload
• Can overwhelm the user
35

---

## Page 36

Solution Approaches
•
Keep an appropriate level of automation
(avoid uncertainty)
•
Avoid unnecessary interruptions
•
Avoid information overload
•
Keep an appropriate level of system status
visibility
•
Account for the impact of Social Context
•
Allow for the personalization of individual
needs
•
Secure the user’s privacy
36

---

## Page 37

Agenda
´Location-Based Services
´Context-Aware Systems
´Challenges and Design
Guidelines
´Sample Work: Coordinated
Sensor Activations
37

---

## Page 38

Motivation
´Increasingly more context-aware
applications leverage the rich set of
sensors on the smartphones.
´These applications directly control sensors
which lead to redundant
activations and energy
waste
38
38

---

## Page 39

Introduction
´Opportunity for optimization?
´Different apps may require same contexts
´Use different sensors to sense same contexts
´Research Problem: How to select the most efficient
sensing strategy ?
´Satisfy all apps’ requirements
´Minimize energy
consumption
OSM Middleware
39
39

---

## Page 40

System Overview
´ We proposed an Optimal Sensor Management
(OSM) middleware
´ The OSM middleware sits between apps and the
hardware
´ OSM middleware :
´ Provides API to connect apps
´ Maintains a database of active requests
´ Determines which sensors should be activated
40
40
