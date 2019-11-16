import React, { Component } from 'react'
import { Table , Card, Accordion, Button, Spinner } from 'react-bootstrap'
import axios from 'axios'
import moment from 'C:/Users/Nasko Daskalov/AppData/Local/Microsoft/TypeScript/3.6/node_modules/moment/moment'

export default class Fixtures extends Component {
    constructor (props) {
        super(props)

        this.state = {
            fixtures: [],
            isResultLoaded: false,
            leaguesByCountry: [],
            fixturesByLeague: [],
            fixturesLoaded: false
        }
    }

    componentDidMount () {
        Promise.all([
            this.getLeagueData()
          ]).then(response => {
              this.setState({ leaguesByCountry: response[0], isResultLoaded: true })
                
            })
    }
    
    getLeagueData() {
        return new Promise((resolve) => {
            const proxyurl = "https://cors-anywhere.herokuapp.com/";
            resolve(axios(`${proxyurl}https://livescore-api.com/api-client/fixtures/leagues.json?key=3dbxhYW6Xoftlh5V&secret=kg6urHhfYtFTY301hbzyavE7UUBfbHbv`).then(response => {
                let countries = []
                for (let i = 0; i < Object.values(response.data).length; i++) {
                    const element = Object.values(response.data)[i];
                    countries.push(element)
                }
                let arr = countries[1].leagues.filter(c => c.country_name.toLowerCase() === this.props.leaguename.toLowerCase())
                return arr
            }))
        })
    }

    getFixtures(leagueid) {
        return new Promise((resolve) => {
            const proxyurl = "https://cors-anywhere.herokuapp.com/";
            resolve(axios(`${proxyurl}https://livescore-api.com/api-client/fixtures/matches.json?key=3dbxhYW6Xoftlh5V&secret=kg6urHhfYtFTY301hbzyavE7UUBfbHbv&league=${leagueid}`).then(response => {
                this.setState({ fixturesByLeague: response.data.data.fixtures, fixturesLoaded: true })
            }))
         })
    }

    showEvent(e) {
        let el = e.target
            if (el.firstElementChild != null && el.firstElementChild.tagName.toLowerCase() === "button") {
                el.firstElementChild.click();
            }
        this.getFixtures(e.target.dataset.leagueid)
    }
    render() {
        let gamesByLeague = this.state.fixturesByLeague.map((match, index) => {
            let matchDate = moment(match.date).format("DD.MM.YY")
            let matchTime = match.time.split(":")[0] + ":" + match.time.split(":")[1]
               return (
                <tr key={index}>
                    <td className='competition-name pl-3'>{matchDate} <br /> {matchTime}</td>
                    <td>{match.home_name}</td>
                    <td>{match.away_name}</td>
                    <td>
                    {match.location}
                    </td>
                </tr>) 
        })
        let leagues = this.state.leaguesByCountry.map((league, index) => (
                            <Accordion key={index}>
                            <Card className='bordered-card' onClick={this.showEvent.bind(this)} >
                                <Card.Header  data-leagueid={league.league_id}>
                                <Accordion.Toggle as={Button} variant="link" eventKey={index}  data-leagueid={league.league_id}>
                                    {league.league_name}
                                </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey={index}>
                                <Card.Body>
                                <Table striped hover size="sm">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Home team</th>
                                            <th>Away team</th>
                                            <th>Stadium</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { !this.state.fixturesLoaded ? (
                                            <td colSpan="4">
                                                <Spinner animation="border" role="status" className="fixture-spinner">
                                                    <span className="sr-only">Loading...</span>
                                                </Spinner>
                                            </td>
                                        ) : (
                                            this.state.fixturesByLeague.length > 0 ? (
                                                gamesByLeague
                                            ) : (
                                                <td colSpan="4" className="text-center">
                                                    No data
                                                </td>
                                            )
                                        )}
                                    </tbody>
                                </Table>
                                </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                            </Accordion>
        ))

            if (!this.state.isResultLoaded) {
                return (
                  <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                  </Spinner>
                )
              }

            if (this.state.leaguesByCountry.length === 0){
                return (
                    <div className='livescores-container'>
                        <h4>Upcoming games in {this.props.leaguename}</h4>
                        <Table striped bordered hover size="sm">
                            <tbody>
                                <tr>
                                    <td colSpan="5">No data!</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                )
            }

            return (
                <div className='livescores-container'>
                    <Accordion onClick={this.showEvent.bind(this)} className="fixtures-accordion" defaultActiveKey={window.innerWidth >= 951 ? "upcomingfixtures" : ""}>
                      <Card className='bordered-card'>
                        <Card.Header>
                            { window.innerWidth < 951 ? (
                                <Accordion.Toggle as={Button} variant="link" eventKey='upcomingfixtures'>
                                    Upcoming games in {this.props.leaguename}
                              </Accordion.Toggle>
                            ) : (
                                `Upcoming games in ${this.props.leaguename}`
                            )}
                        </Card.Header>
                        <Accordion.Collapse eventKey='upcomingfixtures'>
                          <Card.Body>
                          {leagues}
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                    </Accordion>
                </div>
        )
    }
}