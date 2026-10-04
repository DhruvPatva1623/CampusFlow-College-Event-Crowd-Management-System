<?php
// get_registrations.php - students registered for one event (organizer only)
// example: php/get_registrations.php?event_id=1

require_once "db.php";
requireAdmin();

$event_id = (int) $_GET["event_id"];

$stmt = $conn->prepare(
    "SELECT r.registration_id, u.name, u.enrollment_no, u.email, u.branch, u.year,
            u.phone, r.registration_date, r.status
     FROM registrations r
     JOIN users u ON u.id = r.user_id
     WHERE r.event_id = ?"
);
$stmt->bind_param("i", $event_id);
$stmt->execute();
$result = $stmt->get_result();

$list = [];
while ($row = $result->fetch_assoc()) {
    $list[] = $row;
}

header("Content-Type: application/json");
echo json_encode($list);
