<?php
$request = explode('/', trim($_SERVER['PATH_INFO'],'/'));
$input = json_decode(file_get_contents('php://input'),true);
$route = preg_replace('/[^a-z0-9_]+/i','',array_shift($request));
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Max-Age: 86400');    // cache for 1 day
header("Access-Control-Allow-Methods: GET, POST");   
header("Content-Type: application/json; charset=UTF-8");

    switch ($_SERVER['REQUEST_METHOD']) {
		case 'GET':                    
            if($route=='readcommand'){
                if ($atcommand = file_get_contents("writetodongle.json")){
                    http_response_code(200);                    
                    echo json_encode($atcommand);  
                } 
                else {
                    http_response_code(401);
                    echo "Something went wrong! Try again.";
                }            
            }            
            if($route=='getdongleresponse'){
                if ($response=file_get_contents("readfromdongle.json")){
                    echo $response;
                    http_response_code(200);
                }else{
                    http_response_code(401);
                    echo "Something went wrong! Try again."; 
                }
            }
            break;
        case 'POST':
            $input = json_decode(file_get_contents('php://input'),true);
            if($route=='writetodongle'){
                if (file_put_contents("writetodongle.json", $input['atcommand'])){
                    echo "Command sent successfully...";
                    http_response_code(200);
                }
                else{
                    http_response_code(401);
                    echo "Oops! Error creating json file...";
                }                                
            }
            if($route=='senddongleresponse'){
                $res=$input['response'];
                if (file_put_contents("readfromdongle.json", $res)){
                    echo $res;
                    http_response_code(200);
                }
            }
            break;  
    }

?>