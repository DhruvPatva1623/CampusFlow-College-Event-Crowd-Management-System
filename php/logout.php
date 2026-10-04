<?php
// logout.php - ends the session

require_once "db.php";

session_unset();
session_destroy();

header("Location: ../admin.html?logout=1");
exit;
