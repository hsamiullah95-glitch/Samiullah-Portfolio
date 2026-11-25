<?php
header("Content-Type: application/json; charset=UTF-8");

$allowedOrigins = ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5177"];
$origin = $_SERVER["HTTP_ORIGIN"] ?? "";

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: " . $origin);
    header("Vary: Origin");
}

header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, PUT, OPTIONS");
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

if (!isset($_SESSION["admin_id"])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Please login first."]);
    exit;
}

require_once __DIR__ . "/../config/database.php";

try {
    if ($_SERVER["REQUEST_METHOD"] === "GET") {
        $stmt = $pdo->prepare("SELECT id, username FROM admin_users WHERE id = ? LIMIT 1");
        $stmt->execute([$_SESSION["admin_id"]]);
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$admin) {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Admin account not found."]);
            exit;
        }

        echo json_encode(["success" => true, "admin" => $admin]);
        exit;
    }

    if ($_SERVER["REQUEST_METHOD"] !== "PUT") {
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Method not allowed."]);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"), true) ?? [];

    $username = trim($data["username"] ?? "");
    $currentPassword = $data["current_password"] ?? "";
    $newPassword = $data["new_password"] ?? "";
    $confirmPassword = $data["confirm_password"] ?? "";

    if ($username === "" || strlen($username) < 3 || strlen($username) > 100) {
        http_response_code(422);
        echo json_encode(["success" => false, "message" => "Username must be 3 to 100 characters."]);
        exit;
    }

    if ($currentPassword === "") {
        http_response_code(422);
        echo json_encode(["success" => false, "message" => "Enter your current password."]);
        exit;
    }

    $stmt = $pdo->prepare("SELECT id, username, password FROM admin_users WHERE id = ? LIMIT 1");
    $stmt->execute([$_SESSION["admin_id"]]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$admin || !password_verify($currentPassword, $admin["password"])) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Current password is incorrect."]);
        exit;
    }

    $check = $pdo->prepare("SELECT id FROM admin_users WHERE username = ? AND id <> ? LIMIT 1");
    $check->execute([$username, $_SESSION["admin_id"]]);

    if ($check->fetch()) {
        http_response_code(409);
        echo json_encode(["success" => false, "message" => "This username is already taken."]);
        exit;
    }

    if ($newPassword !== "" && strlen($newPassword) < 8) {
        http_response_code(422);
        echo json_encode(["success" => false, "message" => "New password must be at least 8 characters."]);
        exit;
    }

    if ($newPassword !== "" && $newPassword !== $confirmPassword) {
        http_response_code(422);
        echo json_encode(["success" => false, "message" => "New passwords do not match."]);
        exit;
    }

    if ($newPassword !== "") {
        $hash = password_hash($newPassword, PASSWORD_DEFAULT);
        $update = $pdo->prepare("UPDATE admin_users SET username = ?, password = ? WHERE id = ?");
        $update->execute([$username, $hash, $_SESSION["admin_id"]]);
    } else {
        $update = $pdo->prepare("UPDATE admin_users SET username = ? WHERE id = ?");
        $update->execute([$username, $_SESSION["admin_id"]]);
    }

    $_SESSION["admin_username"] = $username;

    echo json_encode([
        "success" => true,
        "message" => "Admin account updated successfully.",
        "admin" => ["id" => $_SESSION["admin_id"], "username" => $username]
    ]);

} catch (Throwable $e) {
    error_log("Admin Settings Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error. Please try again."]);
}

