# Real Engine -- Hardware

Firmware for the ESP-32 and other hardware.

Currently the devices support by the system are:

 - Actor - ESP32 that recieves messages from hub
 - Scanner - RFID Reader that send information back to the hub

 Devices connect to the wifi then attempt to send a post request to the 192.168.0.101 address
 with their ip and device type.
