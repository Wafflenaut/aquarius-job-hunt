require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const {ObjectID} = require('mongodb'); 

//Parameters : None
//Purpose: Pull all jobs with null or "temp" jobTypes
//Output: Returns a list of all matching Jobs
async function getTempAndNullJobs() {
	
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  var nullJobsList = await db.collection('jobs').find({
    "jobType": null
  }).toArray();
  
  var tempJobsList = await db.collection('jobs').find({
    "jobType": "temp"
  }).toArray();
  
  tempJobsList = await tempJobsList.concat(nullJobsList);

  await db.close();
  
  for(i = 0; i < tempJobsList.length; i ++){
	  await console.log("Job Title: " + tempJobsList[i].jobTitle + " jobType: " + tempJobsList[i].jobType);
  }
  return tempJobsList;
}

//Parameters : None
//Purpose: Updates a list of all jobs with null or "temp" jobTypes with "temporary" to fix DB
//Output: Updates all null and "temp" jobs to "temporary"
async function updateTempAndNullJobs() {
  var tempAndNullJobs = await getTempAndNullJobs();
  MongoClient.connect(process.env.PROD_MONGODB, async function(err, db) {
    for(i = 0; i < tempAndNullJobs.length; i++){
      db.collection('jobs').updateOne(
        {_id: new ObjectID(tempAndNullJobs[i]._id)},
        {$set: {"jobType": "temporary"}},
        {upsert: false}
      );
	}
	await db.close();
  });
}

updateTempAndNullJobs();
 