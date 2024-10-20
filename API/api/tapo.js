const express = require('express');
const { exec } = require('child_process');
const router = express.Router();

const TAPO_DISCOVER_SCRIPT = '../API/utilities/tapo/scan_ip.py';
const TAPO_ADD_DEVICE_SCRIPT = '../API/utilities/tapo/tapo_connect.py';

// 發現 Tapo 設備
router.get('/discover', async function(req, res) {
    // console.log(`python3 ${TAPO_DISCOVER_SCRIPT}`);
    exec(`python3 ${TAPO_DISCOVER_SCRIPT}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`執行錯誤: ${error.message}`);
            return res.status(500).json({ success: false, message: `發現設備失敗: ${error.message}` });
        }
        if (stderr) {
            console.error(`標準錯誤: ${stderr}`);
            return res.status(500).json({ success: false, message: `發現設備失敗: ${stderr}` });
        }
        try {
            const devices = JSON.parse(stdout);
            res.json({ success: true, message:devices });
        } catch (parseError) {
            console.error(`解析錯誤: ${parseError.message}`);
            res.status(500).json({ success: false, message: `解析設備數據失敗: ${parseError.message}` });
        }
    });
});

// 添加 Tapo 設備
router.post('/add_device', async function(req, res) {
    // const { host, username, password } = req.body;
    // exec(`python ${TAPO_ADD_DEVICE_SCRIPT} ${host} ${username} ${password}`, (error, stdout, stderr) => {
    const { ip } = req.body;
    exec(`python3 ${TAPO_ADD_DEVICE_SCRIPT} ${ip}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`執行錯誤: ${error.message}`);
            return res.status(500).json({ success: false, message: `添加設備失敗: ${error.message}` });
        }
        if (stderr) {
            console.error(`標準錯誤: ${stderr}`);
            return res.status(500).json({ success: false, message: `添加設備失敗: ${stderr}` });
        }
        console.log(`標準輸出: ${stdout}`);
        res.json({ success: true, message: stdout });
    });
});

module.exports = router;