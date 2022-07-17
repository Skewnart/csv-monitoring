$ diff -u processing.org/js/functions.js processing/js/functions.js
--- processing.org/js/functions.js      2022-01-29 16:35:14.000000000 +0100
+++ processing/js/functions.js  2022-07-10 22:10:58.193310500 +0200
@@ -1,4 +1,7 @@
-var displayerror = function (hasError, message = undefined){
+
+
+
+var displayerror = function (hasError, message = undefined){
     if (hasError){
         $("#errordiv").removeClass("invisible");
         $("#tablecontainer").addClass("invisible");
@@ -15,7 +18,7 @@

 var getDatas = function(){
     if (!!requestedcsv){
-        $.post("/getContent.php", { "type" : requestedcsv },
+        $.post("getContent.php", { "type" : requestedcsv },
             function(ret) {
                 datas = JSON.parse(ret);
                 if (datas.length == 0){
@@ -48,7 +51,8 @@
             let value = 100 * step / (stepsno - 1);

             $($($(this).find("td")[0]).find("div")[0]).html(progressBarCreator(colors[step], step == stepsno - 1, value, actual[1]));
-            _states.push([actual[0], actual[1]]);
+            $($($(this).find("td")[1]).html(actual[2]));
+            _states.push([actual[0], actual[1], actual[2]]);
         }
         else{
             $(this).remove();
@@ -58,19 +62,15 @@
     datas.forEach(element => {
         let actual = _states.find(el => el[0] == element[0]);

+       // Affichage la premiere fois
         if (!actual){
             let step = element[1] == "STOP" ? 0 : (element[1] == "REBOOT" ? 1 : 2);
             let value = 100 * step / (stepsno - 1);

-            $("#tablebody").append(
-                $("<tr></tr>").append(
-                    $("<th></th>").attr("scope", "row").text(element[0])
-                ).append(
-                    $("<td></td>").append(
-                        $("<div></div>").addClass("progress").append(progressBarCreator(colors[step], step == stepsno - 1, value, element[1])
-                        )
-                    )
-                )
+            $("#tablebody").append($("<tr></tr>")
+               .append($("<th></th>").attr("scope", "row").text(element[0]))
+               .append($("<td></td>").append($("<div></div>").addClass("progress").append(progressBarCreator(colors[step], step == stepsno - 1, value, element[1]))))
+               .append($("<td></td>").append(element[2]))
             );
         }
     });
@@ -81,7 +81,7 @@
 };

 var getList = function(){
-    $.post( "/getContent.php", { "type" : "listcsv" },
+    $.post( "getContent.php", { "type" : "listcsv" },
             function(ret) {
                 let csvlist = JSON.parse(ret);
                 updateList(csvlist);

$ diff -u processing.org/index.html processing/index.html
--- processing.org/index.html   2022-01-28 19:48:04.000000000 +0100
+++ processing/index.html       2022-07-10 22:26:25.268931000 +0200
@@ -1,6 +1,6 @@
 <html>
     <head>
-        <link rel="stylesheet" type="text/css" href="/css/bootstrap.min.css"/>
+        <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css"/>
     </head>
     <body>
         <div class="container-fluid">
@@ -20,8 +20,9 @@
                 <table class="table">
                     <thead>
                         <tr>
-                            <th scope="col">Serveur</th>
-                            <th scope="col">Etape</th>
+                            <th scope="col">Serveurs</th>
+                            <th scope="col">Etapes</th>
+                            <th scope="col">Commentaires</th>
                         </tr>
                     </thead>
                     <tbody id="tablebody"></tbody>
@@ -43,8 +44,8 @@
             </div>
         </div>

-        <script type="text/javascript" src="/js/jquery-3.6.0.min.js"></script>
-        <script type="text/javascript" src="/js/bootstrap.min.js"></script>
-        <script type="text/javascript" src="/js/functions.js"></script>
+        <script type="text/javascript" src="js/jquery-3.6.0.min.js"></script>
+        <script type="text/javascript" src="js/bootstrap.min.js"></script>
+        <script type="text/javascript" src="js/functions.js"></script>
     </body>
 </html>

$

