<?php

header("Content-Type: application/json; charset=UTF-8");

$allowedOrigins = ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5177"];
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

$method = $_SERVER["REQUEST_METHOD"];

if ($method !== "GET" && !isset($_SESSION["admin_id"])) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Unauthorized. Please login first."
    ]);
    exit;
}

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

function uploadServiceImage() {
    if (!isset($_FILES["image"]) ||
        $_FILES["image"]["error"] === UPLOAD_ERR_NO_FILE) {
        return null;
    }

    $file = $_FILES["image"];

    if ($file["error"] !== UPLOAD_ERR_OK) {
        sendResponse(false, "Image upload failed. Error code: " . $file["error"], null, 422);
    }

    if ($file["size"] > 5 * 1024 * 1024) {
        sendResponse(false, "Image must be smaller than 5MB.", null, 422);
    }

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $file["tmp_name"]);
    finfo_close($finfo);

    $extensions = [
        "image/jpeg" => "jpg",
        "image/png" => "png",
        "image/webp" => "webp"
    ];

    if (!isset($extensions[$mime])) {
        sendResponse(false, "Only JPG, PNG and WEBP images are allowed.", null, 422);
    }

    $uploadDir = __DIR__ . "/../uploads/services/";

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0775, true);
    }

    $filename = bin2hex(random_bytes(16)) . "." . $extensions[$mime];
    $destination = $uploadDir . $filename;

    if (!move_uploaded_file($file["tmp_name"], $destination)) {
        sendResponse(false, "Could not save uploaded image.", null, 500);
    }

    return "uploads/services/" . $filename;
}

function removeServiceImage($image) {
    if (!$image) {
        return;
    }

    $baseDir = realpath(__DIR__ . "/../uploads/services");
    $imagePath = realpath(__DIR__ . "/../" . $image);

    if ($baseDir && $imagePath &&
        strpos($imagePath, $baseDir . DIRECTORY_SEPARATOR) === 0 &&
        is_file($imagePath)) {
        unlink($imagePath);
    }
}

$input = [];

if ($method === "POST") {
    // Multipart FormData
    $input = $_POST;
} else {
    // JSON for GET-independent PUT/DELETE requests
    $decoded = json_decode(file_get_contents("php://input"), true);
    if (is_array($decoded)) {
        $input = $decoded;
    }
}

$allowedCategories = [
    "Website & UI/UX Design",
    "Web Development",
    "Networking & IT",
    "Database & Hosting"
];

try {

    // GET SERVICES
    if ($method === "GET") {
        $stmt = $pdo->query(
            "SELECT * FROM services ORDER BY id DESC"
        );

        sendResponse(
            true,
            "Services loaded successfully.",
            $stmt->fetchAll(PDO::FETCH_ASSOC)
        );
    }

    // ADD OR UPDATE SERVICE USING POST FOR FORMDATA
    if ($method === "POST") {

        $id = (int)($input["id"] ?? 0);
        $title = trim($input["title"] ?? "");
        $description = trim($input["description"] ?? "");
        $category = trim($input["category"] ?? "");
        $icon = trim($input["icon"] ?? "Briefcase");
        $isActive = isset($input["is_active"])
            ? (int)$input["is_active"]
            : 1;

        if ($title === "" || $description === "") {
            sendResponse(false, "Title and description are required.", null, 422);
        }

        if (!in_array($category, $allowedCategories, true)) {
            sendResponse(false, "Invalid service category.", null, 422);
        }

        if (!in_array($isActive, [0, 1], true)) {
            sendResponse(false, "Invalid active value.", null, 422);
        }

        // ADD NEW SERVICE
        if ($id <= 0) {

            $image = uploadServiceImage();

            $stmt = $pdo->prepare(
                "INSERT INTO services
                (title, description, category, icon, is_active, image)
                VALUES (?, ?, ?, ?, ?, ?)"
            );

            $stmt->execute([
                $title,
                $description,
                $category,
                $icon,
                $isActive,
                $image
            ]);

            $newId = (int)$pdo->lastInsertId();

            $get = $pdo->prepare("SELECT * FROM services WHERE id = ?");
            $get->execute([$newId]);

            sendResponse(
                true,
                "Service added successfully.",
                $get->fetch(PDO::FETCH_ASSOC),
                201
            );
        }

        // UPDATE EXISTING SERVICE
        $check = $pdo->prepare(
            "SELECT * FROM services WHERE id = ?"
        );
        $check->execute([$id]);
        $oldService = $check->fetch(PDO::FETCH_ASSOC);

        if (!$oldService) {
            sendResponse(false, "Service not found.", null, 404);
        }

        $newImage = uploadServiceImage();
        $image = $newImage ?: ($oldService["image"] ?? null);

        $stmt = $pdo->prepare(
            "UPDATE services
             SET title = ?, description = ?, category = ?,
                 icon = ?, is_active = ?, image = ?
             WHERE id = ?"
        );

        $stmt->execute([
            $title,
            $description,
            $category,
            $icon,
            $isActive,
            $image,
            $id
        ]);

        if ($newImage && !empty($oldService["image"])) {
            removeServiceImage($oldService["image"]);
        }

        $get = $pdo->prepare("SELECT * FROM services WHERE id = ?");
        $get->execute([$id]);

        sendResponse(
            true,
            "Service updated successfully.",
            $get->fetch(PDO::FETCH_ASSOC)
        );
    }

    // UPDATE SERVICE USING JSON PUT (BACKWARD COMPATIBILITY)
    if ($method === "PUT") {

        $id = (int)($input["id"] ?? 0);
        $title = trim($input["title"] ?? "");
        $description = trim($input["description"] ?? "");
        $category = trim($input["category"] ?? "");
        $icon = trim($input["icon"] ?? "Briefcase");
        $isActive = isset($input["is_active"])
            ? (int)$input["is_active"]
            : 1;

        if ($id <= 0 || $title === "" || $description === "") {
            sendResponse(false, "ID, title and description are required.", null, 422);
        }

        if (!in_array($category, $allowedCategories, true)) {
            sendResponse(false, "Invalid service category.", null, 422);
        }

        if (!in_array($isActive, [0, 1], true)) {
            sendResponse(false, "Invalid active value.", null, 422);
        }

        $stmt = $pdo->prepare(
            "UPDATE services
             SET title = ?, description = ?, category = ?, icon = ?, is_active = ?
             WHERE id = ?"
        );

        $stmt->execute([
            $title,
            $description,
            $category,
            $icon,
            $isActive,
            $id
        ]);

        if ($stmt->rowCount() === 0) {
            $check = $pdo->prepare("SELECT id FROM services WHERE id = ?");
            $check->execute([$id]);

            if (!$check->fetch()) {
                sendResponse(false, "Service not found.", null, 404);
            }
        }

        sendResponse(true, "Service updated successfully.");
    }

    // DELETE SERVICE
    if ($method === "DELETE") {

        $id = (int)($input["id"] ?? 0);

        if ($id <= 0) {
            sendResponse(false, "Valid service ID is required.", null, 422);
        }

        $check = $pdo->prepare(
            "SELECT image FROM services WHERE id = ?"
        );
        $check->execute([$id]);
        $service = $check->fetch(PDO::FETCH_ASSOC);

        if (!$service) {
            sendResponse(false, "Service not found.", null, 404);
        }

        $stmt = $pdo->prepare(
            "DELETE FROM services WHERE id = ?"
        );
        $stmt->execute([$id]);

        if (!empty($service["image"])) {
            removeServiceImage($service["image"]);
        }

        sendResponse(true, "Service deleted successfully.");
    }

    sendResponse(false, "Method not allowed.", null, 405);

} catch (PDOException $e) {

    error_log($e->getMessage());

    sendResponse(
        false,
        "Database operation failed. Check PHP error log.",
        null,
        500
    );

} catch (Throwable $e) {

    error_log($e->getMessage());

    sendResponse(
        false,
        "Server error: " . $e->getMessage(),
        null,
        500
    );
}
