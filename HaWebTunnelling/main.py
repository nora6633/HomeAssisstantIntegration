# auto execute the shell script to make sure ssh tunnel is work normally

from urllib import request
import time, os, subprocess, threading, datetime

def internetOn():
    try:
        request.urlopen('https://www.google.com', timeout=1)
        return True
    except request.URLError as err:
        return False

def reboot() :
    # double check if the internet is broken
    connect_to_internet = internetOn()
    if connect_to_internet == False :
        f = open("result.txt", "a")
        f.write("Error : internet disconnected at " + datetime.datetime.now())
        f.close()
        os.system('reboot')

def main() :
    while True :
        #connect_to_internet = internetOn()
        #if connect_to_internet == False :
        #    reboot()

        time.sleep(30)
        process = subprocess.Popen(['bash', './HaWebTunnelling.sh'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        out, err = process.communicate()
        #print(out, err)

thread = threading.Thread(target=main, daemon=True)
thread.start()
thread.join()