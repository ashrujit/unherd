/*$(function()	{

	$('.scrollable-div').slimScroll({
		height: '100%',
		size: '3px'
	});
	
	document.ontouchmove=function(e){
		if(disableScroll){ e.preventDefault(); } 
	}

});*/

$(document).ready(function(){ 
	
	FnLoadTweets();
	
	var timeout=null;
	var initialMargin=parseInt($("#siteMenuBar").css("margin-top"));
	
	$("#siteMenuBar").hover(function(){
		
		if(timeout){ 
			
			clearTimeout(timeout);
			timeout=null;
		
		}
		
		$(this).animate({ marginTop:0 },'fast');
		
	},function(){ 
		
		var menuBar=$(this);
		timeout=setTimeout(function(){ 
			
			timeout=null;
			menuBar.animate({ marginTop:initialMargin },'slow');
			
		},400);
		
	});
	
});


function FnLoadTweets() {
	
	$.get( "/json/getTweets", function( tweets ) {
		
		var html = "";
		
	  	for(i in tweets) {
			
			var tweet = tweets[i];
			
			var retweeted = "",favorited = "";
			if(tweet.favorited!=false)
				favorited = " activeAction";
			
			if(tweet.retweeted!=false)
				retweeted = " activeAction";
			
			html += '<li class="left clearfix">';
			html += '<span class="chat-img pull-left">';
			html += '<img src="'+tweet.user.profile_image_url_https+'" height="45" width="45" alt="User Avatar"></span>';
			html += '<div class="chat-body clearfix"><div class="header">';
			html += '<strong class="primary-font">'+tweet.user.name+'</strong>';
			html += '<strong>@'+tweet.user.screen_name+'</strong>';
			html += '<small class="pull-right text-muted"><i class="fa fa-clock-o"></i> 12 mins ago</small>';
			html += '</div><p>'+tweet.text+'</p>';
			html += '<i class="fa fa-retweet bigTextIcon'+retweeted+'"></i>';
			html += '<i class="fa fa-star bigTextIcon'+favorited+'"></i>';
			html += '<i class="fa fa-reply bigTextIcon"></i>';
			html += '<i class="fa fa-share bigTextIcon"></i>';
			html += '</div></li>';
							
		}
		
		$("#tweetsLister").html(html);
		TweetlistResizer();
	  
	});
	
	
	
}

function TweetRankingJob() {
	
	//post each tweet from array to a route in node app
	//get back its weight and put into the array
	//sort the array
	//load the complete html back
	
}

function TweetlistResizer() {
	
	$('.scrollable-div').slimScroll({
		height: '100%',
		size: '3px'
	});
	
	document.ontouchmove=function(e){
		if(disableScroll){ e.preventDefault(); } 
	}
	
}



