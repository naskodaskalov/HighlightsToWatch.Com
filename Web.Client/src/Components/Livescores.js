import React, { Component } from 'react'
import { Table } from 'react-bootstrap'
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

                this.setState({ livegames: result,
                isLivescoreLoaded: true })
            }).then(() => {
                console.log(this.state.livegames)
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
    render() {
        let games
            games = this.state.livegames.map(match => (
                <tr>
                    <td className='competition-name'>{match.competition_name}</td>
                    <td>{match.home_name}</td>
                    <td>{match.score} <br /> ({match.ht_score})</td>
                    <td>{match.away_name}</td>
                    <td>{match.status === "FINISHED" ? match.status : match.time}</td>
                </tr>
            ))
        
            if (!this.state.isLivescoreLoaded) {
                return (
                    <div className='livescores-container'>
                        
                    </div>
                )
            }

            if (this.state.livegames.length > 0) {
                return (
                    <div className='livescores-container'>
                        <h4>Livescores</h4>
                        <Table responsive>
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
                    </div>
                )
            } else {
                return (
                    <div className='livescores-container'>
                        <h4>Livescores</h4>
                        <Table responsive>
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