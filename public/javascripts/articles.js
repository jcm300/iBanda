function printList(list, tag, index){
    var textN
    for(var i=0; i<list.length-1; i++){
        textN = document.createTextNode(list[i])
        //TODO: fix - javascript injection in textN.textContent
        $("#" + tag + index).append("<a id=\"" + tag + index + "-" + i + "\" href=" + url + "articles/" + tag + "/" + textN.textContent + ">")
        $("#" + tag + index + "-" + i).append(textN)
        $("#" + tag + index).append(", ")
    }
    var last = list.length-1  
    textN = document.createTextNode(list[last]) 
    //TODO: fix - javascript injection in textN.textContent
    $("#" + tag + index).append("<a id=\"" + tag + index + "-" + last + "\" href=" + url + "articles/" + tag + "/" + textN.textContent + ">")
    $("#" + tag + index + "-" + last).append(textN)
}

function printNews(results){
    $("#news").append("<div id=\"l\">") 
    for(var i=0; i<results.length; i++){
        $("#l").append("<li id=\"li" + i + "\">" + 
                            "<p><b>Title:</b> " +
                            "<a id=\"title" + i + "\" href=" + url + "articles/" + results[i]._id + ">")
                                $("#title" + i).append(document.createTextNode(results[i].title))
                            $("#li" + i).append("<p id=\"subtitle" + i + "\"><b>Subtitle:</b> ")
                                $("#subtitle" + i).append(results[i].subtitle ? document.createTextNode(results[i].subtitle) : "---")
                            $("#li" + i).append("<p id=\"date" + i + "\"><b>Date:</b> ")
                                $("#date" + i).append(document.createTextNode(results[i].date))
                            $("#li" + i).append("<p id=\"authors" + i + "\"><b>Authors:</b> ")
                                if(results[i].authors[0]) printList(results[i].authors, "authors", i)
                                else $("#authors" + i).append("---")
                            $("#li" + i).append("<p id=\"body" + i + "\" style=\"white-space:pre\">")
                                $("#body" + i).append(document.createTextNode(results[i].body))
                            $("#li" + i).append("<p id=\"topics" + i + "\"><b>Topics:</b> ")
                                if(results[i].topics[0]) printList(results[i].topics, "topics", i)
                                else $("#topics" + i).append("---")
    }
}

$(() => {

    $("#l").remove()
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: url + "api/article",
        success: results => printNews(results),
        error: e => $("#news").append("<div id=\"l\"><li>Erro: " + e + "</li></div>")
    })

    $("#date").change(e => {
        var date = $("#date").val()
        e.preventDefault()
        $("#l").remove()
        if(date!=""){
            $.ajax({
                type: "GET",
                contentType: "application/json",
                url: url + "api/article/date/" + date,
                success: results => printNews(results),
                error: e => $("#news").append("<div id=\"l\"><li>Erro: " + e + "</li></div>")
            })
        }else{
            $.ajax({
                type: "GET",
                contentType: "application/json",
                url: url + "api/article",
                success: results => printNews(results),
                error: e => $("#news").append("<div id=\"l\"><li>Erro: " + e + "</li></div>")
            })
        }
    })
})