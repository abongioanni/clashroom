<?php

//MI RICAVO UN JSON CON TUTTI GLI EVENTI E I DATI DEGLI INSEGNANTI RELATIVI

header("Content-type:application/json;charset=utf-8");
require("_libreria.php");

_checkSession("user");

$con = _connection("clashroom");
$user=$_SESSION["user"];

$data=array();
if($user["st"]!="0"){//SONO UNO STUDENTE
    $sql = "SELECT * FROM studsub AS s,events AS e WHERE s.studId=" . $user["id"] . " AND s.courseId=e.courseId;";
    $v=_eseguiQuery($con, $sql);
    for($i=0;$i<count($v);$i++){
        array_push($data,$v[$i]);
    }
}
else{//SONO UN'INSEGNANTE
    $sql = "SELECT * FROM events WHERE teacherId=" . $user["id"] . ";";
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
