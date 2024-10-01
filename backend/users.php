<?php
header("Access-Control-Allow-Origin: *"); // Permitir cualquier origen
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

    header("Content-Type: application/json; charset=UTF-8");
    include_once("database.php");

    $database = new Database();
    $db = $database->getConnection();
    $table_name = "users";

    switch($_SERVER['REQUEST_METHOD']){
        case 'POST':
            $_POST = json_decode(file_get_contents('php://input'), true);

            if(!isset($_POST['name']) || !isset($_POST['username']) || !isset($_POST['password'])){
                $response["message"] = "Missing data";
                echo json_encode($response);
                break;
            }

            $database->create($table_name, $_POST);

            $response["message"] = "Save user ".json_encode($_POST);
            echo json_encode($response);
            break;

        case 'GET':
            $users = $database->readAll($table_name,"true");
            if(!empty($users)){
                $response["message"] = "Get all users";
                $response["data"] = json_encode($users);
            }else{
                $response["message"] = "There are no users";
            }
            echo json_encode($response);
            break;
    }

?>