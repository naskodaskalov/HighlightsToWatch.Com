import React, { Component } from 'react'
import { Spinner } from 'react-bootstrap'
import 'moment-timezone'
import axios from 'axios'
import '../App.css'
import Stats from './Stats'
import Lineup from './Lineup'
import LiveStandings from './LiveStandings'

export default class MatchStatistic extends Component {
    constructor (props) {
        super(props)

        this.state = {
        homeTeam: this.props.homeTeam,
        awayTeam: this.props.awayTeam,
        isLoading: true,
        currentTime: 0,
        competition: '',
        stats: []
        }
    }

    componentDidMount () {
        this.getMatchStatistic()
        .then((response) => {
                this.setState({
                    stats: response.response,
                    currentTime: response.currentTime,
                    isLoading: false,
                    competition: response.response.cn
                })
        })
    }

    getMatchStatistic() {
        let homeTeam = this.state.homeTeam
        let awayTeam = this.state.awayTeam
        return new Promise((resolve) => {
        resolve(axios(`https://www.scorebat.com/api/feed/match/${homeTeam}/${awayTeam}/`).then(response => {
        const stat = response.data

        return stat
        }))
        })
    }

    showEvent(e) {
      let el = e.target
      if (el.firstElementChild != null && el.firstElementChild.tagName.toLowerCase() === "button") {
          el.firstElementChild.click()
      }
    }

    render() {
        if (this.state.isLoading) {
        return (
            <main>
            <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
            </Spinner>
            </main>
        )
        }
        let gameDetails = this.state.stats
        let homeTeamName = gameDetails.s1
        let awayTeamName = gameDetails.s2

        return (
            <div>
            <Stats
                fullDetails={gameDetails}
                currentTime={this.state.currentTime}
                scoreHome={gameDetails["sc1"]}
                scoreAway={gameDetails["sc2"]}
                gameEvents={gameDetails["ev"]}
                gameInfo={gameDetails["st"]}
            />
            {gameDetails["l1"].length ? (
                <Lineup
                gameInfo={gameDetails}
            />
            ) : ""}
            <LiveStandings
                competition={this.state.competition}
                homeTeam={homeTeamName}
                awayTeam={awayTeamName}
            />
            </div>
        )

    }
}