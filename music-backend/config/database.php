<?php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '775188880yhr');
define('DB_NAME', 'music_management');

class Database {
    private $conn;
    
    public function connect() {
        try {
            $this->conn = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
                DB_USER,
                DB_PASS
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $this->conn;
        } catch(PDOException $e) {
            echo "连接失败: " . $e->getMessage();
            return null;
        }
    }
}
?> 