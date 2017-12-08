var addPreference = require('../addSearchPreference.js').addSearchPreference;
var updateQueue = require('../updateJobQueue.js').updateJobQueue;
var buildPreferenceQuery = require('../buildPreferenceQuery').buildPreferenceQuery;
var getQueue = require('../getJobQueue.js').getJobQueue;

//change user ID to add/update/get for other users
//var userId = '5a1aee2a421c480d4d706ef0';

//var userId = '5a1cbd0b421c480d4d5e0e9d'
//var userId = '5a1e2c1ad915bb5aea072ac2';
var userId = '5a1e0a7607559f0010d7f8d0';

//var preferenceIn = new Object();

//for manually creating search preferences // comment out geolocation for non-location types
//preferenceIn.type = 'location';
//preferenceIn.preference = 'Meridian, ID';
//preferenceIn.strength = 1;
/*

preferenceIn.geolocation = {
                "type" : "Point",
                "coordinates" : [ 
                    -116.3915, 
                    43.6121
                ]
            };		
	*/		
/*			
preferenceIn.geolocation = {
                "type" : "Point",
                "coordinates" : [ 
                    -122.3321, 
                    47.6062
                ]
            };
*/

//addPreference(userId, preferenceIn);
//updateQueue(userId);
/*
buildPreferenceWrapper(userId);

async function buildPreferenceWrapper(userId){
	var preferencesQueryList = await buildPreferenceQuery(userId);
	console.log("I smell bad");
	console.log(JSON.stringify(preferencesQueryList, null, 4));
}*/


getQueueWrapper(userId, 0, 5);

async function getQueueWrapper(userId, startIndex, endIndex){
	await updateQueue(userId);
	var testJobs = await getQueue(userId, startIndex, endIndex);
	//console.log(testJobs);
	for(var i = 0; i < testJobs.length; i++){
		console.log(testJobs[i]._id + " " + testJobs[i].jobTitle + " " + testJobs[i].city + ', ' + testJobs[i].state + " " + testJobs[i].body + "\n\n\n\n\n");
	}
	console.log(testJobs.length);
}

/*

//Testing matchLocation

jobTitlesOr = []
var matches = await db.collection('jobs').find(
	  //#JOHNADDED
	  //adds a geolocation query for nearness (10miles) to geolocation in preference
      {crawled: true, geolocation : { $near: {$geometry: preferenceIn.geolocation, $maxDistance: 16093}}, $and: [{$or: jobTitlesOR }]} // jobTitle: jobTitlesRegex }  // $or: jobTitlesOR }
    ).project({_id: 1}).toArray();
*/