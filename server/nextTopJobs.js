var getJobs = require('./getJobs.js').getJobs;
var getUser = require('./getUser.js').getUser;
var filterJobs = require('./filterJobs.js').filterJobs;


// Input: Number of job documents to return, username to match jobs to, array of jobIds to exclude from list
// This function can be used in the front end to order more filtered jobs from the database.
// Use null for excludedJobIds to not exclude any jobs, e.g. on first display of a user's job queue.
async function nextTopJobs(numJobs, usernameIn, excludedJobIds) {
  // Get the entire jobs database (optimize this later)
  var rawJobs = await getJobs();
  // Remove excludedJobs from list
  if (excludedJobIds) {
    rawJobs = rawJobs.filter(function(job) {
      return !excludedJobIds.includes(job._id);
    });
  }
  // Get the user document
  var user = await getUser(usernameIn);
  // Send to filter function
  var filteredJobs = filterJobs(rawJobs, user.searchPreferences, null, null, null);
  // Pop the top numJobs jobs off the top of that list and return them
  return filteredJobs.splice(0, numJobs);
}

module.exports = { nextTopJobs };
