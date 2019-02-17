//This require was given to us by the read me. This is required for the assignment
require("dotenv").config();

//Global variables and requires needed for packages to work

var Spotify = require('node-spotify-api');
var axios = require("axios");
var keys = require("./keys.js");
var moment = require("moment");
var spotify = new Spotify(keys.spotify);
var userInput = process.argv;
var infoArray = [];
var Input = [];
var fs = require("fs");

//Conditional statements used to run the correct function depending on the user input
if (userInput[2] === "spotify-this-song") {

    //If there is no input by the user, the default search for spotify will be "I want it that way"
    if (userInput.length <= 3) {
        spotifyThisSong("I want it that way")
    } else if (userInput.length > 3) {

        //If there is user input, this for loop will go through the third argument, push all that information to Input which is a global variable
        for (i = 3; i < userInput.length; i++) {
            Input.push(userInput[i]);
        }
        //I will use all of the user input in the third argument, use the join method so avoid confusing multiple words as multiple arguemnts, and joining
        //the data with a space. This will be my entire user input that will be used for searching.
        spotifyThisSong(Input.join(" "));
    }
}
//Else if statement to run the function for "movie-this"
else if (userInput[2] === "movie-this") {

    //If there is no user input, the default search will be "Mr. Nobody"
    if (userInput.length <= 3) {
        movieThis("Mr Nobody");
    } else if (userInput.length > 3) {

        //If there is user input, this for loop will go through the third argument, push all that information to Input which is a global variable
        for (i = 3; i < userInput.length; i++) {
            Input.push(userInput[i]);
        }
        //I will use all of the user input in the third argument, use the join method so avoid confusing multiple words as multiple arguemnts, and joining
        //the data with a space. This will be my entire user input that will be used for searching.
        movieThis(Input.join(" "));
    }
}

//Else if statement to run "do what it says"
else if (userInput[2] === "do-what-it-says") {

    //Calls the function created below and passes the "random.txt" file
    doWhatItSays("random.txt");
}

//Else if statement to run "concert this"
else if (userInput[2] === "concert-this") {
    if (userInput.length <= 3) {
        console.log("\nYou have input an invalid search. Please try again.")
    } else if (userInput.length > 3) {

        //If there is user input, this for loop will go through the third argument, push all that information to Input which is a global variable
        for (i = 3; i < userInput.length; i++) {
            Input.push(userInput[i]);
        }
        //I will use all of the user input in the third argument, use the join method so avoid confusing multiple words as multiple arguemnts, and joining
        //the data with a space. This will be my entire user input that will be used for searching.
        concertThis(Input.join(" "));
    }
};

//Create a function for the spotify API

function spotifyThisSong(track) {

    //This is the standard call back function provided from the spotify npm website. I used this to search my query and call back my response

    spotify
        .search({ type: 'track', query: track })
        .then(function (response) {

            //Create an object of all of the information that is required when doing a search

            var dataObject = {};
            var artists = [];
            var trackName = [];
            var album = [];
            var link = [];

            //Push the information from the API to the variables created above

            artists.push(response.tracks.items[0].artists[0].name);
            trackName.push(response.tracks.items[0].name);
            album.push(response.tracks.items[0].album.name);
            link.push(response.tracks.items[0].preview_url);

            //Once  Ihave created the arrays above, I push the information to the object created. The reason I have arrays and an object was because I originally meant to have
            //more than one result. I was unable to parse through it the way I wanted so I just gave back the most popular anser
            dataObject.artists = artists.join(", ");
            dataObject.trackName = trackName.join(", ");
            dataObject.album = album.join(", ");
            dataObject.link = link.join(", ");

            //Once my object was complete, I pushed the data to the global variable of infoArray. I plan to reuse some code.
            infoArray.push(dataObject);

            // console.log(dataObject)
            // console.log(infoArray)
            // console.log(response.tracks.items[0].artists[0].name)
            // console.log(response.tracks.items[0].artists[0].name)

            //Here I loop through the infoArray and console log the information. 

            for (k = 0; k < infoArray.length; k++) {

                console.log("\nArtist: " + infoArray[k].artists + "\nTrack: " + infoArray[k].trackName + "\nAlbum: " + infoArray[k].album + "\nPreview Link: " + infoArray[k].link + "\n");

                //I did not want to see null so I created a condition that would replace null with the following statement
                if (infoArray[k].link === null) {
                    infoArray[k].link = "No Link Available";
                }
            }
        })

        .catch(function (err) {
            console.log(err);
        })

};

//Function for the movie this app and a paremeter of movieName
function movieThis(movieName) {

    //Built the URL using OMDB API's website
    var url = "http://www.omdbapi.com/?apikey=trilogy&type=movie&t=" + movieName + "&plot=short";

    //Axios call passing the url created above. The axios call was pulled from axios NPM's website
    axios.get(url).then(

        function (response) {

            //Create a variable to call once and make it simple
            var r = response.data
            console.log("\nTitle: " + r.Title + "\nYear: " + r.Year + "\nIMDB Rating: " + r.Rated + "\nRotten Tomatoes Raing: " + r.Ratings[1] + "\nCountry Produced: " + r.Country +
                "\nLanguage: " + r.Language + "\nPlot: " + r.Plot + "\nActors: " + r.Actors);
        }
    )
};

//Function for do what it says with a paremter of a reference file which is refFile
function doWhatItSays(refFile) {

    //File system call back. Syntax grabbed from FS NPM's website
    fs.readFile(refFile, "utf8", function (error, data) {

        //Console log my error
        if (error) {
            return console.log(error);
        }

        //Here I created a variable which I assigned the data from the call back function. I took the data and replaced the " with no space so I can then push that 
        //information. This will fulfill what is needed for my spotifyThisSong function to work. 
        var dataInput = data.replace(/"/g, "");
        dataInput = dataInput.split(",");

        // console.log(dataInput[0])
        //After splitting my text into two strings basically, or two arguments in this case, I pass the first index to the spotify function which will search for
        //"I want it that way"
        spotifyThisSong(dataInput[1]);
    })
};

//Function for concert this
function concertThis(artist) {

    //URL built for the API call
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    //Axios call from the NPM website
    axios.get(queryURL).then(

        //Callback function
        function (response) {

            //Variable r with the response information for simplicity
            var r = response.data

            // console.log(r[0])

            //Loop through the response call back and parse data
            for (i = 0; i < r.length; i++) {

                var date = r[i].datetime;

                console.log("\nVenue: " + r[i].venue.name);
                console.log("Location: " + r[i].venue.city + ", " + r[i].venue.region);
                console.log("Date: " + moment(date).format('L') + "\n");
            }
        }
    )
};





