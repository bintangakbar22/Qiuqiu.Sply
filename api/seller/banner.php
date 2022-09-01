<?php
include('../connection.php');

$sql1 = mysqli_query($conn,"SELECT * from banner ");
if($sql1){
    while($data = mysqli_fetch_array($sql1)) {
        $item[]=array(
            "id" =>$data["id_banner"],
            "name" =>$data["name"],
            "image_url" =>$data["image"],
        );
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
        'status' => 'Failed',
        "message" => $message
    );
}
echo json_encode($response);