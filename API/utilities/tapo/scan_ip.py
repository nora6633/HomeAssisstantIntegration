import subprocess
import asyncio
import platform
import re
from concurrent.futures import ThreadPoolExecutor
import time
import tapo_connect 
import json
# Function to ping a single IP address
def ping_ip(ip):
    # Determine the command based on the OS
    param = "-n" if platform.system().lower() == "windows" else "-c"
    command = ["ping", param, "1", ip, "-W", "1"]
    
    try:
        # print("scan", ip)
        output = subprocess.check_output(command, stderr=subprocess.STDOUT, universal_newlines=True)
        if "ttl" in output.lower():
            return ip
    except subprocess.CalledProcessError:
        return None

# Function to scan the entire network
def scan_network(base_ip):
    live_ips = []
    
    with ThreadPoolExecutor(max_workers=50) as executor:
        futures = []
        for i in range(1, 255):  # Scan the IP range from .1 to .254
            ip = f"{base_ip}.{i}"
            futures.append(executor.submit(ping_ip, ip))
        
        for future in futures:
            result = future.result()
            if result:
                live_ips.append(result)
    
    return live_ips

async def getinfo(device) :
    await device.update()
    print({
        'type': type(device),
        'protocol': device.protocol_version,
        'raw_state': device.raw_state,
        'components': device.get_device_components
    })

# Main function to extract the network base IP
async def main():
    # You can replace this with actual IP or use a more dynamic way to get the local IP
    # For example, '192.168.1' for network '192.168.1.x'
    base_ip = "192.168.0"  # Modify this to match your network base IP

    # start_time = time.time()  # Start the timer
    # print("Scanning network... Please wait.")
    live_ips = scan_network(base_ip)
    # end_time = time.time()  # End the timer
    print(live_ips if live_ips else [])
    # if live_ips:
    #     print("Live IPs found:", live_ips)
        # print("Live IPs found:")
        # for ip in live_ips:
        #     print(ip)
            # try :
                # await getinfo(await tapo_connect.connect(tapo_connect.device_config(tapo_connect.auth, ip)))
            # except Exception as e :
            #     print(e)
    # else:
    #     print("No live IPs found.")
    # execution_time = end_time - start_time
    # print(f"Execution time: {execution_time:.2f} seconds")
    return live_ips

if __name__ == "__main__":
    loop = asyncio.new_event_loop()
    loop.run_until_complete(main())
    loop.run_until_complete(asyncio.sleep(0.1))
    loop.close()

