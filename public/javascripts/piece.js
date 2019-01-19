$(()=> {
    $("#upButton").click(e => {
        e.preventDefault()
        var contentRaw = $("#formUpdate").serializeArray()
        var content = {} 
        content['instruments'] = []
        var aux = {}
        var auxIn = 0
        $.map(contentRaw, function(n, i){
            if(n['name']=="_id"){
                aux[n['name']] = n['value']
                auxIn=1
            }else{
                if(n['name']=="score.path"){
                    aux[n['name']] = n['value']
                    content['instruments'].push(aux)
                    aux = {}
                    auxIn=0 
                }else{
                    if(auxIn==1) aux[n['name']] = n['value']
                    else content[n['name']] = n['value']
                }
            }
        })
        $.ajax({
            type: "PUT",
            contentType: "application/json",
            url: url + "pieces/" + $("#piece_id").val(),
            data: JSON.stringify(content),
            success: redirect => window.location.href = redirect,
            error: e => alert(JSON.stringify(e))
        })
    })

    $("#delete").click( e => {
        e.preventDefault()
        $.ajax({
            type: "DELETE",
            contentType: "application/json",
            url: url + "pieces/" + $("#delete").val(),
            success: redirect => window.location.href = redirect,
            error: e => alert(JSON.stringify(e))
        })
    })
})