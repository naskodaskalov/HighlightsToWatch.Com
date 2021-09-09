import React, { Component } from 'react'
import { Card, Accordion, Button, Spinner, Table } from 'react-bootstrap'
import axios from 'axios'

export default class LiveStandings extends Component {
  constructor (props) {
      super(props)

      this.state = {
            standings: [],
            isContentLoaded: false
      }
  }

  componentDidMount () {
    this.getLiveStandings().then((response) => {
      if (response.response != null) {
        this.setState({
          standings: response.response.standings != null ? response.response.standings.rows : [],
          isContentLoaded: true
        })
      } else {
        this.setState({
          standings: [],
          isContentLoaded: true
        })
      }
    })
  }

  getLiveStandings() {
    let competition = this.props.competition
    let country = competition.split(":")[0].trim()
    let league = competition.split(":")[1].trim().replace(" ", "-").replace(" ", "-").replace(" ", "-").replace(",", "").replace(",", "").replace(",", "")
    return new Promise((resolve) => {
      resolve(axios(`https://www.scorebat.com/api/competition/${country}/${league}`).then(response => {
        return response.data
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
    let standings = []
    standings = this.state.standings.map((team, index) => {
      let currentTeam = team.team === this.props.homeTeam ? "currentTeam" : team.team === this.props.awayTeam ? "currentTeam" : ""
      return (
        <tr  key={index} className={`text-left ${currentTeam}`}>
          <td className='text-center'>{team.row} .</td>
          <td>{team.team}</td>
          <td className='text-center'>{team.p}</td>
          <td className='text-center'>{team.w}</td>
          <td className='text-center'>{team.d}</td>
          <td className='text-center'>{team.l}</td>
          {window.innerWidth >= 951 ? (
          <td className='text-center'>{team.fa1 - team.fa2} ({team.fa1}:{team.fa2})</td>
                    ) : (
                      <td className='text-center'>{team.fa1 - team.fa2}</td>
                    )}
          <td className='text-center'>{team.pnt}</td>
        </tr>
      )
    })

    if (!this.state.isContentLoaded) {
        return (
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        )
      }

    if (this.state.standings.length > 0) {
        return (
            <div>
            <Accordion onClick={this.showEvent.bind(this)} className='mt-2' defaultActiveKey={this.props.isLivePage ? "livestandings" : ""}>
              <Card className='bordered-card'>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey='livestandings'>
                  Live standings
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey='livestandings'>
                  <Card.Body>
                  <Table striped bordered hover size="sm">
                    <thead>
                    {window.innerWidth >= 951 ? (
                      <tr>
                        <th>Position</th>
                        <th>Team</th>
                        <th>Played</th>
                        <th>Wins</th>
                        <th>Draws</th>
                        <th>Losts</th>
                        <th>Goal Difference</th>
                        <th>Points</th>
                      </tr>
                    ) : (
                      <tr>
                        <th>#</th>
                        <th>Team</th>
                        <th>Pl</th>
                        <th>W</th>
                        <th>D</th>
                        <th>L</th>
                        <th>GD</th>
                        <th>P</th>
                      </tr>
                    )}
                    </thead>
                    <tbody>
                    {standings}
                    </tbody>
                  </Table>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
            </div>
        )
    } else {
        return (
          <Accordion onClick={this.showEvent.bind(this)} className='mt-2' defaultActiveKey={this.props.isLivePage ? "livestandings" : ""}>
          <Card className='bordered-card'>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey='livestandings'>
              Live standings
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey='livestandings'>
              <Card.Body>
              <p className='text-center'>No data</p>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
        )
    }
  }
}