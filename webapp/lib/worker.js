var twitter = require("./twitter.js")(),
    mongo = require("./mongodb.js"),
    async = require('async');
    
(function() {
    Worker = function() {
		var self = this;
		function getFollowers(user,cursor, count, callback) {
				self.callback = callback;
				self.count = count;
				self.followerList = [];
				_getFollowers(user,cursor,count);
        }
		function _getFollowers(user,cursor,count){
			if(cursor === 0) {
				self.callback(self.followerList);
			}else{
				twitter.followers(user, cursor, count, getFollowerDetails.bind(null,user));
			}
		}
        
        function getFollowerDetails(user,err,resp){
          var queue = async.queue(twitterCalls.bind(null, user), 10);
          var size = 100;
          resp = JSON.parse(resp);
		  var ids = [];
                while(resp && resp.ids.length){
		ids =resp.ids.splice(0, size);
                queue.push(ids.join(','));
          }
          queue.drain = function(){
			_getFollowers(user,resp.next_cursor,self.count);
          };
          
        }
        
        function twitterCalls(user,ids,callback){
             twitter.followersDetails(user,ids, function(err, data){
                if(data){
                    data = JSON.parse(data);
                    var users = [];
					var ttl = Math.floor(new Date().getTime()/1000) + 86400;
                    data.forEach(function(user){
						users.push(user.screen_name);
						self.followerList.push(user.screen_name);
                    });
					mongo.FnUpdate('followers',
									{_id: parseInt(user.providers.twitter.id,10)},
									{$addToSet:{'followers': {$each : users}},$set: {ttl:ttl}},
									{upsert: true},
									function(e,r){
										console.log(r);
									}
				 );
			}
                callback();
           });
        }
        
        return {
            followers: getFollowers
        };
    };
    module.exports = Worker;
})(this);


