import React, { Component } from 'react'
import { DropdownButton, Dropdown } from 'react-bootstrap'

export default class CountrySelector extends Component{
  constructor (props) {
    super(props)

    this.state = {
      countries: props.countries
    }
  }
  render() {
    let countries = this.state.countries.map((country, index) => (
      <Dropdown.Item key={index} onClick={this.props.handleCountryChange}>{country}</Dropdown.Item>
    ))
    return (
      <DropdownButton id="dropdown-basic-button" title={this.props.selectedCountry.length > 0 ? `Filter by country: ${this.props.selectedCountry}` : 'Filter by country'}>
        <Dropdown.Item onClick={this.props.showAll}>Show all</Dropdown.Item>
        {countries}
      </DropdownButton>
    )
  }
}