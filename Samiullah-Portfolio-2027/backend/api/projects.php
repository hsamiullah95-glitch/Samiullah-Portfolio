<?php
header("Content-Type: application/json; charset=UTF-8");

$allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5177"
];

$origin = $_SERVER["HTTP_ORIGIN"] ?? "";

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: " . $origin);
    header("Vary: Origin");
}

header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept");

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

$method = $_SERVER["REQUEST_METHOD"];
$publicOnly = ($_GET["public"] ?? "") === "1";

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
| Public visitors can only read active projects using ?public=1.
| All admin operations require a valid admin session.
*/

if (
    ($method !== "GET" || !$publicOnly) &&
    !isset($_SESSION["admin_id"])
) {
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

function projectUploadFolder() {
    return dirname(__DIR__) . "/uploads/projects/";
}

function saveProjectImage() {
    if (
        !isset($_FILES["image"]) ||
        $_FILES["image"]["error"] === UPLOAD_ERR_NO_FILE
    ) {
        return null;
    }

    $file = $_FILES["image"];

    if ($file["error"] !== UPLOAD_ERR_OK) {
        sendResponse(false, "Image upload failed.", null, 400);
    }

    if ($file["size"] > 5 * 1024 * 1024) {
        sendResponse(false, "Image must be smaller than 5 MB.", null, 422);
    }

    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file["tmp_name"]);

    $allowed = [
        "image/jpeg" => "jpg",
        "image/png" => "png",
        "image/webp" => "webp"
    ];

    if (!isset($allowed[$mime])) {
        sendResponse(
            false,
            "Only JPG, PNG and WEBP images are allowed.",
            null,
            422
        );
    }

    if (@getimagesize($file["tmp_name"]) === false) {
        sendResponse(false, "Invalid image file.", null, 422);
    }

    $folder = projectUploadFolder();

    if (!is_dir($folder) && !mkdir($folder, 0755, true)) {
        sendResponse(false, "Could not create project image folder.", null, 500);
    }

    $filename = bin2hex(random_bytes(16)) . "." . $allowed[$mime];

    if (!move_uploaded_file($file["tmp_name"], $folder . $filename)) {
        sendResponse(false, "Could not save project image.", null, 500);
    }

    return "uploads/projects/" . $filename;
}

function deleteProjectImage($imagePath) {
    if (!$imagePath) {
        return;
    }

    $prefix = "uploads/projects/";

    if (strpos($imagePath, $prefix) !== 0) {
        return;
    }

    $filename = basename($imagePath);

    if ($filename === "" || $filename === "." || $filename === "..") {
        return;
    }

    $folder = realpath(projectUploadFolder());

    if ($folder === false) {
        return;
    }

    $filePath = realpath($folder . DIRECTORY_SEPARATOR . $filename);

    if (
        $filePath !== false &&
        strpos($filePath, $folder . DIRECTORY_SEPARATOR) === 0 &&
        is_file($filePath)
    ) {
        @unlink($filePath);
    }
}

$input = [];

if ($method === "POST") {
    $input = $_POST;
} elseif ($method === "DELETE") {
    $decoded = json_decode(file_get_contents("php://input"), true);
    $input = is_array($decoded) ? $decoded : [];
}

try {

    /*
    |--------------------------------------------------------------------------
    | GET PROJECTS
    |--------------------------------------------------------------------------
    */

    if ($method === "GET") {
        if ($publicOnly) {
            $stmt = $pdo->query(
                "SELECT * FROM projects
                 WHERE is_active = 1
                 ORDER BY id DESC"
            );
        } else {
            $stmt = $pdo->query(
                "SELECT * FROM projects ORDER BY id DESC"
            );
        }

        sendResponse(
            true,
            "Projects loaded successfully.",
            $stmt->fetchAll(PDO::FETCH_ASSOC)
        );
    }

    /*
    |--------------------------------------------------------------------------
    | CREATE OR UPDATE PROJECT
    |--------------------------------------------------------------------------
    */

    if ($method === "POST") {
        $id = (int)($input["id"] ?? 0);

        $title = trim($input["title"] ?? "");
        $description = trim($input["description"] ?? "");
        $projectUrl = trim($input["project_url"] ?? "");
        $isActive = (string)($input["is_active"] ?? "1");

        if ($title === "") {
            sendResponse(false, "Project title is required.", null, 422);
        }

        if (strlen($title) > 255 || strlen($projectUrl) > 255) {
            sendResponse(false, "Title or project URL is too long.", null, 422);
        }

        if (!in_array($isActive, ["0", "1"], true)) {
            sendResponse(false, "Invalid project status.", null, 422);
        }

        $existingImage = null;

        if ($id > 0) {
            $check = $pdo->prepare(
                "SELECT id, image FROM projects WHERE id = ?"
            );
            $check->execute([$id]);
            $existing = $check->fetch(PDO::FETCH_ASSOC);

            if (!$existing) {
                sendResponse(false, "Project not found.", null, 404);
            }

            $existingImage = $existing["image"];
        }

        $uploadedImage = saveProjectImage();

        $image = $uploadedImage !== null
            ? $uploadedImage
            : $existingImage;

        if ($id > 0) {
            $stmt = $pdo->prepare(
                "UPDATE projects
                 SET title = ?, description = ?, project_url = ?,
                     image = ?, is_active = ?
                 WHERE id = ?"
            );

            $stmt->execute([
                $title,
                $description ?: null,
                $projectUrl ?: null,
                $image,
                (int)$isActive,
                $id
            ]);

            if (
                $uploadedImage !== null &&
                $existingImage !== $uploadedImage
            ) {
                deleteProjectImage($existingImage);
            }

            sendResponse(true, "Project updated successfully.", [
                "id" => $id,
                "image" => $image
            ]);
        }

        $stmt = $pdo->prepare(
            "INSERT INTO projects
                (title, description, project_url, image, is_active)
             VALUES (?, ?, ?, ?, ?)"
        );

        $stmt->execute([
            $title,
            $description ?: null,
            $projectUrl ?: null,
            $image,
            (int)$isActive
        ]);

        sendResponse(true, "Project created successfully.", [
            "id" => (int)$pdo->lastInsertId(),
            "image" => $image
        ], 201);
    }

    /*
    |--------------------------------------------------------------------------
    | DELETE PROJECT
    |--------------------------------------------------------------------------
    */

    if ($method === "DELETE") {
        $id = (int)($input["id"] ?? 0);

        if ($id <= 0) {
            sendResponse(false, "Valid project ID is required.", null, 422);
        }

        $check = $pdo->prepare(
            "SELECT id, image FROM projects WHERE id = ?"
        );
        $check->execute([$id]);
        $project = $check->fetch(PDO::FETCH_ASSOC);

        if (!$project) {
            sendResponse(false, "Project not found.", null, 404);
        }

        $stmt = $pdo->prepare("DELETE FROM projects WHERE id = ?");
        $stmt->execute([$id]);

        deleteProjectImage($project["image"]);

        sendResponse(true, "Project deleted successfully.");
    }

    sendResponse(false, "Method not allowed.", null, 405);

} catch (PDOException $e) {
    error_log("Projects API Error: " . $e->getMessage());

    sendResponse(false, "A database error occurred.", null, 500);

} catch (Throwable $e) {
    error_log("Projects API Error: " . $e->getMessage());

    sendResponse(false, "An unexpected error occurred.", null, 500);
}