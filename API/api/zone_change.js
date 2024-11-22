const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
const WebSocket = require('ws');

const HOME_ASSISTANT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI4OTI2YzE0OTI2YzY0ZTBmYWQ5MGJhNDc1YjBkYTM2NiIsImlhdCI6MTcyMjI0MjAwNiwiZXhwIjoyMDM3NjAyMDA2fQ.DfwflG8zTXQOy5QCy_xn1QjPApSSgqKFV4bYNzpyAjY';
const HA_URL = 'http://163.22.17.116:8123';
const WS_HA_URL = 'ws://163.22.17.116:8123';

const mysql = require('mysql2');

// 設定 MySQL 連線
const db = mysql.createPool({
    connectionLimit : 5,
    host: '163.22.17.116',
    user: 'test',
    password: 'test#313',
    database: 'home_assistant',
});

// 用於帶有身份驗證的 fetch 請求
async function fetchWithAuth(url, options) {
    options.headers = {
        'Authorization': `Bearer ${HOME_ASSISTANT_TOKEN}`,
        'Content-Type': 'application/json',
        ...options.headers,
    };
    console.log(options, url);
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`HTTP錯誤! 狀態: ${response.status}`);
    }
    return response.json();
}

// 切換區域
router.post('/update_zone', async function(req, res) {
    const { entity_id, new_zone } = req.body;
    console.log(`Post input==>entity_id: ${entity_id}, new_zone: ${new_zone}`);


    /*
	const updateConfig = {
        entity_id: entity_id,
        area_name: new_zone
    };
	*/

	const updateConfig = {
  		"area_id": "wo_shi"
	};

    try {
        const response = await fetchWithAuth(`${HA_URL}/api/v1/devices/1f83866f6e8797f000afebc3d5313d95`, {
            method: 'POST',
            body: JSON.stringify(updateConfig),
        });
        console.log('Home Assistant 回應:', response);
        res.json({ success: true, message: response });
    } catch (error) {
        console.error('切換區域失敗:', error);
        res.status(500).json({ success: false, message: "切換區域失敗: " + error.message });
    }
});

router.get('/', async function(req, res) {
  	const query = `
	SELECT * FROM device;
  	`;
    const conn = await db.getConnection();
    await conn.query(query, (err, result) => {
        if (err) {
			console.error(err);
			res.status(500).json({ success: false, message: err });
        } else {
            res.status(200).json({ message: result});
        }
    });
    conn.release();
})

router.post('/', async function(req, res) {
    const { entity_name, zone } = req.body;
  	const query = `
    INSERT INTO device (name, zone)
    VALUES (?, ?)
	ON DUPLICATE KEY UPDATE zone = ?;
  	`;
    const conn = await db.getConnection();
    conn.query(query, [entity_name, zone, zone], (err, result) => {
        if (err) {
			console.error(err);
			res.status(500).json({ success: false, message: "修改分區失敗" });
        } else {
            res.status(201).json({ message: '修改成功'});
        }
    });
    conn.release();
})

// 獲取所有區域
router.get('/zones', async function(req, res) {
    const socket = new WebSocket(`${WS_HA_URL}/api/websocket`);

    socket.onopen = function (event) {
        console.log('WebSocket connection opened');
        socket.send(
            JSON.stringify({
                type: 'auth',
                access_token: HOME_ASSISTANT_TOKEN,
            })
        );
    };

    socket.onmessage = function (event) {
        const message = JSON.parse(event.data);
        console.log('Received message:', message);

        if (message.type === 'auth_ok') {
            console.log('Authentication successful');
            socket.send(JSON.stringify({ type: 'config/area_registry/list', id: 4 }));
        } else if (message.type === 'result' && message.id === 4) {
            console.log('Received area list:', message.result);
            res.json({ success: true, data: message.result });
            socket.close();
        }
    };

    socket.onerror = function (error) {
        console.error('WebSocket error:', error);
        res.status(500).json({ success: false, message: "獲取區域失敗: " + error.message });
    };

    socket.onclose = function (event) {
        console.log('WebSocket connection closed:', event);
    };
});


// 獲取設備區域
router.get('/device_zones', async function(req, res) {
    try {
        const socket = new WebSocket(`${WS_HA_URL}/api/websocket`)
        let areas = [];
        let devices = [];
        let entities = [];
        socket.onopen = function (event) {
            console.log('WebSocket connection opened');
            socket.send(
                JSON.stringify({
                    type: 'auth',
                    access_token: HOME_ASSISTANT_TOKEN,
                })
            );
        };

        socket.onmessage = function (event) {
            const message = JSON.parse(event.data);
            console.log('Received message:', message);

            if (message.type === 'auth_ok') {
                console.log('Authentication successful');
                socket.send(JSON.stringify({ type: 'config/area_registry/list', id: 4 }));
            } else if (message.type === 'result' && message.id === 4) {
                console.log('Received area list:', message.result);
                areas = message.result;
                socket.send(JSON.stringify({ type: 'config/device_registry/list', id: 5 }));
            } else if (message.type === 'result' && message.id === 5) {
                console.log('Received device list:', message.result);
                devices = message.result; // 定義 devices 變數
                socket.send(JSON.stringify({ type: 'config/entity_registry/list', id: 6 }));
            } else if (message.type === 'result' && message.id === 6) {
                console.log('Received entity list:', message.result);
                entities = message.result;

                // 過濾具有 area_id 的設備和實體
                const devicesWithArea = devices.filter(device => device.area_id);
                const entitiesWithArea = entities.filter(entity => {
                    const device = devices.find(d => d.id === entity.device_id);
                    return device && device.area_id && device.area_id !== null;
                });

                // 構建結果數據
                const result = devicesWithArea.map(device => {
                    const deviceEntities = entitiesWithArea.filter(entity => entity.device_id === device.id).map(entity => entity.entity_id);
                    const area = areas.find(area => area.area_id === device.area_id);
                    return {
                        area_id: device.area_id,
                        area_name: area ? area.name : null,
                        name: device.name,
                        entities: deviceEntities
                    };
                });

                res.json({ success: true, message: result });
                console.log('Result:', result);
                socket.close();
            }
        };
    
        socket.onclose = function (event) {
            // console.log('WebSocket connection closed:', event);
        };
    } catch (error) {
        res.status(500).json({ success: false, message: "獲取區域失敗: " + error.message });
    }
});

module.exports = router;
