<?php

//AGGIUNTA CORSO

header("Content-type:application/json;charset=utf-8");
require("_libreria.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    _checkSession("user");//CONTROLLO SESSIONE

    if (!isset($_POST["nome"])){
        http_response_code(422);
        die("Parametro mancante.");
    }
    //PARAMETRI
    //- NOME CORSO

    $con = _connection("clashroom");
    $nome = $con->real_escape_string($_POST["nome"]);
    $user=$_SESSION["user"];

    //CONTROLLO SE L'UTENTE CHE HA INSERITO IL NUOVO CORSO E' UNO STUDENTE  
    if($user["st"]!="0"){
        http_response_code(401);
        die("Solo i teacher possono creare i corsi");
    }

    //INSERISCO UN NUOVO CORSO
    $nomeT=$user["cognome"]." ".$user["nome"];
    $sql = "INSERT INTO courses (nome,creatorId) VALUES ('$nome',".$user["id"].");";
    $data = _eseguiQuery($con, $sql);

    if (!$data) {
        http_response_code(401);    //ERRORE NELLA QUERY
        die("errore");
    } else {
        $sql = "SELECT * FROM courses WHERE id=(SELECT max(id) FROM courses);";  //RITORNO IL CORSO APPENA INSERITO
        $data = _eseguiQuery($con, $sql);
        $data["creatorId"]=$nomeT;
        echo json_encode($data[0]);
    }
    $con->close();
}
