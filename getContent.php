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
            //On prend uniquement la première occurence d'un même serveur (pour éviter les doublons)
            //On garde donc le nom des serveurs jusqu'à fin de traitement
                $serv_names = [];
                while(($line = fgets($file)) !== false) {
                    $line = trim($line);
                    if ($line != "")
                    {
                        $srv_name = explode(',',$line)[0];
                        if (!in_array($srv_name, $serv_names)){
                            array_push($serv_names, $srv_name);
                            array_push($data, explode(",", trim($line)));
                        }
                    }
                }
                fclose($file);
            }
        }
    }
}

echo(json_encode($data));