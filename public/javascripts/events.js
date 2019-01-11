var url = "http://localhost:3000/"

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
                    for(var i=0; i<results.length; i++)
                        $("#l").append("<a href=" + url + "events/" + results[i]._id + ">" +
                                       "<li>" + 
                                       "<p><b>Title:</b> " + results[i].title + "</p>" +
                                       "<p><b>Description:</b> " + (results[i].desc ? results[i].desc : "---") + "</p>" +
                                       "<p><b>Local:</b> " + (results[i].local ? results[i].local : "---") + "</p>" +
                                       "<p><b>Begin:</b> " + results[i].startDate + " <b>H:</b> " + results[i].startHour + "</p>" +
                                       "<p><b>End:</b> " + results[i].endDate + " <b>H:</b> " + results[i].endHour + "</p>" +
                                       "</li></a>")
                    $("#eventsDay").append("</div>")
                },
                error: e => $("#eventsDay").append("<li>Erro: " + e + "</li>")
            })
        }
    })

})