import React, { Component } from 'react';


/*
  Presentational Component contains a short description of the job
  input - jobData
*/
export default class ItemDescription extends Component {
  render() {
    const { jobData } = this.props;
    const snippet = jobData.snippet.replace('...','');

    return(
      <div className="item-info col-sm-12">
        <h2 className="col-sm-12 job-title">
          {jobData.jobTitle}
        </h2>
        <p className="col-sm-12 col-sm-offset-1 ellipsis snippet">
          {snippet}
        </p>
        <p className="company col-sm-12">
          {jobData.company}
        </p>
        <p className="location col-sm-12">
          {jobData.city}, {jobData.state}
        </p>
      </div>
    )
  }
}