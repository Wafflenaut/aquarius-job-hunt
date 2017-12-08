require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const {ObjectID} = require('mongodb');
var buildPreferenceQuery = require('./buildPreferenceQuery').buildPreferenceQuery;
const _ = require('lodash');
const rateJobs = require('./rateJobs');

// Input: user id
// Updates that user's job queue with new order or jobs
async function updateJobQueue(userIdIn) {
  try{
  //builds an array of queries (requires multiple queries due to geolocation only allowing one geolocation in a query
  var preferenceQueryList = await buildPreferenceQuery(userIdIn);
  
  var db = await MongoClient.connect(process.env.PROD_MONGODB);

  var jobList = [];
  
  //performs each query and concats to a single array of jobs
  for(var i = 0; i < preferenceQueryList.length; i++){

    var jobs = await db.collection('jobs').find(preferenceQueryList[i]).toArray();
    jobList = await jobList.concat(jobs);
  }
  
  //remove duplicates (caused by overlapping geolocation areas)
  var newJobQueue = await _.uniqWith(jobList, _.isEqual);

  var {locationPriority, jobTitlePriority, keywordPriority, appliedJobs, ignoredJobs, buriedJobs} = await db.collection('users').find({_id: new ObjectID(userIdIn)}).limit(1).next();

  var preferences = await db.collection('preferences').find({userId: new ObjectID(userIdIn)}).toArray();
  
  //16.093 km = 10 miles
  const defaultDistance = 16.093;
  
  for (var i = 0; i < newJobQueue.length; i++) {
	
	newJobQueue[i].score = 0;  
	  
    //checks each job for valid matches on the various preference - adds points if matching
    for (var j = 0; j < preferences.length; j++) {
          if (preferences[j].type == 'location'){
			if(rateJobs.rateLocations(newJobQueue[i].geolocation, preferences[j].geolocation, defaultDistance)){
				newJobQueue[i].score += locationPriority * preferences[j].strength;
		    }
		  }
          else if (preferences[j].type == 'jobTitle'){
			  if(rateJobs.rateJobTitle(newJobQueue[i].jobTitle, preferences[j].preference)){
			    newJobQueue[i].score += jobTitlePriority * preferences[j].strength;
			}
		  }
		  else if(preferences[j].type == 'keyword'){
			  if(rateJobs.rateKeyword(newJobQueue[i].jobTitle, newJobQueue[i].snippet, newJobQueue[i].body, preferences[j].preference)){
			    newJobQueue[i].score += keywordPriority * preferences[j].strength;
			}
		  }       
      }
    }

	var removeJobs = [];
	
	//Adds all applied, buried, or ignored jobs to an array to filter out of job list from query
	if(appliedJobs){

		removeJobs = removeJobs.concat(appliedJobs);
	}

	if(ignoredJobs){
		removeJobs = removeJobs.concat(ignoredJobs);
	}

	if(buriedJobs){
		removeJobs = removeJobs.concat(buriedJobs);
	}

    //removes all jobs in the removedJobs array 
	newJobQueue = newJobQueue.filter(function(newJobs) {
		return removeJobs.filter(function (removeJob) {
			return removeJob.equals(newJobs._id);
		}).length == 0
	});

  // sort in descending order
  newJobQueue = newJobQueue.sort(function(a, b) {
    return b.score - a.score;
  });

  //create an array of job _id to add to queue  
  var jobIdList = [];
  for(var i = 0; i < newJobQueue.length; i++){
	jobIdList.push(newJobQueue[i]._id);
  }
  
  if(buriedJobs){
    jobIdList = jobIdList.concat(buriedJobs);
  }
  
  await db.collection('users').updateOne(
    {_id: new ObjectID(userIdIn)},
    {$set: {'jobQueue': jobIdList}}
  );

  await db.close();
  
    } catch (e) {
	
    throw new Error(e + "\nUnable to update queue");
  }
}

module.exports = { updateJobQueue };
