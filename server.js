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
moment().format();

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
app.post('/addEvent', addEvent);
app.post('/submit', renderWeather);
app.post('/mainview', mainView);
app.get('*', (request, response) => response.status(404).send('This page does not exist!'));


// route callbacks

function homePage(request, response) {
  response.render('pages/login')
}

function addEvent(request, response) {
  let responseObj = {};
  responseObj.userName = request.body.userName;
  response.render('pages/addevent', { mainviewObj: responseObj })
}

function mainView(request, response) {
  let responseObj = {}
  let startingDate = (request.body.startingDate) ? new Date(request.body.startingDate) : new Date();
  let userName = request.body.userName;
  let week = weekMaker(startingDate);
  let weekFormatted = week.map(day => `time='${day}'`).join(' OR ');
  let SQL = `SELECT * FROM events WHERE (userName='${userName}' AND (${weekFormatted}));`
  client.query(SQL)
    .then(answer => {
      responseObj.events = answer.rows;
      responseObj.userName = userName;
      responseObj.startingDate = startingDate;
      responseObj.ahead7 = new Date(startingDate.getFullYear(), startingDate.getMonth(), startingDate.getDate() + 7).toLocaleDateString()
      responseObj.back7 = new Date(startingDate.getFullYear(), startingDate.getMonth(), startingDate.getDate() - 7).toLocaleDateString()
      response.render('pages/mainview', { mainviewObj: responseObj })
    })
}

function renderWeather(request, response) {
  let userName = request.body.userName
  let time = request.body.date
  let GOOGURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${request.body.location}&key=${process.env.GOOGLE_API}`
  superagent.get(GOOGURL)
    .then(goog => {
      let loc = goog.body.results[0].formatted_address
      let latt = goog.body.results[0].geometry.location.lat
      let long = goog.body.results[0].geometry.location.lng
      darksky
        .coordinates({ lat: `${latt}`, lng: `${long}` })
        .time(`${time}`)
        .units('us')
        .language('en')
        .exclude('minutely,currently,hourly,alerts,flags')
        .get()
        .then(reply => {
          let saveTime = new Date().getTime()
          let replyObj = reply.daily.data[0]
          replyObj.formattedLoc = loc
          replyObj.saveTime = saveTime
          replyObj.userName = userName
          replyObj.time = new Date(replyObj.time * 1000).toLocaleDateString()
          saveDayToDB(replyObj)
          replyObj.saveTime = new Date(saveTime)
          for (let property in replyObj) {
            if (replyObj.hasOwnProperty(property)) {
              let regexUnixTime = /\d{10}/
              let regexTimeCheck = /[tT]ime/
              if (regexUnixTime.test(replyObj[property]) && regexTimeCheck.test(property)) {
                replyObj[property] = new Date(replyObj[property] * 1000).toLocaleTimeString()
              } else {
                // console.log(` ${property}: ${replyObj[property]} is not a match (is it a string?)`)
              }
            }
          }
          response.render('pages/result', { mainviewObj: replyObj })
        })
        .catch(console.log)
    })
}


// helper functions

function saveDayToDB(eventObj) {
  let fields = Object.keys(eventObj);
  let values = Object.values(eventObj).map(item => `'${item}'`);
  let SQL1 = `INSERT INTO events (${fields}) VALUES (${values})`
  client.query(SQL1)
}



function checkTimeouts(sqlInfo, sqlData) {
  const timeouts = {
    weather: 60 * 5 * 1000, // five minutes
    yelp: 24 * 1000 * 60 * 60, // 24-Hours
    movie: 30 * 1000 * 60 * 60 * 24, // 30-Days
    event: 6 * 1000 * 60 * 60, // 6-Hours
    trail: 7 * 1000 * 60 * 60 * 24 // 7-Days
  };
  // if there is data, find out how old it is.
  if (sqlData.rowCount > 0) {
    let ageOfResults = (Date.now() - sqlData.rows[0].created_at);
    // For debugging only
    console.log(sqlInfo.endpoint, ' AGE:', ageOfResults);
    console.log(sqlInfo.endpoint, ' Timeout:', timeouts[sqlInfo.endpoint]);
    // Compare the age of the results with the timeout value
    // Delete the data if it is old
    if (ageOfResults > timeouts[sqlInfo.endpoint]) {
      let sql = `DELETE FROM ${sqlInfo.endpoint}s WHERE location_id=$1;`;
      let values = [sqlInfo.id];
      client.query(sql, values)
        .then(() => { return null; })
        .catch(error => handleError(error));
    } else { return sqlData; }
  }
}

const weekMaker = (startDay) => {
  let startingDay = startDay.getDay()
  let startOfWeek = new Date(startDay.getFullYear(), startDay.getMonth(), startDay.getDate() - startingDay)
  let week = []
  for (let i = 0; i < 7; i++) {
    week.push(
      new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i).toLocaleDateString()
    )
  }
  return week;
}
