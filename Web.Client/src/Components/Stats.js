import React, { Component } from 'react'
import { Card, Accordion, Button, ListGroup } from 'react-bootstrap'
import '../App.css'

export default class Stats extends Component {
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
    let yellowCardsInfo = this.props.gameEvents.filter(ev => ev["t"] === "yc")
    let redCardsInfo = this.props.gameEvents.filter(ev => ev["t"] === "rc")

    let yellowCardsHome = yellowCardsInfo.filter(yc => yc["s"] === 1).map(yc => yc["n"])
    let yellowCardsAway = yellowCardsInfo.filter(yc => yc["s"] === 2).map(yc => yc["n"])
    let redCardsHome = redCardsInfo.filter(yc => yc["s"] === 1).map(yc => yc["n"])
    let redCardsAway = redCardsInfo.filter(yc => yc["s"] === 2).map(yc => yc["n"])


    return (
        <div>
            <Accordion onClick={this.showEvent.bind(this)} className='mt-2' defaultActiveKey={this.props.isLivePage ? "match-statistic" : ""}>
                <Card className='bordered-card'>
                <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="match-statistic">
                    Statistic
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="match-statistic">
                    <Card.Body>
                    <ListGroup variant="flush">
                    <ListGroup.Item className='game-result'>
                        <div className='score-box'>{this.props.scoreHome}</div>
                        <div className='delimiter'>:</div>
                        <div className='score-box'>{this.props.scoreAway}</div>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <div className='stat-col'>{yellowCardsHome.length}</div>
                        <div className='stat-col'>Yellow cards</div>
                        <div className='stat-col'>{yellowCardsAway.length}</div>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <div className='stat-col'>{redCardsHome.length}</div>
                        <div className='stat-col'>Red cards</div>
                        <div className='stat-col'>{redCardsAway.length}</div>
                    </ListGroup.Item>
                    {this.props.gameInfo.map((st, index) => {
                        let statType = st["k"].charAt(0).toUpperCase() + st["k"].slice(1)
                        if (statType === "ShotOnGoal") {
                            statType = "Shot on target"
                        }

                        if (statType === "CompletedPasses") {
                            statType = "Completed Passes"
                        }
                        
                        let valueHome = statType === "Possession" ? st["v1"] + " %" : st["v1"]
                        let valueAway = statType === "Possession" ? st["v2"] + " %" : st["v2"]

                        return (
                            <ListGroup.Item  key={index}>
                                <div className='stat-col'>{valueHome}</div>
                                <div className='stat-col'>{statType}</div>
                                <div className='stat-col'>{valueAway}</div>
                            </ListGroup.Item>
                            
                        )
                    }
                    )}
                    </ListGroup>
                    </Card.Body>
                </Accordion.Collapse>
                </Card>
            </Accordion>
        </div>
    )

  }
}