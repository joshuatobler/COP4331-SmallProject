<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$email = $inData["email"];
	$password = $inData["password"];

	$conn = new mysqli("localhost", "admin", "admin", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = "SELECT * FROM user WHERE email='" . $email . "' and password='" . $password . "'";
		$result = $conn->query($sql);
		if ($result->num_rows > 0)
		{
			$row = $result->fetch_assoc();
			$firstname = $row["firstname"];
			$lastname = $row["lastname"];
			$id = $row["id"];
			
			returnWithInfo($firstname, $lastname, $id );
		}
		else
		{
			returnWithError($sql);
		}
		$conn->close();
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstname":"","lastname":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstname, $lastname, $id )
	{
		$retValue = '{"id":' . $id . ',"firstname":"' . $firstname . '","lastname":"' . $lastname . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
