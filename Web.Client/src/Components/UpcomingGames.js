import React, { Component } from 'react'
import { Card, Accordion, Button, Spinner, ListGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'

export default class UpcomingGames extends Component {
  constructor (props) {
      super(props)

      this.state = {
          upcomingGames: [],
          leagues: [],
          isContentLoaded: false
      }
  }

  componentDidMount () {
    this.getUpcomingGames().then((response) => {
      let todayDate = moment().format("YYYY-MM-DD");
      let games = response.response.g.filter(m => moment.unix(m.dt).format("YYYY-MM-DD") === todayDate)
      this.setState({
        upcomingGames: games,
        leagues: response.response.c,
        isContentLoaded: true
      })
    })
  }

  getUpcomingGames() {
    return new Promise((resolve) => {
      resolve(axios(`https://www.scorebat.com/api/feed/`).then(response => {
        const matches = response.data
        return matches
      }))
    })
  }

  showEvent(e) {
      let el = e.target
      if (el.firstElementChild != null && el.firstElementChild.tagName.toLowerCase() === "button") {
          el.firstElementChild.click();
      }
  }

  render() {
    let games = []
    games = this.state.upcomingGames.map((match, index) => {
      let date = moment.unix(match.dt).format('YYYY-MM-DD')

      return (
          <ListGroup.Item  key={index}>
              <Link to={`/live/${date}/${match.s1.replace("-", "")} - ${match.s2.replace("-", "")}`}>
              
              {match.s1} vs {match.s2}
              <span className="match-date">
              {this.state.leagues[match.c].n} {moment.unix(match.dt).format('HH:mm')}
              </span>
              </Link>
          </ListGroup.Item>
      )
    })

    if (!this.state.isContentLoaded) {
        return (
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        )
      }

    if (this.state.upcomingGames.length > 0) {
        return (
            <div className='livescores-container'>
            <Accordion onClick={this.showEvent.bind(this)} defaultActiveKey={window.innerWidth >= 951 ? "livescore" : ""}>
              <Card className='bordered-card'>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey='livescore'>
                  <h4>Upcoming today</h4>
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
                  <h4>Upcoming today</h4>
                <ListGroup variant="flush">
                <ListGroup.Item>
                    No games today.
                </ListGroup.Item>
                </ListGroup>
            </div>
        )
    }
  }
}