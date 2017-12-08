require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const {ObjectID} = require('mongodb');


async function buildPreferenceQuery(userIdIn) {
  try{
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
	
  var preferences = await db.collection('preferences').find({userId: new ObjectID(userIdIn)}).toArray();

  //await console.log(JSON.stringify(preferences, null, 4));
  
  //var andCount = 0;
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
      //console.log("Title Preference: " + preferences[i].preference);
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
	  //console.log("Location Preference: " + preferences[i].preference);
	  locations.push(preferences[i].geolocation);
	}
	else if (preferences[i].type == "keyword"){
      if(preferences[i].strength == -1){
        //console.log("Keyword Preference: " + preferences[i].preference);
	    negativeKeywords.push(preferences[i].preference);
	  }
	}
  }
  /*if(positiveJobs.length > 0 || negativeJobs.length > 0){
	  q['$and'] = [];
  }*/
  //console.log("Places");
  if(locations.length > 0){
    var $or = {
      $or: []
    };
//var boiseQuery = {geolocation : { $near: {$geometry: Boise, $maxDistance: 16093}}};		
    locations.forEach(function (places) {
      nearQueries.push({geolocation : { $near: {$geometry: places, $maxDistance: 16093}}});

    });
  }
  //console.log(JSON.stringify(nearQueries, null, 4));
  queryList = []
  
  nearQueries.forEach(function (locationQuery){
	//console.log("Location");
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
	  //andCount++;
    }
    else if (positiveJobs.length > 0){
      currPreference = preferences[1].preference;
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
	  //andCount++;
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
	//console.log("\n\n\nQuery List");
	//console.log(JSON.stringify(queryList, null, 4));
  //console.log(JSON.stringify(queryList, null, 4));
  db.close();
  
  return queryList;
  } catch (e) {
    throw new Error("Unable to build query" + e);
  }
  
}

module.exports = { 
  buildPreferenceQuery
};