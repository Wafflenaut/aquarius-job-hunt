// Filters list of jobs based on preferences
// Input: array of job documents, userDoc that includes searchPreferences, buriedJobs, ignoredJobs arrays from a user's document.
function filterJobs(jobsIn, userDoc) {
  var ignoredJobIds = userDoc.ignoredJobs;
  var buriedJobIds = userDoc.buriedJobs;
  var appliedJobIds = userDoc.appliedJobIds;
  var searchPreferences = userDoc.searchPreferences;
  var jobTitlePriority = userDoc.jobTitlePriority;
  var keywordPriority = userDoc.keywordPriority;
  var locationPriority = userDoc.locationPriority;

  if (ignoredJobIds) {
    jobsIn = jobsIn.filter(function(job) {
      return !ignoredJobIds.includes(job._id);
    });
  }
  if (buriedJobIds) {
    jobsIn = jobsIn.filter(function(job) {
      return !buriedJobIds.includes(job._id);
    });
  }
  if (appliedJobIds) {
    jobsIn = jobsIn.filter(function(job) {
      return !appliedJobIds.includes(job._id);
    });
  }
  for (var i = 0; i < jobsIn.length; i++) {
    jobsIn[i].weight = 0;
    for (var j = 0; j < searchPreferences.length; j++) {
      if (searchPreferences[j].type === 'location') {
        var commaIndex = searchPreferences[j].preference.indexOf(',');
        var city = searchPreferences[j].preference.slice(0, commaIndex);
        var state = searchPreferences[j].preference.slice(commaIndex + 2);
        if (jobsIn[i].city === city && jobsIn[i].state === state) {
          if (searchPreferences[j].strength == -1) {  // for exclude option
            jobsIn[i].remove = true;
          }
          else {
            jobsIn[i].weight += searchPreferences[j].strength;
          }
        }
      }
      else if (searchPreferences[j].type === 'jobTitle') {
        if (jobsIn[i].jobTitle.toLowerCase().includes(searchPreferences[j].preference.toLowerCase())) {
          if (searchPreferences[j].strength == -1) {  // for exclude
            jobsIn[i].remove = true;
          }
          else {
            jobsIn[i].weight += searchPreferences[j].strength;
          }
        }
      }
      else if (searchPreferences[j].type === 'keyword') {
        if (jobsIn[i].body.toLowerCase().includes(searchPreferences[j].preference.toLowerCase())) {
          if (searchPreferences[j].strength == -1) {  // for exclude
            jobsIn[i].remove = true;
          }
          else {
            jobsIn[i].weight += searchPreferences[j].strength;
          }
        }
      }
    }
  }
  // Remove jobs with excluded preference fields
  jobsIn = jobsIn.filter(function(job) {
    if (job.remove) {
      return false;
    }
    else {
      return true;
    }
  });
  // Sort jobs in descending order
  jobsIn = jobsIn.sort(function(a, b) {
    return b.weight - a.weight;
  });

  return jobsIn;
}

module.exports = { filterJobs };
