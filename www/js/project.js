var Rabbit = {
    framesize:0,
    siteLoaded:false,

    init:function() {
        Rabbit.handleWindowResize();
        $("body").removeClass("intro");

        $(window).on('resize',Rabbit.handleWindowResize);

        setTimeout(Rabbit.handleWindowResize,200);

        $("#bt_scrolldown").on("click",function(){
            $('body,html').stop().animate({scrollTop:$("#sections").position().top}, 1000);
        });

        $("#bt_scrollbackUp").on("click",function(){
            $('body,html').stop().animate({scrollTop:0}, 1000);
        });

        setTimeout(function(){
            $(".vjs-big-play-button").html('<img src="img/playbutton.png">');
        },2000);
    },

    handleWindowResize:function() {
        Rabbit.framesize = ($('body').width()-$('#main-wrapper').width())/2;

        if($("#homewrapper .right-container").height() > $("#homewrapper .left-container").height()){
            $("#homewrapper .left-container").height($("#homewrapper .right-container").height());
        }

        $.each($(".section.innerpage"), function() {
            $(this).css({'min-height':((($(window).width() * $(this).attr('aimHeight'))/$(this).attr('aimWidth'))+"px")});
        });
    }
};


$(function() {
    Rabbit.init();

    conditionizr({
        debug      : false,
        ieLessThan : {
            active: true,
            version: '9',
            scripts: false,
            styles: false,
            classes: true
        },
        chrome     : { scripts: false, styles:false, classes: true, customScript: false },
        safari     : { scripts: false, styles:false, classes: true, customScript: false },
        opera      : { scripts: false, styles:false, classes: true, customScript: false },
        firefox    : { scripts: false, styles:false, classes: true, customScript: false },
        ie10       : { scripts: false, styles:false, classes: true, customScript: false },
        ie9        : { scripts: false, styles:false, classes: true, customScript: false },
        ie8        : { scripts: false, styles:false, classes: true, customScript: false },
        ie7        : { scripts: false, styles:false, classes: true, customScript: false },
        ie6        : { scripts: false, styles:false, classes: true, customScript: false },
        retina     : { scripts: false, styles:false, classes: true, customScript: false },
        touch      : { scripts: false, styles:false, classes: true, customScript: false },
        mac        : true,
        win        : true,
        x11        : true,
        linux      : true
    });
});