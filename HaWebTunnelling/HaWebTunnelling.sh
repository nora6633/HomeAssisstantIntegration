#!/bin/bash

# this script is used for port forwarding the HA web from this private ip only host to a host have public ip

# Check if any process contains "homeassistant.local"
if curl -s --head --request GET http://163.22.17.184:8123 --max-time 5 | grep "200 OK" > /dev/null; then
    echo "`date` : ssh tunnelling process is running." >> ./result.txt
else
    echo "`date` : No ssh tunnelling process found" >> ./result.txt
    ssh tommygood@163.22.17.184 "pid=\$(sudo netstat -tupln | grep 8123 | awk '{print \$7}' | cut -d'/' -f1); if [ -n \"\$pid\" ]; then sudo kill -9 \$pid; else echo 'No process found using port 8123'; fi"
    ssh -fNR 0.0.0.0:8123:homeassistant.local:8123 tommygood@163.22.17.184
fi
