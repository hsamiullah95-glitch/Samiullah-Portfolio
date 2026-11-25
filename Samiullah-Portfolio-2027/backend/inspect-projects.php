<?php
require __DIR__ . "/config/database.php";

echo "===== PROJECTS TABLE COLUMNS =====\n";
$columns = $pdo->query("SHOW COLUMNS FROM projects")->fetchAll();

foreach ($columns as $column) {
    echo $column["Field"] . " | " . $column["Type"] . " | " . $column["Null"] . "\n";
}

echo "\n===== EXISTING PROJECTS (FIRST 5) =====\n";
$rows = $pdo->query("SELECT * FROM projects LIMIT 5")->fetchAll();

print_r($rows);
