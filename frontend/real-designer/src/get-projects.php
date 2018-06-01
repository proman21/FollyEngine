<?php
 	header("Access-Control-Allow-Origin: *");
	header('Access-Control-Allow-Headers: X-Requested-With');
    
    include('database_connect.php');
	
	// Create database connection object
    $db = new DatabaseConnection();

    $userEmail = mysqli_real_escape_string($db->con, $_GET["email"]);
	$result = $db->prepared_query("SELECT name FROM projects WHERE projects.email = ?", "s", $userEmail);
	
    while ($row = $result->fetch_array(MYSQLI_NUM)) {
    	echo $row[0] . "\n";
	}

    $db->disconnect();
?>