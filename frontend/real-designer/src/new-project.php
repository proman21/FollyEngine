 <?php
 	header("Access-Control-Allow-Origin: *");
	header('Access-Control-Allow-Headers: X-Requested-With');
    
	include('database_connect.php');
	
	// Create database connection object
    $db = new DatabaseConnection();

    $userEmail = mysqli_real_escape_string($db->con, $_POST["email"]);
    $projectName = mysqli_real_escape_string($db->con, $_POST["project"]);
	
	$db->prepared_query("INSERT INTO projects (email, name, entities, components) VALUES(?, ?, '{}', '{}')", "ss", $userEmail, $projectName);

    $db->disconnect();
?>