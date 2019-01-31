function filter() {
    var input, filter, ul, li, p, a;
    
    input = document.getElementById("input");
    filter = input.value.toUpperCase();
    ul = document.getElementById("news");
    li = ul.getElementsByTagName("li");
    
    for (var i = 0; i < li.length; i++) {
        p = li[i].getElementsByTagName("p");
        a = p[0].getElementsByTagName("a"); 
        txtValue = a[0].textContent || a[0].innerText;
        
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

$(() => {
    $('#input').val('')
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