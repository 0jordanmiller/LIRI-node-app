// Node Package Permission Variables
require("dotenv").config();
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var keys = require('./keys.js');
var request = require('request');
var fs = require('fs');

// Argument variables
var arg2 = process.argv[2];
var arg3 = process.argv[3];
var procArg = process.argv;

var spotify = new Spotify(keys.spotify);
var client = new Twitter (keys.twitter);

var params = {screen_name: 'JKM17421117'};

//Functions
function appendFile(data) {
    fs.appendFile('log.txt', '\n' + data, function(err) {
        if (err) throw err;
        console.log('Saved!');
    })
}

function listTweets() {
    client.get('statuses/user_timeline', params, function(error, tweets,) {
        var allTweets = ''
        if (!error) {
            for (i = 0; i < tweets.length; i++) {
                allTweets += ('\nTweet Text: ' + tweets[i].text + '\nTweet Date: ' + tweets[i].created_at+ '\n');
            }
            console.log(allTweets);
            appendFile(allTweets);
        }
    });
}

function searchSpotify(arg) {
    var songSearch = process.argv.slice(3).join(" ");
    spotify.search({ type: 'track', query: songSearch }, function(err, data) {
        if (err) {
            spotify.search({ type: 'track', query: arg }, function(err, data) {
                if (err) {
                  return console.log('Error occurred: ' + err);
                }
                var song = 'Artist Name: ' + data.tracks.items[0].album.artists[0].name + '\nTrack Title: ' + data.tracks.items[0].name + '\nPreview URL: ' + data.tracks.items[0].preview_url + '\nAlbum Title: ' + data.tracks.items[0].album.name
                console.log(song)
                appendFile(song)
            });
        }
        var song = 'Artist Name: ' + data.tracks.items[0].album.artists[0].name + '\nTrack Title: ' + data.tracks.items[0].name + '\nPreview URL: ' + data.tracks.items[0].preview_url + '\nAlbum Title: ' + data.tracks.items[0].album.name
        console.log(song)
        appendFile(song)
    });
}

function findMovie () {
    var term = process.argv.slice(3).join(" ");
    request('http://www.omdbapi.com/?apikey=trilogy&t=' + term, function (err, res) {
        var data = JSON.parse(res.body);
        var movieData = '\nTitle: ' + data.Title + '\nRelease date: ' 
        + data.Released + '\nRotten Tomatoes Rating: ' + data.Ratings[1].Value
        + '\nCountry: ' + data.Country + '\nLanguage: ' + data.Language + '\nPlot: '
        + data.Plot + '\nActors: ' + data.Actors;

        console.log('error:', err);
        console.log(movieData);
        appendFile(movieData);
    });

}

function doRandom () {
    fs.readFile('random.txt', 'utf-8', function(err, data) {
        if (err) {
            return console.log(err);
        }
        var dataArr = data.split(',');
        
        if (dataArr[0] === 'spotify') {
            console.log(dataArr[1]);
            searchSpotify(dataArr[1]);
        } else if (dataArr[0] === 'my-tweets') {
            listTweets();
        }
    });
}   

//Code execute
if (arg2 === 'my-tweets') {
    listTweets();
}  else if (arg2 === 'spotify' && arg3 === undefined) {
    searchSpotify('The Sign Ace of the Base');
}  else if (arg2 === 'spotify' && arg3 != undefined) {
    searchSpotify(arg3);
} else if (arg2 === 'movies' && arg3 != undefined) {
    findMovie();
} else if (arg2 === 'movies' && arg3 === undefined) {
    findMovie('Mr. Nobody');
} else if (arg2 === 'do-random' && arg3 === undefined) {
    doRandom();
}

// * In addition to logging the data to your terminal/bash window, output the data to a .txt file called `log.txt`.

// * Make sure you append each command you run to the `log.txt` file. 

// * Do not overwrite your file each time you run a command.