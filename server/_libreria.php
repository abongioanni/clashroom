                <?php
		//LIBRERIA CONTENENTE METODI GENERICI PER L'INTERAZIONECON IL DB

		define("SCADENZA", 3600);// tempo espresso in secondi
		use PHPMailer\PHPMailer\PHPMailer;

		function _connection($dbName)
		{//FUNZIONE PER STABILIRE LA CONNESSIONE AL DB
			define('DBHOST', 'localhost');
			define('DBUSER', 'root');
			define('DBPASS', '');
			mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
			try {
				$con = new mysqli(DBHOST, DBUSER, DBPASS, $dbName);
				$con->set_charset("utf8");
				return $con;
			} catch (mysqli_sql_exception $ex) {
				http_response_code(503);
				die("Errore connessione db: " . $ex->getMessage());
			}
		}

		function _randomPassword()
		{//GENERA UNA PASSWORD RANDOM (STACK OVERFLOW) NON UTILIZZATA
			$alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
			$pass = array();
			$alphaLength = strlen($alphabet) - 1;
			for ($i = 0; $i < 8; $i++) {
				$n = rand(0, $alphaLength);
				$pass[] = $alphabet[$n];
			}
			return implode($pass);
		}

		function _eseguiQuery($con, $sql)
		{//FUNZIONE PER L'ESECUZIONE DI QUERY (RITORNA UN ARRAY DI JSON)
			try {
				$rs = $con->query($sql);
			} catch (mysqli_sql_exception $ex) {
				$con->close();
				http_response_code(500);
				die($ex->getMessage());
			}

			if (!is_bool($rs))
				$data = $rs->fetch_all(MYSQLI_ASSOC);
			else
				$data = $rs;
			return $data;
		}


		function _checkSession($key)
		{
			session_start();
			if (!isset($_SESSION[$key]))//SESSIONE INESISTENTE
			{
				http_response_code(403);
				header("Location: ./login.html");
				die("Sessione scaduta");
			} else if (!isset($_SESSION["scadenza"]) || time() > $_SESSION["scadenza"])//SESSIONE SCADUTA
			{
				_terminateSession();
			} else {//AGGIORNAMENTO COOKIE
				$_SESSION["scadenza"] = time() + SCADENZA;
				setcookie(session_name(), session_id(), $_SESSION["scadenza"], "/");
			}
		}

		function _terminateSession()
		{//FUNZIONE PER TERMINARE LA SESSIONE E CANCELLARE I COOKIE
			session_unset();
			session_destroy();
			http_response_code(403);
			header("Location: ./login.html");
			die("Sessione scaduta");
		}

		function _sendMail($senderMail, $senderPwd, $destinationMail, $subject, $body)
		{
			require("PHPMailer-master/src/Exception.php");
			require("PHPMailer-master/src/PHPMailer.php");
			require("PHPMailer-master/src/SMTP.php");

			//VIENE CREATO L'OGGETTO MAIL
			$mail = new PHPMailer();
			$mail->isSMTP();
			$mail->SMTPDebug = 2;
			$mail->Debugoutput = 'html';
			$mail->Host = "smtp.gmail.com";
			$mail->SMTPSecure = 'tls';
			$mail->Port = 587;
			$mail->SMTPOptions = array(
				'ssl' => array(
					'verify_peer' => false,
					'verify_peer_name' => false,
					'allow_self_signed' => true
				)
			);
			$mail->SMTPAuth = true;
			//MAIL IN COMUNE CON GROSSO
			$mail->Username = $senderMail;
			$mail->Password = $senderPwd;
			$mail->setFrom($senderMail);
			$mail->addAddress($destinationMail);
			$mail->Subject = $subject;
			$mail->Body = $body;
			$mail->isHTML(true);
			return $mail->send(); //INVIO MAIL
		}

		function _getFiles($files)
		{
			$response = array();
			$overwrite = true;
			for ($i = 0; $i < count($files["name"]); $i++) {
				$record = array(); // json relativo al singolo file

				$filename = basename($files["name"][$i]);
				$size = $files["size"][$i];

				if ($size > 2000000) {  // max 2MB
					$record["ris"] = "NOK";
					$record["msg"] = "Il file $filename non è stato caricato eccede i 2MB";
					array_push($response, $record);
					continue;
				}

				$mimeType = $files["type"][$i];
				$ext = pathinfo($filename, PATHINFO_EXTENSION);

				$source_file = $files["tmp_name"][$i];
				$target_file = "uploads/$filename";
				if (file_exists($target_file)) {
					if ($overwrite == false) {
						$record["ris"] = "NOK";
						$record["msg"] = "Il file $filename esiste già e non può essere sovrascritto";
						array_push($response, $record);
						continue;
					}
				}

				if (move_uploaded_file($source_file, $target_file)) {
					$record["ris"] = "ok";
					$record["msg"] = "server/uploads/$filename";
				} else {
					$record["ris"] = "NOK";
					$record["msg"] = "Il file $filename è andato in errore di caricamento";
				}
				array_push($response, $record);
			}
			return $response;
		}
