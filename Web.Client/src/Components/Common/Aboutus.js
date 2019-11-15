import React from 'react'
import { Link } from 'react-router-dom'

const Aboutus = () => {
    return (
        <main>
            <div className='inner-container text-left'>
                <h3 className='mb-4 text-center'>About us</h3>
                <p>
                HighlightsToWatch is a free service, from which you can watch most interestesing goals and highlights from football events all around the world..
                </p>
                <h4 className='text-left'>We want to hear from you</h4>
                <p>
                So you've got some idea or suggestion on an article or topic that we cover? We welcome your feedback, good or bad, as well as any suggestions you may have that will help us improve user experience we provide you. Please let us know 🙂
                </p>
                <h4 className='text-left'>Contact us</h4>
                <p>
                Feel free to email us to provide some feedback, give us suggestions, for advertisement/partnership queries or to just say hello directly from the <Link to='/contactus'>Contact us</Link> page.
                </p>
            </div>
        </main>
    )
}

export default Aboutus