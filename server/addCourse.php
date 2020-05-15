<?php
header("Content-type:application/json;charset=utf-8");
require("_libreria.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    //controllo parametri
    _checkSession("id");

    if (!isset($_POST["nome"])){
        http_response_code(422);
        die("Parametro mancante.");
    }

    $con = _connection("clashroom");
    $nome = $con->real_escape_string($_POST["nome"]);

    $sql = "SELECT * FROM user WHERE id='".$_SESSION["id"]."';";
    $data = _eseguiQuery($con, $sql)[0];
    if($data["st"]!="0"){
        http_response_code(401);
        die("Solo i teacher possono creare i corsi");
    }
    $nomeT=$data["cognome"]." ".$data["nome"];

    $sql = "INSERT INTO courses (nome,creatorId) VALUES ('$nome',".$_SESSION["id"].");";
    $data = _eseguiQuery($con, $sql);

    if (!$data) {
        http_response_code(401);
        die("errore");
    } else {
        $sql = "SELECT max(id) FROM courses;";
        $data = _eseguiQuery($con, $sql);
        $data["creatorId"]=$nomeT;
        echo json_encode($data[0]);
    }
    $con->close();
}
