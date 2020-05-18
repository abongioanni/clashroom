<?php
header("Content-type:application/json;charset=utf-8");
require("_libreria.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    //controllo parametri
    _checkSession("id");

    if (!isset($_POST["id"])){
        http_response_code(422);
        die("Parametro mancante.");
    }

    $con = _connection("clashroom");
    $id = $con->real_escape_string($_POST["id"]);

    $sql = "SELECT * FROM user WHERE id='".$_SESSION["id"]."';";
    $data = _eseguiQuery($con, $sql)[0];
    if($data["st"]=="0"){
        http_response_code(401);
        die("Solo gli studenti si possono iscrivere ai corsi");
    }

    $sql = "INSERT INTO studsub (studId,courseId) VALUES (".$_SESSION["id"].",$id);";
    $data = _eseguiQuery($con, $sql);

    if (!$data) {
        http_response_code(401);
        die("ti sei già iscritto a questo corso");
    }
    else
        echo json_encode(array("ris"=>"ok"));
    $con->close();
}