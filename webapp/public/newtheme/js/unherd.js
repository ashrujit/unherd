

$(document).ready(function(){ 
	
	FnLoadTweets();
	

	$(".tweetCloudIcon").click(function(){
		//$(".tweetCloudIcon").css('margin-top','50px');
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
			//FnLoadTweets();
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
			
			html += '<li class="stream-item">';
			html += '<div class="tweet">';
			html += '<div class="content"><div>';
			html += '<img class="avatar" src="'+tweet.user.profile_image_url_https+'" alt="">';
			html += '<span class="tweet-header"><a class="fade" href="https://twitter.com/'+tweet.user.screen_name+'">'
			html += '<strong class="fullname">'+tweet.user.name+'</strong>';
			html += '&nbsp;<span class="username">@'+tweet.user.screen_name+'</span>';
			html += '</a>';
			html += '&nbsp;<small class="time"><a><span class="fade">'+FnTimeAgo(tweet.created_at)+'</span></a></small></span></span>';
			html += '&nbsp;<small class="scorebox"><a><span>'+parseFloat(tweet.score).toFixed(2)+'</span></a></small>';
			if(tweet.isNew == true) {
				html += '&nbsp;<small class="scorenew"><a><span>NEW</span></a></small>';
			}
			html += '</div>';
			html += '<p class="tweet-text">'+tweet.text+'</p>';
			html += '</div>';
			html += '<div class="rFloat">';
			html += '<ul class="tweet-actions" style="display: inline-block">';
			html += '<li><a data-tid="'+tweet.id_str+'" data-stat="'+statRT+'" class="BtnRT'+retweeted+'"><span class="Icon Icon--retweet"></span></a></li>';
			html += '<li><a data-tid="'+tweet.id_str+'" data-stat="'+statFV+'" class="BtnFv'+favorited+'"><span class="Icon Icon--favorite"></span></a></li>';
			html += '<li><a class="BtnRP" data-tid="'+tweet.id_str+'" data-user="'+tweet.user.screen_name+'"><span class="Icon Icon--reply"></span></a></li>';
			html += '</ul></div></div></li>';
			
							
		}
		
		$("#datatweetsLister").html(html);

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

