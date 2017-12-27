const mongoose = require('mongoose');

var model = new mongoose.Schema({
	source : String,
	text : String,
	name : String,
	foto : String,
	category : String,
	date : String,
	commentCount : Number,
	comment : Array,
	reactionCount : Number,
	reaction : Array,
	createdAt: { type: Date, default: Date.now },
});

var schema = mongoose.model("sentiment-data", model);

module.exports = schema;