const router = require('express').Router();
const root_account = "test";
const root_password = "123";
const mysql = require('mysql2');

// 設定 MySQL 連線
const db = mysql.createConnection({
    host: '163.22.17.116',
    user: 'test',
    password: 'test#313',
    database: 'home_assistant',
	keepAliveInitialDelay: 10000, // 0 by default.
	enableKeepAlive: true, // false by default.
});

// 建立資料庫連線
db.connect((err) => {
    if (err) {
        console.error('資料庫連線失敗:', err);
        return;
    }
    console.log('已成功連線到 MySQL 資料庫');
});

router.post('/', async function(req, res) {
    const { account, password } = req.body;
    try {
    	db.query('SELECT COUNT(*) FROM `User` where account = ? and password = ?', [account, password], (err, results) => {
        	if (err) {
            	res.status(500).send('查詢失敗');
        	} else {
				console.log(results);
				if (results[0]['COUNT(*)'] > 1)
            		res.json({ success: true});
				else 
	    			res.status(401).json({success: false, message: "unauthorized"});
        	}
    	});
    } catch (e) {
        const result = { success: false, message: "Something went wrong: " + e.message };
        console.error(e);
        res.status(500).json(result);
    }   
});

module.exports = router;
