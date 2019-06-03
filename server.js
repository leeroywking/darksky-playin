'use strict';

//Access to environmental variables
require('dotenv').config();

//Dependencies
const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
const methodOverride = require('method-override');
const DarkSky = require('dark-sky');
const darksky = new DarkSky(process.env.DARK_SKY);
const request = require('request');
const queryString = require('query-string')
const moment = require('moment');
// const parsed = queryString.parse(location.search);
moment().format();

// request('http://www.google.com', function (error, response, body) {
//   console.log('error:', error); // Print the error if one occurred
//   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//   console.log('body:', body); // Print the HTML for the Google homepage.
// });



//App setup
const app = express();
const PORT = process.env.PORT;

//Express middleware
//Utilize expressJS functionality to parse the body of the request
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride((request, response) => {
  if (request.body && typeof request.body === 'object' && '_method' in request.body) {
    //look in the url encoded POST body and delete correct method
    let method = request.body._method;
    delete request.body._method;
    return method;
  }
}));


//Connecting to the database
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.log(err));

//Turn the server on
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));

// Set view engine
app.set('view engine', 'ejs');

// routes
app.get('/', homePage);


// route callbacks
function homePage(request, response){
    let returnObj = {}
    .then(response.render('page/index', {indexObj: returnObject}))
}

const trial = () =>{
darksky
.coordinates({lat: 37.8267, lng: -122.423})
.time('2019-05-30')
.units('us')
.language('en')
.exclude('minutely,currently,hourly,alerts,flags')
.get()
.then(console.log)
.catch(console.log)
}
trial();