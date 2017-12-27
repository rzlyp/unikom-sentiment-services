const mongoose = require('mongoose');

var synapse = new mongoose.Schema({
	classes : Array,
	datetime : Date,
	synapse0 : Array,
	synapse1 : Array,
	words : Array
});

var model = mongoose.model("synapse", synapse);

module.exports = model;