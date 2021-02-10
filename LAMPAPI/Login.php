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
		$sql = "SELECT ID,email,password FROM user WHERE Login='" . $inData["email"] . "' and Password='" . $inData["password"] . "'";
		$result = $conn->query($sql);
		if ($result->num_rows > 0)
		{
			$row = $result->fetch_assoc();
			$email = $row["email"];
			$password = $row["password"];
			$id = $row["ID"];
			
			returnWithInfo($email, $password, $id );
		}
		else
		{
			returnWithError( "No Records Found" );
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
		$retValue = '{"id":0,"email":"","password":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $username, $password, $id )
	{
		$retValue = '{"id":' . $id . ',"email":"' . $email . '","password":"' . $password . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
