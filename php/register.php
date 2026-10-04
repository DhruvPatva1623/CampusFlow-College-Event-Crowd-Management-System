<?php
// register.php - saves a registration (POST from the event-details form)
// the form must send: event_id, name, enrollment_no, email, branch, year, phone
// so a hidden input named event_id has to be added to the form

require_once "db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    die("Please use the registration form.");
}

$event_id = (int) $_POST["event_id"];
$name = $_POST["name"];
$enrollment_no = $_POST["enrollment_no"];
$email = $_POST["email"];
$branch = $_POST["branch"];
$year = (int) $_POST["year"];
$phone = $_POST["phone"];

// 1. is there space? compare capacity with the number of registrations
$stmt = $conn->prepare(
    "SELECT capacity, (SELECT COUNT(*) FROM registrations WHERE event_id = ?) AS registered
     FROM events WHERE event_id = ?"
);
$stmt->bind_param("ii", $event_id, $event_id);
$stmt->execute();
$event = $stmt->get_result()->fetch_assoc();

if (!$event) {
    die("Event not found.");
}
if ($event["registered"] >= $event["capacity"]) {
    die("Registration is closed because the event has reached capacity.");
}

// 2. find the student by enrollment number, or add a new one (INSERT)
$stmt = $conn->prepare("SELECT id FROM users WHERE enrollment_no = ?");
$stmt->bind_param("s", $enrollment_no);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

if ($user) {
    $user_id = $user["id"];
} else {
    $stmt = $conn->prepare("INSERT INTO users (name, enrollment_no, email, branch, year, phone) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssis", $name, $enrollment_no, $email, $branch, $year, $phone);
    $stmt->execute();
    $user_id = $conn->insert_id;
}

// 3. save the registration (the UNIQUE key stops double registration)
$stmt = $conn->prepare("INSERT INTO registrations (user_id, event_id) VALUES (?, ?)");
$stmt->bind_param("ii", $user_id, $event_id);

if ($stmt->execute()) {
    // registration-success.html can read reg_id from the url
    header("Location: ../registration-success.html?reg_id=" . $conn->insert_id);
    exit;
}
echo "You are already registered for this event.";
