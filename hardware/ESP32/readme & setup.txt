All steps are covered in
https://learn.sparkfun.com/tutorials/esp32-thing-hookup-guide?_ga=2.108470337.238476317.1503015644-1367506164.1503015644#installing-the-esp32-arduino-core
but it's convoluted and links to other tutorials


--Install Arduino IDE--
https://www.arduino.cc/en/Main/Donate

--Install FTDI Driver--
https://cdn.sparkfun.com/assets/learn_tutorials/7/4/CDM_v2.12.00_WHQL_Certified.exe

Run as admin


--Install ESP32 Software Development Kit--
https://github.com/espressif/arduino-esp32

download it, extract it's contents to
C:/Users/[YOUR_USER_NAME]/Documents/Arduino/hardware/espressif/esp32/

Run
C:/Users/[YOUR_USER_NAME]/Documents/Arduino/hardware/espressif/esp32/tools/get.exe
(on mac or linux run get.py)
it takes 5min and closes itself. If it takes longer close it and run it again


--Open Arduino--
Connect to the board with a usb cable

Select the board:
Tools > Board menu > Sparkfun ESP32 Thing

Select the COM port that the board is attached to:
Tools > Port

Write Code, e.g. blink:

"
	int ledPin = 5;

	void setup()
	{
    		pinMode(ledPin, OUTPUT);
    		Serial.begin(115200);
	}

	void loop()
	{
    		Serial.println("Hello, world!");
    		digitalWrite(ledPin, HIGH);
    		delay(500);
    		digitalWrite(ledPin, LOW);
    		delay(500);
	}
"

View Serial out:
Tools > Serial Monitor and set the Baud Rate 115200

Upload (sometimes need to hold the RST button on chip if fails to load)

Also note under file examples is examples of most functionality



--Swapping to Atmel Studio 7 --
Atmel IDE is useful, and gives good examples, but it doesn't let you trace a functions definition, etc
http://www.microchip.com/development-tools/atmel-studio-7

Arduino plugins for Atmel Studio
http://www.visualmicro.com/

