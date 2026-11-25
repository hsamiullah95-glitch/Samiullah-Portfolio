<?php
require __DIR__ . "/config/database.php";

$tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);

foreach ($tables as $table) {
    echo $table . PHP_EOL;
}
