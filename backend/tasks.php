<?php
header("Access-Control-Allow-Origin: *"); // Permitir cualquier origen
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

    header("Content-Type: application/json; charset=UTF-8");
    include_once("database.php");
    
    $database = new Database();
    $db = $database->getConnection();
    $table_name = "tasks";

    switch($_SERVER['REQUEST_METHOD']){
        case 'POST':
            //filling post array
            $_POST = json_decode(file_get_contents('php://input'), true);
            
            if(!isset($_POST['id_user']) || !isset($_POST['title']) || !isset($_POST['description']) || !isset($_POST['due_date']) || !isset($_POST['completed'])){
                $response["message"] = "Missing data";
                echo json_encode($response);
                break;
            }

            if($database->create($table_name, $_POST)){
                $response["message"] = "Task saved";
                $response["data"] = json_encode($_POST);
            }else{
                $response["message"] = "Cannot save the task";
            }

            echo json_encode($response);
            break;

        case 'GET':
            if(!isset($_GET['id_user'])){
                $response["message"] = "Missing parameter";
                echo json_encode($response);
                break;
            }
            $tasks = $database->readAll($table_name,"id_user = ".$_GET['id_user']);
            if(!empty($tasks)){
                $response["message"] = "Show user ".$_GET["id_user"]." tasks";
                $response["data"] = json_encode($tasks);
            }else{
                $response["message"] = "There are no tasks";
            }
            echo json_encode($response);      
            break;
        
        case 'PUT':
            $_PUT = json_decode(file_get_contents('php://input'), true);

            if(!isset($_PUT['title']) || !isset($_PUT['description']) || !isset($_PUT['due_date']) || !isset($_PUT['completed'])){
                $response["message"] = "Missing data";
                echo json_encode($response);
                break;
            }

            if($database->update($table_name, $_GET['id'], $_PUT, $_GET['id_user'])){
                $response["message"] = "Updated task ".$_GET['id']." from user ".$_GET['id_user'].json_encode($_PUT);
            }else{
                $response["message"] = "Cannot update";
            }
            
            echo json_encode($response);
            break;

        case 'DELETE':

            if(!isset($_GET['id']) || !isset($_GET['id_user'])){
                $response["message"] = "Missing parameters";
                echo json_encode($response);
                break;
            }

            if($database->delete($table_name, $_GET['id'], $_GET['id_user'])){
                $response["message"] = "Deleted task ".$_GET['id']." from user: ".$_GET['id_user'];
            }else{
                $response["message"] = "Cannot delete";
            }
            echo json_encode($response);
            break;
    }

?>