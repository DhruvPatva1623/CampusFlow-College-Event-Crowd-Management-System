<?php
// get_events.php - SELECT all events with the number of registrations
// the result is JSON, so AngularJS can load it later with $http.get("php/get_events.php")

require_once "db.php";

$sql = "SELECT e.event_id AS id, e.event_name AS name, e.category, e.event_date AS date,
               e.event_time AS time, e.venue, e.capacity, e.description, e.instructions,
               COUNT(r.registration_id) AS registered
        FROM events e
        LEFT JOIN registrations r ON r.event_id = e.event_id
        GROUP BY e.event_id
        ORDER BY e.event_date";

$result = $conn->query($sql);

$events = [];
while ($row = $result->fetch_assoc()) {
    $row["id"] = (int) $row["id"];
    $row["capacity"] = (int) $row["capacity"];
    $row["registered"] = (int) $row["registered"];
    $events[] = $row;
}

header("Content-Type: application/json");
echo json_encode($events);
