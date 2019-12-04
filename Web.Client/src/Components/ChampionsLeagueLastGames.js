import React, { Component } from 'react'
import { Card, Accordion, Button, Spinner, ListGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import db from '../Config/Database'

export default class ChampionsLeagueLastGames extends Component {
    constructor (props) {
        super(props)

        this.state = {
            lastGames: [],
            isContentLoaded: false
        }
    }

    componentDidMount () {
        var wednesdayGames = db.database().ref("matches/11-27-2019");
        var tuesdayGames = db.database().ref("matches/11-26-2019");
        let games = []
        let arr = []
        wednesdayGames.once("value").then(function (snapshot) {
            games = snapshot.val()
        }).then(function () {
            for (let i = 0; i < Object.values(games).length; i++) {
              const element = Object.values(games)[i];
              if (element.competition.name.indexOf("CHAMPIONS LEAGUE") > -1) {
                arr.push(element)
              }
            }
        }).then(() => {
            tuesdayGames.once("value").then(function (snapshot) {
                games = snapshot.val()
            }).then(function () {
                for (let i = 0; i < Object.values(games).length; i++) {
                  const element = Object.values(games)[i];
                  if (element.competition.name.indexOf("CHAMPIONS LEAGUE") > -1) {
                    arr.push(element)
                  }
                }
            }).then(() => {
                this.setState({ lastGames: arr, isContentLoaded: true })
            })
        })
    }

    showEvent(e) {
        let el = e.target
        if (el.firstElementChild != null && el.firstElementChild.tagName.toLowerCase() === "button") {
            el.firstElementChild.click();
        }
    }

    render() {
        let games
            games = this.state.lastGames.map((match, index) => (
                <ListGroup.Item  key={index}>
                    <Link to={`/match/${match.date.split("T")[0]}/${match.title}`}>{match.side1.name} vs {match.side2.name}</Link>
                </ListGroup.Item>
            ))
        
            if (!this.state.isContentLoaded) {
                return (
                  <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                  </Spinner>
                )
              }

            if (this.state.lastGames.length > 0) {
                return (
                    <div className='livescores-container'>
                    <Accordion onClick={this.showEvent.bind(this)} defaultActiveKey={window.innerWidth >= 951 ? "livescore" : ""}>
                      <Card className='bordered-card'>
                        <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey='livescore'>
                          <h4>Champions League last round</h4>
                          </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey='livescore'>
                          <Card.Body>
                        <ListGroup variant="flush">
                            {games}
                        </ListGroup>
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                    </Accordion>
                    </div>
                )
            } else {
                return (
                    <div className='livescores-container'>
                          <h4>Champions League last round</h4>
                        <ListGroup variant="flush">
                        <ListGroup.Item>
                            No live events.
                        </ListGroup.Item>
                        </ListGroup>
                    </div>
                )
            }
    }
}