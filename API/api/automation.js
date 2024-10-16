const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();


const HOME_ASSISTANT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI4OTI2YzE0OTI2YzY0ZTBmYWQ5MGJhNDc1YjBkYTM2NiIsImlhdCI6MTcyMjI0MjAwNiwiZXhwIjoyMDM3NjAyMDA2fQ.DfwflG8zTXQOy5QCy_xn1QjPApSSgqKFV4bYNzpyAjY';
const HA_URL = 'http://163.22.17.116:8123';

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
// 創建每周定時自動化
async function createWeeklyAutomation(automationConfig) {
    try {
        const randomAutomationId = generateUniqueAutomationId();
        const response = await fetchWithAuth(`${HA_URL}/api/config/automation/config/${randomAutomationId}`, {
            method: 'POST',
            body: JSON.stringify(automationConfig),
        });

        return response;
    } catch (error) {
        console.error('創建每周定時自動化失敗:', error);
        throw error;
    }
}
// 創建一次性自動化
async function createOneTimeAutomation(automationConfig) {
    try {
        const randomAutomationId = generateUniqueAutomationId();
        const response = await fetchWithAuth(`${HA_URL}/api/config/automation/config/${randomAutomationId}`, {
            method: 'POST',
            body: JSON.stringify(automationConfig),
        });

        return response;
    } catch (error) {
        console.error('創建一次性自動化失敗:', error);
        throw error;
    }
}
function generateUniqueAutomationId() {
    const timestamp = Date.now(); // 獲取當前時間戳
    const randomNum = Math.floor(Math.random() * 100000); // 生成隨機數
    return `automation_${timestamp}_${randomNum}`;
}
router.post('/switch', async function(req, res) {
    const { entity_id, state, triggerTime } = req.body;
    //檢查triggerTime格式: HH:MM:SS
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    if (!timeRegex.test(triggerTime)) {
        return res.status(400).json({ success: false, message: "無效的時間格式" });
    }

    let Service;
    if (state === 'on') {
        Service = "switch.turn_on";
    } else if (state === 'off') {
        Service = "switch.turn_off";
    } else {
        return res.status(400).json({ success: false, message: "無效的狀態" });
    }

    const automationConfig = {
        alias: "一次性控制插座",
        description: `在指定時間${state === 'on' ? '打開' : '關閉'}插座`,
        trigger: {
            platform: "time",
            at: triggerTime
        },
        action: [
            {
                service: Service,
                target: {
                    entity_id: entity_id
                }
            }
        ],
        mode: "single"
    };

    try {
        const result = await createOneTimeAutomation(automationConfig);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: "創建一次性自動化失敗: " + error.message });
    }
});

router.post('/light', async function(req, res) {
    const { entity_id, state, triggerTime } = req.body;
    //檢查triggerTime格式: HH:MM:SS
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    if (!timeRegex.test(triggerTime)) {
        return res.status(400).json({ success: false, message: "無效的時間格式" });
    }
    let Service;
    if (state === 'on') {
        Service = "light.turn_on";
    } else if (state === 'off') {
        Service = "light.turn_off";
    } else {
        return res.status(400).json({ success: false, message: "無效的狀態" });
    }
    const automationConfig = {
        alias: "一次性控制燈光",
        description: `在指定時間${state === 'on' ? '打開' : '關閉'}燈光`,
        trigger: {
            platform: "time",
            at: triggerTime
        },
        action: [
            {
                service: Service,
                target: {
                    entity_id: entity_id,
                    
                }
            }
        ],
        mode: "single"
    };
    try {
        const result = await createOneTimeAutomation(automationConfig);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: "創建一次性自動化失敗: " + error.message });
    }
});

// 將 daysOfWeek 轉換為對應的星期名稱
function getWeekdayNames(daysOfWeek) {
    const weekdayNames = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    return daysOfWeek.map(day => weekdayNames[day]).join('、');
}

// 新增每周定時開啟 switch 的路由
router.post('/weekly-switch', async function(req, res) {
    const { entity_id, state, daysOfWeek, triggerTime } = req.body;
    //檢查triggerTime格式: HH:MM:SS
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    if (!timeRegex.test(triggerTime)) {
        return res.status(400).json({ success: false, message: "無效的時間格式" });
    }

    // 檢查 daysOfWeek 是否為數組
    if (!Array.isArray(daysOfWeek) || daysOfWeek.some(day => day < 0 || day > 6)) {
        return res.status(400).json({ success: false, message: "無效的天數格式" });
    }

    let Service;
    if (state === 'on') {
        Service = "switch.turn_on";
    } else if (state === 'off') {
        Service = "switch.turn_off";
    } else {
        return res.status(400).json({ success: false, message: "無效的狀態" });
    }

    const triggers = daysOfWeek.map(day => ({
        platform: "time",
        at: triggerTime,
        weekday: day
    }));

    const weekdayNames = getWeekdayNames(daysOfWeek);

    const automationConfig = {
        alias: "每周定時控制插座",
        description: `在每周的${weekdayNames} ${triggerTime} ${state === 'on' ? '打開' : '關閉'}插座`,
        trigger: triggers,
        action: [
            {
                service: Service,
                target: {
                    entity_id: entity_id
                }
            }
        ],
        mode: "single"
    };

    try {
        const result = await createWeeklyAutomation(automationConfig);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: "創建每周定時自動化失敗: " + error.message });
    }
});
// 新增每周定時開啟 light 的路由
router.post('/weekly-light', async function(req, res){
    const { entity_id, state, daysOfWeek, triggerTime } = req.body;
    //檢查triggerTime格式: HH:MM:SS
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    if (!timeRegex.test(triggerTime)) {
        return res.status(400).json({ success: false, message: "無效的時間格式" });
    }

    // 檢查 daysOfWeek 是否為數組
    if (!Array.isArray(daysOfWeek) || daysOfWeek.some(day => day < 0 || day > 6)) {
        return res.status(400).json({ success: false, message: "無效的天數格式" });
    }

    let Service;
    if (state === 'on') {
        Service = "light.turn_on";
    } else if (state === 'off') {
        Service = "light.turn_off";
    } else {
        return res.status(400).json({ success: false, message: "無效的狀態" });
    }

    const triggers = daysOfWeek.map(day => ({
        platform: "time",
        at: triggerTime,
        weekday: day
    }));

    const weekdayNames = getWeekdayNames(daysOfWeek);

    const automationConfig = {
        alias: "每周定時控制燈泡",
        description: `在每周的${weekdayNames} ${triggerTime} ${state === 'on' ? '打開' : '關閉'}燈泡`,
        trigger: triggers,
        action: [
            {
                service: Service,
                target: {
                    entity_id: entity_id
                }
            }
        ],
        mode: "single"
    };

    try {
        const result = await createWeeklyAutomation(automationConfig);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: "創建每周定時自動化失敗: " + error.message });
    }
});

// 新增查看目前所有自動化
router.get('/', async function(req, res) {
    try {
        const response = await fetchWithAuth(`${HA_URL}/api/states`, {
            method: 'GET'
        });

        const automations = response.filter(state => state.entity_id.startsWith('automation.'));
        res.json({ success: true, data: automations });
        console.log(automations);
    } catch (error) {
        res.status(500).json({ success: false, message: "獲取自動化失敗: " + error.message });
    }
});

// 新增刪除特定自動化
// router.delete('/:automation_id', async function(req, res) {
//     const { automation_id } = req.params;
//     try {
//         const response = await fetchWithAuth(`${HA_URL}/api/config/automation/config/${automation_id}`, {
//             method: 'DELETE'
//         });
//         res.json({ success: true, data: response });
//     } catch (error) {
//         res.status(500).json({ success: false, message: "刪除自動化失敗: " + error.message });
//     }
// });

module.exports = router;