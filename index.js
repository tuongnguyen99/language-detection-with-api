const express = require('express');
var unirest = require("unirest");
var bodyParser = require('body-parser');
var languages = require('./languages');
const port = 4000;

const app = express();

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({
  extended: false
}));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/', (req, res) => {
  var input = req.body.input;
  // check user input
  var errors = [];
  if(input.length===0 || input.trim().length===0){
    errors.push("Enter input first!");
  };

  if(errors.length){
    res.render('index', {
      errors: errors
    });
    return;
  }

  var langs = [];

  // get result form rapidapi
  var req = unirest("GET", "https://systran-systran-platform-for-language-processing-v1.p.rapidapi.com/nlp/lid/detectLanguage/document");
  req.query({
    "input": input
  });
  req.headers({
    "x-rapidapi-host": "systran-systran-platform-for-language-processing-v1.p.rapidapi.com",
    "x-rapidapi-key": "8d98f4df37msh1fe1e4ae84ed201p15f4f9jsn49d1eff11f53"
  });

  req.end(function(res_) {
    console.log(languages.ab.name);
    if (res.error) {
      res.render('index');
      //pass
    }
    console.log(res_.body.detectedLanguages);
    var result = res_.body.detectedLanguages.map((item) => {
      var lang = item.lang;
      if (!languages[lang]) {
        item.fln = "..."
      } else {
        var fln = languages[lang].name;
        item.fln = fln;
      };
      return item;
    });

    console.log(result);
    res.render('index', {
      result: result
    });
  });
});

app.listen(port, () => {
  console.log('Server running on port ' + port);
});
