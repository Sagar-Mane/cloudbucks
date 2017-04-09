var express = require('express')
var bodyParser = require('body-parser')
var routes = require('./app/routes')
var morgan = require('morgan')
var models = require('./config/database')
var app = express()

port = process.env.PORT || 9080;
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(morgan('tiny'));
app.use(function(req, res, next) {
	  req.headers['if-none-match'] = 'no-match-for-this';
	  next();    
});

app.use('/api/',routes);


app.listen(port, function () {
  console.log('Server running at port: '+port);
});