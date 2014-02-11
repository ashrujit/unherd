var express = require('express');
var mongo = require("./lib/mongodb.js");
var passport = require("./lib/passport.js");
var twitter = require("./lib/twitter.js")();
var validate = require("./lib/validation.js");
var config = require("./config.json");
var app = express();


app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/test',validate.ensureAuthenticated, function(req, res){
  
  twitter.gettweets(req.user,10,function(err,data){
		res.render('new', { user: req.user, tweets:JSON.parse(data) });
  });
  
});

app.get('/ranktweet'/*,validate.ensureAuthenticated*/, function(req, res){
  
		
	  var post_data = JSON.stringify({ 'tweetJSON': {"contributors": null, "truncated": false, "text": "State of the Union: Obama lays out go-it-alone approach  | via @timesofindia http://t.co/HVyIgjGaP0", "in_reply_to_status_id": null, "id": 428417309208621060, "favorite_count": 0, "source": "<a href=\"http://tweetadder.com\" rel=\"nofollow\">TweetAdder v4</a>", "retweeted": false, "coordinates": null, "entities": {"symbols": [], "user_mentions": [{"id": 134758540, "indices": [63, 76], "id_str": "134758540", "screen_name": "timesofindia", "name": "Times of India"}], "hashtags": [], "urls": [{"url": "http://t.co/HVyIgjGaP0", "indices": [77, 99], "expanded_url": "http://bit.ly/L7VDiK", "display_url": "bit.ly/L7VDiK"}]}, "in_reply_to_screen_name": null, "id_str": "428417309208621056", "retweet_count": 1, "in_reply_to_user_id": null, "favorited": false, "user": {"follow_request_sent": false, "profile_use_background_image": true, "default_profile_image": false, "id": 52378823, "profile_background_image_url_https": "https://si0.twimg.com/profile_background_images/378800000010769792/50fe6cd18d9a6373b53f239c9537482c.jpeg", "verified": false, "profile_text_color": "4BB7DF", "profile_image_url_https": "https://pbs.twimg.com/profile_images/422593984876134401/ZB_CRw4O_normal.jpeg", "profile_sidebar_fill_color": "191F22", "entities": {"url": {"urls": [{"url": "http://t.co/Ouuuagq05j", "indices": [0, 22], "expanded_url": "http://dreamingcherries.com/", "display_url": "dreamingcherries.com"}]}, "description": {"urls": []}}, "followers_count": 144694, "profile_sidebar_border_color": "FFFFFF", "id_str": "52378823", "profile_background_color": "59BEE4", "listed_count": 1947, "is_translation_enabled": false, "utc_offset": 19800, "statuses_count": 71602, "description": "Dreamer,Digital, Public Relations,NewsJunkie,Blogger, X-Techie, Wikimedian,Compulsive Retweeter, Opinionated, Aam Aadmi ( Not AAP) on social media.", "friends_count": 94853, "location": "Bangalore, India ", "profile_link_color": "1325ED", "profile_image_url": "http://pbs.twimg.com/profile_images/422593984876134401/ZB_CRw4O_normal.jpeg", "following": true, "geo_enabled": false, "profile_banner_url": "https://pbs.twimg.com/profile_banners/52378823/1366091119", "profile_background_image_url": "http://a0.twimg.com/profile_background_images/378800000010769792/50fe6cd18d9a6373b53f239c9537482c.jpeg", "screen_name": "tinucherian", "lang": "en", "profile_background_tile": false, "favourites_count": 8443, "name": "Tinu Cherian Abraham", "notifications": false, "url": "http://t.co/Ouuuagq05j", "created_at": "Tue Jun 30 12:17:39 +0000 2009", "contributors_enabled": false, "time_zone": "Chennai", "protected": false, "default_profile": false, "is_translator": false}, "geo": null, "in_reply_to_user_id_str": null, "possibly_sensitive": false, "lang": "en", "created_at": "Wed Jan 29 06:40:20 +0000 2014", "in_reply_to_status_id_str": null, "place": null} } );
	  
	  var post_options = {
		  host: '127.0.0.1',
		  port: 5000,
		  path: '/unherd/api/v0.1/tweet',
		  method: 'POST',
		  headers: {
			  'Content-Type': 'application/json',
			  'Content-Length': post_data.length
		  }
	  };
	  
	  var post_req = http.request(post_options, function(res) {
		  res.setEncoding('utf8');
		  res.on('data', function (chunk) {
			  console.log('Response: ' + chunk);
		  });
	  });

	  // post the data
	  post_req.write(post_data);
	  post_req.end();
	  
});


app.all('/tweet', validate.ensureAuthenticated, function(req, res){
	
	if(req.method == 'POST') {
		
		twitter.tweet(req.user,req.body.tweet,function(){
			res.render('maketweet', { user: req.user, done:true });
		});
		
	} else {
		res.render('maketweet', { user: req.user, done:false });
	}
	
	
	
	
});

app.all('/DM', validate.ensureAuthenticated, function(req, res){
	
	if(req.method == 'POST') {
		
		twitter.directmessage(req.user,req.body.to,req.body.dm,function(){
			res.render('makedm', { user: req.user, done:true });
		});

	} else {
		res.render('makedm', { user: req.user, done:false });
	}
	
});

app.get('/getTweets', validate.ensureAuthenticated, function(req, res){
	twitter.gettweets(req.user,10,function(err,data){
		res.render('tweetlist', { user: req.user, tweets:JSON.parse(data) });
	});
});

app.post('/doReTweet', validate.ensureAuthenticated, function(req, res){
	twitter.doretweet(req.user,req.body.tid,function(err,data){
		res.json(data);
	});
});

app.get('/json/getTweets', validate.ensureAuthenticated, function(req, res){
	twitter.gettweets(req.user,10,function(err,data){
		res.json(JSON.parse(data));
	});
});

app.get('/timeline/:id', validate.ensureAuthenticated, function(req, res){
	twitter.timeline(req.user,req.params.id,function(err,data){
		res.render('tweetlist', { user: req.user, tweets:JSON.parse(data) });
	});
});

app.get('/json/timeline/:id', validate.ensureAuthenticated, function(req, res){
	twitter.timeline(req.user,req.params.id,function(err,data){
		res.json(JSON.parse(data));
	});
});

app.get('/account', validate.ensureAuthenticated, function(req, res){ 
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

app.get('/auth/twitter',
  passport.authenticate('twitter'),
  function(req, res){
});

app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip = process.env.OPENSHIFT_NODEJS_IP||"127.0.0.1";

app.listen(port,ip);
