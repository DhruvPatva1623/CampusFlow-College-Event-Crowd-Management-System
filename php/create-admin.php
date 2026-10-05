<?php
require_once "db.php";

$username = "admin";
$password = "admin123";

$hash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare(
    "INSERT INTO admins (username, password) VALUES (?, ?)"
);

$stmt->bind_param("ss", $username, $hash);

if ($stmt->execute()) {
    echo "Admin created successfully.<br>";
    echo "Username: admin<br>";
    echo "Password: admin123<br>";
} else {
    echo "Error: " . $stmt->error;
}
?>