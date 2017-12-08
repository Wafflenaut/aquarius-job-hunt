require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const {ObjectID} = require('mongodb');
var getUser = require('./getUser.js').getUser;
const _ = require('lodash');

// Input: username
// Returns array of job documents from the jobIDs in the user's job queue.
// Calls update job queue if there are new jobs in db.
async function getJobQueue(userIdIn, startIndex, endIndex) {

  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  var userDoc = await db.collection('users').find({_id: new ObjectID(userIdIn)}).project({jobQueue: 1}).limit(1).next();

  var jobDocsQuery = [];
  if(userDoc.jobQueue.length < endIndex){
    jobDocsQuery = userDoc.jobQueue.slice(startIndex, userDoc.jobQueue.length);
  }
  else{
    jobDocsQuery = userDoc.jobQueue.slice(startIndex, Number(endIndex) + 1);
  }
  
  var jobDocs = await db.collection('jobs').find({ "_id" : {"$in" : jobDocsQuery}}).toArray();
  
  sortedJobDocs = [];
  //sorts the queried jobs back in their original order
  for(var i = 0; i < jobDocs.length; i++){
	  jobIndex = _.findIndex(jobDocs, function(job) { 
	    return job._id.toString() === jobDocsQuery[i].toString();
	  });
	  sortedJobDocs.push(jobDocs[jobIndex]);
  }

  await db.close();
  return sortedJobDocs;
}

module.exports = { getJobQueue };
