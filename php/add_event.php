<?php
// add_event.php - INSERT a new event (organizer only, POST)

require_once "db.php";
requireAdmin();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = $_POST["event_name"];
    $category = $_POST["category"];
    $date = $_POST["event_date"];
    $time = $_POST["event_time"];
    $venue = $_POST["venue"];
    $capacity = (int) $_POST["capacity"];
    $description = $_POST["description"];
    $instructions = $_POST["instructions"];

    $stmt = $conn->prepare(
        "INSERT INTO events (event_name, category, event_date, event_time, venue, capacity, description, instructions)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->bind_param("sssssiss", $name, $category, $date, $time, $venue, $capacity, $description, $instructions);
    $stmt->execute();

    header("Location: ../admin.html?login=ok");
    exit;
}
