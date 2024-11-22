const router = require('express').Router();
const mysql = require('mariadb');

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
    let conn;
    try {
        const { account, password } = req.body;
        const sql = 'INSERT INTO `User` (`account`, `password`) VALUES (?, ?)';
        conn = await db.getConnection();
        const result = await conn.query(sql, [account, password]);
        res.status(201).json({ message: '新增成功', id: result.insertId.toString() });
    }
    catch(e) {
        console.error(e);
        res.status(500).send('新增失敗');
    }
    finally {
        conn.release();
    }
   
});

module.exports = router;
