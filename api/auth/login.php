<?php
include('../connection.php');

$email = $decodedData['email'];
$password = md5($decodedData['password']);

$sql1 = mysqli_query($conn,"SELECT * FROM user WHERE email='$email' AND password='$password'");
$check = mysqli_num_rows($sql1);
if(!empty($check)){
    while($data = mysqli_fetch_array($sql1)) {
        $item=array(
            "id" =>$data["id_user"],
            "full_name" =>$data["full_name"],
            "email" =>$data["email"],
            "password" =>$data["password"],
            "phone_number" =>$data["phone_number"],
            "address" =>$data["address"],
            "image_url" =>$data["image"],
            "city" =>$data["city"],
            "createdAt" =>$data["createdAt"],
            "updatedAt" =>$data["updatedAt"],
        );
    }
    $message = "Success";
    $response = array(
        'status' => 'OK',
        'data' => $item,
        "message" => $message
    );
}else{
    $message = "email or password are wrong";
    $response = array(
        'status' => 'Failed',
        "message" => $message
    );
}

echo json_encode($response);


