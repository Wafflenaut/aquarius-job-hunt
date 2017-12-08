import React, { Component } from 'react';
const classNames = require('classnames');


const NavbarItem = function(props) {
  const navClass = classNames({
    'nav-link': true,
    'active': props.active
  })

  return(
    <a className={navClass} onClick={() => {
      props.handleClick(props.description)
    }} href="#">
      {props.description}
    </a>
  )
}

export default class Navbar extends Component {
  renderNavbarItems = (type, options) => {
    var itemClass = classNames({
      "nav-item": true,
      "col-3 col-sm-3 ": type === "settings"
    })

    return options.map((item, index) => {
      return(
        <li key={index} className={itemClass}>
          <NavbarItem
            description={options[index]}
            active={(this.props.active === options[index])}
            handleClick={this.props.handleClick}
          />
        </li>
      )
    })
  }

  render() {
    const itemClass = classNames({
      "nav nav-pills flex-column text-center": this.props.type === "sidebar",
      "nav nav-pills row no-gutters headers text-center": this.props.type === "settings"
    })

    return(
      <div id={this.props.type}>
        <div className={itemClass}>
          {this.renderNavbarItems(this.props.type, this.props.options)}
        </div>
      </div>
    )
  }
}