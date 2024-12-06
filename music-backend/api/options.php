<?php
ob_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

require_once '../models/Genre.php';
require_once '../models/Album.php';

$response = ['status' => 'success'];

// 获取请求方法
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // 获取请求路径
    $path_info = isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : '';
    $request = $path_info ? explode('/', trim($path_info,'/')) : [];
    
    switch($request[0] ?? '') {
        case 'genres':
            $genre = new Genre();
            $response['data'] = $genre->getAll();
            break;
            
        case 'albums':
            $album = new Album();
            if (isset($_GET['artist'])) {
                $response['data'] = $album->getByArtist($_GET['artist']);
            } else {
                $response['data'] = $album->getAll();
            }
            break;
            
        default:
            // 同时返回所有选项数据
            $genre = new Genre();
            $album = new Album();
            $response['data'] = [
                'genres' => $genre->getAll(),
                'albums' => $album->getAll()
            ];
            break;
    }
} else {
    http_response_code(405);
    $response = [
        'status' => 'error',
        'message' => '不支持的请求方法'
    ];
}

// 输出响应
echo json_encode($response);
ob_end_flush();
?> 