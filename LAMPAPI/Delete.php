<?php

$post_data = get_json_request();

$conn = new mysqli("localhost", "admin", "admin", "COP4331");
if (!$conn->connection_error) {
    $sql = "DELETE FROM contacts WHERE id='" . $post_data["id"] . "'";
    if ($result = $conn->query($sql) !== true) {
        send_json_response($conn->error, true, 500);
    }
    send_json_response('User deleted');
    $conn->close();
} else {
    send_json_response($conn->connection_error, true, 500);
}

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
