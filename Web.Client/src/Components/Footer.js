import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { ListGroup } from 'react-bootstrap'
import { TwitterIcon } from 'react-share'

export default class Footer extends Component {
    render() {
        return (
            <div className='footer mt-5'>
                <div>
                    <h4>Links</h4>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <Link to="/aboutus">About us</Link>
                        </ListGroup.Item>
                        <ListGroup.Item>
                        <Link to="/contactus">Contact us</Link>
                        </ListGroup.Item>
                        <ListGroup.Item>
                        <Link to="/privacypolicy">Privacy policy</Link>
                        </ListGroup.Item>
                        <ListGroup.Item>
                        <Link to="/disclaimer">Disclaimer</Link>
                        </ListGroup.Item>
                    </ListGroup>
                </div>
                <div>
                    <h4>Follow us</h4>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <a href="https://twitter.com/HighlightsTo" target="_blank" rel="noopener noreferrer">
                                <TwitterIcon
                                    size={32}
                                    borderRadius={10} />
                                </a>
                            </ListGroup.Item>
                        </ListGroup>
                    </div>
                <div>
                    <h4>Copyright</h4>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                        © 2019 <Link to="/">HighlightsToWatch.com</Link>
                        </ListGroup.Item>
                        <ListGroup.Item>
                        Site by <a href="https://twitter.com/naskodaskalov">@naskodaskalov</a>
                        </ListGroup.Item>
                    </ListGroup>
                </div>
            </div>
        )
    }
}