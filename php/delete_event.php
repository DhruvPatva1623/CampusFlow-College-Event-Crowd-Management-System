<?php
// delete_event.php - DELETE an event (organizer only, POST)
// its registrations are deleted too (ON DELETE CASCADE in database.sql)

require_once "db.php";
requireAdmin();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $event_id = (int) $_POST["event_id"];

    $stmt = $conn->prepare("DELETE FROM events WHERE event_id = ?");
    $stmt->bind_param("i", $event_id);
    $stmt->execute();

    header("Location: ../admin.html?login=ok");
    exit;
}
