const mongoose = require('mongoose');

var train = new mongoose.Schema({
	data : Array
});

var model = mongoose.model("training_data", train);

module.exports = model;