import React, { Component } from 'react'
import { Nav, Container, Navbar } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

 class Navigation extends Component {
  render() {
    return (
      <Nav >
        <Navbar expand="lg">
        <Navbar.Brand href="/">
          
        <img src={require('../../logo.png')} className='logo' alt='Highlights To Watch' />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <div className='xs-hidden'>
        <NavLink activeClassName='activeLeague' to='/league/england'>
          <img src={require('../../leagues/epl.png')} className='league-logo' alt='EPL' />
        </NavLink>
        <NavLink activeClassName='activeLeague' to='/league/spain'>
          <img src={require('../../leagues/laliga.png')} className='league-logo' alt='LaLiga' />
        </NavLink>
        <NavLink activeClassName='activeLeague' to='/league/france'>
          <img src={require('../../leagues/ligue1.png')} className='league-logo' alt='Ligue1' />
        </NavLink>
        <NavLink activeClassName='activeLeague' to='/league/italy'>
          <img src={require('../../leagues/seriea.png')} className='league-logo' alt='SerieA' />
        </NavLink>
        <NavLink activeClassName='activeLeague' to='/league/germany'>
          <img src={require('../../leagues/bundesliga.png')} className='league-logo' alt='Bundesliga' />
        </NavLink>
        
        <p className='info-text'>and many more</p>
        </div>
        <Navbar.Collapse id="basic-navbar-nav">
          
        <div className='xs-shown'>
        <NavLink to='/league/england'><img src={require('../../leagues/epl.png')} className='league-logo' alt='EPL' /></NavLink>
        <NavLink to='/league/spain'><img src={require('../../leagues/laliga.png')} className='league-logo' alt='LaLiga' /></NavLink>
        <NavLink to='/league/france'><img src={require('../../leagues/ligue1.png')} className='league-logo' alt='Ligue1' /></NavLink>
        <NavLink to='/league/italy'><img src={require('../../leagues/seriea.png')} className='league-logo' alt='SerieA' /></NavLink>
        <NavLink to='/league/germany'><img src={require('../../leagues/bundesliga.png')} className='league-logo' alt='Bundesliga' /></NavLink>
        <NavLink to='/league/denmark'><img src={require('../../leagues/danishleague.png')} className='league-logo' alt='DanishLeague' /></NavLink>
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

export default Navigation