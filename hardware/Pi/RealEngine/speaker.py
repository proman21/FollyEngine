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

import requests
import socket
import json
from uuid import getnode as get_mac
from subprocess import call

#TODO connect to wifi
# Real_Engine
# 93878517

def register_speaker(selector):
    s = init_socket()

    # Register the socket with the selector and ensure the socket is in
    # non-blocking mode.
    s.setblocking(False)
    selector.register(
        fileobj=s,
        events=selectors.EVENT_READ,
        data=lambda sock, mask: handle_socket(sock)
    )

def init_socket():
    # hardcoded server/laptop IP TODO get dynamically
    host = "http://192.168.0.102:8080/api/devices/";


    deviceID = str(get_mac());   #using mac as unique device ID
    modelID = "97";
    #TODO make neater
    myIP = [l for l in ([ip for ip in socket.gethostbyname_ex(socket.gethostname())[2] if not ip.startswith("127.")][:1], [[(s.connect(('8.8.8.8', 53)), s.getsockname()[0], s.close()) for s in [socket.socket(socket.AF_INET, socket.SOCK_DGRAM)]][0][1]]) if l][0][0]
    myPurpose = "Pi used for Actor Device";


    payload = json.dumps({'id': deviceID,
               'model_id': modelID,
               'ip': myIP,
               'purpose': myPurpose}); 

    # logging
    print('post payload assembled:');
    print(payload);
    print('sending to: ' + host)


    # send initial post request to server
    try:
        r = requests.post(host, data= payload);
    except Exception as err:
        # the host could not be found
        print("not network accessable, the error was:")
        print(err)
        print()
        print("Waiting 10 seconds till re-attempt...")
        #wait(10)
        #TODO add wait loop
        #sys.exit(1)
        


    # logging
    print("post request sent");
    print(r.text);


    s = socket.socket();
    host = "";
    port = 8080;
    s.bind((host, port));

    s.listen(5)

    return s

def handle_socket(s):
    c, addr = s.accept()
    request = bytes('HTTP/1.1 200 OK\r\n\r\n', 'utf-8');
    c.send(request)

    print ('Got connection from',addr)
    data = c.recv(1024)

    c.close()


    temp, message = str(data).split("key=")

    print(message)

    speech = "... ..." + message.replace('+',' ') + '... ...'

    print(speech)

    tempFileName = "Audio/test_padded.wav"

    call(['pico2wave','-w', tempFileName, speech])
    call(['play',tempFileName])

    print("end")
  
#icowav
#s.ubind

if __name__ == '__main__':
    s = init_socket()

    while True:
        handle_socket(s)
