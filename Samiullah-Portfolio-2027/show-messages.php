<?php
require "backend/config/database.php";

$stmt = $pdo->query(
    "SELECT id, name, email, subject, message, is_read, created_at
     FROM contact_messages
     ORDER BY created_at DESC"
);

$messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "========== CONTACT MESSAGES ==========" . PHP_EOL;
echo "Total Messages: " . count($messages) . PHP_EOL . PHP_EOL;

foreach ($messages as $row) {
    echo "ID: " . $row["id"] . PHP_EOL;
    echo "Name: " . $row["name"] . PHP_EOL;
    echo "Email: " . $row["email"] . PHP_EOL;
    echo "Subject: " . $row["subject"] . PHP_EOL;
    echo "Message: " . $row["message"] . PHP_EOL;
    echo "Read Status: " . $row["is_read"] . PHP_EOL;
    echo "Date: " . $row["created_at"] . PHP_EOL;
    echo "--------------------------------------" . PHP_EOL;
}
