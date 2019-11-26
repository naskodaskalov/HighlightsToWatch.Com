import React, { Component } from 'react'
import { DropdownButton, Dropdown } from 'react-bootstrap'
import GlobalHelpers from './Common/Helpers'
import db from '../Config/Database'

export default class CountrySelector extends Component{
  constructor (props) {
    super(props)

    this.state = {
      countries: []
    }

    this.showAllVideos = this.showAllVideos.bind(this)
  }

  componentDidMount () {
    var leagues = db.database().ref("leagues");
    let countries = []
    let selectedCountries = []

    leagues.once("value").then(function (snapshot) {
      countries = snapshot.val()
    }).then(function () {
        for (let i = 0; i < Object.values(countries).length; i++) {
          const element = Object.values(countries)[i];
          selectedCountries.push(element)
        }
    }).then(() => {
        let data = GlobalHelpers.SortArrayAsc(selectedCountries, "country_name")
        this.setState({ countries: data })
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