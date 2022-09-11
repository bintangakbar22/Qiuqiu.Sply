<?php
include('../connection.php');

if(function_exists($_GET['method'])) {
    $_GET['method']();
};


function post(){
    global $conn;
    global $decodedData;
    $id_order = $decodedData['id_order'];
    if(isset($_GET['confirm'])){
        $sql = mysqli_query($conn,"UPDATE final_order SET status ='confirmed' WHERE id_order='$id_order'");
    }
    if(isset($_GET['uploadReceipt'])){
        $no_resi = $decodedData['no_resi'];
        $sql = mysqli_query($conn,"UPDATE final_order SET no_resi ='$no_resi',status ='inDelivery' WHERE id_order='$id_order'");
    }
    if(isset($_GET['done'])){
        $sql = mysqli_query($conn,"UPDATE final_order SET status ='done' WHERE id_order='$id_order'");
    }
    if($sql){
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

function get_byid(){
    global $conn;
        $id_seller = $_GET['id_seller'];
        $status = $_GET['status'];
        $sql1 = mysqli_query($conn,"SELECT * FROM final_order WHERE id_seller='$id_seller'  ORDER BY updatedAt");
    $check = mysqli_num_rows($sql1);
    if(!empty($check)){
        while($data=mysqli_fetch_array($sql1)){
            $id_order = $data['id_order'];
            $sql2 = mysqli_query($conn,"SELECT * FROM detail_order WHERE id_order='$id_order'");
            $checkRows = mysqli_num_rows($sql2);
            if($checkRows>1){
                $quantity = $checkRows-1;
            }else{
                $quantity = 0;
            }
            while($detailOrders=mysqli_fetch_array($sql2)){
                $id_product= $detailOrders['id_product'];
                $sql3 = mysqli_query($conn,"SELECT * FROM product WHERE id_product='$id_product'");
                while($dataP = mysqli_fetch_array($sql3)){             
                        $product = array(
                            "id" =>intval($dataP["id_product"]),
                            "name" =>$dataP["name"],
                            "description" =>$dataP["description"],
                            "base_price" =>intval($dataP["price"]),
                            "image_url" =>$dataP["image"],
                            "image_name" =>$dataP["image"],
                            "location" =>$dataP["location"],
                            "user_id" =>$dataP["id_user"],
                            "condition" =>$dataP["conditionPrdct"],
                            "createdAt" =>$dataP["createdAt"],
                            "updatedAt" =>$dataP["updatedAt"],
                            "qty" =>intval($detailOrders['qty']),
                        );
                }
            }   
            $item[]=array(
                "id_order"=>intval($data['id_order']),
                "final_price" => intval($data['final_price']),
                "Product" => $product,
                "createdAt" =>$data["createdAt"],
                "updatedAt" =>$data["updatedAt"],
                "quantity" =>$quantity,
                'status' => $data['status'],

            );
        }

        $response = array(
            'status' => 'OK',
            'data' => $item,
            "message" => 'Success'
        );
    }else{
        $response = array(
            'status' => 'OK',
            'data' => [],
            "message" => 'Failed'
        );
    }
    echo json_encode($response);
}

function get(){
    global $conn;
    $id_order = $_GET['id_order'];
    $sql1 = mysqli_query($conn,"SELECT * FROM final_order WHERE id_order='$id_order'");
    $check = mysqli_num_rows($sql1);
    if(!empty($check)){
        while($data=mysqli_fetch_array($sql1)){
            $id_order = $data['id_order'];
            $final_price = $data['final_price'];
            $sql2 = mysqli_query($conn,"SELECT * FROM detail_order WHERE id_order='$id_order'");
            while($detailOrders=mysqli_fetch_array($sql2)){
                $id_product= $detailOrders['id_product'];
          
                $sql3 = mysqli_query($conn,"SELECT * FROM product WHERE id_product='$id_product' ");
                // $dataObj[] = mysqli_fetch_object($sql3);
                while($dataP = mysqli_fetch_array($sql3)){             
                        $product[] = array(
                            "id" =>intval($dataP["id_product"]),
                            "name" =>$dataP["name"],
                            "description" =>$dataP["description"],
                            "base_price" =>intval($dataP["price"]),
                            "image_url" =>$dataP["image"],
                            "image_name" =>$dataP["image"],
                            "location" =>$dataP["location"],
                            "stock" =>intval($dataP["stock"]),
                            "user_id" =>$dataP["id_user"],
                            "condition" =>$dataP["conditionPrdct"],
                            "createdAt" =>$dataP["createdAt"],
                            "updatedAt" =>$dataP["updatedAt"],
                            "qty" =>intval($detailOrders['qty'])
                        );
                }
            }
            $id_buyer = $data['id_buyer'];
            $sqlBuyer = mysqli_query($conn,"SELECT * FROM user WHERE id_user='$id_buyer'");
            $detailBuyer=mysqli_fetch_object($sqlBuyer);   
            $item = array(
                'id' => intval($id_order),
                'Product' => $product,
                'final_price' => intval($final_price),
                'status' => $data['status'],
                'User' => $detailBuyer,
                'courier' =>  $data['courier'],
                'no_resi' => $data['no_resi'],
            );
        }
        $finalData = array(
            'Orders' => $item,
        );
    }
    $message = "Success";
    
    $response = array(
        'status' => 'OK',
        'data' => $finalData,
        "message" => $message
    );
    echo json_encode($response);
}

function delete(){
    global $conn;
    global $decodedData;
    $id_user = $decodedData['id_user'];
    $id_cart = $decodedData['id_cart'];
    $qry1 = "DELETE FROM cart WHERE id_user='$id_user' AND id_cart ='$id_cart'";
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

function uploadPhoto(){
    global $conn;
    global $decodedData;
	$target_dir = "../images/orders";
    $filename = rand() . "_"  . ".jpeg";
	$target_dir = $target_dir . "/" . $filename;
	$id = $_POST["id_order"];
	if(move_uploaded_file($_FILES['image']['tmp_name'], $target_dir)){
        $qry = "UPDATE final_order  SET image='$filename' WHERE id_order ='$id'";
		if (mysqli_query($conn, $qry)) {
            $MESSAGE = "Image Uploaded Successfully." ;
        }else{
            $MESSAGE = mysqli_error() ;
        }
        header('Content-Type: application/json');
		echo json_encode($MESSAGE);
	}
}
