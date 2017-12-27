const mongoose = require('mongoose');

var model = new mongoose.Schema({
	postId : String,
	text : String,
	category : String,
	date : String,
	createdAt: { type: Date, default: Date.now },
});

var schema = mongoose.model("comment", model);

module.exports = schema;