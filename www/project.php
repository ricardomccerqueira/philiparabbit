<?php
    error_reporting(0);
    require_once('services/projects.php');

    $id     = $_GET["p"];
    $detail = $projects[$id]['detail'];
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <!-- for Google -->
        <meta name="description" content="<?php echo $projects[$id]['title']; ?>" />
        <meta name="keywords" content="Designer Portfolio Design Web Graphic" />

        <meta name="author" content="Philipa Rabbit, Ricardo Cerqueira" />
        <meta name="copyright" content="" />
        <meta name="application-name" content="Philipa Rabbit Web Site" />

        <!-- for Facebook -->          
        <meta property="og:title" content="Philipa Rabbit" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="img/<?php echo $detail['path'].$detail['picture']; ?>.png" />
        <meta property="og:url" content="" />
        <meta property="og:description" content="<?php echo $projects[$id]['title']; ?>" />

        <!-- for Twitter -->          
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Philipa Rabbit" />
        <meta name="twitter:description" content="<?php echo $projects[$id]['title']; ?>" />
        <meta name="twitter:image" content="img/<?php echo $detail['path'].$detail['picture']; ?>.png" />

        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title><?php echo $projects[$id]['title']; ?> by Philipa Rabbit Design</title>
        <meta name="viewport" content="width=device-width">

        <link rel="stylesheet" href="css/normalize.min.css">
        <link rel="stylesheet" href="css/main.css">
        <link rel="stylesheet" type="text/css" href="css/unsemantic-grid-responsive.css">
        <link href='http://fonts.googleapis.com/css?family=Amatic+SC:400,700' rel='stylesheet' type='text/css'>
        
        <link href="http://vjs.zencdn.net/4.1/video-js.css" rel="stylesheet">
        <script src="http://vjs.zencdn.net/4.1/video.js"></script>
        <style type="text/css">
          .vjs-default-skin { color: #ffffff }
          .vjs-play-progress, .vjs-volume-level { background-color: #347b48 }
          .vjs-control-bar, .vjs-big-play-button { background: rgba(81,202,152,0.7) }
          .vjs-slider { background: rgba(81,202,152,0.2333333333333333) }
        </style>

        <script src="js/vendor/modernizr-2.6.2-respond-1.1.0.min.js"></script>
    </head>
    <body class="intro" style="background-color:<?php echo $detail['main_background']['color']?>;">
        <!--[if lte IE 7]>
            <p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
        <![endif]-->
        
        <div id="project_closeButton">
            <a href="/#/projects">
                <img src="img/project_closeButton.png" alt="">
            </a>
        </div>
        <div id="main-wrapper" style="width:100%;">
            <section style="background-color:<?php echo $detail['main_background']['color']?>; background-image:url(img/<?php echo $detail['path'].$detail['main_background']['image']?>);" id="projectHome" aimWidth="1758" aimHeight="990" class="section innerpage">
                <div id="homewrapper" class="grid-container">
                    <div class="grid-100 projectPic">
                        <div class="grid-60 push-25">
                            <figure class="grid-50">
                                <img src="img/<?php echo $detail['path'].$detail['picture']; ?>.png" alt="">
                            </figure>
                        </div>
                    </div>
                    <div class="grid-100">
                        <div class="grid-80 push-10">
                            <div class="grid-40 left-container">
                                <?php
                                    for($i=0; $i<count($detail['leftSide']); $i++):
                                ?>
                                <article>
                                    <?php
                                        if($detail['leftSide'][$i]['title']!=""):
                                    ?>
                                        <h1>
                                            <?php echo $detail['leftSide'][$i]['title']; ?>
                                        </h1>
                                    <?php
                                        endif;

                                        if($detail['leftSide'][$i]['description']!=""):
                                    ?>
                                        <p>
                                            <?php echo $detail['leftSide'][$i]['description']; ?>
                                        </p>
                                    <?php
                                        endif;
                                    ?>
                                </article>
                                <?php
                                    endfor;
                                ?>
                            </div>
                            <div class="grid-55 right-container">
                                <?php
                                   for($i=0; $i<count($detail['rightSide']); $i++):
                                ?>
                                    <article>
                                        <h1>
                                            <span>
                                                <?php echo $detail['rightSide'][$i]['title']; ?>
                                                <img src="img/projects_underline.png" alt="">
                                            </span>
                                        </h1>
                                        <p>
                                            <?php echo $detail['rightSide'][$i]['description']; ?>
                                        </p>
                                    </article>
                                <?php
                                    endfor;
                                ?>
                            </div>
                        </div>
                    </div>
                </div>

                <button id="bt_scrolldown" class="hide-on-mobile">
                    <img src="img/scrollDown.png" alt="">
                </button>
            </section>

            <section id="sections">
                <?php
                   for($i=0; $i<count($detail['images']); $i++):

                        if(strpos($detail['images'][$i]['image'], 'mp4')):
                ?>
                        
                        <div class="videocontainer">
                            <div class="videoHolder" style="height:auto;">
                                <video class="video-js vjs-default-skin" controls preload="auto" data-setup="{}">
                                     <source src="img/<?php echo $detail['path'].$detail['images'][$i]['image']; ?>" type='video/mp4'>
                                </video>

                                <div class="videoShadow hide-on-mobile">
                                    <img src="img/videoShadow.png" alt="">
                                </div>
                            </div>
                        </div>
                <?php
                        else:
                ?>
                    <br>
                    <div style="max-width:<?php echo $detail['images'][$i]['max-width']; ?>" class="projectImageContainer">
                        <a class="addthis_button_pinterest_pinit" pi:pinit:media="http://www.philiparabbit.com/img/<?php echo $detail['path'].$detail['images'][$i]['image']; ?>"></a>
                        <br>
                        <img style="max-width:<?php echo $detail['images'][$i]['max-width']; ?>" src="img/<?php echo $detail['path'].$detail['images'][$i]['image']; ?>" alt="">
                    </div>
                <?php
                        endif;
                    endfor;
                ?>
            </section>

            <div id="socialitems">
                <!-- AddThis Button BEGIN -->
                <div class="addthis_toolbox addthis_default_style addthis_32x32_style">
                <a class="addthis_button_facebook"></a>
                <a class="addthis_button_twitter"></a>
                <a class="addthis_button_pinterest_share"></a>
                </div>
                <script type="text/javascript">var addthis_config = {"data_track_addressbar":true};</script>
                <script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5016bf1e082e63cc"></script>
                <!-- AddThis Button END -->
            </div>

            <button id="bt_scrollbackUp">
                <img src="img/backtotop_hover.png" alt="">
            </button>
        </div>

        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.9.1.min.js"><\/script>')</script>

        <script src="http://cdnjs.cloudflare.com/ajax/libs/gsap/1.9.8/TweenMax.min.js"></script>
        <script src="http://cdnjs.cloudflare.com/ajax/libs/gsap/1.9.8/jquery.gsap.min.js"></script>
        <script src="http://cdnjs.cloudflare.com/ajax/libs/gsap/1.9.8/plugins/CSSRulePlugin.min.js"></script>
        <script src="http://cdnjs.cloudflare.com/ajax/libs/gsap/1.9.8/plugins/EaselPlugin.min.js"></script>
        
        <script src="js/plugins.js"></script>
        <script src="js/vendor/jquery.inview.min.js"></script>
        <script src="js/vendor/conditionizr.min.js"></script>
        <script src="js/project.js"></script>
    </body>
</html>