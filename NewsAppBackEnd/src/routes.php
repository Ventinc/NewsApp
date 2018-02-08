<?php

use Slim\Http\Request;
use Slim\Http\Response;
use Tuupola\Base62;
use Firebase\JWT\JWT;

// ## ROUTES ##

// Grouper toutes les routes dans /api


$app->group("/api", function() {

  //Permet de récuperer tous les noms utilisateurs
  $this->get('/users', function (Request $request, Response $response, array $args) {
      $sth = $this->db->prepare("SELECT username FROM users");
      $sth->execute();
      $users = $sth->fetchAll();
      $json["success"] = true;
      $json["data"] = $users;
      return $this->response->withJson($json);
  });

  //Permet d'enregistrer un utilisateur en base de données
  $this->post('/user/register', function(Request $request, Response $response, array $args) {
    $body = $request->getParsedBody();

    $username = $body["username"];
    $password = $body["password"];

    if (empty($username) || !isset($username) || empty($password) && !isset($password)) {
      return $response->withJson(['success' => false, 'message' => 'Need username and password']);
    }

    $sth = $this->db->prepare("SELECT username FROM users WHERE username = ?");
    $sth->execute(array($username));

    $users = $sth->fetchAll();

    if (count($users) > 0) {
      return $response->withJson(['success' => false, 'message' => 'Username already exist']);
    }

    $sth = $this->db->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    $sth->execute(array($username, password_hash($password, PASSWORD_DEFAULT)));

    return $response->withJson(['success' => true, 'message' => 'User created !']);
  });

  // Route pour se logger
  $this->post('/user/login', function(Request $request, Response $response, array $args) {
    $body = $request->getParsedBody();

    $username = $body["username"];
    $password = $body["password"];

    if (empty($username) || !isset($username) || empty($password) && !isset($password)) {
      return $response->withJson(['success' => false, 'message' => 'Need username and password']);
    }

    $sth = $this->db->prepare("SELECT * FROM users WHERE username = ?");
    $sth->execute(array($username));

    $user = $sth->fetch();

    if (!password_verify($password, $user["password"])) {
      return $response->withJson(['success' => false, 'message' => 'Username or Password is not correct']);
    }

    $now = new DateTime();
    $future = new DateTime("+1 hour");
    $jti= (new Base62)->encode(random_bytes(16));
    $payload = [
      "iat" => $now->getTimeStamp(),
      "exp" => $future->getTimeStamp(),
      "jti" => $jti,
      "user_id" => $user['id']
    ];

    $secret = "mysecrettoken";
    $token = JWT::encode($payload, $secret, "HS256");

    return $response->withJson(['success' => true, 'token' => $token, 'expire' => $future->getTimeStamp()]);
  });

  //Permet de récuperer tous les news
  $this->get('/news', function (Request $request, Response $response, array $args) {
    $sth = $this->db->prepare("SELECT news.id, news.title, news.content, users.username AS author FROM news INNER JOIN users ON users.id = news.user_id");
    $sth->execute();
    $news = $sth->fetchAll();
    $json["success"] = true;
    $json["data"] = $news;
    return $this->response->withJson($json);
  });

  //Permet d'ajouter une nouveauté en base de données
  $this->post('/article/create', function (Request $request, Response $response, array $args) {
    $body = $request->getParsedBody();
    $jwt = $request->getAttribute("jwt");

    $title = $body["title"];
    $content = $body["content"];
    $user_id = $jwt->user_id;

    if (empty($title) || !isset($title) || empty($content) && !isset($contentn)) {
      return $response->withJson(['success' => false, 'message' => 'Need title and content']);
    }

    $sth = $this->db->prepare("INSERT INTO news (title, content, user_id) VALUES (?, ?, ?)");
    $sth->execute(array($title, $content, $user_id));

    return $this->response->withJson(["success" => true, "message" => "New article posted !"]);
  });

  //Permet de récuperer les infos de l'utilisateur
  $this->get('/user/me', function (Request $request, Response $response, array $args) {
    $jwt = $request->getAttribute("jwt");

    $sth = $this->db->prepare("SELECT users.username FROM users WHERE users.id = ?");
    $sth->execute(array($jwt->user_id));
    $user = $sth->fetch();
    $json["success"] = true;
    $json["data"] = $user;
    return $this->response->withJson($json);
  });

});
