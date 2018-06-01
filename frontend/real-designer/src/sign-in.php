<?php
 	header("Access-Control-Allow-Origin: *");
	header('Access-Control-Allow-Headers: X-Requested-With');
	
	include('database_connect.php');
	
	// Create database connection object
    $db = new DatabaseConnection();
    
    $userEmail = mysqli_real_escape_string($db->con, $_POST["email"]);
    $userPassword = mysqli_real_escape_string($db->con, $_POST["password"]);
	
	$result = $db->prepared_query("SELECT `username`, `password` FROM `user` WHERE `email`=?", "s", $userEmail);
	$row = $result->fetch_array(MYSQLI_NUM);
	$realPassword = $row[1];
	
	// Check the password
	if (password_verify($userPassword, $realPassword)) {
		echo json_encode($row[0]);
	} else {
		echo json_encode(null);
	}
    
    $db->disconnect();
?>