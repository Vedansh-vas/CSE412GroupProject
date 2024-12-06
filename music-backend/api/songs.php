<?php
// 启用输出缓冲，这样我们可以在之后设置 headers
ob_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

require_once '../models/Song.php';

$song = new Song();
$response = ['status' => 'success'];

// 获取请求方法
$method = $_SERVER['REQUEST_METHOD'];

// 获取请求路径
$path_info = isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : '';
$request = $path_info ? explode('/', trim($path_info,'/')) : [];

switch($method) {
    case 'GET':
        if(isset($_GET['search'])) {
            // 搜索音乐
            $response['data'] = $song->search($_GET['search']);
        } elseif(!empty($request[0]) && is_numeric($request[0])) {
            // 获取单个音乐
            $result = $song->getOne($request[0]);
            if(!$result) {
                $response = [
                    'status' => 'error',
                    'message' => '��找到该音乐'
                ];
                http_response_code(404);
            } else {
                $response['data'] = $result;
            }
        } else {
            // 获取所有音乐
            $response['data'] = $song->getAll();
        }
        break;
        
    case 'POST':
        // 创建新音乐
        $data = json_decode(file_get_contents('php://input'), true);
        if(!$data) {
            http_response_code(400);
            $response = [
                'status' => 'error',
                'message' => '无效的请求数据'
            ];
        } else {
            $newId = $song->create($data);
            if($newId) {
                http_response_code(201);
                $response = [
                    'status' => 'success',
                    'message' => '创建成功',
                    'data' => [
                        'SongID' => $newId,
                        'Title' => $data['Title'],
                        'Artist' => $data['Artist']
                    ]
                ];
            } else {
                http_response_code(500);
                $response = [
                    'status' => 'error',
                    'message' => '创建失败'
                ];
            }
        }
        break;
        
    case 'PUT':
        // 更新音乐
        if(!empty($request[0]) && is_numeric($request[0])) {
            $data = json_decode(file_get_contents('php://input'), true);
            if(!$data) {
                http_response_code(400);
                $response = [
                    'status' => 'error',
                    'message' => '无效的请求数据'
                ];
            } elseif($song->update($request[0], $data)) {
                $response['message'] = '更新成功';
            } else {
                http_response_code(500);
                $response = [
                    'status' => 'error',
                    'message' => '更新失败'
                ];
            }
        } else {
            http_response_code(400);
            $response = [
                'status' => 'error',
                'message' => '请提供有效的ID'
            ];
        }
        break;
        
    case 'DELETE':
        // 删除音乐
        if(!empty($request[0]) && is_numeric($request[0])) {
            if($song->delete($request[0])) {
                $response['message'] = '删除成功';
            } else {
                http_response_code(500);
                $response = [
                    'status' => 'error',
                    'message' => '删除失败'
                ];
            }
        } else {
            http_response_code(400);
            $response = [
                'status' => 'error',
                'message' => '请提供有效的ID'
            ];
        }
        break;
        
    case 'OPTIONS':
        // 处理预检请求
        http_response_code(200);
        break;
        
    default:
        http_response_code(405);
        $response = [
            'status' => 'error',
            'message' => '不支持的请求方法'
        ];
        break;
}

// 输出响应
echo json_encode($response);

// 结束输出缓冲并发送
ob_end_flush();
?> 