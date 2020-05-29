<?php

//AGGIUNTA CORSO

header("Content-type:application/json;charset=utf-8");
require("_libreria.php");

_checkSession("user"); //CONTROLLO SESSIONE

if (!isset($_REQUEST["nome"])) {
    http_response_code(422);
    die("Parametro mancante.");
}
//PARAMETRI
//- NOME CORSO

$con = _connection("clashroom");
$nome = $con->real_escape_string($_REQUEST["nome"]);
$user = $_SESSION["user"];

//CONTROLLO SE L'UTENTE CHE HA INSERITO IL NUOVO CORSO E' UNO STUDENTE  
if ($user["st"] != "0") {
    http_response_code(401);
    die("Solo i teacher possono creare i corsi");
}

//INSERISCO UN NUOVO CORSO
$nomeT = $user["cognome"] . " " . $user["nome"];
$sql = "INSERT INTO courses (nome,creatorId) VALUES ('$nome'," . $user["id"] . ");";
$data = _eseguiQuery($con, $sql);

if (!$data) {
    http_response_code(401);    //ERRORE NELLA QUERY
    die("errore");
} else {
    $sql = "SELECT * FROM courses WHERE id=(SELECT max(id) FROM courses);";  //RITORNO IL CORSO APPENA INSERITO
    $data = _eseguiQuery($con, $sql)[0];
    $t=_eseguiQuery($con, "SELECT nome,cognome FROM user WHERE id='".$data["creatorId"]."';")[0];

    echo json_encode(array(
        "data"=>$data,
        "teachers"=>$t
    ));
}
$con->close();
