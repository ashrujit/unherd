var express = require('express');
var mongo = require("./lib/mongodb.js");
var passport = require("./lib/passport.js");
var twitter = require("./lib/twitter.js")();
var validate = require("./lib/validation.js");
var post = require("./lib/post.js");
var config = require("./config.json");
var api = require('./api.js');
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

app.get('/foundation',validate.ensureAuthenticated, function(req, res){
  res.render('foundation/index',{user: req.user});
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
  
	mongo.findAndSort("Tweets",{"expire": {"$gte": new Date()},"userid":req.user.username},{"score":-1},function(results,err) {
		
		//console.log(err,results.length);
		
		if(results.length == 0 || err) {
		
			mongo.find("Users",{"username":req.user.username},function(lastfetch,err) {
				
				lasttimeobj = lastfetch[0].lastfetch;
				if (typeof(lasttimeobj) == "undefined" || lasttimeobj == null) {
                   lasttimeobj = new Date(new Date().getTime() - 3600000) ;
				}
				
				twitter.gettweets(req.user,config.tweet_fetch_count,function(err,data){
					
					var tweets = JSON.parse(data);
				//console.log(tweets);
					
					var joop = [];	
			  
					for(x in tweets) {
						  
						joop.push(JSON.stringify(tweets[x]));	 
						 
					}
					
					var expiryDateObj = new Date(new Date().getTime() + (config.tweet_fetch_gap*60000));
					
					post_data = validate.HTMLEncode(JSON.stringify({"tweetJSON": joop}));
					
					post.post(post_data,function(chunk) {
						
						var ranks = JSON.parse(chunk);
						
						for(x in ranks.batchResult) {
							
							for(y in tweets) {
								
								if(ranks.batchResult[x].tid == tweets[y].id) {
									
									tweets[y].score = parseFloat(ranks.batchResult[x].score);
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
			mongo.FnUpdate("Tweets",{"id_str":req.body.tid},{$set:{"retweeted":true},$inc:{"retweet_count":1}},{},function() {
				
				if(err)
				res.json(err);
				else
				res.json({"status":true});
				
			});
			
		});
	
	} else {
	
		twitter.dodeltweet(req.user,req.body.tid,function(err,data){
			
			console.log("DRT",err,data);
			mongo.FnUpdate("Tweets",{"id_str":req.body.tid},{$set:{"retweeted":false},$inc:{"retweet_count":-1}},{},function() {
				
				if(err)
				res.json(err);
				else
				res.json({"status":true});
				
			});
			
		});
		
	}
		
});

app.post('/ajaxFavourite', validate.ensureAuthenticated, function(req, res){

	if(req.body.stat == "false") {
		
		twitter.dofavourite(req.user,req.body.tid,function(err,data){
			//console.log("FV",err,data);
			mongo.FnUpdate("Tweets",{"id_str":req.body.tid},{$set:{"favorited":true},$inc:{"favorite_count":1}},{},function() {
				
				if(err)
				res.json(err);
				else
				res.json({"status":true});
				
			});
			
		});

	} else {
	
		twitter.dodelfavourite(req.user,req.body.tid,function(err,data){
			//console.log("DFV",err,data);
			mongo.FnUpdate("Tweets",{"id_str":req.body.tid},{$set:{"favorited":false}},{},function() {
				
				if(err)
				res.json(err);
				else
				res.json({"status":true});
				
			});
			
		});
		
	}
	
});

app.post('/ajaxTweet', validate.ensureAuthenticated, function(req, res){
		
	twitter.tweet(req.user,req.body.tweet,req.body.replyto,function(err,data){
		res.json({ "status": data,"error":err });
	});
		
});


app.post('/ajaxRecommend', validate.ensureAuthenticated, function(req, res){
		
	mongo.FnFindOne("Tweets",{"id_str":req.body.tweet_id},function(err,data){

		mongo.FnFindOne("Users",{"username":req.body.forward_to},function(err1,data1){
				
			if(data1) {
				
				var topic_id = req.user.username+"_"+req.body.tweet_id+"_"+data1.username+"_tweet";	
				var status_msg = {};	
				status_msg[req.user.username] = true;			
				status_msg[data1.username] = false;			
				var insertdoc = {
					"from_id":req.user.username,
					"from":req.user,
					"to":data1,
					"to_id":data1.username,
					"custom_msg":req.body.custom_msg,
					"tweetid":req.body.tweet_id,
					"tweet":data,
					"at":new Date(),
					"topic_id":topic_id,
					"checked":status_msg,
					"message_count":0,
					"rec_type":"tweet"
				};
				mongo.insert("Forwards",insertdoc,function(err2,data2){
					
					res.json({ "status": data,"error":err });
				
				});			

			} else {

				var dmmsg = "You have a tweet recommendation on unherd.Check the tweet here. https://twitter.com/sample/status/"+req.body.tweet_id;
				twitter.directmessage(req.user,req.body.forward_to,dmmsg,function(){
						
					res.json({ "status":"OK","error":null });
				
				});
	
			}

		});		

	});
		
});




app.get('/getRecommendations', validate.ensureAuthenticated, function(req, res){
	
	mongo.find("Forwards",{"$or":[{"from_id":req.user.username},{"to_id":req.user.username}]},function(data,err){ 
		
		res.render('recommendlist', { user: req.user, rec:data });
	
	});

});

app.get('/ajax/getRecommendations', validate.ensureAuthenticated, function(req, res){
	
	var checker = {};  checker["checked."+req.user.username] = false;
	mongo.find("Forwards",{$and:[{$or:[{from_id:req.user.username},{to_id:req.user.username}]},checker]},function(d,e) {
		
		if(typeof(d.length) == "undefined")
		d.length = 0;
		
		mongo.find("Forwards",{"$or":[{"from_id":req.user.username},{"to_id":req.user.username}]},function(data,err){ 
			
			res.json({data:data,num:d.length});
		
		});	
		
	});
	
});


app.all('/readRecommendations/:id', validate.ensureAuthenticated, function(req, res){
	
	if(req.method == 'POST') {
		
		var insertdoc = {
			"topic_id":req.params.id,
			"from_id":req.user.username,
			"message":req.body.message,
			"at":new Date()
		};

		mongo.insert("ForwardReplies",insertdoc,function(){
			
			var tmp_obj = {}; 
			tmp_obj["checked."+req.body.msg_to] = false;
			tmp_obj["checked."+req.user.username] = true;
			
			
			mongo.FnUpdate("Forwards"
				,{"topic_id":req.body.topic_id}
				,{"$inc":{"message_count":1},"$set":tmp_obj}
				,{}
				,function(d,e){
				
				mongo.find("Forwards",{"topic_id":req.params.id},function(data,err){ 
				
					mongo.find("ForwardReplies",{"topic_id":req.params.id},function(data1,err1){ 
					
						res.render('recommenddetails', { user: req.user, recomend:data[0], msg:data1 });
							
					});
					
				});

			});	

		});
		
	} else {

		mongo.find("Forwards",{"topic_id":req.params.id},function(data,err){ 
		
			mongo.find("ForwardReplies",{"topic_id":req.params.id},function(data1,err1){ 
				
				var tmp_obj = {}; 
				tmp_obj["checked."+req.user.username] = true;
			
				
				mongo.FnUpdate("Forwards"
					,{"topic_id":req.params.id}
					,{"$set":tmp_obj}
					,{}
					,function(d,e){
					res.render('recommenddetails', { user: req.user, recomend:data[0], msg:data1 });
				});
			});
			
		});
	
	}
	
	
});

app.all('/ajax/readRecommendations/:id', validate.ensureAuthenticated, function(req, res){
	
	if(req.method == 'POST') {
		
		var insertdoc = {
			"topic_id":req.params.id,
			"from_id":req.user.username,
			"message":req.body.message,
			"at":new Date()
		};

		mongo.insert("ForwardReplies",insertdoc,function(){
			
			var tmp_obj = {}; 
			tmp_obj["checked."+req.body.msg_to] = false;
			tmp_obj["checked."+req.user.username] = true;
			
			
			mongo.FnUpdate("Forwards"
				,{"topic_id":req.body.topic_id}
				,{"$inc":{"message_count":1},"$set":tmp_obj}
				,{}
				,function(d,e){
				
				mongo.find("Forwards",{"topic_id":req.params.id},function(data,err){ 
				
					mongo.find("ForwardReplies",{"topic_id":req.params.id},function(data1,err1){ 
					
						res.json({ user: req.user,recomend:data[0], msg:data1 });
							
					});
					
				});

			});	

		});
		
	} else {

		mongo.find("Forwards",{"topic_id":req.params.id},function(data,err){ 
		
			mongo.find("ForwardReplies",{"topic_id":req.params.id},function(data1,err1){ 
				
				var tmp_obj = {}; 
				tmp_obj["checked."+req.user.username] = true;
							
				mongo.FnUpdate("Forwards"
					,{"topic_id":req.params.id}
					,{"$set":tmp_obj}
					,{}
					,function(d,e){
					res.json({ user: req.user,recomend:data[0], msg:data1 });
				});
			});
			
		});
	
	}
	
	
});



app.post('/ajaxMessageOnTopic', validate.ensureAuthenticated, function(req, res){

	var insertdoc = {
		"topic_id":req.body.topic_id,
		"from_id":req.user.username,
		"message":req.body.message,
		"at":new Date()
	};

	mongo.insert("ForwardReplies",insertdoc,function(){

		mongo.FnUpdate("Forwards",{"topic_id":req.body.topic_id},{"$set":{"checked":true},"$inc":{"message_count":1}},{},function(){
						
			res.json({ "status":"OK","error":null });

		});	

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

app.get('/json/profile', validate.ensureAuthenticated, function(req, res){
	twitter.timeline(req.user,req.user.username,function(err,data){
		var resp = JSON.parse(data);
		res.json(resp[0].user);
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
app.get('/api/followers',validate.ensureAuthenticated,api.followers);

var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip = process.env.OPENSHIFT_NODEJS_IP||"172.31.47.200";
var ip = process.env.OPENSHIFT_NODEJS_IP||"127.0.0.1";

app.listen(port,ip);
