var express = require('express');
var request = require('request');
var cheerio = require('cheerio');

var app = express();

app.set('port', process.env.PORT || 3000);

app.get('/user/:name', function(req, res){
  var url = 'https://www.freecodecamp.com/' + req.params.name;

  request(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(body);
      var name, profileImage, location, longestStreak, currentStreak, completedChallenges;

      var json = { name : "", profileImage: "", location : "", longestStreak : "", currentStreak : "",
                   completedChallenges : [] };

      $('.public-profile-img').filter(function(){
        var data = $(this);

        profileImage = data[0].attribs.src;
        name = data.next().next().text();
        location = data.parent().find('.flat-top.wrappable').slice(1).text();

        json.name = name;
        json.profileImage = profileImage;
        json.location = location;
      })

      res.setHeader('content-type', 'application/json');
      res.send(JSON.stringify(json, null, 3));
    }
  });
});

app.listen(app.get('port'), function(){
  console.log('Express start press Ctrl-C to terminate');
});
