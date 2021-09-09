import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import Homepage from '../Components/Homepage'
import Match from '../Components/Match'
import League from '../Components/League'
import Aboutus from '../Components/Common/Aboutus'
import Contactus from '../Components/Common/Contactus'
import Privacypolicy from '../Components/Common/Privacypolicy'
import Disclaimer from '../Components/Common/Disclaimer'
import UpcomingGames from '../Components/UpcomingGames'
import LiveGame from '../Components/LiveGame'
import Bets from '../Components/Bets'
import NotFound from '../Components/NotFound'

class Routes extends Component {
  render () {
    return (
      <Switch>
        <Route exact path='/' component={Homepage} />
        <Route path='/match/:date/:game' component={Match} />
        <Route path='/league/:league' component={League} />
        <Route path='/contactus' component={Contactus} />
        <Route path='/aboutus' component={Aboutus} />
        <Route path='/privacypolicy' component={Privacypolicy} />
        <Route path='/disclaimer' component={Disclaimer} />
        <Route path='/upcoming' component={UpcomingGames} />
        <Route path='/live/:date/:game' component={LiveGame} />
        <Route path='/bets' component={Bets} />

        <Route path='*' component={NotFound} />
      </Switch>
    )
  }
}

export default Routes
