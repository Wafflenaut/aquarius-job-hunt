require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;

// Adds new unscraped jobs to database. Checks for uniqueness
// Input: Array of job objects
async function addNewJobs(jobs) {
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  for (var i = 0; i < jobs.length; i++) {
    if (jobs[i].source == 'Indeed') {
      var jobKeyCheck = await db.collection('jobs').find({
        jobKey: jobs[i].jobkey
      }).project({jobKey: 1}).toArray();
      if (jobKeyCheck.length > 0) {
        continue;
      }
    }
    await db.collection('jobs').insertOne({
      jobTitle: jobs[i].jobtitle,
      company: jobs[i].company,
      city: jobs[i].city,
      state: jobs[i].state,
      date: jobs[i].date,
      snippet: jobs[i].snippet,
      url: jobs[i].url,
      latitude: jobs[i].latitude,
      longitude: jobs[i].longitude,
      jobKey: jobs[i].jobkey,
      jobType: jobs[i].jobtype,
      source: jobs[i].source,
      crawled: jobs[i].crawled,
      geolocation: jobs[i].geolocation
    });
  }
  await db.close();
}

module.exports = { addNewJobs };
