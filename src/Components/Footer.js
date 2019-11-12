import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Footer extends Component {
    render() {
        return (
            <div className='footer mt-5'>
                <div>
                © 2019 <Link to="/">HighlightsToWatch.com</Link>
                <ul>
                    <li>
                        <Link to="/aboutus">About us</Link>
                    </li>
                    <li>
                        <Link to="/contactus">Contact us</Link>
                    </li>
                    <li>
                        <Link to="/privacypolicy">Privacy policy</Link>
                    </li>
                    <li>
                        <Link to="/disclaimer">Disclaimer</Link>
                    </li>
                </ul>
                </div>
                <div className='creator'>
                    Site by <a href="https://twitter.com/naskodaskalov">@naskodaskalov</a>
                </div>
            </div>
        )
    }
}