$(() => {

    //limit date input to atual day
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        
        if(dd < 10){
            dd = '0' + dd
        } 
        
        if(mm < 10){
            mm = '0' + mm
        } 
        
        today = yyyy + '-' + mm + '-' + dd;
        document.getElementById("date").setAttribute("max", today);
    //

    $("#addAuthor").click(e => {
        e.preventDefault()
        $("#authorsZone").append("<br><input type=\"text\" name=\"authors\" required>")
    })

    $("#addTopic").click(e => {
        e.preventDefault()
        $("#topicsZone").append("<br><input type=\"text\" name=\"topics\" required>")
    })
})