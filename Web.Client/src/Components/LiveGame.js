import React, {Component} from 'react'
import BackButton from './Common/BackButton'
import {
    Spinner
} from 'react-bootstrap'
import {TwitterShareButton, FacebookShareButton, TwitterIcon, FacebookIcon} from 'react-share'
import 'moment-timezone'
import * as moment from 'moment'
import axios from 'axios'
import Helmet from 'react-helmet'
import '../App.css'
import Lineup from './Lineup'
import Stats from './Stats'
import LiveStandings from './LiveStandings'
import UpcomingGames from './UpcomingGames'

import GlobalHelpers from './Common/Helpers'

export default class Match extends Component {
    constructor(props) {
        super(props)

        this.state = {
            date: this.props.match.params.date,
            match: this.props.match.params.game,
            homeTeam: this.props.match.params.game.split("-")[0].trim().replace(' ', '-').replace(' ', '-').replace(' ', '-').replace(' ', '-'),
            awayTeam: this.props.match.params.game.split("-")[1].trim().replace(' ', '-').replace(' ', '-').replace(' ', '-').replace(' ', '-'),
            gameDetails: [],
            competition: '',
            currentTime: 0,
            isLoading: true
        }
    }

    UNSAFE_componentWillReceiveProps (newProps) {
        this.getData(newProps)
    }

    componentDidMount() {
        this.getData()
        this.addToPopularTable()
    }

    getData(newProps) {
        this.getLiveGameData(newProps).then((data) => {
            if (data.error.length > 0) {
                console.error(data.error)
            } else {
                this.setState({
                    isLoading: false,
                    currentTime: data.currentTime,
                    gameDetails: data.response,
                    competition: data.response.cn
                })
            }
        })

    }

    addToPopularTable() {
        const game = {
            match: this.state.match,
            date: this.state.date,
            count: 1
        }

        GlobalHelpers.UpdatePopularCounter(game);
    }

    getLiveGameData(newProps) {
        let homeTeam = newProps !== undefined ? newProps.match.params.game.split("-")[0].trim().replace(' ', '-').replace(' ', '-').replace(' ', '-').replace(' ', '-') : this.state.homeTeam
        let awayTeam = newProps !== undefined ? newProps.match.params.game.split("-")[1].trim().replace(' ', '-').replace(' ', '-').replace(' ', '-').replace(' ', '-') : this.state.awayTeam
        if (newProps !== undefined) {
            if (newProps.match.params.game !== this.state.match) {
                this.setState({
                    match: newProps.match.params.game,
                    isLoading: true,
                    isTheGameLive: false,
                    homeTeam: newProps.match.params.game.split("-")[0].trim().replace(' ', '-').replace(' ', '-').replace(' ', '-').replace(' ', '-'),
                    awayTeam: newProps.match.params.game.split("-")[1].trim().replace(' ', '-').replace(' ', '-').replace(' ', '-').replace(' ', '-')})
            }
        }
        return new Promise((resolve) => {
            resolve(axios(`https://www.scorebat.com/api/feed/match/${homeTeam}/${awayTeam}/`).then(response => {
                return response.data
            }))
        })
    }

    showEvent(e) {
        let el = e.target
        if (el.firstElementChild != null && el.firstElementChild.tagName.toLowerCase() === "button") {
            el
                .firstElementChild
                .click()
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
        let gameDetails = this.state.gameDetails
        let homeTeamName = gameDetails.s1
        let awayTeamName = gameDetails.s2
        let fullUrl = window.location.href
        let date = moment.unix(gameDetails.dt).format("DD.MM.YYYY HH:mm")
        return (
            <React.Fragment>
                <Helmet>
                <title>{gameDetails.cn}: {gameDetails.s1} vs {gameDetails.s2} ({this.state.date})</title>
                <meta
                    property="og:title"
                    content={`${gameDetails.cn}: ${gameDetails.s1} vs ${gameDetails.s2})`}/>
            </Helmet>
            <BackButton {...this.props}/> 
            <main>
                <div className='column-container'>
                <div className='left-side-container'>
                <UpcomingGames />
                </div>
                    <div className='videos-container container pl-3 pr-3 game-details-card'>
                    <h2>{gameDetails.s1} vs {gameDetails.s2}</h2> 
                    <TwitterShareButton
                        url={fullUrl}
                        title={`${gameDetails.s1} vs ${gameDetails.s2}`}
                        className="social-share-icon">
                        <TwitterIcon
                            size={32}
                            borderRadius={10} />
                    </TwitterShareButton>

                    <FacebookShareButton
                        url={fullUrl}
                        quote={`${gameDetails.s1} vs ${gameDetails.s2}`}
                        className="social-share-icon">
                        <FacebookIcon
                            size={32}
                            borderRadius={10} />
                    </FacebookShareButton>
                    <span className="match-date">
                        {date}
                    </span>

                    <div className="league-name">League: {gameDetails.cn}</div>
                    <Stats
                        isLivePage="true"
                        fullDetails={gameDetails}
                        scoreHome={gameDetails["sc1"]}
                        scoreAway={gameDetails["sc2"]}
                        gameEvents={gameDetails["ev"]}
                        gameInfo={gameDetails["st"]}
                        currentTime={this.state.currentTime}
                    />
                    <Lineup
                        isLivePage="true"
                        gameInfo={gameDetails}
                    />
                    <LiveStandings
                        isLivePage="true"
                        competition={this.state.competition}
                        homeTeam={homeTeamName}
                        awayTeam={awayTeamName}
                    />
                    </div>
                </div>
            </main>
            </React.Fragment>
        )

    }
}