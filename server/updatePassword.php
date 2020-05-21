<?php
header("Content-type:application/json;charset=utf-8");
require("_libreria.php");

_checkSession("email");


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    //controllo parametri
    if (!isset($_POST["password"])) {
        http_response_code(422);
        die("Parametro mancante.");
    }
    $con = _connection("clashroom");
    $password = $con->real_escape_string($_POST["password"]);

    if (_eseguiQuery($con, "UPDATE user SET password='".md5($password)."' WHERE email='" . $_SESSION["email"] . "';"))
        echo json_encode(array("ris" => "ok"));
    else
        echo "Mailer Error -> ";    
    _terminateSession();
    $con->close();
}
