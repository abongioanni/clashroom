<?php
	//LIBRERIA CONTENENTE METODI GENERICI PER L'INTERAZIONECON IL DB
    
	define ("SCADENZA", 600);// tempo espresso in secondi
	
	function _connection($dbName){//FUNZIONE PER STABILIRE LA CONNESSIONE AL DB
		define('DBHOST', 'localhost');
		define('DBUSER', 'root');
		define('DBPASS', '');
		mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
		try
		{
			$con = new mysqli(DBHOST, DBUSER, DBPASS, $dbName);
			$con->set_charset("utf8");
			return $con;
		}
		catch (mysqli_sql_exception $ex)
		{
			http_response_code(503);
			die ("Errore connessione db: " . $ex->getMessage());
		}
	}

	function _randomPassword() {//GENERA UNA PASSWORD RANDOM (STACK OVERFLOW) NON UTILIZZATA
		$alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
		$pass = array(); 
		$alphaLength = strlen($alphabet) - 1;
		for ($i = 0; $i < 8; $i++) {
			$n = rand(0, $alphaLength);
			$pass[] = $alphabet[$n];
		}
		return implode($pass); 
	}

	function _eseguiQuery($con, $sql){//FUNZIONE PER L'ESECUZIONE DI QUERY (RITORNA UN ARRAY DI JSON)
		try{
			$rs=$con->query($sql);
		}
		catch (mysqli_sql_exception $ex)
		{  
			$con->close();
			http_response_code(500);
			die($ex->getMessage());
		}

		if(!is_bool($rs))
			$data=$rs->fetch_all(MYSQLI_ASSOC);
		else
			$data=$rs;
		return $data;
	}	

	
	function _checkSession($key){
		session_start();
		if (!isset($_SESSION[$key]))//SESSIONE INESISTENTE
		{			
			http_response_code(403);
			header("Location: ./login.html");
			die("Sessione scaduta");
		}
		else if (!isset($_SESSION["scadenza"]) || time() > $_SESSION["scadenza"] )//SESSIONE SCADUTA
		{
			_terminateSession();
		}
		else{//AGGIORNAMENTO COOKIE
			$_SESSION["scadenza"] = time() + SCADENZA;
			setcookie(session_name(), session_id(), $_SESSION["scadenza"], "/");
		}		
	}

	function _terminateSession(){//FUNZIONE PER TERMINARE LA SESSIONE E CANCELLARE I COOKIE
		session_unset();
		session_destroy();
		http_response_code(403);
		header("Location: ./login.html");
		die("Sessione scaduta");
	}
?>