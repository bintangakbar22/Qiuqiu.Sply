<?php
include('../connection.php');

if(function_exists($_GET['method'])) {
    $_GET['method']();
};

function get(){
    global $conn;
    $id = $_GET['id_user'];
    $type = $_GET['type'];
    $sql1 = mysqli_query($conn,"SELECT * from notification WHERE receiver_id='$id' AND type='$type' ORDER BY createdAt DESC ");
    $check = mysqli_num_rows($sql1);
    if(!empty($check)){
        while($data = mysqli_fetch_array($sql1)) {
            $id_product = $data["id_product"];
            $id_receiver = $data["receiver_id"];
            $id_user = $data["id_user"];
            $sql2 = mysqli_query($conn,"SELECT * from product WHERE id_product='$id_product'");
            $dataProduct = mysqli_fetch_array($sql2);
            $sql3 = mysqli_query($conn,"SELECT * from user WHERE id_user='$id_receiver'");
            $dataReceiver = mysqli_fetch_array($sql3);  
            $sql4 = mysqli_query($conn,"SELECT * from user WHERE id_user='$id_user'");
            $dataUser = mysqli_fetch_array($sql4);  
            $product=array(
                    "id" =>$dataProduct["id_product"],
                    "name" =>$dataProduct["name"],
                    "description" =>$dataProduct["description"],
                    "base_price" =>intval($dataProduct["price"]),
                    "image_url" =>$dataProduct["image"],
                    "image_name" =>$dataProduct["image"],
                    "location" =>$dataProduct["location"],
                    "user_id" =>$dataProduct["id_user"],
                    "status" =>$dataProduct["status"]
                );
            if($type=="seller"){
                $status = $data["status"];
                    $item[]=array(
                        "id" =>$data["id_notification"],
                        "product_id" =>$data["id_product"],
                        "product_name"=>$dataProduct["name"],
                        "base_price"=>intval($dataProduct["price"]),
                        "transaction_date" =>$data["transaction_date"],
                        "status"=>$data["status"],
                        "receiver_id"   =>$data["receiver_id"],
                        "image_url" =>$dataProduct["image"],
                        "read" =>$data["read"],
                        "createdAt" =>$data["createdAt"],
                        "updatedAt" =>$data["updatedAt"],
                        "Product"   =>$product
                    );
            }else{
                $item[]=array(
                        "id" =>$data["id_notification"],
                        "product_id" =>$data["id_product"],
                        "product_name"=>$dataProduct["name"],
                        "base_price"=>intval($dataProduct["price"]),
                        "transaction_date" =>$data["transaction_date"],
                        "status"=>$data["status"],
                        "receiver_id"   =>$data["receiver_id"],
                        "image_url" =>$dataProduct["image"],
                        "read" =>$data["read"],
                        "createdAt" =>$data["createdAt"],
                        "updatedAt" =>$data["updatedAt"],
                        "Product"   =>$product
                    );
            }
        }
        $message = "Success";
        $response = array(
            'status' => 'OK',
            'data' => $item,
            "message" => $message
        );
    }else{
        $message = "Product does not exist";
        $response = array(
            'status' => 'Failed',
            'data' => [],
            "message" => $message
        );
    }
    echo json_encode($response);
}

function patch(){
    global $conn;
    global $decodedData;
}

    