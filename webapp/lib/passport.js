var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var mongo = require("./mongodb.js");
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
    callbackURL: "http://"+config.host+":"+config.port+"/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    
    process.nextTick(function () {    
      
		mongo.find("Users",{"providers.twitter.id":profile.id},function(results) {
		
			if(results.length == 0) {
				
				var doc = { "displayName" : profile.displayName,"username":profile.username,"email" : "","providers" : {"twitter" : {"id" : profile.id,
				"OAuthToken" : token,
				"OAuthSecretToken" : tokenSecret } } };
				
				mongo.insert("Users",doc,function(doc) {
					
					// new account !!
					doc[0].AddProfile = true;
					return done(null, doc[0]);
					
				});
				
				
			} else {
				
				//old account !!
				results[0].AddProfile = false;
				return done(null, results[0]);
				
			}
		
		});     
      
    });
    
  }
  
));

module.exports = passport;
