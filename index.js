var express = require('express');
var request = require('request');
var cheerio = require('cheerio');

var app = express();

app.set('port', process.env.PORT || 3000);

app.get('/users/:name', function(req, res){
  var url = 'https://www.freecodecamp.com/user512';

  request(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(body);
    }
  }
})

app.listen(app.get('port'), function(){
  console.log('Express start press Ctrl-C to terminate');
});
