<?php
// db.php - connects PHP to MySQL (other files include this one)

require_once "config.php";

// sessions are used for the organizer login
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    die("Could not connect to the database: " . $conn->connect_error);
}

// stops the page if the organizer is not logged in
function requireAdmin() {
    if (!isset($_SESSION["admin_id"])) {
        http_response_code(403);
        die("Please login first.");
    }
}
