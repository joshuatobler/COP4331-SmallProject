<?php

$post_data = get_json_request();
$searchResults = [];

$conn = new mysqli("localhost", "admin", "admin", "COP4331");
if (!$conn->connection_error) {
    $sql = "SELECT id FROM contacts WHERE firstname like '%" . $post_data["search"]
        . "%' or lastname like '%" . $post_data["search"] . "%' and foreignid='" . $post_data["id"] . "'";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $searchResults = $result->fetch_assoc();
    } else {
        send_json_response("No Contacts Found", true, 200);
    }
    $conn->close();
} else {
    send_json_response($conn->connect_error, true, 500);
}

send_json_response($searchResults);

function get_json_request()
{
    $json_str = file_get_contents('php://input');
    if ($json_str !== false) {
        $json_arr = json_decode($json_str, true);
        if ($json_arr !== null) {
            return $json_arr;
        }
    }

    send_json_response('Input not in JSON format', true, 400);
    exit();
}

function send_json_response($res, $err = false, $res_code = null)
{
    header('Content-type: application/json');
    if ($res_code === null) {
        http_response_code($err ? 500 : 200);
    } else {
        http_response_code($res_code);
    }
    $json_response = json_encode([
        'status' => $err ? 'failure' : 'success',
        'message' => $res
    ]);

    if ($json_response !== false) {
        echo $json_response;
    } else {
        http_response_code(500);
        exit();
    }
}
