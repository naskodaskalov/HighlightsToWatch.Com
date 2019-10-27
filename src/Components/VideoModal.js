import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'

export default class VideoModal extends Component {
  // constructor (props){
  //   super(props)
    
  //   this.state = {
  //     show: props.show
  //   }
  // }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
            <Modal.Header closeButton>
              <Modal.Title>{this.props.match.chosenMatch}: {this.props.match.videoTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div dangerouslySetInnerHTML={ { __html: `${this.props.match.videoToWatch}` } }></div>
              </Modal.Body>
          </Modal>
    )
  }
}
