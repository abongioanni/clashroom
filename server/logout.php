<?php

//LOGOUT DALL'UTENTE (ELIMINAZIONE COOKIE)

header("Content-type:application/json;charset=utf-8");
require("_libreria.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    _checkSession("user");
    _terminateSession();
}