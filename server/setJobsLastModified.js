require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;

// Input: None
// Sets the document with job info to lastModified: current date
async function setJobsLastModified() {
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  var geolocationObject = new Object();
  geolocationObject.type = 'Point';
  geolocationObject.coordinates = [0,0];
  await db.collection('jobs').updateOne(
    {jobsUpdateInfo: "jobsUpdateInfo"},
    {$set: {dateModified: new Date(), geolocation: geolocationObject}},
    {upsert: true}
  );
  await db.close();
}

module.exports = { setJobsLastModified };
