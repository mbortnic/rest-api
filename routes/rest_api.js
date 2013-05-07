	var mongo = require('mongodb');
	var Server = mongo.Server,
		Db = mongo.Db,
		BSON = mongo.BSONPure;

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