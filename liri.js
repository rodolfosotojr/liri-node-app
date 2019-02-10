require("dotenv").config();

var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var userInput = process.argv;
var infoArray = [];
var Input = [];

if (userInput[2] === "spotify-this-song") {

    if(userInput.length <=3){
        console.log("Hello World");
    }else if(userInput.length > 3) {

    for (i = 3; i < userInput.length; i++) {
        Input.push(userInput[i]);
    }
    spotifyThisSong(Input.join(" "));
    }

};

function spotifyThisSong(track) {

    spotify
        .search({ type: 'track', query: track })
        .then(function (response) {
            // console.log(response.tracks.items[0].artists[0].name);

            for (i = 0; i < response.tracks.items.length; i++) {

                var dataObject = {};
                var artists = [];

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

                if (infoArray[i].link === null) {
                    infoArray[i].link = "No Link Available";
                }

                console.log("Artist: " + infoArray[i].artists + "\nTrack: " + infoArray[i].trackName + "\nAlbum: " + infoArray[i].album + "\nPreview Link: " + infoArray[i].link + "\n");

            }

        })


        .catch(function (err) {
            console.log(err);
        })


};





