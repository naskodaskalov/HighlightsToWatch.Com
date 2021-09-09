import React, { Component } from 'react'
import brain from 'brainjs'

export default class Bets extends Component {
  componentDidMount () {
    var net = new brain.NeuralNetwork()
    net.train([
      { input: [1, 2], output: [1] },
      { input: [1, 2], output: [1] }
    ])

    var res = net.run([1, 0])
    console.log(res)
  }

  render () {
    return (
      <div>Bets</div>
    )
  }
}
