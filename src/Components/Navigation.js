import React, { Component } from 'react'
import { Nav, Container, Navbar } from 'react-bootstrap'

export default class Navigation extends Component {
  render() {
    return (
      <Nav >
        <Navbar expand="lg">
        <Navbar.Brand href="/">
          
        <img src={require('../logo.png')} className='logo' />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <div className='xs-hidden'>
        <img src={require('../leagues/epl.png')} className='league-logo' alt='EPL' />
        <img src={require('../leagues/laliga.png')} className='league-logo' alt='LaLiga' />
        <img src={require('../leagues/ligue1.png')} className='league-logo' alt='Ligue1' />
        <img src={require('../leagues/seriea.png')} className='league-logo' alt='SerieA' />
        <img src={require('../leagues/bundesliga.png')} className='league-logo' alt='Bundesliga' />
        <img src={require('../leagues/danishleague.png')} className='league-logo' alt='DanishLeague' />
        <p className='info-text'>and many more</p>
        </div>
        <Navbar.Collapse id="basic-navbar-nav">
          
        <div className='xs-shown'>
        <img src={require('../leagues/epl.png')} className='league-logo' alt='EPL' />
        <img src={require('../leagues/laliga.png')} className='league-logo' alt='LaLiga' />
        <img src={require('../leagues/ligue1.png')} className='league-logo' alt='Ligue1' />
        <img src={require('../leagues/seriea.png')} className='league-logo' alt='SerieA' />
        <img src={require('../leagues/bundesliga.png')} className='league-logo' alt='Bundesliga' />
        <img src={require('../leagues/danishleague.png')} className='league-logo' alt='DanishLeague' />
        <p className='info-text'>and many more</p>
        </div>
        </Navbar.Collapse>
      </Navbar>
          <Container>
          </Container>
        </Nav>
      
    )
  }
}