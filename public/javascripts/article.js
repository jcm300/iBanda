$(() => {

    //limit date input to atual day
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        
        if(dd < 10){
            dd = '0' + dd
        } 
        
        if(mm < 10){
            mm = '0' + mm
        } 
        
        today = yyyy + '-' + mm + '-' + dd;
        document.getElementById("date").setAttribute("max", today);
    //

    $("#addAuthor").click(e => {
        e.preventDefault()
        $("#authorsZone").append("<br><input type=\"text\" name=\"authors\" required>")
    })

    $("#addTopic").click(e => {
        e.preventDefault()
        $("#topicsZone").append("<br><input type=\"text\" name=\"topics\" required>")
    })

    $("#removeAuthor").click(e => {
        e.preventDefault()
        var zone = document.getElementById("authorsZone")
        if(zone.children.length > 4) {
            zone.removeChild(zone.lastChild)
            zone.removeChild(zone.lastChild)
        }
    })

    $("#removeTopic").click(e => {
        e.preventDefault()
        var zone = document.getElementById("topicsZone")
        if(zone.children.length > 4) {
            zone.removeChild(zone.lastChild)
            zone.removeChild(zone.lastChild)
        }
    })

    $("#upButton").click(e => {
        e.preventDefault()
        var contentRaw = $("#formUpdate").serializeArray()
        var content = {} 
        content["authors"] = []
        content["topics"] = []
        $.map(contentRaw, function(n, i){
            if(n['name']=="authors" || n['name']=="topics") content[n['name']].push(n['value'])
            else content[n['name']] = n['value'];
        })
        $.ajax({
            type: "PUT",
            contentType: "application/json",
            url: url + "articles/" + $("#article_id").val(),
            data: JSON.stringify(content),
            success: redirect => window.location.href = redirect,
            error: e => alert(JSON.stringify(e))
        })
    })
})