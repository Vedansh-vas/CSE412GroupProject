<?php
require_once '../config/database.php';

class Song {
    private $conn;
    private $table = 'Song';
    
    public function __construct() {
        $db = new Database();
        $this->conn = $db->connect();
    }
    
    // 获取所有歌曲
    public function getAll() {
        $query = "SELECT s.*, a.AlbumName, g.GenreName 
                 FROM {$this->table} s 
                 LEFT JOIN Album a ON s.AlbumID = a.AlbumID 
                 LEFT JOIN Genre g ON s.GenreID = g.GenreID 
                 ORDER BY s.SongID";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    // 获取单个歌曲
    public function getOne($id) {
        $query = "SELECT s.*, a.AlbumName, g.GenreName 
                 FROM {$this->table} s 
                 LEFT JOIN Album a ON s.AlbumID = a.AlbumID 
                 LEFT JOIN Genre g ON s.GenreID = g.GenreID 
                 WHERE s.SongID = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    // 搜索歌曲
    public function search($keyword) {
        $keyword = "%{$keyword}%";
        $query = "SELECT s.*, a.AlbumName, g.GenreName 
                 FROM {$this->table} s 
                 LEFT JOIN Album a ON s.AlbumID = a.AlbumID 
                 LEFT JOIN Genre g ON s.GenreID = g.GenreID 
                 WHERE s.Title LIKE ? OR s.Artist LIKE ? OR g.GenreName LIKE ?
                 ORDER BY s.SongID";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$keyword, $keyword, $keyword]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    // 获取最大ID
    private function getMaxId() {
        $query = "SELECT MAX(SongID) as max_id FROM {$this->table}";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return ($result['max_id'] ?? 0) + 1;
    }
    
    // 创建歌曲
    public function create($data) {
        $query = "INSERT INTO {$this->table} 
                 (SongID, Title, ReleaseDate, Artist, Duration, AlbumID, GenreID) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        try {
            $this->conn->beginTransaction();
            
            // 如果没有提供ID，自动生成
            $songId = $data['SongID'] ?? $this->getMaxId();
            
            // 处理空字符串
            $albumId = isset($data['AlbumID']) && $data['AlbumID'] !== '' ? $data['AlbumID'] : null;
            $genreId = isset($data['GenreID']) && $data['GenreID'] !== '' ? $data['GenreID'] : null;
            
            $stmt = $this->conn->prepare($query);
            $result = $stmt->execute([
                $songId,
                $data['Title'],
                $data['ReleaseDate'],
                $data['Artist'],
                $data['Duration'],
                $albumId,
                $genreId
            ]);
            
            if ($result) {
                $this->conn->commit();
                return $songId;
            }
            
            $this->conn->rollBack();
            return false;
            
        } catch (PDOException $e) {
            $this->conn->rollBack();
            return false;
        }
    }
    
    // 更新歌曲
    public function update($id, $data) {
        $query = "UPDATE {$this->table} 
                 SET Title = ?, 
                     ReleaseDate = ?, 
                     Artist = ?, 
                     Duration = ?, 
                     AlbumID = ?, 
                     GenreID = ? 
                 WHERE SongID = ?";
        
        // 处理空字符串
        $albumId = isset($data['AlbumID']) && $data['AlbumID'] !== '' ? $data['AlbumID'] : null;
        $genreId = isset($data['GenreID']) && $data['GenreID'] !== '' ? $data['GenreID'] : null;
        
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([
            $data['Title'],
            $data['ReleaseDate'],
            $data['Artist'],
            $data['Duration'],
            $albumId,
            $genreId,
            $id
        ]);
    }
    
    // 删除歌曲
    public function delete($id) {
        $query = "DELETE FROM {$this->table} WHERE SongID = ?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$id]);
    }
}
?> 