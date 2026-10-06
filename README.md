# NEXUS

NEXUS is a clean-start camera-control system for PC + iPhone + Nano ESP32.

## Architecture
PC webcam + Gsycle/Reyann USB joystick -> NEXUS PC server
NEXUS PC server <-> Wi-Fi <-> Nano ESP32
Phone <-> Wi-Fi <-> NEXUS PC server

The PC is the webcam host. The phone receives the PC's video stream; the phone does not directly access the PC's USB webcam.

## Hardware
- Arduino Nano ESP32
- NEMA17 + TMC2209 for pan
- DS3218 for tilt
- AS5600 for pan feedback
- 12V supply
- 6V buck for servo
- Physical E-stop in the power circuit

## Safety
The software E-stop is supplemental. Keep the physical E-stop wired to remove power.
Verify all pin assignments and motor-driver wiring before applying power.
