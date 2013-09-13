(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

$.fn.carousel = function(_timer){
    var maxPages;
    var currentPage;
    var animateWidth;
    var timer = _timer;
    var $item = $(this);

    var animate = function(){
        if($item.attr("canloop") == 'true'){
            currentPage ++;

            $item.attr("current-page",currentPage);

            if(currentPage > (maxPages-1)){
                currentPage = 1;
                $item.find("div").css("left",0);
            }

            TweenLite.to($item.find("div"),1,{'left':((currentPage * 100)*-1)+"%"});
            
            setTimeout(animate, timer);
        }else{
            setTimeout(animate, timer*2);
        }
    };

    if(!$(this).hasClass("carousel")){
        $(this).addClass("carousel");

        var maxPages     = $(this).attr("max-pages");
        var currentPage  = $(this).attr("current-page");
        var animateWidth = $(this).find('figure img').width();
    }

    setTimeout(animate, timer);

    return{
        stop:function(){
            $.each($("#galleryimages div.galleryitem"), function(){
                $(this).attr("canloop",'false');
            });
        },
        resume:function(){
            $.each($("#galleryimages div.galleryitem"), function(){
                $(this).attr("canloop",'true');
            });
        }
    };
};



/*
Plugin: jQuery Parallax
Version 1.1.3
Author: Ian Lunn
Twitter: @IanLunn
Author URL: http://www.ianlunn.co.uk/
Plugin URL: http://www.ianlunn.co.uk/plugins/jquery-parallax/

Dual licensed under the MIT and GPL licenses:
http://www.opensource.org/licenses/mit-license.php
http://www.gnu.org/licenses/gpl.html
*/

(function( $ ){
    var $window = $(window);
    var windowHeight = $window.height();

    $window.resize(function () {
        windowHeight = $window.height();
    });

    $.fn.parallax = function(xpos, speedFactor, outerHeight) {
        var $this = $(this);
        var getHeight;
        var firstTop;
        var paddingTop = 0;
        
        //get the starting position of each element to have parallax applied to it      
        $this.each(function(){
            firstTop = $this.offset().top;
        });

        if (outerHeight) {
            getHeight = function(jqo) {
                return jqo.outerHeight(true);
            };
        } else {
            getHeight = function(jqo) {
                return jqo.height();
            };
        }
            
        // setup defaults if arguments aren't specified
        if (arguments.length < 1 || xpos === null) xpos = "50%";
        if (arguments.length < 2 || speedFactor === null) speedFactor = 0.1;
        if (arguments.length < 3 || outerHeight === null) outerHeight = true;
        
        // function to be called whenever the window is scrolled or resized
        function update(){
            var pos = $window.scrollTop();              

            $this.each(function(){
                var $element = $(this);
                var top = $element.offset().top;
                var height = getHeight($element);

                // Check if totally above or totally below viewport
                if (top + height < pos || top > pos + windowHeight) {
                    return;
                }

                $this.css('backgroundPosition', xpos + " " + Math.round((firstTop - pos) * speedFactor) + "px");
            });
        }       

        $window.bind('scroll', update).resize(update);
        update();
    };
})(jQuery);
