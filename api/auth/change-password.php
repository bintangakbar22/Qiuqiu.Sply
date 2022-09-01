<?php
include('../connection.php');

$id= $decodedData['id_user'];
$current_password = md5($decodedData['current_password']);
$new_password = $decodedData['new_password'];
$confirm_password = $decodedData['confirm_password'];
 date_default_timezone_set('Asia/Jakarta');
    $timestamp = time();
    $formatted = date('Y-m-d H:i:s ', $timestamp);

$sql1 = mysqli_query($conn,"SELECT * FROM user WHERE id_user='$id' AND password='$current_password'");
$check = mysqli_num_rows($sql1);

if(empty($check)){
    $message="Current Password is wrong";
    $response = array(
        'status' => 'Failed',
        "message" => $message
    );
}else{
    if($new_password==$confirm_password){
        $pass = md5($new_password);
        $query = "UPDATE user SET password='$pass',updatedAt='$formatted' WHERE id_user='$id'";
        $sql2 = mysqli_query($conn,$query);
        if($sql2){
            $message ="Success";
        }else{
            $message ="Change password failed";
        }
        $response = array(
            'status' => 'OK',
            "message" => $message
        );
    }else{
        $message ="New password and confirm password not match!";
        $response = array(
            'status' => 'OK',
            "message" => $message
        );
    }
}


echo json_encode($response);
