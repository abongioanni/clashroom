<?php
header("Content-type:application/json;charset=utf-8");
require("_libreria.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    //controllo parametri
    _checkSession("id");

    if (!isset($_POST["argomento"]) ||
        !isset($_POST["do"]) ||
        !isset($_POST["courseId"])){
        http_response_code(422);
        die("Parametro mancante.");
    }

    $con = _connection("clashroom");
    $argomento = $con->real_escape_string($_POST["argomento"]);
    $do = $con->real_escape_string($_POST["do"]);
    $courseId = $con->real_escape_string($_POST["courseId"]);

    $sql = "SELECT * FROM user WHERE id='".$_SESSION["id"]."';";
    $data = _eseguiQuery($con, $sql)[0];
    if($data["st"]!="0"){
        http_response_code(401);
        die("Solo i teacher possono creare gli eventi");
    }
    $nomeT=$data["cognome"]." ".$data["nome"];

    $sql = "INSERT INTO events (argomento,do,teacherId,courseId) VALUES ('$argomento','$do',".$_SESSION["id"].",'$courseId');";
    $data = _eseguiQuery($con, $sql);

    if (!$data) {
        http_response_code(401);
        die("errore");
    } else {
        /*$sql = "SELECT max(id) FROM events;";
        $data = _eseguiQuery($con, $sql);
        $data["creatorId"]=$nomeT;
        echo json_encode($data[0]);*/
    }
    $con->close();
}
