import React, { Component } from 'react';
import List from '../List/List';
import SettingForm from './SettingForm';
import JobPrioritySettings from './JobPrioritySettings';


export default class SettingView extends Component {
  renderFormAndList = (location) => {
    if(location === "Priority") {
      return (
        <div className="row no-gutters">
          <div className="col-sm-12 text-center setting-view">
            <JobPrioritySettings
              priorityList={this.props.settingList}
              onSubmit={this.props.updatePriority}
            />
          </div>
        </div>
      )
    } else return (
      <div className="row no-gutters setting-view">
        <div className="col-sm-6">
          <div className="row no-gutters">
            <div className="col-sm-12 search default-border">
              <h2 className="setting-header text-center">Add A Preference</h2>
              <SettingForm
                name={this.props.name}
                type={this.props.type}
                onSubmit={this.props.onSubmit}
                list={this.props.settingList}
              />
            </div>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="row no-gutters">
            <div className="col-sm-12 list default-border">
              <List
                name={this.props.name}
                list={this.props.settingList}
                handleClick={this.props.removeItem}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    return(
      <div className="settings">
        {this.renderFormAndList(this.props.name)}
      </div>
    )
  }
}