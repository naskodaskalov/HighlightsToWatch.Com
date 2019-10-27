import React, { Component } from 'react'
import { Nav, Container, Navbar } from 'react-bootstrap'

export default class Navigation extends Component {
  render() {
    return (
      <Nav >
        <Navbar expand="lg">
        <Navbar.Brand href="/">Highlights to watch</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        </Navbar.Collapse>
      </Navbar>
          <Container>
          </Container>
        </Nav>
      
    )
  }
}