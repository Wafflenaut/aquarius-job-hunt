require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;

// Returns an array of all job documents from database
async function getJobs() {
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  var jobsList = await db.collection('jobs').find().toArray();
  await db.close();
  return jobsList;
}

module.exports = { getJobs };
