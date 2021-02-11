<?php

    $inData = getRequestInfo();
    
    $firstname = "";
    $lastname = "";
    $email = "";
    $phone = "";

    $conn = new mysqli("localhost", "admin", "admin", "COP4331");
    if($conn->connection_error)
    {
        returnWithError($conn->connection_error);
    }
    else
    {
        $sql = "SELECT firstname FROM Contacts WHERE firstname like '%" . $inData["firstname"] 
            . "%' and lastname like '%" . $inData["lastname"] . "%'";
        $result = $conn->query($sql);
        if($result->num_rows > 0)
        {
            $row = $result->fetch_assoc();
            $firstname = $row["firstname"];
            $lastname = $row["lastname"];
            $email = $row["email"];
            $phone = $row["phone"];
        }
        else
        {
            returnWithError("No Contacts Found");
        }
        $conn->close();
    }

    returnWithInfo($searchResults);

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
        $retValue = '{"firstname":"","lastname":"","error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithInfo($searchResults)
    {
        $retValue = '{"firstname":'" . $firstname . "', "lastname":'" . $lastname . "', 
            "email":'" . $email . "', "error":""}';
        sendResultInfoAsJson($retValue);
    }

?>
