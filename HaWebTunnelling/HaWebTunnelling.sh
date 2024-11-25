#!/bin/bash

# this script is used for port forwarding the HA web from this private ip only host to a host have public ip

# Check if any process contains "homeassistant.local"
if curl -s --head --request GET http://163.22.17.116:8123 --max-time 5 | grep "200 OK" > /dev/null; then
    echo "`date` : ssh tunnelling process is running." >> ./result.txt
else
    echo "`date` : No ssh tunnelling process found" >> ./result.txt
    ssh -fNR 0.0.0.0:8123:homeassistant.local:8123 krixi@163.22.17.116
    ssh -fNR localhost:8122:localhost:8122 krixi@163.22.17.116
fi
