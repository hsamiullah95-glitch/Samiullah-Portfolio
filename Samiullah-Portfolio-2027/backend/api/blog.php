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
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
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

function saveBlogImage() {
    if (empty($_FILES["image_file"]["name"])) {
        return null;
    }

    $file = $_FILES["image_file"];
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
        "image/webp" => "webp",
        "image/gif" => "gif"
    ];

    if (!isset($allowed[$mime])) {
        sendResponse(false, "Only JPG, PNG, WEBP and GIF images are allowed.", null, 422);
    }

    $folder = dirname(__DIR__) . "/uploads/blog/";
    if (!is_dir($folder) && !mkdir($folder, 0755, true)) {
        sendResponse(false, "Could not create image folder.", null, 500);
    }

    $filename = bin2hex(random_bytes(16)) . "." . $allowed[$mime];
    if (!move_uploaded_file($file["tmp_name"], $folder . $filename)) {
        sendResponse(false, "Could not save image.", null, 500);
    }

    return "uploads/blog/" . $filename;
}

$input = ($method === "POST")
    ? $_POST
    : json_decode(file_get_contents("php://input"), true);

if (!is_array($input)) {
    $input = [];
}

if ($method === "POST" && ($input["_method"] ?? "") === "PUT") {
    $method = "PUT";
}

try {
    if ($method === "GET") {
        $publicOnly = ($_GET["public"] ?? "") === "1";
        $sql = $publicOnly
            ? "SELECT * FROM blog_posts WHERE status = 'published' ORDER BY id DESC"
            : "SELECT * FROM blog_posts ORDER BY id DESC";
        $stmt = $pdo->query($sql);
        sendResponse(true, "Blog posts loaded successfully.", $stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    if ($method === "POST") {
        $title = trim($input["title"] ?? "");
        $slug = trim($input["slug"] ?? "");
        $excerpt = trim($input["excerpt"] ?? "");
        $content = trim($input["content"] ?? "");
        $image = trim($input["image"] ?? "");
        $category = trim($input["category"] ?? "General");
        $status = $input["status"] ?? "draft";

        if ($title === "" || $content === "") {
            sendResponse(false, "Title and content are required.", null, 422);
        }
        if ($slug === "") {
            $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title), '-'));
        }
        if (!in_array($status, ["draft", "published"], true)) {
            sendResponse(false, "Invalid post status.", null, 422);
        }

        $uploadedImage = saveBlogImage();
        if ($uploadedImage !== null) {
            $image = $uploadedImage;
        }

        $stmt = $pdo->prepare(
            "INSERT INTO blog_posts (title, slug, excerpt, content, image, category, status)
             VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        $stmt->execute([
            $title, $slug, $excerpt, $content,
            $image ?: null, $category ?: "General", $status
        ]);

        sendResponse(true, "Blog post created successfully.", [
            "id" => $pdo->lastInsertId()
        ], 201);
    }

    if ($method === "PUT") {
        $id = (int)($input["id"] ?? 0);
        if ($id <= 0) {
            sendResponse(false, "Valid post ID is required.", null, 422);
        }

        $title = trim($input["title"] ?? "");
        $slug = trim($input["slug"] ?? "");
        $excerpt = trim($input["excerpt"] ?? "");
        $content = trim($input["content"] ?? "");
        $image = trim($input["image"] ?? "");
        $category = trim($input["category"] ?? "General");
        $status = $input["status"] ?? "draft";

        if ($title === "" || $content === "") {
            sendResponse(false, "Title and content are required.", null, 422);
        }
        if ($slug === "") {
            $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title), '-'));
        }
        if (!in_array($status, ["draft", "published"], true)) {
            sendResponse(false, "Invalid post status.", null, 422);
        }

        $uploadedImage = saveBlogImage();
        if ($uploadedImage !== null) {
            $image = $uploadedImage;
        }

        $stmt = $pdo->prepare(
            "UPDATE blog_posts
             SET title=?, slug=?, excerpt=?, content=?, image=?, category=?, status=?
             WHERE id=?"
        );
        $stmt->execute([
            $title, $slug, $excerpt, $content,
            $image ?: null, $category ?: "General", $status, $id
        ]);

        sendResponse(true, "Blog post updated successfully.");
    }

    if ($method === "DELETE") {
        $id = (int)($input["id"] ?? $_GET["id"] ?? 0);
        if ($id <= 0) {
            sendResponse(false, "Valid post ID is required.", null, 422);
        }
        $stmt = $pdo->prepare("DELETE FROM blog_posts WHERE id=?");
        $stmt->execute([$id]);
        sendResponse(true, "Blog post deleted successfully.");
    }

    sendResponse(false, "Method not allowed.", null, 405);

} catch (PDOException $e) {
    error_log("Blog API Error: " . $e->getMessage());
    if ($e->getCode() === "23000") {
        sendResponse(false, "This blog slug already exists.", null, 409);
    }
    sendResponse(false, "A database error occurred.", null, 500);

} catch (Throwable $e) {
    error_log("Blog API Error: " . $e->getMessage());
    sendResponse(false, "An unexpected error occurred.", null, 500);
}