<?php

$dom = $_GET["domain"];

  $handle = fopen("/var/www/stats.csv", "r");
  $found = 0;
  while(($data = fgetcsv($handle)) !== FALSE) {

   if($dom == $data[0]) {
    print(json_encode($data));
    $found = 1;
    break;
   }
  }
  fclose($handle);

  if($found == 0) {

   $dome = escapeshellarg($dom);
   exec("/var/www/phantomjs/bin/phantomjs /var/www/phantomscript.js " . $dome . " /var/www//stats.csv");

$handle = fopen("/var/www/stats.csv", "r");
while(($data = fgetcsv($handle)) !== FALSE) {

  if($dom == $data[0]) {
    print(json_encode($data));
    break;
  }
}
  }
/*
 */
 ?>

