import axios from 'axios';

const URL = "http://aquarius467.herokuapp.com/";

module.exports = {
  login: function(username, password, success, error) {
    axios.post(URL + "user/login", {
      username, password
    })
      .then(success)
      .catch(err => {
        return error(err.response.status);
      })
  },

  signup: function(username, password, success, error) {
    axios.post(URL + "user/signup", {
      username, password,
      locationPreference: {
        "type": "location",
        "preference": "Seattle, WA",
        "strength": 3
      },
      jobTitlePreference: {
        "type": "jobTitle",
        "preference": "software",
        "strength": 3
      }
    })
      .then(success)
      .catch(err => {
        return error(err.response);
      })
  },

  getJobQueue: function(UId, success) {
    axios.get(URL + "user/" + UId + "/job-queue/start/0/end/11")
      .then(success);
  },

  getSavedJobs: function(UId, success) {
    axios.get(URL + "user/" + UId + "/buried-jobs")
      .then(success);
  },

  getAppliedJobs: function(UId, success) {
    axios.get(URL + "user/" + UId + "/applied-jobs")
      .then(success);
  },

  getUserPreferences: function(UId,success) {
    axios.get(URL + "user/" + UId + "/preferences")
      .then(success);
  },

  addUserPreference: function(UId, preferenceObject, success) {
    axios.post(URL + "user/" + UId + "/search-preference/add", {
      preference: preferenceObject.preference,
      strength: preferenceObject.strength,
      type: preferenceObject.type,
    })
      .then(success)
  },

  removeUserPreference: function(UId, preferenceObject, success) {
    axios.post(URL + "user/" + UId + "/search-preference/" + preferenceObject._id + "/delete", {
      preference: preferenceObject.preference,
      strength: preferenceObject.strength,
      type: preferenceObject.type,
    })
      .then(success);
  },

  updateLocationPriority: function(UId, priority) {
    axios.post(URL + "user/" + UId + "/edit-location-priority/" + priority);
  },

  updateJobTitlePriority: function(UId, priority) {
    axios.post(URL + "user/" + UId + "/edit-job-title-priority/" + priority);
  },

  updateKeywordPriority: function(UId, priority) {
    axios.post(URL + "user/" + UId + "/edit-keyword-priority/" + priority);
  },

  saveJobForLater: function(UId, jobId, success) {
    axios.post(URL + "user/" + UId + "/bury-job/" + jobId)
      .then(success);
  },

  jobApplied: function(UId, jobId, success) {
    axios.post(URL + "user/" + UId + "/mark-applied/" + jobId)
      .then(success);
  },

  ignoreJob: function(UId, jobId, success) {
    axios.post(URL + "user/" + UId + "/ignore-job/" + jobId)
      .then(success)
  },

  removeJob: function(UId, jobId, success) {
    axios.get(URL + "user/" + UId + "/job-queue/delete/" + jobId)
      .then(success);
  },

  editNote: function(UId, JId, NId, note, success) {
    axios.post(URL + "user/" + UId + "/job/" +  JId + "/notes/" + NId + "/edit", {
      note: note
    })
      .then(success);
  },

  deleteNote: function(UId, NId, success) {
    axios.post(URL + "user/" + UId + "/notes/" +  NId+ "/delete")
      .then(success);
  }
}