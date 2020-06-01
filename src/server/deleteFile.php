<?php

header("Content-type:application/json;charset=utf-8");
require("_libreria.php");

_checkSession("user");

if (!isset($_REQUEST["file"])) {
    http_response_code(422);
    die("Parametro mancante.");
}

unlink("../".$_REQUEST["file"]);
echo json_encode(array("ris"=>"ok"));
?>