const Task = require("../models/task");
const WebAction = require("../models/web_actions");
const ping = require("net-ping");
const traceroute = require("traceroute");
let cmd = require("node-cmd");

exports.web_action = async function (req, res) {
	const webaction = new WebAction(req.body);
	let fecha = new Date();
	webaction.date = fecha.toLocaleString();
	let session = ping.createSession();
	let status = false;
	if (!webaction.ip) webaction.ip = "No IP";
	if (webaction.tool === "Ip Config") {
		try {
			cmd.run(`ipconfig /all`, async function (err, data, stderr) {
				webaction.status = true;
				webaction.result = data;
				await webaction.save().then(res.redirect("../webtools"));
			});
		} catch (error) {
			console.log(error);
		}
	} else if (webaction.tool === "Ping") {
		session.pingHost(req.body.ip, async function (error, target) {
			if (error) {
				console.log(target + ": " + error.toString());
				webaction.result = "Invalid IP";
				await webaction.save();
			} else {
				console.log(target + ": Alive");
				webaction.status = true;
				webaction.result = "Successed";
				await webaction.save();
			}
			res.redirect("../webtools");
		});
	} else if (webaction.tool === "Trace Route") {
		try {
			cmd.run(`tracert ${webaction.ip}`, async function (err, data, stderr) {
				webaction.result = data;
				if (webaction.ip !== "No IP" && isValidIP(webaction.ip))
					webaction.status = true;
				await webaction.save().then(res.redirect("../webtools"));
			});
		} catch (error) {
			console.log(error);
		}
	} else if (webaction.tool === "Route Table") {
		try {
			cmd.run(`route print`, async function (err, data, stderr) {
				webaction.result = data;
				webaction.status = true;
				await webaction.save().then(res.redirect("../webtools"));
			});
		} catch (error) {
			console.log(error);
		}
	} else if (webaction.tool === "NSLOOKUP") {
		if (isValidIP(webaction.ip) === false) {
			webaction.result = "Invalid Domain";
			await webaction.save().then(res.redirect("../webtools"));
		} else {
			try {
				cmd.run(`nslookup ${webaction.ip}`, async function (err, data, stderr) {
					webaction.status = true;
					webaction.result = data;
					await webaction.save().then(res.redirect("../webtools"));
				});
			} catch (error) {
				console.log(error);
			}
		}
	}
};

exports.user_tools = async function (req, res) {
	const webactions = await WebAction.find();
	res.render("web_tools", {
		webactions,
	});
};

function isValidIP(str) {
	let verdad = str.split(".");
	if (verdad.length != 4) return false;
	for (i in verdad) {
		if (
			!/^\d+$/g.test(verdad[i]) ||
			+verdad[i] > 255 ||
			+verdad[i] < 0 ||
			/^[0][0-9]{1,2}/.test(verdad[i])
		)
			return false;
	}
	return true;
}
