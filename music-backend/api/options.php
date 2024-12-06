<?php
ob_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

require_once '../models/Genre.php';
require_once '../models/Album.php';

$response = ['status' => 'success'];

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
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
        'message' => 'error'
    ];
}

echo json_encode($response);
ob_end_flush();
?> 
