var mongo = require("./mongodb.js"),
	twitter = require('./twitter')();

(function(){
	API = function(){
		function getFollowers(user, cb){
			mongo.find('followers', {_id:parseInt(user.providers.twitter.id, 10)},cb);
		}
		return {
				followers : getFollowers
		};
	};
	module.exports = API;
})(this);

