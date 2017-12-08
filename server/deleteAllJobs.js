require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;

// Deletes all documents in jobs collection from database. Use with caution
function deleteAllJobs() {
  MongoClient.connect(process.env.PROD_MONGODB, async function(err, db) {
    await db.collection('jobs').drop();
    await db.close();
  });
}

module.exports = { deleteAllJobs };
