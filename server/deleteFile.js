var dotenv = require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const {ObjectID} = require('mongodb');

// Input: file id
// Deletes that file from the file collection
async function deleteFile(userIdIn, fileIdIn) {
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  await db.collection('files').deleteOne(
    {_id: new ObjectID(fileIdIn)}
  );
  await db.close();
}

module.exports = { deleteFile };
