$(()=> {

    $("#date").change(e => {
        var date = $("#date").val()
        if(date!=""){
            $("#l").remove();
            e.preventDefault()
            $.ajax({
                type: "GET",
                contentType: "application/json",
                url: url + "api/event/date/" + date,
                success: results => {
                    $("#eventsDay").append("<div id=\"l\">") 
                    for(var i=0; i<results.length; i++){
                        $("#l").append("<a class=\"w3-btn w3-block w3-hover-black\" href=" + url + "events/" + results[i]._id + ">" +
                                       "<li id=\"li"+ i + "\">" + 
                                            "<p id=\"title" + i + "\"" + "><b>Title:</b> ")
                                                $("#title" + i).append(document.createTextNode(results[i].title))
                                            $("#li" + i).append("<p id=\"desc" + i + "\" style=\"white-space:pre\"><b>Description:</b><br>")
                                                $("#desc" + i).append((results[i].desc ? document.createTextNode(results[i].desc) : "---"))
                                            $("#li" + i).append("<p id=\"local" + i + "\"><b>Local:</b> ")
                                                $("#local" + i).append((results[i].local ? document.createTextNode(results[i].local) : "---"))
                                            $("#li" + i).append("<p id=\"begin" + i + "\"><b>Begin:</b> ")
                                                $("#begin" + i).append(document.createTextNode(results[i].startDate))
                                                $("#begin" + i).append(" <b>H:</b> ")
                                                $("#begin" + i).append(document.createTextNode(results[i].startHour))
                                            $("#li" + i).append("<p id=\"end" + i + "\"><b>End:</b> ")
                                                $("#end" + i).append(document.createTextNode(results[i].endDate))
                                                $("#end" + i).append(" <b>H:</b> ")
                                                $("#end" + i).append(document.createTextNode(results[i].endHour))
                    }
                },
                error: e => $("#eventsDay").append("<div id=\"l\"><li>Erro: " + e + "</li></div>")
            })
        }
    })

})