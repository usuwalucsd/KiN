<?php
// get the data from the POST message
$post_data = json_decode(file_get_contents('php://input'), true);
$filename = $data['filename'];

$data = $post_data['filedata'];
// generate a unique ID for the file, e.g., session-6feu833950202 
$file = uniqid("session-");
// the directory "data" must be writable by the server
// $name = "data/{$file}.json"; 
$filename = "data/{$data['filename']}.json";

// write the file to disk
// file_put_contents($name, $data);

file_put_contents($filename, $filedata);

?>