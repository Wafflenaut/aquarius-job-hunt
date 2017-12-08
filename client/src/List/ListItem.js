import React, { Component } from 'react';

export default class ListItem extends Component {
  handleClick = () => {
    this.props.handleClick(this.props.itemData);
  }

  getEmojis = () => {
    var emojiArray = [];
    const index= Number(this.props.itemData.strength);

    if(this.props.name === "Location") {
        emojiArray = [
          <i className="em em-neutral_face" />,
          <i className="em em-slightly_smiling_face" />,
          <i className="em em-blush" />,
          <i className="em em-grinning" />
        ]
        return emojiArray[index];

    } else if(this.props.name === "Job Title") {
        emojiArray = [
          <i className="em em-slightly_frowning_face" />,
          <i className="em em-neutral_face" />,
          <i className="em em-slightly_smiling_face" />,
          <i className="em em-blush" />,
          <i className="em em-grinning" />
        ]

        return emojiArray[index + 1];
    } else if (this.props.name === "Keywords") {
        emojiArray = [
          <i className="em em-slightly_frowning_face" />,
          <i className="em em-slightly_smiling_face" />,
          <i className="em em-blush" />,
          <i className="em em-grinning" />
        ]
        return (index === -1) ? emojiArray[index+1] : emojiArray[index];
    }
  }

  render() {
    var emoji = (this.getEmojis());

    return(
      <div className="row no-gutters">
        <div className="col-2">
          {emoji}
        </div>
        <div className="col-8">
          {this.props.itemData.preference}
        </div>
        <div className="col-2">
          <i className="fa fa-remove" onClick={this.handleClick} />
        </div>
      </div>
    )
  }
}