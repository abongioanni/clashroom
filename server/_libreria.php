<?php
    
	define ("SCADENZA", 600);// tempo espresso in secondi
	
	function _connection($dbName){
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

	function _randomPassword() {
		$alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
		$pass = array(); //remember to declare $pass as an array
		$alphaLength = strlen($alphabet) - 1; //put the length -1 in cache
		for ($i = 0; $i < 8; $i++) {
			$n = rand(0, $alphaLength);
			$pass[] = $alphabet[$n];
		}
		return implode($pass); //turn the array into a string
	}

	function _eseguiQuery($con, $sql){
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
		if (!isset($_SESSION[$key]))
		{			
			// Il server NON può spedire una pagina HTML !!
			http_response_code(403);
			die("Sessione scaduta");
		}
		else if (!isset($_SESSION["scadenza"]) || time() > $_SESSION["scadenza"] )
		{
			_terminateSession();
		}
		else{
			$_SESSION["scadenza"] = time() + SCADENZA;
			// Salvo la sessione all'interno dei cookie
			setcookie(session_name(), session_id(), $_SESSION["scadenza"], "/");
		}		
	}

	function _terminateSession(){
		session_unset();
		session_destroy();
		http_response_code(403);
		die("Sessione scaduta");
	}
?>