const router = require('express').Router();
const crawler = require('./../utilities/crawler.js');
const fetch = require('cross-fetch');
// const fetch = require('node-fetch');
// processing request
const HOME_ASSISTANT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI4OTI2YzE0OTI2YzY0ZTBmYWQ5MGJhNDc1YjBkYTM2NiIsImlhdCI6MTcyMjI0MjAwNiwiZXhwIjoyMDM3NjAyMDA2fQ.DfwflG8zTXQOy5QCy_xn1QjPApSSgqKFV4bYNzpyAjY';
const HA_URL = 'http://163.22.17.116:8123';

// 或取特定設備的歷史資料
async function getHistoryData(entityId) {
    try {
        const response = await fetch(`${HA_URL}/api/history/period?filter_entity_id=${entityId}`, {
            headers: {
                'Authorization': `Bearer ${HOME_ASSISTANT_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });
        return await response.json();
    }
    catch (error) {
        console.error('Failed to get history data:', error);
        return [];
    }
}

//取得所有設備的歷史資料
router.get('/', async function(req, res) {
    try {
        const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI4OTI2YzE0OTI2YzY0ZTBmYWQ5MGJhNDc1YjBkYTM2NiIsImlhdCI6MTcyMjI0MjAwNiwiZXhwIjoyMDM3NjAyMDA2fQ.DfwflG8zTXQOy5QCy_xn1QjPApSSgqKFV4bYNzpyAjY";
        
        // 使用 Home Assistant API 進行請求以獲取所有設備狀態
        const response = await fetch('http://163.22.17.184:8123/api/states', {
            headers: { 
                Authorization: 'Bearer ' + apiKey, // 替換為你的實際訪問令牌
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const body = await response.json();
        
        // 過濾家電狀態
        const applianceStates = body.filter(entity => entity.entity_id.startsWith('switch.') || entity.entity_id.startsWith('light.') || entity.entity_id.startsWith('sensor.'));
        
        // 取得每個設備的歷史資料
        const historyPromises = applianceStates.map(async (entity) => {
            const historyResponse = await fetch(`http://163.22.17.184:8123/api/history/period?filter_entity_id=${entity.entity_id}`, {
                headers: { 
                    Authorization: 'Bearer ' + apiKey, 
                    'Content-Type': 'application/json'
                }
            });

            if (!historyResponse.ok) {
                throw new Error(`HTTP error! status: ${historyResponse.status}`);
            }

            const historyData = await historyResponse.json();
            console.log(historyData);
            return { entity_id: entity.entity_id, history: historyData };
        });

        const historyResults = await Promise.all(historyPromises);
        
        console.log(historyResults);
        res.json({success: true, message:historyResults});
    }
    catch(e) {
	const result = {success : false, message : "sth going wrong : " + e};
	console.error(e);
	res.json(result);
    }
});

//取得特定設備的歷史資料
router.post('/', async function(req, res) {
    const { entity_id } = req.body;
    console.log(req.body);
    console.log(`Post input==>Entity ID: ${entity_id}`);
    try {
        const result = await getHistoryData(entity_id); 
        console.log(result);       
        res.json({success: true, message:result});
    }
    catch(e) {
            const result = {success : false, message : "sth going wrong : " + e};
            console.error(e);
            res.json(result);
    }   
    });
module.exports = router;
