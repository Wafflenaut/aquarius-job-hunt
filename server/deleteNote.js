var dotenv = require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const {ObjectID} = require('mongodb');

// Input: note id
// Deletes that note from db
async function deleteNote(userIdIn, noteId) {
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  await db.collection('notes').deleteOne({_id: new ObjectID(noteId), userId: new ObjectID(userIdIn)});
  await db.close();
}

module.exports = { deleteNote };
