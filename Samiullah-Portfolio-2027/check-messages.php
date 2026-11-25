<?php
require "backend/config/database.php";

$q = $pdo->query("SHOW TABLES LIKE 'contact_messages'");

if ($q->fetch()) {
    echo "SUCCESS: contact_messages table exists" . PHP_EOL;

    foreach ($pdo->query("DESCRIBE contact_messages") as $row) {
        echo $row["Field"] . " | " . $row["Type"] . PHP_EOL;
    }

    $count = $pdo->query("SELECT COUNT(*) FROM contact_messages")->fetchColumn();
    echo "Total Messages: " . $count . PHP_EOL;
} else {
    echo "ERROR: contact_messages table NOT FOUND" . PHP_EOL;
}
