const router = require('express').Router();
const fetch = require('cross-fetch');
// const crawler = require('./../utilities/crawler.js');
// const fetch = require('node-fetch');
// processing request
const HOME_ASSISTANT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI4OTI2YzE0OTI2YzY0ZTBmYWQ5MGJhNDc1YjBkYTM2NiIsImlhdCI6MTcyMjI0MjAwNiwiZXhwIjoyMDM3NjAyMDA2fQ.DfwflG8zTXQOy5QCy_xn1QjPApSSgqKFV4bYNzpyAjY';
const HA_URL = 'http://163.22.17.116:8123';

// Home Assistant Conversation API
async function conversationProcess(chatText, conversationId = null) {
    try {
        const requestBody = {
            text: chatText,
            language: 'zh-tw'  // or any other supported language
        };

        if (conversationId) {
            requestBody.conversation_id = conversationId;
        }

        const response = await fetch(`${HA_URL}/api/conversation/process`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HOME_ASSISTANT_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to process conversation:', error);
        throw error;
    }
}

router.post('/', async function(req, res) {
    const { chatText, conversationId } = req.body;
    console.log(`Post input==>text: ${chatText}`);
    try {
        const result = await conversationProcess(chatText, conversationId);
        res.json({ success: true, message: result });
    } catch (e) {
        const result = { success: false, message: "Something went wrong: " + e.message };
        console.error(e);
        res.status(500).json(result);
    }   
});

module.exports = router;