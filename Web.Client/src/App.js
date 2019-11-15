import React from 'react'
import './App.css'

import Routes from './Config/Routes'
import Navigation from './Components/Common/Navigation'
import Footer from './Components/Footer'

function App () {
  return (
    <div className='App container-fluid'>
      <Navigation />
      <Routes />
      <Footer />
    </div>

  )
}

export default App 
