<?php

//MI RICAVO UN JSON CON TUTTI I CORSI E I DATI DEGLI INSEGNANTI RELATIVI

header("Content-type:application/json;charset=utf-8");
require("_libreria.php");

_checkSession("user");

$con = _connection("clashroom");
$user=$_SESSION["user"];

if($user["st"]!="0"){//sono uno studente
    $sql = "SELECT * FROM studsub,courses AS c WHERE studId=" . $user["id"] . " AND courseId=c.id;";
}
else{
    $sql = "SELECT * FROM courses WHERE creatorId=" . $user["id"] . ";";
}

$data=_eseguiQuery($con, $sql);//DATI CORSI
$t=array();
for($i=0;$i<count($data);$i++){//PER OGNUNO MI RICAVO I DATI DELL'INSEGNANTE 
    array_push($t,_eseguiQuery($con, "SELECT nome,cognome FROM user WHERE id='".$data[$i]["creatorId"]."';")[0]);
}

echo json_encode(array(
    "data"=>$data,
    "teachers"=>$t
));
$con->close();
