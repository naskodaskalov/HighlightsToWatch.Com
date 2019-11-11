import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import Homepage from '../Components/Homepage'
import Match from '../Components/Match'
import League from '../Components/League'
import NotFound from '../Components/NotFound'

class Routes extends Component {
  render() {
    return (
      <Switch>
    <Route exact path='/' component={Homepage} />
    <Route path='/match/:date/:game' component={Match} />
    <Route path='/league/:league' component={League} />
    <Route path='*' component={NotFound} />
  </Switch>
    )
  }
}

export default Routes
