var mongo = require("./mongodb.js"),
	twitter = require('./twitter')();

(function(){
	API = function(){
		function getFollowers(user, cb){
			var ttl = Math.floor(new Date().getTime()/1000); 
			mongo.find('followers', {_id:parseInt(user.providers.twitter.id, 10),ttl:{$gte:ttl}},cb);
		}
		return {
				followers : getFollowers
		};
	};
	module.exports = API;
})(this);

