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

?>