require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;

// Returns a Promise of an array of jobs documents with crawled value of false.
// Must await on the return value inside another async function (I think) because async functions return Promises
async function getUncrawledJobs() {
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  var uncrawledJobs = await db.collection('jobs').find({crawled: false}).toArray();
  db.close();
  return uncrawledJobs;
}

module.exports = { getUncrawledJobs };
