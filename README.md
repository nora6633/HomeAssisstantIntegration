#### 筆記：https://hackmd.io/@anna0131/Syjaf0iykg
#### 影片:https://youtu.be/x5yNiuo9750?si=7jILmJG8evsTAPqR
## Background and Objectives
智慧家庭已經成為現代生活的一部分。智慧家電的普及不僅提升了我們的生活品質，還在節能減碳方面展現了很大的潛力。

然而現在的智慧家庭系統通常是各自為政，缺乏一個統一的管理平台來整合不同品牌的智慧家電，而且這些系統在使用者體驗和互動性上仍有很多可以改進之處，因此我們決定開發一個基於 Home Assistant 平台的家庭自動化系統，開發一個可以整合多品牌智慧家電的系統，並可透過智慧語音助理來控制 Home Assistant 及各種家電。

## Technical Overview
- Vue.js：前端介面使用 Vue.js 開發，提供使用者操作的視覺化介面。
- Linux Server：借用校內具有對外 IP 的 Ubuntu 22.04 主機，提供以下兩項功能：
	- 反向代理（Reverse Proxy）：利用 Nginx 將前端請求導向 Raspberry Pi 上的 Node.js server 與 Home Assistant Web UI。
 	- 資料庫（Database）：使用 MySQL 儲存帳號密碼等資訊。
- Access Point：將 Raspberry Pi 和 IoT 設備部屬於同一區網內，方便彼此通訊。
- IoT 設備：整合多品牌的智慧家居設備，如燈泡、插座、感應器等。
- Node.js：
	- 與資料庫與 Home Assistant API 串接，提供登入、註冊、新增裝置等 RESTful API 功能給前端使用。
	- 使用 iputils 工具（例如 ping）來掃描區網中的 IoT 設備。
- Home Assistant：利用其官方/非官方整合模組（Integrations）管理不同品牌的設備。提供 RESTful API 供後端取得設備資訊與執行控制命令。
- 聊天機器人功能：
	1. 設備查詢與控制：使用者可透過自然語言查詢設備狀態，或下達控制指令（如「開啟插座」）。
	2. 情境模式切換：提供六種情境模式（回家、出門、起床、睡眠、工作、節能），可快速一鍵切換。
	3. 自動化與人性化互動：
		- 支援設備聯動與定時功能。
	 	- 理解如「能否讓臥室更亮？」等語意性問題並給予建議或直接操作。


## System Features
### 設備管理
點擊左下角的「加號」按鈕，選擇品牌後，系統將顯示偵測到的裝置。選取您想新
增的裝置，即可完成新增操作。

<img width="666" alt="image" src="https://github.com/user-attachments/assets/997b7eba-2ae2-414e-97d0-9089424487ba">

### 分區功能
本系統目前設有「臥室」、「客廳」和「廚房」三個分區，旨在幫助用戶更高效地
管理和區分設備。

<img width="575" alt="image" src="https://github.com/user-attachments/assets/2d139208-bb10-4de6-8121-372d5aaf5b47">

### 設備顯示
本系統目前支援多種類型的設備，包括 Matter 燈泡、Tapo 插座、Tuya 插座、小米門窗感應器、Tuya 溫濕度感應器以及 Tapo 監視器。

設備狀態會以顏色區分：關閉時顯示為灰色（如圖十八），開啟時顯示為黃色（如圖十九）。

點擊設備左下角的「…」圖示，可檢視或設定更多設備資訊，例如區域、自動化設定、歷史記錄等。此外，用戶還可以調整設備的分區位置或新增自動化設定，讓設備管理更加高效與便捷。

<img width="541" alt="image" src="https://github.com/user-attachments/assets/ea534522-e722-4f19-9ab0-807e7f96267d">

###  新增自動化
若要新增更多自動化選項，可點擊右箭頭進入設定頁面，點擊加號以新增觸發條件和動作，完成後點擊「儲存」，即可成功新增。

<img width="577" alt="image" src="https://github.com/user-attachments/assets/a759baaf-e650-424c-ad8d-77c240539297">
<img width="582" alt="image" src="https://github.com/user-attachments/assets/39ccf7e8-6eed-48f7-8c4a-93205c1158b6">

### 燈條/燈泡
如果是燈條或燈泡，用戶可以控制其開關、亮度以及色彩，讓設備更符合用戶的使用需求與環境氛圍。

<img width="512" alt="image" src="https://github.com/user-attachments/assets/9c550a6f-ba15-4dec-959e-37548cea70e7">


### 計電插座
如果是有計電功能的插座，用戶可以查看電量統計資訊。內容包括：本月至今累積電費、總用電量、功耗等。此外，用戶也可以根據折線圖的記錄，直觀的了解插座的使用時段及電量變化情況。

<img width="530" alt="image" src="https://github.com/user-attachments/assets/fe635319-9c53-4375-92e5-296e35516300">

## 聊天機器人
點擊主畫面右上角的「機器人」按鈕，即可啟用聊天機器人。您可以透過輸入文字提問，或使用快捷訊息快速向聊天機器人詢問問題。

<img width="465" alt="image" src="https://github.com/user-attachments/assets/a8668be3-7c00-4642-9716-cce65efa47c8">

### 情境模式
情境模式是智慧家居系統中的核心功能，旨在根據預設場景或觸發條件，自動協調多個設備的運行，以滿足用戶的日常需求，並提升生活的便利性、效率與舒適度。

透過這些模式，系統能有效整合燈光、空調、智能插座等多種設備，根據使用習慣智能運行，創造個性化的生活體驗。

本系統針對不同的生活情境，設計了六種主要情境模式：工作模式、出門模式、回家模式、節能模式、睡眠模式及起床模式。

<img width="486" alt="image" src="https://github.com/user-attachments/assets/99eab744-2806-4b67-bb01-ecf561151641">
<img width="503" alt="image" src="https://github.com/user-attachments/assets/5d99d093-0029-48ec-aa9e-eda9d7b26671">

### 歷史紀錄查詢
點擊主畫面右上角的「三個點」按鈕，選擇「設備歷史紀錄查詢」，即可查閱設備的相關歷史紀錄。若需查看更多詳細資訊，點擊「顯示更多資訊」即可進一步了解設備查看到更完整的歷史紀錄。

<img width="479" alt="image" src="https://github.com/user-attachments/assets/1cfa0104-5c3f-4ce0-897a-74eb4b6e32f3">
<img width="507" alt="image" src="https://github.com/user-attachments/assets/53e881c6-5520-40c2-a571-7b39d418ecd5">

## Graph
### 系統架構圖
<img width="867" alt="image" src="https://github.com/user-attachments/assets/cb459206-a2f3-46c5-81ef-6468c47bff10">

### 流程圖
- 登入 APP
	- <img width="355" alt="image" src="https://github.com/user-attachments/assets/ec78f54a-3019-4932-aae5-49066a3d4841">

- 新增裝置
	- <img width="250" alt="image" src="https://github.com/user-attachments/assets/65fa40f2-6e8c-4690-b898-18b45ee31f9e">

- 聊天機器人
	- <img width="728" alt="image" src="https://github.com/user-attachments/assets/98b955c6-5ae6-4a85-9f46-e44a6c7ea387">
### Use Case
- 掃描裝置
	- <img width="850" alt="image" src="https://github.com/user-attachments/assets/222ca5b5-ebe5-4968-b74f-6916a55d5d7f">

## 如何和 tapo 溝通
### 觀察的方法
- packet sniffing
    - 攔截 tapo app 和 device 溝通的封包並觀察內容
- reverse engineering
    - 將 tapo app 的 `.apk` 反編譯成 java source code
### tapo app
- tapo 中，有部分裝置會使用 http 和 app 溝通，因此我們可以觀察封包的內容，並嘗試利用我們建立的 http request 而不是 tapo app 和裝置溝通
1. handshake request : POST `http://<device-ip>/app`
    - body
        ```java=
        {
          "method": "handshake",
          "params": {
            "key": "-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCiHkY5laTugGN1Hf/sBHiiw6mnnkohmvVHHHGJqwRx59RjQaL/SPBoLpeNRgN3B/uykzYTLUVMpTcWSZHsS6FfhdoOkJ1B6nit6nheIfltbP99uJduP1JQ44S9dqUr73w++Lpl6TKrzK3KOc5z/vc9xmqiKK6PYbFZu2evCsL19wIDAQAB-----END PUBLIC KEY-----\n"
          },
          "requestTimeMils": 0
        }
        ```
    - 實作 key 的 java source code : 利用 RSA 產生非對稱式加密的 public/private key，再利用 base64 編碼後傳輸
        ```java=
        public void mo35029c() {
            KeyPairGenerator instance = KeyPairGenerator.getInstance("RSA");
            instance.initialize(1024, new SecureRandom());
            KeyPair generateKeyPair = instance.generateKeyPair();
            String str = new String(Base64.encode(((RSAPublicKey) generateKeyPair.getPublic()).getEncoded(), 0));
            String str2 = new String(Base64.encode(((RSAPrivateKey) generateKeyPair.getPrivate()).getEncoded(), 0));
            this.f20965b.put(0, str);
            this.f20965b.put(1, str2);
        }
        ```
2. authentication request
    - 將 tapo app 的帳號密碼給該 device，device 會再去確認是否可以登入
    - request body
        ```java=
        {
          "method": "login_device",
          "params": {
            "password": "ITcyNjU....",
            "username": "MzhhNTk2NT..."
          },
          "requestTimeMils": 0
        }
        ```
4. data request
    - 可以開始傳輸資料做 device 設定
    - request body
        ```=
        {
          "method": "set_device_info",
          "params": {
            "device_on": false
          },
          "requestTimeMils": 1602840338865,
          "terminalUUID": "88-54-DE-AD-52-E1"
        }
        ```
### plugp100
- `plugp100` : 目前此 custom component 實作了 tapo 部分裝置的搜尋和控制（新增裝置到 HA, 更改裝置狀態）的功能
- 搜尋問題
    1. 有時候會找不到全部的 device：後來發現因此 component 使用 udp broadcast 來尋找 device，但是在指定的 timeout 時間內，udp socket 不一定會接受到所有 device 的 response
    2. 找到無法控制的 device ：因為新出的 tapo device 的新版 firmware 會使用不同 protocol（從 http 變 https）和 tapo app 溝通，但是此情況下 plugp100 仍會顯示新出的 tapo device，但該 tapo device 無法用 plugp100 目前提供的控制方式（http）讓該 device 連接到 home assistant
- 解決方法
    - 利用 `ping` 和 plugp100 提供的控制方式寫一個偵測和新增 tapo device 的功能解決上述兩個問題
    - 利用 multithreading 加速尋找的效能
### ref
- https://k4czp3r.xyz/blog/post/reverse-engineering-tp-link-tapo
- https://github.com/petretiandrea/plugp100/blob/main/plugp100/discovery/tapo_discovery.py

### 專題分工
- 楊于葳：前端開發、場景佈置
- 蔣馥安：後端開發、Linux Server 維運&管理、硬體實作
- 陳維德：後端開發
- 謝欣秀：撰寫總審文件、製作簡報
- 邱靖恩：設計系統 UI、製作宣傳影片和海報
- 廖書嫻：設計系統 UI、製作宣傳影片和海報

### API
- note
  - 只要有關於會爬取 home assistant web 的資料的 API，大約會等 10s(現在沒有爬蟲了) 
- testAPI.py
- GET `api/history_data`
  - 回傳所有開關的設備的歷史資訊
    ```
    import requests

    url = 'http://localhost:8122/api/history_data'
    headers = {
	      'Content-Type': 'application/json'
    }

    response = requests.get(url)
    print(response.json())
    ```
- POST `api/history_data`
  - 回傳特定開關的設備的歷史資訊
    ```
    # entity_id:ENTITY_ID(替換成實體ID)
    import requests

    url = 'http://localhost:8122/api/history_data'
    headers = {
	'Content-Type': 'application/json'
    }

    data={
	'entity_id': ENTITY_ID
    }

    response = requests.post(url, headers=headers, json=data)
    print(response.json())
    ```
- GET `api/turn_gate`
  - 回傳所有開關的設備的資訊
    ```
    import requests

    url = 'http://localhost:8122/api/turn_gate'
    headers = {
	'Content-Type': 'application/json'
    }

    response = requests.get(url)
    print(response.json())
    ```
- GET `api/turn_gate/sensor`(light、switch)
  - 回傳特定設備的資訊
    ```
    import requests

    url = 'http://localhost:8122/api/turn_gate/sensor'
    headers = {
	'Content-Type': 'application/json'
    }

    response = requests.get(url)
    print(response.json())
    ```
- POST `api/turn_gate`
  - 開啟/關閉 所有開關的設備
    ```
    # state:'on' or 'ofF'
    # entity_id:'all' or ENTITY_ID(替換成實體ID)
    url = 'http://localhost:8122/api/turn_gate'
    headers = {
	'Content-Type': 'application/json'
    }

    data={
        'state': 'on',
	'entity_id': ENTITY_ID
    }
    
    response = requests.post(url, headers=headers, json=data)
    print(response.json())
    ```
- POST `api/automation/switch`(light)
  - 在某個時間點開啟/關閉 
    ```
    # entity_id:ENTITY_ID
    # state:'on' or 'ofF'
    # triggerTime:'HH:MM:SS'
    import requests
    
    url = 'http://localhost:8122/api/automation/switch'
    headers = {
	'Content-Type': 'application/json'
    }

    data={
        "entity_id": ENTITY_ID,
	"state": "off",
	"triggerTime": "17:00:00"
    }
    
    response = requests.post(url, headers=headers, json=data)
    print(response.json())
    ```
- POST `api/conversation`
  - 使用HA助理 
    ```
    # chatText:對話內容
    import requests

    url = 'http://localhost:8122/api/conversation'
    headers = {
        'Content-Type': 'application/json'
    }
    data={
        'chatText': TEXT
    }
    
    response = requests.post(url, headers=headers, json=data)
    print(response.json())
    ```
- POST `api/automation`
	- 使用HA助理 
    ```
    import requests

    url = 'http://localhost:8122/api/automation'
    headers = {
        'Content-Type': 'application/json'
    }
    data={
        "entity_id": "switch.your_switch_id",
  	"state": "on",
  	"triggerTime": "14:30:00"
    }
    
    response = requests.post(url, headers=headers, json=data)
    print(response.json())
    ```
- POST `api/light_control/brightness`
 	- 控制電燈亮度
    ```
    import requests

    url = 'http://localhost:8122/api/light_control/brightness'  # 替換為你的 API 端點
    headers = {
        'Content-Type': 'application/json'
    }

    data = {
        "entity_id": "light.your_light_id",  # 替換為你的燈泡實體 ID
        "brightness": 200  # 設定亮度值，範圍是 0 到 255
    }

    response = requests.post(url, headers=headers, json=data)

    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    ```
- POST `api/light_control/color_temp`
  	- 控制電燈色溫
    ```
    import requests

    url = 'http://localhost:8122/api/light_control/color_temp'  # 替換為你的 API 端點
    headers = {
        'Content-Type': 'application/json'
    }

    data = {
    "entity_id": "light.your_light_id",  # 替換為你的燈泡實體 ID
    "color_temp_kelvin": 3000  # 設定色溫值，以開爾文（Kelvin）為單位
    }

    response = requests.post(url, headers=headers, json=data)

    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    ```
- POST `api/light_control/color`
  	- 控制電燈顏色
    ```
    import requests

    url = 'http://localhost:8122/api/light_control/color'  # 替換為你的 API 端點
    headers = {
        'Content-Type': 'application/json'
    }

    data = {
        "entity_id": "light.your_light_id",  # 替換為你的燈泡實體 ID
        "rgb_color": [255, 100, 100]  # 設定 RGB 顏色值，範圍是 0 到 255 的三個整數組成的數組
    }

    response = requests.post(url, headers=headers, json=data)

    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    ```
- POST `/api/login`
	```
	>>> import requests
	>>> a = requests.post("http://163.22.17.184:8122/api/login", json={'account' : 'test', 'password' : '123'})
	>>> a.text
	'{"success":true}'	
	```
## Prerequisite
- python3
- node : v16 up
## Usage
- clone repo
  - `git clone https://github.com/Anna0131/HomeAssisstantIntegration.git`

- Create ssh tunnel (On Home Assistant Web Terminal)
  - `cd HaWebTunnelling`
  - `python3 main.py &`
- Create API Server
  - `cd API`
  - `node node_modules\puppeteer\install.mjs`
  - `node index.js`
  - API Server is open on 127.0.0.1:8122
