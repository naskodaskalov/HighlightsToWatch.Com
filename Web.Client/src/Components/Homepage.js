import React, { Component } from 'react'
import Videos from './Videos'
import Livescores from './Livescores'

import {  } from 'react-bootstrap'

export default class Homepage extends Component {
  render() {
    return (
        <main>
          <div className='column-container'>
            <Livescores />
          <Videos {...this.props}/>
          </div>
        </main>
    )
  }
}