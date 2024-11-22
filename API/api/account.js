const router = require('express').Router();
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

// 新增 account
router.post('/', (req, res) => {
    const { account, password } = req.body;
    const sql = 'INSERT INTO `User` (`account`, `password`) VALUES (?, ?)';
    db.query(sql, [account, password], (err, result) => {
        if (err) {
			console.error(err);
            res.status(500).send('新增失敗');
        } else {
            res.status(201).json({ message: '新增成功', id: result.insertId });
        }
    });
});

module.exports = router;
