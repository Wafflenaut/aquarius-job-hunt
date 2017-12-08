require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const {ObjectID} = require('mongodb');

// Input: preference id
// Deletes user preference from database
async function deleteSearchPreference(userIdIn, preferenceId, preferenceIn) {
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  await db.collection('preferences').deleteOne(
    {_id: new ObjectID(preferenceId), userId: new ObjectID(userIdIn)}
  );
  await db.close();
  return preferenceIn;
}

module.exports = { deleteSearchPreference };
