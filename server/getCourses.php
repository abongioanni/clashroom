<?php
header("Content-type:application/json;charset=utf-8");
require("_libreria.php");

_checkSession("id");

$con = _connection("clashroom");

$sql = "SELECT * FROM user WHERE id=" . $_SESSION["id"] . ";";
$us = _eseguiQuery($con, $sql)[0];

if($us["st"]!="0"){//sono uno studente
    $sql = "SELECT * FROM studsub,courses AS c WHERE studId=" . $_SESSION["id"] . " AND courseId=c.id;";
}
else{
    $sql = "SELECT * FROM courses WHERE creatorId=" . $_SESSION["id"] . ";";
}
$data=_eseguiQuery($con, $sql);
$t=array();
for($i=0;$i<count($data);$i++){
    array_push($t,_eseguiQuery($con, "SELECT nome,cognome FROM user WHERE id='".$data[$i]["creatorId"]."';")[0]);
}
echo json_encode(array(
    "data"=>$data,
    "teachers"=>$t
));
$con->close();
