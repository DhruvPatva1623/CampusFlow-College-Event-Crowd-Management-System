<?php
// get_event.php - SELECT one event, example: php/get_event.php?id=1 (GET)

require_once "db.php";

$id = (int) $_GET["id"];

$stmt = $conn->prepare(
    "SELECT e.event_id AS id, e.event_name AS name, e.category, e.event_date AS date,
            e.event_time AS time, e.venue, e.capacity, e.description, e.instructions,
            (SELECT COUNT(*) FROM registrations WHERE event_id = e.event_id) AS registered
     FROM events e WHERE e.event_id = ?"
);
$stmt->bind_param("i", $id);
$stmt->execute();
$event = $stmt->get_result()->fetch_assoc();

header("Content-Type: application/json");
echo json_encode($event ? $event : ["error" => "Event not found"]);
