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
      var name, profileImage, location, completedChallenges;

      var json = { name : "", profileImage: "", location : "", completedChallenges : [] };

      $('.public-profile-img').filter(function(){
        var data = $(this);

        profileImage = data[0].attribs.src;
        name = data.next().next().text();
        location = data.parent().find('.flat-top.wrappable').slice(1).text();

        json.name = name;
        json.profileImage = profileImage;
        json.location = location;
      })

      if (json.profileImage === '') {
        json = {error : "Bad user name"};
        res.setHeader('content-type', 'application/json');
        return res.status(404).send(JSON.stringify(json));
      }

      // FIXME: Filter from tbody tr
      $('tr').filter(function(i, element){
        // FIXME: Can remove 40 - 42 if filter from tbody tr
        if( i === 0) {
          return true;
        }
        var base_url = 'https://www.freecodecamp.com'
        json.completedChallenges.push(
                                       {
                                         title: $(this).children().first().text(),
                                         completed_at: $(this).children().eq(1).text(),
                                         updated_at: $(this).children().eq(2).text(),
                                         url: base_url + $(this).children().find('a').attr('href')
                                       }
                                      )
      })

      // json.completedChallenges.push({url: $('a').attr('href')});

      res.setHeader('content-type', 'application/json');
      res.send(JSON.stringify(json, null, 3));
    }
  });
});

app.get('/challenge/:name', function(req, res){
  var url = 'https://www.freecodecamp.com/challenges/' + req.params.name;

  request(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(body);
      var title, instructions;

      var json = { title: "", instructions: "" };

      $(".challenge-instructions-title").filter(function(){
        var data = $(this);
        var title = data.text();

        json.title = title;
      })

      $(".challenge-instructions").filter(function(){
        var data = $(this);

        data.each(function(i) {
          json.instructions = json.instructions + $(this).text();
        })
      })

      res.setHeader('content-type', 'application/json');
      res.send(JSON.stringify(json, null, 3));
    }
  })
});

app.listen(app.get('port'), function(){
  console.log('Express start press Ctrl-C to terminate');
});
