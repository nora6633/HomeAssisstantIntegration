const router = require('express').Router();
const root_account = "test";
const root_password = "123";

router.post('/', async function(req, res) {
    const { account, password } = req.body;
    try {
	if (account == root_account && password == root_password)
            res.json({ success: true});
	else 
	    res.status(401).json({success: false, message: "unauthorized"});
    } catch (e) {
        const result = { success: false, message: "Something went wrong: " + e.message };
        console.error(e);
        res.status(500).json(result);
    }   
});

module.exports = router;
