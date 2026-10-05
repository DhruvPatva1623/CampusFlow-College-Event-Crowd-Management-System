<?php
session_start();

echo "<pre>";
echo "Session ID: " . session_id() . "\n";
echo "Admin ID: ";
var_dump($_SESSION["admin_id"] ?? "NOT SET");
echo "</pre>";
?>
