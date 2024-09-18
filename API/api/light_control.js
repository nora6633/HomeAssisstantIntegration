const router = require('express').Router();
const fetch = require('cross-fetch');

//local test
// const HOME_ASSISTANT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJmODVkYjkxYTg2MzE0MjNhOGU0NDQyZDFmZmY1ZmRhNSIsImlhdCI6MTcyNjQ3NTU5NSwiZXhwIjoyMDQxODM1NTk1fQ.JMX9kcLbQL15kD22OTqsPVpWZFJcaNDJJrkY8Sidkcc'
// const HA_URL = 'http://homeassistant.local:8123';

const HOME_ASSISTANT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI4OTI2YzE0OTI2YzY0ZTBmYWQ5MGJhNDc1YjBkYTM2NiIsImlhdCI6MTcyMjI0MjAwNiwiZXhwIjoyMDM3NjAyMDA2fQ.DfwflG8zTXQOy5QCy_xn1QjPApSSgqKFV4bYNzpyAjY';
const HA_URL = 'http://163.22.17.184:8123';
router.get('/', async function(req, res) {
	try {
		res.json({ success: true, message: "light control api" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}
);
router.post('/brightness', async function(req, res) {
	const { entity_id, brightness } = req.body;

	const headers = {
		'Authorization': `Bearer ${HOME_ASSISTANT_TOKEN}`,
		'Content-Type': 'application/json'
	};

	const body = {
		entity_id: entity_id,
		brightness: brightness,
	};

	try {
		const response = await fetch(`${HA_URL}/api/services/light/turn_on`, {
			method: 'POST',
			headers: headers,
			body: JSON.stringify(body)
		});
		// console.log(body);
		console.log(response);
		if (!response.ok) {
			throw new Error('Failed to control the light');
		}

		const data = await response.json();
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});
router.post('/color_temp', async function(req, res) {
	const { entity_id, color_temp_kelvin } = req.body;
	const headers = {
		'Authorization': `Bearer ${HOME_ASSISTANT_TOKEN}`,
		'Content-Type': 'application/json'
	};

	const body = {
		entity_id: entity_id,
		color_temp_kelvin: color_temp_kelvin,
	};

	try {
		const response = await fetch(`${HA_URL}/api/services/light/turn_on`, {
			method: 'POST',
			headers: headers,
			body: JSON.stringify(body)
		});
		// console.log(body);
		console.log(response);
		if (!response.ok) {
			throw new Error('Failed to control the light');
		}

		const data = await response.json();
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});
router.post('/color', async function(req, res) {
	const { entity_id, rgb_color } = req.body;

	const headers = {
		'Authorization': `Bearer ${HOME_ASSISTANT_TOKEN}`,
		'Content-Type': 'application/json'
	};

	const body = {
		entity_id: entity_id,
		"rgb_color": rgb_color
	};

	try {
		const response = await fetch(`${HA_URL}/api/services/light/turn_on`, {
			method: 'POST',
			headers: headers,
			body: JSON.stringify(body)
		});
		// console.log(body);
		console.log(response);
		if (!response.ok) {
			throw new Error('Failed to control the light');
		}

		const data = await response.json();
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;