<?php
if(isset($_POST['message'])){
    $to      = 'ehospitalon@gmail.com';
    $subject = $_POST['subject'];
    $message ="Name:". $_POST['name']. "<br/><br/>". "Email:" .$_POST['email']. "<br/><br/>". "Phone:" .$_POST['phone']. "<br/><br/>". "Budget:" .$_POST['budget']."<br/><br/>". "Message:" .$_POST['message'];
    $headers = "From: ".$_POST['sender_nam‌​e​']." <".$_POST['sender_em‌​ail‌​']."<br/><br/>"; $headers = "Reply-To: ".$_POST['sender_ema‌​il‌​']."<br/><br/>";
    $headers = "Content-type: text/html; charset=iso-8859-1\r\n";
    'X-Mailer: PHP/' . phpversion();
    if(mail($to, $subject, $message, $headers)) echo json_encode(['success'=>true]);
    else echo json_encode(['success'=>false]);
    exit;
 }
?>