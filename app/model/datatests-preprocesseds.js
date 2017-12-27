const mongoose = require('mongoose');

var datatest = new mongoose.Schema({
	text : Array,
	date : String,
	category : String
});

var train = mongoose.model("datatests_preprocessed", datatest);

module.exports = train;