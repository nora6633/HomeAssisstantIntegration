"""
This script adds a Tapo device to Home Assistant.
It uses the Home Assistant API to add the device. 
The script sends a POST request to the Home Assistant API with the device's IP address, username, and password.
"""
import sys
import requests
ha_ip = "163.22.17.184"
home_assistant_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI4OTI2YzE0OTI2YzY0ZTBmYWQ5MGJhNDc1YjBkYTM2NiIsImlhdCI6MTcyMjI0MjAwNiwiZXhwIjoyMDM3NjAyMDA2fQ.DfwflG8zTXQOy5QCy_xn1QjPApSSgqKFV4bYNzpyAjY'
host = "192.168.0.199" # device ip
user_name = "annnna6633@gmail.com"
password = "a12345678"

# Define the URL and headers
url = "http://%s/api/config/config_entries/flow/e9058a096ed38fb9c934cb61ef2c9e7c" % host
headers = {
    'Authorization': f'Bearer {home_assistant_token}',
    'Content-Type': 'application/json'
}

def get_flow_id():
    payload = {
        'handler': 'tapo',
        'show_advanced_options': True
    }
    
    url = 'http://%s:8123/api/config/config_entries/flow' % ha_ip
    response = requests.post(url, json=payload, headers=headers)
    return response.json()['flow_id']

def main(flow_id):
    # host = input()
    payload = {
            'host': host,
            'username': user_name,
            'password': password
    }
    url = 'http://%s:8123/api/config/config_entries/flow/%s' % (ha_ip, flow_id)
    response = requests.post(url, json=payload, headers=headers)
    print(response.json())


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python tapo_add_device.py <host>")
        sys.exit(1)
    host = sys.argv[1]
    flow_id = get_flow_id()
    main(flow_id)