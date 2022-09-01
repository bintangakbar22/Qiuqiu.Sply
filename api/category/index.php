<?php
include('../connection.php');

if(function_exists($_GET['method'])) {
    $_GET['method']();
};

function get(){
    global $conn;
    $sql1 = mysqli_query($conn,"SELECT * from category");
    $check = mysqli_num_rows($sql1);
    if(!empty($check)){
        while($data = mysqli_fetch_array($sql1)) {
            $name = $data["name"];
            $id= $data["id_category"];
            $productSelect[] = array(
                "label" =>  $name,
                "value" =>  intval($id),    
            );
            $category[]=array(
                "id" =>$id,
                "name" =>$name,
            );
        }
        $message = "Success";
        $response = array(
            'status' => 'OK',
            'data' => $category,
            'category' =>$productSelect,
            "message" => $message
        );
    }else{
        $message = "Failed";
        $response = array(
            'status' => 'Failed',
            'data' => [],
            'category' =>[],
            "message" => $message
        );
    }
    echo json_encode($response);
}

    