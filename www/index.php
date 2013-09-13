<?php
    require_once('services/projects.php');
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <!-- for Google -->
        <meta name="description" content="I'm a portuguese digital designer, born in 1990 in Lisbon." />
        <meta name="keywords" content="Designer Portfolio Design Web Graphic" />

        <meta name="author" content="Philipa Rabbit, Ricardo Cerqueira" />
        <meta name="copyright" content="" />
        <meta name="application-name" content="Philipa Rabbit Web Site" />

        <!-- for Facebook -->          
        <meta property="og:title" content="Philipa Rabbit" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="http://philiparabbit.com/img/whoami_photo.png" />
        <meta property="og:url" content="" />
        <meta property="og:description" content="I'm a portuguese digital designer, born in 1990 in Lisbon." />

        <!-- for Twitter -->          
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Philipa Rabbit" />
        <meta name="twitter:description" content="I'm a portuguese digital designer, born in 1990 in Lisbon." />
        <meta name="twitter:image" content="http://philiparabbit.com/img/whoami_photo.png" />

        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>Philipa Rabbit Design</title>
        <meta name="viewport" content="width=device-width">

        <link rel="stylesheet" href="css/normalize.min.css">
        <link rel="stylesheet" href="css/main.css">
        <link rel="stylesheet" type="text/css" href="css/unsemantic-grid-responsive.css">
        <link rel="stylesheet" type="text/css" href="css/video-js.min.css">

        <link href='http://fonts.googleapis.com/css?family=Amatic+SC' rel='stylesheet' type='text/css'>

        <script src="js/vendor/modernizr-2.6.2-respond-1.1.0.min.js"></script>
    </head>
    <body class="intro">
        <!--[if lte IE 7]>
            <p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
        <![endif]-->
        <div class="siteframe top"></div>
        <div class="siteframe bottom"></div>
        
        <div class="siteframe left">
            <div id="menuframe" class="hide-on-mobile cufonStyle">
                <span>

                </span>
            </div>
            
            <nav id="menu" class="hide-on-mobile">                
                <ul>
                    <li>
                        <a id="bt_home" txt="HOME" class="navButton" href="#/home">
                            <img src="img/menu_button_hover.png">
                        </a>
                    </li>
                    <li>
                        <a id="bt_whoami" txt="WHO AM I?" class="navButton" href="#/whoami">
                            <img src="img/menu_button_hover.png">
                        </a>
                    </li>

                    <li>
                        <a id="bt_projects" txt="PROJECTS" class="navButton" href="#/projects">
                            <img src="img/menu_button_hover.png">
                        </a>
                    </li>

                    <li>
                        <a id="bt_gallery" txt="GALLERY" class="navButton" href="#/gallery">
                            <img src="img/menu_button_hover.png">
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
        
        <div class="siteframe right">
            <section id="contacts" class="hide-on-mobile">
                <div id="contactsInnerWrapper">
                    <ul id="shareItemsContainer">
                        <li class="shareItem ook">
                            <a target="blank" href="https://www.facebook.com/philiparabbit">
                                <img src="img/ook_OFF.png" alt="">
                            </a>
                        </li>
                        <li class="shareItem er">
                            <a target="blank" href="https://twitter.com/PhilipaRabbit">
                                <img src="img/er_OFF.png" alt="">
                            </a>
                        </li>
                        <li class="shareItem cloud">
                            <a target="blank" href="https://soundcloud.com/philiparabbit">
                                <img src="img/cloud_OFF.png" alt="">
                            </a>
                        </li>
                        <li class="shareItem ce">
                            <a target="blank" href="http://www.behance.net/philiparabbit">
                                <img src="img/ce_OFF.png" alt="">
                            </a>
                        </li>
                    </ul>
                    
                    <div id="formHolder">
                        <div class="contacts">
                            <p>
                                E-Mail: info@philiparabbit.com
                            </p>
                            <p>
                                Telf.: +351 963 694 223
                            </p>

                            <p>
                                Lisboa, Portugal
                            </p>
                        </div>
                        <input id="contact_name" placeholder="Your Name" type="text">
                        <input id="contact_email" placeholder="Your Email Address" type="text">
                        <textarea placeholder="WHAT'S UP..." name="" id="contact_phrase" cols="30" rows="10"></textarea>
                        
                        <button id="buttonSend">
                            <img src="img/button_send_txt.png" alt="">
                        </button>
                    </div>
                </div>
            </section>

            <div id="contactButtonHolder" class="hide-on-mobile">
                <img src="img/icon_mail.png">
            </div>
        </div>

        
        <div id="main-wrapper">
            <section id="home" aimWidth="1758" aimHeight="990" class="section innerpage forceMin">
                <h1>
                    <img src="img/logo.png">
                </h1>

                <div>
                    <a href="#/whoami" class="navButton">
                        <img src="img/button_scroll_hover.png">
                    </a>
                </div>                
            </section>

            <section id="filler1" class="section hide-on-mobile">
                <img id="filler1_img" src="img/rabbit/1.png">
            </section>

            <section id="whoami" aimWidth="1599" aimHeight="1107" class="section innerpage">
                <div id="whoamivideocontainer">
                    <div id="videoHolder">
                        <button id="btclose">
                            <img src="img/btClose.png" alt="">
                        </button>
                        <video id="whoamivideo" class="video-js vjs-default-skin" controls preload="auto" poster="img/PREVIEW_VIDEO_WHOAMI.png"></video>                        
                        
                        <div id="videoShadow" class="hide-on-mobile">
                            <img src="img/videoShadow.png" alt="">
                        </div>
                    </div>
                </div>

                <div id="lampContainer">
                    <div id="lamp">
                        <img class="light" src="img/lamp_light.png">
                        <img class="on" src="img/lamp_on.png">
                        <img class="off" src="img/lamp_off.png">
                        
                        <div id="clickme">
                            <img src="img/clickMe.png" alt="">
                        </div>
                    </div>

                    <div id="rope">
                        <img src="img/lamp_rope.png">
                    </div>
                </div>

                <div id="whoamiphoto">
                    <img class="on" src="img/whoami_photo.png">
                </div>

                <h1>
                    <img src="img/whoami_title.png">
                </h1>

                <p>
                    My real name is <strong>Filipa Coelho Ferreira</strong> but i’m also knowed as <strong>Philipa Rabbit</strong>. I'm a portuguese <br>
                    digital designer, born in 1990 in Lisbon. Just a normal and energetic girl who loves illustration <br>
                    and animation, always trying to combine them with my work as designer. My strong connection with <br>
                    music allows me the freedom to compose my own tracks when needed, check them <a target="_blank" href="https://soundcloud.com/philiparabbit">here</a>.
                </p>    

                <p>
                    I'm graduated on Communication Design by the Faculty of Fine Arts of University of Lisbon, <br>
                    one of Portugal finest. Whenever possible I try to expand my technical and conceptual <br>
                    knowledge, what led me to an Illustration course in Tecnical School of Arts and Technology <br>
                    (RESTART) in the present course (2013). Currently, I’ve been working as part of a art direction <br>
                    as web designer and as a freelance illustrator. I've had the opportunity to work for <br>
                    clients such as: Oreo, Smart, Um Bongo, Pedigree and Whiskas to name a few.
                </p>

                <div id="whoami_bigcarrot">
                    
                </div>

                <div id="whoami_smallcarrot">
                    
                </div>

                <div id="whoami_orange">
                    
                </div>
            </section>

            <section id="filler2" class="section hide-on-mobile">
                <div class="phrases">
                    
                </div>

                <video id="filler2_video" class="video-js vjs-default-skin" controls preload="auto"
                poster="img/PREVIEW_FILLER2.png">
                </video>

                <img id="filler2_img" src="img/PREVIEW_FILLER2.png">
            </section>

            <section id="projects" aimWidth="1599" aimHeight="1109" class="section innerpage">
                <div id="projects_container">
                    <h1>
                        <img src="img/projects_title.png">
                    </h1>

                    <ul>
                        <?php
                            for($i=0; $i<count($projects); $i++):
                        ?>
                        <li>
                            <a href="project.php?p=<?php echo $i; ?>">
                                <img class="desc" src="img/projects/thumbnails/<?php echo $projects[$i]['picture']['desc'] ?>.png">
                                <img class="hover" src="img/projects/thumbnails/<?php echo $projects[$i]['picture']['hover'] ?>.png">
                                <img class="project" src="img/projects/thumbnails/<?php echo $projects[$i]['picture']['normal'] ?>.png">
                            </a>
                        </li>
                        <?php
                            endfor;
                        ?>
                    </ul>
                </div>
            </section>

            <section id="filler3" aimWidth="1598" aimHeight="1071" class="section hide-on-mobile">
                <div id="theeth"> </div>
                <div class="phrases">
                    
                </div>
                <img src="img/Cafecfundo.gif" alt="">
            </section>

            <section id="gallery" <?php /*aimWidth="1599" aimHeight="1109" *class="section innerpage"*/?> >
                <div id="galleryimages" class="grid-container">
                    <div current-page="0" canloop="true" class="galleryitem grid-25 mobile-grid-50">
                        <div>
                            <figure class="figure">
                                <img src="img/gallery/01.jpg" alt="">
                            </figure>
                            <figure class="figure">
                                <img src="img/gallery/05.jpg" alt="">
                            </figure>
                            <figure class="figure">
                                <img src="img/gallery/02.jpg" alt="">
                            </figure>
                            <figure class="figure">
                                <img src="img/gallery/01.jpg" alt="">
                            </figure>
                        </div>
                    </div>
                    <div current-page="0" canloop="true" class="galleryitem grid-25 mobile-grid-50">
                        <div>
                            <figure class="figure">
                                <img src="img/gallery/03.jpg" alt="">
                            </figure>
                            <figure class="figure">
                                <img src="img/gallery/01.jpg" alt="">
                            </figure>
                            <figure class="figure">
                                <img src="img/gallery/04.jpg" alt="">
                            </figure>
                            <figure class="figure">
                                <img src="img/gallery/03.jpg" alt="">
                            </figure>
                        </div>
                    </div>
                    <div current-page="0" canloop="true" class="galleryitem grid-25 mobile-grid-50">
                        <div>
                            <figure class="figure">
                                <img src="img/gallery/05.jpg" alt="">
                            </figure>
                            <figure class="figure">
                                <img src="img/gallery/02.jpg" alt="">
                            </figure>
                            <figure class="figure">
                                <img src="img/gallery/06.jpg" alt="">
                            </figure>
                            <figure class="figure">
                                <img src="img/gallery/05.jpg" alt="">
                            </figure>
                        </div>
                    </div>
                    <div current-page="0" canloop="true" class="galleryitem grid-25 mobile-grid-50">
                        <div>
                            <figure class="figure">
                                <img src="img/gallery/07.jpg" alt="">
                            </figure>
                            <figure class="figure">
                                <img src="img/gallery/03.jpg" alt="">
                            </figure>
                            <figure class="figure">
                                <img src="img/gallery/08.jpg" alt="">
                            </figure>
                            <figure class="figure">
                                <img src="img/gallery/07.jpg" alt="">
                            </figure>
                        </div>
                    </div>
                    <div current-page="0" canloop="true" class="galleryitem grid-25 mobile-grid-50">
                        <div>
                            <figure class="figure">
                                <img src="img/gallery/09.jpg" alt="">
                            </figure>
                            <figure class="figure">
                                <img src="img/gallery/04.jpg" alt="">
                            </figure>
                            <figure class="figure">
                                <img src="img/gallery/10.jpg" alt="">
                            </figure>
                            <figure class="figure">
                                <img src="img/gallery/09.jpg" alt="">
                            </figure>
                        </div>
                    </div>
                    <div current-page="0" canloop="true" class="galleryitem grid-25 mobile-grid-50">
                        <div>
                            <figure class="figure">
                                <img src="img/gallery/11.jpg" alt="">
                            </figure>
                            <figure class="figure">
                                <img src="img/gallery/08.jpg" alt="">
                            </figure>
                            <figure class="figure">
                                <img src="img/gallery/12.jpg" alt="">
                            </figure>
                            <figure class="figure">
                                <img src="img/gallery/11.jpg" alt="">
                            </figure>
                        </div>
                    </div>
                    <div current-page="0" canloop="true" class="galleryitem grid-25 mobile-grid-50">
                        <div>
                            <figure class="figure">
                                <img src="img/gallery/07.jpg" alt="">
                            </figure>
                            <figure class="figure">
                                <img src="img/gallery/01.jpg" alt="">
                            </figure>
                            <figure class="figure">
                                <img src="img/gallery/02.jpg" alt="">
                            </figure>
                            <figure class="figure">
                                <img src="img/gallery/07.jpg" alt="">
                            </figure>
                        </div>
                    </div>
                    <div current-page="0" canloop="true" class="galleryitem grid-25 mobile-grid-50">
                        <div>
                            <figure class="figure">
                                <img src="img/gallery/09.jpg" alt="">
                            </figure>
                            <figure class="figure">
                                <img src="img/gallery/08.jpg" alt="">
                            </figure>
                            <figure class="figure">
                                <img src="img/gallery/10.jpg" alt="">
                            </figure>
                            <figure class="figure">
                                <img src="img/gallery/09.jpg" alt="">
                            </figure>
                        </div>
                    </div>
                    <div current-page="0" canloop="true" class="galleryitem grid-25 mobile-grid-50">
                        <div>
                            <figure class="figure">
                                <img src="img/gallery/01.jpg" alt="">
                            </figure>
                            <figure class="figure">
                                <img src="img/gallery/11.jpg" alt="">
                            </figure>
                            <figure class="figure">
                                <img src="img/gallery/02.jpg" alt="">
                            </figure>
                            <figure class="figure">
                                <img src="img/gallery/01.jpg" alt="">
                            </figure>
                        </div>
                    </div>
                    <div current-page="0" canloop="true" class="galleryitem grid-25 mobile-grid-50">
                        <div>
                            <figure class="figure">
                                <img src="img/gallery/03.jpg" alt="">
                            </figure>
                            <figure class="figure">
                                <img src="img/gallery/02.jpg" alt="">
                            </figure>
                            <figure class="figure">
                                <img src="img/gallery/04.jpg" alt="">
                            </figure>
                            <figure class="figure">
                                <img src="img/gallery/03.jpg" alt="">
                            </figure>
                        </div>
                    </div>
                    <div current-page="0" canloop="true" class="galleryitem grid-25 mobile-grid-50">
                        <div>
                            <figure class="figure">
                                <img src="img/gallery/05.jpg" alt="">
                            </figure>
                            <figure class="figure">
                                <img src="img/gallery/06.jpg" alt="">
                            </figure>
                            <figure class="figure">
                                <img src="img/gallery/03.jpg" alt="">
                            </figure>
                            <figure class="figure">
                                <img src="img/gallery/05.jpg" alt="">
                            </figure>
                        </div>
                    </div>
                    <div current-page="0" canloop="true" class="galleryitem grid-25 mobile-grid-50">
                        <div>
                            <figure class="figure">
                                <img src="img/gallery/07.jpg" alt="">
                            </figure>
                            <figure class="figure">
                                <img src="img/gallery/08.jpg" alt="">
                            </figure>
                            <figure class="figure">
                                <img src="img/gallery/06.jpg" alt="">
                            </figure>
                            <figure class="figure">
                                <img src="img/gallery/07.jpg" alt="">
                            </figure>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <div style="display:none;">
            <?php
                for($i = 1; $i<50; $i++){
                    echo '<img src="img/rabbit/'.$i.'.png">';
                }
            ?>
        </div>

        <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
        <script type="text/javascript">window.jQuery || document.write('<script type="text/javascript" src="js/vendor/jquery-1.9.1.min.js"><\/script>')</script>

        <script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/gsap/1.9.8/TweenMax.min.js"></script>
        <script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/gsap/1.9.8/jquery.gsap.min.js"></script>
        <script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/gsap/1.9.8/plugins/CSSRulePlugin.min.js"></script>
        <script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/gsap/1.9.8/plugins/EaselPlugin.min.js"></script>
        
        <script type="text/javascript" src="js/plugins.js"></script>
        <script type="text/javascript" src="js/vendor/jquery.inview.min.js"></script>
        <script type="text/javascript" src="js/vendor/video.js"></script>
        <script type="text/javascript" src="js/vendor/conditionizr.min.js"></script>
        <script type="text/javascript" src="js/vendor/sammyjs.js" type="text/javascript"></script>
        <script type="text/javascript" src="js/main.js"></script>
        <script type="text/javascript" src="js/Freedo_Tall_400.font.js"></script>
    </body>
</html>