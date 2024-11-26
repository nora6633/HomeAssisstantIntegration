# HomeAssisstant-Integration
## 系統架構圖
<img width="867" alt="image" src="https://github.com/user-attachments/assets/cb459206-a2f3-46c5-81ef-6468c47bff10">

## 流程圖
- 登入 APP
	- <img width="355" alt="image" src="https://github.com/user-attachments/assets/ec78f54a-3019-4932-aae5-49066a3d4841">

- 新增裝置
	- <img width="250" alt="image" src="https://github.com/user-attachments/assets/65fa40f2-6e8c-4690-b898-18b45ee31f9e">

- 聊天機器人
	- <img width="728" alt="image" src="https://github.com/user-attachments/assets/98b955c6-5ae6-4a85-9f46-e44a6c7ea387">
## 技術說明
- Vue.js： 本系統之前端應用介面使用Vue.js進行設計開發。
  
- Linux Server： 本系統向本校計網中心借用一台有對外IP位址的 Ubuntu 22.04，主要提供以下兩個功能:
	- 反向代理： 採用 Nginx 做 reverse proxy 到 Pi 上面的 node.js server & home assistant web，讓前端網頁可以存取到API。
	- 資料庫：採用 MySQL，存放含帳號密碼等資料。
   
- Access Pointer： 將樹梅派和 IoT devices 部屬於同一個 AP，讓它們在同一區網內便於互相溝通。
  
- IoT Devices： 包含多個品牌的多種 IoT Device。

- Node.JS： 使用 Node.JS 進行資料庫與 Home Assistant 的 RestFul API 串接，並提供 RestFul API 讓前端 Application 可以使用提供的功能（例如：註冊登入、新增裝置）。此外，並利用 iputils 提供的工具（目前使用 ping）搜尋區網內的裝置及其資訊。
  
- Home Assistant：利用官方、非官方的 IoT Integrations 管理不同品牌的 IoT devices，並提供 RestFul API，NodeJS 利用此以提供一些進階的功能（例如：分析資源使用率）
  
- 聊天機器人
	1. 設備狀態查詢與控制
用戶可以透過聊天機器人查詢和控制智慧家庭設備，隨時了解設備狀態並遠程操控。例如用戶可以查詢「我有哪些燈光設備？」或指令「開啟插座」，系統會自動執行相應動作。
	3. 模式設定
系統提供六種自動化模式：回家模式、出門模式、起床模式、睡眠模式、工作模式及節能模式。用戶可以透過聊天機器人快速切換模式，系統會根據預設情景自動控制設備，簡化日常操作。例如，啟用「出門模式」時，系統會自動關閉不必要的設備並提供天氣與行事曆摘要。
	4. 自動化與人性化互動：
	系統支持兩類自動化功能
		- 設備聯動： 某設備狀態變化觸發其他設備操作。
		- 定時功能： 設備按設定時間自動開關。
		同時，系統還提供人性化的互動功能，能回應如「能否讓臥室更明亮一些？」、「哪些設備比較耗電？」等問題，並根據查詢提供實用建議或執行相應動作。

## 系統功能
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

### 結論與未來展望
隨著物聯網（IoT）技術的迅速發展，智慧家居已從一種科技潮流轉變為現代生活中的實際需求，顯著提升了家庭的便利性與互動體驗。

同時，人工智慧（AI）技術的進步進一步強化了智慧家居的效能，使其能更精確地滿足使用者需求。

我們對此領域的研究充滿熱情，並希望在現有技術基礎上，打造出更加符合使用者需求的整合解決方案。

在系統開發過程中，我們經歷了從可行性分析到跨品牌設備整合等多重挑戰，這不僅深化了我們對相關技術的理解，也顯著提升了我們在資料分析與判斷上的能力。

通過多次反覆的討論與測試，我們不斷調整系統功能，確保提供給使用者更高的便利性，同時也在這一過程中增強了團隊的協作能力與專業技能。

經過深入的反思，我們發現系統仍有以下幾個方面值得進一步優化：
1. 設備擴展限制：許多品牌尚未提供客製化新增裝置的功能，使用者因此無法
自由擴充其智慧家居設備，限制了系統的靈活性與未來發展潛力。
2. 雙向溝通不足：部分品牌裝置缺乏雙向溝通支持，導致操作過程中反饋不夠即時，降低了整體使用體驗的流暢性與可靠性。

展望未來，我們希望能與各品牌廠商合作，深入了解其資料傳輸協議與技術架構，進一步提升系統的兼容性與整合能力。

我們的目標是實現一個支援多平台設備新增的整合解決方案，使使用者能輕鬆操作來自不同品牌的智慧家居設備，從而打造出真正以使用者為中心的智慧家居系統，為現代家庭提供更高效、更便捷的智慧化生活體驗。

## Intro
- 建立並整合 Home Assisstant 部分功能，並提供前端需要顯示的資訊
- 使用 Express 建立 API Server，前端只需呼叫 API 即可拿到 Home Assisstant 相關資料
- API 格式須符合 Restful API
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
  - `git clone https://github.com/krixi0131/HomeAssisstantIntegration.git`
- Create ssh tunnel (On Home Assistant Web Terminal)
  - `cd HaWebTunnelling`
  - `python3 main.py &`
- Create API Server
  - `cd API`
  - `node node_modules\puppeteer\install.mjs`
  - `node index.js`
  - API Server is open on 127.0.0.1:8122
## Known issues
- 有時候回傳資料錯誤是因為爬取網頁會不成功：可以嘗試把 crawler.js 的 await sleep 設久一點
## Future Work
- API
  - 感應器歷史資料
  - 設備歷史資料
- 可以寫個 test script test API
## 教學
### 新增 API
1. 到 `index.js` 新增 url route (可以參考 `index.js` 裡面的 `api/turn_gate` and `api/sensor`)
2. 新增處理 request 的 js (可以參考 `api/turn_gate.js` and `api/sensor.js`)
3. 針對新的資料去改寫 `utilities/crawler.js`，不同資料用爬蟲做到解析不同的網頁元素
