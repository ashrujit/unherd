var twitter = require("./twitter.js");

module.exports.index = function(req, res){
  res.render('layout.jade');
};

module.exports.twitterConnect = function(req, res){
  
  twitter.getRequestToken(function(error, oauthToken, oauthTokenSecret, results){
	  
	if (error) {
		  res.send("Error getting OAuth request token : " + sys.inspect(error), 500);
	} else {  
		  req.session.oauthRequestToken = oauthToken;
		  req.session.oauthRequestTokenSecret = oauthTokenSecret;
		  res.redirect("https://twitter.com/oauth/authorize?oauth_token="+req.session.oauthRequestToken);      
	}
	  
  });
  
};


module.exports.twitterCallback = function(req, res){
  
  twitter.getOAuthAccessToken(req,function (error, data, response) {
			if (error) {
			  console.log(error);
			} else {
			  console.dir(data);
			  data = JSON.parse(data);
			  req.session.twitterScreenName = data["screen_name"];    
			  res.send('You are signed in: ' + req.session.twitterScreenName)
			}  
  });
  
};
