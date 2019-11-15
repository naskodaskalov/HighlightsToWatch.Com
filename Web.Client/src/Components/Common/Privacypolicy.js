import React from 'react'
import { Link } from 'react-router-dom'

const Privacipolicy = () => {
    return (
        <main>
            <div className='inner-container text-left'>
                <h3 className='mb-4 text-center'>Privacy Policy</h3>
                <p>
                This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
                </p>
                <h4 className='text-left'>Information Collection And Use</h4>
                <p>
                HighlightsToWatch.com is not collecting any information from you. We are still not storing cookies on any other information from you right now.
                </p>
                <h4 className='text-left'>Links To Other Sites</h4>
                <p>
                Our Service may contain links to other sites that are not operated by us. If you click on a third party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit.
                </p>
                <p>
                We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.
                </p>
                Children's Privacy
                <h4 className='text-left'>Our Service does not address anyone under the age of 18 ("Children").</h4>

                <p>We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your Children has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers. </p>
                <h4 className='text-left'>Changes To This Privacy Policy</h4>
                <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
                <p>We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update the "effective date" at the top of this Privacy Policy.</p>
                <p>You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
                <h4 className='text-left'>Contact us</h4>
                <p>
                If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us through email at <a href="mailto:nasko.daskalov@abv.bg">nasko.daskalov@abv.bg</a> or directly from the <Link to='/contactus'>Contact us</Link> page.
                </p>
            </div>
        </main>
    )
}

export default Privacipolicy