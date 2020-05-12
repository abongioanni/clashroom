<?php
header("Content-type:application/json;charset=utf-8");
require("_libreria.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    //controllo parametri
    if (!isset($_POST["username"]) || !isset($_POST["password"])) {
        http_response_code(422);
        die("Parametro mancante.");
    }

    $con = _connection("clashroom");
    $username = $con->real_escape_string($_POST["username"]);
    $password = $con->real_escape_string($_POST["password"]);

    $sql = "SELECT * FROM Correntisti WHERE email='$email';";
    $data = _eseguiQuery($con, $sql);
    if (count($data) == 0) {
        http_response_code(401);
        die("Username inesistente");
    } else {
        if ($data[0]["password"] == $password) {
            $aus=array("ris"=>"ok");
            echo json_encode($aus);
        } else {
            http_response_code(401);
            die("Password errata");
        }
    }
    $con->close();
}?>
