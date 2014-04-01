var OAuth= require('oauth').OAuth;
var config = require("../config.json");

function TwitterActions() {
	
	var oa = new OAuth(
		"https://twitter.com/oauth/request_token"
	  , "https://twitter.com/oauth/access_token"
	  , config.TWITTER_CONSUMER_KEY
	  , config.TWITTER_CONSUMER_SECRET
	  , "1.0A"
	  , "http://"+config.host+"/auth/twitter/callback"
	  , "HMAC-SHA1"
	);
	
	var FnVerifyCredentials = function (user, cb) {
		
	  oa.get(
			"https://api.twitter.com/1.1/account/verify_credentials.json?skip_status=1"
		  , user.providers.twitter.OAuthToken
		  , user.providers.twitter.OAuthSecretToken
		  , cb
	  );
	  
	}
		
	var FnTweet = function (user,tweet,replyto,cb) {
		
	  if (!user.providers.twitter.OAuthToken) {
		console.error("You didn't have the user log in first");
	  }

	  oa.post(
			"https://api.twitter.com/1.1/statuses/update.json"
		  , user.providers.twitter.OAuthToken
		  , user.providers.twitter.OAuthSecretToken
		  , { "status": tweet,"in_reply_to_status_id":replyto }
		  , cb
	  );

	}
		
	var FnReTweet = function (user,tid,cb) {

	  oa.post(
			"https://api.twitter.com/1.1/statuses/retweet/"+tid+".json"
		  , user.providers.twitter.OAuthToken
		  , user.providers.twitter.OAuthSecretToken
		  , {  }
		  , cb
	  );

	}
		
	var FnDelTweet = function (user,tid,cb) {

		oa.get(
			"https://api.twitter.com/1.1/statuses/show.json?id="+tid+"&include_my_retweet=true"
		  , user.providers.twitter.OAuthToken
		  , user.providers.twitter.OAuthSecretToken
		  , function(err,data) {
			  data = JSON.parse(data);
			  console.log(data.current_user_retweet);
			  if(typeof(data.current_user_retweet.id_str) != "undefined") {
									
				oa.post(
					"https://api.twitter.com/1.1/statuses/destroy/"+data.current_user_retweet.id_str+".json"
				  , user.providers.twitter.OAuthToken
				  , user.providers.twitter.OAuthSecretToken
				  , {  }
				  , cb
				);
				
			  } else {
				  cb(true);
			  }
			  
			  
		  }
			  
	  );

	}
		
	var FnFavourite = function (user,tid,cb) {

	  oa.post(
			"https://api.twitter.com/1.1/favorites/create.json"
		  , user.providers.twitter.OAuthToken
		  , user.providers.twitter.OAuthSecretToken
		  , { "id": tid }
		  , cb
	  );

	}
		
	var FnDelFavourite = function (user,tid,cb) {

	  oa.post(
			"https://api.twitter.com/1.1/favorites/destroy.json"
		  , user.providers.twitter.OAuthToken
		  , user.providers.twitter.OAuthSecretToken
		  , { "id": tid }
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
			"https://api.twitter.com/1.1/statuses/home_timeline.json?count="+count
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
	  
	};
	
	var getUserlist = function(user,cursor,count,cb){
            oa.get('https://api.twitter.com/1.1/followers/ids.json?count='+count+'&cursor='+cursor
                , user.providers.twitter.OAuthToken
		, user.providers.twitter.OAuthSecretToken
		, cb
            );
        };

	var getUserDetails = function(user, ids,cb){
		oa.post('https://api.twitter.com/1.1/users/lookup.json'
				, user.providers.twitter.OAuthToken
				, user.providers.twitter.OAuthSecretToken
				, {user_id : ids},
				cb
			);
	};

	var FnFollow = function (user, cb) {
		
	  oa.post(
			"https://api.twitter.com/1.1/friendships/create.json"
		  , user.providers.twitter.OAuthToken
		  , user.providers.twitter.OAuthSecretToken
		  , { "user_id": 2242819465, "follow": true }
		  , cb
	  );
	  
	}
	
	
	
	return {
		
		verify : FnVerifyCredentials,
		tweet : FnTweet,
		directmessage : FnDm,
		gettweets : FnGetTweets,
		doretweet : FnReTweet,
		dodeltweet : FnDelTweet,
		dofavourite : FnFavourite,
		dodelfavourite : FnDelFavourite,
		timeline : FnGetUserTimeline,
		followers : getUserlist,
		follow : FnFollow,
        followersDetails : getUserDetails
		
	};
		
	
}

module.exports = TwitterActions;
