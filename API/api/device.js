const router = require('express').Router();
const HA_URL = 'http://163.22.17.116:8123/api/config/config_entries/entry';
const HOME_ASSISTANT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI4OTI2YzE0OTI2YzY0ZTBmYWQ5MGJhNDc1YjBkYTM2NiIsImlhdCI6MTcyMjI0MjAwNiwiZXhwIjoyMDM3NjAyMDA2fQ.DfwflG8zTXQOy5QCy_xn1QjPApSSgqKFV4bYNzpyAjY';

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

router.get('/', async function(req, res) {
    try {
        const response = await fetchWithAuth(`${HA_URL}`, {
            method: 'GET',
        });
		res.json(response);
    }
    catch(e) {
        console.error(e);
        res.status(500).json({ success: false, message: "獲取區域失敗: " + error.message });
    }
});

router.delete('/', async function(req, res) {
    try {
    	const { dev_id } = req.body;
		const HA_URL = `http://163.22.17.116:8123/api/config/config_entries/entry/${dev_id}`
        const response = await fetchWithAuth(`${HA_URL}`, {
            method: 'DELETE',
        });
		res.json(response);
    }
    catch(e) {
        console.error(e);
        res.status(500).json({ success: false, message: "獲取區域失敗: " + error.message });
    }
});

module.exports = router;
