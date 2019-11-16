import React, { Component } from 'react'
import Videos from './Videos'

import {  } from 'react-bootstrap'

export default class Homepage extends Component {
  render() {
    return (
        <main>
          <div className=''>
            
          <Videos {...this.props}/>
          </div>
        </main>
    )
  }
}