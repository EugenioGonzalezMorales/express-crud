const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const webActionsSchema = new Schema({
	date: String,
	tool: String,
	ip: String,
	status: {
		type: Boolean,
		default: false,
	},
	result: String,
});

module.exports = mongoose.model("webactions", webActionsSchema);
