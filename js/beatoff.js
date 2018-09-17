var request = require('request');
var cheerio = require('cheerio');

// find elements
var banner = $("#banner-message")
var button = $("button")

// handle click
button.on("click", function() {
  request('http://www.google.com/', function(err, resp, html) {
    if (!err) {
      const $ = cheerio.load(html);
      console.log(html);
    }
  });
})
