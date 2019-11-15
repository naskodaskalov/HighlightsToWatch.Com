const cron = require('node-cron');
const express = require("express");
const firebase = require("firebase");
const fetch = require("node-fetch");
const port = process.env.port || 8000
const moment = require("moment")

const app = require('express')()
const testDBconfig = {
    apiKey: "AIzaSyBWhfW57E5aJI6eCelZ8Fh5qYpKNOEaO-E",
    authDomain: "mycarservicebook.firebaseapp.com",
    databaseURL: "https://mycarservicebook.firebaseio.com",
    projectId: "mycarservicebook",
    storageBucket: "mycarservicebook.appspot.com",
    messagingSenderId: "1025163746657",
    appId: "1:1025163746657:web:55aaf7276c00a564fa7920"
};

const config = {
    apiKey: "AIzaSyBNYTVpg6plcO8RAHM7OUiJ4bkSmohpmOQ",
    authDomain: "highlightstowatch.firebaseapp.com",
    databaseURL: "https://highlightstowatch.firebaseio.com",
    projectId: "highlightstowatch",
    storageBucket: "highlightstowatch.appspot.com",
    messagingSenderId: "236518122047",
    appId: "1:236518122047:web:193efaa04f94454fbe0e8a",
    measurementId: "G-WFTXE4VHC6"
}


firebase.initializeApp(config);
app.get('/', function (req, res) {
    
let games = []
let gamesDB = []
let gamesFromDb
let gamesFromServer
let addedGames = 0
let added = ''
let updated = ''
    Promise.all([getTodaysGameFromServer(), getTodaysGamesFromDB()]).then(response => {
        gamesFromServer = response[0]
        gamesFromDb = response[1]
        for (let i = 0; i < gamesFromServer.length; i++) {
            const element = gamesFromServer[i];
            games.push(element) 
        }
        if (gamesFromDb != null) {
            for (let k = 0; k < Object.values(gamesFromDb).length; k++) {
                const currentDate = Object.values(gamesFromDb)[k];
                gamesDB.push(currentDate)
            }
        }
    }).then(() => {
        let a = games
        let b = gamesDB
    
        if (a.length > b.length) {
            let missingGames = [].concat(
                a.filter(obj1 => b.every(obj2 => obj1.title !== obj2.title)),
                b.filter(obj2 => a.every(obj1 => obj2.title !== obj1.title))
            );
            let date = moment(new Date()).subtract(1, 'days').format("MM-DD-YYYY")
            addedGames = missingGames.length
            for (let i = 0; i < missingGames.length; i++) {
                const element = missingGames[i];
                firebase.database().ref('/matches/' + date).push(element)
            }
        }
        added = `Games added: ${addedGames}`
    }).then(() => {
        let a = games
        let b = gamesDB
    
        if (gamesDB.length == 0) {
            return
        }
        let missingGames = [].concat(
            a.filter(obj1 => b.every(obj2 => obj1.videos.length !== obj2.videos.length)),
            b.filter(obj2 => a.every(obj1 => obj2.videos.length !== obj1.videos.length))
        );
        
        let date = moment(new Date()).subtract(1, 'days').format("MM-DD-YYYY")
        addedGames = missingGames.length
        for (let i = 0; i < missingGames.length; i++) {
            const element = missingGames[i];
            let key = ''
            for (let k = 0; k < Object.values(gamesFromDb).length; k++) {
                const currentMatch = Object.values(gamesFromDb)[k];
                if (element.title == currentMatch.title) {
                    key = Object.keys(gamesFromDb)[k]
                }
            }
    
            firebase.database().ref(`/matches/${date}/${key}`).update(element)
        }
        updated = `Games updated: ${addedGames}`
    }).then(() => {
        return res.status(200).json({
            success: true,
            gamesOnServer: games.length,
            gamesInDB: gamesDB.length,
            update: updated,
            added: added
        })
    }).catch((err) => {
        return res.status(200).json({
            success: false,
            message: err.message
        })
    })
  })

app.listen(port);
console.log(`Server is running on port ${port}`);

function getTodaysGameFromServer() {
    return new Promise(resolve => {
        resolve(fetch('https://www.scorebat.com/video-api/v1/').then(data => data.json())
        .then((data) => {
            let date = moment(new Date()).subtract(1, 'days').format("YYYY-MM-DD")
            let todaysGames = data
                                .filter(m => m.date.split("T")[0] === date)
            return todaysGames
        }))
    })
}

function getTodaysGamesFromDB() {
    return new Promise((resolve) => {
        let date = moment(new Date()).subtract(1, 'days').format("MM-DD-YYYY")
        resolve(fetch(`https://highlightstowatch.firebaseio.com/matches/${date}.json`)
            .then(data => data.json())
            .then((data) => {
                return data
            }))
    })
}