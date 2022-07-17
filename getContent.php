<?php
$datadir = '/projets/cygwin/srv/www/htdocs/processing/data';
$data = [];

if ($_SERVER["REQUEST_METHOD"] == "POST"){
    $type = $_POST["type"];
    if (isset($type) && !empty($type)){
        if ($type == "listcsv"){
            foreach(scandir(realpath($datadir)) as $value){
                if (substr($value,-4) === ".csv"){
                    array_push($data, $value);
                }
            }
        }
        else{
            if ($file = fopen(realpath($datadir."/".$type), "r")) {
                while(($line = fgets($file)) !== false) {
                    $line = trim($line);
                    if ($line != "")
                        array_push($data, explode(",", trim($line)));
                }
                fclose($file);
            }
        }
    }
}

echo(json_encode($data));