var Rabbit = {
    framesize:0,
    allowScrollAnimation:false,
    video1:null,
    video2:null,
    video3:null,
    video1Loaded:false,
    video2Loaded:false,
    video3Loaded:false,
    siteLoaded:false,
    contactsOpen:false,
    scrollingRabbit:false,

    init:function() {
        Rabbit.handleWindowResize();
        Rabbit.addEventListeners();
        Rabbit.bindViews();

        $(window).on('resize',Rabbit.handleWindowResize);
        $(window).on('scroll',Rabbit.handleRabbitScroll);

        setTimeout(Rabbit.handleWindowResize,200);
    },

    addEventListeners:function() {
        $("#contactButtonHolder").on('click',Rabbit.toggleContacts)
        .on('mouseover',function(){
            $("#contactButtonHolder img").attr("src","img/icon_mail_hover.png");
        })
        .on('mouseleave',function(){
            if(!Rabbit.contactsOpen){
                $("#contactButtonHolder img").attr("src","img/icon_mail.png");
            }
        });

        $("a.navButton").on('click',function(){
            Rabbit.allowScrollAnimation = true;
        });

        $("#buttonSend").on('click',function(){
            $.ajax({
                type: "POST",
                url: 'services/contacts.php',
                data: {
                    name    :$("#contact_name").val(),
                    email   :$("#contact_email").val(),
                    phrase  :$("#contact_phrase").val()
                },
                success:function(data){
                    $("#contactButtonHolder").click();
                }
            });
        });
    },

    bindViews:function() {
        $('.section').on('inview', Rabbit.handleInView);

        //Rabbit.video1 = videojs('filler1_video');
        Rabbit.video2 = videojs('filler2_video');
        // Rabbit.video3 = videojs('whoamivideo');
    },

    handleInView:function(event, isInView, visiblePartX, visiblePartY) {
        var elem = $(this);

        if (isInView) {
            if(elem.attr("id")=="home" || elem.attr("id")=="filler1" ){
                Rabbit.viewInteractions.home.on();
            }else{
                $("#menu").fadeIn();                
            }

            if (visiblePartY == 'top') {
                elem.data('seenTop', true);
                if(Rabbit.viewInteractions[$(this).attr("id")]){
                    Rabbit.viewInteractions[$(this).attr("id")].onTop();
                }

            } else if (visiblePartY == 'bottom') {
                elem.data('seenBottom', true);
                if(Rabbit.viewInteractions[$(this).attr("id")]){
                    Rabbit.viewInteractions[$(this).attr("id")].onBottom();
                }
            } else {
                elem.data('seenTop', true);
                elem.data('seenBottom', true);
            }

            if (elem.data('seenTop') && elem.data('seenBottom')) {
                elem.data('seenTop', false);
                elem.data('seenBottom', false);

                //console.log("DO SOMETHING",$(this).attr("id"));

                if(Rabbit.viewInteractions[$(this).attr("id")]){
                    Rabbit.viewInteractions[$(this).attr("id")].on();
                }

                if(elem.hasClass("innerpage")){
                    Rabbit.app.setLocation("#/"+$(this).attr("id"));
                }
            }
        } else {
            //console.log("STOP DOING SOMETHING",$(this).attr("id"));

            if(Rabbit.viewInteractions[$(this).attr("id")]){
                Rabbit.viewInteractions[$(this).attr("id")].off();
            }

            elem.data('seenTop', false);
            elem.data('seenBottom', false);
        }
    },

    handleRabbitScroll:function(){
        if(!Rabbit.scrollingRabbit){
            return;
        }
        if($(window).scrollTop() < ($("#filler1").position().top-($("#filler1").height())) ){
            $("#filler1_img").attr("src","img/rabbit/1.png");
        }else{
            var nr = ($(window).scrollTop() * 52) / ($("#filler1").position().top + $("#filler1").height() * 2.6);

            if(nr > 1 && nr < 53){
                $("#filler1_img").attr("src","img/rabbit/"+parseInt(nr)+".png");
            }
        }
    },

    viewInteractions:{
        home:{
            loopingArrow:function(){
                TweenLite.to($("#home .navButton"),0.4,{top:20,ease:Power2.easeOut,onComplete:function(){
                  TweenLite.to($("#home .navButton"),0.4,{top:0,ease:Power2.easeOut,onComplete:function(){
                    Rabbit.viewInteractions.home.loopingArrow();
                  }});
                }});
            },
            on:function(){
                $("#menu").fadeOut();
            },
            off:function(){
                $("#menu").fadeIn();
            },
            onTop:function(){
                
            },
            onBottom:function(){
                
            }
        },
        filler1:{
            on:function(){
                Rabbit.scrollingRabbit = true;
            },
            off:function(){
                Rabbit.scrollingRabbit = false;
            },
            onTop:function(){
                Rabbit.scrollingRabbit = true;
            },
            onBottom:function(){
                Rabbit.scrollingRabbit = true;
            }
        },
        whoami:{
            on:function(){
                $("#lamp .on").fadeIn('slow');

                $("#lampContainer").off("mouseenter");
                $("#lampContainer").off("mouseleave");

                $("#lampContainer #lamp").on("mouseenter",function(event){
                    TweenLite.to($("#rope img"),0.2,{top:"-130px"});
                    TweenLite.to($("#rope img"),0.2,{top:"-135px",delay:0.2});

                    $("#lamp .light").off().fadeIn();
                    $("#lamp #clickme").off().fadeIn();
                })
                .on("mouseleave",function(event){
                    TweenLite.to($("#rope img"),0.2,{top:"-130px"});
                    TweenLite.to($("#rope img"),0.3,{top:"-165px",delay:0.2});

                    $("#lamp .light").off().fadeOut();
                    $("#lamp #clickme").off().fadeOut();
                }).
                on("click",function(){
                    if(Rabbit.video3Loaded == false){
                        // Rabbit.video3Loaded = true;
                        // Rabbit.video3.src({ type: "video/mp4", src: "video/filler3.mp4" });
                    }

                    // Rabbit.video3.on("ended",function(){
                    //     $("#whoamivideocontainer").fadeOut("slow");
                    // });

                    $("#whoamivideocontainer").fadeIn();
                    // Rabbit.video3.currentTime(0);
                    // Rabbit.video3.play();

                    $("#videoHolder #btclose").on("click",function(){
                        $("#videoHolder #btclose").off("click");
                        // Rabbit.video3.pause();
                        $("#whoamivideocontainer").fadeOut("slow");
                    });
                });
            },
            off:function(){
                $("#lamp .light").off().fadeOut();
                $("#lampContainer").off("mouseenter");
                $("#lampContainer").off("mouseleave");
                $("#lampContainer").off("click");
                $("#videoHolder #btclose").off("click");
            },
            onTop:function(){
                Rabbit.viewInteractions.whoami.on();
                $("#lamp .on").fadeIn('slow');
            },
            onBottom:function(){
                Rabbit.viewInteractions.whoami.on();
                $("#lamp .on").fadeIn('slow');
            }
        },
        filler2:{
            on:function(){
                if(Rabbit.video2Loaded == false){
                    Rabbit.video2Loaded = true;
                    Rabbit.video2.src({ type: "video/mp4", src: "video/filler2.mp4" });
                }

                Rabbit.video2.play();
            },

            off:function(){
                Rabbit.video2.pause();
                //Rabbit.video2.currentTime(0);
            },
            onTop:function(){

            },
            onBottom:function(){
                
            }
        },
        projects:{
            on:function(){

            },
            off:function(){
                
            },
            onTop:function(){
                
            },
            onBottom:function(){
                
            }
        },

        gallery:{
            loaded:false,

            loadGallery:function(){
  /*              if(!Rabbit.viewInteractions.gallery.loaded){
                    Rabbit.viewInteractions.gallery.loaded = true;

                    $.each($("#galleryimages div.galleryitem"), function() {
                      $(this).carousel(4000 + ((Math.random()*50)*10));
                    });
                }
*/
                $.each($("#galleryimages div.galleryitem"), function(){
                    $(this).attr("canloop",'true');
                });
            },
            on:function(){
                Rabbit.viewInteractions.gallery.loadGallery();
            },
            off:function(){
                $.each($("#galleryimages div.galleryitem"), function(){
                    $(this).attr("canloop",'false');
                });
            },
            onTop:function(){
                Rabbit.viewInteractions.gallery.loadGallery();
            },
            onBottom:function(){
                Rabbit.viewInteractions.gallery.loadGallery();
            }
        }
    },

    handleWindowResize:function() {
        Rabbit.framesize = ($('body').width()-$('#main-wrapper').width())/2;

        $('.siteframe.top,.siteframe.bottom').height(Rabbit.framesize);

        $("#gallery #galleryimages").css("padding-bottom",Rabbit.framesize+"px");

        $('.siteframe.left,.siteframe.right').width(Rabbit.framesize);
        $('.siteframe.left,.siteframe.right').height($(window).height());

        $('#filler2 .phrases').parallax("50%", 2);
        $('#filler3 .phrases').parallax("50%", 1.8);

        $('#whoami_bigcarrot').parallax("10%", 4);
        $('#whoami_smallcarrot').parallax("50%", 0.2);
        $('#whoami_orange').parallax("50%", 1.6);

        $("#filler2_video").width($("#filler2_img").width());
        $("#filler2_video").height($("#filler2_img").height());

        $.each($(".section.innerpage"), function(){
            if($(this).hasClass("forceMin")){
                if($(window).height() > $(window).width()){
                    $(this).css({'background-size': 'auto',"background-attachment": "auto"});
                }else{
                    $(this).css({'background-size': '100%',"background-attachment": "fixed"});
                }
                if($(window).height() < $(this).attr('aimHeight')){
                    $(this).css({'height':$(window).height()});
                }else{
                    $(this).css({'height':$(this).attr('aimHeight')});
                }   
            }else{
                $(this).css({'min-height':((($(window).width() * $(this).attr('aimHeight'))/$(this).attr('aimWidth'))+"px")});
            }
        });

        setTimeout(function(){
            var firstWidth = $("#galleryimages div.galleryitem").width();
            var firstHeight = $("#galleryimages div.galleryitem figure img").height(); 

            if(firstWidth == 0 || firstHeight == 0){
                Rabbit.handleWindowResize();
            }else{
                $.each($("#galleryimages div.galleryitem"), function() {
                    $(this).attr("max-pages", $(this).find("figure img").length);

                    $(this).height(firstHeight);
                    $(this).find("div").width(firstWidth*$(this).find('figure img').length);
                    $(this).find("img").width(firstWidth);
                    $(this).css("overflow","hidden");
                });

                if(!Rabbit.viewInteractions.gallery.loaded){
                    Rabbit.viewInteractions.gallery.loaded = true;

                    $.each($("#galleryimages div.galleryitem"), function() {
                      $(this).carousel(4000 + ((Math.random()*50)*10));
                    });
                }

                $.each($("#galleryimages div.galleryitem"), function(){
                    $(this).attr("canloop",'true');
                });
            }            
        },1000);
    },

    toggleContacts:function(){
        if($("#contacts").hasClass("open")){
            var props = {y:0};

            TweenLite.to($("#main-wrapper"),0.4,{left:'0',ease:Power4.easeOut});

            $("#contactButtonHolder img").attr("src","img/icon_mail.png");
            
            TweenLite.to($("#contacts"),0.4,{left:'0',width:'0',onComplete:function(){
                $("#contacts").removeClass("open");
            },ease:Power4.easeOut});

            TweenLite.to(props,0.4,{y:80,onUpdate:function(){
                $("#contacts #contactsInnerWrapper").css({'-webkit-transform':'perspective(1000) rotateY('+props.y+'deg)'});
            },ease:Power4.easeOut});
            Rabbit.contactsOpen = false;            
        }else{
            var props = {y:80};

            TweenLite.to($("#main-wrapper"),0.5,{left:'-473px',ease:Power4.easeOut});

            $("#contactButtonHolder img").attr("src","img/icon_mail_hover.png");
            
            TweenLite.to($("#contacts"),0.5,{left:'-474px',width:'474px',onComplete:function(){
                $("#contacts").addClass("open");
            },ease:Power4.easeOut});

            TweenLite.to(props,0.5,{y:0,onUpdate:function(){
                $("#contacts #contactsInnerWrapper").css({'-webkit-transform':'perspective(1000) rotateY('+props.y+'deg)'});
            },ease:Power4.easeOut});
            Rabbit.contactsOpen = true;
        }
    }
};

Rabbit.app = $.sammy(function(){
    
});

Rabbit.app.get('#/', function(context){
    window.location.href="#";
});

Rabbit.app.get('#/:page', function(context){
    var page = this.params["page"];
    
    if(Rabbit.siteLoaded == false){
        Rabbit.siteLoaded = true;
        Rabbit.allowScrollAnimation = true;

        Rabbit.allowScrollAnimation = false;
        $('body,html').stop().animate({scrollTop:$("#"+page).position().top}, 1,function(){
        });

        setTimeout(function(){
            $("#menu ul li a").removeClass("selected");
            $("#bt_"+page).addClass("selected");

            if(Rabbit.allowScrollAnimation){
                $('.section.innerpage').off('inview');

                $('body,html').stop().animate({scrollTop:$("#"+page).position().top}, 1000,function(){
                    Rabbit.allowScrollAnimation = false;
                    $('.section.innerpage').on('inview', Rabbit.handleInView);
                });
            }

            $("#menu ul li a").on("mouseover",function(){
                var topPos = ($(this).offset().top - $(window).scrollTop());

                $("#menuframe").css({top:(topPos-10)+'px'});
                $("#menuframe").stop().fadeIn("fast");
                $("#menuframe span").html($(this).attr('txt'));
                //Cufon.replace('.cufonStyle');
            }).on("mouseout",function(){
                $("#menuframe").fadeOut("fast");
                $("#menuframe").css({top:$(this).attr('pos')+'%'});
            });

            $("body").removeClass("intro");
            Rabbit.viewInteractions.home.loopingArrow();
        },500);
    }else{
        $("#menu ul li a").removeClass("selected");
        $("#bt_"+page).addClass("selected");

        if(Rabbit.allowScrollAnimation){
            $('.section.innerpage').off('inview');

            $('body,html').stop().animate({scrollTop:$("#"+page).position().top-($(".siteframe.top").height()-2)}, 1000,function(){
                Rabbit.allowScrollAnimation = false;
                $('.section.innerpage').on('inview', Rabbit.handleInView);
            });
        }
    }
});

$(function() {
    Rabbit.init();
    Rabbit.app.run("#/");

    videojs.options.flash.swf = "swf/video-js.swf";

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