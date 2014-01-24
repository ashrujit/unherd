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

app.get('/timeline/:id', validate.ensureAuthenticated, function(req, res){
	twitter.timeline(req.user,req.params.id,function(err,data){
		res.render('tweetlist', { user: req.user, tweets:JSON.parse(data) });
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

app.listen(config.port);
