<?php
$conn = mysqli_connect("localhost","root","","react_qiuqiusply");

$encodedData = file_get_contents('php://input');  
$decodedData = json_decode($encodedData, true);

date_default_timezone_set('Asia/Jakarta');
$timestamp = time();
$formatted = date('Y-m-d H:i:s ', $timestamp);

 
if (!$conn) {
    die("Koneksi Tidak Berhasil: " . mysqli_connect_error());
}
