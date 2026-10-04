<?php
// login.php - checks the organizer login (form data comes by POST)
// prepared statement: the query is sent with a ? and the value is sent
// separately, so the user cannot change the query by typing SQL

require_once "db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: ../admin.html");
    exit;
}

$username = $_POST["username"];
$password = $_POST["password"];

$stmt = $conn->prepare("SELECT admin_id, password FROM admins WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$admin = $stmt->get_result()->fetch_assoc();

// password_verify compares the typed password with the saved hash
if ($admin && password_verify($password, $admin["password"])) {
    $_SESSION["admin_id"] = $admin["admin_id"];
    header("Location: ../admin.html?login=ok");
} else {
    header("Location: ../admin.html?login=failed");
}
exit;
