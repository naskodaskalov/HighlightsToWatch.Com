const cron = require('node-cron')
const express = require('express')
const firebase = require('firebase')
const fetch = require('node-fetch')
const port = process.env.PORT || 3303
const moment = require('moment-timezone')
var brain = require('brainjs')

const app = require('express')()
const testDBconfig = {
  apiKey: 'AIzaSyBWhfW57E5aJI6eCelZ8Fh5qYpKNOEaO-E',
  authDomain: 'mycarservicebook.firebaseapp.com',
  databaseURL: 'https://mycarservicebook.firebaseio.com',
  projectId: 'mycarservicebook',
  storageBucket: 'mycarservicebook.appspot.com',
  messagingSenderId: '1025163746657',
  appId: '1:1025163746657:web:55aaf7276c00a564fa7920'
}

const config = {
  apiKey: 'AIzaSyBNYTVpg6plcO8RAHM7OUiJ4bkSmohpmOQ',
  authDomain: 'highlightstowatch.firebaseapp.com',
  databaseURL: 'https://highlightstowatch.firebaseio.com',
  projectId: 'highlightstowatch',
  storageBucket: 'highlightstowatch.appspot.com',
  messagingSenderId: '236518122047',
  appId: '1:236518122047:web:193efaa04f94454fbe0e8a',
  measurementId: 'G-WFTXE4VHC6'
}

firebase.initializeApp(config)
app.get('/', function (req, res) {
  const games = []
  const gamesDB = []
  let gamesFromDb
  let gamesFromServer
  let addedGames = 0
  let added = ''
  let updated = ''
  const gamesAdded = []
  const gamesUpdated = []
  Promise.all([getTodaysGameFromServer(), getTodaysGamesFromDB()]).then(response => {
    gamesFromServer = response[0]
    gamesFromDb = response[1]
    for (let i = 0; i < gamesFromServer.length; i++) {
      const element = gamesFromServer[i]
      games.push(element)
    }
    if (gamesFromDb != null) {
      for (let k = 0; k < Object.values(gamesFromDb).length; k++) {
        const currentDate = Object.values(gamesFromDb)[k]
        gamesDB.push(currentDate)
      }
    }
  }).then((reqDate) => {
    const a = games
    const b = gamesDB
    const date = moment(new Date()).tz('Europe/Sofia')
      .subtract(1, 'days')
      .format('MM-DD-YYYY')
    if (a.length > b.length) {
      const missingGames = [].concat(a.filter(obj1 => b.every(obj2 => obj1.title !== obj2.title)), b.filter(obj2 => a.every(obj1 => obj2.title !== obj1.title)))
      addedGames = missingGames.length
      for (let i = 0; i < missingGames.length; i++) {
        const element = missingGames[i]
        gamesAdded.push(element.title)
        firebase
          .database()
          .ref('/matches/' + date)
          .push(element)
      }
    } else {
      const missingGames = [].concat(a.filter(obj1 => b.every(obj2 => obj1.title !== obj2.title)))
      addedGames = missingGames.length
      for (let i = 0; i < missingGames.length; i++) {
        const element = missingGames[i]
        gamesAdded.push(element.title)
        firebase
          .database()
          .ref('/matches/' + date)
          .push(element)
      }
    }
    added = `Games added: ${addedGames}`
  }).then(() => {
    const a = games
    const b = gamesDB

    if (gamesDB.length == 0) {
      return
    }
    const missingGames = [].concat(a.filter(obj1 => b.every(obj2 => {
      if (obj1.videos != null && obj2.videos != null) {
        return obj1.videos.length !== obj2.videos.length
      }
    })), b.filter(obj2 => a.every(obj1 => {
      if (obj1.videos != null && obj2.videos != null) {
        return obj2.videos.length !== obj1.videos.length
      }
    })))
    const date = moment(new Date()).tz('Europe/Sofia')
      .subtract(1, 'days')
      .format('MM-DD-YYYY')
    addedGames = missingGames.length

    for (let i = 0; i < missingGames.length; i++) {
      const element = missingGames[i]
      let key = ''
      for (let k = 0; k < Object.values(gamesFromDb).length; k++) {
        const currentMatch = Object.values(gamesFromDb)[k]
        if (element.title == currentMatch.title) {
          key = Object.keys(gamesFromDb)[k]
        }
      }
      gamesUpdated.push(element.title)
      firebase
        .database()
        .ref(`/matches/${date}/${key}`)
        .update(element)
    }
    updated = `Games updated: ${addedGames}`
  }).then(() => {
    return res
      .status(200)
      .json({
        success: true,
        gamesOnServer: games.length,
        gamesInDB: gamesDB.length,
        update: updated,
        added: added,
        gamesAdded: gamesAdded,
        gamesUpdated: gamesUpdated,
        timeNow: moment(new Date()).tz('Europe/Sofia').format('YYYY-MM-DDTHH:mm')
      })
  }).catch((err) => {
    return res
      .status(200)
      .json({ success: false, message: err.message })
  })
})

app.get('/bets', function (req, res) {
  var net = new brain.NeuralNetwork()
  net.train([
    { input: [1, 1], output: [1] }
  ])

  console.log(net.run([1, 1]))
})

app.listen(port)
console.log(`Server is running on port ${port}`)

function getTodaysGameFromServer (reqDate) {
  return new Promise(resolve => {
    resolve(fetch('https://www.scorebat.com/video-api/v1/').then(data => data.json()).then((data) => {
      const date = moment(new Date()).tz('Europe/Sofia')
        .subtract(1, 'days')
        .format('YYYY-MM-DD')
      const todaysGames = data.filter(m => m.date.split('T')[0] === date)
      return todaysGames
    }))
  })
}

function getTodaysGamesFromDB (reqDate) {
  return new Promise((resolve) => {
    const date = moment(new Date()).tz('Europe/Sofia')
      .subtract(1, 'days')
      .format('MM-DD-YYYY')
    resolve(fetch(`https://highlightstowatch.firebaseio.com/matches/${date}.json`).then(data => data.json()).then((data) => {
      return data
    }))
  })
}
