import React, { Component } from 'react'
import { Row, Accordion, Pagination, Spinner } from 'react-bootstrap'
import CountrySelector from './CountrySelector'
import MatchContainer from './MatchContainer'
import VideoModal from './VideoModal'
import PopularVideos from './PopularVideos'
import Search from './Common/Search'
import axios from 'axios'
import 'moment-timezone'
import * as moment from 'moment'
import Livescores from './Livescores'
import UpcomingGames from './UpcomingGames'

import GlobalHelpers from './Common/Helpers'

export default class Videos extends Component {
  constructor (props) {
    super(props)

    this.state = {
      videos: [],
      videosTitles: [],
      matchesDb: [],
      show: false,
      hide: true,
      page: 1,
      videosOnPage: [],
      startIndex: 0,
      endIndex: 10,
      loading: true,
      countries: [],
      showPagination: true,
      selectedCountry: '',
      selectedVideo: {
        chosenMatch: '',
        videoTitle: '',
        videoToWatch: ''
      },
      gamesFromDb: []
    }

    this.handleClose = this.handleClose.bind(this)
    this.show = this.show.bind(this)
    this.showVideo = this.showVideo.bind(this)
    this.sliceVideoArray = this.sliceVideoArray.bind(this)
    this.showNextPage = this.showNextPage.bind(this)
    this.showFirstPage = this.showFirstPage.bind(this)
  }

 getDataFromServer() {
   return new Promise((resolve) => {
     resolve(axios('https://www.scorebat.com/video-api/v1/').then(response => {
      const gamesFromServer = response.data
      let momentDate = moment(new Date()).format("YYYY-MM-DD")
      let todaysGames = gamesFromServer
                          .filter(m => m.date.split("T")[0] === momentDate)
      return todaysGames
    }))
    })
  }

  getDataFromDB() {
    return new Promise((resolve) => {
      resolve(axios('https://highlightstowatch.firebaseio.com/matches.json').then(response => {
       return response.data
     }))
     })
   }

  componentDidMount () {
    Promise.all([
      this.getDataFromServer(),
      this.getDataFromDB()
    ]).then(response => {
        let gamesFromServer = response[0]
        let gamesFromDb = response[1]
        let games = []
        for (let i = 0; i < gamesFromServer.length; i++) {
          const element = gamesFromServer[i];
          games.push(element) 
        }
        for (let k = Object.values(gamesFromDb).length - 1; k >= 0; k--) {
          const currentDate = Object.values(gamesFromDb)[k];

          if (Object.keys(gamesFromDb)[k] === moment(new Date()).format("MM-DD-YYYY")){
            continue;
          }

          for (let t = 0; t < Object.values(currentDate).length; t++) {
            const p = Object.values(currentDate)[t];
            games.push(p)
          } 
        }

        let sortedGames = this.sortGamesByDateAndTime(games)
        let videosTitles = []

        for (let i = 0; i < sortedGames.length; i++) {
          const element = sortedGames[i];

          videosTitles.push(element.title)
          
        }
        this.setState({ videos: sortedGames })
        this.setState({ videosTitles })
      })
      .then(() => {
        this.sliceVideoArray(this.state.videos, true)
      })
      .then(() => {
        this.setState({ loading: false })
      })
  }

  sortGamesByDateAndTime(games) {
    let sortedGames = GlobalHelpers.SortArrayDesc(games, "date")
    
    return sortedGames
  }

  sliceVideoArray(data, hasPagination) {
    const videos = data
    let videosOnPage = hasPagination ? videos.slice(this.state.startIndex, this.state.endIndex) : videos
    
    if (hasPagination) {
      if (videos.length / 10 <= 1) {
        this.setState({ showPagination: false })
      } else {
        this.setState({ showPagination: true })
      }
    } else {
      this.setState({ showPagination: false })
    }

    this.setState({
      loading: false,
      videosOnPage
    })
  }

  showVideo(e) {
    e.preventDefault()

    this.setState({
      selectedVideo: {
        chosenMatch: e.target.dataset['matchname'],
        videoToWatch: e.target.dataset['video'],
        videoTitle: e.target.dataset['videotitle']
      }
    })

    this.show()
    const game = {
      match: e.target.dataset['matchname'],
      date: e.target.dataset['matchdate'],
      count: 1
    }

    GlobalHelpers.UpdatePopularCounter(game);
  }

  show () {
    this.setState({ show: true, hide: false })
  }

  handleClose () {
    this.setState({ show: false, hide: true })
  }

  showNextPage(e) {
    let page = e.target.innerText
    let newStartIndex = page > 1 ? (10 * (page - 1)) : 0
    let newEndIndex = page > 1 ? (newStartIndex + 10) : 10
    let newPage = page++
    this.setState({ page: newPage})
    this.setState({ startIndex: newStartIndex, endIndex: newEndIndex }, () => {
      this.sliceVideoArray(this.state.videos, true)
    })
    window.scrollTo(0,0)
  }

  showFirstPage() {
    let page = 1
    let newStartIndex = page > 1 ? (10 * (page - 1)) : 0
    let newEndIndex = page > 1 ? (newStartIndex + 10) : 10
    this.setState({ page })
    this.setState({ startIndex: newStartIndex, endIndex: newEndIndex }, () => {
      this.sliceVideoArray(this.state.videos, true)
    })
    window.scrollTo(0,0)
  }

  handleCountryChange(e) {
    const selectedCountry = e.target.innerText
    this.setState({ league: selectedCountry })
    this.props.history.push(`/league/${selectedCountry.toLowerCase()}`)
  }

  render() {
    const videos = this.state.videosOnPage
    let videosData = videos.map((video, index) => (
      <MatchContainer
        {...this.props}
        key={index}
        video={video}
        handleClickEvent={this.showVideo}
      />
    ))

    let counter = Math.ceil(this.state.videos.length / 10)
    let pagination = []
    let slicedPagination = []

    if (this.state.showPagination) { 
      for (let i = 1; i <= counter; i++) {
        pagination.push(<Pagination key={i}>
          <Pagination.Item value={i} className={this.state.page === i ? 'active-page ml-1 mr-1': 'ml-1 mr-1'} onClick={this.showNextPage}>{i}</Pagination.Item>
        </Pagination>)   
      }
    }
    
    if (pagination.length > 6 && this.state.page + 6 <= counter) {
      slicedPagination = pagination.splice(this.state.page - 1, 6)
      if (pagination.length > 6 && this.state.page >= 2) {

        slicedPagination.unshift(<Pagination key="96">
          <Pagination.Item value="1" className='ml-1 mr-1' onClick={this.showFirstPage}> &#060;&#060;</Pagination.Item>
        </Pagination>)
      }
      slicedPagination.push(<Pagination key="97">
        <Pagination.Item className='ml-1 mr-1'> . . . </Pagination.Item>
      </Pagination>)  
      slicedPagination.push(<Pagination key="98">
        <Pagination.Item value={counter} className={this.state.page === counter ? 'active-page ml-1 mr-1': 'ml-1 mr-1'} onClick={this.showNextPage}>{counter}</Pagination.Item>
      </Pagination>)
    } else if (pagination.length > 6) {
      slicedPagination = pagination.splice(this.state.page-2, 6)
      slicedPagination.unshift(<Pagination key="99">
      <Pagination.Item value="1" className='ml-1 mr-1' onClick={this.showFirstPage}> &#060;&#060;</Pagination.Item>
      </Pagination>)
    }

    if (this.state.loading) {
      return (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      )
    }

    return (
      <div className=''>
        <div className='controls'>
        <Search
          {...this.props}
          placeholder="Search in all games"
          videosData={this.state.videos} />
        <CountrySelector
        {...this.props}
          countries={this.state.countries}
          selectedCountry={this.state.selectedCountry}
          handleCountryChange={this.handleCountryChange.bind(this)}
        />
        </div>
        <div className='column-container'>
        <div className='left-side-container'>
        <PopularVideos />
        {/* <Livescores /> */}
        <UpcomingGames />
        </div>
        <div className='videos-container'>
        <Row className=''>
            <Accordion className="w-100 text-left">
                      {videosData}
            </Accordion>
          </Row>
          <VideoModal
            show={this.state.show}
            onHide={this.handleClose}
            match={this.state.selectedVideo}
          />
          <div className='pagination mt-3 justify-content-center'>
            {slicedPagination}
          </div>
        </div>
          
        </div>
      </div>
    )
  }
}