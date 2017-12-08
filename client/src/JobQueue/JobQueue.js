import React, { Component } from 'react';
import JobQueueItem from './JobQueueItem'


/*
  Renders a jobQueueItem for every item in the array
  nput: jobData
  Output: 0-n jobQueueItems
*/
export default class JobQueue extends Component {
  renderJobQueueItems() {
      return this.props.jobQueueData.map((job, index) => {
        return(
          <JobQueueItem
            key={index}
            index={index}
            jobData={job}
            handleClick={this.props.handleClick}
          />
        )
      })
  }

  render() {
    return(
      <div>
        {
          (this.props.jobQueueData.length && this.props.jobQueueData[0] !== null) ?
          <div className="row dashboard-item ml-sm-5 mr-sm-5">
            <div className="col-sm-12 job-queue">
              <div className="row no-gutters text-center sticky-top bg-white header">
                <div className="item col-3 col-sm-2" onClick={this.props.sortList("index")}><p>Rank</p></div>
                <div className="item col-3 col-sm-6" onClick={this.props.sortList("jobTitle")}><p>Description</p></div>
                <div className="item col-3 col-sm-2" onClick={this.props.sortList("date")}><p>Date</p></div>
                <div className="item col-3 col-sm-2"><p>Actions</p></div>
              </div>
              {this.renderJobQueueItems()}
            </div>
          </div>

          :

          <div className="empty-box text-center w-100">
            <i className="em em-confounded ml-2"></i>
            <h4>You don't have any jobs to display, go to "settings" and add some preferences!</h4><br /><h6>If you just signed up, hang tight! Our minions are working to get your jobs!</h6>
          </div>
        }
      </div>
    )
  }
}

