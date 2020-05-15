<?php
header("Content-type:application/json;charset=utf-8");
require("_libreria.php");

_checkSession("id");

$con = _connection("clashroom");
$sql = "SELECT * FROM courses WHERE creatorId=" . ($_SESSION['id']) . ";";

echo json_encode(_eseguiQuery($con, $sql));
$con->close();
