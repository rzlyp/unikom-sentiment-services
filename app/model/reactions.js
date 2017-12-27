const mongoose = require('mongoose');

var schema = new mongoose.Schema({
	source : String,
	reaction : String,
	category : String,
	date : String,
	createdAt: { type: Date, default: Date.now },
});

var model = mongoose.model("reaction", schema);

module.exports = model;