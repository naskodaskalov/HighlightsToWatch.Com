import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Homepage from '../Components/Homepage'

const Routes = () => (
  <Switch>
    <Route exact path='/' component={Homepage} />
  </Switch>
)

export default Routes
