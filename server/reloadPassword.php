<?php

use PHPMailer\PHPMailer\PHPMailer;

header("Content-type:application/json;charset=utf-8");
require("_libreria.php");
require("PHPMailer-master/src/Exception.php");
require("PHPMailer-master/src/PHPMailer.php");
require("PHPMailer-master/src/SMTP.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    //controllo parametri
    if (!isset($_POST["email"])) {
        http_response_code(422);
        die("Parametro mancante.");
    }

    $con = _connection("clashroom");
    $email = $con->real_escape_string($_POST["email"]);
    $newPassword = md5(_randomPassword());

    $data = _eseguiQuery($con, "UPDATE user SET password='$newPassword' WHERE email='$email'");

    $mail = new PHPMailer();
    // Indica a PHPMailer di utilizzare la classe SMTP
    $mail->isSMTP();
    $mail->SMTPDebug = 2;
    $mail->Debugoutput = 'html'; // formato di visualizzazione dell'output
    $mail->Host = "smtp.gmail.com";
    $mail->SMTPSecure = 'tls'; // Options: '', 'ssl' or 'tls'
    $mail->Port = 587;
    $mail->SMTPOptions = array(
        'ssl' => array(
            'verify_peer' => false, // peer = certificato
            'verify_peer_name' => false, // inutile
            'allow_self_signed' => true // inutile
        )
    );
    $mail->SMTPAuth = true; // abilitazione al controllo delle credenziali
    $mail->Username = "a.bongioanni.0746@vallauri.edu";
    $mail->Password = "#Shestani01!";
    $mail->setFrom("a.bongioanni.0746@gmail.com");
    $mail->addAddress($email);
    $mail->Subject = 'Recupero password';
    $mail->Body = 'Here is your brand new password!<br><b>$newPassword</b>';
    $mail->isHTML(true); // Set email format to HTML
    if (!$mail->send())
        echo "Mailer Error -> " . $mail->ErrorInfo;
    else
        echo json_encode(array("ris" => "ok"));
    $con->close();
}
