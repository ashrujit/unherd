var OAuth= require('oauth').OAuth;
var config = require("../config.json");

function TwitterActions() {
	
	var oa = new OAuth(
		"https://twitter.com/oauth/request_token"
	  , "https://twitter.com/oauth/access_token"
	  , config.TWITTER_CONSUMER_KEY
	  , config.TWITTER_CONSUMER_SECRET
	  , "1.0A"
	  , "http://"+config.host+":"+config.port+"/auth/twitter/callback"
	  , "HMAC-SHA1"
	);
		
	var FnTweet = function (user,tweet,cb) {

	  if (!user.providers.twitter.OAuthToken) {
		console.error("You didn't have the user log in first");
	  }

	  oa.post(
			"https://api.twitter.com/1.1/statuses/update.json"
		  , user.providers.twitter.OAuthToken
		  , user.providers.twitter.OAuthSecretToken
		  , { "status": tweet }
		  , cb
	  );

	}

	var FnDm = function (user, to, message, cb) {
		
	  oa.post(
			"https://api.twitter.com/1.1/direct_messages/new.json"
		  , user.providers.twitter.OAuthToken
		  , user.providers.twitter.OAuthSecretToken
		  , { "screen_name": to, text: message }
		  , cb
	  );
	  
	}

	var FnGetTweets = function (user, count, cb) {
		
	  oa.get(
			"https://api.twitter.com/1.1/statuses/home_timeline.json"
		  , user.providers.twitter.OAuthToken
		  , user.providers.twitter.OAuthSecretToken
		  , cb
	  );
	  
	}
	
	var FnGetUserTimeline = function (user, name, cb) {
		
	  oa.get(
			"https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name="+name
		  , user.providers.twitter.OAuthToken
		  , user.providers.twitter.OAuthSecretToken
		  , cb
	  );
	  
	}

	
	
	
	
	return {
		
		tweet : FnTweet,
		directmessage : FnDm,
		gettweets : FnGetTweets,
		timeline : FnGetUserTimeline
		
	}
		
	
}

module.exports = TwitterActions;
