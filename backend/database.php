<?php
class Database {
    // private $host = "localhost";
    // private $db_name = "exam";
    // private $username = "root";
    // private $password = ""; 
    private $host = "fdb1029.awardspace.net";
    private $db_name = "4533990_exam";
    private $username = "4533990_exam";
    private $password = "Antoniomeza.28"; 
    public $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
        } catch (PDOException $exception) {
            echo "Error de conexión: " . $exception->getMessage();
        }

        return $this->conn;
    }

    public function create($table_name, $data) {
        $fields = implode(", ", array_keys($data));
        $placeholders = ":" . implode(", :", array_keys($data));

        $query = "INSERT INTO " . $table_name . " ($fields) VALUES ($placeholders)";
        $stmt = $this->conn->prepare($query);

        foreach ($data as $key => $value) {
            $stmt->bindValue(":$key", htmlspecialchars(strip_tags($value)));
        }

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    public function readAll($table_name, $condition) {
        $query = "SELECT * FROM " . $table_name." WHERE ".$condition;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function update($table_name, $id, $data, $id_user) {
        $fields = "";
        foreach ($data as $key => $value) {
            $fields .= "$key = :$key, ";
        }
        $fields = rtrim($fields, ", ");

        $query = "UPDATE " . $table_name . " SET $fields WHERE id = :id AND id_user = :id_user";
        $stmt = $this->conn->prepare($query);

        foreach ($data as $key => $value) {
            $stmt->bindValue(":$key", htmlspecialchars(strip_tags($value)));
        }
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':id_user', $id_user);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    public function delete($table_name, $id, $id_user) {
        $query = "DELETE FROM " . $table_name . " WHERE id = :id AND id_user = :id_user";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':id_user', $id_user);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

}
?>
