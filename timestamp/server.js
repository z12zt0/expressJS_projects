// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/api/:time?", function(req, res, next) {
  let data = req.params.time;

  if (!data) {
    return res.json({"unix": Date.now(), "utc": new Date().toUTCString()});
  }
  let utc = null;
  let unix = null;
  // if the given data is not a timestamp and it's given in the right format
  if (!data.match(/^\d+$/) && /^\d{4}-\d{2}-\d{2}$/.test(data)) {
    unix = Number(new Date(data));
    utc = new Date(data).toUTCString();
    console.log(`unix: ${unix}, utc: ${utc}`);
    console.log("I WAS HERE - DAtA");
    res.send({"unix": unix, "utc": utc});
    return;
  }
  // timestamp
  if (data.match(/^\d+$/)) {
    unix = data;
    utc = new Date(Number(data)).toUTCString();
    console.log(`unix: ${unix}, utc: ${utc}`);
    console.log("I WAS HERE - TIMESTAMP");
    res.send({"unix": data, "utc": utc});
    return;
  }
  res.send({"error": "Invalid Date"});
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

