# Copyright (c) 2017 Tazman Schmidt <TazmanSchmidt@gmail.com>
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

import serial
import json
import requests
from uuid import getnode as get_mac

# hardcoded server/laptop IP TODO get dynamically
host = "http://192.168.0.102:8080/api/tags/log/";

deviceID = str(get_mac());

while True:
    # the ports appear  as files in /dev
    serialport = serial.Serial("/dev/ttyUSB0", 9600, timeout=1)
    response = serialport.readlines(None)
    if response:
        tag = str(response[0])[6:18];
        print ("got tag: " + tag)
        
        payload = json.dumps({'id': deviceID, "tagID": tag});
        
        print('payload: ' + payload)
        
        print('sending to: ' + host)
        
        try:
            r = requests.post(host, data= payload);
        except Exception as err:
            # the host could not be found
            print("not network accessable, the error was:")
            print(err)
            print()
            
            continue

        # logging
        print("post request sent");
        print(r.text);
        
        
