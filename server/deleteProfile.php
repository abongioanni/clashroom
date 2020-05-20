<?php
header("Content-type:application/json;charset=utf-8");
require("_libreria.php");

_checkSession("id");

$con = _connection("clashroom");
$id = $_SESSION["id"];

$sql = "SELECT * FROM user WHERE id=$id;";
$data = _eseguiQuery($con, $sql)[0];

if ($data["st"] != "0") { //sono uno studente
    _eseguiQuery($con, "DELETE FROM studsub WHERE studid=$id");
}
else{
    $data=_eseguiQuery($con, "SELECT * FROM courses WHERE creatorId=$id");
    for($i=0;$i<count($data);$i++){
        _eseguiQuery($con, "DELETE FROM events WHERE courseId=".$data[$i]["id"].";");
        _eseguiQuery($con, "DELETE FROM studSub WHERE courseId=".$data[$i]["id"].";");
    }
    _eseguiQuery($con, "DELETE FROM courses WHERE creatorid=$id");
}
_eseguiQuery($con, "DELETE FROM user WHERE id=$id");
_terminateSession();
$con->close();
