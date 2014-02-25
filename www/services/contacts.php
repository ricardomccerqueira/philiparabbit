<?php
    $to      = 'philiparabbit@gmail.com';
    $subject = 'SITE PHILIPA RABBIT';
    
    $message = 'name: \r\n';
    $message.= $_POST['name'];
    $message.= '\r\n\r\n';
    $message.= 'email: \r\n';
    $message.= $_POST['email'];
    $message.= '\r\n\r\n';
    $message.= 'message: \r\n';
    $message.= $_POST['phrase'];


    $headers = 'From: mail@philiparabbit.com' . "\r\n" .
    'Reply-To: mail@philiparabbit.com' . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

    mail($to, $subject, $message, $headers);
?>