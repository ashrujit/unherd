$(document).ready(function(){ 
	FnLoadTweets();
	//$("#recommendBox").hide();

	//$(".tweetCloudIcon").click(function(){
		////$(".tweetCloudIcon").css('margin-top','50px');
		//$("#recommendBox").hide();
		//$("#normalBox").show();
		//$("#TweetText").val("");
		//$("#ReplyTo").val("");
		//$("#tweetbox").slideToggle('fast');
		//$(this).toggleClass("cloudup");
		
	//});
	
	$("#TwBtn").click(function(){
		
		var tweet = $("#TweetText").val();
				
		$.post("/ajaxTweet", {"tweet":tweet,"replyto":""}, function( data ) {
			
			$("#TweetText").val("");
			$("#composer").removeClass('open').css({"top": "4px",
"left": "-99999px"});
			  
		});	
		
	});

	//$("#RcBtn").click(function(){
		
		//$("#recommendBox").hide();	
		//$("#normalBox").show();
		//var recommendto = $("#ForwardTo").val();
		//var custommsg = $("#RecText").val();
		//var tweet = $("#ForwTweet").val();
		
		
		//$.post("/ajaxRecommend", {"tweet_id":tweet,"forward_to": recommendto,"custom_msg":custommsg}, function( data ) {
			
			//console.log(data);
			//$("#RecText").val("");
			//$("#ForwardTo").val("");
			//$("#tweetbox").slideUp('fast');
			//$(".tweetCloudIcon").removeClass("cloudup");
			  
		//});	
		
	//});


	
	//$(".nav li").click(function() {
	
		//$(this).siblings("li").removeClass("active");
		//$(this).addClass("active");	
		//$(".stream-items").hide();
		//$("#data"+$(this).prop("id")).show();
		
	//});
	
	
		
});


function FnLoadTweets() {
	
	$.get( "/ranktweet", function( tweets ) {
		
		var tophtml = "";
		var chatterhtml = "";
		var tweetSection = "";
		
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
			
			tweet.text = linkify_entities(tweet);
			
			tweet_class="topnews";
			
			if(i<=tweets.length/2) {
				tweet_class="type-topnews";
			} else {
				tweet_class="type-chatter";
			}
			
			tweetSection += '<li class="large-24 small-24 no-Pg columns optimize '+tweet_class+'">';
			tweetSection += '<article class="tweetBox clearfix">';
			if(tweet.isNew == true) {
				tweetSection += '<span class="newAlert"></span>';
			}
			tweetSection += '<div class="large-3 small-3 columns no-Pg"><img src="'+tweet.user.profile_image_url_https+'" alt="'+tweet.user.name+'" class="radius"> </div>';
			tweetSection += '<div class="large-16 small-16 columns"><h1><a href="">'+tweet.user.name+'</a> </h1><h2><a href="">@'+tweet.user.screen_name+' </a> <span>| '+FnTimeAgo(tweet.created_at)+'</span></h2></div>';
			
			tweetSection += '<div class="large-5 small-5 columns"><div class="rankBox">';
			tweetSection += '<div class="progress success round"><span  data-tooltip  class = "has-tip tip-top"  title = "'+parseFloat(tweet.score).toFixed(2)+'" >';
			tweetSection += '<span class="meter" style="width: 70%"></span> </span>';
			tweetSection += '</div></div></div>';
			
			tweetSection += '<div class="large-24 small-24 columns no-Pg">';
			tweetSection += '<div class="content">';
			if(typeof(tweet.retweeted_status)!="undefined" && typeof(tweet.retweeted_status.entities)!="undefined" && typeof(tweet.retweeted_status.entities.media)!="undefined" && typeof(tweet.retweeted_status.entities.media[0])!="undefined" && typeof(tweet.retweeted_status.entities.media[0].media_url_https)!="undefined") {
				tweetSection += '<div class="large-24 columns media text-center"><img src="'+tweet.retweeted_status.entities.media[0].media_url_https+'" alt="" /></div>';
				tweetSection += '<div class="large-24 columns">';
            }
            tweetSection += '<p>'+tweet.text+'</p>';
            if(typeof(tweet.retweeted_status)!="undefined" && typeof(tweet.retweeted_status.entities)!="undefined" && typeof(tweet.retweeted_status.entities.media)!="undefined" && typeof(tweet.retweeted_status.entities.media[0])!="undefined" && typeof(tweet.retweeted_status.entities.media[0].media_url_https)!="undefined") {
			    tweetSection += '</div>'
            }
            tweetSection += '</div></div>';
            
            
            tweetSection += '<div class="large-24 columns"><div class="tweetAction"><ul class="inline-list right no-Mn-Bm hoverEffect">';
			tweetSection += '<li><a data-tid="'+tweet.id_str+'" data-stat="'+statRT+'" class="BtnRT'+retweeted+'" href="#" title="Retweet"><i class="fa fa-retweet"></i> 4</a></li>';
			tweetSection += '<li><a data-tid="'+tweet.id_str+'" data-stat="'+statFV+'" class="BtnFv'+favorited+'" href="" title="Favourite"><i class="fa fa-star"></i> 10</a></li>';
			tweetSection += '<li><a class="BtnRP" data-tid="'+tweet.id_str+'" data-user="'+tweet.user.screen_name+'" href="" title="Reply"><i class="fa fa-reply"></i> </a></li>';
			tweetSection += '<li><a class="BtnFW" data-tid="'+tweet.id_str+'" data-user="'+tweet.user.screen_name+'" href="" title="Forward"><i class="fa fa-mail-forward"></i> </a></li>';
			tweetSection += '</ul></div></div></article></li>';
						
			
			
					
		}
		
		$("#mainSection").html(tweetSection);
		
		$(".BtnRT").on("click", function() {
		  
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
			
		});

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

		$(".BtnRP").on("click", function() {
		  
		  $("#recommendBox").hide();	
		  $("#normalBox").show(); 
		  var tid = $( this ).data("tid");
		  var user = $( this ).data("user");
		  $("#TweetText").val("@"+user);
		  $("#ReplyTo").val(tid);
		  $("#tweetbox").slideDown('fast');
		  $(".tweetCloudIcon").addClass("cloudup");	  

		});
	
		$(".BtnFW").on("click", function() {
		  
		  var tid = $( this ).data("tid");
		  $("#recommendBox").show();	
		  $("#ForwTweet").val(tid);
		  $("#normalBox").hide(); 
		  $("#tweetbox").slideDown('fast');
		  $(".tweetCloudIcon").addClass("cloudup");	  

		});
			
		//FnLoadMyTimeline();
		
	});
	
	
	
}


//function FnLoadMyTimeline() {
	
	//$.get( "/json/timeline/"+$("#whoami").val(), function( tweets ) {
		
		//var html = "";
		
	  	//for(i in tweets) {
			
			//var tweet = tweets[i];				
			//html += '<li class="stream-item">';
			//html += '<div class="tweet">';
			//html += '<div class="content"><div>';
			//html += '<a class="fade" href="https://twitter.com/'+tweet.user.screen_name+'">';
			//html += '<img class="avatar" src="'+tweet.user.profile_image_url_https+'" alt="">';
			//html += '<strong class="fullname">'+tweet.user.name+'</strong>';
			//html += '&nbsp;<span class="username">@'+tweet.user.screen_name+'</span>';
			//html += '</a>';
			//html += '&nbsp;<small class="time"><a><span class="fade">'+FnTimeAgo(tweet.created_at)+'</span></a></small>';
			//html += '</div>';
			//html += '<p class="tweet-text">'+tweet.text+'</p>';
			//html += '</div>';
			//html += '<div>';
			//html += '</div></div></li>';	
							
		//}
		
		//$("#datamytweetsLister").html(html);
	
	//});
	
	
	
//}





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
