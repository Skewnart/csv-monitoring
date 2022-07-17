


var displayerror = function (hasError, message = undefined){
    if (hasError){
        $("#errordiv").removeClass("invisible");
        $("#tablecontainer").addClass("invisible");

        $("#errordiv").html("<h1>"+message+"</h1>");
    }
    else {
        $("#errordiv").addClass("invisible");
        $("#tablecontainer").removeClass("invisible");

        $("#errordiv").html("");
    }
}

var getDatas = function(){
    if (!!requestedcsv){
        $.post("getContent.php", { "type" : requestedcsv },
            function(ret) {
                datas = JSON.parse(ret);
                if (datas.length == 0){
                    displayerror(true, "Le CSV n'existe plus ou est vide. Rechargement...");
                    requestedcsv = "";
                }
                else{
                    displayerror(false);
                    updateDatas(datas);
                }
            })
            .fail(function() {
              alert( "error" );
            }
        );
    }
};

var updateDatas = function(datas){
    let stepsno = 3;
    let colors = ["danger", "warning", "success"];

    let _states = [];
    $("#tablebody").find("tr").each(function(i){
        let serv = $($(this).find("th")[0]).html();
        
        let actual = datas.find(el => el[0] == serv);
        if (!!actual){
            let step = actual[1] == "STOP" ? 0 : (actual[1] == "REBOOT" ? 1 : 2);
            let value = 100 * step / (stepsno - 1);

            $($($(this).find("td")[0]).find("div")[0]).html(progressBarCreator(colors[step], step == stepsno - 1, value, actual[1]));
            _states.push([actual[0], actual[1]]);
        }
        else{
            $(this).remove();
        }
    });
    
    datas.forEach(element => {
        let actual = _states.find(el => el[0] == element[0]);

        if (!actual){
            let step = element[1] == "STOP" ? 0 : (element[1] == "REBOOT" ? 1 : 2);
            let value = 100 * step / (stepsno - 1);
    
            $("#tablebody").append(
                $("<tr></tr>").append(
                    $("<th></th>").attr("scope", "row").text(element[0])
                ).append(
                    $("<td></td>").append(
                        $("<div></div>").addClass("progress").append(progressBarCreator(colors[step], step == stepsno - 1, value, element[1])
                        )
                    )
                )
            );
        }
    });
};

var progressBarCreator = function(color, laststep, value, text){
    return $("<div></div").addClass("progress-bar bg-"+ color + (laststep ? "" : " progress-bar-striped progress-bar-animated")).css("width", value+"%").attr("role", "progressbar").attr("aria-valuenow", value+"").attr("aria-valuemin", "0").attr("aria-valuemax", "100").text(text);
};

var getList = function(){
    $.post( "getContent.php", { "type" : "listcsv" },
            function(ret) {
                let csvlist = JSON.parse(ret);
                updateList(csvlist);

                if (requestedcsv == ""){
                    if (csvlist.length == 0){
                        displayerror(true, "Aucun CSV disponible.");
                    }
                    else if (csvlist.length == 1){
                        requestedcsv = csvlist[0];
                        getDatas();
                    }
                    else{
                        displayerror(true, "Sélection en attente...");
                        modalcsv.show();
                    }
                }
            })
            .fail(function() {
              alert( "error" );
            }
        );
};

var updateList = function(csvlist){
    let _files = [];
    $("#modalcsvbody").find("a").each(function(i){
        let file = $(this).html();
        if(!csvlist.includes(file)){
            $(this).remove();
        }
        else{
            _files.push(file);
        }
    });

    csvlist.forEach(element => {
        if(!_files.includes(element))
        {
            $("#modalcsvbody").append($('<a>',{
            text: element,
            href: '#',
            class: "list-group-item list-group-item-action",
            click: function() {
                    requestedcsv = element;
                    getDatas();
                    modalcsv.hide();
                    return false;
                }
            }));
        }
    });
};

var requestedcsv = "";
var modalcsv = new bootstrap.Modal($("#modalcsv"));

$(function() {
    getList();

    setInterval(function(){
        getDatas();
    }, 4000);

    setInterval(function(){
        getList();
    }, 5000);
});
