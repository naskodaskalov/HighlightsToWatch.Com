import React, { Component } from 'react'
import { Table , Card, Accordion, Button, Spinner } from 'react-bootstrap'
import axios from 'axios'

export default class Livescores extends Component {
    constructor (props) {
        super(props)

        this.state = {
            livegames: [],
            isLivescoreLoaded: false
        }
    }

    componentDidMount () {
        Promise.all([
            this.getLivescores()
          ]).then(response => {
                let result = response[0].data.match.filter(m => m.status !== "FINISHED")
                result.sort((function (a, b) {
                    if (a.scheduled > b.scheduled) {
                        return 1;
                    } else {
                        return -1;
                    }
                }))

                this.setState({
                    livegames: result,
                    isLivescoreLoaded: true
                })
            })
    }

    getLivescores() {
        return new Promise((resolve) => {
            const proxyurl = "https://cors-anywhere.herokuapp.com/";
          resolve(axios( proxyurl + 'http://livescore-api.com/api-client/scores/live.json?key=3dbxhYW6Xoftlh5V&secret=kg6urHhfYtFTY301hbzyavE7UUBfbHbv').then(response => {
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
        let games
            games = this.state.livegames.map((match, index) => (
                <tr key={index}>
                    <td className='competition-name pl-3'>{match.competition_name}</td>
                    <td>{match.home_name}</td>
                    <td className='score-column'>{match.score} <br /> {match.status === "IN PLAY" && match.ht_score !== "" ? "(" + match.ht_score + ")" : ""}</td>
                    <td>{match.away_name}</td>
                    <td>
                    {match.status === "FINISHED" ?
                        match.status
                        : match.status === "IN PLAY" ? 
                            match.time + '"'
                            : match.scheduled}
                    </td>
                </tr>
            ))
        
            if (!this.state.isLivescoreLoaded) {
                return (
                  <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                  </Spinner>
                )
              }

            if (this.state.livegames.length > 0) {
                return (
                    <div className='livescores-container'>
                    <Accordion onClick={this.showEvent.bind(this)} defaultActiveKey={window.innerWidth >= 951 ? "livescore" : ""}>
                      <Card className='bordered-card'>
                        <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey='livescore'>
                            Livescores
                          </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey='livescore'>
                          <Card.Body>
                          <Table striped hover size="sm">
                            <thead>
                                <tr>
                                    <th>League</th>
                                    <th>Home team</th>
                                    <th>FT (HT)</th>
                                    <th>Away team</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {games}
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
                    <div className='livescores-container'>
                        <h4>Livescores</h4>
                        <Table striped bordered hover size="sm">
                            <tbody>
                                <tr>
                                    <td colSpan="5">No live events!</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                )
            }
    }
}