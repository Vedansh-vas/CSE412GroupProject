<?php
require_once '../config/database.php';

class Genre {
    private $conn;
    private $table = 'Genre';
    
    public function __construct() {
        $db = new Database();
        $this->conn = $db->connect();
    }
    
    // 获取所有流派
    public function getAll() {
        $query = "SELECT * FROM {$this->table} ORDER BY GenreID";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?> 