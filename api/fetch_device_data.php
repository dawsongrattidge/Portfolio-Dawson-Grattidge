<?php
// Set the header to indicate JSON output
header('Content-Type: application/json');

// fetch_device_data.php
require 'db_config.php';

$sql = "SELECT * FROM DeviceData";
$result = $conn->query($sql);

$deviceDataArray = array();
$response = array();

if ($result->num_rows > 0) {
    // Output data of each row
    while($row = $result->fetch_assoc()) {
        $deviceDataArray[] = $row;
    }
    $response['status'] = 'success';
    $response['deviceData'] = $deviceDataArray;
} else {
    $response['status'] = 'error';
    $response['message'] = '0 results';
}

echo json_encode($response);

$conn->close();
?>
