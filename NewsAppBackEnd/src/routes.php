<?php

use Slim\Http\Request;
use Slim\Http\Response;

// ## ROUTES ##

//Permet de récuperer tous les noms utilisateurs
$app->get('/users', function (Request $request, Response $response, array $args) {
    $sth = $this->db->prepare("SELECT username FROM users");
    $sth->execute();
    $users = $sth->fetchAll();
    return $this->response->withJson($users);
});

//Permet de récuperer tous les news
$app->get('/news', function (Request $request, Response $response, array $args) {
  $sth = $this->db->prepare("SELECT * FROM news");
  $sth->execute();
  $news = $sth->fetchAll();
  return $this->response->withJson($news);
});
