/*  MIT License
 *   
 *  Copyright (c) 2017 Justin Courtice <justin.courtice@uq.net.au>
 *  
 *  Made for Usage with Real Engine
 *  
 *  ESP32 Program for connecting to a hardcoded server and listening for 
 *  Message to convert to speech and play using a EMIC2 module.
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

#include <WiFi.h>

const char* ssid     = "ssid";
const char* password = "password";
String DeviceID;

WiFiServer server(80);

void setup()
{
    Serial.begin(9600);
    // set the LED, tx and rx pin mode
    pinMode(5, OUTPUT);
    pinMode(2, INPUT);
    pinMode(3, OUTPUT);   
    Serial.flush(); 
    delay(10);

    // Connect to the WiFi 

   /* Serial.println();
    Serial.println();
    Serial.print("Wait for WiFi... ");
    Serial.println(ssid);*/

    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED) {
        //Serial.print(".");
        delay(500);
    }
    String my_ip = WiFi.localIP().toString();
    DeviceID = (uint32_t)ESP.getEfuseMac();
    
    digitalWrite(5, LOW);  // turn LED off

    //let server know the device info
    const uint16_t port = 8080;
    const char * host = "192.168.0.102";
    String PostData = "{\"id\":\"";
    PostData.concat(DeviceID);
    PostData.concat("\",\"model_id\":\"99\",\"ip\":\"");
    PostData.concat(my_ip);
    PostData.concat("\",\"purpose\":\"Actor device for playing text to speech\"}");

    // Use WiFiClient class to create TCP connections
    WiFiClient client;

    while (!client.connect(host, port)) {
        //Serial.println("connection failed");
        //Serial.println("wait 5 sec...");
        delay(5000);
        
    }
    //send server post request including device info
    client.println("POST /api/devices/ HTTP/1.1");
    client.println("Host: jsonplaceholder.typicode.com");
    client.println("Cache-Control: no-cache");
    client.println("Content-Type: application/json");
    client.print("Content-Length: ");
    client.println(PostData.length());
    client.println();
    client.println(PostData);
    delay(100);
    client.stop();
    delay(2000);

    Serial.print('\n');             // Start EMIC2
    //start listening for requests
    server.begin();

}

int value = 0;

void loop(){
   //listen for incoming requests
   //Serial.write(".");
   WiFiClient client = server.available();  
 
  String speech = "";
  
  if (client) {                             // if you get a client,
    String data = "";                // make a String to hold incoming data from the client
    while (client.connected()) {            // loop while the client's connected
      if (client.available()) {             // if there's bytes to read from the client,
        char c = client.read();             
                
        if (c == '\n') {
          if (data.length() == 0) {
            speech = client.readStringUntil('\n');
            client.flush();
            delay(10);
            client.println("HTTP/1.1 200 OK");
            client.println("Content-type:text/html");
            client.println();
            client.println();
            delay(10);
            break;
          } else {    
            data = "";
          }
        } else if (c != '\r') { 
          data += c;
        }
      } 
    }
    // close the connection:
    client.flush();
    client.stop();

    //check for text to speech
    int x  = speech.indexOf('=');
    if(x > 0){
      String message = speech.substring(x+1);
      message.replace('+',' ');
      Serial.print('S');
      Serial.print(message);  // Send the desired string to convert to speech
      Serial.print('\n');
      digitalWrite(5, HIGH);         // Turn on LED while Emic is outputting audio
      while (Serial.read() != ':');   // Wait here until the Emic 2 responds with a ":" indicating it's ready to accept the next command
      digitalWrite(5, LOW);
      delay(10);             
    }
    
  }
}
