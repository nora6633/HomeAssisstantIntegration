const router = require('express').Router();
const root_account = "test";
const root_password = "123";
const mysql = require('mariadb');

// 設定 MySQL 連線
const db = mysql.createPool({
    connectionLimit : 5,
    host: '163.22.17.116',
    user: 'test',
    password: 'test#313',
    database: 'home_assistant',
});

router.post('/', async function(req, res) {
    let conn;
    try {
        const { account, password } = req.body;
        conn = await db.getConnection();
    	const result = await conn.query('SELECT COUNT(*) FROM `User` where account = ? and password = ?', [account, password]);
	if (result[0]['COUNT(*)'] > 1)
            res.json({ success: true});
	else 
	    res.status(401).json({success: false, message: "unauthorized"});
    } catch (e) {
        console.error(e);
        res.status(500).json('登入失敗');
    }
    finally {
        conn.release();
    }
});

module.exports = router;
