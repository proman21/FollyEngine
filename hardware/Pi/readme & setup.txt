
Eventually we can probably just set this up once and clone the SD card to set up others
But for the moment, we have to set it all up manually



---   setup OS & network connection  ---

The following videos cover just about everything about basic rpi setup
as well as enabling ssh & remotely connecting over a network with VNC

Raspberry Pi Tutorial 1 - PC Headless Setup 2017 UPDATE
# https://youtu.be/RlUhDUJfTe8

Raspberry Pi Tutorial 2 - Remote Desktop & VNC on PC 2017 UPDATE
# https://youtu.be/DG366Hh15-k


update the pi, this is usually recommended before installing anything
> sudo apt-get update
> sudo apt-get upgrade
> sudo apt-get dist-upgrade



---   Downloading our files from github   ---

download the whole 'real' folder and put it on the desktop of the pi
A lot of the code relies on this path being exact

These files are all work in progress & some hardcoding has been put in that ought to be made more dynamic

A brief overview of the files:

*Audio/
is the folder used to store all text to speech files & is where you should put any audio files you want to play

*nfc_read.py
connects to the hardcoded server ip, reads the input of any tag that has been scanned by a ACR122 NFC reader (connected by USB) and sends the tag to the server

*speaker.py
connects to the hardcoded server ip and will recieve text files or audiofile names to play

*nfc_plus_speaker.py
threads the nfc_read.py & speaker.py at the same time 


you will need to install selectors for the threading to work properly
> pip install selectors




---   Setup NFC reader   ---

following along with this blog:
# https://oneguyoneblog.com/2015/09/16/acr122u-nfc-usb-reader-raspberry-pi/

> sudo apt-get -y install subversion autoconf debhelper flex libusb-dev libpcsclite-dev libpcsclite1 libccid pcscd pcsc-tools libpcsc-perl libusb-1.0-0-dev libtool libssl-dev cmake checkinstall
> wget https://github.com/nfc-tools/libnfc/releases/download/libnfc-1.7.0-rc7/libnfc-1.7.0-rc7.tar.gz
> tar -xvzf libnfc-1.7.0-rc7.tar.gz
> cd libnfc-1.7.0-rc7
> ./configure --with-drivers=acr122_usb
> make
> sudo make install
> sudo sh -c "echo /usr/local/lib > /etc/ld.so.conf.d/usr-local-lib.conf"
> sudo ldconfig
> sudo nfc-list

Then to get it to communicate with python modules
> sudo apt-get install swig
> pip3 install pyscard
> sudo apt-get install libacsccid1
> pcsc_scan



---   installing text-to-speech   ---

this is the pico2wave text-to-speech package
> sudo apt-get install libttspico-utils

the following command saves the text as a file in the current directory
> pico2wave -w my_file_name.wav "Hi, this is example text"

or specify an accent:
> pico2wave --wave my_file_name.wav -l en-GB "Hi, this is example text"


we then play using aplay:
> aplay my_file_name.wav

we can remove files with rm
> rm my_file_name.wav



---   installing bluetooth   ---
follow along with this if you want more info:
# https://github.com/pkozul/ha-tts-bluetooth-speaker

> sudo apt-get install pi-bluetooth

this should give you a bluetooth symbol on your taskbar, that
 you canconnect to devices with like you do wifi



---   installing tmux   ---

Normally when we ssh into a pi we can't see what's running.
with tmux, we can leave terminal sessions open & connect to
them when we ssh


the following installs ver 2.1, I think they're up to ver 2.6,
though I havnt' noticed anything wrong with v2.1

> sudo apt-get install libevent-dev libncurses5-dev
> wget https://github.com/tmux/tmux/releases/download/2.1/tmux-2.1.tar.gz
> tar xfa tmux-2.1.tar.gz
> cd tmux-2.1
> ./configure
> make
> sudo make install
> cd ..
> rm -Rf tmux*


to start tmux in a terminal (or though ssh client):
> tmux

you can attach to an existing session with
> tmux attach

when in tmux the session is seperate from the clients window
(we can even have two clients attatched to the same session)


When in tmux, the most useful commands for us are:

exit  		   	- kill the session & the client
Ctrl-B then d 	- dettaches the client from the session (leaves it running in the background)
Ctrl-B then ( 	- attaches the client to the last session
Ctrl-B then s  	- to view all current sessions, and switch between them

There are a whole heap of other tmux commands on their site:
# http://man.openbsd.org/cgi-bin/man.cgi/OpenBSD-current/man1/tmux.1



---   automate startup   ---

to automatically start the script in the background we use crontab scheduler
open it with:

> crontab -e

you may have to select a text editor, type 2 then <enter>

type this at the bottom of this file type (paste):
@reboot /usr/local/bin/tmux new-session -d -s RealEng 'python3 /home/pi/Desktop/real/nfc_plus_speaker.py'

then save and close by typing:
Ctrl + x, y, <enter>

some other options in case that stops working;
we can make it wait 10 seconds before it runs the script:
@reboot sleep 5 && /usr/...

we can also shift everything from "/usr/..." line into a .sh file and call the .sh



---   DMX lighting   ---
# https://www.openlighting.org/ola/developer-documentation/python-api/

dmx:
https://github.com/c0z3n/pySimpleDMX
pip install pysimpledmx
which usb? type:
lsusb



---   wifi connection   ---

the pi remembers which networks it has connected to.
Run the following to view which networks are remembered
> sudo nano /etc/wpa_supplicant/wpa_supplicant.conf

network={
        ssid="DDSSGHB"
        scan_ssid=1
        psk="snowwhite"

}

you can delete old networks, or add hidden networks this way
The order of the wifi networks appears to be the order it tries to connect




---   'task manager' for linux   ---

sometimes you will want to see if the programs are running:
> ps aux | grep nfc

this searches all currently running programs that have nfc in their name, it will always list itself aswell

the pid is the first number on ech line, you can kill a process with
> kill <my_pid>



---   End Notes & improvements   ---


with reguard to our networking problems:

we may want to try get longer range wifi antennas
try a LogiLink Wireless LAN USB Micro Adapter:
# https://raspberrypise.tumblr.com/post/147699665389/ad-hoc-networking-with-raspberry-pis


or we could try a mobile broadband hotspot
(it requires a sim card)


this site has a few things that we might want to consider, such as encription & secure ssh:
https://raspberrypise.tumblr.com/

