$(() => {
    $("#l").remove()
    $("#news").append("<div id=\"l\"></div>")
    $("#l").load(url + "articles/list")

    $("#date").change(e => {
        var date = $("#date").val()
        e.preventDefault()
        $("#l").remove()
        $("#news").append("<div id=\"l\"></div>")
        if(date!="") $("#l").load(url + "articles/list/" + date) 
        else $("#l").load(url + "articles/list") 
    })
})