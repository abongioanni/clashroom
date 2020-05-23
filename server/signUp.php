<?php

//REGISTRAZIONE NUOVO UTENTE

header("Content-type:application/json;charset=utf-8");
require("_libreria.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
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

    //PARAMETRI:
    //- EMAIL
    //- PASSWORD
    //- COGNOME
    //- NOME
    //- STUDENTE/INSEGNANTE

    $con = _connection("clashroom");
    $email = $con->real_escape_string($_POST["email"]);
    $password = $con->real_escape_string($_POST["password"]);
    $cognome = $con->real_escape_string($_POST["cognome"]);
    $nome = $con->real_escape_string($_POST["nome"]);
    $st = $con->real_escape_string($_POST["st"]);

    //CONTROLLO CHE LA MAIL NON SIA GIA' STATA REGISTRATA
    $sql = "SELECT * FROM user WHERE email='$email';";
    $data = _eseguiQuery($con, $sql);
    if (count($data) != 0) {
        http_response_code(401);
        die("Email già registrata!");
    }

    //INSERIMENTO
    $sql = "INSERT INTO user (email,nome,cognome,password,st) VALUES ('$email','$nome','$cognome','$password','$st');";
    $data = _eseguiQuery($con, $sql);
    if (!$data) {
        http_response_code(401);
        die("errore");
    } else {
        $sql = "SELECT * FROM user WHERE email='$email';";
        $data = _eseguiQuery($con, $sql);
        //SETTO IL COOKIE
        session_start();
        $_SESSION["user"] = $data[0];
        $_SESSION["scadenza"] = time() + SCADENZA;
        setcookie(session_name(), session_id(), $_SESSION["scadenza"], "/");

        echo json_encode(array("ris" => "ok"));
    }
    $con->close();
}
