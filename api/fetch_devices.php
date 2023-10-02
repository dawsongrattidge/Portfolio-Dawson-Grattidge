<?php
header('Content-Type: application/json');

require 'db_config.php';

$sql = "SELECT * FROM Devices";
$result = $conn->query($sql);

$devicesArray = array();
$response = array();

if ($result->num_rows > 0) {
    // Output data of each row
    while($row = $result->fetch_assoc()) {
        $devicesArray[] = $row;
    }
    $response['status'] = 'success';
    $response['devices'] = $devicesArray;
} else {
    $response['status'] = 'error';
    $response['message'] = '0 results';
}

echo json_encode($response);

$conn->close();
?>
