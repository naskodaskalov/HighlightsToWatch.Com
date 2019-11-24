import React, { Component } from 'react'
import { Spinner } from 'react-bootstrap'
import 'moment-timezone'
import axios from 'axios'
import '../App.css'
import Stats from './Stats'
import Lineup from './Lineup'

export default class MatchStatistic extends Component {
    constructor (props) {
        super(props)

        this.state = {
        homeTeam: this.props.homeTeam,
        awayTeam: this.props.awayTeam,
        isLoading: true,
        stats: []
        }
    }

    componentDidMount () {
        this.getMatchStatistic()
        .then((response) => {
                this.setState({
                    stats: response.response,
                    isLoading: false
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
        
        return (
            <div>
            <Stats
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
            </div>
        )

    }
}