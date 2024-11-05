const router = require('express').Router();
const mysql = require('mysql2');

// 設定 MySQL 連線
const db = mysql.createConnection({
    host: 'localhost',
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

// 查詢所有 Hotkey
router.get('/', async function(req, res) {
    db.query('SELECT * FROM Hotkey', (err, results) => {
        if (err) {
            res.status(500).send('查詢失敗');
        } else {
            res.json(results);
        }
    });
});

// 新增 Hotkey
router.post('/', (req, res) => {
    const { uid, key, value, status = 1 } = req.body;
	console.log('insert', uid, key, value, status);
    const sql = 'INSERT INTO Hotkey (`uid`, `key`, `value`, `status`) VALUES (?, ?, ?, ?)';
    db.query(sql, [uid, key, value, status], (err, result) => {
        if (err) {
			console.error(err);
            res.status(500).send('新增失敗');
        } else {
            res.status(201).json({ message: '新增成功', id: result.insertId });
        }
    });
});

// 修改 Hotkey
router.put('/', (req, res) => {
    const { uid, key, value, status } = req.body;
    const sql = 'UPDATE Hotkey SET `value` = ?, `status` = ? WHERE `uid` = ? AND `key` = ?';
    db.query(sql, [value, status, uid, key], (err, result) => {
        if (err) {
            res.status(500).send('修改失敗');
        } else if (result.affectedRows === 0) {
            res.status(404).send('找不到指定的 Hotkey');
        } else {
            res.json({ message: '修改成功' });
        }
    });
});

// 刪除 Hotkey
router.delete('/', (req, res) => {
    const { uid, key } = req.body;
    const sql = 'DELETE FROM Hotkey WHERE `uid` = ? AND `key` = ?';
    db.query(sql, [uid, key], (err, result) => {
        if (err) {
            res.status(500).send('刪除失敗');
        } else if (result.affectedRows === 0) {
            res.status(404).send('找不到指定的 Hotkey');
        } else {
            res.json({ message: '刪除成功' });
        }
    });
});

module.exports = router;
