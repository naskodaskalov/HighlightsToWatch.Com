import db from '../../Config/Database'

export default class GlobalHelpers {
    static UpdatePopularCounter(game) {
        var ref = db.database().ref("populargames");
        let games = []
        
        ref.once("value").then(function (snapshot) {
            games = snapshot.val()
        }).then(function () {
            let key = ""
            for (let k = 0; k < Object.values(games).length; k++) {
                const currentMatch = Object.values(games)[k];
                if (game.match === currentMatch.match) {
                    key = Object.keys(games)[k]
                    if (currentMatch.count == null) {
                        game.count = 1
                    } else {
                        game.count = currentMatch.count + 1
                    }
                }
            }
            
            if (process.env.NODE_ENV !== "development") {
                if (key) {
                    db.database().ref(`/populargames/${key}`).update(game)
                } else {
                    db.database().ref('/populargames/').push(game)
                }
            }
        })
    }

    static SortArrayDesc(array, property) {
        return array.sort(function (a, b) {
            if (a[property] > b[property]) {
                return -1;
            } else {
                return 1;
            }
        })
    }

    static SortArrayAsc(array, property) {
        return array.sort(function (a, b) {
            if (a[property] > b[property]) {
                return 1;
            } else {
                return -1;
            }
        })
    }
}
