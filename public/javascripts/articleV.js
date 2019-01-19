$(() => {
    $("#visible").click(e =>{
        e.preventDefault()
        $.ajax({
            type: "PUT",
            contentType: "application/json",
            url: url + "articles/visible/" + $("#article_id").val(),
            data: JSON.stringify({visible: "true"}),
            success: redirect => window.location.href = redirect,
            error: e => alert(JSON.stringify(e))
        })
    })
   
    $("#invisible").click(e =>{
        e.preventDefault()
        $.ajax({
            type: "PUT",
            contentType: "application/json",
            url: url + "articles/visible/" + $("#article_id").val(),
            data: JSON.stringify({visible: "false"}),
            success: redirect => window.location.href = redirect,
            error: e => alert(JSON.stringify(e))
        })
    })
})