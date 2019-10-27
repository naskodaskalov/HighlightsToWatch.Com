import React from 'react'
import './App.css'

import Routes from './Config/Routes'
import Navigation from './Components/Navigation'

function App () {
  return (
    <div className='App container-fluid'>
      <Navigation />
      <Routes />
    </div>

  )
}

export default App 
