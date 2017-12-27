const mongoose = require('mongoose');

var training = new mongoose.Schema({
	source : String,
	text : String,
	foto_sender : String,
	category : String
});

var train = mongoose.model("training", training);

module.exports = train;