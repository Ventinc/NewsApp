<?php
// Application middleware

// Ajout du middleware d'authentification JWT
$app->add(new \Slim\Middleware\JwtAuthentication([
  "attribute" => "jwt",
  "path" => "/api",
  "secure" => false,
  "passthrough" => ["/api/news", "/api/user/register", "/api/user/login"],
  "secret" => "mysecrettoken",
  "error" => function($request, $response, $args) {
    $data["success"] = false;
    $data["message"] = "Besoin d'un token d'authentification";
    return $response
          ->withHeader("Content-Type", "application/json")
          ->write(json_encode($data, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
  }
]));
