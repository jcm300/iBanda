$(()=> {
    $("#l").remove();
    $("#eventsDay").append("<div id=\"l\"></div>")
    $("#l").load(url + "events/list")

    $("#date").change(e => {
        var date = $("#date").val()
        e.preventDefault()
        $("#l").remove();
        $("#eventsDay").append("<div id=\"l\"></div>")
        if(date!="") $("#l").load(url + "events/list/" + date)
        else $("#l").load(url + "events/list")
    })
})