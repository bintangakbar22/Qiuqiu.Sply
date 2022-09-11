<?php
include('../connection.php');

if(function_exists($_GET['method'])) {
    $_GET['method']();
};

function get(){
    global $conn;
    $id = $_GET['id'];
    $sql1 = mysqli_query($conn,"SELECT * from user WHERE id_user='$id'");
    $check =mysqli_num_rows($sql1);
    if($check!=0){
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
        $message = "User does not exist";
        $response = array(
            'status' => 'Failed',
            "message" => $message
        );
    }
    echo json_encode($response);
}

function update(){
    global $conn;
    global $decodedData;
    $id= $decodedData['id_user'];
    $full_name= $decodedData['full_name'];
    $email= $decodedData['email'];
    $phone_number= $decodedData['phone_number'];
    $address= $decodedData['address'];
    $city= $decodedData['city'];
    date_default_timezone_set('Asia/Jakarta');
    $timestamp = time();
    $formatted = date('Y-m-d H:i:s ', $timestamp);
    $sql1 = mysqli_query($conn,"SELECT * FROM user WHERE email ='$email' AND id_user!='$id'");
    $check = mysqli_num_rows($sql1);

    if($check){
        $message="Email already exists";
        $response = array(
            'status' => 'Failed',
            "message" => $message
        );
    }else{
        $qry2 = "UPDATE user SET  full_name='$full_name', email='$email', phone_number='$phone_number', 
                    address='$address', city='$city',updatedAt='$formatted'  WHERE id_user ='$id'";
        $sql2 = mysqli_query($conn,$qry2);
        if($sql2){
            $message ="Success";
            $sql3 = mysqli_query($conn,"SELECT * FROM user WHERE id_user='$id'");
            while($data = mysqli_fetch_array($sql3)) {
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
            $response = array(
                'status' => 'OK',
                'data' => $item,
                "message" => $message
            );
        }else{
            $message ="Change Profile Failed";
            $response = array(
                'status' => 'OK',
                "message" => $message
            );
        }
    }


    header('Content-Type: application/json');
    echo json_encode($response);

}

function uploadPhoto(){
    global $conn;
    global $decodedData;
	$target_dir = "../images/user";
    $filename = rand() . "_"  . ".jpeg";
	$target_dir = $target_dir . "/" . $filename;
	$id = $_POST["id_user"];
	if(move_uploaded_file($_FILES['image']['tmp_name'], $target_dir)){
        $qry = "UPDATE user  SET image='$filename' WHERE id_user ='$id'";
		if (mysqli_query($conn, $qry)) {
            $MESSAGE = "Image Uploaded Successfully." ;
        }else{
            $MESSAGE = mysqli_error() ;
        }
        header('Content-Type: application/json');
		echo json_encode($MESSAGE);
	}
}