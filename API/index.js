//基於 Node.js Express 的主要設定檔
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//bodyParser: 解析 HTTP 請求的 body
app.use(bodyParser.urlencoded({ extended: false }));
//express.json: 處理 JSON 資料
app.use(express.json());
app.use(cookieParser()); //解析 HTTP 請求的 cookie
app.use(cors({ origin: true, credentials: true }));

// routing
// api
// app.use("/api/sensor", require("./api/sensor.js"));
app.use("/api/turn_gate", require("./api/turn_gate.js"));
app.use("/api/history_data", require("./api/history_data.js"));
app.use("/api/conversation", require("./api/conversation.js"));
app.use("/api/automation", require("./api/automation.js"));
app.use("/api/light_control", require("./api/light_control.js"));
app.use("/api/login", require("./api/login.js"));
app.use("/api/zone_change", require("./api/zone_change.js"));
app.use("/api/tapo", require("./api/tapo.js"));
app.use("/api/hot_key", require("./api/hot_key.js"));
app.use("/api/account", require("./api/account.js"));
app.use("/api/device", require("./api/device.js"));

// static files
app.use("/js", express.static("./js"));
app.use("/css", express.static("./css"));

app.listen(8125, () => {
	console.log("Node server is running..");
});
