import React, { Component } from 'react';
import Navbar from './Navbar/Navbar';
import JobQueue from './JobQueue/JobQueue';
import SettingsContainer from './Settings/SettingsContainer';
import ReviewContainer from './Review/ReviewContainer';
import Help from './Help/Help';
import CallToAction from './CallToAction/CallToAction';
import client from './utils/client';
const VIEW = "View Jobs";
const SETTINGS = "Job Hunt Settings";
const REVIEW = "Job Hunt Review";
const HELP = "Help";
/*
  Receives jobQueueData object and renders the app
*/

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      jobQueueData: [],
      _loading: true,
      navLocation: VIEW,
      savedForLater: [],
      appliedJobs: [],
      _id: localStorage.getItem('_id') || null
    }
  }

  componentDidUpdate(props) {
    if(this.state._loading) {
      this.getJobData();
    }
  }

  componentDidMount() {
    if (this.state._id) {
      this.getJobData();
    }
  }

  getJobData = () => {
    this.loadSavedJobsFromServer();
    this.loadAppliedJobsFromServer();
    this.loadJobQueueFromServer();
  }

  loadJobQueueFromServer = () => {
    client.getJobQueue(this.state._id, (response) => {
      return this.setState({
        jobQueueData: response.data,
      })
    });
  }

  loadSavedJobsFromServer = () => {
    client.getSavedJobs(this.state._id, (response) => {
      return this.setState({
        savedForLater: response.data
      })
    })
  }

  loadAppliedJobsFromServer = () => {
    client.getAppliedJobs(this.state._id, (response) => {
      return this.setState({
        appliedJobs: response.data,
        _loading: false
      })
    })
  }

  handleSidebarNavigation = (location) => {
    this.setState({
      navLocation: location
    })
  }

  handleJobQueueAction = (action, jobId) => {
    switch(action) {
      case "save":
        return client.saveJobForLater(this.state._id, jobId, (response) => {
          this.removeFromQueue(jobId);
        });

      case "applied":
        return client.jobApplied(this.state._id, jobId, (response) => {
          this.removeFromQueue(jobId);
        })

      case "remove":
        return client.removeJob(this.state._id, jobId, (response) => {
          this.removeFromQueue(jobId);
        })

      default:
        break;
    }
  }

  removeFromQueue = (jobId) => {
    return client.removeJob(this.state._id, jobId, (response) => {
      const updatedJobQueue = this.state.jobQueueData.filter((job) => {
        if(job._id === jobId) {
          return false;
        } else return true;
      })

      this.setState({ jobQueueData: updatedJobQueue })
    })
  }

  sortList = (jobDataKey) => {
    return (e) => {
      if (jobDataKey === "index") {
        return client.getJobQueue(this.state._id, (response) => {
          return this.setState({
            jobQueueData: response.data,
          })
        });
      }

      var jobQueueData = this.state.jobQueueData;

      if (jobDataKey=== "jobTitle") {
        jobQueueData.sort((a, b) => {
          var titleA = a[jobDataKey].toUpperCase();
          var titleB = b[jobDataKey].toUpperCase();
          return (titleA < titleB) ? -1 : (titleA > titleB) ? 1 : 0;
      })} else jobQueueData.sort((a, b) => {
          var dateA = new Date(a[jobDataKey]);
          var dateB = new Date(b[jobDataKey]);
          return dateA>dateB ? -1 : dateA<dateB ? 1 : 0;
      });

      return this.setState({ jobQueueData });
    }
  }

  renderDashboardView = () => {
    switch(this.state.navLocation) {
      case VIEW:
        return(
          <JobQueue
            jobQueueData={this.state.jobQueueData}
            handleClick={this.handleJobQueueAction}
            sortList={this.sortList}
           />
        )
      case SETTINGS:
        return(
          <SettingsContainer _id={this.state._id} />
        )
      case REVIEW:
        return(
          <ReviewContainer _id={this.state._id} />
        )
      case HELP:
        return(
          <Help />
        )
      default:
        break;
    }
  }

  handleLogin = (_id) => {
    localStorage.setItem('_id', _id);
    this.setState({ _id: _id });
  }

  render() {
    if(this.state._id === null) {
      return(
        <div id="app" className="container-fluid">
          <CallToAction onLogin={this.handleLogin} />
        </div>
      )
    } else if (this.state._loading) {
      return(
        <div id="app" className="container-fluid">
        <div className="row">
          <i className="fa fa-spinner fa-spin fa-3x fa-fw col-sm-12" />
          <span className="sr-only">Loading...</span>
        </div>
      </div>
      )
    }
    return (
      <div id="app" className="container-fluid h-100">
        <div className="main-nav row no-gutters">
            <div className="logo col-2">
              <img className="ml-5" src="https://image.ibb.co/dQbyCw/logo.jpg" role="presentation"></img>
            </div>
            <div className="col-10">
              <a href="#" onClick={() => {
                this.setState({
                  _id: null,
                  jobQueueData: [],
                  _loading: true,
                  navLocation: VIEW,
                  savedForLater: [],
                  appliedJobs: []
                });
                localStorage.removeItem('_id');
                }}>Logout</a>
            </div>
        </div>
        <div className="row no-gutters">
          <div className="col-12 col-sm-2">
            <Navbar
              type="sidebar"
              handleClick={this.handleSidebarNavigation}
              active={this.state.navLocation}
              options={[VIEW, SETTINGS, REVIEW, HELP]}
              />
          </div>
          <div className="col-12 col-sm-10">
            {this.renderDashboardView()}
          </div>
        </div>
      </div>
    );
  }
}
