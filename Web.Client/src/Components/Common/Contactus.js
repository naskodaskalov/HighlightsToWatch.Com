import React, { Component } from 'react'
import toastr from 'toastr'
import $ from 'jquery'

class Contactus extends Component {
  constructor (props) {
    super(props)

    this.state = {
      mail: {
        name: '',
        email: '',
        message: ''
      }
    }
  }

  handleMessageField (event) {
    const target = event.target
    const field = target.name
    const value = target.value

    let mail = this.state.mail
    mail[field] = value

    this.setState({ mail })
  }

  handleMessageSend (event) {
    event.preventDefault()
    $.ajax({
      url: '../ContactForm.php',
      type: 'POST',
      data: {
        name: this.state.mail.name,
        email: this.state.mail.email,
        message: this.state.mail.message
      },
      cache: false,
      success: (response) => {
        this.props.history.push('/')
        toastr.success(`Thank you, ${this.state.mail.name}! Your message was successfully sent!`)
      },
      error: (error) => {
        if (error) {
          $('#name').val('')
          $('#email').val('')
          $('#message').val('')
          toastr.error(`Sorry, ${this.state.mail.name}! You have to fill all fields!`)
        }
      }
    })
  }

  render () {
    return (
      <main>
          <h4>Contact us</h4>
          <form id='contact-form' className='contact-form mt-4'>
            <div className='row'>
              <div className='col-md-6'>
                <div className='form-group'>
                  <input type='text'
                    className='form-control'
                    name='name'
                    id='name'
                    placeholder='Full name'
                    onChange={this.handleMessageField.bind(this)} />
                </div>
              </div>
              <div className='col-md-6'>
                <div className='form-group'>
                  <input
                    type='email'
                    className='form-control'
                    name='email'
                    id='email'
                    placeholder='E-mail'
                    onChange={this.handleMessageField.bind(this)} />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-12'>
                <div className='form-group'>
                  <textarea
                    className='form-control textarea'
                    rows='10'
                    name='message'
                    id='message'
                    placeholder='Type your message here...'
                    onChange={this.handleMessageField.bind(this)} />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-12'>
                <button
                  type='submit'
                  className='mt-3 hltw-btn btn btn-primary'
                  onClick={this.handleMessageSend.bind(this)}>Send a message</button>
              </div>
            </div>
          </form>
      </main>
    )
  }
}

export default Contactus
