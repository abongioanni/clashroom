   	<?php

		//AGGIUNTA EVENTO

		header("Content-type:application/json;charset=utf-8");
		require("_libreria.php");

		_checkSession("user"); //CONTROLLO SESSIONE

		if (
			!isset($_REQUEST["argomento"]) ||
			!isset($_REQUEST["do"]) ||
			!isset($_REQUEST["courseId"])
		) {
			http_response_code(422);
			die("Parametro mancante.");
		}
		//PARAMETRI:
		//- ARGOMENTO
		//- DATA IMPEGNO
		//- ID CORSO
		//- EVENTUALI FILE

		$con = _connection("clashroom");
		$argomento = $con->real_escape_string($_REQUEST["argomento"]);
		$do = $con->real_escape_string($_REQUEST["do"]);
		$courseId = $con->real_escape_string($_REQUEST["courseId"]);
		$user = $_SESSION["user"];

		if ($user["st"] != "0") { //SOLTANTO GLI INSEGNANTI POSSONO CREARE EVENTI
			http_response_code(401);
			die("Solo i teacher possono creare gli eventi");
		}
		$nomeT = $user["cognome"] . " " . $user["nome"];

		$files = "";
		//CARICO I FILE
		if (isset($_FILES["files"])) {
			$dir = "uploads"; //CONTROLLO SE LA CARTELLA DEDICATA ALL'UTENTE ESESTE
			if (!file_exists($dir))
				mkdir($dir, 0777);
			$dir = $dir."/" . $user["email"];
			if (!file_exists($dir))
				mkdir($dir, 0777);
			$files = _getFiles($_FILES["files"], $dir)[0]["msg"];
		}

		//INSERISCO UN NUOVO EVENTO
		$sql = "INSERT INTO events (argomento,do,teacherId,courseId,download) VALUES ('$argomento','$do'," . $user["id"] . ",'$courseId','" . $files . "');";
		_eseguiQuery($con, $sql);

		$data = _eseguiQuery($con, "SELECT * FROM events WHERE id=(SELECT max(id) FROM events);")[0];
		$data["courseId"] = _eseguiQuery($con, "SELECT nome FROM courses WHERE id=" . $data["courseId"] . ";")[0]["nome"];
		echo json_encode(array(
			"data" => $data,
			"teachers" => _eseguiQuery($con, "SELECT * FROM user WHERE id='" . $user["id"] . "';")[0],
			"files" => $files
		));

		$con->close();
