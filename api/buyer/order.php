<?php
include('../connection.php');

if(function_exists($_GET['method'])) {
    $_GET['method']();
};


function post(){
    global $conn;
    global $decodedData;
    global $formatted;
    $id_product = $decodedData['id_product'];
    $id_buyer = $decodedData['id_buyer'];

    // $trimmed1 = str_replace('[', '', $id_product) ;
    // $trimmed2 = str_replace(']', '', $trimmed1) ;
    // $id_product = array_map('intval', explode(',', $trimmed2));
    
    foreach($id_product as $value){ //get id_seller from table product
            $sql3 = mysqli_query($conn,"SELECT * FROM product where id_product='$value'");
            $check3 = mysqli_num_rows($sql3);
            while($getProduct = mysqli_fetch_array($sql3)){
                $price = intval($getProduct['price']);
                $id_seller = $getProduct['id_user'];
            }
            $array_seller[]=$id_seller;
            $unique_seller = array_unique($array_seller);

    }
    foreach($unique_seller as $value2){ //insert into table orders
        $qry1 = "INSERT INTO  orders (id_buyer,id_seller,createdAt,updatedAt) VALUES 
                ('$id_buyer','$value2','$formatted','$formatted')";
        $sql1 = mysqli_query($conn,$qry1);
    }

    foreach($id_product as $value3){ // insert into table detail_order
        $sql2 = mysqli_query($conn,"SELECT * FROM product where id_product='$value3'");
        $check2 = mysqli_num_rows($sql2);
        while($getProduct = mysqli_fetch_array($sql2)){
            $price = intval($getProduct['price']);
            $id_seller = $getProduct['id_user'];
        }
        $qry3 = "INSERT INTO  detail_order (id_buyer,id_seller,id_product,price) VALUES ('$id_buyer','$id_seller','$value3',$price)";
        $sql3 = mysqli_query($conn,$qry3);
            $sqlUpdate = mysqli_query($conn,"UPDATE product set status='inOrder' WHERE id_product='$value3'");
            $sql7 = mysqli_query($conn,"INSERT INTO notification (id_user,id_product,receiver_id,status,type,createdAt,updatedAt) VALUES 
                    ('$id_buyer','$value3','$id_seller','pending','seller','$formatted','$formatted')"); //for seller
            $sql9 = mysqli_query($conn,"INSERT INTO notification (id_user,id_product,receiver_id,status,type,createdAt,updatedAt) VALUES 
                    ('$id_seller','$value3','$id_buyer','pending','buyer','$formatted','$formatted')"); //for buyer
    }

    $sql4 = mysqli_query($conn,"SELECT * FROM orders where createdAt='$formatted'");
    $check4 = mysqli_num_rows($sql4);
    while($getIdOrders = mysqli_fetch_array($sql4)){
        $id_order = $getIdOrders['id_order'];
        $id_seller = $getIdOrders['id_seller'];
        $sql5 = mysqli_query($conn,"UPDATE detail_order SET id_order='$id_order' WHERE createdAt='$formatted' AND id_seller='$id_seller'");
        $array_seller2[]=$id_seller;
        $sql6 = mysqli_query($conn,"SELECT SUM(price) as price FROM detail_order where  id_order='$id_order' ");
            $getFinalPrice = mysqli_fetch_array($sql6);
            $final_price = intval($getFinalPrice['price']);
            $sql6 = mysqli_query($conn,"INSERT INTO final_order (id_order,id_buyer,id_seller,final_price,createdAt,updatedAt) VALUES
                    ($id_order,$id_buyer,$id_seller,$final_price,'$formatted','$formatted')");
            $sql10 =mysqli_query($conn,"DELETE FROM cart WHERE id_user='$id_buyer'");
    }
        
        if($sql10){
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
   
        $id_buyer = $_GET['id_buyer'];
        $status = $_GET['status'];
        $sql1 = mysqli_query($conn,"SELECT * FROM final_order WHERE id_buyer='$id_buyer' AND status='$status' ORDER BY updatedAt DESC");
   
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
                $dataObj[] = mysqli_fetch_object($sql3);
                while($dataP = mysqli_fetch_array($sql3)){             
                        $product[] = array(
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
                        );
                }
            }   
            $item = array(
                'id' => intval($id_order),
                'Product' => $dataObj,
                'final_price' => intval($final_price)
            );
            $id_seller = $data['id_seller'];
            $sqlSeller = mysqli_query($conn,"SELECT * FROM user WHERE id_user='$id_seller'");
            $detailSeller=mysqli_fetch_object($sqlSeller);
        }
        $finalData = array(
            'Orders' => $item,
            "User" =>$detailSeller
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

