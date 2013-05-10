/**
 * Module dependencies.
 */
"use strict";

var express  = require('express'),
	api_rest = require('./routes/rest_api');

var app = express();

app.configure(function () {
    // used to parse JSON object given in the body request
    // defer = true disables multiprocessing to Formidable
    app.use(express.bodyParser({defer: true}));
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
	  // res.send('hello world');

	  res.writeHead(200, {'content-type': 'text/html'});
	  res.end(
	    '<form action="/file" enctype="multipart/form-data" method="post">'+
	    '<input type="text" name="title"><br>'+
	    '<input type="file" name="upload" multiple="multiple"><br>'+
	    '<input type="submit" value="Upload">'+
	    '</form>'
	  );
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

	/**
	 * HTTP GET /tasks/:id
	 * Param: :id is the unique identifier of the task you want to retrieve
	 * Returns: the task with the specified :id in a JSON format
	 * Error: 404 HTTP code if the task doesn't exists
	 */
	app.get('/tasks/:id', function (req, res) {
	    try {
	        api_rest.findById(req,res);
	    } catch (ex) {
	        response.send(404);
	    }
	    
	});

	/**
	 * HTTP POST /tasks/
	 * Body Param: the JSON task you want to create
	 * Returns: 200 HTTP code
	 */
	app.post('/tasks', function (req, res) {
		try {
	        api_rest.addTask(req,res);
	    } catch (ex) {
	        response.send(404);
	    }
	});

	/**
	 * HTTP POST /tasks/
	 * Body Param: the JSON task you want to create
	 * Returns: 200 HTTP code
	 */
	app.post('/file', function (req, res) {
		try {
	        api_rest.postFile(req,res);
	    } catch (ex) {
	        response.send(404);
	    }
	});

	/** Test with:
	/* curl -i -X POST -H "Content-Type: multipart/form-data" -F "title=test" -F "upload=@c:\temp\npm.png;type=image/png" http://localhost:3000/file
	*/

// HTTP
var port = process.env.PORT || 3000;
app.listen(port);

console.log("Http server listening on port 3000");

// module.exports = app;