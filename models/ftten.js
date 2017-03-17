// Load required packages
var mongoose = require('mongoose');

// Define our beer schema

var timestamps = require('mongoose-timestamp');
var FtTenSchema = new mongoose.Schema({
	
	name: String, 
	location: String,
	timeOfArrival: String,
	timeSpent: String	

});

FtTenSchema.plugin(timestamps);
	
/*var HarvesterSchema   = new mongoose.Schema({
	Harvester: [Contents]
});
*/
// Export the Mongoose model
module.exports = mongoose.model('Ftten', FtTenSchema);