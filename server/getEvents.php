<?php
header("Content-type:application/json;charset=utf-8");
require("_libreria.php");

_checkSession("id");

$con = _connection("clashroom");

$sql = "SELECT * FROM user WHERE id=" . $_SESSION["id"] . ";";
$us = _eseguiQuery($con, $sql)[0];
$data=array();
if($us["st"]!="0"){//sono uno studente
    $sql = "SELECT * FROM studsub AS s,events AS e WHERE s.studId=" . $_SESSION["id"] . " AND s.courseId=e.courseId;";
    $v=_eseguiQuery($con, $sql);
    for($i=0;$i<count($v);$i++){
        array_push($data,$v[$i]);
    }
}
else{
    $sql = "SELECT * FROM events WHERE teacherId=" . $_SESSION["id"] . ";";
    $data=_eseguiQuery($con, $sql);
}
$t=array();
for($i=0;$i<count($data);$i++){
    $data[$i]["courseId"]=_eseguiQuery($con,"SELECT nome FROM courses WHERE id=".$data[$i]["courseId"].";")[0]["nome"];
    array_push($t,_eseguiQuery($con, "SELECT nome,cognome FROM user WHERE id='".$data[$i]["teacherId"]."';")[0]);
}
echo json_encode(array(
    "data"=>$data,
    "teachers"=>$t
));
$con->close();
