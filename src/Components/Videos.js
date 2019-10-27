import React, { Component } from 'react'
import { Row, Accordion, Pagination, Spinner } from 'react-bootstrap'
import CountrySelector from './CountrySelector'
import MatchContainer from './MatchContainer'
import VideoModal from './VideoModal'
import axios from 'axios'

export default class Videos extends Component {
  constructor (props) {
    super(props)

    this.state = {
      videos: [],
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
    this.saveCountries = this.saveCountries.bind(this)
    this.handleCountryChange = this.handleCountryChange.bind(this)
    this.showAllVideos = this.showAllVideos.bind(this)
    this.showFirstPage = this.showFirstPage.bind(this)
  }

 getDataFromServer() {
   return new Promise((resolve) => {
     resolve(axios('https://www.scorebat.com/video-api/v1/').then(response => {
      const gamesFromServer = response.data
      let d = new Date().toLocaleDateString()
      let fd = d.split("/")[2] + "-" + d.split("/")[0] + "-" + d.split("/")[1]
      let todaysGames = gamesFromServer
                          .filter(m => m.date.split("T")[0] === fd)
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
          for (let t = 0; t < Object.values(currentDate).length; t++) {
            const p = Object.values(currentDate)[t];
            games.push(p)
            
          } 
        }

        this.setState({ videos: games })
      })
      .then(() => {
        this.saveCountries()
      })
      .then(() => {
        this.sliceVideoArray(this.state.videos, true)
      })
      .then(() => {
        this.setState({ loading: false })
      })
  }

  handleCountryChange(e) {
    const selectedCountry = e.target.innerText
    this.setState({ selectedCountry })
    var filteredData = this.state.videos.filter(a => a.competition.name.split(':')[0] === selectedCountry)
    this.sliceVideoArray(filteredData, false)
  }

  saveCountries() {
    let videos = this.state.videos
    
    let countries = []
      for (let i = 0; i < videos.length; i++) {
        let country = videos[i].competition.name.split(':')[0]
        if (!countries.includes(country)) {
          countries.push(country)
        }
    }

    this.setState({ countries })
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

  showAllVideos() {
    this.setState({ selectedCountry: '' })
    this.sliceVideoArray(this.state.videos, true)
  }

  render() {
    const videos = this.state.videosOnPage
    let videosData = videos.map((video, index) => (
      <MatchContainer
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
      <div>
        <CountrySelector
          countries={this.state.countries}
          handleCountryChange={this.handleCountryChange}
          selectedCountry={this.state.selectedCountry}
          showAll={this.showAllVideos}
        />
        <div className='container'>
          <Row className='videos-container'>
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
    )
  }
}