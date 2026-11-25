<?php
header("Content-Type: application/json; charset=UTF-8");
$allowedOrigins = ["http://localhost:5173", "http://localhost:5174", "http://localhost:5177"];
$origin = $_SERVER["HTTP_ORIGIN"] ?? "";

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: " . $origin);
    header("Vary: Origin");
}
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

session_start();
require_once __DIR__ . "/../config/database.php";

function respond($success, $message, $data = null, $status = 200) {
    http_response_code($status);
    echo json_encode([
        "success" => $success,
        "message" => $message,
        "data" => $data
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$method = $_SERVER["REQUEST_METHOD"];
$input = json_decode(file_get_contents("php://input"), true) ?? [];

try {
    // Public contact form submission
    if ($method === "POST") {
        $name = trim($input["name"] ?? "");
        $email = trim($input["email"] ?? "");
        $subject = trim($input["subject"] ?? "");
        $message = trim($input["message"] ?? "");

        if ($name === "" || $email === "" || $message === "") {
            respond(false, "Name, email and message are required.", null, 422);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            respond(false, "Please enter a valid email address.", null, 422);
        }

        if (mb_strlen($name) > 150 || mb_strlen($email) > 190 ||
            mb_strlen($subject) > 255 || mb_strlen($message) > 5000) {
            respond(false, "One or more fields are too long.", null, 422);
        }

        $stmt = $pdo->prepare(
            "INSERT INTO contact_messages (name, email, subject, message)
             VALUES (?, ?, ?, ?)"
        );
        $stmt->execute([$name, $email, $subject, $message]);

        respond(true, "Your message has been sent successfully.");
    }

    // All other actions require admin login
    if (!isset($_SESSION["admin_id"])) {
        respond(false, "Unauthorized. Please login first.", null, 401);
    }

    if ($method === "GET") {
        $stmt = $pdo->query(
            "SELECT id, name, email, subject, message, is_read, created_at
             FROM contact_messages ORDER BY created_at DESC, id DESC"
        );
        respond(true, "Messages loaded.", $stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    if ($method === "PUT") {
        $id = (int)($input["id"] ?? 0);
        $isRead = (int)($input["is_read"] ?? -1);

        if ($id < 1 || !in_array($isRead, [0, 1], true)) {
            respond(false, "Invalid message ID or status.", null, 422);
        }

        $stmt = $pdo->prepare("UPDATE contact_messages SET is_read = ? WHERE id = ?");
        $stmt->execute([$isRead, $id]);
        respond(true, "Message status updated.");
    }

    if ($method === "DELETE") {
        $id = (int)($input["id"] ?? 0);
        if ($id < 1) {
            respond(false, "Invalid message ID.", null, 422);
        }

        $stmt = $pdo->prepare("DELETE FROM contact_messages WHERE id = ?");
        $stmt->execute([$id]);
        respond(true, "Message deleted.");
    }

    respond(false, "Method not allowed.", null, 405);

} catch (Throwable $e) {
    error_log("Messages API: " . $e->getMessage());
    respond(false, "A server error occurred.", null, 500);
}


