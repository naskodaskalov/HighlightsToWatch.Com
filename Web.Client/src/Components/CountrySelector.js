import React, { Component } from 'react'
import { DropdownButton, Dropdown } from 'react-bootstrap'
import axios from 'axios'

export default class CountrySelector extends Component{
  constructor (props) {
    super(props)

    this.state = {
      countries: []
    }

    this.showAllVideos = this.showAllVideos.bind(this)
  }

  componentDidMount () {
    return new Promise((resolve) => {
      resolve(axios('https://highlightstowatch.firebaseio.com/leagues.json').then(response => {
        let countries = []
        for (let i = 0; i < Object.values(response.data).length; i++) {
          const element = Object.values(response.data)[i];
          countries.push(element)
        }
        countries.sort(function (a, b) {
          if (a.country_name > b.country_name) {
              return 1;
          } else {
              return -1;
          }
      })
        this.setState({ countries })
     }))
     })
    
  }

  showAllVideos() {
    this.props.history.push(`/`)
  }

  render() {
    let countries = this.state.countries.map((country, index) => (
      <Dropdown.Item key={index} onClick={this.props.handleCountryChange} data-league={country.country_name}>{country.country_name}</Dropdown.Item>
    ))
    return (
      <DropdownButton
        id="dropdown-basic-button"
        className="text-right mb-4"
        title={this.props.selectedCountry.length > 0 ? `Filter by country: ${this.props.selectedCountry}` : 'Filter by country'}>
        <Dropdown.Item onClick={this.showAllVideos}>Show all</Dropdown.Item>
        {countries}
      </DropdownButton>
    )
  }
}