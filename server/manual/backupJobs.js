var dotenv = require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
var jsonfile = require('jsonfile');

// Input: None
// Splits job info into json files in current directory
async function backupJobs() {
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  var backupObjects = [];
  var jobsCursor = await db.collection('jobs').find({/*all*/});
  var iterator = 0;
  while (await jobsCursor.hasNext()) {
    backupObjects.push(await jobsCursor.next());
    if (backupObjects.length > 999) {
      jsonfile.writeFile('./jobs' + iterator.toString() + '.json', backupObjects, {spaces: 2}, function(err) {
        if (err) throw err;
      });
      backupObjects = [];
      iterator ++;
    }
  }
  jsonfile.writeFile('./jobs' + iterator.toString() + '.json', backupObjects, {spaces: 2}, function(err) {
    if (err) throw err;
  });
  await jobsCursor.close();
  await db.close();
}


backupJobs();

module.exports = { backupJobs };

