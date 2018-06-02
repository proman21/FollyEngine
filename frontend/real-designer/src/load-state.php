<?php
 	header("Access-Control-Allow-Origin: *");
	header('Access-Control-Allow-Headers: X-Requested-With');
    
	include('database_connect.php');
	
	// Create database connection object
    $db = new DatabaseConnection();

    $userEmail = mysqli_real_escape_string($db->con, $_GET["email"]);
    $projectName = mysqli_real_escape_string($db->con, $_GET["project"]);
	
	$result = $db->prepared_query("SELECT entities, components FROM projects WHERE projects.email = ? AND projects.name = ?", "ss", $userEmail, $projectName);
    $row = $result->fetch_array(MYSQLI_NUM);
	
    echo "{\"entities\": " . $row[0] . ", \"components\": " . $row[1] . "}";

    $db->disconnect();
?>