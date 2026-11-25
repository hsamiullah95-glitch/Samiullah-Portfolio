
<?php

header("Content-Type: application/json; charset=UTF-8");
$allowedOrigins = ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5177"];
$origin = $_SERVER["HTTP_ORIGIN"] ?? "";

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: " . $origin);
    header("Vary: Origin");
}
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Method not allowed."
    ]);
    exit;
}

session_set_cookie_params([
    "lifetime" => 0,
    "path" => "/",
    "httponly" => true,
    "samesite" => "Lax"
]);

session_start();

require_once __DIR__ . "/../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

$username = trim($data["username"] ?? "");
$password = $data["password"] ?? "";

if ($username === "" || $password === "") {
    http_response_code(422);
    echo json_encode([
        "success" => false,
        "message" => "Username and password are required."
    ]);
    exit;
}

try {

    $stmt = $pdo->prepare(
        "SELECT id, username, password
         FROM admin_users
         WHERE username = ?
         LIMIT 1"
    );

    $stmt->execute([$username]);

    $admin = $stmt->fetch();

    if (
        !$admin ||
        !password_verify($password, $admin["password"])
    ) {
        http_response_code(401);

        echo json_encode([
            "success" => false,
            "message" => "Invalid username or password."
        ]);
        exit;
    }

    session_regenerate_id(true);

    $_SESSION["admin_id"] = $admin["id"];
    $_SESSION["admin_username"] = $admin["username"];

    echo json_encode([
        "success" => true,
        "message" => "Login successful!",
        "admin" => [
            "id" => $admin["id"],
            "username" => $admin["username"]
        ]
    ]);

} catch (Throwable $e) {

    error_log("Admin Login Error: " . $e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Server error. Please try again."
    ]);
}



