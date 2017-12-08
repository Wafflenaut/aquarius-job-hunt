import React, { Component } from 'react';
const classNames = require('classnames');
const SAVED = "saved";
const APPLIED = "applied";


const ReviewListItem = function(props){
  function handleItemClick(id){
    return (e) => {
      props.handleClick(id);
    }
  }

  const { jobData } = props;

  const itemClass = classNames({
    "item-info": true,
    "w-100": true,
    "h-100": true,
    "active": props.activeItem
  });

  return(
    <div id="review-item" className={itemClass} onClick={handleItemClick(jobData._id)}>
      <div className="m-3 job-title">
        <h2>
          {jobData.jobTitle}
        </h2>
      </div>
      <div className="location col-12">
        {jobData.city}, {jobData.state}
      </div>
    </div>
  )
}

export default class ReviewList extends Component {
  handleCategoryChange = (category) => {
    return (e) => {
      this.props.handleCategoryChange(category);
    }
  }

  renderJobQueueItems(activeView) {
    if (activeView === SAVED) {
      return this.props.savedJobs.map((jobData, index) => {
        var active = (jobData._id === this.props.activeJobId) ? true : false;

        return (
          <ReviewListItem
            key={index}
            jobData={jobData}
            handleClick={this.props.handleJobClick}
            activeItem={active}
          />
        )
      })
    } else if (activeView === APPLIED) {
      return this.props.appliedJobs.map((jobData, index) => {
        var active = (jobData._id === this.props.activeJobId) ? true : false;

        return (
          <ReviewListItem
            key={index}
            jobData={jobData}
            handleClick={this.props.handleJobClick}
            activeItem={active}
          />
        )
      })
    }
  }

  render() {
    const jobQueueItems = this.renderJobQueueItems(this.props.activeView);

    const renderListStatus = () => {
      const appliedClass = classNames({
        statusItem: true,
        active: (this.props.activeView === APPLIED) ? true : false,
        "col-6": true
      });

      const savedClass = classNames({
        statusItem: true,
        active: (this.props.activeView === SAVED) ? true : false,
        "col-6": true
      });

      return(
        <div className="col-12 list-status text-center">
          <div className="row no-gutters">
            <a
              className={appliedClass}
              onClick={this.handleCategoryChange("applied")
            }
            >
              Applied
            </a>
            <a
              className={savedClass}
              onClick={this.handleCategoryChange("saved")}
            >
              Saved
            </a>
          </div>
        </div>
      )
    }

    return(
      <div id="review-list" className="col-sm-4 bg-white br-light">
        <div className="row no-gutters">
          {renderListStatus()}
          {jobQueueItems}
        </div>
      </div>
    )
  }
}