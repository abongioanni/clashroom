<?php

//VIENE INVIATA UNA MAIL CONTENENTE UN LINK PER LA PAGINA DOVE REIMPOSTARELA PASSWORD

use PHPMailer\PHPMailer\PHPMailer;

header("Content-type:application/json;charset=utf-8");
require("_libreria.php");
require("PHPMailer-master/src/Exception.php");
require("PHPMailer-master/src/PHPMailer.php");
require("PHPMailer-master/src/SMTP.php");

if (!isset($_REQUEST["email"])) {
    http_response_code(422);
    die("Parametro mancante.");
}
$con = _connection("clashroom");
$email = $con->real_escape_string($_REQUEST["email"]);

//VIENE IMPOSTATO UN COOKIE CHE IMPOSTA IL TEMPO IN CUI L'UTENTE PUO' CAMBIARE LA PASSWORD
$user = _eseguiQuery($con, "SELECT * FROM user WHERE email='$email';")[0];
session_start();
$_SESSION["user"] = $user;
$_SESSION["scadenza"] = time() + SCADENZA;
setcookie(session_name(), session_id(), $_SESSION["scadenza"], "/");

//VIENE CREATO L'OGGETTO MAIL
$mail = new PHPMailer();
$mail->isSMTP();
$mail->SMTPDebug = 2;
$mail->Debugoutput = 'html';
$mail->Host = "smtp.gmail.com";
$mail->SMTPSecure = 'tls';
$mail->Port = 587;
$mail->SMTPOptions = array(
    'ssl' => array(
        'verify_peer' => false,
        'verify_peer_name' => false,
        'allow_self_signed' => true
    )
);
$mail->SMTPAuth = true;
//MAIL IN COMUNE CON GROSSO
$mail->Username = "bongioanni.clashroom@gmail.com";
$mail->Password = "foo1234?";
$mail->setFrom("bongioanni.clashroom@gmail.com");
$mail->addAddress($email);
$mail->Subject = 'Password recovery';
$mail->Body = "<h1>Reset password</h1>Here's the link to <a href='http://localhost/4B/progetto-abongioanni/resetPassword.php'>reset</a> your password!";
$mail->isHTML(true);
if (!$mail->send()) //INVIO MAIL
    echo "Mailer Error -> " . $mail->ErrorInfo;
else
    echo json_encode(array("ris" => "ok"));
$con->close();
