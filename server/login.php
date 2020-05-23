<?php

//CONTROLLO LOGIN

header("Content-type:application/json;charset=utf-8");
require("_libreria.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    //controllo parametri
    if (!isset($_POST["email"]) || !isset($_POST["password"])) {
        http_response_code(422);
        die("Parametro mancante.");
    }

    //PARAMETRI:
    //- EMAIL
    //- PASSWORD

    $con = _connection("clashroom");
    $email = $con->real_escape_string($_POST["email"]);
    $password = $con->real_escape_string($_POST["password"]);

    $sql = "SELECT * FROM user WHERE email='$email';";
    $data = _eseguiQuery($con, $sql);
    if (count($data) == 0) {//CONTROLLO SE LA MAIL ESISTE (UTENTE NON REGISTRATO)
        http_response_code(401);
        die("email insistente");
    } else {
        if ($data[0]["password"] == $password) {//CONTROLLO SE LA PASSWORD E' CORRETTA
            //SETTO IL COOKIE
            session_start();
            $_SESSION["user"]=$data[0];
            $_SESSION["scadenza"]=time()+SCADENZA;
            setcookie(session_name(), session_id(), $_SESSION["scadenza"], "/");

            echo json_encode(array("ris"=>"ok"));
        } else {
            http_response_code(401);
            die("Password errata");
        }
    }
    $con->close();
}?>
