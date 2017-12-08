import React, { Component } from 'react';
import ReviewList from './ReviewList';
import JobView from './JobView';
const client = require("../utils/client");
const SAVED = "saved";
const APPLIED = "applied";


export default class ReviewContainer extends Component {
  constructor() {
    super();

    this.state = {
      savedJobs: [],
      appliedJobs: [],
      activeView: APPLIED,
      activeJob: null
    }
  }

  componentDidMount() {
    client.getSavedJobs(this.props._id, (response) => {
      (response.data.length) ?
        this.setState({
          savedJobs: response.data,
          activeJob: response.data[0],
          activeView: SAVED
        })
      :
        this.setState({
          savedJobs: response.data
        })
    })
    client.getAppliedJobs(this.props._id, (response) => {
      (response.data.length) ?
        this.setState({
          appliedJobs: response.data,
          activeJob: response.data[0],
          activeView: APPLIED
        })
        :
        this.setState({
          appliedJobs: response.data,
        })
    })
  }

  handleCategoryChange = (category) => {
    if(category === SAVED && this.state.savedJobs.length) {
      return this.setState({
        activeView: category,
        activeJob: this.state.savedJobs[0]
      });
    } else if (category ===APPLIED && this.state.appliedJobs.length) {
      return this.setState({
        activeView: category,
        activeJob: this.state.appliedJobs[0]
      })
    }
  }

  handleJobClick = (id) => {
    var activeView = this.state.activeView;

    if(activeView === SAVED) {
      this.setActiveJob(this.state.savedJobs, id);
    } else if (activeView === APPLIED) {
      this.setActiveJob(this.state.appliedJobs, id);
    }
  }

  setActiveJob = (jobData, id) => {
    const activeJob = jobData.filter((job) => {
      if(job._id === id) {
        return true;
      } return false;
    })

    return this.setState({ activeJob: activeJob[0] })
  }

  handleNoteChange = (note, action) => {
    var jobData = this.getCurrentJobData(this.state.activeView);
    var activeJobIndex = this.getCurrentJobIndex(jobData);

    if (action === "delete") {
      this.deleteNote(note, jobData, activeJobIndex)
    } else if (action === "save") {
      this.saveNote(note, jobData, activeJobIndex);
    }
  }

  deleteNote = (noteId, jobData, activeJobIndex) => {
    jobData[activeJobIndex].noteText = null;
    jobData[activeJobIndex].noteId = null;

    this.updateJobData(this.state.activeJob, jobData);
  }

  saveNote = (noteObject, jobData, activeJobIndex) => {
    jobData[activeJobIndex].noteText = noteObject.noteText;
    jobData[activeJobIndex].noteId = noteObject.noteId;

    this.updateJobData(this.state.activeJob, jobData)
  }

  getCurrentJobData = (activeView) => {
    if (activeView === "applied") {
      return this.state.appliedJobs;
    } else {
      return this.state.savedJobs;
    }
  }

  getCurrentJobIndex = (jobData) => {
    return jobData.findIndex((job) => {
      return(job._id === this.state.activeJob._id);
    });
  }

  updateJobData = (activeView, jobData) => {
    if (activeView === "applied") {
      return this.setState({
        appliedJobs: jobData
      })
    } else {
      return this.setState({
        savedJobs: jobData
      })
    }
  }

  render() {
    return(
      <div>
        {
          (this.state.activeJob !== null) ?
          <div className="row no-gutters">
              <ReviewList
                savedJobs={this.state.savedJobs}
                appliedJobs={this.state.appliedJobs}
                handleCategoryChange={this.handleCategoryChange}
                handleJobClick={this.handleJobClick}
                activeView={this.state.activeView}
                activeJobId={this.state.activeJob._id}
              />
              <JobView
                jobData={this.state.activeJob}
                handleNoteChange={this.handleNoteChange}
                _id={this.props._id}
              />
          </div>
            :
              <div className="empty-box d-block text-center w-100">
                <i className="em em-confounded ml-2"></i>
                <h4>Looks like this is empty! Mark a job as "applied" or "save for later" to review it</h4>
              </div>
        }
      </div>
    )
  }
}