// Load required packages
var mongoose = require('mongoose');

// Define our beer schema

var timestamps = require('mongoose-timestamp');
var MachineOneSchema = new mongoose.Schema({

	maxAlertLevel: String,
	orderID: Number,
	status: String,
	statusChange: String,
	colorChange: String

});

MachineOneSchema.plugin(timestamps);

module.exports = mongoose.model('McOne', MachineOneSchema);

