<?php
header("Content-type:application/json;charset=utf-8");
require("_libreria.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    //controllo parametri
    if (!isset($_POST["email"])) {
        http_response_code(422);
        die("Parametro mancante.");
    }

    $con = _connection("clashroom");
    $email = $con->real_escape_string($_POST["email"]);

    $data = _eseguiQuery($con, "SELECT password FROM user WHERE email='$email';")[0];

    $to      = $email;
    $subject = 'Password recovery';
    $message = "Here there is your forgotten password!". $data[0];
    $headers = 'From: a.bongioanni.0746@vallauri.edu' . "\r\n" .
        'Reply-To: a.bongioanni.0746@vallauri.edu' . "\r\n" .
        'X-Mailer: PHP/' . phpversion();

    mail($to, $subject, $message, $headers);
    $con->close();
}
