var api = require('./lib/api.js')(),
	worker = require('./lib/worker.js')();


(function(){
	Controller = function(){
		followers = function(request, response){
			api.followers(request.user, function(data){
				if(data.length){
					var response_data = (data && data[0] && data[0].followers) ? data[0].followers : [];
					response.json(response_data);
				}else{
					fetch(request.user, function(users){
						response.json(users);
					});
				}
			});
		};
		fetch = function(user, callback){
			worker.followers(user,-1,5000,callback);
		};
		return  this;
	};
	module.exports = Controller();
})(this);