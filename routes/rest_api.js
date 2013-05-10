	var mongo = require('mongodb');
	var Step = require('step');
	var Server = mongo.Server,
		Db = mongo.Db,
		BSON = mongo.BSONPure,
		Grid = mongo.Grid,
		GridStore = mongo.GridStore;
	// var Formidable = require('formidable');
	var Util = require('util');
	var gridform = require('gridform');

	// var MongoClient = require('mongodb').MongoClient,
	// 	Grid = mongo.Grid,
	// 	GridStore = mongo.GridStore,
	// 	BSON = mongo.BSONPure;

	var server = new Server('localhost', 27017, {auto_reconnect: true});
	db = new Db('tasks', server);
	 
	db.open(function(err, db) {
	    if(!err) {
	        console.log("Connected to 'tasks' database");
	        db.collection('tasks', {strict:true}, function(err, collection) {
	            if (err) {
	                console.log("The 'tasks' collection doesn't exist. Creating it with sample data...");
	                populateDB();
	            }
	        });
	    }
	});

	exports.findAll = function(req, res) {
	    db.collection('tasks', function(err, collection) {
	        collection.find().toArray(function(err, items) {
	            res.send(items);
	        });
	    });
	};

	exports.findById = function(req, res) {
	    var id = req.params.id;
	    console.log('Retrieving task: ' + id);
	    db.collection('tasks', function(err, collection) {
	        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
	            res.send(item);
	        });
	    });
	};

	exports.addTask = function(req, res) {
	    var task = req.body;
	    console.log('Adding task: ' + JSON.stringify(task));

	    // TODO: check to see if well formed

	    db.collection('tasks', function(err, collection) {
	        collection.insert(task, {safe:true}, function(err, result) {
	            if (err) {
	                res.send({'error':'An error has occurred'});
	            } else {
	                console.log('Success: ' + JSON.stringify(result[0]));
	                res.send(result[0]);
	            }
	        });
	    });
	}

	exports.postFile = function(req, res) {
/*		var form = new Formidable.IncomingForm();

		form.parse(req, function(err, fields, files){
			if (err){
				console.log(err);
				res.send(500, { error: 'Something blew up!' });
			} else {
				res.writeHead(200, {'content-type': 'text/plain'});
      			res.write('received upload:\n\n');
      			res.end(Util.inspect({fields: fields, files: files}));
			}
		})*/

		gridform.db = db;
		gridform.mongo = mongo;

	    // var incomingForm = req.form;  // it is Formidable form object

	    var incomingForm = gridform();

	    incomingForm.on('error', function(err){

	          console.log(error);  //handle the error

	    })

	    incomingForm.on('fileBegin', function(name, file){
	         // file.metadata = field.title;
	         // do your things here when upload starts
	         console.log('begin file');

	    })


	    incomingForm.on('end', function(){
	         // do stuff after file upload
	         console.log('end file');
	    });

	    // Main entry for parsing the files
	    // needed to start Formidables activity
	    incomingForm.parse(req, function(err, fields, files){
			if (err){
				console.log(err);
				res.send(500, { error: 'Something blew up!' });
			} else {
				var file = files.upload;
				file.metadata = fields.title;

				res.writeHead(200, {'content-type': 'text/plain'});
      			res.write('received upload:\n\n');
      			res.end(Util.inspect({fields: fields, files: files}));
      			console.log('respond file details');
      		}
	    })	

	  //   var newFile = req.files[0];
	  //   console.log('Posting file: ' + JSON.stringify(newFile));

	  //   // TODO: check to see if well formed

	  //   var fileId = new BSON.ObjectID();
	  //   var gridStore = new GridStore(db, fileId, "w", {root:'fs'});
  	// 	gridStore.chunkSize = 1024 * 256;

  	// 	gridStore.open(function(err, gridStore) {
		 //   Step(
		 //     function writeData() {
		 //         gridStore.write(newFile, this);
		 //     },

		 //     function doneWithWrite() {
		 //     	console.log("Closing gsW");
		 //     	gridStore.close(this);
		 //     	console.log("Closed gsW");
		 //     	res.send(200);
		 //     }
			// )
		// });
	}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.

var populateDB = function() {
 
    var tasks = [
    {
        name: "Get the Milk",
        year: "2013",
        description: "1 gallon of skim milk",
        picture: "carton.jpg"
    },
    {
        name: "Get eggs",
        year: "2013",
        description: "dozen eggs",
        picture: "eggcarton.jpg"
    }];
 
    db.collection('tasks', function(err, collection) {
        collection.insert(tasks, {safe:true}, function(err, result) {});
    });
 
};