import requests

BASE_URL = "http://163.22.17.116:8122/api/hot_key"

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

if __name__ == "__main__":
    test_get_all_hotkeys()
    test_create_hotkey()
    test_update_hotkey()
    test_delete_hotkey()

