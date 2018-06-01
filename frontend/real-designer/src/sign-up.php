<?php
 	header("Access-Control-Allow-Origin: *");
	header('Access-Control-Allow-Headers: X-Requested-With');
	
   include('database_connect.php');
	
	// Create database connection object
    $db = new DatabaseConnection();
    
    $username = mysqli_real_escape_string($db->con, $_POST["name"]);
    $email = mysqli_real_escape_string($db->con, $_POST["email"]);
    $password = mysqli_real_escape_string($db->con, $_POST["password"]);
    // Hash the password
    $password = password_hash($password, PASSWORD_DEFAULT);

	$result = $db->prepared_query("SELECT `username` FROM `user` WHERE `email` = ?", "s", $email);
	$row = $result->fetch_array(MYSQLI_NUM)[0];
	
	// Couldn't find user in database, free to add
	if ($row == null) {
		$db->prepared_query("INSERT INTO user (username, email, password) VALUES(?, ?, ?)", "sss", $username, $email, $password);
    
    	echo 0;
    // User already exists
	} else {
		echo 1;
	}
    
?>