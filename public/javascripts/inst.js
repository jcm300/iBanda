$(() => {
        $("#upButton").click(e => {
        e.preventDefault()
        var formData = new FormData()
        formData.append("file",$("#file")[0].files[0])
        formData.append("name",$("#name").val())
        formData.append("score.voice",$("#voice").val())
        formData.append("score.clave",$("#clave").val())
        formData.append("score.tune",$("#tune").val())
        formData.append("score.path",$("#path").val())
        $.ajax({
            type: "PUT",
            enctype: "form/multipart",
            processData: false,
            contentType: false,
            url: url + "pieces/updInst?idP=" + $("#piece_id").val() + "&idI=" + $("#inst_id").val(),
            data: formData,
            success: redirect => window.location.href = redirect,
            error: e => alert(JSON.stringify(e))
        })
    })
})