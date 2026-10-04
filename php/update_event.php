<?php
// update_event.php - UPDATE an event (organizer only, POST)

require_once "db.php";
requireAdmin();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $event_id = (int) $_POST["event_id"];
    $name = $_POST["event_name"];
    $category = $_POST["category"];
    $date = $_POST["event_date"];
    $time = $_POST["event_time"];
    $venue = $_POST["venue"];
    $capacity = (int) $_POST["capacity"];
    $description = $_POST["description"];
    $instructions = $_POST["instructions"];

    $stmt = $conn->prepare(
        "UPDATE events SET event_name = ?, category = ?, event_date = ?, event_time = ?,
                venue = ?, capacity = ?, description = ?, instructions = ?
         WHERE event_id = ?"
    );
    $stmt->bind_param("sssssissi", $name, $category, $date, $time, $venue, $capacity, $description, $instructions, $event_id);
    $stmt->execute();

    header("Location: ../admin.html?login=ok");
    exit;
}
