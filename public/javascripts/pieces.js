function filter() {
    var input, filter, ul, li, p, a;
    
    input = document.getElementById("input");
    filter = input.value.toUpperCase();
    ul = document.getElementById("pieces");
    li = ul.getElementsByTagName("li");
    
    for (var i = 0; i < li.length; i++) {
        p = li[i].getElementsByTagName("p");
        txtValue = p[0].textContent.substring(7) || p[0].innerText.substring(7);
        
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}