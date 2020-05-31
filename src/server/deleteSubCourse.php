<?php
header("Content-type:application/json;charset=utf-8");
require("_libreria.php");

_checkSession("user");

if (!isset($_REQUEST["courseId"])) {
    http_response_code(422);
    die("Parametro mancante.");
}

//PARAMETRI:
//- ID CORSO

$con = _connection("clashroom");
$courseId = $con->real_escape_string($_REQUEST["courseId"]);
$user = $_SESSION["user"];
$id = $user["id"];

$data = _eseguiQuery($con, "SELECT * FROM events WHERE courseId=$courseId"); //ELIMINO L'ISCRIZIONE

if ($user["st"] != "0") { //SONO UNO STUDENTE
    _eseguiQuery($con, "DELETE FROM studsub WHERE courseId=$courseId AND studId=$id"); //ELIMINO L'UTENTE
} else {
    _eseguiQuery($con, "DELETE FROM events WHERE courseId=$courseId;"); //ELIMINO GLI EVENTI COLLEGATI
    _eseguiQuery($con, "DELETE FROM studSub WHERE courseId=$courseId;"); //ELIMINO LE ISCRIZIONI COLLEGATE AI CORSI
    _eseguiQuery($con, "DELETE FROM courses WHERE id=$courseId"); //ELIMINO I CORSO
}
echo json_encode($data);
$con->close();
