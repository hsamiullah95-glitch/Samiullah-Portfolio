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

session_start();
require_once __DIR__ . "/../config/database.php";

function sendResponse($success, $message, $data = null, $status = 200) {
    http_response_code($status);
    echo json_encode([
        "success" => $success,
        "message" => $message,
        "data" => $data
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$allowedKeys = [
    "brand_name",
    "footer_tagline",
    "footer_description",
    "footer_cta_title",
    "footer_cta_text",
    "footer_location",
    "footer_email",
    "footer_phone",
    "footer_copyright",
    "facebook_url",
    "instagram_url",
    "linkedin_url",
    "github_url"
];

try {
    $method = $_SERVER["REQUEST_METHOD"];

    if ($method === "GET") {
        $placeholders = implode(",", array_fill(0, count($allowedKeys), "?"));

        $stmt = $pdo->prepare(
            "SELECT setting_key, setting_value
             FROM site_settings
             WHERE setting_key IN ($placeholders)"
        );

        $stmt->execute($allowedKeys);
        $rows = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

        $settings = [];
        foreach ($allowedKeys as $key) {
            $settings[$key] = $rows[$key] ?? "";
        }

        sendResponse(true, "Header and Footer settings loaded.", $settings);
    }

    if ($method === "PUT") {
        if (!isset($_SESSION["admin_id"])) {
            sendResponse(false, "Unauthorized. Please login first.", null, 401);
        }

        $input = json_decode(file_get_contents("php://input"), true);

        if (!is_array($input)) {
            sendResponse(false, "Invalid request data.", null, 400);
        }

        $stmt = $pdo->prepare(
            "INSERT INTO site_settings (setting_key, setting_value)
             VALUES (?, ?)
             ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)"
        );

        $saved = [];

        foreach ($allowedKeys as $key) {
            $value = trim((string)($input[$key] ?? ""));

            if (strlen($value) > 5000) {
                sendResponse(false, "One of the fields is too long.", null, 422);
            }

            if (in_array($key, [
                "facebook_url", "instagram_url", "linkedin_url", "github_url"
            ], true) && $value !== "") {
                if (!filter_var($value, FILTER_VALIDATE_URL) ||
                    !in_array(parse_url($value, PHP_URL_SCHEME), ["http", "https"], true)) {
                    sendResponse(false, "Please enter valid social media URLs.", null, 422);
                }
            }

            $stmt->execute([$key, $value]);
            $saved[$key] = $value;
        }

        sendResponse(true, "Header and Footer settings saved successfully.", $saved);
    }

    sendResponse(false, "Method not allowed.", null, 405);

} catch (Throwable $e) {
    error_log("Header Footer API Error: " . $e->getMessage());
    sendResponse(false, "Could not process Header and Footer settings.", null, 500);
}

