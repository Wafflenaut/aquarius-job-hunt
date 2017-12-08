import React, { Component } from 'react';
import ItemDescription from './ItemDescription';
import ItemActionButtons from './ItemActionButtons';
const helpers = require('../utils/helpers');


/*
  Renders a single item from the queue
  Input: jobData and day's since post
  Output: index, jobInfoContainer and jobActionButtons.
*/
export default class JobQueueItem extends Component {
  render() {
    const daysSincePost = helpers.daysSincePost(this.props.jobData.date);

    return(
      <div className="row no-gutters job-queue-item">
        <div className="col-xs-12 col-sm-2 index">
          {this.props.index+1}
        </div>
        <div className="text-left col-xs-12 col-sm-6">
          <ItemDescription jobData={this.props.jobData}/>
        </div>
        <div className="col-xs-12 col-sm-2 text-center days-since">
          <p><em>{daysSincePost} Days Ago</em></p>
        </div>
        <div className="col-xs-12 col-sm-2">
          <ItemActionButtons
            jobData={this.props.jobData}
            daysSincePost={daysSincePost}
            handleClick={this.props.handleClick}
          />
        </div>
      </div>
    )
  }
}