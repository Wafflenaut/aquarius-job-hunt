require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const {ObjectID} = require('mongodb');

// Input: userId, (applied) jobId, noteId
// Edits or adds the user note to the note collection
async function editUserNote(userId, jobId, noteId, noteText) {
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  if (noteId == 'null') {
    var {insertedId} = await db.collection('notes').insertOne(
      { userId: new ObjectID(userId),
        jobId: new ObjectID(jobId),
        text: noteText }
    );
    await db.close();
    return insertedId;
  }
  else {
    await db.collection('notes').updateOne(
      {_id: new ObjectID(noteId), userId: new ObjectID(userId), jobId: new ObjectID(jobId)},
      {$set: { text: noteText}},
      {upsert: true}
    );
    await db.close();
    return noteId;
  }

}

module.exports = { editUserNote };
