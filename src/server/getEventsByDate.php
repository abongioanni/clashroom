<?php

//MI RICAVO UN JSON CON TUTTI GLI EVENTI E I DATI DEGLI INSEGNANTI RELATIVI

header("Content-type:application/json;charset=utf-8");
require("_libreria.php");

_checkSession("user");

if (!isset($_REQUEST["date"])) {
	http_response_code(422);
	die("Parametro mancante.");
}

$con = _connection("clashroom");
$user=$_SESSION["user"];
$date = $con->real_escape_string($_REQUEST["date"]);

$data=array();
if($user["st"]!="0"){//SONO UNO STUDENTE
    $sql = "SELECT * FROM studsub AS s,events AS e WHERE s.studId=" . $user["id"] . " AND s.courseId=e.courseId AND DATE(e.do)='$date';";
    $v=_eseguiQuery($con, $sql);
    for($i=0;$i<count($v);$i++){
        array_push($data,$v[$i]);
    }
}
else{//SONO UN'INSEGNANTE
    $sql = "SELECT * FROM events WHERE teacherId=" . $user["id"] . " AND DATE(do)='$date';";
    $data=_eseguiQuery($con, $sql);
}

$t=array();
for($i=0;$i<count($data);$i++){
    $data[$i]["courseId"]=_eseguiQuery($con,"SELECT nome FROM courses WHERE id=".$data[$i]["courseId"].";")[0]["nome"];
    array_push($t,_eseguiQuery($con, "SELECT nome,cognome FROM user WHERE id='".$data[$i]["teacherId"]."';")[0]);
}
echo json_encode(array(
    "data"=>$data,
    "teachers"=>$t,
));
$con->close();
