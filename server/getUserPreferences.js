require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const {ObjectID} = require('mongodb');
var getUser = require('./getUser').getUser;

// Input: userId
// Get's that user's search preferences and priorities and returns in the form:
// [ [locationPreferences], [jobTitlePreferences], [keywordPreferences],
//   [<locationPriority>, <jobTitlePriority>, <keywordPriority>] ]
async function getUserPreferences(userId) {
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  var userDoc = await db.collection('users').find(
    { _id: new ObjectID(userId) }).project(
    {jobQueue: 0, appliedJobs: 0, ignoredJobs: 0, buriedJobs: 0}
  ).limit(1).next();
  
  //Note: Removed reference to matches
  var searchPreferences = await db.collection('preferences').find({userId: new ObjectID(userId)}).project({userId: 0}).toArray();
  await db.close();
  if (!searchPreferences) {
    return [[], [], [], [3, 3, 3]];
  }
  var locationPreferences = [];
  var jobTitlePreferences = [];
  var keywordPreferences = [];
  for (var i = 0; i < searchPreferences.length; i++) {
    switch (searchPreferences[i].type) {
      case 'location':
        locationPreferences.push(searchPreferences[i]);
        break;
      case 'jobTitle':
        jobTitlePreferences.push(searchPreferences[i]);
        break;
      case 'keyword':
        keywordPreferences.push(searchPreferences[i]);
        break;
      default:
        keywordPreferences.push(searchPreferences[i]);
        break;
    }
  }
  var locationPriority = userDoc.locationPriority;
  if (!locationPriority)
    locationPriority = 3;
  var jobTitlePriority = userDoc.jobTitlePriority;
  if (!jobTitlePriority)
    jobTitlePriority = 3;
  var keywordPriority = userDoc.keywordPriority;
  if (!keywordPriority)
    keywordPriority = 3;
  return [locationPreferences, jobTitlePreferences, keywordPreferences, [locationPriority, jobTitlePriority, keywordPriority]];
}

module.exports = { getUserPreferences };
