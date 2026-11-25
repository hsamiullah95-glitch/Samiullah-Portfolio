
<?php

header("Content-Type: application/json; charset=UTF-8");
$allowedOrigins = ["http://localhost:5173", "http://localhost:5174", "http://localhost:5177"];
$origin = $_SERVER["HTTP_ORIGIN"] ?? "";

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: " . $origin);
    header("Vary: Origin");
}
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

session_set_cookie_params([
    "lifetime" => 0,
    "path" => "/",
    "httponly" => true,
    "samesite" => "Lax"
]);

session_start();

if (isset($_SESSION["admin_id"])) {

    echo json_encode([
        "success" => true,
        "admin" => [
            "id" => $_SESSION["admin_id"],
            "username" => $_SESSION["admin_username"]
        ]
    ]);

} else {

    http_response_code(401);

    echo json_encode([
        "success" => false,
        "message" => "Please login first."
    ]);
}


