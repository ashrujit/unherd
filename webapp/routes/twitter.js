var oauth = require('oauth');

var config = {
	ConsumerKey:'nBxR4ADkukQIEHl5T5hA',
	ConsumerSecret:'eP31J3rNFmduhKPUN9SxNkUsNq2nAI2P6Pywkgcc3h8',
	RequestTokenURL:"https://api.twitter.com/oauth/request_token",
	AccessTokenURL:"https://api.twitter.com/oauth/access_token",
	CallBackURL:"http://127.0.0.1:8080/sessions/twitterCallback",
	UserCredentials:"https://api.twitter.com/1.1/account/verify_credentials.json"
};

function consumer() {
  return new oauth.OAuth(
    config.RequestTokenURL,
    config.AccessTokenURL, 
    config.ConsumerKey,
    config.ConsumerSecret,
    "1.0A",
    config.CallBackURL,
    "HMAC-SHA1");   
}

module.exports.getRequestToken = function(cb) {
	
	consumer().getOAuthRequestToken(cb);

}

module.exports.getOAuthAccessToken = function(req,cb) {	
	
	consumer().getOAuthAccessToken(req.session.oauthRequestToken, 
								req.session.oauthRequestTokenSecret, 
								req.query.oauth_verifier, 
								function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
		
		if (error) {
			
		  cb(error,null,null);
	
		} else {
		
		  req.session.oauthAccessToken = oauthAccessToken;
		  req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;
		  
		  consumer().get(
			config.UserCredentials, 
			req.session.oauthAccessToken, 
			req.session.oauthAccessTokenSecret,
			cb		  
		  );
		    
	   }
	   
	});

};
