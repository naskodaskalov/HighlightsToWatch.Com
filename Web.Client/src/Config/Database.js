import firebase from 'firebase'

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

const db = firebase.initializeApp(config);

export default db