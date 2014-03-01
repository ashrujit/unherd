var express = require('express');
var mongo = require("./lib/mongodb.js");
var passport = require("./lib/passport.js");
var twitter = require("./lib/twitter.js")();
var validate = require("./lib/validation.js");
var post = require("./lib/post.js");
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
app.get('/newui',validate.ensureAuthenticated, function(req, res){
  
  twitter.gettweets(req.user,10,function(err,data){
		res.render('newtheme/home', { user: req.user, tweets:JSON.parse(data) });
  });
  
});


app.get('/ranktweet',validate.ensureAuthenticated, function(req, res){
  
	mongo.find("Tweets",{"expire": {"$gte": new Date()},"userid":req.user.username},function(results,err) {
		
		//console.log(err,results.length);
		
		if(results.length == 0 || err) {
		
			mongo.find("Users",{"username":req.user.username},function(lastfetch,err) {
				
				lasttimeobj = lastfetch[0].lastfetch;
				
				twitter.gettweets(req.user,60,function(err,data){
					
					var tweets = JSON.parse(data);
					
					var joop = [];	
			  
					for(x in tweets) {
						  
						joop.push(JSON.stringify(tweets[x]));	 
						 
					}
					
					var expiryDateObj = new Date(new Date().getTime() + (2*60000));
					
					post_data = validate.HTMLEncode(JSON.stringify({"tweetJSON": joop}));
					
					post.post(post_data,function(chunk) {
						
						var ranks = JSON.parse(chunk);
						
						for(x in ranks.batchResult) {
							
							for(y in tweets) {
								
								if(ranks.batchResult[x].tid == tweets[y].id) {
									
									tweets[y].score = ranks.batchResult[x].score;
									tweets[y].expire = expiryDateObj;
									tweets[y].userid = req.user.username;
									//console.log(new Date(tweets[y].created_at).getTime(),lasttimeobj.getTime());							
									if(new Date(tweets[y].created_at).getTime()>lasttimeobj.getTime()) {
										tweets[y].isNew = true;	
									} else {
										tweets[y].isNew = false;
									}
									
									//add a date stamp for mongo queries
									
								}
								
							}
							
						}
						
						if(tweets instanceof Array) {
							tweets.sort(function(a,b) { return parseFloat(b.score) - parseFloat(a.score) } );
						}
						
						console.log("from API");
						res.json(tweets);
						
						mongo.FnDelete("Tweets",{"userid":req.user.username},function(err, docs){
							
							mongo.insert("Tweets",tweets,function(s){});
							mongo.FnUpdate("Users",{"username":req.user.username},{$set:{"lastfetch":new Date()}},{},function() {});
							
						});
						
						
						
						
					});
				
				});
			
			});
	
		} else {
			
			console.log("from DB");
			res.json(results);
			
		}	
	 
	}); 
	  
});

app.post('/ajaxRetweet', validate.ensureAuthenticated, function(req, res){
	
	if(req.body.stat == "false") {
		
		twitter.doretweet(req.user,req.body.tid,function(err,data){
			
			//console.log("RT",err,data);
			
			if(err)
				res.json(err);
			else
				res.json({"status":true});
		});
	
	} else {
	
		twitter.dodeltweet(req.user,req.body.tid,function(err,data){
			
			console.log("DRT",err,data);
			
			if(err)
				res.json(err);
			else
				res.json({"status":true});
		});
		
	}
		
});

app.post('/ajaxFavourite', validate.ensureAuthenticated, function(req, res){

	if(req.body.stat == "false") {
		
		twitter.dofavourite(req.user,req.body.tid,function(err,data){
			//console.log("FV",err,data);
			if(err)
				res.json(err);
			else
				res.json({"status":true});
		});

	} else {
	
		twitter.dodelfavourite(req.user,req.body.tid,function(err,data){
			//console.log("DFV",err,data);
			if(err)
				res.json(err);
			else
				res.json({"status":true});
		});
		
	}
	
});

app.post('/ajaxTweet', validate.ensureAuthenticated, function(req, res){
		
	twitter.tweet(req.user,req.body.tweet,req.body.replyto,function(err,data){
		res.json({ "status": data,"error":err });
	});
		
});



app.all('/tweet', validate.ensureAuthenticated, function(req, res){
	
	if(req.method == 'POST') {
		
		twitter.tweet(req.user,req.body.tweet,"",function(){
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
