<?php
include('../connection.php');

if(function_exists($_GET['method'])) {
    $_GET['method']();
};

function get(){
    global $conn;
    $id_user= $_GET['id'];
    $sql1 = mysqli_query($conn,"SELECT * from wishlist where id_user='$id_user'");  
    $check = mysqli_num_rows($sql1);
    if(!empty($check)){
        while($data = mysqli_fetch_array($sql1)) {
            $id_product = $data["id_product"];
            $sql2 = mysqli_query($conn,"SELECT * from product WHERE id_product='$id_product'");
            $dataProduct = mysqli_fetch_array($sql2); 
            if(!empty($check)){
                $product=array(
                    "id" =>$dataProduct["id_product"],
                    "name" =>$dataProduct["name"],
                    "description" =>$dataProduct["description"],
                    "base_price" =>intval($dataProduct["price"]),
                    "image_url" =>$dataProduct["image"],
                    "image_name" =>$dataProduct["image"],
                    "location" =>$dataProduct["location"],
                    "user_id" =>$dataProduct["id_user"],
                    "status" =>$dataProduct["status"],
                );
                $item[]=array(
                    "id" =>$data["id_wishlist"],
                    "product_id" =>$dataProduct["id_product"],
                    "user_id" =>$data["id_user"],
                    "Product" =>$product,
                );
            }else{
                $item= [];
            }
        }
        $message = "Success";
        $response = array(
            'status' => 'OK',
            'data' => $item,
            "message" => $message
        );
    }else{
        $message = "Success";
        $response = array(
            'status' => 'OK',
            'data' => [],
            "message" => $message
        );
    }
    echo json_encode($response);
}

function post(){
    global $conn;
    global $decodedData;
    $id = $decodedData['id_user'];
    $product_id = $decodedData['product_id'];
     date_default_timezone_set('Asia/Jakarta');
    $timestamp = time();
    $formatted = date('Y-m-d H:i:s ', $timestamp);
    $qry1 = "INSERT INTO wishlist (id_user,id_product,createdAt) VALUES ('$id','$product_id','$formatted')";
    $sql1 = mysqli_query($conn,$qry1);
    if($sql1){
        $message ="Success";
    }else{
        $message ="Failed";
    }
    $response = array(
        'status' => 'OK',
        "message" => $message
    );
    echo json_encode($response);
}

function delete(){
    global $conn;
    global $decodedData;
    $id_user = $decodedData['id_user'];
    $id_wishlist = $decodedData['id_wishlist'];
    $qry1 = "DELETE FROM wishlist WHERE id_user='$id_user' AND id_wishlist ='$id_wishlist'";
    $sql1 = mysqli_query($conn,$qry1);
    if($sql1){
        $message ="Success";
    }else{
        $message ="Failed";
    }
    $response = array(
        'status' => 'OK',
        "message" => $message
    );
    echo json_encode($response);
}

