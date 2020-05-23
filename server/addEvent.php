<?php

//AGGIUNTA EVENTO

header("Content-type:application/json;charset=utf-8");
require("_libreria.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    _checkSession("user");//CONTROLLO SESSIONE

    if (
        !isset($_POST["argomento"]) ||
        !isset($_POST["do"]) ||
        !isset($_POST["courseId"])
    ) {
        http_response_code(422);
        die("Parametro mancante.");
    }
    //PARAMETRI:
    //- ARGOMENTO
    //- DATA IMPEGNO
    //- ID CORSO

    $con = _connection("clashroom");
    $argomento = $con->real_escape_string($_POST["argomento"]);
    $do = $con->real_escape_string($_POST["do"]);
    $courseId = $con->real_escape_string($_POST["courseId"]);
    $user=$_SESSION["user"];

    if ($user["st"] != "0") {//SOLTANTO GLI INSEGNANTI POSSONO CREARE EVENTI
        http_response_code(401);
        die("Solo i teacher possono creare gli eventi");
    }
    $nomeT = $user["cognome"] . " " . $user["nome"];

    //INSERISCO UN NUOVO EVENTO
    $sql = "INSERT INTO events (argomento,do,teacherId,courseId) VALUES ('$argomento','$do'," . $user["id"] . ",'$courseId');";
    $data = _eseguiQuery($con, $sql);

    if (!$data) {
        http_response_code(401);
        die("errore");
    } else {    //ritorno un json con i dati dell'evento e dell'insegnante creatore
        $data=_eseguiQuery($con, "SELECT * FROM events WHERE id=(SELECT max(id) FROM events);")[0];
        $data["courseId"]=_eseguiQuery($con,"SELECT nome FROM courses WHERE id=".$data["courseId"].";")[0]["nome"];
        echo json_encode(array(
            "data" => $data,
            "teachers" => _eseguiQuery($con, "SELECT * FROM user WHERE id='" . $_SESSION["id"] . "';")[0]
        ));
    }
    $con->close();
}
