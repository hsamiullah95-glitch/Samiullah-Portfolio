
<?php

require_once __DIR__ . "/../config/database.php";

header("Content-Type: application/json; charset=UTF-8");

$username = "admin";
$password = "ChangeThis123!";

try {
    $check = $pdo->prepare(
        "SELECT id FROM admin_users WHERE username = ?"
    );
    $check->execute([$username]);

    if ($check->fetch()) {
        echo json_encode([
            "success" => false,
            "message" => "Admin account already exists."
        ]);
        exit;
    }

    $hashedPassword = password_hash(
        $password,
        PASSWORD_DEFAULT
    );

    $stmt = $pdo->prepare(
        "INSERT INTO admin_users (username, password)
         VALUES (?, ?)"
    );

    $stmt->execute([$username, $hashedPassword]);

    echo json_encode([
        "success" => true,
        "message" => "Admin account created successfully!"
    ]);

} catch (PDOException $e) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Could not create admin account."
    ]);
}
