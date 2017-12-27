const mongoose = require('mongoose');

var train = new mongoose.Schema({
	data : Array
});

var model = mongoose.model("preprocessing", train);

module.exports = model;