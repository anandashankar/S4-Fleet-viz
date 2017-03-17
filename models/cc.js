// Load required packages
var mongoose = require('mongoose');

// Define our beer schema

var timestamps = require('mongoose-timestamp');
var CcSchema = new mongoose.Schema({
	
	maxAlertLevel: String,
	orderID: Number,
	status: String,
	statusChange: String,
	colorChange: String

});

CcSchema.plugin(timestamps);
	
/*var HarvesterSchema   = new mongoose.Schema({
	Harvester: [Contents]
});
*/
// Export the Mongoose model
module.exports = mongoose.model('Cc', CcSchema);