
// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();


// Initializing masonry

var container = document.querySelector('#mainSection');
var msnry = new Masonry( container, {
  // options
//  columnWidth: 200,
  itemSelector: '.optimize'
});

var $container = $('#mainSection');

//$container.imagesLoaded( function(){
 $('#mainSection').masonry({
  itemSelector: '.optimize',
  isAnimated: true,
});



var $containter = $('#container');
	//$containter.imagesLoaded( function(){
		$containter.masonry({
			itemSelector: '.box',
        	isAnimated: !Modernizr.csstransitions,
        	isFitWidth: true
		});	
	//});
