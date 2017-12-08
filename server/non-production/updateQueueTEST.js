require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const {ObjectID} = require('mongodb');
var getUser = require('./getUser').getUser;
var iso8601 = require('iso8601');
//var fetchJobMatches = require('./fetchJobMatches').fetchJobMatches;

async function buildPreferenceQuery(userIdIn) {
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
	
  var preferences = await db.collection('preferences').find({userId: new ObjectID(userIdIn)}).toArray();

	await console.log(JSON.stringify(preferences, null, 4));
  
  var andCount = 0;
  var q = {};
  //q = { source: { $eq: "Boeing"}}
  //q['$and'] = [];
  var positiveJobs = [];
  var negativeJobs = [];
  var negativeKeywords = [];
  var locations = [];
  var nearQueries = [];
  for(var i = 0; i < preferences.length; i++){
    if(preferences[i].type == "jobTitle"){
      console.log("Title Preference: " + preferences[i].preference);
	  if(preferences[i].strength >= 0){
		currPreference = preferences[i].preference;
		currPreference = currPreference.replace(' ', '.*');

		positiveJobs.push(currPreference);
	  }
	  else{
		currPreference = preferences[i].preference;
		currPreference = currPreference.replace(' ', '.*');
		negativeJobs.push(currPreference);
	  }
	}
	else if (preferences[i].type == "location"){
	  console.log("Location Preference: " + preferences[i].preference);
	  locations.push(preferences[i].geolocation);
	}
	else if (preferences[i].type == "keyword"){
      if(preferences[i].strength == -1){
        console.log("Keyword Preference: " + preferences[i].preference);
	    negativeKeywords.push(preferences[i].preference);
	  }
	}
  }
  /*if(positiveJobs.length > 0 || negativeJobs.length > 0){
	  q['$and'] = [];
  }*/
  
  if(locations.length > 0){
    var $or = {
      $or: []
    };
//var boiseQuery = {geolocation : { $near: {$geometry: Boise, $maxDistance: 16093}}};		
    locations.forEach(function (places) {
      nearQueries.push({geolocation : { $near: {$geometry: places, $maxDistance: 16093}}});

    });
  }
  
  queryList = []
  
  nearQueries.forEach(function (locationQuery){
	query = {};
	query['$and'] = [];
  
	query.$and.push(locationQuery);
	//console.log("\n\nCurrent Query:");
	//console.log(JSON.stringify(queryList, null, 4));
    if(positiveJobs.length > 1){

	
      var $or = {
	    $or: []
      };

      positiveJobs.forEach(function (job) {
        $or.$or.push({
          jobTitle: {
          $regex: job,
          $options: 'i'
          }
        })
      });

	  query.$and.push($or);
    //q['$and'].push({ jobTitle: {$in: positiveJobs}});
	  andCount++;
    }
    else if (positiveJobs.length > 0){
      currPreference = preferences[i].preference;
      currPreference = currPreference.replace(' ', '.*');
	  query['$and'].push({jobTitle :{$regex: currPreference, $options: 'i'}});
    }
	
    if(negativeJobs.length > 0){
		
      negativeJobs.forEach(function (job) {
			
			//tempJob = job.replace(' ', '.*');
        tempJob = '^((?!' + job + ').)*$';
        query.$and.push({
          jobTitle: {
            $regex: tempJob,
            $options: 'igm'
          }

        })
      });
	//$not.$not.push($or);
	//q.$and.push($not);
	  andCount++;
    }
	
	if(negativeKeywords.length > 0){
		
      negativeKeywords.forEach(function (keyword) {
			
			//tempJob = job.replace(' ', '.*');
        tempKeyword = '^((?!' + keyword + ').)*$';
        query.$and.push({
          jobTitle: {
            $regex: tempKeyword,
            $options: 'igm'
          }

        });
		
        query.$and.push({
          snippet: {
            $regex: tempKeyword,
            $options: 'igm'
          }

        });
		
      });
	//$not.$not.push($or);
	//q.$and.push($not);

    }
  //q['$and'].push({ queueLastUpdated : {$gte : lastUpdated}});
    query['$and'].push({ crawled: {$eq: true}});

	//console.log("\n\nQuery:")
	//console.log(JSON.stringify(query, null, 4));
    //console.log(JSON.stringify(q, null, 4));
	queryList.push(query);
	
    });
  //console.log(JSON.stringify(queryList, null, 4));
  return queryList;
  
}

// Input: username
// Updates that user's job queue with new matching jobs from the database.
// Updates the user's queueLastUpdated entry
// Reorders the job queue
async function updateQueueTEST(userIdIn) {
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  //var userDoc = await getUser(userIdIn);
  var preferenceQueryList = await buildPreferenceQuery(userIdIn)
  var jobList = []
  await console.log(JSON.stringify(preferenceQueryList, null, 4));
  await console.log(preferenceQueryList.length);
  
  //jobList = await jobList.concat(preferenceQueryList.forEach(async function (preferenceQuery) {
  for(var i = 0; i < preferenceQueryList.length; i++){
    //console.log(JSON.stringify(preferenceQuery, null, 4));
	//await console.log("\n\nRUNNING A QUERY\n\n")
    var jobs = await db.collection('jobs').find(preferenceQueryList[i]).toArray();
	jobList = await jobList.concat(jobs);
	//await console.log("jobList Length: " + jobList.length + " jobs length: " + jobs.length);


  }

  //REMOVE DUPLICATES FROM JOBLIST
  for(var j = 0; j < jobList.length; j++){
	
    await console.log(jobList[j].jobTitle + ' - ' + jobList[j].city + ',' + jobList[j].state);
	  //await console.log(jobs[j].company);
  }
  await console.log("jobList Length: " + jobList.length);
  //await console.log(jobList);
  //await console.log("Length: " + jobList.length);
  //await console.log(preferenceQuery)
  /*for (var i = 0; i < userDoc.searchPreferences.length; i++) {
    await fetchJobMatches(userIdIn, userDoc.searchPreferences[i]);
  }
  await db.collection('users').updateOne(
    {_id: new ObjectID(userIdIn)},
    {$set: {queueLastUpdated: new Date()}}
  );*/
  await db.close();
}

async function findNearbyTest() {
  var Boise = new Object();
  Boise.type = "Point";
  Boise.coordinates = [-116.215019, 43.618881];
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  var boiseQuery = {geolocation : { $near: {$geometry: Boise, $maxDistance: 16093}}};
  var locations = await db.collection('jobs').find(boiseQuery).toArray();
  await db.close();
  for(var i = 0; i < locations.length; i++){
	  await console.log(locations[i].jobTitle + ' - ' + locations[i].city + ',' + locations[i].state);
  }
}

//findNearbyTest();
//updateQueueTEST("5a0c5522421c480d4d4b4143"); //JMTEST2
updateQueueTEST("59ee547b867a0e3b1d6eccd9"); //testuser

module.exports = { 
  updateQueueTEST,
  buildPreferenceQuery
};