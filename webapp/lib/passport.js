var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var mongo = require("./mongodb.js");
var twitter = require("./twitter.js")();
var config = require("../config.json");

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new TwitterStrategy({
    consumerKey: config.TWITTER_CONSUMER_KEY,
    consumerSecret: config.TWITTER_CONSUMER_SECRET,
    callbackURL: "http://"+config.host+"/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    
    process.nextTick(function () {    
		//console.log(profile);
		mongo.find("Users",{"providers.twitter.id":profile.id},function(results) {
			
			if(results.length == 0) {			
				
				var doc = { "displayName" : profile.displayName,"username":profile.username,"email" : "","providers" : {"twitter" : {"id" : profile.id,
				"OAuthToken" : token,
				"OAuthSecretToken" : tokenSecret } }
				, "profile_pic":profile._json.profile_image_url_https 
				, "followers_count":profile._json.followers_count 
				, "friends_count":profile._json.friends_count 
				, "statuses_count":profile._json.statuses_count 
				};
				
				mongo.insert("Users",doc,function(doc) {
					
					twitter.follow(doc[0],function(){
						doc[0].AddProfile = true;
						return done(null, doc[0]);	
					});
					
					
				});
				
				
			} else {
				
				//old account !!
				results[0].AddProfile = false;
				results[0].profile_pic = profile._json.profile_image_url_https; 
				results[0].followers_count = profile._json.followers_count; 
				results[0].friends_count = profile._json.friends_count; 
				results[0].statuses_count = profile._json.statuses_count; 
				return done(null, results[0]);
				
			}
		
		});     
      
    });
    
  }
  
));

module.exports = passport;
