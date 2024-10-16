const router = require('express').Router();
const fetch = require('cross-fetch');
const WebSocket = require('ws');
const HOME_ASSISTANT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI4OTI2YzE0OTI2YzY0ZTBmYWQ5MGJhNDc1YjBkYTM2NiIsImlhdCI6MTcyMjI0MjAwNiwiZXhwIjoyMDM3NjAyMDA2fQ.DfwflG8zTXQOy5QCy_xn1QjPApSSgqKFV4bYNzpyAjY';
const HA_URL = 'http://163.22.17.116:8123';
const WS_HA_URL = 'ws://163.22.17.116:8123/api/websocket';
//local test
// const HOME_ASSISTANT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJmODVkYjkxYTg2MzE0MjNhOGU0NDQyZDFmZmY1ZmRhNSIsImlhdCI6MTcyNjQ3NTU5NSwiZXhwIjoyMDQxODM1NTk1fQ.JMX9kcLbQL15kD22OTqsPVpWZFJcaNDJJrkY8Sidkcc'
// const HA_URL = 'http://homeassistant.local:8123';

async function deleteDevice(device_id) {
    const response = await fetch(`${HA_URL}/api/config/device_registry/${device_id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${HOME_ASSISTANT_TOKEN}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        console.error(`Failed to delete device. Status: ${response.status}`);
        console.error(`Response: ${await response.text()}`);
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return "Device successfully deleted";
}

// 函數來獲取所有設備
async function getAllDevices() {
    try {
        const response = await fetch(`${HA_URL}/api/states`, {
        headers: {
            'Authorization': `Bearer ${HOME_ASSISTANT_TOKEN}`,
            'Content-Type': 'application/json',
        },
        });
        return await response.json();
    }
    catch (error) {
        console.error('Failed to get all devices:', error);
        return [];
    }
  }
// 函數來關閉一個設備
async function turnOffDevice(entityId) {
    await fetch(`${HA_URL}/api/services/homeassistant/turn_off`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HOME_ASSISTANT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        entity_id: entityId,
      }),
    });
  }

// 函數來打開一個設備
async function turnOnDevice(entityId) {
    await fetch(`${HA_URL}/api/services/homeassistant/turn_on`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${HOME_ASSISTANT_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            entity_id: entityId,
          }),
        });
      }
            
// 函數來開關設備
async function turnOfforOnDevices(state, post_entity_id) {
    try {
        if (state !== 'on' && state !== 'off') {
            throw new Error('Invalid state: ' + state);
        }
        if (state === 'toggle') {
            console.log('Toggling a device...');
            
        }
        if (post_entity_id === 'all'){
            const devices = await getAllDevices();
            const controllableDevices = devices.filter(device => 
            device.entity_id.startsWith('light.') || 
            device.entity_id.startsWith('switch.') || 
            device.entity_id.startsWith('climate.')
            );
            if (state === 'off') {
                console.log('Turning off all devices...');
                for (const device of controllableDevices) {
                    await turnOffDevice(device.entity_id);
                    console.log(`Turned off ${device.entity_id}`);
                    }
                
                console.log('All devices have been turned off');
                return { success: true };
                // return await turnOffOrOnAllDevices();
            } 
            else if (state === 'on') {
                console.log('Turning on all devices...');
                for (const device of controllableDevices) {
                    await turnOnDevice(device.entity_id);
                    console.log(`Turned on ${device.entity_id}`);
                }
                console.log('All devices have been turned on');
                return { success: true };
            }
        }
        else if (state === 'off') {
            console.log('Turning off a device...');
            await turnOffDevice(post_entity_id);
            console.log(`Turned off ${post_entity_id}`);
            console.log('The device has been turned off');
            return { success: true };
        }
        else if (state === 'on') {
            console.log('Turning on a device...');
            await turnOnDevice(post_entity_id);
            console.log(`Turned on ${post_entity_id}`);
            console.log('The device has been turned on');
            return { success: true };
        } 
        else {
            throw new Error('Invalid state: ' + state);
        }
    } catch (error) {
        console.error('Error turning off devices:', error);
        return { success: false };
    }
}
// processing request
router.get('/', async function(req, res) {
    try {
		const devices = await getAllDevices();
        const controllableDevices = devices.filter(device => 
        device.entity_id.startsWith('sensor.') ||
        device.entity_id.startsWith('light.') || 
        device.entity_id.startsWith('switch.') || 
        device.entity_id.startsWith('climate.')
        );
        console.log(controllableDevices);
        res.json({success: true, message:controllableDevices});
	// const search = {"type" : "turn_gate", "method" : "get"};
	// const result = await crawler.crawlMapConsole('http://163.22.17.184:8123/lovelace/0', search);
	// console.log(result);
	// res.json(result);
    }
    catch(e) {
	const result = {success : false, message : "sth going wrong : " + e};
	console.error(e);
	res.json(result);
    }
});

router.get('/sensor', async function(req, res) {
    try {
		const devices = await getAllDevices();
        const controllableDevices = devices.filter(device => 
        device.entity_id.startsWith('sensor.')
        );
        console.log(controllableDevices);
        res.json({success: true, message:controllableDevices});
    }
    catch(e) {
	const result = {success : false, message : "sth going wrong : " + e};
	console.error(e);
	res.json(result);
    }
});

router.get('/light', async function(req, res) {
    try {
		const devices = await getAllDevices();
        const controllableDevices = devices.filter(device => 
        device.entity_id.startsWith('light.')
        );
        console.log(controllableDevices);
        res.json({success: true, message:controllableDevices});
    }
    catch(e) {
	const result = {success : false, message : "sth going wrong : " + e};
	console.error(e);
	res.json(result);
    }
});

router.get('/switch', async function(req, res) {
    try {
		const devices = await getAllDevices();
        const controllableDevices = devices.filter(device => 
        device.entity_id.startsWith('switch.')
        );
        console.log(controllableDevices);
        res.json({success: true, message:controllableDevices});
    }
    catch(e) {
	const result = {success : false, message : "sth going wrong : " + e};
	console.error(e);
	res.json(result);
    }
});

router.get('/climate', async function(req, res) {
    try {
		const devices = await getAllDevices();
        const controllableDevices = devices.filter(device => 
        device.entity_id.startsWith('climate.')
        );
        console.log(controllableDevices);
        res.json({success: true, message:controllableDevices});
    }
    catch(e) {
	const result = {success : false, message : "sth going wrong : " + e};
	console.error(e);
	res.json(result);
    }
});

router.post('/', async function(req, res) {
    const { state, entity_id } = req.body;
    console.log(req.body);
    console.log(`Post input==>State: ${state}, Entity ID: ${entity_id}`);
    try {
        const result = await turnOfforOnDevices(state, entity_id);        
        res.json({success: true, message:result});
	// const search = {"type" : "turn_gate", "method" : "post"};
	// const result = await crawler.crawlMapConsole('http://163.22.17.184:8123/lovelace/0', search);
	// console.log(result);
	// res.json(result);
    }
    catch(e) {
	const result = {success: false, message : "sth going wrong : " + e};
	console.error(e);
	res.json(result);
    }
});

router.delete('/', async function(req, res) {
    const { device_id } = req.body;

    if (!device_id) {
        return res.status(400).json({ success: false, message: "缺少必要的參數" });
    }

    const socket = new WebSocket(WS_HA_URL);

    socket.onopen = function () {
        console.log('WebSocket connection opened');
        socket.send(JSON.stringify({
            type: 'auth',
            access_token: HOME_ASSISTANT_TOKEN
        }));
    };

    socket.onmessage = function (event) {
        const message = JSON.parse(event.data);
        console.log('Received message:', message);

        if (message.type === 'auth_ok') {
            console.log('Authentication successful');
            socket.send(JSON.stringify({
                id: 1,
                type: 'config/device_registry/remove',
                device_id: device_id
            }));
        } else if (message.type === 'result' && message.id === 1) {
            if (message.success) {
                console.log('Device removed successfully');
                res.json({ success: true, message: 'Device removed successfully' });
            } else {
                console.error('Failed to remove device:', message.error);
                res.status(500).json({ success: false, message: 'Failed to remove device: ' + message.error.message });
            }
            socket.close();
        }
    };

    socket.onerror = function (error) {
        console.error('WebSocket error:', error);
        res.status(500).json({ success: false, message: 'WebSocket error: ' + error.message });
    };

    socket.onclose = function (event) {
        // console.log('WebSocket connection closed:', event);
    };
});
module.exports = router;
