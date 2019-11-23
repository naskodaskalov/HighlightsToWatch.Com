import React, { Component, Fragment } from 'react'
import {Typeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

export default class Search extends Component {
    showResult(e) {
      const date = e[0].date.split('T')[0]
      const title = e[0].title
      this.props.history.push(`/match/${date}/${title}`)
    }
  
    render() {
      return (
          <Fragment>
          <Typeahead
            labelKey="title"
            minLength={2}
            id="search-typeahead"
            options={this.props.videosData}
            onChange={this.showResult.bind(this)}
            placeholder={this.props.placeholder}
            renderMenuItemChildren={(option) => (
              <div>
                {option.title}
                <div>
                  <small>{option.date.split('T')[0]}</small>
                </div>
                
                <div>
                  <small>League: {option.competition.name}</small>
                </div>
              </div>
            )}
          />
          
        </Fragment>
      );
    }
}
