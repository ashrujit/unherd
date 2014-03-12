var api = require('./lib/api.js')(),
	worker = require('./lib/worker.js')();


(function(){
	Controller = function(){
		followers = function(request, response){
			api.followers(request.user, function(data){
				var response_data = (data && data[0] && data[0].followers) ? data[0].followers : [];
				response.json(response_data);
			});
		};
		fetch = function(request,response){
			worker.followers(request.user,-1,5000,function(err,resp){
				response.send("finished fetching users");
			});
		};
		return  this;
	};
	module.exports = Controller();
})(this);