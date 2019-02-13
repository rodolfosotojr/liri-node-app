require("dotenv").config();

var Spotify = require('node-spotify-api');
var axios = require("axios");
var keys = require("./keys.js");
var moment = require("moment");
var spotify = new Spotify(keys.spotify);
var userInput = process.argv;
var infoArray = [];
var Input = [];
var fs = require("fs");

if (userInput[2] === "spotify-this-song") {

    if (userInput.length <= 3) {
        console.log("Hello World");
    } else if (userInput.length > 3) {

        for (i = 3; i < userInput.length; i++) {
            Input.push(userInput[i]);
        }
        spotifyThisSong(Input.join(" "));
    }
}

else if (userInput[2] === "movie-this") {
    if (userInput.length <= 3) {
        console.log("Hello World");
    } else if (userInput.length > 3) {

        for (i = 3; i < userInput.length; i++) {
            Input.push(userInput[i]);
        }
        movieThis(Input.join(" "));
    }
}

else if (userInput[2] === "do-what-it-says") {
    doWhatItSays("random.txt");



}

else if (userInput[2] === "concert-this") {
    if (userInput.length <= 3) {
        console.log("Hello World");
    } else if (userInput.length > 3) {

        for (i = 3; i < userInput.length; i++) {
            Input.push(userInput[i]);
        }
        concertThis(Input.join(" "));
    }
}

;

function spotifyThisSong(track) {

    spotify
        .search({ type: 'track', query: track })
        .then(function (response) {
            // console.log(response.tracks.items[0].artists[0].name);

            var dataObject = {};
            var artists = [];

            for (i = 0; i < response.tracks.items.length; i++) {

                for (j = 0; j < response.tracks.items[i].artists.length; j++) {

                    artists.push(response.tracks.items[i].artists[j].name);
                }

                dataObject.artists = artists.join(", ");
                dataObject.trackName = response.tracks.items[i].name;
                dataObject.album = response.tracks.items[i].album.name;
                dataObject.link = response.tracks.items[i].preview_url;

                infoArray.push(dataObject);

            }
            // console.log(infoArray)
            // console.log(response.tracks.items[0].artists[0].name)

            for (i = 0; i < infoArray.length; i++) {

                console.log("Artist: " + infoArray[i].artists + "\nTrack: " + infoArray[i].trackName + "\nAlbum: " + infoArray[i].album + "\nPreview Link: " + infoArray[i].link + "\n");

                if (infoArray[i].link === null) {
                    infoArray[i].link = "No Link Available";
                }
            }
        })

        .catch(function (err) {
            console.log(err);
        })


};

function movieThis(movieName) {
    var url = "http://www.omdbapi.com/?apikey=trilogy&type=movie&t=" + movieName + "&plot=short";
    axios.get(url).then(

        function (response) {
            var r = response.data
            console.log("Title: " + r.Title + "\nYear: " + r.Year + "\nIMDB Rating: " + r.Rated + "\nRotten Tomatoes Raing: " + r.Ratings[1] + "\nCountry Produced: " + r.Country +
                "\nLanguage: " + r.Language + "\nPlot: " + r.Plot + "\nActors: " + r.Actors);
        }
    )
};


function doWhatItSays(refFile) {

    fs.readFile(refFile, "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }

        var dataInput = data.replace(/"/g, "");
        dataInput = dataInput.split(",");

        spotifyThisSong(dataInput[1]);
    })

};

function concertThis(artist) {
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios.get(queryURL).then(

        function (response) {
            var r = response.data

            // console.log(r[0])

            for(i = 0; i < r.length; i++){

            var date = r[i].datetime;

            
            console.log(r[i].venue.name);
            console.log(r[i].venue.city + ", " + r[i].venue.region);
            console.log(moment(date).format('LLL') + "\n");

            }
        }
    )
};





