<?php

    $inData = getRequestInfo();

    $firstname = "";
    $lastname = "";
    $email = "";
    $phone = "";

    $conn = new mysqli("localhost", "admin", "admin", "COP4331");
    if($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        $sql = "insert into user (firstname, lastname, email, phone) VALUES
            ('" . $firstname . "', '" . $lastname . "', '" . $email . "', '" . $phone . "')"; //line 17 is going to change based on how the database is updated
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
        $retValue = '{"username":"", "password":"","error":"' . $err . '"}'; //will change for sake of clarity
        sendResultInfoAsJson($retValue);
    }

?>
