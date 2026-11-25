
<?php

header("Content-Type: text/plain; charset=UTF-8");

try {

    require_once __DIR__ . "/../config/database.php";

    echo "SUCCESS: Shared Database File Connected!";

} catch (Throwable $e) {

    http_response_code(500);

    echo "DATABASE ERROR: " . $e->getMessage();
}
