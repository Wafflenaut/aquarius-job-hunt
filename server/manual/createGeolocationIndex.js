var dotenv = require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;

//Parameters: None
//Function: Sets up a geolocation index on the jobs collection
//Output: None
async function backupJobs() {
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  //var jobs = db.collection('jobs');
  await db.createIndex('jobs', {geolocation : "2dsphere"});
  
  //jobs.createIndex({ geolocation: "2dsphere"});
  
  db.close();
}

backupJobs();