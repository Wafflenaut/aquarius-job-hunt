require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const {ObjectID} = require('mongodb'); 
var _ = require('lodash');

//Parameters : None
//Purpose: Pull all jobs with null or "temp" jobTypes
//Output: Returns a list of all matching Jobs
async function removeIndeedDuplicates() {
	totalDupes = 0;
	
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  var allJobs = await db.collection('jobs').find({"source" : "Indeed"}).toArray();
  console.log(allJobs.length);
  
  allJobKeys = [];
  //allJobIds = [];
  
  for(var i = 0; i < allJobs.length; i++){
	  tempKeys = new Object();
	  tempKeys._id = allJobs[i]._id;
	  tempKeys.jobKey = allJobs[i].jobKey;
	  //console.log(allJobKeys.type);
	  allJobKeys.push(tempKeys);
	  //allJobIds.push(allJobs[i]._id;
  }
  
  var uniqueJobs = _.uniqBy(allJobKeys, 'jobKey');
  console.log(allJobKeys[3].jobKey);
  console.log(uniqueJobs[3].jobKey);
  var duplicateJobs = allJobKeys.filter(jobKeyPair => uniqueJobs.indexOf(jobKeyPair) === -1);

  console.log(uniqueJobs.length);
  console.log(duplicateJobs.length);
  
  for(var i = 0; i < duplicateJobs.length; i++){
	  db.collection('jobs').remove({_id: new ObjectID(duplicateJobs[i]._id)},{justOne: true, });
  }
  
  //console.log(totalDupes);
  
  await db.close();

}

removeIndeedDuplicates();
