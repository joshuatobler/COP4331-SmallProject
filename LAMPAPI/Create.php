<?php

    $inData = getRequestInfo();

    $firstname = $inData["firstname"];
    $lastname = $inData["lastname"];
    $email = $inData["email"];
    $phone = $inData["phone"]; // added phone

    $conn = new mysqli("localhost", "admin", "admin", "COP4331");
    if($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        $sql = "insert into contacts (firstname, lastname, email, phone) VALUES
            ('" . $firstname . "', '" . $lastname . "', '" . $email . "', '" . $phone . "')"; // added phone
        if($result = $conn->query($sql) != TRUE){
            returnWithError($conn->error);
        }
        returnWithInfo(); //added to check for success
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
        $retValue = '{"firstname":"", "lastname":"","error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }
    
    function returnWithInfo() // added function for successful response
    {
        $retValue = '{"info":"Success"}';
        sendResultInfoAsJson( $retValue );
    }

?>
