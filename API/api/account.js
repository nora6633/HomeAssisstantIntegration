const router = require('express').Router();
const mysql = require('mysql2');

// 設定 MySQL 連線
const db = mysql.createPool({
    connectionLimit : 5,
    host: '163.22.17.116',
    user: 'test',
    password: 'test#313',
    database: 'home_assistant',
});

// 新增 account
router.post('/', async (req, res) => {
    const { account, password } = req.body;
    const sql = 'INSERT INTO `User` (`account`, `password`) VALUES (?, ?)';
    const conn = await db.getConnection();
    await conn.query(sql, [account, password], (err, result) => {
        if (err) {
			console.error(err);
            res.status(500).send('新增失敗');
        } else {
            res.status(201).json({ message: '新增成功', id: result.insertId });
        }
    });
    conn.release();
});

module.exports = router;
