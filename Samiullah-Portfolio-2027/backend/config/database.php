
<?php

$host = "localhost";
$dbname = "portfolio_db";
$dbUser = "root";
$dbPassword = "";

try {

    $pdo = new PDO(
        "mysql:host={$host};dbname={$dbname};charset=utf8mb4",
        $dbUser,
        $dbPassword,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );

} catch (PDOException $e) {

    error_log("Database Error: " . $e->getMessage());

    http_response_code(500);

    throw new RuntimeException(
        "Database connection failed."
    );
}
