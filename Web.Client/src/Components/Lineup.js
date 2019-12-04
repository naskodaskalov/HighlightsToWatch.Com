import React, { Component } from 'react'
import { Card, Accordion, Button, ListGroup } from 'react-bootstrap'
import '../App.css'

export default class Lineup extends Component {
  constructor (props) {
    super(props)

    this.state = {
      homeTeam: this.props.homeTeam,
      awayTeam: this.props.awayTeam,
      isLoading: true,
      stats: []
    }
  }

    showEvent(e) {
      let el = e.target
      if (el.firstElementChild != null && el.firstElementChild.tagName.toLowerCase() === "button") {
          el.firstElementChild.click()
      }
    }

  render() {
        let yellowCardsInfo = this.props.gameInfo["ev"].filter(ev => ev["t"] === "yc")
        let redCardsInfo = this.props.gameInfo["ev"].filter(ev => ev["t"] === "rc")

        let yellowCardsHome = yellowCardsInfo.filter(yc => yc["s"] === 1).map(yc => yc["n"])
        let yellowCardsAway = yellowCardsInfo.filter(yc => yc["s"] === 2).map(yc => yc["n"])
        let redCardsHome = redCardsInfo.filter(yc => yc["s"] === 1).map(yc => yc["n"])
        let redCardsAway = redCardsInfo.filter(yc => yc["s"] === 2).map(yc => yc["n"])
        
        let players = []

        if (this.props.gameInfo["l1"].length > 0 && this.props.gameInfo["l2"].length > 0) {
            players.push(
                <ListGroup.Item key={`l_0`}>
                    <div className='lineup-home'>Tactic {this.props.gameInfo["f1"]}</div>
                    <div className='lineup-away'>Tactic {this.props.gameInfo["f2"]}</div>
                </ListGroup.Item>
            )   
            for (let i = 0; i < 11; i++) {
                let playerHome = this.props.gameInfo["l1"][i];
                let playerAway = this.props.gameInfo["l2"][i];  
                let homeHasYellowCard = false
                let awayHasYellowCard = false
    
                if (playerHome != null && playerAway != null)     {
                    if (yellowCardsHome.includes(playerHome.n)) {
                        homeHasYellowCard = true;
                    }
        
                    if (yellowCardsAway.includes(playerAway.n)) {
                        awayHasYellowCard = true;
                    }
        
                    let homeHasRedCard = false
                    let awayHasRedCard = false
        
                    if (redCardsHome.includes(playerHome.n)) {
                        homeHasRedCard = true;
                    }
        
                    if (redCardsAway.includes(playerAway.n)) {
                        awayHasRedCard = true;
                    }
                    players.push(
                        <ListGroup.Item key={`l_${i+1}`}>
                            <div className='lineup-home'>
                                <span className='player-number'>{playerHome.nm}.</span>
                                {playerHome.n}
                                {homeHasYellowCard ? (<span className='yellow-card'></span>) : "" }
                                {homeHasRedCard ? (<span className='red-card'></span>) : "" }
                                </div>
                            <div className='lineup-away'>
                                {awayHasYellowCard ? (<span className='yellow-card'></span>) : "" }
                                {awayHasRedCard ? (<span className='red-card'></span>) : "" }
                                {playerAway.n}
                                <span className='player-number'>{playerAway.nm}.</span>
                            </div>
                        </ListGroup.Item>
                        )    
                }
        }
        
        }

        let substitutes = []
        let maxSubstitues = Math.max(this.props.gameInfo["b1"].length, this.props.gameInfo["b2"].length)
        for (let k = 0; k < maxSubstitues; k++) {
            let playerHome = this.props.gameInfo["b1"][k] != null ? this.props.gameInfo["b1"][k] : { n: "", nm: ""};
            let playerAway = this.props.gameInfo["b2"][k] != null ? this.props.gameInfo["b2"][k] : { n: "", nm: ""};  
            
            substitutes.push(
                <ListGroup.Item  key={`s${k}`}>
                    <div className='lineup-home'><span className='player-number'>{playerHome.nm}.</span> {playerHome.n}</div>
                    <div className='lineup-away'>{playerAway.n} <span className='player-number'>{playerAway.nm}.</span></div>
                </ListGroup.Item>
                )        
        }
        return (
            <div className='lineup'>
                <Accordion onClick={this.showEvent.bind(this)} className='mt-2' defaultActiveKey={this.props.isLivePage ? "match-lineup" : ""}>
                    <Card className='bordered-card'>
                    <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="match-lineup">
                        Teams line-up
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="match-lineup">
                        <Card.Body>
                            {players.length == 0 ? (
                                <ListGroup variant="flush">
                                    No data
                                    </ListGroup>
                            ) : (
                            <React.Fragment>
                                <ListGroup variant="flush">
                                {players}
                            </ListGroup>
                            <h4 className='mt-3'>Substitutes</h4>
                            <ListGroup variant="flush">s
                                {substitutes}
                            </ListGroup>
                            </React.Fragment>
                            )}
                        
                        
                        </Card.Body>
                    </Accordion.Collapse>
                    </Card>
                </Accordion>
            </div>
        )

  }
}