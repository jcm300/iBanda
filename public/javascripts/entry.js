$(()=> {
    $("#upButton").click(e => {
        e.preventDefault()
        var formData = new FormData()
        formData.append("file",$("#file")[0].files[0])
        formData.append("desc",$("#desc").val())
        $.ajax({
            type: "PUT",
            enctype: "form/multipart",
            processData: false,
            contentType: false,
            url: url + "entries/" + $("#entry_id").val(),
            data: formData,
            success: redirect => window.location.href = redirect,
            error: e => alert(JSON.stringify(e))
        })
    })

    $("#delete").click( e => {
        e.preventDefault()
        $.ajax({
            type: "DELETE",
            contentType: "application/json",
            url: url + "entries/" + $("#delete").val(),
            success: redirect => window.location.href = redirect,
            error: e => alert(JSON.stringify(e))
        })
    })
})