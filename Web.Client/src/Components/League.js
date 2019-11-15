import React, { Component } from 'react'
import BackButton from './Common/BackButton'
import MatchContainer from './MatchContainer'
import CountrySelector from './CountrySelector'
import Search from './Common/Search'
import { Row, Accordion,  Spinner } from 'react-bootstrap'
import VideoModal from './VideoModal'
import 'moment-timezone'
import * as moment from 'moment'
import axios from 'axios'
import Helmet from 'react-helmet'

export default class League extends Component {
    constructor (props) {
        super(props)

        this.state = {
            league: this.props.match.params.league,
            isToday: false,
            isLoading: true,
            gamesByLeague: [],
            selectedVideo: {
              chosenMatch: '',
              videoTitle: '',
              videoToWatch: ''
            },
            countries: [],
            games: []
        }

        this.goBack = this.goBack.bind(this)
    }

    UNSAFE_componentWillReceiveProps (newProps) {
        console.log(newProps)
        if (newProps.match.params.league !== this.state.league) {
            this.setState({ league: newProps.match.params.league})
        }
        this.getData()
    }

    componentDidMount () {
        this.getData()
    }

    getData() {
        let gamesByLeague = []
        Promise.all([this.getDataFromDB(), this.getDataFromServer()])
        .then(response => {
        let gamesFromDb = response[0]
        let gamesFromServer = response[1]
        gamesFromServer.map(game => gamesByLeague.push(game))
        gamesFromDb.map(game => gamesByLeague.push(game))
        })
        .then(() => {
            gamesByLeague.sort(function (a, b) {
                if (a.date > b.date) {
                    return -1;
                } else {
                    return 1;
                }
            })
            this.setState({
                gamesByLeague,
                isLoading: false
            })
        })
    }
    getDataFromServer() {
        return new Promise((resolve) => {
            resolve(axios('https://www.scorebat.com/video-api/v1/').then(response => {
                const gamesFromServer = response.data
                let gamesByLeague = []
                let d = moment().format("YYYY-MM-DD")
                let todaysGames = gamesFromServer
                                .filter(m => m.date.split("T")[0] === d)
                for (let i = 0; i < todaysGames.length; i++) {
                const currentGame = todaysGames[i];
                if (currentGame.competition.name.indexOf(this.state.league.toUpperCase()) > -1) {
                    gamesByLeague.push(currentGame)
                }

                }
                return gamesByLeague
            }))
        })  
    }
    
    getDataFromDB() {
        return new Promise((resolve) => {
        resolve(axios(`https://highlightstowatch.firebaseio.com/matches.json`).then(response => {
        const gamesFromDB = response.data
        let gamesByLeague = []
        for (let i = 0; i < Object.values(gamesFromDB).length; i++) {
            const currentDate = Object.values(gamesFromDB)[i];
            for (let k = 0; k < Object.values(currentDate).length; k++) {
                const element = Object.values(currentDate)[k];
                if (element.competition.name.indexOf(this.state.league.toUpperCase()) > -1) {
                    gamesByLeague.push(element)
                }
            }
        }
        return gamesByLeague
        }))
        })
    }

    goBack() {
        this.props.history.push("/")
    }

    handleCountryChange(e) {
      const selectedCountry = e.target.innerText
      this.setState({ league: selectedCountry })
      this.props.history.push(`/league/${selectedCountry.toLowerCase()}`)
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

        if (this.state.gamesByLeague.length === 0) {
            let competition = this.state.league
            return (
                <div className='container'>
                <CountrySelector
                    {...this.props}
                    countries={this.state.countries}
                    selectedCountry={this.state.league.toUpperCase()}
                    handleCountryChange={this.handleCountryChange.bind(this)}
                    />
                    
                <h4 className='mt-4'>No highlights for {competition.charAt(0).toUpperCase() + competition.slice(1)}. For more videos <span className="link" onClick={this.goBack}>click here</span>.</h4>
                </div>
            )
        }
        let league = this.state.league
        league = league.charAt(0).toUpperCase() + league.slice(1)

        let gamesByLeague = this.state.gamesByLeague.map((video, index) => (
            <MatchContainer
              {...this.props}
              key={index}
              video={video}
              handleClickEvent={this.showVideo}
            />
          ))
        return (
            <main>
                <Helmet>
                <title>Highlights To Watch: {this.state.league.toUpperCase()}</title>
                </Helmet>
                <BackButton {...this.props} />
                <div className='controls'>
                    <Search {...this.props} videosData={this.state.gamesByLeague} placeholder={`Search for game in ${league}`} />
                    <CountrySelector
                    {...this.props}
                    countries={this.state.countries}
                    selectedCountry={this.state.league.toUpperCase()}
                    handleCountryChange={this.handleCountryChange.bind(this)}
                    />
                </div>
                <div className='container pl-4 pr-4'>
                    <Row className='videos-container'>
                        <h4 className='mb-4'>Highlights from {league}</h4>
                        <Accordion className="w-100 text-left">
                                {gamesByLeague}
                        </Accordion>
                    </Row>
                    <VideoModal
                        show={this.state.show}
                        onHide={this.handleClose}
                        match={this.state.selectedVideo}
                    />
                </div>
            </main>
        )
    }
}