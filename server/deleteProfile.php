<?php
header("Content-type:application/json;charset=utf-8");
require("_libreria.php");

_checkSession("user");

$con = _connection("clashroom");
$user=$_SESSION["user"];
$id = $user["id"];

if ($user["st"] != "0") { //SONO UNO STUDENTE
    _eseguiQuery($con, "DELETE FROM studsub WHERE studid=$id");//ELIMINO L'ISCRIZIONE
}
else{//SONO UN INSEGNANTE
    $data=_eseguiQuery($con, "SELECT * FROM courses WHERE creatorId=$id");//RICAVO I CORSI
    for($i=0;$i<count($data);$i++){
        _eseguiQuery($con, "DELETE FROM events WHERE courseId=".$data[$i]["id"].";");//ELIMINO GLI EVENTI COLLEGATI
        _eseguiQuery($con, "DELETE FROM studSub WHERE courseId=".$data[$i]["id"].";");//ELIMINO LE ISCRIZIONI COLLEGATE AI CORSI
    }
    _eseguiQuery($con, "DELETE FROM courses WHERE creatorid=$id");//ELIMINO I CORSO
}
_eseguiQuery($con, "DELETE FROM user WHERE id=$id");//ELIMINO L'UTENTE
_terminateSession();
$con->close();
