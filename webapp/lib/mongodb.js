var MongoClient = require('mongodb').MongoClient;
var config = require("../config.json");

var connect = function(host, port, database, cb) {	
	
	database = 'web';
	MongoClient.connect('mongodb://admin:lILtzTSIaAFt@'+process.env.OPENSHIFT_MONGODB_DB_HOST+':'+process.env.OPENSHIFT_MONGODB_DB_PORT+'/'+database, function(err, db) {
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

var insert = function(col,doc,cb) {
	
	connect(config.db.host,config.db.port,config.db.database,function(db) {
		
		var collection = db.collection(col);
		
		collection.insert(doc, function(err, docs) {
			
			cb(docs);
            db.close();
		
		});
		
	});
	
};

module.exports.find = find;
module.exports.insert = insert;





