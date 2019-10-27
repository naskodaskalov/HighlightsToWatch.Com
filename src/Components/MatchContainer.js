import React, { Component } from 'react'
import { Row, Col, Card, ListGroup, Accordion, Button, Badge } from 'react-bootstrap'
import Moment from 'react-moment'
import 'moment-timezone'
import * as moment from 'moment'

export default class MatchContainer extends Component {
    showEvent(e) {
        let el = e.target
        if (el.firstElementChild != null && el.firstElementChild.tagName.toLowerCase() === "button") {
            el.firstElementChild.click()
        }
    }

checkGame(date) {
    let newDate = moment(date).add("1", "hour").add("50", "minutes")
    return newDate > moment()
}

    render() {
        return (
            <Card>
                <Card.Header eventKey={this.props.video.title} onClick={this.showEvent.bind(this)}>
                <Accordion.Toggle as={Button} variant="link" eventKey={this.props.video.title} >
                {this.props.video.side1.name} vs {this.props.video.side2.name}
                <span className="match-date">
                    <Moment format="DD.MM.YYYY HH:MM">{this.props.video.date}</Moment>
                {/* { (this.props.video.date).split("T")[0] } { (this.props.video.date).split("T")[1].split("+")[0] } */}
                <Badge variant={ this.checkGame() ? "warning" : "success" }>{ this.checkGame(this.props.video.date) ? "Live" : "" }</Badge>
                </span>
                
                <div className="league-name">League: {this.props.video.competition.name}</div>
                </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey={this.props.video.title}>
                <Card.Body>
                    <Row>
                        <Col>
                        <Card.Img src={this.props.video.thumbnail} className='videoimg' alt={this.props.video.title} />
                        </Col>
                        <Col>
                        <ListGroup variant="flush">
                            {this.props.video.videos.map((v, index) => (
                            <ListGroup.Item key={index} data-matchname={this.props.video.title} data-video={v.embed} data-videotitle={v.title} onClick={this.props.handleClickEvent} className='highlights'>{v.title}</ListGroup.Item>
                            ))}
                        </ListGroup>
                        </Col>
                    </Row>
                </Card.Body>
                </Accordion.Collapse>
            </Card>
        )
    }
}