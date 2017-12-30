/*  MIT licence
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

#include <WiFiMulti.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

WiFiMulti WiFiMulti;

char tag[13];
WiFiClient client;
String ScannerID;
const uint16_t port = 8080;
const char * host = "192.168.0.102"; // ip or dns

void setup()
{
    Serial.begin(9600);
   
    delay(10);
    pinMode(2, INPUT);
    
    //Clear the tag
    for (int c=0; c < 13; c++) {
        tag[c] = 0;
    }
    // Start by connecting to a WiFi network
    WiFiMulti.addAP("ssid", "password");

    Serial.println();
    Serial.println();
    Serial.print("Wait for WiFi... ");

    while(WiFiMulti.run() != WL_CONNECTED) {
        Serial.print(".");
        delay(500);
    }

    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());

    ScannerID = (uint32_t)ESP.getEfuseMac();
    Serial.println("Device ID: ");
    Serial.println(ScannerID);
    String my_ip = WiFi.localIP().toString();



    String PostData = "{\"id\":\"";
    PostData.concat(ScannerID);
    PostData.concat("\",\"model_id\":\"11\",\"ip\":\"");
    PostData.concat(my_ip);
    PostData.concat("\",\"purpose\":\"Scanner device for scanning RFID cards\"}");
    WiFiClient client;

    while (!client.connect(host, port)) {
        //Serial.println("connection failed");
        //Serial.println("wait 5 sec...");
        delay(5000);
        
    }
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
    Serial.println("Done");
}


void loop() {
    
    int i=0;
    byte tagByte;
    boolean tagRead = false;
  
    if(Serial.available()==16){
      tagRead = true;
    }
    if (tagRead == true){
      while (Serial.available()){
        tagByte = Serial.read();
  
        if (tagByte!=2 && tagByte!=13 && tagByte!=10 && tagByte!=3){
          tag[i] = tagByte;
          i++;
        }
  
        if (tagByte==3){
          tagRead = false;
        }
      }
    }
    if (strlen(tag)==0){
      return;
    }
    else{
      //  print the tag read and send it to server using TCP
      Serial.print(tag);     
      Serial.println();
      //send tag scanned to server
      
      String PostData =  "{\"id\":\"";
      PostData.concat(ScannerID);
      PostData.concat("\",\"tagID\":\"");
      PostData.concat(tag);
      PostData.concat("\"}");
      Serial.print("connecting to ");
      Serial.println(host);
  
      // Use WiFiClient class to create TCP connections
      
      if (!client.connect(host, port)) {
          Serial.println("connection failed");
          Serial.println("wait 5 sec...");
          delay(5000);
          return;
      }
  
      client.println("POST /api/tags/log/ HTTP/1.1");
      client.println("Host: jsonplaceholder.typicode.com");
      client.println("Cache-Control: no-cache");
      client.println("Content-Type: application/text");
      client.print("Content-Length: ");
      client.println(PostData.length());
      client.println();
      client.println(PostData);
      // close the connection:
      client.stop();
      Serial.println("Client Disconnected.");
        
  
        //Clear the tag
      for (int c=0; c < 13; c++) {
          tag[c] = 0;
      }
    }
 
}

