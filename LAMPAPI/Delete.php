<?php

    $inData = getRequestInfo();

    $firstname = "";
    $lastname = "";

    $conn = new mysqli("localhost", "admin", "admin", "COP4331");
    if($conn->connection_error)
    {
        returnWithError($conn->connection_error);
    }
    else
    {
        if($result = $conn->query(delete("Contacts")) != true)
        {
            returnWithError("Delete was not successfull");
        }
    }

    function delete($tablename)
    {
        $sql = "DELETE FROM '" . $tablename . "' WHERE firstname = 
        '" . $inData["firstname"] . "' AND lastname = '" . $inData["lastname"]"'";
    }

    function getRequestInfo()
    {
        json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err)
    {
        $retValue = '{"firstname":"","lastname":"","error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

?>
