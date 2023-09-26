<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Database connection details
//Revist to make sure this is not public
$host = 'localhost';
$db   = 'IOT_Dashboard';
$user = 'Dawson';
$pass = 'y*ZQ3NFrzGUPnq@YC';

// Create a new database connection
$conn = new mysqli($host, $user, $pass, $db);

// Check if the connection was successful
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get JSON data from POST request
$data = json_decode(file_get_contents('php://input'), true);

if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Malformed JSON received"]);
    die();
}

// Extract the relevant fields from the JSON payload
$deviceUID = $data['DeviceUID'] ?? null;
$deviceType = $data['DeviceType'] ?? null;
$dateTime = $data['DateTime'] ?? null;
$systemVoltage = $data['SystemVoltage'] ?? null;
$lteLongitude = $data['LteLongitude'] ?? null;
$lteLatitude = $data['LteLatitude'] ?? null;
$wifiLongitude = $data['WifiLongitude'] ?? null;
$wifiLatitude = $data['WifiLatitude'] ?? null;
$temperature = $data['Temperature'] ?? null;
$ultraTemperature = $data['UltraTemperature'] ?? null;
$humidity = $data['Humidity'] ?? null;
$ambientLight = $data['AmbientLight'] ?? null;
$acessPoint0 = $data['AcessPoint0'] ?? null;
$acessPoint1 = $data['AcessPoint1'] ?? null;
$acessPoint2 = $data['AcessPoint2'] ?? null;
$acessPoint3 = $data['AcessPoint3'] ?? null;
$acessPoint4 = $data['AcessPoint4'] ?? null;
$acessPoint5 = $data['AcessPoint5'] ?? null;
$accelerometerState = $data['AccelerometerState'] ?? null;

// SQL query to update the Devices table
// SQL query to update the Devices table
$sql1 = "INSERT INTO Devices (DeviceUID, LastSeenDateTime, DeviceType) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE LastSeenDateTime=?, DeviceType=?";
$stmt1 = $conn->prepare($sql1);
$stmt1->bind_param("issss", $deviceUID, $dateTime, $deviceType, $dateTime, $deviceType);


// Execute the query for Devices table and check for success
if ($stmt1->execute()) {
    http_response_code(200);
    echo json_encode(["status" => "success", "message" => "Record updated successfully in Devices table"]);
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Error updating record in Devices table: " . $stmt1->error]);
}

// Prepare columns and values for DeviceData table
$columns = ['DeviceUID', 'DateTime'];
$values = [$deviceUID, $dateTime];
$types = "is";

$fields = ['SystemVoltage' => 'd', 'LteLongitude' => 'd', 'LteLatitude' => 'd', 'WifiLongitude' => 'd', 'WifiLatitude' => 'd',
           'Temperature' => 'd', 'UltraTemperature' => 'd', 'Humidity' => 'd', 'AmbientLight' => 'd', 
           'AcessPoint0' => 'i', 'AcessPoint1' => 'i', 'AcessPoint2' => 'i', 'AcessPoint3' => 'i', 'AcessPoint4' => 'i', 'AcessPoint5' => 'i',
           'AccelerometerState' => 's'];

foreach ($fields as $field => $type) {
    if (isset($data[$field])) {
        $columns[] = $field;
        $values[] = $data[$field];
        $types .= $type;
    }
}

// SQL query to insert data into the DeviceData table
$sql2 = "INSERT INTO DeviceData (" . implode(',', $columns) . ") VALUES (" . str_repeat('?,', count($columns) - 1) . "?)";
$stmt2 = $conn->prepare($sql2);
$stmt2->bind_param($types, ...$values);



// Execute the query for DeviceData table and check for success
if ($stmt2->execute()) {
    http_response_code(200);
    echo json_encode(["status" => "success", "message" => "New record created successfully in DeviceData table"]);
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Error: " . $sql2 . " " . $stmt2->error]);
}
// Close the database connection
$conn->close();
?>