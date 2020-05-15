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

    $sql = "INSERT INTO courses (nome,creatorId) VALUES ('$nome',".$_SESSION["id"].");";
    $data = _eseguiQuery($con, $sql);

    if (!$data) {
        http_response_code(401);
        die("errore");
    } else {
        $sql = "SELECT max(id) FROM courses;";
        $data = _eseguiQuery($con, $sql);
        echo json_encode(array("id" => $data[0]));
    }
    $con->close();
}
