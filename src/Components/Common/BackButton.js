import React, { Component } from 'react'
import { Button } from 'react-bootstrap'

export default class BackButton extends Component{
    constructor (props) {
        super(props)

        this.goBack = this.goBack.bind(this)
    }

    goBack() {
        this.props.history.push('/')
    }
    
    render() {
        return (
        <Button onClick={this.goBack} className='hltw-btn ml-3'>Go back</Button>
        )
    }
}