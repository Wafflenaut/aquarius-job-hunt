require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const {ObjectID} = require('mongodb');
var getUser = require('./getUser').getUser;
var _ = require('lodash');
var geojsonTools = require('geojson-tools');

//Parameters: A jobtitle and a preference for a job title
//Function: Checks the title for each segment of a job title preference
//Output: True if it contains all segments of a job title, false otherwise
function rateJobTitle(jobTitle, jobTitlePref){
	//splits a multiword jobtitle into multiple cells of an array
	titlePrefList = jobTitlePref.split(' ');
	valid = true;
	
	//checks jobTitle to see if it contains all segments of a job title
	for(var i = 0; i < titlePrefList.length; i++){
		if(_.includes(jobTitle, titlePrefList[i]) == false){
			valid = false;
		} 
	}

	return valid;
}

//Parameters: A job's title, snippet, and body - as well as a keyword preference
//Function: Checks the title, snippet, and body for keyword segments
//Output: True if all segments of a keyword are present somewhere, false otherwise
function rateKeyword(jobTitle, jobSnippet, jobBody, jobKeywordPref){
	//splits a multiword keyword into multiple cells of an array
	keywordPrefList = jobKeywordPref.split(' ');
	validKeyword = [0];
	
	//checks to make sure each individual segment of a keyword exists in at least one of the job parameters
	//returns false if not
	for(var i = 0; i < keywordPrefList.length; i++){
		if(_.includes(jobTitle, keywordPrefList[i]) == true ||
		_.includes(jobSnippet, keywordPrefList[i]) == true ||
		_.includes(jobBody, keywordPrefList[i]) == true){
			validKeyword.push(true);
		}
		else{
			validKeyword.push(false);
		}
	}
	
	//if a false value was pushed to the validKeyword array - e.g. a keyword was not found
	if(_.includes(validKeyword, false) == true){
		return false;
	}
	else{
		return true;
	}
}

//Paramters: A geojson point for the job location, and a geojson point for the preference, and a distance in km
//Function: Returns true if the distance between two points is within the distanceLimit
//Output: True if the distance between two points is within distanceLimit
function rateLocations(jobPoint, jobPointPref, distanceLimit){
	locationArray = [];
	locationArray.push(geojsonTools.toArray(jobPoint));
	locationArray.push(geojsonTools.toArray(jobPointPref));
	
	var distance = geojsonTools.getDistance(locationArray);
	
	if(distanceLimit > distance){
		return true;
	}
	else{
		return false;
	}
	
}



module.exports = {
  rateLocations,
  rateKeyword,
  rateJobTitle
};

