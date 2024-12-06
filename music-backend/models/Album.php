<?php
require_once '../config/database.php';

class Album {
    private $conn;
    private $table = 'Album';
    
    public function __construct() {
        $db = new Database();
        $this->conn = $db->connect();
    }
    
    // 获取所有专辑
    public function getAll() {
        $query = "SELECT * FROM {$this->table} ORDER BY AlbumID";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    // 根据艺术家获取专辑
    public function getByArtist($artist) {
        $query = "SELECT * FROM {$this->table} WHERE Artist = ? ORDER BY ReleaseDate DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$artist]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?> 