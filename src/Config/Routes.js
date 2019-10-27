import React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import Homepage from '../Components/Homepage'
import Match from '../Components/Match'

const Routes = () => (
  <Switch>
    <Route exact path='/' component={Homepage} />
    <Route path='/match/:date/:game' component={Match} />
  </Switch>
)

export default Routes
