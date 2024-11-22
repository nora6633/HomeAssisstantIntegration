import requests
from datetime import datetime

# 取得當前時間
current_time = datetime.now()
time_str = current_time.strftime("%Y-%m-%d %H:%M:%S")

BASE_URL = "http://163.22.17.116:8122/api/hot_key"

class ZoneChange :
    url = 'http://163.22.17.116:8122/api/zone_change'
    def __init__(self) :
        pass

    def get(self) :
        response = requests.get(self.url)
        if response.status_code == 200:
            print("查詢成功:", response.json())
        else:
            print("查詢失敗:", response.status_code)
        return True

    def post(self, name, zone) :
        response = requests.post(self.url, {'entity_name' : name, 'zone' : zone})
        if response.status_code == 201:
            print("修改成功:", response.json())
        else:
            print("修改失敗:", response.status_code)
        return True

def test_get_all_hotkeys():
    response = requests.get(BASE_URL)
    if response.status_code == 200:
        print("查詢成功:", response.json())
    else:
        print("查詢失敗:", response.status_code)

def test_create_hotkey():
    data = {
        "uid": 1,
        "key": "sampleKey",
        "value": "sampleValue",
        "status": 1
    }
    response = requests.post(BASE_URL, json=data)
    if response.status_code == 201:
        print("新增成功:", response.json())
    else:
        print("新增失敗:", response.status_code)

def test_update_hotkey():
    data = {
        "uid": 1,
        "key": "sampleKey",
        "value": "updatedValue",
        "status": 0
    }
    response = requests.put(BASE_URL, json=data)
    if response.status_code == 200:
        print("修改成功:", response.json())
    else:
        print("修改失敗:", response.status_code)

def test_delete_hotkey():
    data = {
        "uid": 1,
        "key": "sampleKey"
    }
    response = requests.delete(BASE_URL, json=data)
    if response.status_code == 200:
        print("刪除成功:", response.json())
    else:
        print("刪除失敗:", response.status_code)

def test_insert_account():
    BASE_URL = "http://163.22.17.116:8122/api/account"
    data = {
        "account": 'test',
        "password": "123"
    }
    response = requests.post(BASE_URL, json=data)
    if response.status_code == 201:
        print("新增帳號成功:", response.json())
        test_login(data['account'], data['password'])
    else:
        print("新增帳號失敗:", response.status_code)

def test_login(account, password):
    BASE_URL = "http://163.22.17.116:8122/api/login"
    data = {
        "account": account,
        "password": password
    }
    response = requests.post(BASE_URL, json=data)
    if response.status_code == 200:
        print("登入成功:", response.json())
    else:
        print("登入失敗:", response.status_code)

class Device :
    def __init__(self) :
        pass

    def discovery(self):
        BASE_URL = "http://163.22.17.116:8122/api/device/discovery"
        response = requests.get(BASE_URL)
        if response.status_code == 200:
            print("搜尋裝置成功", response.json())
            self.insert(list(response.json()[0].keys())[0])
        else:
            print("搜尋裝置失敗:", response.status_code)
    
    def insert(self, dev_ip):
        print('ip', dev_ip)
        BASE_URL = "http://163.22.17.116:8122/api/device"
        data = {
            "dev_ip" : dev_ip
        }
        response = requests.post(BASE_URL, json=data)
        if response.status_code == 201:
            print("新增裝置成功", response.json())
        else:
            print("新增裝置失敗:", response.status_code)

if __name__ == "__main__":
    test_get_all_hotkeys()
    test_create_hotkey()
    test_update_hotkey()
    test_delete_hotkey()
    zone_change = ZoneChange()
    zone_change.post('test', '冰箱' + time_str)
    print(zone_change.get())
    test_insert_account()
    # device
    device = Device()
    device.discovery()
