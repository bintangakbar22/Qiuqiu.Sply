<?php
include('../connection.php');

$full_name = $decodedData['full_name'];
$email = $decodedData['email'];
$password = md5($decodedData['password']);
$phone_number = $decodedData['phone_number'];
$address = $decodedData['address'];
$image = "";
$city = $decodedData['city'];
 date_default_timezone_set('Asia/Jakarta');
    $timestamp = time();
    $formatted = date('Y-m-d H:i:s ', $timestamp);
$sql1 = mysqli_query($conn,"SELECT * from user WHERE email='$email'");
$check = mysqli_num_rows($sql1);
if($check){
    $message="Email already exists";
    $response = array(
        'status' => 'Failed',
        "message" => $message
    );
}else{
    $query = "INSERT INTO user (full_name,email,password,phone_number,address,image,city,createdAt,updatedAt) VALUES ('$full_name','$email','$password','$phone_number','$address','$image','$city','$formatted','$formatted')";
    $sql2 = mysqli_query($conn,$query);
    if($sql2){
        $message ="Success";
    }else{
        $message ="Failed";
    }
    $response = array(
        'status' => 'OK',
        "message" => $message
    );
}

echo json_encode($response);
