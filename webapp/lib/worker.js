var twitter = require("./twitter.js")(),
    mongo = require("./mongodb.js"),
    async = require('async');
    
(function() {
    Worker = function() {
        function getFollowers(user,cursor, count, callback) {
                twitter.followers(user, cursor, count, getFollowerDetails.bind(null,user));
        }
        
        function getFollowerDetails(user,err,resp){
          var queue = async.queue(twitterCalls.bind(null, user), 10);
          var size = 500;
          resp = JSON.parse(resp);
          var ids = [];
          while(resp.ids.length){
                ids =resp.ids.splice(0, size);
                queue.push(ids.join(','));
          }
          queue.drain = function(){
                getFollowers(resp.ids.next_cursor);
          };
          
        }
        
        function twitterCalls(user,ids,callback){
             twitter.followersDetails(user,ids, function(err, data){
                if(data){
                    data = JSON.parse(data);
                    var users = [];
                    data.forEach(function(user){
						users.push(user.screen_name);
                    });
                    mongo.update('followers',parseInt(user.providers.twitter.id,10), users,function(e,r){
                        console.log(r);
                    });
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


