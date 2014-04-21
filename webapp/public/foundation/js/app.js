
// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();


// Initializing masonry



var $root = $('html, body');
    $('#scrollUp').click(function() {
        $root.animate({
            scrollTop: $( $.attr(this, 'href') ).offset().top
        }, 700);
        return false;

    });
    


