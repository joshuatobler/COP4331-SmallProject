<?php

    $inData = getRequestInfo();

    $firstname = "";
    $lastname = "";
    $username = "";
    $password = "";
    $email = "";

    $conn = new mysqli("localhost", "admin", "admin", "COP4331");
    if($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        $sql = "insert into user (username, password, firstname, lastname, email) VALUES 
            ('" . $username . "', '" . $password . "', '" . $firstname . "', '" . $lastname . "', '" . $email ."')";
        if($result = $conn->query($sql) != TRUE){
            returnWithError($conn->error);
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
        $retValue = '{"username":"", "password":"", "firstname":"", "lastname":"", "email":"","error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }
    
?>
