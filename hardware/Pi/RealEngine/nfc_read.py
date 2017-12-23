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

import sys
import time
import requests
import socket
import json

from uuid import getnode as get_mac
from subprocess import call

from smartcard.CardType import AnyCardType
from smartcard.CardRequest import CardRequest
from smartcard.CardConnectionObserver import ConsoleCardConnectionObserver
from smartcard.Exceptions import CardRequestTimeoutException

deviceID = str(get_mac());  # using mac as unique device ID

def init_nfc():
    host = "http://192.168.0.102:8080/api/devices/";

    modelID = "98";
    # TODO make neater
    myIP = [l for l in ([ip for ip in socket.gethostbyname_ex(socket.gethostname())[2] if not ip.startswith("127.")][:1], [
        [(s.connect(('8.8.8.8', 53)), s.getsockname()[0], s.close()) for s in
         [socket.socket(socket.AF_INET, socket.SOCK_DGRAM)]][0][1]]) if l][0][0]
    myPurpose = "Pi used for RFID scanning";

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
        r = requests.post(host, data=payload);
    except Exception as err:
        # the host could not be found
        print("not network accessable, the error was:")
        print(err)
        print()
        print("Waiting 10 seconds till re-attempt...")
        # wait(10)
        # TODO add wait loop
        # sys.exit(1)

    cardtype = AnyCardType()
    cardrequest = CardRequest(timeout=None, cardType=cardtype)

    return cardrequest

def handle_nfc(cardrequest):

    # request card insertion
    print('Listening for card')
    cardservice = cardrequest.waitforcard()

    # attach the console tracer
    observer = ConsoleCardConnectionObserver()
    cardservice.connection.addObserver(observer)

    # connect to the card and perform a few transmits
    cardservice.connection.connect()

    # get the UID
    cmd = [0xFF, 0xCA, 0x00, 0x00, 0x00]
    response, sw1, sw2 = cardservice.connection.transmit(cmd)
    tag = str(response)
    print(tag)
    if (tag != '[]'):
        payload = json.dumps({'id': deviceID, "tagID": tag});

        print('payload: ' + payload)

        host = "http://192.168.0.102:8080/api/tags/log/";
        print('sending to: ' + host)

        try:
            r = requests.post(host, data=payload);
        except Exception as err:
            # the host could not be found
            print("not network accessable, the error was:")
            print(err)
            print()

            continue
    time.sleep(3)

def run_nfc():
    cardrequest = init_nfc()

    while True:
        try:
            handle_nfc(cardrequest)
        except Exception as e:
            print(e)

if __name__ == '__main__':
    run_nfc()
