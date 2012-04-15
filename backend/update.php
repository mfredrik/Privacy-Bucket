<?php

$webroot = "/var/www/";

$link = mysql_connect('localhost', 'wsj', 'wsj')
    or die('Could not connect: ' . mysql_error());
mysql_select_db('demo') or die('Could not select database');

$dom = $_GET["domain"];

$getquery = "SELECT * FROM demo.cache WHERE domain = '" . mysql_real_escape_string($dom) . "';";
$res = mysql_query($getquery);
$n = mysql_numrows($res);
$found = 0;
if($n > 0) {
  print(mysql_result($res,0,"demos"));
  $found = 1;
}

if($found == 0) {
  $handle = fopen($webroot . "stats.csv", "r");
  while(($data = fgets($handle)) !== FALSE) {

    $o = json_decode($data);
    if($o == null) {
      continue;
    }
    
    if($dom == $o->{'domain'}) {
      print(json_encode($o));
      
      $dom = mysql_real_escape_string($dom);
      $data = mysql_real_escape_string($data);
      
      $insertquery = "INSERT ignore INTO demo.cache(domain, demos) VALUES ('$dom','$data');";
      mysql_query($insertquery);
      
      $found = 1;
      break;
    }
    
  }
  fclose($handle);
}

if($found == 0) {
  
  $dome = escapeshellarg($dom);
  $tempf = tempnam('/tmp','stats');
  exec($webroot . "phantomjs/bin/phantomjs " . $webroot . "phantomscript.js " . $dome . " " . $tempf);
  
  $handle = fopen($tempf, "r");
  while(($data = fgets($handle)) !== FALSE) {

    $o = json_decode($data);
    if($o == null) {
      continue;
    }

    if($dom == $o->{'domain'}) {
      print(json_encode($o));

      $dom = mysql_real_escape_string($dom);
      $data = mysql_real_escape_string($data);

      $insertquery = "INSERT INTO demo.cache VALUES ('$dom','$data');";
      mysql_query($insertquery);

      $found = 1;
      break;
    }

  }

  fclose($handle);
  unlink($tempf);
}

/*
 */
 ?>

