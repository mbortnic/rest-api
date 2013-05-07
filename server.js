/**
 * Module dependencies.
 */
"use strict";

var express  = require('express'),
	api_rest = require('./routes/rest_api');

var app = express();

app.configure(function () {
    // used to parse JSON object given in the body request
    app.use(express.bodyParser());
    app.use(express.methodOverride());
	app.use(app.router);
	app.use(logErrors);
	app.use(clientErrorHandler);
	app.use(errorHandler);
});

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.send(500, { error: 'Something blew up!' });
  } else {
    next(err);
  }
}

function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}


// ROUTES
	app.get('/', function(req, res){
	  res.send('hello world');
	});

	/**
	 * HTTP GET /tasks
	 * Returns: the list of tasks in JSON format
	 */
	app.get('/tasks', function(req, res){
		try{
			api_rest.findAll(req,res);
		} catch (ex) {
			response.send(404);
		}
	});

// HTTP
var port = process.env.PORT || 3000;
app.listen(port);

console.log("Http server listening on port 3000");

module.exports = app;