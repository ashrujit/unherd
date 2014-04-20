var MongoClient = require('mongodb').MongoClient;
var config = require("../config.json");

var connect = function(host, port, database, cb) {	
	
	database = 'web';
	MongoClient.connect('mongodb://10.0.1.200:27017/'+database, function(err, db) {
	//MongoClient.connect('mongodb://127.0.0.1:27017/'+database, function(err, db) {

		if(err) throw err;
			
		cb(db);
		
		
	});
  
};

var find = function(col,query,cb) {
	
	connect(config.db.host,config.db.port,config.db.database,function(db) {
		
		var collection = db.collection(col);
		
		collection.find(query).toArray(function(err, results) {
			
			cb(results);
            db.close();
		
		});
		
	});
	
};

var FnFindOne = function(col,query,cb) {
	
	connect(config.db.host,config.db.port,config.db.database,function(db) {
		
		var collection = db.collection(col);
		
		collection.findOne(query, function(err, result) {
			
			cb(err,result);
            db.close();
		
		});
		
	});
	
};


var findAndSort = function(col,query,sortdoc,cb) {
	
	connect(config.db.host,config.db.port,config.db.database,function(db) {
		
		var collection = db.collection(col);
		
		collection.find(query).sort(sortdoc).toArray(function(err, results) {
			
			cb(results);
            db.close();
		
		});
		
	});
	
};

var insert = function(col,doc,cb) {
	
	connect(config.db.host,config.db.port,config.db.database,function(db) {
		
		var collection = db.collection(col);
		
		collection.insert(doc, function(err, docs) {
			
			cb(docs);
            db.close();
		
		});
		
	});
	
};

var FnDelete = function(col,query,cb) {
	
	connect(config.db.host,config.db.port,config.db.database,function(db) {
		
		var collection = db.collection(col);
		
		collection.remove(query, function(err, docs) {
			
			cb(docs);
            db.close();
		
		});
		
	});
	
};

var FnUpdate = function(col,query,doc,options,cb) {
	
	connect(config.db.host,config.db.port,config.db.database,function(db) {
		
		var collection = db.collection(col);
		
		collection.update(query, doc, options, function(err, docs) {
			
			cb(err,docs);
            db.close();
		
		});
		
	});
	
};

module.exports.find = find;
module.exports.findAndSort = findAndSort;
module.exports.insert = insert;
module.exports.FnUpdate = FnUpdate;
module.exports.FnDelete = FnDelete;
module.exports.FnFindOne = FnFindOne;





