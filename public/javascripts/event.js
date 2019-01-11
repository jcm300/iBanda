var url = "http://localhost:3000/"

function validateForm(){
    var form = document.forms["form"]
    if(form.checkValidity()){
        if(form["startDate"].value > form["endDate"].value){
            alert("End Date before Start Date!")
            return false
        }else{
            if(form["startDate"].value == form["endDate"].value){
                if(form["startHour"].value > form["endHour"].value){
                    alert("End Hour before Start Hour!")
                    return false
                }else return true
            }else return true
        }
    }else return false
}

$(()=> {
    $("#upButton").click(e => {
        if(validateForm()){
            e.preventDefault()
            var contentRaw = $("#form").serializeArray()
            var content = {} 
            $.map(contentRaw, function(n, i){
                content[n['name']] = n['value'];
            })
            $.ajax({
                type: "PUT",
                contentType: "application/json",
                url: url + "events/" + $("#event_id").val(),
                data: JSON.stringify(content),
                success: redirect => window.location.href = redirect,
                error: e => alert(JSON.stringify(e))
            })
        }
    })

    $("#delete").click( e => {
        e.preventDefault()
        $.ajax({
            type: "DELETE",
            contentType: "application/json",
            url: url + "events/" + $("#delete").val(),
            success: redirect => window.location.href = redirect,
            error: e => alert(JSON.stringify(e))
        })
    })
})