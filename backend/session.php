<?php
session_start();
header("Access-Control-Allow-Origin: *"); // Permitir cualquier origen
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

$action = $_GET['action'] ?? '';
    switch($action){
        case 'login':
            $_POST = json_decode(file_get_contents('php://input'), true);

            if(isset($_POST['username']) && isset($_POST['password'])){
                $_SESSION['username'] = $_POST['username'];
                $response['message'] = 'Login succesful';
                $response['data'] = $_POST['username'];
                echo json_encode($response);
            }else{
                $response['message'] = 'Parameter required';
                echo json_encode($response);
            }
            break;
        case 'logout':
            session_destroy();
            $response['message'] = 'Logout successful';
            echo json_encode($response);
            break;
        case 'check':
            if (isset($_SESSION['username'])){
                $response['loggedIn'] = true;
                $response['username'] = $_SESSION['username'];
                echo json_encode($response);
            } else {
                $response['loggedIn'] = false;
                echo json_encode($response);
            }
            break;
    }

?>