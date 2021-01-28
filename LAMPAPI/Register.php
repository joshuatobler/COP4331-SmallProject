<?php

    $inData = getRequestInfo();

    $firstname = "";
    $lastname = "";
    $username = "";
    $password = "";

    $conn = new mysqli("localhost", "admin", "admin", "COP4331");
    if($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        $sql = "CREATE USER '" $inData["firstname"] "' '" . $inData["lastname"] "' '" . $inData["username"] . "' IDENTIFIED BY '" . $inData["password"] "'";
        $result = $conn->query($sql);
        if($result->num_rows > 0){
            $row = $result->fetch_assoc();
            $firstname = $row["firstname"];
            $lastname = $row["lastname"];
            $username = $row["username"];
            $password = $row["password"];
            returnWithInfo($username, $password);
        }
        else{
            returnWithError("Was not able to register account");
        }
        $conn->close();
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err)
    {
        $retValue = '{"username":"", "password":"","error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithInfo($username, $password)
    {
        $retValue = '{"username":"' . $username . '", "password":"' . $password . '", "error":""}';
        sendResultInfoAsJson($retValue);
    }
    
?>
