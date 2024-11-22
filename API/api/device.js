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
	const msg = await response.json();
        throw new Error(`HTTP錯誤! 狀態: ${response.status}, msg: ${JSON.stringify(msg)}`);
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

router.get('/discovery', async function(req, res) {
    try {
	const spawn = require("child_process").spawn;	
	const pythonScript = "/root/.ssh/HomeAssisstantIntegration/API/utilities/tapo/scan_ip.py"
	const pythonProcess = spawn('python3', [pythonScript]);

        return new Promise((resolve, reject) => { // 包裝成 Promise

            pythonProcess.stderr.on('data', (data) => {
		//console.error('stderr', data.toString());
                resolve([false]);
            });

            pythonProcess.on('exit', (code) => {
                //console.log(`child process exited with code ${code}`);
                if (code !== 0) {
                    reject(new Error(`child process exited with code ${code}`)); // 非 0 退出代碼表示錯誤
                }
            });

            pythonProcess.on('error', (err) => {
                //console.error(err);
                reject(err); // 子進程啟動失敗
            });

            pythonProcess.stdout.on('data', (data) => {
		console.log('stdout', data.toString());
		if (data.toString().includes('tapo_ips') && !data.toString().includes('Cannot connect to host')) {
		    let result = data.toString().split('tapo_ips')[0];	
		    if (result != "") {
			// adjust data format from python output to convert to json format
			let key_index = [];
			for (let i = 0;i < result.length;i++) {
			    if (result[i] == ":" && result[i+2] == '"') {
				key_index.push(i-1);
				key_index.push(i-15);
			    }
			}
			let new_result = '';
			for (let i = 0;i < result.length;i++) {
			    if (key_index.includes(i)) {
				new_result += '"';
			    }
			    else {
				new_result += result[i];
			    }
			}
			//console.log("return msg", new_result, key_index);
			return res.json(JSON.parse(new_result))
	            }
		}
                resolve([true]);
            });
	});
    }
    catch(e) {
        console.error(e);
        res.status(500).json({ success: false, message: "搜尋失敗: " + e.message });
    }
});

router.post('/', async function(req, res) {
    try {
    	const { dev_ip } = req.body;
	let HA_URL = `http://163.22.17.116:8123/api/config/config_entries/flow`
	const response = await fetchWithAuth(`${HA_URL}`, {
            method: 'POST',
	    body:  JSON.stringify({
        	'handler': 'tapo',
        	'show_advanced_options': true
    	    })
	});
	const flow_id = response['flow_id'];
	HA_URL = `http://163.22.17.116:8123/api/config/config_entries/flow/${flow_id}`;
	const username = "annnna6633@gmail.com";
	const password = "a12345678";
	const result = await fetchWithAuth(`${HA_URL}`, {
            method: 'POST',
	    body:  JSON.stringify({
        	'host': dev_ip,
        	'username': username,
		'password': password
    	    })
	});
	res.json(result);
    }
    catch(e) {
        console.error(e);
        res.status(500).json({ success: false, message: "獲取區域失敗: " + e.message });
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
