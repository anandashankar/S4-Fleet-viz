// Load required packages
var mongoose = require('mongoose');

// Define our beer schema

var timestamps = require('mongoose-timestamp');
var FtEightSchema = new mongoose.Schema({
	
	name: String,
	location: String,
	timeOfArrival: String,
	timeSpent: String	

});

FtEightSchema.plugin(timestamps);
	
/*var HarvesterSchema   = new mongoose.Schema({
	Harvester: [Contents]
});
*/
// Export the Mongoose model
module.exports = mongoose.model('Fteight', FtEightSchema);