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
		
		$.post("/ajaxRecommend", {"tweet_id":tweet,"forward_to": recommendto,"custom_msg":custommsg}, function( data ) {
			
			$("#RecText").val("");
			$("#ForwardTo").val("");
			$("#ForwTweet").val("");
			$("#recommendBox").hide();	
			$("#normalBox").show();
			  
		});	
		
	});


	
	$(".content_type").click(function() {

		var el = $(this).data("id");	
		$(".tweetsclass").hide();
		$(".type-"+el).show();			
		
	});
	
	
		
});


function FnLoadTweets() {
	
	$.get( "/ranktweet", function( tweets ) {
		
		var tophtml = "";
		var chatterhtml = "";
		var tweetSection = "";
		
		/**percent calculation**/
		var max_score = 1;
		if(typeof(tweets)!="undefined" && typeof(tweets[0])!="undefined" ) {
			
			max_score =  parseFloat(tweets[0].score).toFixed(2);

		}		
		/**percent calculation**/
	

	  	for(i=0; i<tweets.length;i++) {
			
			var tweet = tweets[i];
				
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
		
			tweet_class="topnews";
			
			if(i<=tweets.length/2) {
				tweet_class="type-topstories";
			} else {
				tweet_class="type-chatter";
			}
			
			tweetSection += '<li class="large-24 small-24 no-Pg columns optimize tweetsclass '+tweet_class+'">';
			tweetSection += '<article class="tweetBox clearfix">';
			if(tweet.isNew == true) {
				tweetSection += '<span class="newAlert"></span>';
			}
			
			if(typeof(tweet.retweeted_status)!="undefined") {
			
				tweetSection += '<div class="large-24 columns"><h2>Retweeted by <a target="_blank" href="https://twitter.com/'+tweet.user.screen_name+'">'+tweet.user.name+'</a></h2></div>';
				tweetSection += '<div class="large-3 small-3 columns no-Pg"><img src="'+tweet.retweeted_status.user.profile_image_url_https+'" alt="'+tweet.retweeted_status.user.name+'" class="radius"> </div>';
				tweetSection += '<div class="large-16 small-16 columns"><h1><a target="_blank" href="https://twitter.com/'+tweet.retweeted_status.user.screen_name+'">'+tweet.retweeted_status.user.name+'</a> </h1><h2><a target="_blank" href="https://twitter.com/'+tweet.retweeted_status.user.screen_name+'">@'+tweet.retweeted_status.user.screen_name+' </a> <span>| '+FnTimeAgo(tweet.retweeted_status.created_at)+'</span></h2></div>';
					
			} else {
			
				tweetSection += '<div class="large-3 small-3 columns no-Pg"><img src="'+tweet.user.profile_image_url_https+'" alt="'+tweet.user.name+'" class="radius"> </div>';
				tweetSection += '<div class="large-16 small-16 columns"><h1><a target="_blank" href="https://twitter.com/'+tweet.user.screen_name+'">'+tweet.user.name+'</a> </h1><h2><a target="_blank" href="https://twitter.com/'+tweet.user.screen_name+'">@'+tweet.user.screen_name+' </a> <span>| '+FnTimeAgo(tweet.created_at)+'</span></h2></div>';
			
			}
			
			tweetSection += '<div class="large-5 small-5 columns"><div class="rankBox">';
			// tweetSection += '<div class="progress success round"><span  data-tooltip  class = "has-tip tip-top"  title = "'+parseFloat(tweet.score).toFixed(2)+'" >';
			tweetSection += '<div class="'+decideRankColor(tweet.score)+'"><span  data-tooltip  class = "has-tip tip-top"  title = "'+parseFloat(tweet.score).toFixed(2)+'" >';

			
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
            
            var RTstuff;
            if(typeof(tweet.retweeted_status)!="undefined") {
				
				RTstuff = tweet.retweeted_status.text;
				var retweet = tweet.retweeted_status;
				retweet.text = linkify_entities(retweet);
				tweetSection += '<p>'+retweet.text+'</p>';
			
			} else {	
				
				RTstuff = tweet.text;	
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
			tweetSection += '<li><a data-user="'+tweet.user.screen_name+'" data-tweet="'+RTstuff+'" data-dropdown="reply" data-tid="'+tweet.id_str+'" data-stat="'+statRT+'" class="BtnRT'+retweeted+'" href="javascript: void(0)" title="Retweet"><i class="fa fa-retweet"></i> '+tweet.retweet_count+'</a></li>';
			tweetSection += '<li><a data-tid="'+tweet.id_str+'" data-stat="'+statFV+'" class="BtnFv'+favorited+'" href="javascript: void(0)" title="Favourite"><i class="fa fa-star"></i> '+tweet.favorite_count+'</a></li>';
			tweetSection += '<li><a class="BtnRP" data-dropdown="reply" data-tid="'+tweet.id_str+'" data-user="'+tweet.user.screen_name+'" href="javascript: void(0)" title="Reply"><i class="fa fa-reply"></i> </a></li>';
			tweetSection += '<li><a class="BtnFW" data-dropdown="reply" data-tid="'+tweet.id_str+'" data-user="'+tweet.user.screen_name+'" href="javascript: void(0)" title="Forward"><i class="fa fa-mail-forward"></i> </a></li>';
			tweetSection += '<li><a target="_blank" href="https://twitter.com/'+tweet.user.screen_name+'/status/'+tweet.id_str+'" title="Go to Tweet"><i class="fa fa-link"></i> </a></li>';
			tweetSection += '</ul></div></div></article></li>';
							
		}
		
		$("#mainSection").html(tweetSection);
		$(".type-chatter").hide();
		FnUpdateMyProfile();
		
	
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
		  
		  $("#recommendBox").hide();	
		  $("#normalBox").show();
		  $("#TweetText2").val("");
		  $("#ReplyTo").val("");
		  var tid = $( this ).data("tid");
		  var user = $( this ).data("user");
		  var tweet = $( this ).data("tweet");
		  $("#TweetText2").val("RT:@"+user+" "+tweet);		  	  

		});

		$(".BtnRP").on("click", function() {
		  
		  $("#recommendBox").hide();	
		  $("#normalBox").show();
		  $("#TweetText2").val("");
		  $("#ReplyTo").val("");
		  var tid = $( this ).data("tid");
		  var user = $( this ).data("user");
		  $("#TweetText2").val("@"+user);
		  $("#ReplyTo").val(tid);		  	  

		});
	
		$(".BtnFW").on("click", function() {
		  
		  $("#normalBox").hide(); 
		  var tid = $( this ).data("tid");
		  $("#ForwTweet").val(tid);
		  $("#recommendBox").show();
		 

		});
			
		
	});
	
	
	
}

function FnUpdateMyProfile() {
	
	$.get( "/json/profile", function( user ) {
		
		$("#my_status_count").text(user.statuses_count);
		$("#my_friends_count").text(user.friends_count);
		$("#my_followers_count").text(user.followers_count);
		
	});;
	
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
$("#TweetText").keyup(function(e) {
	// console.log($(this).val().length);	
	var len = $(this).val().length;
	if(len > 140){
		var subString = $(this).val().substring(0, 140);
		$(this).val(subString);		
	}
	else{
		$('#charCountId').text(140 - len);
	}	
	
});             