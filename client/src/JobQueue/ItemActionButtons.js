import React, { Component } from 'react';
import { Modal } from 'reactstrap';
import ReactTooltip from 'react-tooltip';
import DetailModal from './DetailModal';


/*
  Displays all of the action buttons for the jobQueueItem
  Input - jobData and daysSincePost
  Output - 4 buttons
*/
export default class ItemActionButtons extends Component {
  constructor() {
    super();

    this.state = {
      showModal: false
    }
  }

  toggleModalVisibility = () => {
    return this.setState({
      showModal: !this.state.showModal
    });
  }

  handleClick = (action) => {
    const props = this.props;

    return function(e) {
      props.handleClick(action, props.jobData._id);
    }
  }

  render() {
    return(
      <div className='d-flex flex-row justify-content-around item-action-buttons'>
        <i data-tip data-for="viewDetails" className="item-hl fa fa-eye" onClick={this.toggleModalVisibility} />
        <ReactTooltip id="viewDetails" place="right" type="dark" effect="solid">View Details</ReactTooltip>
        <Modal
          isOpen={this.state.showModal}
          toggle={this.toggleModalVisibility}
          className="modal-lg"
        >
          <DetailModal toggle={this.toggleModalVisibility} {...this.props} />
        </Modal>
        <i data-tip data-for="save" className="item-hl fa fa-save" onClick={this.handleClick("save")} />
        <ReactTooltip id="save" place="right" type="dark" effect="solid">Save For Later</ReactTooltip>
        <i data-tip data-for="applied" className="item-hl fa fa-check-square-o" onClick={this.handleClick("applied")} />
        <ReactTooltip id="applied" place="right" type="dark" effect="solid">Mark As Applied</ReactTooltip>
        <i data-tip data-for="delete" className="item-hl fa fa-window-close-o" onClick={this.handleClick("remove")} />
        <ReactTooltip id="delete" place="right" type="dark" effect="solid">Not Interested</ReactTooltip>
      </div>
    )
  }
}