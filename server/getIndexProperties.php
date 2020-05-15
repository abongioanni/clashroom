<?php
header("Content-type:application/json;charset=utf-8");
require("_libreria.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    _checkSession("id");

    $con = _connection("clashroom");
    $sql = "SELECT * FROM user WHERE id='" . ($_SESSION['id']) . "';";
    $data = _eseguiQuery($con, $sql)[0];
    echo json_encode(array(
        "nome" => $data["nome"],
        "st"=>($data["st"])
    ));
    $con->close();
}
