<?php
header("Content-type:application/json;charset=utf-8");
require("_libreria.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    //controllo parametri
    if (
        !isset($_POST["email"]) ||
        !isset($_POST["password"]) ||
        !isset($_POST["cognome"]) ||
        !isset($_POST["nome"]) ||
        !isset($_POST["st"])
    ) {

        http_response_code(422);
        die("Parametro mancante.");
    }

    $con = _connection("clashroom");
    $email = $con->real_escape_string($_POST["email"]);
    $password = $con->real_escape_string($_POST["password"]);
    $cognome = $con->real_escape_string($_POST["cognome"]);
    $nome = $con->real_escape_string($_POST["nome"]);
    $st = $con->real_escape_string($_POST["st"]);

    $sql = "SELECT * FROM user WHERE email='$email';";
    $data = _eseguiQuery($con, $sql);
    if (count($data) != 0) {
        http_response_code(401);
        die("Email già registrata!");
    }

    $sql = "INSERT INTO user (email,nome,cognome,password,foto,st) VALUES ('$email','$nome','$cognome','$password','','$st');";
    $data = _eseguiQuery($con, $sql);
    if (!$data) {
        http_response_code(401);
        die("errore");
    } else {
        $sql = "SELECT * FROM user WHERE email='$email';";
        $data = _eseguiQuery($con, $sql);
        session_start();
        $_SESSION["id"] = $data[0]["id"];
        $_SESSION["scadenza"] = time() + SCADENZA;
        setcookie(session_name(), session_id(), $_SESSION["scadenza"], "/");

        echo json_encode(array("ris" => "ok"));
    }
    $con->close();
}
