<?php
header('Content-Type: application/json');

// 显示所有错误信息
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// 定义项目根目录
define('ROOT_PATH', __DIR__);

// 输出API使用说明
echo json_encode([
    'status' => 'success',
    'message' => '音乐管理系统API'
]); 