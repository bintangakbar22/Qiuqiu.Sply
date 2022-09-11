<?php
include('../connection.php');

if(function_exists($_GET['method'])) {
    $_GET['method']();
};

function get(){
    global $conn;
    $id = $_GET['id'];
    if(isset($_GET['id_product'])){  
        $id_product = $_GET['id_product'];
        $sql1 = mysqli_query($conn,"SELECT * from product WHERE id_user='$id' AND id_product ='$id_product'");
    }else{
        $sql1 = mysqli_query($conn,"SELECT * from product WHERE id_user='$id'");
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

            $product = array(
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
                "category" =>$dataCategory["name"],
                "category_id" =>$dataCategory["id_category"],
                "stock" =>$data["stock"]
            ); 
            if(isset($_GET['id_product'])){
                $item= $product;
            }else{
                $item[]= $product;
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

function update(){
    global $conn;
    global $decodedData;

    $id_product = $decodedData['id_product'];
    $id_user = $decodedData['id_user'];
    $name = $decodedData['name'];
    $description = $decodedData['description'];
    $price = $decodedData['price'];
    $category_ids = $decodedData['category_ids'];
    $condition = $decodedData['condition'];
    $stock = $decodedData['stock'];
    if($condition=="1" OR $condition==1){
        $c="New";
    }else{
        $c="Second";
    }
    $location = $decodedData['location'];
    date_default_timezone_set('Asia/Jakarta');
    $timestamp = time();
    $formatted = date('Y-m-d H:i:s ', $timestamp);
    
    $qry1 = "UPDATE product SET name='$name', description='$description', price='$price', category_ids='$category_ids', location='$location',
    id_user='$id_user',conditionPrdct = '$c',updatedAt='$formatted',stock='$stock' WHERE id_product = '$id_product'";
    $sql1 = mysqli_query($conn,$qry1);
    if($sql1){
        $sql2=mysqli_query($conn,"SELECT * FROM product WHERE updatedAt ='$formatted'");
        if($sql2){
            while($data= mysqli_fetch_array($sql2)){
                $id_product = $data['id_product'];
            }
            $qry3 = "INSERT INTO notification (id_user,id_product,receiver_id,status,type) VALUES 
                    ('$id_user','$id_product','$id_user','create','seller')";
            $sql3 = mysqli_query($conn,$qry3);
            if($sql3){
                $item = array(
                    'id_product' => $id_product
                );
                $message ="Success";
            }else{
                $message = "Failed Notif";
            }
        }else{
            $message = "Failed Search Product";
        }
    }else{
        $message ="Failed Update Product";
    }
    $response = array(
        'status' => 'OK',
        'data' => $item,
        "message" => $message
    );
    

    echo json_encode($response);
    
}

function delete(){
    global $conn;
    global $decodedData;

    $id_user = $decodedData['id_user'];
    $id_product = $decodedData['id_product'];
    $qry1 = "DELETE FROM product WHERE id_user='$id_user' AND id_product='$id_product'";
    $sql1 = mysqli_query($conn,$qry1);
    if($sql1){
        $message = "Success";
    }else{
        $message = "Failed";
    }
     $response = array(
        'status' => 'OK',
        "message" => $message
    );
    echo json_encode($response);
}

function post(){
    
    global $conn;
    global $decodedData;
    $id_user = $decodedData['id_user'];
    $name = $decodedData['name'];
    $description = $decodedData['description'];
    $price = $decodedData['price'];
    $category_ids = $decodedData['category_ids'];
    $condition = $decodedData['condition'];
    $location = $decodedData['location'];
    $stock = $decodedData['stock'];
    $image = "";
    date_default_timezone_set('Asia/Jakarta');
    $timestamp = time();
    $formatted = date('Y-m-d H:i:s ', $timestamp);

    $qry1 = "INSERT INTO product (name,description,price,category_ids,location,image,id_user,conditionPrdct,createdAt,updatedAt,stock) VALUES 
            ('$name','$description',$price,'$category_ids','$location','$image','$id_user','$condition','$formatted','$formatted','$stock')";
    $sql1 = mysqli_query($conn,$qry1);
    if($sql1){
        $sql2=mysqli_query($conn,"SELECT * FROM product WHERE createdAt ='$formatted'");
        $checkk=mysqli_num_rows($sql2); 
        if(!empty($checkk)){
            while($data= mysqli_fetch_array($sql2)){
                $id_product = $data['id_product'];
            }
            $qry3 = "INSERT INTO notification (id_user,id_product,receiver_id,status,type,createdAt,updatedAt) VALUES 
                    ('$id_user','$id_product','$id_user','create','seller','$formatted','$formatted')";
            $sql3 = mysqli_query($conn,$qry3);
            if($sql3){
                $item = array(
                    'id_product' => $id_product
                );
                $message ="Success";
            }else{
                $message = "Failed Notif";
            }
        }else{
            $message = "Failed Search Product";
        }
    }else{
        $message ="Failed Post Product";
    }
    $response = array(
        'status' => 'OK',
        'data' => $item,
        "message" => $message
    );
    

    echo json_encode($response);
}

function uploadPhoto(){
    global $conn;
    global $decodedData;
	$target_dir = "../images/product";
    $filename = rand() . "_"  . ".jpeg";
	$target_dir = $target_dir . "/" . $filename;
	$id = $_POST["id_product"];
	if(move_uploaded_file($_FILES['image']['tmp_name'], $target_dir)){
        $qry = "UPDATE product  SET image='$filename' WHERE id_product ='$id'";
		if (mysqli_query($conn, $qry)) {
            $MESSAGE = "Image Uploaded Successfully." ;
        }else{
            $MESSAGE = mysqli_error() ;
        }
        header('Content-Type: application/json');
		echo json_encode($MESSAGE);
	}
}
