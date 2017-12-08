import React, { Component } from 'react';
import SettingView from './SettingView';
import Navbar from '../Navbar/Navbar';
import client from '../utils/client';
const LOCATION = "Location";
const JOB_TITLE = "Job Title";
const KEYWORDS = "Keywords";
const PRIORITY = "Priority";
const NAVARRAY = [LOCATION, JOB_TITLE, KEYWORDS, PRIORITY];
const TYPEARRAY = ["location", "jobTitle", "keyword"]

export default class SettingContainer extends Component {
  constructor() {
    super();

    this.state = {
      settingViewIndex: 0,
      settingList: [[], [], [], []],
    }
  }

  componentDidMount() {
    client.getUserPreferences(this.props._id, (response) => {
      this.setState({
        settingList: response.data
      })
    })
  }

  handleSettingNavigation = (navLocation) => {
    return this.setState({
      settingViewIndex: NAVARRAY.indexOf(navLocation)
    })
  }

  handleListAppend = (listObject) => {
    return client.addUserPreference(this.props._id, listObject, (response) => {
      this.appendToList(listObject, this.state.settingViewIndex);
    });
  }

  handleListItemRemoval = (listObject) => {
    client.removeUserPreference(this.props._id, listObject, (response) => {
      this.removeListItem(listObject, this.state.settingViewIndex);
    });
  }

  handlePriorityUpdate = (newPriorityArray) => {
      var oldPriorityArray = this.state.settingList[this.state.settingViewIndex];
      var isSame = this.compareArray(newPriorityArray, oldPriorityArray);

    if (!isSame) {
      //if location changed
      if(newPriorityArray[0] !== oldPriorityArray[0]) {
        client.updateLocationPriority(this.props._id, newPriorityArray[0]);
      }
      //if jobTitle changed
      if(newPriorityArray[1] !== oldPriorityArray[1]) {
        client.updateJobTitlePriority(this.props._id, newPriorityArray[1]);
      }
      //if keyword changed
      if(newPriorityArray[2] !== oldPriorityArray[2]) {
        client.updateKeywordPriority(this.props._id, newPriorityArray[2]);
      }

      var updatedList = this.state.settingList;
      updatedList[this.state.settingViewIndex] = newPriorityArray;
      this.setState({
        settingList: updatedList
      });
    }
  }

  appendToList = (listObject, index) => {
    var updatedList = this.state.settingList;
    updatedList[index].push(listObject);

    this.setState({
      settingList: updatedList
    });
  }

  removeListItem = (oldListObject, settingViewIndex) => {
    var settingList = this.state.settingList;
    var newSettingList = settingList[settingViewIndex].filter(listObject => listObject !== oldListObject);
    settingList[settingViewIndex] = newSettingList;

    this.setState({
      settingList: settingList
    });
  }

  compareArray = (array1, array2) => {
    let isTrue = true;

    array1.forEach((value, index) => {
      if(value !== array2[index]) {
        isTrue = false;
      }
    })

    return isTrue;
  }

  render() {
    const {settingViewIndex} = this.state;
    return(
      <div className="ml-sm-5 dashboard-item">
        <Navbar
          type="settings"
          options={NAVARRAY}
          handleClick={this.handleSettingNavigation}
          active={NAVARRAY[this.state.settingViewIndex]}
        />
        <SettingView
          name={NAVARRAY[this.state.settingViewIndex]}
          type={TYPEARRAY[this.state.settingViewIndex]}
          settingList={this.state.settingList[settingViewIndex]}
          onSubmit={this.handleListAppend}
          removeItem={this.handleListItemRemoval}
          updatePriority={this.handlePriorityUpdate}
        />
      </div>
    )
  }
}