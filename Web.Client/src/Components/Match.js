import React, { Component } from 'react'
import BackButton from './Common/BackButton'
import { Row, Col, Card, Accordion, Button, Spinner } from 'react-bootstrap'
import { TwitterShareButton, FacebookShareButton, TwitterIcon, FacebookIcon } from 'react-share'
import 'moment-timezone'
import Moment from 'react-moment'
import * as moment from 'moment'
import axios from 'axios'
import Helmet from 'react-helmet'
import '../App.css'

import MatchStatistic from './MatchStatistic'

import GlobalHelpers from './Common/Helpers'

export default class Match extends Component {
  constructor (props) {
    super(props)

    this.state = {
      date: this.props.match.params.date,
      match: this.props.match.params.game,
      isToday: false,
      gameDetails: [],
      isLoading: true
    }
  }

  componentDidMount () {
    let gameDate = moment(this.state.date)
    let today = moment()
    let isToday = moment(today).isSame(gameDate, 'date')
    this.setState({
      isToday
    })

    if (isToday) {
      this.getGameDetailsFromPromise(this.getDataFromServer())
    } else {
      this.getGameDetailsFromPromise(this.getDataFromDB())
    }

    this.addToPopularTable()
  }

  addToPopularTable() {
    const game = {
      match: this.state.match,
      date: this.state.date,
      count: 1
    }
    
    GlobalHelpers.UpdatePopularCounter(game);
  }

  getGameDetailsFromPromise(promise) {
    Promise.all([promise])
      .then(response => {
        let gamesFromDb = response[0]
        let currentGameDetails = []
        for (let k = Object.values(gamesFromDb).length - 1; k >= 0; k--) {
          const match = Object.values(gamesFromDb)[k];
          if (match.title === this.state.match) {
            currentGameDetails = match
            this.setState({ gameDetails: currentGameDetails })
            break
          }
        }
      })
      .then(() => {
        this.setState({ isLoading: false })
      })
  }

  getDataFromServer(date) {
    return new Promise((resolve) => {
      resolve(axios('https://www.scorebat.com/video-api/v1/').then(response => {
       const gamesFromServer = response.data
       let d = moment().format("YYYY-MM-DD")
       let todaysGames = gamesFromServer
                           .filter(m => m.date.split("T")[0] === d)
       return todaysGames
     }))
     })
   }
 
   getDataFromDB() {
     let formattedDate = moment(this.state.date).format("MM-DD-YYYY")
     return new Promise((resolve) => {
       resolve(axios(`https://highlightstowatch.firebaseio.com/matches/${formattedDate}.json`).then(response => {
        return response.data
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
    let homeTeam = this.state.match.split('-')[0].trim().replace(' ', '-').replace(' ', '-').replace(' ', '-').replace(' ', '-')
    let awayTeam = this.state.match.split('-')[1].trim().replace(' ', '-').replace(' ', '-').replace(' ', '-').replace(' ', '-')
    let gameDetails = this.state.gameDetails
    let fullUrl = window.location.href
    
    let sortedVideos = gameDetails.videos.reverse()
    let game = (
      <Card className='game-details-card'>
        <Card.Body>
          <h2>{gameDetails.side1.name} vs {gameDetails.side2.name}</h2> 
          <TwitterShareButton
              url={fullUrl}
              title={`${gameDetails.side1.name} vs ${gameDetails.side2.name}`}
              className="social-share-icon">
              <TwitterIcon
                size={32}
                borderRadius={10} />
          </TwitterShareButton>

          <FacebookShareButton
              url={fullUrl}
              quote={`${gameDetails.side1.name} vs ${gameDetails.side2.name}`}
              className="social-share-icon">
              <FacebookIcon
                size={32}
                borderRadius={10} />
          </FacebookShareButton>
          <span className="match-date">
            <Moment format="DD.MM.YYYY HH:mm">{gameDetails.date}</Moment>
        </span>

        <div className="league-name">League: {gameDetails.competition.name}</div>
            <Row>
                <Col md={6} lg={6} xs={12}>
                <Card.Img src={gameDetails.thumbnail} className='mt-3' alt={gameDetails.title} />
                </Col>
                <Col className='pt-3 pl-0 pr-0' md={6} lg={6} xs={12}>
                    <Col md={12} lg={12} xs={12}>
                    {sortedVideos.map((v, index) => (
                      <Accordion key={index} onClick={this.showEvent.bind(this)}>
                      <Card className='bordered-card'>
                        <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey={index}>
                            {v.title}
                          </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey={index}>
                          <Card.Body>
                          <div dangerouslySetInnerHTML={ { __html: `${v.embed}` } }></div>
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                    </Accordion>
                    ))
                  }
                    </Col>
                    <Col md={12} lg={12} xs={12}>
                      <MatchStatistic
                        homeTeam={homeTeam}
                        awayTeam={awayTeam}
                      />
                    </Col>
                </Col>
            </Row>
        </Card.Body>
    </Card>
    )
    return (
      <div>
        <Helmet>
          <title>{this.state.gameDetails.competition.name}: {this.state.match} ({this.state.date})</title>
          <meta property="og:image" content={this.state.gameDetails.thumbnail} />
          <meta property="og:title" content={`${this.state.gameDetails.competition.name}: ${this.state.match} (${this.state.date})`} />
        </Helmet>
        <BackButton {...this.props} />
        {game}
      </div>
    )

  }
}