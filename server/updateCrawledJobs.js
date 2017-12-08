require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const {ObjectID} = require('mongodb');

// Input: array of job documents with updated values
// Updates those jobs in database with extra information from the web scraper
/*function updateCrawledJobs(jobsIn) {
	console.log('THIS IS IN UPDATECRAWLEDJOBS');
	console.log(jobsIn[0].jobTitle);
  MongoClient.connect(process.env.PROD_MONGODB, function(err, db) {
    jobsIn.forEach(function(job, index, array) {
      db.collection('jobs').updateOne(
        {_id: job._id},
        {$set: {"body": job.body, "crawled": job.crawled, "url": job.url}}
      );
    });
	console.log(job.title + "updated");
    db.close();
  });
  return true;
}*/

// Input: array of job documents with updated values
// Updates those jobs in database with extra information from the web scraper
function updateCrawledJobs(jobsIn) {
  MongoClient.connect(process.env.PROD_MONGODB, function(err, db) {
    for(i = 0; i < jobsIn.length; i++){
      db.collection('jobs').updateOne(
       {_id: new ObjectID(jobsIn[i]._id)},
       {$set: {"body": jobsIn[i].body, "crawled": jobsIn[i].crawled, "url": jobsIn[i].url}}
      );
	}
	db.close();
  });
  return jobsIn;
}

/*function updateCrawledJobs(jobsIn){
	console.log("Updating Jobs DERP DERP DER");
	console.log(jobsIn);

	return true;
}*/

module.exports = { updateCrawledJobs };
