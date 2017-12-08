import React, { Component } from 'react';
import ListItem from './ListItem';


export default class List extends Component {
  render() {
    const listItems = this.props.list.map((listObject, index) => {
      return(
        <div className="ml-2 mr-2 text-center setting-item" key={index}>
          <ListItem name={this.props.name} key={index} itemData={listObject} handleClick={this.props.handleClick}/>
        </div>
      )
    })

    return(
      <div className="mb-3 text-center">
        <h2 className="setting-header mb-3">My Preferences</h2>
        {listItems}
      </div>
    )
  }
}