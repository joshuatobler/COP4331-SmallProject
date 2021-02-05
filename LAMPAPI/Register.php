<?php

    $inData = getRequestInfo();

    $firstname = "";
    $lastname = "";
    $email = "";
    $password = "";

    $conn = new mysqli("localhost", "admin", "admin", "COP4331");
    if($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        $sql = "insert into user (password, firstname, lastname, email) VALUES 
            ('" . $password . "', '" . $firstname . "', '" . $lastname . "', '" . $email ."')";
        if($result = $conn->query($sql) != TRUE){
            returnWithError($conn->error);
        }
        returnWithInfo(); //checks to see if it ended up working
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
        $retValue = '{"password":"", "firstname":"", "lastname":"", "email":"","error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithInfo()
    {
        $retValue = '{"info":"Success"}';
        sendResultInfoAsJson( $retValue );
    }
    
?>
