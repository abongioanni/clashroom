<?php

//LOGOUT DALL'UTENTE (ELIMINAZIONE COOKIE)

header("Content-type:application/json;charset=utf-8");
require("_libreria.php");

_checkSession("user");
_terminateSession();
