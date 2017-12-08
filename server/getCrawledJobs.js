require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;

// Returns a Promise of an array of jobs documents with crawled value of false.
// Must await on the return value inside another async function (I think) because async functions return Promises
async function getCrawledJobs() {
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  var crawledJobs = await db.collection('jobs').find({crawled: true}).toArray();
  //var crawledJobs = await crawledJobs.slice(0, 25);
  db.close();
  return crawledJobs;
}

module.exports = { getCrawledJobs };