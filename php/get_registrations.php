<?php
// get_registrations.php
// Shows students registered for one event.
// Only a logged-in organizer can use this file.

require_once "db.php";

// Check that the organizer is logged in
requireAdmin();

// Get event ID from the URL
$event_id = (int) ($_GET["event_id"] ?? 0);

if ($event_id <= 0) {
    header("Content-Type: application/json");
    echo json_encode([
        "registrations" => [],
        "error" => "Invalid event ID."
    ]);
    exit;
}

// Get registered students for this event
$stmt = $conn->prepare(
    "SELECT 
        r.registration_id,
        u.name,
        u.enrollment_no,
        u.email,
        u.branch,
        u.year,
        u.phone,
        r.registration_date,
        r.status
     FROM registrations r
     JOIN users u ON u.id = r.user_id
     JOIN events e ON e.event_id = r.event_id
     WHERE r.event_id = ?
     ORDER BY r.registration_date DESC"
);

$stmt->bind_param("i", $event_id);
$stmt->execute();

$result = $stmt->get_result();

$list = [];

while ($row = $result->fetch_assoc()) {
    $list[] = $row;
}

header("Content-Type: application/json");

echo json_encode([
    "registrations" => $list
]);
?>