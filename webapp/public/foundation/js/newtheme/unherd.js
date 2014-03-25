$(window).load(function() {
	if( $(window).width()>$(window).height() && $(window).width()>768  ){
	var newHeight = $(window).height();
	$('.fixHeight').css('min-height', newHeight);
   }
});

$(document).ready(function(){ 
	
	FnLoadTweets();
	$("#recommendBox").hide();	
	$("#normalBox").show();
	
	$("#TwBtn").click(function(){
		
		var tweet = $("#TweetText").val();
				
		$.post("/ajaxTweet", {"tweet":tweet,"replyto":""}, function( data ) {
			
			$("#TweetText").val("");
			$("#composer").removeClass('open').css({"left": "-99999px"});
			  
		});	
		
	});
	
	$("#REPLYBtn").click(function(){
		
		var tweet = $("#TweetText2").val();
		var replyto = $("#ReplyTo").val();
				
		$.post("/ajaxTweet", {"tweet":tweet,"replyto":replyto}, function( data ) {
			
			$("#TweetText2").val("");
			$("#reply").removeClass('open').css({"left": "-99999px"});
			  
		});	
		
	});
	
	$("#RcBtn").click(function(){
				
		var recommendto = $("#ForwardTo").val();
		var custommsg = $("#RecText").val();
		var tweet = $("#ForwTweet").val();		
		
		$.post("/ajaxRecommend", {"tweet_id":tweet,"forward_to": recommendto.substring(1),"custom_msg":custommsg}, function( data ) {
			
			$("#RecText").val("");
			$("#ForwardTo").val("");
			$("#ForwTweet").val("");
			$("#recommendBox").hide();	
			$("#normalBox").show();
			$("#reply").removeClass('open').css({"left": "-99999px"});
			  
		});	
		
	});


	
	$(".content_type").click(function() {

		var el = $(this).data("id");	
		$(".alltweets").hide();
		$("#mainSection"+el).show();			
		
	});
	
	
		
});


function FnLoadTweets() {
	
	$.get( "/ranktweet", function( tweets ) {
		
		var tophtml = "";
		var chatterhtml = "";
				
		/**percent calculation**/
		var max_score = 1;
		if(typeof(tweets)!="undefined" && typeof(tweets[0])!="undefined" ) {
			
			max_score =  parseFloat(tweets[0].score).toFixed(2);

		}		
		/**percent calculation**/
	

	  	for(i=0; i<tweets.length;i++) {
			
			var tweet = tweets[i];
			var tweetSection = "";
				
			var retweeted = "",favorited = "",statRT="false",statFV="false",RTtext="Retweet";
			if(tweet.favorited!=false) {
				favorited = " activeAction";
				statFV="true";
			}
			if(tweet.retweeted!=false) {
				retweeted = " activeAction";
				RTtext="Retweeted"
				statRT="true";
			}
		
			var tweet_class;			
			if(i<=tweets.length/2) {
				tweet_class="type-topstories";
			} else {
				tweet_class="type-chatter";
			}
			
			tweetSection += '<li class="large-24 small-24 no-Pg columns optimize tweetsclass '+tweet_class+'">';
			tweetSection += '<article class="tweetBox clearfix">';
			if(tweet.isNew == true) {
				tweetSection += '<div data-tooltip class="tip-top radius" title="New Tweet"><span class="newAlert"></span></div>';
			}
			
			if(typeof(tweet.retweeted_status)!="undefined") {
			
				tweetSection += '<span class="retweetStatus">Retweeted by <a target="_blank" href="https://twitter.com/'+tweet.user.screen_name+'">'+tweet.user.name+'</a></span>';
				tweetSection += '<div class="large-3 small-3 columns no-Pg"><img src="'+tweet.retweeted_status.user.profile_image_url_https+'" alt="'+tweet.retweeted_status.user.name+'" class="circular"> </div>';
				tweetSection += '<div class="large-16 small-16 columns"><h1><a target="_blank" href="https://twitter.com/'+tweet.retweeted_status.user.screen_name+'">'+tweet.retweeted_status.user.name+'</a> </h1><h2><a target="_blank" href="https://twitter.com/'+tweet.retweeted_status.user.screen_name+'">@'+tweet.retweeted_status.user.screen_name+' </a> <span>| '+FnTimeAgo(tweet.retweeted_status.created_at)+'</span></h2></div>';
					
			} else {
			
				tweetSection += '<div class="large-3 small-3 columns no-Pg"><img src="'+tweet.user.profile_image_url_https+'" alt="'+tweet.user.name+'" class="circular"> </div>';
				tweetSection += '<div class="large-16 small-16 columns"><h1><a target="_blank" href="https://twitter.com/'+tweet.user.screen_name+'">'+tweet.user.name+'</a> </h1><h2><a target="_blank" href="https://twitter.com/'+tweet.user.screen_name+'">@'+tweet.user.screen_name+' </a> <span>| '+FnTimeAgo(tweet.created_at)+'</span></h2></div>';
			
			}
			
			tweetSection += '<div class="large-5 small-5 columns"><div class="rankBox">';
			tweetSection += '<div class="'+decideRankColor(tweet.score)+'"><span  data-tooltip  class = "has-tip tip-top radius"  title = "Relevance score: '+parseFloat(tweet.score).toFixed(2)+'" >';

			
		    var percent = 	(parseFloat(tweet.score).toFixed(2))*100/max_score;			

			tweetSection += '<span class="meter" style="width: '+percent.toFixed(0)+'%"></span> </span>';
			tweetSection += '</div></div></div>';
			
			tweetSection += '<div class="large-24 small-24 columns no-Pg">';
			tweetSection += '<div class="content">';
			
			if(typeof(tweet.retweeted_status)!="undefined" && typeof(tweet.retweeted_status.entities)!="undefined" && typeof(tweet.retweeted_status.entities.media)!="undefined" && typeof(tweet.retweeted_status.entities.media[0])!="undefined" && typeof(tweet.retweeted_status.entities.media[0].media_url_https)!="undefined") {
				tweetSection += '<div class="large-24 columns media text-center"><a target="_blank" href="https://twitter.com/'+tweet.user.screen_name+'/status/'+tweet.id_str+'" title="Go to Tweet"><img src="'+tweet.retweeted_status.entities.media[0].media_url_https+'" alt="" /></a></div>';
				tweetSection += '<div class="large-24 columns">';
            } else if(typeof(tweet.entities)!="undefined" && typeof(tweet.entities.media)!="undefined" && typeof(tweet.entities.media[0])!="undefined" && typeof(tweet.entities.media[0].media_url_https)!="undefined") {
				tweetSection += '<div class="large-24 columns media text-center"><a target="_blank" href="https://twitter.com/'+tweet.user.screen_name+'/status/'+tweet.id_str+'" title="Go to Tweet"><img src="'+tweet.entities.media[0].media_url_https+'" alt="" /></a></div>';
				tweetSection += '<div class="large-24 columns">';
            }
            
            var RT={};
            if(typeof(tweet.retweeted_status)!="undefined") {
				
				RT.stuff = tweet.retweeted_status.text;
				RT.user = tweet.retweeted_status.user.screen_name;
				var retweet = tweet.retweeted_status;
				retweet.text = linkify_entities(retweet);
				tweetSection += '<p>'+retweet.text+'</p>';
			
			} else {	
				
				RT.stuff = tweet.text;	
				RT.user = tweet.user.screen_name;	
				tweet.text = linkify_entities(tweet);
				tweetSection += '<p>'+tweet.text+'</p>';

			}
			
            if(typeof(tweet.entities)!="undefined" && typeof(tweet.entities.media)!="undefined" && typeof(tweet.entities.media[0])!="undefined" && typeof(tweet.entities.media[0].media_url_https)!="undefined") {
				tweetSection += '</div>';
            }
            if(typeof(tweet.retweeted_status)!="undefined" && typeof(tweet.retweeted_status.entities)!="undefined" && typeof(tweet.retweeted_status.entities.media)!="undefined" && typeof(tweet.retweeted_status.entities.media[0])!="undefined" && typeof(tweet.retweeted_status.entities.media[0].media_url_https)!="undefined") {
			    tweetSection += '</div>';
            }
            tweetSection += '</div></div>';
                        
            tweetSection += '<div class="large-24 columns"><div class="tweetAction"><ul class="inline-list right no-Mn-Bm hoverEffect">';
			tweetSection += '<li><a onclick=\'mixpanel.track("Retweet");\' data-user="'+RT.user+'" data-tweet="'+RT.stuff+'" data-dropdown="reply" data-tid="'+tweet.id_str+'" data-stat="'+statRT+'" class="BtnRT'+retweeted+'" href="javascript: void(0)" title="Retweet"><i class="fa fa-retweet"></i> '+tweet.retweet_count+'</a></li>';
			tweetSection += '<li><a onclick=\'mixpanel.track("Favorite");\' data-tid="'+tweet.id_str+'" data-stat="'+statFV+'" class="BtnFv'+favorited+'" href="javascript: void(0)" title="Favourite"><i class="fa fa-star"></i> '+tweet.favorite_count+'</a></li>';
			tweetSection += '<li><a onclick=\'mixpanel.track("Reply");\' class="BtnRP marginTop" data-dropdown="reply" data-tid="'+tweet.id_str+'" data-user="'+tweet.user.screen_name+'" href="javascript: void(0)" title="Reply"><i class="fa fa-reply"></i> </a></li>';
			tweetSection += '<li><a onclick=\'mixpanel.track("Forward");\' class="BtnFW marginTop" data-dropdown="reply" data-tid="'+tweet.id_str+'" data-user="'+tweet.user.screen_name+'" href="javascript: void(0)" title="Forward"><i class="fa fa-mail-forward"></i> </a></li>';
			tweetSection += '<li><a onclick=\'mixpanel.track("Link_out");\' target="_blank" class="marginTop" href="https://twitter.com/'+tweet.user.screen_name+'/status/'+tweet.id_str+'" title="Go to Tweet"><i class="fa fa-link"></i> </a></li>';
			tweetSection += '</ul></div></div></article></li>';
							
			if(i<=tweets.length/2) {
				tophtml += tweetSection;
			} else {
				chatterhtml += tweetSection;
			}
		
		}
		
		
		
		$("#mainSection").html(tophtml);
		$("#mainSection2").html(chatterhtml);
		FnDoMasonry("#mainSection",".type-topstories");
		FnDoMasonry("#mainSection2",".type-chatter");
		FnUpdateMyProfile();
		FnUpdateRecommendations();		
		/*$(".BtnRT").on("click", function() {
		  
		  var tid = $( this ).data("tid");
		  var stat = $( this ).data("stat");
		  console.log("RT",stat,tid);
		  var el = $( this );
		  if(stat!="true") {
			  $.post( "/ajaxRetweet", {"tid":tid,"stat":stat}, function( tweets ) {
				
				el.addClass("activeAction");
				el.data("stat","true");
				//FnLoadTweets();
				  
			  });
		  }			
			
		});*/

		$(".BtnFv").on("click", function() {
		  
		  var tid = $( this ).data("tid");
		  var stat = $( this ).data("stat");
		  console.log("FV",tid);
		  var el = $( this );
		  $.post( "/ajaxFavourite", {"tid":tid,"stat":stat}, function( tweets ) {
			
			if(stat!="true") {
				el.addClass("activeAction");
				el.data("stat","true");
			} else {
				el.removeClass("activeAction");
				el.data("stat","false");	
			}
			//FnLoadTweets();
			  
		  });

		});

		$(".BtnRT").on("click", function() {
		  
		  $("#REPLYBtn").val("Retweet");
		  $("#recommendBox").hide();	
		  $("#normalBox").show();
		  $("#TweetText2").val("");
		  $("#ReplyTo").val("");
		  var tid = $( this ).data("tid");
		  var user = $( this ).data("user");
		  var tweet = $( this ).data("tweet");
		  $("#TweetText2").val("RT:@"+user+" "+tweet).keyup();		  	  

		});

		$(".BtnRP").on("click", function() {
		  
		  $("#REPLYBtn").val("Reply");
		  $("#recommendBox").hide();	
		  $("#normalBox").show();
		  $("#TweetText2").val("");
		  $("#ReplyTo").val("");
		  var tid = $( this ).data("tid");
		  var user = $( this ).data("user");
		  $("#TweetText2").val("@"+user).keyup();
		  $("#ReplyTo").val(tid);		  	  

		});
	
		$(".BtnFW").on("click", function() {
		  
		  $("#normalBox").hide(); 
		  var tid = $( this ).data("tid");
		  $("#ForwTweet").val(tid);
		  $("#RecText").val("").keyup();
		  $("#recommendBox").show();
		  

		});
		
			
		
	});
	
	
	
}

function FnUpdateMyProfile() {
	
	$.get( "/json/profile", function( user ) {
		
		$("#my_status_count").text(user.statuses_count);
		$("#my_friends_count").text(user.friends_count);
		$("#my_followers_count").text(user.followers_count);
		
		
	});
	
}

function FnLoadMessage(topic_id) {
	
	$("#recList").hide();
	$("#recDetail").html("").show();
		
	$.get( "/ajax/readRecommendations/"+topic_id, function( data ) {
		console.log(data);
		var recomend = data.recomend;
		var html = '';
		html += '<div class="large-2 small-2 columns no-Pg">';
		html += '<img src="'+recomend.from.profile_pic+'" alt="'+recomend.from_id+'" class="radius round"></div>';
		html += '<div class="large-22 small-22 columns">';
		html += '<h1><a href="https://twitter.com/'+recomend.from_id+'">'+recomend.from.displayName+'</a> </h1>';
		html += '<h2><a href="">@'+recomend.from_id+'</a> '+FnTimeAgo(recomend.at)+'<span></span></h2>';
		html += '</div>';
		html += '<div class="large-24 small-24 columns no-Pg">';
		html += '<div class="content"><p>'+recomend.custom_msg+' : <a href="https://twitter.com/go/status/'+recomend.tweet.id_str+'">https://twitter.com/go/status/'+recomend.tweet.id_str+'</a></p></div></div><div class="clearfix"></div>';
		
		var user_detail = {};
		user_detail[recomend.from_id] = recomend.from;
		user_detail[recomend.to_id] = recomend.to;
		
		var msg = data.msg;
		
		for(x in msg) {
			
			html += '<blockquote><article class="tweetBox clearfix no-Br"><div class="large-1 small-1 columns no-Pg">';
			html += '<img src="'+user_detail[msg[x].from_id].profile_pic+'" alt="'+msg[x].from_id+'" class="radius">';
			html += '</div><div class="large-23 small-23 columns"><h1 class="left"><a href="https://twitter.com/'+msg[x].from_id+'">'+user_detail[msg[x].from_id].displayName+'</a> </h1><h2 class="left"><a href="">&nbsp; | @'+msg[x].from_id+' </a> <span>| '+FnTimeAgo(msg[x].at)+'</span></h2></div>';
			html += '<div class="large-24 small-24 columns no-Pg"><div class="content "><p>'+msg[x].message+'</p></div></div></article></blockquote>';
						
		}
		var to = recomend.to_id;
		if(data.user.username != recomend.from_id) {
			to = recomend.from_id;
		}
		html += '<form><div class="row"><label><textarea id="MyChatMsg" placeholder="Reply" rows="2" class="radius messageBox"></textarea></label>';
		html += '<input id="SendChatMsg" type="button" class="button tiny radius no-Mn right" value="Reply"></div></form>';
		
		$("#recDetail").html(html);
		
		$("#SendChatMsg").on("click", function() {
		  
		  $.post( "/ajax/readRecommendations/"+topic_id
			,{
				message:$("#MyChatMsg").val()
				,topic_id:topic_id
				,msg_to:to
			}
			, function( data ) {
			  
			  FnLoadMessage(topic_id);
			  
		  });
		 

		});
		
		
						
	});
		
}

function FnLoadAllMessage() {
	
	$("#recList").show();
	$("#recDetail").html("").hide();
	
}

function FnUpdateRecommendations() {
	
	$.get( "/ajax/getRecommendations", function( msgs ) {
		
		$(".notify").hide();
		var html = "";
		var popuphtml = "";
		
		var num = 0;		
		var user = msgs.user;
		msgs = msgs.data;
		for(x in msgs) { 			
			var me = user.username;
			
			if(msgs[x]["checked"][me] == false) {
				
				html += "<li><a href='#' onclick=\"FnLoadMessage('"+msgs[x].topic_id+"')\" data-reveal-id='msgModal' data-reveal='data-reveal'><div class='large-24 columns no-Pg '>";
				html += '<div class="large-4 columns no-Pg"><img src="'+msgs[x].from.profile_pic+'" alt="'+msgs[x].from.displayName+'" class="circular"></div>';	
				html += '<div class="large-20 columns"><p class="no-Mn">'+msgs[x].from.displayName+'</p></div>';	
				html += '</div><div class="clearfix"></div>';			
				html += "</a></li><li class=''></li>";
				num++;
				
			}
			
			popuphtml += '<a href="#" class="messageLink" onclick=\'FnLoadMessage("'+msgs[x].topic_id+'")\'></a>';
			popuphtml += '<div class="large-1 small-1 columns no-Pg"><img src="'+msgs[x].from.profile_pic+'" alt="'+msgs[x].from.displayName+'" class="circular"> </div>';
			popuphtml += '<div class="large-23 small-23 columns"><h1 class="left"><a href="">'+msgs[x].from.displayName+' </a></h1><h2 class="left"><a href="">&nbsp; | @'+msgs[x].from_id+' </a><span>| '+FnTimeAgo(msgs[x].at)+'</span></h2></div>';
			popuphtml += '<div class="large-24 small-24 columns no-Pg"><div class="content ">';
			popuphtml += '<p>'+msgs[x].custom_msg+' : <a href="https://twitter.com/go/status/'+msgs[x].tweet.id_str+'">https://twitter.com/go/status/'+msgs[x].tweet.id_str+'</a></p>';
			popuphtml += '</div></div><div class="clearfix"></div>';
		}
		html += '<li class="text-center"><a href="" onclick=\"FnLoadAllMessage()\" data-reveal-id="msgModal" data-reveal><small>View all messages</small></a></li>';
		
		if(num>0){
			$(".notify").text(num).show(200);
		}
		
		$("#message").html(html);
		$("#recList").html(popuphtml);
				
		
	});
	
}

function FnTimeAgo(time){
	
	var units = [
	{ name: "s", limit: 60, in_seconds: 1 },
	{ name: "m", limit: 3600, in_seconds: 60 },
	{ name: "h", limit: 86400, in_seconds: 3600  },
	{ name: "year", limit: null, in_seconds: 31556926 }
	];
	var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
	var olddate = new Date(time);
	var diff = (new Date() - olddate) / 1000;
	if (diff < 5) return "now";

	var i = 0;
	while (unit = units[i++]) {
		if (diff < unit.limit || !unit.limit){
			if(!unit.limit) {
				return monthNames[olddate.getMonth()]+" "+olddate.getDate();
			} else {
				var diff =  Math.floor(diff / unit.in_seconds);
				return diff + "" + unit.name + (diff>1 ? "" : "");
			}
		}
	};
}

var followers = new Bloodhound({
	datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.name); },
	queryTokenizer: Bloodhound.tokenizers.whitespace,
	limit: 10,
	prefetch: {
		url: '/api/followers',
		filter: function(list) {
			return $.map(list, function(follower) { return { name: '@'+follower }; });
		}
	}
});
followers.initialize();
$('.typeahead').typeahead(null, {
	name: 'followers',
	displayKey: 'name',
	source: followers.ttAdapter()
});


//Decide color based on the tweet score.
function decideRankColor(score){
	if(score > 15)
		return "progress sucess round";
	else if (score > 10)
		return "progress secondary round";
	else
		return "progress alert round";
};

//Remaining chars limit.
$(".LimitedTextField").keyup(function(e) {
	
	var len = $(this).val().length;
	var el = $(this).data("target");
	$('#'+el).text(140 - len);
	$('#'+el).css({"color":"#b3b3b3","font-weight":"normal"});
	if(len > 140){
		$('#'+el).css({"color":"#b30204","font-weight":"900"});		
	}	
	
});             


function FnDoMasonry(container,data){
	var $containter = $(container);
	//alert(1);
	$containter.imagesLoaded( function(){
		$containter.masonry({
		itemSelector: data,
		isAnimated: !Modernizr.csstransitions,
		isFitWidth: true
		});
		
		if(container=="#mainSection2") {
			$(".alltweets").hide();
			$("#mainSection").show();
		}
			
});
}
