

$(document).ready(function(){ 
	
	FnLoadTweets();
	

	$(".tweetCloudIcon").click(function(){
		
		$("#TweetText").val("");
		$("#ReplyTo").val("");
		$("#tweetbox").slideToggle('fast');
		$(this).toggleClass("cloudup");
		
	});
	
	$("#TwBtn").click(function(){
		
		var tweet = $("#TweetText").val();
		var replyto = $("#ReplyTo").val();
		
		
		$.post("/ajaxTweet", {"tweet":tweet,"replyto":replyto}, function( data ) {
			
			console.log(data);
			FnLoadTweets();
			$("#TweetText").val("");
			$("#ReplyTo").val("");
			$("#tweetbox").slideUp('fast');
			$(".tweetCloudIcon").removeClass("cloudup");
			  
		});	
		
	});
	
	$(".nav li").click(function() {
	
		$(this).siblings("li").removeClass("active");
		$(this).addClass("active");	
		$(".stream-items").hide();
		$("#data"+$(this).prop("id")).show();
		
	});
	
	
		
});


function FnLoadTweets() {
	
	$.get( "/ranktweet", function( tweets ) {
		
		var html = "";
		
	  	for(i in tweets) {
			
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
			
			html += '<li class="stream-item">';
			html += '<div class="tweet">';
			html += '<div class="content"><div>';
			html += '<a class="fade" href="https://twitter.com/'+tweet.user.screen_name+'">';
			html += '<img class="avatar" src="'+tweet.user.profile_image_url_https+'" alt="">';
			html += '<strong class="fullname">'+tweet.user.name+'</strong>';
			html += '&nbsp;<span class="username">@'+tweet.user.screen_name+'</span>';
			html += '</a>';
			html += '&nbsp;<small class="time"><a><span class="fade">'+FnTimeAgo(tweet.created_at)+'</span></a></small>';
			html += '&nbsp;<small class="scorebox"><a><span>'+parseFloat(tweet.score).toFixed(2)+'</span></a></small>';
			html += '</div>';
			html += '<p class="tweet-text">'+tweet.text+'</p>';
			html += '</div>';
			html += '<div>';
			html += '<ul class="tweet-actions" style="display: inline-block">';
			html += '<li><a data-tid="'+tweet.id_str+'" data-stat="'+statRT+'" class="BtnRT'+retweeted+'"><span class="Icon Icon--retweet"></span>'+RTtext+'</a></li>';
			html += '<li><a data-tid="'+tweet.id_str+'" data-stat="'+statFV+'" class="BtnFv'+favorited+'"><span class="Icon Icon--favorite"></span>Favourite</a></li>';
			html += '<li><a class="BtnRP" data-tid="'+tweet.id_str+'" data-user="'+tweet.user.screen_name+'"><span class="Icon Icon--reply"></span>Reply</a></li>';
			html += '</ul></div></div></li>';
			
							
		}
		
		$("#datatweetsLister").html(html);

		$(".BtnRT").on("click", function() {
		  
		  var tid = $( this ).data("tid");
		  var stat = $( this ).data("stat");
		  console.log("RT",stat,tid);
		  
		  if(stat!="true") {
		  
			  $.post( "/ajaxRetweet", {"tid":tid,"stat":stat}, function( tweets ) {
				
				FnLoadTweets();
				  
			  });
		  }			
			
		});

		$(".BtnFv").on("click", function() {
		  
		  var tid = $( this ).data("tid");
		  var stat = $( this ).data("stat");
		  console.log("FV",tid);
		  
		  $.post( "/ajaxFavourite", {"tid":tid,"stat":stat}, function( tweets ) {
			
			FnLoadTweets();
			  
		  });

		});

		$(".BtnRP").on("click", function() {
		  
		  var tid = $( this ).data("tid");
		  var user = $( this ).data("user");
		  $("#TweetText").val("@"+user);
		  $("#ReplyTo").val(tid);
		  $("#tweetbox").slideDown('fast');
		  $(".tweetCloudIcon").addClass("cloudup");	  

		});
		
		$("#datachatterLister").html(html);
		FnLoadMyTimeline();
		
	});
	
	
	
}


function FnLoadMyTimeline() {
	
	$.get( "/json/timeline/"+$("#whoami").val(), function( tweets ) {
		
		var html = "";
		
	  	for(i in tweets) {
			
			var tweet = tweets[i];				
			html += '<li class="stream-item">';
			html += '<div class="tweet">';
			html += '<div class="content"><div>';
			html += '<a class="fade" href="https://twitter.com/'+tweet.user.screen_name+'">';
			html += '<img class="avatar" src="'+tweet.user.profile_image_url_https+'" alt="">';
			html += '<strong class="fullname">'+tweet.user.name+'</strong>';
			html += '&nbsp;<span class="username">@'+tweet.user.screen_name+'</span>';
			html += '</a>';
			html += '&nbsp;<small class="time"><a><span class="fade">'+FnTimeAgo(tweet.created_at)+'</span></a></small>';
			html += '</div>';
			html += '<p class="tweet-text">'+tweet.text+'</p>';
			html += '</div>';
			html += '<div>';
			html += '</div></div></li>';	
							
		}
		
		$("#datamytweetsLister").html(html);
	
	});
	
	
	
}



function FnTimeAgo(time){
	
	var units = [
	{ name: "second", limit: 60, in_seconds: 1 },
	{ name: "minute", limit: 3600, in_seconds: 60 },
	{ name: "hour", limit: 86400, in_seconds: 3600  },
	{ name: "day", limit: 604800, in_seconds: 86400 },
	{ name: "week", limit: 2629743, in_seconds: 604800  },
	{ name: "month", limit: 31556926, in_seconds: 2629743 },
	{ name: "year", limit: null, in_seconds: 31556926 }
	];
	var diff = (new Date() - new Date(time)) / 1000;
	if (diff < 5) return "now";

	var i = 0;
	while (unit = units[i++]) {
	if (diff < unit.limit || !unit.limit){
	  var diff =  Math.floor(diff / unit.in_seconds);
	  return diff + " " + unit.name + (diff>1 ? "s ago" : "");
	}
	};
}

