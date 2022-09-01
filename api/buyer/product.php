<?php
include('../connection.php');

if(function_exists($_GET['method'])) {
    $_GET['method']();
};

function get(){
    global $conn;
    if(isset($_GET['category_id'])){
      $category_id = $_GET['category_id'];
      $sql1 = mysqli_query($conn,"SELECT * from product WHERE category_ids='$category_id' AND status='available'");
    }else if(isset($_GET['search'])){
      $search = $_GET['search'];
      $sql1 = mysqli_query($conn,"SELECT * from product WHERE name like '%".$search."%' AND status='available'");
    }else{
      $sql1 = mysqli_query($conn,"SELECT * from product WHERE status='available' ORDER BY updatedAt DESC");  
    }
    $check = mysqli_num_rows($sql1);
    if(!empty($check)){
        while($data = mysqli_fetch_array($sql1)) {
            $id_category = $data["category_ids"];
            $sql2 = mysqli_query($conn,"SELECT * from category WHERE id_category='$id_category'");
            $dataCategory = mysqli_fetch_array($sql2);
            $checkCondition = $data["conditionPrdct"];
            if($checkCondition=="New"){
                $id_condition =1;
            }else{
                $id_condition =2;
            }
            if(!empty($check)){
                $item[]=array(
                    "id" =>$data["id_product"],
                    "name" =>$data["name"],
                    "description" =>$data["description"],
                    "base_price" =>intval($data["price"]),
                    "image_url" =>$data["image"],
                    "image_name" =>$data["image"],
                    "location" =>$data["location"],
                    "user_id" =>$data["id_user"],
                    "condition" =>$data["conditionPrdct"],
                    "id_condition" =>$id_condition,
                    "createdAt" =>$data["createdAt"],
                    "updatedAt" =>$data["updatedAt"],
                    "category" =>$dataCategory["name"]
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

function get_spesific(){
    global $conn;
    $id_product = $_GET['id'];  
    $sql1 = mysqli_query($conn,"SELECT * from product WHERE id_product ='$id_product'");  
    $check = mysqli_num_rows($sql1);
    if(!empty($check)){
        while($data = mysqli_fetch_array($sql1)) {
            $id_category = $data["category_ids"];
            $id_user = $data["id_user"];
            $sql2 = mysqli_query($conn,"SELECT * from category WHERE id_category='$id_category'");
            $dataCategory = mysqli_fetch_array($sql2); 
            $sql3 = mysqli_query($conn,"SELECT * from user WHERE id_user='$id_user'");
            $dataSeller = mysqli_fetch_array($sql3); 

            $Seller=array(
                    "id" =>$dataSeller["id_user"],
                    "full_name" =>$dataSeller["full_name"],
                    "email" =>$dataSeller["email"],
                    "phone_number" =>$dataSeller["phone_number"],
                    "address" =>$dataSeller["address"],
                    "city" =>$dataSeller["city"],
                    "image_url"=> $dataSeller["image"],
                );
            if(!empty($check)){
                $item=array(
                    "id" =>$data["id_product"],
                    "name" =>$data["name"],
                    "description" =>$data["description"],
                    "base_price" =>intval($data["price"]),
                    "image_url" =>$data["image"],
                    "image_name" =>$data["image"],
                    "location" =>$data["location"],
                    "user_id" =>$data["id_user"],
                    "createdAt" =>$data["createdAt"],
                    "updatedAt" =>$data["updatedAt"],
                    "category" =>$dataCategory["name"],
                    "User" => $Seller
                );
            }else{
                $item= array();
            }
        }
        $message = "Success";
        $response = array(
            'status' => 'OK',
            'data' => $item,
            "message" => $message
        );
    }else{
        $message = "Failed";
        $response = array(
            'status' => 'OK',
            'data' => array(),
            "message" => $message
        );
    }
    echo json_encode($response);
}