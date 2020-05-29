<?php
header("Content-type:application/json;charset=utf-8");
require("_libreria.php");

_checkSession("user");

if (!isset($_REQUEST["eventId"])) {
	http_response_code(422);
	die("Parametro mancante.");
}

$user = $_SESSION["user"];

//PARAMETRI:
//- ID EVENTO

if ($user["st"] != "0") {//SOLTANTO GLI INSEGNANTI POSSONO ELIMINARE EVENTI
	http_response_code(401);
	die("Solo i teacher possono creare gli eventi");
}
$con = _connection("clashroom");
$eventId = $con->real_escape_string($_REQUEST["eventId"]);
$user = $_SESSION["user"];
$id = $user["id"];

if (_eseguiQuery($con, "DELETE FROM events WHERE id=$eventId")) { //ELIMINO L'EVENTO
	echo json_encode(array("ris" => "ok"));
}

$con->close();
