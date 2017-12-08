require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const {ObjectID} = require('mongodb'); 

//Parameters : None
//Purpose: Pull all jobs with null or "temp" jobTypes
//Output: Returns a list of all matching Jobs
async function getNoGeolocationJobs() {
	
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  var noGeoLocationData = await db.collection('jobs').find({
    "geolocation": {"$exists": true}
  }).toArray();
  
  await db.close();
  
  await console.log(noGeoLocationData.length)
  
  //for(i = 0; i < tempJobsList.length; i ++){
	  //await console.log("Job Title: " + tempJobsList[i].jobTitle + " jobType: " + tempJobsList[i].jobType);
  //}
  return noGeoLocationData;
}

//Parameters : None
//Purpose: Updates a list of all jobs with null or "temp" jobTypes with "temporary" to fix DB
//Output: Updates all null and "temp" jobs to "temporary"
async function updateNoGeolocJobs() {
  var noGeoLocJobs = await getNoGeolocationJobs();
  MongoClient.connect(process.env.PROD_MONGODB, async function(err, db) {
    //for(i = 0; i < noGeoLocJobs.length; i++){
	for(i = 0; i < noGeoLocJobs.length; i++){
      geolocation = new Object();
      geolocation.type = "Point";
      geolocation.coordinates = [noGeoLocJobs[i].longitude, noGeoLocJobs[i].latitude];	
		
      await db.collection('jobs').updateOne(
        {_id: new ObjectID(noGeoLocJobs[i]._id)},
        {$set: {"geolocation": geolocation}},
        {upsert: false}
      );
	  //await console.log(noGeoLocJobs[i].jobTitle)
	}
	await db.close();
  });
}


//getNoGeolocationJobs();
updateNoGeolocJobs();
 