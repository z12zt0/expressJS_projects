require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();


// fix regexp
// if (data) -> there is always data, so find another way
// p.s. - fuck the callbacks, I'm too dumb for this shit

const bodyParser = require("body-parser");

// database connection
const mongodb = require("mongodb");
const mongoose = require("mongoose");
mongoose.connect(process.env.MB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
//

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Schema for database

let sitesSchema = new mongoose.Schema({
  longURL: String,
  shortURL: Number
});

let siteList = mongoose.model("siteList", sitesSchema);

// connecting body parser 
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); // action="/url"
//

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post("/api/shorturl", async function(req, res) {
  let { url } = req.body;

  if (url.match(/^(http)s?:\/{2}w{3}\.\S+\.\w+(\/\w+\/?)*$/)) { // if this is an URL -
    let fromData = await siteList.findOne({ "longURL": url });

    if (fromData) {
      return res.json({"longURL": fromData.longURL, "shortURL": fromData.shortURL});
    }
    let currentLength = await siteList.estimatedDocumentCount();
    let newSite = await siteList.create({ "longURL": url, "shortURL": currentLength });
    let saved = await newSite.save(); 

    return res.json({"longURL": saved.longURL, "shortURL": saved.shortURL});
  }
  console.log("nothing to parse?");
  return res.json({error: "Please enter a valid url"});
});

app.get("/api/shorturl/:number", async function(req, res) {
  let shortUrl = req.params.number;
  let data = await siteList.findOne({ "shortURL": shortUrl });

  console.log("was here 2:", data);
  if (data?.shortURL == shortUrl) {
    let url = data.longURL;
    res.redirect(url);
  }
  return res.json({"error": "No short URL found for the given input"});
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
