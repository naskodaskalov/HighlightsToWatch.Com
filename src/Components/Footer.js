import React, { Component } from 'react'

export default class Footer extends Component {
    render() {
        return (
            <div className='footer mt-5'>
                <div>
                © 2019 <a href="http://highlightstowatch.com">HighlightsToWatch.com</a>
                </div>
                <div className='creator'>
                    Site by <a href="https://twitter.com/naskodaskalov">@naskodaskalov</a>
                </div>
            </div>
        )
    }
}