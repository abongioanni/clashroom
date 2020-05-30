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

if(!_sendMail("bongioanni.clashroom@gmail.com", "foo1234?", $email, "Password recovery", "<h1>Reset password</h1>Here's the link to <a href='http://localhost/4B/progetto-abongioanni/resetPassword.php'>reset</a> your password!"))
    echo "Mailer Error";
else
    echo json_encode(array("ris" => "ok"));
$con->close();
