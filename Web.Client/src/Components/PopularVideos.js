import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Card, Button,  Accordion,  Spinner, ListGroup } from 'react-bootstrap'
import 'moment-timezone'

import db from '../Config/Database'
import GlobalHelpers from './Common/Helpers'

export default class PopularVideos extends Component {
    constructor (props) {
        super(props)

        this.state = {
            isToday: false,
            isLoading: true,
            popularGames: [],
            selectedVideo: {
              chosenMatch: '',
              videoTitle: '',
              videoToWatch: ''
            },
            games: []
        }
    }

    componentDidMount() {
        this.getDataFromDB()
    }


    getDataFromDB() {
        var ref = db.database().ref("populargames");
        let games = []
        let popularGames = []
        let masterThis = this
        
        ref.once("value").then(function (snapshot) {
            games = snapshot.val()
        }).then(function () {
            Object.values(games).map(game => popularGames.push(game))
            popularGames = GlobalHelpers.SortArrayDesc(popularGames, "count")
            
            masterThis.setState({
                popularGames: popularGames.slice(0, 5),
                isLoading: false
            })
        })
    }

    showEvent(e) {
        let el = e.target
        if (el.firstElementChild != null && el.firstElementChild.tagName.toLowerCase() === "button") {
            el.firstElementChild.click();
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

        let popularGames = this.state.popularGames.map((video, index) => (
                <ListGroup.Item  key={index}><Link to={`/match/${video.date}/${video.match}`}>{video.match}</Link></ListGroup.Item>
          ))
        return (
            <div className='livescores-container'>
                <Accordion onClick={this.showEvent.bind(this)} defaultActiveKey={window.innerWidth >= 951 ? "populargames" : ""}>
                    <Card className='bordered-card'>
                    <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey='populargames'>
                        TOP 5 popular games
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey='populargames'>
                        <Card.Body className='pt-0 pb-0'>
                        <ListGroup variant="flush">
                            {popularGames}
                        </ListGroup>
                        </Card.Body>
                    </Accordion.Collapse>
                    </Card>
                </Accordion>
            </div>
        )
    }
}