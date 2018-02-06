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
    $sth->execute(array($username, md5($password)));

    return $response->withJson(['success' => true, 'message' => 'User created !']);
  });

  $this->post('/user/login', function(Request $request, Response $response, array $args) {
    $body = $request->getParsedBody();

    $username = $body["username"];
    $password = $body["password"];

    if (empty($username) || !isset($username) || empty($password) && !isset($password)) {
      return $response->withJson(['success' => false, 'message' => 'Need username and password']);
    }

    $sth = $this->db->prepare("SELECT username FROM users WHERE username = ? && password = ?");
    $sth->execute(array($username, md5($password)));

    $users = $sth->fetchAll();

    if (count($users) <= 0) {
      return $response->withJson(['success' => false, 'message' => 'Username or Password is not correct']);
    }

    $now = new DateTime();
    $future = new DateTime("+1 hour");
    $server = $request->getServerParams();
    $jti= (new Base62)->encode(random_bytes(16));
    $payload = [
      "iat" => $now->getTimeStamp(),
      "exp" => $future->getTimeStamp(),
      "jti" => $jti,
      "sub" => $server["PHP_AUTH_USER"]
    ];

    $secret = "mysecrettoken";
    $token = JWT::encode($payload, $secret, "HS256");

    return $response->withJson(['success' => true, 'token' => $token, 'expire' => $future->getTimeStamp()]);
  });

  //Permet de récuperer tous les news
  $this->get('/news', function (Request $request, Response $response, array $args) {
    $sth = $this->db->prepare("SELECT * FROM news");
    $sth->execute();
    $news = $sth->fetchAll();
    $json["success"] = true;
    $json["data"] = $news;
    return $this->response->withJson($json);
  });

});
